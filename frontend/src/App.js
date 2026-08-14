import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import ListingsPage from './pages/ListingsPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import FavoritesPage from './pages/FavoritesPage';

function App() {
    return (
      <ErrorBoundary name="The application">
        <BrowserRouter>
          <FavoritesProvider>
            <ErrorBoundary name="The navigation bar">
              <Navbar />
            </ErrorBoundary>
          <Routes>
            <Route 
              path="/" 
              element={
                <ErrorBoundary name="The listings page">
                  <ListingsPage />
                </ErrorBoundary>
                } 
              />
            <Route 
              path="/property/:id" 
              element={
                <ErrorBoundary name="The property detail page">
                  <PropertyDetailPage />
                </ErrorBoundary>
                } 
              />
            <Route 
              path="/favorites" 
              element={
                <ErrorBoundary name="The favorites page">
                  <FavoritesPage />
                </ErrorBoundary>
              } 
            />
          </Routes>
          </FavoritesProvider>
        </BrowserRouter>
      </ErrorBoundary>
    );
}

export default App;
