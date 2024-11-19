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
  window.location.href = "/#courses";
}

const courses = [
  {
    id: 0,
    image: "../static/Images/Web-Dev.jpg",
    title: "Web Development",
    para: "Web development for beginners - learn web development from basics",
  },

  {
    id: 1,
    image: "../static/Images/SQL.jpg",
    title: "SQL",
    para: "SQL for beginners - learn SQL from scratch with examples",
  },

  {
    id: 2,
    image: "../static/Images/PowerBI.png",
    title: "PowerBi Dashboard",
    para: "PowerBi for beginners, PowerBi Projects & Dashboard",
  },

  {
    id: 3,
    image: "../static/Images/DSA.png",
    title: "DSA",
    para: "Complete C++ DSA Course | learn DSA with C++ from basics",
  },

  {
    id: 4,
    image: "../static/Images/Python.png",
    title: "Python",
    para: "Python for beginners - learn Python from basics",
  },

  {
    id: 5,
    image: "../static/Images/Java.png",
    title: "Java",
    para: "JAVA for beginners - learn JAVA from basics",
  },

  {
    id: 6,
    image: "../static/Images/MongoDB.png",
    title: "Mongo DB",
    para: "Mongo DB for beginners - learn MongoDB from scratch",
  },

  {
    id: 7,
    image: "../static/Images/MachineLearning.png",
    title: "Machine Learning",
    para: "ML for beginners - learn Machine Learning from scratch",
  },
];

const categories = [
  ...new Set(
    courses.map((item) => {
      return item;
    })
  ),
];

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
      var { image, title, para } = item;
      return `<div class="course">
              <img src=${image}>
              <h3>${title}</h3>
              <p>${para}</p>
            <a href="/signin">
              <div class="course-btn">Join Now</div>
            </a>
          </div>`;
    })
    .join("");
};
displayItem(categories);

//-- ----- Contact Form Reset ----- -
window.onload = function () {
  document.getElementById("form").reset();
};

// Responsive search functionality
const searchInput = document.getElementById("search");

searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value.toLowerCase();
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchValue)
  );
  displayCourses(filteredCourses);
});

// Responsive course display
function displayCourses(coursesToDisplay) {
  const coursesContainer = document.getElementById("courses-container");
  coursesContainer.innerHTML = "";

  coursesToDisplay.forEach((course) => {
    const courseElement = document.createElement("div");
    courseElement.classList.add("course");

    const imageElement = document.createElement("img");
    imageElement.src = course.image;
    courseElement.appendChild(imageElement);

    const titleElement = document.createElement("h3");
    titleElement.textContent = course.title;
    courseElement.appendChild(titleElement);

    const paragraphElement = document.createElement("p");
    paragraphElement.textContent = course.para;
    courseElement.appendChild(paragraphElement);

    const buttonElement = document.createElement("a");
    buttonElement.href = "Sign In - Up/signin.html";
    buttonElement.innerHTML = '<div class="course-btn">Join Now</div>';
    courseElement.appendChild(buttonElement);

    coursesContainer.appendChild(courseElement);
  });
}

// Responsive menu toggle
const menuButton = document.getElementById("menu");
const navbar = document.getElementById("navbar");

menuButton.addEventListener("click", () => {
  menuButton.classList.toggle("active");
  navbar.classList.toggle("active");
});
