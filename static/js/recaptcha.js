function captchaVerified() {
    document.getElementById('btn').disabled = false;
}

function captchaExpired() {
    document.getElementById('btn').disabled = true;
}