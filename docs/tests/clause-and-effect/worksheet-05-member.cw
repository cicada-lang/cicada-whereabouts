Member [element, [element, ...tail]]
------------------------------------ here {}

Member [element, [head, ...tail]]
--------------------------------- there {
  Member [element, tail]
}

success {
  Member ["john", ["paul", "john"]]
}

failure {
  Member ["joe", ["marx", "darwin", "freud" ]]
}

query (element) {
  Member [element, ["marx", "darwin", "freud"]]
}

// TODO need query limit

// query (list) {
//   Member ["foo", list]
// }
