import { useEffect, useRef, useState } from "react";

import * as d3 from "d3";

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
export const GraphVisualizer = ({
  height = 500,
  width = 800,
  r = 15,
  showData,
}: GraphVisualizerProps) => {
  const ref = useRef<SVGSVGElement>(null);

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
        .attr("class", "link-class")
        .attr("marker-end", (d) =>
          d.color === "purple"
            ? "url(#arrowhead-purple)"
            : "url(#arrowhead-black)"
        );
      // .attr("x2", (l: any) => {
      //   var x0 = l.source.x,
      //     x1 = l.target.x;

      //   var c = Math.abs(l.target.x - l.source.x);
      //   var b = Math.abs(l.target.y - l.source.y);

      //   var vX = x1 - x0;

      //   var t = 1 - r / Math.sqrt(b * b + c * c);

      //   var rX = x0 + t * vX;

      //   return rX;
      // })
      // .attr("y2", (l: any) => {
      //   var y0 = l.source.y,
      //     y1 = l.target.y;

      //   var c = Math.abs(l.target.x - l.source.x);
      //   var b = Math.abs(l.target.y - l.source.y);

      //   var vY = y1 - y0;
      //   var t = 1 - r / Math.sqrt(b * b + c * c);

      //   var rY = y0 + t * vY;

      //   return rY;
      // })

      const node = svg
        .append("g")
        .attr("fill", "#FFF")
        .attr("stroke", "purple")
        .attr("stroke-width", 2.5)
        .selectAll(".node")
        .data(data.nodes)
        .join("circle")
        .attr("fill", (d) => d.color)
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
        .attr("x", (d) => d.x + r)
        .attr("y", (d) => d.y + r)
        .attr("class", "label");

      const labels2 = svg
        .append("g")
        .selectAll("label2")
        .data(data.links)
        .join("text")
        .text((d) => d.weight)
        .attr("stroke", "#4d4d4d5e")
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
          // @ts-ignore
          .attr("x1", (d) => d.source.x)
          // @ts-ignore
          .attr("y1", (d) => d.source.y)
          // @ts-ignore
          .attr("x2", (l: any) => l.target.x)
          //@ts-ignore
          .attr("y2", (l: any) => l.target.y);
        node
          .attr("cx", (d) => {
            if (d.x < 0) {
              return 0 + r;
            } else if (d.x > width + r) {
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

        labels.attr("x", (d) => d.x + r).attr("y", (d) => d.y + r);

        labels2
          .attr("x", (d) => {
            // @ts-ignore
            const x = Math.abs(d.target.x + d.source.x) / 2;
            return x;
          })
          .attr("y", (d) => {
            // @ts-ignore
            const y = Math.abs(d.target.y + d.source.y) / 2;
            return y;
          });
      });
    }
  }, [data, ref.current, height, r, width]);

  return (
    <div>
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
            fill="#805ad5"
          >
            <polygon points="0 1, 4 3.5, 0 6" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};
