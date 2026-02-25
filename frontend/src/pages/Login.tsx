import React from 'react'
import { Grid, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../services/AuthContext'
import './Login.css'

export const Login: React.FC = () => {
    const { login } = useAuth()

    return (
        <div className="login-container">
            <div className="login-card glass">
                <div className="login-logo">
                    <Grid className="text-primary" size={48} />
                    <h1>Seikatsu<span className="text-muted">Mudik</span></h1>
                </div>

                <div className="login-content">
                    <h2>Selamat Datang</h2>
                    <p>Pantau arus mudik 2026 dengan lebih mudah dan transparan.</p>

                    <button onClick={login} className="btn-google">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                        <span>Masuk dengan Google</span>
                    </button>
                </div>

                <div className="login-footer">
                    &copy; 2026 Smart Mudik Team. All rights reserved.
                </div>
            </div>
        </div>
    )
}
