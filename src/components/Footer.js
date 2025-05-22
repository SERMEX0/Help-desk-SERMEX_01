import styled from 'styled-components';

const FooterContainer = styled.footer`
  width: 100%;
  background-color: #345475;
  color: #ffffff;
  text-align: center;
  padding: 20px 0;
`;

const LogoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px;
`;

const Logo = styled.img`
  width: 100px;
  height: 48px;
  object-fit: contain;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const partnerLogos = [
  { src: "/images/vicon.png", alt: "Vicon logo" },
  { src: "/images/od.png", alt: "OD logo" },
  { src: "/images/milesight.png", alt: "Milesight logo" },
  { src: "/images/flir.png", alt: "FLIR logo" },
  { src: "/images/eagle.png", alt: "Eagle logo" },
  { src: "/images/density.png", alt: "Density logo" },
  { src: "/images/ceia.png", alt: "CEIA logo" },
  { src: "/images/flexradio.png", alt: "FlexRadio logo" },
  { src: "/images/id3.png", alt: "ID3 logo" },
  { src: "/images/or-technology.png", alt: "OR Technology logo" },
  { src: "/images/trafictec.png", alt: "Trafictec logo" },
  { src: "/images/louroe.png", alt: "Louroe logo" },
];

const Footer = () => {
  return (
    <FooterContainer>
      <p>© 2025 En Proceso de Certificación ISO 9001:2015.</p>
      <LogoGrid>
        {partnerLogos.map((logo, index) => (
          <Logo 
            key={index}
            src={logo.src}
            alt={logo.alt}
            loading="lazy"
          />
        ))}
      </LogoGrid>
    </FooterContainer>
  );
};

export default Footer;