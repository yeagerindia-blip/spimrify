import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router"
import {Provider} from "react-redux"
import { store } from '../redux/store.js'
import UserContext from './pages/userContext..jsx'
createRoot(document.getElementById('root')).render(
  <UserContext>
  <BrowserRouter>
    <Provider store={store}>
    <App />
    </Provider>
  </BrowserRouter>
  </UserContext>
)
