// Function to show the dialog box with course details
function showCourseDetails(title, description, duration) {
  document.getElementById("courseTitle").textContent = title;
  document.getElementById("courseDescription").textContent = description;
  document.getElementById("courseDuration").textContent = duration;

  // Set the onclick function of the Enroll button to enroll in this course
  document.getElementById("enrollButton").onclick = function () {
    enrollCourse(title);
  };

  // Display the dialog box
  document.getElementById("courseDialog").style.display = "flex";
}

// Function to close the dialog box
function closeDialog() {
  document.getElementById("courseDialog").style.display = "none";
}

// Function to enroll in a course
function enrollCourse(courseName) {
  // Retrieve existing enrolled courses from localStorage
  let enrolledCourses =
    JSON.parse(localStorage.getItem("enrolledCourses")) || [];

  // Check if the course is already enrolled
  if (!enrolledCourses.includes(courseName)) {
    enrolledCourses.push(courseName);
    localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
    alert(courseName + " has been added to your enrolled courses!");
  } else {
    alert("You are already enrolled in " + courseName);
  }
}

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
      description:
        "Web Development Course by Apna College",
      details: {
        title: "Web Development",
        description:
          "Web Development Course by Apna College",
        duration: "No. Of Lessons: 58",
      },
    },
    SQL: {
      image: "../Images/SQL.jpg",
      description: "SQL for beginners - learn SQL from scratch with examples",
      details: {
        title: "SQL",
        description: "SQL for beginners - learn SQL from scratch with examples",
        duration: "Duration: 8 weeks",
      },
    },
    "Power BI": {
      image: "../Images/PowerBI.png",
      description: "PowerBi for beginners, PowerBi Projects & Dashboard",
      details: {
        title: "Power BI",
        description: "PowerBi for beginners, PowerBi Projects & Dashboard",
        duration: "Duration: 8 weeks",
      },
    },
    DSA: {
      image: "../Images/DSA.png",
      description: "complete c++ DSA course | learn DSA with c++ from basics",
      details: {
        title: "C++ DSA",
        description:
          "complete c++ DSA course | learn DSA with c++ from basics.",
        duration: "Duration: 8 weeks",
      },
    },
    Python: {
      image: "../Images/Python.png",
      description: "Python for beginners - learn Python from basics",
      details: {
        title: "Python",
        description: "Python for beginners - learn Python from basics",
        duration: "Duration: 8 weeks",
      },
    },
    Java: {
      image: "../Images/Java.png",
      description: "JAVA for beginners - learn JAVA from basics",
      details: {
        title: "Java",
        description: "JAVA for beginners - learn JAVA from basics",
        duration: "Duration: 8 weeks",
      },
    },
    "Mongo DB": {
      image: "../Images/MongoDB.png",
      description: "Mongo DB for beginners - learn MongoDB from scratch",
      details: {
        title: "Mongo DB",
        description: "Mongo DB for beginners - learn MongoDB from scratch",
        duration: "Duration: 8 weeks",
      },
    },
    "Machine Learning": {
      image: "../Images/MachineLearning.png",
      description: "ML for beginners - learn Machine Learning from scratch",
      details: {
        title: "Machine Learning",
        description: "ML for beginners - learn Machine Learning from scratch",
        duration: "Duration: 8 weeks",
      },
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
          <p>${courseInfo.description}</p>
          <div class="course-actions" style="display: flex; gap: 10px; margin-top: 10px;">
            <button class="course-btn" style="flex: 1;" onclick="startCourse('${courseName}')">Start Course</button>
            <button class="course-btn" style="flex: 1; background-color: #fff; color: red; border: 1.5px solid red;" onclick="deleteCourse('${courseName}')">Disenroll</button>
          </div>
        `;

      coursesContainer.appendChild(courseElement);
    }
  });

  enrolledCoursesDiv.appendChild(coursesContainer);
}

// Add the startCourse function
// Function to start a course
function startCourse(courseName) {
  // Map course names to their respective page URLs
  const coursePages = {
    "Web Development": "Courses/webDev.html",
    "SQL": "Courses/SQL.html",
    "Power BI": "Courses/powerBI.html",
    "DSA": "Courses/DSA.html",
    "Python": "Courses/python.html",
    "Java": "Courses/java.html",
    "Mongo DB": "Courses/mongoDB.html",
    "Machine Learning": "Courses/machineLearning.html",
  };

  // Get the URL of the corresponding course page
  const coursePageURL = coursePages[courseName];

  // Check if the course page URL is found
  if (coursePageURL) {
    // Redirect the user to the course page
    window.location.href = coursePageURL;
  } else {
    // Display an error message if the course page is not found
    alert(`Sorry, the course page for "${courseName}" is not available.`);
  }
}

function deleteCourse(courseName) {
  // Ask for confirmation before deleting the course
  const confirmDeletion = confirm(`Are you sure you want to disenroll from ${courseName}?`);

  if (confirmDeletion) {
    let enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses")) || [];

    // Find and remove the course by name
    const courseIndex = enrolledCourses.indexOf(courseName);
    if (courseIndex > -1) {
      enrolledCourses.splice(courseIndex, 1);
      localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));

      // Refresh the displayed list of enrolled courses
      displayEnrolledCourses();
      alert(`${courseName} has been successfully removed from your enrolled courses.`);
    }
  } else {
    // User canceled the deletion
    alert("Course deletion canceled.");
  }
}


// Update the enrollCourse function
function enrollCourse(courseName) {
  let enrolledCourses =
    JSON.parse(localStorage.getItem("enrolledCourses")) || [];

  // Check if the course is already enrolled
  if (!enrolledCourses.includes(courseName)) {
    enrolledCourses.push(courseName);
    localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
    alert(courseName + " has been added to your enrolled courses!");

    // Refresh the displayed list of enrolled courses
    displayEnrolledCourses();
  } else {
    alert("You are already enrolled in " + courseName);
  }
}

// Display enrolled courses when the page loads
displayEnrolledCourses();

