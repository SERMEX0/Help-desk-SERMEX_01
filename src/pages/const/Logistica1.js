import React, { useState, useEffect } from "react";
import axios from "axios";

function Logistica() {
  const [reparaciones, setReparaciones] = useState([]);

  // Obtener reparaciones al cargar
  useEffect(() => {
    const fetchReparaciones = async () => {
      const res = await axios.get("/api/reparaciones");
      setReparaciones(res.data);
    };
    fetchReparaciones();

    // Opcional: Actualizar cada 30 segundos (o usar WebSockets)
    const interval = setInterval(fetchReparaciones, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Estado de Reparaciones</h2>
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {reparaciones.map((rep, index) => (
            <tr key={index}>
              <td>{rep.cliente_email}</td>
              <td>
                <span style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  color: "white",
                  backgroundColor: 
                    rep.estado === "RECIBIDO" ? "#3498db" :
                    rep.estado === "EN_REPARACION" ? "#e67e22" :
                    rep.estado === "LISTO" ? "#2ecc71" : "#95a5a6"
                }}>
                  {rep.estado}
                </span>
              </td>
              <td>{new Date(rep.fecha_creacion).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}