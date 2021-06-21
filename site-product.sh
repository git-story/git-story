#!/bin/sh
set -e

TYPE="$1"
TOKEN="$2"
REPOSITORY="$3"

if [ -f "type_${TYPE}" -a -d $TYPE ]; then
	cd $TYPE
	git add -A .
	git commit -m "${TYPE} site build"
	git push "https://git-story:${TOKEN}@github.com/git-story/${REPOSITORY}.git" master
	rm -rf type_${TYPE} $TYPE
fi
