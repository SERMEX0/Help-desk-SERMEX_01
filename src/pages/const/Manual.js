import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  FaTools,
  FaVideo,
  FaCalendarAlt,
  FaUserCog,
  FaLifeRing
} from "react-icons/fa";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styled, { css, keyframes } from "styled-components";

const Manual = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [activeTab, setActiveTab] = useState('mantenimiento');
  const [loading, setLoading] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    setLoading(true);
    setTimeout(() => { // Simular carga
      if (location.state?.producto) {
        const productoData = location.state.producto;
        localStorage.setItem("productoSeleccionado", JSON.stringify(productoData));
        setProducto(productoData);
        setMainImage(
          Array.isArray(productoData.Imagen) && productoData.Imagen.length > 0
            ? productoData.Imagen[0]
            : productoData.Imagen
        );
      } else {
        const storedProducto = localStorage.getItem("productoSeleccionado");
        if (storedProducto) {
          const parsedProducto = JSON.parse(storedProducto);
          setProducto(parsedProducto);
          setMainImage(
            Array.isArray(parsedProducto.Imagen) && parsedProducto.Imagen.length > 0
              ? parsedProducto.Imagen[0]
              : parsedProducto.Imagen
          );
        }
      }
      setLoading(false);
    }, 800);
  }, [location.state]);

  if (loading || !producto) {
    return (
      <MainContainer>
        <Header />
        <HeroSkeleton>
          <div>
            <Skeleton height={220} width={260} style={{ borderRadius: 18 }} />
          </div>
          <div style={{ flex: 1, marginLeft: 32 }}>
            <Skeleton height={40} width={320} style={{ marginBottom: 18 }} />
            <Skeleton height={25} count={3} width="80%" style={{ marginBottom: 10 }} />
            <Skeleton height={20} count={2} width="60%" style={{ marginBottom: 10 }} />
          </div>
        </HeroSkeleton>
        <Skeleton style={{marginTop: 32, borderRadius: 18}} height={350} />
        <Footer />
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <Header />
      <HeroSection>
        <HeroImageContainer>
          {mainImage ? (
            <HeroImage
              src={mainImage}
              alt="Producto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
              }}
            />
          ) : (
            <ImagePlaceholder>
              <FaTools size={52} />
              <span>Imagen no disponible</span>
            </ImagePlaceholder>
          )}
        </HeroImageContainer>
        <HeroDetails>
          <h1>{producto.Nombre || "Producto sin nombre"}</h1>
          <HeroInfo>
            {producto.Modelo && (
              <InfoBox>
                <strong>Modelo</strong>
                <span>{producto.Modelo}</span>
              </InfoBox>
            )}
            {producto["Número de serie"] && (
              <InfoBox>
                <strong>Serie</strong>
                <span>{producto["Número de serie"]}</span>
              </InfoBox>
            )}
            {producto["Fecha de compra"] && (
              <InfoBox>
                <strong>Compra</strong>
                <span>{producto["Fecha de compra"]}</span>
              </InfoBox>
            )}
          </HeroInfo>
          <HeroDesc>
            Manual de operación y mantenimiento
          </HeroDesc>
        </HeroDetails>
        <SoporteBtn
          title="Soporte rápido"
          onClick={() => window.open('mailto:info@sermex.mx', '_blank')}
        >
          <FaLifeRing size={20} /> Soporte
        </SoporteBtn>
      </HeroSection>

      <StickyTabs>
        <TabBtn
          active={activeTab === 'tutorial'}
          onClick={() => setActiveTab('tutorial')}
        >
          <FaUserCog /> Tutorial
        </TabBtn>
        <TabBtn
          active={activeTab === 'mantenimiento'}
          onClick={() => setActiveTab('mantenimiento')}
        >
          <FaTools /> Mantenimiento
        </TabBtn>
      </StickyTabs>

      <FadeSection>
        {activeTab === 'mantenimiento' ? (
          <CardsFlex>
            <InfoCardVibrant>
              <SectionTitle>
                <FaTools /> Mantenimiento
                <Badge preventivo>PREVENTIVO</Badge>
              </SectionTitle>
              <InfoSubtitle>
                Pruebas antes de solicitar mantenimiento
              </InfoSubtitle>
              <InfoText>
                {Array.isArray(producto["Mantenimiento preventivo"]) ? (
                  <ul>
                    {producto["Mantenimiento preventivo"].map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>
                    {producto["Mantenimiento preventivo"] || "No hay información específica disponible sobre mantenimiento preventivo para este producto."}
                  </p>
                )}
              </InfoText>
              {producto["Frecuencia mantenimiento"] && (
                <DetailItem>
                  <FaCalendarAlt style={{ marginRight: 7, color: "#10b981" }} />
                  <span><strong>Frecuencia:</strong> {producto["Frecuencia mantenimiento"]}</span>
                </DetailItem>
              )}
            </InfoCardVibrant>

            <CardSeparator>
              <FaTools size={38} color="#60a5fa" />
            </CardSeparator>

            <InfoCardVibrant>
              <SectionTitle>
                <FaTools /> Mantenimiento
                <Badge correctivo>CORRECTIVO</Badge>
              </SectionTitle>
              <InfoSubtitle>
                Si tu equipo sigue fallando, ofrecemos soporte técnico.
              </InfoSubtitle>
              <InfoText>
                {producto["Mantenimiento correctivo"] || "No hay información específica disponible sobre mantenimiento correctivo para este producto."}
              </InfoText>
              {producto["Tiempo respuesta"] && (
                <DetailItem>
                  <FaCalendarAlt style={{ marginRight: 7, color: "#3b82f6" }} />
                  <span><strong>Respuesta:</strong> {producto["Tiempo respuesta"]}</span>
                </DetailItem>
              )}
            </InfoCardVibrant>
          </CardsFlex>
        ) : (
          <CardsFlex>
            <InfoCardVibrant style={{ maxWidth: 540, margin: "0 auto" }}>
              <SectionTitle>
                <FaUserCog /> Tutorial & Soporte
                <Badge tutorial>TUTORIAL</Badge>
              </SectionTitle>
              <InfoText>
                {producto["Soporte y mantenimiento"] || "Para asistencia técnica con este producto, por favor contacte a nuestro equipo de soporte."}
              </InfoText>
              {producto.Video && (
                <VideoSection>
                  <DetailItem>
                    <FaVideo style={{ marginRight: 8, color: "#10b981" }} />
                    <span><strong>Video tutorial</strong></span>
                  </DetailItem>
                  <VideoLink
                    href={producto.Video}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver video tutorial del producto
                  </VideoLink>
                </VideoSection>
              )}
            </InfoCardVibrant>
          </CardsFlex>
        )}
      </FadeSection>
      <Footer />
    </MainContainer>
  );
};

