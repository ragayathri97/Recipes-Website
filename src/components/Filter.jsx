import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../redux/actions';

function Filter({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { category, diet } = useSelector(state => state.filters);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedDiet, setSelectedDiet] = useState(diet);

  const categories = ['Bread', 'Salad', 'Dessert', 'Drink', 'Main', 'Snack', 'Soup', 'Pastry'];
  const diets = ['Keto', 'Vegetarian', 'Vegan', 'Other'];

  const handleApplyFilters = () => {
    dispatch(setFilters({ category: selectedCategory, diet: selectedDiet }));
    onClose();
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedDiet('');
    dispatch(setFilters({ category: '', diet: '' }));
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '10px', position: 'relative', maxWidth: '500px', width: '90%' }}>
        <h3 style={{ color: '#1e88e5' }}>Filter Selection</h3>
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>X</button>
        <div style={{ marginBottom: '20px' }}>
          <h4>Category</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {categories.map(cat => (
              <div
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', cursor: 'pointer', backgroundColor: selectedCategory === cat ? '#1e88e5' : 'transparent', color: selectedCategory === cat ? 'white' : '#1e88e5' }}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4>Diet</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {diets.map(d => (
              <div
                key={d}
                onClick={() => setSelectedDiet(d)}
                style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', cursor: 'pointer', backgroundColor: selectedDiet === d ? '#1e88e5' : 'transparent', color: selectedDiet === d ? 'white' : '#1e88e5' }}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={handleClearFilters} style={{ padding: '10px 20px', backgroundColor: '#fff', border: '1px solid #1e88e5', borderRadius: '5px', color: '#1e88e5' }}>Clear Filter</button>
          <button onClick={handleApplyFilters} style={{ padding: '10px 20px', backgroundColor: '#1e88e5', color: 'white', border: 'none', borderRadius: '5px' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default Filter;