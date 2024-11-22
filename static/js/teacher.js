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

// Student Performance Prediction Model
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');
    const resultElement = document.getElementById('prediction-result');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);

        // Clear any previous result messages
        resultElement.textContent = 'Processing...';

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            // Check for response.ok before parsing JSON
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }

            const data = await response.json();

            if (data.prediction !== undefined) {
                // Display the prediction result
                resultElement.textContent = `Prediction: ${data.prediction}`;
            } else {
                // Display error message if no prediction is available
                resultElement.textContent = `Error: ${data.error || 'No prediction available'}`;
            }

        } catch (error) {
            console.error("Error:", error);
            // Display error message in resultElement
            resultElement.textContent = `Error: ${error.message}`;
        }
    });
});

// Calendar
const header = document.querySelector(".calendar h3");
const dates = document.querySelector(".dates");
const navs = document.querySelectorAll("#prev, #next");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();

function renderCalendar() {
  // first day of the month
  const start = new Date(year, month, 1).getDay();
  // last date of the month
  const endDate = new Date(year, month + 1, 0).getDate();
  // last day of the month
  const end = new Date(year, month, endDate).getDay();
  // last date of the previous month
  const endDatePrev = new Date(year, month, 0).getDate();

  let datesHtml = "";

  for (let i = start; i > 0; i--) {
    datesHtml += `<li class="inactive">${endDatePrev - i + 1}</li>`;
  }

  for (let i = 1; i <= endDate; i++) {
    let className =
      i === date.getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
        ? ' class="today"'
        : "";
    datesHtml += `<li${className}>${i}</li>`;
  }

  for (let i = end; i < 6; i++) {
    datesHtml += `<li class="inactive">${i - end + 1}</li>`;
  }

  dates.innerHTML = datesHtml;
  header.textContent = `${months[month]} ${year}`;
}

navs.forEach((nav) => {
  nav.addEventListener("click", (e) => {
    const btnId = e.target.id;

    if (btnId === "prev" && month === 0) {
      year--;
      month = 11;
    } else if (btnId === "next" && month === 11) {
      year++;
      month = 0;
    } else {
      month = btnId === "next" ? month + 1 : month - 1;
    }

    date = new Date(year, month, new Date().getDate());
    year = date.getFullYear();
    month = date.getMonth();

    renderCalendar();
  });
});

renderCalendar();
