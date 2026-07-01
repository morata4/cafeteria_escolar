import { Navigate } from "react-router-dom";

function RutaProtegida({ children, rolPermitido }) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    const rol = usuario.rol ?? usuario.id_rol?.id_rol ?? usuario.id_rol;

    if (Number(rol) !== Number(rolPermitido)) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default RutaProtegida;