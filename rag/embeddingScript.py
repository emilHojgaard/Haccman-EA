from sentence_transformers import SentenceTransformer
import psycopg2

# model = SentenceTransformer("bert-base-nli-mean-tokens")  # a BERT embedding variant
# text = "The hero finds the sword in the northern cave..."
# embedding = model.encode([text])[0].tolist()

# Insert into Supabase (or Postgres directly)
# cur.execute(
#   "insert into docs (embedding, content, url) values (%s, %s, %s)",
#   (embedding, text, "/game/chapter1")
# )

#Test embedding script

def main():
    model = SentenceTransformer("bert-base-nli-mean-tokens")  # load embedding model
    text = "The hero finds the sword in the northern cave..."
    embedding = model.encode([text])[0].tolist()
    
    print("Text:", text)
    print("Embedding length:", len(embedding))
    print("First 10 values:", embedding[:10])  # preview

if __name__ == "__main__":
    main()
