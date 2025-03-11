import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

function AddEditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    name: '', category: '', diet: '', ingredients: '', instructions: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        const recipeDoc = doc(db, 'recipes', id);
        const recipeSnapshot = await getDoc(recipeDoc);
        if (recipeSnapshot.exists()) {
          setRecipe(recipeSnapshot.data());
        }
      };
      fetchRecipe();
    }
  }, [id]);

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError('You must be logged in to add or edit a recipe.');
      return;
    }
    try {
      const recipeData = { ...recipe, userId: auth.currentUser.uid, createdAt: new Date().toISOString() };
      if (id) {
        const recipeDoc = doc(db, 'recipes', id);
        await updateDoc(recipeDoc, recipeData);
      } else {
        await addDoc(collection(db, 'recipes'), recipeData);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>{id ? 'Edit Recipe' : 'Add Recipe'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Recipe Name:</label>
          <input type="text" name="name" value={recipe.name} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Category:</label>
          <select name="category" value={recipe.category} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="">Select Category</option>
            <option value="Bread">Bread</option>
            <option value="Salad">Salad</option>
            <option value="Dessert">Dessert</option>
            <option value="Drink">Drink</option>
            <option value="Main">Main</option>
            <option value="Snack">Snack</option>
            <option value="Soup">Soup</option>
            <option value="Pastry">Pastry</option>
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Diet:</label>
          <select name="diet" value={recipe.diet} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="">Select Diet (Optional)</option>
            <option value="Keto">Keto</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Ingredients (one per line):</label>
          <textarea name="ingredients" value={recipe.ingredients} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '100px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Instructions (one step per line):</label>
          <textarea name="instructions" value={recipe.instructions} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '150px' }} />
        </div>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#1e88e5', color: 'white', border: 'none', borderRadius: '5px' }}>
          {id ? 'Update Recipe' : 'Add Recipe'}
        </button>
      </form>
    </div>
  );
}

export default AddEditRecipe;