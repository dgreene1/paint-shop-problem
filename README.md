# paint-shop-problem

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

<!-- [![Version](https://img.shields.io/npm/v/paint-shop-problem.svg)](https://npmjs.org/package/paint-shop-problem)
[![Downloads/week](https://img.shields.io/npm/dw/paint-shop-problem.svg)](https://npmjs.org/package/paint-shop-problem)
[![License](https://img.shields.io/npm/l/paint-shop-problem.svg)](https://github.com/dgreene1/paint-shop-problem/blob/master/package.json) -->

## Background

This utilizes a brute force approach to solving the paint-shop problem. My focus was placed on:

- providing excellent code coverage
- readable code.

To a lesser extent I focused on the use of O(1) data structures; howewever, a focus was not placed on performance.

Please note the use of [OClif](https://oclif.io/) for the CLI aspects. While I've used `yargs` and vanilla `process.argv` in the past, I find OClif has the best type-safety and tooling for cross-OS executables written in TypeScript.

## Manually Running

1. `npm install`
2. `npx .\bin\run -p "{fullyQualifiedPathOfFile}"` ...for example, `npx .\bin\run -p "C:\dev\paint-shop-problem\testCases\noSolutionCase.txt"`

Optionally you can run `npx .\bin\run -h`

## Publishing

See OClif's [release instructions](https://oclif.io/docs/releasing).

# Usage

<!-- usage -->

```sh-session
$ npm install -g paint-shop-problem
$ take-paint-orders COMMAND
running command...
$ take-paint-orders (-v|--version|version)
paint-shop-problem/1.0.0 win32-x64 node-v14.16.0
$ take-paint-orders --help [COMMAND]
USAGE
  $ take-paint-orders COMMAND
...
```

<!-- usagestop -->

<!-- # Commands -->

<!-- commands -->

<!-- commandsstop -->
