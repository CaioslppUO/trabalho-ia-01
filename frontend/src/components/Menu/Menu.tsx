import { Flex, Heading, Box } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";

import { MainContext } from "../../contexts/Main";
import { ArrowBack } from "../ArrowBack/Arrowback";
import { GraphVisualizer } from "../MainVisuzalizer/GraphVisualizer";
import { FileSelector } from "../FileSelector/FileSelector";
import { MenuItem } from "./MenuItem/MenuItem";
import { process_entry_file } from "../../model/file";
import { a_star } from "../../model/algorithms/a_start";
import { MainVisualizer } from "../MainVisuzalizer/MainVisualizer";
import { VertexSelector } from "../VertexSelector/VertexSelector";

const h =
  "pode_ir(a, b, 100)\npode_ir(a, c, 50)\npode_ir(b, d, 150)\npode_ir(d, e, 200)\npode_ir(e, f, 100)\npode_ir(c, g, 100)\npode_ir(g, f, 150)";
const e_h =
  "dist_euclidiana(a, b, 50)\ndist_euclidiana(a, c, 30)\ndist_euclidiana(a, d, 100)\ndist_euclidiana(a, e, 350)\ndist_euclidiana(a, f, 300)\ndist_euclidiana(a, g, 100)\ndist_euclidiana(b, c, 120)\ndist_euclidiana(b, d, 100)\ndist_euclidiana(b, e, 200)\ndist_euclidiana(b, f, 90)\ndist_euclidiana(b, g, 200)\ndist_euclidiana(c, d, 300)\ndist_euclidiana(c, e, 400)\ndist_euclidiana(c, f, 180)\ndist_euclidiana(c, g, 70)\ndist_euclidiana(d, e, 160)\ndist_euclidiana(d, f, 250)\ndist_euclidiana(d, g, 120)\ndist_euclidiana(e, f, 50)\ndist_euclidiana(e, g, 220)\ndist_euclidiana(f, g, 120) ";

export const Menu = () => {
  const { setTab, tab, setMainGraph, setStartVertex, setEndVertex } =
    useContext(MainContext);
  const [file1, setFile1] = useState<string | ArrayBuffer>("");

  useEffect(() => {
    setMainGraph(process_entry_file(h, e_h));
  }, []);

  return (
    <Flex
      w="90vw"
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
            // setExplorePath(a_star(graph).run("a", "f") as any);
          }}
        />
      )}

      {tab === 2 && (
        <VertexSelector
          onSelect={(v) => {
            setStartVertex(v);
            setTab(3);
          }}
          title="Selecione a origem"
        />
      )}
      {tab === 3 && (
        <VertexSelector
          title="Selecione o destino"
          onSelect={(v) => {
            setEndVertex(v);
            setTab(4);
          }}
        />
      )}
      {tab === 4 && <MainVisualizer />}
    </Flex>
  );
};
