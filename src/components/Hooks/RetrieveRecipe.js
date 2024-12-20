import { getFirestore, doc, getDoc } from "firebase/firestore";

export const retrieveRecipe = async (recipe_id) => {
  try {
    const db = getFirestore();
    const recipeRef = doc(db, "recipes", recipe_id);
    const recipeSnap = await getDoc(recipeRef);

    if (recipeSnap.exists()) {
      console.log("Recipe Data:", recipeSnap.data());
      return recipeSnap.data();
    } else {
      console.log("No recipe found with ID:", recipe_id);
      return null;
    }
  } catch (err) {
    console.error("Error retrieving recipe:", err);
    throw err;
  }
};

export default retrieveRecipe;
