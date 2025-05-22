import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const fotoGuardada = localStorage.getItem("fotoPerfil");
    if (fotoGuardada) setFotoPerfil(fotoGuardada);

    // Cerrar menú si se hace clic fuera
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="header">
      <img src="/nexus.png" alt="Logo" className="logo" />
      <div className="header-actions">
        <button onClick={() => navigate("/inicio")} className="btn">Inicio</button>
        <button onClick={cerrarSesion} className="btn btn-danger">Cerrar Sesión</button>

        <div className="profile-container" ref={menuRef} onClick={() => setMenuVisible(!menuVisible)}>
          {fotoPerfil ? (
            <img src={fotoPerfil} alt="Perfil" className="profile-pic" />
          ) : (
            <FaUserCircle size={40} className="profile-icon" />
          )}

          {menuVisible && (
            <div className="profile-menu">
              <NavLink to="/perfil" className="profile-link">Mi Perfil</NavLink>
              <NavLink to="/configuracion">Configuración</NavLink>
              <NavLink to="/logout" className="logout">Cerrar Sesión</NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
