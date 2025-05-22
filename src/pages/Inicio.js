import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

// Componente Header
const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [imagenPerfil, setImagenPerfil] = useState(localStorage.getItem("fotoPerfil") || null);

  // Manejar cambio de imagen de perfil
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setImagenPerfil(imageUrl);
        localStorage.setItem("fotoPerfil", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header
      style={{
        width: "97%",
        padding: '1px',
        maxWidth: "1500px",
        margin: "0 auto",
        backgroundColor: "#345475",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        zIndex: 2,
        position: "relative",
      }}
    >
      {/* Logo */}
      <img
        src="/logo_SERMEX_blanco.fw.png"
        alt="Logo"
        style={{ height: "80px", marginRight: "15px" }}
      />

      {/* Contenedor del perfil */}
      <div
        className="profile-container"
        onClick={() => setMenuVisible(!menuVisible)}
        style={{
          position: "relative",
          cursor: "pointer",
          marginLeft: "auto",
          marginRight: "20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Si hay imagen de perfil, mostrarla; si no, mostrar el icono */}
        {imagenPerfil ? (
          <img
            src={imagenPerfil}
            alt="Foto de perfil"
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <FaUserCircle size={40} color="#ffffff" />
        )}

        {/* Menú desplegable */}
        {menuVisible && (
          <div
            className="profile-menu"
            style={{
              position: "absolute",
              top: "50px",
              right: "0",
              backgroundColor: "#ffffff",
              borderRadius: "5px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              minWidth: "150px",
            }}
          >
            {/* Input oculto para subir imagen */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="upload-photo"
            />
            
            <NavLink to="/perfil" className="profile-link" style={{ padding: "5px 10px" }}>
              Mi Perfil
            </NavLink>
            <NavLink to="/configuracion" className="profile-link" style={{ padding: "5px 10px" }}>
              Configuración
            </NavLink>
            <NavLink to="/" className="profile-link" style={{ padding: "5px 10px", color: "red" }}>
              Cerrar Sesión
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
};

// Componente Inicio
const Inicio = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header />

      {/* Contenido principal con video de fondo */}
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Video de fondo */}
        <video
          autoPlay
          loop
          muted
          poster="https://sermex0.github.io/Sermex_Api_Images/sermex_img-video.png"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        >
          <source src="https://sermex0.github.io/Sermex_Api_Images/SERMEX-video..mp4" type="video/mp4" />
        </video>

        {/* Contenido centrado sobre el video */}
        <div
          style={{
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
            padding: "100px",
            borderRadius: "10px",
            zIndex: 1,
          }}
        >
   
          <h2>Centro de Ayuda SERMEX</h2>
          <h6>
          SERMEX ofrece soporte técnico para resolver problemas con tus equipos y optimizar su rendimiento.
          </h6>

          {/* Botón de navegación */}
          <div>
          <button
    onClick={() => navigate("/seleccionar-producto")}
    style={{
      padding: "10px 20px",
      fontSize: "1rem",
      cursor: "pointer",
      backgroundColor: "#fff",
      color: "#345475",
      border: "none",
      borderRadius: "5px",
      marginTop: "15px",
      transition: "background-color 0.3s ease",
    }}
    onMouseOver={(e) => (e.target.style.backgroundColor = "#ddd")}
    onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
  >
    Panel principal
  </button>
</div>

  <div>
  <button
    onClick={() => navigate("/Rma")}
    style={{
      padding: "10px 20px",
      fontSize: "1rem",
      cursor: "pointer",
      backgroundColor: "#fff",
      color: "#345475",
      border: "none",
      borderRadius: "5px",
      marginTop: "15px",
      transition: "background-color 0.3s ease",
    }}
    onMouseOver={(e) => (e.target.style.backgroundColor = "#ddd")}
    onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
  >
    Crear solicitud RMA
  </button>
  </div>

<div>
  <button
    onClick={() => navigate("/logistica")}
    style={{
      padding: "10px 20px",
      fontSize: "1rem",
      cursor: "pointer",
      backgroundColor: "#fff",
      color: "#345475",
      border: "none",
      borderRadius: "5px",
      marginTop: "15px",
      transition: "background-color 0.3s ease",
    }}
    onMouseOver={(e) => (e.target.style.backgroundColor = "#ddd")}
    onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
  >
    Ver seguimiento de reporte
  </button>
  </div>
        </div>
      </div>

      {/* Footer */}
     
     <Footer />
    </div>
  );
};

export default Inicio;
