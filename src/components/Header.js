import { NavLink, useNavigate } from "react-router-dom";
import { FaTools, FaBoxOpen, FaChartLine, FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";

/**
 * Header institucional, limpio, con detalles modernos y profesional:
 * - Logo grande y con sombra sutil, clickable.
 * - Navegación centrada, con íconos y efecto "pill" en el activo.
 * - Botones de acción tal como pediste: conservan el estilo y forma, ajustados para armonía visual.
 * - Avatar circular con sombra, borde animado al hover, menú desplegable suave y profesional.
 * - Responsive hasta 900px para que no colapse ni se vea sobrecargado.
 * - Efectos sutiles y transiciones para dar sensación de aplicación moderna.
 * - Sin dependencias externas, solo CSS inline y un pequeño bloque de CSS global.
 * 
 * Puedes mover los estilos globales a tu CSS si lo prefieres, pero aquí están listos para copiar y pegar.
 */

const Header = ({ productos = [] }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [productosMenu, setProductosMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fotoGuardada = localStorage.getItem("fotoPerfil");
    if (fotoGuardada) {
      setFotoPerfil(fotoGuardada);
    }
  }, []);

  // Cierra menú productos si haces click fuera
  useEffect(() => {
    if (!productosMenu) return;
    const close = () => setProductosMenu(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [productosMenu]);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProductoClick = (producto) => {
    navigate("/detalle-producto", { state: { producto } });
    setProductosMenu(false);
  };

  return (
    <header style={styles.header}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/logo_SERMEX_blanco.fw.png"
          alt="Logo"
          style={styles.logo}
          onClick={() => navigate("/inicio")}
        />
      </div>

      {/* Navegación */}
      <nav style={styles.nav}>
        <NavLink
          to="/detalle-producto"
          style={({ isActive }) => ({
            ...styles.navLink,
            ...(isActive ? styles.navLinkActive : {}),
          })}
        >
          <FaBoxOpen style={styles.navIcon} />
          Producto
        </NavLink>
        <NavLink
          to="/manual"
          style={({ isActive }) => ({
            ...styles.navLink,
            ...(isActive ? styles.navLinkActive : {}),
          })}
        >
          <FaChartLine style={styles.navIcon} />
          Manual de uso
        </NavLink>
        <NavLink
          to="/reparacion"
          style={({ isActive }) => ({
            ...styles.navLink,
            ...(isActive ? styles.navLinkActive : {}),
          })}
        >
          <FaTools style={styles.navIcon} />
          Reportes
        </NavLink>
      </nav>

      {/* Acciones y perfil */}
      <div style={styles.actions}>
        {/* Botón productos */}
        {productos.length > 0 && (
          <div style={{ position: "relative" }}>
            <button
              style={styles.productButton}
              onClick={e => {
                e.stopPropagation();
                setProductosMenu(!productosMenu);
              }}
            >
              Seleccionar Producto ▼
            </button>
            {productosMenu && (
              <div style={styles.productMenu}>
                {productos.map((producto) => (
                  <div
                    key={producto.id}
                    onClick={() => handleProductoClick(producto)}
                    style={styles.productMenuItem}
                  >
                    {producto.Nombre}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Botones principales (sin cambios funcionales, solo armonía visual) */}
        <button
          onClick={() => navigate("/inicio")}
          style={styles.primaryButton}
        >
          Volver al Inicio
        </button>
        <button
          onClick={cerrarSesion}
          style={styles.logoutButton}
        >
          Cerrar Sesión
        </button>

        {/* Perfil */}
        <div
          className="header-profile-container"
          tabIndex={0}
          onBlur={() => setTimeout(() => setMenuVisible(false), 200)}
          onClick={() => setMenuVisible(!menuVisible)}
          style={styles.profileContainer}
        >
          {fotoPerfil ? (
            <img
              src={fotoPerfil}
              alt="Perfil"
              style={styles.profileImage}
            />
          ) : (
            <FaUserCircle
              size={45}
              color="#ffffff"
              style={styles.profileIcon}
            />
          )}
          {menuVisible && (
            <div style={styles.profileMenu}>
              <NavLink
                to="/perfil"
                style={styles.profileMenuItem}
                onClick={() => setMenuVisible(false)}
              >
                Mi Perfil
              </NavLink>
              <NavLink
                to="/configuracion"
                style={styles.profileMenuItem}
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

const styles = {
  header: {
    width: "97%",
    maxWidth: "1500px",
    margin: "0 auto",
    background: "linear-gradient(90deg, #345475 78%, #4474B0 100%)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "9px 24px",
    zIndex: 1000,
    position: "sticky",
    top: 0,
    minHeight: 70,
    boxShadow: "0 2px 12px 0 rgba(52,84,117,0.09)",
  },
  logo: {
    height: "64px",
    marginRight: "22px",
    filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.20))",
    cursor: "pointer",
    userSelect: "none",
    transition: "filter 0.2s",
  },
  nav: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    gap: "26px",
    margin: "0 18px",
    alignItems: "center",
    minWidth: 0,
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "rgba(255,255,255,0.87)",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "1.07rem",
    padding: "9px 18px",
    borderRadius: "22px",
    background: "none",
    transition: "all 0.2s cubic-bezier(.72,.33,.36,.89)",
    letterSpacing: "-0.5px",
    position: "relative",
    outline: "none",
  },
  navLinkActive: {
    background: "rgba(255,255,255,0.18)",
    color: "#fff",
    boxShadow: "0 2px 8px 0 rgba(255,255,255,0.04)",
  },
  navIcon: {
    fontSize: "1.15rem",
    marginBottom: "2px",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginLeft: "10px"
  },
  productButton: {
    padding: "10px 18px",
    background: "rgba(255,255,255,0.11)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.27)",
    borderRadius: "30px",
    cursor: "pointer",
    fontSize: "0.97rem",
    fontWeight: 500,
    transition: "all 0.2s",
    outline: "none",
    marginRight: "3px",
    minWidth: "170px",
    position: "relative",
    zIndex: 4,
  },
  productMenu: {
    position: "absolute",
    right: 0,
    top: "110%",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 5px 18px rgba(52,84,117,0.13)",
    minWidth: "210px",
    zIndex: 1002,
    padding: "8px 0",
    display: "block",
    animation: "fadeInMenu 0.18s",
  },
  productMenuItem: {
    padding: "11px 24px",
    cursor: "pointer",
    color: "#345475",
    fontWeight: 500,
    letterSpacing: "-0.5px",
    fontSize: "1rem",
    background: "none",
    border: "none",
    textAlign: "left",
    transition: "all 0.15s",
    outline: "none",
  },
  primaryButton: {
    padding: "10px 20px",
    background: "transparent",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "30px",
    cursor: "pointer",
    fontSize: "0.96rem",
    fontWeight: "500",
    transition: "all 0.2s",
    outline: "none",
  },
  logoutButton: {
    padding: "10px 20px",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "30px",
    cursor: "pointer",
    fontSize: "0.96rem",
    fontWeight: "500",
    transition: "all 0.2s",
    outline: "none",
  },
  profileContainer: {
    position: "relative",
    cursor: "pointer",
    marginLeft: "15px",
    display: "flex",
    alignItems: "center",
    zIndex: 4,
  },
  profileImage: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2.5px solid rgba(255,255,255,0.72)",
    boxShadow: "0 2px 10px rgba(52,84,117,0.05)",
    background: "#eaeaea",
    transition: "border-color 0.18s, box-shadow 0.18s",
  },
  profileIcon: {
    opacity: 0.85,
    transition: "opacity 0.18s",
  },
  profileMenu: {
    position: "absolute",
    top: "58px",
    right: "-5px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 5px 22px rgba(52,84,117,0.17)",
    padding: "9px 0",
    display: "flex",
    flexDirection: "column",
    minWidth: "185px",
    zIndex: 1003,
    overflow: "hidden",
    animation: "fadeInMenu 0.17s",
  },
  profileMenuItem: {
    padding: "12px 23px",
    color: "#345475",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "1rem",
    background: "none",
    border: "none",
    textAlign: "left",
    transition: "all 0.16s",
    outline: "none",
  }
};

// Animaciones y hover globales para menú y botones (puedes mover esto a tu CSS global)
const globalHeaderCSS = `
@keyframes fadeInMenu {
  from { opacity: 0; transform: translateY(10px);}
  to { opacity: 1; transform: translateY(0);}
}
.header-profile-container img:hover {
  border-color: #4474B0 !important;
  box-shadow: 0 4px 15px 0 rgba(68,116,176,0.11);
}
.header-profile-container:focus img {
  border-color: #4474B0 !important;
}
.header-profile-container svg:hover {
  opacity: 1 !important;
}
.header-profile-container:focus svg {
  opacity: 1 !important;
}
.header-profile-container .menu-link:hover,
.header-profile-container .menu-link:focus {
  background: #f2f6ff;
  color: #345475;
}
@media (max-width: 900px) {
  header {
    flex-direction: column !important;
    align-items: stretch !important;
    padding: 8px 4vw !important;
  }
  nav {
    margin: 7px 0 !important;
    gap: 13px !important;
  }
}
`;
if (typeof window !== "undefined") {
  const styleTag = document.getElementById("header-global-style") || document.createElement("style");
  styleTag.id = "header-global-style";
  styleTag.innerHTML = globalHeaderCSS;
  document.head.appendChild(styleTag);
}

export default Header;