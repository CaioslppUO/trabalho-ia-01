import { Button, Flex, Heading, MenuItem, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { MainContext } from "../../contexts/Main";
import { ArrowBack } from "../ArrowBack/ArrowBack";
import { FileSelector } from "../FileSelector/FileSelector";
import { process_entry_file } from "../../model/file";
import { MainVisualizer } from "../MainVisualizer/MainVisualizer";
import { VertexSelector } from "../VertexSelector/VertexSelector";

export const Menu = () => {
  const {
    setTab,
    tab,
    setMainGraph,
    setStartVertex,
    setEndVertex,
    clearVisualGraph,
    setOptimization,
  } = useContext(MainContext);

  return (
    <Flex
      w="90vw"
      maxWidth="1920px"
      marginX="auto"
      alignItems="center"
      flexDirection="column"
    >
      {tab !== 0 && (
        <ArrowBack
          onClick={() => {
            clearVisualGraph();
            setTab(tab > 1 ? tab - 1 : 0);
          }}
        />
      )}
      {tab === 0 && (
        <FileSelector
          title="Selecione o arquivo de entrada"
          onSelected={(data) => {
            setMainGraph(process_entry_file(data as string));
            setTab(1);
          }}
        />
      )}

      {tab === 1 && (
        <VertexSelector
          onSelect={(v) => {
            setStartVertex(v);
            setTab(2);
          }}
          title="Selecione a origem"
        />
      )}
      {tab === 2 && (
        <VertexSelector
          title="Selecione o destino"
          onSelect={(v) => {
            setEndVertex(v);
            setTab(3);
          }}
        />
      )}
      {tab === 3 && (
        <Flex
          height={"100vh"}
          alignItems={"center"}
          justifyContent={"center"}
          flexDirection={"column"}
        >
          <Heading marginBottom={"50px"}>
            Selecione o parâmetro de otimização
          </Heading>

          <Button
            onClick={() => {
              setOptimization(true);
              setTab(tab + 1);
            }}
            marginBottom={"20px"}
            colorScheme={"purple"}
          >
            Distância
          </Button>
          <Button
            onClick={() => {
              setOptimization(false);
              setTab(tab + 1);
            }}
            colorScheme={"purple"}
          >
            Número de vértices
          </Button>
        </Flex>
        // <h1>Hello</h1>
      )}
      {tab === 4 && <MainVisualizer />}
    </Flex>
  );
};
