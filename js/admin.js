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

    fetch("http://localhost/WebM4/get_services.php")
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

    const method = id ? "PUT" : "POST";
    const url = id ? "http://localhost/WebM4/admin.php" : "http://localhost/WebM4/admin.php";    

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, price, image }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message || "Service saved successfully");
        serviceForm.reset();
        fetchServices();
      })
      .catch((error) => console.error("Error:", error));
  }

  function deleteService(e) {
    e.preventDefault();

    const id = document.getElementById("deleteId").value;

    fetch("http://localhost/WebM4/admin.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message || "Service deleted successfully");
        deleteForm.reset();
        fetchServices();
      })
      .catch((error) => console.error("Error:", error));
  }

  window.editService = (id, name, price, image) => {
    document.getElementById("serviceId").value = id;
    document.getElementById("name").value = name;
    document.getElementById("price").value = price;
    document.getElementById("image").value = image;
  };

  serviceForm.addEventListener("submit", createOrUpdateService);
  deleteForm.addEventListener("submit", deleteService);
  fetchServices();
});
