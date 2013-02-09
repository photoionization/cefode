# cefode — CEF + node

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

* Support node API (require, process, built-in modules, etc.) in normal web page.
* Support third party JavaScript module.
* Has node-sqlite3 as built-in module.

## TODO

* Native node modules.
* Node API in web workers.

