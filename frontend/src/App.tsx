import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { MudikForm } from './pages/MudikForm'
import { Donation } from './pages/Donation'
import { AuthProvider, useAuth } from './services/AuthContext'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth()

    if (loading) return <div className="loading-screen">Memuat...</div>
    return user ? children : <Navigate to="/login" />
}

function AppContent() {
    const { loading } = useAuth()

    if (loading) return <div className="loading-screen">Memuat...</div>

    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={
                <Layout>
                    <Dashboard />
                </Layout>
            } />

            <Route path="/daftar" element={
                <PrivateRoute>
                    <Layout>
                        <MudikForm />
                    </Layout>
                </PrivateRoute>
            } />

            <Route path="/donasi" element={
                <PrivateRoute>
                    <Layout>
                        <Donation />
                    </Layout>
                </PrivateRoute>
            } />
        </Routes>
    )
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    )
}

export default App
