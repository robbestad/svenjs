#!/usr/local/bin/bash
git commit -am"Autopush"
git push origin --all
git push --mirror git@github.com:svenanders/svenjs.git
