function submitUsername() {
    const name = document.getElementById("usernameInput").value;
    console.log(name);
    fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: name })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

    sessionStorage.setItem("username", name);
    window.location.href = "main.html";
}
