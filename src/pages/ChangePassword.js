import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "../components/Header2";

// Puedes copiar este Footer o usar el tuyo propio
const Footer = () => (
  <footer style={{
    background: "linear-gradient(90deg, #345475 78%, #4474B0 100%)",
    color: "#fff",
    padding: "20px",
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

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e9f1fa 60%, #f9fafc 100%)",
    display: "flex",
    flexDirection: "column",
  },
  card: {
    margin: "40px auto 0 auto",
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 8px 32px rgba(52,84,117,0.12), 0 1.5px 7px rgba(0,0,0,0.09)",
    padding: "38px 32px 32px 32px",
    maxWidth: "420px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "22px",
    alignItems: "center",
  },
  labelTitle: {
    fontSize: "1.12rem",
    fontWeight: "600",
    color: "#345475",
    textAlign: "center",
    marginBottom: "10px",
    marginTop: "0",
    letterSpacing: "-0.5px",
    lineHeight: "1.4",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "18px",
    marginTop: "0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
  },
  passwordContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: "14px",
    cursor: "pointer",
    color: "#7f8c8d",
    fontSize: "1.2rem",
    transition: "color 0.18s",
  },
  label: {
    fontSize: "0.98rem",
    fontWeight: "500",
    color: "#345475",
    marginBottom: "2px",
    letterSpacing: "-0.5px",
  },
  input: {
    padding: "13px 44px 13px 15px",
    border: "1.5px solid #d3e0ee",
    borderRadius: "7px",
    fontSize: "1rem",
    width: "100%",
    background: "#f9fbfd",
    outline: "none",
    transition: "border 0.2s, box-shadow 0.2s",
    boxShadow: "0 1.5px 6px rgba(0, 94, 151, 0.04)",
  },
  inputFocus: {
    border: "1.7px solid #005e97",
    boxShadow: "0 2px 12px 0 rgba(0,94,151,0.13)",
  },
  button: {
    padding: "14px",
    background: "linear-gradient(90deg,#345475 80%,#4474B0 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.08rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "6px",
    transition: "background 0.18s, color 0.18s",
    letterSpacing: "-0.5px",
    boxShadow: "0 2px 10px rgba(52,84,117,0.07)",
  },
  buttonDisabled: {
    padding: "14px",
    background: "#aab7b8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.08rem",
    fontWeight: "600",
    cursor: "not-allowed",
    marginTop: "6px",
  },
  errorMessage: {
    background: "rgba(231,76,60,0.08)",
    color: "#e74c3c",
    padding: "12px",
    borderRadius: "7px",
    marginBottom: "10px",
    fontSize: "0.98rem",
    width: "100%",
    textAlign: "center",
    border: "1px solid #f9d6d5",
    fontWeight: 500,
  },
  successMessage: {
    background: "rgba(46,125,50,0.09)",
    color: "#2e7d32",
    padding: "12px",
    borderRadius: "7px",
    marginBottom: "10px",
    fontSize: "0.98rem",
    width: "100%",
    textAlign: "center",
    border: "1px solid #c6e7cb",
    fontWeight: 500,
  },
  footer: {
    marginTop: "8px",
    width: "100%",
  },
  footerText: {
    fontSize: "0.98rem",
    color: "#7f8c8d",
    textAlign: "center",
    marginTop: "8px"
  },
  link: {
    color: "#005e97",
    textDecoration: "underline",
    fontWeight: "500",
    cursor: "pointer"
  },
};

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
              height: "88px",
              filter: "drop-shadow(0 2px 8px rgba(52,84,117,0.13))"
            }} 
            onClick={() => navigate("/inicio")}
          />
        </div>
        {error && <div style={styles.errorMessage}>{error}</div>}
        {success && <div style={styles.successMessage}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form} autoComplete="off">
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
                tabIndex={0}
                aria-label="Mostrar/Ocultar contraseña actual"
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
                tabIndex={0}
                aria-label="Mostrar/Ocultar nueva contraseña"
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
                tabIndex={0}
                aria-label="Mostrar/Ocultar confirmación"
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
                  const message = `¡Hola! Necesito ayuda para restablecer mi contraseña.\n\nPor favor indíquenme cómo proceder para recuperar mi acceso.`;
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

export default ChangePassword;