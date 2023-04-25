var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/verbal-expressions/dist/verbalexpressions.js
var require_verbalexpressions = __commonJS({
  "node_modules/verbal-expressions/dist/verbalexpressions.js"(exports, module2) {
    (function(root, factory) {
      if (root === void 0 && window !== void 0)
        root = window;
      if (typeof define === "function" && define.amd) {
        define("VerEx", [], function() {
          return root["VerEx"] = factory();
        });
      } else if (typeof module2 === "object" && module2.exports) {
        module2.exports = factory();
      } else {
        root["VerEx"] = factory();
      }
    })(exports, function() {
      var _createClass = function() {
        function defineProperties(target, props) {
          for (var i2 = 0; i2 < props.length; i2++) {
            var descriptor = props[i2];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor)
              descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _possibleConstructorReturn(self, call) {
        if (!self) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return call && (typeof call === "object" || typeof call === "function") ? call : self;
      }
      function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
        if (superClass)
          Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
      }
      function _extendableBuiltin(cls) {
        function ExtendableBuiltin() {
          var instance = Reflect.construct(cls, Array.from(arguments));
          Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
          return instance;
        }
        ExtendableBuiltin.prototype = Object.create(cls.prototype, {
          constructor: {
            value: cls,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(ExtendableBuiltin, cls);
        } else {
          ExtendableBuiltin.__proto__ = cls;
        }
        return ExtendableBuiltin;
      }
      var VerbalExpression = function(_extendableBuiltin2) {
        _inherits(VerbalExpression2, _extendableBuiltin2);
        function VerbalExpression2() {
          _classCallCheck(this, VerbalExpression2);
          var _this = _possibleConstructorReturn(this, (VerbalExpression2.__proto__ || Object.getPrototypeOf(VerbalExpression2)).call(this, "", "gm"));
          _this._prefixes = "";
          _this._source = "";
          _this._suffixes = "";
          _this._modifiers = "gm";
          return _this;
        }
        _createClass(VerbalExpression2, [{
          key: "add",
          value: function add() {
            var value = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
            this._source += value;
            var pattern = this._prefixes + this._source + this._suffixes;
            this.compile(pattern, this._modifiers);
            return this;
          }
        }, {
          key: "startOfLine",
          value: function startOfLine() {
            var enable = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
            this._prefixes = enable ? "^" : "";
            return this.add();
          }
        }, {
          key: "endOfLine",
          value: function endOfLine() {
            var enable = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
            this._suffixes = enable ? "$" : "";
            return this.add();
          }
        }, {
          key: "then",
          value: function then(value) {
            value = VerbalExpression2.sanitize(value);
            return this.add("(?:" + value + ")");
          }
        }, {
          key: "find",
          value: function find(value) {
            return this.then(value);
          }
        }, {
          key: "maybe",
          value: function maybe(value) {
            value = VerbalExpression2.sanitize(value);
            return this.add("(?:" + value + ")?");
          }
        }, {
          key: "or",
          value: function or(value) {
            this._prefixes += "(?:";
            this._suffixes = ")" + this._suffixes;
            this.add(")|(?:");
            if (value) {
              this.then(value);
            }
            return this;
          }
        }, {
          key: "anything",
          value: function anything() {
            return this.add("(?:.*)");
          }
        }, {
          key: "anythingBut",
          value: function anythingBut(value) {
            if (Array.isArray(value)) {
              value = value.join("");
            }
            value = VerbalExpression2.sanitize(value);
            return this.add("(?:[^" + value + "]*)");
          }
        }, {
          key: "something",
          value: function something() {
            return this.add("(?:.+)");
          }
        }, {
          key: "somethingBut",
          value: function somethingBut(value) {
            if (Array.isArray(value)) {
              value = value.join("");
            }
            value = VerbalExpression2.sanitize(value);
            return this.add("(?:[^" + value + "]+)");
          }
        }, {
          key: "anyOf",
          value: function anyOf(value) {
            if (Array.isArray(value)) {
              value = value.join("");
            }
            value = VerbalExpression2.sanitize(value);
            return this.add("[" + value + "]");
          }
        }, {
          key: "any",
          value: function any(value) {
            return this.anyOf(value);
          }
        }, {
          key: "not",
          value: function not(value) {
            value = VerbalExpression2.sanitize(value);
            this.add("(?!" + value + ")");
            return this;
          }
        }, {
          key: "range",
          value: function range() {
            var value = "";
            for (var i2 = 1; i2 < arguments.length; i2 += 2) {
              var from = VerbalExpression2.sanitize(arguments.length <= i2 - 1 ? void 0 : arguments[i2 - 1]);
              var to = VerbalExpression2.sanitize(arguments.length <= i2 ? void 0 : arguments[i2]);
              value += from + "-" + to;
            }
            return this.add("[" + value + "]");
          }
        }, {
          key: "lineBreak",
          value: function lineBreak() {
            return this.add("(?:\\r\\n|\\r|\\n)");
          }
        }, {
          key: "br",
          value: function br() {
            return this.lineBreak();
          }
        }, {
          key: "tab",
          value: function tab() {
            return this.add("\\t");
          }
        }, {
          key: "word",
          value: function word() {
            return this.add("\\w+");
          }
        }, {
          key: "digit",
          value: function digit() {
            return this.add("\\d");
          }
        }, {
          key: "whitespace",
          value: function whitespace() {
            return this.add("\\s");
          }
        }, {
          key: "addModifier",
          value: function addModifier(modifier) {
            if (!this._modifiers.includes(modifier)) {
              this._modifiers += modifier;
            }
            return this.add();
          }
        }, {
          key: "removeModifier",
          value: function removeModifier(modifier) {
            this._modifiers = this._modifiers.replace(modifier, "");
            return this.add();
          }
        }, {
          key: "withAnyCase",
          value: function withAnyCase() {
            var enable = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
            return enable ? this.addModifier("i") : this.removeModifier("i");
          }
        }, {
          key: "stopAtFirst",
          value: function stopAtFirst() {
            var enable = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
            return enable ? this.removeModifier("g") : this.addModifier("g");
          }
        }, {
          key: "searchOneLine",
          value: function searchOneLine() {
            var enable = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
            return enable ? this.removeModifier("m") : this.addModifier("m");
          }
        }, {
          key: "repeatPrevious",
          value: function repeatPrevious() {
            var isInteger = /\d+/;
            for (var _len = arguments.length, quantity = Array(_len), _key = 0; _key < _len; _key++) {
              quantity[_key] = arguments[_key];
            }
            var values = quantity.filter(function(argument) {
              return isInteger.test(argument);
            });
            if (values.length === 0 || values.length > 2) {
              return this;
            }
            this.add("{" + values.join(",") + "}");
            return this;
          }
        }, {
          key: "oneOrMore",
          value: function oneOrMore() {
            return this.add("+");
          }
        }, {
          key: "multiple",
          value: function multiple(value, lower, upper) {
            if (value !== void 0) {
              value = VerbalExpression2.sanitize(value);
              this.add("(?:" + value + ")");
            }
            if (lower === void 0 && upper === void 0) {
              this.add("*");
            } else if (lower !== void 0 && upper === void 0) {
              this.add("{" + lower + ",}");
            } else if (lower !== void 0 && upper !== void 0) {
              this.add("{" + lower + "," + upper + "}");
            }
            return this;
          }
        }, {
          key: "beginCapture",
          value: function beginCapture() {
            this._suffixes += ")";
            return this.add("(");
          }
        }, {
          key: "endCapture",
          value: function endCapture() {
            this._suffixes = this._suffixes.slice(0, -1);
            return this.add(")");
          }
        }, {
          key: "replace",
          value: function replace(source, value) {
            source = source.toString();
            return source.replace(this, value);
          }
        }, {
          key: "toRegExp",
          value: function toRegExp() {
            var components = this.toString().match(/\/(.*)\/([gimuy]+)?/);
            var pattern = components[1];
            var flags = components[2];
            return new RegExp(pattern, flags);
          }
        }], [{
          key: "sanitize",
          value: function sanitize(value) {
            if (value instanceof RegExp) {
              return value.source;
            }
            if (typeof value === "number") {
              return value;
            }
            if (typeof value !== "string") {
              return "";
            }
            var toEscape = /([\].|*?+(){}^$\\:=[])/g;
            var lastMatch = "$&";
            return value.replace(toEscape, "\\" + lastMatch);
          }
        }]);
        return VerbalExpression2;
      }(_extendableBuiltin(RegExp));
      function VerEx9() {
        var instance = new VerbalExpression();
        instance.sanitize = VerbalExpression.sanitize;
        return instance;
      }
      return VerEx9;
    });
  }
});

// node_modules/fs.realpath/old.js
var require_old = __commonJS({
  "node_modules/fs.realpath/old.js"(exports) {
    var pathModule = require("path");
    var isWindows = process.platform === "win32";
    var fs4 = require("fs");
    var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);
    function rethrow() {
      var callback;
      if (DEBUG) {
        var backtrace = new Error();
        callback = debugCallback;
      } else
        callback = missingCallback;
      return callback;
      function debugCallback(err) {
        if (err) {
          backtrace.message = err.message;
          err = backtrace;
          missingCallback(err);
        }
      }
      function missingCallback(err) {
        if (err) {
          if (process.throwDeprecation)
            throw err;
          else if (!process.noDeprecation) {
            var msg = "fs: missing callback " + (err.stack || err.message);
            if (process.traceDeprecation)
              console.trace(msg);
            else
              console.error(msg);
          }
        }
      }
    }
    function maybeCallback(cb) {
      return typeof cb === "function" ? cb : rethrow();
    }
    var normalize = pathModule.normalize;
    if (isWindows) {
      nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
    } else {
      nextPartRe = /(.*?)(?:[\/]+|$)/g;
    }
    var nextPartRe;
    if (isWindows) {
      splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
    } else {
      splitRootRe = /^[\/]*/;
    }
    var splitRootRe;
    exports.realpathSync = function realpathSync(p, cache) {
      p = pathModule.resolve(p);
      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return cache[p];
      }
      var original = p, seenLinks = {}, knownHard = {};
      var pos;
      var current;
      var base;
      var previous;
      start();
      function start() {
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = "";
        if (isWindows && !knownHard[base]) {
          fs4.lstatSync(base);
          knownHard[base] = true;
        }
      }
      while (pos < p.length) {
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;
        if (knownHard[base] || cache && cache[base] === base) {
          continue;
        }
        var resolvedLink;
        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          resolvedLink = cache[base];
        } else {
          var stat = fs4.lstatSync(base);
          if (!stat.isSymbolicLink()) {
            knownHard[base] = true;
            if (cache)
              cache[base] = base;
            continue;
          }
          var linkTarget = null;
          if (!isWindows) {
            var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
            if (seenLinks.hasOwnProperty(id)) {
              linkTarget = seenLinks[id];
            }
          }
          if (linkTarget === null) {
            fs4.statSync(base);
            linkTarget = fs4.readlinkSync(base);
          }
          resolvedLink = pathModule.resolve(previous, linkTarget);
          if (cache)
            cache[base] = resolvedLink;
          if (!isWindows)
            seenLinks[id] = linkTarget;
        }
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
      if (cache)
        cache[original] = p;
      return p;
    };
    exports.realpath = function realpath(p, cache, cb) {
      if (typeof cb !== "function") {
        cb = maybeCallback(cache);
        cache = null;
      }
      p = pathModule.resolve(p);
      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return process.nextTick(cb.bind(null, null, cache[p]));
      }
      var original = p, seenLinks = {}, knownHard = {};
      var pos;
      var current;
      var base;
      var previous;
      start();
      function start() {
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = "";
        if (isWindows && !knownHard[base]) {
          fs4.lstat(base, function(err) {
            if (err)
              return cb(err);
            knownHard[base] = true;
            LOOP();
          });
        } else {
          process.nextTick(LOOP);
        }
      }
      function LOOP() {
        if (pos >= p.length) {
          if (cache)
            cache[original] = p;
          return cb(null, p);
        }
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;
        if (knownHard[base] || cache && cache[base] === base) {
          return process.nextTick(LOOP);
        }
        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          return gotResolvedLink(cache[base]);
        }
        return fs4.lstat(base, gotStat);
      }
      function gotStat(err, stat) {
        if (err)
          return cb(err);
        if (!stat.isSymbolicLink()) {
          knownHard[base] = true;
          if (cache)
            cache[base] = base;
          return process.nextTick(LOOP);
        }
        if (!isWindows) {
          var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
          if (seenLinks.hasOwnProperty(id)) {
            return gotTarget(null, seenLinks[id], base);
          }
        }
        fs4.stat(base, function(err2) {
          if (err2)
            return cb(err2);
          fs4.readlink(base, function(err3, target) {
            if (!isWindows)
              seenLinks[id] = target;
            gotTarget(err3, target);
          });
        });
      }
      function gotTarget(err, target, base2) {
        if (err)
          return cb(err);
        var resolvedLink = pathModule.resolve(previous, target);
        if (cache)
          cache[base2] = resolvedLink;
        gotResolvedLink(resolvedLink);
      }
      function gotResolvedLink(resolvedLink) {
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
    };
  }
});

