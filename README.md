# phantasy

[![Build Status](https://travis-ci.org/tkuminecz/phantasy.svg?branch=master)](https://travis-ci.org/tkuminecz/phantasy)
[![Coverage Status](https://coveralls.io/repos/github/tkuminecz/phantasy/badge.svg)](https://coveralls.io/github/tkuminecz/phantasy)

A collection of [Flow](http://flowtype.org/)-aware algebraic data types for JavaScript

## Installation

Run
```
$ npm install --save phantasy
```
or
```
$ yarn add phantasy
```

## Usage

Data types can be imported directly from the `phantasy` module
```
import { Maybe, Task } from 'phantasy';
```

Support for [Flow](http://flowtype.org/) is included for all types and should automatically integrate with existing projects.

## Data Types

#### [__`Identity`__](docs/identity.md)

Simple monadic container values without any special behaviors

#### [__`Maybe`__](docs/maybe.md)

Monad for safely handling nullable values

#### [__`Result`__](docs/result.md)

Monad representing either a success or an error value

#### [__`Reader`__](docs/reader.md)

Monad that represents computations that can read data from a context

#### [__`Writer`__](docs/writer.md)

Monad that represents computations that can write data to a context

#### [__`State`__](docs/state.md)

Monad that represents computations that can read and write data from a state

#### [__`IO`__](docs/io.md)

Monad representing synchronous computations which may or may not be effectful

#### [__`Task`__](docs/task.md)

Monad representing asynchronous computations that may succeed or fail and which may or may not be effectful

#### [__`Eff`__](docs/eff.md)

Monad representing dependency-injected, explicitly-effectful synchronous computations

#### [__`EffResult`__](docs/eff-result.md)

Monad representing dependency-injected, explicitly-effectful synchronous computations that may succeed or fail

#### [__`EffTask`__](docs/eff-task.md)

Monad representing dependency-injected, explicitly-effectful asynchronous computations that may succeed or fail
