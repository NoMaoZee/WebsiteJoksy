document.addEventListener("DOMContentLoaded", () => {
  const serviceForm = document.getElementById("serviceForm");
  const serviceTable = document
    .getElementById("serviceTable")
    .querySelector("tbody");

  // Fetch services
  fetch("admin_actions.php")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((service) => {
        addServiceToTable(service);
      });
    });

  // Add Service to Table
  function addServiceToTable(service) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${service.id}</td>
        <td>${service.name}</td>
        <td>${service.price}</td>
        <td><img src="${service.image}" alt="${service.name}" style="width: 50px; height: 50px;"></td>
        <td>
          <button onclick="editService(${service.id})">Edit</button>
          <button onclick="deleteService(${service.id})">Delete</button>
        </td>
      `;
    serviceTable.appendChild(row);
  }

  // Handle Form Submission
  serviceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(serviceForm);

    fetch("admin_actions.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        location.reload();
      });
  });
});

// Delete Service
function deleteService(id) {
  fetch(`admin_actions.php`, {
    method: "DELETE",
    body: `id=${id}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then(() => location.reload());
}
