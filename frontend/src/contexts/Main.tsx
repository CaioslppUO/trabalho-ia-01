import { ReactNode, useState } from "react";
import { createContext } from "react";
import { Graph } from "../model/types/graphTypes";

type ComponentProps = {
  children: ReactNode;
};

export type ExploreProps = {
  dstVertex: string;
  srcVertex: string;
};

export type MainObject = {
  MainGraph: Graph;
  setMainGraph: (v: Graph) => void;
  tab: number;
  setTab: (v: number) => void;
  explorePath: ExploreProps[];
  setExplorePath: (e: ExploreProps[]) => void;
};
export const MainContext = createContext({} as MainObject);

export function MainContextProvider(props: ComponentProps) {
  const [tab, setTab] = useState(0);
  const [MainGraph, setMainGraph] = useState<Graph>({} as Graph);
  const [explorePath, setExplorePath] = useState<ExploreProps[]>([]);

  return (
    <MainContext.Provider
      value={{
        MainGraph,
        setMainGraph,
        tab,
        setTab,
        explorePath,
        setExplorePath,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
}
