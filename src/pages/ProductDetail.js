import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styled, { css, keyframes } from "styled-components";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaCompress,
  FaWhatsapp,
  FaListAlt,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";

// --- CUSTOM HOOK ---
const useProduct = (location) => {
  const [producto, setProducto] = useState(null);
  useEffect(() => {
    const productData =
      location.state?.producto ||
      JSON.parse(localStorage.getItem("productoSeleccionado"));
    if (productData) {
      setProducto(productData);
      if (location.state?.producto) {
        localStorage.setItem(
          "productoSeleccionado",
          JSON.stringify(productData)
        );
      }
    }
  }, [location.state]);
  return producto;
};

// --- GALLERY ARROWS ---
const PrevArrow = ({ onClick }) => (
  <ArrowBtn className="prev" onClick={onClick}>
    <FaChevronLeft />
  </ArrowBtn>
);
const NextArrow = ({ onClick }) => (
  <ArrowBtn className="next" onClick={onClick}>
    <FaChevronRight />
  </ArrowBtn>
);

// --- PLACEHOLDER ---
const LoadingPlaceholder = () => (
  <MainContainer>
    <Header />
    <Content>
      <ProductHeroSkeleton>
        <div>
          <Skeleton height={320} width={360} style={{ borderRadius: 20, marginBottom: 18 }} />
        </div>
        <div style={{ flex: 1, marginLeft: 34 }}>
          <Skeleton height={36} width={240} style={{ marginBottom: 18 }} />
          <Skeleton height={22} width="70%" style={{ marginBottom: 10 }} />
          <Skeleton height={16} count={3} width="55%" />
          <Skeleton height={40} width="90%" style={{ marginTop: "24px" }} />
        </div>
      </ProductHeroSkeleton>
      <Skeleton style={{marginTop: 32, borderRadius: 18}} height={220} />
    </Content>
    <Footer />
  </MainContainer>
);

// --- GALLERY ---
const ProductGallery = ({ images, sliderRef }) => {
  const [zoom, setZoom] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const settings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 400,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: false,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      beforeChange: (current, next) => setCurrentImageIndex(next),
      appendDots: (dots) => <Dots>{dots}</Dots>,
      customPaging: (i) => (
        <DotImg
          src={images[i] || "https://via.placeholder.com/60x60?text=No+Img"}
          alt={`Miniatura ${i}`}
        />
      ),
      ref: sliderRef,
    }),
    [images]
  );

  if (!images || images.length === 0) {
    return (
      <Gallery>
        <Img
          src="https://via.placeholder.com/500x350?text=Imagen+no+disponible"
          alt="Producto"
        />
      </Gallery>
    );
  }

  return (
    <Gallery>
      <Slider {...settings}>
        {images.map((imgUrl, i) => (
          <div key={i} style={{ position: "relative" }}>
            <Img
              src={imgUrl}
              alt={`Imagen ${i + 1}`}
              className={zoom ? "zoom" : ""}
              $zoom={zoom}
              onClick={() => setZoom(!zoom)}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/500x350?text=Imagen+no+disponible";
              }}
            />
            <ZoomBtn
              onClick={() => setZoom(!zoom)}
              aria-label={zoom ? "Reducir imagen" : "Ampliar imagen"}
            >
              {zoom ? <FaCompress /> : <FaExpand />}
            </ZoomBtn>
            {images.length > 1 && (
              <ImgCounter>
                {currentImageIndex + 1}/{images.length}
              </ImgCounter>
            )}
          </div>
        ))}
      </Slider>
    </Gallery>
  );
};

// --- PRODUCT HERO ---
const ProductHero = ({ producto, onBack, onQuote }) => (
  <HeroZone>
    <HeroImage>
      <ProductGallery
        images={
          Array.isArray(producto.Imagen)
            ? producto.Imagen
            : [producto.Imagen]
        }
      />
    </HeroImage>
    <HeroInfo>
      <BackBtn onClick={onBack}>
        <FaChevronLeft /> Volver a seleccionar producto
      </BackBtn>
      <HeroTitle>{producto.Nombre || "Producto sin nombre"}</HeroTitle>
      <HeroDetailsRow>
        {producto.Modelo && (
          <HeroBadge>
            <strong>Modelo:</strong> {producto.Modelo}
          </HeroBadge>
        )}
        {producto["Número de serie"] && (
          <HeroBadge>
            <strong>Serie:</strong> {producto["Número de serie"]}
          </HeroBadge>
        )}
        {producto["Fecha de compra"] && (
          <HeroBadge>
            <strong>Compra:</strong> {producto["Fecha de compra"]}
          </HeroBadge>
        )}
      </HeroDetailsRow>
      <HeroActions>
        <QuoteBtn onClick={onQuote}>
          <FaWhatsapp /> Cotizar más productos
        </QuoteBtn>
      </HeroActions>
    </HeroInfo>
  </HeroZone>
);

