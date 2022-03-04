workflow "Test" {
  on = "push"
  resolves = ["test"]
}

action "test" {
  uses = "docker://node:lts"
  args = "npm run test"
}
