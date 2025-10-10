const diseaseDocsList = ["Acute_Cholecystitis",
    "Acute_Coronary_Syndrome__NSTEMI_Unstable_Angina_",
    "Acute_Kidney_Injury__AKI_",
    "Acute_Pancreatitis",
    "Anaphylaxis",
    "Appendicitis",
    "Asthma",
    "Atrial_Fibrillation__AF_",
    "Cellulitis",
    "Chronic_Kidney_Disease__CKD_",
    "Chronic_Obstructive_Pulmonary_Disease__COPD_",
    "Community_Acquired_Pneumonia",
    "COVID_19__Acute_",
    "Deep_Vein_Thrombosis__DVT_",
    "Diabetic_Ketoacidosis__DKA_",
    "Epilepsy",
    "Heart_Failure_with_Preserved_Ejection_Fraction__HFpEF_",
    "Heart_Failure_with_Reduced_Ejection_Fraction__HFrEF_",
    "Ischemic_Stroke__Acute_",
    "Migraine",
    "Osteoarthritis__Knee_Hip_",
    "Peptic_Ulcer_Disease",
    "Primary_Hypertension__High_Blood_Pressure_",
    "Pulmonary_Embolism__PE_",
    "Pyelonephritis__Kidney_Infection_",
    "Seasonal_Influenza",
    "Sepsis__Adult_",
    "Spontaneous_Pneumothorax",
    "Upper_Gastrointestinal_Bleed__UGIB_",
    "Viral_Gastroenteritis__Stomach_Flu_"
]
const nursingGuidelinesList = [
    "Acute_Cholecystitis",
    "Acute_Coronary_Syndrome__NSTEMI_UA_",
    "Acute_Kidney_Injury__AKI_",
    "Acute_Pancreatitis",
    "Anaphylaxis",
    "Appendicitis__Acute_",
    "Asthma",
    "Atrial_Fibrillation__New_Onset_",
    "Cellulitis__Non_purulent_",
    "Chronic_Kidney_Disease__CKD____Adult",
    "Chronic_Obstructive_Pulmonary_Disease__COPD_",
    "Community_Acquired_Pneumonia",
    "COVID_19__Adult__Acute_",
    "Deep_Vein_Thrombosis__DVT_",
    "Diabetic_Ketoacidosis__DKA_",
    "Epilepsy__Seizure_Care_in_ED_",
    "Heart_Failure__Acute_Decompensation_",
    "Ischemic_Stroke__Acute_",
    "Major_Depressive_Disorder__Adult_",
    "Migraine__Acute_Care_",
    "Osteoarthritis__Knee_Hip_",
    "Primary_Hypertension__Adult_",
    "Prostate_Cancer__Initial_Care_",
    "Pulmonary_Embolism__PE_",
    "Pyelonephritis__Acute_",
    "Seasonal_Influenza__Adult_",
    "Sepsis__Adult_",
    "Spontaneous_Pneumothorax",
    "Upper_Gastrointestinal_Bleed__UGIB_",
    "Viral_Gastroenteritis__Adult_"
]
const nursingTasksList = [
    "12_Lead_ECG_Acquisition",
    "Blood_Glucose_Monitoring__POC_",
    "Central_Line_Care__Maintenance___Dressing_Change_",
    "Enteral_Feeding__Via_NG_PEG__Initiation___Care",
    "Falls_Risk_Assessment___Prevention",
    "In_Hospital_Transfer__Bed_to_Bed_Handover_",
    "Medication_Administration__5_Rights___2_",
    "Nasogastric__NG__Tube_Insertion",
    "Noninvasive_Ventilation__NIV__Setup___Care",
    "Oxygen_Therapy__Titration___Device_Selection_",
    "Pain_Assessment___Management__Adult_Inpatient_",
    "Palliative_Care__Comfort_Measures",
    "Peripheral_IV_Cannulation__PVC__Insertion",
    "Peripheral_IV_Removal",
    "Pressure_Injury_Prevention_Bundle",
    "Rapid_Response_Activation__Deteriorating_Patient_",
    "Specimen_Collection__Venipuncture__Phlebotomy_",
    "Subcutaneous_Insulin_Administration",
    "Transfusion_Administration__Packed_RBCs_",
    "Urinary_Catheterization__Indwelling__Aseptic_Technique_",
    "Wound_Care__Simple_Surgical___Traumatic_",
]
const medicalGuidelinesList = [
    "Acute_Cholecystitis",
    "Acute_Coronary_Syndrome__NSTEMI_Unstable_Angina_",
    "Acute_Kidney_Injury__AKI_",
    "Acute_Pancreatitis",
    "Anaphylaxis",
    "Appendicitis__Acute_",
    "Asthma",
    "Atrial_Fibrillation__AF____New_Onset",
    "Cellulitis__Non_purulent_",
    "Chronic_Kidney_Disease__CKD____Adult",
    "Chronic_Obstructive_Pulmonary_Disease__COPD_",
    "Community_Acquired_Pneumonia",
    "COVID_19__Adult__Acute_",
    "Deep_Vein_Thrombosis__DVT_",
    "Diabetic_Ketoacidosis__DKA_",
    "Epilepsy__Seizure_Management_in_ED_",
    "Heart_Failure__Acute_Decompensation_",
    "Ischemic_Stroke__Acute_",
    "Major_Depressive_Disorder__Adult_",
    "Migraine__Acute_Management_",
    "Osteoarthritis__Knee_Hip_",
    "Primary_Hypertension__Adult_",
    "Prostate_Cancer__Overview_of_Initial_Management_",
    "Pulmonary_Embolism__PE_",
    "Pyelonephritis__Acute_",
    "Seasonal_Influenza__Adult_",
    "Sepsis__Adult_",
    "Spontaneous_Pneumothorax",
    "Upper_Gastrointestinal_Bleed__UGIB_",
    "Viral_Gastroenteritis__Adult_"
];

