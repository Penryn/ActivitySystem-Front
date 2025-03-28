import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import {login, reg, home} from "../pages";


const routers: RouteRecordRaw[] = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        name: "login",
        component: login
    },
    {
        path: "/reg",
        name: "reg",
        component: reg
    },
    {
        path: "/home",
        name: "home",
        component: home
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routers
});


export default router;