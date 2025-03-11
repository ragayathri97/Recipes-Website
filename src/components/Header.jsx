import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function Header() {
  const handleLogout = () => {
    signOut(auth).then(() => {
      window.location.href = '/auth';
    }).catch((error) => {
      console.error('Logout error:', error);
    });
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#fff', borderBottom: '1px solid #ccc' }}>
      <div>
        <Link to="/" style={{ marginRight: '20px', color: '#1e88e5', textDecoration: 'none', fontSize: '24px' }}>RECEPTOR</Link>
        <Link to="/" style={{ marginRight: '20px', color: '#1e88e5', textDecoration: 'none' }}>Home</Link>
        <Link to="/about" style={{ marginRight: '20px', color: '#1e88e5', textDecoration: 'none' }}>About</Link>
      </div>
      <div>
        {auth.currentUser ? (
          <button onClick={handleLogout} style={{ color: '#1e88e5', background: 'none', border: 'none', cursor: 'pointer' }}>
            Log Out
          </button>
        ) : (
          <Link to="/auth" style={{ color: '#1e88e5', textDecoration: 'none' }}>Log In</Link>
        )}
      </div>
    </header>
  );
}

export default Header;