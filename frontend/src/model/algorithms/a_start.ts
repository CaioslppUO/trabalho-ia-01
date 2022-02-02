import { Graph, AStar } from "../types/graphTypes";

/**
 * Representa o custo de um vértice. Pode ser utilizado para representar g(n), h(n) ou g(n) + h(n).
 */
interface Cost {
    vertex: string;
    cost: number;
}

/**
 * Cria um objeto do tipo Cost.
 * @param vertex Vértice do qual se tem o custo.
 * @param value Custo do vértice.
 * @returns Objeto que representa o custo de um vértice.
 */
const Cost = (vertex: string, cost: number): Cost => {
    return {
        vertex,
        cost
    }
}

/**
 * Representa o caminho percorrido pelo algoritmo.
 */
interface Path {
    srcVertex: string;
    dstVertex: string;
}

/**
 * Cria um objeto do tipo Path.
 * @param srcVertex Vértice de origem.
 * @param dstVertex Vértice de destino.
 * @returns Objeto que representa a movimentação de srcVertex para dstVertex no grafo.
 */
const Path = (srcVertex: string, dstVertex: string): Path => {
    return {
        srcVertex,
        dstVertex
    }
}

/**
 * Representa o resultado do preenchimento das variáveis iniciais para a execução do algoritmo.
 * path: Caminho com o menor custo percorrido.
 * past_cost: Vetor com os custos de todos os nós passados até agora. g(n).
 * function_cost: Vetor com os custos de todos os nós passados até agora somado às distâncias em linha reta. g(n) + h(n).
 */
interface Arrays {
    path: Array<Path>;
    past_costs: Array<Cost>;
    function_costs: Array<Cost>;
}