// node_modules/fs.realpath/index.js
var require_fs = __commonJS({
  "node_modules/fs.realpath/index.js"(exports, module2) {
    module2.exports = realpath;
    realpath.realpath = realpath;
    realpath.sync = realpathSync;
    realpath.realpathSync = realpathSync;
    realpath.monkeypatch = monkeypatch;
    realpath.unmonkeypatch = unmonkeypatch;
    var fs4 = require("fs");
    var origRealpath = fs4.realpath;
    var origRealpathSync = fs4.realpathSync;
    var version = process.version;
    var ok = /^v[0-5]\./.test(version);
    var old = require_old();
    function newError(er) {
      return er && er.syscall === "realpath" && (er.code === "ELOOP" || er.code === "ENOMEM" || er.code === "ENAMETOOLONG");
    }
    function realpath(p, cache, cb) {
      if (ok) {
        return origRealpath(p, cache, cb);
      }
      if (typeof cache === "function") {
        cb = cache;
        cache = null;
      }
      origRealpath(p, cache, function(er, result) {
        if (newError(er)) {
          old.realpath(p, cache, cb);
        } else {
          cb(er, result);
        }
      });
    }
    function realpathSync(p, cache) {
      if (ok) {
        return origRealpathSync(p, cache);
      }
      try {
        return origRealpathSync(p, cache);
      } catch (er) {
        if (newError(er)) {
          return old.realpathSync(p, cache);
        } else {
          throw er;
        }
      }
    }
    function monkeypatch() {
      fs4.realpath = realpath;
      fs4.realpathSync = realpathSync;
    }
    function unmonkeypatch() {
      fs4.realpath = origRealpath;
      fs4.realpathSync = origRealpathSync;
    }
  }
});

// node_modules/minimatch/lib/path.js
var require_path = __commonJS({
  "node_modules/minimatch/lib/path.js"(exports, module2) {
    var isWindows = typeof process === "object" && process && process.platform === "win32";
    module2.exports = isWindows ? { sep: "\\" } : { sep: "/" };
  }
});

// node_modules/balanced-match/index.js
var require_balanced_match = __commonJS({
  "node_modules/balanced-match/index.js"(exports, module2) {
    "use strict";
    module2.exports = balanced;
    function balanced(a, b, str) {
      if (a instanceof RegExp)
        a = maybeMatch(a, str);
      if (b instanceof RegExp)
        b = maybeMatch(b, str);
      var r = range(a, b, str);
      return r && {
        start: r[0],
        end: r[1],
        pre: str.slice(0, r[0]),
        body: str.slice(r[0] + a.length, r[1]),
        post: str.slice(r[1] + b.length)
      };
    }
    function maybeMatch(reg, str) {
      var m = str.match(reg);
      return m ? m[0] : null;
    }
    balanced.range = range;
    function range(a, b, str) {
      var begs, beg, left, right, result;
      var ai = str.indexOf(a);
      var bi = str.indexOf(b, ai + 1);
      var i2 = ai;
      if (ai >= 0 && bi > 0) {
        if (a === b) {
          return [ai, bi];
        }
        begs = [];
        left = str.length;
        while (i2 >= 0 && !result) {
          if (i2 == ai) {
            begs.push(i2);
            ai = str.indexOf(a, i2 + 1);
          } else if (begs.length == 1) {
            result = [begs.pop(), bi];
          } else {
            beg = begs.pop();
            if (beg < left) {
              left = beg;
              right = bi;
            }
            bi = str.indexOf(b, i2 + 1);
          }
          i2 = ai < bi && ai >= 0 ? ai : bi;
        }
        if (begs.length) {
          result = [left, right];
        }
      }
      return result;
    }
  }
});

// node_modules/brace-expansion/index.js
var require_brace_expansion = __commonJS({
  "node_modules/brace-expansion/index.js"(exports, module2) {
    var balanced = require_balanced_match();
    module2.exports = expandTop;
    var escSlash = "\0SLASH" + Math.random() + "\0";
    var escOpen = "\0OPEN" + Math.random() + "\0";
    var escClose = "\0CLOSE" + Math.random() + "\0";
    var escComma = "\0COMMA" + Math.random() + "\0";
    var escPeriod = "\0PERIOD" + Math.random() + "\0";
    function numeric(str) {
      return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
    }
    function escapeBraces(str) {
      return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
    }
    function unescapeBraces(str) {
      return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
    }
    function parseCommaParts(str) {
      if (!str)
        return [""];
      var parts = [];
      var m = balanced("{", "}", str);
      if (!m)
        return str.split(",");
      var pre = m.pre;
      var body = m.body;
      var post = m.post;
      var p = pre.split(",");
      p[p.length - 1] += "{" + body + "}";
      var postParts = parseCommaParts(post);
      if (post.length) {
        p[p.length - 1] += postParts.shift();
        p.push.apply(p, postParts);
      }
      parts.push.apply(parts, p);
      return parts;
    }
    function expandTop(str) {
      if (!str)
        return [];
      if (str.substr(0, 2) === "{}") {
        str = "\\{\\}" + str.substr(2);
      }
      return expand(escapeBraces(str), true).map(unescapeBraces);
    }
    function embrace(str) {
      return "{" + str + "}";
    }
    function isPadded(el) {
      return /^-?0\d/.test(el);
    }
    function lte(i2, y) {
      return i2 <= y;
    }
    function gte(i2, y) {
      return i2 >= y;
    }
    function expand(str, isTop) {
      var expansions = [];
      var m = balanced("{", "}", str);
      if (!m)
        return [str];
      var pre = m.pre;
      var post = m.post.length ? expand(m.post, false) : [""];
      if (/\$$/.test(m.pre)) {
        for (var k = 0; k < post.length; k++) {
          var expansion = pre + "{" + m.body + "}" + post[k];
          expansions.push(expansion);
        }
      } else {
        var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
        var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
        var isSequence = isNumericSequence || isAlphaSequence;
        var isOptions = m.body.indexOf(",") >= 0;
        if (!isSequence && !isOptions) {
          if (m.post.match(/,.*\}/)) {
            str = m.pre + "{" + m.body + escClose + m.post;
            return expand(str);
          }
          return [str];
        }
        var n;
        if (isSequence) {
          n = m.body.split(/\.\./);
        } else {
          n = parseCommaParts(m.body);
          if (n.length === 1) {
            n = expand(n[0], false).map(embrace);
            if (n.length === 1) {
              return post.map(function(p) {
                return m.pre + n[0] + p;
              });
            }
          }
        }
        var N;
        if (isSequence) {
          var x = numeric(n[0]);
          var y = numeric(n[1]);
          var width = Math.max(n[0].length, n[1].length);
          var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
          var test = lte;
          var reverse = y < x;
          if (reverse) {
            incr *= -1;
            test = gte;
          }
          var pad = n.some(isPadded);
          N = [];
          for (var i2 = x; test(i2, y); i2 += incr) {
            var c;
            if (isAlphaSequence) {
              c = String.fromCharCode(i2);
              if (c === "\\")
                c = "";
            } else {
              c = String(i2);
              if (pad) {
                var need = width - c.length;
                if (need > 0) {
                  var z = new Array(need + 1).join("0");
                  if (i2 < 0)
                    c = "-" + z + c.slice(1);
                  else
                    c = z + c;
                }
              }
            }
            N.push(c);
          }
        } else {
          N = [];
          for (var j = 0; j < n.length; j++) {
            N.push.apply(N, expand(n[j], false));
          }
        }
        for (var j = 0; j < N.length; j++) {
          for (var k = 0; k < post.length; k++) {
            var expansion = pre + N[j] + post[k];
            if (!isTop || isSequence || expansion)
              expansions.push(expansion);
          }
        }
      }
      return expansions;
    }
  }
});

