import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/index.css'
import router from './router'
import TitleUtil from './utils/route/TitleUtil.js'

TitleUtil.handle(router)
const app = createApp(App);
app.use(router)
app.mount('#app')
