import { useState, useEffect, useCallback } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import styled, { css } from "styled-components";
import Footer from "../components/Footer";

// --- HEADER PROFESIONAL ---
const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fotoGuardada = localStorage.getItem("fotoPerfil");
    if (fotoGuardada) setFotoPerfil(fotoGuardada);
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <HeaderBar>
      <Logo
        src="/logo_SERMEX_blanco.fw.png"
        alt="Logo"
        onClick={() => navigate("/inicio")}
      />
      <HeaderActions>
        <HeaderBtn onClick={() => navigate("/inicio")}>Volver al Inicio</HeaderBtn>
        <HeaderBtn secondary onClick={cerrarSesion}>Cerrar Sesión</HeaderBtn>
        <ProfileArea
          onClick={() => setMenuVisible(!menuVisible)}
          tabIndex={0}
          onBlur={() => setTimeout(() => setMenuVisible(false), 180)}
        >
          {fotoPerfil ? (
            <ProfileImg src={fotoPerfil} alt="Perfil" />
          ) : (
            <FaUserCircle size={40} color="#fff" />
          )}
          {menuVisible && (
            <ProfileMenu>
              <MenuLink to="/perfil" onClick={() => setMenuVisible(false)}>Mi Perfil</MenuLink>
              <MenuLink to="/configuracion" onClick={() => setMenuVisible(false)}>Configuración</MenuLink>
              <MenuLogout onClick={cerrarSesion}>Cerrar Sesión</MenuLogout>
            </ProfileMenu>
          )}
        </ProfileArea>
      </HeaderActions>
    </HeaderBar>
  );
};

// --- COMPONENTE PRINCIPAL ---
const SeleccionarProducto = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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

  const seleccionarProducto = (producto) => {
    if (!producto?.Nombre) return;
    navigate("/detalle-producto", { state: { producto } });
  };

  const filteredProducts = productos.filter(producto =>
    producto.Nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainContainer>
      <Header />
      <Content>
        <MainTitle>Seleccione su Producto</MainTitle>
        <Subtitle>Accede al centro de ayuda para obtener soporte específico sobre tu producto.</Subtitle>

        <SearchWrap>
          <SearchInput
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrap>

        {error ? (
          <StatusBox>
            <StatusMsg error>{error}</StatusMsg>
            <RetryBtn onClick={fetchProductos}>Reintentar</RetryBtn>
          </StatusBox>
        ) : isLoading ? (
          <StatusBox>
            <Spinner />
            <StatusMsg>Cargando productos...</StatusMsg>
          </StatusBox>
        ) : filteredProducts.length > 0 ? (
          <ProductGrid>
            {filteredProducts.map((producto, index) => (
              <ProductCard
                key={`${producto.Nombre}-${index}`}
                producto={producto}
                onClick={() => seleccionarProducto(producto)}
              />
            ))}
          </ProductGrid>
        ) : (
          <EmptyState>
            <ClearBtn onClick={() => setSearchTerm("")}>Limpiar búsqueda</ClearBtn>
            <EmptyText>
              {searchTerm
                ? <>No se encontraron productos relacionados con <strong>{searchTerm}</strong>.<br />
                Puedes <RmaBtn onClick={() => navigate("/Rma")}>elaborar una solicitud RMA</RmaBtn> para soporte técnico.</>
                : "No se encontraron productos disponibles"}
            </EmptyText>
          </EmptyState>
        )}
      </Content>
      <Footer />
    </MainContainer>
  );
};

const ProductCard = ({ producto, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <ProductCardBox
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      $hovered={isHovered}
    >
      <ProductImgWrap>
        <ProductImg
          src={
            imageError
              ? "https://via.placeholder.com/300x200?text=Imagen+no+disponible"
              : Array.isArray(producto.Imagen) && producto.Imagen.length > 0
                ? producto.Imagen[0]
                : producto.Imagen || "https://via.placeholder.com/300x200?text=Imagen+no+disponible"
          }
          alt={producto.Nombre || "Imagen del producto"}
          onError={() => setImageError(true)}
        />
        <ImgGradientOverlay />
      </ProductImgWrap>
      <ProductCardBody>
        <ProductTitle>{producto.Nombre || "Nombre no disponible"}</ProductTitle>
        {producto.Precio && (
          <ProductPrice>${producto.Precio.toFixed(2)}</ProductPrice>
        )}
        <ViewBtn>Ver detalles</ViewBtn>
      </ProductCardBody>
    </ProductCardBox>
  );
};

export default SeleccionarProducto;

// --- STYLED COMPONENTS ---
const MainContainer = styled.div`
  font-family: 'Poppins', sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeaderBar = styled.header`
  width: 97%;
  background: linear-gradient(90deg, #345475 78%, #4474B0 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 2vw;
  z-index: 1000;
  position: sticky;
  top: 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.09);
