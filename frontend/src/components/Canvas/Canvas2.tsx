import { useEffect, useRef, useState } from "react";
import { Box, Button } from "@chakra-ui/react";

import * as d3 from "d3";
import { useD3Svg } from "../../hooks/useD3Svg";
import "./style.css";

const width = 800;
const height = 500;
const r = 8;

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
      { source: "a", target: "b" },
      { source: "a", target: "c" },
      { source: "b", target: "d" },
      { source: "d", target: "e" },
      { source: "e", target: "f" },
      { source: "c", target: "g" },
      { source: "g", target: "f" },
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
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 3)
        .selectAll("line")
        .data(data.links)
        .join("line");

      const node = svg
        .append("g")
        .attr("fill", "gray")
        .attr("stroke", "gray")
        .attr("stroke-width", 1.5)
        .selectAll(".node")
        .data(data.nodes)
        .join("circle")
        .attr("fill", () => "gray")
        .attr("stroke", () => "gray")
        .attr("r", 13)
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
        .attr("y", (d) => d.y + 2 * r);

      simulation.on("tick", () => {
        link
          // @ts-ignore
          .attr("x1", (d) => d.source.x)
          // @ts-ignore
          .attr("y1", (d) => d.source.y)
          // @ts-ignore
          .attr("x2", (d) => d.target.x)
          // @ts-ignore
          .attr("y2", (d) => d.target.y);
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
        ></svg>
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
    </Box>
  );
};
