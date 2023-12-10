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
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/luamin/node_modules/luaparse/luaparse.js
var require_luaparse = __commonJS({
  "node_modules/luamin/node_modules/luaparse/luaparse.js"(exports, module2) {
    (function(root, name, factory) {
      "use strict";
      var objectTypes = {
        "function": true,
        "object": true
      }, freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports, freeModule = objectTypes[typeof module2] && module2 && !module2.nodeType && module2, freeGlobal = freeExports && freeModule && typeof global == "object" && global, moduleExports = freeModule && freeModule.exports === freeExports && freeExports;
      if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
        root = freeGlobal;
      }
      if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
        define(["exports"], factory);
        if (freeExports && moduleExports)
          factory(freeModule.exports);
      } else if (freeExports && freeModule) {
        if (moduleExports)
          factory(freeModule.exports);
        else
          factory(freeExports);
      } else {
        factory(root[name] = {});
      }
    })(exports, "luaparse", function(exports2) {
      "use strict";
      exports2.version = "0.2.1";
      var input2, options2, length2;
      var defaultOptions2 = exports2.defaultOptions = {
        // Explicitly tell the parser when the input ends.
        wait: false,
        comments: true,
        scope: false,
        locations: false,
        ranges: false,
        onCreateNode: null,
        onCreateScope: null,
        onDestroyScope: null
      };
      var EOF2 = 1, StringLiteral2 = 2, Keyword2 = 4, Identifier2 = 8, NumericLiteral2 = 16, Punctuator2 = 32, BooleanLiteral2 = 64, NilLiteral2 = 128, VarargLiteral2 = 256;
      exports2.tokenTypes = {
        EOF: EOF2,
        StringLiteral: StringLiteral2,
        Keyword: Keyword2,
        Identifier: Identifier2,
        NumericLiteral: NumericLiteral2,
        Punctuator: Punctuator2,
        BooleanLiteral: BooleanLiteral2,
        NilLiteral: NilLiteral2,
        VarargLiteral: VarargLiteral2
      };
      var errors2 = exports2.errors = {
        unexpected: "unexpected %1 '%2' near '%3'",
        expected: "'%1' expected near '%2'",
        expectedToken: "%1 expected near '%2'",
        unfinishedString: "unfinished string near '%1'",
        malformedNumber: "malformed number near '%1'",
        invalidVar: "invalid left-hand side of assignment near '%1'"
      };
      var ast7 = exports2.ast = {
        labelStatement: function(label) {
          return {
            type: "LabelStatement",
            label
          };
        },
        breakStatement: function() {
          return {
            type: "BreakStatement"
          };
        },
        gotoStatement: function(label) {
          return {
            type: "GotoStatement",
            label
          };
        },
        returnStatement: function(args) {
          return {
            type: "ReturnStatement",
            "arguments": args
          };
        },
        ifStatement: function(clauses) {
          return {
            type: "IfStatement",
            clauses
          };
        },
        ifClause: function(condition, body) {
          return {
            type: "IfClause",
            condition,
            body
          };
        },
        elseifClause: function(condition, body) {
          return {
            type: "ElseifClause",
            condition,
            body
          };
        },
        elseClause: function(body) {
          return {
            type: "ElseClause",
            body
          };
        },
        whileStatement: function(condition, body) {
          return {
            type: "WhileStatement",
            condition,
            body
          };
        },
        doStatement: function(body) {
          return {
            type: "DoStatement",
            body
          };
        },
        repeatStatement: function(condition, body) {
          return {
            type: "RepeatStatement",
            condition,
            body
          };
        },
        localStatement: function(variables, init) {
          return {
            type: "LocalStatement",
            variables,
            init
          };
        },
        assignmentStatement: function(variables, init) {
          return {
            type: "AssignmentStatement",
            variables,
            init
          };
        },
        callStatement: function(expression) {
          return {
            type: "CallStatement",
            expression
          };
        },
        functionStatement: function(identifier, parameters, isLocal, body) {
          return {
            type: "FunctionDeclaration",
            identifier,
            isLocal,
            parameters,
            body
          };
        },
        forNumericStatement: function(variable, start, end3, step, body) {
          return {
            type: "ForNumericStatement",
            variable,
            start,
            end: end3,
            step,
            body
          };
        },
        forGenericStatement: function(variables, iterators, body) {
          return {
            type: "ForGenericStatement",
            variables,
            iterators,
            body
          };
        },
        chunk: function(body) {
          return {
            type: "Chunk",
            body
          };
        },
        identifier: function(name) {
          return {
            type: "Identifier",
            name
          };
        },
        literal: function(type, value, raw) {
          type = type === StringLiteral2 ? "StringLiteral" : type === NumericLiteral2 ? "NumericLiteral" : type === BooleanLiteral2 ? "BooleanLiteral" : type === NilLiteral2 ? "NilLiteral" : "VarargLiteral";
          return {
            type,
            value,
            raw
          };
        },
        tableKey: function(key, value) {
          return {
            type: "TableKey",
            key,
            value
          };
        },
        tableKeyString: function(key, value) {
          return {
            type: "TableKeyString",
            key,
            value
          };
        },
        tableValue: function(value) {
          return {
            type: "TableValue",
            value
          };
        },
        tableConstructorExpression: function(fields) {
          return {
            type: "TableConstructorExpression",
            fields
          };
        },
        binaryExpression: function(operator, left, right) {
          var type = "and" === operator || "or" === operator ? "LogicalExpression" : "BinaryExpression";
          return {
            type,
            operator,
            left,
            right
          };
        },
        unaryExpression: function(operator, argument) {
          return {
            type: "UnaryExpression",
            operator,
            argument
          };
        },
        memberExpression: function(base, indexer, identifier) {
          return {
            type: "MemberExpression",
            indexer,
            identifier,
            base
          };
        },
        indexExpression: function(base, index3) {
          return {
            type: "IndexExpression",
            base,
            index: index3
          };
        },
        callExpression: function(base, args) {
          return {
            type: "CallExpression",
            base,
            "arguments": args
          };
        },
        tableCallExpression: function(base, args) {
          return {
            type: "TableCallExpression",
            base,
            "arguments": args
          };
        },
        stringCallExpression: function(base, argument) {
          return {
            type: "StringCallExpression",
            base,
            argument
          };
        },
        comment: function(value, raw) {
          return {
            type: "Comment",
            value,
            raw
          };
        }
      };
      function finishNode2(node) {
        if (trackLocations2) {
          var location = locations2.pop();
          location.complete();
          if (options2.locations)
            node.loc = location.loc;
          if (options2.ranges)
            node.range = location.range;
        }
        if (options2.onCreateNode)
          options2.onCreateNode(node);
        return node;
      }
      var slice2 = Array.prototype.slice, toString2 = Object.prototype.toString, indexOf2 = function indexOf3(array, element) {
        for (var i = 0, length3 = array.length; i < length3; i++) {
          if (array[i] === element)
            return i;
        }
        return -1;
      };
      function indexOfObject2(array, property, element) {
        for (var i = 0, length3 = array.length; i < length3; i++) {
          if (array[i][property] === element)
            return i;
        }
        return -1;
      }
      function sprintf2(format) {
        var args = slice2.call(arguments, 1);
        format = format.replace(/%(\d)/g, function(match, index3) {
          return "" + args[index3 - 1] || "";
        });
        return format;
      }
      function extend() {
        var args = slice2.call(arguments), dest = {}, src, prop;
        for (var i = 0, length3 = args.length; i < length3; i++) {
          src = args[i];
          for (prop in src)
            if (src.hasOwnProperty(prop)) {
              dest[prop] = src[prop];
            }
        }
        return dest;
      }
      function raise2(token3) {
        var message = sprintf2.apply(null, slice2.call(arguments, 1)), error, col;
        if ("undefined" !== typeof token3.line) {
          col = token3.range[0] - token3.lineStart;
          error = new SyntaxError(sprintf2("[%1:%2] %3", token3.line, col, message));
          error.line = token3.line;
          error.index = token3.range[0];
          error.column = col;
        } else {
          col = index2 - lineStart2 + 1;
          error = new SyntaxError(sprintf2("[%1:%2] %3", line2, col, message));
          error.index = index2;
          error.line = line2;
          error.column = col;
        }
        throw error;
      }
      function raiseUnexpectedToken2(type, token3) {
        raise2(token3, errors2.expectedToken, type, token3.value);
      }
      function unexpected2(found, near) {
        if ("undefined" === typeof near)
          near = lookahead2.value;
        if ("undefined" !== typeof found.type) {
          var type;
          switch (found.type) {
            case StringLiteral2:
              type = "string";
              break;
            case Keyword2:
              type = "keyword";
              break;
            case Identifier2:
              type = "identifier";
              break;
            case NumericLiteral2:
              type = "number";
              break;
            case Punctuator2:
              type = "symbol";
              break;
            case BooleanLiteral2:
              type = "boolean";
              break;
            case NilLiteral2:
              return raise2(found, errors2.unexpected, "symbol", "nil", near);
          }
          return raise2(found, errors2.unexpected, type, found.value, near);
        }
        return raise2(found, errors2.unexpected, "symbol", found, near);
      }
      var index2, token2, previousToken2, lookahead2, comments2, tokenStart2, line2, lineStart2;
      exports2.lex = lex2;
      function lex2() {
        skipWhiteSpace2();
        while (45 === input2.charCodeAt(index2) && 45 === input2.charCodeAt(index2 + 1)) {
          scanComment2();
          skipWhiteSpace2();
        }
        if (index2 >= length2)
          return {
            type: EOF2,
            value: "<eof>",
            line: line2,
            lineStart: lineStart2,
            range: [index2, index2]
          };
        var charCode = input2.charCodeAt(index2), next3 = input2.charCodeAt(index2 + 1);
        tokenStart2 = index2;
        if (isIdentifierStart2(charCode))
          return scanIdentifierOrKeyword2();
        switch (charCode) {
          case 39:
          case 34:
            return scanStringLiteral2();
          case 48:
          case 49:
          case 50:
          case 51:
          case 52:
          case 53:
          case 54:
          case 55:
          case 56:
          case 57:
            return scanNumericLiteral2();
          case 46:
            if (isDecDigit2(next3))
              return scanNumericLiteral2();
            if (46 === next3) {
              if (46 === input2.charCodeAt(index2 + 2))
                return scanVarargLiteral2();
              return scanPunctuator2("..");
            }
            return scanPunctuator2(".");
          case 61:
            if (61 === next3)
              return scanPunctuator2("==");
            return scanPunctuator2("=");
          case 62:
            if (61 === next3)
              return scanPunctuator2(">=");
            if (62 === next3)
              return scanPunctuator2(">>");
            return scanPunctuator2(">");
          case 60:
            if (60 === next3)
              return scanPunctuator2("<<");
            if (61 === next3)
              return scanPunctuator2("<=");
            return scanPunctuator2("<");
          case 126:
            if (61 === next3)
              return scanPunctuator2("~=");
            return scanPunctuator2("~");
          case 58:
            if (58 === next3)
              return scanPunctuator2("::");
            return scanPunctuator2(":");
          case 91:
            if (91 === next3 || 61 === next3)
              return scanLongStringLiteral2();
            return scanPunctuator2("[");
          case 47:
            if (47 === next3)
              return scanPunctuator2("//");
            return scanPunctuator2("/");
          case 42:
          case 94:
          case 37:
          case 44:
          case 123:
          case 124:
          case 125:
          case 93:
          case 40:
          case 41:
          case 59:
          case 38:
          case 35:
          case 45:
          case 43:
            return scanPunctuator2(input2.charAt(index2));
        }
        return unexpected2(input2.charAt(index2));
      }
      function consumeEOL2() {
        var charCode = input2.charCodeAt(index2), peekCharCode = input2.charCodeAt(index2 + 1);
        if (isLineTerminator2(charCode)) {
          if (10 === charCode && 13 === peekCharCode)
            index2++;
          if (13 === charCode && 10 === peekCharCode)
            index2++;
          line2++;
          lineStart2 = ++index2;
          return true;
        }
        return false;
      }
      function skipWhiteSpace2() {
        while (index2 < length2) {
          var charCode = input2.charCodeAt(index2);
          if (isWhiteSpace2(charCode)) {
            index2++;
          } else if (!consumeEOL2()) {
            break;
          }
        }
      }
      function scanIdentifierOrKeyword2() {
        var value, type;
        while (isIdentifierPart2(input2.charCodeAt(++index2)))
          ;
        value = input2.slice(tokenStart2, index2);
        if (isKeyword2(value)) {
          type = Keyword2;
        } else if ("true" === value || "false" === value) {
          type = BooleanLiteral2;
          value = "true" === value;
        } else if ("nil" === value) {
          type = NilLiteral2;
          value = null;
        } else {
          type = Identifier2;
        }
        return {
          type,
          value,
          line: line2,
          lineStart: lineStart2,
          range: [tokenStart2, index2]
        };
      }
      function scanPunctuator2(value) {
        index2 += value.length;
        return {
          type: Punctuator2,
          value,
          line: line2,
          lineStart: lineStart2,
          range: [tokenStart2, index2]
        };
      }
      function scanVarargLiteral2() {
        index2 += 3;
        return {
          type: VarargLiteral2,
          value: "...",
          line: line2,
          lineStart: lineStart2,
          range: [tokenStart2, index2]
        };
      }
      function scanStringLiteral2() {
        var delimiter = input2.charCodeAt(index2++), stringStart = index2, string = "", charCode;
        while (index2 < length2) {
          charCode = input2.charCodeAt(index2++);
          if (delimiter === charCode)
            break;
          if (92 === charCode) {
            string += input2.slice(stringStart, index2 - 1) + readEscapeSequence2();
            stringStart = index2;
          } else if (index2 >= length2 || isLineTerminator2(charCode)) {
            string += input2.slice(stringStart, index2 - 1);
            raise2({}, errors2.unfinishedString, string + String.fromCharCode(charCode));
          }
        }
        string += input2.slice(stringStart, index2 - 1);
        return {
          type: StringLiteral2,
          value: string,
          line: line2,
          lineStart: lineStart2,
          range: [tokenStart2, index2]
        };
      }
      function scanLongStringLiteral2() {
        var string = readLongString2();
        if (false === string)
          raise2(token2, errors2.expected, "[", token2.value);
        return {
          type: StringLiteral2,
          value: string,
          line: line2,
          lineStart: lineStart2,
          range: [tokenStart2, index2]
        };
      }
      function scanNumericLiteral2() {
        var character = input2.charAt(index2), next3 = input2.charAt(index2 + 1);
        var value = "0" === character && "xX".indexOf(next3 || null) >= 0 ? readHexLiteral2() : readDecLiteral2();
        return {
          type: NumericLiteral2,
          value,
          line: line2,
          lineStart: lineStart2,
          range: [tokenStart2, index2]
        };
      }
      function readHexLiteral2() {
        var fraction = 0, binaryExponent = 1, binarySign = 1, digit, fractionStart, exponentStart, digitStart;
        digitStart = index2 += 2;
        if (!isHexDigit2(input2.charCodeAt(index2)))
          raise2({}, errors2.malformedNumber, input2.slice(tokenStart2, index2));
        while (isHexDigit2(input2.charCodeAt(index2)))
          index2++;
        digit = parseInt(input2.slice(digitStart, index2), 16);
        if ("." === input2.charAt(index2)) {
          fractionStart = ++index2;
          while (isHexDigit2(input2.charCodeAt(index2)))
            index2++;
          fraction = input2.slice(fractionStart, index2);
          fraction = fractionStart === index2 ? 0 : parseInt(fraction, 16) / Math.pow(16, index2 - fractionStart);
        }
        if ("pP".indexOf(input2.charAt(index2) || null) >= 0) {
          index2++;
          if ("+-".indexOf(input2.charAt(index2) || null) >= 0)
            binarySign = "+" === input2.charAt(index2++) ? 1 : -1;
          exponentStart = index2;
          if (!isDecDigit2(input2.charCodeAt(index2)))
            raise2({}, errors2.malformedNumber, input2.slice(tokenStart2, index2));
          while (isDecDigit2(input2.charCodeAt(index2)))
            index2++;
          binaryExponent = input2.slice(exponentStart, index2);
          binaryExponent = Math.pow(2, binaryExponent * binarySign);
        }
        return (digit + fraction) * binaryExponent;
      }
      function readDecLiteral2() {
        while (isDecDigit2(input2.charCodeAt(index2)))
          index2++;
        if ("." === input2.charAt(index2)) {
          index2++;
          while (isDecDigit2(input2.charCodeAt(index2)))
            index2++;
        }
        if ("eE".indexOf(input2.charAt(index2) || null) >= 0) {
          index2++;
          if ("+-".indexOf(input2.charAt(index2) || null) >= 0)
            index2++;
          if (!isDecDigit2(input2.charCodeAt(index2)))
            raise2({}, errors2.malformedNumber, input2.slice(tokenStart2, index2));
          while (isDecDigit2(input2.charCodeAt(index2)))
            index2++;
        }
        return parseFloat(input2.slice(tokenStart2, index2));
      }
      function readEscapeSequence2() {
        var sequenceStart = index2;
        switch (input2.charAt(index2)) {
          case "n":
            index2++;
            return "\n";
          case "r":
            index2++;
            return "\r";
          case "t":
            index2++;
            return "	";
          case "v":
            index2++;
            return "\v";
          case "b":
            index2++;
            return "\b";
          case "f":
            index2++;
            return "\f";
          case "z":
            index2++;
            skipWhiteSpace2();
            return "";
          case "x":
            if (isHexDigit2(input2.charCodeAt(index2 + 1)) && isHexDigit2(input2.charCodeAt(index2 + 2))) {
              index2 += 3;
              return "\\" + input2.slice(sequenceStart, index2);
            }
            return "\\" + input2.charAt(index2++);
          default:
            if (isDecDigit2(input2.charCodeAt(index2))) {
              while (isDecDigit2(input2.charCodeAt(++index2)))
                ;
              return "\\" + input2.slice(sequenceStart, index2);
            }
            return input2.charAt(index2++);
        }
      }
      function scanComment2() {
        tokenStart2 = index2;
        index2 += 2;
        var character = input2.charAt(index2), content = "", isLong = false, commentStart = index2, lineStartComment = lineStart2, lineComment = line2;
        if ("[" === character) {
          content = readLongString2();
          if (false === content)
            content = character;
          else
            isLong = true;
        }
        if (!isLong) {
          while (index2 < length2) {
            if (isLineTerminator2(input2.charCodeAt(index2)))
              break;
            index2++;
          }
          if (options2.comments)
            content = input2.slice(commentStart, index2);
        }
        if (options2.comments) {
          var node = ast7.comment(content, input2.slice(tokenStart2, index2));
          if (options2.locations) {
            node.loc = {
              start: { line: lineComment, column: tokenStart2 - lineStartComment },
              end: { line: line2, column: index2 - lineStart2 }
            };
          }
          if (options2.ranges) {
            node.range = [tokenStart2, index2];
          }
          if (options2.onCreateNode)
            options2.onCreateNode(node);
          comments2.push(node);
        }
      }
      function readLongString2() {
        var level = 0, content = "", terminator = false, character, stringStart;
        index2++;
        while ("=" === input2.charAt(index2 + level))
          level++;
        if ("[" !== input2.charAt(index2 + level))
          return false;
        index2 += level + 1;
        if (isLineTerminator2(input2.charCodeAt(index2)))
          consumeEOL2();
        stringStart = index2;
        while (index2 < length2) {
          if (isLineTerminator2(input2.charCodeAt(index2)))
            consumeEOL2();
          character = input2.charAt(index2++);
          if ("]" === character) {
            terminator = true;
            for (var i = 0; i < level; i++) {
              if ("=" !== input2.charAt(index2 + i))
                terminator = false;
            }
            if ("]" !== input2.charAt(index2 + level))
              terminator = false;
          }
          if (terminator)
            break;
        }
        content += input2.slice(stringStart, index2 - 1);
        index2 += level + 1;
        return content;
      }
      function next2() {
        previousToken2 = token2;
        token2 = lookahead2;
        lookahead2 = lex2();
      }
      function consume2(value) {
        if (value === token2.value) {
          next2();
          return true;
        }
        return false;
      }
      function expect2(value) {
        if (value === token2.value)
          next2();
        else
          raise2(token2, errors2.expected, value, token2.value);
      }
      function isWhiteSpace2(charCode) {
        return 9 === charCode || 32 === charCode || 11 === charCode || 12 === charCode;
      }
      function isLineTerminator2(charCode) {
        return 10 === charCode || 13 === charCode;
      }
      function isDecDigit2(charCode) {
        return charCode >= 48 && charCode <= 57;
      }
      function isHexDigit2(charCode) {
        return charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70;
      }
      function isIdentifierStart2(charCode) {
        return charCode >= 65 && charCode <= 90 || charCode >= 97 && charCode <= 122 || 95 === charCode;
      }
      function isIdentifierPart2(charCode) {
        return charCode >= 65 && charCode <= 90 || charCode >= 97 && charCode <= 122 || 95 === charCode || charCode >= 48 && charCode <= 57;
      }
      function isKeyword2(id) {
        switch (id.length) {
          case 2:
            return "do" === id || "if" === id || "in" === id || "or" === id;
          case 3:
            return "and" === id || "end" === id || "for" === id || "not" === id;
          case 4:
            return "else" === id || "goto" === id || "then" === id;
          case 5:
            return "break" === id || "local" === id || "until" === id || "while" === id;
          case 6:
            return "elseif" === id || "repeat" === id || "return" === id;
          case 8:
            return "function" === id;
        }
        return false;
      }
      function isUnary2(token3) {
        if (Punctuator2 === token3.type)
          return "#-~".indexOf(token3.value) >= 0;
        if (Keyword2 === token3.type)
          return "not" === token3.value;
        return false;
      }
      function isCallExpression(expression) {
        switch (expression.type) {
          case "CallExpression":
          case "TableCallExpression":
          case "StringCallExpression":
            return true;
        }
        return false;
      }
      function isBlockFollow2(token3) {
        if (EOF2 === token3.type)
          return true;
        if (Keyword2 !== token3.type)
          return false;
        switch (token3.value) {
          case "else":
          case "elseif":
          case "end":
          case "until":
            return true;
          default:
            return false;
        }
      }
      var scopes2, scopeDepth2, globals2;
      function createScope2() {
        var scope = Array.apply(null, scopes2[scopeDepth2++]);
        scopes2.push(scope);
        if (options2.onCreateScope)
          options2.onCreateScope();
      }
      function destroyScope2() {
        var scope = scopes2.pop();
        scopeDepth2--;
        if (options2.onDestroyScope)
          options2.onDestroyScope();
      }
      function scopeIdentifierName2(name) {
        if (-1 !== indexOf2(scopes2[scopeDepth2], name))
          return;
        scopes2[scopeDepth2].push(name);
      }
      function scopeIdentifier2(node) {
        scopeIdentifierName2(node.name);
        attachScope2(node, true);
      }
      function attachScope2(node, isLocal) {
        if (!isLocal && -1 === indexOfObject2(globals2, "name", node.name))
          globals2.push(node);
        node.isLocal = isLocal;
      }
      function scopeHasName2(name) {
        return -1 !== indexOf2(scopes2[scopeDepth2], name);
      }
      var locations2 = [], trackLocations2;
      function createLocationMarker2() {
        return new Marker2(token2);
      }
      function Marker2(token3) {
        if (options2.locations) {
          this.loc = {
            start: {
              line: token3.line,
              column: token3.range[0] - token3.lineStart
            },
            end: {
              line: 0,
              column: 0
            }
          };
        }
        if (options2.ranges)
          this.range = [token3.range[0], 0];
      }
      Marker2.prototype.complete = function() {
        if (options2.locations) {
          this.loc.end.line = previousToken2.line;
          this.loc.end.column = previousToken2.range[1] - previousToken2.lineStart;
        }
        if (options2.ranges) {
          this.range[1] = previousToken2.range[1];
        }
      };
      function markLocation2() {
        if (trackLocations2)
          locations2.push(createLocationMarker2());
      }
      function pushLocation2(marker) {
        if (trackLocations2)
          locations2.push(marker);
      }
      function parseChunk2() {
        next2();
        markLocation2();
        if (options2.scope)
          createScope2();
        var body = parseBlock2();
        if (options2.scope)
          destroyScope2();
        if (EOF2 !== token2.type)
          unexpected2(token2);
        if (trackLocations2 && !body.length)
          previousToken2 = token2;
        return finishNode2(ast7.chunk(body));
      }
      function parseBlock2(terminator) {
        var block = [], statement;
        while (!isBlockFollow2(token2)) {
          if ("return" === token2.value) {
            block.push(parseStatement2());
            break;
          }
          statement = parseStatement2();
          if (statement)
            block.push(statement);
        }
        return block;
      }
      function parseStatement2() {
        markLocation2();
        if (Keyword2 === token2.type) {
          switch (token2.value) {
            case "local":
              next2();
              return parseLocalStatement2();
            case "if":
              next2();
              return parseIfStatement2();
            case "return":
              next2();
              return parseReturnStatement2();
            case "function":
              next2();
              var name = parseFunctionName2();
              return parseFunctionDeclaration2(name);
            case "while":
              next2();
              return parseWhileStatement2();
            case "for":
              next2();
              return parseForStatement2();
            case "repeat":
              next2();
              return parseRepeatStatement2();
            case "break":
              next2();
              return parseBreakStatement2();
            case "do":
              next2();
              return parseDoStatement2();
            case "goto":
              next2();
              return parseGotoStatement2();
          }
        }
        if (Punctuator2 === token2.type) {
          if (consume2("::"))
            return parseLabelStatement2();
        }
        if (trackLocations2)
          locations2.pop();
        if (consume2(";"))
          return;
        return parseAssignmentOrCallStatement();
      }
      function parseLabelStatement2() {
        var name = token2.value, label = parseIdentifier2();
        if (options2.scope) {
          scopeIdentifierName2("::" + name + "::");
          attachScope2(label, true);
        }
        expect2("::");
        return finishNode2(ast7.labelStatement(label));
      }
      function parseBreakStatement2() {
        return finishNode2(ast7.breakStatement());
      }
      function parseGotoStatement2() {
        var name = token2.value, label = parseIdentifier2();
        return finishNode2(ast7.gotoStatement(label));
      }
      function parseDoStatement2() {
        if (options2.scope)
          createScope2();
        var body = parseBlock2();
        if (options2.scope)
          destroyScope2();
        expect2("end");
        return finishNode2(ast7.doStatement(body));
      }
      function parseWhileStatement2() {
        var condition = parseExpectedExpression2();
        expect2("do");
        if (options2.scope)
          createScope2();
        var body = parseBlock2();
        if (options2.scope)
          destroyScope2();
        expect2("end");
        return finishNode2(ast7.whileStatement(condition, body));
      }
      function parseRepeatStatement2() {
        if (options2.scope)
          createScope2();
        var body = parseBlock2();
        expect2("until");
        var condition = parseExpectedExpression2();
        if (options2.scope)
          destroyScope2();
        return finishNode2(ast7.repeatStatement(condition, body));
      }
      function parseReturnStatement2() {
        var expressions = [];
        if ("end" !== token2.value) {
          var expression = parseExpression2();
          if (null != expression)
            expressions.push(expression);
          while (consume2(",")) {
            expression = parseExpectedExpression2();
            expressions.push(expression);
          }
          consume2(";");
        }
        return finishNode2(ast7.returnStatement(expressions));
      }
      function parseIfStatement2() {
        var clauses = [], condition, body, marker;
        if (trackLocations2) {
          marker = locations2[locations2.length - 1];
          locations2.push(marker);
        }
        condition = parseExpectedExpression2();
        expect2("then");
        if (options2.scope)
          createScope2();
        body = parseBlock2();
        if (options2.scope)
          destroyScope2();
        clauses.push(finishNode2(ast7.ifClause(condition, body)));
        if (trackLocations2)
          marker = createLocationMarker2();
        while (consume2("elseif")) {
          pushLocation2(marker);
          condition = parseExpectedExpression2();
          expect2("then");
          if (options2.scope)
            createScope2();
          body = parseBlock2();
          if (options2.scope)
            destroyScope2();
          clauses.push(finishNode2(ast7.elseifClause(condition, body)));
          if (trackLocations2)
            marker = createLocationMarker2();
        }
        if (consume2("else")) {
          if (trackLocations2) {
            marker = new Marker2(previousToken2);
            locations2.push(marker);
          }
          if (options2.scope)
            createScope2();
          body = parseBlock2();
          if (options2.scope)
            destroyScope2();
          clauses.push(finishNode2(ast7.elseClause(body)));
        }
        expect2("end");
        return finishNode2(ast7.ifStatement(clauses));
      }
      function parseForStatement2() {
        var variable = parseIdentifier2(), body;
        if (options2.scope) {
          createScope2();
          scopeIdentifier2(variable);
        }
        if (consume2("=")) {
          var start = parseExpectedExpression2();
          expect2(",");
          var end3 = parseExpectedExpression2();
          var step = consume2(",") ? parseExpectedExpression2() : null;
          expect2("do");
          body = parseBlock2();
          expect2("end");
          if (options2.scope)
            destroyScope2();
          return finishNode2(ast7.forNumericStatement(variable, start, end3, step, body));
        } else {
          var variables = [variable];
          while (consume2(",")) {
            variable = parseIdentifier2();
            if (options2.scope)
              scopeIdentifier2(variable);
            variables.push(variable);
          }
          expect2("in");
          var iterators = [];
          do {
            var expression = parseExpectedExpression2();
            iterators.push(expression);
          } while (consume2(","));
          expect2("do");
          body = parseBlock2();
          expect2("end");
          if (options2.scope)
            destroyScope2();
          return finishNode2(ast7.forGenericStatement(variables, iterators, body));
        }
      }
      function parseLocalStatement2() {
        var name;
        if (Identifier2 === token2.type) {
          var variables = [], init = [];
          do {
            name = parseIdentifier2();
            variables.push(name);
          } while (consume2(","));
          if (consume2("=")) {
            do {
              var expression = parseExpectedExpression2();
              init.push(expression);
            } while (consume2(","));
          }
          if (options2.scope) {
            for (var i = 0, l = variables.length; i < l; i++) {
              scopeIdentifier2(variables[i]);
            }
          }
          return finishNode2(ast7.localStatement(variables, init));
        }
        if (consume2("function")) {
          name = parseIdentifier2();
          if (options2.scope) {
            scopeIdentifier2(name);
            createScope2();
          }
          return parseFunctionDeclaration2(name, true);
        } else {
          raiseUnexpectedToken2("<name>", token2);
        }
      }
      function validateVar(node) {
        if (node.inParens || ["Identifier", "MemberExpression", "IndexExpression"].indexOf(node.type) === -1) {
          raise2(token2, errors2.invalidVar, token2.value);
        }
      }
      function parseAssignmentOrCallStatement() {
        var previous = token2, expression, marker;
        if (trackLocations2)
          marker = createLocationMarker2();
        expression = parsePrefixExpression2();
        if (null == expression)
          return unexpected2(token2);
        if (",=".indexOf(token2.value) >= 0) {
          var variables = [expression], init = [], exp;
          validateVar(expression);
          while (consume2(",")) {
            exp = parsePrefixExpression2();
            if (null == exp)
              raiseUnexpectedToken2("<expression>", token2);
            validateVar(exp);
            variables.push(exp);
          }
          expect2("=");
          do {
            exp = parseExpectedExpression2();
            init.push(exp);
          } while (consume2(","));
          pushLocation2(marker);
          return finishNode2(ast7.assignmentStatement(variables, init));
        }
        if (isCallExpression(expression)) {
          pushLocation2(marker);
          return finishNode2(ast7.callStatement(expression));
        }
        return unexpected2(previous);
      }
      function parseIdentifier2() {
        markLocation2();
        var identifier = token2.value;
        if (Identifier2 !== token2.type)
          raiseUnexpectedToken2("<name>", token2);
        next2();
        return finishNode2(ast7.identifier(identifier));
      }
      function parseFunctionDeclaration2(name, isLocal) {
        var parameters = [];
        expect2("(");
        if (!consume2(")")) {
          while (true) {
            if (Identifier2 === token2.type) {
              var parameter = parseIdentifier2();
              if (options2.scope)
                scopeIdentifier2(parameter);
              parameters.push(parameter);
              if (consume2(","))
                continue;
              else if (consume2(")"))
                break;
            } else if (VarargLiteral2 === token2.type) {
              parameters.push(parsePrimaryExpression2());
              expect2(")");
              break;
            } else {
              raiseUnexpectedToken2("<name> or '...'", token2);
            }
          }
        }
        var body = parseBlock2();
        expect2("end");
        if (options2.scope)
          destroyScope2();
        isLocal = isLocal || false;
        return finishNode2(ast7.functionStatement(name, parameters, isLocal, body));
      }
      function parseFunctionName2() {
        var base, name, marker;
        if (trackLocations2)
          marker = createLocationMarker2();
        base = parseIdentifier2();
        if (options2.scope) {
          attachScope2(base, scopeHasName2(base.name));
          createScope2();
        }
        while (consume2(".")) {
          pushLocation2(marker);
          name = parseIdentifier2();
          base = finishNode2(ast7.memberExpression(base, ".", name));
        }
        if (consume2(":")) {
          pushLocation2(marker);
          name = parseIdentifier2();
          base = finishNode2(ast7.memberExpression(base, ":", name));
          if (options2.scope)
            scopeIdentifierName2("self");
        }
        return base;
      }
      function parseTableConstructor2() {
        var fields = [], key, value;
        while (true) {
          markLocation2();
          if (Punctuator2 === token2.type && consume2("[")) {
            key = parseExpectedExpression2();
            expect2("]");
            expect2("=");
            value = parseExpectedExpression2();
            fields.push(finishNode2(ast7.tableKey(key, value)));
          } else if (Identifier2 === token2.type) {
            if ("=" === lookahead2.value) {
              key = parseIdentifier2();
              next2();
              value = parseExpectedExpression2();
              fields.push(finishNode2(ast7.tableKeyString(key, value)));
            } else {
              value = parseExpectedExpression2();
              fields.push(finishNode2(ast7.tableValue(value)));
            }
          } else {
            if (null == (value = parseExpression2())) {
              locations2.pop();
              break;
            }
            fields.push(finishNode2(ast7.tableValue(value)));
          }
          if (",;".indexOf(token2.value) >= 0) {
            next2();
            continue;
          }
          break;
        }
        expect2("}");
        return finishNode2(ast7.tableConstructorExpression(fields));
      }
      function parseExpression2() {
        var expression = parseSubExpression2(0);
        return expression;
      }
      function parseExpectedExpression2() {
        var expression = parseExpression2();
        if (null == expression)
          raiseUnexpectedToken2("<expression>", token2);
        else
          return expression;
      }
      function binaryPrecedence2(operator) {
        var charCode = operator.charCodeAt(0), length3 = operator.length;
        if (1 === length3) {
          switch (charCode) {
            case 94:
              return 12;
            case 42:
            case 47:
            case 37:
              return 10;
            case 43:
            case 45:
              return 9;
            case 38:
              return 6;
            case 126:
              return 5;
            case 124:
              return 4;
            case 60:
            case 62:
              return 3;
          }
        } else if (2 === length3) {
          switch (charCode) {
            case 47:
              return 10;
            case 46:
              return 8;
            case 60:
            case 62:
              if ("<<" === operator || ">>" === operator)
                return 7;
              return 3;
            case 61:
            case 126:
              return 3;
            case 111:
              return 1;
          }
        } else if (97 === charCode && "and" === operator)
          return 2;
        return 0;
      }
      function parseSubExpression2(minPrecedence) {
        var operator = token2.value, expression, marker;
        if (trackLocations2)
          marker = createLocationMarker2();
        if (isUnary2(token2)) {
          markLocation2();
          next2();
          var argument = parseSubExpression2(10);
          if (argument == null)
            raiseUnexpectedToken2("<expression>", token2);
          expression = finishNode2(ast7.unaryExpression(operator, argument));
        }
        if (null == expression) {
          expression = parsePrimaryExpression2();
          if (null == expression) {
            expression = parsePrefixExpression2();
          }
        }
        if (null == expression)
          return null;
        var precedence;
        while (true) {
          operator = token2.value;
          precedence = Punctuator2 === token2.type || Keyword2 === token2.type ? binaryPrecedence2(operator) : 0;
          if (precedence === 0 || precedence <= minPrecedence)
            break;
          if ("^" === operator || ".." === operator)
            precedence--;
          next2();
          var right = parseSubExpression2(precedence);
          if (null == right)
            raiseUnexpectedToken2("<expression>", token2);
          if (trackLocations2)
            locations2.push(marker);
          expression = finishNode2(ast7.binaryExpression(operator, expression, right));
        }
        return expression;
      }
      function parsePrefixExpression2() {
        var base, name, marker;
        if (trackLocations2)
          marker = createLocationMarker2();
        if (Identifier2 === token2.type) {
          name = token2.value;
          base = parseIdentifier2();
          if (options2.scope)
            attachScope2(base, scopeHasName2(name));
        } else if (consume2("(")) {
          base = parseExpectedExpression2();
          expect2(")");
          base.inParens = true;
        } else {
          return null;
        }
        var expression, identifier;
        while (true) {
          if (Punctuator2 === token2.type) {
            switch (token2.value) {
              case "[":
                pushLocation2(marker);
                next2();
                expression = parseExpectedExpression2();
                base = finishNode2(ast7.indexExpression(base, expression));
                expect2("]");
                break;
              case ".":
                pushLocation2(marker);
                next2();
                identifier = parseIdentifier2();
                base = finishNode2(ast7.memberExpression(base, ".", identifier));
                break;
              case ":":
                pushLocation2(marker);
                next2();
                identifier = parseIdentifier2();
                base = finishNode2(ast7.memberExpression(base, ":", identifier));
                pushLocation2(marker);
                base = parseCallExpression2(base);
                break;
              case "(":
              case "{":
                pushLocation2(marker);
                base = parseCallExpression2(base);
                break;
              default:
                return base;
            }
          } else if (StringLiteral2 === token2.type) {
            pushLocation2(marker);
            base = parseCallExpression2(base);
          } else {
            break;
          }
        }
        return base;
      }
      function parseCallExpression2(base) {
        if (Punctuator2 === token2.type) {
          switch (token2.value) {
            case "(":
              next2();
              var expressions = [];
              var expression = parseExpression2();
              if (null != expression)
                expressions.push(expression);
              while (consume2(",")) {
                expression = parseExpectedExpression2();
                expressions.push(expression);
              }
              expect2(")");
              return finishNode2(ast7.callExpression(base, expressions));
            case "{":
              markLocation2();
              next2();
              var table = parseTableConstructor2();
              return finishNode2(ast7.tableCallExpression(base, table));
          }
        } else if (StringLiteral2 === token2.type) {
          return finishNode2(ast7.stringCallExpression(base, parsePrimaryExpression2()));
        }
        raiseUnexpectedToken2("function arguments", token2);
      }
      function parsePrimaryExpression2() {
        var literals = StringLiteral2 | NumericLiteral2 | BooleanLiteral2 | NilLiteral2 | VarargLiteral2, value = token2.value, type = token2.type, marker;
        if (trackLocations2)
          marker = createLocationMarker2();
        if (type & literals) {
          pushLocation2(marker);
          var raw = input2.slice(token2.range[0], token2.range[1]);
          next2();
          return finishNode2(ast7.literal(type, value, raw));
        } else if (Keyword2 === type && "function" === value) {
          pushLocation2(marker);
          next2();
          if (options2.scope)
            createScope2();
          return parseFunctionDeclaration2(null);
        } else if (consume2("{")) {
          pushLocation2(marker);
          return parseTableConstructor2();
        }
      }
      exports2.parse = parse2;
      function parse2(_input, _options) {
        if ("undefined" === typeof _options && "object" === typeof _input) {
          _options = _input;
          _input = void 0;
        }
        if (!_options)
          _options = {};
        input2 = _input || "";
        options2 = extend(defaultOptions2, _options);
        index2 = 0;
        line2 = 1;
        lineStart2 = 0;
        length2 = input2.length;
        scopes2 = [[]];
        scopeDepth2 = 0;
        globals2 = [];
        locations2 = [];
        if (options2.comments)
          comments2 = [];
        if (!options2.wait)
          return end2();
        return exports2;
      }
      exports2.write = write2;
      function write2(_input) {
        input2 += String(_input);
        length2 = input2.length;
        return exports2;
      }
      exports2.end = end2;
      function end2(_input) {
        if ("undefined" !== typeof _input)
          write2(_input);
        if (input2 && input2.substr(0, 2) === "#!")
          input2 = input2.replace(/^.*/, function(line3) {
            return line3.replace(/./g, " ");
          });
        length2 = input2.length;
        trackLocations2 = options2.locations || options2.ranges;
        lookahead2 = lex2();
        var chunk = parseChunk2();
        if (options2.comments)
          chunk.comments = comments2;
        if (options2.scope)
          chunk.globals = globals2;
        if (locations2.length > 0)
          throw new Error("Location tracking failed. This is most likely a bug in luaparse");
        return chunk;
      }
    });
  }
});