// node_modules/minimatch/minimatch.js
var require_minimatch = __commonJS({
  "node_modules/minimatch/minimatch.js"(exports, module2) {
    var minimatch = module2.exports = (p, pattern, options = {}) => {
      assertValidPattern(pattern);
      if (!options.nocomment && pattern.charAt(0) === "#") {
        return false;
      }
      return new Minimatch(pattern, options).match(p);
    };
    module2.exports = minimatch;
    var path = require_path();
    minimatch.sep = path.sep;
    var GLOBSTAR = Symbol("globstar **");
    minimatch.GLOBSTAR = GLOBSTAR;
    var expand = require_brace_expansion();
    var plTypes = {
      "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
      "?": { open: "(?:", close: ")?" },
      "+": { open: "(?:", close: ")+" },
      "*": { open: "(?:", close: ")*" },
      "@": { open: "(?:", close: ")" }
    };
    var qmark = "[^/]";
    var star = qmark + "*?";
    var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
    var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
    var charSet = (s) => s.split("").reduce((set, c) => {
      set[c] = true;
      return set;
    }, {});
    var reSpecials = charSet("().*{}+?[]^$\\!");
    var addPatternStartSet = charSet("[.(");
    var slashSplit = /\/+/;
    minimatch.filter = (pattern, options = {}) => (p, i2, list) => minimatch(p, pattern, options);
    var ext = (a, b = {}) => {
      const t = {};
      Object.keys(a).forEach((k) => t[k] = a[k]);
      Object.keys(b).forEach((k) => t[k] = b[k]);
      return t;
    };
    minimatch.defaults = (def) => {
      if (!def || typeof def !== "object" || !Object.keys(def).length) {
        return minimatch;
      }
      const orig = minimatch;
      const m = (p, pattern, options) => orig(p, pattern, ext(def, options));
      m.Minimatch = class Minimatch extends orig.Minimatch {
        constructor(pattern, options) {
          super(pattern, ext(def, options));
        }
      };
      m.Minimatch.defaults = (options) => orig.defaults(ext(def, options)).Minimatch;
      m.filter = (pattern, options) => orig.filter(pattern, ext(def, options));
      m.defaults = (options) => orig.defaults(ext(def, options));
      m.makeRe = (pattern, options) => orig.makeRe(pattern, ext(def, options));
      m.braceExpand = (pattern, options) => orig.braceExpand(pattern, ext(def, options));
      m.match = (list, pattern, options) => orig.match(list, pattern, ext(def, options));
      return m;
    };
    minimatch.braceExpand = (pattern, options) => braceExpand(pattern, options);
    var braceExpand = (pattern, options = {}) => {
      assertValidPattern(pattern);
      if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
        return [pattern];
      }
      return expand(pattern);
    };
    var MAX_PATTERN_LENGTH = 1024 * 64;
    var assertValidPattern = (pattern) => {
      if (typeof pattern !== "string") {
        throw new TypeError("invalid pattern");
      }
      if (pattern.length > MAX_PATTERN_LENGTH) {
        throw new TypeError("pattern is too long");
      }
    };
    var SUBPARSE = Symbol("subparse");
    minimatch.makeRe = (pattern, options) => new Minimatch(pattern, options || {}).makeRe();
    minimatch.match = (list, pattern, options = {}) => {
      const mm = new Minimatch(pattern, options);
      list = list.filter((f) => mm.match(f));
      if (mm.options.nonull && !list.length) {
        list.push(pattern);
      }
      return list;
    };
    var globUnescape = (s) => s.replace(/\\(.)/g, "$1");
    var charUnescape = (s) => s.replace(/\\([^-\]])/g, "$1");
    var regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    var braExpEscape = (s) => s.replace(/[[\]\\]/g, "\\$&");
    var Minimatch = class {
      constructor(pattern, options) {
        assertValidPattern(pattern);
        if (!options)
          options = {};
        this.options = options;
        this.set = [];
        this.pattern = pattern;
        this.windowsPathsNoEscape = !!options.windowsPathsNoEscape || options.allowWindowsEscape === false;
        if (this.windowsPathsNoEscape) {
          this.pattern = this.pattern.replace(/\\/g, "/");
        }
        this.regexp = null;
        this.negate = false;
        this.comment = false;
        this.empty = false;
        this.partial = !!options.partial;
        this.make();
      }
      debug() {
      }
      make() {
        const pattern = this.pattern;
        const options = this.options;
        if (!options.nocomment && pattern.charAt(0) === "#") {
          this.comment = true;
          return;
        }
        if (!pattern) {
          this.empty = true;
          return;
        }
        this.parseNegate();
        let set = this.globSet = this.braceExpand();
        if (options.debug)
          this.debug = (...args) => console.error(...args);
        this.debug(this.pattern, set);
        set = this.globParts = set.map((s) => s.split(slashSplit));
        this.debug(this.pattern, set);
        set = set.map((s, si, set2) => s.map(this.parse, this));
        this.debug(this.pattern, set);
        set = set.filter((s) => s.indexOf(false) === -1);
        this.debug(this.pattern, set);
        this.set = set;
      }
      parseNegate() {
        if (this.options.nonegate)
          return;
        const pattern = this.pattern;
        let negate = false;
        let negateOffset = 0;
        for (let i2 = 0; i2 < pattern.length && pattern.charAt(i2) === "!"; i2++) {
          negate = !negate;
          negateOffset++;
        }
        if (negateOffset)
          this.pattern = pattern.slice(negateOffset);
        this.negate = negate;
      }
      matchOne(file, pattern, partial) {
        var options = this.options;
        this.debug(
          "matchOne",
          { "this": this, file, pattern }
        );
        this.debug("matchOne", file.length, pattern.length);
        for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
          this.debug("matchOne loop");
          var p = pattern[pi];
          var f = file[fi];
          this.debug(pattern, p, f);
          if (p === false)
            return false;
          if (p === GLOBSTAR) {
            this.debug("GLOBSTAR", [pattern, p, f]);
            var fr = fi;
            var pr = pi + 1;
            if (pr === pl) {
              this.debug("** at the end");
              for (; fi < fl; fi++) {
                if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".")
                  return false;
              }
              return true;
            }
            while (fr < fl) {
              var swallowee = file[fr];
              this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
              if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
                this.debug("globstar found match!", fr, fl, swallowee);
                return true;
              } else {
                if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
                  this.debug("dot detected!", file, fr, pattern, pr);
                  break;
                }
                this.debug("globstar swallow a segment, and continue");
                fr++;
              }
            }
            if (partial) {
              this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
              if (fr === fl)
                return true;
            }
            return false;
          }
          var hit;
          if (typeof p === "string") {
            hit = f === p;
            this.debug("string match", p, f, hit);
          } else {
            hit = f.match(p);
            this.debug("pattern match", p, f, hit);
          }
          if (!hit)
            return false;
        }
        if (fi === fl && pi === pl) {
          return true;
        } else if (fi === fl) {
          return partial;
        } else if (pi === pl) {
          return fi === fl - 1 && file[fi] === "";
        }
        throw new Error("wtf?");
      }
      braceExpand() {
        return braceExpand(this.pattern, this.options);
      }
      parse(pattern, isSub) {
        assertValidPattern(pattern);
        const options = this.options;
        if (pattern === "**") {
          if (!options.noglobstar)
            return GLOBSTAR;
          else
            pattern = "*";
        }
        if (pattern === "")
          return "";
        let re = "";
        let hasMagic = !!options.nocase;
        let escaping = false;
        const patternListStack = [];
        const negativeLists = [];
        let stateChar;
        let inClass = false;
        let reClassStart = -1;
        let classStart = -1;
        let cs;
        let pl;
        let sp;
        const patternStart = pattern.charAt(0) === "." ? "" : options.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
        const clearStateChar = () => {
          if (stateChar) {
            switch (stateChar) {
              case "*":
                re += star;
                hasMagic = true;
                break;
              case "?":
                re += qmark;
                hasMagic = true;
                break;
              default:
                re += "\\" + stateChar;
                break;
            }
            this.debug("clearStateChar %j %j", stateChar, re);
            stateChar = false;
          }
        };
        for (let i2 = 0, c; i2 < pattern.length && (c = pattern.charAt(i2)); i2++) {
          this.debug("%s	%s %s %j", pattern, i2, re, c);
          if (escaping) {
            if (c === "/") {
              return false;
            }
            if (reSpecials[c]) {
              re += "\\";
            }
            re += c;
            escaping = false;
            continue;
          }
          switch (c) {
            case "/": {
              return false;
            }
            case "\\":
              if (inClass && pattern.charAt(i2 + 1) === "-") {
                re += c;
                continue;
              }
              clearStateChar();
              escaping = true;
              continue;
            case "?":
            case "*":
            case "+":
            case "@":
            case "!":
              this.debug("%s	%s %s %j <-- stateChar", pattern, i2, re, c);
              if (inClass) {
                this.debug("  in class");
                if (c === "!" && i2 === classStart + 1)
                  c = "^";
                re += c;
                continue;
              }
              this.debug("call clearStateChar %j", stateChar);
              clearStateChar();
              stateChar = c;
              if (options.noext)
                clearStateChar();
              continue;
            case "(":
              if (inClass) {
                re += "(";
                continue;
              }
              if (!stateChar) {
                re += "\\(";
                continue;
              }
              patternListStack.push({
                type: stateChar,
                start: i2 - 1,
                reStart: re.length,
                open: plTypes[stateChar].open,
                close: plTypes[stateChar].close
              });
              re += stateChar === "!" ? "(?:(?!(?:" : "(?:";
              this.debug("plType %j %j", stateChar, re);
              stateChar = false;
              continue;
            case ")":
              if (inClass || !patternListStack.length) {
                re += "\\)";
                continue;
              }
              clearStateChar();
              hasMagic = true;
              pl = patternListStack.pop();
              re += pl.close;
              if (pl.type === "!") {
                negativeLists.push(pl);
              }
              pl.reEnd = re.length;
              continue;
            case "|":
              if (inClass || !patternListStack.length) {
                re += "\\|";
                continue;
              }
              clearStateChar();
              re += "|";
              continue;
            case "[":
              clearStateChar();
              if (inClass) {
                re += "\\" + c;
                continue;
              }
              inClass = true;
              classStart = i2;
              reClassStart = re.length;
              re += c;
              continue;
            case "]":
              if (i2 === classStart + 1 || !inClass) {
                re += "\\" + c;
                continue;
              }
              cs = pattern.substring(classStart + 1, i2);
              try {
                RegExp("[" + braExpEscape(charUnescape(cs)) + "]");
                re += c;
              } catch (er) {
                re = re.substring(0, reClassStart) + "(?:$.)";
              }
              hasMagic = true;
              inClass = false;
              continue;
            default:
              clearStateChar();
              if (reSpecials[c] && !(c === "^" && inClass)) {
                re += "\\";
              }
              re += c;
              break;
          }
        }
        if (inClass) {
          cs = pattern.slice(classStart + 1);
          sp = this.parse(cs, SUBPARSE);
          re = re.substring(0, reClassStart) + "\\[" + sp[0];
          hasMagic = hasMagic || sp[1];
        }
        for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
          let tail;
          tail = re.slice(pl.reStart + pl.open.length);
          this.debug("setting tail", re, pl);
          tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, (_2, $1, $2) => {
            if (!$2) {
              $2 = "\\";
            }
            return $1 + $1 + $2 + "|";
          });
          this.debug("tail=%j\n   %s", tail, tail, pl, re);
          const t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
          hasMagic = true;
          re = re.slice(0, pl.reStart) + t + "\\(" + tail;
        }
        clearStateChar();
        if (escaping) {
          re += "\\\\";
        }
        const addPatternStart = addPatternStartSet[re.charAt(0)];
        for (let n = negativeLists.length - 1; n > -1; n--) {
          const nl = negativeLists[n];
          const nlBefore = re.slice(0, nl.reStart);
          const nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
          let nlAfter = re.slice(nl.reEnd);
          const nlLast = re.slice(nl.reEnd - 8, nl.reEnd) + nlAfter;
          const openParensBefore = nlBefore.split("(").length - 1;
          let cleanAfter = nlAfter;
          for (let i2 = 0; i2 < openParensBefore; i2++) {
            cleanAfter = cleanAfter.replace(/\)[+*?]?/, "");
          }
          nlAfter = cleanAfter;
          const dollar = nlAfter === "" && isSub !== SUBPARSE ? "$" : "";
          re = nlBefore + nlFirst + nlAfter + dollar + nlLast;
        }
        if (re !== "" && hasMagic) {
          re = "(?=.)" + re;
        }
        if (addPatternStart) {
          re = patternStart + re;
        }
        if (isSub === SUBPARSE) {
          return [re, hasMagic];
        }
        if (!hasMagic) {
          return globUnescape(pattern);
        }
        const flags = options.nocase ? "i" : "";
        try {
          return Object.assign(new RegExp("^" + re + "$", flags), {
            _glob: pattern,
            _src: re
          });
        } catch (er) {
          return new RegExp("$.");
        }
      }
      makeRe() {
        if (this.regexp || this.regexp === false)
          return this.regexp;
        const set = this.set;
        if (!set.length) {
          this.regexp = false;
          return this.regexp;
        }
        const options = this.options;
        const twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
        const flags = options.nocase ? "i" : "";
        let re = set.map((pattern) => {
          pattern = pattern.map(
            (p) => typeof p === "string" ? regExpEscape(p) : p === GLOBSTAR ? GLOBSTAR : p._src
          ).reduce((set2, p) => {
            if (!(set2[set2.length - 1] === GLOBSTAR && p === GLOBSTAR)) {
              set2.push(p);
            }
            return set2;
          }, []);
          pattern.forEach((p, i2) => {
            if (p !== GLOBSTAR || pattern[i2 - 1] === GLOBSTAR) {
              return;
            }
            if (i2 === 0) {
              if (pattern.length > 1) {
                pattern[i2 + 1] = "(?:\\/|" + twoStar + "\\/)?" + pattern[i2 + 1];
              } else {
                pattern[i2] = twoStar;
              }
            } else if (i2 === pattern.length - 1) {
              pattern[i2 - 1] += "(?:\\/|" + twoStar + ")?";
            } else {
              pattern[i2 - 1] += "(?:\\/|\\/" + twoStar + "\\/)" + pattern[i2 + 1];
              pattern[i2 + 1] = GLOBSTAR;
            }
          });
          return pattern.filter((p) => p !== GLOBSTAR).join("/");
        }).join("|");
        re = "^(?:" + re + ")$";
        if (this.negate)
          re = "^(?!" + re + ").*$";
        try {
          this.regexp = new RegExp(re, flags);
        } catch (ex) {
          this.regexp = false;
        }
        return this.regexp;
      }
      match(f, partial = this.partial) {
        this.debug("match", f, this.pattern);
        if (this.comment)
          return false;
        if (this.empty)
          return f === "";
        if (f === "/" && partial)
          return true;
        const options = this.options;
        if (path.sep !== "/") {
          f = f.split(path.sep).join("/");
        }
        f = f.split(slashSplit);
        this.debug(this.pattern, "split", f);
        const set = this.set;
        this.debug(this.pattern, "set", set);
        let filename;
        for (let i2 = f.length - 1; i2 >= 0; i2--) {
          filename = f[i2];
          if (filename)
            break;
        }
        for (let i2 = 0; i2 < set.length; i2++) {
          const pattern = set[i2];
          let file = f;
          if (options.matchBase && pattern.length === 1) {
            file = [filename];
          }
          const hit = this.matchOne(file, pattern, partial);
          if (hit) {
            if (options.flipNegate)
              return true;
            return !this.negate;
          }
        }
        if (options.flipNegate)
          return false;
        return this.negate;
      }
      static defaults(def) {
        return minimatch.defaults(def).Minimatch;
      }
    };
    minimatch.Minimatch = Minimatch;
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports, module2) {
    if (typeof Object.create === "function") {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/inherits/inherits.js"(exports, module2) {
    try {
      util = require("util");
      if (typeof util.inherits !== "function")
        throw "";
      module2.exports = util.inherits;
    } catch (e2) {
      module2.exports = require_inherits_browser();
    }
    var util;
  }
});

