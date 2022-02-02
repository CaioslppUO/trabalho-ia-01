import { Box } from "@chakra-ui/react";
import { useD3 } from "../../hooks/useD3";
import * as d3 from "d3";
import { GraphProps } from "./canvasTypes/types";
import {
  drawNode,
  drawLink,
  checkCollision,
  onStartDrag,
  onDrag,
  onDragEnd,
} from "./graphControl/graphInterfaceControl";

var graph: GraphProps = {
  nodes: [{ name: "A", color: "#3d3d3d", x: 0, y: 0 }],
  links: [],
};

export type CanvasProps = {
  data?: GraphProps;
};

/**
 * Componente que imprime na tela uma representação de grafos em canvas
 * @returns React component
 */
export const Canvas = ({ data = graph }: CanvasProps) => {
  const ref = useD3(
    (canvas) => {
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
          .on("end", (event) => () => onDragEnd(event, simulation))
      );

      function update() {
        checkCollision(data.nodes, r, width, height);
        ctx.clearRect(0, 0, width, height);

        data.links.forEach((element) => {
          drawLink(ctx, element as any, r);
        });

        data.nodes.forEach((element) => {
          drawNode(ctx, element, r);
        });
      }
    },
    [data.nodes.length]
  );

  return (
    <Box width="1000px" height="500px">
      <canvas
        ref={ref}
        style={canvasStyle}
        id="network"
        width="1000"
        height="500"
      ></canvas>
    </Box>
  );
};

const canvasStyle = {
  boxShadow:
    " rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
};
