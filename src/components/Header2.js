import { NavLink, useNavigate } from "react-router-dom";
import { FaTools, FaBoxOpen, FaChartLine, FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";

const Header = ({ productos = [] }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fotoGuardada = localStorage.getItem("fotoPerfil");
    if (fotoGuardada) {
      setFotoPerfil(fotoGuardada);
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProductoClick = (producto) => {
    navigate("/detalle-producto", { state: { producto } });
  };

  return (
    <header style={{
  width: "100%", // Cambiado de 97% a 100%
  maxWidth: "1500px",
  background: "linear-gradient(90deg, #345475 70%, #4474B0 100%)",
    color: "#fff",
  margin: "0 auto", // Esto centrará el contenido si la pantalla es más ancha que 1500px
 
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "15px 30px",
  zIndex: 1000,
  position: "sticky",
  top: 0,
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  boxSizing: "border-box" // Añade esto para que el padding no afecte el ancho total
}}>
      {/* Logo con efecto de sombra */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img 
          src="/logo_SERMEX_blanco.fw.png" 
          alt="Logo" 
          style={{ 
            height: "70px", 
            marginRight: "20px",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
          }} 
          onClick={() => navigate("/inicio")}
        />
      </div>

      {/* Navegación principal con estilos mejorados */}
     

      {/* Botones de acción con estilo moderno */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
      }}>
        {/* Botón para seleccionar productos (si es necesario) */}
        {productos.length > 0 && (
          <div style={{ position: "relative" }}>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "30px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "500",
                transition: "all 0.3s ease",
                ":hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderColor: "rgba(255,255,255,0.5)",
                }
              }}
            >
              Seleccionar Producto ▼
            </button>
            {/* Menú desplegable de productos */}
            <div style={{
              position: "absolute",
              right: 0,
              top: "100%",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              minWidth: "200px",
              zIndex: 1001,
              padding: "10px 0",
              display: "none" // Cambiar a 'block' cuando se muestre
            }}>
              {productos.map((producto) => (
                <div 
                  key={producto.id}
                  onClick={() => handleProductoClick(producto)}
                  style={{
                    padding: "10px 20px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    ":hover": {
                      backgroundColor: "#f5f5f5",
                      color: "#005e97"
                    }
                  }}
                >
                  {producto.Nombre}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón de Inicio (mantenido como original) */}
       <button
  onClick={() => navigate(-1)}
          style={{
            padding: "10px 20px",
            backgroundColor: "transparent",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "30px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "500",
            transition: "all 0.3s ease",
            ":hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
              borderColor: "rgba(255,255,255,0.5)",
            }
          }}
        >
          Volver
        </button>

        {/* Botón de Cerrar Sesión (mantenido como original) */}
        <button
          onClick={cerrarSesion}
          style={{
            padding: "10px 20px",
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "30px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "500",
            transition: "all 0.3s ease",
            ":hover": {
              backgroundColor: "rgba(255,69,58,0.2)",
              borderColor: "rgba(255,69,58,0.5)",
            }
          }}
        >
          Cerrar Sesión
        </button>

        {/* Contenedor del perfil */}
        <div
          className="profile-container"
          tabIndex={0}
          onBlur={() => setTimeout(() => setMenuVisible(false), 200)}
          onClick={() => setMenuVisible(!menuVisible)}
          style={{
            position: "relative",
            cursor: "pointer",
            marginLeft: "15px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {fotoPerfil ? (
            <img 
              src={fotoPerfil} 
              alt="Perfil" 
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(255,255,255,0.5)",
                transition: "all 0.3s ease",
                ":hover": {
                  borderColor: "rgba(255,255,255,0.8)",
                }
              }} 
            />
          ) : (
            <FaUserCircle 
              size={45} 
              color="#ffffff" 
              style={{ 
                opacity: 0.8,
                transition: "all 0.3s ease",
                ":hover": {
                  opacity: 1,
                }
              }} 
            />
          )}

          {/* Menú desplegable del perfil */}
          {menuVisible && (
            <div 
              style={{
                position: "absolute",
                top: "60px",
                right: "0",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.15)",
                padding: "10px 0",
                display: "flex",
                flexDirection: "column",
                minWidth: "180px",
                zIndex: 1001,
                overflow: "hidden",
              }}
            >
              <NavLink 
                to="/perfil" 
                style={{
                  padding: "10px 20px",
                  color: "#333",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  ":hover": {
                    backgroundColor: "#f5f5f5",
                    color: "#005e97",
                  }
                }}
                onClick={() => setMenuVisible(false)}
              >
                Mi Perfil
              </NavLink>
              <NavLink 
                to="/configuracion" 
                style={{
                  padding: "10px 20px",
                  color: "#333",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  ":hover": {
                    backgroundColor: "#f5f5f5",
                    color: "#005e97",
                  }
                }}
                onClick={() => setMenuVisible(false)}
              >
                Configuración
              </NavLink>
             
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;


