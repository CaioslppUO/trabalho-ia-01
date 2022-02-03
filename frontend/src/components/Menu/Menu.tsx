import { Flex, Heading } from "@chakra-ui/react";
import { useContext, useState } from "react";

import { MainContext } from "../../contexts/Main";
import { ArrowBack } from "../ArrowBack/Arrowback";
import { Canvas } from "../Canvas/Canvas";
import { FileSelector } from "../FileSelector/FileSelector";
import { MenuItem } from "./MenuItem/MenuItem";
import { process_entry_file } from "../../model/file";
import { a_star } from "../../model/algorithms/a_start";
import { Canvas2 } from "../Canvas/Canvas2";
import { Canvas3 } from "../Canvas/Canvas3";

export const Menu = () => {
  const { setTab, tab, setMainGraph, setExplorePath } = useContext(MainContext);
  const [file1, setFile1] = useState<string | ArrayBuffer>("");

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
          title="Selecione o arquivo de: Salas"
          onSelected={(data) => {
            setFile1(data);
            setTab(1);
          }}
        />
      )}

      {tab === 1 && (
        <FileSelector
          title="Selecione o arquivo de: Distâncias euclidianas"
          onSelected={(data) => {
            setTab(3);
            const graph = process_entry_file(file1 as string, data as string);
            setMainGraph(graph);
            setExplorePath(a_star(graph).run("a", "f") as any);
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
      {tab === 4 && <Canvas2 />}
      {tab === 3 && <Canvas3 />}
    </Flex>
  );
};
