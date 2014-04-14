#!/usr/bin/env bash

DEPSWRITER=../closure-library/closure/bin/build/depswriter.py

$DEPSWRITER --root_with_prefix=". ../../../prestans/" > deps.js