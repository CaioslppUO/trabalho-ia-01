import { CreateGraph } from "./structure/adjacency_list";
import { EuclideanDistance, Vertex, Graph } from "./types/graphTypes";
import { a_star } from "./algorithms/a_start";

// const fs = require("fs");

/**
 * Representa o conteúdo do arquivo de entrada.
 */
interface EntryFileContent {
  srcVertex: string;
  dstVertex: string;
  distance: number;
}

/**
 * Cria um objeto do tipo EntryFileContent.
 * @param srcVertex Vértice de origem.
 * @param dstVertex Vértice de destino.
 * @param distance Distância entre os vértices.
 * @returns Objeto do tipo EntryFileContent.
 */
const EntryFileContent = (
  srcVertex: string,
  dstVertex: string,
  distance: number
): EntryFileContent => {
  return {
    srcVertex,
    dstVertex,
    distance,
  };
};

/**
 * Extrai co conteúdo do arquivo de entrada.
 * @param content Texto carregado do arquivo de entrada.
 * @returns Objeto do tipo Array<EntryFileContent>, contendo todos as rotas lidas do arquivo de entrada.
 */
const extract_entry_file_content = (
  content: string
): Array<EntryFileContent> => {
  let entry: Array<EntryFileContent> = [];
  let lines = content.split("\n");
  for (let line in lines) {
    if (lines[line].length != 0) {
      entry.push(
        EntryFileContent(
          String(lines[line].split("(")[1].split(",")[0]).replace(/\s/g, ""),
          String(lines[line].split(",")[1]).replace(/\s/g, ""),
          Number(lines[line].split("(")[1].split(")")[0].split(",")[2])
        )
      );
    }
  }
  return entry;
};

/**
 * Extrai co conteúdo do arquivo de entrada com as distâncias euclidianas.
 * @param content Texto carregado do arquivo de entrada.
 * @returns Objeto do tipo Array<Vertex> contendo todos os vértices e as distâncias entre todos eles.
 */
const extract_h_entry_file_content = (content: string): Array<Vertex> => {
  let entry: Array<Vertex> = [];
  let lines = content.split("\n");
  for (let line in lines) {
    // Processamento da leitura do arquivo.
    let found = false;
    if (lines[line].length != 0) {
      let srcVertex = String(lines[line].split("(")[1].split(",")[0]).replace(
        /\s/g,
        ""
      );
      let dstVertex = String(lines[line].split(",")[1]).replace(/\s/g, "");
      let distance = Number(
        lines[line].split("(")[1].split(")")[0].split(",")[2]
      );
      for (let v in entry) {
        if (entry[v].name == srcVertex) {
          // Inserção de uma nova distância de um vértice já inserido.
          entry[v].distances.push(EuclideanDistance(dstVertex, distance));
          found = true;
        }
      }
      if (!found) {
        // Inserção de um novo vértice.
        entry.push(Vertex(srcVertex, [EuclideanDistance(dstVertex, distance)]));
      }
    }
  }
  return entry;
};

/**
 * Realiza o processamento do arquivo de entrada para o programa, separando as variáveis de entrada e as alocando em uma estrutura de grafo.
 * @param content Conteúdo do arquivo de entrada.
 * @param h_content Conteúdo do arquivo de entrada das distâncias euclidianas.
 * @returns Objeto do tipo Graph, preenchido a partir do arquivo de entrada.
 */
export const process_entry_file = (
  content: string,
  h_content: string
): Graph => {
  let vertices: Array<Vertex> = [];
  let entry = extract_entry_file_content(content);
  let entry_h = extract_h_entry_file_content(h_content);

  // Preenchimento de todos os vértices do grafo.
  let points: Array<string> = [];
  for (let e in entry) {
    // Percorre todos os nós carregados.
    if (!points.includes(entry[e].srcVertex)) {
      points.push(entry[e].srcVertex);
    }
    if (!points.includes(entry[e].dstVertex)) {
      points.push(entry[e].dstVertex);
    }
  }

  // Preenchimento das distâncias euclidianas.
  for (let point in points) {
    let distances: Array<EuclideanDistance> = [];
    distances.push(EuclideanDistance(points[point], 0));
    for (let h in entry_h) {
      // Percorre todas as distâncias euclidianas.
      if (points[point] == entry_h[h].name) {
        // Preenchimento da distância de "a" para "b".
        for (let d in entry_h[h].distances) {
          distances.push(
            EuclideanDistance(
              entry_h[h].distances[d].dstVertex,
              entry_h[h].distances[d].euclidean_distance
            )
          );
        }
      }
      for (let d in entry_h[h].distances) {
        if (entry_h[h].distances[d].dstVertex == points[point]) {
          // Preenchimento da distância de "b" para "a".
          distances.push(
            EuclideanDistance(
              entry_h[h].name,
              entry_h[h].distances[d].euclidean_distance
            )
          );
        }
      }
    }
    vertices.push(Vertex(points[point], distances));
  }

  // Criação do grafo.
  let graph = CreateGraph(vertices);

  // Preenchimento das arestas
  for (let e in entry) {
    graph.insert(entry[e].srcVertex, entry[e].dstVertex, entry[e].distance);
  }
  return graph;
};

// Exemplo de uso
// fs.readFile('/home/caioslpp/git/trabalho-ia-01/examples/entry.txt', 'utf8' , (err: any, data: any) => {
//     if (err) {
//       console.error(err)
//       return
//     }
//     fs.readFile('/home/caioslpp/git/trabalho-ia-01/examples/entry_h.txt', 'utf8' , (err: any, data_2: any) => {
//         if (err) {
//           console.error(err)
//           return
//         }
//         let graph = process_entry_file(data, data_2);
//         let a = a_star(graph).run("a","f");
//     })
// })
