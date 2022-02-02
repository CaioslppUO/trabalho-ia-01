import React from "react";
import { Flex, FlexProps } from "@chakra-ui/react";
import { Menu } from "../Menu/Menu";
import { MainContextProvider } from "../../contexts/Main";

/**
 * Componente principal da aplicação
 * @returns React component
 */
function App() {
  return (
    <div className="App">
      <MainContextProvider>
        <Flex {...containerStyle}>
          <Menu />
        </Flex>
      </MainContextProvider>
    </div>
  );
}

export default App;

// Estilo do container da aplicação
const containerStyle: FlexProps = {
  align: "center",
  justifyContent: "center",
  flexDirection: "column",
  w: "100vw",
  maxWidth: "1920px",
  marginX: "auto",
  h: "100vh",
};
