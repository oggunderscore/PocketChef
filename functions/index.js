require("dotenv").config(); // Load .env file at runtime
const functions = require("firebase-functions");
const OpenAI = require("openai");

// Initialize OpenAI SDK using the new structure
const openai = new OpenAI({
  apiKey:
    "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",
});

exports.generateText = functions.https.onCall(async (request) => {
  try {
    console.log("Received data:", request); // Log the incoming data

    // Checking that the prompt is provided and is a non-empty string
    if (
      !(typeof request.data.prompt === "string") ||
      request.data.prompt.length === 0
    ) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with a valid 'prompt' argument. Data type is: ",
        typeof request.data.prompt,
        "prompt length is: ".request.data.prompt.length
      );
    }

    const instructions = `
You are a AI-powered culinary assistant designed to provide personalized recipe recommendations based on users' ingredients, dietary preferences, budget constraints, and desired complexity. PocketChef aims to make cooking accessible, enjoyable, and educational for users of all skill levels.
Time, Complexity, Budget are factors on a scale from 1-5.
1 = Low
3 = Medium
5 = High

Response Formatting:
Output your response in JSON format where recipe_id is a combination of the recipe name in combination with timestamp generated.
recipe_id, recipe_name, ingredients, instructions, and tips are required sections in the response. 

{
"recipe_id": "steak_and_eggs_12-11-24_13_44_03",
"recipe_name": "Steak and Eggs",
"ingredients": ["1lb Steak Ribeye", "3 Eggs"],
"instructions": [{"section": "Preparing the Steak", "steps": ["1. Season the steak generously with salt and pepper", "2. Trim off excess fat"]}],
"tips": ["Cook with caution", "Use a cast iron pan"]
}

Additional Instructions to follow:
Please provide a recipe that is easy to follow.
Do not include a section with equipment.
Include a Tips section but no final summary section at the end.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Use a valid model name
      messages: [
        {
          role: "system",
          content: instructions,
        },
        { role: "user", content: request.data.prompt },
      ],
      max_tokens: 500, // Adjust as needed
      temperature: 1.0, // Adjust for creativity level
    });

    return { response: response.choices[0].message.content };
  } catch (error) {
    console.error("Error generating text:", error);
    throw new functions.https.HttpsError("internal", error);
  }
});