`;

const Logo = styled.img`
  height: 44px;
  margin-right: 12px;
  cursor: pointer;
  transition: transform 0.15s;
  &:hover { transform: scale(1.07); }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderBtn = styled.button`
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  background: ${({ secondary }) => secondary ? "rgba(255,255,255,0.10)" : "none"};
  color: #fff;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 30px;
  font-weight: 500;
  transition: all 0.18s;
  &:hover {
    background: rgba(255,255,255,0.18);
    border-color: rgba(255,255,255,0.5);
  }
`;

const ProfileArea = styled.div`
  position: relative;
  cursor: pointer;
  margin-left: 10px;
`;

const ProfileImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,0.5);
`;

const ProfileMenu = styled.div`
  position: absolute;
  top: 50px; right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 5px 18px rgba(0,0,0,0.17);
  padding: 11px 0;
  display: flex;
  flex-direction: column;
  min-width: 180px;
  z-index: 1001;
`;

const MenuLink = styled(NavLink)`
  padding: 10px 22px;
  color: #333;
  text-decoration: none;
  font-size: 1rem;
  &:hover { background: #f5f5f5; color: #345475; }
`;

const MenuLogout = styled.div`
  padding: 10px 22px;
  color: #e74c3c;
  cursor: pointer;
  font-size: 1rem;
  &:hover { background: #f5f5f5; color: #c0392b; }
`; 

const Content = styled.div`
  flex: 1;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const MainTitle = styled.h1`
  font-size: 2.1rem;
  color: #345475;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
  background: linear-gradient(to right, #005e97, #345475);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.04rem;
  color: #666;
  text-align: center;
  margin-bottom: 32px;
  font-weight: 400;
`;

const SearchWrap = styled.div`
  margin: 0 auto 28px;
  max-width: 520px;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 30px;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.07);
  &:focus {
    border-color: #005e97;
    box-shadow: 0 2px 10px rgba(0,94,151,0.13);
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 28px;
  width: 100%;
`;

const ProductCardBox = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.22s, transform 0.22s;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 4px 16px rgba(52,84,117,0.09), 0 1.5px 7px rgba(0,0,0,0.09);
  border: 1.5px solid #f0f4f8;
  ${({ $hovered }) =>
    $hovered &&
    css`
      transform: translateY(-8px) scale(1.03);
      box-shadow: 0 14px 32px rgba(52,84,117,0.18);
      border-color: #b1c6d9;
    `
  }
`;

const ProductImgWrap = styled.div`
  width: 100%;
  height: 210px;
  background: linear-gradient(135deg,#f9fbfc 80%,#dbe9f6 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ProductImg = styled.img`
  width: 97%;
  height: 97%;
  max-width: 320px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  background: #f0f2f4;
  transition: transform 0.35s cubic-bezier(.47,1.64,.41,.8);
  ${ProductCardBox}:hover & {
    transform: scale(1.045);
  }
`;

const ImgGradientOverlay = styled.div`
  position: absolute;
  left: 0; right: 0; bottom: 0; height: 36px;
  background: linear-gradient(0deg,rgba(52,84,117,0.14) 75%,rgba(52,84,117,0.01) 100%);
  pointer-events: none;
`;

const ProductCardBody = styled.div`
  padding: 19px 17px 15px 17px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProductTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  flex: 1;
  text-shadow: 0 1px 0 #f8fafd;
`;

const ProductPrice = styled.p`
  font-size: 1.16rem;
  font-weight: 700;
  color: #005e97;
  margin: 6px 0 12px 0;
`;

const ViewBtn = styled.button`
  padding: 8px 15px;
  background: transparent;
  color: #345475;
  border: 1.5px solid #345475;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.98rem;
  font-weight: 500;
  align-self: flex-start;
  margin-top: auto;
  transition: all 0.18s;
  &:hover {
    background: #005e97;
    color: #fff;
    border-color: #005e97;
  }
`;

const StatusBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 46px 0;
`;

const StatusMsg = styled.p`
  font-size: 1rem;
  color: ${({ error }) => (error ? "#e74c3c" : "#666")};
  margin-bottom: 18px;
  text-align: center;
`;

const RetryBtn = styled.button`
  padding: 10px 25px;
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.97rem;
  font-weight: 500;
  transition: background 0.15s;
  &:hover { background: #c0392b; }
`;

const Spinner = styled.div`
  border: 4px solid rgba(0,94,151,0.1);
  border-top: 4px solid #005e97;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
  @keyframes spin {
    0% { transform: rotate(0);}
    100% { transform: rotate(360deg);}
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #ddd;
`;

const EmptyText = styled.p`
  font-size: 1.02rem;
  color: #777;
  font-style: italic;
  margin-top: 10px;
  margin-bottom: 0;
  text-align: center;
`;

const ClearBtn = styled.button`
  padding: 8px 16px;
  background: transparent;
  color: #005e97;
  border: 1px solid #005e97;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.98rem;
  margin-bottom: 12px;
  transition: all 0.18s;
  &:hover {
    background: #005e97;
    color: #fff;
  }
`;

const RmaBtn = styled.button`
  padding: 8px 16px;
  margin-top: 12px;
  background: #fff;
  color: #345475;
  border: 1.5px solid #345475;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: #345475;
    color: #fff;
  }
`;