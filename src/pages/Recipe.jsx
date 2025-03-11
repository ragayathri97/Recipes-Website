import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { fetchRecipeById } from '../services/api';

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
          setRecipe(recipeSnapshot.data());
          setIsMealDB(false);
        }
      }
    };
    fetchRecipe();
  }, [id]);

  if (!recipe) return <div>Loading...</div>;

  const ingredients = isMealDB
    ? Array.from({ length: 20 }, (_, i) => {
        const ingredient = recipe[`strIngredient${i + 1}`];
        const measure = recipe[`strMeasure${i + 1}`];
        return ingredient ? `${measure} ${ingredient}` : null;
      }).filter(Boolean)
    : recipe.ingredients.split('\n').filter(Boolean);

  const instructions = isMealDB
    ? recipe.strInstructions.split('\n').filter(Boolean)
    : recipe.instructions.split('\n').filter(Boolean);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <img src={isMealDB ? recipe.strMealThumb : 'https://via.placeholder.com/300'} alt={recipe.name || recipe.strMeal} style={{ width: '100%', borderRadius: '10px' }} />
      <h1 style={{ color: '#1e88e5' }}>{recipe.name || recipe.strMeal}</h1>
      <p>Type: {recipe.category || recipe.strCategory} | Diet: {recipe.diet || 'N/A'}</p>
      <section style={{ margin: '20px 0' }}>
        <h2 style={{ color: '#1e88e5' }}>About Recipe</h2>
        <p>{isMealDB ? 'A delicious recipe from MealDB.' : 'A custom recipe added by you.'}</p>
      </section>
      <section style={{ margin: '20px 0' }}>
        <h2 style={{ color: '#1e88e5' }}>Ingredients</h2>
        <ul>
          {ingredients.map((ingredient, index) => <li key={index}>{ingredient}</li>)}
        </ul>
      </section>
      <section style={{ margin: '20px 0' }}>
        <h2 style={{ color: '#1e88e5' }}>Instructions</h2>
        <ol>
          {instructions.map((step, index) => <li key={index}>{step}</li>)}
        </ol>
      </section>
    </div>
  );
}

export default Recipe;