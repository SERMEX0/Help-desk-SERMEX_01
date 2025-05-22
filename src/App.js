import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Inicio from "./pages/Inicio";
import PrivateRoute from "./PrivateRoute";
import SeleccionarProducto from "./pages/SeleccionarProducto";
import ProductDetail from "./pages/ProductDetail"; // Importamos la nueva pantalla
import Reparacion from "./pages/const/Reparacion"; //pantallas principales
import Productos from "./pages/const/Productos";
import Manual from "./pages/const/Manual";
import ProductEvaluation from "./pages/const/ProductEvaluation";
import Perfil from "./pages/Perfil";
//import Header from "./components/Header";
import Logistica from "./pages/const/data/Logistica";

import Rma from "./pages/const/data/Rma";
import ChangePassword from "./pages/ChangePassword";
import AuthWrapper from "./components/AuthWrapper";
import SessionChecker from "./components/SessionChecker";


function App() {
  return (
    <Router>
     
      <Routes>
         
        <Route path="/login" element={<Login />} />
        {/* 🔒 Protegemos la pantalla de inicio */}
        <Route path="/inicio" element={<PrivateRoute><Inicio /></PrivateRoute>} />
        <Route path="/seleccionar-producto" element={<SeleccionarProducto />} />  {/* ✅ Ruta correcta */}
        <Route path="/authWrapper" element={<AuthWrapper />}/>
        <Route path="/sessionChecker" element={<SessionChecker />}/>
        <Route path="/change-Password" element={<ChangePassword />} />
        <Route path="/detalle-producto" element={<ProductDetail />} />  {/* ✅ Nueva ruta */}
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/reparacion" element={<Reparacion />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/manual" element={<Manual />} />
        <Route path="/producto/:productId/evaluar" element={<ProductEvaluation />} />
        
         {/* Nuevas rutas */}
         <Route path="/logistica" element={<Logistica />} />
         
         <Route path="/rma" element={<Rma />} />
          

        {/* Redirige al login si no hay ninguna ruta coincidente */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
