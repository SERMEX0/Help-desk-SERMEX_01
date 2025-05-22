import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "../components/Header2";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Verificar si hay sesión activa
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/change-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          currentPassword, 
          newPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || "Error al cambiar contraseña";
        throw new Error(
          typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg
        );
      }
      setSuccess("¡Contraseña cambiada exitosamente!");
      setTimeout(() => navigate("/perfil"), 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Header />
      
      <div style={styles.card}>
        <h2 style={styles.labelTitle}>Cambia tu contraseña para mejorar la seguridad de tu cuenta.</h2>

        <div style={styles.iconContainer}>
          <img 
            src="/logo_SERMEX_azul.fw.png" 
            alt="Logo" 
            style={{ 
              height: "100px", 
              marginRight: "50px",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
            }} 
            onClick={() => navigate("/inicio")}
          />
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}
        {success && <div style={styles.successMessage}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña Actual</label>
            <div style={styles.passwordContainer}>
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                style={styles.input}
                placeholder="Ingresa tu contraseña actual"
              />
              <span 
                style={styles.eyeIcon}
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Nueva Contraseña</label>
            <div style={styles.passwordContainer}>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                minLength="6"
              />
              <span 
                style={styles.eyeIcon}
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirmar Nueva Contraseña</label>
            <div style={styles.passwordContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={styles.input}
                placeholder="Repite tu nueva contraseña"
                minLength="6"
              />
              <span 
                style={styles.eyeIcon}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={loading ? styles.buttonDisabled : styles.button}
          >
            {loading ? "Cambiando..." : "Cambiar Contraseña"}
          </button>
      
          <div style={styles.footer}>
  <p style={styles.footerText}>
    ¿Quieres restablecer tu contraseña?{' '}
    <a 
      href="#"
      onClick={(e) => {
        e.preventDefault();
        const phoneNumber = "524434368655";
        
        const message = `¡Hola! Necesito ayuda para restablecer mi contraseña.



Por favor indíquenme cómo proceder para recuperar mi acceso.`;
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
      }}
      style={styles.link}
    >
      Contacta al administrador
    </a>
  </p>
</div>
        </form>
      </div>
      <Footer/>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
  },
  header: {
    backgroundColor: "#345475",
    color: "white",
    padding: "15px 20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  backButton: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  headerTitle: {
    margin: 0,
    fontSize: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "30px",
    margin: "20px",
    maxWidth: "500px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  passwordContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: "15px",
    cursor: "pointer",
    color: "#7f8c8d",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
  },
  labelSubtitle: {
    fontSize: "11px",
    fontWeight: "500",
    color: "#444",
    textAlign: "center",
  },
  labelTitle: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  input: {
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "16px",
    width: "100%",
  },
  button: {
    padding: "14px",
    backgroundColor: "#345475",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "10px",
  },
  buttonDisabled: {
    padding: "14px",
    backgroundColor: "#95a5a6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "not-allowed",
    marginTop: "10px",
  },
  errorMessage: {
    backgroundColor: "#fee",
    color: "#e74c3c",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  successMessage: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  footerText: {
    fontSize: "13px",
    color: "#7f8c8d",
    textAlign: "center",
  },
  link: {
    color: "#3498db",
    textDecoration: "none",
    fontWeight: "500",
    ":hover": {
      textDecoration: "underline",
    },
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

export default ChangePassword;