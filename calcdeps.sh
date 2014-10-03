#!/usr/bin/env bash

DEPSWRITER=../closure-library/closure/bin/build/depswriter.py

python $DEPSWRITER --root_with_prefix=". ../../../prestans/" > deps_test.js