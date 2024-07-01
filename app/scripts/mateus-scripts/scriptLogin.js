document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/usuarios');
    const usuarios = await response.json();

    const usuario = usuarios.find(user => user.email === email && user.password === password);

    if (usuario) {
        alert('Login bem-sucedido!');
        // Redirecionar para a página principal ou dashboard
        window.location.href = './HomeScreenVictor.html'; // exemplo de redirecionamento
    } else {
        alert('Email ou senha incorretos.');
    }
});
