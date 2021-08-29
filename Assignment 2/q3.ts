import { isProgram, makeProgram, ClassExp, ProcExp, Exp, Program, isClassExp, Binding, makePrimOp, makeVarRef, IfExp, BoolExp, makeBoolExp, makeAppExp, makeLitExp, makeIfExp, makeProcExp, makeVarDecl, isDefineExp, isAppExp, isProcExp, isCompoundExp, makeDefineExp } from "./L31-ast";
import { Result, makeOk } from "../shared/result";
import { map } from "ramda";

/*
Purpose: Transform ClassExp to ProcExp
Signature: for2proc(classExp)
Type: ClassExp => ProcExp
*/
const buildRec: (bindings: Binding[], i: number) => IfExp | BoolExp = (bindings, i) => {
    if (i === bindings.length)
        return makeBoolExp(false);
    const test = makeAppExp(makePrimOp("eq?"), [makeVarRef('msg'), makeLitExp(`'${bindings[i].var.var}`)]);
    const then = /*isClassExp(bindings[i].val) ? class2proc(bindings[i].val) :*/ bindings[i].val;
    return makeIfExp(test, makeAppExp(then, []), buildRec(bindings, i + 1));
};

export const class2proc = (exp: ClassExp): ProcExp => makeProcExp(exp.fields, [makeProcExp([makeVarDecl('msg')], [buildRec(exp.methods, 0)])]);

/*
Purpose: Transform L31 AST to L3 AST
Signature: l31ToL3(l31AST)
Type: [Exp | Program] => Result<Exp | Program>
*/
const classRemover = (exp: Exp): Exp => (isClassExp(exp)) ? class2proc(exp) :
    isDefineExp(exp) ? makeDefineExp(exp.var, (isClassExp(exp.val)) ? class2proc(exp.val) : exp.val) : exp;

export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> =>
    isProgram(exp) ?
        makeOk(makeProgram(map(classRemover, exp.exps))) :
        makeOk(classRemover(exp));