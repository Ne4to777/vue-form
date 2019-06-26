//  ============================================================
//  ================        ==  ====  ==       ===        ======
//  ===================  =====   ==   ==  ====  ==  ============
//  ===================  ======  ==  ===  ====  ==  ============
//  ===================  ======  ==  ===  ====  ==  ============
//  ===================  =======    ====       ===      ========
//  ===================  ========  =====  ========  ============
//  ===================  ========  =====  ========  ============
//  ===================  ========  =====  ========  ============
//  ===================  ========  =====  ========        ======
//  ============================================================

export const typeOf = (variable) => Object.prototype.toString.call(variable).slice(8, -1).toLowerCase()

//  =================================================================
//  =============     ===  ====  ==       ===       ===  ====  ======
//  ============  ===  ==  ====  ==  ====  ==  ====  ==   ==   ======
//  ===========  ========  ====  ==  ====  ==  ====  ===  ==  =======
//  ===========  ========  ====  ==  ===   ==  ===   ===  ==  =======
//  ===========  ========  ====  ==      ====      ======    ========
//  ===========  ========  ====  ==  ====  ==  ====  =====  =========
//  ===========  ========  ====  ==  ====  ==  ====  =====  =========
//  ============  ===  ==   ==   ==  ====  ==  ====  =====  =========
//  =============     ====      ===  ====  ==  ====  =====  =========
//  =================================================================

/**
 * curry :: ((a,b) → c) → (a → b → c)
 *
 * 2-args currying
 *
 * @param {*} b
 * @param {*} c
 * @returns {Function}
 */
export const curry = (f) => (x, y) => f(x)(y)

//  ===================================================================================================================
//  =============     =====    ====  =====  ==      ====    ==  =======  =====  =====        ====    ====       =======
//  ============  ===  ===  ==  ===   ===   ==  ===  ====  ===   ======  ====    =======  ======  ==  ===  ====  ======
//  ===========  ========  ====  ==  =   =  ==  ====  ===  ===    =====  ===  ==  ======  =====  ====  ==  ====  ======
//  ===========  ========  ====  ==  == ==  ==  ===  ====  ===  ==  ===  ==  ====  =====  =====  ====  ==  ===   ======
//  ===========  ========  ====  ==  =====  ==      =====  ===  ===  ==  ==  ====  =====  =====  ====  ==      ========
//  ===========  ========  ====  ==  =====  ==  ===  ====  ===  ====  =  ==        =====  =====  ====  ==  ====  ======
//  ===========  ========  ====  ==  =====  ==  ====  ===  ===  =====    ==  ====  =====  =====  ====  ==  ====  ======
//  ============  ===  ===  ==  ===  =====  ==  ===  ====  ===  ======   ==  ====  =====  ======  ==  ===  ====  ======
//  =============     =====    ====  =====  ==      ====    ==  =======  ==  ====  =====  =======    ====  ====  ======
//  ===================================================================================================================

/**
 * I_Combinator :: a → a
 *
 * identity
 *
 * @param {*} a
 * @returns {*} a
 */
export const I_Combinator = (_) => _
export const identity = I_Combinator

/**
 * K_Combinator :: a → b → a
 *
 * constant
 *
 * @param {*} a
 * @returns {*} a
 */
export const K_Combinator = (x) => (_) => x
export const constant = K_Combinator

/**
 * A_Combinator :: (a → b) → a → b
 *
 * apply
 * @param {Function} f
 * @returns {Function} f
 */
export const A_Combinator = (f) => (x) => f(x)

/**
 * U_Combinator :: (a → b) → b
 *
 * fix-point
 * @param {Function} f
 * @returns {Function} f
 */
export const U_Combinator = (f) => f(f)

/**
 * Y_Combinator :: (a → b) → b
 *
 * fix-point
 * @param {Function} f
 * @returns {Function} f
 */
export const Y_Combinator = (f) => U_Combinator((g) => f((x) => g(g)(x)))
export const fix = Y_Combinator

/**
 * C_Combinator :: (a → b → c) → b → a → c
 *
 * flip
 * @param {Function} f
 * @returns {Function} f
 */

export const C_Combinator = (f) => (x) => (y) => f(y)(x)
export const flip = C_Combinator

