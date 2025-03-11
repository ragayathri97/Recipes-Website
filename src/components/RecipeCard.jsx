import React from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore';

function RecipeCard({ recipe, isMealDB }) {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      await deleteDoc(doc(db, 'recipes', recipe.id));
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', textAlign: 'center' }}>
      <img src={isMealDB ? recipe.strMealThumb : 'https://via.placeholder.com/150'} alt={recipe.name || recipe.strMeal} style={{ width: '100%', borderRadius: '5px' }} />
      <h3>{recipe.name || recipe.strMeal}</h3>
      <p>Type: {recipe.category || recipe.strCategory}</p>
      <p>Diet: {recipe.diet || 'N/A'}</p>
      <Link to={`/recipe/${recipe.idMeal || recipe.id}`} style={{ color: '#1e88e5', textDecoration: 'none' }}>View Details</Link>
      {!isMealDB && (
        <div style={{ marginTop: '10px' }}>
          <Link to={`/edit-recipe/${recipe.id}`} style={{ marginRight: '10px', color: '#1e88e5', textDecoration: 'none' }}>Edit</Link>
          <button onClick={handleDelete} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default RecipeCard;