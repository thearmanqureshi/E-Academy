// Function to display the enrolled courses and their study material links
function displayEnrolledCourses() {
  const enrolledCoursesDiv = document.getElementById("enrolledCourses");
  const enrolledCourses =
    JSON.parse(localStorage.getItem("enrolledCourses")) || [];

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
      image: "../Images/Web-Dev.jpg",
      studyMaterialLink: "Courses/webDev.html?showMaterial=true",
    },
    "SQL": {
      image: "../Images/SQL.jpg",
      studyMaterialLink: "Courses/SQL.html?showMaterial=true",
    },
    "Power BI": {
      image: "../Images/PowerBI.png",
      studyMaterialLink: "Courses/powerBI.html?showMaterial=true",
    },
    "DSA": {
      image: "../Images/DSA.png",
      studyMaterialLink: "Courses/DSA.html?showMaterial=true",
    },
    "Python": {
      image: "../Images/Python.png",
      studyMaterialLink: "Courses/python.html?showMaterial=true",
    },
    "Java": {
      image: "../Images/Java.png",
      studyMaterialLink: "Courses/java.html?showMaterial=true",
    },
    "Mongo DB": {
      image: "../Images/MongoDB.png",
      studyMaterialLink: "Courses/mongoDB.html?showMaterial=true",
    },
    "Machine Learning": {
      image: "../Images/MachineLearning.png",
      studyMaterialLink: "Courses/machineLearning.html?showMaterial=true",
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
