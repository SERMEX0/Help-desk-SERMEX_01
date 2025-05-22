import React, { useState, useEffect } from "react";

const ProductDetail = () => {
  const [producto, setProducto] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Cambié la URL, ahora que no necesitas el productId.
        const response = await fetch(`https://apiimagessermex-default-rtdb.firebaseio.com/.json`);
        if (!response.ok) throw new Error("Error al obtener el producto");

        const data = await response.json();

        if (data) {
          setProducto(data);  // Ya no necesitamos buscar por productId
          setSelectedImage(data.Imagen && data.Imagen.length > 0 ? data.Imagen[0] : null);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProduct(); // Llamada a la API para obtener el producto
  }, []);

  if (!producto) return <p>Cargando producto...</p>;

  return (
    <div className="container">
      <h2>{producto.Nombre || "Nombre no disponible"}</h2>
      <p><strong>Descripción:</strong> {producto.Adicional || "Sin descripción"}</p>

      <h3>Características:</h3>
      <ul>
        {producto["Caracteristicas de mi producto"]?.length > 0 ? (
          producto["Caracteristicas de mi producto"].map((caracteristica, index) => (
            <li key={index}>{caracteristica}</li>
          ))
        ) : (
          <li>No hay características disponibles</li>
        )}
      </ul>

      <h3>Mantenimiento y Garantía</h3>
      <p><strong>Garantía:</strong> {producto.Nombre || "No disponible"}</p>
      <p><strong>Mantenimiento:</strong> {producto.Mantenimiento || "No especificado"}</p>
      <p><strong>Servicio de mantenimiento:</strong> {producto["Servicio de mantenimiento"] || "No especificado"}</p>
      <p><strong>Soporte y mantenimiento:</strong> {producto["Soporte y mantenimiento"] || "No especificado"}</p>
      <p><strong>Mantenimiento preventivo:</strong> {producto["Mantenimiento preventivo"] || "No especificado"}</p>
      <p><strong>Mantenimiento correctivo:</strong> {producto["Mantenimiento correctivo"] || "No especificado"}</p>
      

      <h3>Reportar Problema</h3>
      <ul>
        {producto["Reportar problema"]?.length > 0 ? (
          producto["Reportar problema"].map((problema, index) => (
            <li key={index}>{problema}</li>
          ))
        ) : (
          <li>No hay problemas reportados</li>
        )}
      </ul>

      <h3>Imágenes del Producto</h3>
      {selectedImage && (
        <img
          src={selectedImage}
          alt="Producto"
          width="300"
          style={{ display: "block", marginBottom: "10px" }}
        />
      )}

      <div>
        {producto.Imagen?.length > 0 ? (
          producto.Imagen.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Producto"
              width="50"
              style={{
                margin: "5px",
                cursor: "pointer",
                border: selectedImage === img ? "2px solid blue" : "none",
              }}
              onClick={() => setSelectedImage(img)}
            />
          ))
        ) : (
          <p>No hay imágenes disponibles</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
