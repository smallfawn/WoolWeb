import { createRouter, createWebHashHistory } from 'vue-router';

import Default from "../components/Default.vue";
import Login from '../components/Login.vue';
import Admin from '../components/Admin.vue';

const routes = [
    { path: '/', component: Default },
    { path: '/Login', component: Login },
    { path: '/Admin', component: Admin }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;