// node_modules/glob/common.js
var require_common = __commonJS({
  "node_modules/glob/common.js"(exports) {
    exports.setopts = setopts;
    exports.ownProp = ownProp;
    exports.makeAbs = makeAbs;
    exports.finish = finish;
    exports.mark = mark;
    exports.isIgnored = isIgnored;
    exports.childrenIgnored = childrenIgnored;
    function ownProp(obj, field) {
      return Object.prototype.hasOwnProperty.call(obj, field);
    }
    var fs4 = require("fs");
    var path = require("path");
    var minimatch = require_minimatch();
    var isAbsolute = require("path").isAbsolute;
    var Minimatch = minimatch.Minimatch;
    function alphasort(a, b) {
      return a.localeCompare(b, "en");
    }
    function setupIgnores(self, options) {
      self.ignore = options.ignore || [];
      if (!Array.isArray(self.ignore))
        self.ignore = [self.ignore];
      if (self.ignore.length) {
        self.ignore = self.ignore.map(ignoreMap);
      }
    }
    function ignoreMap(pattern) {
      var gmatcher = null;
      if (pattern.slice(-3) === "/**") {
        var gpattern = pattern.replace(/(\/\*\*)+$/, "");
        gmatcher = new Minimatch(gpattern, { dot: true });
      }
      return {
        matcher: new Minimatch(pattern, { dot: true }),
        gmatcher
      };
    }
    function setopts(self, pattern, options) {
      if (!options)
        options = {};
      if (options.matchBase && -1 === pattern.indexOf("/")) {
        if (options.noglobstar) {
          throw new Error("base matching requires globstar");
        }
        pattern = "**/" + pattern;
      }
      self.silent = !!options.silent;
      self.pattern = pattern;
      self.strict = options.strict !== false;
      self.realpath = !!options.realpath;
      self.realpathCache = options.realpathCache || /* @__PURE__ */ Object.create(null);
      self.follow = !!options.follow;
      self.dot = !!options.dot;
      self.mark = !!options.mark;
      self.nodir = !!options.nodir;
      if (self.nodir)
        self.mark = true;
      self.sync = !!options.sync;
      self.nounique = !!options.nounique;
      self.nonull = !!options.nonull;
      self.nosort = !!options.nosort;
      self.nocase = !!options.nocase;
      self.stat = !!options.stat;
      self.noprocess = !!options.noprocess;
      self.absolute = !!options.absolute;
      self.fs = options.fs || fs4;
      self.maxLength = options.maxLength || Infinity;
      self.cache = options.cache || /* @__PURE__ */ Object.create(null);
      self.statCache = options.statCache || /* @__PURE__ */ Object.create(null);
      self.symlinks = options.symlinks || /* @__PURE__ */ Object.create(null);
      setupIgnores(self, options);
      self.changedCwd = false;
      var cwd = process.cwd();
      if (!ownProp(options, "cwd"))
        self.cwd = path.resolve(cwd);
      else {
        self.cwd = path.resolve(options.cwd);
        self.changedCwd = self.cwd !== cwd;
      }
      self.root = options.root || path.resolve(self.cwd, "/");
      self.root = path.resolve(self.root);
      self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd);
      self.nomount = !!options.nomount;
      if (process.platform === "win32") {
        self.root = self.root.replace(/\\/g, "/");
        self.cwd = self.cwd.replace(/\\/g, "/");
        self.cwdAbs = self.cwdAbs.replace(/\\/g, "/");
      }
      options.nonegate = true;
      options.nocomment = true;
      options.allowWindowsEscape = true;
      self.minimatch = new Minimatch(pattern, options);
      self.options = self.minimatch.options;
    }
    function finish(self) {
      var nou = self.nounique;
      var all = nou ? [] : /* @__PURE__ */ Object.create(null);
      for (var i2 = 0, l = self.matches.length; i2 < l; i2++) {
        var matches = self.matches[i2];
        if (!matches || Object.keys(matches).length === 0) {
          if (self.nonull) {
            var literal = self.minimatch.globSet[i2];
            if (nou)
              all.push(literal);
            else
              all[literal] = true;
          }
        } else {
          var m = Object.keys(matches);
          if (nou)
            all.push.apply(all, m);
          else
            m.forEach(function(m2) {
              all[m2] = true;
            });
        }
      }
      if (!nou)
        all = Object.keys(all);
      if (!self.nosort)
        all = all.sort(alphasort);
      if (self.mark) {
        for (var i2 = 0; i2 < all.length; i2++) {
          all[i2] = self._mark(all[i2]);
        }
        if (self.nodir) {
          all = all.filter(function(e2) {
            var notDir = !/\/$/.test(e2);
            var c = self.cache[e2] || self.cache[makeAbs(self, e2)];
            if (notDir && c)
              notDir = c !== "DIR" && !Array.isArray(c);
            return notDir;
          });
        }
      }
      if (self.ignore.length)
        all = all.filter(function(m2) {
          return !isIgnored(self, m2);
        });
      self.found = all;
    }
    function mark(self, p) {
      var abs = makeAbs(self, p);
      var c = self.cache[abs];
      var m = p;
      if (c) {
        var isDir = c === "DIR" || Array.isArray(c);
        var slash = p.slice(-1) === "/";
        if (isDir && !slash)
          m += "/";
        else if (!isDir && slash)
          m = m.slice(0, -1);
        if (m !== p) {
          var mabs = makeAbs(self, m);
          self.statCache[mabs] = self.statCache[abs];
          self.cache[mabs] = self.cache[abs];
        }
      }
      return m;
    }
    function makeAbs(self, f) {
      var abs = f;
      if (f.charAt(0) === "/") {
        abs = path.join(self.root, f);
      } else if (isAbsolute(f) || f === "") {
        abs = f;
      } else if (self.changedCwd) {
        abs = path.resolve(self.cwd, f);
      } else {
        abs = path.resolve(f);
      }
      if (process.platform === "win32")
        abs = abs.replace(/\\/g, "/");
      return abs;
    }
    function isIgnored(self, path2) {
      if (!self.ignore.length)
        return false;
      return self.ignore.some(function(item) {
        return item.matcher.match(path2) || !!(item.gmatcher && item.gmatcher.match(path2));
      });
    }
    function childrenIgnored(self, path2) {
      if (!self.ignore.length)
        return false;
      return self.ignore.some(function(item) {
        return !!(item.gmatcher && item.gmatcher.match(path2));
      });
    }
  }
});

