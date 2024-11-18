// Sign Out Popup
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

// Function to check if URL has the "showcontent" parameter
function checkURLParameter() {
  const urlParams = new URLSearchParams(window.location.search);
  const showContent = urlParams.get("showcontent"); // Get "showcontent" parameter

  // Common function to hide the video player and show the specific content
  const toggleVisibility = (contentId) => {
    const videoPlayer = document.getElementById("video-player");
    const contentElement = document.getElementById(contentId);

    if (videoPlayer) {
      videoPlayer.classList.add("hidden");
    }
    if (contentElement) {
      contentElement.classList.remove("hidden");
    }
  };

  // Check and toggle visibility based on the "showcontent" parameter
  if (showContent === "assignment") {
    toggleVisibility("assignment");

    // Update the navbar active link to "Assignments"
    updateNavbarActiveLink("assignment");
  } else if (showContent === "studyMaterial") {
    toggleVisibility("studyMaterial");

    // Update the navbar active link to "Study Material"
    updateNavbarActiveLink("studyMaterial");
  }
}

// Function to update the active class on the navbar links
function updateNavbarActiveLink(activeSection) {
  // Get all navbar links
  const navLinks = document.querySelectorAll("#navbar .nav-link a");

  // Loop through each link and remove the active class
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  // Add the active class to the relevant link based on the section
  if (activeSection === "assignment") {
    const assignmentLink = document.querySelector(
      "#navbar a[href='{{ url_for('assignments') }}']"
    );
    if (assignmentLink) {
      assignmentLink.classList.add("active");
    }
  } else if (activeSection === "studyMaterial") {
    const studyMaterialLink = document.querySelector(
      "#navbar a[href='{{ url_for('study_material') }}']"
    );
    if (studyMaterialLink) {
      studyMaterialLink.classList.add("active");
    }
  }
}

// Run the function when the script is loaded
checkURLParameter();
