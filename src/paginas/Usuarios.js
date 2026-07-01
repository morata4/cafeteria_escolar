import { useEffect, useState } from "react";
import API from "../api/api";
import NavbarAdmin from "../componentes/NavbarAdmin";

function Usuarios() {

    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const res = await API.get("usuarios/");
            setUsuarios(res.data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    };

    return (
        <>
            <NavbarAdmin />

            <div className="container mt-4">

                <h2 className="fw-bold mb-4">
                    Usuarios Registrados
                </h2>

                <table className="table table-bordered table-striped">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Fecha Registro</th>
                            <th>Activo</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usuarios.length > 0 ? (
                            usuarios.map((u) => (
                                <tr key={u.id_usuario}>
                                    <td>{u.id_usuario}</td>
                                    <td>{u.nombre}</td>
                                    <td>{u.email}</td>
                                    <td>{u.id_rol}</td>
                                    <td>{u.fecha_registro}</td>
                                    <td>{u.activo ? "Sí" : "No"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No hay usuarios registrados
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>

            </div>
        </>
    );
}

export default Usuarios;