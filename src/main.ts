import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import App from './App.vue'
import "element-plus/dist/index.css";
import pinia from './stores/createPinia'
import router from "./routers/index";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(ElementPlus);


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount("#app");