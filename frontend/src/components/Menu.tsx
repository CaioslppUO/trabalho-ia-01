import { Flex, Button, Input, Heading, Box } from "@chakra-ui/react";
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { Home } from "./Home";
import { MenuItem } from "./MenuItem";

export const Menu = () => {
  const [tab, setTab] = useState(1);
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
    </Flex>
  );
};
