const API = "http://localhost:3000/api/auth";

function register() {
  fetch(API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
  .then(res => res.json())
  .then(data => alert(data.message));
}

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
      
      // ⬇️ INI YANG DITAMBAHIN
      window.location.href = "dashboard.html";
      
    } else {
      alert(data.message);
    }
  });
}