import { Flex, Button, Input, Heading, Box } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { MainContext } from "../../contexts/Main";
import { ArrowBack } from "../ArrowBack/Arrowback";
import { Canvas } from "../Canvas/Canvas";
import { FileSelector } from "../FileSelector/FileSelector";
import { MenuItem } from "./MenuItem/MenuItem";

export const Menu = () => {
  const { setTab, tab } = useContext(MainContext);

  return (
    <Flex alignItems="center" flexDirection="column">
      {tab !== 0 && <ArrowBack onClick={() => setTab(0)} />}
      {tab === 0 && <FileSelector />}

      {tab === 1 && (
        <Flex flexDirection="column">
          <Heading marginBottom="30px">Selecione o algoritmo:</Heading>
          <MenuItem title="Algoritmo 1" />
          <MenuItem title="Algoritmo 2" />
          <MenuItem title="Algoritmo 3" />
        </Flex>
      )}
      {tab === 2 && <Canvas />}
    </Flex>
  );
};
