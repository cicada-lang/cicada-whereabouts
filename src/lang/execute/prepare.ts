import type { Mod } from "../mod"
import type { Stmt } from "../stmt-tobe"

export async function prepare(mod: Mod, stmt: Stmt): Promise<void> {
  switch (stmt["@kind"]) {
    case "Clause": {
      return
    }

    case "Let": {
      return
    }

    case "Fn": {
      return
    }

    case "Rule": {
      return
    }

    case "Hyperrule": {
      return
    }

    case "Import": {
      return
    }

    case "ImportAll": {
      return
    }

    case "Export": {
      return
    }

    case "ExportNames": {
      return
    }

    case "Compute": {
      return
    }

    case "Print": {
      return
    }

    case "Assert": {
      return
    }

    case "Return": {
      return
    }

    case "If": {
      return
    }
  }
}
