import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import { StyledEngineProvider } from '@mui/material/styles'
import { CssBaseline, GlobalStyles } from '@mui/material'
import { App } from '@/app/App'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <StyledEngineProvider injectFirst>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: 'auto' } }} />
          <App />
          <ToastContainer />
        </StyledEngineProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
