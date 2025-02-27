import { indent } from "../../utils/indent.ts"
import { formatGoal, formatStmt } from "../format/index.ts"
import { type Value } from "../value/index.ts"

export function formatValue(value: Value): string {
  switch (value["@kind"]) {
    case "PatternVar": {
      return value.name
    }

    case "ReifiedVar": {
      return `_.${value.count}`
    }

    case "String": {
      return JSON.stringify(value.data)
    }

    case "Number": {
      return value.data.toString()
    }

    case "Boolean": {
      return value.data.toString()
    }

    case "Null": {
      return "null"
    }

    case "ListCons": {
      const { elements, last } = foldListCons(value.car, value.cdr)
      return formatElements(
        elements.map(formatValue),
        last === undefined ? undefined : formatValue(last),
      )
    }

    case "ListNull": {
      return "[]"
    }

    case "Objekt": {
      const properties = formatProperties(value)

      if (properties.size === 0) {
        return "{}"
      }

      const entries = Array.from(properties.entries()).map(
        ([name, property]) => `"${name}": ${property}`,
      )

      return `{ ${entries.join(", ")} }`
    }

    case "Term": {
      const args = value.args.map(formatValue)
      return `${value.type}::${value.kind}${formatArgs(args)}`
    }

    case "Relation": {
      return value.arity === undefined
        ? `$Relation(${value.name})`
        : `$Relation(${value.name}, ${value.arity})`
    }

    case "TypeConstraint": {
      return `$TypeConstraint(${value.name})`
    }

    case "Fn": {
      /**
         A function should be opaque (like in scheme),
         but we format it as expression any way (like in JavaScript).
      **/

      const patterns = value.patterns.map(formatValue).join(", ")
      const stmts = value.stmts.map((stmt) => formatStmt(stmt))
      return stmts.length === 0
        ? `(${patterns}) => {}`
        : `(${patterns}) => {\n${indent(stmts.join("\n"))}\n}`
    }

    case "WithConstraints": {
      if (value.constraints.length === 0) {
        return formatValue(value.value)
      }

      const constraints = value.constraints.map(formatGoal)
      return isLarge(constraints)
        ? `${formatValue(value.value)} with {\n${constraints
            .map((constraint) => indent(constraint))
            .join("\n")}\n}`
        : `${formatValue(value.value)} with { ${constraints.join(" ")} }`
    }

    case "Primitive": {
      return `$Primitive(${value.name}, ${value.arity})`
    }

    case "Curried": {
      const target = formatValue(value.target)
      const args = value.args.map((arg) => formatValue(arg))
      return `$Curried(${target}, ${value.arity}, [${args.join(", ")}])`
    }

    case "Goal": {
      return `$Goal(${formatGoal(value.goal)})`
    }

    case "Solution": {
      return `$Solution`
    }
  }
}

function formatProperties(value: Value): Map<string, string> {
  let properties = new Map()
  if (value["@kind"] === "Objekt") {
    for (const [name, property] of Object.entries(value.properties)) {
      properties.set(name, formatValue(property))
    }

    if (value.etc !== undefined) {
      properties = new Map([...properties, ...formatProperties(value.etc)])
    }
  }

  return properties
}

function formatArgs(args: Array<string>): string {
  return isLarge(args)
    ? `(\n${args.map((arg) => indent(arg) + ",").join("\n")}\n)`
    : `(${args.join(", ")})`
}

function isLarge(elements: Array<string>): boolean {
  return (
    elements.some((element) => element.includes("\n")) ||
    elements.join(", ").length >= 60
  )
}

function formatElements(elements: Array<string>, last?: string): string {
  if (last === undefined) {
    return isLarge(elements)
      ? `[ \n${elements.map((element) => indent(element)).join(",\n")}\n]`
      : `[${elements.join(", ")}]`
  } else {
    return isLarge(elements)
      ? `[ \n${elements
          .map((element) => indent(element))
          .join(",\n")}\n${indent(`| ${last}`)}\n]`
      : `[${elements.join(", ")} | ${last}]`
  }
}

function foldListCons(
  car: Value,
  cdr: Value,
): { elements: Array<Value>; last?: Value } {
  switch (cdr["@kind"]) {
    case "ListNull": {
      return { elements: [car] }
    }

    case "ListCons": {
      const { elements, last } = foldListCons(cdr.car, cdr.cdr)
      return { elements: [car, ...elements], last }
    }

    default: {
      return { elements: [car], last: cdr }
    }
  }
}
