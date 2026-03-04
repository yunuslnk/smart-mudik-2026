import React from 'react'
import { ArrowLeft, Building2, CreditCard, User } from 'lucide-react'
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
                <h1>Donasi</h1>
            </header>

            <div className="donation-wrapper">
                <div className="bank-card-premium">
                    <div className="card-accent-line"></div>

                    <div className="detail-row mb-8">
                        <div className="detail-icon">
                            <Building2 size={24} />
                        </div>
                        <div className="detail-text">
                            <span className="detail-label">Bank</span>
                            <p className="detail-value">CIMB NIAGA</p>
                        </div>
                    </div>

                    <div className="detail-row mb-8">
                        <div className="detail-icon">
                            <CreditCard size={24} />
                        </div>
                        <div className="detail-text">
                            <span className="detail-label">Nomor Rekening</span>
                            <code className="detail-value">706176048400</code>
                        </div>
                    </div>

                    <div className="detail-row">
                        <div className="detail-icon">
                            <User size={24} />
                        </div>
                        <div className="detail-text">
                            <span className="detail-label">Atas Nama</span>
                            <p className="detail-value">YUNUS SUSMANTO</p>
                        </div>
                    </div>
                </div>

                <p className="text-center text-white opacity-60 text-xs mt-8 font-bold italic">
                    "Kebaikan Anda memperlancar perjalanan sesama."
                </p>
            </div>
        </div>
    )
}
