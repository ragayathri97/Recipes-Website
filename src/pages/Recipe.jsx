import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { fetchRecipeById } from '../services/api';
import RecipeDetails from '../components/RecipeDetails.jsx';

function Recipe() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isMealDB, setIsMealDB] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      const mealDBRecipe = await fetchRecipeById(id);
      if (mealDBRecipe) {
        setRecipe(mealDBRecipe);
        setIsMealDB(true);
      } else {
        const recipeDoc = doc(db, 'recipes', id);
        const recipeSnapshot = await getDoc(recipeDoc);
        if (recipeSnapshot.exists()) {
          setRecipe({ id, ...recipeSnapshot.data() }); // Include the ID for user recipes
          setIsMealDB(false);
        }
      }
    };
    fetchRecipe();
  }, [id]);

  if (!recipe) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return <RecipeDetails recipe={recipe} isMealDB={isMealDB} />;
}

export default Recipe;