import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./paginas/Home";
import Login from "./paginas/Login";
import AdminPanel from "./paginas/AdminPanel";
import ClientePanel from "./paginas/ClientePanel";
import Usuarios from "./paginas/Usuarios";
import Categorias from "./paginas/Categorias";
import MisDatos from "./paginas/MisDatos";
import ProductosNuevo from "./paginas/ProductosNuevo";
import ProductosCliente from "./paginas/ProductosCliente";
import RutaProtegida from "./componentes/RutaProtegida";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🟢 PUBLICO */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* 🔴 ADMIN */}
        <Route
          path="/admin"
          element={
            <RutaProtegida rolPermitido={1}>
              <AdminPanel />
            </RutaProtegida>
          }
        />

        <Route
          path="/admin/productos"
          element={
            <RutaProtegida rolPermitido={1}>
              <ProductosNuevo />
            </RutaProtegida>
          }
        />

        <Route
          path="/admin/categorias"
          element={
            <RutaProtegida rolPermitido={1}>
              <Categorias />
            </RutaProtegida>
          }
        />

        <Route
          path="/admin/usuarios"
          element={
            <RutaProtegida rolPermitido={1}>
              <Usuarios />
            </RutaProtegida>
          }
        />

        {/* 🔵 CLIENTE - CORREGIDO */}
        <Route
          path="/cliente"
          element={
            <RutaProtegida rolPermitido={2}>
              <ClientePanel />
            </RutaProtegida>
          }
        />

        <Route
          path="/cliente/productos"
          element={
            <RutaProtegida rolPermitido={2}>
              <ProductosCliente />
            </RutaProtegida>
          }
        />

        <Route
          path="/misdatos"
          element={
            <RutaProtegida rolPermitido={2}>
              <MisDatos />
            </RutaProtegida>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;