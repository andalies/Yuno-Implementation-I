import styled from "styled-components";
import { cores } from "../../styles";

const rose = cores?.rosa || "#F06C7A";
const ink = "#222";

export const Container = styled.header`
  width: 100%;
  padding: 48px 16px 32px;
  text-align: center;
`;

export const Title = styled.h1`
  font-family: "WindSong", cursive;
  font-size: clamp(40px, 6vw, 72px);
  font-weight: 600;
  margin: 0;
  color: ${ink};
`;

export const Subtitle = styled.p`
  font-family: "Playfair Display", ui-serif, Georgia, serif;
  font-size: clamp(14px, 2vw, 18px);
  font-weight: 500;
  color: ${rose};
  margin-top: 12px;
  margin-bottom: 0;
`;
