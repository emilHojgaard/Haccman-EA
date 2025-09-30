// generateJournals.mjs — ESM, generates 150 detailed fictional journals into ./output_journals
// Run: node generateJournals.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- Pools --------------------
const firstNames = [
    "Anders", "Mette", "Jonas", "Kirsten", "Lars", "Sanne", "Peter", "Camilla", "Thomas", "Nina",
    "Rasmus", "Grethe", "Christian", "Lene", "Brian", "Helle", "Maja", "Søren", "Ida", "Frederik",
    "Julie", "Morten", "Anja", "Ole", "Birgit", "Emil", "Tina", "Viggo", "Solveig", "Carsten",
    "Maria", "Sebastian", "Katrine", "Henrik", "Louise", "Niklas", "Anne", "Rune", "Sofia", "Magnus"
];
const lastInitials = ["N.", "H.", "L.", "M.", "P.", "S.", "K.", "J.", "R.", "T.", "B.", "C.", "D.", "E.", "F.", "G.", "O.", "V.", "W.", "Å."];

const doctors = [
    "Dr. H. Sørensen, Internal Medicine", "Dr. L. Holm, Cardiology", "Dr. P. Jensen, Psychiatry",
    "Dr. S. Nielsen, Emergency Medicine", "Dr. K. Petersen, Endocrinology", "Dr. M. Rasmussen, Orthopedics",
    "Dr. A. Kristoffersen, Infectious Diseases", "Dr. B. Thomsen, Pediatrics", "Dr. C. Dahl, Pulmonology",
    "Dr. E. Madsen, Neurology", "Dr. F. Hansen, General Practice", "Dr. G. Lauridsen, Rheumatology",
    "Dr. H. Berg, Gastroenterology", "Dr. I. Olesen, Nephrology", "Dr. J. Knudsen, ENT",
    "Dr. K. Vester, Vascular Surgery", "Dr. L. Mikkelsen, Dermatology", "Dr. M. Sønder, Urology",
    "Dr. N. Kruse, Oncology", "Dr. O. Lyng, Endocrinology", "Dr. P. Dam, Hematology",
    "Dr. Q. Norup, Ophthalmology", "Dr. R. Frandsen, Palliative Care", "Dr. S. Aaen, Allergy & Immunology",
    "Dr. T. Enevoldsen, Pain Medicine"
];

// Small helpers for mild numeric variation inside strings
const r = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const date2025 = () => `2025-${String(r(1, 12)).padStart(2, "0")}-${String(r(1, 28)).padStart(2, "0")}`;
const fakeCPR = () => `${String(r(1, 28)).padStart(2, "0")}.${String(r(1, 12)).padStart(2, "0")}.${String(r(0, 99)).padStart(2, "0")}-${r(1000, 9999)}`;
const patientName = () => `${rand(firstNames)} ${rand(lastInitials)}`;
const authorName = () => rand(doctors);

// -------------------- 30 detailed condition templates --------------------
/**
 * Each template provides rich multi-sentence sections.
 * Keep texts generic, fictional, and safe. No real identifiers.
 */
