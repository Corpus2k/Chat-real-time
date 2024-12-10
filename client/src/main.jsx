import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppWithApolloProvider from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWithApolloProvider />
  </StrictMode>,
)
