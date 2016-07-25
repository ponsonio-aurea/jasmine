describe("toEqual", function() {
  "use strict";

  function compareEquals(actual, expected) {
    var util = jasmineUnderTest.matchersUtil,
      matcher = jasmineUnderTest.matchers.toEqual(util);

    var result = matcher.compare(actual, expected);

    return result;
  }

  it("delegates to equals function", function() {
    var util = {
        equals: jasmine.createSpy('delegated-equals').and.returnValue(true),
        buildFailureMessage: function() { 
          return 'does not matter' 
        },
        DiffBuilder: jasmineUnderTest.matchersUtil.DiffBuilder
      },
      matcher = jasmineUnderTest.matchers.toEqual(util),
      result;

    result = matcher.compare(1, 1);

    expect(util.equals).toHaveBeenCalledWith(1, 1, [], jasmine.anything());
    expect(result.pass).toBe(true);
  });

  it("delegates custom equality testers, if present", function() {
    var util = {
        equals: jasmine.createSpy('delegated-equals').and.returnValue(true),
        buildFailureMessage: function() { 
          return 'does not matter' 
        },
        DiffBuilder: jasmineUnderTest.matchersUtil.DiffBuilder
      },
      customEqualityTesters = ['a', 'b'],
      matcher = jasmineUnderTest.matchers.toEqual(util, customEqualityTesters),
      result;

    result = matcher.compare(1, 1);

    expect(util.equals).toHaveBeenCalledWith(1, 1, ['a', 'b'], jasmine.anything());
    expect(result.pass).toBe(true);
  });

  it("reports the difference between objects that are not equal", function() {
    var actual = {x: 1, y: 3},
      expected = {x: 2, y: 3},
      message = "Expected $.x = 1 to equal 2.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports the difference between nested objects that are not equal", function() {
    var actual = {x: {y: 1}},
      expected = {x: {y: 2}},
      message = "Expected $.x.y = 1 to equal 2.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("formats property access so that it's valid JavaScript", function() {
    var actual = {'my prop': 1},
      expected = {'my prop': 2},
      message = "Expected $['my prop'] = 1 to equal 2.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports missing properties", function() {
    var actual = {x: {}},
      expected = {x: {y: 1}},
      message =
        "Expected $.x to have properties\n" +
        "    y: 1";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports extra properties", function() {
    var actual = {x: {y: 1, z: 2}},
      expected = {x: {}},
      message =
        "Expected $.x not to have properties\n" +
        "    y: 1\n" +
        "    z: 2";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("pretty-prints properties", function() {
    var actual = {x: {y: 'foo bar'}},
      expected = {x: {}},
      message =
        "Expected $.x not to have properties\n" +
        "    y: 'foo bar'"

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports extra and missing properties together", function() {
    var actual = {x: {y: 1, z: 2, f: 4}},
      expected = {x: {y: 1, z: 2, g: 3}},
      message =
        "Expected $.x to have properties\n" +
        "    g: 3\n" +
        "Expected $.x not to have properties\n" +
        "    f: 4";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports extra and missing properties of the root-level object", function() {
    var actual = {x: 1},
      expected = {a: 1},
      message =
        "Expected object to have properties\n" +
        "    a: 1\n" +
        "Expected object not to have properties\n" +
        "    x: 1";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports multiple incorrect values", function() {
    var actual = {x: 1, y: 2},
      expected = {x: 3, y: 4},
      message =
        "Expected $.x = 1 to equal 3.\n" +
        "Expected $.y = 2 to equal 4.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports mismatch between actual child object and expected child number", function() {
    var actual = {x: {y: 2}},
      expected = {x: 1},
      message = "Expected $.x = Object({ y: 2 }) to equal 1.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("uses the default failure message if actual is not an object", function() {
    var actual = 1,
      expected = {x: {}},
      message = "Expected 1 to equal Object({ x: Object({  }) }).";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("uses the default failure message if expected is not an object", function() {
    var actual = {x: {}},
      expected = 1,
      message = "Expected Object({ x: Object({  }) }) to equal 1.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("uses the default failure message given arrays with different lengths", function() {
    var actual = [1, 2],
      expected = [1, 2, 3],
      message =
        "Expected [ 1, 2 ] to equal [ 1, 2, 3 ].";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports a mismatch between elements of equal-length arrays", function() {
    var actual = [1, 2, 5],
      expected = [1, 2, 3],
      message = "Expected $[2] = 5 to equal 3.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports a mismatch between multiple array elements", function() {
    var actual = [2, 2, 5],
      expected = [1, 2, 3],
      message =
        "Expected $[0] = 2 to equal 1.\n" +
        "Expected $[2] = 5 to equal 3.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports a mismatch between properties of objects in arrays", function() {
    var actual = [{x: 1}],
      expected = [{x: 2}],
      message = "Expected $[0].x = 1 to equal 2.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports a mismatch between arrays in objects", function() {
    var actual = {x: [1]},
      expected = {x: [2]},
      message =
        "Expected $.x[0] = 1 to equal 2.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports mismatches between nested arrays", function() {
    var actual = [[1]],
      expected = [[2]],
      message =
        "Expected $[0][0] = 1 to equal 2.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports mismatches involving NaN", function() {
    var actual = {x: 0},
      expected = {x: 0/0},
      message = "Expected $.x = 0 to equal NaN.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports mismatches involving regular expressions", function() {
    var actual = {x: '1'},
      expected = {x: /1/},
      message = "Expected $.x = '1' to equal /1/.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports mismatches involving infinities", function() {
    var actual = {x: 0},
      expected = {x: 1/0},
      message = "Expected $.x = 0 to equal Infinity.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports mismatches involving booleans", function() {
    var actual = {x: false},
      expected = {x: true},
      message = "Expected $.x = false to equal true.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports mismatches involving strings", function() {
    var actual = {x: 'foo'},
      expected = {x: 'bar'},
      message = "Expected $.x = 'foo' to equal 'bar'.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports mismatches involving undefined", function() {
    var actual = {x: void 0},
      expected = {x: 0},
      message = "Expected $.x = undefined to equal 0.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports mismatches involving null", function() {
    var actual = {x: null},
      expected = {x: 0},
      message = "Expected $.x = null to equal 0.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports mismatches between objects with different constructors", function () {
    function Foo() {}
    function Bar() {}

    var actual = {x: new Foo()},
        expected = {x: new Bar()},
        message = "Expected $.x to be a kind of Bar, but was Foo({  }).";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports type mismatches at the root level", function () {
    function Foo() {}
    function Bar() {}

    var actual = new Foo(),
      expected = new Bar(),
      message = "Expected object to be a kind of Bar, but was Foo({  }).";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports mismatches between objects with their own constructor property", function () {
    // IE8 seems to treat all properties named `constructor` as non-enumerable, so objects that differ only
    // by constructor will be considered equivalent
    if (jasmine.getEnv().ieVersion < 9) {
      return;
    }

    var actual = {x: {constructor: 'blerf'}},
        expected = {x: {constructor: 'ftarrh'}},
        message = "Expected $.x.constructor = 'blerf' to equal 'ftarrh'.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports mismatches between an object with a real constructor and one with its own constructor property", function () {
    // IE8 seems to treat all properties named `constructor` as non-enumerable, so objects that differ only
    // by constructor will be considered equivalent
    if (jasmine.getEnv().ieVersion < 9) {
      return;
    }

    var actual = {x: {}},
      expected = {x: {constructor: 'ftarrh'}},
      message =
        "Expected $.x to have properties\n" +
        "    constructor: 'ftarrh'";

    expect(compareEquals(actual, expected).message).toEqual(message);
    expect(compareEquals(expected, actual).message).toEqual(
      "Expected $.x not to have properties\n    constructor: 'ftarrh'"
    );
  });

  it("reports mismatches between 0 and -0", function() {
    var actual = {x: 0},
      expected = {x: -0},
      message = "Expected $.x = 0 to equal -0.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports mismatches between Errors", function() {
    var actual = {x: new Error("the error you got")},
      expected = {x: new Error("the error you want")},
      message = "Expected $.x = Error: the error you got to equal Error: the error you want.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports mismatches between Functions", function() {
    var actual = {x: function() {}},
      expected = {x: function() {}},
      message = "Expected $.x = Function to equal Function.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports mismatches between DOM nodes", function() {
    if (typeof document !== 'object') {
      return;
    }
    var actual = document.createElement('div'),
      expected = document.createElement('div'),
      message = "Expected HTMLNode to equal HTMLNode.";

    actual.innerText = 'foo';
    expected.innerText = 'bar';

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports mismatches between a DOM node and something that's not a DOM node", function() {
    if (typeof document !== 'object') {
      return;
    }
    var actual = {nodeType: 1},
      expected = document.createElement('div'),
      message = "Expected HTMLNode to equal HTMLNode.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("reports mismatches in objects with cycles", function() {
    var a = {};
    var b = {};

    a.self = a;
    b.self = '';

    expect(compareEquals(a, b).message).toEqual("Expected $.self = Object({ self: <circular reference: Object> }) to equal ''.");
  });

  it("reports mismatches from custom testers", function() {
    function compareByIdentity(a, b) {
      return a === b;
    }

    var util = jasmineUnderTest.matchersUtil,
      matcher = jasmineUnderTest.matchers.toEqual(util, [compareByIdentity]);

    var a = {id: 1},
        b = {id: 1};

    expect(matcher.compare(a, b).message).toEqual("Expected Object({ id: 1 }) to equal Object({ id: 1 }).")
  });

  it("reports asymmetric mismatches", function() {
    var actual = 'foo',
      expected = jasmineUnderTest.any(Number),
      message = "Expected 'foo' to equal <jasmine.any(Number)>.";

    expect(compareEquals(actual, expected).message).toEqual(message);
  });

  it("works on big complex stuff", function() {
    var actual = {
      foo: [
        {bar: 1, things: ['a', 'b']},
        {bar: 2, things: ['a', 'b']}
      ],
      baz: [
        {a: {b: 1}}
      ],
      quux: 1,
      nan: 0,
      aRegexp: 'hi',
      inf: -1/0,
      boolean: false,
      notDefined: 0,
      aNull: void 0
    }

    var expected = {
      foo: [
        {bar: 2, things: ['a', 'b', 'c']},
        {bar: 2, things: ['a', 'd']}
      ],
      baz: [
        {a: {b: 1, c: 1}}
      ],
      quux: [],
      nan: 0/0,
      aRegexp: /hi/,
      inf: 1/0,
      boolean: true,
      notDefined: void 0,
      aNull: null
    };

    var messages = [
      'Expected $.foo[0].bar = 1 to equal 2.',
      "Expected $.foo[0].things = [ 'a', 'b' ] to equal [ 'a', 'b', 'c' ].",
      "Expected $.foo[1].things[1] = 'b' to equal 'd'.",
      'Expected $.baz[0].a to have properties',
      '    c: 1',
      'Expected $.quux = 1 to equal [  ].',
      'Expected $.nan = 0 to equal NaN.',
      "Expected $.aRegexp = 'hi' to equal /hi/.",
      'Expected $.inf = -Infinity to equal Infinity.',
      'Expected $.boolean = false to equal true.',
      'Expected $.notDefined = 0 to equal undefined.',
      'Expected $.aNull = undefined to equal null.'
    ];

    expect(compareEquals(actual, expected).message.split('\n')).toEqual(messages);
  })
});
