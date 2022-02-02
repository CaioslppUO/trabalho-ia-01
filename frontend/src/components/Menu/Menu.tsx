import { Flex, Button, Input, Heading, Box } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { MainContext } from "../../contexts/Main";
import { ArrowBack } from "../ArrowBack/Arrowback";
import { Canvas } from "../Canvas/Canvas";
import { FileSelector } from "../FileSelector/FileSelector";
import { MenuItem } from "./MenuItem/MenuItem";
import { process_entry_file } from "../../model/file";

export const Menu = () => {
  const { setTab, tab } = useContext(MainContext);
  const [file1, setFile1] = useState<string | ArrayBuffer>("");
  const [file2, setFile2] = useState<string | ArrayBuffer>("");

  return (
    <Flex
      maxWidth="1920px"
      marginX="auto"
      alignItems="center"
      flexDirection="column"
    >
      {tab !== 0 && <ArrowBack onClick={() => setTab(0)} />}
      {tab === 0 && (
        <FileSelector
          title="Selecione o arquivo de salas"
          onSelected={(data) => {
            setFile1(data);
            setTab(1);
          }}
        />
      )}

      {tab === 1 && (
        <FileSelector
          title="Selecione o arquivo de distâncias euclidianas"
          onSelected={(data) => {
            console.log(
              process_entry_file(file1 as string, data as string).graph
            );
          }}
        />
      )}

      {tab === 2 && (
        <Flex flexDirection="column">
          <Heading marginBottom="30px">Selecione o algoritmo:</Heading>
          <MenuItem title="Algoritmo 1" />
          <MenuItem title="Algoritmo 2" />
          <MenuItem title="Algoritmo 3" />
        </Flex>
      )}
      {tab === 3 && <Canvas />}
    </Flex>
  );
};