export const a_star = (graph: Graph): AStar => {
    const INFINITY = Number.MAX_SAFE_INTEGER;
    /**
     * Função que calcula a heurística.
     * @param srcVertex Vértice inicial.
     * @param dstVertex Vértice final.
     * @returns Distância em linha reta entre os vértices ou undefined caso não encontre a distância.
     */
    const h = (srcVertex: string, dstVertex: string): number => {
        let vertex = graph.getVertex(srcVertex);
        if(typeof vertex !== 'undefined') {
            let distances = vertex.vertex.distances;
            for(let d in distances) {
                if(distances[d].dstVertex === dstVertex) return distances[d].euclidean_distance;
            }
        }
        throw `Could not calculate the heuristic function for ${srcVertex} -> ${dstVertex}`;
    }

    /**
     * Acha a posição de um vértice na lista de custos.
     * @param distance Vetor de custos.
     * @param vertex Vértice a ser procurado.
     * @returns Posição do vértice na lista ou undefined caso não seja encontrado.
     */
     const find_vertex_position = (costs: Array<Cost>, vertex: string): number => {
        let i = 0;
        for(let c in costs) {
            if(costs[c].vertex === vertex) return i;
            i++;
        }
        throw "Cold not find vertex position in costs array";
    }

    /**
     * Dado os vértices iniciais e finais inicializa as variáveis utilizadas pelo algoritmo.
     * @param start_vertex Vértice de início.
     * @param end_vertex Vértice de objetivo.
     * @returns Variáveis utilizadas pelo algoritmo preenchidas.
     */
    const preparations = (start_vertex: string, end_vertex: string): Arrays => {
        // Vetor que guarda o caminho percorrido com o melhor custo até então.
        let path: Array<Path> = [];
        // Vetor de custos percorridos g(n).
        let past_costs: Array<Cost> = [];
        // Vetor de custos estimados g(n) + h(n).
        let function_costs: Array<Cost> = [];

        // Preenchimento dos vetores de custo.
        for(let v in graph.graph) {
            function_costs.push(
                Cost(
                    graph.graph[v].vertex.name,
                    INFINITY
                )
            );
            past_costs.push(
                Cost(
                    graph.graph[v].vertex.name,
                    INFINITY
                )
            )
        }

        // Preenchimento do custo estimado e custo passado do vértice inicial.
        let start_function_cost_position = find_vertex_position(function_costs, start_vertex);
        let start_past_cost_position = find_vertex_position(past_costs, start_vertex);
        // Calculo de h(n) para o vértice inicial.
        let start_function_cost = h(start_vertex, end_vertex);
        function_costs[start_function_cost_position].cost = start_function_cost;
        past_costs[start_past_cost_position].cost = 0;

        return {
            path,
            past_costs,
            function_costs
        }
    }

    /**
     * Dado um vetor de custos, retorna o vértice com menor custo.
     * @param costs Vetor de custos.
     * @returns Nome do vértice com menor custo.
     */
    const get_vertex_with_lowers_cost = (costs: Array<Cost>): string => {
        if(costs.length > 0) {
            let lower = 0;
            let i = 0;
            for(let c in costs) {
                if(costs[c].cost < costs[lower].cost) lower = i;
                i++;
            }
            return costs[lower].vertex;
        } else {
            throw "Costs Array has no elements";
        }
    }

    /**
     * Retorna o custo de um vértice.
     * @param costs Vetor de custos.
     * @param vertex Vértice para buscar.
     * @return Custo do vértice ou undefined caso não encontrar.
     */
    const get_vertex_cost = (costs: Array<Cost>, vertex: string): number => {
        for(let c in costs) {
            if(costs[c].vertex == vertex) return costs[c].cost;
        }
        throw "Could not find vertex in costs array";
    }

    const reconstruct_path = (srcVertex: string, dstVertex: string) => {
        
    }

    /**
     * Função que executa o algoritmo A*.
     * @param start_vertex Vértice de início do algoritmo.
     * @param end_vertex Vértice de destino do algoritmo.
     */
    const run = (start_vertex: string, end_vertex: string) => {
        // Lista de nós descobertos que podem ser expandidos.
        let priority_queue: Array<Cost> = [];
        priority_queue.push(Cost(start_vertex, h(start_vertex, end_vertex)));
        // Inicializa as variáveis necessárias.
        let prep: Arrays = preparations(start_vertex, end_vertex);
        while(priority_queue.length != 0) { // Enquanto existirem nós que possam ser expandidos.
            let next = get_vertex_with_lowers_cost(priority_queue);
            if(next == end_vertex) {
                console.log(prep.path);
                console.log("aaaa");
                break;
            };
            priority_queue = priority_queue.filter((element) => {
                return !(element.vertex===next);
            })
            let vertex = graph.getVertex(next);
            if(typeof vertex !== 'undefined') {
                for(let e in vertex.edges.list) { // Percorre todas as arestas do vértice.
                    let neighbor_vertex = vertex.edges.list[e].dstVertex;
                    let neighbor_weigh = vertex.edges.list[e].weight;
                    // Custo de avançar por esse caminho.
                    let try_cost = get_vertex_cost(prep.past_costs, next) + neighbor_weigh;
                    if(try_cost < get_vertex_cost(prep.past_costs, neighbor_vertex)) {
                        // Marca que esse foi o caminho escolhido.
                        prep.path.push(Path(next, neighbor_vertex));
                        // Atribuição do custo passado (g(n)) para o vértice vizinho.
                        let past_pos = find_vertex_position(prep.past_costs, neighbor_vertex);
                        prep.past_costs[past_pos].cost = try_cost;
                        // Atribuição do custo passado + estimativa (g(n) + h(n)) para o vizinho.
                        let function_pos = find_vertex_position(prep.function_costs, neighbor_vertex);
                        prep.function_costs[function_pos].cost = try_cost + h(neighbor_vertex, end_vertex);
                        //Caso o próximo nó não esteja na lista de nós que podem ser expandidos ele é adicionado.
                        for(let p in priority_queue) if(priority_queue[p].vertex === neighbor_vertex) break;
                        priority_queue.push(Cost(neighbor_vertex, prep.function_costs[function_pos].cost));
                    }
                }
            } else {
                throw `Could not find vertex ${next}.`
            }
        }
        console.log("Caminho não encontrado");
    }

    return {
        run
    }
}

