import { map } from 'ramda';
import { AppExp, Exp, isAppExp, isBoolExp, isDefineExp, isIfExp, isNumExp, isPrimOp, isProcExp, isProgram, isStrExp, isVarRef, Program, VarDecl } from '../imp/L3-ast';
import { valueToString } from '../imp/L3-value';
import { Result, makeOk } from '../shared/result';

/*
Purpose: Transform L2 AST to Python program string
Signature: l2ToPython(l2AST)
Type: [EXP | Program] => Result<string>
*/

//["string=?", "cons", "car", "cdr", "list"]
const op2string = (op: string): string => (op === "eq?" || op === "=") ? "==" :
    (op === "pair?") ? `(lambda x : (type(x) == pair)` :
        (op === "number?") ? `(lambda x : (type(x) == number)` :
            (op === "boolean?") ? `(lambda x : (type(x) == boolean)` :
                (op === "symbol?") ? `(lambda x : (type(x) == symbol)` :
                    (op === "string?") ? `(lambda x : (type(x) == string)` :
                        op;

const appExp2python = (exp: AppExp): string => isPrimOp(exp.rator) ?
    `(${(exp.rands.length === 1) ? op2string(exp.rator.op) + ' ' + l2expToPython(exp.rands[0]) : map(l2expToPython, exp.rands).join(` ${op2string(exp.rator.op)} `)})` :
    `${l2expToPython(exp.rator)}(${map(l2expToPython, exp.rands).join(",")})`;

const l2expToPython = (exp: Exp): string =>
    isBoolExp(exp) ? valueToString(exp.val) :
        isNumExp(exp) ? valueToString(exp.val) :
            isStrExp(exp) ? valueToString(exp.val) :
                isVarRef(exp) ? exp.var :
                    isPrimOp(exp) ? op2string(exp.op) :
                        isDefineExp(exp) ? `${exp.var.var} = ${l2expToPython(exp.val)}` :
                            isIfExp(exp) ? `(${l2expToPython(exp.then)} if ${l2expToPython(exp.test)} else ${l2expToPython(exp.alt)})` :
                                isProcExp(exp) ? `(lambda ${map((p: VarDecl) => p.var, exp.args).join(",")} : ${map(l2expToPython, exp.body).join(" ")})` :
                                    isAppExp(exp) ? appExp2python(exp) :
                                        "oops";

export const l2ToPython = (exp: Exp | Program): Result<string> => isProgram(exp) ? makeOk(map(l2expToPython, exp.exps).join("\n")) : makeOk(l2expToPython(exp));