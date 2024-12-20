import { createRouter, createWebHistory } from "vue-router";
import AdminPanel from "../components/AdminPanel.vue";
import PricingPanel from "../components/PricingPanel.vue";

const routes = [
    { path: "/", redirect: "/services" },
    { path: "/services", component: AdminPanel },
    { path: "/pricing", component: PricingPanel },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
