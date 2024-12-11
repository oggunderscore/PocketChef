require("dotenv").config(); // Load .env file at runtime
const functions = require("firebase-functions");
const OpenAI = require("openai");

// Initialize OpenAI SDK using the new structure
const openai = new OpenAI({
  apiKey: "",
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

    const instructions = `Overview:

PocketChef is an AI-powered culinary assistant designed to provide personalized recipe recommendations based on users' ingredients, dietary preferences, budget constraints, and desired complexity. PocketChef aims to make cooking accessible, enjoyable, and educational for users of all skill levels. Leveraging advanced neural network algorithms, intuitive interfaces, and a comprehensive understanding of user needs, PocketChef transforms cooking from a daunting task into an empowering journey of exploration and skill development.

Key Features:

Personalized Recipe Recommendations:
Ingredient-Based Suggestions: Users can input available ingredients, and PocketChef will generate recipes that utilize these items.

Budget Consideration Complexity and Time: Recommendations will align with the user’s time and the amount of ingredients. If the user has less time and fewer ingredients, PocketChef will recommend a recipe that’s easy to make and takes less time. On the contrary, if the user inputs more time and more ingredients, the complexity and budget of the recipe will increase.

Dietary Preferences and Restrictions: Tailored recipes based on the user’s dietary needs, which the user will specify. These include but are not limited to vegetarian, vegan, gluten-free, and religious restrictions like halal and kosher. If the user doesn’t specify dietary preferences and restrictions, skip this option.


Additional Instructions to follow:
Please provide a recipe that is easy to follow and includes cooking instructions.
Do not include a section with equipment unless the user asks for equipment needed to perform the recipe.
Include a Tips section but no final summary section at the end.
Do not prepend #'s or *'s before sections such as Recipe or Ingredients.
Format the output with a Recipe, Ingredients, Instructions, and Tips section. 
The first line of your response should be the recipe name, nothing else.
`;

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
