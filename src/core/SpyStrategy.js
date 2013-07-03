getJasmineRequireObj().SpyStrategy = function() {

  function SpyStrategy(options) {
    var identity = (options && options.name) || "unknown",
        originalFn = (options && options.fn) || function() {},
        plan = function() {};

    this.identity = function() {
      return identity;
    };

    this.exec = function() {
      return plan.apply(this, arguments);
    };

    this.callThrough = function() {
      plan = originalFn;
    };

    this.return = function(value) {
      plan = function() {
        return value;
      };
    };

    this.throw = function(something) {
      plan = function() {
        throw something;
      }
    };

    this.callFake = function(fn) {
      plan = fn;
    };
  }

  return SpyStrategy;
};
