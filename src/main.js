import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'
import TitleUtil from './utils/route/TitleUtil.js'
// import the styling for the toast

TitleUtil.handle(router)
createApp(App).use(router).mount('#app')
