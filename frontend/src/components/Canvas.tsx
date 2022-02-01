import { Box } from "@chakra-ui/react";
import { useD3 } from "../hooks/useD3";
import * as d3 from "d3";
import { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "../contexts/Main";

type NodeProps = {
  name: string;
  color: string;
  x: number;
  y: number;
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

var graph: GraphProps = {
  nodes: [{ name: "A", color: "#3d3d3d", x: 0, y: 0 }],
  links: [],
};

export const Canvas = () => {
  const { MainGraph } = useContext(MainContext);
  const a = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState(graph);

  useEffect(() => {
    if (typeof MainGraph !== "undefined") {
      const value: GraphProps = {
        nodes: MainGraph.available_points.map((n) => ({
          name: n,
          color: "purple",
          x: 0,
          y: 0,
        })),
        links: MainGraph.routes.map((r) => ({
          source: r.start_point,
          target: r.end_point,
          color: "gray",
          distance: r.distance,
        })),
      };

      console.log(value);

      setData(value);
    }
  }, [MainGraph]);

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
        data.nodes.forEach((element: any) => {
          if (element.x - r < 0) {
            element.x = r;
          }

          if (element.y - r < 0) {
            element.y = r;
          }

          if (width && element.x + r > width) {
            element.x = width - r;
          }

          if (height && element.y + r > height) {
            element.y = height - r;
          }
        });
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

        ctx.font = "20px Arial bold";

        ctx.fillText(d.name, d.x + r, d.y + r);
      }

      function drawLink(l: DrawLinkProps) {
        console.log(l);
        ctx.beginPath();
        ctx.strokeStyle = l.color;
        ctx.lineWidth = 3;
        ctx.moveTo(l.source.x, l.source.y);
        var c = Math.abs(l.target.x - l.source.x);
        var b = Math.abs(l.target.y - l.source.y);

        var a = Math.sqrt(b * b + c * c);

        var alph = (Math.asin(b / a) * 180) / Math.PI;

        var betha = 90 - alph;

        var xDislocationReal = Math.sin(betha) * r;
        var yDislocationReal = Math.cos(betha) * r;
        var xReal = 0;
        var yReal = 0;

        if (l.target.x > l.source.x) {
          //origem esquerda

          if (xDislocationReal < 0) {
            xReal = l.target.x + xDislocationReal;
          } else {
            xReal = l.target.x - xDislocationReal;
          }

          if (yDislocationReal > 0) {
            yReal = l.target.y + yDislocationReal;
          } else {
            yReal = l.target.y - yDislocationReal;
          }
        } else {
          //origem direita

          if (xDislocationReal >= 0) {
            xReal = l.target.x + xDislocationReal;
          } else {
            xReal = l.target.x - xDislocationReal;
          }

          if (yDislocationReal <= 0) {
            yReal = l.target.y + yDislocationReal;
          } else {
            yReal = l.target.y - yDislocationReal;
          }
        }

        console.log("a:", alph);
        console.log("b:", betha);

        // console.log("y: ", yReal);

        // canvas_arrow(ctx, l.source.x, l.source.y, xReal, l.target.y);

        var mX = Math.abs(l.target.x + l.source.x) / 2;
        var mY = Math.abs(l.target.y + l.source.y) / 2;

        mX = Math.abs(l.target.x + mX) / 2;
        mY = Math.abs(l.target.y + mY) / 2;
        ctx.moveTo(l.source.x, l.source.y);
        // canvas_arrow(ctx, l.source.x, l.source.y, mX, mY);

        mX = Math.abs(l.target.x + l.source.x) / 2;
        mY = Math.abs(l.target.y + l.source.y) / 2;

        var mX2 = Math.abs(mX + l.source.x) / 2;
        var mY2 = Math.abs(mY + l.source.y) / 2;
        ctx.moveTo(mX, mY);
        canvas_arrow(ctx, mX, mY, mX2, mY2);

        ctx.moveTo(l.source.x, l.source.y);
        ctx.lineTo(l.target.x, l.target.y);

        // ctx.moveTo(l.source.x, l.source.y);
        // ctx.lineTo(l.target.x, l.source.y);

        // ctx.moveTo(l.target.x, l.target.y);
        // ctx.lineTo(l.target.x, l.source.y);

        ctx.stroke();
        ctx.font = "10px arial bold";
        ctx.fillStyle = "purple";
        ctx.fillText(
          l.distance,
          Math.abs(l.target.x + l.source.x) / 2 + 10,
          Math.abs(l.target.y + l.source.y) / 2 + 10
        );
      }

      function canvas_arrow(
        context: any,
        fromx: any,
        fromy: any,
        tox: any,
        toy: any
      ) {
        var headlen = 10; // length of head in pixels
        var dx = tox - fromx;
        var dy = toy - fromy;
        var angle = Math.atan2(dy, dx);
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.lineTo(
          tox - headlen * Math.cos(angle - Math.PI / 6),
          toy - headlen * Math.sin(angle - Math.PI / 6)
        );
        context.moveTo(tox, toy);
        context.lineTo(
          tox - headlen * Math.cos(angle + Math.PI / 6),
          toy - headlen * Math.sin(angle + Math.PI / 6)
        );
      }
    },
    [data.nodes.length]
  );

  return (
    <Box width="1000px" height="500px">
      <canvas
        style={{
          boxShadow:
            " rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
        }}
        ref={ref}
        id="network"
        width="1000"
        height="500"
      ></canvas>
    </Box>
  );
};
