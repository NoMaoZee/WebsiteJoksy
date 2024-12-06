document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('order-form');
    const paymentDetails = document.getElementById('payment-details');
  
    const service = {
      name: "Mobile Design Premium",
      price: 200, // Price in your currency
      estimatedTime: "2 Days Left"
    };
  
    orderForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
  
      // Saving order data to database (simulated)
      saveOrderToDatabase(name, email);
  
      // Show payment summary
      displayPaymentSummary(name, service);
    });
  
    function saveOrderToDatabase(name, email) {
      // Simulate saving to a database
      console.log('Saving order:', { name, email });
    }
  
    function displayPaymentSummary(name, service) {
      const paymentHtml = `
        <div>
          <strong>Tittle:</strong> ${service.name}
        </div>
        <div>
          <strong>Items:</strong> Rp ${service.price}
        </div>
        <div>
          <strong>Estimate:</strong> ${service.estimatedTime}
        </div>
      `;
      paymentDetails.innerHTML = paymentHtml;
    }
  });
  