// node_modules/luamin/luamin.js
var require_luamin = __commonJS({
  "node_modules/luamin/luamin.js"(exports, module2) {
    (function(root) {
      var freeExports = typeof exports == "object" && exports;
      var freeModule = typeof module2 == "object" && module2 && module2.exports == freeExports && module2;
      var freeGlobal = typeof global == "object" && global;
      if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
        root = freeGlobal;
      }
      var luaparse = root.luaparse || require_luaparse();
      luaparse.defaultOptions.comments = false;
      luaparse.defaultOptions.scope = true;
      var parse2 = luaparse.parse;
      var regexAlphaUnderscore = /[a-zA-Z_]/;
      var regexAlphaNumUnderscore = /[a-zA-Z0-9_]/;
      var regexDigits = /[0-9]/;
      var PRECEDENCE = {
        "or": 1,
        "and": 2,
        "<": 3,
        ">": 3,
        "<=": 3,
        ">=": 3,
        "~=": 3,
        "==": 3,
        "..": 5,
        "+": 6,
        "-": 6,
        // binary -
        "*": 7,
        "/": 7,
        "%": 7,
        "unarynot": 8,
        "unary#": 8,
        "unary-": 8,
        // unary -
        "^": 10
      };
      var IDENTIFIER_PARTS = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "_"
      ];
      var IDENTIFIER_PARTS_MAX = IDENTIFIER_PARTS.length - 1;
      var each = function(array, fn) {
        var index2 = -1;
        var length2 = array.length;
        var max = length2 - 1;
        while (++index2 < length2) {
          fn(array[index2], index2 < max);
        }
      };
      var indexOf2 = function(array, value) {
        var index2 = -1;
        var length2 = array.length;
        while (++index2 < length2) {
          if (array[index2] == value) {
            return index2;
          }
        }
      };
      var hasOwnProperty = {}.hasOwnProperty;
      var extend = function(destination, source) {
        var key;
        if (source) {
          for (key in source) {
            if (hasOwnProperty.call(source, key)) {
              destination[key] = source[key];
            }
          }
        }
        return destination;
      };
      var generateZeroes = function(length2) {
        var zero = "0";
        var result = "";
        if (length2 < 1) {
          return result;
        }
        if (length2 == 1) {
          return zero;
        }
        while (length2) {
          if (length2 & 1) {
            result += zero;
          }
          if (length2 >>= 1) {
            zero += zero;
          }
        }
        return result;
      };
      function isKeyword2(id) {
        switch (id.length) {
          case 2:
            return "do" == id || "if" == id || "in" == id || "or" == id;
          case 3:
            return "and" == id || "end" == id || "for" == id || "nil" == id || "not" == id;
          case 4:
            return "else" == id || "goto" == id || "then" == id || "true" == id;
          case 5:
            return "break" == id || "false" == id || "local" == id || "until" == id || "while" == id;
          case 6:
            return "elseif" == id || "repeat" == id || "return" == id;
          case 8:
            return "function" == id;
        }
        return false;
      }
      var currentIdentifier;
      var identifierMap;
      var identifiersInUse;
      var generateIdentifier = function(originalName) {
        if (originalName == "self") {
          return originalName;
        }
        if (hasOwnProperty.call(identifierMap, originalName)) {
          return identifierMap[originalName];
        }
        var length2 = currentIdentifier.length;
        var position = length2 - 1;
        var character;
        var index2;
        while (position >= 0) {
          character = currentIdentifier.charAt(position);
          index2 = indexOf2(IDENTIFIER_PARTS, character);
          if (index2 != IDENTIFIER_PARTS_MAX) {
            currentIdentifier = currentIdentifier.substring(0, position) + IDENTIFIER_PARTS[index2 + 1] + generateZeroes(length2 - (position + 1));
            if (isKeyword2(currentIdentifier) || indexOf2(identifiersInUse, currentIdentifier) > -1) {
              return generateIdentifier(originalName);
            }
            identifierMap[originalName] = currentIdentifier;
            return currentIdentifier;
          }
          --position;
        }
        currentIdentifier = "a" + generateZeroes(length2);
        if (indexOf2(identifiersInUse, currentIdentifier) > -1) {
          return generateIdentifier(originalName);
        }
        identifierMap[originalName] = currentIdentifier;
        return currentIdentifier;
      };
      var joinStatements = function(a, b, separator) {
        separator || (separator = " ");
        var lastCharA = a.slice(-1);
        var firstCharB = b.charAt(0);
        if (lastCharA == "" || firstCharB == "") {
          return a + b;
        }
        if (regexAlphaUnderscore.test(lastCharA)) {
          if (regexAlphaNumUnderscore.test(firstCharB)) {
            return a + separator + b;
          } else {
            return a + b;
          }
        }
        if (regexDigits.test(lastCharA)) {
          if (firstCharB == "(" || !(firstCharB == "." || regexAlphaUnderscore.test(firstCharB))) {
            return a + b;
          } else {
            return a + separator + b;
          }
        }
        if (lastCharA == firstCharB && lastCharA == "-") {
          return a + separator + b;
        }
        return a + b;
      };
      var formatBase = function(base) {
        var result = "";
        var type = base.type;
        var needsParens = base.inParens && (type == "BinaryExpression" || type == "FunctionDeclaration" || type == "TableConstructorExpression" || type == "LogicalExpression" || type == "StringLiteral");
        if (needsParens) {
          result += "(";
        }
        result += formatExpression(base);
        if (needsParens) {
          result += ")";
        }
        return result;
      };
      var formatExpression = function(expression, options2) {
        options2 = extend({
          "precedence": 0,
          "preserveIdentifiers": false
        }, options2);
        var result = "";
        var currentPrecedence;
        var associativity;
        var operator;
        var expressionType = expression.type;
        if (expressionType == "Identifier") {
          result = expression.isLocal && !options2.preserveIdentifiers ? generateIdentifier(expression.name) : expression.name;
        } else if (expressionType == "StringLiteral" || expressionType == "NumericLiteral" || expressionType == "BooleanLiteral" || expressionType == "NilLiteral" || expressionType == "VarargLiteral") {
          result = expression.raw;
        } else if (expressionType == "LogicalExpression" || expressionType == "BinaryExpression") {
          operator = expression.operator;
          currentPrecedence = PRECEDENCE[operator];
          associativity = "left";
          result = formatExpression(expression.left, {
            "precedence": currentPrecedence,
            "direction": "left",
            "parent": operator
          });
          result = joinStatements(result, operator);
          result = joinStatements(result, formatExpression(expression.right, {
            "precedence": currentPrecedence,
            "direction": "right",
            "parent": operator
          }));
          if (operator == "^" || operator == "..") {
            associativity = "right";
          }
          if (currentPrecedence < options2.precedence || currentPrecedence == options2.precedence && associativity != options2.direction && options2.parent != "+" && !(options2.parent == "*" && (operator == "/" || operator == "*"))) {
            result = "(" + result + ")";
          }
        } else if (expressionType == "UnaryExpression") {
          operator = expression.operator;
          currentPrecedence = PRECEDENCE["unary" + operator];
          result = joinStatements(
            operator,
            formatExpression(expression.argument, {
              "precedence": currentPrecedence
            })
          );
          if (currentPrecedence < options2.precedence && // In principle, we should parenthesize the RHS of an
          // expression like `3^-2`, because `^` has higher precedence
          // than unary `-` according to the manual. But that is
          // misleading on the RHS of `^`, since the parser will
          // always try to find a unary operator regardless of
          // precedence.
          !(options2.parent == "^" && options2.direction == "right")) {
            result = "(" + result + ")";
          }
        } else if (expressionType == "CallExpression") {
          result = formatBase(expression.base) + "(";
          each(expression.arguments, function(argument, needsComma) {
            result += formatExpression(argument);
            if (needsComma) {
              result += ",";
            }
          });
          result += ")";
        } else if (expressionType == "TableCallExpression") {
          result = formatExpression(expression.base) + formatExpression(expression.arguments);
        } else if (expressionType == "StringCallExpression") {
          result = formatExpression(expression.base) + formatExpression(expression.argument);
        } else if (expressionType == "IndexExpression") {
          result = formatBase(expression.base) + "[" + formatExpression(expression.index) + "]";
        } else if (expressionType == "MemberExpression") {
          result = formatBase(expression.base) + expression.indexer + formatExpression(expression.identifier, {
            "preserveIdentifiers": true
          });
        } else if (expressionType == "FunctionDeclaration") {
          result = "function(";
          if (expression.parameters.length) {
            each(expression.parameters, function(parameter, needsComma) {
              result += parameter.name ? generateIdentifier(parameter.name) : parameter.value;
              if (needsComma) {
                result += ",";
              }
            });
          }
          result += ")";
          result = joinStatements(result, formatStatementList(expression.body));
          result = joinStatements(result, "end");
        } else if (expressionType == "TableConstructorExpression") {
          result = "{";
          each(expression.fields, function(field, needsComma) {
            if (field.type == "TableKey") {
              result += "[" + formatExpression(field.key) + "]=" + formatExpression(field.value);
            } else if (field.type == "TableValue") {
              result += formatExpression(field.value);
            } else {
              result += formatExpression(field.key, {
                // TODO: keep track of nested scopes (#18)
                "preserveIdentifiers": true
              }) + "=" + formatExpression(field.value);
            }
            if (needsComma) {
              result += ",";
            }
          });
          result += "}";
        } else {
          throw TypeError("Unknown expression type: `" + expressionType + "`");
        }
        return result;
      };
      var formatStatementList = function(body) {
        var result = "";
        each(body, function(statement) {
          result = joinStatements(result, formatStatement(statement), ";");
        });
        return result;
      };
      var formatStatement = function(statement) {
        var result = "";
        var statementType = statement.type;
        if (statementType == "AssignmentStatement") {
          each(statement.variables, function(variable, needsComma) {
            result += formatExpression(variable);
            if (needsComma) {
              result += ",";
            }
          });
          result += "=";
          each(statement.init, function(init, needsComma) {
            result += formatExpression(init);
            if (needsComma) {
              result += ",";
            }
          });
        } else if (statementType == "LocalStatement") {
          result = "local ";
          each(statement.variables, function(variable, needsComma) {
            result += generateIdentifier(variable.name);
            if (needsComma) {
              result += ",";
            }
          });
          if (statement.init.length) {
            result += "=";
            each(statement.init, function(init, needsComma) {
              result += formatExpression(init);
              if (needsComma) {
                result += ",";
              }
            });
          }
        } else if (statementType == "CallStatement") {
          result = formatExpression(statement.expression);
        } else if (statementType == "IfStatement") {
          result = joinStatements(
            "if",
            formatExpression(statement.clauses[0].condition)
          );
          result = joinStatements(result, "then");
          result = joinStatements(
            result,
            formatStatementList(statement.clauses[0].body)
          );
          each(statement.clauses.slice(1), function(clause) {
            if (clause.condition) {
              result = joinStatements(result, "elseif");
              result = joinStatements(result, formatExpression(clause.condition));
              result = joinStatements(result, "then");
            } else {
              result = joinStatements(result, "else");
            }
            result = joinStatements(result, formatStatementList(clause.body));
          });
          result = joinStatements(result, "end");
        } else if (statementType == "WhileStatement") {
          result = joinStatements("while", formatExpression(statement.condition));
          result = joinStatements(result, "do");
          result = joinStatements(result, formatStatementList(statement.body));
          result = joinStatements(result, "end");
        } else if (statementType == "DoStatement") {
          result = joinStatements("do", formatStatementList(statement.body));
          result = joinStatements(result, "end");
        } else if (statementType == "ReturnStatement") {
          result = "return";
          each(statement.arguments, function(argument, needsComma) {
            result = joinStatements(result, formatExpression(argument));
            if (needsComma) {
              result += ",";
            }
          });
        } else if (statementType == "BreakStatement") {
          result = "break";
        } else if (statementType == "RepeatStatement") {
          result = joinStatements("repeat", formatStatementList(statement.body));
          result = joinStatements(result, "until");
          result = joinStatements(result, formatExpression(statement.condition));
        } else if (statementType == "FunctionDeclaration") {
          result = (statement.isLocal ? "local " : "") + "function ";
          result += formatExpression(statement.identifier);
          result += "(";
          if (statement.parameters.length) {
            each(statement.parameters, function(parameter, needsComma) {
              result += parameter.name ? generateIdentifier(parameter.name) : parameter.value;
              if (needsComma) {
                result += ",";
              }
            });
          }
          result += ")";
          result = joinStatements(result, formatStatementList(statement.body));
          result = joinStatements(result, "end");
        } else if (statementType == "ForGenericStatement") {
          result = "for ";
          each(statement.variables, function(variable, needsComma) {
            result += generateIdentifier(variable.name);
            if (needsComma) {
              result += ",";
            }
          });
          result += " in";
          each(statement.iterators, function(iterator, needsComma) {
            result = joinStatements(result, formatExpression(iterator));
            if (needsComma) {
              result += ",";
            }
          });
          result = joinStatements(result, "do");
          result = joinStatements(result, formatStatementList(statement.body));
          result = joinStatements(result, "end");
        } else if (statementType == "ForNumericStatement") {
          result = "for " + generateIdentifier(statement.variable.name) + "=";
          result += formatExpression(statement.start) + "," + formatExpression(statement.end);
          if (statement.step) {
            result += "," + formatExpression(statement.step);
          }
          result = joinStatements(result, "do");
          result = joinStatements(result, formatStatementList(statement.body));
          result = joinStatements(result, "end");
        } else if (statementType == "LabelStatement") {
          result = "::" + generateIdentifier(statement.label.name) + "::";
        } else if (statementType == "GotoStatement") {
          result = "goto " + generateIdentifier(statement.label.name);
        } else {
          throw TypeError("Unknown statement type: `" + statementType + "`");
        }
        return result;
      };
      var minify = function(argument) {
        var ast7 = typeof argument == "string" ? parse2(argument) : argument;
        identifierMap = {};
        identifiersInUse = [];
        currentIdentifier = "9";
        if (ast7.globals) {
          each(ast7.globals, function(object) {
            var name = object.name;
            identifierMap[name] = name;
            identifiersInUse.push(name);
          });
        } else {
          throw Error("Missing required AST property: `globals`");
        }
        return formatStatementList(ast7.body);
      };
      var luamin3 = {
        "version": "1.0.4",
        "minify": minify
      };
      if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
        define(function() {
          return luamin3;
        });
      } else if (freeExports && !freeExports.nodeType) {
        if (freeModule) {
          freeModule.exports = luamin3;
        } else {
          extend(freeExports, luamin3);
        }
      } else {
        root.luamin = luamin3;
      }
    })(exports);
  }
});

