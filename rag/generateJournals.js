// generateJournals.js
// Generates N detailed, fictional patient journals into ./patient_journals
// Usage:
//   node generateJournals.js              -> default 150
//   node generateJournals.js 40           -> 40 files
//   JOURNAL_COUNT=60 node generateJournals.js -> 60 files
//
// Output format uses colon headers for chunking:
// Document Information, Medical History & Prior Results, Chief Complaint, History of Present Illness, Physical Examination,
// Diagnostics (Today), Assessment, Plan, Patient Education & Safety Net,
// Follow-up & Disposition, Sign-off
//
// ⚠️ Fictional content for a game. Not for clinical use.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- Utilities --------------------
const OUT_DIR = path.join(__dirname, "patient_journals");

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rint = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const safe = (s) => s.replace(/[^a-z0-9]/gi, "_");

// Random realistic date (YYYY-MM-DD) between minISO and maxISO
function randomDateBetweenISO(minISO, maxISO) {
    const start = new Date(minISO).getTime();
    const end = new Date(maxISO).getTime();
    const t = Math.random() * (end - start) + start;
    return new Date(t).toISOString().slice(0, 10);
}

// Random realistic date (YYYY-MM-DD) between 2023-01-01 and today
function randomDateISO(minISO = "2023-01-01") {
    const start = new Date(minISO).getTime();
    const end = Date.now();
    const t = Math.random() * (end - start) + start;
    return new Date(t).toISOString().slice(0, 10);
}

// Danish-like CPR: DDMMYY-XXXX (no checksum validation; fictional)
function fakeCPR() {
    const year = rint(1930, 2008); // adult-ish range
    const y2 = String(year).slice(-2);
    const month = String(rint(1, 12)).padStart(2, "0");
    const day = String(rint(1, 28)).padStart(2, "0"); // simple valid day
    const suffix = String(rint(0, 9999)).padStart(4, "0");
    return `${day}${month}${y2}-${suffix}`;
}

// Year helper bounded by encounter year
function randPastYear(encounterISO, minYear = 1980) {
    const encYear = new Date(encounterISO).getFullYear();
    const hi = Math.max(minYear, encYear - 1);
    return rint(minYear, hi);
}

