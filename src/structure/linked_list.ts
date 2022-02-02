import { LinkedList } from "../types/graphTypes";

export const CreateLinkedList = <T>(): LinkedList<T> => {
    let list: Array<T> = [];

    const insert = (element: T): void => {
        list.push(element)
    }

    return {
        list,
        insert
    }
}