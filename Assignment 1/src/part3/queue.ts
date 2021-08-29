import { append, remove } from "ramda";
import { State, bind } from "./state";

export type Queue = number[];

export const enqueue = (x: number): State <Queue,number | undefined> => {
    return ((q:Queue) => [append(x,q),undefined]);
}

export const dequeue:State<Queue,number> = (q:Queue): [Queue, number] => {
    return [remove(0, 1, q), q[0]];
}

export const queueManip = (q:Queue): [Queue, number | undefined] => {
    return dequeue(bind(dequeue, x => bind(enqueue(x * 2), y => enqueue(x / 3)))(q)[0]);   
}