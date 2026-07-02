import { Link, useNavigate } from "react-router-dom";

function NavbarCliente() {
    const navigate = useNavigate();

    let usuario = null;

    try {
        usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    } catch (error) {
        usuario = null;
    }

    const cerrarSesion = () => {
        localStorage.removeItem("usuario");
        localStorage.removeItem("carrito");
        navigate("/login", { replace: true });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            <Link className="navbar-brand" to="/cliente">
                Cafetería
            </Link>

            <div className="ms-auto d-flex align-items-center gap-3">

                {usuario ? (
                    <>
                        <span className="text-white">
                            👤 {usuario.nombre || "Usuario"}
                        </span>

                        <Link className="btn btn-outline-light btn-sm" to="/cliente/productos">
                            Productos
                        </Link>

                        <Link className="btn btn-outline-light btn-sm" to="/misdatos">
                            Mis datos
                        </Link>

                        <button
                            className="btn btn-danger btn-sm"
                            onClick={cerrarSesion}
                        >
                            Cerrar sesión
                        </button>
                    </>
                ) : (
                    <Link className="btn btn-success btn-sm" to="/login">
                        Login
                    </Link>
                )}

            </div>
        </nav>
    );
}

export default NavbarCliente;