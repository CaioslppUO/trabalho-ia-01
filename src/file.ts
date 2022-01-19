import { Map, Route } from "./map";

/**
 * Realiza o processamento do arquivo de entrada para o programa, separando as variáveis de entrada e as alocando em uma estrutura.
 * @param file_content Conteúdo do arquivo de entrada.
 * @returns Objeto do tipo Map, preenchido a partir do arquivo de entrada.
 */
export const process_entry_file = (content: string): Map => {
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
}