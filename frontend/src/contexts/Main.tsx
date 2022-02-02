import { ReactNode, useState } from "react";
import { createContext } from "react";

type ComponentProps = {
  children: ReactNode;
};

export type MainGraph = {
  available_points: Array<string>;
  routes: {
    start_point: string;
    end_point: string;
    distance: number;
  }[];
};

export type MainObject = {
  MainGraph: MainGraph;
  setMainGraph: (v: MainGraph) => void;
  tab: number;
  setTab: (v: number) => void;
};
export const MainContext = createContext({} as MainObject);

export function MainContextProvider(props: ComponentProps) {
  const [tab, setTab] = useState(0);
  const [MainGraph, setMainGraph] = useState<MainGraph>({
    available_points: [],
    routes: [],
  });

  return (
    <MainContext.Provider value={{ MainGraph, setMainGraph, tab, setTab }}>
      {props.children}
    </MainContext.Provider>
  );
}