// functions/api.js
var api_exports = {};
__export(api_exports, {
  preprocess: () => preprocess,
  preprocessFile: () => preprocessFile,
  preprocessFileSync: () => preprocessFileSync,
  preprocessSync: () => preprocessSync
});
module.exports = __toCommonJS(api_exports);

// features/leapparse.js
var _exports = {};
_exports.version = "0.3.1";
var input;
var options;
var length;
var features;
var encodingMode;
var defaultOptions = _exports.defaultOptions = {
  // Explicitly tell the parser when the input ends.
  wait: false,
  comments: true,
  scope: false,
  locations: false,
  ranges: false,
  onCreateNode: null,
  onCreateScope: null,
  onDestroyScope: null,
  onLocalDeclaration: null,
  luaVersion: "5.1",
  encodingMode: "none"
};
function encodeUTF8(codepoint, highMask) {
  highMask = highMask || 0;
  if (codepoint < 128) {
    return String.fromCharCode(codepoint);
  } else if (codepoint < 2048) {
    return String.fromCharCode(
      highMask | 192 | codepoint >> 6,
      highMask | 128 | codepoint & 63
    );
  } else if (codepoint < 65536) {
    return String.fromCharCode(
      highMask | 224 | codepoint >> 12,
      highMask | 128 | codepoint >> 6 & 63,
      highMask | 128 | codepoint & 63
    );
  } else if (codepoint < 2097152) {
    return String.fromCharCode(
      highMask | 240 | codepoint >> 18,
      highMask | 128 | codepoint >> 12 & 63,
      highMask | 128 | codepoint >> 6 & 63,
      highMask | 128 | codepoint & 63
    );
  } else if (codepoint < 67108864) {
    return String.fromCharCode(
      highMask | 248 | codepoint >> 24,
      highMask | 128 | codepoint >> 18 & 63,
      highMask | 128 | codepoint >> 12 & 63,
      highMask | 128 | codepoint >> 6 & 63,
      highMask | 128 | codepoint & 63
    );
  } else if (codepoint <= 2147483647) {
    return String.fromCharCode(
      highMask | 252 | codepoint >> 30,
      highMask | 128 | codepoint >> 24 & 63,
      highMask | 128 | codepoint >> 18 & 63,
      highMask | 128 | codepoint >> 12 & 63,
      highMask | 128 | codepoint >> 6 & 63,
      highMask | 128 | codepoint & 63
    );
  } else {
    throw new Error("Should not happen");
  }
}
function toHex(num, digits) {
  var result = num.toString(16);
  while (result.length < digits)
    result = "0" + result;
  return result;
}
function checkChars(rx) {
  return function(s) {
    var m = rx.exec(s);
    if (!m)
      return s;
    raise(null, errors.invalidCodeUnit, toHex(m[0].charCodeAt(0), 4).toUpperCase());
  };
}
var encodingModes = {
  // `pseudo-latin1` encoding mode: assume the input was decoded with the latin1 encoding
  // WARNING: latin1 does **NOT** mean cp1252 here like in the bone-headed WHATWG standard;
  // it means true ISO/IEC 8859-1 identity-mapped to Basic Latin and Latin-1 Supplement blocks
  "pseudo-latin1": {
    fixup: checkChars(/[^\x00-\xff]/),
    encodeByte: function(value) {
      if (value === null)
        return "";
      return String.fromCharCode(value);
    },
    encodeUTF8: function(codepoint) {
      return encodeUTF8(codepoint);
    }
  },
  // `x-user-defined` encoding mode: assume the input was decoded with the WHATWG `x-user-defined` encoding
  "x-user-defined": {
    fixup: checkChars(/[^\x00-\x7f\uf780-\uf7ff]/),
    encodeByte: function(value) {
      if (value === null)
        return "";
      if (value >= 128)
        return String.fromCharCode(value | 63232);
      return String.fromCharCode(value);
    },
    encodeUTF8: function(codepoint) {
      return encodeUTF8(codepoint, 63232);
    }
  },
  // `none` encoding mode: disregard intrepretation of string literals, leave identifiers as-is
  "none": {
    discardStrings: true,
    fixup: function(s) {
      return s;
    },
    encodeByte: function(value) {
      return "";
    },
    encodeUTF8: function(codepoint) {
      return "";
    }
  }
};
var EOF = 1;
var StringLiteral = 2;
var Keyword = 4;
var Identifier = 8;
var NumericLiteral = 16;
var Punctuator = 32;
var BooleanLiteral = 64;
var NilLiteral = 128;
var VarargLiteral = 256;
var StringHashLiteral = 512;
_exports.tokenTypes = {
  EOF,
  StringLiteral,
  StringHashLiteral,
  Keyword,
  Identifier,
  NumericLiteral,
  Punctuator,
  BooleanLiteral,
  NilLiteral,
  VarargLiteral
};
var errors = _exports.errors = {
  unexpected: "unexpected %1 '%2' near '%3'",
  unexpectedEOF: "unexpected symbol near '<eof>'",
  expected: "'%1' expected near '%2'",
  expectedToken: "%1 expected near '%2'",
  unfinishedString: "unfinished string near '%1'",
  malformedNumber: "malformed number near '%1'",
  decimalEscapeTooLarge: "decimal escape too large near '%1'",
  invalidEscape: "invalid escape sequence near '%1'",
  hexadecimalDigitExpected: "hexadecimal digit expected near '%1'",
  braceExpected: "missing '%1' near '%2'",
  tooLargeCodepoint: "UTF-8 value too large near '%1'",
  unfinishedLongString: "unfinished long string (starting at line %1) near '%2'",
  unfinishedLongComment: "unfinished long comment (starting at line %1) near '%2'",
  ambiguousSyntax: "ambiguous syntax (function call x new statement) near '%1'",
  noLoopToBreak: "no loop to break near '%1'",
  labelAlreadyDefined: "label '%1' already defined on line %2",
  labelNotVisible: "no visible label '%1' for <goto>",
  gotoJumpInLocalScope: "<goto %1> jumps into the scope of local '%2'",
  cannotUseVararg: "cannot use '...' outside a vararg function near '%1'",
  invalidCodeUnit: "code unit U+%1 is not allowed in the current encoding mode",
  unknownAttribute: "unknown attribute '%1'",
  compoundAssignment: "compound assignment with mulitple variables is not supported near '%1'"
};
var ast = _exports.ast = {
  labelStatement: function(label) {
    return {
      type: "LabelStatement",
      label
    };
  },
  breakStatement: function() {
    return {
      type: "BreakStatement"
    };
  },
  gotoStatement: function(label) {
    return {
      type: "GotoStatement",
      label
    };
  },
  decoratorStatement: function(base, args) {
    return {
      type: "DecoratorStatement",
      base,
      "arguments": args
    };
  },
  returnStatement: function(args) {
    return {
      type: "ReturnStatement",
      "arguments": args
    };
  },
  newStatement: function(expression) {
    return {
      type: "NewStatement"
    };
  },
  ifStatement: function(clauses) {
    return {
      type: "IfStatement",
      clauses
    };
  },
  ifClause: function(condition, body) {
    return {
      type: "IfClause",
      condition,
      body
    };
  },
  elseifClause: function(condition, body) {
    return {
      type: "ElseifClause",
      condition,
      body
    };
  },
  elseClause: function(body) {
    return {
      type: "ElseClause",
      body
    };
  },
  whileStatement: function(condition, body) {
    return {
      type: "WhileStatement",
      condition,
      body
    };
  },
  doStatement: function(body) {
    return {
      type: "DoStatement",
      body
    };
  },
  repeatStatement: function(condition, body) {
    return {
      type: "RepeatStatement",
      condition,
      body
    };
  },
  localStatement: function(variables, init) {
    return {
      type: "LocalStatement",
      variables,
      init
    };
  },
  inStatement: function(left, right) {
    return {
      type: "InStatement",
      left,
      right
    };
  },
  classStatement: function(identifier, body, extend) {
    return {
      type: "ClassStatement",
      identifier,
      body,
      extends: extend
    };
  },
  unpackStatement: function(table, variables) {
    return {
      type: "UnpackStatement",
      table,
      variables
    };
  },
  assignmentStatement: function(variables, init) {
    return {
      type: "AssignmentStatement",
      variables,
      init
    };
  },
  compoundAssignmentStatement: function(operator, variable, init) {
    return {
      type: "CompoundAssignmentStatement",
      operator,
      variable,
      init
    };
  },
  callStatement: function(expression) {
    return {
      type: "CallStatement",
      expression
    };
  },
  functionStatement: function(identifier, parameters, isLocal, body) {
    return {
      type: "FunctionDeclaration",
      identifier,
      isLocal,
      parameters,
      body
    };
  },
  arrowFunctionStatement: function(parameters, body) {
    return {
      type: "ArrowFunctionStatement",
      parameters,
      body
    };
  },
  forNumericStatement: function(variable, start, end2, step, body) {
    return {
      type: "ForNumericStatement",
      variable,
      start,
      end: end2,
      step,
      body
    };
  },
  forGenericStatement: function(variables, iterators, body) {
    return {
      type: "ForGenericStatement",
      variables,
      iterators,
      body
    };
  },
  tableComprehensionStatement: function(variables, iterators, statements, conditions) {
    return {
      type: "TableComprehensionStatement",
      variables,
      iterators,
      statements,
      conditions
    };
  },
  chunk: function(body) {
    return {
      type: "Chunk",
      body
    };
  },
  attribute: function(name) {
    return {
      type: "Attribute",
      name
    };
  },
  typeAttribute: function(name) {
    return {
      type: "TypeAttribute",
      name
    };
  },
  identifier: function(name) {
    return {
      type: "Identifier",
      name
    };
  },
  defaultParameterValue: function(parameter, expression) {
    return {
      type: "DefaultParameterValue",
      parameter,
      expression
    };
  },
  identifierWithAttribute: function(name, attribute) {
    return {
      type: "IdentifierWithAttribute",
      name,
      attribute
    };
  },
  identifierWithTypeAttribute: function(name, attribute) {
    return {
      type: "IdentifierWithTypeAttribute",
      name,
      attribute
    };
  },
  literal: function(type, value, raw) {
    type = type === StringLiteral ? "StringLiteral" : type === NumericLiteral ? "NumericLiteral" : type === BooleanLiteral ? "BooleanLiteral" : type === NilLiteral ? "NilLiteral" : type === StringHashLiteral ? "StringHashLiteral" : "VarargLiteral";
    return {
      type,
      value,
      raw
    };
  },
  tableKey: function(key, value) {
    return {
      type: "TableKey",
      key,
      value
    };
  },
  tableKeyString: function(key, value) {
    return {
      type: "TableKeyString",
      key,
      value
    };
  },
  tableValue: function(value) {
    return {
      type: "TableValue",
      value
    };
  },
  tableConstructorExpression: function(fields) {
    return {
      type: "TableConstructorExpression",
      fields
    };
  },
  binaryExpression: function(operator, left, right) {
    var type = "and" === operator || "or" === operator ? "LogicalExpression" : "BinaryExpression";
    return {
      type,
      operator,
      left,
      right
    };
  },
  unaryExpression: function(operator, argument) {
    return {
      type: "UnaryExpression",
      operator,
      argument
    };
  },
  memberExpression: function(base, indexer, identifier) {
    return {
      type: "MemberExpression",
      indexer,
      identifier,
      base
    };
  },
  indexExpression: function(base, index2) {
    return {
      type: "IndexExpression",
      base,
      index: index2
    };
  },
  callExpression: function(base, args) {
    return {
      type: "CallExpression",
      base,
      "arguments": args
    };
  },
  tableCallExpression: function(base, args) {
    return {
      type: "TableCallExpression",
      base,
      "arguments": args,
      argument: args
    };
  },
  stringCallExpression: function(base, argument) {
    return {
      type: "StringCallExpression",
      base,
      argument
    };
  },
  comment: function(value, raw) {
    return {
      type: "Comment",
      value,
      raw
    };
  }
};
function finishNode(node) {
  if (trackLocations) {
    var location = locations.pop();
    location.complete();
    location.bless(node);
  }
  if (options.onCreateNode)
    options.onCreateNode(node);
  return node;
}
var slice = Array.prototype.slice;
var indexOf = (
  /* istanbul ignore next */
  function(array, element) {
    for (var i = 0, length2 = array.length; i < length2; ++i) {
      if (array[i] === element)
        return i;
    }
    return -1;
  }
);
if (Array.prototype.indexOf)
  indexOf = function(array, element) {
    return array.indexOf(element);
  };
