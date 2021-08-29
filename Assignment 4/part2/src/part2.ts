/* 2.1 */

export const MISSING_KEY = '___MISSING___'

type PromisedStore<K, V> = {
    get(key: K): Promise<V>,
    set(key: K, value: V): Promise<void>,
    delete(key: K): Promise<void>
}


export function makePromisedStore<K, V>(): PromisedStore<K, V> {
    const map = new Map();
    return {
        get(key: K) {
            return new Promise((resolve, reject) => {
                if (map.has(key)) resolve(map.get(key));
                else reject(MISSING_KEY);
            });
        },
        set(key: K, value: V) {
            return new Promise((resolve) => {
                map.set(key, value);
                resolve();
            });
        },
        delete(key: K) {
            return new Promise((resolve, reject) => {
                if (map.has(key)) {
                    map.delete(key);
                    resolve();
                }
                else reject(MISSING_KEY);
            });
        },
    }
}

export function getAll<K, V>(store: PromisedStore<K, V>, keys: K[]): Promise<V[]> {
    const map: Promise<V>[] = keys.map(key => store.get(key));
    return Promise.all(map);
}

/* 2.2 */

async function transformationFunc<T, R>(param: T, store: PromisedStore<T, R>, f: (param: T) => R): Promise<R> {
    try {
        return await store.get(param);
    } catch (e) {
        await store.set(param, f(param));
        return store.get(param);
    }
}

export function asycMemo<T, R>(f: (param: T) => R): (param: T) => Promise<R> {
    const store: PromisedStore<T, R> = makePromisedStore();
    return (param: T) => transformationFunc(param, store, f);
}

/* 2.3 */

export function lazyFilter<T>(genFn: () => Generator<T>, filterFn: (val: T) => boolean): () => Generator<T> {
    const gen = genFn();
    return function* filter(): Generator<T> {
        let next = gen.next();
        while (!next.done) {
            if (filterFn(next.value))
                yield next.value;
            next = gen.next();
        }
    }
}

export function lazyMap<T, R>(genFn: () => Generator<T>, mapFn: (val: T) => R): () => Generator<R> {
    const gen = genFn();
    return function* map(): Generator<R> {
        let next = gen.next();
        while (!next.done) {
            yield mapFn(next.value);
            next = gen.next();
        }
    }
}

/* 2.4 */
//you can use 'any' in this question
async function loop(val: any, fns: ((param: any) => Promise<any>)[]): Promise<any> {
    for (let fun of fns) {
        try {
            val = await fun(val);
        } catch {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            try {
                val = await fun(val);
            } catch {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                try {
                    val = await fun(val);
                } catch (error) {
                    console.error(error);
                    return;
                }
            }
        }
    }
    return val;
}

export async function asyncWaterfallWithRetry(fns: [() => Promise<any>, ...((param: any) => Promise<any>)[]]): Promise<any> {
    let firstFunc: any;
    firstFunc = fns.shift();
    return firstFunc().then(async (val: any) => await loop(val, fns)).catch(() =>
        firstFunc().then(async (val: any) => await loop(val, fns)).catch((error: any) =>
            console.error(error)));
}