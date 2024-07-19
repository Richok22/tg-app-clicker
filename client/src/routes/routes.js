import { createRouter, createWebHistory } from 'vue-router'
import loading from "../views/loading.vue";
import App from "../App.vue";
import restricted from "../views/restricted.vue";
import main from "../views/main.vue";
import tasks from "../views/tasks.vue";
import frens from "../views/frens.vue";


export let routes = [
    {
        path: '/',
        name: 'main',
        component: main
    },
    {
        path: '/loading',
        name: 'loading',
        component: loading
    },
    {
        path: '/restricted',
        name: 'restricted',
        component: restricted
    },
    {
        path: '/tasks',
        name: 'tasks',
        component: tasks
    },
    {
        path: '/frens',
        name: 'frems',
        component: frens
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router