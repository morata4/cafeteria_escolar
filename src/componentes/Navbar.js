import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    Cafeteria Escolar
                </Link>

                <div>
                    <Link className="btn btn-light" to="/login">
                        Iniciar Sesion
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;