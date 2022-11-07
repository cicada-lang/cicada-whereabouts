import * as Exps from "../exp"
import { Goal } from "../goal"
import { Mod } from "../mod"
import { Solution, unify } from "../solution"

/**

   What is a goal?

   It is something that either _succeeds_, _fails_, or _has no value_.

   In our context:

   - succeeds: find some solutions
   - fails: no solutions
   - has no value: infinite loop

**/

export class Task {
  constructor(public solution: Solution, public goals: Array<Goal>) {}

  step(mod: Mod): Array<Task> | undefined {
    const goal = this.goals.shift()
    if (goal === undefined) return undefined

    /**
       NOTE About searching (again)

       | push front |   depth first |
       | push back  | breadth first |
    **/

    return pursueGoal(mod, this.solution, goal).map(
      (task) => new Task(task.solution, this.goals.concat(task.goals)),
    )
  }
}

function pursueGoal(mod: Mod, solution: Solution, goal: Goal): Array<Task> {
  switch (goal.kind) {
    case "Apply": {
      return goal.relation.clauses.flatMap((clause) => {
        const { exp, goals } = Exps.freshenClause(mod, clause)
        const newSolution = unify(solution, exp, goal.arg)
        return newSolution ? [new Task(newSolution, goals)] : []
      })
    }

    case "Unifiable": {
      const newSolution = unify(solution, goal.left, goal.right)
      return newSolution ? [new Task(newSolution, [])] : []
    }
  }
}