/**
 * S_Combinator :: (a → b → c) → (a → b) → a → c
 *
 * substitution
 * @param {Function} f
 * @returns {Function} f
 */
export const S_Combinator = (f) => (g) => (x) => f(x)(g(x))
export const substitution = S_Combinator

/**
 * S_CombinatorI :: (a → b) → (a → b → c) → a → c
 *
 * inverted S_Combinator
 * @param {Function} f
 * @returns {Function} f
 */
export const S_CombinatorI = (f) => (g) => (x) => g(x)(f(x))
export const substitutionI = S_CombinatorI

/**
 * S_CombinatorAsync :: (a → b) → (a → b → c) → a → c
 *
 * async S_Combinator
 * @param {Function} f
 * @returns {Function} f
 */
export const S_CombinatorAsync = (f) => (g) => async (x) => f(x)(await g(x))
export const substitutionAsync = S_CombinatorAsync

/**
 * S_CombinatorIAsync :: (a → b) → (a → b → c) → a → c
 *
 * async S_CombinatorI
 * @param {Function} f
 * @returns {Function} f
 */
export const S_CombinatorIAsync = (f) => (g) => async (x) => g(x)(await f(x))
export const substitutionIAsync = S_CombinatorIAsync

export const overstep = (f) => (x) => (f(x), x)
export const functionSum = (f) => (x) => (y) => x + f(y)

//  =======================================================================================================
//  =============     =====    ====  =======  ==       ===    ==        ==    ====    ====  =======  ======
//  ============  ===  ===  ==  ===   ======  ==  ====  ===  ======  ======  ====  ==  ===   ======  ======
//  ===========  ========  ====  ==    =====  ==  ====  ===  ======  ======  ===  ====  ==    =====  ======
//  ===========  ========  ====  ==  ==  ===  ==  ====  ===  ======  ======  ===  ====  ==  ==  ===  ======
//  ===========  ========  ====  ==  ===  ==  ==  ====  ===  ======  ======  ===  ====  ==  ===  ==  ======
//  ===========  ========  ====  ==  ====  =  ==  ====  ===  ======  ======  ===  ====  ==  ====  =  ======
//  ===========  ========  ====  ==  =====    ==  ====  ===  ======  ======  ===  ====  ==  =====    ======
//  ============  ===  ===  ==  ===  ======   ==  ====  ===  ======  ======  ====  ==  ===  ======   ======
//  =============     =====    ====  =======  ==       ===    =====  =====    ====    ====  =======  ======
//  =======================================================================================================

export const ifThen = (predicate) => ([onTrue, onFalse]) => (x) =>
  predicate(x) ? onTrue(x) : onFalse ? onFalse(x) : x
export const switchCase = (condition) => (cases) => (x) => {
  const caseF = cases[condition(x)]
  return caseF ? caseF(x) : cases.default ? cases.default(x) : void 0
}

export const switchType = switchCase(typeOf)

//  ===============================================================================
//  ===========  =======  ==  ====  ==  =====  ==      ====        ==       =======
//  ===========   ======  ==  ====  ==   ===   ==  ===  ===  ========  ====  ======
//  ===========    =====  ==  ====  ==  =   =  ==  ====  ==  ========  ====  ======
//  ===========  ==  ===  ==  ====  ==  == ==  ==  ===  ===  ========  ===   ======
//  ===========  ===  ==  ==  ====  ==  =====  ==      ====      ====      ========
//  ===========  ====  =  ==  ====  ==  =====  ==  ===  ===  ========  ====  ======
//  ===========  =====    ==  ====  ==  =====  ==  ====  ==  ========  ====  ======
//  ===========  ======   ==   ==   ==  =====  ==  ===  ===  ========  ====  ======
//  ===========  =======  ===      ===  =====  ==      ====        ==  ====  ======
//  ===============================================================================

export const sum = (x) => (y) => x + y
export const gt = (x) => (y) => x < y

