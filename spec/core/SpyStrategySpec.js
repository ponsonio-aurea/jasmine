describe("SpyStrategy", function() {

  it("defaults its name to unknown", function() {
    var spyStrategy = new j$.SpyStrategy();

    expect(spyStrategy.identity()).toEqual("unknown");
  });

  it("takes a name", function() {
    var spyStrategy = new j$.SpyStrategy({name: "foo"});

    expect(spyStrategy.identity()).toEqual("foo");
  });

  it("stubs an original function, if provided", function() {
    var originalFn = jasmine.createSpy("original"),
        spyStrategy = new j$.SpyStrategy({fn: originalFn});

    spyStrategy.exec();

    expect(originalFn).not.toHaveBeenCalled();
  });

  it("allows an original function to be called, passed through the params and returns it's value", function() {
    var originalFn = jasmine.createSpy("original").andReturn(42),
        spyStrategy = new j$.SpyStrategy({fn: originalFn}),
        returnValue;

    spyStrategy.callThrough();
    returnValue = spyStrategy.exec("foo");

    expect(originalFn).toHaveBeenCalled();
    expect(originalFn.mostRecentCall.args).toEqual(["foo"]);
    expect(returnValue).toEqual(42);
  });

  it("can return a specified value when executed", function() {
    var originalFn = jasmine.createSpy("original"),
        spyStrategy = new j$.SpyStrategy({fn: originalFn}),
        returnValue;

    spyStrategy.return(17);
    returnValue = spyStrategy.exec();

    expect(originalFn).not.toHaveBeenCalled();
    expect(returnValue).toEqual(17);
  });

  it("allows an exception to be thrown when executed", function() {
    var originalFn = jasmine.createSpy("original"),
        spyStrategy = new j$.SpyStrategy({fn: originalFn});

    spyStrategy.throw("bar");

    expect(function() { spyStrategy.exec(); }).toThrow("bar");
    expect(originalFn).not.toHaveBeenCalled();
  });

  it("allows a fake function to be called instead", function() {
    var originalFn = jasmine.createSpy("original"),
        fakeFn = jasmine.createSpy("fake").andReturn(67),
        spyStrategy = new j$.SpyStrategy({fn: originalFn}),
        returnValue;

    spyStrategy.callFake(fakeFn);
    returnValue = spyStrategy.exec();

    expect(originalFn).not.toHaveBeenCalled();
    expect(returnValue).toEqual(67);
  });
});
