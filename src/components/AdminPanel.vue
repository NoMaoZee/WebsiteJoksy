<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// State untuk data services
const services = ref([]);
const loading = ref(true);
const error = ref("");

// State untuk Form
const serviceId = ref(null);
const name = ref("");
const price = ref("");
const image = ref("");

// Fetch data dari API Laravel
const fetchServices = async () => {
  loading.value = true;
  error.value = "";
  try {
    const response = await axios.get("http://localhost:8000/api/services");
    services.value = response.data;
  } catch (err) {
    error.value = "Gagal memuat data!";
  } finally {
    loading.value = false;
  }
};

// Tambah atau Update Service
const saveService = async () => {
  try {
    if (serviceId.value) {
      // Update Service
      await axios.put(`http://localhost:8000/api/services/${serviceId.value}`, {
        name: name.value,
        price: price.value,
        image: image.value,
      });
    } else {
      // Create Service
      await axios.post("http://localhost:8000/api/services", {
        name: name.value,
        price: price.value,
        image: image.value,
      });
    }
    fetchServices();
    resetForm();
  } catch (err) {
    error.value = "Gagal menyimpan data!";
  }
};

// Hapus Service
const deleteService = async (id) => {
  try {
    await axios.delete(`http://localhost:8000/api/services/${id}`);
    fetchServices();
  } catch (err) {
    error.value = "Gagal menghapus data!";
  }
};

// Mengisi Form untuk Update
const editService = (service) => {
  serviceId.value = service.id;
  name.value = service.name;
  price.value = service.price;
  image.value = service.image;
};

// Reset Form
const resetForm = () => {
  serviceId.value = null;
  name.value = "";
  price.value = "";
  image.value = "";
};

// Fetch data ketika komponen di-mount
onMounted(() => {
  fetchServices();
});
</script>

<template>
  <div class="admin-container">
    <header class="admin-header">
      <h1>Admin Panel</h1>
      <router-link to="/">Kembali ke Home</router-link>
    </header>
    <div class="admin-main">
      <aside class="sidebar">
        <nav>
          <ul>
            <li><router-link to="/services">Services</router-link></li>
            <li><router-link to="/pricing">Pricing</router-link></li>
            <li><a href="#orders">Orders</a></li>
            <li><a href="#users">Users</a></li>
            <li><a href="#settings">Settings</a></li>
          </ul>
        </nav>

      </aside>
      <section class="content">
        <h2>Daftar Penjoki</h2>

        <!-- Loading -->
        <div id="loading" v-if="loading">Loading...</div>
        <!-- Error -->
        <div id="error" v-if="error">{{ error }}</div>

        <!-- Tabel Data -->
        <table id="servicesTable" v-if="!loading && !error">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in services" :key="service.id">
              <td>{{ service.id }}</td>
              <td>{{ service.name }}</td>
              <td>{{ service.price }}</td>
              <td>
                <img :src="service.image" alt="Service Image" width="100" />
              </td>
              <td>
                <button @click="editService(service)">Edit</button>
                <button @click="deleteService(service.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Formulir untuk Tambah/Update -->
        <div class="form-section">
          <h2>Tambah atau Update Service</h2>
          <form @submit.prevent="saveService">
            <div>
              <label for="name">Name:</label>
              <input type="text" id="name" v-model="name" required />
            </div>
            <div>
              <label for="price">Price:</label>
              <input type="number" id="price" v-model="price" required />
            </div>
            <div>
              <label for="image">Image URL:</label>
              <input type="text" id="image" v-model="image" required />
            </div>
            <button type="submit">{{ serviceId ? "Update" : "Create" }}</button>
            <button type="button" @click="resetForm">Reset</button>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/admin.css';
</style>
