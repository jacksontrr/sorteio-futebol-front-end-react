import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import './index.css';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import SorteioPublicView from './pages/SorteioPublicView';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { Toaster } from '@/components/ui/sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';

const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
// Definição das rotas
const router = createBrowserRouter([
    { path: '/', element: <Navigate to="/login" replace /> },
    { path: '/login', element: <PublicRoute element={<LoginPage />} /> },
    { path: '/register', element: <PublicRoute element={<RegisterPage />} /> },
    { path: '/organizer', element: <ProtectedRoute element={<OrganizerDashboard />} /> },
    { path: '/sorteio/:id', element: <SorteioPublicView /> },
]);

// Monta o app no #root
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
            <RouterProvider router={router} />
            <Toaster richColors position="top-right" duration={3000} />
        </GoogleOAuthProvider>
    </React.StrictMode>,
);
