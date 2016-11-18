
SRC = $(shell find src -name '*.js')

all: build-lib build-typings

build-lib: $(SRC:src/%=lib/%)

build-typings: $(SRC:src/%=lib/%.flow)

lib/%.js: src/%.js
	@echo "Building $@"
	@mkdir -p $(@D)
	@./node_modules/.bin/babel -o $@ $<

lib/%.js.flow: src/%.js
	@echo "Building $@"
	@mkdir -p $(@D)
	@cp $< $@

clean:
		rm -rf lib
