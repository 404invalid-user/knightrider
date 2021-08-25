//for mobile navbar
function openNav() {
    document.getElementById("mobilenavbar").style.width = "250px";
}

function closeNav() {
    document.getElementById("mobilenavbar").style.width = "0";
}
if (window.innerWidth <= 280) {
    alert("please open your fold phone to use this page")
}