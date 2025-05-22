import { useState, useEffect, useCallback } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const SeleccionarProducto = () => {
  // Estados para los productos
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estados para el header
  const [menuVisible, setMenuVisible] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  
  const navigate = useNavigate();

  // Efecto para cargar la foto de perfil
  useEffect(() => {
    const fotoGuardada = localStorage.getItem("fotoPerfil");
    if (fotoGuardada) setFotoPerfil(fotoGuardada);
  }, []);

  // Función para cargar productos
  const fetchProductos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://apiimagessermex-default-rtdb.firebaseio.com/.json");
      if (!response.ok) throw new Error("Error al obtener los productos");
      const data = await response.json();
      setProductos(data.Productos || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // Funciones del header
  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Función para seleccionar producto
  const seleccionarProducto = (producto) => {
    if (!producto?.Nombre) return;
    navigate("/detalle-producto", { state: { producto } });
  };

  // Filtrar productos
  const filteredProducts = productos.filter(producto =>
    producto.Nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Componente Header integrado
  const Header = () => (
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
        <button onClick={() => navigate("/inicio")} style={headerStyles.navButton}>
          Volver al Inicio
        </button>

        <button onClick={cerrarSesion} style={headerStyles.logoutButton}>
          Cerrar Sesión
        </button>

        <div 
          onClick={() => setMenuVisible(!menuVisible)} 
          style={headerStyles.profileContainer}
        >
          {fotoPerfil ? (
            <img src={fotoPerfil} alt="Perfil" style={headerStyles.profileImage} />
          ) : (
            <FaUserCircle size={45} color="#ffffff" style={headerStyles.profileIcon} />
          )}

          {menuVisible && (
            <div style={headerStyles.profileMenu}>
              <NavLink to="/perfil" style={headerStyles.menuItem}>
                Mi Perfil
              </NavLink>
              <NavLink to="/configuracion" style={headerStyles.menuItem}>
                Configuración
              </NavLink>
              <div onClick={cerrarSesion} style={headerStyles.menuItemLogout}>
                Cerrar Sesión
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );

  // Componente ProductCard integrado
  const ProductCard = ({ producto, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
      <div
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          ...productCardStyles.card,
          transform: isHovered ? "translateY(-5px)" : "translateY(0)",
          boxShadow: isHovered 
            ? "0 10px 20px rgba(0, 0, 0, 0.15)" 
            : "0 5px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={productCardStyles.imageContainer}>
          <img
            src={
              imageError 
                ? "https://via.placeholder.com/300x200?text=Imagen+no+disponible"
                : Array.isArray(producto.Imagen) && producto.Imagen.length > 0 
                  ? producto.Imagen[0] 
                  : producto.Imagen || "https://via.placeholder.com/300x200?text=Imagen+no+disponible"
            }
            alt={producto.Nombre || "Imagen del producto"}
            style={productCardStyles.image}
            onError={() => setImageError(true)}
          />
        </div>
        <div style={productCardStyles.cardBody}>
          <h3 style={productCardStyles.productName}>
            {producto.Nombre || "Nombre no disponible"}
          </h3>
          {producto.Precio && (
            <p style={productCardStyles.productPrice}>${producto.Precio.toFixed(2)}</p>
          )}
          <button style={productCardStyles.viewButton}>
            Ver detalles
          </button>
        </div>
      </div>
    );
  };

  // Render principal
  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.contentContainer}>
        <h1 style={styles.title}>Seleccione su Producto</h1>
        <p style={styles.subtitle}>Accede al centro de ayuda para obtener soporte específico sobre tu producto.</p>
        
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {error ? (
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>{error}</p>
            <button onClick={fetchProductos} style={styles.reloadButton}>
              Reintentar
            </button>
          </div>
        ) : isLoading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Cargando productos...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div style={styles.grid}>
            {filteredProducts.map((producto, index) => (
              <ProductCard 
                key={`${producto.Nombre}-${index}`}
                producto={producto}
                onClick={() => seleccionarProducto(producto)}
              />
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
             <div>
            <button 
                onClick={() => setSearchTerm("")}
                style={styles.clearSearchButton}
              >
                Limpiar búsqueda
              </button>
              </div>
            <p style={styles.emptyText}>
              {searchTerm 
                ? `No se encontraron productos relacionados con "${searchTerm}". Puedes 
                elaborar un formato RMA para enviar tu solicitud de soporte y/o verificar 
                si tu producto cuenta con garantía.`

                : "No se encontraron productos disponibles"}
            </p>
            {searchTerm && (

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
    Elaborar solicitud RMA
  </button>

              
            )}
           
          </div>
          
        )}
        
      </div>

      <Footer />
    </div>
  );
};

// Estilos para el componente principal
const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  contentContainer: {
    flex: 1,
    padding: "40px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  },
  title: {
    fontSize: "2.2rem",
    color: "#345475",
    fontWeight: "700",
    marginBottom: "10px",
    textAlign: "center",
    background: "linear-gradient(to right, #005e97, #345475)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#666",
    textAlign: "center",
    marginBottom: "40px",
    fontWeight: "400",
  },
  searchContainer: {
    margin: "0 auto 30px",
    maxWidth: "600px",
    width: "100%",
  },
  searchInput: {
    width: "100%",
    padding: "12px 20px",
    fontSize: "1rem",
    border: "1px solid #ddd",
    borderRadius: "30px",
    outline: "none",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    ":focus": {
      borderColor: "#005e97",
      boxShadow: "0 2px 10px rgba(0, 94, 151, 0.2)",
    }
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "30px",
    width: "100%",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "50px 0",
  },
  loadingSpinner: {
    border: "4px solid rgba(0, 94, 151, 0.1)",
    borderTop: "4px solid #005e97",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  loadingText: {
    fontSize: "1rem",
    color: "#666",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    backgroundColor: "#fff9f9",
    borderRadius: "8px",
    border: "1px solid #ffebee",
    maxWidth: "500px",
    margin: "0 auto",
  },
  errorText: {
    fontSize: "1rem",
    color: "#e74c3c",
    marginBottom: "20px",
    textAlign: "center",
  },
  reloadButton: {
    padding: "10px 25px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: "#c0392b",
    },
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "50px 20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    border: "1px dashed #ddd",
  },
  emptyText: {
    fontSize: "1rem",
    color: "#777",
    fontStyle: "italic",
    marginBottom: "10px",
    textAlign: "center",
  },
  clearSearchButton: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    color: "#005e97",
    border: "1px solid #005e97",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: "#005e97",
      color: "#fff",
    }
  },
};

// Estilos para el Header (integrado)
const headerStyles = {
  container: {
    width: "97%",
    maxWidth: "1500px",
    margin: "0 auto",
    backgroundColor: "#345475",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "15px 30px",
    zIndex: 1000,
    position: "sticky",
    top: 0,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    height: "50px",
    marginRight: "20px",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
    cursor: "pointer",
    transition: "transform 0.3s ease",
    ":hover": {
      transform: "scale(1.05)",
    },
  },
  buttonsContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  navButton: {
    padding: "8px 16px",
    fontSize: "0.9rem",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "2px solid rgba(255,255,255,0.3)",
    borderRadius: "30px",
    transition: "all 0.3s ease",
    fontWeight: "500",
    ":hover": {
      backgroundColor: "rgba(255,255,255,0.1)",
      borderColor: "rgba(255,255,255,0.5)",
    }
  },
  logoutButton: {
    padding: "8px 16px",
    fontSize: "0.9rem",
    cursor: "pointer",
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "2px solid rgba(255,255,255,0.3)",
    borderRadius: "30px",
    transition: "all 0.3s ease",
    fontWeight: "500",
    ":hover": {
      backgroundColor: "rgba(255,255,255,0.2)",
      borderColor: "rgba(255,255,255,0.5)",
    }
  },
  profileContainer: {
    position: "relative",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    marginLeft: "10px",
  },
  profileImage: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid rgba(255,255,255,0.5)",
    transition: "all 0.3s ease",
    ":hover": {
      borderColor: "rgba(255,255,255,0.8)",
    }
  },
  profileIcon: {
    opacity: 0.8,
    transition: "all 0.3s ease",
    ":hover": {
      opacity: 1,
    }
  },
  profileMenu: {
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
  },
  menuItem: {
    padding: "10px 20px",
    color: "#333",
    textDecoration: "none",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#f5f5f5",
      color: "#345475",
    }
  },
  menuItemLogout: {
    padding: "10px 20px",
    color: "#e74c3c",
    textDecoration: "none",
    transition: "all 0.2s ease",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#f5f5f5",
      color: "#c0392b",
    }
  },
};

// Estilos para ProductCard (integrado)
const productCardStyles = {
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  imageContainer: {
    width: "100%",
    height: "320px",
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease",
  },
  cardBody: {
    padding: "20px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  productName: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#333",
    marginBottom: "10px",
    flex: 1,
  },
  productPrice: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#005e97",
    margin: "10px 0",
  },
  viewButton: {
    padding: "10px 15px",
    backgroundColor: "transparent",
    color: "#345475",
    border: "1px solid #345475",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
    alignSelf: "flex-start",
    marginTop: "auto",
    ":hover": {
      backgroundColor: "#005e97",
      color: "#fff",
    },
  },
};

// Componente Footer simplificado (puedes reemplazarlo con tu Footer real)
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

export default SeleccionarProducto;