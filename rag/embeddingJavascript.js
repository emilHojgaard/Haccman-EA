import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

// ----- env -----
const {
  OPENAI_KEY,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  JOURNALS_DIR = "patient_journals",
  DISEASES_DIR = "disease_docs",
  NURSING_TASKS_DIR = "nursing_tasks",
  NURSING_GUIDELINES_DIR = "nursing_guidelines",
  MEDICAL_GUIDELINES_DIR = "medical_guidelines",
  OPENAI_EMBED_MODEL = "text-embedding-3-small",
} = process.env;

if (!OPENAI_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing env vars. Required: OPENAI_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

// ----- clients -----
const openai = new OpenAI({ apiKey: OPENAI_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  db: { schema: "RAG" },
});

// ----- helpers -----
async function listTxtFiles(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".txt"))
      .map((e) => path.join(dir, e.name));
  } catch (err) {
    if (err.code === "ENOENT") {
      console.warn(`Directory not found: ${dir} (skipping)`);
      return [];
    }
    throw err;
  }
}

function titleFromPath(p) {
  const dir = path.basename(path.dirname(p));         // e.g. "nursing_tasks"
  const file = path.basename(p, path.extname(p));      // e.g. "IV_Infusion_Setup"
  return `${dir}_${file}`;                             // -> "nursing_tasks_IV_Infusion_Setup"
}

// Split into sections (e.g., "Subjective:", "Objective:", "Overview:", etc.)
function chunkBySection(text) {
  // Split at a newline followed by a capitalized word and colon
  const parts = text.split(/\n(?=[A-Z][A-Za-z\s/()'-]*:)/g);

  return parts.map((s) => s.trim()).filter(Boolean);
}

// Batch embedder
async function embedBatch(texts) {
  if (texts.length === 0) return [];
  const res = await openai.embeddings.create({
    model: OPENAI_EMBED_MODEL,
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}

async function upsertDocument({ title, fullText, confidential }) {
  const { data, error } = await supabase
    .from("documents")
    .insert({
      title,
      full_text: fullText,
      url: null,
      confidential,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

async function insertChunks(docId, chunks) {
  const BATCH = 64;
  for (let start = 0; start < chunks.length; start += BATCH) {
    const batch = chunks.slice(start, start + BATCH);
    const vecs = await embedBatch(batch);

    const rows = batch.map((text_chunk, idx) => ({
      doc_id: docId,
      text_chunk,
      embedding: vecs[idx],
      chunk_index: start + idx,
    }));

    const { error } = await supabase.from("chunks").insert(rows);
    if (error) {
      throw new Error(
        `Insert chunks failed at batch starting ${start}: ${error.message || error}`
      );
    }
    console.log(`  Inserted ${rows.length} chunks (through ${start + rows.length})`);
  }
}

async function run() {
  // 1) Collect files from both folders
  const journalFiles = await listTxtFiles(JOURNALS_DIR);
  const diseaseFiles = await listTxtFiles(DISEASES_DIR);
  const nursingTaskFiles = await listTxtFiles(NURSING_TASKS_DIR);
  const nursingGuidelineFiles = await listTxtFiles(NURSING_GUIDELINES_DIR);
  const medicalGuidelineFiles = await listTxtFiles(MEDICAL_GUIDELINES_DIR);

  if (journalFiles.length === 0 && diseaseFiles.length === 0 && nursingTaskFiles.length === 0 && nursingGuidelineFiles.length === 0 && medicalGuidelineFiles.length === 0) {
    console.warn("No .txt files found in the given directories.");
    return;
  }

  // Build a single work list with metadata
  const work = [
    ...journalFiles.map((p) => ({ path: p, confidential: true })),
    ...diseaseFiles.map((p) => ({ path: p, confidential: false })),
    ...nursingTaskFiles.map((p) => ({ path: p, confidential: false })),
    ...nursingGuidelineFiles.map((p) => ({ path: p, confidential: false })),
    ...medicalGuidelineFiles.map((p) => ({ path: p, confidential: false })),
  ];

  console.log(
    `Found ${journalFiles.length} journal files, ${diseaseFiles.length} disease files, ${nursingTaskFiles.length} nursing task files, ${nursingGuidelineFiles.length} nursing guideline files, ${medicalGuidelineFiles.length} medical guideline files.`
  );

  // 2) Process each file
  for (const { path: filePath, confidential } of work) {
    try {
      const title = titleFromPath(filePath);
      const fullText = await fs.readFile(filePath, "utf-8");

      // Insert document row with title and confidential flag
      const docId = await upsertDocument({ title, fullText, confidential });
      console.log(`Created document ${docId} for "${title}" (confidential=${confidential})`);

      // Chunk
      const chunks = chunkBySection(fullText);
      console.log(`  Chunked "${title}" into ${chunks.length} chunks`);

      // Embed + insert chunks
      await insertChunks(docId, chunks);
    } catch (err) {
      console.error(`Error processing file "${filePath}":`, err);
    }
  }

  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