function indexOfObject(array, property, element) {
  for (var i = 0, length2 = array.length; i < length2; ++i) {
    if (array[i][property] === element)
      return i;
  }
  return -1;
}
function sprintf(format) {
  var args = slice.call(arguments, 1);
  format = format.replace(/%(\d)/g, function(match, index2) {
    return "" + args[index2 - 1] || /* istanbul ignore next */
    "";
  });
  return format;
}
var assign = (
  /* istanbul ignore next */
  function(dest) {
    var args = slice.call(arguments, 1), src, prop;
    for (var i = 0, length2 = args.length; i < length2; ++i) {
      src = args[i];
      for (prop in src)
        if (Object.prototype.hasOwnProperty.call(src, prop)) {
          dest[prop] = src[prop];
        }
    }
    return dest;
  }
);
if (Object.assign)
  assign = Object.assign;
_exports.SyntaxError = SyntaxError;
function fixupError(e) {
  if (!Object.create)
    return e;
  return Object.create(e, {
    "line": { "writable": true, value: e.line },
    "index": { "writable": true, value: e.index },
    "column": { "writable": true, value: e.column }
  });
}
function raise(token2) {
  var message = sprintf.apply(null, slice.call(arguments, 1)), error, col;
  if (token2 === null || typeof token2.line === "undefined") {
    col = index - lineStart + 1;
    error = fixupError(new SyntaxError(sprintf("[%1:%2] %3", line, col, message)));
    error.index = index;
    error.line = line;
    error.column = col;
  } else {
    col = token2.range[0] - token2.lineStart;
    error = fixupError(new SyntaxError(sprintf("[%1:%2] %3", token2.line, col, message)));
    error.line = token2.line;
    error.index = token2.range[0];
    error.column = col;
  }
  throw error;
}
function tokenValue(token2) {
  var raw = input.slice(token2.range[0], token2.range[1]);
  if (raw)
    return raw;
  return token2.value;
}
function raiseUnexpectedToken(type, token2) {
  raise(token2, errors.expectedToken, type, tokenValue(token2));
}
function unexpected(found) {
  var near = tokenValue(lookahead);
  if ("undefined" !== typeof found.type) {
    var type;
    switch (found.type) {
      case StringLiteral:
        type = "string";
        break;
      case StringHashLiteral:
        type = "stringhash";
        break;
      case Keyword:
        type = "keyword";
        break;
      case Identifier:
        type = "identifier";
        break;
      case NumericLiteral:
        type = "number";
        break;
      case Punctuator:
        type = "symbol";
        break;
      case BooleanLiteral:
        type = "boolean";
        break;
      case NilLiteral:
        return raise(found, errors.unexpected, "symbol", "nil", near);
      case EOF:
        return raise(found, errors.unexpectedEOF);
    }
    return raise(found, errors.unexpected, type, tokenValue(found), near);
  }
  return raise(found, errors.unexpected, "symbol", found, near);
}
var index;
var token;
var previousToken;
var lookahead;
var comments;
var tokenStart;
var line;
var lineStart;
_exports.lex = lex;
function lex() {
  skipWhiteSpace();
  var charCode = input.charCodeAt(index), next2 = input.charCodeAt(index + 1);
  while (45 === charCode && 45 === next2 || 47 === charCode && 42 === next2) {
    scanComment();
    skipWhiteSpace();
    charCode = input.charCodeAt(index);
    next2 = input.charCodeAt(index + 1);
  }
  if (index >= length)
    return {
      type: EOF,
      value: "<eof>",
      line,
      lineStart,
      range: [index, index]
    };
  tokenStart = index;
  if (isIdentifierStart(charCode))
    return scanIdentifierOrKeyword();
  switch (charCode) {
    case 39:
    case 34:
      return scanStringLiteral();
    case 96:
      let lexNode = scanStringLiteral();
      lexNode.type = StringHashLiteral;
      return lexNode;
    case 48:
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      return scanNumericLiteral();
    case 46:
      if (isDecDigit(next2))
        return scanNumericLiteral();
      if (46 === next2) {
        if (46 === input.charCodeAt(index + 2))
          return scanVarargLiteral();
        return scanPunctuator("..");
      }
      return scanPunctuator(".");
    case 63:
      if (46 === next2)
        return scanPunctuator("?.");
    case 61:
      if (61 === next2)
        return scanPunctuator("==");
      if (62 === next2)
        return scanPunctuator("=>");
      return scanPunctuator("=");
    case 62:
      if (features.bitwiseOperators) {
        if (62 === next2) {
          let _next = input.charCodeAt(index + 2);
          if (61 === _next)
            return scanPunctuator(">>=");
          return scanPunctuator(">>");
        }
      }
      if (61 === next2)
        return scanPunctuator(">=");
      return scanPunctuator(">");
    case 60:
      if (features.bitwiseOperators) {
        if (60 === next2) {
          let _next = input.charCodeAt(index + 2);
          if (61 === _next)
            return scanPunctuator("<<=");
          return scanPunctuator("<<");
        }
      }
      if (61 === next2)
        return scanPunctuator("<=");
      return scanPunctuator("<");
    case 126:
    case 33:
      if (61 === next2)
        return scanPunctuator("~=");
      if (!features.bitwiseOperators)
        break;
      return scanPunctuator("~");
    case 58:
      if (features.labels) {
        if (58 === next2)
          return scanPunctuator("::");
      }
      return scanPunctuator(":");
    case 91:
      if (91 === next2 || 61 === next2)
        return scanLongStringLiteral();
      return scanPunctuator("[");
    case 47:
      if (features.integerDivision) {
        if (47 === next2)
          return scanPunctuator("//");
      }
      if (61 === next2)
        return scanPunctuator("/=");
      return scanPunctuator("/");
    case 38:
    case 124:
      if (61 === next2)
        return scanPunctuator(input.charAt(index) + "=");
      if (!features.bitwiseOperators)
        break;
    case 37:
    case 44:
    case 123:
    case 125:
    case 93:
    case 40:
    case 41:
    case 59:
    case 35:
      return scanPunctuator(input.charAt(index));
    case 45:
    case 43:
    case 42:
    case 94:
      if (61 === next2)
        return scanPunctuator(input.charAt(index) + "=");
      return scanPunctuator(input.charAt(index));
  }
  return unexpected(input.charAt(index));
}
function consumeEOL() {
  var charCode = input.charCodeAt(index), peekCharCode = input.charCodeAt(index + 1);
  if (isLineTerminator(charCode)) {
    if (10 === charCode && 13 === peekCharCode)
      ++index;
    if (13 === charCode && 10 === peekCharCode)
      ++index;
    ++line;
    lineStart = ++index;
    return true;
  }
  return false;
}
function skipWhiteSpace() {
  while (index < length) {
    var charCode = input.charCodeAt(index);
    if (isWhiteSpace(charCode)) {
      ++index;
    } else if (!consumeEOL()) {
      break;
    }
  }
}
function scanIdentifierOrKeyword() {
  var value, type;
  while (isIdentifierPart(input.charCodeAt(++index)))
    ;
  value = encodingMode.fixup(input.slice(tokenStart, index));
  if (isKeyword(value)) {
    type = Keyword;
  } else if ("true" === value || "false" === value) {
    type = BooleanLiteral;
    value = "true" === value;
  } else if ("nil" === value) {
    type = NilLiteral;
    value = null;
  } else {
    type = Identifier;
  }
  return {
    type,
    value,
    line,
    lineStart,
    range: [tokenStart, index]
  };
}
function scanPunctuator(value) {
  index += value.length;
  return {
    type: Punctuator,
    value,
    line,
    lineStart,
    range: [tokenStart, index]
  };
}
function scanVarargLiteral() {
  index += 3;
  return {
    type: VarargLiteral,
    value: "...",
    line,
    lineStart,
    range: [tokenStart, index]
  };
}
function scanStringLiteral() {
  var delimiter = input.charCodeAt(index++), beginLine = line, beginLineStart = lineStart, stringStart = index, string = encodingMode.discardStrings ? null : "", charCode;
  for (; ; ) {
    charCode = input.charCodeAt(index++);
    if (delimiter === charCode)
      break;
    if (index > length || isLineTerminator(charCode)) {
      string += input.slice(stringStart, index - 1);
      raise(null, errors.unfinishedString, input.slice(tokenStart, index - 1));
    }
    if (92 === charCode) {
      if (!encodingMode.discardStrings) {
        var beforeEscape = input.slice(stringStart, index - 1);
        string += encodingMode.fixup(beforeEscape);
      }
      var escapeValue = readEscapeSequence();
      if (!encodingMode.discardStrings)
        string += escapeValue;
      stringStart = index;
    }
  }
  if (!encodingMode.discardStrings) {
    string += encodingMode.encodeByte(null);
    string += encodingMode.fixup(input.slice(stringStart, index - 1));
  }
  return {
    type: StringLiteral,
    value: string,
    line: beginLine,
    lineStart: beginLineStart,
    lastLine: line,
    lastLineStart: lineStart,
    range: [tokenStart, index]
  };
}
function scanLongStringLiteral() {
  var beginLine = line, beginLineStart = lineStart, string = readLongString(false);
  if (false === string)
    raise(token, errors.expected, "[", tokenValue(token));
  return {
    type: StringLiteral,
    value: encodingMode.discardStrings ? null : encodingMode.fixup(string),
    line: beginLine,
    lineStart: beginLineStart,
    lastLine: line,
    lastLineStart: lineStart,
    range: [tokenStart, index]
  };
}
function scanNumericLiteral() {
  var character = input.charAt(index), next2 = input.charAt(index + 1);
  var literal = "0" === character && "xX".indexOf(next2 || null) >= 0 ? readHexLiteral() : readDecLiteral();
  var foundImaginaryUnit = readImaginaryUnitSuffix(), foundInt64Suffix = readInt64Suffix();
  if (foundInt64Suffix && (foundImaginaryUnit || literal.hasFractionPart)) {
    raise(null, errors.malformedNumber, input.slice(tokenStart, index));
  }
  return {
    type: NumericLiteral,
    value: literal.value,
    line,
    lineStart,
    range: [tokenStart, index]
  };
}
function readImaginaryUnitSuffix() {
  if (!features.imaginaryNumbers)
    return;
  if ("iI".indexOf(input.charAt(index) || null) >= 0) {
    ++index;
    return true;
  } else {
    return false;
  }
}
function readInt64Suffix() {
  if (!features.integerSuffixes)
    return;
  if ("uU".indexOf(input.charAt(index) || null) >= 0) {
    ++index;
    if ("lL".indexOf(input.charAt(index) || null) >= 0) {
      ++index;
      if ("lL".indexOf(input.charAt(index) || null) >= 0) {
        ++index;
        return "ULL";
      } else {
        raise(null, errors.malformedNumber, input.slice(tokenStart, index));
      }
    } else {
      raise(null, errors.malformedNumber, input.slice(tokenStart, index));
    }
  } else if ("lL".indexOf(input.charAt(index) || null) >= 0) {
    ++index;
    if ("lL".indexOf(input.charAt(index) || null) >= 0) {
      ++index;
      return "LL";
    } else {
      raise(null, errors.malformedNumber, input.slice(tokenStart, index));
    }
  }
}
function readHexLiteral() {
  var fraction = 0, binaryExponent = 1, binarySign = 1, digit, fractionStart, exponentStart, digitStart;
  digitStart = index += 2;
  if (!isHexDigit(input.charCodeAt(index)))
    raise(null, errors.malformedNumber, input.slice(tokenStart, index));
  while (isHexDigit(input.charCodeAt(index)))
    ++index;
  digit = parseInt(input.slice(digitStart, index), 16);
  var foundFraction = false;
  if ("." === input.charAt(index)) {
    foundFraction = true;
    fractionStart = ++index;
    while (isHexDigit(input.charCodeAt(index)))
      ++index;
    fraction = input.slice(fractionStart, index);
    fraction = fractionStart === index ? 0 : parseInt(fraction, 16) / Math.pow(16, index - fractionStart);
  }
  var foundBinaryExponent = false;
  if ("pP".indexOf(input.charAt(index) || null) >= 0) {
    foundBinaryExponent = true;
    ++index;
    if ("+-".indexOf(input.charAt(index) || null) >= 0)
      binarySign = "+" === input.charAt(index++) ? 1 : -1;
    exponentStart = index;
    if (!isDecDigit(input.charCodeAt(index)))
      raise(null, errors.malformedNumber, input.slice(tokenStart, index));
    while (isDecDigit(input.charCodeAt(index)))
      ++index;
    binaryExponent = input.slice(exponentStart, index);
    binaryExponent = Math.pow(2, binaryExponent * binarySign);
  }
  return {
    value: (digit + fraction) * binaryExponent,
    hasFractionPart: foundFraction || foundBinaryExponent
  };
}
function readDecLiteral() {
  while (isDecDigit(input.charCodeAt(index)))
    ++index;
  var foundFraction = false;
  if ("." === input.charAt(index)) {
    foundFraction = true;
    ++index;
    while (isDecDigit(input.charCodeAt(index)))
      ++index;
  }
  var foundExponent = false;
  if ("eE".indexOf(input.charAt(index) || null) >= 0) {
    foundExponent = true;
    ++index;
    if ("+-".indexOf(input.charAt(index) || null) >= 0)
      ++index;
    if (!isDecDigit(input.charCodeAt(index)))
      raise(null, errors.malformedNumber, input.slice(tokenStart, index));
    while (isDecDigit(input.charCodeAt(index)))
      ++index;
  }
  return {
    value: parseFloat(input.slice(tokenStart, index)),
    hasFractionPart: foundFraction || foundExponent
  };
}
function readUnicodeEscapeSequence() {
  var sequenceStart = index++;
  if (input.charAt(index++) !== "{")
    raise(null, errors.braceExpected, "{", "\\" + input.slice(sequenceStart, index));
  if (!isHexDigit(input.charCodeAt(index)))
    raise(null, errors.hexadecimalDigitExpected, "\\" + input.slice(sequenceStart, index));
  while (input.charCodeAt(index) === 48)
    ++index;
  var escStart = index;
  while (isHexDigit(input.charCodeAt(index))) {
    ++index;
    if (index - escStart > (features.relaxedUTF8 ? 8 : 6))
      raise(null, errors.tooLargeCodepoint, "\\" + input.slice(sequenceStart, index));
  }
  var b = input.charAt(index++);
  if (b !== "}") {
    if (b === '"' || b === "'")
      raise(null, errors.braceExpected, "}", "\\" + input.slice(sequenceStart, index--));
    else
      raise(null, errors.hexadecimalDigitExpected, "\\" + input.slice(sequenceStart, index));
  }
  var codepoint = parseInt(input.slice(escStart, index - 1) || "0", 16);
  var frag = "\\" + input.slice(sequenceStart, index);
  if (codepoint > (features.relaxedUTF8 ? 2147483647 : 1114111)) {
    raise(null, errors.tooLargeCodepoint, frag);
  }
  return encodingMode.encodeUTF8(codepoint, frag);
}
function readEscapeSequence() {
  var sequenceStart = index;
  switch (input.charAt(index)) {
    case "a":
      ++index;
      return "\x07";
    case "n":
      ++index;
      return "\n";
    case "r":
      ++index;
      return "\r";
    case "t":
      ++index;
      return "	";
    case "v":
      ++index;
      return "\v";
    case "b":
      ++index;
      return "\b";
    case "f":
      ++index;
      return "\f";
    case "\r":
    case "\n":
      consumeEOL();
      return "\n";
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      while (isDecDigit(input.charCodeAt(index)) && index - sequenceStart < 3)
        ++index;
      var frag = input.slice(sequenceStart, index);
      var ddd = parseInt(frag, 10);
      if (ddd > 255) {
        raise(null, errors.decimalEscapeTooLarge, "\\" + ddd);
      }
      return encodingMode.encodeByte(ddd, "\\" + frag);
    case "z":
      if (features.skipWhitespaceEscape) {
        ++index;
        skipWhiteSpace();
        return "";
      }
      break;
    case "x":
      if (features.hexEscapes) {
        if (isHexDigit(input.charCodeAt(index + 1)) && isHexDigit(input.charCodeAt(index + 2))) {
          index += 3;
          return encodingMode.encodeByte(parseInt(input.slice(sequenceStart + 1, index), 16), "\\" + input.slice(sequenceStart, index));
        }
        raise(null, errors.hexadecimalDigitExpected, "\\" + input.slice(sequenceStart, index + 2));
      }
      break;
    case "u":
      if (features.unicodeEscapes)
        return readUnicodeEscapeSequence();
      break;
    case "\\":
    case '"':
    case "'":
      return input.charAt(index++);
  }
  if (features.strictEscapes)
    raise(null, errors.invalidEscape, "\\" + input.slice(sequenceStart, index + 1));
  return input.charAt(index++);
}
function scanComment() {
  tokenStart = index;
  index += 2;
  var character = input.charAt(index), content = "", isLong = false, commentStart = index, lineStartComment = lineStart, lineComment = line;
  if ("[" === character || "/" === input.charAt(tokenStart)) {
    content = readLongString(true);
    if (false === content)
      content = character;
    else
      isLong = true;
  }
  if (!isLong) {
    while (index < length) {
      if (isLineTerminator(input.charCodeAt(index)))
        break;
      ++index;
    }
    if (options.comments)
      content = input.slice(commentStart, index);
  }
  if (options.comments) {
    var node = ast.comment(content, input.slice(tokenStart, index));
    if (options.locations) {
      node.loc = {
        start: { line: lineComment, column: tokenStart - lineStartComment },
        end: { line, column: index - lineStart }
      };
    }
    if (options.ranges) {
      node.range = [tokenStart, index];
    }
    if (options.onCreateNode)
      options.onCreateNode(node);
    comments.push(node);
  }
}
function readLongString(isComment) {
  var level = 0, content = "", terminator = false, character, stringStart, firstLine = line;
  if ("[" == input.charAt(index)) {
    ++index;
    while ("=" === input.charAt(index + level))
      ++level;
    if ("[" !== input.charAt(index + level))
      return false;
    index += level + 1;
  }
  if (isLineTerminator(input.charCodeAt(index)))
    consumeEOL();
  stringStart = index;
  while (index < length) {
    while (isLineTerminator(input.charCodeAt(index)))
      consumeEOL();
    character = input.charAt(index);
    index += 1;
    if ("]" === character) {
      terminator = true;
      for (var i = 0; i < level; ++i) {
        if ("=" !== input.charAt(index + i))
          terminator = false;
      }
      if ("]" !== input.charAt(index + level))
        terminator = false;
    }
    if ("*" === character && "/" === input.charAt(index)) {
      terminator = true;
    }
    if (terminator) {
      content += input.slice(stringStart, index - 1);
      index += level + 1;
      return content;
    }
  }
  raise(
    null,
    isComment ? errors.unfinishedLongComment : errors.unfinishedLongString,
    firstLine,
    "<eof>"
  );
}
function next() {
  previousToken = token;
  token = lookahead;
  lookahead = lex();
}
function consume(value) {
  if (value === token.value) {
    next();
    return true;
  }
  return false;
}
function expect(value) {
  if (value === token.value)
    next();
  else
    raise(token, errors.expected, value, tokenValue(token));
}
function isWhiteSpace(charCode) {
  return 9 === charCode || 32 === charCode || 11 === charCode || 12 === charCode;
}
function isLineTerminator(charCode) {
  return 10 === charCode || 13 === charCode;
}
function isDecDigit(charCode) {
  return charCode >= 48 && charCode <= 57;
}
function isHexDigit(charCode) {
  return charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70;
}
function isIdentifierStart(charCode) {
  if (charCode >= 64 && charCode <= 90 || charCode >= 97 && charCode <= 122 || 95 === charCode)
    return true;
  if (features.extendedIdentifiers && charCode >= 128)
    return true;
  return false;
}
function isIdentifierPart(charCode) {
  if (charCode >= 65 && charCode <= 90 || charCode >= 97 && charCode <= 122 || 95 === charCode || charCode >= 48 && charCode <= 57)
    return true;
  if (features.extendedIdentifiers && charCode >= 128)
    return true;
  return false;
}
function isKeyword(id) {
  switch (id.length) {
    case 2:
      return "do" === id || "if" === id || "in" === id || "or" === id;
    case 3:
      return "and" === id || "end" === id || "for" === id || "not" === id;
    case 4:
      if ("else" === id || "then" === id)
        return true;
      if (features.labels && !features.contextualGoto)
        return "goto" === id;
      return false;
    case 5:
      return "break" === id || "local" === id || "until" === id || "while" === id || "class" === id;
    case 6:
      return "elseif" === id || "repeat" === id || "return" === id;
    case 8:
      return "function" === id;
  }
  return false;
}
function isUnary(token2) {
  if (Punctuator === token2.type)
    return "#-~".indexOf(token2.value) >= 0;
  if (Keyword === token2.type)
    return "not" === token2.value;
  return false;
}
function isBlockFollow(token2) {
  if (EOF === token2.type)
    return true;
  if (Keyword !== token2.type && Punctuator !== token2.type)
    return false;
  switch (token2.value) {
    case "else":
    case "elseif":
    case "end":
    case "until":
    case "}":
      return true;
    default:
      return false;
  }
}
var scopes;
var scopeDepth;
var globals;
function createScope() {
  var scope = scopes[scopeDepth++].slice();
  scopes.push(scope);
  if (options.onCreateScope)
    options.onCreateScope();
}
function destroyScope() {
  var scope = scopes.pop();
  --scopeDepth;
  if (options.onDestroyScope)
    options.onDestroyScope();
}
function scopeIdentifierName(name) {
  if (options.onLocalDeclaration)
    options.onLocalDeclaration(name);
  if (-1 !== indexOf(scopes[scopeDepth], name))
    return;
  scopes[scopeDepth].push(name);
}
function scopeIdentifier(node) {
  scopeIdentifierName(node.name);
  attachScope(node, true);
}
function attachScope(node, isLocal) {
  if (!isLocal && -1 === indexOfObject(globals, "name", node.name))
    globals.push(node);
  node.isLocal = isLocal;
}
function scopeHasName(name) {
  return -1 !== indexOf(scopes[scopeDepth], name);
}
var locations = [];
var trackLocations;
function createLocationMarker() {
  return new Marker(token);
}
function Marker(token2) {
  if (options.locations) {
    this.loc = {
      start: {
        line: token2.line,
        column: token2.range[0] - token2.lineStart
      },
      end: {
        line: 0,
        column: 0
      }
    };
  }
  if (options.ranges)
    this.range = [token2.range[0], 0];
}
Marker.prototype.complete = function() {
  if (options.locations) {
    this.loc.end.line = previousToken.lastLine || previousToken.line;
    this.loc.end.column = previousToken.range[1] - (previousToken.lastLineStart || previousToken.lineStart);
  }
  if (options.ranges) {
    this.range[1] = previousToken.range[1];
  }
};
Marker.prototype.bless = function(node) {
  if (this.loc) {
    var loc = this.loc;
    node.loc = {
      start: {
        line: loc.start.line,
        column: loc.start.column
      },
      end: {
        line: loc.end.line,
        column: loc.end.column
      }
    };
  }
  if (this.range) {
    node.range = [
      this.range[0],
      this.range[1]
    ];
  }
};
function markLocation() {
  if (trackLocations)
    locations.push(createLocationMarker());
}
function pushLocation(marker) {
  if (trackLocations)
    locations.push(marker);
}
function FullFlowContext() {
  this.scopes = [];
  this.pendingGotos = [];
}
FullFlowContext.prototype.isInLoop = function() {
  var i = this.scopes.length;
  while (i-- > 0) {
    if (this.scopes[i].isLoop)
      return true;
  }
  return false;
};
FullFlowContext.prototype.findLabel = function(name) {
  var i = this.scopes.length;
  while (i-- > 0) {
    if (Object.prototype.hasOwnProperty.call(this.scopes[i].labels, name))
      return this.scopes[i].labels[name];
    if (!features.noLabelShadowing)
      return null;
  }
  return null;
};
FullFlowContext.prototype.pushScope = function(isLoop) {
  var scope = {
    labels: {},
    locals: [],
    deferredGotos: [],
    isLoop: !!isLoop
  };
  this.scopes.push(scope);
};
FullFlowContext.prototype.popScope = function() {
  for (var i = 0; i < this.pendingGotos.length; ++i) {
    var theGoto = this.pendingGotos[i];
    if (theGoto.maxDepth >= this.scopes.length) {
      if (--theGoto.maxDepth <= 0)
        raise(theGoto.token, errors.labelNotVisible, theGoto.target);
    }
  }
  this.scopes.pop();
};
FullFlowContext.prototype.addGoto = function(target, token2) {
  var localCounts = [];
  for (var i = 0; i < this.scopes.length; ++i) {
    var scope = this.scopes[i];
    localCounts.push(scope.locals.length);
    if (Object.prototype.hasOwnProperty.call(scope.labels, target))
      return;
  }
  this.pendingGotos.push({
    maxDepth: this.scopes.length,
    target,
    token: token2,
    localCounts
  });
};
FullFlowContext.prototype.addLabel = function(name, token2) {
  var scope = this.currentScope();
  var definedLabel = this.findLabel(name);
  if (definedLabel !== null) {
    raise(token2, errors.labelAlreadyDefined, name, definedLabel.line);
  } else {
    var newGotos = [];
    for (var i = 0; i < this.pendingGotos.length; ++i) {
      var theGoto = this.pendingGotos[i];
      if (theGoto.maxDepth >= this.scopes.length && theGoto.target === name) {
        if (theGoto.localCounts[this.scopes.length - 1] < scope.locals.length) {
          scope.deferredGotos.push(theGoto);
        }
        continue;
      }
      newGotos.push(theGoto);
    }
    this.pendingGotos = newGotos;
  }
  scope.labels[name] = {
    localCount: scope.locals.length,
    line: token2.line
  };
};
FullFlowContext.prototype.addLocal = function(name, token2) {
  this.currentScope().locals.push({
    name,
    token: token2
  });
};
FullFlowContext.prototype.currentScope = function() {
  return this.scopes[this.scopes.length - 1];
};
FullFlowContext.prototype.raiseDeferredErrors = function() {
  var scope = this.currentScope();
  var bads = scope.deferredGotos;
  for (var i = 0; i < bads.length; ++i) {
    var theGoto = bads[i];
    raise(theGoto.token, errors.gotoJumpInLocalScope, theGoto.target, scope.locals[theGoto.localCounts[this.scopes.length - 1]].name);
  }
};
function LoopFlowContext() {
  this.level = 0;
  this.loopLevels = [];
}
LoopFlowContext.prototype.isInLoop = function() {
  return !!this.loopLevels.length;
};
LoopFlowContext.prototype.pushScope = function(isLoop) {
  ++this.level;
  if (isLoop)
    this.loopLevels.push(this.level);
};
LoopFlowContext.prototype.popScope = function() {
  var levels = this.loopLevels;
  var levlen = levels.length;
  if (levlen) {
    if (levels[levlen - 1] === this.level)
      levels.pop();
  }
  --this.level;
};
LoopFlowContext.prototype.addGoto = LoopFlowContext.prototype.addLabel = /* istanbul ignore next */
function() {
  throw new Error("This should never happen");
};
LoopFlowContext.prototype.addLocal = LoopFlowContext.prototype.raiseDeferredErrors = function() {
};
function makeFlowContext() {
  return features.labels ? new FullFlowContext() : new LoopFlowContext();
}
function parseChunk() {
  next();
  markLocation();
  if (options.scope)
    createScope();
  var flowContext = makeFlowContext();
  flowContext.allowVararg = true;
  flowContext.pushScope();
  var body = parseBlock(flowContext);
  flowContext.popScope();
  if (options.scope)
    destroyScope();
  if (EOF !== token.type)
    unexpected(token);
  if (trackLocations && !body.length)
    previousToken = token;
  return finishNode(ast.chunk(body));
}
function parseBlock(flowContext) {
  var block = [], statement;
  while (!isBlockFollow(token)) {
    if ("return" === token.value || !features.relaxedBreak && "break" === token.value) {
      block.push(parseStatement(flowContext));
      break;
    }
    statement = parseStatement(flowContext);
    consume(";");
    if (statement)
      block.push(statement);
  }
  return block;
}
function parseStatement(flowContext) {
  markLocation();
  if (Punctuator === token.type) {
    if (consume("::"))
      return parseLabelStatement(flowContext);
  }
  if (features.emptyStatement) {
    if (consume(";")) {
      if (trackLocations)
        locations.pop();
      return;
    }
  }
  flowContext.raiseDeferredErrors();
  if (Keyword === token.type) {
    switch (token.value) {
      case "local":
        next();
        return parseLocalStatement(flowContext);
      case "if":
        next();
        return parseIfStatement(flowContext);
      case "return":
        next();
        return parseReturnStatement(flowContext);
      case "function":
        next();
        var name = parseFunctionName();
        return parseFunctionDeclaration(name);
      case "class":
        next();
        var name = parseFunctionName();
        return parseClassDeclaration(name, flowContext);
      case "while":
        next();
        return parseWhileStatement(flowContext);
      case "for":
        next();
        return parseForStatement(flowContext);
      case "repeat":
        next();
        return parseRepeatStatement(flowContext);
      case "break":
        next();
        if (!flowContext.isInLoop())
          raise(token, errors.noLoopToBreak, token.value);
        return parseBreakStatement();
      case "do":
        next();
        return parseDoStatement(flowContext);
      case "goto":
        next();
        return parseGotoStatement(flowContext);
    }
  }
  if (token.type == Identifier && token.value.charAt(0) == "@") {
    return parseDecoratorStatement(flowContext);
  }
  if (features.contextualGoto && token.type === Identifier && token.value === "goto" && lookahead.type === Identifier && lookahead.value !== "goto") {
    next();
    return parseGotoStatement(flowContext);
  }
  if (trackLocations)
    locations.pop();
  return parseAssignmentOrCallStatementOrArrowFunction(flowContext);
}
function parseLabelStatement(flowContext) {
  var nameToken = token, label = parseIdentifier();
  if (options.scope) {
    scopeIdentifierName("::" + nameToken.value + "::");
    attachScope(label, true);
  }
  expect("::");
  flowContext.addLabel(nameToken.value, nameToken);
  return finishNode(ast.labelStatement(label));
}
function parseBreakStatement() {
  consume(";");
  return finishNode(ast.breakStatement());
}
function parseGotoStatement(flowContext) {
  var name = token.value, gotoToken = previousToken, label = parseIdentifier();
  flowContext.addGoto(name, gotoToken);
  return finishNode(ast.gotoStatement(label));
}
function parseDecoratorStatement(flowContext) {
  token.value = token.value.substring(1);
  let call = parseAssignmentOrCallStatementOrArrowFunction(flowContext);
  let expressionBase = call.expression.base;
  return finishNode(ast.decoratorStatement(expressionBase, call.expression.arguments));
}
function parseDoStatement(flowContext) {
  if (options.scope)
    createScope();
  flowContext.pushScope();
  var body = parseBlock(flowContext);
  flowContext.popScope();
  if (options.scope)
    destroyScope();
  expect("end");
  return finishNode(ast.doStatement(body));
}
function parseWhileStatement(flowContext) {
  var condition = parseExpectedExpression(flowContext);
  expect("do");
  if (options.scope)
    createScope();
  flowContext.pushScope(true);
  var body = parseBlock(flowContext);
  flowContext.popScope();
  if (options.scope)
    destroyScope();
  expect("end");
  return finishNode(ast.whileStatement(condition, body));
}
function parseRepeatStatement(flowContext) {
  if (options.scope)
    createScope();
  flowContext.pushScope(true);
  var body = parseBlock(flowContext);
  expect("until");
  flowContext.raiseDeferredErrors();
  var condition = parseExpectedExpression(flowContext);
  flowContext.popScope();
  if (options.scope)
    destroyScope();
  return finishNode(ast.repeatStatement(condition, body));
}
function parseReturnStatement(flowContext) {
  var expressions = [];
  if ("end" !== token.value) {
    var expression = parseExpression(flowContext);
    if (null != expression) {
      expressions.push(expression);
      while (consume(",")) {
        expression = parseExpectedExpression(flowContext);
        expressions.push(expression);
      }
    }
    consume(";");
  }
  return finishNode(ast.returnStatement(expressions));
}
function parseIfStatement(flowContext) {
  var clauses = [], condition, body, marker;
  if (trackLocations) {
    marker = locations[locations.length - 1];
    locations.push(marker);
  }
  condition = parseExpectedExpression(flowContext);
  expect("then");
  if (options.scope)
    createScope();
  flowContext.pushScope();
  body = parseBlock(flowContext);
  flowContext.popScope();
  if (options.scope)
    destroyScope();
  clauses.push(finishNode(ast.ifClause(condition, body)));
  if (trackLocations)
    marker = createLocationMarker();
  while (consume("elseif")) {
    pushLocation(marker);
    condition = parseExpectedExpression(flowContext);
    expect("then");
    if (options.scope)
      createScope();
    flowContext.pushScope();
    body = parseBlock(flowContext);
    flowContext.popScope();
    if (options.scope)
      destroyScope();
    clauses.push(finishNode(ast.elseifClause(condition, body)));
    if (trackLocations)
      marker = createLocationMarker();
  }
  if (consume("else")) {
    if (trackLocations) {
      marker = new Marker(previousToken);
      locations.push(marker);
    }
    if (options.scope)
      createScope();
    flowContext.pushScope();
    body = parseBlock(flowContext);
    flowContext.popScope();
    if (options.scope)
      destroyScope();
    clauses.push(finishNode(ast.elseClause(body)));
  }
  expect("end");
  return finishNode(ast.ifStatement(clauses));
}
function parseForStatement(flowContext) {
  var variable = parseIdentifier(), body;
  if (options.scope) {
    createScope();
    scopeIdentifier(variable);
  }
  if (consume("=")) {
    var start = parseExpectedExpression(flowContext);
    expect(",");
    var end2 = parseExpectedExpression(flowContext);
    var step = consume(",") ? parseExpectedExpression(flowContext) : null;
    expect("do");
    flowContext.pushScope(true);
    body = parseBlock(flowContext);
    flowContext.popScope();
    expect("end");
    if (options.scope)
      destroyScope();
    return finishNode(ast.forNumericStatement(variable, start, end2, step, body));
  } else {
    var variables = [variable];
    while (consume(",")) {
      variable = parseIdentifier();
      if (options.scope)
        scopeIdentifier(variable);
      variables.push(variable);
    }
    expect("in");
    var iterators = [];
    do {
      var expression = parseExpectedExpression(flowContext);
      iterators.push(expression);
    } while (consume(","));
    expect("do");
    flowContext.pushScope(true);
    body = parseBlock(flowContext);
    flowContext.popScope();
    expect("end");
    if (options.scope)
      destroyScope();
    return finishNode(ast.forGenericStatement(variables, iterators, body));
  }
}
function parseTableComprehensionStatement(statements, flowContext) {
  var variable = parseIdentifier(), iterators = [], conditions = [];
  if (options.scope) {
    createScope();
    scopeIdentifier(variable);
  }
  var variables = [variable];
  while (consume(",")) {
    variable = parseIdentifier();
    if (options.scope)
      scopeIdentifier(variable);
    variables.push(variable);
  }
  expect("in");
  do {
    var expression = parseExpectedExpression(flowContext);
    iterators.push(expression);
  } while (consume(","));
  while (consume("if")) {
    var condition = parseExpectedExpression(flowContext);
    conditions.push(condition);
  }
  if (options.scope)
    destroyScope();
  return finishNode(ast.tableComprehensionStatement(variables, iterators, statements, conditions));
}
function parseLocalStatement(flowContext) {
  var name, attribute, marker, declToken = previousToken;
  if (Identifier === token.type) {
    var variables = [], init = [];
    do {
      if (trackLocations)
        marker = createLocationMarker();
      name = parseIdentifier();
      attribute = null;
      if (features.attributes) {
        attribute = parseAttribute();
      }
      if (attribute !== null) {
        if (trackLocations)
          pushLocation(marker);
        variables.push(finishNode(ast.identifierWithAttribute(name, attribute)));
      } else {
        variables.push(name);
      }
      flowContext.addLocal(name.name, declToken);
    } while (consume(","));
    if (consume("=")) {
      do {
        consume("new");
        var expression = parseExpectedExpression(flowContext);
        init.push(expression);
      } while (consume(","));
    }
    if (options.scope) {
      for (var i = 0, l = variables.length; i < l; ++i) {
        scopeIdentifier(variables[i]);
      }
    }
    return finishNode(ast.localStatement(variables, init));
  }
  if (consume("function")) {
    name = parseIdentifier();
    flowContext.addLocal(name.name, declToken);
    if (options.scope) {
      scopeIdentifier(name);
      createScope();
    }
    return parseFunctionDeclaration(name, true);
  } else {
    raiseUnexpectedToken("<name>", token);
  }
}
function parseInStatement(flowContext) {
  var marker;
  if (trackLocations)
    marker = createLocationMarker();
  if (trackLocations)
    pushLocation(marker);
  token = previousToken;
  var left = parseExpectedExpression(flowContext);
  var right = parseExpectedExpression(flowContext);
  return finishNode(ast.inStatement(left, right));
}
function parseCompoundAssignmentStatement(flowContext, startMarker, identifiers) {
  var operator = token;
  if (identifiers.length > 1) {
    raise(token, errors.compoundAssignment, identifiers[0].name);
  }
  next();
  var init = parseExpectedExpression(flowContext);
  if (consume(",")) {
    unexpected(token);
  }
  pushLocation(startMarker);
  return finishNode(ast.compoundAssignmentStatement(operator.value, identifiers[0], init));
}
function parseAssignmentOrCallStatementOrArrowFunction(flowContext) {
  var previous = token, marker, startMarker;
  var lvalue, base, name;
  var targets = [];
  if (trackLocations)
    startMarker = createLocationMarker();
  do {
    if (trackLocations)
      marker = createLocationMarker();
    if (Identifier === token.type) {
      name = token.value;
      base = parseIdentifier();
      if (options.scope)
        attachScope(base, scopeHasName(name));
      lvalue = true;
    } else if ("(" === token.value) {
      next();
      if (Identifier === token.type) {
        name = token.value;
        base = parseIdentifier();
        if (options.scope)
          attachScope(base, scopeHasName(name));
        lvalue = true;
      } else {
        base = parseExpectedExpression(flowContext);
        expect(")");
        lvalue = false;
      }
    } else {
      return unexpected(token);
    }
    both:
      for (; ; ) {
        var newBase;
        switch (StringLiteral === token.type ? '"' : token.value) {
          case ".":
          case "[":
            lvalue = true;
            break;
          case ":":
          case "(":
          case "{":
          case '"':
            lvalue = null;
            break;
          default:
            break both;
        }
        base = parsePrefixExpressionPart(base, marker, flowContext);
      }
    targets.push(base);
    if ("," !== token.value)
      break;
    if (!lvalue) {
      return unexpected(token);
    }
    next();
  } while (true);
  if (targets.length === 1 && lvalue === null) {
    pushLocation(marker);
    return finishNode(ast.callStatement(targets[0]));
  } else if (!lvalue) {
    return unexpected(token);
  }
  if (lookahead.value == "=>") {
    if (trackLocations)
      marker = createLocationMarker();
    var flowContext = makeFlowContext();
    flowContext.pushScope();
    next();
    consume("=>");
    consume("{");
    var body = parseBlock(flowContext);
    consume("}");
    flowContext.popScope();
    pushLocation(marker);
    return finishNode(ast.arrowFunctionStatement(targets, body));
  }
  if (token.value.length == 2 || token.value.length == 3) {
    if (consume("in")) {
      let table = parseIdentifier();
      pushLocation(startMarker);
      return finishNode(ast.unpackStatement(table, targets));
    } else {
      return parseCompoundAssignmentStatement(flowContext, startMarker, targets);
    }
  } else {
    expect("=");
    var values = [];
    do {
      consume("new");
      var unpack;
      if (token.type == VarargLiteral) {
        consume(token.value);
        unpack = true;
      }
      let value = parseExpectedExpression(flowContext);
      if (unpack) {
        pushLocation(startMarker);
        values.push(finishNode(ast.unpackStatement(value)));
      } else {
        values.push(value);
      }
    } while (consume(","));
    pushLocation(startMarker);
    return finishNode(ast.assignmentStatement(targets, values));
  }
}
function parseIdentifier() {
  markLocation();
  var identifier = token.value;
  if (Identifier !== token.type)
    raiseUnexpectedToken("<name>", token);
  next();
  return finishNode(ast.identifier(identifier));
}
function parseAttribute() {
  markLocation();
  if (consume("<")) {
    if (Identifier !== token.type)
      raiseUnexpectedToken("<name>", token);
    var identifier = token.value;
    if (!features.attributes[identifier])
      raise(token, errors.unknownAttribute, identifier);
    next();
    expect(">");
    return finishNode(ast.attribute(identifier));
  }
  if (trackLocations)
    locations.pop();
  return null;
}
function parseTypeAttribute() {
  markLocation();
  if (consume("<")) {
    if (Identifier !== token.type)
      raiseUnexpectedToken("<name>", token);
    var identifier = token.value;
    next();
    expect(">");
    return finishNode(ast.typeAttribute(identifier));
  }
  if (trackLocations)
    locations.pop();
  return null;
}
function parseFunctionDeclaration(name, isLocal) {
  var flowContext = makeFlowContext();
  flowContext.pushScope();
  var parameters = [];
  expect("(");
  if (!consume(")")) {
    while (true) {
      if (Identifier === token.type) {
        var marker = trackLocations ? createLocationMarker() : null;
        var parameter = parseIdentifier(flowContext);
        var attribute = null;
        if (features.attributes) {
          attribute = parseTypeAttribute();
        }
        if (consume("=")) {
          var expression = parseExpectedExpression(flowContext);
          if (trackLocations)
            pushLocation(marker);
          parameter = finishNode(ast.defaultParameterValue(parameter, expression));
        }
        if (attribute !== null) {
          if (trackLocations)
            pushLocation(marker);
          parameters.push(finishNode(ast.identifierWithTypeAttribute(parameter, attribute)));
        } else {
          if (options.scope)
            scopeIdentifier(parameter);
          parameters.push(parameter);
        }
        if (consume(","))
          continue;
      } else if (VarargLiteral === token.type) {
        flowContext.allowVararg = true;
        parameters.push(parsePrimaryExpression(flowContext));
      } else {
        raiseUnexpectedToken("<name> or '...'", token);
      }
      expect(")");
      break;
    }
  }
  flowContext.pushScope(true);
  var body = parseBlock(flowContext);
  flowContext.popScope();
  expect("end");
  if (options.scope)
    destroyScope();
  isLocal = isLocal || false;
  return finishNode(ast.functionStatement(name, parameters, isLocal, body));
}
function parseClassExtends() {
  var base, marker;
  if (trackLocations)
    marker = createLocationMarker();
  base = parseIdentifier();
  if (options.scope) {
    attachScope(base, scopeHasName(base.name));
    createScope();
  }
  return base;
}
function parseClassDeclaration(name, flowContext) {
  var fields = [], key, value, baseClass;
  if (consume("extends")) {
    baseClass = parseClassExtends();
    next();
  } else {
    next();
  }
  markLocation();
  while (true) {
    markLocation();
    if (Punctuator === token.type && consume("[")) {
      key = parseExpectedExpression(flowContext);
      expect("]");
      expect("=");
      value = parseExpectedExpression(flowContext);
      fields.push(finishNode(ast.tableKey(key, value)));
    } else if (Identifier === token.type) {
      if ("=" === lookahead.value) {
        key = parseIdentifier();
        next();
        value = parseExpectedExpression(flowContext);
        fields.push(finishNode(ast.tableKeyString(key, value)));
      } else {
        value = parseExpectedExpression(flowContext);
        fields.push(finishNode(ast.tableValue(value)));
      }
    } else {
      if (null == (value = parseExpression(flowContext))) {
        locations.pop();
        break;
      }
      fields.push(finishNode(ast.tableValue(value)));
    }
    if (",;".indexOf(token.value) >= 0) {
      next();
      continue;
    }
    break;
  }
  expect("}");
  let table = finishNode(ast.tableConstructorExpression(fields));
  let classStatement = finishNode(ast.classStatement(name, table, baseClass));
  return classStatement;
}
function parseFunctionName() {
  var base, name, marker;
  if (trackLocations)
    marker = createLocationMarker();
  base = parseIdentifier();
  if (options.scope) {
    attachScope(base, scopeHasName(base.name));
    createScope();
  }
  while (consume(".")) {
    pushLocation(marker);
    name = parseIdentifier();
    base = finishNode(ast.memberExpression(base, ".", name));
  }
  if (consume(":")) {
    pushLocation(marker);
    name = parseIdentifier();
    base = finishNode(ast.memberExpression(base, ":", name));
    if (options.scope)
      scopeIdentifierName("self");
  }
  return base;
}
function parseTableConstructor(flowContext) {
  var fields = [], key, value;
  while (true) {
    markLocation();
    if (Punctuator === token.type && consume("[")) {
      key = parseExpectedExpression(flowContext);
      expect("]");
      expect("=");
      value = parseExpectedExpression(flowContext);
      fields.push(finishNode(ast.tableKey(key, value)));
    } else if (Identifier === token.type) {
      if ("=" === lookahead.value) {
        key = parseIdentifier();
        next();
        value = parseExpectedExpression(flowContext);
        fields.push(finishNode(ast.tableKeyString(key, value)));
      } else {
        value = parseExpectedExpression(flowContext);
        fields.push(finishNode(ast.tableValue(value)));
      }
    } else {
      if (null == (value = parseExpression(flowContext))) {
        locations.pop();
        break;
      }
      fields.push(finishNode(ast.tableValue(value)));
    }
    if (",;".indexOf(token.value) >= 0) {
      next();
      continue;
    }
    break;
  }
  if (consume("for")) {
    let statements = [];
    for (let field of fields) {
      statements.push(field.value);
    }
    var tableComprehension = parseTableComprehensionStatement(statements, flowContext);
    consume("}");
    return tableComprehension;
  } else {
    expect("}");
    return finishNode(ast.tableConstructorExpression(fields));
  }
}
function parseExpression(flowContext) {
  var expression = parseSubExpression(0, flowContext);
  return expression;
}
function parseExpectedExpression(flowContext) {
  var expression = parseExpression(flowContext);
  if (null == expression)
    raiseUnexpectedToken("<expression>", token);
  else
    return expression;
}
function binaryPrecedence(operator) {
  var charCode = operator.charCodeAt(0), length2 = operator.length;
  if (1 === length2) {
    switch (charCode) {
      case 94:
        return 12;
      case 42:
      case 47:
      case 37:
        return 10;
      case 43:
      case 45:
        return 9;
      case 38:
        return 6;
      case 126:
        return 5;
      case 124:
        return 4;
      case 60:
      case 62:
        return 3;
    }
  } else if (2 === length2) {
    switch (charCode) {
      case 47:
        return 10;
      case 46:
        return 8;
      case 60:
      case 62:
        if ("<<" === operator || ">>" === operator)
          return 7;
        return 3;
      case 61:
      case 126:
        return 3;
      case 33:
        return 3;
      case 111:
        return 1;
    }
  } else if (97 === charCode && "and" === operator)
    return 2;
  return 0;
}
function parseSubExpression(minPrecedence, flowContext) {
  var operator = token.value, expression, marker;
  if (trackLocations)
    marker = createLocationMarker();
  if (isUnary(token)) {
    markLocation();
    next();
    var argument = parseSubExpression(10, flowContext);
    if (argument == null)
      raiseUnexpectedToken("<expression>", token);
    expression = finishNode(ast.unaryExpression(operator, argument));
  }
  if (null == expression) {
    expression = parsePrimaryExpression(flowContext);
    if (null == expression) {
      expression = parsePrefixExpression(flowContext);
    }
  }
  if (null == expression)
    return null;
  var precedence;
  while (true) {
    operator = token.value;
    precedence = Punctuator === token.type || Keyword === token.type ? binaryPrecedence(operator) : 0;
    if (Punctuator === token.type && token.value === "=>") {
      break;
    }
    if (precedence === 0 || precedence <= minPrecedence)
      break;
    if ("^" === operator || ".." === operator)
      --precedence;
    next();
    var right = parseSubExpression(precedence, flowContext);
    if (null == right)
      raiseUnexpectedToken("<expression>", token);
    if (trackLocations)
      locations.push(marker);
    expression = finishNode(ast.binaryExpression(operator, expression, right));
  }
  return expression;
}
function parsePrefixExpressionPart(base, marker, flowContext) {
  var expression, identifier;
  if (Punctuator === token.type) {
    switch (token.value) {
      case "[":
        pushLocation(marker);
        next();
        expression = parseExpectedExpression(flowContext);
        expect("]");
        return finishNode(ast.indexExpression(base, expression));
      case ".":
      case "?.":
        var operator = token.value;
        pushLocation(marker);
        next();
        identifier = parseIdentifier();
        return finishNode(ast.memberExpression(base, operator, identifier));
      case ":":
        pushLocation(marker);
        next();
        identifier = parseIdentifier();
        base = finishNode(ast.memberExpression(base, ":", identifier));
        pushLocation(marker);
        return parseCallExpression(base, flowContext);
      case "(":
      case "{":
        pushLocation(marker);
        return parseCallExpression(base, flowContext);
    }
  } else if (StringLiteral === token.type) {
    pushLocation(marker);
    return parseCallExpression(base, flowContext);
  }
  return null;
}
function parsePrefixExpression(flowContext) {
  var base, name, marker;
  if (trackLocations)
    marker = createLocationMarker();
  if (Identifier === token.type) {
    name = token.value;
    base = parseIdentifier();
    if (options.scope)
      attachScope(base, scopeHasName(name));
  } else if (consume("(")) {
    base = parseExpectedExpression(flowContext);
    expect(")");
  } else {
    return null;
  }
  for (; ; ) {
    var newBase = parsePrefixExpressionPart(base, marker, flowContext);
    if (newBase === null)
      break;
    base = newBase;
  }
  return base;
}
function parseCallExpression(base, flowContext) {
  if (Punctuator === token.type) {
    switch (token.value) {
      case "(":
        if (!features.emptyStatement) {
          if (token.line !== previousToken.line)
            raise(null, errors.ambiguousSyntax, token.value);
        }
        next();
        var expressions = [];
        var expression = parseExpression(flowContext);
        if (null != expression) {
          expressions.push(expression);
          while (consume(",")) {
            expression = parseExpectedExpression(flowContext);
            expressions.push(expression);
          }
        }
        expect(")");
        return finishNode(ast.callExpression(base, expressions));
      case "{":
        markLocation();
        next();
        var table = parseTableConstructor(flowContext);
        return finishNode(ast.tableCallExpression(base, table));
    }
  } else if (StringLiteral === token.type) {
    return finishNode(ast.stringCallExpression(base, parsePrimaryExpression(flowContext)));
  }
  raiseUnexpectedToken("function arguments", token);
}
function parsePrimaryExpression(flowContext) {
  var literals = StringLiteral | NumericLiteral | BooleanLiteral | NilLiteral | VarargLiteral | StringHashLiteral, value = token.value, type = token.type, marker;
  if (trackLocations)
    marker = createLocationMarker();
  if (type === VarargLiteral && !flowContext.allowVararg) {
    raise(token, errors.cannotUseVararg, token.value);
  }
  if (Keyword === lookahead.type && "in" === lookahead.value) {
    next();
    return parseInStatement(flowContext);
  } else if (type & literals) {
    pushLocation(marker);
    var raw = input.slice(token.range[0], token.range[1]);
    next();
    return finishNode(ast.literal(type, value, raw));
  } else if (Keyword === type && "function" === value) {
    pushLocation(marker);
    next();
    if (options.scope)
      createScope();
    return parseFunctionDeclaration(null);
  } else if (consume("{")) {
    pushLocation(marker);
    return parseTableConstructor(flowContext);
  }
}
_exports.parse = parse;
var versionFeatures = {
  "5.1": {},
  "5.2": {
    labels: true,
    emptyStatement: true,
    hexEscapes: true,
    skipWhitespaceEscape: true,
    strictEscapes: true,
    relaxedBreak: true
  },
  "5.3": {
    labels: true,
    emptyStatement: true,
    hexEscapes: true,
    skipWhitespaceEscape: true,
    strictEscapes: true,
    unicodeEscapes: true,
    bitwiseOperators: true,
    integerDivision: true,
    relaxedBreak: true
  },
  "5.4": {
    labels: true,
    emptyStatement: true,
    hexEscapes: true,
    skipWhitespaceEscape: true,
    strictEscapes: true,
    unicodeEscapes: true,
    bitwiseOperators: true,
    integerDivision: true,
    relaxedBreak: true,
    noLabelShadowing: true,
    attributes: { "const": true, "close": true },
    relaxedUTF8: true
  },
  "LuaJIT": {
    // XXX: LuaJIT language features may depend on compilation options; may need to
    // rethink how to handle this. Specifically, there is a LUAJIT_ENABLE_LUA52COMPAT
    // that removes contextual goto. Maybe add 'LuaJIT-5.2compat' as well?
    labels: true,
    contextualGoto: true,
    hexEscapes: true,
    skipWhitespaceEscape: true,
    strictEscapes: true,
    unicodeEscapes: true,
    imaginaryNumbers: true,
    integerSuffixes: true
  }
};
function parse(_input, _options) {
  if ("undefined" === typeof _options && "object" === typeof _input) {
    _options = _input;
    _input = void 0;
  }
  if (!_options)
    _options = {};
  input = _input || "";
  options = assign({}, defaultOptions, _options);
  index = 0;
  line = 1;
  lineStart = 0;
  length = input.length;
  scopes = [[]];
  scopeDepth = 0;
  globals = [];
  locations = [];
  if (!Object.prototype.hasOwnProperty.call(versionFeatures, options.luaVersion)) {
    throw new Error(sprintf("Lua version '%1' not supported", options.luaVersion));
  }
  features = assign({}, versionFeatures[options.luaVersion]);
  if (options.extendedIdentifiers !== void 0)
    features.extendedIdentifiers = !!options.extendedIdentifiers;
  if (!Object.prototype.hasOwnProperty.call(encodingModes, options.encodingMode)) {
    throw new Error(sprintf("Encoding mode '%1' not supported", options.encodingMode));
  }
  encodingMode = encodingModes[options.encodingMode];
  if (options.comments)
    comments = [];
  if (!options.wait)
    return end();
  return _exports;
}
_exports.write = write;
function write(_input) {
  input += String(_input);
  length = input.length;
  return _exports;
}
_exports.end = end;
function end(_input) {
  if ("undefined" !== typeof _input)
    write(_input);
  if (input && input.substr(0, 2) === "#!") {
    input = input.replace(/^.*/, function(line2) {
      return line2.replace(/./g, " ");
    });
  }
  length = input.length;
  trackLocations = options.locations || options.ranges;
  lookahead = lex();
  var chunk = parseChunk();
  if (options.comments)
    chunk.comments = comments;
  if (options.scope)
    chunk.globals = globals;
  if (locations.length > 0)
    throw new Error("Location tracking failed. This is most likely a bug in luaparse");
  return chunk;
}
var leapparse_default = _exports;

