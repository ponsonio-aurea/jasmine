getJasmineRequireObj().QueueRunner = function() {

  function QueueRunner(attrs) {
    this.fns = attrs.fns || [];
    this.onComplete = attrs.onComplete || function() {};
    this.clearStack = attrs.clearStack || function(fn) {fn();};
    this.onException = attrs.onException || function() {};
    this.catchException = attrs.catchException || function() { return true; };
    
    this.timer = attrs.realTimer;
    this.leaf = attrs.leaf;
    this.asyncSpecTimeout = attrs.asyncSpecTimeout || 60000;
  }

  QueueRunner.prototype.execute = function() {
    this.run(this.fns, 0);
  };

  QueueRunner.prototype.run = function(fns, recursiveIndex) {
    var length = fns.length,
        self = this,
        iterativeIndex;

    for(iterativeIndex = recursiveIndex; iterativeIndex < length; iterativeIndex++) {
      var fn = fns[iterativeIndex];

      if (fn.length > 0) {
        var nextIteration = function() {
          self.run(fns, iterativeIndex + 1);
        };

        var attemptSuccessful = attempt(fn, nextIteration);

        if(attemptSuccessful) {
          return;
        } else {
          // TODO cleanup the timeout ?
        }
      } else {
        attempt(function() { fn.call(self); });
      }
    }

    var runnerDone = iterativeIndex >= length;

    if (runnerDone) {
      this.clearStack(this.onComplete);
    }

    function attempt(fn, done) {
      var timeout;

      try {
        if (self.leaf && arguments.length !== 1) {
          timeout = Function.prototype.call.apply(self.timer.setTimeout, [window, function() { 
            self.onException(new Error("timeout"));
            done();
          }, self.asyncSpecTimeout]);
        }

        var next = function() {
          if (timeout !== void 0) { Function.prototype.call.apply(self.timer.clearTimeout, [window, timeout]); }
          done();
        };
        
        fn.call(self, next);
        
        return true;
      } catch (e) {
        self.onException(e);
        if (!self.catchException(e)) {
          //TODO: set a var when we catch an exception and
          //use a finally block to close the loop in a nice way..
          throw e;
        }
        return false;
      }
    }
  };

  return QueueRunner;
};
