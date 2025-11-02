import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import PrivateRoute from './components/auth/PrivateRoute'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import PostList from './components/posts/PostList'
import PostForm from './components/posts/PostForm'
import MyPosts from './components/posts/MyPosts'
import PostDetail from './components/posts/PostDetail'
import Profile from './components/profile/Profile'
import Stats from './components/admin/Stats'
import Users from './components/admin/Users'
import Categories from './components/admin/Categories'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Rutas PÚBLICAS */}
            <Route path="/" element={<PostList />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas PROTEGIDAS - Requieren autenticación */}
            <Route path="/posts/create" element={
              <PrivateRoute>
                <PostForm />
              </PrivateRoute>
            } />
            
            <Route path="/posts/edit/:id" element={
              <PrivateRoute>
                <PostForm />
              </PrivateRoute>
            } />
            
            <Route path="/my-posts" element={
              <PrivateRoute>
                <MyPosts />
              </PrivateRoute>
            } />

            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            
            {/* Rutas de ADMINISTRACIÓN */}
            <Route path="/stats" element={
              <PrivateRoute requiredRoles={['admin', 'moderator']}>
                <Stats />
              </PrivateRoute>
            } />
            
            <Route path="/admin/users" element={
              <PrivateRoute requiredRole="admin">
                <Users />
              </PrivateRoute>
            } />

            <Route path="/admin/categories" element={
              <PrivateRoute requiredRoles={['admin', 'moderator']}>
                <Categories />
              </PrivateRoute>
            } />
            
            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  )
}

export default App