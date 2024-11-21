// Function to show/hide logout popup
function togglePopup() {
  const popup = document.getElementById("popup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", function (event) {
  const popup = document.getElementById("popup");
  const userInfo = document.getElementById("user-info");

  if (!popup.contains(event.target) && !userInfo.contains(event.target)) {
    popup.style.display = "none";
  }
});

// Function to fetch enrolled courses from the backend
async function fetchEnrolledCourses() {
  try {
    const response = await fetch('/api/courses'); // Call the backend API
    const data = await response.json();
    return data.courses || [];
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return [];
  }
}

// Function to display the enrolled courses and their assignments
async function displayEnrolledCourses() {
  const enrolledCoursesDiv = document.getElementById("enrolledCourses");
  const enrolledCourses = await fetchEnrolledCourses(); // Fetch courses from backend

  // Clear the current list
  enrolledCoursesDiv.innerHTML = "";

  // Check if there are any enrolled courses
  if (enrolledCourses.length === 0) {
    enrolledCoursesDiv.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 200px;">
          <p style="text-align: center; font-size: 1.2rem; color: #666;">You have not enrolled in any courses yet.</p>
        </div>`;
    return;
  }

  // Create a courses container
  const coursesContainer = document.createElement("div");
  coursesContainer.id = "courses-container";

  // Course data mapping
  const courseData = {
    "Web Development": {
      image: "../static/Images/Web-Dev.jpg",
      assignmentLink: "courses/webDev?showcontent=assignment",
    },
    "SQL": {
      image: "../static/Images/SQL.jpg",
      assignmentLink: "courses/SQL?showcontent=assignment",
    },
    "Power BI": {
      image: "../static/Images/PowerBI.png",
      assignmentLink: "courses/powerBI?showcontent=assignment",
    },
    "DSA": {
      image: "../static/Images/DSA.png",
      assignmentLink: "courses/DSA?showcontent=assignment",
    },
    "Python": {
      image: "../static/Images/Python.png",
      assignmentLink: "courses/python?showcontent=assignment",
    },
    "Java": {
      image: "../static/Images/Java.png",
      assignmentLink: "courses/java?showcontent=assignment",
    },
    "Mongo DB": {
      image: "../static/Images/MongoDB.png",
      assignmentLink: "courses/mongoDB?showcontent=assignment",
    },
    "Machine Learning": {
      image: "../static/Images/MachineLearning.png",
      assignmentLink: "courses/machineLearning?showcontent=assignment",
    },
  };

  // Display each enrolled course
  enrolledCourses.forEach((courseName) => {
    const courseInfo = courseData[courseName];
    if (courseInfo) {
      const courseElement = document.createElement("div");
      courseElement.className = "course";

      courseElement.innerHTML = `
          <img src="${courseInfo.image}">
          <h3>${courseName}</h3>
          <p>Assignment on ${courseName}</p>
          <div class="course-actions" style="display: flex; gap: 10px; margin-top: 10px;">
            <button class="course-btn" style="flex: 1;" onclick="goToAssignment('${courseInfo.assignmentLink}')">Go to Assignment</button>
          </div>
        `;

      coursesContainer.appendChild(courseElement);
    }
  });

  enrolledCoursesDiv.appendChild(coursesContainer);
}

// Function to go to the assignment page for a specific course
function goToAssignment(assignmentLink) {
  window.location.href = assignmentLink;
}

// Display enrolled courses when the page loads
displayEnrolledCourses();
