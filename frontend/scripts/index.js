function submitUsername() {
    const username = document.getElementById("usernameInput").value;
    sessionStorage.setItem("username", username);
    window.location.href = "main.html";
}
