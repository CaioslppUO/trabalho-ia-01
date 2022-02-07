import { useContext, useState } from "react";
import { Box, Button, Flex, Text, Divider } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { GraphVisualizer } from "./GraphVisualizer";
import { ExploreProps, MainContext } from "../../contexts/Main";

export const MainVisualizer = () => {
  const {
    tableData,
    visualGraph,
    setVisualGraph,
    explorePath,
    startVertex,
    straightPath,
    distStraighPath,
  } = useContext(MainContext);

  const [distTotal, setDistTotal] = useState(0);
  const [visited, setVisited] = useState(0);

  const [stepsBack, setStepsBack] = useState<ExploreProps[]>([]);

  const [showDistStraightPath, setShowDistStraightPath] = useState(false);

  function showAllProcess() {
    const nodes = visualGraph.nodes.map((n) => {
      if (
        explorePath.find((e) => e.dstVertex === n.name) ||
        n.name === startVertex
      ) {
        n.color = "#805ad5";
      }
      return n;
    });

    const links = visualGraph.links.map((n) => {
      if (
        explorePath.find(
          (e) =>
            // @ts-ignore
            e.srcVertex === n.source.name && e.dstVertex === n.target.name
        )
      ) {
        n.color = "#805ad5";
      }

      return n;
    });

    setVisited(explorePath[explorePath.length - 1].visited);
    setDistTotal(explorePath[explorePath.length - 1].total_distance);

    setVisualGraph({
      nodes,
      links,
    });

    showStraightpath();
  }

  function showNextStep() {
    if (explorePath.length > 0) {
      const nodes = visualGraph.nodes.map((n) => {
        if (
          explorePath[0].srcVertex === n.name ||
          explorePath[0].dstVertex === n.name
        ) {
          n.color = "#805ad5";
        }
        return n;
      });

      const links = visualGraph.links.map((n) => {
        if (
          // @ts-ignore
          explorePath[0].srcVertex === n.source.name &&
          // @ts-ignore
          explorePath[0].dstVertex === n.target.name
        ) {
          n.color = "#805ad5";
        }

        return n;
      });
      setVisited(explorePath[0].visited);
      setDistTotal(explorePath[0].total_distance);

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

  function showStepBack() {
    if (stepsBack.length > 0) {
      const nodes = visualGraph.nodes.map((n) => {
        if (stepsBack[0].dstVertex === n.name) {
          n.color = "#b9bcd6";
        }
        return n;
      });

      const links = visualGraph.links.map((n) => {
        if (
          // @ts-ignore
          stepsBack[0].srcVertex === n.source.name &&
          // @ts-ignore
          stepsBack[0].dstVertex === n.target.name
        ) {
          n.color = "#b9bcd6";
        }

        return n;
      });
      setVisited(stepsBack[0].visited);
      setDistTotal(stepsBack[0].total_distance);

      const item = stepsBack.shift();

      if (!!item) {
        explorePath.unshift(item);
        console.log(stepsBack);
      }

      setVisualGraph({
        nodes,
        links,
      });
    }
  }

  function showStraightpath() {
    const nodes = visualGraph.nodes.map((n) => {
      if (
        straightPath.find((e) => e.dstVertex === n.name) ||
        n.name === startVertex
      ) {
        n.color = "#6cfd8c";
      }
      return n;
    });

    const links = visualGraph.links.map((n) => {
      if (
        straightPath.find(
          (e) =>
            // @ts-ignore
            e.srcVertex === n.source.name && e.dstVertex === n.target.name
        )
      ) {
        n.color = "#6cfd8c";
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
    <Flex>
      <Flex flexDirection={"column"}>
        <Flex justifyContent={"space-between"}>
          <Flex marginBottom={"5px"} alignItems={"center"} paddingX={"10px"}>
            <Text marginRight="20px">Visitados: {visited}</Text>
            <Divider orientation="vertical" />
            <Text marginX="20px">Dist. total percorrida: {distTotal}</Text>
            <Divider orientation="vertical" />
            <Text marginX="20px">
              Dist. menor caminho: {showDistStraightPath ? distStraighPath : 0}
            </Text>
          </Flex>

          <Flex marginBottom={"5px"} alignItems={"center"} paddingX={"10px"}>
            <Flex alignItems={"center"} marginRight={"10px"}>
              <Text marginX="5px">Não visitado</Text>
              <Box
                w="30px"
                h="30px"
                bg="#b9bcd6"
                border="2px solid #805ad5"
                borderRadius={"30px"}
              />
            </Flex>
            <Divider orientation="vertical" />
            <Flex alignItems={"center"} marginRight={"10px"}>
              <Text marginX="5px">Visitado</Text>
              <Box
                w="30px"
                h="30px"
                bg="#805ad5"
                border="2px solid #805ad5"
                borderRadius={"30px"}
              />
            </Flex>
            <Divider orientation="vertical" />

            <Flex alignItems={"center"}>
              <Text marginX="5px">Menor caminho</Text>
              <Box
                w="30px"
                h="30px"
                bg="#6cfd8c"
                border="2px solid #805ad5"
                borderRadius={"30px"}
              />
            </Flex>
          </Flex>
        </Flex>
        <Flex marginBottom={"5px"} border="3px solid #eeea">
          <GraphVisualizer showData={visualGraph} />
          <Box h="100%" borderRight="3px solid #eeea" />
          <Flex
            flexDirection={"column"}
            marginLeft="30px"
            overflowY="scroll"
            width="300px"
            height="500px"
            alignItems={"center"}
          >
            <Text>Distâncias Euclidianas</Text>
            <Table variant="simple">
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
        <Flex w="100%">
          <Button
            onClick={showAllProcess}
            marginRight="10px"
            key="0"
            colorScheme={"purple"}
          >
            Mostrar resultado completo
          </Button>
          <Button
            marginRight="10px"
            onClick={showNextStep}
            key="1"
            colorScheme={"blackAlpha"}
          >
            Mostrar próximo passo
          </Button>
          <Button onClick={showStepBack} key="1" colorScheme={"blackAlpha"}>
            Mostrar passo anterior
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
