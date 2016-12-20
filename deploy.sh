#!/bin/bash

set -o errexit -o nounset

if [ "$TRAVIS_BRANCH" != "master" ]
then
  echo "This commit was made against $TRAVIS_BRANCH and not master! No deploy!"
  exit 0
fi

rev=$(git rev-parse --short HEAD)

# build docs
npm run docs

cd docs

git init
git config user.name "Tim Kuminecz"
git config user.email "tkuminecz@gmail.com"

git remote add upstream "https://$GH_TOKEN@github.com/tkuminecz/phantasy.git"
git fetch upstream
git reset upstream/gh-pages

touch .

git add -A .
git commit -m "rebuild pages at ${rev}"
git push -q upstream HEAD:gh-pages
