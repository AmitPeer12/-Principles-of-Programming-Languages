import { add, prepend, remove } from "ramda";
import { State, bind } from "./state";

export type Stack = number[];

export const push = (x: number):State<Stack,number|undefined>=>{
    return((s:Stack)=>[prepend(x,s), undefined])
}

export const pop:State<Stack,number> = (s:Stack):[Stack, number]=>{
    return [remove(0,1,s),s[0]]
}

export const stackManip =  (s:Stack): [Stack, number | undefined] =>{
    return bind(pop,x=>bind(push(x*x),y=>bind(pop,y=>push(x+y))))(s);
}