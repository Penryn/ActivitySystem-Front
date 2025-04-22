import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { login, reg, home, createActivity, mine, signUp, info } from "../pages";
import pinia from '@/stores/createPinia'
import { useMainStore } from "@/stores";

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
    },
    {
        path: "/activity/create",
        name: "create-activity",
        component: createActivity
    },
    {
        path: "/user/activities",
        name: "mine",
        component: mine
    },
    {
        path: "/user/signUps",
        name: "signUp",
        component: signUp
    },
    {
        path: "/user/info",
        name: "info",
        component: info
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routers
});


router.beforeEach((to, from, next) => {
    const loginStore = useMainStore(pinia).useLoginStore(pinia)
    const isAuthenticated = loginStore.loginSession
    const isAuthPage = to.path === '/login' || to.path === '/reg'

    // 如果用户未登录且访问非登录/注册页面，重定向到登录页
    if (!isAuthenticated && !isAuthPage) {
        next('/login')
        return
    }

    // 如果用户已登录且访问登录/注册页面，重定向到首页
    if (isAuthenticated && isAuthPage) {
        next('/home')
        return
    }

    // 其他情况正常放行
    next()
})

export default router;