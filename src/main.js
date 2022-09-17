import { createApp } from 'vue';
import App from './App.vue';
import AmplifyVue from '@aws-amplify/ui-vue';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
Auth.configure(awsconfig);

console.log('version 1.3')

const app = createApp(App);
app.use(AmplifyVue);
app.mount('#app');