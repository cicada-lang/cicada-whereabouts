import * as Errors from "../errors/index.ts"
import type { VarCollection } from "../var-collection/index.ts"

export function varCollectionValidate(varCollection: VarCollection): void {
  varCollectionAssertNoUnused(varCollection)
  varCollectionAssertNoMisused(varCollection)
}

function varCollectionAssertNoUnused(varCollection: VarCollection): void {
  for (const [name, patternVars] of varCollection) {
    if (patternVars.length === 1) {
      const [patternVar] = patternVars
      if (!name.startsWith("_")) {
        throw new Errors.LangError(
          [
            `[varCollectionAssertNoUnused] unused (occurred only once) pattern variable must starts with "_"`,

            `  pattern variable name: ${name}`,
            "[note] This policy about unused pattern variable name is important for finding bugs caused by typo.",
          ].join("\n"),
          { span: patternVar.span },
        )
      }
    }
  }
}

function varCollectionAssertNoMisused(varCollection: VarCollection): void {
  for (const [name, patternVars] of varCollection) {
    if (patternVars.length > 1) {
      const [patternVar] = patternVars
      if (name.startsWith("_")) {
        throw new Errors.LangError(
          [
            `[varCollectionAssertNoMisused] used (occurred more than only once) pattern variable must NOT starts with "_"`,

            `  pattern variable name: ${name}`,
            "[note] This policy about unused pattern variable name is important for finding bugs caused by typo.",
          ].join("\n"),
          { span: patternVar.span },
        )
      }
    }
  }
}
