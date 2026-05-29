function Footer() {
  return (
    <footer style={footerStyles.footer}>
      <p style={footerStyles.text}>© 2026 Web Pemesanan Tiket Hotel</p>
      <p style={footerStyles.text}>Dibuat oleh GrindBoys Team</p>
    </footer>
  );
}

const footerStyles = {
  footer: {
    backgroundColor: "#3f45b5",
    color: "white",
    textAlign: "center",
    padding: "25px",
    marginTop: "40px",
  },
  text: {
    margin: "5px 0", // Mengatur jarak antar baris teks di footer
  },
};

export default Footer;