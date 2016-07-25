describe("jasmineUnderTest.util", function() {
  describe("isArray_", function() {
    it("should return true if the argument is an array", function() {
      expect(jasmineUnderTest.isArray_([])).toBe(true);
      expect(jasmineUnderTest.isArray_(['a'])).toBe(true);
    });

    it("should return false if the argument is not an array", function() {
      expect(jasmineUnderTest.isArray_(undefined)).toBe(false);
      expect(jasmineUnderTest.isArray_({})).toBe(false);
      expect(jasmineUnderTest.isArray_(function() {})).toBe(false);
      expect(jasmineUnderTest.isArray_('foo')).toBe(false);
      expect(jasmineUnderTest.isArray_(5)).toBe(false);
      expect(jasmineUnderTest.isArray_(null)).toBe(false);
    });
  });

  describe("isUndefined", function() {
    it("reports if a variable is defined", function() {
      var a;
      expect(jasmineUnderTest.util.isUndefined(a)).toBe(true);
      expect(jasmineUnderTest.util.isUndefined(undefined)).toBe(true);

      var undefined = "diz be undefined yo";
      expect(jasmineUnderTest.util.isUndefined(undefined)).toBe(false);
    });
  });

  describe("objectDifference", function() {
    it("given two objects A and B, returns the properties in A not present in B", function() {
      var a = {
        foo: 3,
        bar: 4,
        baz: 5
      };

      var b = {
        bar: 6,
        quux: 7
      };

      expect(jasmineUnderTest.util.objectDifference(a, b)).toEqual({foo: 3, baz: 5})
    });

    it("only looks at own properties of both objects", function() {
      function Foo() {}

      Foo.prototype.x = 1;
      Foo.prototype.y = 2;

      var a = new Foo();
      a.x = 1;

      var b = new Foo();
      b.y = 2;

      expect(jasmineUnderTest.util.objectDifference(a, b)).toEqual({x: 1});
      expect(jasmineUnderTest.util.objectDifference(b, a)).toEqual({y: 2});
    });
  });

  describe("functionName", function() {
    it("gets the name of a function", function() {
      if (jasmine.getEnv().ieVersion < 9) {
        return;
      }

      var f = function foo() {
      };

      expect(jasmineUnderTest.util.functionName(f)).toEqual('foo');
    });

    it("gets the name of a function in IE8", function() {
      if (jasmine.getEnv().ieVersion !== 8) {
        return;
      }

      var f = function foo() {
      };

      expect(jasmineUnderTest.util.functionName(f)).toEqual('foo');
    })

  })
});
