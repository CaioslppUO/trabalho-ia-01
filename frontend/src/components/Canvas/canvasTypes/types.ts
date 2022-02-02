/**
 * Tipo responsável por representar os nós da interface referentes aos vértices
 */
export type NodeProps = {
  name: string;
  color: string;
  x: number;
  y: number;
};

/**
 * Tipo utilizado para representar os links na interface referentes as arestas
 */
export type LinkProps = {
  source: string;
  target: string;
  color: string;
  distance: number;
};

/**
 * Tipo responsável pelo link utilizado para desenho na tela
 */
export type DrawLinkProps = {
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

/**
 * Tipo que representa um grafo na interface, possui vértices a arestas
 */
export type GraphProps = {
  nodes: NodeProps[];
  links: LinkProps[];
};
