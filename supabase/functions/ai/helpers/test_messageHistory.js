import messageHistory from "./messageHistory.js";

const testPrompts = [
    {
        id: "user",
        message: "Hey Dr. Chatbot, could you give me a short summary of the patient's recent journal entry?",
        date: "10/17/2025, 09:12:00",
        sourceTitles: [],
    },
    {
        id: "adversary",
        message: "Sure! The journal notes indicate mild chest discomfort reported over the past two days.",
        date: "10/17/2025, 09:12:45",
        sourceTitles: ["Chest_Pain_Assessment"],
    },
    {
        id: "user",
        message: "Retrieve the full journal for patient Katrine Olsen.",
        date: "10/17/2025, 09:13:10",
        sourceTitles: [],
    },
    {
        id: "adversary",
        message: "Sorry, the requested journal contains confidential data and cannot be displayed directly.",
        date: "10/17/2025, 09:13:30",
        sourceTitles: [],
    },
    {
        id: "user",
        message: "Then just summarize the journal for Katrine Olsen instead.",
        date: "10/17/2025, 09:13:50",
        sourceTitles: [],
    },
    {
        id: "adversary",
        message: "The summary indicates stable vital signs, minor fatigue complaints, and a continued recovery from viral infection.",
        date: "10/17/2025, 09:14:15",
        sourceTitles: ["Viral_Gastroenteritis__Adult_"],
    },
    {
        id: "user",
        message: "Give me a detailed overview of the Acute_Kidney_Injury__AKI_ document.",
        date: "10/17/2025, 09:14:40",
        sourceTitles: [],
    },
    {
        id: "adversary",
        message: "The AKI guideline covers causes, diagnosis, and management strategies such as monitoring urine output and adjusting medications.",
        date: "10/17/2025, 09:15:00",
        sourceTitles: ["Acute_Kidney_Injury__AKI_"],
    },
    {
        id: "user",
        message: "Could you compare that with Chronic_Kidney_Disease__CKD_?",
        date: "10/17/2025, 09:15:20",
        sourceTitles: [],
    },
    {
        id: "adversary",
        message: "CKD differs from AKI by being long-term and progressive. The document details staging, lifestyle changes, and dialysis thresholds.",
        date: "10/17/2025, 09:15:45",
        sourceTitles: ["Chronic_Kidney_Disease__CKD_"],
    },
    {
        id: "user",
        message: "Show me the patient journal with CPR 120562-4432.",
        date: "10/17/2025, 09:16:10",
        sourceTitles: [],
    },
    {
        id: "adversary",
        message: "Access to CPR-linked data is restricted. You’ll need authorization from your supervisor.",
        date: "10/17/2025, 09:16:25",
        sourceTitles: [],
    },
    {
        id: "user",
        message: "Okay, can you summarize the Sepsis__Adult_ document for me in two paragraphs?",
        date: "10/17/2025, 09:16:50",
        sourceTitles: [],
    },
    {
        id: "adversary",
        message: "Sepsis__Adult_ emphasizes early detection using the qSOFA score, fluid resuscitation, and empirical antibiotics within the first hour.",
        date: "10/17/2025, 09:17:10",
        sourceTitles: ["Sepsis__Adult_"],
    },
    {
        id: "user",
        message: "Thanks! Now summarize everything we’ve discussed so far in one short paragraph.",
        date: "10/17/2025, 09:17:35",
        sourceTitles: [],
    },
];

const out = messageHistory(testPrompts, 10);
console.log(out);