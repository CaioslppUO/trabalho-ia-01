import { LinkedList } from "./linked_list";

/**
 * Representa o conteúdo de cada vértice do grafo e o peso de uma aresta de vértice em relação a outro vértice.
 */
export interface GraphVertex {
    name: string;
    weight: number;
}

/**
 * Cria e retorna um objeto do tipo GraphVertex.
 * @param name Nome do vértice.
 * @param weight Peso da aresta do vértice em relação a um outro vértice.
 * @returns Objeto do tipo GraphVertex.
 */
export const GraphVertex = (name: string, weight: number): GraphVertex => {
    return {
        name,
        weight
    }
}

/**
 * Representa um item da lista de adjacência utilizada para representar o grafo.
 */
interface AdjacencyListItem {
    vertexName: string;
    linkedList: LinkedList<GraphVertex>;
}

/**
 * Cria um objeto do tipo AdjacencyListItem
 * @param vertexName Nome do vértice.
 * @returns Objeto do tipo AdjacencyListItem.
 */
const AdjacencyListItem = (vertexName: string): AdjacencyListItem => {
    return {
        vertexName,
        linkedList: LinkedList()
    }
}

/**
 * Representa a lista de adjacência utilizada para representar o grafo.
 */
export interface AdjacencyList {
    // Lista de Adjacência.
    adjList: Array<AdjacencyListItem>;
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
    getVertexEdges: (vertexName: string) => AdjacencyListItem;
    /**
     * Imprime o grafo no terminal em formato JSON.
     */
    show: () => void;
}

/**
 * Cria o objeto que controla a lista de adjacência que representa o grafo.
 * @returns Objeto do tipo AdjacencyList.
 */
export const AdjacencyList = (vertices: Array<string>): AdjacencyList => {
    // Lista de Adjacência.
    let adjList: Array<AdjacencyListItem> = [];

    for(let vertex in vertices) { // Inicialização da lista de adjacência.
        adjList.push(AdjacencyListItem(vertices[vertex]));
    }

    /**
     * Insere uma nova aresta na lista de adjacência do grafo.
     * @param srcVertexName Vértice de origem da aresta.
     * @param dstVertexName Vértice de destino da aresta.
     * @param weight Peso da aresta.
     */
    const insert = (srcVertexName: string, dstVertexName: string, weight: number): void => {
        for(let adjItem in adjList) {
            if(adjList[adjItem].vertexName === srcVertexName) { // Achou onde a aresta deve ser inserida.
                adjList[adjItem].linkedList.insert(GraphVertex(dstVertexName, weight));
            }
        }
    }

    /**
     * Procura um vértice pelo nome e o retorna, junto com todas as suas arestas.
     * @param vertexName Nome do vértice para procurar.
     * @returns Vértice encontrado e suas arestas ou undefined caso não encontre.
     */
    const getVertexEdges = (vertexName: string): AdjacencyListItem => {
        for(let adjItem in adjList) {
            if(adjList[adjItem].vertexName === vertexName) return adjList[adjItem];
        }
        return undefined;
    }

    /**
     * Imprime o grafo no terminal em formato JSON.
     */
    const show = (): void => {
        console.log(JSON.stringify(adjList, null, 2));
    }

    return {
        adjList,
        insert,
        getVertexEdges,
        show
    }
}

/*  Exemplo de uso.
 *  let graph = AdjacencyList(["a","b","c","d"]);
 *  graph.insert("a", "b", 100);
 *  graph.insert("a", "c", 80);
 *  console.log(graph.getVertexEdges("a").linkedList);
 *  graph.show();
*/