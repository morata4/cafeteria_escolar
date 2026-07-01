import { useEffect, useRef, useState } from "react";
import API from "../api/api";
import NavbarAdmin from "../componentes/NavbarAdmin";
import { Modal } from "bootstrap";

function ProductosNuevo() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const modalRef = useRef(null);

  const [nuevoProducto, setNuevoProducto] = useState({
    id_producto: null,
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: "",
    id_categoria: "",
    activo: 1,
  });

  // ── INIT MODAL ─────────────────────────────
  useEffect(() => {
    const el = document.getElementById("modalProducto");
    modalRef.current = new Modal(el, { backdrop: "static" });

    cargarProductos();
    cargarCategorias();
  }, []);

  // ── LOAD DATA ─────────────────────────────
  const cargarProductos = async () => {
    try {
      const r = await API.get("productos/");
      setProductos(r.data);
    } catch (e) {
      console.error(e);
    }
  };

  const cargarCategorias = async () => {
    try {
      const r = await API.get("categorias/");
      setCategorias(r.data);
    } catch (e) {
      console.error(e);
    }
  };

  // ── RESET FORM ─────────────────────────────
  const limpiarFormulario = () => {
    setModoEdicion(false);
    setNuevoProducto({
      id_producto: null,
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      imagen: "",
      id_categoria: "",
      activo: 1,
    });
  };

  // ── OPEN MODAL ─────────────────────────────
  const abrirModalNuevo = () => {
    limpiarFormulario();
    modalRef.current.show();
  };

  const seleccionarProducto = (p) => {
    setModoEdicion(true);
    setNuevoProducto({
      id_producto: p.id_producto,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      stock: p.stock,
      imagen: p.imagen || "",
      id_categoria: p.id_categoria,
      activo: p.activo,
    });
    modalRef.current.show();
  };

  const cerrarModal = () => {
    modalRef.current.hide();
    limpiarFormulario();
  };

  // ── VALIDATE ─────────────────────────────
  const validar = () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.stock || !nuevoProducto.id_categoria) {
      alert("Completa los campos obligatorios");
      return false;
    }
    return true;
  };

  // ── SAVE ─────────────────────────────
  const guardarProducto = async () => {
    if (!validar()) return;

    const datos = {
      nombre: nuevoProducto.nombre.trim(),
      descripcion: nuevoProducto.descripcion.trim(),
      precio: parseFloat(nuevoProducto.precio),
      stock: parseInt(nuevoProducto.stock),
      imagen: nuevoProducto.imagen.trim(),
      id_categoria: parseInt(nuevoProducto.id_categoria),
      activo: 1,
    };

    try {
      await API.post("productos/", datos);
      alert("Producto agregado");
      cerrarModal();
      cargarProductos();
    } catch (e) {
      console.error(e);
    }
  };

  // ── UPDATE ─────────────────────────────
  const actualizarProducto = async () => {
    if (!validar()) return;

    const datos = {
      nombre: nuevoProducto.nombre.trim(),
      descripcion: nuevoProducto.descripcion.trim(),
      precio: parseFloat(nuevoProducto.precio),
      stock: parseInt(nuevoProducto.stock),
      imagen: nuevoProducto.imagen.trim(),
      id_categoria: parseInt(nuevoProducto.id_categoria),
      activo: nuevoProducto.activo,
    };

    try {
      await API.put(`productos/${nuevoProducto.id_producto}/`, datos);
      alert("Producto actualizado");
      cerrarModal();
      cargarProductos();
    } catch (e) {
      console.error(e);
    }
  };

  // ── DELETE ─────────────────────────────
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;

    try {
      await API.delete(`productos/${id}/`);
      setProductos(productos.filter(p => p.id_producto !== id));
      alert("Producto eliminado");
    } catch (e) {
      console.error(e);
    }
  };

  // ── UI ─────────────────────────────
  return (
    <div>
      <NavbarAdmin />

      <div className="container mt-4">
        <h2>Administración de Productos</h2>

        <button className="btn btn-success mb-3" onClick={abrirModalNuevo}>
          + Agregar Producto
        </button>

        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">Sin productos</td>
              </tr>
            ) : (
              productos.map((p) => (
                <tr key={p.id_producto}>
                  <td>{p.id_producto}</td>

                  <td>
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px"
                      }}
                    />
                  </td>

                  <td>{p.nombre}</td>
                  <td>${p.precio}</td>
                  <td>{p.stock}</td>

                  <td>
                    <button className="btn btn-warning btn-sm me-2"
                      onClick={() => seleccionarProducto(p)}>
                      Editar
                    </button>

                    <button className="btn btn-danger btn-sm"
                      onClick={() => eliminarProducto(p.id_producto)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <div className="modal fade" id="modalProducto" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">

            <div className="modal-header bg-success text-white">
              <h5>{modoEdicion ? "Editar Producto" : "Nuevo Producto"}</h5>
              <button className="btn-close btn-close-white" onClick={cerrarModal}></button>
            </div>

            <div className="modal-body">

              <input className="form-control mb-2"
                placeholder="Nombre"
                value={nuevoProducto.nombre}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
              />

              <textarea className="form-control mb-2"
                placeholder="Descripción"
                value={nuevoProducto.descripcion}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
              />

              <input className="form-control mb-2"
                placeholder="Precio"
                type="number"
                value={nuevoProducto.precio}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
              />

              <input className="form-control mb-2"
                placeholder="Stock"
                type="number"
                value={nuevoProducto.stock}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })}
              />

              <input className="form-control mb-2"
                placeholder="URL Imagen"
                value={nuevoProducto.imagen}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, imagen: e.target.value })}
              />

              <select className="form-select"
                value={nuevoProducto.id_categoria}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, id_categoria: e.target.value })}>
                <option value="">Categoria</option>
                {categorias.map(cat => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>

            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={cerrarModal}>Cancelar</button>

              {modoEdicion ? (
                <button className="btn btn-warning" onClick={actualizarProducto}>
                  Actualizar
                </button>
              ) : (
                <button className="btn btn-success" onClick={guardarProducto}>
                  Guardar
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductosNuevo;