import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../componentes/NavbarAdmin";

function AdminPanel() {

    const navigate = useNavigate();

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // 🔥 seguridad básica por si no hay usuario
    if (!usuario) {
        return <h3>No hay sesión activa</h3>;
    }

    return (
        <>
            <NavbarAdmin />

            <div className="container mt-4">

                <h1 className="fw-bold mb-2">
                    Panel Administrador
                </h1>

                <p className="text-muted mb-4">
                    Bienvenido {usuario?.nombre}
                </p>

                <div className="row g-4">

                    {/* 🟠 PRODUCTOS */}
                    <div className="col-md-3">
                        <div
                            className="card admin-card shadow-sm h-100"
                            onClick={() => navigate("/admin/productos")}
                        >
                            <div className="card-body text-center">

                                <div className="icon"></div>

                                <h4 className="fw-bold">Productos</h4>
                                <p className="text-muted">
                                    Gestionar productos
                                </p>

                            </div>
                        </div>
                    </div>

                    {/* 🟡 CATEGORIAS */}
                    <div className="col-md-3">
                        <div
                            className="card admin-card shadow-sm h-100"
                            onClick={() => navigate("/admin/categorias")}
                        >
                            <div className="card-body text-center">

                                <div className="icon"></div>

                                <h4 className="fw-bold">Categorías</h4>
                                <p className="text-muted">
                                    Gestionar categorías
                                </p>

                            </div>
                        </div>
                    </div>

                    {/* 🔵 USUARIOS */}
                    <div className="col-md-3">
                        <div
                            className="card admin-card shadow-sm h-100"
                            onClick={() => navigate("/admin/usuarios")}
                        >
                            <div className="card-body text-center">

                                <div className="icon"></div>

                                <h4 className="fw-bold">Usuarios</h4>
                                <p className="text-muted">
                                    Gestionar usuarios
                                </p>

                            </div>
                        </div>
                    </div>

                    {/* 🔴 PEDIDOS */}
                    <div className="col-md-3">
                        <div
                            className="card admin-card shadow-sm h-100"
                            onClick={() => navigate("/admin/pedidos")}
                        >
                            <div className="card-body text-center">

                                <div className="icon"></div>

                                <h4 className="fw-bold">Pedidos</h4>
                                <p className="text-muted">
                                    Gestionar pedidos
                                </p>

                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* 🎨 ESTILOS */}
            <style>{`
                .admin-card {
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border-radius: 15px;
                }

                .admin-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 12px 25px rgba(0,0,0,0.2);
                }

                .icon {
                    font-size: 42px;
                    margin-bottom: 10px;
                }
            `}</style>
        </>
    );
}

export default AdminPanel;