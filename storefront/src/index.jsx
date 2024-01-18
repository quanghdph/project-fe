import { Preloader } from '@/components/common';
import 'normalize.css/normalize.css';
import React, { useEffect } from 'react';
import { render } from 'react-dom';
import 'react-phone-input-2/lib/style.css';
import { onAuthStateFail, onAuthStateSuccess } from '@/redux/actions/authActions';
import configureStore from '@/redux/store/store';
import '@/styles/style.scss';
import WebFont from 'webfontloader';
import App from './App';
import { useSelector } from 'react-redux';
import { setAuthStatus } from '@/redux/actions/miscActions';
// import firebase from '@/services/firebase';


WebFont.load({
  google: {
    families: ['Open Sans']
  }
});

const { store, persistor } = configureStore();
const root = document.getElementById('app');

// Render the preloader on initial load
render(<Preloader />, root);

// firebase.auth.onAuthStateChanged((user) => {
//   if (user) {
//     store.dispatch(onAuthStateSuccess(user));
//   } else {
//     store.dispatch(onAuthStateFail('Failed to authenticate'));
//   }
//   // then render the app after checking the auth state
// });


// if(isAuthenticating) {

// }

const token = localStorage.getItem("access_token");
if(token) {
  setAuthStatus({
    success: true,
    type: "auth",
    isError: false,
    message: "Successfully signed in. Redirecting...",
  })
} else {
  store.dispatch(onAuthStateFail('Failed to authenticate'));
}


render(<App store={store} persistor={persistor} />, root);

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('SW registered: ', registration);
    }).catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
