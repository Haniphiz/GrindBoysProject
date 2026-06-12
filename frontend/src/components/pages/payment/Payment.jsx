import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const hotel = location.state?.hotel; // Ambil data hotel dari tombol pesan

  // Jika langsung akses tanpa klik pesan, kembalikan ke home
  if (!hotel) {
    return (
      <div className="payment-error">
        <h2>⚠️ Akses Ditolak</h2>
        <p>Silakan pilih hotel terlebih dahulu dari halaman utama.</p>
        <button onClick={() => navigate("/")}>Kembali ke Beranda</button>
      </div>
    );
  }

  // State Form
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    specialRequest: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hitung durasi menginap
  const getNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const diffTime = Math.abs(new Date(formData.checkOut) - new Date(formData.checkIn));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const nights = getNights();
  const totalPrice = hotel.price * nights;
  const tax = Math.round(totalPrice * 0.11);
  const grandTotal = totalPrice + tax;

  // Validasi Step 1
  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.checkIn || !formData.checkOut) {
      alert("Mohon lengkapi semua data yang wajib diisi.");
      return false;
    }
    return true;
  };

  // Validasi Step 2
  const validateStep2 = () => {
    if (!paymentMethod) {
      alert("Silakan pilih metode pembayaran.");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (activeStep === 1 && validateStep1()) setActiveStep(2);
    if (activeStep === 2 && validateStep2()) setActiveStep(3);
  };

  const prevStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  // PROSES PEMBAYARAN (Menghubungkan ke Backend yang sudah dibuat)
  const handlePayNow = async () => {
    setIsProcessing(true);

    // 1. Buat Booking dulu
    try {
      const bookingRes = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ambil token dari localStorage
        },
        body: JSON.stringify({
          room_id: hotel.id, // Sesuaikan dengan yang ada di backend kamu
          check_in: formData.checkIn,
          check_out: formData.checkOut,
        }),
      });

      const bookingData = await bookingRes.json();

      if (!bookingRes.ok) throw new Error(bookingData.message || "Gagal membuat booking");

      // 2. Buat Payment
      const paymentRes = await fetch("http://localhost:3000/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          booking_id: bookingData.data?.id || bookingData.data?.booking_id,
          payment_method: paymentMethod,
        }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) throw new Error(paymentData.message || "Gagal memproses pembayaran");

      // 3. Sukses, pindah ke halaman sukses
      navigate("/payment-success", { state: { payment: paymentData.data, hotel, formData, grandTotal } });

    } catch (error) {
      alert(`Error: ${error.message}`);
      setIsProcessing(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  return (
    <main className="payment-page">
      {/* HEADER */}
      <div className="payment-header">
        <div className="payment-header-inner">
          <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>HotelBooking</h1>
          <div className="payment-steps">
            {["Data Tamu", "Pembayaran", "Konfirmasi"].map((step, index) => (
              <div key={index} className={`payment-step-item ${activeStep === index + 1 ? "active" : activeStep > index + 1 ? "done" : ""}`}>
                <div className="step-circle">{activeStep > index + 1 ? "✓" : index + 1}</div>
                <span className="step-text">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="payment-container">
        {/* LEFT: FORM */}
        <div className="payment-form-section">
          
          {/* STEP 1: DATA TAMU */}
          <div className={`payment-card step-content ${activeStep === 1 ? "show" : "hide"}`}>
            <h2>Detail Data Tamu</h2>
            <div className="form-grid">
              <div className="form-group full">
                <label>Nama Lengkap <span className="required">*</span></label>
                <input type="text" name="name" placeholder="Masukkan nama sesuai KTP" value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input type="email" name="email" placeholder="contoh@email.com" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>No. Handphone <span className="required">*</span></label>
                <input type="tel" name="phone" placeholder="08xxxxxxxxxx" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Tanggal Check-in <span className="required">*</span></label>
                <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Tanggal Check-out <span className="required">*</span></label>
                <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} />
              </div>
              <div className="form-group full">
                <label>Permintaan Khusus (Opsional)</label>
                <textarea name="specialRequest" rows="3" placeholder="Contoh: Kamar lantai atas, extra bed, dll" value={formData.specialRequest} onChange={handleChange}></textarea>
              </div>
            </div>
            <button className="btn-primary btn-next" onClick={nextStep}>Lanjut ke Pembayaran →</button>
          </div>

          {/* STEP 2: METODE PEMBAYARAN */}
          <div className={`payment-card step-content ${activeStep === 2 ? "show" : "hide"}`}>
            <h2>Pilih Metode Pembayaran</h2>
            <div className="payment-methods">
              {[
                { id: "bank_transfer", icon: "🏦", name: "Transfer Bank", desc: "BCA, BNI, Mandiri, BRI" },
                { id: "credit_card", icon: "💳", name: "Kartu Kredit / Debit", desc: "Visa, Mastercard" },
                { id: "ewallet", icon: "📱", name: "E-Wallet", desc: "GoPay, OVO, DANA, ShopeePay" },
                { id: "qris", icon: "📲", name: "QRIS", desc: "Scan QR dari aplikasi apapun" },
                { id: "virtual_account", icon: "🖥️", name: "Virtual Account", desc: "Bayar lewat ATM atau Mobile Banking" },
              ].map((method) => (
                <div 
                  key={method.id} 
                  className={`method-option ${paymentMethod === method.id ? "selected" : ""}`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <div className="method-radio">
                    {paymentMethod === method.id && <div className="method-radio-inner"></div>}
                  </div>
                  <div className="method-icon">{method.icon}</div>
                  <div className="method-info">
                    <strong>{method.name}</strong>
                    <span>{method.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="btn-group">
              <button className="btn-secondary" onClick={prevStep}>← Kembali</button>
              <button className="btn-primary" onClick={nextStep}>Review Pesanan →</button>
            </div>
          </div>

          {/* STEP 3: KONFIRMASI */}
          <div className={`payment-card step-content ${activeStep === 3 ? "show" : "hide"}`}>
            <h2>Review & Konfirmasi Pesanan</h2>
            
            <div className="review-section">
              <h3>Data Tamu</h3>
              <div className="review-grid">
                <p>Nama</p><strong>{formData.name}</strong>
                <p>Email</p><strong>{formData.email}</strong>
                <p>No. HP</p><strong>{formData.phone}</strong>
                <p>Check-in</p><strong>{formData.checkIn}</strong>
                <p>Check-out</p><strong>{formData.checkOut}</strong>
                <p>Durasi</p><strong>{nights} Malam</strong>
              </div>
            </div>

            <div className="review-section">
              <h3>Metode Pembayaran</h3>
              <p style={{ textTransform: "capitalize", fontWeight: 600 }}>{paymentMethod.replace("_", " ")}</p>
            </div>

            <div className="btn-group">
              <button className="btn-secondary" onClick={prevStep}>← Kembali</button>
              <button className="btn-primary btn-pay" onClick={handlePayNow} disabled={isProcessing}>
                {isProcessing ? "⏳ Memproses..." : `🔒 Bayar ${formatPrice(grandTotal)}`}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: SUMMARY STICKY */}
        <div className="payment-summary">
          <div className="summary-card">
            <div className="summary-img-wrap">
              <img src={hotel.image} alt={hotel.name} />
              <span className="summary-tag">{hotel.tag}</span>
            </div>
            <div className="summary-info">
              <h3>{hotel.name}</h3>
              <p className="summary-loc">📍 {hotel.location}</p>
              <div className="summary-rating">
                <span className="stars">★ {hotel.rating}</span>
                <span>({hotel.reviews} ulasan)</span>
              </div>
            </div>
            
            <div className="summary-divider" />

            <div className="summary-details">
              <div className="summary-row">
                <span>{formatPrice(hotel.price)} x {nights > 0 ? nights : '?'} Malam</span>
                <span>{nights > 0 ? formatPrice(totalPrice) : '-'}</span>
              </div>
              <div className="summary-row">
                <span>Pajak & Biaya Layanan (11%)</span>
                <span>{nights > 0 ? formatPrice(tax) : '-'}</span>
              </div>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total Pembayaran</span>
              <strong>{nights > 0 ? formatPrice(grandTotal) : 'Rp 0'}</strong>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}