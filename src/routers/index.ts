import { createRouter, createWebHistory } from "vue-router";





const routers = [
    {
		path: "/" ,
		redirect: "/login"
	},
];

const router = createRouter({
    history: createWebHistory(),
    routes: routers
});



export default router;