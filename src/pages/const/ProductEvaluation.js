import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaStar, FaArrowLeft, FaSpinner } from "react-icons/fa";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ProductEvaluation = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState({
    puntuacion: 0,
    comentario: '',
    sugerencias: ''
  });
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/productos/${productId}`);
        
        if (!response.ok) {
          throw new Error('Producto no encontrado');
        }
        
        const data = await response.json();
        setProducto(data);
      } catch (err) {
        console.error("Error cargando producto:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <FaSpinner className="spinner-icon" />
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <FaArrowLeft style={{ marginRight: 8 }} /> Volver
        </button>
      </div>
    );
  }

  if (!producto) {
    return (
      <div style={styles.errorContainer}>
        <h2>Producto no disponible</h2>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <FaArrowLeft style={{ marginRight: 8 }} /> Volver
        </button>
      </div>
    );
  }

  // Resto de tu componente...
  return (
    <div style={styles.container}>
      <Header />
      
      <div style={styles.content}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <FaArrowLeft style={{ marginRight: 8 }} /> Volver al producto
        </button>
        
        <h2 style={styles.title}>Evaluar: {producto.Nombre}</h2>
        
        {/* Resto del formulario... */}
      </div>
      
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  content: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  errorContainer: {
    textAlign: "center",
    padding: "40px 20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#0056b3",
  },
  title: {
    color: "#003366",
    marginBottom: "30px",
  },
  // ... otros estilos
};

export default ProductEvaluation;