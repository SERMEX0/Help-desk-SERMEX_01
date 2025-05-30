import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * MEJORA DE ESTILO Y DISEÑO:
 * - Uso de diseño más limpio y profesional con una sola card principal centrada
 * - Avatar con overlay animado al pasar el mouse para cambiar foto
 * - Botones modernos y coherentes
 * - Secciones claras dentro del mismo card, sin scroll adicional
 * - Footer fijo y elegante
 * - Responsive en dispositivos medianos y pequeños
 * - Uso de colores institucionales y sombras suaves
 */

const Perfil = () => {
  const [imagenPerfil, setImagenPerfil] = useState(
    localStorage.getItem("fotoPerfil") || null
  );
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
    <div style={styles.root}>
      {/* Header */}
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
          <div style={headerStyles.profileContainer}>
            {imagenPerfil ? (
              <img
                src={imagenPerfil}
                alt="Perfil"
                style={headerStyles.profileImage}
              />
            ) : (
              <FaUserCircle size={45} color="#ffffff" style={headerStyles.profileIcon} />
            )}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main style={styles.container}>
        <div style={styles.profileCard}>
          {/* Foto y nombre */}
          <div style={styles.avatarSection}>
            <div
              style={styles.avatarWrapper}
              tabIndex={0}
              title="Haz clic para cambiar foto"
            >
              <img
                src={imagenPerfil || "/logo_SERMEX_azul.fw.png"}
                alt="Foto de perfil"
                style={styles.avatar}
              />
              <label htmlFor="fileInput" style={styles.uploadOverlay}>
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ marginBottom: 4 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span style={styles.uploadText}>Cambiar foto</span>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImagenChange}
                  style={styles.fileInput}
                />
              </label>
            </div>
            <h2 style={styles.title}>Configuración de Perfil</h2>
            <p style={styles.subtitle}>Haz clic sobre la imagen para actualizar tu foto de perfil.</p>
          </div>

          {/* Acciones */}
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
          </div>

          {/* Cambiar contraseña */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Contraseña</h3>
            <p style={styles.subtitle}>Actualiza tu contraseña para mantener tu cuenta segura.</p>
            <button
              onClick={() => navigate('/change-password')}
              style={styles.passwordButton}
            >
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const headerStyles = {
  container: {
    width: "97%",
    background: "linear-gradient(90deg, #345475 70%, #4474B0 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 30px",
    minHeight: "70px",
    position: "sticky",
    top: 0,
    zIndex: 10,
    boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    height: "54px",
    cursor: "pointer",
  },
  buttonsContainer: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },
  navButton: {
    padding: "9px 18px",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "22px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background 0.2s",
  },
  logoutButton: {
    padding: "9px 18px",
    background: "rgba(255,255,255,0.13)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "22px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background 0.2s",
  },
  profileContainer: {
    marginLeft: "16px",
    position: "relative",
    cursor: "pointer",
  },
  profileImage: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    background: "#eaeaea"
  },
  profileIcon: {
    opacity: 0.8,
  },
};

const styles = {
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f5f7fa",
  },
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 8px 28px 8px",
  },
  profileCard: {
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 8px 36px rgba(52, 84, 117, 0.10)",
    padding: "38px 30px 36px 30px",
    width: "100%",
    maxWidth: "430px",
    margin: "0 auto",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  },
  avatarSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "8px",
  },
  avatarWrapper: {
    position: "relative",
    width: "140px",
    height: "140px",
    marginBottom: "8px",
    borderRadius: "50%",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(52, 84, 117, 0.09)",
    cursor: "pointer",
    outline: "none",
  },
  avatar: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
    display: "block",
    background: "#f0f3f8",
    border: "2.5px solid #e0e6ed",
  },
  uploadOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "rgba(52, 84, 117, 0.53)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.3s",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "14px",
    pointerEvents: "auto",
    zIndex: 2,
  },
  uploadText: {
    fontSize: "13px",
    marginTop: "3px",
    fontWeight: 500,
    letterSpacing: "-0.5px",
  },
  fileInput: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
    zIndex: 3,
  },
  title: {
    fontSize: "1.45rem",
    fontWeight: "700",
    color: "#27445d",
    marginBottom: "3px",
    marginTop: "6px",
    letterSpacing: "-1px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#61707f",
    marginBottom: "0",
    marginTop: "0",
    fontWeight: 400,
  },
  buttonGroup: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    margin: "16px 0 10px 0",
  },
  primaryButton: {
    padding: "12px 30px",
    background: "linear-gradient(90deg, #345475 70%, #4474B0 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 10px 0 rgba(52, 84, 117, 0.07)",
    transition: "background 0.2s, box-shadow 0.2s",
  },
  secondaryButton: {
    padding: "12px 30px",
    background: "transparent",
    color: "#345475",
    border: "1.5px solid #dfe6e9",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  section: {
    marginTop: "22px",
    borderTop: "1.5px solid #f1f3f6",
    paddingTop: "18px",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: "1.16rem",
    fontWeight: 600,
    color: "#345475",
    marginBottom: "7px",
    marginTop: "0"
  },
  passwordButton: {
    padding: '12px 24px',
    background: 'linear-gradient(90deg, #f8f9fa 80%, #e3eaf3 100%)',
    color: '#345475',
    border: '1.3px solid #345475',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15.5px',
    fontWeight: '600',
    marginTop: '14px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: "0 2px 10px 0 rgba(52, 84, 117, 0.04)",
    transition: "background 0.2s, color 0.2s"
  },
};

// Overlay animación con CSS puro
const styleSheet = `
  .perfil-avatar-wrapper:hover label,
  .perfil-avatar-wrapper:focus label {
    opacity: 1 !important;
    pointer-events: auto;
  }
`;
if (typeof window !== "undefined") {
  // Solo para desarrollo local, no en SSR
  const styleTag = document.getElementById("perfil-style") || document.createElement("style");
  styleTag.id = "perfil-style";
  styleTag.innerHTML = styleSheet;
  document.head.appendChild(styleTag);
}

// Footer elegante y fijo
const Footer = () => (
  <footer style={{
    background: "linear-gradient(90deg, #345475 70%, #4474B0 100%)",
    color: "#fff",
    padding: "18px 0 12px 0",
    textAlign: "center",
    marginTop: "auto",
    fontSize: "1rem",
    fontWeight: 500,
    letterSpacing: "-0.5px",
    boxShadow: "0 -2px 16px rgba(52,84,117,0.03)"
  }}>
    <p style={{ margin: 0 }}>© 2025 - Todos los derechos reservados</p>
  </footer>
);

export default Perfil;