export default Manual;

// Animaciones y estilos
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(40px);}
  to { opacity: 1; transform: translateY(0);}
`;

const MainContainer = styled.div`
  font-family: 'Poppins', sans-serif;
  background: #f7fafd;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  display: flex;
  align-items: flex-end;
  background: linear-gradient(95deg,#e8eefd 60%,#ffffff 100%);
  border-radius: 28px;
  box-shadow: 0 8px 32px rgba(44,80,150,0.10);
  margin: 28px auto 0 auto;
  max-width: 1100px;
  padding: 38px 38px 26px 38px;
  position: relative;
  gap: 44px;
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 22px;
    padding: 26px 12px 22px 12px;
  }
`;

const HeroImageContainer = styled.div`
  min-width: 220px;
  max-width: 260px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 3px 18px rgba(44,80,150,0.08);
  padding: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 180px;
`;

const HeroImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 210px;
  border-radius: 12px;
  object-fit: contain;
`;

const ImagePlaceholder = styled.div`
  background: #f0f3fa;
  border-radius: 10px;
  height: 160px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
  font-size: 1rem;
  gap: 8px;
`;

const HeroDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  h1 {
    font-size: 2.25rem;
    color: #193965;
    font-weight: 700;
    margin-bottom: 8px;
    letter-spacing: 0.5px;
  }
`;

const HeroInfo = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin: 0 0 16px 0;
  @media (max-width: 700px) {
    justify-content: center;
    gap: 14px;
  }
`;

const InfoBox = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(44,80,150,0.07);
  padding: 8px 22px;
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  strong {
    color: #345475;
    font-size: 0.99rem;
    margin-bottom: 2px;
    font-weight: 600;
  }
  span {
    color: #1a222b;
    font-size: 1.08rem;
    font-weight: 500;
  }
`;

const HeroDesc = styled.div`
  color: #3d5a80;
  font-size: 1.13rem;
  font-weight: 500;
  background: #eaf2fd;
  border-radius: 8px;
  padding: 5px 20px;
  display: inline-block;
  margin-top: 4px;
  letter-spacing: 0.2px;