// --- FEATURES Y DESCRIPTION ---
const ProductFeatures = ({ features }) => (
  <FeatureCard>
    <CardTitle>
      <Badge features>Características</Badge>
      <FaListAlt />
    </CardTitle>
    {features && features.length > 0 ? (
      <ul>
        {features.map((f, i) => (
          <FeatureItem key={i}>
            <FaCheckCircle className="ok" /> {f}
          </FeatureItem>
        ))}
      </ul>
    ) : (
      <NoData>No hay características disponibles</NoData>
    )}
  </FeatureCard>
);

const ProductDescription = ({ description }) => (
  <FeatureCard>
    <CardTitle>
      <Badge desc>Descripción</Badge>
      <FaInfoCircle />
    </CardTitle>
    <p>{description || "No hay descripción disponible"}</p>
  </FeatureCard>
);

// --- MAIN PAGE ---
const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const producto = useProduct(location);
  const [activeTab, setActiveTab] = useState("features");

  // WhatsApp handler
  const handleContact = () => {
  let mail =
    sessionStorage.getItem("userEmail") ||
    localStorage.getItem("userEmail") ||
    "Correo no disponible";
  if (mail === "Correo no disponible") {
    mail = prompt("Por favor, ingresa tu correo para la cotización:");
    if (!mail) return; // El usuario canceló
  }
  const phone = "524434368655";
  const msg = `¡Hola! Estoy interesado cotizar mas piezas de:\n\n*Nombre del producto:* ${producto?.Nombre}\n*Correo del cliente:* ${mail}\n¿Podrían brindarme más información?`;
  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
};

  if (!producto) return <LoadingPlaceholder />;

  return (
    <MainContainer>
      <Header />
      <Content>
        <ProductHero
          producto={producto}
          onBack={() => navigate("/seleccionar-producto")}
          onQuote={handleContact}
        />
        <StickyTabs>
          <TabBtn
            active={activeTab === "features"}
            onClick={() => setActiveTab("features")}
          >
            <FaListAlt /> Características
          </TabBtn>
          <TabBtn
            active={activeTab === "details"}
            onClick={() => setActiveTab("details")}
          >
            <FaInfoCircle /> Descripción
          </TabBtn>
        </StickyTabs>
        <TabSection>
          {activeTab === "features" ? (
            <ProductFeatures
              features={producto["Caracteristicas de mi producto"]}
            />
          ) : (
            <ProductDescription description={producto.Adicional} />
          )}
        </TabSection>
      </Content>
      <Footer />
    </MainContainer>
  );
};

export default ProductDetail;

// -------------------- STYLED COMPONENTS --------------------

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(45px);}
  to { opacity: 1; transform: translateY(0);}
`;

const MainContainer = styled.div`
  font-family: "Poppins", sans-serif;
  background: #f6f9fc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 32px auto 24px auto;
  padding: 0;
  flex: 1;
  width: 100%;
`;

const ProductHeroSkeleton = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 44px;
  margin-bottom: 38px;
`;

const HeroZone = styled.section`
  display: flex;
  align-items: stretch;
  gap: 42px;
  background: linear-gradient(96deg,#e0e7ff 56%,#fff 100%);
  border-radius: 22px;
  box-shadow: 0 6px 30px #4368a80a;
  padding: 36px 44px 32px 32px;
  margin-bottom: 35px;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 22px;
    padding: 19px 8px;
  }
`;

const HeroImage = styled.div`
  flex: 1.2;
  min-width: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeroInfo = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
  min-width: 0;
`;

const BackBtn = styled.button`
  background: #e6f1fa;
  border: none;
  color: #1273b6;
  border-radius: 20px;
  padding: 8px 18px;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 1rem;
  margin-bottom: 14px;
  transition: background 0.15s;
  &:hover {
    background: #d7edfa;
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.1rem;
  font-weight: 700;
  color: #1d3557;
  margin-bottom: 5px;
  letter-spacing: 0.4px;
  @media (max-width: 600px) {
    font-size: 1.3rem;
  }
`;

const HeroDetailsRow = styled.div`
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

const HeroBadge = styled.span`
  background: #fff;
  color: #21416d;
  font-size: 1.02rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 5px 18px;
  box-shadow: 0 2px 12px #4368a80b;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const HeroActions = styled.div`
  margin-top: 18px;
