import { ReactNode, useEffect, useState } from "react";
import { createContext } from "react";
import { Graph } from "../model/types/graphTypes";
import { GraphVisualizerElement } from "../components/GraphVisuzlizer/GraphVisualizer";
import { a_star } from "../model/algorithms/a_star";
import { edgeColor, vertexColor } from "../styles/graph";
import { dfs } from "../model/algorithms/dfs";

type ComponentProps = {
  children: ReactNode;
};

/**
 * Dado que representa a tabela de distâncias heurísticas
 */
type TableLineProps = {
  column1: string;
  column2: string;
  column3: number;
};

/**
 * Dado que representa um item do objeto de caminho percorrido
 */
export type ExploreProps = {
  dstVertex: string;
  srcVertex: string;
  local_distance: number;
  total_distance: number;
  visited: number;
};

/**
 * Dados que representa um item do objeto de menor caminho
 */
export type StraightPathProps = {
  dstVertex: string;
  srcVertex: string;
  distance: number;
};

/**
 * Tipo de dado que é compartilhado pelo componente main
 */
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
  clearVisualGraph: () => void;
  setOptimization: (o: boolean) => void;
  optimization: boolean;
  algorithm: "dfs" | "a_star";
  setAlgorithm: (a: "dfs" | "a_star") => void;
  execute: () => void;
};

/**
 * Provedor do contexto main
 */
export const MainContext = createContext({} as MainObject);

/**
 * Componente utilizado de forma principal para gerenciamento de estados
 */
export function MainContextProvider(props: ComponentProps) {
  const [tab, setTab] = useState(0);
  const [MainGraph, setMainGraph] = useState<Graph>({} as Graph);
  const [explorePath, setExplorePath] = useState<ExploreProps[]>([]);
  const [tableData, setTableData] = useState<Array<TableLineProps>>([]);
  const [startVertex, setStartVertex] = useState("");
  const [endVertex, setEndVertex] = useState("");
  const [optimization, setOptimization] = useState(true);
  const [distStraighPath, setDistStraightPath] = useState(0);
  const [algorithm, setAlgorithm] = useState<"dfs" | "a_star">("a_star");

  const [straightPath, setStraightPath] = useState<StraightPathProps[]>([]);
  const [visualGraph, setVisualGraph] = useState<GraphVisualizerElement>({
    nodes: [],
    links: [],
  });

  function clearVisualGraph() {
    const nodes = visualGraph.nodes.map((n) => {
      n.color = vertexColor;

      return n;
    });

    const links = visualGraph.links.map((n) => {
      n.color = edgeColor;

      return n;
    });

    setVisualGraph({
      nodes,
      links,
    });
  }

  function execute() {
    if (
      startVertex.length > 0 &&
      endVertex.length > 0 &&
      !!MainGraph &&
      !!MainGraph.graph
    ) {
      const result =
        algorithm === "a_star"
          ? a_star(MainGraph).run(startVertex, endVertex, optimization)
          : dfs(MainGraph).run(startVertex, endVertex);
      console.log(result);
      setExplorePath(result.output);
      setStraightPath(result.straight_path as any);
      setDistStraightPath(result.distance);
      clearVisualGraph();
    }
  }

  useEffect(() => {
    if (tab === 4) {
      execute();
    }
  }, [tab]);

  useEffect(() => {
    if (!!MainGraph && !!MainGraph.graph && MainGraph.graph.length > 0) {
      // console.log(MainGraph);
      const nodes = MainGraph.graph.map((n) => {
        return {
          x: 0,
          y: 0,
          color: vertexColor,
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
            color: edgeColor,
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
        clearVisualGraph,
        setOptimization,
        optimization,
        algorithm,
        setAlgorithm,
        execute,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
}
