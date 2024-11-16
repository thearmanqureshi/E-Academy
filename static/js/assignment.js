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
      image: "../Images/Web-Dev.jpg",
      assignmentLink: "Courses/webDev.html?showAssignment=true",
    },
    "SQL": {
      image: "../Images/SQL.jpg",
      assignmentLink: "Courses/SQL.html?showAssignment=true",
    },
    "Power BI": {
      image: "../Images/PowerBI.png",
      assignmentLink: "Courses/powerBI.html?showAssignment=true",
    },
    "DSA": {
      image: "../Images/DSA.png",
      assignmentLink: "Courses/DSA.html?showAssignment=true",
    },
    "Python": {
      image: "../Images/Python.png",
      assignmentLink: "Courses/python.html?showAssignment=true",
    },
    "Java": {
      image: "../Images/Java.png",
      assignmentLink: "Courses/java.html?showAssignment=true",
    },
    "Mongo DB": {
      image: "../Images/MongoDB.png",
      assignmentLink: "Courses/mongoDB.html?showAssignment=true",
    },
    "Machine Learning": {
      image: "../Images/machineLearning.png",
      assignmentLink: "Courses/machineLearning.html?showAssignment=true",
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
