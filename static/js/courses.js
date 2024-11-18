// Sign Out Popup
function togglePopup() {
  const popup = document.getElementById("popup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", function (event) {
  const popup = document.getElementById("popup");
  const userInfo = document.getElementById("user-info");

  // Close the popup if the click is outside the popup and the user info element
  if (popup && userInfo && !popup.contains(event.target) && !userInfo.contains(event.target)) {
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
      videoPlayer.classList.add("hidden"); // Hide video player
    }
    if (contentElement) {
      contentElement.classList.remove("hidden"); // Show the specific content
    }
  };

  // Check and toggle visibility based on the "showcontent" parameter
  if (showContent === "assignment") {
    toggleVisibility("assignment");
    updateNavbarActiveLink("assignment");  // Update active link for "assignment"
  } else if (showContent === "studyMaterial") {
    toggleVisibility("studyMaterial");
    updateNavbarActiveLink("studyMaterial");  // Update active link for "studyMaterial"
  }
}

// Function to update the active class on the navbar links
function updateNavbarActiveLink(activeSection) {
  // Get the current full URL (including domain and path)
  const currentURL = window.location.href;

  // Get all navbar links
  const navLinks = document.querySelectorAll("#navbar .nav-link a");

  // Loop through each link and remove the active class
  navLinks.forEach((link) => {
    link.classList.remove("active");

    // Get the full URL from the href (relative URL part)
    const href = link.getAttribute("href");

    // Check if the link href matches the active section in the current full URL
    if (href && currentURL.includes(`?showcontent=${activeSection}`)) {
      link.classList.add("active");  // Add "active" class if the full URL includes the query parameter
    }
  });
}

// Run the function when the script is loaded
checkURLParameter();
