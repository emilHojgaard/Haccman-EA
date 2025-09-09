import psycopg2
from sentence_transformers import SentenceTransformer
from cunkingScript import sentence_chunker 

#importing journal
with open("journal.txt", "r", encoding="utf-8") as f:
    journal = f.read()

#  Connect to Supabase (Postgres)
conn = psycopg2.connect(
    "postgresql://postgres.yqroigcevcoddsmangyg:Haccman1234@aws-1-eu-north-1.pooler.supabase.com:6543/postgres"
)
cur = conn.cursor()


# Insert the full doc once
cur.execute(
    "insert into \"RAG\".documents (title, full_text, url) values (%s, %s, %s) returning id",
    (None, journal, None)
)
doc_id = cur.fetchone()[0]

# Chunk the text
chunks = sentence_chunker(journal, sentences_per_chunk=3)

#embedding model
model=SentenceTransformer("bert-base-nli-mean-tokens") 

#  For each chunk: embed + insert
for i, chunk in enumerate(chunks):
    emb = model.encode([chunk])[0].tolist()  # a list[float], suitable for pgvector
    cur.execute(
        "INSERT INTO \"RAG\".chunks (doc_id, text_chunk, embedding, chunk_index) VALUES (%s, %s, %s, %s)",
        (doc_id, chunk, emb, i),
    )

conn.commit()
cur.close()
conn.close()
print(f"Inserted document {doc_id} with {len(chunks)} chunks")