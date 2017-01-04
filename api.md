<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

# Eff

The `Eff` monad

Represents synchronous computations which are both dependency-injected and explicitly effectful

## map

`map :: Eff e a ~> (a -> b) -> Eff e b`

Transforms the result of the `Eff` instance

**Parameters**

-   `transform` **function (a: A): B** 

Returns **[Eff](#eff)&lt;E, B>** 

## andThen

`andThen :: Eff e a ~> (a -> Eff f b) -> Eff (e & f) b`

Chains the result of the `Eff` instance to another `Eff`-producing function

**Parameters**

-   `next` **function (a: A): [Eff](#eff)&lt;F, B>** 

Returns **[Eff](#eff)&lt;any, B>** 

## toEffResult

`toEffResult :: Eff e a ~> () -> EffResult e a x`

Returns the `Eff` instance converted to an `EffResult`

Returns **[EffResult](#effresult)&lt;E, A, any>** 

## toEffTask

`toEffTask :: Eff e a ~> () -> EffTask e a x`

Returns the `Eff` instance converted to an `EffTask`

Returns **[EffTask](#efftask)&lt;E, A, any>** 

## of

`of :: a -> Eff e a`

**Parameters**

-   `a` **A** 

Returns **[Eff](#eff)&lt;any, A>** 

## Require

`Require :: () -> Eff e e`

Returns **[Eff](#eff)&lt;E, E>** 

## Requires

`Requires :: (e -> a) -> Eff e a`

**Parameters**

-   `f` **function (e: E): A** 

Returns **[Eff](#eff)&lt;E, A>** 

# EffResult

The `EffResult` monad

## map

`map :: EffResult e a x ~> (a -> b) -> EffResult e b x`

**Parameters**

-   `f` **function (a: A): B** 

Returns **[EffResult](#effresult)&lt;E, B, X>** 

## andThen

`andThen :: EffResult e a x ~> (a -> EffResult f b x) -> EffResult (e & f) b x`

**Parameters**

-   `next` **function (a: A): [EffResult](#effresult)&lt;F, B, X>** 

Returns **[EffResult](#effresult)&lt;any, B, X>** 

## toEffTask

`toEffTask :: EffResult e a x ~> () -> EffTask e a x`

Returns **[EffTask](#efftask)&lt;E, A, X>** 

## fromEff

`fromEff :: Eff e a -> EffResult e a x`

**Parameters**

-   `eff` **[Eff](#eff)&lt;E, A>** 

Returns **[EffResult](#effresult)&lt;E, A, any>** 

## fromResult

`fromResult :: Result a x -> EffResult {} a x`

**Parameters**

-   `result` **[Result](#result)&lt;A, X>** 

Returns **[EffResult](#effresult)&lt;{}, A, X>** 

## of

`of :: a -> EffResult {} a x`

**Parameters**

-   `a` **A** 

Returns **[EffResult](#effresult)&lt;any, A, any>** 

## Require

`Require :: () -> EffResult e e x`

Returns **[EffResult](#effresult)&lt;E, E, any>** 

## Requires

`Requires :: (e -> Result a x ) -> EffResult e a x`

**Parameters**

-   `f` **function (e: E): [Result](#result)&lt;A, X>** 

Returns **[EffResult](#effresult)&lt;E, A, X>** 

## Val

`Val :: a -> Result e a x`

**Parameters**

-   `a` **A** 

Returns **[EffResult](#effresult)&lt;any, A, any>** 

## Err

`Err :: x -> Result e a x`

**Parameters**

-   `x` **X** 

Returns **[EffResult](#effresult)&lt;any, any, X>** 

# EffTask

The `EffTask` monad

## map

`map :: EffTask e a x ~> (a -> b) -> EffTask e b x`

Transforms the result of the `EffTask` instance if successful,
and otherwise propagates the failure

**Parameters**

-   `f` **function (a: A): B** 

Returns **[EffTask](#efftask)&lt;E, B, X>** 

## andThen

`andThen :: EffTask e a x ~> (a -> EffTask f b x) -> EffTask e b x`

**Parameters**

-   `next` **function (a: A): [EffTask](#efftask)&lt;F, B, X>** 

Returns **[EffTask](#efftask)&lt;any, B, X>** 

## fromEff

`fromEff :: Eff e a -> EffTask e a x`

Returns the given `Eff` converted to an `EffTask`

**Parameters**

-   `eff` **[Eff](#eff)&lt;E, A>** 

Returns **[EffTask](#efftask)&lt;E, A, any>** 

## fromEffResult

`fromEffResult :: EffResult e a x -> EffTask e a x`

Returns the given `EffResult` converted to an `EffTask`

**Parameters**

-   `eff` **[EffResult](#effresult)&lt;E, A, X>** 

Returns **[EffTask](#efftask)&lt;E, A, X>** 

## fromTask

`fromTask :: Task a x -> EffTask {} a x`

Returns the given `Task` converted to an `EffTask`

**Parameters**

-   `task` **[Task](#task)&lt;A, X>** 

Returns **[EffTask](#efftask)&lt;{}, A, X>** 

## of

`of :: a -> EffTask {} a x`

**Parameters**

-   `a` **A** 

Returns **[EffTask](#efftask)&lt;any, A, any>** 

## Require

`Require :: () -> EffTask e e x`

Returns **[EffTask](#efftask)&lt;E, E, any>** 

## Requires

`Requires :: (e -> Task a x) -> EffTask e a x`

**Parameters**

-   `f` **function (e: E): [Task](#task)&lt;A, X>** 

Returns **[EffTask](#efftask)&lt;E, A, X>** 

## Success

`Success :: a -> EffTask e a x`

Returns an `EffTask` that always succeeds with the given value

**Parameters**

-   `a` **A** 

Returns **[EffTask](#efftask)&lt;any, A, any>** 

## Fail

`Fail :: x -> EffTask e a x`

Returns an `EffTask` that always fails with the given value

**Parameters**

-   `x` **X** 

Returns **[EffTask](#efftask)&lt;any, any, X>** 

# Identity

The Identity monad

## constructor

Constructs a new Maybe instance

**Parameters**

-   `data` **A** 

Returns **void** 

## map

map :: Identity a ~> (a -> b) -> Identity b

**Parameters**

-   `f` **function (a: A): B** 

Returns **[Identity](#identity)&lt;B>** 

## andThen

andThen :: Identity a ~> (a -> Identity b) -> Identity b

**Parameters**

-   `next` **function (a: A): [Identity](#identity)&lt;B>** 

Returns **[Identity](#identity)&lt;B>** 

## toString

toString :: Identity a ~> () -> String

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## of

of :: a -> Identity a

**Parameters**

-   `a` **A** 

Returns **[Identity](#identity)&lt;A>** 

## lift

lift :: (a -> b) -> Identity a -> Identity b

**Parameters**

-   `f` **function (a: A): B** 

Returns **any** 

## lift2

lift2 :: (a -> b -> c) -> Identity a -> Identity b -> Identity c

**Parameters**

-   `f` **function (a: A, b: B): C** 

Returns **any** 

## lift3

lift3 :: (a -> b -> c -> d) -> Identity a -> Identity b -> Identity c -> Identity d

**Parameters**

-   `f` **function (a: A, b: B, c: C): D** 

Returns **any** 

# IO

The `IO` monad

Represents a potentially-effectful synchronous computation

## map

`map :: IO a ~> (a -> b) -> IO b`

Transforms the result of the `IO` instance

**Parameters**

-   `transform` **function (a: A): B** 

Returns **[IO](#io)&lt;B>** 

## andThen

`andThen :: IO a ~> (a -> IO b) -> IO b`

Chains the result of the `IO` instance with another `IO`-producing function

**Parameters**

-   `next` **function (a: A): [IO](#io)&lt;B>** 

Returns **[IO](#io)&lt;B>** 

## of

`of :: a -> IO a`

Returns an `IO` instance that always produces the given value

**Parameters**

-   `value` **A** 

Returns **[IO](#io)&lt;A>** 

## lift

`lift :: (a -> b) -> IO a -> IO b`

Takes an unary function an returns an equivalent unary function which operates on `IO` values

**Parameters**

-   `f` **function (t: A): B** 

Returns **function (t: [IO](#io)&lt;A>): [IO](#io)&lt;B>** 

## lift2

`lift2 :: (a -> b -> c) -> IO a -> IO b -> IO c`

Takes an binary function an returns an equivalent binary function which operates on `IO` values

**Parameters**

-   `f` **function (a: A, b: B): C** 

Returns **function (a: [IO](#io)&lt;A>, b: [IO](#io)&lt;B>): [IO](#io)&lt;C>** 

## lift3

`lift3 :: (a -> b -> c -> d) -> IO a -> IO b -> IO c -> IO d`

Takes an ternary function an returns an equivalent ternary function which operates on `IO` values

**Parameters**

-   `f` **function (a: A, b: B, c: C): D** 

Returns **function (a: [IO](#io)&lt;A>, b: [IO](#io)&lt;B>, c: [IO](#io)&lt;C>): [IO](#io)&lt;D>** 

# Maybe

The `Maybe` monad

Represents the possibility of a value or nothing. Commonly used
to safely deal with nullable values because it is composable and
forces the developer to explicitly handle the null case.

## cases

`cases :: { Just: a -> b, Nothing: () -> b } -> b`

Performs a match against the possible `Maybe` cases
and returns a value by executing the appropriate function

**Parameters**

-   `patterns` **{Just: function (a: A): B, Nothing: function (): B}** 

Returns **B** 

## isJust

`isJust :: Maybe a ~> () -> Bool`

Returns `true` if the instance contains a value

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## isNothing

`isNothing :: Maybe a ~> () -> Bool`

Returns `true` if the instance is absent of value

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## getOrElse

`getOrElse :: Maybe a ~> a -> a`

Returns the contained value if `Just`,
otherwise returns the given default value.

**Parameters**

-   `defaultVal` **A** 

Returns **A** 

## map

`map :: Maybe a ~> (a -> b) -> Maybe b`

If `Just`, returns `Just` the value transformed by
the given function, otherwise returns `Nothing`

**Parameters**

-   `transform` **function (a: A): B** 

Returns **[Maybe](#maybe)&lt;B>** 

## andThen

`andThen :: Maybe a ~> (a -> Maybe b) -> Maybe b`

If `Just`, returns the `Maybe` instance resulting from passing the
contained value into the given function, otherwise returns `Nothing`

**Parameters**

-   `next` **function (a: A): [Maybe](#maybe)&lt;B>** 

Returns **[Maybe](#maybe)&lt;B>** 

## toString

`toString :: Maybe a ~> () -> string`

Returns the string representation of the `Maybe` instance

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## of

`of :: a -> Maybe a`

Takes a nullable value and constructs a new `Maybe` instance containing it

**Parameters**

-   `a` **A?** 

Returns **[Maybe](#maybe)&lt;A>** 

## Just

`Just :: a -> Maybe a`

Data constructor for indicating the presence of a value

**Parameters**

-   `a` **A** 

Returns **[Maybe](#maybe)&lt;A>** 

## Nothing

`Nothing :: Maybe a`

Data constructor for indicating the absence of a value

## fromThrowable

`fromThrowable :: (() -> a) -> Maybe a`

Takes a function which may throw an exception, and
returns either `Maybe.Just` the value returned,
or `Maybe.Nothing` if an exception is thrown.

**Parameters**

-   `throwFn` **function (): A** 

Returns **[Maybe](#maybe)&lt;A>** 

## lift

`lift :: (a -> b) -> Maybe a -> Maybe b`

Takes an unary function and returns an equivalent unary function which operates on `Maybe` values

**Parameters**

-   `f` **function (a: A): B** 

Returns **any** 

## lift2

`lift2 :: (a -> b -> c) -> Maybe a -> Maybe b -> Maybe c`

Takes an binary function and returns an equivalent binary function which operates on `Maybe` values

**Parameters**

-   `f` **function (a: A, b: B): C** 

Returns **any** 

## lift3

`lift3 :: (a -> b -> c -> d) -> Maybe a -> Maybe b -> Maybe c -> Maybe d`

Takes an ternary function and returns an equivalent ternary function which operates on `Maybe` values

**Parameters**

-   `f` **function (a: A, b: B, c: C): D** 

Returns **any** 

# Pair

Pair functor

## map

map :: Pair a b ~> ([a, b] -> [x, y]) -> Pair x y

**Parameters**

-   `f` **function (p: \[A, B]): \[X, Y]** 

Returns **[Pair](#pair)&lt;X, Y>** 

## from

from :: a -> b -> Pair a b

**Parameters**

-   `a` **A** 
-   `b` **B** 

Returns **[Pair](#pair)&lt;A, B>** 

## of

of :: [a, b] -> Pair a b

**Parameters**

-   `data` **\[A, B]** 

Returns **[Pair](#pair)&lt;A, B>** 

# Reader

The Reader monad

## constructor

Constructs a new Reader instance

**Parameters**

-   `runReader` **function (e: E): A** 

## map

map :: Reader e a ~> (a -> b) -> Reader e b

**Parameters**

-   `f` **function (a: A): B** 

Returns **[Reader](#reader)&lt;E, B>** 

## andThen

andThen :: Reader e a ~> (a -> Reader e b) -> Reader e b

**Parameters**

-   `next` **function (a: A): [Reader](#reader)&lt;E, B>** 

Returns **[Reader](#reader)&lt;E, B>** 

## of

of :: a -> Reader e a

**Parameters**

-   `val` **B** 

Returns **[Reader](#reader)&lt;any, B>** 

## merge2

merge2 :: Reader e a -> Reader f b -> Reader (e & f) [a, b]

**Parameters**

-   `r1` **[Reader](#reader)&lt;E, A>** 
-   `r2` **[Reader](#reader)&lt;F, B>** 

Returns **[Reader](#reader)&lt;any, \[A, B]>** 

## merge3

merge3 :: Reader e a -> Reader f b -> Reader g c -> Reader (e & f & g) [a, b, c]

**Parameters**

-   `r1` **[Reader](#reader)&lt;E, A>** 
-   `r2` **[Reader](#reader)&lt;F, B>** 
-   `r3` **[Reader](#reader)&lt;G, C>** 

Returns **[Reader](#reader)&lt;any, \[A, B, C]>** 

## all

all :: [Reader e a] -> Reader e [a]

**Parameters**

-   `readers` **...[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Reader](#reader)&lt;F, A>>** 

Returns **[Reader](#reader)&lt;F, [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;A>>** 

## Ask

Ask :: () -> Reader e e

Returns **[Reader](#reader)&lt;F, F>** 

## Asks

Asks :: (e -> a) -> Reader e a

**Parameters**

-   `f` **function (f: F): B** 

Returns **[Reader](#reader)&lt;F, B>** 

## lift

lift :: (a -> b) -> Reader e a -> Reader e b

**Parameters**

-   `f` **function (a: B): C** 

Returns **function (ra: [Reader](#reader)&lt;E, B>): [Reader](#reader)&lt;E, C>** 

## lift2

lift2 :: (a -> b -> c) -> Reader e a -> Reader e b -> Reader e c

**Parameters**

-   `f` **function (a: A, b: B): C** 

## lift3

lift3 :: (a -> b -> c -> d) -> Reader e a -> Reader e b -> Reader e c -> Reader e d

**Parameters**

-   `f` **function (a: A, b: B, c: C): D** 

Returns **any** 

# Result

The Result monad

## map

map :: Result a x ~> (a -> b) -> Result b x

**Parameters**

-   `f` **function (a: A): B** 

Returns **[Result](#result)&lt;B, X>** 

## andThen

andThen :: Result a x ~> (a -> Result b x) -> Result b x

**Parameters**

-   `next` **function (a: A): [Result](#result)&lt;B, X>** 

Returns **[Result](#result)&lt;B, X>** 

## handleError

handleError :: Result a x ~> (x -> Result a y) -> Result a y

**Parameters**

-   `handle` **function (x: X): [Result](#result)&lt;A, Y>** 

Returns **[Result](#result)&lt;A, Y>** 

## toMaybe

toMaybe :: Result a x ~> Maybe a

Returns **[Maybe](#maybe)&lt;A>** 

## of

of :: a -> Result a x

**Parameters**

-   `v` **B** 

Returns **[Result](#result)&lt;B, any>** 

## Val

Val :: a -> Result a x

**Parameters**

-   `v` **B** 

Returns **[Result](#result)&lt;B, any>** 

## Err

Err :: x -> Result a x

**Parameters**

-   `e` **Y** 

Returns **[Result](#result)&lt;any, Y>** 

## fromThrowable

fromThrowable :: (() -> a) -> Result a Error

**Parameters**

-   `throwFn` **function (): B** 

Returns **[Result](#result)&lt;B, [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

# State

The State monad

## getState

getState :: State s a ~> s -> s

**Parameters**

-   `initState` **S** 

Returns **S** 

## getValue

getValue :: State s a -> s -> a

**Parameters**

-   `initState` **S** 

Returns **A** 

## map

map :: State s a -> (a -> b) -> State s b

**Parameters**

-   `f` **function (a: A): B** 

Returns **[State](#state)&lt;S, B>** 

## andThen

andThen :: State s a ~> (a -> State s b) -> State s b

**Parameters**

-   `next` **function (a: A): [State](#state)&lt;S, B>** 

Returns **[State](#state)&lt;S, B>** 

## join

join :: State s (State s a) -> State s a

**Parameters**

-   `state` **[State](#state)&lt;T, [State](#state)&lt;T, B>>** 

Returns **[State](#state)&lt;T, B>** 

## of

of :: a -> State a a

**Parameters**

-   `val` **T** 

Returns **[State](#state)&lt;T, T>** 

## Get

Get :: () -> State a a

Returns **[State](#state)&lt;T, T>** 

## Put

Put :: s -> State s a

**Parameters**

-   `s` **T** 

Returns **[State](#state)&lt;T, any>** 

## Modify

Modify :: (s -> s) -> State s a

**Parameters**

-   `f` **function (s: T): T** 

Returns **[State](#state)&lt;T, any>** 

# Task

The Task monad

## constructor

Constructs a new Task instance

**Parameters**

-   `runTask` **TaskExecutor&lt;A, X>** 

## map

map :: Task a x ~> (a -> b) -> Task b x

Transforms the result of this task if successful

**Parameters**

-   `f` **function (a: A): B** 

Returns **[Task](#task)&lt;B, X>** 

## andThen

andThen :: Task a x ~> (a -> Task b x) -> Task b x

Passes the result of this task into another task-producing
function if successful

**Parameters**

-   `next` **function (a: A): [Task](#task)&lt;B, X>** 

Returns **[Task](#task)&lt;B, X>** 

## handleError

handleError :: Task a x ~> (x -> Task a x) -> Task a x

Handles a failed task result

**Parameters**

-   `handle` **function (x: X): [Task](#task)&lt;A, any>** 

Returns **[Task](#task)&lt;A, any>** 

## toMaybe

toMaybe :: Task a x ~> Task (Maybe a) x

Returns **[Task](#task)&lt;[Maybe](#maybe)&lt;A>, any>** 

## of

of :: a -> Task a x

**Parameters**

-   `a` **B** 

Returns **[Task](#task)&lt;B, any>** 

## Success

Success :: a -> Task a x

Returns a Task that always succeeds with the given value

**Parameters**

-   `a` **B** 

Returns **[Task](#task)&lt;B, any>** 

## Fail

Fail :: x -> Task a x

Returns a Task that always fails with the given value

**Parameters**

-   `x` **Y** 

Returns **[Task](#task)&lt;any, Y>** 

## fromResult

fromResult :: Result a x -> Task a x

**Parameters**

-   `res` **[Result](#result)&lt;B, Y>** 

Returns **[Task](#task)&lt;B, Y>** 

## fromIO

fromIO :: IO a -> Task a x

**Parameters**

-   `io` **[IO](#io)&lt;B>** 

Returns **[Task](#task)&lt;B, any>** 

## fromPromise

fromPromise :: Promise a -> Task a Error

Converts a promise to a task

**Parameters**

-   `promise` **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;A>** 

Returns **[Task](#task)&lt;A, [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)?>** 

## fromPromiseFunc

fromPromiseFunc :: (() -> Promise a) -> Task a Error

**Parameters**

-   `promiseFn` **function (): [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;A>** 

Returns **[Task](#task)&lt;A, [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)?>** 

## fromCallback

fromCallback :: (x -> a -> ()) -> Task a x

**Parameters**

-   `fn` **function (cb: function (e: Y, v: B): void): void** 

Returns **[Task](#task)&lt;B, Y>** 

## fromThrowable

fromThrowable :: (() -> a) -> Task a Error

**Parameters**

-   `fn` **function (): A** 

Returns **[Task](#task)&lt;A, [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## lift

lift :: (a -> b) -> Task a x -> Task b x

**Parameters**

-   `f` **function (t: T): U** 

Returns **function (tt: [Task](#task)&lt;T, X>): [Task](#task)&lt;U, X>** 

## lift2

lift2 :: (a -> b -> c) -> Task a x -> Task b x -> Task c x

**Parameters**

-   `f` **function (t: T, u: U): V** 

Returns **any** 

## lift3

lift3 :: (a -> b -> c -> d) -> Task a x -> Task b x -> Task c x -> Task d x

**Parameters**

-   `f` **function (a: A, b: B, c: C): D** 

Returns **any** 

# Writer

The Writer monad

## runWriter

runWriter :: Writer e a -> () -> \[e\[], a]

Returns **\[[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;E>, A]** 

## getEnv

getEnv :: Writer e a ~> e\[]

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;E>** 

## getValue

getValue :: Writer e a -> a

Returns **A** 

## map

map :: Writer e a ~> (a -> b) -> Writer e b

**Parameters**

-   `f` **function (a: A): B** 

Returns **[Writer](#writer)&lt;E, B>** 

## andThen

andThen :: Write e a ~> (a -> Writer e b) -> Writer e b

**Parameters**

-   `next` **function (a: A): [Writer](#writer)&lt;E, B>** 

Returns **[Writer](#writer)&lt;E, B>** 

## of

of :: a -> Writer a a

**Parameters**

-   `val` **B** 

Returns **[Writer](#writer)&lt;any, B>** 

## Tell

Tell ::

**Parameters**

-   `msg` **F** 

Returns **[Writer](#writer)&lt;F, any>** 