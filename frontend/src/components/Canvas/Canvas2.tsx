import { useEffect, useRef, useState } from "react";
import { Box, Button } from "@chakra-ui/react";

import * as d3 from "d3";
import { useD3Svg } from "../../hooks/useD3Svg";
import "./style.css";

const width = 800;
const height = 500;
const r = 20;

export const Canvas2 = () => {
  const ref = useRef<SVGSVGElement>(null);

  const [svg, setSvg] =
    useState<d3.Selection<SVGSVGElement, unknown, null, undefined>>();

  const [data, setData] = useState({
    nodes: [
      {
        id: "a",
        name: "a",
        color: "gray",
        x: Math.random() * width,
        y: Math.random() * height,
      },
      {
        id: "b",
        name: "b",
        color: "gray",
        x: Math.random() * width,
        y: Math.random() * height,
      },
      {
        id: "c",
        name: "c",
        color: "gray",
        x: Math.random() * width,
        y: Math.random() * height,
      },
      {
        id: "d",
        name: "d",
        color: "gray",
        x: Math.random() * width,
        y: Math.random() * height,
      },
      {
        id: "e",
        name: "e",
        color: "gray",
        x: Math.random() * width,
        y: Math.random() * height,
      },
      {
        id: "g",
        name: "g",
        color: "gray",
        x: Math.random() * width,
        y: Math.random() * height,
      },
      {
        id: "f",
        name: "f",
        color: "gray",
        x: Math.random() * width,
        y: Math.random() * height,
      },
    ],
    links: [
      { source: "a", target: "b", color: "purple" },
      { source: "a", target: "c", color: "purple" },
      { source: "b", target: "d", color: "purple" },
      { source: "d", target: "e", color: "purple" },
      { source: "e", target: "f", color: "purple" },
      { source: "c", target: "g", color: "purple" },
      { source: "g", target: "f", color: "purple" },
    ],
  });

  const simulation = d3
    .forceSimulation(data.nodes)
    .force(
      "link",
      d3
        .forceLink(data.links)
        // @ts-ignore
        .id((d) => d.name)
        .distance(100)
        .strength(1)
    )
    .force("charge", d3.forceManyBody().strength(-1900))
    .force("x", d3.forceX(width / 2))
    .force("y", d3.forceY(height / 2))
    .force("collide", d3.forceCollide(r + 10));

  useEffect(() => {
    if (typeof svg === "undefined" && ref.current) {
      setSvg(
        d3
          .select(ref.current)
          .append("svg")
          .attr("id", "graph")
          .attr("width", width)
          .attr("height", height)
      );
    }

    if (!!svg) {
      svg.selectAll("*").remove();

      const drag = (simulation: any) => {
        function dragstarted(event: any, d: any) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(event: any, d: any) {
          d.fx = event.x;
          d.fy = event.y;
        }

        function dragended(event: any, d: any) {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }

        return d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
      };

      const link = svg
        .append("g")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 3)
        .attr("id", "links-container")
        .selectAll("line")
        .data(data.links)
        .join("line")
        .attr("stroke", (d) => d.color)
        .attr("x2", (l: any) => {
          var x0 = l.source.x,
            x1 = l.target.x;

          var c = Math.abs(l.target.x - l.source.x);
          var b = Math.abs(l.target.y - l.source.y);

          var vX = x1 - x0;

          var t = 1 - r / Math.sqrt(b * b + c * c);

          var rX = x0 + t * vX;

          return rX;
        })
        .attr("y2", (l: any) => {
          var y0 = l.source.y,
            y1 = l.target.y;

          var c = Math.abs(l.target.x - l.source.x);
          var b = Math.abs(l.target.y - l.source.y);

          var vY = y1 - y0;
          var t = 1 - r / Math.sqrt(b * b + c * c);

          var rY = y0 + t * vY;

          return rY;
        })
        .attr("class", "link-class")
        .attr("marker-end", "url(#arrowhead)");

      console.log(svg);

      const node = svg
        .append("g")
        .attr("fill", "#FFF")
        .attr("stroke", "purple")
        .attr("stroke-width", 2.5)
        .selectAll(".node")
        .data(data.nodes)
        .join("circle")
        .attr("fill", () => "#FFF")
        .attr("stroke", () => "purple")
        .attr("r", r)
        // @ts-ignore
        .call(drag(simulation));

      const labels = svg
        .append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("label")
        .data(data.nodes)
        .join("text")
        .text((d) => d.name)
        .attr("x", (d) => d.x + 2 * r)
        .attr("y", (d) => d.y + 2 * r)
        .attr("class", "label");

      simulation.on("tick", () => {
        link
          // @ts-ignore
          .attr("x1", (d) => d.source.x)
          // @ts-ignore
          .attr("y1", (d) => d.source.y)
          // @ts-ignore
          .attr("x2", (l: any) => {
            var x0 = l.source.x,
              x1 = l.target.x;

            var c = Math.abs(l.target.x - l.source.x);
            var b = Math.abs(l.target.y - l.source.y);

            var vX = x1 - x0;

            var t = 1 - r / Math.sqrt(b * b + c * c);

            var rX = x0 + t * vX;

            return rX;
          })
          // @ts-ignore
          .attr("y2", (l: any) => {
            var y0 = l.source.y,
              y1 = l.target.y;

            var c = Math.abs(l.target.x - l.source.x);
            var b = Math.abs(l.target.y - l.source.y);

            var vY = y1 - y0;
            var t = 1 - r / Math.sqrt(b * b + c * c);

            var rY = y0 + t * vY;

            return rY;
          });
        node
          .attr("cx", (d) => {
            if (d.x < 0) {
              return 0 + r;
            } else if (d.x > width) {
              return width - r;
            } else {
              return d.x;
            }
          })
          .attr("cy", (d) => {
            if (d.y < 0) {
              return 0 + r;
            } else if (d.y > height) {
              return height - r;
            } else {
              return d.y;
            }
          });

        labels.attr("x", (d) => d.x + 2 * r).attr("y", (d) => d.y + 2 * r);
      });
    }
  }, [data, ref.current]);

  return (
    <Box border="5px solid magenta">
      <div id="divv">
        <svg
          id="svg-here"
          style={{
            height: 500,
            width: 800,
            marginRight: "0px",
            marginLeft: "0px",
          }}
          ref={ref}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="4"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 1, 4 3.5, 0 6" />
            </marker>
          </defs>
        </svg>
      </div>
      <h1>Canvas</h1>
      <Button
        onClick={() => {
          const n = data.nodes.map((i) => i);
          const l = data.links.map((i) => i);

          n.push({
            id: "C",
            name: "C",
            color: "purple",
            x: 0,
            y: 0,
          });
          setData({
            nodes: n,
            links: l,
          });
          console.log(data.nodes);
        }}
      >
        Fun
      </Button>

      {/* <svg
        style={{
          height: 500,
          width: 800,
          marginRight: "0px",
          marginLeft: "0px",
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
        <line
          x1="0"
          y1="50"
          x2="250"
          y2="50"
          stroke="#000"
          stroke-width="8"
          marker-end="url(#arrowhead)"
        />
      </svg> */}
    </Box>
  );
};

export function _arrow(fromx: any, fromy: any, tox: any, toy: any) {
  var headlen = 10;
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);

  return {
    x1: tox - headlen * Math.cos(angle - Math.PI / 6),
    y1: toy - headlen * Math.sin(angle - Math.PI / 6),
    x2: tox - headlen * Math.cos(angle + Math.PI / 6),
    y2: toy - headlen * Math.sin(angle + Math.PI / 6),
  };
}
