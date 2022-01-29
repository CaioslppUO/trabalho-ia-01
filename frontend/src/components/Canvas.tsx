import { Box } from "@chakra-ui/react";
import { useD3 } from "../hooks/useD3";
import * as d3 from "d3";
import { useRef, useState } from "react";

type NodeProps = {
  name: string;
  color: string;
  x: number;
  y: number;
  value: number;
};

type LinkProps = {
  source: string;
  target: string;
  color: string;
  distance: number;
};

type DrawLinkProps = {
  source: {
    x: number;
    y: number;
  };
  target: {
    x: number;
    y: number;
  };
  color: string;
  distance: number;
};

export type GraphProps = {
  nodes: NodeProps[];
  links: LinkProps[];
};

export type CanvasProps = {
  graph: GraphProps;
};

export const Canvas = ({ graph }: CanvasProps) => {
  const a = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState(graph);

  function fun() {
    // data.links[0].color = "red";
    data.links.pop();
  }
  const ref = useD3(
    (canvas) => {
      data.nodes.forEach((n) => {
        n.x = Math.random() * width;
        n.y = Math.random() * height;
      });
      //   var canvas = d3.select("#network");
      var width = canvas.attr("width");
      var height = canvas.attr("height");
      var ctx = canvas.node().getContext("2d");
      var r = 10;
      var simulation = d3
        .forceSimulation(data.nodes)
        .force("x", d3.forceX(width / 2))
        .force("y", d3.forceY(height / 2))
        .force("collide", d3.forceCollide(r + 1))
        .force("charge", d3.forceManyBody().strength(-150))
        .on("tick", update)
        .force(
          "link",
          d3
            .forceLink(data.links)
            // @ts-ignore
            .id((i) => i.name)
            .distance((i) => i.distance)
            .strength(1)
        );

      //simulation.nodes(data.nodes);
      //simulation.force("link").links(data.links);

      canvas.call(
        d3
          .drag()
          .container(canvas.node())
          .subject((event) => {
            return simulation.find(event.x, event.y);
          })
          .on("start", (event) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
          })
          .on("drag", (event) => {
            if (event.x > 0 && event.x < width - 5) {
              event.subject.fx = event.x;
            }
            if (event.y > 0 && event.y < height - 5) {
              event.subject.fy = event.y;
            }
          })
          .on("end", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
          })
      );

      function update() {
        ctx.clearRect(0, 0, width, height);

        data.links.forEach((element) => {
          drawLink(element as any);
        });

        data.nodes.forEach((element) => {
          drawNode(element);
        });
      }

      function drawNode(d: NodeProps) {
        ctx.beginPath();
        ctx.fillStyle = d.color;

        ctx.moveTo(d.x, d.y);
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = "15px serif";
        ctx.fillText(d.name, d.x + r, d.y + r);
      }

      function drawLink(l: DrawLinkProps) {
        ctx.beginPath();
        ctx.strokeStyle = l.color;
        ctx.lineWidth = 3;
        ctx.moveTo(l.source.x, l.source.y);
        ctx.lineTo(l.target.x, l.target.y);
        ctx.stroke();

        ctx.font = "10px serif";
        ctx.fillStyle = "purple";
        ctx.fillText(
          l.distance,
          Math.abs(l.target.x + l.source.x) / 2,
          Math.abs(l.target.y + l.source.y) / 2
        );
      }
    },
    [graph.nodes.length]
  );

  return (
    <Box width="1000px" height="500px" border="2px solid gray">
      <canvas ref={ref} id="network" width="1000" height="500"></canvas>
      <button onClick={fun}>Fun</button>
    </Box>
  );
};
