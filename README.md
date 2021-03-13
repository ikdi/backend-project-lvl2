# 'Difference calculator' Hexlet project
[![Actions Status](https://github.com/kdi-course/backend-project-lvl2/workflows/hexlet-check/badge.svg)](https://github.com/kdi-course/backend-project-lvl2/actions) 
[![Node CI](https://github.com/kdi-course/backend-project-lvl2/actions/workflows/node-ci.yml/badge.svg)](https://github.com/kdi-course/backend-project-lvl2/actions/workflows/node-ci.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/5cc138f0f9a8b84f1b1e/maintainability)](https://codeclimate.com/github/kdi-course/backend-project-lvl2/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5cc138f0f9a8b84f1b1e/test_coverage)](https://codeclimate.com/github/kdi-course/backend-project-lvl2/test_coverage)
## Description 
Compares two configuration files and shows a difference\
Input formats: json and yaml\
Output formats: stylish, plain, json
## Installation and Usage
Can be used as command line utility or npm package\
You can install a package globally

```
$ npm install -g https://github.com/kdi-course/backend-project-lvl2
```
or locally
```
$ npm install https://github.com/kdi-course/backend-project-lvl2
```

After that, you can use it as CLI utility
* ``` $ gendiff -h```

or as npm module
```
// your js file
import genDiff from '@hexlet/code';

const diff = genDiff(filepath1, filepath2);
console.log(diff);
```

In development mode you should use make utility:
```
$ git clone https://github.com/kdi-course/backend-project-lvl2
$ cd backend-project-lvl2
$ make setup // install dependencies and package
$ make lint  // eslint check
$ make test  // run tests
```

## Creation progress demo
step 3\
[![step 3](https://asciinema.org/a/ThM6rK5gx8HfCKoNc7lAB3Uah.svg)](https://asciinema.org/a/ThM6rK5gx8HfCKoNc7lAB3Uah)\
step 5\
[![step 5](https://asciinema.org/a/3iqG6ec7BD0efQdIISASHK2CB.svg)](https://asciinema.org/a/3iqG6ec7BD0efQdIISASHK2CB)\
step6\
[![step 6](https://asciinema.org/a/bG0ZxivI109dhkfyZWkpfwJKk.svg)](https://asciinema.org/a/bG0ZxivI109dhkfyZWkpfwJKk)\
step7\
[![step 7](https://asciinema.org/a/Ta92uCX51EqE8ZJXbGbCeO7CD.svg)](https://asciinema.org/a/Ta92uCX51EqE8ZJXbGbCeO7CD)\
step 8\
[![step 8](https://asciinema.org/a/5ImpN0f0shfl0Trjt57lzP63w.svg)](https://asciinema.org/a/5ImpN0f0shfl0Trjt57lzP63w)
