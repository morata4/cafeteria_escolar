import { Navigate } from "react-router-dom";

function RutaProtegida({ children, rolPermitido }) {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        return <Navigate to="/login" />;
    }

    if (Number(usuario.id_rol) !== Number(rolPermitido)) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default RutaProtegida;