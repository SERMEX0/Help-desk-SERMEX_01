import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styled, { css } from "styled-components";
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
// TU IMPORT REAL DE HEADER Y FOOTER
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
      <Grid>
        <div>
          <Skeleton height={320} style={{ marginBottom: 16 }} />
          <div style={{ display: "flex", gap: "8px" }}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} height={48} width={48} />
            ))}
          </div>
        </div>
        <div>
          <Skeleton height={36} width="80%" />
          <Skeleton height={22} width="60%" style={{ margin: "10px 0" }} />
          <Skeleton height={12} count={3} />
          <Skeleton height={40} width="100%" style={{ marginTop: "24px" }} />
        </div>
      </Grid>
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

// --- HEADER PRODUCT ---
const ProductHeader = ({ title, onBack }) => (
  <HeaderBar>
    <BackBtn onClick={onBack}>
      <FaChevronLeft /> Volver
    </BackBtn>
    <Title>{title || "Producto sin nombre"}</Title>
  </HeaderBar>
);

// --- FEATURES Y DESCRIPTION ---
const ProductFeatures = ({ features }) => (
  <Section>
    <SectionTitle>
      <FaListAlt /> Características
    </SectionTitle>
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
  </Section>
);
const ProductDescription = ({ description }) => (
  <Section>
    <SectionTitle>
      <FaInfoCircle /> Descripción
    </SectionTitle>
    <p>{description || "No hay descripción disponible"}</p>
  </Section>
);

// --- ACCIONES ---
const ProductActions = ({ productName }) => {
  const handleContact = () => {
    const phone = "524434368655";
    const mail = sessionStorage.getItem("userEmail") || "Correo no disponible";
    const msg = `¡Hola! Estoy interesado cotizar mas piezas de:\n\n*Nombre del producto:* ${productName}\n*Correo del cliente:* ${mail}\n¿Podrían brindarme más información?`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };
  return (
    <Actions>
      <WaBtn onClick={handleContact}>
        <FaWhatsapp /> Cotizar más productos
      </WaBtn>
    </Actions>
  );
};

// --- MAIN PAGE ---
const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const producto = useProduct(location);
  const sliderRef = useRef(null);
  const [activeTab, setActiveTab] = useState("features");

  if (!producto) return <LoadingPlaceholder />;

  return (
    <MainContainer>
      <Header />
      <Content>
        <Grid>
          <GalleryCol>
            <ProductHeader
              title={producto.Nombre}
              onBack={() => navigate("/seleccionar-producto")}
            />
            <ProductGallery
              images={
                Array.isArray(producto.Imagen)
                  ? producto.Imagen
                  : [producto.Imagen]
              }
              sliderRef={sliderRef}
            />
          </GalleryCol>
          <InfoCol>
            <Tabs>
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
            </Tabs>
            <div>
              {activeTab === "features" ? (
                <ProductFeatures
                  features={producto["Caracteristicas de mi producto"]}
                />
              ) : (
                <ProductDescription description={producto.Adicional} />
              )}
            </div>
            <ProductActions productName={producto.Nombre} />
          </InfoCol>
        </Grid>
      </Content>
      <Footer />
    </MainContainer>
  );
};

export default ProductDetail;

// ---------- STYLED COMPONENTS MEJORADOS ----------

const MainContainer = styled.div`
  font-family: "Poppins", sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  max-width: 1100px;
  margin: 32px auto 24px auto;
  background: #fff;
  padding: 38px 36px 32px 36px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  flex: 1;
  width: 100%;
  @media (max-width: 900px) {
    padding: 16px 4px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.08fr 0.95fr;
  gap: 54px 38px;
  align-items: flex-start;
  @media (max-width: 1100px) {
    gap: 32px 18px;
  }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

const GalleryCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const InfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
  width: 100%;
  justify-content: flex-start;
`;

const BackBtn = styled.button`
  background: #e6f1fa;
  border: none;
  color: #1273b6;
  border-radius: 20px;
  padding: 7px 16px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1rem;
  transition: background 0.15s;
  &:hover {
    background: #d7edfa;
  }
`;

const Title = styled.h1`
  font-size: 1.35rem;
  font-weight: 600;
  color: #21416d;
  margin: 0;
  @media (max-width: 600px) {
    font-size: 1.08rem;
  }
`;

const Gallery = styled.div`
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  padding: 0 6px;
  @media (max-width: 600px) {
    max-width: 98vw;
  }
`;

const Img = styled.img`
  width: 100%;
  height: 340px;
  object-fit: contain;
  border-radius: 13px;
  background: #f4f5f7;
  cursor: pointer;
  transition: transform 0.22s cubic-bezier(0.5,0.4,0.3,1.1);
  ${(props) =>
    props.$zoom &&
    css`
      transform: scale(1.29);
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

const Tabs = styled.div`
  margin: 14px 0 8px 0;
  display: flex;
  gap: 8px;
`;

const TabBtn = styled.button`
  background: none;
  border: none;
  border-bottom: 2.3px solid transparent;
  color: #626a7a;
  font-size: 1.03rem;
  font-weight: 500;
  padding: 8px 21px 8px 10px;
  cursor: pointer;
  transition: color 0.18s, border 0.18s;
  display: flex;
  align-items: center;
  gap: 7px;
  ${(props) =>
    props.active &&
    css`
      color: #1273b6;
      border-bottom: 2.3px solid #1273b6;
      font-weight: 600;
    `}
`;

const Section = styled.section`
  background: #f7fafc;
  padding: 18px 20px;
  border-radius: 11px;
  margin-bottom: 14px;
  box-shadow: 0 1px 3px #00000007;
`;

const SectionTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.09rem;
  color: #345475;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 7px;
`;

const FeatureItem = styled.li`
  margin-bottom: 7px;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 1rem;
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

const Actions = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const WaBtn = styled.button`
  background: linear-gradient(90deg, #25d366 80%, #128c7e 100%);
  color: #fff;
  font-size: 1.13rem;
  padding: 13px 27px;
  border: none;
  border-radius: 22px;
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 2px 8px #25d36633;
  transition: background 0.18s, transform 0.13s;
  &:hover {
    background: linear-gradient(90deg, #128c7e 85%, #075e54 100%);
    transform: translateY(-2px) scale(1.03);
  }
`;