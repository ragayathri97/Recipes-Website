import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore';

function RecipeDetails({ recipe, isMealDB }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle deleting a user recipe
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteDoc(doc(db, 'recipes', recipe.id));
        navigate('/'); // Redirect to homepage after deletion
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete recipe. Please try again.');
      }
    }
  };

  // Handle sharing the recipe URL
  const handleShare = () => {
    const url = window.location.origin + location.pathname;
    navigator.clipboard
      .writeText(url)
      .then(() => alert('Recipe URL copied to clipboard!'))
      .catch(() => alert('Failed to copy URL.'));
  };

  // Process ingredients based on whether the recipe is from MealDB or Firestore
  const ingredients = isMealDB
    ? Array.from({ length: 20 }, (_, i) => {
        const ingredient = recipe[`strIngredient${i + 1}`];
        const measure = recipe[`strMeasure${i + 1}`];
        return ingredient ? `${measure} ${ingredient}` : null;
      }).filter(Boolean)
    : recipe.ingredients.split('\n').filter(Boolean);

  // Process instructions based on whether the recipe is from MealDB or Firestore
  const instructions = isMealDB
    ? recipe.strInstructions.split('\n').filter(Boolean)
    : recipe.instructions.split('\n').filter(Boolean);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#e3f2fd',
          border: '1px solid #1e88e5',
          borderRadius: '5px',
          color: '#1e88e5',
          cursor: 'pointer',
          fontWeight: '500'
        }}
      >
        Back to Home
      </button>

      {/* Recipe Image and Title */}
      <img
        src={isMealDB ? recipe.strMealThumb : 'https://via.placeholder.com/300'}
        alt={recipe.name || recipe.strMeal}
        style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '10px' }}
      />
      <h1 style={{ color: '#1e88e5', marginTop: '20px' }}>{recipe.name || recipe.strMeal}</h1>
      <p style={{ color: '#666' }}>
        Type: {recipe.category || recipe.strCategory} | Diet: {recipe.diet || 'N/A'}
      </p>

      {/* Share Button */}
      <button
        onClick={handleShare}
        style={{
          margin: '10px 0',
          padding: '10px 20px',
          backgroundColor: '#1e88e5',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: '500'
        }}
      >
        Share Recipe
      </button>

      {/* Edit/Delete Buttons for User Recipes */}
      {!isMealDB && (
        <div style={{ margin: '10px 0' }}>
          <button
            onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
            style={{
              marginRight: '10px',
              padding: '10px 20px',
              backgroundColor: '#1e88e5',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Edit Recipe
          </button>
          <button
            onClick={handleDelete}
            style={{
              padding: '10px 20px',
              backgroundColor: '#e53935',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Delete Recipe
          </button>
        </div>
      )}

      {/* About Recipe Section */}
      <section style={{ margin: '20px 0' }}>
        <h2 style={{ color: '#1e88e5' }}>About Recipe</h2>
        <p style={{ color: '#666' }}>
          {isMealDB ? 'A delicious recipe sourced from MealDB.' : 'A custom recipe added by you.'}
        </p>
      </section>

      {/* Ingredients Section */}
      <section style={{ margin: '20px 0' }}>
        <h2 style={{ color: '#1e88e5' }}>Ingredients</h2>
        <ul style={{ paddingLeft: '20px', color: '#333' }}>
          {ingredients.map((ingredient, index) => (
            <li key={index} style={{ marginBottom: '5px' }}>
              {ingredient}
            </li>
          ))}
        </ul>
      </section>

      {/* Instructions Section */}
      <section style={{ margin: '20px 0' }}>
        <h2 style={{ color: '#1e88e5' }}>Instructions</h2>
        <ol style={{ paddingLeft: '20px', color: '#333' }}>
          {instructions.map((step, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              {step}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export default RecipeDetails;