import { useContext, useState } from "react";
import { Box, Button, Flex, Text, Divider } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { GraphVisualizer } from "../GraphVisuzlizer/GraphVisualizer";
import { ExploreProps, MainContext } from "../../contexts/Main";
import {
  borderColor,
  edgeColor,
  edgeStraightPathColor,
  edgeVisitedColor,
  vertexColor,
  vertexStraightPathColor,
  vertexVisitedColor,
} from "../../styles/graph";

/**
 * Componente responsável por mostrar o grafo na tela e os comandos para visualizar o algoritmo em funcionamento
 * @returns
 */
export const MainVisualizer = () => {
  const {
    tableData,
    visualGraph,
    setVisualGraph,
    explorePath,
    startVertex,
    straightPath,
    distStraighPath,
    optimization,
    distTotal,
  } = useContext(MainContext);

  const [visited, setVisited] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [stepsBack, setStepsBack] = useState<ExploreProps[]>([]);
  const [showDistStraightPath, setShowDistStraightPath] = useState(false);

  /**
   * Função responsável por mostrar o resultado final do algoritmo
   */
  function showAllProcess() {
    while (explorePath.length > 0) {
      const item = explorePath.shift();
      if (!!item) {
        stepsBack.unshift(item);
      }
    }
    const nodes = visualGraph.nodes.map((n) => {
      if (
        stepsBack.find((e) => e.dstVertex === n.name) ||
        n.name === startVertex
      ) {
        n.color = vertexVisitedColor;
      }
      return n;
    });

    const links = visualGraph.links.map((n) => {
      if (
        stepsBack.find(
          (e) =>
            // @ts-ignore
            (e.srcVertex === n.source.name && e.dstVertex === n.target.name) ||
            // @ts-ignore
            (e.dstVertex === n.source.name && e.srcVertex === n.target.name)
        )
      ) {
        n.color = edgeVisitedColor;
      }

      return n;
    });
    if (stepsBack.length >= 1) {
      setVisited(stepsBack[0].visited);
      setTotalDistance(distTotal);
    }

    setVisualGraph({
      nodes,
      links,
    });

    showStraightpath();
  }

  /**
   * Função responsável por mostrar o próximo passo do algoritmo
   */
  function showNextStep() {
    if (explorePath.length > 0) {
      const nodes = visualGraph.nodes.map((n) => {
        if (
          explorePath[0].srcVertex === n.name ||
          explorePath[0].dstVertex === n.name
        ) {
          n.color = vertexVisitedColor;
        }
        return n;
      });

      const links = visualGraph.links.map((n) => {
        // console.log(n);
        if (
          // @ts-ignore
          (explorePath[0].srcVertex === n.source.name &&
            // @ts-ignore
            explorePath[0].dstVertex === n.target.name) ||
          // @ts-ignore
          (explorePath[0].dstVertex === n.source.name &&
            // @ts-ignore
            explorePath[0].srcVertex === n.target.name)
        ) {
          n.color = edgeVisitedColor;
        }

        return n;
      });
      setVisited(explorePath[0].visited);
      setTotalDistance(totalDistance + explorePath[0].local_distance);

      const item = explorePath.shift();

      if (!!item) {
        stepsBack.unshift(item);
      }

      setVisualGraph({
        nodes,
        links,
      });
    } else {
      showStraightpath();
    }
  }

  /**
   * Função responsável por mostrar passo anterior do algoritmo
   */
  function showStepBack() {
    if (showDistStraightPath) {
      setShowDistStraightPath(false);
      const nodes = visualGraph.nodes.map((n) => {
        if (
          stepsBack.find((e) => e.dstVertex === n.name) ||
          n.name === startVertex
        ) {
          n.color = vertexVisitedColor;
        }
        return n;
      });
      const links = visualGraph.links.map((n) => {
        if (
          stepsBack.find(
            (e) =>
              // @ts-ignore
              (e.srcVertex === n.source.name &&
                // @ts-ignore
                e.dstVertex === n.target.name) ||
              // @ts-ignore
              (e.dstVertex === n.source.name && e.srcVertex === n.target.name)
          )
        ) {
          n.color = edgeVisitedColor;
        }
        return n;
      });
      if (stepsBack.length >= 1) {
        setVisited(stepsBack[0].visited);
        setTotalDistance(distTotal);
      }
      setVisualGraph({
        nodes,
        links,
      });
      while (explorePath.length > 0) {
        const item = explorePath.shift();
        if (!!item) {
          stepsBack.unshift(item);
        }
      }
    } else {
      if (stepsBack.length > 0) {
        const nodes = visualGraph.nodes.map((n) => {
          if (stepsBack[0].dstVertex === n.name) {
            n.color = vertexColor;
          }
          return n;
        });

        const links = visualGraph.links.map((n) => {
          if (
            // @ts-ignore
            (stepsBack[0].srcVertex === n.source.name &&
              // @ts-ignore
              stepsBack[0].dstVertex === n.target.name) ||
            // @ts-ignore
            (stepsBack[0].dstVertex === n.source.name &&
              // @ts-ignore
              stepsBack[0].srcVertex === n.target.name)
          ) {
            n.color = edgeColor;
          }

          return n;
        });
        setVisited(stepsBack[0].visited);
        setTotalDistance(totalDistance - stepsBack[0].local_distance);

        const item = stepsBack.shift();

        if (!!item) {
          explorePath.unshift(item);
          // console.log(stepsBack);
        }

        setVisualGraph({
          nodes,
          links,
        });
      }
    }
  }

  /**
   * Função responsável por mostrar o menor caminho
   */
  function showStraightpath() {
    const nodes = visualGraph.nodes.map((n) => {
      if (
        straightPath.find((e) => e.dstVertex === n.name) ||
        n.name === startVertex
      ) {
        n.color = vertexStraightPathColor;
      }
      return n;
    });

    const links = visualGraph.links.map((n) => {
      if (
        straightPath.find(
          (e) =>
            // @ts-ignore
            (e.srcVertex === n.source.name && e.dstVertex === n.target.name) ||
            // @ts-ignore
            (e.srcVertex === n.target.name && e.dstVertex === n.source.name)
        )
      ) {
        n.color = edgeStraightPathColor;
      }

      return n;
    });

    setShowDistStraightPath(true);

    setVisualGraph({
      nodes,
      links,
    });
  }

  return (
    <Flex paddingY={"5vh"}>
      <Flex flexDirection={"column"}>
        <Flex justifyContent={"space-between"}>
          <Flex marginBottom={"5px"} alignItems={"center"} paddingX={"10px"}>
            <Text marginRight="20px">Visitados: {visited}</Text>
            <Divider orientation="vertical" />
            <Text marginX="20px">Dist. total percorrida: {totalDistance}</Text>
            <Divider orientation="vertical" />
            {optimization ? (
              <Text marginX="20px">
                Dist. menor caminho:{" "}
                {showDistStraightPath ? distStraighPath : 0}
              </Text>
            ) : (
              <Text marginX="20px">
                Menor número de vértices:{" "}
                {showDistStraightPath ? straightPath.length : 0}
              </Text>
            )}
          </Flex>
        </Flex>
        <Flex flexDirection={"column"} marginBottom={"5px"}>
          <GraphVisualizer showData={visualGraph} />

          <Flex justifyContent={"space-between"} marginY="20px" w="100%">
            <Flex>
              <Button
                onClick={showAllProcess}
                marginRight="10px"
                key="0"
                colorScheme={"purple"}
                size={"sm"}
              >
                Mostrar resultado completo
              </Button>
              <Button
                marginRight="10px"
                onClick={showNextStep}
                key="1"
                colorScheme={"green"}
                size={"sm"}
              >
                Mostrar próximo passo
              </Button>
              <Button
                size={"sm"}
                onClick={showStepBack}
                key="2"
                colorScheme={"green"}
              >
                Mostrar passo anterior
              </Button>
            </Flex>

            <Flex marginBottom={"5px"} alignItems={"center"} paddingX={"10px"}>
              <Flex alignItems={"center"} marginRight={"10px"}>
                <Text fontSize={"10px"} marginX="5px">
                  Não visitado
                </Text>
                <Box
                  w="30px"
                  h="30px"
                  bg={vertexColor}
                  border={`2px solid ${borderColor}`}
                  borderRadius={"30px"}
                />
              </Flex>
              <Divider orientation="vertical" />
              <Flex alignItems={"center"} marginRight={"10px"}>
                <Text fontSize={"10px"} marginX="5px">
                  Visitado
                </Text>
                <Box
                  w="30px"
                  h="30px"
                  bg={vertexVisitedColor}
                  border={`2px solid ${borderColor}`}
                  borderRadius={"30px"}
                />
              </Flex>
              <Divider orientation="vertical" />

              <Flex alignItems={"center"}>
                <Text fontSize={"10px"} marginX="5px">
                  Solução encontrada
                </Text>
                <Box
                  w="30px"
                  h="30px"
                  bg={vertexStraightPathColor}
                  border={`2px solid ${borderColor}`}
                  borderRadius={"30px"}
                />
              </Flex>
            </Flex>
          </Flex>
          <Text>Distâncias Euclidianas</Text>
          <Flex
            flexDirection={"column"}
            overflowY="scroll"
            width="100%"
            h="50vh"
            alignItems={"center"}
          >
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>de</Th>
                  <Th>para</Th>
                  <Th isNumeric>Distância</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tableData &&
                  tableData.map((i) => (
                    <Tr key={i.column3 + i.column1 + i.column2}>
                      <Td>{i.column1}</Td>
                      <Td>{i.column2}</Td>
                      <Td isNumeric>{i.column3}</Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
