// Function to show hide logout popup
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

// Function to fetch enrolled courses from the backend
async function fetchEnrolledCourses() {
  try {
    const response = await fetch('/api/courses');
    const data = await response.json();
    return data.courses || [];
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return [];
  }
}

// Function to enroll in a course
async function enrollCourse(courseName) {
  try {
    const response = await fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ course_name: courseName }),
    });

    if (response.ok) {
      alert(courseName + " has been added to your enrolled courses!");
      displayEnrolledCourses();
    } else {
      const errorData = await response.json();
      alert(errorData.error);
    }
  } catch (error) {
    console.error("Error enrolling in course:", error);
  }
}

// Function to disenroll from a course
async function deleteCourse(courseName) {
  const confirmDeletion = confirm(`Are you sure you want to disenroll from ${courseName}?`);

  if (confirmDeletion) {
    try {
      const response = await fetch(`/api/courses/${courseName}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert(`${courseName} has been successfully removed from your enrolled courses.`);
        displayEnrolledCourses();
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error("Error disenrolling from course:", error);
    }
  }
}

// Function to display enrolled courses
async function displayEnrolledCourses() {
  const enrolledCoursesDiv = document.getElementById("enrolledCourses");
  const enrolledCourses = await fetchEnrolledCourses();

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
      description: "Web Development Course by Apna College",
      details: {
        title: "Web Development",
        description: "Web Development Course by Apna College",
        duration: "No. Of Lessons: 58",
      },
    },
    SQL: {
      image: "../static/Images/SQL.jpg",
      description: "SQL for beginners - learn SQL from scratch with examples",
      details: {
        title: "SQL",
        description: "SQL for beginners - learn SQL from scratch with examples",
        duration: "Duration: 8 weeks",
      },
    },
    "Power BI": {
      image: "../static/Images/PowerBI.png",
      description: "PowerBi for beginners, PowerBi Projects & Dashboard",
      details: {
        title: "Power BI",
        description: "PowerBi for beginners, PowerBi Projects & Dashboard",
        duration: "Duration: 8 weeks",
      },
    },
    DSA: {
      image: "../static/Images/DSA.png",
      description: "Complete C++ DSA course | Learn DSA with C++ from basics",
      details: {
        title: "C++ DSA",
        description: "Complete C++ DSA course | Learn DSA with C++ from basics.",
        duration: "Duration: 8 weeks",
      },
    },
    Python: {
      image: "../static/Images/Python.png",
      description: "Python for beginners - learn Python from basics",
      details: {
        title: "Python",
        description: "Python for beginners - learn Python from basics",
        duration: "Duration: 8 weeks",
      },
    },
    Java: {
      image: "../static/Images/Java.png",
      description: "JAVA for beginners - learn JAVA from basics",
      details: {
        title: "Java",
        description: "JAVA for beginners - learn JAVA from basics",
        duration: "Duration: 8 weeks",
      },
    },
    "Mongo DB": {
      image: "../static/Images/MongoDB.png",
      description: "Mongo DB for beginners - learn MongoDB from scratch",
      details: {
        title: "Mongo DB",
        description: "Mongo DB for beginners - learn MongoDB from scratch",
        duration: "Duration: 8 weeks",
      },
    },
    "Machine Learning": {
      image: "../static/Images/MachineLearning.png",
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

// Function to start a course
function startCourse(courseName) {
  const coursePages = {
    "Web Development": "courses/webDev",
    "SQL": "courses/SQL",
    "Power BI": "courses/powerBI",
    "DSA": "courses/DSA",
    "Python": "courses/python",
    "Java": "courses/java",
    "Mongo DB": "courses/mongoDB",
    "Machine Learning": "courses/machineLearning",
  };

  const coursePageURL = coursePages[courseName];
  if (coursePageURL) {
    window.location.href = coursePageURL;
  } else {
    alert(`Sorry, the course page for "${courseName}" is not available.`);
  }
}

// Display enrolled courses when the page loads
displayEnrolledCourses();
