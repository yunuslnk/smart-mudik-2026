import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Search, Bell, Grid, LayoutDashboard, Map, Settings, LogOut, User, PlusCircle, Heart, LogIn } from 'lucide-react'
import { useAuth } from '../services/AuthContext'
import './Layout.css'

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation()
    const { user, login, logout } = useAuth()

    return (
        <div className="layout-container">
            {/* Sidebar - Desktop */}
            <aside className="sidebar">
                <div className="logo-container">
                    <Grid className="text-primary" size={28} />
                    <span className="logo-text">Seikatsu<span className="text-muted">Mudik</span></span>
                </div>

                <nav className="nav-menu">
                    <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/daftar" className={`nav-item ${location.pathname === '/daftar' ? 'active' : ''}`}>
                        <PlusCircle size={20} />
                        <span>Daftar Mudik</span>
                    </Link>
                    <Link to="/donasi" className={`nav-item ${location.pathname === '/donasi' ? 'active' : ''}`}>
                        <Heart size={20} />
                        <span>Donasi</span>
                    </Link>
                    <Link to="#" className="nav-item">
                        <Bell size={20} />
                        <span>Notifikasi</span>
                    </Link>
                    {user && (
                        <Link to="#" className="nav-item">
                            <User size={20} />
                            <span>Profil</span>
                        </Link>
                    )}
                </nav>

                <div className="nav-footer">
                    {user ? (
                        <>
                            <a href="#" className="nav-item">
                                <Settings size={20} />
                                <span>Pengaturan</span>
                            </a>
                            <button onClick={logout} className="nav-item logout btn-plain">
                                <LogOut size={20} />
                                <span>Keluar</span>
                            </button>
                        </>
                    ) : (
                        <button onClick={login} className="nav-item login-btn btn-primary-nav">
                            <LogIn size={20} />
                            <span>Masuk Sekarang</span>
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="main-wrapper">
                {/* Header */}
                <header className="top-header">
                    <button className="btn-icon mobile-only">
                        <Menu size={24} />
                    </button>

                    <div className="header-search">
                        <Search size={18} className="text-muted" />
                        <input type="text" placeholder="Cari transaksi, perjalanan..." />
                    </div>

                    <div className="header-actions">
                        <button className="btn-icon">
                            <Search size={22} className="mobile-only" />
                        </button>
                        <button className="btn-icon">
                            <Bell size={22} />
                            <span className="badge"></span>
                        </button>
                        {user ? (
                            <div className="user-profile">
                                <span className="user-name">{user.name || 'User'}</span>
                                <div className="avatar">{(user.name || 'U').charAt(0)}</div>
                            </div>
                        ) : (
                            <button onClick={login} className="btn-login-header">Masuk</button>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="content">
                    {children}
                </main>
            </div>
        </div>
    )
}
