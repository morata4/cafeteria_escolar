import { useEffect, useState } from "react";
import API from "../api/api";
import NavbarCliente from "../componentes/NavbarCliente";

function ProductosCliente() {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const [productos, setProductos] = useState([]);

    // ✅ carrito persistente
    const [carrito, setCarrito] = useState(() => {
        const saved = localStorage.getItem("carrito");
        return saved ? JSON.parse(saved) : [];
    });

    const [mostrarCarrito, setMostrarCarrito] = useState(false);

    useEffect(() => {
        cargarProductos();
    }, []);

    // guardar carrito
    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    const cargarProductos = async () => {
        try {
            const res = await API.get("productos/");
            setProductos(res.data);
        } catch (error) {
            console.error("Error cargando productos:", error);
        }
    };

    // 🔥 stock real = stock backend - cantidad en carrito
    const getStockDisponible = (producto) => {
        const item = carrito.find(i => i.id_producto === producto.id_producto);
        return item ? producto.stock - item.cantidad : producto.stock;
    };

    const agregarAlCarrito = (producto) => {
        const stockDisponible = getStockDisponible(producto);

        if (stockDisponible <= 0) {
            alert("Sin stock disponible");
            return;
        }

        const enCarrito = carrito.find(i => i.id_producto === producto.id_producto);

        if (enCarrito) {
            setCarrito(carrito.map(i =>
                i.id_producto === producto.id_producto
                    ? { ...i, cantidad: i.cantidad + 1 }
                    : i
            ));
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
    };

    const cambiarCantidad = (id_producto, nuevaCantidad) => {
        const item = carrito.find(i => i.id_producto === id_producto);
        const producto = productos.find(p => p.id_producto === id_producto);

        if (!item || !producto) return;

        if (nuevaCantidad < 1) {
            eliminarTodoDelCarrito(id_producto);
            return;
        }

        const stockDisponible = getStockDisponible(producto);
        const diff = nuevaCantidad - item.cantidad;

        if (diff > 0 && stockDisponible < diff) {
            alert("No hay suficiente stock");
            return;
        }

        setCarrito(carrito.map(i =>
            i.id_producto === id_producto
                ? { ...i, cantidad: nuevaCantidad }
                : i
        ));
    };

    const eliminarTodoDelCarrito = (id_producto) => {
        setCarrito(carrito.filter(i => i.id_producto !== id_producto));
    };

    const calcularTotal = () =>
        carrito.reduce((total, item) =>
            total + Number(item.precio) * item.cantidad, 0
        );

    const realizarCompra = async () => {
        if (carrito.length === 0) return;

        if (!usuario) {
            alert("Debes iniciar sesión para comprar");
            return;
        }

        try {
            const payload = {
                id_usuario: usuario.id_usuario,
                productos: carrito.map(item => ({
                    id_producto: item.id_producto,
                    cantidad: item.cantidad
                }))
            };

            const res = await API.post("pedidos/comprar/", payload);
            console.log("COMPRA OK:", res.data);

            alert("¡Compra realizada con éxito! 🛒💳");

            setCarrito([]);
            localStorage.removeItem("carrito");

            setMostrarCarrito(false);
            cargarProductos();

        } catch (error) {
            console.error("ERROR COMPRA:", error.response?.data || error);
            alert(
                error.response?.data?.detail ||
                error.response?.data?.error ||
                "Error al realizar compra"
            );
        }
    };

    return (
        <>
            <NavbarCliente />

            <div className="container mt-3 d-flex justify-content-end">
                <button className="btn cart-btn" onClick={() => setMostrarCarrito(true)}>
                    Carrito ({carrito.reduce((t, i) => t + i.cantidad, 0)})
                </button>
            </div>

            <div className="container mt-4">
                <h2 className="title">Tienda de Productos</h2>

                <div className="row">
                    {productos.map((p) => {
                        const stockDisponible = getStockDisponible(p);

                        return (
                            <div className="col-md-4 mb-4" key={p.id_producto}>
                                <div className="card product-card">

                                    {p.imagen && (
                                        <img
                                            src={p.imagen}
                                            className="card-img-top product-img"
                                            alt={p.nombre}
                                        />
                                    )}

                                    <div className="card-body">
                                        <h5 className="product-name">{p.nombre}</h5>
                                        <p className="desc">{p.descripcion}</p>
                                        <p className="price">${p.precio}</p>

                                        <p className="stock">
                                            Stock disponible: {stockDisponible}
                                        </p>

                                        <button
                                            className="btn add-btn"
                                            onClick={() => agregarAlCarrito(p)}
                                            disabled={stockDisponible <= 0}
                                        >
                                            {stockDisponible <= 0 ? "Sin stock" : "Agregar"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CARRITO */}
            {mostrarCarrito && (
                <div className="cart-overlay">
                    <div className="cart-panel">

                        <div className="d-flex justify-content-between align-items-center">
                            <h4>Carrito</h4>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => setMostrarCarrito(false)}
                            >
                                ❌
                            </button>
                        </div>

                        <hr />

                        {carrito.length === 0 ? (
                            <p>Carrito vacío</p>
                        ) : (
                            <ul className="list-group">
                                {carrito.map((item) => (
                                    <li key={item.id_producto} className="list-group-item">

                                        <b>{item.nombre}</b>

                                        <div className="d-flex align-items-center mt-2 gap-2">

                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() =>
                                                    cambiarCantidad(item.id_producto, item.cantidad - 1)
                                                }
                                            >
                                                −
                                            </button>

                                            <input
                                                type="number"
                                                min="1"
                                                value={item.cantidad}
                                                onChange={(e) =>
                                                    cambiarCantidad(
                                                        item.id_producto,
                                                        parseInt(e.target.value) || 1
                                                    )
                                                }
                                                className="form-control text-center"
                                                style={{ width: "60px" }}
                                            />

                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() =>
                                                    cambiarCantidad(item.id_producto, item.cantidad + 1)
                                                }
                                            >
                                                +
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    eliminarTodoDelCarrito(item.id_producto)
                                                }
                                            >
                                                ❌
                                            </button>

                                            <small className="ms-1">
                                                ${item.precio} ={" "}
                                                <b>
                                                    ${(Number(item.precio) * item.cantidad).toFixed(2)}
                                                </b>
                                            </small>

                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <hr />

                        <h5 className="total">
                            Total: ${calcularTotal().toFixed(2)}
                        </h5>

                        <button
                            className="btn btn-success w-100 mt-3 fw-bold"
                            onClick={realizarCompra}
                            disabled={carrito.length === 0}
                        >
                            Comprar
                        </button>

                    </div>
                </div>
            )}

            <style>{`
                body { font-family: 'Poppins', sans-serif; background: #f6f7fb; }
                .title { text-align: center; font-weight: 700; margin-bottom: 20px; }
                .product-card { border: none; border-radius: 18px; overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,0.1); }
                .product-img { width: 100%; height: 200px; object-fit: contain; }
                .price { font-size: 20px; font-weight: 700; color: #28a745; }
                .add-btn { width: 100%; background: #4f46e5; color: white; }
                .cart-btn { background: #111827; color: white; border-radius: 30px; padding: 10px 20px; }
                .cart-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); }
                .cart-panel { position: absolute; right: 0; top: 0; width: 420px; height: 100%; background: white; padding: 20px; overflow-y: auto; }
                .total { text-align: right; font-weight: bold; color: #28a745; }
            `}</style>
        </>
    );
}

export default ProductosCliente;
