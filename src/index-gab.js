require('dotenv').config();  // Load .env file at runtime
const functions = require('firebase-functions');
const OpenAI = require('openai');


// Initialize OpenAI SDK using the new structure
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.generateText = functions.https.onCall(async (request) => {
  try {
    console.log("Received data:", request); // Log the incoming data

    // Checking that the prompt is provided and is a non-empty string
    if (!(typeof request.data.prompt === "string") || request.data.prompt.length === 0) {
      throw new functions.https.HttpsError("invalid-argument", "The function must be called with a valid 'prompt' argument. Data type is: ",(typeof request.data.prompt),"prompt length is: ".request.data.prompt.length);
    }

    // Checking that the user is authenticated
    if (!request.auth) {
      throw new functions.https.HttpsError("failed-precondition", "The function must be called while authenticated.");
    }

    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: request.data.prompt }],
      model: 'gpt-4',
    });

    return { response: response.choices[0].message.content };
  } catch (error) {
    console.error('Error generating text:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate text from OpenAI.');
  }
});