//  ==========================================================================
//  ============      ===        ==       ===    ==  =======  ===      =======
//  ===========  ====  =====  =====  ====  ===  ===   ======  ==   ==   ======
//  ===========  ====  =====  =====  ====  ===  ===    =====  ==  ====  ======
//  ============  ==========  =====  ===   ===  ===  ==  ===  ==  ============
//  ==============  ========  =====      =====  ===  ===  ==  ==  ============
//  ================  ======  =====  ====  ===  ===  ====  =  ==  ===   ======
//  ===========  ====  =====  =====  ====  ===  ===  =====    ==  ====  ======
//  ===========  ====  =====  =====  ====  ===  ===  ======   ==   ==   ======
//  ============      ======  =====  ====  ==    ==  =======  ===      =======
//  ==========================================================================

export const stringTest = (re) => (str) => re.test(str)
export const stringReplace = (re) => (to) => (str) => str.replace(re, to)
export const stringMatch = (re) => (str) => str.match(re) || []
export const stringCut = (re) => stringReplace(re)('')
export const stringSplit = (re) => (str) => str.split(re)
export const stringTrim = (str) => str.trim()

//  =================================================================
//  ==============  =====       ===       ======  =====  ====  ======
//  =============    ====  ====  ==  ====  ====    ====   ==   ======
//  ============  ==  ===  ====  ==  ====  ===  ==  ====  ==  =======
//  ===========  ====  ==  ===   ==  ===   ==  ====  ===  ==  =======
//  ===========  ====  ==      ====      ====  ====  ====    ========
//  ===========        ==  ====  ==  ====  ==        =====  =========
//  ===========  ====  ==  ====  ==  ====  ==  ====  =====  =========
//  ===========  ====  ==  ====  ==  ====  ==  ====  =====  =========
//  ===========  ====  ==  ====  ==  ====  ==  ====  =====  =========
//  =================================================================

export const getArray = (x) => (typeOf(x) === 'array' ? x : x ? [x] : [])
export const getArrayLength = (xs) => xs.length
export const map = (f) => (xs) => xs.map(f)
export const filter = (f) => (xs) => xs.filter(f)
export const slice = (from, to) => (xs) => xs.slice(from, to)
export const join = (delim) => (xs) => xs.join(delim)
export const removeEmpties = filter((x) => !!x)
export const removeUndefineds = filter((x) => x !== void 0)
export const concat = (array) => (x) => array.concat(x)
export const reduce = (f) => (init) => (xs) =>
  xs.reduce(
    curry(f),
    switchType({
      object: constant({}),
      array: constant([]),
      default: identity
    })(init)
  )
export const reduceDirty = (f) => (init) => (xs) => getArray(xs).reduce(curry(flip(f)), getArray(init))
export const flatten = reduce((acc) => pipe([ifThen(isArray)([flatten, identity]), concat(acc)]))([])
export const arrayHead = (xs) => xs[0]
export const arrayTail = ([h, ...t]) => t
export const arrayLast = (xs) => xs[xs.length - 1]
export const arrayInit = slice(0, -1)
export const EMPTY_ARRAY = (_) => []
export const arrayHas = (x) => pipe([filter(isEqual(x)), isArrayFilled])
export const chunkArrayFrom = (start = 0) => (size) => (value) => {
  let i = start
  return reduce((acc) => (x) => {
    acc[i] === void 0 && (acc[i] = [])
    const chunk = acc[i]
    chunk.push(x)
    chunk.length === size && i++
    return acc
  })([])(value)
}

export const chunkArray = chunkArrayFrom()

//  ===========================================================================
//  =============    ====      ========    ==        ====     ===        ======
//  ============  ==  ===  ===  ========  ===  =========  ===  =====  =========
//  ===========  ====  ==  ====  =======  ===  ========  ===========  =========
//  ===========  ====  ==  ===  ========  ===  ========  ===========  =========
//  ===========  ====  ==      =========  ===      ====  ===========  =========
//  ===========  ====  ==  ===  ========  ===  ========  ===========  =========
//  ===========  ====  ==  ====  ==  ===  ===  ========  ===========  =========
//  ============  ==  ===  ===  ===  ===  ===  =========  ===  =====  =========
//  =============    ====      =====     ====        ====     ======  =========
//  ===========================================================================

