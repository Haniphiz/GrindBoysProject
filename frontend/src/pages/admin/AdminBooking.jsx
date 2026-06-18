import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './AdminBooking.module.css';

// ===== HELPERS =====
const formatRupiah = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;
const formatDate = (s) => {
    if (!s) return '-';
    return new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};
const getInitials = (name) => (name || '').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || '??';
const AVATAR_COLORS = ['#8B5E3C','#2D6A4F','#9B2226','#1E40AF','#7C3AED','#B45309','#0E7490','#BE185D'];
const getAvatarColor = (name) => {
    let h = 0;
    for (let i = 0; i < (name || '').length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
};

const STATUS = {
    pending: { label: 'Menunggu', cls: 'pending' },
    confirmed: { label: 'Disetujui', cls: 'confirmed' },
    checked_in: { label: 'Check-in', cls: 'checked_in' },
    completed: { label: 'Selesai', cls: 'completed' },
    cancelled: { label: 'Ditolak', cls: 'cancelled' },
    expired: { label: 'Expired', cls: 'expired' },
};

const getSLA = (deadline) => {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return { text: 'Expired', level: 'urgent' };
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const text = h > 0 ? `${h}j ${m}m` : `${m}m ${s}s`;
    const level = h > 3 ? 'safe' : h > 1 ? 'warning' : 'urgent';
    return { text, level };
};

// ===== SVG ICONS =====
const Icons = {
    clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 16"/></svg>,
    check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    eye: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    logIn: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>,
    logOut: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    alertTriangle: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    inbox: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
    wallet: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    checkCircle: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    xCircle: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
    xClose: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

// ===== KOMPONENEN UTAMA =====
export default function AdminBooking() {
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({ pending: 0, confirmed: 0, cancelled: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectError, setRejectError] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const [tick, setTick] = useState(0);

    const getToken = () => localStorage.getItem('token');
    
    // ✅ PERBAIKAN UTAMA: Tambahkan http://localhost:3000 agar tidak nyangkut ke Vite
    const API = 'http://localhost:3000/api/bookings';

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const token = getToken();
            const [bookingsRes, statsRes] = await Promise.all([
                axios.get(`${API}/admin`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        status: activeFilter !== 'all' ? activeFilter : undefined,
                        search: search || undefined
                    }
                }),
                axios.get(`${API}/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setBookings(bookingsRes.data.data || []);
            const statsData = statsRes.data.data || statsRes.data || {};
            setStats({ pending: statsData.pending || 0, confirmed: statsData.confirmed || 0, cancelled: statsData.cancelled || 0, revenue: statsData.revenue || 0 });
        } catch (err) {
            showToast('error', 'Gagal Memuat', 'Tidak dapat mengambil data booking dari server.');
        } finally {
            setLoading(false);
        }
    }, [activeFilter, search]);

    useEffect(() => { fetchData(); }, [fetchData]);

    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const urgentCount = bookings.filter(b => {
        if (!b.sla_deadline || b.status !== 'pending') return false;
        const diff = new Date(b.sla_deadline) - new Date();
        return diff > 0 && diff <= 2 * 3600000;
    }).length;

    const filtered = activeFilter === 'completed'
        ? bookings.filter(b => b.status === 'checked_in' || b.status === 'completed')
        : bookings;

    // ===== ACTIONS =====
    const handleApprove = async () => {
        if (!selectedBooking || submitting) return;
        setSubmitting(true);
        try {
            await axios.put(`${API}/${selectedBooking.id}/approve`, {}, { headers: { Authorization: `Bearer ${getToken()}` } });
            showToast('success', 'Booking Disetujui', `${selectedBooking.id} atas nama ${selectedBooking.guest_name}. Dana dicairkan ke hotel.`);
            closeModal();
            fetchData();
        } catch (err) {
            showToast('error', 'Gagal Menyetujui', err.response?.data?.message || 'Terjadi kesalahan pada server.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!selectedBooking || submitting) return;
        if (!rejectReason.trim()) {
            setRejectError(true);
            return;
        }
        setSubmitting(true);
        try {
            await axios.put(`${API}/${selectedBooking.id}/reject`, { reason: rejectReason }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            showToast('success', 'Booking Ditolak', `${selectedBooking.id} — dana dikembalikan ke tamu.`);
            closeModal();
            fetchData();
        } catch (err) {
            showToast('error', 'Gagal Menolak', err.response?.data?.message || 'Terjadi kesalahan pada server.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCheckIn = async (id) => {
        try {
            await axios.put(`${API}/${id}/checkin`, {}, { headers: { Authorization: `Bearer ${getToken()}`} });
            showToast('success', 'Check-in Berhasil', 'Tamu telah check-in.');
            fetchData();
        } catch (err) {
            showToast('error', 'Gagal Check-in', err.response?.data?.message || 'Terjadi kesalahan.');
        }
    };

    const handleCheckOut = async (id) => {
        try {
            await axios.put(`${API}/${id}/checkout`, {}, { headers: { Authorization: `Bearer ${getToken()}`} });
            showToast('success', 'Check-out Berhasil', 'Tamu telah check-out. Kamar tersedia kembali.');
            fetchData();
        } catch (err) {
            showToast('error', 'Gagal Check-out', err.response?.data?.message || 'Terjadi kesalahan.');
        }
    };

    const openModal = (type, booking) => {
        setSelectedBooking(booking);
        setModalType(type);
        setRejectReason('');
        setRejectError(false);
    };

    const closeModal = () => {
        setSelectedBooking(null);
        setModalType(null);
        setRejectReason('');
        setRejectError(false);
    };

    const showToast = (type, title, message) => setToast({ type, title, message });

    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 4500);
            return () => clearTimeout(t);
        }
    }, [toast]);

    const renderStatus = (status) => {
        const s = STATUS[status] || { label: status, cls: '' };
        return (
            <span className={`${styles.statusBadge} ${styles[s.cls]}`}>
                <span className={styles.statusDot} />
                {s.label}
            </span>
        );
    };

    const renderActions = (b) => {
        const detailBtn = (
            <button className={`${styles.actionBtn} ${styles.detail}`} title="Detail" onClick={() => openModal('detail', b)}>
                {Icons.eye}
            </button>
        );

        switch (b.status) {
            case 'pending':
                return (
                    <div className={styles.actions}>
                        <button className={`${styles.actionBtn} ${styles.approve}`} title="Setujui" onClick={() => openModal('approve', b)}>{Icons.check}</button>
                        <button className={`${styles.actionBtn} ${styles.reject}`} title="Tolak" onClick={() => openModal('reject', b)}>{Icons.x}</button>
                        {detailBtn}
                    </div>
                );
            case 'confirmed':
                return (
                    <div className={styles.actions}>
                        <button className={`${styles.actionBtn} ${styles.checkin}`} title="Check-in" onClick={() => handleCheckIn(b.id)}>{Icons.logIn}</button>
                        {detailBtn}
                    </div>
                );
            case 'checked_in':
                return (
                    <div className={styles.actions}>
                        <button className={`${styles.actionBtn} ${styles.checkout}`} title="Check-out" onClick={() => handleCheckOut(b.id)}>{Icons.logOut}</button>
                        {detailBtn}
                    </div>
                );
            default:
                return <div className={styles.actions}>{detailBtn}</div>;
        }
    };

    const counts = {
        all: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled' || b.status === 'expired').length,
        completed: bookings.filter(b => b.status === 'checked_in' || b.status === 'completed').length,
    };

    const tabs = [
        { key: 'all', label: 'Semua' },
        { key: 'pending', label: 'Menunggu' },
        { key: 'confirmed', label: 'Disetujui' },
        { key: 'cancelled', label: 'Ditolak / Expired' },
        { key: 'completed', label: 'Selesai' },
    ];

    const renderDetailModal = () => {
        if (!selectedBooking || modalType !== 'detail') return null;
        const b = selectedBooking;

        const timeline = [
            ...(b.created_at ? [{ text: 'Booking dibuat', time: b.created_at, dot: '' }] : []),
            ...(b.paid_at ? [{ text: 'Pembayaran diterima', time: b.paid_at, dot: 'success' }] : []),
            ...(b.approved_at ? [{ text: 'Disetujui admin', time: b.approved_at, dot: 'success' }] : []),
            ...(b.rejected_at ? [{ text: 'Ditolak admin', time: b.rejected_at, dot: 'danger' }] : []),
            ...(b.check_in_at ? [{ text: 'Tamu check-in', time: b.check_in_at, dot: 'active' }] : []),
            ...(b.check_out_at ? [{ text: 'Tamu check-out', time: b.check_out_at, dot: 'success' }] : []),
            ...(b.expired_at ? [{ text: 'Expired — melewati batas SLA', time: b.expired_at, dot: 'danger' }] : []),
        ];

        return (
            <div className={`${styles.modalOverlay} ${styles.show}`} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <h2 className={styles.modalTitle}>{b.id}</h2>
                        <button className={styles.modalClose} onClick={closeModal}>{Icons.xClose}</button>
                    </div>
                    <div className={styles.modalBody}>
                        <div className={styles.detailSection}>
                            <div className={styles.detailSectionTitle}>Informasi Tamu</div>
                            <div className={styles.detailGrid}>
                                <div className={`${styles.detailItem} ${styles.full}`} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div className={styles.guestAvatar} style={{ background: getAvatarColor(b.guest_name), width: 42, height: 42, fontSize: 15 }}>{getInitials(b.guest_name)}</div>
                                    <div>
                                        <div className={styles.detailValue} style={{ fontSize: 15 }}>{b.guest_name}</div>
                                        <div className={styles.detailLabel}>{b.guest_email}</div>
                                    </div>
                                </div>
                                <div className={styles.detailItem}>
                                    <div className={styles.detailLabel}>No. Telepon</div>
                                    <div className={styles.detailValue}>{b.guest_phone || '-'}</div>
                                </div>
                                <div className={styles.detailItem}>
                                    <div className={styles.detailLabel}>Jumlah Tamu</div>
                                    <div className={styles.detailValue}>{b.guests || 1} orang</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.detailSection}>
                            <div className={styles.detailSectionTitle}>Detail Kamar</div>
                            <div className={styles.detailGrid}>
                                <div className={styles.detailItem}><div className={styles.detailLabel}>Tipe Kamar</div><div className={styles.detailValue}>{b.room_type}</div></div>
                                <div className={styles.detailItem}><div className={styles.detailLabel}>Nomor Kamar</div><div className={styles.detailValue}>{b.room_number || '-'}</div></div>
                                <div className={styles.detailItem}><div className={styles.detailLabel}>Check-in</div><div className={styles.detailValue}>{formatDate(b.check_in)}</div></div>
                                <div className={styles.detailItem}><div className={styles.detailLabel}>Check-out</div><div className={styles.detailValue}>{formatDate(b.check_out)}</div></div>
                                <div className={styles.detailItem}><div className={styles.detailLabel}>Durasi</div><div className={styles.detailValue}>{b.nights || 1} malam</div></div>
                                <div className={styles.detailItem}><div className={styles.detailLabel}>Special Request</div><div className={styles.detailValue}>{b.special_request || '-'}</div></div>
                            </div>
                        </div>

                        <div className={styles.detailSection}>
                            <div className={styles.detailSectionTitle}>Pembayaran</div>
                            <div className={styles.detailGrid}>
                                <div className={styles.detailItem}><div className={styles.detailLabel}>Total</div><div className={`${styles.detailValue} ${styles.price}`}>{formatRupiah(b.total_price)}</div></div>
                                <div className={styles.detailItem}><div className={styles.detailLabel}>Metode</div><div className={styles.detailValue}>{b.payment_method || '-'}</div></div>
                                <div className={styles.detailItem}><div className={styles.detailLabel}>Dibayar pada</div><div className={styles.detailValue}>{b.paid_at || '-'}</div></div>
                                <div className={styles.detailItem}><div className={styles.detailLabel}>Ref. Pembayaran</div><div className={styles.detailValue}>{b.payment_reference || '-'}</div></div>
                                <div className={styles.detailItem}><div className={styles.detailLabel}>Status</div><div className={styles.detailValue}>{renderStatus(b.status)}</div></div>
                            </div>
                        </div>

                        {b.reject_reason && (
                            <div className={styles.detailSection}>
                                <div className={styles.detailSectionTitle}>Alasan Penolakan</div>
                                <div className={styles.rejectReasonBox}>{b.reject_reason}</div>
                            </div>
                        )}

                        <div className={styles.detailSection} style={{ marginBottom: 0 }}>
                            <div className={styles.detailSectionTitle}>Timeline</div>
                            <div className={styles.timeline}>
                                {timeline.map((t, i) => (
                                    <div key={i} className={styles.timelineItem}>
                                        <div className={`${styles.timelineDot} ${styles[t.dot]}`}></div>
                                        <div className={styles.timelineText}>{t.text}</div>
                                        <div className={styles.timelineTime}>{t.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderApproveModal = () => {
        if (!selectedBooking || modalType !== 'approve') return null;
        return (
            <div className={`${styles.modalOverlay} ${styles.show}`} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <h2 className={styles.modalTitle}>Setujui Booking</h2>
                        <button className={styles.modalClose} onClick={closeModal}>{Icons.xClose}</button>
                    </div>
                    <div className={styles.modalBody}>
                        <div className={`${styles.confirmIcon} ${styles.approveIcon}`}>{Icons.checkCircle}</div>
                        <div className={styles.confirmText}>
                            Anda akan menyetujui booking <strong>{selectedBooking.id}</strong> atas nama <strong>{selectedBooking.guest_name}</strong>. Dana pembayaran akan dicairkan ke hotel.
                        </div>
                        <div className={styles.modalActions}>
                            <button className={`${styles.btn} ${styles.btnGhost}`} onClick={closeModal}>Batal</button>
                            <button className={`${styles.btn} ${styles.btnSuccess}`} onClick={handleApprove} disabled={submitting}>
                                {Icons.checkCircle} {submitting ? 'Memproses...' : 'Ya, Setujui'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderRejectModal = () => {
        if (!selectedBooking || modalType !== 'reject') return null;
        return (
            <div className={`${styles.modalOverlay} ${styles.show}`} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <h2 className={styles.modalTitle}>Tolak Booking</h2>
                        <button className={styles.modalClose} onClick={closeModal}>{Icons.xClose}</button>
                    </div>
                    <div className={styles.modalBody}>
                        <div className={`${styles.confirmIcon} ${styles.rejectIcon}`}>{Icons.xCircle}</div>
                        <div className={styles.confirmText}>
                            Anda akan menolak booking <strong>{selectedBooking.id}</strong> atas nama <strong>{selectedBooking.guest_name}</strong>. Dana akan dikembalikan ke tamu.
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel} htmlFor="rejectReason">Alasan penolakan *</label>
                            <textarea
                                id="rejectReason"
                                className={`${styles.formTextarea} ${rejectError ? styles.error : ''}`}
                                placeholder="Contoh: Kamar sudah dipesan tamu lain, sedang perbaikan, dll."
                                value={rejectReason}
                                onChange={(e) => { setRejectReason(e.target.value); setRejectError(false); }}
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <button className={`${styles.btn} ${styles.btnGhost}`} onClick={closeModal}>Batal</button>
                            <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleReject} disabled={submitting}>
                                {Icons.xCircle} {submitting ? 'Memproses...' : 'Ya, Tolak'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderToast = () => {
        if (!toast) return null;
        const iconMap = { success: Icons.checkCircle, error: Icons.alertTriangle, warning: Icons.alertTriangle };
        return (
            <div className={styles.toastContainer}>
                <div className={`${styles.toast} ${styles['toast.show']} ${styles[toast.type]}`}>
                    <div className={styles.toastIcon}>{iconMap[toast.type] || Icons.alertTriangle}</div>
                    <div className={styles.toastContent}>
                        <div className={styles.toastTitle}>{toast.title}</div>
                        <div className={styles.toastMessage}>{toast.message}</div>
                    </div>
                    <button className={styles.toastClose} onClick={() => setToast(null)}>{Icons.xClose}</button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.loadingSpinner} />
                <div className={styles.loadingText}>Memuat data booking...</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {renderToast()}

            <h1 className={styles.pageTitle}>Kelola <span className={styles.pageTitleAccent}>Booking</span></h1>
            <p className={styles.pageSubtitle}>Kelola seluruh pemesanan kamar — approve, reject, check-in, dan check-out tamu.</p>

            <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.gold}`}>
                    <div className={`${styles.statIcon} ${styles.gold}`}>{Icons.clock}</div>
                    <div className={styles.statValue}>{stats.pending}</div>
                    <div className={styles.statLabel}>Menunggu Persetujuan</div>
                </div>
                <div className={`${styles.statCard} ${styles.green}`}>
                    <div className={`${styles.statIcon} ${styles.green}`}>{Icons.checkCircle}</div>
                    <div className={styles.statValue}>{stats.confirmed}</div>
                    <div className={styles.statLabel}>Disetujui / Check-in</div>
                </div>
                <div className={`${styles.statCard} ${styles.red}`}>
                    <div className={`${styles.statIcon} ${styles.red}`}>{Icons.xCircle}</div>
                    <div className={styles.statValue}>{stats.cancelled}</div>
                    <div className={styles.statLabel}>Ditolak / Expired</div>
                </div>
                <div className={`${styles.statCard} ${styles.blue}`}>
                    <div className={`${styles.statIcon} ${styles.blue}`}>{Icons.wallet}</div>
                    <div className={`${styles.statValue} ${styles.small}`}>{formatRupiah(stats.revenue)}</div>
                    <div className={styles.statLabel}>Revenue Aktif</div>
                </div>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.toolbar}>
                    <div className={styles.filterTabs}>
                        {tabs.map(t => (
                            <button
                                key={t.key}
                                className={`${styles.filterTab} ${activeFilter === t.key ? styles.active : ''}`}
                                onClick={() => setActiveFilter(t.key)}
                            >
                                {t.label}
                                <span className={styles.tabCount}>{counts[t.key]}</span>
                            </button>
                        ))}
                    </div>
                    <div className={styles.toolbarRight}>
                        <div className={styles.searchBox}>
                            {Icons.search}
                            <input
                                className={styles.searchInput}
                                type="text"
                                placeholder="Cari nama tamu atau ID booking..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {urgentCount > 0 && (
                    <div className={styles.slaBanner}>
                        <span className={styles.slaBannerIcon}>{Icons.alertTriangle}</span>
                        <span>{urgentCount} booking mendekati batas waktu persetujuan — segera ambil tindakan</span>
                    </div>
                )}

                {filtered.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>{Icons.inbox}</div>
                        <div className={styles.emptyTitle}>Tidak Ada Booking</div>
                        <div className={styles.emptyText}>Tidak ditemukan booking dengan filter yang dipilih.</div>
                    </div>
                ) : (
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID Booking</th>
                                    <th>Tamu</th>
                                    <th>Kamar</th>
                                    <th>Check-in / Out</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>SLA</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((b, i) => {
                                    const sla = getSLA(b.sla_deadline);
                                    return (
                                        <tr key={b.id} style={{ animationDelay: `${i * 0.03}s` }}>
                                            <td><span className={styles.bookingId}>{b.id}</span></td>
                                            <td>
                                                <div className={styles.guestInfo}>
                                                    <div className={styles.guestAvatar} style={{ background: getAvatarColor(b.guest_name) }}>
                                                        {getInitials(b.guest_name)}
                                                    </div>
                                                    <div>
                                                        <div className={styles.guestName}>{b.guest_name}</div>
                                                        <div className={styles.guestEmail}>{b.guest_email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.roomType}>{b.room_type}</div>
                                                <div className={styles.roomNumber}>{b.room_number ? `Kamar ${b.room_number}` : '-'}</div>
                                            </td>
                                            <td>
                                                <div className={styles.dateCell}>
                                                    <span className={styles.dateLabel}>In </span>{formatDate(b.check_in)}<br />
                                                    <span className={styles.dateLabel}>Out </span>{formatDate(b.check_out)}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.price}>{formatRupiah(b.total_price)}</div>
                                                <div className={styles.priceSmall}>{b.nights || 1} malam</div>
                                            </td>
                                            <td>{renderStatus(b.status)}</td>
                                            <td>
                                                {sla
                                                    ? <span className={`${styles.slaTimer} ${styles[sla.level]}`}>{sla.text}</span>
                                                    : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>
                                                }
                                            </td>
                                            <td>{renderActions(b)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        Menampilkan 1-{filtered.length} dari {filtered.length} booking
                    </span>
                </div>
            </div>

            {renderDetailModal()}
            {renderApproveModal()}
            {renderRejectModal()}
        </div>
    );
}