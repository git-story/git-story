#!/bin/sh
set -e

TYPE="$1"

if [ -f "type_${TYPE}" -a -d $TYPE ]; then
	git add $TYPE
	git commit -m "${TYPE} site build"
	git subtree push --prefix $TYPE ${TYPE}-site master
	rm -rf type_${TYPE} $TYPE
fi
