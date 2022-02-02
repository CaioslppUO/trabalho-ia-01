/**
 * Representa uma lista encadeada simples.
 */
export interface LinkedList<T> {
    list: Array<T>;
    insert: (element: T) => void;
}

/**
 * Representa o conteúdo de cada vértice do grafo e o peso de uma aresta de vértice em relação a outro vértice.
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
    vertexName: string;
    edges: LinkedList<GraphEdge>;
    distances: Array<EuclideanDistance>;
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
    insert: (vertexName: string, adjVertex: string, weight: number) => void;
    /**
     * Procura um vértice pelo nome e o retorna, junto com todas as suas arestas.
     * @param vertexName Nome do vértice para procurar.
     * @returns Vértice encontrado e suas arestas ou undefined caso não encontre.
     */
    getVertex: (vertexName: string) => AdjacencyListItem;
    /**
     * Imprime o grafo no terminal em formato JSON.
     */
    show: () => void;
}