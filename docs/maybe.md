# Maybe

### Constructors

### Statics

`of`

`Just`

`Nothing`

### Instance Methods

`isJust`
```
:: Maybe a ~> () -> Bool
```

`isNothing`
```
:: Maybe a ~> () -> Bool
```

`cases`
```
:: Maybe a ~> {} -> b
```

`getOrElse`
```
:: Maybe a ~> a -> a
```

Returns the value contained in the `Maybe` if it is `Just`, otherwise returns the given value

`map`
```
:: Maybe a ~> (a -> b) -> Maybe b
```

Transforms the value contained in the `Maybe`.

`ap`
```
:: Maybe (a -> b) ~> Maybe a -> Maybe b
```
Applies the function contained in the `Maybe` to the value in the given `Maybe`.

`andThen`
```
:: Maybe a ~> (a -> Maybe b) -> Maybe b
```
