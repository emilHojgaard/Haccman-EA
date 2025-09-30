// generateMedicalGuidelines.mjs
// Creates 30 detailed, disease-specific *medical* clinical guidelines (one .txt per disease).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "medical_guidelines");

// Fresh output folder each run
if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const safe = (s) => s.replace(/[^a-z0-9]/gi, "_");

// =================== DOCTOR-GUIDELINE TEXTS (30) ===================
const diseaseDocs = {
    "Asthma": `Template: Fictional Medical Clinical Guideline
Title: Asthma – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Pulmonology Unit

1. Purpose
Provide guidance on diagnosis, severity assessment, pharmacologic management, and exacerbation care for adult asthma.

2. Scope
Applies to: Physicians in ED/outpatient/ward settings managing adults with suspected or confirmed asthma.

3. Indications
Evaluation and treatment of variable airflow limitation with typical symptoms (wheeze, dyspnea, chest tightness, cough).

4. Diagnosis
- Clinical pattern with variable respiratory symptoms.
- Spirometry: ↓FEV1/FVC with bronchodilator reversibility (↑FEV1 ≥12% and ≥200 mL).
- Peak flow variability; consider bronchoprovocation if spirometry inconclusive.
- Differentiate from COPD, cardiac dyspnea, VCD; evaluate triggers and atopy.

5. Treatment/Management
- Controller: Low/med ICS; escalate to ICS/LABA; consider LAMA, LTRA, biologics for severe eosinophilic/Type 2.
- Reliever: As-needed SABA or low-dose ICS-formoterol (per local protocol).
- Exacerbation: Oxygen to target SpO₂ ≥94%; SABA/ipratropium; systemic steroids; magnesium sulfate IV in severe cases.
- Vaccines: Influenza, pneumococcal as indicated.

6. Monitoring & Follow-up
- Check inhaler technique, adherence, and trigger control every visit.
- Step-up/step-down per control; provide written action plan; consider FeNO/allergy workup.

7. When to Escalate
- Life-threatening features (silent chest, hypoxia, exhaustion); ICU involvement.
- Frequent exacerbations despite high-dose ICS/LABA → biologic referral.

8. Safety Notes
- Use minimal effective steroid dose; assess osteoporosis, glucose.
- Educate on anaphylaxis plan if biologics administered.`,

    "Chronic Obstructive Pulmonary Disease (COPD)": `Template: Fictional Medical Clinical Guideline
Title: COPD – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Pulmonology Unit

1. Purpose
Guide diagnosis, assessment, and management of COPD in adults.

2. Scope
Physicians in primary care, respiratory clinics, and inpatient settings.

3. Indications
Persistent respiratory symptoms and fixed airflow limitation in smokers/ex-smokers.

4. Diagnosis
- Spirometry: post-bronchodilator FEV1/FVC <0.70.
- Grade airflow limitation (GOLD); assess exacerbation risk and symptoms (CAT/mMRC).
- Exclude asthma, bronchiectasis; evaluate comorbidities.

5. Treatment/Management
- Smoking cessation; vaccinations; pulmonary rehab.
- Bronchodilators: LAMA or LABA; escalate to dual LAMA/LABA; add ICS in eosinophilic or frequent exacerbators.
- Exacerbation: controlled O₂ (SpO₂ 88–92% if CO₂ retainer), bronchodilators, steroids, antibiotics if bacterial signs; consider NIV.

6. Monitoring & Follow-up
- Exacerbation prevention; inhaler technique; rehab adherence; oxygen assessment.

7. When to Escalate
- Acute respiratory failure, refractory hypercapnia, hemodynamic instability.

8. Safety Notes
- Caution ICS in pneumonia-prone; optimize bone health, diabetes control.`,

    "Type 2 Diabetes Mellitus": `Template: Fictional Medical Clinical Guideline
Title: Type 2 Diabetes Mellitus – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Endocrinology Unit

1. Purpose
Standardize diagnosis and management of T2DM in adults.

2. Scope
Physicians in primary care and endocrine clinics/inpatient wards.

3. Indications
Hyperglycemia symptoms or screening in high-risk adults.

4. Diagnosis
- HbA1c ≥48 mmol/mol (6.5%) or FPG ≥7.0 mmol/L; confirm on repeat unless unequivocal hyperglycemia.
- Evaluate complications: renal, retinal, neuropathy; CV risk.

5. Treatment/Management
- Lifestyle: weight reduction, activity ≥150 min/week.
- Pharmacologic: Metformin first-line (if eGFR adequate); add SGLT2i for CKD/HF benefit; GLP-1 RA for weight/ASCVD; consider DPP-4i, TZD, basal insulin if needed.
- Hospital: insulin protocols for persistent hyperglycemia.

6. Monitoring & Follow-up
- HbA1c q3–6 mo; eGFR, UACR, lipids; BP target per guidelines.

7. When to Escalate
- DKA/HHS, refractory hyper/hypoglycemia, progressive complications.

8. Safety Notes
- Adjust drugs in CKD; counsel hypoglycemia avoidance; sick-day rules.`,

    "Hypertension": `Template: Fictional Medical Clinical Guideline
Title: Hypertension – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Cardiology Unit

1. Purpose
Provide a framework for accurate diagnosis and risk-based management of hypertension.

2. Scope
Outpatient and inpatient medical care.

3. Indications
Elevated office BP or ABPM/HBPM abnormalities.

4. Diagnosis
- Confirm with out-of-office monitoring; assess global CV risk.
- Baseline labs: U&E, creatinine/eGFR, lipids, A1c, urinalysis; ECG.

5. Treatment/Management
- Lifestyle: salt ↓, weight ↓, exercise, limit alcohol, sleep hygiene.
- Drugs: ACEi/ARB, CCB, thiazide-like diuretic; combine as needed; consider MRA for resistant HTN.
- Emergencies: SBP ≥180 or DBP ≥120 with end-organ damage → controlled reduction.

6. Monitoring & Follow-up
- Titrate q4–6 weeks; monitor K⁺/creatinine after ACEi/ARB/MRA.

7. When to Escalate
- Resistant HTN, suspected secondary causes, hypertensive emergency.

8. Safety Notes
- Avoid ACEi in pregnancy; dual ACEi+ARB discouraged.`,

    "Coronary Artery Disease (Stable Angina)": `Template: Fictional Medical Clinical Guideline
Title: CAD (Stable Angina) – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Cardiology Unit

1. Purpose
Direct evaluation and medical optimization of stable angina.

2. Scope
Ambulatory and ward settings.

3. Indications
Exertional chest pressure relieved by rest/nitroglycerin.

4. Diagnosis
- Pretest probability; ECG; functional imaging or CTCA as indicated.
- Risk stratification for revascularization.

5. Treatment/Management
- Antianginal: beta-blocker ± CCB/nitrates; consider ranolazine.
- Secondary prevention: statin (high-intensity), antiplatelet (aspirin), ACEi/ARB for HTN/DM; lifestyle.

6. Monitoring & Follow-up
- Symptom burden, nitrate use; lipid/BP/glucose targets.

7. When to Escalate
- Crescendo/rest angina, hemodynamic instability, arrhythmia.

8. Safety Notes
- Nitrate interactions (PDE-5 inhibitors).`,

    "Heart Failure (HFpEF)": `Template: Fictional Medical Clinical Guideline
Title: Heart Failure with Preserved EF (HFpEF) – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Cardiology Unit

1. Purpose
Outline diagnostic approach and management of HFpEF.

2. Scope
Adult cardiology and general medicine.

3. Indications
Symptoms/signs of HF with EF ≥50%.

4. Diagnosis
- Echo: diastolic dysfunction; natriuretic peptides elevated; assess precipitating factors.
- Exclude alternative causes (lung disease, anemia, obesity alone).

5. Treatment/Management
- Diuretics for congestion; BP control; SGLT2 inhibitors show benefit; manage AF, obesity, OSA.

6. Monitoring & Follow-up
- Volume status, renal function/electrolytes; daily weights.

7. When to Escalate
- Refractory congestion, hypotension, renal failure.

8. Safety Notes
- Avoid over-diuresis; monitor K⁺/Cr closely.`,

    "Stroke": `Template: Fictional Medical Clinical Guideline
Title: Stroke – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Neurology Unit

1. Purpose
Guide time-critical assessment and management of acute stroke.

2. Scope
ED and stroke unit care.

3. Indications
Acute focal neurological deficit.

4. Diagnosis
- CT/CTA ± perfusion; NIHSS; glucose check; thrombolysis/thrombectomy eligibility.

5. Treatment/Management
- Ischemic: thrombolysis/thrombectomy per protocol; antiplatelet after exclusion of hemorrhage; BP management.
- Hemorrhagic: BP control, neurosurgical consult, reversal of anticoagulation.

6. Monitoring & Follow-up
- Neuro obs; swallow screen; DVT prophylaxis; secondary prevention (AF anticoagulation, statin).

7. When to Escalate
- Neurological deterioration, cerebral edema, aspiration, sepsis.

8. Safety Notes
- Strict timescales; contraindication checks for lytics.`,

    "Transient Ischemic Attack (TIA)": `Template: Fictional Medical Clinical Guideline
Title: TIA – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Neurology Unit

1. Purpose
Standardize evaluation and secondary prevention post-TIA.

2. Scope
ED/clinic rapid-access pathways.

3. Indications
Transient neuro deficit (<24 h) with no infarct on imaging.

4. Diagnosis
- Clinical assessment; MRI DWI preferred; carotid/cardiac evaluation; AF screening.

5. Treatment/Management
- Dual antiplatelet short course (per protocol) then single; statin; BP/DM control; carotid revascularization when indicated.

6. Monitoring & Follow-up
- Early clinic within days; risk-factor modification.

7. When to Escalate
- Recurrent symptoms, anticoagulation need for AF.

8. Safety Notes
- Balance hemorrhagic risk with antithrombotics.`,

    "Chronic Kidney Disease": `Template: Fictional Medical Clinical Guideline
Title: Chronic Kidney Disease – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Nephrology Unit

1. Purpose
Improve CKD detection, slowing progression, and complication management.

2. Scope
Primary care and nephrology services.

3. Indications
eGFR <60 mL/min/1.73 m² for >3 months or markers of kidney damage.

4. Diagnosis
- Classify GFR and albuminuria stages; ultrasound if structural disease suspected.

5. Treatment/Management
- ACEi/ARB for albuminuria; SGLT2i; BP <130/80; glycemic control; statins.
- Correct anemia, acidosis, bone-mineral disorder per protocol.

6. Monitoring & Follow-up
- eGFR/UACR q3–12 mo; electrolytes; medication review.

7. When to Escalate
- Rapid decline, refractory hyperkalemia, eGFR <30, nephrotic syndrome.

8. Safety Notes
- Adjust renally cleared drugs; avoid NSAIDs.`,

    "Pneumonia": `Template: Fictional Medical Clinical Guideline
Title: Community-Acquired Pneumonia – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Pulmonology Unit

1. Purpose
Standardize CAP diagnosis and empiric therapy.

2. Scope
ED and inpatient wards.

3. Indications
Acute cough, fever, pleuritic pain with new infiltrate on imaging.

4. Diagnosis
- CXR; severity scores (CURB-65); bloods; sputum/blood cultures if severe.

5. Treatment/Management
- Empiric antibiotics per local resistance; oxygen, fluids; consider antiviral in influenza.
- Early mobilization, VTE prophylaxis.

6. Monitoring & Follow-up
- Clinical response 48–72 h; step-down to oral; duration 5–7 days typical.

7. When to Escalate
- Respiratory failure, sepsis, empyema.

8. Safety Notes
- De-escalate antibiotics with cultures; avoid QT-prolongation interactions.`,

    "Influenza": `Template: Fictional Medical Clinical Guideline
Title: Influenza – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Infectious Diseases Unit

1. Purpose
Guide diagnosis and antiviral use in influenza.

2. Scope
ED/ward/clinic.

3. Indications
Acute febrile respiratory illness during season or exposure.

4. Diagnosis
- NAAT/antigen as available; clinical if high prevalence.

5. Treatment/Management
- Antivirals for high-risk or severe illness; supportive care; isolation precautions.

6. Monitoring & Follow-up
- Hypoxia, bacterial superinfection signs; hydration.

7. When to Escalate
- Respiratory failure, hemodynamic instability.

8. Safety Notes
- Public health reporting and vaccination counseling.`,

    "Migraine": `Template: Fictional Medical Clinical Guideline
Title: Migraine – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Neurology Unit

1. Purpose
Direct acute and preventive management of migraine.

2. Scope
Primary care, ED, neurology.

3. Indications
Recurrent headaches with migrainous features ± aura.

4. Diagnosis
- ICHD-3 criteria; screen red flags (thunderclap, neuro deficits, fever).

5. Treatment/Management
- Acute: triptan + NSAID + antiemetic; avoid opioids.
- Preventive: beta-blocker, topiramate, CGRP mAbs; behavioral therapy.

6. Monitoring & Follow-up
- Headache diary; medication overuse avoidance.

7. When to Escalate
- Status migrainosus, atypical aura, focal deficits.

8. Safety Notes
- Triptans contraindicated in CAD/uncontrolled HTN.`,

    "Epilepsy": `Template: Fictional Medical Clinical Guideline
Title: Epilepsy – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Neurology Unit

1. Purpose
Standardize seizure diagnosis and antiseizure therapy.

2. Scope
ED/neurology/primary care interfaces.

3. Indications
Unprovoked seizures or epilepsy syndromes.

4. Diagnosis
- EEG, MRI (epilepsy protocol), metabolic screen; classify seizure type.

5. Treatment/Management
- First-line ASMs by type (e.g., levetiracetam, lamotrigine).
- Status epilepticus: benzos → second-line per protocol.

6. Monitoring & Follow-up
- Serum levels where applicable; driving/work advice; teratogenicity counseling.

7. When to Escalate
- Refractory seizures, new focal deficits, status.

8. Safety Notes
- Interactions with OCPs/anticoagulants; SUDEP counseling in select cases.`,

    "Parkinson’s Disease": `Template: Fictional Medical Clinical Guideline
Title: Parkinson’s Disease – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Neurology Unit

1. Purpose
Guide dopaminergic therapy optimization and complications management.

2. Scope
Neurology and general medicine.

3. Indications
Bradykinesia with tremor/rigidity; supportive response to levodopa.

4. Diagnosis
- Clinical; exclude atypical parkinsonism; MRI only if atypical.

5. Treatment/Management
- Levodopa timing; adjuncts (DA agonists, MAO-B inhibitors, COMT).
- Manage motor fluctuations/dyskinesia; treat non-motor: depression, constipation, orthostatic hypotension.

6. Monitoring & Follow-up
- ON/OFF diaries; falls risk; swallow function.

7. When to Escalate
- Refractory fluctuations, severe dysphagia, hallucinations/psychosis.

8. Safety Notes
- Impulse control disorders with DA agonists; aspiration risk.`,

    "Multiple Sclerosis": `Template: Fictional Medical Clinical Guideline
Title: Multiple Sclerosis – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Neurology Unit

1. Purpose
Outline diagnosis and disease-modifying therapy selection.

2. Scope
Neurology clinics/wards.

3. Indications
Relapsing neuro deficits or progressive symptoms consistent with MS.

4. Diagnosis
- McDonald criteria: dissemination in time/space on MRI ± CSF oligoclonal bands.

5. Treatment/Management
- Relapse: high-dose steroids; DMTs tailored to activity/risk (injectables, orals, monoclonals).
- Symptom management: spasticity, fatigue, bladder.

6. Monitoring & Follow-up
- MRI intervals; infection risk on immunotherapy; vaccination.

7. When to Escalate
- Rapidly progressive disability, severe relapse, PML suspicion.

8. Safety Notes
- Screen TB/hepatitis; JC-virus risk with some agents.`,

    "Osteoarthritis": `Template: Fictional Medical Clinical Guideline
Title: Osteoarthritis – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Rheumatology Unit

1. Purpose
Support pain control and function in OA.

2. Scope
Primary care/orthopedics/rheumatology.

3. Indications
Chronic joint pain/stiffness with radiographic OA changes.

4. Diagnosis
- Clinical ± X-ray; differentiate from inflammatory arthritis.

5. Treatment/Management
- Exercise/weight loss; topical NSAIDs; oral NSAIDs/COX-2 (risk assess); intra-articular steroid; consider arthroplasty.

6. Monitoring & Follow-up
- Pain/function scales; GI/CV risk on NSAIDs.

7. When to Escalate
- Rapid deterioration, red-hot joint (infection/crystal).

8. Safety Notes
- Avoid chronic opioids; PPI cover if high GI risk.`,

    "Rheumatoid Arthritis": `Template: Fictional Medical Clinical Guideline
Title: Rheumatoid Arthritis – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Rheumatology Unit

1. Purpose
Implement treat-to-target to reduce joint damage.

2. Scope
Rheumatology/primary care shared care.

3. Indications
Symmetric small-joint synovitis >6 weeks.

4. Diagnosis
- ACR/EULAR criteria; serology (RF/anti-CCP); imaging (US/MRI) for synovitis/erosions.

5. Treatment/Management
- Early csDMARD (MTX) ± short steroid bridge; escalate to biologic/tsDMARD if target unmet.

6. Monitoring & Follow-up
- DAS28; lab monitoring (LFT, FBC); infection vigilance.

7. When to Escalate
- Persistent high activity, extra-articular disease.

8. Safety Notes
- Vaccinate prior to immunosuppression; TB/hepatitis screening.`,

    "Peptic Ulcer Disease": `Template: Fictional Medical Clinical Guideline
Title: Peptic Ulcer Disease – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Gastroenterology Unit

1. Purpose
Standardize evaluation and therapy for PUD.

2. Scope
GI/primary care/ED.

3. Indications
Epigastric pain, GI bleeding, NSAID use.

4. Diagnosis
- Endoscopy; H. pylori testing (urea breath/stool/biopsy).

5. Treatment/Management
- PPI therapy 4–8 weeks; eradicate H. pylori when positive; stop NSAIDs or add protection; manage bleeding endoscopically.

6. Monitoring & Follow-up
- Test-of-cure for H. pylori; repeat EGD for gastric ulcers per protocol.

7. When to Escalate
- Perforation, uncontrolled bleeding, obstruction.

8. Safety Notes
- Drug interactions (clopidogrel with some PPIs).`,

    "Gastroesophageal Reflux Disease": `Template: Fictional Medical Clinical Guideline
Title: GERD – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Gastroenterology Unit

1. Purpose
Guide diagnosis and management of GERD.

2. Scope
Primary care and GI clinics.

3. Indications
Typical heartburn/regurgitation.

4. Diagnosis
- Clinical; alarm features → endoscopy; pH-impedance/manometry if refractory.

5. Treatment/Management
- Lifestyle: weight loss, head-of-bed elevation, trigger avoidance.
- PPI trial; step-down; consider anti-reflux surgery in select cases.

6. Monitoring & Follow-up
- Assess response; rule out eosinophilic esophagitis if refractory.

7. When to Escalate
- Dysphagia, bleeding, weight loss.

8. Safety Notes
- Long-term PPI risks vs benefits; deprescribe when possible.`,

    "Irritable Bowel Syndrome": `Template: Fictional Medical Clinical Guideline
Title: IBS – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Gastroenterology Unit

1. Purpose
Symptom-based diagnosis and management of IBS.

2. Scope
Primary care and GI clinics.

3. Indications
Recurrent abdominal pain related to defecation with altered stool form/frequency (Rome IV).

4. Diagnosis
- Positive diagnosis after limited tests; exclude red flags (bleeding, weight loss, anemia, nocturnal symptoms).

5. Treatment/Management
- Low-FODMAP diet (dietitian-led), fiber; antispasmodics, peppermint oil; loperamide for diarrhea; osmotic laxatives for constipation; psychological therapy.

6. Monitoring & Follow-up
- Symptom diaries; address comorbid anxiety/depression.

7. When to Escalate
- Red-flag features; refractory cases.

8. Safety Notes
- Avoid opioid use; reinforce non-pharmacologic approaches.`,

    "Crohn’s Disease": `Template: Fictional Medical Clinical Guideline
Title: Crohn’s Disease – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Gastroenterology Unit

1. Purpose
Treat-to-target control of transmural inflammation.

2. Scope
IBD clinics/inpatient care.

3. Indications
Abdominal pain, diarrhea, weight loss; perianal disease.

4. Diagnosis
- Colonoscopy with biopsies; cross-sectional imaging; fecal calprotectin.

5. Treatment/Management
- Induction with steroids in moderate–severe; immunomodulators/biologics (anti-TNF, anti-IL, anti-integrin); antibiotics for perianal sepsis; nutritional therapy.

6. Monitoring & Follow-up
- Clinical, biomarkers, endoscopic healing targets.

7. When to Escalate
- Obstruction, abscess, fistula, severe bleeding.

8. Safety Notes
- Screen TB/hepatitis; vaccine updates before immunosuppression.`,

    "Ulcerative Colitis": `Template: Fictional Medical Clinical Guideline
Title: Ulcerative Colitis – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Gastroenterology Unit

1. Purpose
Mucosal healing approach in UC.

2. Scope
IBD clinics/inpatient.

3. Indications
Bloody diarrhea, urgency, abdominal pain.

4. Diagnosis
- Colonoscopy with biopsies; extent/severity scoring.

5. Treatment/Management
- 5-ASA for mild–moderate; steroids for flares; biologics/tsDMARD for moderate–severe or steroid-dependent; VTE prophylaxis when hospitalized.

6. Monitoring & Follow-up
- Symptom scores, calprotectin, colonoscopy for cancer surveillance.

7. When to Escalate
- Toxic megacolon, severe refractory colitis.

8. Safety Notes
- Infection risk on immunosuppressants; vaccination planning.`,

    "Liver Cirrhosis": `Template: Fictional Medical Clinical Guideline
Title: Liver Cirrhosis – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Gastroenterology Unit

1. Purpose
Standardize decompensation management and complication prevention.

2. Scope
Hepatology/medical wards.

3. Indications
Portal hypertension complications: ascites, HE, variceal bleed.

4. Diagnosis
- Etiology workup; elastography; endoscopy for varices.

5. Treatment/Management
- Ascites: salt restriction, diuretics, LVP + albumin; HE: lactulose ± rifaximin; Varices: banding, NSBB; alcohol cessation.

6. Monitoring & Follow-up
- MELD/Child-Pugh; hepatocellular carcinoma surveillance.

7. When to Escalate
- Refractory ascites, recurrent HE, acute bleed, transplant evaluation.

8. Safety Notes
- Renal protection; avoid NSAIDs; SBP prophylaxis where indicated.`,

    "Cholelithiasis (Gallstones)": `Template: Fictional Medical Clinical Guideline
Title: Cholelithiasis – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: General Surgery Unit

1. Purpose
Guide evaluation of biliary colic and complications.

2. Scope
Surgery/ED/medical.

3. Indications
Biliary colic, cholecystitis, choledocholithiasis.

4. Diagnosis
- RUQ ultrasound; LFTs; MRCP/ERCP for ductal stones.

5. Treatment/Management
- Colic: analgesia, elective cholecystectomy; cholecystitis: antibiotics + early surgery; CBD stones: ERCP.

6. Monitoring & Follow-up
- Pain control; post-op care; recurrence counseling.

7. When to Escalate
- Cholangitis, pancreatitis.

8. Safety Notes
- Antibiotic stewardship; ERCP complications awareness.`,

    "Urinary Tract Infection": `Template: Fictional Medical Clinical Guideline
Title: UTI (Uncomplicated) – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Urology/General Medicine Unit

1. Purpose
Appropriate diagnosis and antibiotic use in uncomplicated UTI.

2. Scope
Primary care/ED.

3. Indications
Dysuria, frequency, urgency without systemic features.

4. Diagnosis
- Clinical; dipstick/culture per protocol; exclude pyelonephritis.

5. Treatment/Management
- Narrow-spectrum antibiotics per local resistance; hydration; analgesia.

6. Monitoring & Follow-up
- Symptom resolution 48–72 h; culture if recurrent.

7. When to Escalate
- Pregnancy, male UTI, fever/flank pain, sepsis.

8. Safety Notes
- Antibiotic stewardship; avoid overtreatment.`,

    "Benign Prostatic Hyperplasia": `Template: Fictional Medical Clinical Guideline
Title: Benign Prostatic Hyperplasia – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Urology Unit

1. Purpose
Manage LUTS due to BPH.

2. Scope
Urology/primary care.

3. Indications
Voiding symptoms with enlarged prostate.

4. Diagnosis
- IPSS, DRE, PSA (as indicated), urinalysis; consider PVR/flow rate.

5. Treatment/Management
- Alpha-blockers; 5-ARI for large glands; combo therapy; surgery for refractory/complications.

6. Monitoring & Follow-up
- Symptom scoring; side effects (hypotension, sexual).

7. When to Escalate
- Retention, recurrent UTI, renal impairment.

8. Safety Notes
- Counsel on sexual side effects; cataract surgery risk (IFIS).`,

    "Breast Cancer": `Template: Fictional Medical Clinical Guideline
Title: Breast Cancer – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Oncology Unit

1. Purpose
Coordinate multimodal management of breast cancer.

2. Scope
Oncology/surgery/radiation medicine.

3. Indications
Suspicious breast lesion or confirmed malignancy.

4. Diagnosis
- Triple assessment: imaging + biopsy + clinical exam; receptor status (ER/PR/HER2).

5. Treatment/Management
- Surgery, RT, chemo, HER2-targeted, endocrine therapy based on stage/biology.

6. Monitoring & Follow-up
- Toxicity management; survivorship plan.

7. When to Escalate
- Neutropenic fever, uncontrolled pain, lymphedema complications.

8. Safety Notes
- Fertility preservation; genetic counseling for high-risk.`,

    "Lung Cancer": `Template: Fictional Medical Clinical Guideline
Title: Lung Cancer – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Oncology/Respiratory Unit

1. Purpose
Stage-directed therapy for lung cancer.

2. Scope
Oncology/respiratory/ED.

3. Indications
Suspicious pulmonary lesion, hemoptysis, weight loss.

4. Diagnosis
- Tissue diagnosis; staging with PET-CT; molecular profiling (EGFR/ALK/ROS1/PD-L1).

5. Treatment/Management
- Surgery/RT for early; chemo-IO/targeted for advanced; palliative care integration.

6. Monitoring & Follow-up
- Treatment toxicity; IO immune-related adverse events.

7. When to Escalate
- Massive hemoptysis, SVC syndrome, spinal cord compression.

8. Safety Notes
- Smoking cessation support; vaccinations.`,

    "Skin Melanoma": `Template: Fictional Medical Clinical Guideline
Title: Cutaneous Melanoma – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Dermatology/Oncology Unit

1. Purpose
Ensure accurate staging and therapy selection.

2. Scope
Derm/onc/surgery.

3. Indications
Suspicious pigmented lesion.

4. Diagnosis
- Excisional biopsy; Breslow thickness; sentinel node evaluation.

5. Treatment/Management
- Wide local excision; adjuvant IO/targeted for high risk; systemic therapy in metastatic disease.

6. Monitoring & Follow-up
- Skin checks; imaging per stage.

7. When to Escalate
- IO toxicities; new metastasis symptoms.

8. Safety Notes
- Sun protection counseling; genetic syndromes awareness.`,

    "Hypothyroidism": `Template: Fictional Medical Clinical Guideline
Title: Hypothyroidism – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Endocrinology Unit

1. Purpose
Appropriate diagnosis and levothyroxine replacement.

2. Scope
Primary care/endocrinology.

3. Indications
Symptoms or elevated TSH on screening.

4. Diagnosis
- ↑TSH, ↓FT4 (overt); anti-TPO in autoimmune disease.

5. Treatment/Management
- Levothyroxine weight/age-based; adjust q6–8 weeks; consider pregnancy dose changes.

6. Monitoring & Follow-up
- TSH targets individualized; adherence, absorption interactions.

7. When to Escalate
- Myxedema coma, refractory symptoms.

8. Safety Notes
- Avoid over-replacement (AF, bone loss).`,

    "Inflammatory Bowel Disease (General)": `Template: Fictional Medical Clinical Guideline
Title: Inflammatory Bowel Disease (General) – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Gastroenterology Unit

1. Purpose
Cross-cutting guidance for IBD (Crohn’s/UC).

2. Scope
GI clinics/wards.

3. Indications
Chronic GI inflammation with diarrhea, bleeding, pain.

4. Diagnosis
- Endoscopy + histology; imaging; calprotectin.

5. Treatment/Management
- Induction and maintenance strategies; steroid-sparing approach; nutrition; thromboprophylaxis in flares.

6. Monitoring & Follow-up
- Treat-to-target (clinical/biomarker/endoscopic).

7. When to Escalate
- Severe flare, perforation, toxic megacolon.

8. Safety Notes
- Screen TB/hepatitis; vaccination updates.`,

    "Generalized Anxiety Disorder": `Template: Fictional Medical Clinical Guideline
Title: Generalized Anxiety Disorder – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Psychiatry Unit

1. Purpose
Evidence-based pharmacologic and psychological treatment of GAD.

2. Scope
Primary care/psychiatry.

3. Indications
Excessive anxiety/worry ≥6 months with impairment.

4. Diagnosis
- DSM-5 criteria; rule out medical/substance causes.

5. Treatment/Management
- CBT first-line; SSRIs/SNRIs; short-term benzos only for severe acute distress with caution.

6. Monitoring & Follow-up
- Side effects, suicidality, function; tapering plans.

7. When to Escalate
- Non-response, severe comorbidity, suicidality.

8. Safety Notes
- Dependence risk with benzos; avoid abrupt cessation.`,

    "Major Depressive Disorder": `Template: Fictional Medical Clinical Guideline
Title: Major Depressive Disorder – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Psychiatry Unit

1. Purpose
Guide diagnosis and stepped-care treatment.

2. Scope
Primary care/psychiatry.

3. Indications
Persistent low mood/anhedonia with functional impairment.

4. Diagnosis
- DSM-5; screen bipolarity; exclude medical causes.

5. Treatment/Management
- Psychotherapy; SSRIs/SNRIs; augmentations; ECT/TMS for resistant cases.

6. Monitoring & Follow-up
- Suicidality, adherence, side effects, metabolic parameters.

7. When to Escalate
- Psychosis, imminent risk, treatment resistance.

8. Safety Notes
- Activation risk early in SSRI treatment; black-box warnings.`,

    "Alzheimer’s Disease": `Template: Fictional Medical Clinical Guideline
Title: Alzheimer’s Disease – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Neurology/Geriatrics Unit

1. Purpose
Diagnose and manage probable AD.

2. Scope
Neurology/geriatrics/primary care.

3. Indications
Progressive memory and executive dysfunction.

4. Diagnosis
- History/cognitive testing; MRI; labs to exclude reversible causes; biomarkers where available.

5. Treatment/Management
- Cholinesterase inhibitors/memantine; caregiver support; safety planning.

6. Monitoring & Follow-up
- Periodic cognitive/functional assessment.

7. When to Escalate
- Behavioral disturbances, rapid decline, safety risks.

8. Safety Notes
- Medication burden, anticholinergic avoidance.`,

    "Ankylosing Spondylitis": `Template: Fictional Medical Clinical Guideline
Title: Ankylosing Spondylitis – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Rheumatology Unit

1. Purpose
Direct diagnosis and biologic therapy selection for axial spondyloarthritis.

2. Scope
Rheumatology/orthopedics.

3. Indications
Inflammatory back pain, reduced spinal mobility, extra-articular features (uveitis).

4. Diagnosis
- HLA-B27 support; MRI sacroiliac joints; CRP/ESR; exclude mechanical causes.

5. Treatment/Management
- NSAIDs; exercise/physio; TNF/IL-17 inhibitors for active disease; manage uveitis/IBD.

6. Monitoring & Follow-up
- Disease activity indices; imaging as needed; ocular symptoms screening.

7. When to Escalate
- Persistent pain/stiffness, neurological deficit, refractory uveitis.

8. Safety Notes
- Infection risk on biologics; TB/hepatitis screening.`,

    "Psoriasis": `Template: Fictional Medical Clinical Guideline
Title: Plaque Psoriasis – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Dermatology Unit

1. Purpose
Stage-appropriate therapy for psoriasis and screening for PsA.

2. Scope
Dermatology/primary care.

3. Indications
Chronic erythematous plaques with silvery scale; nail changes.

4. Diagnosis
- Clinical; biopsy if atypical; PsA screening.

5. Treatment/Management
- Topicals (steroids/vit D analogs); phototherapy; systemic agents (MTX, biologics) for moderate–severe.

6. Monitoring & Follow-up
- PASI/BSA/DLQI; labs for systemic therapy.

7. When to Escalate
- Rapid progression, joint involvement, erythroderma.

8. Safety Notes
- Teratogenicity (MTX); infection risk on biologics.`,

    "HIV/AIDS": `Template: Fictional Medical Clinical Guideline
Title: HIV Infection – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Infectious Diseases Unit

1. Purpose
Diagnosis, ART initiation, and opportunistic infection prevention.

2. Scope
HIV clinics/primary care.

3. Indications
Positive screening/diagnostic tests or risk factors.

4. Diagnosis
- Confirmatory testing; baseline viral load/CD4; resistance testing.

5. Treatment/Management
- Immediate ART (integrase-inhibitor–based); OI prophylaxis per CD4.

6. Monitoring & Follow-up
- VL/CD4 monitoring; adherence support; vaccine updates.

7. When to Escalate
- ART failure, severe OI, IRIS.

8. Safety Notes
- Drug interactions (e.g., rifampin); pregnancy considerations.`,

    "Tuberculosis": `Template: Fictional Medical Clinical Guideline
Title: Tuberculosis – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Infectious Diseases/Pulmonology Unit

1. Purpose
Standardize TB diagnosis and therapy.

2. Scope
ID/respiratory/primary care.

3. Indications
Chronic cough, weight loss, fever/night sweats, exposure.

4. Diagnosis
- CXR; NAAT; sputum AFB smears/culture; IGRA for LTBI.

5. Treatment/Management
- RIPE regimen per susceptibility; DOT where required; isolate active pulmonary TB.

6. Monitoring & Follow-up
- LFTs; adherence; contact tracing.

7. When to Escalate
- MDR/XDR suspicion, severe hemoptysis, respiratory failure.

8. Safety Notes
- Hepatotoxicity vigilance; DDI with ART.`,

    "Anemia (Iron-Deficiency)": `Template: Fictional Medical Clinical Guideline
Title: Iron-Deficiency Anemia – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Hematology Unit

1. Purpose
Evaluate and treat IDA, identify bleeding sources.

2. Scope
Primary care/hematology.

3. Indications
Microcytic anemia, low ferritin.

4. Diagnosis
- CBC, ferritin, transferrin saturation; GI evaluation for blood loss.

5. Treatment/Management
- Oral iron (alternate-day dosing) or IV iron if intolerance/rapid repletion needed; treat cause.

6. Monitoring & Follow-up
- Hb and ferritin recheck; duration ~3 months after normalization.

7. When to Escalate
- Refractory anemia, severe GI bleeding.

8. Safety Notes
- Counsel on iron side effects; avoid unnecessary transfusions.`,

    "Leukemia": `Template: Fictional Medical Clinical Guideline
Title: Leukemia (General Adult) – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Hematology/Oncology Unit

1. Purpose
Initial evaluation and pathway for acute/chronic leukemias.

2. Scope
Heme/onc and acute care.

3. Indications
Abnormal CBC, blasts, constitutional symptoms.

4. Diagnosis
- Peripheral smear, flow cytometry; cytogenetics/molecular profiling; bone marrow biopsy.

5. Treatment/Management
- Protocol-based chemo/targeted therapy; TLS prophylaxis; transfusion support; infection prophylaxis.

6. Monitoring & Follow-up
- Counts, organ function, MRD where applicable.

7. When to Escalate
- DIC, TLS, febrile neutropenia.

8. Safety Notes
- Strict infection control; fertility preservation counseling.`,

    "Psoriatic Arthritis": `Template: Fictional Medical Clinical Guideline
Title: Psoriatic Arthritis – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Rheumatology Unit

1. Purpose
Diagnose and manage PsA across peripheral/axial/entheseal domains.

2. Scope
Rheumatology/dermatology.

3. Indications
Inflammatory arthritis with psoriasis or related features.

4. Diagnosis
- CASPAR criteria; imaging (US/MRI) for enthesitis/axial disease.

5. Treatment/Management
- NSAIDs; csDMARDs; biologics (TNF/IL-17/IL-23); JAK inhibitors in select cases.

6. Monitoring & Follow-up
- Skin and joint scores; infection risk.

7. When to Escalate
- Severe axial disease, refractory peripheral disease.

8. Safety Notes
- Coordinate with dermatology; screen TB/hepatitis.`,

    "Ankylosing Spondylitis (alt key)": `Template: Fictional Medical Clinical Guideline
Title: Ankylosing Spondylitis – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Rheumatology Unit

1. Purpose
As above; alternative label retained if you need 30 keys exactly.

2. Scope
Rheumatology.

3. Indications
Inflammatory back pain, HLA-B27 positivity.

4. Diagnosis
- MRI SI joints; CRP/ESR elevation.

5. Treatment/Management
- NSAIDs; biologics (TNF/IL-17); exercise programs.

6. Monitoring & Follow-up
- Mobility indices; uveitis screening.

7. When to Escalate
- Neurological signs, refractory pain.

8. Safety Notes
- Screen for infections pre-biologic.`,

    "Prostate Cancer": `Template: Fictional Medical Clinical Guideline
Title: Prostate Cancer – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Urology/Oncology Unit

1. Purpose
Risk-stratified management of prostate cancer.

2. Scope
Urology/oncology.

3. Indications
Elevated PSA/abnormal DRE or biopsy-proven cancer.

4. Diagnosis
- MRI-targeted biopsy; staging with PSMA PET/CT when indicated.

5. Treatment/Management
- Active surveillance (low risk), surgery/radiation (intermediate/high), ADT ± chemo/AR-targeted agents (advanced).

6. Monitoring & Follow-up
- PSA kinetics; treatment toxicities.

7. When to Escalate
- Rapid PSA rise, metastatic symptoms.

8. Safety Notes
- Bone health on ADT; cardiovascular risk.`,

    "Pneumothorax": `Template: Fictional Medical Clinical Guideline
Title: Spontaneous Pneumothorax – Medical Clinical Guideline
Version: 1.0
Date: 2025-01-15
Responsible Department: Respiratory/ED Unit

1. Purpose
Acute management of primary/secondary spontaneous pneumothorax.

2. Scope
ED/respiratory/ICU.

3. Indications
Sudden pleuritic pain, dyspnea.

4. Diagnosis
- CXR/ultrasound; CT if unclear.

5. Treatment/Management
- Observation for small stable primary; needle aspiration or chest drain for larger/secondary/unstable; oxygen.

6. Monitoring & Follow-up
- Air leak, lung re-expansion; recurrence prevention counseling.

7. When to Escalate
- Tension pneumothorax (immediate needle decompression).

8. Safety Notes
- Avoid high-pressure ventilation; counsel on air travel/diving until resolved.`
};

// Ensure we have exactly 30 docs (trim or add as needed)
const entries = Object.entries(diseaseDocs).slice(0, 30);

// =================== WRITE FILES ===================
for (const [disease, content] of entries) {
    fs.writeFileSync(path.join(OUT_DIR, `${safe(disease)}.txt`), content, "utf8");
}
console.log(`Generated ${entries.length} medical guidelines in ${OUT_DIR}`);
