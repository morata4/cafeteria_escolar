import { useEffect, useState } from "react";
import { getCategorias } from "../api/api";
import NavbarAdmin from "../componentes/NavbarAdmin";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    getCategorias().then(setCategorias);
  }, []);

  return (
    <>
      <NavbarAdmin />

      <div className="container mt-4">

        <h1 className="fw-bold mb-4">
          Categorías Registradas
        </h1>

        <hr />

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>IDENTIFICACIÓN</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Activo</th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id_categoria}>
                <td>{cat.id_categoria}</td>
                <td>{cat.nombre}</td>
                <td>{cat.descripcion}</td>
                <td>{cat.activo ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </>
  );
}