//-- ----- Swiper JS ----- -
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 2,
  grabCursor: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

//-- ----- Scroll Reveal JS ----- -
ScrollReveal().reveal("#courses", { delay: 200 });
ScrollReveal().reveal("#features", { delay: 200 });
ScrollReveal().reveal("#reviews", { delay: 200 });

//-- ----- Search Bar ----- -
function redirectToHome() {
  window.location.href = "{{ url_for('home') }}";
}


//-- ----- Contact Form Reset ----- -
window.onload = function () {
  document.getElementById("form").reset();
};

// Responsive menu toggle
const menuButton = document.getElementById("menu");
const navbar = document.getElementById("navbar");

menuButton.addEventListener("click", () => {
  menuButton.classList.toggle("active");
  navbar.classList.toggle("active");
});
