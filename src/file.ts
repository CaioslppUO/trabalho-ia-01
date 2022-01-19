const fs = require("fs");
import { Map, Route } from "./map";

/**
 * Realiza a leitura de um arquivo.
 * @param file_path Caminho para o arquivo.
 * @returns Conteúdo lido do arquivo ou erro.
 */
const read_file = (file_path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(file_path, 'utf8', (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data);
            }
        })
    })
}

/**
 * Realiza a leitura do arquivo de entrada para o programa, separando as variáveis de entrada e as alocando em uma estrutura.
 * @param file_path Caminho para o arquivo de entrada.
 * @returns Objeto do tipo Map, preenchido a partir do arquivo de entrada.
 */
export const read_entry_file = (file_path: string): Promise<Map> => {
    return read_file(file_path)
    .then((content) => {
        let lines = String(content).split("\n");
        let available_points: Array<string> = [];
        let routes: Array<Route> = [];
        for(let line in lines) {
            if(lines[line].length != 0) {
                let start_point, end_point, distance;
                start_point = String(lines[line].split("(")[1].split(",")[0]);
                end_point = String(lines[line].split(",")[1]);
                distance = Number(lines[line].split("(")[1].split(")")[0].split(",")[2]);
                routes.push(Route(start_point,end_point,distance));
                if(!available_points.includes(start_point)) available_points.push(start_point);
                if(!available_points.includes(end_point)) available_points.push(end_point);
            }
        }
        return Map(available_points, routes);
    })
}