// node_modules/glob/sync.js
var require_sync = __commonJS({
  "node_modules/glob/sync.js"(exports, module2) {
    module2.exports = globSync;
    globSync.GlobSync = GlobSync;
    var rp = require_fs();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var Glob = require_glob().Glob;
    var util = require("util");
    var path = require("path");
    var assert = require("assert");
    var isAbsolute = require("path").isAbsolute;
    var common = require_common();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    function globSync(pattern, options) {
      if (typeof options === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      return new GlobSync(pattern, options).found;
    }
    function GlobSync(pattern, options) {
      if (!pattern)
        throw new Error("must provide pattern");
      if (typeof options === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      if (!(this instanceof GlobSync))
        return new GlobSync(pattern, options);
      setopts(this, pattern, options);
      if (this.noprocess)
        return this;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      for (var i2 = 0; i2 < n; i2++) {
        this._process(this.minimatch.set[i2], i2, false);
      }
      this._finish();
    }
    GlobSync.prototype._finish = function() {
      assert.ok(this instanceof GlobSync);
      if (this.realpath) {
        var self = this;
        this.matches.forEach(function(matchset, index) {
          var set = self.matches[index] = /* @__PURE__ */ Object.create(null);
          for (var p in matchset) {
            try {
              p = self._makeAbs(p);
              var real = rp.realpathSync(p, self.realpathCache);
              set[real] = true;
            } catch (er) {
              if (er.syscall === "stat")
                set[self._makeAbs(p)] = true;
              else
                throw er;
            }
          }
        });
      }
      common.finish(this);
    };
    GlobSync.prototype._process = function(pattern, index, inGlobStar) {
      assert.ok(this instanceof GlobSync);
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute(prefix) || isAbsolute(pattern.map(function(p) {
        return typeof p === "string" ? p : "[*]";
      }).join("/"))) {
        if (!prefix || !isAbsolute(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return;
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
    };
    GlobSync.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i2 = 0; i2 < entries.length; i2++) {
        var e2 = entries[i2];
        if (e2.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e2.match(pn);
          } else {
            m = e2.match(pn);
          }
          if (m)
            matchedEntries.push(e2);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return;
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = /* @__PURE__ */ Object.create(null);
        for (var i2 = 0; i2 < len; i2++) {
          var e2 = matchedEntries[i2];
          if (prefix) {
            if (prefix.slice(-1) !== "/")
              e2 = prefix + "/" + e2;
            else
              e2 = prefix + e2;
          }
          if (e2.charAt(0) === "/" && !this.nomount) {
            e2 = path.join(this.root, e2);
          }
          this._emitMatch(index, e2);
        }
        return;
      }
      remain.shift();
      for (var i2 = 0; i2 < len; i2++) {
        var e2 = matchedEntries[i2];
        var newPattern;
        if (prefix)
          newPattern = [prefix, e2];
        else
          newPattern = [e2];
        this._process(newPattern.concat(remain), index, inGlobStar);
      }
    };
    GlobSync.prototype._emitMatch = function(index, e2) {
      if (isIgnored(this, e2))
        return;
      var abs = this._makeAbs(e2);
      if (this.mark)
        e2 = this._mark(e2);
      if (this.absolute) {
        e2 = abs;
      }
      if (this.matches[index][e2])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e2] = true;
      if (this.stat)
        this._stat(e2);
    };
    GlobSync.prototype._readdirInGlobStar = function(abs) {
      if (this.follow)
        return this._readdir(abs, false);
      var entries;
      var lstat;
      var stat;
      try {
        lstat = this.fs.lstatSync(abs);
      } catch (er) {
        if (er.code === "ENOENT") {
          return null;
        }
      }
      var isSym = lstat && lstat.isSymbolicLink();
      this.symlinks[abs] = isSym;
      if (!isSym && lstat && !lstat.isDirectory())
        this.cache[abs] = "FILE";
      else
        entries = this._readdir(abs, false);
      return entries;
    };
    GlobSync.prototype._readdir = function(abs, inGlobStar) {
      var entries;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return null;
        if (Array.isArray(c))
          return c;
      }
      try {
        return this._readdirEntries(abs, this.fs.readdirSync(abs));
      } catch (er) {
        this._readdirError(abs, er);
        return null;
      }
    };
    GlobSync.prototype._readdirEntries = function(abs, entries) {
      if (!this.mark && !this.stat) {
        for (var i2 = 0; i2 < entries.length; i2++) {
          var e2 = entries[i2];
          if (abs === "/")
            e2 = abs + e2;
          else
            e2 = abs + "/" + e2;
          this.cache[e2] = true;
        }
      }
      this.cache[abs] = entries;
      return entries;
    };
    GlobSync.prototype._readdirError = function(f, er) {
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + " invalid cwd " + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            throw error;
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict)
            throw er;
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
    };
    GlobSync.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false);
      var len = entries.length;
      var isSym = this.symlinks[abs];
      if (isSym && inGlobStar)
        return;
      for (var i2 = 0; i2 < len; i2++) {
        var e2 = entries[i2];
        if (e2.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i2], remainWithoutGlobStar);
        this._process(instead, index, true);
        var below = gspref.concat(entries[i2], remain);
        this._process(below, index, true);
      }
    };
    GlobSync.prototype._processSimple = function(prefix, index) {
      var exists = this._stat(prefix);
      if (!this.matches[index])
        this.matches[index] = /* @__PURE__ */ Object.create(null);
      if (!exists)
        return;
      if (prefix && isAbsolute(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path.join(this.root, prefix);
        } else {
          prefix = path.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
    };
    GlobSync.prototype._stat = function(f) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return false;
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return c;
        if (needDir && c === "FILE")
          return false;
      }
      var exists;
      var stat = this.statCache[abs];
      if (!stat) {
        var lstat;
        try {
          lstat = this.fs.lstatSync(abs);
        } catch (er) {
          if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
            this.statCache[abs] = false;
            return false;
          }
        }
        if (lstat && lstat.isSymbolicLink()) {
          try {
            stat = this.fs.statSync(abs);
          } catch (er) {
            stat = lstat;
          }
        } else {
          stat = lstat;
        }
      }
      this.statCache[abs] = stat;
      var c = true;
      if (stat)
        c = stat.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return false;
      return c;
    };
    GlobSync.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    GlobSync.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
  }
});

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS({
  "node_modules/wrappy/wrappy.js"(exports, module2) {
    module2.exports = wrappy;
    function wrappy(fn, cb) {
      if (fn && cb)
        return wrappy(fn)(cb);
      if (typeof fn !== "function")
        throw new TypeError("need wrapper function");
      Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k];
      });
      return wrapper;
      function wrapper() {
        var args = new Array(arguments.length);
        for (var i2 = 0; i2 < args.length; i2++) {
          args[i2] = arguments[i2];
        }
        var ret = fn.apply(this, args);
        var cb2 = args[args.length - 1];
        if (typeof ret === "function" && ret !== cb2) {
          Object.keys(cb2).forEach(function(k) {
            ret[k] = cb2[k];
          });
        }
        return ret;
      }
    }
  }
});

// node_modules/once/once.js
var require_once = __commonJS({
  "node_modules/once/once.js"(exports, module2) {
    var wrappy = require_wrappy();
    module2.exports = wrappy(once);
    module2.exports.strict = wrappy(onceStrict);
    once.proto = once(function() {
      Object.defineProperty(Function.prototype, "once", {
        value: function() {
          return once(this);
        },
        configurable: true
      });
      Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
          return onceStrict(this);
        },
        configurable: true
      });
    });
    function once(fn) {
      var f = function() {
        if (f.called)
          return f.value;
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      f.called = false;
      return f;
    }
    function onceStrict(fn) {
      var f = function() {
        if (f.called)
          throw new Error(f.onceError);
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      var name2 = fn.name || "Function wrapped with `once`";
      f.onceError = name2 + " shouldn't be called more than once";
      f.called = false;
      return f;
    }
  }
});

// node_modules/inflight/inflight.js
var require_inflight = __commonJS({
  "node_modules/inflight/inflight.js"(exports, module2) {
    var wrappy = require_wrappy();
    var reqs = /* @__PURE__ */ Object.create(null);
    var once = require_once();
    module2.exports = wrappy(inflight);
    function inflight(key, cb) {
      if (reqs[key]) {
        reqs[key].push(cb);
        return null;
      } else {
        reqs[key] = [cb];
        return makeres(key);
      }
    }
    function makeres(key) {
      return once(function RES() {
        var cbs = reqs[key];
        var len = cbs.length;
        var args = slice(arguments);
        try {
          for (var i2 = 0; i2 < len; i2++) {
            cbs[i2].apply(null, args);
          }
        } finally {
          if (cbs.length > len) {
            cbs.splice(0, len);
            process.nextTick(function() {
              RES.apply(null, args);
            });
          } else {
            delete reqs[key];
          }
        }
      });
    }
    function slice(args) {
      var length = args.length;
      var array = [];
      for (var i2 = 0; i2 < length; i2++)
        array[i2] = args[i2];
      return array;
    }
  }
});

