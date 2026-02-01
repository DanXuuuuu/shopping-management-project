import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store/index';
window.addEventListener('unhandledrejection', event=>{
  if(event.reason?.message?.includes('listener indicated')||
event.reason?.message?.includdes('message channel closed')){
  event.preventDefault();
  return;
}
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
