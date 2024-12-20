document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://127.0.0.1:8000/api/pricings";
    const pricingContainer = document.querySelector("#pricingTable");

    // Load data pricing
    async function loadPricing() {
        pricingContainer.innerHTML = "<div>Loading...</div>";  // Tampilkan loading sementara
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const pricings = await response.json();

            if (pricings.length === 0) {
                pricingContainer.innerHTML = "<div>No pricing available.</div>";
            } else {
                pricingContainer.innerHTML = pricings.map(pricing => {
                    // Parsing features from string to array
                    const features = JSON.parse(pricing.features);

                    return `
                        <div class="col-lg-4">
                            <div class="plan-card">
                                <div class="plan-title">${pricing.title}</div>
                                <div class="pricing">
                                    <span class="original-price">Rp ${parseInt(pricing.original_price).toLocaleString()}</span>
                                    <span class="discounted-price">Rp ${parseInt(pricing.discounted_price).toLocaleString()}</span>
                                </div>
                                <div class="plan-features">
                                    ${features.map(feature => `<p>${feature}</p>`).join('')}
                                </div>
                                <button class="btn btn-purchase">Purchase</button>
                            </div>
                        </div>
                    `;
                }).join("");
            }
        } catch (error) {
            console.error("Failed to load pricing data", error);
            pricingContainer.innerHTML = "<div>Failed to load pricing data.</div>";
        }
    }


    // Fungsi untuk mengedit pricing
    async function editPricing(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            const pricing = await response.json();
            document.querySelector("#pricingId").value = pricing.id;
            document.querySelector("#title").value = pricing.title;
            document.querySelector("#originalPrice").value = pricing.original_price;
            document.querySelector("#discountedPrice").value = pricing.discounted_price;
            document.querySelector("#features").value = pricing.features.join(",");
        } catch (error) {
            console.error("Failed to load pricing data", error);
        }
    }

    // Fungsi untuk menghapus pricing
    async function deletePricing(id) {
        if (confirm("Are you sure you want to delete this pricing plan?")) {
            try {
                await fetch(`${API_URL}/${id}`, { method: "DELETE" });
                loadPricing(); // Refresh pricing table after delete
            } catch (error) {
                console.error("Failed to delete pricing", error);
            }
        }
    }

    // Form submit untuk tambah atau update pricing
    pricingForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.querySelector("#pricingId").value;
        const title = document.querySelector("#title").value;
        const originalPrice = document.querySelector("#originalPrice").value;
        const discountedPrice = document.querySelector("#discountedPrice").value;
        const features = document.querySelector("#features").value.split(",");

        const method = id ? "PUT" : "POST";
        const url = id ? `${API_URL}/${id}` : API_URL;

        try {
            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, original_price: originalPrice, discounted_price: discountedPrice, features })
            });
            loadPricing();
            pricingForm.reset();
        } catch (error) {
            console.error("Failed to save data", error);
        }
    });

    // Form submit untuk delete pricing
    deleteForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.querySelector("#deleteId").value;
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            loadPricing();
        } catch (error) {
            console.error("Failed to delete data", error);
        }
    });

    // Load initial pricing data
    loadPricing();
});
