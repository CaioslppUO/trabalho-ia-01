import { Flex, Button, Input, Heading, Box } from "@chakra-ui/react";
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { Canvas } from "./Canvas";
import { Home } from "./Home";
import { MenuItem } from "./MenuItem";

var graph = {
  nodes: [
    { name: "1", value: 2, color: "#3d3d3d", x: 0, y: 0 },
    { name: "2", value: 2, color: "#3d3d3d", x: 0, y: 0 },
    { name: "3", value: 2, color: "#3d3d3d", x: 0, y: 0 },
    { name: "4", value: 2, color: "#3d3d3d", x: 0, y: 0 },
    { name: "5", value: 2, color: "#3d3d3d", x: 0, y: 0 },
    { name: "6", value: 2, color: "#3d3d3d", x: 0, y: 0 },
    { name: "9", value: 2, color: "#3d3d3d", x: 0, y: 0 },
    { name: "16", value: 2, color: "#3d3d3d", x: 0, y: 0 },
    { name: "21", value: 2, color: "#3d3d3d", x: 0, y: 0 },
  ],
  links: [
    { source: "1", target: "2", color: "gray", distance: 100 },
    { source: "2", target: "3", color: "gray", distance: 50 },
    { source: "2", target: "4", color: "gray", distance: 60 },
    { source: "2", target: "5", color: "gray", distance: 70 },
    { source: "2", target: "9", color: "gray", distance: 50 },
    { source: "5", target: "21", color: "gray", distance: 10 },
    { source: "5", target: "16", color: "gray", distance: 90 },
    { source: "5", target: "6", color: "gray", distance: 80 },
  ],
};

export const Menu = () => {
  const [tab, setTab] = useState(2);

  return (
    <Flex alignItems="center" flexDirection="column">
      {tab !== 0 && (
        <Box
          cursor="pointer"
          _hover={{ opacity: "0.6" }}
          position="fixed"
          top="20px"
          left="20px"
          onClick={() => setTab(0)}
        >
          <IoMdArrowBack size="30px" />
        </Box>
      )}
      {tab === 0 && <Home />}

      {tab === 1 && (
        <Flex flexDirection="column">
          <Heading marginBottom="30px">Selecione o algoritmo:</Heading>
          <MenuItem title="Algoritmo 1" />
          <MenuItem title="Algoritmo 2" />
          <MenuItem title="Algoritmo 3" />
        </Flex>
      )}
      {tab === 2 && <Canvas graph={graph} />}
    </Flex>
  );
};
