<template>
    <div class="admin-container">
      <header class="admin-header">
        <h1>Admin Panel - Pricing</h1>
        <router-link to="/">Kembali ke Home</router-link>
      </header>
      <div class="admin-main">
        <aside class="sidebar">
          <nav>
            <ul>
              <li><router-link to="/services">Services</router-link></li>
              <li><router-link to="/pricing" class="active">Pricing</router-link></li>
              <li><a href="#orders">Orders</a></li>
              <li><a href="#users">Users</a></li>
              <li><a href="#settings">Settings</a></li>
            </ul>
          </nav>
        </aside>
        <section class="content">
          <h2>Manage Pricing</h2>
          <div v-if="loading">Loading...</div>
          <div v-if="error" class="error">{{ error }}</div>
          <table v-if="!loading && !error" id="pricingTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Original Price</th>
                <th>Discounted Price</th>
                <th>Features</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pricing in pricings" :key="pricing.id">
                <td>{{ pricing.id }}</td>
                <td>{{ pricing.title }}</td>
                <td>{{ formatPrice(pricing.original_price) }}</td>
                <td>{{ formatPrice(pricing.discounted_price) }}</td>
                <td>
                  <ul>
                    <li v-for="feature in JSON.parse(pricing.features)" :key="feature">{{ feature }}</li>
                  </ul>
                </td>
                <td>
                  <button @click="editPricing(pricing)">Edit</button>
                  <button @click="deletePricing(pricing.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
  
          <!-- Create or Edit Pricing Form -->
          <div v-if="editingPricing || !editingPricing">
            <h3>{{ editingPricing ? 'Edit' : 'Create' }} Pricing</h3>
            <form @submit.prevent="submitPricing">
              <label for="title">Title</label>
              <input type="text" id="title" v-model="formData.title" required />
  
              <label for="originalPrice">Original Price</label>
              <input type="number" id="originalPrice" v-model="formData.originalPrice" required />
  
              <label for="discountedPrice">Discounted Price</label>
              <input type="number" id="discountedPrice" v-model="formData.discountedPrice" required />
  
              <label for="features">Features (comma separated)</label>
              <input type="text" id="features" v-model="formData.features" required />
  
              <button type="submit">{{ editingPricing ? 'Update' : 'Create' }} Pricing</button>
              <button @click="cancelEdit" v-if="editingPricing">Cancel</button>
            </form>
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "PricingPanel",
    data() {
      return {
        loading: false,
        error: "",
        pricings: [],
        editingPricing: null,
        formData: {
          title: "",
          originalPrice: "",
          discountedPrice: "",
          features: "",
        },
      };
    },
    methods: {
      // Function to format price to Indonesian Rupiah format
      formatPrice(price) {
        return "Rp " + parseInt(price).toLocaleString();
      },
  
      // Load pricing data from API
      async loadPricing() {
        this.loading = true;
        this.error = "";
        try {
          const response = await fetch("http://127.0.0.1:8000/api/pricings");
          if (!response.ok) throw new Error("Network response was not ok");
          const pricings = await response.json();
          this.pricings = pricings;
        } catch (error) {
          this.error = "Failed to load pricing data.";
        } finally {
          this.loading = false;
        }
      },
  
      // Edit pricing data
      async editPricing(pricing) {
        this.editingPricing = pricing;
        this.formData = {
          title: pricing.title,
          originalPrice: pricing.original_price,
          discountedPrice: pricing.discounted_price,
          features: pricing.features.join(", "), // Convert array to comma-separated string
        };
      },
  
      // Cancel the edit
      cancelEdit() {
        this.editingPricing = null;
        this.formData = { title: "", originalPrice: "", discountedPrice: "", features: "" };
      },
  
      // Submit form for creating or editing pricing
      async submitPricing() {
        const method = this.editingPricing ? "PUT" : "POST";
        const url = this.editingPricing
          ? `http://127.0.0.1:8000/api/pricings/${this.editingPricing.id}`
          : "http://127.0.0.1:8000/api/pricings";
  
        try {
          const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: this.formData.title,
              original_price: this.formData.originalPrice,
              discounted_price: this.formData.discountedPrice,
              features: this.formData.features.split(",").map((feature) => feature.trim()),
            }),
          });
          if (!response.ok) throw new Error("Network response was not ok");
  
          this.loadPricing(); // Reload the pricing data
          this.cancelEdit(); // Reset form and stop editing mode
        } catch (error) {
          console.error("Failed to save pricing data", error);
        }
      },
  
      // Delete pricing data
      async deletePricing(id) {
        if (confirm("Are you sure you want to delete this pricing plan?")) {
          try {
            await fetch(`http://127.0.0.1:8000/api/pricings/${id}`, { method: "DELETE" });
            this.loadPricing(); // Refresh pricing table after delete
          } catch (error) {
            console.error("Failed to delete pricing", error);
          }
        }
      },
    },
    mounted() {
      this.loadPricing();
    },
  };
  </script>
  