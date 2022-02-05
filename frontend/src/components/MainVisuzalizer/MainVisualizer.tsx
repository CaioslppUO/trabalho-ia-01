import { useContext, useState } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { GraphVisualizer } from "./GraphVisualizer";
import { MainContext } from "../../contexts/Main";

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

  function showStep() {
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
      explorePath.shift();

      setVisualGraph({
        nodes,
        links,
      });
    } else {
      showStraightpath();
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
        <Flex alignItems={"center"} paddingX={"10px"}>
          <Text marginRight="10px">Visitados: {visited}</Text>
          <Text marginRight="10px">Dist. total percorrida: {distTotal}</Text>

          <Text>
            Dist. menor caminho: {showDistStraightPath ? distStraighPath : 0}
          </Text>
        </Flex>
        <Box marginBottom={"5px"} border="3px solid #eeea">
          <GraphVisualizer showData={visualGraph} />
        </Box>
        <Flex w="100%">
          <Button
            onClick={showAllProcess}
            marginRight="10px"
            key="0"
            colorScheme={"purple"}
          >
            Mostrar resultado completo
          </Button>
          <Button onClick={showStep} key="1" colorScheme={"purple"}>
            Mostrar passo a passo
          </Button>
        </Flex>
      </Flex>

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
  );
};