// node_modules/glob/glob.js
var require_glob = __commonJS({
  "node_modules/glob/glob.js"(exports, module2) {
    module2.exports = glob2;
    var rp = require_fs();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var inherits = require_inherits();
    var EE = require("events").EventEmitter;
    var path = require("path");
    var assert = require("assert");
    var isAbsolute = require("path").isAbsolute;
    var globSync = require_sync();
    var common = require_common();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var inflight = require_inflight();
    var util = require("util");
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    var once = require_once();
    function glob2(pattern, options, cb) {
      if (typeof options === "function")
        cb = options, options = {};
      if (!options)
        options = {};
      if (options.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return globSync(pattern, options);
      }
      return new Glob(pattern, options, cb);
    }
    glob2.sync = globSync;
    var GlobSync = glob2.GlobSync = globSync.GlobSync;
    glob2.glob = glob2;
    function extend(origin, add) {
      if (add === null || typeof add !== "object") {
        return origin;
      }
      var keys = Object.keys(add);
      var i2 = keys.length;
      while (i2--) {
        origin[keys[i2]] = add[keys[i2]];
      }
      return origin;
    }
    glob2.hasMagic = function(pattern, options_) {
      var options = extend({}, options_);
      options.noprocess = true;
      var g = new Glob(pattern, options);
      var set = g.minimatch.set;
      if (!pattern)
        return false;
      if (set.length > 1)
        return true;
      for (var j = 0; j < set[0].length; j++) {
        if (typeof set[0][j] !== "string")
          return true;
      }
      return false;
    };
    glob2.Glob = Glob;
    inherits(Glob, EE);
    function Glob(pattern, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = null;
      }
      if (options && options.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return new GlobSync(pattern, options);
      }
      if (!(this instanceof Glob))
        return new Glob(pattern, options, cb);
      setopts(this, pattern, options);
      this._didRealPath = false;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      if (typeof cb === "function") {
        cb = once(cb);
        this.on("error", cb);
        this.on("end", function(matches) {
          cb(null, matches);
        });
      }
      var self = this;
      this._processing = 0;
      this._emitQueue = [];
      this._processQueue = [];
      this.paused = false;
      if (this.noprocess)
        return this;
      if (n === 0)
        return done();
      var sync = true;
      for (var i2 = 0; i2 < n; i2++) {
        this._process(this.minimatch.set[i2], i2, false, done);
      }
      sync = false;
      function done() {
        --self._processing;
        if (self._processing <= 0) {
          if (sync) {
            process.nextTick(function() {
              self._finish();
            });
          } else {
            self._finish();
          }
        }
      }
    }
    Glob.prototype._finish = function() {
      assert(this instanceof Glob);
      if (this.aborted)
        return;
      if (this.realpath && !this._didRealpath)
        return this._realpath();
      common.finish(this);
      this.emit("end", this.found);
    };
    Glob.prototype._realpath = function() {
      if (this._didRealpath)
        return;
      this._didRealpath = true;
      var n = this.matches.length;
      if (n === 0)
        return this._finish();
      var self = this;
      for (var i2 = 0; i2 < this.matches.length; i2++)
        this._realpathSet(i2, next);
      function next() {
        if (--n === 0)
          self._finish();
      }
    };
    Glob.prototype._realpathSet = function(index, cb) {
      var matchset = this.matches[index];
      if (!matchset)
        return cb();
      var found = Object.keys(matchset);
      var self = this;
      var n = found.length;
      if (n === 0)
        return cb();
      var set = this.matches[index] = /* @__PURE__ */ Object.create(null);
      found.forEach(function(p, i2) {
        p = self._makeAbs(p);
        rp.realpath(p, self.realpathCache, function(er, real) {
          if (!er)
            set[real] = true;
          else if (er.syscall === "stat")
            set[p] = true;
          else
            self.emit("error", er);
          if (--n === 0) {
            self.matches[index] = set;
            cb();
          }
        });
      });
    };
    Glob.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    Glob.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
    Glob.prototype.abort = function() {
      this.aborted = true;
      this.emit("abort");
    };
    Glob.prototype.pause = function() {
      if (!this.paused) {
        this.paused = true;
        this.emit("pause");
      }
    };
    Glob.prototype.resume = function() {
      if (this.paused) {
        this.emit("resume");
        this.paused = false;
        if (this._emitQueue.length) {
          var eq = this._emitQueue.slice(0);
          this._emitQueue.length = 0;
          for (var i2 = 0; i2 < eq.length; i2++) {
            var e2 = eq[i2];
            this._emitMatch(e2[0], e2[1]);
          }
        }
        if (this._processQueue.length) {
          var pq = this._processQueue.slice(0);
          this._processQueue.length = 0;
          for (var i2 = 0; i2 < pq.length; i2++) {
            var p = pq[i2];
            this._processing--;
            this._process(p[0], p[1], p[2], p[3]);
          }
        }
      }
    };
    Glob.prototype._process = function(pattern, index, inGlobStar, cb) {
      assert(this instanceof Glob);
      assert(typeof cb === "function");
      if (this.aborted)
        return;
      this._processing++;
      if (this.paused) {
        this._processQueue.push([pattern, index, inGlobStar, cb]);
        return;
      }
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index, cb);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute(prefix) || isAbsolute(pattern.map(function(p) {
        return typeof p === "string" ? p : "[*]";
      }).join("/"))) {
        if (!prefix || !isAbsolute(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return cb();
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
    };
    Glob.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processReaddir2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i2 = 0; i2 < entries.length; i2++) {
        var e2 = entries[i2];
        if (e2.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e2.match(pn);
          } else {
            m = e2.match(pn);
          }
          if (m)
            matchedEntries.push(e2);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return cb();
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = /* @__PURE__ */ Object.create(null);
        for (var i2 = 0; i2 < len; i2++) {
          var e2 = matchedEntries[i2];
          if (prefix) {
            if (prefix !== "/")
              e2 = prefix + "/" + e2;
            else
              e2 = prefix + e2;
          }
          if (e2.charAt(0) === "/" && !this.nomount) {
            e2 = path.join(this.root, e2);
          }
          this._emitMatch(index, e2);
        }
        return cb();
      }
      remain.shift();
      for (var i2 = 0; i2 < len; i2++) {
        var e2 = matchedEntries[i2];
        var newPattern;
        if (prefix) {
          if (prefix !== "/")
            e2 = prefix + "/" + e2;
          else
            e2 = prefix + e2;
        }
        this._process([e2].concat(remain), index, inGlobStar, cb);
      }
      cb();
    };
    Glob.prototype._emitMatch = function(index, e2) {
      if (this.aborted)
        return;
      if (isIgnored(this, e2))
        return;
      if (this.paused) {
        this._emitQueue.push([index, e2]);
        return;
      }
      var abs = isAbsolute(e2) ? e2 : this._makeAbs(e2);
      if (this.mark)
        e2 = this._mark(e2);
      if (this.absolute)
        e2 = abs;
      if (this.matches[index][e2])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e2] = true;
      var st = this.statCache[abs];
      if (st)
        this.emit("stat", e2, st);
      this.emit("match", e2);
    };
    Glob.prototype._readdirInGlobStar = function(abs, cb) {
      if (this.aborted)
        return;
      if (this.follow)
        return this._readdir(abs, false, cb);
      var lstatkey = "lstat\0" + abs;
      var self = this;
      var lstatcb = inflight(lstatkey, lstatcb_);
      if (lstatcb)
        self.fs.lstat(abs, lstatcb);
      function lstatcb_(er, lstat) {
        if (er && er.code === "ENOENT")
          return cb();
        var isSym = lstat && lstat.isSymbolicLink();
        self.symlinks[abs] = isSym;
        if (!isSym && lstat && !lstat.isDirectory()) {
          self.cache[abs] = "FILE";
          cb();
        } else
          self._readdir(abs, false, cb);
      }
    };
    Glob.prototype._readdir = function(abs, inGlobStar, cb) {
      if (this.aborted)
        return;
      cb = inflight("readdir\0" + abs + "\0" + inGlobStar, cb);
      if (!cb)
        return;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs, cb);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return cb();
        if (Array.isArray(c))
          return cb(null, c);
      }
      var self = this;
      self.fs.readdir(abs, readdirCb(this, abs, cb));
    };
    function readdirCb(self, abs, cb) {
      return function(er, entries) {
        if (er)
          self._readdirError(abs, er, cb);
        else
          self._readdirEntries(abs, entries, cb);
      };
    }
    Glob.prototype._readdirEntries = function(abs, entries, cb) {
      if (this.aborted)
        return;
      if (!this.mark && !this.stat) {
        for (var i2 = 0; i2 < entries.length; i2++) {
          var e2 = entries[i2];
          if (abs === "/")
            e2 = abs + e2;
          else
            e2 = abs + "/" + e2;
          this.cache[e2] = true;
        }
      }
      this.cache[abs] = entries;
      return cb(null, entries);
    };
    Glob.prototype._readdirError = function(f, er, cb) {
      if (this.aborted)
        return;
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + " invalid cwd " + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            this.emit("error", error);
            this.abort();
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict) {
            this.emit("error", er);
            this.abort();
          }
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
      return cb();
    };
    Glob.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processGlobStar2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false, cb);
      var isSym = this.symlinks[abs];
      var len = entries.length;
      if (isSym && inGlobStar)
        return cb();
      for (var i2 = 0; i2 < len; i2++) {
        var e2 = entries[i2];
        if (e2.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i2], remainWithoutGlobStar);
        this._process(instead, index, true, cb);
        var below = gspref.concat(entries[i2], remain);
        this._process(below, index, true, cb);
      }
      cb();
    };
    Glob.prototype._processSimple = function(prefix, index, cb) {
      var self = this;
      this._stat(prefix, function(er, exists) {
        self._processSimple2(prefix, index, er, exists, cb);
      });
    };
    Glob.prototype._processSimple2 = function(prefix, index, er, exists, cb) {
      if (!this.matches[index])
        this.matches[index] = /* @__PURE__ */ Object.create(null);
      if (!exists)
        return cb();
      if (prefix && isAbsolute(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path.join(this.root, prefix);
        } else {
          prefix = path.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
      cb();
    };
    Glob.prototype._stat = function(f, cb) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return cb();
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return cb(null, c);
        if (needDir && c === "FILE")
          return cb();
      }
      var exists;
      var stat = this.statCache[abs];
      if (stat !== void 0) {
        if (stat === false)
          return cb(null, stat);
        else {
          var type = stat.isDirectory() ? "DIR" : "FILE";
          if (needDir && type === "FILE")
            return cb();
          else
            return cb(null, type, stat);
        }
      }
      var self = this;
      var statcb = inflight("stat\0" + abs, lstatcb_);
      if (statcb)
        self.fs.lstat(abs, statcb);
      function lstatcb_(er, lstat) {
        if (lstat && lstat.isSymbolicLink()) {
          return self.fs.stat(abs, function(er2, stat2) {
            if (er2)
              self._stat2(f, abs, null, lstat, cb);
            else
              self._stat2(f, abs, er2, stat2, cb);
          });
        } else {
          self._stat2(f, abs, er, lstat, cb);
        }
      }
    };
    Glob.prototype._stat2 = function(f, abs, er, stat, cb) {
      if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
        this.statCache[abs] = false;
        return cb();
      }
      var needDir = f.slice(-1) === "/";
      this.statCache[abs] = stat;
      if (abs.slice(-1) === "/" && stat && !stat.isDirectory())
        return cb(null, false, stat);
      var c = true;
      if (stat)
        c = stat.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return cb();
      return cb(null, c, stat);
    };
  }
});

