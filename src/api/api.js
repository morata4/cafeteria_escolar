import axios from "axios";

// Usa la URL de producción (Railway) si existe la variable de entorno,
// si no, usa localhost para cuando trabajes en tu computadora
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhmysql://root:yoeLFkyCogZdtTvBhIovXnPFzSDGITpT@reseau.proxy.rlwy.net:36605/railwayost:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 INTERCEPTOR PARA EVITAR CRASHES Y VER ERRORES CLAROS
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ ERROR API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// 🟢 OBTENER CATEGORÍAS
export const getCategorias = async () => {
  try {
    const res = await API.get("categorias/");
    return res.data;
  } catch (error) {
    console.error("Error getCategorias:", error);
    return [];
  }
};

// 🟢 OBTENER PRODUCTOS
export const getProductos = async () => {
  try {
    const res = await API.get("productos/");
    return res.data;
  } catch (error) {
    console.error("Error getProductos:", error);
    return [];
  }
};

export default API;