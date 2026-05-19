'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');

function generateUUID() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var classnames = {exports: {}};

/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/

var hasRequiredClassnames;

function requireClassnames () {
	if (hasRequiredClassnames) return classnames.exports;
	hasRequiredClassnames = 1;
	(function (module) {
		/* global define */

		(function () {

		  var hasOwn = {}.hasOwnProperty;
		  function classNames() {
		    var classes = '';
		    for (var i = 0; i < arguments.length; i++) {
		      var arg = arguments[i];
		      if (arg) {
		        classes = appendClass(classes, parseValue(arg));
		      }
		    }
		    return classes;
		  }
		  function parseValue(arg) {
		    if (typeof arg === 'string' || typeof arg === 'number') {
		      return arg;
		    }
		    if (typeof arg !== 'object') {
		      return '';
		    }
		    if (Array.isArray(arg)) {
		      return classNames.apply(null, arg);
		    }
		    if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
		      return arg.toString();
		    }
		    var classes = '';
		    for (var key in arg) {
		      if (hasOwn.call(arg, key) && arg[key]) {
		        classes = appendClass(classes, key);
		      }
		    }
		    return classes;
		  }
		  function appendClass(value, newClass) {
		    if (!newClass) {
		      return value;
		    }
		    if (value) {
		      return value + ' ' + newClass;
		    }
		    return value + newClass;
		  }
		  if (module.exports) {
		    classNames.default = classNames;
		    module.exports = classNames;
		  } else {
		    window.classNames = classNames;
		  }
		})(); 
	} (classnames));
	return classnames.exports;
}

var classnamesExports = requireClassnames();
var classNames = /*@__PURE__*/getDefaultExportFromCjs(classnamesExports);

/*
 *  big.js v6.2.2
 *  A small, fast, easy-to-use library for arbitrary-precision decimal arithmetic.
 *  Copyright (c) 2024 Michael Mclaughlin
 *  https://github.com/MikeMcl/big.js/LICENCE.md
 */

/************************************** EDITABLE DEFAULTS *****************************************/

// The default values below must be integers within the stated ranges.

/*
 * The maximum number of decimal places (DP) of the results of operations involving division:
 * div and sqrt, and pow with negative exponents.
 */
var // 0, 1, 2 or 3

  // The maximum value of DP and Big.DP.
  MAX_DP = 1E6,
  // 0 to 1000000

  // The maximum magnitude of the exponent argument to the pow method.
  MAX_POWER = 1E6,
  // true or false

  /**************************************************************************************************/

  // Error messages.
  NAME = '[big.js] ',
  INVALID = NAME + 'Invalid ',
  INVALID_DP = INVALID + 'decimal places',
  INVALID_RM = INVALID + 'rounding mode',
  DIV_BY_ZERO = NAME + 'Division by zero',
  // The shared prototype object.
  P = {},
  UNDEFINED = void 0;

/*
 * Round Big x to a maximum of sd significant digits using rounding mode rm.
 *
 * x {Big} The Big to round.
 * sd {number} Significant digits: integer, 0 to MAX_DP inclusive.
 * rm {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
 * [more] {boolean} Whether the result of division was truncated.
 */
function round(x, sd, rm, more) {
  var xc = x.c;
  if (rm === UNDEFINED) rm = x.constructor.RM;
  if (rm !== 0 && rm !== 1 && rm !== 2 && rm !== 3) {
    throw Error(INVALID_RM);
  }
  if (sd < 1) {
    more = rm === 3 && (more || !!xc[0]) || sd === 0 && (rm === 1 && xc[0] >= 5 || rm === 2 && (xc[0] > 5 || xc[0] === 5 && (more || xc[1] !== UNDEFINED)));
    xc.length = 1;
    if (more) {
      // 1, 0.1, 0.01, 0.001, 0.0001 etc.
      x.e = x.e - sd + 1;
      xc[0] = 1;
    } else {
      // Zero.
      xc[0] = x.e = 0;
    }
  } else if (sd < xc.length) {
    // xc[sd] is the digit after the digit that may be rounded up.
    more = rm === 1 && xc[sd] >= 5 || rm === 2 && (xc[sd] > 5 || xc[sd] === 5 && (more || xc[sd + 1] !== UNDEFINED || xc[sd - 1] & 1)) || rm === 3 && (more || !!xc[0]);

    // Remove any digits after the required precision.
    xc.length = sd;

    // Round up?
    if (more) {
      // Rounding up may mean the previous digit has to be rounded up.
      for (; ++xc[--sd] > 9;) {
        xc[sd] = 0;
        if (sd === 0) {
          ++x.e;
          xc.unshift(1);
          break;
        }
      }
    }

    // Remove trailing zeros.
    for (sd = xc.length; !xc[--sd];) xc.pop();
  }
  return x;
}

/*
 * Return a string representing the value of Big x in normal or exponential notation.
 * Handles P.toExponential, P.toFixed, P.toJSON, P.toPrecision, P.toString and P.valueOf.
 */
function stringify(x, doExponential, isNonzero) {
  var e = x.e,
    s = x.c.join(''),
    n = s.length;

  // Exponential notation?
  if (doExponential) {
    s = s.charAt(0) + (n > 1 ? '.' + s.slice(1) : '') + (e < 0 ? 'e' : 'e+') + e;

    // Normal notation.
  } else if (e < 0) {
    for (; ++e;) s = '0' + s;
    s = '0.' + s;
  } else if (e > 0) {
    if (++e > n) {
      for (e -= n; e--;) s += '0';
    } else if (e < n) {
      s = s.slice(0, e) + '.' + s.slice(e);
    }
  } else if (n > 1) {
    s = s.charAt(0) + '.' + s.slice(1);
  }
  return x.s < 0 && isNonzero ? '-' + s : s;
}

// Prototype/instance methods

/*
 * Return a new Big whose value is the absolute value of this Big.
 */
P.abs = function () {
  var x = new this.constructor(this);
  x.s = 1;
  return x;
};

/*
 * Return 1 if the value of this Big is greater than the value of Big y,
 *       -1 if the value of this Big is less than the value of Big y, or
 *        0 if they have the same value.
 */
P.cmp = function (y) {
  var isneg,
    x = this,
    xc = x.c,
    yc = (y = new x.constructor(y)).c,
    i = x.s,
    j = y.s,
    k = x.e,
    l = y.e;

  // Either zero?
  if (!xc[0] || !yc[0]) return !xc[0] ? !yc[0] ? 0 : -j : i;

  // Signs differ?
  if (i != j) return i;
  isneg = i < 0;

  // Compare exponents.
  if (k != l) return k > l ^ isneg ? 1 : -1;
  j = (k = xc.length) < (l = yc.length) ? k : l;

  // Compare digit by digit.
  for (i = -1; ++i < j;) {
    if (xc[i] != yc[i]) return xc[i] > yc[i] ^ isneg ? 1 : -1;
  }

  // Compare lengths.
  return k == l ? 0 : k > l ^ isneg ? 1 : -1;
};

/*
 * Return a new Big whose value is the value of this Big divided by the value of Big y, rounded,
 * if necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
 */
P.div = function (y) {
  var x = this,
    Big = x.constructor,
    a = x.c,
    // dividend
    b = (y = new Big(y)).c,
    // divisor
    k = x.s == y.s ? 1 : -1,
    dp = Big.DP;
  if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
    throw Error(INVALID_DP);
  }

  // Divisor is zero?
  if (!b[0]) {
    throw Error(DIV_BY_ZERO);
  }

  // Dividend is 0? Return +-0.
  if (!a[0]) {
    y.s = k;
    y.c = [y.e = 0];
    return y;
  }
  var bl,
    bt,
    n,
    cmp,
    ri,
    bz = b.slice(),
    ai = bl = b.length,
    al = a.length,
    r = a.slice(0, bl),
    // remainder
    rl = r.length,
    q = y,
    // quotient
    qc = q.c = [],
    qi = 0,
    p = dp + (q.e = x.e - y.e) + 1; // precision of the result

  q.s = k;
  k = p < 0 ? 0 : p;

  // Create version of divisor with leading zero.
  bz.unshift(0);

  // Add zeros to make remainder as long as divisor.
  for (; rl++ < bl;) r.push(0);
  do {
    // n is how many times the divisor goes into current remainder.
    for (n = 0; n < 10; n++) {
      // Compare divisor and remainder.
      if (bl != (rl = r.length)) {
        cmp = bl > rl ? 1 : -1;
      } else {
        for (ri = -1, cmp = 0; ++ri < bl;) {
          if (b[ri] != r[ri]) {
            cmp = b[ri] > r[ri] ? 1 : -1;
            break;
          }
        }
      }

      // If divisor < remainder, subtract divisor from remainder.
      if (cmp < 0) {
        // Remainder can't be more than 1 digit longer than divisor.
        // Equalise lengths using divisor with extra leading zero?
        for (bt = rl == bl ? b : bz; rl;) {
          if (r[--rl] < bt[rl]) {
            ri = rl;
            for (; ri && !r[--ri];) r[ri] = 9;
            --r[ri];
            r[rl] += 10;
          }
          r[rl] -= bt[rl];
        }
        for (; !r[0];) r.shift();
      } else {
        break;
      }
    }

    // Add the digit n to the result array.
    qc[qi++] = cmp ? n : ++n;

    // Update the remainder.
    if (r[0] && cmp) r[rl] = a[ai] || 0;else r = [a[ai]];
  } while ((ai++ < al || r[0] !== UNDEFINED) && k--);

  // Leading zero? Do not remove if result is simply zero (qi == 1).
  if (!qc[0] && qi != 1) {
    // There can't be more than one zero.
    qc.shift();
    q.e--;
    p--;
  }

  // Round?
  if (qi > p) round(q, p, Big.RM, r[0] !== UNDEFINED);
  return q;
};

/*
 * Return true if the value of this Big is equal to the value of Big y, otherwise return false.
 */
P.eq = function (y) {
  return this.cmp(y) === 0;
};

/*
 * Return true if the value of this Big is greater than the value of Big y, otherwise return
 * false.
 */
P.gt = function (y) {
  return this.cmp(y) > 0;
};

/*
 * Return true if the value of this Big is greater than or equal to the value of Big y, otherwise
 * return false.
 */
P.gte = function (y) {
  return this.cmp(y) > -1;
};

/*
 * Return true if the value of this Big is less than the value of Big y, otherwise return false.
 */
P.lt = function (y) {
  return this.cmp(y) < 0;
};

/*
 * Return true if the value of this Big is less than or equal to the value of Big y, otherwise
 * return false.
 */
P.lte = function (y) {
  return this.cmp(y) < 1;
};

/*
 * Return a new Big whose value is the value of this Big minus the value of Big y.
 */
P.minus = P.sub = function (y) {
  var i,
    j,
    t,
    xlty,
    x = this,
    Big = x.constructor,
    a = x.s,
    b = (y = new Big(y)).s;

  // Signs differ?
  if (a != b) {
    y.s = -b;
    return x.plus(y);
  }
  var xc = x.c.slice(),
    xe = x.e,
    yc = y.c,
    ye = y.e;

  // Either zero?
  if (!xc[0] || !yc[0]) {
    if (yc[0]) {
      y.s = -b;
    } else if (xc[0]) {
      y = new Big(x);
    } else {
      y.s = 1;
    }
    return y;
  }

  // Determine which is the bigger number. Prepend zeros to equalise exponents.
  if (a = xe - ye) {
    if (xlty = a < 0) {
      a = -a;
      t = xc;
    } else {
      ye = xe;
      t = yc;
    }
    t.reverse();
    for (b = a; b--;) t.push(0);
    t.reverse();
  } else {
    // Exponents equal. Check digit by digit.
    j = ((xlty = xc.length < yc.length) ? xc : yc).length;
    for (a = b = 0; b < j; b++) {
      if (xc[b] != yc[b]) {
        xlty = xc[b] < yc[b];
        break;
      }
    }
  }

  // x < y? Point xc to the array of the bigger number.
  if (xlty) {
    t = xc;
    xc = yc;
    yc = t;
    y.s = -y.s;
  }

  /*
   * Append zeros to xc if shorter. No need to add zeros to yc if shorter as subtraction only
   * needs to start at yc.length.
   */
  if ((b = (j = yc.length) - (i = xc.length)) > 0) for (; b--;) xc[i++] = 0;

  // Subtract yc from xc.
  for (b = i; j > a;) {
    if (xc[--j] < yc[j]) {
      for (i = j; i && !xc[--i];) xc[i] = 9;
      --xc[i];
      xc[j] += 10;
    }
    xc[j] -= yc[j];
  }

  // Remove trailing zeros.
  for (; xc[--b] === 0;) xc.pop();

  // Remove leading zeros and adjust exponent accordingly.
  for (; xc[0] === 0;) {
    xc.shift();
    --ye;
  }
  if (!xc[0]) {
    // n - n = +0
    y.s = 1;

    // Result must be zero.
    xc = [ye = 0];
  }
  y.c = xc;
  y.e = ye;
  return y;
};

/*
 * Return a new Big whose value is the value of this Big modulo the value of Big y.
 */
P.mod = function (y) {
  var ygtx,
    x = this,
    Big = x.constructor,
    a = x.s,
    b = (y = new Big(y)).s;
  if (!y.c[0]) {
    throw Error(DIV_BY_ZERO);
  }
  x.s = y.s = 1;
  ygtx = y.cmp(x) == 1;
  x.s = a;
  y.s = b;
  if (ygtx) return new Big(x);
  a = Big.DP;
  b = Big.RM;
  Big.DP = Big.RM = 0;
  x = x.div(y);
  Big.DP = a;
  Big.RM = b;
  return this.minus(x.times(y));
};

/*
 * Return a new Big whose value is the value of this Big negated.
 */
P.neg = function () {
  var x = new this.constructor(this);
  x.s = -x.s;
  return x;
};

/*
 * Return a new Big whose value is the value of this Big plus the value of Big y.
 */
P.plus = P.add = function (y) {
  var e,
    k,
    t,
    x = this,
    Big = x.constructor;
  y = new Big(y);

  // Signs differ?
  if (x.s != y.s) {
    y.s = -y.s;
    return x.minus(y);
  }
  var xe = x.e,
    xc = x.c,
    ye = y.e,
    yc = y.c;

  // Either zero?
  if (!xc[0] || !yc[0]) {
    if (!yc[0]) {
      if (xc[0]) {
        y = new Big(x);
      } else {
        y.s = x.s;
      }
    }
    return y;
  }
  xc = xc.slice();

  // Prepend zeros to equalise exponents.
  // Note: reverse faster than unshifts.
  if (e = xe - ye) {
    if (e > 0) {
      ye = xe;
      t = yc;
    } else {
      e = -e;
      t = xc;
    }
    t.reverse();
    for (; e--;) t.push(0);
    t.reverse();
  }

  // Point xc to the longer array.
  if (xc.length - yc.length < 0) {
    t = yc;
    yc = xc;
    xc = t;
  }
  e = yc.length;

  // Only start adding at yc.length - 1 as the further digits of xc can be left as they are.
  for (k = 0; e; xc[e] %= 10) k = (xc[--e] = xc[e] + yc[e] + k) / 10 | 0;

  // No need to check for zero, as +x + +y != 0 && -x + -y != 0

  if (k) {
    xc.unshift(k);
    ++ye;
  }

  // Remove trailing zeros.
  for (e = xc.length; xc[--e] === 0;) xc.pop();
  y.c = xc;
  y.e = ye;
  return y;
};

/*
 * Return a Big whose value is the value of this Big raised to the power n.
 * If n is negative, round to a maximum of Big.DP decimal places using rounding
 * mode Big.RM.
 *
 * n {number} Integer, -MAX_POWER to MAX_POWER inclusive.
 */
P.pow = function (n) {
  var x = this,
    one = new x.constructor('1'),
    y = one,
    isneg = n < 0;
  if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) {
    throw Error(INVALID + 'exponent');
  }
  if (isneg) n = -n;
  for (;;) {
    if (n & 1) y = y.times(x);
    n >>= 1;
    if (!n) break;
    x = x.times(x);
  }
  return isneg ? one.div(y) : y;
};

/*
 * Return a new Big whose value is the value of this Big rounded to a maximum precision of sd
 * significant digits using rounding mode rm, or Big.RM if rm is not specified.
 *
 * sd {number} Significant digits: integer, 1 to MAX_DP inclusive.
 * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
 */
P.prec = function (sd, rm) {
  if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
    throw Error(INVALID + 'precision');
  }
  return round(new this.constructor(this), sd, rm);
};

/*
 * Return a new Big whose value is the value of this Big rounded to a maximum of dp decimal places
 * using rounding mode rm, or Big.RM if rm is not specified.
 * If dp is negative, round to an integer which is a multiple of 10**-dp.
 * If dp is not specified, round to 0 decimal places.
 *
 * dp? {number} Integer, -MAX_DP to MAX_DP inclusive.
 * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
 */
P.round = function (dp, rm) {
  if (dp === UNDEFINED) dp = 0;else if (dp !== ~~dp || dp < -MAX_DP || dp > MAX_DP) {
    throw Error(INVALID_DP);
  }
  return round(new this.constructor(this), dp + this.e + 1, rm);
};

/*
 * Return a new Big whose value is the square root of the value of this Big, rounded, if
 * necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
 */
P.sqrt = function () {
  var r,
    c,
    t,
    x = this,
    Big = x.constructor,
    s = x.s,
    e = x.e,
    half = new Big('0.5');

  // Zero?
  if (!x.c[0]) return new Big(x);

  // Negative?
  if (s < 0) {
    throw Error(NAME + 'No square root');
  }

  // Estimate.
  s = Math.sqrt(+stringify(x, true, true));

  // Math.sqrt underflow/overflow?
  // Re-estimate: pass x coefficient to Math.sqrt as integer, then adjust the result exponent.
  if (s === 0 || s === 1 / 0) {
    c = x.c.join('');
    if (!(c.length + e & 1)) c += '0';
    s = Math.sqrt(c);
    e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
    r = new Big((s == 1 / 0 ? '5e' : (s = s.toExponential()).slice(0, s.indexOf('e') + 1)) + e);
  } else {
    r = new Big(s + '');
  }
  e = r.e + (Big.DP += 4);

  // Newton-Raphson iteration.
  do {
    t = r;
    r = half.times(t.plus(x.div(t)));
  } while (t.c.slice(0, e).join('') !== r.c.slice(0, e).join(''));
  return round(r, (Big.DP -= 4) + r.e + 1, Big.RM);
};

/*
 * Return a new Big whose value is the value of this Big times the value of Big y.
 */
P.times = P.mul = function (y) {
  var c,
    x = this,
    Big = x.constructor,
    xc = x.c,
    yc = (y = new Big(y)).c,
    a = xc.length,
    b = yc.length,
    i = x.e,
    j = y.e;

  // Determine sign of result.
  y.s = x.s == y.s ? 1 : -1;

  // Return signed 0 if either 0.
  if (!xc[0] || !yc[0]) {
    y.c = [y.e = 0];
    return y;
  }

  // Initialise exponent of result as x.e + y.e.
  y.e = i + j;

  // If array xc has fewer digits than yc, swap xc and yc, and lengths.
  if (a < b) {
    c = xc;
    xc = yc;
    yc = c;
    j = a;
    a = b;
    b = j;
  }

  // Initialise coefficient array of result with zeros.
  for (c = new Array(j = a + b); j--;) c[j] = 0;

  // Multiply.

  // i is initially xc.length.
  for (i = b; i--;) {
    b = 0;

    // a is yc.length.
    for (j = a + i; j > i;) {
      // Current sum of products at this digit position, plus carry.
      b = c[j] + yc[i] * xc[j - i - 1] + b;
      c[j--] = b % 10;

      // carry
      b = b / 10 | 0;
    }
    c[j] = b;
  }

  // Increment result exponent if there is a final carry, otherwise remove leading zero.
  if (b) ++y.e;else c.shift();

  // Remove trailing zeros.
  for (i = c.length; !c[--i];) c.pop();
  y.c = c;
  return y;
};

/*
 * Return a string representing the value of this Big in exponential notation rounded to dp fixed
 * decimal places using rounding mode rm, or Big.RM if rm is not specified.
 *
 * dp? {number} Decimal places: integer, 0 to MAX_DP inclusive.
 * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
 */
P.toExponential = function (dp, rm) {
  var x = this,
    n = x.c[0];
  if (dp !== UNDEFINED) {
    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }
    x = round(new x.constructor(x), ++dp, rm);
    for (; x.c.length < dp;) x.c.push(0);
  }
  return stringify(x, true, !!n);
};

/*
 * Return a string representing the value of this Big in normal notation rounded to dp fixed
 * decimal places using rounding mode rm, or Big.RM if rm is not specified.
 *
 * dp? {number} Decimal places: integer, 0 to MAX_DP inclusive.
 * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
 *
 * (-0).toFixed(0) is '0', but (-0.1).toFixed(0) is '-0'.
 * (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
 */
P.toFixed = function (dp, rm) {
  var x = this,
    n = x.c[0];
  if (dp !== UNDEFINED) {
    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }
    x = round(new x.constructor(x), dp + x.e + 1, rm);

    // x.e may have changed if the value is rounded up.
    for (dp = dp + x.e + 1; x.c.length < dp;) x.c.push(0);
  }
  return stringify(x, false, !!n);
};

/*
 * Return a string representing the value of this Big.
 * Return exponential notation if this Big has a positive exponent equal to or greater than
 * Big.PE, or a negative exponent equal to or less than Big.NE.
 * Omit the sign for negative zero.
 */
P[Symbol.for('nodejs.util.inspect.custom')] = P.toJSON = P.toString = function () {
  var x = this,
    Big = x.constructor;
  return stringify(x, x.e <= Big.NE || x.e >= Big.PE, !!x.c[0]);
};

/*
 * Return the value of this Big as a primitve number.
 */
P.toNumber = function () {
  var n = +stringify(this, true, true);
  if (this.constructor.strict === true && !this.eq(n.toString())) {
    throw Error(NAME + 'Imprecise conversion');
  }
  return n;
};

/*
 * Return a string representing the value of this Big rounded to sd significant digits using
 * rounding mode rm, or Big.RM if rm is not specified.
 * Use exponential notation if sd is less than the number of digits necessary to represent
 * the integer part of the value in normal notation.
 *
 * sd {number} Significant digits: integer, 1 to MAX_DP inclusive.
 * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
 */
P.toPrecision = function (sd, rm) {
  var x = this,
    Big = x.constructor,
    n = x.c[0];
  if (sd !== UNDEFINED) {
    if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
      throw Error(INVALID + 'precision');
    }
    x = round(new Big(x), sd, rm);
    for (; x.c.length < sd;) x.c.push(0);
  }
  return stringify(x, sd <= x.e || x.e <= Big.NE || x.e >= Big.PE, !!n);
};

/*
 * Return a string representing the value of this Big.
 * Return exponential notation if this Big has a positive exponent equal to or greater than
 * Big.PE, or a negative exponent equal to or less than Big.NE.
 * Include the sign for negative zero.
 */
P.valueOf = function () {
  var x = this,
    Big = x.constructor;
  if (Big.strict === true) {
    throw Error(NAME + 'valueOf disallowed');
  }
  return stringify(x, x.e <= Big.NE || x.e >= Big.PE, true);
};

var removeAccents = {exports: {}};

var hasRequiredRemoveAccents;

function requireRemoveAccents () {
	if (hasRequiredRemoveAccents) return removeAccents.exports;
	hasRequiredRemoveAccents = 1;
	var characterMap = {
	  "À": "A",
	  "Á": "A",
	  "Â": "A",
	  "Ã": "A",
	  "Ä": "A",
	  "Å": "A",
	  "Ấ": "A",
	  "Ắ": "A",
	  "Ẳ": "A",
	  "Ẵ": "A",
	  "Ặ": "A",
	  "Æ": "AE",
	  "Ầ": "A",
	  "Ằ": "A",
	  "Ȃ": "A",
	  "Ả": "A",
	  "Ạ": "A",
	  "Ẩ": "A",
	  "Ẫ": "A",
	  "Ậ": "A",
	  "Ç": "C",
	  "Ḉ": "C",
	  "È": "E",
	  "É": "E",
	  "Ê": "E",
	  "Ë": "E",
	  "Ế": "E",
	  "Ḗ": "E",
	  "Ề": "E",
	  "Ḕ": "E",
	  "Ḝ": "E",
	  "Ȇ": "E",
	  "Ẻ": "E",
	  "Ẽ": "E",
	  "Ẹ": "E",
	  "Ể": "E",
	  "Ễ": "E",
	  "Ệ": "E",
	  "Ì": "I",
	  "Í": "I",
	  "Î": "I",
	  "Ï": "I",
	  "Ḯ": "I",
	  "Ȋ": "I",
	  "Ỉ": "I",
	  "Ị": "I",
	  "Ð": "D",
	  "Ñ": "N",
	  "Ò": "O",
	  "Ó": "O",
	  "Ô": "O",
	  "Õ": "O",
	  "Ö": "O",
	  "Ø": "O",
	  "Ố": "O",
	  "Ṍ": "O",
	  "Ṓ": "O",
	  "Ȏ": "O",
	  "Ỏ": "O",
	  "Ọ": "O",
	  "Ổ": "O",
	  "Ỗ": "O",
	  "Ộ": "O",
	  "Ờ": "O",
	  "Ở": "O",
	  "Ỡ": "O",
	  "Ớ": "O",
	  "Ợ": "O",
	  "Ù": "U",
	  "Ú": "U",
	  "Û": "U",
	  "Ü": "U",
	  "Ủ": "U",
	  "Ụ": "U",
	  "Ử": "U",
	  "Ữ": "U",
	  "Ự": "U",
	  "Ý": "Y",
	  "à": "a",
	  "á": "a",
	  "â": "a",
	  "ã": "a",
	  "ä": "a",
	  "å": "a",
	  "ấ": "a",
	  "ắ": "a",
	  "ẳ": "a",
	  "ẵ": "a",
	  "ặ": "a",
	  "æ": "ae",
	  "ầ": "a",
	  "ằ": "a",
	  "ȃ": "a",
	  "ả": "a",
	  "ạ": "a",
	  "ẩ": "a",
	  "ẫ": "a",
	  "ậ": "a",
	  "ç": "c",
	  "ḉ": "c",
	  "è": "e",
	  "é": "e",
	  "ê": "e",
	  "ë": "e",
	  "ế": "e",
	  "ḗ": "e",
	  "ề": "e",
	  "ḕ": "e",
	  "ḝ": "e",
	  "ȇ": "e",
	  "ẻ": "e",
	  "ẽ": "e",
	  "ẹ": "e",
	  "ể": "e",
	  "ễ": "e",
	  "ệ": "e",
	  "ì": "i",
	  "í": "i",
	  "î": "i",
	  "ï": "i",
	  "ḯ": "i",
	  "ȋ": "i",
	  "ỉ": "i",
	  "ị": "i",
	  "ð": "d",
	  "ñ": "n",
	  "ò": "o",
	  "ó": "o",
	  "ô": "o",
	  "õ": "o",
	  "ö": "o",
	  "ø": "o",
	  "ố": "o",
	  "ṍ": "o",
	  "ṓ": "o",
	  "ȏ": "o",
	  "ỏ": "o",
	  "ọ": "o",
	  "ổ": "o",
	  "ỗ": "o",
	  "ộ": "o",
	  "ờ": "o",
	  "ở": "o",
	  "ỡ": "o",
	  "ớ": "o",
	  "ợ": "o",
	  "ù": "u",
	  "ú": "u",
	  "û": "u",
	  "ü": "u",
	  "ủ": "u",
	  "ụ": "u",
	  "ử": "u",
	  "ữ": "u",
	  "ự": "u",
	  "ý": "y",
	  "ÿ": "y",
	  "Ā": "A",
	  "ā": "a",
	  "Ă": "A",
	  "ă": "a",
	  "Ą": "A",
	  "ą": "a",
	  "Ć": "C",
	  "ć": "c",
	  "Ĉ": "C",
	  "ĉ": "c",
	  "Ċ": "C",
	  "ċ": "c",
	  "Č": "C",
	  "č": "c",
	  "C̆": "C",
	  "c̆": "c",
	  "Ď": "D",
	  "ď": "d",
	  "Đ": "D",
	  "đ": "d",
	  "Ē": "E",
	  "ē": "e",
	  "Ĕ": "E",
	  "ĕ": "e",
	  "Ė": "E",
	  "ė": "e",
	  "Ę": "E",
	  "ę": "e",
	  "Ě": "E",
	  "ě": "e",
	  "Ĝ": "G",
	  "Ǵ": "G",
	  "ĝ": "g",
	  "ǵ": "g",
	  "Ğ": "G",
	  "ğ": "g",
	  "Ġ": "G",
	  "ġ": "g",
	  "Ģ": "G",
	  "ģ": "g",
	  "Ĥ": "H",
	  "ĥ": "h",
	  "Ħ": "H",
	  "ħ": "h",
	  "Ḫ": "H",
	  "ḫ": "h",
	  "Ĩ": "I",
	  "ĩ": "i",
	  "Ī": "I",
	  "ī": "i",
	  "Ĭ": "I",
	  "ĭ": "i",
	  "Į": "I",
	  "į": "i",
	  "İ": "I",
	  "ı": "i",
	  "Ĳ": "IJ",
	  "ĳ": "ij",
	  "Ĵ": "J",
	  "ĵ": "j",
	  "Ķ": "K",
	  "ķ": "k",
	  "Ḱ": "K",
	  "ḱ": "k",
	  "K̆": "K",
	  "k̆": "k",
	  "Ĺ": "L",
	  "ĺ": "l",
	  "Ļ": "L",
	  "ļ": "l",
	  "Ľ": "L",
	  "ľ": "l",
	  "Ŀ": "L",
	  "ŀ": "l",
	  "Ł": "l",
	  "ł": "l",
	  "Ḿ": "M",
	  "ḿ": "m",
	  "M̆": "M",
	  "m̆": "m",
	  "Ń": "N",
	  "ń": "n",
	  "Ņ": "N",
	  "ņ": "n",
	  "Ň": "N",
	  "ň": "n",
	  "ŉ": "n",
	  "N̆": "N",
	  "n̆": "n",
	  "Ō": "O",
	  "ō": "o",
	  "Ŏ": "O",
	  "ŏ": "o",
	  "Ő": "O",
	  "ő": "o",
	  "Œ": "OE",
	  "œ": "oe",
	  "P̆": "P",
	  "p̆": "p",
	  "Ŕ": "R",
	  "ŕ": "r",
	  "Ŗ": "R",
	  "ŗ": "r",
	  "Ř": "R",
	  "ř": "r",
	  "R̆": "R",
	  "r̆": "r",
	  "Ȓ": "R",
	  "ȓ": "r",
	  "Ś": "S",
	  "ś": "s",
	  "Ŝ": "S",
	  "ŝ": "s",
	  "Ş": "S",
	  "Ș": "S",
	  "ș": "s",
	  "ş": "s",
	  "Š": "S",
	  "š": "s",
	  "Ţ": "T",
	  "ţ": "t",
	  "ț": "t",
	  "Ț": "T",
	  "Ť": "T",
	  "ť": "t",
	  "Ŧ": "T",
	  "ŧ": "t",
	  "T̆": "T",
	  "t̆": "t",
	  "Ũ": "U",
	  "ũ": "u",
	  "Ū": "U",
	  "ū": "u",
	  "Ŭ": "U",
	  "ŭ": "u",
	  "Ů": "U",
	  "ů": "u",
	  "Ű": "U",
	  "ű": "u",
	  "Ų": "U",
	  "ų": "u",
	  "Ȗ": "U",
	  "ȗ": "u",
	  "V̆": "V",
	  "v̆": "v",
	  "Ŵ": "W",
	  "ŵ": "w",
	  "Ẃ": "W",
	  "ẃ": "w",
	  "X̆": "X",
	  "x̆": "x",
	  "Ŷ": "Y",
	  "ŷ": "y",
	  "Ÿ": "Y",
	  "Y̆": "Y",
	  "y̆": "y",
	  "Ź": "Z",
	  "ź": "z",
	  "Ż": "Z",
	  "ż": "z",
	  "Ž": "Z",
	  "ž": "z",
	  "ſ": "s",
	  "ƒ": "f",
	  "Ơ": "O",
	  "ơ": "o",
	  "Ư": "U",
	  "ư": "u",
	  "Ǎ": "A",
	  "ǎ": "a",
	  "Ǐ": "I",
	  "ǐ": "i",
	  "Ǒ": "O",
	  "ǒ": "o",
	  "Ǔ": "U",
	  "ǔ": "u",
	  "Ǖ": "U",
	  "ǖ": "u",
	  "Ǘ": "U",
	  "ǘ": "u",
	  "Ǚ": "U",
	  "ǚ": "u",
	  "Ǜ": "U",
	  "ǜ": "u",
	  "Ứ": "U",
	  "ứ": "u",
	  "Ṹ": "U",
	  "ṹ": "u",
	  "Ǻ": "A",
	  "ǻ": "a",
	  "Ǽ": "AE",
	  "ǽ": "ae",
	  "Ǿ": "O",
	  "ǿ": "o",
	  "Þ": "TH",
	  "þ": "th",
	  "Ṕ": "P",
	  "ṕ": "p",
	  "Ṥ": "S",
	  "ṥ": "s",
	  "X́": "X",
	  "x́": "x",
	  "Ѓ": "Г",
	  "ѓ": "г",
	  "Ќ": "К",
	  "ќ": "к",
	  "A̋": "A",
	  "a̋": "a",
	  "E̋": "E",
	  "e̋": "e",
	  "I̋": "I",
	  "i̋": "i",
	  "Ǹ": "N",
	  "ǹ": "n",
	  "Ồ": "O",
	  "ồ": "o",
	  "Ṑ": "O",
	  "ṑ": "o",
	  "Ừ": "U",
	  "ừ": "u",
	  "Ẁ": "W",
	  "ẁ": "w",
	  "Ỳ": "Y",
	  "ỳ": "y",
	  "Ȁ": "A",
	  "ȁ": "a",
	  "Ȅ": "E",
	  "ȅ": "e",
	  "Ȉ": "I",
	  "ȉ": "i",
	  "Ȍ": "O",
	  "ȍ": "o",
	  "Ȑ": "R",
	  "ȑ": "r",
	  "Ȕ": "U",
	  "ȕ": "u",
	  "B̌": "B",
	  "b̌": "b",
	  "Č̣": "C",
	  "č̣": "c",
	  "Ê̌": "E",
	  "ê̌": "e",
	  "F̌": "F",
	  "f̌": "f",
	  "Ǧ": "G",
	  "ǧ": "g",
	  "Ȟ": "H",
	  "ȟ": "h",
	  "J̌": "J",
	  "ǰ": "j",
	  "Ǩ": "K",
	  "ǩ": "k",
	  "M̌": "M",
	  "m̌": "m",
	  "P̌": "P",
	  "p̌": "p",
	  "Q̌": "Q",
	  "q̌": "q",
	  "Ř̩": "R",
	  "ř̩": "r",
	  "Ṧ": "S",
	  "ṧ": "s",
	  "V̌": "V",
	  "v̌": "v",
	  "W̌": "W",
	  "w̌": "w",
	  "X̌": "X",
	  "x̌": "x",
	  "Y̌": "Y",
	  "y̌": "y",
	  "A̧": "A",
	  "a̧": "a",
	  "B̧": "B",
	  "b̧": "b",
	  "Ḑ": "D",
	  "ḑ": "d",
	  "Ȩ": "E",
	  "ȩ": "e",
	  "Ɛ̧": "E",
	  "ɛ̧": "e",
	  "Ḩ": "H",
	  "ḩ": "h",
	  "I̧": "I",
	  "i̧": "i",
	  "Ɨ̧": "I",
	  "ɨ̧": "i",
	  "M̧": "M",
	  "m̧": "m",
	  "O̧": "O",
	  "o̧": "o",
	  "Q̧": "Q",
	  "q̧": "q",
	  "U̧": "U",
	  "u̧": "u",
	  "X̧": "X",
	  "x̧": "x",
	  "Z̧": "Z",
	  "z̧": "z",
	  "й": "и",
	  "Й": "И",
	  "ё": "е",
	  "Ё": "Е"
	};
	var chars = Object.keys(characterMap).join('|');
	var allAccents = new RegExp(chars, 'g');
	var firstAccent = new RegExp(chars, '');
	function matcher(match) {
	  return characterMap[match];
	}
	var removeAccents$1 = function (string) {
	  return string.replace(allAccents, matcher);
	};
	var hasAccents = function (string) {
	  return !!string.match(firstAccent);
	};
	removeAccents.exports = removeAccents$1;
	removeAccents.exports.has = hasAccents;
	removeAccents.exports.remove = removeAccents$1;
	return removeAccents.exports;
}

requireRemoveAccents();

const DEFAULT_LIMIT_SIZE = 100;
function CaptionContent(props) {
    const { htmlFor, children, onClick } = props;
    return react.createElement(htmlFor == null ? "span" : "label", {
        children,
        className: "widget-combobox-caption-text",
        htmlFor,
        onClick: onClick
            ? onClick
            : htmlFor
                ? (e) => {
                    e.preventDefault();
                }
                : undefined
    });
}
function getDatasourcePlaceholderText(args) {
    const { optionsSourceType, optionsSourceAssociationDataSource, attributeEnumeration, attributeBoolean, databaseAttributeString, emptyOptionText, source, optionsSourceDatabaseDataSource, staticAttribute, optionsSourceStaticDataSource } = args;
    const emptyStringFormat = emptyOptionText ? `[${emptyOptionText}]` : "Combo box";
    if (source === "context") {
        switch (optionsSourceType) {
            case "association":
                return optionsSourceAssociationDataSource?.caption || emptyStringFormat;
            case "enumeration":
                return `[${optionsSourceType}, ${attributeEnumeration}]`;
            case "boolean":
                return `[${optionsSourceType}, ${attributeBoolean}]`;
            default:
                return emptyStringFormat;
        }
    }
    else if (source === "database" && optionsSourceDatabaseDataSource) {
        return (optionsSourceDatabaseDataSource?.caption ||
            `${source}, ${databaseAttributeString}`);
    }
    else if (source === "static") {
        return optionsSourceStaticDataSource?.caption || `[${source}, ${staticAttribute}]`;
    }
    return emptyStringFormat;
}
function getInputLabel(inputId) {
    return document.querySelector(`label[for="${CSS.escape(inputId)}"]`);
}
function getValidationErrorId(inputId) {
    return inputId ? inputId + "-validation-message" : undefined;
}

function ClearButton({ size = 14 }) {
    return (jsxRuntime.jsx("span", { className: "widget-combobox-icon-container", children: jsxRuntime.jsx("svg", { width: size, height: size, viewBox: "0 0 32 32", className: "widget-combobox-clear-button-icon", children: jsxRuntime.jsx("path", { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", fill: "currentColor", d: "M27.71 5.71004L26.29 4.29004L16 14.59L5.71004 4.29004L4.29004 5.71004L14.59 16L4.29004 26.29L5.71004 27.71L16 17.41L26.29 27.71L27.71 26.29L17.41 16L27.71 5.71004Z" }) }) }));
}
function DownArrow({ isOpen }) {
    return (jsxRuntime.jsx("span", { className: "widget-combobox-icon-container", children: jsxRuntime.jsx("svg", { className: classNames("widget-combobox-down-arrow-icon", "mx-icon-lined", "mx-icon-chevron-down", {
                active: isOpen
            }), width: "16", height: "16", viewBox: "0 0 32 32", children: jsxRuntime.jsx("path", { d: "M16 23.41L4.29004 11.71L5.71004 10.29L16 20.59L26.29 10.29L27.71 11.71L16 23.41Z" }) }) }));
}

function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}

function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}

function _inheritsLoose(t, o) {
  t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o);
}

var propTypes = {exports: {}};

var reactIs$1 = {exports: {}};

var reactIs_development$1 = {};

/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactIs_development$1;

function requireReactIs_development$1 () {
	if (hasRequiredReactIs_development$1) return reactIs_development$1;
	hasRequiredReactIs_development$1 = 1;

	{
	  (function () {

	    // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
	    // nor polyfill, then a plain number is used for performance.
	    var hasSymbol = typeof Symbol === 'function' && Symbol.for;
	    var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
	    var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
	    var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
	    var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
	    var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
	    var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
	    var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
	    // (unstable) APIs that have been removed. Can we remove the symbols?

	    var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
	    var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
	    var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
	    var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
	    var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
	    var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
	    var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
	    var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
	    var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
	    var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
	    var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;
	    function isValidElementType(type) {
	      return typeof type === 'string' || typeof type === 'function' ||
	      // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
	      type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
	    }
	    function typeOf(object) {
	      if (typeof object === 'object' && object !== null) {
	        var $$typeof = object.$$typeof;
	        switch ($$typeof) {
	          case REACT_ELEMENT_TYPE:
	            var type = object.type;
	            switch (type) {
	              case REACT_ASYNC_MODE_TYPE:
	              case REACT_CONCURRENT_MODE_TYPE:
	              case REACT_FRAGMENT_TYPE:
	              case REACT_PROFILER_TYPE:
	              case REACT_STRICT_MODE_TYPE:
	              case REACT_SUSPENSE_TYPE:
	                return type;
	              default:
	                var $$typeofType = type && type.$$typeof;
	                switch ($$typeofType) {
	                  case REACT_CONTEXT_TYPE:
	                  case REACT_FORWARD_REF_TYPE:
	                  case REACT_LAZY_TYPE:
	                  case REACT_MEMO_TYPE:
	                  case REACT_PROVIDER_TYPE:
	                    return $$typeofType;
	                  default:
	                    return $$typeof;
	                }
	            }
	          case REACT_PORTAL_TYPE:
	            return $$typeof;
	        }
	      }
	      return undefined;
	    } // AsyncMode is deprecated along with isAsyncMode

	    var AsyncMode = REACT_ASYNC_MODE_TYPE;
	    var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
	    var ContextConsumer = REACT_CONTEXT_TYPE;
	    var ContextProvider = REACT_PROVIDER_TYPE;
	    var Element = REACT_ELEMENT_TYPE;
	    var ForwardRef = REACT_FORWARD_REF_TYPE;
	    var Fragment = REACT_FRAGMENT_TYPE;
	    var Lazy = REACT_LAZY_TYPE;
	    var Memo = REACT_MEMO_TYPE;
	    var Portal = REACT_PORTAL_TYPE;
	    var Profiler = REACT_PROFILER_TYPE;
	    var StrictMode = REACT_STRICT_MODE_TYPE;
	    var Suspense = REACT_SUSPENSE_TYPE;
	    var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

	    function isAsyncMode(object) {
	      {
	        if (!hasWarnedAboutDeprecatedIsAsyncMode) {
	          hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

	          console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
	        }
	      }
	      return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
	    }
	    function isConcurrentMode(object) {
	      return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
	    }
	    function isContextConsumer(object) {
	      return typeOf(object) === REACT_CONTEXT_TYPE;
	    }
	    function isContextProvider(object) {
	      return typeOf(object) === REACT_PROVIDER_TYPE;
	    }
	    function isElement(object) {
	      return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
	    }
	    function isForwardRef(object) {
	      return typeOf(object) === REACT_FORWARD_REF_TYPE;
	    }
	    function isFragment(object) {
	      return typeOf(object) === REACT_FRAGMENT_TYPE;
	    }
	    function isLazy(object) {
	      return typeOf(object) === REACT_LAZY_TYPE;
	    }
	    function isMemo(object) {
	      return typeOf(object) === REACT_MEMO_TYPE;
	    }
	    function isPortal(object) {
	      return typeOf(object) === REACT_PORTAL_TYPE;
	    }
	    function isProfiler(object) {
	      return typeOf(object) === REACT_PROFILER_TYPE;
	    }
	    function isStrictMode(object) {
	      return typeOf(object) === REACT_STRICT_MODE_TYPE;
	    }
	    function isSuspense(object) {
	      return typeOf(object) === REACT_SUSPENSE_TYPE;
	    }
	    reactIs_development$1.AsyncMode = AsyncMode;
	    reactIs_development$1.ConcurrentMode = ConcurrentMode;
	    reactIs_development$1.ContextConsumer = ContextConsumer;
	    reactIs_development$1.ContextProvider = ContextProvider;
	    reactIs_development$1.Element = Element;
	    reactIs_development$1.ForwardRef = ForwardRef;
	    reactIs_development$1.Fragment = Fragment;
	    reactIs_development$1.Lazy = Lazy;
	    reactIs_development$1.Memo = Memo;
	    reactIs_development$1.Portal = Portal;
	    reactIs_development$1.Profiler = Profiler;
	    reactIs_development$1.StrictMode = StrictMode;
	    reactIs_development$1.Suspense = Suspense;
	    reactIs_development$1.isAsyncMode = isAsyncMode;
	    reactIs_development$1.isConcurrentMode = isConcurrentMode;
	    reactIs_development$1.isContextConsumer = isContextConsumer;
	    reactIs_development$1.isContextProvider = isContextProvider;
	    reactIs_development$1.isElement = isElement;
	    reactIs_development$1.isForwardRef = isForwardRef;
	    reactIs_development$1.isFragment = isFragment;
	    reactIs_development$1.isLazy = isLazy;
	    reactIs_development$1.isMemo = isMemo;
	    reactIs_development$1.isPortal = isPortal;
	    reactIs_development$1.isProfiler = isProfiler;
	    reactIs_development$1.isStrictMode = isStrictMode;
	    reactIs_development$1.isSuspense = isSuspense;
	    reactIs_development$1.isValidElementType = isValidElementType;
	    reactIs_development$1.typeOf = typeOf;
	  })();
	}
	return reactIs_development$1;
}

var hasRequiredReactIs$1;

function requireReactIs$1 () {
	if (hasRequiredReactIs$1) return reactIs$1.exports;
	hasRequiredReactIs$1 = 1;

	{
	  reactIs$1.exports = requireReactIs_development$1();
	}
	return reactIs$1.exports;
}

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

var objectAssign;
var hasRequiredObjectAssign;

function requireObjectAssign () {
	if (hasRequiredObjectAssign) return objectAssign;
	hasRequiredObjectAssign = 1;

	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;
	function toObject(val) {
	  if (val === null || val === undefined) {
	    throw new TypeError('Object.assign cannot be called with null or undefined');
	  }
	  return Object(val);
	}
	function shouldUseNative() {
	  try {
	    if (!Object.assign) {
	      return false;
	    }

	    // Detect buggy property enumeration order in older V8 versions.

	    // https://bugs.chromium.org/p/v8/issues/detail?id=4118
	    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
	    test1[5] = 'de';
	    if (Object.getOwnPropertyNames(test1)[0] === '5') {
	      return false;
	    }

	    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
	    var test2 = {};
	    for (var i = 0; i < 10; i++) {
	      test2['_' + String.fromCharCode(i)] = i;
	    }
	    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
	      return test2[n];
	    });
	    if (order2.join('') !== '0123456789') {
	      return false;
	    }

	    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
	    var test3 = {};
	    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
	      test3[letter] = letter;
	    });
	    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
	      return false;
	    }
	    return true;
	  } catch (err) {
	    // We don't expect any of the above to throw, but better to be safe.
	    return false;
	  }
	}
	objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	  var from;
	  var to = toObject(target);
	  var symbols;
	  for (var s = 1; s < arguments.length; s++) {
	    from = Object(arguments[s]);
	    for (var key in from) {
	      if (hasOwnProperty.call(from, key)) {
	        to[key] = from[key];
	      }
	    }
	    if (getOwnPropertySymbols) {
	      symbols = getOwnPropertySymbols(from);
	      for (var i = 0; i < symbols.length; i++) {
	        if (propIsEnumerable.call(from, symbols[i])) {
	          to[symbols[i]] = from[symbols[i]];
	        }
	      }
	    }
	  }
	  return to;
	};
	return objectAssign;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret_1;
var hasRequiredReactPropTypesSecret;

function requireReactPropTypesSecret () {
	if (hasRequiredReactPropTypesSecret) return ReactPropTypesSecret_1;
	hasRequiredReactPropTypesSecret = 1;

	var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
	ReactPropTypesSecret_1 = ReactPropTypesSecret;
	return ReactPropTypesSecret_1;
}

var has;
var hasRequiredHas;

function requireHas () {
	if (hasRequiredHas) return has;
	hasRequiredHas = 1;
	has = Function.call.bind(Object.prototype.hasOwnProperty);
	return has;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var checkPropTypes_1;
var hasRequiredCheckPropTypes;

function requireCheckPropTypes () {
	if (hasRequiredCheckPropTypes) return checkPropTypes_1;
	hasRequiredCheckPropTypes = 1;

	var printWarning = function () {};
	{
	  var ReactPropTypesSecret = /*@__PURE__*/ requireReactPropTypesSecret();
	  var loggedTypeFailures = {};
	  var has = /*@__PURE__*/ requireHas();
	  printWarning = function (text) {
	    var message = 'Warning: ' + text;
	    if (typeof console !== 'undefined') {
	      console.error(message);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) {/**/}
	  };
	}

	/**
	 * Assert that the values match with the type specs.
	 * Error messages are memorized and will only be shown once.
	 *
	 * @param {object} typeSpecs Map of name to a ReactPropType
	 * @param {object} values Runtime values that need to be type-checked
	 * @param {string} location e.g. "prop", "context", "child context"
	 * @param {string} componentName Name of the component for error messages.
	 * @param {?Function} getStack Returns the component stack.
	 * @private
	 */
	function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
	  {
	    for (var typeSpecName in typeSpecs) {
	      if (has(typeSpecs, typeSpecName)) {
	        var error;
	        // Prop type validation may throw. In case they do, we don't want to
	        // fail the render phase where it didn't fail before. So we log it.
	        // After these have been cleaned up, we'll let them throw.
	        try {
	          // This is intentionally an invariant that gets caught. It's the same
	          // behavior as without this statement except with a better message.
	          if (typeof typeSpecs[typeSpecName] !== 'function') {
	            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
	            err.name = 'Invariant Violation';
	            throw err;
	          }
	          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
	        } catch (ex) {
	          error = ex;
	        }
	        if (error && !(error instanceof Error)) {
	          printWarning((componentName || 'React class') + ': type specification of ' + location + ' `' + typeSpecName + '` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a ' + typeof error + '. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).');
	        }
	        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
	          // Only monitor this failure once because there tends to be a lot of the
	          // same error.
	          loggedTypeFailures[error.message] = true;
	          var stack = getStack ? getStack() : '';
	          printWarning('Failed ' + location + ' type: ' + error.message + (stack != null ? stack : ''));
	        }
	      }
	    }
	  }
	}

	/**
	 * Resets warning cache when testing.
	 *
	 * @private
	 */
	checkPropTypes.resetWarningCache = function () {
	  {
	    loggedTypeFailures = {};
	  }
	};
	checkPropTypes_1 = checkPropTypes;
	return checkPropTypes_1;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var factoryWithTypeCheckers;
var hasRequiredFactoryWithTypeCheckers;

function requireFactoryWithTypeCheckers () {
	if (hasRequiredFactoryWithTypeCheckers) return factoryWithTypeCheckers;
	hasRequiredFactoryWithTypeCheckers = 1;

	var ReactIs = requireReactIs$1();
	var assign = requireObjectAssign();
	var ReactPropTypesSecret = /*@__PURE__*/ requireReactPropTypesSecret();
	var has = /*@__PURE__*/ requireHas();
	var checkPropTypes = /*@__PURE__*/ requireCheckPropTypes();
	var printWarning = function () {};
	{
	  printWarning = function (text) {
	    var message = 'Warning: ' + text;
	    if (typeof console !== 'undefined') {
	      console.error(message);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) {}
	  };
	}
	function emptyFunctionThatReturnsNull() {
	  return null;
	}
	factoryWithTypeCheckers = function (isValidElement, throwOnDirectAccess) {
	  /* global Symbol */
	  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

	  /**
	   * Returns the iterator method function contained on the iterable object.
	   *
	   * Be sure to invoke the function with the iterable as context:
	   *
	   *     var iteratorFn = getIteratorFn(myIterable);
	   *     if (iteratorFn) {
	   *       var iterator = iteratorFn.call(myIterable);
	   *       ...
	   *     }
	   *
	   * @param {?object} maybeIterable
	   * @return {?function}
	   */
	  function getIteratorFn(maybeIterable) {
	    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
	    if (typeof iteratorFn === 'function') {
	      return iteratorFn;
	    }
	  }

	  /**
	   * Collection of methods that allow declaration and validation of props that are
	   * supplied to React components. Example usage:
	   *
	   *   var Props = require('ReactPropTypes');
	   *   var MyArticle = React.createClass({
	   *     propTypes: {
	   *       // An optional string prop named "description".
	   *       description: Props.string,
	   *
	   *       // A required enum prop named "category".
	   *       category: Props.oneOf(['News','Photos']).isRequired,
	   *
	   *       // A prop named "dialog" that requires an instance of Dialog.
	   *       dialog: Props.instanceOf(Dialog).isRequired
	   *     },
	   *     render: function() { ... }
	   *   });
	   *
	   * A more formal specification of how these methods are used:
	   *
	   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
	   *   decl := ReactPropTypes.{type}(.isRequired)?
	   *
	   * Each and every declaration produces a function with the same signature. This
	   * allows the creation of custom validation functions. For example:
	   *
	   *  var MyLink = React.createClass({
	   *    propTypes: {
	   *      // An optional string or URI prop named "href".
	   *      href: function(props, propName, componentName) {
	   *        var propValue = props[propName];
	   *        if (propValue != null && typeof propValue !== 'string' &&
	   *            !(propValue instanceof URI)) {
	   *          return new Error(
	   *            'Expected a string or an URI for ' + propName + ' in ' +
	   *            componentName
	   *          );
	   *        }
	   *      }
	   *    },
	   *    render: function() {...}
	   *  });
	   *
	   * @internal
	   */

	  var ANONYMOUS = '<<anonymous>>';

	  // Important!
	  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
	  var ReactPropTypes = {
	    array: createPrimitiveTypeChecker('array'),
	    bigint: createPrimitiveTypeChecker('bigint'),
	    bool: createPrimitiveTypeChecker('boolean'),
	    func: createPrimitiveTypeChecker('function'),
	    number: createPrimitiveTypeChecker('number'),
	    object: createPrimitiveTypeChecker('object'),
	    string: createPrimitiveTypeChecker('string'),
	    symbol: createPrimitiveTypeChecker('symbol'),
	    any: createAnyTypeChecker(),
	    arrayOf: createArrayOfTypeChecker,
	    element: createElementTypeChecker(),
	    elementType: createElementTypeTypeChecker(),
	    instanceOf: createInstanceTypeChecker,
	    node: createNodeChecker(),
	    objectOf: createObjectOfTypeChecker,
	    oneOf: createEnumTypeChecker,
	    oneOfType: createUnionTypeChecker,
	    shape: createShapeTypeChecker,
	    exact: createStrictShapeTypeChecker
	  };

	  /**
	   * inlined Object.is polyfill to avoid requiring consumers ship their own
	   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
	   */
	  /*eslint-disable no-self-compare*/
	  function is(x, y) {
	    // SameValue algorithm
	    if (x === y) {
	      // Steps 1-5, 7-10
	      // Steps 6.b-6.e: +0 != -0
	      return x !== 0 || 1 / x === 1 / y;
	    } else {
	      // Step 6.a: NaN == NaN
	      return x !== x && y !== y;
	    }
	  }
	  /*eslint-enable no-self-compare*/

	  /**
	   * We use an Error-like object for backward compatibility as people may call
	   * PropTypes directly and inspect their output. However, we don't use real
	   * Errors anymore. We don't inspect their stack anyway, and creating them
	   * is prohibitively expensive if they are created too often, such as what
	   * happens in oneOfType() for any type before the one that matched.
	   */
	  function PropTypeError(message, data) {
	    this.message = message;
	    this.data = data && typeof data === 'object' ? data : {};
	    this.stack = '';
	  }
	  // Make `instanceof Error` still work for returned errors.
	  PropTypeError.prototype = Error.prototype;
	  function createChainableTypeChecker(validate) {
	    {
	      var manualPropTypeCallCache = {};
	      var manualPropTypeWarningCount = 0;
	    }
	    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
	      componentName = componentName || ANONYMOUS;
	      propFullName = propFullName || propName;
	      if (secret !== ReactPropTypesSecret) {
	        if (throwOnDirectAccess) {
	          // New behavior only for users of `prop-types` package
	          var err = new Error('Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use `PropTypes.checkPropTypes()` to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
	          err.name = 'Invariant Violation';
	          throw err;
	        } else if (typeof console !== 'undefined') {
	          // Old behavior for people using React.PropTypes
	          var cacheKey = componentName + ':' + propName;
	          if (!manualPropTypeCallCache[cacheKey] &&
	          // Avoid spamming the console because they are often not actionable except for lib authors
	          manualPropTypeWarningCount < 3) {
	            printWarning('You are manually calling a React.PropTypes validation ' + 'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' + 'and will throw in the standalone `prop-types` package. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.');
	            manualPropTypeCallCache[cacheKey] = true;
	            manualPropTypeWarningCount++;
	          }
	        }
	      }
	      if (props[propName] == null) {
	        if (isRequired) {
	          if (props[propName] === null) {
	            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
	          }
	          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
	        }
	        return null;
	      } else {
	        return validate(props, propName, componentName, location, propFullName);
	      }
	    }
	    var chainedCheckType = checkType.bind(null, false);
	    chainedCheckType.isRequired = checkType.bind(null, true);
	    return chainedCheckType;
	  }
	  function createPrimitiveTypeChecker(expectedType) {
	    function validate(props, propName, componentName, location, propFullName, secret) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== expectedType) {
	        // `propValue` being instance of, say, date/regexp, pass the 'object'
	        // check, but we can offer a more precise error message here rather than
	        // 'of type `object`'.
	        var preciseType = getPreciseType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'), {
	          expectedType: expectedType
	        });
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function createAnyTypeChecker() {
	    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
	  }
	  function createArrayOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
	      }
	      var propValue = props[propName];
	      if (!Array.isArray(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
	      }
	      for (var i = 0; i < propValue.length; i++) {
	        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
	        if (error instanceof Error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function createElementTypeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      if (!isValidElement(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function createElementTypeTypeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      if (!ReactIs.isValidElementType(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function createInstanceTypeChecker(expectedClass) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!(props[propName] instanceof expectedClass)) {
	        var expectedClassName = expectedClass.name || ANONYMOUS;
	        var actualClassName = getClassName(props[propName]);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function createEnumTypeChecker(expectedValues) {
	    if (!Array.isArray(expectedValues)) {
	      {
	        if (arguments.length > 1) {
	          printWarning('Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' + 'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).');
	        } else {
	          printWarning('Invalid argument supplied to oneOf, expected an array.');
	        }
	      }
	      return emptyFunctionThatReturnsNull;
	    }
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      for (var i = 0; i < expectedValues.length; i++) {
	        if (is(propValue, expectedValues[i])) {
	          return null;
	        }
	      }
	      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
	        var type = getPreciseType(value);
	        if (type === 'symbol') {
	          return String(value);
	        }
	        return value;
	      });
	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function createObjectOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
	      }
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
	      }
	      for (var key in propValue) {
	        if (has(propValue, key)) {
	          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	          if (error instanceof Error) {
	            return error;
	          }
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function createUnionTypeChecker(arrayOfTypeCheckers) {
	    if (!Array.isArray(arrayOfTypeCheckers)) {
	      printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') ;
	      return emptyFunctionThatReturnsNull;
	    }
	    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	      var checker = arrayOfTypeCheckers[i];
	      if (typeof checker !== 'function') {
	        printWarning('Invalid argument supplied to oneOfType. Expected an array of check functions, but ' + 'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.');
	        return emptyFunctionThatReturnsNull;
	      }
	    }
	    function validate(props, propName, componentName, location, propFullName) {
	      var expectedTypes = [];
	      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	        var checker = arrayOfTypeCheckers[i];
	        var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
	        if (checkerResult == null) {
	          return null;
	        }
	        if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
	          expectedTypes.push(checkerResult.data.expectedType);
	        }
	      }
	      var expectedTypesMessage = expectedTypes.length > 0 ? ', expected one of type [' + expectedTypes.join(', ') + ']' : '';
	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function createNodeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!isNode(props[propName])) {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function invalidValidatorError(componentName, location, propFullName, key, type) {
	    return new PropTypeError((componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + type + '`.');
	  }
	  function createShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      for (var key in shapeTypes) {
	        var checker = shapeTypes[key];
	        if (typeof checker !== 'function') {
	          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function createStrictShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      // We need to check all keys in case some are required but missing from props.
	      var allKeys = assign({}, props[propName], shapeTypes);
	      for (var key in allKeys) {
	        var checker = shapeTypes[key];
	        if (has(shapeTypes, key) && typeof checker !== 'function') {
	          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
	        }
	        if (!checker) {
	          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' + '\nBad object: ' + JSON.stringify(props[propName], null, '  ') + '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  '));
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function isNode(propValue) {
	    switch (typeof propValue) {
	      case 'number':
	      case 'string':
	      case 'undefined':
	        return true;
	      case 'boolean':
	        return !propValue;
	      case 'object':
	        if (Array.isArray(propValue)) {
	          return propValue.every(isNode);
	        }
	        if (propValue === null || isValidElement(propValue)) {
	          return true;
	        }
	        var iteratorFn = getIteratorFn(propValue);
	        if (iteratorFn) {
	          var iterator = iteratorFn.call(propValue);
	          var step;
	          if (iteratorFn !== propValue.entries) {
	            while (!(step = iterator.next()).done) {
	              if (!isNode(step.value)) {
	                return false;
	              }
	            }
	          } else {
	            // Iterator will provide entry [k,v] tuples rather than values.
	            while (!(step = iterator.next()).done) {
	              var entry = step.value;
	              if (entry) {
	                if (!isNode(entry[1])) {
	                  return false;
	                }
	              }
	            }
	          }
	        } else {
	          return false;
	        }
	        return true;
	      default:
	        return false;
	    }
	  }
	  function isSymbol(propType, propValue) {
	    // Native Symbol.
	    if (propType === 'symbol') {
	      return true;
	    }

	    // falsy value can't be a Symbol
	    if (!propValue) {
	      return false;
	    }

	    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
	    if (propValue['@@toStringTag'] === 'Symbol') {
	      return true;
	    }

	    // Fallback for non-spec compliant Symbols which are polyfilled.
	    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
	      return true;
	    }
	    return false;
	  }

	  // Equivalent of `typeof` but with special handling for array and regexp.
	  function getPropType(propValue) {
	    var propType = typeof propValue;
	    if (Array.isArray(propValue)) {
	      return 'array';
	    }
	    if (propValue instanceof RegExp) {
	      // Old webkits (at least until Android 4.0) return 'function' rather than
	      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
	      // passes PropTypes.object.
	      return 'object';
	    }
	    if (isSymbol(propType, propValue)) {
	      return 'symbol';
	    }
	    return propType;
	  }

	  // This handles more types than `getPropType`. Only used for error messages.
	  // See `createPrimitiveTypeChecker`.
	  function getPreciseType(propValue) {
	    if (typeof propValue === 'undefined' || propValue === null) {
	      return '' + propValue;
	    }
	    var propType = getPropType(propValue);
	    if (propType === 'object') {
	      if (propValue instanceof Date) {
	        return 'date';
	      } else if (propValue instanceof RegExp) {
	        return 'regexp';
	      }
	    }
	    return propType;
	  }

	  // Returns a string that is postfixed to a warning about an invalid type.
	  // For example, "undefined" or "of type array"
	  function getPostfixForTypeWarning(value) {
	    var type = getPreciseType(value);
	    switch (type) {
	      case 'array':
	      case 'object':
	        return 'an ' + type;
	      case 'boolean':
	      case 'date':
	      case 'regexp':
	        return 'a ' + type;
	      default:
	        return type;
	    }
	  }

	  // Returns class name of the object, if any.
	  function getClassName(propValue) {
	    if (!propValue.constructor || !propValue.constructor.name) {
	      return ANONYMOUS;
	    }
	    return propValue.constructor.name;
	  }
	  ReactPropTypes.checkPropTypes = checkPropTypes;
	  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
	  ReactPropTypes.PropTypes = ReactPropTypes;
	  return ReactPropTypes;
	};
	return factoryWithTypeCheckers;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredPropTypes;

function requirePropTypes () {
	if (hasRequiredPropTypes) return propTypes.exports;
	hasRequiredPropTypes = 1;
	{
	  var ReactIs = requireReactIs$1();

	  // By explicitly using `prop-types` you are opting into new development behavior.
	  // http://fb.me/prop-types-in-prod
	  var throwOnDirectAccess = true;
	  propTypes.exports = /*@__PURE__*/ requireFactoryWithTypeCheckers()(ReactIs.isElement, throwOnDirectAccess);
	}
	return propTypes.exports;
}

var propTypesExports = /*@__PURE__*/ requirePropTypes();
var PropTypes = /*@__PURE__*/getDefaultExportFromCjs(propTypesExports);

var reactIs = {exports: {}};

var reactIs_development = {};

/** @license React v17.0.2
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactIs_development;

function requireReactIs_development () {
	if (hasRequiredReactIs_development) return reactIs_development;
	hasRequiredReactIs_development = 1;

	{
	  (function () {

	    // ATTENTION
	    // When adding new symbols to this file,
	    // Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
	    // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
	    // nor polyfill, then a plain number is used for performance.
	    var REACT_ELEMENT_TYPE = 0xeac7;
	    var REACT_PORTAL_TYPE = 0xeaca;
	    var REACT_FRAGMENT_TYPE = 0xeacb;
	    var REACT_STRICT_MODE_TYPE = 0xeacc;
	    var REACT_PROFILER_TYPE = 0xead2;
	    var REACT_PROVIDER_TYPE = 0xeacd;
	    var REACT_CONTEXT_TYPE = 0xeace;
	    var REACT_FORWARD_REF_TYPE = 0xead0;
	    var REACT_SUSPENSE_TYPE = 0xead1;
	    var REACT_SUSPENSE_LIST_TYPE = 0xead8;
	    var REACT_MEMO_TYPE = 0xead3;
	    var REACT_LAZY_TYPE = 0xead4;
	    var REACT_BLOCK_TYPE = 0xead9;
	    var REACT_SERVER_BLOCK_TYPE = 0xeada;
	    var REACT_FUNDAMENTAL_TYPE = 0xead5;
	    var REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1;
	    var REACT_LEGACY_HIDDEN_TYPE = 0xeae3;
	    if (typeof Symbol === 'function' && Symbol.for) {
	      var symbolFor = Symbol.for;
	      REACT_ELEMENT_TYPE = symbolFor('react.element');
	      REACT_PORTAL_TYPE = symbolFor('react.portal');
	      REACT_FRAGMENT_TYPE = symbolFor('react.fragment');
	      REACT_STRICT_MODE_TYPE = symbolFor('react.strict_mode');
	      REACT_PROFILER_TYPE = symbolFor('react.profiler');
	      REACT_PROVIDER_TYPE = symbolFor('react.provider');
	      REACT_CONTEXT_TYPE = symbolFor('react.context');
	      REACT_FORWARD_REF_TYPE = symbolFor('react.forward_ref');
	      REACT_SUSPENSE_TYPE = symbolFor('react.suspense');
	      REACT_SUSPENSE_LIST_TYPE = symbolFor('react.suspense_list');
	      REACT_MEMO_TYPE = symbolFor('react.memo');
	      REACT_LAZY_TYPE = symbolFor('react.lazy');
	      REACT_BLOCK_TYPE = symbolFor('react.block');
	      REACT_SERVER_BLOCK_TYPE = symbolFor('react.server.block');
	      REACT_FUNDAMENTAL_TYPE = symbolFor('react.fundamental');
	      symbolFor('react.scope');
	      symbolFor('react.opaque.id');
	      REACT_DEBUG_TRACING_MODE_TYPE = symbolFor('react.debug_trace_mode');
	      symbolFor('react.offscreen');
	      REACT_LEGACY_HIDDEN_TYPE = symbolFor('react.legacy_hidden');
	    }

	    // Filter certain DOM attributes (e.g. src, href) if their values are empty strings.

	    var enableScopeAPI = false; // Experimental Create Event Handle API.

	    function isValidElementType(type) {
	      if (typeof type === 'string' || typeof type === 'function') {
	        return true;
	      } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).

	      if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || type === REACT_DEBUG_TRACING_MODE_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_LEGACY_HIDDEN_TYPE || enableScopeAPI) {
	        return true;
	      }
	      if (typeof type === 'object' && type !== null) {
	        if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_BLOCK_TYPE || type[0] === REACT_SERVER_BLOCK_TYPE) {
	          return true;
	        }
	      }
	      return false;
	    }
	    function typeOf(object) {
	      if (typeof object === 'object' && object !== null) {
	        var $$typeof = object.$$typeof;
	        switch ($$typeof) {
	          case REACT_ELEMENT_TYPE:
	            var type = object.type;
	            switch (type) {
	              case REACT_FRAGMENT_TYPE:
	              case REACT_PROFILER_TYPE:
	              case REACT_STRICT_MODE_TYPE:
	              case REACT_SUSPENSE_TYPE:
	              case REACT_SUSPENSE_LIST_TYPE:
	                return type;
	              default:
	                var $$typeofType = type && type.$$typeof;
	                switch ($$typeofType) {
	                  case REACT_CONTEXT_TYPE:
	                  case REACT_FORWARD_REF_TYPE:
	                  case REACT_LAZY_TYPE:
	                  case REACT_MEMO_TYPE:
	                  case REACT_PROVIDER_TYPE:
	                    return $$typeofType;
	                  default:
	                    return $$typeof;
	                }
	            }
	          case REACT_PORTAL_TYPE:
	            return $$typeof;
	        }
	      }
	      return undefined;
	    }
	    var ContextConsumer = REACT_CONTEXT_TYPE;
	    var ContextProvider = REACT_PROVIDER_TYPE;
	    var Element = REACT_ELEMENT_TYPE;
	    var ForwardRef = REACT_FORWARD_REF_TYPE;
	    var Fragment = REACT_FRAGMENT_TYPE;
	    var Lazy = REACT_LAZY_TYPE;
	    var Memo = REACT_MEMO_TYPE;
	    var Portal = REACT_PORTAL_TYPE;
	    var Profiler = REACT_PROFILER_TYPE;
	    var StrictMode = REACT_STRICT_MODE_TYPE;
	    var Suspense = REACT_SUSPENSE_TYPE;
	    var hasWarnedAboutDeprecatedIsAsyncMode = false;
	    var hasWarnedAboutDeprecatedIsConcurrentMode = false; // AsyncMode should be deprecated

	    function isAsyncMode(object) {
	      {
	        if (!hasWarnedAboutDeprecatedIsAsyncMode) {
	          hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

	          console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 18+.');
	        }
	      }
	      return false;
	    }
	    function isConcurrentMode(object) {
	      {
	        if (!hasWarnedAboutDeprecatedIsConcurrentMode) {
	          hasWarnedAboutDeprecatedIsConcurrentMode = true; // Using console['warn'] to evade Babel and ESLint

	          console['warn']('The ReactIs.isConcurrentMode() alias has been deprecated, ' + 'and will be removed in React 18+.');
	        }
	      }
	      return false;
	    }
	    function isContextConsumer(object) {
	      return typeOf(object) === REACT_CONTEXT_TYPE;
	    }
	    function isContextProvider(object) {
	      return typeOf(object) === REACT_PROVIDER_TYPE;
	    }
	    function isElement(object) {
	      return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
	    }
	    function isForwardRef(object) {
	      return typeOf(object) === REACT_FORWARD_REF_TYPE;
	    }
	    function isFragment(object) {
	      return typeOf(object) === REACT_FRAGMENT_TYPE;
	    }
	    function isLazy(object) {
	      return typeOf(object) === REACT_LAZY_TYPE;
	    }
	    function isMemo(object) {
	      return typeOf(object) === REACT_MEMO_TYPE;
	    }
	    function isPortal(object) {
	      return typeOf(object) === REACT_PORTAL_TYPE;
	    }
	    function isProfiler(object) {
	      return typeOf(object) === REACT_PROFILER_TYPE;
	    }
	    function isStrictMode(object) {
	      return typeOf(object) === REACT_STRICT_MODE_TYPE;
	    }
	    function isSuspense(object) {
	      return typeOf(object) === REACT_SUSPENSE_TYPE;
	    }
	    reactIs_development.ContextConsumer = ContextConsumer;
	    reactIs_development.ContextProvider = ContextProvider;
	    reactIs_development.Element = Element;
	    reactIs_development.ForwardRef = ForwardRef;
	    reactIs_development.Fragment = Fragment;
	    reactIs_development.Lazy = Lazy;
	    reactIs_development.Memo = Memo;
	    reactIs_development.Portal = Portal;
	    reactIs_development.Profiler = Profiler;
	    reactIs_development.StrictMode = StrictMode;
	    reactIs_development.Suspense = Suspense;
	    reactIs_development.isAsyncMode = isAsyncMode;
	    reactIs_development.isConcurrentMode = isConcurrentMode;
	    reactIs_development.isContextConsumer = isContextConsumer;
	    reactIs_development.isContextProvider = isContextProvider;
	    reactIs_development.isElement = isElement;
	    reactIs_development.isForwardRef = isForwardRef;
	    reactIs_development.isFragment = isFragment;
	    reactIs_development.isLazy = isLazy;
	    reactIs_development.isMemo = isMemo;
	    reactIs_development.isPortal = isPortal;
	    reactIs_development.isProfiler = isProfiler;
	    reactIs_development.isStrictMode = isStrictMode;
	    reactIs_development.isSuspense = isSuspense;
	    reactIs_development.isValidElementType = isValidElementType;
	    reactIs_development.typeOf = typeOf;
	  })();
	}
	return reactIs_development;
}

var hasRequiredReactIs;

function requireReactIs () {
	if (hasRequiredReactIs) return reactIs.exports;
	hasRequiredReactIs = 1;

	{
	  reactIs.exports = requireReactIs_development();
	}
	return reactIs.exports;
}

var reactIsExports = requireReactIs();

let e = e => "object" == typeof e && null != e && 1 === e.nodeType,
  t = (e, t) => (!t || "hidden" !== e) && "visible" !== e && "clip" !== e,
  n = (e, n) => {
    if (e.clientHeight < e.scrollHeight || e.clientWidth < e.scrollWidth) {
      let l = getComputedStyle(e, null);
      return t(l.overflowY, n) || t(l.overflowX, n) || (e => {
        let t = (e => {
          if (!e.ownerDocument || !e.ownerDocument.defaultView) return null;
          try {
            return e.ownerDocument.defaultView.frameElement;
          } catch (e) {
            return null;
          }
        })(e);
        return !!t && (t.clientHeight < e.scrollHeight || t.clientWidth < e.scrollWidth);
      })(e);
    }
    return !1;
  },
  l = (e, t, n, l, i, o, r, d) => o < e && r > t || o > e && r < t ? 0 : o <= e && d <= n || r >= t && d >= n ? o - e - l : r > t && d < n || o < e && d > n ? r - t + i : 0,
  i = e => {
    let t = e.parentElement;
    return null == t ? e.getRootNode().host || null : t;
  };
var o = (t, o) => {
  var r, d, h, f, u, s;
  if ("undefined" == typeof document) return [];
  let {
      scrollMode: a,
      block: c,
      inline: g,
      boundary: m,
      skipOverflowHiddenElements: p
    } = o,
    w = "function" == typeof m ? m : e => e !== m;
  if (!e(t)) throw new TypeError("Invalid target");
  let W = document.scrollingElement || document.documentElement,
    H = [],
    b = t;
  for (; e(b) && w(b);) {
    if (b = i(b), b === W) {
      H.push(b);
      break;
    }
    null != b && b === document.body && n(b) && !n(document.documentElement) || null != b && n(b, p) && H.push(b);
  }
  let v = null != (d = null == (r = window.visualViewport) ? void 0 : r.width) ? d : innerWidth,
    y = null != (f = null == (h = window.visualViewport) ? void 0 : h.height) ? f : innerHeight,
    E = null != (u = window.scrollX) ? u : pageXOffset,
    M = null != (s = window.scrollY) ? s : pageYOffset,
    {
      height: x,
      width: I,
      top: C,
      right: R,
      bottom: T,
      left: V
    } = t.getBoundingClientRect(),
    k = "start" === c || "nearest" === c ? C : "end" === c ? T : C + x / 2,
    B = "center" === g ? V + I / 2 : "end" === g ? R : V,
    D = [];
  for (let e = 0; e < H.length; e++) {
    let t = H[e],
      {
        height: n,
        width: i,
        top: o,
        right: r,
        bottom: d,
        left: h
      } = t.getBoundingClientRect();
    if ("if-needed" === a && C >= 0 && V >= 0 && T <= y && R <= v && C >= o && T <= d && V >= h && R <= r) return D;
    let f = getComputedStyle(t),
      u = parseInt(f.borderLeftWidth, 10),
      s = parseInt(f.borderTopWidth, 10),
      m = parseInt(f.borderRightWidth, 10),
      p = parseInt(f.borderBottomWidth, 10),
      w = 0,
      b = 0,
      O = "offsetWidth" in t ? t.offsetWidth - t.clientWidth - u - m : 0,
      X = "offsetHeight" in t ? t.offsetHeight - t.clientHeight - s - p : 0,
      Y = "offsetWidth" in t ? 0 === t.offsetWidth ? 0 : i / t.offsetWidth : 0,
      L = "offsetHeight" in t ? 0 === t.offsetHeight ? 0 : n / t.offsetHeight : 0;
    if (W === t) w = "start" === c ? k : "end" === c ? k - y : "nearest" === c ? l(M, M + y, y, s, p, M + k, M + k + x, x) : k - y / 2, b = "start" === g ? B : "center" === g ? B - v / 2 : "end" === g ? B - v : l(E, E + v, v, u, m, E + B, E + B + I, I), w = Math.max(0, w + M), b = Math.max(0, b + E);else {
      w = "start" === c ? k - o - s : "end" === c ? k - d + p + X : "nearest" === c ? l(o, d, n, s, p + X, k, k + x, x) : k - (o + n / 2) + X / 2, b = "start" === g ? B - h - u : "center" === g ? B - (h + i / 2) + O / 2 : "end" === g ? B - r + m + O : l(h, r, i, u, m + O, B, B + I, I);
      let {
        scrollLeft: e,
        scrollTop: f
      } = t;
      w = Math.max(0, Math.min(f + w / L, t.scrollHeight - n / L + X)), b = Math.max(0, Math.min(e + b / Y, t.scrollWidth - i / Y + O)), k += f - w, B += e - b;
    }
    D.push({
      el: t,
      top: w,
      left: b
    });
  }
  return D;
};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var idCounter = 0;

/**
 * Accepts a parameter and returns it if it's a function
 * or a noop function if it's not. This allows us to
 * accept a callback, but not worry about it if it's not
 * passed.
 * @param {Function} cb the callback
 * @return {Function} a function
 */
function cbToCb(cb) {
  return typeof cb === 'function' ? cb : noop;
}
function noop() {}

/**
 * Scroll node into view if necessary
 * @param {HTMLElement} node the element that should scroll into view
 * @param {HTMLElement} menuNode the menu element of the component
 */
function scrollIntoView(node, menuNode) {
  if (!node) {
    return;
  }
  var actions = o(node, {
    boundary: menuNode,
    block: 'nearest',
    scrollMode: 'if-needed'
  });
  actions.forEach(function (_ref) {
    var el = _ref.el,
      top = _ref.top,
      left = _ref.left;
    el.scrollTop = top;
    el.scrollLeft = left;
  });
}

/**
 * @param {HTMLElement} parent the parent node
 * @param {HTMLElement} child the child node
 * @param {Window} environment The window context where downshift renders.
 * @return {Boolean} whether the parent is the child or the child is in the parent
 */
function isOrContainsNode(parent, child, environment) {
  var result = parent === child || child instanceof environment.Node && parent.contains && parent.contains(child);
  return result;
}

/**
 * Simple debounce implementation. Will call the given
 * function once after the time given has passed since
 * it was last called.
 * @param {Function} fn the function to call after the time
 * @param {Number} time the time to wait
 * @return {Function} the debounced function
 */
function debounce$1(fn, time) {
  var timeoutId;
  function cancel() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
  function wrapper() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    cancel();
    timeoutId = setTimeout(function () {
      timeoutId = null;
      fn.apply(void 0, args);
    }, time);
  }
  wrapper.cancel = cancel;
  return wrapper;
}

/**
 * This is intended to be used to compose event handlers.
 * They are executed in order until one of them sets
 * `event.preventDownshiftDefault = true`.
 * @param {...Function} fns the event handler functions
 * @return {Function} the event handler to add to an element
 */
function callAllEventHandlers() {
  for (var _len2 = arguments.length, fns = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fns[_key2] = arguments[_key2];
  }
  return function (event) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return fns.some(function (fn) {
      if (fn) {
        fn.apply(void 0, [event].concat(args));
      }
      return event.preventDownshiftDefault || event.hasOwnProperty('nativeEvent') && event.nativeEvent.preventDownshiftDefault;
    });
  };
}
function handleRefs() {
  for (var _len4 = arguments.length, refs = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    refs[_key4] = arguments[_key4];
  }
  return function (node) {
    refs.forEach(function (ref) {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    });
  };
}

/**
 * This generates a unique ID for an instance of Downshift
 * @return {String} the unique ID
 */
function generateId() {
  return String(idCounter++);
}

/**
 * Default implementation for status message. Only added when menu is open.
 * Will specify if there are results in the list, and if so, how many,
 * and what keys are relevant.
 *
 * @param {Object} param the downshift state and other relevant properties
 * @return {String} the a11y status message
 */
function getA11yStatusMessage$1(_ref2) {
  var isOpen = _ref2.isOpen,
    resultCount = _ref2.resultCount,
    previousResultCount = _ref2.previousResultCount;
  if (!isOpen) {
    return '';
  }
  if (!resultCount) {
    return 'No results are available.';
  }
  if (resultCount !== previousResultCount) {
    return resultCount + " result" + (resultCount === 1 ? ' is' : 's are') + " available, use up and down arrow keys to navigate. Press Enter key to select.";
  }
  return '';
}

/**
 * Takes an argument and if it's an array, returns the first item in the array
 * otherwise returns the argument
 * @param {*} arg the maybe-array
 * @param {*} defaultValue the value if arg is falsey not defined
 * @return {*} the arg or it's first item
 */
function unwrapArray(arg, defaultValue) {
  arg = Array.isArray(arg) ? /* istanbul ignore next (preact) */arg[0] : arg;
  if (!arg && defaultValue) {
    return defaultValue;
  } else {
    return arg;
  }
}

/**
 * @param {Object} element (P)react element
 * @return {Boolean} whether it's a DOM element
 */
function isDOMElement(element) {
  // then we assume this is react
  return typeof element.type === 'string';
}

/**
 * @param {Object} element (P)react element
 * @return {Object} the props
 */
function getElementProps(element) {
  return element.props;
}

/**
 * Throws a helpful error message for required properties. Useful
 * to be used as a default in destructuring or object params.
 * @param {String} fnName the function name
 * @param {String} propName the prop name
 */
function requiredProp(fnName, propName) {
  // eslint-disable-next-line no-console
  console.error("The property \"" + propName + "\" is required in \"" + fnName + "\"");
}
var stateKeys = ['highlightedIndex', 'inputValue', 'isOpen', 'selectedItem', 'type'];
/**
 * @param {Object} state the state object
 * @return {Object} state that is relevant to downshift
 */
function pickState(state) {
  if (state === void 0) {
    state = {};
  }
  var result = {};
  stateKeys.forEach(function (k) {
    if (state.hasOwnProperty(k)) {
      result[k] = state[k];
    }
  });
  return result;
}

/**
 * This will perform a shallow merge of the given state object
 * with the state coming from props
 * (for the controlled component scenario)
 * This is used in state updater functions so they're referencing
 * the right state regardless of where it comes from.
 *
 * @param {Object} state The state of the component/hook.
 * @param {Object} props The props that may contain controlled values.
 * @returns {Object} The merged controlled state.
 */
function getState(state, props) {
  return Object.keys(state).reduce(function (prevState, key) {
    prevState[key] = isControlledProp(props, key) ? props[key] : state[key];
    return prevState;
  }, {});
}

/**
 * This determines whether a prop is a "controlled prop" meaning it is
 * state which is controlled by the outside of this component rather
 * than within this component.
 *
 * @param {Object} props The props that may contain controlled values.
 * @param {String} key the key to check
 * @return {Boolean} whether it is a controlled controlled prop
 */
function isControlledProp(props, key) {
  return props[key] !== undefined;
}

/**
 * Normalizes the 'key' property of a KeyboardEvent in IE/Edge
 * @param {Object} event a keyboardEvent object
 * @return {String} keyboard key
 */
function normalizeArrowKey(event) {
  var key = event.key,
    keyCode = event.keyCode;
  /* istanbul ignore next (ie) */
  if (keyCode >= 37 && keyCode <= 40 && key.indexOf('Arrow') !== 0) {
    return "Arrow" + key;
  }
  return key;
}

/**
 * Simple check if the value passed is object literal
 * @param {*} obj any things
 * @return {Boolean} whether it's object literal
 */
function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * Returns the new index in the list, in a circular way. If next value is out of bonds from the total,
 * it will wrap to either 0 or itemCount - 1.
 *
 * @param {number} moveAmount Number of positions to move. Negative to move backwards, positive forwards.
 * @param {number} baseIndex The initial position to move from.
 * @param {number} itemCount The total number of items.
 * @param {Function} getItemNodeFromIndex Used to check if item is disabled.
 * @param {boolean} circular Specify if navigation is circular. Default is true.
 * @returns {number} The new index after the move.
 */
function getNextWrappingIndex(moveAmount, baseIndex, itemCount, getItemNodeFromIndex, circular) {
  if (circular === void 0) {
    circular = true;
  }
  if (itemCount === 0) {
    return -1;
  }
  var itemsLastIndex = itemCount - 1;
  if (typeof baseIndex !== 'number' || baseIndex < 0 || baseIndex >= itemCount) {
    baseIndex = moveAmount > 0 ? -1 : itemsLastIndex + 1;
  }
  var newIndex = baseIndex + moveAmount;
  if (newIndex < 0) {
    newIndex = circular ? itemsLastIndex : 0;
  } else if (newIndex > itemsLastIndex) {
    newIndex = circular ? 0 : itemsLastIndex;
  }
  var nonDisabledNewIndex = getNextNonDisabledIndex(moveAmount, newIndex, itemCount, getItemNodeFromIndex, circular);
  if (nonDisabledNewIndex === -1) {
    return baseIndex >= itemCount ? -1 : baseIndex;
  }
  return nonDisabledNewIndex;
}

/**
 * Returns the next index in the list of an item that is not disabled.
 *
 * @param {number} moveAmount Number of positions to move. Negative to move backwards, positive forwards.
 * @param {number} baseIndex The initial position to move from.
 * @param {number} itemCount The total number of items.
 * @param {Function} getItemNodeFromIndex Used to check if item is disabled.
 * @param {boolean} circular Specify if navigation is circular. Default is true.
 * @returns {number} The new index. Returns baseIndex if item is not disabled. Returns next non-disabled item otherwise. If no non-disabled found it will return -1.
 */
function getNextNonDisabledIndex(moveAmount, baseIndex, itemCount, getItemNodeFromIndex, circular) {
  var currentElementNode = getItemNodeFromIndex(baseIndex);
  if (!currentElementNode || !currentElementNode.hasAttribute('disabled')) {
    return baseIndex;
  }
  if (moveAmount > 0) {
    for (var index = baseIndex + 1; index < itemCount; index++) {
      if (!getItemNodeFromIndex(index).hasAttribute('disabled')) {
        return index;
      }
    }
  } else {
    for (var _index = baseIndex - 1; _index >= 0; _index--) {
      if (!getItemNodeFromIndex(_index).hasAttribute('disabled')) {
        return _index;
      }
    }
  }
  if (circular) {
    return moveAmount > 0 ? getNextNonDisabledIndex(1, 0, itemCount, getItemNodeFromIndex, false) : getNextNonDisabledIndex(-1, itemCount - 1, itemCount, getItemNodeFromIndex, false);
  }
  return -1;
}

/**
 * Checks if event target is within the downshift elements.
 *
 * @param {EventTarget} target Target to check.
 * @param {HTMLElement[]} downshiftElements The elements that form downshift (list, toggle button etc).
 * @param {Window} environment The window context where downshift renders.
 * @param {boolean} checkActiveElement Whether to also check activeElement.
 *
 * @returns {boolean} Whether or not the target is within downshift elements.
 */
function targetWithinDownshift(target, downshiftElements, environment, checkActiveElement) {
  if (checkActiveElement === void 0) {
    checkActiveElement = true;
  }
  return downshiftElements.some(function (contextNode) {
    return contextNode && (isOrContainsNode(contextNode, target, environment) || checkActiveElement && isOrContainsNode(contextNode, environment.document.activeElement, environment));
  });
}

// eslint-disable-next-line import/no-mutable-exports
var validateControlledUnchanged = noop;
/* istanbul ignore next */
{
  validateControlledUnchanged = function validateControlledUnchanged(state, prevProps, nextProps) {
    var warningDescription = "This prop should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled Downshift element for the lifetime of the component. More info: https://github.com/downshift-js/downshift#control-props";
    Object.keys(state).forEach(function (propKey) {
      if (prevProps[propKey] !== undefined && nextProps[propKey] === undefined) {
        // eslint-disable-next-line no-console
        console.error("downshift: A component has changed the controlled prop \"" + propKey + "\" to be uncontrolled. " + warningDescription);
      } else if (prevProps[propKey] === undefined && nextProps[propKey] !== undefined) {
        // eslint-disable-next-line no-console
        console.error("downshift: A component has changed the uncontrolled prop \"" + propKey + "\" to be controlled. " + warningDescription);
      }
    });
  };
}
var cleanupStatus = debounce$1(function (documentProp) {
  getStatusDiv(documentProp).textContent = '';
}, 500);

/**
 * @param {String} status the status message
 * @param {Object} documentProp document passed by the user.
 */
function setStatus(status, documentProp) {
  var div = getStatusDiv(documentProp);
  if (!status) {
    return;
  }
  div.textContent = status;
  cleanupStatus(documentProp);
}

/**
 * Get the status node or create it if it does not already exist.
 * @param {Object} documentProp document passed by the user.
 * @return {HTMLElement} the status node.
 */
function getStatusDiv(documentProp) {
  if (documentProp === void 0) {
    documentProp = document;
  }
  var statusDiv = documentProp.getElementById('a11y-status-message');
  if (statusDiv) {
    return statusDiv;
  }
  statusDiv = documentProp.createElement('div');
  statusDiv.setAttribute('id', 'a11y-status-message');
  statusDiv.setAttribute('role', 'status');
  statusDiv.setAttribute('aria-live', 'polite');
  statusDiv.setAttribute('aria-relevant', 'additions text');
  Object.assign(statusDiv.style, {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    width: '1px'
  });
  documentProp.body.appendChild(statusDiv);
  return statusDiv;
}
var unknown = '__autocomplete_unknown__' ;
var mouseUp = '__autocomplete_mouseup__' ;
var itemMouseEnter = '__autocomplete_item_mouseenter__' ;
var keyDownArrowUp = '__autocomplete_keydown_arrow_up__' ;
var keyDownArrowDown = '__autocomplete_keydown_arrow_down__' ;
var keyDownEscape = '__autocomplete_keydown_escape__' ;
var keyDownEnter = '__autocomplete_keydown_enter__' ;
var keyDownHome = '__autocomplete_keydown_home__' ;
var keyDownEnd = '__autocomplete_keydown_end__' ;
var clickItem = '__autocomplete_click_item__' ;
var blurInput = '__autocomplete_blur_input__' ;
var changeInput = '__autocomplete_change_input__' ;
var keyDownSpaceButton = '__autocomplete_keydown_space_button__' ;
var clickButton = '__autocomplete_click_button__' ;
var blurButton = '__autocomplete_blur_button__' ;
var controlledPropUpdatedSelectedItem = '__autocomplete_controlled_prop_updated_selected_item__' ;
var touchEnd = '__autocomplete_touchend__' ;
var stateChangeTypes$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  unknown: unknown,
  mouseUp: mouseUp,
  itemMouseEnter: itemMouseEnter,
  keyDownArrowUp: keyDownArrowUp,
  keyDownArrowDown: keyDownArrowDown,
  keyDownEscape: keyDownEscape,
  keyDownEnter: keyDownEnter,
  keyDownHome: keyDownHome,
  keyDownEnd: keyDownEnd,
  clickItem: clickItem,
  blurInput: blurInput,
  changeInput: changeInput,
  keyDownSpaceButton: keyDownSpaceButton,
  clickButton: clickButton,
  blurButton: blurButton,
  controlledPropUpdatedSelectedItem: controlledPropUpdatedSelectedItem,
  touchEnd: touchEnd
});
var _excluded$4 = ["refKey", "ref"],
  _excluded2$3 = ["onClick", "onPress", "onKeyDown", "onKeyUp", "onBlur"],
  _excluded3$2 = ["onKeyDown", "onBlur", "onChange", "onInput", "onChangeText"],
  _excluded4$1 = ["refKey", "ref"],
  _excluded5 = ["onMouseMove", "onMouseDown", "onClick", "onPress", "index", "item"];
var Downshift = /*#__PURE__*/function () {
  var Downshift = /*#__PURE__*/function (_Component) {
    _inheritsLoose(Downshift, _Component);
    function Downshift(_props) {
      var _this;
      _this = _Component.call(this, _props) || this;
      // fancy destructuring + defaults + aliases
      // this basically says each value of state should either be set to
      // the initial value or the default value if the initial value is not provided
      _this.id = _this.props.id || "downshift-" + generateId();
      _this.menuId = _this.props.menuId || _this.id + "-menu";
      _this.labelId = _this.props.labelId || _this.id + "-label";
      _this.inputId = _this.props.inputId || _this.id + "-input";
      _this.getItemId = _this.props.getItemId || function (index) {
        return _this.id + "-item-" + index;
      };
      _this.input = null;
      _this.items = [];
      // itemCount can be changed asynchronously
      // from within downshift (so it can't come from a prop)
      // this is why we store it as an instance and use
      // getItemCount rather than just use items.length
      // (to support windowing + async)
      _this.itemCount = null;
      _this.previousResultCount = 0;
      _this.timeoutIds = [];
      /**
       * @param {Function} fn the function to call after the time
       * @param {Number} time the time to wait
       */
      _this.internalSetTimeout = function (fn, time) {
        var id = setTimeout(function () {
          _this.timeoutIds = _this.timeoutIds.filter(function (i) {
            return i !== id;
          });
          fn();
        }, time);
        _this.timeoutIds.push(id);
      };
      _this.setItemCount = function (count) {
        _this.itemCount = count;
      };
      _this.unsetItemCount = function () {
        _this.itemCount = null;
      };
      _this.setHighlightedIndex = function (highlightedIndex, otherStateToSet) {
        if (highlightedIndex === void 0) {
          highlightedIndex = _this.props.defaultHighlightedIndex;
        }
        if (otherStateToSet === void 0) {
          otherStateToSet = {};
        }
        otherStateToSet = pickState(otherStateToSet);
        _this.internalSetState(_extends({
          highlightedIndex: highlightedIndex
        }, otherStateToSet));
      };
      _this.clearSelection = function (cb) {
        _this.internalSetState({
          selectedItem: null,
          inputValue: '',
          highlightedIndex: _this.props.defaultHighlightedIndex,
          isOpen: _this.props.defaultIsOpen
        }, cb);
      };
      _this.selectItem = function (item, otherStateToSet, cb) {
        otherStateToSet = pickState(otherStateToSet);
        _this.internalSetState(_extends({
          isOpen: _this.props.defaultIsOpen,
          highlightedIndex: _this.props.defaultHighlightedIndex,
          selectedItem: item,
          inputValue: _this.props.itemToString(item)
        }, otherStateToSet), cb);
      };
      _this.selectItemAtIndex = function (itemIndex, otherStateToSet, cb) {
        var item = _this.items[itemIndex];
        if (item == null) {
          return;
        }
        _this.selectItem(item, otherStateToSet, cb);
      };
      _this.selectHighlightedItem = function (otherStateToSet, cb) {
        return _this.selectItemAtIndex(_this.getState().highlightedIndex, otherStateToSet, cb);
      };
      // any piece of our state can live in two places:
      // 1. Uncontrolled: it's internal (this.state)
      //    We will call this.setState to update that state
      // 2. Controlled: it's external (this.props)
      //    We will call this.props.onStateChange to update that state
      //
      // In addition, we'll call this.props.onChange if the
      // selectedItem is changed.
      _this.internalSetState = function (stateToSet, cb) {
        var isItemSelected, onChangeArg;
        var onStateChangeArg = {};
        var isStateToSetFunction = typeof stateToSet === 'function';

        // we want to call `onInputValueChange` before the `setState` call
        // so someone controlling the `inputValue` state gets notified of
        // the input change as soon as possible. This avoids issues with
        // preserving the cursor position.
        // See https://github.com/downshift-js/downshift/issues/217 for more info.
        if (!isStateToSetFunction && stateToSet.hasOwnProperty('inputValue')) {
          _this.props.onInputValueChange(stateToSet.inputValue, _extends({}, _this.getStateAndHelpers(), stateToSet));
        }
        return _this.setState(function (state) {
          state = _this.getState(state);
          var newStateToSet = isStateToSetFunction ? stateToSet(state) : stateToSet;

          // Your own function that could modify the state that will be set.
          newStateToSet = _this.props.stateReducer(state, newStateToSet);

          // checks if an item is selected, regardless of if it's different from
          // what was selected before
          // used to determine if onSelect and onChange callbacks should be called
          isItemSelected = newStateToSet.hasOwnProperty('selectedItem');
          // this keeps track of the object we want to call with setState
          var nextState = {};
          // we need to call on change if the outside world is controlling any of our state
          // and we're trying to update that state. OR if the selection has changed and we're
          // trying to update the selection
          if (isItemSelected && newStateToSet.selectedItem !== state.selectedItem) {
            onChangeArg = newStateToSet.selectedItem;
          }
          newStateToSet.type = newStateToSet.type || unknown;
          Object.keys(newStateToSet).forEach(function (key) {
            // onStateChangeArg should only have the state that is
            // actually changing
            if (state[key] !== newStateToSet[key]) {
              onStateChangeArg[key] = newStateToSet[key];
            }
            // the type is useful for the onStateChangeArg
            // but we don't actually want to set it in internal state.
            // this is an undocumented feature for now... Not all internalSetState
            // calls support it and I'm not certain we want them to yet.
            // But it enables users controlling the isOpen state to know when
            // the isOpen state changes due to mouseup events which is quite handy.
            if (key === 'type') {
              return;
            }
            newStateToSet[key];
            // if it's coming from props, then we don't care to set it internally
            if (!isControlledProp(_this.props, key)) {
              nextState[key] = newStateToSet[key];
            }
          });

          // if stateToSet is a function, then we weren't able to call onInputValueChange
          // earlier, so we'll call it now that we know what the inputValue state will be.
          if (isStateToSetFunction && newStateToSet.hasOwnProperty('inputValue')) {
            _this.props.onInputValueChange(newStateToSet.inputValue, _extends({}, _this.getStateAndHelpers(), newStateToSet));
          }
          return nextState;
        }, function () {
          // call the provided callback if it's a function
          cbToCb(cb)();

          // only call the onStateChange and onChange callbacks if
          // we have relevant information to pass them.
          var hasMoreStateThanType = Object.keys(onStateChangeArg).length > 1;
          if (hasMoreStateThanType) {
            _this.props.onStateChange(onStateChangeArg, _this.getStateAndHelpers());
          }
          if (isItemSelected) {
            _this.props.onSelect(stateToSet.selectedItem, _this.getStateAndHelpers());
          }
          if (onChangeArg !== undefined) {
            _this.props.onChange(onChangeArg, _this.getStateAndHelpers());
          }
          // this is currently undocumented and therefore subject to change
          // We'll try to not break it, but just be warned.
          _this.props.onUserAction(onStateChangeArg, _this.getStateAndHelpers());
        });
      };
      //////////////////////////// ROOT
      _this.rootRef = function (node) {
        return _this._rootNode = node;
      };
      _this.getRootProps = function (_temp, _temp2) {
        var _extends2;
        var _ref = _temp === void 0 ? {} : _temp,
          _ref$refKey = _ref.refKey,
          refKey = _ref$refKey === void 0 ? 'ref' : _ref$refKey,
          ref = _ref.ref,
          rest = _objectWithoutPropertiesLoose(_ref, _excluded$4);
        var _ref2 = _temp2 === void 0 ? {} : _temp2,
          _ref2$suppressRefErro = _ref2.suppressRefError,
          suppressRefError = _ref2$suppressRefErro === void 0 ? false : _ref2$suppressRefErro;
        // this is used in the render to know whether the user has called getRootProps.
        // It uses that to know whether to apply the props automatically
        _this.getRootProps.called = true;
        _this.getRootProps.refKey = refKey;
        _this.getRootProps.suppressRefError = suppressRefError;
        var _this$getState = _this.getState(),
          isOpen = _this$getState.isOpen;
        return _extends((_extends2 = {}, _extends2[refKey] = handleRefs(ref, _this.rootRef), _extends2.role = 'combobox', _extends2['aria-expanded'] = isOpen, _extends2['aria-haspopup'] = 'listbox', _extends2['aria-owns'] = isOpen ? _this.menuId : null, _extends2['aria-labelledby'] = _this.labelId, _extends2), rest);
      };
      //\\\\\\\\\\\\\\\\\\\\\\\\\\ ROOT
      _this.keyDownHandlers = {
        ArrowDown: function ArrowDown(event) {
          var _this2 = this;
          event.preventDefault();
          if (this.getState().isOpen) {
            var amount = event.shiftKey ? 5 : 1;
            this.moveHighlightedIndex(amount, {
              type: keyDownArrowDown
            });
          } else {
            this.internalSetState({
              isOpen: true,
              type: keyDownArrowDown
            }, function () {
              var itemCount = _this2.getItemCount();
              if (itemCount > 0) {
                var _this2$getState = _this2.getState(),
                  highlightedIndex = _this2$getState.highlightedIndex;
                var nextHighlightedIndex = getNextWrappingIndex(1, highlightedIndex, itemCount, function (index) {
                  return _this2.getItemNodeFromIndex(index);
                });
                _this2.setHighlightedIndex(nextHighlightedIndex, {
                  type: keyDownArrowDown
                });
              }
            });
          }
        },
        ArrowUp: function ArrowUp(event) {
          var _this3 = this;
          event.preventDefault();
          if (this.getState().isOpen) {
            var amount = event.shiftKey ? -5 : -1;
            this.moveHighlightedIndex(amount, {
              type: keyDownArrowUp
            });
          } else {
            this.internalSetState({
              isOpen: true,
              type: keyDownArrowUp
            }, function () {
              var itemCount = _this3.getItemCount();
              if (itemCount > 0) {
                var _this3$getState = _this3.getState(),
                  highlightedIndex = _this3$getState.highlightedIndex;
                var nextHighlightedIndex = getNextWrappingIndex(-1, highlightedIndex, itemCount, function (index) {
                  return _this3.getItemNodeFromIndex(index);
                });
                _this3.setHighlightedIndex(nextHighlightedIndex, {
                  type: keyDownArrowUp
                });
              }
            });
          }
        },
        Enter: function Enter(event) {
          if (event.which === 229) {
            return;
          }
          var _this$getState2 = this.getState(),
            isOpen = _this$getState2.isOpen,
            highlightedIndex = _this$getState2.highlightedIndex;
          if (isOpen && highlightedIndex != null) {
            event.preventDefault();
            var item = this.items[highlightedIndex];
            var itemNode = this.getItemNodeFromIndex(highlightedIndex);
            if (item == null || itemNode && itemNode.hasAttribute('disabled')) {
              return;
            }
            this.selectHighlightedItem({
              type: keyDownEnter
            });
          }
        },
        Escape: function Escape(event) {
          event.preventDefault();
          this.reset(_extends({
            type: keyDownEscape
          }, !this.state.isOpen && {
            selectedItem: null,
            inputValue: ''
          }));
        }
      };
      //////////////////////////// BUTTON
      _this.buttonKeyDownHandlers = _extends({}, _this.keyDownHandlers, {
        ' ': function _(event) {
          event.preventDefault();
          this.toggleMenu({
            type: keyDownSpaceButton
          });
        }
      });
      _this.inputKeyDownHandlers = _extends({}, _this.keyDownHandlers, {
        Home: function Home(event) {
          var _this4 = this;
          var _this$getState3 = this.getState(),
            isOpen = _this$getState3.isOpen;
          if (!isOpen) {
            return;
          }
          event.preventDefault();
          var itemCount = this.getItemCount();
          if (itemCount <= 0 || !isOpen) {
            return;
          }

          // get next non-disabled starting downwards from 0 if that's disabled.
          var newHighlightedIndex = getNextNonDisabledIndex(1, 0, itemCount, function (index) {
            return _this4.getItemNodeFromIndex(index);
          }, false);
          this.setHighlightedIndex(newHighlightedIndex, {
            type: keyDownHome
          });
        },
        End: function End(event) {
          var _this5 = this;
          var _this$getState4 = this.getState(),
            isOpen = _this$getState4.isOpen;
          if (!isOpen) {
            return;
          }
          event.preventDefault();
          var itemCount = this.getItemCount();
          if (itemCount <= 0 || !isOpen) {
            return;
          }

          // get next non-disabled starting upwards from last index if that's disabled.
          var newHighlightedIndex = getNextNonDisabledIndex(-1, itemCount - 1, itemCount, function (index) {
            return _this5.getItemNodeFromIndex(index);
          }, false);
          this.setHighlightedIndex(newHighlightedIndex, {
            type: keyDownEnd
          });
        }
      });
      _this.getToggleButtonProps = function (_temp3) {
        var _ref3 = _temp3 === void 0 ? {} : _temp3,
          onClick = _ref3.onClick;
        _ref3.onPress;
        var onKeyDown = _ref3.onKeyDown,
          onKeyUp = _ref3.onKeyUp,
          onBlur = _ref3.onBlur,
          rest = _objectWithoutPropertiesLoose(_ref3, _excluded2$3);
        var _this$getState5 = _this.getState(),
          isOpen = _this$getState5.isOpen;
        var enabledEventHandlers = {
          onClick: callAllEventHandlers(onClick, _this.buttonHandleClick),
          onKeyDown: callAllEventHandlers(onKeyDown, _this.buttonHandleKeyDown),
          onKeyUp: callAllEventHandlers(onKeyUp, _this.buttonHandleKeyUp),
          onBlur: callAllEventHandlers(onBlur, _this.buttonHandleBlur)
        };
        var eventHandlers = rest.disabled ? {} : enabledEventHandlers;
        return _extends({
          type: 'button',
          role: 'button',
          'aria-label': isOpen ? 'close menu' : 'open menu',
          'aria-haspopup': true,
          'data-toggle': true
        }, eventHandlers, rest);
      };
      _this.buttonHandleKeyUp = function (event) {
        // Prevent click event from emitting in Firefox
        event.preventDefault();
      };
      _this.buttonHandleKeyDown = function (event) {
        var key = normalizeArrowKey(event);
        if (_this.buttonKeyDownHandlers[key]) {
          _this.buttonKeyDownHandlers[key].call(_assertThisInitialized(_this), event);
        }
      };
      _this.buttonHandleClick = function (event) {
        event.preventDefault();
        // handle odd case for Safari and Firefox which
        // don't give the button the focus properly.
        /* istanbul ignore if (can't reasonably test this) */
        if (_this.props.environment.document.activeElement === _this.props.environment.document.body) {
          event.target.focus();
        }
        // to simplify testing components that use downshift, we'll not wrap this in a setTimeout
        // if the NODE_ENV is test. With the proper build system, this should be dead code eliminated
        // when building for production and should therefore have no impact on production code.
        {
          // Ensure that toggle of menu occurs after the potential blur event in iOS
          _this.internalSetTimeout(function () {
            return _this.toggleMenu({
              type: clickButton
            });
          });
        }
      };
      _this.buttonHandleBlur = function (event) {
        var blurTarget = event.target; // Save blur target for comparison with activeElement later
        // Need setTimeout, so that when the user presses Tab, the activeElement is the next focused element, not body element
        _this.internalSetTimeout(function () {
          if (!_this.isMouseDown && (_this.props.environment.document.activeElement == null || _this.props.environment.document.activeElement.id !== _this.inputId) && _this.props.environment.document.activeElement !== blurTarget // Do nothing if we refocus the same element again (to solve issue in Safari on iOS)
          ) {
            _this.reset({
              type: blurButton
            });
          }
        });
      };
      //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ BUTTON
      /////////////////////////////// LABEL
      _this.getLabelProps = function (props) {
        return _extends({
          htmlFor: _this.inputId,
          id: _this.labelId
        }, props);
      };
      //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ LABEL
      /////////////////////////////// INPUT
      _this.getInputProps = function (_temp4) {
        var _ref4 = _temp4 === void 0 ? {} : _temp4,
          onKeyDown = _ref4.onKeyDown,
          onBlur = _ref4.onBlur,
          onChange = _ref4.onChange,
          onInput = _ref4.onInput;
        _ref4.onChangeText;
        var rest = _objectWithoutPropertiesLoose(_ref4, _excluded3$2);
        var onChangeKey;
        var eventHandlers = {};

        /* istanbul ignore next (preact) */
        {
          onChangeKey = 'onChange';
        }
        var _this$getState6 = _this.getState(),
          inputValue = _this$getState6.inputValue,
          isOpen = _this$getState6.isOpen,
          highlightedIndex = _this$getState6.highlightedIndex;
        if (!rest.disabled) {
          var _eventHandlers;
          eventHandlers = (_eventHandlers = {}, _eventHandlers[onChangeKey] = callAllEventHandlers(onChange, onInput, _this.inputHandleChange), _eventHandlers.onKeyDown = callAllEventHandlers(onKeyDown, _this.inputHandleKeyDown), _eventHandlers.onBlur = callAllEventHandlers(onBlur, _this.inputHandleBlur), _eventHandlers);
        }
        return _extends({
          'aria-autocomplete': 'list',
          'aria-activedescendant': isOpen && typeof highlightedIndex === 'number' && highlightedIndex >= 0 ? _this.getItemId(highlightedIndex) : null,
          'aria-controls': isOpen ? _this.menuId : null,
          'aria-labelledby': rest && rest['aria-label'] ? undefined : _this.labelId,
          // https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion
          // revert back since autocomplete="nope" is ignored on latest Chrome and Opera
          autoComplete: 'off',
          value: inputValue,
          id: _this.inputId
        }, eventHandlers, rest);
      };
      _this.inputHandleKeyDown = function (event) {
        var key = normalizeArrowKey(event);
        if (key && _this.inputKeyDownHandlers[key]) {
          _this.inputKeyDownHandlers[key].call(_assertThisInitialized(_this), event);
        }
      };
      _this.inputHandleChange = function (event) {
        _this.internalSetState({
          type: changeInput,
          isOpen: true,
          inputValue: event.target.value,
          highlightedIndex: _this.props.defaultHighlightedIndex
        });
      };
      _this.inputHandleBlur = function () {
        // Need setTimeout, so that when the user presses Tab, the activeElement is the next focused element, not the body element
        _this.internalSetTimeout(function () {
          var downshiftButtonIsActive = _this.props.environment.document && !!_this.props.environment.document.activeElement && !!_this.props.environment.document.activeElement.dataset && _this.props.environment.document.activeElement.dataset.toggle && _this._rootNode && _this._rootNode.contains(_this.props.environment.document.activeElement);
          if (!_this.isMouseDown && !downshiftButtonIsActive) {
            _this.reset({
              type: blurInput
            });
          }
        });
      };
      //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ INPUT
      /////////////////////////////// MENU
      _this.menuRef = function (node) {
        _this._menuNode = node;
      };
      _this.getMenuProps = function (_temp5, _temp6) {
        var _extends3;
        var _ref5 = _temp5 === void 0 ? {} : _temp5,
          _ref5$refKey = _ref5.refKey,
          refKey = _ref5$refKey === void 0 ? 'ref' : _ref5$refKey,
          ref = _ref5.ref,
          props = _objectWithoutPropertiesLoose(_ref5, _excluded4$1);
        var _ref6 = _temp6 === void 0 ? {} : _temp6,
          _ref6$suppressRefErro = _ref6.suppressRefError,
          suppressRefError = _ref6$suppressRefErro === void 0 ? false : _ref6$suppressRefErro;
        _this.getMenuProps.called = true;
        _this.getMenuProps.refKey = refKey;
        _this.getMenuProps.suppressRefError = suppressRefError;
        return _extends((_extends3 = {}, _extends3[refKey] = handleRefs(ref, _this.menuRef), _extends3.role = 'listbox', _extends3['aria-labelledby'] = props && props['aria-label'] ? null : _this.labelId, _extends3.id = _this.menuId, _extends3), props);
      };
      //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ MENU
      /////////////////////////////// ITEM
      _this.getItemProps = function (_temp7) {
        var _enabledEventHandlers;
        var _ref7 = _temp7 === void 0 ? {} : _temp7,
          onMouseMove = _ref7.onMouseMove,
          onMouseDown = _ref7.onMouseDown,
          onClick = _ref7.onClick;
        _ref7.onPress;
        var index = _ref7.index,
          _ref7$item = _ref7.item,
          item = _ref7$item === void 0 ? requiredProp('getItemProps', 'item') : _ref7$item,
          rest = _objectWithoutPropertiesLoose(_ref7, _excluded5);
        if (index === undefined) {
          _this.items.push(item);
          index = _this.items.indexOf(item);
        } else {
          _this.items[index] = item;
        }
        var onSelectKey = 'onClick';
        var customClickHandler = onClick;
        var enabledEventHandlers = (_enabledEventHandlers = {
          // onMouseMove is used over onMouseEnter here. onMouseMove
          // is only triggered on actual mouse movement while onMouseEnter
          // can fire on DOM changes, interrupting keyboard navigation
          onMouseMove: callAllEventHandlers(onMouseMove, function () {
            if (index === _this.getState().highlightedIndex) {
              return;
            }
            _this.setHighlightedIndex(index, {
              type: itemMouseEnter
            });

            // We never want to manually scroll when changing state based
            // on `onMouseMove` because we will be moving the element out
            // from under the user which is currently scrolling/moving the
            // cursor
            _this.avoidScrolling = true;
            _this.internalSetTimeout(function () {
              return _this.avoidScrolling = false;
            }, 250);
          }),
          onMouseDown: callAllEventHandlers(onMouseDown, function (event) {
            // This prevents the activeElement from being changed
            // to the item so it can remain with the current activeElement
            // which is a more common use case.
            event.preventDefault();
          })
        }, _enabledEventHandlers[onSelectKey] = callAllEventHandlers(customClickHandler, function () {
          _this.selectItemAtIndex(index, {
            type: clickItem
          });
        }), _enabledEventHandlers);

        // Passing down the onMouseDown handler to prevent redirect
        // of the activeElement if clicking on disabled items
        var eventHandlers = rest.disabled ? {
          onMouseDown: enabledEventHandlers.onMouseDown
        } : enabledEventHandlers;
        return _extends({
          id: _this.getItemId(index),
          role: 'option',
          'aria-selected': _this.getState().highlightedIndex === index
        }, eventHandlers, rest);
      };
      //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ ITEM
      _this.clearItems = function () {
        _this.items = [];
      };
      _this.reset = function (otherStateToSet, cb) {
        if (otherStateToSet === void 0) {
          otherStateToSet = {};
        }
        otherStateToSet = pickState(otherStateToSet);
        _this.internalSetState(function (_ref8) {
          var selectedItem = _ref8.selectedItem;
          return _extends({
            isOpen: _this.props.defaultIsOpen,
            highlightedIndex: _this.props.defaultHighlightedIndex,
            inputValue: _this.props.itemToString(selectedItem)
          }, otherStateToSet);
        }, cb);
      };
      _this.toggleMenu = function (otherStateToSet, cb) {
        if (otherStateToSet === void 0) {
          otherStateToSet = {};
        }
        otherStateToSet = pickState(otherStateToSet);
        _this.internalSetState(function (_ref9) {
          var isOpen = _ref9.isOpen;
          return _extends({
            isOpen: !isOpen
          }, isOpen && {
            highlightedIndex: _this.props.defaultHighlightedIndex
          }, otherStateToSet);
        }, function () {
          var _this$getState7 = _this.getState(),
            isOpen = _this$getState7.isOpen,
            highlightedIndex = _this$getState7.highlightedIndex;
          if (isOpen) {
            if (_this.getItemCount() > 0 && typeof highlightedIndex === 'number') {
              _this.setHighlightedIndex(highlightedIndex, otherStateToSet);
            }
          }
          cbToCb(cb)();
        });
      };
      _this.openMenu = function (cb) {
        _this.internalSetState({
          isOpen: true
        }, cb);
      };
      _this.closeMenu = function (cb) {
        _this.internalSetState({
          isOpen: false
        }, cb);
      };
      _this.updateStatus = debounce$1(function () {
        var state = _this.getState();
        var item = _this.items[state.highlightedIndex];
        var resultCount = _this.getItemCount();
        var status = _this.props.getA11yStatusMessage(_extends({
          itemToString: _this.props.itemToString,
          previousResultCount: _this.previousResultCount,
          resultCount: resultCount,
          highlightedItem: item
        }, state));
        _this.previousResultCount = resultCount;
        setStatus(status, _this.props.environment.document);
      }, 200);
      var _this$props = _this.props,
        defaultHighlightedIndex = _this$props.defaultHighlightedIndex,
        _this$props$initialHi = _this$props.initialHighlightedIndex,
        _highlightedIndex = _this$props$initialHi === void 0 ? defaultHighlightedIndex : _this$props$initialHi,
        defaultIsOpen = _this$props.defaultIsOpen,
        _this$props$initialIs = _this$props.initialIsOpen,
        _isOpen = _this$props$initialIs === void 0 ? defaultIsOpen : _this$props$initialIs,
        _this$props$initialIn = _this$props.initialInputValue,
        _inputValue = _this$props$initialIn === void 0 ? '' : _this$props$initialIn,
        _this$props$initialSe = _this$props.initialSelectedItem,
        _selectedItem = _this$props$initialSe === void 0 ? null : _this$props$initialSe;
      var _state = _this.getState({
        highlightedIndex: _highlightedIndex,
        isOpen: _isOpen,
        inputValue: _inputValue,
        selectedItem: _selectedItem
      });
      if (_state.selectedItem != null && _this.props.initialInputValue === undefined) {
        _state.inputValue = _this.props.itemToString(_state.selectedItem);
      }
      _this.state = _state;
      return _this;
    }
    var _proto = Downshift.prototype;
    /**
     * Clear all running timeouts
     */
    _proto.internalClearTimeouts = function internalClearTimeouts() {
      this.timeoutIds.forEach(function (id) {
        clearTimeout(id);
      });
      this.timeoutIds = [];
    }

    /**
     * Gets the state based on internal state or props
     * If a state value is passed via props, then that
     * is the value given, otherwise it's retrieved from
     * stateToMerge
     *
     * @param {Object} stateToMerge defaults to this.state
     * @return {Object} the state
     */;
    _proto.getState = function getState$1(stateToMerge) {
      if (stateToMerge === void 0) {
        stateToMerge = this.state;
      }
      return getState(stateToMerge, this.props);
    };
    _proto.getItemCount = function getItemCount() {
      // things read better this way. They're in priority order:
      // 1. `this.itemCount`
      // 2. `this.props.itemCount`
      // 3. `this.items.length`
      var itemCount = this.items.length;
      if (this.itemCount != null) {
        itemCount = this.itemCount;
      } else if (this.props.itemCount !== undefined) {
        itemCount = this.props.itemCount;
      }
      return itemCount;
    };
    _proto.getItemNodeFromIndex = function getItemNodeFromIndex(index) {
      return this.props.environment.document.getElementById(this.getItemId(index));
    };
    _proto.scrollHighlightedItemIntoView = function scrollHighlightedItemIntoView() {
      /* istanbul ignore else (react-native) */
      {
        var node = this.getItemNodeFromIndex(this.getState().highlightedIndex);
        this.props.scrollIntoView(node, this._menuNode);
      }
    };
    _proto.moveHighlightedIndex = function moveHighlightedIndex(amount, otherStateToSet) {
      var _this6 = this;
      var itemCount = this.getItemCount();
      var _this$getState8 = this.getState(),
        highlightedIndex = _this$getState8.highlightedIndex;
      if (itemCount > 0) {
        var nextHighlightedIndex = getNextWrappingIndex(amount, highlightedIndex, itemCount, function (index) {
          return _this6.getItemNodeFromIndex(index);
        });
        this.setHighlightedIndex(nextHighlightedIndex, otherStateToSet);
      }
    };
    _proto.getStateAndHelpers = function getStateAndHelpers() {
      var _this$getState9 = this.getState(),
        highlightedIndex = _this$getState9.highlightedIndex,
        inputValue = _this$getState9.inputValue,
        selectedItem = _this$getState9.selectedItem,
        isOpen = _this$getState9.isOpen;
      var itemToString = this.props.itemToString;
      var id = this.id;
      var getRootProps = this.getRootProps,
        getToggleButtonProps = this.getToggleButtonProps,
        getLabelProps = this.getLabelProps,
        getMenuProps = this.getMenuProps,
        getInputProps = this.getInputProps,
        getItemProps = this.getItemProps,
        openMenu = this.openMenu,
        closeMenu = this.closeMenu,
        toggleMenu = this.toggleMenu,
        selectItem = this.selectItem,
        selectItemAtIndex = this.selectItemAtIndex,
        selectHighlightedItem = this.selectHighlightedItem,
        setHighlightedIndex = this.setHighlightedIndex,
        clearSelection = this.clearSelection,
        clearItems = this.clearItems,
        reset = this.reset,
        setItemCount = this.setItemCount,
        unsetItemCount = this.unsetItemCount,
        setState = this.internalSetState;
      return {
        // prop getters
        getRootProps: getRootProps,
        getToggleButtonProps: getToggleButtonProps,
        getLabelProps: getLabelProps,
        getMenuProps: getMenuProps,
        getInputProps: getInputProps,
        getItemProps: getItemProps,
        // actions
        reset: reset,
        openMenu: openMenu,
        closeMenu: closeMenu,
        toggleMenu: toggleMenu,
        selectItem: selectItem,
        selectItemAtIndex: selectItemAtIndex,
        selectHighlightedItem: selectHighlightedItem,
        setHighlightedIndex: setHighlightedIndex,
        clearSelection: clearSelection,
        clearItems: clearItems,
        setItemCount: setItemCount,
        unsetItemCount: unsetItemCount,
        setState: setState,
        // props
        itemToString: itemToString,
        // derived
        id: id,
        // state
        highlightedIndex: highlightedIndex,
        inputValue: inputValue,
        isOpen: isOpen,
        selectedItem: selectedItem
      };
    };
    _proto.componentDidMount = function componentDidMount() {
      var _this7 = this;
      /* istanbul ignore if (react-native) */
      if (this.getMenuProps.called && !this.getMenuProps.suppressRefError) {
        validateGetMenuPropsCalledCorrectly(this._menuNode, this.getMenuProps);
      }

      /* istanbul ignore if (react-native) */
      {
        // this.isMouseDown helps us track whether the mouse is currently held down.
        // This is useful when the user clicks on an item in the list, but holds the mouse
        // down long enough for the list to disappear (because the blur event fires on the input)
        // this.isMouseDown is used in the blur handler on the input to determine whether the blur event should
        // trigger hiding the menu.
        var onMouseDown = function onMouseDown() {
          _this7.isMouseDown = true;
        };
        var onMouseUp = function onMouseUp(event) {
          _this7.isMouseDown = false;
          // if the target element or the activeElement is within a downshift node
          // then we don't want to reset downshift
          var contextWithinDownshift = targetWithinDownshift(event.target, [_this7._rootNode, _this7._menuNode], _this7.props.environment);
          if (!contextWithinDownshift && _this7.getState().isOpen) {
            _this7.reset({
              type: mouseUp
            }, function () {
              return _this7.props.onOuterClick(_this7.getStateAndHelpers());
            });
          }
        };
        // Touching an element in iOS gives focus and hover states, but touching out of
        // the element will remove hover, and persist the focus state, resulting in the
        // blur event not being triggered.
        // this.isTouchMove helps us track whether the user is tapping or swiping on a touch screen.
        // If the user taps outside of Downshift, the component should be reset,
        // but not if the user is swiping
        var onTouchStart = function onTouchStart() {
          _this7.isTouchMove = false;
        };
        var onTouchMove = function onTouchMove() {
          _this7.isTouchMove = true;
        };
        var onTouchEnd = function onTouchEnd(event) {
          var contextWithinDownshift = targetWithinDownshift(event.target, [_this7._rootNode, _this7._menuNode], _this7.props.environment, false);
          if (!_this7.isTouchMove && !contextWithinDownshift && _this7.getState().isOpen) {
            _this7.reset({
              type: touchEnd
            }, function () {
              return _this7.props.onOuterClick(_this7.getStateAndHelpers());
            });
          }
        };
        var environment = this.props.environment;
        environment.addEventListener('mousedown', onMouseDown);
        environment.addEventListener('mouseup', onMouseUp);
        environment.addEventListener('touchstart', onTouchStart);
        environment.addEventListener('touchmove', onTouchMove);
        environment.addEventListener('touchend', onTouchEnd);
        this.cleanup = function () {
          _this7.internalClearTimeouts();
          _this7.updateStatus.cancel();
          environment.removeEventListener('mousedown', onMouseDown);
          environment.removeEventListener('mouseup', onMouseUp);
          environment.removeEventListener('touchstart', onTouchStart);
          environment.removeEventListener('touchmove', onTouchMove);
          environment.removeEventListener('touchend', onTouchEnd);
        };
      }
    };
    _proto.shouldScroll = function shouldScroll(prevState, prevProps) {
      var _ref10 = this.props.highlightedIndex === undefined ? this.getState() : this.props,
        currentHighlightedIndex = _ref10.highlightedIndex;
      var _ref11 = prevProps.highlightedIndex === undefined ? prevState : prevProps,
        prevHighlightedIndex = _ref11.highlightedIndex;
      var scrollWhenOpen = currentHighlightedIndex && this.getState().isOpen && !prevState.isOpen;
      var scrollWhenNavigating = currentHighlightedIndex !== prevHighlightedIndex;
      return scrollWhenOpen || scrollWhenNavigating;
    };
    _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
      {
        validateControlledUnchanged(this.state, prevProps, this.props);
        /* istanbul ignore if (react-native) */
        if (this.getMenuProps.called && !this.getMenuProps.suppressRefError) {
          validateGetMenuPropsCalledCorrectly(this._menuNode, this.getMenuProps);
        }
      }
      if (isControlledProp(this.props, 'selectedItem') && this.props.selectedItemChanged(prevProps.selectedItem, this.props.selectedItem)) {
        this.internalSetState({
          type: controlledPropUpdatedSelectedItem,
          inputValue: this.props.itemToString(this.props.selectedItem)
        });
      }
      if (!this.avoidScrolling && this.shouldScroll(prevState, prevProps)) {
        this.scrollHighlightedItemIntoView();
      }

      /* istanbul ignore else (react-native) */
      {
        this.updateStatus();
      }
    };
    _proto.componentWillUnmount = function componentWillUnmount() {
      this.cleanup(); // avoids memory leak
    };
    _proto.render = function render() {
      var children = unwrapArray(this.props.children, noop);
      // because the items are rerendered every time we call the children
      // we clear this out each render and it will be populated again as
      // getItemProps is called.
      this.clearItems();
      // we reset this so we know whether the user calls getRootProps during
      // this render. If they do then we don't need to do anything,
      // if they don't then we need to clone the element they return and
      // apply the props for them.
      this.getRootProps.called = false;
      this.getRootProps.refKey = undefined;
      this.getRootProps.suppressRefError = undefined;
      // we do something similar for getMenuProps
      this.getMenuProps.called = false;
      this.getMenuProps.refKey = undefined;
      this.getMenuProps.suppressRefError = undefined;
      // we do something similar for getLabelProps
      this.getLabelProps.called = false;
      // and something similar for getInputProps
      this.getInputProps.called = false;
      var element = unwrapArray(children(this.getStateAndHelpers()));
      if (!element) {
        return null;
      }
      if (this.getRootProps.called || this.props.suppressRefError) {
        if (!this.getRootProps.suppressRefError && !this.props.suppressRefError) {
          validateGetRootPropsCalledCorrectly(element, this.getRootProps);
        }
        return element;
      } else if (isDOMElement(element)) {
        // they didn't apply the root props, but we can clone
        // this and apply the props ourselves
        return /*#__PURE__*/react.cloneElement(element, this.getRootProps(getElementProps(element)));
      }

      /* istanbul ignore else */
      {
        // they didn't apply the root props, but they need to
        // otherwise we can't query around the autocomplete

        throw new Error('downshift: If you return a non-DOM element, you must apply the getRootProps function');
      }
    };
    return Downshift;
  }(react.Component);
  Downshift.defaultProps = {
    defaultHighlightedIndex: null,
    defaultIsOpen: false,
    getA11yStatusMessage: getA11yStatusMessage$1,
    itemToString: function itemToString(i) {
      if (i == null) {
        return '';
      }
      if (isPlainObject(i) && !i.hasOwnProperty('toString')) {
        // eslint-disable-next-line no-console
        console.warn('downshift: An object was passed to the default implementation of `itemToString`. You should probably provide your own `itemToString` implementation. Please refer to the `itemToString` API documentation.', 'The object that was passed:', i);
      }
      return String(i);
    },
    onStateChange: noop,
    onInputValueChange: noop,
    onUserAction: noop,
    onChange: noop,
    onSelect: noop,
    onOuterClick: noop,
    selectedItemChanged: function selectedItemChanged(prevItem, item) {
      return prevItem !== item;
    },
    environment: /* istanbul ignore next (ssr) */
    typeof window === 'undefined' ? {} : window,
    stateReducer: function stateReducer(state, stateToSet) {
      return stateToSet;
    },
    suppressRefError: false,
    scrollIntoView: scrollIntoView
  };
  Downshift.stateChangeTypes = stateChangeTypes$3;
  return Downshift;
}();
Downshift.propTypes = {
  children: PropTypes.func,
  defaultHighlightedIndex: PropTypes.number,
  defaultIsOpen: PropTypes.bool,
  initialHighlightedIndex: PropTypes.number,
  initialSelectedItem: PropTypes.any,
  initialInputValue: PropTypes.string,
  initialIsOpen: PropTypes.bool,
  getA11yStatusMessage: PropTypes.func,
  itemToString: PropTypes.func,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  onStateChange: PropTypes.func,
  onInputValueChange: PropTypes.func,
  onUserAction: PropTypes.func,
  onOuterClick: PropTypes.func,
  selectedItemChanged: PropTypes.func,
  stateReducer: PropTypes.func,
  itemCount: PropTypes.number,
  id: PropTypes.string,
  environment: PropTypes.shape({
    addEventListener: PropTypes.func,
    removeEventListener: PropTypes.func,
    document: PropTypes.shape({
      getElementById: PropTypes.func,
      activeElement: PropTypes.any,
      body: PropTypes.any
    })
  }),
  suppressRefError: PropTypes.bool,
  scrollIntoView: PropTypes.func,
  // things we keep in state for uncontrolled components
  // but can accept as props for controlled components
  /* eslint-disable react/no-unused-prop-types */
  selectedItem: PropTypes.any,
  isOpen: PropTypes.bool,
  inputValue: PropTypes.string,
  highlightedIndex: PropTypes.number,
  labelId: PropTypes.string,
  inputId: PropTypes.string,
  menuId: PropTypes.string,
  getItemId: PropTypes.func
  /* eslint-enable react/no-unused-prop-types */
} ;
function validateGetMenuPropsCalledCorrectly(node, _ref12) {
  var refKey = _ref12.refKey;
  if (!node) {
    // eslint-disable-next-line no-console
    console.error("downshift: The ref prop \"" + refKey + "\" from getMenuProps was not applied correctly on your menu element.");
  }
}
function validateGetRootPropsCalledCorrectly(element, _ref13) {
  var refKey = _ref13.refKey;
  var refKeySpecified = refKey !== 'ref';
  var isComposite = !isDOMElement(element);
  if (isComposite && !refKeySpecified && !reactIsExports.isForwardRef(element)) {
    // eslint-disable-next-line no-console
    console.error('downshift: You returned a non-DOM element. You must specify a refKey in getRootProps');
  } else if (!isComposite && refKeySpecified) {
    // eslint-disable-next-line no-console
    console.error("downshift: You returned a DOM element. You should not specify a refKey in getRootProps. You specified \"" + refKey + "\"");
  }
  if (!reactIsExports.isForwardRef(element) && !getElementProps(element)[refKey]) {
    // eslint-disable-next-line no-console
    console.error("downshift: You must apply the ref prop \"" + refKey + "\" from getRootProps onto your root element.");
  }
}
var _excluded$3 = ["isInitialMount", "highlightedIndex", "items", "environment"];
var dropdownDefaultStateValues = {
  highlightedIndex: -1,
  isOpen: false,
  selectedItem: null,
  inputValue: ''
};
function callOnChangeProps(action, state, newState) {
  var props = action.props,
    type = action.type;
  var changes = {};
  Object.keys(state).forEach(function (key) {
    invokeOnChangeHandler(key, action, state, newState);
    if (newState[key] !== state[key]) {
      changes[key] = newState[key];
    }
  });
  if (props.onStateChange && Object.keys(changes).length) {
    props.onStateChange(_extends({
      type: type
    }, changes));
  }
}
function invokeOnChangeHandler(key, action, state, newState) {
  var props = action.props,
    type = action.type;
  var handler = "on" + capitalizeString(key) + "Change";
  if (props[handler] && newState[key] !== undefined && newState[key] !== state[key]) {
    props[handler](_extends({
      type: type
    }, newState));
  }
}

/**
 * Default state reducer that returns the changes.
 *
 * @param {Object} s state.
 * @param {Object} a action with changes.
 * @returns {Object} changes.
 */
function stateReducer(s, a) {
  return a.changes;
}

/**
 * Returns a message to be added to aria-live region when item is selected.
 *
 * @param {Object} selectionParameters Parameters required to build the message.
 * @returns {string} The a11y message.
 */
function getA11ySelectionMessage(selectionParameters) {
  var selectedItem = selectionParameters.selectedItem,
    itemToStringLocal = selectionParameters.itemToString;
  return selectedItem ? itemToStringLocal(selectedItem) + " has been selected." : '';
}

/**
 * Debounced call for updating the a11y message.
 */
var updateA11yStatus = debounce$1(function (getA11yMessage, document) {
  setStatus(getA11yMessage(), document);
}, 200);

// istanbul ignore next
var useIsomorphicLayoutEffect = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined' ? react.useLayoutEffect : react.useEffect;
function useElementIds(_ref) {
  var _ref$id = _ref.id,
    id = _ref$id === void 0 ? "downshift-" + generateId() : _ref$id,
    labelId = _ref.labelId,
    menuId = _ref.menuId,
    getItemId = _ref.getItemId,
    toggleButtonId = _ref.toggleButtonId,
    inputId = _ref.inputId;
  var elementIdsRef = react.useRef({
    labelId: labelId || id + "-label",
    menuId: menuId || id + "-menu",
    getItemId: getItemId || function (index) {
      return id + "-item-" + index;
    },
    toggleButtonId: toggleButtonId || id + "-toggle-button",
    inputId: inputId || id + "-input"
  });
  return elementIdsRef.current;
}
function getItemAndIndex(itemProp, indexProp, items, errorMessage) {
  var item, index;
  if (itemProp === undefined) {
    if (indexProp === undefined) {
      throw new Error(errorMessage);
    }
    item = items[indexProp];
    index = indexProp;
  } else {
    index = indexProp === undefined ? items.indexOf(itemProp) : indexProp;
    item = itemProp;
  }
  return [item, index];
}
function itemToString(item) {
  return item ? String(item) : '';
}
function capitalizeString(string) {
  return "" + string.slice(0, 1).toUpperCase() + string.slice(1);
}
function useLatestRef(val) {
  var ref = react.useRef(val);
  // technically this is not "concurrent mode safe" because we're manipulating
  // the value during render (so it's not idempotent). However, the places this
  // hook is used is to support memoizing callbacks which will be called
  // *during* render, so we need the latest values *during* render.
  // If not for this, then we'd probably want to use useLayoutEffect instead.
  ref.current = val;
  return ref;
}

/**
 * Computes the controlled state using a the previous state, props,
 * two reducers, one from downshift and an optional one from the user.
 * Also calls the onChange handlers for state values that have changed.
 *
 * @param {Function} reducer Reducer function from downshift.
 * @param {Object} initialState Initial state of the hook.
 * @param {Object} props The hook props.
 * @returns {Array} An array with the state and an action dispatcher.
 */
function useEnhancedReducer(reducer, initialState, props) {
  var prevStateRef = react.useRef();
  var actionRef = react.useRef();
  var enhancedReducer = react.useCallback(function (state, action) {
    actionRef.current = action;
    state = getState(state, action.props);
    var changes = reducer(state, action);
    var newState = action.props.stateReducer(state, _extends({}, action, {
      changes: changes
    }));
    return newState;
  }, [reducer]);
  var _useReducer = react.useReducer(enhancedReducer, initialState),
    state = _useReducer[0],
    dispatch = _useReducer[1];
  var propsRef = useLatestRef(props);
  var dispatchWithProps = react.useCallback(function (action) {
    return dispatch(_extends({
      props: propsRef.current
    }, action));
  }, [propsRef]);
  var action = actionRef.current;
  react.useEffect(function () {
    if (action && prevStateRef.current && prevStateRef.current !== state) {
      callOnChangeProps(action, getState(prevStateRef.current, action.props), state);
    }
    prevStateRef.current = state;
  }, [state, props, action]);
  return [state, dispatchWithProps];
}
var defaultProps$3 = {
  itemToString: itemToString,
  stateReducer: stateReducer,
  getA11ySelectionMessage: getA11ySelectionMessage,
  scrollIntoView: scrollIntoView,
  environment: /* istanbul ignore next (ssr) */
  typeof window === 'undefined' ? {} : window
};
function getDefaultValue$1(props, propKey, defaultStateValues) {
  if (defaultStateValues === void 0) {
    defaultStateValues = dropdownDefaultStateValues;
  }
  var defaultValue = props["default" + capitalizeString(propKey)];
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  return defaultStateValues[propKey];
}
function getInitialValue$1(props, propKey, defaultStateValues) {
  if (defaultStateValues === void 0) {
    defaultStateValues = dropdownDefaultStateValues;
  }
  var value = props[propKey];
  if (value !== undefined) {
    return value;
  }
  var initialValue = props["initial" + capitalizeString(propKey)];
  if (initialValue !== undefined) {
    return initialValue;
  }
  return getDefaultValue$1(props, propKey, defaultStateValues);
}
function getInitialState$2(props) {
  var selectedItem = getInitialValue$1(props, 'selectedItem');
  var isOpen = getInitialValue$1(props, 'isOpen');
  var highlightedIndex = getInitialValue$1(props, 'highlightedIndex');
  var inputValue = getInitialValue$1(props, 'inputValue');
  return {
    highlightedIndex: highlightedIndex < 0 && selectedItem && isOpen ? props.items.indexOf(selectedItem) : highlightedIndex,
    isOpen: isOpen,
    selectedItem: selectedItem,
    inputValue: inputValue
  };
}
function getHighlightedIndexOnOpen(props, state, offset) {
  var items = props.items,
    initialHighlightedIndex = props.initialHighlightedIndex,
    defaultHighlightedIndex = props.defaultHighlightedIndex;
  var selectedItem = state.selectedItem,
    highlightedIndex = state.highlightedIndex;
  if (items.length === 0) {
    return -1;
  }

  // initialHighlightedIndex will give value to highlightedIndex on initial state only.
  if (initialHighlightedIndex !== undefined && highlightedIndex === initialHighlightedIndex) {
    return initialHighlightedIndex;
  }
  if (defaultHighlightedIndex !== undefined) {
    return defaultHighlightedIndex;
  }
  if (selectedItem) {
    return items.indexOf(selectedItem);
  }
  if (offset === 0) {
    return -1;
  }
  return offset < 0 ? items.length - 1 : 0;
}

/**
 * Reuse the movement tracking of mouse and touch events.
 *
 * @param {boolean} isOpen Whether the dropdown is open or not.
 * @param {Array<Object>} downshiftElementRefs Downshift element refs to track movement (toggleButton, menu etc.)
 * @param {Object} environment Environment where component/hook exists.
 * @param {Function} handleBlur Handler on blur from mouse or touch.
 * @returns {Object} Ref containing whether mouseDown or touchMove event is happening
 */
function useMouseAndTouchTracker(isOpen, downshiftElementRefs, environment, handleBlur) {
  var mouseAndTouchTrackersRef = react.useRef({
    isMouseDown: false,
    isTouchMove: false
  });
  react.useEffect(function () {
    if ((environment == null ? void 0 : environment.addEventListener) == null) {
      return;
    }

    // The same strategy for checking if a click occurred inside or outside downshift
    // as in downshift.js.
    var onMouseDown = function onMouseDown() {
      mouseAndTouchTrackersRef.current.isMouseDown = true;
    };
    var onMouseUp = function onMouseUp(event) {
      mouseAndTouchTrackersRef.current.isMouseDown = false;
      if (isOpen && !targetWithinDownshift(event.target, downshiftElementRefs.map(function (ref) {
        return ref.current;
      }), environment)) {
        handleBlur();
      }
    };
    var onTouchStart = function onTouchStart() {
      mouseAndTouchTrackersRef.current.isTouchMove = false;
    };
    var onTouchMove = function onTouchMove() {
      mouseAndTouchTrackersRef.current.isTouchMove = true;
    };
    var onTouchEnd = function onTouchEnd(event) {
      if (isOpen && !mouseAndTouchTrackersRef.current.isTouchMove && !targetWithinDownshift(event.target, downshiftElementRefs.map(function (ref) {
        return ref.current;
      }), environment, false)) {
        handleBlur();
      }
    };
    environment.addEventListener('mousedown', onMouseDown);
    environment.addEventListener('mouseup', onMouseUp);
    environment.addEventListener('touchstart', onTouchStart);
    environment.addEventListener('touchmove', onTouchMove);
    environment.addEventListener('touchend', onTouchEnd);

    // eslint-disable-next-line consistent-return
    return function cleanup() {
      environment.removeEventListener('mousedown', onMouseDown);
      environment.removeEventListener('mouseup', onMouseUp);
      environment.removeEventListener('touchstart', onTouchStart);
      environment.removeEventListener('touchmove', onTouchMove);
      environment.removeEventListener('touchend', onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, environment]);
  return mouseAndTouchTrackersRef;
}

/* istanbul ignore next */
// eslint-disable-next-line import/no-mutable-exports
var useGetterPropsCalledChecker = function useGetterPropsCalledChecker() {
  return noop;
};
/**
 * Custom hook that checks if getter props are called correctly.
 *
 * @param  {...any} propKeys Getter prop names to be handled.
 * @returns {Function} Setter function called inside getter props to set call information.
 */
/* istanbul ignore next */
{
  useGetterPropsCalledChecker = function useGetterPropsCalledChecker() {
    var isInitialMountRef = react.useRef(true);
    for (var _len = arguments.length, propKeys = new Array(_len), _key = 0; _key < _len; _key++) {
      propKeys[_key] = arguments[_key];
    }
    var getterPropsCalledRef = react.useRef(propKeys.reduce(function (acc, propKey) {
      acc[propKey] = {};
      return acc;
    }, {}));
    react.useEffect(function () {
      Object.keys(getterPropsCalledRef.current).forEach(function (propKey) {
        var propCallInfo = getterPropsCalledRef.current[propKey];
        if (isInitialMountRef.current) {
          if (!Object.keys(propCallInfo).length) {
            // eslint-disable-next-line no-console
            console.error("downshift: You forgot to call the " + propKey + " getter function on your component / element.");
            return;
          }
        }
        var suppressRefError = propCallInfo.suppressRefError,
          refKey = propCallInfo.refKey,
          elementRef = propCallInfo.elementRef;
        if ((!elementRef || !elementRef.current) && !suppressRefError) {
          // eslint-disable-next-line no-console
          console.error("downshift: The ref prop \"" + refKey + "\" from " + propKey + " was not applied correctly on your element.");
        }
      });
      isInitialMountRef.current = false;
    });
    var setGetterPropCallInfo = react.useCallback(function (propKey, suppressRefError, refKey, elementRef) {
      getterPropsCalledRef.current[propKey] = {
        suppressRefError: suppressRefError,
        refKey: refKey,
        elementRef: elementRef
      };
    }, []);
    return setGetterPropCallInfo;
  };
}
function useA11yMessageSetter(getA11yMessage, dependencyArray, _ref2) {
  var isInitialMount = _ref2.isInitialMount,
    highlightedIndex = _ref2.highlightedIndex,
    items = _ref2.items,
    environment = _ref2.environment,
    rest = _objectWithoutPropertiesLoose(_ref2, _excluded$3);
  // Sets a11y status message on changes in state.
  react.useEffect(function () {
    if (isInitialMount || false) {
      return;
    }
    updateA11yStatus(function () {
      return getA11yMessage(_extends({
        highlightedIndex: highlightedIndex,
        highlightedItem: items[highlightedIndex],
        resultCount: items.length
      }, rest));
    }, environment.document);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyArray);
}
function useScrollIntoView(_ref3) {
  var highlightedIndex = _ref3.highlightedIndex,
    isOpen = _ref3.isOpen,
    itemRefs = _ref3.itemRefs,
    getItemNodeFromIndex = _ref3.getItemNodeFromIndex,
    menuElement = _ref3.menuElement,
    scrollIntoViewProp = _ref3.scrollIntoView;
  // used not to scroll on highlight by mouse.
  var shouldScrollRef = react.useRef(true);
  // Scroll on highlighted item if change comes from keyboard.
  useIsomorphicLayoutEffect(function () {
    if (highlightedIndex < 0 || !isOpen || !Object.keys(itemRefs.current).length) {
      return;
    }
    if (shouldScrollRef.current === false) {
      shouldScrollRef.current = true;
    } else {
      scrollIntoViewProp(getItemNodeFromIndex(highlightedIndex), menuElement);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedIndex]);
  return shouldScrollRef;
}

// eslint-disable-next-line import/no-mutable-exports
var useControlPropsValidator = noop;
/* istanbul ignore next */
{
  useControlPropsValidator = function useControlPropsValidator(_ref4) {
    var isInitialMount = _ref4.isInitialMount,
      props = _ref4.props,
      state = _ref4.state;
    // used for checking when props are moving from controlled to uncontrolled.
    var prevPropsRef = react.useRef(props);
    react.useEffect(function () {
      if (isInitialMount) {
        return;
      }
      validateControlledUnchanged(state, prevPropsRef.current, props);
      prevPropsRef.current = props;
    }, [state, props, isInitialMount]);
  };
}

/**
 * Handles selection on Enter / Alt + ArrowUp. Closes the menu and resets the highlighted index, unless there is a highlighted.
 * In that case, selects the item and resets to defaults for open state and highlighted idex.
 * @param {Object} props The useCombobox props.
 * @param {number} highlightedIndex The index from the state.
 * @param {boolean} inputValue Also return the input value for state.
 * @returns The changes for the state.
 */
function getChangesOnSelection(props, highlightedIndex, inputValue) {
  var _props$items;
  if (inputValue === void 0) {
    inputValue = true;
  }
  var shouldSelect = ((_props$items = props.items) == null ? void 0 : _props$items.length) && highlightedIndex >= 0;
  return _extends({
    isOpen: false,
    highlightedIndex: -1
  }, shouldSelect && _extends({
    selectedItem: props.items[highlightedIndex],
    isOpen: getDefaultValue$1(props, 'isOpen'),
    highlightedIndex: getDefaultValue$1(props, 'highlightedIndex')
  }, inputValue && {
    inputValue: props.itemToString(props.items[highlightedIndex])
  }));
}
function downshiftCommonReducer(state, action, stateChangeTypes) {
  var type = action.type,
    props = action.props;
  var changes;
  switch (type) {
    case stateChangeTypes.ItemMouseMove:
      changes = {
        highlightedIndex: action.disabled ? -1 : action.index
      };
      break;
    case stateChangeTypes.MenuMouseLeave:
      changes = {
        highlightedIndex: -1
      };
      break;
    case stateChangeTypes.ToggleButtonClick:
    case stateChangeTypes.FunctionToggleMenu:
      changes = {
        isOpen: !state.isOpen,
        highlightedIndex: state.isOpen ? -1 : getHighlightedIndexOnOpen(props, state, 0)
      };
      break;
    case stateChangeTypes.FunctionOpenMenu:
      changes = {
        isOpen: true,
        highlightedIndex: getHighlightedIndexOnOpen(props, state, 0)
      };
      break;
    case stateChangeTypes.FunctionCloseMenu:
      changes = {
        isOpen: false
      };
      break;
    case stateChangeTypes.FunctionSetHighlightedIndex:
      changes = {
        highlightedIndex: action.highlightedIndex
      };
      break;
    case stateChangeTypes.FunctionSetInputValue:
      changes = {
        inputValue: action.inputValue
      };
      break;
    case stateChangeTypes.FunctionReset:
      changes = {
        highlightedIndex: getDefaultValue$1(props, 'highlightedIndex'),
        isOpen: getDefaultValue$1(props, 'isOpen'),
        selectedItem: getDefaultValue$1(props, 'selectedItem'),
        inputValue: getDefaultValue$1(props, 'inputValue')
      };
      break;
    default:
      throw new Error('Reducer called without proper action type.');
  }
  return _extends({}, state, changes);
}
({
  items: PropTypes.array.isRequired,
  itemToString: PropTypes.func,
  getA11yStatusMessage: PropTypes.func,
  getA11ySelectionMessage: PropTypes.func,
  highlightedIndex: PropTypes.number,
  defaultHighlightedIndex: PropTypes.number,
  initialHighlightedIndex: PropTypes.number,
  isOpen: PropTypes.bool,
  defaultIsOpen: PropTypes.bool,
  initialIsOpen: PropTypes.bool,
  selectedItem: PropTypes.any,
  initialSelectedItem: PropTypes.any,
  defaultSelectedItem: PropTypes.any,
  id: PropTypes.string,
  labelId: PropTypes.string,
  menuId: PropTypes.string,
  getItemId: PropTypes.func,
  toggleButtonId: PropTypes.string,
  stateReducer: PropTypes.func,
  onSelectedItemChange: PropTypes.func,
  onHighlightedIndexChange: PropTypes.func,
  onStateChange: PropTypes.func,
  onIsOpenChange: PropTypes.func,
  environment: PropTypes.shape({
    addEventListener: PropTypes.func,
    removeEventListener: PropTypes.func,
    document: PropTypes.shape({
      getElementById: PropTypes.func,
      activeElement: PropTypes.any,
      body: PropTypes.any
    })
  })
});
/**
 * Default implementation for status message. Only added when menu is open.
 * Will specift if there are results in the list, and if so, how many,
 * and what keys are relevant.
 *
 * @param {Object} param the downshift state and other relevant properties
 * @return {String} the a11y status message
 */
function getA11yStatusMessage(_a) {
  var isOpen = _a.isOpen,
    resultCount = _a.resultCount,
    previousResultCount = _a.previousResultCount;
  if (!isOpen) {
    return '';
  }
  if (!resultCount) {
    return 'No results are available.';
  }
  if (resultCount !== previousResultCount) {
    return "".concat(resultCount, " result").concat(resultCount === 1 ? ' is' : 's are', " available, use up and down arrow keys to navigate. Press Enter or Space Bar keys to select.");
  }
  return '';
}
__assign(__assign({}, defaultProps$3), {
  getA11yStatusMessage: getA11yStatusMessage
});
var InputKeyDownArrowDown = '__input_keydown_arrow_down__' ;
var InputKeyDownArrowUp = '__input_keydown_arrow_up__' ;
var InputKeyDownEscape = '__input_keydown_escape__' ;
var InputKeyDownHome = '__input_keydown_home__' ;
var InputKeyDownEnd = '__input_keydown_end__' ;
var InputKeyDownPageUp = '__input_keydown_page_up__' ;
var InputKeyDownPageDown = '__input_keydown_page_down__' ;
var InputKeyDownEnter = '__input_keydown_enter__' ;
var InputChange = '__input_change__' ;
var InputBlur = '__input_blur__' ;
var InputFocus = '__input_focus__' ;
var MenuMouseLeave = '__menu_mouse_leave__' ;
var ItemMouseMove = '__item_mouse_move__' ;
var ItemClick = '__item_click__' ;
var ToggleButtonClick = '__togglebutton_click__' ;
var FunctionToggleMenu = '__function_toggle_menu__' ;
var FunctionOpenMenu = '__function_open_menu__' ;
var FunctionCloseMenu = '__function_close_menu__' ;
var FunctionSetHighlightedIndex = '__function_set_highlighted_index__' ;
var FunctionSelectItem = '__function_select_item__' ;
var FunctionSetInputValue = '__function_set_input_value__' ;
var FunctionReset$1 = '__function_reset__' ;
var ControlledPropUpdatedSelectedItem = '__controlled_prop_updated_selected_item__' ;
var stateChangeTypes$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  InputKeyDownArrowDown: InputKeyDownArrowDown,
  InputKeyDownArrowUp: InputKeyDownArrowUp,
  InputKeyDownEscape: InputKeyDownEscape,
  InputKeyDownHome: InputKeyDownHome,
  InputKeyDownEnd: InputKeyDownEnd,
  InputKeyDownPageUp: InputKeyDownPageUp,
  InputKeyDownPageDown: InputKeyDownPageDown,
  InputKeyDownEnter: InputKeyDownEnter,
  InputChange: InputChange,
  InputBlur: InputBlur,
  InputFocus: InputFocus,
  MenuMouseLeave: MenuMouseLeave,
  ItemMouseMove: ItemMouseMove,
  ItemClick: ItemClick,
  ToggleButtonClick: ToggleButtonClick,
  FunctionToggleMenu: FunctionToggleMenu,
  FunctionOpenMenu: FunctionOpenMenu,
  FunctionCloseMenu: FunctionCloseMenu,
  FunctionSetHighlightedIndex: FunctionSetHighlightedIndex,
  FunctionSelectItem: FunctionSelectItem,
  FunctionSetInputValue: FunctionSetInputValue,
  FunctionReset: FunctionReset$1,
  ControlledPropUpdatedSelectedItem: ControlledPropUpdatedSelectedItem
});
function getInitialState$1(props) {
  var initialState = getInitialState$2(props);
  var selectedItem = initialState.selectedItem;
  var inputValue = initialState.inputValue;
  if (inputValue === '' && selectedItem && props.defaultInputValue === undefined && props.initialInputValue === undefined && props.inputValue === undefined) {
    inputValue = props.itemToString(selectedItem);
  }
  return _extends({}, initialState, {
    inputValue: inputValue
  });
}
var propTypes$1 = {
  items: PropTypes.array.isRequired,
  itemToString: PropTypes.func,
  selectedItemChanged: PropTypes.func,
  getA11yStatusMessage: PropTypes.func,
  getA11ySelectionMessage: PropTypes.func,
  highlightedIndex: PropTypes.number,
  defaultHighlightedIndex: PropTypes.number,
  initialHighlightedIndex: PropTypes.number,
  isOpen: PropTypes.bool,
  defaultIsOpen: PropTypes.bool,
  initialIsOpen: PropTypes.bool,
  selectedItem: PropTypes.any,
  initialSelectedItem: PropTypes.any,
  defaultSelectedItem: PropTypes.any,
  inputValue: PropTypes.string,
  defaultInputValue: PropTypes.string,
  initialInputValue: PropTypes.string,
  id: PropTypes.string,
  labelId: PropTypes.string,
  menuId: PropTypes.string,
  getItemId: PropTypes.func,
  inputId: PropTypes.string,
  toggleButtonId: PropTypes.string,
  stateReducer: PropTypes.func,
  onSelectedItemChange: PropTypes.func,
  onHighlightedIndexChange: PropTypes.func,
  onStateChange: PropTypes.func,
  onIsOpenChange: PropTypes.func,
  onInputValueChange: PropTypes.func,
  environment: PropTypes.shape({
    addEventListener: PropTypes.func,
    removeEventListener: PropTypes.func,
    document: PropTypes.shape({
      getElementById: PropTypes.func,
      activeElement: PropTypes.any,
      body: PropTypes.any
    })
  })
};

/**
 * The useCombobox version of useControlledReducer, which also
 * checks if the controlled prop selectedItem changed between
 * renders. If so, it will also update inputValue with its
 * string equivalent. It uses the common useEnhancedReducer to
 * compute the rest of the state.
 *
 * @param {Function} reducer Reducer function from downshift.
 * @param {Object} initialState Initial state of the hook.
 * @param {Object} props The hook props.
 * @returns {Array} An array with the state and an action dispatcher.
 */
function useControlledReducer(reducer, initialState, props) {
  var previousSelectedItemRef = react.useRef();
  var _useEnhancedReducer = useEnhancedReducer(reducer, initialState, props),
    state = _useEnhancedReducer[0],
    dispatch = _useEnhancedReducer[1];

  // ToDo: if needed, make same approach as selectedItemChanged from Downshift.
  react.useEffect(function () {
    if (!isControlledProp(props, 'selectedItem')) {
      return;
    }
    if (props.selectedItemChanged(previousSelectedItemRef.current, props.selectedItem)) {
      dispatch({
        type: ControlledPropUpdatedSelectedItem,
        inputValue: props.itemToString(props.selectedItem)
      });
    }
    previousSelectedItemRef.current = state.selectedItem === previousSelectedItemRef.current ? props.selectedItem : state.selectedItem;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedItem, props.selectedItem]);
  return [getState(state, props), dispatch];
}

// eslint-disable-next-line import/no-mutable-exports
var validatePropTypes$1 = noop;
/* istanbul ignore next */
{
  validatePropTypes$1 = function validatePropTypes(options, caller) {
    PropTypes.checkPropTypes(propTypes$1, options, 'prop', caller.name);
  };
}
var defaultProps$1 = _extends({}, defaultProps$3, {
  selectedItemChanged: function selectedItemChanged(prevItem, item) {
    return prevItem !== item;
  },
  getA11yStatusMessage: getA11yStatusMessage$1
});

/* eslint-disable complexity */
function downshiftUseComboboxReducer(state, action) {
  var _props$items;
  var type = action.type,
    props = action.props,
    altKey = action.altKey;
  var changes;
  switch (type) {
    case ItemClick:
      changes = {
        isOpen: getDefaultValue$1(props, 'isOpen'),
        highlightedIndex: getDefaultValue$1(props, 'highlightedIndex'),
        selectedItem: props.items[action.index],
        inputValue: props.itemToString(props.items[action.index])
      };
      break;
    case InputKeyDownArrowDown:
      if (state.isOpen) {
        changes = {
          highlightedIndex: getNextWrappingIndex(1, state.highlightedIndex, props.items.length, action.getItemNodeFromIndex, true)
        };
      } else {
        changes = {
          highlightedIndex: altKey && state.selectedItem == null ? -1 : getHighlightedIndexOnOpen(props, state, 1, action.getItemNodeFromIndex),
          isOpen: props.items.length >= 0
        };
      }
      break;
    case InputKeyDownArrowUp:
      if (state.isOpen) {
        if (altKey) {
          changes = getChangesOnSelection(props, state.highlightedIndex);
        } else {
          changes = {
            highlightedIndex: getNextWrappingIndex(-1, state.highlightedIndex, props.items.length, action.getItemNodeFromIndex, true)
          };
        }
      } else {
        changes = {
          highlightedIndex: getHighlightedIndexOnOpen(props, state, -1, action.getItemNodeFromIndex),
          isOpen: props.items.length >= 0
        };
      }
      break;
    case InputKeyDownEnter:
      changes = getChangesOnSelection(props, state.highlightedIndex);
      break;
    case InputKeyDownEscape:
      changes = _extends({
        isOpen: false,
        highlightedIndex: -1
      }, !state.isOpen && {
        selectedItem: null,
        inputValue: ''
      });
      break;
    case InputKeyDownPageUp:
      changes = {
        highlightedIndex: getNextWrappingIndex(-10, state.highlightedIndex, props.items.length, action.getItemNodeFromIndex, false)
      };
      break;
    case InputKeyDownPageDown:
      changes = {
        highlightedIndex: getNextWrappingIndex(10, state.highlightedIndex, props.items.length, action.getItemNodeFromIndex, false)
      };
      break;
    case InputKeyDownHome:
      changes = {
        highlightedIndex: getNextNonDisabledIndex(1, 0, props.items.length, action.getItemNodeFromIndex, false)
      };
      break;
    case InputKeyDownEnd:
      changes = {
        highlightedIndex: getNextNonDisabledIndex(-1, props.items.length - 1, props.items.length, action.getItemNodeFromIndex, false)
      };
      break;
    case InputBlur:
      changes = _extends({
        isOpen: false,
        highlightedIndex: -1
      }, state.highlightedIndex >= 0 && ((_props$items = props.items) == null ? void 0 : _props$items.length) && action.selectItem && {
        selectedItem: props.items[state.highlightedIndex],
        inputValue: props.itemToString(props.items[state.highlightedIndex])
      });
      break;
    case InputChange:
      changes = {
        isOpen: true,
        highlightedIndex: getDefaultValue$1(props, 'highlightedIndex'),
        inputValue: action.inputValue
      };
      break;
    case InputFocus:
      changes = {
        isOpen: true,
        highlightedIndex: getHighlightedIndexOnOpen(props, state, 0)
      };
      break;
    case FunctionSelectItem:
      changes = {
        selectedItem: action.selectedItem,
        inputValue: props.itemToString(action.selectedItem)
      };
      break;
    case ControlledPropUpdatedSelectedItem:
      changes = {
        inputValue: action.inputValue
      };
      break;
    default:
      return downshiftCommonReducer(state, action, stateChangeTypes$1);
  }
  return _extends({}, state, changes);
}
/* eslint-enable complexity */

var _excluded$1 = ["onMouseLeave", "refKey", "ref"],
  _excluded2$1 = ["item", "index", "refKey", "ref", "onMouseMove", "onMouseDown", "onClick", "onPress", "disabled"],
  _excluded3 = ["onClick", "onPress", "refKey", "ref"],
  _excluded4 = ["onKeyDown", "onChange", "onInput", "onFocus", "onBlur", "onChangeText", "refKey", "ref"];
useCombobox.stateChangeTypes = stateChangeTypes$1;
function useCombobox(userProps) {
  if (userProps === void 0) {
    userProps = {};
  }
  validatePropTypes$1(userProps, useCombobox);
  // Props defaults and destructuring.
  var props = _extends({}, defaultProps$1, userProps);
  var initialIsOpen = props.initialIsOpen,
    defaultIsOpen = props.defaultIsOpen,
    items = props.items,
    scrollIntoView = props.scrollIntoView,
    environment = props.environment,
    getA11yStatusMessage = props.getA11yStatusMessage,
    getA11ySelectionMessage = props.getA11ySelectionMessage,
    itemToString = props.itemToString;
  // Initial state depending on controlled props.
  var initialState = getInitialState$1(props);
  var _useControlledReducer = useControlledReducer(downshiftUseComboboxReducer, initialState, props),
    state = _useControlledReducer[0],
    dispatch = _useControlledReducer[1];
  var isOpen = state.isOpen,
    highlightedIndex = state.highlightedIndex,
    selectedItem = state.selectedItem,
    inputValue = state.inputValue;

  // Element refs.
  var menuRef = react.useRef(null);
  var itemRefs = react.useRef({});
  var inputRef = react.useRef(null);
  var toggleButtonRef = react.useRef(null);
  var isInitialMountRef = react.useRef(true);
  // prevent id re-generation between renders.
  var elementIds = useElementIds(props);
  // used to keep track of how many items we had on previous cycle.
  var previousResultCountRef = react.useRef();
  // utility callback to get item element.
  var latest = useLatestRef({
    state: state,
    props: props
  });
  var getItemNodeFromIndex = react.useCallback(function (index) {
    return itemRefs.current[elementIds.getItemId(index)];
  }, [elementIds]);

  // Effects.
  // Sets a11y status message on changes in state.
  useA11yMessageSetter(getA11yStatusMessage, [isOpen, highlightedIndex, inputValue, items], _extends({
    isInitialMount: isInitialMountRef.current,
    previousResultCount: previousResultCountRef.current,
    items: items,
    environment: environment,
    itemToString: itemToString
  }, state));
  // Sets a11y status message on changes in selectedItem.
  useA11yMessageSetter(getA11ySelectionMessage, [selectedItem], _extends({
    isInitialMount: isInitialMountRef.current,
    previousResultCount: previousResultCountRef.current,
    items: items,
    environment: environment,
    itemToString: itemToString
  }, state));
  // Scroll on highlighted item if change comes from keyboard.
  var shouldScrollRef = useScrollIntoView({
    menuElement: menuRef.current,
    highlightedIndex: highlightedIndex,
    isOpen: isOpen,
    itemRefs: itemRefs,
    scrollIntoView: scrollIntoView,
    getItemNodeFromIndex: getItemNodeFromIndex
  });
  useControlPropsValidator({
    isInitialMount: isInitialMountRef.current,
    props: props,
    state: state
  });
  // Focus the input on first render if required.
  react.useEffect(function () {
    var focusOnOpen = initialIsOpen || defaultIsOpen || isOpen;
    if (focusOnOpen && inputRef.current) {
      inputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  react.useEffect(function () {
    if (isInitialMountRef.current) {
      return;
    }
    previousResultCountRef.current = items.length;
  });
  // Add mouse/touch events to document.
  var mouseAndTouchTrackersRef = useMouseAndTouchTracker(isOpen, [inputRef, menuRef, toggleButtonRef], environment, function () {
    dispatch({
      type: InputBlur,
      selectItem: false
    });
  });
  var setGetterPropCallInfo = useGetterPropsCalledChecker('getInputProps', 'getMenuProps');
  // Make initial ref false.
  react.useEffect(function () {
    isInitialMountRef.current = false;
    return function () {
      isInitialMountRef.current = true;
    };
  }, []);
  // Reset itemRefs on close.
  react.useEffect(function () {
    var _environment$document;
    if (!isOpen) {
      itemRefs.current = {};
    } else if (((_environment$document = environment.document) == null ? void 0 : _environment$document.activeElement) !== inputRef.current) {
      var _inputRef$current;
      inputRef == null || (_inputRef$current = inputRef.current) == null ? void 0 : _inputRef$current.focus();
    }
  }, [isOpen, environment]);

  /* Event handler functions */
  var inputKeyDownHandlers = react.useMemo(function () {
    return {
      ArrowDown: function ArrowDown(event) {
        event.preventDefault();
        dispatch({
          type: InputKeyDownArrowDown,
          altKey: event.altKey,
          getItemNodeFromIndex: getItemNodeFromIndex
        });
      },
      ArrowUp: function ArrowUp(event) {
        event.preventDefault();
        dispatch({
          type: InputKeyDownArrowUp,
          altKey: event.altKey,
          getItemNodeFromIndex: getItemNodeFromIndex
        });
      },
      Home: function Home(event) {
        if (!latest.current.state.isOpen) {
          return;
        }
        event.preventDefault();
        dispatch({
          type: InputKeyDownHome,
          getItemNodeFromIndex: getItemNodeFromIndex
        });
      },
      End: function End(event) {
        if (!latest.current.state.isOpen) {
          return;
        }
        event.preventDefault();
        dispatch({
          type: InputKeyDownEnd,
          getItemNodeFromIndex: getItemNodeFromIndex
        });
      },
      Escape: function Escape(event) {
        var latestState = latest.current.state;
        if (latestState.isOpen || latestState.inputValue || latestState.selectedItem || latestState.highlightedIndex > -1) {
          event.preventDefault();
          dispatch({
            type: InputKeyDownEscape
          });
        }
      },
      Enter: function Enter(event) {
        var latestState = latest.current.state;
        // if closed or no highlighted index, do nothing.
        if (!latestState.isOpen || event.which === 229 // if IME composing, wait for next Enter keydown event.
        ) {
          return;
        }
        event.preventDefault();
        dispatch({
          type: InputKeyDownEnter,
          getItemNodeFromIndex: getItemNodeFromIndex
        });
      },
      PageUp: function PageUp(event) {
        if (latest.current.state.isOpen) {
          event.preventDefault();
          dispatch({
            type: InputKeyDownPageUp,
            getItemNodeFromIndex: getItemNodeFromIndex
          });
        }
      },
      PageDown: function PageDown(event) {
        if (latest.current.state.isOpen) {
          event.preventDefault();
          dispatch({
            type: InputKeyDownPageDown,
            getItemNodeFromIndex: getItemNodeFromIndex
          });
        }
      }
    };
  }, [dispatch, latest, getItemNodeFromIndex]);

  // Getter props.
  var getLabelProps = react.useCallback(function (labelProps) {
    return _extends({
      id: elementIds.labelId,
      htmlFor: elementIds.inputId
    }, labelProps);
  }, [elementIds]);
  var getMenuProps = react.useCallback(function (_temp, _temp2) {
    var _extends2;
    var _ref = _temp === void 0 ? {} : _temp,
      onMouseLeave = _ref.onMouseLeave,
      _ref$refKey = _ref.refKey,
      refKey = _ref$refKey === void 0 ? 'ref' : _ref$refKey,
      ref = _ref.ref,
      rest = _objectWithoutPropertiesLoose(_ref, _excluded$1);
    var _ref2 = _temp2 === void 0 ? {} : _temp2,
      _ref2$suppressRefErro = _ref2.suppressRefError,
      suppressRefError = _ref2$suppressRefErro === void 0 ? false : _ref2$suppressRefErro;
    setGetterPropCallInfo('getMenuProps', suppressRefError, refKey, menuRef);
    return _extends((_extends2 = {}, _extends2[refKey] = handleRefs(ref, function (menuNode) {
      menuRef.current = menuNode;
    }), _extends2.id = elementIds.menuId, _extends2.role = 'listbox', _extends2['aria-labelledby'] = rest && rest['aria-label'] ? undefined : "" + elementIds.labelId, _extends2.onMouseLeave = callAllEventHandlers(onMouseLeave, function () {
      dispatch({
        type: MenuMouseLeave
      });
    }), _extends2), rest);
  }, [dispatch, setGetterPropCallInfo, elementIds]);
  var getItemProps = react.useCallback(function (_temp3) {
    var _extends3, _ref4;
    var _ref3 = _temp3 === void 0 ? {} : _temp3,
      itemProp = _ref3.item,
      indexProp = _ref3.index,
      _ref3$refKey = _ref3.refKey,
      refKey = _ref3$refKey === void 0 ? 'ref' : _ref3$refKey,
      ref = _ref3.ref,
      onMouseMove = _ref3.onMouseMove,
      onMouseDown = _ref3.onMouseDown,
      onClick = _ref3.onClick;
    _ref3.onPress;
    var disabled = _ref3.disabled,
      rest = _objectWithoutPropertiesLoose(_ref3, _excluded2$1);
    var _latest$current = latest.current,
      latestProps = _latest$current.props,
      latestState = _latest$current.state;
    var _getItemAndIndex = getItemAndIndex(itemProp, indexProp, latestProps.items, 'Pass either item or index to getItemProps!'),
      index = _getItemAndIndex[1];
    var onSelectKey = 'onClick';
    var customClickHandler = onClick;
    var itemHandleMouseMove = function itemHandleMouseMove() {
      if (index === latestState.highlightedIndex) {
        return;
      }
      shouldScrollRef.current = false;
      dispatch({
        type: ItemMouseMove,
        index: index,
        disabled: disabled
      });
    };
    var itemHandleClick = function itemHandleClick() {
      dispatch({
        type: ItemClick,
        index: index
      });
    };
    var itemHandleMouseDown = function itemHandleMouseDown(e) {
      return e.preventDefault();
    };
    return _extends((_extends3 = {}, _extends3[refKey] = handleRefs(ref, function (itemNode) {
      if (itemNode) {
        itemRefs.current[elementIds.getItemId(index)] = itemNode;
      }
    }), _extends3.disabled = disabled, _extends3.role = 'option', _extends3['aria-selected'] = "" + (index === latestState.highlightedIndex), _extends3.id = elementIds.getItemId(index), _extends3), !disabled && (_ref4 = {}, _ref4[onSelectKey] = callAllEventHandlers(customClickHandler, itemHandleClick), _ref4), {
      onMouseMove: callAllEventHandlers(onMouseMove, itemHandleMouseMove),
      onMouseDown: callAllEventHandlers(onMouseDown, itemHandleMouseDown)
    }, rest);
  }, [dispatch, latest, shouldScrollRef, elementIds]);
  var getToggleButtonProps = react.useCallback(function (_temp4) {
    var _extends4;
    var _ref5 = _temp4 === void 0 ? {} : _temp4,
      onClick = _ref5.onClick;
    _ref5.onPress;
    var _ref5$refKey = _ref5.refKey,
      refKey = _ref5$refKey === void 0 ? 'ref' : _ref5$refKey,
      ref = _ref5.ref,
      rest = _objectWithoutPropertiesLoose(_ref5, _excluded3);
    var latestState = latest.current.state;
    var toggleButtonHandleClick = function toggleButtonHandleClick() {
      dispatch({
        type: ToggleButtonClick
      });
    };
    return _extends((_extends4 = {}, _extends4[refKey] = handleRefs(ref, function (toggleButtonNode) {
      toggleButtonRef.current = toggleButtonNode;
    }), _extends4['aria-controls'] = elementIds.menuId, _extends4['aria-expanded'] = latestState.isOpen, _extends4.id = elementIds.toggleButtonId, _extends4.tabIndex = -1, _extends4), !rest.disabled && _extends({}, {
      onClick: callAllEventHandlers(onClick, toggleButtonHandleClick)
    }), rest);
  }, [dispatch, latest, elementIds]);
  var getInputProps = react.useCallback(function (_temp5, _temp6) {
    var _extends5;
    var _ref6 = _temp5 === void 0 ? {} : _temp5,
      onKeyDown = _ref6.onKeyDown,
      onChange = _ref6.onChange,
      onInput = _ref6.onInput,
      onFocus = _ref6.onFocus,
      onBlur = _ref6.onBlur;
    _ref6.onChangeText;
    var _ref6$refKey = _ref6.refKey,
      refKey = _ref6$refKey === void 0 ? 'ref' : _ref6$refKey,
      ref = _ref6.ref,
      rest = _objectWithoutPropertiesLoose(_ref6, _excluded4);
    var _ref7 = _temp6 === void 0 ? {} : _temp6,
      _ref7$suppressRefErro = _ref7.suppressRefError,
      suppressRefError = _ref7$suppressRefErro === void 0 ? false : _ref7$suppressRefErro;
    setGetterPropCallInfo('getInputProps', suppressRefError, refKey, inputRef);
    var latestState = latest.current.state;
    var inputHandleKeyDown = function inputHandleKeyDown(event) {
      var key = normalizeArrowKey(event);
      if (key && inputKeyDownHandlers[key]) {
        inputKeyDownHandlers[key](event);
      }
    };
    var inputHandleChange = function inputHandleChange(event) {
      dispatch({
        type: InputChange,
        inputValue: event.target.value
      });
    };
    var inputHandleBlur = function inputHandleBlur(event) {
      /* istanbul ignore else */
      if (latestState.isOpen && !mouseAndTouchTrackersRef.current.isMouseDown) {
        var isBlurByTabChange = event.relatedTarget === null && environment.document.activeElement !== environment.document.body;
        dispatch({
          type: InputBlur,
          selectItem: !isBlurByTabChange
        });
      }
    };
    var inputHandleFocus = function inputHandleFocus() {
      if (!latestState.isOpen) {
        dispatch({
          type: InputFocus
        });
      }
    };

    /* istanbul ignore next (preact) */
    var onChangeKey = 'onChange';
    var eventHandlers = {};
    if (!rest.disabled) {
      var _eventHandlers;
      eventHandlers = (_eventHandlers = {}, _eventHandlers[onChangeKey] = callAllEventHandlers(onChange, onInput, inputHandleChange), _eventHandlers.onKeyDown = callAllEventHandlers(onKeyDown, inputHandleKeyDown), _eventHandlers.onBlur = callAllEventHandlers(onBlur, inputHandleBlur), _eventHandlers.onFocus = callAllEventHandlers(onFocus, inputHandleFocus), _eventHandlers);
    }
    return _extends((_extends5 = {}, _extends5[refKey] = handleRefs(ref, function (inputNode) {
      inputRef.current = inputNode;
    }), _extends5['aria-activedescendant'] = latestState.isOpen && latestState.highlightedIndex > -1 ? elementIds.getItemId(latestState.highlightedIndex) : '', _extends5['aria-autocomplete'] = 'list', _extends5['aria-controls'] = elementIds.menuId, _extends5['aria-expanded'] = latestState.isOpen, _extends5['aria-labelledby'] = rest && rest['aria-label'] ? undefined : "" + elementIds.labelId, _extends5.autoComplete = 'off', _extends5.id = elementIds.inputId, _extends5.role = 'combobox', _extends5.value = latestState.inputValue, _extends5), eventHandlers, rest);
  }, [setGetterPropCallInfo, latest, elementIds, inputKeyDownHandlers, dispatch, mouseAndTouchTrackersRef, environment]);

  // returns
  var toggleMenu = react.useCallback(function () {
    dispatch({
      type: FunctionToggleMenu
    });
  }, [dispatch]);
  var closeMenu = react.useCallback(function () {
    dispatch({
      type: FunctionCloseMenu
    });
  }, [dispatch]);
  var openMenu = react.useCallback(function () {
    dispatch({
      type: FunctionOpenMenu
    });
  }, [dispatch]);
  var setHighlightedIndex = react.useCallback(function (newHighlightedIndex) {
    dispatch({
      type: FunctionSetHighlightedIndex,
      highlightedIndex: newHighlightedIndex
    });
  }, [dispatch]);
  var selectItem = react.useCallback(function (newSelectedItem) {
    dispatch({
      type: FunctionSelectItem,
      selectedItem: newSelectedItem
    });
  }, [dispatch]);
  var setInputValue = react.useCallback(function (newInputValue) {
    dispatch({
      type: FunctionSetInputValue,
      inputValue: newInputValue
    });
  }, [dispatch]);
  var reset = react.useCallback(function () {
    dispatch({
      type: FunctionReset$1
    });
  }, [dispatch]);
  return {
    // prop getters.
    getItemProps: getItemProps,
    getLabelProps: getLabelProps,
    getMenuProps: getMenuProps,
    getInputProps: getInputProps,
    getToggleButtonProps: getToggleButtonProps,
    // actions.
    toggleMenu: toggleMenu,
    openMenu: openMenu,
    closeMenu: closeMenu,
    setHighlightedIndex: setHighlightedIndex,
    setInputValue: setInputValue,
    selectItem: selectItem,
    reset: reset,
    // state.
    highlightedIndex: highlightedIndex,
    isOpen: isOpen,
    selectedItem: selectedItem,
    inputValue: inputValue
  };
}

/**
 * Returns a message to be added to aria-live region when item is removed.
 *
 * @param {Object} selectionParameters Parameters required to build the message.
 * @returns {string} The a11y message.
 */
function getA11yRemovalMessage(selectionParameters) {
  var removedSelectedItem = selectionParameters.removedSelectedItem,
    itemToStringLocal = selectionParameters.itemToString;
  return itemToStringLocal(removedSelectedItem) + " has been removed.";
}
({
  selectedItems: PropTypes.array,
  initialSelectedItems: PropTypes.array,
  defaultSelectedItems: PropTypes.array,
  itemToString: PropTypes.func,
  getA11yRemovalMessage: PropTypes.func,
  stateReducer: PropTypes.func,
  activeIndex: PropTypes.number,
  initialActiveIndex: PropTypes.number,
  defaultActiveIndex: PropTypes.number,
  onActiveIndexChange: PropTypes.func,
  onSelectedItemsChange: PropTypes.func,
  keyNavigationNext: PropTypes.string,
  keyNavigationPrevious: PropTypes.string,
  environment: PropTypes.shape({
    addEventListener: PropTypes.func,
    removeEventListener: PropTypes.func,
    document: PropTypes.shape({
      getElementById: PropTypes.func,
      activeElement: PropTypes.any,
      body: PropTypes.any
    })
  })
});
({
  itemToString: defaultProps$3.itemToString,
  stateReducer: defaultProps$3.stateReducer,
  environment: defaultProps$3.environment,
  getA11yRemovalMessage: getA11yRemovalMessage,
  keyNavigationNext: 'ArrowRight',
  keyNavigationPrevious: 'ArrowLeft'
});

function useDownshiftSingleSelectProps(selector, options = {}, a11yStatusMessage) {
    const { inputId, labelId } = options;
    const downshiftProps = react.useMemo(() => {
        return {
            items: [],
            itemToString: (v) => selector.caption.get(v),
            onSelectedItemChange({ selectedItem }) {
                selector.setValue(selectedItem ?? null);
            },
            onInputValueChange({ inputValue, type }) {
                if (selector.onFilterInputChange && type === useCombobox.stateChangeTypes.InputChange) {
                    selector.options.setSearchTerm(inputValue ?? "");
                    selector.onFilterInputChange(inputValue ?? "");
                }
                else {
                    selector.options.setSearchTerm("");
                }
            },
            getA11yStatusMessage(options) {
                const selectedItem = selector.caption.get(selector.currentId);
                let message = selectedItem
                    ? selector.currentId
                        ? `${a11yStatusMessage.a11ySelectedValue} ${selectedItem}. `
                        : "No options selected."
                    : "";
                if (!options.isOpen) {
                    return message;
                }
                if (!options.resultCount) {
                    return a11yStatusMessage.a11yNoOption;
                }
                if (options.resultCount > 0) {
                    message += `${a11yStatusMessage.a11yOptionsAvailable} ${options.resultCount}. ${a11yStatusMessage.a11yInstructions}`;
                }
                else {
                    return a11yStatusMessage.a11yNoOption;
                }
                return message;
            },
            defaultHighlightedIndex: 0,
            selectedItem: null,
            initialInputValue: selector.caption.get(selector.currentId),
            stateReducer(state, actionAndChanges) {
                const { changes, type } = actionAndChanges;
                switch (type) {
                    // clear input when user toggles (closes) dropdown.
                    case useCombobox.stateChangeTypes.ToggleButtonClick:
                        return {
                            ...changes,
                            inputValue: ""
                        };
                    // when item is selected, downshift fills in input automatically, prevent that.
                    case useCombobox.stateChangeTypes.FunctionSelectItem:
                    case useCombobox.stateChangeTypes.ItemClick:
                    case useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem:
                    case useCombobox.stateChangeTypes.InputKeyDownEnter:
                        return {
                            ...changes,
                            inputValue: ""
                        };
                    case useCombobox.stateChangeTypes.InputFocus:
                        return {
                            ...changes,
                            isOpen: state.isOpen,
                            inputValue: "",
                            highlightedIndex: changes.selectedItem ? -1 : this.defaultHighlightedIndex
                        };
                    // clear input when user want to close the popup with escape (or it was closed programmatically)
                    case useCombobox.stateChangeTypes.InputKeyDownEscape:
                    case useCombobox.stateChangeTypes.FunctionCloseMenu:
                        return {
                            ...changes,
                            selectedItem: state.selectedItem,
                            isOpen: false,
                            inputValue: ""
                        };
                    case useCombobox.stateChangeTypes.InputBlur:
                        return {
                            ...changes,
                            selectedItem: state.selectedItem,
                            inputValue: "",
                            isOpen: false
                        };
                    default:
                        return { ...changes };
                }
            },
            inputId,
            labelId
        };
    }, [
        selector,
        inputId,
        labelId,
        a11yStatusMessage.a11ySelectedValue,
        a11yStatusMessage.a11yOptionsAvailable,
        a11yStatusMessage.a11yNoOption,
        a11yStatusMessage.a11yInstructions
    ]);
    // Sort items in grouped order (matching SingleSelectionMenu render order)
    const rawItems = selector.options.getAll() ?? [];
    const getGroupFn = selector.caption.getGroup
        ? (id) => selector.caption.getGroup(id)
        : (_id) => null;
    const hasGroups = rawItems.some(id => {
        const title = getGroupFn(id);
        return title !== null && title.trim() !== "";
    });
    let sortedItems;
    if (hasGroups) {
        const groupMap = new Map();
        const ungrouped = [];
        for (const id of rawItems) {
            const title = getGroupFn(id);
            if (!title || title.trim() === "") {
                ungrouped.push(id);
            }
            else {
                if (!groupMap.has(title)) {
                    groupMap.set(title, []);
                }
                groupMap.get(title).push(id);
            }
        }
        const sortedTitles = Array.from(groupMap.keys()).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
        sortedItems = [];
        for (const title of sortedTitles) {
            sortedItems.push(...groupMap.get(title));
        }
        sortedItems.push(...ungrouped);
    }
    else {
        sortedItems = rawItems;
    }
    const returnVal = useCombobox({
        ...downshiftProps,
        items: sortedItems,
        selectedItem: selector.currentId
    });
    const { closeMenu } = returnVal;
    selector.onLeaveEvent = react.useCallback(closeMenu, [closeMenu]);
    return returnVal;
}

function useInfiniteControl(props) {
    const { setPage, hasMoreItems } = props;
    const loadingRef = react.useRef(false);
    const trackScrolling = react.useCallback((event) => {
        const el = event?.target;
        if (!el || loadingRef.current || !hasMoreItems) {
            return;
        }
        const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
        if (nearBottom && setPage) {
            loadingRef.current = true;
            setPage();
            setTimeout(() => {
                loadingRef.current = false;
            }, 100);
        }
    }, [setPage, hasMoreItems]);
    return [trackScrolling];
}

function useLazyLoading(props) {
    const { hasMoreItems, isInfinite, loadMore } = props;
    const setPageCallback = react.useCallback(() => {
        if (loadMore) {
            loadMore();
        }
    }, [loadMore]);
    const [trackScrolling] = useInfiniteControl({ hasMoreItems, isInfinite, setPage: setPageCallback });
    return { onScroll: trackScrolling };
}

function ValidationAlert({ children, id }) {
    if (!children) {
        return null;
    }
    return react.createElement("div", { className: "alert alert-danger mx-validation-message", id }, children);
}

function SpinnerLoader({ size = "medium", withMargins = false }) {
    return (jsxRuntime.jsx("div", { className: classNames("widget-combobox-spinner", { "widget-combobox-spinner-margin": withMargins }), children: jsxRuntime.jsx("div", { className: classNames("widget-combobox-spinner-loader", {
                "widget-combobox-spinner-loader-small": size === "small"
            }) }) }));
}

const ComboboxWrapper = react.forwardRef((props, _ref) => {
    const { isOpen, readOnly, readOnlyStyle, getToggleButtonProps, validation, children, isLoading, isMultiselectActive, errorId } = props;
    const toggleProps = getToggleButtonProps();
    return (jsxRuntime.jsxs(react.Fragment, { children: [jsxRuntime.jsxs("div", { ref: toggleProps.ref, tabIndex: -1, className: classNames("widget-combobox-input-container", {
                    "widget-combobox-input-container-active": isOpen,
                    "widget-combobox-input-container-disabled": readOnly,
                    "form-control-static": readOnly && readOnlyStyle === "text",
                    "form-control": !readOnly || readOnlyStyle !== "text",
                    "widget-combobox-multiselect": isMultiselectActive
                }), id: toggleProps.id, onClick: toggleProps.onClick, children: [children, readOnly && readOnlyStyle === "text" ? null : isLoading ? (jsxRuntime.jsx("div", { className: "widget-combobox-down-arrow", children: jsxRuntime.jsx(SpinnerLoader, { size: "small" }) })) : (jsxRuntime.jsx("div", { className: "widget-combobox-down-arrow", onMouseDown: e => e.preventDefault(), children: jsxRuntime.jsx(DownArrow, { isOpen: isOpen }) }))] }), validation && jsxRuntime.jsx(ValidationAlert, { id: errorId, children: validation })] }));
});

function NoOptionsPlaceholder(props) {
    return (jsxRuntime.jsx("li", { className: "widget-combobox-item widget-combobox-no-options", role: "option", children: props.children }));
}
function InputPlaceholder(props) {
    return (jsxRuntime.jsx("div", { className: classNames(`widget-combobox-placeholder-${props.type ?? "text"}`, {
            "widget-combobox-placeholder-empty": props.isEmpty
        }), children: props.children }));
}

/**
 * Utility for grouping flat lists of option IDs into titled sections.
 * Items are sorted A-Z by their group title before grouping.
 * Items with no group title appear in a final "ungrouped" segment.
 */
/**
 * Groups a list of item IDs by their group title.
 * Automatically sorts groups A-Z. Ungrouped items appear at the end.
 *
 * @param items       Flat list of option IDs
 * @param getGroupFn  Function that returns the group title string for an ID (or null/empty)
 */
function groupItems(items, getGroupFn) {
    if (items.length === 0) {
        return [];
    }
    // Build a map: groupTitle → items[], preserving item order within each group
    const groupMap = new Map();
    const ungrouped = [];
    for (const id of items) {
        const title = getGroupFn(id);
        if (!title || title.trim() === "") {
            ungrouped.push(id);
        }
        else {
            if (!groupMap.has(title)) {
                groupMap.set(title, []);
            }
            groupMap.get(title).push(id);
        }
    }
    // Sort group titles A-Z (case-insensitive)
    const sortedTitles = Array.from(groupMap.keys()).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    const segments = sortedTitles.map(title => ({
        groupTitle: title,
        items: groupMap.get(title)
    }));
    // Append ungrouped at the end
    if (ungrouped.length > 0) {
        segments.push({ groupTitle: null, items: ungrouped });
    }
    return segments;
}

/**
 * Observes the position (bounding rect) of an element while active.
 * Returns the current DOMRect or undefined when not observing.
 */
function usePositionObserver(element, active) {
    const [rect, setRect] = react.useState(undefined);
    const rafRef = react.useRef(0);
    const updateRect = react.useCallback(() => {
        if (element) {
            setRect(element.getBoundingClientRect());
        }
    }, [element]);
    react.useEffect(() => {
        if (!element || !active) {
            setRect(undefined);
            return;
        }
        updateRect();
        const onScroll = () => {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(updateRect);
        };
        window.addEventListener("scroll", onScroll, true);
        window.addEventListener("resize", onScroll);
        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("resize", onScroll);
        };
    }, [element, active, updateRect]);
    return rect;
}

function debounce(fn, ms) {
    let timer = null;
    const debounced = (...args) => {
        if (timer)
            clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
    const abort = () => {
        if (timer)
            clearTimeout(timer);
    };
    return [debounced, abort];
}

function useMenuStyle(isOpen) {
    const ref = react.useRef(null);
    const [style, setStyle] = react.useState({ visibility: "hidden", position: "fixed" });
    const [setStyleDebounced, abort] = react.useMemo(() => debounce(setStyle, 32), [setStyle]);
    const menuHeight = ref.current?.offsetHeight ?? 0;
    const targetBox = usePositionObserver(ref.current?.parentElement ?? null, isOpen);
    react.useEffect(() => {
        if (targetBox === undefined || ref.current === null || !isOpen) {
            return;
        }
        setStyleDebounced({
            visibility: "visible",
            position: "fixed",
            width: targetBox.width,
            ...getMenuPosition(targetBox, ref.current.getBoundingClientRect())
        });
        return abort;
    }, [menuHeight, isOpen, targetBox, setStyleDebounced, abort]);
    return [ref, style];
}
function getMenuPosition(targetBox, menuBox) {
    const { height } = menuBox;
    const bottomSpace = window.innerHeight - targetBox.bottom;
    const topSpace = targetBox.top - height < 0 ? targetBox.top - height : 0;
    if (bottomSpace < height) {
        return { bottom: window.innerHeight - targetBox.top + topSpace, left: targetBox.left };
    }
    return { top: targetBox.bottom, left: targetBox.left };
}

function PreventMenuCloseEventHandler(e) {
    e.stopPropagation();
}
function ForcePreventMenuCloseEventHandler(e) {
    e.preventDefault();
    e.stopPropagation();
}
function ComboboxMenuWrapper(props) {
    const { alwaysOpen, children, getMenuProps, highlightedIndex, isEmpty, isLoading, isOpen, lazyLoading, loader, menuFooterContent, menuHeaderContent, noOptionsText, onOptionClick, onScroll } = props;
    const [ref, style] = useMenuStyle(isOpen);
    return (jsxRuntime.jsxs("div", { ref: ref, className: classNames("widget-grouped-combobox-menu", { "widget-grouped-combobox-menu-hidden": !isOpen }), style: alwaysOpen
            ? {
                display: "block",
                visibility: "visible",
                position: "relative"
            }
            : style, children: [menuHeaderContent && (jsxRuntime.jsx("div", { className: "widget-grouped-combobox-menu-header widget-grouped-combobox-item", onMouseDown: PreventMenuCloseEventHandler, children: menuHeaderContent })), jsxRuntime.jsxs("ul", { className: classNames("widget-grouped-combobox-menu-list", {
                    "widget-grouped-combobox-menu-highlighted": (highlightedIndex ?? -1) >= 0,
                    "widget-grouped-combobox-menu-lazy-scroll": lazyLoading && !isEmpty
                }), ...getMenuProps?.({
                    onClick: onOptionClick,
                    onMouseDown: ForcePreventMenuCloseEventHandler,
                    onScroll
                }, { suppressRefError: true }), children: [isOpen ? (isEmpty && !isLoading ? (jsxRuntime.jsx(NoOptionsPlaceholder, { children: noOptionsText })) : (children)) : null, loader] }), menuFooterContent && (jsxRuntime.jsx("div", { className: "widget-grouped-combobox-menu-footer", onMouseDown: PreventMenuCloseEventHandler, children: menuFooterContent }))] }));
}

function ComboboxOptionWrapper(props) {
    const { children, isSelected, isHighlighted, item, getItemProps, index } = props;
    return (jsxRuntime.jsx("li", { className: classNames("widget-grouped-combobox-item", {
            "widget-grouped-combobox-item-selected": isSelected,
            "widget-grouped-combobox-item-highlighted": isHighlighted
        }), ...getItemProps?.({
            index,
            item
        }), "aria-selected": isSelected, children: children }));
}

/**
 * A non-interactive, non-selectable list item rendered as a group heading
 * inside the combobox dropdown menu.
 *
 * Important: this element is NOT included in the downshift item index
 * sequence — it is purely visual and skipped during keyboard navigation.
 */
function ComboboxGroupHeader({ title }) {
    return (jsxRuntime.jsx("li", { className: classNames("widget-grouped-combobox-group-header"), "aria-disabled": "true", role: "separator", "aria-label": title, onMouseDown: e => e.preventDefault(), children: jsxRuntime.jsx("span", { className: "widget-grouped-combobox-group-header-text", children: title }) }));
}

function SkeletonLoader({ withCheckbox = false }) {
    return (jsxRuntime.jsxs("div", { className: "widget-combobox-skeleton", children: [withCheckbox && jsxRuntime.jsx("span", { className: "widget-combobox-skeleton-loader widget-combobox-skeleton-loader-small" }), jsxRuntime.jsx("span", { className: "widget-combobox-skeleton-loader" })] }));
}

function Loader(props) {
    const { isEmpty, isLoading, isOpen, lazyLoading, loadingType, withCheckbox } = props;
    if (!isOpen || !lazyLoading || !isLoading) {
        return null;
    }
    return loadingType === "skeleton" ? (jsxRuntime.jsx(react.Fragment, { children: Array.from({ length: DEFAULT_LIMIT_SIZE }).map((_, i) => (jsxRuntime.jsx(SkeletonLoader, { withCheckbox: withCheckbox }, i))) })) : (jsxRuntime.jsx(SpinnerLoader, { withMargins: isEmpty }));
}

function SingleSelectionMenu({ isOpen, selector, highlightedIndex, getMenuProps, getItemProps, noOptionsText, alwaysOpen, menuFooterContent, isLoading, lazyLoading, onScroll }) {
    const items = selector.options.getAll();
    // Build the group function — falls back to null (no grouping) when caption provider has no getGroup
    const getGroupFn = selector.caption.getGroup
        ? (id) => selector.caption.getGroup(id)
        : (_id) => null;
    const segments = groupItems(items, getGroupFn);
    const isGrouped = segments.some(s => s.groupTitle !== null);
    // We need a continuous downshift index that skips group header rows
    let downshiftIndex = 0;
    return (jsxRuntime.jsx(ComboboxMenuWrapper, { alwaysOpen: alwaysOpen, getMenuProps: getMenuProps, isEmpty: items?.length <= 0, isLoading: isLoading, isOpen: isOpen, lazyLoading: lazyLoading, loader: jsxRuntime.jsx(Loader, { isLoading: isLoading, isOpen: isOpen, lazyLoading: lazyLoading, loadingType: selector.loadingType, withCheckbox: false, isEmpty: items.length === 0 }), menuFooterContent: menuFooterContent, noOptionsText: noOptionsText, onScroll: lazyLoading ? onScroll : undefined, children: isOpen &&
            (isGrouped
                ? segments.map(segment => (jsxRuntime.jsxs(react.Fragment, { children: [segment.groupTitle && jsxRuntime.jsx(ComboboxGroupHeader, { title: segment.groupTitle }), segment.items.map(item => {
                            const currentIndex = downshiftIndex++;
                            return (jsxRuntime.jsx(ComboboxOptionWrapper, { isHighlighted: alwaysOpen ? false : highlightedIndex === currentIndex, isSelected: selector.currentId === item, item: item, getItemProps: getItemProps, index: currentIndex, children: selector.caption.render(item, "options") }, item));
                        })] }, segment.groupTitle ?? "__ungrouped__")))
                : items.map((item, index) => (jsxRuntime.jsx(ComboboxOptionWrapper, { isHighlighted: alwaysOpen ? false : highlightedIndex === index, isSelected: selector.currentId === item, item: item, getItemProps: getItemProps, index: index, children: selector.caption.render(item, "options") }, item)))) }));
}

function SingleSelection({ selector, tabIndex = 0, a11yConfig, keepMenuOpen, menuFooterContent, ariaRequired, ...options }) {
    const { getInputProps, getToggleButtonProps, getItemProps, selectedItem, getMenuProps, reset, isOpen, highlightedIndex, selectItem } = useDownshiftSingleSelectProps(selector, options, a11yConfig.a11yStatusMessage);
    const inputRef = react.useRef(null);
    const lazyLoading = selector.lazyLoading ?? false;
    const { onScroll } = useLazyLoading({
        hasMoreItems: selector.options.hasMore ?? false,
        isInfinite: lazyLoading,
        isOpen,
        loadMore: () => {
            if (selector.options.loadMore) {
                selector.options.loadMore();
            }
        },
        datasourceFilter: selector.options.datasourceFilter,
        readOnly: selector.readOnly
    });
    const selectedItemCaption = react.useMemo(() => selector.caption.render(selectedItem, "label"), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
        selectedItem,
        selector.status,
        selector.caption,
        selector.caption.emptyCaption,
        selector.currentId,
        selector.caption.formatter
    ]);
    const inputLabel = getInputLabel(options.inputId);
    const errorId = getValidationErrorId(options.inputId);
    const hasLabel = react.useMemo(() => Boolean(inputLabel), [inputLabel]);
    const onInputKeyDown = react.useMemo(() => {
        if (!selector.clearable) {
            return undefined;
        }
        return e => {
            if (e.key === "Backspace" && e.currentTarget.value === "") {
                selectItem(null);
            }
        };
    }, [selector.clearable, selectItem]);
    const inputProps = getInputProps({
        disabled: selector.readOnly,
        readOnly: selector.options.filterType === "none",
        ref: inputRef,
        "aria-required": ariaRequired.value,
        "aria-label": !hasLabel && options.ariaLabel ? options.ariaLabel : undefined,
        onKeyDown: onInputKeyDown
    }, { suppressRefError: true });
    return (jsxRuntime.jsxs(react.Fragment, { children: [jsxRuntime.jsxs(ComboboxWrapper, { isOpen: isOpen || keepMenuOpen === true, readOnly: selector.readOnly, readOnlyStyle: options.readOnlyStyle, getToggleButtonProps: getToggleButtonProps, validation: selector.validation, isLoading: lazyLoading && selector.options.isLoading, errorId: errorId, children: [jsxRuntime.jsxs("div", { className: classNames("widget-combobox-selected-items", {
                            "widget-combobox-custom-content": selector.customContentType === "yes"
                        }), children: [jsxRuntime.jsx("input", { className: classNames("widget-combobox-input", {
                                    "widget-combobox-input-nofilter": selector.options.filterType === "none" || selector.readOnly
                                }), tabIndex: tabIndex, ...inputProps, placeholder: " ", "aria-labelledby": hasLabel ? inputProps["aria-labelledby"] : undefined, "aria-describedby": selector.validation ? errorId : undefined, "aria-invalid": selector.validation ? true : undefined }), jsxRuntime.jsx(InputPlaceholder, { isEmpty: !selector.currentId || !selector.caption.render(selectedItem, "label"), type: selector.customContentType === "yes" ? "custom" : "text", children: selectedItemCaption })] }), !selector.readOnly &&
                        selector.clearable &&
                        selector.currentId !== null &&
                        !(selector.selectorType === "static" && selector.attributeType === "boolean") && (jsxRuntime.jsx("button", { tabIndex: tabIndex, className: "widget-combobox-clear-button", "aria-label": a11yConfig.ariaLabels?.clearSelection, onMouseDown: e => {
                            e.preventDefault();
                            e.stopPropagation();
                        }, onClick: e => {
                            e.stopPropagation();
                            inputRef.current?.focus();
                            if (selectedItem || selector.selectorType === "static") {
                                selector.setValue(null);
                                reset();
                            }
                        }, children: jsxRuntime.jsx(ClearButton, {}) }))] }), jsxRuntime.jsx(SingleSelectionMenu, { selector: selector, selectedItem: selectedItem, getMenuProps: getMenuProps, getItemProps: getItemProps, isOpen: isOpen || keepMenuOpen === true, highlightedIndex: highlightedIndex, menuFooterContent: menuFooterContent, noOptionsText: options.noOptionsText, alwaysOpen: keepMenuOpen, isLoading: selector.options.isLoading, lazyLoading: lazyLoading, onScroll: onScroll })] }));
}

/**
 * Creates a mock DynamicValue with status "available" and the given value.
 * Used in editor preview mode to provide static DynamicValue instances.
 */
function dynamic(value) {
    return { status: "available", value };
}

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;
  if (!css || typeof document === 'undefined') {
    return;
  }
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".widget-combobox {\n  min-width: 0;\n  flex-grow: 1;\n  position: relative;\n  transition: color 150ms ease 0s;\n}\n.widget-combobox .widget-grouped-combobox-menu {\n  position: absolute;\n  display: inline;\n  border-radius: var(--dropdown-border-radius, 12px);\n  margin: var(--spacing-smaller, 4px) 0 var(--spacing-smaller, 4px) 0;\n  width: 100%;\n  left: unset;\n  padding: var(--dropdown-outer-padding, 10px) 0 0;\n  z-index: 25;\n  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.12);\n  background-color: var(--label-info-color, #ffffff);\n  list-style-type: none;\n  overflow: hidden;\n}\n.widget-combobox .widget-grouped-combobox-menu-list {\n  padding: 0;\n  margin-bottom: 0;\n  max-height: 320px;\n  overflow-y: auto;\n}\n.widget-combobox .widget-grouped-combobox-menu-list:last-child {\n  margin-bottom: var(--dropdown-outer-padding, 10px);\n}\n.widget-combobox .widget-grouped-combobox-menu-lazy-scroll {\n  background: linear-gradient(white 30%, rgba(255, 255, 255, 0)) center top, linear-gradient(rgba(255, 255, 255, 0), white 70%) center bottom, linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(197, 197, 197, 0.6)) center top, linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(197, 197, 197, 0.6)) center bottom;\n  background-repeat: no-repeat;\n  background-size: 100% 70px, 100% 70px, 100% 35px, 100% 35px;\n  background-attachment: local, local, scroll, scroll;\n}\n.widget-combobox .widget-grouped-combobox-menu-hidden {\n  display: none;\n}\n.widget-combobox .widget-grouped-combobox-menu-header {\n  padding: 12px 16px 10px;\n  background-color: #ffffff;\n  border-bottom: 1px solid #e9e9ee;\n  width: 100%;\n  box-sizing: border-box;\n  display: block;\n}\n.widget-combobox .widget-grouped-combobox-menu-header:focus, .widget-combobox .widget-grouped-combobox-menu-header:focus-within, .widget-combobox .widget-grouped-combobox-menu-header:hover {\n  background-color: #ffffff;\n}\n.widget-combobox .widget-grouped-combobox-menu-header-title {\n  display: block;\n  width: 100%;\n  margin: 0;\n  padding-bottom: 8px;\n  border-bottom: 1px solid #dfe3ea;\n  color: #1f2430;\n  font-size: 16px;\n  font-weight: 700;\n  line-height: 1.2;\n}\n.widget-combobox .widget-grouped-combobox-menu-header-select-all-button + label {\n  transition: color 0.2s ease-in-out;\n}\n.widget-combobox .widget-grouped-combobox-menu-header-select-all-button-disabled + label {\n  color: var(--color-default-dark, #6c7180);\n}\n.widget-combobox .widget-grouped-combobox-menu-footer {\n  border-top: 1px solid var(--gray-primary, #ced0d3);\n  padding: var(--dropdown-outer-padding, 10px);\n}\n.widget-combobox .widget-grouped-combobox-menu-footer:focus, .widget-combobox .widget-grouped-combobox-menu-footer:focus-within {\n  outline: 1px solid var(--brand-primary, #264ae5);\n}\n.widget-combobox .widget-grouped-combobox-item {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  align-content: center;\n  align-items: center;\n  cursor: pointer;\n  user-select: none;\n  padding: 12px 16px;\n  height: fit-content;\n  overflow: hidden;\n  color: #3b4251;\n  font-size: 14px;\n  font-weight: 400;\n  background-color: #ffffff;\n  transition: background-color 0.15s ease, color 0.15s ease;\n}\n.widget-combobox .widget-grouped-combobox-item-selected {\n  background-color: #f5f6f6;\n}\n.widget-combobox .widget-grouped-combobox-item-highlighted, .widget-combobox .widget-grouped-combobox-item:focus, .widget-combobox .widget-grouped-combobox-item:hover {\n  background-color: rgba(248, 214, 224, 0.22);\n}\n.widget-combobox .widget-grouped-combobox-item > .widget-combobox-icon-container {\n  margin-inline-end: var(--dropdown-outer-padding, 10px);\n}\n.widget-combobox .widget-grouped-combobox-item > .widget-combobox-icon-container input[type=checkbox] {\n  width: 18px;\n  height: 18px;\n  cursor: pointer;\n  accent-color: #8b1a4a;\n}\n.widget-combobox .widget-grouped-combobox-item .widget-combobox-caption-text {\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n  flex: 1;\n  font-weight: normal;\n  margin: 0;\n  min-height: 20px;\n}\n.widget-combobox .widget-grouped-combobox-item.widget-combobox-no-options {\n  justify-content: center;\n}\n.widget-combobox .widget-grouped-combobox-group-header {\n  display: flex;\n  align-items: center;\n  padding: 10px 16px;\n  margin: 0;\n  cursor: default;\n  user-select: none;\n  pointer-events: none;\n  list-style: none;\n  background-color: #ffffff;\n  position: relative;\n}\n.widget-combobox .widget-grouped-combobox-group-header::after {\n  content: \"\";\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: 1px;\n  background-color: #d0d4dc;\n  display: block !important;\n  z-index: 1;\n  pointer-events: none;\n}\n.widget-combobox .widget-grouped-combobox-group-header-text {\n  font-size: 17px;\n  font-weight: 700;\n  color: #1f2430;\n  line-height: 1.4;\n}\n.widget-combobox .widget-grouped-combobox-menu-list > .widget-grouped-combobox-group-header ~ .widget-grouped-combobox-group-header {\n  margin-top: 6px;\n}\n.widget-grouped-combobox .widget-combobox-clear-button, .widget-grouped-combobox .widget-combobox-clear-button:focus, .widget-grouped-combobox .widget-combobox-clear-button:focus-visible, .widget-grouped-combobox .widget-combobox-clear-button:active, .widget-grouped-combobox .widget-combobox-clear-button:hover,\n.widget-grouped-combobox .widget-combobox-selected-item-remove-button,\n.widget-grouped-combobox .widget-combobox-selected-item-remove-button:focus,\n.widget-grouped-combobox .widget-combobox-selected-item-remove-button:focus-visible,\n.widget-grouped-combobox .widget-combobox-selected-item-remove-button:active,\n.widget-grouped-combobox .widget-combobox-selected-item-remove-button:hover {\n  outline: none !important;\n  box-shadow: none !important;\n  border: none !important;\n  background-color: transparent !important;\n}\n.widget-grouped-combobox .widget-combobox-selected-item:focus, .widget-grouped-combobox .widget-combobox-selected-item:focus-visible, .widget-grouped-combobox .widget-combobox-selected-item:active {\n  outline: none !important;\n  box-shadow: none !important;\n}\n/*# sourceMappingURL=inline */\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvUHJhdGhpc2hrdW1hclRoaXlhZ2EvRG93bmxvYWRzL0NvbWJvYm94LXdlYiUyMCgyKSUyMCgxKS9Db21ib2JveC13ZWIvc3JjL3VpL0dyb3VwZWRDb21ib2JveC5zY3NzIiwiR3JvdXBlZENvbWJvYm94LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBcUJBO0VBQ0ksWUFBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtFQUNBLCtCQUFBO0FDcEJKO0FEc0JJO0VBQ0ksa0JBQUE7RUFDQSxlQUFBO0VBQ0Esa0RBQUE7RUFDQSxtRUFBQTtFQUNBLFdBQUE7RUFDQSxXQUFBO0VBQ0EsZ0RBQUE7RUFDQSxXQUFBO0VBQ0EsNENBQUE7RUFDQSxrREFBQTtFQUNBLHFCQUFBO0VBQ0EsZ0JBQUE7QUNwQlI7QURzQlE7RUFDSSxVQUFBO0VBQ0EsZ0JBQUE7RUFDQSxpQkFBQTtFQUNBLGdCQUFBO0FDcEJaO0FEc0JZO0VBQ0ksa0RBQUE7QUNwQmhCO0FEd0JRO0VBQ0ksNFRBQ0k7RUFLSiw0QkFBQTtFQUNBLDJEQUNJO0VBSUosbURBQUE7QUMvQlo7QURrQ1E7RUFDSSxhQUFBO0FDaENaO0FEbUNRO0VBQ0ksdUJBQUE7RUFDQSx5QkFBQTtFQUNBLGdDQUFBO0VBQ0EsV0FBQTtFQUNBLHNCQUFBO0VBQ0EsY0FBQTtBQ2pDWjtBRG1DWTtFQUdJLHlCQUFBO0FDbkNoQjtBRHNDWTtFQUNJLGNBQUE7RUFDQSxXQUFBO0VBQ0EsU0FBQTtFQUNBLG1CQUFBO0VBQ0EsZ0NBQUE7RUFDQSxjQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsZ0JBQUE7QUNwQ2hCO0FEd0NnQjtFQUNJLGtDQUFBO0FDdENwQjtBRHlDZ0I7RUFDSSx5Q0FBQTtBQ3ZDcEI7QUQ0Q1E7RUFDSSxrREFBQTtFQUNBLDRDQUFBO0FDMUNaO0FENENZO0VBRUksZ0RBQUE7QUMzQ2hCO0FEZ0RJO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsaUJBQUE7RUFDQSxxQkFBQTtFQUNBLG1CQUFBO0VBQ0EsZUFBQTtFQUNBLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxtQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHlCQUFBO0VBQ0EseURBQUE7QUM5Q1I7QURnRFE7RUFDSSx5QkFBQTtBQzlDWjtBRGlEUTtFQUdJLDJDQUFBO0FDakRaO0FEb0RRO0VBQ0ksc0RBQUE7QUNsRFo7QURxRFk7RUFDSSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGVBQUE7RUFDQSxxQkF4SUU7QUNxRmxCO0FEdURRO0VBQ0ksdUJBQUE7RUFDQSxnQkFBQTtFQUNBLG1CQUFBO0VBQ0EsT0FBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtFQUNBLGdCQUFBO0FDckRaO0FEd0RRO0VBQ0ksdUJBQUE7QUN0RFo7QURtRUk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLFNBQUE7RUFDQSxlQUFBO0VBQ0EsaUJBQUE7RUFDQSxvQkFBQTtFQUNBLGdCQUFBO0VBQ0EseUJBQUE7RUFDQSxrQkFBQTtBQ2pFUjtBRG9FUTtFQUNJLFdBQUE7RUFDQSxrQkFBQTtFQUNBLFNBQUE7RUFDQSxPQUFBO0VBQ0EsUUFBQTtFQUNBLFdBQUE7RUFDQSx5QkFBQTtFQUNBLHlCQUFBO0VBQ0EsVUFBQTtFQUNBLG9CQUFBO0FDbEVaO0FEcUVRO0VBQ0ksZUFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLGdCQUFBO0FDbkVaO0FEeUVRO0VBQ0ksZUFBQTtBQ3ZFWjtBRGdGUTs7Ozs7O0VBQ0ksd0JBQUE7RUFDQSwyQkFBQTtFQUNBLHVCQUFBO0VBQ0Esd0NBQUE7QUN4RVo7QUQ2RVE7RUFHSSx3QkFBQTtFQUNBLDJCQUFBO0FDN0VaO0FBRUEsNkJBQTZCIiwiZmlsZSI6Ikdyb3VwZWRDb21ib2JveC5zY3NzIn0= */";
styleInject(css_248z);

class AssociationSimpleCaptionsProvider {
    optionsMap;
    unavailableCaption = "<...>";
    formatter;
    customContent;
    customContentType = "no";
    emptyCaption = "";
    groupFormatter;
    constructor(optionsMap) {
        this.optionsMap = optionsMap;
    }
    updateProps(props) {
        if (!props.emptyOptionText || props.emptyOptionText.status === "unavailable") {
            this.emptyCaption = "";
        }
        else {
            this.emptyCaption = props.emptyOptionText.value;
        }
        this.formatter = props.formattingAttributeOrExpression;
        this.customContent = props.customContent;
        this.customContentType = props.customContentType;
        this.groupFormatter = props.groupAttribute;
    }
    get(value) {
        if (value === null) {
            return this.emptyCaption;
        }
        if (!this.formatter) {
            throw new Error("AssociationSimpleCaptionRenderer: no formatter available.");
        }
        const item = this.optionsMap.get(value);
        if (!item) {
            return this.unavailableCaption;
        }
        const captionValue = this.formatter.get(item);
        if (!captionValue || captionValue.status === "unavailable") {
            return this.unavailableCaption;
        }
        if (captionValue.value !== undefined && captionValue.value !== null) {
            return String(captionValue.value);
        }
        return "";
    }
    /**
     * Returns the group title for the given item ID.
     * Returns null when no group attribute is configured or the value is unavailable.
     */
    getGroup(value) {
        if (!this.groupFormatter) {
            return null;
        }
        const item = this.optionsMap.get(value);
        if (!item) {
            return null;
        }
        const groupValue = this.groupFormatter.get(item);
        if (!groupValue || groupValue.status !== "available" || !groupValue.displayValue) {
            return null;
        }
        return groupValue.displayValue;
    }
    getCustomContent(value) {
        if (value === null) {
            return null;
        }
        const item = this.optionsMap.get(value);
        if (!item) {
            return null;
        }
        return this.customContent?.get(item);
    }
    render(value, placement, htmlFor) {
        const { customContentType } = this;
        return customContentType === "no" ||
            (placement === "label" && customContentType === "listItem") ||
            value === null ? (jsxRuntime.jsx(CaptionContent, { htmlFor: htmlFor, children: this.get(value) })) : (jsxRuntime.jsx("div", { className: "widget-combobox-caption-custom", children: this.getCustomContent(value) }));
    }
}

class AssociationPreviewCaptionsProvider extends AssociationSimpleCaptionsProvider {
    emptyCaption = "Combo box";
    customContentRenderer = () => jsxRuntime.jsx("div", {});
    get(value) {
        return value || this.emptyCaption;
    }
    getCustomContent(value) {
        if (value === null) {
            return null;
        }
        if (this.customContentType !== "no") {
            return (jsxRuntime.jsx(this.customContentRenderer, { caption: "CUSTOM CONTENT", children: jsxRuntime.jsx("div", {}) }));
        }
    }
    updatePreviewProps(props) {
        this.customContentRenderer = props.customContentRenderer;
        this.customContentType = props.customContentType;
    }
    render(value, placement, htmlFor) {
        // always render custom content dropzone in design mode if type is options only
        if (placement === "options") {
            return jsxRuntime.jsx(CaptionContent, { htmlFor: htmlFor, children: this.get(value) });
        }
        return super.render(value, placement === "label" ? "options" : placement);
    }
}

class AssociationPreviewOptionsProvider {
    caption;
    valuesMap;
    filterType = "contains";
    hasMore = undefined;
    searchTerm = "";
    status = "available";
    isLoading = false;
    constructor(caption, valuesMap) {
        this.caption = caption;
        this.valuesMap = valuesMap;
    }
    onAfterSearchTermChange(_callback) { }
    setSearchTerm(_value) { }
    loadMore() {
        throw new Error("Method not implemented.");
    }
    _updateProps(_) {
        throw new Error("Method not implemented.");
    }
    _optionToValue(_value) {
        throw new Error("Method not implemented.");
    }
    _valueToOption(_value) {
        throw new Error("Method not implemented.");
    }
    getAll() {
        return ["..."];
    }
}

class AssociationPreviewSelector {
    attributeType;
    caption;
    clearable;
    currentId;
    customContentType;
    lazyLoading = false;
    loadingType = "skeleton";
    options;
    readOnly;
    selectorType;
    status = "available";
    type = "single";
    validation;
    onEnterEvent;
    onLeaveEvent;
    constructor(props) {
        this.caption = new AssociationPreviewCaptionsProvider(new Map());
        this.clearable = props.clearable;
        this.currentId = getDatasourcePlaceholderText(props);
        this.customContentType = props.optionsSourceAssociationCustomContentType;
        this.options = new AssociationPreviewOptionsProvider(this.caption, new Map());
        this.readOnly = props.readOnly;
        this.caption.updatePreviewProps({
            customContentRenderer: props.optionsSourceAssociationCustomContent.renderer,
            customContentType: props.optionsSourceAssociationCustomContentType
        });
        if (props.optionsSourceAssociationCustomContentType === "listItem") {
            // always render custom content dropzone in design mode if type is options only
            this.customContentType = "yes";
        }
    }
    setValue(_) {
        throw new Error("Method not implemented.");
    }
    updateProps(_) {
        throw new Error("Method not implemented.");
    }
}

class StaticPreviewCaptionsProvider {
    optionsMap;
    customContentType;
    dataSourcePlaceholder;
    emptyCaption = "Combo box";
    constructor(optionsMap, customContentType, dataSourcePlaceholder) {
        this.optionsMap = optionsMap;
        this.customContentType = customContentType;
        this.dataSourcePlaceholder = dataSourcePlaceholder;
    }
    get(value) {
        if (value === null) {
            return this.emptyCaption;
        }
        return this.optionsMap.get(value)?.staticDataSourceCaption || this.emptyCaption;
    }
    render(value, placement, htmlFor) {
        // always render custom content dropzone in design mode if type is options only
        if (value === null) {
            return jsxRuntime.jsx("div", { children: this.dataSourcePlaceholder });
        }
        const item = this.optionsMap.get(value).staticDataSourceCustomContent;
        const ItemRenderer = item.renderer;
        return this.customContentType === "no" ||
            (placement === "label" && this.customContentType === "listItem") ||
            value === null ? (jsxRuntime.jsx(CaptionContent, { htmlFor: htmlFor, children: this.get(value) })) : (jsxRuntime.jsx("div", { className: "widget-combobox-caption-custom", children: jsxRuntime.jsx(ItemRenderer, { caption: `Custom content for ${this.get(value)}`, children: jsxRuntime.jsx("div", {}) }) }));
    }
}

class StaticPreviewOptionsProvider {
    optionsMap;
    status = "available";
    filterType = "contains";
    searchTerm = "";
    hasMore = undefined;
    isLoading = false;
    constructor(optionsMap) {
        this.optionsMap = optionsMap;
    }
    setSearchTerm(_value) { }
    onAfterSearchTermChange(_callback) { }
    loadMore() {
        throw new Error("Method not implemented.");
    }
    _updateProps(_) {
        throw new Error("Method not implemented.");
    }
    _optionToValue(_value) {
        throw new Error("Method not implemented.");
    }
    _valueToOption(_value) {
        throw new Error("Method not implemented.");
    }
    getAll() {
        return this.optionsMap.size ? Array.from(this.optionsMap.keys()) : ["..."];
    }
}

class StaticPreviewSelector {
    type = "single";
    status = "available";
    readOnly = false;
    validation = undefined;
    options;
    caption;
    clearable;
    currentId;
    customContentType = "listItem";
    onEnterEvent;
    onLeaveEvent;
    constructor(props) {
        const optionsMap = new Map();
        this.caption = new StaticPreviewCaptionsProvider(optionsMap, props.staticDataSourceCustomContentType, getDatasourcePlaceholderText(props));
        this.options = new StaticPreviewOptionsProvider(optionsMap);
        this.readOnly = props.readOnly;
        this.clearable = props.clearable;
        this.currentId = null;
        this.customContentType = props.optionsSourceAssociationCustomContentType;
        if (props.optionsSourceAssociationCustomContentType === "listItem") {
            // always render custom content dropzone in design mode if type is options only
            this.customContentType = "yes";
        }
        props.optionsSourceStaticDataSource.forEach((option, index) => {
            optionsMap.set(index.toString(), option);
        });
    }
    setValue(_) {
        throw new Error("Method not implemented.");
    }
    updateProps(_) {
        throw new Error("Method not implemented.");
    }
}

class DatabasePreviewSelector {
    attributeType;
    caption;
    clearable;
    currentId;
    customContentType;
    lazyLoading = false;
    loadingType = "skeleton";
    options;
    readOnly;
    selectorType;
    status = "available";
    type = "single";
    validation;
    onEnterEvent;
    onLeaveEvent;
    constructor(props) {
        this.caption = new AssociationPreviewCaptionsProvider(new Map());
        this.clearable = props.clearable;
        this.currentId = getDatasourcePlaceholderText(props);
        this.customContentType = props.optionsSourceDatabaseCustomContentType;
        this.options = new AssociationPreviewOptionsProvider(this.caption, new Map());
        this.readOnly = props.readOnly;
        this.caption.updatePreviewProps({
            customContentRenderer: props.optionsSourceDatabaseCustomContent.renderer,
            customContentType: props.optionsSourceDatabaseCustomContentType
        });
        if (props.optionsSourceDatabaseCustomContentType === "listItem") {
            // always render custom content dropzone in design mode if type is options only
            this.customContentType = "yes";
        }
    }
    setValue(_) {
        throw new Error("Method not implemented.");
    }
    updateProps(_) {
        throw new Error("Method not implemented.");
    }
}

const preview = (props) => {
    const id = generateUUID().toString();
    const commonProps = {
        tabIndex: 1,
        inputId: id,
        labelId: `${id}-label`,
        readOnlyStyle: props.readOnlyStyle,
        ariaRequired: dynamic(false),
        a11yConfig: {
            ariaLabels: {
                clearSelection: props.clearButtonAriaLabel,
                removeSelection: props.removeValueAriaLabel,
                selectAll: props.selectAllButtonCaption
            },
            a11yStatusMessage: {
                a11ySelectedValue: props.a11ySelectedValue,
                a11yOptionsAvailable: props.a11yOptionsAvailable,
                a11yInstructions: props.a11yInstructions,
                a11yNoOption: props.noOptionsText
            }
        },
        menuFooterContent: props.showFooter ? (jsxRuntime.jsx(props.menuFooterContent.renderer, { caption: "Place footer widget here", children: jsxRuntime.jsx("div", {}) })) : null,
        keepMenuOpen: props.showFooter ||
            (props.optionsSourceStaticDataSource.length > 0 && props.staticDataSourceCustomContentType !== "no")
    };
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const selector = react.useMemo(() => {
        if (props.source === "static") {
            return new StaticPreviewSelector(props);
        }
        if (props.source === "database") {
            return new DatabasePreviewSelector(props);
        }
        return new AssociationPreviewSelector(props);
    }, [props]);
    return (jsxRuntime.jsx("div", { className: "widget-combobox widget-grouped-combobox widget-combobox-editor-preview", children: jsxRuntime.jsx(SingleSelection, { selector: selector, ...commonProps }) }));
};

exports.preview = preview;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXBlZENvbWJvYm94LmVkaXRvclByZXZpZXcuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zaGltcy93aWRnZXQtcGx1Z2luLXBsYXRmb3JtL2ZyYW1ld29yay9nZW5lcmF0ZS11dWlkLnRzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NsYXNzbmFtZXMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYmlnLmpzL2JpZy5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtb3ZlLWFjY2VudHMvaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvaGVscGVycy91dGlscy50cyIsIi4uLy4uLy4uL3NyYy9hc3NldHMvaWNvbnMudHN4IiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vZXh0ZW5kcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vc2V0UHJvdG90eXBlT2YuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vaW5oZXJpdHNMb29zZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL25vZGVfbW9kdWxlcy9yZWFjdC1pcy9janMvcmVhY3QtaXMuZGV2ZWxvcG1lbnQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9ub2RlX21vZHVsZXMvcmVhY3QtaXMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2xpYi9oYXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9jaGVja1Byb3BUeXBlcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtaXMvY2pzL3JlYWN0LWlzLmRldmVsb3BtZW50LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWlzL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9kb3duc2hpZnQvZGlzdC9kb3duc2hpZnQuZXNtLmpzIiwiLi4vLi4vLi4vc3JjL2hvb2tzL3VzZURvd25zaGlmdFNpbmdsZVNlbGVjdFByb3BzLnRzIiwiLi4vLi4vLi4vc3JjL3NoaW1zL3dpZGdldC1wbHVnaW4tZ3JpZC9jb21wb25lbnRzL0luZmluaXRlQm9keS50cyIsIi4uLy4uLy4uL3NyYy9ob29rcy91c2VMYXp5TG9hZGluZy50cyIsIi4uLy4uLy4uL3NyYy9zaGltcy93aWRnZXQtcGx1Z2luLWNvbXBvbmVudC1raXQvQWxlcnQudHN4IiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvU3Bpbm5lckxvYWRlci50c3giLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9Db21ib2JveFdyYXBwZXIudHN4IiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvUGxhY2Vob2xkZXIudHN4IiwiLi4vLi4vLi4vc3JjL2hlbHBlcnMvZ3JvdXBpbmdVdGlscy50cyIsIi4uLy4uLy4uL3NyYy9zaGltcy93aWRnZXQtcGx1Z2luLWhvb2tzL3VzZVBvc2l0aW9uT2JzZXJ2ZXIudHMiLCIuLi8uLi8uLi9zcmMvc2hpbXMvd2lkZ2V0LXBsdWdpbi1wbGF0Zm9ybS91dGlscy9kZWJvdW5jZS50cyIsIi4uLy4uLy4uL3NyYy9ob29rcy91c2VNZW51U3R5bGUudHMiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9Db21ib2JveE1lbnVXcmFwcGVyLnRzeCIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0NvbWJvYm94T3B0aW9uV3JhcHBlci50c3giLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9Db21ib2JveEdyb3VwSGVhZGVyLnRzeCIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1NrZWxldG9uTG9hZGVyLnRzeCIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0xvYWRlci50c3giLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9TaW5nbGVTZWxlY3Rpb24vU2luZ2xlU2VsZWN0aW9uTWVudS50c3giLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9TaW5nbGVTZWxlY3Rpb24vU2luZ2xlU2VsZWN0aW9uLnRzeCIsIi4uLy4uLy4uL3NyYy9zaGltcy93aWRnZXQtcGx1Z2luLXRlc3QtdXRpbHMvaW5kZXgudHMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtaW5qZWN0L2Rpc3Qvc3R5bGUtaW5qZWN0LmVzLmpzIiwiLi4vLi4vLi4vc3JjL2hlbHBlcnMvQXNzb2NpYXRpb24vQXNzb2NpYXRpb25TaW1wbGVDYXB0aW9uc1Byb3ZpZGVyLnRzeCIsIi4uLy4uLy4uL3NyYy9oZWxwZXJzL0Fzc29jaWF0aW9uL1ByZXZpZXcvQXNzb2NpYXRpb25QcmV2aWV3Q2FwdGlvbnNQcm92aWRlci50c3giLCIuLi8uLi8uLi9zcmMvaGVscGVycy9Bc3NvY2lhdGlvbi9QcmV2aWV3L0Fzc29jaWF0aW9uUHJldmlld09wdGlvbnNQcm92aWRlci50cyIsIi4uLy4uLy4uL3NyYy9oZWxwZXJzL0Fzc29jaWF0aW9uL1ByZXZpZXcvQXNzb2NpYXRpb25QcmV2aWV3U2VsZWN0b3IudHMiLCIuLi8uLi8uLi9zcmMvaGVscGVycy9TdGF0aWMvUHJldmlldy9TdGF0aWNQcmV2aWV3Q2FwdGlvbnNQcm92aWRlci50c3giLCIuLi8uLi8uLi9zcmMvaGVscGVycy9TdGF0aWMvUHJldmlldy9TdGF0aWNQcmV2aWV3T3B0aW9uc1Byb3ZpZGVyLnRzIiwiLi4vLi4vLi4vc3JjL2hlbHBlcnMvU3RhdGljL1ByZXZpZXcvU3RhdGljUHJldmlld1NlbGVjdG9yLnRzIiwiLi4vLi4vLi4vc3JjL2hlbHBlcnMvRGF0YWJhc2UvUHJldmlldy9EYXRhYmFzZVByZXZpZXdTZWxlY3Rvci50cyIsIi4uLy4uLy4uL3NyYy9Hcm91cGVkQ29tYm9ib3guZWRpdG9yUHJldmlldy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlVVVJRCgpOiBzdHJpbmcge1xuICAgIGlmICh0eXBlb2YgY3J5cHRvICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBjcnlwdG8ucmFuZG9tVVVJRCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8ucmFuZG9tVVVJRCgpO1xuICAgIH1cbiAgICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KDE2KTtcbiAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ5dGVzKTtcbiAgICBieXRlc1s2XSA9IChieXRlc1s2XSAmIDB4MGYpIHwgMHg0MDtcbiAgICBieXRlc1s4XSA9IChieXRlc1s4XSAmIDB4M2YpIHwgMHg4MDtcbiAgICBjb25zdCBoZXggPSBBcnJheS5mcm9tKGJ5dGVzLCBiID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsIFwiMFwiKSkuam9pbihcIlwiKTtcbiAgICByZXR1cm4gYCR7aGV4LnNsaWNlKDAsIDgpfS0ke2hleC5zbGljZSg4LCAxMil9LSR7aGV4LnNsaWNlKDEyLCAxNil9LSR7aGV4LnNsaWNlKDE2LCAyMCl9LSR7aGV4LnNsaWNlKDIwKX1gO1xufVxuIiwiLyohXG5cdENvcHlyaWdodCAoYykgMjAxOCBKZWQgV2F0c29uLlxuXHRMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKE1JVCksIHNlZVxuXHRodHRwOi8vamVkd2F0c29uLmdpdGh1Yi5pby9jbGFzc25hbWVzXG4qL1xuLyogZ2xvYmFsIGRlZmluZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGhhc093biA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5cdGZ1bmN0aW9uIGNsYXNzTmFtZXMgKCkge1xuXHRcdHZhciBjbGFzc2VzID0gJyc7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGFyZyA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdGlmIChhcmcpIHtcblx0XHRcdFx0Y2xhc3NlcyA9IGFwcGVuZENsYXNzKGNsYXNzZXMsIHBhcnNlVmFsdWUoYXJnKSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsYXNzZXM7XG5cdH1cblxuXHRmdW5jdGlvbiBwYXJzZVZhbHVlIChhcmcpIHtcblx0XHRpZiAodHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcblx0XHRcdHJldHVybiBhcmc7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBhcmcgIT09ICdvYmplY3QnKSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuXHRcdFx0cmV0dXJuIGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKTtcblx0XHR9XG5cblx0XHRpZiAoYXJnLnRvU3RyaW5nICE9PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nICYmICFhcmcudG9TdHJpbmcudG9TdHJpbmcoKS5pbmNsdWRlcygnW25hdGl2ZSBjb2RlXScpKSB7XG5cdFx0XHRyZXR1cm4gYXJnLnRvU3RyaW5nKCk7XG5cdFx0fVxuXG5cdFx0dmFyIGNsYXNzZXMgPSAnJztcblxuXHRcdGZvciAodmFyIGtleSBpbiBhcmcpIHtcblx0XHRcdGlmIChoYXNPd24uY2FsbChhcmcsIGtleSkgJiYgYXJnW2tleV0pIHtcblx0XHRcdFx0Y2xhc3NlcyA9IGFwcGVuZENsYXNzKGNsYXNzZXMsIGtleSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsYXNzZXM7XG5cdH1cblxuXHRmdW5jdGlvbiBhcHBlbmRDbGFzcyAodmFsdWUsIG5ld0NsYXNzKSB7XG5cdFx0aWYgKCFuZXdDbGFzcykge1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH1cblx0XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gdmFsdWUgKyAnICcgKyBuZXdDbGFzcztcblx0XHR9XG5cdFxuXHRcdHJldHVybiB2YWx1ZSArIG5ld0NsYXNzO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0Y2xhc3NOYW1lcy5kZWZhdWx0ID0gY2xhc3NOYW1lcztcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGNsYXNzTmFtZXM7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIHJlZ2lzdGVyIGFzICdjbGFzc25hbWVzJywgY29uc2lzdGVudCB3aXRoIG5wbSBwYWNrYWdlIG5hbWVcblx0XHRkZWZpbmUoJ2NsYXNzbmFtZXMnLCBbXSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGNsYXNzTmFtZXM7XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0d2luZG93LmNsYXNzTmFtZXMgPSBjbGFzc05hbWVzO1xuXHR9XG59KCkpO1xuIiwiLypcclxuICogIGJpZy5qcyB2Ni4yLjJcclxuICogIEEgc21hbGwsIGZhc3QsIGVhc3ktdG8tdXNlIGxpYnJhcnkgZm9yIGFyYml0cmFyeS1wcmVjaXNpb24gZGVjaW1hbCBhcml0aG1ldGljLlxyXG4gKiAgQ29weXJpZ2h0IChjKSAyMDI0IE1pY2hhZWwgTWNsYXVnaGxpblxyXG4gKiAgaHR0cHM6Ly9naXRodWIuY29tL01pa2VNY2wvYmlnLmpzL0xJQ0VOQ0UubWRcclxuICovXHJcblxyXG5cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEVESVRBQkxFIERFRkFVTFRTICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuXHJcbiAgLy8gVGhlIGRlZmF1bHQgdmFsdWVzIGJlbG93IG11c3QgYmUgaW50ZWdlcnMgd2l0aGluIHRoZSBzdGF0ZWQgcmFuZ2VzLlxyXG5cclxuICAvKlxyXG4gICAqIFRoZSBtYXhpbXVtIG51bWJlciBvZiBkZWNpbWFsIHBsYWNlcyAoRFApIG9mIHRoZSByZXN1bHRzIG9mIG9wZXJhdGlvbnMgaW52b2x2aW5nIGRpdmlzaW9uOlxyXG4gICAqIGRpdiBhbmQgc3FydCwgYW5kIHBvdyB3aXRoIG5lZ2F0aXZlIGV4cG9uZW50cy5cclxuICAgKi9cclxudmFyIERQID0gMjAsICAgICAgICAgIC8vIDAgdG8gTUFYX0RQXHJcblxyXG4gIC8qXHJcbiAgICogVGhlIHJvdW5kaW5nIG1vZGUgKFJNKSB1c2VkIHdoZW4gcm91bmRpbmcgdG8gdGhlIGFib3ZlIGRlY2ltYWwgcGxhY2VzLlxyXG4gICAqXHJcbiAgICogIDAgIFRvd2FyZHMgemVybyAoaS5lLiB0cnVuY2F0ZSwgbm8gcm91bmRpbmcpLiAgICAgICAoUk9VTkRfRE9XTilcclxuICAgKiAgMSAgVG8gbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCByb3VuZCB1cC4gIChST1VORF9IQUxGX1VQKVxyXG4gICAqICAyICBUbyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvIGV2ZW4uICAgKFJPVU5EX0hBTEZfRVZFTilcclxuICAgKiAgMyAgQXdheSBmcm9tIHplcm8uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChST1VORF9VUClcclxuICAgKi9cclxuICBSTSA9IDEsICAgICAgICAgICAgIC8vIDAsIDEsIDIgb3IgM1xyXG5cclxuICAvLyBUaGUgbWF4aW11bSB2YWx1ZSBvZiBEUCBhbmQgQmlnLkRQLlxyXG4gIE1BWF9EUCA9IDFFNiwgICAgICAgLy8gMCB0byAxMDAwMDAwXHJcblxyXG4gIC8vIFRoZSBtYXhpbXVtIG1hZ25pdHVkZSBvZiB0aGUgZXhwb25lbnQgYXJndW1lbnQgdG8gdGhlIHBvdyBtZXRob2QuXHJcbiAgTUFYX1BPV0VSID0gMUU2LCAgICAvLyAxIHRvIDEwMDAwMDBcclxuXHJcbiAgLypcclxuICAgKiBUaGUgbmVnYXRpdmUgZXhwb25lbnQgKE5FKSBhdCBhbmQgYmVuZWF0aCB3aGljaCB0b1N0cmluZyByZXR1cm5zIGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAqIChKYXZhU2NyaXB0IG51bWJlcnM6IC03KVxyXG4gICAqIC0xMDAwMDAwIGlzIHRoZSBtaW5pbXVtIHJlY29tbWVuZGVkIGV4cG9uZW50IHZhbHVlIG9mIGEgQmlnLlxyXG4gICAqL1xyXG4gIE5FID0gLTcsICAgICAgICAgICAgLy8gMCB0byAtMTAwMDAwMFxyXG5cclxuICAvKlxyXG4gICAqIFRoZSBwb3NpdGl2ZSBleHBvbmVudCAoUEUpIGF0IGFuZCBhYm92ZSB3aGljaCB0b1N0cmluZyByZXR1cm5zIGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAqIChKYXZhU2NyaXB0IG51bWJlcnM6IDIxKVxyXG4gICAqIDEwMDAwMDAgaXMgdGhlIG1heGltdW0gcmVjb21tZW5kZWQgZXhwb25lbnQgdmFsdWUgb2YgYSBCaWcsIGJ1dCB0aGlzIGxpbWl0IGlzIG5vdCBlbmZvcmNlZC5cclxuICAgKi9cclxuICBQRSA9IDIxLCAgICAgICAgICAgIC8vIDAgdG8gMTAwMDAwMFxyXG5cclxuICAvKlxyXG4gICAqIFdoZW4gdHJ1ZSwgYW4gZXJyb3Igd2lsbCBiZSB0aHJvd24gaWYgYSBwcmltaXRpdmUgbnVtYmVyIGlzIHBhc3NlZCB0byB0aGUgQmlnIGNvbnN0cnVjdG9yLFxyXG4gICAqIG9yIGlmIHZhbHVlT2YgaXMgY2FsbGVkLCBvciBpZiB0b051bWJlciBpcyBjYWxsZWQgb24gYSBCaWcgd2hpY2ggY2Fubm90IGJlIGNvbnZlcnRlZCB0byBhXHJcbiAgICogcHJpbWl0aXZlIG51bWJlciB3aXRob3V0IGEgbG9zcyBvZiBwcmVjaXNpb24uXHJcbiAgICovXHJcbiAgU1RSSUNUID0gZmFsc2UsICAgICAvLyB0cnVlIG9yIGZhbHNlXHJcblxyXG5cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuXHJcbiAgLy8gRXJyb3IgbWVzc2FnZXMuXHJcbiAgTkFNRSA9ICdbYmlnLmpzXSAnLFxyXG4gIElOVkFMSUQgPSBOQU1FICsgJ0ludmFsaWQgJyxcclxuICBJTlZBTElEX0RQID0gSU5WQUxJRCArICdkZWNpbWFsIHBsYWNlcycsXHJcbiAgSU5WQUxJRF9STSA9IElOVkFMSUQgKyAncm91bmRpbmcgbW9kZScsXHJcbiAgRElWX0JZX1pFUk8gPSBOQU1FICsgJ0RpdmlzaW9uIGJ5IHplcm8nLFxyXG5cclxuICAvLyBUaGUgc2hhcmVkIHByb3RvdHlwZSBvYmplY3QuXHJcbiAgUCA9IHt9LFxyXG4gIFVOREVGSU5FRCA9IHZvaWQgMCxcclxuICBOVU1FUklDID0gL14tPyhcXGQrKFxcLlxcZCopP3xcXC5cXGQrKShlWystXT9cXGQrKT8kL2k7XHJcblxyXG5cclxuLypcclxuICogQ3JlYXRlIGFuZCByZXR1cm4gYSBCaWcgY29uc3RydWN0b3IuXHJcbiAqL1xyXG5mdW5jdGlvbiBfQmlnXygpIHtcclxuXHJcbiAgLypcclxuICAgKiBUaGUgQmlnIGNvbnN0cnVjdG9yIGFuZCBleHBvcnRlZCBmdW5jdGlvbi5cclxuICAgKiBDcmVhdGUgYW5kIHJldHVybiBhIG5ldyBpbnN0YW5jZSBvZiBhIEJpZyBudW1iZXIgb2JqZWN0LlxyXG4gICAqXHJcbiAgICogbiB7bnVtYmVyfHN0cmluZ3xCaWd9IEEgbnVtZXJpYyB2YWx1ZS5cclxuICAgKi9cclxuICBmdW5jdGlvbiBCaWcobikge1xyXG4gICAgdmFyIHggPSB0aGlzO1xyXG5cclxuICAgIC8vIEVuYWJsZSBjb25zdHJ1Y3RvciB1c2FnZSB3aXRob3V0IG5ldy5cclxuICAgIGlmICghKHggaW5zdGFuY2VvZiBCaWcpKSByZXR1cm4gbiA9PT0gVU5ERUZJTkVEID8gX0JpZ18oKSA6IG5ldyBCaWcobik7XHJcblxyXG4gICAgLy8gRHVwbGljYXRlLlxyXG4gICAgaWYgKG4gaW5zdGFuY2VvZiBCaWcpIHtcclxuICAgICAgeC5zID0gbi5zO1xyXG4gICAgICB4LmUgPSBuLmU7XHJcbiAgICAgIHguYyA9IG4uYy5zbGljZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHR5cGVvZiBuICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGlmIChCaWcuc3RyaWN0ID09PSB0cnVlICYmIHR5cGVvZiBuICE9PSAnYmlnaW50Jykge1xyXG4gICAgICAgICAgdGhyb3cgVHlwZUVycm9yKElOVkFMSUQgKyAndmFsdWUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE1pbnVzIHplcm8/XHJcbiAgICAgICAgbiA9IG4gPT09IDAgJiYgMSAvIG4gPCAwID8gJy0wJyA6IFN0cmluZyhuKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcGFyc2UoeCwgbik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmV0YWluIGEgcmVmZXJlbmNlIHRvIHRoaXMgQmlnIGNvbnN0cnVjdG9yLlxyXG4gICAgLy8gU2hhZG93IEJpZy5wcm90b3R5cGUuY29uc3RydWN0b3Igd2hpY2ggcG9pbnRzIHRvIE9iamVjdC5cclxuICAgIHguY29uc3RydWN0b3IgPSBCaWc7XHJcbiAgfVxyXG5cclxuICBCaWcucHJvdG90eXBlID0gUDtcclxuICBCaWcuRFAgPSBEUDtcclxuICBCaWcuUk0gPSBSTTtcclxuICBCaWcuTkUgPSBORTtcclxuICBCaWcuUEUgPSBQRTtcclxuICBCaWcuc3RyaWN0ID0gU1RSSUNUO1xyXG4gIEJpZy5yb3VuZERvd24gPSAwO1xyXG4gIEJpZy5yb3VuZEhhbGZVcCA9IDE7XHJcbiAgQmlnLnJvdW5kSGFsZkV2ZW4gPSAyO1xyXG4gIEJpZy5yb3VuZFVwID0gMztcclxuXHJcbiAgcmV0dXJuIEJpZztcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFBhcnNlIHRoZSBudW1iZXIgb3Igc3RyaW5nIHZhbHVlIHBhc3NlZCB0byBhIEJpZyBjb25zdHJ1Y3Rvci5cclxuICpcclxuICogeCB7QmlnfSBBIEJpZyBudW1iZXIgaW5zdGFuY2UuXHJcbiAqIG4ge251bWJlcnxzdHJpbmd9IEEgbnVtZXJpYyB2YWx1ZS5cclxuICovXHJcbmZ1bmN0aW9uIHBhcnNlKHgsIG4pIHtcclxuICB2YXIgZSwgaSwgbmw7XHJcblxyXG4gIGlmICghTlVNRVJJQy50ZXN0KG4pKSB7XHJcbiAgICB0aHJvdyBFcnJvcihJTlZBTElEICsgJ251bWJlcicpO1xyXG4gIH1cclxuXHJcbiAgLy8gRGV0ZXJtaW5lIHNpZ24uXHJcbiAgeC5zID0gbi5jaGFyQXQoMCkgPT0gJy0nID8gKG4gPSBuLnNsaWNlKDEpLCAtMSkgOiAxO1xyXG5cclxuICAvLyBEZWNpbWFsIHBvaW50P1xyXG4gIGlmICgoZSA9IG4uaW5kZXhPZignLicpKSA+IC0xKSBuID0gbi5yZXBsYWNlKCcuJywgJycpO1xyXG5cclxuICAvLyBFeHBvbmVudGlhbCBmb3JtP1xyXG4gIGlmICgoaSA9IG4uc2VhcmNoKC9lL2kpKSA+IDApIHtcclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgZXhwb25lbnQuXHJcbiAgICBpZiAoZSA8IDApIGUgPSBpO1xyXG4gICAgZSArPSArbi5zbGljZShpICsgMSk7XHJcbiAgICBuID0gbi5zdWJzdHJpbmcoMCwgaSk7XHJcbiAgfSBlbHNlIGlmIChlIDwgMCkge1xyXG5cclxuICAgIC8vIEludGVnZXIuXHJcbiAgICBlID0gbi5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBubCA9IG4ubGVuZ3RoO1xyXG5cclxuICAvLyBEZXRlcm1pbmUgbGVhZGluZyB6ZXJvcy5cclxuICBmb3IgKGkgPSAwOyBpIDwgbmwgJiYgbi5jaGFyQXQoaSkgPT0gJzAnOykgKytpO1xyXG5cclxuICBpZiAoaSA9PSBubCkge1xyXG5cclxuICAgIC8vIFplcm8uXHJcbiAgICB4LmMgPSBbeC5lID0gMF07XHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKDsgbmwgPiAwICYmIG4uY2hhckF0KC0tbmwpID09ICcwJzspO1xyXG4gICAgeC5lID0gZSAtIGkgLSAxO1xyXG4gICAgeC5jID0gW107XHJcblxyXG4gICAgLy8gQ29udmVydCBzdHJpbmcgdG8gYXJyYXkgb2YgZGlnaXRzIHdpdGhvdXQgbGVhZGluZy90cmFpbGluZyB6ZXJvcy5cclxuICAgIGZvciAoZSA9IDA7IGkgPD0gbmw7KSB4LmNbZSsrXSA9ICtuLmNoYXJBdChpKyspO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHg7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSb3VuZCBCaWcgeCB0byBhIG1heGltdW0gb2Ygc2Qgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgcm0uXHJcbiAqXHJcbiAqIHgge0JpZ30gVGhlIEJpZyB0byByb3VuZC5cclxuICogc2Qge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzOiBpbnRlZ2VyLCAwIHRvIE1BWF9EUCBpbmNsdXNpdmUuXHJcbiAqIHJtIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGU6IDAgKGRvd24pLCAxIChoYWxmLXVwKSwgMiAoaGFsZi1ldmVuKSBvciAzICh1cCkuXHJcbiAqIFttb3JlXSB7Ym9vbGVhbn0gV2hldGhlciB0aGUgcmVzdWx0IG9mIGRpdmlzaW9uIHdhcyB0cnVuY2F0ZWQuXHJcbiAqL1xyXG5mdW5jdGlvbiByb3VuZCh4LCBzZCwgcm0sIG1vcmUpIHtcclxuICB2YXIgeGMgPSB4LmM7XHJcblxyXG4gIGlmIChybSA9PT0gVU5ERUZJTkVEKSBybSA9IHguY29uc3RydWN0b3IuUk07XHJcbiAgaWYgKHJtICE9PSAwICYmIHJtICE9PSAxICYmIHJtICE9PSAyICYmIHJtICE9PSAzKSB7XHJcbiAgICB0aHJvdyBFcnJvcihJTlZBTElEX1JNKTtcclxuICB9XHJcblxyXG4gIGlmIChzZCA8IDEpIHtcclxuICAgIG1vcmUgPVxyXG4gICAgICBybSA9PT0gMyAmJiAobW9yZSB8fCAhIXhjWzBdKSB8fCBzZCA9PT0gMCAmJiAoXHJcbiAgICAgIHJtID09PSAxICYmIHhjWzBdID49IDUgfHxcclxuICAgICAgcm0gPT09IDIgJiYgKHhjWzBdID4gNSB8fCB4Y1swXSA9PT0gNSAmJiAobW9yZSB8fCB4Y1sxXSAhPT0gVU5ERUZJTkVEKSlcclxuICAgICk7XHJcblxyXG4gICAgeGMubGVuZ3RoID0gMTtcclxuXHJcbiAgICBpZiAobW9yZSkge1xyXG5cclxuICAgICAgLy8gMSwgMC4xLCAwLjAxLCAwLjAwMSwgMC4wMDAxIGV0Yy5cclxuICAgICAgeC5lID0geC5lIC0gc2QgKyAxO1xyXG4gICAgICB4Y1swXSA9IDE7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgLy8gWmVyby5cclxuICAgICAgeGNbMF0gPSB4LmUgPSAwO1xyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoc2QgPCB4Yy5sZW5ndGgpIHtcclxuXHJcbiAgICAvLyB4Y1tzZF0gaXMgdGhlIGRpZ2l0IGFmdGVyIHRoZSBkaWdpdCB0aGF0IG1heSBiZSByb3VuZGVkIHVwLlxyXG4gICAgbW9yZSA9XHJcbiAgICAgIHJtID09PSAxICYmIHhjW3NkXSA+PSA1IHx8XHJcbiAgICAgIHJtID09PSAyICYmICh4Y1tzZF0gPiA1IHx8IHhjW3NkXSA9PT0gNSAmJlxyXG4gICAgICAgIChtb3JlIHx8IHhjW3NkICsgMV0gIT09IFVOREVGSU5FRCB8fCB4Y1tzZCAtIDFdICYgMSkpIHx8XHJcbiAgICAgIHJtID09PSAzICYmIChtb3JlIHx8ICEheGNbMF0pO1xyXG5cclxuICAgIC8vIFJlbW92ZSBhbnkgZGlnaXRzIGFmdGVyIHRoZSByZXF1aXJlZCBwcmVjaXNpb24uXHJcbiAgICB4Yy5sZW5ndGggPSBzZDtcclxuXHJcbiAgICAvLyBSb3VuZCB1cD9cclxuICAgIGlmIChtb3JlKSB7XHJcblxyXG4gICAgICAvLyBSb3VuZGluZyB1cCBtYXkgbWVhbiB0aGUgcHJldmlvdXMgZGlnaXQgaGFzIHRvIGJlIHJvdW5kZWQgdXAuXHJcbiAgICAgIGZvciAoOyArK3hjWy0tc2RdID4gOTspIHtcclxuICAgICAgICB4Y1tzZF0gPSAwO1xyXG4gICAgICAgIGlmIChzZCA9PT0gMCkge1xyXG4gICAgICAgICAgKyt4LmU7XHJcbiAgICAgICAgICB4Yy51bnNoaWZ0KDEpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgZm9yIChzZCA9IHhjLmxlbmd0aDsgIXhjWy0tc2RdOykgeGMucG9wKCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geDtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIEJpZyB4IGluIG5vcm1hbCBvciBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICogSGFuZGxlcyBQLnRvRXhwb25lbnRpYWwsIFAudG9GaXhlZCwgUC50b0pTT04sIFAudG9QcmVjaXNpb24sIFAudG9TdHJpbmcgYW5kIFAudmFsdWVPZi5cclxuICovXHJcbmZ1bmN0aW9uIHN0cmluZ2lmeSh4LCBkb0V4cG9uZW50aWFsLCBpc05vbnplcm8pIHtcclxuICB2YXIgZSA9IHguZSxcclxuICAgIHMgPSB4LmMuam9pbignJyksXHJcbiAgICBuID0gcy5sZW5ndGg7XHJcblxyXG4gIC8vIEV4cG9uZW50aWFsIG5vdGF0aW9uP1xyXG4gIGlmIChkb0V4cG9uZW50aWFsKSB7XHJcbiAgICBzID0gcy5jaGFyQXQoMCkgKyAobiA+IDEgPyAnLicgKyBzLnNsaWNlKDEpIDogJycpICsgKGUgPCAwID8gJ2UnIDogJ2UrJykgKyBlO1xyXG5cclxuICAvLyBOb3JtYWwgbm90YXRpb24uXHJcbiAgfSBlbHNlIGlmIChlIDwgMCkge1xyXG4gICAgZm9yICg7ICsrZTspIHMgPSAnMCcgKyBzO1xyXG4gICAgcyA9ICcwLicgKyBzO1xyXG4gIH0gZWxzZSBpZiAoZSA+IDApIHtcclxuICAgIGlmICgrK2UgPiBuKSB7XHJcbiAgICAgIGZvciAoZSAtPSBuOyBlLS07KSBzICs9ICcwJztcclxuICAgIH0gZWxzZSBpZiAoZSA8IG4pIHtcclxuICAgICAgcyA9IHMuc2xpY2UoMCwgZSkgKyAnLicgKyBzLnNsaWNlKGUpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAobiA+IDEpIHtcclxuICAgIHMgPSBzLmNoYXJBdCgwKSArICcuJyArIHMuc2xpY2UoMSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geC5zIDwgMCAmJiBpc05vbnplcm8gPyAnLScgKyBzIDogcztcclxufVxyXG5cclxuXHJcbi8vIFByb3RvdHlwZS9pbnN0YW5jZSBtZXRob2RzXHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IEJpZyB3aG9zZSB2YWx1ZSBpcyB0aGUgYWJzb2x1dGUgdmFsdWUgb2YgdGhpcyBCaWcuXHJcbiAqL1xyXG5QLmFicyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgeCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpO1xyXG4gIHgucyA9IDE7XHJcbiAgcmV0dXJuIHg7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIDEgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIGlzIGdyZWF0ZXIgdGhhbiB0aGUgdmFsdWUgb2YgQmlnIHksXHJcbiAqICAgICAgIC0xIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBpcyBsZXNzIHRoYW4gdGhlIHZhbHVlIG9mIEJpZyB5LCBvclxyXG4gKiAgICAgICAgMCBpZiB0aGV5IGhhdmUgdGhlIHNhbWUgdmFsdWUuXHJcbiAqL1xyXG5QLmNtcCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGlzbmVnLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICB4YyA9IHguYyxcclxuICAgIHljID0gKHkgPSBuZXcgeC5jb25zdHJ1Y3Rvcih5KSkuYyxcclxuICAgIGkgPSB4LnMsXHJcbiAgICBqID0geS5zLFxyXG4gICAgayA9IHguZSxcclxuICAgIGwgPSB5LmU7XHJcblxyXG4gIC8vIEVpdGhlciB6ZXJvP1xyXG4gIGlmICgheGNbMF0gfHwgIXljWzBdKSByZXR1cm4gIXhjWzBdID8gIXljWzBdID8gMCA6IC1qIDogaTtcclxuXHJcbiAgLy8gU2lnbnMgZGlmZmVyP1xyXG4gIGlmIChpICE9IGopIHJldHVybiBpO1xyXG5cclxuICBpc25lZyA9IGkgPCAwO1xyXG5cclxuICAvLyBDb21wYXJlIGV4cG9uZW50cy5cclxuICBpZiAoayAhPSBsKSByZXR1cm4gayA+IGwgXiBpc25lZyA/IDEgOiAtMTtcclxuXHJcbiAgaiA9IChrID0geGMubGVuZ3RoKSA8IChsID0geWMubGVuZ3RoKSA/IGsgOiBsO1xyXG5cclxuICAvLyBDb21wYXJlIGRpZ2l0IGJ5IGRpZ2l0LlxyXG4gIGZvciAoaSA9IC0xOyArK2kgPCBqOykge1xyXG4gICAgaWYgKHhjW2ldICE9IHljW2ldKSByZXR1cm4geGNbaV0gPiB5Y1tpXSBeIGlzbmVnID8gMSA6IC0xO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29tcGFyZSBsZW5ndGhzLlxyXG4gIHJldHVybiBrID09IGwgPyAwIDogayA+IGwgXiBpc25lZyA/IDEgOiAtMTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgQmlnIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBkaXZpZGVkIGJ5IHRoZSB2YWx1ZSBvZiBCaWcgeSwgcm91bmRlZCxcclxuICogaWYgbmVjZXNzYXJ5LCB0byBhIG1heGltdW0gb2YgQmlnLkRQIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgQmlnLlJNLlxyXG4gKi9cclxuUC5kaXYgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHZhciB4ID0gdGhpcyxcclxuICAgIEJpZyA9IHguY29uc3RydWN0b3IsXHJcbiAgICBhID0geC5jLCAgICAgICAgICAgICAgICAgIC8vIGRpdmlkZW5kXHJcbiAgICBiID0gKHkgPSBuZXcgQmlnKHkpKS5jLCAgIC8vIGRpdmlzb3JcclxuICAgIGsgPSB4LnMgPT0geS5zID8gMSA6IC0xLFxyXG4gICAgZHAgPSBCaWcuRFA7XHJcblxyXG4gIGlmIChkcCAhPT0gfn5kcCB8fCBkcCA8IDAgfHwgZHAgPiBNQVhfRFApIHtcclxuICAgIHRocm93IEVycm9yKElOVkFMSURfRFApO1xyXG4gIH1cclxuXHJcbiAgLy8gRGl2aXNvciBpcyB6ZXJvP1xyXG4gIGlmICghYlswXSkge1xyXG4gICAgdGhyb3cgRXJyb3IoRElWX0JZX1pFUk8pO1xyXG4gIH1cclxuXHJcbiAgLy8gRGl2aWRlbmQgaXMgMD8gUmV0dXJuICstMC5cclxuICBpZiAoIWFbMF0pIHtcclxuICAgIHkucyA9IGs7XHJcbiAgICB5LmMgPSBbeS5lID0gMF07XHJcbiAgICByZXR1cm4geTtcclxuICB9XHJcblxyXG4gIHZhciBibCwgYnQsIG4sIGNtcCwgcmksXHJcbiAgICBieiA9IGIuc2xpY2UoKSxcclxuICAgIGFpID0gYmwgPSBiLmxlbmd0aCxcclxuICAgIGFsID0gYS5sZW5ndGgsXHJcbiAgICByID0gYS5zbGljZSgwLCBibCksICAgLy8gcmVtYWluZGVyXHJcbiAgICBybCA9IHIubGVuZ3RoLFxyXG4gICAgcSA9IHksICAgICAgICAgICAgICAgIC8vIHF1b3RpZW50XHJcbiAgICBxYyA9IHEuYyA9IFtdLFxyXG4gICAgcWkgPSAwLFxyXG4gICAgcCA9IGRwICsgKHEuZSA9IHguZSAtIHkuZSkgKyAxOyAgICAvLyBwcmVjaXNpb24gb2YgdGhlIHJlc3VsdFxyXG5cclxuICBxLnMgPSBrO1xyXG4gIGsgPSBwIDwgMCA/IDAgOiBwO1xyXG5cclxuICAvLyBDcmVhdGUgdmVyc2lvbiBvZiBkaXZpc29yIHdpdGggbGVhZGluZyB6ZXJvLlxyXG4gIGJ6LnVuc2hpZnQoMCk7XHJcblxyXG4gIC8vIEFkZCB6ZXJvcyB0byBtYWtlIHJlbWFpbmRlciBhcyBsb25nIGFzIGRpdmlzb3IuXHJcbiAgZm9yICg7IHJsKysgPCBibDspIHIucHVzaCgwKTtcclxuXHJcbiAgZG8ge1xyXG5cclxuICAgIC8vIG4gaXMgaG93IG1hbnkgdGltZXMgdGhlIGRpdmlzb3IgZ29lcyBpbnRvIGN1cnJlbnQgcmVtYWluZGVyLlxyXG4gICAgZm9yIChuID0gMDsgbiA8IDEwOyBuKyspIHtcclxuXHJcbiAgICAgIC8vIENvbXBhcmUgZGl2aXNvciBhbmQgcmVtYWluZGVyLlxyXG4gICAgICBpZiAoYmwgIT0gKHJsID0gci5sZW5ndGgpKSB7XHJcbiAgICAgICAgY21wID0gYmwgPiBybCA/IDEgOiAtMTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmb3IgKHJpID0gLTEsIGNtcCA9IDA7ICsrcmkgPCBibDspIHtcclxuICAgICAgICAgIGlmIChiW3JpXSAhPSByW3JpXSkge1xyXG4gICAgICAgICAgICBjbXAgPSBiW3JpXSA+IHJbcmldID8gMSA6IC0xO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIElmIGRpdmlzb3IgPCByZW1haW5kZXIsIHN1YnRyYWN0IGRpdmlzb3IgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgIGlmIChjbXAgPCAwKSB7XHJcblxyXG4gICAgICAgIC8vIFJlbWFpbmRlciBjYW4ndCBiZSBtb3JlIHRoYW4gMSBkaWdpdCBsb25nZXIgdGhhbiBkaXZpc29yLlxyXG4gICAgICAgIC8vIEVxdWFsaXNlIGxlbmd0aHMgdXNpbmcgZGl2aXNvciB3aXRoIGV4dHJhIGxlYWRpbmcgemVybz9cclxuICAgICAgICBmb3IgKGJ0ID0gcmwgPT0gYmwgPyBiIDogYno7IHJsOykge1xyXG4gICAgICAgICAgaWYgKHJbLS1ybF0gPCBidFtybF0pIHtcclxuICAgICAgICAgICAgcmkgPSBybDtcclxuICAgICAgICAgICAgZm9yICg7IHJpICYmICFyWy0tcmldOykgcltyaV0gPSA5O1xyXG4gICAgICAgICAgICAtLXJbcmldO1xyXG4gICAgICAgICAgICByW3JsXSArPSAxMDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJbcmxdIC09IGJ0W3JsXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoOyAhclswXTspIHIuc2hpZnQoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEFkZCB0aGUgZGlnaXQgbiB0byB0aGUgcmVzdWx0IGFycmF5LlxyXG4gICAgcWNbcWkrK10gPSBjbXAgPyBuIDogKytuO1xyXG5cclxuICAgIC8vIFVwZGF0ZSB0aGUgcmVtYWluZGVyLlxyXG4gICAgaWYgKHJbMF0gJiYgY21wKSByW3JsXSA9IGFbYWldIHx8IDA7XHJcbiAgICBlbHNlIHIgPSBbYVthaV1dO1xyXG5cclxuICB9IHdoaWxlICgoYWkrKyA8IGFsIHx8IHJbMF0gIT09IFVOREVGSU5FRCkgJiYgay0tKTtcclxuXHJcbiAgLy8gTGVhZGluZyB6ZXJvPyBEbyBub3QgcmVtb3ZlIGlmIHJlc3VsdCBpcyBzaW1wbHkgemVybyAocWkgPT0gMSkuXHJcbiAgaWYgKCFxY1swXSAmJiBxaSAhPSAxKSB7XHJcblxyXG4gICAgLy8gVGhlcmUgY2FuJ3QgYmUgbW9yZSB0aGFuIG9uZSB6ZXJvLlxyXG4gICAgcWMuc2hpZnQoKTtcclxuICAgIHEuZS0tO1xyXG4gICAgcC0tO1xyXG4gIH1cclxuXHJcbiAgLy8gUm91bmQ/XHJcbiAgaWYgKHFpID4gcCkgcm91bmQocSwgcCwgQmlnLlJNLCByWzBdICE9PSBVTkRFRklORUQpO1xyXG5cclxuICByZXR1cm4gcTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgaXMgZXF1YWwgdG8gdGhlIHZhbHVlIG9mIEJpZyB5LCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKi9cclxuUC5lcSA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpID09PSAwO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBpcyBncmVhdGVyIHRoYW4gdGhlIHZhbHVlIG9mIEJpZyB5LCBvdGhlcndpc2UgcmV0dXJuXHJcbiAqIGZhbHNlLlxyXG4gKi9cclxuUC5ndCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpID4gMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgaXMgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZiBCaWcgeSwgb3RoZXJ3aXNlXHJcbiAqIHJldHVybiBmYWxzZS5cclxuICovXHJcblAuZ3RlID0gZnVuY3Rpb24gKHkpIHtcclxuICByZXR1cm4gdGhpcy5jbXAoeSkgPiAtMTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgaXMgbGVzcyB0aGFuIHRoZSB2YWx1ZSBvZiBCaWcgeSwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICovXHJcblAubHQgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHJldHVybiB0aGlzLmNtcCh5KSA8IDA7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgdmFsdWUgb2YgQmlnIHksIG90aGVyd2lzZVxyXG4gKiByZXR1cm4gZmFsc2UuXHJcbiAqL1xyXG5QLmx0ZSA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpIDwgMTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgQmlnIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBtaW51cyB0aGUgdmFsdWUgb2YgQmlnIHkuXHJcbiAqL1xyXG5QLm1pbnVzID0gUC5zdWIgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHZhciBpLCBqLCB0LCB4bHR5LFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBCaWcgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgYSA9IHgucyxcclxuICAgIGIgPSAoeSA9IG5ldyBCaWcoeSkpLnM7XHJcblxyXG4gIC8vIFNpZ25zIGRpZmZlcj9cclxuICBpZiAoYSAhPSBiKSB7XHJcbiAgICB5LnMgPSAtYjtcclxuICAgIHJldHVybiB4LnBsdXMoeSk7XHJcbiAgfVxyXG5cclxuICB2YXIgeGMgPSB4LmMuc2xpY2UoKSxcclxuICAgIHhlID0geC5lLFxyXG4gICAgeWMgPSB5LmMsXHJcbiAgICB5ZSA9IHkuZTtcclxuXHJcbiAgLy8gRWl0aGVyIHplcm8/XHJcbiAgaWYgKCF4Y1swXSB8fCAheWNbMF0pIHtcclxuICAgIGlmICh5Y1swXSkge1xyXG4gICAgICB5LnMgPSAtYjtcclxuICAgIH0gZWxzZSBpZiAoeGNbMF0pIHtcclxuICAgICAgeSA9IG5ldyBCaWcoeCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB5LnMgPSAxO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHk7XHJcbiAgfVxyXG5cclxuICAvLyBEZXRlcm1pbmUgd2hpY2ggaXMgdGhlIGJpZ2dlciBudW1iZXIuIFByZXBlbmQgemVyb3MgdG8gZXF1YWxpc2UgZXhwb25lbnRzLlxyXG4gIGlmIChhID0geGUgLSB5ZSkge1xyXG5cclxuICAgIGlmICh4bHR5ID0gYSA8IDApIHtcclxuICAgICAgYSA9IC1hO1xyXG4gICAgICB0ID0geGM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB5ZSA9IHhlO1xyXG4gICAgICB0ID0geWM7XHJcbiAgICB9XHJcblxyXG4gICAgdC5yZXZlcnNlKCk7XHJcbiAgICBmb3IgKGIgPSBhOyBiLS07KSB0LnB1c2goMCk7XHJcbiAgICB0LnJldmVyc2UoKTtcclxuICB9IGVsc2Uge1xyXG5cclxuICAgIC8vIEV4cG9uZW50cyBlcXVhbC4gQ2hlY2sgZGlnaXQgYnkgZGlnaXQuXHJcbiAgICBqID0gKCh4bHR5ID0geGMubGVuZ3RoIDwgeWMubGVuZ3RoKSA/IHhjIDogeWMpLmxlbmd0aDtcclxuXHJcbiAgICBmb3IgKGEgPSBiID0gMDsgYiA8IGo7IGIrKykge1xyXG4gICAgICBpZiAoeGNbYl0gIT0geWNbYl0pIHtcclxuICAgICAgICB4bHR5ID0geGNbYl0gPCB5Y1tiXTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8geCA8IHk/IFBvaW50IHhjIHRvIHRoZSBhcnJheSBvZiB0aGUgYmlnZ2VyIG51bWJlci5cclxuICBpZiAoeGx0eSkge1xyXG4gICAgdCA9IHhjO1xyXG4gICAgeGMgPSB5YztcclxuICAgIHljID0gdDtcclxuICAgIHkucyA9IC15LnM7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gICAqIEFwcGVuZCB6ZXJvcyB0byB4YyBpZiBzaG9ydGVyLiBObyBuZWVkIHRvIGFkZCB6ZXJvcyB0byB5YyBpZiBzaG9ydGVyIGFzIHN1YnRyYWN0aW9uIG9ubHlcclxuICAgKiBuZWVkcyB0byBzdGFydCBhdCB5Yy5sZW5ndGguXHJcbiAgICovXHJcbiAgaWYgKChiID0gKGogPSB5Yy5sZW5ndGgpIC0gKGkgPSB4Yy5sZW5ndGgpKSA+IDApIGZvciAoOyBiLS07KSB4Y1tpKytdID0gMDtcclxuXHJcbiAgLy8gU3VidHJhY3QgeWMgZnJvbSB4Yy5cclxuICBmb3IgKGIgPSBpOyBqID4gYTspIHtcclxuICAgIGlmICh4Y1stLWpdIDwgeWNbal0pIHtcclxuICAgICAgZm9yIChpID0gajsgaSAmJiAheGNbLS1pXTspIHhjW2ldID0gOTtcclxuICAgICAgLS14Y1tpXTtcclxuICAgICAgeGNbal0gKz0gMTA7XHJcbiAgICB9XHJcblxyXG4gICAgeGNbal0gLT0geWNbal07XHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgZm9yICg7IHhjWy0tYl0gPT09IDA7KSB4Yy5wb3AoKTtcclxuXHJcbiAgLy8gUmVtb3ZlIGxlYWRpbmcgemVyb3MgYW5kIGFkanVzdCBleHBvbmVudCBhY2NvcmRpbmdseS5cclxuICBmb3IgKDsgeGNbMF0gPT09IDA7KSB7XHJcbiAgICB4Yy5zaGlmdCgpO1xyXG4gICAgLS15ZTtcclxuICB9XHJcblxyXG4gIGlmICgheGNbMF0pIHtcclxuXHJcbiAgICAvLyBuIC0gbiA9ICswXHJcbiAgICB5LnMgPSAxO1xyXG5cclxuICAgIC8vIFJlc3VsdCBtdXN0IGJlIHplcm8uXHJcbiAgICB4YyA9IFt5ZSA9IDBdO1xyXG4gIH1cclxuXHJcbiAgeS5jID0geGM7XHJcbiAgeS5lID0geWU7XHJcblxyXG4gIHJldHVybiB5O1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBCaWcgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIG1vZHVsbyB0aGUgdmFsdWUgb2YgQmlnIHkuXHJcbiAqL1xyXG5QLm1vZCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIHlndHgsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEJpZyA9IHguY29uc3RydWN0b3IsXHJcbiAgICBhID0geC5zLFxyXG4gICAgYiA9ICh5ID0gbmV3IEJpZyh5KSkucztcclxuXHJcbiAgaWYgKCF5LmNbMF0pIHtcclxuICAgIHRocm93IEVycm9yKERJVl9CWV9aRVJPKTtcclxuICB9XHJcblxyXG4gIHgucyA9IHkucyA9IDE7XHJcbiAgeWd0eCA9IHkuY21wKHgpID09IDE7XHJcbiAgeC5zID0gYTtcclxuICB5LnMgPSBiO1xyXG5cclxuICBpZiAoeWd0eCkgcmV0dXJuIG5ldyBCaWcoeCk7XHJcblxyXG4gIGEgPSBCaWcuRFA7XHJcbiAgYiA9IEJpZy5STTtcclxuICBCaWcuRFAgPSBCaWcuUk0gPSAwO1xyXG4gIHggPSB4LmRpdih5KTtcclxuICBCaWcuRFAgPSBhO1xyXG4gIEJpZy5STSA9IGI7XHJcblxyXG4gIHJldHVybiB0aGlzLm1pbnVzKHgudGltZXMoeSkpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBCaWcgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIG5lZ2F0ZWQuXHJcbiAqL1xyXG5QLm5lZyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgeCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpO1xyXG4gIHgucyA9IC14LnM7XHJcbiAgcmV0dXJuIHg7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IEJpZyB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgcGx1cyB0aGUgdmFsdWUgb2YgQmlnIHkuXHJcbiAqL1xyXG5QLnBsdXMgPSBQLmFkZCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGUsIGssIHQsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEJpZyA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIHkgPSBuZXcgQmlnKHkpO1xyXG5cclxuICAvLyBTaWducyBkaWZmZXI/XHJcbiAgaWYgKHgucyAhPSB5LnMpIHtcclxuICAgIHkucyA9IC15LnM7XHJcbiAgICByZXR1cm4geC5taW51cyh5KTtcclxuICB9XHJcblxyXG4gIHZhciB4ZSA9IHguZSxcclxuICAgIHhjID0geC5jLFxyXG4gICAgeWUgPSB5LmUsXHJcbiAgICB5YyA9IHkuYztcclxuXHJcbiAgLy8gRWl0aGVyIHplcm8/XHJcbiAgaWYgKCF4Y1swXSB8fCAheWNbMF0pIHtcclxuICAgIGlmICgheWNbMF0pIHtcclxuICAgICAgaWYgKHhjWzBdKSB7XHJcbiAgICAgICAgeSA9IG5ldyBCaWcoeCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeS5zID0geC5zO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4geTtcclxuICB9XHJcblxyXG4gIHhjID0geGMuc2xpY2UoKTtcclxuXHJcbiAgLy8gUHJlcGVuZCB6ZXJvcyB0byBlcXVhbGlzZSBleHBvbmVudHMuXHJcbiAgLy8gTm90ZTogcmV2ZXJzZSBmYXN0ZXIgdGhhbiB1bnNoaWZ0cy5cclxuICBpZiAoZSA9IHhlIC0geWUpIHtcclxuICAgIGlmIChlID4gMCkge1xyXG4gICAgICB5ZSA9IHhlO1xyXG4gICAgICB0ID0geWM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlID0gLWU7XHJcbiAgICAgIHQgPSB4YztcclxuICAgIH1cclxuXHJcbiAgICB0LnJldmVyc2UoKTtcclxuICAgIGZvciAoOyBlLS07KSB0LnB1c2goMCk7XHJcbiAgICB0LnJldmVyc2UoKTtcclxuICB9XHJcblxyXG4gIC8vIFBvaW50IHhjIHRvIHRoZSBsb25nZXIgYXJyYXkuXHJcbiAgaWYgKHhjLmxlbmd0aCAtIHljLmxlbmd0aCA8IDApIHtcclxuICAgIHQgPSB5YztcclxuICAgIHljID0geGM7XHJcbiAgICB4YyA9IHQ7XHJcbiAgfVxyXG5cclxuICBlID0geWMubGVuZ3RoO1xyXG5cclxuICAvLyBPbmx5IHN0YXJ0IGFkZGluZyBhdCB5Yy5sZW5ndGggLSAxIGFzIHRoZSBmdXJ0aGVyIGRpZ2l0cyBvZiB4YyBjYW4gYmUgbGVmdCBhcyB0aGV5IGFyZS5cclxuICBmb3IgKGsgPSAwOyBlOyB4Y1tlXSAlPSAxMCkgayA9ICh4Y1stLWVdID0geGNbZV0gKyB5Y1tlXSArIGspIC8gMTAgfCAwO1xyXG5cclxuICAvLyBObyBuZWVkIHRvIGNoZWNrIGZvciB6ZXJvLCBhcyAreCArICt5ICE9IDAgJiYgLXggKyAteSAhPSAwXHJcblxyXG4gIGlmIChrKSB7XHJcbiAgICB4Yy51bnNoaWZ0KGspO1xyXG4gICAgKyt5ZTtcclxuICB9XHJcblxyXG4gIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICBmb3IgKGUgPSB4Yy5sZW5ndGg7IHhjWy0tZV0gPT09IDA7KSB4Yy5wb3AoKTtcclxuXHJcbiAgeS5jID0geGM7XHJcbiAgeS5lID0geWU7XHJcblxyXG4gIHJldHVybiB5O1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIEJpZyB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgcmFpc2VkIHRvIHRoZSBwb3dlciBuLlxyXG4gKiBJZiBuIGlzIG5lZ2F0aXZlLCByb3VuZCB0byBhIG1heGltdW0gb2YgQmlnLkRQIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nXHJcbiAqIG1vZGUgQmlnLlJNLlxyXG4gKlxyXG4gKiBuIHtudW1iZXJ9IEludGVnZXIsIC1NQVhfUE9XRVIgdG8gTUFYX1BPV0VSIGluY2x1c2l2ZS5cclxuICovXHJcblAucG93ID0gZnVuY3Rpb24gKG4pIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBvbmUgPSBuZXcgeC5jb25zdHJ1Y3RvcignMScpLFxyXG4gICAgeSA9IG9uZSxcclxuICAgIGlzbmVnID0gbiA8IDA7XHJcblxyXG4gIGlmIChuICE9PSB+fm4gfHwgbiA8IC1NQVhfUE9XRVIgfHwgbiA+IE1BWF9QT1dFUikge1xyXG4gICAgdGhyb3cgRXJyb3IoSU5WQUxJRCArICdleHBvbmVudCcpO1xyXG4gIH1cclxuXHJcbiAgaWYgKGlzbmVnKSBuID0gLW47XHJcblxyXG4gIGZvciAoOzspIHtcclxuICAgIGlmIChuICYgMSkgeSA9IHkudGltZXMoeCk7XHJcbiAgICBuID4+PSAxO1xyXG4gICAgaWYgKCFuKSBicmVhaztcclxuICAgIHggPSB4LnRpbWVzKHgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGlzbmVnID8gb25lLmRpdih5KSA6IHk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IEJpZyB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgcm91bmRlZCB0byBhIG1heGltdW0gcHJlY2lzaW9uIG9mIHNkXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIHJtLCBvciBCaWcuUk0gaWYgcm0gaXMgbm90IHNwZWNpZmllZC5cclxuICpcclxuICogc2Qge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzOiBpbnRlZ2VyLCAxIHRvIE1BWF9EUCBpbmNsdXNpdmUuXHJcbiAqIHJtPyB7bnVtYmVyfSBSb3VuZGluZyBtb2RlOiAwIChkb3duKSwgMSAoaGFsZi11cCksIDIgKGhhbGYtZXZlbikgb3IgMyAodXApLlxyXG4gKi9cclxuUC5wcmVjID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gIGlmIChzZCAhPT0gfn5zZCB8fCBzZCA8IDEgfHwgc2QgPiBNQVhfRFApIHtcclxuICAgIHRocm93IEVycm9yKElOVkFMSUQgKyAncHJlY2lzaW9uJyk7XHJcbiAgfVxyXG4gIHJldHVybiByb3VuZChuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKSwgc2QsIHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgQmlnIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyByb3VuZGVkIHRvIGEgbWF4aW11bSBvZiBkcCBkZWNpbWFsIHBsYWNlc1xyXG4gKiB1c2luZyByb3VuZGluZyBtb2RlIHJtLCBvciBCaWcuUk0gaWYgcm0gaXMgbm90IHNwZWNpZmllZC5cclxuICogSWYgZHAgaXMgbmVnYXRpdmUsIHJvdW5kIHRvIGFuIGludGVnZXIgd2hpY2ggaXMgYSBtdWx0aXBsZSBvZiAxMCoqLWRwLlxyXG4gKiBJZiBkcCBpcyBub3Qgc3BlY2lmaWVkLCByb3VuZCB0byAwIGRlY2ltYWwgcGxhY2VzLlxyXG4gKlxyXG4gKiBkcD8ge251bWJlcn0gSW50ZWdlciwgLU1BWF9EUCB0byBNQVhfRFAgaW5jbHVzaXZlLlxyXG4gKiBybT8ge251bWJlcn0gUm91bmRpbmcgbW9kZTogMCAoZG93biksIDEgKGhhbGYtdXApLCAyIChoYWxmLWV2ZW4pIG9yIDMgKHVwKS5cclxuICovXHJcblAucm91bmQgPSBmdW5jdGlvbiAoZHAsIHJtKSB7XHJcbiAgaWYgKGRwID09PSBVTkRFRklORUQpIGRwID0gMDtcclxuICBlbHNlIGlmIChkcCAhPT0gfn5kcCB8fCBkcCA8IC1NQVhfRFAgfHwgZHAgPiBNQVhfRFApIHtcclxuICAgIHRocm93IEVycm9yKElOVkFMSURfRFApO1xyXG4gIH1cclxuICByZXR1cm4gcm91bmQobmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyksIGRwICsgdGhpcy5lICsgMSwgcm0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBCaWcgd2hvc2UgdmFsdWUgaXMgdGhlIHNxdWFyZSByb290IG9mIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZywgcm91bmRlZCwgaWZcclxuICogbmVjZXNzYXJ5LCB0byBhIG1heGltdW0gb2YgQmlnLkRQIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgQmlnLlJNLlxyXG4gKi9cclxuUC5zcXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciByLCBjLCB0LFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBCaWcgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgcyA9IHgucyxcclxuICAgIGUgPSB4LmUsXHJcbiAgICBoYWxmID0gbmV3IEJpZygnMC41Jyk7XHJcblxyXG4gIC8vIFplcm8/XHJcbiAgaWYgKCF4LmNbMF0pIHJldHVybiBuZXcgQmlnKHgpO1xyXG5cclxuICAvLyBOZWdhdGl2ZT9cclxuICBpZiAocyA8IDApIHtcclxuICAgIHRocm93IEVycm9yKE5BTUUgKyAnTm8gc3F1YXJlIHJvb3QnKTtcclxuICB9XHJcblxyXG4gIC8vIEVzdGltYXRlLlxyXG4gIHMgPSBNYXRoLnNxcnQoK3N0cmluZ2lmeSh4LCB0cnVlLCB0cnVlKSk7XHJcblxyXG4gIC8vIE1hdGguc3FydCB1bmRlcmZsb3cvb3ZlcmZsb3c/XHJcbiAgLy8gUmUtZXN0aW1hdGU6IHBhc3MgeCBjb2VmZmljaWVudCB0byBNYXRoLnNxcnQgYXMgaW50ZWdlciwgdGhlbiBhZGp1c3QgdGhlIHJlc3VsdCBleHBvbmVudC5cclxuICBpZiAocyA9PT0gMCB8fCBzID09PSAxIC8gMCkge1xyXG4gICAgYyA9IHguYy5qb2luKCcnKTtcclxuICAgIGlmICghKGMubGVuZ3RoICsgZSAmIDEpKSBjICs9ICcwJztcclxuICAgIHMgPSBNYXRoLnNxcnQoYyk7XHJcbiAgICBlID0gKChlICsgMSkgLyAyIHwgMCkgLSAoZSA8IDAgfHwgZSAmIDEpO1xyXG4gICAgciA9IG5ldyBCaWcoKHMgPT0gMSAvIDAgPyAnNWUnIDogKHMgPSBzLnRvRXhwb25lbnRpYWwoKSkuc2xpY2UoMCwgcy5pbmRleE9mKCdlJykgKyAxKSkgKyBlKTtcclxuICB9IGVsc2Uge1xyXG4gICAgciA9IG5ldyBCaWcocyArICcnKTtcclxuICB9XHJcblxyXG4gIGUgPSByLmUgKyAoQmlnLkRQICs9IDQpO1xyXG5cclxuICAvLyBOZXd0b24tUmFwaHNvbiBpdGVyYXRpb24uXHJcbiAgZG8ge1xyXG4gICAgdCA9IHI7XHJcbiAgICByID0gaGFsZi50aW1lcyh0LnBsdXMoeC5kaXYodCkpKTtcclxuICB9IHdoaWxlICh0LmMuc2xpY2UoMCwgZSkuam9pbignJykgIT09IHIuYy5zbGljZSgwLCBlKS5qb2luKCcnKSk7XHJcblxyXG4gIHJldHVybiByb3VuZChyLCAoQmlnLkRQIC09IDQpICsgci5lICsgMSwgQmlnLlJNKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgQmlnIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyB0aW1lcyB0aGUgdmFsdWUgb2YgQmlnIHkuXHJcbiAqL1xyXG5QLnRpbWVzID0gUC5tdWwgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHZhciBjLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBCaWcgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgeGMgPSB4LmMsXHJcbiAgICB5YyA9ICh5ID0gbmV3IEJpZyh5KSkuYyxcclxuICAgIGEgPSB4Yy5sZW5ndGgsXHJcbiAgICBiID0geWMubGVuZ3RoLFxyXG4gICAgaSA9IHguZSxcclxuICAgIGogPSB5LmU7XHJcblxyXG4gIC8vIERldGVybWluZSBzaWduIG9mIHJlc3VsdC5cclxuICB5LnMgPSB4LnMgPT0geS5zID8gMSA6IC0xO1xyXG5cclxuICAvLyBSZXR1cm4gc2lnbmVkIDAgaWYgZWl0aGVyIDAuXHJcbiAgaWYgKCF4Y1swXSB8fCAheWNbMF0pIHtcclxuICAgIHkuYyA9IFt5LmUgPSAwXTtcclxuICAgIHJldHVybiB5O1xyXG4gIH1cclxuXHJcbiAgLy8gSW5pdGlhbGlzZSBleHBvbmVudCBvZiByZXN1bHQgYXMgeC5lICsgeS5lLlxyXG4gIHkuZSA9IGkgKyBqO1xyXG5cclxuICAvLyBJZiBhcnJheSB4YyBoYXMgZmV3ZXIgZGlnaXRzIHRoYW4geWMsIHN3YXAgeGMgYW5kIHljLCBhbmQgbGVuZ3Rocy5cclxuICBpZiAoYSA8IGIpIHtcclxuICAgIGMgPSB4YztcclxuICAgIHhjID0geWM7XHJcbiAgICB5YyA9IGM7XHJcbiAgICBqID0gYTtcclxuICAgIGEgPSBiO1xyXG4gICAgYiA9IGo7XHJcbiAgfVxyXG5cclxuICAvLyBJbml0aWFsaXNlIGNvZWZmaWNpZW50IGFycmF5IG9mIHJlc3VsdCB3aXRoIHplcm9zLlxyXG4gIGZvciAoYyA9IG5ldyBBcnJheShqID0gYSArIGIpOyBqLS07KSBjW2pdID0gMDtcclxuXHJcbiAgLy8gTXVsdGlwbHkuXHJcblxyXG4gIC8vIGkgaXMgaW5pdGlhbGx5IHhjLmxlbmd0aC5cclxuICBmb3IgKGkgPSBiOyBpLS07KSB7XHJcbiAgICBiID0gMDtcclxuXHJcbiAgICAvLyBhIGlzIHljLmxlbmd0aC5cclxuICAgIGZvciAoaiA9IGEgKyBpOyBqID4gaTspIHtcclxuXHJcbiAgICAgIC8vIEN1cnJlbnQgc3VtIG9mIHByb2R1Y3RzIGF0IHRoaXMgZGlnaXQgcG9zaXRpb24sIHBsdXMgY2FycnkuXHJcbiAgICAgIGIgPSBjW2pdICsgeWNbaV0gKiB4Y1tqIC0gaSAtIDFdICsgYjtcclxuICAgICAgY1tqLS1dID0gYiAlIDEwO1xyXG5cclxuICAgICAgLy8gY2FycnlcclxuICAgICAgYiA9IGIgLyAxMCB8IDA7XHJcbiAgICB9XHJcblxyXG4gICAgY1tqXSA9IGI7XHJcbiAgfVxyXG5cclxuICAvLyBJbmNyZW1lbnQgcmVzdWx0IGV4cG9uZW50IGlmIHRoZXJlIGlzIGEgZmluYWwgY2FycnksIG90aGVyd2lzZSByZW1vdmUgbGVhZGluZyB6ZXJvLlxyXG4gIGlmIChiKSArK3kuZTtcclxuICBlbHNlIGMuc2hpZnQoKTtcclxuXHJcbiAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gIGZvciAoaSA9IGMubGVuZ3RoOyAhY1stLWldOykgYy5wb3AoKTtcclxuICB5LmMgPSBjO1xyXG5cclxuICByZXR1cm4geTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBpbiBleHBvbmVudGlhbCBub3RhdGlvbiByb3VuZGVkIHRvIGRwIGZpeGVkXHJcbiAqIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgcm0sIG9yIEJpZy5STSBpZiBybSBpcyBub3Qgc3BlY2lmaWVkLlxyXG4gKlxyXG4gKiBkcD8ge251bWJlcn0gRGVjaW1hbCBwbGFjZXM6IGludGVnZXIsIDAgdG8gTUFYX0RQIGluY2x1c2l2ZS5cclxuICogcm0/IHtudW1iZXJ9IFJvdW5kaW5nIG1vZGU6IDAgKGRvd24pLCAxIChoYWxmLXVwKSwgMiAoaGFsZi1ldmVuKSBvciAzICh1cCkuXHJcbiAqL1xyXG5QLnRvRXhwb25lbnRpYWwgPSBmdW5jdGlvbiAoZHAsIHJtKSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgbiA9IHguY1swXTtcclxuXHJcbiAgaWYgKGRwICE9PSBVTkRFRklORUQpIHtcclxuICAgIGlmIChkcCAhPT0gfn5kcCB8fCBkcCA8IDAgfHwgZHAgPiBNQVhfRFApIHtcclxuICAgICAgdGhyb3cgRXJyb3IoSU5WQUxJRF9EUCk7XHJcbiAgICB9XHJcbiAgICB4ID0gcm91bmQobmV3IHguY29uc3RydWN0b3IoeCksICsrZHAsIHJtKTtcclxuICAgIGZvciAoOyB4LmMubGVuZ3RoIDwgZHA7KSB4LmMucHVzaCgwKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBzdHJpbmdpZnkoeCwgdHJ1ZSwgISFuKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBpbiBub3JtYWwgbm90YXRpb24gcm91bmRlZCB0byBkcCBmaXhlZFxyXG4gKiBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIHJtLCBvciBCaWcuUk0gaWYgcm0gaXMgbm90IHNwZWNpZmllZC5cclxuICpcclxuICogZHA/IHtudW1iZXJ9IERlY2ltYWwgcGxhY2VzOiBpbnRlZ2VyLCAwIHRvIE1BWF9EUCBpbmNsdXNpdmUuXHJcbiAqIHJtPyB7bnVtYmVyfSBSb3VuZGluZyBtb2RlOiAwIChkb3duKSwgMSAoaGFsZi11cCksIDIgKGhhbGYtZXZlbikgb3IgMyAodXApLlxyXG4gKlxyXG4gKiAoLTApLnRvRml4ZWQoMCkgaXMgJzAnLCBidXQgKC0wLjEpLnRvRml4ZWQoMCkgaXMgJy0wJy5cclxuICogKC0wKS50b0ZpeGVkKDEpIGlzICcwLjAnLCBidXQgKC0wLjAxKS50b0ZpeGVkKDEpIGlzICctMC4wJy5cclxuICovXHJcblAudG9GaXhlZCA9IGZ1bmN0aW9uIChkcCwgcm0pIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBuID0geC5jWzBdO1xyXG5cclxuICBpZiAoZHAgIT09IFVOREVGSU5FRCkge1xyXG4gICAgaWYgKGRwICE9PSB+fmRwIHx8IGRwIDwgMCB8fCBkcCA+IE1BWF9EUCkge1xyXG4gICAgICB0aHJvdyBFcnJvcihJTlZBTElEX0RQKTtcclxuICAgIH1cclxuICAgIHggPSByb3VuZChuZXcgeC5jb25zdHJ1Y3Rvcih4KSwgZHAgKyB4LmUgKyAxLCBybSk7XHJcblxyXG4gICAgLy8geC5lIG1heSBoYXZlIGNoYW5nZWQgaWYgdGhlIHZhbHVlIGlzIHJvdW5kZWQgdXAuXHJcbiAgICBmb3IgKGRwID0gZHAgKyB4LmUgKyAxOyB4LmMubGVuZ3RoIDwgZHA7KSB4LmMucHVzaCgwKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBzdHJpbmdpZnkoeCwgZmFsc2UsICEhbik7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcuXHJcbiAqIFJldHVybiBleHBvbmVudGlhbCBub3RhdGlvbiBpZiB0aGlzIEJpZyBoYXMgYSBwb3NpdGl2ZSBleHBvbmVudCBlcXVhbCB0byBvciBncmVhdGVyIHRoYW5cclxuICogQmlnLlBFLCBvciBhIG5lZ2F0aXZlIGV4cG9uZW50IGVxdWFsIHRvIG9yIGxlc3MgdGhhbiBCaWcuTkUuXHJcbiAqIE9taXQgdGhlIHNpZ24gZm9yIG5lZ2F0aXZlIHplcm8uXHJcbiAqL1xyXG5QW1N5bWJvbC5mb3IoJ25vZGVqcy51dGlsLmluc3BlY3QuY3VzdG9tJyldID0gUC50b0pTT04gPSBQLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB4ID0gdGhpcyxcclxuICAgIEJpZyA9IHguY29uc3RydWN0b3I7XHJcbiAgcmV0dXJuIHN0cmluZ2lmeSh4LCB4LmUgPD0gQmlnLk5FIHx8IHguZSA+PSBCaWcuUEUsICEheC5jWzBdKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdGhlIHZhbHVlIG9mIHRoaXMgQmlnIGFzIGEgcHJpbWl0dmUgbnVtYmVyLlxyXG4gKi9cclxuUC50b051bWJlciA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgbiA9ICtzdHJpbmdpZnkodGhpcywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgaWYgKHRoaXMuY29uc3RydWN0b3Iuc3RyaWN0ID09PSB0cnVlICYmICF0aGlzLmVxKG4udG9TdHJpbmcoKSkpIHtcclxuICAgIHRocm93IEVycm9yKE5BTUUgKyAnSW1wcmVjaXNlIGNvbnZlcnNpb24nKTtcclxuICB9XHJcbiAgcmV0dXJuIG47XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgcm91bmRlZCB0byBzZCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmdcclxuICogcm91bmRpbmcgbW9kZSBybSwgb3IgQmlnLlJNIGlmIHJtIGlzIG5vdCBzcGVjaWZpZWQuXHJcbiAqIFVzZSBleHBvbmVudGlhbCBub3RhdGlvbiBpZiBzZCBpcyBsZXNzIHRoYW4gdGhlIG51bWJlciBvZiBkaWdpdHMgbmVjZXNzYXJ5IHRvIHJlcHJlc2VudFxyXG4gKiB0aGUgaW50ZWdlciBwYXJ0IG9mIHRoZSB2YWx1ZSBpbiBub3JtYWwgbm90YXRpb24uXHJcbiAqXHJcbiAqIHNkIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0czogaW50ZWdlciwgMSB0byBNQVhfRFAgaW5jbHVzaXZlLlxyXG4gKiBybT8ge251bWJlcn0gUm91bmRpbmcgbW9kZTogMCAoZG93biksIDEgKGhhbGYtdXApLCAyIChoYWxmLWV2ZW4pIG9yIDMgKHVwKS5cclxuICovXHJcblAudG9QcmVjaXNpb24gPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgQmlnID0geC5jb25zdHJ1Y3RvcixcclxuICAgIG4gPSB4LmNbMF07XHJcblxyXG4gIGlmIChzZCAhPT0gVU5ERUZJTkVEKSB7XHJcbiAgICBpZiAoc2QgIT09IH5+c2QgfHwgc2QgPCAxIHx8IHNkID4gTUFYX0RQKSB7XHJcbiAgICAgIHRocm93IEVycm9yKElOVkFMSUQgKyAncHJlY2lzaW9uJyk7XHJcbiAgICB9XHJcbiAgICB4ID0gcm91bmQobmV3IEJpZyh4KSwgc2QsIHJtKTtcclxuICAgIGZvciAoOyB4LmMubGVuZ3RoIDwgc2Q7KSB4LmMucHVzaCgwKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBzdHJpbmdpZnkoeCwgc2QgPD0geC5lIHx8IHguZSA8PSBCaWcuTkUgfHwgeC5lID49IEJpZy5QRSwgISFuKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZy5cclxuICogUmV0dXJuIGV4cG9uZW50aWFsIG5vdGF0aW9uIGlmIHRoaXMgQmlnIGhhcyBhIHBvc2l0aXZlIGV4cG9uZW50IGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhblxyXG4gKiBCaWcuUEUsIG9yIGEgbmVnYXRpdmUgZXhwb25lbnQgZXF1YWwgdG8gb3IgbGVzcyB0aGFuIEJpZy5ORS5cclxuICogSW5jbHVkZSB0aGUgc2lnbiBmb3IgbmVnYXRpdmUgemVyby5cclxuICovXHJcblAudmFsdWVPZiA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBCaWcgPSB4LmNvbnN0cnVjdG9yO1xyXG4gIGlmIChCaWcuc3RyaWN0ID09PSB0cnVlKSB7XHJcbiAgICB0aHJvdyBFcnJvcihOQU1FICsgJ3ZhbHVlT2YgZGlzYWxsb3dlZCcpO1xyXG4gIH1cclxuICByZXR1cm4gc3RyaW5naWZ5KHgsIHguZSA8PSBCaWcuTkUgfHwgeC5lID49IEJpZy5QRSwgdHJ1ZSk7XHJcbn07XHJcblxyXG5cclxuLy8gRXhwb3J0XHJcblxyXG5cclxuZXhwb3J0IHZhciBCaWcgPSBfQmlnXygpO1xyXG5cclxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vRGVmaW5pdGVseVR5cGVkL0RlZmluaXRlbHlUeXBlZC9tYXN0ZXIvdHlwZXMvYmlnLmpzL2luZGV4LmQudHNcIiAvPlxyXG5leHBvcnQgZGVmYXVsdCBCaWc7XHJcbiIsInZhciBjaGFyYWN0ZXJNYXAgPSB7XG5cdFwiw4BcIjogXCJBXCIsXG5cdFwiw4FcIjogXCJBXCIsXG5cdFwiw4JcIjogXCJBXCIsXG5cdFwiw4NcIjogXCJBXCIsXG5cdFwiw4RcIjogXCJBXCIsXG5cdFwiw4VcIjogXCJBXCIsXG5cdFwi4bqkXCI6IFwiQVwiLFxuXHRcIuG6rlwiOiBcIkFcIixcblx0XCLhurJcIjogXCJBXCIsXG5cdFwi4bq0XCI6IFwiQVwiLFxuXHRcIuG6tlwiOiBcIkFcIixcblx0XCLDhlwiOiBcIkFFXCIsXG5cdFwi4bqmXCI6IFwiQVwiLFxuXHRcIuG6sFwiOiBcIkFcIixcblx0XCLIglwiOiBcIkFcIixcblx0XCLhuqJcIjogXCJBXCIsXG5cdFwi4bqgXCI6IFwiQVwiLFxuXHRcIuG6qFwiOiBcIkFcIixcblx0XCLhuqpcIjogXCJBXCIsXG5cdFwi4bqsXCI6IFwiQVwiLFxuXHRcIsOHXCI6IFwiQ1wiLFxuXHRcIuG4iFwiOiBcIkNcIixcblx0XCLDiFwiOiBcIkVcIixcblx0XCLDiVwiOiBcIkVcIixcblx0XCLDilwiOiBcIkVcIixcblx0XCLDi1wiOiBcIkVcIixcblx0XCLhur5cIjogXCJFXCIsXG5cdFwi4biWXCI6IFwiRVwiLFxuXHRcIuG7gFwiOiBcIkVcIixcblx0XCLhuJRcIjogXCJFXCIsXG5cdFwi4bicXCI6IFwiRVwiLFxuXHRcIsiGXCI6IFwiRVwiLFxuXHRcIuG6ulwiOiBcIkVcIixcblx0XCLhurxcIjogXCJFXCIsXG5cdFwi4bq4XCI6IFwiRVwiLFxuXHRcIuG7glwiOiBcIkVcIixcblx0XCLhu4RcIjogXCJFXCIsXG5cdFwi4buGXCI6IFwiRVwiLFxuXHRcIsOMXCI6IFwiSVwiLFxuXHRcIsONXCI6IFwiSVwiLFxuXHRcIsOOXCI6IFwiSVwiLFxuXHRcIsOPXCI6IFwiSVwiLFxuXHRcIuG4rlwiOiBcIklcIixcblx0XCLIilwiOiBcIklcIixcblx0XCLhu4hcIjogXCJJXCIsXG5cdFwi4buKXCI6IFwiSVwiLFxuXHRcIsOQXCI6IFwiRFwiLFxuXHRcIsORXCI6IFwiTlwiLFxuXHRcIsOSXCI6IFwiT1wiLFxuXHRcIsOTXCI6IFwiT1wiLFxuXHRcIsOUXCI6IFwiT1wiLFxuXHRcIsOVXCI6IFwiT1wiLFxuXHRcIsOWXCI6IFwiT1wiLFxuXHRcIsOYXCI6IFwiT1wiLFxuXHRcIuG7kFwiOiBcIk9cIixcblx0XCLhuYxcIjogXCJPXCIsXG5cdFwi4bmSXCI6IFwiT1wiLFxuXHRcIsiOXCI6IFwiT1wiLFxuXHRcIuG7jlwiOiBcIk9cIixcblx0XCLhu4xcIjogXCJPXCIsXG5cdFwi4buUXCI6IFwiT1wiLFxuXHRcIuG7llwiOiBcIk9cIixcblx0XCLhu5hcIjogXCJPXCIsXG5cdFwi4bucXCI6IFwiT1wiLFxuXHRcIuG7nlwiOiBcIk9cIixcblx0XCLhu6BcIjogXCJPXCIsXG5cdFwi4buaXCI6IFwiT1wiLFxuXHRcIuG7olwiOiBcIk9cIixcblx0XCLDmVwiOiBcIlVcIixcblx0XCLDmlwiOiBcIlVcIixcblx0XCLDm1wiOiBcIlVcIixcblx0XCLDnFwiOiBcIlVcIixcblx0XCLhu6ZcIjogXCJVXCIsXG5cdFwi4bukXCI6IFwiVVwiLFxuXHRcIuG7rFwiOiBcIlVcIixcblx0XCLhu65cIjogXCJVXCIsXG5cdFwi4buwXCI6IFwiVVwiLFxuXHRcIsOdXCI6IFwiWVwiLFxuXHRcIsOgXCI6IFwiYVwiLFxuXHRcIsOhXCI6IFwiYVwiLFxuXHRcIsOiXCI6IFwiYVwiLFxuXHRcIsOjXCI6IFwiYVwiLFxuXHRcIsOkXCI6IFwiYVwiLFxuXHRcIsOlXCI6IFwiYVwiLFxuXHRcIuG6pVwiOiBcImFcIixcblx0XCLhuq9cIjogXCJhXCIsXG5cdFwi4bqzXCI6IFwiYVwiLFxuXHRcIuG6tVwiOiBcImFcIixcblx0XCLhurdcIjogXCJhXCIsXG5cdFwiw6ZcIjogXCJhZVwiLFxuXHRcIuG6p1wiOiBcImFcIixcblx0XCLhurFcIjogXCJhXCIsXG5cdFwiyINcIjogXCJhXCIsXG5cdFwi4bqjXCI6IFwiYVwiLFxuXHRcIuG6oVwiOiBcImFcIixcblx0XCLhuqlcIjogXCJhXCIsXG5cdFwi4bqrXCI6IFwiYVwiLFxuXHRcIuG6rVwiOiBcImFcIixcblx0XCLDp1wiOiBcImNcIixcblx0XCLhuIlcIjogXCJjXCIsXG5cdFwiw6hcIjogXCJlXCIsXG5cdFwiw6lcIjogXCJlXCIsXG5cdFwiw6pcIjogXCJlXCIsXG5cdFwiw6tcIjogXCJlXCIsXG5cdFwi4bq/XCI6IFwiZVwiLFxuXHRcIuG4l1wiOiBcImVcIixcblx0XCLhu4FcIjogXCJlXCIsXG5cdFwi4biVXCI6IFwiZVwiLFxuXHRcIuG4nVwiOiBcImVcIixcblx0XCLIh1wiOiBcImVcIixcblx0XCLhurtcIjogXCJlXCIsXG5cdFwi4bq9XCI6IFwiZVwiLFxuXHRcIuG6uVwiOiBcImVcIixcblx0XCLhu4NcIjogXCJlXCIsXG5cdFwi4buFXCI6IFwiZVwiLFxuXHRcIuG7h1wiOiBcImVcIixcblx0XCLDrFwiOiBcImlcIixcblx0XCLDrVwiOiBcImlcIixcblx0XCLDrlwiOiBcImlcIixcblx0XCLDr1wiOiBcImlcIixcblx0XCLhuK9cIjogXCJpXCIsXG5cdFwiyItcIjogXCJpXCIsXG5cdFwi4buJXCI6IFwiaVwiLFxuXHRcIuG7i1wiOiBcImlcIixcblx0XCLDsFwiOiBcImRcIixcblx0XCLDsVwiOiBcIm5cIixcblx0XCLDslwiOiBcIm9cIixcblx0XCLDs1wiOiBcIm9cIixcblx0XCLDtFwiOiBcIm9cIixcblx0XCLDtVwiOiBcIm9cIixcblx0XCLDtlwiOiBcIm9cIixcblx0XCLDuFwiOiBcIm9cIixcblx0XCLhu5FcIjogXCJvXCIsXG5cdFwi4bmNXCI6IFwib1wiLFxuXHRcIuG5k1wiOiBcIm9cIixcblx0XCLIj1wiOiBcIm9cIixcblx0XCLhu49cIjogXCJvXCIsXG5cdFwi4buNXCI6IFwib1wiLFxuXHRcIuG7lVwiOiBcIm9cIixcblx0XCLhu5dcIjogXCJvXCIsXG5cdFwi4buZXCI6IFwib1wiLFxuXHRcIuG7nVwiOiBcIm9cIixcblx0XCLhu59cIjogXCJvXCIsXG5cdFwi4buhXCI6IFwib1wiLFxuXHRcIuG7m1wiOiBcIm9cIixcblx0XCLhu6NcIjogXCJvXCIsXG5cdFwiw7lcIjogXCJ1XCIsXG5cdFwiw7pcIjogXCJ1XCIsXG5cdFwiw7tcIjogXCJ1XCIsXG5cdFwiw7xcIjogXCJ1XCIsXG5cdFwi4bunXCI6IFwidVwiLFxuXHRcIuG7pVwiOiBcInVcIixcblx0XCLhu61cIjogXCJ1XCIsXG5cdFwi4buvXCI6IFwidVwiLFxuXHRcIuG7sVwiOiBcInVcIixcblx0XCLDvVwiOiBcInlcIixcblx0XCLDv1wiOiBcInlcIixcblx0XCLEgFwiOiBcIkFcIixcblx0XCLEgVwiOiBcImFcIixcblx0XCLEglwiOiBcIkFcIixcblx0XCLEg1wiOiBcImFcIixcblx0XCLEhFwiOiBcIkFcIixcblx0XCLEhVwiOiBcImFcIixcblx0XCLEhlwiOiBcIkNcIixcblx0XCLEh1wiOiBcImNcIixcblx0XCLEiFwiOiBcIkNcIixcblx0XCLEiVwiOiBcImNcIixcblx0XCLEilwiOiBcIkNcIixcblx0XCLEi1wiOiBcImNcIixcblx0XCLEjFwiOiBcIkNcIixcblx0XCLEjVwiOiBcImNcIixcblx0XCJDzIZcIjogXCJDXCIsXG5cdFwiY8yGXCI6IFwiY1wiLFxuXHRcIsSOXCI6IFwiRFwiLFxuXHRcIsSPXCI6IFwiZFwiLFxuXHRcIsSQXCI6IFwiRFwiLFxuXHRcIsSRXCI6IFwiZFwiLFxuXHRcIsSSXCI6IFwiRVwiLFxuXHRcIsSTXCI6IFwiZVwiLFxuXHRcIsSUXCI6IFwiRVwiLFxuXHRcIsSVXCI6IFwiZVwiLFxuXHRcIsSWXCI6IFwiRVwiLFxuXHRcIsSXXCI6IFwiZVwiLFxuXHRcIsSYXCI6IFwiRVwiLFxuXHRcIsSZXCI6IFwiZVwiLFxuXHRcIsSaXCI6IFwiRVwiLFxuXHRcIsSbXCI6IFwiZVwiLFxuXHRcIsScXCI6IFwiR1wiLFxuXHRcIse0XCI6IFwiR1wiLFxuXHRcIsSdXCI6IFwiZ1wiLFxuXHRcIse1XCI6IFwiZ1wiLFxuXHRcIsSeXCI6IFwiR1wiLFxuXHRcIsSfXCI6IFwiZ1wiLFxuXHRcIsSgXCI6IFwiR1wiLFxuXHRcIsShXCI6IFwiZ1wiLFxuXHRcIsSiXCI6IFwiR1wiLFxuXHRcIsSjXCI6IFwiZ1wiLFxuXHRcIsSkXCI6IFwiSFwiLFxuXHRcIsSlXCI6IFwiaFwiLFxuXHRcIsSmXCI6IFwiSFwiLFxuXHRcIsSnXCI6IFwiaFwiLFxuXHRcIuG4qlwiOiBcIkhcIixcblx0XCLhuKtcIjogXCJoXCIsXG5cdFwixKhcIjogXCJJXCIsXG5cdFwixKlcIjogXCJpXCIsXG5cdFwixKpcIjogXCJJXCIsXG5cdFwixKtcIjogXCJpXCIsXG5cdFwixKxcIjogXCJJXCIsXG5cdFwixK1cIjogXCJpXCIsXG5cdFwixK5cIjogXCJJXCIsXG5cdFwixK9cIjogXCJpXCIsXG5cdFwixLBcIjogXCJJXCIsXG5cdFwixLFcIjogXCJpXCIsXG5cdFwixLJcIjogXCJJSlwiLFxuXHRcIsSzXCI6IFwiaWpcIixcblx0XCLEtFwiOiBcIkpcIixcblx0XCLEtVwiOiBcImpcIixcblx0XCLEtlwiOiBcIktcIixcblx0XCLEt1wiOiBcImtcIixcblx0XCLhuLBcIjogXCJLXCIsXG5cdFwi4bixXCI6IFwia1wiLFxuXHRcIkvMhlwiOiBcIktcIixcblx0XCJrzIZcIjogXCJrXCIsXG5cdFwixLlcIjogXCJMXCIsXG5cdFwixLpcIjogXCJsXCIsXG5cdFwixLtcIjogXCJMXCIsXG5cdFwixLxcIjogXCJsXCIsXG5cdFwixL1cIjogXCJMXCIsXG5cdFwixL5cIjogXCJsXCIsXG5cdFwixL9cIjogXCJMXCIsXG5cdFwixYBcIjogXCJsXCIsXG5cdFwixYFcIjogXCJsXCIsXG5cdFwixYJcIjogXCJsXCIsXG5cdFwi4bi+XCI6IFwiTVwiLFxuXHRcIuG4v1wiOiBcIm1cIixcblx0XCJNzIZcIjogXCJNXCIsXG5cdFwibcyGXCI6IFwibVwiLFxuXHRcIsWDXCI6IFwiTlwiLFxuXHRcIsWEXCI6IFwiblwiLFxuXHRcIsWFXCI6IFwiTlwiLFxuXHRcIsWGXCI6IFwiblwiLFxuXHRcIsWHXCI6IFwiTlwiLFxuXHRcIsWIXCI6IFwiblwiLFxuXHRcIsWJXCI6IFwiblwiLFxuXHRcIk7MhlwiOiBcIk5cIixcblx0XCJuzIZcIjogXCJuXCIsXG5cdFwixYxcIjogXCJPXCIsXG5cdFwixY1cIjogXCJvXCIsXG5cdFwixY5cIjogXCJPXCIsXG5cdFwixY9cIjogXCJvXCIsXG5cdFwixZBcIjogXCJPXCIsXG5cdFwixZFcIjogXCJvXCIsXG5cdFwixZJcIjogXCJPRVwiLFxuXHRcIsWTXCI6IFwib2VcIixcblx0XCJQzIZcIjogXCJQXCIsXG5cdFwicMyGXCI6IFwicFwiLFxuXHRcIsWUXCI6IFwiUlwiLFxuXHRcIsWVXCI6IFwiclwiLFxuXHRcIsWWXCI6IFwiUlwiLFxuXHRcIsWXXCI6IFwiclwiLFxuXHRcIsWYXCI6IFwiUlwiLFxuXHRcIsWZXCI6IFwiclwiLFxuXHRcIlLMhlwiOiBcIlJcIixcblx0XCJyzIZcIjogXCJyXCIsXG5cdFwiyJJcIjogXCJSXCIsXG5cdFwiyJNcIjogXCJyXCIsXG5cdFwixZpcIjogXCJTXCIsXG5cdFwixZtcIjogXCJzXCIsXG5cdFwixZxcIjogXCJTXCIsXG5cdFwixZ1cIjogXCJzXCIsXG5cdFwixZ5cIjogXCJTXCIsXG5cdFwiyJhcIjogXCJTXCIsXG5cdFwiyJlcIjogXCJzXCIsXG5cdFwixZ9cIjogXCJzXCIsXG5cdFwixaBcIjogXCJTXCIsXG5cdFwixaFcIjogXCJzXCIsXG5cdFwixaJcIjogXCJUXCIsXG5cdFwixaNcIjogXCJ0XCIsXG5cdFwiyJtcIjogXCJ0XCIsXG5cdFwiyJpcIjogXCJUXCIsXG5cdFwixaRcIjogXCJUXCIsXG5cdFwixaVcIjogXCJ0XCIsXG5cdFwixaZcIjogXCJUXCIsXG5cdFwixadcIjogXCJ0XCIsXG5cdFwiVMyGXCI6IFwiVFwiLFxuXHRcInTMhlwiOiBcInRcIixcblx0XCLFqFwiOiBcIlVcIixcblx0XCLFqVwiOiBcInVcIixcblx0XCLFqlwiOiBcIlVcIixcblx0XCLFq1wiOiBcInVcIixcblx0XCLFrFwiOiBcIlVcIixcblx0XCLFrVwiOiBcInVcIixcblx0XCLFrlwiOiBcIlVcIixcblx0XCLFr1wiOiBcInVcIixcblx0XCLFsFwiOiBcIlVcIixcblx0XCLFsVwiOiBcInVcIixcblx0XCLFslwiOiBcIlVcIixcblx0XCLFs1wiOiBcInVcIixcblx0XCLIllwiOiBcIlVcIixcblx0XCLIl1wiOiBcInVcIixcblx0XCJWzIZcIjogXCJWXCIsXG5cdFwidsyGXCI6IFwidlwiLFxuXHRcIsW0XCI6IFwiV1wiLFxuXHRcIsW1XCI6IFwid1wiLFxuXHRcIuG6glwiOiBcIldcIixcblx0XCLhuoNcIjogXCJ3XCIsXG5cdFwiWMyGXCI6IFwiWFwiLFxuXHRcInjMhlwiOiBcInhcIixcblx0XCLFtlwiOiBcIllcIixcblx0XCLFt1wiOiBcInlcIixcblx0XCLFuFwiOiBcIllcIixcblx0XCJZzIZcIjogXCJZXCIsXG5cdFwiecyGXCI6IFwieVwiLFxuXHRcIsW5XCI6IFwiWlwiLFxuXHRcIsW6XCI6IFwielwiLFxuXHRcIsW7XCI6IFwiWlwiLFxuXHRcIsW8XCI6IFwielwiLFxuXHRcIsW9XCI6IFwiWlwiLFxuXHRcIsW+XCI6IFwielwiLFxuXHRcIsW/XCI6IFwic1wiLFxuXHRcIsaSXCI6IFwiZlwiLFxuXHRcIsagXCI6IFwiT1wiLFxuXHRcIsahXCI6IFwib1wiLFxuXHRcIsavXCI6IFwiVVwiLFxuXHRcIsawXCI6IFwidVwiLFxuXHRcIseNXCI6IFwiQVwiLFxuXHRcIseOXCI6IFwiYVwiLFxuXHRcIsePXCI6IFwiSVwiLFxuXHRcIseQXCI6IFwiaVwiLFxuXHRcIseRXCI6IFwiT1wiLFxuXHRcIseSXCI6IFwib1wiLFxuXHRcIseTXCI6IFwiVVwiLFxuXHRcIseUXCI6IFwidVwiLFxuXHRcIseVXCI6IFwiVVwiLFxuXHRcIseWXCI6IFwidVwiLFxuXHRcIseXXCI6IFwiVVwiLFxuXHRcIseYXCI6IFwidVwiLFxuXHRcIseZXCI6IFwiVVwiLFxuXHRcIseaXCI6IFwidVwiLFxuXHRcIsebXCI6IFwiVVwiLFxuXHRcIsecXCI6IFwidVwiLFxuXHRcIuG7qFwiOiBcIlVcIixcblx0XCLhu6lcIjogXCJ1XCIsXG5cdFwi4bm4XCI6IFwiVVwiLFxuXHRcIuG5uVwiOiBcInVcIixcblx0XCLHulwiOiBcIkFcIixcblx0XCLHu1wiOiBcImFcIixcblx0XCLHvFwiOiBcIkFFXCIsXG5cdFwix71cIjogXCJhZVwiLFxuXHRcIse+XCI6IFwiT1wiLFxuXHRcIse/XCI6IFwib1wiLFxuXHRcIsOeXCI6IFwiVEhcIixcblx0XCLDvlwiOiBcInRoXCIsXG5cdFwi4bmUXCI6IFwiUFwiLFxuXHRcIuG5lVwiOiBcInBcIixcblx0XCLhuaRcIjogXCJTXCIsXG5cdFwi4bmlXCI6IFwic1wiLFxuXHRcIljMgVwiOiBcIlhcIixcblx0XCJ4zIFcIjogXCJ4XCIsXG5cdFwi0INcIjogXCLQk1wiLFxuXHRcItGTXCI6IFwi0LNcIixcblx0XCLQjFwiOiBcItCaXCIsXG5cdFwi0ZxcIjogXCLQulwiLFxuXHRcIkHMi1wiOiBcIkFcIixcblx0XCJhzItcIjogXCJhXCIsXG5cdFwiRcyLXCI6IFwiRVwiLFxuXHRcImXMi1wiOiBcImVcIixcblx0XCJJzItcIjogXCJJXCIsXG5cdFwiacyLXCI6IFwiaVwiLFxuXHRcIse4XCI6IFwiTlwiLFxuXHRcIse5XCI6IFwiblwiLFxuXHRcIuG7klwiOiBcIk9cIixcblx0XCLhu5NcIjogXCJvXCIsXG5cdFwi4bmQXCI6IFwiT1wiLFxuXHRcIuG5kVwiOiBcIm9cIixcblx0XCLhu6pcIjogXCJVXCIsXG5cdFwi4burXCI6IFwidVwiLFxuXHRcIuG6gFwiOiBcIldcIixcblx0XCLhuoFcIjogXCJ3XCIsXG5cdFwi4buyXCI6IFwiWVwiLFxuXHRcIuG7s1wiOiBcInlcIixcblx0XCLIgFwiOiBcIkFcIixcblx0XCLIgVwiOiBcImFcIixcblx0XCLIhFwiOiBcIkVcIixcblx0XCLIhVwiOiBcImVcIixcblx0XCLIiFwiOiBcIklcIixcblx0XCLIiVwiOiBcImlcIixcblx0XCLIjFwiOiBcIk9cIixcblx0XCLIjVwiOiBcIm9cIixcblx0XCLIkFwiOiBcIlJcIixcblx0XCLIkVwiOiBcInJcIixcblx0XCLIlFwiOiBcIlVcIixcblx0XCLIlVwiOiBcInVcIixcblx0XCJCzIxcIjogXCJCXCIsXG5cdFwiYsyMXCI6IFwiYlwiLFxuXHRcIsSMzKNcIjogXCJDXCIsXG5cdFwixI3Mo1wiOiBcImNcIixcblx0XCLDisyMXCI6IFwiRVwiLFxuXHRcIsOqzIxcIjogXCJlXCIsXG5cdFwiRsyMXCI6IFwiRlwiLFxuXHRcImbMjFwiOiBcImZcIixcblx0XCLHplwiOiBcIkdcIixcblx0XCLHp1wiOiBcImdcIixcblx0XCLInlwiOiBcIkhcIixcblx0XCLIn1wiOiBcImhcIixcblx0XCJKzIxcIjogXCJKXCIsXG5cdFwix7BcIjogXCJqXCIsXG5cdFwix6hcIjogXCJLXCIsXG5cdFwix6lcIjogXCJrXCIsXG5cdFwiTcyMXCI6IFwiTVwiLFxuXHRcIm3MjFwiOiBcIm1cIixcblx0XCJQzIxcIjogXCJQXCIsXG5cdFwicMyMXCI6IFwicFwiLFxuXHRcIlHMjFwiOiBcIlFcIixcblx0XCJxzIxcIjogXCJxXCIsXG5cdFwixZjMqVwiOiBcIlJcIixcblx0XCLFmcypXCI6IFwiclwiLFxuXHRcIuG5plwiOiBcIlNcIixcblx0XCLhuadcIjogXCJzXCIsXG5cdFwiVsyMXCI6IFwiVlwiLFxuXHRcInbMjFwiOiBcInZcIixcblx0XCJXzIxcIjogXCJXXCIsXG5cdFwid8yMXCI6IFwid1wiLFxuXHRcIljMjFwiOiBcIlhcIixcblx0XCJ4zIxcIjogXCJ4XCIsXG5cdFwiWcyMXCI6IFwiWVwiLFxuXHRcInnMjFwiOiBcInlcIixcblx0XCJBzKdcIjogXCJBXCIsXG5cdFwiYcynXCI6IFwiYVwiLFxuXHRcIkLMp1wiOiBcIkJcIixcblx0XCJizKdcIjogXCJiXCIsXG5cdFwi4biQXCI6IFwiRFwiLFxuXHRcIuG4kVwiOiBcImRcIixcblx0XCLIqFwiOiBcIkVcIixcblx0XCLIqVwiOiBcImVcIixcblx0XCLGkMynXCI6IFwiRVwiLFxuXHRcIsmbzKdcIjogXCJlXCIsXG5cdFwi4bioXCI6IFwiSFwiLFxuXHRcIuG4qVwiOiBcImhcIixcblx0XCJJzKdcIjogXCJJXCIsXG5cdFwiacynXCI6IFwiaVwiLFxuXHRcIsaXzKdcIjogXCJJXCIsXG5cdFwiyajMp1wiOiBcImlcIixcblx0XCJNzKdcIjogXCJNXCIsXG5cdFwibcynXCI6IFwibVwiLFxuXHRcIk/Mp1wiOiBcIk9cIixcblx0XCJvzKdcIjogXCJvXCIsXG5cdFwiUcynXCI6IFwiUVwiLFxuXHRcInHMp1wiOiBcInFcIixcblx0XCJVzKdcIjogXCJVXCIsXG5cdFwidcynXCI6IFwidVwiLFxuXHRcIljMp1wiOiBcIlhcIixcblx0XCJ4zKdcIjogXCJ4XCIsXG5cdFwiWsynXCI6IFwiWlwiLFxuXHRcInrMp1wiOiBcInpcIixcblx0XCLQuVwiOlwi0LhcIixcblx0XCLQmVwiOlwi0JhcIixcblx0XCLRkVwiOlwi0LVcIixcblx0XCLQgVwiOlwi0JVcIixcbn07XG5cbnZhciBjaGFycyA9IE9iamVjdC5rZXlzKGNoYXJhY3Rlck1hcCkuam9pbignfCcpO1xudmFyIGFsbEFjY2VudHMgPSBuZXcgUmVnRXhwKGNoYXJzLCAnZycpO1xudmFyIGZpcnN0QWNjZW50ID0gbmV3IFJlZ0V4cChjaGFycywgJycpO1xuXG5mdW5jdGlvbiBtYXRjaGVyKG1hdGNoKSB7XG5cdHJldHVybiBjaGFyYWN0ZXJNYXBbbWF0Y2hdO1xufVxuXG52YXIgcmVtb3ZlQWNjZW50cyA9IGZ1bmN0aW9uKHN0cmluZykge1xuXHRyZXR1cm4gc3RyaW5nLnJlcGxhY2UoYWxsQWNjZW50cywgbWF0Y2hlcik7XG59O1xuXG52YXIgaGFzQWNjZW50cyA9IGZ1bmN0aW9uKHN0cmluZykge1xuXHRyZXR1cm4gISFzdHJpbmcubWF0Y2goZmlyc3RBY2NlbnQpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSByZW1vdmVBY2NlbnRzO1xubW9kdWxlLmV4cG9ydHMuaGFzID0gaGFzQWNjZW50cztcbm1vZHVsZS5leHBvcnRzLnJlbW92ZSA9IHJlbW92ZUFjY2VudHM7XG4iLCJpbXBvcnQgeyBCaWcgfSBmcm9tIFwiYmlnLmpzXCI7XG5pbXBvcnQgeyBtYXRjaFNvcnRlciwgTWF0Y2hTb3J0ZXJPcHRpb25zIH0gZnJvbSBcIm1hdGNoLXNvcnRlclwiO1xuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgUHJvcHNXaXRoQ2hpbGRyZW4sIFJlYWN0RWxlbWVudCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgR3JvdXBlZENvbWJvYm94UHJldmlld1Byb3BzLCBGaWx0ZXJUeXBlRW51bSwgU2VsZWN0ZWRJdGVtc1NvcnRpbmdFbnVtIH0gZnJvbSBcInR5cGluZ3MvR3JvdXBlZENvbWJvYm94UHJvcHNcIjtcbmltcG9ydCB7IE11bHRpU2VsZWN0b3IsIFNvcnRPcmRlciB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBPYmplY3RJdGVtIH0gZnJvbSBcIm1lbmRpeFwiO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9MSU1JVF9TSVpFID0gMTAwO1xuXG50eXBlIFZhbHVlVHlwZSA9IHN0cmluZyB8IEJpZyB8IGJvb2xlYW4gfCBEYXRlIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VsZWN0ZWRDYXB0aW9uc1BsYWNlaG9sZGVyKHNlbGVjdG9yOiBNdWx0aVNlbGVjdG9yLCBzZWxlY3RlZEl0ZW1zOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgaWYgKHNlbGVjdGVkSXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3Rvci5jYXB0aW9uLmVtcHR5Q2FwdGlvbjtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAgIHNlbGVjdG9yLnNlbGVjdGVkSXRlbXNTdHlsZSAhPT0gXCJ0ZXh0XCIgfHxcbiAgICAgICAgc2VsZWN0b3IuY3VzdG9tQ29udGVudFR5cGUgPT09IFwieWVzXCIgfHxcbiAgICAgICAgc2VsZWN0b3Iuc2VsZWN0aW9uTWV0aG9kID09PSBcInJvd2NsaWNrXCJcbiAgICApIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxlY3RlZEl0ZW1zLm1hcCh2ID0+IHNlbGVjdG9yLmNhcHRpb24uZ2V0KHYpKTtcblxuICAgIHJldHVybiBzZWxlY3RlZC5qb2luKFwiLCBcIik7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FwdGlvbkNvbnRlbnRQcm9wcyBleHRlbmRzIFByb3BzV2l0aENoaWxkcmVuIHtcbiAgICBodG1sRm9yPzogc3RyaW5nO1xuICAgIG9uQ2xpY2s/OiAoZTogTW91c2VFdmVudCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENhcHRpb25Db250ZW50KHByb3BzOiBDYXB0aW9uQ29udGVudFByb3BzKTogUmVhY3RFbGVtZW50IHtcbiAgICBjb25zdCB7IGh0bWxGb3IsIGNoaWxkcmVuLCBvbkNsaWNrIH0gPSBwcm9wcztcbiAgICByZXR1cm4gY3JlYXRlRWxlbWVudChodG1sRm9yID09IG51bGwgPyBcInNwYW5cIiA6IFwibGFiZWxcIiwge1xuICAgICAgICBjaGlsZHJlbixcbiAgICAgICAgY2xhc3NOYW1lOiBcIndpZGdldC1jb21ib2JveC1jYXB0aW9uLXRleHRcIixcbiAgICAgICAgaHRtbEZvcixcbiAgICAgICAgb25DbGljazogb25DbGlja1xuICAgICAgICAgICAgPyBvbkNsaWNrXG4gICAgICAgICAgICA6IGh0bWxGb3JcbiAgICAgICAgICAgICAgPyAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICA6IHVuZGVmaW5lZFxuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YXNvdXJjZVBsYWNlaG9sZGVyVGV4dChhcmdzOiBHcm91cGVkQ29tYm9ib3hQcmV2aWV3UHJvcHMpOiBzdHJpbmcge1xuICAgIGNvbnN0IHtcbiAgICAgICAgb3B0aW9uc1NvdXJjZVR5cGUsXG4gICAgICAgIG9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkRhdGFTb3VyY2UsXG4gICAgICAgIGF0dHJpYnV0ZUVudW1lcmF0aW9uLFxuICAgICAgICBhdHRyaWJ1dGVCb29sZWFuLFxuICAgICAgICBkYXRhYmFzZUF0dHJpYnV0ZVN0cmluZyxcbiAgICAgICAgZW1wdHlPcHRpb25UZXh0LFxuICAgICAgICBzb3VyY2UsXG4gICAgICAgIG9wdGlvbnNTb3VyY2VEYXRhYmFzZURhdGFTb3VyY2UsXG4gICAgICAgIHN0YXRpY0F0dHJpYnV0ZSxcbiAgICAgICAgb3B0aW9uc1NvdXJjZVN0YXRpY0RhdGFTb3VyY2VcbiAgICB9ID0gYXJncztcbiAgICBjb25zdCBlbXB0eVN0cmluZ0Zvcm1hdCA9IGVtcHR5T3B0aW9uVGV4dCA/IGBbJHtlbXB0eU9wdGlvblRleHR9XWAgOiBcIkNvbWJvIGJveFwiO1xuICAgIGlmIChzb3VyY2UgPT09IFwiY29udGV4dFwiKSB7XG4gICAgICAgIHN3aXRjaCAob3B0aW9uc1NvdXJjZVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJhc3NvY2lhdGlvblwiOlxuICAgICAgICAgICAgICAgIHJldHVybiAob3B0aW9uc1NvdXJjZUFzc29jaWF0aW9uRGF0YVNvdXJjZSBhcyB7IGNhcHRpb24/OiBzdHJpbmcgfSk/LmNhcHRpb24gfHwgZW1wdHlTdHJpbmdGb3JtYXQ7XG4gICAgICAgICAgICBjYXNlIFwiZW51bWVyYXRpb25cIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gYFske29wdGlvbnNTb3VyY2VUeXBlfSwgJHthdHRyaWJ1dGVFbnVtZXJhdGlvbn1dYDtcbiAgICAgICAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGBbJHtvcHRpb25zU291cmNlVHlwZX0sICR7YXR0cmlidXRlQm9vbGVhbn1dYDtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVtcHR5U3RyaW5nRm9ybWF0O1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChzb3VyY2UgPT09IFwiZGF0YWJhc2VcIiAmJiBvcHRpb25zU291cmNlRGF0YWJhc2VEYXRhU291cmNlKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAob3B0aW9uc1NvdXJjZURhdGFiYXNlRGF0YVNvdXJjZSBhcyB7IGNhcHRpb24/OiBzdHJpbmcgfSk/LmNhcHRpb24gfHxcbiAgICAgICAgICAgIGAke3NvdXJjZX0sICR7ZGF0YWJhc2VBdHRyaWJ1dGVTdHJpbmd9YFxuICAgICAgICApO1xuICAgIH0gZWxzZSBpZiAoc291cmNlID09PSBcInN0YXRpY1wiKSB7XG4gICAgICAgIHJldHVybiAob3B0aW9uc1NvdXJjZVN0YXRpY0RhdGFTb3VyY2UgYXMgeyBjYXB0aW9uPzogc3RyaW5nIH0pPy5jYXB0aW9uIHx8IGBbJHtzb3VyY2V9LCAke3N0YXRpY0F0dHJpYnV0ZX1dYDtcbiAgICB9XG4gICAgcmV0dXJuIGVtcHR5U3RyaW5nRm9ybWF0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsdGVyVHlwZU9wdGlvbnMoZmlsdGVyOiBGaWx0ZXJUeXBlRW51bSk6IE1hdGNoU29ydGVyT3B0aW9uczxzdHJpbmc+IHtcbiAgICBzd2l0Y2ggKGZpbHRlcikge1xuICAgICAgICBjYXNlIFwiY29udGFpbnNcIjpcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgY2FzZSBcImNvbnRhaW5zRXhhY3RcIjpcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGhyZXNob2xkOiBtYXRjaFNvcnRlci5yYW5raW5ncy5DT05UQUlOU1xuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSBcInN0YXJ0c1dpdGhcIjpcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGhyZXNob2xkOiBtYXRjaFNvcnRlci5yYW5raW5ncy5XT1JEX1NUQVJUU19XSVRIXG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIFwibm9uZVwiOlxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQ6IG1hdGNoU29ydGVyLnJhbmtpbmdzLk5PX01BVENIXG4gICAgICAgICAgICB9O1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF92YWx1ZXNJc0VxdWFsKHZhbHVlQTogVmFsdWVUeXBlLCB2YWx1ZUI6IFZhbHVlVHlwZSk6IGJvb2xlYW4ge1xuICAgIGlmICh2YWx1ZUEgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZUIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdmFsdWVBID09PSB2YWx1ZUI7XG4gICAgfVxuICAgIGlmICh2YWx1ZUEgaW5zdGFuY2VvZiBCaWcgJiYgdmFsdWVCIGluc3RhbmNlb2YgQmlnKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZUEuZXEodmFsdWVCKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlQSBpbnN0YW5jZW9mIERhdGUgJiYgdmFsdWVCIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWVBLmdldFRpbWUoKSA9PT0gdmFsdWVCLmdldFRpbWUoKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlQSA9PT0gdmFsdWVCO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc29ydFNlbGVjdGVkSXRlbXMoXG4gICAgdmFsdWVzOiBPYmplY3RJdGVtW10gfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgIHNvcnRpbmdUeXBlOiBTZWxlY3RlZEl0ZW1zU29ydGluZ0VudW0sXG4gICAgc29ydE9yZGVyOiBTb3J0T3JkZXIsXG4gICAgY2FwdGlvbkdldHRlcjogKGlkOiBzdHJpbmcpID0+IHN0cmluZyB8IHVuZGVmaW5lZFxuKTogc3RyaW5nW10gfCBudWxsIHtcbiAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJldHVybiBzb3J0U2VsZWN0aW9ucyhcbiAgICAgICAgICAgIHZhbHVlcy5tYXAodiA9PiAodj8uaWQgYXMgc3RyaW5nKSA/PyBudWxsKSxcbiAgICAgICAgICAgIHNvcnRpbmdUeXBlLFxuICAgICAgICAgICAgc29ydE9yZGVyLFxuICAgICAgICAgICAgY2FwdGlvbkdldHRlclxuICAgICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc29ydFNlbGVjdGlvbnMoXG4gICAgbmV3VmFsdWVJZHM6IHN0cmluZ1tdLFxuICAgIHNvcnRpbmdUeXBlOiBTZWxlY3RlZEl0ZW1zU29ydGluZ0VudW0sXG4gICAgc29ydE9yZGVyOiBTb3J0T3JkZXIsXG4gICAgY2FwdGlvbkdldHRlcjogKGlkOiBzdHJpbmcpID0+IHN0cmluZyB8IHVuZGVmaW5lZFxuKTogc3RyaW5nW10ge1xuICAgIGlmIChzb3J0aW5nVHlwZSA9PT0gXCJjYXB0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIG5ld1ZhbHVlSWRzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhcHRpb25BID0gY2FwdGlvbkdldHRlcihhKT8udG9TdHJpbmcoKSA/PyBcIlwiO1xuICAgICAgICAgICAgY29uc3QgY2FwdGlvbkIgPSBjYXB0aW9uR2V0dGVyKGIpPy50b1N0cmluZygpID8/IFwiXCI7XG4gICAgICAgICAgICByZXR1cm4gc29ydE9yZGVyID09PSBcImFzY1wiID8gY2FwdGlvbkEubG9jYWxlQ29tcGFyZShjYXB0aW9uQikgOiBjYXB0aW9uQi5sb2NhbGVDb21wYXJlKGNhcHRpb25BKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBuZXdWYWx1ZUlkcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldElucHV0TGFiZWwoaW5wdXRJZDogc3RyaW5nKTogRWxlbWVudCB8IG51bGwge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBsYWJlbFtmb3I9XCIke0NTUy5lc2NhcGUoaW5wdXRJZCl9XCJdYCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRWYWxpZGF0aW9uRXJyb3JJZChpbnB1dElkPzogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gaW5wdXRJZCA/IGlucHV0SWQgKyBcIi12YWxpZGF0aW9uLW1lc3NhZ2VcIiA6IHVuZGVmaW5lZDtcbn1cbiIsImltcG9ydCBjbGFzc05hbWVzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgeyBGcmFnbWVudCwgTW91c2VFdmVudCwgUmVhY3RFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBDYXB0aW9uQ29udGVudCB9IGZyb20gXCIuLi9oZWxwZXJzL3V0aWxzXCI7XG5leHBvcnQgZnVuY3Rpb24gQ2xlYXJCdXR0b24oeyBzaXplID0gMTQgfSk6IFJlYWN0RWxlbWVudCB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94LWljb24tY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8c3ZnIHdpZHRoPXtzaXplfSBoZWlnaHQ9e3NpemV9IHZpZXdCb3g9XCIwIDAgMzIgMzJcIiBjbGFzc05hbWU9XCJ3aWRnZXQtY29tYm9ib3gtY2xlYXItYnV0dG9uLWljb25cIj5cbiAgICAgICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgICAgIGQ9XCJNMjcuNzEgNS43MTAwNEwyNi4yOSA0LjI5MDA0TDE2IDE0LjU5TDUuNzEwMDQgNC4yOTAwNEw0LjI5MDA0IDUuNzEwMDRMMTQuNTkgMTZMNC4yOTAwNCAyNi4yOUw1LjcxMDA0IDI3LjcxTDE2IDE3LjQxTDI2LjI5IDI3LjcxTDI3LjcxIDI2LjI5TDE3LjQxIDE2TDI3LjcxIDUuNzEwMDRaXCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvc3Bhbj5cbiAgICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRG93bkFycm93KHsgaXNPcGVuIH06IHsgaXNPcGVuPzogYm9vbGVhbiB9KTogUmVhY3RFbGVtZW50IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ3aWRnZXQtY29tYm9ib3gtaWNvbi1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXCJ3aWRnZXQtY29tYm9ib3gtZG93bi1hcnJvdy1pY29uXCIsIFwibXgtaWNvbi1saW5lZFwiLCBcIm14LWljb24tY2hldnJvbi1kb3duXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlOiBpc09wZW5cbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB3aWR0aD1cIjE2XCJcbiAgICAgICAgICAgICAgICBoZWlnaHQ9XCIxNlwiXG4gICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAzMiAzMlwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xNiAyMy40MUw0LjI5MDA0IDExLjcxTDUuNzEwMDQgMTAuMjlMMTYgMjAuNTlMMjYuMjkgMTAuMjlMMjcuNzEgMTEuNzFMMTYgMjMuNDFaXCIgLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L3NwYW4+XG4gICAgKTtcbn1cblxuaW50ZXJmYWNlIENoZWNrYm94UHJvcHMge1xuICAgIGNoZWNrZWQ6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gICAgaWQ/OiBzdHJpbmc7XG4gICAgZm9jdXNhYmxlPzogYm9vbGVhbjtcbiAgICBvbkNsaWNrPzogKGU6IE1vdXNlRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+IHZvaWQ7XG4gICAgYXJpYUxhYmVsPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ2hlY2tib3goeyBjaGVja2VkLCBpZCwgZm9jdXNhYmxlLCBvbkNsaWNrLCBhcmlhTGFiZWwgfTogQ2hlY2tib3hQcm9wcyk6IFJlYWN0RWxlbWVudCB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94LWljb24tY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICAgIHRhYkluZGV4PXtmb2N1c2FibGUgPyAwIDogLTF9XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e2NoZWNrZWR9XG4gICAgICAgICAgICAgICAgICAgIGlkPXtpZH1cbiAgICAgICAgICAgICAgICAgICAgcm9sZT1cInByZXNlbnRhdGlvblwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e1xuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGlja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gb25DbGlja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKGU6IE1vdXNlRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eygpID0+IHt9fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICB7YXJpYUxhYmVsID8gPENhcHRpb25Db250ZW50IGh0bWxGb3I9e2lkfT57YXJpYUxhYmVsfTwvQ2FwdGlvbkNvbnRlbnQ+IDogdW5kZWZpbmVkfVxuICAgICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG59XG4iLCJmdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShyLCBlKSB7XG4gIGlmIChudWxsID09IHIpIHJldHVybiB7fTtcbiAgdmFyIHQgPSB7fTtcbiAgZm9yICh2YXIgbiBpbiByKSBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChyLCBuKSkge1xuICAgIGlmICgtMSAhPT0gZS5pbmRleE9mKG4pKSBjb250aW51ZTtcbiAgICB0W25dID0gcltuXTtcbiAgfVxuICByZXR1cm4gdDtcbn1cbmV4cG9ydCB7IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlIGFzIGRlZmF1bHQgfTsiLCJmdW5jdGlvbiBfZXh0ZW5kcygpIHtcbiAgcmV0dXJuIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiA/IE9iamVjdC5hc3NpZ24uYmluZCgpIDogZnVuY3Rpb24gKG4pIHtcbiAgICBmb3IgKHZhciBlID0gMTsgZSA8IGFyZ3VtZW50cy5sZW5ndGg7IGUrKykge1xuICAgICAgdmFyIHQgPSBhcmd1bWVudHNbZV07XG4gICAgICBmb3IgKHZhciByIGluIHQpICh7fSkuaGFzT3duUHJvcGVydHkuY2FsbCh0LCByKSAmJiAobltyXSA9IHRbcl0pO1xuICAgIH1cbiAgICByZXR1cm4gbjtcbiAgfSwgX2V4dGVuZHMuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbn1cbmV4cG9ydCB7IF9leHRlbmRzIGFzIGRlZmF1bHQgfTsiLCJmdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKGUpIHtcbiAgaWYgKHZvaWQgMCA9PT0gZSkgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICByZXR1cm4gZTtcbn1cbmV4cG9ydCB7IF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQgYXMgZGVmYXVsdCB9OyIsImZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZih0LCBlKSB7XG4gIHJldHVybiBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2YuYmluZCgpIDogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICByZXR1cm4gdC5fX3Byb3RvX18gPSBlLCB0O1xuICB9LCBfc2V0UHJvdG90eXBlT2YodCwgZSk7XG59XG5leHBvcnQgeyBfc2V0UHJvdG90eXBlT2YgYXMgZGVmYXVsdCB9OyIsImltcG9ydCBzZXRQcm90b3R5cGVPZiBmcm9tIFwiLi9zZXRQcm90b3R5cGVPZi5qc1wiO1xuZnVuY3Rpb24gX2luaGVyaXRzTG9vc2UodCwgbykge1xuICB0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoby5wcm90b3R5cGUpLCB0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHQsIHNldFByb3RvdHlwZU9mKHQsIG8pO1xufVxuZXhwb3J0IHsgX2luaGVyaXRzTG9vc2UgYXMgZGVmYXVsdCB9OyIsIi8qKiBAbGljZW5zZSBSZWFjdCB2MTYuMTMuMVxuICogcmVhY3QtaXMuZGV2ZWxvcG1lbnQuanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cblxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIChmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuLy8gVGhlIFN5bWJvbCB1c2VkIHRvIHRhZyB0aGUgUmVhY3RFbGVtZW50LWxpa2UgdHlwZXMuIElmIHRoZXJlIGlzIG5vIG5hdGl2ZSBTeW1ib2xcbi8vIG5vciBwb2x5ZmlsbCwgdGhlbiBhIHBsYWluIG51bWJlciBpcyB1c2VkIGZvciBwZXJmb3JtYW5jZS5cbnZhciBoYXNTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5mb3I7XG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpIDogMHhlYWM3O1xudmFyIFJFQUNUX1BPUlRBTF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucG9ydGFsJykgOiAweGVhY2E7XG52YXIgUkVBQ1RfRlJBR01FTlRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmZyYWdtZW50JykgOiAweGVhY2I7XG52YXIgUkVBQ1RfU1RSSUNUX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnN0cmljdF9tb2RlJykgOiAweGVhY2M7XG52YXIgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnByb2ZpbGVyJykgOiAweGVhZDI7XG52YXIgUkVBQ1RfUFJPVklERVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnByb3ZpZGVyJykgOiAweGVhY2Q7XG52YXIgUkVBQ1RfQ09OVEVYVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuY29udGV4dCcpIDogMHhlYWNlOyAvLyBUT0RPOiBXZSBkb24ndCB1c2UgQXN5bmNNb2RlIG9yIENvbmN1cnJlbnRNb2RlIGFueW1vcmUuIFRoZXkgd2VyZSB0ZW1wb3Jhcnlcbi8vICh1bnN0YWJsZSkgQVBJcyB0aGF0IGhhdmUgYmVlbiByZW1vdmVkLiBDYW4gd2UgcmVtb3ZlIHRoZSBzeW1ib2xzP1xuXG52YXIgUkVBQ1RfQVNZTkNfTU9ERV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuYXN5bmNfbW9kZScpIDogMHhlYWNmO1xudmFyIFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuY29uY3VycmVudF9tb2RlJykgOiAweGVhY2Y7XG52YXIgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmZvcndhcmRfcmVmJykgOiAweGVhZDA7XG52YXIgUkVBQ1RfU1VTUEVOU0VfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnN1c3BlbnNlJykgOiAweGVhZDE7XG52YXIgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3Quc3VzcGVuc2VfbGlzdCcpIDogMHhlYWQ4O1xudmFyIFJFQUNUX01FTU9fVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0Lm1lbW8nKSA6IDB4ZWFkMztcbnZhciBSRUFDVF9MQVpZX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5sYXp5JykgOiAweGVhZDQ7XG52YXIgUkVBQ1RfQkxPQ0tfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmJsb2NrJykgOiAweGVhZDk7XG52YXIgUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmZ1bmRhbWVudGFsJykgOiAweGVhZDU7XG52YXIgUkVBQ1RfUkVTUE9OREVSX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5yZXNwb25kZXInKSA6IDB4ZWFkNjtcbnZhciBSRUFDVF9TQ09QRV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3Quc2NvcGUnKSA6IDB4ZWFkNztcblxuZnVuY3Rpb24gaXNWYWxpZEVsZW1lbnRUeXBlKHR5cGUpIHtcbiAgcmV0dXJuIHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCAvLyBOb3RlOiBpdHMgdHlwZW9mIG1pZ2h0IGJlIG90aGVyIHRoYW4gJ3N5bWJvbCcgb3IgJ251bWJlcicgaWYgaXQncyBhIHBvbHlmaWxsLlxuICB0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1BST0ZJTEVSX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSB8fCB0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gbnVsbCAmJiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTEFaWV9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9QUk9WSURFUl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0NPTlRFWFRfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfUkVTUE9OREVSX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfU0NPUEVfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9CTE9DS19UWVBFKTtcbn1cblxuZnVuY3Rpb24gdHlwZU9mKG9iamVjdCkge1xuICBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0ICE9PSBudWxsKSB7XG4gICAgdmFyICQkdHlwZW9mID0gb2JqZWN0LiQkdHlwZW9mO1xuXG4gICAgc3dpdGNoICgkJHR5cGVvZikge1xuICAgICAgY2FzZSBSRUFDVF9FTEVNRU5UX1RZUEU6XG4gICAgICAgIHZhciB0eXBlID0gb2JqZWN0LnR5cGU7XG5cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgY2FzZSBSRUFDVF9BU1lOQ19NT0RFX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX0ZSQUdNRU5UX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9QUk9GSUxFUl9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfU1RSSUNUX01PREVfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX1RZUEU6XG4gICAgICAgICAgICByZXR1cm4gdHlwZTtcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2YXIgJCR0eXBlb2ZUeXBlID0gdHlwZSAmJiB0eXBlLiQkdHlwZW9mO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKCQkdHlwZW9mVHlwZSkge1xuICAgICAgICAgICAgICBjYXNlIFJFQUNUX0NPTlRFWFRfVFlQRTpcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFOlxuICAgICAgICAgICAgICBjYXNlIFJFQUNUX0xBWllfVFlQRTpcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9NRU1PX1RZUEU6XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfUFJPVklERVJfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gJCR0eXBlb2ZUeXBlO1xuXG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuICQkdHlwZW9mO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgICAgcmV0dXJuICQkdHlwZW9mO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59IC8vIEFzeW5jTW9kZSBpcyBkZXByZWNhdGVkIGFsb25nIHdpdGggaXNBc3luY01vZGVcblxudmFyIEFzeW5jTW9kZSA9IFJFQUNUX0FTWU5DX01PREVfVFlQRTtcbnZhciBDb25jdXJyZW50TW9kZSA9IFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFO1xudmFyIENvbnRleHRDb25zdW1lciA9IFJFQUNUX0NPTlRFWFRfVFlQRTtcbnZhciBDb250ZXh0UHJvdmlkZXIgPSBSRUFDVF9QUk9WSURFUl9UWVBFO1xudmFyIEVsZW1lbnQgPSBSRUFDVF9FTEVNRU5UX1RZUEU7XG52YXIgRm9yd2FyZFJlZiA9IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU7XG52YXIgRnJhZ21lbnQgPSBSRUFDVF9GUkFHTUVOVF9UWVBFO1xudmFyIExhenkgPSBSRUFDVF9MQVpZX1RZUEU7XG52YXIgTWVtbyA9IFJFQUNUX01FTU9fVFlQRTtcbnZhciBQb3J0YWwgPSBSRUFDVF9QT1JUQUxfVFlQRTtcbnZhciBQcm9maWxlciA9IFJFQUNUX1BST0ZJTEVSX1RZUEU7XG52YXIgU3RyaWN0TW9kZSA9IFJFQUNUX1NUUklDVF9NT0RFX1RZUEU7XG52YXIgU3VzcGVuc2UgPSBSRUFDVF9TVVNQRU5TRV9UWVBFO1xudmFyIGhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlID0gZmFsc2U7IC8vIEFzeW5jTW9kZSBzaG91bGQgYmUgZGVwcmVjYXRlZFxuXG5mdW5jdGlvbiBpc0FzeW5jTW9kZShvYmplY3QpIHtcbiAge1xuICAgIGlmICghaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNBc3luY01vZGUpIHtcbiAgICAgIGhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlID0gdHJ1ZTsgLy8gVXNpbmcgY29uc29sZVsnd2FybiddIHRvIGV2YWRlIEJhYmVsIGFuZCBFU0xpbnRcblxuICAgICAgY29uc29sZVsnd2FybiddKCdUaGUgUmVhY3RJcy5pc0FzeW5jTW9kZSgpIGFsaWFzIGhhcyBiZWVuIGRlcHJlY2F0ZWQsICcgKyAnYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZWFjdCAxNysuIFVwZGF0ZSB5b3VyIGNvZGUgdG8gdXNlICcgKyAnUmVhY3RJcy5pc0NvbmN1cnJlbnRNb2RlKCkgaW5zdGVhZC4gSXQgaGFzIHRoZSBleGFjdCBzYW1lIEFQSS4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaXNDb25jdXJyZW50TW9kZShvYmplY3QpIHx8IHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9BU1lOQ19NT0RFX1RZUEU7XG59XG5mdW5jdGlvbiBpc0NvbmN1cnJlbnRNb2RlKG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFO1xufVxuZnVuY3Rpb24gaXNDb250ZXh0Q29uc3VtZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfQ09OVEVYVF9UWVBFO1xufVxuZnVuY3Rpb24gaXNDb250ZXh0UHJvdmlkZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUFJPVklERVJfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzRWxlbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdCAhPT0gbnVsbCAmJiBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzRm9yd2FyZFJlZihvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFO1xufVxuZnVuY3Rpb24gaXNGcmFnbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFO1xufVxuZnVuY3Rpb24gaXNMYXp5KG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0xBWllfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzTWVtbyhvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9NRU1PX1RZUEU7XG59XG5mdW5jdGlvbiBpc1BvcnRhbChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9QT1JUQUxfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzUHJvZmlsZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUFJPRklMRVJfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzU3RyaWN0TW9kZShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFO1xufVxuZnVuY3Rpb24gaXNTdXNwZW5zZShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFO1xufVxuXG5leHBvcnRzLkFzeW5jTW9kZSA9IEFzeW5jTW9kZTtcbmV4cG9ydHMuQ29uY3VycmVudE1vZGUgPSBDb25jdXJyZW50TW9kZTtcbmV4cG9ydHMuQ29udGV4dENvbnN1bWVyID0gQ29udGV4dENvbnN1bWVyO1xuZXhwb3J0cy5Db250ZXh0UHJvdmlkZXIgPSBDb250ZXh0UHJvdmlkZXI7XG5leHBvcnRzLkVsZW1lbnQgPSBFbGVtZW50O1xuZXhwb3J0cy5Gb3J3YXJkUmVmID0gRm9yd2FyZFJlZjtcbmV4cG9ydHMuRnJhZ21lbnQgPSBGcmFnbWVudDtcbmV4cG9ydHMuTGF6eSA9IExhenk7XG5leHBvcnRzLk1lbW8gPSBNZW1vO1xuZXhwb3J0cy5Qb3J0YWwgPSBQb3J0YWw7XG5leHBvcnRzLlByb2ZpbGVyID0gUHJvZmlsZXI7XG5leHBvcnRzLlN0cmljdE1vZGUgPSBTdHJpY3RNb2RlO1xuZXhwb3J0cy5TdXNwZW5zZSA9IFN1c3BlbnNlO1xuZXhwb3J0cy5pc0FzeW5jTW9kZSA9IGlzQXN5bmNNb2RlO1xuZXhwb3J0cy5pc0NvbmN1cnJlbnRNb2RlID0gaXNDb25jdXJyZW50TW9kZTtcbmV4cG9ydHMuaXNDb250ZXh0Q29uc3VtZXIgPSBpc0NvbnRleHRDb25zdW1lcjtcbmV4cG9ydHMuaXNDb250ZXh0UHJvdmlkZXIgPSBpc0NvbnRleHRQcm92aWRlcjtcbmV4cG9ydHMuaXNFbGVtZW50ID0gaXNFbGVtZW50O1xuZXhwb3J0cy5pc0ZvcndhcmRSZWYgPSBpc0ZvcndhcmRSZWY7XG5leHBvcnRzLmlzRnJhZ21lbnQgPSBpc0ZyYWdtZW50O1xuZXhwb3J0cy5pc0xhenkgPSBpc0xhenk7XG5leHBvcnRzLmlzTWVtbyA9IGlzTWVtbztcbmV4cG9ydHMuaXNQb3J0YWwgPSBpc1BvcnRhbDtcbmV4cG9ydHMuaXNQcm9maWxlciA9IGlzUHJvZmlsZXI7XG5leHBvcnRzLmlzU3RyaWN0TW9kZSA9IGlzU3RyaWN0TW9kZTtcbmV4cG9ydHMuaXNTdXNwZW5zZSA9IGlzU3VzcGVuc2U7XG5leHBvcnRzLmlzVmFsaWRFbGVtZW50VHlwZSA9IGlzVmFsaWRFbGVtZW50VHlwZTtcbmV4cG9ydHMudHlwZU9mID0gdHlwZU9mO1xuICB9KSgpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LWlzLnByb2R1Y3Rpb24ubWluLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LWlzLmRldmVsb3BtZW50LmpzJyk7XG59XG4iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9ICdTRUNSRVRfRE9fTk9UX1BBU1NfVEhJU19PUl9ZT1VfV0lMTF9CRV9GSVJFRCc7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RQcm9wVHlwZXNTZWNyZXQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEZ1bmN0aW9uLmNhbGwuYmluZChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24oKSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gcmVxdWlyZSgnLi9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcbiAgdmFyIGxvZ2dlZFR5cGVGYWlsdXJlcyA9IHt9O1xuICB2YXIgaGFzID0gcmVxdWlyZSgnLi9saWIvaGFzJyk7XG5cbiAgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyB0ZXh0O1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHsgLyoqLyB9XG4gIH07XG59XG5cbi8qKlxuICogQXNzZXJ0IHRoYXQgdGhlIHZhbHVlcyBtYXRjaCB3aXRoIHRoZSB0eXBlIHNwZWNzLlxuICogRXJyb3IgbWVzc2FnZXMgYXJlIG1lbW9yaXplZCBhbmQgd2lsbCBvbmx5IGJlIHNob3duIG9uY2UuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHR5cGVTcGVjcyBNYXAgb2YgbmFtZSB0byBhIFJlYWN0UHJvcFR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZXMgUnVudGltZSB2YWx1ZXMgdGhhdCBuZWVkIHRvIGJlIHR5cGUtY2hlY2tlZFxuICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uIGUuZy4gXCJwcm9wXCIsIFwiY29udGV4dFwiLCBcImNoaWxkIGNvbnRleHRcIlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbXBvbmVudE5hbWUgTmFtZSBvZiB0aGUgY29tcG9uZW50IGZvciBlcnJvciBtZXNzYWdlcy5cbiAqIEBwYXJhbSB7P0Z1bmN0aW9ufSBnZXRTdGFjayBSZXR1cm5zIHRoZSBjb21wb25lbnQgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjaGVja1Byb3BUeXBlcyh0eXBlU3BlY3MsIHZhbHVlcywgbG9jYXRpb24sIGNvbXBvbmVudE5hbWUsIGdldFN0YWNrKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgZm9yICh2YXIgdHlwZVNwZWNOYW1lIGluIHR5cGVTcGVjcykge1xuICAgICAgaWYgKGhhcyh0eXBlU3BlY3MsIHR5cGVTcGVjTmFtZSkpIHtcbiAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAvLyBQcm9wIHR5cGUgdmFsaWRhdGlvbiBtYXkgdGhyb3cuIEluIGNhc2UgdGhleSBkbywgd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgICAvLyBmYWlsIHRoZSByZW5kZXIgcGhhc2Ugd2hlcmUgaXQgZGlkbid0IGZhaWwgYmVmb3JlLiBTbyB3ZSBsb2cgaXQuXG4gICAgICAgIC8vIEFmdGVyIHRoZXNlIGhhdmUgYmVlbiBjbGVhbmVkIHVwLCB3ZSdsbCBsZXQgdGhlbSB0aHJvdy5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBUaGlzIGlzIGludGVudGlvbmFsbHkgYW4gaW52YXJpYW50IHRoYXQgZ2V0cyBjYXVnaHQuIEl0J3MgdGhlIHNhbWVcbiAgICAgICAgICAvLyBiZWhhdmlvciBhcyB3aXRob3V0IHRoaXMgc3RhdGVtZW50IGV4Y2VwdCB3aXRoIGEgYmV0dGVyIG1lc3NhZ2UuXG4gICAgICAgICAgaWYgKHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIGVyciA9IEVycm9yKFxuICAgICAgICAgICAgICAoY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnKSArICc6ICcgKyBsb2NhdGlvbiArICcgdHlwZSBgJyArIHR5cGVTcGVjTmFtZSArICdgIGlzIGludmFsaWQ7ICcgK1xuICAgICAgICAgICAgICAnaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLCBidXQgcmVjZWl2ZWQgYCcgKyB0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gKyAnYC4nICtcbiAgICAgICAgICAgICAgJ1RoaXMgb2Z0ZW4gaGFwcGVucyBiZWNhdXNlIG9mIHR5cG9zIHN1Y2ggYXMgYFByb3BUeXBlcy5mdW5jdGlvbmAgaW5zdGVhZCBvZiBgUHJvcFR5cGVzLmZ1bmNgLidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBlcnIubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZXJyb3IgPSB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSh2YWx1ZXMsIHR5cGVTcGVjTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIG51bGwsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBlcnJvciA9IGV4O1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnJvciAmJiAhKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSB7XG4gICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgKGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJykgKyAnOiB0eXBlIHNwZWNpZmljYXRpb24gb2YgJyArXG4gICAgICAgICAgICBsb2NhdGlvbiArICcgYCcgKyB0eXBlU3BlY05hbWUgKyAnYCBpcyBpbnZhbGlkOyB0aGUgdHlwZSBjaGVja2VyICcgK1xuICAgICAgICAgICAgJ2Z1bmN0aW9uIG11c3QgcmV0dXJuIGBudWxsYCBvciBhbiBgRXJyb3JgIGJ1dCByZXR1cm5lZCBhICcgKyB0eXBlb2YgZXJyb3IgKyAnLiAnICtcbiAgICAgICAgICAgICdZb3UgbWF5IGhhdmUgZm9yZ290dGVuIHRvIHBhc3MgYW4gYXJndW1lbnQgdG8gdGhlIHR5cGUgY2hlY2tlciAnICtcbiAgICAgICAgICAgICdjcmVhdG9yIChhcnJheU9mLCBpbnN0YW5jZU9mLCBvYmplY3RPZiwgb25lT2YsIG9uZU9mVHlwZSwgYW5kICcgK1xuICAgICAgICAgICAgJ3NoYXBlIGFsbCByZXF1aXJlIGFuIGFyZ3VtZW50KS4nXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciAmJiAhKGVycm9yLm1lc3NhZ2UgaW4gbG9nZ2VkVHlwZUZhaWx1cmVzKSkge1xuICAgICAgICAgIC8vIE9ubHkgbW9uaXRvciB0aGlzIGZhaWx1cmUgb25jZSBiZWNhdXNlIHRoZXJlIHRlbmRzIHRvIGJlIGEgbG90IG9mIHRoZVxuICAgICAgICAgIC8vIHNhbWUgZXJyb3IuXG4gICAgICAgICAgbG9nZ2VkVHlwZUZhaWx1cmVzW2Vycm9yLm1lc3NhZ2VdID0gdHJ1ZTtcblxuICAgICAgICAgIHZhciBzdGFjayA9IGdldFN0YWNrID8gZ2V0U3RhY2soKSA6ICcnO1xuXG4gICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgJ0ZhaWxlZCAnICsgbG9jYXRpb24gKyAnIHR5cGU6ICcgKyBlcnJvci5tZXNzYWdlICsgKHN0YWNrICE9IG51bGwgPyBzdGFjayA6ICcnKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBSZXNldHMgd2FybmluZyBjYWNoZSB3aGVuIHRlc3RpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuY2hlY2tQcm9wVHlwZXMucmVzZXRXYXJuaW5nQ2FjaGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNoZWNrUHJvcFR5cGVzO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdElzID0gcmVxdWlyZSgncmVhY3QtaXMnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9saWIvaGFzJyk7XG52YXIgY2hlY2tQcm9wVHlwZXMgPSByZXF1aXJlKCcuL2NoZWNrUHJvcFR5cGVzJyk7XG5cbnZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbigpIHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBwcmludFdhcm5pbmcgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIG1lc3NhZ2UgPSAnV2FybmluZzogJyArIHRleHQ7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfTtcbn1cblxuZnVuY3Rpb24gZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbCgpIHtcbiAgcmV0dXJuIG51bGw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXNWYWxpZEVsZW1lbnQsIHRocm93T25EaXJlY3RBY2Nlc3MpIHtcbiAgLyogZ2xvYmFsIFN5bWJvbCAqL1xuICB2YXIgSVRFUkFUT1JfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuaXRlcmF0b3I7XG4gIHZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJzsgLy8gQmVmb3JlIFN5bWJvbCBzcGVjLlxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpdGVyYXRvciBtZXRob2QgZnVuY3Rpb24gY29udGFpbmVkIG9uIHRoZSBpdGVyYWJsZSBvYmplY3QuXG4gICAqXG4gICAqIEJlIHN1cmUgdG8gaW52b2tlIHRoZSBmdW5jdGlvbiB3aXRoIHRoZSBpdGVyYWJsZSBhcyBjb250ZXh0OlxuICAgKlxuICAgKiAgICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKG15SXRlcmFibGUpO1xuICAgKiAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICogICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKG15SXRlcmFibGUpO1xuICAgKiAgICAgICAuLi5cbiAgICogICAgIH1cbiAgICpcbiAgICogQHBhcmFtIHs/b2JqZWN0fSBtYXliZUl0ZXJhYmxlXG4gICAqIEByZXR1cm4gez9mdW5jdGlvbn1cbiAgICovXG4gIGZ1bmN0aW9uIGdldEl0ZXJhdG9yRm4obWF5YmVJdGVyYWJsZSkge1xuICAgIHZhciBpdGVyYXRvckZuID0gbWF5YmVJdGVyYWJsZSAmJiAoSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbSVRFUkFUT1JfU1lNQk9MXSB8fCBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXSk7XG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3JGbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29sbGVjdGlvbiBvZiBtZXRob2RzIHRoYXQgYWxsb3cgZGVjbGFyYXRpb24gYW5kIHZhbGlkYXRpb24gb2YgcHJvcHMgdGhhdCBhcmVcbiAgICogc3VwcGxpZWQgdG8gUmVhY3QgY29tcG9uZW50cy4gRXhhbXBsZSB1c2FnZTpcbiAgICpcbiAgICogICB2YXIgUHJvcHMgPSByZXF1aXJlKCdSZWFjdFByb3BUeXBlcycpO1xuICAgKiAgIHZhciBNeUFydGljbGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAqICAgICBwcm9wVHlwZXM6IHtcbiAgICogICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIHByb3AgbmFtZWQgXCJkZXNjcmlwdGlvblwiLlxuICAgKiAgICAgICBkZXNjcmlwdGlvbjogUHJvcHMuc3RyaW5nLFxuICAgKlxuICAgKiAgICAgICAvLyBBIHJlcXVpcmVkIGVudW0gcHJvcCBuYW1lZCBcImNhdGVnb3J5XCIuXG4gICAqICAgICAgIGNhdGVnb3J5OiBQcm9wcy5vbmVPZihbJ05ld3MnLCdQaG90b3MnXSkuaXNSZXF1aXJlZCxcbiAgICpcbiAgICogICAgICAgLy8gQSBwcm9wIG5hbWVkIFwiZGlhbG9nXCIgdGhhdCByZXF1aXJlcyBhbiBpbnN0YW5jZSBvZiBEaWFsb2cuXG4gICAqICAgICAgIGRpYWxvZzogUHJvcHMuaW5zdGFuY2VPZihEaWFsb2cpLmlzUmVxdWlyZWRcbiAgICogICAgIH0sXG4gICAqICAgICByZW5kZXI6IGZ1bmN0aW9uKCkgeyAuLi4gfVxuICAgKiAgIH0pO1xuICAgKlxuICAgKiBBIG1vcmUgZm9ybWFsIHNwZWNpZmljYXRpb24gb2YgaG93IHRoZXNlIG1ldGhvZHMgYXJlIHVzZWQ6XG4gICAqXG4gICAqICAgdHlwZSA6PSBhcnJheXxib29sfGZ1bmN8b2JqZWN0fG51bWJlcnxzdHJpbmd8b25lT2YoWy4uLl0pfGluc3RhbmNlT2YoLi4uKVxuICAgKiAgIGRlY2wgOj0gUmVhY3RQcm9wVHlwZXMue3R5cGV9KC5pc1JlcXVpcmVkKT9cbiAgICpcbiAgICogRWFjaCBhbmQgZXZlcnkgZGVjbGFyYXRpb24gcHJvZHVjZXMgYSBmdW5jdGlvbiB3aXRoIHRoZSBzYW1lIHNpZ25hdHVyZS4gVGhpc1xuICAgKiBhbGxvd3MgdGhlIGNyZWF0aW9uIG9mIGN1c3RvbSB2YWxpZGF0aW9uIGZ1bmN0aW9ucy4gRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqICB2YXIgTXlMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgKiAgICBwcm9wVHlwZXM6IHtcbiAgICogICAgICAvLyBBbiBvcHRpb25hbCBzdHJpbmcgb3IgVVJJIHByb3AgbmFtZWQgXCJocmVmXCIuXG4gICAqICAgICAgaHJlZjogZnVuY3Rpb24ocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lKSB7XG4gICAqICAgICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgKiAgICAgICAgaWYgKHByb3BWYWx1ZSAhPSBudWxsICYmIHR5cGVvZiBwcm9wVmFsdWUgIT09ICdzdHJpbmcnICYmXG4gICAqICAgICAgICAgICAgIShwcm9wVmFsdWUgaW5zdGFuY2VvZiBVUkkpKSB7XG4gICAqICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXG4gICAqICAgICAgICAgICAgJ0V4cGVjdGVkIGEgc3RyaW5nIG9yIGFuIFVSSSBmb3IgJyArIHByb3BOYW1lICsgJyBpbiAnICtcbiAgICogICAgICAgICAgICBjb21wb25lbnROYW1lXG4gICAqICAgICAgICAgICk7XG4gICAqICAgICAgICB9XG4gICAqICAgICAgfVxuICAgKiAgICB9LFxuICAgKiAgICByZW5kZXI6IGZ1bmN0aW9uKCkgey4uLn1cbiAgICogIH0pO1xuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG5cbiAgdmFyIEFOT05ZTU9VUyA9ICc8PGFub255bW91cz4+JztcblxuICAvLyBJbXBvcnRhbnQhXG4gIC8vIEtlZXAgdGhpcyBsaXN0IGluIHN5bmMgd2l0aCBwcm9kdWN0aW9uIHZlcnNpb24gaW4gYC4vZmFjdG9yeVdpdGhUaHJvd2luZ1NoaW1zLmpzYC5cbiAgdmFyIFJlYWN0UHJvcFR5cGVzID0ge1xuICAgIGFycmF5OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYXJyYXknKSxcbiAgICBiaWdpbnQ6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdiaWdpbnQnKSxcbiAgICBib29sOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYm9vbGVhbicpLFxuICAgIGZ1bmM6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdmdW5jdGlvbicpLFxuICAgIG51bWJlcjogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ251bWJlcicpLFxuICAgIG9iamVjdDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ29iamVjdCcpLFxuICAgIHN0cmluZzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ3N0cmluZycpLFxuICAgIHN5bWJvbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ3N5bWJvbCcpLFxuXG4gICAgYW55OiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpLFxuICAgIGFycmF5T2Y6IGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcixcbiAgICBlbGVtZW50OiBjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIoKSxcbiAgICBlbGVtZW50VHlwZTogY3JlYXRlRWxlbWVudFR5cGVUeXBlQ2hlY2tlcigpLFxuICAgIGluc3RhbmNlT2Y6IGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIsXG4gICAgbm9kZTogY3JlYXRlTm9kZUNoZWNrZXIoKSxcbiAgICBvYmplY3RPZjogY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcixcbiAgICBvbmVPZjogY3JlYXRlRW51bVR5cGVDaGVja2VyLFxuICAgIG9uZU9mVHlwZTogY3JlYXRlVW5pb25UeXBlQ2hlY2tlcixcbiAgICBzaGFwZTogY3JlYXRlU2hhcGVUeXBlQ2hlY2tlcixcbiAgICBleGFjdDogY3JlYXRlU3RyaWN0U2hhcGVUeXBlQ2hlY2tlcixcbiAgfTtcblxuICAvKipcbiAgICogaW5saW5lZCBPYmplY3QuaXMgcG9seWZpbGwgdG8gYXZvaWQgcmVxdWlyaW5nIGNvbnN1bWVycyBzaGlwIHRoZWlyIG93blxuICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvaXNcbiAgICovXG4gIC8qZXNsaW50LWRpc2FibGUgbm8tc2VsZi1jb21wYXJlKi9cbiAgZnVuY3Rpb24gaXMoeCwgeSkge1xuICAgIC8vIFNhbWVWYWx1ZSBhbGdvcml0aG1cbiAgICBpZiAoeCA9PT0geSkge1xuICAgICAgLy8gU3RlcHMgMS01LCA3LTEwXG4gICAgICAvLyBTdGVwcyA2LmItNi5lOiArMCAhPSAtMFxuICAgICAgcmV0dXJuIHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTdGVwIDYuYTogTmFOID09IE5hTlxuICAgICAgcmV0dXJuIHggIT09IHggJiYgeSAhPT0geTtcbiAgICB9XG4gIH1cbiAgLyplc2xpbnQtZW5hYmxlIG5vLXNlbGYtY29tcGFyZSovXG5cbiAgLyoqXG4gICAqIFdlIHVzZSBhbiBFcnJvci1saWtlIG9iamVjdCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSBhcyBwZW9wbGUgbWF5IGNhbGxcbiAgICogUHJvcFR5cGVzIGRpcmVjdGx5IGFuZCBpbnNwZWN0IHRoZWlyIG91dHB1dC4gSG93ZXZlciwgd2UgZG9uJ3QgdXNlIHJlYWxcbiAgICogRXJyb3JzIGFueW1vcmUuIFdlIGRvbid0IGluc3BlY3QgdGhlaXIgc3RhY2sgYW55d2F5LCBhbmQgY3JlYXRpbmcgdGhlbVxuICAgKiBpcyBwcm9oaWJpdGl2ZWx5IGV4cGVuc2l2ZSBpZiB0aGV5IGFyZSBjcmVhdGVkIHRvbyBvZnRlbiwgc3VjaCBhcyB3aGF0XG4gICAqIGhhcHBlbnMgaW4gb25lT2ZUeXBlKCkgZm9yIGFueSB0eXBlIGJlZm9yZSB0aGUgb25lIHRoYXQgbWF0Y2hlZC5cbiAgICovXG4gIGZ1bmN0aW9uIFByb3BUeXBlRXJyb3IobWVzc2FnZSwgZGF0YSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5kYXRhID0gZGF0YSAmJiB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhOiB7fTtcbiAgICB0aGlzLnN0YWNrID0gJyc7XG4gIH1cbiAgLy8gTWFrZSBgaW5zdGFuY2VvZiBFcnJvcmAgc3RpbGwgd29yayBmb3IgcmV0dXJuZWQgZXJyb3JzLlxuICBQcm9wVHlwZUVycm9yLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcblxuICBmdW5jdGlvbiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGUgPSB7fTtcbiAgICAgIHZhciBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCA9IDA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNoZWNrVHlwZShpc1JlcXVpcmVkLCBwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudE5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgcHJvcEZ1bGxOYW1lID0gcHJvcEZ1bGxOYW1lIHx8IHByb3BOYW1lO1xuXG4gICAgICBpZiAoc2VjcmV0ICE9PSBSZWFjdFByb3BUeXBlc1NlY3JldCkge1xuICAgICAgICBpZiAodGhyb3dPbkRpcmVjdEFjY2Vzcykge1xuICAgICAgICAgIC8vIE5ldyBiZWhhdmlvciBvbmx5IGZvciB1c2VycyBvZiBgcHJvcC10eXBlc2AgcGFja2FnZVxuICAgICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoXG4gICAgICAgICAgICAnQ2FsbGluZyBQcm9wVHlwZXMgdmFsaWRhdG9ycyBkaXJlY3RseSBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAgICAgICAnVXNlIGBQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMoKWAgdG8gY2FsbCB0aGVtLiAnICtcbiAgICAgICAgICAgICdSZWFkIG1vcmUgYXQgaHR0cDovL2ZiLm1lL3VzZS1jaGVjay1wcm9wLXR5cGVzJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgZXJyLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgLy8gT2xkIGJlaGF2aW9yIGZvciBwZW9wbGUgdXNpbmcgUmVhY3QuUHJvcFR5cGVzXG4gICAgICAgICAgdmFyIGNhY2hlS2V5ID0gY29tcG9uZW50TmFtZSArICc6JyArIHByb3BOYW1lO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFtYW51YWxQcm9wVHlwZUNhbGxDYWNoZVtjYWNoZUtleV0gJiZcbiAgICAgICAgICAgIC8vIEF2b2lkIHNwYW1taW5nIHRoZSBjb25zb2xlIGJlY2F1c2UgdGhleSBhcmUgb2Z0ZW4gbm90IGFjdGlvbmFibGUgZXhjZXB0IGZvciBsaWIgYXV0aG9yc1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPCAzXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBwcmludFdhcm5pbmcoXG4gICAgICAgICAgICAgICdZb3UgYXJlIG1hbnVhbGx5IGNhbGxpbmcgYSBSZWFjdC5Qcm9wVHlwZXMgdmFsaWRhdGlvbiAnICtcbiAgICAgICAgICAgICAgJ2Z1bmN0aW9uIGZvciB0aGUgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBwcm9wIG9uIGAnICsgY29tcG9uZW50TmFtZSArICdgLiBUaGlzIGlzIGRlcHJlY2F0ZWQgJyArXG4gICAgICAgICAgICAgICdhbmQgd2lsbCB0aHJvdyBpbiB0aGUgc3RhbmRhbG9uZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAgICAgICAgICdZb3UgbWF5IGJlIHNlZWluZyB0aGlzIHdhcm5pbmcgZHVlIHRvIGEgdGhpcmQtcGFydHkgUHJvcFR5cGVzICcgK1xuICAgICAgICAgICAgICAnbGlicmFyeS4gU2VlIGh0dHBzOi8vZmIubWUvcmVhY3Qtd2FybmluZy1kb250LWNhbGwtcHJvcHR5cGVzICcgKyAnZm9yIGRldGFpbHMuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSA9IHRydWU7XG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PSBudWxsKSB7XG4gICAgICAgIGlmIChpc1JlcXVpcmVkKSB7XG4gICAgICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdUaGUgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCAnICsgKCdpbiBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgYnV0IGl0cyB2YWx1ZSBpcyBgbnVsbGAuJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1RoZSAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgaXMgbWFya2VkIGFzIHJlcXVpcmVkIGluICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBidXQgaXRzIHZhbHVlIGlzIGB1bmRlZmluZWRgLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjaGFpbmVkQ2hlY2tUeXBlID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgZmFsc2UpO1xuICAgIGNoYWluZWRDaGVja1R5cGUuaXNSZXF1aXJlZCA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIHRydWUpO1xuXG4gICAgcmV0dXJuIGNoYWluZWRDaGVja1R5cGU7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihleHBlY3RlZFR5cGUpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09IGV4cGVjdGVkVHlwZSkge1xuICAgICAgICAvLyBgcHJvcFZhbHVlYCBiZWluZyBpbnN0YW5jZSBvZiwgc2F5LCBkYXRlL3JlZ2V4cCwgcGFzcyB0aGUgJ29iamVjdCdcbiAgICAgICAgLy8gY2hlY2ssIGJ1dCB3ZSBjYW4gb2ZmZXIgYSBtb3JlIHByZWNpc2UgZXJyb3IgbWVzc2FnZSBoZXJlIHJhdGhlciB0aGFuXG4gICAgICAgIC8vICdvZiB0eXBlIGBvYmplY3RgJy5cbiAgICAgICAgdmFyIHByZWNpc2VUeXBlID0gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoXG4gICAgICAgICAgJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcmVjaXNlVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnYCcgKyBleHBlY3RlZFR5cGUgKyAnYC4nKSxcbiAgICAgICAgICB7ZXhwZWN0ZWRUeXBlOiBleHBlY3RlZFR5cGV9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFueVR5cGVDaGVja2VyKCkge1xuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcihlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcih0eXBlQ2hlY2tlcikge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiB0eXBlQ2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1Byb3BlcnR5IGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgY29tcG9uZW50IGAnICsgY29tcG9uZW50TmFtZSArICdgIGhhcyBpbnZhbGlkIFByb3BUeXBlIG5vdGF0aW9uIGluc2lkZSBhcnJheU9mLicpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIGFycmF5LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcFZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwgaSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICdbJyArIGkgKyAnXScsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIHNpbmdsZSBSZWFjdEVsZW1lbnQuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50VHlwZVR5cGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghUmVhY3RJcy5pc1ZhbGlkRWxlbWVudFR5cGUocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIHNpbmdsZSBSZWFjdEVsZW1lbnQgdHlwZS4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIoZXhwZWN0ZWRDbGFzcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKCEocHJvcHNbcHJvcE5hbWVdIGluc3RhbmNlb2YgZXhwZWN0ZWRDbGFzcykpIHtcbiAgICAgICAgdmFyIGV4cGVjdGVkQ2xhc3NOYW1lID0gZXhwZWN0ZWRDbGFzcy5uYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgICAgdmFyIGFjdHVhbENsYXNzTmFtZSA9IGdldENsYXNzTmFtZShwcm9wc1twcm9wTmFtZV0pO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBhY3R1YWxDbGFzc05hbWUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2luc3RhbmNlIG9mIGAnICsgZXhwZWN0ZWRDbGFzc05hbWUgKyAnYC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVudW1UeXBlQ2hlY2tlcihleHBlY3RlZFZhbHVlcykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShleHBlY3RlZFZhbHVlcykpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50cyBzdXBwbGllZCB0byBvbmVPZiwgZXhwZWN0ZWQgYW4gYXJyYXksIGdvdCAnICsgYXJndW1lbnRzLmxlbmd0aCArICcgYXJndW1lbnRzLiAnICtcbiAgICAgICAgICAgICdBIGNvbW1vbiBtaXN0YWtlIGlzIHRvIHdyaXRlIG9uZU9mKHgsIHksIHopIGluc3RlYWQgb2Ygb25lT2YoW3gsIHksIHpdKS4nXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcmludFdhcm5pbmcoJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2YsIGV4cGVjdGVkIGFuIGFycmF5LicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV4cGVjdGVkVmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpcyhwcm9wVmFsdWUsIGV4cGVjdGVkVmFsdWVzW2ldKSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciB2YWx1ZXNTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShleHBlY3RlZFZhbHVlcywgZnVuY3Rpb24gcmVwbGFjZXIoa2V5LCB2YWx1ZSkge1xuICAgICAgICB2YXIgdHlwZSA9IGdldFByZWNpc2VUeXBlKHZhbHVlKTtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHZhbHVlIGAnICsgU3RyaW5nKHByb3BWYWx1ZSkgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgb25lIG9mICcgKyB2YWx1ZXNTdHJpbmcgKyAnLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgb2JqZWN0T2YuJyk7XG4gICAgICB9XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gb2JqZWN0LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wVmFsdWUpIHtcbiAgICAgICAgaWYgKGhhcyhwcm9wVmFsdWUsIGtleSkpIHtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIoYXJyYXlPZlR5cGVDaGVja2Vycykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnJheU9mVHlwZUNoZWNrZXJzKSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHByaW50V2FybmluZygnSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZlR5cGUsIGV4cGVjdGVkIGFuIGluc3RhbmNlIG9mIGFycmF5LicpIDogdm9pZCAwO1xuICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGw7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hlY2tlciA9IGFycmF5T2ZUeXBlQ2hlY2tlcnNbaV07XG4gICAgICBpZiAodHlwZW9mIGNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mVHlwZS4gRXhwZWN0ZWQgYW4gYXJyYXkgb2YgY2hlY2sgZnVuY3Rpb25zLCBidXQgJyArXG4gICAgICAgICAgJ3JlY2VpdmVkICcgKyBnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmcoY2hlY2tlcikgKyAnIGF0IGluZGV4ICcgKyBpICsgJy4nXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIGV4cGVjdGVkVHlwZXMgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlPZlR5cGVDaGVja2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hlY2tlciA9IGFycmF5T2ZUeXBlQ2hlY2tlcnNbaV07XG4gICAgICAgIHZhciBjaGVja2VyUmVzdWx0ID0gY2hlY2tlcihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGNoZWNrZXJSZXN1bHQgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGVja2VyUmVzdWx0LmRhdGEgJiYgaGFzKGNoZWNrZXJSZXN1bHQuZGF0YSwgJ2V4cGVjdGVkVHlwZScpKSB7XG4gICAgICAgICAgZXhwZWN0ZWRUeXBlcy5wdXNoKGNoZWNrZXJSZXN1bHQuZGF0YS5leHBlY3RlZFR5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgZXhwZWN0ZWRUeXBlc01lc3NhZ2UgPSAoZXhwZWN0ZWRUeXBlcy5sZW5ndGggPiAwKSA/ICcsIGV4cGVjdGVkIG9uZSBvZiB0eXBlIFsnICsgZXhwZWN0ZWRUeXBlcy5qb2luKCcsICcpICsgJ10nOiAnJztcbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AnICsgZXhwZWN0ZWRUeXBlc01lc3NhZ2UgKyAnLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU5vZGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKCFpc05vZGUocHJvcHNbcHJvcE5hbWVdKSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHN1cHBsaWVkIHRvICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIFJlYWN0Tm9kZS4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludmFsaWRWYWxpZGF0b3JFcnJvcihjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBrZXksIHR5cGUpIHtcbiAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoXG4gICAgICAoY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnKSArICc6ICcgKyBsb2NhdGlvbiArICcgdHlwZSBgJyArIHByb3BGdWxsTmFtZSArICcuJyArIGtleSArICdgIGlzIGludmFsaWQ7ICcgK1xuICAgICAgJ2l0IG11c3QgYmUgYSBmdW5jdGlvbiwgdXN1YWxseSBmcm9tIHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZSwgYnV0IHJlY2VpdmVkIGAnICsgdHlwZSArICdgLidcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU2hhcGVUeXBlQ2hlY2tlcihzaGFwZVR5cGVzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIGAnICsgcHJvcFR5cGUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYG9iamVjdGAuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIHNoYXBlVHlwZXMpIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICAgIGlmICh0eXBlb2YgY2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiBpbnZhbGlkVmFsaWRhdG9yRXJyb3IoY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwga2V5LCBnZXRQcmVjaXNlVHlwZShjaGVja2VyKSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVycm9yID0gY2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU3RyaWN0U2hhcGVUeXBlQ2hlY2tlcihzaGFwZVR5cGVzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIGAnICsgcHJvcFR5cGUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYG9iamVjdGAuJykpO1xuICAgICAgfVxuICAgICAgLy8gV2UgbmVlZCB0byBjaGVjayBhbGwga2V5cyBpbiBjYXNlIHNvbWUgYXJlIHJlcXVpcmVkIGJ1dCBtaXNzaW5nIGZyb20gcHJvcHMuXG4gICAgICB2YXIgYWxsS2V5cyA9IGFzc2lnbih7fSwgcHJvcHNbcHJvcE5hbWVdLCBzaGFwZVR5cGVzKTtcbiAgICAgIGZvciAodmFyIGtleSBpbiBhbGxLZXlzKSB7XG4gICAgICAgIHZhciBjaGVja2VyID0gc2hhcGVUeXBlc1trZXldO1xuICAgICAgICBpZiAoaGFzKHNoYXBlVHlwZXMsIGtleSkgJiYgdHlwZW9mIGNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gaW52YWxpZFZhbGlkYXRvckVycm9yKGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIGtleSwgZ2V0UHJlY2lzZVR5cGUoY2hlY2tlcikpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghY2hlY2tlcikge1xuICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcihcbiAgICAgICAgICAgICdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBrZXkgYCcgKyBrZXkgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4nICtcbiAgICAgICAgICAgICdcXG5CYWQgb2JqZWN0OiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcHNbcHJvcE5hbWVdLCBudWxsLCAnICAnKSArXG4gICAgICAgICAgICAnXFxuVmFsaWQga2V5czogJyArIEpTT04uc3RyaW5naWZ5KE9iamVjdC5rZXlzKHNoYXBlVHlwZXMpLCBudWxsLCAnICAnKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVycm9yID0gY2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc05vZGUocHJvcFZhbHVlKSB7XG4gICAgc3dpdGNoICh0eXBlb2YgcHJvcFZhbHVlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIHJldHVybiAhcHJvcFZhbHVlO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiBwcm9wVmFsdWUuZXZlcnkoaXNOb2RlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcFZhbHVlID09PSBudWxsIHx8IGlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihwcm9wVmFsdWUpO1xuICAgICAgICBpZiAoaXRlcmF0b3JGbikge1xuICAgICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChwcm9wVmFsdWUpO1xuICAgICAgICAgIHZhciBzdGVwO1xuICAgICAgICAgIGlmIChpdGVyYXRvckZuICE9PSBwcm9wVmFsdWUuZW50cmllcykge1xuICAgICAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgICAgICBpZiAoIWlzTm9kZShzdGVwLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJdGVyYXRvciB3aWxsIHByb3ZpZGUgZW50cnkgW2ssdl0gdHVwbGVzIHJhdGhlciB0aGFuIHZhbHVlcy5cbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc05vZGUoZW50cnlbMV0pKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpIHtcbiAgICAvLyBOYXRpdmUgU3ltYm9sLlxuICAgIGlmIChwcm9wVHlwZSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIGZhbHN5IHZhbHVlIGNhbid0IGJlIGEgU3ltYm9sXG4gICAgaWYgKCFwcm9wVmFsdWUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddID09PSAnU3ltYm9sJ1xuICAgIGlmIChwcm9wVmFsdWVbJ0BAdG9TdHJpbmdUYWcnXSA9PT0gJ1N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIEZhbGxiYWNrIGZvciBub24tc3BlYyBjb21wbGlhbnQgU3ltYm9scyB3aGljaCBhcmUgcG9seWZpbGxlZC5cbiAgICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wVmFsdWUgaW5zdGFuY2VvZiBTeW1ib2wpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIEVxdWl2YWxlbnQgb2YgYHR5cGVvZmAgYnV0IHdpdGggc3BlY2lhbCBoYW5kbGluZyBmb3IgYXJyYXkgYW5kIHJlZ2V4cC5cbiAgZnVuY3Rpb24gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKSB7XG4gICAgdmFyIHByb3BUeXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ2FycmF5JztcbiAgICB9XG4gICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgLy8gT2xkIHdlYmtpdHMgKGF0IGxlYXN0IHVudGlsIEFuZHJvaWQgNC4wKSByZXR1cm4gJ2Z1bmN0aW9uJyByYXRoZXIgdGhhblxuICAgICAgLy8gJ29iamVjdCcgZm9yIHR5cGVvZiBhIFJlZ0V4cC4gV2UnbGwgbm9ybWFsaXplIHRoaXMgaGVyZSBzbyB0aGF0IC9ibGEvXG4gICAgICAvLyBwYXNzZXMgUHJvcFR5cGVzLm9iamVjdC5cbiAgICAgIHJldHVybiAnb2JqZWN0JztcbiAgICB9XG4gICAgaWYgKGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ3N5bWJvbCc7XG4gICAgfVxuICAgIHJldHVybiBwcm9wVHlwZTtcbiAgfVxuXG4gIC8vIFRoaXMgaGFuZGxlcyBtb3JlIHR5cGVzIHRoYW4gYGdldFByb3BUeXBlYC4gT25seSB1c2VkIGZvciBlcnJvciBtZXNzYWdlcy5cbiAgLy8gU2VlIGBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcmAuXG4gIGZ1bmN0aW9uIGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSkge1xuICAgIGlmICh0eXBlb2YgcHJvcFZhbHVlID09PSAndW5kZWZpbmVkJyB8fCBwcm9wVmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJyArIHByb3BWYWx1ZTtcbiAgICB9XG4gICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICBpZiAocHJvcFR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICByZXR1cm4gJ2RhdGUnO1xuICAgICAgfSBlbHNlIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuICdyZWdleHAnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJvcFR5cGU7XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgcG9zdGZpeGVkIHRvIGEgd2FybmluZyBhYm91dCBhbiBpbnZhbGlkIHR5cGUuXG4gIC8vIEZvciBleGFtcGxlLCBcInVuZGVmaW5lZFwiIG9yIFwib2YgdHlwZSBhcnJheVwiXG4gIGZ1bmN0aW9uIGdldFBvc3RmaXhGb3JUeXBlV2FybmluZyh2YWx1ZSkge1xuICAgIHZhciB0eXBlID0gZ2V0UHJlY2lzZVR5cGUodmFsdWUpO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgcmV0dXJuICdhbiAnICsgdHlwZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICBjYXNlICdyZWdleHAnOlxuICAgICAgICByZXR1cm4gJ2EgJyArIHR5cGU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICB9XG4gIH1cblxuICAvLyBSZXR1cm5zIGNsYXNzIG5hbWUgb2YgdGhlIG9iamVjdCwgaWYgYW55LlxuICBmdW5jdGlvbiBnZXRDbGFzc05hbWUocHJvcFZhbHVlKSB7XG4gICAgaWYgKCFwcm9wVmFsdWUuY29uc3RydWN0b3IgfHwgIXByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lKSB7XG4gICAgICByZXR1cm4gQU5PTllNT1VTO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcFZhbHVlLmNvbnN0cnVjdG9yLm5hbWU7XG4gIH1cblxuICBSZWFjdFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcyA9IGNoZWNrUHJvcFR5cGVzO1xuICBSZWFjdFByb3BUeXBlcy5yZXNldFdhcm5pbmdDYWNoZSA9IGNoZWNrUHJvcFR5cGVzLnJlc2V0V2FybmluZ0NhY2hlO1xuICBSZWFjdFByb3BUeXBlcy5Qcm9wVHlwZXMgPSBSZWFjdFByb3BUeXBlcztcblxuICByZXR1cm4gUmVhY3RQcm9wVHlwZXM7XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgUmVhY3RJcyA9IHJlcXVpcmUoJ3JlYWN0LWlzJyk7XG5cbiAgLy8gQnkgZXhwbGljaXRseSB1c2luZyBgcHJvcC10eXBlc2AgeW91IGFyZSBvcHRpbmcgaW50byBuZXcgZGV2ZWxvcG1lbnQgYmVoYXZpb3IuXG4gIC8vIGh0dHA6Ly9mYi5tZS9wcm9wLXR5cGVzLWluLXByb2RcbiAgdmFyIHRocm93T25EaXJlY3RBY2Nlc3MgPSB0cnVlO1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZmFjdG9yeVdpdGhUeXBlQ2hlY2tlcnMnKShSZWFjdElzLmlzRWxlbWVudCwgdGhyb3dPbkRpcmVjdEFjY2Vzcyk7XG59IGVsc2Uge1xuICAvLyBCeSBleHBsaWNpdGx5IHVzaW5nIGBwcm9wLXR5cGVzYCB5b3UgYXJlIG9wdGluZyBpbnRvIG5ldyBwcm9kdWN0aW9uIGJlaGF2aW9yLlxuICAvLyBodHRwOi8vZmIubWUvcHJvcC10eXBlcy1pbi1wcm9kXG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMnKSgpO1xufVxuIiwiLyoqIEBsaWNlbnNlIFJlYWN0IHYxNy4wLjJcbiAqIHJlYWN0LWlzLmRldmVsb3BtZW50LmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIChmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuLy8gQVRURU5USU9OXG4vLyBXaGVuIGFkZGluZyBuZXcgc3ltYm9scyB0byB0aGlzIGZpbGUsXG4vLyBQbGVhc2UgY29uc2lkZXIgYWxzbyBhZGRpbmcgdG8gJ3JlYWN0LWRldnRvb2xzLXNoYXJlZC9zcmMvYmFja2VuZC9SZWFjdFN5bWJvbHMnXG4vLyBUaGUgU3ltYm9sIHVzZWQgdG8gdGFnIHRoZSBSZWFjdEVsZW1lbnQtbGlrZSB0eXBlcy4gSWYgdGhlcmUgaXMgbm8gbmF0aXZlIFN5bWJvbFxuLy8gbm9yIHBvbHlmaWxsLCB0aGVuIGEgcGxhaW4gbnVtYmVyIGlzIHVzZWQgZm9yIHBlcmZvcm1hbmNlLlxudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IDB4ZWFjNztcbnZhciBSRUFDVF9QT1JUQUxfVFlQRSA9IDB4ZWFjYTtcbnZhciBSRUFDVF9GUkFHTUVOVF9UWVBFID0gMHhlYWNiO1xudmFyIFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgPSAweGVhY2M7XG52YXIgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IDB4ZWFkMjtcbnZhciBSRUFDVF9QUk9WSURFUl9UWVBFID0gMHhlYWNkO1xudmFyIFJFQUNUX0NPTlRFWFRfVFlQRSA9IDB4ZWFjZTtcbnZhciBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFID0gMHhlYWQwO1xudmFyIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSAweGVhZDE7XG52YXIgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFID0gMHhlYWQ4O1xudmFyIFJFQUNUX01FTU9fVFlQRSA9IDB4ZWFkMztcbnZhciBSRUFDVF9MQVpZX1RZUEUgPSAweGVhZDQ7XG52YXIgUkVBQ1RfQkxPQ0tfVFlQRSA9IDB4ZWFkOTtcbnZhciBSRUFDVF9TRVJWRVJfQkxPQ0tfVFlQRSA9IDB4ZWFkYTtcbnZhciBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFID0gMHhlYWQ1O1xudmFyIFJFQUNUX1NDT1BFX1RZUEUgPSAweGVhZDc7XG52YXIgUkVBQ1RfT1BBUVVFX0lEX1RZUEUgPSAweGVhZTA7XG52YXIgUkVBQ1RfREVCVUdfVFJBQ0lOR19NT0RFX1RZUEUgPSAweGVhZTE7XG52YXIgUkVBQ1RfT0ZGU0NSRUVOX1RZUEUgPSAweGVhZTI7XG52YXIgUkVBQ1RfTEVHQUNZX0hJRERFTl9UWVBFID0gMHhlYWUzO1xuXG5pZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yKSB7XG4gIHZhciBzeW1ib2xGb3IgPSBTeW1ib2wuZm9yO1xuICBSRUFDVF9FTEVNRU5UX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmVsZW1lbnQnKTtcbiAgUkVBQ1RfUE9SVEFMX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LnBvcnRhbCcpO1xuICBSRUFDVF9GUkFHTUVOVF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5mcmFnbWVudCcpO1xuICBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5zdHJpY3RfbW9kZScpO1xuICBSRUFDVF9QUk9GSUxFUl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5wcm9maWxlcicpO1xuICBSRUFDVF9QUk9WSURFUl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5wcm92aWRlcicpO1xuICBSRUFDVF9DT05URVhUX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmNvbnRleHQnKTtcbiAgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QuZm9yd2FyZF9yZWYnKTtcbiAgUkVBQ1RfU1VTUEVOU0VfVFlQRSA9IHN5bWJvbEZvcigncmVhY3Quc3VzcGVuc2UnKTtcbiAgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5zdXNwZW5zZV9saXN0Jyk7XG4gIFJFQUNUX01FTU9fVFlQRSA9IHN5bWJvbEZvcigncmVhY3QubWVtbycpO1xuICBSRUFDVF9MQVpZX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmxhenknKTtcbiAgUkVBQ1RfQkxPQ0tfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QuYmxvY2snKTtcbiAgUkVBQ1RfU0VSVkVSX0JMT0NLX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LnNlcnZlci5ibG9jaycpO1xuICBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5mdW5kYW1lbnRhbCcpO1xuICBSRUFDVF9TQ09QRV9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5zY29wZScpO1xuICBSRUFDVF9PUEFRVUVfSURfVFlQRSA9IHN5bWJvbEZvcigncmVhY3Qub3BhcXVlLmlkJyk7XG4gIFJFQUNUX0RFQlVHX1RSQUNJTkdfTU9ERV9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5kZWJ1Z190cmFjZV9tb2RlJyk7XG4gIFJFQUNUX09GRlNDUkVFTl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5vZmZzY3JlZW4nKTtcbiAgUkVBQ1RfTEVHQUNZX0hJRERFTl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5sZWdhY3lfaGlkZGVuJyk7XG59XG5cbi8vIEZpbHRlciBjZXJ0YWluIERPTSBhdHRyaWJ1dGVzIChlLmcuIHNyYywgaHJlZikgaWYgdGhlaXIgdmFsdWVzIGFyZSBlbXB0eSBzdHJpbmdzLlxuXG52YXIgZW5hYmxlU2NvcGVBUEkgPSBmYWxzZTsgLy8gRXhwZXJpbWVudGFsIENyZWF0ZSBFdmVudCBIYW5kbGUgQVBJLlxuXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSkge1xuICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gTm90ZTogdHlwZW9mIG1pZ2h0IGJlIG90aGVyIHRoYW4gJ3N5bWJvbCcgb3IgJ251bWJlcicgKGUuZy4gaWYgaXQncyBhIHBvbHlmaWxsKS5cblxuXG4gIGlmICh0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1BST0ZJTEVSX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfREVCVUdfVFJBQ0lOR19NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9MRUdBQ1lfSElEREVOX1RZUEUgfHwgZW5hYmxlU2NvcGVBUEkgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmIHR5cGUgIT09IG51bGwpIHtcbiAgICBpZiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTEFaWV9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9QUk9WSURFUl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0NPTlRFWFRfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfQkxPQ0tfVFlQRSB8fCB0eXBlWzBdID09PSBSRUFDVF9TRVJWRVJfQkxPQ0tfVFlQRSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiB0eXBlT2Yob2JqZWN0KSB7XG4gIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QgIT09IG51bGwpIHtcbiAgICB2YXIgJCR0eXBlb2YgPSBvYmplY3QuJCR0eXBlb2Y7XG5cbiAgICBzd2l0Y2ggKCQkdHlwZW9mKSB7XG4gICAgICBjYXNlIFJFQUNUX0VMRU1FTlRfVFlQRTpcbiAgICAgICAgdmFyIHR5cGUgPSBvYmplY3QudHlwZTtcblxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICBjYXNlIFJFQUNUX0ZSQUdNRU5UX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9QUk9GSUxFUl9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfU1RSSUNUX01PREVfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEU6XG4gICAgICAgICAgICByZXR1cm4gdHlwZTtcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2YXIgJCR0eXBlb2ZUeXBlID0gdHlwZSAmJiB0eXBlLiQkdHlwZW9mO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKCQkdHlwZW9mVHlwZSkge1xuICAgICAgICAgICAgICBjYXNlIFJFQUNUX0NPTlRFWFRfVFlQRTpcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFOlxuICAgICAgICAgICAgICBjYXNlIFJFQUNUX0xBWllfVFlQRTpcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9NRU1PX1RZUEU6XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfUFJPVklERVJfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gJCR0eXBlb2ZUeXBlO1xuXG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuICQkdHlwZW9mO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgICAgcmV0dXJuICQkdHlwZW9mO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG52YXIgQ29udGV4dENvbnN1bWVyID0gUkVBQ1RfQ09OVEVYVF9UWVBFO1xudmFyIENvbnRleHRQcm92aWRlciA9IFJFQUNUX1BST1ZJREVSX1RZUEU7XG52YXIgRWxlbWVudCA9IFJFQUNUX0VMRU1FTlRfVFlQRTtcbnZhciBGb3J3YXJkUmVmID0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTtcbnZhciBGcmFnbWVudCA9IFJFQUNUX0ZSQUdNRU5UX1RZUEU7XG52YXIgTGF6eSA9IFJFQUNUX0xBWllfVFlQRTtcbnZhciBNZW1vID0gUkVBQ1RfTUVNT19UWVBFO1xudmFyIFBvcnRhbCA9IFJFQUNUX1BPUlRBTF9UWVBFO1xudmFyIFByb2ZpbGVyID0gUkVBQ1RfUFJPRklMRVJfVFlQRTtcbnZhciBTdHJpY3RNb2RlID0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRTtcbnZhciBTdXNwZW5zZSA9IFJFQUNUX1NVU1BFTlNFX1RZUEU7XG52YXIgaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNBc3luY01vZGUgPSBmYWxzZTtcbnZhciBoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0NvbmN1cnJlbnRNb2RlID0gZmFsc2U7IC8vIEFzeW5jTW9kZSBzaG91bGQgYmUgZGVwcmVjYXRlZFxuXG5mdW5jdGlvbiBpc0FzeW5jTW9kZShvYmplY3QpIHtcbiAge1xuICAgIGlmICghaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNBc3luY01vZGUpIHtcbiAgICAgIGhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlID0gdHJ1ZTsgLy8gVXNpbmcgY29uc29sZVsnd2FybiddIHRvIGV2YWRlIEJhYmVsIGFuZCBFU0xpbnRcblxuICAgICAgY29uc29sZVsnd2FybiddKCdUaGUgUmVhY3RJcy5pc0FzeW5jTW9kZSgpIGFsaWFzIGhhcyBiZWVuIGRlcHJlY2F0ZWQsICcgKyAnYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZWFjdCAxOCsuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gaXNDb25jdXJyZW50TW9kZShvYmplY3QpIHtcbiAge1xuICAgIGlmICghaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNDb25jdXJyZW50TW9kZSkge1xuICAgICAgaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNDb25jdXJyZW50TW9kZSA9IHRydWU7IC8vIFVzaW5nIGNvbnNvbGVbJ3dhcm4nXSB0byBldmFkZSBCYWJlbCBhbmQgRVNMaW50XG5cbiAgICAgIGNvbnNvbGVbJ3dhcm4nXSgnVGhlIFJlYWN0SXMuaXNDb25jdXJyZW50TW9kZSgpIGFsaWFzIGhhcyBiZWVuIGRlcHJlY2F0ZWQsICcgKyAnYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZWFjdCAxOCsuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gaXNDb250ZXh0Q29uc3VtZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfQ09OVEVYVF9UWVBFO1xufVxuZnVuY3Rpb24gaXNDb250ZXh0UHJvdmlkZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUFJPVklERVJfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzRWxlbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdCAhPT0gbnVsbCAmJiBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzRm9yd2FyZFJlZihvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFO1xufVxuZnVuY3Rpb24gaXNGcmFnbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFO1xufVxuZnVuY3Rpb24gaXNMYXp5KG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0xBWllfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzTWVtbyhvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9NRU1PX1RZUEU7XG59XG5mdW5jdGlvbiBpc1BvcnRhbChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9QT1JUQUxfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzUHJvZmlsZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUFJPRklMRVJfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzU3RyaWN0TW9kZShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFO1xufVxuZnVuY3Rpb24gaXNTdXNwZW5zZShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFO1xufVxuXG5leHBvcnRzLkNvbnRleHRDb25zdW1lciA9IENvbnRleHRDb25zdW1lcjtcbmV4cG9ydHMuQ29udGV4dFByb3ZpZGVyID0gQ29udGV4dFByb3ZpZGVyO1xuZXhwb3J0cy5FbGVtZW50ID0gRWxlbWVudDtcbmV4cG9ydHMuRm9yd2FyZFJlZiA9IEZvcndhcmRSZWY7XG5leHBvcnRzLkZyYWdtZW50ID0gRnJhZ21lbnQ7XG5leHBvcnRzLkxhenkgPSBMYXp5O1xuZXhwb3J0cy5NZW1vID0gTWVtbztcbmV4cG9ydHMuUG9ydGFsID0gUG9ydGFsO1xuZXhwb3J0cy5Qcm9maWxlciA9IFByb2ZpbGVyO1xuZXhwb3J0cy5TdHJpY3RNb2RlID0gU3RyaWN0TW9kZTtcbmV4cG9ydHMuU3VzcGVuc2UgPSBTdXNwZW5zZTtcbmV4cG9ydHMuaXNBc3luY01vZGUgPSBpc0FzeW5jTW9kZTtcbmV4cG9ydHMuaXNDb25jdXJyZW50TW9kZSA9IGlzQ29uY3VycmVudE1vZGU7XG5leHBvcnRzLmlzQ29udGV4dENvbnN1bWVyID0gaXNDb250ZXh0Q29uc3VtZXI7XG5leHBvcnRzLmlzQ29udGV4dFByb3ZpZGVyID0gaXNDb250ZXh0UHJvdmlkZXI7XG5leHBvcnRzLmlzRWxlbWVudCA9IGlzRWxlbWVudDtcbmV4cG9ydHMuaXNGb3J3YXJkUmVmID0gaXNGb3J3YXJkUmVmO1xuZXhwb3J0cy5pc0ZyYWdtZW50ID0gaXNGcmFnbWVudDtcbmV4cG9ydHMuaXNMYXp5ID0gaXNMYXp5O1xuZXhwb3J0cy5pc01lbW8gPSBpc01lbW87XG5leHBvcnRzLmlzUG9ydGFsID0gaXNQb3J0YWw7XG5leHBvcnRzLmlzUHJvZmlsZXIgPSBpc1Byb2ZpbGVyO1xuZXhwb3J0cy5pc1N0cmljdE1vZGUgPSBpc1N0cmljdE1vZGU7XG5leHBvcnRzLmlzU3VzcGVuc2UgPSBpc1N1c3BlbnNlO1xuZXhwb3J0cy5pc1ZhbGlkRWxlbWVudFR5cGUgPSBpc1ZhbGlkRWxlbWVudFR5cGU7XG5leHBvcnRzLnR5cGVPZiA9IHR5cGVPZjtcbiAgfSkoKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC1pcy5wcm9kdWN0aW9uLm1pbi5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC1pcy5kZXZlbG9wbWVudC5qcycpO1xufVxuIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlLCBTdXBwcmVzc2VkRXJyb3IsIFN5bWJvbCwgSXRlcmF0b3IgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXNEZWNvcmF0ZShjdG9yLCBkZXNjcmlwdG9ySW4sIGRlY29yYXRvcnMsIGNvbnRleHRJbiwgaW5pdGlhbGl6ZXJzLCBleHRyYUluaXRpYWxpemVycykge1xyXG4gICAgZnVuY3Rpb24gYWNjZXB0KGYpIHsgaWYgKGYgIT09IHZvaWQgMCAmJiB0eXBlb2YgZiAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRnVuY3Rpb24gZXhwZWN0ZWRcIik7IHJldHVybiBmOyB9XHJcbiAgICB2YXIga2luZCA9IGNvbnRleHRJbi5raW5kLCBrZXkgPSBraW5kID09PSBcImdldHRlclwiID8gXCJnZXRcIiA6IGtpbmQgPT09IFwic2V0dGVyXCIgPyBcInNldFwiIDogXCJ2YWx1ZVwiO1xyXG4gICAgdmFyIHRhcmdldCA9ICFkZXNjcmlwdG9ySW4gJiYgY3RvciA/IGNvbnRleHRJbltcInN0YXRpY1wiXSA/IGN0b3IgOiBjdG9yLnByb3RvdHlwZSA6IG51bGw7XHJcbiAgICB2YXIgZGVzY3JpcHRvciA9IGRlc2NyaXB0b3JJbiB8fCAodGFyZ2V0ID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGNvbnRleHRJbi5uYW1lKSA6IHt9KTtcclxuICAgIHZhciBfLCBkb25lID0gZmFsc2U7XHJcbiAgICBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIHZhciBjb250ZXh0ID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBjb250ZXh0SW4pIGNvbnRleHRbcF0gPSBwID09PSBcImFjY2Vzc1wiID8ge30gOiBjb250ZXh0SW5bcF07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBjb250ZXh0SW4uYWNjZXNzKSBjb250ZXh0LmFjY2Vzc1twXSA9IGNvbnRleHRJbi5hY2Nlc3NbcF07XHJcbiAgICAgICAgY29udGV4dC5hZGRJbml0aWFsaXplciA9IGZ1bmN0aW9uIChmKSB7IGlmIChkb25lKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGFkZCBpbml0aWFsaXplcnMgYWZ0ZXIgZGVjb3JhdGlvbiBoYXMgY29tcGxldGVkXCIpOyBleHRyYUluaXRpYWxpemVycy5wdXNoKGFjY2VwdChmIHx8IG51bGwpKTsgfTtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gKDAsIGRlY29yYXRvcnNbaV0pKGtpbmQgPT09IFwiYWNjZXNzb3JcIiA/IHsgZ2V0OiBkZXNjcmlwdG9yLmdldCwgc2V0OiBkZXNjcmlwdG9yLnNldCB9IDogZGVzY3JpcHRvcltrZXldLCBjb250ZXh0KTtcclxuICAgICAgICBpZiAoa2luZCA9PT0gXCJhY2Nlc3NvclwiKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IHZvaWQgMCkgY29udGludWU7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwgfHwgdHlwZW9mIHJlc3VsdCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBleHBlY3RlZFwiKTtcclxuICAgICAgICAgICAgaWYgKF8gPSBhY2NlcHQocmVzdWx0LmdldCkpIGRlc2NyaXB0b3IuZ2V0ID0gXztcclxuICAgICAgICAgICAgaWYgKF8gPSBhY2NlcHQocmVzdWx0LnNldCkpIGRlc2NyaXB0b3Iuc2V0ID0gXztcclxuICAgICAgICAgICAgaWYgKF8gPSBhY2NlcHQocmVzdWx0LmluaXQpKSBpbml0aWFsaXplcnMudW5zaGlmdChfKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoXyA9IGFjY2VwdChyZXN1bHQpKSB7XHJcbiAgICAgICAgICAgIGlmIChraW5kID09PSBcImZpZWxkXCIpIGluaXRpYWxpemVycy51bnNoaWZ0KF8pO1xyXG4gICAgICAgICAgICBlbHNlIGRlc2NyaXB0b3Jba2V5XSA9IF87XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHRhcmdldCkgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgY29udGV4dEluLm5hbWUsIGRlc2NyaXB0b3IpO1xyXG4gICAgZG9uZSA9IHRydWU7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19ydW5Jbml0aWFsaXplcnModGhpc0FyZywgaW5pdGlhbGl6ZXJzLCB2YWx1ZSkge1xyXG4gICAgdmFyIHVzZVZhbHVlID0gYXJndW1lbnRzLmxlbmd0aCA+IDI7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGluaXRpYWxpemVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhbHVlID0gdXNlVmFsdWUgPyBpbml0aWFsaXplcnNbaV0uY2FsbCh0aGlzQXJnLCB2YWx1ZSkgOiBpbml0aWFsaXplcnNbaV0uY2FsbCh0aGlzQXJnKTtcclxuICAgIH1cclxuICAgIHJldHVybiB1c2VWYWx1ZSA/IHZhbHVlIDogdm9pZCAwO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcHJvcEtleSh4KSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHggPT09IFwic3ltYm9sXCIgPyB4IDogXCJcIi5jb25jYXQoeCk7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zZXRGdW5jdGlvbk5hbWUoZiwgbmFtZSwgcHJlZml4KSB7XHJcbiAgICBpZiAodHlwZW9mIG5hbWUgPT09IFwic3ltYm9sXCIpIG5hbWUgPSBuYW1lLmRlc2NyaXB0aW9uID8gXCJbXCIuY29uY2F0KG5hbWUuZGVzY3JpcHRpb24sIFwiXVwiKSA6IFwiXCI7XHJcbiAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGYsIFwibmFtZVwiLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHByZWZpeCA/IFwiXCIuY29uY2F0KHByZWZpeCwgXCIgXCIsIG5hbWUpIDogbmFtZSB9KTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGcgPSBPYmplY3QuY3JlYXRlKCh0eXBlb2YgSXRlcmF0b3IgPT09IFwiZnVuY3Rpb25cIiA/IEl0ZXJhdG9yIDogT2JqZWN0KS5wcm90b3R5cGUpO1xyXG4gICAgcmV0dXJuIGcubmV4dCA9IHZlcmIoMCksIGdbXCJ0aHJvd1wiXSA9IHZlcmIoMSksIGdbXCJyZXR1cm5cIl0gPSB2ZXJiKDIpLCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XHJcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xyXG4gICAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xyXG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XHJcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XHJcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IE9iamVjdC5jcmVhdGUoKHR5cGVvZiBBc3luY0l0ZXJhdG9yID09PSBcImZ1bmN0aW9uXCIgPyBBc3luY0l0ZXJhdG9yIDogT2JqZWN0KS5wcm90b3R5cGUpLCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIsIGF3YWl0UmV0dXJuKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gYXdhaXRSZXR1cm4oZikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGYsIHJlamVjdCk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpZiAoZ1tuXSkgeyBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyBpZiAoZikgaVtuXSA9IGYoaVtuXSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IGZhbHNlIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbnZhciBvd25LZXlzID0gZnVuY3Rpb24obykge1xyXG4gICAgb3duS2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHx8IGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgdmFyIGFyID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgayBpbiBvKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIGspKSBhclthci5sZW5ndGhdID0gaztcclxuICAgICAgICByZXR1cm4gYXI7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIG93bktleXMobyk7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayA9IG93bktleXMobW9kKSwgaSA9IDA7IGkgPCBrLmxlbmd0aDsgaSsrKSBpZiAoa1tpXSAhPT0gXCJkZWZhdWx0XCIpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwga1tpXSk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgZ2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJtXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIG1ldGhvZCBpcyBub3Qgd3JpdGFibGVcIik7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIChraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlciwgdmFsdWUpIDogZiA/IGYudmFsdWUgPSB2YWx1ZSA6IHN0YXRlLnNldChyZWNlaXZlciwgdmFsdWUpKSwgdmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkSW4oc3RhdGUsIHJlY2VpdmVyKSB7XHJcbiAgICBpZiAocmVjZWl2ZXIgPT09IG51bGwgfHwgKHR5cGVvZiByZWNlaXZlciAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgcmVjZWl2ZXIgIT09IFwiZnVuY3Rpb25cIikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgdXNlICdpbicgb3BlcmF0b3Igb24gbm9uLW9iamVjdFwiKTtcclxuICAgIHJldHVybiB0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyID09PSBzdGF0ZSA6IHN0YXRlLmhhcyhyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FkZERpc3Bvc2FibGVSZXNvdXJjZShlbnYsIHZhbHVlLCBhc3luYykge1xyXG4gICAgaWYgKHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB2b2lkIDApIHtcclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0IGV4cGVjdGVkLlwiKTtcclxuICAgICAgICB2YXIgZGlzcG9zZSwgaW5uZXI7XHJcbiAgICAgICAgaWYgKGFzeW5jKSB7XHJcbiAgICAgICAgICAgIGlmICghU3ltYm9sLmFzeW5jRGlzcG9zZSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0Rpc3Bvc2UgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgICAgICAgICBkaXNwb3NlID0gdmFsdWVbU3ltYm9sLmFzeW5jRGlzcG9zZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkaXNwb3NlID09PSB2b2lkIDApIHtcclxuICAgICAgICAgICAgaWYgKCFTeW1ib2wuZGlzcG9zZSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5kaXNwb3NlIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgICAgICAgICAgZGlzcG9zZSA9IHZhbHVlW1N5bWJvbC5kaXNwb3NlXTtcclxuICAgICAgICAgICAgaWYgKGFzeW5jKSBpbm5lciA9IGRpc3Bvc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YgZGlzcG9zZSAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0IG5vdCBkaXNwb3NhYmxlLlwiKTtcclxuICAgICAgICBpZiAoaW5uZXIpIGRpc3Bvc2UgPSBmdW5jdGlvbigpIHsgdHJ5IHsgaW5uZXIuY2FsbCh0aGlzKTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gUHJvbWlzZS5yZWplY3QoZSk7IH0gfTtcclxuICAgICAgICBlbnYuc3RhY2sucHVzaCh7IHZhbHVlOiB2YWx1ZSwgZGlzcG9zZTogZGlzcG9zZSwgYXN5bmM6IGFzeW5jIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYXN5bmMpIHtcclxuICAgICAgICBlbnYuc3RhY2sucHVzaCh7IGFzeW5jOiB0cnVlIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG5cclxufVxyXG5cclxudmFyIF9TdXBwcmVzc2VkRXJyb3IgPSB0eXBlb2YgU3VwcHJlc3NlZEVycm9yID09PSBcImZ1bmN0aW9uXCIgPyBTdXBwcmVzc2VkRXJyb3IgOiBmdW5jdGlvbiAoZXJyb3IsIHN1cHByZXNzZWQsIG1lc3NhZ2UpIHtcclxuICAgIHZhciBlID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xyXG4gICAgcmV0dXJuIGUubmFtZSA9IFwiU3VwcHJlc3NlZEVycm9yXCIsIGUuZXJyb3IgPSBlcnJvciwgZS5zdXBwcmVzc2VkID0gc3VwcHJlc3NlZCwgZTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2Rpc3Bvc2VSZXNvdXJjZXMoZW52KSB7XHJcbiAgICBmdW5jdGlvbiBmYWlsKGUpIHtcclxuICAgICAgICBlbnYuZXJyb3IgPSBlbnYuaGFzRXJyb3IgPyBuZXcgX1N1cHByZXNzZWRFcnJvcihlLCBlbnYuZXJyb3IsIFwiQW4gZXJyb3Igd2FzIHN1cHByZXNzZWQgZHVyaW5nIGRpc3Bvc2FsLlwiKSA6IGU7XHJcbiAgICAgICAgZW52Lmhhc0Vycm9yID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHZhciByLCBzID0gMDtcclxuICAgIGZ1bmN0aW9uIG5leHQoKSB7XHJcbiAgICAgICAgd2hpbGUgKHIgPSBlbnYuc3RhY2sucG9wKCkpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGlmICghci5hc3luYyAmJiBzID09PSAxKSByZXR1cm4gcyA9IDAsIGVudi5zdGFjay5wdXNoKHIpLCBQcm9taXNlLnJlc29sdmUoKS50aGVuKG5leHQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHIuZGlzcG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSByLmRpc3Bvc2UuY2FsbChyLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoci5hc3luYykgcmV0dXJuIHMgfD0gMiwgUHJvbWlzZS5yZXNvbHZlKHJlc3VsdCkudGhlbihuZXh0LCBmdW5jdGlvbihlKSB7IGZhaWwoZSk7IHJldHVybiBuZXh0KCk7IH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBzIHw9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGZhaWwoZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHMgPT09IDEpIHJldHVybiBlbnYuaGFzRXJyb3IgPyBQcm9taXNlLnJlamVjdChlbnYuZXJyb3IpIDogUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgaWYgKGVudi5oYXNFcnJvcikgdGhyb3cgZW52LmVycm9yO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5leHQoKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmV3cml0ZVJlbGF0aXZlSW1wb3J0RXh0ZW5zaW9uKHBhdGgsIHByZXNlcnZlSnN4KSB7XHJcbiAgICBpZiAodHlwZW9mIHBhdGggPT09IFwic3RyaW5nXCIgJiYgL15cXC5cXC4/XFwvLy50ZXN0KHBhdGgpKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhdGgucmVwbGFjZSgvXFwuKHRzeCkkfCgoPzpcXC5kKT8pKCg/OlxcLlteLi9dKz8pPylcXC4oW2NtXT8pdHMkL2ksIGZ1bmN0aW9uIChtLCB0c3gsIGQsIGV4dCwgY20pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRzeCA/IHByZXNlcnZlSnN4ID8gXCIuanN4XCIgOiBcIi5qc1wiIDogZCAmJiAoIWV4dCB8fCAhY20pID8gbSA6IChkICsgZXh0ICsgXCIuXCIgKyBjbS50b0xvd2VyQ2FzZSgpICsgXCJqc1wiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBwYXRoO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBfX2V4dGVuZHM6IF9fZXh0ZW5kcyxcclxuICAgIF9fYXNzaWduOiBfX2Fzc2lnbixcclxuICAgIF9fcmVzdDogX19yZXN0LFxyXG4gICAgX19kZWNvcmF0ZTogX19kZWNvcmF0ZSxcclxuICAgIF9fcGFyYW06IF9fcGFyYW0sXHJcbiAgICBfX2VzRGVjb3JhdGU6IF9fZXNEZWNvcmF0ZSxcclxuICAgIF9fcnVuSW5pdGlhbGl6ZXJzOiBfX3J1bkluaXRpYWxpemVycyxcclxuICAgIF9fcHJvcEtleTogX19wcm9wS2V5LFxyXG4gICAgX19zZXRGdW5jdGlvbk5hbWU6IF9fc2V0RnVuY3Rpb25OYW1lLFxyXG4gICAgX19tZXRhZGF0YTogX19tZXRhZGF0YSxcclxuICAgIF9fYXdhaXRlcjogX19hd2FpdGVyLFxyXG4gICAgX19nZW5lcmF0b3I6IF9fZ2VuZXJhdG9yLFxyXG4gICAgX19jcmVhdGVCaW5kaW5nOiBfX2NyZWF0ZUJpbmRpbmcsXHJcbiAgICBfX2V4cG9ydFN0YXI6IF9fZXhwb3J0U3RhcixcclxuICAgIF9fdmFsdWVzOiBfX3ZhbHVlcyxcclxuICAgIF9fcmVhZDogX19yZWFkLFxyXG4gICAgX19zcHJlYWQ6IF9fc3ByZWFkLFxyXG4gICAgX19zcHJlYWRBcnJheXM6IF9fc3ByZWFkQXJyYXlzLFxyXG4gICAgX19zcHJlYWRBcnJheTogX19zcHJlYWRBcnJheSxcclxuICAgIF9fYXdhaXQ6IF9fYXdhaXQsXHJcbiAgICBfX2FzeW5jR2VuZXJhdG9yOiBfX2FzeW5jR2VuZXJhdG9yLFxyXG4gICAgX19hc3luY0RlbGVnYXRvcjogX19hc3luY0RlbGVnYXRvcixcclxuICAgIF9fYXN5bmNWYWx1ZXM6IF9fYXN5bmNWYWx1ZXMsXHJcbiAgICBfX21ha2VUZW1wbGF0ZU9iamVjdDogX19tYWtlVGVtcGxhdGVPYmplY3QsXHJcbiAgICBfX2ltcG9ydFN0YXI6IF9faW1wb3J0U3RhcixcclxuICAgIF9faW1wb3J0RGVmYXVsdDogX19pbXBvcnREZWZhdWx0LFxyXG4gICAgX19jbGFzc1ByaXZhdGVGaWVsZEdldDogX19jbGFzc1ByaXZhdGVGaWVsZEdldCxcclxuICAgIF9fY2xhc3NQcml2YXRlRmllbGRTZXQ6IF9fY2xhc3NQcml2YXRlRmllbGRTZXQsXHJcbiAgICBfX2NsYXNzUHJpdmF0ZUZpZWxkSW46IF9fY2xhc3NQcml2YXRlRmllbGRJbixcclxuICAgIF9fYWRkRGlzcG9zYWJsZVJlc291cmNlOiBfX2FkZERpc3Bvc2FibGVSZXNvdXJjZSxcclxuICAgIF9fZGlzcG9zZVJlc291cmNlczogX19kaXNwb3NlUmVzb3VyY2VzLFxyXG4gICAgX19yZXdyaXRlUmVsYXRpdmVJbXBvcnRFeHRlbnNpb246IF9fcmV3cml0ZVJlbGF0aXZlSW1wb3J0RXh0ZW5zaW9uLFxyXG59O1xyXG4iLCJpbXBvcnQgX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UgZnJvbSAnQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZSc7XG5pbXBvcnQgX2V4dGVuZHMgZnJvbSAnQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vZXh0ZW5kcyc7XG5pbXBvcnQgX2Fzc2VydFRoaXNJbml0aWFsaXplZCBmcm9tICdAYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQnO1xuaW1wb3J0IF9pbmhlcml0c0xvb3NlIGZyb20gJ0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2luaGVyaXRzTG9vc2UnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IGNsb25lRWxlbWVudCwgQ29tcG9uZW50LCB1c2VSZWYsIHVzZUVmZmVjdCwgdXNlQ2FsbGJhY2ssIHVzZUxheW91dEVmZmVjdCwgdXNlUmVkdWNlciwgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGlzRm9yd2FyZFJlZiB9IGZyb20gJ3JlYWN0LWlzJztcbmltcG9ydCBjb21wdXRlIGZyb20gJ2NvbXB1dGUtc2Nyb2xsLWludG8tdmlldyc7XG5pbXBvcnQgeyBfX2Fzc2lnbiB9IGZyb20gJ3RzbGliJztcblxudmFyIGlkQ291bnRlciA9IDA7XG5cbi8qKlxuICogQWNjZXB0cyBhIHBhcmFtZXRlciBhbmQgcmV0dXJucyBpdCBpZiBpdCdzIGEgZnVuY3Rpb25cbiAqIG9yIGEgbm9vcCBmdW5jdGlvbiBpZiBpdCdzIG5vdC4gVGhpcyBhbGxvd3MgdXMgdG9cbiAqIGFjY2VwdCBhIGNhbGxiYWNrLCBidXQgbm90IHdvcnJ5IGFib3V0IGl0IGlmIGl0J3Mgbm90XG4gKiBwYXNzZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiB0aGUgY2FsbGJhY2tcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBhIGZ1bmN0aW9uXG4gKi9cbmZ1bmN0aW9uIGNiVG9DYihjYikge1xuICByZXR1cm4gdHlwZW9mIGNiID09PSAnZnVuY3Rpb24nID8gY2IgOiBub29wO1xufVxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbi8qKlxuICogU2Nyb2xsIG5vZGUgaW50byB2aWV3IGlmIG5lY2Vzc2FyeVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbm9kZSB0aGUgZWxlbWVudCB0aGF0IHNob3VsZCBzY3JvbGwgaW50byB2aWV3XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBtZW51Tm9kZSB0aGUgbWVudSBlbGVtZW50IG9mIHRoZSBjb21wb25lbnRcbiAqL1xuZnVuY3Rpb24gc2Nyb2xsSW50b1ZpZXcobm9kZSwgbWVudU5vZGUpIHtcbiAgaWYgKCFub2RlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBhY3Rpb25zID0gY29tcHV0ZShub2RlLCB7XG4gICAgYm91bmRhcnk6IG1lbnVOb2RlLFxuICAgIGJsb2NrOiAnbmVhcmVzdCcsXG4gICAgc2Nyb2xsTW9kZTogJ2lmLW5lZWRlZCdcbiAgfSk7XG4gIGFjdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciBlbCA9IF9yZWYuZWwsXG4gICAgICB0b3AgPSBfcmVmLnRvcCxcbiAgICAgIGxlZnQgPSBfcmVmLmxlZnQ7XG4gICAgZWwuc2Nyb2xsVG9wID0gdG9wO1xuICAgIGVsLnNjcm9sbExlZnQgPSBsZWZ0O1xuICB9KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwYXJlbnQgdGhlIHBhcmVudCBub2RlXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjaGlsZCB0aGUgY2hpbGQgbm9kZVxuICogQHBhcmFtIHtXaW5kb3d9IGVudmlyb25tZW50IFRoZSB3aW5kb3cgY29udGV4dCB3aGVyZSBkb3duc2hpZnQgcmVuZGVycy5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IHdoZXRoZXIgdGhlIHBhcmVudCBpcyB0aGUgY2hpbGQgb3IgdGhlIGNoaWxkIGlzIGluIHRoZSBwYXJlbnRcbiAqL1xuZnVuY3Rpb24gaXNPckNvbnRhaW5zTm9kZShwYXJlbnQsIGNoaWxkLCBlbnZpcm9ubWVudCkge1xuICB2YXIgcmVzdWx0ID0gcGFyZW50ID09PSBjaGlsZCB8fCBjaGlsZCBpbnN0YW5jZW9mIGVudmlyb25tZW50Lk5vZGUgJiYgcGFyZW50LmNvbnRhaW5zICYmIHBhcmVudC5jb250YWlucyhjaGlsZCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogU2ltcGxlIGRlYm91bmNlIGltcGxlbWVudGF0aW9uLiBXaWxsIGNhbGwgdGhlIGdpdmVuXG4gKiBmdW5jdGlvbiBvbmNlIGFmdGVyIHRoZSB0aW1lIGdpdmVuIGhhcyBwYXNzZWQgc2luY2VcbiAqIGl0IHdhcyBsYXN0IGNhbGxlZC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIHRoZSBmdW5jdGlvbiB0byBjYWxsIGFmdGVyIHRoZSB0aW1lXG4gKiBAcGFyYW0ge051bWJlcn0gdGltZSB0aGUgdGltZSB0byB3YWl0XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmbiwgdGltZSkge1xuICB2YXIgdGltZW91dElkO1xuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgaWYgKHRpbWVvdXRJZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHdyYXBwZXIoKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cbiAgICBjYW5jZWwoKTtcbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHRpbWVvdXRJZCA9IG51bGw7XG4gICAgICBmbi5hcHBseSh2b2lkIDAsIGFyZ3MpO1xuICAgIH0sIHRpbWUpO1xuICB9XG4gIHdyYXBwZXIuY2FuY2VsID0gY2FuY2VsO1xuICByZXR1cm4gd3JhcHBlcjtcbn1cblxuLyoqXG4gKiBUaGlzIGlzIGludGVuZGVkIHRvIGJlIHVzZWQgdG8gY29tcG9zZSBldmVudCBoYW5kbGVycy5cbiAqIFRoZXkgYXJlIGV4ZWN1dGVkIGluIG9yZGVyIHVudGlsIG9uZSBvZiB0aGVtIHNldHNcbiAqIGBldmVudC5wcmV2ZW50RG93bnNoaWZ0RGVmYXVsdCA9IHRydWVgLlxuICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gZm5zIHRoZSBldmVudCBoYW5kbGVyIGZ1bmN0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb259IHRoZSBldmVudCBoYW5kbGVyIHRvIGFkZCB0byBhbiBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGNhbGxBbGxFdmVudEhhbmRsZXJzKCkge1xuICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGZucyA9IG5ldyBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgIGZuc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjMgPiAxID8gX2xlbjMgLSAxIDogMCksIF9rZXkzID0gMTsgX2tleTMgPCBfbGVuMzsgX2tleTMrKykge1xuICAgICAgYXJnc1tfa2V5MyAtIDFdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgICB9XG4gICAgcmV0dXJuIGZucy5zb21lKGZ1bmN0aW9uIChmbikge1xuICAgICAgaWYgKGZuKSB7XG4gICAgICAgIGZuLmFwcGx5KHZvaWQgMCwgW2V2ZW50XS5jb25jYXQoYXJncykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGV2ZW50LnByZXZlbnREb3duc2hpZnREZWZhdWx0IHx8IGV2ZW50Lmhhc093blByb3BlcnR5KCduYXRpdmVFdmVudCcpICYmIGV2ZW50Lm5hdGl2ZUV2ZW50LnByZXZlbnREb3duc2hpZnREZWZhdWx0O1xuICAgIH0pO1xuICB9O1xufVxuZnVuY3Rpb24gaGFuZGxlUmVmcygpIHtcbiAgZm9yICh2YXIgX2xlbjQgPSBhcmd1bWVudHMubGVuZ3RoLCByZWZzID0gbmV3IEFycmF5KF9sZW40KSwgX2tleTQgPSAwOyBfa2V5NCA8IF9sZW40OyBfa2V5NCsrKSB7XG4gICAgcmVmc1tfa2V5NF0gPSBhcmd1bWVudHNbX2tleTRdO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAobm9kZSkge1xuICAgIHJlZnMuZm9yRWFjaChmdW5jdGlvbiAocmVmKSB7XG4gICAgICBpZiAodHlwZW9mIHJlZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZWYobm9kZSk7XG4gICAgICB9IGVsc2UgaWYgKHJlZikge1xuICAgICAgICByZWYuY3VycmVudCA9IG5vZGU7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59XG5cbi8qKlxuICogVGhpcyBnZW5lcmF0ZXMgYSB1bmlxdWUgSUQgZm9yIGFuIGluc3RhbmNlIG9mIERvd25zaGlmdFxuICogQHJldHVybiB7U3RyaW5nfSB0aGUgdW5pcXVlIElEXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlSWQoKSB7XG4gIHJldHVybiBTdHJpbmcoaWRDb3VudGVyKyspO1xufVxuXG4vKipcbiAqIFJlc2V0cyBpZENvdW50ZXIgdG8gMC4gVXNlZCBmb3IgU1NSLlxuICovXG5mdW5jdGlvbiByZXNldElkQ291bnRlcigpIHtcbiAgaWRDb3VudGVyID0gMDtcbn1cblxuLyoqXG4gKiBEZWZhdWx0IGltcGxlbWVudGF0aW9uIGZvciBzdGF0dXMgbWVzc2FnZS4gT25seSBhZGRlZCB3aGVuIG1lbnUgaXMgb3Blbi5cbiAqIFdpbGwgc3BlY2lmeSBpZiB0aGVyZSBhcmUgcmVzdWx0cyBpbiB0aGUgbGlzdCwgYW5kIGlmIHNvLCBob3cgbWFueSxcbiAqIGFuZCB3aGF0IGtleXMgYXJlIHJlbGV2YW50LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbSB0aGUgZG93bnNoaWZ0IHN0YXRlIGFuZCBvdGhlciByZWxldmFudCBwcm9wZXJ0aWVzXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHRoZSBhMTF5IHN0YXR1cyBtZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIGdldEExMXlTdGF0dXNNZXNzYWdlJDEoX3JlZjIpIHtcbiAgdmFyIGlzT3BlbiA9IF9yZWYyLmlzT3BlbixcbiAgICByZXN1bHRDb3VudCA9IF9yZWYyLnJlc3VsdENvdW50LFxuICAgIHByZXZpb3VzUmVzdWx0Q291bnQgPSBfcmVmMi5wcmV2aW91c1Jlc3VsdENvdW50O1xuICBpZiAoIWlzT3Blbikge1xuICAgIHJldHVybiAnJztcbiAgfVxuICBpZiAoIXJlc3VsdENvdW50KSB7XG4gICAgcmV0dXJuICdObyByZXN1bHRzIGFyZSBhdmFpbGFibGUuJztcbiAgfVxuICBpZiAocmVzdWx0Q291bnQgIT09IHByZXZpb3VzUmVzdWx0Q291bnQpIHtcbiAgICByZXR1cm4gcmVzdWx0Q291bnQgKyBcIiByZXN1bHRcIiArIChyZXN1bHRDb3VudCA9PT0gMSA/ICcgaXMnIDogJ3MgYXJlJykgKyBcIiBhdmFpbGFibGUsIHVzZSB1cCBhbmQgZG93biBhcnJvdyBrZXlzIHRvIG5hdmlnYXRlLiBQcmVzcyBFbnRlciBrZXkgdG8gc2VsZWN0LlwiO1xuICB9XG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBUYWtlcyBhbiBhcmd1bWVudCBhbmQgaWYgaXQncyBhbiBhcnJheSwgcmV0dXJucyB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgYXJyYXlcbiAqIG90aGVyd2lzZSByZXR1cm5zIHRoZSBhcmd1bWVudFxuICogQHBhcmFtIHsqfSBhcmcgdGhlIG1heWJlLWFycmF5XG4gKiBAcGFyYW0geyp9IGRlZmF1bHRWYWx1ZSB0aGUgdmFsdWUgaWYgYXJnIGlzIGZhbHNleSBub3QgZGVmaW5lZFxuICogQHJldHVybiB7Kn0gdGhlIGFyZyBvciBpdCdzIGZpcnN0IGl0ZW1cbiAqL1xuZnVuY3Rpb24gdW53cmFwQXJyYXkoYXJnLCBkZWZhdWx0VmFsdWUpIHtcbiAgYXJnID0gQXJyYXkuaXNBcnJheShhcmcpID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKHByZWFjdCkgKi9hcmdbMF0gOiBhcmc7XG4gIGlmICghYXJnICYmIGRlZmF1bHRWYWx1ZSkge1xuICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGFyZztcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IChQKXJlYWN0IGVsZW1lbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHdoZXRoZXIgaXQncyBhIERPTSBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGlzRE9NRWxlbWVudChlbGVtZW50KSB7XG5cbiAgLy8gdGhlbiB3ZSBhc3N1bWUgdGhpcyBpcyByZWFjdFxuICByZXR1cm4gdHlwZW9mIGVsZW1lbnQudHlwZSA9PT0gJ3N0cmluZyc7XG59XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgKFApcmVhY3QgZWxlbWVudFxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgcHJvcHNcbiAqL1xuZnVuY3Rpb24gZ2V0RWxlbWVudFByb3BzKGVsZW1lbnQpIHtcbiAgcmV0dXJuIGVsZW1lbnQucHJvcHM7XG59XG5cbi8qKlxuICogVGhyb3dzIGEgaGVscGZ1bCBlcnJvciBtZXNzYWdlIGZvciByZXF1aXJlZCBwcm9wZXJ0aWVzLiBVc2VmdWxcbiAqIHRvIGJlIHVzZWQgYXMgYSBkZWZhdWx0IGluIGRlc3RydWN0dXJpbmcgb3Igb2JqZWN0IHBhcmFtcy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBmbk5hbWUgdGhlIGZ1bmN0aW9uIG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wTmFtZSB0aGUgcHJvcCBuYW1lXG4gKi9cbmZ1bmN0aW9uIHJlcXVpcmVkUHJvcChmbk5hbWUsIHByb3BOYW1lKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gIGNvbnNvbGUuZXJyb3IoXCJUaGUgcHJvcGVydHkgXFxcIlwiICsgcHJvcE5hbWUgKyBcIlxcXCIgaXMgcmVxdWlyZWQgaW4gXFxcIlwiICsgZm5OYW1lICsgXCJcXFwiXCIpO1xufVxudmFyIHN0YXRlS2V5cyA9IFsnaGlnaGxpZ2h0ZWRJbmRleCcsICdpbnB1dFZhbHVlJywgJ2lzT3BlbicsICdzZWxlY3RlZEl0ZW0nLCAndHlwZSddO1xuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhdGUgdGhlIHN0YXRlIG9iamVjdFxuICogQHJldHVybiB7T2JqZWN0fSBzdGF0ZSB0aGF0IGlzIHJlbGV2YW50IHRvIGRvd25zaGlmdFxuICovXG5mdW5jdGlvbiBwaWNrU3RhdGUoc3RhdGUpIHtcbiAgaWYgKHN0YXRlID09PSB2b2lkIDApIHtcbiAgICBzdGF0ZSA9IHt9O1xuICB9XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgc3RhdGVLZXlzLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICBpZiAoc3RhdGUuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgIHJlc3VsdFtrXSA9IHN0YXRlW2tdO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhpcyB3aWxsIHBlcmZvcm0gYSBzaGFsbG93IG1lcmdlIG9mIHRoZSBnaXZlbiBzdGF0ZSBvYmplY3RcbiAqIHdpdGggdGhlIHN0YXRlIGNvbWluZyBmcm9tIHByb3BzXG4gKiAoZm9yIHRoZSBjb250cm9sbGVkIGNvbXBvbmVudCBzY2VuYXJpbylcbiAqIFRoaXMgaXMgdXNlZCBpbiBzdGF0ZSB1cGRhdGVyIGZ1bmN0aW9ucyBzbyB0aGV5J3JlIHJlZmVyZW5jaW5nXG4gKiB0aGUgcmlnaHQgc3RhdGUgcmVnYXJkbGVzcyBvZiB3aGVyZSBpdCBjb21lcyBmcm9tLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZSBUaGUgc3RhdGUgb2YgdGhlIGNvbXBvbmVudC9ob29rLlxuICogQHBhcmFtIHtPYmplY3R9IHByb3BzIFRoZSBwcm9wcyB0aGF0IG1heSBjb250YWluIGNvbnRyb2xsZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gVGhlIG1lcmdlZCBjb250cm9sbGVkIHN0YXRlLlxuICovXG5mdW5jdGlvbiBnZXRTdGF0ZShzdGF0ZSwgcHJvcHMpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHN0YXRlKS5yZWR1Y2UoZnVuY3Rpb24gKHByZXZTdGF0ZSwga2V5KSB7XG4gICAgcHJldlN0YXRlW2tleV0gPSBpc0NvbnRyb2xsZWRQcm9wKHByb3BzLCBrZXkpID8gcHJvcHNba2V5XSA6IHN0YXRlW2tleV07XG4gICAgcmV0dXJuIHByZXZTdGF0ZTtcbiAgfSwge30pO1xufVxuXG4vKipcbiAqIFRoaXMgZGV0ZXJtaW5lcyB3aGV0aGVyIGEgcHJvcCBpcyBhIFwiY29udHJvbGxlZCBwcm9wXCIgbWVhbmluZyBpdCBpc1xuICogc3RhdGUgd2hpY2ggaXMgY29udHJvbGxlZCBieSB0aGUgb3V0c2lkZSBvZiB0aGlzIGNvbXBvbmVudCByYXRoZXJcbiAqIHRoYW4gd2l0aGluIHRoaXMgY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBUaGUgcHJvcHMgdGhhdCBtYXkgY29udGFpbiBjb250cm9sbGVkIHZhbHVlcy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgdGhlIGtleSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn0gd2hldGhlciBpdCBpcyBhIGNvbnRyb2xsZWQgY29udHJvbGxlZCBwcm9wXG4gKi9cbmZ1bmN0aW9uIGlzQ29udHJvbGxlZFByb3AocHJvcHMsIGtleSkge1xuICByZXR1cm4gcHJvcHNba2V5XSAhPT0gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIE5vcm1hbGl6ZXMgdGhlICdrZXknIHByb3BlcnR5IG9mIGEgS2V5Ym9hcmRFdmVudCBpbiBJRS9FZGdlXG4gKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgYSBrZXlib2FyZEV2ZW50IG9iamVjdFxuICogQHJldHVybiB7U3RyaW5nfSBrZXlib2FyZCBrZXlcbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplQXJyb3dLZXkoZXZlbnQpIHtcbiAgdmFyIGtleSA9IGV2ZW50LmtleSxcbiAgICBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKGllKSAqL1xuICBpZiAoa2V5Q29kZSA+PSAzNyAmJiBrZXlDb2RlIDw9IDQwICYmIGtleS5pbmRleE9mKCdBcnJvdycpICE9PSAwKSB7XG4gICAgcmV0dXJuIFwiQXJyb3dcIiArIGtleTtcbiAgfVxuICByZXR1cm4ga2V5O1xufVxuXG4vKipcbiAqIFNpbXBsZSBjaGVjayBpZiB0aGUgdmFsdWUgcGFzc2VkIGlzIG9iamVjdCBsaXRlcmFsXG4gKiBAcGFyYW0geyp9IG9iaiBhbnkgdGhpbmdzXG4gKiBAcmV0dXJuIHtCb29sZWFufSB3aGV0aGVyIGl0J3Mgb2JqZWN0IGxpdGVyYWxcbiAqL1xuZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBPYmplY3RdJztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBuZXcgaW5kZXggaW4gdGhlIGxpc3QsIGluIGEgY2lyY3VsYXIgd2F5LiBJZiBuZXh0IHZhbHVlIGlzIG91dCBvZiBib25kcyBmcm9tIHRoZSB0b3RhbCxcbiAqIGl0IHdpbGwgd3JhcCB0byBlaXRoZXIgMCBvciBpdGVtQ291bnQgLSAxLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBtb3ZlQW1vdW50IE51bWJlciBvZiBwb3NpdGlvbnMgdG8gbW92ZS4gTmVnYXRpdmUgdG8gbW92ZSBiYWNrd2FyZHMsIHBvc2l0aXZlIGZvcndhcmRzLlxuICogQHBhcmFtIHtudW1iZXJ9IGJhc2VJbmRleCBUaGUgaW5pdGlhbCBwb3NpdGlvbiB0byBtb3ZlIGZyb20uXG4gKiBAcGFyYW0ge251bWJlcn0gaXRlbUNvdW50IFRoZSB0b3RhbCBudW1iZXIgb2YgaXRlbXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBnZXRJdGVtTm9kZUZyb21JbmRleCBVc2VkIHRvIGNoZWNrIGlmIGl0ZW0gaXMgZGlzYWJsZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNpcmN1bGFyIFNwZWNpZnkgaWYgbmF2aWdhdGlvbiBpcyBjaXJjdWxhci4gRGVmYXVsdCBpcyB0cnVlLlxuICogQHJldHVybnMge251bWJlcn0gVGhlIG5ldyBpbmRleCBhZnRlciB0aGUgbW92ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0TmV4dFdyYXBwaW5nSW5kZXgobW92ZUFtb3VudCwgYmFzZUluZGV4LCBpdGVtQ291bnQsIGdldEl0ZW1Ob2RlRnJvbUluZGV4LCBjaXJjdWxhcikge1xuICBpZiAoY2lyY3VsYXIgPT09IHZvaWQgMCkge1xuICAgIGNpcmN1bGFyID0gdHJ1ZTtcbiAgfVxuICBpZiAoaXRlbUNvdW50ID09PSAwKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIHZhciBpdGVtc0xhc3RJbmRleCA9IGl0ZW1Db3VudCAtIDE7XG4gIGlmICh0eXBlb2YgYmFzZUluZGV4ICE9PSAnbnVtYmVyJyB8fCBiYXNlSW5kZXggPCAwIHx8IGJhc2VJbmRleCA+PSBpdGVtQ291bnQpIHtcbiAgICBiYXNlSW5kZXggPSBtb3ZlQW1vdW50ID4gMCA/IC0xIDogaXRlbXNMYXN0SW5kZXggKyAxO1xuICB9XG4gIHZhciBuZXdJbmRleCA9IGJhc2VJbmRleCArIG1vdmVBbW91bnQ7XG4gIGlmIChuZXdJbmRleCA8IDApIHtcbiAgICBuZXdJbmRleCA9IGNpcmN1bGFyID8gaXRlbXNMYXN0SW5kZXggOiAwO1xuICB9IGVsc2UgaWYgKG5ld0luZGV4ID4gaXRlbXNMYXN0SW5kZXgpIHtcbiAgICBuZXdJbmRleCA9IGNpcmN1bGFyID8gMCA6IGl0ZW1zTGFzdEluZGV4O1xuICB9XG4gIHZhciBub25EaXNhYmxlZE5ld0luZGV4ID0gZ2V0TmV4dE5vbkRpc2FibGVkSW5kZXgobW92ZUFtb3VudCwgbmV3SW5kZXgsIGl0ZW1Db3VudCwgZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIGNpcmN1bGFyKTtcbiAgaWYgKG5vbkRpc2FibGVkTmV3SW5kZXggPT09IC0xKSB7XG4gICAgcmV0dXJuIGJhc2VJbmRleCA+PSBpdGVtQ291bnQgPyAtMSA6IGJhc2VJbmRleDtcbiAgfVxuICByZXR1cm4gbm9uRGlzYWJsZWROZXdJbmRleDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBuZXh0IGluZGV4IGluIHRoZSBsaXN0IG9mIGFuIGl0ZW0gdGhhdCBpcyBub3QgZGlzYWJsZWQuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IG1vdmVBbW91bnQgTnVtYmVyIG9mIHBvc2l0aW9ucyB0byBtb3ZlLiBOZWdhdGl2ZSB0byBtb3ZlIGJhY2t3YXJkcywgcG9zaXRpdmUgZm9yd2FyZHMuXG4gKiBAcGFyYW0ge251bWJlcn0gYmFzZUluZGV4IFRoZSBpbml0aWFsIHBvc2l0aW9uIHRvIG1vdmUgZnJvbS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBpdGVtQ291bnQgVGhlIHRvdGFsIG51bWJlciBvZiBpdGVtcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGdldEl0ZW1Ob2RlRnJvbUluZGV4IFVzZWQgdG8gY2hlY2sgaWYgaXRlbSBpcyBkaXNhYmxlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY2lyY3VsYXIgU3BlY2lmeSBpZiBuYXZpZ2F0aW9uIGlzIGNpcmN1bGFyLiBEZWZhdWx0IGlzIHRydWUuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgbmV3IGluZGV4LiBSZXR1cm5zIGJhc2VJbmRleCBpZiBpdGVtIGlzIG5vdCBkaXNhYmxlZC4gUmV0dXJucyBuZXh0IG5vbi1kaXNhYmxlZCBpdGVtIG90aGVyd2lzZS4gSWYgbm8gbm9uLWRpc2FibGVkIGZvdW5kIGl0IHdpbGwgcmV0dXJuIC0xLlxuICovXG5mdW5jdGlvbiBnZXROZXh0Tm9uRGlzYWJsZWRJbmRleChtb3ZlQW1vdW50LCBiYXNlSW5kZXgsIGl0ZW1Db3VudCwgZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIGNpcmN1bGFyKSB7XG4gIHZhciBjdXJyZW50RWxlbWVudE5vZGUgPSBnZXRJdGVtTm9kZUZyb21JbmRleChiYXNlSW5kZXgpO1xuICBpZiAoIWN1cnJlbnRFbGVtZW50Tm9kZSB8fCAhY3VycmVudEVsZW1lbnROb2RlLmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSkge1xuICAgIHJldHVybiBiYXNlSW5kZXg7XG4gIH1cbiAgaWYgKG1vdmVBbW91bnQgPiAwKSB7XG4gICAgZm9yICh2YXIgaW5kZXggPSBiYXNlSW5kZXggKyAxOyBpbmRleCA8IGl0ZW1Db3VudDsgaW5kZXgrKykge1xuICAgICAgaWYgKCFnZXRJdGVtTm9kZUZyb21JbmRleChpbmRleCkuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgX2luZGV4ID0gYmFzZUluZGV4IC0gMTsgX2luZGV4ID49IDA7IF9pbmRleC0tKSB7XG4gICAgICBpZiAoIWdldEl0ZW1Ob2RlRnJvbUluZGV4KF9pbmRleCkuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgIHJldHVybiBfaW5kZXg7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChjaXJjdWxhcikge1xuICAgIHJldHVybiBtb3ZlQW1vdW50ID4gMCA/IGdldE5leHROb25EaXNhYmxlZEluZGV4KDEsIDAsIGl0ZW1Db3VudCwgZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIGZhbHNlKSA6IGdldE5leHROb25EaXNhYmxlZEluZGV4KC0xLCBpdGVtQ291bnQgLSAxLCBpdGVtQ291bnQsIGdldEl0ZW1Ob2RlRnJvbUluZGV4LCBmYWxzZSk7XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBldmVudCB0YXJnZXQgaXMgd2l0aGluIHRoZSBkb3duc2hpZnQgZWxlbWVudHMuXG4gKlxuICogQHBhcmFtIHtFdmVudFRhcmdldH0gdGFyZ2V0IFRhcmdldCB0byBjaGVjay5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnRbXX0gZG93bnNoaWZ0RWxlbWVudHMgVGhlIGVsZW1lbnRzIHRoYXQgZm9ybSBkb3duc2hpZnQgKGxpc3QsIHRvZ2dsZSBidXR0b24gZXRjKS5cbiAqIEBwYXJhbSB7V2luZG93fSBlbnZpcm9ubWVudCBUaGUgd2luZG93IGNvbnRleHQgd2hlcmUgZG93bnNoaWZ0IHJlbmRlcnMuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrQWN0aXZlRWxlbWVudCBXaGV0aGVyIHRvIGFsc28gY2hlY2sgYWN0aXZlRWxlbWVudC5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIHRhcmdldCBpcyB3aXRoaW4gZG93bnNoaWZ0IGVsZW1lbnRzLlxuICovXG5mdW5jdGlvbiB0YXJnZXRXaXRoaW5Eb3duc2hpZnQodGFyZ2V0LCBkb3duc2hpZnRFbGVtZW50cywgZW52aXJvbm1lbnQsIGNoZWNrQWN0aXZlRWxlbWVudCkge1xuICBpZiAoY2hlY2tBY3RpdmVFbGVtZW50ID09PSB2b2lkIDApIHtcbiAgICBjaGVja0FjdGl2ZUVsZW1lbnQgPSB0cnVlO1xuICB9XG4gIHJldHVybiBkb3duc2hpZnRFbGVtZW50cy5zb21lKGZ1bmN0aW9uIChjb250ZXh0Tm9kZSkge1xuICAgIHJldHVybiBjb250ZXh0Tm9kZSAmJiAoaXNPckNvbnRhaW5zTm9kZShjb250ZXh0Tm9kZSwgdGFyZ2V0LCBlbnZpcm9ubWVudCkgfHwgY2hlY2tBY3RpdmVFbGVtZW50ICYmIGlzT3JDb250YWluc05vZGUoY29udGV4dE5vZGUsIGVudmlyb25tZW50LmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQsIGVudmlyb25tZW50KSk7XG4gIH0pO1xufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLW11dGFibGUtZXhwb3J0c1xudmFyIHZhbGlkYXRlQ29udHJvbGxlZFVuY2hhbmdlZCA9IG5vb3A7XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFsaWRhdGVDb250cm9sbGVkVW5jaGFuZ2VkID0gZnVuY3Rpb24gdmFsaWRhdGVDb250cm9sbGVkVW5jaGFuZ2VkKHN0YXRlLCBwcmV2UHJvcHMsIG5leHRQcm9wcykge1xuICAgIHZhciB3YXJuaW5nRGVzY3JpcHRpb24gPSBcIlRoaXMgcHJvcCBzaG91bGQgbm90IHN3aXRjaCBmcm9tIGNvbnRyb2xsZWQgdG8gdW5jb250cm9sbGVkIChvciB2aWNlIHZlcnNhKS4gRGVjaWRlIGJldHdlZW4gdXNpbmcgYSBjb250cm9sbGVkIG9yIHVuY29udHJvbGxlZCBEb3duc2hpZnQgZWxlbWVudCBmb3IgdGhlIGxpZmV0aW1lIG9mIHRoZSBjb21wb25lbnQuIE1vcmUgaW5mbzogaHR0cHM6Ly9naXRodWIuY29tL2Rvd25zaGlmdC1qcy9kb3duc2hpZnQjY29udHJvbC1wcm9wc1wiO1xuICAgIE9iamVjdC5rZXlzKHN0YXRlKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wS2V5KSB7XG4gICAgICBpZiAocHJldlByb3BzW3Byb3BLZXldICE9PSB1bmRlZmluZWQgJiYgbmV4dFByb3BzW3Byb3BLZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgY29uc29sZS5lcnJvcihcImRvd25zaGlmdDogQSBjb21wb25lbnQgaGFzIGNoYW5nZWQgdGhlIGNvbnRyb2xsZWQgcHJvcCBcXFwiXCIgKyBwcm9wS2V5ICsgXCJcXFwiIHRvIGJlIHVuY29udHJvbGxlZC4gXCIgKyB3YXJuaW5nRGVzY3JpcHRpb24pO1xuICAgICAgfSBlbHNlIGlmIChwcmV2UHJvcHNbcHJvcEtleV0gPT09IHVuZGVmaW5lZCAmJiBuZXh0UHJvcHNbcHJvcEtleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICBjb25zb2xlLmVycm9yKFwiZG93bnNoaWZ0OiBBIGNvbXBvbmVudCBoYXMgY2hhbmdlZCB0aGUgdW5jb250cm9sbGVkIHByb3AgXFxcIlwiICsgcHJvcEtleSArIFwiXFxcIiB0byBiZSBjb250cm9sbGVkLiBcIiArIHdhcm5pbmdEZXNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59XG5cbnZhciBjbGVhbnVwU3RhdHVzID0gZGVib3VuY2UoZnVuY3Rpb24gKGRvY3VtZW50UHJvcCkge1xuICBnZXRTdGF0dXNEaXYoZG9jdW1lbnRQcm9wKS50ZXh0Q29udGVudCA9ICcnO1xufSwgNTAwKTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RhdHVzIHRoZSBzdGF0dXMgbWVzc2FnZVxuICogQHBhcmFtIHtPYmplY3R9IGRvY3VtZW50UHJvcCBkb2N1bWVudCBwYXNzZWQgYnkgdGhlIHVzZXIuXG4gKi9cbmZ1bmN0aW9uIHNldFN0YXR1cyhzdGF0dXMsIGRvY3VtZW50UHJvcCkge1xuICB2YXIgZGl2ID0gZ2V0U3RhdHVzRGl2KGRvY3VtZW50UHJvcCk7XG4gIGlmICghc3RhdHVzKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGRpdi50ZXh0Q29udGVudCA9IHN0YXR1cztcbiAgY2xlYW51cFN0YXR1cyhkb2N1bWVudFByb3ApO1xufVxuXG4vKipcbiAqIEdldCB0aGUgc3RhdHVzIG5vZGUgb3IgY3JlYXRlIGl0IGlmIGl0IGRvZXMgbm90IGFscmVhZHkgZXhpc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gZG9jdW1lbnRQcm9wIGRvY3VtZW50IHBhc3NlZCBieSB0aGUgdXNlci5cbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSB0aGUgc3RhdHVzIG5vZGUuXG4gKi9cbmZ1bmN0aW9uIGdldFN0YXR1c0Rpdihkb2N1bWVudFByb3ApIHtcbiAgaWYgKGRvY3VtZW50UHJvcCA9PT0gdm9pZCAwKSB7XG4gICAgZG9jdW1lbnRQcm9wID0gZG9jdW1lbnQ7XG4gIH1cbiAgdmFyIHN0YXR1c0RpdiA9IGRvY3VtZW50UHJvcC5nZXRFbGVtZW50QnlJZCgnYTExeS1zdGF0dXMtbWVzc2FnZScpO1xuICBpZiAoc3RhdHVzRGl2KSB7XG4gICAgcmV0dXJuIHN0YXR1c0RpdjtcbiAgfVxuICBzdGF0dXNEaXYgPSBkb2N1bWVudFByb3AuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHN0YXR1c0Rpdi5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2ExMXktc3RhdHVzLW1lc3NhZ2UnKTtcbiAgc3RhdHVzRGl2LnNldEF0dHJpYnV0ZSgncm9sZScsICdzdGF0dXMnKTtcbiAgc3RhdHVzRGl2LnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgJ3BvbGl0ZScpO1xuICBzdGF0dXNEaXYuc2V0QXR0cmlidXRlKCdhcmlhLXJlbGV2YW50JywgJ2FkZGl0aW9ucyB0ZXh0Jyk7XG4gIE9iamVjdC5hc3NpZ24oc3RhdHVzRGl2LnN0eWxlLCB7XG4gICAgYm9yZGVyOiAnMCcsXG4gICAgY2xpcDogJ3JlY3QoMCAwIDAgMCknLFxuICAgIGhlaWdodDogJzFweCcsXG4gICAgbWFyZ2luOiAnLTFweCcsXG4gICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgIHBhZGRpbmc6ICcwJyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB3aWR0aDogJzFweCdcbiAgfSk7XG4gIGRvY3VtZW50UHJvcC5ib2R5LmFwcGVuZENoaWxkKHN0YXR1c0Rpdik7XG4gIHJldHVybiBzdGF0dXNEaXY7XG59XG5cbnZhciB1bmtub3duID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fYXV0b2NvbXBsZXRlX3Vua25vd25fXycgOiAwO1xudmFyIG1vdXNlVXAgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19hdXRvY29tcGxldGVfbW91c2V1cF9fJyA6IDE7XG52YXIgaXRlbU1vdXNlRW50ZXIgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19hdXRvY29tcGxldGVfaXRlbV9tb3VzZWVudGVyX18nIDogMjtcbnZhciBrZXlEb3duQXJyb3dVcCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2F1dG9jb21wbGV0ZV9rZXlkb3duX2Fycm93X3VwX18nIDogMztcbnZhciBrZXlEb3duQXJyb3dEb3duID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fYXV0b2NvbXBsZXRlX2tleWRvd25fYXJyb3dfZG93bl9fJyA6IDQ7XG52YXIga2V5RG93bkVzY2FwZSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2F1dG9jb21wbGV0ZV9rZXlkb3duX2VzY2FwZV9fJyA6IDU7XG52YXIga2V5RG93bkVudGVyID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fYXV0b2NvbXBsZXRlX2tleWRvd25fZW50ZXJfXycgOiA2O1xudmFyIGtleURvd25Ib21lID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fYXV0b2NvbXBsZXRlX2tleWRvd25faG9tZV9fJyA6IDc7XG52YXIga2V5RG93bkVuZCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2F1dG9jb21wbGV0ZV9rZXlkb3duX2VuZF9fJyA6IDg7XG52YXIgY2xpY2tJdGVtID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fYXV0b2NvbXBsZXRlX2NsaWNrX2l0ZW1fXycgOiA5O1xudmFyIGJsdXJJbnB1dCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2F1dG9jb21wbGV0ZV9ibHVyX2lucHV0X18nIDogMTA7XG52YXIgY2hhbmdlSW5wdXQgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19hdXRvY29tcGxldGVfY2hhbmdlX2lucHV0X18nIDogMTE7XG52YXIga2V5RG93blNwYWNlQnV0dG9uID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fYXV0b2NvbXBsZXRlX2tleWRvd25fc3BhY2VfYnV0dG9uX18nIDogMTI7XG52YXIgY2xpY2tCdXR0b24gPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19hdXRvY29tcGxldGVfY2xpY2tfYnV0dG9uX18nIDogMTM7XG52YXIgYmx1ckJ1dHRvbiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2F1dG9jb21wbGV0ZV9ibHVyX2J1dHRvbl9fJyA6IDE0O1xudmFyIGNvbnRyb2xsZWRQcm9wVXBkYXRlZFNlbGVjdGVkSXRlbSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2F1dG9jb21wbGV0ZV9jb250cm9sbGVkX3Byb3BfdXBkYXRlZF9zZWxlY3RlZF9pdGVtX18nIDogMTU7XG52YXIgdG91Y2hFbmQgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19hdXRvY29tcGxldGVfdG91Y2hlbmRfXycgOiAxNjtcblxudmFyIHN0YXRlQ2hhbmdlVHlwZXMkMyA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgX19wcm90b19fOiBudWxsLFxuICB1bmtub3duOiB1bmtub3duLFxuICBtb3VzZVVwOiBtb3VzZVVwLFxuICBpdGVtTW91c2VFbnRlcjogaXRlbU1vdXNlRW50ZXIsXG4gIGtleURvd25BcnJvd1VwOiBrZXlEb3duQXJyb3dVcCxcbiAga2V5RG93bkFycm93RG93bjoga2V5RG93bkFycm93RG93bixcbiAga2V5RG93bkVzY2FwZToga2V5RG93bkVzY2FwZSxcbiAga2V5RG93bkVudGVyOiBrZXlEb3duRW50ZXIsXG4gIGtleURvd25Ib21lOiBrZXlEb3duSG9tZSxcbiAga2V5RG93bkVuZDoga2V5RG93bkVuZCxcbiAgY2xpY2tJdGVtOiBjbGlja0l0ZW0sXG4gIGJsdXJJbnB1dDogYmx1cklucHV0LFxuICBjaGFuZ2VJbnB1dDogY2hhbmdlSW5wdXQsXG4gIGtleURvd25TcGFjZUJ1dHRvbjoga2V5RG93blNwYWNlQnV0dG9uLFxuICBjbGlja0J1dHRvbjogY2xpY2tCdXR0b24sXG4gIGJsdXJCdXR0b246IGJsdXJCdXR0b24sXG4gIGNvbnRyb2xsZWRQcm9wVXBkYXRlZFNlbGVjdGVkSXRlbTogY29udHJvbGxlZFByb3BVcGRhdGVkU2VsZWN0ZWRJdGVtLFxuICB0b3VjaEVuZDogdG91Y2hFbmRcbn0pO1xuXG52YXIgX2V4Y2x1ZGVkJDQgPSBbXCJyZWZLZXlcIiwgXCJyZWZcIl0sXG4gIF9leGNsdWRlZDIkMyA9IFtcIm9uQ2xpY2tcIiwgXCJvblByZXNzXCIsIFwib25LZXlEb3duXCIsIFwib25LZXlVcFwiLCBcIm9uQmx1clwiXSxcbiAgX2V4Y2x1ZGVkMyQyID0gW1wib25LZXlEb3duXCIsIFwib25CbHVyXCIsIFwib25DaGFuZ2VcIiwgXCJvbklucHV0XCIsIFwib25DaGFuZ2VUZXh0XCJdLFxuICBfZXhjbHVkZWQ0JDEgPSBbXCJyZWZLZXlcIiwgXCJyZWZcIl0sXG4gIF9leGNsdWRlZDUgPSBbXCJvbk1vdXNlTW92ZVwiLCBcIm9uTW91c2VEb3duXCIsIFwib25DbGlja1wiLCBcIm9uUHJlc3NcIiwgXCJpbmRleFwiLCBcIml0ZW1cIl07XG52YXIgRG93bnNoaWZ0ID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgdmFyIERvd25zaGlmdCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoX0NvbXBvbmVudCkge1xuICAgIF9pbmhlcml0c0xvb3NlKERvd25zaGlmdCwgX0NvbXBvbmVudCk7XG4gICAgZnVuY3Rpb24gRG93bnNoaWZ0KF9wcm9wcykge1xuICAgICAgdmFyIF90aGlzO1xuICAgICAgX3RoaXMgPSBfQ29tcG9uZW50LmNhbGwodGhpcywgX3Byb3BzKSB8fCB0aGlzO1xuICAgICAgLy8gZmFuY3kgZGVzdHJ1Y3R1cmluZyArIGRlZmF1bHRzICsgYWxpYXNlc1xuICAgICAgLy8gdGhpcyBiYXNpY2FsbHkgc2F5cyBlYWNoIHZhbHVlIG9mIHN0YXRlIHNob3VsZCBlaXRoZXIgYmUgc2V0IHRvXG4gICAgICAvLyB0aGUgaW5pdGlhbCB2YWx1ZSBvciB0aGUgZGVmYXVsdCB2YWx1ZSBpZiB0aGUgaW5pdGlhbCB2YWx1ZSBpcyBub3QgcHJvdmlkZWRcbiAgICAgIF90aGlzLmlkID0gX3RoaXMucHJvcHMuaWQgfHwgXCJkb3duc2hpZnQtXCIgKyBnZW5lcmF0ZUlkKCk7XG4gICAgICBfdGhpcy5tZW51SWQgPSBfdGhpcy5wcm9wcy5tZW51SWQgfHwgX3RoaXMuaWQgKyBcIi1tZW51XCI7XG4gICAgICBfdGhpcy5sYWJlbElkID0gX3RoaXMucHJvcHMubGFiZWxJZCB8fCBfdGhpcy5pZCArIFwiLWxhYmVsXCI7XG4gICAgICBfdGhpcy5pbnB1dElkID0gX3RoaXMucHJvcHMuaW5wdXRJZCB8fCBfdGhpcy5pZCArIFwiLWlucHV0XCI7XG4gICAgICBfdGhpcy5nZXRJdGVtSWQgPSBfdGhpcy5wcm9wcy5nZXRJdGVtSWQgfHwgZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5pZCArIFwiLWl0ZW0tXCIgKyBpbmRleDtcbiAgICAgIH07XG4gICAgICBfdGhpcy5pbnB1dCA9IG51bGw7XG4gICAgICBfdGhpcy5pdGVtcyA9IFtdO1xuICAgICAgLy8gaXRlbUNvdW50IGNhbiBiZSBjaGFuZ2VkIGFzeW5jaHJvbm91c2x5XG4gICAgICAvLyBmcm9tIHdpdGhpbiBkb3duc2hpZnQgKHNvIGl0IGNhbid0IGNvbWUgZnJvbSBhIHByb3ApXG4gICAgICAvLyB0aGlzIGlzIHdoeSB3ZSBzdG9yZSBpdCBhcyBhbiBpbnN0YW5jZSBhbmQgdXNlXG4gICAgICAvLyBnZXRJdGVtQ291bnQgcmF0aGVyIHRoYW4ganVzdCB1c2UgaXRlbXMubGVuZ3RoXG4gICAgICAvLyAodG8gc3VwcG9ydCB3aW5kb3dpbmcgKyBhc3luYylcbiAgICAgIF90aGlzLml0ZW1Db3VudCA9IG51bGw7XG4gICAgICBfdGhpcy5wcmV2aW91c1Jlc3VsdENvdW50ID0gMDtcbiAgICAgIF90aGlzLnRpbWVvdXRJZHMgPSBbXTtcbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gdGhlIGZ1bmN0aW9uIHRvIGNhbGwgYWZ0ZXIgdGhlIHRpbWVcbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIHRoZSB0aW1lIHRvIHdhaXRcbiAgICAgICAqL1xuICAgICAgX3RoaXMuaW50ZXJuYWxTZXRUaW1lb3V0ID0gZnVuY3Rpb24gKGZuLCB0aW1lKSB7XG4gICAgICAgIHZhciBpZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIF90aGlzLnRpbWVvdXRJZHMgPSBfdGhpcy50aW1lb3V0SWRzLmZpbHRlcihmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgcmV0dXJuIGkgIT09IGlkO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGZuKCk7XG4gICAgICAgIH0sIHRpbWUpO1xuICAgICAgICBfdGhpcy50aW1lb3V0SWRzLnB1c2goaWQpO1xuICAgICAgfTtcbiAgICAgIF90aGlzLnNldEl0ZW1Db3VudCA9IGZ1bmN0aW9uIChjb3VudCkge1xuICAgICAgICBfdGhpcy5pdGVtQ291bnQgPSBjb3VudDtcbiAgICAgIH07XG4gICAgICBfdGhpcy51bnNldEl0ZW1Db3VudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3RoaXMuaXRlbUNvdW50ID0gbnVsbDtcbiAgICAgIH07XG4gICAgICBfdGhpcy5zZXRIaWdobGlnaHRlZEluZGV4ID0gZnVuY3Rpb24gKGhpZ2hsaWdodGVkSW5kZXgsIG90aGVyU3RhdGVUb1NldCkge1xuICAgICAgICBpZiAoaGlnaGxpZ2h0ZWRJbmRleCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleCA9IF90aGlzLnByb3BzLmRlZmF1bHRIaWdobGlnaHRlZEluZGV4O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvdGhlclN0YXRlVG9TZXQgPT09IHZvaWQgMCkge1xuICAgICAgICAgIG90aGVyU3RhdGVUb1NldCA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIG90aGVyU3RhdGVUb1NldCA9IHBpY2tTdGF0ZShvdGhlclN0YXRlVG9TZXQpO1xuICAgICAgICBfdGhpcy5pbnRlcm5hbFNldFN0YXRlKF9leHRlbmRzKHtcbiAgICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBoaWdobGlnaHRlZEluZGV4XG4gICAgICAgIH0sIG90aGVyU3RhdGVUb1NldCkpO1xuICAgICAgfTtcbiAgICAgIF90aGlzLmNsZWFyU2VsZWN0aW9uID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgIF90aGlzLmludGVybmFsU2V0U3RhdGUoe1xuICAgICAgICAgIHNlbGVjdGVkSXRlbTogbnVsbCxcbiAgICAgICAgICBpbnB1dFZhbHVlOiAnJyxcbiAgICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBfdGhpcy5wcm9wcy5kZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgICAgICBpc09wZW46IF90aGlzLnByb3BzLmRlZmF1bHRJc09wZW5cbiAgICAgICAgfSwgY2IpO1xuICAgICAgfTtcbiAgICAgIF90aGlzLnNlbGVjdEl0ZW0gPSBmdW5jdGlvbiAoaXRlbSwgb3RoZXJTdGF0ZVRvU2V0LCBjYikge1xuICAgICAgICBvdGhlclN0YXRlVG9TZXQgPSBwaWNrU3RhdGUob3RoZXJTdGF0ZVRvU2V0KTtcbiAgICAgICAgX3RoaXMuaW50ZXJuYWxTZXRTdGF0ZShfZXh0ZW5kcyh7XG4gICAgICAgICAgaXNPcGVuOiBfdGhpcy5wcm9wcy5kZWZhdWx0SXNPcGVuLFxuICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IF90aGlzLnByb3BzLmRlZmF1bHRIaWdobGlnaHRlZEluZGV4LFxuICAgICAgICAgIHNlbGVjdGVkSXRlbTogaXRlbSxcbiAgICAgICAgICBpbnB1dFZhbHVlOiBfdGhpcy5wcm9wcy5pdGVtVG9TdHJpbmcoaXRlbSlcbiAgICAgICAgfSwgb3RoZXJTdGF0ZVRvU2V0KSwgY2IpO1xuICAgICAgfTtcbiAgICAgIF90aGlzLnNlbGVjdEl0ZW1BdEluZGV4ID0gZnVuY3Rpb24gKGl0ZW1JbmRleCwgb3RoZXJTdGF0ZVRvU2V0LCBjYikge1xuICAgICAgICB2YXIgaXRlbSA9IF90aGlzLml0ZW1zW2l0ZW1JbmRleF07XG4gICAgICAgIGlmIChpdGVtID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgX3RoaXMuc2VsZWN0SXRlbShpdGVtLCBvdGhlclN0YXRlVG9TZXQsIGNiKTtcbiAgICAgIH07XG4gICAgICBfdGhpcy5zZWxlY3RIaWdobGlnaHRlZEl0ZW0gPSBmdW5jdGlvbiAob3RoZXJTdGF0ZVRvU2V0LCBjYikge1xuICAgICAgICByZXR1cm4gX3RoaXMuc2VsZWN0SXRlbUF0SW5kZXgoX3RoaXMuZ2V0U3RhdGUoKS5oaWdobGlnaHRlZEluZGV4LCBvdGhlclN0YXRlVG9TZXQsIGNiKTtcbiAgICAgIH07XG4gICAgICAvLyBhbnkgcGllY2Ugb2Ygb3VyIHN0YXRlIGNhbiBsaXZlIGluIHR3byBwbGFjZXM6XG4gICAgICAvLyAxLiBVbmNvbnRyb2xsZWQ6IGl0J3MgaW50ZXJuYWwgKHRoaXMuc3RhdGUpXG4gICAgICAvLyAgICBXZSB3aWxsIGNhbGwgdGhpcy5zZXRTdGF0ZSB0byB1cGRhdGUgdGhhdCBzdGF0ZVxuICAgICAgLy8gMi4gQ29udHJvbGxlZDogaXQncyBleHRlcm5hbCAodGhpcy5wcm9wcylcbiAgICAgIC8vICAgIFdlIHdpbGwgY2FsbCB0aGlzLnByb3BzLm9uU3RhdGVDaGFuZ2UgdG8gdXBkYXRlIHRoYXQgc3RhdGVcbiAgICAgIC8vXG4gICAgICAvLyBJbiBhZGRpdGlvbiwgd2UnbGwgY2FsbCB0aGlzLnByb3BzLm9uQ2hhbmdlIGlmIHRoZVxuICAgICAgLy8gc2VsZWN0ZWRJdGVtIGlzIGNoYW5nZWQuXG4gICAgICBfdGhpcy5pbnRlcm5hbFNldFN0YXRlID0gZnVuY3Rpb24gKHN0YXRlVG9TZXQsIGNiKSB7XG4gICAgICAgIHZhciBpc0l0ZW1TZWxlY3RlZCwgb25DaGFuZ2VBcmc7XG4gICAgICAgIHZhciBvblN0YXRlQ2hhbmdlQXJnID0ge307XG4gICAgICAgIHZhciBpc1N0YXRlVG9TZXRGdW5jdGlvbiA9IHR5cGVvZiBzdGF0ZVRvU2V0ID09PSAnZnVuY3Rpb24nO1xuXG4gICAgICAgIC8vIHdlIHdhbnQgdG8gY2FsbCBgb25JbnB1dFZhbHVlQ2hhbmdlYCBiZWZvcmUgdGhlIGBzZXRTdGF0ZWAgY2FsbFxuICAgICAgICAvLyBzbyBzb21lb25lIGNvbnRyb2xsaW5nIHRoZSBgaW5wdXRWYWx1ZWAgc3RhdGUgZ2V0cyBub3RpZmllZCBvZlxuICAgICAgICAvLyB0aGUgaW5wdXQgY2hhbmdlIGFzIHNvb24gYXMgcG9zc2libGUuIFRoaXMgYXZvaWRzIGlzc3VlcyB3aXRoXG4gICAgICAgIC8vIHByZXNlcnZpbmcgdGhlIGN1cnNvciBwb3NpdGlvbi5cbiAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kb3duc2hpZnQtanMvZG93bnNoaWZ0L2lzc3Vlcy8yMTcgZm9yIG1vcmUgaW5mby5cbiAgICAgICAgaWYgKCFpc1N0YXRlVG9TZXRGdW5jdGlvbiAmJiBzdGF0ZVRvU2V0Lmhhc093blByb3BlcnR5KCdpbnB1dFZhbHVlJykpIHtcbiAgICAgICAgICBfdGhpcy5wcm9wcy5vbklucHV0VmFsdWVDaGFuZ2Uoc3RhdGVUb1NldC5pbnB1dFZhbHVlLCBfZXh0ZW5kcyh7fSwgX3RoaXMuZ2V0U3RhdGVBbmRIZWxwZXJzKCksIHN0YXRlVG9TZXQpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3RoaXMuc2V0U3RhdGUoZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgICAgc3RhdGUgPSBfdGhpcy5nZXRTdGF0ZShzdGF0ZSk7XG4gICAgICAgICAgdmFyIG5ld1N0YXRlVG9TZXQgPSBpc1N0YXRlVG9TZXRGdW5jdGlvbiA/IHN0YXRlVG9TZXQoc3RhdGUpIDogc3RhdGVUb1NldDtcblxuICAgICAgICAgIC8vIFlvdXIgb3duIGZ1bmN0aW9uIHRoYXQgY291bGQgbW9kaWZ5IHRoZSBzdGF0ZSB0aGF0IHdpbGwgYmUgc2V0LlxuICAgICAgICAgIG5ld1N0YXRlVG9TZXQgPSBfdGhpcy5wcm9wcy5zdGF0ZVJlZHVjZXIoc3RhdGUsIG5ld1N0YXRlVG9TZXQpO1xuXG4gICAgICAgICAgLy8gY2hlY2tzIGlmIGFuIGl0ZW0gaXMgc2VsZWN0ZWQsIHJlZ2FyZGxlc3Mgb2YgaWYgaXQncyBkaWZmZXJlbnQgZnJvbVxuICAgICAgICAgIC8vIHdoYXQgd2FzIHNlbGVjdGVkIGJlZm9yZVxuICAgICAgICAgIC8vIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIG9uU2VsZWN0IGFuZCBvbkNoYW5nZSBjYWxsYmFja3Mgc2hvdWxkIGJlIGNhbGxlZFxuICAgICAgICAgIGlzSXRlbVNlbGVjdGVkID0gbmV3U3RhdGVUb1NldC5oYXNPd25Qcm9wZXJ0eSgnc2VsZWN0ZWRJdGVtJyk7XG4gICAgICAgICAgLy8gdGhpcyBrZWVwcyB0cmFjayBvZiB0aGUgb2JqZWN0IHdlIHdhbnQgdG8gY2FsbCB3aXRoIHNldFN0YXRlXG4gICAgICAgICAgdmFyIG5leHRTdGF0ZSA9IHt9O1xuICAgICAgICAgIC8vIHdlIG5lZWQgdG8gY2FsbCBvbiBjaGFuZ2UgaWYgdGhlIG91dHNpZGUgd29ybGQgaXMgY29udHJvbGxpbmcgYW55IG9mIG91ciBzdGF0ZVxuICAgICAgICAgIC8vIGFuZCB3ZSdyZSB0cnlpbmcgdG8gdXBkYXRlIHRoYXQgc3RhdGUuIE9SIGlmIHRoZSBzZWxlY3Rpb24gaGFzIGNoYW5nZWQgYW5kIHdlJ3JlXG4gICAgICAgICAgLy8gdHJ5aW5nIHRvIHVwZGF0ZSB0aGUgc2VsZWN0aW9uXG4gICAgICAgICAgaWYgKGlzSXRlbVNlbGVjdGVkICYmIG5ld1N0YXRlVG9TZXQuc2VsZWN0ZWRJdGVtICE9PSBzdGF0ZS5zZWxlY3RlZEl0ZW0pIHtcbiAgICAgICAgICAgIG9uQ2hhbmdlQXJnID0gbmV3U3RhdGVUb1NldC5zZWxlY3RlZEl0ZW07XG4gICAgICAgICAgfVxuICAgICAgICAgIG5ld1N0YXRlVG9TZXQudHlwZSA9IG5ld1N0YXRlVG9TZXQudHlwZSB8fCB1bmtub3duO1xuICAgICAgICAgIE9iamVjdC5rZXlzKG5ld1N0YXRlVG9TZXQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgLy8gb25TdGF0ZUNoYW5nZUFyZyBzaG91bGQgb25seSBoYXZlIHRoZSBzdGF0ZSB0aGF0IGlzXG4gICAgICAgICAgICAvLyBhY3R1YWxseSBjaGFuZ2luZ1xuICAgICAgICAgICAgaWYgKHN0YXRlW2tleV0gIT09IG5ld1N0YXRlVG9TZXRba2V5XSkge1xuICAgICAgICAgICAgICBvblN0YXRlQ2hhbmdlQXJnW2tleV0gPSBuZXdTdGF0ZVRvU2V0W2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0aGUgdHlwZSBpcyB1c2VmdWwgZm9yIHRoZSBvblN0YXRlQ2hhbmdlQXJnXG4gICAgICAgICAgICAvLyBidXQgd2UgZG9uJ3QgYWN0dWFsbHkgd2FudCB0byBzZXQgaXQgaW4gaW50ZXJuYWwgc3RhdGUuXG4gICAgICAgICAgICAvLyB0aGlzIGlzIGFuIHVuZG9jdW1lbnRlZCBmZWF0dXJlIGZvciBub3cuLi4gTm90IGFsbCBpbnRlcm5hbFNldFN0YXRlXG4gICAgICAgICAgICAvLyBjYWxscyBzdXBwb3J0IGl0IGFuZCBJJ20gbm90IGNlcnRhaW4gd2Ugd2FudCB0aGVtIHRvIHlldC5cbiAgICAgICAgICAgIC8vIEJ1dCBpdCBlbmFibGVzIHVzZXJzIGNvbnRyb2xsaW5nIHRoZSBpc09wZW4gc3RhdGUgdG8ga25vdyB3aGVuXG4gICAgICAgICAgICAvLyB0aGUgaXNPcGVuIHN0YXRlIGNoYW5nZXMgZHVlIHRvIG1vdXNldXAgZXZlbnRzIHdoaWNoIGlzIHF1aXRlIGhhbmR5LlxuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ3R5cGUnKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld1N0YXRlVG9TZXRba2V5XTtcbiAgICAgICAgICAgIC8vIGlmIGl0J3MgY29taW5nIGZyb20gcHJvcHMsIHRoZW4gd2UgZG9uJ3QgY2FyZSB0byBzZXQgaXQgaW50ZXJuYWxseVxuICAgICAgICAgICAgaWYgKCFpc0NvbnRyb2xsZWRQcm9wKF90aGlzLnByb3BzLCBrZXkpKSB7XG4gICAgICAgICAgICAgIG5leHRTdGF0ZVtrZXldID0gbmV3U3RhdGVUb1NldFtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gaWYgc3RhdGVUb1NldCBpcyBhIGZ1bmN0aW9uLCB0aGVuIHdlIHdlcmVuJ3QgYWJsZSB0byBjYWxsIG9uSW5wdXRWYWx1ZUNoYW5nZVxuICAgICAgICAgIC8vIGVhcmxpZXIsIHNvIHdlJ2xsIGNhbGwgaXQgbm93IHRoYXQgd2Uga25vdyB3aGF0IHRoZSBpbnB1dFZhbHVlIHN0YXRlIHdpbGwgYmUuXG4gICAgICAgICAgaWYgKGlzU3RhdGVUb1NldEZ1bmN0aW9uICYmIG5ld1N0YXRlVG9TZXQuaGFzT3duUHJvcGVydHkoJ2lucHV0VmFsdWUnKSkge1xuICAgICAgICAgICAgX3RoaXMucHJvcHMub25JbnB1dFZhbHVlQ2hhbmdlKG5ld1N0YXRlVG9TZXQuaW5wdXRWYWx1ZSwgX2V4dGVuZHMoe30sIF90aGlzLmdldFN0YXRlQW5kSGVscGVycygpLCBuZXdTdGF0ZVRvU2V0KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBuZXh0U3RhdGU7XG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBjYWxsIHRoZSBwcm92aWRlZCBjYWxsYmFjayBpZiBpdCdzIGEgZnVuY3Rpb25cbiAgICAgICAgICBjYlRvQ2IoY2IpKCk7XG5cbiAgICAgICAgICAvLyBvbmx5IGNhbGwgdGhlIG9uU3RhdGVDaGFuZ2UgYW5kIG9uQ2hhbmdlIGNhbGxiYWNrcyBpZlxuICAgICAgICAgIC8vIHdlIGhhdmUgcmVsZXZhbnQgaW5mb3JtYXRpb24gdG8gcGFzcyB0aGVtLlxuICAgICAgICAgIHZhciBoYXNNb3JlU3RhdGVUaGFuVHlwZSA9IE9iamVjdC5rZXlzKG9uU3RhdGVDaGFuZ2VBcmcpLmxlbmd0aCA+IDE7XG4gICAgICAgICAgaWYgKGhhc01vcmVTdGF0ZVRoYW5UeXBlKSB7XG4gICAgICAgICAgICBfdGhpcy5wcm9wcy5vblN0YXRlQ2hhbmdlKG9uU3RhdGVDaGFuZ2VBcmcsIF90aGlzLmdldFN0YXRlQW5kSGVscGVycygpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlzSXRlbVNlbGVjdGVkKSB7XG4gICAgICAgICAgICBfdGhpcy5wcm9wcy5vblNlbGVjdChzdGF0ZVRvU2V0LnNlbGVjdGVkSXRlbSwgX3RoaXMuZ2V0U3RhdGVBbmRIZWxwZXJzKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAob25DaGFuZ2VBcmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgX3RoaXMucHJvcHMub25DaGFuZ2Uob25DaGFuZ2VBcmcsIF90aGlzLmdldFN0YXRlQW5kSGVscGVycygpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gdGhpcyBpcyBjdXJyZW50bHkgdW5kb2N1bWVudGVkIGFuZCB0aGVyZWZvcmUgc3ViamVjdCB0byBjaGFuZ2VcbiAgICAgICAgICAvLyBXZSdsbCB0cnkgdG8gbm90IGJyZWFrIGl0LCBidXQganVzdCBiZSB3YXJuZWQuXG4gICAgICAgICAgX3RoaXMucHJvcHMub25Vc2VyQWN0aW9uKG9uU3RhdGVDaGFuZ2VBcmcsIF90aGlzLmdldFN0YXRlQW5kSGVscGVycygpKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBST09UXG4gICAgICBfdGhpcy5yb290UmVmID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLl9yb290Tm9kZSA9IG5vZGU7XG4gICAgICB9O1xuICAgICAgX3RoaXMuZ2V0Um9vdFByb3BzID0gZnVuY3Rpb24gKF90ZW1wLCBfdGVtcDIpIHtcbiAgICAgICAgdmFyIF9leHRlbmRzMjtcbiAgICAgICAgdmFyIF9yZWYgPSBfdGVtcCA9PT0gdm9pZCAwID8ge30gOiBfdGVtcCxcbiAgICAgICAgICBfcmVmJHJlZktleSA9IF9yZWYucmVmS2V5LFxuICAgICAgICAgIHJlZktleSA9IF9yZWYkcmVmS2V5ID09PSB2b2lkIDAgPyAncmVmJyA6IF9yZWYkcmVmS2V5LFxuICAgICAgICAgIHJlZiA9IF9yZWYucmVmLFxuICAgICAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmLCBfZXhjbHVkZWQkNCk7XG4gICAgICAgIHZhciBfcmVmMiA9IF90ZW1wMiA9PT0gdm9pZCAwID8ge30gOiBfdGVtcDIsXG4gICAgICAgICAgX3JlZjIkc3VwcHJlc3NSZWZFcnJvID0gX3JlZjIuc3VwcHJlc3NSZWZFcnJvcixcbiAgICAgICAgICBzdXBwcmVzc1JlZkVycm9yID0gX3JlZjIkc3VwcHJlc3NSZWZFcnJvID09PSB2b2lkIDAgPyBmYWxzZSA6IF9yZWYyJHN1cHByZXNzUmVmRXJybztcbiAgICAgICAgLy8gdGhpcyBpcyB1c2VkIGluIHRoZSByZW5kZXIgdG8ga25vdyB3aGV0aGVyIHRoZSB1c2VyIGhhcyBjYWxsZWQgZ2V0Um9vdFByb3BzLlxuICAgICAgICAvLyBJdCB1c2VzIHRoYXQgdG8ga25vdyB3aGV0aGVyIHRvIGFwcGx5IHRoZSBwcm9wcyBhdXRvbWF0aWNhbGx5XG4gICAgICAgIF90aGlzLmdldFJvb3RQcm9wcy5jYWxsZWQgPSB0cnVlO1xuICAgICAgICBfdGhpcy5nZXRSb290UHJvcHMucmVmS2V5ID0gcmVmS2V5O1xuICAgICAgICBfdGhpcy5nZXRSb290UHJvcHMuc3VwcHJlc3NSZWZFcnJvciA9IHN1cHByZXNzUmVmRXJyb3I7XG4gICAgICAgIHZhciBfdGhpcyRnZXRTdGF0ZSA9IF90aGlzLmdldFN0YXRlKCksXG4gICAgICAgICAgaXNPcGVuID0gX3RoaXMkZ2V0U3RhdGUuaXNPcGVuO1xuICAgICAgICByZXR1cm4gX2V4dGVuZHMoKF9leHRlbmRzMiA9IHt9LCBfZXh0ZW5kczJbcmVmS2V5XSA9IGhhbmRsZVJlZnMocmVmLCBfdGhpcy5yb290UmVmKSwgX2V4dGVuZHMyLnJvbGUgPSAnY29tYm9ib3gnLCBfZXh0ZW5kczJbJ2FyaWEtZXhwYW5kZWQnXSA9IGlzT3BlbiwgX2V4dGVuZHMyWydhcmlhLWhhc3BvcHVwJ10gPSAnbGlzdGJveCcsIF9leHRlbmRzMlsnYXJpYS1vd25zJ10gPSBpc09wZW4gPyBfdGhpcy5tZW51SWQgOiBudWxsLCBfZXh0ZW5kczJbJ2FyaWEtbGFiZWxsZWRieSddID0gX3RoaXMubGFiZWxJZCwgX2V4dGVuZHMyKSwgcmVzdCk7XG4gICAgICB9O1xuICAgICAgLy9cXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIFJPT1RcbiAgICAgIF90aGlzLmtleURvd25IYW5kbGVycyA9IHtcbiAgICAgICAgQXJyb3dEb3duOiBmdW5jdGlvbiBBcnJvd0Rvd24oZXZlbnQpIHtcbiAgICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGlmICh0aGlzLmdldFN0YXRlKCkuaXNPcGVuKSB7XG4gICAgICAgICAgICB2YXIgYW1vdW50ID0gZXZlbnQuc2hpZnRLZXkgPyA1IDogMTtcbiAgICAgICAgICAgIHRoaXMubW92ZUhpZ2hsaWdodGVkSW5kZXgoYW1vdW50LCB7XG4gICAgICAgICAgICAgIHR5cGU6IGtleURvd25BcnJvd0Rvd25cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmludGVybmFsU2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpc09wZW46IHRydWUsXG4gICAgICAgICAgICAgIHR5cGU6IGtleURvd25BcnJvd0Rvd25cbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdmFyIGl0ZW1Db3VudCA9IF90aGlzMi5nZXRJdGVtQ291bnQoKTtcbiAgICAgICAgICAgICAgaWYgKGl0ZW1Db3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMyJGdldFN0YXRlID0gX3RoaXMyLmdldFN0YXRlKCksXG4gICAgICAgICAgICAgICAgICBoaWdobGlnaHRlZEluZGV4ID0gX3RoaXMyJGdldFN0YXRlLmhpZ2hsaWdodGVkSW5kZXg7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRIaWdobGlnaHRlZEluZGV4ID0gZ2V0TmV4dFdyYXBwaW5nSW5kZXgoMSwgaGlnaGxpZ2h0ZWRJbmRleCwgaXRlbUNvdW50LCBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpczIuZ2V0SXRlbU5vZGVGcm9tSW5kZXgoaW5kZXgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIF90aGlzMi5zZXRIaWdobGlnaHRlZEluZGV4KG5leHRIaWdobGlnaHRlZEluZGV4LCB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiBrZXlEb3duQXJyb3dEb3duXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgQXJyb3dVcDogZnVuY3Rpb24gQXJyb3dVcChldmVudCkge1xuICAgICAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgaWYgKHRoaXMuZ2V0U3RhdGUoKS5pc09wZW4pIHtcbiAgICAgICAgICAgIHZhciBhbW91bnQgPSBldmVudC5zaGlmdEtleSA/IC01IDogLTE7XG4gICAgICAgICAgICB0aGlzLm1vdmVIaWdobGlnaHRlZEluZGV4KGFtb3VudCwge1xuICAgICAgICAgICAgICB0eXBlOiBrZXlEb3duQXJyb3dVcFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJuYWxTZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIGlzT3BlbjogdHJ1ZSxcbiAgICAgICAgICAgICAgdHlwZToga2V5RG93bkFycm93VXBcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdmFyIGl0ZW1Db3VudCA9IF90aGlzMy5nZXRJdGVtQ291bnQoKTtcbiAgICAgICAgICAgICAgaWYgKGl0ZW1Db3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMzJGdldFN0YXRlID0gX3RoaXMzLmdldFN0YXRlKCksXG4gICAgICAgICAgICAgICAgICBoaWdobGlnaHRlZEluZGV4ID0gX3RoaXMzJGdldFN0YXRlLmhpZ2hsaWdodGVkSW5kZXg7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRIaWdobGlnaHRlZEluZGV4ID0gZ2V0TmV4dFdyYXBwaW5nSW5kZXgoLTEsIGhpZ2hsaWdodGVkSW5kZXgsIGl0ZW1Db3VudCwgZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMzLmdldEl0ZW1Ob2RlRnJvbUluZGV4KGluZGV4KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBfdGhpczMuc2V0SGlnaGxpZ2h0ZWRJbmRleChuZXh0SGlnaGxpZ2h0ZWRJbmRleCwge1xuICAgICAgICAgICAgICAgICAgdHlwZToga2V5RG93bkFycm93VXBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBFbnRlcjogZnVuY3Rpb24gRW50ZXIoZXZlbnQpIHtcbiAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IDIyOSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgX3RoaXMkZ2V0U3RhdGUyID0gdGhpcy5nZXRTdGF0ZSgpLFxuICAgICAgICAgICAgaXNPcGVuID0gX3RoaXMkZ2V0U3RhdGUyLmlzT3BlbixcbiAgICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXggPSBfdGhpcyRnZXRTdGF0ZTIuaGlnaGxpZ2h0ZWRJbmRleDtcbiAgICAgICAgICBpZiAoaXNPcGVuICYmIGhpZ2hsaWdodGVkSW5kZXggIT0gbnVsbCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5pdGVtc1toaWdobGlnaHRlZEluZGV4XTtcbiAgICAgICAgICAgIHZhciBpdGVtTm9kZSA9IHRoaXMuZ2V0SXRlbU5vZGVGcm9tSW5kZXgoaGlnaGxpZ2h0ZWRJbmRleCk7XG4gICAgICAgICAgICBpZiAoaXRlbSA9PSBudWxsIHx8IGl0ZW1Ob2RlICYmIGl0ZW1Ob2RlLmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNlbGVjdEhpZ2hsaWdodGVkSXRlbSh7XG4gICAgICAgICAgICAgIHR5cGU6IGtleURvd25FbnRlclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBFc2NhcGU6IGZ1bmN0aW9uIEVzY2FwZShldmVudCkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5yZXNldChfZXh0ZW5kcyh7XG4gICAgICAgICAgICB0eXBlOiBrZXlEb3duRXNjYXBlXG4gICAgICAgICAgfSwgIXRoaXMuc3RhdGUuaXNPcGVuICYmIHtcbiAgICAgICAgICAgIHNlbGVjdGVkSXRlbTogbnVsbCxcbiAgICAgICAgICAgIGlucHV0VmFsdWU6ICcnXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBCVVRUT05cbiAgICAgIF90aGlzLmJ1dHRvbktleURvd25IYW5kbGVycyA9IF9leHRlbmRzKHt9LCBfdGhpcy5rZXlEb3duSGFuZGxlcnMsIHtcbiAgICAgICAgJyAnOiBmdW5jdGlvbiBfKGV2ZW50KSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLnRvZ2dsZU1lbnUoe1xuICAgICAgICAgICAgdHlwZToga2V5RG93blNwYWNlQnV0dG9uXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgX3RoaXMuaW5wdXRLZXlEb3duSGFuZGxlcnMgPSBfZXh0ZW5kcyh7fSwgX3RoaXMua2V5RG93bkhhbmRsZXJzLCB7XG4gICAgICAgIEhvbWU6IGZ1bmN0aW9uIEhvbWUoZXZlbnQpIHtcbiAgICAgICAgICB2YXIgX3RoaXM0ID0gdGhpcztcbiAgICAgICAgICB2YXIgX3RoaXMkZ2V0U3RhdGUzID0gdGhpcy5nZXRTdGF0ZSgpLFxuICAgICAgICAgICAgaXNPcGVuID0gX3RoaXMkZ2V0U3RhdGUzLmlzT3BlbjtcbiAgICAgICAgICBpZiAoIWlzT3Blbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHZhciBpdGVtQ291bnQgPSB0aGlzLmdldEl0ZW1Db3VudCgpO1xuICAgICAgICAgIGlmIChpdGVtQ291bnQgPD0gMCB8fCAhaXNPcGVuKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gZ2V0IG5leHQgbm9uLWRpc2FibGVkIHN0YXJ0aW5nIGRvd253YXJkcyBmcm9tIDAgaWYgdGhhdCdzIGRpc2FibGVkLlxuICAgICAgICAgIHZhciBuZXdIaWdobGlnaHRlZEluZGV4ID0gZ2V0TmV4dE5vbkRpc2FibGVkSW5kZXgoMSwgMCwgaXRlbUNvdW50LCBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpczQuZ2V0SXRlbU5vZGVGcm9tSW5kZXgoaW5kZXgpO1xuICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICB0aGlzLnNldEhpZ2hsaWdodGVkSW5kZXgobmV3SGlnaGxpZ2h0ZWRJbmRleCwge1xuICAgICAgICAgICAgdHlwZToga2V5RG93bkhvbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgRW5kOiBmdW5jdGlvbiBFbmQoZXZlbnQpIHtcbiAgICAgICAgICB2YXIgX3RoaXM1ID0gdGhpcztcbiAgICAgICAgICB2YXIgX3RoaXMkZ2V0U3RhdGU0ID0gdGhpcy5nZXRTdGF0ZSgpLFxuICAgICAgICAgICAgaXNPcGVuID0gX3RoaXMkZ2V0U3RhdGU0LmlzT3BlbjtcbiAgICAgICAgICBpZiAoIWlzT3Blbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHZhciBpdGVtQ291bnQgPSB0aGlzLmdldEl0ZW1Db3VudCgpO1xuICAgICAgICAgIGlmIChpdGVtQ291bnQgPD0gMCB8fCAhaXNPcGVuKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gZ2V0IG5leHQgbm9uLWRpc2FibGVkIHN0YXJ0aW5nIHVwd2FyZHMgZnJvbSBsYXN0IGluZGV4IGlmIHRoYXQncyBkaXNhYmxlZC5cbiAgICAgICAgICB2YXIgbmV3SGlnaGxpZ2h0ZWRJbmRleCA9IGdldE5leHROb25EaXNhYmxlZEluZGV4KC0xLCBpdGVtQ291bnQgLSAxLCBpdGVtQ291bnQsIGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzNS5nZXRJdGVtTm9kZUZyb21JbmRleChpbmRleCk7XG4gICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgIHRoaXMuc2V0SGlnaGxpZ2h0ZWRJbmRleChuZXdIaWdobGlnaHRlZEluZGV4LCB7XG4gICAgICAgICAgICB0eXBlOiBrZXlEb3duRW5kXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgX3RoaXMuZ2V0VG9nZ2xlQnV0dG9uUHJvcHMgPSBmdW5jdGlvbiAoX3RlbXAzKSB7XG4gICAgICAgIHZhciBfcmVmMyA9IF90ZW1wMyA9PT0gdm9pZCAwID8ge30gOiBfdGVtcDMsXG4gICAgICAgICAgb25DbGljayA9IF9yZWYzLm9uQ2xpY2s7XG4gICAgICAgICAgX3JlZjMub25QcmVzcztcbiAgICAgICAgICB2YXIgb25LZXlEb3duID0gX3JlZjMub25LZXlEb3duLFxuICAgICAgICAgIG9uS2V5VXAgPSBfcmVmMy5vbktleVVwLFxuICAgICAgICAgIG9uQmx1ciA9IF9yZWYzLm9uQmx1cixcbiAgICAgICAgICByZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZjMsIF9leGNsdWRlZDIkMyk7XG4gICAgICAgIHZhciBfdGhpcyRnZXRTdGF0ZTUgPSBfdGhpcy5nZXRTdGF0ZSgpLFxuICAgICAgICAgIGlzT3BlbiA9IF90aGlzJGdldFN0YXRlNS5pc09wZW47XG4gICAgICAgIHZhciBlbmFibGVkRXZlbnRIYW5kbGVycyA9IHtcbiAgICAgICAgICBvbkNsaWNrOiBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbkNsaWNrLCBfdGhpcy5idXR0b25IYW5kbGVDbGljayksXG4gICAgICAgICAgb25LZXlEb3duOiBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbktleURvd24sIF90aGlzLmJ1dHRvbkhhbmRsZUtleURvd24pLFxuICAgICAgICAgIG9uS2V5VXA6IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uS2V5VXAsIF90aGlzLmJ1dHRvbkhhbmRsZUtleVVwKSxcbiAgICAgICAgICBvbkJsdXI6IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uQmx1ciwgX3RoaXMuYnV0dG9uSGFuZGxlQmx1cilcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGV2ZW50SGFuZGxlcnMgPSByZXN0LmRpc2FibGVkID8ge30gOiBlbmFibGVkRXZlbnRIYW5kbGVycztcbiAgICAgICAgcmV0dXJuIF9leHRlbmRzKHtcbiAgICAgICAgICB0eXBlOiAnYnV0dG9uJyxcbiAgICAgICAgICByb2xlOiAnYnV0dG9uJyxcbiAgICAgICAgICAnYXJpYS1sYWJlbCc6IGlzT3BlbiA/ICdjbG9zZSBtZW51JyA6ICdvcGVuIG1lbnUnLFxuICAgICAgICAgICdhcmlhLWhhc3BvcHVwJzogdHJ1ZSxcbiAgICAgICAgICAnZGF0YS10b2dnbGUnOiB0cnVlXG4gICAgICAgIH0sIGV2ZW50SGFuZGxlcnMsIHJlc3QpO1xuICAgICAgfTtcbiAgICAgIF90aGlzLmJ1dHRvbkhhbmRsZUtleVVwID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIC8vIFByZXZlbnQgY2xpY2sgZXZlbnQgZnJvbSBlbWl0dGluZyBpbiBGaXJlZm94XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9O1xuICAgICAgX3RoaXMuYnV0dG9uSGFuZGxlS2V5RG93biA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIga2V5ID0gbm9ybWFsaXplQXJyb3dLZXkoZXZlbnQpO1xuICAgICAgICBpZiAoX3RoaXMuYnV0dG9uS2V5RG93bkhhbmRsZXJzW2tleV0pIHtcbiAgICAgICAgICBfdGhpcy5idXR0b25LZXlEb3duSGFuZGxlcnNba2V5XS5jYWxsKF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBldmVudCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBfdGhpcy5idXR0b25IYW5kbGVDbGljayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAvLyBoYW5kbGUgb2RkIGNhc2UgZm9yIFNhZmFyaSBhbmQgRmlyZWZveCB3aGljaFxuICAgICAgICAvLyBkb24ndCBnaXZlIHRoZSBidXR0b24gdGhlIGZvY3VzIHByb3Blcmx5LlxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKGNhbid0IHJlYXNvbmFibHkgdGVzdCB0aGlzKSAqL1xuICAgICAgICBpZiAoX3RoaXMucHJvcHMuZW52aXJvbm1lbnQuZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gX3RoaXMucHJvcHMuZW52aXJvbm1lbnQuZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAgIGV2ZW50LnRhcmdldC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRvIHNpbXBsaWZ5IHRlc3RpbmcgY29tcG9uZW50cyB0aGF0IHVzZSBkb3duc2hpZnQsIHdlJ2xsIG5vdCB3cmFwIHRoaXMgaW4gYSBzZXRUaW1lb3V0XG4gICAgICAgIC8vIGlmIHRoZSBOT0RFX0VOViBpcyB0ZXN0LiBXaXRoIHRoZSBwcm9wZXIgYnVpbGQgc3lzdGVtLCB0aGlzIHNob3VsZCBiZSBkZWFkIGNvZGUgZWxpbWluYXRlZFxuICAgICAgICAvLyB3aGVuIGJ1aWxkaW5nIGZvciBwcm9kdWN0aW9uIGFuZCBzaG91bGQgdGhlcmVmb3JlIGhhdmUgbm8gaW1wYWN0IG9uIHByb2R1Y3Rpb24gY29kZS5cbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAndGVzdCcpIHtcbiAgICAgICAgICBfdGhpcy50b2dnbGVNZW51KHtcbiAgICAgICAgICAgIHR5cGU6IGNsaWNrQnV0dG9uXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRW5zdXJlIHRoYXQgdG9nZ2xlIG9mIG1lbnUgb2NjdXJzIGFmdGVyIHRoZSBwb3RlbnRpYWwgYmx1ciBldmVudCBpbiBpT1NcbiAgICAgICAgICBfdGhpcy5pbnRlcm5hbFNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnRvZ2dsZU1lbnUoe1xuICAgICAgICAgICAgICB0eXBlOiBjbGlja0J1dHRvblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBfdGhpcy5idXR0b25IYW5kbGVCbHVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBibHVyVGFyZ2V0ID0gZXZlbnQudGFyZ2V0OyAvLyBTYXZlIGJsdXIgdGFyZ2V0IGZvciBjb21wYXJpc29uIHdpdGggYWN0aXZlRWxlbWVudCBsYXRlclxuICAgICAgICAvLyBOZWVkIHNldFRpbWVvdXQsIHNvIHRoYXQgd2hlbiB0aGUgdXNlciBwcmVzc2VzIFRhYiwgdGhlIGFjdGl2ZUVsZW1lbnQgaXMgdGhlIG5leHQgZm9jdXNlZCBlbGVtZW50LCBub3QgYm9keSBlbGVtZW50XG4gICAgICAgIF90aGlzLmludGVybmFsU2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFfdGhpcy5pc01vdXNlRG93biAmJiAoX3RoaXMucHJvcHMuZW52aXJvbm1lbnQuZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PSBudWxsIHx8IF90aGlzLnByb3BzLmVudmlyb25tZW50LmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuaWQgIT09IF90aGlzLmlucHV0SWQpICYmIF90aGlzLnByb3BzLmVudmlyb25tZW50LmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGJsdXJUYXJnZXQgLy8gRG8gbm90aGluZyBpZiB3ZSByZWZvY3VzIHRoZSBzYW1lIGVsZW1lbnQgYWdhaW4gKHRvIHNvbHZlIGlzc3VlIGluIFNhZmFyaSBvbiBpT1MpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBfdGhpcy5yZXNldCh7XG4gICAgICAgICAgICAgIHR5cGU6IGJsdXJCdXR0b25cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgLy9cXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIEJVVFRPTlxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBMQUJFTFxuICAgICAgX3RoaXMuZ2V0TGFiZWxQcm9wcyA9IGZ1bmN0aW9uIChwcm9wcykge1xuICAgICAgICByZXR1cm4gX2V4dGVuZHMoe1xuICAgICAgICAgIGh0bWxGb3I6IF90aGlzLmlucHV0SWQsXG4gICAgICAgICAgaWQ6IF90aGlzLmxhYmVsSWRcbiAgICAgICAgfSwgcHJvcHMpO1xuICAgICAgfTtcbiAgICAgIC8vXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBMQUJFTFxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBJTlBVVFxuICAgICAgX3RoaXMuZ2V0SW5wdXRQcm9wcyA9IGZ1bmN0aW9uIChfdGVtcDQpIHtcbiAgICAgICAgdmFyIF9yZWY0ID0gX3RlbXA0ID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wNCxcbiAgICAgICAgICBvbktleURvd24gPSBfcmVmNC5vbktleURvd24sXG4gICAgICAgICAgb25CbHVyID0gX3JlZjQub25CbHVyLFxuICAgICAgICAgIG9uQ2hhbmdlID0gX3JlZjQub25DaGFuZ2UsXG4gICAgICAgICAgb25JbnB1dCA9IF9yZWY0Lm9uSW5wdXQ7XG4gICAgICAgICAgX3JlZjQub25DaGFuZ2VUZXh0O1xuICAgICAgICAgIHZhciByZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZjQsIF9leGNsdWRlZDMkMik7XG4gICAgICAgIHZhciBvbkNoYW5nZUtleTtcbiAgICAgICAgdmFyIGV2ZW50SGFuZGxlcnMgPSB7fTtcblxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAocHJlYWN0KSAqL1xuICAgICAgICB7XG4gICAgICAgICAgb25DaGFuZ2VLZXkgPSAnb25DaGFuZ2UnO1xuICAgICAgICB9XG4gICAgICAgIHZhciBfdGhpcyRnZXRTdGF0ZTYgPSBfdGhpcy5nZXRTdGF0ZSgpLFxuICAgICAgICAgIGlucHV0VmFsdWUgPSBfdGhpcyRnZXRTdGF0ZTYuaW5wdXRWYWx1ZSxcbiAgICAgICAgICBpc09wZW4gPSBfdGhpcyRnZXRTdGF0ZTYuaXNPcGVuLFxuICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXggPSBfdGhpcyRnZXRTdGF0ZTYuaGlnaGxpZ2h0ZWRJbmRleDtcbiAgICAgICAgaWYgKCFyZXN0LmRpc2FibGVkKSB7XG4gICAgICAgICAgdmFyIF9ldmVudEhhbmRsZXJzO1xuICAgICAgICAgIGV2ZW50SGFuZGxlcnMgPSAoX2V2ZW50SGFuZGxlcnMgPSB7fSwgX2V2ZW50SGFuZGxlcnNbb25DaGFuZ2VLZXldID0gY2FsbEFsbEV2ZW50SGFuZGxlcnMob25DaGFuZ2UsIG9uSW5wdXQsIF90aGlzLmlucHV0SGFuZGxlQ2hhbmdlKSwgX2V2ZW50SGFuZGxlcnMub25LZXlEb3duID0gY2FsbEFsbEV2ZW50SGFuZGxlcnMob25LZXlEb3duLCBfdGhpcy5pbnB1dEhhbmRsZUtleURvd24pLCBfZXZlbnRIYW5kbGVycy5vbkJsdXIgPSBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbkJsdXIsIF90aGlzLmlucHV0SGFuZGxlQmx1ciksIF9ldmVudEhhbmRsZXJzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX2V4dGVuZHMoe1xuICAgICAgICAgICdhcmlhLWF1dG9jb21wbGV0ZSc6ICdsaXN0JyxcbiAgICAgICAgICAnYXJpYS1hY3RpdmVkZXNjZW5kYW50JzogaXNPcGVuICYmIHR5cGVvZiBoaWdobGlnaHRlZEluZGV4ID09PSAnbnVtYmVyJyAmJiBoaWdobGlnaHRlZEluZGV4ID49IDAgPyBfdGhpcy5nZXRJdGVtSWQoaGlnaGxpZ2h0ZWRJbmRleCkgOiBudWxsLFxuICAgICAgICAgICdhcmlhLWNvbnRyb2xzJzogaXNPcGVuID8gX3RoaXMubWVudUlkIDogbnVsbCxcbiAgICAgICAgICAnYXJpYS1sYWJlbGxlZGJ5JzogcmVzdCAmJiByZXN0WydhcmlhLWxhYmVsJ10gPyB1bmRlZmluZWQgOiBfdGhpcy5sYWJlbElkLFxuICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL1NlY3VyaXR5L1NlY3VyaW5nX3lvdXJfc2l0ZS9UdXJuaW5nX29mZl9mb3JtX2F1dG9jb21wbGV0aW9uXG4gICAgICAgICAgLy8gcmV2ZXJ0IGJhY2sgc2luY2UgYXV0b2NvbXBsZXRlPVwibm9wZVwiIGlzIGlnbm9yZWQgb24gbGF0ZXN0IENocm9tZSBhbmQgT3BlcmFcbiAgICAgICAgICBhdXRvQ29tcGxldGU6ICdvZmYnLFxuICAgICAgICAgIHZhbHVlOiBpbnB1dFZhbHVlLFxuICAgICAgICAgIGlkOiBfdGhpcy5pbnB1dElkXG4gICAgICAgIH0sIGV2ZW50SGFuZGxlcnMsIHJlc3QpO1xuICAgICAgfTtcbiAgICAgIF90aGlzLmlucHV0SGFuZGxlS2V5RG93biA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIga2V5ID0gbm9ybWFsaXplQXJyb3dLZXkoZXZlbnQpO1xuICAgICAgICBpZiAoa2V5ICYmIF90aGlzLmlucHV0S2V5RG93bkhhbmRsZXJzW2tleV0pIHtcbiAgICAgICAgICBfdGhpcy5pbnB1dEtleURvd25IYW5kbGVyc1trZXldLmNhbGwoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIF90aGlzLmlucHV0SGFuZGxlQ2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIF90aGlzLmludGVybmFsU2V0U3RhdGUoe1xuICAgICAgICAgIHR5cGU6IGNoYW5nZUlucHV0LFxuICAgICAgICAgIGlzT3BlbjogdHJ1ZSxcbiAgICAgICAgICBpbnB1dFZhbHVlOiBldmVudC50YXJnZXQudmFsdWUsXG4gICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogX3RoaXMucHJvcHMuZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXhcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgX3RoaXMuaW5wdXRIYW5kbGVCbHVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBOZWVkIHNldFRpbWVvdXQsIHNvIHRoYXQgd2hlbiB0aGUgdXNlciBwcmVzc2VzIFRhYiwgdGhlIGFjdGl2ZUVsZW1lbnQgaXMgdGhlIG5leHQgZm9jdXNlZCBlbGVtZW50LCBub3QgdGhlIGJvZHkgZWxlbWVudFxuICAgICAgICBfdGhpcy5pbnRlcm5hbFNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBkb3duc2hpZnRCdXR0b25Jc0FjdGl2ZSA9IF90aGlzLnByb3BzLmVudmlyb25tZW50LmRvY3VtZW50ICYmICEhX3RoaXMucHJvcHMuZW52aXJvbm1lbnQuZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiAhIV90aGlzLnByb3BzLmVudmlyb25tZW50LmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuZGF0YXNldCAmJiBfdGhpcy5wcm9wcy5lbnZpcm9ubWVudC5kb2N1bWVudC5hY3RpdmVFbGVtZW50LmRhdGFzZXQudG9nZ2xlICYmIF90aGlzLl9yb290Tm9kZSAmJiBfdGhpcy5fcm9vdE5vZGUuY29udGFpbnMoX3RoaXMucHJvcHMuZW52aXJvbm1lbnQuZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG4gICAgICAgICAgaWYgKCFfdGhpcy5pc01vdXNlRG93biAmJiAhZG93bnNoaWZ0QnV0dG9uSXNBY3RpdmUpIHtcbiAgICAgICAgICAgIF90aGlzLnJlc2V0KHtcbiAgICAgICAgICAgICAgdHlwZTogYmx1cklucHV0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIC8vXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBJTlBVVFxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBNRU5VXG4gICAgICBfdGhpcy5tZW51UmVmID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgX3RoaXMuX21lbnVOb2RlID0gbm9kZTtcbiAgICAgIH07XG4gICAgICBfdGhpcy5nZXRNZW51UHJvcHMgPSBmdW5jdGlvbiAoX3RlbXA1LCBfdGVtcDYpIHtcbiAgICAgICAgdmFyIF9leHRlbmRzMztcbiAgICAgICAgdmFyIF9yZWY1ID0gX3RlbXA1ID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wNSxcbiAgICAgICAgICBfcmVmNSRyZWZLZXkgPSBfcmVmNS5yZWZLZXksXG4gICAgICAgICAgcmVmS2V5ID0gX3JlZjUkcmVmS2V5ID09PSB2b2lkIDAgPyAncmVmJyA6IF9yZWY1JHJlZktleSxcbiAgICAgICAgICByZWYgPSBfcmVmNS5yZWYsXG4gICAgICAgICAgcHJvcHMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmNSwgX2V4Y2x1ZGVkNCQxKTtcbiAgICAgICAgdmFyIF9yZWY2ID0gX3RlbXA2ID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wNixcbiAgICAgICAgICBfcmVmNiRzdXBwcmVzc1JlZkVycm8gPSBfcmVmNi5zdXBwcmVzc1JlZkVycm9yLFxuICAgICAgICAgIHN1cHByZXNzUmVmRXJyb3IgPSBfcmVmNiRzdXBwcmVzc1JlZkVycm8gPT09IHZvaWQgMCA/IGZhbHNlIDogX3JlZjYkc3VwcHJlc3NSZWZFcnJvO1xuICAgICAgICBfdGhpcy5nZXRNZW51UHJvcHMuY2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgX3RoaXMuZ2V0TWVudVByb3BzLnJlZktleSA9IHJlZktleTtcbiAgICAgICAgX3RoaXMuZ2V0TWVudVByb3BzLnN1cHByZXNzUmVmRXJyb3IgPSBzdXBwcmVzc1JlZkVycm9yO1xuICAgICAgICByZXR1cm4gX2V4dGVuZHMoKF9leHRlbmRzMyA9IHt9LCBfZXh0ZW5kczNbcmVmS2V5XSA9IGhhbmRsZVJlZnMocmVmLCBfdGhpcy5tZW51UmVmKSwgX2V4dGVuZHMzLnJvbGUgPSAnbGlzdGJveCcsIF9leHRlbmRzM1snYXJpYS1sYWJlbGxlZGJ5J10gPSBwcm9wcyAmJiBwcm9wc1snYXJpYS1sYWJlbCddID8gbnVsbCA6IF90aGlzLmxhYmVsSWQsIF9leHRlbmRzMy5pZCA9IF90aGlzLm1lbnVJZCwgX2V4dGVuZHMzKSwgcHJvcHMpO1xuICAgICAgfTtcbiAgICAgIC8vXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBNRU5VXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIElURU1cbiAgICAgIF90aGlzLmdldEl0ZW1Qcm9wcyA9IGZ1bmN0aW9uIChfdGVtcDcpIHtcbiAgICAgICAgdmFyIF9lbmFibGVkRXZlbnRIYW5kbGVycztcbiAgICAgICAgdmFyIF9yZWY3ID0gX3RlbXA3ID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wNyxcbiAgICAgICAgICBvbk1vdXNlTW92ZSA9IF9yZWY3Lm9uTW91c2VNb3ZlLFxuICAgICAgICAgIG9uTW91c2VEb3duID0gX3JlZjcub25Nb3VzZURvd24sXG4gICAgICAgICAgb25DbGljayA9IF9yZWY3Lm9uQ2xpY2s7XG4gICAgICAgICAgX3JlZjcub25QcmVzcztcbiAgICAgICAgICB2YXIgaW5kZXggPSBfcmVmNy5pbmRleCxcbiAgICAgICAgICBfcmVmNyRpdGVtID0gX3JlZjcuaXRlbSxcbiAgICAgICAgICBpdGVtID0gX3JlZjckaXRlbSA9PT0gdm9pZCAwID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyA/IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovdW5kZWZpbmVkIDogcmVxdWlyZWRQcm9wKCdnZXRJdGVtUHJvcHMnLCAnaXRlbScpIDogX3JlZjckaXRlbSxcbiAgICAgICAgICByZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZjcsIF9leGNsdWRlZDUpO1xuICAgICAgICBpZiAoaW5kZXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIF90aGlzLml0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgICAgaW5kZXggPSBfdGhpcy5pdGVtcy5pbmRleE9mKGl0ZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzLml0ZW1zW2luZGV4XSA9IGl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9uU2VsZWN0S2V5ID0gJ29uQ2xpY2snO1xuICAgICAgICB2YXIgY3VzdG9tQ2xpY2tIYW5kbGVyID0gb25DbGljaztcbiAgICAgICAgdmFyIGVuYWJsZWRFdmVudEhhbmRsZXJzID0gKF9lbmFibGVkRXZlbnRIYW5kbGVycyA9IHtcbiAgICAgICAgICAvLyBvbk1vdXNlTW92ZSBpcyB1c2VkIG92ZXIgb25Nb3VzZUVudGVyIGhlcmUuIG9uTW91c2VNb3ZlXG4gICAgICAgICAgLy8gaXMgb25seSB0cmlnZ2VyZWQgb24gYWN0dWFsIG1vdXNlIG1vdmVtZW50IHdoaWxlIG9uTW91c2VFbnRlclxuICAgICAgICAgIC8vIGNhbiBmaXJlIG9uIERPTSBjaGFuZ2VzLCBpbnRlcnJ1cHRpbmcga2V5Ym9hcmQgbmF2aWdhdGlvblxuICAgICAgICAgIG9uTW91c2VNb3ZlOiBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbk1vdXNlTW92ZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGluZGV4ID09PSBfdGhpcy5nZXRTdGF0ZSgpLmhpZ2hsaWdodGVkSW5kZXgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMuc2V0SGlnaGxpZ2h0ZWRJbmRleChpbmRleCwge1xuICAgICAgICAgICAgICB0eXBlOiBpdGVtTW91c2VFbnRlclxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFdlIG5ldmVyIHdhbnQgdG8gbWFudWFsbHkgc2Nyb2xsIHdoZW4gY2hhbmdpbmcgc3RhdGUgYmFzZWRcbiAgICAgICAgICAgIC8vIG9uIGBvbk1vdXNlTW92ZWAgYmVjYXVzZSB3ZSB3aWxsIGJlIG1vdmluZyB0aGUgZWxlbWVudCBvdXRcbiAgICAgICAgICAgIC8vIGZyb20gdW5kZXIgdGhlIHVzZXIgd2hpY2ggaXMgY3VycmVudGx5IHNjcm9sbGluZy9tb3ZpbmcgdGhlXG4gICAgICAgICAgICAvLyBjdXJzb3JcbiAgICAgICAgICAgIF90aGlzLmF2b2lkU2Nyb2xsaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIF90aGlzLmludGVybmFsU2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBfdGhpcy5hdm9pZFNjcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBvbk1vdXNlRG93bjogY2FsbEFsbEV2ZW50SGFuZGxlcnMob25Nb3VzZURvd24sIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgLy8gVGhpcyBwcmV2ZW50cyB0aGUgYWN0aXZlRWxlbWVudCBmcm9tIGJlaW5nIGNoYW5nZWRcbiAgICAgICAgICAgIC8vIHRvIHRoZSBpdGVtIHNvIGl0IGNhbiByZW1haW4gd2l0aCB0aGUgY3VycmVudCBhY3RpdmVFbGVtZW50XG4gICAgICAgICAgICAvLyB3aGljaCBpcyBhIG1vcmUgY29tbW9uIHVzZSBjYXNlLlxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9LCBfZW5hYmxlZEV2ZW50SGFuZGxlcnNbb25TZWxlY3RLZXldID0gY2FsbEFsbEV2ZW50SGFuZGxlcnMoY3VzdG9tQ2xpY2tIYW5kbGVyLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgX3RoaXMuc2VsZWN0SXRlbUF0SW5kZXgoaW5kZXgsIHtcbiAgICAgICAgICAgIHR5cGU6IGNsaWNrSXRlbVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KSwgX2VuYWJsZWRFdmVudEhhbmRsZXJzKTtcblxuICAgICAgICAvLyBQYXNzaW5nIGRvd24gdGhlIG9uTW91c2VEb3duIGhhbmRsZXIgdG8gcHJldmVudCByZWRpcmVjdFxuICAgICAgICAvLyBvZiB0aGUgYWN0aXZlRWxlbWVudCBpZiBjbGlja2luZyBvbiBkaXNhYmxlZCBpdGVtc1xuICAgICAgICB2YXIgZXZlbnRIYW5kbGVycyA9IHJlc3QuZGlzYWJsZWQgPyB7XG4gICAgICAgICAgb25Nb3VzZURvd246IGVuYWJsZWRFdmVudEhhbmRsZXJzLm9uTW91c2VEb3duXG4gICAgICAgIH0gOiBlbmFibGVkRXZlbnRIYW5kbGVycztcbiAgICAgICAgcmV0dXJuIF9leHRlbmRzKHtcbiAgICAgICAgICBpZDogX3RoaXMuZ2V0SXRlbUlkKGluZGV4KSxcbiAgICAgICAgICByb2xlOiAnb3B0aW9uJyxcbiAgICAgICAgICAnYXJpYS1zZWxlY3RlZCc6IF90aGlzLmdldFN0YXRlKCkuaGlnaGxpZ2h0ZWRJbmRleCA9PT0gaW5kZXhcbiAgICAgICAgfSwgZXZlbnRIYW5kbGVycywgcmVzdCk7XG4gICAgICB9O1xuICAgICAgLy9cXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIElURU1cbiAgICAgIF90aGlzLmNsZWFySXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzLml0ZW1zID0gW107XG4gICAgICB9O1xuICAgICAgX3RoaXMucmVzZXQgPSBmdW5jdGlvbiAob3RoZXJTdGF0ZVRvU2V0LCBjYikge1xuICAgICAgICBpZiAob3RoZXJTdGF0ZVRvU2V0ID09PSB2b2lkIDApIHtcbiAgICAgICAgICBvdGhlclN0YXRlVG9TZXQgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBvdGhlclN0YXRlVG9TZXQgPSBwaWNrU3RhdGUob3RoZXJTdGF0ZVRvU2V0KTtcbiAgICAgICAgX3RoaXMuaW50ZXJuYWxTZXRTdGF0ZShmdW5jdGlvbiAoX3JlZjgpIHtcbiAgICAgICAgICB2YXIgc2VsZWN0ZWRJdGVtID0gX3JlZjguc2VsZWN0ZWRJdGVtO1xuICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7XG4gICAgICAgICAgICBpc09wZW46IF90aGlzLnByb3BzLmRlZmF1bHRJc09wZW4sXG4gICAgICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBfdGhpcy5wcm9wcy5kZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgICAgICAgIGlucHV0VmFsdWU6IF90aGlzLnByb3BzLml0ZW1Ub1N0cmluZyhzZWxlY3RlZEl0ZW0pXG4gICAgICAgICAgfSwgb3RoZXJTdGF0ZVRvU2V0KTtcbiAgICAgICAgfSwgY2IpO1xuICAgICAgfTtcbiAgICAgIF90aGlzLnRvZ2dsZU1lbnUgPSBmdW5jdGlvbiAob3RoZXJTdGF0ZVRvU2V0LCBjYikge1xuICAgICAgICBpZiAob3RoZXJTdGF0ZVRvU2V0ID09PSB2b2lkIDApIHtcbiAgICAgICAgICBvdGhlclN0YXRlVG9TZXQgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBvdGhlclN0YXRlVG9TZXQgPSBwaWNrU3RhdGUob3RoZXJTdGF0ZVRvU2V0KTtcbiAgICAgICAgX3RoaXMuaW50ZXJuYWxTZXRTdGF0ZShmdW5jdGlvbiAoX3JlZjkpIHtcbiAgICAgICAgICB2YXIgaXNPcGVuID0gX3JlZjkuaXNPcGVuO1xuICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7XG4gICAgICAgICAgICBpc09wZW46ICFpc09wZW5cbiAgICAgICAgICB9LCBpc09wZW4gJiYge1xuICAgICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogX3RoaXMucHJvcHMuZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXhcbiAgICAgICAgICB9LCBvdGhlclN0YXRlVG9TZXQpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIF90aGlzJGdldFN0YXRlNyA9IF90aGlzLmdldFN0YXRlKCksXG4gICAgICAgICAgICBpc09wZW4gPSBfdGhpcyRnZXRTdGF0ZTcuaXNPcGVuLFxuICAgICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleCA9IF90aGlzJGdldFN0YXRlNy5oaWdobGlnaHRlZEluZGV4O1xuICAgICAgICAgIGlmIChpc09wZW4pIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5nZXRJdGVtQ291bnQoKSA+IDAgJiYgdHlwZW9mIGhpZ2hsaWdodGVkSW5kZXggPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgIF90aGlzLnNldEhpZ2hsaWdodGVkSW5kZXgoaGlnaGxpZ2h0ZWRJbmRleCwgb3RoZXJTdGF0ZVRvU2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY2JUb0NiKGNiKSgpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBfdGhpcy5vcGVuTWVudSA9IGZ1bmN0aW9uIChjYikge1xuICAgICAgICBfdGhpcy5pbnRlcm5hbFNldFN0YXRlKHtcbiAgICAgICAgICBpc09wZW46IHRydWVcbiAgICAgICAgfSwgY2IpO1xuICAgICAgfTtcbiAgICAgIF90aGlzLmNsb3NlTWVudSA9IGZ1bmN0aW9uIChjYikge1xuICAgICAgICBfdGhpcy5pbnRlcm5hbFNldFN0YXRlKHtcbiAgICAgICAgICBpc09wZW46IGZhbHNlXG4gICAgICAgIH0sIGNiKTtcbiAgICAgIH07XG4gICAgICBfdGhpcy51cGRhdGVTdGF0dXMgPSBkZWJvdW5jZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IF90aGlzLmdldFN0YXRlKCk7XG4gICAgICAgIHZhciBpdGVtID0gX3RoaXMuaXRlbXNbc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleF07XG4gICAgICAgIHZhciByZXN1bHRDb3VudCA9IF90aGlzLmdldEl0ZW1Db3VudCgpO1xuICAgICAgICB2YXIgc3RhdHVzID0gX3RoaXMucHJvcHMuZ2V0QTExeVN0YXR1c01lc3NhZ2UoX2V4dGVuZHMoe1xuICAgICAgICAgIGl0ZW1Ub1N0cmluZzogX3RoaXMucHJvcHMuaXRlbVRvU3RyaW5nLFxuICAgICAgICAgIHByZXZpb3VzUmVzdWx0Q291bnQ6IF90aGlzLnByZXZpb3VzUmVzdWx0Q291bnQsXG4gICAgICAgICAgcmVzdWx0Q291bnQ6IHJlc3VsdENvdW50LFxuICAgICAgICAgIGhpZ2hsaWdodGVkSXRlbTogaXRlbVxuICAgICAgICB9LCBzdGF0ZSkpO1xuICAgICAgICBfdGhpcy5wcmV2aW91c1Jlc3VsdENvdW50ID0gcmVzdWx0Q291bnQ7XG4gICAgICAgIHNldFN0YXR1cyhzdGF0dXMsIF90aGlzLnByb3BzLmVudmlyb25tZW50LmRvY3VtZW50KTtcbiAgICAgIH0sIDIwMCk7XG4gICAgICB2YXIgX3RoaXMkcHJvcHMgPSBfdGhpcy5wcm9wcyxcbiAgICAgICAgZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXggPSBfdGhpcyRwcm9wcy5kZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgICAgX3RoaXMkcHJvcHMkaW5pdGlhbEhpID0gX3RoaXMkcHJvcHMuaW5pdGlhbEhpZ2hsaWdodGVkSW5kZXgsXG4gICAgICAgIF9oaWdobGlnaHRlZEluZGV4ID0gX3RoaXMkcHJvcHMkaW5pdGlhbEhpID09PSB2b2lkIDAgPyBkZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleCA6IF90aGlzJHByb3BzJGluaXRpYWxIaSxcbiAgICAgICAgZGVmYXVsdElzT3BlbiA9IF90aGlzJHByb3BzLmRlZmF1bHRJc09wZW4sXG4gICAgICAgIF90aGlzJHByb3BzJGluaXRpYWxJcyA9IF90aGlzJHByb3BzLmluaXRpYWxJc09wZW4sXG4gICAgICAgIF9pc09wZW4gPSBfdGhpcyRwcm9wcyRpbml0aWFsSXMgPT09IHZvaWQgMCA/IGRlZmF1bHRJc09wZW4gOiBfdGhpcyRwcm9wcyRpbml0aWFsSXMsXG4gICAgICAgIF90aGlzJHByb3BzJGluaXRpYWxJbiA9IF90aGlzJHByb3BzLmluaXRpYWxJbnB1dFZhbHVlLFxuICAgICAgICBfaW5wdXRWYWx1ZSA9IF90aGlzJHByb3BzJGluaXRpYWxJbiA9PT0gdm9pZCAwID8gJycgOiBfdGhpcyRwcm9wcyRpbml0aWFsSW4sXG4gICAgICAgIF90aGlzJHByb3BzJGluaXRpYWxTZSA9IF90aGlzJHByb3BzLmluaXRpYWxTZWxlY3RlZEl0ZW0sXG4gICAgICAgIF9zZWxlY3RlZEl0ZW0gPSBfdGhpcyRwcm9wcyRpbml0aWFsU2UgPT09IHZvaWQgMCA/IG51bGwgOiBfdGhpcyRwcm9wcyRpbml0aWFsU2U7XG4gICAgICB2YXIgX3N0YXRlID0gX3RoaXMuZ2V0U3RhdGUoe1xuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBfaGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgICAgaXNPcGVuOiBfaXNPcGVuLFxuICAgICAgICBpbnB1dFZhbHVlOiBfaW5wdXRWYWx1ZSxcbiAgICAgICAgc2VsZWN0ZWRJdGVtOiBfc2VsZWN0ZWRJdGVtXG4gICAgICB9KTtcbiAgICAgIGlmIChfc3RhdGUuc2VsZWN0ZWRJdGVtICE9IG51bGwgJiYgX3RoaXMucHJvcHMuaW5pdGlhbElucHV0VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBfc3RhdGUuaW5wdXRWYWx1ZSA9IF90aGlzLnByb3BzLml0ZW1Ub1N0cmluZyhfc3RhdGUuc2VsZWN0ZWRJdGVtKTtcbiAgICAgIH1cbiAgICAgIF90aGlzLnN0YXRlID0gX3N0YXRlO1xuICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICB2YXIgX3Byb3RvID0gRG93bnNoaWZ0LnByb3RvdHlwZTtcbiAgICAvKipcbiAgICAgKiBDbGVhciBhbGwgcnVubmluZyB0aW1lb3V0c1xuICAgICAqL1xuICAgIF9wcm90by5pbnRlcm5hbENsZWFyVGltZW91dHMgPSBmdW5jdGlvbiBpbnRlcm5hbENsZWFyVGltZW91dHMoKSB7XG4gICAgICB0aGlzLnRpbWVvdXRJZHMuZm9yRWFjaChmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy50aW1lb3V0SWRzID0gW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgc3RhdGUgYmFzZWQgb24gaW50ZXJuYWwgc3RhdGUgb3IgcHJvcHNcbiAgICAgKiBJZiBhIHN0YXRlIHZhbHVlIGlzIHBhc3NlZCB2aWEgcHJvcHMsIHRoZW4gdGhhdFxuICAgICAqIGlzIHRoZSB2YWx1ZSBnaXZlbiwgb3RoZXJ3aXNlIGl0J3MgcmV0cmlldmVkIGZyb21cbiAgICAgKiBzdGF0ZVRvTWVyZ2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVRvTWVyZ2UgZGVmYXVsdHMgdG8gdGhpcy5zdGF0ZVxuICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhlIHN0YXRlXG4gICAgICovO1xuICAgIF9wcm90by5nZXRTdGF0ZSA9IGZ1bmN0aW9uIGdldFN0YXRlJDEoc3RhdGVUb01lcmdlKSB7XG4gICAgICBpZiAoc3RhdGVUb01lcmdlID09PSB2b2lkIDApIHtcbiAgICAgICAgc3RhdGVUb01lcmdlID0gdGhpcy5zdGF0ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBnZXRTdGF0ZShzdGF0ZVRvTWVyZ2UsIHRoaXMucHJvcHMpO1xuICAgIH07XG4gICAgX3Byb3RvLmdldEl0ZW1Db3VudCA9IGZ1bmN0aW9uIGdldEl0ZW1Db3VudCgpIHtcbiAgICAgIC8vIHRoaW5ncyByZWFkIGJldHRlciB0aGlzIHdheS4gVGhleSdyZSBpbiBwcmlvcml0eSBvcmRlcjpcbiAgICAgIC8vIDEuIGB0aGlzLml0ZW1Db3VudGBcbiAgICAgIC8vIDIuIGB0aGlzLnByb3BzLml0ZW1Db3VudGBcbiAgICAgIC8vIDMuIGB0aGlzLml0ZW1zLmxlbmd0aGBcbiAgICAgIHZhciBpdGVtQ291bnQgPSB0aGlzLml0ZW1zLmxlbmd0aDtcbiAgICAgIGlmICh0aGlzLml0ZW1Db3VudCAhPSBudWxsKSB7XG4gICAgICAgIGl0ZW1Db3VudCA9IHRoaXMuaXRlbUNvdW50O1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLml0ZW1Db3VudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGl0ZW1Db3VudCA9IHRoaXMucHJvcHMuaXRlbUNvdW50O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZW1Db3VudDtcbiAgICB9O1xuICAgIF9wcm90by5nZXRJdGVtTm9kZUZyb21JbmRleCA9IGZ1bmN0aW9uIGdldEl0ZW1Ob2RlRnJvbUluZGV4KGluZGV4KSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5lbnZpcm9ubWVudC5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmdldEl0ZW1JZChpbmRleCkpO1xuICAgIH07XG4gICAgX3Byb3RvLnNjcm9sbEhpZ2hsaWdodGVkSXRlbUludG9WaWV3ID0gZnVuY3Rpb24gc2Nyb2xsSGlnaGxpZ2h0ZWRJdGVtSW50b1ZpZXcoKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAocmVhY3QtbmF0aXZlKSAqL1xuICAgICAge1xuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuZ2V0SXRlbU5vZGVGcm9tSW5kZXgodGhpcy5nZXRTdGF0ZSgpLmhpZ2hsaWdodGVkSW5kZXgpO1xuICAgICAgICB0aGlzLnByb3BzLnNjcm9sbEludG9WaWV3KG5vZGUsIHRoaXMuX21lbnVOb2RlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIF9wcm90by5tb3ZlSGlnaGxpZ2h0ZWRJbmRleCA9IGZ1bmN0aW9uIG1vdmVIaWdobGlnaHRlZEluZGV4KGFtb3VudCwgb3RoZXJTdGF0ZVRvU2V0KSB7XG4gICAgICB2YXIgX3RoaXM2ID0gdGhpcztcbiAgICAgIHZhciBpdGVtQ291bnQgPSB0aGlzLmdldEl0ZW1Db3VudCgpO1xuICAgICAgdmFyIF90aGlzJGdldFN0YXRlOCA9IHRoaXMuZ2V0U3RhdGUoKSxcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleCA9IF90aGlzJGdldFN0YXRlOC5oaWdobGlnaHRlZEluZGV4O1xuICAgICAgaWYgKGl0ZW1Db3VudCA+IDApIHtcbiAgICAgICAgdmFyIG5leHRIaWdobGlnaHRlZEluZGV4ID0gZ2V0TmV4dFdyYXBwaW5nSW5kZXgoYW1vdW50LCBoaWdobGlnaHRlZEluZGV4LCBpdGVtQ291bnQsIGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgIHJldHVybiBfdGhpczYuZ2V0SXRlbU5vZGVGcm9tSW5kZXgoaW5kZXgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zZXRIaWdobGlnaHRlZEluZGV4KG5leHRIaWdobGlnaHRlZEluZGV4LCBvdGhlclN0YXRlVG9TZXQpO1xuICAgICAgfVxuICAgIH07XG4gICAgX3Byb3RvLmdldFN0YXRlQW5kSGVscGVycyA9IGZ1bmN0aW9uIGdldFN0YXRlQW5kSGVscGVycygpIHtcbiAgICAgIHZhciBfdGhpcyRnZXRTdGF0ZTkgPSB0aGlzLmdldFN0YXRlKCksXG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXggPSBfdGhpcyRnZXRTdGF0ZTkuaGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgICAgaW5wdXRWYWx1ZSA9IF90aGlzJGdldFN0YXRlOS5pbnB1dFZhbHVlLFxuICAgICAgICBzZWxlY3RlZEl0ZW0gPSBfdGhpcyRnZXRTdGF0ZTkuc2VsZWN0ZWRJdGVtLFxuICAgICAgICBpc09wZW4gPSBfdGhpcyRnZXRTdGF0ZTkuaXNPcGVuO1xuICAgICAgdmFyIGl0ZW1Ub1N0cmluZyA9IHRoaXMucHJvcHMuaXRlbVRvU3RyaW5nO1xuICAgICAgdmFyIGlkID0gdGhpcy5pZDtcbiAgICAgIHZhciBnZXRSb290UHJvcHMgPSB0aGlzLmdldFJvb3RQcm9wcyxcbiAgICAgICAgZ2V0VG9nZ2xlQnV0dG9uUHJvcHMgPSB0aGlzLmdldFRvZ2dsZUJ1dHRvblByb3BzLFxuICAgICAgICBnZXRMYWJlbFByb3BzID0gdGhpcy5nZXRMYWJlbFByb3BzLFxuICAgICAgICBnZXRNZW51UHJvcHMgPSB0aGlzLmdldE1lbnVQcm9wcyxcbiAgICAgICAgZ2V0SW5wdXRQcm9wcyA9IHRoaXMuZ2V0SW5wdXRQcm9wcyxcbiAgICAgICAgZ2V0SXRlbVByb3BzID0gdGhpcy5nZXRJdGVtUHJvcHMsXG4gICAgICAgIG9wZW5NZW51ID0gdGhpcy5vcGVuTWVudSxcbiAgICAgICAgY2xvc2VNZW51ID0gdGhpcy5jbG9zZU1lbnUsXG4gICAgICAgIHRvZ2dsZU1lbnUgPSB0aGlzLnRvZ2dsZU1lbnUsXG4gICAgICAgIHNlbGVjdEl0ZW0gPSB0aGlzLnNlbGVjdEl0ZW0sXG4gICAgICAgIHNlbGVjdEl0ZW1BdEluZGV4ID0gdGhpcy5zZWxlY3RJdGVtQXRJbmRleCxcbiAgICAgICAgc2VsZWN0SGlnaGxpZ2h0ZWRJdGVtID0gdGhpcy5zZWxlY3RIaWdobGlnaHRlZEl0ZW0sXG4gICAgICAgIHNldEhpZ2hsaWdodGVkSW5kZXggPSB0aGlzLnNldEhpZ2hsaWdodGVkSW5kZXgsXG4gICAgICAgIGNsZWFyU2VsZWN0aW9uID0gdGhpcy5jbGVhclNlbGVjdGlvbixcbiAgICAgICAgY2xlYXJJdGVtcyA9IHRoaXMuY2xlYXJJdGVtcyxcbiAgICAgICAgcmVzZXQgPSB0aGlzLnJlc2V0LFxuICAgICAgICBzZXRJdGVtQ291bnQgPSB0aGlzLnNldEl0ZW1Db3VudCxcbiAgICAgICAgdW5zZXRJdGVtQ291bnQgPSB0aGlzLnVuc2V0SXRlbUNvdW50LFxuICAgICAgICBzZXRTdGF0ZSA9IHRoaXMuaW50ZXJuYWxTZXRTdGF0ZTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8vIHByb3AgZ2V0dGVyc1xuICAgICAgICBnZXRSb290UHJvcHM6IGdldFJvb3RQcm9wcyxcbiAgICAgICAgZ2V0VG9nZ2xlQnV0dG9uUHJvcHM6IGdldFRvZ2dsZUJ1dHRvblByb3BzLFxuICAgICAgICBnZXRMYWJlbFByb3BzOiBnZXRMYWJlbFByb3BzLFxuICAgICAgICBnZXRNZW51UHJvcHM6IGdldE1lbnVQcm9wcyxcbiAgICAgICAgZ2V0SW5wdXRQcm9wczogZ2V0SW5wdXRQcm9wcyxcbiAgICAgICAgZ2V0SXRlbVByb3BzOiBnZXRJdGVtUHJvcHMsXG4gICAgICAgIC8vIGFjdGlvbnNcbiAgICAgICAgcmVzZXQ6IHJlc2V0LFxuICAgICAgICBvcGVuTWVudTogb3Blbk1lbnUsXG4gICAgICAgIGNsb3NlTWVudTogY2xvc2VNZW51LFxuICAgICAgICB0b2dnbGVNZW51OiB0b2dnbGVNZW51LFxuICAgICAgICBzZWxlY3RJdGVtOiBzZWxlY3RJdGVtLFxuICAgICAgICBzZWxlY3RJdGVtQXRJbmRleDogc2VsZWN0SXRlbUF0SW5kZXgsXG4gICAgICAgIHNlbGVjdEhpZ2hsaWdodGVkSXRlbTogc2VsZWN0SGlnaGxpZ2h0ZWRJdGVtLFxuICAgICAgICBzZXRIaWdobGlnaHRlZEluZGV4OiBzZXRIaWdobGlnaHRlZEluZGV4LFxuICAgICAgICBjbGVhclNlbGVjdGlvbjogY2xlYXJTZWxlY3Rpb24sXG4gICAgICAgIGNsZWFySXRlbXM6IGNsZWFySXRlbXMsXG4gICAgICAgIHNldEl0ZW1Db3VudDogc2V0SXRlbUNvdW50LFxuICAgICAgICB1bnNldEl0ZW1Db3VudDogdW5zZXRJdGVtQ291bnQsXG4gICAgICAgIHNldFN0YXRlOiBzZXRTdGF0ZSxcbiAgICAgICAgLy8gcHJvcHNcbiAgICAgICAgaXRlbVRvU3RyaW5nOiBpdGVtVG9TdHJpbmcsXG4gICAgICAgIC8vIGRlcml2ZWRcbiAgICAgICAgaWQ6IGlkLFxuICAgICAgICAvLyBzdGF0ZVxuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBoaWdobGlnaHRlZEluZGV4LFxuICAgICAgICBpbnB1dFZhbHVlOiBpbnB1dFZhbHVlLFxuICAgICAgICBpc09wZW46IGlzT3BlbixcbiAgICAgICAgc2VsZWN0ZWRJdGVtOiBzZWxlY3RlZEl0ZW1cbiAgICAgIH07XG4gICAgfTtcbiAgICBfcHJvdG8uY29tcG9uZW50RGlkTW91bnQgPSBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIHZhciBfdGhpczcgPSB0aGlzO1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmIChyZWFjdC1uYXRpdmUpICovXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiAhZmFsc2UgJiYgdGhpcy5nZXRNZW51UHJvcHMuY2FsbGVkICYmICF0aGlzLmdldE1lbnVQcm9wcy5zdXBwcmVzc1JlZkVycm9yKSB7XG4gICAgICAgIHZhbGlkYXRlR2V0TWVudVByb3BzQ2FsbGVkQ29ycmVjdGx5KHRoaXMuX21lbnVOb2RlLCB0aGlzLmdldE1lbnVQcm9wcyk7XG4gICAgICB9XG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAocmVhY3QtbmF0aXZlKSAqL1xuICAgICAge1xuICAgICAgICAvLyB0aGlzLmlzTW91c2VEb3duIGhlbHBzIHVzIHRyYWNrIHdoZXRoZXIgdGhlIG1vdXNlIGlzIGN1cnJlbnRseSBoZWxkIGRvd24uXG4gICAgICAgIC8vIFRoaXMgaXMgdXNlZnVsIHdoZW4gdGhlIHVzZXIgY2xpY2tzIG9uIGFuIGl0ZW0gaW4gdGhlIGxpc3QsIGJ1dCBob2xkcyB0aGUgbW91c2VcbiAgICAgICAgLy8gZG93biBsb25nIGVub3VnaCBmb3IgdGhlIGxpc3QgdG8gZGlzYXBwZWFyIChiZWNhdXNlIHRoZSBibHVyIGV2ZW50IGZpcmVzIG9uIHRoZSBpbnB1dClcbiAgICAgICAgLy8gdGhpcy5pc01vdXNlRG93biBpcyB1c2VkIGluIHRoZSBibHVyIGhhbmRsZXIgb24gdGhlIGlucHV0IHRvIGRldGVybWluZSB3aGV0aGVyIHRoZSBibHVyIGV2ZW50IHNob3VsZFxuICAgICAgICAvLyB0cmlnZ2VyIGhpZGluZyB0aGUgbWVudS5cbiAgICAgICAgdmFyIG9uTW91c2VEb3duID0gZnVuY3Rpb24gb25Nb3VzZURvd24oKSB7XG4gICAgICAgICAgX3RoaXM3LmlzTW91c2VEb3duID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG9uTW91c2VVcCA9IGZ1bmN0aW9uIG9uTW91c2VVcChldmVudCkge1xuICAgICAgICAgIF90aGlzNy5pc01vdXNlRG93biA9IGZhbHNlO1xuICAgICAgICAgIC8vIGlmIHRoZSB0YXJnZXQgZWxlbWVudCBvciB0aGUgYWN0aXZlRWxlbWVudCBpcyB3aXRoaW4gYSBkb3duc2hpZnQgbm9kZVxuICAgICAgICAgIC8vIHRoZW4gd2UgZG9uJ3Qgd2FudCB0byByZXNldCBkb3duc2hpZnRcbiAgICAgICAgICB2YXIgY29udGV4dFdpdGhpbkRvd25zaGlmdCA9IHRhcmdldFdpdGhpbkRvd25zaGlmdChldmVudC50YXJnZXQsIFtfdGhpczcuX3Jvb3ROb2RlLCBfdGhpczcuX21lbnVOb2RlXSwgX3RoaXM3LnByb3BzLmVudmlyb25tZW50KTtcbiAgICAgICAgICBpZiAoIWNvbnRleHRXaXRoaW5Eb3duc2hpZnQgJiYgX3RoaXM3LmdldFN0YXRlKCkuaXNPcGVuKSB7XG4gICAgICAgICAgICBfdGhpczcucmVzZXQoe1xuICAgICAgICAgICAgICB0eXBlOiBtb3VzZVVwXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBfdGhpczcucHJvcHMub25PdXRlckNsaWNrKF90aGlzNy5nZXRTdGF0ZUFuZEhlbHBlcnMoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8vIFRvdWNoaW5nIGFuIGVsZW1lbnQgaW4gaU9TIGdpdmVzIGZvY3VzIGFuZCBob3ZlciBzdGF0ZXMsIGJ1dCB0b3VjaGluZyBvdXQgb2ZcbiAgICAgICAgLy8gdGhlIGVsZW1lbnQgd2lsbCByZW1vdmUgaG92ZXIsIGFuZCBwZXJzaXN0IHRoZSBmb2N1cyBzdGF0ZSwgcmVzdWx0aW5nIGluIHRoZVxuICAgICAgICAvLyBibHVyIGV2ZW50IG5vdCBiZWluZyB0cmlnZ2VyZWQuXG4gICAgICAgIC8vIHRoaXMuaXNUb3VjaE1vdmUgaGVscHMgdXMgdHJhY2sgd2hldGhlciB0aGUgdXNlciBpcyB0YXBwaW5nIG9yIHN3aXBpbmcgb24gYSB0b3VjaCBzY3JlZW4uXG4gICAgICAgIC8vIElmIHRoZSB1c2VyIHRhcHMgb3V0c2lkZSBvZiBEb3duc2hpZnQsIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIHJlc2V0LFxuICAgICAgICAvLyBidXQgbm90IGlmIHRoZSB1c2VyIGlzIHN3aXBpbmdcbiAgICAgICAgdmFyIG9uVG91Y2hTdGFydCA9IGZ1bmN0aW9uIG9uVG91Y2hTdGFydCgpIHtcbiAgICAgICAgICBfdGhpczcuaXNUb3VjaE1vdmUgPSBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG9uVG91Y2hNb3ZlID0gZnVuY3Rpb24gb25Ub3VjaE1vdmUoKSB7XG4gICAgICAgICAgX3RoaXM3LmlzVG91Y2hNb3ZlID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG9uVG91Y2hFbmQgPSBmdW5jdGlvbiBvblRvdWNoRW5kKGV2ZW50KSB7XG4gICAgICAgICAgdmFyIGNvbnRleHRXaXRoaW5Eb3duc2hpZnQgPSB0YXJnZXRXaXRoaW5Eb3duc2hpZnQoZXZlbnQudGFyZ2V0LCBbX3RoaXM3Ll9yb290Tm9kZSwgX3RoaXM3Ll9tZW51Tm9kZV0sIF90aGlzNy5wcm9wcy5lbnZpcm9ubWVudCwgZmFsc2UpO1xuICAgICAgICAgIGlmICghX3RoaXM3LmlzVG91Y2hNb3ZlICYmICFjb250ZXh0V2l0aGluRG93bnNoaWZ0ICYmIF90aGlzNy5nZXRTdGF0ZSgpLmlzT3Blbikge1xuICAgICAgICAgICAgX3RoaXM3LnJlc2V0KHtcbiAgICAgICAgICAgICAgdHlwZTogdG91Y2hFbmRcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzNy5wcm9wcy5vbk91dGVyQ2xpY2soX3RoaXM3LmdldFN0YXRlQW5kSGVscGVycygpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGVudmlyb25tZW50ID0gdGhpcy5wcm9wcy5lbnZpcm9ubWVudDtcbiAgICAgICAgZW52aXJvbm1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Nb3VzZURvd24pO1xuICAgICAgICBlbnZpcm9ubWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKTtcbiAgICAgICAgZW52aXJvbm1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uVG91Y2hTdGFydCk7XG4gICAgICAgIGVudmlyb25tZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uVG91Y2hNb3ZlKTtcbiAgICAgICAgZW52aXJvbm1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoRW5kKTtcbiAgICAgICAgdGhpcy5jbGVhbnVwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIF90aGlzNy5pbnRlcm5hbENsZWFyVGltZW91dHMoKTtcbiAgICAgICAgICBfdGhpczcudXBkYXRlU3RhdHVzLmNhbmNlbCgpO1xuICAgICAgICAgIGVudmlyb25tZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duKTtcbiAgICAgICAgICBlbnZpcm9ubWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKTtcbiAgICAgICAgICBlbnZpcm9ubWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25Ub3VjaFN0YXJ0KTtcbiAgICAgICAgICBlbnZpcm9ubWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvblRvdWNoTW92ZSk7XG4gICAgICAgICAgZW52aXJvbm1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoRW5kKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICAgIF9wcm90by5zaG91bGRTY3JvbGwgPSBmdW5jdGlvbiBzaG91bGRTY3JvbGwocHJldlN0YXRlLCBwcmV2UHJvcHMpIHtcbiAgICAgIHZhciBfcmVmMTAgPSB0aGlzLnByb3BzLmhpZ2hsaWdodGVkSW5kZXggPT09IHVuZGVmaW5lZCA/IHRoaXMuZ2V0U3RhdGUoKSA6IHRoaXMucHJvcHMsXG4gICAgICAgIGN1cnJlbnRIaWdobGlnaHRlZEluZGV4ID0gX3JlZjEwLmhpZ2hsaWdodGVkSW5kZXg7XG4gICAgICB2YXIgX3JlZjExID0gcHJldlByb3BzLmhpZ2hsaWdodGVkSW5kZXggPT09IHVuZGVmaW5lZCA/IHByZXZTdGF0ZSA6IHByZXZQcm9wcyxcbiAgICAgICAgcHJldkhpZ2hsaWdodGVkSW5kZXggPSBfcmVmMTEuaGlnaGxpZ2h0ZWRJbmRleDtcbiAgICAgIHZhciBzY3JvbGxXaGVuT3BlbiA9IGN1cnJlbnRIaWdobGlnaHRlZEluZGV4ICYmIHRoaXMuZ2V0U3RhdGUoKS5pc09wZW4gJiYgIXByZXZTdGF0ZS5pc09wZW47XG4gICAgICB2YXIgc2Nyb2xsV2hlbk5hdmlnYXRpbmcgPSBjdXJyZW50SGlnaGxpZ2h0ZWRJbmRleCAhPT0gcHJldkhpZ2hsaWdodGVkSW5kZXg7XG4gICAgICByZXR1cm4gc2Nyb2xsV2hlbk9wZW4gfHwgc2Nyb2xsV2hlbk5hdmlnYXRpbmc7XG4gICAgfTtcbiAgICBfcHJvdG8uY29tcG9uZW50RGlkVXBkYXRlID0gZnVuY3Rpb24gY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICB2YWxpZGF0ZUNvbnRyb2xsZWRVbmNoYW5nZWQodGhpcy5zdGF0ZSwgcHJldlByb3BzLCB0aGlzLnByb3BzKTtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmIChyZWFjdC1uYXRpdmUpICovXG4gICAgICAgIGlmICh0aGlzLmdldE1lbnVQcm9wcy5jYWxsZWQgJiYgIXRoaXMuZ2V0TWVudVByb3BzLnN1cHByZXNzUmVmRXJyb3IpIHtcbiAgICAgICAgICB2YWxpZGF0ZUdldE1lbnVQcm9wc0NhbGxlZENvcnJlY3RseSh0aGlzLl9tZW51Tm9kZSwgdGhpcy5nZXRNZW51UHJvcHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNDb250cm9sbGVkUHJvcCh0aGlzLnByb3BzLCAnc2VsZWN0ZWRJdGVtJykgJiYgdGhpcy5wcm9wcy5zZWxlY3RlZEl0ZW1DaGFuZ2VkKHByZXZQcm9wcy5zZWxlY3RlZEl0ZW0sIHRoaXMucHJvcHMuc2VsZWN0ZWRJdGVtKSkge1xuICAgICAgICB0aGlzLmludGVybmFsU2V0U3RhdGUoe1xuICAgICAgICAgIHR5cGU6IGNvbnRyb2xsZWRQcm9wVXBkYXRlZFNlbGVjdGVkSXRlbSxcbiAgICAgICAgICBpbnB1dFZhbHVlOiB0aGlzLnByb3BzLml0ZW1Ub1N0cmluZyh0aGlzLnByb3BzLnNlbGVjdGVkSXRlbSlcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuYXZvaWRTY3JvbGxpbmcgJiYgdGhpcy5zaG91bGRTY3JvbGwocHJldlN0YXRlLCBwcmV2UHJvcHMpKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsSGlnaGxpZ2h0ZWRJdGVtSW50b1ZpZXcoKTtcbiAgICAgIH1cblxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKHJlYWN0LW5hdGl2ZSkgKi9cbiAgICAgIHtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0dXMoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIF9wcm90by5jb21wb25lbnRXaWxsVW5tb3VudCA9IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgdGhpcy5jbGVhbnVwKCk7IC8vIGF2b2lkcyBtZW1vcnkgbGVha1xuICAgIH07XG4gICAgX3Byb3RvLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIHZhciBjaGlsZHJlbiA9IHVud3JhcEFycmF5KHRoaXMucHJvcHMuY2hpbGRyZW4sIG5vb3ApO1xuICAgICAgLy8gYmVjYXVzZSB0aGUgaXRlbXMgYXJlIHJlcmVuZGVyZWQgZXZlcnkgdGltZSB3ZSBjYWxsIHRoZSBjaGlsZHJlblxuICAgICAgLy8gd2UgY2xlYXIgdGhpcyBvdXQgZWFjaCByZW5kZXIgYW5kIGl0IHdpbGwgYmUgcG9wdWxhdGVkIGFnYWluIGFzXG4gICAgICAvLyBnZXRJdGVtUHJvcHMgaXMgY2FsbGVkLlxuICAgICAgdGhpcy5jbGVhckl0ZW1zKCk7XG4gICAgICAvLyB3ZSByZXNldCB0aGlzIHNvIHdlIGtub3cgd2hldGhlciB0aGUgdXNlciBjYWxscyBnZXRSb290UHJvcHMgZHVyaW5nXG4gICAgICAvLyB0aGlzIHJlbmRlci4gSWYgdGhleSBkbyB0aGVuIHdlIGRvbid0IG5lZWQgdG8gZG8gYW55dGhpbmcsXG4gICAgICAvLyBpZiB0aGV5IGRvbid0IHRoZW4gd2UgbmVlZCB0byBjbG9uZSB0aGUgZWxlbWVudCB0aGV5IHJldHVybiBhbmRcbiAgICAgIC8vIGFwcGx5IHRoZSBwcm9wcyBmb3IgdGhlbS5cbiAgICAgIHRoaXMuZ2V0Um9vdFByb3BzLmNhbGxlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5nZXRSb290UHJvcHMucmVmS2V5ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5nZXRSb290UHJvcHMuc3VwcHJlc3NSZWZFcnJvciA9IHVuZGVmaW5lZDtcbiAgICAgIC8vIHdlIGRvIHNvbWV0aGluZyBzaW1pbGFyIGZvciBnZXRNZW51UHJvcHNcbiAgICAgIHRoaXMuZ2V0TWVudVByb3BzLmNhbGxlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5nZXRNZW51UHJvcHMucmVmS2V5ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5nZXRNZW51UHJvcHMuc3VwcHJlc3NSZWZFcnJvciA9IHVuZGVmaW5lZDtcbiAgICAgIC8vIHdlIGRvIHNvbWV0aGluZyBzaW1pbGFyIGZvciBnZXRMYWJlbFByb3BzXG4gICAgICB0aGlzLmdldExhYmVsUHJvcHMuY2FsbGVkID0gZmFsc2U7XG4gICAgICAvLyBhbmQgc29tZXRoaW5nIHNpbWlsYXIgZm9yIGdldElucHV0UHJvcHNcbiAgICAgIHRoaXMuZ2V0SW5wdXRQcm9wcy5jYWxsZWQgPSBmYWxzZTtcbiAgICAgIHZhciBlbGVtZW50ID0gdW53cmFwQXJyYXkoY2hpbGRyZW4odGhpcy5nZXRTdGF0ZUFuZEhlbHBlcnMoKSkpO1xuICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZ2V0Um9vdFByb3BzLmNhbGxlZCB8fCB0aGlzLnByb3BzLnN1cHByZXNzUmVmRXJyb3IpIHtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgIXRoaXMuZ2V0Um9vdFByb3BzLnN1cHByZXNzUmVmRXJyb3IgJiYgIXRoaXMucHJvcHMuc3VwcHJlc3NSZWZFcnJvcikge1xuICAgICAgICAgIHZhbGlkYXRlR2V0Um9vdFByb3BzQ2FsbGVkQ29ycmVjdGx5KGVsZW1lbnQsIHRoaXMuZ2V0Um9vdFByb3BzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgIH0gZWxzZSBpZiAoaXNET01FbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgICAgIC8vIHRoZXkgZGlkbid0IGFwcGx5IHRoZSByb290IHByb3BzLCBidXQgd2UgY2FuIGNsb25lXG4gICAgICAgIC8vIHRoaXMgYW5kIGFwcGx5IHRoZSBwcm9wcyBvdXJzZWx2ZXNcbiAgICAgICAgcmV0dXJuIC8qI19fUFVSRV9fKi9jbG9uZUVsZW1lbnQoZWxlbWVudCwgdGhpcy5nZXRSb290UHJvcHMoZ2V0RWxlbWVudFByb3BzKGVsZW1lbnQpKSk7XG4gICAgICB9XG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAvLyB0aGV5IGRpZG4ndCBhcHBseSB0aGUgcm9vdCBwcm9wcywgYnV0IHRoZXkgbmVlZCB0b1xuICAgICAgICAvLyBvdGhlcndpc2Ugd2UgY2FuJ3QgcXVlcnkgYXJvdW5kIHRoZSBhdXRvY29tcGxldGVcblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Rvd25zaGlmdDogSWYgeW91IHJldHVybiBhIG5vbi1ET00gZWxlbWVudCwgeW91IG11c3QgYXBwbHkgdGhlIGdldFJvb3RQcm9wcyBmdW5jdGlvbicpO1xuICAgICAgfVxuXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIHJldHVybiBEb3duc2hpZnQ7XG4gIH0oQ29tcG9uZW50KTtcbiAgRG93bnNoaWZ0LmRlZmF1bHRQcm9wcyA9IHtcbiAgICBkZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleDogbnVsbCxcbiAgICBkZWZhdWx0SXNPcGVuOiBmYWxzZSxcbiAgICBnZXRBMTF5U3RhdHVzTWVzc2FnZTogZ2V0QTExeVN0YXR1c01lc3NhZ2UkMSxcbiAgICBpdGVtVG9TdHJpbmc6IGZ1bmN0aW9uIGl0ZW1Ub1N0cmluZyhpKSB7XG4gICAgICBpZiAoaSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIGlzUGxhaW5PYmplY3QoaSkgJiYgIWkuaGFzT3duUHJvcGVydHkoJ3RvU3RyaW5nJykpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgY29uc29sZS53YXJuKCdkb3duc2hpZnQ6IEFuIG9iamVjdCB3YXMgcGFzc2VkIHRvIHRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIGBpdGVtVG9TdHJpbmdgLiBZb3Ugc2hvdWxkIHByb2JhYmx5IHByb3ZpZGUgeW91ciBvd24gYGl0ZW1Ub1N0cmluZ2AgaW1wbGVtZW50YXRpb24uIFBsZWFzZSByZWZlciB0byB0aGUgYGl0ZW1Ub1N0cmluZ2AgQVBJIGRvY3VtZW50YXRpb24uJywgJ1RoZSBvYmplY3QgdGhhdCB3YXMgcGFzc2VkOicsIGkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFN0cmluZyhpKTtcbiAgICB9LFxuICAgIG9uU3RhdGVDaGFuZ2U6IG5vb3AsXG4gICAgb25JbnB1dFZhbHVlQ2hhbmdlOiBub29wLFxuICAgIG9uVXNlckFjdGlvbjogbm9vcCxcbiAgICBvbkNoYW5nZTogbm9vcCxcbiAgICBvblNlbGVjdDogbm9vcCxcbiAgICBvbk91dGVyQ2xpY2s6IG5vb3AsXG4gICAgc2VsZWN0ZWRJdGVtQ2hhbmdlZDogZnVuY3Rpb24gc2VsZWN0ZWRJdGVtQ2hhbmdlZChwcmV2SXRlbSwgaXRlbSkge1xuICAgICAgcmV0dXJuIHByZXZJdGVtICE9PSBpdGVtO1xuICAgIH0sXG4gICAgZW52aXJvbm1lbnQ6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0IChzc3IpICovXG4gICAgdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyB7fSA6IHdpbmRvdyxcbiAgICBzdGF0ZVJlZHVjZXI6IGZ1bmN0aW9uIHN0YXRlUmVkdWNlcihzdGF0ZSwgc3RhdGVUb1NldCkge1xuICAgICAgcmV0dXJuIHN0YXRlVG9TZXQ7XG4gICAgfSxcbiAgICBzdXBwcmVzc1JlZkVycm9yOiBmYWxzZSxcbiAgICBzY3JvbGxJbnRvVmlldzogc2Nyb2xsSW50b1ZpZXdcbiAgfTtcbiAgRG93bnNoaWZ0LnN0YXRlQ2hhbmdlVHlwZXMgPSBzdGF0ZUNoYW5nZVR5cGVzJDM7XG4gIHJldHVybiBEb3duc2hpZnQ7XG59KCk7XG5wcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyBEb3duc2hpZnQucHJvcFR5cGVzID0ge1xuICBjaGlsZHJlbjogUHJvcFR5cGVzLmZ1bmMsXG4gIGRlZmF1bHRIaWdobGlnaHRlZEluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICBkZWZhdWx0SXNPcGVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgaW5pdGlhbEhpZ2hsaWdodGVkSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gIGluaXRpYWxTZWxlY3RlZEl0ZW06IFByb3BUeXBlcy5hbnksXG4gIGluaXRpYWxJbnB1dFZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBpbml0aWFsSXNPcGVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgZ2V0QTExeVN0YXR1c01lc3NhZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBpdGVtVG9TdHJpbmc6IFByb3BUeXBlcy5mdW5jLFxuICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uU2VsZWN0OiBQcm9wVHlwZXMuZnVuYyxcbiAgb25TdGF0ZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uSW5wdXRWYWx1ZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uVXNlckFjdGlvbjogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uT3V0ZXJDbGljazogUHJvcFR5cGVzLmZ1bmMsXG4gIHNlbGVjdGVkSXRlbUNoYW5nZWQ6IFByb3BUeXBlcy5mdW5jLFxuICBzdGF0ZVJlZHVjZXI6IFByb3BUeXBlcy5mdW5jLFxuICBpdGVtQ291bnQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBlbnZpcm9ubWVudDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICBhZGRFdmVudExpc3RlbmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICByZW1vdmVFdmVudExpc3RlbmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBkb2N1bWVudDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGdldEVsZW1lbnRCeUlkOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgIGFjdGl2ZUVsZW1lbnQ6IFByb3BUeXBlcy5hbnksXG4gICAgICBib2R5OiBQcm9wVHlwZXMuYW55XG4gICAgfSlcbiAgfSksXG4gIHN1cHByZXNzUmVmRXJyb3I6IFByb3BUeXBlcy5ib29sLFxuICBzY3JvbGxJbnRvVmlldzogUHJvcFR5cGVzLmZ1bmMsXG4gIC8vIHRoaW5ncyB3ZSBrZWVwIGluIHN0YXRlIGZvciB1bmNvbnRyb2xsZWQgY29tcG9uZW50c1xuICAvLyBidXQgY2FuIGFjY2VwdCBhcyBwcm9wcyBmb3IgY29udHJvbGxlZCBjb21wb25lbnRzXG4gIC8qIGVzbGludC1kaXNhYmxlIHJlYWN0L25vLXVudXNlZC1wcm9wLXR5cGVzICovXG4gIHNlbGVjdGVkSXRlbTogUHJvcFR5cGVzLmFueSxcbiAgaXNPcGVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgaW5wdXRWYWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaGlnaGxpZ2h0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgbGFiZWxJZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgaW5wdXRJZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgbWVudUlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBnZXRJdGVtSWQ6IFByb3BUeXBlcy5mdW5jXG4gIC8qIGVzbGludC1lbmFibGUgcmVhY3Qvbm8tdW51c2VkLXByb3AtdHlwZXMgKi9cbn0gOiB2b2lkIDA7XG52YXIgRG93bnNoaWZ0JDEgPSBEb3duc2hpZnQ7XG5mdW5jdGlvbiB2YWxpZGF0ZUdldE1lbnVQcm9wc0NhbGxlZENvcnJlY3RseShub2RlLCBfcmVmMTIpIHtcbiAgdmFyIHJlZktleSA9IF9yZWYxMi5yZWZLZXk7XG4gIGlmICghbm9kZSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5lcnJvcihcImRvd25zaGlmdDogVGhlIHJlZiBwcm9wIFxcXCJcIiArIHJlZktleSArIFwiXFxcIiBmcm9tIGdldE1lbnVQcm9wcyB3YXMgbm90IGFwcGxpZWQgY29ycmVjdGx5IG9uIHlvdXIgbWVudSBlbGVtZW50LlwiKTtcbiAgfVxufVxuZnVuY3Rpb24gdmFsaWRhdGVHZXRSb290UHJvcHNDYWxsZWRDb3JyZWN0bHkoZWxlbWVudCwgX3JlZjEzKSB7XG4gIHZhciByZWZLZXkgPSBfcmVmMTMucmVmS2V5O1xuICB2YXIgcmVmS2V5U3BlY2lmaWVkID0gcmVmS2V5ICE9PSAncmVmJztcbiAgdmFyIGlzQ29tcG9zaXRlID0gIWlzRE9NRWxlbWVudChlbGVtZW50KTtcbiAgaWYgKGlzQ29tcG9zaXRlICYmICFyZWZLZXlTcGVjaWZpZWQgJiYgIWlzRm9yd2FyZFJlZihlbGVtZW50KSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5lcnJvcignZG93bnNoaWZ0OiBZb3UgcmV0dXJuZWQgYSBub24tRE9NIGVsZW1lbnQuIFlvdSBtdXN0IHNwZWNpZnkgYSByZWZLZXkgaW4gZ2V0Um9vdFByb3BzJyk7XG4gIH0gZWxzZSBpZiAoIWlzQ29tcG9zaXRlICYmIHJlZktleVNwZWNpZmllZCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5lcnJvcihcImRvd25zaGlmdDogWW91IHJldHVybmVkIGEgRE9NIGVsZW1lbnQuIFlvdSBzaG91bGQgbm90IHNwZWNpZnkgYSByZWZLZXkgaW4gZ2V0Um9vdFByb3BzLiBZb3Ugc3BlY2lmaWVkIFxcXCJcIiArIHJlZktleSArIFwiXFxcIlwiKTtcbiAgfVxuICBpZiAoIWlzRm9yd2FyZFJlZihlbGVtZW50KSAmJiAhZ2V0RWxlbWVudFByb3BzKGVsZW1lbnQpW3JlZktleV0pIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUuZXJyb3IoXCJkb3duc2hpZnQ6IFlvdSBtdXN0IGFwcGx5IHRoZSByZWYgcHJvcCBcXFwiXCIgKyByZWZLZXkgKyBcIlxcXCIgZnJvbSBnZXRSb290UHJvcHMgb250byB5b3VyIHJvb3QgZWxlbWVudC5cIik7XG4gIH1cbn1cblxudmFyIF9leGNsdWRlZCQzID0gW1wiaXNJbml0aWFsTW91bnRcIiwgXCJoaWdobGlnaHRlZEluZGV4XCIsIFwiaXRlbXNcIiwgXCJlbnZpcm9ubWVudFwiXTtcbnZhciBkcm9wZG93bkRlZmF1bHRTdGF0ZVZhbHVlcyA9IHtcbiAgaGlnaGxpZ2h0ZWRJbmRleDogLTEsXG4gIGlzT3BlbjogZmFsc2UsXG4gIHNlbGVjdGVkSXRlbTogbnVsbCxcbiAgaW5wdXRWYWx1ZTogJydcbn07XG5mdW5jdGlvbiBjYWxsT25DaGFuZ2VQcm9wcyhhY3Rpb24sIHN0YXRlLCBuZXdTdGF0ZSkge1xuICB2YXIgcHJvcHMgPSBhY3Rpb24ucHJvcHMsXG4gICAgdHlwZSA9IGFjdGlvbi50eXBlO1xuICB2YXIgY2hhbmdlcyA9IHt9O1xuICBPYmplY3Qua2V5cyhzdGF0ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgaW52b2tlT25DaGFuZ2VIYW5kbGVyKGtleSwgYWN0aW9uLCBzdGF0ZSwgbmV3U3RhdGUpO1xuICAgIGlmIChuZXdTdGF0ZVtrZXldICE9PSBzdGF0ZVtrZXldKSB7XG4gICAgICBjaGFuZ2VzW2tleV0gPSBuZXdTdGF0ZVtrZXldO1xuICAgIH1cbiAgfSk7XG4gIGlmIChwcm9wcy5vblN0YXRlQ2hhbmdlICYmIE9iamVjdC5rZXlzKGNoYW5nZXMpLmxlbmd0aCkge1xuICAgIHByb3BzLm9uU3RhdGVDaGFuZ2UoX2V4dGVuZHMoe1xuICAgICAgdHlwZTogdHlwZVxuICAgIH0sIGNoYW5nZXMpKTtcbiAgfVxufVxuZnVuY3Rpb24gaW52b2tlT25DaGFuZ2VIYW5kbGVyKGtleSwgYWN0aW9uLCBzdGF0ZSwgbmV3U3RhdGUpIHtcbiAgdmFyIHByb3BzID0gYWN0aW9uLnByb3BzLFxuICAgIHR5cGUgPSBhY3Rpb24udHlwZTtcbiAgdmFyIGhhbmRsZXIgPSBcIm9uXCIgKyBjYXBpdGFsaXplU3RyaW5nKGtleSkgKyBcIkNoYW5nZVwiO1xuICBpZiAocHJvcHNbaGFuZGxlcl0gJiYgbmV3U3RhdGVba2V5XSAhPT0gdW5kZWZpbmVkICYmIG5ld1N0YXRlW2tleV0gIT09IHN0YXRlW2tleV0pIHtcbiAgICBwcm9wc1toYW5kbGVyXShfZXh0ZW5kcyh7XG4gICAgICB0eXBlOiB0eXBlXG4gICAgfSwgbmV3U3RhdGUpKTtcbiAgfVxufVxuXG4vKipcbiAqIERlZmF1bHQgc3RhdGUgcmVkdWNlciB0aGF0IHJldHVybnMgdGhlIGNoYW5nZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHMgc3RhdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gYSBhY3Rpb24gd2l0aCBjaGFuZ2VzLlxuICogQHJldHVybnMge09iamVjdH0gY2hhbmdlcy5cbiAqL1xuZnVuY3Rpb24gc3RhdGVSZWR1Y2VyKHMsIGEpIHtcbiAgcmV0dXJuIGEuY2hhbmdlcztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgbWVzc2FnZSB0byBiZSBhZGRlZCB0byBhcmlhLWxpdmUgcmVnaW9uIHdoZW4gaXRlbSBpcyBzZWxlY3RlZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gc2VsZWN0aW9uUGFyYW1ldGVycyBQYXJhbWV0ZXJzIHJlcXVpcmVkIHRvIGJ1aWxkIHRoZSBtZXNzYWdlLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGExMXkgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gZ2V0QTExeVNlbGVjdGlvbk1lc3NhZ2Uoc2VsZWN0aW9uUGFyYW1ldGVycykge1xuICB2YXIgc2VsZWN0ZWRJdGVtID0gc2VsZWN0aW9uUGFyYW1ldGVycy5zZWxlY3RlZEl0ZW0sXG4gICAgaXRlbVRvU3RyaW5nTG9jYWwgPSBzZWxlY3Rpb25QYXJhbWV0ZXJzLml0ZW1Ub1N0cmluZztcbiAgcmV0dXJuIHNlbGVjdGVkSXRlbSA/IGl0ZW1Ub1N0cmluZ0xvY2FsKHNlbGVjdGVkSXRlbSkgKyBcIiBoYXMgYmVlbiBzZWxlY3RlZC5cIiA6ICcnO1xufVxuXG4vKipcbiAqIERlYm91bmNlZCBjYWxsIGZvciB1cGRhdGluZyB0aGUgYTExeSBtZXNzYWdlLlxuICovXG52YXIgdXBkYXRlQTExeVN0YXR1cyA9IGRlYm91bmNlKGZ1bmN0aW9uIChnZXRBMTF5TWVzc2FnZSwgZG9jdW1lbnQpIHtcbiAgc2V0U3RhdHVzKGdldEExMXlNZXNzYWdlKCksIGRvY3VtZW50KTtcbn0sIDIwMCk7XG5cbi8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG52YXIgdXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgPyB1c2VMYXlvdXRFZmZlY3QgOiB1c2VFZmZlY3Q7XG5mdW5jdGlvbiB1c2VFbGVtZW50SWRzKF9yZWYpIHtcbiAgdmFyIF9yZWYkaWQgPSBfcmVmLmlkLFxuICAgIGlkID0gX3JlZiRpZCA9PT0gdm9pZCAwID8gXCJkb3duc2hpZnQtXCIgKyBnZW5lcmF0ZUlkKCkgOiBfcmVmJGlkLFxuICAgIGxhYmVsSWQgPSBfcmVmLmxhYmVsSWQsXG4gICAgbWVudUlkID0gX3JlZi5tZW51SWQsXG4gICAgZ2V0SXRlbUlkID0gX3JlZi5nZXRJdGVtSWQsXG4gICAgdG9nZ2xlQnV0dG9uSWQgPSBfcmVmLnRvZ2dsZUJ1dHRvbklkLFxuICAgIGlucHV0SWQgPSBfcmVmLmlucHV0SWQ7XG4gIHZhciBlbGVtZW50SWRzUmVmID0gdXNlUmVmKHtcbiAgICBsYWJlbElkOiBsYWJlbElkIHx8IGlkICsgXCItbGFiZWxcIixcbiAgICBtZW51SWQ6IG1lbnVJZCB8fCBpZCArIFwiLW1lbnVcIixcbiAgICBnZXRJdGVtSWQ6IGdldEl0ZW1JZCB8fCBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgIHJldHVybiBpZCArIFwiLWl0ZW0tXCIgKyBpbmRleDtcbiAgICB9LFxuICAgIHRvZ2dsZUJ1dHRvbklkOiB0b2dnbGVCdXR0b25JZCB8fCBpZCArIFwiLXRvZ2dsZS1idXR0b25cIixcbiAgICBpbnB1dElkOiBpbnB1dElkIHx8IGlkICsgXCItaW5wdXRcIlxuICB9KTtcbiAgcmV0dXJuIGVsZW1lbnRJZHNSZWYuY3VycmVudDtcbn1cbmZ1bmN0aW9uIGdldEl0ZW1BbmRJbmRleChpdGVtUHJvcCwgaW5kZXhQcm9wLCBpdGVtcywgZXJyb3JNZXNzYWdlKSB7XG4gIHZhciBpdGVtLCBpbmRleDtcbiAgaWYgKGl0ZW1Qcm9wID09PSB1bmRlZmluZWQpIHtcbiAgICBpZiAoaW5kZXhQcm9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgIH1cbiAgICBpdGVtID0gaXRlbXNbaW5kZXhQcm9wXTtcbiAgICBpbmRleCA9IGluZGV4UHJvcDtcbiAgfSBlbHNlIHtcbiAgICBpbmRleCA9IGluZGV4UHJvcCA9PT0gdW5kZWZpbmVkID8gaXRlbXMuaW5kZXhPZihpdGVtUHJvcCkgOiBpbmRleFByb3A7XG4gICAgaXRlbSA9IGl0ZW1Qcm9wO1xuICB9XG4gIHJldHVybiBbaXRlbSwgaW5kZXhdO1xufVxuZnVuY3Rpb24gaXRlbVRvU3RyaW5nKGl0ZW0pIHtcbiAgcmV0dXJuIGl0ZW0gPyBTdHJpbmcoaXRlbSkgOiAnJztcbn1cbmZ1bmN0aW9uIGlzQWNjZXB0ZWRDaGFyYWN0ZXJLZXkoa2V5KSB7XG4gIHJldHVybiAvXlxcU3sxfSQvLnRlc3Qoa2V5KTtcbn1cbmZ1bmN0aW9uIGNhcGl0YWxpemVTdHJpbmcoc3RyaW5nKSB7XG4gIHJldHVybiBcIlwiICsgc3RyaW5nLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSk7XG59XG5mdW5jdGlvbiB1c2VMYXRlc3RSZWYodmFsKSB7XG4gIHZhciByZWYgPSB1c2VSZWYodmFsKTtcbiAgLy8gdGVjaG5pY2FsbHkgdGhpcyBpcyBub3QgXCJjb25jdXJyZW50IG1vZGUgc2FmZVwiIGJlY2F1c2Ugd2UncmUgbWFuaXB1bGF0aW5nXG4gIC8vIHRoZSB2YWx1ZSBkdXJpbmcgcmVuZGVyIChzbyBpdCdzIG5vdCBpZGVtcG90ZW50KS4gSG93ZXZlciwgdGhlIHBsYWNlcyB0aGlzXG4gIC8vIGhvb2sgaXMgdXNlZCBpcyB0byBzdXBwb3J0IG1lbW9pemluZyBjYWxsYmFja3Mgd2hpY2ggd2lsbCBiZSBjYWxsZWRcbiAgLy8gKmR1cmluZyogcmVuZGVyLCBzbyB3ZSBuZWVkIHRoZSBsYXRlc3QgdmFsdWVzICpkdXJpbmcqIHJlbmRlci5cbiAgLy8gSWYgbm90IGZvciB0aGlzLCB0aGVuIHdlJ2QgcHJvYmFibHkgd2FudCB0byB1c2UgdXNlTGF5b3V0RWZmZWN0IGluc3RlYWQuXG4gIHJlZi5jdXJyZW50ID0gdmFsO1xuICByZXR1cm4gcmVmO1xufVxuXG4vKipcbiAqIENvbXB1dGVzIHRoZSBjb250cm9sbGVkIHN0YXRlIHVzaW5nIGEgdGhlIHByZXZpb3VzIHN0YXRlLCBwcm9wcyxcbiAqIHR3byByZWR1Y2Vycywgb25lIGZyb20gZG93bnNoaWZ0IGFuZCBhbiBvcHRpb25hbCBvbmUgZnJvbSB0aGUgdXNlci5cbiAqIEFsc28gY2FsbHMgdGhlIG9uQ2hhbmdlIGhhbmRsZXJzIGZvciBzdGF0ZSB2YWx1ZXMgdGhhdCBoYXZlIGNoYW5nZWQuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVkdWNlciBSZWR1Y2VyIGZ1bmN0aW9uIGZyb20gZG93bnNoaWZ0LlxuICogQHBhcmFtIHtPYmplY3R9IGluaXRpYWxTdGF0ZSBJbml0aWFsIHN0YXRlIG9mIHRoZSBob29rLlxuICogQHBhcmFtIHtPYmplY3R9IHByb3BzIFRoZSBob29rIHByb3BzLlxuICogQHJldHVybnMge0FycmF5fSBBbiBhcnJheSB3aXRoIHRoZSBzdGF0ZSBhbmQgYW4gYWN0aW9uIGRpc3BhdGNoZXIuXG4gKi9cbmZ1bmN0aW9uIHVzZUVuaGFuY2VkUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsU3RhdGUsIHByb3BzKSB7XG4gIHZhciBwcmV2U3RhdGVSZWYgPSB1c2VSZWYoKTtcbiAgdmFyIGFjdGlvblJlZiA9IHVzZVJlZigpO1xuICB2YXIgZW5oYW5jZWRSZWR1Y2VyID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcbiAgICBhY3Rpb25SZWYuY3VycmVudCA9IGFjdGlvbjtcbiAgICBzdGF0ZSA9IGdldFN0YXRlKHN0YXRlLCBhY3Rpb24ucHJvcHMpO1xuICAgIHZhciBjaGFuZ2VzID0gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKTtcbiAgICB2YXIgbmV3U3RhdGUgPSBhY3Rpb24ucHJvcHMuc3RhdGVSZWR1Y2VyKHN0YXRlLCBfZXh0ZW5kcyh7fSwgYWN0aW9uLCB7XG4gICAgICBjaGFuZ2VzOiBjaGFuZ2VzXG4gICAgfSkpO1xuICAgIHJldHVybiBuZXdTdGF0ZTtcbiAgfSwgW3JlZHVjZXJdKTtcbiAgdmFyIF91c2VSZWR1Y2VyID0gdXNlUmVkdWNlcihlbmhhbmNlZFJlZHVjZXIsIGluaXRpYWxTdGF0ZSksXG4gICAgc3RhdGUgPSBfdXNlUmVkdWNlclswXSxcbiAgICBkaXNwYXRjaCA9IF91c2VSZWR1Y2VyWzFdO1xuICB2YXIgcHJvcHNSZWYgPSB1c2VMYXRlc3RSZWYocHJvcHMpO1xuICB2YXIgZGlzcGF0Y2hXaXRoUHJvcHMgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgcmV0dXJuIGRpc3BhdGNoKF9leHRlbmRzKHtcbiAgICAgIHByb3BzOiBwcm9wc1JlZi5jdXJyZW50XG4gICAgfSwgYWN0aW9uKSk7XG4gIH0sIFtwcm9wc1JlZl0pO1xuICB2YXIgYWN0aW9uID0gYWN0aW9uUmVmLmN1cnJlbnQ7XG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGFjdGlvbiAmJiBwcmV2U3RhdGVSZWYuY3VycmVudCAmJiBwcmV2U3RhdGVSZWYuY3VycmVudCAhPT0gc3RhdGUpIHtcbiAgICAgIGNhbGxPbkNoYW5nZVByb3BzKGFjdGlvbiwgZ2V0U3RhdGUocHJldlN0YXRlUmVmLmN1cnJlbnQsIGFjdGlvbi5wcm9wcyksIHN0YXRlKTtcbiAgICB9XG4gICAgcHJldlN0YXRlUmVmLmN1cnJlbnQgPSBzdGF0ZTtcbiAgfSwgW3N0YXRlLCBwcm9wcywgYWN0aW9uXSk7XG4gIHJldHVybiBbc3RhdGUsIGRpc3BhdGNoV2l0aFByb3BzXTtcbn1cblxuLyoqXG4gKiBXcmFwcyB0aGUgdXNlRW5oYW5jZWRSZWR1Y2VyIGFuZCBhcHBsaWVzIHRoZSBjb250cm9sbGVkIHByb3AgdmFsdWVzIGJlZm9yZVxuICogcmV0dXJuaW5nIHRoZSBuZXcgc3RhdGUuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVkdWNlciBSZWR1Y2VyIGZ1bmN0aW9uIGZyb20gZG93bnNoaWZ0LlxuICogQHBhcmFtIHtPYmplY3R9IGluaXRpYWxTdGF0ZSBJbml0aWFsIHN0YXRlIG9mIHRoZSBob29rLlxuICogQHBhcmFtIHtPYmplY3R9IHByb3BzIFRoZSBob29rIHByb3BzLlxuICogQHJldHVybnMge0FycmF5fSBBbiBhcnJheSB3aXRoIHRoZSBzdGF0ZSBhbmQgYW4gYWN0aW9uIGRpc3BhdGNoZXIuXG4gKi9cbmZ1bmN0aW9uIHVzZUNvbnRyb2xsZWRSZWR1Y2VyJDEocmVkdWNlciwgaW5pdGlhbFN0YXRlLCBwcm9wcykge1xuICB2YXIgX3VzZUVuaGFuY2VkUmVkdWNlciA9IHVzZUVuaGFuY2VkUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsU3RhdGUsIHByb3BzKSxcbiAgICBzdGF0ZSA9IF91c2VFbmhhbmNlZFJlZHVjZXJbMF0sXG4gICAgZGlzcGF0Y2ggPSBfdXNlRW5oYW5jZWRSZWR1Y2VyWzFdO1xuICByZXR1cm4gW2dldFN0YXRlKHN0YXRlLCBwcm9wcyksIGRpc3BhdGNoXTtcbn1cbnZhciBkZWZhdWx0UHJvcHMkMyA9IHtcbiAgaXRlbVRvU3RyaW5nOiBpdGVtVG9TdHJpbmcsXG4gIHN0YXRlUmVkdWNlcjogc3RhdGVSZWR1Y2VyLFxuICBnZXRBMTF5U2VsZWN0aW9uTWVzc2FnZTogZ2V0QTExeVNlbGVjdGlvbk1lc3NhZ2UsXG4gIHNjcm9sbEludG9WaWV3OiBzY3JvbGxJbnRvVmlldyxcbiAgZW52aXJvbm1lbnQ6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0IChzc3IpICovXG4gIHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8ge30gOiB3aW5kb3dcbn07XG5mdW5jdGlvbiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgcHJvcEtleSwgZGVmYXVsdFN0YXRlVmFsdWVzKSB7XG4gIGlmIChkZWZhdWx0U3RhdGVWYWx1ZXMgPT09IHZvaWQgMCkge1xuICAgIGRlZmF1bHRTdGF0ZVZhbHVlcyA9IGRyb3Bkb3duRGVmYXVsdFN0YXRlVmFsdWVzO1xuICB9XG4gIHZhciBkZWZhdWx0VmFsdWUgPSBwcm9wc1tcImRlZmF1bHRcIiArIGNhcGl0YWxpemVTdHJpbmcocHJvcEtleSldO1xuICBpZiAoZGVmYXVsdFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICB9XG4gIHJldHVybiBkZWZhdWx0U3RhdGVWYWx1ZXNbcHJvcEtleV07XG59XG5mdW5jdGlvbiBnZXRJbml0aWFsVmFsdWUkMShwcm9wcywgcHJvcEtleSwgZGVmYXVsdFN0YXRlVmFsdWVzKSB7XG4gIGlmIChkZWZhdWx0U3RhdGVWYWx1ZXMgPT09IHZvaWQgMCkge1xuICAgIGRlZmF1bHRTdGF0ZVZhbHVlcyA9IGRyb3Bkb3duRGVmYXVsdFN0YXRlVmFsdWVzO1xuICB9XG4gIHZhciB2YWx1ZSA9IHByb3BzW3Byb3BLZXldO1xuICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICB2YXIgaW5pdGlhbFZhbHVlID0gcHJvcHNbXCJpbml0aWFsXCIgKyBjYXBpdGFsaXplU3RyaW5nKHByb3BLZXkpXTtcbiAgaWYgKGluaXRpYWxWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGluaXRpYWxWYWx1ZTtcbiAgfVxuICByZXR1cm4gZ2V0RGVmYXVsdFZhbHVlJDEocHJvcHMsIHByb3BLZXksIGRlZmF1bHRTdGF0ZVZhbHVlcyk7XG59XG5mdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUkMihwcm9wcykge1xuICB2YXIgc2VsZWN0ZWRJdGVtID0gZ2V0SW5pdGlhbFZhbHVlJDEocHJvcHMsICdzZWxlY3RlZEl0ZW0nKTtcbiAgdmFyIGlzT3BlbiA9IGdldEluaXRpYWxWYWx1ZSQxKHByb3BzLCAnaXNPcGVuJyk7XG4gIHZhciBoaWdobGlnaHRlZEluZGV4ID0gZ2V0SW5pdGlhbFZhbHVlJDEocHJvcHMsICdoaWdobGlnaHRlZEluZGV4Jyk7XG4gIHZhciBpbnB1dFZhbHVlID0gZ2V0SW5pdGlhbFZhbHVlJDEocHJvcHMsICdpbnB1dFZhbHVlJyk7XG4gIHJldHVybiB7XG4gICAgaGlnaGxpZ2h0ZWRJbmRleDogaGlnaGxpZ2h0ZWRJbmRleCA8IDAgJiYgc2VsZWN0ZWRJdGVtICYmIGlzT3BlbiA/IHByb3BzLml0ZW1zLmluZGV4T2Yoc2VsZWN0ZWRJdGVtKSA6IGhpZ2hsaWdodGVkSW5kZXgsXG4gICAgaXNPcGVuOiBpc09wZW4sXG4gICAgc2VsZWN0ZWRJdGVtOiBzZWxlY3RlZEl0ZW0sXG4gICAgaW5wdXRWYWx1ZTogaW5wdXRWYWx1ZVxuICB9O1xufVxuZnVuY3Rpb24gZ2V0SGlnaGxpZ2h0ZWRJbmRleE9uT3Blbihwcm9wcywgc3RhdGUsIG9mZnNldCkge1xuICB2YXIgaXRlbXMgPSBwcm9wcy5pdGVtcyxcbiAgICBpbml0aWFsSGlnaGxpZ2h0ZWRJbmRleCA9IHByb3BzLmluaXRpYWxIaWdobGlnaHRlZEluZGV4LFxuICAgIGRlZmF1bHRIaWdobGlnaHRlZEluZGV4ID0gcHJvcHMuZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXg7XG4gIHZhciBzZWxlY3RlZEl0ZW0gPSBzdGF0ZS5zZWxlY3RlZEl0ZW0sXG4gICAgaGlnaGxpZ2h0ZWRJbmRleCA9IHN0YXRlLmhpZ2hsaWdodGVkSW5kZXg7XG4gIGlmIChpdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvLyBpbml0aWFsSGlnaGxpZ2h0ZWRJbmRleCB3aWxsIGdpdmUgdmFsdWUgdG8gaGlnaGxpZ2h0ZWRJbmRleCBvbiBpbml0aWFsIHN0YXRlIG9ubHkuXG4gIGlmIChpbml0aWFsSGlnaGxpZ2h0ZWRJbmRleCAhPT0gdW5kZWZpbmVkICYmIGhpZ2hsaWdodGVkSW5kZXggPT09IGluaXRpYWxIaWdobGlnaHRlZEluZGV4KSB7XG4gICAgcmV0dXJuIGluaXRpYWxIaWdobGlnaHRlZEluZGV4O1xuICB9XG4gIGlmIChkZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRIaWdobGlnaHRlZEluZGV4O1xuICB9XG4gIGlmIChzZWxlY3RlZEl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbXMuaW5kZXhPZihzZWxlY3RlZEl0ZW0pO1xuICB9XG4gIGlmIChvZmZzZXQgPT09IDApIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgcmV0dXJuIG9mZnNldCA8IDAgPyBpdGVtcy5sZW5ndGggLSAxIDogMDtcbn1cblxuLyoqXG4gKiBSZXVzZSB0aGUgbW92ZW1lbnQgdHJhY2tpbmcgb2YgbW91c2UgYW5kIHRvdWNoIGV2ZW50cy5cbiAqXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzT3BlbiBXaGV0aGVyIHRoZSBkcm9wZG93biBpcyBvcGVuIG9yIG5vdC5cbiAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gZG93bnNoaWZ0RWxlbWVudFJlZnMgRG93bnNoaWZ0IGVsZW1lbnQgcmVmcyB0byB0cmFjayBtb3ZlbWVudCAodG9nZ2xlQnV0dG9uLCBtZW51IGV0Yy4pXG4gKiBAcGFyYW0ge09iamVjdH0gZW52aXJvbm1lbnQgRW52aXJvbm1lbnQgd2hlcmUgY29tcG9uZW50L2hvb2sgZXhpc3RzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlQmx1ciBIYW5kbGVyIG9uIGJsdXIgZnJvbSBtb3VzZSBvciB0b3VjaC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlZiBjb250YWluaW5nIHdoZXRoZXIgbW91c2VEb3duIG9yIHRvdWNoTW92ZSBldmVudCBpcyBoYXBwZW5pbmdcbiAqL1xuZnVuY3Rpb24gdXNlTW91c2VBbmRUb3VjaFRyYWNrZXIoaXNPcGVuLCBkb3duc2hpZnRFbGVtZW50UmVmcywgZW52aXJvbm1lbnQsIGhhbmRsZUJsdXIpIHtcbiAgdmFyIG1vdXNlQW5kVG91Y2hUcmFja2Vyc1JlZiA9IHVzZVJlZih7XG4gICAgaXNNb3VzZURvd246IGZhbHNlLFxuICAgIGlzVG91Y2hNb3ZlOiBmYWxzZVxuICB9KTtcbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoKGVudmlyb25tZW50ID09IG51bGwgPyB2b2lkIDAgOiBlbnZpcm9ubWVudC5hZGRFdmVudExpc3RlbmVyKSA9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVGhlIHNhbWUgc3RyYXRlZ3kgZm9yIGNoZWNraW5nIGlmIGEgY2xpY2sgb2NjdXJyZWQgaW5zaWRlIG9yIG91dHNpZGUgZG93bnNoaWZ0XG4gICAgLy8gYXMgaW4gZG93bnNoaWZ0LmpzLlxuICAgIHZhciBvbk1vdXNlRG93biA9IGZ1bmN0aW9uIG9uTW91c2VEb3duKCkge1xuICAgICAgbW91c2VBbmRUb3VjaFRyYWNrZXJzUmVmLmN1cnJlbnQuaXNNb3VzZURvd24gPSB0cnVlO1xuICAgIH07XG4gICAgdmFyIG9uTW91c2VVcCA9IGZ1bmN0aW9uIG9uTW91c2VVcChldmVudCkge1xuICAgICAgbW91c2VBbmRUb3VjaFRyYWNrZXJzUmVmLmN1cnJlbnQuaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgICAgIGlmIChpc09wZW4gJiYgIXRhcmdldFdpdGhpbkRvd25zaGlmdChldmVudC50YXJnZXQsIGRvd25zaGlmdEVsZW1lbnRSZWZzLm1hcChmdW5jdGlvbiAocmVmKSB7XG4gICAgICAgIHJldHVybiByZWYuY3VycmVudDtcbiAgICAgIH0pLCBlbnZpcm9ubWVudCkpIHtcbiAgICAgICAgaGFuZGxlQmx1cigpO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIG9uVG91Y2hTdGFydCA9IGZ1bmN0aW9uIG9uVG91Y2hTdGFydCgpIHtcbiAgICAgIG1vdXNlQW5kVG91Y2hUcmFja2Vyc1JlZi5jdXJyZW50LmlzVG91Y2hNb3ZlID0gZmFsc2U7XG4gICAgfTtcbiAgICB2YXIgb25Ub3VjaE1vdmUgPSBmdW5jdGlvbiBvblRvdWNoTW92ZSgpIHtcbiAgICAgIG1vdXNlQW5kVG91Y2hUcmFja2Vyc1JlZi5jdXJyZW50LmlzVG91Y2hNb3ZlID0gdHJ1ZTtcbiAgICB9O1xuICAgIHZhciBvblRvdWNoRW5kID0gZnVuY3Rpb24gb25Ub3VjaEVuZChldmVudCkge1xuICAgICAgaWYgKGlzT3BlbiAmJiAhbW91c2VBbmRUb3VjaFRyYWNrZXJzUmVmLmN1cnJlbnQuaXNUb3VjaE1vdmUgJiYgIXRhcmdldFdpdGhpbkRvd25zaGlmdChldmVudC50YXJnZXQsIGRvd25zaGlmdEVsZW1lbnRSZWZzLm1hcChmdW5jdGlvbiAocmVmKSB7XG4gICAgICAgIHJldHVybiByZWYuY3VycmVudDtcbiAgICAgIH0pLCBlbnZpcm9ubWVudCwgZmFsc2UpKSB7XG4gICAgICAgIGhhbmRsZUJsdXIoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGVudmlyb25tZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duKTtcbiAgICBlbnZpcm9ubWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKTtcbiAgICBlbnZpcm9ubWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25Ub3VjaFN0YXJ0KTtcbiAgICBlbnZpcm9ubWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvblRvdWNoTW92ZSk7XG4gICAgZW52aXJvbm1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoRW5kKTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICAgIHJldHVybiBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgICAgZW52aXJvbm1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Nb3VzZURvd24pO1xuICAgICAgZW52aXJvbm1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XG4gICAgICBlbnZpcm9ubWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25Ub3VjaFN0YXJ0KTtcbiAgICAgIGVudmlyb25tZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uVG91Y2hNb3ZlKTtcbiAgICAgIGVudmlyb25tZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCk7XG4gICAgfTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gIH0sIFtpc09wZW4sIGVudmlyb25tZW50XSk7XG4gIHJldHVybiBtb3VzZUFuZFRvdWNoVHJhY2tlcnNSZWY7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLW11dGFibGUtZXhwb3J0c1xudmFyIHVzZUdldHRlclByb3BzQ2FsbGVkQ2hlY2tlciA9IGZ1bmN0aW9uIHVzZUdldHRlclByb3BzQ2FsbGVkQ2hlY2tlcigpIHtcbiAgcmV0dXJuIG5vb3A7XG59O1xuLyoqXG4gKiBDdXN0b20gaG9vayB0aGF0IGNoZWNrcyBpZiBnZXR0ZXIgcHJvcHMgYXJlIGNhbGxlZCBjb3JyZWN0bHkuXG4gKlxuICogQHBhcmFtICB7Li4uYW55fSBwcm9wS2V5cyBHZXR0ZXIgcHJvcCBuYW1lcyB0byBiZSBoYW5kbGVkLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBTZXR0ZXIgZnVuY3Rpb24gY2FsbGVkIGluc2lkZSBnZXR0ZXIgcHJvcHMgdG8gc2V0IGNhbGwgaW5mb3JtYXRpb24uXG4gKi9cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB1c2VHZXR0ZXJQcm9wc0NhbGxlZENoZWNrZXIgPSBmdW5jdGlvbiB1c2VHZXR0ZXJQcm9wc0NhbGxlZENoZWNrZXIoKSB7XG4gICAgdmFyIGlzSW5pdGlhbE1vdW50UmVmID0gdXNlUmVmKHRydWUpO1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBwcm9wS2V5cyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIHByb3BLZXlzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cbiAgICB2YXIgZ2V0dGVyUHJvcHNDYWxsZWRSZWYgPSB1c2VSZWYocHJvcEtleXMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHByb3BLZXkpIHtcbiAgICAgIGFjY1twcm9wS2V5XSA9IHt9O1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSkpO1xuICAgIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgICBPYmplY3Qua2V5cyhnZXR0ZXJQcm9wc0NhbGxlZFJlZi5jdXJyZW50KS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wS2V5KSB7XG4gICAgICAgIHZhciBwcm9wQ2FsbEluZm8gPSBnZXR0ZXJQcm9wc0NhbGxlZFJlZi5jdXJyZW50W3Byb3BLZXldO1xuICAgICAgICBpZiAoaXNJbml0aWFsTW91bnRSZWYuY3VycmVudCkge1xuICAgICAgICAgIGlmICghT2JqZWN0LmtleXMocHJvcENhbGxJbmZvKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZG93bnNoaWZ0OiBZb3UgZm9yZ290IHRvIGNhbGwgdGhlIFwiICsgcHJvcEtleSArIFwiIGdldHRlciBmdW5jdGlvbiBvbiB5b3VyIGNvbXBvbmVudCAvIGVsZW1lbnQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgc3VwcHJlc3NSZWZFcnJvciA9IHByb3BDYWxsSW5mby5zdXBwcmVzc1JlZkVycm9yLFxuICAgICAgICAgIHJlZktleSA9IHByb3BDYWxsSW5mby5yZWZLZXksXG4gICAgICAgICAgZWxlbWVudFJlZiA9IHByb3BDYWxsSW5mby5lbGVtZW50UmVmO1xuICAgICAgICBpZiAoKCFlbGVtZW50UmVmIHx8ICFlbGVtZW50UmVmLmN1cnJlbnQpICYmICFzdXBwcmVzc1JlZkVycm9yKSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZG93bnNoaWZ0OiBUaGUgcmVmIHByb3AgXFxcIlwiICsgcmVmS2V5ICsgXCJcXFwiIGZyb20gXCIgKyBwcm9wS2V5ICsgXCIgd2FzIG5vdCBhcHBsaWVkIGNvcnJlY3RseSBvbiB5b3VyIGVsZW1lbnQuXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQgPSBmYWxzZTtcbiAgICB9KTtcbiAgICB2YXIgc2V0R2V0dGVyUHJvcENhbGxJbmZvID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKHByb3BLZXksIHN1cHByZXNzUmVmRXJyb3IsIHJlZktleSwgZWxlbWVudFJlZikge1xuICAgICAgZ2V0dGVyUHJvcHNDYWxsZWRSZWYuY3VycmVudFtwcm9wS2V5XSA9IHtcbiAgICAgICAgc3VwcHJlc3NSZWZFcnJvcjogc3VwcHJlc3NSZWZFcnJvcixcbiAgICAgICAgcmVmS2V5OiByZWZLZXksXG4gICAgICAgIGVsZW1lbnRSZWY6IGVsZW1lbnRSZWZcbiAgICAgIH07XG4gICAgfSwgW10pO1xuICAgIHJldHVybiBzZXRHZXR0ZXJQcm9wQ2FsbEluZm87XG4gIH07XG59XG5mdW5jdGlvbiB1c2VBMTF5TWVzc2FnZVNldHRlcihnZXRBMTF5TWVzc2FnZSwgZGVwZW5kZW5jeUFycmF5LCBfcmVmMikge1xuICB2YXIgaXNJbml0aWFsTW91bnQgPSBfcmVmMi5pc0luaXRpYWxNb3VudCxcbiAgICBoaWdobGlnaHRlZEluZGV4ID0gX3JlZjIuaGlnaGxpZ2h0ZWRJbmRleCxcbiAgICBpdGVtcyA9IF9yZWYyLml0ZW1zLFxuICAgIGVudmlyb25tZW50ID0gX3JlZjIuZW52aXJvbm1lbnQsXG4gICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWYyLCBfZXhjbHVkZWQkMyk7XG4gIC8vIFNldHMgYTExeSBzdGF0dXMgbWVzc2FnZSBvbiBjaGFuZ2VzIGluIHN0YXRlLlxuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlmIChpc0luaXRpYWxNb3VudCB8fCBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1cGRhdGVBMTF5U3RhdHVzKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBnZXRBMTF5TWVzc2FnZShfZXh0ZW5kcyh7XG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGhpZ2hsaWdodGVkSW5kZXgsXG4gICAgICAgIGhpZ2hsaWdodGVkSXRlbTogaXRlbXNbaGlnaGxpZ2h0ZWRJbmRleF0sXG4gICAgICAgIHJlc3VsdENvdW50OiBpdGVtcy5sZW5ndGhcbiAgICAgIH0sIHJlc3QpKTtcbiAgICB9LCBlbnZpcm9ubWVudC5kb2N1bWVudCk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICB9LCBkZXBlbmRlbmN5QXJyYXkpO1xufVxuZnVuY3Rpb24gdXNlU2Nyb2xsSW50b1ZpZXcoX3JlZjMpIHtcbiAgdmFyIGhpZ2hsaWdodGVkSW5kZXggPSBfcmVmMy5oaWdobGlnaHRlZEluZGV4LFxuICAgIGlzT3BlbiA9IF9yZWYzLmlzT3BlbixcbiAgICBpdGVtUmVmcyA9IF9yZWYzLml0ZW1SZWZzLFxuICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4ID0gX3JlZjMuZ2V0SXRlbU5vZGVGcm9tSW5kZXgsXG4gICAgbWVudUVsZW1lbnQgPSBfcmVmMy5tZW51RWxlbWVudCxcbiAgICBzY3JvbGxJbnRvVmlld1Byb3AgPSBfcmVmMy5zY3JvbGxJbnRvVmlldztcbiAgLy8gdXNlZCBub3QgdG8gc2Nyb2xsIG9uIGhpZ2hsaWdodCBieSBtb3VzZS5cbiAgdmFyIHNob3VsZFNjcm9sbFJlZiA9IHVzZVJlZih0cnVlKTtcbiAgLy8gU2Nyb2xsIG9uIGhpZ2hsaWdodGVkIGl0ZW0gaWYgY2hhbmdlIGNvbWVzIGZyb20ga2V5Ym9hcmQuXG4gIHVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlmIChoaWdobGlnaHRlZEluZGV4IDwgMCB8fCAhaXNPcGVuIHx8ICFPYmplY3Qua2V5cyhpdGVtUmVmcy5jdXJyZW50KS5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHNob3VsZFNjcm9sbFJlZi5jdXJyZW50ID09PSBmYWxzZSkge1xuICAgICAgc2hvdWxkU2Nyb2xsUmVmLmN1cnJlbnQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzY3JvbGxJbnRvVmlld1Byb3AoZ2V0SXRlbU5vZGVGcm9tSW5kZXgoaGlnaGxpZ2h0ZWRJbmRleCksIG1lbnVFbGVtZW50KTtcbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICB9LCBbaGlnaGxpZ2h0ZWRJbmRleF0pO1xuICByZXR1cm4gc2hvdWxkU2Nyb2xsUmVmO1xufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLW11dGFibGUtZXhwb3J0c1xudmFyIHVzZUNvbnRyb2xQcm9wc1ZhbGlkYXRvciA9IG5vb3A7XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdXNlQ29udHJvbFByb3BzVmFsaWRhdG9yID0gZnVuY3Rpb24gdXNlQ29udHJvbFByb3BzVmFsaWRhdG9yKF9yZWY0KSB7XG4gICAgdmFyIGlzSW5pdGlhbE1vdW50ID0gX3JlZjQuaXNJbml0aWFsTW91bnQsXG4gICAgICBwcm9wcyA9IF9yZWY0LnByb3BzLFxuICAgICAgc3RhdGUgPSBfcmVmNC5zdGF0ZTtcbiAgICAvLyB1c2VkIGZvciBjaGVja2luZyB3aGVuIHByb3BzIGFyZSBtb3ZpbmcgZnJvbSBjb250cm9sbGVkIHRvIHVuY29udHJvbGxlZC5cbiAgICB2YXIgcHJldlByb3BzUmVmID0gdXNlUmVmKHByb3BzKTtcbiAgICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGlzSW5pdGlhbE1vdW50KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhbGlkYXRlQ29udHJvbGxlZFVuY2hhbmdlZChzdGF0ZSwgcHJldlByb3BzUmVmLmN1cnJlbnQsIHByb3BzKTtcbiAgICAgIHByZXZQcm9wc1JlZi5jdXJyZW50ID0gcHJvcHM7XG4gICAgfSwgW3N0YXRlLCBwcm9wcywgaXNJbml0aWFsTW91bnRdKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBIYW5kbGVzIHNlbGVjdGlvbiBvbiBFbnRlciAvIEFsdCArIEFycm93VXAuIENsb3NlcyB0aGUgbWVudSBhbmQgcmVzZXRzIHRoZSBoaWdobGlnaHRlZCBpbmRleCwgdW5sZXNzIHRoZXJlIGlzIGEgaGlnaGxpZ2h0ZWQuXG4gKiBJbiB0aGF0IGNhc2UsIHNlbGVjdHMgdGhlIGl0ZW0gYW5kIHJlc2V0cyB0byBkZWZhdWx0cyBmb3Igb3BlbiBzdGF0ZSBhbmQgaGlnaGxpZ2h0ZWQgaWRleC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBUaGUgdXNlQ29tYm9ib3ggcHJvcHMuXG4gKiBAcGFyYW0ge251bWJlcn0gaGlnaGxpZ2h0ZWRJbmRleCBUaGUgaW5kZXggZnJvbSB0aGUgc3RhdGUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlucHV0VmFsdWUgQWxzbyByZXR1cm4gdGhlIGlucHV0IHZhbHVlIGZvciBzdGF0ZS5cbiAqIEByZXR1cm5zIFRoZSBjaGFuZ2VzIGZvciB0aGUgc3RhdGUuXG4gKi9cbmZ1bmN0aW9uIGdldENoYW5nZXNPblNlbGVjdGlvbihwcm9wcywgaGlnaGxpZ2h0ZWRJbmRleCwgaW5wdXRWYWx1ZSkge1xuICB2YXIgX3Byb3BzJGl0ZW1zO1xuICBpZiAoaW5wdXRWYWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgaW5wdXRWYWx1ZSA9IHRydWU7XG4gIH1cbiAgdmFyIHNob3VsZFNlbGVjdCA9ICgoX3Byb3BzJGl0ZW1zID0gcHJvcHMuaXRlbXMpID09IG51bGwgPyB2b2lkIDAgOiBfcHJvcHMkaXRlbXMubGVuZ3RoKSAmJiBoaWdobGlnaHRlZEluZGV4ID49IDA7XG4gIHJldHVybiBfZXh0ZW5kcyh7XG4gICAgaXNPcGVuOiBmYWxzZSxcbiAgICBoaWdobGlnaHRlZEluZGV4OiAtMVxuICB9LCBzaG91bGRTZWxlY3QgJiYgX2V4dGVuZHMoe1xuICAgIHNlbGVjdGVkSXRlbTogcHJvcHMuaXRlbXNbaGlnaGxpZ2h0ZWRJbmRleF0sXG4gICAgaXNPcGVuOiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgJ2lzT3BlbicpLFxuICAgIGhpZ2hsaWdodGVkSW5kZXg6IGdldERlZmF1bHRWYWx1ZSQxKHByb3BzLCAnaGlnaGxpZ2h0ZWRJbmRleCcpXG4gIH0sIGlucHV0VmFsdWUgJiYge1xuICAgIGlucHV0VmFsdWU6IHByb3BzLml0ZW1Ub1N0cmluZyhwcm9wcy5pdGVtc1toaWdobGlnaHRlZEluZGV4XSlcbiAgfSkpO1xufVxuXG5mdW5jdGlvbiBkb3duc2hpZnRDb21tb25SZWR1Y2VyKHN0YXRlLCBhY3Rpb24sIHN0YXRlQ2hhbmdlVHlwZXMpIHtcbiAgdmFyIHR5cGUgPSBhY3Rpb24udHlwZSxcbiAgICBwcm9wcyA9IGFjdGlvbi5wcm9wcztcbiAgdmFyIGNoYW5nZXM7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2Ugc3RhdGVDaGFuZ2VUeXBlcy5JdGVtTW91c2VNb3ZlOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogYWN0aW9uLmRpc2FibGVkID8gLTEgOiBhY3Rpb24uaW5kZXhcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIHN0YXRlQ2hhbmdlVHlwZXMuTWVudU1vdXNlTGVhdmU6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiAtMVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2Ugc3RhdGVDaGFuZ2VUeXBlcy5Ub2dnbGVCdXR0b25DbGljazpcbiAgICBjYXNlIHN0YXRlQ2hhbmdlVHlwZXMuRnVuY3Rpb25Ub2dnbGVNZW51OlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaXNPcGVuOiAhc3RhdGUuaXNPcGVuLFxuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBzdGF0ZS5pc09wZW4gPyAtMSA6IGdldEhpZ2hsaWdodGVkSW5kZXhPbk9wZW4ocHJvcHMsIHN0YXRlLCAwKVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2Ugc3RhdGVDaGFuZ2VUeXBlcy5GdW5jdGlvbk9wZW5NZW51OlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaXNPcGVuOiB0cnVlLFxuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBnZXRIaWdobGlnaHRlZEluZGV4T25PcGVuKHByb3BzLCBzdGF0ZSwgMClcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIHN0YXRlQ2hhbmdlVHlwZXMuRnVuY3Rpb25DbG9zZU1lbnU6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBpc09wZW46IGZhbHNlXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBzdGF0ZUNoYW5nZVR5cGVzLkZ1bmN0aW9uU2V0SGlnaGxpZ2h0ZWRJbmRleDpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGFjdGlvbi5oaWdobGlnaHRlZEluZGV4XG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBzdGF0ZUNoYW5nZVR5cGVzLkZ1bmN0aW9uU2V0SW5wdXRWYWx1ZTpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGlucHV0VmFsdWU6IGFjdGlvbi5pbnB1dFZhbHVlXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBzdGF0ZUNoYW5nZVR5cGVzLkZ1bmN0aW9uUmVzZXQ6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgJ2hpZ2hsaWdodGVkSW5kZXgnKSxcbiAgICAgICAgaXNPcGVuOiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgJ2lzT3BlbicpLFxuICAgICAgICBzZWxlY3RlZEl0ZW06IGdldERlZmF1bHRWYWx1ZSQxKHByb3BzLCAnc2VsZWN0ZWRJdGVtJyksXG4gICAgICAgIGlucHV0VmFsdWU6IGdldERlZmF1bHRWYWx1ZSQxKHByb3BzLCAnaW5wdXRWYWx1ZScpXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVkdWNlciBjYWxsZWQgd2l0aG91dCBwcm9wZXIgYWN0aW9uIHR5cGUuJyk7XG4gIH1cbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwgY2hhbmdlcyk7XG59XG4vKiBlc2xpbnQtZW5hYmxlIGNvbXBsZXhpdHkgKi9cblxuZnVuY3Rpb24gZ2V0SXRlbUluZGV4QnlDaGFyYWN0ZXJLZXkoX2EpIHtcbiAgICB2YXIga2V5c1NvRmFyID0gX2Eua2V5c1NvRmFyLCBoaWdobGlnaHRlZEluZGV4ID0gX2EuaGlnaGxpZ2h0ZWRJbmRleCwgaXRlbXMgPSBfYS5pdGVtcywgaXRlbVRvU3RyaW5nID0gX2EuaXRlbVRvU3RyaW5nLCBnZXRJdGVtTm9kZUZyb21JbmRleCA9IF9hLmdldEl0ZW1Ob2RlRnJvbUluZGV4O1xuICAgIHZhciBsb3dlckNhc2VkS2V5c1NvRmFyID0ga2V5c1NvRmFyLnRvTG93ZXJDYXNlKCk7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGl0ZW1zLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAvLyBpZiB3ZSBhbHJlYWR5IGhhdmUgYSBzZWFyY2ggcXVlcnkgaW4gcHJvZ3Jlc3MsIHdlIGFsc28gY29uc2lkZXIgdGhlIGN1cnJlbnQgaGlnaGxpZ2h0ZWQgaXRlbS5cbiAgICAgICAgdmFyIG9mZnNldEluZGV4ID0gKGluZGV4ICsgaGlnaGxpZ2h0ZWRJbmRleCArIChrZXlzU29GYXIubGVuZ3RoIDwgMiA/IDEgOiAwKSkgJSBpdGVtcy5sZW5ndGg7XG4gICAgICAgIHZhciBpdGVtID0gaXRlbXNbb2Zmc2V0SW5kZXhdO1xuICAgICAgICBpZiAoaXRlbSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICBpdGVtVG9TdHJpbmcoaXRlbSkudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKGxvd2VyQ2FzZWRLZXlzU29GYXIpKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGdldEl0ZW1Ob2RlRnJvbUluZGV4KG9mZnNldEluZGV4KTtcbiAgICAgICAgICAgIGlmICghKGVsZW1lbnQgPT09IG51bGwgfHwgZWxlbWVudCA9PT0gdm9pZCAwID8gdm9pZCAwIDogZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9mZnNldEluZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoaWdobGlnaHRlZEluZGV4O1xufVxudmFyIHByb3BUeXBlcyQyID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICBpdGVtVG9TdHJpbmc6IFByb3BUeXBlcy5mdW5jLFxuICAgIGdldEExMXlTdGF0dXNNZXNzYWdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBnZXRBMTF5U2VsZWN0aW9uTWVzc2FnZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgaGlnaGxpZ2h0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBkZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBpbml0aWFsSGlnaGxpZ2h0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBpc09wZW46IFByb3BUeXBlcy5ib29sLFxuICAgIGRlZmF1bHRJc09wZW46IFByb3BUeXBlcy5ib29sLFxuICAgIGluaXRpYWxJc09wZW46IFByb3BUeXBlcy5ib29sLFxuICAgIHNlbGVjdGVkSXRlbTogUHJvcFR5cGVzLmFueSxcbiAgICBpbml0aWFsU2VsZWN0ZWRJdGVtOiBQcm9wVHlwZXMuYW55LFxuICAgIGRlZmF1bHRTZWxlY3RlZEl0ZW06IFByb3BUeXBlcy5hbnksXG4gICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbGFiZWxJZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBtZW51SWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgZ2V0SXRlbUlkOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB0b2dnbGVCdXR0b25JZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBzdGF0ZVJlZHVjZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uU2VsZWN0ZWRJdGVtQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkhpZ2hsaWdodGVkSW5kZXhDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uU3RhdGVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uSXNPcGVuQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBlbnZpcm9ubWVudDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBkb2N1bWVudDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICAgIGdldEVsZW1lbnRCeUlkOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgICAgIGFjdGl2ZUVsZW1lbnQ6IFByb3BUeXBlcy5hbnksXG4gICAgICAgICAgICBib2R5OiBQcm9wVHlwZXMuYW55XG4gICAgICAgIH0pXG4gICAgfSlcbn07XG4vKipcbiAqIERlZmF1bHQgaW1wbGVtZW50YXRpb24gZm9yIHN0YXR1cyBtZXNzYWdlLiBPbmx5IGFkZGVkIHdoZW4gbWVudSBpcyBvcGVuLlxuICogV2lsbCBzcGVjaWZ0IGlmIHRoZXJlIGFyZSByZXN1bHRzIGluIHRoZSBsaXN0LCBhbmQgaWYgc28sIGhvdyBtYW55LFxuICogYW5kIHdoYXQga2V5cyBhcmUgcmVsZXZhbnQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtIHRoZSBkb3duc2hpZnQgc3RhdGUgYW5kIG90aGVyIHJlbGV2YW50IHByb3BlcnRpZXNcbiAqIEByZXR1cm4ge1N0cmluZ30gdGhlIGExMXkgc3RhdHVzIG1lc3NhZ2VcbiAqL1xuZnVuY3Rpb24gZ2V0QTExeVN0YXR1c01lc3NhZ2UoX2EpIHtcbiAgICB2YXIgaXNPcGVuID0gX2EuaXNPcGVuLCByZXN1bHRDb3VudCA9IF9hLnJlc3VsdENvdW50LCBwcmV2aW91c1Jlc3VsdENvdW50ID0gX2EucHJldmlvdXNSZXN1bHRDb3VudDtcbiAgICBpZiAoIWlzT3Blbikge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmICghcmVzdWx0Q291bnQpIHtcbiAgICAgICAgcmV0dXJuICdObyByZXN1bHRzIGFyZSBhdmFpbGFibGUuJztcbiAgICB9XG4gICAgaWYgKHJlc3VsdENvdW50ICE9PSBwcmV2aW91c1Jlc3VsdENvdW50KSB7XG4gICAgICAgIHJldHVybiBcIlwiLmNvbmNhdChyZXN1bHRDb3VudCwgXCIgcmVzdWx0XCIpLmNvbmNhdChyZXN1bHRDb3VudCA9PT0gMSA/ICcgaXMnIDogJ3MgYXJlJywgXCIgYXZhaWxhYmxlLCB1c2UgdXAgYW5kIGRvd24gYXJyb3cga2V5cyB0byBuYXZpZ2F0ZS4gUHJlc3MgRW50ZXIgb3IgU3BhY2UgQmFyIGtleXMgdG8gc2VsZWN0LlwiKTtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxudmFyIGRlZmF1bHRQcm9wcyQyID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGRlZmF1bHRQcm9wcyQzKSwgeyBnZXRBMTF5U3RhdHVzTWVzc2FnZTogZ2V0QTExeVN0YXR1c01lc3NhZ2UgfSk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLW11dGFibGUtZXhwb3J0c1xudmFyIHZhbGlkYXRlUHJvcFR5cGVzJDIgPSBub29wO1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgdmFsaWRhdGVQcm9wVHlwZXMkMiA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsZXIpIHtcbiAgICAgICAgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKHByb3BUeXBlcyQyLCBvcHRpb25zLCAncHJvcCcsIGNhbGxlci5uYW1lKTtcbiAgICB9O1xufVxuXG52YXIgVG9nZ2xlQnV0dG9uQ2xpY2skMSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3RvZ2dsZWJ1dHRvbl9jbGlja19fJyA6IDA7XG52YXIgVG9nZ2xlQnV0dG9uS2V5RG93bkFycm93RG93biA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3RvZ2dsZWJ1dHRvbl9rZXlkb3duX2Fycm93X2Rvd25fXycgOiAxO1xudmFyIFRvZ2dsZUJ1dHRvbktleURvd25BcnJvd1VwID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fdG9nZ2xlYnV0dG9uX2tleWRvd25fYXJyb3dfdXBfXycgOiAyO1xudmFyIFRvZ2dsZUJ1dHRvbktleURvd25DaGFyYWN0ZXIgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX190b2dnbGVidXR0b25fa2V5ZG93bl9jaGFyYWN0ZXJfXycgOiAzO1xudmFyIFRvZ2dsZUJ1dHRvbktleURvd25Fc2NhcGUgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX190b2dnbGVidXR0b25fa2V5ZG93bl9lc2NhcGVfXycgOiA0O1xudmFyIFRvZ2dsZUJ1dHRvbktleURvd25Ib21lID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fdG9nZ2xlYnV0dG9uX2tleWRvd25faG9tZV9fJyA6IDU7XG52YXIgVG9nZ2xlQnV0dG9uS2V5RG93bkVuZCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3RvZ2dsZWJ1dHRvbl9rZXlkb3duX2VuZF9fJyA6IDY7XG52YXIgVG9nZ2xlQnV0dG9uS2V5RG93bkVudGVyID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fdG9nZ2xlYnV0dG9uX2tleWRvd25fZW50ZXJfXycgOiA3O1xudmFyIFRvZ2dsZUJ1dHRvbktleURvd25TcGFjZUJ1dHRvbiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3RvZ2dsZWJ1dHRvbl9rZXlkb3duX3NwYWNlX2J1dHRvbl9fJyA6IDg7XG52YXIgVG9nZ2xlQnV0dG9uS2V5RG93blBhZ2VVcCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3RvZ2dsZWJ1dHRvbl9rZXlkb3duX3BhZ2VfdXBfXycgOiA5O1xudmFyIFRvZ2dsZUJ1dHRvbktleURvd25QYWdlRG93biA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3RvZ2dsZWJ1dHRvbl9rZXlkb3duX3BhZ2VfZG93bl9fJyA6IDEwO1xudmFyIFRvZ2dsZUJ1dHRvbkJsdXIgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX190b2dnbGVidXR0b25fYmx1cl9fJyA6IDExO1xudmFyIE1lbnVNb3VzZUxlYXZlJDEgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19tZW51X21vdXNlX2xlYXZlX18nIDogMTI7XG52YXIgSXRlbU1vdXNlTW92ZSQxID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19faXRlbV9tb3VzZV9tb3ZlX18nIDogMTM7XG52YXIgSXRlbUNsaWNrJDEgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19pdGVtX2NsaWNrX18nIDogMTQ7XG52YXIgRnVuY3Rpb25Ub2dnbGVNZW51JDEgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl90b2dnbGVfbWVudV9fJyA6IDE1O1xudmFyIEZ1bmN0aW9uT3Blbk1lbnUkMSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2Z1bmN0aW9uX29wZW5fbWVudV9fJyA6IDE2O1xudmFyIEZ1bmN0aW9uQ2xvc2VNZW51JDEgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9jbG9zZV9tZW51X18nIDogMTc7XG52YXIgRnVuY3Rpb25TZXRIaWdobGlnaHRlZEluZGV4JDEgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9zZXRfaGlnaGxpZ2h0ZWRfaW5kZXhfXycgOiAxODtcbnZhciBGdW5jdGlvblNlbGVjdEl0ZW0kMSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2Z1bmN0aW9uX3NlbGVjdF9pdGVtX18nIDogMTk7XG52YXIgRnVuY3Rpb25TZXRJbnB1dFZhbHVlJDEgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9zZXRfaW5wdXRfdmFsdWVfXycgOiAyMDtcbnZhciBGdW5jdGlvblJlc2V0JDIgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9yZXNldF9fJyA6IDIxO1xuXG52YXIgc3RhdGVDaGFuZ2VUeXBlcyQyID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICBfX3Byb3RvX186IG51bGwsXG4gIFRvZ2dsZUJ1dHRvbkNsaWNrOiBUb2dnbGVCdXR0b25DbGljayQxLFxuICBUb2dnbGVCdXR0b25LZXlEb3duQXJyb3dEb3duOiBUb2dnbGVCdXR0b25LZXlEb3duQXJyb3dEb3duLFxuICBUb2dnbGVCdXR0b25LZXlEb3duQXJyb3dVcDogVG9nZ2xlQnV0dG9uS2V5RG93bkFycm93VXAsXG4gIFRvZ2dsZUJ1dHRvbktleURvd25DaGFyYWN0ZXI6IFRvZ2dsZUJ1dHRvbktleURvd25DaGFyYWN0ZXIsXG4gIFRvZ2dsZUJ1dHRvbktleURvd25Fc2NhcGU6IFRvZ2dsZUJ1dHRvbktleURvd25Fc2NhcGUsXG4gIFRvZ2dsZUJ1dHRvbktleURvd25Ib21lOiBUb2dnbGVCdXR0b25LZXlEb3duSG9tZSxcbiAgVG9nZ2xlQnV0dG9uS2V5RG93bkVuZDogVG9nZ2xlQnV0dG9uS2V5RG93bkVuZCxcbiAgVG9nZ2xlQnV0dG9uS2V5RG93bkVudGVyOiBUb2dnbGVCdXR0b25LZXlEb3duRW50ZXIsXG4gIFRvZ2dsZUJ1dHRvbktleURvd25TcGFjZUJ1dHRvbjogVG9nZ2xlQnV0dG9uS2V5RG93blNwYWNlQnV0dG9uLFxuICBUb2dnbGVCdXR0b25LZXlEb3duUGFnZVVwOiBUb2dnbGVCdXR0b25LZXlEb3duUGFnZVVwLFxuICBUb2dnbGVCdXR0b25LZXlEb3duUGFnZURvd246IFRvZ2dsZUJ1dHRvbktleURvd25QYWdlRG93bixcbiAgVG9nZ2xlQnV0dG9uQmx1cjogVG9nZ2xlQnV0dG9uQmx1cixcbiAgTWVudU1vdXNlTGVhdmU6IE1lbnVNb3VzZUxlYXZlJDEsXG4gIEl0ZW1Nb3VzZU1vdmU6IEl0ZW1Nb3VzZU1vdmUkMSxcbiAgSXRlbUNsaWNrOiBJdGVtQ2xpY2skMSxcbiAgRnVuY3Rpb25Ub2dnbGVNZW51OiBGdW5jdGlvblRvZ2dsZU1lbnUkMSxcbiAgRnVuY3Rpb25PcGVuTWVudTogRnVuY3Rpb25PcGVuTWVudSQxLFxuICBGdW5jdGlvbkNsb3NlTWVudTogRnVuY3Rpb25DbG9zZU1lbnUkMSxcbiAgRnVuY3Rpb25TZXRIaWdobGlnaHRlZEluZGV4OiBGdW5jdGlvblNldEhpZ2hsaWdodGVkSW5kZXgkMSxcbiAgRnVuY3Rpb25TZWxlY3RJdGVtOiBGdW5jdGlvblNlbGVjdEl0ZW0kMSxcbiAgRnVuY3Rpb25TZXRJbnB1dFZhbHVlOiBGdW5jdGlvblNldElucHV0VmFsdWUkMSxcbiAgRnVuY3Rpb25SZXNldDogRnVuY3Rpb25SZXNldCQyXG59KTtcblxuLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSAqL1xuZnVuY3Rpb24gZG93bnNoaWZ0U2VsZWN0UmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIHZhciBfcHJvcHMkaXRlbXM7XG4gIHZhciB0eXBlID0gYWN0aW9uLnR5cGUsXG4gICAgcHJvcHMgPSBhY3Rpb24ucHJvcHMsXG4gICAgYWx0S2V5ID0gYWN0aW9uLmFsdEtleTtcbiAgdmFyIGNoYW5nZXM7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgSXRlbUNsaWNrJDE6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBpc09wZW46IGdldERlZmF1bHRWYWx1ZSQxKHByb3BzLCAnaXNPcGVuJyksXG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGdldERlZmF1bHRWYWx1ZSQxKHByb3BzLCAnaGlnaGxpZ2h0ZWRJbmRleCcpLFxuICAgICAgICBzZWxlY3RlZEl0ZW06IHByb3BzLml0ZW1zW2FjdGlvbi5pbmRleF1cbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIFRvZ2dsZUJ1dHRvbktleURvd25DaGFyYWN0ZXI6XG4gICAgICB7XG4gICAgICAgIHZhciBsb3dlcmNhc2VkS2V5ID0gYWN0aW9uLmtleTtcbiAgICAgICAgdmFyIGlucHV0VmFsdWUgPSBcIlwiICsgc3RhdGUuaW5wdXRWYWx1ZSArIGxvd2VyY2FzZWRLZXk7XG4gICAgICAgIHZhciBwcmV2SGlnaGxpZ2h0ZWRJbmRleCA9ICFzdGF0ZS5pc09wZW4gJiYgc3RhdGUuc2VsZWN0ZWRJdGVtID8gcHJvcHMuaXRlbXMuaW5kZXhPZihzdGF0ZS5zZWxlY3RlZEl0ZW0pIDogc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleDtcbiAgICAgICAgdmFyIGhpZ2hsaWdodGVkSW5kZXggPSBnZXRJdGVtSW5kZXhCeUNoYXJhY3RlcktleSh7XG4gICAgICAgICAga2V5c1NvRmFyOiBpbnB1dFZhbHVlLFxuICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IHByZXZIaWdobGlnaHRlZEluZGV4LFxuICAgICAgICAgIGl0ZW1zOiBwcm9wcy5pdGVtcyxcbiAgICAgICAgICBpdGVtVG9TdHJpbmc6IHByb3BzLml0ZW1Ub1N0cmluZyxcbiAgICAgICAgICBnZXRJdGVtTm9kZUZyb21JbmRleDogYWN0aW9uLmdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgIH0pO1xuICAgICAgICBjaGFuZ2VzID0ge1xuICAgICAgICAgIGlucHV0VmFsdWU6IGlucHV0VmFsdWUsXG4gICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogaGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgICAgICBpc09wZW46IHRydWVcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgVG9nZ2xlQnV0dG9uS2V5RG93bkFycm93RG93bjpcbiAgICAgIHtcbiAgICAgICAgdmFyIF9oaWdobGlnaHRlZEluZGV4ID0gc3RhdGUuaXNPcGVuID8gZ2V0TmV4dFdyYXBwaW5nSW5kZXgoMSwgc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCwgcHJvcHMuaXRlbXMubGVuZ3RoLCBhY3Rpb24uZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIGZhbHNlKSA6IGFsdEtleSAmJiBzdGF0ZS5zZWxlY3RlZEl0ZW0gPT0gbnVsbCA/IC0xIDogZ2V0SGlnaGxpZ2h0ZWRJbmRleE9uT3Blbihwcm9wcywgc3RhdGUsIDEpO1xuICAgICAgICBjaGFuZ2VzID0ge1xuICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IF9oaWdobGlnaHRlZEluZGV4LFxuICAgICAgICAgIGlzT3BlbjogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBUb2dnbGVCdXR0b25LZXlEb3duQXJyb3dVcDpcbiAgICAgIGlmIChzdGF0ZS5pc09wZW4gJiYgYWx0S2V5KSB7XG4gICAgICAgIGNoYW5nZXMgPSBnZXRDaGFuZ2VzT25TZWxlY3Rpb24ocHJvcHMsIHN0YXRlLmhpZ2hsaWdodGVkSW5kZXgsIGZhbHNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBfaGlnaGxpZ2h0ZWRJbmRleDIgPSBzdGF0ZS5pc09wZW4gPyBnZXROZXh0V3JhcHBpbmdJbmRleCgtMSwgc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCwgcHJvcHMuaXRlbXMubGVuZ3RoLCBhY3Rpb24uZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIGZhbHNlKSA6IGdldEhpZ2hsaWdodGVkSW5kZXhPbk9wZW4ocHJvcHMsIHN0YXRlLCAtMSk7XG4gICAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogX2hpZ2hsaWdodGVkSW5kZXgyLFxuICAgICAgICAgIGlzT3BlbjogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgLy8gb25seSB0cmlnZ2VyZWQgd2hlbiBtZW51IGlzIG9wZW4uXG4gICAgY2FzZSBUb2dnbGVCdXR0b25LZXlEb3duRW50ZXI6XG4gICAgY2FzZSBUb2dnbGVCdXR0b25LZXlEb3duU3BhY2VCdXR0b246XG4gICAgICBjaGFuZ2VzID0gZ2V0Q2hhbmdlc09uU2VsZWN0aW9uKHByb3BzLCBzdGF0ZS5oaWdobGlnaHRlZEluZGV4LCBmYWxzZSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFRvZ2dsZUJ1dHRvbktleURvd25Ib21lOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0TmV4dE5vbkRpc2FibGVkSW5kZXgoMSwgMCwgcHJvcHMuaXRlbXMubGVuZ3RoLCBhY3Rpb24uZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIGZhbHNlKSxcbiAgICAgICAgaXNPcGVuOiB0cnVlXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBUb2dnbGVCdXR0b25LZXlEb3duRW5kOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0TmV4dE5vbkRpc2FibGVkSW5kZXgoLTEsIHByb3BzLml0ZW1zLmxlbmd0aCAtIDEsIHByb3BzLml0ZW1zLmxlbmd0aCwgYWN0aW9uLmdldEl0ZW1Ob2RlRnJvbUluZGV4LCBmYWxzZSksXG4gICAgICAgIGlzT3BlbjogdHJ1ZVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgVG9nZ2xlQnV0dG9uS2V5RG93blBhZ2VVcDpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGdldE5leHRXcmFwcGluZ0luZGV4KC0xMCwgc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCwgcHJvcHMuaXRlbXMubGVuZ3RoLCBhY3Rpb24uZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIGZhbHNlKVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgVG9nZ2xlQnV0dG9uS2V5RG93blBhZ2VEb3duOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0TmV4dFdyYXBwaW5nSW5kZXgoMTAsIHN0YXRlLmhpZ2hsaWdodGVkSW5kZXgsIHByb3BzLml0ZW1zLmxlbmd0aCwgYWN0aW9uLmdldEl0ZW1Ob2RlRnJvbUluZGV4LCBmYWxzZSlcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIFRvZ2dsZUJ1dHRvbktleURvd25Fc2NhcGU6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBpc09wZW46IGZhbHNlLFxuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiAtMVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgVG9nZ2xlQnV0dG9uQmx1cjpcbiAgICAgIGNoYW5nZXMgPSBfZXh0ZW5kcyh7XG4gICAgICAgIGlzT3BlbjogZmFsc2UsXG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IC0xXG4gICAgICB9LCBzdGF0ZS5oaWdobGlnaHRlZEluZGV4ID49IDAgJiYgKChfcHJvcHMkaXRlbXMgPSBwcm9wcy5pdGVtcykgPT0gbnVsbCA/IHZvaWQgMCA6IF9wcm9wcyRpdGVtcy5sZW5ndGgpICYmIHtcbiAgICAgICAgc2VsZWN0ZWRJdGVtOiBwcm9wcy5pdGVtc1tzdGF0ZS5oaWdobGlnaHRlZEluZGV4XVxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIEZ1bmN0aW9uU2VsZWN0SXRlbSQxOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgc2VsZWN0ZWRJdGVtOiBhY3Rpb24uc2VsZWN0ZWRJdGVtXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBkb3duc2hpZnRDb21tb25SZWR1Y2VyKHN0YXRlLCBhY3Rpb24sIHN0YXRlQ2hhbmdlVHlwZXMkMik7XG4gIH1cbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwgY2hhbmdlcyk7XG59XG4vKiBlc2xpbnQtZW5hYmxlIGNvbXBsZXhpdHkgKi9cblxudmFyIF9leGNsdWRlZCQyID0gW1wib25Nb3VzZUxlYXZlXCIsIFwicmVmS2V5XCIsIFwib25LZXlEb3duXCIsIFwib25CbHVyXCIsIFwicmVmXCJdLFxuICBfZXhjbHVkZWQyJDIgPSBbXCJvbkJsdXJcIiwgXCJvbkNsaWNrXCIsIFwib25QcmVzc1wiLCBcIm9uS2V5RG93blwiLCBcInJlZktleVwiLCBcInJlZlwiXSxcbiAgX2V4Y2x1ZGVkMyQxID0gW1wiaXRlbVwiLCBcImluZGV4XCIsIFwib25Nb3VzZU1vdmVcIiwgXCJvbkNsaWNrXCIsIFwib25QcmVzc1wiLCBcInJlZktleVwiLCBcInJlZlwiLCBcImRpc2FibGVkXCJdO1xudXNlU2VsZWN0LnN0YXRlQ2hhbmdlVHlwZXMgPSBzdGF0ZUNoYW5nZVR5cGVzJDI7XG5mdW5jdGlvbiB1c2VTZWxlY3QodXNlclByb3BzKSB7XG4gIGlmICh1c2VyUHJvcHMgPT09IHZvaWQgMCkge1xuICAgIHVzZXJQcm9wcyA9IHt9O1xuICB9XG4gIHZhbGlkYXRlUHJvcFR5cGVzJDIodXNlclByb3BzLCB1c2VTZWxlY3QpO1xuICAvLyBQcm9wcyBkZWZhdWx0cyBhbmQgZGVzdHJ1Y3R1cmluZy5cbiAgdmFyIHByb3BzID0gX2V4dGVuZHMoe30sIGRlZmF1bHRQcm9wcyQyLCB1c2VyUHJvcHMpO1xuICB2YXIgaXRlbXMgPSBwcm9wcy5pdGVtcyxcbiAgICBzY3JvbGxJbnRvVmlldyA9IHByb3BzLnNjcm9sbEludG9WaWV3LFxuICAgIGVudmlyb25tZW50ID0gcHJvcHMuZW52aXJvbm1lbnQsXG4gICAgaXRlbVRvU3RyaW5nID0gcHJvcHMuaXRlbVRvU3RyaW5nLFxuICAgIGdldEExMXlTZWxlY3Rpb25NZXNzYWdlID0gcHJvcHMuZ2V0QTExeVNlbGVjdGlvbk1lc3NhZ2UsXG4gICAgZ2V0QTExeVN0YXR1c01lc3NhZ2UgPSBwcm9wcy5nZXRBMTF5U3RhdHVzTWVzc2FnZTtcbiAgLy8gSW5pdGlhbCBzdGF0ZSBkZXBlbmRpbmcgb24gY29udHJvbGxlZCBwcm9wcy5cbiAgdmFyIGluaXRpYWxTdGF0ZSA9IGdldEluaXRpYWxTdGF0ZSQyKHByb3BzKTtcbiAgdmFyIF91c2VDb250cm9sbGVkUmVkdWNlciA9IHVzZUNvbnRyb2xsZWRSZWR1Y2VyJDEoZG93bnNoaWZ0U2VsZWN0UmVkdWNlciwgaW5pdGlhbFN0YXRlLCBwcm9wcyksXG4gICAgc3RhdGUgPSBfdXNlQ29udHJvbGxlZFJlZHVjZXJbMF0sXG4gICAgZGlzcGF0Y2ggPSBfdXNlQ29udHJvbGxlZFJlZHVjZXJbMV07XG4gIHZhciBpc09wZW4gPSBzdGF0ZS5pc09wZW4sXG4gICAgaGlnaGxpZ2h0ZWRJbmRleCA9IHN0YXRlLmhpZ2hsaWdodGVkSW5kZXgsXG4gICAgc2VsZWN0ZWRJdGVtID0gc3RhdGUuc2VsZWN0ZWRJdGVtLFxuICAgIGlucHV0VmFsdWUgPSBzdGF0ZS5pbnB1dFZhbHVlO1xuXG4gIC8vIEVsZW1lbnQgZWZzLlxuICB2YXIgdG9nZ2xlQnV0dG9uUmVmID0gdXNlUmVmKG51bGwpO1xuICB2YXIgbWVudVJlZiA9IHVzZVJlZihudWxsKTtcbiAgdmFyIGl0ZW1SZWZzID0gdXNlUmVmKHt9KTtcbiAgLy8gdXNlZCB0byBrZWVwIHRoZSBpbnB1dFZhbHVlIGNsZWFyVGltZW91dCBvYmplY3QgYmV0d2VlbiByZW5kZXJzLlxuICB2YXIgY2xlYXJUaW1lb3V0UmVmID0gdXNlUmVmKG51bGwpO1xuICAvLyBwcmV2ZW50IGlkIHJlLWdlbmVyYXRpb24gYmV0d2VlbiByZW5kZXJzLlxuICB2YXIgZWxlbWVudElkcyA9IHVzZUVsZW1lbnRJZHMocHJvcHMpO1xuICAvLyB1c2VkIHRvIGtlZXAgdHJhY2sgb2YgaG93IG1hbnkgaXRlbXMgd2UgaGFkIG9uIHByZXZpb3VzIGN5Y2xlLlxuICB2YXIgcHJldmlvdXNSZXN1bHRDb3VudFJlZiA9IHVzZVJlZigpO1xuICB2YXIgaXNJbml0aWFsTW91bnRSZWYgPSB1c2VSZWYodHJ1ZSk7XG4gIC8vIHV0aWxpdHkgY2FsbGJhY2sgdG8gZ2V0IGl0ZW0gZWxlbWVudC5cbiAgdmFyIGxhdGVzdCA9IHVzZUxhdGVzdFJlZih7XG4gICAgc3RhdGU6IHN0YXRlLFxuICAgIHByb3BzOiBwcm9wc1xuICB9KTtcblxuICAvLyBTb21lIHV0aWxzLlxuICB2YXIgZ2V0SXRlbU5vZGVGcm9tSW5kZXggPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICByZXR1cm4gaXRlbVJlZnMuY3VycmVudFtlbGVtZW50SWRzLmdldEl0ZW1JZChpbmRleCldO1xuICB9LCBbZWxlbWVudElkc10pO1xuXG4gIC8vIEVmZmVjdHMuXG4gIC8vIFNldHMgYTExeSBzdGF0dXMgbWVzc2FnZSBvbiBjaGFuZ2VzIGluIHN0YXRlLlxuICB1c2VBMTF5TWVzc2FnZVNldHRlcihnZXRBMTF5U3RhdHVzTWVzc2FnZSwgW2lzT3BlbiwgaGlnaGxpZ2h0ZWRJbmRleCwgaW5wdXRWYWx1ZSwgaXRlbXNdLCBfZXh0ZW5kcyh7XG4gICAgaXNJbml0aWFsTW91bnQ6IGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQsXG4gICAgcHJldmlvdXNSZXN1bHRDb3VudDogcHJldmlvdXNSZXN1bHRDb3VudFJlZi5jdXJyZW50LFxuICAgIGl0ZW1zOiBpdGVtcyxcbiAgICBlbnZpcm9ubWVudDogZW52aXJvbm1lbnQsXG4gICAgaXRlbVRvU3RyaW5nOiBpdGVtVG9TdHJpbmdcbiAgfSwgc3RhdGUpKTtcbiAgLy8gU2V0cyBhMTF5IHN0YXR1cyBtZXNzYWdlIG9uIGNoYW5nZXMgaW4gc2VsZWN0ZWRJdGVtLlxuICB1c2VBMTF5TWVzc2FnZVNldHRlcihnZXRBMTF5U2VsZWN0aW9uTWVzc2FnZSwgW3NlbGVjdGVkSXRlbV0sIF9leHRlbmRzKHtcbiAgICBpc0luaXRpYWxNb3VudDogaXNJbml0aWFsTW91bnRSZWYuY3VycmVudCxcbiAgICBwcmV2aW91c1Jlc3VsdENvdW50OiBwcmV2aW91c1Jlc3VsdENvdW50UmVmLmN1cnJlbnQsXG4gICAgaXRlbXM6IGl0ZW1zLFxuICAgIGVudmlyb25tZW50OiBlbnZpcm9ubWVudCxcbiAgICBpdGVtVG9TdHJpbmc6IGl0ZW1Ub1N0cmluZ1xuICB9LCBzdGF0ZSkpO1xuICAvLyBTY3JvbGwgb24gaGlnaGxpZ2h0ZWQgaXRlbSBpZiBjaGFuZ2UgY29tZXMgZnJvbSBrZXlib2FyZC5cbiAgdmFyIHNob3VsZFNjcm9sbFJlZiA9IHVzZVNjcm9sbEludG9WaWV3KHtcbiAgICBtZW51RWxlbWVudDogbWVudVJlZi5jdXJyZW50LFxuICAgIGhpZ2hsaWdodGVkSW5kZXg6IGhpZ2hsaWdodGVkSW5kZXgsXG4gICAgaXNPcGVuOiBpc09wZW4sXG4gICAgaXRlbVJlZnM6IGl0ZW1SZWZzLFxuICAgIHNjcm9sbEludG9WaWV3OiBzY3JvbGxJbnRvVmlldyxcbiAgICBnZXRJdGVtTm9kZUZyb21JbmRleDogZ2V0SXRlbU5vZGVGcm9tSW5kZXhcbiAgfSk7XG5cbiAgLy8gU2V0cyBjbGVhbnVwIGZvciB0aGUga2V5c1NvRmFyIGNhbGxiYWNrLCBkZWJvdW5kZWQgYWZ0ZXIgNTAwbXMuXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgLy8gaW5pdCB0aGUgY2xlYW4gZnVuY3Rpb24gaGVyZSBhcyB3ZSBuZWVkIGFjY2VzcyB0byBkaXNwYXRjaC5cbiAgICBjbGVhclRpbWVvdXRSZWYuY3VycmVudCA9IGRlYm91bmNlKGZ1bmN0aW9uIChvdXRlckRpc3BhdGNoKSB7XG4gICAgICBvdXRlckRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogRnVuY3Rpb25TZXRJbnB1dFZhbHVlJDEsXG4gICAgICAgIGlucHV0VmFsdWU6ICcnXG4gICAgICB9KTtcbiAgICB9LCA1MDApO1xuXG4gICAgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGRlYm91bmNlZCBjYWxscyBvbiBtb3VudFxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBjbGVhclRpbWVvdXRSZWYuY3VycmVudC5jYW5jZWwoKTtcbiAgICB9O1xuICB9LCBbXSk7XG5cbiAgLy8gSW52b2tlcyB0aGUga2V5c1NvRmFyIGNhbGxiYWNrIHNldCB1cCBhYm92ZS5cbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWlucHV0VmFsdWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2xlYXJUaW1lb3V0UmVmLmN1cnJlbnQoZGlzcGF0Y2gpO1xuICB9LCBbZGlzcGF0Y2gsIGlucHV0VmFsdWVdKTtcbiAgdXNlQ29udHJvbFByb3BzVmFsaWRhdG9yKHtcbiAgICBpc0luaXRpYWxNb3VudDogaXNJbml0aWFsTW91bnRSZWYuY3VycmVudCxcbiAgICBwcm9wczogcHJvcHMsXG4gICAgc3RhdGU6IHN0YXRlXG4gIH0pO1xuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlmIChpc0luaXRpYWxNb3VudFJlZi5jdXJyZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHByZXZpb3VzUmVzdWx0Q291bnRSZWYuY3VycmVudCA9IGl0ZW1zLmxlbmd0aDtcbiAgfSk7XG4gIC8vIEFkZCBtb3VzZS90b3VjaCBldmVudHMgdG8gZG9jdW1lbnQuXG4gIHZhciBtb3VzZUFuZFRvdWNoVHJhY2tlcnNSZWYgPSB1c2VNb3VzZUFuZFRvdWNoVHJhY2tlcihpc09wZW4sIFttZW51UmVmLCB0b2dnbGVCdXR0b25SZWZdLCBlbnZpcm9ubWVudCwgZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IFRvZ2dsZUJ1dHRvbkJsdXJcbiAgICB9KTtcbiAgfSk7XG4gIHZhciBzZXRHZXR0ZXJQcm9wQ2FsbEluZm8gPSB1c2VHZXR0ZXJQcm9wc0NhbGxlZENoZWNrZXIoJ2dldE1lbnVQcm9wcycsICdnZXRUb2dnbGVCdXR0b25Qcm9wcycpO1xuICAvLyBNYWtlIGluaXRpYWwgcmVmIGZhbHNlLlxuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQgPSBmYWxzZTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgaXNJbml0aWFsTW91bnRSZWYuY3VycmVudCA9IHRydWU7XG4gICAgfTtcbiAgfSwgW10pO1xuICAvLyBSZXNldCBpdGVtUmVmcyBvbiBjbG9zZS5cbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWlzT3Blbikge1xuICAgICAgaXRlbVJlZnMuY3VycmVudCA9IHt9O1xuICAgIH1cbiAgfSwgW2lzT3Blbl0pO1xuXG4gIC8vIEV2ZW50IGhhbmRsZXIgZnVuY3Rpb25zLlxuICB2YXIgdG9nZ2xlQnV0dG9uS2V5RG93bkhhbmRsZXJzID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIEFycm93RG93bjogZnVuY3Rpb24gQXJyb3dEb3duKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBUb2dnbGVCdXR0b25LZXlEb3duQXJyb3dEb3duLFxuICAgICAgICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4OiBnZXRJdGVtTm9kZUZyb21JbmRleCxcbiAgICAgICAgICBhbHRLZXk6IGV2ZW50LmFsdEtleVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBBcnJvd1VwOiBmdW5jdGlvbiBBcnJvd1VwKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBUb2dnbGVCdXR0b25LZXlEb3duQXJyb3dVcCxcbiAgICAgICAgICBnZXRJdGVtTm9kZUZyb21JbmRleDogZ2V0SXRlbU5vZGVGcm9tSW5kZXgsXG4gICAgICAgICAgYWx0S2V5OiBldmVudC5hbHRLZXlcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgSG9tZTogZnVuY3Rpb24gSG9tZShldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogVG9nZ2xlQnV0dG9uS2V5RG93bkhvbWUsXG4gICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIEVuZDogZnVuY3Rpb24gRW5kKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBUb2dnbGVCdXR0b25LZXlEb3duRW5kLFxuICAgICAgICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4OiBnZXRJdGVtTm9kZUZyb21JbmRleFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBFc2NhcGU6IGZ1bmN0aW9uIEVzY2FwZSgpIHtcbiAgICAgICAgaWYgKGxhdGVzdC5jdXJyZW50LnN0YXRlLmlzT3Blbikge1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IFRvZ2dsZUJ1dHRvbktleURvd25Fc2NhcGVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIEVudGVyOiBmdW5jdGlvbiBFbnRlcihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogbGF0ZXN0LmN1cnJlbnQuc3RhdGUuaXNPcGVuID8gVG9nZ2xlQnV0dG9uS2V5RG93bkVudGVyIDogVG9nZ2xlQnV0dG9uQ2xpY2skMVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBQYWdlVXA6IGZ1bmN0aW9uIFBhZ2VVcChldmVudCkge1xuICAgICAgICBpZiAobGF0ZXN0LmN1cnJlbnQuc3RhdGUuaXNPcGVuKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBUb2dnbGVCdXR0b25LZXlEb3duUGFnZVVwLFxuICAgICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBQYWdlRG93bjogZnVuY3Rpb24gUGFnZURvd24oZXZlbnQpIHtcbiAgICAgICAgaWYgKGxhdGVzdC5jdXJyZW50LnN0YXRlLmlzT3Blbikge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogVG9nZ2xlQnV0dG9uS2V5RG93blBhZ2VEb3duLFxuICAgICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnICc6IGZ1bmN0aW9uIF8oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGN1cnJlbnRTdGF0ZSA9IGxhdGVzdC5jdXJyZW50LnN0YXRlO1xuICAgICAgICBpZiAoIWN1cnJlbnRTdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBUb2dnbGVCdXR0b25DbGljayQxXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJyZW50U3RhdGUuaW5wdXRWYWx1ZSkge1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IFRvZ2dsZUJ1dHRvbktleURvd25DaGFyYWN0ZXIsXG4gICAgICAgICAgICBrZXk6ICcgJyxcbiAgICAgICAgICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4OiBnZXRJdGVtTm9kZUZyb21JbmRleFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IFRvZ2dsZUJ1dHRvbktleURvd25TcGFjZUJ1dHRvblxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSwgW2Rpc3BhdGNoLCBnZXRJdGVtTm9kZUZyb21JbmRleCwgbGF0ZXN0XSk7XG5cbiAgLy8gQWN0aW9uIGZ1bmN0aW9ucy5cbiAgdmFyIHRvZ2dsZU1lbnUgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25Ub2dnbGVNZW51JDFcbiAgICB9KTtcbiAgfSwgW2Rpc3BhdGNoXSk7XG4gIHZhciBjbG9zZU1lbnUgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25DbG9zZU1lbnUkMVxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgdmFyIG9wZW5NZW51ID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uT3Blbk1lbnUkMVxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgdmFyIHNldEhpZ2hsaWdodGVkSW5kZXggPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAobmV3SGlnaGxpZ2h0ZWRJbmRleCkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uU2V0SGlnaGxpZ2h0ZWRJbmRleCQxLFxuICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogbmV3SGlnaGxpZ2h0ZWRJbmRleFxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgdmFyIHNlbGVjdEl0ZW0gPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAobmV3U2VsZWN0ZWRJdGVtKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25TZWxlY3RJdGVtJDEsXG4gICAgICBzZWxlY3RlZEl0ZW06IG5ld1NlbGVjdGVkSXRlbVxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgdmFyIHJlc2V0ID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uUmVzZXQkMlxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgdmFyIHNldElucHV0VmFsdWUgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAobmV3SW5wdXRWYWx1ZSkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uU2V0SW5wdXRWYWx1ZSQxLFxuICAgICAgaW5wdXRWYWx1ZTogbmV3SW5wdXRWYWx1ZVxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgLy8gR2V0dGVyIGZ1bmN0aW9ucy5cbiAgdmFyIGdldExhYmVsUHJvcHMgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAobGFiZWxQcm9wcykge1xuICAgIHJldHVybiBfZXh0ZW5kcyh7XG4gICAgICBpZDogZWxlbWVudElkcy5sYWJlbElkLFxuICAgICAgaHRtbEZvcjogZWxlbWVudElkcy50b2dnbGVCdXR0b25JZFxuICAgIH0sIGxhYmVsUHJvcHMpO1xuICB9LCBbZWxlbWVudElkc10pO1xuICB2YXIgZ2V0TWVudVByb3BzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKF90ZW1wLCBfdGVtcDIpIHtcbiAgICB2YXIgX2V4dGVuZHMyO1xuICAgIHZhciBfcmVmID0gX3RlbXAgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAsXG4gICAgICBvbk1vdXNlTGVhdmUgPSBfcmVmLm9uTW91c2VMZWF2ZSxcbiAgICAgIF9yZWYkcmVmS2V5ID0gX3JlZi5yZWZLZXksXG4gICAgICByZWZLZXkgPSBfcmVmJHJlZktleSA9PT0gdm9pZCAwID8gJ3JlZicgOiBfcmVmJHJlZktleTtcbiAgICAgIF9yZWYub25LZXlEb3duO1xuICAgICAgX3JlZi5vbkJsdXI7XG4gICAgICB2YXIgcmVmID0gX3JlZi5yZWYsXG4gICAgICByZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZiwgX2V4Y2x1ZGVkJDIpO1xuICAgIHZhciBfcmVmMiA9IF90ZW1wMiA9PT0gdm9pZCAwID8ge30gOiBfdGVtcDIsXG4gICAgICBfcmVmMiRzdXBwcmVzc1JlZkVycm8gPSBfcmVmMi5zdXBwcmVzc1JlZkVycm9yLFxuICAgICAgc3VwcHJlc3NSZWZFcnJvciA9IF9yZWYyJHN1cHByZXNzUmVmRXJybyA9PT0gdm9pZCAwID8gZmFsc2UgOiBfcmVmMiRzdXBwcmVzc1JlZkVycm87XG4gICAgdmFyIG1lbnVIYW5kbGVNb3VzZUxlYXZlID0gZnVuY3Rpb24gbWVudUhhbmRsZU1vdXNlTGVhdmUoKSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IE1lbnVNb3VzZUxlYXZlJDFcbiAgICAgIH0pO1xuICAgIH07XG4gICAgc2V0R2V0dGVyUHJvcENhbGxJbmZvKCdnZXRNZW51UHJvcHMnLCBzdXBwcmVzc1JlZkVycm9yLCByZWZLZXksIG1lbnVSZWYpO1xuICAgIHJldHVybiBfZXh0ZW5kcygoX2V4dGVuZHMyID0ge30sIF9leHRlbmRzMltyZWZLZXldID0gaGFuZGxlUmVmcyhyZWYsIGZ1bmN0aW9uIChtZW51Tm9kZSkge1xuICAgICAgbWVudVJlZi5jdXJyZW50ID0gbWVudU5vZGU7XG4gICAgfSksIF9leHRlbmRzMi5pZCA9IGVsZW1lbnRJZHMubWVudUlkLCBfZXh0ZW5kczIucm9sZSA9ICdsaXN0Ym94JywgX2V4dGVuZHMyWydhcmlhLWxhYmVsbGVkYnknXSA9IHJlc3QgJiYgcmVzdFsnYXJpYS1sYWJlbCddID8gdW5kZWZpbmVkIDogXCJcIiArIGVsZW1lbnRJZHMubGFiZWxJZCwgX2V4dGVuZHMyLm9uTW91c2VMZWF2ZSA9IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uTW91c2VMZWF2ZSwgbWVudUhhbmRsZU1vdXNlTGVhdmUpLCBfZXh0ZW5kczIpLCByZXN0KTtcbiAgfSwgW2Rpc3BhdGNoLCBzZXRHZXR0ZXJQcm9wQ2FsbEluZm8sIGVsZW1lbnRJZHNdKTtcbiAgdmFyIGdldFRvZ2dsZUJ1dHRvblByb3BzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKF90ZW1wMywgX3RlbXA0KSB7XG4gICAgdmFyIF9leHRlbmRzMztcbiAgICB2YXIgX3JlZjMgPSBfdGVtcDMgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAzLFxuICAgICAgb25CbHVyID0gX3JlZjMub25CbHVyLFxuICAgICAgb25DbGljayA9IF9yZWYzLm9uQ2xpY2s7XG4gICAgICBfcmVmMy5vblByZXNzO1xuICAgICAgdmFyIG9uS2V5RG93biA9IF9yZWYzLm9uS2V5RG93bixcbiAgICAgIF9yZWYzJHJlZktleSA9IF9yZWYzLnJlZktleSxcbiAgICAgIHJlZktleSA9IF9yZWYzJHJlZktleSA9PT0gdm9pZCAwID8gJ3JlZicgOiBfcmVmMyRyZWZLZXksXG4gICAgICByZWYgPSBfcmVmMy5yZWYsXG4gICAgICByZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZjMsIF9leGNsdWRlZDIkMik7XG4gICAgdmFyIF9yZWY0ID0gX3RlbXA0ID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wNCxcbiAgICAgIF9yZWY0JHN1cHByZXNzUmVmRXJybyA9IF9yZWY0LnN1cHByZXNzUmVmRXJyb3IsXG4gICAgICBzdXBwcmVzc1JlZkVycm9yID0gX3JlZjQkc3VwcHJlc3NSZWZFcnJvID09PSB2b2lkIDAgPyBmYWxzZSA6IF9yZWY0JHN1cHByZXNzUmVmRXJybztcbiAgICB2YXIgbGF0ZXN0U3RhdGUgPSBsYXRlc3QuY3VycmVudC5zdGF0ZTtcbiAgICB2YXIgdG9nZ2xlQnV0dG9uSGFuZGxlQ2xpY2sgPSBmdW5jdGlvbiB0b2dnbGVCdXR0b25IYW5kbGVDbGljaygpIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogVG9nZ2xlQnV0dG9uQ2xpY2skMVxuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgdG9nZ2xlQnV0dG9uSGFuZGxlQmx1ciA9IGZ1bmN0aW9uIHRvZ2dsZUJ1dHRvbkhhbmRsZUJsdXIoKSB7XG4gICAgICBpZiAobGF0ZXN0U3RhdGUuaXNPcGVuICYmICFtb3VzZUFuZFRvdWNoVHJhY2tlcnNSZWYuY3VycmVudC5pc01vdXNlRG93bikge1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogVG9nZ2xlQnV0dG9uQmx1clxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciB0b2dnbGVCdXR0b25IYW5kbGVLZXlEb3duID0gZnVuY3Rpb24gdG9nZ2xlQnV0dG9uSGFuZGxlS2V5RG93bihldmVudCkge1xuICAgICAgdmFyIGtleSA9IG5vcm1hbGl6ZUFycm93S2V5KGV2ZW50KTtcbiAgICAgIGlmIChrZXkgJiYgdG9nZ2xlQnV0dG9uS2V5RG93bkhhbmRsZXJzW2tleV0pIHtcbiAgICAgICAgdG9nZ2xlQnV0dG9uS2V5RG93bkhhbmRsZXJzW2tleV0oZXZlbnQpO1xuICAgICAgfSBlbHNlIGlmIChpc0FjY2VwdGVkQ2hhcmFjdGVyS2V5KGtleSkpIHtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IFRvZ2dsZUJ1dHRvbktleURvd25DaGFyYWN0ZXIsXG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIHRvZ2dsZVByb3BzID0gX2V4dGVuZHMoKF9leHRlbmRzMyA9IHt9LCBfZXh0ZW5kczNbcmVmS2V5XSA9IGhhbmRsZVJlZnMocmVmLCBmdW5jdGlvbiAodG9nZ2xlQnV0dG9uTm9kZSkge1xuICAgICAgdG9nZ2xlQnV0dG9uUmVmLmN1cnJlbnQgPSB0b2dnbGVCdXR0b25Ob2RlO1xuICAgIH0pLCBfZXh0ZW5kczNbJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCddID0gbGF0ZXN0U3RhdGUuaXNPcGVuICYmIGxhdGVzdFN0YXRlLmhpZ2hsaWdodGVkSW5kZXggPiAtMSA/IGVsZW1lbnRJZHMuZ2V0SXRlbUlkKGxhdGVzdFN0YXRlLmhpZ2hsaWdodGVkSW5kZXgpIDogJycsIF9leHRlbmRzM1snYXJpYS1jb250cm9scyddID0gZWxlbWVudElkcy5tZW51SWQsIF9leHRlbmRzM1snYXJpYS1leHBhbmRlZCddID0gbGF0ZXN0LmN1cnJlbnQuc3RhdGUuaXNPcGVuLCBfZXh0ZW5kczNbJ2FyaWEtaGFzcG9wdXAnXSA9ICdsaXN0Ym94JywgX2V4dGVuZHMzWydhcmlhLWxhYmVsbGVkYnknXSA9IHJlc3QgJiYgcmVzdFsnYXJpYS1sYWJlbCddID8gdW5kZWZpbmVkIDogXCJcIiArIGVsZW1lbnRJZHMubGFiZWxJZCwgX2V4dGVuZHMzLmlkID0gZWxlbWVudElkcy50b2dnbGVCdXR0b25JZCwgX2V4dGVuZHMzLnJvbGUgPSAnY29tYm9ib3gnLCBfZXh0ZW5kczMudGFiSW5kZXggPSAwLCBfZXh0ZW5kczMub25CbHVyID0gY2FsbEFsbEV2ZW50SGFuZGxlcnMob25CbHVyLCB0b2dnbGVCdXR0b25IYW5kbGVCbHVyKSwgX2V4dGVuZHMzKSwgcmVzdCk7XG4gICAgaWYgKCFyZXN0LmRpc2FibGVkKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKHJlYWN0LW5hdGl2ZSkgKi9cbiAgICAgIHtcbiAgICAgICAgdG9nZ2xlUHJvcHMub25DbGljayA9IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uQ2xpY2ssIHRvZ2dsZUJ1dHRvbkhhbmRsZUNsaWNrKTtcbiAgICAgICAgdG9nZ2xlUHJvcHMub25LZXlEb3duID0gY2FsbEFsbEV2ZW50SGFuZGxlcnMob25LZXlEb3duLCB0b2dnbGVCdXR0b25IYW5kbGVLZXlEb3duKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2V0R2V0dGVyUHJvcENhbGxJbmZvKCdnZXRUb2dnbGVCdXR0b25Qcm9wcycsIHN1cHByZXNzUmVmRXJyb3IsIHJlZktleSwgdG9nZ2xlQnV0dG9uUmVmKTtcbiAgICByZXR1cm4gdG9nZ2xlUHJvcHM7XG4gIH0sIFtsYXRlc3QsIGVsZW1lbnRJZHMsIHNldEdldHRlclByb3BDYWxsSW5mbywgZGlzcGF0Y2gsIG1vdXNlQW5kVG91Y2hUcmFja2Vyc1JlZiwgdG9nZ2xlQnV0dG9uS2V5RG93bkhhbmRsZXJzLCBnZXRJdGVtTm9kZUZyb21JbmRleF0pO1xuICB2YXIgZ2V0SXRlbVByb3BzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKF90ZW1wNSkge1xuICAgIHZhciBfZXh0ZW5kczQ7XG4gICAgdmFyIF9yZWY1ID0gX3RlbXA1ID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wNSxcbiAgICAgIGl0ZW1Qcm9wID0gX3JlZjUuaXRlbSxcbiAgICAgIGluZGV4UHJvcCA9IF9yZWY1LmluZGV4LFxuICAgICAgb25Nb3VzZU1vdmUgPSBfcmVmNS5vbk1vdXNlTW92ZSxcbiAgICAgIG9uQ2xpY2sgPSBfcmVmNS5vbkNsaWNrO1xuICAgICAgX3JlZjUub25QcmVzcztcbiAgICAgIHZhciBfcmVmNSRyZWZLZXkgPSBfcmVmNS5yZWZLZXksXG4gICAgICByZWZLZXkgPSBfcmVmNSRyZWZLZXkgPT09IHZvaWQgMCA/ICdyZWYnIDogX3JlZjUkcmVmS2V5LFxuICAgICAgcmVmID0gX3JlZjUucmVmLFxuICAgICAgZGlzYWJsZWQgPSBfcmVmNS5kaXNhYmxlZCxcbiAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmNSwgX2V4Y2x1ZGVkMyQxKTtcbiAgICB2YXIgX2xhdGVzdCRjdXJyZW50ID0gbGF0ZXN0LmN1cnJlbnQsXG4gICAgICBsYXRlc3RTdGF0ZSA9IF9sYXRlc3QkY3VycmVudC5zdGF0ZSxcbiAgICAgIGxhdGVzdFByb3BzID0gX2xhdGVzdCRjdXJyZW50LnByb3BzO1xuICAgIHZhciBfZ2V0SXRlbUFuZEluZGV4ID0gZ2V0SXRlbUFuZEluZGV4KGl0ZW1Qcm9wLCBpbmRleFByb3AsIGxhdGVzdFByb3BzLml0ZW1zLCAnUGFzcyBlaXRoZXIgaXRlbSBvciBpbmRleCB0byBnZXRJdGVtUHJvcHMhJyksXG4gICAgICBpdGVtID0gX2dldEl0ZW1BbmRJbmRleFswXSxcbiAgICAgIGluZGV4ID0gX2dldEl0ZW1BbmRJbmRleFsxXTtcbiAgICB2YXIgaXRlbUhhbmRsZU1vdXNlTW92ZSA9IGZ1bmN0aW9uIGl0ZW1IYW5kbGVNb3VzZU1vdmUoKSB7XG4gICAgICBpZiAoaW5kZXggPT09IGxhdGVzdFN0YXRlLmhpZ2hsaWdodGVkSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2hvdWxkU2Nyb2xsUmVmLmN1cnJlbnQgPSBmYWxzZTtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogSXRlbU1vdXNlTW92ZSQxLFxuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIGRpc2FibGVkOiBkaXNhYmxlZFxuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgaXRlbUhhbmRsZUNsaWNrID0gZnVuY3Rpb24gaXRlbUhhbmRsZUNsaWNrKCkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBJdGVtQ2xpY2skMSxcbiAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBpdGVtUHJvcHMgPSBfZXh0ZW5kcygoX2V4dGVuZHM0ID0ge1xuICAgICAgZGlzYWJsZWQ6IGRpc2FibGVkLFxuICAgICAgcm9sZTogJ29wdGlvbicsXG4gICAgICAnYXJpYS1zZWxlY3RlZCc6IFwiXCIgKyAoaXRlbSA9PT0gc2VsZWN0ZWRJdGVtKSxcbiAgICAgIGlkOiBlbGVtZW50SWRzLmdldEl0ZW1JZChpbmRleClcbiAgICB9LCBfZXh0ZW5kczRbcmVmS2V5XSA9IGhhbmRsZVJlZnMocmVmLCBmdW5jdGlvbiAoaXRlbU5vZGUpIHtcbiAgICAgIGlmIChpdGVtTm9kZSkge1xuICAgICAgICBpdGVtUmVmcy5jdXJyZW50W2VsZW1lbnRJZHMuZ2V0SXRlbUlkKGluZGV4KV0gPSBpdGVtTm9kZTtcbiAgICAgIH1cbiAgICB9KSwgX2V4dGVuZHM0KSwgcmVzdCk7XG4gICAgaWYgKCFkaXNhYmxlZCkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKHJlYWN0LW5hdGl2ZSkgKi9cbiAgICAgIHtcbiAgICAgICAgaXRlbVByb3BzLm9uQ2xpY2sgPSBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbkNsaWNrLCBpdGVtSGFuZGxlQ2xpY2spO1xuICAgICAgfVxuICAgIH1cbiAgICBpdGVtUHJvcHMub25Nb3VzZU1vdmUgPSBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbk1vdXNlTW92ZSwgaXRlbUhhbmRsZU1vdXNlTW92ZSk7XG4gICAgcmV0dXJuIGl0ZW1Qcm9wcztcbiAgfSwgW2xhdGVzdCwgc2VsZWN0ZWRJdGVtLCBlbGVtZW50SWRzLCBzaG91bGRTY3JvbGxSZWYsIGRpc3BhdGNoXSk7XG4gIHJldHVybiB7XG4gICAgLy8gcHJvcCBnZXR0ZXJzLlxuICAgIGdldFRvZ2dsZUJ1dHRvblByb3BzOiBnZXRUb2dnbGVCdXR0b25Qcm9wcyxcbiAgICBnZXRMYWJlbFByb3BzOiBnZXRMYWJlbFByb3BzLFxuICAgIGdldE1lbnVQcm9wczogZ2V0TWVudVByb3BzLFxuICAgIGdldEl0ZW1Qcm9wczogZ2V0SXRlbVByb3BzLFxuICAgIC8vIGFjdGlvbnMuXG4gICAgdG9nZ2xlTWVudTogdG9nZ2xlTWVudSxcbiAgICBvcGVuTWVudTogb3Blbk1lbnUsXG4gICAgY2xvc2VNZW51OiBjbG9zZU1lbnUsXG4gICAgc2V0SGlnaGxpZ2h0ZWRJbmRleDogc2V0SGlnaGxpZ2h0ZWRJbmRleCxcbiAgICBzZWxlY3RJdGVtOiBzZWxlY3RJdGVtLFxuICAgIHJlc2V0OiByZXNldCxcbiAgICBzZXRJbnB1dFZhbHVlOiBzZXRJbnB1dFZhbHVlLFxuICAgIC8vIHN0YXRlLlxuICAgIGhpZ2hsaWdodGVkSW5kZXg6IGhpZ2hsaWdodGVkSW5kZXgsXG4gICAgaXNPcGVuOiBpc09wZW4sXG4gICAgc2VsZWN0ZWRJdGVtOiBzZWxlY3RlZEl0ZW0sXG4gICAgaW5wdXRWYWx1ZTogaW5wdXRWYWx1ZVxuICB9O1xufVxuXG52YXIgSW5wdXRLZXlEb3duQXJyb3dEb3duID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19faW5wdXRfa2V5ZG93bl9hcnJvd19kb3duX18nIDogMDtcbnZhciBJbnB1dEtleURvd25BcnJvd1VwID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19faW5wdXRfa2V5ZG93bl9hcnJvd191cF9fJyA6IDE7XG52YXIgSW5wdXRLZXlEb3duRXNjYXBlID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19faW5wdXRfa2V5ZG93bl9lc2NhcGVfXycgOiAyO1xudmFyIElucHV0S2V5RG93bkhvbWUgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19pbnB1dF9rZXlkb3duX2hvbWVfXycgOiAzO1xudmFyIElucHV0S2V5RG93bkVuZCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2lucHV0X2tleWRvd25fZW5kX18nIDogNDtcbnZhciBJbnB1dEtleURvd25QYWdlVXAgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19pbnB1dF9rZXlkb3duX3BhZ2VfdXBfXycgOiA1O1xudmFyIElucHV0S2V5RG93blBhZ2VEb3duID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19faW5wdXRfa2V5ZG93bl9wYWdlX2Rvd25fXycgOiA2O1xudmFyIElucHV0S2V5RG93bkVudGVyID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19faW5wdXRfa2V5ZG93bl9lbnRlcl9fJyA6IDc7XG52YXIgSW5wdXRDaGFuZ2UgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19pbnB1dF9jaGFuZ2VfXycgOiA4O1xudmFyIElucHV0Qmx1ciA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2lucHV0X2JsdXJfXycgOiA5O1xudmFyIElucHV0Rm9jdXMgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19pbnB1dF9mb2N1c19fJyA6IDEwO1xudmFyIE1lbnVNb3VzZUxlYXZlID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fbWVudV9tb3VzZV9sZWF2ZV9fJyA6IDExO1xudmFyIEl0ZW1Nb3VzZU1vdmUgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19pdGVtX21vdXNlX21vdmVfXycgOiAxMjtcbnZhciBJdGVtQ2xpY2sgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19pdGVtX2NsaWNrX18nIDogMTM7XG52YXIgVG9nZ2xlQnV0dG9uQ2xpY2sgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX190b2dnbGVidXR0b25fY2xpY2tfXycgOiAxNDtcbnZhciBGdW5jdGlvblRvZ2dsZU1lbnUgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl90b2dnbGVfbWVudV9fJyA6IDE1O1xudmFyIEZ1bmN0aW9uT3Blbk1lbnUgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9vcGVuX21lbnVfXycgOiAxNjtcbnZhciBGdW5jdGlvbkNsb3NlTWVudSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2Z1bmN0aW9uX2Nsb3NlX21lbnVfXycgOiAxNztcbnZhciBGdW5jdGlvblNldEhpZ2hsaWdodGVkSW5kZXggPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9zZXRfaGlnaGxpZ2h0ZWRfaW5kZXhfXycgOiAxODtcbnZhciBGdW5jdGlvblNlbGVjdEl0ZW0gPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9zZWxlY3RfaXRlbV9fJyA6IDE5O1xudmFyIEZ1bmN0aW9uU2V0SW5wdXRWYWx1ZSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2Z1bmN0aW9uX3NldF9pbnB1dF92YWx1ZV9fJyA6IDIwO1xudmFyIEZ1bmN0aW9uUmVzZXQkMSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2Z1bmN0aW9uX3Jlc2V0X18nIDogMjE7XG52YXIgQ29udHJvbGxlZFByb3BVcGRhdGVkU2VsZWN0ZWRJdGVtID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fY29udHJvbGxlZF9wcm9wX3VwZGF0ZWRfc2VsZWN0ZWRfaXRlbV9fJyA6IDIyO1xuXG52YXIgc3RhdGVDaGFuZ2VUeXBlcyQxID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICBfX3Byb3RvX186IG51bGwsXG4gIElucHV0S2V5RG93bkFycm93RG93bjogSW5wdXRLZXlEb3duQXJyb3dEb3duLFxuICBJbnB1dEtleURvd25BcnJvd1VwOiBJbnB1dEtleURvd25BcnJvd1VwLFxuICBJbnB1dEtleURvd25Fc2NhcGU6IElucHV0S2V5RG93bkVzY2FwZSxcbiAgSW5wdXRLZXlEb3duSG9tZTogSW5wdXRLZXlEb3duSG9tZSxcbiAgSW5wdXRLZXlEb3duRW5kOiBJbnB1dEtleURvd25FbmQsXG4gIElucHV0S2V5RG93blBhZ2VVcDogSW5wdXRLZXlEb3duUGFnZVVwLFxuICBJbnB1dEtleURvd25QYWdlRG93bjogSW5wdXRLZXlEb3duUGFnZURvd24sXG4gIElucHV0S2V5RG93bkVudGVyOiBJbnB1dEtleURvd25FbnRlcixcbiAgSW5wdXRDaGFuZ2U6IElucHV0Q2hhbmdlLFxuICBJbnB1dEJsdXI6IElucHV0Qmx1cixcbiAgSW5wdXRGb2N1czogSW5wdXRGb2N1cyxcbiAgTWVudU1vdXNlTGVhdmU6IE1lbnVNb3VzZUxlYXZlLFxuICBJdGVtTW91c2VNb3ZlOiBJdGVtTW91c2VNb3ZlLFxuICBJdGVtQ2xpY2s6IEl0ZW1DbGljayxcbiAgVG9nZ2xlQnV0dG9uQ2xpY2s6IFRvZ2dsZUJ1dHRvbkNsaWNrLFxuICBGdW5jdGlvblRvZ2dsZU1lbnU6IEZ1bmN0aW9uVG9nZ2xlTWVudSxcbiAgRnVuY3Rpb25PcGVuTWVudTogRnVuY3Rpb25PcGVuTWVudSxcbiAgRnVuY3Rpb25DbG9zZU1lbnU6IEZ1bmN0aW9uQ2xvc2VNZW51LFxuICBGdW5jdGlvblNldEhpZ2hsaWdodGVkSW5kZXg6IEZ1bmN0aW9uU2V0SGlnaGxpZ2h0ZWRJbmRleCxcbiAgRnVuY3Rpb25TZWxlY3RJdGVtOiBGdW5jdGlvblNlbGVjdEl0ZW0sXG4gIEZ1bmN0aW9uU2V0SW5wdXRWYWx1ZTogRnVuY3Rpb25TZXRJbnB1dFZhbHVlLFxuICBGdW5jdGlvblJlc2V0OiBGdW5jdGlvblJlc2V0JDEsXG4gIENvbnRyb2xsZWRQcm9wVXBkYXRlZFNlbGVjdGVkSXRlbTogQ29udHJvbGxlZFByb3BVcGRhdGVkU2VsZWN0ZWRJdGVtXG59KTtcblxuZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlJDEocHJvcHMpIHtcbiAgdmFyIGluaXRpYWxTdGF0ZSA9IGdldEluaXRpYWxTdGF0ZSQyKHByb3BzKTtcbiAgdmFyIHNlbGVjdGVkSXRlbSA9IGluaXRpYWxTdGF0ZS5zZWxlY3RlZEl0ZW07XG4gIHZhciBpbnB1dFZhbHVlID0gaW5pdGlhbFN0YXRlLmlucHV0VmFsdWU7XG4gIGlmIChpbnB1dFZhbHVlID09PSAnJyAmJiBzZWxlY3RlZEl0ZW0gJiYgcHJvcHMuZGVmYXVsdElucHV0VmFsdWUgPT09IHVuZGVmaW5lZCAmJiBwcm9wcy5pbml0aWFsSW5wdXRWYWx1ZSA9PT0gdW5kZWZpbmVkICYmIHByb3BzLmlucHV0VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIGlucHV0VmFsdWUgPSBwcm9wcy5pdGVtVG9TdHJpbmcoc2VsZWN0ZWRJdGVtKTtcbiAgfVxuICByZXR1cm4gX2V4dGVuZHMoe30sIGluaXRpYWxTdGF0ZSwge1xuICAgIGlucHV0VmFsdWU6IGlucHV0VmFsdWVcbiAgfSk7XG59XG52YXIgcHJvcFR5cGVzJDEgPSB7XG4gIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgaXRlbVRvU3RyaW5nOiBQcm9wVHlwZXMuZnVuYyxcbiAgc2VsZWN0ZWRJdGVtQ2hhbmdlZDogUHJvcFR5cGVzLmZ1bmMsXG4gIGdldEExMXlTdGF0dXNNZXNzYWdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgZ2V0QTExeVNlbGVjdGlvbk1lc3NhZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBoaWdobGlnaHRlZEluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICBkZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgaW5pdGlhbEhpZ2hsaWdodGVkSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gIGlzT3BlbjogUHJvcFR5cGVzLmJvb2wsXG4gIGRlZmF1bHRJc09wZW46IFByb3BUeXBlcy5ib29sLFxuICBpbml0aWFsSXNPcGVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgc2VsZWN0ZWRJdGVtOiBQcm9wVHlwZXMuYW55LFxuICBpbml0aWFsU2VsZWN0ZWRJdGVtOiBQcm9wVHlwZXMuYW55LFxuICBkZWZhdWx0U2VsZWN0ZWRJdGVtOiBQcm9wVHlwZXMuYW55LFxuICBpbnB1dFZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkZWZhdWx0SW5wdXRWYWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaW5pdGlhbElucHV0VmFsdWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBsYWJlbElkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBtZW51SWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGdldEl0ZW1JZDogUHJvcFR5cGVzLmZ1bmMsXG4gIGlucHV0SWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHRvZ2dsZUJ1dHRvbklkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzdGF0ZVJlZHVjZXI6IFByb3BUeXBlcy5mdW5jLFxuICBvblNlbGVjdGVkSXRlbUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uSGlnaGxpZ2h0ZWRJbmRleENoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uU3RhdGVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvbklzT3BlbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uSW5wdXRWYWx1ZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIGVudmlyb25tZW50OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgIGFkZEV2ZW50TGlzdGVuZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIHJlbW92ZUV2ZW50TGlzdGVuZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIGRvY3VtZW50OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZ2V0RWxlbWVudEJ5SWQ6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgYWN0aXZlRWxlbWVudDogUHJvcFR5cGVzLmFueSxcbiAgICAgIGJvZHk6IFByb3BUeXBlcy5hbnlcbiAgICB9KVxuICB9KVxufTtcblxuLyoqXG4gKiBUaGUgdXNlQ29tYm9ib3ggdmVyc2lvbiBvZiB1c2VDb250cm9sbGVkUmVkdWNlciwgd2hpY2ggYWxzb1xuICogY2hlY2tzIGlmIHRoZSBjb250cm9sbGVkIHByb3Agc2VsZWN0ZWRJdGVtIGNoYW5nZWQgYmV0d2VlblxuICogcmVuZGVycy4gSWYgc28sIGl0IHdpbGwgYWxzbyB1cGRhdGUgaW5wdXRWYWx1ZSB3aXRoIGl0c1xuICogc3RyaW5nIGVxdWl2YWxlbnQuIEl0IHVzZXMgdGhlIGNvbW1vbiB1c2VFbmhhbmNlZFJlZHVjZXIgdG9cbiAqIGNvbXB1dGUgdGhlIHJlc3Qgb2YgdGhlIHN0YXRlLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlZHVjZXIgUmVkdWNlciBmdW5jdGlvbiBmcm9tIGRvd25zaGlmdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBpbml0aWFsU3RhdGUgSW5pdGlhbCBzdGF0ZSBvZiB0aGUgaG9vay5cbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBUaGUgaG9vayBwcm9wcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gQW4gYXJyYXkgd2l0aCB0aGUgc3RhdGUgYW5kIGFuIGFjdGlvbiBkaXNwYXRjaGVyLlxuICovXG5mdW5jdGlvbiB1c2VDb250cm9sbGVkUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsU3RhdGUsIHByb3BzKSB7XG4gIHZhciBwcmV2aW91c1NlbGVjdGVkSXRlbVJlZiA9IHVzZVJlZigpO1xuICB2YXIgX3VzZUVuaGFuY2VkUmVkdWNlciA9IHVzZUVuaGFuY2VkUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsU3RhdGUsIHByb3BzKSxcbiAgICBzdGF0ZSA9IF91c2VFbmhhbmNlZFJlZHVjZXJbMF0sXG4gICAgZGlzcGF0Y2ggPSBfdXNlRW5oYW5jZWRSZWR1Y2VyWzFdO1xuXG4gIC8vIFRvRG86IGlmIG5lZWRlZCwgbWFrZSBzYW1lIGFwcHJvYWNoIGFzIHNlbGVjdGVkSXRlbUNoYW5nZWQgZnJvbSBEb3duc2hpZnQuXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFpc0NvbnRyb2xsZWRQcm9wKHByb3BzLCAnc2VsZWN0ZWRJdGVtJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHByb3BzLnNlbGVjdGVkSXRlbUNoYW5nZWQocHJldmlvdXNTZWxlY3RlZEl0ZW1SZWYuY3VycmVudCwgcHJvcHMuc2VsZWN0ZWRJdGVtKSkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBDb250cm9sbGVkUHJvcFVwZGF0ZWRTZWxlY3RlZEl0ZW0sXG4gICAgICAgIGlucHV0VmFsdWU6IHByb3BzLml0ZW1Ub1N0cmluZyhwcm9wcy5zZWxlY3RlZEl0ZW0pXG4gICAgICB9KTtcbiAgICB9XG4gICAgcHJldmlvdXNTZWxlY3RlZEl0ZW1SZWYuY3VycmVudCA9IHN0YXRlLnNlbGVjdGVkSXRlbSA9PT0gcHJldmlvdXNTZWxlY3RlZEl0ZW1SZWYuY3VycmVudCA/IHByb3BzLnNlbGVjdGVkSXRlbSA6IHN0YXRlLnNlbGVjdGVkSXRlbTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gIH0sIFtzdGF0ZS5zZWxlY3RlZEl0ZW0sIHByb3BzLnNlbGVjdGVkSXRlbV0pO1xuICByZXR1cm4gW2dldFN0YXRlKHN0YXRlLCBwcm9wcyksIGRpc3BhdGNoXTtcbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1tdXRhYmxlLWV4cG9ydHNcbnZhciB2YWxpZGF0ZVByb3BUeXBlcyQxID0gbm9vcDtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YWxpZGF0ZVByb3BUeXBlcyQxID0gZnVuY3Rpb24gdmFsaWRhdGVQcm9wVHlwZXMob3B0aW9ucywgY2FsbGVyKSB7XG4gICAgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKHByb3BUeXBlcyQxLCBvcHRpb25zLCAncHJvcCcsIGNhbGxlci5uYW1lKTtcbiAgfTtcbn1cbnZhciBkZWZhdWx0UHJvcHMkMSA9IF9leHRlbmRzKHt9LCBkZWZhdWx0UHJvcHMkMywge1xuICBzZWxlY3RlZEl0ZW1DaGFuZ2VkOiBmdW5jdGlvbiBzZWxlY3RlZEl0ZW1DaGFuZ2VkKHByZXZJdGVtLCBpdGVtKSB7XG4gICAgcmV0dXJuIHByZXZJdGVtICE9PSBpdGVtO1xuICB9LFxuICBnZXRBMTF5U3RhdHVzTWVzc2FnZTogZ2V0QTExeVN0YXR1c01lc3NhZ2UkMVxufSk7XG5cbi8qIGVzbGludC1kaXNhYmxlIGNvbXBsZXhpdHkgKi9cbmZ1bmN0aW9uIGRvd25zaGlmdFVzZUNvbWJvYm94UmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIHZhciBfcHJvcHMkaXRlbXM7XG4gIHZhciB0eXBlID0gYWN0aW9uLnR5cGUsXG4gICAgcHJvcHMgPSBhY3Rpb24ucHJvcHMsXG4gICAgYWx0S2V5ID0gYWN0aW9uLmFsdEtleTtcbiAgdmFyIGNoYW5nZXM7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgSXRlbUNsaWNrOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaXNPcGVuOiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgJ2lzT3BlbicpLFxuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgJ2hpZ2hsaWdodGVkSW5kZXgnKSxcbiAgICAgICAgc2VsZWN0ZWRJdGVtOiBwcm9wcy5pdGVtc1thY3Rpb24uaW5kZXhdLFxuICAgICAgICBpbnB1dFZhbHVlOiBwcm9wcy5pdGVtVG9TdHJpbmcocHJvcHMuaXRlbXNbYWN0aW9uLmluZGV4XSlcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIElucHV0S2V5RG93bkFycm93RG93bjpcbiAgICAgIGlmIChzdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBnZXROZXh0V3JhcHBpbmdJbmRleCgxLCBzdGF0ZS5oaWdobGlnaHRlZEluZGV4LCBwcm9wcy5pdGVtcy5sZW5ndGgsIGFjdGlvbi5nZXRJdGVtTm9kZUZyb21JbmRleCwgdHJ1ZSlcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogYWx0S2V5ICYmIHN0YXRlLnNlbGVjdGVkSXRlbSA9PSBudWxsID8gLTEgOiBnZXRIaWdobGlnaHRlZEluZGV4T25PcGVuKHByb3BzLCBzdGF0ZSwgMSwgYWN0aW9uLmdldEl0ZW1Ob2RlRnJvbUluZGV4KSxcbiAgICAgICAgICBpc09wZW46IHByb3BzLml0ZW1zLmxlbmd0aCA+PSAwXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIElucHV0S2V5RG93bkFycm93VXA6XG4gICAgICBpZiAoc3RhdGUuaXNPcGVuKSB7XG4gICAgICAgIGlmIChhbHRLZXkpIHtcbiAgICAgICAgICBjaGFuZ2VzID0gZ2V0Q2hhbmdlc09uU2VsZWN0aW9uKHByb3BzLCBzdGF0ZS5oaWdobGlnaHRlZEluZGV4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGFuZ2VzID0ge1xuICAgICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0TmV4dFdyYXBwaW5nSW5kZXgoLTEsIHN0YXRlLmhpZ2hsaWdodGVkSW5kZXgsIHByb3BzLml0ZW1zLmxlbmd0aCwgYWN0aW9uLmdldEl0ZW1Ob2RlRnJvbUluZGV4LCB0cnVlKVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0SGlnaGxpZ2h0ZWRJbmRleE9uT3Blbihwcm9wcywgc3RhdGUsIC0xLCBhY3Rpb24uZ2V0SXRlbU5vZGVGcm9tSW5kZXgpLFxuICAgICAgICAgIGlzT3BlbjogcHJvcHMuaXRlbXMubGVuZ3RoID49IDBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgSW5wdXRLZXlEb3duRW50ZXI6XG4gICAgICBjaGFuZ2VzID0gZ2V0Q2hhbmdlc09uU2VsZWN0aW9uKHByb3BzLCBzdGF0ZS5oaWdobGlnaHRlZEluZGV4KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgSW5wdXRLZXlEb3duRXNjYXBlOlxuICAgICAgY2hhbmdlcyA9IF9leHRlbmRzKHtcbiAgICAgICAgaXNPcGVuOiBmYWxzZSxcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogLTFcbiAgICAgIH0sICFzdGF0ZS5pc09wZW4gJiYge1xuICAgICAgICBzZWxlY3RlZEl0ZW06IG51bGwsXG4gICAgICAgIGlucHV0VmFsdWU6ICcnXG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgSW5wdXRLZXlEb3duUGFnZVVwOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0TmV4dFdyYXBwaW5nSW5kZXgoLTEwLCBzdGF0ZS5oaWdobGlnaHRlZEluZGV4LCBwcm9wcy5pdGVtcy5sZW5ndGgsIGFjdGlvbi5nZXRJdGVtTm9kZUZyb21JbmRleCwgZmFsc2UpXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBJbnB1dEtleURvd25QYWdlRG93bjpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGdldE5leHRXcmFwcGluZ0luZGV4KDEwLCBzdGF0ZS5oaWdobGlnaHRlZEluZGV4LCBwcm9wcy5pdGVtcy5sZW5ndGgsIGFjdGlvbi5nZXRJdGVtTm9kZUZyb21JbmRleCwgZmFsc2UpXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBJbnB1dEtleURvd25Ib21lOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0TmV4dE5vbkRpc2FibGVkSW5kZXgoMSwgMCwgcHJvcHMuaXRlbXMubGVuZ3RoLCBhY3Rpb24uZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIGZhbHNlKVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgSW5wdXRLZXlEb3duRW5kOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0TmV4dE5vbkRpc2FibGVkSW5kZXgoLTEsIHByb3BzLml0ZW1zLmxlbmd0aCAtIDEsIHByb3BzLml0ZW1zLmxlbmd0aCwgYWN0aW9uLmdldEl0ZW1Ob2RlRnJvbUluZGV4LCBmYWxzZSlcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIElucHV0Qmx1cjpcbiAgICAgIGNoYW5nZXMgPSBfZXh0ZW5kcyh7XG4gICAgICAgIGlzT3BlbjogZmFsc2UsXG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IC0xXG4gICAgICB9LCBzdGF0ZS5oaWdobGlnaHRlZEluZGV4ID49IDAgJiYgKChfcHJvcHMkaXRlbXMgPSBwcm9wcy5pdGVtcykgPT0gbnVsbCA/IHZvaWQgMCA6IF9wcm9wcyRpdGVtcy5sZW5ndGgpICYmIGFjdGlvbi5zZWxlY3RJdGVtICYmIHtcbiAgICAgICAgc2VsZWN0ZWRJdGVtOiBwcm9wcy5pdGVtc1tzdGF0ZS5oaWdobGlnaHRlZEluZGV4XSxcbiAgICAgICAgaW5wdXRWYWx1ZTogcHJvcHMuaXRlbVRvU3RyaW5nKHByb3BzLml0ZW1zW3N0YXRlLmhpZ2hsaWdodGVkSW5kZXhdKVxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIElucHV0Q2hhbmdlOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaXNPcGVuOiB0cnVlLFxuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgJ2hpZ2hsaWdodGVkSW5kZXgnKSxcbiAgICAgICAgaW5wdXRWYWx1ZTogYWN0aW9uLmlucHV0VmFsdWVcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIElucHV0Rm9jdXM6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBpc09wZW46IHRydWUsXG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGdldEhpZ2hsaWdodGVkSW5kZXhPbk9wZW4ocHJvcHMsIHN0YXRlLCAwKVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgRnVuY3Rpb25TZWxlY3RJdGVtOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgc2VsZWN0ZWRJdGVtOiBhY3Rpb24uc2VsZWN0ZWRJdGVtLFxuICAgICAgICBpbnB1dFZhbHVlOiBwcm9wcy5pdGVtVG9TdHJpbmcoYWN0aW9uLnNlbGVjdGVkSXRlbSlcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIENvbnRyb2xsZWRQcm9wVXBkYXRlZFNlbGVjdGVkSXRlbTpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGlucHV0VmFsdWU6IGFjdGlvbi5pbnB1dFZhbHVlXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBkb3duc2hpZnRDb21tb25SZWR1Y2VyKHN0YXRlLCBhY3Rpb24sIHN0YXRlQ2hhbmdlVHlwZXMkMSk7XG4gIH1cbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwgY2hhbmdlcyk7XG59XG4vKiBlc2xpbnQtZW5hYmxlIGNvbXBsZXhpdHkgKi9cblxudmFyIF9leGNsdWRlZCQxID0gW1wib25Nb3VzZUxlYXZlXCIsIFwicmVmS2V5XCIsIFwicmVmXCJdLFxuICBfZXhjbHVkZWQyJDEgPSBbXCJpdGVtXCIsIFwiaW5kZXhcIiwgXCJyZWZLZXlcIiwgXCJyZWZcIiwgXCJvbk1vdXNlTW92ZVwiLCBcIm9uTW91c2VEb3duXCIsIFwib25DbGlja1wiLCBcIm9uUHJlc3NcIiwgXCJkaXNhYmxlZFwiXSxcbiAgX2V4Y2x1ZGVkMyA9IFtcIm9uQ2xpY2tcIiwgXCJvblByZXNzXCIsIFwicmVmS2V5XCIsIFwicmVmXCJdLFxuICBfZXhjbHVkZWQ0ID0gW1wib25LZXlEb3duXCIsIFwib25DaGFuZ2VcIiwgXCJvbklucHV0XCIsIFwib25Gb2N1c1wiLCBcIm9uQmx1clwiLCBcIm9uQ2hhbmdlVGV4dFwiLCBcInJlZktleVwiLCBcInJlZlwiXTtcbnVzZUNvbWJvYm94LnN0YXRlQ2hhbmdlVHlwZXMgPSBzdGF0ZUNoYW5nZVR5cGVzJDE7XG5mdW5jdGlvbiB1c2VDb21ib2JveCh1c2VyUHJvcHMpIHtcbiAgaWYgKHVzZXJQcm9wcyA9PT0gdm9pZCAwKSB7XG4gICAgdXNlclByb3BzID0ge307XG4gIH1cbiAgdmFsaWRhdGVQcm9wVHlwZXMkMSh1c2VyUHJvcHMsIHVzZUNvbWJvYm94KTtcbiAgLy8gUHJvcHMgZGVmYXVsdHMgYW5kIGRlc3RydWN0dXJpbmcuXG4gIHZhciBwcm9wcyA9IF9leHRlbmRzKHt9LCBkZWZhdWx0UHJvcHMkMSwgdXNlclByb3BzKTtcbiAgdmFyIGluaXRpYWxJc09wZW4gPSBwcm9wcy5pbml0aWFsSXNPcGVuLFxuICAgIGRlZmF1bHRJc09wZW4gPSBwcm9wcy5kZWZhdWx0SXNPcGVuLFxuICAgIGl0ZW1zID0gcHJvcHMuaXRlbXMsXG4gICAgc2Nyb2xsSW50b1ZpZXcgPSBwcm9wcy5zY3JvbGxJbnRvVmlldyxcbiAgICBlbnZpcm9ubWVudCA9IHByb3BzLmVudmlyb25tZW50LFxuICAgIGdldEExMXlTdGF0dXNNZXNzYWdlID0gcHJvcHMuZ2V0QTExeVN0YXR1c01lc3NhZ2UsXG4gICAgZ2V0QTExeVNlbGVjdGlvbk1lc3NhZ2UgPSBwcm9wcy5nZXRBMTF5U2VsZWN0aW9uTWVzc2FnZSxcbiAgICBpdGVtVG9TdHJpbmcgPSBwcm9wcy5pdGVtVG9TdHJpbmc7XG4gIC8vIEluaXRpYWwgc3RhdGUgZGVwZW5kaW5nIG9uIGNvbnRyb2xsZWQgcHJvcHMuXG4gIHZhciBpbml0aWFsU3RhdGUgPSBnZXRJbml0aWFsU3RhdGUkMShwcm9wcyk7XG4gIHZhciBfdXNlQ29udHJvbGxlZFJlZHVjZXIgPSB1c2VDb250cm9sbGVkUmVkdWNlcihkb3duc2hpZnRVc2VDb21ib2JveFJlZHVjZXIsIGluaXRpYWxTdGF0ZSwgcHJvcHMpLFxuICAgIHN0YXRlID0gX3VzZUNvbnRyb2xsZWRSZWR1Y2VyWzBdLFxuICAgIGRpc3BhdGNoID0gX3VzZUNvbnRyb2xsZWRSZWR1Y2VyWzFdO1xuICB2YXIgaXNPcGVuID0gc3RhdGUuaXNPcGVuLFxuICAgIGhpZ2hsaWdodGVkSW5kZXggPSBzdGF0ZS5oaWdobGlnaHRlZEluZGV4LFxuICAgIHNlbGVjdGVkSXRlbSA9IHN0YXRlLnNlbGVjdGVkSXRlbSxcbiAgICBpbnB1dFZhbHVlID0gc3RhdGUuaW5wdXRWYWx1ZTtcblxuICAvLyBFbGVtZW50IHJlZnMuXG4gIHZhciBtZW51UmVmID0gdXNlUmVmKG51bGwpO1xuICB2YXIgaXRlbVJlZnMgPSB1c2VSZWYoe30pO1xuICB2YXIgaW5wdXRSZWYgPSB1c2VSZWYobnVsbCk7XG4gIHZhciB0b2dnbGVCdXR0b25SZWYgPSB1c2VSZWYobnVsbCk7XG4gIHZhciBpc0luaXRpYWxNb3VudFJlZiA9IHVzZVJlZih0cnVlKTtcbiAgLy8gcHJldmVudCBpZCByZS1nZW5lcmF0aW9uIGJldHdlZW4gcmVuZGVycy5cbiAgdmFyIGVsZW1lbnRJZHMgPSB1c2VFbGVtZW50SWRzKHByb3BzKTtcbiAgLy8gdXNlZCB0byBrZWVwIHRyYWNrIG9mIGhvdyBtYW55IGl0ZW1zIHdlIGhhZCBvbiBwcmV2aW91cyBjeWNsZS5cbiAgdmFyIHByZXZpb3VzUmVzdWx0Q291bnRSZWYgPSB1c2VSZWYoKTtcbiAgLy8gdXRpbGl0eSBjYWxsYmFjayB0byBnZXQgaXRlbSBlbGVtZW50LlxuICB2YXIgbGF0ZXN0ID0gdXNlTGF0ZXN0UmVmKHtcbiAgICBzdGF0ZTogc3RhdGUsXG4gICAgcHJvcHM6IHByb3BzXG4gIH0pO1xuICB2YXIgZ2V0SXRlbU5vZGVGcm9tSW5kZXggPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICByZXR1cm4gaXRlbVJlZnMuY3VycmVudFtlbGVtZW50SWRzLmdldEl0ZW1JZChpbmRleCldO1xuICB9LCBbZWxlbWVudElkc10pO1xuXG4gIC8vIEVmZmVjdHMuXG4gIC8vIFNldHMgYTExeSBzdGF0dXMgbWVzc2FnZSBvbiBjaGFuZ2VzIGluIHN0YXRlLlxuICB1c2VBMTF5TWVzc2FnZVNldHRlcihnZXRBMTF5U3RhdHVzTWVzc2FnZSwgW2lzT3BlbiwgaGlnaGxpZ2h0ZWRJbmRleCwgaW5wdXRWYWx1ZSwgaXRlbXNdLCBfZXh0ZW5kcyh7XG4gICAgaXNJbml0aWFsTW91bnQ6IGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQsXG4gICAgcHJldmlvdXNSZXN1bHRDb3VudDogcHJldmlvdXNSZXN1bHRDb3VudFJlZi5jdXJyZW50LFxuICAgIGl0ZW1zOiBpdGVtcyxcbiAgICBlbnZpcm9ubWVudDogZW52aXJvbm1lbnQsXG4gICAgaXRlbVRvU3RyaW5nOiBpdGVtVG9TdHJpbmdcbiAgfSwgc3RhdGUpKTtcbiAgLy8gU2V0cyBhMTF5IHN0YXR1cyBtZXNzYWdlIG9uIGNoYW5nZXMgaW4gc2VsZWN0ZWRJdGVtLlxuICB1c2VBMTF5TWVzc2FnZVNldHRlcihnZXRBMTF5U2VsZWN0aW9uTWVzc2FnZSwgW3NlbGVjdGVkSXRlbV0sIF9leHRlbmRzKHtcbiAgICBpc0luaXRpYWxNb3VudDogaXNJbml0aWFsTW91bnRSZWYuY3VycmVudCxcbiAgICBwcmV2aW91c1Jlc3VsdENvdW50OiBwcmV2aW91c1Jlc3VsdENvdW50UmVmLmN1cnJlbnQsXG4gICAgaXRlbXM6IGl0ZW1zLFxuICAgIGVudmlyb25tZW50OiBlbnZpcm9ubWVudCxcbiAgICBpdGVtVG9TdHJpbmc6IGl0ZW1Ub1N0cmluZ1xuICB9LCBzdGF0ZSkpO1xuICAvLyBTY3JvbGwgb24gaGlnaGxpZ2h0ZWQgaXRlbSBpZiBjaGFuZ2UgY29tZXMgZnJvbSBrZXlib2FyZC5cbiAgdmFyIHNob3VsZFNjcm9sbFJlZiA9IHVzZVNjcm9sbEludG9WaWV3KHtcbiAgICBtZW51RWxlbWVudDogbWVudVJlZi5jdXJyZW50LFxuICAgIGhpZ2hsaWdodGVkSW5kZXg6IGhpZ2hsaWdodGVkSW5kZXgsXG4gICAgaXNPcGVuOiBpc09wZW4sXG4gICAgaXRlbVJlZnM6IGl0ZW1SZWZzLFxuICAgIHNjcm9sbEludG9WaWV3OiBzY3JvbGxJbnRvVmlldyxcbiAgICBnZXRJdGVtTm9kZUZyb21JbmRleDogZ2V0SXRlbU5vZGVGcm9tSW5kZXhcbiAgfSk7XG4gIHVzZUNvbnRyb2xQcm9wc1ZhbGlkYXRvcih7XG4gICAgaXNJbml0aWFsTW91bnQ6IGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQsXG4gICAgcHJvcHM6IHByb3BzLFxuICAgIHN0YXRlOiBzdGF0ZVxuICB9KTtcbiAgLy8gRm9jdXMgdGhlIGlucHV0IG9uIGZpcnN0IHJlbmRlciBpZiByZXF1aXJlZC5cbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZm9jdXNPbk9wZW4gPSBpbml0aWFsSXNPcGVuIHx8IGRlZmF1bHRJc09wZW4gfHwgaXNPcGVuO1xuICAgIGlmIChmb2N1c09uT3BlbiAmJiBpbnB1dFJlZi5jdXJyZW50KSB7XG4gICAgICBpbnB1dFJlZi5jdXJyZW50LmZvY3VzKCk7XG4gICAgfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgfSwgW10pO1xuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlmIChpc0luaXRpYWxNb3VudFJlZi5jdXJyZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHByZXZpb3VzUmVzdWx0Q291bnRSZWYuY3VycmVudCA9IGl0ZW1zLmxlbmd0aDtcbiAgfSk7XG4gIC8vIEFkZCBtb3VzZS90b3VjaCBldmVudHMgdG8gZG9jdW1lbnQuXG4gIHZhciBtb3VzZUFuZFRvdWNoVHJhY2tlcnNSZWYgPSB1c2VNb3VzZUFuZFRvdWNoVHJhY2tlcihpc09wZW4sIFtpbnB1dFJlZiwgbWVudVJlZiwgdG9nZ2xlQnV0dG9uUmVmXSwgZW52aXJvbm1lbnQsIGZ1bmN0aW9uICgpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBJbnB1dEJsdXIsXG4gICAgICBzZWxlY3RJdGVtOiBmYWxzZVxuICAgIH0pO1xuICB9KTtcbiAgdmFyIHNldEdldHRlclByb3BDYWxsSW5mbyA9IHVzZUdldHRlclByb3BzQ2FsbGVkQ2hlY2tlcignZ2V0SW5wdXRQcm9wcycsICdnZXRNZW51UHJvcHMnKTtcbiAgLy8gTWFrZSBpbml0aWFsIHJlZiBmYWxzZS5cbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBpc0luaXRpYWxNb3VudFJlZi5jdXJyZW50ID0gZmFsc2U7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQgPSB0cnVlO1xuICAgIH07XG4gIH0sIFtdKTtcbiAgLy8gUmVzZXQgaXRlbVJlZnMgb24gY2xvc2UuXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9lbnZpcm9ubWVudCRkb2N1bWVudDtcbiAgICBpZiAoIWlzT3Blbikge1xuICAgICAgaXRlbVJlZnMuY3VycmVudCA9IHt9O1xuICAgIH0gZWxzZSBpZiAoKChfZW52aXJvbm1lbnQkZG9jdW1lbnQgPSBlbnZpcm9ubWVudC5kb2N1bWVudCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9lbnZpcm9ubWVudCRkb2N1bWVudC5hY3RpdmVFbGVtZW50KSAhPT0gaW5wdXRSZWYuY3VycmVudCkge1xuICAgICAgdmFyIF9pbnB1dFJlZiRjdXJyZW50O1xuICAgICAgaW5wdXRSZWYgPT0gbnVsbCB8fCAoX2lucHV0UmVmJGN1cnJlbnQgPSBpbnB1dFJlZi5jdXJyZW50KSA9PSBudWxsID8gdm9pZCAwIDogX2lucHV0UmVmJGN1cnJlbnQuZm9jdXMoKTtcbiAgICB9XG4gIH0sIFtpc09wZW4sIGVudmlyb25tZW50XSk7XG5cbiAgLyogRXZlbnQgaGFuZGxlciBmdW5jdGlvbnMgKi9cbiAgdmFyIGlucHV0S2V5RG93bkhhbmRsZXJzID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIEFycm93RG93bjogZnVuY3Rpb24gQXJyb3dEb3duKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBJbnB1dEtleURvd25BcnJvd0Rvd24sXG4gICAgICAgICAgYWx0S2V5OiBldmVudC5hbHRLZXksXG4gICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIEFycm93VXA6IGZ1bmN0aW9uIEFycm93VXAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IElucHV0S2V5RG93bkFycm93VXAsXG4gICAgICAgICAgYWx0S2V5OiBldmVudC5hbHRLZXksXG4gICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIEhvbWU6IGZ1bmN0aW9uIEhvbWUoZXZlbnQpIHtcbiAgICAgICAgaWYgKCFsYXRlc3QuY3VycmVudC5zdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IElucHV0S2V5RG93bkhvbWUsXG4gICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIEVuZDogZnVuY3Rpb24gRW5kKGV2ZW50KSB7XG4gICAgICAgIGlmICghbGF0ZXN0LmN1cnJlbnQuc3RhdGUuaXNPcGVuKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBJbnB1dEtleURvd25FbmQsXG4gICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIEVzY2FwZTogZnVuY3Rpb24gRXNjYXBlKGV2ZW50KSB7XG4gICAgICAgIHZhciBsYXRlc3RTdGF0ZSA9IGxhdGVzdC5jdXJyZW50LnN0YXRlO1xuICAgICAgICBpZiAobGF0ZXN0U3RhdGUuaXNPcGVuIHx8IGxhdGVzdFN0YXRlLmlucHV0VmFsdWUgfHwgbGF0ZXN0U3RhdGUuc2VsZWN0ZWRJdGVtIHx8IGxhdGVzdFN0YXRlLmhpZ2hsaWdodGVkSW5kZXggPiAtMSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogSW5wdXRLZXlEb3duRXNjYXBlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBFbnRlcjogZnVuY3Rpb24gRW50ZXIoZXZlbnQpIHtcbiAgICAgICAgdmFyIGxhdGVzdFN0YXRlID0gbGF0ZXN0LmN1cnJlbnQuc3RhdGU7XG4gICAgICAgIC8vIGlmIGNsb3NlZCBvciBubyBoaWdobGlnaHRlZCBpbmRleCwgZG8gbm90aGluZy5cbiAgICAgICAgaWYgKCFsYXRlc3RTdGF0ZS5pc09wZW4gfHwgZXZlbnQud2hpY2ggPT09IDIyOSAvLyBpZiBJTUUgY29tcG9zaW5nLCB3YWl0IGZvciBuZXh0IEVudGVyIGtleWRvd24gZXZlbnQuXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogSW5wdXRLZXlEb3duRW50ZXIsXG4gICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIFBhZ2VVcDogZnVuY3Rpb24gUGFnZVVwKGV2ZW50KSB7XG4gICAgICAgIGlmIChsYXRlc3QuY3VycmVudC5zdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IElucHV0S2V5RG93blBhZ2VVcCxcbiAgICAgICAgICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4OiBnZXRJdGVtTm9kZUZyb21JbmRleFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgUGFnZURvd246IGZ1bmN0aW9uIFBhZ2VEb3duKGV2ZW50KSB7XG4gICAgICAgIGlmIChsYXRlc3QuY3VycmVudC5zdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IElucHV0S2V5RG93blBhZ2VEb3duLFxuICAgICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9LCBbZGlzcGF0Y2gsIGxhdGVzdCwgZ2V0SXRlbU5vZGVGcm9tSW5kZXhdKTtcblxuICAvLyBHZXR0ZXIgcHJvcHMuXG4gIHZhciBnZXRMYWJlbFByb3BzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGxhYmVsUHJvcHMpIHtcbiAgICByZXR1cm4gX2V4dGVuZHMoe1xuICAgICAgaWQ6IGVsZW1lbnRJZHMubGFiZWxJZCxcbiAgICAgIGh0bWxGb3I6IGVsZW1lbnRJZHMuaW5wdXRJZFxuICAgIH0sIGxhYmVsUHJvcHMpO1xuICB9LCBbZWxlbWVudElkc10pO1xuICB2YXIgZ2V0TWVudVByb3BzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKF90ZW1wLCBfdGVtcDIpIHtcbiAgICB2YXIgX2V4dGVuZHMyO1xuICAgIHZhciBfcmVmID0gX3RlbXAgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAsXG4gICAgICBvbk1vdXNlTGVhdmUgPSBfcmVmLm9uTW91c2VMZWF2ZSxcbiAgICAgIF9yZWYkcmVmS2V5ID0gX3JlZi5yZWZLZXksXG4gICAgICByZWZLZXkgPSBfcmVmJHJlZktleSA9PT0gdm9pZCAwID8gJ3JlZicgOiBfcmVmJHJlZktleSxcbiAgICAgIHJlZiA9IF9yZWYucmVmLFxuICAgICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWYsIF9leGNsdWRlZCQxKTtcbiAgICB2YXIgX3JlZjIgPSBfdGVtcDIgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAyLFxuICAgICAgX3JlZjIkc3VwcHJlc3NSZWZFcnJvID0gX3JlZjIuc3VwcHJlc3NSZWZFcnJvcixcbiAgICAgIHN1cHByZXNzUmVmRXJyb3IgPSBfcmVmMiRzdXBwcmVzc1JlZkVycm8gPT09IHZvaWQgMCA/IGZhbHNlIDogX3JlZjIkc3VwcHJlc3NSZWZFcnJvO1xuICAgIHNldEdldHRlclByb3BDYWxsSW5mbygnZ2V0TWVudVByb3BzJywgc3VwcHJlc3NSZWZFcnJvciwgcmVmS2V5LCBtZW51UmVmKTtcbiAgICByZXR1cm4gX2V4dGVuZHMoKF9leHRlbmRzMiA9IHt9LCBfZXh0ZW5kczJbcmVmS2V5XSA9IGhhbmRsZVJlZnMocmVmLCBmdW5jdGlvbiAobWVudU5vZGUpIHtcbiAgICAgIG1lbnVSZWYuY3VycmVudCA9IG1lbnVOb2RlO1xuICAgIH0pLCBfZXh0ZW5kczIuaWQgPSBlbGVtZW50SWRzLm1lbnVJZCwgX2V4dGVuZHMyLnJvbGUgPSAnbGlzdGJveCcsIF9leHRlbmRzMlsnYXJpYS1sYWJlbGxlZGJ5J10gPSByZXN0ICYmIHJlc3RbJ2FyaWEtbGFiZWwnXSA/IHVuZGVmaW5lZCA6IFwiXCIgKyBlbGVtZW50SWRzLmxhYmVsSWQsIF9leHRlbmRzMi5vbk1vdXNlTGVhdmUgPSBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbk1vdXNlTGVhdmUsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogTWVudU1vdXNlTGVhdmVcbiAgICAgIH0pO1xuICAgIH0pLCBfZXh0ZW5kczIpLCByZXN0KTtcbiAgfSwgW2Rpc3BhdGNoLCBzZXRHZXR0ZXJQcm9wQ2FsbEluZm8sIGVsZW1lbnRJZHNdKTtcbiAgdmFyIGdldEl0ZW1Qcm9wcyA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChfdGVtcDMpIHtcbiAgICB2YXIgX2V4dGVuZHMzLCBfcmVmNDtcbiAgICB2YXIgX3JlZjMgPSBfdGVtcDMgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAzLFxuICAgICAgaXRlbVByb3AgPSBfcmVmMy5pdGVtLFxuICAgICAgaW5kZXhQcm9wID0gX3JlZjMuaW5kZXgsXG4gICAgICBfcmVmMyRyZWZLZXkgPSBfcmVmMy5yZWZLZXksXG4gICAgICByZWZLZXkgPSBfcmVmMyRyZWZLZXkgPT09IHZvaWQgMCA/ICdyZWYnIDogX3JlZjMkcmVmS2V5LFxuICAgICAgcmVmID0gX3JlZjMucmVmLFxuICAgICAgb25Nb3VzZU1vdmUgPSBfcmVmMy5vbk1vdXNlTW92ZSxcbiAgICAgIG9uTW91c2VEb3duID0gX3JlZjMub25Nb3VzZURvd24sXG4gICAgICBvbkNsaWNrID0gX3JlZjMub25DbGljaztcbiAgICAgIF9yZWYzLm9uUHJlc3M7XG4gICAgICB2YXIgZGlzYWJsZWQgPSBfcmVmMy5kaXNhYmxlZCxcbiAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmMywgX2V4Y2x1ZGVkMiQxKTtcbiAgICB2YXIgX2xhdGVzdCRjdXJyZW50ID0gbGF0ZXN0LmN1cnJlbnQsXG4gICAgICBsYXRlc3RQcm9wcyA9IF9sYXRlc3QkY3VycmVudC5wcm9wcyxcbiAgICAgIGxhdGVzdFN0YXRlID0gX2xhdGVzdCRjdXJyZW50LnN0YXRlO1xuICAgIHZhciBfZ2V0SXRlbUFuZEluZGV4ID0gZ2V0SXRlbUFuZEluZGV4KGl0ZW1Qcm9wLCBpbmRleFByb3AsIGxhdGVzdFByb3BzLml0ZW1zLCAnUGFzcyBlaXRoZXIgaXRlbSBvciBpbmRleCB0byBnZXRJdGVtUHJvcHMhJyksXG4gICAgICBpbmRleCA9IF9nZXRJdGVtQW5kSW5kZXhbMV07XG4gICAgdmFyIG9uU2VsZWN0S2V5ID0gJ29uQ2xpY2snO1xuICAgIHZhciBjdXN0b21DbGlja0hhbmRsZXIgPSBvbkNsaWNrO1xuICAgIHZhciBpdGVtSGFuZGxlTW91c2VNb3ZlID0gZnVuY3Rpb24gaXRlbUhhbmRsZU1vdXNlTW92ZSgpIHtcbiAgICAgIGlmIChpbmRleCA9PT0gbGF0ZXN0U3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzaG91bGRTY3JvbGxSZWYuY3VycmVudCA9IGZhbHNlO1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBJdGVtTW91c2VNb3ZlLFxuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIGRpc2FibGVkOiBkaXNhYmxlZFxuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgaXRlbUhhbmRsZUNsaWNrID0gZnVuY3Rpb24gaXRlbUhhbmRsZUNsaWNrKCkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBJdGVtQ2xpY2ssXG4gICAgICAgIGluZGV4OiBpbmRleFxuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgaXRlbUhhbmRsZU1vdXNlRG93biA9IGZ1bmN0aW9uIGl0ZW1IYW5kbGVNb3VzZURvd24oZSkge1xuICAgICAgcmV0dXJuIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9O1xuICAgIHJldHVybiBfZXh0ZW5kcygoX2V4dGVuZHMzID0ge30sIF9leHRlbmRzM1tyZWZLZXldID0gaGFuZGxlUmVmcyhyZWYsIGZ1bmN0aW9uIChpdGVtTm9kZSkge1xuICAgICAgaWYgKGl0ZW1Ob2RlKSB7XG4gICAgICAgIGl0ZW1SZWZzLmN1cnJlbnRbZWxlbWVudElkcy5nZXRJdGVtSWQoaW5kZXgpXSA9IGl0ZW1Ob2RlO1xuICAgICAgfVxuICAgIH0pLCBfZXh0ZW5kczMuZGlzYWJsZWQgPSBkaXNhYmxlZCwgX2V4dGVuZHMzLnJvbGUgPSAnb3B0aW9uJywgX2V4dGVuZHMzWydhcmlhLXNlbGVjdGVkJ10gPSBcIlwiICsgKGluZGV4ID09PSBsYXRlc3RTdGF0ZS5oaWdobGlnaHRlZEluZGV4KSwgX2V4dGVuZHMzLmlkID0gZWxlbWVudElkcy5nZXRJdGVtSWQoaW5kZXgpLCBfZXh0ZW5kczMpLCAhZGlzYWJsZWQgJiYgKF9yZWY0ID0ge30sIF9yZWY0W29uU2VsZWN0S2V5XSA9IGNhbGxBbGxFdmVudEhhbmRsZXJzKGN1c3RvbUNsaWNrSGFuZGxlciwgaXRlbUhhbmRsZUNsaWNrKSwgX3JlZjQpLCB7XG4gICAgICBvbk1vdXNlTW92ZTogY2FsbEFsbEV2ZW50SGFuZGxlcnMob25Nb3VzZU1vdmUsIGl0ZW1IYW5kbGVNb3VzZU1vdmUpLFxuICAgICAgb25Nb3VzZURvd246IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uTW91c2VEb3duLCBpdGVtSGFuZGxlTW91c2VEb3duKVxuICAgIH0sIHJlc3QpO1xuICB9LCBbZGlzcGF0Y2gsIGxhdGVzdCwgc2hvdWxkU2Nyb2xsUmVmLCBlbGVtZW50SWRzXSk7XG4gIHZhciBnZXRUb2dnbGVCdXR0b25Qcm9wcyA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChfdGVtcDQpIHtcbiAgICB2YXIgX2V4dGVuZHM0O1xuICAgIHZhciBfcmVmNSA9IF90ZW1wNCA9PT0gdm9pZCAwID8ge30gOiBfdGVtcDQsXG4gICAgICBvbkNsaWNrID0gX3JlZjUub25DbGljaztcbiAgICAgIF9yZWY1Lm9uUHJlc3M7XG4gICAgICB2YXIgX3JlZjUkcmVmS2V5ID0gX3JlZjUucmVmS2V5LFxuICAgICAgcmVmS2V5ID0gX3JlZjUkcmVmS2V5ID09PSB2b2lkIDAgPyAncmVmJyA6IF9yZWY1JHJlZktleSxcbiAgICAgIHJlZiA9IF9yZWY1LnJlZixcbiAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmNSwgX2V4Y2x1ZGVkMyk7XG4gICAgdmFyIGxhdGVzdFN0YXRlID0gbGF0ZXN0LmN1cnJlbnQuc3RhdGU7XG4gICAgdmFyIHRvZ2dsZUJ1dHRvbkhhbmRsZUNsaWNrID0gZnVuY3Rpb24gdG9nZ2xlQnV0dG9uSGFuZGxlQ2xpY2soKSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IFRvZ2dsZUJ1dHRvbkNsaWNrXG4gICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBfZXh0ZW5kcygoX2V4dGVuZHM0ID0ge30sIF9leHRlbmRzNFtyZWZLZXldID0gaGFuZGxlUmVmcyhyZWYsIGZ1bmN0aW9uICh0b2dnbGVCdXR0b25Ob2RlKSB7XG4gICAgICB0b2dnbGVCdXR0b25SZWYuY3VycmVudCA9IHRvZ2dsZUJ1dHRvbk5vZGU7XG4gICAgfSksIF9leHRlbmRzNFsnYXJpYS1jb250cm9scyddID0gZWxlbWVudElkcy5tZW51SWQsIF9leHRlbmRzNFsnYXJpYS1leHBhbmRlZCddID0gbGF0ZXN0U3RhdGUuaXNPcGVuLCBfZXh0ZW5kczQuaWQgPSBlbGVtZW50SWRzLnRvZ2dsZUJ1dHRvbklkLCBfZXh0ZW5kczQudGFiSW5kZXggPSAtMSwgX2V4dGVuZHM0KSwgIXJlc3QuZGlzYWJsZWQgJiYgX2V4dGVuZHMoe30sIHtcbiAgICAgIG9uQ2xpY2s6IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uQ2xpY2ssIHRvZ2dsZUJ1dHRvbkhhbmRsZUNsaWNrKVxuICAgIH0pLCByZXN0KTtcbiAgfSwgW2Rpc3BhdGNoLCBsYXRlc3QsIGVsZW1lbnRJZHNdKTtcbiAgdmFyIGdldElucHV0UHJvcHMgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoX3RlbXA1LCBfdGVtcDYpIHtcbiAgICB2YXIgX2V4dGVuZHM1O1xuICAgIHZhciBfcmVmNiA9IF90ZW1wNSA9PT0gdm9pZCAwID8ge30gOiBfdGVtcDUsXG4gICAgICBvbktleURvd24gPSBfcmVmNi5vbktleURvd24sXG4gICAgICBvbkNoYW5nZSA9IF9yZWY2Lm9uQ2hhbmdlLFxuICAgICAgb25JbnB1dCA9IF9yZWY2Lm9uSW5wdXQsXG4gICAgICBvbkZvY3VzID0gX3JlZjYub25Gb2N1cyxcbiAgICAgIG9uQmx1ciA9IF9yZWY2Lm9uQmx1cjtcbiAgICAgIF9yZWY2Lm9uQ2hhbmdlVGV4dDtcbiAgICAgIHZhciBfcmVmNiRyZWZLZXkgPSBfcmVmNi5yZWZLZXksXG4gICAgICByZWZLZXkgPSBfcmVmNiRyZWZLZXkgPT09IHZvaWQgMCA/ICdyZWYnIDogX3JlZjYkcmVmS2V5LFxuICAgICAgcmVmID0gX3JlZjYucmVmLFxuICAgICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWY2LCBfZXhjbHVkZWQ0KTtcbiAgICB2YXIgX3JlZjcgPSBfdGVtcDYgPT09IHZvaWQgMCA/IHt9IDogX3RlbXA2LFxuICAgICAgX3JlZjckc3VwcHJlc3NSZWZFcnJvID0gX3JlZjcuc3VwcHJlc3NSZWZFcnJvcixcbiAgICAgIHN1cHByZXNzUmVmRXJyb3IgPSBfcmVmNyRzdXBwcmVzc1JlZkVycm8gPT09IHZvaWQgMCA/IGZhbHNlIDogX3JlZjckc3VwcHJlc3NSZWZFcnJvO1xuICAgIHNldEdldHRlclByb3BDYWxsSW5mbygnZ2V0SW5wdXRQcm9wcycsIHN1cHByZXNzUmVmRXJyb3IsIHJlZktleSwgaW5wdXRSZWYpO1xuICAgIHZhciBsYXRlc3RTdGF0ZSA9IGxhdGVzdC5jdXJyZW50LnN0YXRlO1xuICAgIHZhciBpbnB1dEhhbmRsZUtleURvd24gPSBmdW5jdGlvbiBpbnB1dEhhbmRsZUtleURvd24oZXZlbnQpIHtcbiAgICAgIHZhciBrZXkgPSBub3JtYWxpemVBcnJvd0tleShldmVudCk7XG4gICAgICBpZiAoa2V5ICYmIGlucHV0S2V5RG93bkhhbmRsZXJzW2tleV0pIHtcbiAgICAgICAgaW5wdXRLZXlEb3duSGFuZGxlcnNba2V5XShldmVudCk7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgaW5wdXRIYW5kbGVDaGFuZ2UgPSBmdW5jdGlvbiBpbnB1dEhhbmRsZUNoYW5nZShldmVudCkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBJbnB1dENoYW5nZSxcbiAgICAgICAgaW5wdXRWYWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlXG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBpbnB1dEhhbmRsZUJsdXIgPSBmdW5jdGlvbiBpbnB1dEhhbmRsZUJsdXIoZXZlbnQpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAobGF0ZXN0U3RhdGUuaXNPcGVuICYmICFtb3VzZUFuZFRvdWNoVHJhY2tlcnNSZWYuY3VycmVudC5pc01vdXNlRG93bikge1xuICAgICAgICB2YXIgaXNCbHVyQnlUYWJDaGFuZ2UgPSBldmVudC5yZWxhdGVkVGFyZ2V0ID09PSBudWxsICYmIGVudmlyb25tZW50LmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGVudmlyb25tZW50LmRvY3VtZW50LmJvZHk7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBJbnB1dEJsdXIsXG4gICAgICAgICAgc2VsZWN0SXRlbTogIWlzQmx1ckJ5VGFiQ2hhbmdlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGlucHV0SGFuZGxlRm9jdXMgPSBmdW5jdGlvbiBpbnB1dEhhbmRsZUZvY3VzKCkge1xuICAgICAgaWYgKCFsYXRlc3RTdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IElucHV0Rm9jdXNcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0IChwcmVhY3QpICovXG4gICAgdmFyIG9uQ2hhbmdlS2V5ID0gJ29uQ2hhbmdlJztcbiAgICB2YXIgZXZlbnRIYW5kbGVycyA9IHt9O1xuICAgIGlmICghcmVzdC5kaXNhYmxlZCkge1xuICAgICAgdmFyIF9ldmVudEhhbmRsZXJzO1xuICAgICAgZXZlbnRIYW5kbGVycyA9IChfZXZlbnRIYW5kbGVycyA9IHt9LCBfZXZlbnRIYW5kbGVyc1tvbkNoYW5nZUtleV0gPSBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbkNoYW5nZSwgb25JbnB1dCwgaW5wdXRIYW5kbGVDaGFuZ2UpLCBfZXZlbnRIYW5kbGVycy5vbktleURvd24gPSBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbktleURvd24sIGlucHV0SGFuZGxlS2V5RG93biksIF9ldmVudEhhbmRsZXJzLm9uQmx1ciA9IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uQmx1ciwgaW5wdXRIYW5kbGVCbHVyKSwgX2V2ZW50SGFuZGxlcnMub25Gb2N1cyA9IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uRm9jdXMsIGlucHV0SGFuZGxlRm9jdXMpLCBfZXZlbnRIYW5kbGVycyk7XG4gICAgfVxuICAgIHJldHVybiBfZXh0ZW5kcygoX2V4dGVuZHM1ID0ge30sIF9leHRlbmRzNVtyZWZLZXldID0gaGFuZGxlUmVmcyhyZWYsIGZ1bmN0aW9uIChpbnB1dE5vZGUpIHtcbiAgICAgIGlucHV0UmVmLmN1cnJlbnQgPSBpbnB1dE5vZGU7XG4gICAgfSksIF9leHRlbmRzNVsnYXJpYS1hY3RpdmVkZXNjZW5kYW50J10gPSBsYXRlc3RTdGF0ZS5pc09wZW4gJiYgbGF0ZXN0U3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCA+IC0xID8gZWxlbWVudElkcy5nZXRJdGVtSWQobGF0ZXN0U3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCkgOiAnJywgX2V4dGVuZHM1WydhcmlhLWF1dG9jb21wbGV0ZSddID0gJ2xpc3QnLCBfZXh0ZW5kczVbJ2FyaWEtY29udHJvbHMnXSA9IGVsZW1lbnRJZHMubWVudUlkLCBfZXh0ZW5kczVbJ2FyaWEtZXhwYW5kZWQnXSA9IGxhdGVzdFN0YXRlLmlzT3BlbiwgX2V4dGVuZHM1WydhcmlhLWxhYmVsbGVkYnknXSA9IHJlc3QgJiYgcmVzdFsnYXJpYS1sYWJlbCddID8gdW5kZWZpbmVkIDogXCJcIiArIGVsZW1lbnRJZHMubGFiZWxJZCwgX2V4dGVuZHM1LmF1dG9Db21wbGV0ZSA9ICdvZmYnLCBfZXh0ZW5kczUuaWQgPSBlbGVtZW50SWRzLmlucHV0SWQsIF9leHRlbmRzNS5yb2xlID0gJ2NvbWJvYm94JywgX2V4dGVuZHM1LnZhbHVlID0gbGF0ZXN0U3RhdGUuaW5wdXRWYWx1ZSwgX2V4dGVuZHM1KSwgZXZlbnRIYW5kbGVycywgcmVzdCk7XG4gIH0sIFtzZXRHZXR0ZXJQcm9wQ2FsbEluZm8sIGxhdGVzdCwgZWxlbWVudElkcywgaW5wdXRLZXlEb3duSGFuZGxlcnMsIGRpc3BhdGNoLCBtb3VzZUFuZFRvdWNoVHJhY2tlcnNSZWYsIGVudmlyb25tZW50XSk7XG5cbiAgLy8gcmV0dXJuc1xuICB2YXIgdG9nZ2xlTWVudSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICgpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBGdW5jdGlvblRvZ2dsZU1lbnVcbiAgICB9KTtcbiAgfSwgW2Rpc3BhdGNoXSk7XG4gIHZhciBjbG9zZU1lbnUgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25DbG9zZU1lbnVcbiAgICB9KTtcbiAgfSwgW2Rpc3BhdGNoXSk7XG4gIHZhciBvcGVuTWVudSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICgpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBGdW5jdGlvbk9wZW5NZW51XG4gICAgfSk7XG4gIH0sIFtkaXNwYXRjaF0pO1xuICB2YXIgc2V0SGlnaGxpZ2h0ZWRJbmRleCA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChuZXdIaWdobGlnaHRlZEluZGV4KSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25TZXRIaWdobGlnaHRlZEluZGV4LFxuICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogbmV3SGlnaGxpZ2h0ZWRJbmRleFxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgdmFyIHNlbGVjdEl0ZW0gPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAobmV3U2VsZWN0ZWRJdGVtKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25TZWxlY3RJdGVtLFxuICAgICAgc2VsZWN0ZWRJdGVtOiBuZXdTZWxlY3RlZEl0ZW1cbiAgICB9KTtcbiAgfSwgW2Rpc3BhdGNoXSk7XG4gIHZhciBzZXRJbnB1dFZhbHVlID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKG5ld0lucHV0VmFsdWUpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBGdW5jdGlvblNldElucHV0VmFsdWUsXG4gICAgICBpbnB1dFZhbHVlOiBuZXdJbnB1dFZhbHVlXG4gICAgfSk7XG4gIH0sIFtkaXNwYXRjaF0pO1xuICB2YXIgcmVzZXQgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25SZXNldCQxXG4gICAgfSk7XG4gIH0sIFtkaXNwYXRjaF0pO1xuICByZXR1cm4ge1xuICAgIC8vIHByb3AgZ2V0dGVycy5cbiAgICBnZXRJdGVtUHJvcHM6IGdldEl0ZW1Qcm9wcyxcbiAgICBnZXRMYWJlbFByb3BzOiBnZXRMYWJlbFByb3BzLFxuICAgIGdldE1lbnVQcm9wczogZ2V0TWVudVByb3BzLFxuICAgIGdldElucHV0UHJvcHM6IGdldElucHV0UHJvcHMsXG4gICAgZ2V0VG9nZ2xlQnV0dG9uUHJvcHM6IGdldFRvZ2dsZUJ1dHRvblByb3BzLFxuICAgIC8vIGFjdGlvbnMuXG4gICAgdG9nZ2xlTWVudTogdG9nZ2xlTWVudSxcbiAgICBvcGVuTWVudTogb3Blbk1lbnUsXG4gICAgY2xvc2VNZW51OiBjbG9zZU1lbnUsXG4gICAgc2V0SGlnaGxpZ2h0ZWRJbmRleDogc2V0SGlnaGxpZ2h0ZWRJbmRleCxcbiAgICBzZXRJbnB1dFZhbHVlOiBzZXRJbnB1dFZhbHVlLFxuICAgIHNlbGVjdEl0ZW06IHNlbGVjdEl0ZW0sXG4gICAgcmVzZXQ6IHJlc2V0LFxuICAgIC8vIHN0YXRlLlxuICAgIGhpZ2hsaWdodGVkSW5kZXg6IGhpZ2hsaWdodGVkSW5kZXgsXG4gICAgaXNPcGVuOiBpc09wZW4sXG4gICAgc2VsZWN0ZWRJdGVtOiBzZWxlY3RlZEl0ZW0sXG4gICAgaW5wdXRWYWx1ZTogaW5wdXRWYWx1ZVxuICB9O1xufVxuXG52YXIgZGVmYXVsdFN0YXRlVmFsdWVzID0ge1xuICBhY3RpdmVJbmRleDogLTEsXG4gIHNlbGVjdGVkSXRlbXM6IFtdXG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGluaXRpYWwgdmFsdWUgZm9yIGEgc3RhdGUga2V5IGluIHRoZSBmb2xsb3dpbmcgb3JkZXI6XG4gKiAxLiBjb250cm9sbGVkIHByb3AsIDIuIGluaXRpYWwgcHJvcCwgMy4gZGVmYXVsdCBwcm9wLCA0LiBkZWZhdWx0XG4gKiB2YWx1ZSBmcm9tIERvd25zaGlmdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgUHJvcHMgcGFzc2VkIHRvIHRoZSBob29rLlxuICogQHBhcmFtIHtzdHJpbmd9IHByb3BLZXkgUHJvcHMga2V5IHRvIGdlbmVyYXRlIHRoZSB2YWx1ZSBmb3IuXG4gKiBAcmV0dXJucyB7YW55fSBUaGUgaW5pdGlhbCB2YWx1ZSBmb3IgdGhhdCBwcm9wLlxuICovXG5mdW5jdGlvbiBnZXRJbml0aWFsVmFsdWUocHJvcHMsIHByb3BLZXkpIHtcbiAgcmV0dXJuIGdldEluaXRpYWxWYWx1ZSQxKHByb3BzLCBwcm9wS2V5LCBkZWZhdWx0U3RhdGVWYWx1ZXMpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGRlZmF1bHQgdmFsdWUgZm9yIGEgc3RhdGUga2V5IGluIHRoZSBmb2xsb3dpbmcgb3JkZXI6XG4gKiAxLiBjb250cm9sbGVkIHByb3AsIDIuIGRlZmF1bHQgcHJvcCwgMy4gZGVmYXVsdCB2YWx1ZSBmcm9tIERvd25zaGlmdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgUHJvcHMgcGFzc2VkIHRvIHRoZSBob29rLlxuICogQHBhcmFtIHtzdHJpbmd9IHByb3BLZXkgUHJvcHMga2V5IHRvIGdlbmVyYXRlIHRoZSB2YWx1ZSBmb3IuXG4gKiBAcmV0dXJucyB7YW55fSBUaGUgaW5pdGlhbCB2YWx1ZSBmb3IgdGhhdCBwcm9wLlxuICovXG5mdW5jdGlvbiBnZXREZWZhdWx0VmFsdWUocHJvcHMsIHByb3BLZXkpIHtcbiAgcmV0dXJuIGdldERlZmF1bHRWYWx1ZSQxKHByb3BzLCBwcm9wS2V5LCBkZWZhdWx0U3RhdGVWYWx1ZXMpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGluaXRpYWwgc3RhdGUgYmFzZWQgb24gdGhlIHByb3ZpZGVkIHByb3BzLiBJdCB1c2VzIGluaXRpYWwsIGRlZmF1bHRcbiAqIGFuZCBjb250cm9sbGVkIHByb3BzIHJlbGF0ZWQgdG8gc3RhdGUgaW4gb3JkZXIgdG8gY29tcHV0ZSB0aGUgaW5pdGlhbCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgUHJvcHMgcGFzc2VkIHRvIHRoZSBob29rLlxuICogQHJldHVybnMge09iamVjdH0gVGhlIGluaXRpYWwgc3RhdGUuXG4gKi9cbmZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZShwcm9wcykge1xuICB2YXIgYWN0aXZlSW5kZXggPSBnZXRJbml0aWFsVmFsdWUocHJvcHMsICdhY3RpdmVJbmRleCcpO1xuICB2YXIgc2VsZWN0ZWRJdGVtcyA9IGdldEluaXRpYWxWYWx1ZShwcm9wcywgJ3NlbGVjdGVkSXRlbXMnKTtcbiAgcmV0dXJuIHtcbiAgICBhY3RpdmVJbmRleDogYWN0aXZlSW5kZXgsXG4gICAgc2VsZWN0ZWRJdGVtczogc2VsZWN0ZWRJdGVtc1xuICB9O1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBkcm9wZG93biBrZXlkb3duIG9wZXJhdGlvbiBpcyBwZXJtaXR0ZWQuIFNob3VsZCBub3QgYmVcbiAqIGFsbG93ZWQgb24ga2V5ZG93biB3aXRoIG1vZGlmaWVyIGtleXMgKGN0cmwsIGFsdCwgc2hpZnQsIG1ldGEpLCBvblxuICogaW5wdXQgZWxlbWVudCB3aXRoIHRleHQgY29udGVudCB0aGF0IGlzIGVpdGhlciBoaWdobGlnaHRlZCBvciBzZWxlY3Rpb25cbiAqIGN1cnNvciBpcyBub3QgYXQgdGhlIHN0YXJ0aW5nIHBvc2l0aW9uLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgVGhlIGV2ZW50IGZyb20ga2V5ZG93bi5cbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIHRoZSBvcGVyYXRpb24gaXMgYWxsb3dlZC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlEb3duT3BlcmF0aW9uUGVybWl0dGVkKGV2ZW50KSB7XG4gIGlmIChldmVudC5zaGlmdEtleSB8fCBldmVudC5tZXRhS2V5IHx8IGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQuYWx0S2V5KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiZcbiAgLy8gaWYgZWxlbWVudCBpcyBhIHRleHQgaW5wdXRcbiAgZWxlbWVudC52YWx1ZSAhPT0gJycgJiYgKFxuICAvLyBhbmQgd2UgaGF2ZSB0ZXh0IGluIGl0XG4gIC8vIGFuZCBjdXJzb3IgaXMgZWl0aGVyIG5vdCBhdCB0aGUgc3RhcnQgb3IgaXMgY3VycmVudGx5IGhpZ2hsaWdodGluZyB0ZXh0LlxuICBlbGVtZW50LnNlbGVjdGlvblN0YXJ0ICE9PSAwIHx8IGVsZW1lbnQuc2VsZWN0aW9uRW5kICE9PSAwKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgbWVzc2FnZSB0byBiZSBhZGRlZCB0byBhcmlhLWxpdmUgcmVnaW9uIHdoZW4gaXRlbSBpcyByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZWxlY3Rpb25QYXJhbWV0ZXJzIFBhcmFtZXRlcnMgcmVxdWlyZWQgdG8gYnVpbGQgdGhlIG1lc3NhZ2UuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgYTExeSBtZXNzYWdlLlxuICovXG5mdW5jdGlvbiBnZXRBMTF5UmVtb3ZhbE1lc3NhZ2Uoc2VsZWN0aW9uUGFyYW1ldGVycykge1xuICB2YXIgcmVtb3ZlZFNlbGVjdGVkSXRlbSA9IHNlbGVjdGlvblBhcmFtZXRlcnMucmVtb3ZlZFNlbGVjdGVkSXRlbSxcbiAgICBpdGVtVG9TdHJpbmdMb2NhbCA9IHNlbGVjdGlvblBhcmFtZXRlcnMuaXRlbVRvU3RyaW5nO1xuICByZXR1cm4gaXRlbVRvU3RyaW5nTG9jYWwocmVtb3ZlZFNlbGVjdGVkSXRlbSkgKyBcIiBoYXMgYmVlbiByZW1vdmVkLlwiO1xufVxudmFyIHByb3BUeXBlcyA9IHtcbiAgc2VsZWN0ZWRJdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICBpbml0aWFsU2VsZWN0ZWRJdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICBkZWZhdWx0U2VsZWN0ZWRJdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICBpdGVtVG9TdHJpbmc6IFByb3BUeXBlcy5mdW5jLFxuICBnZXRBMTF5UmVtb3ZhbE1lc3NhZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBzdGF0ZVJlZHVjZXI6IFByb3BUeXBlcy5mdW5jLFxuICBhY3RpdmVJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgaW5pdGlhbEFjdGl2ZUluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICBkZWZhdWx0QWN0aXZlSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9uQWN0aXZlSW5kZXhDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvblNlbGVjdGVkSXRlbXNDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBrZXlOYXZpZ2F0aW9uTmV4dDogUHJvcFR5cGVzLnN0cmluZyxcbiAga2V5TmF2aWdhdGlvblByZXZpb3VzOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBlbnZpcm9ubWVudDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICBhZGRFdmVudExpc3RlbmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICByZW1vdmVFdmVudExpc3RlbmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBkb2N1bWVudDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGdldEVsZW1lbnRCeUlkOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgIGFjdGl2ZUVsZW1lbnQ6IFByb3BUeXBlcy5hbnksXG4gICAgICBib2R5OiBQcm9wVHlwZXMuYW55XG4gICAgfSlcbiAgfSlcbn07XG52YXIgZGVmYXVsdFByb3BzID0ge1xuICBpdGVtVG9TdHJpbmc6IGRlZmF1bHRQcm9wcyQzLml0ZW1Ub1N0cmluZyxcbiAgc3RhdGVSZWR1Y2VyOiBkZWZhdWx0UHJvcHMkMy5zdGF0ZVJlZHVjZXIsXG4gIGVudmlyb25tZW50OiBkZWZhdWx0UHJvcHMkMy5lbnZpcm9ubWVudCxcbiAgZ2V0QTExeVJlbW92YWxNZXNzYWdlOiBnZXRBMTF5UmVtb3ZhbE1lc3NhZ2UsXG4gIGtleU5hdmlnYXRpb25OZXh0OiAnQXJyb3dSaWdodCcsXG4gIGtleU5hdmlnYXRpb25QcmV2aW91czogJ0Fycm93TGVmdCdcbn07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tbXV0YWJsZS1leHBvcnRzXG52YXIgdmFsaWRhdGVQcm9wVHlwZXMgPSBub29wO1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhbGlkYXRlUHJvcFR5cGVzID0gZnVuY3Rpb24gdmFsaWRhdGVQcm9wVHlwZXMob3B0aW9ucywgY2FsbGVyKSB7XG4gICAgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKHByb3BUeXBlcywgb3B0aW9ucywgJ3Byb3AnLCBjYWxsZXIubmFtZSk7XG4gIH07XG59XG5cbnZhciBTZWxlY3RlZEl0ZW1DbGljayA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3NlbGVjdGVkX2l0ZW1fY2xpY2tfXycgOiAwO1xudmFyIFNlbGVjdGVkSXRlbUtleURvd25EZWxldGUgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19zZWxlY3RlZF9pdGVtX2tleWRvd25fZGVsZXRlX18nIDogMTtcbnZhciBTZWxlY3RlZEl0ZW1LZXlEb3duQmFja3NwYWNlID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fc2VsZWN0ZWRfaXRlbV9rZXlkb3duX2JhY2tzcGFjZV9fJyA6IDI7XG52YXIgU2VsZWN0ZWRJdGVtS2V5RG93bk5hdmlnYXRpb25OZXh0ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fc2VsZWN0ZWRfaXRlbV9rZXlkb3duX25hdmlnYXRpb25fbmV4dF9fJyA6IDM7XG52YXIgU2VsZWN0ZWRJdGVtS2V5RG93bk5hdmlnYXRpb25QcmV2aW91cyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3NlbGVjdGVkX2l0ZW1fa2V5ZG93bl9uYXZpZ2F0aW9uX3ByZXZpb3VzX18nIDogNDtcbnZhciBEcm9wZG93bktleURvd25OYXZpZ2F0aW9uUHJldmlvdXMgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19kcm9wZG93bl9rZXlkb3duX25hdmlnYXRpb25fcHJldmlvdXNfXycgOiA1O1xudmFyIERyb3Bkb3duS2V5RG93bkJhY2tzcGFjZSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2Ryb3Bkb3duX2tleWRvd25fYmFja3NwYWNlX18nIDogNjtcbnZhciBEcm9wZG93bkNsaWNrID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fZHJvcGRvd25fY2xpY2tfXycgOiA3O1xudmFyIEZ1bmN0aW9uQWRkU2VsZWN0ZWRJdGVtID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fZnVuY3Rpb25fYWRkX3NlbGVjdGVkX2l0ZW1fXycgOiA4O1xudmFyIEZ1bmN0aW9uUmVtb3ZlU2VsZWN0ZWRJdGVtID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fZnVuY3Rpb25fcmVtb3ZlX3NlbGVjdGVkX2l0ZW1fXycgOiA5O1xudmFyIEZ1bmN0aW9uU2V0U2VsZWN0ZWRJdGVtcyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2Z1bmN0aW9uX3NldF9zZWxlY3RlZF9pdGVtc19fJyA6IDEwO1xudmFyIEZ1bmN0aW9uU2V0QWN0aXZlSW5kZXggPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9zZXRfYWN0aXZlX2luZGV4X18nIDogMTE7XG52YXIgRnVuY3Rpb25SZXNldCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2Z1bmN0aW9uX3Jlc2V0X18nIDogMTI7XG5cbnZhciBzdGF0ZUNoYW5nZVR5cGVzID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICBfX3Byb3RvX186IG51bGwsXG4gIFNlbGVjdGVkSXRlbUNsaWNrOiBTZWxlY3RlZEl0ZW1DbGljayxcbiAgU2VsZWN0ZWRJdGVtS2V5RG93bkRlbGV0ZTogU2VsZWN0ZWRJdGVtS2V5RG93bkRlbGV0ZSxcbiAgU2VsZWN0ZWRJdGVtS2V5RG93bkJhY2tzcGFjZTogU2VsZWN0ZWRJdGVtS2V5RG93bkJhY2tzcGFjZSxcbiAgU2VsZWN0ZWRJdGVtS2V5RG93bk5hdmlnYXRpb25OZXh0OiBTZWxlY3RlZEl0ZW1LZXlEb3duTmF2aWdhdGlvbk5leHQsXG4gIFNlbGVjdGVkSXRlbUtleURvd25OYXZpZ2F0aW9uUHJldmlvdXM6IFNlbGVjdGVkSXRlbUtleURvd25OYXZpZ2F0aW9uUHJldmlvdXMsXG4gIERyb3Bkb3duS2V5RG93bk5hdmlnYXRpb25QcmV2aW91czogRHJvcGRvd25LZXlEb3duTmF2aWdhdGlvblByZXZpb3VzLFxuICBEcm9wZG93bktleURvd25CYWNrc3BhY2U6IERyb3Bkb3duS2V5RG93bkJhY2tzcGFjZSxcbiAgRHJvcGRvd25DbGljazogRHJvcGRvd25DbGljayxcbiAgRnVuY3Rpb25BZGRTZWxlY3RlZEl0ZW06IEZ1bmN0aW9uQWRkU2VsZWN0ZWRJdGVtLFxuICBGdW5jdGlvblJlbW92ZVNlbGVjdGVkSXRlbTogRnVuY3Rpb25SZW1vdmVTZWxlY3RlZEl0ZW0sXG4gIEZ1bmN0aW9uU2V0U2VsZWN0ZWRJdGVtczogRnVuY3Rpb25TZXRTZWxlY3RlZEl0ZW1zLFxuICBGdW5jdGlvblNldEFjdGl2ZUluZGV4OiBGdW5jdGlvblNldEFjdGl2ZUluZGV4LFxuICBGdW5jdGlvblJlc2V0OiBGdW5jdGlvblJlc2V0XG59KTtcblxuLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSAqL1xuZnVuY3Rpb24gZG93bnNoaWZ0TXVsdGlwbGVTZWxlY3Rpb25SZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgdmFyIHR5cGUgPSBhY3Rpb24udHlwZSxcbiAgICBpbmRleCA9IGFjdGlvbi5pbmRleCxcbiAgICBwcm9wcyA9IGFjdGlvbi5wcm9wcyxcbiAgICBzZWxlY3RlZEl0ZW0gPSBhY3Rpb24uc2VsZWN0ZWRJdGVtO1xuICB2YXIgYWN0aXZlSW5kZXggPSBzdGF0ZS5hY3RpdmVJbmRleCxcbiAgICBzZWxlY3RlZEl0ZW1zID0gc3RhdGUuc2VsZWN0ZWRJdGVtcztcbiAgdmFyIGNoYW5nZXM7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgU2VsZWN0ZWRJdGVtQ2xpY2s6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBhY3RpdmVJbmRleDogaW5kZXhcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIFNlbGVjdGVkSXRlbUtleURvd25OYXZpZ2F0aW9uUHJldmlvdXM6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBhY3RpdmVJbmRleDogYWN0aXZlSW5kZXggLSAxIDwgMCA/IDAgOiBhY3RpdmVJbmRleCAtIDFcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIFNlbGVjdGVkSXRlbUtleURvd25OYXZpZ2F0aW9uTmV4dDpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGFjdGl2ZUluZGV4OiBhY3RpdmVJbmRleCArIDEgPj0gc2VsZWN0ZWRJdGVtcy5sZW5ndGggPyAtMSA6IGFjdGl2ZUluZGV4ICsgMVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgU2VsZWN0ZWRJdGVtS2V5RG93bkJhY2tzcGFjZTpcbiAgICBjYXNlIFNlbGVjdGVkSXRlbUtleURvd25EZWxldGU6XG4gICAgICB7XG4gICAgICAgIGlmIChhY3RpdmVJbmRleCA8IDApIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmV3QWN0aXZlSW5kZXggPSBhY3RpdmVJbmRleDtcbiAgICAgICAgaWYgKHNlbGVjdGVkSXRlbXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgbmV3QWN0aXZlSW5kZXggPSAtMTtcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbmRleCA9PT0gc2VsZWN0ZWRJdGVtcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgbmV3QWN0aXZlSW5kZXggPSBzZWxlY3RlZEl0ZW1zLmxlbmd0aCAtIDI7XG4gICAgICAgIH1cbiAgICAgICAgY2hhbmdlcyA9IF9leHRlbmRzKHtcbiAgICAgICAgICBzZWxlY3RlZEl0ZW1zOiBbXS5jb25jYXQoc2VsZWN0ZWRJdGVtcy5zbGljZSgwLCBhY3RpdmVJbmRleCksIHNlbGVjdGVkSXRlbXMuc2xpY2UoYWN0aXZlSW5kZXggKyAxKSlcbiAgICAgICAgfSwge1xuICAgICAgICAgIGFjdGl2ZUluZGV4OiBuZXdBY3RpdmVJbmRleFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgY2FzZSBEcm9wZG93bktleURvd25OYXZpZ2F0aW9uUHJldmlvdXM6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBhY3RpdmVJbmRleDogc2VsZWN0ZWRJdGVtcy5sZW5ndGggLSAxXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBEcm9wZG93bktleURvd25CYWNrc3BhY2U6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBzZWxlY3RlZEl0ZW1zOiBzZWxlY3RlZEl0ZW1zLnNsaWNlKDAsIHNlbGVjdGVkSXRlbXMubGVuZ3RoIC0gMSlcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIEZ1bmN0aW9uQWRkU2VsZWN0ZWRJdGVtOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgc2VsZWN0ZWRJdGVtczogW10uY29uY2F0KHNlbGVjdGVkSXRlbXMsIFtzZWxlY3RlZEl0ZW1dKVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgRHJvcGRvd25DbGljazpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGFjdGl2ZUluZGV4OiAtMVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgRnVuY3Rpb25SZW1vdmVTZWxlY3RlZEl0ZW06XG4gICAgICB7XG4gICAgICAgIHZhciBfbmV3QWN0aXZlSW5kZXggPSBhY3RpdmVJbmRleDtcbiAgICAgICAgdmFyIHNlbGVjdGVkSXRlbUluZGV4ID0gc2VsZWN0ZWRJdGVtcy5pbmRleE9mKHNlbGVjdGVkSXRlbSk7XG4gICAgICAgIGlmIChzZWxlY3RlZEl0ZW1JbmRleCA8IDApIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZWN0ZWRJdGVtcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBfbmV3QWN0aXZlSW5kZXggPSAtMTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZEl0ZW1JbmRleCA9PT0gc2VsZWN0ZWRJdGVtcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgX25ld0FjdGl2ZUluZGV4ID0gc2VsZWN0ZWRJdGVtcy5sZW5ndGggLSAyO1xuICAgICAgICB9XG4gICAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgICAgc2VsZWN0ZWRJdGVtczogW10uY29uY2F0KHNlbGVjdGVkSXRlbXMuc2xpY2UoMCwgc2VsZWN0ZWRJdGVtSW5kZXgpLCBzZWxlY3RlZEl0ZW1zLnNsaWNlKHNlbGVjdGVkSXRlbUluZGV4ICsgMSkpLFxuICAgICAgICAgIGFjdGl2ZUluZGV4OiBfbmV3QWN0aXZlSW5kZXhcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgY2FzZSBGdW5jdGlvblNldFNlbGVjdGVkSXRlbXM6XG4gICAgICB7XG4gICAgICAgIHZhciBuZXdTZWxlY3RlZEl0ZW1zID0gYWN0aW9uLnNlbGVjdGVkSXRlbXM7XG4gICAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgICAgc2VsZWN0ZWRJdGVtczogbmV3U2VsZWN0ZWRJdGVtc1xuICAgICAgICB9O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICBjYXNlIEZ1bmN0aW9uU2V0QWN0aXZlSW5kZXg6XG4gICAgICB7XG4gICAgICAgIHZhciBfbmV3QWN0aXZlSW5kZXgyID0gYWN0aW9uLmFjdGl2ZUluZGV4O1xuICAgICAgICBjaGFuZ2VzID0ge1xuICAgICAgICAgIGFjdGl2ZUluZGV4OiBfbmV3QWN0aXZlSW5kZXgyXG4gICAgICAgIH07XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIGNhc2UgRnVuY3Rpb25SZXNldDpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGFjdGl2ZUluZGV4OiBnZXREZWZhdWx0VmFsdWUocHJvcHMsICdhY3RpdmVJbmRleCcpLFxuICAgICAgICBzZWxlY3RlZEl0ZW1zOiBnZXREZWZhdWx0VmFsdWUocHJvcHMsICdzZWxlY3RlZEl0ZW1zJylcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWR1Y2VyIGNhbGxlZCB3aXRob3V0IHByb3BlciBhY3Rpb24gdHlwZS4nKTtcbiAgfVxuICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCBjaGFuZ2VzKTtcbn1cblxudmFyIF9leGNsdWRlZCA9IFtcInJlZktleVwiLCBcInJlZlwiLCBcIm9uQ2xpY2tcIiwgXCJvbktleURvd25cIiwgXCJzZWxlY3RlZEl0ZW1cIiwgXCJpbmRleFwiXSxcbiAgX2V4Y2x1ZGVkMiA9IFtcInJlZktleVwiLCBcInJlZlwiLCBcIm9uS2V5RG93blwiLCBcIm9uQ2xpY2tcIiwgXCJwcmV2ZW50S2V5QWN0aW9uXCJdO1xudXNlTXVsdGlwbGVTZWxlY3Rpb24uc3RhdGVDaGFuZ2VUeXBlcyA9IHN0YXRlQ2hhbmdlVHlwZXM7XG5mdW5jdGlvbiB1c2VNdWx0aXBsZVNlbGVjdGlvbih1c2VyUHJvcHMpIHtcbiAgaWYgKHVzZXJQcm9wcyA9PT0gdm9pZCAwKSB7XG4gICAgdXNlclByb3BzID0ge307XG4gIH1cbiAgdmFsaWRhdGVQcm9wVHlwZXModXNlclByb3BzLCB1c2VNdWx0aXBsZVNlbGVjdGlvbik7XG4gIC8vIFByb3BzIGRlZmF1bHRzIGFuZCBkZXN0cnVjdHVyaW5nLlxuICB2YXIgcHJvcHMgPSBfZXh0ZW5kcyh7fSwgZGVmYXVsdFByb3BzLCB1c2VyUHJvcHMpO1xuICB2YXIgZ2V0QTExeVJlbW92YWxNZXNzYWdlID0gcHJvcHMuZ2V0QTExeVJlbW92YWxNZXNzYWdlLFxuICAgIGl0ZW1Ub1N0cmluZyA9IHByb3BzLml0ZW1Ub1N0cmluZyxcbiAgICBlbnZpcm9ubWVudCA9IHByb3BzLmVudmlyb25tZW50LFxuICAgIGtleU5hdmlnYXRpb25OZXh0ID0gcHJvcHMua2V5TmF2aWdhdGlvbk5leHQsXG4gICAga2V5TmF2aWdhdGlvblByZXZpb3VzID0gcHJvcHMua2V5TmF2aWdhdGlvblByZXZpb3VzO1xuXG4gIC8vIFJlZHVjZXIgaW5pdC5cbiAgdmFyIF91c2VDb250cm9sbGVkUmVkdWNlciA9IHVzZUNvbnRyb2xsZWRSZWR1Y2VyJDEoZG93bnNoaWZ0TXVsdGlwbGVTZWxlY3Rpb25SZWR1Y2VyLCBnZXRJbml0aWFsU3RhdGUocHJvcHMpLCBwcm9wcyksXG4gICAgc3RhdGUgPSBfdXNlQ29udHJvbGxlZFJlZHVjZXJbMF0sXG4gICAgZGlzcGF0Y2ggPSBfdXNlQ29udHJvbGxlZFJlZHVjZXJbMV07XG4gIHZhciBhY3RpdmVJbmRleCA9IHN0YXRlLmFjdGl2ZUluZGV4LFxuICAgIHNlbGVjdGVkSXRlbXMgPSBzdGF0ZS5zZWxlY3RlZEl0ZW1zO1xuXG4gIC8vIFJlZnMuXG4gIHZhciBpc0luaXRpYWxNb3VudFJlZiA9IHVzZVJlZih0cnVlKTtcbiAgdmFyIGRyb3Bkb3duUmVmID0gdXNlUmVmKG51bGwpO1xuICB2YXIgcHJldmlvdXNTZWxlY3RlZEl0ZW1zUmVmID0gdXNlUmVmKHNlbGVjdGVkSXRlbXMpO1xuICB2YXIgc2VsZWN0ZWRJdGVtUmVmcyA9IHVzZVJlZigpO1xuICBzZWxlY3RlZEl0ZW1SZWZzLmN1cnJlbnQgPSBbXTtcbiAgdmFyIGxhdGVzdCA9IHVzZUxhdGVzdFJlZih7XG4gICAgc3RhdGU6IHN0YXRlLFxuICAgIHByb3BzOiBwcm9wc1xuICB9KTtcblxuICAvLyBFZmZlY3RzLlxuICAvKiBTZXRzIGExMXkgc3RhdHVzIG1lc3NhZ2Ugb24gY2hhbmdlcyBpbiBzZWxlY3RlZEl0ZW0uICovXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQgfHwgZmFsc2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHNlbGVjdGVkSXRlbXMubGVuZ3RoIDwgcHJldmlvdXNTZWxlY3RlZEl0ZW1zUmVmLmN1cnJlbnQubGVuZ3RoKSB7XG4gICAgICB2YXIgcmVtb3ZlZFNlbGVjdGVkSXRlbSA9IHByZXZpb3VzU2VsZWN0ZWRJdGVtc1JlZi5jdXJyZW50LmZpbmQoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdGVkSXRlbXMuaW5kZXhPZihpdGVtKSA8IDA7XG4gICAgICB9KTtcbiAgICAgIHNldFN0YXR1cyhnZXRBMTF5UmVtb3ZhbE1lc3NhZ2Uoe1xuICAgICAgICBpdGVtVG9TdHJpbmc6IGl0ZW1Ub1N0cmluZyxcbiAgICAgICAgcmVzdWx0Q291bnQ6IHNlbGVjdGVkSXRlbXMubGVuZ3RoLFxuICAgICAgICByZW1vdmVkU2VsZWN0ZWRJdGVtOiByZW1vdmVkU2VsZWN0ZWRJdGVtLFxuICAgICAgICBhY3RpdmVJbmRleDogYWN0aXZlSW5kZXgsXG4gICAgICAgIGFjdGl2ZVNlbGVjdGVkSXRlbTogc2VsZWN0ZWRJdGVtc1thY3RpdmVJbmRleF1cbiAgICAgIH0pLCBlbnZpcm9ubWVudC5kb2N1bWVudCk7XG4gICAgfVxuICAgIHByZXZpb3VzU2VsZWN0ZWRJdGVtc1JlZi5jdXJyZW50ID0gc2VsZWN0ZWRJdGVtcztcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgfSwgW3NlbGVjdGVkSXRlbXMubGVuZ3RoXSk7XG4gIC8vIFNldHMgZm9jdXMgb24gYWN0aXZlIGl0ZW0uXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGFjdGl2ZUluZGV4ID09PSAtMSAmJiBkcm9wZG93blJlZi5jdXJyZW50KSB7XG4gICAgICBkcm9wZG93blJlZi5jdXJyZW50LmZvY3VzKCk7XG4gICAgfSBlbHNlIGlmIChzZWxlY3RlZEl0ZW1SZWZzLmN1cnJlbnRbYWN0aXZlSW5kZXhdKSB7XG4gICAgICBzZWxlY3RlZEl0ZW1SZWZzLmN1cnJlbnRbYWN0aXZlSW5kZXhdLmZvY3VzKCk7XG4gICAgfVxuICB9LCBbYWN0aXZlSW5kZXhdKTtcbiAgdXNlQ29udHJvbFByb3BzVmFsaWRhdG9yKHtcbiAgICBpc0luaXRpYWxNb3VudDogaXNJbml0aWFsTW91bnRSZWYuY3VycmVudCxcbiAgICBwcm9wczogcHJvcHMsXG4gICAgc3RhdGU6IHN0YXRlXG4gIH0pO1xuICB2YXIgc2V0R2V0dGVyUHJvcENhbGxJbmZvID0gdXNlR2V0dGVyUHJvcHNDYWxsZWRDaGVja2VyKCdnZXREcm9wZG93blByb3BzJyk7XG4gIC8vIE1ha2UgaW5pdGlhbCByZWYgZmFsc2UuXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgaXNJbml0aWFsTW91bnRSZWYuY3VycmVudCA9IGZhbHNlO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpc0luaXRpYWxNb3VudFJlZi5jdXJyZW50ID0gdHJ1ZTtcbiAgICB9O1xuICB9LCBbXSk7XG5cbiAgLy8gRXZlbnQgaGFuZGxlciBmdW5jdGlvbnMuXG4gIHZhciBzZWxlY3RlZEl0ZW1LZXlEb3duSGFuZGxlcnMgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX3JlZjtcbiAgICByZXR1cm4gX3JlZiA9IHt9LCBfcmVmW2tleU5hdmlnYXRpb25QcmV2aW91c10gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IFNlbGVjdGVkSXRlbUtleURvd25OYXZpZ2F0aW9uUHJldmlvdXNcbiAgICAgIH0pO1xuICAgIH0sIF9yZWZba2V5TmF2aWdhdGlvbk5leHRdID0gZnVuY3Rpb24gKCkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBTZWxlY3RlZEl0ZW1LZXlEb3duTmF2aWdhdGlvbk5leHRcbiAgICAgIH0pO1xuICAgIH0sIF9yZWYuRGVsZXRlID0gZnVuY3Rpb24gRGVsZXRlKCkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBTZWxlY3RlZEl0ZW1LZXlEb3duRGVsZXRlXG4gICAgICB9KTtcbiAgICB9LCBfcmVmLkJhY2tzcGFjZSA9IGZ1bmN0aW9uIEJhY2tzcGFjZSgpIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogU2VsZWN0ZWRJdGVtS2V5RG93bkJhY2tzcGFjZVxuICAgICAgfSk7XG4gICAgfSwgX3JlZjtcbiAgfSwgW2Rpc3BhdGNoLCBrZXlOYXZpZ2F0aW9uTmV4dCwga2V5TmF2aWdhdGlvblByZXZpb3VzXSk7XG4gIHZhciBkcm9wZG93bktleURvd25IYW5kbGVycyA9IHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgIHZhciBfcmVmMjtcbiAgICByZXR1cm4gX3JlZjIgPSB7fSwgX3JlZjJba2V5TmF2aWdhdGlvblByZXZpb3VzXSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYgKGlzS2V5RG93bk9wZXJhdGlvblBlcm1pdHRlZChldmVudCkpIHtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IERyb3Bkb3duS2V5RG93bk5hdmlnYXRpb25QcmV2aW91c1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LCBfcmVmMi5CYWNrc3BhY2UgPSBmdW5jdGlvbiBCYWNrc3BhY2UoZXZlbnQpIHtcbiAgICAgIGlmIChpc0tleURvd25PcGVyYXRpb25QZXJtaXR0ZWQoZXZlbnQpKSB7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBEcm9wZG93bktleURvd25CYWNrc3BhY2VcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwgX3JlZjI7XG4gIH0sIFtkaXNwYXRjaCwga2V5TmF2aWdhdGlvblByZXZpb3VzXSk7XG5cbiAgLy8gR2V0dGVyIHByb3BzLlxuICB2YXIgZ2V0U2VsZWN0ZWRJdGVtUHJvcHMgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoX3RlbXApIHtcbiAgICB2YXIgX2V4dGVuZHMyO1xuICAgIHZhciBfcmVmMyA9IF90ZW1wID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wLFxuICAgICAgX3JlZjMkcmVmS2V5ID0gX3JlZjMucmVmS2V5LFxuICAgICAgcmVmS2V5ID0gX3JlZjMkcmVmS2V5ID09PSB2b2lkIDAgPyAncmVmJyA6IF9yZWYzJHJlZktleSxcbiAgICAgIHJlZiA9IF9yZWYzLnJlZixcbiAgICAgIG9uQ2xpY2sgPSBfcmVmMy5vbkNsaWNrLFxuICAgICAgb25LZXlEb3duID0gX3JlZjMub25LZXlEb3duLFxuICAgICAgc2VsZWN0ZWRJdGVtUHJvcCA9IF9yZWYzLnNlbGVjdGVkSXRlbSxcbiAgICAgIGluZGV4UHJvcCA9IF9yZWYzLmluZGV4LFxuICAgICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWYzLCBfZXhjbHVkZWQpO1xuICAgIHZhciBsYXRlc3RTdGF0ZSA9IGxhdGVzdC5jdXJyZW50LnN0YXRlO1xuICAgIHZhciBfZ2V0SXRlbUFuZEluZGV4ID0gZ2V0SXRlbUFuZEluZGV4KHNlbGVjdGVkSXRlbVByb3AsIGluZGV4UHJvcCwgbGF0ZXN0U3RhdGUuc2VsZWN0ZWRJdGVtcywgJ1Bhc3MgZWl0aGVyIGl0ZW0gb3IgaW5kZXggdG8gZ2V0U2VsZWN0ZWRJdGVtUHJvcHMhJyksXG4gICAgICBpbmRleCA9IF9nZXRJdGVtQW5kSW5kZXhbMV07XG4gICAgdmFyIGlzRm9jdXNhYmxlID0gaW5kZXggPiAtMSAmJiBpbmRleCA9PT0gbGF0ZXN0U3RhdGUuYWN0aXZlSW5kZXg7XG4gICAgdmFyIHNlbGVjdGVkSXRlbUhhbmRsZUNsaWNrID0gZnVuY3Rpb24gc2VsZWN0ZWRJdGVtSGFuZGxlQ2xpY2soKSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IFNlbGVjdGVkSXRlbUNsaWNrLFxuICAgICAgICBpbmRleDogaW5kZXhcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIHNlbGVjdGVkSXRlbUhhbmRsZUtleURvd24gPSBmdW5jdGlvbiBzZWxlY3RlZEl0ZW1IYW5kbGVLZXlEb3duKGV2ZW50KSB7XG4gICAgICB2YXIga2V5ID0gbm9ybWFsaXplQXJyb3dLZXkoZXZlbnQpO1xuICAgICAgaWYgKGtleSAmJiBzZWxlY3RlZEl0ZW1LZXlEb3duSGFuZGxlcnNba2V5XSkge1xuICAgICAgICBzZWxlY3RlZEl0ZW1LZXlEb3duSGFuZGxlcnNba2V5XShldmVudCk7XG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gX2V4dGVuZHMoKF9leHRlbmRzMiA9IHt9LCBfZXh0ZW5kczJbcmVmS2V5XSA9IGhhbmRsZVJlZnMocmVmLCBmdW5jdGlvbiAoc2VsZWN0ZWRJdGVtTm9kZSkge1xuICAgICAgaWYgKHNlbGVjdGVkSXRlbU5vZGUpIHtcbiAgICAgICAgc2VsZWN0ZWRJdGVtUmVmcy5jdXJyZW50LnB1c2goc2VsZWN0ZWRJdGVtTm9kZSk7XG4gICAgICB9XG4gICAgfSksIF9leHRlbmRzMi50YWJJbmRleCA9IGlzRm9jdXNhYmxlID8gMCA6IC0xLCBfZXh0ZW5kczIub25DbGljayA9IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uQ2xpY2ssIHNlbGVjdGVkSXRlbUhhbmRsZUNsaWNrKSwgX2V4dGVuZHMyLm9uS2V5RG93biA9IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uS2V5RG93biwgc2VsZWN0ZWRJdGVtSGFuZGxlS2V5RG93biksIF9leHRlbmRzMiksIHJlc3QpO1xuICB9LCBbZGlzcGF0Y2gsIGxhdGVzdCwgc2VsZWN0ZWRJdGVtS2V5RG93bkhhbmRsZXJzXSk7XG4gIHZhciBnZXREcm9wZG93blByb3BzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKF90ZW1wMiwgX3RlbXAzKSB7XG4gICAgdmFyIF9leHRlbmRzMztcbiAgICB2YXIgX3JlZjQgPSBfdGVtcDIgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAyLFxuICAgICAgX3JlZjQkcmVmS2V5ID0gX3JlZjQucmVmS2V5LFxuICAgICAgcmVmS2V5ID0gX3JlZjQkcmVmS2V5ID09PSB2b2lkIDAgPyAncmVmJyA6IF9yZWY0JHJlZktleSxcbiAgICAgIHJlZiA9IF9yZWY0LnJlZixcbiAgICAgIG9uS2V5RG93biA9IF9yZWY0Lm9uS2V5RG93bixcbiAgICAgIG9uQ2xpY2sgPSBfcmVmNC5vbkNsaWNrLFxuICAgICAgX3JlZjQkcHJldmVudEtleUFjdGlvID0gX3JlZjQucHJldmVudEtleUFjdGlvbixcbiAgICAgIHByZXZlbnRLZXlBY3Rpb24gPSBfcmVmNCRwcmV2ZW50S2V5QWN0aW8gPT09IHZvaWQgMCA/IGZhbHNlIDogX3JlZjQkcHJldmVudEtleUFjdGlvLFxuICAgICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWY0LCBfZXhjbHVkZWQyKTtcbiAgICB2YXIgX3JlZjUgPSBfdGVtcDMgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAzLFxuICAgICAgX3JlZjUkc3VwcHJlc3NSZWZFcnJvID0gX3JlZjUuc3VwcHJlc3NSZWZFcnJvcixcbiAgICAgIHN1cHByZXNzUmVmRXJyb3IgPSBfcmVmNSRzdXBwcmVzc1JlZkVycm8gPT09IHZvaWQgMCA/IGZhbHNlIDogX3JlZjUkc3VwcHJlc3NSZWZFcnJvO1xuICAgIHNldEdldHRlclByb3BDYWxsSW5mbygnZ2V0RHJvcGRvd25Qcm9wcycsIHN1cHByZXNzUmVmRXJyb3IsIHJlZktleSwgZHJvcGRvd25SZWYpO1xuICAgIHZhciBkcm9wZG93bkhhbmRsZUtleURvd24gPSBmdW5jdGlvbiBkcm9wZG93bkhhbmRsZUtleURvd24oZXZlbnQpIHtcbiAgICAgIHZhciBrZXkgPSBub3JtYWxpemVBcnJvd0tleShldmVudCk7XG4gICAgICBpZiAoa2V5ICYmIGRyb3Bkb3duS2V5RG93bkhhbmRsZXJzW2tleV0pIHtcbiAgICAgICAgZHJvcGRvd25LZXlEb3duSGFuZGxlcnNba2V5XShldmVudCk7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgZHJvcGRvd25IYW5kbGVDbGljayA9IGZ1bmN0aW9uIGRyb3Bkb3duSGFuZGxlQ2xpY2soKSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IERyb3Bkb3duQ2xpY2tcbiAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIF9leHRlbmRzKChfZXh0ZW5kczMgPSB7fSwgX2V4dGVuZHMzW3JlZktleV0gPSBoYW5kbGVSZWZzKHJlZiwgZnVuY3Rpb24gKGRyb3Bkb3duTm9kZSkge1xuICAgICAgaWYgKGRyb3Bkb3duTm9kZSkge1xuICAgICAgICBkcm9wZG93blJlZi5jdXJyZW50ID0gZHJvcGRvd25Ob2RlO1xuICAgICAgfVxuICAgIH0pLCBfZXh0ZW5kczMpLCAhcHJldmVudEtleUFjdGlvbiAmJiB7XG4gICAgICBvbktleURvd246IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uS2V5RG93biwgZHJvcGRvd25IYW5kbGVLZXlEb3duKSxcbiAgICAgIG9uQ2xpY2s6IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uQ2xpY2ssIGRyb3Bkb3duSGFuZGxlQ2xpY2spXG4gICAgfSwgcmVzdCk7XG4gIH0sIFtkaXNwYXRjaCwgZHJvcGRvd25LZXlEb3duSGFuZGxlcnMsIHNldEdldHRlclByb3BDYWxsSW5mb10pO1xuXG4gIC8vIHJldHVybnNcbiAgdmFyIGFkZFNlbGVjdGVkSXRlbSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChzZWxlY3RlZEl0ZW0pIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBGdW5jdGlvbkFkZFNlbGVjdGVkSXRlbSxcbiAgICAgIHNlbGVjdGVkSXRlbTogc2VsZWN0ZWRJdGVtXG4gICAgfSk7XG4gIH0sIFtkaXNwYXRjaF0pO1xuICB2YXIgcmVtb3ZlU2VsZWN0ZWRJdGVtID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKHNlbGVjdGVkSXRlbSkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uUmVtb3ZlU2VsZWN0ZWRJdGVtLFxuICAgICAgc2VsZWN0ZWRJdGVtOiBzZWxlY3RlZEl0ZW1cbiAgICB9KTtcbiAgfSwgW2Rpc3BhdGNoXSk7XG4gIHZhciBzZXRTZWxlY3RlZEl0ZW1zID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKG5ld1NlbGVjdGVkSXRlbXMpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBGdW5jdGlvblNldFNlbGVjdGVkSXRlbXMsXG4gICAgICBzZWxlY3RlZEl0ZW1zOiBuZXdTZWxlY3RlZEl0ZW1zXG4gICAgfSk7XG4gIH0sIFtkaXNwYXRjaF0pO1xuICB2YXIgc2V0QWN0aXZlSW5kZXggPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAobmV3QWN0aXZlSW5kZXgpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBGdW5jdGlvblNldEFjdGl2ZUluZGV4LFxuICAgICAgYWN0aXZlSW5kZXg6IG5ld0FjdGl2ZUluZGV4XG4gICAgfSk7XG4gIH0sIFtkaXNwYXRjaF0pO1xuICB2YXIgcmVzZXQgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25SZXNldFxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgcmV0dXJuIHtcbiAgICBnZXRTZWxlY3RlZEl0ZW1Qcm9wczogZ2V0U2VsZWN0ZWRJdGVtUHJvcHMsXG4gICAgZ2V0RHJvcGRvd25Qcm9wczogZ2V0RHJvcGRvd25Qcm9wcyxcbiAgICBhZGRTZWxlY3RlZEl0ZW06IGFkZFNlbGVjdGVkSXRlbSxcbiAgICByZW1vdmVTZWxlY3RlZEl0ZW06IHJlbW92ZVNlbGVjdGVkSXRlbSxcbiAgICBzZXRTZWxlY3RlZEl0ZW1zOiBzZXRTZWxlY3RlZEl0ZW1zLFxuICAgIHNldEFjdGl2ZUluZGV4OiBzZXRBY3RpdmVJbmRleCxcbiAgICByZXNldDogcmVzZXQsXG4gICAgc2VsZWN0ZWRJdGVtczogc2VsZWN0ZWRJdGVtcyxcbiAgICBhY3RpdmVJbmRleDogYWN0aXZlSW5kZXhcbiAgfTtcbn1cblxuZXhwb3J0IHsgRG93bnNoaWZ0JDEgYXMgZGVmYXVsdCwgcmVzZXRJZENvdW50ZXIsIHVzZUNvbWJvYm94LCB1c2VNdWx0aXBsZVNlbGVjdGlvbiwgdXNlU2VsZWN0IH07XG4iLCJpbXBvcnQge1xuICAgIHVzZUNvbWJvYm94LFxuICAgIFVzZUNvbWJvYm94UHJvcHMsXG4gICAgVXNlQ29tYm9ib3hSZXR1cm5WYWx1ZSxcbiAgICBVc2VDb21ib2JveFN0YXRlLFxuICAgIFVzZUNvbWJvYm94U3RhdGVDaGFuZ2UsXG4gICAgVXNlQ29tYm9ib3hTdGF0ZUNoYW5nZU9wdGlvbnNcbn0gZnJvbSBcImRvd25zaGlmdFwiO1xuXG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlTWVtbyB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgQTExeVN0YXR1c01lc3NhZ2UsIFNpbmdsZVNlbGVjdG9yIH0gZnJvbSBcIi4uL2hlbHBlcnMvdHlwZXNcIjtcblxuaW50ZXJmYWNlIE9wdGlvbnMge1xuICAgIGlucHV0SWQ/OiBzdHJpbmc7XG4gICAgbGFiZWxJZD86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZURvd25zaGlmdFNpbmdsZVNlbGVjdFByb3BzKFxuICAgIHNlbGVjdG9yOiBTaW5nbGVTZWxlY3RvcixcbiAgICBvcHRpb25zOiBPcHRpb25zID0ge30sXG4gICAgYTExeVN0YXR1c01lc3NhZ2U6IEExMXlTdGF0dXNNZXNzYWdlXG4pOiBVc2VDb21ib2JveFJldHVyblZhbHVlPHN0cmluZz4ge1xuICAgIGNvbnN0IHsgaW5wdXRJZCwgbGFiZWxJZCB9ID0gb3B0aW9ucztcblxuICAgIGNvbnN0IGRvd25zaGlmdFByb3BzOiBVc2VDb21ib2JveFByb3BzPHN0cmluZz4gPSB1c2VNZW1vKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGl0ZW1zOiBbXSxcbiAgICAgICAgICAgIGl0ZW1Ub1N0cmluZzogKHY6IHN0cmluZyB8IG51bGwpID0+IHNlbGVjdG9yLmNhcHRpb24uZ2V0KHYpLFxuICAgICAgICAgICAgb25TZWxlY3RlZEl0ZW1DaGFuZ2UoeyBzZWxlY3RlZEl0ZW0gfTogVXNlQ29tYm9ib3hTdGF0ZUNoYW5nZTxzdHJpbmc+KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3Iuc2V0VmFsdWUoc2VsZWN0ZWRJdGVtID8/IG51bGwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uSW5wdXRWYWx1ZUNoYW5nZSh7IGlucHV0VmFsdWUsIHR5cGUgfTogVXNlQ29tYm9ib3hTdGF0ZUNoYW5nZTxzdHJpbmc+KSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdG9yLm9uRmlsdGVySW5wdXRDaGFuZ2UgJiYgdHlwZSA9PT0gdXNlQ29tYm9ib3guc3RhdGVDaGFuZ2VUeXBlcy5JbnB1dENoYW5nZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rvci5vcHRpb25zLnNldFNlYXJjaFRlcm0oaW5wdXRWYWx1ZSA/PyBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3Iub25GaWx0ZXJJbnB1dENoYW5nZShpbnB1dFZhbHVlID8/IFwiXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yLm9wdGlvbnMuc2V0U2VhcmNoVGVybShcIlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0QTExeVN0YXR1c01lc3NhZ2Uob3B0aW9ucykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbSA9IHNlbGVjdG9yLmNhcHRpb24uZ2V0KHNlbGVjdG9yLmN1cnJlbnRJZCk7XG4gICAgICAgICAgICAgICAgbGV0IG1lc3NhZ2UgPSBzZWxlY3RlZEl0ZW1cbiAgICAgICAgICAgICAgICAgICAgPyBzZWxlY3Rvci5jdXJyZW50SWRcbiAgICAgICAgICAgICAgICAgICAgICAgID8gYCR7YTExeVN0YXR1c01lc3NhZ2UuYTExeVNlbGVjdGVkVmFsdWV9ICR7c2VsZWN0ZWRJdGVtfS4gYFxuICAgICAgICAgICAgICAgICAgICAgICAgOiBcIk5vIG9wdGlvbnMgc2VsZWN0ZWQuXCJcbiAgICAgICAgICAgICAgICAgICAgOiBcIlwiO1xuICAgICAgICAgICAgICAgIGlmICghb3B0aW9ucy5pc09wZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghb3B0aW9ucy5yZXN1bHRDb3VudCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYTExeVN0YXR1c01lc3NhZ2UuYTExeU5vT3B0aW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5yZXN1bHRDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSArPSBgJHthMTF5U3RhdHVzTWVzc2FnZS5hMTF5T3B0aW9uc0F2YWlsYWJsZX0gJHtvcHRpb25zLnJlc3VsdENvdW50fS4gJHthMTF5U3RhdHVzTWVzc2FnZS5hMTF5SW5zdHJ1Y3Rpb25zfWA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGExMXlTdGF0dXNNZXNzYWdlLmExMXlOb09wdGlvbjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleDogMCxcbiAgICAgICAgICAgIHNlbGVjdGVkSXRlbTogbnVsbCxcbiAgICAgICAgICAgIGluaXRpYWxJbnB1dFZhbHVlOiBzZWxlY3Rvci5jYXB0aW9uLmdldChzZWxlY3Rvci5jdXJyZW50SWQpLFxuICAgICAgICAgICAgc3RhdGVSZWR1Y2VyKHN0YXRlOiBVc2VDb21ib2JveFN0YXRlPHN0cmluZz4sIGFjdGlvbkFuZENoYW5nZXM6IFVzZUNvbWJvYm94U3RhdGVDaGFuZ2VPcHRpb25zPHN0cmluZz4pIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGNoYW5nZXMsIHR5cGUgfSA9IGFjdGlvbkFuZENoYW5nZXM7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNsZWFyIGlucHV0IHdoZW4gdXNlciB0b2dnbGVzIChjbG9zZXMpIGRyb3Bkb3duLlxuICAgICAgICAgICAgICAgICAgICBjYXNlIHVzZUNvbWJvYm94LnN0YXRlQ2hhbmdlVHlwZXMuVG9nZ2xlQnV0dG9uQ2xpY2s6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmNoYW5nZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZTogXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB3aGVuIGl0ZW0gaXMgc2VsZWN0ZWQsIGRvd25zaGlmdCBmaWxscyBpbiBpbnB1dCBhdXRvbWF0aWNhbGx5LCBwcmV2ZW50IHRoYXQuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdXNlQ29tYm9ib3guc3RhdGVDaGFuZ2VUeXBlcy5GdW5jdGlvblNlbGVjdEl0ZW06XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdXNlQ29tYm9ib3guc3RhdGVDaGFuZ2VUeXBlcy5JdGVtQ2xpY2s6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdXNlQ29tYm9ib3guc3RhdGVDaGFuZ2VUeXBlcy5Db250cm9sbGVkUHJvcFVwZGF0ZWRTZWxlY3RlZEl0ZW06XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdXNlQ29tYm9ib3guc3RhdGVDaGFuZ2VUeXBlcy5JbnB1dEtleURvd25FbnRlcjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uY2hhbmdlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dFZhbHVlOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdXNlQ29tYm9ib3guc3RhdGVDaGFuZ2VUeXBlcy5JbnB1dEZvY3VzOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5jaGFuZ2VzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzT3Blbjogc3RhdGUuaXNPcGVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0VmFsdWU6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogY2hhbmdlcy5zZWxlY3RlZEl0ZW0gPyAtMSA6IHRoaXMuZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2xlYXIgaW5wdXQgd2hlbiB1c2VyIHdhbnQgdG8gY2xvc2UgdGhlIHBvcHVwIHdpdGggZXNjYXBlIChvciBpdCB3YXMgY2xvc2VkIHByb2dyYW1tYXRpY2FsbHkpXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdXNlQ29tYm9ib3guc3RhdGVDaGFuZ2VUeXBlcy5JbnB1dEtleURvd25Fc2NhcGU6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdXNlQ29tYm9ib3guc3RhdGVDaGFuZ2VUeXBlcy5GdW5jdGlvbkNsb3NlTWVudTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uY2hhbmdlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEl0ZW06IHN0YXRlLnNlbGVjdGVkSXRlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc09wZW46IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0VmFsdWU6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdXNlQ29tYm9ib3guc3RhdGVDaGFuZ2VUeXBlcy5JbnB1dEJsdXI6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmNoYW5nZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJdGVtOiBzdGF0ZS5zZWxlY3RlZEl0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZTogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc09wZW46IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4uY2hhbmdlcyB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbnB1dElkLFxuICAgICAgICAgICAgbGFiZWxJZFxuICAgICAgICB9O1xuICAgIH0sIFtcbiAgICAgICAgc2VsZWN0b3IsXG4gICAgICAgIGlucHV0SWQsXG4gICAgICAgIGxhYmVsSWQsXG4gICAgICAgIGExMXlTdGF0dXNNZXNzYWdlLmExMXlTZWxlY3RlZFZhbHVlLFxuICAgICAgICBhMTF5U3RhdHVzTWVzc2FnZS5hMTF5T3B0aW9uc0F2YWlsYWJsZSxcbiAgICAgICAgYTExeVN0YXR1c01lc3NhZ2UuYTExeU5vT3B0aW9uLFxuICAgICAgICBhMTF5U3RhdHVzTWVzc2FnZS5hMTF5SW5zdHJ1Y3Rpb25zXG4gICAgXSk7XG5cbiAgICAvLyBTb3J0IGl0ZW1zIGluIGdyb3VwZWQgb3JkZXIgKG1hdGNoaW5nIFNpbmdsZVNlbGVjdGlvbk1lbnUgcmVuZGVyIG9yZGVyKVxuICAgIGNvbnN0IHJhd0l0ZW1zID0gc2VsZWN0b3Iub3B0aW9ucy5nZXRBbGwoKSA/PyBbXTtcbiAgICBjb25zdCBnZXRHcm91cEZuID0gc2VsZWN0b3IuY2FwdGlvbi5nZXRHcm91cFxuICAgICAgICA/IChpZDogc3RyaW5nKSA9PiBzZWxlY3Rvci5jYXB0aW9uLmdldEdyb3VwIShpZClcbiAgICAgICAgOiAoX2lkOiBzdHJpbmcpID0+IG51bGwgYXMgc3RyaW5nIHwgbnVsbDtcbiAgICBjb25zdCBoYXNHcm91cHMgPSByYXdJdGVtcy5zb21lKGlkID0+IHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSBnZXRHcm91cEZuKGlkKTtcbiAgICAgICAgcmV0dXJuIHRpdGxlICE9PSBudWxsICYmIHRpdGxlLnRyaW0oKSAhPT0gXCJcIjtcbiAgICB9KTtcbiAgICBsZXQgc29ydGVkSXRlbXM6IHN0cmluZ1tdO1xuICAgIGlmIChoYXNHcm91cHMpIHtcbiAgICAgICAgY29uc3QgZ3JvdXBNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nW10+KCk7XG4gICAgICAgIGNvbnN0IHVuZ3JvdXBlZDogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBpZCBvZiByYXdJdGVtcykge1xuICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBnZXRHcm91cEZuKGlkKTtcbiAgICAgICAgICAgIGlmICghdGl0bGUgfHwgdGl0bGUudHJpbSgpID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgdW5ncm91cGVkLnB1c2goaWQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIWdyb3VwTWFwLmhhcyh0aXRsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBNYXAuc2V0KHRpdGxlLCBbXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGdyb3VwTWFwLmdldCh0aXRsZSkhLnB1c2goaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNvcnRlZFRpdGxlcyA9IEFycmF5LmZyb20oZ3JvdXBNYXAua2V5cygpKS5zb3J0KChhLCBiKSA9PlxuICAgICAgICAgICAgYS5sb2NhbGVDb21wYXJlKGIsIHVuZGVmaW5lZCwgeyBzZW5zaXRpdml0eTogXCJiYXNlXCIgfSlcbiAgICAgICAgKTtcbiAgICAgICAgc29ydGVkSXRlbXMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCB0aXRsZSBvZiBzb3J0ZWRUaXRsZXMpIHtcbiAgICAgICAgICAgIHNvcnRlZEl0ZW1zLnB1c2goLi4uZ3JvdXBNYXAuZ2V0KHRpdGxlKSEpO1xuICAgICAgICB9XG4gICAgICAgIHNvcnRlZEl0ZW1zLnB1c2goLi4udW5ncm91cGVkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzb3J0ZWRJdGVtcyA9IHJhd0l0ZW1zO1xuICAgIH1cblxuICAgIGNvbnN0IHJldHVyblZhbCA9IHVzZUNvbWJvYm94KHtcbiAgICAgICAgLi4uZG93bnNoaWZ0UHJvcHMsXG4gICAgICAgIGl0ZW1zOiBzb3J0ZWRJdGVtcyxcbiAgICAgICAgc2VsZWN0ZWRJdGVtOiBzZWxlY3Rvci5jdXJyZW50SWRcbiAgICB9KTtcblxuICAgIGNvbnN0IHsgY2xvc2VNZW51IH0gPSByZXR1cm5WYWw7XG5cbiAgICBzZWxlY3Rvci5vbkxlYXZlRXZlbnQgPSB1c2VDYWxsYmFjayhjbG9zZU1lbnUsIFtjbG9zZU1lbnVdKTtcblxuICAgIHJldHVybiByZXR1cm5WYWw7XG59XG4iLCJpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlUmVmIH0gZnJvbSBcInJlYWN0XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW5maW5pdGVCb2R5UHJvcHMge1xuICAgIGhhc01vcmVJdGVtczogYm9vbGVhbjtcbiAgICBpc0luZmluaXRlOiBib29sZWFuO1xuICAgIHNldFBhZ2U/OiAoKSA9PiB2b2lkO1xufVxuXG50eXBlIFRyYWNrU2Nyb2xsaW5nRm4gPSAoZTogYW55KSA9PiB2b2lkO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlSW5maW5pdGVDb250cm9sKHByb3BzOiBJbmZpbml0ZUJvZHlQcm9wcyk6IFtUcmFja1Njcm9sbGluZ0ZuXSB7XG4gICAgY29uc3QgeyBzZXRQYWdlLCBoYXNNb3JlSXRlbXMgfSA9IHByb3BzO1xuICAgIGNvbnN0IGxvYWRpbmdSZWYgPSB1c2VSZWYoZmFsc2UpO1xuXG4gICAgY29uc3QgdHJhY2tTY3JvbGxpbmcgPSB1c2VDYWxsYmFjayhcbiAgICAgICAgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZXZlbnQ/LnRhcmdldDtcbiAgICAgICAgICAgIGlmICghZWwgfHwgbG9hZGluZ1JlZi5jdXJyZW50IHx8ICFoYXNNb3JlSXRlbXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuZWFyQm90dG9tID0gZWwuc2Nyb2xsSGVpZ2h0IC0gZWwuc2Nyb2xsVG9wIC0gZWwuY2xpZW50SGVpZ2h0IDwgNTA7XG4gICAgICAgICAgICBpZiAobmVhckJvdHRvbSAmJiBzZXRQYWdlKSB7XG4gICAgICAgICAgICAgICAgbG9hZGluZ1JlZi5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZXRQYWdlKCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmdSZWYuY3VycmVudCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFtzZXRQYWdlLCBoYXNNb3JlSXRlbXNdXG4gICAgKTtcblxuICAgIHJldHVybiBbdHJhY2tTY3JvbGxpbmddO1xufVxuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IEluZmluaXRlQm9keVByb3BzLCB1c2VJbmZpbml0ZUNvbnRyb2wgfSBmcm9tIFwiQG1lbmRpeC93aWRnZXQtcGx1Z2luLWdyaWQvY29tcG9uZW50cy9JbmZpbml0ZUJvZHlcIjtcbmltcG9ydCB7IExpc3RWYWx1ZSB9IGZyb20gXCJtZW5kaXhcIjtcblxudHlwZSBVc2VMYXp5TG9hZGluZ1Byb3BzID0gUGljazxJbmZpbml0ZUJvZHlQcm9wcywgXCJoYXNNb3JlSXRlbXNcIiB8IFwiaXNJbmZpbml0ZVwiPiAmIHtcbiAgICBpc09wZW46IGJvb2xlYW47XG4gICAgbG9hZE1vcmU/OiAoKSA9PiB2b2lkO1xuICAgIGRhdGFzb3VyY2VGaWx0ZXI/OiBMaXN0VmFsdWVbXCJmaWx0ZXJcIl07XG4gICAgcmVhZE9ubHk/OiBib29sZWFuO1xufTtcblxudHlwZSBVc2VMYXp5TG9hZGluZ1JldHVybiA9IHtcbiAgICBvblNjcm9sbDogKGU6IGFueSkgPT4gdm9pZDtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VMYXp5TG9hZGluZyhwcm9wczogVXNlTGF6eUxvYWRpbmdQcm9wcyk6IFVzZUxhenlMb2FkaW5nUmV0dXJuIHtcbiAgICBjb25zdCB7IGhhc01vcmVJdGVtcywgaXNJbmZpbml0ZSwgbG9hZE1vcmUgfSA9IHByb3BzO1xuXG4gICAgY29uc3Qgc2V0UGFnZUNhbGxiYWNrID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgICBpZiAobG9hZE1vcmUpIHtcbiAgICAgICAgICAgIGxvYWRNb3JlKCk7XG4gICAgICAgIH1cbiAgICB9LCBbbG9hZE1vcmVdKTtcblxuICAgIGNvbnN0IFt0cmFja1Njcm9sbGluZ10gPSB1c2VJbmZpbml0ZUNvbnRyb2woeyBoYXNNb3JlSXRlbXMsIGlzSW5maW5pdGUsIHNldFBhZ2U6IHNldFBhZ2VDYWxsYmFjayB9KTtcblxuICAgIHJldHVybiB7IG9uU2Nyb2xsOiB0cmFja1Njcm9sbGluZyB9O1xufVxuIiwiaW1wb3J0IHsgUmVhY3RFbGVtZW50LCBjcmVhdGVFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWxlcnRQcm9wcyB7XG4gICAgY2hpbGRyZW4/OiBzdHJpbmc7XG4gICAgaWQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBWYWxpZGF0aW9uQWxlcnQoeyBjaGlsZHJlbiwgaWQgfTogQWxlcnRQcm9wcyk6IFJlYWN0RWxlbWVudCB8IG51bGwge1xuICAgIGlmICghY2hpbGRyZW4pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImFsZXJ0IGFsZXJ0LWRhbmdlciBteC12YWxpZGF0aW9uLW1lc3NhZ2VcIiwgaWQgfSwgY2hpbGRyZW4pO1xufVxuIiwiaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSBcImNsYXNzbmFtZXNcIjtcbmltcG9ydCB7IFJlYWN0RWxlbWVudCB9IGZyb20gXCJyZWFjdFwiO1xuXG50eXBlIFNwaW5uZXJMb2FkZXJQcm9wcyA9IHtcbiAgICBzaXplPzogXCJzbWFsbFwiIHwgXCJtZWRpdW1cIjtcbiAgICB3aXRoTWFyZ2lucz86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gU3Bpbm5lckxvYWRlcih7IHNpemUgPSBcIm1lZGl1bVwiLCB3aXRoTWFyZ2lucyA9IGZhbHNlIH06IFNwaW5uZXJMb2FkZXJQcm9wcyk6IFJlYWN0RWxlbWVudCB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXCJ3aWRnZXQtY29tYm9ib3gtc3Bpbm5lclwiLCB7IFwid2lkZ2V0LWNvbWJvYm94LXNwaW5uZXItbWFyZ2luXCI6IHdpdGhNYXJnaW5zIH0pfT5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXCJ3aWRnZXQtY29tYm9ib3gtc3Bpbm5lci1sb2FkZXJcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIndpZGdldC1jb21ib2JveC1zcGlubmVyLWxvYWRlci1zbWFsbFwiOiBzaXplID09PSBcInNtYWxsXCJcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG4iLCJpbXBvcnQgY2xhc3NOYW1lcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IHsgVXNlQ29tYm9ib3hHZXRUb2dnbGVCdXR0b25Qcm9wc09wdGlvbnMgfSBmcm9tIFwiZG93bnNoaWZ0L3R5cGluZ3NcIjtcbmltcG9ydCB7IGZvcndhcmRSZWYsIEZyYWdtZW50LCBQcm9wc1dpdGhDaGlsZHJlbiwgUmVhY3RFbGVtZW50LCBSZWZPYmplY3QgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IERvd25BcnJvdyB9IGZyb20gXCIuLi9hc3NldHMvaWNvbnNcIjtcbmltcG9ydCB7IFZhbGlkYXRpb25BbGVydCB9IGZyb20gXCJAbWVuZGl4L3dpZGdldC1wbHVnaW4tY29tcG9uZW50LWtpdC9BbGVydFwiO1xuaW1wb3J0IHsgUmVhZE9ubHlTdHlsZUVudW0gfSBmcm9tIFwidHlwaW5ncy9Hcm91cGVkQ29tYm9ib3hQcm9wc1wiO1xuaW1wb3J0IHsgU3Bpbm5lckxvYWRlciB9IGZyb20gXCIuL1NwaW5uZXJMb2FkZXJcIjtcblxuaW50ZXJmYWNlIENvbWJvYm94V3JhcHBlclByb3BzIGV4dGVuZHMgUHJvcHNXaXRoQ2hpbGRyZW4ge1xuICAgIGlzT3BlbjogYm9vbGVhbjtcbiAgICByZWFkT25seTogYm9vbGVhbjtcbiAgICByZWFkT25seVN0eWxlOiBSZWFkT25seVN0eWxlRW51bTtcbiAgICBnZXRUb2dnbGVCdXR0b25Qcm9wczogKG9wdGlvbnM/OiBVc2VDb21ib2JveEdldFRvZ2dsZUJ1dHRvblByb3BzT3B0aW9ucyB8IHVuZGVmaW5lZCkgPT4gYW55O1xuICAgIHZhbGlkYXRpb24/OiBzdHJpbmc7XG4gICAgaXNMb2FkaW5nOiBib29sZWFuO1xuICAgIGlzTXVsdGlzZWxlY3RBY3RpdmU/OiBib29sZWFuO1xuICAgIGVycm9ySWQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBDb21ib2JveFdyYXBwZXIgPSBmb3J3YXJkUmVmKFxuICAgIChwcm9wczogQ29tYm9ib3hXcmFwcGVyUHJvcHMsIF9yZWY6IFJlZk9iamVjdDxIVE1MRGl2RWxlbWVudCB8IG51bGw+KTogUmVhY3RFbGVtZW50ID0+IHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgaXNPcGVuLFxuICAgICAgICAgICAgcmVhZE9ubHksXG4gICAgICAgICAgICByZWFkT25seVN0eWxlLFxuICAgICAgICAgICAgZ2V0VG9nZ2xlQnV0dG9uUHJvcHMsXG4gICAgICAgICAgICB2YWxpZGF0aW9uLFxuICAgICAgICAgICAgY2hpbGRyZW4sXG4gICAgICAgICAgICBpc0xvYWRpbmcsXG4gICAgICAgICAgICBpc011bHRpc2VsZWN0QWN0aXZlLFxuICAgICAgICAgICAgZXJyb3JJZFxuICAgICAgICB9ID0gcHJvcHM7XG4gICAgICAgIGNvbnN0IHRvZ2dsZVByb3BzID0gZ2V0VG9nZ2xlQnV0dG9uUHJvcHMoKTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgcmVmPXt0b2dnbGVQcm9wcy5yZWZ9XG4gICAgICAgICAgICAgICAgICAgIHRhYkluZGV4PXstMX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFwid2lkZ2V0LWNvbWJvYm94LWlucHV0LWNvbnRhaW5lclwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIndpZGdldC1jb21ib2JveC1pbnB1dC1jb250YWluZXItYWN0aXZlXCI6IGlzT3BlbixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwid2lkZ2V0LWNvbWJvYm94LWlucHV0LWNvbnRhaW5lci1kaXNhYmxlZFwiOiByZWFkT25seSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1jb250cm9sLXN0YXRpY1wiOiByZWFkT25seSAmJiByZWFkT25seVN0eWxlID09PSBcInRleHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1jb250cm9sXCI6ICFyZWFkT25seSB8fCByZWFkT25seVN0eWxlICE9PSBcInRleHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwid2lkZ2V0LWNvbWJvYm94LW11bHRpc2VsZWN0XCI6IGlzTXVsdGlzZWxlY3RBY3RpdmVcbiAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgIGlkPXt0b2dnbGVQcm9wcy5pZH1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dG9nZ2xlUHJvcHMub25DbGlja31cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgICAgICAgICAgICAge3JlYWRPbmx5ICYmIHJlYWRPbmx5U3R5bGUgPT09IFwidGV4dFwiID8gbnVsbCA6IGlzTG9hZGluZyA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94LWRvd24tYXJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8U3Bpbm5lckxvYWRlciBzaXplPVwic21hbGxcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94LWRvd24tYXJyb3dcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXtlID0+IGUucHJldmVudERlZmF1bHQoKX1cbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RG93bkFycm93IGlzT3Blbj17aXNPcGVufSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAge3ZhbGlkYXRpb24gJiYgPFZhbGlkYXRpb25BbGVydCBpZD17ZXJyb3JJZH0+e3ZhbGlkYXRpb259PC9WYWxpZGF0aW9uQWxlcnQ+fVxuICAgICAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICAgKTtcbiAgICB9XG4pOyIsImltcG9ydCBjbGFzc05hbWVzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgeyBQcm9wc1dpdGhDaGlsZHJlbiwgUmVhY3RFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBEb3duQXJyb3cgfSBmcm9tIFwiLi4vYXNzZXRzL2ljb25zXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBQbGFjZWhvbGRlcigpOiBSZWFjdEVsZW1lbnQge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sIHdpZGdldC1jb21ib2JveC1wbGFjZWhvbGRlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3aWRnZXQtY29tYm9ib3gtcGxhY2Vob2xkZXItZG93bi1hcnJvd1wiPlxuICAgICAgICAgICAgICAgIDxEb3duQXJyb3cgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTm9PcHRpb25zUGxhY2Vob2xkZXIocHJvcHM6IFByb3BzV2l0aENoaWxkcmVuKTogUmVhY3RFbGVtZW50IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8bGkgY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94LWl0ZW0gd2lkZ2V0LWNvbWJvYm94LW5vLW9wdGlvbnNcIiByb2xlPVwib3B0aW9uXCI+XG4gICAgICAgICAgICB7cHJvcHMuY2hpbGRyZW59XG4gICAgICAgIDwvbGk+XG4gICAgKTtcbn1cblxuaW50ZXJmYWNlIElucHV0UGxhY2Vob2xkZXJQcm9wcyBleHRlbmRzIFByb3BzV2l0aENoaWxkcmVuIHtcbiAgICBpc0VtcHR5OiBib29sZWFuO1xuICAgIHR5cGU/OiBcInRleHRcIiB8IFwiY3VzdG9tXCI7XG59XG5leHBvcnQgZnVuY3Rpb24gSW5wdXRQbGFjZWhvbGRlcihwcm9wczogSW5wdXRQbGFjZWhvbGRlclByb3BzKTogUmVhY3RFbGVtZW50IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoYHdpZGdldC1jb21ib2JveC1wbGFjZWhvbGRlci0ke3Byb3BzLnR5cGUgPz8gXCJ0ZXh0XCJ9YCwge1xuICAgICAgICAgICAgICAgIFwid2lkZ2V0LWNvbWJvYm94LXBsYWNlaG9sZGVyLWVtcHR5XCI6IHByb3BzLmlzRW1wdHlcbiAgICAgICAgICAgIH0pfVxuICAgICAgICA+XG4gICAgICAgICAgICB7cHJvcHMuY2hpbGRyZW59XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG4iLCIvKipcbiAqIFV0aWxpdHkgZm9yIGdyb3VwaW5nIGZsYXQgbGlzdHMgb2Ygb3B0aW9uIElEcyBpbnRvIHRpdGxlZCBzZWN0aW9ucy5cbiAqIEl0ZW1zIGFyZSBzb3J0ZWQgQS1aIGJ5IHRoZWlyIGdyb3VwIHRpdGxlIGJlZm9yZSBncm91cGluZy5cbiAqIEl0ZW1zIHdpdGggbm8gZ3JvdXAgdGl0bGUgYXBwZWFyIGluIGEgZmluYWwgXCJ1bmdyb3VwZWRcIiBzZWdtZW50LlxuICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgR3JvdXBTZWdtZW50IHtcbiAgICAvKiogbnVsbCBtZWFucyB0aGUgaXRlbXMgaGF2ZSBubyBncm91cCB0aXRsZSAodW5ncm91cGVkKSAqL1xuICAgIGdyb3VwVGl0bGU6IHN0cmluZyB8IG51bGw7XG4gICAgaXRlbXM6IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIEdyb3VwcyBhIGxpc3Qgb2YgaXRlbSBJRHMgYnkgdGhlaXIgZ3JvdXAgdGl0bGUuXG4gKiBBdXRvbWF0aWNhbGx5IHNvcnRzIGdyb3VwcyBBLVouIFVuZ3JvdXBlZCBpdGVtcyBhcHBlYXIgYXQgdGhlIGVuZC5cbiAqXG4gKiBAcGFyYW0gaXRlbXMgICAgICAgRmxhdCBsaXN0IG9mIG9wdGlvbiBJRHNcbiAqIEBwYXJhbSBnZXRHcm91cEZuICBGdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGdyb3VwIHRpdGxlIHN0cmluZyBmb3IgYW4gSUQgKG9yIG51bGwvZW1wdHkpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBncm91cEl0ZW1zKGl0ZW1zOiBzdHJpbmdbXSwgZ2V0R3JvdXBGbjogKGlkOiBzdHJpbmcpID0+IHN0cmluZyB8IG51bGwpOiBHcm91cFNlZ21lbnRbXSB7XG4gICAgaWYgKGl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgLy8gQnVpbGQgYSBtYXA6IGdyb3VwVGl0bGUg4oaSIGl0ZW1zW10sIHByZXNlcnZpbmcgaXRlbSBvcmRlciB3aXRoaW4gZWFjaCBncm91cFxuICAgIGNvbnN0IGdyb3VwTWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZ1tdPigpO1xuICAgIGNvbnN0IHVuZ3JvdXBlZDogc3RyaW5nW10gPSBbXTtcblxuICAgIGZvciAoY29uc3QgaWQgb2YgaXRlbXMpIHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSBnZXRHcm91cEZuKGlkKTtcbiAgICAgICAgaWYgKCF0aXRsZSB8fCB0aXRsZS50cmltKCkgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIHVuZ3JvdXBlZC5wdXNoKGlkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghZ3JvdXBNYXAuaGFzKHRpdGxlKSkge1xuICAgICAgICAgICAgICAgIGdyb3VwTWFwLnNldCh0aXRsZSwgW10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ3JvdXBNYXAuZ2V0KHRpdGxlKSEucHVzaChpZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTb3J0IGdyb3VwIHRpdGxlcyBBLVogKGNhc2UtaW5zZW5zaXRpdmUpXG4gICAgY29uc3Qgc29ydGVkVGl0bGVzID0gQXJyYXkuZnJvbShncm91cE1hcC5rZXlzKCkpLnNvcnQoKGEsIGIpID0+XG4gICAgICAgIGEubG9jYWxlQ29tcGFyZShiLCB1bmRlZmluZWQsIHsgc2Vuc2l0aXZpdHk6IFwiYmFzZVwiIH0pXG4gICAgKTtcblxuICAgIGNvbnN0IHNlZ21lbnRzOiBHcm91cFNlZ21lbnRbXSA9IHNvcnRlZFRpdGxlcy5tYXAodGl0bGUgPT4gKHtcbiAgICAgICAgZ3JvdXBUaXRsZTogdGl0bGUsXG4gICAgICAgIGl0ZW1zOiBncm91cE1hcC5nZXQodGl0bGUpIVxuICAgIH0pKTtcblxuICAgIC8vIEFwcGVuZCB1bmdyb3VwZWQgYXQgdGhlIGVuZFxuICAgIGlmICh1bmdyb3VwZWQubGVuZ3RoID4gMCkge1xuICAgICAgICBzZWdtZW50cy5wdXNoKHsgZ3JvdXBUaXRsZTogbnVsbCwgaXRlbXM6IHVuZ3JvdXBlZCB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VnbWVudHM7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBpdGVtcyBhcnJheSBwcm9kdWNlcyBhdCBsZWFzdCBvbmUgbm9uLW51bGwgZ3JvdXAgdGl0bGUuXG4gKiBVc2VkIHRvIGNvbmRpdGlvbmFsbHkgcmVuZGVyIGdyb3VwIGhlYWRlcnMgdnMgcGxhaW4gbGlzdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc0dyb3VwaW5nKGl0ZW1zOiBzdHJpbmdbXSwgZ2V0R3JvdXBGbjogKGlkOiBzdHJpbmcpID0+IHN0cmluZyB8IG51bGwpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaXRlbXMuc29tZShpZCA9PiB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gZ2V0R3JvdXBGbihpZCk7XG4gICAgICAgIHJldHVybiB0aXRsZSAhPT0gbnVsbCAmJiB0aXRsZS50cmltKCkgIT09IFwiXCI7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5cbi8qKlxuICogT2JzZXJ2ZXMgdGhlIHBvc2l0aW9uIChib3VuZGluZyByZWN0KSBvZiBhbiBlbGVtZW50IHdoaWxlIGFjdGl2ZS5cbiAqIFJldHVybnMgdGhlIGN1cnJlbnQgRE9NUmVjdCBvciB1bmRlZmluZWQgd2hlbiBub3Qgb2JzZXJ2aW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlUG9zaXRpb25PYnNlcnZlcihlbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwsIGFjdGl2ZTogYm9vbGVhbik6IERPTVJlY3QgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IFtyZWN0LCBzZXRSZWN0XSA9IHVzZVN0YXRlPERPTVJlY3QgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gICAgY29uc3QgcmFmUmVmID0gdXNlUmVmPG51bWJlcj4oMCk7XG5cbiAgICBjb25zdCB1cGRhdGVSZWN0ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgc2V0UmVjdChlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgICAgICAgfVxuICAgIH0sIFtlbGVtZW50XSk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoIWVsZW1lbnQgfHwgIWFjdGl2ZSkge1xuICAgICAgICAgICAgc2V0UmVjdCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlUmVjdCgpO1xuXG4gICAgICAgIGNvbnN0IG9uU2Nyb2xsID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUocmFmUmVmLmN1cnJlbnQpO1xuICAgICAgICAgICAgcmFmUmVmLmN1cnJlbnQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlUmVjdCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgb25TY3JvbGwsIHRydWUpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvblNjcm9sbCk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZlJlZi5jdXJyZW50KTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIG9uU2Nyb2xsLCB0cnVlKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG9uU2Nyb2xsKTtcbiAgICAgICAgfTtcbiAgICB9LCBbZWxlbWVudCwgYWN0aXZlLCB1cGRhdGVSZWN0XSk7XG5cbiAgICByZXR1cm4gcmVjdDtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZTxUIGV4dGVuZHMgKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk+KGZuOiBULCBtczogbnVtYmVyKTogWygoLi4uYXJnczogUGFyYW1ldGVyczxUPikgPT4gdm9pZCksICgpID0+IHZvaWRdIHtcbiAgICBsZXQgdGltZXI6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgbnVsbCA9IG51bGw7XG4gICAgY29uc3QgZGVib3VuY2VkID0gKC4uLmFyZ3M6IFBhcmFtZXRlcnM8VD4pID0+IHtcbiAgICAgICAgaWYgKHRpbWVyKSBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4gZm4oLi4uYXJncyksIG1zKTtcbiAgICB9O1xuICAgIGNvbnN0IGFib3J0ID0gKCkgPT4ge1xuICAgICAgICBpZiAodGltZXIpIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgfTtcbiAgICByZXR1cm4gW2RlYm91bmNlZCwgYWJvcnRdO1xufVxuIiwiaW1wb3J0IHsgQ1NTUHJvcGVydGllcywgUmVmT2JqZWN0LCB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IHVzZVBvc2l0aW9uT2JzZXJ2ZXIgfSBmcm9tIFwiQG1lbmRpeC93aWRnZXQtcGx1Z2luLWhvb2tzL3VzZVBvc2l0aW9uT2JzZXJ2ZXJcIjtcbmltcG9ydCB7IGRlYm91bmNlIH0gZnJvbSBcIkBtZW5kaXgvd2lkZ2V0LXBsdWdpbi1wbGF0Zm9ybS91dGlscy9kZWJvdW5jZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlTWVudVN0eWxlPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4oaXNPcGVuOiBib29sZWFuKTogW1JlZk9iamVjdDxUIHwgbnVsbD4sIENTU1Byb3BlcnRpZXNdIHtcbiAgICBjb25zdCByZWYgPSB1c2VSZWY8VCB8IG51bGw+KG51bGwpO1xuICAgIGNvbnN0IFtzdHlsZSwgc2V0U3R5bGVdID0gdXNlU3RhdGU8Q1NTUHJvcGVydGllcz4oeyB2aXNpYmlsaXR5OiBcImhpZGRlblwiLCBwb3NpdGlvbjogXCJmaXhlZFwiIH0pO1xuICAgIGNvbnN0IFtzZXRTdHlsZURlYm91bmNlZCwgYWJvcnRdID0gdXNlTWVtbygoKSA9PiBkZWJvdW5jZShzZXRTdHlsZSwgMzIpLCBbc2V0U3R5bGVdKTtcbiAgICBjb25zdCBtZW51SGVpZ2h0ID0gcmVmLmN1cnJlbnQ/Lm9mZnNldEhlaWdodCA/PyAwO1xuICAgIGNvbnN0IHRhcmdldEJveCA9IHVzZVBvc2l0aW9uT2JzZXJ2ZXIocmVmLmN1cnJlbnQ/LnBhcmVudEVsZW1lbnQgPz8gbnVsbCwgaXNPcGVuKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICh0YXJnZXRCb3ggPT09IHVuZGVmaW5lZCB8fCByZWYuY3VycmVudCA9PT0gbnVsbCB8fCAhaXNPcGVuKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZXRTdHlsZURlYm91bmNlZCh7XG4gICAgICAgICAgICB2aXNpYmlsaXR5OiBcInZpc2libGVcIixcbiAgICAgICAgICAgIHBvc2l0aW9uOiBcImZpeGVkXCIsXG4gICAgICAgICAgICB3aWR0aDogdGFyZ2V0Qm94LndpZHRoLFxuICAgICAgICAgICAgLi4uZ2V0TWVudVBvc2l0aW9uKHRhcmdldEJveCwgcmVmLmN1cnJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhYm9ydDtcbiAgICB9LCBbbWVudUhlaWdodCwgaXNPcGVuLCB0YXJnZXRCb3gsIHNldFN0eWxlRGVib3VuY2VkLCBhYm9ydF0pO1xuXG4gICAgcmV0dXJuIFtyZWYsIHN0eWxlXTtcbn1cblxuZnVuY3Rpb24gZ2V0TWVudVBvc2l0aW9uKHRhcmdldEJveDogRE9NUmVjdCwgbWVudUJveDogRE9NUmVjdCk6IENTU1Byb3BlcnRpZXMge1xuICAgIGNvbnN0IHsgaGVpZ2h0IH0gPSBtZW51Qm94O1xuICAgIGNvbnN0IGJvdHRvbVNwYWNlID0gd2luZG93LmlubmVySGVpZ2h0IC0gdGFyZ2V0Qm94LmJvdHRvbTtcbiAgICBjb25zdCB0b3BTcGFjZSA9IHRhcmdldEJveC50b3AgLSBoZWlnaHQgPCAwID8gdGFyZ2V0Qm94LnRvcCAtIGhlaWdodCA6IDA7XG5cbiAgICBpZiAoYm90dG9tU3BhY2UgPCBoZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuIHsgYm90dG9tOiB3aW5kb3cuaW5uZXJIZWlnaHQgLSB0YXJnZXRCb3gudG9wICsgdG9wU3BhY2UsIGxlZnQ6IHRhcmdldEJveC5sZWZ0IH07XG4gICAgfVxuICAgIHJldHVybiB7IHRvcDogdGFyZ2V0Qm94LmJvdHRvbSwgbGVmdDogdGFyZ2V0Qm94LmxlZnQgfTtcbn1cbiIsImltcG9ydCBjbGFzc05hbWVzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgeyBVc2VDb21ib2JveFByb3BHZXR0ZXJzIH0gZnJvbSBcImRvd25zaGlmdC90eXBpbmdzXCI7XG5pbXBvcnQgeyBNb3VzZUV2ZW50LCBQcm9wc1dpdGhDaGlsZHJlbiwgUmVhY3RFbGVtZW50LCBSZWFjdE5vZGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IHVzZU1lbnVTdHlsZSB9IGZyb20gXCIuLi9ob29rcy91c2VNZW51U3R5bGVcIjtcbmltcG9ydCB7IE5vT3B0aW9uc1BsYWNlaG9sZGVyIH0gZnJvbSBcIi4vUGxhY2Vob2xkZXJcIjtcblxuaW50ZXJmYWNlIENvbWJvYm94TWVudVdyYXBwZXJQcm9wcyBleHRlbmRzIFByb3BzV2l0aENoaWxkcmVuLCBQYXJ0aWFsPFVzZUNvbWJvYm94UHJvcEdldHRlcnM8c3RyaW5nPj4ge1xuICAgIGFsd2F5c09wZW4/OiBib29sZWFuO1xuICAgIGhpZ2hsaWdodGVkSW5kZXg/OiBudW1iZXIgfCBudWxsO1xuICAgIGlzRW1wdHk6IGJvb2xlYW47XG4gICAgaXNMb2FkaW5nOiBib29sZWFuO1xuICAgIGlzT3BlbjogYm9vbGVhbjtcbiAgICBsYXp5TG9hZGluZzogYm9vbGVhbjtcbiAgICBsb2FkZXI6IFJlYWN0Tm9kZTtcbiAgICBtZW51Rm9vdGVyQ29udGVudD86IFJlYWN0Tm9kZTtcbiAgICBtZW51SGVhZGVyQ29udGVudD86IFJlYWN0Tm9kZTtcbiAgICBub09wdGlvbnNUZXh0Pzogc3RyaW5nO1xuICAgIG9uT3B0aW9uQ2xpY2s/OiAoZTogTW91c2VFdmVudCkgPT4gdm9pZDtcbiAgICBvblNjcm9sbD86IChlOiBhbnkpID0+IHZvaWQ7XG59XG5cbmZ1bmN0aW9uIFByZXZlbnRNZW51Q2xvc2VFdmVudEhhbmRsZXIoZTogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG59XG5cbmZ1bmN0aW9uIEZvcmNlUHJldmVudE1lbnVDbG9zZUV2ZW50SGFuZGxlcihlOiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDb21ib2JveE1lbnVXcmFwcGVyKHByb3BzOiBDb21ib2JveE1lbnVXcmFwcGVyUHJvcHMpOiBSZWFjdEVsZW1lbnQge1xuICAgIGNvbnN0IHtcbiAgICAgICAgYWx3YXlzT3BlbixcbiAgICAgICAgY2hpbGRyZW4sXG4gICAgICAgIGdldE1lbnVQcm9wcyxcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgICAgaXNFbXB0eSxcbiAgICAgICAgaXNMb2FkaW5nLFxuICAgICAgICBpc09wZW4sXG4gICAgICAgIGxhenlMb2FkaW5nLFxuICAgICAgICBsb2FkZXIsXG4gICAgICAgIG1lbnVGb290ZXJDb250ZW50LFxuICAgICAgICBtZW51SGVhZGVyQ29udGVudCxcbiAgICAgICAgbm9PcHRpb25zVGV4dCxcbiAgICAgICAgb25PcHRpb25DbGljayxcbiAgICAgICAgb25TY3JvbGxcbiAgICB9ID0gcHJvcHM7XG5cbiAgICBjb25zdCBbcmVmLCBzdHlsZV0gPSB1c2VNZW51U3R5bGU8SFRNTERpdkVsZW1lbnQ+KGlzT3Blbik7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgICByZWY9e3JlZn1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcIndpZGdldC1ncm91cGVkLWNvbWJvYm94LW1lbnVcIiwgeyBcIndpZGdldC1ncm91cGVkLWNvbWJvYm94LW1lbnUtaGlkZGVuXCI6ICFpc09wZW4gfSl9XG4gICAgICAgICAgICBzdHlsZT17XG4gICAgICAgICAgICAgICAgYWx3YXlzT3BlblxuICAgICAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJibG9ja1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBcInZpc2libGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIlxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgOiBzdHlsZVxuICAgICAgICAgICAgfVxuICAgICAgICA+XG4gICAgICAgICAgICB7bWVudUhlYWRlckNvbnRlbnQgJiYgKFxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwid2lkZ2V0LWdyb3VwZWQtY29tYm9ib3gtbWVudS1oZWFkZXIgd2lkZ2V0LWdyb3VwZWQtY29tYm9ib3gtaXRlbVwiXG4gICAgICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXtQcmV2ZW50TWVudUNsb3NlRXZlbnRIYW5kbGVyfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge21lbnVIZWFkZXJDb250ZW50fVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDx1bFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcIndpZGdldC1ncm91cGVkLWNvbWJvYm94LW1lbnUtbGlzdFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwid2lkZ2V0LWdyb3VwZWQtY29tYm9ib3gtbWVudS1oaWdobGlnaHRlZFwiOiAoaGlnaGxpZ2h0ZWRJbmRleCA/PyAtMSkgPj0gMCxcbiAgICAgICAgICAgICAgICAgICAgXCJ3aWRnZXQtZ3JvdXBlZC1jb21ib2JveC1tZW51LWxhenktc2Nyb2xsXCI6IGxhenlMb2FkaW5nICYmICFpc0VtcHR5XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgey4uLmdldE1lbnVQcm9wcz8uKFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiBvbk9wdGlvbkNsaWNrLFxuICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZURvd246IEZvcmNlUHJldmVudE1lbnVDbG9zZUV2ZW50SGFuZGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uU2Nyb2xsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgc3VwcHJlc3NSZWZFcnJvcjogdHJ1ZSB9XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7aXNPcGVuID8gKFxuICAgICAgICAgICAgICAgICAgICBpc0VtcHR5ICYmICFpc0xvYWRpbmcgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8Tm9PcHRpb25zUGxhY2Vob2xkZXI+e25vT3B0aW9uc1RleHR9PC9Ob09wdGlvbnNQbGFjZWhvbGRlcj5cbiAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgICB7bG9hZGVyfVxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIHttZW51Rm9vdGVyQ29udGVudCAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3aWRnZXQtZ3JvdXBlZC1jb21ib2JveC1tZW51LWZvb3RlclwiIG9uTW91c2VEb3duPXtQcmV2ZW50TWVudUNsb3NlRXZlbnRIYW5kbGVyfT5cbiAgICAgICAgICAgICAgICAgICAge21lbnVGb290ZXJDb250ZW50fVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cbiIsImltcG9ydCBjbGFzc05hbWVzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgeyBVc2VDb21ib2JveFByb3BHZXR0ZXJzIH0gZnJvbSBcImRvd25zaGlmdC90eXBpbmdzXCI7XG5pbXBvcnQgeyBQcm9wc1dpdGhDaGlsZHJlbiwgUmVhY3RFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5cbmludGVyZmFjZSBDb21ib2JveE9wdGlvbldyYXBwZXJQcm9wcyBleHRlbmRzIFByb3BzV2l0aENoaWxkcmVuLCBQYXJ0aWFsPFVzZUNvbWJvYm94UHJvcEdldHRlcnM8c3RyaW5nPj4ge1xuICAgIGlzU2VsZWN0ZWQ/OiBib29sZWFuO1xuICAgIGlzSGlnaGxpZ2h0ZWQ/OiBib29sZWFuO1xuICAgIGl0ZW06IHN0cmluZztcbiAgICBpbmRleDogbnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ29tYm9ib3hPcHRpb25XcmFwcGVyKHByb3BzOiBDb21ib2JveE9wdGlvbldyYXBwZXJQcm9wcyk6IFJlYWN0RWxlbWVudCB7XG4gICAgY29uc3QgeyBjaGlsZHJlbiwgaXNTZWxlY3RlZCwgaXNIaWdobGlnaHRlZCwgaXRlbSwgZ2V0SXRlbVByb3BzLCBpbmRleCB9ID0gcHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGxpXG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXCJ3aWRnZXQtZ3JvdXBlZC1jb21ib2JveC1pdGVtXCIsIHtcbiAgICAgICAgICAgICAgICBcIndpZGdldC1ncm91cGVkLWNvbWJvYm94LWl0ZW0tc2VsZWN0ZWRcIjogaXNTZWxlY3RlZCxcbiAgICAgICAgICAgICAgICBcIndpZGdldC1ncm91cGVkLWNvbWJvYm94LWl0ZW0taGlnaGxpZ2h0ZWRcIjogaXNIaWdobGlnaHRlZFxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICB7Li4uZ2V0SXRlbVByb3BzPy4oe1xuICAgICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICAgIGl0ZW1cbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgYXJpYS1zZWxlY3RlZD17aXNTZWxlY3RlZH1cbiAgICAgICAgPlxuICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICA8L2xpPlxuICAgICk7XG59XG4iLCJpbXBvcnQgY2xhc3NOYW1lcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IHsgUmVhY3RFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5cbmludGVyZmFjZSBDb21ib2JveEdyb3VwSGVhZGVyUHJvcHMge1xuICAgIHRpdGxlOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBub24taW50ZXJhY3RpdmUsIG5vbi1zZWxlY3RhYmxlIGxpc3QgaXRlbSByZW5kZXJlZCBhcyBhIGdyb3VwIGhlYWRpbmdcbiAqIGluc2lkZSB0aGUgY29tYm9ib3ggZHJvcGRvd24gbWVudS5cbiAqXG4gKiBJbXBvcnRhbnQ6IHRoaXMgZWxlbWVudCBpcyBOT1QgaW5jbHVkZWQgaW4gdGhlIGRvd25zaGlmdCBpdGVtIGluZGV4XG4gKiBzZXF1ZW5jZSDigJQgaXQgaXMgcHVyZWx5IHZpc3VhbCBhbmQgc2tpcHBlZCBkdXJpbmcga2V5Ym9hcmQgbmF2aWdhdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIENvbWJvYm94R3JvdXBIZWFkZXIoeyB0aXRsZSB9OiBDb21ib2JveEdyb3VwSGVhZGVyUHJvcHMpOiBSZWFjdEVsZW1lbnQge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxsaVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFwid2lkZ2V0LWdyb3VwZWQtY29tYm9ib3gtZ3JvdXAtaGVhZGVyXCIpfVxuICAgICAgICAgICAgYXJpYS1kaXNhYmxlZD1cInRydWVcIlxuICAgICAgICAgICAgcm9sZT1cInNlcGFyYXRvclwiXG4gICAgICAgICAgICBhcmlhLWxhYmVsPXt0aXRsZX1cbiAgICAgICAgICAgIG9uTW91c2VEb3duPXtlID0+IGUucHJldmVudERlZmF1bHQoKX1cbiAgICAgICAgPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwid2lkZ2V0LWdyb3VwZWQtY29tYm9ib3gtZ3JvdXAtaGVhZGVyLXRleHRcIj57dGl0bGV9PC9zcGFuPlxuICAgICAgICA8L2xpPlxuICAgICk7XG59XG4iLCJpbXBvcnQgeyBSZWFjdEVsZW1lbnQgfSBmcm9tIFwicmVhY3RcIjtcblxudHlwZSBTa2VsZXRvbkxvYWRlclByb3BzID0ge1xuICAgIHdpdGhDaGVja2JveD86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gU2tlbGV0b25Mb2FkZXIoeyB3aXRoQ2hlY2tib3ggPSBmYWxzZSB9OiBTa2VsZXRvbkxvYWRlclByb3BzKTogUmVhY3RFbGVtZW50IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndpZGdldC1jb21ib2JveC1za2VsZXRvblwiPlxuICAgICAgICAgICAge3dpdGhDaGVja2JveCAmJiA8c3BhbiBjbGFzc05hbWU9XCJ3aWRnZXQtY29tYm9ib3gtc2tlbGV0b24tbG9hZGVyIHdpZGdldC1jb21ib2JveC1za2VsZXRvbi1sb2FkZXItc21hbGxcIiAvPn1cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIndpZGdldC1jb21ib2JveC1za2VsZXRvbi1sb2FkZXJcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuIiwiaW1wb3J0IHsgRnJhZ21lbnQsIFJlYWN0RWxlbWVudCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgTG9hZGluZ1R5cGVFbnVtIH0gZnJvbSBcInR5cGluZ3MvR3JvdXBlZENvbWJvYm94UHJvcHNcIjtcbmltcG9ydCB7IERFRkFVTFRfTElNSVRfU0laRSB9IGZyb20gXCIuLi9oZWxwZXJzL3V0aWxzXCI7XG5pbXBvcnQgeyBTa2VsZXRvbkxvYWRlciB9IGZyb20gXCIuL1NrZWxldG9uTG9hZGVyXCI7XG5pbXBvcnQgeyBTcGlubmVyTG9hZGVyIH0gZnJvbSBcIi4vU3Bpbm5lckxvYWRlclwiO1xuXG50eXBlIExvYWRlclByb3BzID0ge1xuICAgIGlzRW1wdHk6IGJvb2xlYW47XG4gICAgaXNMb2FkaW5nOiBib29sZWFuO1xuICAgIGlzT3BlbjogYm9vbGVhbjtcbiAgICBsYXp5TG9hZGluZzogYm9vbGVhbjtcbiAgICBsb2FkaW5nVHlwZT86IExvYWRpbmdUeXBlRW51bTtcbiAgICB3aXRoQ2hlY2tib3g6IGJvb2xlYW47XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gTG9hZGVyKHByb3BzOiBMb2FkZXJQcm9wcyk6IFJlYWN0RWxlbWVudCB8IG51bGwge1xuICAgIGNvbnN0IHsgaXNFbXB0eSwgaXNMb2FkaW5nLCBpc09wZW4sIGxhenlMb2FkaW5nLCBsb2FkaW5nVHlwZSwgd2l0aENoZWNrYm94IH0gPSBwcm9wcztcblxuICAgIGlmICghaXNPcGVuIHx8ICFsYXp5TG9hZGluZyB8fCAhaXNMb2FkaW5nKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBsb2FkaW5nVHlwZSA9PT0gXCJza2VsZXRvblwiID8gKFxuICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAgICB7QXJyYXkuZnJvbSh7IGxlbmd0aDogREVGQVVMVF9MSU1JVF9TSVpFIH0pLm1hcCgoXywgaSkgPT4gKFxuICAgICAgICAgICAgICAgIDxTa2VsZXRvbkxvYWRlciB3aXRoQ2hlY2tib3g9e3dpdGhDaGVja2JveH0ga2V5PXtpfSAvPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKSA6IChcbiAgICAgICAgPFNwaW5uZXJMb2FkZXIgd2l0aE1hcmdpbnM9e2lzRW1wdHl9IC8+XG4gICAgKTtcbn1cbiIsImltcG9ydCB7IFVzZUNvbWJvYm94UHJvcEdldHRlcnMgfSBmcm9tIFwiZG93bnNoaWZ0L3R5cGluZ3NcIjtcbmltcG9ydCB7IEZyYWdtZW50LCBSZWFjdEVsZW1lbnQsIFJlYWN0Tm9kZSB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgU2luZ2xlU2VsZWN0b3IgfSBmcm9tIFwiLi4vLi4vaGVscGVycy90eXBlc1wiO1xuaW1wb3J0IHsgZ3JvdXBJdGVtcyB9IGZyb20gXCIuLi8uLi9oZWxwZXJzL2dyb3VwaW5nVXRpbHNcIjtcbmltcG9ydCB7IENvbWJvYm94TWVudVdyYXBwZXIgfSBmcm9tIFwiLi4vQ29tYm9ib3hNZW51V3JhcHBlclwiO1xuaW1wb3J0IHsgQ29tYm9ib3hPcHRpb25XcmFwcGVyIH0gZnJvbSBcIi4uL0NvbWJvYm94T3B0aW9uV3JhcHBlclwiO1xuaW1wb3J0IHsgQ29tYm9ib3hHcm91cEhlYWRlciB9IGZyb20gXCIuLi9Db21ib2JveEdyb3VwSGVhZGVyXCI7XG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi4vTG9hZGVyXCI7XG5cbmludGVyZmFjZSBDb21ib2JveE1lbnVQcm9wcyBleHRlbmRzIFBhcnRpYWw8VXNlQ29tYm9ib3hQcm9wR2V0dGVyczxzdHJpbmc+PiB7XG4gICAgaXNPcGVuOiBib29sZWFuO1xuICAgIHNlbGVjdG9yOiBTaW5nbGVTZWxlY3RvcjtcbiAgICBoaWdobGlnaHRlZEluZGV4OiBudW1iZXIgfCBudWxsO1xuICAgIHNlbGVjdGVkSXRlbT86IHN0cmluZyB8IG51bGw7XG4gICAgbm9PcHRpb25zVGV4dD86IHN0cmluZztcbiAgICBhbHdheXNPcGVuPzogYm9vbGVhbjtcbiAgICBtZW51Rm9vdGVyQ29udGVudD86IFJlYWN0Tm9kZTtcbiAgICBpc0xvYWRpbmc6IGJvb2xlYW47XG4gICAgbGF6eUxvYWRpbmc6IGJvb2xlYW47XG4gICAgb25TY3JvbGw6IChlOiBhbnkpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTaW5nbGVTZWxlY3Rpb25NZW51KHtcbiAgICBpc09wZW4sXG4gICAgc2VsZWN0b3IsXG4gICAgaGlnaGxpZ2h0ZWRJbmRleCxcbiAgICBnZXRNZW51UHJvcHMsXG4gICAgZ2V0SXRlbVByb3BzLFxuICAgIG5vT3B0aW9uc1RleHQsXG4gICAgYWx3YXlzT3BlbixcbiAgICBtZW51Rm9vdGVyQ29udGVudCxcbiAgICBpc0xvYWRpbmcsXG4gICAgbGF6eUxvYWRpbmcsXG4gICAgb25TY3JvbGxcbn06IENvbWJvYm94TWVudVByb3BzKTogUmVhY3RFbGVtZW50IHtcbiAgICBjb25zdCBpdGVtcyA9IHNlbGVjdG9yLm9wdGlvbnMuZ2V0QWxsKCk7XG5cbiAgICAvLyBCdWlsZCB0aGUgZ3JvdXAgZnVuY3Rpb24g4oCUIGZhbGxzIGJhY2sgdG8gbnVsbCAobm8gZ3JvdXBpbmcpIHdoZW4gY2FwdGlvbiBwcm92aWRlciBoYXMgbm8gZ2V0R3JvdXBcbiAgICBjb25zdCBnZXRHcm91cEZuID0gc2VsZWN0b3IuY2FwdGlvbi5nZXRHcm91cFxuICAgICAgICA/IChpZDogc3RyaW5nKSA9PiBzZWxlY3Rvci5jYXB0aW9uLmdldEdyb3VwIShpZClcbiAgICAgICAgOiAoX2lkOiBzdHJpbmcpID0+IG51bGw7XG5cbiAgICBjb25zdCBzZWdtZW50cyA9IGdyb3VwSXRlbXMoaXRlbXMsIGdldEdyb3VwRm4pO1xuICAgIGNvbnN0IGlzR3JvdXBlZCA9IHNlZ21lbnRzLnNvbWUocyA9PiBzLmdyb3VwVGl0bGUgIT09IG51bGwpO1xuXG4gICAgLy8gV2UgbmVlZCBhIGNvbnRpbnVvdXMgZG93bnNoaWZ0IGluZGV4IHRoYXQgc2tpcHMgZ3JvdXAgaGVhZGVyIHJvd3NcbiAgICBsZXQgZG93bnNoaWZ0SW5kZXggPSAwO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPENvbWJvYm94TWVudVdyYXBwZXJcbiAgICAgICAgICAgIGFsd2F5c09wZW49e2Fsd2F5c09wZW59XG4gICAgICAgICAgICBnZXRNZW51UHJvcHM9e2dldE1lbnVQcm9wc31cbiAgICAgICAgICAgIGlzRW1wdHk9e2l0ZW1zPy5sZW5ndGggPD0gMH1cbiAgICAgICAgICAgIGlzTG9hZGluZz17aXNMb2FkaW5nfVxuICAgICAgICAgICAgaXNPcGVuPXtpc09wZW59XG4gICAgICAgICAgICBsYXp5TG9hZGluZz17bGF6eUxvYWRpbmd9XG4gICAgICAgICAgICBsb2FkZXI9e1xuICAgICAgICAgICAgICAgIDxMb2FkZXJcbiAgICAgICAgICAgICAgICAgICAgaXNMb2FkaW5nPXtpc0xvYWRpbmd9XG4gICAgICAgICAgICAgICAgICAgIGlzT3Blbj17aXNPcGVufVxuICAgICAgICAgICAgICAgICAgICBsYXp5TG9hZGluZz17bGF6eUxvYWRpbmd9XG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmdUeXBlPXtzZWxlY3Rvci5sb2FkaW5nVHlwZX1cbiAgICAgICAgICAgICAgICAgICAgd2l0aENoZWNrYm94PXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgaXNFbXB0eT17aXRlbXMubGVuZ3RoID09PSAwfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZW51Rm9vdGVyQ29udGVudD17bWVudUZvb3RlckNvbnRlbnR9XG4gICAgICAgICAgICBub09wdGlvbnNUZXh0PXtub09wdGlvbnNUZXh0fVxuICAgICAgICAgICAgb25TY3JvbGw9e2xhenlMb2FkaW5nID8gb25TY3JvbGwgOiB1bmRlZmluZWR9XG4gICAgICAgID5cbiAgICAgICAgICAgIHtpc09wZW4gJiZcbiAgICAgICAgICAgICAgICAoaXNHcm91cGVkXG4gICAgICAgICAgICAgICAgICAgID8gc2VnbWVudHMubWFwKHNlZ21lbnQgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8RnJhZ21lbnQga2V5PXtzZWdtZW50Lmdyb3VwVGl0bGUgPz8gXCJfX3VuZ3JvdXBlZF9fXCJ9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlZ21lbnQuZ3JvdXBUaXRsZSAmJiA8Q29tYm9ib3hHcm91cEhlYWRlciB0aXRsZT17c2VnbWVudC5ncm91cFRpdGxlfSAvPn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWdtZW50Lml0ZW1zLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBkb3duc2hpZnRJbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb21ib2JveE9wdGlvbldyYXBwZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17aXRlbX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzSGlnaGxpZ2h0ZWQ9e2Fsd2F5c09wZW4gPyBmYWxzZSA6IGhpZ2hsaWdodGVkSW5kZXggPT09IGN1cnJlbnRJbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e3NlbGVjdG9yLmN1cnJlbnRJZCA9PT0gaXRlbX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW09e2l0ZW19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRJdGVtUHJvcHM9e2dldEl0ZW1Qcm9wc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4PXtjdXJyZW50SW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWxlY3Rvci5jYXB0aW9uLnJlbmRlcihpdGVtLCBcIm9wdGlvbnNcIil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29tYm9ib3hPcHRpb25XcmFwcGVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgICAgICA6IGl0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbWJvYm94T3B0aW9uV3JhcHBlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpdGVtfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNIaWdobGlnaHRlZD17YWx3YXlzT3BlbiA/IGZhbHNlIDogaGlnaGxpZ2h0ZWRJbmRleCA9PT0gaW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkPXtzZWxlY3Rvci5jdXJyZW50SWQgPT09IGl0ZW19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtPXtpdGVtfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0SXRlbVByb3BzPXtnZXRJdGVtUHJvcHN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWxlY3Rvci5jYXB0aW9uLnJlbmRlcihpdGVtLCBcIm9wdGlvbnNcIil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29tYm9ib3hPcHRpb25XcmFwcGVyPlxuICAgICAgICAgICAgICAgICAgICAgICkpKX1cbiAgICAgICAgPC9Db21ib2JveE1lbnVXcmFwcGVyPlxuICAgICk7XG59XG4iLCJpbXBvcnQgY2xhc3NOYW1lcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IHsgRnJhZ21lbnQsIEtleWJvYXJkRXZlbnRIYW5kbGVyLCBSZWFjdEVsZW1lbnQsIHVzZU1lbW8sIHVzZVJlZiB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgQ2xlYXJCdXR0b24gfSBmcm9tIFwiLi4vLi4vYXNzZXRzL2ljb25zXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25CYXNlUHJvcHMsIFNpbmdsZVNlbGVjdG9yIH0gZnJvbSBcIi4uLy4uL2hlbHBlcnMvdHlwZXNcIjtcbmltcG9ydCB7IGdldElucHV0TGFiZWwsIGdldFZhbGlkYXRpb25FcnJvcklkIH0gZnJvbSBcIi4uLy4uL2hlbHBlcnMvdXRpbHNcIjtcbmltcG9ydCB7IHVzZURvd25zaGlmdFNpbmdsZVNlbGVjdFByb3BzIH0gZnJvbSBcIi4uLy4uL2hvb2tzL3VzZURvd25zaGlmdFNpbmdsZVNlbGVjdFByb3BzXCI7XG5pbXBvcnQgeyB1c2VMYXp5TG9hZGluZyB9IGZyb20gXCIuLi8uLi9ob29rcy91c2VMYXp5TG9hZGluZ1wiO1xuaW1wb3J0IHsgQ29tYm9ib3hXcmFwcGVyIH0gZnJvbSBcIi4uL0NvbWJvYm94V3JhcHBlclwiO1xuaW1wb3J0IHsgSW5wdXRQbGFjZWhvbGRlciB9IGZyb20gXCIuLi9QbGFjZWhvbGRlclwiO1xuaW1wb3J0IHsgU2luZ2xlU2VsZWN0aW9uTWVudSB9IGZyb20gXCIuL1NpbmdsZVNlbGVjdGlvbk1lbnVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIFNpbmdsZVNlbGVjdGlvbih7XG4gICAgc2VsZWN0b3IsXG4gICAgdGFiSW5kZXggPSAwLFxuICAgIGExMXlDb25maWcsXG4gICAga2VlcE1lbnVPcGVuLFxuICAgIG1lbnVGb290ZXJDb250ZW50LFxuICAgIGFyaWFSZXF1aXJlZCxcbiAgICAuLi5vcHRpb25zXG59OiBTZWxlY3Rpb25CYXNlUHJvcHM8U2luZ2xlU2VsZWN0b3I+KTogUmVhY3RFbGVtZW50IHtcbiAgICBjb25zdCB7XG4gICAgICAgIGdldElucHV0UHJvcHMsXG4gICAgICAgIGdldFRvZ2dsZUJ1dHRvblByb3BzLFxuICAgICAgICBnZXRJdGVtUHJvcHMsXG4gICAgICAgIHNlbGVjdGVkSXRlbSxcbiAgICAgICAgZ2V0TWVudVByb3BzLFxuICAgICAgICByZXNldCxcbiAgICAgICAgaXNPcGVuLFxuICAgICAgICBoaWdobGlnaHRlZEluZGV4LFxuICAgICAgICBzZWxlY3RJdGVtXG4gICAgfSA9IHVzZURvd25zaGlmdFNpbmdsZVNlbGVjdFByb3BzKHNlbGVjdG9yLCBvcHRpb25zLCBhMTF5Q29uZmlnLmExMXlTdGF0dXNNZXNzYWdlKTtcbiAgICBjb25zdCBpbnB1dFJlZiA9IHVzZVJlZjxIVE1MSW5wdXRFbGVtZW50IHwgbnVsbD4obnVsbCk7XG4gICAgY29uc3QgbGF6eUxvYWRpbmcgPSBzZWxlY3Rvci5sYXp5TG9hZGluZyA/PyBmYWxzZTtcbiAgICBjb25zdCB7IG9uU2Nyb2xsIH0gPSB1c2VMYXp5TG9hZGluZyh7XG4gICAgICAgIGhhc01vcmVJdGVtczogc2VsZWN0b3Iub3B0aW9ucy5oYXNNb3JlID8/IGZhbHNlLFxuICAgICAgICBpc0luZmluaXRlOiBsYXp5TG9hZGluZyxcbiAgICAgICAgaXNPcGVuLFxuICAgICAgICBsb2FkTW9yZTogKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHNlbGVjdG9yLm9wdGlvbnMubG9hZE1vcmUpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci5vcHRpb25zLmxvYWRNb3JlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGRhdGFzb3VyY2VGaWx0ZXI6IHNlbGVjdG9yLm9wdGlvbnMuZGF0YXNvdXJjZUZpbHRlcixcbiAgICAgICAgcmVhZE9ubHk6IHNlbGVjdG9yLnJlYWRPbmx5XG4gICAgfSk7XG5cbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1DYXB0aW9uID0gdXNlTWVtbyhcbiAgICAgICAgKCkgPT4gc2VsZWN0b3IuY2FwdGlvbi5yZW5kZXIoc2VsZWN0ZWRJdGVtLCBcImxhYmVsXCIpLFxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gICAgICAgIFtcbiAgICAgICAgICAgIHNlbGVjdGVkSXRlbSxcbiAgICAgICAgICAgIHNlbGVjdG9yLnN0YXR1cyxcbiAgICAgICAgICAgIHNlbGVjdG9yLmNhcHRpb24sXG4gICAgICAgICAgICBzZWxlY3Rvci5jYXB0aW9uLmVtcHR5Q2FwdGlvbixcbiAgICAgICAgICAgIHNlbGVjdG9yLmN1cnJlbnRJZCxcbiAgICAgICAgICAgIHNlbGVjdG9yLmNhcHRpb24uZm9ybWF0dGVyXG4gICAgICAgIF1cbiAgICApO1xuXG4gICAgY29uc3QgaW5wdXRMYWJlbCA9IGdldElucHV0TGFiZWwob3B0aW9ucy5pbnB1dElkKTtcbiAgICBjb25zdCBlcnJvcklkID0gZ2V0VmFsaWRhdGlvbkVycm9ySWQob3B0aW9ucy5pbnB1dElkKTtcbiAgICBjb25zdCBoYXNMYWJlbCA9IHVzZU1lbW8oKCkgPT4gQm9vbGVhbihpbnB1dExhYmVsKSwgW2lucHV0TGFiZWxdKTtcbiAgICBjb25zdCBvbklucHV0S2V5RG93biA9IHVzZU1lbW88S2V5Ym9hcmRFdmVudEhhbmRsZXI8SFRNTElucHV0RWxlbWVudD4gfCB1bmRlZmluZWQ+KCgpID0+IHtcbiAgICAgICAgaWYgKCFzZWxlY3Rvci5jbGVhcmFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZSA9PiB7XG4gICAgICAgICAgICBpZiAoZS5rZXkgPT09IFwiQmFja3NwYWNlXCIgJiYgZS5jdXJyZW50VGFyZ2V0LnZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0SXRlbShudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9LCBbc2VsZWN0b3IuY2xlYXJhYmxlLCBzZWxlY3RJdGVtXSk7XG5cbiAgICBjb25zdCBpbnB1dFByb3BzID0gZ2V0SW5wdXRQcm9wcyhcbiAgICAgICAge1xuICAgICAgICAgICAgZGlzYWJsZWQ6IHNlbGVjdG9yLnJlYWRPbmx5LFxuICAgICAgICAgICAgcmVhZE9ubHk6IHNlbGVjdG9yLm9wdGlvbnMuZmlsdGVyVHlwZSA9PT0gXCJub25lXCIsXG4gICAgICAgICAgICByZWY6IGlucHV0UmVmLFxuICAgICAgICAgICAgXCJhcmlhLXJlcXVpcmVkXCI6IGFyaWFSZXF1aXJlZC52YWx1ZSxcbiAgICAgICAgICAgIFwiYXJpYS1sYWJlbFwiOiAhaGFzTGFiZWwgJiYgb3B0aW9ucy5hcmlhTGFiZWwgPyBvcHRpb25zLmFyaWFMYWJlbCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIG9uS2V5RG93bjogb25JbnB1dEtleURvd25cbiAgICAgICAgfSxcbiAgICAgICAgeyBzdXBwcmVzc1JlZkVycm9yOiB0cnVlIH1cbiAgICApO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICAgIDxDb21ib2JveFdyYXBwZXJcbiAgICAgICAgICAgICAgICBpc09wZW49e2lzT3BlbiB8fCBrZWVwTWVudU9wZW4gPT09IHRydWV9XG4gICAgICAgICAgICAgICAgcmVhZE9ubHk9e3NlbGVjdG9yLnJlYWRPbmx5fVxuICAgICAgICAgICAgICAgIHJlYWRPbmx5U3R5bGU9e29wdGlvbnMucmVhZE9ubHlTdHlsZX1cbiAgICAgICAgICAgICAgICBnZXRUb2dnbGVCdXR0b25Qcm9wcz17Z2V0VG9nZ2xlQnV0dG9uUHJvcHN9XG4gICAgICAgICAgICAgICAgdmFsaWRhdGlvbj17c2VsZWN0b3IudmFsaWRhdGlvbn1cbiAgICAgICAgICAgICAgICBpc0xvYWRpbmc9e2xhenlMb2FkaW5nICYmIHNlbGVjdG9yLm9wdGlvbnMuaXNMb2FkaW5nfVxuICAgICAgICAgICAgICAgIGVycm9ySWQ9e2Vycm9ySWR9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXCJ3aWRnZXQtY29tYm9ib3gtc2VsZWN0ZWQtaXRlbXNcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aWRnZXQtY29tYm9ib3gtY3VzdG9tLWNvbnRlbnRcIjogc2VsZWN0b3IuY3VzdG9tQ29udGVudFR5cGUgPT09IFwieWVzXCJcbiAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcIndpZGdldC1jb21ib2JveC1pbnB1dFwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aWRnZXQtY29tYm9ib3gtaW5wdXQtbm9maWx0ZXJcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3Iub3B0aW9ucy5maWx0ZXJUeXBlID09PSBcIm5vbmVcIiB8fCBzZWxlY3Rvci5yZWFkT25seVxuICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJJbmRleD17dGFiSW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICB7Li4uaW5wdXRQcm9wc31cbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsbGVkYnk9e2hhc0xhYmVsID8gaW5wdXRQcm9wc1tcImFyaWEtbGFiZWxsZWRieVwiXSA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtZGVzY3JpYmVkYnk9e3NlbGVjdG9yLnZhbGlkYXRpb24gPyBlcnJvcklkIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1pbnZhbGlkPXtzZWxlY3Rvci52YWxpZGF0aW9uID8gdHJ1ZSA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPElucHV0UGxhY2Vob2xkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRW1wdHk9eyFzZWxlY3Rvci5jdXJyZW50SWQgfHwgIXNlbGVjdG9yLmNhcHRpb24ucmVuZGVyKHNlbGVjdGVkSXRlbSwgXCJsYWJlbFwiKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9e3NlbGVjdG9yLmN1c3RvbUNvbnRlbnRUeXBlID09PSBcInllc1wiID8gXCJjdXN0b21cIiA6IFwidGV4dFwifVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRJdGVtQ2FwdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgPC9JbnB1dFBsYWNlaG9sZGVyPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIHshc2VsZWN0b3IucmVhZE9ubHkgJiZcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3IuY2xlYXJhYmxlICYmXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yLmN1cnJlbnRJZCAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgICAgICAhKHNlbGVjdG9yLnNlbGVjdG9yVHlwZSA9PT0gXCJzdGF0aWNcIiAmJiBzZWxlY3Rvci5hdHRyaWJ1dGVUeXBlID09PSBcImJvb2xlYW5cIikgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJJbmRleD17dGFiSW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3aWRnZXQtY29tYm9ib3gtY2xlYXItYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2ExMXlDb25maWcuYXJpYUxhYmVscz8uY2xlYXJTZWxlY3Rpb259XG4gICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRG93bj17ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dFJlZi5jdXJyZW50Py5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEl0ZW0gfHwgc2VsZWN0b3Iuc2VsZWN0b3JUeXBlID09PSBcInN0YXRpY1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yLnNldFZhbHVlKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxDbGVhckJ1dHRvbiAvPlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9Db21ib2JveFdyYXBwZXI+XG4gICAgICAgICAgICA8U2luZ2xlU2VsZWN0aW9uTWVudVxuICAgICAgICAgICAgICAgIHNlbGVjdG9yPXtzZWxlY3Rvcn1cbiAgICAgICAgICAgICAgICBzZWxlY3RlZEl0ZW09e3NlbGVjdGVkSXRlbX1cbiAgICAgICAgICAgICAgICBnZXRNZW51UHJvcHM9e2dldE1lbnVQcm9wc31cbiAgICAgICAgICAgICAgICBnZXRJdGVtUHJvcHM9e2dldEl0ZW1Qcm9wc31cbiAgICAgICAgICAgICAgICBpc09wZW49e2lzT3BlbiB8fCBrZWVwTWVudU9wZW4gPT09IHRydWV9XG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleD17aGlnaGxpZ2h0ZWRJbmRleH1cbiAgICAgICAgICAgICAgICBtZW51Rm9vdGVyQ29udGVudD17bWVudUZvb3RlckNvbnRlbnR9XG4gICAgICAgICAgICAgICAgbm9PcHRpb25zVGV4dD17b3B0aW9ucy5ub09wdGlvbnNUZXh0fVxuICAgICAgICAgICAgICAgIGFsd2F5c09wZW49e2tlZXBNZW51T3Blbn1cbiAgICAgICAgICAgICAgICBpc0xvYWRpbmc9e3NlbGVjdG9yLm9wdGlvbnMuaXNMb2FkaW5nfVxuICAgICAgICAgICAgICAgIGxhenlMb2FkaW5nPXtsYXp5TG9hZGluZ31cbiAgICAgICAgICAgICAgICBvblNjcm9sbD17b25TY3JvbGx9XG4gICAgICAgICAgICAvPlxuICAgICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG59XG4iLCJpbXBvcnQgeyBEeW5hbWljVmFsdWUgfSBmcm9tIFwibWVuZGl4XCI7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1vY2sgRHluYW1pY1ZhbHVlIHdpdGggc3RhdHVzIFwiYXZhaWxhYmxlXCIgYW5kIHRoZSBnaXZlbiB2YWx1ZS5cbiAqIFVzZWQgaW4gZWRpdG9yIHByZXZpZXcgbW9kZSB0byBwcm92aWRlIHN0YXRpYyBEeW5hbWljVmFsdWUgaW5zdGFuY2VzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZHluYW1pYzxUPih2YWx1ZTogVCk6IER5bmFtaWNWYWx1ZTxUPiB7XG4gICAgcmV0dXJuIHsgc3RhdHVzOiBcImF2YWlsYWJsZVwiLCB2YWx1ZSB9IGFzIER5bmFtaWNWYWx1ZTxUPjtcbn1cbiIsImZ1bmN0aW9uIHN0eWxlSW5qZWN0KGNzcywgcmVmKSB7XG4gIGlmICggcmVmID09PSB2b2lkIDAgKSByZWYgPSB7fTtcbiAgdmFyIGluc2VydEF0ID0gcmVmLmluc2VydEF0O1xuXG4gIGlmICghY3NzIHx8IHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuOyB9XG5cbiAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuXG4gIGlmIChpbnNlcnRBdCA9PT0gJ3RvcCcpIHtcbiAgICBpZiAoaGVhZC5maXJzdENoaWxkKSB7XG4gICAgICBoZWFkLmluc2VydEJlZm9yZShzdHlsZSwgaGVhZC5maXJzdENoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICB9XG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgc3R5bGVJbmplY3Q7XG4iLCJpbXBvcnQgeyBEeW5hbWljVmFsdWUsIExpc3RBdHRyaWJ1dGVWYWx1ZSwgTGlzdEV4cHJlc3Npb25WYWx1ZSwgTGlzdFdpZGdldFZhbHVlLCBPYmplY3RJdGVtIH0gZnJvbSBcIm1lbmRpeFwiO1xuaW1wb3J0IHsgUmVhY3ROb2RlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBPcHRpb25zU291cmNlQXNzb2NpYXRpb25DdXN0b21Db250ZW50VHlwZUVudW0gfSBmcm9tIFwiLi4vLi4vLi4vdHlwaW5ncy9Hcm91cGVkQ29tYm9ib3hQcm9wc1wiO1xuaW1wb3J0IHsgQ2FwdGlvblBsYWNlbWVudCwgQ2FwdGlvbnNQcm92aWRlciB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgQ2FwdGlvbkNvbnRlbnQgfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgICBlbXB0eU9wdGlvblRleHQ/OiBEeW5hbWljVmFsdWU8c3RyaW5nPjtcbiAgICBmb3JtYXR0aW5nQXR0cmlidXRlT3JFeHByZXNzaW9uOiBMaXN0RXhwcmVzc2lvblZhbHVlPHN0cmluZz4gfCBMaXN0QXR0cmlidXRlVmFsdWU8c3RyaW5nPjtcbiAgICBjdXN0b21Db250ZW50PzogTGlzdFdpZGdldFZhbHVlIHwgdW5kZWZpbmVkO1xuICAgIGN1c3RvbUNvbnRlbnRUeXBlOiBPcHRpb25zU291cmNlQXNzb2NpYXRpb25DdXN0b21Db250ZW50VHlwZUVudW07XG4gICAgLyoqIE9wdGlvbmFsIGF0dHJpYnV0ZSB0aGF0IGRlZmluZXMgdGhlIGdyb3VwL3NlY3Rpb24gaGVhZGluZyBmb3IgZWFjaCBpdGVtICovXG4gICAgZ3JvdXBBdHRyaWJ1dGU/OiBMaXN0QXR0cmlidXRlVmFsdWU8c3RyaW5nPjtcbn1cblxuZXhwb3J0IGNsYXNzIEFzc29jaWF0aW9uU2ltcGxlQ2FwdGlvbnNQcm92aWRlciBpbXBsZW1lbnRzIENhcHRpb25zUHJvdmlkZXIge1xuICAgIHByaXZhdGUgdW5hdmFpbGFibGVDYXB0aW9uID0gXCI8Li4uPlwiO1xuICAgIGZvcm1hdHRlcj86IExpc3RFeHByZXNzaW9uVmFsdWU8c3RyaW5nPiB8IExpc3RBdHRyaWJ1dGVWYWx1ZTxzdHJpbmc+O1xuICAgIHByb3RlY3RlZCBjdXN0b21Db250ZW50PzogTGlzdFdpZGdldFZhbHVlO1xuICAgIHByb3RlY3RlZCBjdXN0b21Db250ZW50VHlwZTogT3B0aW9uc1NvdXJjZUFzc29jaWF0aW9uQ3VzdG9tQ29udGVudFR5cGVFbnVtID0gXCJub1wiO1xuICAgIGVtcHR5Q2FwdGlvbiA9IFwiXCI7XG4gICAgcHJpdmF0ZSBncm91cEZvcm1hdHRlcj86IExpc3RBdHRyaWJ1dGVWYWx1ZTxzdHJpbmc+O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBvcHRpb25zTWFwOiBNYXA8c3RyaW5nLCBPYmplY3RJdGVtPikge31cblxuICAgIHVwZGF0ZVByb3BzKHByb3BzOiBQcm9wcyk6IHZvaWQge1xuICAgICAgICBpZiAoIXByb3BzLmVtcHR5T3B0aW9uVGV4dCB8fCBwcm9wcy5lbXB0eU9wdGlvblRleHQuc3RhdHVzID09PSBcInVuYXZhaWxhYmxlXCIpIHtcbiAgICAgICAgICAgIHRoaXMuZW1wdHlDYXB0aW9uID0gXCJcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZW1wdHlDYXB0aW9uID0gcHJvcHMuZW1wdHlPcHRpb25UZXh0LnZhbHVlITtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZm9ybWF0dGVyID0gcHJvcHMuZm9ybWF0dGluZ0F0dHJpYnV0ZU9yRXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5jdXN0b21Db250ZW50ID0gcHJvcHMuY3VzdG9tQ29udGVudDtcbiAgICAgICAgdGhpcy5jdXN0b21Db250ZW50VHlwZSA9IHByb3BzLmN1c3RvbUNvbnRlbnRUeXBlO1xuICAgICAgICB0aGlzLmdyb3VwRm9ybWF0dGVyID0gcHJvcHMuZ3JvdXBBdHRyaWJ1dGU7XG4gICAgfVxuXG4gICAgZ2V0KHZhbHVlOiBzdHJpbmcgfCBudWxsKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbXB0eUNhcHRpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmZvcm1hdHRlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQXNzb2NpYXRpb25TaW1wbGVDYXB0aW9uUmVuZGVyZXI6IG5vIGZvcm1hdHRlciBhdmFpbGFibGUuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLm9wdGlvbnNNYXAuZ2V0KHZhbHVlKTtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51bmF2YWlsYWJsZUNhcHRpb247XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjYXB0aW9uVmFsdWUgPSB0aGlzLmZvcm1hdHRlci5nZXQoaXRlbSk7XG4gICAgICAgIGlmICghY2FwdGlvblZhbHVlIHx8IGNhcHRpb25WYWx1ZS5zdGF0dXMgPT09IFwidW5hdmFpbGFibGVcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudW5hdmFpbGFibGVDYXB0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNhcHRpb25WYWx1ZS52YWx1ZSAhPT0gdW5kZWZpbmVkICYmIGNhcHRpb25WYWx1ZS52YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIFN0cmluZyhjYXB0aW9uVmFsdWUudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGdyb3VwIHRpdGxlIGZvciB0aGUgZ2l2ZW4gaXRlbSBJRC5cbiAgICAgKiBSZXR1cm5zIG51bGwgd2hlbiBubyBncm91cCBhdHRyaWJ1dGUgaXMgY29uZmlndXJlZCBvciB0aGUgdmFsdWUgaXMgdW5hdmFpbGFibGUuXG4gICAgICovXG4gICAgZ2V0R3JvdXAodmFsdWU6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICAgICAgICBpZiAoIXRoaXMuZ3JvdXBGb3JtYXR0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLm9wdGlvbnNNYXAuZ2V0KHZhbHVlKTtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBncm91cFZhbHVlID0gdGhpcy5ncm91cEZvcm1hdHRlci5nZXQoaXRlbSk7XG4gICAgICAgIGlmICghZ3JvdXBWYWx1ZSB8fCBncm91cFZhbHVlLnN0YXR1cyAhPT0gXCJhdmFpbGFibGVcIiB8fCAhZ3JvdXBWYWx1ZS5kaXNwbGF5VmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBncm91cFZhbHVlLmRpc3BsYXlWYWx1ZTtcbiAgICB9XG5cbiAgICBnZXRDdXN0b21Db250ZW50KHZhbHVlOiBzdHJpbmcgfCBudWxsKTogUmVhY3ROb2RlIHwgbnVsbCB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMub3B0aW9uc01hcC5nZXQodmFsdWUpO1xuICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY3VzdG9tQ29udGVudD8uZ2V0KGl0ZW0pIGFzIFJlYWN0Tm9kZTtcbiAgICB9XG5cbiAgICByZW5kZXIodmFsdWU6IHN0cmluZyB8IG51bGwsIHBsYWNlbWVudDogQ2FwdGlvblBsYWNlbWVudCwgaHRtbEZvcj86IHN0cmluZyk6IFJlYWN0Tm9kZSB7XG4gICAgICAgIGNvbnN0IHsgY3VzdG9tQ29udGVudFR5cGUgfSA9IHRoaXM7XG5cbiAgICAgICAgcmV0dXJuIGN1c3RvbUNvbnRlbnRUeXBlID09PSBcIm5vXCIgfHxcbiAgICAgICAgICAgIChwbGFjZW1lbnQgPT09IFwibGFiZWxcIiAmJiBjdXN0b21Db250ZW50VHlwZSA9PT0gXCJsaXN0SXRlbVwiKSB8fFxuICAgICAgICAgICAgdmFsdWUgPT09IG51bGwgPyAoXG4gICAgICAgICAgICA8Q2FwdGlvbkNvbnRlbnQgaHRtbEZvcj17aHRtbEZvcn0+e3RoaXMuZ2V0KHZhbHVlKX08L0NhcHRpb25Db250ZW50PlxuICAgICAgICApIDogKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3aWRnZXQtY29tYm9ib3gtY2FwdGlvbi1jdXN0b21cIj57dGhpcy5nZXRDdXN0b21Db250ZW50KHZhbHVlKX08L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDYXB0aW9uUGxhY2VtZW50IH0gZnJvbSBcInNyYy9oZWxwZXJzL3R5cGVzXCI7XG5pbXBvcnQgeyBDYXB0aW9uQ29udGVudCB9IGZyb20gXCJzcmMvaGVscGVycy91dGlsc1wiO1xuaW1wb3J0IHsgT3B0aW9uc1NvdXJjZUFzc29jaWF0aW9uQ3VzdG9tQ29udGVudFR5cGVFbnVtIH0gZnJvbSBcInR5cGluZ3MvR3JvdXBlZENvbWJvYm94UHJvcHNcIjtcbmltcG9ydCB7IEFzc29jaWF0aW9uU2ltcGxlQ2FwdGlvbnNQcm92aWRlciB9IGZyb20gXCIuLi9Bc3NvY2lhdGlvblNpbXBsZUNhcHRpb25zUHJvdmlkZXJcIjtcbmltcG9ydCB7IENvbXBvbmVudFR5cGUsIFJlYWN0Tm9kZSB9IGZyb20gXCJyZWFjdFwiO1xuaW50ZXJmYWNlIFByZXZpZXdQcm9wcyB7XG4gICAgY3VzdG9tQ29udGVudFJlbmRlcmVyOlxuICAgICAgICB8IENvbXBvbmVudFR5cGU8eyBjaGlsZHJlbjogUmVhY3ROb2RlOyBjYXB0aW9uPzogc3RyaW5nIH0+XG4gICAgICAgIHwgQXJyYXk8Q29tcG9uZW50VHlwZTx7IGNoaWxkcmVuOiBSZWFjdE5vZGU7IGNhcHRpb24/OiBzdHJpbmcgfT4+O1xuICAgIGN1c3RvbUNvbnRlbnRUeXBlOiBPcHRpb25zU291cmNlQXNzb2NpYXRpb25DdXN0b21Db250ZW50VHlwZUVudW07XG59XG5cbmV4cG9ydCBjbGFzcyBBc3NvY2lhdGlvblByZXZpZXdDYXB0aW9uc1Byb3ZpZGVyIGV4dGVuZHMgQXNzb2NpYXRpb25TaW1wbGVDYXB0aW9uc1Byb3ZpZGVyIHtcbiAgICBlbXB0eUNhcHRpb24gPSBcIkNvbWJvIGJveFwiO1xuICAgIHByaXZhdGUgY3VzdG9tQ29udGVudFJlbmRlcmVyOiBDb21wb25lbnRUeXBlPHsgY2hpbGRyZW46IFJlYWN0Tm9kZTsgY2FwdGlvbj86IHN0cmluZyB9PiA9ICgpID0+IDxkaXY+PC9kaXY+O1xuICAgIGdldCh2YWx1ZTogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB2YWx1ZSB8fCB0aGlzLmVtcHR5Q2FwdGlvbjtcbiAgICB9XG5cbiAgICBnZXRDdXN0b21Db250ZW50KHZhbHVlOiBzdHJpbmcgfCBudWxsKTogUmVhY3ROb2RlIHwgbnVsbCB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY3VzdG9tQ29udGVudFR5cGUgIT09IFwibm9cIikge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8dGhpcy5jdXN0b21Db250ZW50UmVuZGVyZXIgY2FwdGlvbj17XCJDVVNUT00gQ09OVEVOVFwifT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiAvPlxuICAgICAgICAgICAgICAgIDwvdGhpcy5jdXN0b21Db250ZW50UmVuZGVyZXI+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlUHJldmlld1Byb3BzKHByb3BzOiBQcmV2aWV3UHJvcHMpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jdXN0b21Db250ZW50UmVuZGVyZXIgPSBwcm9wcy5jdXN0b21Db250ZW50UmVuZGVyZXIgYXMgQ29tcG9uZW50VHlwZTx7XG4gICAgICAgICAgICBjaGlsZHJlbjogUmVhY3ROb2RlO1xuICAgICAgICAgICAgY2FwdGlvbj86IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAgICAgfT47XG4gICAgICAgIHRoaXMuY3VzdG9tQ29udGVudFR5cGUgPSBwcm9wcy5jdXN0b21Db250ZW50VHlwZTtcbiAgICB9XG5cbiAgICByZW5kZXIodmFsdWU6IHN0cmluZyB8IG51bGwsIHBsYWNlbWVudDogQ2FwdGlvblBsYWNlbWVudCwgaHRtbEZvcj86IHN0cmluZyk6IFJlYWN0Tm9kZSB7XG4gICAgICAgIC8vIGFsd2F5cyByZW5kZXIgY3VzdG9tIGNvbnRlbnQgZHJvcHpvbmUgaW4gZGVzaWduIG1vZGUgaWYgdHlwZSBpcyBvcHRpb25zIG9ubHlcbiAgICAgICAgaWYgKHBsYWNlbWVudCA9PT0gXCJvcHRpb25zXCIpIHtcbiAgICAgICAgICAgIHJldHVybiA8Q2FwdGlvbkNvbnRlbnQgaHRtbEZvcj17aHRtbEZvcn0+e3RoaXMuZ2V0KHZhbHVlKX08L0NhcHRpb25Db250ZW50PjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdXBlci5yZW5kZXIodmFsdWUsIHBsYWNlbWVudCA9PT0gXCJsYWJlbFwiID8gXCJvcHRpb25zXCIgOiBwbGFjZW1lbnQpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE9iamVjdEl0ZW0gfSBmcm9tIFwibWVuZGl4XCI7XG5pbXBvcnQgeyBCYXNlUHJvcHMgfSBmcm9tIFwiLi4vLi4vLi4vaGVscGVycy9CYXNlRGF0YXNvdXJjZU9wdGlvbnNQcm92aWRlclwiO1xuaW1wb3J0IHsgQ2FwdGlvbnNQcm92aWRlciwgT3B0aW9uc1Byb3ZpZGVyLCBTdGF0dXMgfSBmcm9tIFwiLi4vLi4vdHlwZXNcIjtcbmltcG9ydCB7IEZpbHRlclR5cGVFbnVtIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3R5cGluZ3MvR3JvdXBlZENvbWJvYm94UHJvcHNcIjtcblxuZXhwb3J0IGNsYXNzIEFzc29jaWF0aW9uUHJldmlld09wdGlvbnNQcm92aWRlciBpbXBsZW1lbnRzIE9wdGlvbnNQcm92aWRlcjxPYmplY3RJdGVtLCBCYXNlUHJvcHM+IHtcbiAgICBmaWx0ZXJUeXBlOiBGaWx0ZXJUeXBlRW51bSA9IFwiY29udGFpbnNcIjtcbiAgICBoYXNNb3JlPzogYm9vbGVhbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBzZWFyY2hUZXJtOiBzdHJpbmcgPSBcIlwiO1xuICAgIHN0YXR1czogU3RhdHVzID0gXCJhdmFpbGFibGVcIjtcbiAgICBpc0xvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgY2FwdGlvbjogQ2FwdGlvbnNQcm92aWRlcixcbiAgICAgICAgcHJvdGVjdGVkIHZhbHVlc01hcDogTWFwPHN0cmluZywgT2JqZWN0SXRlbT5cbiAgICApIHt9XG4gICAgb25BZnRlclNlYXJjaFRlcm1DaGFuZ2UoX2NhbGxiYWNrOiAoKSA9PiB2b2lkKTogdm9pZCB7fVxuICAgIHNldFNlYXJjaFRlcm0oX3ZhbHVlOiBzdHJpbmcpOiB2b2lkIHt9XG4gICAgbG9hZE1vcmU/KCk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgICB9XG4gICAgX3VwZGF0ZVByb3BzKF86IEJhc2VQcm9wcyk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgICB9XG4gICAgX29wdGlvblRvVmFsdWUoX3ZhbHVlOiBzdHJpbmcgfCBudWxsKTogT2JqZWN0SXRlbSB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cbiAgICBfdmFsdWVUb09wdGlvbihfdmFsdWU6IE9iamVjdEl0ZW0gfCB1bmRlZmluZWQpOiBzdHJpbmcgfCBudWxsIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxuICAgIGdldEFsbCgpOiBzdHJpbmdbXSB7XG4gICAgICAgIHJldHVybiBbXCIuLi5cIl07XG4gICAgfVxufVxuIiwiaW1wb3J0IHtcbiAgICBHcm91cGVkQ29tYm9ib3hDb250YWluZXJQcm9wcyxcbiAgICBHcm91cGVkQ29tYm9ib3hQcmV2aWV3UHJvcHMsXG4gICAgTG9hZGluZ1R5cGVFbnVtLFxuICAgIE9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkN1c3RvbUNvbnRlbnRUeXBlRW51bVxufSBmcm9tIFwiLi4vLi4vLi4vLi4vdHlwaW5ncy9Hcm91cGVkQ29tYm9ib3hQcm9wc1wiO1xuaW1wb3J0IHsgQ2FwdGlvbnNQcm92aWRlciwgT3B0aW9uc1Byb3ZpZGVyLCBTaW5nbGVTZWxlY3RvciwgU3RhdHVzIH0gZnJvbSBcIi4uLy4uLy4uL2hlbHBlcnMvdHlwZXNcIjtcbmltcG9ydCB7IGdldERhdGFzb3VyY2VQbGFjZWhvbGRlclRleHQgfSBmcm9tIFwiLi4vLi4vLi4vaGVscGVycy91dGlsc1wiO1xuaW1wb3J0IHsgQXNzb2NpYXRpb25QcmV2aWV3Q2FwdGlvbnNQcm92aWRlciB9IGZyb20gXCIuL0Fzc29jaWF0aW9uUHJldmlld0NhcHRpb25zUHJvdmlkZXJcIjtcbmltcG9ydCB7IEFzc29jaWF0aW9uUHJldmlld09wdGlvbnNQcm92aWRlciB9IGZyb20gXCIuL0Fzc29jaWF0aW9uUHJldmlld09wdGlvbnNQcm92aWRlclwiO1xuXG5leHBvcnQgY2xhc3MgQXNzb2NpYXRpb25QcmV2aWV3U2VsZWN0b3IgaW1wbGVtZW50cyBTaW5nbGVTZWxlY3RvciB7XG4gICAgYXR0cmlidXRlVHlwZT86IFwic3RyaW5nXCIgfCBcImJpZ1wiIHwgXCJib29sZWFuXCIgfCBcImRhdGVcIjtcbiAgICBjYXB0aW9uOiBDYXB0aW9uc1Byb3ZpZGVyO1xuICAgIGNsZWFyYWJsZTogYm9vbGVhbjtcbiAgICBjdXJyZW50SWQ6IHN0cmluZyB8IG51bGw7XG4gICAgY3VzdG9tQ29udGVudFR5cGU6IE9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkN1c3RvbUNvbnRlbnRUeXBlRW51bTtcbiAgICBsYXp5TG9hZGluZz86IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBsb2FkaW5nVHlwZT86IExvYWRpbmdUeXBlRW51bSA9IFwic2tlbGV0b25cIjtcbiAgICBvcHRpb25zOiBPcHRpb25zUHJvdmlkZXI7XG4gICAgcmVhZE9ubHk6IGJvb2xlYW47XG4gICAgc2VsZWN0b3JUeXBlPzogXCJjb250ZXh0XCIgfCBcImRhdGFiYXNlXCIgfCBcInN0YXRpY1wiO1xuICAgIHN0YXR1czogU3RhdHVzID0gXCJhdmFpbGFibGVcIjtcbiAgICB0eXBlID0gXCJzaW5nbGVcIiBhcyBjb25zdDtcbiAgICB2YWxpZGF0aW9uPzogc3RyaW5nO1xuXG4gICAgb25FbnRlckV2ZW50PzogKCkgPT4gdm9pZDtcbiAgICBvbkxlYXZlRXZlbnQ/OiAoKSA9PiB2b2lkO1xuXG4gICAgY29uc3RydWN0b3IocHJvcHM6IEdyb3VwZWRDb21ib2JveFByZXZpZXdQcm9wcykge1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBuZXcgQXNzb2NpYXRpb25QcmV2aWV3Q2FwdGlvbnNQcm92aWRlcihuZXcgTWFwKCkpO1xuICAgICAgICB0aGlzLmNsZWFyYWJsZSA9IHByb3BzLmNsZWFyYWJsZTtcbiAgICAgICAgdGhpcy5jdXJyZW50SWQgPSBnZXREYXRhc291cmNlUGxhY2Vob2xkZXJUZXh0KHByb3BzKTtcbiAgICAgICAgdGhpcy5jdXN0b21Db250ZW50VHlwZSA9IHByb3BzLm9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkN1c3RvbUNvbnRlbnRUeXBlO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBuZXcgQXNzb2NpYXRpb25QcmV2aWV3T3B0aW9uc1Byb3ZpZGVyKHRoaXMuY2FwdGlvbiwgbmV3IE1hcCgpKTtcbiAgICAgICAgdGhpcy5yZWFkT25seSA9IHByb3BzLnJlYWRPbmx5O1xuICAgICAgICAodGhpcy5jYXB0aW9uIGFzIEFzc29jaWF0aW9uUHJldmlld0NhcHRpb25zUHJvdmlkZXIpLnVwZGF0ZVByZXZpZXdQcm9wcyh7XG4gICAgICAgICAgICBjdXN0b21Db250ZW50UmVuZGVyZXI6IHByb3BzLm9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkN1c3RvbUNvbnRlbnQucmVuZGVyZXIsXG4gICAgICAgICAgICBjdXN0b21Db250ZW50VHlwZTogcHJvcHMub3B0aW9uc1NvdXJjZUFzc29jaWF0aW9uQ3VzdG9tQ29udGVudFR5cGVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHByb3BzLm9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkN1c3RvbUNvbnRlbnRUeXBlID09PSBcImxpc3RJdGVtXCIpIHtcbiAgICAgICAgICAgIC8vIGFsd2F5cyByZW5kZXIgY3VzdG9tIGNvbnRlbnQgZHJvcHpvbmUgaW4gZGVzaWduIG1vZGUgaWYgdHlwZSBpcyBvcHRpb25zIG9ubHlcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tQ29udGVudFR5cGUgPSBcInllc1wiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0VmFsdWUoXzogc3RyaW5nIHwgbnVsbCk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgICB9XG4gICAgdXBkYXRlUHJvcHMoXzogR3JvdXBlZENvbWJvYm94Q29udGFpbmVyUHJvcHMpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgT3B0aW9uc1NvdXJjZVN0YXRpY0RhdGFTb3VyY2VQcmV2aWV3VHlwZSwgU3RhdGljRGF0YVNvdXJjZUN1c3RvbUNvbnRlbnRUeXBlRW51bSB9IGZyb20gXCJ0eXBpbmdzL0dyb3VwZWRDb21ib2JveFByb3BzXCI7XG5pbXBvcnQgeyBDYXB0aW9uUGxhY2VtZW50LCBDYXB0aW9uc1Byb3ZpZGVyIH0gZnJvbSBcIi4uLy4uL3R5cGVzXCI7XG5pbXBvcnQgeyBDYXB0aW9uQ29udGVudCB9IGZyb20gXCIuLi8uLi91dGlsc1wiO1xuaW1wb3J0IHsgUmVhY3ROb2RlIH0gZnJvbSBcInJlYWN0XCI7XG5cbmV4cG9ydCBjbGFzcyBTdGF0aWNQcmV2aWV3Q2FwdGlvbnNQcm92aWRlciBpbXBsZW1lbnRzIENhcHRpb25zUHJvdmlkZXIge1xuICAgIGVtcHR5Q2FwdGlvbiA9IFwiQ29tYm8gYm94XCI7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgb3B0aW9uc01hcDogTWFwPHN0cmluZywgT3B0aW9uc1NvdXJjZVN0YXRpY0RhdGFTb3VyY2VQcmV2aWV3VHlwZT4sXG4gICAgICAgIHByaXZhdGUgY3VzdG9tQ29udGVudFR5cGU6IFN0YXRpY0RhdGFTb3VyY2VDdXN0b21Db250ZW50VHlwZUVudW0sXG4gICAgICAgIHByaXZhdGUgZGF0YVNvdXJjZVBsYWNlaG9sZGVyOiBzdHJpbmdcbiAgICApIHt9XG5cbiAgICBnZXQodmFsdWU6IHN0cmluZyB8IG51bGwpOiBzdHJpbmcge1xuICAgICAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVtcHR5Q2FwdGlvbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zTWFwLmdldCh2YWx1ZSk/LnN0YXRpY0RhdGFTb3VyY2VDYXB0aW9uIHx8IHRoaXMuZW1wdHlDYXB0aW9uO1xuICAgIH1cblxuICAgIHJlbmRlcih2YWx1ZTogc3RyaW5nIHwgbnVsbCwgcGxhY2VtZW50OiBDYXB0aW9uUGxhY2VtZW50LCBodG1sRm9yPzogc3RyaW5nKTogUmVhY3ROb2RlIHtcbiAgICAgICAgLy8gYWx3YXlzIHJlbmRlciBjdXN0b20gY29udGVudCBkcm9wem9uZSBpbiBkZXNpZ24gbW9kZSBpZiB0eXBlIGlzIG9wdGlvbnMgb25seVxuICAgICAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiA8ZGl2Pnt0aGlzLmRhdGFTb3VyY2VQbGFjZWhvbGRlcn08L2Rpdj47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMub3B0aW9uc01hcC5nZXQodmFsdWUpIS5zdGF0aWNEYXRhU291cmNlQ3VzdG9tQ29udGVudCE7XG4gICAgICAgIGNvbnN0IEl0ZW1SZW5kZXJlciA9IGl0ZW0ucmVuZGVyZXI7XG4gICAgICAgIHJldHVybiB0aGlzLmN1c3RvbUNvbnRlbnRUeXBlID09PSBcIm5vXCIgfHxcbiAgICAgICAgICAgIChwbGFjZW1lbnQgPT09IFwibGFiZWxcIiAmJiB0aGlzLmN1c3RvbUNvbnRlbnRUeXBlID09PSBcImxpc3RJdGVtXCIpIHx8XG4gICAgICAgICAgICB2YWx1ZSA9PT0gbnVsbCA/IChcbiAgICAgICAgICAgIDxDYXB0aW9uQ29udGVudCBodG1sRm9yPXtodG1sRm9yfT57dGhpcy5nZXQodmFsdWUpfTwvQ2FwdGlvbkNvbnRlbnQ+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndpZGdldC1jb21ib2JveC1jYXB0aW9uLWN1c3RvbVwiPlxuICAgICAgICAgICAgICAgIDxJdGVtUmVuZGVyZXIgY2FwdGlvbj17YEN1c3RvbSBjb250ZW50IGZvciAke3RoaXMuZ2V0KHZhbHVlKX1gfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8L0l0ZW1SZW5kZXJlcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE9wdGlvbnNQcm92aWRlciwgU3RhdHVzIH0gZnJvbSBcIi4uLy4uL3R5cGVzXCI7XG5pbXBvcnQgeyBGaWx0ZXJUeXBlRW51bSwgT3B0aW9uc1NvdXJjZVN0YXRpY0RhdGFTb3VyY2VQcmV2aWV3VHlwZSB9IGZyb20gXCIuLi8uLi8uLi8uLi90eXBpbmdzL0dyb3VwZWRDb21ib2JveFByb3BzXCI7XG5cbmV4cG9ydCBjbGFzcyBTdGF0aWNQcmV2aWV3T3B0aW9uc1Byb3ZpZGVyIGltcGxlbWVudHMgT3B0aW9uc1Byb3ZpZGVyPHN0cmluZywgT3B0aW9uc1NvdXJjZVN0YXRpY0RhdGFTb3VyY2VQcmV2aWV3VHlwZT4ge1xuICAgIHN0YXR1czogU3RhdHVzID0gXCJhdmFpbGFibGVcIjtcbiAgICBmaWx0ZXJUeXBlOiBGaWx0ZXJUeXBlRW51bSA9IFwiY29udGFpbnNcIjtcbiAgICBzZWFyY2hUZXJtOiBzdHJpbmcgPSBcIlwiO1xuICAgIGhhc01vcmU/OiBib29sZWFuIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIGlzTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgb3B0aW9uc01hcDogTWFwPHN0cmluZywgT3B0aW9uc1NvdXJjZVN0YXRpY0RhdGFTb3VyY2VQcmV2aWV3VHlwZT4pIHt9XG4gICAgc2V0U2VhcmNoVGVybShfdmFsdWU6IHN0cmluZyk6IHZvaWQge31cbiAgICBvbkFmdGVyU2VhcmNoVGVybUNoYW5nZShfY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHt9XG4gICAgbG9hZE1vcmU/KCk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgICB9XG4gICAgX3VwZGF0ZVByb3BzKF86IE9wdGlvbnNTb3VyY2VTdGF0aWNEYXRhU291cmNlUHJldmlld1R5cGUpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxuICAgIF9vcHRpb25Ub1ZhbHVlKF92YWx1ZTogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cbiAgICBfdmFsdWVUb09wdGlvbihfdmFsdWU6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHN0cmluZyB8IG51bGwge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgICB9XG4gICAgZ2V0QWxsKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uc01hcC5zaXplID8gQXJyYXkuZnJvbSh0aGlzLm9wdGlvbnNNYXAua2V5cygpKSA6IFtcIi4uLlwiXTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDYXB0aW9uc1Byb3ZpZGVyLCBTaW5nbGVTZWxlY3RvciwgU3RhdHVzIH0gZnJvbSBcInNyYy9oZWxwZXJzL3R5cGVzXCI7XG5pbXBvcnQgeyBnZXREYXRhc291cmNlUGxhY2Vob2xkZXJUZXh0IH0gZnJvbSBcInNyYy9oZWxwZXJzL3V0aWxzXCI7XG5pbXBvcnQge1xuICAgIEdyb3VwZWRDb21ib2JveENvbnRhaW5lclByb3BzLFxuICAgIEdyb3VwZWRDb21ib2JveFByZXZpZXdQcm9wcyxcbiAgICBPcHRpb25zU291cmNlU3RhdGljRGF0YVNvdXJjZVByZXZpZXdUeXBlLFxuICAgIFN0YXRpY0RhdGFTb3VyY2VDdXN0b21Db250ZW50VHlwZUVudW1cbn0gZnJvbSBcInR5cGluZ3MvR3JvdXBlZENvbWJvYm94UHJvcHNcIjtcbmltcG9ydCB7IFN0YXRpY1ByZXZpZXdDYXB0aW9uc1Byb3ZpZGVyIH0gZnJvbSBcIi4vU3RhdGljUHJldmlld0NhcHRpb25zUHJvdmlkZXJcIjtcbmltcG9ydCB7IFN0YXRpY1ByZXZpZXdPcHRpb25zUHJvdmlkZXIgfSBmcm9tIFwiLi9TdGF0aWNQcmV2aWV3T3B0aW9uc1Byb3ZpZGVyXCI7XG5cbmV4cG9ydCBjbGFzcyBTdGF0aWNQcmV2aWV3U2VsZWN0b3IgaW1wbGVtZW50cyBTaW5nbGVTZWxlY3RvciB7XG4gICAgdHlwZSA9IFwic2luZ2xlXCIgYXMgY29uc3Q7XG4gICAgc3RhdHVzOiBTdGF0dXMgPSBcImF2YWlsYWJsZVwiO1xuICAgIHJlYWRPbmx5OiBib29sZWFuID0gZmFsc2U7XG4gICAgdmFsaWRhdGlvbj86IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBvcHRpb25zOiBTdGF0aWNQcmV2aWV3T3B0aW9uc1Byb3ZpZGVyO1xuICAgIGNhcHRpb246IENhcHRpb25zUHJvdmlkZXI7XG4gICAgY2xlYXJhYmxlOiBib29sZWFuO1xuICAgIGN1cnJlbnRJZDogc3RyaW5nIHwgbnVsbDtcbiAgICBjdXN0b21Db250ZW50VHlwZTogU3RhdGljRGF0YVNvdXJjZUN1c3RvbUNvbnRlbnRUeXBlRW51bSA9IFwibGlzdEl0ZW1cIjtcbiAgICBvbkVudGVyRXZlbnQ/OiAoKSA9PiB2b2lkO1xuICAgIG9uTGVhdmVFdmVudD86ICgpID0+IHZvaWQ7XG4gICAgY29uc3RydWN0b3IocHJvcHM6IEdyb3VwZWRDb21ib2JveFByZXZpZXdQcm9wcykge1xuICAgICAgICBjb25zdCBvcHRpb25zTWFwID0gbmV3IE1hcDxzdHJpbmcsIE9wdGlvbnNTb3VyY2VTdGF0aWNEYXRhU291cmNlUHJldmlld1R5cGU+KCk7XG4gICAgICAgIHRoaXMuY2FwdGlvbiA9IG5ldyBTdGF0aWNQcmV2aWV3Q2FwdGlvbnNQcm92aWRlcihcbiAgICAgICAgICAgIG9wdGlvbnNNYXAsXG4gICAgICAgICAgICBwcm9wcy5zdGF0aWNEYXRhU291cmNlQ3VzdG9tQ29udGVudFR5cGUsXG4gICAgICAgICAgICBnZXREYXRhc291cmNlUGxhY2Vob2xkZXJUZXh0KHByb3BzKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBuZXcgU3RhdGljUHJldmlld09wdGlvbnNQcm92aWRlcihvcHRpb25zTWFwKTtcbiAgICAgICAgdGhpcy5yZWFkT25seSA9IHByb3BzLnJlYWRPbmx5O1xuICAgICAgICB0aGlzLmNsZWFyYWJsZSA9IHByb3BzLmNsZWFyYWJsZTtcbiAgICAgICAgdGhpcy5jdXJyZW50SWQgPSBudWxsO1xuICAgICAgICB0aGlzLmN1c3RvbUNvbnRlbnRUeXBlID0gcHJvcHMub3B0aW9uc1NvdXJjZUFzc29jaWF0aW9uQ3VzdG9tQ29udGVudFR5cGU7XG4gICAgICAgIGlmIChwcm9wcy5vcHRpb25zU291cmNlQXNzb2NpYXRpb25DdXN0b21Db250ZW50VHlwZSA9PT0gXCJsaXN0SXRlbVwiKSB7XG4gICAgICAgICAgICAvLyBhbHdheXMgcmVuZGVyIGN1c3RvbSBjb250ZW50IGRyb3B6b25lIGluIGRlc2lnbiBtb2RlIGlmIHR5cGUgaXMgb3B0aW9ucyBvbmx5XG4gICAgICAgICAgICB0aGlzLmN1c3RvbUNvbnRlbnRUeXBlID0gXCJ5ZXNcIjtcbiAgICAgICAgfVxuICAgICAgICBwcm9wcy5vcHRpb25zU291cmNlU3RhdGljRGF0YVNvdXJjZS5mb3JFYWNoKChvcHRpb24sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBvcHRpb25zTWFwLnNldChpbmRleC50b1N0cmluZygpLCBvcHRpb24pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2V0VmFsdWUoXzogc3RyaW5nIHwgbnVsbCk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgICB9XG4gICAgdXBkYXRlUHJvcHMoXzogR3JvdXBlZENvbWJvYm94Q29udGFpbmVyUHJvcHMpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtcbiAgICBHcm91cGVkQ29tYm9ib3hDb250YWluZXJQcm9wcyxcbiAgICBHcm91cGVkQ29tYm9ib3hQcmV2aWV3UHJvcHMsXG4gICAgTG9hZGluZ1R5cGVFbnVtLFxuICAgIE9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkN1c3RvbUNvbnRlbnRUeXBlRW51bVxufSBmcm9tIFwiLi4vLi4vLi4vLi4vdHlwaW5ncy9Hcm91cGVkQ29tYm9ib3hQcm9wc1wiO1xuaW1wb3J0IHsgQ2FwdGlvbnNQcm92aWRlciwgT3B0aW9uc1Byb3ZpZGVyLCBTaW5nbGVTZWxlY3RvciwgU3RhdHVzIH0gZnJvbSBcIi4uLy4uLy4uL2hlbHBlcnMvdHlwZXNcIjtcbmltcG9ydCB7IGdldERhdGFzb3VyY2VQbGFjZWhvbGRlclRleHQgfSBmcm9tIFwiLi4vLi4vLi4vaGVscGVycy91dGlsc1wiO1xuaW1wb3J0IHsgQXNzb2NpYXRpb25QcmV2aWV3Q2FwdGlvbnNQcm92aWRlciB9IGZyb20gXCIuLi8uLi9Bc3NvY2lhdGlvbi9QcmV2aWV3L0Fzc29jaWF0aW9uUHJldmlld0NhcHRpb25zUHJvdmlkZXJcIjtcbmltcG9ydCB7IEFzc29jaWF0aW9uUHJldmlld09wdGlvbnNQcm92aWRlciB9IGZyb20gXCIuLi8uLi9Bc3NvY2lhdGlvbi9QcmV2aWV3L0Fzc29jaWF0aW9uUHJldmlld09wdGlvbnNQcm92aWRlclwiO1xuXG5leHBvcnQgY2xhc3MgRGF0YWJhc2VQcmV2aWV3U2VsZWN0b3IgaW1wbGVtZW50cyBTaW5nbGVTZWxlY3RvciB7XG4gICAgYXR0cmlidXRlVHlwZT86IFwic3RyaW5nXCIgfCBcImJpZ1wiIHwgXCJib29sZWFuXCIgfCBcImRhdGVcIjtcbiAgICBjYXB0aW9uOiBDYXB0aW9uc1Byb3ZpZGVyO1xuICAgIGNsZWFyYWJsZTogYm9vbGVhbjtcbiAgICBjdXJyZW50SWQ6IHN0cmluZyB8IG51bGw7XG4gICAgY3VzdG9tQ29udGVudFR5cGU6IE9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkN1c3RvbUNvbnRlbnRUeXBlRW51bTtcbiAgICBsYXp5TG9hZGluZz86IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBsb2FkaW5nVHlwZT86IExvYWRpbmdUeXBlRW51bSA9IFwic2tlbGV0b25cIjtcbiAgICBvcHRpb25zOiBPcHRpb25zUHJvdmlkZXI7XG4gICAgcmVhZE9ubHk6IGJvb2xlYW47XG4gICAgc2VsZWN0b3JUeXBlPzogXCJjb250ZXh0XCIgfCBcImRhdGFiYXNlXCIgfCBcInN0YXRpY1wiO1xuICAgIHN0YXR1czogU3RhdHVzID0gXCJhdmFpbGFibGVcIjtcbiAgICB0eXBlID0gXCJzaW5nbGVcIiBhcyBjb25zdDtcbiAgICB2YWxpZGF0aW9uPzogc3RyaW5nO1xuXG4gICAgb25FbnRlckV2ZW50PzogKCkgPT4gdm9pZDtcbiAgICBvbkxlYXZlRXZlbnQ/OiAoKSA9PiB2b2lkO1xuXG4gICAgY29uc3RydWN0b3IocHJvcHM6IEdyb3VwZWRDb21ib2JveFByZXZpZXdQcm9wcykge1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBuZXcgQXNzb2NpYXRpb25QcmV2aWV3Q2FwdGlvbnNQcm92aWRlcihuZXcgTWFwKCkpO1xuICAgICAgICB0aGlzLmNsZWFyYWJsZSA9IHByb3BzLmNsZWFyYWJsZTtcbiAgICAgICAgdGhpcy5jdXJyZW50SWQgPSBnZXREYXRhc291cmNlUGxhY2Vob2xkZXJUZXh0KHByb3BzKTtcbiAgICAgICAgdGhpcy5jdXN0b21Db250ZW50VHlwZSA9IHByb3BzLm9wdGlvbnNTb3VyY2VEYXRhYmFzZUN1c3RvbUNvbnRlbnRUeXBlO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBuZXcgQXNzb2NpYXRpb25QcmV2aWV3T3B0aW9uc1Byb3ZpZGVyKHRoaXMuY2FwdGlvbiwgbmV3IE1hcCgpKTtcbiAgICAgICAgdGhpcy5yZWFkT25seSA9IHByb3BzLnJlYWRPbmx5O1xuICAgICAgICAodGhpcy5jYXB0aW9uIGFzIEFzc29jaWF0aW9uUHJldmlld0NhcHRpb25zUHJvdmlkZXIpLnVwZGF0ZVByZXZpZXdQcm9wcyh7XG4gICAgICAgICAgICBjdXN0b21Db250ZW50UmVuZGVyZXI6IHByb3BzLm9wdGlvbnNTb3VyY2VEYXRhYmFzZUN1c3RvbUNvbnRlbnQucmVuZGVyZXIsXG4gICAgICAgICAgICBjdXN0b21Db250ZW50VHlwZTogcHJvcHMub3B0aW9uc1NvdXJjZURhdGFiYXNlQ3VzdG9tQ29udGVudFR5cGVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHByb3BzLm9wdGlvbnNTb3VyY2VEYXRhYmFzZUN1c3RvbUNvbnRlbnRUeXBlID09PSBcImxpc3RJdGVtXCIpIHtcbiAgICAgICAgICAgIC8vIGFsd2F5cyByZW5kZXIgY3VzdG9tIGNvbnRlbnQgZHJvcHpvbmUgaW4gZGVzaWduIG1vZGUgaWYgdHlwZSBpcyBvcHRpb25zIG9ubHlcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tQ29udGVudFR5cGUgPSBcInllc1wiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0VmFsdWUoXzogc3RyaW5nIHwgbnVsbCk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgICB9XG4gICAgdXBkYXRlUHJvcHMoXzogR3JvdXBlZENvbWJvYm94Q29udGFpbmVyUHJvcHMpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgZ2VuZXJhdGVVVUlEIH0gZnJvbSBcIkBtZW5kaXgvd2lkZ2V0LXBsdWdpbi1wbGF0Zm9ybS9mcmFtZXdvcmsvZ2VuZXJhdGUtdXVpZFwiO1xyXG5pbXBvcnQgeyBSZWFjdEVsZW1lbnQsIHVzZU1lbW8gfSBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHsgR3JvdXBlZENvbWJvYm94UHJldmlld1Byb3BzIH0gZnJvbSBcIi4uL3R5cGluZ3MvR3JvdXBlZENvbWJvYm94UHJvcHNcIjtcclxuaW1wb3J0IHsgU2luZ2xlU2VsZWN0aW9uIH0gZnJvbSBcIi4vY29tcG9uZW50cy9TaW5nbGVTZWxlY3Rpb24vU2luZ2xlU2VsZWN0aW9uXCI7XHJcbmltcG9ydCB7IGR5bmFtaWMgfSBmcm9tIFwiQG1lbmRpeC93aWRnZXQtcGx1Z2luLXRlc3QtdXRpbHNcIjtcclxuaW1wb3J0IHsgU2VsZWN0aW9uQmFzZVByb3BzLCBTaW5nbGVTZWxlY3RvciB9IGZyb20gXCIuL2hlbHBlcnMvdHlwZXNcIjtcclxuaW1wb3J0IFwiLi91aS9Hcm91cGVkQ29tYm9ib3guc2Nzc1wiO1xyXG5pbXBvcnQgeyBBc3NvY2lhdGlvblByZXZpZXdTZWxlY3RvciB9IGZyb20gXCIuL2hlbHBlcnMvQXNzb2NpYXRpb24vUHJldmlldy9Bc3NvY2lhdGlvblByZXZpZXdTZWxlY3RvclwiO1xyXG5pbXBvcnQgeyBTdGF0aWNQcmV2aWV3U2VsZWN0b3IgfSBmcm9tIFwiLi9oZWxwZXJzL1N0YXRpYy9QcmV2aWV3L1N0YXRpY1ByZXZpZXdTZWxlY3RvclwiO1xyXG5pbXBvcnQgeyBEYXRhYmFzZVByZXZpZXdTZWxlY3RvciB9IGZyb20gXCIuL2hlbHBlcnMvRGF0YWJhc2UvUHJldmlldy9EYXRhYmFzZVByZXZpZXdTZWxlY3RvclwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IHByZXZpZXcgPSAocHJvcHM6IEdyb3VwZWRDb21ib2JveFByZXZpZXdQcm9wcyk6IFJlYWN0RWxlbWVudCA9PiB7XHJcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlVVVJRCgpLnRvU3RyaW5nKCk7XHJcbiAgICBjb25zdCBjb21tb25Qcm9wczogT21pdDxTZWxlY3Rpb25CYXNlUHJvcHM8bnVsbD4sIFwic2VsZWN0b3JcIj4gPSB7XHJcbiAgICAgICAgdGFiSW5kZXg6IDEsXHJcbiAgICAgICAgaW5wdXRJZDogaWQsXHJcbiAgICAgICAgbGFiZWxJZDogYCR7aWR9LWxhYmVsYCxcclxuICAgICAgICByZWFkT25seVN0eWxlOiBwcm9wcy5yZWFkT25seVN0eWxlLFxyXG4gICAgICAgIGFyaWFSZXF1aXJlZDogZHluYW1pYyhmYWxzZSksXHJcbiAgICAgICAgYTExeUNvbmZpZzoge1xyXG4gICAgICAgICAgICBhcmlhTGFiZWxzOiB7XHJcbiAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbjogcHJvcHMuY2xlYXJCdXR0b25BcmlhTGFiZWwsXHJcbiAgICAgICAgICAgICAgICByZW1vdmVTZWxlY3Rpb246IHByb3BzLnJlbW92ZVZhbHVlQXJpYUxhYmVsLFxyXG4gICAgICAgICAgICAgICAgc2VsZWN0QWxsOiBwcm9wcy5zZWxlY3RBbGxCdXR0b25DYXB0aW9uXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGExMXlTdGF0dXNNZXNzYWdlOiB7XHJcbiAgICAgICAgICAgICAgICBhMTF5U2VsZWN0ZWRWYWx1ZTogcHJvcHMuYTExeVNlbGVjdGVkVmFsdWUsXHJcbiAgICAgICAgICAgICAgICBhMTF5T3B0aW9uc0F2YWlsYWJsZTogcHJvcHMuYTExeU9wdGlvbnNBdmFpbGFibGUsXHJcbiAgICAgICAgICAgICAgICBhMTF5SW5zdHJ1Y3Rpb25zOiBwcm9wcy5hMTF5SW5zdHJ1Y3Rpb25zLFxyXG4gICAgICAgICAgICAgICAgYTExeU5vT3B0aW9uOiBwcm9wcy5ub09wdGlvbnNUZXh0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lbnVGb290ZXJDb250ZW50OiBwcm9wcy5zaG93Rm9vdGVyID8gKFxyXG4gICAgICAgICAgICA8cHJvcHMubWVudUZvb3RlckNvbnRlbnQucmVuZGVyZXIgY2FwdGlvbj1cIlBsYWNlIGZvb3RlciB3aWRnZXQgaGVyZVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiAvPlxyXG4gICAgICAgICAgICA8L3Byb3BzLm1lbnVGb290ZXJDb250ZW50LnJlbmRlcmVyPlxyXG4gICAgICAgICkgOiBudWxsLFxyXG4gICAgICAgIGtlZXBNZW51T3BlbjpcclxuICAgICAgICAgICAgcHJvcHMuc2hvd0Zvb3RlciB8fFxyXG4gICAgICAgICAgICAocHJvcHMub3B0aW9uc1NvdXJjZVN0YXRpY0RhdGFTb3VyY2UubGVuZ3RoID4gMCAmJiBwcm9wcy5zdGF0aWNEYXRhU291cmNlQ3VzdG9tQ29udGVudFR5cGUgIT09IFwibm9cIilcclxuICAgIH07XHJcblxyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL3J1bGVzLW9mLWhvb2tzXHJcbiAgICBjb25zdCBzZWxlY3RvcjogU2luZ2xlU2VsZWN0b3IgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgICAgICBpZiAocHJvcHMuc291cmNlID09PSBcInN0YXRpY1wiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RhdGljUHJldmlld1NlbGVjdG9yKHByb3BzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHByb3BzLnNvdXJjZSA9PT0gXCJkYXRhYmFzZVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0YWJhc2VQcmV2aWV3U2VsZWN0b3IocHJvcHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IEFzc29jaWF0aW9uUHJldmlld1NlbGVjdG9yKHByb3BzKTtcclxuICAgIH0sIFtwcm9wc10pO1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndpZGdldC1jb21ib2JveCB3aWRnZXQtZ3JvdXBlZC1jb21ib2JveCB3aWRnZXQtY29tYm9ib3gtZWRpdG9yLXByZXZpZXdcIj5cclxuICAgICAgICAgICAgPFNpbmdsZVNlbGVjdGlvbiBzZWxlY3Rvcj17c2VsZWN0b3J9IHsuLi5jb21tb25Qcm9wc30gLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn07XG4iXSwibmFtZXMiOlsiaGFzT3duIiwiaGFzT3duUHJvcGVydHkiLCJjbGFzc05hbWVzIiwiY2xhc3NlcyIsImkiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJhcmciLCJhcHBlbmRDbGFzcyIsInBhcnNlVmFsdWUiLCJBcnJheSIsImlzQXJyYXkiLCJhcHBseSIsInRvU3RyaW5nIiwiT2JqZWN0IiwicHJvdG90eXBlIiwiaW5jbHVkZXMiLCJrZXkiLCJjYWxsIiwidmFsdWUiLCJuZXdDbGFzcyIsIm1vZHVsZSIsImV4cG9ydHMiLCJkZWZhdWx0Iiwid2luZG93IiwiRFAiLCJNQVhfRFAiLCJNQVhfUE9XRVIiLCJOQU1FIiwiSU5WQUxJRCIsIklOVkFMSURfRFAiLCJJTlZBTElEX1JNIiwiRElWX0JZX1pFUk8iLCJQIiwiVU5ERUZJTkVEIiwicm91bmQiLCJ4Iiwic2QiLCJybSIsIm1vcmUiLCJ4YyIsImMiLCJjb25zdHJ1Y3RvciIsIlJNIiwiRXJyb3IiLCJlIiwidW5zaGlmdCIsInBvcCIsInN0cmluZ2lmeSIsImRvRXhwb25lbnRpYWwiLCJpc05vbnplcm8iLCJzIiwiam9pbiIsIm4iLCJjaGFyQXQiLCJzbGljZSIsImFicyIsImNtcCIsInkiLCJpc25lZyIsInljIiwiaiIsImsiLCJsIiwiZGl2IiwiQmlnIiwiYSIsImIiLCJkcCIsImJsIiwiYnQiLCJyaSIsImJ6IiwiYWkiLCJhbCIsInIiLCJybCIsInEiLCJxYyIsInFpIiwicCIsInB1c2giLCJzaGlmdCIsImVxIiwiZ3QiLCJndGUiLCJsdCIsImx0ZSIsIm1pbnVzIiwic3ViIiwidCIsInhsdHkiLCJwbHVzIiwieGUiLCJ5ZSIsInJldmVyc2UiLCJtb2QiLCJ5Z3R4IiwidGltZXMiLCJuZWciLCJhZGQiLCJwb3ciLCJvbmUiLCJwcmVjIiwic3FydCIsImhhbGYiLCJNYXRoIiwidG9FeHBvbmVudGlhbCIsImluZGV4T2YiLCJtdWwiLCJ0b0ZpeGVkIiwiU3ltYm9sIiwiZm9yIiwidG9KU09OIiwiTkUiLCJQRSIsInRvTnVtYmVyIiwic3RyaWN0IiwidG9QcmVjaXNpb24iLCJ2YWx1ZU9mIiwiY2hhcmFjdGVyTWFwIiwiY2hhcnMiLCJrZXlzIiwiYWxsQWNjZW50cyIsIlJlZ0V4cCIsImZpcnN0QWNjZW50IiwibWF0Y2hlciIsIm1hdGNoIiwicmVtb3ZlQWNjZW50cyIsInN0cmluZyIsInJlcGxhY2UiLCJoYXNBY2NlbnRzIiwiY3JlYXRlRWxlbWVudCIsIl9qc3giLCJfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZSIsIl9leHRlbmRzIiwiYXNzaWduIiwiYmluZCIsIl9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQiLCJSZWZlcmVuY2VFcnJvciIsIl9zZXRQcm90b3R5cGVPZiIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwiX2luaGVyaXRzTG9vc2UiLCJvIiwiY3JlYXRlIiwiaGFzU3ltYm9sIiwiUkVBQ1RfRUxFTUVOVF9UWVBFIiwiUkVBQ1RfUE9SVEFMX1RZUEUiLCJSRUFDVF9GUkFHTUVOVF9UWVBFIiwiUkVBQ1RfU1RSSUNUX01PREVfVFlQRSIsIlJFQUNUX1BST0ZJTEVSX1RZUEUiLCJSRUFDVF9QUk9WSURFUl9UWVBFIiwiUkVBQ1RfQ09OVEVYVF9UWVBFIiwiUkVBQ1RfQVNZTkNfTU9ERV9UWVBFIiwiUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEUiLCJSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIiwiUkVBQ1RfU1VTUEVOU0VfVFlQRSIsIlJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSIsIlJFQUNUX01FTU9fVFlQRSIsIlJFQUNUX0xBWllfVFlQRSIsIlJFQUNUX0JMT0NLX1RZUEUiLCJSRUFDVF9GVU5EQU1FTlRBTF9UWVBFIiwiUkVBQ1RfUkVTUE9OREVSX1RZUEUiLCJSRUFDVF9TQ09QRV9UWVBFIiwiaXNWYWxpZEVsZW1lbnRUeXBlIiwidHlwZSIsIiQkdHlwZW9mIiwidHlwZU9mIiwib2JqZWN0IiwiJCR0eXBlb2ZUeXBlIiwidW5kZWZpbmVkIiwiQXN5bmNNb2RlIiwiQ29uY3VycmVudE1vZGUiLCJDb250ZXh0Q29uc3VtZXIiLCJDb250ZXh0UHJvdmlkZXIiLCJFbGVtZW50IiwiRm9yd2FyZFJlZiIsIkZyYWdtZW50IiwiTGF6eSIsIk1lbW8iLCJQb3J0YWwiLCJQcm9maWxlciIsIlN0cmljdE1vZGUiLCJTdXNwZW5zZSIsImhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlIiwiaXNBc3luY01vZGUiLCJjb25zb2xlIiwiaXNDb25jdXJyZW50TW9kZSIsImlzQ29udGV4dENvbnN1bWVyIiwiaXNDb250ZXh0UHJvdmlkZXIiLCJpc0VsZW1lbnQiLCJpc0ZvcndhcmRSZWYiLCJpc0ZyYWdtZW50IiwiaXNMYXp5IiwiaXNNZW1vIiwiaXNQb3J0YWwiLCJpc1Byb2ZpbGVyIiwiaXNTdHJpY3RNb2RlIiwiaXNTdXNwZW5zZSIsInJlcXVpcmUiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJwcm9wSXNFbnVtZXJhYmxlIiwicHJvcGVydHlJc0VudW1lcmFibGUiLCJ0b09iamVjdCIsInZhbCIsIlR5cGVFcnJvciIsInNob3VsZFVzZU5hdGl2ZSIsInRlc3QxIiwiU3RyaW5nIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsInRlc3QyIiwiZnJvbUNoYXJDb2RlIiwib3JkZXIyIiwibWFwIiwidGVzdDMiLCJzcGxpdCIsImZvckVhY2giLCJsZXR0ZXIiLCJlcnIiLCJ0YXJnZXQiLCJzb3VyY2UiLCJmcm9tIiwidG8iLCJzeW1ib2xzIiwiUmVhY3RQcm9wVHlwZXNTZWNyZXQiLCJGdW5jdGlvbiIsInByaW50V2FybmluZyIsInJlcXVpcmUkJDAiLCJsb2dnZWRUeXBlRmFpbHVyZXMiLCJoYXMiLCJyZXF1aXJlJCQxIiwidGV4dCIsIm1lc3NhZ2UiLCJlcnJvciIsImNoZWNrUHJvcFR5cGVzIiwidHlwZVNwZWNzIiwidmFsdWVzIiwibG9jYXRpb24iLCJjb21wb25lbnROYW1lIiwiZ2V0U3RhY2siLCJ0eXBlU3BlY05hbWUiLCJuYW1lIiwiZXgiLCJzdGFjayIsInJlc2V0V2FybmluZ0NhY2hlIiwiUmVhY3RJcyIsInJlcXVpcmUkJDIiLCJyZXF1aXJlJCQzIiwicmVxdWlyZSQkNCIsImVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGwiLCJpc1ZhbGlkRWxlbWVudCIsInRocm93T25EaXJlY3RBY2Nlc3MiLCJJVEVSQVRPUl9TWU1CT0wiLCJpdGVyYXRvciIsIkZBVVhfSVRFUkFUT1JfU1lNQk9MIiwiZ2V0SXRlcmF0b3JGbiIsIm1heWJlSXRlcmFibGUiLCJpdGVyYXRvckZuIiwiQU5PTllNT1VTIiwiUmVhY3RQcm9wVHlwZXMiLCJhcnJheSIsImNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyIiwiYmlnaW50IiwiYm9vbCIsImZ1bmMiLCJudW1iZXIiLCJzeW1ib2wiLCJhbnkiLCJjcmVhdGVBbnlUeXBlQ2hlY2tlciIsImFycmF5T2YiLCJjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIiLCJlbGVtZW50IiwiY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyIiwiZWxlbWVudFR5cGUiLCJjcmVhdGVFbGVtZW50VHlwZVR5cGVDaGVja2VyIiwiaW5zdGFuY2VPZiIsImNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIiLCJub2RlIiwiY3JlYXRlTm9kZUNoZWNrZXIiLCJvYmplY3RPZiIsImNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIiLCJvbmVPZiIsImNyZWF0ZUVudW1UeXBlQ2hlY2tlciIsIm9uZU9mVHlwZSIsImNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIiLCJzaGFwZSIsImNyZWF0ZVNoYXBlVHlwZUNoZWNrZXIiLCJleGFjdCIsImNyZWF0ZVN0cmljdFNoYXBlVHlwZUNoZWNrZXIiLCJpcyIsIlByb3BUeXBlRXJyb3IiLCJkYXRhIiwiY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIiLCJ2YWxpZGF0ZSIsIm1hbnVhbFByb3BUeXBlQ2FsbENhY2hlIiwibWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQiLCJjaGVja1R5cGUiLCJpc1JlcXVpcmVkIiwicHJvcHMiLCJwcm9wTmFtZSIsInByb3BGdWxsTmFtZSIsInNlY3JldCIsImNhY2hlS2V5IiwiY2hhaW5lZENoZWNrVHlwZSIsImV4cGVjdGVkVHlwZSIsInByb3BWYWx1ZSIsInByb3BUeXBlIiwiZ2V0UHJvcFR5cGUiLCJwcmVjaXNlVHlwZSIsImdldFByZWNpc2VUeXBlIiwidHlwZUNoZWNrZXIiLCJleHBlY3RlZENsYXNzIiwiZXhwZWN0ZWRDbGFzc05hbWUiLCJhY3R1YWxDbGFzc05hbWUiLCJnZXRDbGFzc05hbWUiLCJleHBlY3RlZFZhbHVlcyIsInZhbHVlc1N0cmluZyIsIkpTT04iLCJyZXBsYWNlciIsImFycmF5T2ZUeXBlQ2hlY2tlcnMiLCJwcm9jZXNzIiwiY2hlY2tlciIsImdldFBvc3RmaXhGb3JUeXBlV2FybmluZyIsImV4cGVjdGVkVHlwZXMiLCJjaGVja2VyUmVzdWx0IiwiZXhwZWN0ZWRUeXBlc01lc3NhZ2UiLCJpc05vZGUiLCJpbnZhbGlkVmFsaWRhdG9yRXJyb3IiLCJzaGFwZVR5cGVzIiwiYWxsS2V5cyIsImV2ZXJ5Iiwic3RlcCIsImVudHJpZXMiLCJuZXh0IiwiZG9uZSIsImVudHJ5IiwiaXNTeW1ib2wiLCJEYXRlIiwiUHJvcFR5cGVzIiwiUkVBQ1RfU0VSVkVSX0JMT0NLX1RZUEUiLCJSRUFDVF9ERUJVR19UUkFDSU5HX01PREVfVFlQRSIsIlJFQUNUX0xFR0FDWV9ISURERU5fVFlQRSIsInN5bWJvbEZvciIsIlJFQUNUX09QQVFVRV9JRF9UWVBFIiwiUkVBQ1RfT0ZGU0NSRUVOX1RZUEUiLCJlbmFibGVTY29wZUFQSSIsImhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQ29uY3VycmVudE1vZGUiLCJfX2Fzc2lnbiIsIlN1cHByZXNzZWRFcnJvciIsInN1cHByZXNzZWQiLCJpZENvdW50ZXIiLCJjYlRvQ2IiLCJjYiIsIm5vb3AiLCJzY3JvbGxJbnRvVmlldyIsIm1lbnVOb2RlIiwiYWN0aW9ucyIsImNvbXB1dGUiLCJib3VuZGFyeSIsImJsb2NrIiwic2Nyb2xsTW9kZSIsIl9yZWYiLCJlbCIsInRvcCIsImxlZnQiLCJzY3JvbGxUb3AiLCJzY3JvbGxMZWZ0IiwiaXNPckNvbnRhaW5zTm9kZSIsInBhcmVudCIsImNoaWxkIiwiZW52aXJvbm1lbnQiLCJyZXN1bHQiLCJOb2RlIiwiY29udGFpbnMiLCJkZWJvdW5jZSIsImZuIiwidGltZSIsInRpbWVvdXRJZCIsImNhbmNlbCIsImNsZWFyVGltZW91dCIsIndyYXBwZXIiLCJfbGVuIiwiYXJncyIsIl9rZXkiLCJzZXRUaW1lb3V0IiwiY2FsbEFsbEV2ZW50SGFuZGxlcnMiLCJfbGVuMiIsImZucyIsIl9rZXkyIiwiZXZlbnQiLCJfbGVuMyIsIl9rZXkzIiwic29tZSIsImNvbmNhdCIsInByZXZlbnREb3duc2hpZnREZWZhdWx0IiwibmF0aXZlRXZlbnQiLCJoYW5kbGVSZWZzIiwiX2xlbjQiLCJyZWZzIiwiX2tleTQiLCJyZWYiLCJjdXJyZW50IiwiZ2VuZXJhdGVJZCIsImdldEExMXlTdGF0dXNNZXNzYWdlJDEiLCJfcmVmMiIsImlzT3BlbiIsInJlc3VsdENvdW50IiwicHJldmlvdXNSZXN1bHRDb3VudCIsInVud3JhcEFycmF5IiwiZGVmYXVsdFZhbHVlIiwiaXNET01FbGVtZW50IiwiZ2V0RWxlbWVudFByb3BzIiwicmVxdWlyZWRQcm9wIiwiZm5OYW1lIiwic3RhdGVLZXlzIiwicGlja1N0YXRlIiwic3RhdGUiLCJnZXRTdGF0ZSIsInJlZHVjZSIsInByZXZTdGF0ZSIsImlzQ29udHJvbGxlZFByb3AiLCJub3JtYWxpemVBcnJvd0tleSIsImtleUNvZGUiLCJpc1BsYWluT2JqZWN0Iiwib2JqIiwiZ2V0TmV4dFdyYXBwaW5nSW5kZXgiLCJtb3ZlQW1vdW50IiwiYmFzZUluZGV4IiwiaXRlbUNvdW50IiwiZ2V0SXRlbU5vZGVGcm9tSW5kZXgiLCJjaXJjdWxhciIsIml0ZW1zTGFzdEluZGV4IiwibmV3SW5kZXgiLCJub25EaXNhYmxlZE5ld0luZGV4IiwiZ2V0TmV4dE5vbkRpc2FibGVkSW5kZXgiLCJjdXJyZW50RWxlbWVudE5vZGUiLCJoYXNBdHRyaWJ1dGUiLCJpbmRleCIsIl9pbmRleCIsInRhcmdldFdpdGhpbkRvd25zaGlmdCIsImRvd25zaGlmdEVsZW1lbnRzIiwiY2hlY2tBY3RpdmVFbGVtZW50IiwiY29udGV4dE5vZGUiLCJkb2N1bWVudCIsImFjdGl2ZUVsZW1lbnQiLCJ2YWxpZGF0ZUNvbnRyb2xsZWRVbmNoYW5nZWQiLCJwcmV2UHJvcHMiLCJuZXh0UHJvcHMiLCJ3YXJuaW5nRGVzY3JpcHRpb24iLCJwcm9wS2V5IiwiY2xlYW51cFN0YXR1cyIsImRvY3VtZW50UHJvcCIsImdldFN0YXR1c0RpdiIsInRleHRDb250ZW50Iiwic2V0U3RhdHVzIiwic3RhdHVzIiwic3RhdHVzRGl2IiwiZ2V0RWxlbWVudEJ5SWQiLCJzZXRBdHRyaWJ1dGUiLCJzdHlsZSIsImJvcmRlciIsImNsaXAiLCJoZWlnaHQiLCJtYXJnaW4iLCJvdmVyZmxvdyIsInBhZGRpbmciLCJwb3NpdGlvbiIsIndpZHRoIiwiYm9keSIsImFwcGVuZENoaWxkIiwidW5rbm93biIsIm1vdXNlVXAiLCJpdGVtTW91c2VFbnRlciIsImtleURvd25BcnJvd1VwIiwia2V5RG93bkFycm93RG93biIsImtleURvd25Fc2NhcGUiLCJrZXlEb3duRW50ZXIiLCJrZXlEb3duSG9tZSIsImtleURvd25FbmQiLCJjbGlja0l0ZW0iLCJibHVySW5wdXQiLCJjaGFuZ2VJbnB1dCIsImtleURvd25TcGFjZUJ1dHRvbiIsImNsaWNrQnV0dG9uIiwiYmx1ckJ1dHRvbiIsImNvbnRyb2xsZWRQcm9wVXBkYXRlZFNlbGVjdGVkSXRlbSIsInRvdWNoRW5kIiwic3RhdGVDaGFuZ2VUeXBlcyQzIiwiZnJlZXplIiwiX2V4Y2x1ZGVkJDQiLCJfZXhjbHVkZWQyJDMiLCJfZXhjbHVkZWQzJDIiLCJfZXhjbHVkZWQ0JDEiLCJfZXhjbHVkZWQ1IiwiRG93bnNoaWZ0IiwiX0NvbXBvbmVudCIsIl9wcm9wcyIsIl90aGlzIiwiaWQiLCJtZW51SWQiLCJsYWJlbElkIiwiaW5wdXRJZCIsImdldEl0ZW1JZCIsImlucHV0IiwiaXRlbXMiLCJ0aW1lb3V0SWRzIiwiaW50ZXJuYWxTZXRUaW1lb3V0IiwiZmlsdGVyIiwic2V0SXRlbUNvdW50IiwiY291bnQiLCJ1bnNldEl0ZW1Db3VudCIsInNldEhpZ2hsaWdodGVkSW5kZXgiLCJoaWdobGlnaHRlZEluZGV4Iiwib3RoZXJTdGF0ZVRvU2V0IiwiZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXgiLCJpbnRlcm5hbFNldFN0YXRlIiwiY2xlYXJTZWxlY3Rpb24iLCJzZWxlY3RlZEl0ZW0iLCJpbnB1dFZhbHVlIiwiZGVmYXVsdElzT3BlbiIsInNlbGVjdEl0ZW0iLCJpdGVtIiwiaXRlbVRvU3RyaW5nIiwic2VsZWN0SXRlbUF0SW5kZXgiLCJpdGVtSW5kZXgiLCJzZWxlY3RIaWdobGlnaHRlZEl0ZW0iLCJzdGF0ZVRvU2V0IiwiaXNJdGVtU2VsZWN0ZWQiLCJvbkNoYW5nZUFyZyIsIm9uU3RhdGVDaGFuZ2VBcmciLCJpc1N0YXRlVG9TZXRGdW5jdGlvbiIsIm9uSW5wdXRWYWx1ZUNoYW5nZSIsImdldFN0YXRlQW5kSGVscGVycyIsInNldFN0YXRlIiwibmV3U3RhdGVUb1NldCIsInN0YXRlUmVkdWNlciIsIm5leHRTdGF0ZSIsImhhc01vcmVTdGF0ZVRoYW5UeXBlIiwib25TdGF0ZUNoYW5nZSIsIm9uU2VsZWN0Iiwib25DaGFuZ2UiLCJvblVzZXJBY3Rpb24iLCJyb290UmVmIiwiX3Jvb3ROb2RlIiwiZ2V0Um9vdFByb3BzIiwiX3RlbXAiLCJfdGVtcDIiLCJfZXh0ZW5kczIiLCJfcmVmJHJlZktleSIsInJlZktleSIsInJlc3QiLCJfcmVmMiRzdXBwcmVzc1JlZkVycm8iLCJzdXBwcmVzc1JlZkVycm9yIiwiY2FsbGVkIiwiX3RoaXMkZ2V0U3RhdGUiLCJyb2xlIiwia2V5RG93bkhhbmRsZXJzIiwiQXJyb3dEb3duIiwiX3RoaXMyIiwicHJldmVudERlZmF1bHQiLCJhbW91bnQiLCJzaGlmdEtleSIsIm1vdmVIaWdobGlnaHRlZEluZGV4IiwiZ2V0SXRlbUNvdW50IiwiX3RoaXMyJGdldFN0YXRlIiwibmV4dEhpZ2hsaWdodGVkSW5kZXgiLCJBcnJvd1VwIiwiX3RoaXMzIiwiX3RoaXMzJGdldFN0YXRlIiwiRW50ZXIiLCJ3aGljaCIsIl90aGlzJGdldFN0YXRlMiIsIml0ZW1Ob2RlIiwiRXNjYXBlIiwicmVzZXQiLCJidXR0b25LZXlEb3duSGFuZGxlcnMiLCJfIiwidG9nZ2xlTWVudSIsImlucHV0S2V5RG93bkhhbmRsZXJzIiwiSG9tZSIsIl90aGlzNCIsIl90aGlzJGdldFN0YXRlMyIsIm5ld0hpZ2hsaWdodGVkSW5kZXgiLCJFbmQiLCJfdGhpczUiLCJfdGhpcyRnZXRTdGF0ZTQiLCJnZXRUb2dnbGVCdXR0b25Qcm9wcyIsIl90ZW1wMyIsIl9yZWYzIiwib25DbGljayIsIm9uUHJlc3MiLCJvbktleURvd24iLCJvbktleVVwIiwib25CbHVyIiwiX3RoaXMkZ2V0U3RhdGU1IiwiZW5hYmxlZEV2ZW50SGFuZGxlcnMiLCJidXR0b25IYW5kbGVDbGljayIsImJ1dHRvbkhhbmRsZUtleURvd24iLCJidXR0b25IYW5kbGVLZXlVcCIsImJ1dHRvbkhhbmRsZUJsdXIiLCJldmVudEhhbmRsZXJzIiwiZGlzYWJsZWQiLCJmb2N1cyIsImJsdXJUYXJnZXQiLCJpc01vdXNlRG93biIsImdldExhYmVsUHJvcHMiLCJodG1sRm9yIiwiZ2V0SW5wdXRQcm9wcyIsIl90ZW1wNCIsIl9yZWY0Iiwib25JbnB1dCIsIm9uQ2hhbmdlVGV4dCIsIm9uQ2hhbmdlS2V5IiwiX3RoaXMkZ2V0U3RhdGU2IiwiX2V2ZW50SGFuZGxlcnMiLCJpbnB1dEhhbmRsZUNoYW5nZSIsImlucHV0SGFuZGxlS2V5RG93biIsImlucHV0SGFuZGxlQmx1ciIsImF1dG9Db21wbGV0ZSIsImRvd25zaGlmdEJ1dHRvbklzQWN0aXZlIiwiZGF0YXNldCIsInRvZ2dsZSIsIm1lbnVSZWYiLCJfbWVudU5vZGUiLCJnZXRNZW51UHJvcHMiLCJfdGVtcDUiLCJfdGVtcDYiLCJfZXh0ZW5kczMiLCJfcmVmNSIsIl9yZWY1JHJlZktleSIsIl9yZWY2IiwiX3JlZjYkc3VwcHJlc3NSZWZFcnJvIiwiZ2V0SXRlbVByb3BzIiwiX3RlbXA3IiwiX2VuYWJsZWRFdmVudEhhbmRsZXJzIiwiX3JlZjciLCJvbk1vdXNlTW92ZSIsIm9uTW91c2VEb3duIiwiX3JlZjckaXRlbSIsIm9uU2VsZWN0S2V5IiwiY3VzdG9tQ2xpY2tIYW5kbGVyIiwiYXZvaWRTY3JvbGxpbmciLCJjbGVhckl0ZW1zIiwiX3JlZjgiLCJfcmVmOSIsIl90aGlzJGdldFN0YXRlNyIsIm9wZW5NZW51IiwiY2xvc2VNZW51IiwidXBkYXRlU3RhdHVzIiwiZ2V0QTExeVN0YXR1c01lc3NhZ2UiLCJoaWdobGlnaHRlZEl0ZW0iLCJfdGhpcyRwcm9wcyIsIl90aGlzJHByb3BzJGluaXRpYWxIaSIsImluaXRpYWxIaWdobGlnaHRlZEluZGV4IiwiX2hpZ2hsaWdodGVkSW5kZXgiLCJfdGhpcyRwcm9wcyRpbml0aWFsSXMiLCJpbml0aWFsSXNPcGVuIiwiX2lzT3BlbiIsIl90aGlzJHByb3BzJGluaXRpYWxJbiIsImluaXRpYWxJbnB1dFZhbHVlIiwiX2lucHV0VmFsdWUiLCJfdGhpcyRwcm9wcyRpbml0aWFsU2UiLCJpbml0aWFsU2VsZWN0ZWRJdGVtIiwiX3NlbGVjdGVkSXRlbSIsIl9zdGF0ZSIsIl9wcm90byIsImludGVybmFsQ2xlYXJUaW1lb3V0cyIsImdldFN0YXRlJDEiLCJzdGF0ZVRvTWVyZ2UiLCJzY3JvbGxIaWdobGlnaHRlZEl0ZW1JbnRvVmlldyIsIl90aGlzNiIsIl90aGlzJGdldFN0YXRlOCIsIl90aGlzJGdldFN0YXRlOSIsImNvbXBvbmVudERpZE1vdW50IiwiX3RoaXM3IiwidmFsaWRhdGVHZXRNZW51UHJvcHNDYWxsZWRDb3JyZWN0bHkiLCJvbk1vdXNlVXAiLCJjb250ZXh0V2l0aGluRG93bnNoaWZ0Iiwib25PdXRlckNsaWNrIiwib25Ub3VjaFN0YXJ0IiwiaXNUb3VjaE1vdmUiLCJvblRvdWNoTW92ZSIsIm9uVG91Y2hFbmQiLCJhZGRFdmVudExpc3RlbmVyIiwiY2xlYW51cCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJzaG91bGRTY3JvbGwiLCJfcmVmMTAiLCJjdXJyZW50SGlnaGxpZ2h0ZWRJbmRleCIsIl9yZWYxMSIsInByZXZIaWdobGlnaHRlZEluZGV4Iiwic2Nyb2xsV2hlbk9wZW4iLCJzY3JvbGxXaGVuTmF2aWdhdGluZyIsImNvbXBvbmVudERpZFVwZGF0ZSIsInNlbGVjdGVkSXRlbUNoYW5nZWQiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbmRlciIsImNoaWxkcmVuIiwidmFsaWRhdGVHZXRSb290UHJvcHNDYWxsZWRDb3JyZWN0bHkiLCJjbG9uZUVsZW1lbnQiLCJDb21wb25lbnQiLCJkZWZhdWx0UHJvcHMiLCJ3YXJuIiwicHJldkl0ZW0iLCJzdGF0ZUNoYW5nZVR5cGVzIiwicHJvcFR5cGVzIiwiX3JlZjEyIiwiX3JlZjEzIiwicmVmS2V5U3BlY2lmaWVkIiwiaXNDb21wb3NpdGUiLCJfZXhjbHVkZWQkMyIsImRyb3Bkb3duRGVmYXVsdFN0YXRlVmFsdWVzIiwiY2FsbE9uQ2hhbmdlUHJvcHMiLCJhY3Rpb24iLCJuZXdTdGF0ZSIsImNoYW5nZXMiLCJpbnZva2VPbkNoYW5nZUhhbmRsZXIiLCJoYW5kbGVyIiwiY2FwaXRhbGl6ZVN0cmluZyIsImdldEExMXlTZWxlY3Rpb25NZXNzYWdlIiwic2VsZWN0aW9uUGFyYW1ldGVycyIsIml0ZW1Ub1N0cmluZ0xvY2FsIiwidXBkYXRlQTExeVN0YXR1cyIsImdldEExMXlNZXNzYWdlIiwidXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdCIsInVzZUxheW91dEVmZmVjdCIsInVzZUVmZmVjdCIsInVzZUVsZW1lbnRJZHMiLCJfcmVmJGlkIiwidG9nZ2xlQnV0dG9uSWQiLCJlbGVtZW50SWRzUmVmIiwidXNlUmVmIiwiZ2V0SXRlbUFuZEluZGV4IiwiaXRlbVByb3AiLCJpbmRleFByb3AiLCJlcnJvck1lc3NhZ2UiLCJ0b1VwcGVyQ2FzZSIsInVzZUxhdGVzdFJlZiIsInVzZUVuaGFuY2VkUmVkdWNlciIsInJlZHVjZXIiLCJpbml0aWFsU3RhdGUiLCJwcmV2U3RhdGVSZWYiLCJhY3Rpb25SZWYiLCJlbmhhbmNlZFJlZHVjZXIiLCJ1c2VDYWxsYmFjayIsIl91c2VSZWR1Y2VyIiwidXNlUmVkdWNlciIsImRpc3BhdGNoIiwicHJvcHNSZWYiLCJkaXNwYXRjaFdpdGhQcm9wcyIsImRlZmF1bHRQcm9wcyQzIiwiZ2V0RGVmYXVsdFZhbHVlJDEiLCJkZWZhdWx0U3RhdGVWYWx1ZXMiLCJnZXRJbml0aWFsVmFsdWUkMSIsImluaXRpYWxWYWx1ZSIsImdldEluaXRpYWxTdGF0ZSQyIiwiZ2V0SGlnaGxpZ2h0ZWRJbmRleE9uT3BlbiIsIm9mZnNldCIsInVzZU1vdXNlQW5kVG91Y2hUcmFja2VyIiwiZG93bnNoaWZ0RWxlbWVudFJlZnMiLCJoYW5kbGVCbHVyIiwibW91c2VBbmRUb3VjaFRyYWNrZXJzUmVmIiwidXNlR2V0dGVyUHJvcHNDYWxsZWRDaGVja2VyIiwiaXNJbml0aWFsTW91bnRSZWYiLCJwcm9wS2V5cyIsImdldHRlclByb3BzQ2FsbGVkUmVmIiwiYWNjIiwicHJvcENhbGxJbmZvIiwiZWxlbWVudFJlZiIsInNldEdldHRlclByb3BDYWxsSW5mbyIsInVzZUExMXlNZXNzYWdlU2V0dGVyIiwiZGVwZW5kZW5jeUFycmF5IiwiaXNJbml0aWFsTW91bnQiLCJ1c2VTY3JvbGxJbnRvVmlldyIsIml0ZW1SZWZzIiwibWVudUVsZW1lbnQiLCJzY3JvbGxJbnRvVmlld1Byb3AiLCJzaG91bGRTY3JvbGxSZWYiLCJ1c2VDb250cm9sUHJvcHNWYWxpZGF0b3IiLCJwcmV2UHJvcHNSZWYiLCJnZXRDaGFuZ2VzT25TZWxlY3Rpb24iLCJfcHJvcHMkaXRlbXMiLCJzaG91bGRTZWxlY3QiLCJkb3duc2hpZnRDb21tb25SZWR1Y2VyIiwiSXRlbU1vdXNlTW92ZSIsIk1lbnVNb3VzZUxlYXZlIiwiVG9nZ2xlQnV0dG9uQ2xpY2siLCJGdW5jdGlvblRvZ2dsZU1lbnUiLCJGdW5jdGlvbk9wZW5NZW51IiwiRnVuY3Rpb25DbG9zZU1lbnUiLCJGdW5jdGlvblNldEhpZ2hsaWdodGVkSW5kZXgiLCJGdW5jdGlvblNldElucHV0VmFsdWUiLCJGdW5jdGlvblJlc2V0IiwiZGVmYXVsdFNlbGVjdGVkSXRlbSIsIm9uU2VsZWN0ZWRJdGVtQ2hhbmdlIiwib25IaWdobGlnaHRlZEluZGV4Q2hhbmdlIiwib25Jc09wZW5DaGFuZ2UiLCJfYSIsIklucHV0S2V5RG93bkFycm93RG93biIsIklucHV0S2V5RG93bkFycm93VXAiLCJJbnB1dEtleURvd25Fc2NhcGUiLCJJbnB1dEtleURvd25Ib21lIiwiSW5wdXRLZXlEb3duRW5kIiwiSW5wdXRLZXlEb3duUGFnZVVwIiwiSW5wdXRLZXlEb3duUGFnZURvd24iLCJJbnB1dEtleURvd25FbnRlciIsIklucHV0Q2hhbmdlIiwiSW5wdXRCbHVyIiwiSW5wdXRGb2N1cyIsIkl0ZW1DbGljayIsIkZ1bmN0aW9uU2VsZWN0SXRlbSIsIkZ1bmN0aW9uUmVzZXQkMSIsIkNvbnRyb2xsZWRQcm9wVXBkYXRlZFNlbGVjdGVkSXRlbSIsInN0YXRlQ2hhbmdlVHlwZXMkMSIsImdldEluaXRpYWxTdGF0ZSQxIiwiZGVmYXVsdElucHV0VmFsdWUiLCJwcm9wVHlwZXMkMSIsInVzZUNvbnRyb2xsZWRSZWR1Y2VyIiwicHJldmlvdXNTZWxlY3RlZEl0ZW1SZWYiLCJfdXNlRW5oYW5jZWRSZWR1Y2VyIiwidmFsaWRhdGVQcm9wVHlwZXMkMSIsInZhbGlkYXRlUHJvcFR5cGVzIiwib3B0aW9ucyIsImNhbGxlciIsImRlZmF1bHRQcm9wcyQxIiwiZG93bnNoaWZ0VXNlQ29tYm9ib3hSZWR1Y2VyIiwiYWx0S2V5IiwiX2V4Y2x1ZGVkJDEiLCJfZXhjbHVkZWQyJDEiLCJfZXhjbHVkZWQzIiwiX2V4Y2x1ZGVkNCIsInVzZUNvbWJvYm94IiwidXNlclByb3BzIiwiX3VzZUNvbnRyb2xsZWRSZWR1Y2VyIiwiaW5wdXRSZWYiLCJ0b2dnbGVCdXR0b25SZWYiLCJlbGVtZW50SWRzIiwicHJldmlvdXNSZXN1bHRDb3VudFJlZiIsImxhdGVzdCIsImZvY3VzT25PcGVuIiwiX2Vudmlyb25tZW50JGRvY3VtZW50IiwiX2lucHV0UmVmJGN1cnJlbnQiLCJ1c2VNZW1vIiwibGF0ZXN0U3RhdGUiLCJQYWdlVXAiLCJQYWdlRG93biIsImxhYmVsUHJvcHMiLCJvbk1vdXNlTGVhdmUiLCJfcmVmMyRyZWZLZXkiLCJfbGF0ZXN0JGN1cnJlbnQiLCJsYXRlc3RQcm9wcyIsIl9nZXRJdGVtQW5kSW5kZXgiLCJpdGVtSGFuZGxlTW91c2VNb3ZlIiwiaXRlbUhhbmRsZUNsaWNrIiwiaXRlbUhhbmRsZU1vdXNlRG93biIsIl9leHRlbmRzNCIsInRvZ2dsZUJ1dHRvbkhhbmRsZUNsaWNrIiwidG9nZ2xlQnV0dG9uTm9kZSIsInRhYkluZGV4IiwiX2V4dGVuZHM1Iiwib25Gb2N1cyIsIl9yZWY2JHJlZktleSIsIl9yZWY3JHN1cHByZXNzUmVmRXJybyIsImlzQmx1ckJ5VGFiQ2hhbmdlIiwicmVsYXRlZFRhcmdldCIsImlucHV0SGFuZGxlRm9jdXMiLCJpbnB1dE5vZGUiLCJuZXdTZWxlY3RlZEl0ZW0iLCJzZXRJbnB1dFZhbHVlIiwibmV3SW5wdXRWYWx1ZSIsImdldEExMXlSZW1vdmFsTWVzc2FnZSIsInJlbW92ZWRTZWxlY3RlZEl0ZW0iLCJzZWxlY3RlZEl0ZW1zIiwiaW5pdGlhbFNlbGVjdGVkSXRlbXMiLCJkZWZhdWx0U2VsZWN0ZWRJdGVtcyIsImFjdGl2ZUluZGV4IiwiaW5pdGlhbEFjdGl2ZUluZGV4IiwiZGVmYXVsdEFjdGl2ZUluZGV4Iiwib25BY3RpdmVJbmRleENoYW5nZSIsIm9uU2VsZWN0ZWRJdGVtc0NoYW5nZSIsImtleU5hdmlnYXRpb25OZXh0Iiwia2V5TmF2aWdhdGlvblByZXZpb3VzIiwiZm9yd2FyZFJlZiIsIl9qc3hzIiwidXNlU3RhdGUiLCJzdHlsZUluamVjdCIsImNzcyIsImluc2VydEF0IiwiaGVhZCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiZmlyc3RDaGlsZCIsImluc2VydEJlZm9yZSIsInN0eWxlU2hlZXQiLCJjc3NUZXh0IiwiY3JlYXRlVGV4dE5vZGUiXSwibWFwcGluZ3MiOiI7Ozs7O1NBQWdCLFlBQVksR0FBQTtBQUN4QixJQUFBLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLE9BQU8sTUFBTSxDQUFDLFVBQVUsS0FBSyxVQUFVLEVBQUU7QUFDMUUsUUFBQSxPQUFPLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztLQUM5QjtBQUNELElBQUEsTUFBTSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakMsSUFBQSxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlCLElBQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxJQUFJLENBQUM7QUFDcEMsSUFBQSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFL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QUFDaUQsRUFBRSxJQUFJOUUsQ0FBQyxDQUFDUyxDQUFDLElBQUlvQixHQUFHLENBQUNrRCxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDM0QsQ0FBQzs7Ozs7Ozs7O0FDei9CRCxDQUFBLElBQUlLLFlBQVksR0FBRztHQUNsQixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLElBQUk7R0FDVCxHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLElBQUk7R0FDVCxHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsSUFBSTtHQUNULEdBQUcsRUFBRSxJQUFJO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsSUFBSTtHQUNULEdBQUcsRUFBRSxJQUFJO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLElBQUk7R0FDVCxHQUFHLEVBQUUsSUFBSTtHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsSUFBSTtHQUNULEdBQUcsRUFBRSxJQUFJO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFF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WUFBWSxFQUFFLEtBQUssQ0FBQyxhQUFhO0FBQ3BDLGFBQUE7QUFDSixTQUFBO1FBQ0QsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLFVBQVUsSUFDL0JBLGNBQUMsQ0FBQSxLQUFLLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFBLEVBQUMsT0FBTyxFQUFDLDBCQUEwQixFQUFBLFFBQUEsRUFDaEVBLGNBQU8sQ0FBQSxLQUFBLEVBQUEsRUFBQSxDQUFBLEVBQUEsQ0FDd0IsSUFDbkMsSUFBSTtRQUNSLFlBQVksRUFDUixLQUFLLENBQUMsVUFBVTtBQUNoQixhQUFDLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsS0FBSyxJQUFJLENBQUM7S0FDM0csQ0FBQzs7QUFHRixJQUFBLE1BQU0sUUFBUSxHQUFtQnNzQixhQUFPLENBQUMsTUFBSztBQUMxQyxRQUFBLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxRQUFRLEVBQUU7QUFDM0IsWUFBQSxPQUFPLElBQUkscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDM0M7QUFDRCxRQUFBLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxVQUFVLEVBQUU7QUFDN0IsWUFBQSxPQUFPLElBQUksdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDN0M7QUFDRCxRQUFBLE9BQU8sSUFBSSwwQkFBMEIsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqRCxLQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ1osSUFBQSxRQUNJdHNCLGNBQUssQ0FBQSxLQUFBLEVBQUEsRUFBQSxTQUFTLEVBQUMsd0VBQXdFLFlBQ25GQSxjQUFDLENBQUEsZUFBZSxFQUFDLEVBQUEsUUFBUSxFQUFFLFFBQVEsRUFBQSxHQUFNLFdBQVcsRUFBSSxDQUFBLEVBQUEsQ0FDdEQsRUFDUjtBQUNOOzs7OyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlsxLDIsMyw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDE4LDE5LDIwLDIxLDIyLDQyXX0=
