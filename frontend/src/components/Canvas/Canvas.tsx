import { Box, Flex } from "@chakra-ui/react";
import { useD3 } from "../../hooks/useD3";
import * as d3 from "d3";
import { useContext, useEffect, useState } from "react";
import { GraphProps } from "./canvasTypes/types";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import {
  drawNode,
  drawLink,
  checkCollision,
  onStartDrag,
  onDrag,
  onDragEnd,
} from "./graphControl/graphInterfaceControl";
import { MainContext } from "../../contexts/Main";

var graph: GraphProps = {
  nodes: [
    { name: "A", color: "#3d3d3d", x: 0, y: 0 },
    { name: "B", color: "#3d3d3d", x: 0, y: 0 },
  ],
  links: [{ source: "A", target: "B", color: "red", distance: 100 }],
};

type TableLineProps = {
  column1: string;
  column2: string;
  column3: number;
};

/**
 * Componente que imprime na tela uma representação de grafos em canvas
 * @returns React component
 */
export const Canvas = () => {
  const { MainGraph } = useContext(MainContext);
  const [data, setData] = useState(graph);
  const [tableData, setTableData] = useState<Array<TableLineProps>>([]);
  const [updateGraph, setUpdateGraph] = useState(Date.now());

  useEffect(() => {
    console.log(MainGraph);
    if (typeof MainGraph !== undefined && MainGraph.graph) {
      const g = MainGraph.graph;
      const newData: GraphProps = {
        nodes: [],
        links: [],
      };

      const newTableData: TableLineProps[] = [];

      g.forEach((i) => {
        newData.nodes.push({
          name: i.vertex.name,
          color: "purple",
          x: 0,
          y: 0,
        });
      });

      g.forEach((i) => {
        i.edges.list.forEach((j) => {
          newData.links.push({
            source: i.vertex.name,
            target: j.dstVertex,
            color: "gray",
            distance: j.weight,
          });
        });
      });

      g.forEach((i) => {
        i.vertex.distances.forEach((j) => {
          newTableData.push({
            column1: i.vertex.name,
            column2: j.dstVertex,
            column3: j.euclidean_distance,
          });
        });
      });

      setTableData(newTableData);

      setData(newData);
    }
  }, [MainGraph]);

  const ref = useD3(
    (canvas: any) => {
      data.nodes.forEach((n) => {
        n.x = Math.random() * width;
        n.y = Math.random() * height;
      });
      var width = canvas.attr("width");
      var height = canvas.attr("height");
      var ctx = canvas.node().getContext("2d");
      var r = 13;
      var simulation = d3
        .forceSimulation(data.nodes)
        .force("x", d3.forceX(width / 2))
        .force("y", d3.forceY(height / 2))
        .force("collide", d3.forceCollide(r + 1))
        .force("charge", d3.forceManyBody().strength(-1900))
        .on("tick", update)
        .force(
          "link",
          d3
            .forceLink(data.links)
            // @ts-ignore
            .id((i) => i.name)
            .distance((i) => 100)
            .strength(1)
        );

      canvas.call(
        d3
          .drag()
          .container(canvas.node())
          .subject((event) => {
            return simulation.find(event.x, event.y);
          })
          .on("start", (event) => onStartDrag(event, simulation))
          .on("drag", (event) => onDrag(event, width, height))
          .on("end", (event, d: any) => onDragEnd(event, simulation))
      );

      function update() {
        ctx.clearRect(0, 0, width, height);
        data.nodes.forEach((e) => checkCollision(e, r, width, height));

        data.links.forEach((element) => {
          drawLink(ctx, element as any, r);
        });

        data.nodes.forEach((element) => {
          drawNode(ctx, element, r);
        });
      }
    },
    [data]
  );

  return (
    <Flex>
      <Box>
        <canvas
          style={canvasStyle}
          ref={ref}
          id="network"
          width="900"
          height="500"
        ></canvas>
      </Box>
      <Flex marginLeft="30px" overflowY="scroll" width="300px" height="500px">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>De</Th>
              <Th>Dara</Th>
              <Th isNumeric>Distância</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tableData &&
              tableData.map((i) => (
                <Tr>
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

const canvasStyle = {
  boxShadow:
    " rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
};
