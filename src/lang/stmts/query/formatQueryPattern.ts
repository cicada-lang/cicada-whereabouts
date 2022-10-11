import { QueryPattern } from "../query"

export function formatQueryPattern(pattern: QueryPattern): string {
  switch (pattern.kind) {
    case "QueryPatternNames": {
      return `(${pattern.names.join(", ")})`
    }

    case "QueryPatternName": {
      return pattern.name
    }
  }
}
