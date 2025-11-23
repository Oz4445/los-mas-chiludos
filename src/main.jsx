import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/global.css'

import App from './App'

// Cliente
import Home from './pages/cliente/Home'
import Menu from './pages/cliente/Menu'
import Reservas from './pages/cliente/Reservas'
import Ordenar from './pages/cliente/Ordenar'
import MisReservas from './pages/cliente/MisReservas'
import MisPedidos from './pages/cliente/MisPedidos'
import Nosotros from './pages/cliente/Nosotros'
import Contacto from './pages/cliente/Contacto'
import Login from './pages/cliente/Login'
import Signup from './pages/cliente/Signup'
import Recuperar from './pages/cliente/Recuperar'

// Mesero
import Mesas from './pages/mesero/Mesas'
import Ordenes from './pages/mesero/Ordenes'
import ReservasMesero from './pages/mesero/Reservas'

// Admin
import Dashboard from './pages/admin/Dashboard'
import MenuAdmin from './pages/admin/MenuAdmin'
import ReservasAdmin from './pages/admin/ReservasAdmin'
import ReservasCanceladas from './pages/admin/ReservasCanceladas'   // ⭐ NUEVO
import OrdenesAdmin from './pages/admin/OrdenesAdmin'
import Usuarios from './pages/admin/Usuarios'
import Ajustes from './pages/admin/Ajustes'

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // 🌐 Públicas (sin sesión)
      { index: true, element: <Home /> },
      { path: 'menu', element: <Menu /> },
      { path: 'nosotros', element: <Nosotros /> },
      { path: 'contacto', element: <Contacto /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'recuperar', element: <Recuperar /> },

      // 👥 Cliente
      { path: 'reservas', element: <ProtectedRoute roles={['cliente','mesero','admin']}><Reservas /></ProtectedRoute> },
      { path: 'ordenar', element: <ProtectedRoute roles={['cliente','mesero','admin']}><Ordenar /></ProtectedRoute> },
      { path: 'mis-reservas', element: <ProtectedRoute roles={['cliente','mesero','admin']}><MisReservas /></ProtectedRoute> },
      { path: 'mis-pedidos', element: <ProtectedRoute roles={['cliente','mesero','admin']}><MisPedidos /></ProtectedRoute> },

      // 🍽 Mesero
      { path: 'mesero/mesas', element: <ProtectedRoute roles={['mesero','admin']}><Mesas /></ProtectedRoute> },
      { path: 'mesero/ordenes', element: <ProtectedRoute roles={['mesero','admin']}><Ordenes /></ProtectedRoute> },
      { path: 'mesero/reservas', element: <ProtectedRoute roles={['mesero','admin']}><ReservasMesero /></ProtectedRoute> },

      // 🧭 Admin
      { path: 'admin', element: <ProtectedRoute roles={['admin']}><Dashboard /></ProtectedRoute> },
      { path: 'admin/menu', element: <ProtectedRoute roles={['admin']}><MenuAdmin /></ProtectedRoute> },
      { path: 'admin/reservas', element: <ProtectedRoute roles={['admin']}><ReservasAdmin /></ProtectedRoute> },

      // ⭐ NUEVO — HISTORIAL DE CANCELADAS
      { path: 'admin/reservas/canceladas', element: <ProtectedRoute roles={['admin']}><ReservasCanceladas /></ProtectedRoute> },

      { path: 'admin/ordenes', element: <ProtectedRoute roles={['admin']}><OrdenesAdmin /></ProtectedRoute> },
      { path: 'admin/usuarios', element: <ProtectedRoute roles={['admin']}><Usuarios /></ProtectedRoute> },
      { path: 'admin/ajustes', element: <ProtectedRoute roles={['admin']}><Ajustes /></ProtectedRoute> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)
