import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

const FALLBACK_FLOORS = 3;

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const hotelFromState = location.state?.hotel;

  // ═══════════════════════════════════════
  // SEMUA HOOKS — TIDAK BOLEH ADA IF SEBELUM INI
  // ═══════════════════════════════════════

  const [hotel, setHotel] = useState(hotelFromState);
  const [loadingHotel, setLoadingHotel] = useState(!!hotelFromState?.id);
  const [hotelError, setHotelError] = useState(false);

  const [activeStep, setActiveStep] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null); // ✅ FIX: selalu mulai null
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
    checkIn: "", checkOut: "", specialRequest: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // ── Fetch ulang data hotel dari API ──
  useEffect(() => {
    const hotelId = hotelFromState?.id || hotelFromState?._id;
    if (!hotelId) {
      setHotelError(true);
      setLoadingHotel(false);
      return;
    }

    fetch(`http://localhost:3000/api/hotels/${hotelId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal ambil data hotel");
        return res.json();
      })
      .then((data) => {
        if (data.data?.hotel) {
          setHotel(data.data.hotel);
        } else if (Array.isArray(data.data)) {
          const found = data.data.find((h) => h.id === hotelId);
          if (found) setHotel(found);
        }
        setLoadingHotel(false);
      })
      .catch(() => {
        setHotel(hotelFromState);
        setLoadingHotel(false);
      });
  }, []); // eslint-disable-line

  // ── Hitung nilai setelah hotel ada ──
  const totalFloors = parseInt(hotel?.floors) || FALLBACK_FLOORS;
  const isSingleFloor = totalFloors === 1;

  // ✅ FIX: Auto-pilih lantai 1 jika hotel hanya 1 lantai
  useEffect(() => {
    if (isSingleFloor && selectedFloor === null) {
      setSelectedFloor(1);
    }
  }, [isSingleFloor, selectedFloor]);

  // ── Fetch Rooms ──
  useEffect(() => {
    if (!hotel?.id && !hotel?._id) return;

    const token = localStorage.getItem("token");
    const hotelId = hotel.id || hotel._id || hotel.hotel_id;

    fetch(`http://localhost:3000/api/rooms?hotel_id=${hotelId}`, {
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
        "Content-Type": "application/json"
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const arr = Array.isArray(data) ? data : (data.data || data.rooms || []);
        setRooms(arr);
        setLoadingRooms(false);
      })
      .catch((err) => {
        console.error(err);
        setRooms([]);
        setLoadingRooms(false);
      });
  }, [hotel]); // eslint-disable-line

  // ── ✅ FIX: Distribusikan kamar ke lantai berdasarkan room.number ──
  const floorsData = useMemo(() => {
    const floors = {};
    for (let i = 1; i <= totalFloors; i++) {
      floors[i] = { rooms: [], status: "full" };
    }
    if (rooms.length === 0) return floors;

    rooms.forEach((room) => {
      let floorNum;

      if (isSingleFloor) {
        // 1 lantai: semua masuk lantai 1
        floorNum = 1;
      } else {
        // Multi lantai: baca 2 digit pertama dari room.number
        // "0101" → 01 → 1, "0302" → 03 → 3, "0801" → 08 → 8
        const numStr = String(room.number || "").trim();
        if (numStr.length >= 2) {
          floorNum = parseInt(numStr.substring(0, 2), 10);
        }

        // Fallback kalau gagal parse
        if (!floorNum || floorNum < 1 || floorNum > totalFloors) {
          floorNum = 1;
        }
      }

      if (floors[floorNum]) {
        floors[floorNum].rooms.push({
          ...room,
          roomNumber: room.number || `${String(floorNum).padStart(2, "0")}${String(floors[floorNum].rooms.length + 1).padStart(2, "0")}`,
        });
        floors[floorNum].status = "available";
      }
    });
    return floors;
  }, [rooms, totalFloors, isSingleFloor]);

  const floorRooms = selectedFloor ? floorsData[selectedFloor]?.rooms : [];
  const availableFloors = Object.values(floorsData).filter((f) => f.status === "available").length;

  // ── Helper functions ──
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    return Math.ceil(Math.abs(new Date(formData.checkOut) - new Date(formData.checkIn)) / 86400000) || 0;
  };

  const nights = getNights();
  const roomPrice = selectedRoom?.price || 0;
  const totalPrice = roomPrice * nights;
  const tax = Math.round(totalPrice * 0.11);
  const grandTotal = totalPrice + tax;
  const formatPrice = (p) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p || 0);
  const today = new Date().toISOString().split("T")[0];
  const getRoomType = (r) => r.room_type || r.type || "Kamar Hotel";

  const v1 = () => { if (!selectedRoom) { alert("Silakan pilih kamar."); return false; } return true; };
  const v2 = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.checkIn || !formData.checkOut) { alert("Mohon lengkapi semua data wajib."); return false; }
    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) { alert("Check-out harus setelah check-in."); return false; }
    return true;
  };
  const v3 = () => { if (!paymentMethod) { alert("Silakan pilih metode pembayaran."); return false; } return true; };

  const nextStep = () => {
    if (activeStep === 1 && v1()) setActiveStep(2);
    if (activeStep === 2 && v2()) setActiveStep(3);
    if (activeStep === 3 && v3()) setActiveStep(4);
  };
  const prevStep = () => { if (activeStep > 1) setActiveStep(activeStep - 1); };

  const handlePayNow = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const hotelId = hotel.id || hotel._id || hotel.hotel_id;
      const bRes = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ room_id: selectedRoom.id, hotel_id: hotelId, total_price: grandTotal, check_in: formData.checkIn, check_out: formData.checkOut, guests: 1, special_request: formData.specialRequest }),
      });
      const bData = await bRes.json();
      if (!bRes.ok) throw new Error(bData.message || "Gagal membuat booking");

      const pRes = await fetch("http://localhost:3000/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ booking_id: bData.data?.booking_id || bData.data?.id, payment_method: paymentMethod }),
      });
      const pData = await pRes.json();
      if (!pRes.ok) throw new Error(pData.message || "Gagal memproses pembayaran");

      navigate("/payment-success", { state: { payment: pData.data, hotel, room: selectedRoom, formData, grandTotal } });
    } catch (error) { alert(`Error: ${error.message}`); setIsProcessing(false); }
  };

  const steps = [
    { label: "Pilih Kamar", icon: "🛏️" },
    { label: "Data Tamu", icon: "👤" },
    { label: "Pembayaran", icon: "💳" },
    { label: "Konfirmasi", icon: "✅" },
  ];

  // ═══════════════════════════════════════
  // KONDISIONAL RETURN — SETELAH SEMUA HOOKS
  // ═══════════════════════════════════════

  if (loadingHotel) {
    return (
      <div className="pay-page">
        <div className="pay-loading" style={{ minHeight: "80vh" }}>
          <div className="pay-spinner" style={{ width: 48, height: 48 }} />
          <p>Memuat data hotel...</p>
        </div>
      </div>
    );
  }

  if (hotelError || !hotel) {
    return (
      <div className="pay-page">
        <div className="pay-empty">
          <div className="pay-empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 className="pay-empty-title">Akses Ditolak</h2>
          <p className="pay-empty-text">Silakan pilih hotel terlebih dahulu dari halaman daftar hotel.</p>
          <button className="pay-empty-btn" onClick={() => navigate("/hotel")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            Kembali ke Daftar Hotel
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // RENDER UTAMA
  // ═══════════════════════════════════════
  return (
    <div className="pay-page">

      {/* ═══ STEPPER ═══ */}
      <div className="pay-stepper">
        <div className="pay-stepper-inner">
          {steps.map((s, i) => {
            const num = i + 1;
            const isActive = activeStep === num;
            const isDone = activeStep > num;
            return (
              <div key={s.label} className={`pay-step ${isActive ? "pay-step--active" : ""} ${isDone ? "pay-step--done" : ""}`}>
                <div className="pay-step-circle">
                  {isDone ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : (
                    <span className="pay-step-emoji">{s.icon}</span>
                  )}
                </div>
                <span className="pay-step-label">{s.label}</span>
                {i < steps.length - 1 && <div className="pay-step-line" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ MAIN ═══ */}
      <div className="pay-main">
        <div className="pay-layout">
          <div className="pay-form">

            {/* ── STEP 1 ── */}
            <div className={`pay-panel ${activeStep === 1 ? "pay-panel--show" : ""}`}>
              <div className="pay-panel-head">
                <div>
                  <span className="pay-eyebrow">Langkah 1 dari 4</span>
                  <h2 className="pay-panel-title">Pilih Kamar</h2>
                </div>
                <div className="pay-panel-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16" /><path d="M2 8h18a2 2 0 012 2v10" /><path d="M2 17h20" /></svg>
                  {hotel.name} · {hotel.city || hotel.location}
                  {!isSingleFloor && <span style={{ marginLeft: 8, opacity: 0.7 }}>· {totalFloors} lantai</span>}
                </div>
              </div>

              {loadingRooms ? (
                <div className="pay-loading">
                  <div className="pay-spinner" />
                  <p>Mengambil data kamar dari server...</p>
                </div>
              ) : rooms.length === 0 ? (
                <div className="pay-msg pay-msg--error">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  <p>Tidak ada kamar tersedia untuk hotel ini.</p>
                </div>
              ) : (
                <div className="pay-floor-layout">

                  {!isSingleFloor && (
                    <div className="pay-floor-panel">
                      <div className="pay-floor-head">
                        <span className="pay-floor-label">Lantai</span>
                        <span className="pay-floor-count">{availableFloors}/{totalFloors} aktif</span>
                      </div>
                      <div className="pay-floor-grid">
                        {Array.from({ length: totalFloors }, (_, i) => {
                          const num = totalFloors - i;
                          const floor = floorsData[num];
                          const isAvail = floor?.status === "available";
                          const isSel = selectedFloor === num;
                          return (
                            <button key={num} className={`pay-floor-btn ${isSel ? "pay-floor-btn--active" : ""} ${!isAvail ? "pay-floor-btn--off" : ""}`}
                              onClick={() => { if (isAvail) { setSelectedFloor(num); setSelectedRoom(null); } }} disabled={!isAvail}>
                              {num}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="pay-rooms">
                    {!selectedFloor ? (
                      <div className="pay-msg">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
                        <p>Pilih lantai untuk melihat kamar</p>
                      </div>
                    ) : floorRooms.length === 0 ? (
                      <div className="pay-msg"><p>Lantai ini sedang kosong</p></div>
                    ) : (
                      <>
                        <div className="pay-rooms-head">
                          <h3>{isSingleFloor ? `🏠 Semua Kamar` : `Lantai ${selectedFloor}`}</h3>
                          <span className="pay-rooms-badge">{floorRooms.length} kamar</span>
                        </div>
                        <div className="pay-rooms-list">
                          {floorRooms.map((room, index) => {
                            const isSel = selectedRoom?.id === room.id;
                            return (
                              <div key={room.id} className={`pay-room ${isSel ? "pay-room--active" : ""}`} onClick={() => setSelectedRoom(room)}>
                                <div className="pay-room-left">
                                  <div className="pay-room-num">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16" /><path d="M2 8h18a2 2 0 012 2v10" /><path d="M2 17h20" /><path d="M6 8v9" /><path d="M10 8v9" /><path d="M14 8v9" /><path d="M18 8v9" /></svg>
                                    {isSingleFloor ? `Kamar ${index + 1}` : `No. ${room.roomNumber}`}
                                  </div>
                                  <span className="pay-room-type">{getRoomType(room)}</span>
                                </div>
                                <div className="pay-room-right">
                                  <span className="pay-room-price">{formatPrice(room.price)}<small>/malam</small></span>
                                  {isSel && <span className="pay-room-check">✓ Dipilih</span>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              <button className="pay-btn pay-btn--primary pay-btn--full" onClick={nextStep} disabled={rooms.length === 0}>
                Lanjut ke Data Tamu
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>
            </div>

            {/* ── STEP 2 ── */}
            <div className={`pay-panel ${activeStep === 2 ? "pay-panel--show" : ""}`}>
              <div className="pay-panel-head">
                <div>
                  <span className="pay-eyebrow">Langkah 2 dari 4</span>
                  <h2 className="pay-panel-title">Data Tamu</h2>
                </div>
              </div>
              <div className="pay-fields">
                <div className="pay-field pay-field--full"><label>Nama Lengkap <span className="pay-req">*</span></label><input type="text" name="name" placeholder="Sesuai KTP" value={formData.name} onChange={handleChange} /></div>
                <div className="pay-field"><label>Email <span className="pay-req">*</span></label><input type="email" name="email" placeholder="contoh@email.com" value={formData.email} onChange={handleChange} /></div>
                <div className="pay-field"><label>No. Handphone <span className="pay-req">*</span></label><input type="tel" name="phone" placeholder="08xxxxxxxxxx" value={formData.phone} onChange={handleChange} /></div>
                <div className="pay-field"><label>Check-in <span className="pay-req">*</span></label><input type="date" name="checkIn" min={today} value={formData.checkIn} onChange={handleChange} /></div>
                <div className="pay-field"><label>Check-out <span className="pay-req">*</span></label><input type="date" name="checkOut" min={formData.checkIn || today} value={formData.checkOut} onChange={handleChange} /></div>
                <div className="pay-field pay-field--full"><label>Permintaan Khusus</label><textarea name="specialRequest" rows="3" placeholder="Kamar lantai atas, extra bed, dll" value={formData.specialRequest} onChange={handleChange} /></div>
              </div>
              <div className="pay-btns">
                <button className="pay-btn pay-btn--ghost" onClick={prevStep}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg> Kembali</button>
                <button className="pay-btn pay-btn--primary" onClick={nextStep}>Lanjutkan <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></button>
              </div>
            </div>

            {/* ── STEP 3 ── */}
            <div className={`pay-panel ${activeStep === 3 ? "pay-panel--show" : ""}`}>
              <div className="pay-panel-head">
                <div>
                  <span className="pay-eyebrow">Langkah 3 dari 4</span>
                  <h2 className="pay-panel-title">Metode Pembayaran</h2>
                </div>
              </div>
              <div className="pay-methods">
                {[
                  { id: "bank_transfer", icon: "🏦", name: "Transfer Bank", desc: "BCA, BNI, Mandiri, BRI" },
                  { id: "credit_card", icon: "💳", name: "Kartu Kredit / Debit", desc: "Visa, Mastercard" },
                  { id: "ewallet", icon: "📱", name: "E-Wallet", desc: "GoPay, OVO, DANA, ShopeePay" },
                  { id: "qris", icon: "📲", name: "QRIS", desc: "Scan QR dari aplikasi apapun" },
                  { id: "virtual_account", icon: "🖥️", name: "Virtual Account", desc: "ATM atau Mobile Banking" },
                ].map((m) => (
                  <div key={m.id} className={`pay-method ${paymentMethod === m.id ? "pay-method--active" : ""}`} onClick={() => setPaymentMethod(m.id)}>
                    <div className="pay-method-radio">{paymentMethod === m.id && <div className="pay-method-dot" />}</div>
                    <span className="pay-method-icon">{m.icon}</span>
                    <div className="pay-method-info"><strong>{m.name}</strong><span>{m.desc}</span></div>
                  </div>
                ))}
              </div>
              <div className="pay-btns">
                <button className="pay-btn pay-btn--ghost" onClick={prevStep}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg> Kembali</button>
                <button className="pay-btn pay-btn--primary" onClick={nextStep}>Review Pesanan <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></button>
              </div>
            </div>

            {/* ── STEP 4 ── */}
            <div className={`pay-panel ${activeStep === 4 ? "pay-panel--show" : ""}`}>
              <div className="pay-panel-head">
                <div>
                  <span className="pay-eyebrow">Langkah 4 dari 4</span>
                  <h2 className="pay-panel-title">Review & Konfirmasi</h2>
                </div>
              </div>
              <div className="pay-review">
                <h3 className="pay-review-title">🏨 Hotel & Kamar</h3>
                <div className="pay-review-grid">
                  <span>Hotel</span><strong>{hotel.name}</strong>
                  <span>Lokasi</span><strong>{isSingleFloor ? "Ground Floor" : `Lantai ${selectedFloor}`}</strong>
                  <span>Tipe Kamar</span><strong>{selectedRoom ? getRoomType(selectedRoom) : "-"}</strong>
                  <span>Nomor</span><strong>{isSingleFloor ? `Kamar ${floorRooms.indexOf(selectedRoom) + 1}` : selectedRoom?.roomNumber}</strong>
                </div>
              </div>
              <div className="pay-review">
                <h3 className="pay-review-title">👤 Data Tamu</h3>
                <div className="pay-review-grid">
                  <span>Nama</span><strong>{formData.name}</strong>
                  <span>Email</span><strong>{formData.email}</strong>
                  <span>No. HP</span><strong>{formData.phone}</strong>
                  <span>Check-in</span><strong>{formData.checkIn}</strong>
                  <span>Check-out</span><strong>{formData.checkOut}</strong>
                  <span>Durasi</span><strong>{nights} Malam</strong>
                </div>
              </div>
              <div className="pay-review">
                <h3 className="pay-review-title">💳 Metode Pembayaran</h3>
                <p className="pay-review-method">{paymentMethod.replace(/_/g, " ")}</p>
              </div>
              <div className="pay-btns">
                <button className="pay-btn pay-btn--ghost" onClick={prevStep}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg> Kembali</button>
                <button className="pay-btn pay-btn--pay" onClick={handlePayNow} disabled={isProcessing}>
                  {isProcessing ? (<><div className="pay-btn-spinner" /> Memproses...</>) : (<>🔒 Bayar {formatPrice(grandTotal)}</>)}
                </button>
              </div>
            </div>
          </div>

          {/* ═══ SIDEBAR ═══ */}
          <div className="pay-sidebar">
            <div className="pay-summary">
              <div className="pay-summary-img">
                <img src={hotel.image_url || hotel.image || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiB2aWV3Qm94PSIwIDAgNDAwIDI1MCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNTAiIGZpbGw9IiNlMmU4ZjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk0YTNiOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=="} alt={hotel.name} />
                {hotel.rating && <span className="pay-summary-rating">★ {hotel.rating}</span>}
              </div>
              <div className="pay-summary-body">
                <h3>{hotel.name}</h3>
                <p className="pay-summary-loc">📍 {hotel.city || hotel.location || "-"}</p>
                {hotel.reviews > 0 && <span className="pay-summary-reviews">{hotel.reviews} ulasan</span>}
              </div>
              {selectedRoom && (
                <>
                  <div className="pay-summary-divider" />
                  <div className="pay-summary-room">
                    <div className="pay-summary-room-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M2 4v16" /><path d="M2 8h18a2 2 0 012 2v10" /><path d="M2 17h20" /></svg>
                    </div>
                    <div>
                      <p>{isSingleFloor ? `Ground Floor · Kamar ${floorRooms.indexOf(selectedRoom) + 1}` : `Lantai ${selectedFloor} · No. ${selectedRoom.roomNumber}`}</p>
                      <strong>{getRoomType(selectedRoom)}</strong>
                    </div>
                  </div>
                </>
              )}
              <div className="pay-summary-divider" />
              <div className="pay-summary-details">
                <div className="pay-summary-row">
                  <span>{selectedRoom ? formatPrice(roomPrice) : "Rp 0"} × {nights > 0 ? nights : "?"} malam</span>
                  <span>{nights > 0 ? formatPrice(totalPrice) : "-"}</span>
                </div>
                <div className="pay-summary-row">
                  <span>Pajak & Layanan (11%)</span>
                  <span>{nights > 0 ? formatPrice(tax) : "-"}</span>
                </div>
              </div>
              <div className="pay-summary-divider" />
              <div className="pay-summary-total">
                <span>Total</span>
                <strong>{nights > 0 ? formatPrice(grandTotal) : "Rp 0"}</strong>
              </div>
            </div>
            <button className="pay-back-btn" onClick={() => navigate("/hotel")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
              Kembali ke Daftar Hotel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}