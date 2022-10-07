import { Loader } from "../../loader"
import { Env, EnvCons, EnvNull, lookupValueInEnv } from "../env"
import * as Exps from "../exp"
import { Goal } from "../goal"
import { Solution } from "../solution"
import { Solver } from "../solver"
import { Stmt, StmtOutput } from "../stmt"
import * as Values from "../value"
import { Value } from "../value"

export interface ModOptions {
  loader: Loader
  url: URL
}

export class Mod {
  variableCount = 0

  env: Env = EnvNull()
  outputs: Map<number, StmtOutput> = new Map()
  stmts: Array<Stmt> = []

  constructor(public options: ModOptions) {}

  resolve(href: string): URL {
    return new URL(href, this.options.url)
  }

  async executeStmts(stmts: Array<Stmt>): Promise<Array<StmtOutput>> {
    const outputs = []
    const offset = this.stmts.length
    for (const [index, stmt] of stmts.entries()) {
      const output = await stmt.execute(this)
      this.stmts.push(stmt)
      if (output) {
        this.outputs.set(offset + index, output)
        outputs.push(output)
      }
    }

    return outputs
  }

  defineClause(
    name: string,
    clauseName: string | undefined,
    value: Value,
    goals?: Array<Goal>,
  ): void {
    const relation = this.findOrCreateRelation(name)
    relation.clauses.push(
      Values.Clause(clauseName || relation.clauses.length.toString(), value, goals || []),
    )
  }

  private findOrCreateRelation(name: string): Values.Relation {
    let relation = lookupValueInEnv(this.env, name)
    if (relation !== undefined) {
      Values.assertRelation(relation)
      return relation
    }

    relation = Values.Relation([])
    this.env = EnvCons(name, relation, this.env)
    return relation
  }

  solve(goals: Array<Exps.Goal>): Array<Solution> {
    const solver = Solver.forGoals(goals.map((goal) => Exps.evaluateGoal(this.env, goal)))
    const solutions = solver.solve(this, this.env)
    return solutions
  }
}
