import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './Store/Store.js';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Provider store={store} >
        <App />
        <Toaster position="bottom-right" reverseOrder={false} />
      </Provider>
    </BrowserRouter>
)
