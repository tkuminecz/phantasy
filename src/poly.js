// @flow
export type TEmpty = []
export type TSingle<A> = [A]
export type TPair<A, B> = [A, [B]]
export type TTrip<A, B, C> = [A, [B, [C]]]
export type TQuad<A, B, C, D> = [A, [B, [C, [D]]]]
export type TQuint<A, B, C, D, E> = [A, [B, [C, [D, [E]]]]]

type Num = TSingle<number>
type StrNum = TPair<string, number>
type StrStr = TPair<string, string>
type NumNum = TPair<number, number>
type Person = TTrip<string, number, bool>

type $HeadT<T, L: [T, *]> = T
type $TailT<T: [], L: [*, T]> = T

export type $TParam1<L> = $HeadT<*, L>
export type $TParam2<L> = $HeadT<*, $TailT<*, L>>
export type $TParam3<L> = $HeadT<*, $TailT<*, $TailT<*, L>>>
export type $TParam4<L> = $HeadT<*, $TailT<*, $TailT<*, $TailT<*, L>>>>

(42: $TParam1<Num>);
('tim': $TParam1<StrNum>);
('tim': $TParam1<StrStr>);
(42: $TParam1<NumNum>);

(42: $TParam2<StrNum>);

('tim': $TParam2<StrStr>);

(42: $TParam2<NumNum>);

('tim': $TParam1<Person>);
(29: $TParam2<Person>);
(true: $TParam3<Person>);

export class Type<K, T: []> {}

export type $ExtractTypeList<L, T: $Subtype<Type<*, L>>> = L
export type $TypeList<T> = $ExtractTypeList<*, T>

class Tup1T {}
class Tup1<A> extends Type<Tup1T, TSingle<A>> {}

class Tup2T {}
class Tup2<A, B> extends Type<Tup2T, TPair<A, B>> {
  type = Tup2
  data: [A, B]
  constructor(data: [A, B]) {
    super();
    this.data = data;
  }
  getSelf(): Tup2<A, B> {
    return this;
  }
  map<A2>(f: (a: A) => A2): Tup2<A2, B> {
	return Tup2.map(f, this);
  }
  static map<A, A2, B>(f: (a: A) => A2, fa: Tup2<A, B>): Tup2<A2, B> {
    return new Tup2([ f(fa.data[0]), fa.data[1] ]);
  }
}

class Tup3T {}
class Tup3<A, B, C> extends Type<Tup3T, TTrip<A, B, C>> {}

(42: $TParam1<$TypeList<Tup1<number>>>);

(42: $TParam1<$TypeList<Tup2<number, string>>>);
('tim': $TParam2<$TypeList<Tup2<number, string>>>);

(42: $TParam1<$TypeList<Tup3<number, string, bool>>>);
('tim': $TParam2<$TypeList<Tup3<number, string, bool>>>);
(true: $TParam3<$TypeList<Tup3<number, string, bool>>>);

type TypeInstance<K, T> = Type<K, T>

type SubTypeInstance<K, T, C: TypeInstance<K, T>> = C

type $PolyType<K, T: []> = SubTypeInstance<K, T, *>//$Subtype<Type<K, T>>

type FunctorI<T> = {
  map<A, B>(f: (a: A) => B, fa: $PolyType<T, [A, *]>): $PolyType<T, [B, *]>
}
type Functor<T> = {
  type: FunctorI<T>,
  map<B>(f: <A>(a: A) => B): $PolyType<T, [B, *]>
}

let pair: Tup2<string, number>
  = new Tup2(['tim', 29]);

(Tup2: FunctorI<Tup2T>);

(Tup2.map(a => a.length, pair): Tup2<number, number>);
(pair.map(a => a.length): Tup2<number, number>);

function map<A, B, T>(typeClass: FunctorI<*>, fn: (a: A) => B, fa: $PolyType<*, [A, *]>): $PolyType<*, [B, *]> {
  return typeClass.map(fn, fa);
}

let _a: Tup2<string, number>
    = new Tup2(['tim', 29]);

let _b: $PolyType<*, [string, *]>
    = _a;

let _c: Tup2<number, number>
    = _b;

(map(Tup2, a => a, pair): Tup2<number, number>);
(map(Tup2, a => a.length, pair): Tup2<number, number>);