// functions/api.js
var import_fs = __toESM(require("fs"), 1);

// features/basicFeature.js
var BasicFeature = class {
  shouldEdit() {
  }
  edit() {
  }
};

// node_modules/estree-walker/src/walker.js
var WalkerBase = class {
  constructor() {
    this.should_skip = false;
    this.should_remove = false;
    this.replacement = null;
    this.context = {
      skip: () => this.should_skip = true,
      remove: () => this.should_remove = true,
      replace: (node) => this.replacement = node
    };
  }
  /**
   * @template {Node} Parent
   * @param {Parent | null | undefined} parent
   * @param {keyof Parent | null | undefined} prop
   * @param {number | null | undefined} index
   * @param {Node} node
   */
  replace(parent, prop, index2, node) {
    if (parent && prop) {
      if (index2 != null) {
        parent[prop][index2] = node;
      } else {
        parent[prop] = node;
      }
    }
  }
  /**
   * @template {Node} Parent
   * @param {Parent | null | undefined} parent
   * @param {keyof Parent | null | undefined} prop
   * @param {number | null | undefined} index
   */
  remove(parent, prop, index2) {
    if (parent && prop) {
      if (index2 !== null && index2 !== void 0) {
        parent[prop].splice(index2, 1);
      } else {
        delete parent[prop];
      }
    }
  }
};

