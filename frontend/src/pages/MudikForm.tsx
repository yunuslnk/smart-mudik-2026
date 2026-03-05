import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { MapPin, Calendar, Clock, Car, Send } from 'lucide-react'
import './MudikForm.css'

interface Region {
    id: string
    name: string
}

export const MudikForm: React.FC = () => {
    const [provinces, setProvinces] = useState<Region[]>([])
    const [regenciesAsal, setRegenciesAsal] = useState<Region[]>([])
    const [regenciesTujuan, setRegenciesTujuan] = useState<Region[]>([])

    const [formData, setFormData] = useState({
        tanggal: '',
        jam: '',
        provinsiAsalId: '',
        kotaAsalId: '',
        provinsiTujuanId: '',
        kotaTujuanId: '',
        kendaraan: 'Mobil',
        jenis: 'MUDIK', // MUDIK or BALIK
    })

    const [existingEntries, setExistingEntries] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [initLoading, setInitLoading] = useState(true)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        const init = async () => {
            setInitLoading(true)
            await Promise.all([fetchProvinces(), fetchExisting()])
            setInitLoading(false)
        }
        init()
    }, [])

    const fetchExisting = async () => {
        try {
            const res = await axios.get('/api/mudik/me')
            const entries = res.data || []
            setExistingEntries(entries)

            // Set default jenis to something not yet submitted
            const hasMudik = entries.some((e: any) => e.status === 'BERANGKAT' || e.status === 'SAMPAI')
            const hasBalik = entries.some((e: any) => e.status === 'BALIK')

            if (!hasMudik) setFormData(prev => ({ ...prev, jenis: 'MUDIK' }))
            else if (!hasBalik) setFormData(prev => ({ ...prev, jenis: 'BALIK' }))
            else setFormData(prev => ({ ...prev, jenis: '' })) // Both done
        } catch (err) {
            console.error('Failed to fetch existing entries', err)
        }
    }

    const fetchProvinces = async () => {
        try {
            const res = await axios.get('/api/regions/provinces')
            setProvinces(res.data)
        } catch (err) {
            console.error('Failed to fetch provinces', err)
        }
    }

    const handleProvinceAsalChange = async (provId: string) => {
        setFormData({ ...formData, provinsiAsalId: provId, kotaAsalId: '' })
        if (!provId) {
            setRegenciesAsal([])
            return
        }
        try {
            const res = await axios.get(`/api/regions/regencies/${provId}`)
            setRegenciesAsal(res.data)
        } catch (err) {
            console.error('Failed to fetch regencies asal', err)
        }
    }

    const handleProvinceTujuanChange = async (provId: string) => {
        setFormData({ ...formData, provinsiTujuanId: provId, kotaTujuanId: '' })
        if (!provId) {
            setRegenciesTujuan([])
            return
        }
        try {
            const res = await axios.get(`/api/regions/regencies/${provId}`)
            setRegenciesTujuan(res.data)
        } catch (err) {
            console.error('Failed to fetch regencies tujuan', err)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await axios.post('/api/mudik', {
                ...formData,
                tanggal: new Date(formData.tanggal).toISOString(),
                status: formData.jenis === 'MUDIK' ? 'BERANGKAT' : 'BALIK',
            })
            setSuccess(true)
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Gagal mendaftarkan mudik. Pastikan semua wilayah diisi dan Anda belum mendaftar sebelumnya.';
            alert(errorMsg);
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="form-success card">
                <Send size={48} className="text-success" />
                <h2>Pendaftaran Berhasil!</h2>
                <p>Data mudik Anda telah tercatat dalam sistem kami.</p>
                <button onClick={() => window.location.href = '/'} className="btn-primary">Kembali ke Dashboard</button>
            </div>
        )
    }

    return (
        <div className="form-container animate-fade-in">
            <header className="form-header">
                <h1>Daftar Mudik 2026</h1>
                <p>Silakan isi detail perjalanan Anda dengan benar.</p>
            </header>

            <div className="premium-form-card">
                <form onSubmit={handleSubmit} className="mudik-form">
                    <div className="form-grid">
                        {/* Jenis Perjalanan */}
                        <div className="input-group full">
                            <label><Send size={16} /> Jenis Perjalanan</label>
                            <select
                                required
                                value={formData.jenis}
                                onChange={e => setFormData({ ...formData, jenis: e.target.value })}
                            >
                                {!existingEntries.some((e: any) => e.status === 'BERANGKAT' || e.status === 'SAMPAI') && (
                                    <option value="MUDIK">Mudik (Pulang Kampung)</option>
                                )}
                                {!existingEntries.some((e: any) => e.status === 'BALIK') && (
                                    <option value="BALIK">Arus Balik (Kembali ke Kota Asal)</option>
                                )}
                                {existingEntries.length >= 2 && (
                                    <option value="" disabled>Sudah Mendaftar Mudik & Arus Balik</option>
                                )}
                                {existingEntries.length === 0 && !initLoading && <option value="" disabled>Pilih Jenis...</option>}
                                {initLoading && <option value="">Loading data...</option>}
                            </select>
                        </div>

                        {/* Wilayah Asal */}
                        <div className="input-group">
                            <label><MapPin size={16} /> Provinsi Asal</label>
                            <select
                                required
                                value={formData.provinsiAsalId}
                                onChange={e => handleProvinceAsalChange(e.target.value)}
                            >
                                <option value="">Pilih Provinsi...</option>
                                {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div className="input-group">
                            <label><MapPin size={16} /> Kota/Kab Asal</label>
                            <select
                                required
                                disabled={!formData.provinsiAsalId}
                                value={formData.kotaAsalId}
                                onChange={e => setFormData({ ...formData, kotaAsalId: e.target.value })}
                            >
                                <option value="">Pilih Kota...</option>
                                {regenciesAsal.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>

                        {/* Wilayah Tujuan */}
                        <div className="input-group">
                            <label><MapPin size={16} /> Provinsi Tujuan</label>
                            <select
                                required
                                value={formData.provinsiTujuanId}
                                onChange={e => handleProvinceTujuanChange(e.target.value)}
                            >
                                <option value="">Pilih Provinsi...</option>
                                {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div className="input-group">
                            <label><MapPin size={16} /> Kota/Kab Tujuan</label>
                            <select
                                required
                                disabled={!formData.provinsiTujuanId}
                                value={formData.kotaTujuanId}
                                onChange={e => setFormData({ ...formData, kotaTujuanId: e.target.value })}
                            >
                                <option value="">Pilih Kota...</option>
                                {regenciesTujuan.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>

                        <div className="input-group">
                            <label><Calendar size={16} /> Tanggal Keberangkatan</label>
                            <input
                                type="date"
                                required
                                value={formData.tanggal}
                                onChange={e => setFormData({ ...formData, tanggal: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label><Clock size={16} /> Jam Keberangkatan</label>
                            <input
                                type="time"
                                required
                                value={formData.jam}
                                onChange={e => setFormData({ ...formData, jam: e.target.value })}
                            />
                        </div>
                        <div className="input-group full">
                            <label><Car size={16} /> Jenis Kendaraan</label>
                            <select
                                value={formData.kendaraan}
                                onChange={e => setFormData({ ...formData, kendaraan: e.target.value })}
                            >
                                <option value="Mobil">Mobil Pribadi</option>
                                <option value="Motor">Sepeda Motor</option>
                                <option value="Bus">Bus</option>
                                <option value="Kereta">Kereta Api</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading || initLoading || !formData.jenis}>
                        {initLoading ? 'Menyiapkan Data...' : loading ? 'Mengirim...' : 'Daftarkan Perjalanan'}
                    </button>
                </form>
            </div>
        </div>
    )
}
