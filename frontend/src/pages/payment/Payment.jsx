import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const hotel = location.state?.hotel;

  // ── Guard ──
  if (!hotel) {
    return (
      <main className="payment">
        <section className="payment__empty">
          <div className="payment__empty-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 className="payment__empty-title">Akses Ditolak</h2>
          <p className="payment__empty-text">Silakan pilih hotel terlebih dahulu dari halaman daftar hotel.</p>
          <button className="payment__empty-btn" onClick={() => navigate("/hotel")}>
            ← Kembali ke Daftar Hotel
          </button>
        </section>
      </main>
    );
  }

  // ── State ──
  const [activeStep, setActiveStep] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", checkIn: "", checkOut: "", specialRequest: "" });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // ── Fetch Rooms ──
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/rooms?hotel_id=${hotel.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => { if (!res.ok) throw new Error("Gagal mengambil data kamar"); return res.json(); })
      .then((data) => { setRooms(data.data || data); setLoadingRooms(false); })
      .catch((err) => { alert(err.message); setLoadingRooms(false); });
  }, [hotel.id]);

  // ── Distribusikan ke 21 lantai ──
  const floorsData = useMemo(() => {
    const floors = {};
    for (let i = 1; i <= 21; i++) floors[i] = { rooms: [], status: "full" };
    rooms.forEach((room, index) => {
      const floorNum = ((index * 3 + 2) % 21) + 1;
      floors[floorNum].rooms.push({ ...room, roomNumber: `${floorNum}${String(floors[floorNum].rooms.length + 1).padStart(2, "0")}` });
      floors[floorNum].status = "available";
    });
    return floors;
  }, [rooms]);

  const floorRooms = selectedFloor ? floorsData[selectedFloor]?.rooms : [];
  const totalFloors = 21;
  const availableFloors = Object.values(floorsData).filter((f) => f.status === "available").length;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    return Math.ceil(Math.abs(new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24)) || 0;
  };

  const nights = getNights();
  const roomPrice = selectedRoom?.price || 0;
  const totalPrice = roomPrice * nights;
  const tax = Math.round(totalPrice * 0.11);
  const grandTotal = totalPrice + tax;

  const formatPrice = (p) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p || 0);
  const today = new Date().toISOString().split("T")[0];

  // ── Validasi ──
  const v1 = () => { if (!selectedRoom) { alert("Silakan pilih kamar."); return false; } return true; };
  const v2 = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.checkIn || !formData.checkOut) { alert("Mohon lengkapi semua data wajib."); return false; }
    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) { alert("Check-out harus setelah check-in."); return false; }
    return true;
  };
  const v3 = () => { if (!paymentMethod) { alert("Silakan pilih metode pembayaran."); return false; } return true; };

  const nextStep = () => { if (activeStep === 1 && v1()) setActiveStep(2); if (activeStep === 2 && v2()) setActiveStep(3); if (activeStep === 3 && v3()) setActiveStep(4); };
  const prevStep = () => { if (activeStep > 1) setActiveStep(activeStep - 1); };

  // ── Bayar ──
  // ── Bayar ──
  const handlePayNow = async () => {
    setIsProcessing(true);
    try {
      // 1. KIRIM DATA BOOKING YANG LENGKAP
      const bRes = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          room_id: selectedRoom.id,
          total_price: grandTotal, // <- TAMBAHKAN INI (Harga + Pajak)
          check_in: formData.checkIn, // <- TAMBAHKAN INI
          check_out: formData.checkOut, // <- TAMBAHKAN INI
          guests: 1, // <- TAMBAHKAN INI (Bisa diubah jika ada input jumlah tamu)
          special_request: formData.specialRequest // <- TAMBAHKAN INI
        })
      });
      const bData = await bRes.json();
      if (!bRes.ok) throw new Error(bData.message || "Gagal membuat booking");

      // 2. KIRIM DATA PAYMENT
      const pRes = await fetch("http://localhost:3000/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          booking_id: bData.data?.booking_id,
          payment_method: paymentMethod
        })
      });
      const pData = await pRes.json();
      if (!pRes.ok) throw new Error(pData.message || "Gagal memproses pembayaran");

      navigate("/payment-success", { state: { payment: pData.data, hotel, room: selectedRoom, formData, grandTotal } });
    } catch (error) {
      alert(`Error: ${error.message}`);
      setIsProcessing(false);
    }
  };

  const steps = ["Pilih Kamar", "Data Tamu", "Pembayaran", "Konfirmasi"];

  return (
    <main className="payment">
      {/* ── STEP INDICATOR ── */}
      <section className="payment__steps">
        <div className="payment__steps-inner">
          {steps.map((s, i) => (
            <div key={s} className={`payment__step ${activeStep === i + 1 ? "payment__step--active" : ""} ${activeStep > i + 1 ? "payment__step--done" : ""}`}>
              <div className="payment__step-circle">{activeStep > i + 1 ? "✓" : i + 1}</div>
              <span className="payment__step-label">{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="payment__main">
        <div className="payment__layout">

          {/* ═══════ LEFT: FORM ═══════ */}
          <div className="payment__form">

            {/* ── STEP 1: PILIH KAMAR ── */}
            <div className={`payment__panel ${activeStep === 1 ? "payment__panel--show" : ""}`}>
              <div className="payment__panel-header">
                <div>
                  <p className="section__eyebrow">Langkah 1 dari 4</p>
                  <h2 className="section__title">Pilih Kamar</h2>
                </div>
                <p className="payment__panel-sub">
                  <strong>{hotel.name}</strong> · {hotel.city || hotel.location}
                </p>
              </div>

              {loadingRooms ? (
                <div className="payment__loading">
                  <div className="payment__loading-spinner" />
                  <p>Memuat data lantai...</p>
                </div>
              ) : (
                <div className="payment__floor-layout">
                  {/* Floor Selector */}
                  <div className="payment__floor-panel">
                    <p className="payment__floor-title">Lantai</p>
                    <p className="payment__floor-count">{availableFloors}/{totalFloors} tersedia</p>
                    <div className="payment__floor-grid">
                      {Array.from({ length: totalFloors }, (_, i) => {
                        const num = totalFloors - i;
                        const floor = floorsData[num];
                        const isAvail = floor.status === "available";
                        const isSel = selectedFloor === num;
                        return (
                          <button key={num} className={`payment__floor-btn ${isSel ? "payment__floor-btn--active" : ""} ${!isAvail ? "payment__floor-btn--disabled" : ""}`}
                            onClick={() => { if (isAvail) { setSelectedFloor(num); setSelectedRoom(null); } }} disabled={!isAvail}>
                            {num}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Room List */}
                  <div className="payment__room-list">
                    {!selectedFloor ? (
                      <div className="payment__room-empty">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
                        <p>Pilih lantai untuk melihat kamar</p>
                      </div>
                    ) : floorRooms.length === 0 ? (
                      <div className="payment__room-empty"><p>Lantai {selectedFloor} sedang penuh</p></div>
                    ) : (
                      <>
                        <div className="payment__room-header">
                          <h3>Lantai {selectedFloor}</h3>
                          <span className="payment__room-badge">{floorRooms.length} kamar</span>
                        </div>
                        <div className="payment__room-cards">
                          {floorRooms.map((room) => {
                            const isSel = selectedRoom?.id === room.id;
                            return (
                              <div key={room.id} className={`payment__room-card ${isSel ? "payment__room-card--active" : ""}`} onClick={() => setSelectedRoom(room)}>
                                <div className="payment__room-card-left">
                                  <div className="payment__room-num">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4v16" /><path d="M2 8h18a2 2 0 012 2v10" /><path d="M2 17h20" /><path d="M6 8v9" /><path d="M10 8v9" /><path d="M14 8v9" /><path d="M18 8v9" /></svg>
                                    No. {room.roomNumber}
                                  </div>
                                  <span className="payment__room-type">{room.type || "Standard Room"}</span>
                                </div>
                                <div className="payment__room-card-right">
                                  <span className="payment__room-price">{formatPrice(room.price)}<small>/malam</small></span>
                                  {isSel && <span className="payment__room-check">✓ Dipilih</span>}
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

              <button className="payment__btn payment__btn--primary payment__btn--full" onClick={nextStep}>
                Lanjut ke Data Tamu →
              </button>
            </div>

            {/* ── STEP 2: DATA TAMU ── */}
            <div className={`payment__panel ${activeStep === 2 ? "payment__panel--show" : ""}`}>
              <div className="payment__panel-header">
                <div>
                  <p className="section__eyebrow">Langkah 2 dari 4</p>
                  <h2 className="section__title">Data Tamu</h2>
                </div>
              </div>

              <div className="payment__guest-form">
                <div className="payment__field payment__field--full">
                  <label>Nama Lengkap <span className="payment__required">*</span></label>
                  <input type="text" name="name" placeholder="Sesuai KTP" value={formData.name} onChange={handleChange} />
                </div>
                <div className="payment__field">
                  <label>Email <span className="payment__required">*</span></label>
                  <input type="email" name="email" placeholder="contoh@email.com" value={formData.email} onChange={handleChange} />
                </div>
                <div className="payment__field">
                  <label>No. Handphone <span className="payment__required">*</span></label>
                  <input type="tel" name="phone" placeholder="08xxxxxxxxxx" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="payment__field">
                  <label>Check-in <span className="payment__required">*</span></label>
                  <input type="date" name="checkIn" min={today} value={formData.checkIn} onChange={handleChange} />
                </div>
                <div className="payment__field">
                  <label>Check-out <span className="payment__required">*</span></label>
                  <input type="date" name="checkOut" min={formData.checkIn || today} value={formData.checkOut} onChange={handleChange} />
                </div>
                <div className="payment__field payment__field--full">
                  <label>Permintaan Khusus</label>
                  <textarea name="specialRequest" rows="3" placeholder="Kamar lantai atas, extra bed, dll" value={formData.specialRequest} onChange={handleChange} />
                </div>
              </div>

              <div className="payment__btn-group">
                <button className="payment__btn payment__btn--outline" onClick={prevStep}>← Kembali</button>
                <button className="payment__btn payment__btn--primary" onClick={nextStep}>Lanjutkan →</button>
              </div>
            </div>

            {/* ── STEP 3: PEMBAYARAN ── */}
            <div className={`payment__panel ${activeStep === 3 ? "payment__panel--show" : ""}`}>
              <div className="payment__panel-header">
                <div>
                  <p className="section__eyebrow">Langkah 3 dari 4</p>
                  <h2 className="section__title">Metode Pembayaran</h2>
                </div>
              </div>

              <div className="payment__methods">
                {[
                  { id: "bank_transfer", icon: "🏦", name: "Transfer Bank", desc: "BCA, BNI, Mandiri, BRI" },
                  { id: "credit_card", icon: "💳", name: "Kartu Kredit / Debit", desc: "Visa, Mastercard" },
                  { id: "ewallet", icon: "📱", name: "E-Wallet", desc: "GoPay, OVO, DANA, ShopeePay" },
                  { id: "qris", icon: "📲", name: "QRIS", desc: "Scan QR dari aplikasi apapun" },
                  { id: "virtual_account", icon: "🖥️", name: "Virtual Account", desc: "ATM atau Mobile Banking" },
                ].map((m) => (
                  <div key={m.id} className={`payment__method ${paymentMethod === m.id ? "payment__method--active" : ""}`} onClick={() => setPaymentMethod(m.id)}>
                    <div className="payment__method-radio">
                      {paymentMethod === m.id && <div className="payment__method-dot" />}
                    </div>
                    <span className="payment__method-icon">{m.icon}</span>
                    <div className="payment__method-info">
                      <strong>{m.name}</strong>
                      <span>{m.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="payment__btn-group">
                <button className="payment__btn payment__btn--outline" onClick={prevStep}>← Kembali</button>
                <button className="payment__btn payment__btn--primary" onClick={nextStep}>Review Pesanan →</button>
              </div>
            </div>

            {/* ── STEP 4: KONFIRMASI ── */}
            <div className={`payment__panel ${activeStep === 4 ? "payment__panel--show" : ""}`}>
              <div className="payment__panel-header">
                <div>
                  <p className="section__eyebrow">Langkah 4 dari 4</p>
                  <h2 className="section__title">Review & Konfirmasi</h2>
                </div>
              </div>

              <div className="payment__review">
                <h3 className="payment__review-title">Hotel & Kamar</h3>
                <div className="payment__review-grid">
                  <span>Hotel</span><strong>{hotel.name}</strong>
                  <span>Lantai</span><strong>Lantai {selectedFloor}</strong>
                  <span>Kamar</span><strong>{selectedRoom?.roomNumber || selectedRoom?.type}</strong>
                </div>
              </div>

              <div className="payment__review">
                <h3 className="payment__review-title">Data Tamu</h3>
                <div className="payment__review-grid">
                  <span>Nama</span><strong>{formData.name}</strong>
                  <span>Email</span><strong>{formData.email}</strong>
                  <span>No. HP</span><strong>{formData.phone}</strong>
                  <span>Check-in</span><strong>{formData.checkIn}</strong>
                  <span>Check-out</span><strong>{formData.checkOut}</strong>
                  <span>Durasi</span><strong>{nights} Malam</strong>
                </div>
              </div>

              <div className="payment__review">
                <h3 className="payment__review-title">Metode Pembayaran</h3>
                <p style={{ textTransform: "capitalize", fontWeight: 600, color: "#0f172a" }}>{paymentMethod.replace(/_/g, " ")}</p>
              </div>

              <div className="payment__btn-group">
                <button className="payment__btn payment__btn--outline" onClick={prevStep}>← Kembali</button>
                <button className="payment__btn payment__btn--pay" onClick={handlePayNow} disabled={isProcessing}>
                  {isProcessing ? "⏳ Memproses..." : `🔒 Bayar ${formatPrice(grandTotal)}`}
                </button>
              </div>
            </div>
          </div>

          {/* ═══════ RIGHT: SUMMARY ═══════ */}
          <div className="payment__summary">
            <div className="payment__summary-card">
              <div className="payment__summary-img">
                <img src={hotel.image_url || hotel.image || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiB2aWV3Qm94PSIwIDAgNDAwIDI1MCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNTAiIGZpbGw9IiNlMmU4ZjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk0YTNiOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=="} alt={hotel.name} />
              </div>
              <div className="payment__summary-body">
                <h3>{hotel.name}</h3>
                <p className="payment__summary-loc">📍 {hotel.city || hotel.location || "-"}</p>
                {hotel.rating && <span className="payment__summary-rating">★ {hotel.rating}{hotel.reviews ? ` (${hotel.reviews} ulasan)` : ""}</span>}
              </div>

              {selectedRoom && (
                <>
                  <div className="payment__summary-divider" />
                  <div className="payment__summary-room">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5"><path d="M2 4v16" /><path d="M2 8h18a2 2 0 012 2v10" /><path d="M2 17h20" /></svg>
                    <div>
                      <p>Lantai {selectedFloor} · No. {selectedRoom.roomNumber}</p>
                      <strong>{selectedRoom.type || "Standard Room"}</strong>
                    </div>
                  </div>
                </>
              )}

              <div className="payment__summary-divider" />
              <div className="payment__summary-details">
                <div className="payment__summary-row">
                  <span>{selectedRoom ? formatPrice(roomPrice) : "Rp 0"} × {nights > 0 ? nights : "?"} malam</span>
                  <span>{nights > 0 ? formatPrice(totalPrice) : "-"}</span>
                </div>
                <div className="payment__summary-row">
                  <span>Pajak & Layanan (11%)</span>
                  <span>{nights > 0 ? formatPrice(tax) : "-"}</span>
                </div>
              </div>

              <div className="payment__summary-divider" />
              <div className="payment__summary-total">
                <span>Total</span>
                <strong>{nights > 0 ? formatPrice(grandTotal) : "Rp 0"}</strong>
              </div>
            </div>

            <button className="payment__summary-back" onClick={() => navigate("/hotel")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
              Kembali ke Hotel
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}