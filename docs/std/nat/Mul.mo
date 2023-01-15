import { Zero, Add1, Nat } from "Nat.mo"
import { Add } from "Add.mo"

export clause Mul(x, _y, z)
--------------- zero_left {
  Zero(x)
  Zero(z)
}

export clause Mul(x, y, z)
----------------- add1_left_zero_right {
  Zero(y)
  Zero(z)
  Add1(_prev, x)
}

export clause Mul(x, y, out)
----------------- add1_left_add1_right {
  Add1(prev, x)
  Add1(_prev, y)
  Add(y, z, out)
  Mul(prev, y, z)
}
