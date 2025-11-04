import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles.css'
import { MotionPlugin } from '@vueuse/motion';
import createCooksyRouter from './router';
import { VueFire, VueFireAuth, VueFireFirestoreOptionsAPI } from 'vuefire';
import { firebaseApp, getFirebaseDb, getFirebaseAuth } from './firebase';


const dbInstance = getFirebaseDb();
const authInstance = getFirebaseAuth();

const app = createApp(App);

const router = createCooksyRouter();


app.use(MotionPlugin);
app.use(router);
app.use(VueFire, {
    firebaseApp,
    modules: [
        VueFireAuth(),
        VueFireFirestoreOptionsAPI(dbInstance as any),
    ],
});

app.mount('#app');
