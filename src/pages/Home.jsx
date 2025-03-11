import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { fetchRecipes, fetchRecipesByCategory } from '../services/api';
import RecipeCard from '../components/RecipeCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Filter from '../components/Filter.jsx';
import { useSelector } from 'react-redux';

function Home() {
  const [mealDBRecipes, setMealDBRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const { category, diet } = useSelector(state => state.filters);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchMealDBRecipes = async () => {
      let recipes = await fetchRecipes(searchQuery);
      if (category) {
        recipes = await fetchRecipesByCategory(category);
      }
      if (diet) {
        recipes = recipes.filter(recipe =>
          recipe.strMeal.toLowerCase().includes(diet.toLowerCase())
        );
      }
      setMealDBRecipes(recipes);
    };
    fetchMealDBRecipes();
  }, [searchQuery, category, diet]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, 'recipes'), where('userId', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserRecipes(recipes);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="app-container">
      <SearchBar setSearchQuery={setSearchQuery} />
      <button 
        onClick={() => setIsFilterOpen(!isFilterOpen)} 
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#e3f2fd', 
          border: '1px solid #1e88e5', 
          borderRadius: '5px', 
          color: '#1e88e5' 
        }}
      >
        {isFilterOpen ? 'Hide Filter' : 'Show Filter'}
      </button>
      <Filter 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
      <Link 
        to="/add-recipe" 
        style={{ 
          maxWidth: '120px', 
          textAlign: 'center', 
          display: 'block', 
          margin: '10px 0', 
          padding: '10px 20px', 
          backgroundColor: '#1e88e5', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '5px' 
        }}
      >
        Add New Recipe
      </Link>
      <h2 style={{ color: '#1e88e5' }}>MealDB Recipes</h2>
      <div className="recipe-grid">
        {mealDBRecipes.map(recipe => (
          <RecipeCard 
            key={recipe.idMeal} 
            recipe={recipe} 
            isMealDB={true} 
          />
        ))}
      </div>
      <h2 style={{ color: '#1e88e5' }}>Your Recipes</h2>
      <div className="recipe-grid">
        {userRecipes.map(recipe => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            isMealDB={false} 
          />
        ))}
      </div>
    </div>
  );
}

export default Home;