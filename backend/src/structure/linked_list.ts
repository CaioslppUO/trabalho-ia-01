export interface LinkedList<T> {
    list: Array<T>;
    insert: (element: T) => void;
}

export const LinkedList = <T>(): LinkedList<T> => {
    let list: Array<T> = [];

    const insert = (element: T): void => {
        list.push(element)
    }

    return {
        list,
        insert
    }
}