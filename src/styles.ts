import styled, { createGlobalStyle } from "styled-components";

export const cores = {
  begeclaro: "#FFF8F2",
  bege: "#FFEBD9",
  rosa: "#816643ff",
  branco: "#FFFFFF",
};

export const GlobalCss = createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
     font-family: "Newsreader", serif;
  font-optical-sizing: auto;
  font-weight: <weight>;
  font-style: normal;
  }

  body {
    background-color: ${cores.begeclaro};
  }
`;

export const Container = styled.div`
  max-width: 1024px;
  width: 100%;
  margin: 0 auto;
`;
