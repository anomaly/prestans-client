#!/usr/bin/env bash

CLOSURE=/usr/local/share/closure-library-read-only
DEPSWRITER=$CLOSURE/closure/bin/build/depswriter.py

$DEPSWRITER --root_with_prefix=". ../prestans" > deps.js