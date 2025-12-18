import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { FeaturedProducts } from './components/FeaturedProducts';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CategoryPage } from './pages/CategoryPage';
import { AdminDashboard } from './pages/Admin/Dashboard';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function Home() {
  return (
    <>
      <Hero />
      <Features />
      <FeaturedProducts />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Header />
          <main style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          {/* Footer would go here */}
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
