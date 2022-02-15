import { Flex, Heading, Button } from "@chakra-ui/react";
import { useContext } from "react";
import { MainContext } from "../../contexts/Main";

export const AlgorithmSelector = () => {
  const { setOptimization, setTab, tab, setAlgorithm, execute } =
    useContext(MainContext);
  return (
    <Flex
      height={"100vh"}
      alignItems={"center"}
      justifyContent={"center"}
      flexDirection={"column"}
    >
      <Heading marginBottom={"50px"}>
        Selecione o algoritmo a ser executado
      </Heading>

      <Button
        onClick={() => {
          setAlgorithm("a_star");
          setOptimization(true);
          setTab(tab + 1);
        }}
        marginBottom={"20px"}
        colorScheme={"purple"}
      >
        A* otimizado com distância (Melhor abordagem)
      </Button>
      <Button
        onClick={() => {
          setAlgorithm("a_star");
          setOptimization(false);
          setTab(tab + 1);
        }}
        marginBottom={"20px"}
        colorScheme={"purple"}
      >
        A* otimizado com número de vértices (Melhor abordagem)
      </Button>

      <Button
        onClick={() => {
          setAlgorithm("dfs");
          setTab(tab + 1);
        }}
        colorScheme={"purple"}
      >
        Busca em profundidade (Pior abordagem)
      </Button>
    </Flex>
  );
};
