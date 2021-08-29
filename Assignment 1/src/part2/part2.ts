import * as R from "ramda";

const stringToArray = R.split("");

/* Question 1 */
export const isVowel: (c: string) => boolean = (c) => {
    return c === 'a' || c === 'e' || c === 'i' || c === 'o' || c === 'u' ||
        c === 'A' || c === 'E' || c === 'I' || c === 'O' || c === 'U'
};

export const countVowels: (s: string) => number = (s) => {
    const tempArray: string[] = stringToArray(s);
    return tempArray.filter(x => isVowel(x)).length;
};


/* Question 2 */
interface Triplet {
    ans: string;
    letter: string;
    counter: number;
}

export const runLengthEncoding: (s: string) => string = (s) => {
    const last: Triplet = stringToArray(s).reduce((acc: Triplet, cur) => {
        if (acc.letter === cur) {
            acc.counter++;
            return acc;
        }
        return {
            ans: (acc.counter > 1) ? R.concat(acc.ans, R.concat(acc.letter, String(acc.counter))) :
                R.concat(acc.ans, acc.letter),
            letter: cur,
            counter: 1
        };
    }, { ans: '', letter: s[0], counter: 0 });
    return (last.counter > 1) ? R.concat(last.ans, R.concat(last.letter, String(last.counter))) :
        R.concat(last.ans, last.letter);
};

/* Question 3 */
export const isOpenPars: (c: string) => boolean = (c) => { return c === '(' || c === '{' || c === '[' };

export const isClosePars: (c: string) => boolean = (c) => { return c === ')' || c === '}' || c === ']' };

export const isSiblingPars: (open: string | undefined, close: string) => boolean = (open, close) => {
    return open != undefined && (
        (open === '(' && close === ')') ||
        (open === '{' && close === '}') ||
        (open === '[' && close === ']'));
}

export const isPaired: (s: string) => boolean = (s) => {
    return stringToArray(s).reduce((acc, cur) => {
        if (isOpenPars(cur)) return R.concat(cur, acc);
        else if (isClosePars(cur) && isSiblingPars(acc[0], cur)) return R.drop(1, acc);
        return acc;
    }).length === 0;
}