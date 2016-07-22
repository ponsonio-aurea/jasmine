getJasmineRequireObj().DiffBuilder = function(j$) {
  return function DiffBuilder() {
    var util = this,
      path = [],
      mismatches = [];

    return {
      record: function (actual, expected, formatter) {
        formatter = formatter || defaultFormatter;
        mismatches.push(formatter(actual, expected, printPath()));
      },
      getMessage: function () {
        return mismatches.join('\n');
      },
      withPath: function (pathComponent, block) {
        path.push(pathComponent);
        block();
        path.pop();
      }
    };

    function printPath() {
      if (path.length > 0) {
        return '$' + map(path, formatPropertyAccess).join('');
      } else {
        return '';
      }
    }

    function defaultFormatter (actual, expected, path) {
      return 'Expected ' +
        path + (path.length ? ' = ' : '') +
        j$.pp(actual) +
        ' to equal ' +
        j$.pp(expected) +
        '.';
    }

    function formatPropertyAccess(property) {
      if (typeof property === 'string') {
        if (/^[A-Za-z\$_][A-Za-z0-9\$_]*$/.test(property)) {
          return '.' + property;
        } else {
          return '["' + property + '"]';
        }
      } else {
        return '[' + property + ']';
      }
    }

    function map(array, fn) {
      var results = [];
      for (var i = 0; i < array.length; i++) {
        results.push(fn(array[i]));
      }
      return results;
    }
  };
};
