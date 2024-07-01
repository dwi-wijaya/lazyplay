import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './styles/global.css';
import './styles/css/fa.min.css';
import { MotionPlugin } from '@vueuse/motion';
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(MotionPlugin);

app.mount('#app');
