import React, { useState } from 'react'
import axios from 'axios'
import { QRCodeSVG } from 'qrcode.react'
import { Wallet, CheckCircle, ArrowRight, Info } from 'lucide-react'
import './Donation.css'

export const Donation: React.FC = () => {
    const [amount, setAmount] = useState<number | ''>('')
    const [qrContent, setQrContent] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleDonate = async () => {
        if (!amount || amount < 1000) {
            alert('Minimal donasi adalah Rp 1.000')
            return
        }

        setLoading(true)
        try {
            const res = await axios.post('/api/donation', { amount })
            setQrContent(res.data.qrContent)
        } catch (err) {
            alert('Gagal membuat kode QR donasi. Pastikan Anda sudah login.')
        } finally {
            setLoading(false)
        }
    }

    const simulatePayment = () => {
        setLoading(true)
        setTimeout(() => {
            setSuccess(true)
            setLoading(false)
            setQrContent(null)
        }, 2000)
    }

    if (success) {
        return (
            <div className="donation-success card">
                <div className="success-icon">
                    <CheckCircle size={64} className="text-success" />
                </div>
                <h2>Terima Kasih atas Donasi Anda!</h2>
                <p>Kontribusi Anda sangat berarti bagi kelancaran arus mudik 2026.</p>
                <button onClick={() => window.location.href = '/'} className="btn-primary">Kembali ke Dashboard</button>
            </div>
        )
    }

    return (
        <div className="donation-container">
            <div className="card">
                <header className="donation-header">
                    <h1>Donasi Mudik Aman</h1>
                    <p>Dukung fasilitas istirahat dan posko kesehatan di sepanjang rute mudik.</p>
                </header>

                {!qrContent ? (
                    <div className="donation-form">
                        <div className="input-group">
                            <label><Wallet size={16} /> Jumlah Donasi (Rp)</label>
                            <input
                                type="number"
                                placeholder="Misal: 50000"
                                value={amount}
                                onChange={e => setAmount(Number(e.target.value))}
                            />
                            <div className="quick-amounts">
                                {[10000, 25000, 50000, 100000].map(val => (
                                    <button key={val} onClick={() => setAmount(val)} className="btn-chip">
                                        Rp {val.toLocaleString('id-ID')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button onClick={handleDonate} className="btn-primary full-width" disabled={loading}>
                            {loading ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}
                            <ArrowRight size={18} />
                        </button>

                        <div className="donation-info">
                            <Info size={16} />
                            <p>Donasi akan disalurkan melalui Badan Pengelola Jalur Mudik Nasional.</p>
                        </div>
                    </div>
                ) : (
                    <div className="qr-section">
                        <h3>Pindai QRIS untuk Membayar</h3>
                        <div className="qr-box">
                            <QRCodeSVG value={qrContent} size={250} />
                        </div>
                        <p className="qr-id">ID Transaksi: {qrContent}</p>
                        <div className="qr-actions">
                            <button onClick={simulatePayment} className="btn-success full-width" disabled={loading}>
                                {loading ? 'Memverifikasi...' : 'Saya Sudah Bayar (Simulasi)'}
                            </button>
                            <button onClick={() => setQrContent(null)} className="btn-text">Batal</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
