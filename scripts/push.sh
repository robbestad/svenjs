#!/usr/local/bin/bash
git commit -am"Autopush"
git push origin --all
branch_name=$(git symbolic-ref -q HEAD)
branch_name=${branch_name##refs/heads/}
git push github $branch_name
#git push --mirror git@github.com:svenanders/svenjs.git
