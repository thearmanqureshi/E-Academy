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

// Function to display the enrolled courses and their study material links
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
      studyMaterialLink: "courses/webDev?showcontent=studyMaterial",
    },
    "SQL": {
      image: "../static/Images/SQL.jpg",
      studyMaterialLink: "courses/SQL?showcontent=studyMaterial",
    },
    "Power BI": {
      image: "../static/Images/PowerBI.png",
      studyMaterialLink: "courses/powerBI?showcontent=studyMaterial",
    },
    "DSA": {
      image: "../static/Images/DSA.png",
      studyMaterialLink: "courses/DSA?showcontent=studyMaterial",
    },
    "Python": {
      image: "../static/Images/Python.png",
      studyMaterialLink: "courses/python?showcontent=studyMaterial",
    },
    "Java": {
      image: "../static/Images/Java.png",
      studyMaterialLink: "courses/java?showcontent=studyMaterial",
    },
    "Mongo DB": {
      image: "../static/Images/MongoDB.png",
      studyMaterialLink: "courses/mongoDB?showcontent=studyMaterial",
    },
    "Machine Learning": {
      image: "../static/Images/MachineLearning.png",
      studyMaterialLink: "courses/machineLearning?showcontent=studyMaterial",
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
          <p>${courseName} Study Material</p>
          <div class="course-actions" style="display: flex; gap: 10px; margin-top: 10px;">
            <button class="course-btn" style="flex: 1;" onclick="goToStudyMaterial('${courseInfo.studyMaterialLink}')">View Content</button>
          </div>
        `;

      coursesContainer.appendChild(courseElement);
    }
  });

  enrolledCoursesDiv.appendChild(coursesContainer);
}

// Function to go to the study material page for a specific course
function goToStudyMaterial(studyMaterialLink) {
  window.location.href = studyMaterialLink;
}

// Display enrolled courses when the page loads
displayEnrolledCourses();
