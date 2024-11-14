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

const courses = [
  {
    id: 0,
    image: "../static/images/Web-Dev.jpg",
    title: "Web Development",
    para: "Web development for beginners - learn web development from basics",
  },
  {
    id: 1,
    image: "../static/images/SQL.jpg",
    title: "SQL",
    para: "SQL for beginners - learn SQL from scratch with examples",
  },
  {
    id: 2,
    image: "../static/images/PowerBI.png",
    title: "PowerBi Dashboard",
    para: "PowerBi for beginners, PowerBi Projects & Dashboard",
  },
  {
    id: 3,
    image: "../static/images/DSA.png",
    title: "DSA",
    para: "Complete C++ DSA Course | learn DSA with C++ from basics",
  },
  {
    id: 4,
    image: "../static/images/Python.png",
    title: "Python",
    para: "Python for beginners - learn Python from basics",
  },
  {
    id: 5,
    image: "../static/images/Java.png",
    title: "Java",
    para: "JAVA for beginners - learn JAVA from basics",
  },
  {
    id: 6,
    image: "../static/images/MongoDB.png",
    title: "Mongo DB",
    para: "Mongo DB for beginners - learn MongoDB from scratch",
  },
  {
    id: 7,
    image: "../static/images/MachineLearning.png",
    title: "Machine Learning",
    para: "ML for beginners - learn Machine Learning from scratch",
  },
];

// No need to use Set here as there is no duplicate filtering required
const categories = courses;

document.getElementById("search").addEventListener("keyup", (e) => {
  const searchData = e.target.value.toLowerCase();
  const filteredData = categories.filter((item) => {
    return item.title.toLowerCase().includes(searchData);
  });
  displayItem(filteredData);
});

const displayItem = (items) => {
  document.getElementById("courses-container").innerHTML = items
    .map((item) => {
      const { image, title, para } = item;
      return `
      <div class="course">
        <img src="${image}" alt="${title}">
        <h3>${title}</h3>
        <p>${para}</p>
        <a href="{{ url_for('login') }}">
          <div class="course-btn">Join Now</div>
        </a>
      </div>`;
    })
    .join("");
};

// Initial display of items
displayItem(categories);

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
