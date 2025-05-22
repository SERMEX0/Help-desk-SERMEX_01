import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  FaTools,
  FaVideo,
  FaEnvelope,
  FaCalendarAlt,
  FaUserCog
} from "react-icons/fa";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styled, { css } from "styled-components";

const Manual = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [activeTab, setActiveTab] = useState('tutorial');
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
        <Content>
          <Skeleton height={40} width={300} style={{ marginBottom: 30 }} />
          <LoadingGrid>
            <div>
              <Skeleton height={300} style={{ borderRadius: 12 }} />
            </div>
            <div>
              <Skeleton height={30} width="80%" style={{ marginBottom: 20 }} />
              <Skeleton height={20} count={4} style={{ marginBottom: 15 }} width="90%" />
              <Skeleton height={20} count={3} style={{ marginBottom: 15 }} width="70%" />
            </div>
          </LoadingGrid>
        </Content>
        <Footer />
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <Header />
      <Content>
        <SectionHeader>
          <h1>{producto.Nombre || "Producto sin nombre"}</h1>
          <p>Manual de operación y mantenimiento</p>
        </SectionHeader>

        <MainLayout>
          <LeftPanel>
            <ImageContainer>
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt="Producto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
                  }}
                />
              ) : (
                <ImagePlaceholder>
                  <FaTools size={48} />
                  <span>Imagen no disponible</span>
                </ImagePlaceholder>
              )}
            </ImageContainer>
            <ProductDetails>
              {producto.Modelo && (
                <DetailItem>
                  <strong>Modelo:</strong> {producto.Modelo}
                </DetailItem>
              )}
              {producto["Número de serie"] && (
                <DetailItem>
                  <strong>Número de serie:</strong> {producto["Número de serie"]}
                </DetailItem>
              )}
              {producto["Fecha de compra"] && (
                <DetailItem>
                  <strong>Fecha de compra:</strong> {producto["Fecha de compra"]}
                </DetailItem>
              )}
            </ProductDetails>
          </LeftPanel>

          <RightPanel>
            <Tabs>
              <TabBtn
                active={activeTab === 'tutorial'}
                onClick={() => setActiveTab('tutorial')}
              >
                <FaUserCog /> Tutorial del producto
              </TabBtn>
              <TabBtn
                active={activeTab === 'mantenimiento'}
                onClick={() => setActiveTab('mantenimiento')}
              >
                <FaTools /> Mantenimiento
              </TabBtn>
            </Tabs>

            <TabContent>
              {activeTab === 'mantenimiento' ? (
                <InfoSection>
                  <InfoCard>
                    <SectionTitle>
                      <FaTools /> Mantenimiento Preventivo
                    </SectionTitle>

                    <InfoSubtitle>
                      Pruebas a realizar antes de solicitar mantenimiento
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
                        <FaCalendarAlt style={{ marginRight: 7, color: "#345475" }} />
                        <span><strong>Frecuencia recomendada:</strong> {producto["Frecuencia mantenimiento"]}</span>
                      </DetailItem>
                    )}
                  </InfoCard>

                  <InfoCard>
                    <SectionTitle>
                      <FaTools /> Mantenimiento Correctivo
                    </SectionTitle>
                    <InfoSubtitle>
                      Si tu equipo sigue presentando fallas, ofrecemos soporte técnico
                    </InfoSubtitle>
                    <InfoText>
                      {producto["Mantenimiento correctivo"] || "No hay información específica disponible sobre mantenimiento correctivo para este producto."}
                    </InfoText>
                    {producto["Tiempo respuesta"] && (
                      <DetailItem>
                        <FaCalendarAlt style={{ marginRight: 7, color: "#345475" }} />
                        <span><strong>Tiempo de respuesta:</strong> {producto["Tiempo respuesta"]}</span>
                      </DetailItem>
                    )}
                  </InfoCard>
                </InfoSection>
              ) : (
                <InfoSection>
                  <InfoCard>
                    <SectionTitle>
                      <FaUserCog /> Tutorial y Soporte
                    </SectionTitle>
                    <InfoText>
                      {producto["Soporte y mantenimiento"] || "Para asistencia técnica con este producto, por favor contacte a nuestro equipo de soporte."}
                    </InfoText>

                    {producto.Video && (
                      <VideoSection>
                        <DetailItem>
                          <FaVideo style={{ marginRight: 8, color: "#345475" }} />
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

                  </InfoCard>
                </InfoSection>
              )}
            </TabContent>
          </RightPanel>
        </MainLayout>
      </Content>
      <Footer />
    </MainContainer>
  );
};

export default Manual;

// Styled Components
const MainContainer = styled.div`
  font-family: 'Poppins', sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 18px 24px 18px;
  flex: 1;
  width: 100%;
`;

const SectionHeader = styled.div`
  margin-bottom: 28px;
  h1 {
    font-size: 2rem;
    color: #2c3e50;
    font-weight: 600;
    margin-bottom: 4px;
  }
  p {
    font-size: 1.06rem;
    color: #7f8c8d;
    font-weight: 400;
    margin: 0;
  }
`;

const MainLayout = styled.div`
  display: flex;
  flex-direction: row;
  gap: 40px;
  align-items: flex-start;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 28px;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const ImageContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 220px;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  max-height: 300px;
  border-radius: 8px;
  object-fit: contain;
`;

const ImagePlaceholder = styled.div`
  background: #f0f0f0;
  border-radius: 8px;
  height: 180px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
  font-size: 1rem;
  gap: 8px;
`;

const ProductDetails = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
`;

const DetailItem = styled.div`
  margin-bottom: 12px;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  display: flex;
  align-items: center;
`;

const RightPanel = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1.5px solid #e0e0e0;
  overflow-x: auto;
  padding-bottom: 1px;
  gap: 3px;
`;

const TabBtn = styled.button`
  padding: 12px 22px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 9px;
  white-space: nowrap;
  transition: color 0.2s, border-color 0.2s;
  ${(props) =>
    props.active &&
    css`
      color: #345475;
      border-bottom: 3px solid #345475;
      font-weight: 600;
    `}
  &:hover {
    color: #345475;
  }
`;

const TabContent = styled.div`
  flex: 1;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const InfoCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px 20px 20px 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
`;

const SectionTitle = styled.h3`
  font-size: 1.22rem;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InfoSubtitle = styled.h4`
  font-size: 1.09rem;
  color: #345475;
  font-weight: 500;
  margin-bottom: 12px;
`;

const InfoText = styled.div`
  font-size: 15px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 15px;
  ul {
    padding-left: 24px;
    margin: 10px 0;
  }
  li {
    margin-bottom: 8px;
    line-height: 1.5;
  }
`;

const VideoSection = styled.div`
  margin: 20px 0 0 0;
  padding: 14px;
  background: #f8fafc;
  border-radius: 8px;
`;

const VideoLink = styled.a`
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  display: inline-block;
  margin-top: 8px;
  &:hover {
    color: #2980b9;
    text-decoration: underline;
  }
`;

const LoadingGrid = styled.div`
  display: flex;
  gap: 30px;
  flex-direction: row;
`;
