import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Header from "../../../components/Header2";

// 1. Diccionario de descripciones para cada estado
const descripcionesEstado = {
  recibido: 'El producto llegó a SERMEX, pronto empezará la revisión.',
  en_revision: 'El producto se encuentra en revisión. Actualmente se están reportando y descartando fallas.',
  reparacion: 'El producto se encuentra en proceso de reparación.',
  completado: 'El producto está listo y ya ha sido enviado de vuelta.',
};

const Logistica = () => {
  const [pedidos, setPedidos] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  const estadosOrdenados = ['recibido', 'en_revision', 'reparacion', 'completado'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error("No hay token en localStorage");
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const email = decoded.correo || decoded.email || '';
      setUserEmail(email);

      axios.get(`http://localhost:5000/api/logistica/${email}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        setPedidos(res.data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener datos:", error);
        setLoading(false);
      });

    } catch (error) {
      console.error("Error decodificando token:", error);
      setLoading(false);
    }
  }, []);

  // Filtrar pedidos: solo mostrar los "completados" si NO han pasado más de 5 días desde su última actualización
  const now = new Date();
  const pedidosFiltrados = pedidos.filter(pedido => {
    if (pedido.estado !== 'completado') return true; // mostrar los que no están completados
    const fechaActualizacion = new Date(pedido.fecha_actualizacion);
    const diasPasados = (now - fechaActualizacion) / (1000 * 60 * 60 * 24);
    return diasPasados <= 5; // mostrar solo si NO han pasado más de 5 días
  });

  const getStatusStyle = (estado) => {
    const colores = {
      recibido: { backgroundColor: '#e3f2fd', color: '#1976d2' }, 
      en_revision: { backgroundColor: '#fff8e1', color: '#ff8f00' },
      reparacion: { backgroundColor: '#e8f5e9', color: '#388e3c' },
      completado: { backgroundColor: '#e0f7fa', color: '#00acc1' }
    };
    return colores[estado] || {};
  };

  if (loading) {
    return <div style={styles.loading}>Cargando tus pedidos...</div>;
  }

  return (
    <div style={styles.container}>
      <Header />
      <h2 style={styles.title}>Seguimiento de Tus Equipos</h2>
      <p style={styles.subtitle}>Mostrando resultados para: {userEmail}</p>
      
      {pedidosFiltrados.length === 0 ? (
        <div style={styles.emptyState}>
          No hay pedidos registrados para este correo.
        </div>
      ) : (
        <div style={styles.grid}>
          {pedidosFiltrados.map(pedido => (
            <div key={pedido.id} style={styles.card}>
              <h3 style={styles.productName}>{pedido.producto}</h3>
              <p style={styles.rmaText}>Folio RMA: <strong>{pedido.rma_id}</strong></p>
              
              <div style={styles.statusContainer}>
                <div
                  style={{
                    ...styles.statusBadge,
                    ...getStatusStyle(pedido.estado)
                  }}
                >
                  {pedido.estado.replace('_', ' ').toUpperCase()}
                </div>
                {/* Descripción del estado */}
                <div style={styles.estadoDescripcion}>
                  {descripcionesEstado[pedido.estado]}
                </div>
                <div style={styles.timeline}>
                  {estadosOrdenados.map(estado => (
                    <div 
                      key={estado}
                      style={{
                        ...styles.timelineStep,
                        ...(pedido.estado === estado ? styles.activeStep : {}),
                        ...(estadosOrdenados.indexOf(pedido.estado) > estadosOrdenados.indexOf(estado) ? styles.completedStep : {})
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <p style={styles.updateText}>
                Última actualización: {new Date(pedido.fecha_actualizacion).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: '1px',
    width: '100%',
    maxWidth: '1500px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    color: '#2c3e50',
    marginBottom: '10px',
    textAlign: 'center'
  },
  subtitle: {
    color: '#7f8c8d',
    marginBottom: '30px',
    fontSize: '14px',
    textAlign: 'center'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#555'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    fontSize: '16px',
    border: '1px dashed #ddd',
    borderRadius: '8px'
  },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  card: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)'
    }
  },
  productName: {
    marginTop: '0',
    color: '#345475',
    fontSize: '18px'
  },
  rmaText: {
    color: '#555',
    fontSize: '14px',
    marginBottom: '15px'
  },
  statusContainer: { 
    margin: '20px 0' 
  },
  statusBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: '500',
    marginBottom: '8px',
    fontSize: '14px',
    textAlign: 'center'
  },
  estadoDescripcion: {
    fontSize: '13px',
    color: '#444',
    margin: '6px 0 10px 0',
    fontStyle: 'italic'
  },
  timeline: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    height: '6px',
    backgroundColor: '#f0f0f0',
    borderRadius: '3px',
    margin: '15px 0'
  },
  timelineStep: {
    width: '23%',
    height: '6px',
    borderRadius: '3px',
    transition: 'background-color 0.3s ease'
  },
  activeStep: {
    backgroundColor: '#345475',
    transform: 'scaleY(1.2)'
  },
  completedStep: {
    backgroundColor: '#b0b0b0'
  },
  updateText: {
    color: '#666',
    fontSize: '13px',
    marginBottom: '0',
    fontStyle: 'italic'
  }
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

export default Logistica;