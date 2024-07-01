document
  .getElementById("signup-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(
      "https://backend-studyflex.vercel.app/usuarios",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      }
    );

    if (response.ok) {
      window.location.href = "./login.html";
      // document.getElementById('signup-form').reset();
    } else {
      alert("Erro ao cadastrar usuário.");
    }
  });
