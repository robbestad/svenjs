#!/usr/local/bin/bash
git commit -am"Autopush"
git push origin --all
BRANCH='git symbolic-ref HEAD 2>/dev/null | cut -d"/" -f 3'
git push github ${BRANCH}

#git push --mirror git@github.com:svenanders/svenjs.git
