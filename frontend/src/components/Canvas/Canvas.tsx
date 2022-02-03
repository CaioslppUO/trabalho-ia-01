import { Box, Flex, Button } from "@chakra-ui/react";
import { useD3 } from "../../hooks/useD3";
import * as d3 from "d3";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GraphProps, NodeProps } from "./canvasTypes/types";
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
import { ExploreProps } from "../../contexts/Main";

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
  const { MainGraph, explorePath } = useContext(MainContext);
  const [data, setData] = useState(graph);
  const [width, setWith] = useState("500");
  const [height, setHeight] = useState("500");
  const [r, setR] = useState(13);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [simulation, setSimulation] =
    useState<d3.Simulation<NodeProps, undefined>>();

  const [tableData, setTableData] = useState<Array<TableLineProps>>([]);

  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // console.log(MainGraph);
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

  const funcao = useCallback(() => {
    const canvas = d3.select(ref.current);

    setWith(canvas.attr("width"));
    setHeight(canvas.attr("height"));
    let canvasNode = canvas.node();
    if (canvasNode !== null) {
      setCtx(canvasNode.getContext("2d"));
    }
    setSimulation(
      d3
        .forceSimulation(data.nodes)
        .force("x", d3.forceX(parseInt(width) / 2))
        .force("y", d3.forceY(parseInt(height) / 2))
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
        )
    );
    try {
      if (typeof simulation !== "undefined" && !!canvas && !!canvas.node) {
        canvas.call(
          d3
            .drag()
            // @ts-ignore
            .container(canvas.node())
            .subject((event) => {
              return simulation.find(event.x, event.y);
            })
            .on("start", (event) => onStartDrag(event, simulation))
            .on("drag", (event) =>
              onDrag(event, parseInt(width), parseInt(height))
            )
            .on("end", (event, d: any) => onDragEnd(event, simulation))
        );
      }
    } catch (error) {
      console.log(error);
    }

    function update() {
      if (!!ctx) {
        console.log("Update");
        ctx.clearRect(0, 0, parseInt(width), parseInt(height));
        data.nodes.forEach((e) =>
          checkCollision(e, r, parseInt(width), parseInt(height))
        );

        data.links.forEach((element) => {
          drawLink(ctx, element as any, r);
        });

        data.nodes.forEach((element) => {
          drawNode(ctx, element, r);
        });
      }
    }
  }, [ctx, data, simulation, r, height, width]);

  useEffect(() => {
    if (ref.current !== null) {
      try {
        funcao();
      } catch (error) {
        console.log(error);
      }
    }
  }, [ref.current, data]);

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
      <Button
        onClick={() => {
          data.nodes[0].color = "magenta";
          // oi();
          // if (ctx) {
          //   ctx.clearRect(0, 0, parseInt(width), parseInt(height));
          // }
          console.log(data);
        }}
      >
        Fun
      </Button>
      <Flex marginLeft="30px" overflowY="scroll" width="300px" height="500px">
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

const canvasStyle = {
  boxShadow:
    " rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
};
