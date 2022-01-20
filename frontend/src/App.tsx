import React from "react";
import { Home } from "./components/Home";
import { Flex } from "@chakra-ui/react";

function App() {
  return (
    <div className="App">
      <Flex
        align="center"
        justifyContent="center"
        flexDirection="column"
        w="100vw"
        h="100vh"
      >
        <Home />
      </Flex>
    </div>
  );
}

export default App;
