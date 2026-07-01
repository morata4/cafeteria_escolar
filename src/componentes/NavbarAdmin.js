import { Link, useNavigate } from "react-router-dom";

function NavbarAdmin() {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("usuario");
        navigate("/");
    };

    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container">

                <Link
                    className="navbar-brand"
                    to="/admin"
                >
                    Administración Cafetería
                </Link>

                <div>

                    <Link
                        className="btn btn-outline-light me-2"
                        to="/admin/productos"
                    >
                        Productos
                    </Link>

                    <Link
                        className="btn btn-outline-light me-2"
                        to="/categorias"
                    >
                        Categorías
                    </Link>

                    <Link
                        className="btn btn-outline-light me-2"
                        to="/usuarios"
                    >
                        Usuarios
                    </Link>

                    <button
                        className="btn btn-danger"
                        onClick={logout}
                    >
                        Cerrar Sesión
                    </button>

                </div>

            </div>
        </nav>
    );
}

export default NavbarAdmin;