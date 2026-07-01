import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/",
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