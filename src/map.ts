/**
 * Interface que representa uma rota do mapa.
 */
export interface Route {
    start_point: string;
    end_point: string;
    distance: number;
}

/**
 * Interface que representa o mapa do jogo.
 */
export interface Map {
    available_points: Array<string>;
    routes: Array<Route>;
}

/**
 * Cria e retorna um objeto do tipo Route.
 * @param start_point Local 1 da rota.
 * @param end_point Local 2 da rota.
 * @param distance Distância entre os pontos.
 * @returns Objeto do tipo Route.
 */
export const Route = (start_point: string, end_point: string, distance: number): Route => {
    return {
        start_point,
        end_point,
        distance
    }
}

/**
 * Cria e retorna um objeto do tipo Map.
 * @param available_points Array com todos os pontos existentes no mapa.
 * @param routes Array com todas as possíveis rotas do mapa.
 * @returns Objeto do tipo Map.
 */
export const Map = (available_points: Array<string>, routes: Array<Route>): Map => {
    return {
        available_points,
        routes
    }
}