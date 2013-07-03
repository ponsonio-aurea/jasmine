getJasmineRequireObj().SpyDelegate = function(j$) {

  j$.createSpy = function(name, originalFn) {

    var spyStrategy = new j$.SpyStrategy({
          name: name,
          fn: originalFn
        }),
        callTracker = new j$.CallTracker(),
        spy = function() {
          callTracker.track({
            object: this,
            args: Array.prototype.slice.apply(arguments)
          });
          return spyStrategy.exec.apply(this, arguments);
        };

    spy.and = spyStrategy;
    spy.calls = callTracker;

    return spy;
  };

  j$.isSpy = function(putativeSpy) {
    if (!putativeSpy) {
      return false;
    }
    return putativeSpy.and instanceof j$.SpyStrategy &&
        putativeSpy.calls instanceof j$.CallTracker;
  };

  j$.createSpyObj = function(baseName, methodNames) {
    if (!j$.isArray_(methodNames) || methodNames.length === 0) {
      throw "createSpyObj requires a non-empty array of method names to create spies for";
    }
    var obj = {};
    for (var i = 0; i < methodNames.length; i++) {
      obj[methodNames[i]] = j$.createSpy(baseName + '.' + methodNames[i]);
    }
    return obj;
  };

  return {};
};
