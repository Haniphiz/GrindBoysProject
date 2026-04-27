const API = "http://localhost:3000/api/auth";

function register() {
  // Ambil elemen email (pastikan di HTML id-nya adalah "email")
  const emailInput = document.getElementById("email"); 
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  fetch(API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: emailInput.value,    // <--- TAMBAHKAN INI
      username: usernameInput.value,
      password: passwordInput.value
    })
  })
  .then(res => res.json())
  .then(data => alert(data.message));
}

// Fungsi login tetap sama (biasanya login tidak butuh email, cukup username/pass)
function login() {
  fetch(API + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: document.getElementById("username").value,
      password: document.getElementById("password").value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.message === "Login berhasil") {
      alert("Login berhasil");
      window.location.href = "dashboard.html";
    } else {
      alert(data.message);
    }
  });
}