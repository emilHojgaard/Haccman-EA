// test_detect_intent.mjs
import { detectIntent } from "./detectIntent.js";

const tests = [
    // --- HYBRID (default / general info) ---
    { msg: "what is sepsis?", expect: "hybrid" },
    { msg: "treatment for acute pancreatitis", expect: "hybrid" },
    { msg: "oxygen therpy titration guidance", note: "typo -> hybrid", expect: "hybrid" },

    // --- FULL RETRIEVAL (explicit) ---
    { msg: "retrieve full journal12", expect: "full" },
    { msg: "give me the entire journal-45", expect: "full" },
    { msg: "open the complete patient record of Thomas R.", expect: "full" },
    { msg: "show whole journal 7", expect: "full" },
    { msg: "fetch journal102", expect: "full" },             // identity alone => full

    // CPR triggers (your generator format)
    { msg: "open record 14.03.85-1234", expect: "full" },
    { msg: "retrieve 12031990-0007", expect: "hybrid" },
    { msg: "retrieve 120390-0007", expect: "full" },
    { msg: "full text for 0101901234", expect: "hybrid" },

    // --- SUMMARY (specific doc + summary intent) ---
    { msg: "summarize journal12", expect: "summary" },
    { msg: "brief overview of Acute_Cholecystitis", expect: "summary" },
    { msg: "tl;dr for Atrial_Fibrillation__AF_", expect: "summary" },

    // --- DOC TITLE “category” matches (should still prefer hybrid if not explicit) ---
    { msg: "asthma overview", expect: "hybrid" },
    { msg: "migraine outline", expect: "hybrid" },

    // --- Edge-ish phrasing ---
    { msg: "print entire journal 3", expect: "full" },
    { msg: "download complete record of Mette P.", expect: "full" },
    { msg: "short summary for journal-88", expect: "summary" },

    // --- Typos / fuzzy ---
    { msg: "summurize journal1", expect: "summary" },        // typo in "summarize"
    { msg: "retrive full jornal 9", expect: "full" },        // multiple typos
    { msg: "sepssis treatmnt", expect: "hybrid" },

    // --- No signal (should default to hybrid) ---
    { msg: "hi", expect: "hybrid" },
];

function run() {
    const rows = tests.map((t, i) => {
        const res = detectIntent(t.msg);
        return {
            "#": i + 1,
            message: t.msg,
            expected: t.expect,
            detected: res?.mode ?? "(none)",
            pass: (res?.mode ?? "") === t.expect,
        };
    });

    // Pretty print
    console.table(rows);

    // Simple exit code for CI-ish use
    const failed = rows.filter(r => !r.pass).length;
    if (failed > 0) {
        console.error(`\n❌ ${failed} test(s) failed.`);
        process.exit(1);
    } else {
        console.log("\n✅ All tests passed.");
        process.exit(0);
    }
}

run();
