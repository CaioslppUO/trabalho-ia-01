import { ReactNode, useEffect, useState } from "react";
import { createContext } from "react";
import { Graph } from "../model/types/graphTypes";
import { GraphVisualizerElement } from "../components/MainVisuzalizer/GraphVisualizer";
import { a_star } from "../model/algorithms/a_star";

type ComponentProps = {
  children: ReactNode;
};

type TableLineProps = {
  column1: string;
  column2: string;
  column3: number;
};

export type ExploreProps = {
  dstVertex: string;
  srcVertex: string;
  local_distance: number;
  total_distance: number;
  visited: number;
};

export type StraightPathProps = {
  dstVertex: string;
  srcVertex: string;
  distance: number;
};

export type MainObject = {
  MainGraph: Graph;
  setMainGraph: (v: Graph) => void;
  tab: number;
  setTab: (v: number) => void;
  explorePath: ExploreProps[];
  setExplorePath: (e: ExploreProps[]) => void;
  visualGraph: GraphVisualizerElement;
  setVisualGraph: (e: GraphVisualizerElement) => void;
  tableData: TableLineProps[];
  setTableData: (e: TableLineProps[]) => void;
  startVertex: string;
  setStartVertex: (v: string) => void;
  endVertex: string;
  setEndVertex: (v: string) => void;
  straightPath: StraightPathProps[];
  setStraightPath: (e: StraightPathProps[]) => void;
  distStraighPath: number;
};
export const MainContext = createContext({} as MainObject);

export function MainContextProvider(props: ComponentProps) {
  const [tab, setTab] = useState(0);
  const [MainGraph, setMainGraph] = useState<Graph>({} as Graph);
  const [explorePath, setExplorePath] = useState<ExploreProps[]>([]);
  const [tableData, setTableData] = useState<Array<TableLineProps>>([]);
  const [startVertex, setStartVertex] = useState("");
  const [endVertex, setEndVertex] = useState("");
  const [distStraighPath, setDistStraightPath] = useState(0);

  const [straightPath, setStraightPath] = useState<StraightPathProps[]>([]);
  const [visualGraph, setVisualGraph] = useState<GraphVisualizerElement>({
    nodes: [],
    links: [],
  });

  useEffect(() => {
    if (
      startVertex.length > 0 &&
      endVertex.length > 0 &&
      !!MainGraph &&
      !!MainGraph.graph
    ) {
      const result = a_star(MainGraph).run(startVertex, endVertex);
      setExplorePath(result.output);
      setStraightPath(result.straight_path as any);
      setDistStraightPath(result.distance);
    }
  }, [endVertex]);

  useEffect(() => {
    if (!!MainGraph && !!MainGraph.graph && MainGraph.graph.length > 0) {
      // console.log(MainGraph);
      const nodes = MainGraph.graph.map((n) => {
        return {
          x: 0,
          y: 0,
          color: "#b9bcd6",
          name: n.vertex.name,
          id: n.vertex.name,
          vx: 0,
          vy: 0,
        };
      });

      const links: {
        source: string;
        target: string;
        color: string;
        weight: number;
      }[] = [];

      MainGraph.graph.forEach((l) => {
        l.edges.list.forEach((a) => {
          links.push({
            weight: a.weight,
            source: l.vertex.name,
            target: a.dstVertex,
            color: "#b9bcd6",
          });
        });
      });

      const distances: TableLineProps[] = [];

      MainGraph.graph.forEach((i) => {
        i.vertex.distances.forEach((d) => {
          distances.push({
            column1: i.vertex.name,
            column2: d.dstVertex,
            column3: d.euclidean_distance,
          });
        });
      });

      setTableData(distances);

      setVisualGraph({
        nodes,
        links,
      });
    }
  }, [MainGraph]);

  return (
    <MainContext.Provider
      value={{
        MainGraph,
        setMainGraph,
        tab,
        setTab,
        explorePath,
        setExplorePath,
        visualGraph,
        setVisualGraph,
        tableData,
        setTableData,
        startVertex,
        setStartVertex,
        endVertex,
        setEndVertex,
        straightPath,
        setStraightPath,
        distStraighPath,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
}
