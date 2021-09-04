import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'
import TitleUtil from './utils/route/TitleUtil.js'
// import the styling for the toast

TitleUtil.handle(router)
const app = createApp(App);
app.use(router)
app.mount('#app')