export const forIn = (f) => (o) => {
  for (const prop in o) f(prop)(o[prop])
  return o
}
export const methodEmpty = (m) => (o) => (o[m] ? o[m]() : o)
export const method = (m) => (arg) => (o) => (o[m] ? o[m](arg) : o)
export const methodI = (m) => (o) => (arg) => (o[m] ? o[m](arg) : o)
export const methodIOverstep = (m) => (arg) => (o) => (method(m)(arg)(o), o)
export const apply = (m) => (o) => (args) => o[m].apply(o, args)
export const prop = (name) => (o) => o[name]
export const keys = (o) => Object.keys(o)
export const getInstance = (constructor) => (...args) => new constructor(...args)
export const getInstanceEmpty = (constructor) => new constructor()
export const switchProp = (props) => (x) => {
  for (const prop in props) {
    if (x[prop]) return props[prop](x)
    if (x.default) return x.default(x)
  }
}
export const NULL = (_) => null
export const climb = (f) => fix((fr) => ([h, ...t]) => (o) => (t.length ? fr(t)(f(h)(o)) : f(h)(o)))

//  =========================================================================================================================
//  =============     =====    ====  =====  ==       =====    =====      ===    ==        ==    ====    ====  =======  ======
//  ============  ===  ===  ==  ===   ===   ==  ====  ===  ==  ===  ====  ===  ======  ======  ====  ==  ===   ======  ======
//  ===========  ========  ====  ==  =   =  ==  ====  ==  ====  ==  ====  ===  ======  ======  ===  ====  ==    =====  ======
//  ===========  ========  ====  ==  == ==  ==  ====  ==  ====  ===  ========  ======  ======  ===  ====  ==  ==  ===  ======
//  ===========  ========  ====  ==  =====  ==       ===  ====  =====  ======  ======  ======  ===  ====  ==  ===  ==  ======
//  ===========  ========  ====  ==  =====  ==  ========  ====  =======  ====  ======  ======  ===  ====  ==  ====  =  ======
//  ===========  ========  ====  ==  =====  ==  ========  ====  ==  ====  ===  ======  ======  ===  ====  ==  =====    ======
//  ============  ===  ===  ==  ===  =====  ==  =========  ==  ===  ====  ===  ======  ======  ====  ==  ===  ======   ======
//  =============     =====    ====  =====  ==  ==========    =====      ===    =====  =====    ====    ====  =======  ======
//  =========================================================================================================================

export const pipe = reduce((acc) => (f) => (x) => f(acc(x)))(identity)
export const pipeAsync = reduce((acc) => (f) => async (x) => f(await acc(x)))(identity)

//  =============================================================
//  ===========  ==========    =====      ===    ====     =======
//  ===========  =========  ==  ===   ==   ===  ====  ===  ======
//  ===========  ========  ====  ==  ====  ===  ===  ============
//  ===========  ========  ====  ==  =========  ===  ============
//  ===========  ========  ====  ==  =========  ===  ============
//  ===========  ========  ====  ==  ===   ===  ===  ============
//  ===========  ========  ====  ==  ====  ===  ===  ============
//  ===========  =========  ==  ===   ==   ===  ====  ===  ======
//  ===========        ====    =====      ===    ====     =======
//  =============================================================

export const toBoolean = (x) => !!x
export const not = (x) => !x
export const and = (x) => (y) => toBoolean(x && y)
export const or = (x) => (y) => toBoolean(x || y)
export const TRUE = (_) => true
export const FALSE = (_) => false
export const andArray = reduce(and)(true)
export const orArray = reduce(or)(false)
export const isEqual = (sample) => (x) => x === sample
export const isNotEqual = pipe([isEqual, not])
export const isNumber = (x) => typeOf(x) === 'number'
export const isString = (x) => typeOf(x) === 'string'
export const isRegExp = (x) => typeOf(x) === 'regexp'
export const isFunction = (x) => typeOf(x) === 'function'
export const isIterator = (x) => typeOf(x) === 'iterator'
export const isArray = (x) => typeOf(x) === 'array'
export const isObject = (x) => typeOf(x) === 'object'
export const isBlob = (x) => {
  const type = typeOf(x)
  return type === 'blob' || type === 'file'
}
export const isGUID = stringTest(/^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/)