// node_modules/dedent/dist/dedent.js
var require_dedent = __commonJS({
  "node_modules/dedent/dist/dedent.js"(exports, module2) {
    "use strict";
    function dedent2(strings) {
      var raw = void 0;
      if (typeof strings === "string") {
        raw = [strings];
      } else {
        raw = strings.raw;
      }
      var result = "";
      for (var i2 = 0; i2 < raw.length; i2++) {
        result += raw[i2].replace(/\\\n[ \t]*/g, "").replace(/\\`/g, "`");
        if (i2 < (arguments.length <= 1 ? 0 : arguments.length - 1)) {
          result += arguments.length <= i2 + 1 ? void 0 : arguments[i2 + 1];
        }
      }
      var lines = result.split("\n");
      var mindent = null;
      lines.forEach(function(l) {
        var m = l.match(/^(\s+)\S+/);
        if (m) {
          var indent = m[1].length;
          if (!mindent) {
            mindent = indent;
          } else {
            mindent = Math.min(mindent, indent);
          }
        }
      });
      if (mindent !== null) {
        result = lines.map(function(l) {
          return l[0] === " " ? l.slice(mindent) : l;
        }).join("\n");
      }
      result = result.trim();
      return result.replace(/\\n/g, "\n");
    }
    if (typeof module2 !== "undefined") {
      module2.exports = dedent2;
    }
  }
});

// src/index.js
var src_exports = {};
__export(src_exports, {
  Features: () => Features,
  vscodeInstalled: () => vscodeInstalled
});
module.exports = __toCommonJS(src_exports);

// src/modules/command.js
var import_fs3 = __toESM(require("fs"), 1);
var import_perf_hooks = require("perf_hooks");
var import_child_process = require("child_process");

// src/modules/postProcessing.js
var import_verbal_expressions = __toESM(require_verbalexpressions(), 1);
var import_glob = __toESM(require_glob(), 1);
var import_fs = __toESM(require("fs"), 1);
function ResolveFile(resourcePath, file) {
  if (file.includes("*") > 0) {
    return import_glob.default.sync(file, { cwd: resourcePath, absolute: true });
  } else {
    return resourcePath + "/" + file;
  }
}
function PostProcess(resourceName, file, type, write = true) {
  let fileData = type == "build" ? import_fs.default.readFileSync(file, "utf-8") : file;
  for (let feature of Features) {
    if (typeof feature.from == "string") {
      fileData = fileData.replace(feature.from, feature.to);
    } else {
      feature.from.removeModifier("g");
      let match5 = feature.from.test(fileData);
      feature.from.addModifier("g");
      if (match5) {
        if (typeof feature.to == "string") {
          fileData = fileData.replace(feature.from, feature.to);
        } else {
          fileData = feature.to(fileData);
        }
      }
    }
  }
  if (type == "build") {
    let outputFileDir = file.replace(resourceName, resourceName + "/build");
    let outputDir = outputFileDir.replace((0, import_verbal_expressions.default)().word().then(".lua"), "");
    import_fs.default.mkdirSync(outputDir, { recursive: true });
    import_fs.default.writeFileSync(outputFileDir, fileData);
  } else {
    return fileData;
  }
}

// src/modules/manifest.js
function GetAllResourceMetadata(resourceName, key) {
  let metadataNum = GetNumResourceMetadata(resourceName, key);
  let result = [];
  for (let i2 = 0; i2 < metadataNum; i2++) {
    let metadata = GetResourceMetadata(resourceName, key, i2);
    if (!metadata.includes("@") && !metadata.includes("--") && metadata.includes(".lua")) {
      result.push(metadata);
    }
  }
  return result;
}

// src/modules/string.js
String.prototype.occurrences = function(string) {
  let regex = new RegExp(string, "g");
  return (this.match(regex) || []).length;
};

// config.js
var Config = {};
Config.Dev = true;

// src/modules/vscode.js
var import_fs2 = __toESM(require("fs"), 1);
var vscodeSettingsAlreadyExist = {};
function SetWatcherExclude(file, status) {
  let rawdata = import_fs2.default.readFileSync(file);
  let settings = JSON.parse(rawdata);
  if (!settings["files.watcherExclude"]) {
    settings["files.watcherExclude"] = {};
  }
  settings["files.watcherExclude"]["**/*.lua"] = status;
  let data = JSON.stringify(settings, null, 4);
  import_fs2.default.writeFileSync(file, data);
}
function AddExclusion(resourcePath) {
  if (import_fs2.default.existsSync(resourcePath + "/.vscode/")) {
    SetWatcherExclude(resourcePath + "/.vscode/settings.json", true);
    vscodeSettingsAlreadyExist[resourcePath] = true;
  } else {
    import_fs2.default.mkdirSync(resourcePath + "/.vscode");
    import_fs2.default.writeFileSync(resourcePath + "/.vscode/settings.json", JSON.stringify({
      "files.watcherExclude": {
        "**/*.lua": true
      }
    }));
  }
}
function RemoveExclusion(resourcePath) {
  if (vscodeSettingsAlreadyExist[resourcePath]) {
    SetWatcherExclude(resourcePath + "/.vscode/settings.json", false);
    delete vscodeSettingsAlreadyExist[resourcePath];
  } else {
    import_fs2.default.rmSync(resourcePath + "/.vscode", { recursive: true, force: true });
  }
}

// src/modules/command.js
function EsbuildBuild() {
  let resourceName = GetCurrentResourceName();
  let path = GetResourcePath(resourceName);
  (0, import_child_process.execSync)("npm run build", { cwd: path });
}
function GetAllScripts(resourceName) {
  let files = [];
  files = GetAllResourceMetadata(resourceName, "client_script");
  files.push(...GetAllResourceMetadata(resourceName, "server_script"));
  files.push(...GetAllResourceMetadata(resourceName, "files"));
  return files;
}
async function Command(source, args) {
  let [type, resourceName, buildTask] = args;
  if (source != 0)
    return;
  if (type == "rebuild" && !resourceName) {
    EsbuildBuild();
    console.log("^2Rebuilt^0");
    return;
  }
  if (!type || !resourceName) {
    console.log(`${name} restart <resource>`);
    console.log(`${name} build <resource>`);
    if (Config.Dev)
      console.log(`${name} rebuild`);
    return;
  }
  let resourcePath = GetResourcePath(resourceName);
  let start = import_perf_hooks.performance.now();
  let files = GetAllScripts(resourceName);
  let beforePreProcessing = {};
  switch (type) {
    case "build":
      for (let file of files) {
        let fileDirectory = ResolveFile(resourcePath, file);
        if (typeof fileDirectory != "string") {
          for (let fileDir of fileDirectory) {
            PostProcess(resourceName, fileDir, type);
          }
        } else {
          PostProcess(resourceName, fileDirectory, type);
        }
      }
      break;
    case "restart":
      let startPreprocess = import_perf_hooks.performance.now();
      let preProcessedFiles = {};
      for (let file of files) {
        let fileDirectory = ResolveFile(resourcePath, file);
        if (typeof fileDirectory != "string") {
          for (let fileDir of fileDirectory) {
            let file2 = import_fs3.default.readFileSync(fileDir, "utf-8");
            if (file2.length > 0) {
              let postProcessed = PostProcess(resourceName, file2, type);
              beforePreProcessing[fileDir] = file2;
              preProcessedFiles[fileDir] = postProcessed;
            }
          }
        } else {
          let file2 = import_fs3.default.readFileSync(fileDirectory, "utf-8");
          if (file2.length > 0) {
            let postProcessed = PostProcess(resourceName, file2, type);
            beforePreProcessing[fileDirectory] = file2;
            preProcessedFiles[fileDirectory] = postProcessed;
          }
        }
      }
      let endPreprocess = import_perf_hooks.performance.now();
      let doneWrite = [];
      let keys = Object.keys(preProcessedFiles);
      if (vscodeInstalled) {
        AddExclusion(resourcePath);
        await new Promise((resolve, reject) => {
          setTimeout(() => resolve(), 100);
        });
      }
      let startWriting = import_perf_hooks.performance.now();
      if (keys.length == 1) {
        let fileDir = keys[0];
        let file = preProcessedFiles[fileDir];
        import_fs3.default.writeFileSync(fileDir, file);
      } else {
        let writing = new Promise((resolve) => {
          for (let fileDir in preProcessedFiles) {
            let file = preProcessedFiles[fileDir];
            doneWrite.push(fileDir);
            import_fs3.default.writeFile(fileDir, file, (err) => {
              if (err)
                console.log(err);
              else {
                let index = doneWrite.indexOf(fileDir);
                if (index > -1) {
                  doneWrite.splice(index, 1);
                }
                if (doneWrite.length == 0) {
                  resolve(true);
                }
              }
            });
          }
        });
        await writing;
      }
      let endWriting = import_perf_hooks.performance.now();
      if (Config.Dev)
        console.log("Pre process runtime: ^3" + (endPreprocess - startPreprocess) + "^0ms");
      if (Config.Dev)
        console.log("Writing runtime: ^3" + (endWriting - startWriting) + "^0ms");
      break;
  }
  if (Config.Dev)
    console.log("Pre processed in: ^2" + (import_perf_hooks.performance.now() - start) + "^0ms" + (vscodeInstalled && " (^3you need to remove about 100ms since there is the vscode watcher exclusion^0)"));
  if (type == "restart") {
    if (buildTask) {
      setTimeout(() => {
        for (let path in beforePreProcessing) {
          import_fs3.default.writeFileSync(path, beforePreProcessing[path]);
        }
        if (vscodeInstalled) {
          RemoveExclusion(resourcePath);
        }
      }, 10);
      return true;
    } else {
      StopResource(resourceName);
      StartResource(resourceName);
      for (let path in beforePreProcessing) {
        import_fs3.default.writeFileSync(path, beforePreProcessing[path]);
      }
      if (vscodeInstalled) {
        RemoveExclusion(resourcePath);
      }
    }
  }
}
function CreateCommand(name2) {
  RegisterCommand(name2, Command, true);
}

// src/index.js
var import_perf_hooks2 = require("perf_hooks");
var import_child_process2 = require("child_process");

// src/features/arrowFunction.js
var import_verbal_expressions2 = __toESM(require_verbalexpressions(), 1);

// src/modules/linesManipulation.js
function getLine(fileData, string) {
  if (typeof string == "string") {
    let char = fileData.indexOf(string);
    fileData = fileData.substring(0, char);
    let match5 = fileData.match(/\n/gi);
    if (match5) {
      return match5.length + 1;
    } else {
      return 1;
    }
  } else {
    let sliced = fileData.substr(0, string);
    let match5 = sliced.match(/\n/gi);
    if (match5) {
      return match5.length + 1;
    } else {
      return 1;
    }
  }
}
function getChars(fileData, lineNumber) {
  let lines = fileData.split("\n");
  let chars = 0;
  if (lineNumber > lines.length)
    return -1;
  for (i = 0; i < lineNumber - 1; i++) {
    chars = chars + lines[i].length + 1;
  }
  return chars;
}
function sliceLine(string, lineStart, lineEnd) {
  if (lineStart && !lineEnd) {
    let chars = getChars(string, lineStart);
    return string.slice(chars);
  } else {
    let charsStart = getChars(string, lineStart);
    let charsEnd = getChars(string, lineEnd);
    return string.slice(charsStart, charsEnd);
  }
}

// src/modules/functions.js
function ReplaceFunctionEnding(string, linesAfterMatch, to = "end", opening = "{", closing = "}") {
  let lineByLine = linesAfterMatch.split("\n");
  let i2;
  let curlyBracesCounter = 0;
  for (i2 in lineByLine) {
    let line = lineByLine[i2];
    if (typeof opening == "object") {
      for (e of opening) {
        curlyBracesCounter += line.occurrences(e);
      }
    } else {
      curlyBracesCounter += line.occurrences(opening);
    }
    curlyBracesCounter -= line.occurrences(closing);
    if (curlyBracesCounter == 0) {
      if (to) {
        lineByLine[i2] = line.replace(closing, to);
      }
      break;
    }
  }
  string = string.replace(linesAfterMatch, lineByLine.join("\n"));
  let startLine2 = getLine(string, lineByLine[0]);
  let endLine2 = startLine2 + parseInt(i2);
  return [string, startLine2, endLine2];
}

// src/modules/regex.js
function MatchAllRegex(string, regex) {
  let m;
  let result = [];
  while ((m = regex.exec(string)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    result.push(m);
  }
  return result;
}

// src/features/arrowFunction.js
var match = (0, import_verbal_expressions2.default)().maybe(
  (0, import_verbal_expressions2.default)().find("(").beginCapture().anythingBut("()").endCapture().then(")")
).maybe(
  (0, import_verbal_expressions2.default)().beginCapture().word().endCapture()
).maybe(" ").then("=>").maybe(" ").then("{");
var ArrowFunction = {
  from: match,
  to: function(originalFile) {
    let file = originalFile;
    let matches = MatchAllRegex(file, match);
    matches.map((x) => {
      [file] = ReplaceFunctionEnding(file, file.split("\n").slice(getLine(originalFile, x.index)).join("\n"));
      match.removeModifier("g");
      if (x[1] != null) {
        file = file.replace(match, "function($1)");
      } else if (x[2] != null) {
        file = file.replace(match, "function($2)");
      }
      match.addModifier("g");
    });
    return file;
  }
};

// src/features/notEqual.js
var NotEqual = {
  from: "!=",
  to: "~="
};

// src/features/classes.js
var import_dedent = __toESM(require_dedent(), 1);
var import_verbal_expressions3 = __toESM(require_verbalexpressions(), 1);
function classIterator(fileData, matchIndices) {
  const classFunctionTester = (0, import_verbal_expressions3.default)().find("function").maybe(" ").then("(").beginCapture().anythingBut(")").endCapture().then(")");
  let lines;
  let originalFileData = fileData;
  for (let i2 of matchIndices) {
    let slicedFile = originalFileData.slice(i2);
    [_, startLine, endLine] = ReplaceFunctionEnding(fileData, slicedFile, null);
    let classBody = sliceLine(fileData, startLine, endLine + 1);
    lines = classBody.split("\n");
    let inFunction = false;
    let opening = ["(?<!else)if.*then", "function\\s*.*\\(", "while.*do", "for.*do"];
    let countEnds = 1;
    for (i2 in lines) {
      let line = lines[i2];
      if (!inFunction && classFunctionTester.test(line)) {
        classFunctionTester.lastIndex = 0;
        let result = classFunctionTester.exec(line);
        if (result[1].length > 0) {
          lines[i2] = line.replace(classFunctionTester, "function(self, $1)");
        } else {
          lines[i2] = line.replace(classFunctionTester, "function(self)");
        }
        countEnds = 1;
        inFunction = true;
      } else if (inFunction) {
        for (e of opening) {
          countEnds += line.occurrences(e);
        }
        countEnds -= line.occurrences("end");
        if (countEnds === 0) {
          inFunction = false;
        }
      }
    }
    fileData = fileData.replace(classBody, lines.join("\n"));
  }
  return fileData;
}
var classMatch = (0, import_verbal_expressions3.default)().find("class").maybe(" ").beginCapture().anythingBut(" ").endCapture().maybe(" ").then("{");
var classExtendsMatch = (0, import_verbal_expressions3.default)().find("class").maybe(" ").beginCapture().anythingBut(" ").endCapture().maybe(" ").find("extends").maybe(" ").beginCapture().anythingBut(" ").endCapture().maybe(" ").then("{");
var Class = {
  from: classMatch,
  to: function(file) {
    let matchIndices = MatchAllRegex(file, classMatch).map((x) => x.index);
    if (matchIndices.length > 0) {
      file = classIterator(file, matchIndices);
      file = file.replace(classMatch, import_dedent.default`
                $1=function(...)local a=setmetatable({},{__index=function(self,b)return Prototype$1[b]end})if a.constructor then a:constructor(...)end;return a end;if not _type then _type=type;type=function(b)local realType=_type(b)if realType=="table"and b.type then return b.type else return realType end end end;Prototype$1={type = "$1",
            `);
    }
    return file;
  }
};
var ClassExtends = {
  from: classExtendsMatch,
  to: function(file) {
    let matchIndices = MatchAllRegex(file, classExtendsMatch).map((x) => x.index);
    file = classIterator(file, matchIndices);
    return file.replace(classExtendsMatch, import_dedent.default`
            $1=function(...)if Prototype$2 then Prototype$1.super=setmetatable({},{__index=function(self,a)return Prototype$2[a]end,__call=function(self,...)self.constructor(...)end})else error("ExtendingNotDefined: trying to extend the class $2 that is not defined")end;local b=setmetatable({},{__index=function(self,a)return Prototype$1[a]or Prototype$2[a]end})if b.constructor then b:constructor(...)end;return b end;Prototype$1={
        `);
  }
};

// src/features/defaultValue.js
var import_verbal_expressions4 = __toESM(require_verbalexpressions(), 1);
var triggerMatch = (0, import_verbal_expressions4.default)().find("function").maybe(" ").maybe((0, import_verbal_expressions4.default)().word()).beginCapture().then("(").anythingBut("()").then(")").endCapture();
var extractDefaultValues = (0, import_verbal_expressions4.default)().beginCapture().anythingBut(" ()").endCapture().maybe(" ").then("=").maybe(" ").beginCapture().anythingBut(",)").endCapture();
var DefaultValue = {
  from: triggerMatch,
  to: function(file) {
    let matches = MatchAllRegex(file, triggerMatch);
    let originalFile = file;
    matches.map((match5) => {
      let defaultValues = MatchAllRegex(match5[1], extractDefaultValues);
      if (defaultValues.length > 0) {
        let afterMatch = getLine(originalFile, match5.index);
        let parameters = sliceLine(file, afterMatch, afterMatch + 1);
        let originalParameters = parameters;
        parameters = parameters.replace((0, import_verbal_expressions4.default)().lineBreak().endOfLine(), "");
        defaultValues.map((param) => {
          parameters += `;${param[1]} = ${param[1]} ~= nil and ${param[1]} or ${param[2]}`;
          let regexEscaped = param[2].replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
          let noExecutablePart = new RegExp("\\s?=\\s?" + regexEscaped);
          parameters = parameters.replace(noExecutablePart, "");
        });
        parameters += "\n";
        file = file.replace(originalParameters, parameters);
      }
    });
    return file;
  }
};

// src/features/unpack.js
var import_verbal_expressions5 = __toESM(require_verbalexpressions(), 1);
var match2 = (0, import_verbal_expressions5.default)().find("...").not(",").not(")").not("}").beginCapture().word().endCapture();
var Unpack = {
  from: match2,
  to: function(file) {
    MatchAllRegex(file, match2).map((x) => {
      let slicedFile = file.slice(x.index, x.index + 100);
      let originalFile = slicedFile;
      slicedFile = slicedFile.replace(`...${x[1]}`, `table.unpack(${x[1]})`);
      file = file.replace(originalFile, slicedFile);
    });
    return file;
  }
};

// src/features/new.js
var import_verbal_expressions6 = __toESM(require_verbalexpressions(), 1);
var match3 = (0, import_verbal_expressions6.default)().find("new ").beginCapture().anythingBut("(").then("(").endCapture();
var New = {
  from: match3,
  to: function(file) {
    return file.replace(match3, "$1");
  }
};

// src/features/decorators.js
var import_verbal_expressions7 = __toESM(require_verbalexpressions(), 1);
var match4 = (0, import_verbal_expressions7.default)().beginCapture().find("@").word().maybe(
  (0, import_verbal_expressions7.default)().find("(").anythingBut("()").find(")")
).maybe((0, import_verbal_expressions7.default)().lineBreak()).endCapture().oneOrMore().maybe((0, import_verbal_expressions7.default)().lineBreak()).maybe(
  (0, import_verbal_expressions7.default)().maybe(
    (0, import_verbal_expressions7.default)().find("local").maybe(" ")
  ).beginCapture().word().endCapture().maybe(" ").find("=").maybe(" ")
).then("function").maybe(" ").maybe(
  (0, import_verbal_expressions7.default)().beginCapture().anythingBut("(").endCapture()
).then("(");
var decoratorsVerEx = (0, import_verbal_expressions7.default)().find("@").beginCapture().word().endCapture().maybe(
  (0, import_verbal_expressions7.default)().find("(").beginCapture().anythingBut("()").endCapture().find(")")
);
var Decorators = {
  from: match4,
  to: function(file) {
    MatchAllRegex(file, match4).map((match5) => {
      let functionName = match5[2] || match5[3];
      let decorators = MatchAllRegex(match5[0], decoratorsVerEx);
      let line = getLine(file, match5[0]);
      let slicedFile = sliceLine(file, line + decorators.length);
      let [_2, startLine2, endLine2] = ReplaceFunctionEnding(file, slicedFile, null, ["if", "function", "while", "for"], "end");
      startLine2 -= decorators.length;
      let functionContent = sliceLine(file, startLine2, endLine2 + 1);
      functionContent = functionContent.slice(0, -2);
      let originalFunctionContent = functionContent;
      functionContent += `;local _${functionName}=${functionName};${functionName}FunctionPrototype=setmetatable({name="${functionName}"},{__call=function(self,...)return _${functionName}(...)end})`;
      decorators.map((decorator) => {
        functionContent = functionContent.replace(decorator[0], "");
        if (decorator[2]) {
          functionContent += `;if not ${decorator[1]} then error("DecoratorNotDefined: trying to use the decorator ${decorator[1]} but is not defined",2)end;${functionName}=${decorator[1]}(${functionName}FunctionPrototype,${decorator[2]})`;
        } else {
          functionContent += `;if not ${decorator[1]} then error("DecoratorNotDefined: trying to use the decorator ${decorator[1]} but is not defined",2)end;${functionName}=${decorator[1]}(${functionName}FunctionPrototype)`;
        }
      });
      file = file.replace(originalFunctionContent, functionContent);
    });
    return file;
  }
};

// src/features/typeChecking.js
var import_verbal_expressions8 = __toESM(require_verbalexpressions(), 1);
var triggerMatch2 = (0, import_verbal_expressions8.default)().find("function").maybe(" ").maybe((0, import_verbal_expressions8.default)().word()).beginCapture().then("(").anythingBut("()").then(")").endCapture();
var extractTypes = (0, import_verbal_expressions8.default)().find("<").beginCapture().anythingBut(">").endCapture().find(">").find(" ").beginCapture().word().endCapture();
var TypeChecking = {
  from: triggerMatch2,
  to: function(file) {
    let matches = MatchAllRegex(file, triggerMatch2);
    let originalFile = file;
    matches.map((match5) => {
      let paramsTypes = MatchAllRegex(match5[1], extractTypes);
      if (paramsTypes.length > 0) {
        let afterMatch = getLine(originalFile, match5.index);
        let params = sliceLine(file, afterMatch, afterMatch + 1);
        let originalParams = params;
        params = params.replace((0, import_verbal_expressions8.default)().lineBreak().endOfLine(), "");
        paramsTypes.map((param) => {
          params += `;assert(type(${param[2]}) == "${param[1]}", "${param[2]}: ${param[1]} expected, got "..type(${param[2]}))`;
        });
        let noExecutablePart = (0, import_verbal_expressions8.default)().find("<").anythingBut(">").find(">").maybe(" ");
        params = params.replace(noExecutablePart, "");
        params += "\n";
        file = file.replace(originalParams, params);
      }
    });
    return file;
  }
};

// src/index.js
var Features = [
  ArrowFunction,
  NotEqual,
  Class,
  ClassExtends,
  DefaultValue,
  TypeChecking,
  Unpack,
  New,
  Decorators
];
var lastBuild = {};
var vscodeInstalled = false;
(0, import_child_process2.exec)(
  "code --version",
  function(error, stdout, stderr) {
    if (stdout) {
      vscodeInstalled = true;
    }
  }
);
if (GetCurrentResourceName() == "leap") {
  CreateCommand("leap");
  let leapBuildTask = {
    shouldBuild(res) {
      if (lastBuild[res]) {
        if (import_perf_hooks2.performance.now() - lastBuild[res] < 250) {
          return false;
        }
      }
      const nDependency = GetNumResourceMetadata(res, "dependency");
      if (nDependency > 0) {
        for (let i2 = 0; i2 < nDependency; i2++) {
          const dependencyName = GetResourceMetadata(res, "dependency");
          if (dependencyName == "leap") {
            lastBuild[res] = import_perf_hooks2.performance.now();
            return true;
          }
        }
      }
      return false;
    },
    async build(res, cb) {
      await Command(0, ["restart", res, true]);
      lastBuild[res] = import_perf_hooks2.performance.now();
      cb(true);
    }
  };
  RegisterResourceBuildTaskFactory("leap", () => leapBuildTask);
} else {
  setInterval(() => console.log("^1PLEASE DON'T RENAME THE RESOURCE"), 100);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Features,
  vscodeInstalled
});
/*! Bundled license information:

verbal-expressions/dist/verbalexpressions.js:
  (**
   * @file VerbalExpressions JavaScript Library
   * @version 0.3.0
   * @license MIT
   *
   * @see https://github.com/VerbalExpressions/JSVerbalExpressions
   *)
*/
