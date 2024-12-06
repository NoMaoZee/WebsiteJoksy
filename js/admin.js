document.addEventListener("DOMContentLoaded", function () {
  const servicesTable = document.getElementById("servicesTable").querySelector("tbody");
  const serviceForm = document.getElementById("serviceForm");
  const deleteForm = document.getElementById("deleteForm");
  const loadingElement = document.getElementById("loading");
  const errorElement = document.getElementById("error");

  function showLoading() {
    loadingElement.style.display = "block";
    errorElement.style.display = "none";
  }

  function hideLoading() {
    loadingElement.style.display = "none";
  }

  function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }

  function fetchServices() {
    showLoading();

    fetch("http://127.0.0.1:8000/api/services")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        return response.json();
      })
      .then((data) => {
        hideLoading();

        if (data.length === 0) {
          showError("No services found.");
          return;
        }

        servicesTable.innerHTML = data
          .map(
            (service) => `
              <tr>
                <td>${service.id}</td>
                <td>${service.name}</td>
                <td>${service.price}</td>
                <td><img src="${service.image}" alt="${service.name}" width="50" /></td>
                <td>
                  <button onclick="editService(${service.id}, '${service.name}', ${service.price}, '${service.image}')">Edit</button>
                  <button onclick="deleteService(${service.id})">Delete</button>
                </td>
              </tr>
            `
          )
          .join("");
      })
      .catch((error) => {
        console.error(error);
        showError("Error loading services.");
      });
  }

  function createOrUpdateService(e) {
    e.preventDefault();

    const id = document.getElementById("serviceId").value;
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").value;

    const method = id ? "PUT" : "POST";
    const url = "http://127.0.0.1:8000/api/services";  // Same URL for both POST and PUT

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, price, image }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message || "Service saved successfully");
        serviceForm.reset();
        fetchServices();  // Refresh the list of services
      })
      .catch((error) => console.error("Error:", error));
  }

  function deleteService(id) {
    fetch("http://127.0.0.1:8000/api/services", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }), // Send the ID to delete
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message || "Service deleted successfully");
        fetchServices(); // Refresh the services list after deletion
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to delete service");
      });
  }

  window.editService = (id, name, price, image) => {
    document.getElementById("serviceId").value = id;
    document.getElementById("name").value = name;
    document.getElementById("price").value = price;
    document.getElementById("image").value = image;
  };

  serviceForm.addEventListener("submit", createOrUpdateService);
  deleteForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const id = document.getElementById("deleteId").value;
    deleteService(id);
  });

  fetchServices(); // Initial fetch of the service list
});