//  ========================================================================================================
//  ===========        ==   ==   ==    ===      ===        =====  =====  =======  ====     ===        ======
//  ===========  =========  ==  ====  ===  ====  =====  =======    ====   ======  ===  ===  ==  ============
//  ===========  =========  ==  ====  ===  ====  =====  ======  ==  ===    =====  ==  ========  ============
//  ===========  ==========    =====  ====  ==========  =====  ====  ==  ==  ===  ==  ========  ============
//  ===========      =======  ======  ======  ========  =====  ====  ==  ===  ==  ==  ========      ========
//  ===========  ==========    =====  ========  ======  =====        ==  ====  =  ==  ========  ============
//  ===========  =========  ==  ====  ===  ====  =====  =====  ====  ==  =====    ==  ========  ============
//  ===========  =========  ==  ====  ===  ====  =====  =====  ====  ==  ======   ===  ===  ==  ============
//  ===========        ==  ====  ==    ===      ======  =====  ====  ==  =======  ====     ===        ======
//  ========================================================================================================

export const isNull = (x) => x === null
export const isNotNull = pipe([isNull, not])
export const isUndefined = (x) => x === void 0
export const isDefined = pipe([isUndefined, not])
export const isZero = (x) => x === 0
export const isNotZero = pipe([isZero, not])
export const isNaN = (x) => x !== x
export const isNotNaN = pipe([isNaN, not])
export const isNumberFilled = (x) => isNumber(x) && isNotZero(x) && isNotNaN(x)
export const isStringEmpty = (x) => x === ''
export const isStringFilled = pipe([isStringEmpty, not])
export const isArrayFilled = pipe([filter(isDefined), prop('length'), toBoolean])
export const isArrayEmpty = pipe([isArrayFilled, not])
export const isObjectFilled = ifThen(isObject)([pipe([keys, isArrayFilled]), FALSE])
export const isObjectEmpty = pipe([keys, isArrayEmpty])
export const isExists = (x) => isDefined(x) && isNotNull(x)
export const isNotExists = pipe([isExists, not])
export const isFilled = ifThen(isExists)([
  switchType({
    number: isNumberFilled,
    string: isStringFilled,
    array: isArrayFilled,
    object: isObjectFilled,
    null: FALSE,
    default: TRUE
  }),
  toBoolean
])
export const isNotFilled = pipe([isFilled, not])

export const hasOwnProp = method('hasOwnProperty')
export const hasProp = (name) => (o) => o[name]
export const isPropExists = (name) => pipe([prop(name), isExists])
export const isPropFilled = (name) => pipe([prop(name), isFilled])

//  =============================================
//  ===========        ==       ===  ====  ======
//  ==============  =====  ====  ==   ==   ======
//  ==============  =====  ====  ===  ==  =======
//  ==============  =====  ===   ===  ==  =======
//  ==============  =====      ======    ========
//  ==============  =====  ====  =====  =========
//  ==============  =====  ====  =====  =========
//  ==============  =====  ====  =====  =========
//  ==============  =====  ====  =====  =========
//  =============================================

export const tryCatch = (tryer) => (catcher) => (data) => {
  try {
    return tryer(data)
  } catch (err) {
    return catcher(err)(data)
  }
}

export const throwError = (msg) => {
  throw new Error(msg)
}
export const throwCatchedError = (err) => (msg) => {
  throw new Error(msg + '\n' + err)
}

//  ========================================================================================
//  =============     =====    ====  =======  ===      =====    ====  ========        ======
//  ============  ===  ===  ==  ===   ======  ==  ====  ===  ==  ===  ========  ============
//  ===========  ========  ====  ==    =====  ==  ====  ==  ====  ==  ========  ============
//  ===========  ========  ====  ==  ==  ===  ===  =======  ====  ==  ========  ============
//  ===========  ========  ====  ==  ===  ==  =====  =====  ====  ==  ========      ========
//  ===========  ========  ====  ==  ====  =  =======  ===  ====  ==  ========  ============
//  ===========  ========  ====  ==  =====    ==  ====  ==  ====  ==  ========  ============
//  ============  ===  ===  ==  ===  ======   ==  ====  ===  ==  ===  ========  ============
//  =============     =====    ====  =======  ===      =====    ====        ==        ======
//  ========================================================================================

export const inspect = overstep(console.log)

export const log = (...args) => {
  console.log('------- Begin')
  args.map((el) => console.log(el))
  console.log('------- End')
  return args.length > 1 ? args : args[0]
}


export const getTimeStamp = _ => new Date().getTime()
