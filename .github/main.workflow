workflow "Test" {
  on = "push"
  resolves = ["test"]
}

action "test" {
  uses = "docker://node:lts"
  args = "bash setup.test.sh"
}
