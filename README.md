# cefode — CEF + node

Custom CEF build that has node.js API integration.

## How to build and update

Build for the first time:

````bash
$ git clone https://github.com/zcbenz/cefode.git && ./cefode/script/bootstrap
````

Update to the newest commit:

````bash
$ ./script/update
````

Want a debug build? Append `Debug` after the command:

````bash
$ ./script/compile Debug
````

Run tests:

````bash
$ ./script/run_tests
````

## Features

* Node API (require, process, built-in modules, etc.) in normal web page.
* Node API in web workers (eg. multi-threaded node.js).
* Support third party JavaScript module.
* Support native node modules (instructions for building is on the way).
* Has node-sqlite3 as built-in module.

## Documents

* [User Guide](https://github.com/zcbenz/cefode/wiki/User-Guide)