const allDocTitles = diseaseDocsList.concat(nursingGuidelinesList, nursingTasksList, medicalGuidelinesList);

/** Normalize text for robust matching (case + accents). */
function normalizeText(s) {
    return (s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, ""); // Søren -> soren
}

/** Small Levenshtein edit distance (good for short keywords). */
function levenshtein(a, b) {
    a = normalizeText(a); b = normalizeText(b);
    const m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const dp = Array.from({ length: m + 1 }, (_, i) => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,       // deletion
                dp[i][j - 1] + 1,       // insertion
                dp[i - 1][j - 1] + cost // substitution
            );
        }
    }
    return dp[m][n];
}

/**
 * Approximate “contains”:
 * 1) exact substring of any target
 * 2) OR word-level fuzzy match within maxDist edits
 */
function fuzzyContains(text, targets, maxDist = 1) {
    const t = normalizeText(text);
    // exact phrase fast-path
    for (const phrase of targets) {
        const p = normalizeText(phrase);
        if (p && t.includes(p)) return true;
    }
    // token-level fuzzy fallback
    const tokens = t.split(/[^a-z0-9æøå]+/i).filter(Boolean);
    for (const phrase of targets) {
        const p = normalizeText(phrase);
        if (!p) continue;
        for (const tok of tokens) {
            if (Math.abs(tok.length - p.length) <= maxDist &&
                levenshtein(tok, p) <= maxDist) {
                return true;
            }
        }
    }
    return false;
}

/** journal### extractor (1..150). */
function extractJournalId(text) {
    const m = /journal[_]?(\d{1,3})\b/i.exec(text);
    if (!m) return null;
    const id = parseInt(m[1], 10);
    return id >= 1 && id <= 150 ? id : null;
}

/** FirstName + single-letter initial, e.g. "Thomas R." */
function extractNameInitial(text) {
    const m = /\b([A-ZÆØÅ][a-zæøå]+)\s([A-ZÆØÅ])\.\b/.exec(text);
    return m ? { first: m[1], initial: m[2] } : null;
}

/** CPR: dd.mm.yy-xxxx OR 10 digits (your generated format). */
function extractCPR(text) {
    const m1 = /\b\d{2}[.\-/ ]\d{2}[.\-/ ]\d{2}[- ]\d{4}\b/.exec(text);
    const m2 = /\b\d{6}\b[- ]\d{4}\b/.exec(text);
    return m1?.[0] || m2?.[0] || null;
}

