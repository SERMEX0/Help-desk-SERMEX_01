import React, { useState, useEffect} from "react";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header2";


import{FaTruck,
  FaTrash,
  FaUpload
 } from "react-icons/fa";

function App() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [documentGenerated, setDocumentGenerated] = useState(false);
  const [documentBlob, setDocumentBlob] = useState(null);
  const [images, setImages] = useState([]); // Para almacenar las imágenes subidas


  
  // Lista de vendedores
  const vendedores = [
    { id: 1, nombre: "Efren Castillo", email: "ecastillo@sermex.mx" },
    { id: 2, nombre: "Jhonatan Zavala", email: "jzavala@sermex.mx" },
    { id: 3, nombre: "Osvaldo", email: "julioosvaldoguzmancorrea53@gmail.com" }
  ];

  const [selectedVendedor, setSelectedVendedor] = useState(vendedores[0].id);

  const [formData, setFormData] = useState({
    CLIENTE: "",
    Falla: "",
    FallaFísica: "",
    Modelo: "",
    NoSerie: "",
    Accesorios: "",
    FechaCompra: "",
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.CLIENTE.trim()) newErrors.CLIENTE = "Cliente es requerido";
    if (!formData.Falla.trim()) newErrors.Falla = "Descripción de falla es requerida";
    if (!formData.FallaFísica.trim()) newErrors.FallaFísica = "Falla física es requerida";
    if (!formData.Modelo.trim()) newErrors.Modelo = "Modelo es requerido";
    if (!formData.NoSerie.trim()) newErrors.NoSerie = "Número de serie es requerido";
    if (!formData.FechaCompra) newErrors.FechaCompra = "Fecha de compra es requerida";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // 🔽 AQUÍ DEBE IR EL useEffect DE LIMPIEZA 🔽
  useEffect(() => {
    return () => {
      // Limpia las URLs de previsualización cuando el componente se desmonta
      images.forEach(img => {
        if (img.preview) URL.revokeObjectURL(img.preview);
      });
    };
  }, [images]); // Se ejecuta cuando "images" cambie o al desmontar

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Limpiar error cuando se escribe
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleVendedorChange = (e) => {
    setSelectedVendedor(parseInt(e.target.value));
  };

  const generateDocument = async () => {
    if (!validateForm()) return;
  
    if (!showPreview) {
      setShowPreview(true);
      return;
    }
  
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/FO-VTA-028.docx");
      const arrayBuffer = await response.arrayBuffer();
      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });
      console.log("Documento generado:", documentBlob);
  
      // Nueva forma de asignar datos (sin setData)
      doc.render(formData);
  
      const outputBlob = new Blob([doc.getZip().generate({ type: "arraybuffer" })], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
  
      setDocumentBlob(outputBlob);
      setDocumentGenerated(true);
      saveAs(outputBlob, "Solicitud_Garantia.docx");
    } catch (error) {
      console.error("Error al generar el documento", error);
      alert("Error al generar: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setShowPreview(false);
  };
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const MAX_SIZE_MB = 5;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  
    const validFiles = files.filter(file => file.size <= MAX_SIZE_BYTES);
    if (files.length !== validFiles.length) {
      alert(`Algunas imágenes superan el límite de ${MAX_SIZE_MB}MB`);
    }
  
    const newImages = validFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file), // Genera la previsualización
      type: file.type.split('/')[1] || 'jpeg'
    }));
  
    setImages([...images, ...newImages]);
  };


  const handleSendEmail = async () => {
    if (!documentBlob) return;
  
    setIsSubmitting(true);
    
    try {
      // Convertir documento a base64
      const documentoBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(documentBlob);
      });
  
      // Convertir imágenes a base64 (si existen)
      const imagenesBase64 = [];
      if (images && images.length > 0) {
        for (const img of images) {
          const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve({
              name: img.name,
              data: reader.result.split(',')[1],
              type: img.type || 'jpeg'
            });
            reader.readAsDataURL(img.file);
          });
          imagenesBase64.push(base64);
        }
      }
  
      // Enviar al servidor
      const response = await fetch('http://localhost:5000/api/enviar-garantia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          vendedorEmail: vendedores.find(v => v.id === selectedVendedor).email,
          datosFormulario: formData,
          documentoBase64: documentoBase64,
          imagenes: imagenesBase64 // ← Envía las imágenes si existen
        })
      });
  
      if (!response.ok) throw new Error(await response.text());
      
      alert('Tu solicitud y archivos han sido enviados. Por favor, espera la aprobación de la garantía y el envío de tu folio RMA.');

      navigate('/inicio');
  
    } catch (error) {
      console.error("Error completo:", error);
      alert(`❌ Error al enviar: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.content}>
        <div style={styles.headerSection}>
          <img 
            src="/logo_SERMEX_azul.fw.png"
            alt="Ilustración de garantía" 
            style={styles.headerImage}
          />
          
          <div style={styles.titleContainer}>
            <h2 style={styles.title}>Formulario de Garantía</h2>
            <p style={styles.subtitle}>Completa el formulario para crear tu RMA y enviarlo por correo.</p>

           
          </div>
          

        </div>
        

        {showPreview ? (
  <div style={styles.previewContainer}>
    <div style={styles.previewHeader}>
      <h3 style={styles.previewTitle}>Vista Previa</h3>
      <p style={styles.previewSubtitle}>Revise cuidadosamente la información antes de enviar por correo</p>
    </div>
    
    <div style={styles.previewCard}>
      <div style={styles.previewGrid}>
        <div style={styles.previewColumn}>
          <div style={styles.previewSection}>
            <h4 style={styles.sectionTitle}>Información del Cliente</h4>
            <div style={styles.previewItem}>
              <span style={styles.previewLabel}>Cliente:</span>
              <span style={styles.previewValue}>{formData.CLIENTE}</span>
            </div>
          </div>
          
          <div style={styles.previewSection}>
            <h4 style={styles.sectionTitle}>Detalles Técnicos</h4>
            <div style={styles.previewItem}>
              <span style={styles.previewLabel}>Modelo:</span>
              <span style={styles.previewValue}>{formData.Modelo}</span>
            </div>
            <div style={styles.previewItem}>
              <span style={styles.previewLabel}>Número de Serie:</span>
              <span style={styles.previewValue}>{formData.NoSerie}</span>
            </div>
            <div style={styles.previewItem}>
              <span style={styles.previewLabel}>Fecha de compra:</span>
              <span style={styles.previewValue}>{formData.FechaCompra}</span>
            </div>
          </div>
        </div>
        
        <div style={styles.previewColumn}>
          <div style={styles.previewSection}>
            <h4 style={styles.sectionTitle}>Reporte de Fallas</h4>
            <div style={styles.previewItem}>
              <span style={styles.previewLabel}>Descripción de la Falla:</span>
              <p style={styles.previewTextValue}>{formData.Falla}</p>
            </div>
            <div style={styles.previewItem}>
              <span style={styles.previewLabel}>Falla Física:</span>
              <p style={styles.previewTextValue}>{formData.FallaFísica}</p>
            </div>
            <div style={styles.previewItem}>
              <span style={styles.previewLabel}>Accesorios:</span>
              <span style={styles.previewValue}>{formData.Accesorios || "Ninguno"}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección de imágenes */}
      <div style={styles.formGroup}>
<h4 style={styles.sectionTitle}>Adjuntar imágenes</h4>
<h4 style={styles.previewSubtitle}>Puedes incluir fotos que muestren la falla del dispositivo que deseas reparar</h4>

        <div style={styles.uploadArea}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id="upload-images"
          />
          <label htmlFor="upload-images" style={styles.uploadButton}>
            <FaUpload style={{marginRight: '8px'}} /> 
            {images.length > 0 ? 'Agregar más imágenes' : 'Seleccionar imágenes'}
          </label>
          <p style={styles.uploadHint}>Máximo 5MB por imagen</p>
        </div>
        
        {images.length > 0 && (
          <div style={styles.imagePreviews}>
            {images.map((img, index) => (
              <div key={index} style={styles.imagePreviewContainer}>
                <div style={styles.imageToolbar}>
                  <span style={styles.imageName}>{img.name}</span>
                  <button 
                    onClick={() => {
                      URL.revokeObjectURL(img.preview);
                      setImages(images.filter((_, i) => i !== index));
                    }}
                    style={styles.deleteImageButton}
                    title="Eliminar imagen"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
                <img 
                  src={img.preview} 
                  alt={`Preview ${index}`} 
                  style={styles.imagePreview}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Botones de acción */}
    {!documentGenerated ? (
      <div style={styles.buttonGroup}>
        <button
          type="button"
          onClick={handleEdit}
          style={{...styles.button, ...styles.secondaryButton}}
        >
          Editar Datos
        </button>
        <button
          type="button"
          onClick={generateDocument}
          style={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span style={styles.buttonLoading}>
              <span style={styles.spinner}></span> Generando...
            </span>
          ) : "Confirmar y Generar Documento"}
        </button>
      </div>
    ) : (
      <div style={styles.emailSection}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Seleccionar vendedor para enviar:</label>
          <select
            value={selectedVendedor}
            onChange={handleVendedorChange}
            style={styles.select}
          >
            {vendedores.map(vendedor => (
              <option key={vendedor.id} value={vendedor.id}>
                {vendedor.nombre} ({vendedor.email})
              </option>
            ))}
          </select>
        </div>
        
        <div style={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleEdit}
            style={{...styles.button, ...styles.secondaryButton}}
          >
            Editar Datos
          </button>
          <button
            type="button"
            onClick={handleSendEmail}
            style={{...styles.button, ...styles.successButton}}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span style={styles.buttonLoading}>
                <span style={styles.spinner}></span> Enviando...
              </span>
            ) : "Enviar por Correo"}
          </button>
        </div>
      </div>
    )}
  </div>
        ) : (
          <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div style={styles.formGrid}>
              {/* Columna izquierda */}
              <div style={styles.formColumn}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Cliente *</label>
                  <input
                    type="text"
                    name="CLIENTE"
                    value={formData.CLIENTE}
                    onChange={handleChange}
                    style={{...styles.input, ...(errors.CLIENTE && styles.inputError)}}
                    placeholder="Nombre del Cliente"
                  />
                  {errors.CLIENTE && <span style={styles.errorText}>{errors.CLIENTE}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Descripción de la Falla *</label>
                  <textarea
                    name="Falla"
                    value={formData.Falla}
                    onChange={handleChange}
                    style={{...styles.textarea, ...(errors.Falla && styles.inputError)}}
                    placeholder="Describe detalladamente la falla"
                    rows="4"
                  ></textarea>
                  {errors.Falla && <span style={styles.errorText}>{errors.Falla}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Modelo *</label>
                  <input
                    type="text"
                    name="Modelo"
                    value={formData.Modelo}
                    onChange={handleChange}
                    style={{...styles.input, ...(errors.Modelo && styles.inputError)}}
                    placeholder="Modelo del producto"
                  />
                  {errors.Modelo && <span style={styles.errorText}>{errors.Modelo}</span>}
                </div>
              </div>

              {/* Columna derecha */}
              <div style={styles.formColumn}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Falla Física *</label>
                  <textarea
                    name="FallaFísica"
                    value={formData.FallaFísica}
                    onChange={handleChange}
                    style={{...styles.textarea, ...(errors.FallaFísica && styles.inputError)}}
                    placeholder="Describe cualquier daño físico visible"
                    rows="4"
                  ></textarea>
                  {errors.FallaFísica && <span style={styles.errorText}>{errors.FallaFísica}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Número de Serie *</label>
                  <input
                    type="text"
                    name="NoSerie"
                    value={formData.NoSerie}
                    onChange={handleChange}
                    style={{...styles.input, ...(errors.NoSerie && styles.inputError)}}
                    placeholder="Número de Serie"
                  />
                  {errors.NoSerie && <span style={styles.errorText}>{errors.NoSerie}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Accesorios (Opcional)</label>
                  <input
                    type="text"
                    name="Accesorios"
                    value={formData.Accesorios}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Accesorios incluidos"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Fecha de compra *</label>
                  <input
                    type="date"
                    name="FechaCompra"
                    value={formData.FechaCompra}
                    onChange={handleChange}
                    style={{...styles.input, ...(errors.FechaCompra && styles.inputError)}}
                  />
                  {errors.FechaCompra && <span style={styles.errorText}>{errors.FechaCompra}</span>}
                </div>
              </div>
            </div>

            <div style={styles.buttonContainer}>
              <button
                type="button"
                onClick={generateDocument}
                style={styles.button}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Validando..." : "Ver Vista Previa"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Estilos mejorados
const styles = {
  inputError: {
    borderColor: "#e74c3c",
    backgroundColor: "#fff9f9",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: "12px",
    marginTop: "5px",
  },
  container: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    maxWidth: "1200px",
    width: "100%",
    margin: "0 auto",
    padding: "30px 20px",
  },
  headerSection: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    marginBottom: "40px",
    flexWrap: "wrap",
  },
  headerImage: {
    width: "150px",
    height: "150px",
    objectFit: "contain",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: "28px",
    color: "#345475",
    marginBottom: "10px",
    fontWeight: "600",
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
  },
  form: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "30px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
  },
  formColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
  },
  input: {
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    transition: "border 0.3s ease",
  },
  select: {
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    backgroundColor: "white",
    width: "100%",
  },
  textarea: {
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    minHeight: "100px",
    resize: "vertical",
    transition: "border 0.3s ease",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "40px",
  },
  button: {
    padding: "12px 30px",
    backgroundColor: "#345475",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    margin: "0 10px",
    ":hover": {
      backgroundColor: "#345475",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
    flexWrap: "wrap",
    gap: "15px",
  },
  previewContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "0",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
  },
  previewHeader: {
    backgroundColor: "#345475",
    color: "white",
    padding: "20px 30px",
    marginBottom: "20px",
  },
  previewTitle: {
    fontSize: "20px",
    fontWeight: "600",
    margin: "0",
  },
  previewSubtitle: {
    fontSize: "14px",
    opacity: 0.9,
    margin: "5px 0 0",
  },
  previewCard: {
    padding: "0 30px 20px",
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    marginBottom: "20px",
  },
  previewColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  previewSection: {
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    color: "#345475",
    fontSize: "16px",
    marginTop: "0",
    marginBottom: "15px",
    paddingBottom: "8px",
    borderBottom: "1px solid #e2e8f0",
  },
  previewItem: {
    marginBottom: "12px",
  },
  previewLabel: {
    display: "block",
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "500",
    marginBottom: "3px",
  },
  previewValue: {
    display: "block",
    fontSize: "15px",
    fontWeight: "500",
    color: "#334155",
  },
  previewTextValue: {
    margin: "5px 0 0",
    fontSize: "14px",
    color: "#334155",
    lineHeight: "1.5",
    whiteSpace: "pre-wrap",
  },
  uploadArea: {
    border: "2px dashed #e2e8f0",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
    margin: "20px 0",
  },
  uploadButton: {
    padding: "12px 20px",
    backgroundColor: "#345475",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#345475",
    },
  },
  uploadHint: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "8px",
  },
  imagePreviews: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "15px",
    marginTop: "15px",
  },
  imagePreviewContainer: {
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  imageToolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },
  imageName: {
    fontSize: "11px",
    color: "#64748b",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "110px",
  },
  imagePreview: {
    width: "100%",
    height: "120px",
    objectFit: "cover",
    display: "block",
  },
  deleteImageButton: {
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "4px",
    width: "24px",
    height: "24px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
    ":hover": {
      background: "#dc2626",
    },
  },
  buttonLoading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    display: "inline-block",
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderRadius: "50%",
    borderTopColor: "white",
    animation: "spin 1s ease-in-out infinite",
  },
  secondaryButton: {
    backgroundColor: "#64748b",
    ":hover": {
      backgroundColor: "#475569",
    },
  },
  successButton: {
    backgroundColor: "#28a745",
    ":hover": {
      backgroundColor: "#218838",
    },
  },
  emailSection: {
    marginTop: "40px",
    paddingTop: "30px",
    borderTop: "1px solid #eee",
  },
};

export default App;