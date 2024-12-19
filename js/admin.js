document.addEventListener("DOMContentLoaded", function () {
  const servicesTable = document.getElementById("servicesTable").querySelector("tbody");
  const serviceForm = document.getElementById("serviceForm");
  const deleteForm = document.getElementById("deleteForm");
  const loadingElement = document.getElementById("loading");
  const errorElement = document.getElementById("error");
  const submitButton = document.getElementById("submitButton");

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

    const method = id ? "PUT" : "POST"; // Tentukan methodnya
    const url = id
      ? `http://127.0.0.1:8000/api/services/${id}` // Update jika ID ada
      : "http://127.0.0.1:8000/api/services"; // Create jika ID tidak ada

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, image }), // Data tanpa ID dalam body
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message || "Service saved successfully");
        serviceForm.reset();
        fetchServices(); // Refresh data
        submitButton.textContent = "Save"; // Reset tombol ke "Save" setelah selesai
      })
      .catch((error) => {
        console.error("Error:", error);
        showError("Failed to save service.");
      });
  }

  function deleteService(id) {
    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    fetch(`http://127.0.0.1:8000/api/services/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete service: " + response.statusText);
        }
        return response.json(); // Ambil response JSON jika statusnya ok
      })
      .then((data) => {
        alert(data.message || "Service deleted successfully");
        fetchServices(); // Refresh data setelah delete
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to delete service: " + error.message); // Tampilkan pesan error jika gagal
      });
  }


  window.editService = (id, name, price, image) => {
    document.getElementById("serviceId").value = id;
    document.getElementById("name").value = name;
    document.getElementById("price").value = price;
    document.getElementById("image").value = image;

    submitButton.textContent = "Update"; // Ubah tombol ke "Update" ketika edit
  };

  serviceForm.addEventListener("submit", createOrUpdateService);

  deleteForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const id = document.getElementById("deleteId").value;
    deleteService(id);
  });

  fetchServices(); // Initial fetch of the service list
});