/**
 * Detect a known document by title/category.
 * - If you can pass real titles from DB, supply `knownTitles` (array of strings).
 * - Otherwise we fall back to broad medical/nursing keywords.
 */
function matchKnownDocTitle(message) {
    const nmsg = normalizeText(message);

    // Prefer dynamic, exact/fuzzy match against real titles if provided.
    if (Array.isArray(allDocTitles) && allDocTitles.length) {
        const normalizedTitles = allDocTitles.map(normalizeText);
        // exact phrase first
        for (const t of normalizedTitles) if (t && nmsg.includes(t)) return t;
        // fuzzy token fallback
        const tokens = nmsg.split(/[^a-z0-9æøå]+/i).filter(Boolean);
        for (const t of normalizedTitles) {
            for (const tok of tokens) {
                if (Math.abs(tok.length - t.length) <= 2 && levenshtein(tok, t) <= 2) {
                    return t;
                }
            }
        }
    }

    // Fallback: broad keywords that map to your disease/guideline/task sets.
    const categoryPhrases = [
        // categories
        "disease", "diseases", "condition", "conditions",
        "guideline", "guidelines", "medical guideline", "nursing guideline",
        "nursing task", "task",
        // common topics from your lists (add more as needed)
        "sepsis", "asthma", "copd", "ckd", "aki", "dka", "pneumonia",
        "pulmonary embolism", "pe", "migraine", "heart failure", "stroke",
        "appendicitis", "cellulitis", "pyelonephritis", "ulcerative colitis",
        "hypertension", "osteaoarthritis", "osteoarthritis", "covid",
        "upper gi bleed", "ugib", "anaphylaxis",
        // nursing tasks (samples)
        "oxygen therapy", "ecg", "iv cannulation", "pressure injury",
        "wound care", "blood glucose", "nasogastric", "enteral feeding",
        "transfusion", "rapid response", "specimen collection"
    ];
    return fuzzyContains(nmsg, categoryPhrases, 2) ? "category-match" : null;
}

/**
 * Main intent detector.
 * Returns:
 *   { mode: "hybride" | "full" | "summary",
 *     hint: { journalId, cpr, nameInitial, knownDoc } }
 *
 * Policy: default to "hybride" (chunk/RRF). Only switch to "full" or "summary"
 * when there is a strong, specific signal.
 */
export function detectIntent(message) {
    const msg = message || "";
    const nmsg = normalizeText(msg);

    // Strong entity cues
    const journalId = extractJournalId(msg);

    const cpr = extractCPR(msg);

    const nameInit = extractNameInitial(msg);

    const knownDoc = matchKnownDocTitle(msg, allDocTitles);


    // Triggers (expanded + synonyms; fuzzy with small typos)
    const fullDocTriggers = [
        "full", "entire", "whole", "complete", "all pages", "full text",
        "complete record", "full record", "entire record", "patient record",
        "full journal", "entire journal", "whole journal", "show all",
        "print", "download", "export", "open full", "open entire"
    ];
    const retrieveTriggers = [
        "retrieve", "fetch", "open", "display", "show", "access", "load"
    ];
    const summaryTriggers = [
        "summarize", "summarise", "summary", "tl;dr", "brief", "briefly",
        "overview", "synopsis", "outline", "digest", "recap", "short version"
    ];

    const wantsFull =
        fuzzyContains(nmsg, fullDocTriggers, 1) ||
        fuzzyContains(nmsg, retrieveTriggers, 1);
    console.log("Wants full document:", wantsFull);

    const wantsSummary =
        fuzzyContains(nmsg, summaryTriggers, 2);

    console.log("Wants summary:", wantsSummary);

    // ---------- Decision: favor "hybrid" ----------
    let mode = "hybrid";

    // Strongest: explicit identity OR doc match + explicit full
    if ((journalId || cpr || nameInit || knownDoc) && wantsFull) {
        mode = "full";
    }

    // Summary only if tied to a specific doc (journal id or known doc)
    else if ((journalId || cpr || nameInit || knownDoc) && wantsSummary) {
        mode = "summary";
    }
    console.log("journalId, cpr, nameInit, knownDoc:", journalId, cpr, nameInit, knownDoc);
    // Otherwise remain "hybrid"

    return {
        mode, // "hybrid" | "full" | "summary"
    };
}
