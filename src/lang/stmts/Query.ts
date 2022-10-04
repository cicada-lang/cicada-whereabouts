import * as Exps from "../exp"
import { Mod } from "../mod"
import { formatSolutions } from "../solution"
import { Solver } from "../solver"
import { Span } from "../span"
import { Stmt } from "../stmt"

export class Query extends Stmt {
  constructor(public names: Array<string>, public goals: Array<Exps.Goal>, public span?: Span) {
    super()
  }

  async execute(mod: Mod): Promise<string> {
    const goals = this.goals.map((goal) => Exps.evaluateGoal(mod.env, goal))
    const solver = Solver.forGoals(goals)
    const solutions = solver.solve(mod, mod.env)
    return `[${formatSolutions(solutions, this.names)}]`
  }
}
