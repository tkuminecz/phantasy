#!/bin/bash

set -o errexit -o nounset

# if [ "$TRAVIS_BRANCH" != "master" ]
# then
#   echo "This commit was made against $TRAVIS_BRANCH and not master! No deploy!"
#   exit 0
# fi

rev=$(git rev-parse --short HEAD)

mkdir docs
cd docs/

git init
git config user.name "Tim Kuminecz"
git config user.email "tkuminecz@gmail.com"

git remote add origin "https://$GH_TOKEN@github.com/tkuminecz/phantasy.git"
git fetch origin
git checkout -b gh-pages origin/gh-pages

# build docs
cd ..
npm run docs
cd docs/

git commit -am "rebuilding pages @ ${rev}"
git push origin gh-pages
