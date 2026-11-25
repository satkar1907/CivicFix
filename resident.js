// Grab HTML elements
const complaintForm = document.getElementById("complaintForm");
const successMessage = document.getElementById("successMessage");
const complaintsList = document.getElementById("complaintsList");
const noComplaintsMsg = document.getElementById("noComplaintsMsg");

// Function to load and display complaints in the tracking section
function showComplaints() {
  const complaints = JSON.parse(localStorage.getItem("civicComplaints")) || [];

  // Clear old cards before displaying updated ones
  complaintsList.innerHTML = "";

  // Show message if no complaints exist
  if (complaints.length === 0) {
    noComplaintsMsg.classList.remove("hidden");
    return;
  }

  noComplaintsMsg.classList.add("hidden");

  // Loop through all complaints and create a card for each
  for (let i = 0; i < complaints.length; i++) {
    const item = complaints[i];

    // Pick badge color based on status
    let badgeClass = "badge-pending";
    if (item.status === "In Progress") {
      badgeClass = "badge-progress";
    }
    if (item.status === "Solved") {
      badgeClass = "badge-solved";
    }

    // Include uploaded image if available
    const imageHTML = item.image
      ? `<img src="${item.image}" alt="Damage Photo" class="complaint-img" />`
      : "";

    // Add complaint card HTML
    complaintsList.innerHTML += `
      <div class="complaint-card">
        <h3>${item.category} - <span class="badge ${badgeClass}">${item.status}</span></h3>
        <p><strong>Resident:</strong> ${item.name} | <strong>Date:</strong> ${item.date}</p>
        <p><strong>Location:</strong> ${item.location}</p>
        <p><strong>Description:</strong> ${item.description}</p>
        ${imageHTML}
      </div>
    `;
  }
}

// Helper function to save complaint to localStorage and update UI
function saveComplaint(newComplaint) {
  const existingComplaints = JSON.parse(localStorage.getItem("civicComplaints")) || [];
  existingComplaints.push(newComplaint);
  localStorage.setItem("civicComplaints", JSON.stringify(existingComplaints));

  // Reset form, show success alert, and refresh the tracking list
  complaintForm.reset();
  successMessage.classList.remove("hidden");
  showComplaints();

  // Hide the alert after 4 seconds
  setTimeout(function () {
    successMessage.classList.add("hidden");
  }, 4000);
}

// Save new complaint when form is submitted
complaintForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get field values
  const name = document.getElementById("fullName").value.trim();
  const category = document.getElementById("category").value;
  const location = document.getElementById("location").value.trim();
  const description = document.getElementById("description").value.trim();
  const imageInput = document.getElementById("damageImage");

  // Create a new complaint object
  const newComplaint = {
    id: Date.now(),
    name: name,
    category: category,
    location: location,
    description: description,
    image: null,
    status: "Pending",
    date: new Date().toLocaleDateString()
  };

  // Convert uploaded image to Base64 if provided
  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      newComplaint.image = e.target.result;
      saveComplaint(newComplaint);
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    saveComplaint(newComplaint);
  }
});

// Show complaints automatically when the page loads
showComplaints();