`;

const QuoteBtn = styled.button`
  background: linear-gradient(90deg, #128c7e 80%, #128c7e 100%);
  color: #fff;
  font-size: 1.12rem;
  padding: 13px 27px;
  border: none;
  border-radius: 26px;
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 2px 12px #25d3663a;
  transition: background 0.18s, transform 0.13s;
  &:hover {
    background: linear-gradient(90deg, #128c7e 90%, #075e54 100%);
    transform: scale(1.05);
  }
`;

const StickyTabs = styled.div`
  display: flex;
  border-radius: 14px;
  gap: 22px;
  border: 1.5px solid #e0e7ef;
  background: #f9fbfd;
  max-width: 570px;
  margin: 0 auto 0 auto;
  box-shadow: 0 2px 18px rgba(44,80,150,0.07);
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 4px;
  justify-content: center;
`;

const TabBtn = styled.button`
  flex: 1;
  min-width: 170px;
  padding: 19px 0;
  background: none;
  border: none;
  font-size: 1.13rem;
  font-weight: 700;
  color: #345475;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
  cursor: pointer;
  border-radius: 12px;
  background: ${(props) => (props.active ? "#eaf0fa" : "none")};
  box-shadow: ${(props) => props.active ? "0 4px 14px rgba(52,84,117,0.04)" : "none"};
  border-bottom: ${(props) =>
    props.active ? "3px solid #345475" : "3px solid transparent"};
  transition: background 0.16s, color 0.16s, box-shadow 0.18s, border 0.18s;
  &:hover {
    background: #eaf0fa;
    color: #233553;
    box-shadow: 0 6px 22px 0 rgba(44,80,150,0.09);
  }
`;

const TabSection = styled.div`
  margin: 44px auto 0 auto;
  max-width: 660px;
  animation: ${fadeUp} 0.66s;
`;

const FeatureCard = styled.section`
  background: linear-gradient(120deg,#f8fafc 95%,#e0e7ff 100%);
  padding: 32px 26px 22px 26px;
  border-radius: 20px;
  box-shadow: 0 7px 34px rgba(52,84,117,0.10);
  margin-bottom: 18px;
  min-height: 120px;
`;

const CardTitle = styled.h3`
  font-size: 1.11rem;
  color: #2c3e50;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 17px;
`;

const Badge = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  padding: 3px 13px;
  border-radius: 20px;
  background: ${({ features, desc }) =>
    features ? "#dbeafe"
    : desc ? "#fef9c3"
    : "#e5e7eb"};
  color: ${({ features, desc }) =>
    features ? "#2563eb"
    : desc ? "#c27803"
    : "#374151"};
  letter-spacing: 1px;
  vertical-align: middle;
`;

const FeatureItem = styled.li`
  margin-bottom: 7px;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 1.06rem;
  .ok {
    color: #128c7e;
  }
`;

const NoData = styled.p`
  color: #7f8c8d;
  font-style: italic;
  text-align: center;
  margin: 12px 0;
`;

const Gallery = styled.div`
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  padding: 0 6px;
  @media (max-width: 600px) {
    max-width: 98vw;
  }
`;

const Img = styled.img`
  width: 100%;
  height: 300px;
  object-fit: contain;
  border-radius: 13px;
  background: #f4f5f7;
  cursor: pointer;
  transition: transform 0.22s cubic-bezier(0.5,0.4,0.3,1.1);
  ${(props) =>
    props.$zoom &&
    css`
      transform: scale(1.25);
      z-index: 2;
      box-shadow: 0 8px 40px #0002;
    `}
`;

const ZoomBtn = styled.button`
  position: absolute;
  bottom: 18px;
  right: 16px;
  background: #1e2022d0;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  font-size: 1.16rem;
  &:hover {
    background: #2224;
  }
`;

const ImgCounter = styled.span`
  position: absolute;
  bottom: 18px;
  left: 22px;
  background: #1e2022cc;
  color: #fff;
  padding: 2px 13px;
  border-radius: 16px;
  font-size: 15px;
`;

const ArrowBtn = styled.button`
  background: #fff;
  border: none;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  &.prev {
    left: -12px;
  }
  &.next {
    right: -12px;
  }
`;

const Dots = styled.ul`
  display: flex !important;
  justify-content: center;
  gap: 7px;
  margin: 13px 0 0 0;
  padding: 0;
  list-style: none;
`;

const DotImg = styled.img`
  width: 46px;
  height: 46px;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid #eee;
  transition: border 0.18s;
  filter: grayscale(0.12);
  &:hover,
  &.slick-active {
    border-color: #1273b6;
    filter: grayscale(0);
  }
`;