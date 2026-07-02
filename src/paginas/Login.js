import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const login = async () => {
        try {
            const res = await API.get("usuarios/");
            const usuarios = res.data;

            const user = usuarios.find(
                (u) =>
                    u.email.trim() === email.trim() &&
                    u.password.trim() === password.trim()
            );

            if (!user) {
                alert("Credenciales incorrectas");
                return;
            }

            // Obtener el rol correctamente
            const rol = user.id_rol?.id_rol ?? user.id_rol;

            // Guardar usuario con la propiedad "rol"
            const usuarioGuardado = {
                ...user,
                rol: rol,
            };

            localStorage.setItem(
                "usuario",
                JSON.stringify(usuarioGuardado)
            );

            alert("Inicio de sesión correcto");

            // Redireccionar según el rol
            if (Number(rol) === 1) {
                navigate("/admin", { replace: true });
            } else if (Number(rol) === 2) {
                navigate("/cliente", { replace: true });
            } else {
                alert("Rol no reconocido");
                localStorage.removeItem("usuario");
                navigate("/login", { replace: true });
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al conectar con el servidor");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4" style={{ width: "400px" }}>
                <div className="text-center mb-4">
                    <h3 className="text-success">Cafetería Escolar</h3>
                    <p className="text-muted">
                        Iniciar Sesión para continuar
                    </p>
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="correo@escuela.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="d-grid">
                    <button
                        className="btn btn-success btn-lg"
                        onClick={login}
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;