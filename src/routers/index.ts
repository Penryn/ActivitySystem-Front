import {createRouter, createWebHistory} from "vue-router";
import {login} from "../pages";


const routers = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        name: "login",
        component: login
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes: routers
});


export default router;