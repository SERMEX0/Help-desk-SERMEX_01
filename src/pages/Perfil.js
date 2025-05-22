import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Perfil = () => {
  const [imagenPerfil, setImagenPerfil] = useState(
    localStorage.getItem("fotoPerfil") || null
  );
  const [menuVisible, setMenuVisible] = useState(false);
  const navigate = useNavigate();

  const cerrarSesion = () => {
     localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
    navigate("/login");
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPerfil(reader.result);
        localStorage.setItem("fotoPerfil", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {/* Header corregido */}
      <header style={headerStyles.container}>
        <div style={headerStyles.logoContainer}>
          <img 
            src="/logo_SERMEX_blanco.fw.png" 
            alt="Logo" 
            style={headerStyles.logo} 
            onClick={() => navigate("/inicio")}
          />
        </div>
  
        <div style={headerStyles.buttonsContainer}>
        <button 
        onClick={() => navigate(-1)} 
        style={headerStyles.navButton}
      >
        Volver 
      </button>
  
          <button onClick={cerrarSesion} style={headerStyles.logoutButton}>
            Cerrar Sesión
          </button>
  
          <div 
            onClick={() => setMenuVisible(!menuVisible)} 
            style={headerStyles.profileContainer}
          >
            {imagenPerfil ? (
              <img src={imagenPerfil} alt="Perfil" style={headerStyles.profileImage} />
            ) : (
              <FaUserCircle size={45} color="#ffffff" style={headerStyles.profileIcon} />
            )}
  
           
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div style={styles.container}>
        <div style={styles.profileCard}>
          <div style={styles.header}>
            <h2 style={styles.title}>Configuración de Perfil</h2>
            <p style={styles.subtitle}>Toca la imagen para actualizar tu foto de perfil</p>
          </div>

          <div style={styles.avatarContainer}>
            <div style={styles.avatarWrapper}>
              <img
                src={imagenPerfil || "/logo_SERMEX_azul.fw.png"}
                alt="Foto de perfil"
                style={styles.avatar}
              />
              <div style={styles.uploadOverlay}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span style={styles.uploadText}>Cambiar foto</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
                style={styles.fileInput}
              />
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button
              style={styles.primaryButton}
              onClick={() => navigate("/inicio")}
            >
              Guardar Cambios
            </button>
            <button
              style={styles.secondaryButton}
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
             
</div>  

          </div>
          <h2 style={styles.title}>Contraseñas</h2>
          <p style={styles.subtitle}>Actualiza tu contraseña</p>
  <button
  
  onClick={() => navigate('/change-password')}
  style={{
    padding: '12px 24px',
    backgroundColor: '#f8f9fa',
    color: '#005e97',
    border: '1px solid #005e97',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    marginTop: '20px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  }}
>
 
  Cambiar Contraseña
</button>
        </div>
      </div>




      <Footer />
    </div>
  );
};

// Estilos del header
const headerStyles = {
  container: {
    width: "97%",
    backgroundColor: "#345475",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    height: "60px",
    cursor: "pointer",
  },
  buttonsContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  navButton: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  logoutButton: {
    padding: "8px 16px",
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "20px", // Cambiado a 20px para bordes redondeados
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  profileContainer: {
    position: "relative",
    cursor: "pointer",
    marginLeft: "15px",
  },
  profileImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  profileIcon: {
    opacity: 0.8,
  },
  profileMenu: {
    position: "absolute",
    right: 0,
    top: "50px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    minWidth: "150px",
    zIndex: 1001,
  },
  menuItem: {
    display: "block",
    padding: "10px 15px",
    color: "#333",
    textDecoration: "none",
  },
  menuItemLogout: {
    padding: "10px 15px",
    color: "#e74c3c",
    cursor: "pointer",
  }
};

// Estilos del contenido principal (los mismos que tenías)
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 80px)",
    backgroundColor: "#f5f7fa",
    padding: "20px",
  },
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    padding: "40px",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
  },
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#7f8c8d",
    marginBottom: "0",
  },
  avatarContainer: {
    margin: "30px 0",
    display: "flex",
    justifyContent: "center",
  },
  avatarWrapper: {
    position: "relative",
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    cursor: "pointer",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #e0e6ed",
  },
  uploadOverlay: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  uploadText: {
    fontSize: "12px",
    marginTop: "8px",
    fontWeight: "500",
  },
  fileInput: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
  },
  buttonGroup: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    marginTop: "30px",
  },
  primaryButton: {
    padding: "12px 30px",
    backgroundColor: "#345475",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  secondaryButton: {
    padding: "12px 30px",
    backgroundColor: "transparent",
    color: "#7f8c8d",
    border: "1px solid #dfe6e9",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  
};
const Footer = () => (
  <footer style={{
    backgroundColor: "#345475",
    color: "#fff",
    padding: "20px",
    textAlign: "center",
    marginTop: "auto",
  }}>
    <p>© 2025 - Todos los derechos reservados</p>
  </footer>
);

export default Perfil;