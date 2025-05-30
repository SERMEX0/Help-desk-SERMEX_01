import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ProductEvaluation = () => {
  const { productId } = useParams();
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  // Tu render aquí...
  return (
    <div> {/* tu código aquí */} </div>
  );
};

export default ProductEvaluation;