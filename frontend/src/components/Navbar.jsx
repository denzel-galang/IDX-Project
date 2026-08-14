import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFavoritesContext } from '../context/FavoritesContext';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { favoritesCount } = useFavoritesContext();

    return (
        <nav className="navbar">
            <div className="navbar__inner">
                <span
                    className="navbar__logo"
                    onClick={() => navigate('/')}
                >
                    IDX Properties
                </span>
                <div className="navbar__links">
                    <button
                        className={`navbar__link ${location.pathname === '/' ? 'navbar__link--active' : ''}`}
                        onClick={() => navigate('/')}
                    >
                        Listings
                    </button>
                    <button
                        className={`navbar__link ${location.pathname === '/favorites' ? 'navbar__link--active' : ''}`}
                        onClick={() => navigate('/favorites')}
                    >
                        Saved
                        {favoritesCount > 0 && (
                            <span className="navbar__badge">{favoritesCount}</span>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;