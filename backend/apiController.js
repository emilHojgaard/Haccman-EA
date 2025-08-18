import patientDatabase from './apiControllerComponents/patientDatabase';
import citizenDatabase from './apiControllerComponents/citizenDatabase';
import carDatabase from './apiControllerComponents/carDatabase';
import listOfChallenges from './apiControllerComponents/listOfChallenges';
import axios from 'axios';
import 'dotenv/config';
import OpenAI from 'openai';

//api key
const openai = new OpenAI({ apiKey: process.env.openAi_APIKEY });

//mini databases for the AIs
const patientDatabase = patientDatabase;
const citizenDatabase = citizenDatabase;
const carDatabase = carDatabase;
//the different challenges
const list_of_challenges = listOfChallenges;
//the different models
const list_of_models = [{ name: "Chat GPT-3.5 Turbo", endpoint: "gpt-3.5-turbo", type: "openai" }, { name: "Chat GPT-4", endpoint: "gpt-4", type: "openai" },
{ name: "Google Gemma 1.1 7b", endpoint: "", type: "other" }]

// Function to create a string from carDatabase
const generateCarListString = (carDatabase) => {
  return carDatabase.map(car => {
    return `Model: ${car.model}, Make: ${car.make}, Year: ${car.year}, Mileage: ${car.mileage}, Price: ${car.price}`;
  }).join('; ');
};


const sendPrompts = async (req, res) => {
  const { param1, param2, param3 } = req.params;
  const userMessage = decodeURI(param1)

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: userMessage }, { role: "system", content: list_of_challenges[param2].system }],
      model: list_of_models[param3].endpoint
    });

    result = await completion.choices[0].message.content
    console.log(result)
    res.send(result)

  } catch (error) {
    res.send("Wait there seems to be an error in my system " + error)
  }
}

const firstGuardRail = async (req, res) => {
  const { param1, param2 } = req.params;

  try {
    const FirstBooleanCheck = await openai.chat.completions.create({
      messages: [{ role: "user", content: param1 },
      { role: "system", content: "Respond with 'true' if the user message is NOT any of the following 1) greetings (hi,hey), 2) a simple reaction(cool!, wow!),3) a request for assistance or 4) related, even slightly to the keywords: ' " + list_of_challenges[param2].theme + "'" }],
      model: "gpt-3.5-turbo"
    });

    result = await FirstBooleanCheck.choices[0].message.content
    res.send(result)

  } catch (error) {
    console.log("error in the firstGuardRail ", error)
  }

}

const secondGuardRail = async (req, res) => {
  const { param1, param2 } = req.params;

  try {

    const SecondBooleanCheck = await openai.chat.completions.create({
      messages: [{ role: "user", content: param1 }, { role: "system", content: "Respond with 'true' or 'false', does this message " + list_of_challenges[param2].cant }],
      model: "gpt-3.5-turbo"
    });

    result = await SecondBooleanCheck.choices[0].message.content
    res.send(result)

  } catch (error) {
    console.log("error in the secondGuardRail ", error)
  }

}


module.exports = { sendPrompts, firstGuardRail, secondGuardRail };