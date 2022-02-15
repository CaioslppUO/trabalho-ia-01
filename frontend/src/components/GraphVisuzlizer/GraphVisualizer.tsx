import { useEffect, useRef, useState } from "react";

import * as d3 from "d3";
import {
  borderColor,
  edgeLabelColor,
  vertexLabelColor,
} from "../../styles/graph";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export type GraphVisualizerProps = {
  width?: number;
  height?: number;
  r?: number;
  showData?: GraphVisualizerElement;
};

export type GraphVisualizerElement = {
  nodes: Array<{
    x: number;
    y: number;
    vy: number;
    vx: number;
    color: string;
    name: string;
    id: string;
  }>;
  links: Array<{
    source: string;
    target: string;
    color: string;
    weight: number;
  }>;
};

/**
 * Componente que imprime na tela uma representação de grafos em canvas
 * @returns React component
 */
export const GraphVisualizer = ({ r = 15, showData }: GraphVisualizerProps) => {
  const ref = useRef<SVGSVGElement>(null);

  const window = getWindowDimensions();
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  const [svg, setSvg] =
    useState<d3.Selection<SVGSVGElement, unknown, null, undefined>>();

  const [data, setData] = useState<GraphVisualizerElement>({
    nodes: [
      {
        id: "a",
        name: "a",
        color: "#fff",
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
      },
      {
        id: "b",
        name: "b",
        color: "#fff",
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
      },
    ],
    links: [{ source: "a", target: "b", color: "purple", weight: 10 }],
  });

  useEffect(() => {
    if (!!showData) {
      setData(showData);
    }
  }, [showData]);

  const simulation = d3
    .forceSimulation(data.nodes)
    .force(
      "link",
      d3
        .forceLink(data.links)
        // @ts-ignore
        .id((d) => d.name)
        .distance(150)
        .strength(0.2)
    )
    .force("charge", d3.forceManyBody().strength(-1300))
    .force("x", d3.forceX(width / 2))
    .force("y", d3.forceY(height / 2))
    .force("collide", d3.forceCollide(r));

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
      // console.log(svg.attr("width"));
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
        .attr("class", "link-class")
        .attr("marker-end", "url(#arrowhead-purple)");

      const node = svg
        .append("g")
        .attr("fill", "#FFF")
        .attr("stroke", "purple")
        .attr("stroke-width", 2.5)
        .selectAll(".node")
        .data(data.nodes)
        .join("circle")
        .attr("fill", (d) => d.color)
        .attr("stroke", () => borderColor)
        .attr("r", r)
        // @ts-ignore
        .call(drag(simulation));

      const labels = svg
        .append("g")
        .attr("stroke-opacity", 0.6)
        .selectAll("label")
        .data(data.nodes)
        .join("text")
        .text((d) => d.name)
        .attr("stroke", vertexLabelColor)
        .attr("x", (d) => d.x + r)
        .attr("y", (d) => d.y + r)
        .attr("class", "label");

      const labels2 = svg
        .append("g")
        .selectAll("label2")
        .data(data.links)
        .join("text")
        .text((d) => d.weight)
        .attr("stroke", edgeLabelColor)
        .attr("font-size", 10)
        .attr("x", (d) => {
          // @ts-ignore
          const x = Math.abs(d.target.x + d.source.x) / 2;
          return x;
        })
        .attr("y", (d) => {
          // @ts-ignore
          const y = Math.abs(d.target.y + d.source.y) / 2;
          return y;
        })
        .attr("class", "label");

      simulation.on("tick", () => {
        link
          .attr("x1", (d) => {
            // @ts-ignore
            if (d.source.x < 10 + r) {
              return r + 10;
            }
            // @ts-ignore
            if (d.source.x > width - r - 10) {
              return width - r - 10;
            }
            // @ts-ignore
            return d.source.x;
          })
          // @ts-ignore
          .attr("y1", (d) => {
            // @ts-ignore
            if (d.source.y < 10 + r) {
              return r + 10;
            }
            // @ts-ignore
            if (d.source.y > height - r - 10) {
              return height - r - 10;
            }
            // @ts-ignore
            return d.source.y;
          })
          // @ts-ignore
          .attr("x2", (l: any) => {
            // @ts-ignore
            if (l.target.x < 10 + r) {
              return r + 10;
            }
            // @ts-ignore
            if (l.target.x > width - r - 10) {
              return width - r - 10;
            }
            return l.target.x;
          })
          .attr("y2", (l: any) => {
            // @ts-ignore
            if (l.target.y < 10 + r) {
              return r + 10;
            }
            // @ts-ignore
            if (l.target.y > height - r - 10) {
              return height - r - 10;
            }
            // @ts-ignore
            return l.target.y;
          });
        node
          .attr("cx", (d) => {
            if (d.x < 10 + r) {
              return 0 + r + 10;
            } else if (d.x > width - r - 10) {
              return width - r - 10;
            } else {
              return d.x;
            }
          })
          .attr("cy", (d) => {
            if (d.y < r + 10) {
              return 0 + r + 10;
            } else if (d.y > height - r - 10) {
              return height - r - 10;
            } else {
              return d.y;
            }
          });

        labels
          .attr("x", (d) => {
            if (d.x < 0) {
              return 0 + r + 10;
            }
            if (d.x > width) {
              return width - r - 10;
            }
            return d.x + r;
          })
          .attr("y", (d) => {
            if (d.y < 0) {
              return r + 10;
            }
            if (d.y > height) {
              return height - r - 10;
            }
            return d.y + r;
          });

        labels2
          .attr("x", (d) => {
            // @ts-ignore
            let x1 = d.source.x;
            // @ts-ignore
            let x2 = d.target.x;
            // @ts-ignore
            if (x1 > width - r - 10) {
              x1 = width - r - 10;
            } else if (
              // @ts-ignore
              x1 <
              r + 10
            ) {
              x1 = r + 10;
            }

            // @ts-ignore
            if (x2 > width - r - 10) {
              x2 = width - r - 10;
            } else if (
              // @ts-ignore
              x2 <
              r + 10
            ) {
              x2 = r + 10;
            }
            // @ts-ignore
            const x = Math.abs(x1 + x2) / 2;
            return x;
          })
          .attr("y", (d) => {
            // @ts-ignore
            let y1 = d.source.y;
            // @ts-ignore
            let y2 = d.target.y;
            // @ts-ignore
            if (y1 > height - r - 10) {
              y1 = height - r - 10;
            } else if (
              // @ts-ignore
              y1 <
              r + 10
            ) {
              y1 = r + 10;
            }

            // @ts-ignore
            if (y2 > height - r - 10) {
              y2 = height - r - 10;
            } else if (
              // @ts-ignore
              y2 <
              r + 10
            ) {
              y2 = r + 10;
            }
            // @ts-ignore
            const y = Math.abs(y1 + y2) / 2;
            return y;
          });
      });
    }
  }, [data, ref.current, height, r, width]);

  useEffect(() => {
    if (window.width) {
      setWidth((85 * window.width) / 100);
    }
    if (window.height) {
      setHeight((75 * window.height) / 100);
    }
  }, [window]);

  return (
    <div
      style={{
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      }}
    >
      <svg
        id="svg-here"
        style={{
          height: height,
          width: width,
          marginRight: "0px",
          marginLeft: "0px",
        }}
        ref={ref}
      >
        <defs>
          <marker
            id="arrowhead-purple"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
            fill="purple"
          >
            <polygon points="0 1, 4 3.5, 0 6" />
          </marker>

          <marker
            id="arrowhead-black"
            markerWidth="10"
            markerHeight="7"
            refX="4"
            refY="3.5"
            orient="auto"
            fill="black"
          >
            <polygon points="0 1, 4 3.5, 0 6" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};
