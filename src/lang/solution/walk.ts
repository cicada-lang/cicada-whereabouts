import { Exp } from "../exp"
import { lookupSolution, Solution } from "../solution"

export function walk(solution: Solution, exp: Exp): Exp {
  while (exp.kind === "PatternVar") {
    const found = lookupSolution(solution, exp.name)
    if (found === undefined) return exp
    exp = found
  }

  return exp
}
