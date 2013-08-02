#!/usr/bin/env bash

DEPSWRITER=closure/closure/bin/build/depswriter.py

$DEPSWRITER --root_with_prefix=". ../../../" > deps.js