`;

const SoporteBtn = styled.button`
  position: absolute;
  top: 28px;
  right: 38px;
  background: #345475;
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 10px 26px 10px 22px;
  font-size: 1.01rem;
  font-weight: 600;
  box-shadow: 0 2px 14px rgba(44,80,150,0.13);
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: background 0.19s, box-shadow 0.19s;
  z-index: 2;
  &:hover {
    background: #233553;
    box-shadow: 0 4px 18px rgba(44,80,150,0.18);
  }
  @media (max-width: 900px) {
    position: static;
    margin: 16px auto 0 auto;
  }
`;

const StickyTabs = styled.div`
  display: flex;
  border-radius: 13px;
  overflow: hidden;
  margin: 38px auto 0 auto;
  gap: 18px; /* <-- ¡Aquí está el espacio entre los botones! */
  border: 1.5px solid #e0e7ef;
  background: #f9fbfd;
  max-width: 720px;
  box-shadow: 0 2px 18px rgba(44,80,150,0.07);
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 4px; /* Un poco de padding interno queda bonito */
`;

const TabBtn = styled.button`
  flex: 1;
  padding: 18px 0;
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
  transition: background 0.16s, color 0.16s;
  background: ${(props) => (props.active ? "#eaf0fa" : "none")};
  box-shadow: ${(props) => props.active ? "0 4px 18px rgba(52,84,117,0.04)" : "none"};
  border-bottom: ${(props) =>
    props.active ? "3px solid #345475" : "3px solid transparent"};
  &:hover {
    background: #eaf0fa;
    color: #233553;
  }
`;

const FadeSection = styled.div`
  animation: ${fadeUp} 0.48s;
  margin: 38px auto 42px auto;
  max-width: 1100px;
`;

const CardsFlex = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 28px;
  @media (max-width: 950px) {
    flex-direction: column;
    gap: 32px;
  }
`;

const InfoCardVibrant = styled.div`
  background: linear-gradient(120deg, #f8fafc 90%, #e0e7ff 100%);
  border-radius: 22px;
  padding: 36px 28px 30px 28px;
  box-shadow: 0 8px 40px 0 rgba(52,84,117,0.11);
  min-width: 310px;
  flex: 1;
  animation: ${fadeUp} 0.85s;
  border: 2.5px solid #e0e7ff;
  position: relative;
  @media (max-width: 950px) {
    min-width: 0;
    width: 100%;
  }
`;

const CardSeparator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  @media (max-width: 950px) {
    display: none;
  }
`;

const Badge = styled.span`
  margin-left: 16px;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 3px 13px;
  border-radius: 20px;
  background: ${({ preventivo, correctivo, tutorial }) =>
    preventivo ? "#d1fae5"
    : correctivo ? "#dbeafe"
    : tutorial ? "#fef9c3"
    : "#e5e7eb"};
  color: ${({ preventivo, correctivo, tutorial }) =>
    preventivo ? "#059669"
    : correctivo ? "#2563eb"
    : tutorial ? "#c27803"
    : "#374151"};
  letter-spacing: 1px;
  vertical-align: middle;
`;

const SectionTitle = styled.h3`
  font-size: 1.22rem;
  color: #2c3e50;
  font-weight: 700;
  margin-bottom: 13px;
  display: flex;
  align-items: center;
  gap: 13px;
`;

const InfoSubtitle = styled.h4`
  font-size: 1.06rem;
  color: #345475;
  font-weight: 500;
  margin-bottom: 13px;
`;

const InfoText = styled.div`
  font-size: 16px;
  color: #555;
  line-height: 1.65;
  margin-bottom: 17px;
  ul {
    padding-left: 28px;
    margin: 10px 0;
  }
  li {
    margin-bottom: 7px;
    line-height: 1.5;
  }
`;

const VideoSection = styled.div`
  margin: 20px 0 0 0;
  padding: 14px;
  background: #f8fafc;
  border-radius: 10px;
`;

const VideoLink = styled.a`
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  margin-top: 10px;
  display: inline-block;
  &:hover {
    color: #2980b9;
    text-decoration: underline;
  }
`;

const DetailItem = styled.div`
  margin-bottom: 10px;
  font-size: 15px;
  color: #555;
  line-height: 1.5;
  display: flex;
  align-items: center;
`;

const HeroSkeleton = styled.div`
  display: flex;
  align-items: flex-end;
  background: linear-gradient(95deg,#e8eefd 60%,#ffffff 100%);
  border-radius: 28px;
  box-shadow: 0 8px 32px rgba(44,80,150,0.10);
  margin: 28px auto 0 auto;
  max-width: 1100px;
  padding: 38px 38px 26px 38px;
  gap: 44px;
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 22px;
    padding: 26px 12px 22px 12px;
  }
`;