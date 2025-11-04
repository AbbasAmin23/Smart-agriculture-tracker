document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch('../backend/register.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            window.location.href = 'login.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});