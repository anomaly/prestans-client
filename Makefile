CHROME=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
CLOSURE_LIBRARY=../closure-library
DEPSWRITER=${CLOSURE_LIBRARY}/closure/bin/build/depswriter.py

CURRENT_PATH=$(shell pwd)
CURRENT_DIR= $(shell basename ${CURRENT_PATH})

test:
	echo "Running unit tests"
	$(CHROME) --allow-file-access-from-files -incognito alltests.html

.PHONY: deps
deps:
	python ${DEPSWRITER} --root_with_prefix=". ../../../${CURRENT_DIR}" > deps.js