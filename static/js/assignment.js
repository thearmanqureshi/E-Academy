// Function to display the enrolled courses and their assignments
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
            <button class="course-btn" style="flex: 1;" onclick="goToAssignment('${courseInfo.assignmentLink}'); setContentPreference();">Go to Assignment</button>
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
