import {
  AdjacencyListItem,
  AlgorithmOutput,
  Graph,
  Output,
  StraightPath,
} from "../types/graphTypes";

/**
 * Algoritmo busca em profundidade(depth first search)
 * @param graph objeto que representa o grafo a ser explorado
 * @returns um método para realizar a exploração chamado run
 */
export const dfs = (graph: Graph) => {
  /**
   * Vetor que representa a pilha responsável por armazenar a fronteira a ser explorada pelo algoritmo
   */
  const borders: {
    item: AdjacencyListItem;
    distance: number;
    visited: number;
    predecessor: string;
    localDistance: number;
  }[] = [];

  /**
   * Vetor que irá compor o caminho percorrido pelo algoritmo
   */
  const out: Output[] = [];

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
   * Método responsável por realizar a exploração do grafo
   * @param src vértice de início
   * @param dst vértice de destino
   * @returns objeto contendo caminho percorrido, menor caminho encontrado, e distância do menor caminho
   */
  const run = (src: string, dst: string): AlgorithmOutput => {
    const origin = graph.getVertex(src);
    if (!!origin) {
      borders.push({
        item: origin,
        distance: 0,
        visited: 0,
        predecessor: "none",
        localDistance: 0,
      });

      while (borders.length > 0) {
        const v = borders.pop();
        // console.log(v?.item.vertex.name);

        if (!!v && v.item.vertex.name !== src) {
          out.push({
            srcVertex: v.predecessor,
            dstVertex: v.item.vertex.name,
            local_distance: v.localDistance,
            total_distance: v.distance,
            visited: v.visited,
          });
        }

        if (v?.item.vertex.name === dst) {
          return {
            distance: v.distance,
            output: out,
            straight_path: get_straight_path(out, dst),
            time: 0,
          };
        }
        v?.item.edges.list.forEach((i) => {
          const a = graph.getVertex(i.dstVertex);

          if (!!a) {
            borders.push({
              item: a,
              distance: v.distance + i.weight,
              visited: v.visited + 1,
              predecessor: v.item.vertex.name,
              localDistance: i.weight,
            });
          }
        });
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
