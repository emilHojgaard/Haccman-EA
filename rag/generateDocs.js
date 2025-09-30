// generateDiseaseDocsRich.mjs
// Generates 30 detailed, patient-facing disease info documents (one .txt per disease)
// Run: node generateDiseaseDocsRich.mjs  (ESM compatible)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_DIR = path.join(__dirname, "disease_docs");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

// Helper
const safe = (s) => s.replace(/[^a-z0-9]/gi, "_");

// =================== RICH, DISEASE-SPECIFIC DOCUMENTS (30) ===================
const diseaseDocs = {
    "Asthma": `TITLE: Asthma

Overview:
Asthma is a long-term condition in which the airways become inflamed and overly sensitive. Triggers such as viral colds, allergens, smoke, or exercise can narrow the airways, making it harder to breathe. Symptoms often occur in episodes and can vary from mild to severe over time.

Causes and Risk Factors:
- Family or personal history of asthma, eczema, or hay fever (atopy)
- Allergen exposure (dust mites, pollen, mold, pets)
- Tobacco smoke, air pollution, occupational irritants
- Viral infections, particularly in childhood
- Cold air, exercise, strong emotions or stress

Common Symptoms:
- Wheezing (especially on exhalation), shortness of breath, chest tightness
- Night or early-morning cough
- Symptoms provoked by allergens, infections, or activity

Diagnosis:
- Clinical history and exam
- Spirometry to confirm variable airflow limitation; bronchodilator response testing
- Peak flow monitoring; bronchoprovocation testing if needed
- Consider allergy testing to identify triggers

Treatment:
- Reliever inhalers (short-acting bronchodilators) for quick symptom relief
- Preventer inhalers (inhaled corticosteroids) to reduce airway inflammation
- Combination inhalers (ICS/LABA) for persistent symptoms
- Add-on therapies (LAMA, leukotriene antagonists, biologics) in moderate–severe disease
- Vaccinations: influenza and pneumococcal per guidance

Self-Management and Lifestyle:
- Personalized asthma action plan and regular technique checks
- Identify and minimize triggers; smoke-free home
- Pre-exercise reliever if recommended; warm-ups and cool-downs
- Peak flow or symptom diary to track control

When to Seek Medical Help:
- Needing reliever more than 2–3 times per week
- Worsening breathlessness, difficulty speaking full sentences
- No response to reliever or signs of severe attack (blue lips, drowsiness)

Prognosis:
With consistent controller therapy and trigger management, most people achieve excellent control and live fully active lives.`,

    "Type 2 Diabetes": `TITLE: Type 2 Diabetes

Overview:
Type 2 diabetes occurs when the body becomes resistant to insulin and gradually produces less of it, leading to elevated blood glucose. Good control reduces the risk of heart disease, stroke, kidney disease, nerve damage, and vision loss.

Causes and Risk Factors:
- Overweight/obesity (especially abdominal), inactivity
- Family history, certain ethnic backgrounds
- Age >45, history of gestational diabetes, polycystic ovary syndrome
- Hypertension and dyslipidemia

Common Symptoms:
- Thirst, frequent urination, fatigue, blurred vision
- Slow-healing wounds, recurrent infections
- Symptoms may be subtle or absent early on

Diagnosis:
- HbA1c ≥ 48 mmol/mol (6.5%) or
- Fasting plasma glucose ≥ 7.0 mmol/L or
- 2-hour OGTT glucose ≥ 11.1 mmol/L, or random glucose ≥ 11.1 mmol/L with symptoms

Treatment:
- Lifestyle: structured nutrition, weight loss, regular activity (≥150 min/week)
- First-line medication: metformin if tolerated
- Add-on options: SGLT2 inhibitors, GLP-1 receptor agonists (CV/renal benefit), DPP-4 inhibitors, or sulfonylureas
- Consider insulin when oral therapy insufficient or during acute illness
- Manage BP and lipids; stop smoking

Self-Management and Lifestyle:
- Daily activity, portion control, reduced refined carbs
- Home glucose checks if advised; foot care; regular eye/renal screening
- Medication adherence and sick-day rules

When to Seek Medical Help:
- Very high blood sugar with vomiting, confusion, or dehydration
- Recurrent low blood sugars if on insulin/sulfonylureas
- Sudden vision changes, chest pain, or stroke symptoms

Prognosis:
Excellent outcomes with sustained lifestyle changes and medication adherence; ongoing monitoring prevents complications.`,

    "Hypertension": `TITLE: Hypertension

Overview:
Hypertension is persistently elevated blood pressure that increases strain on the heart and arteries, raising the risk of heart attack, stroke, kidney disease, and heart failure. Many people have no symptoms and learn of it during routine checks.

Causes and Risk Factors:
- Ageing, family history, high-salt diet, obesity, inactivity
- Alcohol excess, stress, sleep apnea
- Secondary causes (kidney disease, endocrine disorders, certain medications)

Common Symptoms:
- Often none; sometimes headaches or dizziness with severe elevations
- Long-term uncontrolled BP can damage organs silently

Diagnosis:
- Repeated BP measurements (office and/or ambulatory/home monitoring)
- Evaluation for target-organ effects and secondary causes
- Cardiovascular risk assessment (lipids, glucose)

Treatment:
- Lifestyle: salt reduction, weight loss, regular exercise, limit alcohol
- First-line medications: ACE inhibitor/ARB, calcium channel blocker, thiazide-like diuretic (alone or in combination)
- Add agents stepwise to reach target BP

Self-Management and Lifestyle:
- Home BP monitoring and log
- Heart-healthy diet (e.g., DASH/Mediterranean)
- Stress reduction, good sleep, smoking cessation

When to Seek Medical Help:
- BP ≥180/120 mmHg with chest pain, breathlessness, neuro symptoms (emergency)
- Persistent high readings despite medication

Prognosis:
Most achieve targets with combined lifestyle and medication, substantially reducing cardiovascular risk.`,

    "Coronary Artery Disease": `TITLE: Coronary Artery Disease

Overview:
Coronary artery disease (CAD) is narrowing of the heart’s arteries from atherosclerotic plaque, reducing blood flow to the heart muscle and potentially causing angina or heart attack.

Causes and Risk Factors:
- High LDL cholesterol, hypertension, diabetes, smoking
- Older age, family history, chronic kidney disease
- Sedentary lifestyle, obesity

Common Symptoms:
- Central chest pressure or tightness with exertion (angina), radiating to arm, neck, or jaw
- Breathlessness, sweating, nausea during episodes
- Some people (especially with diabetes) have atypical symptoms

Diagnosis:
- Risk assessment, ECG, lab markers (lipids, glucose)
- Stress testing (ECG/imaging), coronary CT angiography
- Invasive angiography when indicated

Treatment:
- Antianginal therapy (beta-blockers, nitrates, CCBs)
- Antiplatelet therapy, statins, ACEi/ARB
- Revascularization (PCI/CABG) for suitable anatomy and symptom control
- Intensive risk-factor modification

Self-Management and Lifestyle:
- Regular aerobic activity as advised; cardiac rehab post-event
- Heart-healthy diet; weight and BP control; stop smoking

When to Seek Medical Help:
- Chest pain at rest or not relieved by usual medication
- Signs of heart attack (persistent pressure, sweating, nausea, breathlessness)

Prognosis:
Varies with extent of disease and risk-factor control; modern therapy substantially improves outcomes.`,

    "Stroke": `TITLE: Stroke

Overview:
Stroke occurs when blood flow to part of the brain stops due to a blocked artery (ischemic) or a burst vessel (hemorrhagic). Rapid treatment limits brain damage and disability.

Causes and Risk Factors:
- Hypertension, atrial fibrillation, diabetes, smoking, high cholesterol
- Prior TIA/stroke, carotid disease
- Older age, certain genetic or clotting conditions

Common Symptoms:
- Face drooping, arm weakness, speech difficulty (think FAST)
- Sudden vision loss, severe headache, confusion, imbalance

Diagnosis:
- Emergency CT/MRI to distinguish ischemic vs hemorrhagic stroke
- Vascular imaging (CTA/MRA), cardiac work-up (ECG/echo)
- Risk factor labs

Treatment:
- Time-critical reperfusion (thrombolysis, thrombectomy) for ischemic stroke
- Blood pressure and anticoagulation management per type
- Stroke-unit care and early rehabilitation

Self-Management and Lifestyle:
- Secondary prevention: antiplatelet/anticoagulant as indicated, statins, BP/diabetes control
- Smoking cessation, physical activity, diet

When to Seek Medical Help:
- Any sudden stroke symptoms — call emergency immediately

Prognosis:
Outcomes depend on stroke type, size, and speed of care; rehab maximizes recovery.`,

    "Chronic Kidney Disease": `TITLE: Chronic Kidney Disease

Overview:
Chronic kidney disease (CKD) is gradual loss of kidney function over months to years. Early stages often have no symptoms but increase risk of cardiovascular disease and kidney failure.

Causes and Risk Factors:
- Diabetes, hypertension (most common)
- Glomerulonephritis, polycystic kidney disease
- Recurrent kidney infections or obstruction, nephrotoxic drugs

Common Symptoms:
- Often none until advanced; fatigue, ankle swelling, nocturia
- Nausea, poor appetite, itchy skin in later stages

Diagnosis:
- eGFR and serum creatinine trends; urine albumin-creatinine ratio (ACR)
- Blood pressure, electrolytes, bone/mineral profile
- Ultrasound if structural disease suspected

Treatment:
- Control diabetes and blood pressure (ACEi/ARB for albuminuria)
- SGLT2 inhibitors show renal/CV benefits in many patients
- Avoid nephrotoxins (NSAIDs), adjust drug doses to kidney function
- Manage anemia and bone-mineral disorders in advanced CKD

Self-Management and Lifestyle:
- Low-salt diet, weight management, exercise
- Medication adherence; blood pressure and glucose monitoring

When to Seek Medical Help:
- Rapid swelling, breathlessness, confusion, or severe electrolyte symptoms
- Rising creatinine or very abnormal potassium

Prognosis:
Progression can be slowed substantially with aggressive risk-factor control.`,

    "COPD": `TITLE: Chronic Obstructive Pulmonary Disease (COPD)

Overview:
COPD is a progressive lung condition (chronic bronchitis/emphysema) causing airflow limitation that is not fully reversible. It leads to chronic cough, sputum production, and breathlessness.

Causes and Risk Factors:
- Tobacco smoke (primary cause), biomass exposure
- Occupational dusts/chemicals, air pollution
- Alpha-1 antitrypsin deficiency (rare)

Common Symptoms:
- Persistent cough with sputum, exertional dyspnea, wheeze
- Frequent bronchitis “flare-ups”

Diagnosis:
- Spirometry showing FEV1/FVC < 0.70 post-bronchodilator
- Assessment of severity (FEV1) and exacerbation history
- Chest X-ray/CT and oxygen saturation as indicated

Treatment:
- Bronchodilators (LAMA/LABA), inhaled corticosteroids for frequent exacerbations
- Pulmonary rehabilitation; vaccinations; oxygen if chronic hypoxemia
- Smoking cessation has the greatest impact on prognosis

Self-Management and Lifestyle:
- Inhaler technique checks; action plan for exacerbations
- Regular activity as tolerated; nutrition optimization

When to Seek Medical Help:
- Worsening breathlessness, purulent sputum, fever
- Low oxygen levels or confusion

Prognosis:
Progressive but manageable; stopping smoking and pulmonary rehab improve quality of life and reduce exacerbations.`,

    "Pneumonia": `TITLE: Community-Acquired Pneumonia

Overview:
Pneumonia is a lung infection that inflames the air sacs. Common causes include bacteria and viruses acquired outside the hospital.

Causes and Risk Factors:
- Older age, chronic diseases (COPD, heart failure, diabetes)
- Smoking, alcohol misuse, weakened immunity

Common Symptoms:
- Fever, chills, productive cough, pleuritic chest pain
- Breathlessness, fatigue

Diagnosis:
- Chest X-ray (consolidation), bloods (WBC, CRP)
- Severity scoring (e.g., CURB-65) to guide setting of care

Treatment:
- Empirical antibiotics per guideline (pathogen/host risk)
- Fluids, antipyretics, oxygen as needed; early mobilization

Self-Management and Lifestyle:
- Rest and hydration; complete antibiotics
- Vaccination (influenza, pneumococcal) and smoking cessation

When to Seek Medical Help:
- Worsening breathlessness, confusion, persistent fever
- Poor oral intake or signs of sepsis

Prognosis:
Usually good with prompt treatment; higher risk in frail or comorbid patients.`,

    "Influenza": `TITLE: Influenza (Flu)

Overview:
Influenza is a contagious viral respiratory illness with abrupt onset of fever, aches, cough, and fatigue. It circulates seasonally and can cause complications in vulnerable groups.

Causes and Risk Factors:
- Exposure to influenza viruses, winter surges
- High risk: older adults, young children, pregnancy, chronic disease

Common Symptoms:
- Sudden fever, chills, muscle aches, headache
- Dry cough, sore throat, profound tiredness

Diagnosis:
- Clinical during outbreaks; rapid antigen/NAAT if needed
- Consider testing in high-risk settings to guide antivirals

Treatment:
- Rest, fluids, antipyretics/analgesics
- Antivirals (e.g., oseltamivir) if started early, especially in high-risk or severe disease

Self-Management and Lifestyle:
- Stay home while febrile; good hand and cough hygiene
- Annual influenza vaccination

When to Seek Medical Help:
- Difficulty breathing, chest pain, persistent high fever, confusion
- Worsening in chronic conditions

Prognosis:
Most recover within 1–2 weeks; complications include pneumonia and exacerbations of chronic disease.`,

    "Migraine": `TITLE: Migraine Without Aura

Overview:
Migraine is a recurrent headache disorder causing moderate to severe throbbing pain, often one-sided, with sensitivity to light/sound and nausea.

Causes and Risk Factors:
- Family history; hormonal fluctuations
- Triggers: stress, sleep changes, certain foods, dehydration

Common Symptoms:
- Throbbing headache lasting 4–72 hours
- Nausea/vomiting; photophobia/phonophobia
- Worsens with physical activity

Diagnosis:
- Clinical criteria based on typical features and recurring attacks
- Neurological exam normal between attacks; imaging only if red flags

Treatment:
- Acute: triptan + NSAID (if no contraindication), antiemetic
- Preventive: beta-blockers, topiramate, CGRP-targeted therapies if frequent/severe

Self-Management and Lifestyle:
- Headache diary; sleep hygiene; hydration; regular meals
- Trigger management; limit acute meds to avoid medication-overuse headache

When to Seek Medical Help:
- “Worst ever” sudden headache, new neuro symptoms, fever/stiff neck
- Increased frequency or refractory attacks

Prognosis:
Most achieve control with a mix of acute and preventive strategies.`,

    "Depression": `TITLE: Major Depressive Disorder (Moderate)

Overview:
Depression is a mood disorder marked by persistent low mood and reduced interest, impairing daily life. It can affect sleep, thinking, and physical health.

Causes and Risk Factors:
- Genetic vulnerability, prior episodes, family history
- Stressful life events, medical illness, substances

Common Symptoms:
- Low mood most of the day; anhedonia
- Sleep/appetite changes, fatigue, poor concentration
- Feelings of guilt/hopelessness; thoughts of death

Diagnosis:
- Clinical interview; screening tools (e.g., PHQ-9)
- Rule out medical contributors (e.g., thyroid disorders, B12 deficiency)
- Risk assessment for self-harm

Treatment:
- Psychotherapy (CBT/interpersonal) and/or SSRIs/SNRIs
- Consider augmentation if partial response; address comorbidities
- Exercise, routine, and social support are helpful

Self-Management and Lifestyle:
- Regular schedule, sleep hygiene, gentle exercise
- Avoid alcohol/drugs; adhere to treatment plan

When to Seek Medical Help:
- Suicidal ideation/plan, psychosis, inability to care for self
- No improvement or worsening despite treatment

Prognosis:
Good with treatment; many recover fully, though recurrences can occur—maintenance therapy reduces relapse.`,

    "Anxiety Disorder": `TITLE: Generalized Anxiety Disorder

Overview:
Generalized Anxiety Disorder (GAD) involves excessive, hard-to-control worry about everyday issues for months, often with physical symptoms.

Causes and Risk Factors:
- Family history, personality traits, chronic stress
- Co-existing depression or substance use

Common Symptoms:
- Persistent worry, restlessness, irritability
- Muscle tension, poor concentration, sleep disturbance
- Physical symptoms (palpitations, GI discomfort)

Diagnosis:
- Clinical interview; screening (GAD-7)
- Exclude medical causes (thyroid, arrhythmia, medication effects)

Treatment:
- Cognitive-behavioral therapy is first-line
- SSRIs/SNRIs if significant impairment; short-term anxiolytics rarely
- Mindfulness-based strategies, exercise

Self-Management and Lifestyle:
- Regular sleep, caffeine moderation, breathing exercises
- Structured problem-solving and worry scheduling

When to Seek Medical Help:
- Significant functional impairment or panic attacks
- Worsening symptoms, self-harm thoughts

Prognosis:
Often chronic but very treatable; combination therapy improves outcomes.`,

    "Osteoarthritis": `TITLE: Osteoarthritis (Knee/Hand/Hip)

Overview:
Osteoarthritis is “wear and repair” joint disease involving cartilage thinning, bone remodeling, and low-grade inflammation, causing pain and stiffness.

Causes and Risk Factors:
- Age, prior joint injury, obesity, repetitive use
- Family history; malalignment (knee varus/valgus)

Common Symptoms:
- Activity-related joint pain, short morning stiffness
- Crepitus, swelling, reduced range of motion

Diagnosis:
- Clinical; X-rays for joint space narrowing, osteophytes
- Rule out inflammatory arthritis if red flags

Treatment:
- Exercise and weight reduction; physiotherapy (strengthening)
- Topical NSAIDs; intermittent oral analgesics
- Intra-articular corticosteroid injections for flares; surgery for severe disease

Self-Management and Lifestyle:
- Low-impact exercise (cycling, swimming), pacing activities
- Heat/cold therapy, braces or walking aids if needed

When to Seek Medical Help:
- Hot, very swollen joint (exclude infection/gout)
- Rapid deterioration in function

Prognosis:
Symptoms fluctuate over years; active management maintains mobility and quality of life.`,

    "Rheumatoid Arthritis": `TITLE: Rheumatoid Arthritis

Overview:
Rheumatoid arthritis (RA) is an autoimmune disease causing persistent, symmetric joint inflammation, leading to pain, swelling, and potential joint damage.

Causes and Risk Factors:
- Genetic susceptibility (HLA-DRB1), smoking
- Female sex, hormonal and environmental factors

Common Symptoms:
- Morning stiffness >30 minutes, small joint swelling (hands/feet)
- Fatigue, low mood, reduced grip strength
- Extra-articular features (nodules, dry eyes/mouth)

Diagnosis:
- Clinical pattern; rheumatoid factor and anti-CCP antibodies
- Inflammatory markers; ultrasound/MRI for synovitis
- Exclude other inflammatory arthritides

Treatment:
- Early DMARDs (e.g., methotrexate) are key; add biologics/targeted agents if needed
- Short steroid courses for flares; NSAIDs for symptoms
- Vaccination and infection risk counseling

Self-Management and Lifestyle:
- Joint protection strategies, physiotherapy/occupational therapy
- Smoking cessation; exercise tailored to tolerance

When to Seek Medical Help:
- New hot swollen joints; medication side-effects (e.g., infection, liver issues)

Prognosis:
Early, treat-to-target therapy greatly reduces disability and joint damage.`,

    "Gastric Ulcer": `TITLE: Gastric Ulcer

Overview:
Gastric ulcers are sores in the stomach lining, most commonly due to Helicobacter pylori infection or NSAID use.

Causes and Risk Factors:
- H. pylori, NSAIDs/aspirin, smoking, alcohol excess
- Severe physiological stress (rare)

Common Symptoms:
- Epigastric pain/heartburn, nausea/bloating
- Pain can be meal-related; sometimes asymptomatic

Diagnosis:
- H. pylori testing (breath/stool/biopsy)
- Endoscopy to confirm ulcer and rule out cancer in at-risk groups
- CBC to assess for anemia

Treatment:
- Proton pump inhibitor (PPI) therapy
- Eradicate H. pylori if present (combination antibiotics + PPI)
- Stop NSAIDs or add gastroprotection if essential

Self-Management and Lifestyle:
- Avoid smoking, excess alcohol, and irritant foods
- Small frequent meals if helpful; adhere to therapy

When to Seek Medical Help:
- Vomiting blood/coffee-ground material, black stools, severe persistent pain
- Weight loss or difficulty swallowing

Prognosis:
Most ulcers heal with PPI and H. pylori eradication; relapse risk rises with ongoing NSAIDs or smoking.`,

    "GERD (Reflux Disease)": `TITLE: Gastroesophageal Reflux Disease (GERD)

Overview:
GERD is reflux of stomach contents into the esophagus causing heartburn and regurgitation. Chronic reflux may inflame the esophagus and disrupt sleep and quality of life.

Causes and Risk Factors:
- Weak lower esophageal sphincter, hiatal hernia
- Obesity, late-night meals, alcohol, caffeine, smoking
- Pregnancy; certain medications

Common Symptoms:
- Heartburn after meals, sour/bitter taste
- Night symptoms, chronic cough or hoarseness

Diagnosis:
- Clinical response to acid suppression; endoscopy if alarm features
- pH monitoring/manometry for refractory cases

Treatment:
- Proton pump inhibitor for 4–8 weeks; step-down as controlled
- Lifestyle: weight loss, head-of-bed elevation, avoid triggers
- Surgery/endoscopic options for selected refractory cases

Self-Management and Lifestyle:
- Smaller meals; avoid lying down within 3 hours of eating
- Limit alcohol, caffeine, chocolate, peppermint, fatty meals

When to Seek Medical Help:
- Dysphagia, GI bleeding, weight loss, persistent vomiting
- Persistent symptoms despite optimal therapy

Prognosis:
Excellent with lifestyle and acid suppression; maintain the least intense regimen that controls symptoms.`,

    "Irritable Bowel Syndrome": `TITLE: Irritable Bowel Syndrome (IBS)

Overview:
IBS is a functional bowel disorder causing abdominal pain related to defecation, with changes in stool frequency or form, without structural disease.

Causes and Risk Factors:
- Gut–brain axis dysregulation, visceral hypersensitivity
- Prior infections, antibiotics, stress; family history

Common Symptoms:
- Crampy abdominal pain, bloating, gas
- Diarrhea, constipation, or alternating patterns
- Symptom relief after bowel movement

Diagnosis:
- Rome IV criteria; normal basic tests (FBC, CRP) in typical cases
- Red flags (weight loss, bleeding, anemia) prompt further work-up

Treatment:
- Diet: low-FODMAP trial, fiber adjustment
- Symptom-targeted meds (antispasmodics, laxatives, antidiarrheals)
- Psychological therapies (CBT) and stress management

Self-Management and Lifestyle:
- Regular meals, hydration, gradual fiber changes
- Exercise and sleep routines; trigger diary

When to Seek Medical Help:
- New red flags, persistent nocturnal symptoms, weight loss

Prognosis:
Chronic, fluctuating course; many achieve good control with diet and tailored therapy.`,

    "Crohn’s Disease": `TITLE: Crohn’s Disease

Overview:
Crohn’s disease is a chronic inflammatory bowel disease that can affect any part of the GI tract, commonly the terminal ileum and colon, with skip lesions and transmural inflammation.

Causes and Risk Factors:
- Immune dysregulation in genetically susceptible individuals
- Smoking increases risk and severity

Common Symptoms:
- Abdominal pain, chronic diarrhea, weight loss
- Fatigue, fever, perianal disease (fistulae, fissures)

Diagnosis:
- Colonoscopy with biopsies; MR/CT enterography
- Fecal calprotectin; blood tests for inflammation/anemia

Treatment:
- Induction with steroids for flares; maintenance with immunomodulators/biologics
- Nutrition optimization; treat complications (strictures, fistulae)
- Smoking cessation is essential

Self-Management and Lifestyle:
- Medication adherence, vaccination updates
- Balanced nutrition; manage stress and fatigue

When to Seek Medical Help:
- Severe pain, persistent fever, bleeding, obstruction symptoms

Prognosis:
Relapsing-remitting course; modern biologics improve remission rates and reduce complications.`,

    "Ulcerative Colitis": `TITLE: Ulcerative Colitis

Overview:
Ulcerative colitis is a chronic inflammatory condition of the colon lining, starting in the rectum and spreading proximally in a continuous pattern.

Causes and Risk Factors:
- Immune dysregulation; family history
- Former smoking status sometimes protective (not recommended as therapy)

Common Symptoms:
- Bloody diarrhea, urgency, tenesmus, crampy pain
- Fatigue, weight loss in severe disease

Diagnosis:
- Colonoscopy with biopsies; elevated fecal calprotectin
- Labs for anemia/inflammation; screen for infections

Treatment:
- 5-ASA agents for mild-moderate disease, steroids for flares
- Immunomodulators/biologics for steroid-dependent or severe disease
- Cancer surveillance colonoscopies after long disease duration

Self-Management and Lifestyle:
- Adherence to maintenance therapy
- Nutrition support during flares; vaccinations

When to Seek Medical Help:
- Severe bleeding, high fever, severe abdominal pain/distension

Prognosis:
Many maintain remission on modern therapy; colorectal cancer risk rises with extensive longstanding colitis—regular surveillance is key.`,

    "Liver Cirrhosis": `TITLE: Liver Cirrhosis

Overview:
Cirrhosis is advanced liver scarring from chronic injury (e.g., alcohol, viral hepatitis, NASH). It can lead to portal hypertension and liver failure.

Causes and Risk Factors:
- Alcohol-related liver disease, chronic hepatitis B/C
- Non-alcoholic steatohepatitis, autoimmune or cholestatic diseases

Common Symptoms:
- Fatigue, easy bruising, ankle swelling, abdominal distension (ascites)
- Jaundice, confusion (hepatic encephalopathy) in advanced stages

Diagnosis:
- Abnormal liver tests, ultrasound/elastography for fibrosis
- Endoscopy to screen for varices; rule out HCC with imaging/AFP

Treatment:
- Address cause (alcohol cessation, antivirals)
- Diuretics for ascites; lactulose for encephalopathy; variceal prophylaxis
- Vaccinations and nutrition support; transplant evaluation in decompensation

Self-Management and Lifestyle:
- Strict alcohol abstinence; low-salt diet for ascites
- Medication adherence and infection vigilance

When to Seek Medical Help:
- Increasing abdominal girth, confusion, vomiting blood, black stools, fever

Prognosis:
Depends on cause and stage; early management and abstinence slow progression, advanced disease may require transplant.`,

    "Cholelithiasis (Gallstones)": `TITLE: Cholelithiasis (Gallstones)

Overview:
Gallstones are hardened deposits in the gallbladder. Many are asymptomatic; symptomatic stones cause biliary colic—episodes of right upper abdominal pain after fatty meals.

Causes and Risk Factors:
- Female sex, age, obesity, rapid weight loss, pregnancy
- Hemolytic conditions (pigment stones)

Common Symptoms:
- Episodic right upper quadrant pain radiating to back/right shoulder
- Nausea/vomiting; pain lasts minutes to hours, resolves between attacks

Diagnosis:
- Abdominal ultrasound (stones, gallbladder wall, bile ducts)
- LFTs; assess for complications (cholecystitis, choledocholithiasis)

Treatment:
- Analgesia during attacks; elective laparoscopic cholecystectomy for recurrent symptoms
- ERCP if ductal stones; antibiotics for cholecystitis

Self-Management and Lifestyle:
- Reduce dietary fat to minimize attacks
- Weight management and steady weight loss if needed

When to Seek Medical Help:
- Persistent pain with fever, jaundice, or severe tenderness (possible complications)

Prognosis:
Excellent after cholecystectomy; asymptomatic stones generally observed.`,

    "Urinary Tract Infection": `TITLE: Urinary Tract Infection (Uncomplicated)

Overview:
UTI is a bacterial infection of the lower urinary tract (bladder). It commonly affects women and usually responds promptly to oral antibiotics.

Causes and Risk Factors:
- Short urethra in women, sexual activity, spermicide use
- Post-menopausal changes; poor hydration

Common Symptoms:
- Dysuria, frequency, urgency; suprapubic discomfort
- Usually afebrile (fever suggests upper UTI)

Diagnosis:
- Urinalysis (nitrites/leukocyte esterase), urine culture if atypical or recurrent
- Consider STIs or pelvic causes if symptoms atypical

Treatment:
- Short course oral antibiotics per local resistance patterns
- Analgesia (e.g., phenazopyridine where used), hydration

Self-Management and Lifestyle:
- Increase fluid intake; regular voiding; post-coital voiding
- Consider vaginal estrogen in post-menopausal recurrent UTI (per clinician)

When to Seek Medical Help:
- Fever/flank pain (possible pyelonephritis), pregnancy, or lack of improvement in 48–72 hours

Prognosis:
Excellent with appropriate therapy; recurrent UTIs may need preventive strategies.`,

    "Benign Prostatic Hyperplasia": `TITLE: Benign Prostatic Hyperplasia (BPH)

Overview:
BPH is non-cancerous enlargement of the prostate, leading to lower urinary tract symptoms in aging men.

Causes and Risk Factors:
- Ageing, hormonal changes, family history
- Metabolic syndrome may contribute

Common Symptoms:
- Weak stream, hesitancy, straining
- Nocturia, frequency, urgency, incomplete emptying

Diagnosis:
- Symptom questionnaire (IPSS), digital rectal exam
- Urinalysis; PSA as indicated; ultrasound for residual volume if needed

Treatment:
- Watchful waiting for mild symptoms; lifestyle adjustments (limit evening fluids, caffeine)
- Alpha-blockers (tamsulosin) for flow; 5-alpha-reductase inhibitors for large prostates
- Surgery/minimally invasive therapies for refractory cases

Self-Management and Lifestyle:
- Timed voiding; reduce bladder irritants
- Review medications that worsen symptoms (decongestants)

When to Seek Medical Help:
- Urinary retention, recurrent infections, hematuria, kidney impairment

Prognosis:
Most improve with medication; procedures are effective when needed.`,

    "Breast Cancer": `TITLE: Breast Cancer

Overview:
Breast cancer arises from breast tissue cells and includes multiple subtypes with different behaviors and treatments. Early detection improves outcomes.

Causes and Risk Factors:
- Age, family history/BRCA mutations
- Hormonal factors (early menarche, late menopause, HRT)
- Obesity, alcohol intake

Common Symptoms:
- Painless breast lump, skin dimpling, nipple changes or discharge
- Sometimes found on screening mammography

Diagnosis:
- Triple assessment: clinical exam, imaging (mammogram/ultrasound), core biopsy
- Staging with imaging as indicated; receptor status (ER/PR/HER2)

Treatment:
- Surgery (lumpectomy/mastectomy), radiotherapy
- Systemic therapy tailored to subtype: endocrine, chemotherapy, HER2-targeted agents
- Reconstruction and survivorship care

Self-Management and Lifestyle:
- Adherence to therapy and follow-ups
- Exercise, weight management, psychosocial support

When to Seek Medical Help:
- New lump, skin/nipple changes, persistent discharge

Prognosis:
Highly variable by stage and subtype; screening and modern therapy have improved survival significantly.`,

    "Lung Cancer": `TITLE: Lung Cancer

Overview:
Lung cancer includes non-small cell (most common) and small cell types. Smoking is the main risk factor, though non-smokers can be affected.

Causes and Risk Factors:
- Smoking, secondhand smoke, radon
- Occupational exposures (asbestos), air pollution

Common Symptoms:
- Persistent cough, hemoptysis, chest pain
- Weight loss, breathlessness, recurrent infections

Diagnosis:
- Imaging (CXR/CT), PET-CT for staging
- Bronchoscopy or CT-guided biopsy; molecular profiling for targeted therapy

Treatment:
- Surgery for early-stage disease; radiotherapy as indicated
- Systemic therapies: platinum chemo, targeted agents (EGFR/ALK/ROS1, etc.), immunotherapy
- Palliative care integrated early for symptoms

Self-Management and Lifestyle:
- Smoking cessation improves outcomes at any stage
- Nutrition and exercise as tolerated; symptom control (cough, pain)

When to Seek Medical Help:
- New or worsening cough, coughing blood, unexplained weight loss

Prognosis:
Depends on stage and biology; targeted and immune therapies have improved survival for many.`,

    "Skin Melanoma": `TITLE: Skin Melanoma

Overview:
Melanoma is a serious skin cancer arising from pigment cells (melanocytes). Early detection and surgical removal are crucial.

Causes and Risk Factors:
- UV exposure (sunbeds, sunburns), fair skin, many moles
- Family history, certain genetic syndromes

Common Symptoms:
- Changing mole (ABCDE: Asymmetry, Border, Color, Diameter, Evolving)
- New dark lesion or non-healing spot

Diagnosis:
- Dermoscopic exam and excisional biopsy with margins
- Staging with sentinel node biopsy for certain lesions

Treatment:
- Wide local excision; immunotherapy/targeted therapy for advanced disease
- Dermatology/oncology follow-up schedules

Self-Management and Lifestyle:
- Sun protection: shade, clothing, SPF 30+, no tanning beds
- Regular skin checks; know your moles

When to Seek Medical Help:
- Any changing/new concerning lesion

Prognosis:
Excellent if caught early; advanced disease outcomes have improved with modern systemic therapy.`,

    "Epilepsy": `TITLE: Epilepsy

Overview:
Epilepsy is a tendency to have unprovoked, recurrent seizures due to abnormal electrical activity in the brain. Types and triggers vary.

Causes and Risk Factors:
- Structural brain changes, genetic causes, prior head injury or stroke
- CNS infections, developmental conditions

Common Symptoms:
- Focal symptoms (tingling, jerking, déjà vu) or generalized convulsions
- Post-ictal confusion, fatigue

Diagnosis:
- Clinical history, witness accounts, EEG
- MRI brain to look for structural causes; labs to exclude mimics

Treatment:
- Anti-seizure medications tailored to seizure type
- Surgery or neuromodulation for refractory cases; trigger avoidance (sleep deprivation, alcohol)

Self-Management and Lifestyle:
- Medication adherence; seizure diary
- Safety planning (driving restrictions per law, water safety)

When to Seek Medical Help:
- Prolonged seizure (>5 minutes) or repeated seizures without recovery (status epilepticus, emergency)
- New neurological deficits

Prognosis:
Many achieve seizure freedom with medication; some require specialized care.`,

    "Parkinson’s Disease": `TITLE: Parkinson’s Disease

Overview:
Parkinson’s disease is a neurodegenerative disorder characterized by bradykinesia, rigidity, tremor, and postural instability due to dopamine loss in the basal ganglia.

Causes and Risk Factors:
- Ageing, genetics (in a minority), environmental exposures
- Male sex slightly higher risk

Common Symptoms:
- Slowness of movement, stiffness, resting tremor
- Small handwriting, reduced facial expression, soft voice
- Non-motor: constipation, sleep disturbance, mood changes

Diagnosis:
- Clinical diagnosis; response to dopaminergic therapy supports
- MRI usually normal, used to exclude mimics

Treatment:
- Levodopa is most effective; dopamine agonists, MAO-B inhibitors
- Physiotherapy, occupational/speech therapy; exercise programs
- Deep brain stimulation for selected patients

Self-Management and Lifestyle:
- Regular exercise, balance training; home safety modifications
- Medication timing consistency; nutrition strategies

When to Seek Medical Help:
- Sudden worsening mobility, recurrent falls, medication side-effects (dyskinesias)

Prognosis:
Progressive, but therapy significantly improves symptoms and quality of life.`,

    "Multiple Sclerosis": `TITLE: Multiple Sclerosis (MS)

Overview:
MS is an autoimmune disease causing inflammation and demyelination in the CNS, leading to neurological symptoms that may relapse and remit or progress.

Causes and Risk Factors:
- Immune susceptibility, low vitamin D, certain infections
- Female sex; family history

Common Symptoms:
- Numbness/weakness, optic neuritis (painful vision loss)
- Imbalance, fatigue, cognitive and bladder issues

Diagnosis:
- MRI brain/spine with lesions disseminated in time/space
- CSF oligoclonal bands; exclude mimics

Treatment:
- Disease-modifying therapies (injectable, oral, infusion) to reduce relapses
- Steroids for acute relapses; rehab and symptom control

Self-Management and Lifestyle:
- Regular activity, energy conservation, vitamin D adequacy
- Heat management; mental health support

When to Seek Medical Help:
- New neurological symptoms, persistent worsening

Prognosis:
Highly variable; modern DMTs improve long-term outcomes.`,

    "Hypothyroidism": `TITLE: Hypothyroidism (Underactive Thyroid)

Overview:
Hypothyroidism is reduced thyroid hormone production, slowing body processes and causing fatigue, weight gain, and cold intolerance.

Causes and Risk Factors:
- Autoimmune thyroiditis (Hashimoto’s), thyroid surgery or radioiodine
- Certain drugs (amiodarone, lithium); iodine imbalance

Common Symptoms:
- Tiredness, depression, constipation, dry skin, hair thinning
- Menstrual changes, weight gain, cold sensitivity

Diagnosis:
- Elevated TSH with low free T4
- Screen for autoimmune thyroiditis (TPO antibodies) if needed

Treatment:
- Levothyroxine replacement; dose individualized by weight/age, pregnancy
- Take on empty stomach; separate from iron/calcium

Self-Management and Lifestyle:
- Adherence to dosing and timing
- Report symptoms of over- or under-replacement

When to Seek Medical Help:
- Severe lethargy, confusion, hypothermia (rare myxedema crisis)

Prognosis:
Excellent with correct dosing; periodic TSH checks guide therapy.`,

    "GERD": `TITLE: Gastroesophageal Reflux Disease (GERD)

Overview:
GERD occurs when stomach acid frequently flows back into the esophagus, irritating its lining and causing heartburn.

Causes and Risk Factors:
- Weak lower esophageal sphincter, hiatal hernia
- Obesity, pregnancy, dietary triggers, smoking

Common Symptoms:
- Heartburn/regurgitation, worse after meals or lying down
- Chronic cough, sore throat, hoarseness

Diagnosis:
- Clinical response to proton pump inhibitors
- Endoscopy if alarm features; pH monitoring/manometry if refractory

Treatment:
- PPIs 4–8 weeks, then step-down
- Weight loss, head-of-bed elevation, avoid late meals and triggers

Self-Management and Lifestyle:
- Smaller portions; reduce alcohol/caffeine/chocolate/mint/fat
- Avoid lying flat within 3 hours of eating

When to Seek Medical Help:
- Painful swallowing, bleeding, weight loss, persistent vomiting

Prognosis:
Most improve with lifestyle and PPIs; long-term plan tailored to symptoms.`,

    "Coronary Artery Disease (Stable Angina)": `TITLE: Coronary Artery Disease (Stable Angina)

Overview:
Stable angina is predictable chest discomfort with exertion due to narrowed coronary arteries, relieved by rest or nitroglycerin.

Causes and Risk Factors:
- Atherosclerosis risk factors: smoking, high LDL, hypertension, diabetes
- Sedentary lifestyle, obesity, family history

Common Symptoms:
- Pressure/tightness in chest radiating to arm/neck/jaw with exertion
- Breathlessness, sweating during episodes

Diagnosis:
- ECG, stress testing (ECG/imaging), coronary CT angiography
- Risk stratification to guide therapy

Treatment:
- Antianginal meds (beta-blockers, nitrates, CCBs)
- Antiplatelets, statins, ACEi/ARB; lifestyle changes
- Revascularization for selected anatomy/symptom burden

Self-Management and Lifestyle:
- Regular moderate exercise as advised; cardiac rehab
- Diet, weight, BP/glucose control; stop smoking

When to Seek Medical Help:
- Chest pain at rest, prolonged pain, or not relieved as usual

Prognosis:
Good with risk-factor control; procedures relieve symptoms and prevent events in selected cases.`,

    "TIA": `TITLE: Transient Ischemic Attack (TIA)

Overview:
TIA is a brief interruption of brain blood flow causing temporary neurological symptoms that resolve within 24 hours but signal high risk of stroke.

Causes and Risk Factors:
- Atherosclerosis, atrial fibrillation, carotid disease
- Hypertension, diabetes, smoking

Common Symptoms:
- Sudden weakness or numbness on one side, facial droop
- Speech difficulty, transient monocular vision loss

Diagnosis:
- Urgent brain imaging (prefer MRI), carotid imaging, ECG/echo
- Risk factor labs; ABCD2 score for short-term risk

Treatment:
- Antiplatelet therapy and statin; anticoagulation for AF
- Control BP/diabetes; smoking cessation

Self-Management and Lifestyle:
- Know FAST signs; adhere to meds and follow-ups

When to Seek Medical Help:
- Any new neurological symptom — emergency care

Prognosis:
Significant early stroke risk; aggressive secondary prevention is essential.`,

    "Ankylosing Spondylitis": `TITLE: Ankylosing Spondylitis

Overview:
Ankylosing spondylitis (AS) is an inflammatory arthritis primarily affecting the spine and sacroiliac joints, causing back pain and stiffness that improves with activity.

Causes and Risk Factors:
- HLA-B27 genetic association; family history
- Young adult onset, male predominance

Common Symptoms:
- Inflammatory back pain (night pain, morning stiffness >30 minutes)
- Reduced spinal flexibility; heel pain, uveitis

Diagnosis:
- Clinical features, elevated inflammatory markers
- MRI of sacroiliac joints; HLA-B27 testing supports
- Exclude mechanical back pain

Treatment:
- NSAIDs first-line; exercise and posture training
- Biologic agents (TNF/IL-17 inhibitors) for active disease
- Manage extra-articular features (eye care for uveitis)

Self-Management and Lifestyle:
- Daily stretching and strengthening; avoid smoking
- Ergonomic adjustments and sleep positioning

When to Seek Medical Help:
- Visual symptoms (uveitis), progressive stiffness, uncontrolled pain

Prognosis:
Varies; biologics have transformed outcomes and function.`,

    "Psoriasis": `TITLE: Plaque Psoriasis

Overview:
Psoriasis is a chronic immune-mediated skin disease with red, scaly plaques on extensor surfaces and scalp; nails may be affected.

Causes and Risk Factors:
- Genetic predisposition; immune dysregulation
- Triggers: infections, skin trauma, certain drugs, stress

Common Symptoms:
- Itchy, well-demarcated plaques with silvery scale
- Nail pitting, onycholysis; possible joint pain (psoriatic arthritis)

Diagnosis:
- Clinical; biopsy if atypical
- Screen for psoriatic arthritis (joint swelling, dactylitis)

Treatment:
- Topical steroids/vitamin D analogs for mild disease
- Phototherapy or systemic agents (methotrexate, biologics) for moderate–severe
- Moisturizers and trigger management

Self-Management and Lifestyle:
- Emollients, gentle skincare; avoid scratching/trauma
- Weight control, reduced alcohol, smoking cessation

When to Seek Medical Help:
- Rapid worsening, extensive plaques, significant joint pain

Prognosis:
Chronic with flares/remission; modern therapies achieve excellent skin clearance in many.`,

    "Peptic Ulcer Disease": `TITLE: Peptic Ulcer Disease

Overview:
Peptic ulcers are sores in the stomach or duodenum most often due to H. pylori or NSAIDs. They can bleed or perforate if untreated.

Causes and Risk Factors:
- H. pylori infection, NSAIDs/aspirin
- Smoking, severe stress (ICU), steroids with NSAIDs

Common Symptoms:
- Epigastric burning pain (meal-related), nausea, bloating
- Occult bleeding or anemia in some

Diagnosis:
- Endoscopy to confirm and treat complications
- H. pylori testing (breath/stool/biopsy)

Treatment:
- PPI therapy; eradicate H. pylori when positive
- Stop NSAIDs or add gastroprotection if essential; iron if anemic

Self-Management and Lifestyle:
- Avoid smoking/alcohol excess; smaller meals
- Adherence to therapy and follow-up

When to Seek Medical Help:
- Vomiting blood, black stools, severe persistent pain

Prognosis:
High healing rates with modern therapy; recurrence if causes persist.`,

    "Heart Failure (HFpEF)": `TITLE: Heart Failure with Preserved Ejection Fraction (HFpEF)

Overview:
HFpEF features typical heart failure symptoms with a normal ejection fraction, commonly due to diastolic dysfunction in older adults with hypertension or metabolic syndrome.

Causes and Risk Factors:
- Hypertension, obesity, diabetes, atrial fibrillation, aging
- Coronary disease and sleep apnea contribute

Common Symptoms:
- Exertional breathlessness, fatigue, ankle swelling
- Orthopnea (needing extra pillows), reduced exercise tolerance

Diagnosis:
- Echo (normal EF, diastolic dysfunction), elevated natriuretic peptides
- Assessment of comorbidities, volume status

Treatment:
- Diuretics for congestion; strict BP, diabetes, and weight control
- SGLT2 inhibitors show benefit; treat AF and sleep apnea

Self-Management and Lifestyle:
- Sodium restriction, daily weights, activity as tolerated
- Recognize fluid overload signs early

When to Seek Medical Help:
- Rapid weight gain, worsening breathlessness, syncope

Prognosis:
Variable; comorbidity management and lifestyle changes are central to outcomes.`
};

// =================== WRITE FILES ===================
for (const [disease, content] of Object.entries(diseaseDocs)) {
    fs.writeFileSync(path.join(OUT_DIR, `${safe(disease)}.txt`), content, "utf8");
}
console.log(`Generated ${Object.keys(diseaseDocs).length} rich disease docs in ${OUT_DIR}`);
