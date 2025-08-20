import patientDatabase from './apiControllerComponents/patientDatabase.js';
import citizenDatabase from './apiControllerComponents/citizenDatabase.js';
import carDatabase from './apiControllerComponents/carDatabase.js';
import list_of_challenges from './apiControllerComponents/listOfChallenges.js';
import axios from 'axios';
import 'dotenv/config';
import OpenAI from 'openai';
import list_of_models from './apiControllerComponents/listOfModels.js';

//setting the api key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//API calls
export const sendPrompts = async (req, res) => {
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

export const firstGuardRail = async (req, res) => {
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

export const secondGuardRail = async (req, res) => {
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

export const interaction = async (req, res) => {
  const { user, content, timestamp, type } = req.params;

  try {
    client.then((client) => {
      //pushing stuff to the user as a list of their interactions
      const userId = user;
      const interaction1 = JSON.stringify({ type: type, timestamp: timestamp, content: content });
      // Store interactions in a list
      client.lPush(userId, interaction1);
    })

    res.status(200).send('Interaction added successfully');
  } catch (error) {
    console.log("error in the post ", error)
  }
}

