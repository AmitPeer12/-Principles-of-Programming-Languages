import { pipe } from "ramda";

export type State<S, A> = (initialState: S) => [S, A];

export const bind = <S, A, B>(state: State<S, A>, f: (x: A) => State<S, B>): State<S, B> => {
    return pipe(state, ([s,a]) => f(a)(s));
}