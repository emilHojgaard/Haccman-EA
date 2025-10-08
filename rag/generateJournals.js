// generateJournals.js
// Generates N detailed, fictional patient journals into ./patient_journals
// Usage:
//   node generateJournals.js              -> default 150
//   node generateJournals.js 40           -> 40 files
//   JOURNAL_COUNT=60 node generateJournals.js -> 60 files
//
// Output format uses colon headers for chunking:
// Document Information, Chief Complaint, History of Present Illness, Physical Examination,
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
const coin = (p = 0.5) => Math.random() < p;

const safe = (s) => s.replace(/[^a-z0-9]/gi, "_");

// Random realistic date (YYYY-MM-DD) between 2023-01-01 and today
function randomDateISO(minISO = "2023-01-01") {
    const start = new Date(minISO).getTime();
    const end = Date.now();
    const t = Math.random() * (end - start) + start;
    return new Date(t).toISOString().slice(0, 10);
}

// Danish-like CPR: dd.mm.yy-xxxx (no checksum validation; fictional)
function fakeCPR() {
    const year = rint(1930, 2008); // adult-ish range
    const y2 = String(year).slice(-2);
    const month = String(rint(1, 12)).padStart(2, "0");
    const day = String(rint(1, 28)).padStart(2, "0"); // simple valid day
    const suffix = String(rint(0, 9999)).padStart(4, "0");
    return `${day}.${month}.${y2}-${suffix}`;
}

// -------------------- Pools --------------------
const firstNames = [
    "Anders", "Mette", "Jonas", "Kirsten", "Lars", "Sanne", "Peter", "Camilla", "Thomas", "Nina",
    "Rasmus", "Grethe", "Christian", "Lene", "Brian", "Helle", "Maja", "Søren", "Ida", "Frederik",
    "Julie", "Morten", "Anja", "Ole", "Birgit", "Emil", "Tina", "Viggo", "Solveig", "Carsten",
    "Maria", "Sebastian", "Katrine", "Henrik", "Louise", "Niklas", "Anne", "Rune", "Sofia", "Magnus"
];
const lastInitials = ["N.", "H.", "L.", "M.", "P.", "S.", "K.", "J.", "R.", "T.", "B.", "C.", "D.", "E.", "F.", "G.", "O.", "V.", "W.", "Å."];

