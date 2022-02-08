import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";
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
        <Box {...containerStyle}>
          <Menu />
        </Box>
      </MainContextProvider>
    </div>
  );
}

export default App;

// Estilo do container da aplicação
const containerStyle: BoxProps = {
  maxWidth: "1920px",
  marginX: "auto",
};
