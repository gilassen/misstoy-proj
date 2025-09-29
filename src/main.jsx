import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

import './assets/styles/main.css'
import { store } from './store/store.js'
import { RootCmp } from './RootCmp.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <RootCmp />
      </Router>
    </Provider>
  </React.StrictMode>,
)
