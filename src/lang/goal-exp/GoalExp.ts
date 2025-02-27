import type { Exp } from "../exp/index.ts"
import type { Span } from "../span/index.ts"

export type GoalExp = Apply | Equal | NotEqual | Conj | Disj

export type Apply = {
  "@type": "GoalExp"
  "@kind": "Apply"
  target: Exp
  args: Array<Exp>
  span: Span
}

export function Apply(target: Exp, args: Array<Exp>, span: Span): Apply {
  return {
    "@type": "GoalExp",
    "@kind": "Apply",
    target,
    args,
    span,
  }
}

export type Equal = {
  "@type": "Goal"
  "@kind": "Equal"
  left: Exp
  right: Exp
  span: Span
}

export function Equal(left: Exp, right: Exp, span: Span): Equal {
  return {
    "@type": "Goal",
    "@kind": "Equal",
    left,
    right,
    span,
  }
}

export type NotEqual = {
  "@type": "Goal"
  "@kind": "NotEqual"
  left: Exp
  right: Exp
  span: Span
}

export function NotEqual(left: Exp, right: Exp, span: Span): NotEqual {
  return {
    "@type": "Goal",
    "@kind": "NotEqual",
    left,
    right,
    span,
  }
}

export type Conj = {
  "@type": "GoalExp"
  "@kind": "Conj"
  goals: Array<GoalExp>
  span: Span
}

export function Conj(goals: Array<GoalExp>, span: Span): Conj {
  return {
    "@type": "GoalExp",
    "@kind": "Conj",
    goals,
    span,
  }
}

export type Disj = {
  "@type": "GoalExp"
  "@kind": "Disj"
  goals: Array<GoalExp>
  span: Span
}

export function Disj(goals: Array<GoalExp>, span: Span): Disj {
  return {
    "@type": "GoalExp",
    "@kind": "Disj",
    goals,
    span,
  }
}