function patientName() {
    return `${rand(firstNames)} ${rand(lastInitials)}`;
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

// -------------------- Condition Templates --------------------
// Each condition provides disease-specific content blocks.
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
    {
        tag: "Acute Low Back Pain (Mechanical)",
        cc: (n) => `${n} presents with lower back pain after lifting at work.`,
        hpi: (n) =>
            `Pain began ${rint(1, 5)} days ago after lifting. Achy, worse with flexion, improved by rest. Denies fever, weight loss, saddle anesthesia, or bladder/bowel dysfunction.`,
        exam: () => `Localized paraspinal tenderness; normal lower limb strength and reflexes; negative straight-leg raise bilaterally. No spinal tenderness.`,
        dx: () => `No red flags; imaging not indicated at this time. Baseline analgesia plan established.`,
        assessment: `Acute mechanical low back pain without radicular features.`,
        plan: [
            `Recommend activity as tolerated, heat, and simple analgesia with short course of NSAIDs if appropriate.`,
            `Provide core-strength and flexibility exercises; avoid bed rest.`,
            `Reassess if neurological deficits develop or pain persists.`
        ],
        education: `Explain typical recovery within weeks and importance of gradual return to activity. Review lifting technique and workplace ergonomics.`,
        followup: () => `Follow-up in ${rint(3, 6)} weeks or sooner if red flags arise.`
    },
    {
        tag: "Heart Failure Exacerbation (HFrEF)",
        cc: (n) => `${n} reports worsening ankle swelling and breathlessness on exertion.`,
        hpi: (n) =>
            `${n} notes ${rint(4, 10)} days of increasing dyspnea, orthopnea requiring ${rint(2, 4)} pillows, and weight gain of ${rint(2, 4)} kg. Missed diuretics twice last week.`,
        exam: () => {
            const v = vitals();
            return `BP ${v.BPsys}/${v.BPdia} mmHg, HR ${v.HR} bpm; bibasal crackles, elevated JVP surrogate, bilateral pitting edema to mid-shins.`;
        },
        dx: () => `BNP elevated; CXR shows pulmonary congestion; creatinine and electrolytes checked before diuretic titration.`,
        assessment: `Acute decompensated systolic heart failure likely precipitated by nonadherence and dietary salt.`,
        plan: [
            `Optimize loop diuretics and review guideline-directed therapy (ACEi/ARB/ARNI, beta-blocker, MRA, SGLT2) as tolerated.`,
            `Strict fluid/salt guidance and daily weights; educate on early warning signs.`,
            `Assess triggers and arrange heart failure clinic referral.`
        ],
        education: `Teach weight monitoring (call if +2 kg in 3 days), fluid/salt limits, and medication adherence. Encourage vaccination and activity pacing.`,
        followup: () => `Recheck in ${rint(1, 2)} weeks for weights, symptoms, and labs.`
    },
    {
        tag: "Acute Migraine",
        cc: (n) => `${n} complains of throbbing unilateral headache with nausea and light sensitivity.`,
        hpi: (n) =>
            `Headache started ${rint(6, 24)} hours ago, gradual build, similar to prior migraines. Triggered by sleep loss and stress; no focal neurological symptoms.`,
        exam: () => `Normal neurological exam; neck supple; photophobia noted. Vitals stable.`,
        dx: () => `Clinical diagnosis consistent with prior migraine; no red flags. Consider pregnancy test if applicable and imaging only if atypical.`,
        assessment: `Recurrent migraine without aura; current moderate–severe attack.`,
        plan: [
            `Low-stimulus environment; administer antiemetic and triptan/NSAID per plan.`,
            `Hydration and rest; consider preventive strategy review if attack frequency rising.`,
            `Provide rescue plan for future attacks.`
        ],
        education: `Discuss trigger diary, sleep regularity, and limits on acute medication days to avoid rebound.`,
        followup: () => `Primary care/neurology follow-up in ${rint(2, 4)} weeks to evaluate need for prophylaxis.`
    },
    {
        tag: "Urinary Tract Infection (Cystitis) – Adult Female",
        cc: (n) => `${n} has dysuria, urinary frequency, and suprapubic discomfort.`,
        hpi: (n) =>
            `Symptoms began ${rint(1, 3)} days ago after sexual activity; no flank pain or fever. Prior UTI ${rint(6, 18)} months ago.`,
        exam: () => `Afebrile; abdomen soft; suprapubic tenderness mild; no CVA tenderness.`,
        dx: () => `Urinalysis positive for leukocytes/nitrites. Culture sent if atypical features present or recurrent.`,
        assessment: `Uncomplicated lower UTI.`,
        plan: [
            `Start short-course antibiotic per local guidance; provide analgesia.`,
            `Hydration advice and timed voiding; discuss prophylaxis options if recurrent.`
        ],
        education: `Explain expected improvement within 48 hours and to return for fever, flank pain, or worsening symptoms.`,
        followup: () => `Phone check in ${rint(2, 3)} days if culture pending or symptoms persist.`
    },
    {
        tag: "Sciatica (Lumbar Radiculopathy)",
        cc: (n) => `${n} reports shooting pain from lower back down the posterior leg.`,
        hpi: (n) =>
            `Pain radiates below the knee, worse with coughing and sitting. No bowel/bladder dysfunction; no saddle anesthesia.`,
        exam: () => `Positive straight-leg raise on affected side; mild sensory changes in dermatomal pattern; motor and reflexes largely intact.`,
        dx: () => `Imaging deferred initially; MRI if red flags or no improvement after conservative therapy.`,
        assessment: `Lumbar radiculopathy consistent with sciatica.`,
        plan: [
            `NSAIDs if appropriate, paced activity, and core-strength physiotherapy.`,
            `Consider neuropathic agents for severe pain; avoid prolonged bed rest.`
        ],
        education: `Reassure about typical recovery and red flags that require urgent review (weakness, bladder/bowel changes).`,
        followup: () => `Re-evaluate in ${rint(4, 6)} weeks or sooner if deficits develop.`
    },
    {
        tag: "Gastroenteritis (Viral, Suspected)",
        cc: (n) => `${n} presents with nausea, vomiting, and watery diarrhea.`,
        hpi: (n) =>
            `Symptoms began ${rint(1, 2)} days ago after a family gathering. No blood in stool; tolerating small sips of fluid; minimal abdominal cramping.`,
        exam: () => {
            const v = vitals();
            return `Mild dehydration (dry mucosa); abdomen soft, non-tender; vitals: HR ${v.HR} bpm, BP ${v.BPsys}/${v.BPdia} mmHg, afebrile to low-grade fever.`;
        },
        dx: () => `Clinical diagnosis; stool studies not indicated unless severe, prolonged, or high-risk features.`,
        assessment: `Acute viral gastroenteritis with mild dehydration risk.`,
        plan: [
            `Oral rehydration with small frequent sips; simple diet advancement as tolerated.`,
            `Antiemetic as needed; avoid antimotility agents if red flags develop.`
        ],
        education: `Emphasize hand hygiene and isolation while symptomatic. Return if unable to keep fluids, blood in stool, or signs of severe dehydration.`,
        followup: () => `Symptom check by phone in ${rint(2, 3)} days if not improved.`
    },
    {
        tag: "Deep Vein Thrombosis (Suspected)",
        cc: (n) => `${n} reports unilateral calf swelling after recent long-haul travel.`,
        hpi: (n) =>
            `Gradual onset calf aching and swelling without trauma. No prior VTE; on combined risk due to immobility.`,
        exam: () => `Calf circumference asymmetry ${rint(2, 4)} cm; warmth and tenderness present; no skin discoloration proximally.`,
        dx: () => `D-dimer if low pretest probability; venous duplex ultrasound arranged. Baseline creatinine reviewed for anticoagulant choice.`,
        assessment: `Suspected DVT with travel risk factor.`,
        plan: [
            `Consider empiric anticoagulation if high suspicion and no contraindications while awaiting imaging.`,
            `Leg elevation and ambulation with caution; counsel on bleeding precautions.`
        ],
        education: `Discuss VTE risks, warning signs of PE (chest pain, sudden breathlessness), and the importance of adherence if anticoagulation is started.`,
        followup: () => `Imaging today; treatment plan finalized same day or at next business day review.`
    },
    {
        tag: "Upper GI Bleed (Non-Variceal, Suspected)",
        cc: (n) => `${n} presents with black stools and lightheadedness; recent NSAID use.`,
        hpi: (n) =>
            `Melena noticed over ${rint(1, 3)} days with fatigue and dizziness on standing. No hematemesis; intermittent epigastric discomfort.`,
        exam: () => {
            const v = vitals();
            return `Pale; orthostatic symptoms; HR ${v.HR} bpm. Abdomen soft with mild epigastric tenderness; no peritonism.`;
        },
        dx: () => `Hb low relative to baseline; type and crossmatch sent. Plan for urgent endoscopy after stabilization; BUN may be elevated.`,
        assessment: `Probable non-variceal upper GI bleed, likely peptic in origin.`,
        plan: [
            `Resuscitation as indicated; high-dose PPI infusion/therapy per protocol.`,
            `Hold NSAIDs/anticoagulants when safe; arrange endoscopy; monitor hemoglobin and hemodynamics.`
        ],
        education: `Explain fasting, procedure expectations, and to report fresh bleeding, dizziness, or syncope immediately.`,
        followup: () => `Endoscopy within ${rint(0, 1)}–${rint(1, 2)} days depending on stability; outpatient review in ${rint(2, 4)} weeks.`
    },
    // Add more templates here as desired…
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
// Determine how many journals to create
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