// node_modules/estree-walker/src/sync.js
var SyncWalker = class extends WalkerBase {
  /**
   *
   * @param {SyncHandler} [enter]
   * @param {SyncHandler} [leave]
   */
  constructor(enter, leave) {
    super();
    this.should_skip = false;
    this.should_remove = false;
    this.replacement = null;
    this.context = {
      skip: () => this.should_skip = true,
      remove: () => this.should_remove = true,
      replace: (node) => this.replacement = node
    };
    this.enter = enter;
    this.leave = leave;
  }
  /**
   * @template {Node} Parent
   * @param {Node} node
   * @param {Parent | null} parent
   * @param {keyof Parent} [prop]
   * @param {number | null} [index]
   * @returns {Node | null}
   */
  visit(node, parent, prop, index2) {
    if (node) {
      if (this.enter) {
        const _should_skip = this.should_skip;
        const _should_remove = this.should_remove;
        const _replacement = this.replacement;
        this.should_skip = false;
        this.should_remove = false;
        this.replacement = null;
        this.enter.call(this.context, node, parent, prop, index2);
        if (this.replacement) {
          node = this.replacement;
          this.replace(parent, prop, index2, node);
        }
        if (this.should_remove) {
          this.remove(parent, prop, index2);
        }
        const skipped = this.should_skip;
        const removed = this.should_remove;
        this.should_skip = _should_skip;
        this.should_remove = _should_remove;
        this.replacement = _replacement;
        if (skipped)
          return node;
        if (removed)
          return null;
      }
      let key;
      for (key in node) {
        const value = node[key];
        if (value && typeof value === "object") {
          if (Array.isArray(value)) {
            const nodes = (
              /** @type {Array<unknown>} */
              value
            );
            for (let i = 0; i < nodes.length; i += 1) {
              const item = nodes[i];
              if (isNode(item)) {
                if (!this.visit(item, node, key, i)) {
                  i--;
                }
              }
            }
          } else if (isNode(value)) {
            this.visit(value, node, key, null);
          }
        }
      }
      if (this.leave) {
        const _replacement = this.replacement;
        const _should_remove = this.should_remove;
        this.replacement = null;
        this.should_remove = false;
        this.leave.call(this.context, node, parent, prop, index2);
        if (this.replacement) {
          node = this.replacement;
          this.replace(parent, prop, index2, node);
        }
        if (this.should_remove) {
          this.remove(parent, prop, index2);
        }
        const removed = this.should_remove;
        this.replacement = _replacement;
        this.should_remove = _should_remove;
        if (removed)
          return null;
      }
    }
    return node;
  }
};
function isNode(value) {
  return value !== null && typeof value === "object" && "type" in value && typeof value.type === "string";
}

