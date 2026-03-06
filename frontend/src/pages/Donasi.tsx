import React from 'react'
import { ArrowLeft, Heart, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './Donasi.css'

export const Donasi: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div className="donasi-container animate-fade-in">
            <header className="donasi-header">
                <button className="btn-back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} /> Kembali
                </button>
                <h1>Dukung Kami</h1>
            </header>

            <div className="donation-wrapper">
                <div className="trakteer-card">
                    <div className="trakteer-icon">
                        <Heart size={48} className="heart-icon" />
                    </div>

                    <div className="trakteer-content">
                        <h2>Satu Kopi, Sejuta Kebaikan</h2>
                        <p>Dukungan Anda sangat berarti bagi pengembangan aplikasi <strong>Smart Mudik 2026</strong> agar tetap gratis dan nyaman digunakan untuk semua.</p>

                        <a
                            href="https://trakteer.id/devops1085"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="trakteer-link"
                        >
                            <span>Dukung di Trakteer</span>
                            <ExternalLink size={20} />
                        </a>
                    </div>
                </div>

                <div className="social-proof">
                    <p>"Kebaikan Anda memperlancar perjalanan sesama."</p>
                </div>
            </div>
        </div>
    )
}
