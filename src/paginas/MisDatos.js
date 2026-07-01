import NavbarCliente from "../componentes/NavbarCliente";

function MisDatos() {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    return (
        <>
            <NavbarCliente />

            <div className="container mt-4">

                <h2>Mis Datos</h2>

                <div className="card p-4">

                    <p><strong>ID:</strong> {usuario?.id_usuario}</p>
                    <p><strong>Nombre:</strong> {usuario?.nombre}</p>
                    <p><strong>Email:</strong> {usuario?.email}</p>
                    <p><strong>Rol:</strong> {usuario?.id_rol}</p>
                    <p><strong>Fecha Registro:</strong> {usuario?.fecha_registro}</p>
                    <p><strong>Activo:</strong> {usuario?.activo ? "Sí" : "No"}</p>

                </div>

            </div>
        </>
    );
}

export default MisDatos;