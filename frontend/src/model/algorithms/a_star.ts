import {
  AStar,
  Graph,
  AStarOutput,
  Cost,
  Output,
  StraightPath,
} from "../types/graphTypes";

/**
 * Representa os vetores utilizados no algoritmo A*.
 */
interface Process_array {
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
  for (let c in arr) {
    if (arr[c].vertex === vertex) return i;
    i++;
  }
  throw Error("Cold not find vertex position in costs array");
};

/**
 * Algoritmo A*.
 * @param start Vértice de início.
 * @param end Vértice de término.
 * @return Objeto que representa a saída do algoritmo, contendo o caminho executado e medidas de desempenho.
 */
export const a_star = (graph: Graph): AStar => {
  const INF = Number.MAX_SAFE_INTEGER;

  /**
   * Função heurística.
   * @param src Vértice de origem.
   * @param dst Vértice de destino.
   * @returns Distância em linha reta entre os dois vértices.
   */
  const h = (src: string, dst: string): number => {
    let vertex = graph.getVertex(src);
    if (typeof vertex !== "undefined") {
      let distances = vertex.vertex.distances;
      for (let d in distances) {
        if (distances[d].dstVertex === dst)
          return distances[d].euclidean_distance;
      }
    } else {
      throw Error(
        `Could not calculate the heuristic function for ${src} -> ${dst}`
      );
    }
    return 0;
  };

  /**
   * Dado um vetor de custos retorna o vértice com menor custo.
   * @param arr Vetor de custos.
   * @returns Nome do vértice com menor custo.
   */
  const get_vertex_with_lowers_cost = (arr: Array<Cost>): string => {
    if (arr.length > 0) {
      let lower = 0;
      let i = 0;
      for (let c in arr) {
        if (arr[c].cost < arr[lower].cost) lower = i;
        i++;
      }
      return arr[lower].vertex;
    } else {
      throw Error("Costs Array has no elements");
    }
  };

  /**
   * Retorna o custo de um vértice.
   * @param arr Vetor de custos.
   * @param vertex Vértice para buscar.
   * @return Custo do vértice.
   */
  const get_vertex_cost = (arr: Array<Cost>, vertex: string): number => {
    for (let c in arr) {
      if (arr[c].vertex === vertex) return arr[c].cost;
    }
    throw Error("Could not find vertex in costs array");
  };

  /**
   * Inicializa os vetores utilizados pelo algoritmo A*.
   * @param src Vértice de origem para a execução.
   * @param dst Vértice de destino para a execução.
   * @returns Objeto do tipo Process_array que contém os vetores utilizados pelo algoritmo, já preenchidos com os valores iniciais.
   */
  const init = (src: string, dst: string, optimize_distance: boolean = true): Process_array => {
    // Objeto que contém os vetores utilizados durante o algoritmo A*.
    const process_array: Process_array = { g_n: [], f_n: [], output: [] };
    // Preenchimento dos vetores de custo.
    for (let v in graph.graph) {
      process_array.g_n.push({ vertex: graph.graph[v].vertex.name, cost: INF });
      process_array.f_n.push({ vertex: graph.graph[v].vertex.name, cost: INF });
    }
    // Preenchimento do custo estimado e custo passado do vértice inicial.
    let src_g_n_pos = find_position(process_array.g_n, src);
    let src_f_n_pos = find_position(process_array.f_n, src);
    // g(n) para o vértice inicial.
    process_array.g_n[src_g_n_pos].cost = 0;
    // Calculo de h(n) para o vértice inicial.
    let src_h_n_cost: number;
    if(!optimize_distance) {
      src_h_n_cost = 0;
    } else {
      src_h_n_cost = h(src, dst);
    }
    process_array.f_n[src_f_n_pos].cost = src_h_n_cost;
    return process_array;
  };

  /**
   * Dado a resposta do algoritmo, retorna o caminho do ponto inicial até o vértice final.
   * @param output Resposta do A*.
   * @param dst Vértice de destino da execução do algoritmo.
   * @returns Objeto que representa o caminho entre o vértice inicial e o final.
   */
  const get_straight_path = (
    output: Array<Output>,
    dst: string
  ): Array<StraightPath> => {
    let res: Array<StraightPath> = [];
    let last = output[output.length - 1];
    let distance = last.local_distance;
    res.push({ dstVertex: dst, srcVertex: last.srcVertex, distance: distance });
    dst = last.srcVertex;
    for (let i = output.length - 2; i >= 0; i--) {
      if (output[i].dstVertex === dst) {
        res.push({
          dstVertex: dst,
          srcVertex: output[i].srcVertex,
          distance: output[i].local_distance,
        });
        dst = output[i].srcVertex;
      }
    }
    return res;
  };

  /**
   * Executa o algoritmo A* e retorna a saída.
   * @param src Vértice de origem.
   * @param dst Vértice de destino.
   * @returns Vetor com os caminhos percorridos pelo algoritmo e medidas de desempenho.
   */
  const run = (src: string, dst: string, optimize_distance: boolean = true): AStarOutput => {
    // let hrTime = process.hrtime()
    // let startTime = (hrTime[0] * 1000000 + hrTime[1] / 1000)/1000000;
    // Conta o número de nós expandidos e explorados.
    let total_distance: number = 0,
      visited: number = 0;
    // Inicialização dos vetores utilizados pelo algoritmo.
    const process_array = init(src, dst);
    // Fila de prioridade de expansão dos nós.
    let priority_queue: Array<Cost> = [];
    // Inicializa a fila de prioridade com o nó inicial.
    if(!optimize_distance) {
      priority_queue.push({ vertex: src, cost: 0 });
    } else {
      priority_queue.push({ vertex: src, cost: h(src, dst) });
    }
    

    while (priority_queue.length !== 0) {
      // Enquanto existirem nós que possam ser expandidos.
      let next = get_vertex_with_lowers_cost(priority_queue); // Seleciona um nó para expansão.
      if (next === dst) {
        let distance = 0;
        let straight = get_straight_path(process_array.output, dst);
        for (let s in straight) {
          distance += straight[s].distance;
        }
        // let hrTime = process.hrtime()
        // let endTime = (hrTime[0] * 1000000 + hrTime[1] / 1000)/1000000;
        return {
          output: process_array.output,
          straight_path: straight,
          distance,
          // time: endTime - startTime
          time: 0,
        };
      } // Achou a resposta.

      priority_queue = priority_queue.filter((element) => {
        // Remoção do nó explorado da fila
        return !(element.vertex === next);
      });

      let vertex = graph.getVertex(next);

      if (typeof vertex !== "undefined") {
        for (let e in vertex.edges.list) {
          // Percorre todas as arestas do vértice.
          let neighbor_vertex = vertex.edges.list[e].dstVertex;
          let neighbor_weigh = vertex.edges.list[e].weight;
          let try_cost: number;
          if(!optimize_distance){
            try_cost =
            get_vertex_cost(process_array.g_n, next) + 1; // Custo de avançar por esse caminho.
          } else {
            try_cost =
            get_vertex_cost(process_array.g_n, next) + neighbor_weigh; // Custo de avançar por esse caminho.
          }
          if (try_cost < get_vertex_cost(process_array.g_n, neighbor_vertex)) {
            // Explora o nó expandido.
            visited++;
            if(!optimize_distance) {
              total_distance += 1;
            } else {
              total_distance += neighbor_weigh;
            }
            // Marca que esse foi o caminho escolhido até então.
            process_array.output.push({
              srcVertex: next,
              dstVertex: neighbor_vertex,
              visited: visited,
              total_distance: total_distance,
              local_distance: neighbor_weigh,
            });

            // Atribuição do custo passado (g(n)) para o vértice vizinho.
            let g_n_pos = find_position(process_array.g_n, neighbor_vertex);
            process_array.g_n[g_n_pos].cost = try_cost;

            // Atribuição do custo passado + estimativa (g(n) + h(n)) para o vizinho.
            let f_n_pos = find_position(process_array.f_n, neighbor_vertex);
            if(!optimize_distance) {
              process_array.f_n[f_n_pos].cost = try_cost + 0;
            } else {
              process_array.f_n[f_n_pos].cost = try_cost + h(neighbor_vertex, dst);
            }
            

            //Caso o próximo nó não esteja na lista de nós que podem ser expandidos ele é adicionado.
            for (let p in priority_queue)
              if (priority_queue[p].vertex === neighbor_vertex) break;
            priority_queue.push({
              vertex: neighbor_vertex,
              cost: process_array.f_n[f_n_pos].cost,
            });
          }
        }
      } else {
        throw Error(`Could not find vertex ${next}.`);
      }
    }
    return {
      output: [],
      straight_path: [],
      distance: -1,
      time: -1,
    };
  };

  return {
    run,
  };
};
