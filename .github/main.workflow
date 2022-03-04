workflow "Test" {
  on = "push"
  resolves = ["test", "test-cli"]
}

action "test" {
  uses = "docker://node:lts"
  args = "npm run test"
}

action "test-cli" {
  uses = "docker://node:lts"
  args = "bash setup.test.sh"
}
