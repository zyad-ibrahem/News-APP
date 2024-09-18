const online = document.getElementById("online"),
  offline = document.getElementById("offline");

function checkOnline() {
  if (navigator.onLine) {
    offline.style.display = "none";
    online.style.display = "block"
  } else {
    offline.style.display = "block"
    online.style.display = "none"
  }
}

checkOnline()

window.addEventListener("online", checkOnline)
window.addEventListener("offline", checkOnline)