// Date within N months before encounter date
function dateBeforeEncounter(encounterISO, monthsBackMin = 1, monthsBackMax = 12) {
    const enc = new Date(encounterISO);
    const m = rint(monthsBackMin, monthsBackMax);
    const minDate = new Date(enc);
    minDate.setMonth(minDate.getMonth() - m);
    const minISO = minDate.toISOString().slice(0, 10);
    const maxISO = new Date(enc.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    return randomDateBetweenISO(minISO, maxISO);
}

// -------------------- Pools --------------------
const firstNames = [
    "Anders", "Mette", "Jonas", "Kirsten", "Lars", "Sanne", "Peter", "Camilla", "Thomas", "Nina",
    "Rasmus", "Grethe", "Christian", "Lene", "Brian", "Helle", "Maja", "Søren", "Ida", "Frederik",
    "Julie", "Morten", "Anja", "Ole", "Birgit", "Emil", "Tina", "Viggo", "Solveig", "Carsten",
    "Maria", "Sebastian", "Katrine", "Henrik", "Louise", "Niklas", "Anne", "Rune", "Sofia", "Magnus"
];

const lastNames = [
    "Nielsen", "Hansen", "Larsen", "Madsen", "Pedersen", "Sørensen", "Kristensen", "Jensen", "Rasmussen", "Thomsen",
    "Poulsen", "Christensen", "Mortensen", "Olsen", "Andersen", "Iversen", "Mikkelsen", "Holm", "Bæk", "Laursen",
    "Petersen", "Johansen", "Knudsen", "Østergaard", "Gram", "Bjørk", "Dam", "Thygesen", "Skov", "Bang", "Lund"
];

function patientName() {
    return `${rand(firstNames)} ${rand(lastNames)}`;
}

const doctors = [
    "Dr. H. Sørensen, Internal Medicine", "Dr. L. Holm, Cardiology", "Dr. P. Jensen, Psychiatry",
    "Dr. S. Nielsen, Pulmonology", "Dr. A. Thomsen, Emergency Medicine", "Dr. J. Knudsen, ENT",
    "Dr. M. Petersen, Gastroenterology", "Dr. R. Iversen, Neurology", "Dr. C. Mikkelsen, Endocrinology",
    "Dr. K. Østergaard, General Surgery", "Dr. V. Laursen, Nephrology", "Dr. T. Bæk, Infectious Diseases",
    "Dr. E. Dam, Rheumatology", "Dr. S. Gram, Hematology", "Dr. O. Bjørk, Urology"
];
const authorName = () => rand(doctors);

// Tiny helpers to vary vitals/phrasing
const vitals = () => ({
    HR: rint(58, 118),
    RR: rint(12, 26),
    BPsys: rint(98, 168),
    BPdia: rint(58, 98),
    Temp: (36 + Math.random() * 2.3).toFixed(1),
    SpO2: rint(92, 100),
});

// -------------------- Medical History & Prior Results --------------------
const dxPool = [
    "Hypertension", "Iron Deficiency", "Type 2 Diabetes", "Asthma", "COPD",
    "Heart failure (HFpEF)", "Heart failure (HFrEF)", "CKD", "Dyslipidemia",
    "Peptic ulcer disease", "GERD", "Depression", "Anxiety", "Migraine",
    "Osteoarthritis", "Hypothyroidism", "Atrial fibrillation", "Obesity",
    "Irritable bowel syndrome", "Gout", "Gallstones", "Psoriasis", "Osteoporosis"
];

const medPool = [
    "Ramipril 5 mg daily", "Lisinopril 10 mg daily", "Amlodipine 5 mg daily",
    "Metformin 500 mg BID", "Empagliflozin 10 mg daily", "Atorvastatin 20 mg nightly",
    "Ferrous sulfate 100 mg every other day", "Pantoprazole 40 mg daily",
    "Furosemide 40 mg daily", "Bisoprolol 5 mg daily", "Levothyroxine 75 µg daily"
];

// Use em dashes instead of colons in this block
const consultTemplates = [
    (d) => `${d} — Routine check-up — stable BP, mild anemia noted.`,
    (d) => `${d} — Follow-up for anemia — improved fatigue after iron therapy.`,
    (d) => `${d} — Medication review — adherence reinforced, no adverse effects reported.`,
    (d) => `${d} — Respiratory review — inhaler technique optimized, symptoms improved.`,
    (d) => `${d} — Heart failure clinic — diuretic adjusted, weight trending down.`,
];

function buildMedicalHistoryBlock(encounterISO) {
    // Past Diagnoses
    const dxCount = rint(2, 4);
    const pool = [...dxPool];
    const dxItems = [];
    for (let i = 0; i < dxCount && pool.length; i++) {
        const idx = rint(0, pool.length - 1);
        dxItems.push(`${pool.splice(idx, 1)[0]} (${randPastYear(encounterISO)})`);
    }
    if (Math.random() < 0.6) dxItems.push("Chronic lower back pain");

    // Recent Lab Results date (within 1–3 months)
    const labsDate = dateBeforeEncounter(encounterISO, 1, 3);
    const hb = (6.5 + Math.random() * 2.0).toFixed(1); // mmol/L
    const ferritin = rint(8, 150);                      // µg/L
    const crp = rint(1, 25);                            // mg/L
    const creat = rint(55, 110);                        // µmol/L
    const hbFlag = Number(hb) < 7.5 ? " (low)" : "";
    const ferritinFlag = ferritin < 15 ? " (low)" : "";
    const crpFlag = "";     // keep simple
    const creatFlag = "";   // keep simple

    // Prior Consultations (two items, 3–12 months back)
    const c1 = consultTemplates[rint(0, consultTemplates.length - 1)](dateBeforeEncounter(encounterISO, 3, 12));
    const c2 = consultTemplates[rint(0, consultTemplates.length - 1)](dateBeforeEncounter(encounterISO, 3, 12));

    // Medications (2–4)
    const medsPool = [...medPool];
    const medCount = rint(2, 4);
    const meds = [];
    for (let i = 0; i < medCount && medsPool.length; i++) {
        meds.push(medsPool.splice(rint(0, medsPool.length - 1), 1)[0]);
    }

    // Allergies
    const allergies = Math.random() < 0.8 ? "None known." : rand([
        "Penicillin (rash).", "ACE inhibitors (cough).", "NSAIDs (dyspepsia)."
    ]);

    const lines = [];
    lines.push("Medical History & Prior Results:");
    lines.push(`- Past Diagnoses — ${dxItems.join(", ")}.`);
    lines.push(`- Recent Lab Results (${labsDate})`);
    lines.push(`    Hb ${hb} mmol/L${hbFlag}`);
    lines.push(`    Ferritin ${ferritin} µg/L${ferritinFlag}`);
    lines.push(`    CRP ${crp} mg/L${crpFlag}`);
    lines.push(`    Creatinine ${creat} µmol/L${creatFlag}`);
    lines.push(`- Prior Consultations`);
    lines.push(`    - ${c1}`);
    lines.push(`    - ${c2}`);
    lines.push(`- Medications — ${meds.join(", ")}.`);
    lines.push(`- Allergies — ${allergies}`);
    lines.push("");
    return lines;
}

// -------------------- Condition Templates --------------------
const conditions = [
    {
        tag: "Iron-Deficiency Anemia",
        cc: (n) => `${n} reports fatigue, reduced exercise tolerance, and occasional lightheadedness.`,
        hpi: (n) =>
            `${n} notes weeks of progressive tiredness and exertional dyspnea. Diet is low in iron-rich foods; denies obvious bleeding but reports intermittent dyspepsia with NSAID use. No black stools observed at home.`,
        exam: () => {
            const v = vitals();
            return `Pale conjunctivae; soft systolic flow murmur; no focal deficits. Vitals stable (BP ${v.BPsys}/${v.BPdia} mmHg, HR ${v.HR} bpm). Abdomen soft, non-tender.`;
        },
        dx: () => `Hb low with microcytosis, low ferritin, and reduced transferrin saturation. Stool testing and GI evaluation considered if no dietary cause identified.`,
        assessment: `Microcytic anemia most consistent with iron deficiency; source evaluation warranted (dietary vs occult GI blood loss).`,
        plan: [
            `Start oral iron with vitamin C; discuss GI side effects and adherence strategies (alternate-day dosing if needed).`,
            `Review NSAID exposure and consider gastroprotection or alternatives.`,
            `Arrange GI work-up if poor response or red flags emerge (e.g., melena, weight loss).`
        ],
        education: `Explain expected timeline for symptom improvement and iron store repletion. Advise on iron-rich foods and to seek care for black stools, severe dizziness, or chest pain.`,
        followup: () => `Recheck Hb and ferritin in ${rint(6, 8)} weeks; earlier review if symptoms worsen.`
    },
    {
        tag: "Community-Acquired Pneumonia",
        cc: (n) => `${n} complains of fever, productive cough, and right-sided chest pain.`,
        hpi: (n) =>
            `${n} developed a sudden cough with green sputum ${rint(2, 6)} days ago, followed by fevers and pleuritic pain. Increased breathlessness when climbing stairs; no recent travel.`,
        exam: () => {
            const v = vitals();
            return `Febrile (${v.Temp} °C), RR ${v.RR}/min, SpO₂ ${v.SpO2}% on room air. Crackles and bronchial breath sounds over the right lower zone; no peripheral edema.`;
        },
        dx: () => `CXR shows right lower lobe consolidation. CRP elevated; WBC mildly raised. Consider sputum culture if severe or atypical features.`,
        assessment: `Community-acquired pneumonia, lobar pattern, clinically stable for ward/ambulatory care depending on scores.`,
        plan: [
            `Start empiric antibiotics per local protocol; provide antipyretics and hydration.`,
            `Titrate oxygen to target saturations and encourage early mobilization and incentive spirometry.`,
            `Review response within 48–72 hours; escalate if hypoxemia or sepsis criteria develop.`
        ],
        education: `Discuss contagious period, cough hygiene, and gradual return to activity. Reinforce smoking cessation and vaccination where applicable.`,
        followup: () => `Safety check in ${rint(2, 3)} days if outpatient; clinical review in ${rint(1, 2)} weeks to ensure recovery.`
    },
    // ... (unchanged remaining condition templates)
    {
        tag: "Type 2 Diabetes – Hyperglycemia Visit",
        cc: (n) => `${n} reports thirst, frequent urination, and blurred vision.`,
        hpi: (n) =>
            `${n} has several weeks of polyuria, polydipsia, and fatigue. Diet has been irregular during recent work stress; missed evening doses twice last week. No abdominal pain or vomiting.`,
        exam: () => {
            const v = vitals();
            return `Vitals: BP ${v.BPsys}/${v.BPdia} mmHg, HR ${v.HR} bpm. Dry mucous membranes; otherwise normal exam; no focal deficits.`;
        },
        dx: () => `Capillary glucose elevated; ketones negative or trace; no acidosis on venous blood gas. HbA1c ordered for control assessment.`,
        assessment: `Poor glycemic control without DKA. Medication adherence and lifestyle contributors likely.`,
        plan: [
            `Reinforce medication schedule; consider adding or adjusting therapy per plan.`,
            `Hydration guidance and sick-day rules; check for precipitating infection.`,
            `Arrange diabetes education and home glucose monitoring review.`
        ],
        education: `Review hypoglycemia recognition and treatment. Encourage regular meals, activity, and sleep hygiene to stabilize control.`,
        followup: () => `Clinic follow-up in ${rint(2, 4)} weeks to assess response and review HbA1c.`
    },
    // (Keep all other condition objects exactly as before)
];

// -------------------- Builder --------------------
function buildEntry() {
    const cond = rand(conditions);
    const name = patientName();
    const encounterDate = randomDateISO();
    const author = authorName();

    const lines = [];
    lines.push("Document Information:");
    lines.push(`CPR-number - ${fakeCPR()}`);
    lines.push(`Encounter Date - ${encounterDate}`);
    lines.push(`Author - ${author}`);
    lines.push(`Patient Name - ${name}`);
    lines.push("");

    // Medical History & Prior Results (no colons in subsections)
    lines.push(...buildMedicalHistoryBlock(encounterDate));

    lines.push("Chief Complaint:");
    lines.push(cond.cc(name));
    lines.push("");

    lines.push("History of Present Illness:");
    lines.push(cond.hpi(name));
    lines.push("");

    lines.push("Physical Examination:");
    lines.push(cond.exam());
    lines.push("");

    lines.push("Diagnostics (Today):");
    lines.push(cond.dx());
    lines.push("");

    lines.push("Assessment:");
    lines.push(cond.assessment);
    lines.push("");

    lines.push("Plan:");
    for (const p of cond.plan) lines.push(`- ${p}`);
    lines.push("");

    lines.push("Patient Education & Safety Net:");
    lines.push(cond.education);
    lines.push("");

    lines.push("Follow-up & Disposition:");
    lines.push(cond.followup());
    lines.push("");

    lines.push("Sign-off:");
    lines.push(author);
    lines.push("");

    return lines.join("\n");
}

// -------------------- Main --------------------
const argCount = Number(process.argv[2]);
const envCount = Number(process.env.JOURNAL_COUNT);
const COUNT = Number.isFinite(argCount) && argCount > 0
    ? Math.floor(argCount)
    : (Number.isFinite(envCount) && envCount > 0 ? Math.floor(envCount) : 150);

// Fresh output directory
if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

// Write files
for (let i = 1; i <= COUNT; i++) {
    fs.writeFileSync(path.join(OUT_DIR, `journal${i}.txt`), buildEntry(), "utf8");
}
console.log(`Generated ${COUNT} detailed journal files in ${OUT_DIR}`);
