const loginSection = document.getElementById("loginSection");
const adminDashboard = document.getElementById("adminDashboard");
const adminLoginForm = document.getElementById("adminLoginForm");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");

const complaintsBody = document.getElementById("complaintsBody");
const emptyNotice = document.getElementById("emptyNotice");
const clearDataBtn = document.getElementById("clearDataBtn");

// Check if admin is already logged in during the current browser session
if (sessionStorage.getItem("civicAdminAuth") === "true") {
  loginSection.classList.add("hidden");
  adminDashboard.classList.remove("hidden");
  loadComplaints();
}

// Handle Admin Login (Username: admin | Password: admin123)
adminLoginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("adminUser").value.trim();
  const password = document.getElementById("adminPass").value;

  if (username === "admin" && password === "admin123") {
    sessionStorage.setItem("civicAdminAuth", "true");
    loginError.classList.add("hidden");
    loginSection.classList.add("hidden");
    adminDashboard.classList.remove("hidden");
    adminLoginForm.reset();
    loadComplaints();
  } else {
    loginError.classList.remove("hidden");
  }
});

// Handle Logout
logoutBtn.addEventListener("click", function () {
  sessionStorage.removeItem("civicAdminAuth");
  adminDashboard.classList.add("hidden");
  loginSection.classList.remove("hidden");
});

// Function to load and render all stored complaints
function loadComplaints() {
  const complaints = JSON.parse(localStorage.getItem("civicComplaints")) || [];

  // Clear current table rows
  complaintsBody.innerHTML = "";

  if (complaints.length === 0) {
    emptyNotice.classList.remove("hidden");
    return;
  }

  emptyNotice.classList.add("hidden");

  complaints.forEach(function (complaint) {
    const row = document.createElement("tr");

    // Choose class based on status
    let badgeClass = "badge-pending";
    if (complaint.status === "In Progress") badgeClass = "badge-progress";
    if (complaint.status === "Solved") badgeClass = "badge-solved";

    // Render thumbnail if an image was uploaded
    const imageCell = complaint.image
      ? `<a href="${complaint.image}" target="_blank" title="View Full Image"><img src="${complaint.image}" alt="Damage Photo" class="table-thumb" /></a>`
      : "No image";

    row.innerHTML = `
      <td>${complaint.date}</td>
      <td><strong>${complaint.name}</strong></td>
      <td>${complaint.category}</td>
      <td>${complaint.location}</td>
      <td>${complaint.description}</td>
      <td>${imageCell}</td>
      <td><span class="badge ${badgeClass}">${complaint.status}</span></td>
      <td>
        <button class="action-btn btn-progress" onclick="updateStatus(${complaint.id}, 'In Progress')">In Progress</button>
        <button class="action-btn btn-solved" onclick="updateStatus(${complaint.id}, 'Solved')">Mark Solved</button>
      </td>
    `;

    complaintsBody.appendChild(row);
  });
}

// Function to update the status of a specific complaint by ID
function updateStatus(id, newStatus) {
  let complaints = JSON.parse(localStorage.getItem("civicComplaints")) || [];

  complaints = complaints.map(function (item) {
    if (item.id === id) {
      item.status = newStatus;
    }
    return item;
  });

  localStorage.setItem("civicComplaints", JSON.stringify(complaints));
  loadComplaints();
}

// Clear all local records
clearDataBtn.addEventListener("click", function () {
  if (confirm("Are you sure you want to delete all reports?")) {
    localStorage.removeItem("civicComplaints");
    loadComplaints();
  }
});
