#!/usr/bin/env bash

set -eux -o pipefail;

ORIG_DIR=$(pwd)
function finish {
    cd "$ORIG_DIR"
    echo "Results in $TEMP_DIR"
}
trap finish EXIT

TEMP_DIR="$(mktemp -d)"
cd "$TEMP_DIR"
npm init -y
npx "$ORIG_DIR"
ls -a

echo "'.prettierrc.js' should exist"
[ -e ".prettierrc.js" ] || (echo "missing .prettierrc.js" && exit 1)

echo "'.gitignore' should exist"
[ -e ".gitignore" ] || (echo "missing .gitignore" && exit 1)

echo "check:format script should exist"
npm run check:format

echo "fix:format script should exist"
npm run fix:format
