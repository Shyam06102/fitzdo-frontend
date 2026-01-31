import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;