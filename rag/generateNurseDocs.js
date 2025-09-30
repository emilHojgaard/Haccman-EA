// generateNursingGuidelinesRich.mjs
// Creates 30 detailed, disease-specific *nursing* clinical guidelines (one .txt per disease).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "nursing_guidelines");

// Fresh output folder each run
if (fs.existsSync(OUT_DIR)) {
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUT_DIR, { recursive: true });

const safe = (s) => s.replace(/[^a-z0-9]/gi, "_");

// =================== NURSE-GUIDELINE TEXTS (30) ===================
const diseaseGuidelines = {
    "Asthma": `TITLE: Asthma – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Pulmonology Unit

Overview:
Asthma is a chronic inflammatory airway disorder with variable airflow limitation and hyperresponsiveness. Nursing priorities: assess severity, deliver prescribed bronchodilation and oxygen, evaluate response, teach trigger control and inhaler technique.

Nursing Assessment:
- History: triggers, controller adherence, prior ICU/intubations, recent infections.
- Inspection: accessory muscle use, ability to speak, agitation/fatigue.
- Vitals & O2: RR, HR, BP, SpO₂ (target ≥ 94% unless otherwise prescribed).
- Auscultation: wheeze, reduced air entry, “silent chest” (ominous).
- Peak flow (if trained/device available) vs personal best.

Key Monitoring:
- SpO₂ and respiratory effort q15–30 min in acute care, then hourly when stable.
- Frequency of SABA use; response after each dose.
- Signs of exhaustion, CO₂ retention (drowsiness), or worsening work of breathing.

Nursing Interventions:
- Position upright; calm environment; bronchodilator via spacer/nebulizer as prescribed.
- Administer oxygen to target saturation; prepare/assist with systemic steroids if ordered.
- Check and correct inhaler/spacer technique; ensure spacer availability.
- Prepare for escalation (magnesium neb/IV per local protocol) when ordered.

Patient Education:
- Written asthma action plan; daily preventer adherence; correct inhaler technique.
- Trigger avoidance: smoke, pets, dust mites, viral hygiene; pre-exercise SABA if prescribed.

When to Escalate:
- SpO₂ < 92% on oxygen, silent chest, inability to speak full sentences, exhaustion, cyanosis.
- No clinical response after initial SABA cycles or deteriorating PEFR.

Documentation & Coordination:
- Record pre/post values (SpO₂, RR, PEFR), meds given, responses, education provided.
- Handover triggers, action plan status, and follow-up needs to next shift/community team.

Prognosis:
Good with consistent controller therapy, technique, and trigger management; nursing vigilance reduces severe exacerbations.`,

    "Type 2 Diabetes Mellitus": `TITLE: Type 2 Diabetes Mellitus – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Endocrinology Unit

Overview:
Type 2 diabetes involves insulin resistance and relative insulin deficiency. Nursing focus: glucose monitoring, medication administration, hypoglycemia prevention, foot/skin checks, and education.

Nursing Assessment:
- History: meds (metformin, SGLT2i, GLP-1 RA, insulin), adherence, diet/activity patterns.
- Check: blood glucose trends, foot integrity, hydration, comorbidities (HTN, CKD).
- Vitals & labs: BP, weight/BMI, recent HbA1c, eGFR if relevant to dosing.

Key Monitoring:
- Capillary glucose per prescription (AC/HS or more often if unstable).
- Watch for hypo (sweats, tremor, confusion) and hyper (polydipsia, polyuria, fatigue).
- Injection sites/pen technique; renal function considerations for dosing.

Nursing Interventions:
- Administer oral agents/insulin per MAR; verify timing with meals.
- Treat hypoglycemia promptly: 15–20 g rapid-acting carb; recheck in 15 min; escalate if LOC impaired.
- Reinforce sick-day rules: hydration, maintain carbs/insulin as prescribed, when to seek help.

Patient Education:
- Glucose targets, SMBG technique, injection technique, sharps safety.
- Diet (portion control, fiber), activity (≥150 min/week), foot checks; annual eye/renal review.

When to Escalate:
- Recurrent hypo/hyperglycemia despite adherence; vomiting/ketones; altered mental status.

Documentation & Coordination:
- Record glucose values, insulin units, events (hypo), teaching given, and referrals to diabetes nurse/educator.

Prognosis:
Excellent with sustained lifestyle and medication adherence; nursing follow-up reduces complications.`,

    "Hypertension": `TITLE: Hypertension – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Cardiology Unit

Overview:
Hypertension is persistently elevated BP increasing CV/renal risk. Nursing priorities: accurate measurement, adherence support, lifestyle counseling, and recognition of hypertensive urgency/emergency.

Nursing Assessment:
- Proper BP technique (seated, rested, correct cuff, both arms initially).
- Review meds, side effects (cough, dizziness), salt intake, sleep, alcohol, activity.
- Check end-organ symptoms: chest pain, neuro deficits, vision changes, dyspnea.

Key Monitoring:
- BP logs (home/ambulatory if available); orthostatics if dizziness/falls.
- Renal function/potassium if on ACEi/ARB/diuretic (per orders).

Nursing Interventions:
- Reinforce adherence, timed dosing, and refills; address barriers.
- Counsel: salt restriction, weight loss, activity, limit alcohol; sleep hygiene.
- Administer prescribed antihypertensives; recheck BP post-dose per protocol.

Patient Education:
- BP goals and self-monitoring; recognizing red flags; medication side effects/what to do.

When to Escalate:
- BP ≥180/120 with symptoms (neuro, chest pain, SOB) → emergency pathway.

Documentation & Coordination:
- BP trends, counseling provided, adverse effects, and communication with prescriber.

Prognosis:
Most reach targets with combined lifestyle and meds; sustained nursing support improves adherence.`,

    "Coronary Artery Disease (Stable Angina)": `TITLE: Coronary Artery Disease (Stable Angina) – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Cardiology Unit

Overview:
CAD involves atherosclerotic narrowing of coronary arteries causing exertional chest pressure relieved by rest or nitroglycerin. Nursing priorities: symptom assessment, antianginal adherence, risk-modification coaching, escalation for unstable features.

Nursing Assessment:
- Characterize pain (location, quality, triggers, relief), exertional threshold.
- Review meds (beta-blocker, nitrates, CCB, antiplatelet, statin) and adherence.
- Vitals; risk factors (DM, HTN, lipids, smoking).

Key Monitoring:
- Frequency of angina episodes, nitrate use, and response.
- BP/HR trends, lipid/glucose targets per plan.

Nursing Interventions:
- Ensure availability/education on sublingual nitroglycerin (usage, max doses, when to call).
- Administer meds per MAR; reinforce daily statin/antiplatelet adherence.
- Activity pacing; cardiac rehab referral if indicated.

Patient Education:
- Chest pain action plan; risk-factor modification (smoking cessation, diet, exercise).

When to Escalate:
- Rest pain, increasing frequency/severity, prolonged pain >10 min, associated dyspnea/syncope → urgent eval.

Documentation & Coordination:
- Pain characteristics, medication use/responses, counseling provided; coordinate with cardiology.

Prognosis:
Good when risk factors controlled and therapy adhered to; recognize transition to unstable angina early.`,

    "Heart Failure (HFpEF)": `TITLE: Heart Failure with Preserved Ejection Fraction (HFpEF) – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Cardiology Unit

Overview:
HFpEF presents with heart failure symptoms but normal EF, often due to diastolic dysfunction. Nursing focus: volume assessment, diuresis support, comorbidity management, and self-care coaching.

Nursing Assessment:
- Symptoms: exertional dyspnea, orthopnea/PND, edema, fatigue.
- Weight trends, fluid/salt intake; comorbidities (HTN, AF, DM, obesity, OSA).
- Vitals, JVP, lung crackles, ankle edema; daily weights.

Key Monitoring:
- Response to diuretics (urine output, weight loss goal ~0.5–1 kg/day if fluid overloaded).
- Electrolytes/renal function per orders; BP/HR control.

Nursing Interventions:
- Sodium/fluid restriction education; administer diuretics as prescribed.
- Optimize positioning (upright); oxygen if hypoxic; encourage gentle activity.
- Reinforce adherence to SGLT2i/antihypertensives; sleep apnea pathway if applicable.

Patient Education:
- Daily weights (report 2 kg in 3 days), edema checks, low-salt diet, meds adherence.

When to Escalate:
- Rapid weight gain, worsening SOB at rest, hypotension, confusion, oliguria.

Documentation & Coordination:
- I/O, daily weights, symptoms, education; handover to HF nurse/cardiology clinic.

Prognosis:
Variable; tight comorbidity control and self-management reduce admissions.`,

    "Stroke": `TITLE: Stroke – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Neurology Unit

Overview:
Stroke is acute focal neurological deficit from ischemia or hemorrhage. Nursing priorities: time-critical recognition, airway/breathing/circulation support, swallow screening, early mobilization, secondary prevention.

Nursing Assessment:
- FAST symptoms onset time; neuro checks (NIHSS if trained), vitals, glucose.
- Screen swallow before oral intake; aspiration risk.

Key Monitoring:
- Neuro status q1–4h per protocol; BP (often permissive in ischemic stroke initially), SpO₂, temperature, glucose.

Nursing Interventions:
- Positioning, aspiration precautions; maintain normoglycemia/normothermia.
- DVT prophylaxis, pressure area care; early rehab involvement.
- Education: risk factors, adherence to antiplatelet/anticoag per plan, statins.

Patient Education:
- FAST recognition, medication adherence, lifestyle modification.

When to Escalate:
- Acute neuro deterioration, airway compromise, fever, uncontrolled BP, seizure.

Documentation & Coordination:
- Onset times, neuro observations, swallow screen, therapy involvement, family updates.

Prognosis:
Depends on type/size and time to treatment; rehab and prevention are crucial.`,

    "Transient Ischemic Attack (TIA)": `TITLE: Transient Ischemic Attack (TIA) – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Neurology Unit

Overview:
TIA is transient neurological deficit resolving within 24 h, warning of high early stroke risk. Nursing focus: rapid triage, risk stratification, education, and secondary prevention adherence.

Nursing Assessment:
- Symptom description/timing; vascular risk factors; AF history.
- Neuro status baseline, vitals, glucose.

Key Monitoring:
- Recurrent symptoms, BP, adherence to antiplatelet/anticoag (if AF), statins.

Nursing Interventions:
- Educate on urgent presentation if symptoms recur; medication adherence.
- Coordinate carotid/cardiac investigations as ordered.

Patient Education:
- FAST recognition; smoking cessation, diet/activity; BP/glucose control.

When to Escalate:
- New neuro deficits at any time → emergency pathway.

Documentation & Coordination:
- Events, education, meds given; arrange follow-up with TIA/stroke clinic.

Prognosis:
High early stroke risk without prevention; nursing education reduces recurrence.`,

    "Chronic Kidney Disease": `TITLE: Chronic Kidney Disease – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Nephrology Unit

Overview:
CKD is progressive loss of kidney function. Nursing priorities: BP/diabetes support, medication safety, anemia/bone-mineral monitoring, and patient education.

Nursing Assessment:
- Fluid status (edema), BP, weight; review nephrotoxic exposures (NSAIDs).
- Labs trend awareness: eGFR, K⁺, bicarbonate, ACR (per orders).

Key Monitoring:
- BP logs; symptoms of uremia (nausea, pruritus), hyperkalemia (weakness).
- Medication dose adjustments with declining eGFR.

Nursing Interventions:
- Reinforce ACEi/ARB adherence (if albuminuria), SGLT2i where prescribed.
- Dietary sodium/potassium guidance (per dietitian); fluid balance recording when needed.

Patient Education:
- Avoid NSAIDs; medication review; vaccination schedule; when to seek help.

When to Escalate:
- Rising K⁺, fluid overload/respiratory distress, confusion, rapidly rising creatinine.

Documentation & Coordination:
- Vitals, weights, education, adverse effects; coordinate with nephrology/dietitian.

Prognosis:
Progression can be slowed with strict risk-factor control and medication adherence.`,

    "COPD": `TITLE: Chronic Obstructive Pulmonary Disease (COPD) – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Pulmonology Unit

Overview:
COPD causes persistent airflow limitation. Nursing focus: inhaled therapy adherence, exacerbation management, oxygen safety, smoking cessation support, pulmonary rehab linkage.

Nursing Assessment:
- Cough/sputum, dyspnea scale, exacerbation frequency.
- SpO₂ at rest/exertion; inhaler technique; smoking status.

Key Monitoring:
- SpO₂ targets 88–92% if CO₂ retainers (per plan); signs of infection/exacerbation.

Nursing Interventions:
- Administer bronchodilators ± ICS per plan; controlled oxygen.
- Breathing techniques (pursed-lip), energy conservation; sputum clearance coaching.

Patient Education:
- Inhaler technique, vaccination, smoking cessation programs, pulmonary rehab.

When to Escalate:
- Worsening hypoxia, confusion, severe breathlessness, poor response to therapy.

Documentation & Coordination:
- Observations, meds given, education; liaise with respiratory team.

Prognosis:
Progressive but manageable; cessation and rehab improve QoL.`,

    "Pneumonia": `TITLE: Community-Acquired Pneumonia – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Pulmonology Unit

Overview:
Infection of lung parenchyma. Nursing priorities: early antibiotics (per orders), oxygenation, hydration, mobilization, and sepsis vigilance.

Nursing Assessment:
- Fever, cough/sputum, pleuritic pain, dyspnea; CURB-65 data collection.
- Vitals, SpO₂, auscultation; hydration status.

Key Monitoring:
- SpO₂, RR, temperature, BP, mental status; intake/output.

Nursing Interventions:
- Prompt antibiotic administration; oxygen to target; antipyretics; fluids.
- Encourage incentive spirometry, early mobilization, DB&C.

Patient Education:
- Completion of antibiotics; rest/hydration; vaccination/smoking cessation.

When to Escalate:
- Hypoxia, hypotension, confusion, rising RR → sepsis screening.

Documentation & Coordination:
- Medication times, vitals trends, responses; notify physician of deterioration.

Prognosis:
Generally good with timely therapy; higher risk in frail/comorbid patients.`,

    "Influenza": `TITLE: Influenza – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Infectious Diseases Unit

Overview:
Acute viral respiratory illness. Nursing focus: symptom control, hydration, antivirals early for high-risk, and infection prevention.

Nursing Assessment:
- Sudden fever, myalgia, cough, fatigue; risk status (pregnancy, chronic disease).

Key Monitoring:
- Temperature, SpO₂, hydration, respiratory status.

Nursing Interventions:
- Antipyretics/analgesics; fluids; antivirals if within window and prescribed.
- Isolation precautions; hand/respiratory hygiene.

Patient Education:
- Rest, fluids, return precautions; annual vaccination.

When to Escalate:
- SOB, persistent high fever, confusion, deterioration in chronic disease.

Documentation & Coordination:
- Symptom course, meds given, education; public health guidance as needed.

Prognosis:
Most recover in 1–2 weeks; complications include pneumonia/exacerbations.`,

    "Migraine": `TITLE: Migraine – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Neurology Unit

Overview:
Recurrent throbbing headaches with sensory sensitivities ± nausea. Nursing focus: trigger review, acute therapy support, prevention adherence.

Nursing Assessment:
- Attack pattern, triggers, aura, red flags (thunderclap, neuro deficits).
- Nausea/vomiting severity; hydration.

Key Monitoring:
- Pain scale, response to triptan/NSAID/antiemetic; sedation after meds.

Nursing Interventions:
- Dark/quiet environment; administer acute meds per MAR; IV fluids if ordered.
- Counsel on limiting acute meds to avoid overuse headache.

Patient Education:
- Headache diary; sleep/meal regularity; hydration; trigger avoidance.

When to Escalate:
- New worst headache, neuro deficits, fever/neck stiffness, refractory pain.

Documentation & Coordination:
- Meds/time/response; triggers identified; prevention plan referrals.

Prognosis:
Most control with acute + preventive measures.`,

    "Epilepsy": `TITLE: Epilepsy – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Neurology Unit

Overview:
Tendency for unprovoked seizures. Nursing priorities: safety during events, med adherence, trigger reduction, post-ictal care.

Nursing Assessment:
- Seizure type/frequency; triggers (sleep loss, alcohol, illness).
- Med adherence and side effects; injury risk.

Key Monitoring:
- Post-ictal recovery, airway/breathing; medication levels if ordered.

Nursing Interventions:
- During seizure: protect head, time event, do not restrain, place in recovery position after; call for help if >5 mins (status).
- Administer rescue meds as prescribed.

Patient Education:
- Adherence; sleep hygiene; driving/work safety rules; seizure first aid for family.

When to Escalate:
- Status epilepticus, repeated seizures without recovery, new neuro deficits.

Documentation & Coordination:
- Event details, triggers, meds given; liaison with neurology.

Prognosis:
Many gain seizure control; nursing education reduces harm.`,

    "Parkinson’s Disease": `TITLE: Parkinson’s Disease – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Neurology Unit

Overview:
Neurodegenerative disorder with bradykinesia, rigidity, tremor. Nursing focus: medication timing, mobility/falls prevention, constipation/nutrition management.

Nursing Assessment:
- Motor symptoms, falls history, swallowing, constipation, mood/sleep.
- Review levodopa timing to meals (protein interaction).

Key Monitoring:
- ON/OFF fluctuations, dyskinesias, orthostatic hypotension.

Nursing Interventions:
- Administer meds on precise schedule; PT/OT/SLT referrals; gait aids.
- Bowel regimen; small frequent meals; home safety review.

Patient Education:
- Exercise, timing of meds, aspiration prevention strategies.

When to Escalate:
- Recurrent falls, aspiration, severe OFF periods, delirium.

Documentation & Coordination:
- Symptom diary, med timing, therapy involvement; caregiver support.

Prognosis:
Progressive; structured nursing support improves QoL.`,

    "Multiple Sclerosis": `TITLE: Multiple Sclerosis – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Neurology Unit

Overview:
Autoimmune demyelination with relapses/remission or progression. Nursing focus: relapse support (steroids as ordered), DMT adherence, fatigue/heat management.

Nursing Assessment:
- New neuro deficits (vision, motor, sensory), bladder/bowel, cognition.
- Heat sensitivity, fatigue level, mood.

Key Monitoring:
- Response to relapse treatment, mobility status, infection risk on DMTs.

Nursing Interventions:
- Assist with steroid protocols; cooling strategies; energy conservation techniques.
- Coordinate PT/OT, continence support; vaccination checks.

Patient Education:
- Recognize relapse vs pseudo-relapse; medication adherence; heat management.

When to Escalate:
- New/worsening deficits, severe infection signs while immunosuppressed.

Documentation & Coordination:
- Neuro changes, treatment courses, referrals; MS nurse follow-up.

Prognosis:
Variable; modern DMTs improve outcomes; nursing helps preserve function.`,

    "Osteoarthritis": `TITLE: Osteoarthritis – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Rheumatology Unit

Overview:
Degenerative joint disease causing pain and stiffness. Nursing priorities: pain control, function maintenance, weight/activity guidance.

Nursing Assessment:
- Joint pain pattern, stiffness duration, impact on ADLs; gait assessment.

Key Monitoring:
- Pain scores, mobility, response to analgesia/physio.

Nursing Interventions:
- Heat/cold therapy, topical NSAIDs guidance, exercise plan reinforcement.
- Mobility aids fitting; fall-prevention strategies.

Patient Education:
- Low-impact exercise, pacing, weight loss; joint protection techniques.

When to Escalate:
- Hot swollen joint (rule out infection/gout), rapidly worsening function.

Documentation & Coordination:
- Pain/mobility trends, interventions, referrals to PT/OT.

Prognosis:
Fluctuating; active self-management preserves function.`,

    "Rheumatoid Arthritis": `TITLE: Rheumatoid Arthritis – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Rheumatology Unit

Overview:
Autoimmune synovitis causing symmetric joint inflammation and damage. Nursing focus: flare recognition, DMARD adherence, infection risk counseling.

Nursing Assessment:
- Morning stiffness >30 min, joint swelling/tenderness; function impact.
- Review DMARDs/biologics and monitoring labs.

Key Monitoring:
- Disease activity scores, injection site reactions, infection signs.

Nursing Interventions:
- Pain/flare management per plan (short steroid courses if ordered); heat/cold therapy.
- Teach self-injection, lab monitoring schedule; vaccination counseling.

Patient Education:
- Early reporting of infection, eye/mouth dryness care, fatigue pacing.

When to Escalate:
- New hot joint, systemic symptoms, DMARD toxicity signs.

Documentation & Coordination:
- Flare frequency, education given, lab follow-ups; rheumatology liaison.

Prognosis:
Treat-to-target markedly improves outcomes.`,

    "Peptic Ulcer Disease": `TITLE: Peptic Ulcer Disease – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Gastroenterology Unit

Overview:
Gastric/duodenal ulcers often due to H. pylori or NSAIDs. Nursing focus: pain control, PPI adherence, bleeding risk recognition, H. pylori eradication support.

Nursing Assessment:
- Epigastric pain pattern, NSAID use, anemia/bleeding signs, weight loss.

Key Monitoring:
- Vitals, stool color, Hb if ordered; treatment adherence.

Nursing Interventions:
- Administer PPIs; coordinate H. pylori testing and eradication therapy adherence.
- Counsel on avoiding NSAIDs/alcohol; small frequent meals if helpful.

Patient Education:
- Alarm signs: hematemesis/melena, severe persistent pain.

When to Escalate:
- GI bleed suspicion, perforation signs (rigid abdomen), persistent vomiting.

Documentation & Coordination:
- Meds and response, education, follow-up endoscopy scheduling if indicated.

Prognosis:
High healing with therapy; recurrence if causes persist.`,

    "Gastroesophageal Reflux Disease": `TITLE: Gastroesophageal Reflux Disease (GERD) – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Gastroenterology Unit

Overview:
Chronic reflux causing heartburn/regurgitation. Nursing priorities: lifestyle coaching, PPI adherence, alarm-feature screening.

Nursing Assessment:
- Meal timing, triggers (fatty foods, caffeine, alcohol), nocturnal symptoms, weight.

Key Monitoring:
- Symptom frequency, response to PPI, weight changes.

Nursing Interventions:
- Educate on small meals, avoid late eating, bed head elevation, weight loss.
- Administer PPIs; step-down when controlled per plan.

Patient Education:
- Avoid triggers: chocolate, mint, high-fat; don’t lie flat within 3 hours after meals.

When to Escalate:
- Dysphagia, bleeding, weight loss, persistent vomiting.

Documentation & Coordination:
- Symptom trajectory, education, GI referral if refractory.

Prognosis:
Excellent with lifestyle and tailored acid suppression.`,

    "Irritable Bowel Syndrome": `TITLE: Irritable Bowel Syndrome (IBS) – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Gastroenterology Unit

Overview:
Functional bowel disorder with abdominal pain related to defecation and altered stool form. Nursing focus: reassurance, diet strategies, symptom-directed meds adherence.

Nursing Assessment:
- Pain pattern, stool frequency/form, stress links; red flags screen.

Key Monitoring:
- Symptom diaries, response to diet/med changes; hydration.

Nursing Interventions:
- Support low-FODMAP trial (with dietitian), fiber titration; antispasmodics/laxatives/antidiarrheals per plan.
- Encourage stress reduction techniques.

Patient Education:
- Regular meals, hydration, sleep hygiene; trigger identification.

When to Escalate:
- Weight loss, bleeding, nocturnal symptoms, anemia.

Documentation & Coordination:
- Diet/med adjustments and effects; coordinate with dietitian/psych support.

Prognosis:
Chronic but manageable with individualized strategies.`,

    "Crohn’s Disease": `TITLE: Crohn’s Disease – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Gastroenterology Unit

Overview:
Chronic transmural IBD with skip lesions. Nursing priorities: flare support, nutrition, fistula/stricture awareness, biologic adherence.

Nursing Assessment:
- Pain, diarrhea, weight loss, perianal disease; hydration status.
- Medication history (steroids, immunomodulators, biologics).

Key Monitoring:
- Stool frequency, fever, anemia markers, infection risk on biologics.

Nursing Interventions:
- Administer therapies per plan; manage fluids/nutrition; stoma/perianal care if present.
- Vaccination review; TB/hepatitis screening awareness with biologics.

Patient Education:
- Flare recognition, adherence, smoking cessation, nutrition support.

When to Escalate:
- Severe pain, obstruction signs, high fever, significant bleeding.

Documentation & Coordination:
- Symptoms, responses, referrals to IBD nurse/dietitian/colorectal.

Prognosis:
Relapsing–remitting; modern therapy improves remission rates.`,

    "Ulcerative Colitis": `TITLE: Ulcerative Colitis – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Gastroenterology Unit

Overview:
Chronic colitis starting in rectum, continuous proximally. Nursing focus: flare support, bleeding monitoring, maintenance adherence, cancer surveillance reminders.

Nursing Assessment:
- Bloody diarrhea, urgency/tenesmus, cramps; hydration; weight.

Key Monitoring:
- Stool counts, vitals, anemia; infection signs on immunosuppression.

Nursing Interventions:
- Administer 5-ASA/steroids/biologics per plan; fluids; skin care for perianal irritation.

Patient Education:
- Maintenance adherence; flare action; surveillance colonoscopy schedule.

When to Escalate:
- Severe bleeding, abdominal distension, fever (toxic megacolon risk).

Documentation & Coordination:
- Symptom trend, treatments, education; IBD nurse liaison.

Prognosis:
Many maintain remission with modern therapy; surveillance reduces CRC risk.`,

    "Liver Cirrhosis": `TITLE: Liver Cirrhosis – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Gastroenterology Unit

Overview:
Advanced hepatic fibrosis with portal hypertension/complications. Nursing focus: ascites management, encephalopathy recognition, variceal bleed readiness, alcohol cessation support.

Nursing Assessment:
- Ascites, edema, jaundice, confusion, GI bleed history; alcohol intake.

Key Monitoring:
- Daily weights, abdominal girth, stool color, mental status (HE), electrolytes if ordered.

Nursing Interventions:
- Sodium restriction, diuretics per plan, lactulose for HE (titrate to 2–3 soft stools/day).
- Vaccinations, infection vigilance; fall risk management.

Patient Education:
- Absolute alcohol abstinence, low-salt diet, HE recognition, bleed red flags.

When to Escalate:
- Hematemesis/melena, worsening confusion, fever, refractory ascites.

Documentation & Coordination:
- I/O, girth, bowel charting, meds; coordinate with hepatology/addiction services.

Prognosis:
Depends on stage and etiology; nursing surveillance prevents decompensations.`,

    "Cholelithiasis (Gallstones)": `TITLE: Cholelithiasis (Gallstones) – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: General Surgery Unit

Overview:
Gallstones may be asymptomatic or cause biliary colic. Nursing focus: pain control, diet support, recognition of complications (cholecystitis, cholangitis, pancreatitis).

Nursing Assessment:
- RUQ pain post-fatty meals, radiation to back/shoulder, N/V.

Key Monitoring:
- Vitals, pain scores, fever/jaundice; labs per orders.

Nursing Interventions:
- Analgesia; low-fat diet counseling; pre/post-op education if surgery planned.

Patient Education:
- Recurrence risk; when to seek help for fever or persistent pain.

When to Escalate:
- Fever, Murphy’s sign, jaundice, persistent severe pain/vomiting.

Documentation & Coordination:
- Pain/response, diet advice, surgical liaison.

Prognosis:
Excellent after cholecystectomy; observe asymptomatic stones.`,

    "Urinary Tract Infection": `TITLE: Urinary Tract Infection (Uncomplicated) – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Urology/General Medicine Unit

Overview:
Lower UTI commonly in women; responds to short-course antibiotics. Nursing focus: symptom relief, hydration, adherence, recurrence prevention.

Nursing Assessment:
- Dysuria, frequency, urgency, suprapubic pain; fever/loin pain screening.

Key Monitoring:
- Temperature, pain, hydration; response within 48–72 h.

Nursing Interventions:
- Administer antibiotics per plan; analgesia; encourage fluids; hygiene education.

Patient Education:
- Post-coital voiding, hydration, avoid irritants; red flags (fever/flank pain).

When to Escalate:
- Fever/loin pain (pyelonephritis), pregnancy, no improvement in 72 h.

Documentation & Coordination:
- Symptom course, meds, advice; culture follow-up.

Prognosis:
Rapid improvement expected; recurrence strategies may be needed.`,

    "Benign Prostatic Hyperplasia": `TITLE: Benign Prostatic Hyperplasia (BPH) – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Urology Unit

Overview:
Prostate enlargement causing LUTS in aging men. Nursing focus: symptom scoring (IPSS), med adherence, fluid/caffeine counseling, retention recognition.

Nursing Assessment:
- Hesitancy, weak stream, nocturia, incomplete emptying; retention risk.

Key Monitoring:
- Post-void residual (if trained), UTI signs, med side effects (hypotension with alpha-blockers).

Nursing Interventions:
- Adherence to alpha-blockers/5-ARI; bladder training; evening fluid reduction.

Patient Education:
- Avoid decongestants; when to seek help (retention, hematuria, infection).

When to Escalate:
- Acute retention, recurrent UTIs, renal impairment signs.

Documentation & Coordination:
- IPSS trends, education, urology referral.

Prognosis:
Often controlled medically; procedures effective when needed.`,

    "Breast Cancer": `TITLE: Breast Cancer – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Oncology Unit

Overview:
Malignancy of breast tissue with varied subtypes. Nursing focus: treatment pathway navigation, symptom control, psychosocial support, lymphedema prevention.

Nursing Assessment:
- Treatment stage/pathway (surgery, chemo, radiation, endocrine, HER2-targeted).
- Wound/skin assessment, pain, fatigue, mood.

Key Monitoring:
- Chemo toxicities, infection risk (neutropenia), skin reactions to RT, menopausal symptoms on endocrine therapy.

Nursing Interventions:
- Wound care, pain control, antiemetics; neutropenic precautions if applicable.
- Arm care/lymphedema prevention education; prosthesis/support services info.

Patient Education:
- Adherence, side-effect reporting, fertility/sexual health discussion where relevant.

When to Escalate:
- Fever ≥38°C, uncontrolled pain, wound complications, severe RT skin reactions.

Documentation & Coordination:
- Symptom management, education, referrals (psychology, physio, social work).

Prognosis:
Highly variable; modern multimodal therapy improves survival.`,

    "Lung Cancer": `TITLE: Lung Cancer – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Oncology/Respiratory Unit

Overview:
NSCLC/SCLC; many present late. Nursing focus: symptom relief (cough, dyspnea, pain), treatment support (chemo/IO/targeted), smoking cessation.

Nursing Assessment:
- Cough, hemoptysis, SOB, weight loss, performance status.

Key Monitoring:
- Oxygen needs, pain control effectiveness, therapy side effects (immune-related AEs with IO).

Nursing Interventions:
- Oxygen per plan; bronchodilator/antitussives; pain/antiemetic regimens.
- Educate on IO toxicity red flags (rash, diarrhea, hepatitis symptoms).

Patient Education:
- Smoking cessation resources; nutrition; breathlessness strategies.

When to Escalate:
- Massive hemoptysis, severe dyspnea, infection signs on chemo, IO toxicities.

Documentation & Coordination:
- Symptom scores, adverse events, oncology liaison.

Prognosis:
Depends on stage/biomarkers; supportive nursing care improves QoL.`,

    "Skin Melanoma": `TITLE: Skin Melanoma – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Dermatology/Oncology Unit

Overview:
Malignant tumor from melanocytes. Nursing focus: post-excision care, systemic therapy support, sun-safety education.

Nursing Assessment:
- Surgical site, lymph node status, treatment plan (immunotherapy/targeted).

Key Monitoring:
- Wound healing, infection, IO toxicities (colitis, hepatitis, endocrinopathies).

Nursing Interventions:
- Wound care; pain control; educate on self-skin checks and sun protection.

Patient Education:
- ABCDE mole changes; SPF/UPF clothing; avoid tanning beds.

When to Escalate:
- Wound infection, systemic therapy toxicities, new suspicious lesions.

Documentation & Coordination:
- Site care, toxicities, education, follow-ups with oncology/derm.

Prognosis:
Excellent when caught early; systemic therapy improved advanced outcomes.`,

    "Hypothyroidism": `TITLE: Hypothyroidism – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Endocrinology Unit

Overview:
Underactive thyroid causing fatigue, weight gain, cold intolerance. Nursing focus: levothyroxine adherence/timing, symptom tracking, interaction counseling.

Nursing Assessment:
- Symptoms (fatigue, constipation), weight changes, skin/hair dryness.
- Review meds that affect absorption (iron, calcium), timing of dose.

Key Monitoring:
- Symptom improvement timeline; labs per orders (TSH) — awareness of targets.

Nursing Interventions:
- Educate: take levothyroxine on empty stomach, same time daily; separate from iron/calcium by ≥4 hours.
- Support adherence and side-effect monitoring (over-replacement: palpitations).

Patient Education:
- When to report symptoms; pregnancy considerations (dose changes).

When to Escalate:
- Severe lethargy, confusion, hypothermia (myxedema crisis signs).

Documentation & Coordination:
- Adherence, education, lab scheduling reminders.

Prognosis:
Excellent with correct dosing; periodic monitoring needed.`,

    "Gastric Ulcer": `TITLE: Gastric Ulcer – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Gastroenterology Unit

Overview:
(Follows Peptic Ulcer principles; emphasize H. pylori/NSAID link.) Nursing focus: PPI use, bleeding risk education, alarm symptom vigilance.

Nursing Assessment:
- Epigastric pain pattern, NSAID use, alarms (bleeding, weight loss).

Key Monitoring:
- Vitals, stool color, Hb if ordered.

Nursing Interventions:
- Administer PPI; facilitate H. pylori testing/eradication; NSAID avoidance plan.

Patient Education:
- Alarm symptoms, diet comfort measures (non-acidic), adherence.

When to Escalate:
- Hematemesis/melena, severe persistent pain, vomiting.

Documentation & Coordination:
- Meds, responses, education, GI follow-up.

Prognosis:
High healing with adherence; avoid offending agents.`,

    "Inflammatory Bowel Disease (General)": `TITLE: Inflammatory Bowel Disease – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Gastroenterology Unit

Overview:
Umbrella for Crohn’s and UC. Nursing focus: flare recognition, meds (5-ASA, steroids, biologics), nutrition, psychosocial support.

Nursing Assessment:
- Stool frequency/blood, pain, weight, hydration; perianal disease.

Key Monitoring:
- Fever, anemia, medication tolerability; infection risk.

Nursing Interventions:
- Admin per plan; skin/perianal care; nutrition/hydration support.

Patient Education:
- Flare triggers, adherence, vaccination, when to seek help.

When to Escalate:
- Severe bleeding, obstruction signs, sepsis.

Documentation & Coordination:
- Symptoms, treatments, referrals to IBD nurse/dietitian.

Prognosis:
Modern therapy improves remission and QoL.`,

    "Anxiety Disorder": `TITLE: Generalized Anxiety Disorder – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Psychiatry Unit

Overview:
Excessive worry with somatic symptoms. Nursing focus: coping skills, sleep/caffeine hygiene, SSRI/SNRI adherence, crisis risk screening.

Nursing Assessment:
- Worry domains, sleep, substance use; GAD-7 if used.

Key Monitoring:
- Medication side effects, functional impact, suicidality.

Nursing Interventions:
- Teach breathing/grounding; routine structure; encourage therapy adherence.

Patient Education:
- Caffeine moderation, exercise, worry scheduling.

When to Escalate:
- Panic with severe impairment, self-harm thoughts.

Documentation & Coordination:
- Symptoms, interventions, psych referral coordination.

Prognosis:
Often chronic but treatable with combined therapy.`,

    "Depression": `TITLE: Major Depressive Disorder – Nursing Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Psychiatry Unit

Overview:
Persistent low mood/anhedonia impairing function. Nursing focus: safety assessment, SSRI/SNRI adherence, sleep/activity structure, psychoeducation.

Nursing Assessment:
- PHQ-9 if used; sleep/appetite changes, thoughts of self-harm.

Key Monitoring:
- Activation/suicidality after med start, adherence, side effects.

Nursing Interventions:
- Support schedule building, gentle activity, social reconnection; monitor risk.

Patient Education:
- Time-to-effect of meds, side effects, relapse prevention.

When to Escalate:
- Active suicidal ideation/plan, psychosis, inability to care for self.

Documentation & Coordination:
- Safety plans, referrals, family involvement as appropriate.

Prognosis:
Good with treatment; maintenance reduces relapse.`,

    "Breath—(reserve)": `TITLE: Placeholder – remove or replace
Version: 1.0
Date: 2025-01-15
Responsible Department: General Medicine

Overview:
This placeholder exists to ensure a count of 30 if you swap topics later. Remove or replace with any additional disease-specific guideline you want.

Nursing Assessment:
- N/A

Key Monitoring:
- N/A

Nursing Interventions:
- N/A

Patient Education:
- N/A

When to Escalate:
- N/A

Documentation & Coordination:
- N/A

Prognosis:
- N/A`
};

// Remove placeholder if you already reached 30 with your own selection.
// (Left here in case you want to swap in a different condition later.)
if (Object.keys(diseaseGuidelines).length > 30) {
    delete diseaseGuidelines["Breath—(reserve)"];
}

// =================== WRITE FILES ===================
for (const [disease, content] of Object.entries(diseaseGuidelines)) {
    fs.writeFileSync(path.join(OUT_DIR, `${safe(disease)}.txt`), content, "utf8");
}
console.log(`Generated ${Object.keys(diseaseGuidelines).length} nurse guidelines in ${OUT_DIR}`);
