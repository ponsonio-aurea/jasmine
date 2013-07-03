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
  // TODO: fill this in
});