// node_modules/estree-walker/src/index.js
function walk(ast7, { enter, leave }) {
  const instance = new SyncWalker(enter, leave);
  return instance.visit(ast7, null);
}

// functions/utils.js
var import_luamin2 = __toESM(require_luamin(), 1);

// node_modules/@ungap/structured-clone/esm/types.js
var VOID = -1;
var PRIMITIVE = 0;
var ARRAY = 1;
var OBJECT = 2;
var DATE = 3;
var REGEXP = 4;
var MAP = 5;
var SET = 6;
var ERROR = 7;
var BIGINT = 8;

// node_modules/@ungap/structured-clone/esm/deserialize.js
var env = typeof self === "object" ? self : globalThis;
var deserializer = ($, _) => {
  const as = (out, index2) => {
    $.set(index2, out);
    return out;
  };
  const unpair = (index2) => {
    if ($.has(index2))
      return $.get(index2);
    const [type, value] = _[index2];
    switch (type) {
      case PRIMITIVE:
      case VOID:
        return as(value, index2);
      case ARRAY: {
        const arr = as([], index2);
        for (const index3 of value)
          arr.push(unpair(index3));
        return arr;
      }
      case OBJECT: {
        const object = as({}, index2);
        for (const [key, index3] of value)
          object[unpair(key)] = unpair(index3);
        return object;
      }
      case DATE:
        return as(new Date(value), index2);
      case REGEXP: {
        const { source, flags } = value;
        return as(new RegExp(source, flags), index2);
      }
      case MAP: {
        const map = as(/* @__PURE__ */ new Map(), index2);
        for (const [key, index3] of value)
          map.set(unpair(key), unpair(index3));
        return map;
      }
      case SET: {
        const set = as(/* @__PURE__ */ new Set(), index2);
        for (const index3 of value)
          set.add(unpair(index3));
        return set;
      }
      case ERROR: {
        const { name, message } = value;
        return as(new env[name](message), index2);
      }
      case BIGINT:
        return as(BigInt(value), index2);
      case "BigInt":
        return as(Object(BigInt(value)), index2);
    }
    return as(new env[type](value), index2);
  };
  return unpair;
};
var deserialize = (serialized) => deserializer(/* @__PURE__ */ new Map(), serialized)(0);

// node_modules/@ungap/structured-clone/esm/serialize.js
var EMPTY = "";
var { toString } = {};
var { keys } = Object;
var typeOf = (value) => {
  const type = typeof value;
  if (type !== "object" || !value)
    return [PRIMITIVE, type];
  const asString = toString.call(value).slice(8, -1);
  switch (asString) {
    case "Array":
      return [ARRAY, EMPTY];
    case "Object":
      return [OBJECT, EMPTY];
    case "Date":
      return [DATE, EMPTY];
    case "RegExp":
      return [REGEXP, EMPTY];
    case "Map":
      return [MAP, EMPTY];
    case "Set":
      return [SET, EMPTY];
  }
  if (asString.includes("Array"))
    return [ARRAY, asString];
  if (asString.includes("Error"))
    return [ERROR, asString];
  return [OBJECT, asString];
};
var shouldSkip = ([TYPE, type]) => TYPE === PRIMITIVE && (type === "function" || type === "symbol");
var serializer = (strict, json, $, _) => {
  const as = (out, value) => {
    const index2 = _.push(out) - 1;
    $.set(value, index2);
    return index2;
  };
  const pair = (value) => {
    if ($.has(value))
      return $.get(value);
    let [TYPE, type] = typeOf(value);
    switch (TYPE) {
      case PRIMITIVE: {
        let entry = value;
        switch (type) {
          case "bigint":
            TYPE = BIGINT;
            entry = value.toString();
            break;
          case "function":
          case "symbol":
            if (strict)
              throw new TypeError("unable to serialize " + type);
            entry = null;
            break;
          case "undefined":
            return as([VOID], value);
        }
        return as([TYPE, entry], value);
      }
      case ARRAY: {
        if (type)
          return as([type, [...value]], value);
        const arr = [];
        const index2 = as([TYPE, arr], value);
        for (const entry of value)
          arr.push(pair(entry));
        return index2;
      }
      case OBJECT: {
        if (type) {
          switch (type) {
            case "BigInt":
              return as([type, value.toString()], value);
            case "Boolean":
            case "Number":
            case "String":
              return as([type, value.valueOf()], value);
          }
        }
        if (json && "toJSON" in value)
          return pair(value.toJSON());
        const entries = [];
        const index2 = as([TYPE, entries], value);
        for (const key of keys(value)) {
          if (strict || !shouldSkip(typeOf(value[key])))
            entries.push([pair(key), pair(value[key])]);
        }
        return index2;
      }
      case DATE:
        return as([TYPE, value.toISOString()], value);
      case REGEXP: {
        const { source, flags } = value;
        return as([TYPE, { source, flags }], value);
      }
      case MAP: {
        const entries = [];
        const index2 = as([TYPE, entries], value);
        for (const [key, entry] of value) {
          if (strict || !(shouldSkip(typeOf(key)) || shouldSkip(typeOf(entry))))
            entries.push([pair(key), pair(entry)]);
        }
        return index2;
      }
      case SET: {
        const entries = [];
        const index2 = as([TYPE, entries], value);
        for (const entry of value) {
          if (strict || !shouldSkip(typeOf(entry)))
            entries.push(pair(entry));
        }
        return index2;
      }
    }
    const { message } = value;
    return as([TYPE, { name: type, message }], value);
  };
  return pair;
};
var serialize = (value, { json, lossy } = {}) => {
  const _ = [];
  return serializer(!(json || lossy), !!json, /* @__PURE__ */ new Map(), _)(value), _;
};

// node_modules/@ungap/structured-clone/esm/index.js
var esm_default = typeof structuredClone === "function" ? (
  /* c8 ignore start */
  (any, options2) => options2 && ("json" in options2 || "lossy" in options2) ? deserialize(serialize(any, options2)) : structuredClone(any)
) : (any, options2) => deserialize(serialize(any, options2));

// functions/hooking.js
var import_luamin = __toESM(require_luamin(), 1);
var hooks = [];
function AddHook(id, content) {
  if (!hooks[id]) {
    hooks[id] = [];
  }
  var _content = import_luamin.default.minify(content);
  var _ast = leapparse_default.parse(_content, { locations: true, luaVersion: "5.4" });
  hooks[id].push(_ast);
}
function GetHooks() {
  return hooks;
}

// functions/utils.js
var ast2 = leapparse_default.ast;
function declareAstFunction(name, params, loc) {
  var name = markLoc(ast2.identifier(name), loc);
  var exp = markLoc(ast2.callExpression(
    name,
    params
  ), loc);
  var statement = markLoc(ast2.callStatement(exp), loc);
  return statement;
}
function markLoc(block, loc) {
  block.loc = loc;
  return block;
}
function markAstLoc(ast7, loc) {
  walk(ast7, {
    enter(node) {
      node.loc = loc;
    }
  });
  return ast7;
}
function formatAst(ast7, replace, loc) {
  let cloned = esm_default(ast7);
  walk(cloned, {
    enter(node) {
      for (const [nodeKey, toReplace] of Object.entries(replace)) {
        if (node[nodeKey]) {
          if (nodeKey == "raw") {
            for (const [key, value] of Object.entries(toReplace)) {
              node[nodeKey] = node[nodeKey].replace(key, value);
            }
          } else {
            node[nodeKey] = toReplace[node[nodeKey]] || node[nodeKey];
          }
        }
      }
      if (loc) {
        node.loc = loc;
      }
    }
  });
  return cloned;
}
function codeToAst(code) {
  code = import_luamin2.default.minify(code);
  let ast7 = leapparse_default.parse(code, { locations: true, luaVersion: "5.4" });
  ast7 = ast7.body[0];
  return ast7;
}
function applyFeaturesToAst(ast7, features2) {
  var featuresFound = {};
  walk(ast7, {
    enter(node, parent, prop, index2) {
      for (let feature of features2) {
        if (feature.shouldEdit.call(this, node, parent)) {
          featuresFound[feature.constructor.name] = true;
          feature.edit.call(this, node, parent, prop, index2);
        }
      }
    }
  });
  return featuresFound;
}
function injectHooks(ast7, featuresFound) {
  var hooks2 = GetHooks();
  for (let featureName in featuresFound) {
    if (!hooks2[featureName]) {
      continue;
    }
    hooks2[featureName].map((contentAst) => {
      ast7.body.unshift(...contentAst.body);
    });
  }
}

// features/classes.js
var ast3 = leapparse_default.ast;
var classCode = `
classBuilder = function(name, prototype, baseClass)
    prototype.__type = name
    
    -- Will always be an empty table if not extending, so we check if the baseClass its nil (not defined) this mean that it tried to pass a class but it was not defined
    if not baseClass then
        error("ExtendingNotDefined: "..name.." tried to extend a class that is not defined", 2)
    end

    if baseClass.__prototype then
        prototype.super = setmetatable({}, {
            __index = function(self, key)
                return baseClass.__prototype[key]
            end,
            __call = function(self, ...)
                return baseClass(...)
            end
        })
    end

    _G[name] = setmetatable({__type = name, __prototype = prototype}, {
        __index = function(self, key)
            if self.__prototype.super then
                return self.__prototype[key] or self.__prototype.super[key]
            else
                return self.__prototype[key]
            end
        end,
        __newindex = function(self, k, v)
			if k:sub(1, 2) == "__" then
				rawset(self, k, v)
			else
				error("attempt to assign class property '"..k.."' directly, please instantiate the class before assigning any properties", 2)
			end
        end,
        __call = function(self, ...)
            -- Create new object
            local obj = setmetatable({__type = self.__type}, {
                __index = function(_self, key) 
                    if self.__prototype.super then
                        return self.__prototype[key] or self.__prototype.super[key]
                    else
                        return self.__prototype[key]
                    end
                end,
                __gc = function(_self)
                    if _self.destructor then
                        _self:destructor()
                    end
                end
            })
    
            if not self.__skipNextConstructor then
                if obj.constructor then
                    obj:constructor(...)
                end
            else
                self.__skipNextConstructor = nil
            end
    
            return obj
        end
    })
end

if not leap then leap = {} end

-- Function to deserialize objects (example: objects sended over the network)
leap.deserialize = function(class)
    if type(class) == "table" and class.__type then
        local _class = _G[class.__type]

        if _class then
            _class.__skipNextConstructor = true -- Skip next constructor call
            local obj = _class()

            -- Copy all properties to the new instantiated object
            for k, v in pairs(class) do
                obj[k] = v
            end

			return obj
        else
            error("Class '"..class.__type.."' not found", 2)
        end
    end
end

-- Type override (allow custom types)
if not _type then
    _type = type -- we preserve the original "type" function
    type = function(var)
        local realType = _type(var)

        if realType == "table" and var.__type then
            return var.__type
        else
            return realType
        end
    end
end
`;
function GetBaseClass(node) {
  if (node.extends) {
    return node.extends;
  } else {
    var loc = { start: node.loc.end, end: node.loc.end };
    return markLoc(ast3.tableConstructorExpression({}), loc);
  }
}
function InjectSelfInFunctions(table) {
  table.fields.forEach((field) => {
    if (field.value.type == "FunctionDeclaration") {
      var loc = {
        // its not a typo, we want it to be at the same line, only the line its taken in consideration, column its ignored, yet (so its not a problem copying directly the location)
        start: field.value.loc.start,
        end: field.value.loc.start
      };
      var self2 = markLoc(ast3.identifier("self"), loc);
      field.value.parameters.unshift(self2);
    }
  });
  return table;
}
function GetName(node) {
  return markLoc(
    ast3.literal(
      leapparse_default.tokenTypes.StringLiteral,
      node.identifier.name,
      '"' + node.identifier.name + '"'
    ),
    node.identifier.loc
  );
}
var Class = class extends BasicFeature {
  shouldEdit(node, parent) {
    return node.type === "ClassStatement";
  }
  edit(node, parent) {
    var table = node.body;
    table.loc.start.line -= 1;
    table = InjectSelfInFunctions(table);
    var name = GetName(node);
    var baseClass = GetBaseClass(node);
    var classBuilder = declareAstFunction("classBuilder", [name, table, baseClass], node.loc);
    this.replace(classBuilder);
  }
};
AddHook("Class", classCode);

