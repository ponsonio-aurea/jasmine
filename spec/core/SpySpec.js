describe("Spy - integration specs", function() {

  it("returns a function that has a SpyDelegate", function() {
    var spy = j$.createSpy();

    expect(spy instanceof Function).toBe(true);
    expect(spy.and instanceof j$.SpyStrategy).toBe(true);
  });

  it("returns a function that has a CallTracker", function() {
    var spy = j$.createSpy();

    expect(spy instanceof Function).toBe(true);
    expect(spy.calls instanceof j$.CallTracker).toBe(true);
  });

  it("keeps its identity", function() {
    var spy = j$.createSpy("foo");

    expect(spy.and.identity()).toEqual("foo");
  });

  it("acts like a spy for call tracking", function() {
    var spy = j$.createSpy();

    spy("foo");

    expect(spy.calls.count()).toEqual(1);
    expect(spy.calls.mostRecent()).toEqual({object: jasmine.getGlobal(), args: ["foo"]});
  });

  it("acts like a spy for configuration", function() {
    var originalFn = jasmine.createSpy("original").andReturn(17),
      spy = j$.createSpy("foo", originalFn),
      returnValue;

    spy();

    expect(originalFn).not.toHaveBeenCalled();

    originalFn.reset();
    spy.calls.reset();

    spy.and.callThrough();
    returnValue = spy();

    expect(originalFn).toHaveBeenCalled();
    expect(returnValue).toEqual(17);

    originalFn.reset();
    spy.calls.reset();

    spy.and.return(42);
    returnValue = spy();

    expect(originalFn).not.toHaveBeenCalled();
    expect(returnValue).toEqual(42);

    expect(spy.and.callThrough()).toBe(spy);
  });

  it("can optionally call through to a provided original function", function() {
    var originalFn = jasmine.createSpy('originalFn'),
        spy = j$.createSpy("foo", originalFn);

    spy.and.callThrough();
    spy();

    expect(originalFn).toHaveBeenCalled();
  });
});

describe("j$.isSpy", function() {
  it("calls a spy a spy", function() {
    var spy = j$.createSpy();

    expect(j$.isSpy(spy)).toBe(true);
  });

  it("calls a non-spy not a spy", function() {
    expect(j$.isSpy()).toBe(false);
    expect(j$.isSpy({})).toBe(false);
  });
});

describe("createSpyObj", function() {
  it("allows creating an arbitrary object where the methods are spies", function() {
    var spyObj = j$.createSpyObj('base', ['method1', 'method2']);

    expect(j$.isSpy(spyObj.method1)).toBe(true);
    expect(j$.isSpy(spyObj.method2)).toBe(true);

    expect(spyObj.method1.and.identity()).toEqual('base.method1');
  });

  it("throws when not passed in methods to double", function() {
    expect(function() { j$.createSpyObj('base'); })
        .toThrow("createSpyObj requires a non-empty array of method names to create spies for");

    expect(function() { j$.createSpyObj('base', []); })
        .toThrow("createSpyObj requires a non-empty array of method names to create spies for");
  });
});
