import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
 
  FaWhatsapp
  
} from "react-icons/fa";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const iniciarSesion = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, password }),
    });

    if (!response.ok) throw new Error("Correo o contraseña incorrectos");

    const data = await response.json();
    
    // ESTA ES LA PARTE QUE DEBES AÑADIR/MODIFICAR:
    localStorage.setItem("token", data.token);
    sessionStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    sessionStorage.setItem("user", JSON.stringify(data.user));
    
    navigate("/inicio");
  } catch (err) {
    setError(err.message || "Error al conectar con el servidor");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        {/* Logo SERMEX */}
        <div style={styles.logoContainer}>
          <img 
            src="/logo_SERMEX_azul.fw.png" 
            alt="Logo SERMEX" 
            style={styles.logo}
          />
        </div>

        <h2 style={styles.title}>Bienvenido a SERMEX</h2>
        <p style={styles.subtitle}>Ingresa tu correo y contraseña para continuar</p>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={iniciarSesion} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="correo" style={styles.label}>Correo electrónico</label>
            <input
              id="correo"
              type="email"
              placeholder="tu.correo@.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button 
            type="submit" 
            style={loading ? styles.buttonDisabled : styles.button}
            disabled={loading}
          >
            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                Ingresando...
              </div>
            ) : "Ingresar"}
          </button>
        </form>

                
       
   <div style={styles.footer}>
  <p style={styles.footerText}>
    ¿Problemas para ingresar?{' '}
    <a 
      href="#" 
      onClick={(e) => {
        e.preventDefault();
        const phoneNumber = "524434368655";
        const message = `¡Hola! Necesito ayuda para restablecer mi contraseña.\n\n No puedo acceder.`;
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
      }}
      style={styles.link}
    >
      Solicita restablecer tu contraseña
    </a>
  </p>
</div>
 
        
      </div>
      
    </div>
    
  );
  
  
};


// Estilos mejorados
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    padding: "20px",
  },
  loginCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    padding: "40px",
    width: "100%",
    maxWidth: "450px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  logoContainer: {
    marginBottom: "20px",
  },
  logo: {
    height: "80px",
    objectFit: "contain",
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
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    textAlign: "left",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#34495e",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #dfe6e9",
    borderRadius: "8px",
    fontSize: "15px",
    transition: "all 0.3s ease",
    backgroundColor: "#f8f9fa",
  },
  inputFocus: {
    borderColor: "#3498db",
    boxShadow: "0 0 0 3px rgba(52, 152, 219, 0.1)",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "10px",
    ":hover": {
      backgroundColor: "#2980b9",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(41, 128, 185, 0.2)",
    },
  },
  buttonDisabled: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#bdc3c7",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "not-allowed",
    marginTop: "10px",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  loadingSpinner: {
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    width: "16px",
    height: "16px",
    animation: "spin 1s linear infinite",
  },
  errorMessage: {
    backgroundColor: "#fee",
    color: "#e74c3c",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "20px",
    border: "1px solid #ffdddd",
  },
  footer: {
    marginTop: "30px",
    borderTop: "1px solid #ecf0f1",
    paddingTop: "20px",
  },
  footerText: {
    fontSize: "13px",
    color: "#7f8c8d",
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

export default Login;