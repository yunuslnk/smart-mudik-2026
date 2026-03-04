import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, Heart, LogOut, LogIn } from 'lucide-react'
import { useAuth } from '../services/AuthContext'
import './Layout.css'

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation()
    const { user, login, logout } = useAuth()

    return (
        <div className="layout-container premium-view">
            <header className="premium-header">
                <Link to="/" className="premium-logo">smart mudik 2026</Link>
                <nav className="premium-nav">
                    <Link to="/" className={`premium-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/daftar" className={`premium-nav-item ${location.pathname === '/daftar' ? 'active' : ''}`}>
                        <PlusCircle size={18} />
                        <span>Daftar</span>
                    </Link>
                    <Link to="/donasi" className={`premium-nav-item ${location.pathname === '/donasi' ? 'active' : ''}`}>
                        <Heart size={18} />
                        <span>Donasi</span>
                    </Link>
                    {user ? (
                        <button onClick={logout} className="premium-nav-item btn-plain">
                            <LogOut size={18} />
                            <span>Keluar</span>
                        </button>
                    ) : (
                        <button onClick={login} className="premium-nav-item btn-plain">
                            <LogIn size={18} />
                            <span>Masuk</span>
                        </button>
                    )}
                </nav>
            </header>

            <main className="content">
                {children}
            </main>
        </div>
    )
}
