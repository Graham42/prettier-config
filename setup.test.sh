#!/usr/bin/env bash

set -euxo pipefail;

ORIG_DIR=$(pwd)
function finish {
    cd "$ORIG_DIR"
}
trap finish EXIT

cd "$(mktemp -d)"
npm init -y
npx "$ORIG_DIR"
ls -a

echo "'prettier.config.js' should exist"
[ -e "prettier.config.js" ]

echo "'.prettierignore' should exist"
[ -e ".prettierignore" ]

echo "format script should exist"
npm run format

echo "checkFormat script should exist"
npm run checkFormat