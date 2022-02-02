import { CreateLinkedList } from "./linked_list";
import { GraphEdge, EuclideanDistance, Vertex, AdjacencyListItem, Graph } from "../types/graphTypes";

/**
 * Cria e retorna um objeto do tipo GraphEdge.
 * @param dstVertex Nome do vértice de destino da aresta.
 * @param weight Peso da aresta do vértice em relação a um outro vértice.
 * @returns Objeto do tipo GraphEdge.
 */
export const CreateGraphEdge = (dstVertex: string, weight: number): GraphEdge => {
    return {
        dstVertex,
        weight
    }
}

/**
 * Cria um objeto do tipo EuclideanDistance.
 * @param dstVertex Vértice de destino.
 * @param distance Distância em linha reta entre a origem e o destino.
 * @returns Objeto do tipo EuclideanDistance que representa a distância euclidiana entre um vértice qualquer e o vértice dstVertex.
 */
export const CreateEuclideanDistance = (dstVertex: string, euclidean_distance: number): EuclideanDistance => {
    return {
        dstVertex,
        euclidean_distance
    }
}

/**
 * Cria um objeto do tipo Vertex.
 * @param name Nome do vértice.
 * @param distances Vetor de distâncias euclidianas desse vértice para todos os outros.
 * @returns Objeto do tipo vertex que representa um vértice do grafo.
 */
export const CreateVertex = (name: string, distances: Array<EuclideanDistance>): Vertex => {
    return {
        name,
        distances
    }
}

/**
 * Cria um objeto do tipo AdjacencyListItem
 * @param vertexName Nome do vértice.
 * @returns Objeto do tipo AdjacencyListItem.
 */
const CreateAdjacencyListItem = (vertexName: string, distances: Array<EuclideanDistance>): AdjacencyListItem => {
    return {
        vertexName,
        edges: CreateLinkedList(),
        distances
    }
}

/**
 * Cria o objeto que controla a lista de adjacência que representa o grafo.
 * @returns Objeto do tipo Graph.
 */
export const CreateGraph = (vertices: Array<Vertex>): Graph => {
    // Lista de Adjacência.
    let adjList: Array<AdjacencyListItem> = [];

    for(let vertex in vertices) { // Inicialização da lista de adjacência.
        adjList.push(CreateAdjacencyListItem(vertices[vertex].name, vertices[vertex].distances));
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
                adjList[adjItem].edges.insert(CreateGraphEdge(dstVertexName, weight));
            }
        }
    }

    /**
     * Procura um vértice pelo nome e o retorna, junto com todas as suas arestas.
     * @param vertexName Nome do vértice para procurar.
     * @returns Vértice encontrado e suas arestas ou undefined caso não encontre.
     */
    const getVertex = (vertexName: string): AdjacencyListItem => {
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
        graph: adjList,
        insert,
        getVertex,
        show
    }
}

// Exemplo de uso
// let vertices = [
//     Vertex(
//         "a",
//         [
//             EuclideanDistance("b", 70),
//             EuclideanDistance("c", 50)
//         ]
//     ),
//     Vertex(
//         "b",
//         [
//             EuclideanDistance("a", 70),
//             EuclideanDistance("c", 40)
//         ]
//     ),
//     Vertex(
//         "c",
//         [
//             EuclideanDistance("a", 50),
//             EuclideanDistance("b", 40)
//         ]
//     )
// ]
// let graph = Graph(vertices);
// graph.insert("a", "b", 100);
// graph.insert("a", "c", 80);
// console.log(graph.getVertex("a"));
// graph.show();
