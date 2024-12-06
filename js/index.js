document.addEventListener("DOMContentLoaded", () => {
    const serviceSection = document.getElementById('services-list');  // Target the services section
  
    // Fetch services from the server
    fetch("http://127.0.0.1:8000/api/services")
      .then(response => response.json())
      .then(data => {
        // Clear any existing services
        serviceSection.innerHTML = '';
        
        // Loop through the fetched data and append it to the services section
        data.forEach(service => {
          const serviceBox = document.createElement('div');
          serviceBox.classList.add('service-box');
          serviceBox.setAttribute('data-aos', 'fade-right');
          serviceBox.innerHTML = `
            <div class="image-container">
              <img src="${service.image}" alt="${service.name}" />
              <div class="overlay">
                <div class="text-content">
                  <h3>${service.name}</h3>
                  <p>Rp ${service.price}</p>
                <a href="/payment/payment.html">
                     <button class="order-btn">Order</button>
                </a>
                </div>
              </div>
            </div>
          `;
          serviceSection.appendChild(serviceBox);
        });
      })
      .catch(error => {
        console.error("Error fetching services:", error);
      });
  });
  