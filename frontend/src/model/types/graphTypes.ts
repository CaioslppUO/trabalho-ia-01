/**
 * Representa uma lista encadeada simples.
 */
export interface LinkedList<T> {
  list: Array<T>;
  insert: (element: T) => void;
}

/**
 * Representa uma aresta do grafo, com um peso e um vértice de destino.
 */
export interface GraphEdge {
  dstVertex: string;
  weight: number;
}

/**
 * Representa a distância euclidiana de um vértice qualquer para o vértice dstVertex.
 */
export interface EuclideanDistance {
  dstVertex: string;
  euclidean_distance: number;
}

/**
 * Representa um vértice do grafo.
 */
export interface Vertex {
  name: string;
  distances: Array<EuclideanDistance>;
}

/**
 * Representa um item da lista de adjacência utilizada para representar o grafo.
 */
export interface AdjacencyListItem {
  vertex: Vertex;
  edges: LinkedList<GraphEdge>;
}

/**
 * Representa o algoritmo A*.
 */
export interface AStar {
  /**
   * Função que executa o algoritmo A*.
   * @param start_vertex Vértice de início do algoritmo.
   * @param end_vertex Vértice de destino do algoritmo.
   * @param optimize_distance Diz se o algoritmo deve ou não otimizar pela distância
   */
  run: (
    start_vertex: string,
    end_vertex: string,
    optimize_distance?: boolean
  ) => AlgorithmOutput;
}

/**
 * Representa a lista de adjacência utilizada para representar o grafo.
 */
export interface Graph {
  // Lista de Adjacência.
  graph: Array<AdjacencyListItem>;
  /**
   * Insere uma nova aresta na lista de adjacência do grafo.
   * @param srcVertexName Vértice de origem da aresta.
   * @param dstVertexName Vértice de destino da aresta.
   * @param weight Peso da aresta.
   */
  insert: (
    srcVertexName: string,
    dstVertexName: string,
    weight: number
  ) => void;
  /**
   * Procura um vértice pelo nome e o retorna, junto com todas as suas arestas.
   * @param vertexName Nome do vértice para procurar.
   * @returns Vértice encontrado e suas arestas ou undefined caso não encontre.
   */
  getVertex: (vertexName: string) => AdjacencyListItem | undefined;
  /**
   * Imprime o grafo no terminal em formato JSON.
   */
  show: () => void;
}

/**
 * Cria e retorna uma lista encadeada simples.
 * @returns
 */
export const LinkedList = <T>(): LinkedList<T> => {
  let list: Array<T> = [];

  const insert = (element: T): void => {
    list.push(element);
  };

  return {
    list,
    insert,
  };
};

/**
 * Cria e retorna um objeto do tipo GraphEdge.
 * @param dstVertex Nome do vértice de destino da aresta.
 * @param weight Peso da aresta do vértice em relação a um outro vértice.
 * @returns Objeto do tipo GraphEdge.
 */
export const GraphEdge = (dstVertex: string, weight: number): GraphEdge => {
  return {
    dstVertex,
    weight,
  };
};

/**
 * Cria um objeto do tipo EuclideanDistance.
 * @param dstVertex Vértice de destino.
 * @param distance Distância em linha reta entre a origem e o destino.
 * @returns Objeto do tipo EuclideanDistance que representa a distância euclidiana entre um vértice qualquer e o vértice dstVertex.
 */
export const EuclideanDistance = (
  dstVertex: string,
  euclidean_distance: number
): EuclideanDistance => {
  return {
    dstVertex,
    euclidean_distance,
  };
};

/**
 * Cria um objeto do tipo Vertex.
 * @param name Nome do vértice.
 * @param distances Vetor de distâncias euclidianas desse vértice para todos os outros.
 * @returns Objeto do tipo vertex que representa um vértice do grafo.
 */
export const Vertex = (
  name: string,
  distances: Array<EuclideanDistance>
): Vertex => {
  return {
    name,
    distances,
  };
};

/**
 * Cria um objeto do tipo AdjacencyListItem
 * @param vertexName Nome do vértice.
 * @returns Objeto do tipo AdjacencyListItem.
 */
export const AdjacencyListItem = (
  vertexName: string,
  distances: Array<EuclideanDistance>
): AdjacencyListItem => {
  return {
    vertex: Vertex(vertexName, distances),
    edges: LinkedList(),
  };
};

/**
 * Representa a resposta dada pelo algoritmo, junto com todas as métricas de desempenho.
 */
export interface AlgorithmOutput {
  straight_path: Array<StraightPath> | null;
  output: Array<Output>;
  distance: number;
  time: number;
}

/**
 * Representa o custo de um vértice. Pode ser utilizado para representar g(n), h(n) ou g(n) + h(n).
 */
export interface Cost {
  vertex: string;
  cost: number;
}

/**
 * Representa uma aresta e a distância entre essa aresta.
 */
export interface StraightPath {
  srcVertex: string;
  dstVertex: string;
  distance: number;
}

/**
 * Representa a saída preliminar do algoritmo.
 */
export interface Output {
  srcVertex: string;
  dstVertex: string;
  visited: number;
  explored: number;
  total_distance: number;
  local_distance: number;
}
