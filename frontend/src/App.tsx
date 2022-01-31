import React from "react";
import { Home } from "./components/Home";
import { Flex } from "@chakra-ui/react";
import { Menu } from "./components/Menu";
import { AuthContextProvider } from "./contexts/Main";

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <Flex
          align="center"
          justifyContent="center"
          flexDirection="column"
          w="100vw"
          h="100vh"
        >
          <Menu />
        </Flex>
      </AuthContextProvider>
    </div>
  );
}

export default App;