const conditions = [
    {
        tag: "Type 2 Diabetes — Poor Control",
        subjective: (name) =>
            `${name}, with longstanding type 2 diabetes and dietary nonadherence, reports two weeks of polydipsia, polyuria, and mid-afternoon fatigue. ` +
            `Admits to occasionally missing evening doses of metformin and increased intake of refined carbohydrates during social events. Denies chest pain, visual loss, or focal neurological symptoms.`,
        objective:
            `Vital signs: BP ${r(145, 158)}/${r(88, 100)} mmHg, HR ${r(84, 98)} bpm, Temp ${rand(["36.9", "37.1", "37.3"])}°C, SpO2 ${r(96, 99)}% RA. BMI ${rand(["31.2", "32.5", "33.1"])} kg/m². ` +
            `General: well-appearing, no acute distress. Cardiopulmonary exam unremarkable. Abdomen soft, non-tender. No peripheral edema; feet with intact sensation by monofilament.`,
        labs:
            `Fasting glucose ${rand(["12.6", "13.8", "14.9"])} mmol/L; HbA1c ${rand(["8.3", "8.7", "9.1"])}%; Creatinine ${r(70, 95)} µmol/L with eGFR > ${r(70, 90)} mL/min/1.73m²; urine albumin/creatinine ratio mildly elevated.`,
        assessment:
            `Suboptimally controlled type 2 diabetes mellitus with lifestyle and adherence factors predominating. No evidence of acute complications such as DKA or HHS. ` +
            `Concurrent hypertension requires continued monitoring and titration.`,
        plan:
            `Reinforce metformin adherence; add SGLT2 inhibitor (empagliflozin ${rand(["10", "25"])} mg QD) given renal function and potential CV benefit. ` +
            `Dietician referral for structured meal planning; encourage daily brisk walking ${r(25, 40)} min. Blood pressure log at home; consider ACE inhibitor uptitration if persistently > 140/90. ` +
            `Repeat HbA1c in 3 months; follow-up in 4 weeks or sooner if symptomatic.`
    },
    {
        tag: "Hypertension with LVH",
        subjective: (name) =>
            `${name} notes progressive exertional dyspnea and intermittent palpitations for ${r(3, 6)} weeks, with reduced exercise capacity and occasional evening ankle swelling. ` +
            `Denies syncope or chest pressure but reports poor sleep and elevated stress.`,
        objective:
            `BP ${r(160, 175)}/${r(95, 106)} mmHg, HR ${r(78, 94)} bpm, RR ${r(14, 18)}/min. JVP not elevated. S4 present, no murmurs. Lungs clear; trace bilateral pitting edema. ` +
            `EKG reviewed at bedside appears consistent with left ventricular strain patterns.`,
        labs:
            `ECG: voltage criteria for LVH with repolarization changes. NT-proBNP mildly elevated. Basic metabolic panel within normal limits; lipids show elevated LDL.`,
        assessment:
            `Long-standing hypertension with evidence of LVH and early congestive physiology. Symptoms likely reflect diastolic dysfunction; ischemia less likely but not excluded.`,
        plan:
            `Titrate ACE inhibitor and add thiazide-like diuretic; salt restriction < 2 g/day; counsel weight reduction. ` +
            `Schedule transthoracic echocardiogram to assess wall thickness and diastolic function. Cardiology review in ${r(2, 4)} weeks.`
    },
    {
        tag: "Major Depressive Disorder (Moderate)",
        subjective: (name) =>
            `${name} reports ${r(3, 8)} weeks of persistent low mood, anhedonia, early morning awakening, and cognitive slowing. Appetite decreased with ${r(1, 3)} kg unintentional weight loss. ` +
            `Denies active suicidal intent but expresses hopelessness and diminished concentration at work.`,
        objective:
            `Affect constricted, psychomotor retardation mild. Thought process linear, no delusions or hallucinations. Insight fair; judgment intact.`,
        labs:
            `CBC, CMP, and TSH within reference ranges. No substance use reported; AUDIT-C negative.`,
        assessment:
            `Major depressive disorder, moderate severity, without psychotic features. No immediate safety concerns, but psychosocial stressors present.`,
        plan:
            `Initiate SSRI (e.g., sertraline 50 mg QD) with discussion of side effects; refer for CBT. Establish crisis plan; encourage sleep hygiene and graded activity. ` +
            `Follow-up in 2–3 weeks to assess tolerability and response; consider dose escalation if partial response.`
    },
    {
        tag: "Community-Acquired Pneumonia",
        subjective: (name) =>
            `${name} presents with ${r(3, 6)} days of productive cough, pleuritic right-sided chest pain, and fevers with chills. ` +
            `Shortness of breath noted on climbing stairs; no hemoptysis. Recent viral contact at home.`,
        objective:
            `Temp ${rand(["38.2", "38.6", "38.9"])}°C, RR ${r(20, 26)}/min, SpO2 ${r(92, 96)}% RA. Auscultation: focal crackles and bronchial breath sounds over RLL. ` +
            `No peripheral cyanosis; cardiovascular exam normal.`,
        labs:
            `CXR: right lower lobe consolidation. WBC ${r(11, 15)}×10⁹/L with left shift; CRP elevated. Renal function normal.`,
        assessment:
            `Community-acquired pneumonia, likely typical bacterial etiology. CURB-65 low risk; outpatient therapy appropriate.`,
        plan:
            `Start oral amoxicillin or doxycycline (if penicillin allergy). Emphasize hydration, antipyretics, and return precautions for worsening dyspnea. ` +
            `Re-assess in 48–72 hours; follow-up chest X-ray in 6–8 weeks if persistent symptoms.`
    },
    {
        tag: "Lateral Ankle Sprain (Grade 2)",
        subjective: (name) =>
            `${name} inverted the right ankle while walking on uneven ground; immediate swelling and pain rated ${r(6, 8)}/10. ` +
            `Able to bear partial weight; denies numbness or knee pain.`,
        objective:
            `Lateral malleolar tenderness, swelling and ecchymosis; anterior drawer mildly positive. Capillary refill < 2 s; sensation intact; pulses 2+. ` +
            `Ottawa rules applied; imaging obtained.`,
        labs:
            `Plain radiographs: no fracture or mortise widening.`,
        assessment:
            `Grade 2 lateral ankle sprain without fracture or neurovascular compromise.`,
        plan:
            `RICE protocol ${r(48, 72)} h, functional brace, NSAIDs with gastroprotection as needed. Early ROM exercises; physiotherapy in 1–2 weeks. ` +
            `Gradual return to sport over ${r(3, 6)} weeks as symptoms allow.`
    },
    {
        tag: "Asthma Exacerbation (Moderate)",
        subjective: (name) =>
            `${name} reports ${r(5, 8)} days of increased wheeze, chest tightness, and nocturnal cough requiring frequent SABA puffs. ` +
            `Recent URI in household; denies fever or chest pain.`,
        objective:
            `RR ${r(20, 24)}/min, SpO2 ${r(95, 97)}% RA, diffuse polyphonic wheeze; speaking in full sentences. No accessory muscle use. ` +
            `No focal consolidation signs.`,
        labs:
            `Peak flow ${r(55, 70)}% of personal best. No radiographic evidence of pneumonia.`,
        assessment:
            `Moderate asthma exacerbation—likely viral/allergic trigger; no impending respiratory failure.`,
        plan:
            `Short course oral prednisolone, step-up inhaled corticosteroid dose, review inhaler technique and adherence. ` +
            `Action plan provided; clinic review in 1 week or sooner if deterioration.`
    },
    {
        tag: "Uncomplicated UTI",
        subjective: (name) =>
            `${name} with 48 hours of dysuria, urinary frequency, and urgency. No flank pain, rigors, or vaginal discharge. Hydration modest.`,
        objective:
            `Afebrile; abdomen soft, non-tender; no CVA tenderness. Pelvic exam deferred by patient preference.`,
        labs:
            `Dipstick positive for nitrites and leukocyte esterase; urine microscopy shows pyuria and bacteriuria.`,
        assessment:
            `Acute uncomplicated cystitis in an otherwise healthy adult.`,
        plan:
            `Start oral pivmecillinam per local guidance; advise generous fluids and return if fever or flank pain develops. ` +
            `Urine culture sent; adjust antibiotics if resistant organism identified.`
    },
    {
        tag: "Bipolar Disorder — Manic Episode",
        subjective: (name) =>
            `${name} brought by family with ${r(4, 7)} days of markedly reduced sleep, pressured speech, impulsive spending, and grandiosity. ` +
            `No substance use reported. Appetite variable; denies current suicidal intent.`,
        objective:
            `Agitated but cooperative; speech rapid, tangential at times. Affect expansive; insight limited; judgment impaired in spending decisions.`,
        labs:
            `Toxicology screen negative; CMP and CBC within normal limits.`,
        assessment:
            `Manic episode consistent with bipolar affective disorder; safety risk present due to impulsivity.`,
        plan:
            `Initiate mood stabilizer (e.g., lithium with renal/thyroid monitoring) or atypical antipsychotic. ` +
            `Consider inpatient admission for stabilization if outpatient safety cannot be ensured. Coordinate psychoeducation with family.`
    },
    {
        tag: "Mild Traumatic Brain Injury (Concussion)",
        subjective: (name) =>
            `${name} struck head on cabinet door with brief LOC < 1 minute; now reports headache, photophobia, and mild dizziness. ` +
            `No vomiting; no anticoagulant use.`,
        objective:
            `GCS 15, pupils equal/reactive, no focal neurological deficits. Gait steady. Cervical spine non-tender.`,
        labs:
            `CT head (if performed) negative for acute hemorrhage. No skull fracture on exam.`,
        assessment:
            `Mild TBI/concussion without red flags; symptoms likely to improve over days to weeks.`,
        plan:
            `Provide graded return-to-activity plan, analgesia (avoid opiates), screen for worsening symptoms. ` +
            `Follow-up if persistent symptoms beyond 2–3 weeks or red flags emerge.`
    },
    {
        tag: "COPD Exacerbation",
        subjective: (name) =>
            `${name} with chronic cough and exertional dyspnea presents with ${r(2, 5)} days of increased sputum volume and purulence, worsening breathlessness, and wheeze. ` +
            `Reports running out of controller inhaler last week.`,
        objective:
            `RR ${r(20, 28)}/min, SpO2 ${r(90, 94)}% RA, diffuse wheeze with prolonged expiration; accessory muscle use mild. No focal consolidation.`,
        labs:
            `ABG if indicated: mild hypoxemia; CRP elevated. CXR without new lobar consolidation.`,
        assessment:
            `COPD exacerbation, likely infectious or nonadherence-related.`,
        plan:
            `Nebulized bronchodilators, short oral steroid course; antibiotics if purulent sputum and bacterial suspicion. ` +
            `Ensure inhaler supply and technique; smoking cessation reinforcement; follow-up in respiratory clinic.`
    },
    {
        tag: "Transient Ischemic Attack (High-Risk)",
        subjective: (name) =>
            `${name} experienced ${r(10, 35)} minutes of left facial droop and hand weakness yesterday, fully resolved prior to arrival. ` +
            `No prior similar episodes; risk factors include hypertension and dyslipidemia.`,
        objective:
            `Neurological exam currently non-focal; gait normal; cardiovascular exam without murmurs.`,
        labs:
            `CT/MRI brain negative for acute infarct; carotid duplex pending; ECG sinus rhythm; lipids elevated.`,
        assessment:
            `High-risk TIA; urgent secondary prevention warranted.`,
        plan:
            `Start antiplatelet therapy, initiate high-intensity statin, BP control, and expedited stroke clinic review. ` +
            `Educate on stroke warning signs; strict return precautions provided.`
    },
    {
        tag: "GERD (Symptomatic)",
        subjective: (name) =>
            `${name} reports burning retrosternal discomfort after meals, regurgitation, and nocturnal heartburn for several months. ` +
            `Symptoms triggered by fatty/spicy foods; no dysphagia or weight loss.`,
        objective:
            `Abdominal exam benign, BMI ${rand(["24.8", "27.3", "29.1"])} kg/m². No pallor or cachexia.`,
        labs:
            `Trial of PPI appropriate; endoscopy considered if alarm features emerge. H. pylori testing if dyspepsia predominant.`,
        assessment:
            `Likely GERD without alarm signs.`,
        plan:
            `Start PPI daily ${r(4, 8)} weeks, elevate head of bed, avoid late meals and dietary triggers. ` +
            `Reassess response; consider step-down therapy if controlled.`
    },
    {
        tag: "Knee Osteoarthritis",
        subjective: (name) =>
            `${name} presents with chronic medial knee pain for ${r(6, 18)} months, worsened by stairs and prolonged walking. Morning stiffness lasts ${r(5, 20)} minutes. ` +
            `No acute trauma; occasional NSAID use with partial relief.`,
        objective:
            `Varus alignment mild, crepitus on flexion/extension, joint line tenderness medially; small effusion possible. ROM slightly reduced.`,
        labs:
            `X-ray: joint space narrowing and osteophytes consistent with osteoarthritis; no acute fracture.`,
        assessment:
            `Symptomatic knee osteoarthritis limiting function.`,
        plan:
            `Weight reduction, quadriceps-strengthening physiotherapy, topical NSAIDs, and activity modification. ` +
            `Consider intra-articular corticosteroid injection if refractory; surgical referral if severe structural disease.`
    },
    {
        tag: "Cellulitis of Lower Leg",
        subjective: (name) =>
            `${name} reports ${r(1, 3)} days of progressive redness, warmth, and tenderness over the right lower leg after minor abrasion. ` +
            `No purulent drainage; subjective fever at home.`,
        objective:
            `Localized erythema with indistinct margins, increased warmth, and tenderness; no fluctuance or crepitus. Temp ${rand(["37.8", "38.1", "38.3"])}°C.`,
        labs:
            `CRP and WBC mildly elevated; blood cultures generally not indicated in mild cases.`,
        assessment:
            `Non-purulent cellulitis without abscess; outpatient treatment suitable.`,
        plan:
            `Begin oral beta-lactam per guideline, limb elevation, demarcate borders for progression monitoring. ` +
            `Return if systemic symptoms or worsening; recheck in ${r(2, 3)} days.`
    },
    {
        tag: "Migraine Without Aura",
        subjective: (name) =>
            `${name} describes unilateral throbbing headache lasting ${r(4, 24)} hours with photophobia, phonophobia, and nausea. ` +
            `Attacks recur ${r(2, 5)} times per month, often triggered by sleep deprivation.`,
        objective:
            `Neurological examination normal between attacks; no neck stiffness; vitals stable.`,
        labs:
            `No red flags identified; imaging not indicated at this time.`,
        assessment:
            `Episodic migraine without aura.`,
        plan:
            `Treat acutely with triptan plus NSAID if no contraindications; counsel on trigger avoidance and sleep hygiene. ` +
            `Consider prophylaxis if ≥ 4 disabling days/month; follow-up to reassess frequency and response.`
    },
    {
        tag: "Primary Hypothyroidism",
        subjective: (name) =>
            `${name} notes progressive fatigue, cold intolerance, weight gain of ~${r(2, 5)} kg, and constipation over several months. ` +
            `Dry skin and hair thinning observed; no neck pain.`,
        objective:
            `Bradycardia ${r(54, 62)} bpm, delayed ankle reflex relaxation; mild periorbital puffiness possible.`,
        labs:
            `TSH elevated, free T4 low; lipids may be elevated.`,
        assessment:
            `Primary hypothyroidism with classic symptoms and lab pattern.`,
        plan:
            `Start levothyroxine (dose per weight/age), review interactions, and recheck TFTs in 6–8 weeks. ` +
            `Counsel on adherence and consistent morning dosing.`
    },
    {
        tag: "Alcohol Withdrawal",
        subjective: (name) =>
            `${name} reports abrupt reduction in heavy daily alcohol intake ${r(1, 3)} days ago, now with tremor, anxiety, insomnia, and autonomic hyperarousal. ` +
            `No history of seizures or delirium tremens.`,
        objective:
            `Tremulous hands, tachycardia ${r(96, 110)} bpm, diaphoretic; oriented but anxious. CIWA-Ar scoring suggested.`,
        labs:
            `Electrolytes may show hyponatremia or hypomagnesemia; LFTs variably elevated.`,
        assessment:
            `Alcohol withdrawal syndrome—mild to moderate, risk of progression if unmanaged.`,
        plan:
            `Symptom-triggered benzodiazepine protocol where indicated; correct electrolytes; thiamine supplementation before glucose. ` +
            `Arrange addiction services follow-up and psychosocial support.`
    },
    {
        tag: "Suspected Acute Appendicitis",
        subjective: (name) =>
            `${name} has ${r(12, 24)} hours of periumbilical pain migrating to the right lower quadrant with anorexia and nausea. ` +
            `Reports low-grade fever and worsened pain with movement.`,
        objective:
            `RLQ tenderness maximal at McBurney’s point; guarding present; Rovsing sign positive. Temp ${rand(["37.8", "38.1", "38.2"])}°C.`,
        labs:
            `WBC ${r(11, 15)}×10⁹/L; CRP elevated. Ultrasound/CT supportive of appendicitis.`,
        assessment:
            `Acute appendicitis likely; surgical management indicated.`,
        plan:
            `NPO, IV fluids, analgesia, perioperative antibiotics; surgical consult for appendectomy. ` +
            `Post-op instructions and early mobilization plan discussed.`
    },
    {
        tag: "Renal Colic (Ureteric Stone)",
        subjective: (name) =>
            `${name} presents with sudden severe colicky flank pain radiating to the groin, associated with nausea and restlessness. ` +
            `No dysuria or fever reported.`,
        objective:
            `Uncomfortable, pacing; CVA tenderness on affected side; abdomen soft. Vitals stable.`,
        labs:
            `Urinalysis: microscopic hematuria; non-contrast CT suggests distal ureteric stone ${r(3, 6)} mm.`,
        assessment:
            `Renal colic from ureteric calculus—likely to pass spontaneously if ≤ 5–6 mm.`,
        plan:
            `NSAID analgesia and antiemetic; tamsulosin may aid passage; hydration advice. ` +
            `Urology referral if obstruction, infection, or uncontrolled pain.`
    },
    {
        tag: "New-Onset Atrial Fibrillation",
        subjective: (name) =>
            `${name} experiences acute palpitations with exertional dyspnea and mild lightheadedness beginning earlier today. ` +
            `No prior history of arrhythmia; caffeine intake elevated recently.`,
        objective:
            `Irregularly irregular rhythm; HR ${r(110, 140)} bpm; BP variable. Lungs clear; no heart failure signs.`,
        labs:
            `ECG: atrial fibrillation; TSH and electrolytes to evaluate contributors. CHADS-VASc assessed.`,
        assessment:
            `New-onset atrial fibrillation—hemodynamically stable; requires rate control and thromboembolic risk assessment.`,
        plan:
            `Begin rate control (beta-blocker as appropriate), evaluate need for anticoagulation, cardiology follow-up for rhythm strategy.`
    },
    {
        tag: "Iron-Deficiency Anemia",
        subjective: (name) =>
            `${name} reports progressive fatigue, exertional dyspnea, and restless legs at night. Diet low in iron-rich foods; denies overt bleeding.`,
        objective:
            `Conjunctival pallor present; HR ${r(84, 96)} bpm; systolic ejection murmur flow-related.`,
        labs:
            `Hb ${r(5, 7)} mmol/L (low), MCV low, ferritin reduced; iron and transferrin saturation decreased.`,
        assessment:
            `Microcytic anemia consistent with iron deficiency; source evaluation warranted (dietary vs occult loss).`,
        plan:
            `Oral iron therapy with vitamin C, counsel on side effects; investigate sources (GI as appropriate). Recheck Hb/ferritin in 6–8 weeks.`
    },
    {
        tag: "Peptic Ulcer Disease (Suspected)",
        subjective: (name) =>
            `${name} reports epigastric burning pain related to meals and nocturnal discomfort. NSAID use for knee pain noted.`,
        objective:
            `Epigastric tenderness without guarding or rebound; vitals stable; no melena reported.`,
        labs:
            `H. pylori testing indicated; CBC to screen for anemia.`,
        assessment:
            `Suspected peptic ulcer disease, likely NSAID or H. pylori–related.`,
        plan:
            `Start PPI; discontinue NSAIDs if possible; test and treat H. pylori if positive. Return for alarm symptoms or persistent pain.`
    },
    {
        tag: "Cholelithiasis with Biliary Colic",
        subjective: (name) =>
            `${name} has episodic right upper quadrant pain radiating to the back, often after fatty meals, with nausea but no fever.`,
        objective:
            `RUQ tenderness; Murphy sign negative between attacks; sclerae anicteric.`,
        labs:
            `Ultrasound: gallstones without ductal dilation; LFTs within normal range.`,
        assessment:
            `Symptomatic cholelithiasis causing biliary colic; no cholecystitis currently.`,
        plan:
            `Dietary fat reduction; elective surgical consultation for laparoscopic cholecystectomy if recurrent. Return if fever/jaundice.`
    },
    {
        tag: "Heart Failure with Preserved EF (HFpEF)",
        subjective: (name) =>
            `${name} reports exertional dyspnea, orthopnea requiring ${r(2, 3)} pillows, and mild ankle swelling over ${r(3, 8)} weeks.`,
        objective:
            `BP ${r(140, 160)}/${r(85, 98)} mmHg; bibasilar crackles faint; S4 present; mild edema at ankles.`,
        labs:
            `NT-proBNP elevated; echocardiogram shows preserved EF with diastolic dysfunction; renal function acceptable.`,
        assessment:
            `HFpEF likely on a background of hypertension and metabolic syndrome.`,
        plan:
            `Diuretics for symptom relief; optimize BP and glycemic control; sodium restriction; cardiology follow-up with exercise plan.`
    },
    {
        tag: "Psoriasis (Plaque)",
        subjective: (name) =>
            `${name} presents with pruritic, scaly plaques on elbows and knees, waxing and waning over years; stress exacerbates symptoms.`,
        objective:
            `Well-demarcated erythematous plaques with silvery scale on extensor surfaces; nails show pitting.`,
        labs:
            `No labs necessary for mild disease; screen for psoriatic arthritis symptoms.`,
        assessment:
            `Chronic plaque psoriasis, mild to moderate severity.`,
        plan:
            `Topical corticosteroids and vitamin D analogs; moisturizers; dermatology referral if inadequate response to topicals.`
    },
    {
        tag: "Nephrolithiasis — Calcium Oxalate",
        subjective: (name) =>
            `${name} had prior kidney stone; now presents with recurrent flank pain and gross hematuria after dehydration during travel.`,
        objective:
            `CVA tenderness; vitals stable; abdomen soft.`,
        labs:
            `UA with hematuria; non-contrast CT shows ${r(3, 7)} mm ureteric stone; BMP normal.`,
        assessment:
            `Recurrent nephrolithiasis, likely calcium oxalate.`,
        plan:
            `Analgesia and medical expulsive therapy; counsel on hydration and reduced oxalate intake; urology if obstruction persists.`
    },
    {
        tag: "Benign Paroxysmal Positional Vertigo (BPPV)",
        subjective: (name) =>
            `${name} reports brief vertigo episodes triggered by rolling in bed and looking up; nausea present, no hearing loss.`,
        objective:
            `Dix–Hallpike positive on the right with torsional nystagmus; neuro exam otherwise normal.`,
        labs:
            `No imaging indicated absent red flags.`,
        assessment:
            `Posterior canal BPPV.`,
        plan:
            `Epley maneuver performed; provide instructions for home exercises and precautions. Follow-up if persistent.`
    },
    {
        tag: "Viral Gastroenteritis",
        subjective: (name) =>
            `${name} has ${r(1, 3)} days of watery diarrhea, crampy abdominal pain, and low-grade fever after a family cluster of illness.`,
        objective:
            `Mild dehydration signs; abdomen soft with hyperactive bowel sounds.`,
        labs:
            `No routine labs required; stool studies if prolonged or bloody.`,
        assessment:
            `Likely viral gastroenteritis, self-limited.`,
        plan:
            `Oral rehydration, BRAT-style diet as tolerated, return if bloody stools or signs of severe dehydration.`
    },
    {
        tag: "Herpes Zoster (Shingles)",
        subjective: (name) =>
            `${name} notes burning pain followed by grouped vesicular rash in a unilateral dermatomal distribution over ${r(2, 3)} days.`,
        objective:
            `Clusters of vesicles on erythematous base not crossing midline; tenderness to light touch.`,
        labs:
            `Clinical diagnosis; PCR if atypical.`,
        assessment:
            `Acute herpes zoster.`,
        plan:
            `Start antiviral within 72 hours if possible; analgesia; advise on contagion precautions until crusting.`
    },
    {
        tag: "Deep Vein Thrombosis (Suspected)",
        subjective: (name) =>
            `${name} reports unilateral calf swelling and aching after recent long-haul travel; no trauma.`,
        objective:
            `Calf circumference asymmetry ${r(2, 4)} cm; warmth and tenderness present; Homan sign not reliable.`,
        labs:
            `D-dimer if low pretest probability; venous duplex ultrasound pending.`,
        assessment:
            `Suspected DVT; risk factors present.`,
        plan:
            `Begin anticoagulation if high suspicion and no contraindications; confirm with imaging; counsel on VTE precautions.`
    },
    {
        tag: "Upper GI Bleed (Non-Variceal, Suspected)",
        subjective: (name) =>
            `${name} presents with melena and lightheadedness; recent NSAID use. No hematemesis reported.`,
        objective:
            `Conjunctival pallor; HR ${r(96, 112)} bpm; orthostatic symptoms present; abdomen soft.`,
        labs:
            `Hb low relative to baseline; BUN may be elevated; type and crossmatch sent.`,
        assessment:
            `Probable non-variceal upper GI bleed, likely peptic in origin.`,
        plan:
            `Resuscitation as indicated, high-dose PPI, urgent endoscopy planning, hold NSAIDs; monitor hemoglobin and hemodynamics.`
    },
    {
        tag: "Sciatica (Lumbar Radiculopathy)",
        subjective: (name) =>
            `${name} reports shooting pain from lower back radiating down posterior leg, worsened by bending and coughing. No bowel or bladder dysfunction.`,
        objective:
            `Positive straight leg raise on affected side; motor and reflexes largely intact.`,
        labs:
            `Imaging deferred initially; consider MRI if red flags or lack of improvement.`,
        assessment:
            `Lumbar radiculopathy consistent with sciatica.`,
        plan:
            `NSAIDs, activity as tolerated, core-strengthening physiotherapy; consider neuropathic agents if severe. Reevaluate in 4–6 weeks.`
    }
];

// -------------------- Build one entry --------------------
function buildEntry() {
    const cond = rand(conditions);
    const name = patientName();
    const entry =
        `CPR-number: ${fakeCPR()}
Encounter Date: ${date2025()}
Author: ${authorName()}

Subjective:
${cond.subjective(name)}

Objective:
${cond.objective}
Labs (today): ${cond.labs}

Assessment:
${cond.assessment}

Plan:
- ${cond.plan}
- Follow-up in ${r(2, 6)} weeks as appropriate.

Signed,
${authorName()}
`;
    return entry;
}

// -------------------- Main --------------------
const OUT_DIR = path.join(__dirname, "patient_journals");

// Delete old dir if it exists
if (fs.existsSync(OUT_DIR)) {
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
}

// Recreate fresh dir
fs.mkdirSync(OUT_DIR, { recursive: true });

//This is the number of generates files : 
const COUNT = 150;
for (let i = 1; i <= COUNT; i++) {
    fs.writeFileSync(path.join(OUT_DIR, `journal${i}.txt`), buildEntry(), "utf8");
}
console.log(`Generated ${COUNT} detailed journal files in ${OUT_DIR}`);
