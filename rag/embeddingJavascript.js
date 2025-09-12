import fs from "fs/promises";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
// import 'dotenv/config';


// ----- env -----
const {
    OPENAI_KEY,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    JOURNALS = ["journal1.txt", "journal2.txt", "journal3.txt", "journal4.txt", "journal5.txt", "journal6.txt", "journal7.txt", "journal8.txt", "journal9.txt", "journal10.txt", "journal11.txt"],
} = process.env;

if (!OPENAI_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing env vars. Required: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

// ----- clients -----
const openai = new OpenAI({ apiKey: OPENAI_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    db: { schema: "RAG" },
});

// ----- simple chunker (length-based with optional overlap) -----
function chunkText(text, maxLen = 800, overlap = 100) {
    const chunks = [];
    let i = 0;
    while (i < text.length) {
        const end = Math.min(i + maxLen, text.length);
        let piece = text.slice(i, end);

        // try not to cut in the middle of a word
        if (end < text.length) {
            const lastSpace = piece.lastIndexOf(" ");
            if (lastSpace > maxLen * 0.6) piece = piece.slice(0, lastSpace);
        }
        chunks.push(piece.trim());
        i += Math.max(piece.length - overlap, 1);
    }
    return chunks.filter(Boolean);
}

// ----- batch embedder -----
async function embedBatch(texts) {
    const res = await openai.embeddings.create({
        model: "text-embedding-3-small", // 1536 dims
        input: texts,
    });
    // keep order
    return res.data.map((d) => d.embedding);
}

async function run() {
    for (const journal of JOURNALS) {// 1) read file
        const fullText = await fs.readFile(journal, "utf-8");

        // 2) create document
        const { data: docRow, error: docErr } = await supabase
            .from("documents")
            .insert({ title: null, full_text: fullText, url: null })
            .select("id")
            .single();
        if (docErr) {
            console.error("Insert document failed:", docErr);
            process.exit(1);
        }
        const docId = docRow.id;
        console.log("Created document:", docId);

        // 3) chunk
        const chunks = chunkText(fullText, 800, 100);
        console.log(`Chunked into ${chunks.length} chunks`);

        // 4) embed in batches and insert
        const BATCH = 64;
        for (let start = 0; start < chunks.length; start += BATCH) {
            const batch = chunks.slice(start, start + BATCH);
            const vecs = await embedBatch(batch); // one API call for the batch

            const rows = batch.map((text_chunk, idx) => ({
                doc_id: docId,
                text_chunk,
                embedding: vecs[idx],
                chunk_index: start + idx,
            }));

            const { error } = await supabase.from("chunks").insert(rows);
            if (error) {
                console.error("Insert chunks failed at batch", start, ":", error);
                process.exit(1);
            }
            console.log(`Inserted ${rows.length} chunks (through ${start + rows.length})`);
        }

    }

    console.log(" Done.");
}

run().catch((e) => {
    console.error(e);
    process.exit(1);
});
