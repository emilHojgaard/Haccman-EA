// generateNursingTasksText.mjs
// Generates a set of nursing task guideline documents as plain text strings (one .txt per task).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "nursing_tasks");

// Fresh output directory each run
if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

// Helper to make safe filenames
const safe = (s) => s.replace(/[^a-z0-9]/gi, "_");

// Today’s date for headers
const TODAY = new Date().toISOString().split("T")[0];

// =================== TASK DOCS (each value is a single formatted string) ===================
const taskDocs = {
    "Peripheral IV Cannulation (PVC) Insertion": `TITLE: Peripheral IV Cannulation (PVC) Insertion – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: Medical Ward / Infection Medicine

Purpose:
Provide standardized steps for safe insertion, securement, and initial care of a peripheral venous catheter (PVC) in adults.

Scope:
Applies to registered nurses trained and authorized in PVC insertion in ward, ED, day-case, or outpatient settings.

Indications:
- Short-term IV access for medications, fluids, or contrast
- Temporary access while awaiting central access

Contraindications:
- Severe local infection/dermatitis at intended site
- Lymphoedema or limb with AV fistula / prior axillary node dissection
- Anticipated vesicants or high-osmolar infusions (>900 mOsm/L) → consider central access

Equipment:
- PVC kit (appropriate gauge), tourniquet, antiseptic (chlorhexidine/alcohol)
- Sterile gloves, sterile transparent dressing, stabilization device
- 0.9% saline flush, extension set / needle-free connector, sharps container, labels

Procedure Steps:
- Perform hand hygiene and don PPE; verify patient identity and allergies; explain procedure.
- Select site (forearm preferred); avoid areas of flexion if possible.
- Apply tourniquet; palpate a suitable vein; cleanse site with antiseptic and allow to dry.
- Insert catheter at 15–30° until flashback; advance cannula, withdraw needle; dispose sharps safely.
- Attach extension; aspirate/flush to confirm patency; secure with sterile dressing and stabilization device.
- Label dressing (date/time/gauge/initials). Document site, gauge, attempts, and patient tolerance.

Monitoring & Documentation:
- Check site at least once per shift for phlebitis, infiltration, leakage, and securement.
- Maintain closed system; change dressing if compromised; flush per protocol.
- Remove PVC when no longer indicated or if complications develop. Document findings and actions.

Patient Education:
- Report pain, heat, swelling, leakage, or restricted movement.
- Keep site clean/dry; avoid pulling on tubing.

Escalation:
- Signs of infiltration/extravasation, phlebitis, purulence, inability to flush → stop infusion; re-site; notify prescriber.
- Recurrent failures or prolonged therapy anticipated → consider central access.

Safety Notes:
- Aseptic non-touch technique; allow antiseptic to dry fully.
- Use the smallest gauge that meets therapy needs; minimize attempts.`,

    "IV Infusion Setup and Rate Verification (Drip)": `TITLE: IV Infusion Setup and Rate Verification (Drip) – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: Medical Ward

Purpose:
Ensure safe setup, labeling, and delivery of IV fluids/medications with accurate rate control.

Scope:
Registered nurses administering IV fluids/medications via PVC, midline, or central lines per local authorization.

Indications:
- Maintenance fluids, rehydration, medication infusions
- Titrated therapies per prescription

Contraindications:
- No patent IV access; line/device malfunction
- Fluid restriction states without explicit prescription

Equipment:
- Prescribed fluid/medication bag, giving set, infusion pump (or gravity set if policy allows)
- Labels for line and fluid, alcohol swabs, PPE

Procedure Steps:
- Verify prescription (solution/additives/rate/duration) and patient identity.
- Hand hygiene; prime line aseptically; connect to access device with ANTT.
- Program pump with rate; double-check if required; label line and bag (start time/date).
- Secure tubing; ensure free flow; set alarms appropriately.

Monitoring & Documentation:
- Hourly check (or per policy): site, line, bag volume, pump settings, and patient status.
- Record intake on fluid balance; monitor for overload (edema, crackles), pain, or leakage.
- Document changes, issues, and corrective actions.

Patient Education:
- Purpose of infusion, expected duration, pump alarms; to report pain or swelling.
- Report breathlessness, dizziness, or palpitations during infusion.

Escalation:
- Suspected fluid overload, infiltration/extravasation, persistent alarms, or acute deterioration.

Safety Notes:
- Confirm compatibility for co-infusions; use smart pumps when available.
- Replace lines/sets as per policy; never override critical alarms without assessment.`,

    "Enteral Feeding via Nasogastric (NG) Tube": `TITLE: Enteral Feeding via Nasogastric (NG) Tube – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: Nutrition Support / Medical Ward

Purpose:
Provide safe placement verification and delivery of short-term enteral nutrition and medications via NG tube.

Scope:
Nurses trained in NG tube management in ward and community settings.

Indications:
- Inadequate or unsafe oral intake
- Medication administration when oral route not feasible

Contraindications:
- Suspected basal skull fracture, severe facial trauma
- High aspiration risk without appropriate precautions and orders

Equipment:
- Fine-bore NG tube, lubricant, tape/fixation device
- pH indicator strips, feeding pump/sets, prescribed feed, PPE

Procedure Steps:
- Hand hygiene; explain; seat patient upright ≥30–45°.
- Measure NEX; lubricate and insert via nostril to mark.
- Verify placement per policy (aspirate pH ≤5.5; radiograph if required). Never use auscultation alone.
- Secure tube; commence feed at prescribed rate; flush before/after medications.

Monitoring & Documentation:
- Confirm position before each use; check patency; monitor tolerance (pain, nausea, residuals per policy).
- Record intake, weight, hydration, bowel pattern; document any complications.

Patient Education:
- Purpose of tube, posture during/after feeding, signs of distress to report.
- Community care: cleaning, flushing, and troubleshooting.

Escalation:
- Respiratory distress, suspected displacement, repeated high residuals, vomiting/aspiration.

Safety Notes:
- Maintain head elevation during and after feeding as per policy.
- Use liquid formulations when possible; flush routinely to prevent blockage.`,

    "PEG Tube Care (Gastrostomy)": `TITLE: PEG Tube Care (Gastrostomy) – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: Nutrition Support / Surgical Ward

Purpose:
Standardize daily care, patency, and skin protection for gastrostomy tubes.

Scope:
Nurses caring for patients with established PEG tubes.

Indications:
- Long-term enteral feeding and medication administration

Contraindications:
- Early post-placement manipulation outside policy
- Active cellulitis without medical review

Equipment:
- Sterile water, dressing supplies, pH strips if used, extension sets, barrier creams

Procedure Steps:
- Inspect site (redness, discharge, overgranulation); cleanse per protocol; dry thoroughly.
- Rotate external bolster 360° once healed (per policy); check external length.
- Flush before/after feeds/meds; never force if resistance.

Monitoring & Documentation:
- Daily skin checks, leakage, pain; nutrition/weight/hydration trends.
- Document site condition, care provided, and education.

Patient Education:
- Daily cleaning/rotation (when healed), routine flushing, blockage prevention, when to seek help.

Escalation:
- Buried bumper, persistent leakage, displacement, fever, severe pain.

Safety Notes:
- Avoid traction; confirm patency before use; use liquid meds when possible.`,

    "Oral Medication Administration & Swallow Screening": `TITLE: Oral Medication Administration & Swallow Screening – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: General Medicine

Purpose:
Ensure safe oral medication delivery with attention to swallowing safety and adherence.

Scope:
Nurses administering oral medications in inpatient/outpatient settings.

Indications:
- Routine medication administration via oral route

Contraindications:
- Failed swallow screen, NPO status, altered mental status without safe route

Equipment:
- MAR, prescribed medications, water, pill crusher (if appropriate), PPE

Procedure Steps:
- Verify 6 rights; perform swallow screen if indicated; seat patient upright.
- Offer one tablet at a time; do not crush modified-release/enteric-coated forms.
- Provide alternatives or route changes in consultation when needed.

Monitoring & Documentation:
- Observe for aspiration and adverse effects; document administration/refusals.
- Record teaching and adherence barriers.

Patient Education:
- Purpose of medication, timing, common side effects; when to seek help.

Escalation:
- Choking, persistent coughing, altered consciousness, refusal impacting safety.

Safety Notes:
- Use oral syringes for liquid doses; thicken fluids if prescribed.`,

    "Oxygen Therapy (Titration & Delivery)": `TITLE: Oxygen Therapy (Titration & Delivery) – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: Respiratory / Medical Ward

Purpose:
Provide safe initiation and titration of supplemental oxygen to meet prescribed SpO₂ targets.

Scope:
Nurses initiating/adjusting oxygen per protocol.

Indications:
- Hypoxemia or increased oxygen demand per medical plan

Contraindications:
- Not for breathlessness alone without hypoxemia
- Use caution in CO₂ retainers (target 88–92% unless otherwise ordered)

Equipment:
- Oxygen source, nasal cannula or masks, pulse oximeter, humidification if indicated

Procedure Steps:
- Baseline SpO₂; apply device; titrate flow to target saturation.
- Reassess frequently during changes; document device, flow, and SpO₂.

Monitoring & Documentation:
- Continuous/regular SpO₂; respiratory rate/effort; ABGs if ordered.
- Record adjustments and patient response.

Patient Education:
- Device care, safety (no smoking/open flames), when to call for help.

Escalation:
- Worsening hypoxia, increased work of breathing, reduced consciousness.

Safety Notes:
- Use appropriate fire safety; humidify if high flows per policy.`,

    "Capillary Blood Glucose & Insulin Administration": `TITLE: Capillary Blood Glucose & Insulin Administration – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: Endocrinology / Medical Ward

Purpose:
Standardize point-of-care glucose monitoring and safe insulin delivery.

Scope:
Nurses managing in-patient glycemic control.

Indications:
- Diabetes or stress hyperglycemia monitoring; insulin therapy per orders

Contraindications:
- Using alternate sites without policy; severe perfusion issues (interpret carefully)

Equipment:
- Glucose meter/strips, lancet, alcohol swabs, insulin pens/syringes, sharps container

Procedure Steps:
- Hand hygiene; confirm identity; perform fingerstick; document reading.
- Administer insulin per MAR; verify timing with meals; double-check high-risk doses.
- Treat hypoglycemia promptly; recheck as per protocol.

Monitoring & Documentation:
- AC/HS or more frequent checks if unstable; track trends; note diet/intake.
- Record doses, sites, and responses; report persistent hypo/hyperglycemia.

Patient Education:
- Recognition of hypo/hyperglycemia; sick-day rules; injection technique (when appropriate).

Escalation:
- Repeated hypoglycemia, hyperglycemia with ketones, reduced LOC.

Safety Notes:
- Never share pens; rotate sites; verify units vs mL; follow hypoglycemia algorithm.`,

    "Simple Surgical Wound Care & Dressing Change": `TITLE: Simple Surgical Wound Care & Dressing Change – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: Surgical Ward

Purpose:
Provide aseptic wound assessment and dressing changes to promote healing and prevent infection.

Scope:
Nurses performing routine post-op wound care.

Indications:
- Clean, uncomplicated surgical wounds requiring dressing care

Contraindications:
- Wounds with signs of deep infection or dehiscence without medical review

Equipment:
- Aseptic dressing pack, sterile saline, prescribed dressing, gloves/PPE

Procedure Steps:
- Hand hygiene; explain; remove old dressing; assess wound (edges, exudate, odor, periwound).
- Cleanse with sterile saline; dry; apply new dressing; secure.

Monitoring & Documentation:
- Record wound appearance, exudate amount/type, pain, and dressing used.
- Notify prescriber for infection signs or dehiscence.

Patient Education:
- Keep dressing clean/dry; report increased pain, redness, swelling, discharge.

Escalation:
- Spreading cellulitis, fever, wound breakdown.

Safety Notes:
- Aseptic non-touch technique; manage pain before procedure.`,

    "Pressure Injury Prevention Bundle": `TITLE: Pressure Injury Prevention Bundle – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: Nursing Quality & Safety

Purpose:
Reduce incidence and severity of pressure injuries through risk assessment and prevention.

Scope:
All adult inpatients; nurses in all wards.

Indications:
- Reduced mobility, sensory deficits, incontinence, malnutrition, device pressure points

Contraindications:
- None; adapt interventions to patient tolerance

Equipment:
- Risk assessment tool, pressure-relieving surfaces, positioning aids, barrier creams

Procedure Steps:
- Complete risk assessment on admission and daily or with condition changes.
- Reposition at prescribed intervals; offload heels and device pressure points.
- Optimize moisture control, nutrition, and hydration.

Monitoring & Documentation:
- Skin inspections each shift; document pressure areas and interventions.

Patient Education:
- Importance of repositioning; nutrition and hydration; call for assistance.

Escalation:
- New or worsening pressure injury; unresolved pain or non-blanching erythema.

Safety Notes:
- Protect bony prominences; ensure devices/tubes don’t create pressure points.`,

    "Urinary Catheterization (In/Out & Indwelling) Care": `TITLE: Urinary Catheterization (In/Out & Indwelling) Care – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: Urology / Medical Ward

Purpose:
Ensure aseptic catheter insertion (where authorized) and safe ongoing care to minimize CAUTI risk.

Scope:
Nurses trained in catheter insertion/care per local policy.

Indications:
- Acute urinary retention, accurate output monitoring in critical illness, peri-op use

Contraindications:
- Urethral trauma (blood at meatus), suspected urethral stricture without urology review

Equipment:
- Catheter kit, sterile gloves, antiseptic, lubricant, drainage bag/stand

Procedure Steps:
- Aseptic insertion per sex-specific technique; confirm urine flow; inflate balloon as prescribed.
- Secure catheter; maintain closed system; position bag below bladder.

Monitoring & Documentation:
- Urine color/volume, catheter function, perineal care; daily review of necessity.

Patient Education:
- Bag handling, hygiene, signs of infection, when to seek help.

Escalation:
- No urine drainage, severe pain, hematuria, fever, bypassing/leakage.

Safety Notes:
- Remove catheter at earliest opportunity; avoid unnecessary sampling from bag.`,

    "Venipuncture for Blood Sampling": `TITLE: Venipuncture for Blood Sampling – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: Phlebotomy / Medical Ward

Purpose:
Obtain blood samples safely with minimal patient discomfort and hemolysis.

Scope:
Nurses trained in venipuncture.

Indications:
- Laboratory testing as prescribed

Contraindications:
- Limb with AV fistula, lymphoedema, or prior axillary node dissection; local infection

Equipment:
- Tourniquet, needles/vacutainer system, tubes, alcohol swabs, gauze, labels, PPE

Procedure Steps:
- Identity check; explain; select site; cleanse; allow to dry.
- Perform venipuncture with correct order of draw; release tourniquet; apply pressure and dressing.

Monitoring & Documentation:
- Label tubes at bedside; check for bleeding/hematoma; document difficulties and patient tolerance.

Patient Education:
- Brief post-procedure care; report persistent bleeding or numbness.

Escalation:
- Syncope, prolonged bleeding in anticoagulated patients, failed attempts requiring escalation.

Safety Notes:
- Needle safety; avoid probing; follow biohazard protocols.`,

    "Vital Signs & Early Warning Score (EWS)": `TITLE: Vital Signs & Early Warning Score (EWS) – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: Acute Medicine

Purpose:
Detect early deterioration using standardized observations and EWS triggers.

Scope:
All adult inpatients; nurses in all wards.

Indications:
- Routine observation schedule; increased frequency if unwell

Contraindications:
- None; adapt techniques to patient condition

Equipment:
- Vital signs monitor, pulse oximeter, thermometer, EWS chart/electronic system

Procedure Steps:
- Record RR, SpO₂, HR, BP, temperature, consciousness score; calculate EWS.
- Increase frequency per score; initiate escalation per protocol (SBAR communication).

Monitoring & Documentation:
- Trend observations; document interventions and responses.

Patient Education:
- Explain purpose of frequent checks; encourage reporting of new symptoms.

Escalation:
- EWS above threshold; rapid deterioration or new red flags (chest pain, hypoxia).

Safety Notes:
- Respiratory rate accuracy is critical; verify abnormal values.`,

    "Pain Assessment & Analgesia Support": `TITLE: Pain Assessment & Analgesia Support – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: Acute Pain Service / General Medicine

Purpose:
Assess pain systematically and support safe analgesia plans.

Scope:
All adult inpatients.

Indications:
- Acute or chronic pain management

Contraindications:
- Allergy to analgesics; uncontrolled respiratory depression (opioid caution)

Equipment:
- Pain scales (NRS/VRS), MAR, PCA equipment if used, naloxone availability

Procedure Steps:
- Assess pain score at rest/movement; identify type and impact on function.
- Administer prescribed analgesia; reassess and document response.

Monitoring & Documentation:
- Sedation scores with opioids; respiratory rate and SpO₂; bowel function.
- Record efficacy and side effects; escalate inadequate control.

Patient Education:
- Purpose and timing of analgesia; avoiding overuse; constipation prevention.

Escalation:
- Severe uncontrolled pain, opioid toxicity signs, new neurological deficits.

Safety Notes:
- Use multimodal approach; lowest effective dose; bowel regimen with opioids.`,

    "Falls Risk Assessment & Prevention": `TITLE: Falls Risk Assessment & Prevention – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: Nursing Quality & Safety

Purpose:
Reduce inpatient falls through systematic screening and prevention strategies.

Scope:
All adult wards.

Indications:
- Age >65, cognitive impairment, mobility/balance issues, psychoactive meds, prior falls

Contraindications:
- None

Equipment:
- Risk assessment tool, non-slip socks, mobility aids, bed/chair alarms if indicated

Procedure Steps:
- Complete risk assessment on admission and daily; tailor interventions (call bell access, clutter-free environment, toileting schedule).
- Ensure appropriate footwear and mobility aids; consider physio referral.

Monitoring & Documentation:
- Document risk status and interventions; monitor adherence and incidents.

Patient Education:
- How to call for help; safe mobilization techniques; medication side effects.

Escalation:
- Injury after fall, recurrent near-falls, acute delirium.

Safety Notes:
- Bed at lowest height; night lighting; review sedatives.`,

    "Sepsis Screening & Escalation": `TITLE: Sepsis Screening & Escalation – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: Acute Medicine / ICU Liaison

Purpose:
Identify suspected sepsis early and trigger timely escalation and bundle care.

Scope:
All adult inpatients and ED presentations.

Indications:
- Suspected infection with physiological derangement (fever/hypothermia, tachycardia, tachypnea, hypotension, altered mentation)

Contraindications:
- None; screening tools guide rather than replace clinical judgment

Equipment:
- EWS chart, lactate sampling, blood culture kits, IV access supplies

Procedure Steps:
- Apply sepsis screening tool; obtain lactate, cultures (before antibiotics if possible); start fluids and antibiotics per protocol after urgent medical review.
- Begin oxygen if hypoxic; monitor closely.

Monitoring & Documentation:
- Record vitals frequently; track lactate trend; document time to antibiotics/fluids.

Patient Education:
- Explain concern, rapid investigations/treatments.

Escalation:
- Persistent hypotension, rising lactate, deteriorating EWS → rapid response/ICU.

Safety Notes:
- Early antibiotics save lives; de-escalate with culture results.`,

    "Tracheostomy Care (Established)": `TITLE: Tracheostomy Care (Established) – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: ENT / Critical Care Outreach

Purpose:
Provide safe routine care for patients with an established tracheostomy.

Scope:
Nurses trained in tracheostomy care on designated wards.

Indications:
- Established tracheostomy requiring routine care and suction

Contraindications:
- Fresh tracheostomy outside specialist unit (follow unit-specific protocol)

Equipment:
- Suction unit/catheters, humidification, spare trach tubes, PPE, emergency kit

Procedure Steps:
- Assess airway patency, oxygenation, and need for suction; perform suction aseptically.
- Clean stoma/dressing; ensure humidification and secure ties; check speaking valve per plan.

Monitoring & Documentation:
- SpO₂, respiratory effort, secretion characteristics; document care and tolerance.

Patient Education:
- Communication strategies, suction expectations, emergency signs.

Escalation:
- Tube dislodgement, bleeding, respiratory distress, subcutaneous emphysema.

Safety Notes:
- Emergency equipment at bedside; two-person technique for tie changes.`,

    "Chest Physiotherapy & Airway Clearance": `TITLE: Chest Physiotherapy & Airway Clearance – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: Respiratory Physiotherapy / Medical Ward

Purpose:
Facilitate secretion mobilization and improve ventilation in suitable patients.

Scope:
Nurses collaborating with physiotherapy.

Indications:
- Retained secretions, atelectasis risk, neuromuscular weakness

Contraindications:
- Unstable spine, severe hemoptysis, untreated pneumothorax

Equipment:
- Incentive spirometer, PEP device, nebulizer (if prescribed), suction

Procedure Steps:
- Teach deep-breathing, coughing/huffing; use PEP/incentive devices as prescribed; encourage early mobilization.
- Coordinate pre-medication (bronchodilator/analgesia) if needed.

Monitoring & Documentation:
- SpO₂, breath sounds, sputum volume/viscosity; record tolerance and effect.

Patient Education:
- Technique practice, hydration, adherence schedule.

Escalation:
- Worsening hypoxia, chest pain, poor response.

Safety Notes:
- Tailor to patient capacity; stop if distressing or unstable.`,

    "Isolation Precautions & PPE": `TITLE: Isolation Precautions & PPE – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: Infection Prevention & Control

Purpose:
Prevent transmission of infectious agents via standard and transmission-based precautions.

Scope:
All clinical areas.

Indications:
- Suspected/confirmed infectious diseases requiring contact/droplet/airborne precautions

Contraindications:
- None

Equipment:
- PPE per mode (gloves, gown, surgical mask/FFP2-3, eye protection), signage, dedicated equipment

Procedure Steps:
- Perform hand hygiene; don PPE in correct order; use dedicated equipment; minimize room entry.
- Doff PPE safely; perform hand hygiene; clean/disinfect environment and equipment.

Monitoring & Documentation:
- Compliance audits; document patient isolation status and education.

Patient Education:
- Explain reason for isolation and PPE; reinforce hand hygiene and visitor guidance.

Escalation:
- Outbreak suspicion; exposure incidents; PPE breach.

Safety Notes:
- Fit-testing for respirators; never reuse single-use PPE unless policy allows.`,

    "Blood Transfusion – Nursing Procedure": `TITLE: Blood Transfusion – Nursing Procedure – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: Transfusion Medicine / Medical Ward

Purpose:
Ensure safe administration and monitoring of blood components.

Scope:
Nurses trained and credentialed for transfusion.

Indications:
- Anemia, bleeding, or coagulopathy per medical prescription

Contraindications:
- None absolute; follow prescriber thresholds and consent requirements

Equipment:
- Blood product with compatibility label, transfusion set/filter, IV access, vitals monitor, emergency drugs

Procedure Steps:
- Pre-transfusion checks: consent, identification (two-person check), product verification, baseline vitals.
- Start transfusion per rate; observe closely for first 15 minutes; adjust rate per policy.

Monitoring & Documentation:
- Vitals at baseline, 15 min, hourly, and completion; monitor for reactions (fever, rigors, rash, dyspnea).
- Document product details, times, and patient response.

Patient Education:
- Explain purpose/risks; report itching, chills, breathlessness immediately.

Escalation:
- Suspected reaction → stop transfusion, maintain IV with saline, notify medical team and blood bank.

Safety Notes:
- Strict identity checks; no meds added to blood bag; complete traceability forms.`,

    "End-of-Life Care: Comfort Measures": `TITLE: End-of-Life Care: Comfort Measures – Nursing Clinical Guideline
Version: 1.0
Date: ${TODAY}
Responsible Department: Palliative Care / General Medicine

Purpose:
Provide symptom relief, dignity, and family support in the last days/hours of life.

Scope:
All adult wards with palliative patients.

Indications:
- Recognized dying phase with shift to comfort-focused care

Contraindications:
- None; individualized planning is essential

Equipment:
- Symptom control medications, syringe driver if used, mouth/skin care supplies

Procedure Steps:
- Assess comfort needs (pain, breathlessness, agitation, secretions); implement standing PRN orders.
- Provide mouth/skin care; minimize non-beneficial interventions; support family presence and rituals.

Monitoring & Documentation:
- Regular symptom scores; document interventions and response; update care plan.

Patient/Family Education:
- Explain focus on comfort; what to expect; how to request help.

Escalation:
- Refractory distress, complex psychosocial issues → palliative specialist team.

Safety Notes:
- Respect goals of care and cultural needs; clear, compassionate communication.`
};

// =================== WRITE FILES ===================
for (const [task, content] of Object.entries(taskDocs)) {
    const filename = `${safe(task)}.txt`;
    fs.writeFileSync(path.join(OUT_DIR, filename), content, "utf8");
    console.log("Created:", filename);
}

console.log(`Generated ${Object.keys(taskDocs).length} nursing task documents in ${OUT_DIR}`);
