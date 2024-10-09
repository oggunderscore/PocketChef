// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8888/.netlify/functions/middleware';

export const generateRecipe = async (ingredients, budget, complexity, cookingTime, restrictions) => {
    console.log("Calling Generate Recipe...");
    const initialResponse = await axios.post(`${API_URL}/generate_recipe`, {
        ingredients,
        budget,
        complexity,
        cooking_time: cookingTime,
        restrictions,
    });

    // Assuming the initial response contains a request ID or some status
    let responseData = initialResponse.data;
    console.log("Current Response: " + responseData);

    // Polling mechanism
    while (responseData.status === 'pending') {
        await new Promise(resolve => setTimeout(resolve, 30000)); // Wait for 5 seconds

        const pollResponse = await axios.get(`${API_URL}/generate_recipe_status`, {
            params: {
                requestId: responseData.requestId // Assuming requestId is returned in the initial response
            }
        });

        responseData = pollResponse.data;
        console.log("Update Response: " + responseData);
    }

    return responseData;
};
