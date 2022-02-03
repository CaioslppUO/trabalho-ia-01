import { AStar, Graph } from "../types/graphTypes";

/**
 * Representa o custo de um vértice. Pode ser utilizado para representar g(n), h(n) ou g(n) + h(n).
 */
interface Cost {
    vertex: string;
    cost: number;
}

/**
 * Representa a saída do algoritmo.
 */
interface Output {
    srcVertex: string;
    dstVertex: string;
    explored: number;
    expanded: number;
}

/**
 * Representa os vetores utilizados no algoritmo A*.
 */
interface Process {
    g_n: Array<Cost>;
    f_n: Array<Cost>;
    output: Array<Output>;
}

/**
 * Acha a posição de um vértice em um vetor de custos de vértices.
 * @param arr Array de custos de vértice.
 * @param vertex Vértice para ser procurado.
 * @returns Posição do vértice no array.
 */
const find_position = (arr: Array<Cost>, vertex: string): number => {
    let i = 0;
        for(let c in arr) {
            if(arr[c].vertex === vertex) return i;
            i++;
        }
        throw Error("Cold not find vertex position in costs array");
}

/**
 * Algoritmo A*.
 * @param start Vértice de início.
 * @param end Vértice de término.
 * @return Objeto que representa a saída do algoritmo, contendo o caminho executado e medidas de desempenho.
 */
export const a_start = (graph: Graph): AStar => {
    const INF = Number.MAX_SAFE_INTEGER;
    
    /**
     * Função heurística.
     * @param src Vértice de origem.
     * @param dst Vértice de destino.
     * @returns Distância em linha reta entre os dois vértices.
     */
    const h = (src: string, dst: string): number => {
        let vertex = graph.getVertex(src);
        if(typeof vertex !== 'undefined') {
            let distances = vertex.vertex.distances;
            for(let d in distances) {
                if(distances[d].dstVertex === dst) return distances[d].euclidean_distance;
            }
        } else {
            throw Error(`Could not calculate the heuristic function for ${src} -> ${dst}`);
        }
        return 0;
    }

     /**
     * Dado um vetor de custos retorna o vértice com menor custo.
     * @param arr Vetor de custos.
     * @returns Nome do vértice com menor custo.
     */
      const get_vertex_with_lowers_cost = (arr: Array<Cost>): string => {
        if(arr.length > 0) {
            let lower = 0;
            let i = 0;
            for(let c in arr) {
                if(arr[c].cost < arr[lower].cost) lower = i;
                i++;
            }
            return arr[lower].vertex;
        } else {
            throw Error("Costs Array has no elements");
        }
    }

    /**
     * Retorna o custo de um vértice.
     * @param arr Vetor de custos.
     * @param vertex Vértice para buscar.
     * @return Custo do vértice.
     */
     const get_vertex_cost = (arr: Array<Cost>, vertex: string): number => {
        for(let c in arr) {
            if(arr[c].vertex === vertex) return arr[c].cost;
        }
        throw Error("Could not find vertex in costs array");
    }

    /**
     * Inicializa os vetores utilizados pelo algoritmo A*.
     * @param src Vértice de origem para a execução.
     * @param dst Vértice de destino para a execução.
     * @returns Objeto do tipo Process que contém os vetores utilizados pelo algoritmo, já preenchidos com os valores iniciais.
     */
    const init = (src: string, dst: string): Process => {
        // Objeto que contém os vetores utilizados durante o algoritmo A*.
        const process: Process = { g_n:[], f_n:[], output:[]}
        // Preenchimento dos vetores de custo.
        for(let v in graph.graph) {
            process.g_n.push({ vertex: graph.graph[v].vertex.name, cost: INF })
            process.f_n.push({ vertex: graph.graph[v].vertex.name, cost: INF });
        }
        // Preenchimento do custo estimado e custo passado do vértice inicial.
        let src_g_n_pos = find_position(process.g_n, src);
        let src_f_n_pos = find_position(process.f_n, src);
        // g(n) para o vértice inicial.
        process.g_n[src_g_n_pos].cost = 0;
        // Calculo de h(n) para o vértice inicial.
        let src_h_n_cost = h(src, dst);
        process.f_n[src_f_n_pos].cost = src_h_n_cost;
        return process;
    }

    /**
     * Executa o algoritmo A* e retorna a saída.
     * @param src Vértice de origem.
     * @param dst Vértice de destino.
     * @returns Vetor com os caminhos percorridos pelo algoritmo e medidas de desempenho.
     */
    const run = (src: string, dst: string): Array<Output> => {
        // Conta o número de nós expandidos e explorados.
        let expanded: number = 0, explored: number = 0
        // Inicialização dos vetores utilizados pelo algoritmo.
        const process = init(src, dst);
        // Fila de prioridade de expansão dos nós.
        let priority_queue: Array<Cost> = [];
        // Inicializa a fila de prioridade com o nó inicial.
        priority_queue.push({vertex: src, cost: h(src, dst)});

        while(priority_queue.length !== 0) { // Enquanto existirem nós que possam ser expandidos.
            let next = get_vertex_with_lowers_cost(priority_queue); // Seleciona um nó para expansão.
            expanded++;
            if(next === dst) { return process.output; }; // Achou a resposta.

            priority_queue = priority_queue.filter((element) => { // Remoção do nó explorado da fila
                return !(element.vertex===next);
            });

            let vertex = graph.getVertex(next);

            if(typeof vertex !== 'undefined') {
                for(let e in vertex.edges.list) { // Percorre todas as arestas do vértice.
                    let neighbor_vertex = vertex.edges.list[e].dstVertex;
                    let neighbor_weigh = vertex.edges.list[e].weight;
                    let try_cost = get_vertex_cost(process.g_n, next) + neighbor_weigh; // Custo de avançar por esse caminho.
                    if(try_cost < get_vertex_cost(process.g_n, neighbor_vertex)) { // Explora o nó expandido.
                        explored++;
                        // Marca que esse foi o caminho escolhido.
                        process.output.push({
                            srcVertex: next,
                            dstVertex: neighbor_vertex,
                            expanded: expanded,
                            explored: explored
                        })

                        // Atribuição do custo passado (g(n)) para o vértice vizinho.
                        let g_n_pos = find_position(process.g_n, neighbor_vertex);
                        process.g_n[g_n_pos].cost = try_cost;

                        // Atribuição do custo passado + estimativa (g(n) + h(n)) para o vizinho.
                        let f_n_pos = find_position(process.f_n, neighbor_vertex);
                        process.f_n[f_n_pos].cost = try_cost + h(neighbor_vertex, dst);

                        //Caso o próximo nó não esteja na lista de nós que podem ser expandidos ele é adicionado.
                        for(let p in priority_queue) if(priority_queue[p].vertex === neighbor_vertex) break;
                        priority_queue.push({vertex: neighbor_vertex, cost: process.f_n[f_n_pos].cost});
                    }
                }
            } else {
                throw Error(`Could not find vertex ${next}.`);
            }
        }
        return [];
    }

    return {
        run
    }
}