// features/defaultValue.js
var bakedAst = codeToAst(`
    if PARAM == nil then 
        PARAM = DEFAULT_VALUE
    end
`);
var DefaultValue = class extends BasicFeature {
  shouldEdit(node, parent) {
    return node.type === "DefaultParameterValue";
  }
  edit(node, parent) {
    var _ast = formatAst(bakedAst, {
      name: {
        PARAM: node.parameter.name,
        DEFAULT_VALUE: node.expression.raw
      }
    }, node.loc);
    parent.body.unshift(_ast);
    this.replace(node.parameter);
  }
};

// features/typeChecking.js
var bakedAst2 = codeToAst(`
    if type(PARAM) ~= "TYPE" then
        if _G[PARAM] and type(_G[PARAM]) == "table" and _G[PARAM].__prototype then
            if not leap or not leap.deserialize then
                error("leap.deserialize not found, make sure you have some class loaded", 2)
            end

            PARAM = leap.deserialize(PARAM)
        else
            error("PARAM_NAME: TYPE expected, got " .. type(PARAM))
        end
    end
`);
var TypeChecking = class extends BasicFeature {
  shouldEdit(node, parent) {
    return node.type === "IdentifierWithTypeAttribute";
  }
  edit(node, parent) {
    var _ast;
    if (node.name.type == "DefaultParameterValue") {
      _ast = formatAst(bakedAst2, {
        name: {
          PARAM: node.name.parameter.name
        },
        raw: {
          PARAM_NAME: node.name.parameter.name,
          TYPE: node.attribute.name
        }
      }, node.loc);
      parent.body.unshift(_ast);
      var defaultValue = new DefaultValue();
      defaultValue.edit.call(this, node.name, parent);
    } else {
      _ast = formatAst(bakedAst2, {
        name: {
          PARAM: node.name.name
        },
        raw: {
          PARAM_NAME: node.name.name,
          TYPE: node.attribute.name
        }
      }, node.loc);
      this.replace(node.name);
      parent.body.unshift(_ast);
    }
  }
};

// functions/astToCode.js
var AstToCode = class {
  code = "";
  currentLine = 1;
  lineCorrection = true;
  constructor(lineCorrection = true) {
    this.lineCorrection = lineCorrection;
  }
  addNewLine() {
    this.code += "\n";
  }
  // TODO: make it actually work
  calculateIndentation(node) {
    const startColumn = node.loc.start.column;
    if (startColumn > 1) {
      return " ".repeat(startColumn);
    } else {
      return "";
    }
  }
  lineNeedsToBeCorrected(node, end2) {
    if (!node) {
      throw new Error("lineNeedsToBeCorrected: node is null");
    }
    if (!node.loc || !node.loc.start || !node.loc.end) {
      throw new Error("lineNeedsToBeCorrected: node doesn't have loc, " + JSON.stringify(node));
    }
    if (!this.lineCorrection) {
      return false;
    }
    let line2 = end2 ? node.loc.end.line : node.loc.start.line;
    return line2 > this.currentLine;
  }
  correctLineNumber(node, end2) {
    let line2 = end2 ? node.loc.end.line : node.loc.start.line;
    let lines = line2 - this.currentLine;
    this.code += "\n".repeat(lines);
    this.currentLine = line2;
  }
  correctLineForConcatenation(node, end2) {
    if (this.lineNeedsToBeCorrected(node, end2)) {
      this.correctLineNumber(node, end2);
    }
  }
  processNodes(nodes, separator = "") {
    if (nodes.length == 0) {
      return;
    }
    nodes.forEach((node) => {
      this.processNode(node);
      if (separator.length > 0) {
        this.code += separator;
      }
    });
    if (separator.length > 0) {
      this.code = this.code.slice(0, -separator.length);
    }
  }
  switchGeneral(node) {
    switch (node.type) {
      case "Chunk":
        node.body.forEach((node2) => this.processNode(node2));
        return true;
      case "Identifier":
      case "Attribute":
        this.code += node.name;
        return true;
      case "IdentifierWithAttribute":
        this.processNode(node.name);
        this.code += " ";
        this.code += "<";
        this.processNode(node.attribute);
        this.code += "> ";
        return true;
      case "StringLiteral":
      case "NumericLiteral":
      case "BooleanLiteral":
      case "NilLiteral":
      case "VarargLiteral":
      case "StringHashLiteral":
        this.code += node.raw;
        return true;
      case "FunctionDeclaration":
        this.code += `${node.identifier?.name ? "" : "("} function ${node.identifier?.name || ""}(`;
        this.processNodes(node.parameters, ", ");
        this.code += `) `;
        node.body.forEach((node2) => this.processNode(node2));
        if (this.lineNeedsToBeCorrected(node, true)) {
          this.correctLineNumber(node, true);
        }
        this.code += ` end${node.identifier?.name ? "" : ")"}`;
        return true;
      default:
        return false;
    }
  }
  switchExpressions(node) {
    switch (node.type) {
      case "MemberExpression":
        if (node.indexer == ":" && (node.base.type == "StringLiteral" || node.base.type == "NumericLiteral")) {
          this.code += "(";
          this.processNode(node.base);
          this.code += ")";
        } else {
          this.processNode(node.base);
        }
        this.code += `${node.indexer}`;
        this.processNode(node.identifier);
        return true;
      case "LogicalExpression":
      case "BinaryExpression":
        this.code += "(";
        this.processNode(node.left);
        this.code += ` ${node.operator} `;
        this.processNode(node.right);
        this.code += ")";
        return true;
      case "UnaryExpression":
        this.code += `(`;
        this.code += `${node.operator} `;
        this.processNode(node.argument);
        this.code += `)`;
        return true;
      case "CallExpression":
        this.processNode(node.base);
        this.code += "(";
        if (node.arguments.length > 0) {
          this.processNodes(node.arguments, ", ");
        }
        this.code += ")";
        return true;
      case "ArrowFunctionExpression":
        this.processNode(node.body);
        return true;
      case "TableConstructorExpression":
        this.code += "{";
        if (node.fields.length > 0) {
          var separator = ",";
          node.fields.forEach((field) => {
            switch (field.type) {
              case "TableKey":
                this.code += "[";
                this.processNode(field.key);
                this.code += "] = ";
                this.processNode(field.value);
                break;
              case "TableValue":
                this.processNode(field.value);
                break;
              case "TableKeyString":
                this.processNode(field.key);
                this.code += " = ";
                this.processNode(field.value);
            }
            this.code += separator;
          });
          this.code = this.code.slice(0, -separator.length);
        }
        this.correctLineForConcatenation(node, true);
        this.code += "}";
        return true;
      case "TableCallExpression":
        this.processNode(node.base);
        this.processNode(node.arguments);
        return true;
      case "StringCallExpression":
        this.processNode(node.base);
        this.processNode(node.argument);
        return true;
      case "IndexExpression":
        this.processNode(node.base);
        this.code += "[";
        this.processNode(node.index);
        this.code += "]";
        return true;
      default:
        return false;
    }
  }
  switchStatements(node) {
    switch (node.type) {
      case "CallStatement":
        this.processNode(node.expression);
        return true;
      case "LocalStatement":
        this.code += " local ";
        this.processNodes(node.variables, ", ");
        this.code += " = ";
        node.init.forEach((node2) => this.processNode(node2));
        this.code += ";";
        return true;
      case "ClassStatement":
        this.code += " class ";
        this.processNode(node.identifier);
        this.processNode(node.body);
        return true;
      case "AssignmentStatement":
        this.processNodes(node.variables, ", ");
        this.code += ` = `;
        this.processNodes(node.init, ", ");
        this.code += ";";
        return true;
      case "ArrowFunctionStatement":
        this.code += ` function(`;
        this.processNodes(node.parameters, ", ");
        this.code += `) `;
        node.body.forEach((node2) => this.processNode(node2));
        if (this.lineNeedsToBeCorrected(node, true)) {
          this.correctLineNumber(node, true);
        }
        this.code += " end ";
        return true;
      case "CompoundAssignmentStatement":
        this.processNode(node.variable);
        this.code += ` ${node.operator} `;
        this.processNode(node.init);
        return true;
      case "InStatement":
        this.code += "leap_in(";
        this.processNode(node.left);
        this.code += ", ";
        if (node.right.type == "Identifier") {
          this.processNode(node.right);
          this.code += ")";
        } else {
          switch (node.right.type) {
            case "MemberExpression":
              this.processNode(node.right.base);
              this.code += ", ";
              this.code += `"${node.right.identifier.name}"`;
              break;
            case "IndexExpression":
              this.processNode(node.right.base);
              this.code += ", ";
              this.processNode(node.right.index);
              break;
          }
          this.code += ")";
        }
        return true;
      case "IfStatement":
        this.processNodes(node.clauses);
        this.correctLineForConcatenation(node, true);
        this.code += " end;";
        return true;
      case "TableComprehensionGenericStatement":
        this.code += "(function()";
        this.code += ")()";
      case "IfClause":
        this.code += " if ";
        this.processNode(node.condition);
        this.code += " then ";
        this.processNodes(node.body);
        return true;
      case "ElseifClause":
        this.code += " elseif ";
        this.processNode(node.condition);
        this.code += " then ";
        this.processNodes(node.body);
        return true;
      case "ElseClause":
        this.code += " else ";
        this.processNodes(node.body);
        return true;
      case "WhileStatement":
        this.code += " while ";
        this.processNode(node.condition);
        this.code += " do ";
        this.processNodes(node.body);
        this.correctLineForConcatenation(node, true);
        this.code += " end;";
        return true;
      case "DoStatement":
        this.code += " do ";
        this.processNodes(node.body);
        this.correctLineForConcatenation(node, true);
        this.code += " end;";
        return true;
      case "ReturnStatement":
        this.code += " return ";
        this.processNodes(node.arguments, ", ");
        this.code += ";";
        return true;
      case "BreakStatement":
        this.code += "break;";
        return true;
      case "UnpackStatement":
        if (node.variables) {
          this.processNodes(node.variables, ",");
          this.code += " in ";
          this.processNode(node.table);
        } else {
          this.code += " table.unpack(";
          this.processNode(node.table);
          this.code += ") ";
        }
        return true;
      case "RepeatStatement":
        this.code += " repeat ";
        this.processNodes(node.body);
        this.code += " until ";
        this.processNode(node.condition);
        return true;
      case "ForGenericStatement":
        this.code += " for ";
        this.processNodes(node.variables, ", ");
        this.code += " in ";
        this.processNodes(node.iterators, ", ");
        this.code += " do ";
        this.processNodes(node.body);
        this.correctLineForConcatenation(node, true);
        this.code += " end;";
        return true;
      case "ForNumericStatement":
        this.code += " for ";
        this.processNode(node.variable);
        this.code += " = ";
        this.processNode(node.start);
        this.code += ", ";
        this.processNode(node.end);
        this.code += " do ";
        this.processNodes(node.body);
        this.correctLineForConcatenation(node, true);
        this.code += " end;";
        return true;
      case "LabelStatement":
        this.code += "::";
        this.processNode(node.label);
        this.code += "::";
        return true;
      case "GotoStatement":
        this.code += " goto ";
        this.processNode(node.label);
        return true;
      default:
        return false;
    }
  }
  processNode(node) {
    if (this.lineNeedsToBeCorrected(node)) {
      this.correctLineNumber(node);
    }
    let found = false;
    found = this.switchGeneral(node);
    if (found) {
      this.currentLine = node.loc.end.line;
      return;
    }
    found = this.switchExpressions(node);
    if (found) {
      this.currentLine = node.loc.end.line;
      return;
    }
    found = this.switchStatements(node);
    if (found) {
      this.currentLine = node.loc.end.line;
      return;
    }
    console.log(node);
    throw new Error("Unhandled node type: " + node.type);
  }
  processAst(ast7) {
    this.code = "";
    this.currentLine = 1;
    this.processNode(ast7);
    return this.code;
  }
};
var astToCode_default = AstToCode;

// features/decorator.js
var ast4 = leapparse_default.ast;
var decorators = [];
var decorator = codeToAst(`
    FUNCTION_NAME = DECORATOR(
        setmetatable({name = "FUNCTION_NAME"}, {
            __call = function(self, ...) return ORIGINAL_FUNCTION(...) end
        })
    )
`);
function saveOriginalFunction(node) {
  let originalFunction = ast4.identifier("_" + node.identifier.name);
  originalFunction = markLoc(originalFunction, node.loc);
  var originalFunctionLocal = ast4.localStatement([originalFunction], [node.identifier]);
  originalFunctionLocal = markLoc(originalFunctionLocal, node.loc);
  return originalFunctionLocal;
}
function processDecorator(decorator2) {
  var astToCode = new astToCode_default(false);
  return astToCode.processAst(decorator2);
}
var Decorator = class extends BasicFeature {
  shouldEdit(node, parent) {
    return node.type === "DecoratorStatement" || node.type === "FunctionDeclaration";
  }
  edit(node, parent, prop, index2) {
    switch (node.type) {
      case "DecoratorStatement":
        decorators.push(node);
        this.remove();
        break;
      case "FunctionDeclaration":
        if (decorators.length > 0) {
          let nodes = [];
          var originalFunctionLocal = saveOriginalFunction(node);
          nodes.push(originalFunctionLocal);
          for (let _decorator of decorators) {
            let processedDecorator = processDecorator(_decorator.base);
            let decoratorNode = formatAst(decorator, {
              name: {
                ORIGINAL_FUNCTION: "_" + node.identifier.name,
                FUNCTION_NAME: node.identifier.name,
                DECORATOR: processedDecorator
              },
              raw: {
                FUNCTION_NAME: node.identifier.name
              }
            }, node.loc);
            decoratorNode.init[0].arguments.push(..._decorator.arguments);
            nodes.push(decoratorNode);
          }
          parent[prop].splice(index2 + 1, 0, ...nodes);
          decorators = [];
        }
        break;
    }
  }
};

// features/in.js
var ast5 = leapparse_default.ast;
var inFunctionCode = `
    leap_table_match = function(table, value)
        local needToMatch = 0
        local matched = 0

        for k1, v1 in pairs(value) do
            needToMatch = needToMatch + 1

            repeat 
                if v1.__exists then
                    if table[k1] then
                        matched = matched + 1
                    end
                    break
                end

                if v1.__type then
                    if type(table[k1]) == v1.__type then
                        matched = matched + 1
                    end

                    break
                end

                if v1.__match then
                    if type(table[k1]) == "string" and table[k1]:match(v1.__match) then
                        matched = matched + 1
                    end

                    break
                end

                if type(v1) == "table" then -- recursive
                    for k2, v2 in pairs(table) do
                        if type(v2) == "table" and leap_table_match(v1, v2) then
                            matched = matched + 1
                            break
                        end
                    end
                else
                    for k2, v2 in pairs(table) do
                        if v1 == v2 then
                            matched = matched + 1
                            break
                        end
                    end
                end
            until true
        end
        
        return matched == needToMatch
    end

    leap_in = function(value, tab, key)
        local _type = type(tab)

        if _type == "table" then
            if type(value) == "table" then
                return leap_table_match(tab, value)
            else
                for k, v in pairs(tab) do
                    local _v = key and v[key] or v
                    
                    if _v == value then
                        return true
                    end
                end
            end

        elseif _type == "string" then
            return tab:find(value)
        else
            error("in operator: unsupported type " .. _type)
        end

        return false
    end
`;
var In = class extends BasicFeature {
  shouldEdit(node, parent) {
    return node.type === "InStatement";
  }
  edit(node, parent) {
  }
};
AddHook("In", inFunctionCode);

// features/tableComprehension.js
var ast6 = leapparse_default.ast;
var generic = codeToAst(`
    (function()
        local __tab = {}

        for VARIABLES in ITERATORS do
            if CONDITIONS then
                __tab[STATEMENT_KEY] = STATEMENT_VALUE;
            end
        end

        return __tab
    end)()
`);
function generateTableInsert(tempTableIdentifier, statement, loc) {
  var table = markLoc(ast6.identifier("table"), loc);
  var insert = markLoc(ast6.identifier("insert"), loc);
  var memberExpression = markLoc(ast6.memberExpression(table, ".", insert), loc);
  var callExpression = markLoc(ast6.callExpression(memberExpression, [tempTableIdentifier, statement]), loc);
  var callStatement = markLoc(ast6.callStatement(callExpression), loc);
  return callStatement;
}
function generateCondition(conditions, loc) {
  if (conditions.length === 1) {
    return conditions[0];
  } else {
    const leftCondition = conditions.shift();
    const rightCondition = generateCondition(conditions, loc);
    return markLoc(ast6.binaryExpression("and", leftCondition, rightCondition), loc);
  }
}
var TableComprehension = class extends BasicFeature {
  shouldEdit(node, parent) {
    return node.type === "TableComprehensionStatement";
  }
  edit(node, parent) {
    var astToCode = new astToCode_default(false);
    var genericFormatted = void 0;
    if (node.statements[1]) {
      var statementKey = astToCode.processAst(node.statements[0]);
      var statementValue = astToCode.processAst(node.statements[1]);
      genericFormatted = formatAst(generic, {
        name: {
          STATEMENT_KEY: statementKey,
          STATEMENT_VALUE: statementValue
        }
      }, node.loc);
    } else {
      genericFormatted = esm_default(generic);
      markAstLoc(genericFormatted, node.loc);
    }
    var forGenericStatement = genericFormatted.expression.base.body[1];
    forGenericStatement.variables = node.variables;
    forGenericStatement.iterators = node.iterators;
    var ifClause = forGenericStatement.body[0].clauses[0];
    if (node.statements.length == 1) {
      var tempTableIdentifier = genericFormatted.expression.base.body[0].variables[0];
      var statement = node.statements[0];
      var table_insert = generateTableInsert(tempTableIdentifier, statement, node.loc);
      ifClause.body = [table_insert];
    }
    if (node.conditions.length == 0) {
      forGenericStatement.body = ifClause.body;
    } else {
      ifClause.condition = generateCondition(node.conditions, node.loc);
    }
    this.replace(genericFormatted);
  }
};

// functions/api.js
var featuresClasses = {
  class: new Class(),
  typeChecking: new TypeChecking(),
  decorator: new Decorator(),
  defaultValue: new DefaultValue(),
  in: new In(),
  tableComprehension: new TableComprehension()
};
var defaultFeaturesStatus = {
  class: true,
  typeChecking: true,
  decorator: true,
  defaultValue: true,
  in: true,
  tableComprehension: true
};
function preprocess(code, featuresStatus) {
  return new Promise((resolve, reject) => {
    try {
      resolve(preprocessSync(code, featuresStatus));
    } catch (error) {
      reject(error);
    }
  });
}
function preprocessFile(filePath, featuresStatus) {
  return new Promise((resolve, reject) => {
    try {
      resolve(preprocessFileSync(filePath, featuresStatus));
    } catch (error) {
      reject(error);
    }
  });
}
function preprocessSync(code, featuresStatus) {
  featuresStatus = Object.assign({}, defaultFeaturesStatus, featuresStatus);
  var features2 = [];
  for (let featureName in featuresStatus) {
    if (featuresStatus[featureName]) {
      features2.push(featuresClasses[featureName]);
    }
  }
  var ast7 = leapparse_default.parse(code, { locations: true, luaVersion: "5.4", comments: false });
  var featuresFound = applyFeaturesToAst(ast7, features2);
  injectHooks(ast7, featuresFound);
  var astToCode = new astToCode_default();
  return astToCode.processAst(ast7);
}
function preprocessFileSync(filePath, featuresStatus) {
  let file = import_fs.default.readFileSync(filePath, "utf8");
  return preprocessSync(file, featuresStatus);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  preprocess,
  preprocessFile,
  preprocessFileSync,
  preprocessSync
});
/*! Bundled license information:

luamin/luamin.js:
  (*! https://mths.be/luamin v1.0.4 by @mathias *)
*/
