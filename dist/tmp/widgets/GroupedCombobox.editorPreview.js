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

const ComboboxWrapper = react.forwardRef((props, ref) => {
    const { isOpen, readOnly, readOnlyStyle, getToggleButtonProps, validation, children, isLoading, isMultiselectActive, errorId } = props;
    const { id, onClick } = getToggleButtonProps();
    return (jsxRuntime.jsxs(react.Fragment, { children: [jsxRuntime.jsxs("div", { ref: ref, tabIndex: -1, className: classNames("widget-combobox-input-container", {
                    "widget-combobox-input-container-active": isOpen,
                    "widget-combobox-input-container-disabled": readOnly,
                    "form-control-static": readOnly && readOnlyStyle === "text",
                    "form-control": !readOnly || readOnlyStyle !== "text",
                    "widget-combobox-multiselect": isMultiselectActive
                }), id: id, onClick: onClick, children: [children, readOnly && readOnlyStyle === "text" ? null : isLoading ? (jsxRuntime.jsx("div", { className: "widget-combobox-down-arrow", children: jsxRuntime.jsx(SpinnerLoader, { size: "small" }) })) : (jsxRuntime.jsx("div", { className: "widget-combobox-down-arrow", children: jsxRuntime.jsx(DownArrow, { isOpen: isOpen }) }))] }), validation && jsxRuntime.jsx(ValidationAlert, { id: errorId, children: validation })] }));
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
    return (jsxRuntime.jsxs("div", { ref: ref, className: classNames("widget-combobox-menu", { "widget-combobox-menu-hidden": !isOpen }), style: alwaysOpen
            ? {
                display: "block",
                visibility: "visible",
                position: "relative"
            }
            : style, children: [menuHeaderContent && (jsxRuntime.jsx("div", { className: "widget-combobox-menu-header widget-combobox-item", onMouseDown: PreventMenuCloseEventHandler, children: menuHeaderContent })), jsxRuntime.jsxs("ul", { className: classNames("widget-combobox-menu-list", {
                    "widget-combobox-menu-highlighted": (highlightedIndex ?? -1) >= 0,
                    "widget-combobox-menu-lazy-scroll": lazyLoading && !isEmpty
                }), ...getMenuProps?.({
                    onClick: onOptionClick,
                    onMouseDown: ForcePreventMenuCloseEventHandler,
                    onScroll
                }, { suppressRefError: true }), children: [isOpen ? (isEmpty && !isLoading ? (jsxRuntime.jsx(NoOptionsPlaceholder, { children: noOptionsText })) : (children)) : null, loader] }), menuFooterContent && (jsxRuntime.jsx("div", { className: "widget-combobox-menu-footer", onMouseDown: PreventMenuCloseEventHandler, children: menuFooterContent }))] }));
}

function ComboboxOptionWrapper(props) {
    const { children, isSelected, isHighlighted, item, getItemProps, index } = props;
    return (jsxRuntime.jsx("li", { className: classNames("widget-combobox-item", {
            "widget-combobox-item-selected": isSelected,
            "widget-combobox-item-highlighted": isHighlighted
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
    return (jsxRuntime.jsx("li", { className: classNames("widget-combobox-group-header"), "aria-disabled": "true", role: "separator", "aria-label": title, onMouseDown: e => e.preventDefault(), children: jsxRuntime.jsx("span", { className: "widget-combobox-group-header-text", children: title }) }));
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
                        !(selector.selectorType === "static" && selector.attributeType === "boolean") && (jsxRuntime.jsx("button", { tabIndex: tabIndex, className: "widget-combobox-clear-button", "aria-label": a11yConfig.ariaLabels?.clearSelection, onClick: e => {
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

var css_248z = ".widget-combobox {\n  min-width: 0;\n  flex-grow: 1;\n  position: relative;\n  transition: color 150ms ease 0s;\n}\n.widget-combobox-menu {\n  position: absolute;\n  display: inline;\n  border-radius: var(--dropdown-border-radius, 12px);\n  margin: var(--spacing-smaller, 4px) 0 var(--spacing-smaller, 4px) 0;\n  width: 100%;\n  left: unset;\n  padding: var(--dropdown-outer-padding, 10px) 0 0;\n  z-index: 25;\n  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.12);\n  background-color: var(--label-info-color, #ffffff);\n  list-style-type: none;\n  overflow: hidden;\n}\n.widget-combobox-menu-list {\n  padding: 0;\n  margin-bottom: 0;\n  max-height: 320px;\n  overflow-y: auto;\n}\n.widget-combobox-menu-list:last-child {\n  margin-bottom: var(--dropdown-outer-padding, 10px);\n}\n.widget-combobox-menu-lazy-scroll {\n  background: linear-gradient(white 30%, rgba(255, 255, 255, 0)) center top, linear-gradient(rgba(255, 255, 255, 0), white 70%) center bottom, linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(197, 197, 197, 0.6)) center top, linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(197, 197, 197, 0.6)) center bottom;\n  background-repeat: no-repeat;\n  background-size: 100% 70px, 100% 70px, 100% 35px, 100% 35px;\n  background-attachment: local, local, scroll, scroll;\n}\n.widget-combobox-menu-hidden {\n  display: none;\n}\n.widget-combobox-menu-header {\n  padding: 12px 16px 10px;\n  background-color: #ffffff;\n  border-bottom: 1px solid #e9e9ee;\n  width: 100%;\n  box-sizing: border-box;\n  display: block;\n}\n.widget-combobox-menu-header:focus, .widget-combobox-menu-header:focus-within, .widget-combobox-menu-header:hover {\n  background-color: #ffffff;\n}\n.widget-combobox-menu-header-title {\n  display: block;\n  width: 100%;\n  margin: 0;\n  padding-bottom: 8px;\n  border-bottom: 1px solid #dfe3ea;\n  color: #1f2430;\n  font-size: 16px;\n  font-weight: 700;\n  line-height: 1.2;\n}\n.widget-combobox-menu-header-select-all-button + label {\n  transition: color 0.2s ease-in-out;\n}\n.widget-combobox-menu-header-select-all-button-disabled + label {\n  color: var(--color-default-dark, #6c7180);\n}\n.widget-combobox-menu-footer {\n  border-top: 1px solid var(--gray-primary, #ced0d3);\n  padding: var(--dropdown-outer-padding, 10px);\n}\n.widget-combobox-menu-footer:focus, .widget-combobox-menu-footer:focus-within {\n  outline: 1px solid var(--brand-primary, #264ae5);\n}\n.widget-combobox-item {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  align-content: center;\n  align-items: center;\n  cursor: pointer;\n  user-select: none;\n  padding: 12px 16px;\n  height: fit-content;\n  overflow: hidden;\n  color: #3b4251;\n  font-size: 14px;\n  font-weight: 400;\n  background-color: #ffffff;\n  transition: background-color 0.15s ease, color 0.15s ease;\n}\n.widget-combobox-item-selected {\n  background-color: #f5f6f6;\n}\n.widget-combobox-item-highlighted, .widget-combobox-item:focus, .widget-combobox-item:hover {\n  background-color: rgba(248, 214, 224, 0.22);\n}\n.widget-combobox-item > .widget-combobox-icon-container {\n  margin-inline-end: var(--dropdown-outer-padding, 10px);\n}\n.widget-combobox-item > .widget-combobox-icon-container input[type=checkbox] {\n  width: 18px;\n  height: 18px;\n  cursor: pointer;\n  accent-color: #8b1a4a;\n}\n.widget-combobox-item .widget-combobox-caption-text {\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n  flex: 1;\n  font-weight: normal;\n  margin: 0;\n  min-height: 20px;\n}\n.widget-combobox-item.widget-combobox-no-options {\n  justify-content: center;\n}\n.widget-combobox-group-header {\n  display: flex;\n  align-items: center;\n  padding: 10px 16px;\n  margin: 0;\n  cursor: default;\n  user-select: none;\n  pointer-events: none;\n  list-style: none;\n  background-color: #ffffff;\n  position: relative;\n}\n.widget-combobox-group-header::after {\n  content: \"\";\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: 1px;\n  background-color: #d0d4dc;\n  display: block !important;\n  z-index: 1;\n  pointer-events: none;\n}\n.widget-combobox-group-header-text {\n  font-size: 17px;\n  font-weight: 700;\n  color: #1f2430;\n  line-height: 1.4;\n}\n.widget-combobox .widget-combobox-menu-list > .widget-combobox-group-header ~ .widget-combobox-group-header {\n  margin-top: 6px;\n}\n.widget-combobox .widget-combobox-input-container {\n  flex-grow: 1;\n  transition: box-shadow 150ms ease 0s;\n  display: flex;\n  align-items: center;\n  min-height: 44px;\n  padding: 6px 12px;\n  border: 1px solid #d9dde5;\n  border-radius: 12px;\n  background-color: #ffffff;\n  gap: 6px;\n}\n.widget-combobox .widget-combobox-input-container:focus-within {\n  border-color: var(--brand-primary, #264ae5);\n  box-shadow: 0 0 0 2px rgba(38, 74, 229, 0.12);\n}\n.widget-combobox .widget-combobox-input-container-disabled {\n  background-color: var(--gray-lighter, #f8f8f8);\n  pointer-events: none !important;\n}\n.widget-combobox .widget-combobox-input-container-disabled.form-control-static {\n  background-color: transparent;\n}\n.widget-combobox .widget-combobox-multiselect:not(.widget-combobox-input-container-active) .widget-combobox-input {\n  width: 0;\n  min-width: 0;\n  padding: 0;\n}\n.widget-combobox-input {\n  color: var(--cb-text-color, var(--gray-dark, #606671));\n  flex-grow: 1;\n  border: none;\n  padding: 0;\n  min-width: 0;\n  background: transparent;\n  outline: none;\n}\n.widget-combobox-input-nofilter, .widget-combobox-input:placeholder-shown:not(:focus) {\n  max-width: 0;\n  min-width: 0;\n  width: 0;\n  padding: 0;\n}\n.widget-combobox-input:focus {\n  max-width: unset;\n  min-width: 4px;\n  width: auto;\n  flex-grow: 1;\n}\n.widget-combobox-input:placeholder-shown:focus:not(.widget-combobox-input-nofilter):has(+ .widget-combobox-placeholder-empty) {\n  max-width: 3px;\n  margin-right: -3px;\n  background: transparent;\n}\n.widget-combobox-selected-items {\n  min-width: 0;\n  display: flex;\n  flex-grow: 1;\n  position: relative;\n  align-items: center;\n  gap: 6px;\n  flex-wrap: nowrap;\n  overflow: hidden;\n}\n.widget-combobox-selected-items.widget-combobox-boxes {\n  flex-wrap: wrap;\n  margin: 0;\n  padding: 0;\n  align-items: center;\n}\n.widget-combobox-selected-items.widget-combobox-boxes .widget-combobox-input-nofilter {\n  width: 0;\n  min-width: 0;\n  padding: 0;\n}\n.widget-combobox-selected-items.widget-combobox-text {\n  flex-wrap: nowrap;\n}\n.widget-combobox-selected-items.widget-combobox-text [class*=widget-combobox-placeholder-] {\n  padding-left: 0;\n}\n.widget-combobox-selected-items [class*=widget-combobox-placeholder-] {\n  display: none;\n}\n.widget-combobox-selected-items input:placeholder-shown:not(:focus) + [class*=widget-combobox-placeholder-] {\n  display: initial;\n  text-overflow: ellipsis;\n  align-items: center;\n}\n.widget-combobox-selected-item {\n  color: #3b4251;\n  font-size: 13px;\n  line-height: 1.4;\n  display: inline-flex;\n  border-radius: 26px;\n  justify-content: center;\n  padding: 4px 12px;\n  flex-wrap: nowrap;\n  align-items: center;\n  margin: 2px;\n  gap: 6px;\n  background-color: #e6eaff;\n  max-width: 100%;\n  white-space: nowrap;\n}\n.widget-combobox-selected-item-remove-button {\n  padding: 0;\n  border: none;\n  background-color: transparent;\n  cursor: pointer;\n  color: #3b4251;\n  display: flex;\n  align-items: center;\n}\n.widget-combobox-selected-item-remove-button span {\n  display: flex;\n  align-items: center;\n}\n.widget-combobox-selected-item:focus-visible {\n  outline: var(--brand-primary, #264ae5) auto 1px;\n}\n.widget-combobox-down-arrow {\n  display: flex;\n  flex-wrap: wrap;\n  align-content: center;\n  cursor: pointer;\n  padding-inline-start: var(--spacing-smaller, 4px);\n  flex-shrink: 0;\n}\n.widget-combobox-icon-container {\n  display: flex;\n  padding-top: 1px;\n}\n/*# sourceMappingURL=inline */\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvUHJhdGhpc2hrdW1hclRoaXlhZ2EvRG93bmxvYWRzL0NvbWJvYm94LXdlYiUyMCgyKSUyMCgxKS9Db21ib2JveC13ZWIvc3JjL3VpL0dyb3VwZWRDb21ib2JveC5zY3NzIiwiR3JvdXBlZENvbWJvYm94LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBcUJBO0VBQ0ksWUFBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtFQUNBLCtCQUFBO0FDcEJKO0FEc0JJO0VBQ0ksa0JBQUE7RUFDQSxlQUFBO0VBQ0Esa0RBQUE7RUFDQSxtRUFBQTtFQUNBLFdBQUE7RUFDQSxXQUFBO0VBQ0EsZ0RBQUE7RUFDQSxXQUFBO0VBQ0EsNENBQUE7RUFDQSxrREFBQTtFQUNBLHFCQUFBO0VBQ0EsZ0JBQUE7QUNwQlI7QURzQlE7RUFDSSxVQUFBO0VBQ0EsZ0JBQUE7RUFDQSxpQkFBQTtFQUNBLGdCQUFBO0FDcEJaO0FEc0JZO0VBQ0ksa0RBQUE7QUNwQmhCO0FEd0JRO0VBQ0ksNFRBQ0k7RUFLSiw0QkFBQTtFQUNBLDJEQUNJO0VBSUosbURBQUE7QUMvQlo7QURrQ1E7RUFDSSxhQUFBO0FDaENaO0FEbUNRO0VBQ0ksdUJBQUE7RUFDQSx5QkFBQTtFQUNBLGdDQUFBO0VBQ0EsV0FBQTtFQUNBLHNCQUFBO0VBQ0EsY0FBQTtBQ2pDWjtBRG1DWTtFQUdJLHlCQUFBO0FDbkNoQjtBRHNDWTtFQUNJLGNBQUE7RUFDQSxXQUFBO0VBQ0EsU0FBQTtFQUNBLG1CQUFBO0VBQ0EsZ0NBQUE7RUFDQSxjQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsZ0JBQUE7QUNwQ2hCO0FEd0NnQjtFQUNJLGtDQUFBO0FDdENwQjtBRHlDZ0I7RUFDSSx5Q0FBQTtBQ3ZDcEI7QUQ0Q1E7RUFDSSxrREFBQTtFQUNBLDRDQUFBO0FDMUNaO0FENENZO0VBRUksZ0RBQUE7QUMzQ2hCO0FEZ0RJO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsaUJBQUE7RUFDQSxxQkFB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 */";
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
    return (jsxRuntime.jsx("div", { className: "widget-combobox widget-combobox-editor-preview", children: jsxRuntime.jsx(SingleSelection, { selector: selector, ...commonProps }) }));
};

exports.preview = preview;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXBlZENvbWJvYm94LmVkaXRvclByZXZpZXcuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zaGltcy93aWRnZXQtcGx1Z2luLXBsYXRmb3JtL2ZyYW1ld29yay9nZW5lcmF0ZS11dWlkLnRzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NsYXNzbmFtZXMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYmlnLmpzL2JpZy5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtb3ZlLWFjY2VudHMvaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvaGVscGVycy91dGlscy50cyIsIi4uLy4uLy4uL3NyYy9hc3NldHMvaWNvbnMudHN4IiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vZXh0ZW5kcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vc2V0UHJvdG90eXBlT2YuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vaW5oZXJpdHNMb29zZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL25vZGVfbW9kdWxlcy9yZWFjdC1pcy9janMvcmVhY3QtaXMuZGV2ZWxvcG1lbnQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9ub2RlX21vZHVsZXMvcmVhY3QtaXMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2xpYi9oYXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9jaGVja1Byb3BUeXBlcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtaXMvY2pzL3JlYWN0LWlzLmRldmVsb3BtZW50LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWlzL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9kb3duc2hpZnQvZGlzdC9kb3duc2hpZnQuZXNtLmpzIiwiLi4vLi4vLi4vc3JjL2hvb2tzL3VzZURvd25zaGlmdFNpbmdsZVNlbGVjdFByb3BzLnRzIiwiLi4vLi4vLi4vc3JjL3NoaW1zL3dpZGdldC1wbHVnaW4tZ3JpZC9jb21wb25lbnRzL0luZmluaXRlQm9keS50cyIsIi4uLy4uLy4uL3NyYy9ob29rcy91c2VMYXp5TG9hZGluZy50cyIsIi4uLy4uLy4uL3NyYy9zaGltcy93aWRnZXQtcGx1Z2luLWNvbXBvbmVudC1raXQvQWxlcnQudHN4IiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvU3Bpbm5lckxvYWRlci50c3giLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9Db21ib2JveFdyYXBwZXIudHN4IiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvUGxhY2Vob2xkZXIudHN4IiwiLi4vLi4vLi4vc3JjL2hlbHBlcnMvZ3JvdXBpbmdVdGlscy50cyIsIi4uLy4uLy4uL3NyYy9zaGltcy93aWRnZXQtcGx1Z2luLWhvb2tzL3VzZVBvc2l0aW9uT2JzZXJ2ZXIudHMiLCIuLi8uLi8uLi9zcmMvc2hpbXMvd2lkZ2V0LXBsdWdpbi1wbGF0Zm9ybS91dGlscy9kZWJvdW5jZS50cyIsIi4uLy4uLy4uL3NyYy9ob29rcy91c2VNZW51U3R5bGUudHMiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9Db21ib2JveE1lbnVXcmFwcGVyLnRzeCIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0NvbWJvYm94T3B0aW9uV3JhcHBlci50c3giLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9Db21ib2JveEdyb3VwSGVhZGVyLnRzeCIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1NrZWxldG9uTG9hZGVyLnRzeCIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0xvYWRlci50c3giLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9TaW5nbGVTZWxlY3Rpb24vU2luZ2xlU2VsZWN0aW9uTWVudS50c3giLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9TaW5nbGVTZWxlY3Rpb24vU2luZ2xlU2VsZWN0aW9uLnRzeCIsIi4uLy4uLy4uL3NyYy9zaGltcy93aWRnZXQtcGx1Z2luLXRlc3QtdXRpbHMvaW5kZXgudHMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtaW5qZWN0L2Rpc3Qvc3R5bGUtaW5qZWN0LmVzLmpzIiwiLi4vLi4vLi4vc3JjL2hlbHBlcnMvQXNzb2NpYXRpb24vQXNzb2NpYXRpb25TaW1wbGVDYXB0aW9uc1Byb3ZpZGVyLnRzeCIsIi4uLy4uLy4uL3NyYy9oZWxwZXJzL0Fzc29jaWF0aW9uL1ByZXZpZXcvQXNzb2NpYXRpb25QcmV2aWV3Q2FwdGlvbnNQcm92aWRlci50c3giLCIuLi8uLi8uLi9zcmMvaGVscGVycy9Bc3NvY2lhdGlvbi9QcmV2aWV3L0Fzc29jaWF0aW9uUHJldmlld09wdGlvbnNQcm92aWRlci50cyIsIi4uLy4uLy4uL3NyYy9oZWxwZXJzL0Fzc29jaWF0aW9uL1ByZXZpZXcvQXNzb2NpYXRpb25QcmV2aWV3U2VsZWN0b3IudHMiLCIuLi8uLi8uLi9zcmMvaGVscGVycy9TdGF0aWMvUHJldmlldy9TdGF0aWNQcmV2aWV3Q2FwdGlvbnNQcm92aWRlci50c3giLCIuLi8uLi8uLi9zcmMvaGVscGVycy9TdGF0aWMvUHJldmlldy9TdGF0aWNQcmV2aWV3T3B0aW9uc1Byb3ZpZGVyLnRzIiwiLi4vLi4vLi4vc3JjL2hlbHBlcnMvU3RhdGljL1ByZXZpZXcvU3RhdGljUHJldmlld1NlbGVjdG9yLnRzIiwiLi4vLi4vLi4vc3JjL2hlbHBlcnMvRGF0YWJhc2UvUHJldmlldy9EYXRhYmFzZVByZXZpZXdTZWxlY3Rvci50cyIsIi4uLy4uLy4uL3NyYy9Hcm91cGVkQ29tYm9ib3guZWRpdG9yUHJldmlldy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlVVVJRCgpOiBzdHJpbmcge1xuICAgIGlmICh0eXBlb2YgY3J5cHRvICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBjcnlwdG8ucmFuZG9tVVVJRCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBjcnlwdG8ucmFuZG9tVVVJRCgpO1xuICAgIH1cbiAgICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KDE2KTtcbiAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ5dGVzKTtcbiAgICBieXRlc1s2XSA9IChieXRlc1s2XSAmIDB4MGYpIHwgMHg0MDtcbiAgICBieXRlc1s4XSA9IChieXRlc1s4XSAmIDB4M2YpIHwgMHg4MDtcbiAgICBjb25zdCBoZXggPSBBcnJheS5mcm9tKGJ5dGVzLCBiID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsIFwiMFwiKSkuam9pbihcIlwiKTtcbiAgICByZXR1cm4gYCR7aGV4LnNsaWNlKDAsIDgpfS0ke2hleC5zbGljZSg4LCAxMil9LSR7aGV4LnNsaWNlKDEyLCAxNil9LSR7aGV4LnNsaWNlKDE2LCAyMCl9LSR7aGV4LnNsaWNlKDIwKX1gO1xufVxuIiwiLyohXG5cdENvcHlyaWdodCAoYykgMjAxOCBKZWQgV2F0c29uLlxuXHRMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKE1JVCksIHNlZVxuXHRodHRwOi8vamVkd2F0c29uLmdpdGh1Yi5pby9jbGFzc25hbWVzXG4qL1xuLyogZ2xvYmFsIGRlZmluZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGhhc093biA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5cdGZ1bmN0aW9uIGNsYXNzTmFtZXMgKCkge1xuXHRcdHZhciBjbGFzc2VzID0gJyc7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGFyZyA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdGlmIChhcmcpIHtcblx0XHRcdFx0Y2xhc3NlcyA9IGFwcGVuZENsYXNzKGNsYXNzZXMsIHBhcnNlVmFsdWUoYXJnKSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsYXNzZXM7XG5cdH1cblxuXHRmdW5jdGlvbiBwYXJzZVZhbHVlIChhcmcpIHtcblx0XHRpZiAodHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcblx0XHRcdHJldHVybiBhcmc7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBhcmcgIT09ICdvYmplY3QnKSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuXHRcdFx0cmV0dXJuIGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKTtcblx0XHR9XG5cblx0XHRpZiAoYXJnLnRvU3RyaW5nICE9PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nICYmICFhcmcudG9TdHJpbmcudG9TdHJpbmcoKS5pbmNsdWRlcygnW25hdGl2ZSBjb2RlXScpKSB7XG5cdFx0XHRyZXR1cm4gYXJnLnRvU3RyaW5nKCk7XG5cdFx0fVxuXG5cdFx0dmFyIGNsYXNzZXMgPSAnJztcblxuXHRcdGZvciAodmFyIGtleSBpbiBhcmcpIHtcblx0XHRcdGlmIChoYXNPd24uY2FsbChhcmcsIGtleSkgJiYgYXJnW2tleV0pIHtcblx0XHRcdFx0Y2xhc3NlcyA9IGFwcGVuZENsYXNzKGNsYXNzZXMsIGtleSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsYXNzZXM7XG5cdH1cblxuXHRmdW5jdGlvbiBhcHBlbmRDbGFzcyAodmFsdWUsIG5ld0NsYXNzKSB7XG5cdFx0aWYgKCFuZXdDbGFzcykge1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH1cblx0XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gdmFsdWUgKyAnICcgKyBuZXdDbGFzcztcblx0XHR9XG5cdFxuXHRcdHJldHVybiB2YWx1ZSArIG5ld0NsYXNzO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0Y2xhc3NOYW1lcy5kZWZhdWx0ID0gY2xhc3NOYW1lcztcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGNsYXNzTmFtZXM7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIHJlZ2lzdGVyIGFzICdjbGFzc25hbWVzJywgY29uc2lzdGVudCB3aXRoIG5wbSBwYWNrYWdlIG5hbWVcblx0XHRkZWZpbmUoJ2NsYXNzbmFtZXMnLCBbXSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGNsYXNzTmFtZXM7XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0d2luZG93LmNsYXNzTmFtZXMgPSBjbGFzc05hbWVzO1xuXHR9XG59KCkpO1xuIiwiLypcclxuICogIGJpZy5qcyB2Ni4yLjJcclxuICogIEEgc21hbGwsIGZhc3QsIGVhc3ktdG8tdXNlIGxpYnJhcnkgZm9yIGFyYml0cmFyeS1wcmVjaXNpb24gZGVjaW1hbCBhcml0aG1ldGljLlxyXG4gKiAgQ29weXJpZ2h0IChjKSAyMDI0IE1pY2hhZWwgTWNsYXVnaGxpblxyXG4gKiAgaHR0cHM6Ly9naXRodWIuY29tL01pa2VNY2wvYmlnLmpzL0xJQ0VOQ0UubWRcclxuICovXHJcblxyXG5cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqIEVESVRBQkxFIERFRkFVTFRTICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuXHJcbiAgLy8gVGhlIGRlZmF1bHQgdmFsdWVzIGJlbG93IG11c3QgYmUgaW50ZWdlcnMgd2l0aGluIHRoZSBzdGF0ZWQgcmFuZ2VzLlxyXG5cclxuICAvKlxyXG4gICAqIFRoZSBtYXhpbXVtIG51bWJlciBvZiBkZWNpbWFsIHBsYWNlcyAoRFApIG9mIHRoZSByZXN1bHRzIG9mIG9wZXJhdGlvbnMgaW52b2x2aW5nIGRpdmlzaW9uOlxyXG4gICAqIGRpdiBhbmQgc3FydCwgYW5kIHBvdyB3aXRoIG5lZ2F0aXZlIGV4cG9uZW50cy5cclxuICAgKi9cclxudmFyIERQID0gMjAsICAgICAgICAgIC8vIDAgdG8gTUFYX0RQXHJcblxyXG4gIC8qXHJcbiAgICogVGhlIHJvdW5kaW5nIG1vZGUgKFJNKSB1c2VkIHdoZW4gcm91bmRpbmcgdG8gdGhlIGFib3ZlIGRlY2ltYWwgcGxhY2VzLlxyXG4gICAqXHJcbiAgICogIDAgIFRvd2FyZHMgemVybyAoaS5lLiB0cnVuY2F0ZSwgbm8gcm91bmRpbmcpLiAgICAgICAoUk9VTkRfRE9XTilcclxuICAgKiAgMSAgVG8gbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCByb3VuZCB1cC4gIChST1VORF9IQUxGX1VQKVxyXG4gICAqICAyICBUbyBuZWFyZXN0IG5laWdoYm91ci4gSWYgZXF1aWRpc3RhbnQsIHRvIGV2ZW4uICAgKFJPVU5EX0hBTEZfRVZFTilcclxuICAgKiAgMyAgQXdheSBmcm9tIHplcm8uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChST1VORF9VUClcclxuICAgKi9cclxuICBSTSA9IDEsICAgICAgICAgICAgIC8vIDAsIDEsIDIgb3IgM1xyXG5cclxuICAvLyBUaGUgbWF4aW11bSB2YWx1ZSBvZiBEUCBhbmQgQmlnLkRQLlxyXG4gIE1BWF9EUCA9IDFFNiwgICAgICAgLy8gMCB0byAxMDAwMDAwXHJcblxyXG4gIC8vIFRoZSBtYXhpbXVtIG1hZ25pdHVkZSBvZiB0aGUgZXhwb25lbnQgYXJndW1lbnQgdG8gdGhlIHBvdyBtZXRob2QuXHJcbiAgTUFYX1BPV0VSID0gMUU2LCAgICAvLyAxIHRvIDEwMDAwMDBcclxuXHJcbiAgLypcclxuICAgKiBUaGUgbmVnYXRpdmUgZXhwb25lbnQgKE5FKSBhdCBhbmQgYmVuZWF0aCB3aGljaCB0b1N0cmluZyByZXR1cm5zIGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAqIChKYXZhU2NyaXB0IG51bWJlcnM6IC03KVxyXG4gICAqIC0xMDAwMDAwIGlzIHRoZSBtaW5pbXVtIHJlY29tbWVuZGVkIGV4cG9uZW50IHZhbHVlIG9mIGEgQmlnLlxyXG4gICAqL1xyXG4gIE5FID0gLTcsICAgICAgICAgICAgLy8gMCB0byAtMTAwMDAwMFxyXG5cclxuICAvKlxyXG4gICAqIFRoZSBwb3NpdGl2ZSBleHBvbmVudCAoUEUpIGF0IGFuZCBhYm92ZSB3aGljaCB0b1N0cmluZyByZXR1cm5zIGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAqIChKYXZhU2NyaXB0IG51bWJlcnM6IDIxKVxyXG4gICAqIDEwMDAwMDAgaXMgdGhlIG1heGltdW0gcmVjb21tZW5kZWQgZXhwb25lbnQgdmFsdWUgb2YgYSBCaWcsIGJ1dCB0aGlzIGxpbWl0IGlzIG5vdCBlbmZvcmNlZC5cclxuICAgKi9cclxuICBQRSA9IDIxLCAgICAgICAgICAgIC8vIDAgdG8gMTAwMDAwMFxyXG5cclxuICAvKlxyXG4gICAqIFdoZW4gdHJ1ZSwgYW4gZXJyb3Igd2lsbCBiZSB0aHJvd24gaWYgYSBwcmltaXRpdmUgbnVtYmVyIGlzIHBhc3NlZCB0byB0aGUgQmlnIGNvbnN0cnVjdG9yLFxyXG4gICAqIG9yIGlmIHZhbHVlT2YgaXMgY2FsbGVkLCBvciBpZiB0b051bWJlciBpcyBjYWxsZWQgb24gYSBCaWcgd2hpY2ggY2Fubm90IGJlIGNvbnZlcnRlZCB0byBhXHJcbiAgICogcHJpbWl0aXZlIG51bWJlciB3aXRob3V0IGEgbG9zcyBvZiBwcmVjaXNpb24uXHJcbiAgICovXHJcbiAgU1RSSUNUID0gZmFsc2UsICAgICAvLyB0cnVlIG9yIGZhbHNlXHJcblxyXG5cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuXHJcbiAgLy8gRXJyb3IgbWVzc2FnZXMuXHJcbiAgTkFNRSA9ICdbYmlnLmpzXSAnLFxyXG4gIElOVkFMSUQgPSBOQU1FICsgJ0ludmFsaWQgJyxcclxuICBJTlZBTElEX0RQID0gSU5WQUxJRCArICdkZWNpbWFsIHBsYWNlcycsXHJcbiAgSU5WQUxJRF9STSA9IElOVkFMSUQgKyAncm91bmRpbmcgbW9kZScsXHJcbiAgRElWX0JZX1pFUk8gPSBOQU1FICsgJ0RpdmlzaW9uIGJ5IHplcm8nLFxyXG5cclxuICAvLyBUaGUgc2hhcmVkIHByb3RvdHlwZSBvYmplY3QuXHJcbiAgUCA9IHt9LFxyXG4gIFVOREVGSU5FRCA9IHZvaWQgMCxcclxuICBOVU1FUklDID0gL14tPyhcXGQrKFxcLlxcZCopP3xcXC5cXGQrKShlWystXT9cXGQrKT8kL2k7XHJcblxyXG5cclxuLypcclxuICogQ3JlYXRlIGFuZCByZXR1cm4gYSBCaWcgY29uc3RydWN0b3IuXHJcbiAqL1xyXG5mdW5jdGlvbiBfQmlnXygpIHtcclxuXHJcbiAgLypcclxuICAgKiBUaGUgQmlnIGNvbnN0cnVjdG9yIGFuZCBleHBvcnRlZCBmdW5jdGlvbi5cclxuICAgKiBDcmVhdGUgYW5kIHJldHVybiBhIG5ldyBpbnN0YW5jZSBvZiBhIEJpZyBudW1iZXIgb2JqZWN0LlxyXG4gICAqXHJcbiAgICogbiB7bnVtYmVyfHN0cmluZ3xCaWd9IEEgbnVtZXJpYyB2YWx1ZS5cclxuICAgKi9cclxuICBmdW5jdGlvbiBCaWcobikge1xyXG4gICAgdmFyIHggPSB0aGlzO1xyXG5cclxuICAgIC8vIEVuYWJsZSBjb25zdHJ1Y3RvciB1c2FnZSB3aXRob3V0IG5ldy5cclxuICAgIGlmICghKHggaW5zdGFuY2VvZiBCaWcpKSByZXR1cm4gbiA9PT0gVU5ERUZJTkVEID8gX0JpZ18oKSA6IG5ldyBCaWcobik7XHJcblxyXG4gICAgLy8gRHVwbGljYXRlLlxyXG4gICAgaWYgKG4gaW5zdGFuY2VvZiBCaWcpIHtcclxuICAgICAgeC5zID0gbi5zO1xyXG4gICAgICB4LmUgPSBuLmU7XHJcbiAgICAgIHguYyA9IG4uYy5zbGljZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHR5cGVvZiBuICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGlmIChCaWcuc3RyaWN0ID09PSB0cnVlICYmIHR5cGVvZiBuICE9PSAnYmlnaW50Jykge1xyXG4gICAgICAgICAgdGhyb3cgVHlwZUVycm9yKElOVkFMSUQgKyAndmFsdWUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE1pbnVzIHplcm8/XHJcbiAgICAgICAgbiA9IG4gPT09IDAgJiYgMSAvIG4gPCAwID8gJy0wJyA6IFN0cmluZyhuKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcGFyc2UoeCwgbik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmV0YWluIGEgcmVmZXJlbmNlIHRvIHRoaXMgQmlnIGNvbnN0cnVjdG9yLlxyXG4gICAgLy8gU2hhZG93IEJpZy5wcm90b3R5cGUuY29uc3RydWN0b3Igd2hpY2ggcG9pbnRzIHRvIE9iamVjdC5cclxuICAgIHguY29uc3RydWN0b3IgPSBCaWc7XHJcbiAgfVxyXG5cclxuICBCaWcucHJvdG90eXBlID0gUDtcclxuICBCaWcuRFAgPSBEUDtcclxuICBCaWcuUk0gPSBSTTtcclxuICBCaWcuTkUgPSBORTtcclxuICBCaWcuUEUgPSBQRTtcclxuICBCaWcuc3RyaWN0ID0gU1RSSUNUO1xyXG4gIEJpZy5yb3VuZERvd24gPSAwO1xyXG4gIEJpZy5yb3VuZEhhbGZVcCA9IDE7XHJcbiAgQmlnLnJvdW5kSGFsZkV2ZW4gPSAyO1xyXG4gIEJpZy5yb3VuZFVwID0gMztcclxuXHJcbiAgcmV0dXJuIEJpZztcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFBhcnNlIHRoZSBudW1iZXIgb3Igc3RyaW5nIHZhbHVlIHBhc3NlZCB0byBhIEJpZyBjb25zdHJ1Y3Rvci5cclxuICpcclxuICogeCB7QmlnfSBBIEJpZyBudW1iZXIgaW5zdGFuY2UuXHJcbiAqIG4ge251bWJlcnxzdHJpbmd9IEEgbnVtZXJpYyB2YWx1ZS5cclxuICovXHJcbmZ1bmN0aW9uIHBhcnNlKHgsIG4pIHtcclxuICB2YXIgZSwgaSwgbmw7XHJcblxyXG4gIGlmICghTlVNRVJJQy50ZXN0KG4pKSB7XHJcbiAgICB0aHJvdyBFcnJvcihJTlZBTElEICsgJ251bWJlcicpO1xyXG4gIH1cclxuXHJcbiAgLy8gRGV0ZXJtaW5lIHNpZ24uXHJcbiAgeC5zID0gbi5jaGFyQXQoMCkgPT0gJy0nID8gKG4gPSBuLnNsaWNlKDEpLCAtMSkgOiAxO1xyXG5cclxuICAvLyBEZWNpbWFsIHBvaW50P1xyXG4gIGlmICgoZSA9IG4uaW5kZXhPZignLicpKSA+IC0xKSBuID0gbi5yZXBsYWNlKCcuJywgJycpO1xyXG5cclxuICAvLyBFeHBvbmVudGlhbCBmb3JtP1xyXG4gIGlmICgoaSA9IG4uc2VhcmNoKC9lL2kpKSA+IDApIHtcclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgZXhwb25lbnQuXHJcbiAgICBpZiAoZSA8IDApIGUgPSBpO1xyXG4gICAgZSArPSArbi5zbGljZShpICsgMSk7XHJcbiAgICBuID0gbi5zdWJzdHJpbmcoMCwgaSk7XHJcbiAgfSBlbHNlIGlmIChlIDwgMCkge1xyXG5cclxuICAgIC8vIEludGVnZXIuXHJcbiAgICBlID0gbi5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBubCA9IG4ubGVuZ3RoO1xyXG5cclxuICAvLyBEZXRlcm1pbmUgbGVhZGluZyB6ZXJvcy5cclxuICBmb3IgKGkgPSAwOyBpIDwgbmwgJiYgbi5jaGFyQXQoaSkgPT0gJzAnOykgKytpO1xyXG5cclxuICBpZiAoaSA9PSBubCkge1xyXG5cclxuICAgIC8vIFplcm8uXHJcbiAgICB4LmMgPSBbeC5lID0gMF07XHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKDsgbmwgPiAwICYmIG4uY2hhckF0KC0tbmwpID09ICcwJzspO1xyXG4gICAgeC5lID0gZSAtIGkgLSAxO1xyXG4gICAgeC5jID0gW107XHJcblxyXG4gICAgLy8gQ29udmVydCBzdHJpbmcgdG8gYXJyYXkgb2YgZGlnaXRzIHdpdGhvdXQgbGVhZGluZy90cmFpbGluZyB6ZXJvcy5cclxuICAgIGZvciAoZSA9IDA7IGkgPD0gbmw7KSB4LmNbZSsrXSA9ICtuLmNoYXJBdChpKyspO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHg7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSb3VuZCBCaWcgeCB0byBhIG1heGltdW0gb2Ygc2Qgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nIHJvdW5kaW5nIG1vZGUgcm0uXHJcbiAqXHJcbiAqIHgge0JpZ30gVGhlIEJpZyB0byByb3VuZC5cclxuICogc2Qge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzOiBpbnRlZ2VyLCAwIHRvIE1BWF9EUCBpbmNsdXNpdmUuXHJcbiAqIHJtIHtudW1iZXJ9IFJvdW5kaW5nIG1vZGU6IDAgKGRvd24pLCAxIChoYWxmLXVwKSwgMiAoaGFsZi1ldmVuKSBvciAzICh1cCkuXHJcbiAqIFttb3JlXSB7Ym9vbGVhbn0gV2hldGhlciB0aGUgcmVzdWx0IG9mIGRpdmlzaW9uIHdhcyB0cnVuY2F0ZWQuXHJcbiAqL1xyXG5mdW5jdGlvbiByb3VuZCh4LCBzZCwgcm0sIG1vcmUpIHtcclxuICB2YXIgeGMgPSB4LmM7XHJcblxyXG4gIGlmIChybSA9PT0gVU5ERUZJTkVEKSBybSA9IHguY29uc3RydWN0b3IuUk07XHJcbiAgaWYgKHJtICE9PSAwICYmIHJtICE9PSAxICYmIHJtICE9PSAyICYmIHJtICE9PSAzKSB7XHJcbiAgICB0aHJvdyBFcnJvcihJTlZBTElEX1JNKTtcclxuICB9XHJcblxyXG4gIGlmIChzZCA8IDEpIHtcclxuICAgIG1vcmUgPVxyXG4gICAgICBybSA9PT0gMyAmJiAobW9yZSB8fCAhIXhjWzBdKSB8fCBzZCA9PT0gMCAmJiAoXHJcbiAgICAgIHJtID09PSAxICYmIHhjWzBdID49IDUgfHxcclxuICAgICAgcm0gPT09IDIgJiYgKHhjWzBdID4gNSB8fCB4Y1swXSA9PT0gNSAmJiAobW9yZSB8fCB4Y1sxXSAhPT0gVU5ERUZJTkVEKSlcclxuICAgICk7XHJcblxyXG4gICAgeGMubGVuZ3RoID0gMTtcclxuXHJcbiAgICBpZiAobW9yZSkge1xyXG5cclxuICAgICAgLy8gMSwgMC4xLCAwLjAxLCAwLjAwMSwgMC4wMDAxIGV0Yy5cclxuICAgICAgeC5lID0geC5lIC0gc2QgKyAxO1xyXG4gICAgICB4Y1swXSA9IDE7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgLy8gWmVyby5cclxuICAgICAgeGNbMF0gPSB4LmUgPSAwO1xyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoc2QgPCB4Yy5sZW5ndGgpIHtcclxuXHJcbiAgICAvLyB4Y1tzZF0gaXMgdGhlIGRpZ2l0IGFmdGVyIHRoZSBkaWdpdCB0aGF0IG1heSBiZSByb3VuZGVkIHVwLlxyXG4gICAgbW9yZSA9XHJcbiAgICAgIHJtID09PSAxICYmIHhjW3NkXSA+PSA1IHx8XHJcbiAgICAgIHJtID09PSAyICYmICh4Y1tzZF0gPiA1IHx8IHhjW3NkXSA9PT0gNSAmJlxyXG4gICAgICAgIChtb3JlIHx8IHhjW3NkICsgMV0gIT09IFVOREVGSU5FRCB8fCB4Y1tzZCAtIDFdICYgMSkpIHx8XHJcbiAgICAgIHJtID09PSAzICYmIChtb3JlIHx8ICEheGNbMF0pO1xyXG5cclxuICAgIC8vIFJlbW92ZSBhbnkgZGlnaXRzIGFmdGVyIHRoZSByZXF1aXJlZCBwcmVjaXNpb24uXHJcbiAgICB4Yy5sZW5ndGggPSBzZDtcclxuXHJcbiAgICAvLyBSb3VuZCB1cD9cclxuICAgIGlmIChtb3JlKSB7XHJcblxyXG4gICAgICAvLyBSb3VuZGluZyB1cCBtYXkgbWVhbiB0aGUgcHJldmlvdXMgZGlnaXQgaGFzIHRvIGJlIHJvdW5kZWQgdXAuXHJcbiAgICAgIGZvciAoOyArK3hjWy0tc2RdID4gOTspIHtcclxuICAgICAgICB4Y1tzZF0gPSAwO1xyXG4gICAgICAgIGlmIChzZCA9PT0gMCkge1xyXG4gICAgICAgICAgKyt4LmU7XHJcbiAgICAgICAgICB4Yy51bnNoaWZ0KDEpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgZm9yIChzZCA9IHhjLmxlbmd0aDsgIXhjWy0tc2RdOykgeGMucG9wKCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geDtcclxufVxyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIEJpZyB4IGluIG5vcm1hbCBvciBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICogSGFuZGxlcyBQLnRvRXhwb25lbnRpYWwsIFAudG9GaXhlZCwgUC50b0pTT04sIFAudG9QcmVjaXNpb24sIFAudG9TdHJpbmcgYW5kIFAudmFsdWVPZi5cclxuICovXHJcbmZ1bmN0aW9uIHN0cmluZ2lmeSh4LCBkb0V4cG9uZW50aWFsLCBpc05vbnplcm8pIHtcclxuICB2YXIgZSA9IHguZSxcclxuICAgIHMgPSB4LmMuam9pbignJyksXHJcbiAgICBuID0gcy5sZW5ndGg7XHJcblxyXG4gIC8vIEV4cG9uZW50aWFsIG5vdGF0aW9uP1xyXG4gIGlmIChkb0V4cG9uZW50aWFsKSB7XHJcbiAgICBzID0gcy5jaGFyQXQoMCkgKyAobiA+IDEgPyAnLicgKyBzLnNsaWNlKDEpIDogJycpICsgKGUgPCAwID8gJ2UnIDogJ2UrJykgKyBlO1xyXG5cclxuICAvLyBOb3JtYWwgbm90YXRpb24uXHJcbiAgfSBlbHNlIGlmIChlIDwgMCkge1xyXG4gICAgZm9yICg7ICsrZTspIHMgPSAnMCcgKyBzO1xyXG4gICAgcyA9ICcwLicgKyBzO1xyXG4gIH0gZWxzZSBpZiAoZSA+IDApIHtcclxuICAgIGlmICgrK2UgPiBuKSB7XHJcbiAgICAgIGZvciAoZSAtPSBuOyBlLS07KSBzICs9ICcwJztcclxuICAgIH0gZWxzZSBpZiAoZSA8IG4pIHtcclxuICAgICAgcyA9IHMuc2xpY2UoMCwgZSkgKyAnLicgKyBzLnNsaWNlKGUpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAobiA+IDEpIHtcclxuICAgIHMgPSBzLmNoYXJBdCgwKSArICcuJyArIHMuc2xpY2UoMSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4geC5zIDwgMCAmJiBpc05vbnplcm8gPyAnLScgKyBzIDogcztcclxufVxyXG5cclxuXHJcbi8vIFByb3RvdHlwZS9pbnN0YW5jZSBtZXRob2RzXHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IEJpZyB3aG9zZSB2YWx1ZSBpcyB0aGUgYWJzb2x1dGUgdmFsdWUgb2YgdGhpcyBCaWcuXHJcbiAqL1xyXG5QLmFicyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgeCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpO1xyXG4gIHgucyA9IDE7XHJcbiAgcmV0dXJuIHg7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIDEgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIGlzIGdyZWF0ZXIgdGhhbiB0aGUgdmFsdWUgb2YgQmlnIHksXHJcbiAqICAgICAgIC0xIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBpcyBsZXNzIHRoYW4gdGhlIHZhbHVlIG9mIEJpZyB5LCBvclxyXG4gKiAgICAgICAgMCBpZiB0aGV5IGhhdmUgdGhlIHNhbWUgdmFsdWUuXHJcbiAqL1xyXG5QLmNtcCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGlzbmVnLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICB4YyA9IHguYyxcclxuICAgIHljID0gKHkgPSBuZXcgeC5jb25zdHJ1Y3Rvcih5KSkuYyxcclxuICAgIGkgPSB4LnMsXHJcbiAgICBqID0geS5zLFxyXG4gICAgayA9IHguZSxcclxuICAgIGwgPSB5LmU7XHJcblxyXG4gIC8vIEVpdGhlciB6ZXJvP1xyXG4gIGlmICgheGNbMF0gfHwgIXljWzBdKSByZXR1cm4gIXhjWzBdID8gIXljWzBdID8gMCA6IC1qIDogaTtcclxuXHJcbiAgLy8gU2lnbnMgZGlmZmVyP1xyXG4gIGlmIChpICE9IGopIHJldHVybiBpO1xyXG5cclxuICBpc25lZyA9IGkgPCAwO1xyXG5cclxuICAvLyBDb21wYXJlIGV4cG9uZW50cy5cclxuICBpZiAoayAhPSBsKSByZXR1cm4gayA+IGwgXiBpc25lZyA/IDEgOiAtMTtcclxuXHJcbiAgaiA9IChrID0geGMubGVuZ3RoKSA8IChsID0geWMubGVuZ3RoKSA/IGsgOiBsO1xyXG5cclxuICAvLyBDb21wYXJlIGRpZ2l0IGJ5IGRpZ2l0LlxyXG4gIGZvciAoaSA9IC0xOyArK2kgPCBqOykge1xyXG4gICAgaWYgKHhjW2ldICE9IHljW2ldKSByZXR1cm4geGNbaV0gPiB5Y1tpXSBeIGlzbmVnID8gMSA6IC0xO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29tcGFyZSBsZW5ndGhzLlxyXG4gIHJldHVybiBrID09IGwgPyAwIDogayA+IGwgXiBpc25lZyA/IDEgOiAtMTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgQmlnIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBkaXZpZGVkIGJ5IHRoZSB2YWx1ZSBvZiBCaWcgeSwgcm91bmRlZCxcclxuICogaWYgbmVjZXNzYXJ5LCB0byBhIG1heGltdW0gb2YgQmlnLkRQIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgQmlnLlJNLlxyXG4gKi9cclxuUC5kaXYgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHZhciB4ID0gdGhpcyxcclxuICAgIEJpZyA9IHguY29uc3RydWN0b3IsXHJcbiAgICBhID0geC5jLCAgICAgICAgICAgICAgICAgIC8vIGRpdmlkZW5kXHJcbiAgICBiID0gKHkgPSBuZXcgQmlnKHkpKS5jLCAgIC8vIGRpdmlzb3JcclxuICAgIGsgPSB4LnMgPT0geS5zID8gMSA6IC0xLFxyXG4gICAgZHAgPSBCaWcuRFA7XHJcblxyXG4gIGlmIChkcCAhPT0gfn5kcCB8fCBkcCA8IDAgfHwgZHAgPiBNQVhfRFApIHtcclxuICAgIHRocm93IEVycm9yKElOVkFMSURfRFApO1xyXG4gIH1cclxuXHJcbiAgLy8gRGl2aXNvciBpcyB6ZXJvP1xyXG4gIGlmICghYlswXSkge1xyXG4gICAgdGhyb3cgRXJyb3IoRElWX0JZX1pFUk8pO1xyXG4gIH1cclxuXHJcbiAgLy8gRGl2aWRlbmQgaXMgMD8gUmV0dXJuICstMC5cclxuICBpZiAoIWFbMF0pIHtcclxuICAgIHkucyA9IGs7XHJcbiAgICB5LmMgPSBbeS5lID0gMF07XHJcbiAgICByZXR1cm4geTtcclxuICB9XHJcblxyXG4gIHZhciBibCwgYnQsIG4sIGNtcCwgcmksXHJcbiAgICBieiA9IGIuc2xpY2UoKSxcclxuICAgIGFpID0gYmwgPSBiLmxlbmd0aCxcclxuICAgIGFsID0gYS5sZW5ndGgsXHJcbiAgICByID0gYS5zbGljZSgwLCBibCksICAgLy8gcmVtYWluZGVyXHJcbiAgICBybCA9IHIubGVuZ3RoLFxyXG4gICAgcSA9IHksICAgICAgICAgICAgICAgIC8vIHF1b3RpZW50XHJcbiAgICBxYyA9IHEuYyA9IFtdLFxyXG4gICAgcWkgPSAwLFxyXG4gICAgcCA9IGRwICsgKHEuZSA9IHguZSAtIHkuZSkgKyAxOyAgICAvLyBwcmVjaXNpb24gb2YgdGhlIHJlc3VsdFxyXG5cclxuICBxLnMgPSBrO1xyXG4gIGsgPSBwIDwgMCA/IDAgOiBwO1xyXG5cclxuICAvLyBDcmVhdGUgdmVyc2lvbiBvZiBkaXZpc29yIHdpdGggbGVhZGluZyB6ZXJvLlxyXG4gIGJ6LnVuc2hpZnQoMCk7XHJcblxyXG4gIC8vIEFkZCB6ZXJvcyB0byBtYWtlIHJlbWFpbmRlciBhcyBsb25nIGFzIGRpdmlzb3IuXHJcbiAgZm9yICg7IHJsKysgPCBibDspIHIucHVzaCgwKTtcclxuXHJcbiAgZG8ge1xyXG5cclxuICAgIC8vIG4gaXMgaG93IG1hbnkgdGltZXMgdGhlIGRpdmlzb3IgZ29lcyBpbnRvIGN1cnJlbnQgcmVtYWluZGVyLlxyXG4gICAgZm9yIChuID0gMDsgbiA8IDEwOyBuKyspIHtcclxuXHJcbiAgICAgIC8vIENvbXBhcmUgZGl2aXNvciBhbmQgcmVtYWluZGVyLlxyXG4gICAgICBpZiAoYmwgIT0gKHJsID0gci5sZW5ndGgpKSB7XHJcbiAgICAgICAgY21wID0gYmwgPiBybCA/IDEgOiAtMTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmb3IgKHJpID0gLTEsIGNtcCA9IDA7ICsrcmkgPCBibDspIHtcclxuICAgICAgICAgIGlmIChiW3JpXSAhPSByW3JpXSkge1xyXG4gICAgICAgICAgICBjbXAgPSBiW3JpXSA+IHJbcmldID8gMSA6IC0xO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIElmIGRpdmlzb3IgPCByZW1haW5kZXIsIHN1YnRyYWN0IGRpdmlzb3IgZnJvbSByZW1haW5kZXIuXHJcbiAgICAgIGlmIChjbXAgPCAwKSB7XHJcblxyXG4gICAgICAgIC8vIFJlbWFpbmRlciBjYW4ndCBiZSBtb3JlIHRoYW4gMSBkaWdpdCBsb25nZXIgdGhhbiBkaXZpc29yLlxyXG4gICAgICAgIC8vIEVxdWFsaXNlIGxlbmd0aHMgdXNpbmcgZGl2aXNvciB3aXRoIGV4dHJhIGxlYWRpbmcgemVybz9cclxuICAgICAgICBmb3IgKGJ0ID0gcmwgPT0gYmwgPyBiIDogYno7IHJsOykge1xyXG4gICAgICAgICAgaWYgKHJbLS1ybF0gPCBidFtybF0pIHtcclxuICAgICAgICAgICAgcmkgPSBybDtcclxuICAgICAgICAgICAgZm9yICg7IHJpICYmICFyWy0tcmldOykgcltyaV0gPSA5O1xyXG4gICAgICAgICAgICAtLXJbcmldO1xyXG4gICAgICAgICAgICByW3JsXSArPSAxMDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJbcmxdIC09IGJ0W3JsXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoOyAhclswXTspIHIuc2hpZnQoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEFkZCB0aGUgZGlnaXQgbiB0byB0aGUgcmVzdWx0IGFycmF5LlxyXG4gICAgcWNbcWkrK10gPSBjbXAgPyBuIDogKytuO1xyXG5cclxuICAgIC8vIFVwZGF0ZSB0aGUgcmVtYWluZGVyLlxyXG4gICAgaWYgKHJbMF0gJiYgY21wKSByW3JsXSA9IGFbYWldIHx8IDA7XHJcbiAgICBlbHNlIHIgPSBbYVthaV1dO1xyXG5cclxuICB9IHdoaWxlICgoYWkrKyA8IGFsIHx8IHJbMF0gIT09IFVOREVGSU5FRCkgJiYgay0tKTtcclxuXHJcbiAgLy8gTGVhZGluZyB6ZXJvPyBEbyBub3QgcmVtb3ZlIGlmIHJlc3VsdCBpcyBzaW1wbHkgemVybyAocWkgPT0gMSkuXHJcbiAgaWYgKCFxY1swXSAmJiBxaSAhPSAxKSB7XHJcblxyXG4gICAgLy8gVGhlcmUgY2FuJ3QgYmUgbW9yZSB0aGFuIG9uZSB6ZXJvLlxyXG4gICAgcWMuc2hpZnQoKTtcclxuICAgIHEuZS0tO1xyXG4gICAgcC0tO1xyXG4gIH1cclxuXHJcbiAgLy8gUm91bmQ/XHJcbiAgaWYgKHFpID4gcCkgcm91bmQocSwgcCwgQmlnLlJNLCByWzBdICE9PSBVTkRFRklORUQpO1xyXG5cclxuICByZXR1cm4gcTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgaXMgZXF1YWwgdG8gdGhlIHZhbHVlIG9mIEJpZyB5LCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlLlxyXG4gKi9cclxuUC5lcSA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpID09PSAwO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBpcyBncmVhdGVyIHRoYW4gdGhlIHZhbHVlIG9mIEJpZyB5LCBvdGhlcndpc2UgcmV0dXJuXHJcbiAqIGZhbHNlLlxyXG4gKi9cclxuUC5ndCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpID4gMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgaXMgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZiBCaWcgeSwgb3RoZXJ3aXNlXHJcbiAqIHJldHVybiBmYWxzZS5cclxuICovXHJcblAuZ3RlID0gZnVuY3Rpb24gKHkpIHtcclxuICByZXR1cm4gdGhpcy5jbXAoeSkgPiAtMTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgaXMgbGVzcyB0aGFuIHRoZSB2YWx1ZSBvZiBCaWcgeSwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICovXHJcblAubHQgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHJldHVybiB0aGlzLmNtcCh5KSA8IDA7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgdmFsdWUgb2YgQmlnIHksIG90aGVyd2lzZVxyXG4gKiByZXR1cm4gZmFsc2UuXHJcbiAqL1xyXG5QLmx0ZSA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpIDwgMTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgQmlnIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBtaW51cyB0aGUgdmFsdWUgb2YgQmlnIHkuXHJcbiAqL1xyXG5QLm1pbnVzID0gUC5zdWIgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHZhciBpLCBqLCB0LCB4bHR5LFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBCaWcgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgYSA9IHgucyxcclxuICAgIGIgPSAoeSA9IG5ldyBCaWcoeSkpLnM7XHJcblxyXG4gIC8vIFNpZ25zIGRpZmZlcj9cclxuICBpZiAoYSAhPSBiKSB7XHJcbiAgICB5LnMgPSAtYjtcclxuICAgIHJldHVybiB4LnBsdXMoeSk7XHJcbiAgfVxyXG5cclxuICB2YXIgeGMgPSB4LmMuc2xpY2UoKSxcclxuICAgIHhlID0geC5lLFxyXG4gICAgeWMgPSB5LmMsXHJcbiAgICB5ZSA9IHkuZTtcclxuXHJcbiAgLy8gRWl0aGVyIHplcm8/XHJcbiAgaWYgKCF4Y1swXSB8fCAheWNbMF0pIHtcclxuICAgIGlmICh5Y1swXSkge1xyXG4gICAgICB5LnMgPSAtYjtcclxuICAgIH0gZWxzZSBpZiAoeGNbMF0pIHtcclxuICAgICAgeSA9IG5ldyBCaWcoeCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB5LnMgPSAxO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHk7XHJcbiAgfVxyXG5cclxuICAvLyBEZXRlcm1pbmUgd2hpY2ggaXMgdGhlIGJpZ2dlciBudW1iZXIuIFByZXBlbmQgemVyb3MgdG8gZXF1YWxpc2UgZXhwb25lbnRzLlxyXG4gIGlmIChhID0geGUgLSB5ZSkge1xyXG5cclxuICAgIGlmICh4bHR5ID0gYSA8IDApIHtcclxuICAgICAgYSA9IC1hO1xyXG4gICAgICB0ID0geGM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB5ZSA9IHhlO1xyXG4gICAgICB0ID0geWM7XHJcbiAgICB9XHJcblxyXG4gICAgdC5yZXZlcnNlKCk7XHJcbiAgICBmb3IgKGIgPSBhOyBiLS07KSB0LnB1c2goMCk7XHJcbiAgICB0LnJldmVyc2UoKTtcclxuICB9IGVsc2Uge1xyXG5cclxuICAgIC8vIEV4cG9uZW50cyBlcXVhbC4gQ2hlY2sgZGlnaXQgYnkgZGlnaXQuXHJcbiAgICBqID0gKCh4bHR5ID0geGMubGVuZ3RoIDwgeWMubGVuZ3RoKSA/IHhjIDogeWMpLmxlbmd0aDtcclxuXHJcbiAgICBmb3IgKGEgPSBiID0gMDsgYiA8IGo7IGIrKykge1xyXG4gICAgICBpZiAoeGNbYl0gIT0geWNbYl0pIHtcclxuICAgICAgICB4bHR5ID0geGNbYl0gPCB5Y1tiXTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8geCA8IHk/IFBvaW50IHhjIHRvIHRoZSBhcnJheSBvZiB0aGUgYmlnZ2VyIG51bWJlci5cclxuICBpZiAoeGx0eSkge1xyXG4gICAgdCA9IHhjO1xyXG4gICAgeGMgPSB5YztcclxuICAgIHljID0gdDtcclxuICAgIHkucyA9IC15LnM7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gICAqIEFwcGVuZCB6ZXJvcyB0byB4YyBpZiBzaG9ydGVyLiBObyBuZWVkIHRvIGFkZCB6ZXJvcyB0byB5YyBpZiBzaG9ydGVyIGFzIHN1YnRyYWN0aW9uIG9ubHlcclxuICAgKiBuZWVkcyB0byBzdGFydCBhdCB5Yy5sZW5ndGguXHJcbiAgICovXHJcbiAgaWYgKChiID0gKGogPSB5Yy5sZW5ndGgpIC0gKGkgPSB4Yy5sZW5ndGgpKSA+IDApIGZvciAoOyBiLS07KSB4Y1tpKytdID0gMDtcclxuXHJcbiAgLy8gU3VidHJhY3QgeWMgZnJvbSB4Yy5cclxuICBmb3IgKGIgPSBpOyBqID4gYTspIHtcclxuICAgIGlmICh4Y1stLWpdIDwgeWNbal0pIHtcclxuICAgICAgZm9yIChpID0gajsgaSAmJiAheGNbLS1pXTspIHhjW2ldID0gOTtcclxuICAgICAgLS14Y1tpXTtcclxuICAgICAgeGNbal0gKz0gMTA7XHJcbiAgICB9XHJcblxyXG4gICAgeGNbal0gLT0geWNbal07XHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgZm9yICg7IHhjWy0tYl0gPT09IDA7KSB4Yy5wb3AoKTtcclxuXHJcbiAgLy8gUmVtb3ZlIGxlYWRpbmcgemVyb3MgYW5kIGFkanVzdCBleHBvbmVudCBhY2NvcmRpbmdseS5cclxuICBmb3IgKDsgeGNbMF0gPT09IDA7KSB7XHJcbiAgICB4Yy5zaGlmdCgpO1xyXG4gICAgLS15ZTtcclxuICB9XHJcblxyXG4gIGlmICgheGNbMF0pIHtcclxuXHJcbiAgICAvLyBuIC0gbiA9ICswXHJcbiAgICB5LnMgPSAxO1xyXG5cclxuICAgIC8vIFJlc3VsdCBtdXN0IGJlIHplcm8uXHJcbiAgICB4YyA9IFt5ZSA9IDBdO1xyXG4gIH1cclxuXHJcbiAgeS5jID0geGM7XHJcbiAgeS5lID0geWU7XHJcblxyXG4gIHJldHVybiB5O1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBCaWcgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIG1vZHVsbyB0aGUgdmFsdWUgb2YgQmlnIHkuXHJcbiAqL1xyXG5QLm1vZCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIHlndHgsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEJpZyA9IHguY29uc3RydWN0b3IsXHJcbiAgICBhID0geC5zLFxyXG4gICAgYiA9ICh5ID0gbmV3IEJpZyh5KSkucztcclxuXHJcbiAgaWYgKCF5LmNbMF0pIHtcclxuICAgIHRocm93IEVycm9yKERJVl9CWV9aRVJPKTtcclxuICB9XHJcblxyXG4gIHgucyA9IHkucyA9IDE7XHJcbiAgeWd0eCA9IHkuY21wKHgpID09IDE7XHJcbiAgeC5zID0gYTtcclxuICB5LnMgPSBiO1xyXG5cclxuICBpZiAoeWd0eCkgcmV0dXJuIG5ldyBCaWcoeCk7XHJcblxyXG4gIGEgPSBCaWcuRFA7XHJcbiAgYiA9IEJpZy5STTtcclxuICBCaWcuRFAgPSBCaWcuUk0gPSAwO1xyXG4gIHggPSB4LmRpdih5KTtcclxuICBCaWcuRFAgPSBhO1xyXG4gIEJpZy5STSA9IGI7XHJcblxyXG4gIHJldHVybiB0aGlzLm1pbnVzKHgudGltZXMoeSkpO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBCaWcgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIG5lZ2F0ZWQuXHJcbiAqL1xyXG5QLm5lZyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgeCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpO1xyXG4gIHgucyA9IC14LnM7XHJcbiAgcmV0dXJuIHg7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IEJpZyB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgcGx1cyB0aGUgdmFsdWUgb2YgQmlnIHkuXHJcbiAqL1xyXG5QLnBsdXMgPSBQLmFkZCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgdmFyIGUsIGssIHQsXHJcbiAgICB4ID0gdGhpcyxcclxuICAgIEJpZyA9IHguY29uc3RydWN0b3I7XHJcblxyXG4gIHkgPSBuZXcgQmlnKHkpO1xyXG5cclxuICAvLyBTaWducyBkaWZmZXI/XHJcbiAgaWYgKHgucyAhPSB5LnMpIHtcclxuICAgIHkucyA9IC15LnM7XHJcbiAgICByZXR1cm4geC5taW51cyh5KTtcclxuICB9XHJcblxyXG4gIHZhciB4ZSA9IHguZSxcclxuICAgIHhjID0geC5jLFxyXG4gICAgeWUgPSB5LmUsXHJcbiAgICB5YyA9IHkuYztcclxuXHJcbiAgLy8gRWl0aGVyIHplcm8/XHJcbiAgaWYgKCF4Y1swXSB8fCAheWNbMF0pIHtcclxuICAgIGlmICgheWNbMF0pIHtcclxuICAgICAgaWYgKHhjWzBdKSB7XHJcbiAgICAgICAgeSA9IG5ldyBCaWcoeCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgeS5zID0geC5zO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4geTtcclxuICB9XHJcblxyXG4gIHhjID0geGMuc2xpY2UoKTtcclxuXHJcbiAgLy8gUHJlcGVuZCB6ZXJvcyB0byBlcXVhbGlzZSBleHBvbmVudHMuXHJcbiAgLy8gTm90ZTogcmV2ZXJzZSBmYXN0ZXIgdGhhbiB1bnNoaWZ0cy5cclxuICBpZiAoZSA9IHhlIC0geWUpIHtcclxuICAgIGlmIChlID4gMCkge1xyXG4gICAgICB5ZSA9IHhlO1xyXG4gICAgICB0ID0geWM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlID0gLWU7XHJcbiAgICAgIHQgPSB4YztcclxuICAgIH1cclxuXHJcbiAgICB0LnJldmVyc2UoKTtcclxuICAgIGZvciAoOyBlLS07KSB0LnB1c2goMCk7XHJcbiAgICB0LnJldmVyc2UoKTtcclxuICB9XHJcblxyXG4gIC8vIFBvaW50IHhjIHRvIHRoZSBsb25nZXIgYXJyYXkuXHJcbiAgaWYgKHhjLmxlbmd0aCAtIHljLmxlbmd0aCA8IDApIHtcclxuICAgIHQgPSB5YztcclxuICAgIHljID0geGM7XHJcbiAgICB4YyA9IHQ7XHJcbiAgfVxyXG5cclxuICBlID0geWMubGVuZ3RoO1xyXG5cclxuICAvLyBPbmx5IHN0YXJ0IGFkZGluZyBhdCB5Yy5sZW5ndGggLSAxIGFzIHRoZSBmdXJ0aGVyIGRpZ2l0cyBvZiB4YyBjYW4gYmUgbGVmdCBhcyB0aGV5IGFyZS5cclxuICBmb3IgKGsgPSAwOyBlOyB4Y1tlXSAlPSAxMCkgayA9ICh4Y1stLWVdID0geGNbZV0gKyB5Y1tlXSArIGspIC8gMTAgfCAwO1xyXG5cclxuICAvLyBObyBuZWVkIHRvIGNoZWNrIGZvciB6ZXJvLCBhcyAreCArICt5ICE9IDAgJiYgLXggKyAteSAhPSAwXHJcblxyXG4gIGlmIChrKSB7XHJcbiAgICB4Yy51bnNoaWZ0KGspO1xyXG4gICAgKyt5ZTtcclxuICB9XHJcblxyXG4gIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICBmb3IgKGUgPSB4Yy5sZW5ndGg7IHhjWy0tZV0gPT09IDA7KSB4Yy5wb3AoKTtcclxuXHJcbiAgeS5jID0geGM7XHJcbiAgeS5lID0geWU7XHJcblxyXG4gIHJldHVybiB5O1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIEJpZyB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgcmFpc2VkIHRvIHRoZSBwb3dlciBuLlxyXG4gKiBJZiBuIGlzIG5lZ2F0aXZlLCByb3VuZCB0byBhIG1heGltdW0gb2YgQmlnLkRQIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nXHJcbiAqIG1vZGUgQmlnLlJNLlxyXG4gKlxyXG4gKiBuIHtudW1iZXJ9IEludGVnZXIsIC1NQVhfUE9XRVIgdG8gTUFYX1BPV0VSIGluY2x1c2l2ZS5cclxuICovXHJcblAucG93ID0gZnVuY3Rpb24gKG4pIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBvbmUgPSBuZXcgeC5jb25zdHJ1Y3RvcignMScpLFxyXG4gICAgeSA9IG9uZSxcclxuICAgIGlzbmVnID0gbiA8IDA7XHJcblxyXG4gIGlmIChuICE9PSB+fm4gfHwgbiA8IC1NQVhfUE9XRVIgfHwgbiA+IE1BWF9QT1dFUikge1xyXG4gICAgdGhyb3cgRXJyb3IoSU5WQUxJRCArICdleHBvbmVudCcpO1xyXG4gIH1cclxuXHJcbiAgaWYgKGlzbmVnKSBuID0gLW47XHJcblxyXG4gIGZvciAoOzspIHtcclxuICAgIGlmIChuICYgMSkgeSA9IHkudGltZXMoeCk7XHJcbiAgICBuID4+PSAxO1xyXG4gICAgaWYgKCFuKSBicmVhaztcclxuICAgIHggPSB4LnRpbWVzKHgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGlzbmVnID8gb25lLmRpdih5KSA6IHk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IEJpZyB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgcm91bmRlZCB0byBhIG1heGltdW0gcHJlY2lzaW9uIG9mIHNkXHJcbiAqIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIHJtLCBvciBCaWcuUk0gaWYgcm0gaXMgbm90IHNwZWNpZmllZC5cclxuICpcclxuICogc2Qge251bWJlcn0gU2lnbmlmaWNhbnQgZGlnaXRzOiBpbnRlZ2VyLCAxIHRvIE1BWF9EUCBpbmNsdXNpdmUuXHJcbiAqIHJtPyB7bnVtYmVyfSBSb3VuZGluZyBtb2RlOiAwIChkb3duKSwgMSAoaGFsZi11cCksIDIgKGhhbGYtZXZlbikgb3IgMyAodXApLlxyXG4gKi9cclxuUC5wcmVjID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gIGlmIChzZCAhPT0gfn5zZCB8fCBzZCA8IDEgfHwgc2QgPiBNQVhfRFApIHtcclxuICAgIHRocm93IEVycm9yKElOVkFMSUQgKyAncHJlY2lzaW9uJyk7XHJcbiAgfVxyXG4gIHJldHVybiByb3VuZChuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKSwgc2QsIHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgQmlnIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyByb3VuZGVkIHRvIGEgbWF4aW11bSBvZiBkcCBkZWNpbWFsIHBsYWNlc1xyXG4gKiB1c2luZyByb3VuZGluZyBtb2RlIHJtLCBvciBCaWcuUk0gaWYgcm0gaXMgbm90IHNwZWNpZmllZC5cclxuICogSWYgZHAgaXMgbmVnYXRpdmUsIHJvdW5kIHRvIGFuIGludGVnZXIgd2hpY2ggaXMgYSBtdWx0aXBsZSBvZiAxMCoqLWRwLlxyXG4gKiBJZiBkcCBpcyBub3Qgc3BlY2lmaWVkLCByb3VuZCB0byAwIGRlY2ltYWwgcGxhY2VzLlxyXG4gKlxyXG4gKiBkcD8ge251bWJlcn0gSW50ZWdlciwgLU1BWF9EUCB0byBNQVhfRFAgaW5jbHVzaXZlLlxyXG4gKiBybT8ge251bWJlcn0gUm91bmRpbmcgbW9kZTogMCAoZG93biksIDEgKGhhbGYtdXApLCAyIChoYWxmLWV2ZW4pIG9yIDMgKHVwKS5cclxuICovXHJcblAucm91bmQgPSBmdW5jdGlvbiAoZHAsIHJtKSB7XHJcbiAgaWYgKGRwID09PSBVTkRFRklORUQpIGRwID0gMDtcclxuICBlbHNlIGlmIChkcCAhPT0gfn5kcCB8fCBkcCA8IC1NQVhfRFAgfHwgZHAgPiBNQVhfRFApIHtcclxuICAgIHRocm93IEVycm9yKElOVkFMSURfRFApO1xyXG4gIH1cclxuICByZXR1cm4gcm91bmQobmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyksIGRwICsgdGhpcy5lICsgMSwgcm0pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBCaWcgd2hvc2UgdmFsdWUgaXMgdGhlIHNxdWFyZSByb290IG9mIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZywgcm91bmRlZCwgaWZcclxuICogbmVjZXNzYXJ5LCB0byBhIG1heGltdW0gb2YgQmlnLkRQIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgQmlnLlJNLlxyXG4gKi9cclxuUC5zcXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciByLCBjLCB0LFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBCaWcgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgcyA9IHgucyxcclxuICAgIGUgPSB4LmUsXHJcbiAgICBoYWxmID0gbmV3IEJpZygnMC41Jyk7XHJcblxyXG4gIC8vIFplcm8/XHJcbiAgaWYgKCF4LmNbMF0pIHJldHVybiBuZXcgQmlnKHgpO1xyXG5cclxuICAvLyBOZWdhdGl2ZT9cclxuICBpZiAocyA8IDApIHtcclxuICAgIHRocm93IEVycm9yKE5BTUUgKyAnTm8gc3F1YXJlIHJvb3QnKTtcclxuICB9XHJcblxyXG4gIC8vIEVzdGltYXRlLlxyXG4gIHMgPSBNYXRoLnNxcnQoK3N0cmluZ2lmeSh4LCB0cnVlLCB0cnVlKSk7XHJcblxyXG4gIC8vIE1hdGguc3FydCB1bmRlcmZsb3cvb3ZlcmZsb3c/XHJcbiAgLy8gUmUtZXN0aW1hdGU6IHBhc3MgeCBjb2VmZmljaWVudCB0byBNYXRoLnNxcnQgYXMgaW50ZWdlciwgdGhlbiBhZGp1c3QgdGhlIHJlc3VsdCBleHBvbmVudC5cclxuICBpZiAocyA9PT0gMCB8fCBzID09PSAxIC8gMCkge1xyXG4gICAgYyA9IHguYy5qb2luKCcnKTtcclxuICAgIGlmICghKGMubGVuZ3RoICsgZSAmIDEpKSBjICs9ICcwJztcclxuICAgIHMgPSBNYXRoLnNxcnQoYyk7XHJcbiAgICBlID0gKChlICsgMSkgLyAyIHwgMCkgLSAoZSA8IDAgfHwgZSAmIDEpO1xyXG4gICAgciA9IG5ldyBCaWcoKHMgPT0gMSAvIDAgPyAnNWUnIDogKHMgPSBzLnRvRXhwb25lbnRpYWwoKSkuc2xpY2UoMCwgcy5pbmRleE9mKCdlJykgKyAxKSkgKyBlKTtcclxuICB9IGVsc2Uge1xyXG4gICAgciA9IG5ldyBCaWcocyArICcnKTtcclxuICB9XHJcblxyXG4gIGUgPSByLmUgKyAoQmlnLkRQICs9IDQpO1xyXG5cclxuICAvLyBOZXd0b24tUmFwaHNvbiBpdGVyYXRpb24uXHJcbiAgZG8ge1xyXG4gICAgdCA9IHI7XHJcbiAgICByID0gaGFsZi50aW1lcyh0LnBsdXMoeC5kaXYodCkpKTtcclxuICB9IHdoaWxlICh0LmMuc2xpY2UoMCwgZSkuam9pbignJykgIT09IHIuYy5zbGljZSgwLCBlKS5qb2luKCcnKSk7XHJcblxyXG4gIHJldHVybiByb3VuZChyLCAoQmlnLkRQIC09IDQpICsgci5lICsgMSwgQmlnLlJNKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgQmlnIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyB0aW1lcyB0aGUgdmFsdWUgb2YgQmlnIHkuXHJcbiAqL1xyXG5QLnRpbWVzID0gUC5tdWwgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHZhciBjLFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBCaWcgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgeGMgPSB4LmMsXHJcbiAgICB5YyA9ICh5ID0gbmV3IEJpZyh5KSkuYyxcclxuICAgIGEgPSB4Yy5sZW5ndGgsXHJcbiAgICBiID0geWMubGVuZ3RoLFxyXG4gICAgaSA9IHguZSxcclxuICAgIGogPSB5LmU7XHJcblxyXG4gIC8vIERldGVybWluZSBzaWduIG9mIHJlc3VsdC5cclxuICB5LnMgPSB4LnMgPT0geS5zID8gMSA6IC0xO1xyXG5cclxuICAvLyBSZXR1cm4gc2lnbmVkIDAgaWYgZWl0aGVyIDAuXHJcbiAgaWYgKCF4Y1swXSB8fCAheWNbMF0pIHtcclxuICAgIHkuYyA9IFt5LmUgPSAwXTtcclxuICAgIHJldHVybiB5O1xyXG4gIH1cclxuXHJcbiAgLy8gSW5pdGlhbGlzZSBleHBvbmVudCBvZiByZXN1bHQgYXMgeC5lICsgeS5lLlxyXG4gIHkuZSA9IGkgKyBqO1xyXG5cclxuICAvLyBJZiBhcnJheSB4YyBoYXMgZmV3ZXIgZGlnaXRzIHRoYW4geWMsIHN3YXAgeGMgYW5kIHljLCBhbmQgbGVuZ3Rocy5cclxuICBpZiAoYSA8IGIpIHtcclxuICAgIGMgPSB4YztcclxuICAgIHhjID0geWM7XHJcbiAgICB5YyA9IGM7XHJcbiAgICBqID0gYTtcclxuICAgIGEgPSBiO1xyXG4gICAgYiA9IGo7XHJcbiAgfVxyXG5cclxuICAvLyBJbml0aWFsaXNlIGNvZWZmaWNpZW50IGFycmF5IG9mIHJlc3VsdCB3aXRoIHplcm9zLlxyXG4gIGZvciAoYyA9IG5ldyBBcnJheShqID0gYSArIGIpOyBqLS07KSBjW2pdID0gMDtcclxuXHJcbiAgLy8gTXVsdGlwbHkuXHJcblxyXG4gIC8vIGkgaXMgaW5pdGlhbGx5IHhjLmxlbmd0aC5cclxuICBmb3IgKGkgPSBiOyBpLS07KSB7XHJcbiAgICBiID0gMDtcclxuXHJcbiAgICAvLyBhIGlzIHljLmxlbmd0aC5cclxuICAgIGZvciAoaiA9IGEgKyBpOyBqID4gaTspIHtcclxuXHJcbiAgICAgIC8vIEN1cnJlbnQgc3VtIG9mIHByb2R1Y3RzIGF0IHRoaXMgZGlnaXQgcG9zaXRpb24sIHBsdXMgY2FycnkuXHJcbiAgICAgIGIgPSBjW2pdICsgeWNbaV0gKiB4Y1tqIC0gaSAtIDFdICsgYjtcclxuICAgICAgY1tqLS1dID0gYiAlIDEwO1xyXG5cclxuICAgICAgLy8gY2FycnlcclxuICAgICAgYiA9IGIgLyAxMCB8IDA7XHJcbiAgICB9XHJcblxyXG4gICAgY1tqXSA9IGI7XHJcbiAgfVxyXG5cclxuICAvLyBJbmNyZW1lbnQgcmVzdWx0IGV4cG9uZW50IGlmIHRoZXJlIGlzIGEgZmluYWwgY2FycnksIG90aGVyd2lzZSByZW1vdmUgbGVhZGluZyB6ZXJvLlxyXG4gIGlmIChiKSArK3kuZTtcclxuICBlbHNlIGMuc2hpZnQoKTtcclxuXHJcbiAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gIGZvciAoaSA9IGMubGVuZ3RoOyAhY1stLWldOykgYy5wb3AoKTtcclxuICB5LmMgPSBjO1xyXG5cclxuICByZXR1cm4geTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBpbiBleHBvbmVudGlhbCBub3RhdGlvbiByb3VuZGVkIHRvIGRwIGZpeGVkXHJcbiAqIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgcm0sIG9yIEJpZy5STSBpZiBybSBpcyBub3Qgc3BlY2lmaWVkLlxyXG4gKlxyXG4gKiBkcD8ge251bWJlcn0gRGVjaW1hbCBwbGFjZXM6IGludGVnZXIsIDAgdG8gTUFYX0RQIGluY2x1c2l2ZS5cclxuICogcm0/IHtudW1iZXJ9IFJvdW5kaW5nIG1vZGU6IDAgKGRvd24pLCAxIChoYWxmLXVwKSwgMiAoaGFsZi1ldmVuKSBvciAzICh1cCkuXHJcbiAqL1xyXG5QLnRvRXhwb25lbnRpYWwgPSBmdW5jdGlvbiAoZHAsIHJtKSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgbiA9IHguY1swXTtcclxuXHJcbiAgaWYgKGRwICE9PSBVTkRFRklORUQpIHtcclxuICAgIGlmIChkcCAhPT0gfn5kcCB8fCBkcCA8IDAgfHwgZHAgPiBNQVhfRFApIHtcclxuICAgICAgdGhyb3cgRXJyb3IoSU5WQUxJRF9EUCk7XHJcbiAgICB9XHJcbiAgICB4ID0gcm91bmQobmV3IHguY29uc3RydWN0b3IoeCksICsrZHAsIHJtKTtcclxuICAgIGZvciAoOyB4LmMubGVuZ3RoIDwgZHA7KSB4LmMucHVzaCgwKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBzdHJpbmdpZnkoeCwgdHJ1ZSwgISFuKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBpbiBub3JtYWwgbm90YXRpb24gcm91bmRlZCB0byBkcCBmaXhlZFxyXG4gKiBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIHJtLCBvciBCaWcuUk0gaWYgcm0gaXMgbm90IHNwZWNpZmllZC5cclxuICpcclxuICogZHA/IHtudW1iZXJ9IERlY2ltYWwgcGxhY2VzOiBpbnRlZ2VyLCAwIHRvIE1BWF9EUCBpbmNsdXNpdmUuXHJcbiAqIHJtPyB7bnVtYmVyfSBSb3VuZGluZyBtb2RlOiAwIChkb3duKSwgMSAoaGFsZi11cCksIDIgKGhhbGYtZXZlbikgb3IgMyAodXApLlxyXG4gKlxyXG4gKiAoLTApLnRvRml4ZWQoMCkgaXMgJzAnLCBidXQgKC0wLjEpLnRvRml4ZWQoMCkgaXMgJy0wJy5cclxuICogKC0wKS50b0ZpeGVkKDEpIGlzICcwLjAnLCBidXQgKC0wLjAxKS50b0ZpeGVkKDEpIGlzICctMC4wJy5cclxuICovXHJcblAudG9GaXhlZCA9IGZ1bmN0aW9uIChkcCwgcm0pIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBuID0geC5jWzBdO1xyXG5cclxuICBpZiAoZHAgIT09IFVOREVGSU5FRCkge1xyXG4gICAgaWYgKGRwICE9PSB+fmRwIHx8IGRwIDwgMCB8fCBkcCA+IE1BWF9EUCkge1xyXG4gICAgICB0aHJvdyBFcnJvcihJTlZBTElEX0RQKTtcclxuICAgIH1cclxuICAgIHggPSByb3VuZChuZXcgeC5jb25zdHJ1Y3Rvcih4KSwgZHAgKyB4LmUgKyAxLCBybSk7XHJcblxyXG4gICAgLy8geC5lIG1heSBoYXZlIGNoYW5nZWQgaWYgdGhlIHZhbHVlIGlzIHJvdW5kZWQgdXAuXHJcbiAgICBmb3IgKGRwID0gZHAgKyB4LmUgKyAxOyB4LmMubGVuZ3RoIDwgZHA7KSB4LmMucHVzaCgwKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBzdHJpbmdpZnkoeCwgZmFsc2UsICEhbik7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcuXHJcbiAqIFJldHVybiBleHBvbmVudGlhbCBub3RhdGlvbiBpZiB0aGlzIEJpZyBoYXMgYSBwb3NpdGl2ZSBleHBvbmVudCBlcXVhbCB0byBvciBncmVhdGVyIHRoYW5cclxuICogQmlnLlBFLCBvciBhIG5lZ2F0aXZlIGV4cG9uZW50IGVxdWFsIHRvIG9yIGxlc3MgdGhhbiBCaWcuTkUuXHJcbiAqIE9taXQgdGhlIHNpZ24gZm9yIG5lZ2F0aXZlIHplcm8uXHJcbiAqL1xyXG5QW1N5bWJvbC5mb3IoJ25vZGVqcy51dGlsLmluc3BlY3QuY3VzdG9tJyldID0gUC50b0pTT04gPSBQLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB4ID0gdGhpcyxcclxuICAgIEJpZyA9IHguY29uc3RydWN0b3I7XHJcbiAgcmV0dXJuIHN0cmluZ2lmeSh4LCB4LmUgPD0gQmlnLk5FIHx8IHguZSA+PSBCaWcuUEUsICEheC5jWzBdKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdGhlIHZhbHVlIG9mIHRoaXMgQmlnIGFzIGEgcHJpbWl0dmUgbnVtYmVyLlxyXG4gKi9cclxuUC50b051bWJlciA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgbiA9ICtzdHJpbmdpZnkodGhpcywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgaWYgKHRoaXMuY29uc3RydWN0b3Iuc3RyaWN0ID09PSB0cnVlICYmICF0aGlzLmVxKG4udG9TdHJpbmcoKSkpIHtcclxuICAgIHRocm93IEVycm9yKE5BTUUgKyAnSW1wcmVjaXNlIGNvbnZlcnNpb24nKTtcclxuICB9XHJcbiAgcmV0dXJuIG47XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgcm91bmRlZCB0byBzZCBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmdcclxuICogcm91bmRpbmcgbW9kZSBybSwgb3IgQmlnLlJNIGlmIHJtIGlzIG5vdCBzcGVjaWZpZWQuXHJcbiAqIFVzZSBleHBvbmVudGlhbCBub3RhdGlvbiBpZiBzZCBpcyBsZXNzIHRoYW4gdGhlIG51bWJlciBvZiBkaWdpdHMgbmVjZXNzYXJ5IHRvIHJlcHJlc2VudFxyXG4gKiB0aGUgaW50ZWdlciBwYXJ0IG9mIHRoZSB2YWx1ZSBpbiBub3JtYWwgbm90YXRpb24uXHJcbiAqXHJcbiAqIHNkIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0czogaW50ZWdlciwgMSB0byBNQVhfRFAgaW5jbHVzaXZlLlxyXG4gKiBybT8ge251bWJlcn0gUm91bmRpbmcgbW9kZTogMCAoZG93biksIDEgKGhhbGYtdXApLCAyIChoYWxmLWV2ZW4pIG9yIDMgKHVwKS5cclxuICovXHJcblAudG9QcmVjaXNpb24gPSBmdW5jdGlvbiAoc2QsIHJtKSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgQmlnID0geC5jb25zdHJ1Y3RvcixcclxuICAgIG4gPSB4LmNbMF07XHJcblxyXG4gIGlmIChzZCAhPT0gVU5ERUZJTkVEKSB7XHJcbiAgICBpZiAoc2QgIT09IH5+c2QgfHwgc2QgPCAxIHx8IHNkID4gTUFYX0RQKSB7XHJcbiAgICAgIHRocm93IEVycm9yKElOVkFMSUQgKyAncHJlY2lzaW9uJyk7XHJcbiAgICB9XHJcbiAgICB4ID0gcm91bmQobmV3IEJpZyh4KSwgc2QsIHJtKTtcclxuICAgIGZvciAoOyB4LmMubGVuZ3RoIDwgc2Q7KSB4LmMucHVzaCgwKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBzdHJpbmdpZnkoeCwgc2QgPD0geC5lIHx8IHguZSA8PSBCaWcuTkUgfHwgeC5lID49IEJpZy5QRSwgISFuKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZy5cclxuICogUmV0dXJuIGV4cG9uZW50aWFsIG5vdGF0aW9uIGlmIHRoaXMgQmlnIGhhcyBhIHBvc2l0aXZlIGV4cG9uZW50IGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhblxyXG4gKiBCaWcuUEUsIG9yIGEgbmVnYXRpdmUgZXhwb25lbnQgZXF1YWwgdG8gb3IgbGVzcyB0aGFuIEJpZy5ORS5cclxuICogSW5jbHVkZSB0aGUgc2lnbiBmb3IgbmVnYXRpdmUgemVyby5cclxuICovXHJcblAudmFsdWVPZiA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBCaWcgPSB4LmNvbnN0cnVjdG9yO1xyXG4gIGlmIChCaWcuc3RyaWN0ID09PSB0cnVlKSB7XHJcbiAgICB0aHJvdyBFcnJvcihOQU1FICsgJ3ZhbHVlT2YgZGlzYWxsb3dlZCcpO1xyXG4gIH1cclxuICByZXR1cm4gc3RyaW5naWZ5KHgsIHguZSA8PSBCaWcuTkUgfHwgeC5lID49IEJpZy5QRSwgdHJ1ZSk7XHJcbn07XHJcblxyXG5cclxuLy8gRXhwb3J0XHJcblxyXG5cclxuZXhwb3J0IHZhciBCaWcgPSBfQmlnXygpO1xyXG5cclxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vRGVmaW5pdGVseVR5cGVkL0RlZmluaXRlbHlUeXBlZC9tYXN0ZXIvdHlwZXMvYmlnLmpzL2luZGV4LmQudHNcIiAvPlxyXG5leHBvcnQgZGVmYXVsdCBCaWc7XHJcbiIsInZhciBjaGFyYWN0ZXJNYXAgPSB7XG5cdFwiw4BcIjogXCJBXCIsXG5cdFwiw4FcIjogXCJBXCIsXG5cdFwiw4JcIjogXCJBXCIsXG5cdFwiw4NcIjogXCJBXCIsXG5cdFwiw4RcIjogXCJBXCIsXG5cdFwiw4VcIjogXCJBXCIsXG5cdFwi4bqkXCI6IFwiQVwiLFxuXHRcIuG6rlwiOiBcIkFcIixcblx0XCLhurJcIjogXCJBXCIsXG5cdFwi4bq0XCI6IFwiQVwiLFxuXHRcIuG6tlwiOiBcIkFcIixcblx0XCLDhlwiOiBcIkFFXCIsXG5cdFwi4bqmXCI6IFwiQVwiLFxuXHRcIuG6sFwiOiBcIkFcIixcblx0XCLIglwiOiBcIkFcIixcblx0XCLhuqJcIjogXCJBXCIsXG5cdFwi4bqgXCI6IFwiQVwiLFxuXHRcIuG6qFwiOiBcIkFcIixcblx0XCLhuqpcIjogXCJBXCIsXG5cdFwi4bqsXCI6IFwiQVwiLFxuXHRcIsOHXCI6IFwiQ1wiLFxuXHRcIuG4iFwiOiBcIkNcIixcblx0XCLDiFwiOiBcIkVcIixcblx0XCLDiVwiOiBcIkVcIixcblx0XCLDilwiOiBcIkVcIixcblx0XCLDi1wiOiBcIkVcIixcblx0XCLhur5cIjogXCJFXCIsXG5cdFwi4biWXCI6IFwiRVwiLFxuXHRcIuG7gFwiOiBcIkVcIixcblx0XCLhuJRcIjogXCJFXCIsXG5cdFwi4bicXCI6IFwiRVwiLFxuXHRcIsiGXCI6IFwiRVwiLFxuXHRcIuG6ulwiOiBcIkVcIixcblx0XCLhurxcIjogXCJFXCIsXG5cdFwi4bq4XCI6IFwiRVwiLFxuXHRcIuG7glwiOiBcIkVcIixcblx0XCLhu4RcIjogXCJFXCIsXG5cdFwi4buGXCI6IFwiRVwiLFxuXHRcIsOMXCI6IFwiSVwiLFxuXHRcIsONXCI6IFwiSVwiLFxuXHRcIsOOXCI6IFwiSVwiLFxuXHRcIsOPXCI6IFwiSVwiLFxuXHRcIuG4rlwiOiBcIklcIixcblx0XCLIilwiOiBcIklcIixcblx0XCLhu4hcIjogXCJJXCIsXG5cdFwi4buKXCI6IFwiSVwiLFxuXHRcIsOQXCI6IFwiRFwiLFxuXHRcIsORXCI6IFwiTlwiLFxuXHRcIsOSXCI6IFwiT1wiLFxuXHRcIsOTXCI6IFwiT1wiLFxuXHRcIsOUXCI6IFwiT1wiLFxuXHRcIsOVXCI6IFwiT1wiLFxuXHRcIsOWXCI6IFwiT1wiLFxuXHRcIsOYXCI6IFwiT1wiLFxuXHRcIuG7kFwiOiBcIk9cIixcblx0XCLhuYxcIjogXCJPXCIsXG5cdFwi4bmSXCI6IFwiT1wiLFxuXHRcIsiOXCI6IFwiT1wiLFxuXHRcIuG7jlwiOiBcIk9cIixcblx0XCLhu4xcIjogXCJPXCIsXG5cdFwi4buUXCI6IFwiT1wiLFxuXHRcIuG7llwiOiBcIk9cIixcblx0XCLhu5hcIjogXCJPXCIsXG5cdFwi4bucXCI6IFwiT1wiLFxuXHRcIuG7nlwiOiBcIk9cIixcblx0XCLhu6BcIjogXCJPXCIsXG5cdFwi4buaXCI6IFwiT1wiLFxuXHRcIuG7olwiOiBcIk9cIixcblx0XCLDmVwiOiBcIlVcIixcblx0XCLDmlwiOiBcIlVcIixcblx0XCLDm1wiOiBcIlVcIixcblx0XCLDnFwiOiBcIlVcIixcblx0XCLhu6ZcIjogXCJVXCIsXG5cdFwi4bukXCI6IFwiVVwiLFxuXHRcIuG7rFwiOiBcIlVcIixcblx0XCLhu65cIjogXCJVXCIsXG5cdFwi4buwXCI6IFwiVVwiLFxuXHRcIsOdXCI6IFwiWVwiLFxuXHRcIsOgXCI6IFwiYVwiLFxuXHRcIsOhXCI6IFwiYVwiLFxuXHRcIsOiXCI6IFwiYVwiLFxuXHRcIsOjXCI6IFwiYVwiLFxuXHRcIsOkXCI6IFwiYVwiLFxuXHRcIsOlXCI6IFwiYVwiLFxuXHRcIuG6pVwiOiBcImFcIixcblx0XCLhuq9cIjogXCJhXCIsXG5cdFwi4bqzXCI6IFwiYVwiLFxuXHRcIuG6tVwiOiBcImFcIixcblx0XCLhurdcIjogXCJhXCIsXG5cdFwiw6ZcIjogXCJhZVwiLFxuXHRcIuG6p1wiOiBcImFcIixcblx0XCLhurFcIjogXCJhXCIsXG5cdFwiyINcIjogXCJhXCIsXG5cdFwi4bqjXCI6IFwiYVwiLFxuXHRcIuG6oVwiOiBcImFcIixcblx0XCLhuqlcIjogXCJhXCIsXG5cdFwi4bqrXCI6IFwiYVwiLFxuXHRcIuG6rVwiOiBcImFcIixcblx0XCLDp1wiOiBcImNcIixcblx0XCLhuIlcIjogXCJjXCIsXG5cdFwiw6hcIjogXCJlXCIsXG5cdFwiw6lcIjogXCJlXCIsXG5cdFwiw6pcIjogXCJlXCIsXG5cdFwiw6tcIjogXCJlXCIsXG5cdFwi4bq/XCI6IFwiZVwiLFxuXHRcIuG4l1wiOiBcImVcIixcblx0XCLhu4FcIjogXCJlXCIsXG5cdFwi4biVXCI6IFwiZVwiLFxuXHRcIuG4nVwiOiBcImVcIixcblx0XCLIh1wiOiBcImVcIixcblx0XCLhurtcIjogXCJlXCIsXG5cdFwi4bq9XCI6IFwiZVwiLFxuXHRcIuG6uVwiOiBcImVcIixcblx0XCLhu4NcIjogXCJlXCIsXG5cdFwi4buFXCI6IFwiZVwiLFxuXHRcIuG7h1wiOiBcImVcIixcblx0XCLDrFwiOiBcImlcIixcblx0XCLDrVwiOiBcImlcIixcblx0XCLDrlwiOiBcImlcIixcblx0XCLDr1wiOiBcImlcIixcblx0XCLhuK9cIjogXCJpXCIsXG5cdFwiyItcIjogXCJpXCIsXG5cdFwi4buJXCI6IFwiaVwiLFxuXHRcIuG7i1wiOiBcImlcIixcblx0XCLDsFwiOiBcImRcIixcblx0XCLDsVwiOiBcIm5cIixcblx0XCLDslwiOiBcIm9cIixcblx0XCLDs1wiOiBcIm9cIixcblx0XCLDtFwiOiBcIm9cIixcblx0XCLDtVwiOiBcIm9cIixcblx0XCLDtlwiOiBcIm9cIixcblx0XCLDuFwiOiBcIm9cIixcblx0XCLhu5FcIjogXCJvXCIsXG5cdFwi4bmNXCI6IFwib1wiLFxuXHRcIuG5k1wiOiBcIm9cIixcblx0XCLIj1wiOiBcIm9cIixcblx0XCLhu49cIjogXCJvXCIsXG5cdFwi4buNXCI6IFwib1wiLFxuXHRcIuG7lVwiOiBcIm9cIixcblx0XCLhu5dcIjogXCJvXCIsXG5cdFwi4buZXCI6IFwib1wiLFxuXHRcIuG7nVwiOiBcIm9cIixcblx0XCLhu59cIjogXCJvXCIsXG5cdFwi4buhXCI6IFwib1wiLFxuXHRcIuG7m1wiOiBcIm9cIixcblx0XCLhu6NcIjogXCJvXCIsXG5cdFwiw7lcIjogXCJ1XCIsXG5cdFwiw7pcIjogXCJ1XCIsXG5cdFwiw7tcIjogXCJ1XCIsXG5cdFwiw7xcIjogXCJ1XCIsXG5cdFwi4bunXCI6IFwidVwiLFxuXHRcIuG7pVwiOiBcInVcIixcblx0XCLhu61cIjogXCJ1XCIsXG5cdFwi4buvXCI6IFwidVwiLFxuXHRcIuG7sVwiOiBcInVcIixcblx0XCLDvVwiOiBcInlcIixcblx0XCLDv1wiOiBcInlcIixcblx0XCLEgFwiOiBcIkFcIixcblx0XCLEgVwiOiBcImFcIixcblx0XCLEglwiOiBcIkFcIixcblx0XCLEg1wiOiBcImFcIixcblx0XCLEhFwiOiBcIkFcIixcblx0XCLEhVwiOiBcImFcIixcblx0XCLEhlwiOiBcIkNcIixcblx0XCLEh1wiOiBcImNcIixcblx0XCLEiFwiOiBcIkNcIixcblx0XCLEiVwiOiBcImNcIixcblx0XCLEilwiOiBcIkNcIixcblx0XCLEi1wiOiBcImNcIixcblx0XCLEjFwiOiBcIkNcIixcblx0XCLEjVwiOiBcImNcIixcblx0XCJDzIZcIjogXCJDXCIsXG5cdFwiY8yGXCI6IFwiY1wiLFxuXHRcIsSOXCI6IFwiRFwiLFxuXHRcIsSPXCI6IFwiZFwiLFxuXHRcIsSQXCI6IFwiRFwiLFxuXHRcIsSRXCI6IFwiZFwiLFxuXHRcIsSSXCI6IFwiRVwiLFxuXHRcIsSTXCI6IFwiZVwiLFxuXHRcIsSUXCI6IFwiRVwiLFxuXHRcIsSVXCI6IFwiZVwiLFxuXHRcIsSWXCI6IFwiRVwiLFxuXHRcIsSXXCI6IFwiZVwiLFxuXHRcIsSYXCI6IFwiRVwiLFxuXHRcIsSZXCI6IFwiZVwiLFxuXHRcIsSaXCI6IFwiRVwiLFxuXHRcIsSbXCI6IFwiZVwiLFxuXHRcIsScXCI6IFwiR1wiLFxuXHRcIse0XCI6IFwiR1wiLFxuXHRcIsSdXCI6IFwiZ1wiLFxuXHRcIse1XCI6IFwiZ1wiLFxuXHRcIsSeXCI6IFwiR1wiLFxuXHRcIsSfXCI6IFwiZ1wiLFxuXHRcIsSgXCI6IFwiR1wiLFxuXHRcIsShXCI6IFwiZ1wiLFxuXHRcIsSiXCI6IFwiR1wiLFxuXHRcIsSjXCI6IFwiZ1wiLFxuXHRcIsSkXCI6IFwiSFwiLFxuXHRcIsSlXCI6IFwiaFwiLFxuXHRcIsSmXCI6IFwiSFwiLFxuXHRcIsSnXCI6IFwiaFwiLFxuXHRcIuG4qlwiOiBcIkhcIixcblx0XCLhuKtcIjogXCJoXCIsXG5cdFwixKhcIjogXCJJXCIsXG5cdFwixKlcIjogXCJpXCIsXG5cdFwixKpcIjogXCJJXCIsXG5cdFwixKtcIjogXCJpXCIsXG5cdFwixKxcIjogXCJJXCIsXG5cdFwixK1cIjogXCJpXCIsXG5cdFwixK5cIjogXCJJXCIsXG5cdFwixK9cIjogXCJpXCIsXG5cdFwixLBcIjogXCJJXCIsXG5cdFwixLFcIjogXCJpXCIsXG5cdFwixLJcIjogXCJJSlwiLFxuXHRcIsSzXCI6IFwiaWpcIixcblx0XCLEtFwiOiBcIkpcIixcblx0XCLEtVwiOiBcImpcIixcblx0XCLEtlwiOiBcIktcIixcblx0XCLEt1wiOiBcImtcIixcblx0XCLhuLBcIjogXCJLXCIsXG5cdFwi4bixXCI6IFwia1wiLFxuXHRcIkvMhlwiOiBcIktcIixcblx0XCJrzIZcIjogXCJrXCIsXG5cdFwixLlcIjogXCJMXCIsXG5cdFwixLpcIjogXCJsXCIsXG5cdFwixLtcIjogXCJMXCIsXG5cdFwixLxcIjogXCJsXCIsXG5cdFwixL1cIjogXCJMXCIsXG5cdFwixL5cIjogXCJsXCIsXG5cdFwixL9cIjogXCJMXCIsXG5cdFwixYBcIjogXCJsXCIsXG5cdFwixYFcIjogXCJsXCIsXG5cdFwixYJcIjogXCJsXCIsXG5cdFwi4bi+XCI6IFwiTVwiLFxuXHRcIuG4v1wiOiBcIm1cIixcblx0XCJNzIZcIjogXCJNXCIsXG5cdFwibcyGXCI6IFwibVwiLFxuXHRcIsWDXCI6IFwiTlwiLFxuXHRcIsWEXCI6IFwiblwiLFxuXHRcIsWFXCI6IFwiTlwiLFxuXHRcIsWGXCI6IFwiblwiLFxuXHRcIsWHXCI6IFwiTlwiLFxuXHRcIsWIXCI6IFwiblwiLFxuXHRcIsWJXCI6IFwiblwiLFxuXHRcIk7MhlwiOiBcIk5cIixcblx0XCJuzIZcIjogXCJuXCIsXG5cdFwixYxcIjogXCJPXCIsXG5cdFwixY1cIjogXCJvXCIsXG5cdFwixY5cIjogXCJPXCIsXG5cdFwixY9cIjogXCJvXCIsXG5cdFwixZBcIjogXCJPXCIsXG5cdFwixZFcIjogXCJvXCIsXG5cdFwixZJcIjogXCJPRVwiLFxuXHRcIsWTXCI6IFwib2VcIixcblx0XCJQzIZcIjogXCJQXCIsXG5cdFwicMyGXCI6IFwicFwiLFxuXHRcIsWUXCI6IFwiUlwiLFxuXHRcIsWVXCI6IFwiclwiLFxuXHRcIsWWXCI6IFwiUlwiLFxuXHRcIsWXXCI6IFwiclwiLFxuXHRcIsWYXCI6IFwiUlwiLFxuXHRcIsWZXCI6IFwiclwiLFxuXHRcIlLMhlwiOiBcIlJcIixcblx0XCJyzIZcIjogXCJyXCIsXG5cdFwiyJJcIjogXCJSXCIsXG5cdFwiyJNcIjogXCJyXCIsXG5cdFwixZpcIjogXCJTXCIsXG5cdFwixZtcIjogXCJzXCIsXG5cdFwixZxcIjogXCJTXCIsXG5cdFwixZ1cIjogXCJzXCIsXG5cdFwixZ5cIjogXCJTXCIsXG5cdFwiyJhcIjogXCJTXCIsXG5cdFwiyJlcIjogXCJzXCIsXG5cdFwixZ9cIjogXCJzXCIsXG5cdFwixaBcIjogXCJTXCIsXG5cdFwixaFcIjogXCJzXCIsXG5cdFwixaJcIjogXCJUXCIsXG5cdFwixaNcIjogXCJ0XCIsXG5cdFwiyJtcIjogXCJ0XCIsXG5cdFwiyJpcIjogXCJUXCIsXG5cdFwixaRcIjogXCJUXCIsXG5cdFwixaVcIjogXCJ0XCIsXG5cdFwixaZcIjogXCJUXCIsXG5cdFwixadcIjogXCJ0XCIsXG5cdFwiVMyGXCI6IFwiVFwiLFxuXHRcInTMhlwiOiBcInRcIixcblx0XCLFqFwiOiBcIlVcIixcblx0XCLFqVwiOiBcInVcIixcblx0XCLFqlwiOiBcIlVcIixcblx0XCLFq1wiOiBcInVcIixcblx0XCLFrFwiOiBcIlVcIixcblx0XCLFrVwiOiBcInVcIixcblx0XCLFrlwiOiBcIlVcIixcblx0XCLFr1wiOiBcInVcIixcblx0XCLFsFwiOiBcIlVcIixcblx0XCLFsVwiOiBcInVcIixcblx0XCLFslwiOiBcIlVcIixcblx0XCLFs1wiOiBcInVcIixcblx0XCLIllwiOiBcIlVcIixcblx0XCLIl1wiOiBcInVcIixcblx0XCJWzIZcIjogXCJWXCIsXG5cdFwidsyGXCI6IFwidlwiLFxuXHRcIsW0XCI6IFwiV1wiLFxuXHRcIsW1XCI6IFwid1wiLFxuXHRcIuG6glwiOiBcIldcIixcblx0XCLhuoNcIjogXCJ3XCIsXG5cdFwiWMyGXCI6IFwiWFwiLFxuXHRcInjMhlwiOiBcInhcIixcblx0XCLFtlwiOiBcIllcIixcblx0XCLFt1wiOiBcInlcIixcblx0XCLFuFwiOiBcIllcIixcblx0XCJZzIZcIjogXCJZXCIsXG5cdFwiecyGXCI6IFwieVwiLFxuXHRcIsW5XCI6IFwiWlwiLFxuXHRcIsW6XCI6IFwielwiLFxuXHRcIsW7XCI6IFwiWlwiLFxuXHRcIsW8XCI6IFwielwiLFxuXHRcIsW9XCI6IFwiWlwiLFxuXHRcIsW+XCI6IFwielwiLFxuXHRcIsW/XCI6IFwic1wiLFxuXHRcIsaSXCI6IFwiZlwiLFxuXHRcIsagXCI6IFwiT1wiLFxuXHRcIsahXCI6IFwib1wiLFxuXHRcIsavXCI6IFwiVVwiLFxuXHRcIsawXCI6IFwidVwiLFxuXHRcIseNXCI6IFwiQVwiLFxuXHRcIseOXCI6IFwiYVwiLFxuXHRcIsePXCI6IFwiSVwiLFxuXHRcIseQXCI6IFwiaVwiLFxuXHRcIseRXCI6IFwiT1wiLFxuXHRcIseSXCI6IFwib1wiLFxuXHRcIseTXCI6IFwiVVwiLFxuXHRcIseUXCI6IFwidVwiLFxuXHRcIseVXCI6IFwiVVwiLFxuXHRcIseWXCI6IFwidVwiLFxuXHRcIseXXCI6IFwiVVwiLFxuXHRcIseYXCI6IFwidVwiLFxuXHRcIseZXCI6IFwiVVwiLFxuXHRcIseaXCI6IFwidVwiLFxuXHRcIsebXCI6IFwiVVwiLFxuXHRcIsecXCI6IFwidVwiLFxuXHRcIuG7qFwiOiBcIlVcIixcblx0XCLhu6lcIjogXCJ1XCIsXG5cdFwi4bm4XCI6IFwiVVwiLFxuXHRcIuG5uVwiOiBcInVcIixcblx0XCLHulwiOiBcIkFcIixcblx0XCLHu1wiOiBcImFcIixcblx0XCLHvFwiOiBcIkFFXCIsXG5cdFwix71cIjogXCJhZVwiLFxuXHRcIse+XCI6IFwiT1wiLFxuXHRcIse/XCI6IFwib1wiLFxuXHRcIsOeXCI6IFwiVEhcIixcblx0XCLDvlwiOiBcInRoXCIsXG5cdFwi4bmUXCI6IFwiUFwiLFxuXHRcIuG5lVwiOiBcInBcIixcblx0XCLhuaRcIjogXCJTXCIsXG5cdFwi4bmlXCI6IFwic1wiLFxuXHRcIljMgVwiOiBcIlhcIixcblx0XCJ4zIFcIjogXCJ4XCIsXG5cdFwi0INcIjogXCLQk1wiLFxuXHRcItGTXCI6IFwi0LNcIixcblx0XCLQjFwiOiBcItCaXCIsXG5cdFwi0ZxcIjogXCLQulwiLFxuXHRcIkHMi1wiOiBcIkFcIixcblx0XCJhzItcIjogXCJhXCIsXG5cdFwiRcyLXCI6IFwiRVwiLFxuXHRcImXMi1wiOiBcImVcIixcblx0XCJJzItcIjogXCJJXCIsXG5cdFwiacyLXCI6IFwiaVwiLFxuXHRcIse4XCI6IFwiTlwiLFxuXHRcIse5XCI6IFwiblwiLFxuXHRcIuG7klwiOiBcIk9cIixcblx0XCLhu5NcIjogXCJvXCIsXG5cdFwi4bmQXCI6IFwiT1wiLFxuXHRcIuG5kVwiOiBcIm9cIixcblx0XCLhu6pcIjogXCJVXCIsXG5cdFwi4burXCI6IFwidVwiLFxuXHRcIuG6gFwiOiBcIldcIixcblx0XCLhuoFcIjogXCJ3XCIsXG5cdFwi4buyXCI6IFwiWVwiLFxuXHRcIuG7s1wiOiBcInlcIixcblx0XCLIgFwiOiBcIkFcIixcblx0XCLIgVwiOiBcImFcIixcblx0XCLIhFwiOiBcIkVcIixcblx0XCLIhVwiOiBcImVcIixcblx0XCLIiFwiOiBcIklcIixcblx0XCLIiVwiOiBcImlcIixcblx0XCLIjFwiOiBcIk9cIixcblx0XCLIjVwiOiBcIm9cIixcblx0XCLIkFwiOiBcIlJcIixcblx0XCLIkVwiOiBcInJcIixcblx0XCLIlFwiOiBcIlVcIixcblx0XCLIlVwiOiBcInVcIixcblx0XCJCzIxcIjogXCJCXCIsXG5cdFwiYsyMXCI6IFwiYlwiLFxuXHRcIsSMzKNcIjogXCJDXCIsXG5cdFwixI3Mo1wiOiBcImNcIixcblx0XCLDisyMXCI6IFwiRVwiLFxuXHRcIsOqzIxcIjogXCJlXCIsXG5cdFwiRsyMXCI6IFwiRlwiLFxuXHRcImbMjFwiOiBcImZcIixcblx0XCLHplwiOiBcIkdcIixcblx0XCLHp1wiOiBcImdcIixcblx0XCLInlwiOiBcIkhcIixcblx0XCLIn1wiOiBcImhcIixcblx0XCJKzIxcIjogXCJKXCIsXG5cdFwix7BcIjogXCJqXCIsXG5cdFwix6hcIjogXCJLXCIsXG5cdFwix6lcIjogXCJrXCIsXG5cdFwiTcyMXCI6IFwiTVwiLFxuXHRcIm3MjFwiOiBcIm1cIixcblx0XCJQzIxcIjogXCJQXCIsXG5cdFwicMyMXCI6IFwicFwiLFxuXHRcIlHMjFwiOiBcIlFcIixcblx0XCJxzIxcIjogXCJxXCIsXG5cdFwixZjMqVwiOiBcIlJcIixcblx0XCLFmcypXCI6IFwiclwiLFxuXHRcIuG5plwiOiBcIlNcIixcblx0XCLhuadcIjogXCJzXCIsXG5cdFwiVsyMXCI6IFwiVlwiLFxuXHRcInbMjFwiOiBcInZcIixcblx0XCJXzIxcIjogXCJXXCIsXG5cdFwid8yMXCI6IFwid1wiLFxuXHRcIljMjFwiOiBcIlhcIixcblx0XCJ4zIxcIjogXCJ4XCIsXG5cdFwiWcyMXCI6IFwiWVwiLFxuXHRcInnMjFwiOiBcInlcIixcblx0XCJBzKdcIjogXCJBXCIsXG5cdFwiYcynXCI6IFwiYVwiLFxuXHRcIkLMp1wiOiBcIkJcIixcblx0XCJizKdcIjogXCJiXCIsXG5cdFwi4biQXCI6IFwiRFwiLFxuXHRcIuG4kVwiOiBcImRcIixcblx0XCLIqFwiOiBcIkVcIixcblx0XCLIqVwiOiBcImVcIixcblx0XCLGkMynXCI6IFwiRVwiLFxuXHRcIsmbzKdcIjogXCJlXCIsXG5cdFwi4bioXCI6IFwiSFwiLFxuXHRcIuG4qVwiOiBcImhcIixcblx0XCJJzKdcIjogXCJJXCIsXG5cdFwiacynXCI6IFwiaVwiLFxuXHRcIsaXzKdcIjogXCJJXCIsXG5cdFwiyajMp1wiOiBcImlcIixcblx0XCJNzKdcIjogXCJNXCIsXG5cdFwibcynXCI6IFwibVwiLFxuXHRcIk/Mp1wiOiBcIk9cIixcblx0XCJvzKdcIjogXCJvXCIsXG5cdFwiUcynXCI6IFwiUVwiLFxuXHRcInHMp1wiOiBcInFcIixcblx0XCJVzKdcIjogXCJVXCIsXG5cdFwidcynXCI6IFwidVwiLFxuXHRcIljMp1wiOiBcIlhcIixcblx0XCJ4zKdcIjogXCJ4XCIsXG5cdFwiWsynXCI6IFwiWlwiLFxuXHRcInrMp1wiOiBcInpcIixcblx0XCLQuVwiOlwi0LhcIixcblx0XCLQmVwiOlwi0JhcIixcblx0XCLRkVwiOlwi0LVcIixcblx0XCLQgVwiOlwi0JVcIixcbn07XG5cbnZhciBjaGFycyA9IE9iamVjdC5rZXlzKGNoYXJhY3Rlck1hcCkuam9pbignfCcpO1xudmFyIGFsbEFjY2VudHMgPSBuZXcgUmVnRXhwKGNoYXJzLCAnZycpO1xudmFyIGZpcnN0QWNjZW50ID0gbmV3IFJlZ0V4cChjaGFycywgJycpO1xuXG5mdW5jdGlvbiBtYXRjaGVyKG1hdGNoKSB7XG5cdHJldHVybiBjaGFyYWN0ZXJNYXBbbWF0Y2hdO1xufVxuXG52YXIgcmVtb3ZlQWNjZW50cyA9IGZ1bmN0aW9uKHN0cmluZykge1xuXHRyZXR1cm4gc3RyaW5nLnJlcGxhY2UoYWxsQWNjZW50cywgbWF0Y2hlcik7XG59O1xuXG52YXIgaGFzQWNjZW50cyA9IGZ1bmN0aW9uKHN0cmluZykge1xuXHRyZXR1cm4gISFzdHJpbmcubWF0Y2goZmlyc3RBY2NlbnQpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSByZW1vdmVBY2NlbnRzO1xubW9kdWxlLmV4cG9ydHMuaGFzID0gaGFzQWNjZW50cztcbm1vZHVsZS5leHBvcnRzLnJlbW92ZSA9IHJlbW92ZUFjY2VudHM7XG4iLCJpbXBvcnQgeyBCaWcgfSBmcm9tIFwiYmlnLmpzXCI7XG5pbXBvcnQgeyBtYXRjaFNvcnRlciwgTWF0Y2hTb3J0ZXJPcHRpb25zIH0gZnJvbSBcIm1hdGNoLXNvcnRlclwiO1xuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgUHJvcHNXaXRoQ2hpbGRyZW4sIFJlYWN0RWxlbWVudCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgR3JvdXBlZENvbWJvYm94UHJldmlld1Byb3BzLCBGaWx0ZXJUeXBlRW51bSwgU2VsZWN0ZWRJdGVtc1NvcnRpbmdFbnVtIH0gZnJvbSBcInR5cGluZ3MvR3JvdXBlZENvbWJvYm94UHJvcHNcIjtcbmltcG9ydCB7IE11bHRpU2VsZWN0b3IsIFNvcnRPcmRlciB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBPYmplY3RJdGVtIH0gZnJvbSBcIm1lbmRpeFwiO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9MSU1JVF9TSVpFID0gMTAwO1xuXG50eXBlIFZhbHVlVHlwZSA9IHN0cmluZyB8IEJpZyB8IGJvb2xlYW4gfCBEYXRlIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VsZWN0ZWRDYXB0aW9uc1BsYWNlaG9sZGVyKHNlbGVjdG9yOiBNdWx0aVNlbGVjdG9yLCBzZWxlY3RlZEl0ZW1zOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgaWYgKHNlbGVjdGVkSXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3Rvci5jYXB0aW9uLmVtcHR5Q2FwdGlvbjtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAgIHNlbGVjdG9yLnNlbGVjdGVkSXRlbXNTdHlsZSAhPT0gXCJ0ZXh0XCIgfHxcbiAgICAgICAgc2VsZWN0b3IuY3VzdG9tQ29udGVudFR5cGUgPT09IFwieWVzXCIgfHxcbiAgICAgICAgc2VsZWN0b3Iuc2VsZWN0aW9uTWV0aG9kID09PSBcInJvd2NsaWNrXCJcbiAgICApIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxlY3RlZEl0ZW1zLm1hcCh2ID0+IHNlbGVjdG9yLmNhcHRpb24uZ2V0KHYpKTtcblxuICAgIHJldHVybiBzZWxlY3RlZC5qb2luKFwiLCBcIik7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FwdGlvbkNvbnRlbnRQcm9wcyBleHRlbmRzIFByb3BzV2l0aENoaWxkcmVuIHtcbiAgICBodG1sRm9yPzogc3RyaW5nO1xuICAgIG9uQ2xpY2s/OiAoZTogTW91c2VFdmVudCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENhcHRpb25Db250ZW50KHByb3BzOiBDYXB0aW9uQ29udGVudFByb3BzKTogUmVhY3RFbGVtZW50IHtcbiAgICBjb25zdCB7IGh0bWxGb3IsIGNoaWxkcmVuLCBvbkNsaWNrIH0gPSBwcm9wcztcbiAgICByZXR1cm4gY3JlYXRlRWxlbWVudChodG1sRm9yID09IG51bGwgPyBcInNwYW5cIiA6IFwibGFiZWxcIiwge1xuICAgICAgICBjaGlsZHJlbixcbiAgICAgICAgY2xhc3NOYW1lOiBcIndpZGdldC1jb21ib2JveC1jYXB0aW9uLXRleHRcIixcbiAgICAgICAgaHRtbEZvcixcbiAgICAgICAgb25DbGljazogb25DbGlja1xuICAgICAgICAgICAgPyBvbkNsaWNrXG4gICAgICAgICAgICA6IGh0bWxGb3JcbiAgICAgICAgICAgICAgPyAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICA6IHVuZGVmaW5lZFxuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YXNvdXJjZVBsYWNlaG9sZGVyVGV4dChhcmdzOiBHcm91cGVkQ29tYm9ib3hQcmV2aWV3UHJvcHMpOiBzdHJpbmcge1xuICAgIGNvbnN0IHtcbiAgICAgICAgb3B0aW9uc1NvdXJjZVR5cGUsXG4gICAgICAgIG9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkRhdGFTb3VyY2UsXG4gICAgICAgIGF0dHJpYnV0ZUVudW1lcmF0aW9uLFxuICAgICAgICBhdHRyaWJ1dGVCb29sZWFuLFxuICAgICAgICBkYXRhYmFzZUF0dHJpYnV0ZVN0cmluZyxcbiAgICAgICAgZW1wdHlPcHRpb25UZXh0LFxuICAgICAgICBzb3VyY2UsXG4gICAgICAgIG9wdGlvbnNTb3VyY2VEYXRhYmFzZURhdGFTb3VyY2UsXG4gICAgICAgIHN0YXRpY0F0dHJpYnV0ZSxcbiAgICAgICAgb3B0aW9uc1NvdXJjZVN0YXRpY0RhdGFTb3VyY2VcbiAgICB9ID0gYXJncztcbiAgICBjb25zdCBlbXB0eVN0cmluZ0Zvcm1hdCA9IGVtcHR5T3B0aW9uVGV4dCA/IGBbJHtlbXB0eU9wdGlvblRleHR9XWAgOiBcIkNvbWJvIGJveFwiO1xuICAgIGlmIChzb3VyY2UgPT09IFwiY29udGV4dFwiKSB7XG4gICAgICAgIHN3aXRjaCAob3B0aW9uc1NvdXJjZVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJhc3NvY2lhdGlvblwiOlxuICAgICAgICAgICAgICAgIHJldHVybiAob3B0aW9uc1NvdXJjZUFzc29jaWF0aW9uRGF0YVNvdXJjZSBhcyB7IGNhcHRpb24/OiBzdHJpbmcgfSk/LmNhcHRpb24gfHwgZW1wdHlTdHJpbmdGb3JtYXQ7XG4gICAgICAgICAgICBjYXNlIFwiZW51bWVyYXRpb25cIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gYFske29wdGlvbnNTb3VyY2VUeXBlfSwgJHthdHRyaWJ1dGVFbnVtZXJhdGlvbn1dYDtcbiAgICAgICAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGBbJHtvcHRpb25zU291cmNlVHlwZX0sICR7YXR0cmlidXRlQm9vbGVhbn1dYDtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVtcHR5U3RyaW5nRm9ybWF0O1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChzb3VyY2UgPT09IFwiZGF0YWJhc2VcIiAmJiBvcHRpb25zU291cmNlRGF0YWJhc2VEYXRhU291cmNlKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAob3B0aW9uc1NvdXJjZURhdGFiYXNlRGF0YVNvdXJjZSBhcyB7IGNhcHRpb24/OiBzdHJpbmcgfSk/LmNhcHRpb24gfHxcbiAgICAgICAgICAgIGAke3NvdXJjZX0sICR7ZGF0YWJhc2VBdHRyaWJ1dGVTdHJpbmd9YFxuICAgICAgICApO1xuICAgIH0gZWxzZSBpZiAoc291cmNlID09PSBcInN0YXRpY1wiKSB7XG4gICAgICAgIHJldHVybiAob3B0aW9uc1NvdXJjZVN0YXRpY0RhdGFTb3VyY2UgYXMgeyBjYXB0aW9uPzogc3RyaW5nIH0pPy5jYXB0aW9uIHx8IGBbJHtzb3VyY2V9LCAke3N0YXRpY0F0dHJpYnV0ZX1dYDtcbiAgICB9XG4gICAgcmV0dXJuIGVtcHR5U3RyaW5nRm9ybWF0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsdGVyVHlwZU9wdGlvbnMoZmlsdGVyOiBGaWx0ZXJUeXBlRW51bSk6IE1hdGNoU29ydGVyT3B0aW9uczxzdHJpbmc+IHtcbiAgICBzd2l0Y2ggKGZpbHRlcikge1xuICAgICAgICBjYXNlIFwiY29udGFpbnNcIjpcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgY2FzZSBcImNvbnRhaW5zRXhhY3RcIjpcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGhyZXNob2xkOiBtYXRjaFNvcnRlci5yYW5raW5ncy5DT05UQUlOU1xuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSBcInN0YXJ0c1dpdGhcIjpcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGhyZXNob2xkOiBtYXRjaFNvcnRlci5yYW5raW5ncy5XT1JEX1NUQVJUU19XSVRIXG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIFwibm9uZVwiOlxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0aHJlc2hvbGQ6IG1hdGNoU29ydGVyLnJhbmtpbmdzLk5PX01BVENIXG4gICAgICAgICAgICB9O1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF92YWx1ZXNJc0VxdWFsKHZhbHVlQTogVmFsdWVUeXBlLCB2YWx1ZUI6IFZhbHVlVHlwZSk6IGJvb2xlYW4ge1xuICAgIGlmICh2YWx1ZUEgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZUIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdmFsdWVBID09PSB2YWx1ZUI7XG4gICAgfVxuICAgIGlmICh2YWx1ZUEgaW5zdGFuY2VvZiBCaWcgJiYgdmFsdWVCIGluc3RhbmNlb2YgQmlnKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZUEuZXEodmFsdWVCKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlQSBpbnN0YW5jZW9mIERhdGUgJiYgdmFsdWVCIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWVBLmdldFRpbWUoKSA9PT0gdmFsdWVCLmdldFRpbWUoKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlQSA9PT0gdmFsdWVCO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc29ydFNlbGVjdGVkSXRlbXMoXG4gICAgdmFsdWVzOiBPYmplY3RJdGVtW10gfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgIHNvcnRpbmdUeXBlOiBTZWxlY3RlZEl0ZW1zU29ydGluZ0VudW0sXG4gICAgc29ydE9yZGVyOiBTb3J0T3JkZXIsXG4gICAgY2FwdGlvbkdldHRlcjogKGlkOiBzdHJpbmcpID0+IHN0cmluZyB8IHVuZGVmaW5lZFxuKTogc3RyaW5nW10gfCBudWxsIHtcbiAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJldHVybiBzb3J0U2VsZWN0aW9ucyhcbiAgICAgICAgICAgIHZhbHVlcy5tYXAodiA9PiAodj8uaWQgYXMgc3RyaW5nKSA/PyBudWxsKSxcbiAgICAgICAgICAgIHNvcnRpbmdUeXBlLFxuICAgICAgICAgICAgc29ydE9yZGVyLFxuICAgICAgICAgICAgY2FwdGlvbkdldHRlclxuICAgICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc29ydFNlbGVjdGlvbnMoXG4gICAgbmV3VmFsdWVJZHM6IHN0cmluZ1tdLFxuICAgIHNvcnRpbmdUeXBlOiBTZWxlY3RlZEl0ZW1zU29ydGluZ0VudW0sXG4gICAgc29ydE9yZGVyOiBTb3J0T3JkZXIsXG4gICAgY2FwdGlvbkdldHRlcjogKGlkOiBzdHJpbmcpID0+IHN0cmluZyB8IHVuZGVmaW5lZFxuKTogc3RyaW5nW10ge1xuICAgIGlmIChzb3J0aW5nVHlwZSA9PT0gXCJjYXB0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIG5ld1ZhbHVlSWRzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhcHRpb25BID0gY2FwdGlvbkdldHRlcihhKT8udG9TdHJpbmcoKSA/PyBcIlwiO1xuICAgICAgICAgICAgY29uc3QgY2FwdGlvbkIgPSBjYXB0aW9uR2V0dGVyKGIpPy50b1N0cmluZygpID8/IFwiXCI7XG4gICAgICAgICAgICByZXR1cm4gc29ydE9yZGVyID09PSBcImFzY1wiID8gY2FwdGlvbkEubG9jYWxlQ29tcGFyZShjYXB0aW9uQikgOiBjYXB0aW9uQi5sb2NhbGVDb21wYXJlKGNhcHRpb25BKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBuZXdWYWx1ZUlkcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldElucHV0TGFiZWwoaW5wdXRJZDogc3RyaW5nKTogRWxlbWVudCB8IG51bGwge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBsYWJlbFtmb3I9XCIke0NTUy5lc2NhcGUoaW5wdXRJZCl9XCJdYCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRWYWxpZGF0aW9uRXJyb3JJZChpbnB1dElkPzogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gaW5wdXRJZCA/IGlucHV0SWQgKyBcIi12YWxpZGF0aW9uLW1lc3NhZ2VcIiA6IHVuZGVmaW5lZDtcbn1cbiIsImltcG9ydCBjbGFzc05hbWVzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgeyBGcmFnbWVudCwgTW91c2VFdmVudCwgUmVhY3RFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBDYXB0aW9uQ29udGVudCB9IGZyb20gXCIuLi9oZWxwZXJzL3V0aWxzXCI7XG5leHBvcnQgZnVuY3Rpb24gQ2xlYXJCdXR0b24oeyBzaXplID0gMTQgfSk6IFJlYWN0RWxlbWVudCB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94LWljb24tY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8c3ZnIHdpZHRoPXtzaXplfSBoZWlnaHQ9e3NpemV9IHZpZXdCb3g9XCIwIDAgMzIgMzJcIiBjbGFzc05hbWU9XCJ3aWRnZXQtY29tYm9ib3gtY2xlYXItYnV0dG9uLWljb25cIj5cbiAgICAgICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgICAgIGQ9XCJNMjcuNzEgNS43MTAwNEwyNi4yOSA0LjI5MDA0TDE2IDE0LjU5TDUuNzEwMDQgNC4yOTAwNEw0LjI5MDA0IDUuNzEwMDRMMTQuNTkgMTZMNC4yOTAwNCAyNi4yOUw1LjcxMDA0IDI3LjcxTDE2IDE3LjQxTDI2LjI5IDI3LjcxTDI3LjcxIDI2LjI5TDE3LjQxIDE2TDI3LjcxIDUuNzEwMDRaXCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvc3Bhbj5cbiAgICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRG93bkFycm93KHsgaXNPcGVuIH06IHsgaXNPcGVuPzogYm9vbGVhbiB9KTogUmVhY3RFbGVtZW50IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ3aWRnZXQtY29tYm9ib3gtaWNvbi1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXCJ3aWRnZXQtY29tYm9ib3gtZG93bi1hcnJvdy1pY29uXCIsIFwibXgtaWNvbi1saW5lZFwiLCBcIm14LWljb24tY2hldnJvbi1kb3duXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlOiBpc09wZW5cbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB3aWR0aD1cIjE2XCJcbiAgICAgICAgICAgICAgICBoZWlnaHQ9XCIxNlwiXG4gICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAzMiAzMlwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xNiAyMy40MUw0LjI5MDA0IDExLjcxTDUuNzEwMDQgMTAuMjlMMTYgMjAuNTlMMjYuMjkgMTAuMjlMMjcuNzEgMTEuNzFMMTYgMjMuNDFaXCIgLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L3NwYW4+XG4gICAgKTtcbn1cblxuaW50ZXJmYWNlIENoZWNrYm94UHJvcHMge1xuICAgIGNoZWNrZWQ6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gICAgaWQ/OiBzdHJpbmc7XG4gICAgZm9jdXNhYmxlPzogYm9vbGVhbjtcbiAgICBvbkNsaWNrPzogKGU6IE1vdXNlRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+IHZvaWQ7XG4gICAgYXJpYUxhYmVsPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ2hlY2tib3goeyBjaGVja2VkLCBpZCwgZm9jdXNhYmxlLCBvbkNsaWNrLCBhcmlhTGFiZWwgfTogQ2hlY2tib3hQcm9wcyk6IFJlYWN0RWxlbWVudCB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94LWljb24tY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICAgIHRhYkluZGV4PXtmb2N1c2FibGUgPyAwIDogLTF9XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e2NoZWNrZWR9XG4gICAgICAgICAgICAgICAgICAgIGlkPXtpZH1cbiAgICAgICAgICAgICAgICAgICAgcm9sZT1cInByZXNlbnRhdGlvblwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e1xuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGlja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gb25DbGlja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKGU6IE1vdXNlRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eygpID0+IHt9fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICB7YXJpYUxhYmVsID8gPENhcHRpb25Db250ZW50IGh0bWxGb3I9e2lkfT57YXJpYUxhYmVsfTwvQ2FwdGlvbkNvbnRlbnQ+IDogdW5kZWZpbmVkfVxuICAgICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG59XG4iLCJmdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShyLCBlKSB7XG4gIGlmIChudWxsID09IHIpIHJldHVybiB7fTtcbiAgdmFyIHQgPSB7fTtcbiAgZm9yICh2YXIgbiBpbiByKSBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChyLCBuKSkge1xuICAgIGlmICgtMSAhPT0gZS5pbmRleE9mKG4pKSBjb250aW51ZTtcbiAgICB0W25dID0gcltuXTtcbiAgfVxuICByZXR1cm4gdDtcbn1cbmV4cG9ydCB7IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlIGFzIGRlZmF1bHQgfTsiLCJmdW5jdGlvbiBfZXh0ZW5kcygpIHtcbiAgcmV0dXJuIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiA/IE9iamVjdC5hc3NpZ24uYmluZCgpIDogZnVuY3Rpb24gKG4pIHtcbiAgICBmb3IgKHZhciBlID0gMTsgZSA8IGFyZ3VtZW50cy5sZW5ndGg7IGUrKykge1xuICAgICAgdmFyIHQgPSBhcmd1bWVudHNbZV07XG4gICAgICBmb3IgKHZhciByIGluIHQpICh7fSkuaGFzT3duUHJvcGVydHkuY2FsbCh0LCByKSAmJiAobltyXSA9IHRbcl0pO1xuICAgIH1cbiAgICByZXR1cm4gbjtcbiAgfSwgX2V4dGVuZHMuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbn1cbmV4cG9ydCB7IF9leHRlbmRzIGFzIGRlZmF1bHQgfTsiLCJmdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKGUpIHtcbiAgaWYgKHZvaWQgMCA9PT0gZSkgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICByZXR1cm4gZTtcbn1cbmV4cG9ydCB7IF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQgYXMgZGVmYXVsdCB9OyIsImZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZih0LCBlKSB7XG4gIHJldHVybiBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2YuYmluZCgpIDogZnVuY3Rpb24gKHQsIGUpIHtcbiAgICByZXR1cm4gdC5fX3Byb3RvX18gPSBlLCB0O1xuICB9LCBfc2V0UHJvdG90eXBlT2YodCwgZSk7XG59XG5leHBvcnQgeyBfc2V0UHJvdG90eXBlT2YgYXMgZGVmYXVsdCB9OyIsImltcG9ydCBzZXRQcm90b3R5cGVPZiBmcm9tIFwiLi9zZXRQcm90b3R5cGVPZi5qc1wiO1xuZnVuY3Rpb24gX2luaGVyaXRzTG9vc2UodCwgbykge1xuICB0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoby5wcm90b3R5cGUpLCB0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHQsIHNldFByb3RvdHlwZU9mKHQsIG8pO1xufVxuZXhwb3J0IHsgX2luaGVyaXRzTG9vc2UgYXMgZGVmYXVsdCB9OyIsIi8qKiBAbGljZW5zZSBSZWFjdCB2MTYuMTMuMVxuICogcmVhY3QtaXMuZGV2ZWxvcG1lbnQuanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cblxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIChmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuLy8gVGhlIFN5bWJvbCB1c2VkIHRvIHRhZyB0aGUgUmVhY3RFbGVtZW50LWxpa2UgdHlwZXMuIElmIHRoZXJlIGlzIG5vIG5hdGl2ZSBTeW1ib2xcbi8vIG5vciBwb2x5ZmlsbCwgdGhlbiBhIHBsYWluIG51bWJlciBpcyB1c2VkIGZvciBwZXJmb3JtYW5jZS5cbnZhciBoYXNTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5mb3I7XG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpIDogMHhlYWM3O1xudmFyIFJFQUNUX1BPUlRBTF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucG9ydGFsJykgOiAweGVhY2E7XG52YXIgUkVBQ1RfRlJBR01FTlRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmZyYWdtZW50JykgOiAweGVhY2I7XG52YXIgUkVBQ1RfU1RSSUNUX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnN0cmljdF9tb2RlJykgOiAweGVhY2M7XG52YXIgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnByb2ZpbGVyJykgOiAweGVhZDI7XG52YXIgUkVBQ1RfUFJPVklERVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnByb3ZpZGVyJykgOiAweGVhY2Q7XG52YXIgUkVBQ1RfQ09OVEVYVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuY29udGV4dCcpIDogMHhlYWNlOyAvLyBUT0RPOiBXZSBkb24ndCB1c2UgQXN5bmNNb2RlIG9yIENvbmN1cnJlbnRNb2RlIGFueW1vcmUuIFRoZXkgd2VyZSB0ZW1wb3Jhcnlcbi8vICh1bnN0YWJsZSkgQVBJcyB0aGF0IGhhdmUgYmVlbiByZW1vdmVkLiBDYW4gd2UgcmVtb3ZlIHRoZSBzeW1ib2xzP1xuXG52YXIgUkVBQ1RfQVNZTkNfTU9ERV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuYXN5bmNfbW9kZScpIDogMHhlYWNmO1xudmFyIFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuY29uY3VycmVudF9tb2RlJykgOiAweGVhY2Y7XG52YXIgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmZvcndhcmRfcmVmJykgOiAweGVhZDA7XG52YXIgUkVBQ1RfU1VTUEVOU0VfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnN1c3BlbnNlJykgOiAweGVhZDE7XG52YXIgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3Quc3VzcGVuc2VfbGlzdCcpIDogMHhlYWQ4O1xudmFyIFJFQUNUX01FTU9fVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0Lm1lbW8nKSA6IDB4ZWFkMztcbnZhciBSRUFDVF9MQVpZX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5sYXp5JykgOiAweGVhZDQ7XG52YXIgUkVBQ1RfQkxPQ0tfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmJsb2NrJykgOiAweGVhZDk7XG52YXIgUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmZ1bmRhbWVudGFsJykgOiAweGVhZDU7XG52YXIgUkVBQ1RfUkVTUE9OREVSX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5yZXNwb25kZXInKSA6IDB4ZWFkNjtcbnZhciBSRUFDVF9TQ09QRV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3Quc2NvcGUnKSA6IDB4ZWFkNztcblxuZnVuY3Rpb24gaXNWYWxpZEVsZW1lbnRUeXBlKHR5cGUpIHtcbiAgcmV0dXJuIHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCAvLyBOb3RlOiBpdHMgdHlwZW9mIG1pZ2h0IGJlIG90aGVyIHRoYW4gJ3N5bWJvbCcgb3IgJ251bWJlcicgaWYgaXQncyBhIHBvbHlmaWxsLlxuICB0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1BST0ZJTEVSX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSB8fCB0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gbnVsbCAmJiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTEFaWV9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9QUk9WSURFUl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0NPTlRFWFRfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfUkVTUE9OREVSX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfU0NPUEVfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9CTE9DS19UWVBFKTtcbn1cblxuZnVuY3Rpb24gdHlwZU9mKG9iamVjdCkge1xuICBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0ICE9PSBudWxsKSB7XG4gICAgdmFyICQkdHlwZW9mID0gb2JqZWN0LiQkdHlwZW9mO1xuXG4gICAgc3dpdGNoICgkJHR5cGVvZikge1xuICAgICAgY2FzZSBSRUFDVF9FTEVNRU5UX1RZUEU6XG4gICAgICAgIHZhciB0eXBlID0gb2JqZWN0LnR5cGU7XG5cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgY2FzZSBSRUFDVF9BU1lOQ19NT0RFX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX0ZSQUdNRU5UX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9QUk9GSUxFUl9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfU1RSSUNUX01PREVfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX1RZUEU6XG4gICAgICAgICAgICByZXR1cm4gdHlwZTtcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2YXIgJCR0eXBlb2ZUeXBlID0gdHlwZSAmJiB0eXBlLiQkdHlwZW9mO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKCQkdHlwZW9mVHlwZSkge1xuICAgICAgICAgICAgICBjYXNlIFJFQUNUX0NPTlRFWFRfVFlQRTpcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFOlxuICAgICAgICAgICAgICBjYXNlIFJFQUNUX0xBWllfVFlQRTpcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9NRU1PX1RZUEU6XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfUFJPVklERVJfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gJCR0eXBlb2ZUeXBlO1xuXG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuICQkdHlwZW9mO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgICAgcmV0dXJuICQkdHlwZW9mO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59IC8vIEFzeW5jTW9kZSBpcyBkZXByZWNhdGVkIGFsb25nIHdpdGggaXNBc3luY01vZGVcblxudmFyIEFzeW5jTW9kZSA9IFJFQUNUX0FTWU5DX01PREVfVFlQRTtcbnZhciBDb25jdXJyZW50TW9kZSA9IFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFO1xudmFyIENvbnRleHRDb25zdW1lciA9IFJFQUNUX0NPTlRFWFRfVFlQRTtcbnZhciBDb250ZXh0UHJvdmlkZXIgPSBSRUFDVF9QUk9WSURFUl9UWVBFO1xudmFyIEVsZW1lbnQgPSBSRUFDVF9FTEVNRU5UX1RZUEU7XG52YXIgRm9yd2FyZFJlZiA9IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU7XG52YXIgRnJhZ21lbnQgPSBSRUFDVF9GUkFHTUVOVF9UWVBFO1xudmFyIExhenkgPSBSRUFDVF9MQVpZX1RZUEU7XG52YXIgTWVtbyA9IFJFQUNUX01FTU9fVFlQRTtcbnZhciBQb3J0YWwgPSBSRUFDVF9QT1JUQUxfVFlQRTtcbnZhciBQcm9maWxlciA9IFJFQUNUX1BST0ZJTEVSX1RZUEU7XG52YXIgU3RyaWN0TW9kZSA9IFJFQUNUX1NUUklDVF9NT0RFX1RZUEU7XG52YXIgU3VzcGVuc2UgPSBSRUFDVF9TVVNQRU5TRV9UWVBFO1xudmFyIGhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlID0gZmFsc2U7IC8vIEFzeW5jTW9kZSBzaG91bGQgYmUgZGVwcmVjYXRlZFxuXG5mdW5jdGlvbiBpc0FzeW5jTW9kZShvYmplY3QpIHtcbiAge1xuICAgIGlmICghaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNBc3luY01vZGUpIHtcbiAgICAgIGhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlID0gdHJ1ZTsgLy8gVXNpbmcgY29uc29sZVsnd2FybiddIHRvIGV2YWRlIEJhYmVsIGFuZCBFU0xpbnRcblxuICAgICAgY29uc29sZVsnd2FybiddKCdUaGUgUmVhY3RJcy5pc0FzeW5jTW9kZSgpIGFsaWFzIGhhcyBiZWVuIGRlcHJlY2F0ZWQsICcgKyAnYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZWFjdCAxNysuIFVwZGF0ZSB5b3VyIGNvZGUgdG8gdXNlICcgKyAnUmVhY3RJcy5pc0NvbmN1cnJlbnRNb2RlKCkgaW5zdGVhZC4gSXQgaGFzIHRoZSBleGFjdCBzYW1lIEFQSS4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaXNDb25jdXJyZW50TW9kZShvYmplY3QpIHx8IHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9BU1lOQ19NT0RFX1RZUEU7XG59XG5mdW5jdGlvbiBpc0NvbmN1cnJlbnRNb2RlKG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFO1xufVxuZnVuY3Rpb24gaXNDb250ZXh0Q29uc3VtZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfQ09OVEVYVF9UWVBFO1xufVxuZnVuY3Rpb24gaXNDb250ZXh0UHJvdmlkZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUFJPVklERVJfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzRWxlbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdCAhPT0gbnVsbCAmJiBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzRm9yd2FyZFJlZihvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFO1xufVxuZnVuY3Rpb24gaXNGcmFnbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFO1xufVxuZnVuY3Rpb24gaXNMYXp5KG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0xBWllfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzTWVtbyhvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9NRU1PX1RZUEU7XG59XG5mdW5jdGlvbiBpc1BvcnRhbChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9QT1JUQUxfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzUHJvZmlsZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUFJPRklMRVJfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzU3RyaWN0TW9kZShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFO1xufVxuZnVuY3Rpb24gaXNTdXNwZW5zZShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFO1xufVxuXG5leHBvcnRzLkFzeW5jTW9kZSA9IEFzeW5jTW9kZTtcbmV4cG9ydHMuQ29uY3VycmVudE1vZGUgPSBDb25jdXJyZW50TW9kZTtcbmV4cG9ydHMuQ29udGV4dENvbnN1bWVyID0gQ29udGV4dENvbnN1bWVyO1xuZXhwb3J0cy5Db250ZXh0UHJvdmlkZXIgPSBDb250ZXh0UHJvdmlkZXI7XG5leHBvcnRzLkVsZW1lbnQgPSBFbGVtZW50O1xuZXhwb3J0cy5Gb3J3YXJkUmVmID0gRm9yd2FyZFJlZjtcbmV4cG9ydHMuRnJhZ21lbnQgPSBGcmFnbWVudDtcbmV4cG9ydHMuTGF6eSA9IExhenk7XG5leHBvcnRzLk1lbW8gPSBNZW1vO1xuZXhwb3J0cy5Qb3J0YWwgPSBQb3J0YWw7XG5leHBvcnRzLlByb2ZpbGVyID0gUHJvZmlsZXI7XG5leHBvcnRzLlN0cmljdE1vZGUgPSBTdHJpY3RNb2RlO1xuZXhwb3J0cy5TdXNwZW5zZSA9IFN1c3BlbnNlO1xuZXhwb3J0cy5pc0FzeW5jTW9kZSA9IGlzQXN5bmNNb2RlO1xuZXhwb3J0cy5pc0NvbmN1cnJlbnRNb2RlID0gaXNDb25jdXJyZW50TW9kZTtcbmV4cG9ydHMuaXNDb250ZXh0Q29uc3VtZXIgPSBpc0NvbnRleHRDb25zdW1lcjtcbmV4cG9ydHMuaXNDb250ZXh0UHJvdmlkZXIgPSBpc0NvbnRleHRQcm92aWRlcjtcbmV4cG9ydHMuaXNFbGVtZW50ID0gaXNFbGVtZW50O1xuZXhwb3J0cy5pc0ZvcndhcmRSZWYgPSBpc0ZvcndhcmRSZWY7XG5leHBvcnRzLmlzRnJhZ21lbnQgPSBpc0ZyYWdtZW50O1xuZXhwb3J0cy5pc0xhenkgPSBpc0xhenk7XG5leHBvcnRzLmlzTWVtbyA9IGlzTWVtbztcbmV4cG9ydHMuaXNQb3J0YWwgPSBpc1BvcnRhbDtcbmV4cG9ydHMuaXNQcm9maWxlciA9IGlzUHJvZmlsZXI7XG5leHBvcnRzLmlzU3RyaWN0TW9kZSA9IGlzU3RyaWN0TW9kZTtcbmV4cG9ydHMuaXNTdXNwZW5zZSA9IGlzU3VzcGVuc2U7XG5leHBvcnRzLmlzVmFsaWRFbGVtZW50VHlwZSA9IGlzVmFsaWRFbGVtZW50VHlwZTtcbmV4cG9ydHMudHlwZU9mID0gdHlwZU9mO1xuICB9KSgpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LWlzLnByb2R1Y3Rpb24ubWluLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LWlzLmRldmVsb3BtZW50LmpzJyk7XG59XG4iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9ICdTRUNSRVRfRE9fTk9UX1BBU1NfVEhJU19PUl9ZT1VfV0lMTF9CRV9GSVJFRCc7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RQcm9wVHlwZXNTZWNyZXQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEZ1bmN0aW9uLmNhbGwuYmluZChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24oKSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gcmVxdWlyZSgnLi9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcbiAgdmFyIGxvZ2dlZFR5cGVGYWlsdXJlcyA9IHt9O1xuICB2YXIgaGFzID0gcmVxdWlyZSgnLi9saWIvaGFzJyk7XG5cbiAgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyB0ZXh0O1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHsgLyoqLyB9XG4gIH07XG59XG5cbi8qKlxuICogQXNzZXJ0IHRoYXQgdGhlIHZhbHVlcyBtYXRjaCB3aXRoIHRoZSB0eXBlIHNwZWNzLlxuICogRXJyb3IgbWVzc2FnZXMgYXJlIG1lbW9yaXplZCBhbmQgd2lsbCBvbmx5IGJlIHNob3duIG9uY2UuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHR5cGVTcGVjcyBNYXAgb2YgbmFtZSB0byBhIFJlYWN0UHJvcFR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZXMgUnVudGltZSB2YWx1ZXMgdGhhdCBuZWVkIHRvIGJlIHR5cGUtY2hlY2tlZFxuICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uIGUuZy4gXCJwcm9wXCIsIFwiY29udGV4dFwiLCBcImNoaWxkIGNvbnRleHRcIlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbXBvbmVudE5hbWUgTmFtZSBvZiB0aGUgY29tcG9uZW50IGZvciBlcnJvciBtZXNzYWdlcy5cbiAqIEBwYXJhbSB7P0Z1bmN0aW9ufSBnZXRTdGFjayBSZXR1cm5zIHRoZSBjb21wb25lbnQgc3RhY2suXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjaGVja1Byb3BUeXBlcyh0eXBlU3BlY3MsIHZhbHVlcywgbG9jYXRpb24sIGNvbXBvbmVudE5hbWUsIGdldFN0YWNrKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgZm9yICh2YXIgdHlwZVNwZWNOYW1lIGluIHR5cGVTcGVjcykge1xuICAgICAgaWYgKGhhcyh0eXBlU3BlY3MsIHR5cGVTcGVjTmFtZSkpIHtcbiAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAvLyBQcm9wIHR5cGUgdmFsaWRhdGlvbiBtYXkgdGhyb3cuIEluIGNhc2UgdGhleSBkbywgd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgICAvLyBmYWlsIHRoZSByZW5kZXIgcGhhc2Ugd2hlcmUgaXQgZGlkbid0IGZhaWwgYmVmb3JlLiBTbyB3ZSBsb2cgaXQuXG4gICAgICAgIC8vIEFmdGVyIHRoZXNlIGhhdmUgYmVlbiBjbGVhbmVkIHVwLCB3ZSdsbCBsZXQgdGhlbSB0aHJvdy5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBUaGlzIGlzIGludGVudGlvbmFsbHkgYW4gaW52YXJpYW50IHRoYXQgZ2V0cyBjYXVnaHQuIEl0J3MgdGhlIHNhbWVcbiAgICAgICAgICAvLyBiZWhhdmlvciBhcyB3aXRob3V0IHRoaXMgc3RhdGVtZW50IGV4Y2VwdCB3aXRoIGEgYmV0dGVyIG1lc3NhZ2UuXG4gICAgICAgICAgaWYgKHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIGVyciA9IEVycm9yKFxuICAgICAgICAgICAgICAoY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnKSArICc6ICcgKyBsb2NhdGlvbiArICcgdHlwZSBgJyArIHR5cGVTcGVjTmFtZSArICdgIGlzIGludmFsaWQ7ICcgK1xuICAgICAgICAgICAgICAnaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLCBidXQgcmVjZWl2ZWQgYCcgKyB0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gKyAnYC4nICtcbiAgICAgICAgICAgICAgJ1RoaXMgb2Z0ZW4gaGFwcGVucyBiZWNhdXNlIG9mIHR5cG9zIHN1Y2ggYXMgYFByb3BUeXBlcy5mdW5jdGlvbmAgaW5zdGVhZCBvZiBgUHJvcFR5cGVzLmZ1bmNgLidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBlcnIubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZXJyb3IgPSB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSh2YWx1ZXMsIHR5cGVTcGVjTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIG51bGwsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBlcnJvciA9IGV4O1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnJvciAmJiAhKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSB7XG4gICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgKGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJykgKyAnOiB0eXBlIHNwZWNpZmljYXRpb24gb2YgJyArXG4gICAgICAgICAgICBsb2NhdGlvbiArICcgYCcgKyB0eXBlU3BlY05hbWUgKyAnYCBpcyBpbnZhbGlkOyB0aGUgdHlwZSBjaGVja2VyICcgK1xuICAgICAgICAgICAgJ2Z1bmN0aW9uIG11c3QgcmV0dXJuIGBudWxsYCBvciBhbiBgRXJyb3JgIGJ1dCByZXR1cm5lZCBhICcgKyB0eXBlb2YgZXJyb3IgKyAnLiAnICtcbiAgICAgICAgICAgICdZb3UgbWF5IGhhdmUgZm9yZ290dGVuIHRvIHBhc3MgYW4gYXJndW1lbnQgdG8gdGhlIHR5cGUgY2hlY2tlciAnICtcbiAgICAgICAgICAgICdjcmVhdG9yIChhcnJheU9mLCBpbnN0YW5jZU9mLCBvYmplY3RPZiwgb25lT2YsIG9uZU9mVHlwZSwgYW5kICcgK1xuICAgICAgICAgICAgJ3NoYXBlIGFsbCByZXF1aXJlIGFuIGFyZ3VtZW50KS4nXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciAmJiAhKGVycm9yLm1lc3NhZ2UgaW4gbG9nZ2VkVHlwZUZhaWx1cmVzKSkge1xuICAgICAgICAgIC8vIE9ubHkgbW9uaXRvciB0aGlzIGZhaWx1cmUgb25jZSBiZWNhdXNlIHRoZXJlIHRlbmRzIHRvIGJlIGEgbG90IG9mIHRoZVxuICAgICAgICAgIC8vIHNhbWUgZXJyb3IuXG4gICAgICAgICAgbG9nZ2VkVHlwZUZhaWx1cmVzW2Vycm9yLm1lc3NhZ2VdID0gdHJ1ZTtcblxuICAgICAgICAgIHZhciBzdGFjayA9IGdldFN0YWNrID8gZ2V0U3RhY2soKSA6ICcnO1xuXG4gICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgJ0ZhaWxlZCAnICsgbG9jYXRpb24gKyAnIHR5cGU6ICcgKyBlcnJvci5tZXNzYWdlICsgKHN0YWNrICE9IG51bGwgPyBzdGFjayA6ICcnKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBSZXNldHMgd2FybmluZyBjYWNoZSB3aGVuIHRlc3RpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuY2hlY2tQcm9wVHlwZXMucmVzZXRXYXJuaW5nQ2FjaGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNoZWNrUHJvcFR5cGVzO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdElzID0gcmVxdWlyZSgncmVhY3QtaXMnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9saWIvaGFzJyk7XG52YXIgY2hlY2tQcm9wVHlwZXMgPSByZXF1aXJlKCcuL2NoZWNrUHJvcFR5cGVzJyk7XG5cbnZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbigpIHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBwcmludFdhcm5pbmcgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIG1lc3NhZ2UgPSAnV2FybmluZzogJyArIHRleHQ7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfTtcbn1cblxuZnVuY3Rpb24gZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbCgpIHtcbiAgcmV0dXJuIG51bGw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXNWYWxpZEVsZW1lbnQsIHRocm93T25EaXJlY3RBY2Nlc3MpIHtcbiAgLyogZ2xvYmFsIFN5bWJvbCAqL1xuICB2YXIgSVRFUkFUT1JfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuaXRlcmF0b3I7XG4gIHZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJzsgLy8gQmVmb3JlIFN5bWJvbCBzcGVjLlxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpdGVyYXRvciBtZXRob2QgZnVuY3Rpb24gY29udGFpbmVkIG9uIHRoZSBpdGVyYWJsZSBvYmplY3QuXG4gICAqXG4gICAqIEJlIHN1cmUgdG8gaW52b2tlIHRoZSBmdW5jdGlvbiB3aXRoIHRoZSBpdGVyYWJsZSBhcyBjb250ZXh0OlxuICAgKlxuICAgKiAgICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKG15SXRlcmFibGUpO1xuICAgKiAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICogICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKG15SXRlcmFibGUpO1xuICAgKiAgICAgICAuLi5cbiAgICogICAgIH1cbiAgICpcbiAgICogQHBhcmFtIHs/b2JqZWN0fSBtYXliZUl0ZXJhYmxlXG4gICAqIEByZXR1cm4gez9mdW5jdGlvbn1cbiAgICovXG4gIGZ1bmN0aW9uIGdldEl0ZXJhdG9yRm4obWF5YmVJdGVyYWJsZSkge1xuICAgIHZhciBpdGVyYXRvckZuID0gbWF5YmVJdGVyYWJsZSAmJiAoSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbSVRFUkFUT1JfU1lNQk9MXSB8fCBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXSk7XG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3JGbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29sbGVjdGlvbiBvZiBtZXRob2RzIHRoYXQgYWxsb3cgZGVjbGFyYXRpb24gYW5kIHZhbGlkYXRpb24gb2YgcHJvcHMgdGhhdCBhcmVcbiAgICogc3VwcGxpZWQgdG8gUmVhY3QgY29tcG9uZW50cy4gRXhhbXBsZSB1c2FnZTpcbiAgICpcbiAgICogICB2YXIgUHJvcHMgPSByZXF1aXJlKCdSZWFjdFByb3BUeXBlcycpO1xuICAgKiAgIHZhciBNeUFydGljbGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAqICAgICBwcm9wVHlwZXM6IHtcbiAgICogICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIHByb3AgbmFtZWQgXCJkZXNjcmlwdGlvblwiLlxuICAgKiAgICAgICBkZXNjcmlwdGlvbjogUHJvcHMuc3RyaW5nLFxuICAgKlxuICAgKiAgICAgICAvLyBBIHJlcXVpcmVkIGVudW0gcHJvcCBuYW1lZCBcImNhdGVnb3J5XCIuXG4gICAqICAgICAgIGNhdGVnb3J5OiBQcm9wcy5vbmVPZihbJ05ld3MnLCdQaG90b3MnXSkuaXNSZXF1aXJlZCxcbiAgICpcbiAgICogICAgICAgLy8gQSBwcm9wIG5hbWVkIFwiZGlhbG9nXCIgdGhhdCByZXF1aXJlcyBhbiBpbnN0YW5jZSBvZiBEaWFsb2cuXG4gICAqICAgICAgIGRpYWxvZzogUHJvcHMuaW5zdGFuY2VPZihEaWFsb2cpLmlzUmVxdWlyZWRcbiAgICogICAgIH0sXG4gICAqICAgICByZW5kZXI6IGZ1bmN0aW9uKCkgeyAuLi4gfVxuICAgKiAgIH0pO1xuICAgKlxuICAgKiBBIG1vcmUgZm9ybWFsIHNwZWNpZmljYXRpb24gb2YgaG93IHRoZXNlIG1ldGhvZHMgYXJlIHVzZWQ6XG4gICAqXG4gICAqICAgdHlwZSA6PSBhcnJheXxib29sfGZ1bmN8b2JqZWN0fG51bWJlcnxzdHJpbmd8b25lT2YoWy4uLl0pfGluc3RhbmNlT2YoLi4uKVxuICAgKiAgIGRlY2wgOj0gUmVhY3RQcm9wVHlwZXMue3R5cGV9KC5pc1JlcXVpcmVkKT9cbiAgICpcbiAgICogRWFjaCBhbmQgZXZlcnkgZGVjbGFyYXRpb24gcHJvZHVjZXMgYSBmdW5jdGlvbiB3aXRoIHRoZSBzYW1lIHNpZ25hdHVyZS4gVGhpc1xuICAgKiBhbGxvd3MgdGhlIGNyZWF0aW9uIG9mIGN1c3RvbSB2YWxpZGF0aW9uIGZ1bmN0aW9ucy4gRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqICB2YXIgTXlMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgKiAgICBwcm9wVHlwZXM6IHtcbiAgICogICAgICAvLyBBbiBvcHRpb25hbCBzdHJpbmcgb3IgVVJJIHByb3AgbmFtZWQgXCJocmVmXCIuXG4gICAqICAgICAgaHJlZjogZnVuY3Rpb24ocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lKSB7XG4gICAqICAgICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgKiAgICAgICAgaWYgKHByb3BWYWx1ZSAhPSBudWxsICYmIHR5cGVvZiBwcm9wVmFsdWUgIT09ICdzdHJpbmcnICYmXG4gICAqICAgICAgICAgICAgIShwcm9wVmFsdWUgaW5zdGFuY2VvZiBVUkkpKSB7XG4gICAqICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXG4gICAqICAgICAgICAgICAgJ0V4cGVjdGVkIGEgc3RyaW5nIG9yIGFuIFVSSSBmb3IgJyArIHByb3BOYW1lICsgJyBpbiAnICtcbiAgICogICAgICAgICAgICBjb21wb25lbnROYW1lXG4gICAqICAgICAgICAgICk7XG4gICAqICAgICAgICB9XG4gICAqICAgICAgfVxuICAgKiAgICB9LFxuICAgKiAgICByZW5kZXI6IGZ1bmN0aW9uKCkgey4uLn1cbiAgICogIH0pO1xuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG5cbiAgdmFyIEFOT05ZTU9VUyA9ICc8PGFub255bW91cz4+JztcblxuICAvLyBJbXBvcnRhbnQhXG4gIC8vIEtlZXAgdGhpcyBsaXN0IGluIHN5bmMgd2l0aCBwcm9kdWN0aW9uIHZlcnNpb24gaW4gYC4vZmFjdG9yeVdpdGhUaHJvd2luZ1NoaW1zLmpzYC5cbiAgdmFyIFJlYWN0UHJvcFR5cGVzID0ge1xuICAgIGFycmF5OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYXJyYXknKSxcbiAgICBiaWdpbnQ6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdiaWdpbnQnKSxcbiAgICBib29sOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYm9vbGVhbicpLFxuICAgIGZ1bmM6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdmdW5jdGlvbicpLFxuICAgIG51bWJlcjogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ251bWJlcicpLFxuICAgIG9iamVjdDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ29iamVjdCcpLFxuICAgIHN0cmluZzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ3N0cmluZycpLFxuICAgIHN5bWJvbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ3N5bWJvbCcpLFxuXG4gICAgYW55OiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpLFxuICAgIGFycmF5T2Y6IGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcixcbiAgICBlbGVtZW50OiBjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIoKSxcbiAgICBlbGVtZW50VHlwZTogY3JlYXRlRWxlbWVudFR5cGVUeXBlQ2hlY2tlcigpLFxuICAgIGluc3RhbmNlT2Y6IGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIsXG4gICAgbm9kZTogY3JlYXRlTm9kZUNoZWNrZXIoKSxcbiAgICBvYmplY3RPZjogY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcixcbiAgICBvbmVPZjogY3JlYXRlRW51bVR5cGVDaGVja2VyLFxuICAgIG9uZU9mVHlwZTogY3JlYXRlVW5pb25UeXBlQ2hlY2tlcixcbiAgICBzaGFwZTogY3JlYXRlU2hhcGVUeXBlQ2hlY2tlcixcbiAgICBleGFjdDogY3JlYXRlU3RyaWN0U2hhcGVUeXBlQ2hlY2tlcixcbiAgfTtcblxuICAvKipcbiAgICogaW5saW5lZCBPYmplY3QuaXMgcG9seWZpbGwgdG8gYXZvaWQgcmVxdWlyaW5nIGNvbnN1bWVycyBzaGlwIHRoZWlyIG93blxuICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvaXNcbiAgICovXG4gIC8qZXNsaW50LWRpc2FibGUgbm8tc2VsZi1jb21wYXJlKi9cbiAgZnVuY3Rpb24gaXMoeCwgeSkge1xuICAgIC8vIFNhbWVWYWx1ZSBhbGdvcml0aG1cbiAgICBpZiAoeCA9PT0geSkge1xuICAgICAgLy8gU3RlcHMgMS01LCA3LTEwXG4gICAgICAvLyBTdGVwcyA2LmItNi5lOiArMCAhPSAtMFxuICAgICAgcmV0dXJuIHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTdGVwIDYuYTogTmFOID09IE5hTlxuICAgICAgcmV0dXJuIHggIT09IHggJiYgeSAhPT0geTtcbiAgICB9XG4gIH1cbiAgLyplc2xpbnQtZW5hYmxlIG5vLXNlbGYtY29tcGFyZSovXG5cbiAgLyoqXG4gICAqIFdlIHVzZSBhbiBFcnJvci1saWtlIG9iamVjdCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSBhcyBwZW9wbGUgbWF5IGNhbGxcbiAgICogUHJvcFR5cGVzIGRpcmVjdGx5IGFuZCBpbnNwZWN0IHRoZWlyIG91dHB1dC4gSG93ZXZlciwgd2UgZG9uJ3QgdXNlIHJlYWxcbiAgICogRXJyb3JzIGFueW1vcmUuIFdlIGRvbid0IGluc3BlY3QgdGhlaXIgc3RhY2sgYW55d2F5LCBhbmQgY3JlYXRpbmcgdGhlbVxuICAgKiBpcyBwcm9oaWJpdGl2ZWx5IGV4cGVuc2l2ZSBpZiB0aGV5IGFyZSBjcmVhdGVkIHRvbyBvZnRlbiwgc3VjaCBhcyB3aGF0XG4gICAqIGhhcHBlbnMgaW4gb25lT2ZUeXBlKCkgZm9yIGFueSB0eXBlIGJlZm9yZSB0aGUgb25lIHRoYXQgbWF0Y2hlZC5cbiAgICovXG4gIGZ1bmN0aW9uIFByb3BUeXBlRXJyb3IobWVzc2FnZSwgZGF0YSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5kYXRhID0gZGF0YSAmJiB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgPyBkYXRhOiB7fTtcbiAgICB0aGlzLnN0YWNrID0gJyc7XG4gIH1cbiAgLy8gTWFrZSBgaW5zdGFuY2VvZiBFcnJvcmAgc3RpbGwgd29yayBmb3IgcmV0dXJuZWQgZXJyb3JzLlxuICBQcm9wVHlwZUVycm9yLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcblxuICBmdW5jdGlvbiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGUgPSB7fTtcbiAgICAgIHZhciBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCA9IDA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNoZWNrVHlwZShpc1JlcXVpcmVkLCBwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudE5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgcHJvcEZ1bGxOYW1lID0gcHJvcEZ1bGxOYW1lIHx8IHByb3BOYW1lO1xuXG4gICAgICBpZiAoc2VjcmV0ICE9PSBSZWFjdFByb3BUeXBlc1NlY3JldCkge1xuICAgICAgICBpZiAodGhyb3dPbkRpcmVjdEFjY2Vzcykge1xuICAgICAgICAgIC8vIE5ldyBiZWhhdmlvciBvbmx5IGZvciB1c2VycyBvZiBgcHJvcC10eXBlc2AgcGFja2FnZVxuICAgICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoXG4gICAgICAgICAgICAnQ2FsbGluZyBQcm9wVHlwZXMgdmFsaWRhdG9ycyBkaXJlY3RseSBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAgICAgICAnVXNlIGBQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMoKWAgdG8gY2FsbCB0aGVtLiAnICtcbiAgICAgICAgICAgICdSZWFkIG1vcmUgYXQgaHR0cDovL2ZiLm1lL3VzZS1jaGVjay1wcm9wLXR5cGVzJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgZXJyLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgLy8gT2xkIGJlaGF2aW9yIGZvciBwZW9wbGUgdXNpbmcgUmVhY3QuUHJvcFR5cGVzXG4gICAgICAgICAgdmFyIGNhY2hlS2V5ID0gY29tcG9uZW50TmFtZSArICc6JyArIHByb3BOYW1lO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFtYW51YWxQcm9wVHlwZUNhbGxDYWNoZVtjYWNoZUtleV0gJiZcbiAgICAgICAgICAgIC8vIEF2b2lkIHNwYW1taW5nIHRoZSBjb25zb2xlIGJlY2F1c2UgdGhleSBhcmUgb2Z0ZW4gbm90IGFjdGlvbmFibGUgZXhjZXB0IGZvciBsaWIgYXV0aG9yc1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPCAzXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBwcmludFdhcm5pbmcoXG4gICAgICAgICAgICAgICdZb3UgYXJlIG1hbnVhbGx5IGNhbGxpbmcgYSBSZWFjdC5Qcm9wVHlwZXMgdmFsaWRhdGlvbiAnICtcbiAgICAgICAgICAgICAgJ2Z1bmN0aW9uIGZvciB0aGUgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBwcm9wIG9uIGAnICsgY29tcG9uZW50TmFtZSArICdgLiBUaGlzIGlzIGRlcHJlY2F0ZWQgJyArXG4gICAgICAgICAgICAgICdhbmQgd2lsbCB0aHJvdyBpbiB0aGUgc3RhbmRhbG9uZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAgICAgICAgICdZb3UgbWF5IGJlIHNlZWluZyB0aGlzIHdhcm5pbmcgZHVlIHRvIGEgdGhpcmQtcGFydHkgUHJvcFR5cGVzICcgK1xuICAgICAgICAgICAgICAnbGlicmFyeS4gU2VlIGh0dHBzOi8vZmIubWUvcmVhY3Qtd2FybmluZy1kb250LWNhbGwtcHJvcHR5cGVzICcgKyAnZm9yIGRldGFpbHMuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSA9IHRydWU7XG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PSBudWxsKSB7XG4gICAgICAgIGlmIChpc1JlcXVpcmVkKSB7XG4gICAgICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdUaGUgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCAnICsgKCdpbiBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgYnV0IGl0cyB2YWx1ZSBpcyBgbnVsbGAuJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1RoZSAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgaXMgbWFya2VkIGFzIHJlcXVpcmVkIGluICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBidXQgaXRzIHZhbHVlIGlzIGB1bmRlZmluZWRgLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjaGFpbmVkQ2hlY2tUeXBlID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgZmFsc2UpO1xuICAgIGNoYWluZWRDaGVja1R5cGUuaXNSZXF1aXJlZCA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIHRydWUpO1xuXG4gICAgcmV0dXJuIGNoYWluZWRDaGVja1R5cGU7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihleHBlY3RlZFR5cGUpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09IGV4cGVjdGVkVHlwZSkge1xuICAgICAgICAvLyBgcHJvcFZhbHVlYCBiZWluZyBpbnN0YW5jZSBvZiwgc2F5LCBkYXRlL3JlZ2V4cCwgcGFzcyB0aGUgJ29iamVjdCdcbiAgICAgICAgLy8gY2hlY2ssIGJ1dCB3ZSBjYW4gb2ZmZXIgYSBtb3JlIHByZWNpc2UgZXJyb3IgbWVzc2FnZSBoZXJlIHJhdGhlciB0aGFuXG4gICAgICAgIC8vICdvZiB0eXBlIGBvYmplY3RgJy5cbiAgICAgICAgdmFyIHByZWNpc2VUeXBlID0gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoXG4gICAgICAgICAgJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcmVjaXNlVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnYCcgKyBleHBlY3RlZFR5cGUgKyAnYC4nKSxcbiAgICAgICAgICB7ZXhwZWN0ZWRUeXBlOiBleHBlY3RlZFR5cGV9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFueVR5cGVDaGVja2VyKCkge1xuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcihlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcih0eXBlQ2hlY2tlcikge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiB0eXBlQ2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1Byb3BlcnR5IGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgY29tcG9uZW50IGAnICsgY29tcG9uZW50TmFtZSArICdgIGhhcyBpbnZhbGlkIFByb3BUeXBlIG5vdGF0aW9uIGluc2lkZSBhcnJheU9mLicpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIGFycmF5LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcFZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwgaSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICdbJyArIGkgKyAnXScsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIHNpbmdsZSBSZWFjdEVsZW1lbnQuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50VHlwZVR5cGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghUmVhY3RJcy5pc1ZhbGlkRWxlbWVudFR5cGUocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIHNpbmdsZSBSZWFjdEVsZW1lbnQgdHlwZS4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIoZXhwZWN0ZWRDbGFzcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKCEocHJvcHNbcHJvcE5hbWVdIGluc3RhbmNlb2YgZXhwZWN0ZWRDbGFzcykpIHtcbiAgICAgICAgdmFyIGV4cGVjdGVkQ2xhc3NOYW1lID0gZXhwZWN0ZWRDbGFzcy5uYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgICAgdmFyIGFjdHVhbENsYXNzTmFtZSA9IGdldENsYXNzTmFtZShwcm9wc1twcm9wTmFtZV0pO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBhY3R1YWxDbGFzc05hbWUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2luc3RhbmNlIG9mIGAnICsgZXhwZWN0ZWRDbGFzc05hbWUgKyAnYC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVudW1UeXBlQ2hlY2tlcihleHBlY3RlZFZhbHVlcykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShleHBlY3RlZFZhbHVlcykpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50cyBzdXBwbGllZCB0byBvbmVPZiwgZXhwZWN0ZWQgYW4gYXJyYXksIGdvdCAnICsgYXJndW1lbnRzLmxlbmd0aCArICcgYXJndW1lbnRzLiAnICtcbiAgICAgICAgICAgICdBIGNvbW1vbiBtaXN0YWtlIGlzIHRvIHdyaXRlIG9uZU9mKHgsIHksIHopIGluc3RlYWQgb2Ygb25lT2YoW3gsIHksIHpdKS4nXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcmludFdhcm5pbmcoJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2YsIGV4cGVjdGVkIGFuIGFycmF5LicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV4cGVjdGVkVmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpcyhwcm9wVmFsdWUsIGV4cGVjdGVkVmFsdWVzW2ldKSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciB2YWx1ZXNTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShleHBlY3RlZFZhbHVlcywgZnVuY3Rpb24gcmVwbGFjZXIoa2V5LCB2YWx1ZSkge1xuICAgICAgICB2YXIgdHlwZSA9IGdldFByZWNpc2VUeXBlKHZhbHVlKTtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHZhbHVlIGAnICsgU3RyaW5nKHByb3BWYWx1ZSkgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgb25lIG9mICcgKyB2YWx1ZXNTdHJpbmcgKyAnLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgb2JqZWN0T2YuJyk7XG4gICAgICB9XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gb2JqZWN0LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wVmFsdWUpIHtcbiAgICAgICAgaWYgKGhhcyhwcm9wVmFsdWUsIGtleSkpIHtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIoYXJyYXlPZlR5cGVDaGVja2Vycykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnJheU9mVHlwZUNoZWNrZXJzKSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHByaW50V2FybmluZygnSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZlR5cGUsIGV4cGVjdGVkIGFuIGluc3RhbmNlIG9mIGFycmF5LicpIDogdm9pZCAwO1xuICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGw7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hlY2tlciA9IGFycmF5T2ZUeXBlQ2hlY2tlcnNbaV07XG4gICAgICBpZiAodHlwZW9mIGNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mVHlwZS4gRXhwZWN0ZWQgYW4gYXJyYXkgb2YgY2hlY2sgZnVuY3Rpb25zLCBidXQgJyArXG4gICAgICAgICAgJ3JlY2VpdmVkICcgKyBnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmcoY2hlY2tlcikgKyAnIGF0IGluZGV4ICcgKyBpICsgJy4nXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIGV4cGVjdGVkVHlwZXMgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlPZlR5cGVDaGVja2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hlY2tlciA9IGFycmF5T2ZUeXBlQ2hlY2tlcnNbaV07XG4gICAgICAgIHZhciBjaGVja2VyUmVzdWx0ID0gY2hlY2tlcihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGNoZWNrZXJSZXN1bHQgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGVja2VyUmVzdWx0LmRhdGEgJiYgaGFzKGNoZWNrZXJSZXN1bHQuZGF0YSwgJ2V4cGVjdGVkVHlwZScpKSB7XG4gICAgICAgICAgZXhwZWN0ZWRUeXBlcy5wdXNoKGNoZWNrZXJSZXN1bHQuZGF0YS5leHBlY3RlZFR5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgZXhwZWN0ZWRUeXBlc01lc3NhZ2UgPSAoZXhwZWN0ZWRUeXBlcy5sZW5ndGggPiAwKSA/ICcsIGV4cGVjdGVkIG9uZSBvZiB0eXBlIFsnICsgZXhwZWN0ZWRUeXBlcy5qb2luKCcsICcpICsgJ10nOiAnJztcbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AnICsgZXhwZWN0ZWRUeXBlc01lc3NhZ2UgKyAnLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU5vZGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKCFpc05vZGUocHJvcHNbcHJvcE5hbWVdKSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHN1cHBsaWVkIHRvICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIFJlYWN0Tm9kZS4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludmFsaWRWYWxpZGF0b3JFcnJvcihjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBrZXksIHR5cGUpIHtcbiAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoXG4gICAgICAoY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnKSArICc6ICcgKyBsb2NhdGlvbiArICcgdHlwZSBgJyArIHByb3BGdWxsTmFtZSArICcuJyArIGtleSArICdgIGlzIGludmFsaWQ7ICcgK1xuICAgICAgJ2l0IG11c3QgYmUgYSBmdW5jdGlvbiwgdXN1YWxseSBmcm9tIHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZSwgYnV0IHJlY2VpdmVkIGAnICsgdHlwZSArICdgLidcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU2hhcGVUeXBlQ2hlY2tlcihzaGFwZVR5cGVzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIGAnICsgcHJvcFR5cGUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYG9iamVjdGAuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIHNoYXBlVHlwZXMpIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICAgIGlmICh0eXBlb2YgY2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiBpbnZhbGlkVmFsaWRhdG9yRXJyb3IoY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwga2V5LCBnZXRQcmVjaXNlVHlwZShjaGVja2VyKSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVycm9yID0gY2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU3RyaWN0U2hhcGVUeXBlQ2hlY2tlcihzaGFwZVR5cGVzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIGAnICsgcHJvcFR5cGUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYG9iamVjdGAuJykpO1xuICAgICAgfVxuICAgICAgLy8gV2UgbmVlZCB0byBjaGVjayBhbGwga2V5cyBpbiBjYXNlIHNvbWUgYXJlIHJlcXVpcmVkIGJ1dCBtaXNzaW5nIGZyb20gcHJvcHMuXG4gICAgICB2YXIgYWxsS2V5cyA9IGFzc2lnbih7fSwgcHJvcHNbcHJvcE5hbWVdLCBzaGFwZVR5cGVzKTtcbiAgICAgIGZvciAodmFyIGtleSBpbiBhbGxLZXlzKSB7XG4gICAgICAgIHZhciBjaGVja2VyID0gc2hhcGVUeXBlc1trZXldO1xuICAgICAgICBpZiAoaGFzKHNoYXBlVHlwZXMsIGtleSkgJiYgdHlwZW9mIGNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gaW52YWxpZFZhbGlkYXRvckVycm9yKGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIGtleSwgZ2V0UHJlY2lzZVR5cGUoY2hlY2tlcikpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghY2hlY2tlcikge1xuICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcihcbiAgICAgICAgICAgICdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBrZXkgYCcgKyBrZXkgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4nICtcbiAgICAgICAgICAgICdcXG5CYWQgb2JqZWN0OiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcHNbcHJvcE5hbWVdLCBudWxsLCAnICAnKSArXG4gICAgICAgICAgICAnXFxuVmFsaWQga2V5czogJyArIEpTT04uc3RyaW5naWZ5KE9iamVjdC5rZXlzKHNoYXBlVHlwZXMpLCBudWxsLCAnICAnKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVycm9yID0gY2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc05vZGUocHJvcFZhbHVlKSB7XG4gICAgc3dpdGNoICh0eXBlb2YgcHJvcFZhbHVlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIHJldHVybiAhcHJvcFZhbHVlO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiBwcm9wVmFsdWUuZXZlcnkoaXNOb2RlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcFZhbHVlID09PSBudWxsIHx8IGlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihwcm9wVmFsdWUpO1xuICAgICAgICBpZiAoaXRlcmF0b3JGbikge1xuICAgICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChwcm9wVmFsdWUpO1xuICAgICAgICAgIHZhciBzdGVwO1xuICAgICAgICAgIGlmIChpdGVyYXRvckZuICE9PSBwcm9wVmFsdWUuZW50cmllcykge1xuICAgICAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgICAgICBpZiAoIWlzTm9kZShzdGVwLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJdGVyYXRvciB3aWxsIHByb3ZpZGUgZW50cnkgW2ssdl0gdHVwbGVzIHJhdGhlciB0aGFuIHZhbHVlcy5cbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc05vZGUoZW50cnlbMV0pKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpIHtcbiAgICAvLyBOYXRpdmUgU3ltYm9sLlxuICAgIGlmIChwcm9wVHlwZSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIGZhbHN5IHZhbHVlIGNhbid0IGJlIGEgU3ltYm9sXG4gICAgaWYgKCFwcm9wVmFsdWUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddID09PSAnU3ltYm9sJ1xuICAgIGlmIChwcm9wVmFsdWVbJ0BAdG9TdHJpbmdUYWcnXSA9PT0gJ1N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIEZhbGxiYWNrIGZvciBub24tc3BlYyBjb21wbGlhbnQgU3ltYm9scyB3aGljaCBhcmUgcG9seWZpbGxlZC5cbiAgICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wVmFsdWUgaW5zdGFuY2VvZiBTeW1ib2wpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIEVxdWl2YWxlbnQgb2YgYHR5cGVvZmAgYnV0IHdpdGggc3BlY2lhbCBoYW5kbGluZyBmb3IgYXJyYXkgYW5kIHJlZ2V4cC5cbiAgZnVuY3Rpb24gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKSB7XG4gICAgdmFyIHByb3BUeXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ2FycmF5JztcbiAgICB9XG4gICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgLy8gT2xkIHdlYmtpdHMgKGF0IGxlYXN0IHVudGlsIEFuZHJvaWQgNC4wKSByZXR1cm4gJ2Z1bmN0aW9uJyByYXRoZXIgdGhhblxuICAgICAgLy8gJ29iamVjdCcgZm9yIHR5cGVvZiBhIFJlZ0V4cC4gV2UnbGwgbm9ybWFsaXplIHRoaXMgaGVyZSBzbyB0aGF0IC9ibGEvXG4gICAgICAvLyBwYXNzZXMgUHJvcFR5cGVzLm9iamVjdC5cbiAgICAgIHJldHVybiAnb2JqZWN0JztcbiAgICB9XG4gICAgaWYgKGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ3N5bWJvbCc7XG4gICAgfVxuICAgIHJldHVybiBwcm9wVHlwZTtcbiAgfVxuXG4gIC8vIFRoaXMgaGFuZGxlcyBtb3JlIHR5cGVzIHRoYW4gYGdldFByb3BUeXBlYC4gT25seSB1c2VkIGZvciBlcnJvciBtZXNzYWdlcy5cbiAgLy8gU2VlIGBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcmAuXG4gIGZ1bmN0aW9uIGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSkge1xuICAgIGlmICh0eXBlb2YgcHJvcFZhbHVlID09PSAndW5kZWZpbmVkJyB8fCBwcm9wVmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJyArIHByb3BWYWx1ZTtcbiAgICB9XG4gICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICBpZiAocHJvcFR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICByZXR1cm4gJ2RhdGUnO1xuICAgICAgfSBlbHNlIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuICdyZWdleHAnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJvcFR5cGU7XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgcG9zdGZpeGVkIHRvIGEgd2FybmluZyBhYm91dCBhbiBpbnZhbGlkIHR5cGUuXG4gIC8vIEZvciBleGFtcGxlLCBcInVuZGVmaW5lZFwiIG9yIFwib2YgdHlwZSBhcnJheVwiXG4gIGZ1bmN0aW9uIGdldFBvc3RmaXhGb3JUeXBlV2FybmluZyh2YWx1ZSkge1xuICAgIHZhciB0eXBlID0gZ2V0UHJlY2lzZVR5cGUodmFsdWUpO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgcmV0dXJuICdhbiAnICsgdHlwZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICBjYXNlICdyZWdleHAnOlxuICAgICAgICByZXR1cm4gJ2EgJyArIHR5cGU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICB9XG4gIH1cblxuICAvLyBSZXR1cm5zIGNsYXNzIG5hbWUgb2YgdGhlIG9iamVjdCwgaWYgYW55LlxuICBmdW5jdGlvbiBnZXRDbGFzc05hbWUocHJvcFZhbHVlKSB7XG4gICAgaWYgKCFwcm9wVmFsdWUuY29uc3RydWN0b3IgfHwgIXByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lKSB7XG4gICAgICByZXR1cm4gQU5PTllNT1VTO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcFZhbHVlLmNvbnN0cnVjdG9yLm5hbWU7XG4gIH1cblxuICBSZWFjdFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcyA9IGNoZWNrUHJvcFR5cGVzO1xuICBSZWFjdFByb3BUeXBlcy5yZXNldFdhcm5pbmdDYWNoZSA9IGNoZWNrUHJvcFR5cGVzLnJlc2V0V2FybmluZ0NhY2hlO1xuICBSZWFjdFByb3BUeXBlcy5Qcm9wVHlwZXMgPSBSZWFjdFByb3BUeXBlcztcblxuICByZXR1cm4gUmVhY3RQcm9wVHlwZXM7XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgUmVhY3RJcyA9IHJlcXVpcmUoJ3JlYWN0LWlzJyk7XG5cbiAgLy8gQnkgZXhwbGljaXRseSB1c2luZyBgcHJvcC10eXBlc2AgeW91IGFyZSBvcHRpbmcgaW50byBuZXcgZGV2ZWxvcG1lbnQgYmVoYXZpb3IuXG4gIC8vIGh0dHA6Ly9mYi5tZS9wcm9wLXR5cGVzLWluLXByb2RcbiAgdmFyIHRocm93T25EaXJlY3RBY2Nlc3MgPSB0cnVlO1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZmFjdG9yeVdpdGhUeXBlQ2hlY2tlcnMnKShSZWFjdElzLmlzRWxlbWVudCwgdGhyb3dPbkRpcmVjdEFjY2Vzcyk7XG59IGVsc2Uge1xuICAvLyBCeSBleHBsaWNpdGx5IHVzaW5nIGBwcm9wLXR5cGVzYCB5b3UgYXJlIG9wdGluZyBpbnRvIG5ldyBwcm9kdWN0aW9uIGJlaGF2aW9yLlxuICAvLyBodHRwOi8vZmIubWUvcHJvcC10eXBlcy1pbi1wcm9kXG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMnKSgpO1xufVxuIiwiLyoqIEBsaWNlbnNlIFJlYWN0IHYxNy4wLjJcbiAqIHJlYWN0LWlzLmRldmVsb3BtZW50LmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIChmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuLy8gQVRURU5USU9OXG4vLyBXaGVuIGFkZGluZyBuZXcgc3ltYm9scyB0byB0aGlzIGZpbGUsXG4vLyBQbGVhc2UgY29uc2lkZXIgYWxzbyBhZGRpbmcgdG8gJ3JlYWN0LWRldnRvb2xzLXNoYXJlZC9zcmMvYmFja2VuZC9SZWFjdFN5bWJvbHMnXG4vLyBUaGUgU3ltYm9sIHVzZWQgdG8gdGFnIHRoZSBSZWFjdEVsZW1lbnQtbGlrZSB0eXBlcy4gSWYgdGhlcmUgaXMgbm8gbmF0aXZlIFN5bWJvbFxuLy8gbm9yIHBvbHlmaWxsLCB0aGVuIGEgcGxhaW4gbnVtYmVyIGlzIHVzZWQgZm9yIHBlcmZvcm1hbmNlLlxudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IDB4ZWFjNztcbnZhciBSRUFDVF9QT1JUQUxfVFlQRSA9IDB4ZWFjYTtcbnZhciBSRUFDVF9GUkFHTUVOVF9UWVBFID0gMHhlYWNiO1xudmFyIFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgPSAweGVhY2M7XG52YXIgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IDB4ZWFkMjtcbnZhciBSRUFDVF9QUk9WSURFUl9UWVBFID0gMHhlYWNkO1xudmFyIFJFQUNUX0NPTlRFWFRfVFlQRSA9IDB4ZWFjZTtcbnZhciBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFID0gMHhlYWQwO1xudmFyIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSAweGVhZDE7XG52YXIgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFID0gMHhlYWQ4O1xudmFyIFJFQUNUX01FTU9fVFlQRSA9IDB4ZWFkMztcbnZhciBSRUFDVF9MQVpZX1RZUEUgPSAweGVhZDQ7XG52YXIgUkVBQ1RfQkxPQ0tfVFlQRSA9IDB4ZWFkOTtcbnZhciBSRUFDVF9TRVJWRVJfQkxPQ0tfVFlQRSA9IDB4ZWFkYTtcbnZhciBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFID0gMHhlYWQ1O1xudmFyIFJFQUNUX1NDT1BFX1RZUEUgPSAweGVhZDc7XG52YXIgUkVBQ1RfT1BBUVVFX0lEX1RZUEUgPSAweGVhZTA7XG52YXIgUkVBQ1RfREVCVUdfVFJBQ0lOR19NT0RFX1RZUEUgPSAweGVhZTE7XG52YXIgUkVBQ1RfT0ZGU0NSRUVOX1RZUEUgPSAweGVhZTI7XG52YXIgUkVBQ1RfTEVHQUNZX0hJRERFTl9UWVBFID0gMHhlYWUzO1xuXG5pZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yKSB7XG4gIHZhciBzeW1ib2xGb3IgPSBTeW1ib2wuZm9yO1xuICBSRUFDVF9FTEVNRU5UX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmVsZW1lbnQnKTtcbiAgUkVBQ1RfUE9SVEFMX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LnBvcnRhbCcpO1xuICBSRUFDVF9GUkFHTUVOVF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5mcmFnbWVudCcpO1xuICBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5zdHJpY3RfbW9kZScpO1xuICBSRUFDVF9QUk9GSUxFUl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5wcm9maWxlcicpO1xuICBSRUFDVF9QUk9WSURFUl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5wcm92aWRlcicpO1xuICBSRUFDVF9DT05URVhUX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmNvbnRleHQnKTtcbiAgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QuZm9yd2FyZF9yZWYnKTtcbiAgUkVBQ1RfU1VTUEVOU0VfVFlQRSA9IHN5bWJvbEZvcigncmVhY3Quc3VzcGVuc2UnKTtcbiAgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5zdXNwZW5zZV9saXN0Jyk7XG4gIFJFQUNUX01FTU9fVFlQRSA9IHN5bWJvbEZvcigncmVhY3QubWVtbycpO1xuICBSRUFDVF9MQVpZX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmxhenknKTtcbiAgUkVBQ1RfQkxPQ0tfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QuYmxvY2snKTtcbiAgUkVBQ1RfU0VSVkVSX0JMT0NLX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LnNlcnZlci5ibG9jaycpO1xuICBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5mdW5kYW1lbnRhbCcpO1xuICBSRUFDVF9TQ09QRV9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5zY29wZScpO1xuICBSRUFDVF9PUEFRVUVfSURfVFlQRSA9IHN5bWJvbEZvcigncmVhY3Qub3BhcXVlLmlkJyk7XG4gIFJFQUNUX0RFQlVHX1RSQUNJTkdfTU9ERV9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5kZWJ1Z190cmFjZV9tb2RlJyk7XG4gIFJFQUNUX09GRlNDUkVFTl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5vZmZzY3JlZW4nKTtcbiAgUkVBQ1RfTEVHQUNZX0hJRERFTl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5sZWdhY3lfaGlkZGVuJyk7XG59XG5cbi8vIEZpbHRlciBjZXJ0YWluIERPTSBhdHRyaWJ1dGVzIChlLmcuIHNyYywgaHJlZikgaWYgdGhlaXIgdmFsdWVzIGFyZSBlbXB0eSBzdHJpbmdzLlxuXG52YXIgZW5hYmxlU2NvcGVBUEkgPSBmYWxzZTsgLy8gRXhwZXJpbWVudGFsIENyZWF0ZSBFdmVudCBIYW5kbGUgQVBJLlxuXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSkge1xuICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gTm90ZTogdHlwZW9mIG1pZ2h0IGJlIG90aGVyIHRoYW4gJ3N5bWJvbCcgb3IgJ251bWJlcicgKGUuZy4gaWYgaXQncyBhIHBvbHlmaWxsKS5cblxuXG4gIGlmICh0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1BST0ZJTEVSX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfREVCVUdfVFJBQ0lOR19NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9MRUdBQ1lfSElEREVOX1RZUEUgfHwgZW5hYmxlU2NvcGVBUEkgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmIHR5cGUgIT09IG51bGwpIHtcbiAgICBpZiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTEFaWV9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9QUk9WSURFUl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0NPTlRFWFRfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfQkxPQ0tfVFlQRSB8fCB0eXBlWzBdID09PSBSRUFDVF9TRVJWRVJfQkxPQ0tfVFlQRSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiB0eXBlT2Yob2JqZWN0KSB7XG4gIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QgIT09IG51bGwpIHtcbiAgICB2YXIgJCR0eXBlb2YgPSBvYmplY3QuJCR0eXBlb2Y7XG5cbiAgICBzd2l0Y2ggKCQkdHlwZW9mKSB7XG4gICAgICBjYXNlIFJFQUNUX0VMRU1FTlRfVFlQRTpcbiAgICAgICAgdmFyIHR5cGUgPSBvYmplY3QudHlwZTtcblxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICBjYXNlIFJFQUNUX0ZSQUdNRU5UX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9QUk9GSUxFUl9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfU1RSSUNUX01PREVfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEU6XG4gICAgICAgICAgICByZXR1cm4gdHlwZTtcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2YXIgJCR0eXBlb2ZUeXBlID0gdHlwZSAmJiB0eXBlLiQkdHlwZW9mO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKCQkdHlwZW9mVHlwZSkge1xuICAgICAgICAgICAgICBjYXNlIFJFQUNUX0NPTlRFWFRfVFlQRTpcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFOlxuICAgICAgICAgICAgICBjYXNlIFJFQUNUX0xBWllfVFlQRTpcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9NRU1PX1RZUEU6XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfUFJPVklERVJfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gJCR0eXBlb2ZUeXBlO1xuXG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuICQkdHlwZW9mO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgICAgcmV0dXJuICQkdHlwZW9mO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG52YXIgQ29udGV4dENvbnN1bWVyID0gUkVBQ1RfQ09OVEVYVF9UWVBFO1xudmFyIENvbnRleHRQcm92aWRlciA9IFJFQUNUX1BST1ZJREVSX1RZUEU7XG52YXIgRWxlbWVudCA9IFJFQUNUX0VMRU1FTlRfVFlQRTtcbnZhciBGb3J3YXJkUmVmID0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTtcbnZhciBGcmFnbWVudCA9IFJFQUNUX0ZSQUdNRU5UX1RZUEU7XG52YXIgTGF6eSA9IFJFQUNUX0xBWllfVFlQRTtcbnZhciBNZW1vID0gUkVBQ1RfTUVNT19UWVBFO1xudmFyIFBvcnRhbCA9IFJFQUNUX1BPUlRBTF9UWVBFO1xudmFyIFByb2ZpbGVyID0gUkVBQ1RfUFJPRklMRVJfVFlQRTtcbnZhciBTdHJpY3RNb2RlID0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRTtcbnZhciBTdXNwZW5zZSA9IFJFQUNUX1NVU1BFTlNFX1RZUEU7XG52YXIgaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNBc3luY01vZGUgPSBmYWxzZTtcbnZhciBoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0NvbmN1cnJlbnRNb2RlID0gZmFsc2U7IC8vIEFzeW5jTW9kZSBzaG91bGQgYmUgZGVwcmVjYXRlZFxuXG5mdW5jdGlvbiBpc0FzeW5jTW9kZShvYmplY3QpIHtcbiAge1xuICAgIGlmICghaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNBc3luY01vZGUpIHtcbiAgICAgIGhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlID0gdHJ1ZTsgLy8gVXNpbmcgY29uc29sZVsnd2FybiddIHRvIGV2YWRlIEJhYmVsIGFuZCBFU0xpbnRcblxuICAgICAgY29uc29sZVsnd2FybiddKCdUaGUgUmVhY3RJcy5pc0FzeW5jTW9kZSgpIGFsaWFzIGhhcyBiZWVuIGRlcHJlY2F0ZWQsICcgKyAnYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZWFjdCAxOCsuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gaXNDb25jdXJyZW50TW9kZShvYmplY3QpIHtcbiAge1xuICAgIGlmICghaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNDb25jdXJyZW50TW9kZSkge1xuICAgICAgaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNDb25jdXJyZW50TW9kZSA9IHRydWU7IC8vIFVzaW5nIGNvbnNvbGVbJ3dhcm4nXSB0byBldmFkZSBCYWJlbCBhbmQgRVNMaW50XG5cbiAgICAgIGNvbnNvbGVbJ3dhcm4nXSgnVGhlIFJlYWN0SXMuaXNDb25jdXJyZW50TW9kZSgpIGFsaWFzIGhhcyBiZWVuIGRlcHJlY2F0ZWQsICcgKyAnYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZWFjdCAxOCsuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gaXNDb250ZXh0Q29uc3VtZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfQ09OVEVYVF9UWVBFO1xufVxuZnVuY3Rpb24gaXNDb250ZXh0UHJvdmlkZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUFJPVklERVJfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzRWxlbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdCAhPT0gbnVsbCAmJiBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzRm9yd2FyZFJlZihvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFO1xufVxuZnVuY3Rpb24gaXNGcmFnbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFO1xufVxuZnVuY3Rpb24gaXNMYXp5KG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0xBWllfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzTWVtbyhvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9NRU1PX1RZUEU7XG59XG5mdW5jdGlvbiBpc1BvcnRhbChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9QT1JUQUxfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzUHJvZmlsZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUFJPRklMRVJfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzU3RyaWN0TW9kZShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFO1xufVxuZnVuY3Rpb24gaXNTdXNwZW5zZShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFO1xufVxuXG5leHBvcnRzLkNvbnRleHRDb25zdW1lciA9IENvbnRleHRDb25zdW1lcjtcbmV4cG9ydHMuQ29udGV4dFByb3ZpZGVyID0gQ29udGV4dFByb3ZpZGVyO1xuZXhwb3J0cy5FbGVtZW50ID0gRWxlbWVudDtcbmV4cG9ydHMuRm9yd2FyZFJlZiA9IEZvcndhcmRSZWY7XG5leHBvcnRzLkZyYWdtZW50ID0gRnJhZ21lbnQ7XG5leHBvcnRzLkxhenkgPSBMYXp5O1xuZXhwb3J0cy5NZW1vID0gTWVtbztcbmV4cG9ydHMuUG9ydGFsID0gUG9ydGFsO1xuZXhwb3J0cy5Qcm9maWxlciA9IFByb2ZpbGVyO1xuZXhwb3J0cy5TdHJpY3RNb2RlID0gU3RyaWN0TW9kZTtcbmV4cG9ydHMuU3VzcGVuc2UgPSBTdXNwZW5zZTtcbmV4cG9ydHMuaXNBc3luY01vZGUgPSBpc0FzeW5jTW9kZTtcbmV4cG9ydHMuaXNDb25jdXJyZW50TW9kZSA9IGlzQ29uY3VycmVudE1vZGU7XG5leHBvcnRzLmlzQ29udGV4dENvbnN1bWVyID0gaXNDb250ZXh0Q29uc3VtZXI7XG5leHBvcnRzLmlzQ29udGV4dFByb3ZpZGVyID0gaXNDb250ZXh0UHJvdmlkZXI7XG5leHBvcnRzLmlzRWxlbWVudCA9IGlzRWxlbWVudDtcbmV4cG9ydHMuaXNGb3J3YXJkUmVmID0gaXNGb3J3YXJkUmVmO1xuZXhwb3J0cy5pc0ZyYWdtZW50ID0gaXNGcmFnbWVudDtcbmV4cG9ydHMuaXNMYXp5ID0gaXNMYXp5O1xuZXhwb3J0cy5pc01lbW8gPSBpc01lbW87XG5leHBvcnRzLmlzUG9ydGFsID0gaXNQb3J0YWw7XG5leHBvcnRzLmlzUHJvZmlsZXIgPSBpc1Byb2ZpbGVyO1xuZXhwb3J0cy5pc1N0cmljdE1vZGUgPSBpc1N0cmljdE1vZGU7XG5leHBvcnRzLmlzU3VzcGVuc2UgPSBpc1N1c3BlbnNlO1xuZXhwb3J0cy5pc1ZhbGlkRWxlbWVudFR5cGUgPSBpc1ZhbGlkRWxlbWVudFR5cGU7XG5leHBvcnRzLnR5cGVPZiA9IHR5cGVPZjtcbiAgfSkoKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC1pcy5wcm9kdWN0aW9uLm1pbi5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC1pcy5kZXZlbG9wbWVudC5qcycpO1xufVxuIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlLCBTdXBwcmVzc2VkRXJyb3IsIFN5bWJvbCwgSXRlcmF0b3IgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXNEZWNvcmF0ZShjdG9yLCBkZXNjcmlwdG9ySW4sIGRlY29yYXRvcnMsIGNvbnRleHRJbiwgaW5pdGlhbGl6ZXJzLCBleHRyYUluaXRpYWxpemVycykge1xyXG4gICAgZnVuY3Rpb24gYWNjZXB0KGYpIHsgaWYgKGYgIT09IHZvaWQgMCAmJiB0eXBlb2YgZiAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRnVuY3Rpb24gZXhwZWN0ZWRcIik7IHJldHVybiBmOyB9XHJcbiAgICB2YXIga2luZCA9IGNvbnRleHRJbi5raW5kLCBrZXkgPSBraW5kID09PSBcImdldHRlclwiID8gXCJnZXRcIiA6IGtpbmQgPT09IFwic2V0dGVyXCIgPyBcInNldFwiIDogXCJ2YWx1ZVwiO1xyXG4gICAgdmFyIHRhcmdldCA9ICFkZXNjcmlwdG9ySW4gJiYgY3RvciA/IGNvbnRleHRJbltcInN0YXRpY1wiXSA/IGN0b3IgOiBjdG9yLnByb3RvdHlwZSA6IG51bGw7XHJcbiAgICB2YXIgZGVzY3JpcHRvciA9IGRlc2NyaXB0b3JJbiB8fCAodGFyZ2V0ID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGNvbnRleHRJbi5uYW1lKSA6IHt9KTtcclxuICAgIHZhciBfLCBkb25lID0gZmFsc2U7XHJcbiAgICBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIHZhciBjb250ZXh0ID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBjb250ZXh0SW4pIGNvbnRleHRbcF0gPSBwID09PSBcImFjY2Vzc1wiID8ge30gOiBjb250ZXh0SW5bcF07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBjb250ZXh0SW4uYWNjZXNzKSBjb250ZXh0LmFjY2Vzc1twXSA9IGNvbnRleHRJbi5hY2Nlc3NbcF07XHJcbiAgICAgICAgY29udGV4dC5hZGRJbml0aWFsaXplciA9IGZ1bmN0aW9uIChmKSB7IGlmIChkb25lKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGFkZCBpbml0aWFsaXplcnMgYWZ0ZXIgZGVjb3JhdGlvbiBoYXMgY29tcGxldGVkXCIpOyBleHRyYUluaXRpYWxpemVycy5wdXNoKGFjY2VwdChmIHx8IG51bGwpKTsgfTtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gKDAsIGRlY29yYXRvcnNbaV0pKGtpbmQgPT09IFwiYWNjZXNzb3JcIiA/IHsgZ2V0OiBkZXNjcmlwdG9yLmdldCwgc2V0OiBkZXNjcmlwdG9yLnNldCB9IDogZGVzY3JpcHRvcltrZXldLCBjb250ZXh0KTtcclxuICAgICAgICBpZiAoa2luZCA9PT0gXCJhY2Nlc3NvclwiKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IHZvaWQgMCkgY29udGludWU7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwgfHwgdHlwZW9mIHJlc3VsdCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBleHBlY3RlZFwiKTtcclxuICAgICAgICAgICAgaWYgKF8gPSBhY2NlcHQocmVzdWx0LmdldCkpIGRlc2NyaXB0b3IuZ2V0ID0gXztcclxuICAgICAgICAgICAgaWYgKF8gPSBhY2NlcHQocmVzdWx0LnNldCkpIGRlc2NyaXB0b3Iuc2V0ID0gXztcclxuICAgICAgICAgICAgaWYgKF8gPSBhY2NlcHQocmVzdWx0LmluaXQpKSBpbml0aWFsaXplcnMudW5zaGlmdChfKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoXyA9IGFjY2VwdChyZXN1bHQpKSB7XHJcbiAgICAgICAgICAgIGlmIChraW5kID09PSBcImZpZWxkXCIpIGluaXRpYWxpemVycy51bnNoaWZ0KF8pO1xyXG4gICAgICAgICAgICBlbHNlIGRlc2NyaXB0b3Jba2V5XSA9IF87XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHRhcmdldCkgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgY29udGV4dEluLm5hbWUsIGRlc2NyaXB0b3IpO1xyXG4gICAgZG9uZSA9IHRydWU7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19ydW5Jbml0aWFsaXplcnModGhpc0FyZywgaW5pdGlhbGl6ZXJzLCB2YWx1ZSkge1xyXG4gICAgdmFyIHVzZVZhbHVlID0gYXJndW1lbnRzLmxlbmd0aCA+IDI7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGluaXRpYWxpemVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhbHVlID0gdXNlVmFsdWUgPyBpbml0aWFsaXplcnNbaV0uY2FsbCh0aGlzQXJnLCB2YWx1ZSkgOiBpbml0aWFsaXplcnNbaV0uY2FsbCh0aGlzQXJnKTtcclxuICAgIH1cclxuICAgIHJldHVybiB1c2VWYWx1ZSA/IHZhbHVlIDogdm9pZCAwO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcHJvcEtleSh4KSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHggPT09IFwic3ltYm9sXCIgPyB4IDogXCJcIi5jb25jYXQoeCk7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zZXRGdW5jdGlvbk5hbWUoZiwgbmFtZSwgcHJlZml4KSB7XHJcbiAgICBpZiAodHlwZW9mIG5hbWUgPT09IFwic3ltYm9sXCIpIG5hbWUgPSBuYW1lLmRlc2NyaXB0aW9uID8gXCJbXCIuY29uY2F0KG5hbWUuZGVzY3JpcHRpb24sIFwiXVwiKSA6IFwiXCI7XHJcbiAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGYsIFwibmFtZVwiLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHByZWZpeCA/IFwiXCIuY29uY2F0KHByZWZpeCwgXCIgXCIsIG5hbWUpIDogbmFtZSB9KTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGcgPSBPYmplY3QuY3JlYXRlKCh0eXBlb2YgSXRlcmF0b3IgPT09IFwiZnVuY3Rpb25cIiA/IEl0ZXJhdG9yIDogT2JqZWN0KS5wcm90b3R5cGUpO1xyXG4gICAgcmV0dXJuIGcubmV4dCA9IHZlcmIoMCksIGdbXCJ0aHJvd1wiXSA9IHZlcmIoMSksIGdbXCJyZXR1cm5cIl0gPSB2ZXJiKDIpLCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XHJcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xyXG4gICAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xyXG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XHJcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XHJcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IE9iamVjdC5jcmVhdGUoKHR5cGVvZiBBc3luY0l0ZXJhdG9yID09PSBcImZ1bmN0aW9uXCIgPyBBc3luY0l0ZXJhdG9yIDogT2JqZWN0KS5wcm90b3R5cGUpLCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIsIGF3YWl0UmV0dXJuKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gYXdhaXRSZXR1cm4oZikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGYsIHJlamVjdCk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpZiAoZ1tuXSkgeyBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyBpZiAoZikgaVtuXSA9IGYoaVtuXSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IGZhbHNlIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbnZhciBvd25LZXlzID0gZnVuY3Rpb24obykge1xyXG4gICAgb3duS2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHx8IGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgdmFyIGFyID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgayBpbiBvKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIGspKSBhclthci5sZW5ndGhdID0gaztcclxuICAgICAgICByZXR1cm4gYXI7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIG93bktleXMobyk7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayA9IG93bktleXMobW9kKSwgaSA9IDA7IGkgPCBrLmxlbmd0aDsgaSsrKSBpZiAoa1tpXSAhPT0gXCJkZWZhdWx0XCIpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwga1tpXSk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgZ2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJtXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIG1ldGhvZCBpcyBub3Qgd3JpdGFibGVcIik7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIChraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlciwgdmFsdWUpIDogZiA/IGYudmFsdWUgPSB2YWx1ZSA6IHN0YXRlLnNldChyZWNlaXZlciwgdmFsdWUpKSwgdmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkSW4oc3RhdGUsIHJlY2VpdmVyKSB7XHJcbiAgICBpZiAocmVjZWl2ZXIgPT09IG51bGwgfHwgKHR5cGVvZiByZWNlaXZlciAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgcmVjZWl2ZXIgIT09IFwiZnVuY3Rpb25cIikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgdXNlICdpbicgb3BlcmF0b3Igb24gbm9uLW9iamVjdFwiKTtcclxuICAgIHJldHVybiB0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyID09PSBzdGF0ZSA6IHN0YXRlLmhhcyhyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FkZERpc3Bvc2FibGVSZXNvdXJjZShlbnYsIHZhbHVlLCBhc3luYykge1xyXG4gICAgaWYgKHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB2b2lkIDApIHtcclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0IGV4cGVjdGVkLlwiKTtcclxuICAgICAgICB2YXIgZGlzcG9zZSwgaW5uZXI7XHJcbiAgICAgICAgaWYgKGFzeW5jKSB7XHJcbiAgICAgICAgICAgIGlmICghU3ltYm9sLmFzeW5jRGlzcG9zZSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0Rpc3Bvc2UgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgICAgICAgICBkaXNwb3NlID0gdmFsdWVbU3ltYm9sLmFzeW5jRGlzcG9zZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkaXNwb3NlID09PSB2b2lkIDApIHtcclxuICAgICAgICAgICAgaWYgKCFTeW1ib2wuZGlzcG9zZSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5kaXNwb3NlIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgICAgICAgICAgZGlzcG9zZSA9IHZhbHVlW1N5bWJvbC5kaXNwb3NlXTtcclxuICAgICAgICAgICAgaWYgKGFzeW5jKSBpbm5lciA9IGRpc3Bvc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YgZGlzcG9zZSAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0IG5vdCBkaXNwb3NhYmxlLlwiKTtcclxuICAgICAgICBpZiAoaW5uZXIpIGRpc3Bvc2UgPSBmdW5jdGlvbigpIHsgdHJ5IHsgaW5uZXIuY2FsbCh0aGlzKTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gUHJvbWlzZS5yZWplY3QoZSk7IH0gfTtcclxuICAgICAgICBlbnYuc3RhY2sucHVzaCh7IHZhbHVlOiB2YWx1ZSwgZGlzcG9zZTogZGlzcG9zZSwgYXN5bmM6IGFzeW5jIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYXN5bmMpIHtcclxuICAgICAgICBlbnYuc3RhY2sucHVzaCh7IGFzeW5jOiB0cnVlIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG5cclxufVxyXG5cclxudmFyIF9TdXBwcmVzc2VkRXJyb3IgPSB0eXBlb2YgU3VwcHJlc3NlZEVycm9yID09PSBcImZ1bmN0aW9uXCIgPyBTdXBwcmVzc2VkRXJyb3IgOiBmdW5jdGlvbiAoZXJyb3IsIHN1cHByZXNzZWQsIG1lc3NhZ2UpIHtcclxuICAgIHZhciBlID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xyXG4gICAgcmV0dXJuIGUubmFtZSA9IFwiU3VwcHJlc3NlZEVycm9yXCIsIGUuZXJyb3IgPSBlcnJvciwgZS5zdXBwcmVzc2VkID0gc3VwcHJlc3NlZCwgZTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2Rpc3Bvc2VSZXNvdXJjZXMoZW52KSB7XHJcbiAgICBmdW5jdGlvbiBmYWlsKGUpIHtcclxuICAgICAgICBlbnYuZXJyb3IgPSBlbnYuaGFzRXJyb3IgPyBuZXcgX1N1cHByZXNzZWRFcnJvcihlLCBlbnYuZXJyb3IsIFwiQW4gZXJyb3Igd2FzIHN1cHByZXNzZWQgZHVyaW5nIGRpc3Bvc2FsLlwiKSA6IGU7XHJcbiAgICAgICAgZW52Lmhhc0Vycm9yID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHZhciByLCBzID0gMDtcclxuICAgIGZ1bmN0aW9uIG5leHQoKSB7XHJcbiAgICAgICAgd2hpbGUgKHIgPSBlbnYuc3RhY2sucG9wKCkpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGlmICghci5hc3luYyAmJiBzID09PSAxKSByZXR1cm4gcyA9IDAsIGVudi5zdGFjay5wdXNoKHIpLCBQcm9taXNlLnJlc29sdmUoKS50aGVuKG5leHQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHIuZGlzcG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSByLmRpc3Bvc2UuY2FsbChyLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoci5hc3luYykgcmV0dXJuIHMgfD0gMiwgUHJvbWlzZS5yZXNvbHZlKHJlc3VsdCkudGhlbihuZXh0LCBmdW5jdGlvbihlKSB7IGZhaWwoZSk7IHJldHVybiBuZXh0KCk7IH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBzIHw9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGZhaWwoZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHMgPT09IDEpIHJldHVybiBlbnYuaGFzRXJyb3IgPyBQcm9taXNlLnJlamVjdChlbnYuZXJyb3IpIDogUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgaWYgKGVudi5oYXNFcnJvcikgdGhyb3cgZW52LmVycm9yO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5leHQoKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmV3cml0ZVJlbGF0aXZlSW1wb3J0RXh0ZW5zaW9uKHBhdGgsIHByZXNlcnZlSnN4KSB7XHJcbiAgICBpZiAodHlwZW9mIHBhdGggPT09IFwic3RyaW5nXCIgJiYgL15cXC5cXC4/XFwvLy50ZXN0KHBhdGgpKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhdGgucmVwbGFjZSgvXFwuKHRzeCkkfCgoPzpcXC5kKT8pKCg/OlxcLlteLi9dKz8pPylcXC4oW2NtXT8pdHMkL2ksIGZ1bmN0aW9uIChtLCB0c3gsIGQsIGV4dCwgY20pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRzeCA/IHByZXNlcnZlSnN4ID8gXCIuanN4XCIgOiBcIi5qc1wiIDogZCAmJiAoIWV4dCB8fCAhY20pID8gbSA6IChkICsgZXh0ICsgXCIuXCIgKyBjbS50b0xvd2VyQ2FzZSgpICsgXCJqc1wiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBwYXRoO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBfX2V4dGVuZHM6IF9fZXh0ZW5kcyxcclxuICAgIF9fYXNzaWduOiBfX2Fzc2lnbixcclxuICAgIF9fcmVzdDogX19yZXN0LFxyXG4gICAgX19kZWNvcmF0ZTogX19kZWNvcmF0ZSxcclxuICAgIF9fcGFyYW06IF9fcGFyYW0sXHJcbiAgICBfX2VzRGVjb3JhdGU6IF9fZXNEZWNvcmF0ZSxcclxuICAgIF9fcnVuSW5pdGlhbGl6ZXJzOiBfX3J1bkluaXRpYWxpemVycyxcclxuICAgIF9fcHJvcEtleTogX19wcm9wS2V5LFxyXG4gICAgX19zZXRGdW5jdGlvbk5hbWU6IF9fc2V0RnVuY3Rpb25OYW1lLFxyXG4gICAgX19tZXRhZGF0YTogX19tZXRhZGF0YSxcclxuICAgIF9fYXdhaXRlcjogX19hd2FpdGVyLFxyXG4gICAgX19nZW5lcmF0b3I6IF9fZ2VuZXJhdG9yLFxyXG4gICAgX19jcmVhdGVCaW5kaW5nOiBfX2NyZWF0ZUJpbmRpbmcsXHJcbiAgICBfX2V4cG9ydFN0YXI6IF9fZXhwb3J0U3RhcixcclxuICAgIF9fdmFsdWVzOiBfX3ZhbHVlcyxcclxuICAgIF9fcmVhZDogX19yZWFkLFxyXG4gICAgX19zcHJlYWQ6IF9fc3ByZWFkLFxyXG4gICAgX19zcHJlYWRBcnJheXM6IF9fc3ByZWFkQXJyYXlzLFxyXG4gICAgX19zcHJlYWRBcnJheTogX19zcHJlYWRBcnJheSxcclxuICAgIF9fYXdhaXQ6IF9fYXdhaXQsXHJcbiAgICBfX2FzeW5jR2VuZXJhdG9yOiBfX2FzeW5jR2VuZXJhdG9yLFxyXG4gICAgX19hc3luY0RlbGVnYXRvcjogX19hc3luY0RlbGVnYXRvcixcclxuICAgIF9fYXN5bmNWYWx1ZXM6IF9fYXN5bmNWYWx1ZXMsXHJcbiAgICBfX21ha2VUZW1wbGF0ZU9iamVjdDogX19tYWtlVGVtcGxhdGVPYmplY3QsXHJcbiAgICBfX2ltcG9ydFN0YXI6IF9faW1wb3J0U3RhcixcclxuICAgIF9faW1wb3J0RGVmYXVsdDogX19pbXBvcnREZWZhdWx0LFxyXG4gICAgX19jbGFzc1ByaXZhdGVGaWVsZEdldDogX19jbGFzc1ByaXZhdGVGaWVsZEdldCxcclxuICAgIF9fY2xhc3NQcml2YXRlRmllbGRTZXQ6IF9fY2xhc3NQcml2YXRlRmllbGRTZXQsXHJcbiAgICBfX2NsYXNzUHJpdmF0ZUZpZWxkSW46IF9fY2xhc3NQcml2YXRlRmllbGRJbixcclxuICAgIF9fYWRkRGlzcG9zYWJsZVJlc291cmNlOiBfX2FkZERpc3Bvc2FibGVSZXNvdXJjZSxcclxuICAgIF9fZGlzcG9zZVJlc291cmNlczogX19kaXNwb3NlUmVzb3VyY2VzLFxyXG4gICAgX19yZXdyaXRlUmVsYXRpdmVJbXBvcnRFeHRlbnNpb246IF9fcmV3cml0ZVJlbGF0aXZlSW1wb3J0RXh0ZW5zaW9uLFxyXG59O1xyXG4iLCJpbXBvcnQgX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UgZnJvbSAnQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZSc7XG5pbXBvcnQgX2V4dGVuZHMgZnJvbSAnQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vZXh0ZW5kcyc7XG5pbXBvcnQgX2Fzc2VydFRoaXNJbml0aWFsaXplZCBmcm9tICdAYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQnO1xuaW1wb3J0IF9pbmhlcml0c0xvb3NlIGZyb20gJ0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2luaGVyaXRzTG9vc2UnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IGNsb25lRWxlbWVudCwgQ29tcG9uZW50LCB1c2VSZWYsIHVzZUVmZmVjdCwgdXNlQ2FsbGJhY2ssIHVzZUxheW91dEVmZmVjdCwgdXNlUmVkdWNlciwgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGlzRm9yd2FyZFJlZiB9IGZyb20gJ3JlYWN0LWlzJztcbmltcG9ydCBjb21wdXRlIGZyb20gJ2NvbXB1dGUtc2Nyb2xsLWludG8tdmlldyc7XG5pbXBvcnQgeyBfX2Fzc2lnbiB9IGZyb20gJ3RzbGliJztcblxudmFyIGlkQ291bnRlciA9IDA7XG5cbi8qKlxuICogQWNjZXB0cyBhIHBhcmFtZXRlciBhbmQgcmV0dXJucyBpdCBpZiBpdCdzIGEgZnVuY3Rpb25cbiAqIG9yIGEgbm9vcCBmdW5jdGlvbiBpZiBpdCdzIG5vdC4gVGhpcyBhbGxvd3MgdXMgdG9cbiAqIGFjY2VwdCBhIGNhbGxiYWNrLCBidXQgbm90IHdvcnJ5IGFib3V0IGl0IGlmIGl0J3Mgbm90XG4gKiBwYXNzZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiB0aGUgY2FsbGJhY2tcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBhIGZ1bmN0aW9uXG4gKi9cbmZ1bmN0aW9uIGNiVG9DYihjYikge1xuICByZXR1cm4gdHlwZW9mIGNiID09PSAnZnVuY3Rpb24nID8gY2IgOiBub29wO1xufVxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbi8qKlxuICogU2Nyb2xsIG5vZGUgaW50byB2aWV3IGlmIG5lY2Vzc2FyeVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbm9kZSB0aGUgZWxlbWVudCB0aGF0IHNob3VsZCBzY3JvbGwgaW50byB2aWV3XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBtZW51Tm9kZSB0aGUgbWVudSBlbGVtZW50IG9mIHRoZSBjb21wb25lbnRcbiAqL1xuZnVuY3Rpb24gc2Nyb2xsSW50b1ZpZXcobm9kZSwgbWVudU5vZGUpIHtcbiAgaWYgKCFub2RlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBhY3Rpb25zID0gY29tcHV0ZShub2RlLCB7XG4gICAgYm91bmRhcnk6IG1lbnVOb2RlLFxuICAgIGJsb2NrOiAnbmVhcmVzdCcsXG4gICAgc2Nyb2xsTW9kZTogJ2lmLW5lZWRlZCdcbiAgfSk7XG4gIGFjdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciBlbCA9IF9yZWYuZWwsXG4gICAgICB0b3AgPSBfcmVmLnRvcCxcbiAgICAgIGxlZnQgPSBfcmVmLmxlZnQ7XG4gICAgZWwuc2Nyb2xsVG9wID0gdG9wO1xuICAgIGVsLnNjcm9sbExlZnQgPSBsZWZ0O1xuICB9KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwYXJlbnQgdGhlIHBhcmVudCBub2RlXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjaGlsZCB0aGUgY2hpbGQgbm9kZVxuICogQHBhcmFtIHtXaW5kb3d9IGVudmlyb25tZW50IFRoZSB3aW5kb3cgY29udGV4dCB3aGVyZSBkb3duc2hpZnQgcmVuZGVycy5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IHdoZXRoZXIgdGhlIHBhcmVudCBpcyB0aGUgY2hpbGQgb3IgdGhlIGNoaWxkIGlzIGluIHRoZSBwYXJlbnRcbiAqL1xuZnVuY3Rpb24gaXNPckNvbnRhaW5zTm9kZShwYXJlbnQsIGNoaWxkLCBlbnZpcm9ubWVudCkge1xuICB2YXIgcmVzdWx0ID0gcGFyZW50ID09PSBjaGlsZCB8fCBjaGlsZCBpbnN0YW5jZW9mIGVudmlyb25tZW50Lk5vZGUgJiYgcGFyZW50LmNvbnRhaW5zICYmIHBhcmVudC5jb250YWlucyhjaGlsZCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogU2ltcGxlIGRlYm91bmNlIGltcGxlbWVudGF0aW9uLiBXaWxsIGNhbGwgdGhlIGdpdmVuXG4gKiBmdW5jdGlvbiBvbmNlIGFmdGVyIHRoZSB0aW1lIGdpdmVuIGhhcyBwYXNzZWQgc2luY2VcbiAqIGl0IHdhcyBsYXN0IGNhbGxlZC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIHRoZSBmdW5jdGlvbiB0byBjYWxsIGFmdGVyIHRoZSB0aW1lXG4gKiBAcGFyYW0ge051bWJlcn0gdGltZSB0aGUgdGltZSB0byB3YWl0XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmbiwgdGltZSkge1xuICB2YXIgdGltZW91dElkO1xuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgaWYgKHRpbWVvdXRJZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHdyYXBwZXIoKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cbiAgICBjYW5jZWwoKTtcbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHRpbWVvdXRJZCA9IG51bGw7XG4gICAgICBmbi5hcHBseSh2b2lkIDAsIGFyZ3MpO1xuICAgIH0sIHRpbWUpO1xuICB9XG4gIHdyYXBwZXIuY2FuY2VsID0gY2FuY2VsO1xuICByZXR1cm4gd3JhcHBlcjtcbn1cblxuLyoqXG4gKiBUaGlzIGlzIGludGVuZGVkIHRvIGJlIHVzZWQgdG8gY29tcG9zZSBldmVudCBoYW5kbGVycy5cbiAqIFRoZXkgYXJlIGV4ZWN1dGVkIGluIG9yZGVyIHVudGlsIG9uZSBvZiB0aGVtIHNldHNcbiAqIGBldmVudC5wcmV2ZW50RG93bnNoaWZ0RGVmYXVsdCA9IHRydWVgLlxuICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gZm5zIHRoZSBldmVudCBoYW5kbGVyIGZ1bmN0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb259IHRoZSBldmVudCBoYW5kbGVyIHRvIGFkZCB0byBhbiBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGNhbGxBbGxFdmVudEhhbmRsZXJzKCkge1xuICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGZucyA9IG5ldyBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgIGZuc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjMgPiAxID8gX2xlbjMgLSAxIDogMCksIF9rZXkzID0gMTsgX2tleTMgPCBfbGVuMzsgX2tleTMrKykge1xuICAgICAgYXJnc1tfa2V5MyAtIDFdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgICB9XG4gICAgcmV0dXJuIGZucy5zb21lKGZ1bmN0aW9uIChmbikge1xuICAgICAgaWYgKGZuKSB7XG4gICAgICAgIGZuLmFwcGx5KHZvaWQgMCwgW2V2ZW50XS5jb25jYXQoYXJncykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGV2ZW50LnByZXZlbnREb3duc2hpZnREZWZhdWx0IHx8IGV2ZW50Lmhhc093blByb3BlcnR5KCduYXRpdmVFdmVudCcpICYmIGV2ZW50Lm5hdGl2ZUV2ZW50LnByZXZlbnREb3duc2hpZnREZWZhdWx0O1xuICAgIH0pO1xuICB9O1xufVxuZnVuY3Rpb24gaGFuZGxlUmVmcygpIHtcbiAgZm9yICh2YXIgX2xlbjQgPSBhcmd1bWVudHMubGVuZ3RoLCByZWZzID0gbmV3IEFycmF5KF9sZW40KSwgX2tleTQgPSAwOyBfa2V5NCA8IF9sZW40OyBfa2V5NCsrKSB7XG4gICAgcmVmc1tfa2V5NF0gPSBhcmd1bWVudHNbX2tleTRdO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAobm9kZSkge1xuICAgIHJlZnMuZm9yRWFjaChmdW5jdGlvbiAocmVmKSB7XG4gICAgICBpZiAodHlwZW9mIHJlZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZWYobm9kZSk7XG4gICAgICB9IGVsc2UgaWYgKHJlZikge1xuICAgICAgICByZWYuY3VycmVudCA9IG5vZGU7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59XG5cbi8qKlxuICogVGhpcyBnZW5lcmF0ZXMgYSB1bmlxdWUgSUQgZm9yIGFuIGluc3RhbmNlIG9mIERvd25zaGlmdFxuICogQHJldHVybiB7U3RyaW5nfSB0aGUgdW5pcXVlIElEXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlSWQoKSB7XG4gIHJldHVybiBTdHJpbmcoaWRDb3VudGVyKyspO1xufVxuXG4vKipcbiAqIFJlc2V0cyBpZENvdW50ZXIgdG8gMC4gVXNlZCBmb3IgU1NSLlxuICovXG5mdW5jdGlvbiByZXNldElkQ291bnRlcigpIHtcbiAgaWRDb3VudGVyID0gMDtcbn1cblxuLyoqXG4gKiBEZWZhdWx0IGltcGxlbWVudGF0aW9uIGZvciBzdGF0dXMgbWVzc2FnZS4gT25seSBhZGRlZCB3aGVuIG1lbnUgaXMgb3Blbi5cbiAqIFdpbGwgc3BlY2lmeSBpZiB0aGVyZSBhcmUgcmVzdWx0cyBpbiB0aGUgbGlzdCwgYW5kIGlmIHNvLCBob3cgbWFueSxcbiAqIGFuZCB3aGF0IGtleXMgYXJlIHJlbGV2YW50LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbSB0aGUgZG93bnNoaWZ0IHN0YXRlIGFuZCBvdGhlciByZWxldmFudCBwcm9wZXJ0aWVzXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHRoZSBhMTF5IHN0YXR1cyBtZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIGdldEExMXlTdGF0dXNNZXNzYWdlJDEoX3JlZjIpIHtcbiAgdmFyIGlzT3BlbiA9IF9yZWYyLmlzT3BlbixcbiAgICByZXN1bHRDb3VudCA9IF9yZWYyLnJlc3VsdENvdW50LFxuICAgIHByZXZpb3VzUmVzdWx0Q291bnQgPSBfcmVmMi5wcmV2aW91c1Jlc3VsdENvdW50O1xuICBpZiAoIWlzT3Blbikge1xuICAgIHJldHVybiAnJztcbiAgfVxuICBpZiAoIXJlc3VsdENvdW50KSB7XG4gICAgcmV0dXJuICdObyByZXN1bHRzIGFyZSBhdmFpbGFibGUuJztcbiAgfVxuICBpZiAocmVzdWx0Q291bnQgIT09IHByZXZpb3VzUmVzdWx0Q291bnQpIHtcbiAgICByZXR1cm4gcmVzdWx0Q291bnQgKyBcIiByZXN1bHRcIiArIChyZXN1bHRDb3VudCA9PT0gMSA/ICcgaXMnIDogJ3MgYXJlJykgKyBcIiBhdmFpbGFibGUsIHVzZSB1cCBhbmQgZG93biBhcnJvdyBrZXlzIHRvIG5hdmlnYXRlLiBQcmVzcyBFbnRlciBrZXkgdG8gc2VsZWN0LlwiO1xuICB9XG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBUYWtlcyBhbiBhcmd1bWVudCBhbmQgaWYgaXQncyBhbiBhcnJheSwgcmV0dXJucyB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgYXJyYXlcbiAqIG90aGVyd2lzZSByZXR1cm5zIHRoZSBhcmd1bWVudFxuICogQHBhcmFtIHsqfSBhcmcgdGhlIG1heWJlLWFycmF5XG4gKiBAcGFyYW0geyp9IGRlZmF1bHRWYWx1ZSB0aGUgdmFsdWUgaWYgYXJnIGlzIGZhbHNleSBub3QgZGVmaW5lZFxuICogQHJldHVybiB7Kn0gdGhlIGFyZyBvciBpdCdzIGZpcnN0IGl0ZW1cbiAqL1xuZnVuY3Rpb24gdW53cmFwQXJyYXkoYXJnLCBkZWZhdWx0VmFsdWUpIHtcbiAgYXJnID0gQXJyYXkuaXNBcnJheShhcmcpID8gLyogaXN0YW5idWwgaWdub3JlIG5leHQgKHByZWFjdCkgKi9hcmdbMF0gOiBhcmc7XG4gIGlmICghYXJnICYmIGRlZmF1bHRWYWx1ZSkge1xuICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGFyZztcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IChQKXJlYWN0IGVsZW1lbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHdoZXRoZXIgaXQncyBhIERPTSBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGlzRE9NRWxlbWVudChlbGVtZW50KSB7XG5cbiAgLy8gdGhlbiB3ZSBhc3N1bWUgdGhpcyBpcyByZWFjdFxuICByZXR1cm4gdHlwZW9mIGVsZW1lbnQudHlwZSA9PT0gJ3N0cmluZyc7XG59XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgKFApcmVhY3QgZWxlbWVudFxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgcHJvcHNcbiAqL1xuZnVuY3Rpb24gZ2V0RWxlbWVudFByb3BzKGVsZW1lbnQpIHtcbiAgcmV0dXJuIGVsZW1lbnQucHJvcHM7XG59XG5cbi8qKlxuICogVGhyb3dzIGEgaGVscGZ1bCBlcnJvciBtZXNzYWdlIGZvciByZXF1aXJlZCBwcm9wZXJ0aWVzLiBVc2VmdWxcbiAqIHRvIGJlIHVzZWQgYXMgYSBkZWZhdWx0IGluIGRlc3RydWN0dXJpbmcgb3Igb2JqZWN0IHBhcmFtcy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBmbk5hbWUgdGhlIGZ1bmN0aW9uIG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wTmFtZSB0aGUgcHJvcCBuYW1lXG4gKi9cbmZ1bmN0aW9uIHJlcXVpcmVkUHJvcChmbk5hbWUsIHByb3BOYW1lKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gIGNvbnNvbGUuZXJyb3IoXCJUaGUgcHJvcGVydHkgXFxcIlwiICsgcHJvcE5hbWUgKyBcIlxcXCIgaXMgcmVxdWlyZWQgaW4gXFxcIlwiICsgZm5OYW1lICsgXCJcXFwiXCIpO1xufVxudmFyIHN0YXRlS2V5cyA9IFsnaGlnaGxpZ2h0ZWRJbmRleCcsICdpbnB1dFZhbHVlJywgJ2lzT3BlbicsICdzZWxlY3RlZEl0ZW0nLCAndHlwZSddO1xuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhdGUgdGhlIHN0YXRlIG9iamVjdFxuICogQHJldHVybiB7T2JqZWN0fSBzdGF0ZSB0aGF0IGlzIHJlbGV2YW50IHRvIGRvd25zaGlmdFxuICovXG5mdW5jdGlvbiBwaWNrU3RhdGUoc3RhdGUpIHtcbiAgaWYgKHN0YXRlID09PSB2b2lkIDApIHtcbiAgICBzdGF0ZSA9IHt9O1xuICB9XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgc3RhdGVLZXlzLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICBpZiAoc3RhdGUuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgIHJlc3VsdFtrXSA9IHN0YXRlW2tdO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhpcyB3aWxsIHBlcmZvcm0gYSBzaGFsbG93IG1lcmdlIG9mIHRoZSBnaXZlbiBzdGF0ZSBvYmplY3RcbiAqIHdpdGggdGhlIHN0YXRlIGNvbWluZyBmcm9tIHByb3BzXG4gKiAoZm9yIHRoZSBjb250cm9sbGVkIGNvbXBvbmVudCBzY2VuYXJpbylcbiAqIFRoaXMgaXMgdXNlZCBpbiBzdGF0ZSB1cGRhdGVyIGZ1bmN0aW9ucyBzbyB0aGV5J3JlIHJlZmVyZW5jaW5nXG4gKiB0aGUgcmlnaHQgc3RhdGUgcmVnYXJkbGVzcyBvZiB3aGVyZSBpdCBjb21lcyBmcm9tLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZSBUaGUgc3RhdGUgb2YgdGhlIGNvbXBvbmVudC9ob29rLlxuICogQHBhcmFtIHtPYmplY3R9IHByb3BzIFRoZSBwcm9wcyB0aGF0IG1heSBjb250YWluIGNvbnRyb2xsZWQgdmFsdWVzLlxuICogQHJldHVybnMge09iamVjdH0gVGhlIG1lcmdlZCBjb250cm9sbGVkIHN0YXRlLlxuICovXG5mdW5jdGlvbiBnZXRTdGF0ZShzdGF0ZSwgcHJvcHMpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHN0YXRlKS5yZWR1Y2UoZnVuY3Rpb24gKHByZXZTdGF0ZSwga2V5KSB7XG4gICAgcHJldlN0YXRlW2tleV0gPSBpc0NvbnRyb2xsZWRQcm9wKHByb3BzLCBrZXkpID8gcHJvcHNba2V5XSA6IHN0YXRlW2tleV07XG4gICAgcmV0dXJuIHByZXZTdGF0ZTtcbiAgfSwge30pO1xufVxuXG4vKipcbiAqIFRoaXMgZGV0ZXJtaW5lcyB3aGV0aGVyIGEgcHJvcCBpcyBhIFwiY29udHJvbGxlZCBwcm9wXCIgbWVhbmluZyBpdCBpc1xuICogc3RhdGUgd2hpY2ggaXMgY29udHJvbGxlZCBieSB0aGUgb3V0c2lkZSBvZiB0aGlzIGNvbXBvbmVudCByYXRoZXJcbiAqIHRoYW4gd2l0aGluIHRoaXMgY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBUaGUgcHJvcHMgdGhhdCBtYXkgY29udGFpbiBjb250cm9sbGVkIHZhbHVlcy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgdGhlIGtleSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn0gd2hldGhlciBpdCBpcyBhIGNvbnRyb2xsZWQgY29udHJvbGxlZCBwcm9wXG4gKi9cbmZ1bmN0aW9uIGlzQ29udHJvbGxlZFByb3AocHJvcHMsIGtleSkge1xuICByZXR1cm4gcHJvcHNba2V5XSAhPT0gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIE5vcm1hbGl6ZXMgdGhlICdrZXknIHByb3BlcnR5IG9mIGEgS2V5Ym9hcmRFdmVudCBpbiBJRS9FZGdlXG4gKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgYSBrZXlib2FyZEV2ZW50IG9iamVjdFxuICogQHJldHVybiB7U3RyaW5nfSBrZXlib2FyZCBrZXlcbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplQXJyb3dLZXkoZXZlbnQpIHtcbiAgdmFyIGtleSA9IGV2ZW50LmtleSxcbiAgICBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKGllKSAqL1xuICBpZiAoa2V5Q29kZSA+PSAzNyAmJiBrZXlDb2RlIDw9IDQwICYmIGtleS5pbmRleE9mKCdBcnJvdycpICE9PSAwKSB7XG4gICAgcmV0dXJuIFwiQXJyb3dcIiArIGtleTtcbiAgfVxuICByZXR1cm4ga2V5O1xufVxuXG4vKipcbiAqIFNpbXBsZSBjaGVjayBpZiB0aGUgdmFsdWUgcGFzc2VkIGlzIG9iamVjdCBsaXRlcmFsXG4gKiBAcGFyYW0geyp9IG9iaiBhbnkgdGhpbmdzXG4gKiBAcmV0dXJuIHtCb29sZWFufSB3aGV0aGVyIGl0J3Mgb2JqZWN0IGxpdGVyYWxcbiAqL1xuZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBPYmplY3RdJztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBuZXcgaW5kZXggaW4gdGhlIGxpc3QsIGluIGEgY2lyY3VsYXIgd2F5LiBJZiBuZXh0IHZhbHVlIGlzIG91dCBvZiBib25kcyBmcm9tIHRoZSB0b3RhbCxcbiAqIGl0IHdpbGwgd3JhcCB0byBlaXRoZXIgMCBvciBpdGVtQ291bnQgLSAxLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBtb3ZlQW1vdW50IE51bWJlciBvZiBwb3NpdGlvbnMgdG8gbW92ZS4gTmVnYXRpdmUgdG8gbW92ZSBiYWNrd2FyZHMsIHBvc2l0aXZlIGZvcndhcmRzLlxuICogQHBhcmFtIHtudW1iZXJ9IGJhc2VJbmRleCBUaGUgaW5pdGlhbCBwb3NpdGlvbiB0byBtb3ZlIGZyb20uXG4gKiBAcGFyYW0ge251bWJlcn0gaXRlbUNvdW50IFRoZSB0b3RhbCBudW1iZXIgb2YgaXRlbXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBnZXRJdGVtTm9kZUZyb21JbmRleCBVc2VkIHRvIGNoZWNrIGlmIGl0ZW0gaXMgZGlzYWJsZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNpcmN1bGFyIFNwZWNpZnkgaWYgbmF2aWdhdGlvbiBpcyBjaXJjdWxhci4gRGVmYXVsdCBpcyB0cnVlLlxuICogQHJldHVybnMge251bWJlcn0gVGhlIG5ldyBpbmRleCBhZnRlciB0aGUgbW92ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0TmV4dFdyYXBwaW5nSW5kZXgobW92ZUFtb3VudCwgYmFzZUluZGV4LCBpdGVtQ291bnQsIGdldEl0ZW1Ob2RlRnJvbUluZGV4LCBjaXJjdWxhcikge1xuICBpZiAoY2lyY3VsYXIgPT09IHZvaWQgMCkge1xuICAgIGNpcmN1bGFyID0gdHJ1ZTtcbiAgfVxuICBpZiAoaXRlbUNvdW50ID09PSAwKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIHZhciBpdGVtc0xhc3RJbmRleCA9IGl0ZW1Db3VudCAtIDE7XG4gIGlmICh0eXBlb2YgYmFzZUluZGV4ICE9PSAnbnVtYmVyJyB8fCBiYXNlSW5kZXggPCAwIHx8IGJhc2VJbmRleCA+PSBpdGVtQ291bnQpIHtcbiAgICBiYXNlSW5kZXggPSBtb3ZlQW1vdW50ID4gMCA/IC0xIDogaXRlbXNMYXN0SW5kZXggKyAxO1xuICB9XG4gIHZhciBuZXdJbmRleCA9IGJhc2VJbmRleCArIG1vdmVBbW91bnQ7XG4gIGlmIChuZXdJbmRleCA8IDApIHtcbiAgICBuZXdJbmRleCA9IGNpcmN1bGFyID8gaXRlbXNMYXN0SW5kZXggOiAwO1xuICB9IGVsc2UgaWYgKG5ld0luZGV4ID4gaXRlbXNMYXN0SW5kZXgpIHtcbiAgICBuZXdJbmRleCA9IGNpcmN1bGFyID8gMCA6IGl0ZW1zTGFzdEluZGV4O1xuICB9XG4gIHZhciBub25EaXNhYmxlZE5ld0luZGV4ID0gZ2V0TmV4dE5vbkRpc2FibGVkSW5kZXgobW92ZUFtb3VudCwgbmV3SW5kZXgsIGl0ZW1Db3VudCwgZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIGNpcmN1bGFyKTtcbiAgaWYgKG5vbkRpc2FibGVkTmV3SW5kZXggPT09IC0xKSB7XG4gICAgcmV0dXJuIGJhc2VJbmRleCA+PSBpdGVtQ291bnQgPyAtMSA6IGJhc2VJbmRleDtcbiAgfVxuICByZXR1cm4gbm9uRGlzYWJsZWROZXdJbmRleDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBuZXh0IGluZGV4IGluIHRoZSBsaXN0IG9mIGFuIGl0ZW0gdGhhdCBpcyBub3QgZGlzYWJsZWQuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IG1vdmVBbW91bnQgTnVtYmVyIG9mIHBvc2l0aW9ucyB0byBtb3ZlLiBOZWdhdGl2ZSB0byBtb3ZlIGJhY2t3YXJkcywgcG9zaXRpdmUgZm9yd2FyZHMuXG4gKiBAcGFyYW0ge251bWJlcn0gYmFzZUluZGV4IFRoZSBpbml0aWFsIHBvc2l0aW9uIHRvIG1vdmUgZnJvbS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBpdGVtQ291bnQgVGhlIHRvdGFsIG51bWJlciBvZiBpdGVtcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGdldEl0ZW1Ob2RlRnJvbUluZGV4IFVzZWQgdG8gY2hlY2sgaWYgaXRlbSBpcyBkaXNhYmxlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY2lyY3VsYXIgU3BlY2lmeSBpZiBuYXZpZ2F0aW9uIGlzIGNpcmN1bGFyLiBEZWZhdWx0IGlzIHRydWUuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgbmV3IGluZGV4LiBSZXR1cm5zIGJhc2VJbmRleCBpZiBpdGVtIGlzIG5vdCBkaXNhYmxlZC4gUmV0dXJucyBuZXh0IG5vbi1kaXNhYmxlZCBpdGVtIG90aGVyd2lzZS4gSWYgbm8gbm9uLWRpc2FibGVkIGZvdW5kIGl0IHdpbGwgcmV0dXJuIC0xLlxuICovXG5mdW5jdGlvbiBnZXROZXh0Tm9uRGlzYWJsZWRJbmRleChtb3ZlQW1vdW50LCBiYXNlSW5kZXgsIGl0ZW1Db3VudCwgZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIGNpcmN1bGFyKSB7XG4gIHZhciBjdXJyZW50RWxlbWVudE5vZGUgPSBnZXRJdGVtTm9kZUZyb21JbmRleChiYXNlSW5kZXgpO1xuICBpZiAoIWN1cnJlbnRFbGVtZW50Tm9kZSB8fCAhY3VycmVudEVsZW1lbnROb2RlLmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSkge1xuICAgIHJldHVybiBiYXNlSW5kZXg7XG4gIH1cbiAgaWYgKG1vdmVBbW91bnQgPiAwKSB7XG4gICAgZm9yICh2YXIgaW5kZXggPSBiYXNlSW5kZXggKyAxOyBpbmRleCA8IGl0ZW1Db3VudDsgaW5kZXgrKykge1xuICAgICAgaWYgKCFnZXRJdGVtTm9kZUZyb21JbmRleChpbmRleCkuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgX2luZGV4ID0gYmFzZUluZGV4IC0gMTsgX2luZGV4ID49IDA7IF9pbmRleC0tKSB7XG4gICAgICBpZiAoIWdldEl0ZW1Ob2RlRnJvbUluZGV4KF9pbmRleCkuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgIHJldHVybiBfaW5kZXg7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChjaXJjdWxhcikge1xuICAgIHJldHVybiBtb3ZlQW1vdW50ID4gMCA/IGdldE5leHROb25EaXNhYmxlZEluZGV4KDEsIDAsIGl0ZW1Db3VudCwgZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIGZhbHNlKSA6IGdldE5leHROb25EaXNhYmxlZEluZGV4KC0xLCBpdGVtQ291bnQgLSAxLCBpdGVtQ291bnQsIGdldEl0ZW1Ob2RlRnJvbUluZGV4LCBmYWxzZSk7XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBldmVudCB0YXJnZXQgaXMgd2l0aGluIHRoZSBkb3duc2hpZnQgZWxlbWVudHMuXG4gKlxuICogQHBhcmFtIHtFdmVudFRhcmdldH0gdGFyZ2V0IFRhcmdldCB0byBjaGVjay5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnRbXX0gZG93bnNoaWZ0RWxlbWVudHMgVGhlIGVsZW1lbnRzIHRoYXQgZm9ybSBkb3duc2hpZnQgKGxpc3QsIHRvZ2dsZSBidXR0b24gZXRjKS5cbiAqIEBwYXJhbSB7V2luZG93fSBlbnZpcm9ubWVudCBUaGUgd2luZG93IGNvbnRleHQgd2hlcmUgZG93bnNoaWZ0IHJlbmRlcnMuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrQWN0aXZlRWxlbWVudCBXaGV0aGVyIHRvIGFsc28gY2hlY2sgYWN0aXZlRWxlbWVudC5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIHRhcmdldCBpcyB3aXRoaW4gZG93bnNoaWZ0IGVsZW1lbnRzLlxuICovXG5mdW5jdGlvbiB0YXJnZXRXaXRoaW5Eb3duc2hpZnQodGFyZ2V0LCBkb3duc2hpZnRFbGVtZW50cywgZW52aXJvbm1lbnQsIGNoZWNrQWN0aXZlRWxlbWVudCkge1xuICBpZiAoY2hlY2tBY3RpdmVFbGVtZW50ID09PSB2b2lkIDApIHtcbiAgICBjaGVja0FjdGl2ZUVsZW1lbnQgPSB0cnVlO1xuICB9XG4gIHJldHVybiBkb3duc2hpZnRFbGVtZW50cy5zb21lKGZ1bmN0aW9uIChjb250ZXh0Tm9kZSkge1xuICAgIHJldHVybiBjb250ZXh0Tm9kZSAmJiAoaXNPckNvbnRhaW5zTm9kZShjb250ZXh0Tm9kZSwgdGFyZ2V0LCBlbnZpcm9ubWVudCkgfHwgY2hlY2tBY3RpdmVFbGVtZW50ICYmIGlzT3JDb250YWluc05vZGUoY29udGV4dE5vZGUsIGVudmlyb25tZW50LmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQsIGVudmlyb25tZW50KSk7XG4gIH0pO1xufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLW11dGFibGUtZXhwb3J0c1xudmFyIHZhbGlkYXRlQ29udHJvbGxlZFVuY2hhbmdlZCA9IG5vb3A7XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFsaWRhdGVDb250cm9sbGVkVW5jaGFuZ2VkID0gZnVuY3Rpb24gdmFsaWRhdGVDb250cm9sbGVkVW5jaGFuZ2VkKHN0YXRlLCBwcmV2UHJvcHMsIG5leHRQcm9wcykge1xuICAgIHZhciB3YXJuaW5nRGVzY3JpcHRpb24gPSBcIlRoaXMgcHJvcCBzaG91bGQgbm90IHN3aXRjaCBmcm9tIGNvbnRyb2xsZWQgdG8gdW5jb250cm9sbGVkIChvciB2aWNlIHZlcnNhKS4gRGVjaWRlIGJldHdlZW4gdXNpbmcgYSBjb250cm9sbGVkIG9yIHVuY29udHJvbGxlZCBEb3duc2hpZnQgZWxlbWVudCBmb3IgdGhlIGxpZmV0aW1lIG9mIHRoZSBjb21wb25lbnQuIE1vcmUgaW5mbzogaHR0cHM6Ly9naXRodWIuY29tL2Rvd25zaGlmdC1qcy9kb3duc2hpZnQjY29udHJvbC1wcm9wc1wiO1xuICAgIE9iamVjdC5rZXlzKHN0YXRlKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wS2V5KSB7XG4gICAgICBpZiAocHJldlByb3BzW3Byb3BLZXldICE9PSB1bmRlZmluZWQgJiYgbmV4dFByb3BzW3Byb3BLZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgY29uc29sZS5lcnJvcihcImRvd25zaGlmdDogQSBjb21wb25lbnQgaGFzIGNoYW5nZWQgdGhlIGNvbnRyb2xsZWQgcHJvcCBcXFwiXCIgKyBwcm9wS2V5ICsgXCJcXFwiIHRvIGJlIHVuY29udHJvbGxlZC4gXCIgKyB3YXJuaW5nRGVzY3JpcHRpb24pO1xuICAgICAgfSBlbHNlIGlmIChwcmV2UHJvcHNbcHJvcEtleV0gPT09IHVuZGVmaW5lZCAmJiBuZXh0UHJvcHNbcHJvcEtleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICBjb25zb2xlLmVycm9yKFwiZG93bnNoaWZ0OiBBIGNvbXBvbmVudCBoYXMgY2hhbmdlZCB0aGUgdW5jb250cm9sbGVkIHByb3AgXFxcIlwiICsgcHJvcEtleSArIFwiXFxcIiB0byBiZSBjb250cm9sbGVkLiBcIiArIHdhcm5pbmdEZXNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59XG5cbnZhciBjbGVhbnVwU3RhdHVzID0gZGVib3VuY2UoZnVuY3Rpb24gKGRvY3VtZW50UHJvcCkge1xuICBnZXRTdGF0dXNEaXYoZG9jdW1lbnRQcm9wKS50ZXh0Q29udGVudCA9ICcnO1xufSwgNTAwKTtcblxuLyoqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RhdHVzIHRoZSBzdGF0dXMgbWVzc2FnZVxuICogQHBhcmFtIHtPYmplY3R9IGRvY3VtZW50UHJvcCBkb2N1bWVudCBwYXNzZWQgYnkgdGhlIHVzZXIuXG4gKi9cbmZ1bmN0aW9uIHNldFN0YXR1cyhzdGF0dXMsIGRvY3VtZW50UHJvcCkge1xuICB2YXIgZGl2ID0gZ2V0U3RhdHVzRGl2KGRvY3VtZW50UHJvcCk7XG4gIGlmICghc3RhdHVzKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGRpdi50ZXh0Q29udGVudCA9IHN0YXR1cztcbiAgY2xlYW51cFN0YXR1cyhkb2N1bWVudFByb3ApO1xufVxuXG4vKipcbiAqIEdldCB0aGUgc3RhdHVzIG5vZGUgb3IgY3JlYXRlIGl0IGlmIGl0IGRvZXMgbm90IGFscmVhZHkgZXhpc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gZG9jdW1lbnRQcm9wIGRvY3VtZW50IHBhc3NlZCBieSB0aGUgdXNlci5cbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSB0aGUgc3RhdHVzIG5vZGUuXG4gKi9cbmZ1bmN0aW9uIGdldFN0YXR1c0Rpdihkb2N1bWVudFByb3ApIHtcbiAgaWYgKGRvY3VtZW50UHJvcCA9PT0gdm9pZCAwKSB7XG4gICAgZG9jdW1lbnRQcm9wID0gZG9jdW1lbnQ7XG4gIH1cbiAgdmFyIHN0YXR1c0RpdiA9IGRvY3VtZW50UHJvcC5nZXRFbGVtZW50QnlJZCgnYTExeS1zdGF0dXMtbWVzc2FnZScpO1xuICBpZiAoc3RhdHVzRGl2KSB7XG4gICAgcmV0dXJuIHN0YXR1c0RpdjtcbiAgfVxuICBzdGF0dXNEaXYgPSBkb2N1bWVudFByb3AuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHN0YXR1c0Rpdi5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2ExMXktc3RhdHVzLW1lc3NhZ2UnKTtcbiAgc3RhdHVzRGl2LnNldEF0dHJpYnV0ZSgncm9sZScsICdzdGF0dXMnKTtcbiAgc3RhdHVzRGl2LnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgJ3BvbGl0ZScpO1xuICBzdGF0dXNEaXYuc2V0QXR0cmlidXRlKCdhcmlhLXJlbGV2YW50JywgJ2FkZGl0aW9ucyB0ZXh0Jyk7XG4gIE9iamVjdC5hc3NpZ24oc3RhdHVzRGl2LnN0eWxlLCB7XG4gICAgYm9yZGVyOiAnMCcsXG4gICAgY2xpcDogJ3JlY3QoMCAwIDAgMCknLFxuICAgIGhlaWdodDogJzFweCcsXG4gICAgbWFyZ2luOiAnLTFweCcsXG4gICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgIHBhZGRpbmc6ICcwJyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB3aWR0aDogJzFweCdcbiAgfSk7XG4gIGRvY3VtZW50UHJvcC5ib2R5LmFwcGVuZENoaWxkKHN0YXR1c0Rpdik7XG4gIHJldHVybiBzdGF0dXNEaXY7XG59XG5cbnZhciB1bmtub3duID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fYXV0b2NvbXBsZXRlX3Vua25vd25fXycgOiAwO1xudmFyIG1vdXNlVXAgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19hdXRvY29tcGxldGVfbW91c2V1cF9fJyA6IDE7XG52YXIgaXRlbU1vdXNlRW50ZXIgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19hdXRvY29tcGxldGVfaXRlbV9tb3VzZWVudGVyX18nIDogMjtcbnZhciBrZXlEb3duQXJyb3dVcCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2F1dG9jb21wbGV0ZV9rZXlkb3duX2Fycm93X3VwX18nIDogMztcbnZhciBrZXlEb3duQXJyb3dEb3duID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fYXV0b2NvbXBsZXRlX2tleWRvd25fYXJyb3dfZG93bl9fJyA6IDQ7XG52YXIga2V5RG93bkVzY2FwZSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2F1dG9jb21wbGV0ZV9rZXlkb3duX2VzY2FwZV9fJyA6IDU7XG52YXIga2V5RG93bkVudGVyID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fYXV0b2NvbXBsZXRlX2tleWRvd25fZW50ZXJfXycgOiA2O1xudmFyIGtleURvd25Ib21lID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fYXV0b2NvbXBsZXRlX2tleWRvd25faG9tZV9fJyA6IDc7XG52YXIga2V5RG93bkVuZCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2F1dG9jb21wbGV0ZV9rZXlkb3duX2VuZF9fJyA6IDg7XG52YXIgY2xpY2tJdGVtID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fYXV0b2NvbXBsZXRlX2NsaWNrX2l0ZW1fXycgOiA5O1xudmFyIGJsdXJJbnB1dCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2F1dG9jb21wbGV0ZV9ibHVyX2lucHV0X18nIDogMTA7XG52YXIgY2hhbmdlSW5wdXQgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19hdXRvY29tcGxldGVfY2hhbmdlX2lucHV0X18nIDogMTE7XG52YXIga2V5RG93blNwYWNlQnV0dG9uID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fYXV0b2NvbXBsZXRlX2tleWRvd25fc3BhY2VfYnV0dG9uX18nIDogMTI7XG52YXIgY2xpY2tCdXR0b24gPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19hdXRvY29tcGxldGVfY2xpY2tfYnV0dG9uX18nIDogMTM7XG52YXIgYmx1ckJ1dHRvbiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2F1dG9jb21wbGV0ZV9ibHVyX2J1dHRvbl9fJyA6IDE0O1xudmFyIGNvbnRyb2xsZWRQcm9wVXBkYXRlZFNlbGVjdGVkSXRlbSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2F1dG9jb21wbGV0ZV9jb250cm9sbGVkX3Byb3BfdXBkYXRlZF9zZWxlY3RlZF9pdGVtX18nIDogMTU7XG52YXIgdG91Y2hFbmQgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19hdXRvY29tcGxldGVfdG91Y2hlbmRfXycgOiAxNjtcblxudmFyIHN0YXRlQ2hhbmdlVHlwZXMkMyA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgX19wcm90b19fOiBudWxsLFxuICB1bmtub3duOiB1bmtub3duLFxuICBtb3VzZVVwOiBtb3VzZVVwLFxuICBpdGVtTW91c2VFbnRlcjogaXRlbU1vdXNlRW50ZXIsXG4gIGtleURvd25BcnJvd1VwOiBrZXlEb3duQXJyb3dVcCxcbiAga2V5RG93bkFycm93RG93bjoga2V5RG93bkFycm93RG93bixcbiAga2V5RG93bkVzY2FwZToga2V5RG93bkVzY2FwZSxcbiAga2V5RG93bkVudGVyOiBrZXlEb3duRW50ZXIsXG4gIGtleURvd25Ib21lOiBrZXlEb3duSG9tZSxcbiAga2V5RG93bkVuZDoga2V5RG93bkVuZCxcbiAgY2xpY2tJdGVtOiBjbGlja0l0ZW0sXG4gIGJsdXJJbnB1dDogYmx1cklucHV0LFxuICBjaGFuZ2VJbnB1dDogY2hhbmdlSW5wdXQsXG4gIGtleURvd25TcGFjZUJ1dHRvbjoga2V5RG93blNwYWNlQnV0dG9uLFxuICBjbGlja0J1dHRvbjogY2xpY2tCdXR0b24sXG4gIGJsdXJCdXR0b246IGJsdXJCdXR0b24sXG4gIGNvbnRyb2xsZWRQcm9wVXBkYXRlZFNlbGVjdGVkSXRlbTogY29udHJvbGxlZFByb3BVcGRhdGVkU2VsZWN0ZWRJdGVtLFxuICB0b3VjaEVuZDogdG91Y2hFbmRcbn0pO1xuXG52YXIgX2V4Y2x1ZGVkJDQgPSBbXCJyZWZLZXlcIiwgXCJyZWZcIl0sXG4gIF9leGNsdWRlZDIkMyA9IFtcIm9uQ2xpY2tcIiwgXCJvblByZXNzXCIsIFwib25LZXlEb3duXCIsIFwib25LZXlVcFwiLCBcIm9uQmx1clwiXSxcbiAgX2V4Y2x1ZGVkMyQyID0gW1wib25LZXlEb3duXCIsIFwib25CbHVyXCIsIFwib25DaGFuZ2VcIiwgXCJvbklucHV0XCIsIFwib25DaGFuZ2VUZXh0XCJdLFxuICBfZXhjbHVkZWQ0JDEgPSBbXCJyZWZLZXlcIiwgXCJyZWZcIl0sXG4gIF9leGNsdWRlZDUgPSBbXCJvbk1vdXNlTW92ZVwiLCBcIm9uTW91c2VEb3duXCIsIFwib25DbGlja1wiLCBcIm9uUHJlc3NcIiwgXCJpbmRleFwiLCBcIml0ZW1cIl07XG52YXIgRG93bnNoaWZ0ID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgdmFyIERvd25zaGlmdCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoX0NvbXBvbmVudCkge1xuICAgIF9pbmhlcml0c0xvb3NlKERvd25zaGlmdCwgX0NvbXBvbmVudCk7XG4gICAgZnVuY3Rpb24gRG93bnNoaWZ0KF9wcm9wcykge1xuICAgICAgdmFyIF90aGlzO1xuICAgICAgX3RoaXMgPSBfQ29tcG9uZW50LmNhbGwodGhpcywgX3Byb3BzKSB8fCB0aGlzO1xuICAgICAgLy8gZmFuY3kgZGVzdHJ1Y3R1cmluZyArIGRlZmF1bHRzICsgYWxpYXNlc1xuICAgICAgLy8gdGhpcyBiYXNpY2FsbHkgc2F5cyBlYWNoIHZhbHVlIG9mIHN0YXRlIHNob3VsZCBlaXRoZXIgYmUgc2V0IHRvXG4gICAgICAvLyB0aGUgaW5pdGlhbCB2YWx1ZSBvciB0aGUgZGVmYXVsdCB2YWx1ZSBpZiB0aGUgaW5pdGlhbCB2YWx1ZSBpcyBub3QgcHJvdmlkZWRcbiAgICAgIF90aGlzLmlkID0gX3RoaXMucHJvcHMuaWQgfHwgXCJkb3duc2hpZnQtXCIgKyBnZW5lcmF0ZUlkKCk7XG4gICAgICBfdGhpcy5tZW51SWQgPSBfdGhpcy5wcm9wcy5tZW51SWQgfHwgX3RoaXMuaWQgKyBcIi1tZW51XCI7XG4gICAgICBfdGhpcy5sYWJlbElkID0gX3RoaXMucHJvcHMubGFiZWxJZCB8fCBfdGhpcy5pZCArIFwiLWxhYmVsXCI7XG4gICAgICBfdGhpcy5pbnB1dElkID0gX3RoaXMucHJvcHMuaW5wdXRJZCB8fCBfdGhpcy5pZCArIFwiLWlucHV0XCI7XG4gICAgICBfdGhpcy5nZXRJdGVtSWQgPSBfdGhpcy5wcm9wcy5nZXRJdGVtSWQgfHwgZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5pZCArIFwiLWl0ZW0tXCIgKyBpbmRleDtcbiAgICAgIH07XG4gICAgICBfdGhpcy5pbnB1dCA9IG51bGw7XG4gICAgICBfdGhpcy5pdGVtcyA9IFtdO1xuICAgICAgLy8gaXRlbUNvdW50IGNhbiBiZSBjaGFuZ2VkIGFzeW5jaHJvbm91c2x5XG4gICAgICAvLyBmcm9tIHdpdGhpbiBkb3duc2hpZnQgKHNvIGl0IGNhbid0IGNvbWUgZnJvbSBhIHByb3ApXG4gICAgICAvLyB0aGlzIGlzIHdoeSB3ZSBzdG9yZSBpdCBhcyBhbiBpbnN0YW5jZSBhbmQgdXNlXG4gICAgICAvLyBnZXRJdGVtQ291bnQgcmF0aGVyIHRoYW4ganVzdCB1c2UgaXRlbXMubGVuZ3RoXG4gICAgICAvLyAodG8gc3VwcG9ydCB3aW5kb3dpbmcgKyBhc3luYylcbiAgICAgIF90aGlzLml0ZW1Db3VudCA9IG51bGw7XG4gICAgICBfdGhpcy5wcmV2aW91c1Jlc3VsdENvdW50ID0gMDtcbiAgICAgIF90aGlzLnRpbWVvdXRJZHMgPSBbXTtcbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gdGhlIGZ1bmN0aW9uIHRvIGNhbGwgYWZ0ZXIgdGhlIHRpbWVcbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIHRoZSB0aW1lIHRvIHdhaXRcbiAgICAgICAqL1xuICAgICAgX3RoaXMuaW50ZXJuYWxTZXRUaW1lb3V0ID0gZnVuY3Rpb24gKGZuLCB0aW1lKSB7XG4gICAgICAgIHZhciBpZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIF90aGlzLnRpbWVvdXRJZHMgPSBfdGhpcy50aW1lb3V0SWRzLmZpbHRlcihmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgcmV0dXJuIGkgIT09IGlkO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGZuKCk7XG4gICAgICAgIH0sIHRpbWUpO1xuICAgICAgICBfdGhpcy50aW1lb3V0SWRzLnB1c2goaWQpO1xuICAgICAgfTtcbiAgICAgIF90aGlzLnNldEl0ZW1Db3VudCA9IGZ1bmN0aW9uIChjb3VudCkge1xuICAgICAgICBfdGhpcy5pdGVtQ291bnQgPSBjb3VudDtcbiAgICAgIH07XG4gICAgICBfdGhpcy51bnNldEl0ZW1Db3VudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3RoaXMuaXRlbUNvdW50ID0gbnVsbDtcbiAgICAgIH07XG4gICAgICBfdGhpcy5zZXRIaWdobGlnaHRlZEluZGV4ID0gZnVuY3Rpb24gKGhpZ2hsaWdodGVkSW5kZXgsIG90aGVyU3RhdGVUb1NldCkge1xuICAgICAgICBpZiAoaGlnaGxpZ2h0ZWRJbmRleCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleCA9IF90aGlzLnByb3BzLmRlZmF1bHRIaWdobGlnaHRlZEluZGV4O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvdGhlclN0YXRlVG9TZXQgPT09IHZvaWQgMCkge1xuICAgICAgICAgIG90aGVyU3RhdGVUb1NldCA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIG90aGVyU3RhdGVUb1NldCA9IHBpY2tTdGF0ZShvdGhlclN0YXRlVG9TZXQpO1xuICAgICAgICBfdGhpcy5pbnRlcm5hbFNldFN0YXRlKF9leHRlbmRzKHtcbiAgICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBoaWdobGlnaHRlZEluZGV4XG4gICAgICAgIH0sIG90aGVyU3RhdGVUb1NldCkpO1xuICAgICAgfTtcbiAgICAgIF90aGlzLmNsZWFyU2VsZWN0aW9uID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgIF90aGlzLmludGVybmFsU2V0U3RhdGUoe1xuICAgICAgICAgIHNlbGVjdGVkSXRlbTogbnVsbCxcbiAgICAgICAgICBpbnB1dFZhbHVlOiAnJyxcbiAgICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBfdGhpcy5wcm9wcy5kZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgICAgICBpc09wZW46IF90aGlzLnByb3BzLmRlZmF1bHRJc09wZW5cbiAgICAgICAgfSwgY2IpO1xuICAgICAgfTtcbiAgICAgIF90aGlzLnNlbGVjdEl0ZW0gPSBmdW5jdGlvbiAoaXRlbSwgb3RoZXJTdGF0ZVRvU2V0LCBjYikge1xuICAgICAgICBvdGhlclN0YXRlVG9TZXQgPSBwaWNrU3RhdGUob3RoZXJTdGF0ZVRvU2V0KTtcbiAgICAgICAgX3RoaXMuaW50ZXJuYWxTZXRTdGF0ZShfZXh0ZW5kcyh7XG4gICAgICAgICAgaXNPcGVuOiBfdGhpcy5wcm9wcy5kZWZhdWx0SXNPcGVuLFxuICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IF90aGlzLnByb3BzLmRlZmF1bHRIaWdobGlnaHRlZEluZGV4LFxuICAgICAgICAgIHNlbGVjdGVkSXRlbTogaXRlbSxcbiAgICAgICAgICBpbnB1dFZhbHVlOiBfdGhpcy5wcm9wcy5pdGVtVG9TdHJpbmcoaXRlbSlcbiAgICAgICAgfSwgb3RoZXJTdGF0ZVRvU2V0KSwgY2IpO1xuICAgICAgfTtcbiAgICAgIF90aGlzLnNlbGVjdEl0ZW1BdEluZGV4ID0gZnVuY3Rpb24gKGl0ZW1JbmRleCwgb3RoZXJTdGF0ZVRvU2V0LCBjYikge1xuICAgICAgICB2YXIgaXRlbSA9IF90aGlzLml0ZW1zW2l0ZW1JbmRleF07XG4gICAgICAgIGlmIChpdGVtID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgX3RoaXMuc2VsZWN0SXRlbShpdGVtLCBvdGhlclN0YXRlVG9TZXQsIGNiKTtcbiAgICAgIH07XG4gICAgICBfdGhpcy5zZWxlY3RIaWdobGlnaHRlZEl0ZW0gPSBmdW5jdGlvbiAob3RoZXJTdGF0ZVRvU2V0LCBjYikge1xuICAgICAgICByZXR1cm4gX3RoaXMuc2VsZWN0SXRlbUF0SW5kZXgoX3RoaXMuZ2V0U3RhdGUoKS5oaWdobGlnaHRlZEluZGV4LCBvdGhlclN0YXRlVG9TZXQsIGNiKTtcbiAgICAgIH07XG4gICAgICAvLyBhbnkgcGllY2Ugb2Ygb3VyIHN0YXRlIGNhbiBsaXZlIGluIHR3byBwbGFjZXM6XG4gICAgICAvLyAxLiBVbmNvbnRyb2xsZWQ6IGl0J3MgaW50ZXJuYWwgKHRoaXMuc3RhdGUpXG4gICAgICAvLyAgICBXZSB3aWxsIGNhbGwgdGhpcy5zZXRTdGF0ZSB0byB1cGRhdGUgdGhhdCBzdGF0ZVxuICAgICAgLy8gMi4gQ29udHJvbGxlZDogaXQncyBleHRlcm5hbCAodGhpcy5wcm9wcylcbiAgICAgIC8vICAgIFdlIHdpbGwgY2FsbCB0aGlzLnByb3BzLm9uU3RhdGVDaGFuZ2UgdG8gdXBkYXRlIHRoYXQgc3RhdGVcbiAgICAgIC8vXG4gICAgICAvLyBJbiBhZGRpdGlvbiwgd2UnbGwgY2FsbCB0aGlzLnByb3BzLm9uQ2hhbmdlIGlmIHRoZVxuICAgICAgLy8gc2VsZWN0ZWRJdGVtIGlzIGNoYW5nZWQuXG4gICAgICBfdGhpcy5pbnRlcm5hbFNldFN0YXRlID0gZnVuY3Rpb24gKHN0YXRlVG9TZXQsIGNiKSB7XG4gICAgICAgIHZhciBpc0l0ZW1TZWxlY3RlZCwgb25DaGFuZ2VBcmc7XG4gICAgICAgIHZhciBvblN0YXRlQ2hhbmdlQXJnID0ge307XG4gICAgICAgIHZhciBpc1N0YXRlVG9TZXRGdW5jdGlvbiA9IHR5cGVvZiBzdGF0ZVRvU2V0ID09PSAnZnVuY3Rpb24nO1xuXG4gICAgICAgIC8vIHdlIHdhbnQgdG8gY2FsbCBgb25JbnB1dFZhbHVlQ2hhbmdlYCBiZWZvcmUgdGhlIGBzZXRTdGF0ZWAgY2FsbFxuICAgICAgICAvLyBzbyBzb21lb25lIGNvbnRyb2xsaW5nIHRoZSBgaW5wdXRWYWx1ZWAgc3RhdGUgZ2V0cyBub3RpZmllZCBvZlxuICAgICAgICAvLyB0aGUgaW5wdXQgY2hhbmdlIGFzIHNvb24gYXMgcG9zc2libGUuIFRoaXMgYXZvaWRzIGlzc3VlcyB3aXRoXG4gICAgICAgIC8vIHByZXNlcnZpbmcgdGhlIGN1cnNvciBwb3NpdGlvbi5cbiAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kb3duc2hpZnQtanMvZG93bnNoaWZ0L2lzc3Vlcy8yMTcgZm9yIG1vcmUgaW5mby5cbiAgICAgICAgaWYgKCFpc1N0YXRlVG9TZXRGdW5jdGlvbiAmJiBzdGF0ZVRvU2V0Lmhhc093blByb3BlcnR5KCdpbnB1dFZhbHVlJykpIHtcbiAgICAgICAgICBfdGhpcy5wcm9wcy5vbklucHV0VmFsdWVDaGFuZ2Uoc3RhdGVUb1NldC5pbnB1dFZhbHVlLCBfZXh0ZW5kcyh7fSwgX3RoaXMuZ2V0U3RhdGVBbmRIZWxwZXJzKCksIHN0YXRlVG9TZXQpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3RoaXMuc2V0U3RhdGUoZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgICAgc3RhdGUgPSBfdGhpcy5nZXRTdGF0ZShzdGF0ZSk7XG4gICAgICAgICAgdmFyIG5ld1N0YXRlVG9TZXQgPSBpc1N0YXRlVG9TZXRGdW5jdGlvbiA/IHN0YXRlVG9TZXQoc3RhdGUpIDogc3RhdGVUb1NldDtcblxuICAgICAgICAgIC8vIFlvdXIgb3duIGZ1bmN0aW9uIHRoYXQgY291bGQgbW9kaWZ5IHRoZSBzdGF0ZSB0aGF0IHdpbGwgYmUgc2V0LlxuICAgICAgICAgIG5ld1N0YXRlVG9TZXQgPSBfdGhpcy5wcm9wcy5zdGF0ZVJlZHVjZXIoc3RhdGUsIG5ld1N0YXRlVG9TZXQpO1xuXG4gICAgICAgICAgLy8gY2hlY2tzIGlmIGFuIGl0ZW0gaXMgc2VsZWN0ZWQsIHJlZ2FyZGxlc3Mgb2YgaWYgaXQncyBkaWZmZXJlbnQgZnJvbVxuICAgICAgICAgIC8vIHdoYXQgd2FzIHNlbGVjdGVkIGJlZm9yZVxuICAgICAgICAgIC8vIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIG9uU2VsZWN0IGFuZCBvbkNoYW5nZSBjYWxsYmFja3Mgc2hvdWxkIGJlIGNhbGxlZFxuICAgICAgICAgIGlzSXRlbVNlbGVjdGVkID0gbmV3U3RhdGVUb1NldC5oYXNPd25Qcm9wZXJ0eSgnc2VsZWN0ZWRJdGVtJyk7XG4gICAgICAgICAgLy8gdGhpcyBrZWVwcyB0cmFjayBvZiB0aGUgb2JqZWN0IHdlIHdhbnQgdG8gY2FsbCB3aXRoIHNldFN0YXRlXG4gICAgICAgICAgdmFyIG5leHRTdGF0ZSA9IHt9O1xuICAgICAgICAgIC8vIHdlIG5lZWQgdG8gY2FsbCBvbiBjaGFuZ2UgaWYgdGhlIG91dHNpZGUgd29ybGQgaXMgY29udHJvbGxpbmcgYW55IG9mIG91ciBzdGF0ZVxuICAgICAgICAgIC8vIGFuZCB3ZSdyZSB0cnlpbmcgdG8gdXBkYXRlIHRoYXQgc3RhdGUuIE9SIGlmIHRoZSBzZWxlY3Rpb24gaGFzIGNoYW5nZWQgYW5kIHdlJ3JlXG4gICAgICAgICAgLy8gdHJ5aW5nIHRvIHVwZGF0ZSB0aGUgc2VsZWN0aW9uXG4gICAgICAgICAgaWYgKGlzSXRlbVNlbGVjdGVkICYmIG5ld1N0YXRlVG9TZXQuc2VsZWN0ZWRJdGVtICE9PSBzdGF0ZS5zZWxlY3RlZEl0ZW0pIHtcbiAgICAgICAgICAgIG9uQ2hhbmdlQXJnID0gbmV3U3RhdGVUb1NldC5zZWxlY3RlZEl0ZW07XG4gICAgICAgICAgfVxuICAgICAgICAgIG5ld1N0YXRlVG9TZXQudHlwZSA9IG5ld1N0YXRlVG9TZXQudHlwZSB8fCB1bmtub3duO1xuICAgICAgICAgIE9iamVjdC5rZXlzKG5ld1N0YXRlVG9TZXQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgLy8gb25TdGF0ZUNoYW5nZUFyZyBzaG91bGQgb25seSBoYXZlIHRoZSBzdGF0ZSB0aGF0IGlzXG4gICAgICAgICAgICAvLyBhY3R1YWxseSBjaGFuZ2luZ1xuICAgICAgICAgICAgaWYgKHN0YXRlW2tleV0gIT09IG5ld1N0YXRlVG9TZXRba2V5XSkge1xuICAgICAgICAgICAgICBvblN0YXRlQ2hhbmdlQXJnW2tleV0gPSBuZXdTdGF0ZVRvU2V0W2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0aGUgdHlwZSBpcyB1c2VmdWwgZm9yIHRoZSBvblN0YXRlQ2hhbmdlQXJnXG4gICAgICAgICAgICAvLyBidXQgd2UgZG9uJ3QgYWN0dWFsbHkgd2FudCB0byBzZXQgaXQgaW4gaW50ZXJuYWwgc3RhdGUuXG4gICAgICAgICAgICAvLyB0aGlzIGlzIGFuIHVuZG9jdW1lbnRlZCBmZWF0dXJlIGZvciBub3cuLi4gTm90IGFsbCBpbnRlcm5hbFNldFN0YXRlXG4gICAgICAgICAgICAvLyBjYWxscyBzdXBwb3J0IGl0IGFuZCBJJ20gbm90IGNlcnRhaW4gd2Ugd2FudCB0aGVtIHRvIHlldC5cbiAgICAgICAgICAgIC8vIEJ1dCBpdCBlbmFibGVzIHVzZXJzIGNvbnRyb2xsaW5nIHRoZSBpc09wZW4gc3RhdGUgdG8ga25vdyB3aGVuXG4gICAgICAgICAgICAvLyB0aGUgaXNPcGVuIHN0YXRlIGNoYW5nZXMgZHVlIHRvIG1vdXNldXAgZXZlbnRzIHdoaWNoIGlzIHF1aXRlIGhhbmR5LlxuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ3R5cGUnKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld1N0YXRlVG9TZXRba2V5XTtcbiAgICAgICAgICAgIC8vIGlmIGl0J3MgY29taW5nIGZyb20gcHJvcHMsIHRoZW4gd2UgZG9uJ3QgY2FyZSB0byBzZXQgaXQgaW50ZXJuYWxseVxuICAgICAgICAgICAgaWYgKCFpc0NvbnRyb2xsZWRQcm9wKF90aGlzLnByb3BzLCBrZXkpKSB7XG4gICAgICAgICAgICAgIG5leHRTdGF0ZVtrZXldID0gbmV3U3RhdGVUb1NldFtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gaWYgc3RhdGVUb1NldCBpcyBhIGZ1bmN0aW9uLCB0aGVuIHdlIHdlcmVuJ3QgYWJsZSB0byBjYWxsIG9uSW5wdXRWYWx1ZUNoYW5nZVxuICAgICAgICAgIC8vIGVhcmxpZXIsIHNvIHdlJ2xsIGNhbGwgaXQgbm93IHRoYXQgd2Uga25vdyB3aGF0IHRoZSBpbnB1dFZhbHVlIHN0YXRlIHdpbGwgYmUuXG4gICAgICAgICAgaWYgKGlzU3RhdGVUb1NldEZ1bmN0aW9uICYmIG5ld1N0YXRlVG9TZXQuaGFzT3duUHJvcGVydHkoJ2lucHV0VmFsdWUnKSkge1xuICAgICAgICAgICAgX3RoaXMucHJvcHMub25JbnB1dFZhbHVlQ2hhbmdlKG5ld1N0YXRlVG9TZXQuaW5wdXRWYWx1ZSwgX2V4dGVuZHMoe30sIF90aGlzLmdldFN0YXRlQW5kSGVscGVycygpLCBuZXdTdGF0ZVRvU2V0KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBuZXh0U3RhdGU7XG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBjYWxsIHRoZSBwcm92aWRlZCBjYWxsYmFjayBpZiBpdCdzIGEgZnVuY3Rpb25cbiAgICAgICAgICBjYlRvQ2IoY2IpKCk7XG5cbiAgICAgICAgICAvLyBvbmx5IGNhbGwgdGhlIG9uU3RhdGVDaGFuZ2UgYW5kIG9uQ2hhbmdlIGNhbGxiYWNrcyBpZlxuICAgICAgICAgIC8vIHdlIGhhdmUgcmVsZXZhbnQgaW5mb3JtYXRpb24gdG8gcGFzcyB0aGVtLlxuICAgICAgICAgIHZhciBoYXNNb3JlU3RhdGVUaGFuVHlwZSA9IE9iamVjdC5rZXlzKG9uU3RhdGVDaGFuZ2VBcmcpLmxlbmd0aCA+IDE7XG4gICAgICAgICAgaWYgKGhhc01vcmVTdGF0ZVRoYW5UeXBlKSB7XG4gICAgICAgICAgICBfdGhpcy5wcm9wcy5vblN0YXRlQ2hhbmdlKG9uU3RhdGVDaGFuZ2VBcmcsIF90aGlzLmdldFN0YXRlQW5kSGVscGVycygpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlzSXRlbVNlbGVjdGVkKSB7XG4gICAgICAgICAgICBfdGhpcy5wcm9wcy5vblNlbGVjdChzdGF0ZVRvU2V0LnNlbGVjdGVkSXRlbSwgX3RoaXMuZ2V0U3RhdGVBbmRIZWxwZXJzKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAob25DaGFuZ2VBcmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgX3RoaXMucHJvcHMub25DaGFuZ2Uob25DaGFuZ2VBcmcsIF90aGlzLmdldFN0YXRlQW5kSGVscGVycygpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gdGhpcyBpcyBjdXJyZW50bHkgdW5kb2N1bWVudGVkIGFuZCB0aGVyZWZvcmUgc3ViamVjdCB0byBjaGFuZ2VcbiAgICAgICAgICAvLyBXZSdsbCB0cnkgdG8gbm90IGJyZWFrIGl0LCBidXQganVzdCBiZSB3YXJuZWQuXG4gICAgICAgICAgX3RoaXMucHJvcHMub25Vc2VyQWN0aW9uKG9uU3RhdGVDaGFuZ2VBcmcsIF90aGlzLmdldFN0YXRlQW5kSGVscGVycygpKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBST09UXG4gICAgICBfdGhpcy5yb290UmVmID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLl9yb290Tm9kZSA9IG5vZGU7XG4gICAgICB9O1xuICAgICAgX3RoaXMuZ2V0Um9vdFByb3BzID0gZnVuY3Rpb24gKF90ZW1wLCBfdGVtcDIpIHtcbiAgICAgICAgdmFyIF9leHRlbmRzMjtcbiAgICAgICAgdmFyIF9yZWYgPSBfdGVtcCA9PT0gdm9pZCAwID8ge30gOiBfdGVtcCxcbiAgICAgICAgICBfcmVmJHJlZktleSA9IF9yZWYucmVmS2V5LFxuICAgICAgICAgIHJlZktleSA9IF9yZWYkcmVmS2V5ID09PSB2b2lkIDAgPyAncmVmJyA6IF9yZWYkcmVmS2V5LFxuICAgICAgICAgIHJlZiA9IF9yZWYucmVmLFxuICAgICAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmLCBfZXhjbHVkZWQkNCk7XG4gICAgICAgIHZhciBfcmVmMiA9IF90ZW1wMiA9PT0gdm9pZCAwID8ge30gOiBfdGVtcDIsXG4gICAgICAgICAgX3JlZjIkc3VwcHJlc3NSZWZFcnJvID0gX3JlZjIuc3VwcHJlc3NSZWZFcnJvcixcbiAgICAgICAgICBzdXBwcmVzc1JlZkVycm9yID0gX3JlZjIkc3VwcHJlc3NSZWZFcnJvID09PSB2b2lkIDAgPyBmYWxzZSA6IF9yZWYyJHN1cHByZXNzUmVmRXJybztcbiAgICAgICAgLy8gdGhpcyBpcyB1c2VkIGluIHRoZSByZW5kZXIgdG8ga25vdyB3aGV0aGVyIHRoZSB1c2VyIGhhcyBjYWxsZWQgZ2V0Um9vdFByb3BzLlxuICAgICAgICAvLyBJdCB1c2VzIHRoYXQgdG8ga25vdyB3aGV0aGVyIHRvIGFwcGx5IHRoZSBwcm9wcyBhdXRvbWF0aWNhbGx5XG4gICAgICAgIF90aGlzLmdldFJvb3RQcm9wcy5jYWxsZWQgPSB0cnVlO1xuICAgICAgICBfdGhpcy5nZXRSb290UHJvcHMucmVmS2V5ID0gcmVmS2V5O1xuICAgICAgICBfdGhpcy5nZXRSb290UHJvcHMuc3VwcHJlc3NSZWZFcnJvciA9IHN1cHByZXNzUmVmRXJyb3I7XG4gICAgICAgIHZhciBfdGhpcyRnZXRTdGF0ZSA9IF90aGlzLmdldFN0YXRlKCksXG4gICAgICAgICAgaXNPcGVuID0gX3RoaXMkZ2V0U3RhdGUuaXNPcGVuO1xuICAgICAgICByZXR1cm4gX2V4dGVuZHMoKF9leHRlbmRzMiA9IHt9LCBfZXh0ZW5kczJbcmVmS2V5XSA9IGhhbmRsZVJlZnMocmVmLCBfdGhpcy5yb290UmVmKSwgX2V4dGVuZHMyLnJvbGUgPSAnY29tYm9ib3gnLCBfZXh0ZW5kczJbJ2FyaWEtZXhwYW5kZWQnXSA9IGlzT3BlbiwgX2V4dGVuZHMyWydhcmlhLWhhc3BvcHVwJ10gPSAnbGlzdGJveCcsIF9leHRlbmRzMlsnYXJpYS1vd25zJ10gPSBpc09wZW4gPyBfdGhpcy5tZW51SWQgOiBudWxsLCBfZXh0ZW5kczJbJ2FyaWEtbGFiZWxsZWRieSddID0gX3RoaXMubGFiZWxJZCwgX2V4dGVuZHMyKSwgcmVzdCk7XG4gICAgICB9O1xuICAgICAgLy9cXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIFJPT1RcbiAgICAgIF90aGlzLmtleURvd25IYW5kbGVycyA9IHtcbiAgICAgICAgQXJyb3dEb3duOiBmdW5jdGlvbiBBcnJvd0Rvd24oZXZlbnQpIHtcbiAgICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGlmICh0aGlzLmdldFN0YXRlKCkuaXNPcGVuKSB7XG4gICAgICAgICAgICB2YXIgYW1vdW50ID0gZXZlbnQuc2hpZnRLZXkgPyA1IDogMTtcbiAgICAgICAgICAgIHRoaXMubW92ZUhpZ2hsaWdodGVkSW5kZXgoYW1vdW50LCB7XG4gICAgICAgICAgICAgIHR5cGU6IGtleURvd25BcnJvd0Rvd25cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmludGVybmFsU2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpc09wZW46IHRydWUsXG4gICAgICAgICAgICAgIHR5cGU6IGtleURvd25BcnJvd0Rvd25cbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdmFyIGl0ZW1Db3VudCA9IF90aGlzMi5nZXRJdGVtQ291bnQoKTtcbiAgICAgICAgICAgICAgaWYgKGl0ZW1Db3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMyJGdldFN0YXRlID0gX3RoaXMyLmdldFN0YXRlKCksXG4gICAgICAgICAgICAgICAgICBoaWdobGlnaHRlZEluZGV4ID0gX3RoaXMyJGdldFN0YXRlLmhpZ2hsaWdodGVkSW5kZXg7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRIaWdobGlnaHRlZEluZGV4ID0gZ2V0TmV4dFdyYXBwaW5nSW5kZXgoMSwgaGlnaGxpZ2h0ZWRJbmRleCwgaXRlbUNvdW50LCBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpczIuZ2V0SXRlbU5vZGVGcm9tSW5kZXgoaW5kZXgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIF90aGlzMi5zZXRIaWdobGlnaHRlZEluZGV4KG5leHRIaWdobGlnaHRlZEluZGV4LCB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiBrZXlEb3duQXJyb3dEb3duXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgQXJyb3dVcDogZnVuY3Rpb24gQXJyb3dVcChldmVudCkge1xuICAgICAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgaWYgKHRoaXMuZ2V0U3RhdGUoKS5pc09wZW4pIHtcbiAgICAgICAgICAgIHZhciBhbW91bnQgPSBldmVudC5zaGlmdEtleSA/IC01IDogLTE7XG4gICAgICAgICAgICB0aGlzLm1vdmVIaWdobGlnaHRlZEluZGV4KGFtb3VudCwge1xuICAgICAgICAgICAgICB0eXBlOiBrZXlEb3duQXJyb3dVcFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJuYWxTZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIGlzT3BlbjogdHJ1ZSxcbiAgICAgICAgICAgICAgdHlwZToga2V5RG93bkFycm93VXBcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdmFyIGl0ZW1Db3VudCA9IF90aGlzMy5nZXRJdGVtQ291bnQoKTtcbiAgICAgICAgICAgICAgaWYgKGl0ZW1Db3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMzJGdldFN0YXRlID0gX3RoaXMzLmdldFN0YXRlKCksXG4gICAgICAgICAgICAgICAgICBoaWdobGlnaHRlZEluZGV4ID0gX3RoaXMzJGdldFN0YXRlLmhpZ2hsaWdodGVkSW5kZXg7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRIaWdobGlnaHRlZEluZGV4ID0gZ2V0TmV4dFdyYXBwaW5nSW5kZXgoLTEsIGhpZ2hsaWdodGVkSW5kZXgsIGl0ZW1Db3VudCwgZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMzLmdldEl0ZW1Ob2RlRnJvbUluZGV4KGluZGV4KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBfdGhpczMuc2V0SGlnaGxpZ2h0ZWRJbmRleChuZXh0SGlnaGxpZ2h0ZWRJbmRleCwge1xuICAgICAgICAgICAgICAgICAgdHlwZToga2V5RG93bkFycm93VXBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBFbnRlcjogZnVuY3Rpb24gRW50ZXIoZXZlbnQpIHtcbiAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IDIyOSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgX3RoaXMkZ2V0U3RhdGUyID0gdGhpcy5nZXRTdGF0ZSgpLFxuICAgICAgICAgICAgaXNPcGVuID0gX3RoaXMkZ2V0U3RhdGUyLmlzT3BlbixcbiAgICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXggPSBfdGhpcyRnZXRTdGF0ZTIuaGlnaGxpZ2h0ZWRJbmRleDtcbiAgICAgICAgICBpZiAoaXNPcGVuICYmIGhpZ2hsaWdodGVkSW5kZXggIT0gbnVsbCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5pdGVtc1toaWdobGlnaHRlZEluZGV4XTtcbiAgICAgICAgICAgIHZhciBpdGVtTm9kZSA9IHRoaXMuZ2V0SXRlbU5vZGVGcm9tSW5kZXgoaGlnaGxpZ2h0ZWRJbmRleCk7XG4gICAgICAgICAgICBpZiAoaXRlbSA9PSBudWxsIHx8IGl0ZW1Ob2RlICYmIGl0ZW1Ob2RlLmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNlbGVjdEhpZ2hsaWdodGVkSXRlbSh7XG4gICAgICAgICAgICAgIHR5cGU6IGtleURvd25FbnRlclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBFc2NhcGU6IGZ1bmN0aW9uIEVzY2FwZShldmVudCkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5yZXNldChfZXh0ZW5kcyh7XG4gICAgICAgICAgICB0eXBlOiBrZXlEb3duRXNjYXBlXG4gICAgICAgICAgfSwgIXRoaXMuc3RhdGUuaXNPcGVuICYmIHtcbiAgICAgICAgICAgIHNlbGVjdGVkSXRlbTogbnVsbCxcbiAgICAgICAgICAgIGlucHV0VmFsdWU6ICcnXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBCVVRUT05cbiAgICAgIF90aGlzLmJ1dHRvbktleURvd25IYW5kbGVycyA9IF9leHRlbmRzKHt9LCBfdGhpcy5rZXlEb3duSGFuZGxlcnMsIHtcbiAgICAgICAgJyAnOiBmdW5jdGlvbiBfKGV2ZW50KSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLnRvZ2dsZU1lbnUoe1xuICAgICAgICAgICAgdHlwZToga2V5RG93blNwYWNlQnV0dG9uXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgX3RoaXMuaW5wdXRLZXlEb3duSGFuZGxlcnMgPSBfZXh0ZW5kcyh7fSwgX3RoaXMua2V5RG93bkhhbmRsZXJzLCB7XG4gICAgICAgIEhvbWU6IGZ1bmN0aW9uIEhvbWUoZXZlbnQpIHtcbiAgICAgICAgICB2YXIgX3RoaXM0ID0gdGhpcztcbiAgICAgICAgICB2YXIgX3RoaXMkZ2V0U3RhdGUzID0gdGhpcy5nZXRTdGF0ZSgpLFxuICAgICAgICAgICAgaXNPcGVuID0gX3RoaXMkZ2V0U3RhdGUzLmlzT3BlbjtcbiAgICAgICAgICBpZiAoIWlzT3Blbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHZhciBpdGVtQ291bnQgPSB0aGlzLmdldEl0ZW1Db3VudCgpO1xuICAgICAgICAgIGlmIChpdGVtQ291bnQgPD0gMCB8fCAhaXNPcGVuKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gZ2V0IG5leHQgbm9uLWRpc2FibGVkIHN0YXJ0aW5nIGRvd253YXJkcyBmcm9tIDAgaWYgdGhhdCdzIGRpc2FibGVkLlxuICAgICAgICAgIHZhciBuZXdIaWdobGlnaHRlZEluZGV4ID0gZ2V0TmV4dE5vbkRpc2FibGVkSW5kZXgoMSwgMCwgaXRlbUNvdW50LCBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpczQuZ2V0SXRlbU5vZGVGcm9tSW5kZXgoaW5kZXgpO1xuICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICB0aGlzLnNldEhpZ2hsaWdodGVkSW5kZXgobmV3SGlnaGxpZ2h0ZWRJbmRleCwge1xuICAgICAgICAgICAgdHlwZToga2V5RG93bkhvbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgRW5kOiBmdW5jdGlvbiBFbmQoZXZlbnQpIHtcbiAgICAgICAgICB2YXIgX3RoaXM1ID0gdGhpcztcbiAgICAgICAgICB2YXIgX3RoaXMkZ2V0U3RhdGU0ID0gdGhpcy5nZXRTdGF0ZSgpLFxuICAgICAgICAgICAgaXNPcGVuID0gX3RoaXMkZ2V0U3RhdGU0LmlzT3BlbjtcbiAgICAgICAgICBpZiAoIWlzT3Blbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHZhciBpdGVtQ291bnQgPSB0aGlzLmdldEl0ZW1Db3VudCgpO1xuICAgICAgICAgIGlmIChpdGVtQ291bnQgPD0gMCB8fCAhaXNPcGVuKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gZ2V0IG5leHQgbm9uLWRpc2FibGVkIHN0YXJ0aW5nIHVwd2FyZHMgZnJvbSBsYXN0IGluZGV4IGlmIHRoYXQncyBkaXNhYmxlZC5cbiAgICAgICAgICB2YXIgbmV3SGlnaGxpZ2h0ZWRJbmRleCA9IGdldE5leHROb25EaXNhYmxlZEluZGV4KC0xLCBpdGVtQ291bnQgLSAxLCBpdGVtQ291bnQsIGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzNS5nZXRJdGVtTm9kZUZyb21JbmRleChpbmRleCk7XG4gICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgIHRoaXMuc2V0SGlnaGxpZ2h0ZWRJbmRleChuZXdIaWdobGlnaHRlZEluZGV4LCB7XG4gICAgICAgICAgICB0eXBlOiBrZXlEb3duRW5kXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgX3RoaXMuZ2V0VG9nZ2xlQnV0dG9uUHJvcHMgPSBmdW5jdGlvbiAoX3RlbXAzKSB7XG4gICAgICAgIHZhciBfcmVmMyA9IF90ZW1wMyA9PT0gdm9pZCAwID8ge30gOiBfdGVtcDMsXG4gICAgICAgICAgb25DbGljayA9IF9yZWYzLm9uQ2xpY2s7XG4gICAgICAgICAgX3JlZjMub25QcmVzcztcbiAgICAgICAgICB2YXIgb25LZXlEb3duID0gX3JlZjMub25LZXlEb3duLFxuICAgICAgICAgIG9uS2V5VXAgPSBfcmVmMy5vbktleVVwLFxuICAgICAgICAgIG9uQmx1ciA9IF9yZWYzLm9uQmx1cixcbiAgICAgICAgICByZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZjMsIF9leGNsdWRlZDIkMyk7XG4gICAgICAgIHZhciBfdGhpcyRnZXRTdGF0ZTUgPSBfdGhpcy5nZXRTdGF0ZSgpLFxuICAgICAgICAgIGlzT3BlbiA9IF90aGlzJGdldFN0YXRlNS5pc09wZW47XG4gICAgICAgIHZhciBlbmFibGVkRXZlbnRIYW5kbGVycyA9IHtcbiAgICAgICAgICBvbkNsaWNrOiBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbkNsaWNrLCBfdGhpcy5idXR0b25IYW5kbGVDbGljayksXG4gICAgICAgICAgb25LZXlEb3duOiBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbktleURvd24sIF90aGlzLmJ1dHRvbkhhbmRsZUtleURvd24pLFxuICAgICAgICAgIG9uS2V5VXA6IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uS2V5VXAsIF90aGlzLmJ1dHRvbkhhbmRsZUtleVVwKSxcbiAgICAgICAgICBvbkJsdXI6IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uQmx1ciwgX3RoaXMuYnV0dG9uSGFuZGxlQmx1cilcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGV2ZW50SGFuZGxlcnMgPSByZXN0LmRpc2FibGVkID8ge30gOiBlbmFibGVkRXZlbnRIYW5kbGVycztcbiAgICAgICAgcmV0dXJuIF9leHRlbmRzKHtcbiAgICAgICAgICB0eXBlOiAnYnV0dG9uJyxcbiAgICAgICAgICByb2xlOiAnYnV0dG9uJyxcbiAgICAgICAgICAnYXJpYS1sYWJlbCc6IGlzT3BlbiA/ICdjbG9zZSBtZW51JyA6ICdvcGVuIG1lbnUnLFxuICAgICAgICAgICdhcmlhLWhhc3BvcHVwJzogdHJ1ZSxcbiAgICAgICAgICAnZGF0YS10b2dnbGUnOiB0cnVlXG4gICAgICAgIH0sIGV2ZW50SGFuZGxlcnMsIHJlc3QpO1xuICAgICAgfTtcbiAgICAgIF90aGlzLmJ1dHRvbkhhbmRsZUtleVVwID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIC8vIFByZXZlbnQgY2xpY2sgZXZlbnQgZnJvbSBlbWl0dGluZyBpbiBGaXJlZm94XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9O1xuICAgICAgX3RoaXMuYnV0dG9uSGFuZGxlS2V5RG93biA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIga2V5ID0gbm9ybWFsaXplQXJyb3dLZXkoZXZlbnQpO1xuICAgICAgICBpZiAoX3RoaXMuYnV0dG9uS2V5RG93bkhhbmRsZXJzW2tleV0pIHtcbiAgICAgICAgICBfdGhpcy5idXR0b25LZXlEb3duSGFuZGxlcnNba2V5XS5jYWxsKF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBldmVudCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBfdGhpcy5idXR0b25IYW5kbGVDbGljayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAvLyBoYW5kbGUgb2RkIGNhc2UgZm9yIFNhZmFyaSBhbmQgRmlyZWZveCB3aGljaFxuICAgICAgICAvLyBkb24ndCBnaXZlIHRoZSBidXR0b24gdGhlIGZvY3VzIHByb3Blcmx5LlxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKGNhbid0IHJlYXNvbmFibHkgdGVzdCB0aGlzKSAqL1xuICAgICAgICBpZiAoX3RoaXMucHJvcHMuZW52aXJvbm1lbnQuZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gX3RoaXMucHJvcHMuZW52aXJvbm1lbnQuZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAgIGV2ZW50LnRhcmdldC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRvIHNpbXBsaWZ5IHRlc3RpbmcgY29tcG9uZW50cyB0aGF0IHVzZSBkb3duc2hpZnQsIHdlJ2xsIG5vdCB3cmFwIHRoaXMgaW4gYSBzZXRUaW1lb3V0XG4gICAgICAgIC8vIGlmIHRoZSBOT0RFX0VOViBpcyB0ZXN0LiBXaXRoIHRoZSBwcm9wZXIgYnVpbGQgc3lzdGVtLCB0aGlzIHNob3VsZCBiZSBkZWFkIGNvZGUgZWxpbWluYXRlZFxuICAgICAgICAvLyB3aGVuIGJ1aWxkaW5nIGZvciBwcm9kdWN0aW9uIGFuZCBzaG91bGQgdGhlcmVmb3JlIGhhdmUgbm8gaW1wYWN0IG9uIHByb2R1Y3Rpb24gY29kZS5cbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAndGVzdCcpIHtcbiAgICAgICAgICBfdGhpcy50b2dnbGVNZW51KHtcbiAgICAgICAgICAgIHR5cGU6IGNsaWNrQnV0dG9uXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRW5zdXJlIHRoYXQgdG9nZ2xlIG9mIG1lbnUgb2NjdXJzIGFmdGVyIHRoZSBwb3RlbnRpYWwgYmx1ciBldmVudCBpbiBpT1NcbiAgICAgICAgICBfdGhpcy5pbnRlcm5hbFNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnRvZ2dsZU1lbnUoe1xuICAgICAgICAgICAgICB0eXBlOiBjbGlja0J1dHRvblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBfdGhpcy5idXR0b25IYW5kbGVCbHVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBibHVyVGFyZ2V0ID0gZXZlbnQudGFyZ2V0OyAvLyBTYXZlIGJsdXIgdGFyZ2V0IGZvciBjb21wYXJpc29uIHdpdGggYWN0aXZlRWxlbWVudCBsYXRlclxuICAgICAgICAvLyBOZWVkIHNldFRpbWVvdXQsIHNvIHRoYXQgd2hlbiB0aGUgdXNlciBwcmVzc2VzIFRhYiwgdGhlIGFjdGl2ZUVsZW1lbnQgaXMgdGhlIG5leHQgZm9jdXNlZCBlbGVtZW50LCBub3QgYm9keSBlbGVtZW50XG4gICAgICAgIF90aGlzLmludGVybmFsU2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFfdGhpcy5pc01vdXNlRG93biAmJiAoX3RoaXMucHJvcHMuZW52aXJvbm1lbnQuZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PSBudWxsIHx8IF90aGlzLnByb3BzLmVudmlyb25tZW50LmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuaWQgIT09IF90aGlzLmlucHV0SWQpICYmIF90aGlzLnByb3BzLmVudmlyb25tZW50LmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGJsdXJUYXJnZXQgLy8gRG8gbm90aGluZyBpZiB3ZSByZWZvY3VzIHRoZSBzYW1lIGVsZW1lbnQgYWdhaW4gKHRvIHNvbHZlIGlzc3VlIGluIFNhZmFyaSBvbiBpT1MpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBfdGhpcy5yZXNldCh7XG4gICAgICAgICAgICAgIHR5cGU6IGJsdXJCdXR0b25cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgLy9cXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIEJVVFRPTlxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBMQUJFTFxuICAgICAgX3RoaXMuZ2V0TGFiZWxQcm9wcyA9IGZ1bmN0aW9uIChwcm9wcykge1xuICAgICAgICByZXR1cm4gX2V4dGVuZHMoe1xuICAgICAgICAgIGh0bWxGb3I6IF90aGlzLmlucHV0SWQsXG4gICAgICAgICAgaWQ6IF90aGlzLmxhYmVsSWRcbiAgICAgICAgfSwgcHJvcHMpO1xuICAgICAgfTtcbiAgICAgIC8vXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBMQUJFTFxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBJTlBVVFxuICAgICAgX3RoaXMuZ2V0SW5wdXRQcm9wcyA9IGZ1bmN0aW9uIChfdGVtcDQpIHtcbiAgICAgICAgdmFyIF9yZWY0ID0gX3RlbXA0ID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wNCxcbiAgICAgICAgICBvbktleURvd24gPSBfcmVmNC5vbktleURvd24sXG4gICAgICAgICAgb25CbHVyID0gX3JlZjQub25CbHVyLFxuICAgICAgICAgIG9uQ2hhbmdlID0gX3JlZjQub25DaGFuZ2UsXG4gICAgICAgICAgb25JbnB1dCA9IF9yZWY0Lm9uSW5wdXQ7XG4gICAgICAgICAgX3JlZjQub25DaGFuZ2VUZXh0O1xuICAgICAgICAgIHZhciByZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZjQsIF9leGNsdWRlZDMkMik7XG4gICAgICAgIHZhciBvbkNoYW5nZUtleTtcbiAgICAgICAgdmFyIGV2ZW50SGFuZGxlcnMgPSB7fTtcblxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAocHJlYWN0KSAqL1xuICAgICAgICB7XG4gICAgICAgICAgb25DaGFuZ2VLZXkgPSAnb25DaGFuZ2UnO1xuICAgICAgICB9XG4gICAgICAgIHZhciBfdGhpcyRnZXRTdGF0ZTYgPSBfdGhpcy5nZXRTdGF0ZSgpLFxuICAgICAgICAgIGlucHV0VmFsdWUgPSBfdGhpcyRnZXRTdGF0ZTYuaW5wdXRWYWx1ZSxcbiAgICAgICAgICBpc09wZW4gPSBfdGhpcyRnZXRTdGF0ZTYuaXNPcGVuLFxuICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXggPSBfdGhpcyRnZXRTdGF0ZTYuaGlnaGxpZ2h0ZWRJbmRleDtcbiAgICAgICAgaWYgKCFyZXN0LmRpc2FibGVkKSB7XG4gICAgICAgICAgdmFyIF9ldmVudEhhbmRsZXJzO1xuICAgICAgICAgIGV2ZW50SGFuZGxlcnMgPSAoX2V2ZW50SGFuZGxlcnMgPSB7fSwgX2V2ZW50SGFuZGxlcnNbb25DaGFuZ2VLZXldID0gY2FsbEFsbEV2ZW50SGFuZGxlcnMob25DaGFuZ2UsIG9uSW5wdXQsIF90aGlzLmlucHV0SGFuZGxlQ2hhbmdlKSwgX2V2ZW50SGFuZGxlcnMub25LZXlEb3duID0gY2FsbEFsbEV2ZW50SGFuZGxlcnMob25LZXlEb3duLCBfdGhpcy5pbnB1dEhhbmRsZUtleURvd24pLCBfZXZlbnRIYW5kbGVycy5vbkJsdXIgPSBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbkJsdXIsIF90aGlzLmlucHV0SGFuZGxlQmx1ciksIF9ldmVudEhhbmRsZXJzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX2V4dGVuZHMoe1xuICAgICAgICAgICdhcmlhLWF1dG9jb21wbGV0ZSc6ICdsaXN0JyxcbiAgICAgICAgICAnYXJpYS1hY3RpdmVkZXNjZW5kYW50JzogaXNPcGVuICYmIHR5cGVvZiBoaWdobGlnaHRlZEluZGV4ID09PSAnbnVtYmVyJyAmJiBoaWdobGlnaHRlZEluZGV4ID49IDAgPyBfdGhpcy5nZXRJdGVtSWQoaGlnaGxpZ2h0ZWRJbmRleCkgOiBudWxsLFxuICAgICAgICAgICdhcmlhLWNvbnRyb2xzJzogaXNPcGVuID8gX3RoaXMubWVudUlkIDogbnVsbCxcbiAgICAgICAgICAnYXJpYS1sYWJlbGxlZGJ5JzogcmVzdCAmJiByZXN0WydhcmlhLWxhYmVsJ10gPyB1bmRlZmluZWQgOiBfdGhpcy5sYWJlbElkLFxuICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL1NlY3VyaXR5L1NlY3VyaW5nX3lvdXJfc2l0ZS9UdXJuaW5nX29mZl9mb3JtX2F1dG9jb21wbGV0aW9uXG4gICAgICAgICAgLy8gcmV2ZXJ0IGJhY2sgc2luY2UgYXV0b2NvbXBsZXRlPVwibm9wZVwiIGlzIGlnbm9yZWQgb24gbGF0ZXN0IENocm9tZSBhbmQgT3BlcmFcbiAgICAgICAgICBhdXRvQ29tcGxldGU6ICdvZmYnLFxuICAgICAgICAgIHZhbHVlOiBpbnB1dFZhbHVlLFxuICAgICAgICAgIGlkOiBfdGhpcy5pbnB1dElkXG4gICAgICAgIH0sIGV2ZW50SGFuZGxlcnMsIHJlc3QpO1xuICAgICAgfTtcbiAgICAgIF90aGlzLmlucHV0SGFuZGxlS2V5RG93biA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIga2V5ID0gbm9ybWFsaXplQXJyb3dLZXkoZXZlbnQpO1xuICAgICAgICBpZiAoa2V5ICYmIF90aGlzLmlucHV0S2V5RG93bkhhbmRsZXJzW2tleV0pIHtcbiAgICAgICAgICBfdGhpcy5pbnB1dEtleURvd25IYW5kbGVyc1trZXldLmNhbGwoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIF90aGlzLmlucHV0SGFuZGxlQ2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIF90aGlzLmludGVybmFsU2V0U3RhdGUoe1xuICAgICAgICAgIHR5cGU6IGNoYW5nZUlucHV0LFxuICAgICAgICAgIGlzT3BlbjogdHJ1ZSxcbiAgICAgICAgICBpbnB1dFZhbHVlOiBldmVudC50YXJnZXQudmFsdWUsXG4gICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogX3RoaXMucHJvcHMuZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXhcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgX3RoaXMuaW5wdXRIYW5kbGVCbHVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBOZWVkIHNldFRpbWVvdXQsIHNvIHRoYXQgd2hlbiB0aGUgdXNlciBwcmVzc2VzIFRhYiwgdGhlIGFjdGl2ZUVsZW1lbnQgaXMgdGhlIG5leHQgZm9jdXNlZCBlbGVtZW50LCBub3QgdGhlIGJvZHkgZWxlbWVudFxuICAgICAgICBfdGhpcy5pbnRlcm5hbFNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBkb3duc2hpZnRCdXR0b25Jc0FjdGl2ZSA9IF90aGlzLnByb3BzLmVudmlyb25tZW50LmRvY3VtZW50ICYmICEhX3RoaXMucHJvcHMuZW52aXJvbm1lbnQuZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiAhIV90aGlzLnByb3BzLmVudmlyb25tZW50LmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuZGF0YXNldCAmJiBfdGhpcy5wcm9wcy5lbnZpcm9ubWVudC5kb2N1bWVudC5hY3RpdmVFbGVtZW50LmRhdGFzZXQudG9nZ2xlICYmIF90aGlzLl9yb290Tm9kZSAmJiBfdGhpcy5fcm9vdE5vZGUuY29udGFpbnMoX3RoaXMucHJvcHMuZW52aXJvbm1lbnQuZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG4gICAgICAgICAgaWYgKCFfdGhpcy5pc01vdXNlRG93biAmJiAhZG93bnNoaWZ0QnV0dG9uSXNBY3RpdmUpIHtcbiAgICAgICAgICAgIF90aGlzLnJlc2V0KHtcbiAgICAgICAgICAgICAgdHlwZTogYmx1cklucHV0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIC8vXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBJTlBVVFxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBNRU5VXG4gICAgICBfdGhpcy5tZW51UmVmID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgX3RoaXMuX21lbnVOb2RlID0gbm9kZTtcbiAgICAgIH07XG4gICAgICBfdGhpcy5nZXRNZW51UHJvcHMgPSBmdW5jdGlvbiAoX3RlbXA1LCBfdGVtcDYpIHtcbiAgICAgICAgdmFyIF9leHRlbmRzMztcbiAgICAgICAgdmFyIF9yZWY1ID0gX3RlbXA1ID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wNSxcbiAgICAgICAgICBfcmVmNSRyZWZLZXkgPSBfcmVmNS5yZWZLZXksXG4gICAgICAgICAgcmVmS2V5ID0gX3JlZjUkcmVmS2V5ID09PSB2b2lkIDAgPyAncmVmJyA6IF9yZWY1JHJlZktleSxcbiAgICAgICAgICByZWYgPSBfcmVmNS5yZWYsXG4gICAgICAgICAgcHJvcHMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmNSwgX2V4Y2x1ZGVkNCQxKTtcbiAgICAgICAgdmFyIF9yZWY2ID0gX3RlbXA2ID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wNixcbiAgICAgICAgICBfcmVmNiRzdXBwcmVzc1JlZkVycm8gPSBfcmVmNi5zdXBwcmVzc1JlZkVycm9yLFxuICAgICAgICAgIHN1cHByZXNzUmVmRXJyb3IgPSBfcmVmNiRzdXBwcmVzc1JlZkVycm8gPT09IHZvaWQgMCA/IGZhbHNlIDogX3JlZjYkc3VwcHJlc3NSZWZFcnJvO1xuICAgICAgICBfdGhpcy5nZXRNZW51UHJvcHMuY2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgX3RoaXMuZ2V0TWVudVByb3BzLnJlZktleSA9IHJlZktleTtcbiAgICAgICAgX3RoaXMuZ2V0TWVudVByb3BzLnN1cHByZXNzUmVmRXJyb3IgPSBzdXBwcmVzc1JlZkVycm9yO1xuICAgICAgICByZXR1cm4gX2V4dGVuZHMoKF9leHRlbmRzMyA9IHt9LCBfZXh0ZW5kczNbcmVmS2V5XSA9IGhhbmRsZVJlZnMocmVmLCBfdGhpcy5tZW51UmVmKSwgX2V4dGVuZHMzLnJvbGUgPSAnbGlzdGJveCcsIF9leHRlbmRzM1snYXJpYS1sYWJlbGxlZGJ5J10gPSBwcm9wcyAmJiBwcm9wc1snYXJpYS1sYWJlbCddID8gbnVsbCA6IF90aGlzLmxhYmVsSWQsIF9leHRlbmRzMy5pZCA9IF90aGlzLm1lbnVJZCwgX2V4dGVuZHMzKSwgcHJvcHMpO1xuICAgICAgfTtcbiAgICAgIC8vXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBNRU5VXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIElURU1cbiAgICAgIF90aGlzLmdldEl0ZW1Qcm9wcyA9IGZ1bmN0aW9uIChfdGVtcDcpIHtcbiAgICAgICAgdmFyIF9lbmFibGVkRXZlbnRIYW5kbGVycztcbiAgICAgICAgdmFyIF9yZWY3ID0gX3RlbXA3ID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wNyxcbiAgICAgICAgICBvbk1vdXNlTW92ZSA9IF9yZWY3Lm9uTW91c2VNb3ZlLFxuICAgICAgICAgIG9uTW91c2VEb3duID0gX3JlZjcub25Nb3VzZURvd24sXG4gICAgICAgICAgb25DbGljayA9IF9yZWY3Lm9uQ2xpY2s7XG4gICAgICAgICAgX3JlZjcub25QcmVzcztcbiAgICAgICAgICB2YXIgaW5kZXggPSBfcmVmNy5pbmRleCxcbiAgICAgICAgICBfcmVmNyRpdGVtID0gX3JlZjcuaXRlbSxcbiAgICAgICAgICBpdGVtID0gX3JlZjckaXRlbSA9PT0gdm9pZCAwID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyA/IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovdW5kZWZpbmVkIDogcmVxdWlyZWRQcm9wKCdnZXRJdGVtUHJvcHMnLCAnaXRlbScpIDogX3JlZjckaXRlbSxcbiAgICAgICAgICByZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZjcsIF9leGNsdWRlZDUpO1xuICAgICAgICBpZiAoaW5kZXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIF90aGlzLml0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgICAgaW5kZXggPSBfdGhpcy5pdGVtcy5pbmRleE9mKGl0ZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzLml0ZW1zW2luZGV4XSA9IGl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9uU2VsZWN0S2V5ID0gJ29uQ2xpY2snO1xuICAgICAgICB2YXIgY3VzdG9tQ2xpY2tIYW5kbGVyID0gb25DbGljaztcbiAgICAgICAgdmFyIGVuYWJsZWRFdmVudEhhbmRsZXJzID0gKF9lbmFibGVkRXZlbnRIYW5kbGVycyA9IHtcbiAgICAgICAgICAvLyBvbk1vdXNlTW92ZSBpcyB1c2VkIG92ZXIgb25Nb3VzZUVudGVyIGhlcmUuIG9uTW91c2VNb3ZlXG4gICAgICAgICAgLy8gaXMgb25seSB0cmlnZ2VyZWQgb24gYWN0dWFsIG1vdXNlIG1vdmVtZW50IHdoaWxlIG9uTW91c2VFbnRlclxuICAgICAgICAgIC8vIGNhbiBmaXJlIG9uIERPTSBjaGFuZ2VzLCBpbnRlcnJ1cHRpbmcga2V5Ym9hcmQgbmF2aWdhdGlvblxuICAgICAgICAgIG9uTW91c2VNb3ZlOiBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbk1vdXNlTW92ZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGluZGV4ID09PSBfdGhpcy5nZXRTdGF0ZSgpLmhpZ2hsaWdodGVkSW5kZXgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMuc2V0SGlnaGxpZ2h0ZWRJbmRleChpbmRleCwge1xuICAgICAgICAgICAgICB0eXBlOiBpdGVtTW91c2VFbnRlclxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFdlIG5ldmVyIHdhbnQgdG8gbWFudWFsbHkgc2Nyb2xsIHdoZW4gY2hhbmdpbmcgc3RhdGUgYmFzZWRcbiAgICAgICAgICAgIC8vIG9uIGBvbk1vdXNlTW92ZWAgYmVjYXVzZSB3ZSB3aWxsIGJlIG1vdmluZyB0aGUgZWxlbWVudCBvdXRcbiAgICAgICAgICAgIC8vIGZyb20gdW5kZXIgdGhlIHVzZXIgd2hpY2ggaXMgY3VycmVudGx5IHNjcm9sbGluZy9tb3ZpbmcgdGhlXG4gICAgICAgICAgICAvLyBjdXJzb3JcbiAgICAgICAgICAgIF90aGlzLmF2b2lkU2Nyb2xsaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIF90aGlzLmludGVybmFsU2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBfdGhpcy5hdm9pZFNjcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBvbk1vdXNlRG93bjogY2FsbEFsbEV2ZW50SGFuZGxlcnMob25Nb3VzZURvd24sIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgLy8gVGhpcyBwcmV2ZW50cyB0aGUgYWN0aXZlRWxlbWVudCBmcm9tIGJlaW5nIGNoYW5nZWRcbiAgICAgICAgICAgIC8vIHRvIHRoZSBpdGVtIHNvIGl0IGNhbiByZW1haW4gd2l0aCB0aGUgY3VycmVudCBhY3RpdmVFbGVtZW50XG4gICAgICAgICAgICAvLyB3aGljaCBpcyBhIG1vcmUgY29tbW9uIHVzZSBjYXNlLlxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9LCBfZW5hYmxlZEV2ZW50SGFuZGxlcnNbb25TZWxlY3RLZXldID0gY2FsbEFsbEV2ZW50SGFuZGxlcnMoY3VzdG9tQ2xpY2tIYW5kbGVyLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgX3RoaXMuc2VsZWN0SXRlbUF0SW5kZXgoaW5kZXgsIHtcbiAgICAgICAgICAgIHR5cGU6IGNsaWNrSXRlbVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KSwgX2VuYWJsZWRFdmVudEhhbmRsZXJzKTtcblxuICAgICAgICAvLyBQYXNzaW5nIGRvd24gdGhlIG9uTW91c2VEb3duIGhhbmRsZXIgdG8gcHJldmVudCByZWRpcmVjdFxuICAgICAgICAvLyBvZiB0aGUgYWN0aXZlRWxlbWVudCBpZiBjbGlja2luZyBvbiBkaXNhYmxlZCBpdGVtc1xuICAgICAgICB2YXIgZXZlbnRIYW5kbGVycyA9IHJlc3QuZGlzYWJsZWQgPyB7XG4gICAgICAgICAgb25Nb3VzZURvd246IGVuYWJsZWRFdmVudEhhbmRsZXJzLm9uTW91c2VEb3duXG4gICAgICAgIH0gOiBlbmFibGVkRXZlbnRIYW5kbGVycztcbiAgICAgICAgcmV0dXJuIF9leHRlbmRzKHtcbiAgICAgICAgICBpZDogX3RoaXMuZ2V0SXRlbUlkKGluZGV4KSxcbiAgICAgICAgICByb2xlOiAnb3B0aW9uJyxcbiAgICAgICAgICAnYXJpYS1zZWxlY3RlZCc6IF90aGlzLmdldFN0YXRlKCkuaGlnaGxpZ2h0ZWRJbmRleCA9PT0gaW5kZXhcbiAgICAgICAgfSwgZXZlbnRIYW5kbGVycywgcmVzdCk7XG4gICAgICB9O1xuICAgICAgLy9cXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIElURU1cbiAgICAgIF90aGlzLmNsZWFySXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzLml0ZW1zID0gW107XG4gICAgICB9O1xuICAgICAgX3RoaXMucmVzZXQgPSBmdW5jdGlvbiAob3RoZXJTdGF0ZVRvU2V0LCBjYikge1xuICAgICAgICBpZiAob3RoZXJTdGF0ZVRvU2V0ID09PSB2b2lkIDApIHtcbiAgICAgICAgICBvdGhlclN0YXRlVG9TZXQgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBvdGhlclN0YXRlVG9TZXQgPSBwaWNrU3RhdGUob3RoZXJTdGF0ZVRvU2V0KTtcbiAgICAgICAgX3RoaXMuaW50ZXJuYWxTZXRTdGF0ZShmdW5jdGlvbiAoX3JlZjgpIHtcbiAgICAgICAgICB2YXIgc2VsZWN0ZWRJdGVtID0gX3JlZjguc2VsZWN0ZWRJdGVtO1xuICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7XG4gICAgICAgICAgICBpc09wZW46IF90aGlzLnByb3BzLmRlZmF1bHRJc09wZW4sXG4gICAgICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBfdGhpcy5wcm9wcy5kZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgICAgICAgIGlucHV0VmFsdWU6IF90aGlzLnByb3BzLml0ZW1Ub1N0cmluZyhzZWxlY3RlZEl0ZW0pXG4gICAgICAgICAgfSwgb3RoZXJTdGF0ZVRvU2V0KTtcbiAgICAgICAgfSwgY2IpO1xuICAgICAgfTtcbiAgICAgIF90aGlzLnRvZ2dsZU1lbnUgPSBmdW5jdGlvbiAob3RoZXJTdGF0ZVRvU2V0LCBjYikge1xuICAgICAgICBpZiAob3RoZXJTdGF0ZVRvU2V0ID09PSB2b2lkIDApIHtcbiAgICAgICAgICBvdGhlclN0YXRlVG9TZXQgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBvdGhlclN0YXRlVG9TZXQgPSBwaWNrU3RhdGUob3RoZXJTdGF0ZVRvU2V0KTtcbiAgICAgICAgX3RoaXMuaW50ZXJuYWxTZXRTdGF0ZShmdW5jdGlvbiAoX3JlZjkpIHtcbiAgICAgICAgICB2YXIgaXNPcGVuID0gX3JlZjkuaXNPcGVuO1xuICAgICAgICAgIHJldHVybiBfZXh0ZW5kcyh7XG4gICAgICAgICAgICBpc09wZW46ICFpc09wZW5cbiAgICAgICAgICB9LCBpc09wZW4gJiYge1xuICAgICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogX3RoaXMucHJvcHMuZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXhcbiAgICAgICAgICB9LCBvdGhlclN0YXRlVG9TZXQpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIF90aGlzJGdldFN0YXRlNyA9IF90aGlzLmdldFN0YXRlKCksXG4gICAgICAgICAgICBpc09wZW4gPSBfdGhpcyRnZXRTdGF0ZTcuaXNPcGVuLFxuICAgICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleCA9IF90aGlzJGdldFN0YXRlNy5oaWdobGlnaHRlZEluZGV4O1xuICAgICAgICAgIGlmIChpc09wZW4pIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5nZXRJdGVtQ291bnQoKSA+IDAgJiYgdHlwZW9mIGhpZ2hsaWdodGVkSW5kZXggPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgIF90aGlzLnNldEhpZ2hsaWdodGVkSW5kZXgoaGlnaGxpZ2h0ZWRJbmRleCwgb3RoZXJTdGF0ZVRvU2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY2JUb0NiKGNiKSgpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBfdGhpcy5vcGVuTWVudSA9IGZ1bmN0aW9uIChjYikge1xuICAgICAgICBfdGhpcy5pbnRlcm5hbFNldFN0YXRlKHtcbiAgICAgICAgICBpc09wZW46IHRydWVcbiAgICAgICAgfSwgY2IpO1xuICAgICAgfTtcbiAgICAgIF90aGlzLmNsb3NlTWVudSA9IGZ1bmN0aW9uIChjYikge1xuICAgICAgICBfdGhpcy5pbnRlcm5hbFNldFN0YXRlKHtcbiAgICAgICAgICBpc09wZW46IGZhbHNlXG4gICAgICAgIH0sIGNiKTtcbiAgICAgIH07XG4gICAgICBfdGhpcy51cGRhdGVTdGF0dXMgPSBkZWJvdW5jZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IF90aGlzLmdldFN0YXRlKCk7XG4gICAgICAgIHZhciBpdGVtID0gX3RoaXMuaXRlbXNbc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleF07XG4gICAgICAgIHZhciByZXN1bHRDb3VudCA9IF90aGlzLmdldEl0ZW1Db3VudCgpO1xuICAgICAgICB2YXIgc3RhdHVzID0gX3RoaXMucHJvcHMuZ2V0QTExeVN0YXR1c01lc3NhZ2UoX2V4dGVuZHMoe1xuICAgICAgICAgIGl0ZW1Ub1N0cmluZzogX3RoaXMucHJvcHMuaXRlbVRvU3RyaW5nLFxuICAgICAgICAgIHByZXZpb3VzUmVzdWx0Q291bnQ6IF90aGlzLnByZXZpb3VzUmVzdWx0Q291bnQsXG4gICAgICAgICAgcmVzdWx0Q291bnQ6IHJlc3VsdENvdW50LFxuICAgICAgICAgIGhpZ2hsaWdodGVkSXRlbTogaXRlbVxuICAgICAgICB9LCBzdGF0ZSkpO1xuICAgICAgICBfdGhpcy5wcmV2aW91c1Jlc3VsdENvdW50ID0gcmVzdWx0Q291bnQ7XG4gICAgICAgIHNldFN0YXR1cyhzdGF0dXMsIF90aGlzLnByb3BzLmVudmlyb25tZW50LmRvY3VtZW50KTtcbiAgICAgIH0sIDIwMCk7XG4gICAgICB2YXIgX3RoaXMkcHJvcHMgPSBfdGhpcy5wcm9wcyxcbiAgICAgICAgZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXggPSBfdGhpcyRwcm9wcy5kZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgICAgX3RoaXMkcHJvcHMkaW5pdGlhbEhpID0gX3RoaXMkcHJvcHMuaW5pdGlhbEhpZ2hsaWdodGVkSW5kZXgsXG4gICAgICAgIF9oaWdobGlnaHRlZEluZGV4ID0gX3RoaXMkcHJvcHMkaW5pdGlhbEhpID09PSB2b2lkIDAgPyBkZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleCA6IF90aGlzJHByb3BzJGluaXRpYWxIaSxcbiAgICAgICAgZGVmYXVsdElzT3BlbiA9IF90aGlzJHByb3BzLmRlZmF1bHRJc09wZW4sXG4gICAgICAgIF90aGlzJHByb3BzJGluaXRpYWxJcyA9IF90aGlzJHByb3BzLmluaXRpYWxJc09wZW4sXG4gICAgICAgIF9pc09wZW4gPSBfdGhpcyRwcm9wcyRpbml0aWFsSXMgPT09IHZvaWQgMCA/IGRlZmF1bHRJc09wZW4gOiBfdGhpcyRwcm9wcyRpbml0aWFsSXMsXG4gICAgICAgIF90aGlzJHByb3BzJGluaXRpYWxJbiA9IF90aGlzJHByb3BzLmluaXRpYWxJbnB1dFZhbHVlLFxuICAgICAgICBfaW5wdXRWYWx1ZSA9IF90aGlzJHByb3BzJGluaXRpYWxJbiA9PT0gdm9pZCAwID8gJycgOiBfdGhpcyRwcm9wcyRpbml0aWFsSW4sXG4gICAgICAgIF90aGlzJHByb3BzJGluaXRpYWxTZSA9IF90aGlzJHByb3BzLmluaXRpYWxTZWxlY3RlZEl0ZW0sXG4gICAgICAgIF9zZWxlY3RlZEl0ZW0gPSBfdGhpcyRwcm9wcyRpbml0aWFsU2UgPT09IHZvaWQgMCA/IG51bGwgOiBfdGhpcyRwcm9wcyRpbml0aWFsU2U7XG4gICAgICB2YXIgX3N0YXRlID0gX3RoaXMuZ2V0U3RhdGUoe1xuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBfaGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgICAgaXNPcGVuOiBfaXNPcGVuLFxuICAgICAgICBpbnB1dFZhbHVlOiBfaW5wdXRWYWx1ZSxcbiAgICAgICAgc2VsZWN0ZWRJdGVtOiBfc2VsZWN0ZWRJdGVtXG4gICAgICB9KTtcbiAgICAgIGlmIChfc3RhdGUuc2VsZWN0ZWRJdGVtICE9IG51bGwgJiYgX3RoaXMucHJvcHMuaW5pdGlhbElucHV0VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBfc3RhdGUuaW5wdXRWYWx1ZSA9IF90aGlzLnByb3BzLml0ZW1Ub1N0cmluZyhfc3RhdGUuc2VsZWN0ZWRJdGVtKTtcbiAgICAgIH1cbiAgICAgIF90aGlzLnN0YXRlID0gX3N0YXRlO1xuICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICB2YXIgX3Byb3RvID0gRG93bnNoaWZ0LnByb3RvdHlwZTtcbiAgICAvKipcbiAgICAgKiBDbGVhciBhbGwgcnVubmluZyB0aW1lb3V0c1xuICAgICAqL1xuICAgIF9wcm90by5pbnRlcm5hbENsZWFyVGltZW91dHMgPSBmdW5jdGlvbiBpbnRlcm5hbENsZWFyVGltZW91dHMoKSB7XG4gICAgICB0aGlzLnRpbWVvdXRJZHMuZm9yRWFjaChmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy50aW1lb3V0SWRzID0gW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgc3RhdGUgYmFzZWQgb24gaW50ZXJuYWwgc3RhdGUgb3IgcHJvcHNcbiAgICAgKiBJZiBhIHN0YXRlIHZhbHVlIGlzIHBhc3NlZCB2aWEgcHJvcHMsIHRoZW4gdGhhdFxuICAgICAqIGlzIHRoZSB2YWx1ZSBnaXZlbiwgb3RoZXJ3aXNlIGl0J3MgcmV0cmlldmVkIGZyb21cbiAgICAgKiBzdGF0ZVRvTWVyZ2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVRvTWVyZ2UgZGVmYXVsdHMgdG8gdGhpcy5zdGF0ZVxuICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhlIHN0YXRlXG4gICAgICovO1xuICAgIF9wcm90by5nZXRTdGF0ZSA9IGZ1bmN0aW9uIGdldFN0YXRlJDEoc3RhdGVUb01lcmdlKSB7XG4gICAgICBpZiAoc3RhdGVUb01lcmdlID09PSB2b2lkIDApIHtcbiAgICAgICAgc3RhdGVUb01lcmdlID0gdGhpcy5zdGF0ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBnZXRTdGF0ZShzdGF0ZVRvTWVyZ2UsIHRoaXMucHJvcHMpO1xuICAgIH07XG4gICAgX3Byb3RvLmdldEl0ZW1Db3VudCA9IGZ1bmN0aW9uIGdldEl0ZW1Db3VudCgpIHtcbiAgICAgIC8vIHRoaW5ncyByZWFkIGJldHRlciB0aGlzIHdheS4gVGhleSdyZSBpbiBwcmlvcml0eSBvcmRlcjpcbiAgICAgIC8vIDEuIGB0aGlzLml0ZW1Db3VudGBcbiAgICAgIC8vIDIuIGB0aGlzLnByb3BzLml0ZW1Db3VudGBcbiAgICAgIC8vIDMuIGB0aGlzLml0ZW1zLmxlbmd0aGBcbiAgICAgIHZhciBpdGVtQ291bnQgPSB0aGlzLml0ZW1zLmxlbmd0aDtcbiAgICAgIGlmICh0aGlzLml0ZW1Db3VudCAhPSBudWxsKSB7XG4gICAgICAgIGl0ZW1Db3VudCA9IHRoaXMuaXRlbUNvdW50O1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLml0ZW1Db3VudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGl0ZW1Db3VudCA9IHRoaXMucHJvcHMuaXRlbUNvdW50O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZW1Db3VudDtcbiAgICB9O1xuICAgIF9wcm90by5nZXRJdGVtTm9kZUZyb21JbmRleCA9IGZ1bmN0aW9uIGdldEl0ZW1Ob2RlRnJvbUluZGV4KGluZGV4KSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5lbnZpcm9ubWVudC5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmdldEl0ZW1JZChpbmRleCkpO1xuICAgIH07XG4gICAgX3Byb3RvLnNjcm9sbEhpZ2hsaWdodGVkSXRlbUludG9WaWV3ID0gZnVuY3Rpb24gc2Nyb2xsSGlnaGxpZ2h0ZWRJdGVtSW50b1ZpZXcoKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAocmVhY3QtbmF0aXZlKSAqL1xuICAgICAge1xuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuZ2V0SXRlbU5vZGVGcm9tSW5kZXgodGhpcy5nZXRTdGF0ZSgpLmhpZ2hsaWdodGVkSW5kZXgpO1xuICAgICAgICB0aGlzLnByb3BzLnNjcm9sbEludG9WaWV3KG5vZGUsIHRoaXMuX21lbnVOb2RlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIF9wcm90by5tb3ZlSGlnaGxpZ2h0ZWRJbmRleCA9IGZ1bmN0aW9uIG1vdmVIaWdobGlnaHRlZEluZGV4KGFtb3VudCwgb3RoZXJTdGF0ZVRvU2V0KSB7XG4gICAgICB2YXIgX3RoaXM2ID0gdGhpcztcbiAgICAgIHZhciBpdGVtQ291bnQgPSB0aGlzLmdldEl0ZW1Db3VudCgpO1xuICAgICAgdmFyIF90aGlzJGdldFN0YXRlOCA9IHRoaXMuZ2V0U3RhdGUoKSxcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleCA9IF90aGlzJGdldFN0YXRlOC5oaWdobGlnaHRlZEluZGV4O1xuICAgICAgaWYgKGl0ZW1Db3VudCA+IDApIHtcbiAgICAgICAgdmFyIG5leHRIaWdobGlnaHRlZEluZGV4ID0gZ2V0TmV4dFdyYXBwaW5nSW5kZXgoYW1vdW50LCBoaWdobGlnaHRlZEluZGV4LCBpdGVtQ291bnQsIGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgIHJldHVybiBfdGhpczYuZ2V0SXRlbU5vZGVGcm9tSW5kZXgoaW5kZXgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zZXRIaWdobGlnaHRlZEluZGV4KG5leHRIaWdobGlnaHRlZEluZGV4LCBvdGhlclN0YXRlVG9TZXQpO1xuICAgICAgfVxuICAgIH07XG4gICAgX3Byb3RvLmdldFN0YXRlQW5kSGVscGVycyA9IGZ1bmN0aW9uIGdldFN0YXRlQW5kSGVscGVycygpIHtcbiAgICAgIHZhciBfdGhpcyRnZXRTdGF0ZTkgPSB0aGlzLmdldFN0YXRlKCksXG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXggPSBfdGhpcyRnZXRTdGF0ZTkuaGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgICAgaW5wdXRWYWx1ZSA9IF90aGlzJGdldFN0YXRlOS5pbnB1dFZhbHVlLFxuICAgICAgICBzZWxlY3RlZEl0ZW0gPSBfdGhpcyRnZXRTdGF0ZTkuc2VsZWN0ZWRJdGVtLFxuICAgICAgICBpc09wZW4gPSBfdGhpcyRnZXRTdGF0ZTkuaXNPcGVuO1xuICAgICAgdmFyIGl0ZW1Ub1N0cmluZyA9IHRoaXMucHJvcHMuaXRlbVRvU3RyaW5nO1xuICAgICAgdmFyIGlkID0gdGhpcy5pZDtcbiAgICAgIHZhciBnZXRSb290UHJvcHMgPSB0aGlzLmdldFJvb3RQcm9wcyxcbiAgICAgICAgZ2V0VG9nZ2xlQnV0dG9uUHJvcHMgPSB0aGlzLmdldFRvZ2dsZUJ1dHRvblByb3BzLFxuICAgICAgICBnZXRMYWJlbFByb3BzID0gdGhpcy5nZXRMYWJlbFByb3BzLFxuICAgICAgICBnZXRNZW51UHJvcHMgPSB0aGlzLmdldE1lbnVQcm9wcyxcbiAgICAgICAgZ2V0SW5wdXRQcm9wcyA9IHRoaXMuZ2V0SW5wdXRQcm9wcyxcbiAgICAgICAgZ2V0SXRlbVByb3BzID0gdGhpcy5nZXRJdGVtUHJvcHMsXG4gICAgICAgIG9wZW5NZW51ID0gdGhpcy5vcGVuTWVudSxcbiAgICAgICAgY2xvc2VNZW51ID0gdGhpcy5jbG9zZU1lbnUsXG4gICAgICAgIHRvZ2dsZU1lbnUgPSB0aGlzLnRvZ2dsZU1lbnUsXG4gICAgICAgIHNlbGVjdEl0ZW0gPSB0aGlzLnNlbGVjdEl0ZW0sXG4gICAgICAgIHNlbGVjdEl0ZW1BdEluZGV4ID0gdGhpcy5zZWxlY3RJdGVtQXRJbmRleCxcbiAgICAgICAgc2VsZWN0SGlnaGxpZ2h0ZWRJdGVtID0gdGhpcy5zZWxlY3RIaWdobGlnaHRlZEl0ZW0sXG4gICAgICAgIHNldEhpZ2hsaWdodGVkSW5kZXggPSB0aGlzLnNldEhpZ2hsaWdodGVkSW5kZXgsXG4gICAgICAgIGNsZWFyU2VsZWN0aW9uID0gdGhpcy5jbGVhclNlbGVjdGlvbixcbiAgICAgICAgY2xlYXJJdGVtcyA9IHRoaXMuY2xlYXJJdGVtcyxcbiAgICAgICAgcmVzZXQgPSB0aGlzLnJlc2V0LFxuICAgICAgICBzZXRJdGVtQ291bnQgPSB0aGlzLnNldEl0ZW1Db3VudCxcbiAgICAgICAgdW5zZXRJdGVtQ291bnQgPSB0aGlzLnVuc2V0SXRlbUNvdW50LFxuICAgICAgICBzZXRTdGF0ZSA9IHRoaXMuaW50ZXJuYWxTZXRTdGF0ZTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8vIHByb3AgZ2V0dGVyc1xuICAgICAgICBnZXRSb290UHJvcHM6IGdldFJvb3RQcm9wcyxcbiAgICAgICAgZ2V0VG9nZ2xlQnV0dG9uUHJvcHM6IGdldFRvZ2dsZUJ1dHRvblByb3BzLFxuICAgICAgICBnZXRMYWJlbFByb3BzOiBnZXRMYWJlbFByb3BzLFxuICAgICAgICBnZXRNZW51UHJvcHM6IGdldE1lbnVQcm9wcyxcbiAgICAgICAgZ2V0SW5wdXRQcm9wczogZ2V0SW5wdXRQcm9wcyxcbiAgICAgICAgZ2V0SXRlbVByb3BzOiBnZXRJdGVtUHJvcHMsXG4gICAgICAgIC8vIGFjdGlvbnNcbiAgICAgICAgcmVzZXQ6IHJlc2V0LFxuICAgICAgICBvcGVuTWVudTogb3Blbk1lbnUsXG4gICAgICAgIGNsb3NlTWVudTogY2xvc2VNZW51LFxuICAgICAgICB0b2dnbGVNZW51OiB0b2dnbGVNZW51LFxuICAgICAgICBzZWxlY3RJdGVtOiBzZWxlY3RJdGVtLFxuICAgICAgICBzZWxlY3RJdGVtQXRJbmRleDogc2VsZWN0SXRlbUF0SW5kZXgsXG4gICAgICAgIHNlbGVjdEhpZ2hsaWdodGVkSXRlbTogc2VsZWN0SGlnaGxpZ2h0ZWRJdGVtLFxuICAgICAgICBzZXRIaWdobGlnaHRlZEluZGV4OiBzZXRIaWdobGlnaHRlZEluZGV4LFxuICAgICAgICBjbGVhclNlbGVjdGlvbjogY2xlYXJTZWxlY3Rpb24sXG4gICAgICAgIGNsZWFySXRlbXM6IGNsZWFySXRlbXMsXG4gICAgICAgIHNldEl0ZW1Db3VudDogc2V0SXRlbUNvdW50LFxuICAgICAgICB1bnNldEl0ZW1Db3VudDogdW5zZXRJdGVtQ291bnQsXG4gICAgICAgIHNldFN0YXRlOiBzZXRTdGF0ZSxcbiAgICAgICAgLy8gcHJvcHNcbiAgICAgICAgaXRlbVRvU3RyaW5nOiBpdGVtVG9TdHJpbmcsXG4gICAgICAgIC8vIGRlcml2ZWRcbiAgICAgICAgaWQ6IGlkLFxuICAgICAgICAvLyBzdGF0ZVxuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBoaWdobGlnaHRlZEluZGV4LFxuICAgICAgICBpbnB1dFZhbHVlOiBpbnB1dFZhbHVlLFxuICAgICAgICBpc09wZW46IGlzT3BlbixcbiAgICAgICAgc2VsZWN0ZWRJdGVtOiBzZWxlY3RlZEl0ZW1cbiAgICAgIH07XG4gICAgfTtcbiAgICBfcHJvdG8uY29tcG9uZW50RGlkTW91bnQgPSBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIHZhciBfdGhpczcgPSB0aGlzO1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmIChyZWFjdC1uYXRpdmUpICovXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiAhZmFsc2UgJiYgdGhpcy5nZXRNZW51UHJvcHMuY2FsbGVkICYmICF0aGlzLmdldE1lbnVQcm9wcy5zdXBwcmVzc1JlZkVycm9yKSB7XG4gICAgICAgIHZhbGlkYXRlR2V0TWVudVByb3BzQ2FsbGVkQ29ycmVjdGx5KHRoaXMuX21lbnVOb2RlLCB0aGlzLmdldE1lbnVQcm9wcyk7XG4gICAgICB9XG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAocmVhY3QtbmF0aXZlKSAqL1xuICAgICAge1xuICAgICAgICAvLyB0aGlzLmlzTW91c2VEb3duIGhlbHBzIHVzIHRyYWNrIHdoZXRoZXIgdGhlIG1vdXNlIGlzIGN1cnJlbnRseSBoZWxkIGRvd24uXG4gICAgICAgIC8vIFRoaXMgaXMgdXNlZnVsIHdoZW4gdGhlIHVzZXIgY2xpY2tzIG9uIGFuIGl0ZW0gaW4gdGhlIGxpc3QsIGJ1dCBob2xkcyB0aGUgbW91c2VcbiAgICAgICAgLy8gZG93biBsb25nIGVub3VnaCBmb3IgdGhlIGxpc3QgdG8gZGlzYXBwZWFyIChiZWNhdXNlIHRoZSBibHVyIGV2ZW50IGZpcmVzIG9uIHRoZSBpbnB1dClcbiAgICAgICAgLy8gdGhpcy5pc01vdXNlRG93biBpcyB1c2VkIGluIHRoZSBibHVyIGhhbmRsZXIgb24gdGhlIGlucHV0IHRvIGRldGVybWluZSB3aGV0aGVyIHRoZSBibHVyIGV2ZW50IHNob3VsZFxuICAgICAgICAvLyB0cmlnZ2VyIGhpZGluZyB0aGUgbWVudS5cbiAgICAgICAgdmFyIG9uTW91c2VEb3duID0gZnVuY3Rpb24gb25Nb3VzZURvd24oKSB7XG4gICAgICAgICAgX3RoaXM3LmlzTW91c2VEb3duID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG9uTW91c2VVcCA9IGZ1bmN0aW9uIG9uTW91c2VVcChldmVudCkge1xuICAgICAgICAgIF90aGlzNy5pc01vdXNlRG93biA9IGZhbHNlO1xuICAgICAgICAgIC8vIGlmIHRoZSB0YXJnZXQgZWxlbWVudCBvciB0aGUgYWN0aXZlRWxlbWVudCBpcyB3aXRoaW4gYSBkb3duc2hpZnQgbm9kZVxuICAgICAgICAgIC8vIHRoZW4gd2UgZG9uJ3Qgd2FudCB0byByZXNldCBkb3duc2hpZnRcbiAgICAgICAgICB2YXIgY29udGV4dFdpdGhpbkRvd25zaGlmdCA9IHRhcmdldFdpdGhpbkRvd25zaGlmdChldmVudC50YXJnZXQsIFtfdGhpczcuX3Jvb3ROb2RlLCBfdGhpczcuX21lbnVOb2RlXSwgX3RoaXM3LnByb3BzLmVudmlyb25tZW50KTtcbiAgICAgICAgICBpZiAoIWNvbnRleHRXaXRoaW5Eb3duc2hpZnQgJiYgX3RoaXM3LmdldFN0YXRlKCkuaXNPcGVuKSB7XG4gICAgICAgICAgICBfdGhpczcucmVzZXQoe1xuICAgICAgICAgICAgICB0eXBlOiBtb3VzZVVwXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBfdGhpczcucHJvcHMub25PdXRlckNsaWNrKF90aGlzNy5nZXRTdGF0ZUFuZEhlbHBlcnMoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8vIFRvdWNoaW5nIGFuIGVsZW1lbnQgaW4gaU9TIGdpdmVzIGZvY3VzIGFuZCBob3ZlciBzdGF0ZXMsIGJ1dCB0b3VjaGluZyBvdXQgb2ZcbiAgICAgICAgLy8gdGhlIGVsZW1lbnQgd2lsbCByZW1vdmUgaG92ZXIsIGFuZCBwZXJzaXN0IHRoZSBmb2N1cyBzdGF0ZSwgcmVzdWx0aW5nIGluIHRoZVxuICAgICAgICAvLyBibHVyIGV2ZW50IG5vdCBiZWluZyB0cmlnZ2VyZWQuXG4gICAgICAgIC8vIHRoaXMuaXNUb3VjaE1vdmUgaGVscHMgdXMgdHJhY2sgd2hldGhlciB0aGUgdXNlciBpcyB0YXBwaW5nIG9yIHN3aXBpbmcgb24gYSB0b3VjaCBzY3JlZW4uXG4gICAgICAgIC8vIElmIHRoZSB1c2VyIHRhcHMgb3V0c2lkZSBvZiBEb3duc2hpZnQsIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIHJlc2V0LFxuICAgICAgICAvLyBidXQgbm90IGlmIHRoZSB1c2VyIGlzIHN3aXBpbmdcbiAgICAgICAgdmFyIG9uVG91Y2hTdGFydCA9IGZ1bmN0aW9uIG9uVG91Y2hTdGFydCgpIHtcbiAgICAgICAgICBfdGhpczcuaXNUb3VjaE1vdmUgPSBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG9uVG91Y2hNb3ZlID0gZnVuY3Rpb24gb25Ub3VjaE1vdmUoKSB7XG4gICAgICAgICAgX3RoaXM3LmlzVG91Y2hNb3ZlID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG9uVG91Y2hFbmQgPSBmdW5jdGlvbiBvblRvdWNoRW5kKGV2ZW50KSB7XG4gICAgICAgICAgdmFyIGNvbnRleHRXaXRoaW5Eb3duc2hpZnQgPSB0YXJnZXRXaXRoaW5Eb3duc2hpZnQoZXZlbnQudGFyZ2V0LCBbX3RoaXM3Ll9yb290Tm9kZSwgX3RoaXM3Ll9tZW51Tm9kZV0sIF90aGlzNy5wcm9wcy5lbnZpcm9ubWVudCwgZmFsc2UpO1xuICAgICAgICAgIGlmICghX3RoaXM3LmlzVG91Y2hNb3ZlICYmICFjb250ZXh0V2l0aGluRG93bnNoaWZ0ICYmIF90aGlzNy5nZXRTdGF0ZSgpLmlzT3Blbikge1xuICAgICAgICAgICAgX3RoaXM3LnJlc2V0KHtcbiAgICAgICAgICAgICAgdHlwZTogdG91Y2hFbmRcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzNy5wcm9wcy5vbk91dGVyQ2xpY2soX3RoaXM3LmdldFN0YXRlQW5kSGVscGVycygpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGVudmlyb25tZW50ID0gdGhpcy5wcm9wcy5lbnZpcm9ubWVudDtcbiAgICAgICAgZW52aXJvbm1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Nb3VzZURvd24pO1xuICAgICAgICBlbnZpcm9ubWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKTtcbiAgICAgICAgZW52aXJvbm1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uVG91Y2hTdGFydCk7XG4gICAgICAgIGVudmlyb25tZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uVG91Y2hNb3ZlKTtcbiAgICAgICAgZW52aXJvbm1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoRW5kKTtcbiAgICAgICAgdGhpcy5jbGVhbnVwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIF90aGlzNy5pbnRlcm5hbENsZWFyVGltZW91dHMoKTtcbiAgICAgICAgICBfdGhpczcudXBkYXRlU3RhdHVzLmNhbmNlbCgpO1xuICAgICAgICAgIGVudmlyb25tZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duKTtcbiAgICAgICAgICBlbnZpcm9ubWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKTtcbiAgICAgICAgICBlbnZpcm9ubWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25Ub3VjaFN0YXJ0KTtcbiAgICAgICAgICBlbnZpcm9ubWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvblRvdWNoTW92ZSk7XG4gICAgICAgICAgZW52aXJvbm1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoRW5kKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICAgIF9wcm90by5zaG91bGRTY3JvbGwgPSBmdW5jdGlvbiBzaG91bGRTY3JvbGwocHJldlN0YXRlLCBwcmV2UHJvcHMpIHtcbiAgICAgIHZhciBfcmVmMTAgPSB0aGlzLnByb3BzLmhpZ2hsaWdodGVkSW5kZXggPT09IHVuZGVmaW5lZCA/IHRoaXMuZ2V0U3RhdGUoKSA6IHRoaXMucHJvcHMsXG4gICAgICAgIGN1cnJlbnRIaWdobGlnaHRlZEluZGV4ID0gX3JlZjEwLmhpZ2hsaWdodGVkSW5kZXg7XG4gICAgICB2YXIgX3JlZjExID0gcHJldlByb3BzLmhpZ2hsaWdodGVkSW5kZXggPT09IHVuZGVmaW5lZCA/IHByZXZTdGF0ZSA6IHByZXZQcm9wcyxcbiAgICAgICAgcHJldkhpZ2hsaWdodGVkSW5kZXggPSBfcmVmMTEuaGlnaGxpZ2h0ZWRJbmRleDtcbiAgICAgIHZhciBzY3JvbGxXaGVuT3BlbiA9IGN1cnJlbnRIaWdobGlnaHRlZEluZGV4ICYmIHRoaXMuZ2V0U3RhdGUoKS5pc09wZW4gJiYgIXByZXZTdGF0ZS5pc09wZW47XG4gICAgICB2YXIgc2Nyb2xsV2hlbk5hdmlnYXRpbmcgPSBjdXJyZW50SGlnaGxpZ2h0ZWRJbmRleCAhPT0gcHJldkhpZ2hsaWdodGVkSW5kZXg7XG4gICAgICByZXR1cm4gc2Nyb2xsV2hlbk9wZW4gfHwgc2Nyb2xsV2hlbk5hdmlnYXRpbmc7XG4gICAgfTtcbiAgICBfcHJvdG8uY29tcG9uZW50RGlkVXBkYXRlID0gZnVuY3Rpb24gY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICB2YWxpZGF0ZUNvbnRyb2xsZWRVbmNoYW5nZWQodGhpcy5zdGF0ZSwgcHJldlByb3BzLCB0aGlzLnByb3BzKTtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmIChyZWFjdC1uYXRpdmUpICovXG4gICAgICAgIGlmICh0aGlzLmdldE1lbnVQcm9wcy5jYWxsZWQgJiYgIXRoaXMuZ2V0TWVudVByb3BzLnN1cHByZXNzUmVmRXJyb3IpIHtcbiAgICAgICAgICB2YWxpZGF0ZUdldE1lbnVQcm9wc0NhbGxlZENvcnJlY3RseSh0aGlzLl9tZW51Tm9kZSwgdGhpcy5nZXRNZW51UHJvcHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNDb250cm9sbGVkUHJvcCh0aGlzLnByb3BzLCAnc2VsZWN0ZWRJdGVtJykgJiYgdGhpcy5wcm9wcy5zZWxlY3RlZEl0ZW1DaGFuZ2VkKHByZXZQcm9wcy5zZWxlY3RlZEl0ZW0sIHRoaXMucHJvcHMuc2VsZWN0ZWRJdGVtKSkge1xuICAgICAgICB0aGlzLmludGVybmFsU2V0U3RhdGUoe1xuICAgICAgICAgIHR5cGU6IGNvbnRyb2xsZWRQcm9wVXBkYXRlZFNlbGVjdGVkSXRlbSxcbiAgICAgICAgICBpbnB1dFZhbHVlOiB0aGlzLnByb3BzLml0ZW1Ub1N0cmluZyh0aGlzLnByb3BzLnNlbGVjdGVkSXRlbSlcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuYXZvaWRTY3JvbGxpbmcgJiYgdGhpcy5zaG91bGRTY3JvbGwocHJldlN0YXRlLCBwcmV2UHJvcHMpKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsSGlnaGxpZ2h0ZWRJdGVtSW50b1ZpZXcoKTtcbiAgICAgIH1cblxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKHJlYWN0LW5hdGl2ZSkgKi9cbiAgICAgIHtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0dXMoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIF9wcm90by5jb21wb25lbnRXaWxsVW5tb3VudCA9IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgdGhpcy5jbGVhbnVwKCk7IC8vIGF2b2lkcyBtZW1vcnkgbGVha1xuICAgIH07XG4gICAgX3Byb3RvLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIHZhciBjaGlsZHJlbiA9IHVud3JhcEFycmF5KHRoaXMucHJvcHMuY2hpbGRyZW4sIG5vb3ApO1xuICAgICAgLy8gYmVjYXVzZSB0aGUgaXRlbXMgYXJlIHJlcmVuZGVyZWQgZXZlcnkgdGltZSB3ZSBjYWxsIHRoZSBjaGlsZHJlblxuICAgICAgLy8gd2UgY2xlYXIgdGhpcyBvdXQgZWFjaCByZW5kZXIgYW5kIGl0IHdpbGwgYmUgcG9wdWxhdGVkIGFnYWluIGFzXG4gICAgICAvLyBnZXRJdGVtUHJvcHMgaXMgY2FsbGVkLlxuICAgICAgdGhpcy5jbGVhckl0ZW1zKCk7XG4gICAgICAvLyB3ZSByZXNldCB0aGlzIHNvIHdlIGtub3cgd2hldGhlciB0aGUgdXNlciBjYWxscyBnZXRSb290UHJvcHMgZHVyaW5nXG4gICAgICAvLyB0aGlzIHJlbmRlci4gSWYgdGhleSBkbyB0aGVuIHdlIGRvbid0IG5lZWQgdG8gZG8gYW55dGhpbmcsXG4gICAgICAvLyBpZiB0aGV5IGRvbid0IHRoZW4gd2UgbmVlZCB0byBjbG9uZSB0aGUgZWxlbWVudCB0aGV5IHJldHVybiBhbmRcbiAgICAgIC8vIGFwcGx5IHRoZSBwcm9wcyBmb3IgdGhlbS5cbiAgICAgIHRoaXMuZ2V0Um9vdFByb3BzLmNhbGxlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5nZXRSb290UHJvcHMucmVmS2V5ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5nZXRSb290UHJvcHMuc3VwcHJlc3NSZWZFcnJvciA9IHVuZGVmaW5lZDtcbiAgICAgIC8vIHdlIGRvIHNvbWV0aGluZyBzaW1pbGFyIGZvciBnZXRNZW51UHJvcHNcbiAgICAgIHRoaXMuZ2V0TWVudVByb3BzLmNhbGxlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5nZXRNZW51UHJvcHMucmVmS2V5ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5nZXRNZW51UHJvcHMuc3VwcHJlc3NSZWZFcnJvciA9IHVuZGVmaW5lZDtcbiAgICAgIC8vIHdlIGRvIHNvbWV0aGluZyBzaW1pbGFyIGZvciBnZXRMYWJlbFByb3BzXG4gICAgICB0aGlzLmdldExhYmVsUHJvcHMuY2FsbGVkID0gZmFsc2U7XG4gICAgICAvLyBhbmQgc29tZXRoaW5nIHNpbWlsYXIgZm9yIGdldElucHV0UHJvcHNcbiAgICAgIHRoaXMuZ2V0SW5wdXRQcm9wcy5jYWxsZWQgPSBmYWxzZTtcbiAgICAgIHZhciBlbGVtZW50ID0gdW53cmFwQXJyYXkoY2hpbGRyZW4odGhpcy5nZXRTdGF0ZUFuZEhlbHBlcnMoKSkpO1xuICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZ2V0Um9vdFByb3BzLmNhbGxlZCB8fCB0aGlzLnByb3BzLnN1cHByZXNzUmVmRXJyb3IpIHtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgIXRoaXMuZ2V0Um9vdFByb3BzLnN1cHByZXNzUmVmRXJyb3IgJiYgIXRoaXMucHJvcHMuc3VwcHJlc3NSZWZFcnJvcikge1xuICAgICAgICAgIHZhbGlkYXRlR2V0Um9vdFByb3BzQ2FsbGVkQ29ycmVjdGx5KGVsZW1lbnQsIHRoaXMuZ2V0Um9vdFByb3BzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgIH0gZWxzZSBpZiAoaXNET01FbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgICAgIC8vIHRoZXkgZGlkbid0IGFwcGx5IHRoZSByb290IHByb3BzLCBidXQgd2UgY2FuIGNsb25lXG4gICAgICAgIC8vIHRoaXMgYW5kIGFwcGx5IHRoZSBwcm9wcyBvdXJzZWx2ZXNcbiAgICAgICAgcmV0dXJuIC8qI19fUFVSRV9fKi9jbG9uZUVsZW1lbnQoZWxlbWVudCwgdGhpcy5nZXRSb290UHJvcHMoZ2V0RWxlbWVudFByb3BzKGVsZW1lbnQpKSk7XG4gICAgICB9XG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAvLyB0aGV5IGRpZG4ndCBhcHBseSB0aGUgcm9vdCBwcm9wcywgYnV0IHRoZXkgbmVlZCB0b1xuICAgICAgICAvLyBvdGhlcndpc2Ugd2UgY2FuJ3QgcXVlcnkgYXJvdW5kIHRoZSBhdXRvY29tcGxldGVcblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Rvd25zaGlmdDogSWYgeW91IHJldHVybiBhIG5vbi1ET00gZWxlbWVudCwgeW91IG11c3QgYXBwbHkgdGhlIGdldFJvb3RQcm9wcyBmdW5jdGlvbicpO1xuICAgICAgfVxuXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIHJldHVybiBEb3duc2hpZnQ7XG4gIH0oQ29tcG9uZW50KTtcbiAgRG93bnNoaWZ0LmRlZmF1bHRQcm9wcyA9IHtcbiAgICBkZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleDogbnVsbCxcbiAgICBkZWZhdWx0SXNPcGVuOiBmYWxzZSxcbiAgICBnZXRBMTF5U3RhdHVzTWVzc2FnZTogZ2V0QTExeVN0YXR1c01lc3NhZ2UkMSxcbiAgICBpdGVtVG9TdHJpbmc6IGZ1bmN0aW9uIGl0ZW1Ub1N0cmluZyhpKSB7XG4gICAgICBpZiAoaSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIGlzUGxhaW5PYmplY3QoaSkgJiYgIWkuaGFzT3duUHJvcGVydHkoJ3RvU3RyaW5nJykpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgY29uc29sZS53YXJuKCdkb3duc2hpZnQ6IEFuIG9iamVjdCB3YXMgcGFzc2VkIHRvIHRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIGBpdGVtVG9TdHJpbmdgLiBZb3Ugc2hvdWxkIHByb2JhYmx5IHByb3ZpZGUgeW91ciBvd24gYGl0ZW1Ub1N0cmluZ2AgaW1wbGVtZW50YXRpb24uIFBsZWFzZSByZWZlciB0byB0aGUgYGl0ZW1Ub1N0cmluZ2AgQVBJIGRvY3VtZW50YXRpb24uJywgJ1RoZSBvYmplY3QgdGhhdCB3YXMgcGFzc2VkOicsIGkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFN0cmluZyhpKTtcbiAgICB9LFxuICAgIG9uU3RhdGVDaGFuZ2U6IG5vb3AsXG4gICAgb25JbnB1dFZhbHVlQ2hhbmdlOiBub29wLFxuICAgIG9uVXNlckFjdGlvbjogbm9vcCxcbiAgICBvbkNoYW5nZTogbm9vcCxcbiAgICBvblNlbGVjdDogbm9vcCxcbiAgICBvbk91dGVyQ2xpY2s6IG5vb3AsXG4gICAgc2VsZWN0ZWRJdGVtQ2hhbmdlZDogZnVuY3Rpb24gc2VsZWN0ZWRJdGVtQ2hhbmdlZChwcmV2SXRlbSwgaXRlbSkge1xuICAgICAgcmV0dXJuIHByZXZJdGVtICE9PSBpdGVtO1xuICAgIH0sXG4gICAgZW52aXJvbm1lbnQ6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0IChzc3IpICovXG4gICAgdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyB7fSA6IHdpbmRvdyxcbiAgICBzdGF0ZVJlZHVjZXI6IGZ1bmN0aW9uIHN0YXRlUmVkdWNlcihzdGF0ZSwgc3RhdGVUb1NldCkge1xuICAgICAgcmV0dXJuIHN0YXRlVG9TZXQ7XG4gICAgfSxcbiAgICBzdXBwcmVzc1JlZkVycm9yOiBmYWxzZSxcbiAgICBzY3JvbGxJbnRvVmlldzogc2Nyb2xsSW50b1ZpZXdcbiAgfTtcbiAgRG93bnNoaWZ0LnN0YXRlQ2hhbmdlVHlwZXMgPSBzdGF0ZUNoYW5nZVR5cGVzJDM7XG4gIHJldHVybiBEb3duc2hpZnQ7XG59KCk7XG5wcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyBEb3duc2hpZnQucHJvcFR5cGVzID0ge1xuICBjaGlsZHJlbjogUHJvcFR5cGVzLmZ1bmMsXG4gIGRlZmF1bHRIaWdobGlnaHRlZEluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICBkZWZhdWx0SXNPcGVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgaW5pdGlhbEhpZ2hsaWdodGVkSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gIGluaXRpYWxTZWxlY3RlZEl0ZW06IFByb3BUeXBlcy5hbnksXG4gIGluaXRpYWxJbnB1dFZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBpbml0aWFsSXNPcGVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgZ2V0QTExeVN0YXR1c01lc3NhZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBpdGVtVG9TdHJpbmc6IFByb3BUeXBlcy5mdW5jLFxuICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uU2VsZWN0OiBQcm9wVHlwZXMuZnVuYyxcbiAgb25TdGF0ZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uSW5wdXRWYWx1ZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uVXNlckFjdGlvbjogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uT3V0ZXJDbGljazogUHJvcFR5cGVzLmZ1bmMsXG4gIHNlbGVjdGVkSXRlbUNoYW5nZWQ6IFByb3BUeXBlcy5mdW5jLFxuICBzdGF0ZVJlZHVjZXI6IFByb3BUeXBlcy5mdW5jLFxuICBpdGVtQ291bnQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBlbnZpcm9ubWVudDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICBhZGRFdmVudExpc3RlbmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICByZW1vdmVFdmVudExpc3RlbmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBkb2N1bWVudDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGdldEVsZW1lbnRCeUlkOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgIGFjdGl2ZUVsZW1lbnQ6IFByb3BUeXBlcy5hbnksXG4gICAgICBib2R5OiBQcm9wVHlwZXMuYW55XG4gICAgfSlcbiAgfSksXG4gIHN1cHByZXNzUmVmRXJyb3I6IFByb3BUeXBlcy5ib29sLFxuICBzY3JvbGxJbnRvVmlldzogUHJvcFR5cGVzLmZ1bmMsXG4gIC8vIHRoaW5ncyB3ZSBrZWVwIGluIHN0YXRlIGZvciB1bmNvbnRyb2xsZWQgY29tcG9uZW50c1xuICAvLyBidXQgY2FuIGFjY2VwdCBhcyBwcm9wcyBmb3IgY29udHJvbGxlZCBjb21wb25lbnRzXG4gIC8qIGVzbGludC1kaXNhYmxlIHJlYWN0L25vLXVudXNlZC1wcm9wLXR5cGVzICovXG4gIHNlbGVjdGVkSXRlbTogUHJvcFR5cGVzLmFueSxcbiAgaXNPcGVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgaW5wdXRWYWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaGlnaGxpZ2h0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgbGFiZWxJZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgaW5wdXRJZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgbWVudUlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBnZXRJdGVtSWQ6IFByb3BUeXBlcy5mdW5jXG4gIC8qIGVzbGludC1lbmFibGUgcmVhY3Qvbm8tdW51c2VkLXByb3AtdHlwZXMgKi9cbn0gOiB2b2lkIDA7XG52YXIgRG93bnNoaWZ0JDEgPSBEb3duc2hpZnQ7XG5mdW5jdGlvbiB2YWxpZGF0ZUdldE1lbnVQcm9wc0NhbGxlZENvcnJlY3RseShub2RlLCBfcmVmMTIpIHtcbiAgdmFyIHJlZktleSA9IF9yZWYxMi5yZWZLZXk7XG4gIGlmICghbm9kZSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5lcnJvcihcImRvd25zaGlmdDogVGhlIHJlZiBwcm9wIFxcXCJcIiArIHJlZktleSArIFwiXFxcIiBmcm9tIGdldE1lbnVQcm9wcyB3YXMgbm90IGFwcGxpZWQgY29ycmVjdGx5IG9uIHlvdXIgbWVudSBlbGVtZW50LlwiKTtcbiAgfVxufVxuZnVuY3Rpb24gdmFsaWRhdGVHZXRSb290UHJvcHNDYWxsZWRDb3JyZWN0bHkoZWxlbWVudCwgX3JlZjEzKSB7XG4gIHZhciByZWZLZXkgPSBfcmVmMTMucmVmS2V5O1xuICB2YXIgcmVmS2V5U3BlY2lmaWVkID0gcmVmS2V5ICE9PSAncmVmJztcbiAgdmFyIGlzQ29tcG9zaXRlID0gIWlzRE9NRWxlbWVudChlbGVtZW50KTtcbiAgaWYgKGlzQ29tcG9zaXRlICYmICFyZWZLZXlTcGVjaWZpZWQgJiYgIWlzRm9yd2FyZFJlZihlbGVtZW50KSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5lcnJvcignZG93bnNoaWZ0OiBZb3UgcmV0dXJuZWQgYSBub24tRE9NIGVsZW1lbnQuIFlvdSBtdXN0IHNwZWNpZnkgYSByZWZLZXkgaW4gZ2V0Um9vdFByb3BzJyk7XG4gIH0gZWxzZSBpZiAoIWlzQ29tcG9zaXRlICYmIHJlZktleVNwZWNpZmllZCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5lcnJvcihcImRvd25zaGlmdDogWW91IHJldHVybmVkIGEgRE9NIGVsZW1lbnQuIFlvdSBzaG91bGQgbm90IHNwZWNpZnkgYSByZWZLZXkgaW4gZ2V0Um9vdFByb3BzLiBZb3Ugc3BlY2lmaWVkIFxcXCJcIiArIHJlZktleSArIFwiXFxcIlwiKTtcbiAgfVxuICBpZiAoIWlzRm9yd2FyZFJlZihlbGVtZW50KSAmJiAhZ2V0RWxlbWVudFByb3BzKGVsZW1lbnQpW3JlZktleV0pIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUuZXJyb3IoXCJkb3duc2hpZnQ6IFlvdSBtdXN0IGFwcGx5IHRoZSByZWYgcHJvcCBcXFwiXCIgKyByZWZLZXkgKyBcIlxcXCIgZnJvbSBnZXRSb290UHJvcHMgb250byB5b3VyIHJvb3QgZWxlbWVudC5cIik7XG4gIH1cbn1cblxudmFyIF9leGNsdWRlZCQzID0gW1wiaXNJbml0aWFsTW91bnRcIiwgXCJoaWdobGlnaHRlZEluZGV4XCIsIFwiaXRlbXNcIiwgXCJlbnZpcm9ubWVudFwiXTtcbnZhciBkcm9wZG93bkRlZmF1bHRTdGF0ZVZhbHVlcyA9IHtcbiAgaGlnaGxpZ2h0ZWRJbmRleDogLTEsXG4gIGlzT3BlbjogZmFsc2UsXG4gIHNlbGVjdGVkSXRlbTogbnVsbCxcbiAgaW5wdXRWYWx1ZTogJydcbn07XG5mdW5jdGlvbiBjYWxsT25DaGFuZ2VQcm9wcyhhY3Rpb24sIHN0YXRlLCBuZXdTdGF0ZSkge1xuICB2YXIgcHJvcHMgPSBhY3Rpb24ucHJvcHMsXG4gICAgdHlwZSA9IGFjdGlvbi50eXBlO1xuICB2YXIgY2hhbmdlcyA9IHt9O1xuICBPYmplY3Qua2V5cyhzdGF0ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgaW52b2tlT25DaGFuZ2VIYW5kbGVyKGtleSwgYWN0aW9uLCBzdGF0ZSwgbmV3U3RhdGUpO1xuICAgIGlmIChuZXdTdGF0ZVtrZXldICE9PSBzdGF0ZVtrZXldKSB7XG4gICAgICBjaGFuZ2VzW2tleV0gPSBuZXdTdGF0ZVtrZXldO1xuICAgIH1cbiAgfSk7XG4gIGlmIChwcm9wcy5vblN0YXRlQ2hhbmdlICYmIE9iamVjdC5rZXlzKGNoYW5nZXMpLmxlbmd0aCkge1xuICAgIHByb3BzLm9uU3RhdGVDaGFuZ2UoX2V4dGVuZHMoe1xuICAgICAgdHlwZTogdHlwZVxuICAgIH0sIGNoYW5nZXMpKTtcbiAgfVxufVxuZnVuY3Rpb24gaW52b2tlT25DaGFuZ2VIYW5kbGVyKGtleSwgYWN0aW9uLCBzdGF0ZSwgbmV3U3RhdGUpIHtcbiAgdmFyIHByb3BzID0gYWN0aW9uLnByb3BzLFxuICAgIHR5cGUgPSBhY3Rpb24udHlwZTtcbiAgdmFyIGhhbmRsZXIgPSBcIm9uXCIgKyBjYXBpdGFsaXplU3RyaW5nKGtleSkgKyBcIkNoYW5nZVwiO1xuICBpZiAocHJvcHNbaGFuZGxlcl0gJiYgbmV3U3RhdGVba2V5XSAhPT0gdW5kZWZpbmVkICYmIG5ld1N0YXRlW2tleV0gIT09IHN0YXRlW2tleV0pIHtcbiAgICBwcm9wc1toYW5kbGVyXShfZXh0ZW5kcyh7XG4gICAgICB0eXBlOiB0eXBlXG4gICAgfSwgbmV3U3RhdGUpKTtcbiAgfVxufVxuXG4vKipcbiAqIERlZmF1bHQgc3RhdGUgcmVkdWNlciB0aGF0IHJldHVybnMgdGhlIGNoYW5nZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHMgc3RhdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gYSBhY3Rpb24gd2l0aCBjaGFuZ2VzLlxuICogQHJldHVybnMge09iamVjdH0gY2hhbmdlcy5cbiAqL1xuZnVuY3Rpb24gc3RhdGVSZWR1Y2VyKHMsIGEpIHtcbiAgcmV0dXJuIGEuY2hhbmdlcztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgbWVzc2FnZSB0byBiZSBhZGRlZCB0byBhcmlhLWxpdmUgcmVnaW9uIHdoZW4gaXRlbSBpcyBzZWxlY3RlZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gc2VsZWN0aW9uUGFyYW1ldGVycyBQYXJhbWV0ZXJzIHJlcXVpcmVkIHRvIGJ1aWxkIHRoZSBtZXNzYWdlLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGExMXkgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gZ2V0QTExeVNlbGVjdGlvbk1lc3NhZ2Uoc2VsZWN0aW9uUGFyYW1ldGVycykge1xuICB2YXIgc2VsZWN0ZWRJdGVtID0gc2VsZWN0aW9uUGFyYW1ldGVycy5zZWxlY3RlZEl0ZW0sXG4gICAgaXRlbVRvU3RyaW5nTG9jYWwgPSBzZWxlY3Rpb25QYXJhbWV0ZXJzLml0ZW1Ub1N0cmluZztcbiAgcmV0dXJuIHNlbGVjdGVkSXRlbSA/IGl0ZW1Ub1N0cmluZ0xvY2FsKHNlbGVjdGVkSXRlbSkgKyBcIiBoYXMgYmVlbiBzZWxlY3RlZC5cIiA6ICcnO1xufVxuXG4vKipcbiAqIERlYm91bmNlZCBjYWxsIGZvciB1cGRhdGluZyB0aGUgYTExeSBtZXNzYWdlLlxuICovXG52YXIgdXBkYXRlQTExeVN0YXR1cyA9IGRlYm91bmNlKGZ1bmN0aW9uIChnZXRBMTF5TWVzc2FnZSwgZG9jdW1lbnQpIHtcbiAgc2V0U3RhdHVzKGdldEExMXlNZXNzYWdlKCksIGRvY3VtZW50KTtcbn0sIDIwMCk7XG5cbi8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG52YXIgdXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgPyB1c2VMYXlvdXRFZmZlY3QgOiB1c2VFZmZlY3Q7XG5mdW5jdGlvbiB1c2VFbGVtZW50SWRzKF9yZWYpIHtcbiAgdmFyIF9yZWYkaWQgPSBfcmVmLmlkLFxuICAgIGlkID0gX3JlZiRpZCA9PT0gdm9pZCAwID8gXCJkb3duc2hpZnQtXCIgKyBnZW5lcmF0ZUlkKCkgOiBfcmVmJGlkLFxuICAgIGxhYmVsSWQgPSBfcmVmLmxhYmVsSWQsXG4gICAgbWVudUlkID0gX3JlZi5tZW51SWQsXG4gICAgZ2V0SXRlbUlkID0gX3JlZi5nZXRJdGVtSWQsXG4gICAgdG9nZ2xlQnV0dG9uSWQgPSBfcmVmLnRvZ2dsZUJ1dHRvbklkLFxuICAgIGlucHV0SWQgPSBfcmVmLmlucHV0SWQ7XG4gIHZhciBlbGVtZW50SWRzUmVmID0gdXNlUmVmKHtcbiAgICBsYWJlbElkOiBsYWJlbElkIHx8IGlkICsgXCItbGFiZWxcIixcbiAgICBtZW51SWQ6IG1lbnVJZCB8fCBpZCArIFwiLW1lbnVcIixcbiAgICBnZXRJdGVtSWQ6IGdldEl0ZW1JZCB8fCBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgIHJldHVybiBpZCArIFwiLWl0ZW0tXCIgKyBpbmRleDtcbiAgICB9LFxuICAgIHRvZ2dsZUJ1dHRvbklkOiB0b2dnbGVCdXR0b25JZCB8fCBpZCArIFwiLXRvZ2dsZS1idXR0b25cIixcbiAgICBpbnB1dElkOiBpbnB1dElkIHx8IGlkICsgXCItaW5wdXRcIlxuICB9KTtcbiAgcmV0dXJuIGVsZW1lbnRJZHNSZWYuY3VycmVudDtcbn1cbmZ1bmN0aW9uIGdldEl0ZW1BbmRJbmRleChpdGVtUHJvcCwgaW5kZXhQcm9wLCBpdGVtcywgZXJyb3JNZXNzYWdlKSB7XG4gIHZhciBpdGVtLCBpbmRleDtcbiAgaWYgKGl0ZW1Qcm9wID09PSB1bmRlZmluZWQpIHtcbiAgICBpZiAoaW5kZXhQcm9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgIH1cbiAgICBpdGVtID0gaXRlbXNbaW5kZXhQcm9wXTtcbiAgICBpbmRleCA9IGluZGV4UHJvcDtcbiAgfSBlbHNlIHtcbiAgICBpbmRleCA9IGluZGV4UHJvcCA9PT0gdW5kZWZpbmVkID8gaXRlbXMuaW5kZXhPZihpdGVtUHJvcCkgOiBpbmRleFByb3A7XG4gICAgaXRlbSA9IGl0ZW1Qcm9wO1xuICB9XG4gIHJldHVybiBbaXRlbSwgaW5kZXhdO1xufVxuZnVuY3Rpb24gaXRlbVRvU3RyaW5nKGl0ZW0pIHtcbiAgcmV0dXJuIGl0ZW0gPyBTdHJpbmcoaXRlbSkgOiAnJztcbn1cbmZ1bmN0aW9uIGlzQWNjZXB0ZWRDaGFyYWN0ZXJLZXkoa2V5KSB7XG4gIHJldHVybiAvXlxcU3sxfSQvLnRlc3Qoa2V5KTtcbn1cbmZ1bmN0aW9uIGNhcGl0YWxpemVTdHJpbmcoc3RyaW5nKSB7XG4gIHJldHVybiBcIlwiICsgc3RyaW5nLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSk7XG59XG5mdW5jdGlvbiB1c2VMYXRlc3RSZWYodmFsKSB7XG4gIHZhciByZWYgPSB1c2VSZWYodmFsKTtcbiAgLy8gdGVjaG5pY2FsbHkgdGhpcyBpcyBub3QgXCJjb25jdXJyZW50IG1vZGUgc2FmZVwiIGJlY2F1c2Ugd2UncmUgbWFuaXB1bGF0aW5nXG4gIC8vIHRoZSB2YWx1ZSBkdXJpbmcgcmVuZGVyIChzbyBpdCdzIG5vdCBpZGVtcG90ZW50KS4gSG93ZXZlciwgdGhlIHBsYWNlcyB0aGlzXG4gIC8vIGhvb2sgaXMgdXNlZCBpcyB0byBzdXBwb3J0IG1lbW9pemluZyBjYWxsYmFja3Mgd2hpY2ggd2lsbCBiZSBjYWxsZWRcbiAgLy8gKmR1cmluZyogcmVuZGVyLCBzbyB3ZSBuZWVkIHRoZSBsYXRlc3QgdmFsdWVzICpkdXJpbmcqIHJlbmRlci5cbiAgLy8gSWYgbm90IGZvciB0aGlzLCB0aGVuIHdlJ2QgcHJvYmFibHkgd2FudCB0byB1c2UgdXNlTGF5b3V0RWZmZWN0IGluc3RlYWQuXG4gIHJlZi5jdXJyZW50ID0gdmFsO1xuICByZXR1cm4gcmVmO1xufVxuXG4vKipcbiAqIENvbXB1dGVzIHRoZSBjb250cm9sbGVkIHN0YXRlIHVzaW5nIGEgdGhlIHByZXZpb3VzIHN0YXRlLCBwcm9wcyxcbiAqIHR3byByZWR1Y2Vycywgb25lIGZyb20gZG93bnNoaWZ0IGFuZCBhbiBvcHRpb25hbCBvbmUgZnJvbSB0aGUgdXNlci5cbiAqIEFsc28gY2FsbHMgdGhlIG9uQ2hhbmdlIGhhbmRsZXJzIGZvciBzdGF0ZSB2YWx1ZXMgdGhhdCBoYXZlIGNoYW5nZWQuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVkdWNlciBSZWR1Y2VyIGZ1bmN0aW9uIGZyb20gZG93bnNoaWZ0LlxuICogQHBhcmFtIHtPYmplY3R9IGluaXRpYWxTdGF0ZSBJbml0aWFsIHN0YXRlIG9mIHRoZSBob29rLlxuICogQHBhcmFtIHtPYmplY3R9IHByb3BzIFRoZSBob29rIHByb3BzLlxuICogQHJldHVybnMge0FycmF5fSBBbiBhcnJheSB3aXRoIHRoZSBzdGF0ZSBhbmQgYW4gYWN0aW9uIGRpc3BhdGNoZXIuXG4gKi9cbmZ1bmN0aW9uIHVzZUVuaGFuY2VkUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsU3RhdGUsIHByb3BzKSB7XG4gIHZhciBwcmV2U3RhdGVSZWYgPSB1c2VSZWYoKTtcbiAgdmFyIGFjdGlvblJlZiA9IHVzZVJlZigpO1xuICB2YXIgZW5oYW5jZWRSZWR1Y2VyID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcbiAgICBhY3Rpb25SZWYuY3VycmVudCA9IGFjdGlvbjtcbiAgICBzdGF0ZSA9IGdldFN0YXRlKHN0YXRlLCBhY3Rpb24ucHJvcHMpO1xuICAgIHZhciBjaGFuZ2VzID0gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKTtcbiAgICB2YXIgbmV3U3RhdGUgPSBhY3Rpb24ucHJvcHMuc3RhdGVSZWR1Y2VyKHN0YXRlLCBfZXh0ZW5kcyh7fSwgYWN0aW9uLCB7XG4gICAgICBjaGFuZ2VzOiBjaGFuZ2VzXG4gICAgfSkpO1xuICAgIHJldHVybiBuZXdTdGF0ZTtcbiAgfSwgW3JlZHVjZXJdKTtcbiAgdmFyIF91c2VSZWR1Y2VyID0gdXNlUmVkdWNlcihlbmhhbmNlZFJlZHVjZXIsIGluaXRpYWxTdGF0ZSksXG4gICAgc3RhdGUgPSBfdXNlUmVkdWNlclswXSxcbiAgICBkaXNwYXRjaCA9IF91c2VSZWR1Y2VyWzFdO1xuICB2YXIgcHJvcHNSZWYgPSB1c2VMYXRlc3RSZWYocHJvcHMpO1xuICB2YXIgZGlzcGF0Y2hXaXRoUHJvcHMgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgcmV0dXJuIGRpc3BhdGNoKF9leHRlbmRzKHtcbiAgICAgIHByb3BzOiBwcm9wc1JlZi5jdXJyZW50XG4gICAgfSwgYWN0aW9uKSk7XG4gIH0sIFtwcm9wc1JlZl0pO1xuICB2YXIgYWN0aW9uID0gYWN0aW9uUmVmLmN1cnJlbnQ7XG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGFjdGlvbiAmJiBwcmV2U3RhdGVSZWYuY3VycmVudCAmJiBwcmV2U3RhdGVSZWYuY3VycmVudCAhPT0gc3RhdGUpIHtcbiAgICAgIGNhbGxPbkNoYW5nZVByb3BzKGFjdGlvbiwgZ2V0U3RhdGUocHJldlN0YXRlUmVmLmN1cnJlbnQsIGFjdGlvbi5wcm9wcyksIHN0YXRlKTtcbiAgICB9XG4gICAgcHJldlN0YXRlUmVmLmN1cnJlbnQgPSBzdGF0ZTtcbiAgfSwgW3N0YXRlLCBwcm9wcywgYWN0aW9uXSk7XG4gIHJldHVybiBbc3RhdGUsIGRpc3BhdGNoV2l0aFByb3BzXTtcbn1cblxuLyoqXG4gKiBXcmFwcyB0aGUgdXNlRW5oYW5jZWRSZWR1Y2VyIGFuZCBhcHBsaWVzIHRoZSBjb250cm9sbGVkIHByb3AgdmFsdWVzIGJlZm9yZVxuICogcmV0dXJuaW5nIHRoZSBuZXcgc3RhdGUuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVkdWNlciBSZWR1Y2VyIGZ1bmN0aW9uIGZyb20gZG93bnNoaWZ0LlxuICogQHBhcmFtIHtPYmplY3R9IGluaXRpYWxTdGF0ZSBJbml0aWFsIHN0YXRlIG9mIHRoZSBob29rLlxuICogQHBhcmFtIHtPYmplY3R9IHByb3BzIFRoZSBob29rIHByb3BzLlxuICogQHJldHVybnMge0FycmF5fSBBbiBhcnJheSB3aXRoIHRoZSBzdGF0ZSBhbmQgYW4gYWN0aW9uIGRpc3BhdGNoZXIuXG4gKi9cbmZ1bmN0aW9uIHVzZUNvbnRyb2xsZWRSZWR1Y2VyJDEocmVkdWNlciwgaW5pdGlhbFN0YXRlLCBwcm9wcykge1xuICB2YXIgX3VzZUVuaGFuY2VkUmVkdWNlciA9IHVzZUVuaGFuY2VkUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsU3RhdGUsIHByb3BzKSxcbiAgICBzdGF0ZSA9IF91c2VFbmhhbmNlZFJlZHVjZXJbMF0sXG4gICAgZGlzcGF0Y2ggPSBfdXNlRW5oYW5jZWRSZWR1Y2VyWzFdO1xuICByZXR1cm4gW2dldFN0YXRlKHN0YXRlLCBwcm9wcyksIGRpc3BhdGNoXTtcbn1cbnZhciBkZWZhdWx0UHJvcHMkMyA9IHtcbiAgaXRlbVRvU3RyaW5nOiBpdGVtVG9TdHJpbmcsXG4gIHN0YXRlUmVkdWNlcjogc3RhdGVSZWR1Y2VyLFxuICBnZXRBMTF5U2VsZWN0aW9uTWVzc2FnZTogZ2V0QTExeVNlbGVjdGlvbk1lc3NhZ2UsXG4gIHNjcm9sbEludG9WaWV3OiBzY3JvbGxJbnRvVmlldyxcbiAgZW52aXJvbm1lbnQ6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0IChzc3IpICovXG4gIHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8ge30gOiB3aW5kb3dcbn07XG5mdW5jdGlvbiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgcHJvcEtleSwgZGVmYXVsdFN0YXRlVmFsdWVzKSB7XG4gIGlmIChkZWZhdWx0U3RhdGVWYWx1ZXMgPT09IHZvaWQgMCkge1xuICAgIGRlZmF1bHRTdGF0ZVZhbHVlcyA9IGRyb3Bkb3duRGVmYXVsdFN0YXRlVmFsdWVzO1xuICB9XG4gIHZhciBkZWZhdWx0VmFsdWUgPSBwcm9wc1tcImRlZmF1bHRcIiArIGNhcGl0YWxpemVTdHJpbmcocHJvcEtleSldO1xuICBpZiAoZGVmYXVsdFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICB9XG4gIHJldHVybiBkZWZhdWx0U3RhdGVWYWx1ZXNbcHJvcEtleV07XG59XG5mdW5jdGlvbiBnZXRJbml0aWFsVmFsdWUkMShwcm9wcywgcHJvcEtleSwgZGVmYXVsdFN0YXRlVmFsdWVzKSB7XG4gIGlmIChkZWZhdWx0U3RhdGVWYWx1ZXMgPT09IHZvaWQgMCkge1xuICAgIGRlZmF1bHRTdGF0ZVZhbHVlcyA9IGRyb3Bkb3duRGVmYXVsdFN0YXRlVmFsdWVzO1xuICB9XG4gIHZhciB2YWx1ZSA9IHByb3BzW3Byb3BLZXldO1xuICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICB2YXIgaW5pdGlhbFZhbHVlID0gcHJvcHNbXCJpbml0aWFsXCIgKyBjYXBpdGFsaXplU3RyaW5nKHByb3BLZXkpXTtcbiAgaWYgKGluaXRpYWxWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGluaXRpYWxWYWx1ZTtcbiAgfVxuICByZXR1cm4gZ2V0RGVmYXVsdFZhbHVlJDEocHJvcHMsIHByb3BLZXksIGRlZmF1bHRTdGF0ZVZhbHVlcyk7XG59XG5mdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUkMihwcm9wcykge1xuICB2YXIgc2VsZWN0ZWRJdGVtID0gZ2V0SW5pdGlhbFZhbHVlJDEocHJvcHMsICdzZWxlY3RlZEl0ZW0nKTtcbiAgdmFyIGlzT3BlbiA9IGdldEluaXRpYWxWYWx1ZSQxKHByb3BzLCAnaXNPcGVuJyk7XG4gIHZhciBoaWdobGlnaHRlZEluZGV4ID0gZ2V0SW5pdGlhbFZhbHVlJDEocHJvcHMsICdoaWdobGlnaHRlZEluZGV4Jyk7XG4gIHZhciBpbnB1dFZhbHVlID0gZ2V0SW5pdGlhbFZhbHVlJDEocHJvcHMsICdpbnB1dFZhbHVlJyk7XG4gIHJldHVybiB7XG4gICAgaGlnaGxpZ2h0ZWRJbmRleDogaGlnaGxpZ2h0ZWRJbmRleCA8IDAgJiYgc2VsZWN0ZWRJdGVtICYmIGlzT3BlbiA/IHByb3BzLml0ZW1zLmluZGV4T2Yoc2VsZWN0ZWRJdGVtKSA6IGhpZ2hsaWdodGVkSW5kZXgsXG4gICAgaXNPcGVuOiBpc09wZW4sXG4gICAgc2VsZWN0ZWRJdGVtOiBzZWxlY3RlZEl0ZW0sXG4gICAgaW5wdXRWYWx1ZTogaW5wdXRWYWx1ZVxuICB9O1xufVxuZnVuY3Rpb24gZ2V0SGlnaGxpZ2h0ZWRJbmRleE9uT3Blbihwcm9wcywgc3RhdGUsIG9mZnNldCkge1xuICB2YXIgaXRlbXMgPSBwcm9wcy5pdGVtcyxcbiAgICBpbml0aWFsSGlnaGxpZ2h0ZWRJbmRleCA9IHByb3BzLmluaXRpYWxIaWdobGlnaHRlZEluZGV4LFxuICAgIGRlZmF1bHRIaWdobGlnaHRlZEluZGV4ID0gcHJvcHMuZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXg7XG4gIHZhciBzZWxlY3RlZEl0ZW0gPSBzdGF0ZS5zZWxlY3RlZEl0ZW0sXG4gICAgaGlnaGxpZ2h0ZWRJbmRleCA9IHN0YXRlLmhpZ2hsaWdodGVkSW5kZXg7XG4gIGlmIChpdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvLyBpbml0aWFsSGlnaGxpZ2h0ZWRJbmRleCB3aWxsIGdpdmUgdmFsdWUgdG8gaGlnaGxpZ2h0ZWRJbmRleCBvbiBpbml0aWFsIHN0YXRlIG9ubHkuXG4gIGlmIChpbml0aWFsSGlnaGxpZ2h0ZWRJbmRleCAhPT0gdW5kZWZpbmVkICYmIGhpZ2hsaWdodGVkSW5kZXggPT09IGluaXRpYWxIaWdobGlnaHRlZEluZGV4KSB7XG4gICAgcmV0dXJuIGluaXRpYWxIaWdobGlnaHRlZEluZGV4O1xuICB9XG4gIGlmIChkZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRIaWdobGlnaHRlZEluZGV4O1xuICB9XG4gIGlmIChzZWxlY3RlZEl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbXMuaW5kZXhPZihzZWxlY3RlZEl0ZW0pO1xuICB9XG4gIGlmIChvZmZzZXQgPT09IDApIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgcmV0dXJuIG9mZnNldCA8IDAgPyBpdGVtcy5sZW5ndGggLSAxIDogMDtcbn1cblxuLyoqXG4gKiBSZXVzZSB0aGUgbW92ZW1lbnQgdHJhY2tpbmcgb2YgbW91c2UgYW5kIHRvdWNoIGV2ZW50cy5cbiAqXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzT3BlbiBXaGV0aGVyIHRoZSBkcm9wZG93biBpcyBvcGVuIG9yIG5vdC5cbiAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gZG93bnNoaWZ0RWxlbWVudFJlZnMgRG93bnNoaWZ0IGVsZW1lbnQgcmVmcyB0byB0cmFjayBtb3ZlbWVudCAodG9nZ2xlQnV0dG9uLCBtZW51IGV0Yy4pXG4gKiBAcGFyYW0ge09iamVjdH0gZW52aXJvbm1lbnQgRW52aXJvbm1lbnQgd2hlcmUgY29tcG9uZW50L2hvb2sgZXhpc3RzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlQmx1ciBIYW5kbGVyIG9uIGJsdXIgZnJvbSBtb3VzZSBvciB0b3VjaC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlZiBjb250YWluaW5nIHdoZXRoZXIgbW91c2VEb3duIG9yIHRvdWNoTW92ZSBldmVudCBpcyBoYXBwZW5pbmdcbiAqL1xuZnVuY3Rpb24gdXNlTW91c2VBbmRUb3VjaFRyYWNrZXIoaXNPcGVuLCBkb3duc2hpZnRFbGVtZW50UmVmcywgZW52aXJvbm1lbnQsIGhhbmRsZUJsdXIpIHtcbiAgdmFyIG1vdXNlQW5kVG91Y2hUcmFja2Vyc1JlZiA9IHVzZVJlZih7XG4gICAgaXNNb3VzZURvd246IGZhbHNlLFxuICAgIGlzVG91Y2hNb3ZlOiBmYWxzZVxuICB9KTtcbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoKGVudmlyb25tZW50ID09IG51bGwgPyB2b2lkIDAgOiBlbnZpcm9ubWVudC5hZGRFdmVudExpc3RlbmVyKSA9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVGhlIHNhbWUgc3RyYXRlZ3kgZm9yIGNoZWNraW5nIGlmIGEgY2xpY2sgb2NjdXJyZWQgaW5zaWRlIG9yIG91dHNpZGUgZG93bnNoaWZ0XG4gICAgLy8gYXMgaW4gZG93bnNoaWZ0LmpzLlxuICAgIHZhciBvbk1vdXNlRG93biA9IGZ1bmN0aW9uIG9uTW91c2VEb3duKCkge1xuICAgICAgbW91c2VBbmRUb3VjaFRyYWNrZXJzUmVmLmN1cnJlbnQuaXNNb3VzZURvd24gPSB0cnVlO1xuICAgIH07XG4gICAgdmFyIG9uTW91c2VVcCA9IGZ1bmN0aW9uIG9uTW91c2VVcChldmVudCkge1xuICAgICAgbW91c2VBbmRUb3VjaFRyYWNrZXJzUmVmLmN1cnJlbnQuaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgICAgIGlmIChpc09wZW4gJiYgIXRhcmdldFdpdGhpbkRvd25zaGlmdChldmVudC50YXJnZXQsIGRvd25zaGlmdEVsZW1lbnRSZWZzLm1hcChmdW5jdGlvbiAocmVmKSB7XG4gICAgICAgIHJldHVybiByZWYuY3VycmVudDtcbiAgICAgIH0pLCBlbnZpcm9ubWVudCkpIHtcbiAgICAgICAgaGFuZGxlQmx1cigpO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIG9uVG91Y2hTdGFydCA9IGZ1bmN0aW9uIG9uVG91Y2hTdGFydCgpIHtcbiAgICAgIG1vdXNlQW5kVG91Y2hUcmFja2Vyc1JlZi5jdXJyZW50LmlzVG91Y2hNb3ZlID0gZmFsc2U7XG4gICAgfTtcbiAgICB2YXIgb25Ub3VjaE1vdmUgPSBmdW5jdGlvbiBvblRvdWNoTW92ZSgpIHtcbiAgICAgIG1vdXNlQW5kVG91Y2hUcmFja2Vyc1JlZi5jdXJyZW50LmlzVG91Y2hNb3ZlID0gdHJ1ZTtcbiAgICB9O1xuICAgIHZhciBvblRvdWNoRW5kID0gZnVuY3Rpb24gb25Ub3VjaEVuZChldmVudCkge1xuICAgICAgaWYgKGlzT3BlbiAmJiAhbW91c2VBbmRUb3VjaFRyYWNrZXJzUmVmLmN1cnJlbnQuaXNUb3VjaE1vdmUgJiYgIXRhcmdldFdpdGhpbkRvd25zaGlmdChldmVudC50YXJnZXQsIGRvd25zaGlmdEVsZW1lbnRSZWZzLm1hcChmdW5jdGlvbiAocmVmKSB7XG4gICAgICAgIHJldHVybiByZWYuY3VycmVudDtcbiAgICAgIH0pLCBlbnZpcm9ubWVudCwgZmFsc2UpKSB7XG4gICAgICAgIGhhbmRsZUJsdXIoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGVudmlyb25tZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duKTtcbiAgICBlbnZpcm9ubWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZVVwKTtcbiAgICBlbnZpcm9ubWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25Ub3VjaFN0YXJ0KTtcbiAgICBlbnZpcm9ubWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvblRvdWNoTW92ZSk7XG4gICAgZW52aXJvbm1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoRW5kKTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICAgIHJldHVybiBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgICAgZW52aXJvbm1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Nb3VzZURvd24pO1xuICAgICAgZW52aXJvbm1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XG4gICAgICBlbnZpcm9ubWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25Ub3VjaFN0YXJ0KTtcbiAgICAgIGVudmlyb25tZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uVG91Y2hNb3ZlKTtcbiAgICAgIGVudmlyb25tZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCk7XG4gICAgfTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gIH0sIFtpc09wZW4sIGVudmlyb25tZW50XSk7XG4gIHJldHVybiBtb3VzZUFuZFRvdWNoVHJhY2tlcnNSZWY7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLW11dGFibGUtZXhwb3J0c1xudmFyIHVzZUdldHRlclByb3BzQ2FsbGVkQ2hlY2tlciA9IGZ1bmN0aW9uIHVzZUdldHRlclByb3BzQ2FsbGVkQ2hlY2tlcigpIHtcbiAgcmV0dXJuIG5vb3A7XG59O1xuLyoqXG4gKiBDdXN0b20gaG9vayB0aGF0IGNoZWNrcyBpZiBnZXR0ZXIgcHJvcHMgYXJlIGNhbGxlZCBjb3JyZWN0bHkuXG4gKlxuICogQHBhcmFtICB7Li4uYW55fSBwcm9wS2V5cyBHZXR0ZXIgcHJvcCBuYW1lcyB0byBiZSBoYW5kbGVkLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBTZXR0ZXIgZnVuY3Rpb24gY2FsbGVkIGluc2lkZSBnZXR0ZXIgcHJvcHMgdG8gc2V0IGNhbGwgaW5mb3JtYXRpb24uXG4gKi9cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB1c2VHZXR0ZXJQcm9wc0NhbGxlZENoZWNrZXIgPSBmdW5jdGlvbiB1c2VHZXR0ZXJQcm9wc0NhbGxlZENoZWNrZXIoKSB7XG4gICAgdmFyIGlzSW5pdGlhbE1vdW50UmVmID0gdXNlUmVmKHRydWUpO1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBwcm9wS2V5cyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIHByb3BLZXlzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cbiAgICB2YXIgZ2V0dGVyUHJvcHNDYWxsZWRSZWYgPSB1c2VSZWYocHJvcEtleXMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHByb3BLZXkpIHtcbiAgICAgIGFjY1twcm9wS2V5XSA9IHt9O1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSkpO1xuICAgIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgICBPYmplY3Qua2V5cyhnZXR0ZXJQcm9wc0NhbGxlZFJlZi5jdXJyZW50KS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wS2V5KSB7XG4gICAgICAgIHZhciBwcm9wQ2FsbEluZm8gPSBnZXR0ZXJQcm9wc0NhbGxlZFJlZi5jdXJyZW50W3Byb3BLZXldO1xuICAgICAgICBpZiAoaXNJbml0aWFsTW91bnRSZWYuY3VycmVudCkge1xuICAgICAgICAgIGlmICghT2JqZWN0LmtleXMocHJvcENhbGxJbmZvKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZG93bnNoaWZ0OiBZb3UgZm9yZ290IHRvIGNhbGwgdGhlIFwiICsgcHJvcEtleSArIFwiIGdldHRlciBmdW5jdGlvbiBvbiB5b3VyIGNvbXBvbmVudCAvIGVsZW1lbnQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgc3VwcHJlc3NSZWZFcnJvciA9IHByb3BDYWxsSW5mby5zdXBwcmVzc1JlZkVycm9yLFxuICAgICAgICAgIHJlZktleSA9IHByb3BDYWxsSW5mby5yZWZLZXksXG4gICAgICAgICAgZWxlbWVudFJlZiA9IHByb3BDYWxsSW5mby5lbGVtZW50UmVmO1xuICAgICAgICBpZiAoKCFlbGVtZW50UmVmIHx8ICFlbGVtZW50UmVmLmN1cnJlbnQpICYmICFzdXBwcmVzc1JlZkVycm9yKSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZG93bnNoaWZ0OiBUaGUgcmVmIHByb3AgXFxcIlwiICsgcmVmS2V5ICsgXCJcXFwiIGZyb20gXCIgKyBwcm9wS2V5ICsgXCIgd2FzIG5vdCBhcHBsaWVkIGNvcnJlY3RseSBvbiB5b3VyIGVsZW1lbnQuXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQgPSBmYWxzZTtcbiAgICB9KTtcbiAgICB2YXIgc2V0R2V0dGVyUHJvcENhbGxJbmZvID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKHByb3BLZXksIHN1cHByZXNzUmVmRXJyb3IsIHJlZktleSwgZWxlbWVudFJlZikge1xuICAgICAgZ2V0dGVyUHJvcHNDYWxsZWRSZWYuY3VycmVudFtwcm9wS2V5XSA9IHtcbiAgICAgICAgc3VwcHJlc3NSZWZFcnJvcjogc3VwcHJlc3NSZWZFcnJvcixcbiAgICAgICAgcmVmS2V5OiByZWZLZXksXG4gICAgICAgIGVsZW1lbnRSZWY6IGVsZW1lbnRSZWZcbiAgICAgIH07XG4gICAgfSwgW10pO1xuICAgIHJldHVybiBzZXRHZXR0ZXJQcm9wQ2FsbEluZm87XG4gIH07XG59XG5mdW5jdGlvbiB1c2VBMTF5TWVzc2FnZVNldHRlcihnZXRBMTF5TWVzc2FnZSwgZGVwZW5kZW5jeUFycmF5LCBfcmVmMikge1xuICB2YXIgaXNJbml0aWFsTW91bnQgPSBfcmVmMi5pc0luaXRpYWxNb3VudCxcbiAgICBoaWdobGlnaHRlZEluZGV4ID0gX3JlZjIuaGlnaGxpZ2h0ZWRJbmRleCxcbiAgICBpdGVtcyA9IF9yZWYyLml0ZW1zLFxuICAgIGVudmlyb25tZW50ID0gX3JlZjIuZW52aXJvbm1lbnQsXG4gICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWYyLCBfZXhjbHVkZWQkMyk7XG4gIC8vIFNldHMgYTExeSBzdGF0dXMgbWVzc2FnZSBvbiBjaGFuZ2VzIGluIHN0YXRlLlxuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlmIChpc0luaXRpYWxNb3VudCB8fCBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1cGRhdGVBMTF5U3RhdHVzKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBnZXRBMTF5TWVzc2FnZShfZXh0ZW5kcyh7XG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGhpZ2hsaWdodGVkSW5kZXgsXG4gICAgICAgIGhpZ2hsaWdodGVkSXRlbTogaXRlbXNbaGlnaGxpZ2h0ZWRJbmRleF0sXG4gICAgICAgIHJlc3VsdENvdW50OiBpdGVtcy5sZW5ndGhcbiAgICAgIH0sIHJlc3QpKTtcbiAgICB9LCBlbnZpcm9ubWVudC5kb2N1bWVudCk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICB9LCBkZXBlbmRlbmN5QXJyYXkpO1xufVxuZnVuY3Rpb24gdXNlU2Nyb2xsSW50b1ZpZXcoX3JlZjMpIHtcbiAgdmFyIGhpZ2hsaWdodGVkSW5kZXggPSBfcmVmMy5oaWdobGlnaHRlZEluZGV4LFxuICAgIGlzT3BlbiA9IF9yZWYzLmlzT3BlbixcbiAgICBpdGVtUmVmcyA9IF9yZWYzLml0ZW1SZWZzLFxuICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4ID0gX3JlZjMuZ2V0SXRlbU5vZGVGcm9tSW5kZXgsXG4gICAgbWVudUVsZW1lbnQgPSBfcmVmMy5tZW51RWxlbWVudCxcbiAgICBzY3JvbGxJbnRvVmlld1Byb3AgPSBfcmVmMy5zY3JvbGxJbnRvVmlldztcbiAgLy8gdXNlZCBub3QgdG8gc2Nyb2xsIG9uIGhpZ2hsaWdodCBieSBtb3VzZS5cbiAgdmFyIHNob3VsZFNjcm9sbFJlZiA9IHVzZVJlZih0cnVlKTtcbiAgLy8gU2Nyb2xsIG9uIGhpZ2hsaWdodGVkIGl0ZW0gaWYgY2hhbmdlIGNvbWVzIGZyb20ga2V5Ym9hcmQuXG4gIHVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlmIChoaWdobGlnaHRlZEluZGV4IDwgMCB8fCAhaXNPcGVuIHx8ICFPYmplY3Qua2V5cyhpdGVtUmVmcy5jdXJyZW50KS5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHNob3VsZFNjcm9sbFJlZi5jdXJyZW50ID09PSBmYWxzZSkge1xuICAgICAgc2hvdWxkU2Nyb2xsUmVmLmN1cnJlbnQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzY3JvbGxJbnRvVmlld1Byb3AoZ2V0SXRlbU5vZGVGcm9tSW5kZXgoaGlnaGxpZ2h0ZWRJbmRleCksIG1lbnVFbGVtZW50KTtcbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICB9LCBbaGlnaGxpZ2h0ZWRJbmRleF0pO1xuICByZXR1cm4gc2hvdWxkU2Nyb2xsUmVmO1xufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLW11dGFibGUtZXhwb3J0c1xudmFyIHVzZUNvbnRyb2xQcm9wc1ZhbGlkYXRvciA9IG5vb3A7XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdXNlQ29udHJvbFByb3BzVmFsaWRhdG9yID0gZnVuY3Rpb24gdXNlQ29udHJvbFByb3BzVmFsaWRhdG9yKF9yZWY0KSB7XG4gICAgdmFyIGlzSW5pdGlhbE1vdW50ID0gX3JlZjQuaXNJbml0aWFsTW91bnQsXG4gICAgICBwcm9wcyA9IF9yZWY0LnByb3BzLFxuICAgICAgc3RhdGUgPSBfcmVmNC5zdGF0ZTtcbiAgICAvLyB1c2VkIGZvciBjaGVja2luZyB3aGVuIHByb3BzIGFyZSBtb3ZpbmcgZnJvbSBjb250cm9sbGVkIHRvIHVuY29udHJvbGxlZC5cbiAgICB2YXIgcHJldlByb3BzUmVmID0gdXNlUmVmKHByb3BzKTtcbiAgICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGlzSW5pdGlhbE1vdW50KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhbGlkYXRlQ29udHJvbGxlZFVuY2hhbmdlZChzdGF0ZSwgcHJldlByb3BzUmVmLmN1cnJlbnQsIHByb3BzKTtcbiAgICAgIHByZXZQcm9wc1JlZi5jdXJyZW50ID0gcHJvcHM7XG4gICAgfSwgW3N0YXRlLCBwcm9wcywgaXNJbml0aWFsTW91bnRdKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBIYW5kbGVzIHNlbGVjdGlvbiBvbiBFbnRlciAvIEFsdCArIEFycm93VXAuIENsb3NlcyB0aGUgbWVudSBhbmQgcmVzZXRzIHRoZSBoaWdobGlnaHRlZCBpbmRleCwgdW5sZXNzIHRoZXJlIGlzIGEgaGlnaGxpZ2h0ZWQuXG4gKiBJbiB0aGF0IGNhc2UsIHNlbGVjdHMgdGhlIGl0ZW0gYW5kIHJlc2V0cyB0byBkZWZhdWx0cyBmb3Igb3BlbiBzdGF0ZSBhbmQgaGlnaGxpZ2h0ZWQgaWRleC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBUaGUgdXNlQ29tYm9ib3ggcHJvcHMuXG4gKiBAcGFyYW0ge251bWJlcn0gaGlnaGxpZ2h0ZWRJbmRleCBUaGUgaW5kZXggZnJvbSB0aGUgc3RhdGUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlucHV0VmFsdWUgQWxzbyByZXR1cm4gdGhlIGlucHV0IHZhbHVlIGZvciBzdGF0ZS5cbiAqIEByZXR1cm5zIFRoZSBjaGFuZ2VzIGZvciB0aGUgc3RhdGUuXG4gKi9cbmZ1bmN0aW9uIGdldENoYW5nZXNPblNlbGVjdGlvbihwcm9wcywgaGlnaGxpZ2h0ZWRJbmRleCwgaW5wdXRWYWx1ZSkge1xuICB2YXIgX3Byb3BzJGl0ZW1zO1xuICBpZiAoaW5wdXRWYWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgaW5wdXRWYWx1ZSA9IHRydWU7XG4gIH1cbiAgdmFyIHNob3VsZFNlbGVjdCA9ICgoX3Byb3BzJGl0ZW1zID0gcHJvcHMuaXRlbXMpID09IG51bGwgPyB2b2lkIDAgOiBfcHJvcHMkaXRlbXMubGVuZ3RoKSAmJiBoaWdobGlnaHRlZEluZGV4ID49IDA7XG4gIHJldHVybiBfZXh0ZW5kcyh7XG4gICAgaXNPcGVuOiBmYWxzZSxcbiAgICBoaWdobGlnaHRlZEluZGV4OiAtMVxuICB9LCBzaG91bGRTZWxlY3QgJiYgX2V4dGVuZHMoe1xuICAgIHNlbGVjdGVkSXRlbTogcHJvcHMuaXRlbXNbaGlnaGxpZ2h0ZWRJbmRleF0sXG4gICAgaXNPcGVuOiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgJ2lzT3BlbicpLFxuICAgIGhpZ2hsaWdodGVkSW5kZXg6IGdldERlZmF1bHRWYWx1ZSQxKHByb3BzLCAnaGlnaGxpZ2h0ZWRJbmRleCcpXG4gIH0sIGlucHV0VmFsdWUgJiYge1xuICAgIGlucHV0VmFsdWU6IHByb3BzLml0ZW1Ub1N0cmluZyhwcm9wcy5pdGVtc1toaWdobGlnaHRlZEluZGV4XSlcbiAgfSkpO1xufVxuXG5mdW5jdGlvbiBkb3duc2hpZnRDb21tb25SZWR1Y2VyKHN0YXRlLCBhY3Rpb24sIHN0YXRlQ2hhbmdlVHlwZXMpIHtcbiAgdmFyIHR5cGUgPSBhY3Rpb24udHlwZSxcbiAgICBwcm9wcyA9IGFjdGlvbi5wcm9wcztcbiAgdmFyIGNoYW5nZXM7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2Ugc3RhdGVDaGFuZ2VUeXBlcy5JdGVtTW91c2VNb3ZlOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogYWN0aW9uLmRpc2FibGVkID8gLTEgOiBhY3Rpb24uaW5kZXhcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIHN0YXRlQ2hhbmdlVHlwZXMuTWVudU1vdXNlTGVhdmU6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiAtMVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2Ugc3RhdGVDaGFuZ2VUeXBlcy5Ub2dnbGVCdXR0b25DbGljazpcbiAgICBjYXNlIHN0YXRlQ2hhbmdlVHlwZXMuRnVuY3Rpb25Ub2dnbGVNZW51OlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaXNPcGVuOiAhc3RhdGUuaXNPcGVuLFxuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBzdGF0ZS5pc09wZW4gPyAtMSA6IGdldEhpZ2hsaWdodGVkSW5kZXhPbk9wZW4ocHJvcHMsIHN0YXRlLCAwKVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2Ugc3RhdGVDaGFuZ2VUeXBlcy5GdW5jdGlvbk9wZW5NZW51OlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaXNPcGVuOiB0cnVlLFxuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBnZXRIaWdobGlnaHRlZEluZGV4T25PcGVuKHByb3BzLCBzdGF0ZSwgMClcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIHN0YXRlQ2hhbmdlVHlwZXMuRnVuY3Rpb25DbG9zZU1lbnU6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBpc09wZW46IGZhbHNlXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBzdGF0ZUNoYW5nZVR5cGVzLkZ1bmN0aW9uU2V0SGlnaGxpZ2h0ZWRJbmRleDpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGFjdGlvbi5oaWdobGlnaHRlZEluZGV4XG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBzdGF0ZUNoYW5nZVR5cGVzLkZ1bmN0aW9uU2V0SW5wdXRWYWx1ZTpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGlucHV0VmFsdWU6IGFjdGlvbi5pbnB1dFZhbHVlXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBzdGF0ZUNoYW5nZVR5cGVzLkZ1bmN0aW9uUmVzZXQ6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgJ2hpZ2hsaWdodGVkSW5kZXgnKSxcbiAgICAgICAgaXNPcGVuOiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgJ2lzT3BlbicpLFxuICAgICAgICBzZWxlY3RlZEl0ZW06IGdldERlZmF1bHRWYWx1ZSQxKHByb3BzLCAnc2VsZWN0ZWRJdGVtJyksXG4gICAgICAgIGlucHV0VmFsdWU6IGdldERlZmF1bHRWYWx1ZSQxKHByb3BzLCAnaW5wdXRWYWx1ZScpXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVkdWNlciBjYWxsZWQgd2l0aG91dCBwcm9wZXIgYWN0aW9uIHR5cGUuJyk7XG4gIH1cbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwgY2hhbmdlcyk7XG59XG4vKiBlc2xpbnQtZW5hYmxlIGNvbXBsZXhpdHkgKi9cblxuZnVuY3Rpb24gZ2V0SXRlbUluZGV4QnlDaGFyYWN0ZXJLZXkoX2EpIHtcbiAgICB2YXIga2V5c1NvRmFyID0gX2Eua2V5c1NvRmFyLCBoaWdobGlnaHRlZEluZGV4ID0gX2EuaGlnaGxpZ2h0ZWRJbmRleCwgaXRlbXMgPSBfYS5pdGVtcywgaXRlbVRvU3RyaW5nID0gX2EuaXRlbVRvU3RyaW5nLCBnZXRJdGVtTm9kZUZyb21JbmRleCA9IF9hLmdldEl0ZW1Ob2RlRnJvbUluZGV4O1xuICAgIHZhciBsb3dlckNhc2VkS2V5c1NvRmFyID0ga2V5c1NvRmFyLnRvTG93ZXJDYXNlKCk7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGl0ZW1zLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAvLyBpZiB3ZSBhbHJlYWR5IGhhdmUgYSBzZWFyY2ggcXVlcnkgaW4gcHJvZ3Jlc3MsIHdlIGFsc28gY29uc2lkZXIgdGhlIGN1cnJlbnQgaGlnaGxpZ2h0ZWQgaXRlbS5cbiAgICAgICAgdmFyIG9mZnNldEluZGV4ID0gKGluZGV4ICsgaGlnaGxpZ2h0ZWRJbmRleCArIChrZXlzU29GYXIubGVuZ3RoIDwgMiA/IDEgOiAwKSkgJSBpdGVtcy5sZW5ndGg7XG4gICAgICAgIHZhciBpdGVtID0gaXRlbXNbb2Zmc2V0SW5kZXhdO1xuICAgICAgICBpZiAoaXRlbSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICBpdGVtVG9TdHJpbmcoaXRlbSkudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKGxvd2VyQ2FzZWRLZXlzU29GYXIpKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGdldEl0ZW1Ob2RlRnJvbUluZGV4KG9mZnNldEluZGV4KTtcbiAgICAgICAgICAgIGlmICghKGVsZW1lbnQgPT09IG51bGwgfHwgZWxlbWVudCA9PT0gdm9pZCAwID8gdm9pZCAwIDogZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9mZnNldEluZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoaWdobGlnaHRlZEluZGV4O1xufVxudmFyIHByb3BUeXBlcyQyID0ge1xuICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICBpdGVtVG9TdHJpbmc6IFByb3BUeXBlcy5mdW5jLFxuICAgIGdldEExMXlTdGF0dXNNZXNzYWdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBnZXRBMTF5U2VsZWN0aW9uTWVzc2FnZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgaGlnaGxpZ2h0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBkZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBpbml0aWFsSGlnaGxpZ2h0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBpc09wZW46IFByb3BUeXBlcy5ib29sLFxuICAgIGRlZmF1bHRJc09wZW46IFByb3BUeXBlcy5ib29sLFxuICAgIGluaXRpYWxJc09wZW46IFByb3BUeXBlcy5ib29sLFxuICAgIHNlbGVjdGVkSXRlbTogUHJvcFR5cGVzLmFueSxcbiAgICBpbml0aWFsU2VsZWN0ZWRJdGVtOiBQcm9wVHlwZXMuYW55LFxuICAgIGRlZmF1bHRTZWxlY3RlZEl0ZW06IFByb3BUeXBlcy5hbnksXG4gICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbGFiZWxJZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBtZW51SWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgZ2V0SXRlbUlkOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB0b2dnbGVCdXR0b25JZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBzdGF0ZVJlZHVjZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uU2VsZWN0ZWRJdGVtQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkhpZ2hsaWdodGVkSW5kZXhDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uU3RhdGVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uSXNPcGVuQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBlbnZpcm9ubWVudDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBkb2N1bWVudDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICAgIGdldEVsZW1lbnRCeUlkOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgICAgIGFjdGl2ZUVsZW1lbnQ6IFByb3BUeXBlcy5hbnksXG4gICAgICAgICAgICBib2R5OiBQcm9wVHlwZXMuYW55XG4gICAgICAgIH0pXG4gICAgfSlcbn07XG4vKipcbiAqIERlZmF1bHQgaW1wbGVtZW50YXRpb24gZm9yIHN0YXR1cyBtZXNzYWdlLiBPbmx5IGFkZGVkIHdoZW4gbWVudSBpcyBvcGVuLlxuICogV2lsbCBzcGVjaWZ0IGlmIHRoZXJlIGFyZSByZXN1bHRzIGluIHRoZSBsaXN0LCBhbmQgaWYgc28sIGhvdyBtYW55LFxuICogYW5kIHdoYXQga2V5cyBhcmUgcmVsZXZhbnQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtIHRoZSBkb3duc2hpZnQgc3RhdGUgYW5kIG90aGVyIHJlbGV2YW50IHByb3BlcnRpZXNcbiAqIEByZXR1cm4ge1N0cmluZ30gdGhlIGExMXkgc3RhdHVzIG1lc3NhZ2VcbiAqL1xuZnVuY3Rpb24gZ2V0QTExeVN0YXR1c01lc3NhZ2UoX2EpIHtcbiAgICB2YXIgaXNPcGVuID0gX2EuaXNPcGVuLCByZXN1bHRDb3VudCA9IF9hLnJlc3VsdENvdW50LCBwcmV2aW91c1Jlc3VsdENvdW50ID0gX2EucHJldmlvdXNSZXN1bHRDb3VudDtcbiAgICBpZiAoIWlzT3Blbikge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmICghcmVzdWx0Q291bnQpIHtcbiAgICAgICAgcmV0dXJuICdObyByZXN1bHRzIGFyZSBhdmFpbGFibGUuJztcbiAgICB9XG4gICAgaWYgKHJlc3VsdENvdW50ICE9PSBwcmV2aW91c1Jlc3VsdENvdW50KSB7XG4gICAgICAgIHJldHVybiBcIlwiLmNvbmNhdChyZXN1bHRDb3VudCwgXCIgcmVzdWx0XCIpLmNvbmNhdChyZXN1bHRDb3VudCA9PT0gMSA/ICcgaXMnIDogJ3MgYXJlJywgXCIgYXZhaWxhYmxlLCB1c2UgdXAgYW5kIGRvd24gYXJyb3cga2V5cyB0byBuYXZpZ2F0ZS4gUHJlc3MgRW50ZXIgb3IgU3BhY2UgQmFyIGtleXMgdG8gc2VsZWN0LlwiKTtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxudmFyIGRlZmF1bHRQcm9wcyQyID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGRlZmF1bHRQcm9wcyQzKSwgeyBnZXRBMTF5U3RhdHVzTWVzc2FnZTogZ2V0QTExeVN0YXR1c01lc3NhZ2UgfSk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLW11dGFibGUtZXhwb3J0c1xudmFyIHZhbGlkYXRlUHJvcFR5cGVzJDIgPSBub29wO1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgdmFsaWRhdGVQcm9wVHlwZXMkMiA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsZXIpIHtcbiAgICAgICAgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKHByb3BUeXBlcyQyLCBvcHRpb25zLCAncHJvcCcsIGNhbGxlci5uYW1lKTtcbiAgICB9O1xufVxuXG52YXIgVG9nZ2xlQnV0dG9uQ2xpY2skMSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3RvZ2dsZWJ1dHRvbl9jbGlja19fJyA6IDA7XG52YXIgVG9nZ2xlQnV0dG9uS2V5RG93bkFycm93RG93biA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3RvZ2dsZWJ1dHRvbl9rZXlkb3duX2Fycm93X2Rvd25fXycgOiAxO1xudmFyIFRvZ2dsZUJ1dHRvbktleURvd25BcnJvd1VwID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fdG9nZ2xlYnV0dG9uX2tleWRvd25fYXJyb3dfdXBfXycgOiAyO1xudmFyIFRvZ2dsZUJ1dHRvbktleURvd25DaGFyYWN0ZXIgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX190b2dnbGVidXR0b25fa2V5ZG93bl9jaGFyYWN0ZXJfXycgOiAzO1xudmFyIFRvZ2dsZUJ1dHRvbktleURvd25Fc2NhcGUgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX190b2dnbGVidXR0b25fa2V5ZG93bl9lc2NhcGVfXycgOiA0O1xudmFyIFRvZ2dsZUJ1dHRvbktleURvd25Ib21lID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fdG9nZ2xlYnV0dG9uX2tleWRvd25faG9tZV9fJyA6IDU7XG52YXIgVG9nZ2xlQnV0dG9uS2V5RG93bkVuZCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3RvZ2dsZWJ1dHRvbl9rZXlkb3duX2VuZF9fJyA6IDY7XG52YXIgVG9nZ2xlQnV0dG9uS2V5RG93bkVudGVyID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fdG9nZ2xlYnV0dG9uX2tleWRvd25fZW50ZXJfXycgOiA3O1xudmFyIFRvZ2dsZUJ1dHRvbktleURvd25TcGFjZUJ1dHRvbiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3RvZ2dsZWJ1dHRvbl9rZXlkb3duX3NwYWNlX2J1dHRvbl9fJyA6IDg7XG52YXIgVG9nZ2xlQnV0dG9uS2V5RG93blBhZ2VVcCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3RvZ2dsZWJ1dHRvbl9rZXlkb3duX3BhZ2VfdXBfXycgOiA5O1xudmFyIFRvZ2dsZUJ1dHRvbktleURvd25QYWdlRG93biA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3RvZ2dsZWJ1dHRvbl9rZXlkb3duX3BhZ2VfZG93bl9fJyA6IDEwO1xudmFyIFRvZ2dsZUJ1dHRvbkJsdXIgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX190b2dnbGVidXR0b25fYmx1cl9fJyA6IDExO1xudmFyIE1lbnVNb3VzZUxlYXZlJDEgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19tZW51X21vdXNlX2xlYXZlX18nIDogMTI7XG52YXIgSXRlbU1vdXNlTW92ZSQxID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19faXRlbV9tb3VzZV9tb3ZlX18nIDogMTM7XG52YXIgSXRlbUNsaWNrJDEgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19pdGVtX2NsaWNrX18nIDogMTQ7XG52YXIgRnVuY3Rpb25Ub2dnbGVNZW51JDEgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl90b2dnbGVfbWVudV9fJyA6IDE1O1xudmFyIEZ1bmN0aW9uT3Blbk1lbnUkMSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2Z1bmN0aW9uX29wZW5fbWVudV9fJyA6IDE2O1xudmFyIEZ1bmN0aW9uQ2xvc2VNZW51JDEgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9jbG9zZV9tZW51X18nIDogMTc7XG52YXIgRnVuY3Rpb25TZXRIaWdobGlnaHRlZEluZGV4JDEgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9zZXRfaGlnaGxpZ2h0ZWRfaW5kZXhfXycgOiAxODtcbnZhciBGdW5jdGlvblNlbGVjdEl0ZW0kMSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2Z1bmN0aW9uX3NlbGVjdF9pdGVtX18nIDogMTk7XG52YXIgRnVuY3Rpb25TZXRJbnB1dFZhbHVlJDEgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9zZXRfaW5wdXRfdmFsdWVfXycgOiAyMDtcbnZhciBGdW5jdGlvblJlc2V0JDIgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9yZXNldF9fJyA6IDIxO1xuXG52YXIgc3RhdGVDaGFuZ2VUeXBlcyQyID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICBfX3Byb3RvX186IG51bGwsXG4gIFRvZ2dsZUJ1dHRvbkNsaWNrOiBUb2dnbGVCdXR0b25DbGljayQxLFxuICBUb2dnbGVCdXR0b25LZXlEb3duQXJyb3dEb3duOiBUb2dnbGVCdXR0b25LZXlEb3duQXJyb3dEb3duLFxuICBUb2dnbGVCdXR0b25LZXlEb3duQXJyb3dVcDogVG9nZ2xlQnV0dG9uS2V5RG93bkFycm93VXAsXG4gIFRvZ2dsZUJ1dHRvbktleURvd25DaGFyYWN0ZXI6IFRvZ2dsZUJ1dHRvbktleURvd25DaGFyYWN0ZXIsXG4gIFRvZ2dsZUJ1dHRvbktleURvd25Fc2NhcGU6IFRvZ2dsZUJ1dHRvbktleURvd25Fc2NhcGUsXG4gIFRvZ2dsZUJ1dHRvbktleURvd25Ib21lOiBUb2dnbGVCdXR0b25LZXlEb3duSG9tZSxcbiAgVG9nZ2xlQnV0dG9uS2V5RG93bkVuZDogVG9nZ2xlQnV0dG9uS2V5RG93bkVuZCxcbiAgVG9nZ2xlQnV0dG9uS2V5RG93bkVudGVyOiBUb2dnbGVCdXR0b25LZXlEb3duRW50ZXIsXG4gIFRvZ2dsZUJ1dHRvbktleURvd25TcGFjZUJ1dHRvbjogVG9nZ2xlQnV0dG9uS2V5RG93blNwYWNlQnV0dG9uLFxuICBUb2dnbGVCdXR0b25LZXlEb3duUGFnZVVwOiBUb2dnbGVCdXR0b25LZXlEb3duUGFnZVVwLFxuICBUb2dnbGVCdXR0b25LZXlEb3duUGFnZURvd246IFRvZ2dsZUJ1dHRvbktleURvd25QYWdlRG93bixcbiAgVG9nZ2xlQnV0dG9uQmx1cjogVG9nZ2xlQnV0dG9uQmx1cixcbiAgTWVudU1vdXNlTGVhdmU6IE1lbnVNb3VzZUxlYXZlJDEsXG4gIEl0ZW1Nb3VzZU1vdmU6IEl0ZW1Nb3VzZU1vdmUkMSxcbiAgSXRlbUNsaWNrOiBJdGVtQ2xpY2skMSxcbiAgRnVuY3Rpb25Ub2dnbGVNZW51OiBGdW5jdGlvblRvZ2dsZU1lbnUkMSxcbiAgRnVuY3Rpb25PcGVuTWVudTogRnVuY3Rpb25PcGVuTWVudSQxLFxuICBGdW5jdGlvbkNsb3NlTWVudTogRnVuY3Rpb25DbG9zZU1lbnUkMSxcbiAgRnVuY3Rpb25TZXRIaWdobGlnaHRlZEluZGV4OiBGdW5jdGlvblNldEhpZ2hsaWdodGVkSW5kZXgkMSxcbiAgRnVuY3Rpb25TZWxlY3RJdGVtOiBGdW5jdGlvblNlbGVjdEl0ZW0kMSxcbiAgRnVuY3Rpb25TZXRJbnB1dFZhbHVlOiBGdW5jdGlvblNldElucHV0VmFsdWUkMSxcbiAgRnVuY3Rpb25SZXNldDogRnVuY3Rpb25SZXNldCQyXG59KTtcblxuLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSAqL1xuZnVuY3Rpb24gZG93bnNoaWZ0U2VsZWN0UmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIHZhciBfcHJvcHMkaXRlbXM7XG4gIHZhciB0eXBlID0gYWN0aW9uLnR5cGUsXG4gICAgcHJvcHMgPSBhY3Rpb24ucHJvcHMsXG4gICAgYWx0S2V5ID0gYWN0aW9uLmFsdEtleTtcbiAgdmFyIGNoYW5nZXM7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgSXRlbUNsaWNrJDE6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBpc09wZW46IGdldERlZmF1bHRWYWx1ZSQxKHByb3BzLCAnaXNPcGVuJyksXG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGdldERlZmF1bHRWYWx1ZSQxKHByb3BzLCAnaGlnaGxpZ2h0ZWRJbmRleCcpLFxuICAgICAgICBzZWxlY3RlZEl0ZW06IHByb3BzLml0ZW1zW2FjdGlvbi5pbmRleF1cbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIFRvZ2dsZUJ1dHRvbktleURvd25DaGFyYWN0ZXI6XG4gICAgICB7XG4gICAgICAgIHZhciBsb3dlcmNhc2VkS2V5ID0gYWN0aW9uLmtleTtcbiAgICAgICAgdmFyIGlucHV0VmFsdWUgPSBcIlwiICsgc3RhdGUuaW5wdXRWYWx1ZSArIGxvd2VyY2FzZWRLZXk7XG4gICAgICAgIHZhciBwcmV2SGlnaGxpZ2h0ZWRJbmRleCA9ICFzdGF0ZS5pc09wZW4gJiYgc3RhdGUuc2VsZWN0ZWRJdGVtID8gcHJvcHMuaXRlbXMuaW5kZXhPZihzdGF0ZS5zZWxlY3RlZEl0ZW0pIDogc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleDtcbiAgICAgICAgdmFyIGhpZ2hsaWdodGVkSW5kZXggPSBnZXRJdGVtSW5kZXhCeUNoYXJhY3RlcktleSh7XG4gICAgICAgICAga2V5c1NvRmFyOiBpbnB1dFZhbHVlLFxuICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IHByZXZIaWdobGlnaHRlZEluZGV4LFxuICAgICAgICAgIGl0ZW1zOiBwcm9wcy5pdGVtcyxcbiAgICAgICAgICBpdGVtVG9TdHJpbmc6IHByb3BzLml0ZW1Ub1N0cmluZyxcbiAgICAgICAgICBnZXRJdGVtTm9kZUZyb21JbmRleDogYWN0aW9uLmdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgIH0pO1xuICAgICAgICBjaGFuZ2VzID0ge1xuICAgICAgICAgIGlucHV0VmFsdWU6IGlucHV0VmFsdWUsXG4gICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogaGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgICAgICBpc09wZW46IHRydWVcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgVG9nZ2xlQnV0dG9uS2V5RG93bkFycm93RG93bjpcbiAgICAgIHtcbiAgICAgICAgdmFyIF9oaWdobGlnaHRlZEluZGV4ID0gc3RhdGUuaXNPcGVuID8gZ2V0TmV4dFdyYXBwaW5nSW5kZXgoMSwgc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCwgcHJvcHMuaXRlbXMubGVuZ3RoLCBhY3Rpb24uZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIGZhbHNlKSA6IGFsdEtleSAmJiBzdGF0ZS5zZWxlY3RlZEl0ZW0gPT0gbnVsbCA/IC0xIDogZ2V0SGlnaGxpZ2h0ZWRJbmRleE9uT3Blbihwcm9wcywgc3RhdGUsIDEpO1xuICAgICAgICBjaGFuZ2VzID0ge1xuICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IF9oaWdobGlnaHRlZEluZGV4LFxuICAgICAgICAgIGlzT3BlbjogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBUb2dnbGVCdXR0b25LZXlEb3duQXJyb3dVcDpcbiAgICAgIGlmIChzdGF0ZS5pc09wZW4gJiYgYWx0S2V5KSB7XG4gICAgICAgIGNoYW5nZXMgPSBnZXRDaGFuZ2VzT25TZWxlY3Rpb24ocHJvcHMsIHN0YXRlLmhpZ2hsaWdodGVkSW5kZXgsIGZhbHNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBfaGlnaGxpZ2h0ZWRJbmRleDIgPSBzdGF0ZS5pc09wZW4gPyBnZXROZXh0V3JhcHBpbmdJbmRleCgtMSwgc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCwgcHJvcHMuaXRlbXMubGVuZ3RoLCBhY3Rpb24uZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIGZhbHNlKSA6IGdldEhpZ2hsaWdodGVkSW5kZXhPbk9wZW4ocHJvcHMsIHN0YXRlLCAtMSk7XG4gICAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogX2hpZ2hsaWdodGVkSW5kZXgyLFxuICAgICAgICAgIGlzT3BlbjogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgLy8gb25seSB0cmlnZ2VyZWQgd2hlbiBtZW51IGlzIG9wZW4uXG4gICAgY2FzZSBUb2dnbGVCdXR0b25LZXlEb3duRW50ZXI6XG4gICAgY2FzZSBUb2dnbGVCdXR0b25LZXlEb3duU3BhY2VCdXR0b246XG4gICAgICBjaGFuZ2VzID0gZ2V0Q2hhbmdlc09uU2VsZWN0aW9uKHByb3BzLCBzdGF0ZS5oaWdobGlnaHRlZEluZGV4LCBmYWxzZSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFRvZ2dsZUJ1dHRvbktleURvd25Ib21lOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0TmV4dE5vbkRpc2FibGVkSW5kZXgoMSwgMCwgcHJvcHMuaXRlbXMubGVuZ3RoLCBhY3Rpb24uZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIGZhbHNlKSxcbiAgICAgICAgaXNPcGVuOiB0cnVlXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBUb2dnbGVCdXR0b25LZXlEb3duRW5kOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0TmV4dE5vbkRpc2FibGVkSW5kZXgoLTEsIHByb3BzLml0ZW1zLmxlbmd0aCAtIDEsIHByb3BzLml0ZW1zLmxlbmd0aCwgYWN0aW9uLmdldEl0ZW1Ob2RlRnJvbUluZGV4LCBmYWxzZSksXG4gICAgICAgIGlzT3BlbjogdHJ1ZVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgVG9nZ2xlQnV0dG9uS2V5RG93blBhZ2VVcDpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGdldE5leHRXcmFwcGluZ0luZGV4KC0xMCwgc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCwgcHJvcHMuaXRlbXMubGVuZ3RoLCBhY3Rpb24uZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIGZhbHNlKVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgVG9nZ2xlQnV0dG9uS2V5RG93blBhZ2VEb3duOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0TmV4dFdyYXBwaW5nSW5kZXgoMTAsIHN0YXRlLmhpZ2hsaWdodGVkSW5kZXgsIHByb3BzLml0ZW1zLmxlbmd0aCwgYWN0aW9uLmdldEl0ZW1Ob2RlRnJvbUluZGV4LCBmYWxzZSlcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIFRvZ2dsZUJ1dHRvbktleURvd25Fc2NhcGU6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBpc09wZW46IGZhbHNlLFxuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiAtMVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgVG9nZ2xlQnV0dG9uQmx1cjpcbiAgICAgIGNoYW5nZXMgPSBfZXh0ZW5kcyh7XG4gICAgICAgIGlzT3BlbjogZmFsc2UsXG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IC0xXG4gICAgICB9LCBzdGF0ZS5oaWdobGlnaHRlZEluZGV4ID49IDAgJiYgKChfcHJvcHMkaXRlbXMgPSBwcm9wcy5pdGVtcykgPT0gbnVsbCA/IHZvaWQgMCA6IF9wcm9wcyRpdGVtcy5sZW5ndGgpICYmIHtcbiAgICAgICAgc2VsZWN0ZWRJdGVtOiBwcm9wcy5pdGVtc1tzdGF0ZS5oaWdobGlnaHRlZEluZGV4XVxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIEZ1bmN0aW9uU2VsZWN0SXRlbSQxOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgc2VsZWN0ZWRJdGVtOiBhY3Rpb24uc2VsZWN0ZWRJdGVtXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBkb3duc2hpZnRDb21tb25SZWR1Y2VyKHN0YXRlLCBhY3Rpb24sIHN0YXRlQ2hhbmdlVHlwZXMkMik7XG4gIH1cbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwgY2hhbmdlcyk7XG59XG4vKiBlc2xpbnQtZW5hYmxlIGNvbXBsZXhpdHkgKi9cblxudmFyIF9leGNsdWRlZCQyID0gW1wib25Nb3VzZUxlYXZlXCIsIFwicmVmS2V5XCIsIFwib25LZXlEb3duXCIsIFwib25CbHVyXCIsIFwicmVmXCJdLFxuICBfZXhjbHVkZWQyJDIgPSBbXCJvbkJsdXJcIiwgXCJvbkNsaWNrXCIsIFwib25QcmVzc1wiLCBcIm9uS2V5RG93blwiLCBcInJlZktleVwiLCBcInJlZlwiXSxcbiAgX2V4Y2x1ZGVkMyQxID0gW1wiaXRlbVwiLCBcImluZGV4XCIsIFwib25Nb3VzZU1vdmVcIiwgXCJvbkNsaWNrXCIsIFwib25QcmVzc1wiLCBcInJlZktleVwiLCBcInJlZlwiLCBcImRpc2FibGVkXCJdO1xudXNlU2VsZWN0LnN0YXRlQ2hhbmdlVHlwZXMgPSBzdGF0ZUNoYW5nZVR5cGVzJDI7XG5mdW5jdGlvbiB1c2VTZWxlY3QodXNlclByb3BzKSB7XG4gIGlmICh1c2VyUHJvcHMgPT09IHZvaWQgMCkge1xuICAgIHVzZXJQcm9wcyA9IHt9O1xuICB9XG4gIHZhbGlkYXRlUHJvcFR5cGVzJDIodXNlclByb3BzLCB1c2VTZWxlY3QpO1xuICAvLyBQcm9wcyBkZWZhdWx0cyBhbmQgZGVzdHJ1Y3R1cmluZy5cbiAgdmFyIHByb3BzID0gX2V4dGVuZHMoe30sIGRlZmF1bHRQcm9wcyQyLCB1c2VyUHJvcHMpO1xuICB2YXIgaXRlbXMgPSBwcm9wcy5pdGVtcyxcbiAgICBzY3JvbGxJbnRvVmlldyA9IHByb3BzLnNjcm9sbEludG9WaWV3LFxuICAgIGVudmlyb25tZW50ID0gcHJvcHMuZW52aXJvbm1lbnQsXG4gICAgaXRlbVRvU3RyaW5nID0gcHJvcHMuaXRlbVRvU3RyaW5nLFxuICAgIGdldEExMXlTZWxlY3Rpb25NZXNzYWdlID0gcHJvcHMuZ2V0QTExeVNlbGVjdGlvbk1lc3NhZ2UsXG4gICAgZ2V0QTExeVN0YXR1c01lc3NhZ2UgPSBwcm9wcy5nZXRBMTF5U3RhdHVzTWVzc2FnZTtcbiAgLy8gSW5pdGlhbCBzdGF0ZSBkZXBlbmRpbmcgb24gY29udHJvbGxlZCBwcm9wcy5cbiAgdmFyIGluaXRpYWxTdGF0ZSA9IGdldEluaXRpYWxTdGF0ZSQyKHByb3BzKTtcbiAgdmFyIF91c2VDb250cm9sbGVkUmVkdWNlciA9IHVzZUNvbnRyb2xsZWRSZWR1Y2VyJDEoZG93bnNoaWZ0U2VsZWN0UmVkdWNlciwgaW5pdGlhbFN0YXRlLCBwcm9wcyksXG4gICAgc3RhdGUgPSBfdXNlQ29udHJvbGxlZFJlZHVjZXJbMF0sXG4gICAgZGlzcGF0Y2ggPSBfdXNlQ29udHJvbGxlZFJlZHVjZXJbMV07XG4gIHZhciBpc09wZW4gPSBzdGF0ZS5pc09wZW4sXG4gICAgaGlnaGxpZ2h0ZWRJbmRleCA9IHN0YXRlLmhpZ2hsaWdodGVkSW5kZXgsXG4gICAgc2VsZWN0ZWRJdGVtID0gc3RhdGUuc2VsZWN0ZWRJdGVtLFxuICAgIGlucHV0VmFsdWUgPSBzdGF0ZS5pbnB1dFZhbHVlO1xuXG4gIC8vIEVsZW1lbnQgZWZzLlxuICB2YXIgdG9nZ2xlQnV0dG9uUmVmID0gdXNlUmVmKG51bGwpO1xuICB2YXIgbWVudVJlZiA9IHVzZVJlZihudWxsKTtcbiAgdmFyIGl0ZW1SZWZzID0gdXNlUmVmKHt9KTtcbiAgLy8gdXNlZCB0byBrZWVwIHRoZSBpbnB1dFZhbHVlIGNsZWFyVGltZW91dCBvYmplY3QgYmV0d2VlbiByZW5kZXJzLlxuICB2YXIgY2xlYXJUaW1lb3V0UmVmID0gdXNlUmVmKG51bGwpO1xuICAvLyBwcmV2ZW50IGlkIHJlLWdlbmVyYXRpb24gYmV0d2VlbiByZW5kZXJzLlxuICB2YXIgZWxlbWVudElkcyA9IHVzZUVsZW1lbnRJZHMocHJvcHMpO1xuICAvLyB1c2VkIHRvIGtlZXAgdHJhY2sgb2YgaG93IG1hbnkgaXRlbXMgd2UgaGFkIG9uIHByZXZpb3VzIGN5Y2xlLlxuICB2YXIgcHJldmlvdXNSZXN1bHRDb3VudFJlZiA9IHVzZVJlZigpO1xuICB2YXIgaXNJbml0aWFsTW91bnRSZWYgPSB1c2VSZWYodHJ1ZSk7XG4gIC8vIHV0aWxpdHkgY2FsbGJhY2sgdG8gZ2V0IGl0ZW0gZWxlbWVudC5cbiAgdmFyIGxhdGVzdCA9IHVzZUxhdGVzdFJlZih7XG4gICAgc3RhdGU6IHN0YXRlLFxuICAgIHByb3BzOiBwcm9wc1xuICB9KTtcblxuICAvLyBTb21lIHV0aWxzLlxuICB2YXIgZ2V0SXRlbU5vZGVGcm9tSW5kZXggPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICByZXR1cm4gaXRlbVJlZnMuY3VycmVudFtlbGVtZW50SWRzLmdldEl0ZW1JZChpbmRleCldO1xuICB9LCBbZWxlbWVudElkc10pO1xuXG4gIC8vIEVmZmVjdHMuXG4gIC8vIFNldHMgYTExeSBzdGF0dXMgbWVzc2FnZSBvbiBjaGFuZ2VzIGluIHN0YXRlLlxuICB1c2VBMTF5TWVzc2FnZVNldHRlcihnZXRBMTF5U3RhdHVzTWVzc2FnZSwgW2lzT3BlbiwgaGlnaGxpZ2h0ZWRJbmRleCwgaW5wdXRWYWx1ZSwgaXRlbXNdLCBfZXh0ZW5kcyh7XG4gICAgaXNJbml0aWFsTW91bnQ6IGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQsXG4gICAgcHJldmlvdXNSZXN1bHRDb3VudDogcHJldmlvdXNSZXN1bHRDb3VudFJlZi5jdXJyZW50LFxuICAgIGl0ZW1zOiBpdGVtcyxcbiAgICBlbnZpcm9ubWVudDogZW52aXJvbm1lbnQsXG4gICAgaXRlbVRvU3RyaW5nOiBpdGVtVG9TdHJpbmdcbiAgfSwgc3RhdGUpKTtcbiAgLy8gU2V0cyBhMTF5IHN0YXR1cyBtZXNzYWdlIG9uIGNoYW5nZXMgaW4gc2VsZWN0ZWRJdGVtLlxuICB1c2VBMTF5TWVzc2FnZVNldHRlcihnZXRBMTF5U2VsZWN0aW9uTWVzc2FnZSwgW3NlbGVjdGVkSXRlbV0sIF9leHRlbmRzKHtcbiAgICBpc0luaXRpYWxNb3VudDogaXNJbml0aWFsTW91bnRSZWYuY3VycmVudCxcbiAgICBwcmV2aW91c1Jlc3VsdENvdW50OiBwcmV2aW91c1Jlc3VsdENvdW50UmVmLmN1cnJlbnQsXG4gICAgaXRlbXM6IGl0ZW1zLFxuICAgIGVudmlyb25tZW50OiBlbnZpcm9ubWVudCxcbiAgICBpdGVtVG9TdHJpbmc6IGl0ZW1Ub1N0cmluZ1xuICB9LCBzdGF0ZSkpO1xuICAvLyBTY3JvbGwgb24gaGlnaGxpZ2h0ZWQgaXRlbSBpZiBjaGFuZ2UgY29tZXMgZnJvbSBrZXlib2FyZC5cbiAgdmFyIHNob3VsZFNjcm9sbFJlZiA9IHVzZVNjcm9sbEludG9WaWV3KHtcbiAgICBtZW51RWxlbWVudDogbWVudVJlZi5jdXJyZW50LFxuICAgIGhpZ2hsaWdodGVkSW5kZXg6IGhpZ2hsaWdodGVkSW5kZXgsXG4gICAgaXNPcGVuOiBpc09wZW4sXG4gICAgaXRlbVJlZnM6IGl0ZW1SZWZzLFxuICAgIHNjcm9sbEludG9WaWV3OiBzY3JvbGxJbnRvVmlldyxcbiAgICBnZXRJdGVtTm9kZUZyb21JbmRleDogZ2V0SXRlbU5vZGVGcm9tSW5kZXhcbiAgfSk7XG5cbiAgLy8gU2V0cyBjbGVhbnVwIGZvciB0aGUga2V5c1NvRmFyIGNhbGxiYWNrLCBkZWJvdW5kZWQgYWZ0ZXIgNTAwbXMuXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgLy8gaW5pdCB0aGUgY2xlYW4gZnVuY3Rpb24gaGVyZSBhcyB3ZSBuZWVkIGFjY2VzcyB0byBkaXNwYXRjaC5cbiAgICBjbGVhclRpbWVvdXRSZWYuY3VycmVudCA9IGRlYm91bmNlKGZ1bmN0aW9uIChvdXRlckRpc3BhdGNoKSB7XG4gICAgICBvdXRlckRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogRnVuY3Rpb25TZXRJbnB1dFZhbHVlJDEsXG4gICAgICAgIGlucHV0VmFsdWU6ICcnXG4gICAgICB9KTtcbiAgICB9LCA1MDApO1xuXG4gICAgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGRlYm91bmNlZCBjYWxscyBvbiBtb3VudFxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBjbGVhclRpbWVvdXRSZWYuY3VycmVudC5jYW5jZWwoKTtcbiAgICB9O1xuICB9LCBbXSk7XG5cbiAgLy8gSW52b2tlcyB0aGUga2V5c1NvRmFyIGNhbGxiYWNrIHNldCB1cCBhYm92ZS5cbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWlucHV0VmFsdWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2xlYXJUaW1lb3V0UmVmLmN1cnJlbnQoZGlzcGF0Y2gpO1xuICB9LCBbZGlzcGF0Y2gsIGlucHV0VmFsdWVdKTtcbiAgdXNlQ29udHJvbFByb3BzVmFsaWRhdG9yKHtcbiAgICBpc0luaXRpYWxNb3VudDogaXNJbml0aWFsTW91bnRSZWYuY3VycmVudCxcbiAgICBwcm9wczogcHJvcHMsXG4gICAgc3RhdGU6IHN0YXRlXG4gIH0pO1xuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlmIChpc0luaXRpYWxNb3VudFJlZi5jdXJyZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHByZXZpb3VzUmVzdWx0Q291bnRSZWYuY3VycmVudCA9IGl0ZW1zLmxlbmd0aDtcbiAgfSk7XG4gIC8vIEFkZCBtb3VzZS90b3VjaCBldmVudHMgdG8gZG9jdW1lbnQuXG4gIHZhciBtb3VzZUFuZFRvdWNoVHJhY2tlcnNSZWYgPSB1c2VNb3VzZUFuZFRvdWNoVHJhY2tlcihpc09wZW4sIFttZW51UmVmLCB0b2dnbGVCdXR0b25SZWZdLCBlbnZpcm9ubWVudCwgZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IFRvZ2dsZUJ1dHRvbkJsdXJcbiAgICB9KTtcbiAgfSk7XG4gIHZhciBzZXRHZXR0ZXJQcm9wQ2FsbEluZm8gPSB1c2VHZXR0ZXJQcm9wc0NhbGxlZENoZWNrZXIoJ2dldE1lbnVQcm9wcycsICdnZXRUb2dnbGVCdXR0b25Qcm9wcycpO1xuICAvLyBNYWtlIGluaXRpYWwgcmVmIGZhbHNlLlxuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQgPSBmYWxzZTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgaXNJbml0aWFsTW91bnRSZWYuY3VycmVudCA9IHRydWU7XG4gICAgfTtcbiAgfSwgW10pO1xuICAvLyBSZXNldCBpdGVtUmVmcyBvbiBjbG9zZS5cbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWlzT3Blbikge1xuICAgICAgaXRlbVJlZnMuY3VycmVudCA9IHt9O1xuICAgIH1cbiAgfSwgW2lzT3Blbl0pO1xuXG4gIC8vIEV2ZW50IGhhbmRsZXIgZnVuY3Rpb25zLlxuICB2YXIgdG9nZ2xlQnV0dG9uS2V5RG93bkhhbmRsZXJzID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIEFycm93RG93bjogZnVuY3Rpb24gQXJyb3dEb3duKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBUb2dnbGVCdXR0b25LZXlEb3duQXJyb3dEb3duLFxuICAgICAgICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4OiBnZXRJdGVtTm9kZUZyb21JbmRleCxcbiAgICAgICAgICBhbHRLZXk6IGV2ZW50LmFsdEtleVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBBcnJvd1VwOiBmdW5jdGlvbiBBcnJvd1VwKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBUb2dnbGVCdXR0b25LZXlEb3duQXJyb3dVcCxcbiAgICAgICAgICBnZXRJdGVtTm9kZUZyb21JbmRleDogZ2V0SXRlbU5vZGVGcm9tSW5kZXgsXG4gICAgICAgICAgYWx0S2V5OiBldmVudC5hbHRLZXlcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgSG9tZTogZnVuY3Rpb24gSG9tZShldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogVG9nZ2xlQnV0dG9uS2V5RG93bkhvbWUsXG4gICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIEVuZDogZnVuY3Rpb24gRW5kKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBUb2dnbGVCdXR0b25LZXlEb3duRW5kLFxuICAgICAgICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4OiBnZXRJdGVtTm9kZUZyb21JbmRleFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBFc2NhcGU6IGZ1bmN0aW9uIEVzY2FwZSgpIHtcbiAgICAgICAgaWYgKGxhdGVzdC5jdXJyZW50LnN0YXRlLmlzT3Blbikge1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IFRvZ2dsZUJ1dHRvbktleURvd25Fc2NhcGVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIEVudGVyOiBmdW5jdGlvbiBFbnRlcihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogbGF0ZXN0LmN1cnJlbnQuc3RhdGUuaXNPcGVuID8gVG9nZ2xlQnV0dG9uS2V5RG93bkVudGVyIDogVG9nZ2xlQnV0dG9uQ2xpY2skMVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBQYWdlVXA6IGZ1bmN0aW9uIFBhZ2VVcChldmVudCkge1xuICAgICAgICBpZiAobGF0ZXN0LmN1cnJlbnQuc3RhdGUuaXNPcGVuKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBUb2dnbGVCdXR0b25LZXlEb3duUGFnZVVwLFxuICAgICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBQYWdlRG93bjogZnVuY3Rpb24gUGFnZURvd24oZXZlbnQpIHtcbiAgICAgICAgaWYgKGxhdGVzdC5jdXJyZW50LnN0YXRlLmlzT3Blbikge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogVG9nZ2xlQnV0dG9uS2V5RG93blBhZ2VEb3duLFxuICAgICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnICc6IGZ1bmN0aW9uIF8oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGN1cnJlbnRTdGF0ZSA9IGxhdGVzdC5jdXJyZW50LnN0YXRlO1xuICAgICAgICBpZiAoIWN1cnJlbnRTdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBUb2dnbGVCdXR0b25DbGljayQxXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJyZW50U3RhdGUuaW5wdXRWYWx1ZSkge1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IFRvZ2dsZUJ1dHRvbktleURvd25DaGFyYWN0ZXIsXG4gICAgICAgICAgICBrZXk6ICcgJyxcbiAgICAgICAgICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4OiBnZXRJdGVtTm9kZUZyb21JbmRleFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IFRvZ2dsZUJ1dHRvbktleURvd25TcGFjZUJ1dHRvblxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSwgW2Rpc3BhdGNoLCBnZXRJdGVtTm9kZUZyb21JbmRleCwgbGF0ZXN0XSk7XG5cbiAgLy8gQWN0aW9uIGZ1bmN0aW9ucy5cbiAgdmFyIHRvZ2dsZU1lbnUgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25Ub2dnbGVNZW51JDFcbiAgICB9KTtcbiAgfSwgW2Rpc3BhdGNoXSk7XG4gIHZhciBjbG9zZU1lbnUgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25DbG9zZU1lbnUkMVxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgdmFyIG9wZW5NZW51ID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uT3Blbk1lbnUkMVxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgdmFyIHNldEhpZ2hsaWdodGVkSW5kZXggPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAobmV3SGlnaGxpZ2h0ZWRJbmRleCkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uU2V0SGlnaGxpZ2h0ZWRJbmRleCQxLFxuICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogbmV3SGlnaGxpZ2h0ZWRJbmRleFxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgdmFyIHNlbGVjdEl0ZW0gPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAobmV3U2VsZWN0ZWRJdGVtKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25TZWxlY3RJdGVtJDEsXG4gICAgICBzZWxlY3RlZEl0ZW06IG5ld1NlbGVjdGVkSXRlbVxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgdmFyIHJlc2V0ID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uUmVzZXQkMlxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgdmFyIHNldElucHV0VmFsdWUgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAobmV3SW5wdXRWYWx1ZSkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uU2V0SW5wdXRWYWx1ZSQxLFxuICAgICAgaW5wdXRWYWx1ZTogbmV3SW5wdXRWYWx1ZVxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgLy8gR2V0dGVyIGZ1bmN0aW9ucy5cbiAgdmFyIGdldExhYmVsUHJvcHMgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAobGFiZWxQcm9wcykge1xuICAgIHJldHVybiBfZXh0ZW5kcyh7XG4gICAgICBpZDogZWxlbWVudElkcy5sYWJlbElkLFxuICAgICAgaHRtbEZvcjogZWxlbWVudElkcy50b2dnbGVCdXR0b25JZFxuICAgIH0sIGxhYmVsUHJvcHMpO1xuICB9LCBbZWxlbWVudElkc10pO1xuICB2YXIgZ2V0TWVudVByb3BzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKF90ZW1wLCBfdGVtcDIpIHtcbiAgICB2YXIgX2V4dGVuZHMyO1xuICAgIHZhciBfcmVmID0gX3RlbXAgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAsXG4gICAgICBvbk1vdXNlTGVhdmUgPSBfcmVmLm9uTW91c2VMZWF2ZSxcbiAgICAgIF9yZWYkcmVmS2V5ID0gX3JlZi5yZWZLZXksXG4gICAgICByZWZLZXkgPSBfcmVmJHJlZktleSA9PT0gdm9pZCAwID8gJ3JlZicgOiBfcmVmJHJlZktleTtcbiAgICAgIF9yZWYub25LZXlEb3duO1xuICAgICAgX3JlZi5vbkJsdXI7XG4gICAgICB2YXIgcmVmID0gX3JlZi5yZWYsXG4gICAgICByZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZiwgX2V4Y2x1ZGVkJDIpO1xuICAgIHZhciBfcmVmMiA9IF90ZW1wMiA9PT0gdm9pZCAwID8ge30gOiBfdGVtcDIsXG4gICAgICBfcmVmMiRzdXBwcmVzc1JlZkVycm8gPSBfcmVmMi5zdXBwcmVzc1JlZkVycm9yLFxuICAgICAgc3VwcHJlc3NSZWZFcnJvciA9IF9yZWYyJHN1cHByZXNzUmVmRXJybyA9PT0gdm9pZCAwID8gZmFsc2UgOiBfcmVmMiRzdXBwcmVzc1JlZkVycm87XG4gICAgdmFyIG1lbnVIYW5kbGVNb3VzZUxlYXZlID0gZnVuY3Rpb24gbWVudUhhbmRsZU1vdXNlTGVhdmUoKSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IE1lbnVNb3VzZUxlYXZlJDFcbiAgICAgIH0pO1xuICAgIH07XG4gICAgc2V0R2V0dGVyUHJvcENhbGxJbmZvKCdnZXRNZW51UHJvcHMnLCBzdXBwcmVzc1JlZkVycm9yLCByZWZLZXksIG1lbnVSZWYpO1xuICAgIHJldHVybiBfZXh0ZW5kcygoX2V4dGVuZHMyID0ge30sIF9leHRlbmRzMltyZWZLZXldID0gaGFuZGxlUmVmcyhyZWYsIGZ1bmN0aW9uIChtZW51Tm9kZSkge1xuICAgICAgbWVudVJlZi5jdXJyZW50ID0gbWVudU5vZGU7XG4gICAgfSksIF9leHRlbmRzMi5pZCA9IGVsZW1lbnRJZHMubWVudUlkLCBfZXh0ZW5kczIucm9sZSA9ICdsaXN0Ym94JywgX2V4dGVuZHMyWydhcmlhLWxhYmVsbGVkYnknXSA9IHJlc3QgJiYgcmVzdFsnYXJpYS1sYWJlbCddID8gdW5kZWZpbmVkIDogXCJcIiArIGVsZW1lbnRJZHMubGFiZWxJZCwgX2V4dGVuZHMyLm9uTW91c2VMZWF2ZSA9IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uTW91c2VMZWF2ZSwgbWVudUhhbmRsZU1vdXNlTGVhdmUpLCBfZXh0ZW5kczIpLCByZXN0KTtcbiAgfSwgW2Rpc3BhdGNoLCBzZXRHZXR0ZXJQcm9wQ2FsbEluZm8sIGVsZW1lbnRJZHNdKTtcbiAgdmFyIGdldFRvZ2dsZUJ1dHRvblByb3BzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKF90ZW1wMywgX3RlbXA0KSB7XG4gICAgdmFyIF9leHRlbmRzMztcbiAgICB2YXIgX3JlZjMgPSBfdGVtcDMgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAzLFxuICAgICAgb25CbHVyID0gX3JlZjMub25CbHVyLFxuICAgICAgb25DbGljayA9IF9yZWYzLm9uQ2xpY2s7XG4gICAgICBfcmVmMy5vblByZXNzO1xuICAgICAgdmFyIG9uS2V5RG93biA9IF9yZWYzLm9uS2V5RG93bixcbiAgICAgIF9yZWYzJHJlZktleSA9IF9yZWYzLnJlZktleSxcbiAgICAgIHJlZktleSA9IF9yZWYzJHJlZktleSA9PT0gdm9pZCAwID8gJ3JlZicgOiBfcmVmMyRyZWZLZXksXG4gICAgICByZWYgPSBfcmVmMy5yZWYsXG4gICAgICByZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZjMsIF9leGNsdWRlZDIkMik7XG4gICAgdmFyIF9yZWY0ID0gX3RlbXA0ID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wNCxcbiAgICAgIF9yZWY0JHN1cHByZXNzUmVmRXJybyA9IF9yZWY0LnN1cHByZXNzUmVmRXJyb3IsXG4gICAgICBzdXBwcmVzc1JlZkVycm9yID0gX3JlZjQkc3VwcHJlc3NSZWZFcnJvID09PSB2b2lkIDAgPyBmYWxzZSA6IF9yZWY0JHN1cHByZXNzUmVmRXJybztcbiAgICB2YXIgbGF0ZXN0U3RhdGUgPSBsYXRlc3QuY3VycmVudC5zdGF0ZTtcbiAgICB2YXIgdG9nZ2xlQnV0dG9uSGFuZGxlQ2xpY2sgPSBmdW5jdGlvbiB0b2dnbGVCdXR0b25IYW5kbGVDbGljaygpIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogVG9nZ2xlQnV0dG9uQ2xpY2skMVxuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgdG9nZ2xlQnV0dG9uSGFuZGxlQmx1ciA9IGZ1bmN0aW9uIHRvZ2dsZUJ1dHRvbkhhbmRsZUJsdXIoKSB7XG4gICAgICBpZiAobGF0ZXN0U3RhdGUuaXNPcGVuICYmICFtb3VzZUFuZFRvdWNoVHJhY2tlcnNSZWYuY3VycmVudC5pc01vdXNlRG93bikge1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogVG9nZ2xlQnV0dG9uQmx1clxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciB0b2dnbGVCdXR0b25IYW5kbGVLZXlEb3duID0gZnVuY3Rpb24gdG9nZ2xlQnV0dG9uSGFuZGxlS2V5RG93bihldmVudCkge1xuICAgICAgdmFyIGtleSA9IG5vcm1hbGl6ZUFycm93S2V5KGV2ZW50KTtcbiAgICAgIGlmIChrZXkgJiYgdG9nZ2xlQnV0dG9uS2V5RG93bkhhbmRsZXJzW2tleV0pIHtcbiAgICAgICAgdG9nZ2xlQnV0dG9uS2V5RG93bkhhbmRsZXJzW2tleV0oZXZlbnQpO1xuICAgICAgfSBlbHNlIGlmIChpc0FjY2VwdGVkQ2hhcmFjdGVyS2V5KGtleSkpIHtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IFRvZ2dsZUJ1dHRvbktleURvd25DaGFyYWN0ZXIsXG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIHRvZ2dsZVByb3BzID0gX2V4dGVuZHMoKF9leHRlbmRzMyA9IHt9LCBfZXh0ZW5kczNbcmVmS2V5XSA9IGhhbmRsZVJlZnMocmVmLCBmdW5jdGlvbiAodG9nZ2xlQnV0dG9uTm9kZSkge1xuICAgICAgdG9nZ2xlQnV0dG9uUmVmLmN1cnJlbnQgPSB0b2dnbGVCdXR0b25Ob2RlO1xuICAgIH0pLCBfZXh0ZW5kczNbJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCddID0gbGF0ZXN0U3RhdGUuaXNPcGVuICYmIGxhdGVzdFN0YXRlLmhpZ2hsaWdodGVkSW5kZXggPiAtMSA/IGVsZW1lbnRJZHMuZ2V0SXRlbUlkKGxhdGVzdFN0YXRlLmhpZ2hsaWdodGVkSW5kZXgpIDogJycsIF9leHRlbmRzM1snYXJpYS1jb250cm9scyddID0gZWxlbWVudElkcy5tZW51SWQsIF9leHRlbmRzM1snYXJpYS1leHBhbmRlZCddID0gbGF0ZXN0LmN1cnJlbnQuc3RhdGUuaXNPcGVuLCBfZXh0ZW5kczNbJ2FyaWEtaGFzcG9wdXAnXSA9ICdsaXN0Ym94JywgX2V4dGVuZHMzWydhcmlhLWxhYmVsbGVkYnknXSA9IHJlc3QgJiYgcmVzdFsnYXJpYS1sYWJlbCddID8gdW5kZWZpbmVkIDogXCJcIiArIGVsZW1lbnRJZHMubGFiZWxJZCwgX2V4dGVuZHMzLmlkID0gZWxlbWVudElkcy50b2dnbGVCdXR0b25JZCwgX2V4dGVuZHMzLnJvbGUgPSAnY29tYm9ib3gnLCBfZXh0ZW5kczMudGFiSW5kZXggPSAwLCBfZXh0ZW5kczMub25CbHVyID0gY2FsbEFsbEV2ZW50SGFuZGxlcnMob25CbHVyLCB0b2dnbGVCdXR0b25IYW5kbGVCbHVyKSwgX2V4dGVuZHMzKSwgcmVzdCk7XG4gICAgaWYgKCFyZXN0LmRpc2FibGVkKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKHJlYWN0LW5hdGl2ZSkgKi9cbiAgICAgIHtcbiAgICAgICAgdG9nZ2xlUHJvcHMub25DbGljayA9IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uQ2xpY2ssIHRvZ2dsZUJ1dHRvbkhhbmRsZUNsaWNrKTtcbiAgICAgICAgdG9nZ2xlUHJvcHMub25LZXlEb3duID0gY2FsbEFsbEV2ZW50SGFuZGxlcnMob25LZXlEb3duLCB0b2dnbGVCdXR0b25IYW5kbGVLZXlEb3duKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2V0R2V0dGVyUHJvcENhbGxJbmZvKCdnZXRUb2dnbGVCdXR0b25Qcm9wcycsIHN1cHByZXNzUmVmRXJyb3IsIHJlZktleSwgdG9nZ2xlQnV0dG9uUmVmKTtcbiAgICByZXR1cm4gdG9nZ2xlUHJvcHM7XG4gIH0sIFtsYXRlc3QsIGVsZW1lbnRJZHMsIHNldEdldHRlclByb3BDYWxsSW5mbywgZGlzcGF0Y2gsIG1vdXNlQW5kVG91Y2hUcmFja2Vyc1JlZiwgdG9nZ2xlQnV0dG9uS2V5RG93bkhhbmRsZXJzLCBnZXRJdGVtTm9kZUZyb21JbmRleF0pO1xuICB2YXIgZ2V0SXRlbVByb3BzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKF90ZW1wNSkge1xuICAgIHZhciBfZXh0ZW5kczQ7XG4gICAgdmFyIF9yZWY1ID0gX3RlbXA1ID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wNSxcbiAgICAgIGl0ZW1Qcm9wID0gX3JlZjUuaXRlbSxcbiAgICAgIGluZGV4UHJvcCA9IF9yZWY1LmluZGV4LFxuICAgICAgb25Nb3VzZU1vdmUgPSBfcmVmNS5vbk1vdXNlTW92ZSxcbiAgICAgIG9uQ2xpY2sgPSBfcmVmNS5vbkNsaWNrO1xuICAgICAgX3JlZjUub25QcmVzcztcbiAgICAgIHZhciBfcmVmNSRyZWZLZXkgPSBfcmVmNS5yZWZLZXksXG4gICAgICByZWZLZXkgPSBfcmVmNSRyZWZLZXkgPT09IHZvaWQgMCA/ICdyZWYnIDogX3JlZjUkcmVmS2V5LFxuICAgICAgcmVmID0gX3JlZjUucmVmLFxuICAgICAgZGlzYWJsZWQgPSBfcmVmNS5kaXNhYmxlZCxcbiAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmNSwgX2V4Y2x1ZGVkMyQxKTtcbiAgICB2YXIgX2xhdGVzdCRjdXJyZW50ID0gbGF0ZXN0LmN1cnJlbnQsXG4gICAgICBsYXRlc3RTdGF0ZSA9IF9sYXRlc3QkY3VycmVudC5zdGF0ZSxcbiAgICAgIGxhdGVzdFByb3BzID0gX2xhdGVzdCRjdXJyZW50LnByb3BzO1xuICAgIHZhciBfZ2V0SXRlbUFuZEluZGV4ID0gZ2V0SXRlbUFuZEluZGV4KGl0ZW1Qcm9wLCBpbmRleFByb3AsIGxhdGVzdFByb3BzLml0ZW1zLCAnUGFzcyBlaXRoZXIgaXRlbSBvciBpbmRleCB0byBnZXRJdGVtUHJvcHMhJyksXG4gICAgICBpdGVtID0gX2dldEl0ZW1BbmRJbmRleFswXSxcbiAgICAgIGluZGV4ID0gX2dldEl0ZW1BbmRJbmRleFsxXTtcbiAgICB2YXIgaXRlbUhhbmRsZU1vdXNlTW92ZSA9IGZ1bmN0aW9uIGl0ZW1IYW5kbGVNb3VzZU1vdmUoKSB7XG4gICAgICBpZiAoaW5kZXggPT09IGxhdGVzdFN0YXRlLmhpZ2hsaWdodGVkSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2hvdWxkU2Nyb2xsUmVmLmN1cnJlbnQgPSBmYWxzZTtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogSXRlbU1vdXNlTW92ZSQxLFxuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIGRpc2FibGVkOiBkaXNhYmxlZFxuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgaXRlbUhhbmRsZUNsaWNrID0gZnVuY3Rpb24gaXRlbUhhbmRsZUNsaWNrKCkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBJdGVtQ2xpY2skMSxcbiAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBpdGVtUHJvcHMgPSBfZXh0ZW5kcygoX2V4dGVuZHM0ID0ge1xuICAgICAgZGlzYWJsZWQ6IGRpc2FibGVkLFxuICAgICAgcm9sZTogJ29wdGlvbicsXG4gICAgICAnYXJpYS1zZWxlY3RlZCc6IFwiXCIgKyAoaXRlbSA9PT0gc2VsZWN0ZWRJdGVtKSxcbiAgICAgIGlkOiBlbGVtZW50SWRzLmdldEl0ZW1JZChpbmRleClcbiAgICB9LCBfZXh0ZW5kczRbcmVmS2V5XSA9IGhhbmRsZVJlZnMocmVmLCBmdW5jdGlvbiAoaXRlbU5vZGUpIHtcbiAgICAgIGlmIChpdGVtTm9kZSkge1xuICAgICAgICBpdGVtUmVmcy5jdXJyZW50W2VsZW1lbnRJZHMuZ2V0SXRlbUlkKGluZGV4KV0gPSBpdGVtTm9kZTtcbiAgICAgIH1cbiAgICB9KSwgX2V4dGVuZHM0KSwgcmVzdCk7XG4gICAgaWYgKCFkaXNhYmxlZCkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKHJlYWN0LW5hdGl2ZSkgKi9cbiAgICAgIHtcbiAgICAgICAgaXRlbVByb3BzLm9uQ2xpY2sgPSBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbkNsaWNrLCBpdGVtSGFuZGxlQ2xpY2spO1xuICAgICAgfVxuICAgIH1cbiAgICBpdGVtUHJvcHMub25Nb3VzZU1vdmUgPSBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbk1vdXNlTW92ZSwgaXRlbUhhbmRsZU1vdXNlTW92ZSk7XG4gICAgcmV0dXJuIGl0ZW1Qcm9wcztcbiAgfSwgW2xhdGVzdCwgc2VsZWN0ZWRJdGVtLCBlbGVtZW50SWRzLCBzaG91bGRTY3JvbGxSZWYsIGRpc3BhdGNoXSk7XG4gIHJldHVybiB7XG4gICAgLy8gcHJvcCBnZXR0ZXJzLlxuICAgIGdldFRvZ2dsZUJ1dHRvblByb3BzOiBnZXRUb2dnbGVCdXR0b25Qcm9wcyxcbiAgICBnZXRMYWJlbFByb3BzOiBnZXRMYWJlbFByb3BzLFxuICAgIGdldE1lbnVQcm9wczogZ2V0TWVudVByb3BzLFxuICAgIGdldEl0ZW1Qcm9wczogZ2V0SXRlbVByb3BzLFxuICAgIC8vIGFjdGlvbnMuXG4gICAgdG9nZ2xlTWVudTogdG9nZ2xlTWVudSxcbiAgICBvcGVuTWVudTogb3Blbk1lbnUsXG4gICAgY2xvc2VNZW51OiBjbG9zZU1lbnUsXG4gICAgc2V0SGlnaGxpZ2h0ZWRJbmRleDogc2V0SGlnaGxpZ2h0ZWRJbmRleCxcbiAgICBzZWxlY3RJdGVtOiBzZWxlY3RJdGVtLFxuICAgIHJlc2V0OiByZXNldCxcbiAgICBzZXRJbnB1dFZhbHVlOiBzZXRJbnB1dFZhbHVlLFxuICAgIC8vIHN0YXRlLlxuICAgIGhpZ2hsaWdodGVkSW5kZXg6IGhpZ2hsaWdodGVkSW5kZXgsXG4gICAgaXNPcGVuOiBpc09wZW4sXG4gICAgc2VsZWN0ZWRJdGVtOiBzZWxlY3RlZEl0ZW0sXG4gICAgaW5wdXRWYWx1ZTogaW5wdXRWYWx1ZVxuICB9O1xufVxuXG52YXIgSW5wdXRLZXlEb3duQXJyb3dEb3duID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19faW5wdXRfa2V5ZG93bl9hcnJvd19kb3duX18nIDogMDtcbnZhciBJbnB1dEtleURvd25BcnJvd1VwID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19faW5wdXRfa2V5ZG93bl9hcnJvd191cF9fJyA6IDE7XG52YXIgSW5wdXRLZXlEb3duRXNjYXBlID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19faW5wdXRfa2V5ZG93bl9lc2NhcGVfXycgOiAyO1xudmFyIElucHV0S2V5RG93bkhvbWUgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19pbnB1dF9rZXlkb3duX2hvbWVfXycgOiAzO1xudmFyIElucHV0S2V5RG93bkVuZCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2lucHV0X2tleWRvd25fZW5kX18nIDogNDtcbnZhciBJbnB1dEtleURvd25QYWdlVXAgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19pbnB1dF9rZXlkb3duX3BhZ2VfdXBfXycgOiA1O1xudmFyIElucHV0S2V5RG93blBhZ2VEb3duID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19faW5wdXRfa2V5ZG93bl9wYWdlX2Rvd25fXycgOiA2O1xudmFyIElucHV0S2V5RG93bkVudGVyID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19faW5wdXRfa2V5ZG93bl9lbnRlcl9fJyA6IDc7XG52YXIgSW5wdXRDaGFuZ2UgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19pbnB1dF9jaGFuZ2VfXycgOiA4O1xudmFyIElucHV0Qmx1ciA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2lucHV0X2JsdXJfXycgOiA5O1xudmFyIElucHV0Rm9jdXMgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19pbnB1dF9mb2N1c19fJyA6IDEwO1xudmFyIE1lbnVNb3VzZUxlYXZlID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fbWVudV9tb3VzZV9sZWF2ZV9fJyA6IDExO1xudmFyIEl0ZW1Nb3VzZU1vdmUgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19pdGVtX21vdXNlX21vdmVfXycgOiAxMjtcbnZhciBJdGVtQ2xpY2sgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19pdGVtX2NsaWNrX18nIDogMTM7XG52YXIgVG9nZ2xlQnV0dG9uQ2xpY2sgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX190b2dnbGVidXR0b25fY2xpY2tfXycgOiAxNDtcbnZhciBGdW5jdGlvblRvZ2dsZU1lbnUgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl90b2dnbGVfbWVudV9fJyA6IDE1O1xudmFyIEZ1bmN0aW9uT3Blbk1lbnUgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9vcGVuX21lbnVfXycgOiAxNjtcbnZhciBGdW5jdGlvbkNsb3NlTWVudSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2Z1bmN0aW9uX2Nsb3NlX21lbnVfXycgOiAxNztcbnZhciBGdW5jdGlvblNldEhpZ2hsaWdodGVkSW5kZXggPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9zZXRfaGlnaGxpZ2h0ZWRfaW5kZXhfXycgOiAxODtcbnZhciBGdW5jdGlvblNlbGVjdEl0ZW0gPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9zZWxlY3RfaXRlbV9fJyA6IDE5O1xudmFyIEZ1bmN0aW9uU2V0SW5wdXRWYWx1ZSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2Z1bmN0aW9uX3NldF9pbnB1dF92YWx1ZV9fJyA6IDIwO1xudmFyIEZ1bmN0aW9uUmVzZXQkMSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2Z1bmN0aW9uX3Jlc2V0X18nIDogMjE7XG52YXIgQ29udHJvbGxlZFByb3BVcGRhdGVkU2VsZWN0ZWRJdGVtID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fY29udHJvbGxlZF9wcm9wX3VwZGF0ZWRfc2VsZWN0ZWRfaXRlbV9fJyA6IDIyO1xuXG52YXIgc3RhdGVDaGFuZ2VUeXBlcyQxID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICBfX3Byb3RvX186IG51bGwsXG4gIElucHV0S2V5RG93bkFycm93RG93bjogSW5wdXRLZXlEb3duQXJyb3dEb3duLFxuICBJbnB1dEtleURvd25BcnJvd1VwOiBJbnB1dEtleURvd25BcnJvd1VwLFxuICBJbnB1dEtleURvd25Fc2NhcGU6IElucHV0S2V5RG93bkVzY2FwZSxcbiAgSW5wdXRLZXlEb3duSG9tZTogSW5wdXRLZXlEb3duSG9tZSxcbiAgSW5wdXRLZXlEb3duRW5kOiBJbnB1dEtleURvd25FbmQsXG4gIElucHV0S2V5RG93blBhZ2VVcDogSW5wdXRLZXlEb3duUGFnZVVwLFxuICBJbnB1dEtleURvd25QYWdlRG93bjogSW5wdXRLZXlEb3duUGFnZURvd24sXG4gIElucHV0S2V5RG93bkVudGVyOiBJbnB1dEtleURvd25FbnRlcixcbiAgSW5wdXRDaGFuZ2U6IElucHV0Q2hhbmdlLFxuICBJbnB1dEJsdXI6IElucHV0Qmx1cixcbiAgSW5wdXRGb2N1czogSW5wdXRGb2N1cyxcbiAgTWVudU1vdXNlTGVhdmU6IE1lbnVNb3VzZUxlYXZlLFxuICBJdGVtTW91c2VNb3ZlOiBJdGVtTW91c2VNb3ZlLFxuICBJdGVtQ2xpY2s6IEl0ZW1DbGljayxcbiAgVG9nZ2xlQnV0dG9uQ2xpY2s6IFRvZ2dsZUJ1dHRvbkNsaWNrLFxuICBGdW5jdGlvblRvZ2dsZU1lbnU6IEZ1bmN0aW9uVG9nZ2xlTWVudSxcbiAgRnVuY3Rpb25PcGVuTWVudTogRnVuY3Rpb25PcGVuTWVudSxcbiAgRnVuY3Rpb25DbG9zZU1lbnU6IEZ1bmN0aW9uQ2xvc2VNZW51LFxuICBGdW5jdGlvblNldEhpZ2hsaWdodGVkSW5kZXg6IEZ1bmN0aW9uU2V0SGlnaGxpZ2h0ZWRJbmRleCxcbiAgRnVuY3Rpb25TZWxlY3RJdGVtOiBGdW5jdGlvblNlbGVjdEl0ZW0sXG4gIEZ1bmN0aW9uU2V0SW5wdXRWYWx1ZTogRnVuY3Rpb25TZXRJbnB1dFZhbHVlLFxuICBGdW5jdGlvblJlc2V0OiBGdW5jdGlvblJlc2V0JDEsXG4gIENvbnRyb2xsZWRQcm9wVXBkYXRlZFNlbGVjdGVkSXRlbTogQ29udHJvbGxlZFByb3BVcGRhdGVkU2VsZWN0ZWRJdGVtXG59KTtcblxuZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlJDEocHJvcHMpIHtcbiAgdmFyIGluaXRpYWxTdGF0ZSA9IGdldEluaXRpYWxTdGF0ZSQyKHByb3BzKTtcbiAgdmFyIHNlbGVjdGVkSXRlbSA9IGluaXRpYWxTdGF0ZS5zZWxlY3RlZEl0ZW07XG4gIHZhciBpbnB1dFZhbHVlID0gaW5pdGlhbFN0YXRlLmlucHV0VmFsdWU7XG4gIGlmIChpbnB1dFZhbHVlID09PSAnJyAmJiBzZWxlY3RlZEl0ZW0gJiYgcHJvcHMuZGVmYXVsdElucHV0VmFsdWUgPT09IHVuZGVmaW5lZCAmJiBwcm9wcy5pbml0aWFsSW5wdXRWYWx1ZSA9PT0gdW5kZWZpbmVkICYmIHByb3BzLmlucHV0VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIGlucHV0VmFsdWUgPSBwcm9wcy5pdGVtVG9TdHJpbmcoc2VsZWN0ZWRJdGVtKTtcbiAgfVxuICByZXR1cm4gX2V4dGVuZHMoe30sIGluaXRpYWxTdGF0ZSwge1xuICAgIGlucHV0VmFsdWU6IGlucHV0VmFsdWVcbiAgfSk7XG59XG52YXIgcHJvcFR5cGVzJDEgPSB7XG4gIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgaXRlbVRvU3RyaW5nOiBQcm9wVHlwZXMuZnVuYyxcbiAgc2VsZWN0ZWRJdGVtQ2hhbmdlZDogUHJvcFR5cGVzLmZ1bmMsXG4gIGdldEExMXlTdGF0dXNNZXNzYWdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgZ2V0QTExeVNlbGVjdGlvbk1lc3NhZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBoaWdobGlnaHRlZEluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICBkZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgaW5pdGlhbEhpZ2hsaWdodGVkSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gIGlzT3BlbjogUHJvcFR5cGVzLmJvb2wsXG4gIGRlZmF1bHRJc09wZW46IFByb3BUeXBlcy5ib29sLFxuICBpbml0aWFsSXNPcGVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgc2VsZWN0ZWRJdGVtOiBQcm9wVHlwZXMuYW55LFxuICBpbml0aWFsU2VsZWN0ZWRJdGVtOiBQcm9wVHlwZXMuYW55LFxuICBkZWZhdWx0U2VsZWN0ZWRJdGVtOiBQcm9wVHlwZXMuYW55LFxuICBpbnB1dFZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkZWZhdWx0SW5wdXRWYWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaW5pdGlhbElucHV0VmFsdWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBsYWJlbElkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBtZW51SWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGdldEl0ZW1JZDogUHJvcFR5cGVzLmZ1bmMsXG4gIGlucHV0SWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHRvZ2dsZUJ1dHRvbklkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzdGF0ZVJlZHVjZXI6IFByb3BUeXBlcy5mdW5jLFxuICBvblNlbGVjdGVkSXRlbUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uSGlnaGxpZ2h0ZWRJbmRleENoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uU3RhdGVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvbklzT3BlbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uSW5wdXRWYWx1ZUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIGVudmlyb25tZW50OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgIGFkZEV2ZW50TGlzdGVuZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIHJlbW92ZUV2ZW50TGlzdGVuZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIGRvY3VtZW50OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZ2V0RWxlbWVudEJ5SWQ6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgYWN0aXZlRWxlbWVudDogUHJvcFR5cGVzLmFueSxcbiAgICAgIGJvZHk6IFByb3BUeXBlcy5hbnlcbiAgICB9KVxuICB9KVxufTtcblxuLyoqXG4gKiBUaGUgdXNlQ29tYm9ib3ggdmVyc2lvbiBvZiB1c2VDb250cm9sbGVkUmVkdWNlciwgd2hpY2ggYWxzb1xuICogY2hlY2tzIGlmIHRoZSBjb250cm9sbGVkIHByb3Agc2VsZWN0ZWRJdGVtIGNoYW5nZWQgYmV0d2VlblxuICogcmVuZGVycy4gSWYgc28sIGl0IHdpbGwgYWxzbyB1cGRhdGUgaW5wdXRWYWx1ZSB3aXRoIGl0c1xuICogc3RyaW5nIGVxdWl2YWxlbnQuIEl0IHVzZXMgdGhlIGNvbW1vbiB1c2VFbmhhbmNlZFJlZHVjZXIgdG9cbiAqIGNvbXB1dGUgdGhlIHJlc3Qgb2YgdGhlIHN0YXRlLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlZHVjZXIgUmVkdWNlciBmdW5jdGlvbiBmcm9tIGRvd25zaGlmdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBpbml0aWFsU3RhdGUgSW5pdGlhbCBzdGF0ZSBvZiB0aGUgaG9vay5cbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBUaGUgaG9vayBwcm9wcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gQW4gYXJyYXkgd2l0aCB0aGUgc3RhdGUgYW5kIGFuIGFjdGlvbiBkaXNwYXRjaGVyLlxuICovXG5mdW5jdGlvbiB1c2VDb250cm9sbGVkUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsU3RhdGUsIHByb3BzKSB7XG4gIHZhciBwcmV2aW91c1NlbGVjdGVkSXRlbVJlZiA9IHVzZVJlZigpO1xuICB2YXIgX3VzZUVuaGFuY2VkUmVkdWNlciA9IHVzZUVuaGFuY2VkUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsU3RhdGUsIHByb3BzKSxcbiAgICBzdGF0ZSA9IF91c2VFbmhhbmNlZFJlZHVjZXJbMF0sXG4gICAgZGlzcGF0Y2ggPSBfdXNlRW5oYW5jZWRSZWR1Y2VyWzFdO1xuXG4gIC8vIFRvRG86IGlmIG5lZWRlZCwgbWFrZSBzYW1lIGFwcHJvYWNoIGFzIHNlbGVjdGVkSXRlbUNoYW5nZWQgZnJvbSBEb3duc2hpZnQuXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFpc0NvbnRyb2xsZWRQcm9wKHByb3BzLCAnc2VsZWN0ZWRJdGVtJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHByb3BzLnNlbGVjdGVkSXRlbUNoYW5nZWQocHJldmlvdXNTZWxlY3RlZEl0ZW1SZWYuY3VycmVudCwgcHJvcHMuc2VsZWN0ZWRJdGVtKSkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBDb250cm9sbGVkUHJvcFVwZGF0ZWRTZWxlY3RlZEl0ZW0sXG4gICAgICAgIGlucHV0VmFsdWU6IHByb3BzLml0ZW1Ub1N0cmluZyhwcm9wcy5zZWxlY3RlZEl0ZW0pXG4gICAgICB9KTtcbiAgICB9XG4gICAgcHJldmlvdXNTZWxlY3RlZEl0ZW1SZWYuY3VycmVudCA9IHN0YXRlLnNlbGVjdGVkSXRlbSA9PT0gcHJldmlvdXNTZWxlY3RlZEl0ZW1SZWYuY3VycmVudCA/IHByb3BzLnNlbGVjdGVkSXRlbSA6IHN0YXRlLnNlbGVjdGVkSXRlbTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gIH0sIFtzdGF0ZS5zZWxlY3RlZEl0ZW0sIHByb3BzLnNlbGVjdGVkSXRlbV0pO1xuICByZXR1cm4gW2dldFN0YXRlKHN0YXRlLCBwcm9wcyksIGRpc3BhdGNoXTtcbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1tdXRhYmxlLWV4cG9ydHNcbnZhciB2YWxpZGF0ZVByb3BUeXBlcyQxID0gbm9vcDtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YWxpZGF0ZVByb3BUeXBlcyQxID0gZnVuY3Rpb24gdmFsaWRhdGVQcm9wVHlwZXMob3B0aW9ucywgY2FsbGVyKSB7XG4gICAgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKHByb3BUeXBlcyQxLCBvcHRpb25zLCAncHJvcCcsIGNhbGxlci5uYW1lKTtcbiAgfTtcbn1cbnZhciBkZWZhdWx0UHJvcHMkMSA9IF9leHRlbmRzKHt9LCBkZWZhdWx0UHJvcHMkMywge1xuICBzZWxlY3RlZEl0ZW1DaGFuZ2VkOiBmdW5jdGlvbiBzZWxlY3RlZEl0ZW1DaGFuZ2VkKHByZXZJdGVtLCBpdGVtKSB7XG4gICAgcmV0dXJuIHByZXZJdGVtICE9PSBpdGVtO1xuICB9LFxuICBnZXRBMTF5U3RhdHVzTWVzc2FnZTogZ2V0QTExeVN0YXR1c01lc3NhZ2UkMVxufSk7XG5cbi8qIGVzbGludC1kaXNhYmxlIGNvbXBsZXhpdHkgKi9cbmZ1bmN0aW9uIGRvd25zaGlmdFVzZUNvbWJvYm94UmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIHZhciBfcHJvcHMkaXRlbXM7XG4gIHZhciB0eXBlID0gYWN0aW9uLnR5cGUsXG4gICAgcHJvcHMgPSBhY3Rpb24ucHJvcHMsXG4gICAgYWx0S2V5ID0gYWN0aW9uLmFsdEtleTtcbiAgdmFyIGNoYW5nZXM7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgSXRlbUNsaWNrOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaXNPcGVuOiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgJ2lzT3BlbicpLFxuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgJ2hpZ2hsaWdodGVkSW5kZXgnKSxcbiAgICAgICAgc2VsZWN0ZWRJdGVtOiBwcm9wcy5pdGVtc1thY3Rpb24uaW5kZXhdLFxuICAgICAgICBpbnB1dFZhbHVlOiBwcm9wcy5pdGVtVG9TdHJpbmcocHJvcHMuaXRlbXNbYWN0aW9uLmluZGV4XSlcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIElucHV0S2V5RG93bkFycm93RG93bjpcbiAgICAgIGlmIChzdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBnZXROZXh0V3JhcHBpbmdJbmRleCgxLCBzdGF0ZS5oaWdobGlnaHRlZEluZGV4LCBwcm9wcy5pdGVtcy5sZW5ndGgsIGFjdGlvbi5nZXRJdGVtTm9kZUZyb21JbmRleCwgdHJ1ZSlcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogYWx0S2V5ICYmIHN0YXRlLnNlbGVjdGVkSXRlbSA9PSBudWxsID8gLTEgOiBnZXRIaWdobGlnaHRlZEluZGV4T25PcGVuKHByb3BzLCBzdGF0ZSwgMSwgYWN0aW9uLmdldEl0ZW1Ob2RlRnJvbUluZGV4KSxcbiAgICAgICAgICBpc09wZW46IHByb3BzLml0ZW1zLmxlbmd0aCA+PSAwXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIElucHV0S2V5RG93bkFycm93VXA6XG4gICAgICBpZiAoc3RhdGUuaXNPcGVuKSB7XG4gICAgICAgIGlmIChhbHRLZXkpIHtcbiAgICAgICAgICBjaGFuZ2VzID0gZ2V0Q2hhbmdlc09uU2VsZWN0aW9uKHByb3BzLCBzdGF0ZS5oaWdobGlnaHRlZEluZGV4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGFuZ2VzID0ge1xuICAgICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0TmV4dFdyYXBwaW5nSW5kZXgoLTEsIHN0YXRlLmhpZ2hsaWdodGVkSW5kZXgsIHByb3BzLml0ZW1zLmxlbmd0aCwgYWN0aW9uLmdldEl0ZW1Ob2RlRnJvbUluZGV4LCB0cnVlKVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0SGlnaGxpZ2h0ZWRJbmRleE9uT3Blbihwcm9wcywgc3RhdGUsIC0xLCBhY3Rpb24uZ2V0SXRlbU5vZGVGcm9tSW5kZXgpLFxuICAgICAgICAgIGlzT3BlbjogcHJvcHMuaXRlbXMubGVuZ3RoID49IDBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgSW5wdXRLZXlEb3duRW50ZXI6XG4gICAgICBjaGFuZ2VzID0gZ2V0Q2hhbmdlc09uU2VsZWN0aW9uKHByb3BzLCBzdGF0ZS5oaWdobGlnaHRlZEluZGV4KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgSW5wdXRLZXlEb3duRXNjYXBlOlxuICAgICAgY2hhbmdlcyA9IF9leHRlbmRzKHtcbiAgICAgICAgaXNPcGVuOiBmYWxzZSxcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogLTFcbiAgICAgIH0sICFzdGF0ZS5pc09wZW4gJiYge1xuICAgICAgICBzZWxlY3RlZEl0ZW06IG51bGwsXG4gICAgICAgIGlucHV0VmFsdWU6ICcnXG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgSW5wdXRLZXlEb3duUGFnZVVwOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0TmV4dFdyYXBwaW5nSW5kZXgoLTEwLCBzdGF0ZS5oaWdobGlnaHRlZEluZGV4LCBwcm9wcy5pdGVtcy5sZW5ndGgsIGFjdGlvbi5nZXRJdGVtTm9kZUZyb21JbmRleCwgZmFsc2UpXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBJbnB1dEtleURvd25QYWdlRG93bjpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGdldE5leHRXcmFwcGluZ0luZGV4KDEwLCBzdGF0ZS5oaWdobGlnaHRlZEluZGV4LCBwcm9wcy5pdGVtcy5sZW5ndGgsIGFjdGlvbi5nZXRJdGVtTm9kZUZyb21JbmRleCwgZmFsc2UpXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBJbnB1dEtleURvd25Ib21lOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0TmV4dE5vbkRpc2FibGVkSW5kZXgoMSwgMCwgcHJvcHMuaXRlbXMubGVuZ3RoLCBhY3Rpb24uZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIGZhbHNlKVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgSW5wdXRLZXlEb3duRW5kOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0TmV4dE5vbkRpc2FibGVkSW5kZXgoLTEsIHByb3BzLml0ZW1zLmxlbmd0aCAtIDEsIHByb3BzLml0ZW1zLmxlbmd0aCwgYWN0aW9uLmdldEl0ZW1Ob2RlRnJvbUluZGV4LCBmYWxzZSlcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIElucHV0Qmx1cjpcbiAgICAgIGNoYW5nZXMgPSBfZXh0ZW5kcyh7XG4gICAgICAgIGlzT3BlbjogZmFsc2UsXG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IC0xXG4gICAgICB9LCBzdGF0ZS5oaWdobGlnaHRlZEluZGV4ID49IDAgJiYgKChfcHJvcHMkaXRlbXMgPSBwcm9wcy5pdGVtcykgPT0gbnVsbCA/IHZvaWQgMCA6IF9wcm9wcyRpdGVtcy5sZW5ndGgpICYmIGFjdGlvbi5zZWxlY3RJdGVtICYmIHtcbiAgICAgICAgc2VsZWN0ZWRJdGVtOiBwcm9wcy5pdGVtc1tzdGF0ZS5oaWdobGlnaHRlZEluZGV4XSxcbiAgICAgICAgaW5wdXRWYWx1ZTogcHJvcHMuaXRlbVRvU3RyaW5nKHByb3BzLml0ZW1zW3N0YXRlLmhpZ2hsaWdodGVkSW5kZXhdKVxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIElucHV0Q2hhbmdlOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaXNPcGVuOiB0cnVlLFxuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgJ2hpZ2hsaWdodGVkSW5kZXgnKSxcbiAgICAgICAgaW5wdXRWYWx1ZTogYWN0aW9uLmlucHV0VmFsdWVcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIElucHV0Rm9jdXM6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBpc09wZW46IHRydWUsXG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGdldEhpZ2hsaWdodGVkSW5kZXhPbk9wZW4ocHJvcHMsIHN0YXRlLCAwKVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgRnVuY3Rpb25TZWxlY3RJdGVtOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgc2VsZWN0ZWRJdGVtOiBhY3Rpb24uc2VsZWN0ZWRJdGVtLFxuICAgICAgICBpbnB1dFZhbHVlOiBwcm9wcy5pdGVtVG9TdHJpbmcoYWN0aW9uLnNlbGVjdGVkSXRlbSlcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIENvbnRyb2xsZWRQcm9wVXBkYXRlZFNlbGVjdGVkSXRlbTpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGlucHV0VmFsdWU6IGFjdGlvbi5pbnB1dFZhbHVlXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBkb3duc2hpZnRDb21tb25SZWR1Y2VyKHN0YXRlLCBhY3Rpb24sIHN0YXRlQ2hhbmdlVHlwZXMkMSk7XG4gIH1cbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwgY2hhbmdlcyk7XG59XG4vKiBlc2xpbnQtZW5hYmxlIGNvbXBsZXhpdHkgKi9cblxudmFyIF9leGNsdWRlZCQxID0gW1wib25Nb3VzZUxlYXZlXCIsIFwicmVmS2V5XCIsIFwicmVmXCJdLFxuICBfZXhjbHVkZWQyJDEgPSBbXCJpdGVtXCIsIFwiaW5kZXhcIiwgXCJyZWZLZXlcIiwgXCJyZWZcIiwgXCJvbk1vdXNlTW92ZVwiLCBcIm9uTW91c2VEb3duXCIsIFwib25DbGlja1wiLCBcIm9uUHJlc3NcIiwgXCJkaXNhYmxlZFwiXSxcbiAgX2V4Y2x1ZGVkMyA9IFtcIm9uQ2xpY2tcIiwgXCJvblByZXNzXCIsIFwicmVmS2V5XCIsIFwicmVmXCJdLFxuICBfZXhjbHVkZWQ0ID0gW1wib25LZXlEb3duXCIsIFwib25DaGFuZ2VcIiwgXCJvbklucHV0XCIsIFwib25Gb2N1c1wiLCBcIm9uQmx1clwiLCBcIm9uQ2hhbmdlVGV4dFwiLCBcInJlZktleVwiLCBcInJlZlwiXTtcbnVzZUNvbWJvYm94LnN0YXRlQ2hhbmdlVHlwZXMgPSBzdGF0ZUNoYW5nZVR5cGVzJDE7XG5mdW5jdGlvbiB1c2VDb21ib2JveCh1c2VyUHJvcHMpIHtcbiAgaWYgKHVzZXJQcm9wcyA9PT0gdm9pZCAwKSB7XG4gICAgdXNlclByb3BzID0ge307XG4gIH1cbiAgdmFsaWRhdGVQcm9wVHlwZXMkMSh1c2VyUHJvcHMsIHVzZUNvbWJvYm94KTtcbiAgLy8gUHJvcHMgZGVmYXVsdHMgYW5kIGRlc3RydWN0dXJpbmcuXG4gIHZhciBwcm9wcyA9IF9leHRlbmRzKHt9LCBkZWZhdWx0UHJvcHMkMSwgdXNlclByb3BzKTtcbiAgdmFyIGluaXRpYWxJc09wZW4gPSBwcm9wcy5pbml0aWFsSXNPcGVuLFxuICAgIGRlZmF1bHRJc09wZW4gPSBwcm9wcy5kZWZhdWx0SXNPcGVuLFxuICAgIGl0ZW1zID0gcHJvcHMuaXRlbXMsXG4gICAgc2Nyb2xsSW50b1ZpZXcgPSBwcm9wcy5zY3JvbGxJbnRvVmlldyxcbiAgICBlbnZpcm9ubWVudCA9IHByb3BzLmVudmlyb25tZW50LFxuICAgIGdldEExMXlTdGF0dXNNZXNzYWdlID0gcHJvcHMuZ2V0QTExeVN0YXR1c01lc3NhZ2UsXG4gICAgZ2V0QTExeVNlbGVjdGlvbk1lc3NhZ2UgPSBwcm9wcy5nZXRBMTF5U2VsZWN0aW9uTWVzc2FnZSxcbiAgICBpdGVtVG9TdHJpbmcgPSBwcm9wcy5pdGVtVG9TdHJpbmc7XG4gIC8vIEluaXRpYWwgc3RhdGUgZGVwZW5kaW5nIG9uIGNvbnRyb2xsZWQgcHJvcHMuXG4gIHZhciBpbml0aWFsU3RhdGUgPSBnZXRJbml0aWFsU3RhdGUkMShwcm9wcyk7XG4gIHZhciBfdXNlQ29udHJvbGxlZFJlZHVjZXIgPSB1c2VDb250cm9sbGVkUmVkdWNlcihkb3duc2hpZnRVc2VDb21ib2JveFJlZHVjZXIsIGluaXRpYWxTdGF0ZSwgcHJvcHMpLFxuICAgIHN0YXRlID0gX3VzZUNvbnRyb2xsZWRSZWR1Y2VyWzBdLFxuICAgIGRpc3BhdGNoID0gX3VzZUNvbnRyb2xsZWRSZWR1Y2VyWzFdO1xuICB2YXIgaXNPcGVuID0gc3RhdGUuaXNPcGVuLFxuICAgIGhpZ2hsaWdodGVkSW5kZXggPSBzdGF0ZS5oaWdobGlnaHRlZEluZGV4LFxuICAgIHNlbGVjdGVkSXRlbSA9IHN0YXRlLnNlbGVjdGVkSXRlbSxcbiAgICBpbnB1dFZhbHVlID0gc3RhdGUuaW5wdXRWYWx1ZTtcblxuICAvLyBFbGVtZW50IHJlZnMuXG4gIHZhciBtZW51UmVmID0gdXNlUmVmKG51bGwpO1xuICB2YXIgaXRlbVJlZnMgPSB1c2VSZWYoe30pO1xuICB2YXIgaW5wdXRSZWYgPSB1c2VSZWYobnVsbCk7XG4gIHZhciB0b2dnbGVCdXR0b25SZWYgPSB1c2VSZWYobnVsbCk7XG4gIHZhciBpc0luaXRpYWxNb3VudFJlZiA9IHVzZVJlZih0cnVlKTtcbiAgLy8gcHJldmVudCBpZCByZS1nZW5lcmF0aW9uIGJldHdlZW4gcmVuZGVycy5cbiAgdmFyIGVsZW1lbnRJZHMgPSB1c2VFbGVtZW50SWRzKHByb3BzKTtcbiAgLy8gdXNlZCB0byBrZWVwIHRyYWNrIG9mIGhvdyBtYW55IGl0ZW1zIHdlIGhhZCBvbiBwcmV2aW91cyBjeWNsZS5cbiAgdmFyIHByZXZpb3VzUmVzdWx0Q291bnRSZWYgPSB1c2VSZWYoKTtcbiAgLy8gdXRpbGl0eSBjYWxsYmFjayB0byBnZXQgaXRlbSBlbGVtZW50LlxuICB2YXIgbGF0ZXN0ID0gdXNlTGF0ZXN0UmVmKHtcbiAgICBzdGF0ZTogc3RhdGUsXG4gICAgcHJvcHM6IHByb3BzXG4gIH0pO1xuICB2YXIgZ2V0SXRlbU5vZGVGcm9tSW5kZXggPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICByZXR1cm4gaXRlbVJlZnMuY3VycmVudFtlbGVtZW50SWRzLmdldEl0ZW1JZChpbmRleCldO1xuICB9LCBbZWxlbWVudElkc10pO1xuXG4gIC8vIEVmZmVjdHMuXG4gIC8vIFNldHMgYTExeSBzdGF0dXMgbWVzc2FnZSBvbiBjaGFuZ2VzIGluIHN0YXRlLlxuICB1c2VBMTF5TWVzc2FnZVNldHRlcihnZXRBMTF5U3RhdHVzTWVzc2FnZSwgW2lzT3BlbiwgaGlnaGxpZ2h0ZWRJbmRleCwgaW5wdXRWYWx1ZSwgaXRlbXNdLCBfZXh0ZW5kcyh7XG4gICAgaXNJbml0aWFsTW91bnQ6IGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQsXG4gICAgcHJldmlvdXNSZXN1bHRDb3VudDogcHJldmlvdXNSZXN1bHRDb3VudFJlZi5jdXJyZW50LFxuICAgIGl0ZW1zOiBpdGVtcyxcbiAgICBlbnZpcm9ubWVudDogZW52aXJvbm1lbnQsXG4gICAgaXRlbVRvU3RyaW5nOiBpdGVtVG9TdHJpbmdcbiAgfSwgc3RhdGUpKTtcbiAgLy8gU2V0cyBhMTF5IHN0YXR1cyBtZXNzYWdlIG9uIGNoYW5nZXMgaW4gc2VsZWN0ZWRJdGVtLlxuICB1c2VBMTF5TWVzc2FnZVNldHRlcihnZXRBMTF5U2VsZWN0aW9uTWVzc2FnZSwgW3NlbGVjdGVkSXRlbV0sIF9leHRlbmRzKHtcbiAgICBpc0luaXRpYWxNb3VudDogaXNJbml0aWFsTW91bnRSZWYuY3VycmVudCxcbiAgICBwcmV2aW91c1Jlc3VsdENvdW50OiBwcmV2aW91c1Jlc3VsdENvdW50UmVmLmN1cnJlbnQsXG4gICAgaXRlbXM6IGl0ZW1zLFxuICAgIGVudmlyb25tZW50OiBlbnZpcm9ubWVudCxcbiAgICBpdGVtVG9TdHJpbmc6IGl0ZW1Ub1N0cmluZ1xuICB9LCBzdGF0ZSkpO1xuICAvLyBTY3JvbGwgb24gaGlnaGxpZ2h0ZWQgaXRlbSBpZiBjaGFuZ2UgY29tZXMgZnJvbSBrZXlib2FyZC5cbiAgdmFyIHNob3VsZFNjcm9sbFJlZiA9IHVzZVNjcm9sbEludG9WaWV3KHtcbiAgICBtZW51RWxlbWVudDogbWVudVJlZi5jdXJyZW50LFxuICAgIGhpZ2hsaWdodGVkSW5kZXg6IGhpZ2hsaWdodGVkSW5kZXgsXG4gICAgaXNPcGVuOiBpc09wZW4sXG4gICAgaXRlbVJlZnM6IGl0ZW1SZWZzLFxuICAgIHNjcm9sbEludG9WaWV3OiBzY3JvbGxJbnRvVmlldyxcbiAgICBnZXRJdGVtTm9kZUZyb21JbmRleDogZ2V0SXRlbU5vZGVGcm9tSW5kZXhcbiAgfSk7XG4gIHVzZUNvbnRyb2xQcm9wc1ZhbGlkYXRvcih7XG4gICAgaXNJbml0aWFsTW91bnQ6IGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQsXG4gICAgcHJvcHM6IHByb3BzLFxuICAgIHN0YXRlOiBzdGF0ZVxuICB9KTtcbiAgLy8gRm9jdXMgdGhlIGlucHV0IG9uIGZpcnN0IHJlbmRlciBpZiByZXF1aXJlZC5cbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZm9jdXNPbk9wZW4gPSBpbml0aWFsSXNPcGVuIHx8IGRlZmF1bHRJc09wZW4gfHwgaXNPcGVuO1xuICAgIGlmIChmb2N1c09uT3BlbiAmJiBpbnB1dFJlZi5jdXJyZW50KSB7XG4gICAgICBpbnB1dFJlZi5jdXJyZW50LmZvY3VzKCk7XG4gICAgfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgfSwgW10pO1xuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlmIChpc0luaXRpYWxNb3VudFJlZi5jdXJyZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHByZXZpb3VzUmVzdWx0Q291bnRSZWYuY3VycmVudCA9IGl0ZW1zLmxlbmd0aDtcbiAgfSk7XG4gIC8vIEFkZCBtb3VzZS90b3VjaCBldmVudHMgdG8gZG9jdW1lbnQuXG4gIHZhciBtb3VzZUFuZFRvdWNoVHJhY2tlcnNSZWYgPSB1c2VNb3VzZUFuZFRvdWNoVHJhY2tlcihpc09wZW4sIFtpbnB1dFJlZiwgbWVudVJlZiwgdG9nZ2xlQnV0dG9uUmVmXSwgZW52aXJvbm1lbnQsIGZ1bmN0aW9uICgpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBJbnB1dEJsdXIsXG4gICAgICBzZWxlY3RJdGVtOiBmYWxzZVxuICAgIH0pO1xuICB9KTtcbiAgdmFyIHNldEdldHRlclByb3BDYWxsSW5mbyA9IHVzZUdldHRlclByb3BzQ2FsbGVkQ2hlY2tlcignZ2V0SW5wdXRQcm9wcycsICdnZXRNZW51UHJvcHMnKTtcbiAgLy8gTWFrZSBpbml0aWFsIHJlZiBmYWxzZS5cbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBpc0luaXRpYWxNb3VudFJlZi5jdXJyZW50ID0gZmFsc2U7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQgPSB0cnVlO1xuICAgIH07XG4gIH0sIFtdKTtcbiAgLy8gUmVzZXQgaXRlbVJlZnMgb24gY2xvc2UuXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9lbnZpcm9ubWVudCRkb2N1bWVudDtcbiAgICBpZiAoIWlzT3Blbikge1xuICAgICAgaXRlbVJlZnMuY3VycmVudCA9IHt9O1xuICAgIH0gZWxzZSBpZiAoKChfZW52aXJvbm1lbnQkZG9jdW1lbnQgPSBlbnZpcm9ubWVudC5kb2N1bWVudCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9lbnZpcm9ubWVudCRkb2N1bWVudC5hY3RpdmVFbGVtZW50KSAhPT0gaW5wdXRSZWYuY3VycmVudCkge1xuICAgICAgdmFyIF9pbnB1dFJlZiRjdXJyZW50O1xuICAgICAgaW5wdXRSZWYgPT0gbnVsbCB8fCAoX2lucHV0UmVmJGN1cnJlbnQgPSBpbnB1dFJlZi5jdXJyZW50KSA9PSBudWxsID8gdm9pZCAwIDogX2lucHV0UmVmJGN1cnJlbnQuZm9jdXMoKTtcbiAgICB9XG4gIH0sIFtpc09wZW4sIGVudmlyb25tZW50XSk7XG5cbiAgLyogRXZlbnQgaGFuZGxlciBmdW5jdGlvbnMgKi9cbiAgdmFyIGlucHV0S2V5RG93bkhhbmRsZXJzID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIEFycm93RG93bjogZnVuY3Rpb24gQXJyb3dEb3duKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBJbnB1dEtleURvd25BcnJvd0Rvd24sXG4gICAgICAgICAgYWx0S2V5OiBldmVudC5hbHRLZXksXG4gICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIEFycm93VXA6IGZ1bmN0aW9uIEFycm93VXAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IElucHV0S2V5RG93bkFycm93VXAsXG4gICAgICAgICAgYWx0S2V5OiBldmVudC5hbHRLZXksXG4gICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIEhvbWU6IGZ1bmN0aW9uIEhvbWUoZXZlbnQpIHtcbiAgICAgICAgaWYgKCFsYXRlc3QuY3VycmVudC5zdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IElucHV0S2V5RG93bkhvbWUsXG4gICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIEVuZDogZnVuY3Rpb24gRW5kKGV2ZW50KSB7XG4gICAgICAgIGlmICghbGF0ZXN0LmN1cnJlbnQuc3RhdGUuaXNPcGVuKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBJbnB1dEtleURvd25FbmQsXG4gICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIEVzY2FwZTogZnVuY3Rpb24gRXNjYXBlKGV2ZW50KSB7XG4gICAgICAgIHZhciBsYXRlc3RTdGF0ZSA9IGxhdGVzdC5jdXJyZW50LnN0YXRlO1xuICAgICAgICBpZiAobGF0ZXN0U3RhdGUuaXNPcGVuIHx8IGxhdGVzdFN0YXRlLmlucHV0VmFsdWUgfHwgbGF0ZXN0U3RhdGUuc2VsZWN0ZWRJdGVtIHx8IGxhdGVzdFN0YXRlLmhpZ2hsaWdodGVkSW5kZXggPiAtMSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogSW5wdXRLZXlEb3duRXNjYXBlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBFbnRlcjogZnVuY3Rpb24gRW50ZXIoZXZlbnQpIHtcbiAgICAgICAgdmFyIGxhdGVzdFN0YXRlID0gbGF0ZXN0LmN1cnJlbnQuc3RhdGU7XG4gICAgICAgIC8vIGlmIGNsb3NlZCBvciBubyBoaWdobGlnaHRlZCBpbmRleCwgZG8gbm90aGluZy5cbiAgICAgICAgaWYgKCFsYXRlc3RTdGF0ZS5pc09wZW4gfHwgZXZlbnQud2hpY2ggPT09IDIyOSAvLyBpZiBJTUUgY29tcG9zaW5nLCB3YWl0IGZvciBuZXh0IEVudGVyIGtleWRvd24gZXZlbnQuXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogSW5wdXRLZXlEb3duRW50ZXIsXG4gICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIFBhZ2VVcDogZnVuY3Rpb24gUGFnZVVwKGV2ZW50KSB7XG4gICAgICAgIGlmIChsYXRlc3QuY3VycmVudC5zdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IElucHV0S2V5RG93blBhZ2VVcCxcbiAgICAgICAgICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4OiBnZXRJdGVtTm9kZUZyb21JbmRleFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgUGFnZURvd246IGZ1bmN0aW9uIFBhZ2VEb3duKGV2ZW50KSB7XG4gICAgICAgIGlmIChsYXRlc3QuY3VycmVudC5zdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IElucHV0S2V5RG93blBhZ2VEb3duLFxuICAgICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9LCBbZGlzcGF0Y2gsIGxhdGVzdCwgZ2V0SXRlbU5vZGVGcm9tSW5kZXhdKTtcblxuICAvLyBHZXR0ZXIgcHJvcHMuXG4gIHZhciBnZXRMYWJlbFByb3BzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGxhYmVsUHJvcHMpIHtcbiAgICByZXR1cm4gX2V4dGVuZHMoe1xuICAgICAgaWQ6IGVsZW1lbnRJZHMubGFiZWxJZCxcbiAgICAgIGh0bWxGb3I6IGVsZW1lbnRJZHMuaW5wdXRJZFxuICAgIH0sIGxhYmVsUHJvcHMpO1xuICB9LCBbZWxlbWVudElkc10pO1xuICB2YXIgZ2V0TWVudVByb3BzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKF90ZW1wLCBfdGVtcDIpIHtcbiAgICB2YXIgX2V4dGVuZHMyO1xuICAgIHZhciBfcmVmID0gX3RlbXAgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAsXG4gICAgICBvbk1vdXNlTGVhdmUgPSBfcmVmLm9uTW91c2VMZWF2ZSxcbiAgICAgIF9yZWYkcmVmS2V5ID0gX3JlZi5yZWZLZXksXG4gICAgICByZWZLZXkgPSBfcmVmJHJlZktleSA9PT0gdm9pZCAwID8gJ3JlZicgOiBfcmVmJHJlZktleSxcbiAgICAgIHJlZiA9IF9yZWYucmVmLFxuICAgICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWYsIF9leGNsdWRlZCQxKTtcbiAgICB2YXIgX3JlZjIgPSBfdGVtcDIgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAyLFxuICAgICAgX3JlZjIkc3VwcHJlc3NSZWZFcnJvID0gX3JlZjIuc3VwcHJlc3NSZWZFcnJvcixcbiAgICAgIHN1cHByZXNzUmVmRXJyb3IgPSBfcmVmMiRzdXBwcmVzc1JlZkVycm8gPT09IHZvaWQgMCA/IGZhbHNlIDogX3JlZjIkc3VwcHJlc3NSZWZFcnJvO1xuICAgIHNldEdldHRlclByb3BDYWxsSW5mbygnZ2V0TWVudVByb3BzJywgc3VwcHJlc3NSZWZFcnJvciwgcmVmS2V5LCBtZW51UmVmKTtcbiAgICByZXR1cm4gX2V4dGVuZHMoKF9leHRlbmRzMiA9IHt9LCBfZXh0ZW5kczJbcmVmS2V5XSA9IGhhbmRsZVJlZnMocmVmLCBmdW5jdGlvbiAobWVudU5vZGUpIHtcbiAgICAgIG1lbnVSZWYuY3VycmVudCA9IG1lbnVOb2RlO1xuICAgIH0pLCBfZXh0ZW5kczIuaWQgPSBlbGVtZW50SWRzLm1lbnVJZCwgX2V4dGVuZHMyLnJvbGUgPSAnbGlzdGJveCcsIF9leHRlbmRzMlsnYXJpYS1sYWJlbGxlZGJ5J10gPSByZXN0ICYmIHJlc3RbJ2FyaWEtbGFiZWwnXSA/IHVuZGVmaW5lZCA6IFwiXCIgKyBlbGVtZW50SWRzLmxhYmVsSWQsIF9leHRlbmRzMi5vbk1vdXNlTGVhdmUgPSBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbk1vdXNlTGVhdmUsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogTWVudU1vdXNlTGVhdmVcbiAgICAgIH0pO1xuICAgIH0pLCBfZXh0ZW5kczIpLCByZXN0KTtcbiAgfSwgW2Rpc3BhdGNoLCBzZXRHZXR0ZXJQcm9wQ2FsbEluZm8sIGVsZW1lbnRJZHNdKTtcbiAgdmFyIGdldEl0ZW1Qcm9wcyA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChfdGVtcDMpIHtcbiAgICB2YXIgX2V4dGVuZHMzLCBfcmVmNDtcbiAgICB2YXIgX3JlZjMgPSBfdGVtcDMgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAzLFxuICAgICAgaXRlbVByb3AgPSBfcmVmMy5pdGVtLFxuICAgICAgaW5kZXhQcm9wID0gX3JlZjMuaW5kZXgsXG4gICAgICBfcmVmMyRyZWZLZXkgPSBfcmVmMy5yZWZLZXksXG4gICAgICByZWZLZXkgPSBfcmVmMyRyZWZLZXkgPT09IHZvaWQgMCA/ICdyZWYnIDogX3JlZjMkcmVmS2V5LFxuICAgICAgcmVmID0gX3JlZjMucmVmLFxuICAgICAgb25Nb3VzZU1vdmUgPSBfcmVmMy5vbk1vdXNlTW92ZSxcbiAgICAgIG9uTW91c2VEb3duID0gX3JlZjMub25Nb3VzZURvd24sXG4gICAgICBvbkNsaWNrID0gX3JlZjMub25DbGljaztcbiAgICAgIF9yZWYzLm9uUHJlc3M7XG4gICAgICB2YXIgZGlzYWJsZWQgPSBfcmVmMy5kaXNhYmxlZCxcbiAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmMywgX2V4Y2x1ZGVkMiQxKTtcbiAgICB2YXIgX2xhdGVzdCRjdXJyZW50ID0gbGF0ZXN0LmN1cnJlbnQsXG4gICAgICBsYXRlc3RQcm9wcyA9IF9sYXRlc3QkY3VycmVudC5wcm9wcyxcbiAgICAgIGxhdGVzdFN0YXRlID0gX2xhdGVzdCRjdXJyZW50LnN0YXRlO1xuICAgIHZhciBfZ2V0SXRlbUFuZEluZGV4ID0gZ2V0SXRlbUFuZEluZGV4KGl0ZW1Qcm9wLCBpbmRleFByb3AsIGxhdGVzdFByb3BzLml0ZW1zLCAnUGFzcyBlaXRoZXIgaXRlbSBvciBpbmRleCB0byBnZXRJdGVtUHJvcHMhJyksXG4gICAgICBpbmRleCA9IF9nZXRJdGVtQW5kSW5kZXhbMV07XG4gICAgdmFyIG9uU2VsZWN0S2V5ID0gJ29uQ2xpY2snO1xuICAgIHZhciBjdXN0b21DbGlja0hhbmRsZXIgPSBvbkNsaWNrO1xuICAgIHZhciBpdGVtSGFuZGxlTW91c2VNb3ZlID0gZnVuY3Rpb24gaXRlbUhhbmRsZU1vdXNlTW92ZSgpIHtcbiAgICAgIGlmIChpbmRleCA9PT0gbGF0ZXN0U3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzaG91bGRTY3JvbGxSZWYuY3VycmVudCA9IGZhbHNlO1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBJdGVtTW91c2VNb3ZlLFxuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIGRpc2FibGVkOiBkaXNhYmxlZFxuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgaXRlbUhhbmRsZUNsaWNrID0gZnVuY3Rpb24gaXRlbUhhbmRsZUNsaWNrKCkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBJdGVtQ2xpY2ssXG4gICAgICAgIGluZGV4OiBpbmRleFxuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgaXRlbUhhbmRsZU1vdXNlRG93biA9IGZ1bmN0aW9uIGl0ZW1IYW5kbGVNb3VzZURvd24oZSkge1xuICAgICAgcmV0dXJuIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9O1xuICAgIHJldHVybiBfZXh0ZW5kcygoX2V4dGVuZHMzID0ge30sIF9leHRlbmRzM1tyZWZLZXldID0gaGFuZGxlUmVmcyhyZWYsIGZ1bmN0aW9uIChpdGVtTm9kZSkge1xuICAgICAgaWYgKGl0ZW1Ob2RlKSB7XG4gICAgICAgIGl0ZW1SZWZzLmN1cnJlbnRbZWxlbWVudElkcy5nZXRJdGVtSWQoaW5kZXgpXSA9IGl0ZW1Ob2RlO1xuICAgICAgfVxuICAgIH0pLCBfZXh0ZW5kczMuZGlzYWJsZWQgPSBkaXNhYmxlZCwgX2V4dGVuZHMzLnJvbGUgPSAnb3B0aW9uJywgX2V4dGVuZHMzWydhcmlhLXNlbGVjdGVkJ10gPSBcIlwiICsgKGluZGV4ID09PSBsYXRlc3RTdGF0ZS5oaWdobGlnaHRlZEluZGV4KSwgX2V4dGVuZHMzLmlkID0gZWxlbWVudElkcy5nZXRJdGVtSWQoaW5kZXgpLCBfZXh0ZW5kczMpLCAhZGlzYWJsZWQgJiYgKF9yZWY0ID0ge30sIF9yZWY0W29uU2VsZWN0S2V5XSA9IGNhbGxBbGxFdmVudEhhbmRsZXJzKGN1c3RvbUNsaWNrSGFuZGxlciwgaXRlbUhhbmRsZUNsaWNrKSwgX3JlZjQpLCB7XG4gICAgICBvbk1vdXNlTW92ZTogY2FsbEFsbEV2ZW50SGFuZGxlcnMob25Nb3VzZU1vdmUsIGl0ZW1IYW5kbGVNb3VzZU1vdmUpLFxuICAgICAgb25Nb3VzZURvd246IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uTW91c2VEb3duLCBpdGVtSGFuZGxlTW91c2VEb3duKVxuICAgIH0sIHJlc3QpO1xuICB9LCBbZGlzcGF0Y2gsIGxhdGVzdCwgc2hvdWxkU2Nyb2xsUmVmLCBlbGVtZW50SWRzXSk7XG4gIHZhciBnZXRUb2dnbGVCdXR0b25Qcm9wcyA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChfdGVtcDQpIHtcbiAgICB2YXIgX2V4dGVuZHM0O1xuICAgIHZhciBfcmVmNSA9IF90ZW1wNCA9PT0gdm9pZCAwID8ge30gOiBfdGVtcDQsXG4gICAgICBvbkNsaWNrID0gX3JlZjUub25DbGljaztcbiAgICAgIF9yZWY1Lm9uUHJlc3M7XG4gICAgICB2YXIgX3JlZjUkcmVmS2V5ID0gX3JlZjUucmVmS2V5LFxuICAgICAgcmVmS2V5ID0gX3JlZjUkcmVmS2V5ID09PSB2b2lkIDAgPyAncmVmJyA6IF9yZWY1JHJlZktleSxcbiAgICAgIHJlZiA9IF9yZWY1LnJlZixcbiAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmNSwgX2V4Y2x1ZGVkMyk7XG4gICAgdmFyIGxhdGVzdFN0YXRlID0gbGF0ZXN0LmN1cnJlbnQuc3RhdGU7XG4gICAgdmFyIHRvZ2dsZUJ1dHRvbkhhbmRsZUNsaWNrID0gZnVuY3Rpb24gdG9nZ2xlQnV0dG9uSGFuZGxlQ2xpY2soKSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IFRvZ2dsZUJ1dHRvbkNsaWNrXG4gICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBfZXh0ZW5kcygoX2V4dGVuZHM0ID0ge30sIF9leHRlbmRzNFtyZWZLZXldID0gaGFuZGxlUmVmcyhyZWYsIGZ1bmN0aW9uICh0b2dnbGVCdXR0b25Ob2RlKSB7XG4gICAgICB0b2dnbGVCdXR0b25SZWYuY3VycmVudCA9IHRvZ2dsZUJ1dHRvbk5vZGU7XG4gICAgfSksIF9leHRlbmRzNFsnYXJpYS1jb250cm9scyddID0gZWxlbWVudElkcy5tZW51SWQsIF9leHRlbmRzNFsnYXJpYS1leHBhbmRlZCddID0gbGF0ZXN0U3RhdGUuaXNPcGVuLCBfZXh0ZW5kczQuaWQgPSBlbGVtZW50SWRzLnRvZ2dsZUJ1dHRvbklkLCBfZXh0ZW5kczQudGFiSW5kZXggPSAtMSwgX2V4dGVuZHM0KSwgIXJlc3QuZGlzYWJsZWQgJiYgX2V4dGVuZHMoe30sIHtcbiAgICAgIG9uQ2xpY2s6IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uQ2xpY2ssIHRvZ2dsZUJ1dHRvbkhhbmRsZUNsaWNrKVxuICAgIH0pLCByZXN0KTtcbiAgfSwgW2Rpc3BhdGNoLCBsYXRlc3QsIGVsZW1lbnRJZHNdKTtcbiAgdmFyIGdldElucHV0UHJvcHMgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoX3RlbXA1LCBfdGVtcDYpIHtcbiAgICB2YXIgX2V4dGVuZHM1O1xuICAgIHZhciBfcmVmNiA9IF90ZW1wNSA9PT0gdm9pZCAwID8ge30gOiBfdGVtcDUsXG4gICAgICBvbktleURvd24gPSBfcmVmNi5vbktleURvd24sXG4gICAgICBvbkNoYW5nZSA9IF9yZWY2Lm9uQ2hhbmdlLFxuICAgICAgb25JbnB1dCA9IF9yZWY2Lm9uSW5wdXQsXG4gICAgICBvbkZvY3VzID0gX3JlZjYub25Gb2N1cyxcbiAgICAgIG9uQmx1ciA9IF9yZWY2Lm9uQmx1cjtcbiAgICAgIF9yZWY2Lm9uQ2hhbmdlVGV4dDtcbiAgICAgIHZhciBfcmVmNiRyZWZLZXkgPSBfcmVmNi5yZWZLZXksXG4gICAgICByZWZLZXkgPSBfcmVmNiRyZWZLZXkgPT09IHZvaWQgMCA/ICdyZWYnIDogX3JlZjYkcmVmS2V5LFxuICAgICAgcmVmID0gX3JlZjYucmVmLFxuICAgICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWY2LCBfZXhjbHVkZWQ0KTtcbiAgICB2YXIgX3JlZjcgPSBfdGVtcDYgPT09IHZvaWQgMCA/IHt9IDogX3RlbXA2LFxuICAgICAgX3JlZjckc3VwcHJlc3NSZWZFcnJvID0gX3JlZjcuc3VwcHJlc3NSZWZFcnJvcixcbiAgICAgIHN1cHByZXNzUmVmRXJyb3IgPSBfcmVmNyRzdXBwcmVzc1JlZkVycm8gPT09IHZvaWQgMCA/IGZhbHNlIDogX3JlZjckc3VwcHJlc3NSZWZFcnJvO1xuICAgIHNldEdldHRlclByb3BDYWxsSW5mbygnZ2V0SW5wdXRQcm9wcycsIHN1cHByZXNzUmVmRXJyb3IsIHJlZktleSwgaW5wdXRSZWYpO1xuICAgIHZhciBsYXRlc3RTdGF0ZSA9IGxhdGVzdC5jdXJyZW50LnN0YXRlO1xuICAgIHZhciBpbnB1dEhhbmRsZUtleURvd24gPSBmdW5jdGlvbiBpbnB1dEhhbmRsZUtleURvd24oZXZlbnQpIHtcbiAgICAgIHZhciBrZXkgPSBub3JtYWxpemVBcnJvd0tleShldmVudCk7XG4gICAgICBpZiAoa2V5ICYmIGlucHV0S2V5RG93bkhhbmRsZXJzW2tleV0pIHtcbiAgICAgICAgaW5wdXRLZXlEb3duSGFuZGxlcnNba2V5XShldmVudCk7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgaW5wdXRIYW5kbGVDaGFuZ2UgPSBmdW5jdGlvbiBpbnB1dEhhbmRsZUNoYW5nZShldmVudCkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBJbnB1dENoYW5nZSxcbiAgICAgICAgaW5wdXRWYWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlXG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBpbnB1dEhhbmRsZUJsdXIgPSBmdW5jdGlvbiBpbnB1dEhhbmRsZUJsdXIoZXZlbnQpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAobGF0ZXN0U3RhdGUuaXNPcGVuICYmICFtb3VzZUFuZFRvdWNoVHJhY2tlcnNSZWYuY3VycmVudC5pc01vdXNlRG93bikge1xuICAgICAgICB2YXIgaXNCbHVyQnlUYWJDaGFuZ2UgPSBldmVudC5yZWxhdGVkVGFyZ2V0ID09PSBudWxsICYmIGVudmlyb25tZW50LmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGVudmlyb25tZW50LmRvY3VtZW50LmJvZHk7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBJbnB1dEJsdXIsXG4gICAgICAgICAgc2VsZWN0SXRlbTogIWlzQmx1ckJ5VGFiQ2hhbmdlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGlucHV0SGFuZGxlRm9jdXMgPSBmdW5jdGlvbiBpbnB1dEhhbmRsZUZvY3VzKCkge1xuICAgICAgaWYgKCFsYXRlc3RTdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IElucHV0Rm9jdXNcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0IChwcmVhY3QpICovXG4gICAgdmFyIG9uQ2hhbmdlS2V5ID0gJ29uQ2hhbmdlJztcbiAgICB2YXIgZXZlbnRIYW5kbGVycyA9IHt9O1xuICAgIGlmICghcmVzdC5kaXNhYmxlZCkge1xuICAgICAgdmFyIF9ldmVudEhhbmRsZXJzO1xuICAgICAgZXZlbnRIYW5kbGVycyA9IChfZXZlbnRIYW5kbGVycyA9IHt9LCBfZXZlbnRIYW5kbGVyc1tvbkNoYW5nZUtleV0gPSBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbkNoYW5nZSwgb25JbnB1dCwgaW5wdXRIYW5kbGVDaGFuZ2UpLCBfZXZlbnRIYW5kbGVycy5vbktleURvd24gPSBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbktleURvd24sIGlucHV0SGFuZGxlS2V5RG93biksIF9ldmVudEhhbmRsZXJzLm9uQmx1ciA9IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uQmx1ciwgaW5wdXRIYW5kbGVCbHVyKSwgX2V2ZW50SGFuZGxlcnMub25Gb2N1cyA9IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uRm9jdXMsIGlucHV0SGFuZGxlRm9jdXMpLCBfZXZlbnRIYW5kbGVycyk7XG4gICAgfVxuICAgIHJldHVybiBfZXh0ZW5kcygoX2V4dGVuZHM1ID0ge30sIF9leHRlbmRzNVtyZWZLZXldID0gaGFuZGxlUmVmcyhyZWYsIGZ1bmN0aW9uIChpbnB1dE5vZGUpIHtcbiAgICAgIGlucHV0UmVmLmN1cnJlbnQgPSBpbnB1dE5vZGU7XG4gICAgfSksIF9leHRlbmRzNVsnYXJpYS1hY3RpdmVkZXNjZW5kYW50J10gPSBsYXRlc3RTdGF0ZS5pc09wZW4gJiYgbGF0ZXN0U3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCA+IC0xID8gZWxlbWVudElkcy5nZXRJdGVtSWQobGF0ZXN0U3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCkgOiAnJywgX2V4dGVuZHM1WydhcmlhLWF1dG9jb21wbGV0ZSddID0gJ2xpc3QnLCBfZXh0ZW5kczVbJ2FyaWEtY29udHJvbHMnXSA9IGVsZW1lbnRJZHMubWVudUlkLCBfZXh0ZW5kczVbJ2FyaWEtZXhwYW5kZWQnXSA9IGxhdGVzdFN0YXRlLmlzT3BlbiwgX2V4dGVuZHM1WydhcmlhLWxhYmVsbGVkYnknXSA9IHJlc3QgJiYgcmVzdFsnYXJpYS1sYWJlbCddID8gdW5kZWZpbmVkIDogXCJcIiArIGVsZW1lbnRJZHMubGFiZWxJZCwgX2V4dGVuZHM1LmF1dG9Db21wbGV0ZSA9ICdvZmYnLCBfZXh0ZW5kczUuaWQgPSBlbGVtZW50SWRzLmlucHV0SWQsIF9leHRlbmRzNS5yb2xlID0gJ2NvbWJvYm94JywgX2V4dGVuZHM1LnZhbHVlID0gbGF0ZXN0U3RhdGUuaW5wdXRWYWx1ZSwgX2V4dGVuZHM1KSwgZXZlbnRIYW5kbGVycywgcmVzdCk7XG4gIH0sIFtzZXRHZXR0ZXJQcm9wQ2FsbEluZm8sIGxhdGVzdCwgZWxlbWVudElkcywgaW5wdXRLZXlEb3duSGFuZGxlcnMsIGRpc3BhdGNoLCBtb3VzZUFuZFRvdWNoVHJhY2tlcnNSZWYsIGVudmlyb25tZW50XSk7XG5cbiAgLy8gcmV0dXJuc1xuICB2YXIgdG9nZ2xlTWVudSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICgpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBGdW5jdGlvblRvZ2dsZU1lbnVcbiAgICB9KTtcbiAgfSwgW2Rpc3BhdGNoXSk7XG4gIHZhciBjbG9zZU1lbnUgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25DbG9zZU1lbnVcbiAgICB9KTtcbiAgfSwgW2Rpc3BhdGNoXSk7XG4gIHZhciBvcGVuTWVudSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICgpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBGdW5jdGlvbk9wZW5NZW51XG4gICAgfSk7XG4gIH0sIFtkaXNwYXRjaF0pO1xuICB2YXIgc2V0SGlnaGxpZ2h0ZWRJbmRleCA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChuZXdIaWdobGlnaHRlZEluZGV4KSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25TZXRIaWdobGlnaHRlZEluZGV4LFxuICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogbmV3SGlnaGxpZ2h0ZWRJbmRleFxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgdmFyIHNlbGVjdEl0ZW0gPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAobmV3U2VsZWN0ZWRJdGVtKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25TZWxlY3RJdGVtLFxuICAgICAgc2VsZWN0ZWRJdGVtOiBuZXdTZWxlY3RlZEl0ZW1cbiAgICB9KTtcbiAgfSwgW2Rpc3BhdGNoXSk7XG4gIHZhciBzZXRJbnB1dFZhbHVlID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKG5ld0lucHV0VmFsdWUpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBGdW5jdGlvblNldElucHV0VmFsdWUsXG4gICAgICBpbnB1dFZhbHVlOiBuZXdJbnB1dFZhbHVlXG4gICAgfSk7XG4gIH0sIFtkaXNwYXRjaF0pO1xuICB2YXIgcmVzZXQgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25SZXNldCQxXG4gICAgfSk7XG4gIH0sIFtkaXNwYXRjaF0pO1xuICByZXR1cm4ge1xuICAgIC8vIHByb3AgZ2V0dGVycy5cbiAgICBnZXRJdGVtUHJvcHM6IGdldEl0ZW1Qcm9wcyxcbiAgICBnZXRMYWJlbFByb3BzOiBnZXRMYWJlbFByb3BzLFxuICAgIGdldE1lbnVQcm9wczogZ2V0TWVudVByb3BzLFxuICAgIGdldElucHV0UHJvcHM6IGdldElucHV0UHJvcHMsXG4gICAgZ2V0VG9nZ2xlQnV0dG9uUHJvcHM6IGdldFRvZ2dsZUJ1dHRvblByb3BzLFxuICAgIC8vIGFjdGlvbnMuXG4gICAgdG9nZ2xlTWVudTogdG9nZ2xlTWVudSxcbiAgICBvcGVuTWVudTogb3Blbk1lbnUsXG4gICAgY2xvc2VNZW51OiBjbG9zZU1lbnUsXG4gICAgc2V0SGlnaGxpZ2h0ZWRJbmRleDogc2V0SGlnaGxpZ2h0ZWRJbmRleCxcbiAgICBzZXRJbnB1dFZhbHVlOiBzZXRJbnB1dFZhbHVlLFxuICAgIHNlbGVjdEl0ZW06IHNlbGVjdEl0ZW0sXG4gICAgcmVzZXQ6IHJlc2V0LFxuICAgIC8vIHN0YXRlLlxuICAgIGhpZ2hsaWdodGVkSW5kZXg6IGhpZ2hsaWdodGVkSW5kZXgsXG4gICAgaXNPcGVuOiBpc09wZW4sXG4gICAgc2VsZWN0ZWRJdGVtOiBzZWxlY3RlZEl0ZW0sXG4gICAgaW5wdXRWYWx1ZTogaW5wdXRWYWx1ZVxuICB9O1xufVxuXG52YXIgZGVmYXVsdFN0YXRlVmFsdWVzID0ge1xuICBhY3RpdmVJbmRleDogLTEsXG4gIHNlbGVjdGVkSXRlbXM6IFtdXG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGluaXRpYWwgdmFsdWUgZm9yIGEgc3RhdGUga2V5IGluIHRoZSBmb2xsb3dpbmcgb3JkZXI6XG4gKiAxLiBjb250cm9sbGVkIHByb3AsIDIuIGluaXRpYWwgcHJvcCwgMy4gZGVmYXVsdCBwcm9wLCA0LiBkZWZhdWx0XG4gKiB2YWx1ZSBmcm9tIERvd25zaGlmdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgUHJvcHMgcGFzc2VkIHRvIHRoZSBob29rLlxuICogQHBhcmFtIHtzdHJpbmd9IHByb3BLZXkgUHJvcHMga2V5IHRvIGdlbmVyYXRlIHRoZSB2YWx1ZSBmb3IuXG4gKiBAcmV0dXJucyB7YW55fSBUaGUgaW5pdGlhbCB2YWx1ZSBmb3IgdGhhdCBwcm9wLlxuICovXG5mdW5jdGlvbiBnZXRJbml0aWFsVmFsdWUocHJvcHMsIHByb3BLZXkpIHtcbiAgcmV0dXJuIGdldEluaXRpYWxWYWx1ZSQxKHByb3BzLCBwcm9wS2V5LCBkZWZhdWx0U3RhdGVWYWx1ZXMpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGRlZmF1bHQgdmFsdWUgZm9yIGEgc3RhdGUga2V5IGluIHRoZSBmb2xsb3dpbmcgb3JkZXI6XG4gKiAxLiBjb250cm9sbGVkIHByb3AsIDIuIGRlZmF1bHQgcHJvcCwgMy4gZGVmYXVsdCB2YWx1ZSBmcm9tIERvd25zaGlmdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgUHJvcHMgcGFzc2VkIHRvIHRoZSBob29rLlxuICogQHBhcmFtIHtzdHJpbmd9IHByb3BLZXkgUHJvcHMga2V5IHRvIGdlbmVyYXRlIHRoZSB2YWx1ZSBmb3IuXG4gKiBAcmV0dXJucyB7YW55fSBUaGUgaW5pdGlhbCB2YWx1ZSBmb3IgdGhhdCBwcm9wLlxuICovXG5mdW5jdGlvbiBnZXREZWZhdWx0VmFsdWUocHJvcHMsIHByb3BLZXkpIHtcbiAgcmV0dXJuIGdldERlZmF1bHRWYWx1ZSQxKHByb3BzLCBwcm9wS2V5LCBkZWZhdWx0U3RhdGVWYWx1ZXMpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGluaXRpYWwgc3RhdGUgYmFzZWQgb24gdGhlIHByb3ZpZGVkIHByb3BzLiBJdCB1c2VzIGluaXRpYWwsIGRlZmF1bHRcbiAqIGFuZCBjb250cm9sbGVkIHByb3BzIHJlbGF0ZWQgdG8gc3RhdGUgaW4gb3JkZXIgdG8gY29tcHV0ZSB0aGUgaW5pdGlhbCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgUHJvcHMgcGFzc2VkIHRvIHRoZSBob29rLlxuICogQHJldHVybnMge09iamVjdH0gVGhlIGluaXRpYWwgc3RhdGUuXG4gKi9cbmZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZShwcm9wcykge1xuICB2YXIgYWN0aXZlSW5kZXggPSBnZXRJbml0aWFsVmFsdWUocHJvcHMsICdhY3RpdmVJbmRleCcpO1xuICB2YXIgc2VsZWN0ZWRJdGVtcyA9IGdldEluaXRpYWxWYWx1ZShwcm9wcywgJ3NlbGVjdGVkSXRlbXMnKTtcbiAgcmV0dXJuIHtcbiAgICBhY3RpdmVJbmRleDogYWN0aXZlSW5kZXgsXG4gICAgc2VsZWN0ZWRJdGVtczogc2VsZWN0ZWRJdGVtc1xuICB9O1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBkcm9wZG93biBrZXlkb3duIG9wZXJhdGlvbiBpcyBwZXJtaXR0ZWQuIFNob3VsZCBub3QgYmVcbiAqIGFsbG93ZWQgb24ga2V5ZG93biB3aXRoIG1vZGlmaWVyIGtleXMgKGN0cmwsIGFsdCwgc2hpZnQsIG1ldGEpLCBvblxuICogaW5wdXQgZWxlbWVudCB3aXRoIHRleHQgY29udGVudCB0aGF0IGlzIGVpdGhlciBoaWdobGlnaHRlZCBvciBzZWxlY3Rpb25cbiAqIGN1cnNvciBpcyBub3QgYXQgdGhlIHN0YXJ0aW5nIHBvc2l0aW9uLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgVGhlIGV2ZW50IGZyb20ga2V5ZG93bi5cbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIHRoZSBvcGVyYXRpb24gaXMgYWxsb3dlZC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlEb3duT3BlcmF0aW9uUGVybWl0dGVkKGV2ZW50KSB7XG4gIGlmIChldmVudC5zaGlmdEtleSB8fCBldmVudC5tZXRhS2V5IHx8IGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQuYWx0S2V5KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiZcbiAgLy8gaWYgZWxlbWVudCBpcyBhIHRleHQgaW5wdXRcbiAgZWxlbWVudC52YWx1ZSAhPT0gJycgJiYgKFxuICAvLyBhbmQgd2UgaGF2ZSB0ZXh0IGluIGl0XG4gIC8vIGFuZCBjdXJzb3IgaXMgZWl0aGVyIG5vdCBhdCB0aGUgc3RhcnQgb3IgaXMgY3VycmVudGx5IGhpZ2hsaWdodGluZyB0ZXh0LlxuICBlbGVtZW50LnNlbGVjdGlvblN0YXJ0ICE9PSAwIHx8IGVsZW1lbnQuc2VsZWN0aW9uRW5kICE9PSAwKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgbWVzc2FnZSB0byBiZSBhZGRlZCB0byBhcmlhLWxpdmUgcmVnaW9uIHdoZW4gaXRlbSBpcyByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZWxlY3Rpb25QYXJhbWV0ZXJzIFBhcmFtZXRlcnMgcmVxdWlyZWQgdG8gYnVpbGQgdGhlIG1lc3NhZ2UuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgYTExeSBtZXNzYWdlLlxuICovXG5mdW5jdGlvbiBnZXRBMTF5UmVtb3ZhbE1lc3NhZ2Uoc2VsZWN0aW9uUGFyYW1ldGVycykge1xuICB2YXIgcmVtb3ZlZFNlbGVjdGVkSXRlbSA9IHNlbGVjdGlvblBhcmFtZXRlcnMucmVtb3ZlZFNlbGVjdGVkSXRlbSxcbiAgICBpdGVtVG9TdHJpbmdMb2NhbCA9IHNlbGVjdGlvblBhcmFtZXRlcnMuaXRlbVRvU3RyaW5nO1xuICByZXR1cm4gaXRlbVRvU3RyaW5nTG9jYWwocmVtb3ZlZFNlbGVjdGVkSXRlbSkgKyBcIiBoYXMgYmVlbiByZW1vdmVkLlwiO1xufVxudmFyIHByb3BUeXBlcyA9IHtcbiAgc2VsZWN0ZWRJdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICBpbml0aWFsU2VsZWN0ZWRJdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICBkZWZhdWx0U2VsZWN0ZWRJdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICBpdGVtVG9TdHJpbmc6IFByb3BUeXBlcy5mdW5jLFxuICBnZXRBMTF5UmVtb3ZhbE1lc3NhZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBzdGF0ZVJlZHVjZXI6IFByb3BUeXBlcy5mdW5jLFxuICBhY3RpdmVJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgaW5pdGlhbEFjdGl2ZUluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICBkZWZhdWx0QWN0aXZlSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9uQWN0aXZlSW5kZXhDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvblNlbGVjdGVkSXRlbXNDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBrZXlOYXZpZ2F0aW9uTmV4dDogUHJvcFR5cGVzLnN0cmluZyxcbiAga2V5TmF2aWdhdGlvblByZXZpb3VzOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBlbnZpcm9ubWVudDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICBhZGRFdmVudExpc3RlbmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICByZW1vdmVFdmVudExpc3RlbmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBkb2N1bWVudDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGdldEVsZW1lbnRCeUlkOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgIGFjdGl2ZUVsZW1lbnQ6IFByb3BUeXBlcy5hbnksXG4gICAgICBib2R5OiBQcm9wVHlwZXMuYW55XG4gICAgfSlcbiAgfSlcbn07XG52YXIgZGVmYXVsdFByb3BzID0ge1xuICBpdGVtVG9TdHJpbmc6IGRlZmF1bHRQcm9wcyQzLml0ZW1Ub1N0cmluZyxcbiAgc3RhdGVSZWR1Y2VyOiBkZWZhdWx0UHJvcHMkMy5zdGF0ZVJlZHVjZXIsXG4gIGVudmlyb25tZW50OiBkZWZhdWx0UHJvcHMkMy5lbnZpcm9ubWVudCxcbiAgZ2V0QTExeVJlbW92YWxNZXNzYWdlOiBnZXRBMTF5UmVtb3ZhbE1lc3NhZ2UsXG4gIGtleU5hdmlnYXRpb25OZXh0OiAnQXJyb3dSaWdodCcsXG4gIGtleU5hdmlnYXRpb25QcmV2aW91czogJ0Fycm93TGVmdCdcbn07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tbXV0YWJsZS1leHBvcnRzXG52YXIgdmFsaWRhdGVQcm9wVHlwZXMgPSBub29wO1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhbGlkYXRlUHJvcFR5cGVzID0gZnVuY3Rpb24gdmFsaWRhdGVQcm9wVHlwZXMob3B0aW9ucywgY2FsbGVyKSB7XG4gICAgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKHByb3BUeXBlcywgb3B0aW9ucywgJ3Byb3AnLCBjYWxsZXIubmFtZSk7XG4gIH07XG59XG5cbnZhciBTZWxlY3RlZEl0ZW1DbGljayA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3NlbGVjdGVkX2l0ZW1fY2xpY2tfXycgOiAwO1xudmFyIFNlbGVjdGVkSXRlbUtleURvd25EZWxldGUgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19zZWxlY3RlZF9pdGVtX2tleWRvd25fZGVsZXRlX18nIDogMTtcbnZhciBTZWxlY3RlZEl0ZW1LZXlEb3duQmFja3NwYWNlID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fc2VsZWN0ZWRfaXRlbV9rZXlkb3duX2JhY2tzcGFjZV9fJyA6IDI7XG52YXIgU2VsZWN0ZWRJdGVtS2V5RG93bk5hdmlnYXRpb25OZXh0ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fc2VsZWN0ZWRfaXRlbV9rZXlkb3duX25hdmlnYXRpb25fbmV4dF9fJyA6IDM7XG52YXIgU2VsZWN0ZWRJdGVtS2V5RG93bk5hdmlnYXRpb25QcmV2aW91cyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3NlbGVjdGVkX2l0ZW1fa2V5ZG93bl9uYXZpZ2F0aW9uX3ByZXZpb3VzX18nIDogNDtcbnZhciBEcm9wZG93bktleURvd25OYXZpZ2F0aW9uUHJldmlvdXMgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19kcm9wZG93bl9rZXlkb3duX25hdmlnYXRpb25fcHJldmlvdXNfXycgOiA1O1xudmFyIERyb3Bkb3duS2V5RG93bkJhY2tzcGFjZSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2Ryb3Bkb3duX2tleWRvd25fYmFja3NwYWNlX18nIDogNjtcbnZhciBEcm9wZG93bkNsaWNrID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fZHJvcGRvd25fY2xpY2tfXycgOiA3O1xudmFyIEZ1bmN0aW9uQWRkU2VsZWN0ZWRJdGVtID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fZnVuY3Rpb25fYWRkX3NlbGVjdGVkX2l0ZW1fXycgOiA4O1xudmFyIEZ1bmN0aW9uUmVtb3ZlU2VsZWN0ZWRJdGVtID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fZnVuY3Rpb25fcmVtb3ZlX3NlbGVjdGVkX2l0ZW1fXycgOiA5O1xudmFyIEZ1bmN0aW9uU2V0U2VsZWN0ZWRJdGVtcyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2Z1bmN0aW9uX3NldF9zZWxlY3RlZF9pdGVtc19fJyA6IDEwO1xudmFyIEZ1bmN0aW9uU2V0QWN0aXZlSW5kZXggPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9zZXRfYWN0aXZlX2luZGV4X18nIDogMTE7XG52YXIgRnVuY3Rpb25SZXNldCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2Z1bmN0aW9uX3Jlc2V0X18nIDogMTI7XG5cbnZhciBzdGF0ZUNoYW5nZVR5cGVzID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICBfX3Byb3RvX186IG51bGwsXG4gIFNlbGVjdGVkSXRlbUNsaWNrOiBTZWxlY3RlZEl0ZW1DbGljayxcbiAgU2VsZWN0ZWRJdGVtS2V5RG93bkRlbGV0ZTogU2VsZWN0ZWRJdGVtS2V5RG93bkRlbGV0ZSxcbiAgU2VsZWN0ZWRJdGVtS2V5RG93bkJhY2tzcGFjZTogU2VsZWN0ZWRJdGVtS2V5RG93bkJhY2tzcGFjZSxcbiAgU2VsZWN0ZWRJdGVtS2V5RG93bk5hdmlnYXRpb25OZXh0OiBTZWxlY3RlZEl0ZW1LZXlEb3duTmF2aWdhdGlvbk5leHQsXG4gIFNlbGVjdGVkSXRlbUtleURvd25OYXZpZ2F0aW9uUHJldmlvdXM6IFNlbGVjdGVkSXRlbUtleURvd25OYXZpZ2F0aW9uUHJldmlvdXMsXG4gIERyb3Bkb3duS2V5RG93bk5hdmlnYXRpb25QcmV2aW91czogRHJvcGRvd25LZXlEb3duTmF2aWdhdGlvblByZXZpb3VzLFxuICBEcm9wZG93bktleURvd25CYWNrc3BhY2U6IERyb3Bkb3duS2V5RG93bkJhY2tzcGFjZSxcbiAgRHJvcGRvd25DbGljazogRHJvcGRvd25DbGljayxcbiAgRnVuY3Rpb25BZGRTZWxlY3RlZEl0ZW06IEZ1bmN0aW9uQWRkU2VsZWN0ZWRJdGVtLFxuICBGdW5jdGlvblJlbW92ZVNlbGVjdGVkSXRlbTogRnVuY3Rpb25SZW1vdmVTZWxlY3RlZEl0ZW0sXG4gIEZ1bmN0aW9uU2V0U2VsZWN0ZWRJdGVtczogRnVuY3Rpb25TZXRTZWxlY3RlZEl0ZW1zLFxuICBGdW5jdGlvblNldEFjdGl2ZUluZGV4OiBGdW5jdGlvblNldEFjdGl2ZUluZGV4LFxuICBGdW5jdGlvblJlc2V0OiBGdW5jdGlvblJlc2V0XG59KTtcblxuLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSAqL1xuZnVuY3Rpb24gZG93bnNoaWZ0TXVsdGlwbGVTZWxlY3Rpb25SZWR1Y2VyKHN0YXRlLCBhY3Rpb24pIHtcbiAgdmFyIHR5cGUgPSBhY3Rpb24udHlwZSxcbiAgICBpbmRleCA9IGFjdGlvbi5pbmRleCxcbiAgICBwcm9wcyA9IGFjdGlvbi5wcm9wcyxcbiAgICBzZWxlY3RlZEl0ZW0gPSBhY3Rpb24uc2VsZWN0ZWRJdGVtO1xuICB2YXIgYWN0aXZlSW5kZXggPSBzdGF0ZS5hY3RpdmVJbmRleCxcbiAgICBzZWxlY3RlZEl0ZW1zID0gc3RhdGUuc2VsZWN0ZWRJdGVtcztcbiAgdmFyIGNoYW5nZXM7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgU2VsZWN0ZWRJdGVtQ2xpY2s6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBhY3RpdmVJbmRleDogaW5kZXhcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIFNlbGVjdGVkSXRlbUtleURvd25OYXZpZ2F0aW9uUHJldmlvdXM6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBhY3RpdmVJbmRleDogYWN0aXZlSW5kZXggLSAxIDwgMCA/IDAgOiBhY3RpdmVJbmRleCAtIDFcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIFNlbGVjdGVkSXRlbUtleURvd25OYXZpZ2F0aW9uTmV4dDpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGFjdGl2ZUluZGV4OiBhY3RpdmVJbmRleCArIDEgPj0gc2VsZWN0ZWRJdGVtcy5sZW5ndGggPyAtMSA6IGFjdGl2ZUluZGV4ICsgMVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgU2VsZWN0ZWRJdGVtS2V5RG93bkJhY2tzcGFjZTpcbiAgICBjYXNlIFNlbGVjdGVkSXRlbUtleURvd25EZWxldGU6XG4gICAgICB7XG4gICAgICAgIGlmIChhY3RpdmVJbmRleCA8IDApIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmV3QWN0aXZlSW5kZXggPSBhY3RpdmVJbmRleDtcbiAgICAgICAgaWYgKHNlbGVjdGVkSXRlbXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgbmV3QWN0aXZlSW5kZXggPSAtMTtcbiAgICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbmRleCA9PT0gc2VsZWN0ZWRJdGVtcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgbmV3QWN0aXZlSW5kZXggPSBzZWxlY3RlZEl0ZW1zLmxlbmd0aCAtIDI7XG4gICAgICAgIH1cbiAgICAgICAgY2hhbmdlcyA9IF9leHRlbmRzKHtcbiAgICAgICAgICBzZWxlY3RlZEl0ZW1zOiBbXS5jb25jYXQoc2VsZWN0ZWRJdGVtcy5zbGljZSgwLCBhY3RpdmVJbmRleCksIHNlbGVjdGVkSXRlbXMuc2xpY2UoYWN0aXZlSW5kZXggKyAxKSlcbiAgICAgICAgfSwge1xuICAgICAgICAgIGFjdGl2ZUluZGV4OiBuZXdBY3RpdmVJbmRleFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgY2FzZSBEcm9wZG93bktleURvd25OYXZpZ2F0aW9uUHJldmlvdXM6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBhY3RpdmVJbmRleDogc2VsZWN0ZWRJdGVtcy5sZW5ndGggLSAxXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBEcm9wZG93bktleURvd25CYWNrc3BhY2U6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBzZWxlY3RlZEl0ZW1zOiBzZWxlY3RlZEl0ZW1zLnNsaWNlKDAsIHNlbGVjdGVkSXRlbXMubGVuZ3RoIC0gMSlcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIEZ1bmN0aW9uQWRkU2VsZWN0ZWRJdGVtOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgc2VsZWN0ZWRJdGVtczogW10uY29uY2F0KHNlbGVjdGVkSXRlbXMsIFtzZWxlY3RlZEl0ZW1dKVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgRHJvcGRvd25DbGljazpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGFjdGl2ZUluZGV4OiAtMVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgRnVuY3Rpb25SZW1vdmVTZWxlY3RlZEl0ZW06XG4gICAgICB7XG4gICAgICAgIHZhciBfbmV3QWN0aXZlSW5kZXggPSBhY3RpdmVJbmRleDtcbiAgICAgICAgdmFyIHNlbGVjdGVkSXRlbUluZGV4ID0gc2VsZWN0ZWRJdGVtcy5pbmRleE9mKHNlbGVjdGVkSXRlbSk7XG4gICAgICAgIGlmIChzZWxlY3RlZEl0ZW1JbmRleCA8IDApIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZWN0ZWRJdGVtcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBfbmV3QWN0aXZlSW5kZXggPSAtMTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZEl0ZW1JbmRleCA9PT0gc2VsZWN0ZWRJdGVtcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgX25ld0FjdGl2ZUluZGV4ID0gc2VsZWN0ZWRJdGVtcy5sZW5ndGggLSAyO1xuICAgICAgICB9XG4gICAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgICAgc2VsZWN0ZWRJdGVtczogW10uY29uY2F0KHNlbGVjdGVkSXRlbXMuc2xpY2UoMCwgc2VsZWN0ZWRJdGVtSW5kZXgpLCBzZWxlY3RlZEl0ZW1zLnNsaWNlKHNlbGVjdGVkSXRlbUluZGV4ICsgMSkpLFxuICAgICAgICAgIGFjdGl2ZUluZGV4OiBfbmV3QWN0aXZlSW5kZXhcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgY2FzZSBGdW5jdGlvblNldFNlbGVjdGVkSXRlbXM6XG4gICAgICB7XG4gICAgICAgIHZhciBuZXdTZWxlY3RlZEl0ZW1zID0gYWN0aW9uLnNlbGVjdGVkSXRlbXM7XG4gICAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgICAgc2VsZWN0ZWRJdGVtczogbmV3U2VsZWN0ZWRJdGVtc1xuICAgICAgICB9O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICBjYXNlIEZ1bmN0aW9uU2V0QWN0aXZlSW5kZXg6XG4gICAgICB7XG4gICAgICAgIHZhciBfbmV3QWN0aXZlSW5kZXgyID0gYWN0aW9uLmFjdGl2ZUluZGV4O1xuICAgICAgICBjaGFuZ2VzID0ge1xuICAgICAgICAgIGFjdGl2ZUluZGV4OiBfbmV3QWN0aXZlSW5kZXgyXG4gICAgICAgIH07XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIGNhc2UgRnVuY3Rpb25SZXNldDpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGFjdGl2ZUluZGV4OiBnZXREZWZhdWx0VmFsdWUocHJvcHMsICdhY3RpdmVJbmRleCcpLFxuICAgICAgICBzZWxlY3RlZEl0ZW1zOiBnZXREZWZhdWx0VmFsdWUocHJvcHMsICdzZWxlY3RlZEl0ZW1zJylcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWR1Y2VyIGNhbGxlZCB3aXRob3V0IHByb3BlciBhY3Rpb24gdHlwZS4nKTtcbiAgfVxuICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCBjaGFuZ2VzKTtcbn1cblxudmFyIF9leGNsdWRlZCA9IFtcInJlZktleVwiLCBcInJlZlwiLCBcIm9uQ2xpY2tcIiwgXCJvbktleURvd25cIiwgXCJzZWxlY3RlZEl0ZW1cIiwgXCJpbmRleFwiXSxcbiAgX2V4Y2x1ZGVkMiA9IFtcInJlZktleVwiLCBcInJlZlwiLCBcIm9uS2V5RG93blwiLCBcIm9uQ2xpY2tcIiwgXCJwcmV2ZW50S2V5QWN0aW9uXCJdO1xudXNlTXVsdGlwbGVTZWxlY3Rpb24uc3RhdGVDaGFuZ2VUeXBlcyA9IHN0YXRlQ2hhbmdlVHlwZXM7XG5mdW5jdGlvbiB1c2VNdWx0aXBsZVNlbGVjdGlvbih1c2VyUHJvcHMpIHtcbiAgaWYgKHVzZXJQcm9wcyA9PT0gdm9pZCAwKSB7XG4gICAgdXNlclByb3BzID0ge307XG4gIH1cbiAgdmFsaWRhdGVQcm9wVHlwZXModXNlclByb3BzLCB1c2VNdWx0aXBsZVNlbGVjdGlvbik7XG4gIC8vIFByb3BzIGRlZmF1bHRzIGFuZCBkZXN0cnVjdHVyaW5nLlxuICB2YXIgcHJvcHMgPSBfZXh0ZW5kcyh7fSwgZGVmYXVsdFByb3BzLCB1c2VyUHJvcHMpO1xuICB2YXIgZ2V0QTExeVJlbW92YWxNZXNzYWdlID0gcHJvcHMuZ2V0QTExeVJlbW92YWxNZXNzYWdlLFxuICAgIGl0ZW1Ub1N0cmluZyA9IHByb3BzLml0ZW1Ub1N0cmluZyxcbiAgICBlbnZpcm9ubWVudCA9IHByb3BzLmVudmlyb25tZW50LFxuICAgIGtleU5hdmlnYXRpb25OZXh0ID0gcHJvcHMua2V5TmF2aWdhdGlvbk5leHQsXG4gICAga2V5TmF2aWdhdGlvblByZXZpb3VzID0gcHJvcHMua2V5TmF2aWdhdGlvblByZXZpb3VzO1xuXG4gIC8vIFJlZHVjZXIgaW5pdC5cbiAgdmFyIF91c2VDb250cm9sbGVkUmVkdWNlciA9IHVzZUNvbnRyb2xsZWRSZWR1Y2VyJDEoZG93bnNoaWZ0TXVsdGlwbGVTZWxlY3Rpb25SZWR1Y2VyLCBnZXRJbml0aWFsU3RhdGUocHJvcHMpLCBwcm9wcyksXG4gICAgc3RhdGUgPSBfdXNlQ29udHJvbGxlZFJlZHVjZXJbMF0sXG4gICAgZGlzcGF0Y2ggPSBfdXNlQ29udHJvbGxlZFJlZHVjZXJbMV07XG4gIHZhciBhY3RpdmVJbmRleCA9IHN0YXRlLmFjdGl2ZUluZGV4LFxuICAgIHNlbGVjdGVkSXRlbXMgPSBzdGF0ZS5zZWxlY3RlZEl0ZW1zO1xuXG4gIC8vIFJlZnMuXG4gIHZhciBpc0luaXRpYWxNb3VudFJlZiA9IHVzZVJlZih0cnVlKTtcbiAgdmFyIGRyb3Bkb3duUmVmID0gdXNlUmVmKG51bGwpO1xuICB2YXIgcHJldmlvdXNTZWxlY3RlZEl0ZW1zUmVmID0gdXNlUmVmKHNlbGVjdGVkSXRlbXMpO1xuICB2YXIgc2VsZWN0ZWRJdGVtUmVmcyA9IHVzZVJlZigpO1xuICBzZWxlY3RlZEl0ZW1SZWZzLmN1cnJlbnQgPSBbXTtcbiAgdmFyIGxhdGVzdCA9IHVzZUxhdGVzdFJlZih7XG4gICAgc3RhdGU6IHN0YXRlLFxuICAgIHByb3BzOiBwcm9wc1xuICB9KTtcblxuICAvLyBFZmZlY3RzLlxuICAvKiBTZXRzIGExMXkgc3RhdHVzIG1lc3NhZ2Ugb24gY2hhbmdlcyBpbiBzZWxlY3RlZEl0ZW0uICovXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQgfHwgZmFsc2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHNlbGVjdGVkSXRlbXMubGVuZ3RoIDwgcHJldmlvdXNTZWxlY3RlZEl0ZW1zUmVmLmN1cnJlbnQubGVuZ3RoKSB7XG4gICAgICB2YXIgcmVtb3ZlZFNlbGVjdGVkSXRlbSA9IHByZXZpb3VzU2VsZWN0ZWRJdGVtc1JlZi5jdXJyZW50LmZpbmQoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdGVkSXRlbXMuaW5kZXhPZihpdGVtKSA8IDA7XG4gICAgICB9KTtcbiAgICAgIHNldFN0YXR1cyhnZXRBMTF5UmVtb3ZhbE1lc3NhZ2Uoe1xuICAgICAgICBpdGVtVG9TdHJpbmc6IGl0ZW1Ub1N0cmluZyxcbiAgICAgICAgcmVzdWx0Q291bnQ6IHNlbGVjdGVkSXRlbXMubGVuZ3RoLFxuICAgICAgICByZW1vdmVkU2VsZWN0ZWRJdGVtOiByZW1vdmVkU2VsZWN0ZWRJdGVtLFxuICAgICAgICBhY3RpdmVJbmRleDogYWN0aXZlSW5kZXgsXG4gICAgICAgIGFjdGl2ZVNlbGVjdGVkSXRlbTogc2VsZWN0ZWRJdGVtc1thY3RpdmVJbmRleF1cbiAgICAgIH0pLCBlbnZpcm9ubWVudC5kb2N1bWVudCk7XG4gICAgfVxuICAgIHByZXZpb3VzU2VsZWN0ZWRJdGVtc1JlZi5jdXJyZW50ID0gc2VsZWN0ZWRJdGVtcztcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgfSwgW3NlbGVjdGVkSXRlbXMubGVuZ3RoXSk7XG4gIC8vIFNldHMgZm9jdXMgb24gYWN0aXZlIGl0ZW0uXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGFjdGl2ZUluZGV4ID09PSAtMSAmJiBkcm9wZG93blJlZi5jdXJyZW50KSB7XG4gICAgICBkcm9wZG93blJlZi5jdXJyZW50LmZvY3VzKCk7XG4gICAgfSBlbHNlIGlmIChzZWxlY3RlZEl0ZW1SZWZzLmN1cnJlbnRbYWN0aXZlSW5kZXhdKSB7XG4gICAgICBzZWxlY3RlZEl0ZW1SZWZzLmN1cnJlbnRbYWN0aXZlSW5kZXhdLmZvY3VzKCk7XG4gICAgfVxuICB9LCBbYWN0aXZlSW5kZXhdKTtcbiAgdXNlQ29udHJvbFByb3BzVmFsaWRhdG9yKHtcbiAgICBpc0luaXRpYWxNb3VudDogaXNJbml0aWFsTW91bnRSZWYuY3VycmVudCxcbiAgICBwcm9wczogcHJvcHMsXG4gICAgc3RhdGU6IHN0YXRlXG4gIH0pO1xuICB2YXIgc2V0R2V0dGVyUHJvcENhbGxJbmZvID0gdXNlR2V0dGVyUHJvcHNDYWxsZWRDaGVja2VyKCdnZXREcm9wZG93blByb3BzJyk7XG4gIC8vIE1ha2UgaW5pdGlhbCByZWYgZmFsc2UuXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgaXNJbml0aWFsTW91bnRSZWYuY3VycmVudCA9IGZhbHNlO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpc0luaXRpYWxNb3VudFJlZi5jdXJyZW50ID0gdHJ1ZTtcbiAgICB9O1xuICB9LCBbXSk7XG5cbiAgLy8gRXZlbnQgaGFuZGxlciBmdW5jdGlvbnMuXG4gIHZhciBzZWxlY3RlZEl0ZW1LZXlEb3duSGFuZGxlcnMgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX3JlZjtcbiAgICByZXR1cm4gX3JlZiA9IHt9LCBfcmVmW2tleU5hdmlnYXRpb25QcmV2aW91c10gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IFNlbGVjdGVkSXRlbUtleURvd25OYXZpZ2F0aW9uUHJldmlvdXNcbiAgICAgIH0pO1xuICAgIH0sIF9yZWZba2V5TmF2aWdhdGlvbk5leHRdID0gZnVuY3Rpb24gKCkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBTZWxlY3RlZEl0ZW1LZXlEb3duTmF2aWdhdGlvbk5leHRcbiAgICAgIH0pO1xuICAgIH0sIF9yZWYuRGVsZXRlID0gZnVuY3Rpb24gRGVsZXRlKCkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBTZWxlY3RlZEl0ZW1LZXlEb3duRGVsZXRlXG4gICAgICB9KTtcbiAgICB9LCBfcmVmLkJhY2tzcGFjZSA9IGZ1bmN0aW9uIEJhY2tzcGFjZSgpIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogU2VsZWN0ZWRJdGVtS2V5RG93bkJhY2tzcGFjZVxuICAgICAgfSk7XG4gICAgfSwgX3JlZjtcbiAgfSwgW2Rpc3BhdGNoLCBrZXlOYXZpZ2F0aW9uTmV4dCwga2V5TmF2aWdhdGlvblByZXZpb3VzXSk7XG4gIHZhciBkcm9wZG93bktleURvd25IYW5kbGVycyA9IHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgIHZhciBfcmVmMjtcbiAgICByZXR1cm4gX3JlZjIgPSB7fSwgX3JlZjJba2V5TmF2aWdhdGlvblByZXZpb3VzXSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYgKGlzS2V5RG93bk9wZXJhdGlvblBlcm1pdHRlZChldmVudCkpIHtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IERyb3Bkb3duS2V5RG93bk5hdmlnYXRpb25QcmV2aW91c1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LCBfcmVmMi5CYWNrc3BhY2UgPSBmdW5jdGlvbiBCYWNrc3BhY2UoZXZlbnQpIHtcbiAgICAgIGlmIChpc0tleURvd25PcGVyYXRpb25QZXJtaXR0ZWQoZXZlbnQpKSB7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBEcm9wZG93bktleURvd25CYWNrc3BhY2VcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwgX3JlZjI7XG4gIH0sIFtkaXNwYXRjaCwga2V5TmF2aWdhdGlvblByZXZpb3VzXSk7XG5cbiAgLy8gR2V0dGVyIHByb3BzLlxuICB2YXIgZ2V0U2VsZWN0ZWRJdGVtUHJvcHMgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoX3RlbXApIHtcbiAgICB2YXIgX2V4dGVuZHMyO1xuICAgIHZhciBfcmVmMyA9IF90ZW1wID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wLFxuICAgICAgX3JlZjMkcmVmS2V5ID0gX3JlZjMucmVmS2V5LFxuICAgICAgcmVmS2V5ID0gX3JlZjMkcmVmS2V5ID09PSB2b2lkIDAgPyAncmVmJyA6IF9yZWYzJHJlZktleSxcbiAgICAgIHJlZiA9IF9yZWYzLnJlZixcbiAgICAgIG9uQ2xpY2sgPSBfcmVmMy5vbkNsaWNrLFxuICAgICAgb25LZXlEb3duID0gX3JlZjMub25LZXlEb3duLFxuICAgICAgc2VsZWN0ZWRJdGVtUHJvcCA9IF9yZWYzLnNlbGVjdGVkSXRlbSxcbiAgICAgIGluZGV4UHJvcCA9IF9yZWYzLmluZGV4LFxuICAgICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWYzLCBfZXhjbHVkZWQpO1xuICAgIHZhciBsYXRlc3RTdGF0ZSA9IGxhdGVzdC5jdXJyZW50LnN0YXRlO1xuICAgIHZhciBfZ2V0SXRlbUFuZEluZGV4ID0gZ2V0SXRlbUFuZEluZGV4KHNlbGVjdGVkSXRlbVByb3AsIGluZGV4UHJvcCwgbGF0ZXN0U3RhdGUuc2VsZWN0ZWRJdGVtcywgJ1Bhc3MgZWl0aGVyIGl0ZW0gb3IgaW5kZXggdG8gZ2V0U2VsZWN0ZWRJdGVtUHJvcHMhJyksXG4gICAgICBpbmRleCA9IF9nZXRJdGVtQW5kSW5kZXhbMV07XG4gICAgdmFyIGlzRm9jdXNhYmxlID0gaW5kZXggPiAtMSAmJiBpbmRleCA9PT0gbGF0ZXN0U3RhdGUuYWN0aXZlSW5kZXg7XG4gICAgdmFyIHNlbGVjdGVkSXRlbUhhbmRsZUNsaWNrID0gZnVuY3Rpb24gc2VsZWN0ZWRJdGVtSGFuZGxlQ2xpY2soKSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IFNlbGVjdGVkSXRlbUNsaWNrLFxuICAgICAgICBpbmRleDogaW5kZXhcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIHNlbGVjdGVkSXRlbUhhbmRsZUtleURvd24gPSBmdW5jdGlvbiBzZWxlY3RlZEl0ZW1IYW5kbGVLZXlEb3duKGV2ZW50KSB7XG4gICAgICB2YXIga2V5ID0gbm9ybWFsaXplQXJyb3dLZXkoZXZlbnQpO1xuICAgICAgaWYgKGtleSAmJiBzZWxlY3RlZEl0ZW1LZXlEb3duSGFuZGxlcnNba2V5XSkge1xuICAgICAgICBzZWxlY3RlZEl0ZW1LZXlEb3duSGFuZGxlcnNba2V5XShldmVudCk7XG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gX2V4dGVuZHMoKF9leHRlbmRzMiA9IHt9LCBfZXh0ZW5kczJbcmVmS2V5XSA9IGhhbmRsZVJlZnMocmVmLCBmdW5jdGlvbiAoc2VsZWN0ZWRJdGVtTm9kZSkge1xuICAgICAgaWYgKHNlbGVjdGVkSXRlbU5vZGUpIHtcbiAgICAgICAgc2VsZWN0ZWRJdGVtUmVmcy5jdXJyZW50LnB1c2goc2VsZWN0ZWRJdGVtTm9kZSk7XG4gICAgICB9XG4gICAgfSksIF9leHRlbmRzMi50YWJJbmRleCA9IGlzRm9jdXNhYmxlID8gMCA6IC0xLCBfZXh0ZW5kczIub25DbGljayA9IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uQ2xpY2ssIHNlbGVjdGVkSXRlbUhhbmRsZUNsaWNrKSwgX2V4dGVuZHMyLm9uS2V5RG93biA9IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uS2V5RG93biwgc2VsZWN0ZWRJdGVtSGFuZGxlS2V5RG93biksIF9leHRlbmRzMiksIHJlc3QpO1xuICB9LCBbZGlzcGF0Y2gsIGxhdGVzdCwgc2VsZWN0ZWRJdGVtS2V5RG93bkhhbmRsZXJzXSk7XG4gIHZhciBnZXREcm9wZG93blByb3BzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKF90ZW1wMiwgX3RlbXAzKSB7XG4gICAgdmFyIF9leHRlbmRzMztcbiAgICB2YXIgX3JlZjQgPSBfdGVtcDIgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAyLFxuICAgICAgX3JlZjQkcmVmS2V5ID0gX3JlZjQucmVmS2V5LFxuICAgICAgcmVmS2V5ID0gX3JlZjQkcmVmS2V5ID09PSB2b2lkIDAgPyAncmVmJyA6IF9yZWY0JHJlZktleSxcbiAgICAgIHJlZiA9IF9yZWY0LnJlZixcbiAgICAgIG9uS2V5RG93biA9IF9yZWY0Lm9uS2V5RG93bixcbiAgICAgIG9uQ2xpY2sgPSBfcmVmNC5vbkNsaWNrLFxuICAgICAgX3JlZjQkcHJldmVudEtleUFjdGlvID0gX3JlZjQucHJldmVudEtleUFjdGlvbixcbiAgICAgIHByZXZlbnRLZXlBY3Rpb24gPSBfcmVmNCRwcmV2ZW50S2V5QWN0aW8gPT09IHZvaWQgMCA/IGZhbHNlIDogX3JlZjQkcHJldmVudEtleUFjdGlvLFxuICAgICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWY0LCBfZXhjbHVkZWQyKTtcbiAgICB2YXIgX3JlZjUgPSBfdGVtcDMgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAzLFxuICAgICAgX3JlZjUkc3VwcHJlc3NSZWZFcnJvID0gX3JlZjUuc3VwcHJlc3NSZWZFcnJvcixcbiAgICAgIHN1cHByZXNzUmVmRXJyb3IgPSBfcmVmNSRzdXBwcmVzc1JlZkVycm8gPT09IHZvaWQgMCA/IGZhbHNlIDogX3JlZjUkc3VwcHJlc3NSZWZFcnJvO1xuICAgIHNldEdldHRlclByb3BDYWxsSW5mbygnZ2V0RHJvcGRvd25Qcm9wcycsIHN1cHByZXNzUmVmRXJyb3IsIHJlZktleSwgZHJvcGRvd25SZWYpO1xuICAgIHZhciBkcm9wZG93bkhhbmRsZUtleURvd24gPSBmdW5jdGlvbiBkcm9wZG93bkhhbmRsZUtleURvd24oZXZlbnQpIHtcbiAgICAgIHZhciBrZXkgPSBub3JtYWxpemVBcnJvd0tleShldmVudCk7XG4gICAgICBpZiAoa2V5ICYmIGRyb3Bkb3duS2V5RG93bkhhbmRsZXJzW2tleV0pIHtcbiAgICAgICAgZHJvcGRvd25LZXlEb3duSGFuZGxlcnNba2V5XShldmVudCk7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgZHJvcGRvd25IYW5kbGVDbGljayA9IGZ1bmN0aW9uIGRyb3Bkb3duSGFuZGxlQ2xpY2soKSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IERyb3Bkb3duQ2xpY2tcbiAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIF9leHRlbmRzKChfZXh0ZW5kczMgPSB7fSwgX2V4dGVuZHMzW3JlZktleV0gPSBoYW5kbGVSZWZzKHJlZiwgZnVuY3Rpb24gKGRyb3Bkb3duTm9kZSkge1xuICAgICAgaWYgKGRyb3Bkb3duTm9kZSkge1xuICAgICAgICBkcm9wZG93blJlZi5jdXJyZW50ID0gZHJvcGRvd25Ob2RlO1xuICAgICAgfVxuICAgIH0pLCBfZXh0ZW5kczMpLCAhcHJldmVudEtleUFjdGlvbiAmJiB7XG4gICAgICBvbktleURvd246IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uS2V5RG93biwgZHJvcGRvd25IYW5kbGVLZXlEb3duKSxcbiAgICAgIG9uQ2xpY2s6IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uQ2xpY2ssIGRyb3Bkb3duSGFuZGxlQ2xpY2spXG4gICAgfSwgcmVzdCk7XG4gIH0sIFtkaXNwYXRjaCwgZHJvcGRvd25LZXlEb3duSGFuZGxlcnMsIHNldEdldHRlclByb3BDYWxsSW5mb10pO1xuXG4gIC8vIHJldHVybnNcbiAgdmFyIGFkZFNlbGVjdGVkSXRlbSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChzZWxlY3RlZEl0ZW0pIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBGdW5jdGlvbkFkZFNlbGVjdGVkSXRlbSxcbiAgICAgIHNlbGVjdGVkSXRlbTogc2VsZWN0ZWRJdGVtXG4gICAgfSk7XG4gIH0sIFtkaXNwYXRjaF0pO1xuICB2YXIgcmVtb3ZlU2VsZWN0ZWRJdGVtID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKHNlbGVjdGVkSXRlbSkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uUmVtb3ZlU2VsZWN0ZWRJdGVtLFxuICAgICAgc2VsZWN0ZWRJdGVtOiBzZWxlY3RlZEl0ZW1cbiAgICB9KTtcbiAgfSwgW2Rpc3BhdGNoXSk7XG4gIHZhciBzZXRTZWxlY3RlZEl0ZW1zID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKG5ld1NlbGVjdGVkSXRlbXMpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBGdW5jdGlvblNldFNlbGVjdGVkSXRlbXMsXG4gICAgICBzZWxlY3RlZEl0ZW1zOiBuZXdTZWxlY3RlZEl0ZW1zXG4gICAgfSk7XG4gIH0sIFtkaXNwYXRjaF0pO1xuICB2YXIgc2V0QWN0aXZlSW5kZXggPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAobmV3QWN0aXZlSW5kZXgpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBGdW5jdGlvblNldEFjdGl2ZUluZGV4LFxuICAgICAgYWN0aXZlSW5kZXg6IG5ld0FjdGl2ZUluZGV4XG4gICAgfSk7XG4gIH0sIFtkaXNwYXRjaF0pO1xuICB2YXIgcmVzZXQgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25SZXNldFxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgcmV0dXJuIHtcbiAgICBnZXRTZWxlY3RlZEl0ZW1Qcm9wczogZ2V0U2VsZWN0ZWRJdGVtUHJvcHMsXG4gICAgZ2V0RHJvcGRvd25Qcm9wczogZ2V0RHJvcGRvd25Qcm9wcyxcbiAgICBhZGRTZWxlY3RlZEl0ZW06IGFkZFNlbGVjdGVkSXRlbSxcbiAgICByZW1vdmVTZWxlY3RlZEl0ZW06IHJlbW92ZVNlbGVjdGVkSXRlbSxcbiAgICBzZXRTZWxlY3RlZEl0ZW1zOiBzZXRTZWxlY3RlZEl0ZW1zLFxuICAgIHNldEFjdGl2ZUluZGV4OiBzZXRBY3RpdmVJbmRleCxcbiAgICByZXNldDogcmVzZXQsXG4gICAgc2VsZWN0ZWRJdGVtczogc2VsZWN0ZWRJdGVtcyxcbiAgICBhY3RpdmVJbmRleDogYWN0aXZlSW5kZXhcbiAgfTtcbn1cblxuZXhwb3J0IHsgRG93bnNoaWZ0JDEgYXMgZGVmYXVsdCwgcmVzZXRJZENvdW50ZXIsIHVzZUNvbWJvYm94LCB1c2VNdWx0aXBsZVNlbGVjdGlvbiwgdXNlU2VsZWN0IH07XG4iLCJpbXBvcnQge1xuICAgIHVzZUNvbWJvYm94LFxuICAgIFVzZUNvbWJvYm94UHJvcHMsXG4gICAgVXNlQ29tYm9ib3hSZXR1cm5WYWx1ZSxcbiAgICBVc2VDb21ib2JveFN0YXRlLFxuICAgIFVzZUNvbWJvYm94U3RhdGVDaGFuZ2UsXG4gICAgVXNlQ29tYm9ib3hTdGF0ZUNoYW5nZU9wdGlvbnNcbn0gZnJvbSBcImRvd25zaGlmdFwiO1xuXG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlTWVtbyB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgQTExeVN0YXR1c01lc3NhZ2UsIFNpbmdsZVNlbGVjdG9yIH0gZnJvbSBcIi4uL2hlbHBlcnMvdHlwZXNcIjtcblxuaW50ZXJmYWNlIE9wdGlvbnMge1xuICAgIGlucHV0SWQ/OiBzdHJpbmc7XG4gICAgbGFiZWxJZD86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZURvd25zaGlmdFNpbmdsZVNlbGVjdFByb3BzKFxuICAgIHNlbGVjdG9yOiBTaW5nbGVTZWxlY3RvcixcbiAgICBvcHRpb25zOiBPcHRpb25zID0ge30sXG4gICAgYTExeVN0YXR1c01lc3NhZ2U6IEExMXlTdGF0dXNNZXNzYWdlXG4pOiBVc2VDb21ib2JveFJldHVyblZhbHVlPHN0cmluZz4ge1xuICAgIGNvbnN0IHsgaW5wdXRJZCwgbGFiZWxJZCB9ID0gb3B0aW9ucztcblxuICAgIGNvbnN0IGRvd25zaGlmdFByb3BzOiBVc2VDb21ib2JveFByb3BzPHN0cmluZz4gPSB1c2VNZW1vKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGl0ZW1zOiBbXSxcbiAgICAgICAgICAgIGl0ZW1Ub1N0cmluZzogKHY6IHN0cmluZyB8IG51bGwpID0+IHNlbGVjdG9yLmNhcHRpb24uZ2V0KHYpLFxuICAgICAgICAgICAgb25TZWxlY3RlZEl0ZW1DaGFuZ2UoeyBzZWxlY3RlZEl0ZW0gfTogVXNlQ29tYm9ib3hTdGF0ZUNoYW5nZTxzdHJpbmc+KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3Iuc2V0VmFsdWUoc2VsZWN0ZWRJdGVtID8/IG51bGwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uSW5wdXRWYWx1ZUNoYW5nZSh7IGlucHV0VmFsdWUsIHR5cGUgfTogVXNlQ29tYm9ib3hTdGF0ZUNoYW5nZTxzdHJpbmc+KSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdG9yLm9uRmlsdGVySW5wdXRDaGFuZ2UgJiYgdHlwZSA9PT0gdXNlQ29tYm9ib3guc3RhdGVDaGFuZ2VUeXBlcy5JbnB1dENoYW5nZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rvci5vcHRpb25zLnNldFNlYXJjaFRlcm0oaW5wdXRWYWx1ZSA/PyBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3Iub25GaWx0ZXJJbnB1dENoYW5nZShpbnB1dFZhbHVlID8/IFwiXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yLm9wdGlvbnMuc2V0U2VhcmNoVGVybShcIlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0QTExeVN0YXR1c01lc3NhZ2Uob3B0aW9ucykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbSA9IHNlbGVjdG9yLmNhcHRpb24uZ2V0KHNlbGVjdG9yLmN1cnJlbnRJZCk7XG4gICAgICAgICAgICAgICAgbGV0IG1lc3NhZ2UgPSBzZWxlY3RlZEl0ZW1cbiAgICAgICAgICAgICAgICAgICAgPyBzZWxlY3Rvci5jdXJyZW50SWRcbiAgICAgICAgICAgICAgICAgICAgICAgID8gYCR7YTExeVN0YXR1c01lc3NhZ2UuYTExeVNlbGVjdGVkVmFsdWV9ICR7c2VsZWN0ZWRJdGVtfS4gYFxuICAgICAgICAgICAgICAgICAgICAgICAgOiBcIk5vIG9wdGlvbnMgc2VsZWN0ZWQuXCJcbiAgICAgICAgICAgICAgICAgICAgOiBcIlwiO1xuICAgICAgICAgICAgICAgIGlmICghb3B0aW9ucy5pc09wZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghb3B0aW9ucy5yZXN1bHRDb3VudCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYTExeVN0YXR1c01lc3NhZ2UuYTExeU5vT3B0aW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5yZXN1bHRDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSArPSBgJHthMTF5U3RhdHVzTWVzc2FnZS5hMTF5T3B0aW9uc0F2YWlsYWJsZX0gJHtvcHRpb25zLnJlc3VsdENvdW50fS4gJHthMTF5U3RhdHVzTWVzc2FnZS5hMTF5SW5zdHJ1Y3Rpb25zfWA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGExMXlTdGF0dXNNZXNzYWdlLmExMXlOb09wdGlvbjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleDogMCxcbiAgICAgICAgICAgIHNlbGVjdGVkSXRlbTogbnVsbCxcbiAgICAgICAgICAgIGluaXRpYWxJbnB1dFZhbHVlOiBzZWxlY3Rvci5jYXB0aW9uLmdldChzZWxlY3Rvci5jdXJyZW50SWQpLFxuICAgICAgICAgICAgc3RhdGVSZWR1Y2VyKHN0YXRlOiBVc2VDb21ib2JveFN0YXRlPHN0cmluZz4sIGFjdGlvbkFuZENoYW5nZXM6IFVzZUNvbWJvYm94U3RhdGVDaGFuZ2VPcHRpb25zPHN0cmluZz4pIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGNoYW5nZXMsIHR5cGUgfSA9IGFjdGlvbkFuZENoYW5nZXM7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNsZWFyIGlucHV0IHdoZW4gdXNlciB0b2dnbGVzIChjbG9zZXMpIGRyb3Bkb3duLlxuICAgICAgICAgICAgICAgICAgICBjYXNlIHVzZUNvbWJvYm94LnN0YXRlQ2hhbmdlVHlwZXMuVG9nZ2xlQnV0dG9uQ2xpY2s6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmNoYW5nZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZTogXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB3aGVuIGl0ZW0gaXMgc2VsZWN0ZWQsIGRvd25zaGlmdCBmaWxscyBpbiBpbnB1dCBhdXRvbWF0aWNhbGx5LCBwcmV2ZW50IHRoYXQuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdXNlQ29tYm9ib3guc3RhdGVDaGFuZ2VUeXBlcy5GdW5jdGlvblNlbGVjdEl0ZW06XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdXNlQ29tYm9ib3guc3RhdGVDaGFuZ2VUeXBlcy5JdGVtQ2xpY2s6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdXNlQ29tYm9ib3guc3RhdGVDaGFuZ2VUeXBlcy5Db250cm9sbGVkUHJvcFVwZGF0ZWRTZWxlY3RlZEl0ZW06XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdXNlQ29tYm9ib3guc3RhdGVDaGFuZ2VUeXBlcy5JbnB1dEtleURvd25FbnRlcjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uY2hhbmdlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dFZhbHVlOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdXNlQ29tYm9ib3guc3RhdGVDaGFuZ2VUeXBlcy5JbnB1dEZvY3VzOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5jaGFuZ2VzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzT3Blbjogc3RhdGUuaXNPcGVuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0VmFsdWU6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogY2hhbmdlcy5zZWxlY3RlZEl0ZW0gPyAtMSA6IHRoaXMuZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2xlYXIgaW5wdXQgd2hlbiB1c2VyIHdhbnQgdG8gY2xvc2UgdGhlIHBvcHVwIHdpdGggZXNjYXBlIChvciBpdCB3YXMgY2xvc2VkIHByb2dyYW1tYXRpY2FsbHkpXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdXNlQ29tYm9ib3guc3RhdGVDaGFuZ2VUeXBlcy5JbnB1dEtleURvd25Fc2NhcGU6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdXNlQ29tYm9ib3guc3RhdGVDaGFuZ2VUeXBlcy5GdW5jdGlvbkNsb3NlTWVudTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uY2hhbmdlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEl0ZW06IHN0YXRlLnNlbGVjdGVkSXRlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc09wZW46IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0VmFsdWU6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdXNlQ29tYm9ib3guc3RhdGVDaGFuZ2VUeXBlcy5JbnB1dEJsdXI6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmNoYW5nZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJdGVtOiBzdGF0ZS5zZWxlY3RlZEl0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZTogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc09wZW46IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4uY2hhbmdlcyB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbnB1dElkLFxuICAgICAgICAgICAgbGFiZWxJZFxuICAgICAgICB9O1xuICAgIH0sIFtcbiAgICAgICAgc2VsZWN0b3IsXG4gICAgICAgIGlucHV0SWQsXG4gICAgICAgIGxhYmVsSWQsXG4gICAgICAgIGExMXlTdGF0dXNNZXNzYWdlLmExMXlTZWxlY3RlZFZhbHVlLFxuICAgICAgICBhMTF5U3RhdHVzTWVzc2FnZS5hMTF5T3B0aW9uc0F2YWlsYWJsZSxcbiAgICAgICAgYTExeVN0YXR1c01lc3NhZ2UuYTExeU5vT3B0aW9uLFxuICAgICAgICBhMTF5U3RhdHVzTWVzc2FnZS5hMTF5SW5zdHJ1Y3Rpb25zXG4gICAgXSk7XG5cbiAgICAvLyBTb3J0IGl0ZW1zIGluIGdyb3VwZWQgb3JkZXIgKG1hdGNoaW5nIFNpbmdsZVNlbGVjdGlvbk1lbnUgcmVuZGVyIG9yZGVyKVxuICAgIGNvbnN0IHJhd0l0ZW1zID0gc2VsZWN0b3Iub3B0aW9ucy5nZXRBbGwoKSA/PyBbXTtcbiAgICBjb25zdCBnZXRHcm91cEZuID0gc2VsZWN0b3IuY2FwdGlvbi5nZXRHcm91cFxuICAgICAgICA/IChpZDogc3RyaW5nKSA9PiBzZWxlY3Rvci5jYXB0aW9uLmdldEdyb3VwIShpZClcbiAgICAgICAgOiAoX2lkOiBzdHJpbmcpID0+IG51bGwgYXMgc3RyaW5nIHwgbnVsbDtcbiAgICBjb25zdCBoYXNHcm91cHMgPSByYXdJdGVtcy5zb21lKGlkID0+IHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSBnZXRHcm91cEZuKGlkKTtcbiAgICAgICAgcmV0dXJuIHRpdGxlICE9PSBudWxsICYmIHRpdGxlLnRyaW0oKSAhPT0gXCJcIjtcbiAgICB9KTtcbiAgICBsZXQgc29ydGVkSXRlbXM6IHN0cmluZ1tdO1xuICAgIGlmIChoYXNHcm91cHMpIHtcbiAgICAgICAgY29uc3QgZ3JvdXBNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nW10+KCk7XG4gICAgICAgIGNvbnN0IHVuZ3JvdXBlZDogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBpZCBvZiByYXdJdGVtcykge1xuICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBnZXRHcm91cEZuKGlkKTtcbiAgICAgICAgICAgIGlmICghdGl0bGUgfHwgdGl0bGUudHJpbSgpID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgdW5ncm91cGVkLnB1c2goaWQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIWdyb3VwTWFwLmhhcyh0aXRsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBNYXAuc2V0KHRpdGxlLCBbXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGdyb3VwTWFwLmdldCh0aXRsZSkhLnB1c2goaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNvcnRlZFRpdGxlcyA9IEFycmF5LmZyb20oZ3JvdXBNYXAua2V5cygpKS5zb3J0KChhLCBiKSA9PlxuICAgICAgICAgICAgYS5sb2NhbGVDb21wYXJlKGIsIHVuZGVmaW5lZCwgeyBzZW5zaXRpdml0eTogXCJiYXNlXCIgfSlcbiAgICAgICAgKTtcbiAgICAgICAgc29ydGVkSXRlbXMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCB0aXRsZSBvZiBzb3J0ZWRUaXRsZXMpIHtcbiAgICAgICAgICAgIHNvcnRlZEl0ZW1zLnB1c2goLi4uZ3JvdXBNYXAuZ2V0KHRpdGxlKSEpO1xuICAgICAgICB9XG4gICAgICAgIHNvcnRlZEl0ZW1zLnB1c2goLi4udW5ncm91cGVkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzb3J0ZWRJdGVtcyA9IHJhd0l0ZW1zO1xuICAgIH1cblxuICAgIGNvbnN0IHJldHVyblZhbCA9IHVzZUNvbWJvYm94KHtcbiAgICAgICAgLi4uZG93bnNoaWZ0UHJvcHMsXG4gICAgICAgIGl0ZW1zOiBzb3J0ZWRJdGVtcyxcbiAgICAgICAgc2VsZWN0ZWRJdGVtOiBzZWxlY3Rvci5jdXJyZW50SWRcbiAgICB9KTtcblxuICAgIGNvbnN0IHsgY2xvc2VNZW51IH0gPSByZXR1cm5WYWw7XG5cbiAgICBzZWxlY3Rvci5vbkxlYXZlRXZlbnQgPSB1c2VDYWxsYmFjayhjbG9zZU1lbnUsIFtjbG9zZU1lbnVdKTtcblxuICAgIHJldHVybiByZXR1cm5WYWw7XG59XG4iLCJpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlUmVmIH0gZnJvbSBcInJlYWN0XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW5maW5pdGVCb2R5UHJvcHMge1xuICAgIGhhc01vcmVJdGVtczogYm9vbGVhbjtcbiAgICBpc0luZmluaXRlOiBib29sZWFuO1xuICAgIHNldFBhZ2U/OiAoKSA9PiB2b2lkO1xufVxuXG50eXBlIFRyYWNrU2Nyb2xsaW5nRm4gPSAoZTogYW55KSA9PiB2b2lkO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlSW5maW5pdGVDb250cm9sKHByb3BzOiBJbmZpbml0ZUJvZHlQcm9wcyk6IFtUcmFja1Njcm9sbGluZ0ZuXSB7XG4gICAgY29uc3QgeyBzZXRQYWdlLCBoYXNNb3JlSXRlbXMgfSA9IHByb3BzO1xuICAgIGNvbnN0IGxvYWRpbmdSZWYgPSB1c2VSZWYoZmFsc2UpO1xuXG4gICAgY29uc3QgdHJhY2tTY3JvbGxpbmcgPSB1c2VDYWxsYmFjayhcbiAgICAgICAgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZXZlbnQ/LnRhcmdldDtcbiAgICAgICAgICAgIGlmICghZWwgfHwgbG9hZGluZ1JlZi5jdXJyZW50IHx8ICFoYXNNb3JlSXRlbXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuZWFyQm90dG9tID0gZWwuc2Nyb2xsSGVpZ2h0IC0gZWwuc2Nyb2xsVG9wIC0gZWwuY2xpZW50SGVpZ2h0IDwgNTA7XG4gICAgICAgICAgICBpZiAobmVhckJvdHRvbSAmJiBzZXRQYWdlKSB7XG4gICAgICAgICAgICAgICAgbG9hZGluZ1JlZi5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZXRQYWdlKCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmdSZWYuY3VycmVudCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFtzZXRQYWdlLCBoYXNNb3JlSXRlbXNdXG4gICAgKTtcblxuICAgIHJldHVybiBbdHJhY2tTY3JvbGxpbmddO1xufVxuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IEluZmluaXRlQm9keVByb3BzLCB1c2VJbmZpbml0ZUNvbnRyb2wgfSBmcm9tIFwiQG1lbmRpeC93aWRnZXQtcGx1Z2luLWdyaWQvY29tcG9uZW50cy9JbmZpbml0ZUJvZHlcIjtcbmltcG9ydCB7IExpc3RWYWx1ZSB9IGZyb20gXCJtZW5kaXhcIjtcblxudHlwZSBVc2VMYXp5TG9hZGluZ1Byb3BzID0gUGljazxJbmZpbml0ZUJvZHlQcm9wcywgXCJoYXNNb3JlSXRlbXNcIiB8IFwiaXNJbmZpbml0ZVwiPiAmIHtcbiAgICBpc09wZW46IGJvb2xlYW47XG4gICAgbG9hZE1vcmU/OiAoKSA9PiB2b2lkO1xuICAgIGRhdGFzb3VyY2VGaWx0ZXI/OiBMaXN0VmFsdWVbXCJmaWx0ZXJcIl07XG4gICAgcmVhZE9ubHk/OiBib29sZWFuO1xufTtcblxudHlwZSBVc2VMYXp5TG9hZGluZ1JldHVybiA9IHtcbiAgICBvblNjcm9sbDogKGU6IGFueSkgPT4gdm9pZDtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VMYXp5TG9hZGluZyhwcm9wczogVXNlTGF6eUxvYWRpbmdQcm9wcyk6IFVzZUxhenlMb2FkaW5nUmV0dXJuIHtcbiAgICBjb25zdCB7IGhhc01vcmVJdGVtcywgaXNJbmZpbml0ZSwgbG9hZE1vcmUgfSA9IHByb3BzO1xuXG4gICAgY29uc3Qgc2V0UGFnZUNhbGxiYWNrID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgICBpZiAobG9hZE1vcmUpIHtcbiAgICAgICAgICAgIGxvYWRNb3JlKCk7XG4gICAgICAgIH1cbiAgICB9LCBbbG9hZE1vcmVdKTtcblxuICAgIGNvbnN0IFt0cmFja1Njcm9sbGluZ10gPSB1c2VJbmZpbml0ZUNvbnRyb2woeyBoYXNNb3JlSXRlbXMsIGlzSW5maW5pdGUsIHNldFBhZ2U6IHNldFBhZ2VDYWxsYmFjayB9KTtcblxuICAgIHJldHVybiB7IG9uU2Nyb2xsOiB0cmFja1Njcm9sbGluZyB9O1xufVxuIiwiaW1wb3J0IHsgUmVhY3RFbGVtZW50LCBjcmVhdGVFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWxlcnRQcm9wcyB7XG4gICAgY2hpbGRyZW4/OiBzdHJpbmc7XG4gICAgaWQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBWYWxpZGF0aW9uQWxlcnQoeyBjaGlsZHJlbiwgaWQgfTogQWxlcnRQcm9wcyk6IFJlYWN0RWxlbWVudCB8IG51bGwge1xuICAgIGlmICghY2hpbGRyZW4pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImFsZXJ0IGFsZXJ0LWRhbmdlciBteC12YWxpZGF0aW9uLW1lc3NhZ2VcIiwgaWQgfSwgY2hpbGRyZW4pO1xufVxuIiwiaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSBcImNsYXNzbmFtZXNcIjtcbmltcG9ydCB7IFJlYWN0RWxlbWVudCB9IGZyb20gXCJyZWFjdFwiO1xuXG50eXBlIFNwaW5uZXJMb2FkZXJQcm9wcyA9IHtcbiAgICBzaXplPzogXCJzbWFsbFwiIHwgXCJtZWRpdW1cIjtcbiAgICB3aXRoTWFyZ2lucz86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gU3Bpbm5lckxvYWRlcih7IHNpemUgPSBcIm1lZGl1bVwiLCB3aXRoTWFyZ2lucyA9IGZhbHNlIH06IFNwaW5uZXJMb2FkZXJQcm9wcyk6IFJlYWN0RWxlbWVudCB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXCJ3aWRnZXQtY29tYm9ib3gtc3Bpbm5lclwiLCB7IFwid2lkZ2V0LWNvbWJvYm94LXNwaW5uZXItbWFyZ2luXCI6IHdpdGhNYXJnaW5zIH0pfT5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXCJ3aWRnZXQtY29tYm9ib3gtc3Bpbm5lci1sb2FkZXJcIiwge1xuICAgICAgICAgICAgICAgICAgICBcIndpZGdldC1jb21ib2JveC1zcGlubmVyLWxvYWRlci1zbWFsbFwiOiBzaXplID09PSBcInNtYWxsXCJcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG4iLCJpbXBvcnQgY2xhc3NOYW1lcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IHsgVXNlQ29tYm9ib3hHZXRUb2dnbGVCdXR0b25Qcm9wc09wdGlvbnMgfSBmcm9tIFwiZG93bnNoaWZ0L3R5cGluZ3NcIjtcbmltcG9ydCB7IGZvcndhcmRSZWYsIEZyYWdtZW50LCBQcm9wc1dpdGhDaGlsZHJlbiwgUmVhY3RFbGVtZW50LCBSZWZPYmplY3QgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IERvd25BcnJvdyB9IGZyb20gXCIuLi9hc3NldHMvaWNvbnNcIjtcbmltcG9ydCB7IFZhbGlkYXRpb25BbGVydCB9IGZyb20gXCJAbWVuZGl4L3dpZGdldC1wbHVnaW4tY29tcG9uZW50LWtpdC9BbGVydFwiO1xuaW1wb3J0IHsgUmVhZE9ubHlTdHlsZUVudW0gfSBmcm9tIFwidHlwaW5ncy9Hcm91cGVkQ29tYm9ib3hQcm9wc1wiO1xuaW1wb3J0IHsgU3Bpbm5lckxvYWRlciB9IGZyb20gXCIuL1NwaW5uZXJMb2FkZXJcIjtcblxuaW50ZXJmYWNlIENvbWJvYm94V3JhcHBlclByb3BzIGV4dGVuZHMgUHJvcHNXaXRoQ2hpbGRyZW4ge1xuICAgIGlzT3BlbjogYm9vbGVhbjtcbiAgICByZWFkT25seTogYm9vbGVhbjtcbiAgICByZWFkT25seVN0eWxlOiBSZWFkT25seVN0eWxlRW51bTtcbiAgICBnZXRUb2dnbGVCdXR0b25Qcm9wczogKG9wdGlvbnM/OiBVc2VDb21ib2JveEdldFRvZ2dsZUJ1dHRvblByb3BzT3B0aW9ucyB8IHVuZGVmaW5lZCkgPT4gYW55O1xuICAgIHZhbGlkYXRpb24/OiBzdHJpbmc7XG4gICAgaXNMb2FkaW5nOiBib29sZWFuO1xuICAgIGlzTXVsdGlzZWxlY3RBY3RpdmU/OiBib29sZWFuO1xuICAgIGVycm9ySWQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBDb21ib2JveFdyYXBwZXIgPSBmb3J3YXJkUmVmKFxuICAgIChwcm9wczogQ29tYm9ib3hXcmFwcGVyUHJvcHMsIHJlZjogUmVmT2JqZWN0PEhUTUxEaXZFbGVtZW50IHwgbnVsbD4pOiBSZWFjdEVsZW1lbnQgPT4ge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBpc09wZW4sXG4gICAgICAgICAgICByZWFkT25seSxcbiAgICAgICAgICAgIHJlYWRPbmx5U3R5bGUsXG4gICAgICAgICAgICBnZXRUb2dnbGVCdXR0b25Qcm9wcyxcbiAgICAgICAgICAgIHZhbGlkYXRpb24sXG4gICAgICAgICAgICBjaGlsZHJlbixcbiAgICAgICAgICAgIGlzTG9hZGluZyxcbiAgICAgICAgICAgIGlzTXVsdGlzZWxlY3RBY3RpdmUsXG4gICAgICAgICAgICBlcnJvcklkXG4gICAgICAgIH0gPSBwcm9wcztcbiAgICAgICAgY29uc3QgeyBpZCwgb25DbGljayB9ID0gZ2V0VG9nZ2xlQnV0dG9uUHJvcHMoKTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgcmVmPXtyZWZ9XG4gICAgICAgICAgICAgICAgICAgIHRhYkluZGV4PXstMX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFwid2lkZ2V0LWNvbWJvYm94LWlucHV0LWNvbnRhaW5lclwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIndpZGdldC1jb21ib2JveC1pbnB1dC1jb250YWluZXItYWN0aXZlXCI6IGlzT3BlbixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwid2lkZ2V0LWNvbWJvYm94LWlucHV0LWNvbnRhaW5lci1kaXNhYmxlZFwiOiByZWFkT25seSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1jb250cm9sLXN0YXRpY1wiOiByZWFkT25seSAmJiByZWFkT25seVN0eWxlID09PSBcInRleHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1jb250cm9sXCI6ICFyZWFkT25seSB8fCByZWFkT25seVN0eWxlICE9PSBcInRleHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwid2lkZ2V0LWNvbWJvYm94LW11bHRpc2VsZWN0XCI6IGlzTXVsdGlzZWxlY3RBY3RpdmVcbiAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgIGlkPXtpZH1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17b25DbGlja31cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgICAgICAgICAgICAge3JlYWRPbmx5ICYmIHJlYWRPbmx5U3R5bGUgPT09IFwidGV4dFwiID8gbnVsbCA6IGlzTG9hZGluZyA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94LWRvd24tYXJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8U3Bpbm5lckxvYWRlciBzaXplPVwic21hbGxcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndpZGdldC1jb21ib2JveC1kb3duLWFycm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPERvd25BcnJvdyBpc09wZW49e2lzT3Blbn0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIHt2YWxpZGF0aW9uICYmIDxWYWxpZGF0aW9uQWxlcnQgaWQ9e2Vycm9ySWR9Pnt2YWxpZGF0aW9ufTwvVmFsaWRhdGlvbkFsZXJ0Pn1cbiAgICAgICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICAgICk7XG4gICAgfVxuKTsiLCJpbXBvcnQgY2xhc3NOYW1lcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IHsgUHJvcHNXaXRoQ2hpbGRyZW4sIFJlYWN0RWxlbWVudCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgRG93bkFycm93IH0gZnJvbSBcIi4uL2Fzc2V0cy9pY29uc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gUGxhY2Vob2xkZXIoKTogUmVhY3RFbGVtZW50IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCB3aWRnZXQtY29tYm9ib3gtcGxhY2Vob2xkZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94LXBsYWNlaG9sZGVyLWRvd24tYXJyb3dcIj5cbiAgICAgICAgICAgICAgICA8RG93bkFycm93IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIE5vT3B0aW9uc1BsYWNlaG9sZGVyKHByb3BzOiBQcm9wc1dpdGhDaGlsZHJlbik6IFJlYWN0RWxlbWVudCB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGxpIGNsYXNzTmFtZT1cIndpZGdldC1jb21ib2JveC1pdGVtIHdpZGdldC1jb21ib2JveC1uby1vcHRpb25zXCIgcm9sZT1cIm9wdGlvblwiPlxuICAgICAgICAgICAge3Byb3BzLmNoaWxkcmVufVxuICAgICAgICA8L2xpPlxuICAgICk7XG59XG5cbmludGVyZmFjZSBJbnB1dFBsYWNlaG9sZGVyUHJvcHMgZXh0ZW5kcyBQcm9wc1dpdGhDaGlsZHJlbiB7XG4gICAgaXNFbXB0eTogYm9vbGVhbjtcbiAgICB0eXBlPzogXCJ0ZXh0XCIgfCBcImN1c3RvbVwiO1xufVxuZXhwb3J0IGZ1bmN0aW9uIElucHV0UGxhY2Vob2xkZXIocHJvcHM6IElucHV0UGxhY2Vob2xkZXJQcm9wcyk6IFJlYWN0RWxlbWVudCB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKGB3aWRnZXQtY29tYm9ib3gtcGxhY2Vob2xkZXItJHtwcm9wcy50eXBlID8/IFwidGV4dFwifWAsIHtcbiAgICAgICAgICAgICAgICBcIndpZGdldC1jb21ib2JveC1wbGFjZWhvbGRlci1lbXB0eVwiOiBwcm9wcy5pc0VtcHR5XG4gICAgICAgICAgICB9KX1cbiAgICAgICAgPlxuICAgICAgICAgICAge3Byb3BzLmNoaWxkcmVufVxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuIiwiLyoqXG4gKiBVdGlsaXR5IGZvciBncm91cGluZyBmbGF0IGxpc3RzIG9mIG9wdGlvbiBJRHMgaW50byB0aXRsZWQgc2VjdGlvbnMuXG4gKiBJdGVtcyBhcmUgc29ydGVkIEEtWiBieSB0aGVpciBncm91cCB0aXRsZSBiZWZvcmUgZ3JvdXBpbmcuXG4gKiBJdGVtcyB3aXRoIG5vIGdyb3VwIHRpdGxlIGFwcGVhciBpbiBhIGZpbmFsIFwidW5ncm91cGVkXCIgc2VnbWVudC5cbiAqL1xuXG5leHBvcnQgaW50ZXJmYWNlIEdyb3VwU2VnbWVudCB7XG4gICAgLyoqIG51bGwgbWVhbnMgdGhlIGl0ZW1zIGhhdmUgbm8gZ3JvdXAgdGl0bGUgKHVuZ3JvdXBlZCkgKi9cbiAgICBncm91cFRpdGxlOiBzdHJpbmcgfCBudWxsO1xuICAgIGl0ZW1zOiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBHcm91cHMgYSBsaXN0IG9mIGl0ZW0gSURzIGJ5IHRoZWlyIGdyb3VwIHRpdGxlLlxuICogQXV0b21hdGljYWxseSBzb3J0cyBncm91cHMgQS1aLiBVbmdyb3VwZWQgaXRlbXMgYXBwZWFyIGF0IHRoZSBlbmQuXG4gKlxuICogQHBhcmFtIGl0ZW1zICAgICAgIEZsYXQgbGlzdCBvZiBvcHRpb24gSURzXG4gKiBAcGFyYW0gZ2V0R3JvdXBGbiAgRnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBncm91cCB0aXRsZSBzdHJpbmcgZm9yIGFuIElEIChvciBudWxsL2VtcHR5KVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBJdGVtcyhpdGVtczogc3RyaW5nW10sIGdldEdyb3VwRm46IChpZDogc3RyaW5nKSA9PiBzdHJpbmcgfCBudWxsKTogR3JvdXBTZWdtZW50W10ge1xuICAgIGlmIChpdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIC8vIEJ1aWxkIGEgbWFwOiBncm91cFRpdGxlIOKGkiBpdGVtc1tdLCBwcmVzZXJ2aW5nIGl0ZW0gb3JkZXIgd2l0aGluIGVhY2ggZ3JvdXBcbiAgICBjb25zdCBncm91cE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmdbXT4oKTtcbiAgICBjb25zdCB1bmdyb3VwZWQ6IHN0cmluZ1tdID0gW107XG5cbiAgICBmb3IgKGNvbnN0IGlkIG9mIGl0ZW1zKSB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gZ2V0R3JvdXBGbihpZCk7XG4gICAgICAgIGlmICghdGl0bGUgfHwgdGl0bGUudHJpbSgpID09PSBcIlwiKSB7XG4gICAgICAgICAgICB1bmdyb3VwZWQucHVzaChpZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWdyb3VwTWFwLmhhcyh0aXRsZSkpIHtcbiAgICAgICAgICAgICAgICBncm91cE1hcC5zZXQodGl0bGUsIFtdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdyb3VwTWFwLmdldCh0aXRsZSkhLnB1c2goaWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gU29ydCBncm91cCB0aXRsZXMgQS1aIChjYXNlLWluc2Vuc2l0aXZlKVxuICAgIGNvbnN0IHNvcnRlZFRpdGxlcyA9IEFycmF5LmZyb20oZ3JvdXBNYXAua2V5cygpKS5zb3J0KChhLCBiKSA9PlxuICAgICAgICBhLmxvY2FsZUNvbXBhcmUoYiwgdW5kZWZpbmVkLCB7IHNlbnNpdGl2aXR5OiBcImJhc2VcIiB9KVxuICAgICk7XG5cbiAgICBjb25zdCBzZWdtZW50czogR3JvdXBTZWdtZW50W10gPSBzb3J0ZWRUaXRsZXMubWFwKHRpdGxlID0+ICh7XG4gICAgICAgIGdyb3VwVGl0bGU6IHRpdGxlLFxuICAgICAgICBpdGVtczogZ3JvdXBNYXAuZ2V0KHRpdGxlKSFcbiAgICB9KSk7XG5cbiAgICAvLyBBcHBlbmQgdW5ncm91cGVkIGF0IHRoZSBlbmRcbiAgICBpZiAodW5ncm91cGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2VnbWVudHMucHVzaCh7IGdyb3VwVGl0bGU6IG51bGwsIGl0ZW1zOiB1bmdyb3VwZWQgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlZ21lbnRzO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgaXRlbXMgYXJyYXkgcHJvZHVjZXMgYXQgbGVhc3Qgb25lIG5vbi1udWxsIGdyb3VwIHRpdGxlLlxuICogVXNlZCB0byBjb25kaXRpb25hbGx5IHJlbmRlciBncm91cCBoZWFkZXJzIHZzIHBsYWluIGxpc3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNHcm91cGluZyhpdGVtczogc3RyaW5nW10sIGdldEdyb3VwRm46IChpZDogc3RyaW5nKSA9PiBzdHJpbmcgfCBudWxsKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGl0ZW1zLnNvbWUoaWQgPT4ge1xuICAgICAgICBjb25zdCB0aXRsZSA9IGdldEdyb3VwRm4oaWQpO1xuICAgICAgICByZXR1cm4gdGl0bGUgIT09IG51bGwgJiYgdGl0bGUudHJpbSgpICE9PSBcIlwiO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xuXG4vKipcbiAqIE9ic2VydmVzIHRoZSBwb3NpdGlvbiAoYm91bmRpbmcgcmVjdCkgb2YgYW4gZWxlbWVudCB3aGlsZSBhY3RpdmUuXG4gKiBSZXR1cm5zIHRoZSBjdXJyZW50IERPTVJlY3Qgb3IgdW5kZWZpbmVkIHdoZW4gbm90IG9ic2VydmluZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZVBvc2l0aW9uT2JzZXJ2ZXIoZWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsLCBhY3RpdmU6IGJvb2xlYW4pOiBET01SZWN0IHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBbcmVjdCwgc2V0UmVjdF0gPSB1c2VTdGF0ZTxET01SZWN0IHwgdW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICAgIGNvbnN0IHJhZlJlZiA9IHVzZVJlZjxudW1iZXI+KDApO1xuXG4gICAgY29uc3QgdXBkYXRlUmVjdCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHNldFJlY3QoZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XG4gICAgICAgIH1cbiAgICB9LCBbZWxlbWVudF0pO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCFlbGVtZW50IHx8ICFhY3RpdmUpIHtcbiAgICAgICAgICAgIHNldFJlY3QodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZVJlY3QoKTtcblxuICAgICAgICBjb25zdCBvblNjcm9sbCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZlJlZi5jdXJyZW50KTtcbiAgICAgICAgICAgIHJhZlJlZi5jdXJyZW50ID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZVJlY3QpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIG9uU2Nyb2xsLCB0cnVlKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25TY3JvbGwpO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShyYWZSZWYuY3VycmVudCk7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbCwgdHJ1ZSk7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvblNjcm9sbCk7XG4gICAgICAgIH07XG4gICAgfSwgW2VsZW1lbnQsIGFjdGl2ZSwgdXBkYXRlUmVjdF0pO1xuXG4gICAgcmV0dXJuIHJlY3Q7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZGVib3VuY2U8VCBleHRlbmRzICguLi5hcmdzOiBhbnlbXSkgPT4gYW55PihmbjogVCwgbXM6IG51bWJlcik6IFsoKC4uLmFyZ3M6IFBhcmFtZXRlcnM8VD4pID0+IHZvaWQpLCAoKSA9PiB2b2lkXSB7XG4gICAgbGV0IHRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xuICAgIGNvbnN0IGRlYm91bmNlZCA9ICguLi5hcmdzOiBQYXJhbWV0ZXJzPFQ+KSA9PiB7XG4gICAgICAgIGlmICh0aW1lcikgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGZuKC4uLmFyZ3MpLCBtcyk7XG4gICAgfTtcbiAgICBjb25zdCBhYm9ydCA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRpbWVyKSBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgIH07XG4gICAgcmV0dXJuIFtkZWJvdW5jZWQsIGFib3J0XTtcbn1cbiIsImltcG9ydCB7IENTU1Byb3BlcnRpZXMsIFJlZk9iamVjdCwgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyB1c2VQb3NpdGlvbk9ic2VydmVyIH0gZnJvbSBcIkBtZW5kaXgvd2lkZ2V0LXBsdWdpbi1ob29rcy91c2VQb3NpdGlvbk9ic2VydmVyXCI7XG5pbXBvcnQgeyBkZWJvdW5jZSB9IGZyb20gXCJAbWVuZGl4L3dpZGdldC1wbHVnaW4tcGxhdGZvcm0vdXRpbHMvZGVib3VuY2VcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZU1lbnVTdHlsZTxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+KGlzT3BlbjogYm9vbGVhbik6IFtSZWZPYmplY3Q8VCB8IG51bGw+LCBDU1NQcm9wZXJ0aWVzXSB7XG4gICAgY29uc3QgcmVmID0gdXNlUmVmPFQgfCBudWxsPihudWxsKTtcbiAgICBjb25zdCBbc3R5bGUsIHNldFN0eWxlXSA9IHVzZVN0YXRlPENTU1Byb3BlcnRpZXM+KHsgdmlzaWJpbGl0eTogXCJoaWRkZW5cIiwgcG9zaXRpb246IFwiZml4ZWRcIiB9KTtcbiAgICBjb25zdCBbc2V0U3R5bGVEZWJvdW5jZWQsIGFib3J0XSA9IHVzZU1lbW8oKCkgPT4gZGVib3VuY2Uoc2V0U3R5bGUsIDMyKSwgW3NldFN0eWxlXSk7XG4gICAgY29uc3QgbWVudUhlaWdodCA9IHJlZi5jdXJyZW50Py5vZmZzZXRIZWlnaHQgPz8gMDtcbiAgICBjb25zdCB0YXJnZXRCb3ggPSB1c2VQb3NpdGlvbk9ic2VydmVyKHJlZi5jdXJyZW50Py5wYXJlbnRFbGVtZW50ID8/IG51bGwsIGlzT3Blbik7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAodGFyZ2V0Qm94ID09PSB1bmRlZmluZWQgfHwgcmVmLmN1cnJlbnQgPT09IG51bGwgfHwgIWlzT3Blbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0U3R5bGVEZWJvdW5jZWQoe1xuICAgICAgICAgICAgdmlzaWJpbGl0eTogXCJ2aXNpYmxlXCIsXG4gICAgICAgICAgICBwb3NpdGlvbjogXCJmaXhlZFwiLFxuICAgICAgICAgICAgd2lkdGg6IHRhcmdldEJveC53aWR0aCxcbiAgICAgICAgICAgIC4uLmdldE1lbnVQb3NpdGlvbih0YXJnZXRCb3gsIHJlZi5jdXJyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gYWJvcnQ7XG4gICAgfSwgW21lbnVIZWlnaHQsIGlzT3BlbiwgdGFyZ2V0Qm94LCBzZXRTdHlsZURlYm91bmNlZCwgYWJvcnRdKTtcblxuICAgIHJldHVybiBbcmVmLCBzdHlsZV07XG59XG5cbmZ1bmN0aW9uIGdldE1lbnVQb3NpdGlvbih0YXJnZXRCb3g6IERPTVJlY3QsIG1lbnVCb3g6IERPTVJlY3QpOiBDU1NQcm9wZXJ0aWVzIHtcbiAgICBjb25zdCB7IGhlaWdodCB9ID0gbWVudUJveDtcbiAgICBjb25zdCBib3R0b21TcGFjZSA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHRhcmdldEJveC5ib3R0b207XG4gICAgY29uc3QgdG9wU3BhY2UgPSB0YXJnZXRCb3gudG9wIC0gaGVpZ2h0IDwgMCA/IHRhcmdldEJveC50b3AgLSBoZWlnaHQgOiAwO1xuXG4gICAgaWYgKGJvdHRvbVNwYWNlIDwgaGVpZ2h0KSB7XG4gICAgICAgIHJldHVybiB7IGJvdHRvbTogd2luZG93LmlubmVySGVpZ2h0IC0gdGFyZ2V0Qm94LnRvcCArIHRvcFNwYWNlLCBsZWZ0OiB0YXJnZXRCb3gubGVmdCB9O1xuICAgIH1cbiAgICByZXR1cm4geyB0b3A6IHRhcmdldEJveC5ib3R0b20sIGxlZnQ6IHRhcmdldEJveC5sZWZ0IH07XG59XG4iLCJpbXBvcnQgY2xhc3NOYW1lcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IHsgVXNlQ29tYm9ib3hQcm9wR2V0dGVycyB9IGZyb20gXCJkb3duc2hpZnQvdHlwaW5nc1wiO1xuaW1wb3J0IHsgTW91c2VFdmVudCwgUHJvcHNXaXRoQ2hpbGRyZW4sIFJlYWN0RWxlbWVudCwgUmVhY3ROb2RlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyB1c2VNZW51U3R5bGUgfSBmcm9tIFwiLi4vaG9va3MvdXNlTWVudVN0eWxlXCI7XG5pbXBvcnQgeyBOb09wdGlvbnNQbGFjZWhvbGRlciB9IGZyb20gXCIuL1BsYWNlaG9sZGVyXCI7XG5cbmludGVyZmFjZSBDb21ib2JveE1lbnVXcmFwcGVyUHJvcHMgZXh0ZW5kcyBQcm9wc1dpdGhDaGlsZHJlbiwgUGFydGlhbDxVc2VDb21ib2JveFByb3BHZXR0ZXJzPHN0cmluZz4+IHtcbiAgICBhbHdheXNPcGVuPzogYm9vbGVhbjtcbiAgICBoaWdobGlnaHRlZEluZGV4PzogbnVtYmVyIHwgbnVsbDtcbiAgICBpc0VtcHR5OiBib29sZWFuO1xuICAgIGlzTG9hZGluZzogYm9vbGVhbjtcbiAgICBpc09wZW46IGJvb2xlYW47XG4gICAgbGF6eUxvYWRpbmc6IGJvb2xlYW47XG4gICAgbG9hZGVyOiBSZWFjdE5vZGU7XG4gICAgbWVudUZvb3RlckNvbnRlbnQ/OiBSZWFjdE5vZGU7XG4gICAgbWVudUhlYWRlckNvbnRlbnQ/OiBSZWFjdE5vZGU7XG4gICAgbm9PcHRpb25zVGV4dD86IHN0cmluZztcbiAgICBvbk9wdGlvbkNsaWNrPzogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQ7XG4gICAgb25TY3JvbGw/OiAoZTogYW55KSA9PiB2b2lkO1xufVxuXG5mdW5jdGlvbiBQcmV2ZW50TWVudUNsb3NlRXZlbnRIYW5kbGVyKGU6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xufVxuXG5mdW5jdGlvbiBGb3JjZVByZXZlbnRNZW51Q2xvc2VFdmVudEhhbmRsZXIoZTogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ29tYm9ib3hNZW51V3JhcHBlcihwcm9wczogQ29tYm9ib3hNZW51V3JhcHBlclByb3BzKTogUmVhY3RFbGVtZW50IHtcbiAgICBjb25zdCB7XG4gICAgICAgIGFsd2F5c09wZW4sXG4gICAgICAgIGNoaWxkcmVuLFxuICAgICAgICBnZXRNZW51UHJvcHMsXG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXgsXG4gICAgICAgIGlzRW1wdHksXG4gICAgICAgIGlzTG9hZGluZyxcbiAgICAgICAgaXNPcGVuLFxuICAgICAgICBsYXp5TG9hZGluZyxcbiAgICAgICAgbG9hZGVyLFxuICAgICAgICBtZW51Rm9vdGVyQ29udGVudCxcbiAgICAgICAgbWVudUhlYWRlckNvbnRlbnQsXG4gICAgICAgIG5vT3B0aW9uc1RleHQsXG4gICAgICAgIG9uT3B0aW9uQ2xpY2ssXG4gICAgICAgIG9uU2Nyb2xsXG4gICAgfSA9IHByb3BzO1xuXG4gICAgY29uc3QgW3JlZiwgc3R5bGVdID0gdXNlTWVudVN0eWxlPEhUTUxEaXZFbGVtZW50Pihpc09wZW4pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdlxuICAgICAgICAgICAgcmVmPXtyZWZ9XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXCJ3aWRnZXQtY29tYm9ib3gtbWVudVwiLCB7IFwid2lkZ2V0LWNvbWJvYm94LW1lbnUtaGlkZGVuXCI6ICFpc09wZW4gfSl9XG4gICAgICAgICAgICBzdHlsZT17XG4gICAgICAgICAgICAgICAgYWx3YXlzT3BlblxuICAgICAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJibG9ja1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBcInZpc2libGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIlxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgOiBzdHlsZVxuICAgICAgICAgICAgfVxuICAgICAgICA+XG4gICAgICAgICAgICB7bWVudUhlYWRlckNvbnRlbnQgJiYgKFxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94LW1lbnUtaGVhZGVyIHdpZGdldC1jb21ib2JveC1pdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgb25Nb3VzZURvd249e1ByZXZlbnRNZW51Q2xvc2VFdmVudEhhbmRsZXJ9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7bWVudUhlYWRlckNvbnRlbnR9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPHVsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFwid2lkZ2V0LWNvbWJvYm94LW1lbnUtbGlzdFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIFwid2lkZ2V0LWNvbWJvYm94LW1lbnUtaGlnaGxpZ2h0ZWRcIjogKGhpZ2hsaWdodGVkSW5kZXggPz8gLTEpID49IDAsXG4gICAgICAgICAgICAgICAgICAgIFwid2lkZ2V0LWNvbWJvYm94LW1lbnUtbGF6eS1zY3JvbGxcIjogbGF6eUxvYWRpbmcgJiYgIWlzRW1wdHlcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB7Li4uZ2V0TWVudVByb3BzPy4oXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6IG9uT3B0aW9uQ2xpY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRG93bjogRm9yY2VQcmV2ZW50TWVudUNsb3NlRXZlbnRIYW5kbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgb25TY3JvbGxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBzdXBwcmVzc1JlZkVycm9yOiB0cnVlIH1cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtpc09wZW4gPyAoXG4gICAgICAgICAgICAgICAgICAgIGlzRW1wdHkgJiYgIWlzTG9hZGluZyA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxOb09wdGlvbnNQbGFjZWhvbGRlcj57bm9PcHRpb25zVGV4dH08L05vT3B0aW9uc1BsYWNlaG9sZGVyPlxuICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgICAgIHtsb2FkZXJ9XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAge21lbnVGb290ZXJDb250ZW50ICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndpZGdldC1jb21ib2JveC1tZW51LWZvb3RlclwiIG9uTW91c2VEb3duPXtQcmV2ZW50TWVudUNsb3NlRXZlbnRIYW5kbGVyfT5cbiAgICAgICAgICAgICAgICAgICAge21lbnVGb290ZXJDb250ZW50fVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cbiIsImltcG9ydCBjbGFzc05hbWVzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgeyBVc2VDb21ib2JveFByb3BHZXR0ZXJzIH0gZnJvbSBcImRvd25zaGlmdC90eXBpbmdzXCI7XG5pbXBvcnQgeyBQcm9wc1dpdGhDaGlsZHJlbiwgUmVhY3RFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5cbmludGVyZmFjZSBDb21ib2JveE9wdGlvbldyYXBwZXJQcm9wcyBleHRlbmRzIFByb3BzV2l0aENoaWxkcmVuLCBQYXJ0aWFsPFVzZUNvbWJvYm94UHJvcEdldHRlcnM8c3RyaW5nPj4ge1xuICAgIGlzU2VsZWN0ZWQ/OiBib29sZWFuO1xuICAgIGlzSGlnaGxpZ2h0ZWQ/OiBib29sZWFuO1xuICAgIGl0ZW06IHN0cmluZztcbiAgICBpbmRleDogbnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ29tYm9ib3hPcHRpb25XcmFwcGVyKHByb3BzOiBDb21ib2JveE9wdGlvbldyYXBwZXJQcm9wcyk6IFJlYWN0RWxlbWVudCB7XG4gICAgY29uc3QgeyBjaGlsZHJlbiwgaXNTZWxlY3RlZCwgaXNIaWdobGlnaHRlZCwgaXRlbSwgZ2V0SXRlbVByb3BzLCBpbmRleCB9ID0gcHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGxpXG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXCJ3aWRnZXQtY29tYm9ib3gtaXRlbVwiLCB7XG4gICAgICAgICAgICAgICAgXCJ3aWRnZXQtY29tYm9ib3gtaXRlbS1zZWxlY3RlZFwiOiBpc1NlbGVjdGVkLFxuICAgICAgICAgICAgICAgIFwid2lkZ2V0LWNvbWJvYm94LWl0ZW0taGlnaGxpZ2h0ZWRcIjogaXNIaWdobGlnaHRlZFxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICB7Li4uZ2V0SXRlbVByb3BzPy4oe1xuICAgICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICAgIGl0ZW1cbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgYXJpYS1zZWxlY3RlZD17aXNTZWxlY3RlZH1cbiAgICAgICAgPlxuICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICA8L2xpPlxuICAgICk7XG59XG4iLCJpbXBvcnQgY2xhc3NOYW1lcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IHsgUmVhY3RFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5cbmludGVyZmFjZSBDb21ib2JveEdyb3VwSGVhZGVyUHJvcHMge1xuICAgIHRpdGxlOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBub24taW50ZXJhY3RpdmUsIG5vbi1zZWxlY3RhYmxlIGxpc3QgaXRlbSByZW5kZXJlZCBhcyBhIGdyb3VwIGhlYWRpbmdcbiAqIGluc2lkZSB0aGUgY29tYm9ib3ggZHJvcGRvd24gbWVudS5cbiAqXG4gKiBJbXBvcnRhbnQ6IHRoaXMgZWxlbWVudCBpcyBOT1QgaW5jbHVkZWQgaW4gdGhlIGRvd25zaGlmdCBpdGVtIGluZGV4XG4gKiBzZXF1ZW5jZSDigJQgaXQgaXMgcHVyZWx5IHZpc3VhbCBhbmQgc2tpcHBlZCBkdXJpbmcga2V5Ym9hcmQgbmF2aWdhdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIENvbWJvYm94R3JvdXBIZWFkZXIoeyB0aXRsZSB9OiBDb21ib2JveEdyb3VwSGVhZGVyUHJvcHMpOiBSZWFjdEVsZW1lbnQge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxsaVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFwid2lkZ2V0LWNvbWJvYm94LWdyb3VwLWhlYWRlclwiKX1cbiAgICAgICAgICAgIGFyaWEtZGlzYWJsZWQ9XCJ0cnVlXCJcbiAgICAgICAgICAgIHJvbGU9XCJzZXBhcmF0b3JcIlxuICAgICAgICAgICAgYXJpYS1sYWJlbD17dGl0bGV9XG4gICAgICAgICAgICBvbk1vdXNlRG93bj17ZSA9PiBlLnByZXZlbnREZWZhdWx0KCl9XG4gICAgICAgID5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIndpZGdldC1jb21ib2JveC1ncm91cC1oZWFkZXItdGV4dFwiPnt0aXRsZX08L3NwYW4+XG4gICAgICAgIDwvbGk+XG4gICAgKTtcbn1cbiIsImltcG9ydCB7IFJlYWN0RWxlbWVudCB9IGZyb20gXCJyZWFjdFwiO1xuXG50eXBlIFNrZWxldG9uTG9hZGVyUHJvcHMgPSB7XG4gICAgd2l0aENoZWNrYm94PzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBTa2VsZXRvbkxvYWRlcih7IHdpdGhDaGVja2JveCA9IGZhbHNlIH06IFNrZWxldG9uTG9hZGVyUHJvcHMpOiBSZWFjdEVsZW1lbnQge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94LXNrZWxldG9uXCI+XG4gICAgICAgICAgICB7d2l0aENoZWNrYm94ICYmIDxzcGFuIGNsYXNzTmFtZT1cIndpZGdldC1jb21ib2JveC1za2VsZXRvbi1sb2FkZXIgd2lkZ2V0LWNvbWJvYm94LXNrZWxldG9uLWxvYWRlci1zbWFsbFwiIC8+fVxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94LXNrZWxldG9uLWxvYWRlclwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG4iLCJpbXBvcnQgeyBGcmFnbWVudCwgUmVhY3RFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBMb2FkaW5nVHlwZUVudW0gfSBmcm9tIFwidHlwaW5ncy9Hcm91cGVkQ29tYm9ib3hQcm9wc1wiO1xuaW1wb3J0IHsgREVGQVVMVF9MSU1JVF9TSVpFIH0gZnJvbSBcIi4uL2hlbHBlcnMvdXRpbHNcIjtcbmltcG9ydCB7IFNrZWxldG9uTG9hZGVyIH0gZnJvbSBcIi4vU2tlbGV0b25Mb2FkZXJcIjtcbmltcG9ydCB7IFNwaW5uZXJMb2FkZXIgfSBmcm9tIFwiLi9TcGlubmVyTG9hZGVyXCI7XG5cbnR5cGUgTG9hZGVyUHJvcHMgPSB7XG4gICAgaXNFbXB0eTogYm9vbGVhbjtcbiAgICBpc0xvYWRpbmc6IGJvb2xlYW47XG4gICAgaXNPcGVuOiBib29sZWFuO1xuICAgIGxhenlMb2FkaW5nOiBib29sZWFuO1xuICAgIGxvYWRpbmdUeXBlPzogTG9hZGluZ1R5cGVFbnVtO1xuICAgIHdpdGhDaGVja2JveDogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBMb2FkZXIocHJvcHM6IExvYWRlclByb3BzKTogUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gICAgY29uc3QgeyBpc0VtcHR5LCBpc0xvYWRpbmcsIGlzT3BlbiwgbGF6eUxvYWRpbmcsIGxvYWRpbmdUeXBlLCB3aXRoQ2hlY2tib3ggfSA9IHByb3BzO1xuXG4gICAgaWYgKCFpc09wZW4gfHwgIWxhenlMb2FkaW5nIHx8ICFpc0xvYWRpbmcpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxvYWRpbmdUeXBlID09PSBcInNrZWxldG9uXCIgPyAoXG4gICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICAgIHtBcnJheS5mcm9tKHsgbGVuZ3RoOiBERUZBVUxUX0xJTUlUX1NJWkUgfSkubWFwKChfLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgPFNrZWxldG9uTG9hZGVyIHdpdGhDaGVja2JveD17d2l0aENoZWNrYm94fSBrZXk9e2l9IC8+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgPC9GcmFnbWVudD5cbiAgICApIDogKFxuICAgICAgICA8U3Bpbm5lckxvYWRlciB3aXRoTWFyZ2lucz17aXNFbXB0eX0gLz5cbiAgICApO1xufVxuIiwiaW1wb3J0IHsgVXNlQ29tYm9ib3hQcm9wR2V0dGVycyB9IGZyb20gXCJkb3duc2hpZnQvdHlwaW5nc1wiO1xuaW1wb3J0IHsgRnJhZ21lbnQsIFJlYWN0RWxlbWVudCwgUmVhY3ROb2RlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBTaW5nbGVTZWxlY3RvciB9IGZyb20gXCIuLi8uLi9oZWxwZXJzL3R5cGVzXCI7XG5pbXBvcnQgeyBncm91cEl0ZW1zIH0gZnJvbSBcIi4uLy4uL2hlbHBlcnMvZ3JvdXBpbmdVdGlsc1wiO1xuaW1wb3J0IHsgQ29tYm9ib3hNZW51V3JhcHBlciB9IGZyb20gXCIuLi9Db21ib2JveE1lbnVXcmFwcGVyXCI7XG5pbXBvcnQgeyBDb21ib2JveE9wdGlvbldyYXBwZXIgfSBmcm9tIFwiLi4vQ29tYm9ib3hPcHRpb25XcmFwcGVyXCI7XG5pbXBvcnQgeyBDb21ib2JveEdyb3VwSGVhZGVyIH0gZnJvbSBcIi4uL0NvbWJvYm94R3JvdXBIZWFkZXJcIjtcbmltcG9ydCB7IExvYWRlciB9IGZyb20gXCIuLi9Mb2FkZXJcIjtcblxuaW50ZXJmYWNlIENvbWJvYm94TWVudVByb3BzIGV4dGVuZHMgUGFydGlhbDxVc2VDb21ib2JveFByb3BHZXR0ZXJzPHN0cmluZz4+IHtcbiAgICBpc09wZW46IGJvb2xlYW47XG4gICAgc2VsZWN0b3I6IFNpbmdsZVNlbGVjdG9yO1xuICAgIGhpZ2hsaWdodGVkSW5kZXg6IG51bWJlciB8IG51bGw7XG4gICAgc2VsZWN0ZWRJdGVtPzogc3RyaW5nIHwgbnVsbDtcbiAgICBub09wdGlvbnNUZXh0Pzogc3RyaW5nO1xuICAgIGFsd2F5c09wZW4/OiBib29sZWFuO1xuICAgIG1lbnVGb290ZXJDb250ZW50PzogUmVhY3ROb2RlO1xuICAgIGlzTG9hZGluZzogYm9vbGVhbjtcbiAgICBsYXp5TG9hZGluZzogYm9vbGVhbjtcbiAgICBvblNjcm9sbDogKGU6IGFueSkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFNpbmdsZVNlbGVjdGlvbk1lbnUoe1xuICAgIGlzT3BlbixcbiAgICBzZWxlY3RvcixcbiAgICBoaWdobGlnaHRlZEluZGV4LFxuICAgIGdldE1lbnVQcm9wcyxcbiAgICBnZXRJdGVtUHJvcHMsXG4gICAgbm9PcHRpb25zVGV4dCxcbiAgICBhbHdheXNPcGVuLFxuICAgIG1lbnVGb290ZXJDb250ZW50LFxuICAgIGlzTG9hZGluZyxcbiAgICBsYXp5TG9hZGluZyxcbiAgICBvblNjcm9sbFxufTogQ29tYm9ib3hNZW51UHJvcHMpOiBSZWFjdEVsZW1lbnQge1xuICAgIGNvbnN0IGl0ZW1zID0gc2VsZWN0b3Iub3B0aW9ucy5nZXRBbGwoKTtcblxuICAgIC8vIEJ1aWxkIHRoZSBncm91cCBmdW5jdGlvbiDigJQgZmFsbHMgYmFjayB0byBudWxsIChubyBncm91cGluZykgd2hlbiBjYXB0aW9uIHByb3ZpZGVyIGhhcyBubyBnZXRHcm91cFxuICAgIGNvbnN0IGdldEdyb3VwRm4gPSBzZWxlY3Rvci5jYXB0aW9uLmdldEdyb3VwXG4gICAgICAgID8gKGlkOiBzdHJpbmcpID0+IHNlbGVjdG9yLmNhcHRpb24uZ2V0R3JvdXAhKGlkKVxuICAgICAgICA6IChfaWQ6IHN0cmluZykgPT4gbnVsbDtcblxuICAgIGNvbnN0IHNlZ21lbnRzID0gZ3JvdXBJdGVtcyhpdGVtcywgZ2V0R3JvdXBGbik7XG4gICAgY29uc3QgaXNHcm91cGVkID0gc2VnbWVudHMuc29tZShzID0+IHMuZ3JvdXBUaXRsZSAhPT0gbnVsbCk7XG5cbiAgICAvLyBXZSBuZWVkIGEgY29udGludW91cyBkb3duc2hpZnQgaW5kZXggdGhhdCBza2lwcyBncm91cCBoZWFkZXIgcm93c1xuICAgIGxldCBkb3duc2hpZnRJbmRleCA9IDA7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8Q29tYm9ib3hNZW51V3JhcHBlclxuICAgICAgICAgICAgYWx3YXlzT3Blbj17YWx3YXlzT3Blbn1cbiAgICAgICAgICAgIGdldE1lbnVQcm9wcz17Z2V0TWVudVByb3BzfVxuICAgICAgICAgICAgaXNFbXB0eT17aXRlbXM/Lmxlbmd0aCA8PSAwfVxuICAgICAgICAgICAgaXNMb2FkaW5nPXtpc0xvYWRpbmd9XG4gICAgICAgICAgICBpc09wZW49e2lzT3Blbn1cbiAgICAgICAgICAgIGxhenlMb2FkaW5nPXtsYXp5TG9hZGluZ31cbiAgICAgICAgICAgIGxvYWRlcj17XG4gICAgICAgICAgICAgICAgPExvYWRlclxuICAgICAgICAgICAgICAgICAgICBpc0xvYWRpbmc9e2lzTG9hZGluZ31cbiAgICAgICAgICAgICAgICAgICAgaXNPcGVuPXtpc09wZW59XG4gICAgICAgICAgICAgICAgICAgIGxhenlMb2FkaW5nPXtsYXp5TG9hZGluZ31cbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZ1R5cGU9e3NlbGVjdG9yLmxvYWRpbmdUeXBlfVxuICAgICAgICAgICAgICAgICAgICB3aXRoQ2hlY2tib3g9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICBpc0VtcHR5PXtpdGVtcy5sZW5ndGggPT09IDB9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1lbnVGb290ZXJDb250ZW50PXttZW51Rm9vdGVyQ29udGVudH1cbiAgICAgICAgICAgIG5vT3B0aW9uc1RleHQ9e25vT3B0aW9uc1RleHR9XG4gICAgICAgICAgICBvblNjcm9sbD17bGF6eUxvYWRpbmcgPyBvblNjcm9sbCA6IHVuZGVmaW5lZH1cbiAgICAgICAgPlxuICAgICAgICAgICAge2lzT3BlbiAmJlxuICAgICAgICAgICAgICAgIChpc0dyb3VwZWRcbiAgICAgICAgICAgICAgICAgICAgPyBzZWdtZW50cy5tYXAoc2VnbWVudCA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxGcmFnbWVudCBrZXk9e3NlZ21lbnQuZ3JvdXBUaXRsZSA/PyBcIl9fdW5ncm91cGVkX19cIn0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VnbWVudC5ncm91cFRpdGxlICYmIDxDb21ib2JveEdyb3VwSGVhZGVyIHRpdGxlPXtzZWdtZW50Lmdyb3VwVGl0bGV9IC8+fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlZ21lbnQuaXRlbXMubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IGRvd25zaGlmdEluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbWJvYm94T3B0aW9uV3JhcHBlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpdGVtfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNIaWdobGlnaHRlZD17YWx3YXlzT3BlbiA/IGZhbHNlIDogaGlnaGxpZ2h0ZWRJbmRleCA9PT0gY3VycmVudEluZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZD17c2VsZWN0b3IuY3VycmVudElkID09PSBpdGVtfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbT17aXRlbX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEl0ZW1Qcm9wcz17Z2V0SXRlbVByb3BzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg9e2N1cnJlbnRJbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlbGVjdG9yLmNhcHRpb24ucmVuZGVyKGl0ZW0sIFwib3B0aW9uc1wiKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Db21ib2JveE9wdGlvbldyYXBwZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgICAgIDogaXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29tYm9ib3hPcHRpb25XcmFwcGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2l0ZW19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0hpZ2hsaWdodGVkPXthbHdheXNPcGVuID8gZmFsc2UgOiBoaWdobGlnaHRlZEluZGV4ID09PSBpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e3NlbGVjdG9yLmN1cnJlbnRJZCA9PT0gaXRlbX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW09e2l0ZW19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRJdGVtUHJvcHM9e2dldEl0ZW1Qcm9wc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlbGVjdG9yLmNhcHRpb24ucmVuZGVyKGl0ZW0sIFwib3B0aW9uc1wiKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Db21ib2JveE9wdGlvbldyYXBwZXI+XG4gICAgICAgICAgICAgICAgICAgICAgKSkpfVxuICAgICAgICA8L0NvbWJvYm94TWVudVdyYXBwZXI+XG4gICAgKTtcbn1cbiIsImltcG9ydCBjbGFzc05hbWVzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgeyBGcmFnbWVudCwgS2V5Ym9hcmRFdmVudEhhbmRsZXIsIFJlYWN0RWxlbWVudCwgdXNlTWVtbywgdXNlUmVmIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBDbGVhckJ1dHRvbiB9IGZyb20gXCIuLi8uLi9hc3NldHMvaWNvbnNcIjtcbmltcG9ydCB7IFNlbGVjdGlvbkJhc2VQcm9wcywgU2luZ2xlU2VsZWN0b3IgfSBmcm9tIFwiLi4vLi4vaGVscGVycy90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0SW5wdXRMYWJlbCwgZ2V0VmFsaWRhdGlvbkVycm9ySWQgfSBmcm9tIFwiLi4vLi4vaGVscGVycy91dGlsc1wiO1xuaW1wb3J0IHsgdXNlRG93bnNoaWZ0U2luZ2xlU2VsZWN0UHJvcHMgfSBmcm9tIFwiLi4vLi4vaG9va3MvdXNlRG93bnNoaWZ0U2luZ2xlU2VsZWN0UHJvcHNcIjtcbmltcG9ydCB7IHVzZUxhenlMb2FkaW5nIH0gZnJvbSBcIi4uLy4uL2hvb2tzL3VzZUxhenlMb2FkaW5nXCI7XG5pbXBvcnQgeyBDb21ib2JveFdyYXBwZXIgfSBmcm9tIFwiLi4vQ29tYm9ib3hXcmFwcGVyXCI7XG5pbXBvcnQgeyBJbnB1dFBsYWNlaG9sZGVyIH0gZnJvbSBcIi4uL1BsYWNlaG9sZGVyXCI7XG5pbXBvcnQgeyBTaW5nbGVTZWxlY3Rpb25NZW51IH0gZnJvbSBcIi4vU2luZ2xlU2VsZWN0aW9uTWVudVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gU2luZ2xlU2VsZWN0aW9uKHtcbiAgICBzZWxlY3RvcixcbiAgICB0YWJJbmRleCA9IDAsXG4gICAgYTExeUNvbmZpZyxcbiAgICBrZWVwTWVudU9wZW4sXG4gICAgbWVudUZvb3RlckNvbnRlbnQsXG4gICAgYXJpYVJlcXVpcmVkLFxuICAgIC4uLm9wdGlvbnNcbn06IFNlbGVjdGlvbkJhc2VQcm9wczxTaW5nbGVTZWxlY3Rvcj4pOiBSZWFjdEVsZW1lbnQge1xuICAgIGNvbnN0IHtcbiAgICAgICAgZ2V0SW5wdXRQcm9wcyxcbiAgICAgICAgZ2V0VG9nZ2xlQnV0dG9uUHJvcHMsXG4gICAgICAgIGdldEl0ZW1Qcm9wcyxcbiAgICAgICAgc2VsZWN0ZWRJdGVtLFxuICAgICAgICBnZXRNZW51UHJvcHMsXG4gICAgICAgIHJlc2V0LFxuICAgICAgICBpc09wZW4sXG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXgsXG4gICAgICAgIHNlbGVjdEl0ZW1cbiAgICB9ID0gdXNlRG93bnNoaWZ0U2luZ2xlU2VsZWN0UHJvcHMoc2VsZWN0b3IsIG9wdGlvbnMsIGExMXlDb25maWcuYTExeVN0YXR1c01lc3NhZ2UpO1xuICAgIGNvbnN0IGlucHV0UmVmID0gdXNlUmVmPEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsPihudWxsKTtcbiAgICBjb25zdCBsYXp5TG9hZGluZyA9IHNlbGVjdG9yLmxhenlMb2FkaW5nID8/IGZhbHNlO1xuICAgIGNvbnN0IHsgb25TY3JvbGwgfSA9IHVzZUxhenlMb2FkaW5nKHtcbiAgICAgICAgaGFzTW9yZUl0ZW1zOiBzZWxlY3Rvci5vcHRpb25zLmhhc01vcmUgPz8gZmFsc2UsXG4gICAgICAgIGlzSW5maW5pdGU6IGxhenlMb2FkaW5nLFxuICAgICAgICBpc09wZW4sXG4gICAgICAgIGxvYWRNb3JlOiAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0b3Iub3B0aW9ucy5sb2FkTW9yZSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLm9wdGlvbnMubG9hZE1vcmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZGF0YXNvdXJjZUZpbHRlcjogc2VsZWN0b3Iub3B0aW9ucy5kYXRhc291cmNlRmlsdGVyLFxuICAgICAgICByZWFkT25seTogc2VsZWN0b3IucmVhZE9ubHlcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlbGVjdGVkSXRlbUNhcHRpb24gPSB1c2VNZW1vKFxuICAgICAgICAoKSA9PiBzZWxlY3Rvci5jYXB0aW9uLnJlbmRlcihzZWxlY3RlZEl0ZW0sIFwibGFiZWxcIiksXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgICAgICAgW1xuICAgICAgICAgICAgc2VsZWN0ZWRJdGVtLFxuICAgICAgICAgICAgc2VsZWN0b3Iuc3RhdHVzLFxuICAgICAgICAgICAgc2VsZWN0b3IuY2FwdGlvbixcbiAgICAgICAgICAgIHNlbGVjdG9yLmNhcHRpb24uZW1wdHlDYXB0aW9uLFxuICAgICAgICAgICAgc2VsZWN0b3IuY3VycmVudElkLFxuICAgICAgICAgICAgc2VsZWN0b3IuY2FwdGlvbi5mb3JtYXR0ZXJcbiAgICAgICAgXVxuICAgICk7XG5cbiAgICBjb25zdCBpbnB1dExhYmVsID0gZ2V0SW5wdXRMYWJlbChvcHRpb25zLmlucHV0SWQpO1xuICAgIGNvbnN0IGVycm9ySWQgPSBnZXRWYWxpZGF0aW9uRXJyb3JJZChvcHRpb25zLmlucHV0SWQpO1xuICAgIGNvbnN0IGhhc0xhYmVsID0gdXNlTWVtbygoKSA9PiBCb29sZWFuKGlucHV0TGFiZWwpLCBbaW5wdXRMYWJlbF0pO1xuICAgIGNvbnN0IG9uSW5wdXRLZXlEb3duID0gdXNlTWVtbzxLZXlib2FyZEV2ZW50SGFuZGxlcjxIVE1MSW5wdXRFbGVtZW50PiB8IHVuZGVmaW5lZD4oKCkgPT4ge1xuICAgICAgICBpZiAoIXNlbGVjdG9yLmNsZWFyYWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlID0+IHtcbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gXCJCYWNrc3BhY2VcIiAmJiBlLmN1cnJlbnRUYXJnZXQudmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RJdGVtKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0sIFtzZWxlY3Rvci5jbGVhcmFibGUsIHNlbGVjdEl0ZW1dKTtcblxuICAgIGNvbnN0IGlucHV0UHJvcHMgPSBnZXRJbnB1dFByb3BzKFxuICAgICAgICB7XG4gICAgICAgICAgICBkaXNhYmxlZDogc2VsZWN0b3IucmVhZE9ubHksXG4gICAgICAgICAgICByZWFkT25seTogc2VsZWN0b3Iub3B0aW9ucy5maWx0ZXJUeXBlID09PSBcIm5vbmVcIixcbiAgICAgICAgICAgIHJlZjogaW5wdXRSZWYsXG4gICAgICAgICAgICBcImFyaWEtcmVxdWlyZWRcIjogYXJpYVJlcXVpcmVkLnZhbHVlLFxuICAgICAgICAgICAgXCJhcmlhLWxhYmVsXCI6ICFoYXNMYWJlbCAmJiBvcHRpb25zLmFyaWFMYWJlbCA/IG9wdGlvbnMuYXJpYUxhYmVsIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgb25LZXlEb3duOiBvbklucHV0S2V5RG93blxuICAgICAgICB9LFxuICAgICAgICB7IHN1cHByZXNzUmVmRXJyb3I6IHRydWUgfVxuICAgICk7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgICAgPENvbWJvYm94V3JhcHBlclxuICAgICAgICAgICAgICAgIGlzT3Blbj17aXNPcGVuIHx8IGtlZXBNZW51T3BlbiA9PT0gdHJ1ZX1cbiAgICAgICAgICAgICAgICByZWFkT25seT17c2VsZWN0b3IucmVhZE9ubHl9XG4gICAgICAgICAgICAgICAgcmVhZE9ubHlTdHlsZT17b3B0aW9ucy5yZWFkT25seVN0eWxlfVxuICAgICAgICAgICAgICAgIGdldFRvZ2dsZUJ1dHRvblByb3BzPXtnZXRUb2dnbGVCdXR0b25Qcm9wc31cbiAgICAgICAgICAgICAgICB2YWxpZGF0aW9uPXtzZWxlY3Rvci52YWxpZGF0aW9ufVxuICAgICAgICAgICAgICAgIGlzTG9hZGluZz17bGF6eUxvYWRpbmcgJiYgc2VsZWN0b3Iub3B0aW9ucy5pc0xvYWRpbmd9XG4gICAgICAgICAgICAgICAgZXJyb3JJZD17ZXJyb3JJZH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcIndpZGdldC1jb21ib2JveC1zZWxlY3RlZC1pdGVtc1wiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIndpZGdldC1jb21ib2JveC1jdXN0b20tY29udGVudFwiOiBzZWxlY3Rvci5jdXN0b21Db250ZW50VHlwZSA9PT0gXCJ5ZXNcIlxuICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFwid2lkZ2V0LWNvbWJvYm94LWlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIndpZGdldC1jb21ib2JveC1pbnB1dC1ub2ZpbHRlclwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rvci5vcHRpb25zLmZpbHRlclR5cGUgPT09IFwibm9uZVwiIHx8IHNlbGVjdG9yLnJlYWRPbmx5XG4gICAgICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYkluZGV4PXt0YWJJbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHsuLi5pbnB1dFByb3BzfVxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCIgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWxsZWRieT17aGFzTGFiZWwgPyBpbnB1dFByb3BzW1wiYXJpYS1sYWJlbGxlZGJ5XCJdIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1kZXNjcmliZWRieT17c2VsZWN0b3IudmFsaWRhdGlvbiA/IGVycm9ySWQgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWludmFsaWQ9e3NlbGVjdG9yLnZhbGlkYXRpb24gPyB0cnVlIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8SW5wdXRQbGFjZWhvbGRlclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNFbXB0eT17IXNlbGVjdG9yLmN1cnJlbnRJZCB8fCAhc2VsZWN0b3IuY2FwdGlvbi5yZW5kZXIoc2VsZWN0ZWRJdGVtLCBcImxhYmVsXCIpfVxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT17c2VsZWN0b3IuY3VzdG9tQ29udGVudFR5cGUgPT09IFwieWVzXCIgPyBcImN1c3RvbVwiIDogXCJ0ZXh0XCJ9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZEl0ZW1DYXB0aW9ufVxuICAgICAgICAgICAgICAgICAgICA8L0lucHV0UGxhY2Vob2xkZXI+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgeyFzZWxlY3Rvci5yZWFkT25seSAmJlxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rvci5jbGVhcmFibGUgJiZcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3IuY3VycmVudElkICE9PSBudWxsICYmXG4gICAgICAgICAgICAgICAgICAgICEoc2VsZWN0b3Iuc2VsZWN0b3JUeXBlID09PSBcInN0YXRpY1wiICYmIHNlbGVjdG9yLmF0dHJpYnV0ZVR5cGUgPT09IFwiYm9vbGVhblwiKSAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYkluZGV4PXt0YWJJbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIndpZGdldC1jb21ib2JveC1jbGVhci1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YTExeUNvbmZpZy5hcmlhTGFiZWxzPy5jbGVhclNlbGVjdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRSZWYuY3VycmVudD8uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRJdGVtIHx8IHNlbGVjdG9yLnNlbGVjdG9yVHlwZSA9PT0gXCJzdGF0aWNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rvci5zZXRWYWx1ZShudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Q2xlYXJCdXR0b24gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvQ29tYm9ib3hXcmFwcGVyPlxuICAgICAgICAgICAgPFNpbmdsZVNlbGVjdGlvbk1lbnVcbiAgICAgICAgICAgICAgICBzZWxlY3Rvcj17c2VsZWN0b3J9XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRJdGVtPXtzZWxlY3RlZEl0ZW19XG4gICAgICAgICAgICAgICAgZ2V0TWVudVByb3BzPXtnZXRNZW51UHJvcHN9XG4gICAgICAgICAgICAgICAgZ2V0SXRlbVByb3BzPXtnZXRJdGVtUHJvcHN9XG4gICAgICAgICAgICAgICAgaXNPcGVuPXtpc09wZW4gfHwga2VlcE1lbnVPcGVuID09PSB0cnVlfVxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXg9e2hpZ2hsaWdodGVkSW5kZXh9XG4gICAgICAgICAgICAgICAgbWVudUZvb3RlckNvbnRlbnQ9e21lbnVGb290ZXJDb250ZW50fVxuICAgICAgICAgICAgICAgIG5vT3B0aW9uc1RleHQ9e29wdGlvbnMubm9PcHRpb25zVGV4dH1cbiAgICAgICAgICAgICAgICBhbHdheXNPcGVuPXtrZWVwTWVudU9wZW59XG4gICAgICAgICAgICAgICAgaXNMb2FkaW5nPXtzZWxlY3Rvci5vcHRpb25zLmlzTG9hZGluZ31cbiAgICAgICAgICAgICAgICBsYXp5TG9hZGluZz17bGF6eUxvYWRpbmd9XG4gICAgICAgICAgICAgICAgb25TY3JvbGw9e29uU2Nyb2xsfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xufVxuIiwiaW1wb3J0IHsgRHluYW1pY1ZhbHVlIH0gZnJvbSBcIm1lbmRpeFwiO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtb2NrIER5bmFtaWNWYWx1ZSB3aXRoIHN0YXR1cyBcImF2YWlsYWJsZVwiIGFuZCB0aGUgZ2l2ZW4gdmFsdWUuXG4gKiBVc2VkIGluIGVkaXRvciBwcmV2aWV3IG1vZGUgdG8gcHJvdmlkZSBzdGF0aWMgRHluYW1pY1ZhbHVlIGluc3RhbmNlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGR5bmFtaWM8VD4odmFsdWU6IFQpOiBEeW5hbWljVmFsdWU8VD4ge1xuICAgIHJldHVybiB7IHN0YXR1czogXCJhdmFpbGFibGVcIiwgdmFsdWUgfSBhcyBEeW5hbWljVmFsdWU8VD47XG59XG4iLCJmdW5jdGlvbiBzdHlsZUluamVjdChjc3MsIHJlZikge1xuICBpZiAoIHJlZiA9PT0gdm9pZCAwICkgcmVmID0ge307XG4gIHZhciBpbnNlcnRBdCA9IHJlZi5pbnNlcnRBdDtcblxuICBpZiAoIWNzcyB8fCB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7IHJldHVybjsgfVxuXG4gIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcblxuICBpZiAoaW5zZXJ0QXQgPT09ICd0b3AnKSB7XG4gICAgaWYgKGhlYWQuZmlyc3RDaGlsZCkge1xuICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgfVxuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0eWxlSW5qZWN0O1xuIiwiaW1wb3J0IHsgRHluYW1pY1ZhbHVlLCBMaXN0QXR0cmlidXRlVmFsdWUsIExpc3RFeHByZXNzaW9uVmFsdWUsIExpc3RXaWRnZXRWYWx1ZSwgT2JqZWN0SXRlbSB9IGZyb20gXCJtZW5kaXhcIjtcbmltcG9ydCB7IFJlYWN0Tm9kZSB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgT3B0aW9uc1NvdXJjZUFzc29jaWF0aW9uQ3VzdG9tQ29udGVudFR5cGVFbnVtIH0gZnJvbSBcIi4uLy4uLy4uL3R5cGluZ3MvR3JvdXBlZENvbWJvYm94UHJvcHNcIjtcbmltcG9ydCB7IENhcHRpb25QbGFjZW1lbnQsIENhcHRpb25zUHJvdmlkZXIgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IENhcHRpb25Db250ZW50IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gICAgZW1wdHlPcHRpb25UZXh0PzogRHluYW1pY1ZhbHVlPHN0cmluZz47XG4gICAgZm9ybWF0dGluZ0F0dHJpYnV0ZU9yRXhwcmVzc2lvbjogTGlzdEV4cHJlc3Npb25WYWx1ZTxzdHJpbmc+IHwgTGlzdEF0dHJpYnV0ZVZhbHVlPHN0cmluZz47XG4gICAgY3VzdG9tQ29udGVudD86IExpc3RXaWRnZXRWYWx1ZSB8IHVuZGVmaW5lZDtcbiAgICBjdXN0b21Db250ZW50VHlwZTogT3B0aW9uc1NvdXJjZUFzc29jaWF0aW9uQ3VzdG9tQ29udGVudFR5cGVFbnVtO1xuICAgIC8qKiBPcHRpb25hbCBhdHRyaWJ1dGUgdGhhdCBkZWZpbmVzIHRoZSBncm91cC9zZWN0aW9uIGhlYWRpbmcgZm9yIGVhY2ggaXRlbSAqL1xuICAgIGdyb3VwQXR0cmlidXRlPzogTGlzdEF0dHJpYnV0ZVZhbHVlPHN0cmluZz47XG59XG5cbmV4cG9ydCBjbGFzcyBBc3NvY2lhdGlvblNpbXBsZUNhcHRpb25zUHJvdmlkZXIgaW1wbGVtZW50cyBDYXB0aW9uc1Byb3ZpZGVyIHtcbiAgICBwcml2YXRlIHVuYXZhaWxhYmxlQ2FwdGlvbiA9IFwiPC4uLj5cIjtcbiAgICBmb3JtYXR0ZXI/OiBMaXN0RXhwcmVzc2lvblZhbHVlPHN0cmluZz4gfCBMaXN0QXR0cmlidXRlVmFsdWU8c3RyaW5nPjtcbiAgICBwcm90ZWN0ZWQgY3VzdG9tQ29udGVudD86IExpc3RXaWRnZXRWYWx1ZTtcbiAgICBwcm90ZWN0ZWQgY3VzdG9tQ29udGVudFR5cGU6IE9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkN1c3RvbUNvbnRlbnRUeXBlRW51bSA9IFwibm9cIjtcbiAgICBlbXB0eUNhcHRpb24gPSBcIlwiO1xuICAgIHByaXZhdGUgZ3JvdXBGb3JtYXR0ZXI/OiBMaXN0QXR0cmlidXRlVmFsdWU8c3RyaW5nPjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgb3B0aW9uc01hcDogTWFwPHN0cmluZywgT2JqZWN0SXRlbT4pIHt9XG5cbiAgICB1cGRhdGVQcm9wcyhwcm9wczogUHJvcHMpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFwcm9wcy5lbXB0eU9wdGlvblRleHQgfHwgcHJvcHMuZW1wdHlPcHRpb25UZXh0LnN0YXR1cyA9PT0gXCJ1bmF2YWlsYWJsZVwiKSB7XG4gICAgICAgICAgICB0aGlzLmVtcHR5Q2FwdGlvbiA9IFwiXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVtcHR5Q2FwdGlvbiA9IHByb3BzLmVtcHR5T3B0aW9uVGV4dC52YWx1ZSE7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZvcm1hdHRlciA9IHByb3BzLmZvcm1hdHRpbmdBdHRyaWJ1dGVPckV4cHJlc3Npb247XG4gICAgICAgIHRoaXMuY3VzdG9tQ29udGVudCA9IHByb3BzLmN1c3RvbUNvbnRlbnQ7XG4gICAgICAgIHRoaXMuY3VzdG9tQ29udGVudFR5cGUgPSBwcm9wcy5jdXN0b21Db250ZW50VHlwZTtcbiAgICAgICAgdGhpcy5ncm91cEZvcm1hdHRlciA9IHByb3BzLmdyb3VwQXR0cmlidXRlO1xuICAgIH1cblxuICAgIGdldCh2YWx1ZTogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW1wdHlDYXB0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5mb3JtYXR0ZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFzc29jaWF0aW9uU2ltcGxlQ2FwdGlvblJlbmRlcmVyOiBubyBmb3JtYXR0ZXIgYXZhaWxhYmxlLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5vcHRpb25zTWFwLmdldCh2YWx1ZSk7XG4gICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudW5hdmFpbGFibGVDYXB0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2FwdGlvblZhbHVlID0gdGhpcy5mb3JtYXR0ZXIuZ2V0KGl0ZW0pO1xuICAgICAgICBpZiAoIWNhcHRpb25WYWx1ZSB8fCBjYXB0aW9uVmFsdWUuc3RhdHVzID09PSBcInVuYXZhaWxhYmxlXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVuYXZhaWxhYmxlQ2FwdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYXB0aW9uVmFsdWUudmFsdWUgIT09IHVuZGVmaW5lZCAmJiBjYXB0aW9uVmFsdWUudmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcoY2FwdGlvblZhbHVlLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBncm91cCB0aXRsZSBmb3IgdGhlIGdpdmVuIGl0ZW0gSUQuXG4gICAgICogUmV0dXJucyBudWxsIHdoZW4gbm8gZ3JvdXAgYXR0cmlidXRlIGlzIGNvbmZpZ3VyZWQgb3IgdGhlIHZhbHVlIGlzIHVuYXZhaWxhYmxlLlxuICAgICAqL1xuICAgIGdldEdyb3VwKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgICAgICAgaWYgKCF0aGlzLmdyb3VwRm9ybWF0dGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5vcHRpb25zTWFwLmdldCh2YWx1ZSk7XG4gICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZ3JvdXBWYWx1ZSA9IHRoaXMuZ3JvdXBGb3JtYXR0ZXIuZ2V0KGl0ZW0pO1xuICAgICAgICBpZiAoIWdyb3VwVmFsdWUgfHwgZ3JvdXBWYWx1ZS5zdGF0dXMgIT09IFwiYXZhaWxhYmxlXCIgfHwgIWdyb3VwVmFsdWUuZGlzcGxheVZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ3JvdXBWYWx1ZS5kaXNwbGF5VmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0Q3VzdG9tQ29udGVudCh2YWx1ZTogc3RyaW5nIHwgbnVsbCk6IFJlYWN0Tm9kZSB8IG51bGwge1xuICAgICAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLm9wdGlvbnNNYXAuZ2V0KHZhbHVlKTtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmN1c3RvbUNvbnRlbnQ/LmdldChpdGVtKSBhcyBSZWFjdE5vZGU7XG4gICAgfVxuXG4gICAgcmVuZGVyKHZhbHVlOiBzdHJpbmcgfCBudWxsLCBwbGFjZW1lbnQ6IENhcHRpb25QbGFjZW1lbnQsIGh0bWxGb3I/OiBzdHJpbmcpOiBSZWFjdE5vZGUge1xuICAgICAgICBjb25zdCB7IGN1c3RvbUNvbnRlbnRUeXBlIH0gPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiBjdXN0b21Db250ZW50VHlwZSA9PT0gXCJub1wiIHx8XG4gICAgICAgICAgICAocGxhY2VtZW50ID09PSBcImxhYmVsXCIgJiYgY3VzdG9tQ29udGVudFR5cGUgPT09IFwibGlzdEl0ZW1cIikgfHxcbiAgICAgICAgICAgIHZhbHVlID09PSBudWxsID8gKFxuICAgICAgICAgICAgPENhcHRpb25Db250ZW50IGh0bWxGb3I9e2h0bWxGb3J9Pnt0aGlzLmdldCh2YWx1ZSl9PC9DYXB0aW9uQ29udGVudD5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94LWNhcHRpb24tY3VzdG9tXCI+e3RoaXMuZ2V0Q3VzdG9tQ29udGVudCh2YWx1ZSl9PC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ2FwdGlvblBsYWNlbWVudCB9IGZyb20gXCJzcmMvaGVscGVycy90eXBlc1wiO1xuaW1wb3J0IHsgQ2FwdGlvbkNvbnRlbnQgfSBmcm9tIFwic3JjL2hlbHBlcnMvdXRpbHNcIjtcbmltcG9ydCB7IE9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkN1c3RvbUNvbnRlbnRUeXBlRW51bSB9IGZyb20gXCJ0eXBpbmdzL0dyb3VwZWRDb21ib2JveFByb3BzXCI7XG5pbXBvcnQgeyBBc3NvY2lhdGlvblNpbXBsZUNhcHRpb25zUHJvdmlkZXIgfSBmcm9tIFwiLi4vQXNzb2NpYXRpb25TaW1wbGVDYXB0aW9uc1Byb3ZpZGVyXCI7XG5pbXBvcnQgeyBDb21wb25lbnRUeXBlLCBSZWFjdE5vZGUgfSBmcm9tIFwicmVhY3RcIjtcbmludGVyZmFjZSBQcmV2aWV3UHJvcHMge1xuICAgIGN1c3RvbUNvbnRlbnRSZW5kZXJlcjpcbiAgICAgICAgfCBDb21wb25lbnRUeXBlPHsgY2hpbGRyZW46IFJlYWN0Tm9kZTsgY2FwdGlvbj86IHN0cmluZyB9PlxuICAgICAgICB8IEFycmF5PENvbXBvbmVudFR5cGU8eyBjaGlsZHJlbjogUmVhY3ROb2RlOyBjYXB0aW9uPzogc3RyaW5nIH0+PjtcbiAgICBjdXN0b21Db250ZW50VHlwZTogT3B0aW9uc1NvdXJjZUFzc29jaWF0aW9uQ3VzdG9tQ29udGVudFR5cGVFbnVtO1xufVxuXG5leHBvcnQgY2xhc3MgQXNzb2NpYXRpb25QcmV2aWV3Q2FwdGlvbnNQcm92aWRlciBleHRlbmRzIEFzc29jaWF0aW9uU2ltcGxlQ2FwdGlvbnNQcm92aWRlciB7XG4gICAgZW1wdHlDYXB0aW9uID0gXCJDb21ibyBib3hcIjtcbiAgICBwcml2YXRlIGN1c3RvbUNvbnRlbnRSZW5kZXJlcjogQ29tcG9uZW50VHlwZTx7IGNoaWxkcmVuOiBSZWFjdE5vZGU7IGNhcHRpb24/OiBzdHJpbmcgfT4gPSAoKSA9PiA8ZGl2PjwvZGl2PjtcbiAgICBnZXQodmFsdWU6IHN0cmluZyB8IG51bGwpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdmFsdWUgfHwgdGhpcy5lbXB0eUNhcHRpb247XG4gICAgfVxuXG4gICAgZ2V0Q3VzdG9tQ29udGVudCh2YWx1ZTogc3RyaW5nIHwgbnVsbCk6IFJlYWN0Tm9kZSB8IG51bGwge1xuICAgICAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmN1c3RvbUNvbnRlbnRUeXBlICE9PSBcIm5vXCIpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPHRoaXMuY3VzdG9tQ29udGVudFJlbmRlcmVyIGNhcHRpb249e1wiQ1VTVE9NIENPTlRFTlRcIn0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgLz5cbiAgICAgICAgICAgICAgICA8L3RoaXMuY3VzdG9tQ29udGVudFJlbmRlcmVyPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZVByZXZpZXdQcm9wcyhwcm9wczogUHJldmlld1Byb3BzKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3VzdG9tQ29udGVudFJlbmRlcmVyID0gcHJvcHMuY3VzdG9tQ29udGVudFJlbmRlcmVyIGFzIENvbXBvbmVudFR5cGU8e1xuICAgICAgICAgICAgY2hpbGRyZW46IFJlYWN0Tm9kZTtcbiAgICAgICAgICAgIGNhcHRpb24/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgICAgIH0+O1xuICAgICAgICB0aGlzLmN1c3RvbUNvbnRlbnRUeXBlID0gcHJvcHMuY3VzdG9tQ29udGVudFR5cGU7XG4gICAgfVxuXG4gICAgcmVuZGVyKHZhbHVlOiBzdHJpbmcgfCBudWxsLCBwbGFjZW1lbnQ6IENhcHRpb25QbGFjZW1lbnQsIGh0bWxGb3I/OiBzdHJpbmcpOiBSZWFjdE5vZGUge1xuICAgICAgICAvLyBhbHdheXMgcmVuZGVyIGN1c3RvbSBjb250ZW50IGRyb3B6b25lIGluIGRlc2lnbiBtb2RlIGlmIHR5cGUgaXMgb3B0aW9ucyBvbmx5XG4gICAgICAgIGlmIChwbGFjZW1lbnQgPT09IFwib3B0aW9uc1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gPENhcHRpb25Db250ZW50IGh0bWxGb3I9e2h0bWxGb3J9Pnt0aGlzLmdldCh2YWx1ZSl9PC9DYXB0aW9uQ29udGVudD47XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3VwZXIucmVuZGVyKHZhbHVlLCBwbGFjZW1lbnQgPT09IFwibGFiZWxcIiA/IFwib3B0aW9uc1wiIDogcGxhY2VtZW50KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBPYmplY3RJdGVtIH0gZnJvbSBcIm1lbmRpeFwiO1xuaW1wb3J0IHsgQmFzZVByb3BzIH0gZnJvbSBcIi4uLy4uLy4uL2hlbHBlcnMvQmFzZURhdGFzb3VyY2VPcHRpb25zUHJvdmlkZXJcIjtcbmltcG9ydCB7IENhcHRpb25zUHJvdmlkZXIsIE9wdGlvbnNQcm92aWRlciwgU3RhdHVzIH0gZnJvbSBcIi4uLy4uL3R5cGVzXCI7XG5pbXBvcnQgeyBGaWx0ZXJUeXBlRW51bSB9IGZyb20gXCIuLi8uLi8uLi8uLi90eXBpbmdzL0dyb3VwZWRDb21ib2JveFByb3BzXCI7XG5cbmV4cG9ydCBjbGFzcyBBc3NvY2lhdGlvblByZXZpZXdPcHRpb25zUHJvdmlkZXIgaW1wbGVtZW50cyBPcHRpb25zUHJvdmlkZXI8T2JqZWN0SXRlbSwgQmFzZVByb3BzPiB7XG4gICAgZmlsdGVyVHlwZTogRmlsdGVyVHlwZUVudW0gPSBcImNvbnRhaW5zXCI7XG4gICAgaGFzTW9yZT86IGJvb2xlYW4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgc2VhcmNoVGVybTogc3RyaW5nID0gXCJcIjtcbiAgICBzdGF0dXM6IFN0YXR1cyA9IFwiYXZhaWxhYmxlXCI7XG4gICAgaXNMb2FkaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGNhcHRpb246IENhcHRpb25zUHJvdmlkZXIsXG4gICAgICAgIHByb3RlY3RlZCB2YWx1ZXNNYXA6IE1hcDxzdHJpbmcsIE9iamVjdEl0ZW0+XG4gICAgKSB7fVxuICAgIG9uQWZ0ZXJTZWFyY2hUZXJtQ2hhbmdlKF9jYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQge31cbiAgICBzZXRTZWFyY2hUZXJtKF92YWx1ZTogc3RyaW5nKTogdm9pZCB7fVxuICAgIGxvYWRNb3JlPygpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxuICAgIF91cGRhdGVQcm9wcyhfOiBCYXNlUHJvcHMpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxuICAgIF9vcHRpb25Ub1ZhbHVlKF92YWx1ZTogc3RyaW5nIHwgbnVsbCk6IE9iamVjdEl0ZW0gfCB1bmRlZmluZWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgICB9XG4gICAgX3ZhbHVlVG9PcHRpb24oX3ZhbHVlOiBPYmplY3RJdGVtIHwgdW5kZWZpbmVkKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cbiAgICBnZXRBbGwoKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gW1wiLi4uXCJdO1xuICAgIH1cbn1cbiIsImltcG9ydCB7XG4gICAgR3JvdXBlZENvbWJvYm94Q29udGFpbmVyUHJvcHMsXG4gICAgR3JvdXBlZENvbWJvYm94UHJldmlld1Byb3BzLFxuICAgIExvYWRpbmdUeXBlRW51bSxcbiAgICBPcHRpb25zU291cmNlQXNzb2NpYXRpb25DdXN0b21Db250ZW50VHlwZUVudW1cbn0gZnJvbSBcIi4uLy4uLy4uLy4uL3R5cGluZ3MvR3JvdXBlZENvbWJvYm94UHJvcHNcIjtcbmltcG9ydCB7IENhcHRpb25zUHJvdmlkZXIsIE9wdGlvbnNQcm92aWRlciwgU2luZ2xlU2VsZWN0b3IsIFN0YXR1cyB9IGZyb20gXCIuLi8uLi8uLi9oZWxwZXJzL3R5cGVzXCI7XG5pbXBvcnQgeyBnZXREYXRhc291cmNlUGxhY2Vob2xkZXJUZXh0IH0gZnJvbSBcIi4uLy4uLy4uL2hlbHBlcnMvdXRpbHNcIjtcbmltcG9ydCB7IEFzc29jaWF0aW9uUHJldmlld0NhcHRpb25zUHJvdmlkZXIgfSBmcm9tIFwiLi9Bc3NvY2lhdGlvblByZXZpZXdDYXB0aW9uc1Byb3ZpZGVyXCI7XG5pbXBvcnQgeyBBc3NvY2lhdGlvblByZXZpZXdPcHRpb25zUHJvdmlkZXIgfSBmcm9tIFwiLi9Bc3NvY2lhdGlvblByZXZpZXdPcHRpb25zUHJvdmlkZXJcIjtcblxuZXhwb3J0IGNsYXNzIEFzc29jaWF0aW9uUHJldmlld1NlbGVjdG9yIGltcGxlbWVudHMgU2luZ2xlU2VsZWN0b3Ige1xuICAgIGF0dHJpYnV0ZVR5cGU/OiBcInN0cmluZ1wiIHwgXCJiaWdcIiB8IFwiYm9vbGVhblwiIHwgXCJkYXRlXCI7XG4gICAgY2FwdGlvbjogQ2FwdGlvbnNQcm92aWRlcjtcbiAgICBjbGVhcmFibGU6IGJvb2xlYW47XG4gICAgY3VycmVudElkOiBzdHJpbmcgfCBudWxsO1xuICAgIGN1c3RvbUNvbnRlbnRUeXBlOiBPcHRpb25zU291cmNlQXNzb2NpYXRpb25DdXN0b21Db250ZW50VHlwZUVudW07XG4gICAgbGF6eUxvYWRpbmc/OiBib29sZWFuID0gZmFsc2U7XG4gICAgbG9hZGluZ1R5cGU/OiBMb2FkaW5nVHlwZUVudW0gPSBcInNrZWxldG9uXCI7XG4gICAgb3B0aW9uczogT3B0aW9uc1Byb3ZpZGVyO1xuICAgIHJlYWRPbmx5OiBib29sZWFuO1xuICAgIHNlbGVjdG9yVHlwZT86IFwiY29udGV4dFwiIHwgXCJkYXRhYmFzZVwiIHwgXCJzdGF0aWNcIjtcbiAgICBzdGF0dXM6IFN0YXR1cyA9IFwiYXZhaWxhYmxlXCI7XG4gICAgdHlwZSA9IFwic2luZ2xlXCIgYXMgY29uc3Q7XG4gICAgdmFsaWRhdGlvbj86IHN0cmluZztcblxuICAgIG9uRW50ZXJFdmVudD86ICgpID0+IHZvaWQ7XG4gICAgb25MZWF2ZUV2ZW50PzogKCkgPT4gdm9pZDtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBHcm91cGVkQ29tYm9ib3hQcmV2aWV3UHJvcHMpIHtcbiAgICAgICAgdGhpcy5jYXB0aW9uID0gbmV3IEFzc29jaWF0aW9uUHJldmlld0NhcHRpb25zUHJvdmlkZXIobmV3IE1hcCgpKTtcbiAgICAgICAgdGhpcy5jbGVhcmFibGUgPSBwcm9wcy5jbGVhcmFibGU7XG4gICAgICAgIHRoaXMuY3VycmVudElkID0gZ2V0RGF0YXNvdXJjZVBsYWNlaG9sZGVyVGV4dChwcm9wcyk7XG4gICAgICAgIHRoaXMuY3VzdG9tQ29udGVudFR5cGUgPSBwcm9wcy5vcHRpb25zU291cmNlQXNzb2NpYXRpb25DdXN0b21Db250ZW50VHlwZTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gbmV3IEFzc29jaWF0aW9uUHJldmlld09wdGlvbnNQcm92aWRlcih0aGlzLmNhcHRpb24sIG5ldyBNYXAoKSk7XG4gICAgICAgIHRoaXMucmVhZE9ubHkgPSBwcm9wcy5yZWFkT25seTtcbiAgICAgICAgKHRoaXMuY2FwdGlvbiBhcyBBc3NvY2lhdGlvblByZXZpZXdDYXB0aW9uc1Byb3ZpZGVyKS51cGRhdGVQcmV2aWV3UHJvcHMoe1xuICAgICAgICAgICAgY3VzdG9tQ29udGVudFJlbmRlcmVyOiBwcm9wcy5vcHRpb25zU291cmNlQXNzb2NpYXRpb25DdXN0b21Db250ZW50LnJlbmRlcmVyLFxuICAgICAgICAgICAgY3VzdG9tQ29udGVudFR5cGU6IHByb3BzLm9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkN1c3RvbUNvbnRlbnRUeXBlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChwcm9wcy5vcHRpb25zU291cmNlQXNzb2NpYXRpb25DdXN0b21Db250ZW50VHlwZSA9PT0gXCJsaXN0SXRlbVwiKSB7XG4gICAgICAgICAgICAvLyBhbHdheXMgcmVuZGVyIGN1c3RvbSBjb250ZW50IGRyb3B6b25lIGluIGRlc2lnbiBtb2RlIGlmIHR5cGUgaXMgb3B0aW9ucyBvbmx5XG4gICAgICAgICAgICB0aGlzLmN1c3RvbUNvbnRlbnRUeXBlID0gXCJ5ZXNcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFZhbHVlKF86IHN0cmluZyB8IG51bGwpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxuICAgIHVwZGF0ZVByb3BzKF86IEdyb3VwZWRDb21ib2JveENvbnRhaW5lclByb3BzKTogdm9pZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE9wdGlvbnNTb3VyY2VTdGF0aWNEYXRhU291cmNlUHJldmlld1R5cGUsIFN0YXRpY0RhdGFTb3VyY2VDdXN0b21Db250ZW50VHlwZUVudW0gfSBmcm9tIFwidHlwaW5ncy9Hcm91cGVkQ29tYm9ib3hQcm9wc1wiO1xuaW1wb3J0IHsgQ2FwdGlvblBsYWNlbWVudCwgQ2FwdGlvbnNQcm92aWRlciB9IGZyb20gXCIuLi8uLi90eXBlc1wiO1xuaW1wb3J0IHsgQ2FwdGlvbkNvbnRlbnQgfSBmcm9tIFwiLi4vLi4vdXRpbHNcIjtcbmltcG9ydCB7IFJlYWN0Tm9kZSB9IGZyb20gXCJyZWFjdFwiO1xuXG5leHBvcnQgY2xhc3MgU3RhdGljUHJldmlld0NhcHRpb25zUHJvdmlkZXIgaW1wbGVtZW50cyBDYXB0aW9uc1Byb3ZpZGVyIHtcbiAgICBlbXB0eUNhcHRpb24gPSBcIkNvbWJvIGJveFwiO1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIG9wdGlvbnNNYXA6IE1hcDxzdHJpbmcsIE9wdGlvbnNTb3VyY2VTdGF0aWNEYXRhU291cmNlUHJldmlld1R5cGU+LFxuICAgICAgICBwcml2YXRlIGN1c3RvbUNvbnRlbnRUeXBlOiBTdGF0aWNEYXRhU291cmNlQ3VzdG9tQ29udGVudFR5cGVFbnVtLFxuICAgICAgICBwcml2YXRlIGRhdGFTb3VyY2VQbGFjZWhvbGRlcjogc3RyaW5nXG4gICAgKSB7fVxuXG4gICAgZ2V0KHZhbHVlOiBzdHJpbmcgfCBudWxsKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbXB0eUNhcHRpb247XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uc01hcC5nZXQodmFsdWUpPy5zdGF0aWNEYXRhU291cmNlQ2FwdGlvbiB8fCB0aGlzLmVtcHR5Q2FwdGlvbjtcbiAgICB9XG5cbiAgICByZW5kZXIodmFsdWU6IHN0cmluZyB8IG51bGwsIHBsYWNlbWVudDogQ2FwdGlvblBsYWNlbWVudCwgaHRtbEZvcj86IHN0cmluZyk6IFJlYWN0Tm9kZSB7XG4gICAgICAgIC8vIGFsd2F5cyByZW5kZXIgY3VzdG9tIGNvbnRlbnQgZHJvcHpvbmUgaW4gZGVzaWduIG1vZGUgaWYgdHlwZSBpcyBvcHRpb25zIG9ubHlcbiAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gPGRpdj57dGhpcy5kYXRhU291cmNlUGxhY2Vob2xkZXJ9PC9kaXY+O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLm9wdGlvbnNNYXAuZ2V0KHZhbHVlKSEuc3RhdGljRGF0YVNvdXJjZUN1c3RvbUNvbnRlbnQhO1xuICAgICAgICBjb25zdCBJdGVtUmVuZGVyZXIgPSBpdGVtLnJlbmRlcmVyO1xuICAgICAgICByZXR1cm4gdGhpcy5jdXN0b21Db250ZW50VHlwZSA9PT0gXCJub1wiIHx8XG4gICAgICAgICAgICAocGxhY2VtZW50ID09PSBcImxhYmVsXCIgJiYgdGhpcy5jdXN0b21Db250ZW50VHlwZSA9PT0gXCJsaXN0SXRlbVwiKSB8fFxuICAgICAgICAgICAgdmFsdWUgPT09IG51bGwgPyAoXG4gICAgICAgICAgICA8Q2FwdGlvbkNvbnRlbnQgaHRtbEZvcj17aHRtbEZvcn0+e3RoaXMuZ2V0KHZhbHVlKX08L0NhcHRpb25Db250ZW50PlxuICAgICAgICApIDogKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3aWRnZXQtY29tYm9ib3gtY2FwdGlvbi1jdXN0b21cIj5cbiAgICAgICAgICAgICAgICA8SXRlbVJlbmRlcmVyIGNhcHRpb249e2BDdXN0b20gY29udGVudCBmb3IgJHt0aGlzLmdldCh2YWx1ZSl9YH0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9JdGVtUmVuZGVyZXI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBPcHRpb25zUHJvdmlkZXIsIFN0YXR1cyB9IGZyb20gXCIuLi8uLi90eXBlc1wiO1xuaW1wb3J0IHsgRmlsdGVyVHlwZUVudW0sIE9wdGlvbnNTb3VyY2VTdGF0aWNEYXRhU291cmNlUHJldmlld1R5cGUgfSBmcm9tIFwiLi4vLi4vLi4vLi4vdHlwaW5ncy9Hcm91cGVkQ29tYm9ib3hQcm9wc1wiO1xuXG5leHBvcnQgY2xhc3MgU3RhdGljUHJldmlld09wdGlvbnNQcm92aWRlciBpbXBsZW1lbnRzIE9wdGlvbnNQcm92aWRlcjxzdHJpbmcsIE9wdGlvbnNTb3VyY2VTdGF0aWNEYXRhU291cmNlUHJldmlld1R5cGU+IHtcbiAgICBzdGF0dXM6IFN0YXR1cyA9IFwiYXZhaWxhYmxlXCI7XG4gICAgZmlsdGVyVHlwZTogRmlsdGVyVHlwZUVudW0gPSBcImNvbnRhaW5zXCI7XG4gICAgc2VhcmNoVGVybTogc3RyaW5nID0gXCJcIjtcbiAgICBoYXNNb3JlPzogYm9vbGVhbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBpc0xvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG9wdGlvbnNNYXA6IE1hcDxzdHJpbmcsIE9wdGlvbnNTb3VyY2VTdGF0aWNEYXRhU291cmNlUHJldmlld1R5cGU+KSB7fVxuICAgIHNldFNlYXJjaFRlcm0oX3ZhbHVlOiBzdHJpbmcpOiB2b2lkIHt9XG4gICAgb25BZnRlclNlYXJjaFRlcm1DaGFuZ2UoX2NhbGxiYWNrOiAoKSA9PiB2b2lkKTogdm9pZCB7fVxuICAgIGxvYWRNb3JlPygpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxuICAgIF91cGRhdGVQcm9wcyhfOiBPcHRpb25zU291cmNlU3RhdGljRGF0YVNvdXJjZVByZXZpZXdUeXBlKTogdm9pZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cbiAgICBfb3B0aW9uVG9WYWx1ZShfdmFsdWU6IHN0cmluZyB8IG51bGwpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgICB9XG4gICAgX3ZhbHVlVG9PcHRpb24oX3ZhbHVlOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcgfCBudWxsIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxuICAgIGdldEFsbCgpOiBzdHJpbmdbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnNNYXAuc2l6ZSA/IEFycmF5LmZyb20odGhpcy5vcHRpb25zTWFwLmtleXMoKSkgOiBbXCIuLi5cIl07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ2FwdGlvbnNQcm92aWRlciwgU2luZ2xlU2VsZWN0b3IsIFN0YXR1cyB9IGZyb20gXCJzcmMvaGVscGVycy90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0RGF0YXNvdXJjZVBsYWNlaG9sZGVyVGV4dCB9IGZyb20gXCJzcmMvaGVscGVycy91dGlsc1wiO1xuaW1wb3J0IHtcbiAgICBHcm91cGVkQ29tYm9ib3hDb250YWluZXJQcm9wcyxcbiAgICBHcm91cGVkQ29tYm9ib3hQcmV2aWV3UHJvcHMsXG4gICAgT3B0aW9uc1NvdXJjZVN0YXRpY0RhdGFTb3VyY2VQcmV2aWV3VHlwZSxcbiAgICBTdGF0aWNEYXRhU291cmNlQ3VzdG9tQ29udGVudFR5cGVFbnVtXG59IGZyb20gXCJ0eXBpbmdzL0dyb3VwZWRDb21ib2JveFByb3BzXCI7XG5pbXBvcnQgeyBTdGF0aWNQcmV2aWV3Q2FwdGlvbnNQcm92aWRlciB9IGZyb20gXCIuL1N0YXRpY1ByZXZpZXdDYXB0aW9uc1Byb3ZpZGVyXCI7XG5pbXBvcnQgeyBTdGF0aWNQcmV2aWV3T3B0aW9uc1Byb3ZpZGVyIH0gZnJvbSBcIi4vU3RhdGljUHJldmlld09wdGlvbnNQcm92aWRlclwiO1xuXG5leHBvcnQgY2xhc3MgU3RhdGljUHJldmlld1NlbGVjdG9yIGltcGxlbWVudHMgU2luZ2xlU2VsZWN0b3Ige1xuICAgIHR5cGUgPSBcInNpbmdsZVwiIGFzIGNvbnN0O1xuICAgIHN0YXR1czogU3RhdHVzID0gXCJhdmFpbGFibGVcIjtcbiAgICByZWFkT25seTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHZhbGlkYXRpb24/OiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgb3B0aW9uczogU3RhdGljUHJldmlld09wdGlvbnNQcm92aWRlcjtcbiAgICBjYXB0aW9uOiBDYXB0aW9uc1Byb3ZpZGVyO1xuICAgIGNsZWFyYWJsZTogYm9vbGVhbjtcbiAgICBjdXJyZW50SWQ6IHN0cmluZyB8IG51bGw7XG4gICAgY3VzdG9tQ29udGVudFR5cGU6IFN0YXRpY0RhdGFTb3VyY2VDdXN0b21Db250ZW50VHlwZUVudW0gPSBcImxpc3RJdGVtXCI7XG4gICAgb25FbnRlckV2ZW50PzogKCkgPT4gdm9pZDtcbiAgICBvbkxlYXZlRXZlbnQ/OiAoKSA9PiB2b2lkO1xuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBHcm91cGVkQ29tYm9ib3hQcmV2aWV3UHJvcHMpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBPcHRpb25zU291cmNlU3RhdGljRGF0YVNvdXJjZVByZXZpZXdUeXBlPigpO1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBuZXcgU3RhdGljUHJldmlld0NhcHRpb25zUHJvdmlkZXIoXG4gICAgICAgICAgICBvcHRpb25zTWFwLFxuICAgICAgICAgICAgcHJvcHMuc3RhdGljRGF0YVNvdXJjZUN1c3RvbUNvbnRlbnRUeXBlLFxuICAgICAgICAgICAgZ2V0RGF0YXNvdXJjZVBsYWNlaG9sZGVyVGV4dChwcm9wcylcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gbmV3IFN0YXRpY1ByZXZpZXdPcHRpb25zUHJvdmlkZXIob3B0aW9uc01hcCk7XG4gICAgICAgIHRoaXMucmVhZE9ubHkgPSBwcm9wcy5yZWFkT25seTtcbiAgICAgICAgdGhpcy5jbGVhcmFibGUgPSBwcm9wcy5jbGVhcmFibGU7XG4gICAgICAgIHRoaXMuY3VycmVudElkID0gbnVsbDtcbiAgICAgICAgdGhpcy5jdXN0b21Db250ZW50VHlwZSA9IHByb3BzLm9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkN1c3RvbUNvbnRlbnRUeXBlO1xuICAgICAgICBpZiAocHJvcHMub3B0aW9uc1NvdXJjZUFzc29jaWF0aW9uQ3VzdG9tQ29udGVudFR5cGUgPT09IFwibGlzdEl0ZW1cIikge1xuICAgICAgICAgICAgLy8gYWx3YXlzIHJlbmRlciBjdXN0b20gY29udGVudCBkcm9wem9uZSBpbiBkZXNpZ24gbW9kZSBpZiB0eXBlIGlzIG9wdGlvbnMgb25seVxuICAgICAgICAgICAgdGhpcy5jdXN0b21Db250ZW50VHlwZSA9IFwieWVzXCI7XG4gICAgICAgIH1cbiAgICAgICAgcHJvcHMub3B0aW9uc1NvdXJjZVN0YXRpY0RhdGFTb3VyY2UuZm9yRWFjaCgob3B0aW9uLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgb3B0aW9uc01hcC5zZXQoaW5kZXgudG9TdHJpbmcoKSwgb3B0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNldFZhbHVlKF86IHN0cmluZyB8IG51bGwpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxuICAgIHVwZGF0ZVByb3BzKF86IEdyb3VwZWRDb21ib2JveENvbnRhaW5lclByb3BzKTogdm9pZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7XG4gICAgR3JvdXBlZENvbWJvYm94Q29udGFpbmVyUHJvcHMsXG4gICAgR3JvdXBlZENvbWJvYm94UHJldmlld1Byb3BzLFxuICAgIExvYWRpbmdUeXBlRW51bSxcbiAgICBPcHRpb25zU291cmNlQXNzb2NpYXRpb25DdXN0b21Db250ZW50VHlwZUVudW1cbn0gZnJvbSBcIi4uLy4uLy4uLy4uL3R5cGluZ3MvR3JvdXBlZENvbWJvYm94UHJvcHNcIjtcbmltcG9ydCB7IENhcHRpb25zUHJvdmlkZXIsIE9wdGlvbnNQcm92aWRlciwgU2luZ2xlU2VsZWN0b3IsIFN0YXR1cyB9IGZyb20gXCIuLi8uLi8uLi9oZWxwZXJzL3R5cGVzXCI7XG5pbXBvcnQgeyBnZXREYXRhc291cmNlUGxhY2Vob2xkZXJUZXh0IH0gZnJvbSBcIi4uLy4uLy4uL2hlbHBlcnMvdXRpbHNcIjtcbmltcG9ydCB7IEFzc29jaWF0aW9uUHJldmlld0NhcHRpb25zUHJvdmlkZXIgfSBmcm9tIFwiLi4vLi4vQXNzb2NpYXRpb24vUHJldmlldy9Bc3NvY2lhdGlvblByZXZpZXdDYXB0aW9uc1Byb3ZpZGVyXCI7XG5pbXBvcnQgeyBBc3NvY2lhdGlvblByZXZpZXdPcHRpb25zUHJvdmlkZXIgfSBmcm9tIFwiLi4vLi4vQXNzb2NpYXRpb24vUHJldmlldy9Bc3NvY2lhdGlvblByZXZpZXdPcHRpb25zUHJvdmlkZXJcIjtcblxuZXhwb3J0IGNsYXNzIERhdGFiYXNlUHJldmlld1NlbGVjdG9yIGltcGxlbWVudHMgU2luZ2xlU2VsZWN0b3Ige1xuICAgIGF0dHJpYnV0ZVR5cGU/OiBcInN0cmluZ1wiIHwgXCJiaWdcIiB8IFwiYm9vbGVhblwiIHwgXCJkYXRlXCI7XG4gICAgY2FwdGlvbjogQ2FwdGlvbnNQcm92aWRlcjtcbiAgICBjbGVhcmFibGU6IGJvb2xlYW47XG4gICAgY3VycmVudElkOiBzdHJpbmcgfCBudWxsO1xuICAgIGN1c3RvbUNvbnRlbnRUeXBlOiBPcHRpb25zU291cmNlQXNzb2NpYXRpb25DdXN0b21Db250ZW50VHlwZUVudW07XG4gICAgbGF6eUxvYWRpbmc/OiBib29sZWFuID0gZmFsc2U7XG4gICAgbG9hZGluZ1R5cGU/OiBMb2FkaW5nVHlwZUVudW0gPSBcInNrZWxldG9uXCI7XG4gICAgb3B0aW9uczogT3B0aW9uc1Byb3ZpZGVyO1xuICAgIHJlYWRPbmx5OiBib29sZWFuO1xuICAgIHNlbGVjdG9yVHlwZT86IFwiY29udGV4dFwiIHwgXCJkYXRhYmFzZVwiIHwgXCJzdGF0aWNcIjtcbiAgICBzdGF0dXM6IFN0YXR1cyA9IFwiYXZhaWxhYmxlXCI7XG4gICAgdHlwZSA9IFwic2luZ2xlXCIgYXMgY29uc3Q7XG4gICAgdmFsaWRhdGlvbj86IHN0cmluZztcblxuICAgIG9uRW50ZXJFdmVudD86ICgpID0+IHZvaWQ7XG4gICAgb25MZWF2ZUV2ZW50PzogKCkgPT4gdm9pZDtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBHcm91cGVkQ29tYm9ib3hQcmV2aWV3UHJvcHMpIHtcbiAgICAgICAgdGhpcy5jYXB0aW9uID0gbmV3IEFzc29jaWF0aW9uUHJldmlld0NhcHRpb25zUHJvdmlkZXIobmV3IE1hcCgpKTtcbiAgICAgICAgdGhpcy5jbGVhcmFibGUgPSBwcm9wcy5jbGVhcmFibGU7XG4gICAgICAgIHRoaXMuY3VycmVudElkID0gZ2V0RGF0YXNvdXJjZVBsYWNlaG9sZGVyVGV4dChwcm9wcyk7XG4gICAgICAgIHRoaXMuY3VzdG9tQ29udGVudFR5cGUgPSBwcm9wcy5vcHRpb25zU291cmNlRGF0YWJhc2VDdXN0b21Db250ZW50VHlwZTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gbmV3IEFzc29jaWF0aW9uUHJldmlld09wdGlvbnNQcm92aWRlcih0aGlzLmNhcHRpb24sIG5ldyBNYXAoKSk7XG4gICAgICAgIHRoaXMucmVhZE9ubHkgPSBwcm9wcy5yZWFkT25seTtcbiAgICAgICAgKHRoaXMuY2FwdGlvbiBhcyBBc3NvY2lhdGlvblByZXZpZXdDYXB0aW9uc1Byb3ZpZGVyKS51cGRhdGVQcmV2aWV3UHJvcHMoe1xuICAgICAgICAgICAgY3VzdG9tQ29udGVudFJlbmRlcmVyOiBwcm9wcy5vcHRpb25zU291cmNlRGF0YWJhc2VDdXN0b21Db250ZW50LnJlbmRlcmVyLFxuICAgICAgICAgICAgY3VzdG9tQ29udGVudFR5cGU6IHByb3BzLm9wdGlvbnNTb3VyY2VEYXRhYmFzZUN1c3RvbUNvbnRlbnRUeXBlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChwcm9wcy5vcHRpb25zU291cmNlRGF0YWJhc2VDdXN0b21Db250ZW50VHlwZSA9PT0gXCJsaXN0SXRlbVwiKSB7XG4gICAgICAgICAgICAvLyBhbHdheXMgcmVuZGVyIGN1c3RvbSBjb250ZW50IGRyb3B6b25lIGluIGRlc2lnbiBtb2RlIGlmIHR5cGUgaXMgb3B0aW9ucyBvbmx5XG4gICAgICAgICAgICB0aGlzLmN1c3RvbUNvbnRlbnRUeXBlID0gXCJ5ZXNcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFZhbHVlKF86IHN0cmluZyB8IG51bGwpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxuICAgIHVwZGF0ZVByb3BzKF86IEdyb3VwZWRDb21ib2JveENvbnRhaW5lclByb3BzKTogdm9pZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGdlbmVyYXRlVVVJRCB9IGZyb20gXCJAbWVuZGl4L3dpZGdldC1wbHVnaW4tcGxhdGZvcm0vZnJhbWV3b3JrL2dlbmVyYXRlLXV1aWRcIjtcbmltcG9ydCB7IFJlYWN0RWxlbWVudCwgdXNlTWVtbyB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgR3JvdXBlZENvbWJvYm94UHJldmlld1Byb3BzIH0gZnJvbSBcIi4uL3R5cGluZ3MvR3JvdXBlZENvbWJvYm94UHJvcHNcIjtcbmltcG9ydCB7IFNpbmdsZVNlbGVjdGlvbiB9IGZyb20gXCIuL2NvbXBvbmVudHMvU2luZ2xlU2VsZWN0aW9uL1NpbmdsZVNlbGVjdGlvblwiO1xuaW1wb3J0IHsgZHluYW1pYyB9IGZyb20gXCJAbWVuZGl4L3dpZGdldC1wbHVnaW4tdGVzdC11dGlsc1wiO1xuaW1wb3J0IHsgU2VsZWN0aW9uQmFzZVByb3BzLCBTaW5nbGVTZWxlY3RvciB9IGZyb20gXCIuL2hlbHBlcnMvdHlwZXNcIjtcbmltcG9ydCBcIi4vdWkvR3JvdXBlZENvbWJvYm94LnNjc3NcIjtcbmltcG9ydCB7IEFzc29jaWF0aW9uUHJldmlld1NlbGVjdG9yIH0gZnJvbSBcIi4vaGVscGVycy9Bc3NvY2lhdGlvbi9QcmV2aWV3L0Fzc29jaWF0aW9uUHJldmlld1NlbGVjdG9yXCI7XG5pbXBvcnQgeyBTdGF0aWNQcmV2aWV3U2VsZWN0b3IgfSBmcm9tIFwiLi9oZWxwZXJzL1N0YXRpYy9QcmV2aWV3L1N0YXRpY1ByZXZpZXdTZWxlY3RvclwiO1xuaW1wb3J0IHsgRGF0YWJhc2VQcmV2aWV3U2VsZWN0b3IgfSBmcm9tIFwiLi9oZWxwZXJzL0RhdGFiYXNlL1ByZXZpZXcvRGF0YWJhc2VQcmV2aWV3U2VsZWN0b3JcIjtcblxuZXhwb3J0IGNvbnN0IHByZXZpZXcgPSAocHJvcHM6IEdyb3VwZWRDb21ib2JveFByZXZpZXdQcm9wcyk6IFJlYWN0RWxlbWVudCA9PiB7XG4gICAgY29uc3QgaWQgPSBnZW5lcmF0ZVVVSUQoKS50b1N0cmluZygpO1xuICAgIGNvbnN0IGNvbW1vblByb3BzOiBPbWl0PFNlbGVjdGlvbkJhc2VQcm9wczxudWxsPiwgXCJzZWxlY3RvclwiPiA9IHtcbiAgICAgICAgdGFiSW5kZXg6IDEsXG4gICAgICAgIGlucHV0SWQ6IGlkLFxuICAgICAgICBsYWJlbElkOiBgJHtpZH0tbGFiZWxgLFxuICAgICAgICByZWFkT25seVN0eWxlOiBwcm9wcy5yZWFkT25seVN0eWxlLFxuICAgICAgICBhcmlhUmVxdWlyZWQ6IGR5bmFtaWMoZmFsc2UpLFxuICAgICAgICBhMTF5Q29uZmlnOiB7XG4gICAgICAgICAgICBhcmlhTGFiZWxzOiB7XG4gICAgICAgICAgICAgICAgY2xlYXJTZWxlY3Rpb246IHByb3BzLmNsZWFyQnV0dG9uQXJpYUxhYmVsLFxuICAgICAgICAgICAgICAgIHJlbW92ZVNlbGVjdGlvbjogcHJvcHMucmVtb3ZlVmFsdWVBcmlhTGFiZWwsXG4gICAgICAgICAgICAgICAgc2VsZWN0QWxsOiBwcm9wcy5zZWxlY3RBbGxCdXR0b25DYXB0aW9uXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYTExeVN0YXR1c01lc3NhZ2U6IHtcbiAgICAgICAgICAgICAgICBhMTF5U2VsZWN0ZWRWYWx1ZTogcHJvcHMuYTExeVNlbGVjdGVkVmFsdWUsXG4gICAgICAgICAgICAgICAgYTExeU9wdGlvbnNBdmFpbGFibGU6IHByb3BzLmExMXlPcHRpb25zQXZhaWxhYmxlLFxuICAgICAgICAgICAgICAgIGExMXlJbnN0cnVjdGlvbnM6IHByb3BzLmExMXlJbnN0cnVjdGlvbnMsXG4gICAgICAgICAgICAgICAgYTExeU5vT3B0aW9uOiBwcm9wcy5ub09wdGlvbnNUZXh0XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1lbnVGb290ZXJDb250ZW50OiBwcm9wcy5zaG93Rm9vdGVyID8gKFxuICAgICAgICAgICAgPHByb3BzLm1lbnVGb290ZXJDb250ZW50LnJlbmRlcmVyIGNhcHRpb249XCJQbGFjZSBmb290ZXIgd2lkZ2V0IGhlcmVcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IC8+XG4gICAgICAgICAgICA8L3Byb3BzLm1lbnVGb290ZXJDb250ZW50LnJlbmRlcmVyPlxuICAgICAgICApIDogbnVsbCxcbiAgICAgICAga2VlcE1lbnVPcGVuOlxuICAgICAgICAgICAgcHJvcHMuc2hvd0Zvb3RlciB8fFxuICAgICAgICAgICAgKHByb3BzLm9wdGlvbnNTb3VyY2VTdGF0aWNEYXRhU291cmNlLmxlbmd0aCA+IDAgJiYgcHJvcHMuc3RhdGljRGF0YVNvdXJjZUN1c3RvbUNvbnRlbnRUeXBlICE9PSBcIm5vXCIpXG4gICAgfTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9ydWxlcy1vZi1ob29rc1xuICAgIGNvbnN0IHNlbGVjdG9yOiBTaW5nbGVTZWxlY3RvciA9IHVzZU1lbW8oKCkgPT4ge1xuICAgICAgICBpZiAocHJvcHMuc291cmNlID09PSBcInN0YXRpY1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN0YXRpY1ByZXZpZXdTZWxlY3Rvcihwcm9wcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BzLnNvdXJjZSA9PT0gXCJkYXRhYmFzZVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGFiYXNlUHJldmlld1NlbGVjdG9yKHByb3BzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEFzc29jaWF0aW9uUHJldmlld1NlbGVjdG9yKHByb3BzKTtcbiAgICB9LCBbcHJvcHNdKTtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndpZGdldC1jb21ib2JveCB3aWRnZXQtY29tYm9ib3gtZWRpdG9yLXByZXZpZXdcIj5cbiAgICAgICAgICAgIDxTaW5nbGVTZWxlY3Rpb24gc2VsZWN0b3I9e3NlbGVjdG9yfSB7Li4uY29tbW9uUHJvcHN9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59O1xuIl0sIm5hbWVzIjpbImhhc093biIsImhhc093blByb3BlcnR5IiwiY2xhc3NOYW1lcyIsImNsYXNzZXMiLCJpIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiYXJnIiwiYXBwZW5kQ2xhc3MiLCJwYXJzZVZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwiYXBwbHkiLCJ0b1N0cmluZyIsIk9iamVjdCIsInByb3RvdHlwZSIsImluY2x1ZGVzIiwia2V5IiwiY2FsbCIsInZhbHVlIiwibmV3Q2xhc3MiLCJtb2R1bGUiLCJleHBvcnRzIiwiZGVmYXVsdCIsIndpbmRvdyIsIkRQIiwiTUFYX0RQIiwiTUFYX1BPV0VSIiwiTkFNRSIsIklOVkFMSUQiLCJJTlZBTElEX0RQIiwiSU5WQUxJRF9STSIsIkRJVl9CWV9aRVJPIiwiUCIsIlVOREVGSU5FRCIsInJvdW5kIiwieCIsInNkIiwicm0iLCJtb3JlIiwieGMiLCJjIiwiY29uc3RydWN0b3IiLCJSTSIsIkVycm9yIiwiZSIsInVuc2hpZnQiLCJwb3AiLCJzdHJpbmdpZnkiLCJkb0V4cG9uZW50aWFsIiwiaXNOb256ZXJvIiwicyIsImpvaW4iLCJuIiwiY2hhckF0Iiwic2xpY2UiLCJhYnMiLCJjbXAiLCJ5IiwiaXNuZWciLCJ5YyIsImoiLCJrIiwibCIsImRpdiIsIkJpZyIsImEiLCJiIiwiZHAiLCJibCIsImJ0IiwicmkiLCJieiIsImFpIiwiYWwiLCJyIiwicmwiLCJxIiwicWMiLCJxaSIsInAiLCJwdXNoIiwic2hpZnQiLCJlcSIsImd0IiwiZ3RlIiwibHQiLCJsdGUiLCJtaW51cyIsInN1YiIsInQiLCJ4bHR5IiwicGx1cyIsInhlIiwieWUiLCJyZXZlcnNlIiwibW9kIiwieWd0eCIsInRpbWVzIiwibmVnIiwiYWRkIiwicG93Iiwib25lIiwicHJlYyIsInNxcnQiLCJoYWxmIiwiTWF0aCIsInRvRXhwb25lbnRpYWwiLCJpbmRleE9mIiwibXVsIiwidG9GaXhlZCIsIlN5bWJvbCIsImZvciIsInRvSlNPTiIsIk5FIiwiUEUiLCJ0b051bWJlciIsInN0cmljdCIsInRvUHJlY2lzaW9uIiwidmFsdWVPZiIsImNoYXJhY3Rlck1hcCIsImNoYXJzIiwia2V5cyIsImFsbEFjY2VudHMiLCJSZWdFeHAiLCJmaXJzdEFjY2VudCIsIm1hdGNoZXIiLCJtYXRjaCIsInJlbW92ZUFjY2VudHMiLCJzdHJpbmciLCJyZXBsYWNlIiwiaGFzQWNjZW50cyIsImNyZWF0ZUVsZW1lbnQiLCJfanN4IiwiX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UiLCJfZXh0ZW5kcyIsImFzc2lnbiIsImJpbmQiLCJfYXNzZXJ0VGhpc0luaXRpYWxpemVkIiwiUmVmZXJlbmNlRXJyb3IiLCJfc2V0UHJvdG90eXBlT2YiLCJzZXRQcm90b3R5cGVPZiIsIl9fcHJvdG9fXyIsIl9pbmhlcml0c0xvb3NlIiwibyIsImNyZWF0ZSIsImhhc1N5bWJvbCIsIlJFQUNUX0VMRU1FTlRfVFlQRSIsIlJFQUNUX1BPUlRBTF9UWVBFIiwiUkVBQ1RfRlJBR01FTlRfVFlQRSIsIlJFQUNUX1NUUklDVF9NT0RFX1RZUEUiLCJSRUFDVF9QUk9GSUxFUl9UWVBFIiwiUkVBQ1RfUFJPVklERVJfVFlQRSIsIlJFQUNUX0NPTlRFWFRfVFlQRSIsIlJFQUNUX0FTWU5DX01PREVfVFlQRSIsIlJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFIiwiUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSIsIlJFQUNUX1NVU1BFTlNFX1RZUEUiLCJSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEUiLCJSRUFDVF9NRU1PX1RZUEUiLCJSRUFDVF9MQVpZX1RZUEUiLCJSRUFDVF9CTE9DS19UWVBFIiwiUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSIsIlJFQUNUX1JFU1BPTkRFUl9UWVBFIiwiUkVBQ1RfU0NPUEVfVFlQRSIsImlzVmFsaWRFbGVtZW50VHlwZSIsInR5cGUiLCIkJHR5cGVvZiIsInR5cGVPZiIsIm9iamVjdCIsIiQkdHlwZW9mVHlwZSIsInVuZGVmaW5lZCIsIkFzeW5jTW9kZSIsIkNvbmN1cnJlbnRNb2RlIiwiQ29udGV4dENvbnN1bWVyIiwiQ29udGV4dFByb3ZpZGVyIiwiRWxlbWVudCIsIkZvcndhcmRSZWYiLCJGcmFnbWVudCIsIkxhenkiLCJNZW1vIiwiUG9ydGFsIiwiUHJvZmlsZXIiLCJTdHJpY3RNb2RlIiwiU3VzcGVuc2UiLCJoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0FzeW5jTW9kZSIsImlzQXN5bmNNb2RlIiwiY29uc29sZSIsImlzQ29uY3VycmVudE1vZGUiLCJpc0NvbnRleHRDb25zdW1lciIsImlzQ29udGV4dFByb3ZpZGVyIiwiaXNFbGVtZW50IiwiaXNGb3J3YXJkUmVmIiwiaXNGcmFnbWVudCIsImlzTGF6eSIsImlzTWVtbyIsImlzUG9ydGFsIiwiaXNQcm9maWxlciIsImlzU3RyaWN0TW9kZSIsImlzU3VzcGVuc2UiLCJyZXF1aXJlIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwicHJvcElzRW51bWVyYWJsZSIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwidG9PYmplY3QiLCJ2YWwiLCJUeXBlRXJyb3IiLCJzaG91bGRVc2VOYXRpdmUiLCJ0ZXN0MSIsIlN0cmluZyIsImdldE93blByb3BlcnR5TmFtZXMiLCJ0ZXN0MiIsImZyb21DaGFyQ29kZSIsIm9yZGVyMiIsIm1hcCIsInRlc3QzIiwic3BsaXQiLCJmb3JFYWNoIiwibGV0dGVyIiwiZXJyIiwidGFyZ2V0Iiwic291cmNlIiwiZnJvbSIsInRvIiwic3ltYm9scyIsIlJlYWN0UHJvcFR5cGVzU2VjcmV0IiwiRnVuY3Rpb24iLCJwcmludFdhcm5pbmciLCJyZXF1aXJlJCQwIiwibG9nZ2VkVHlwZUZhaWx1cmVzIiwiaGFzIiwicmVxdWlyZSQkMSIsInRleHQiLCJtZXNzYWdlIiwiZXJyb3IiLCJjaGVja1Byb3BUeXBlcyIsInR5cGVTcGVjcyIsInZhbHVlcyIsImxvY2F0aW9uIiwiY29tcG9uZW50TmFtZSIsImdldFN0YWNrIiwidHlwZVNwZWNOYW1lIiwibmFtZSIsImV4Iiwic3RhY2siLCJyZXNldFdhcm5pbmdDYWNoZSIsIlJlYWN0SXMiLCJyZXF1aXJlJCQyIiwicmVxdWlyZSQkMyIsInJlcXVpcmUkJDQiLCJlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsIiwiaXNWYWxpZEVsZW1lbnQiLCJ0aHJvd09uRGlyZWN0QWNjZXNzIiwiSVRFUkFUT1JfU1lNQk9MIiwiaXRlcmF0b3IiLCJGQVVYX0lURVJBVE9SX1NZTUJPTCIsImdldEl0ZXJhdG9yRm4iLCJtYXliZUl0ZXJhYmxlIiwiaXRlcmF0b3JGbiIsIkFOT05ZTU9VUyIsIlJlYWN0UHJvcFR5cGVzIiwiYXJyYXkiLCJjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlciIsImJpZ2ludCIsImJvb2wiLCJmdW5jIiwibnVtYmVyIiwic3ltYm9sIiwiYW55IiwiY3JlYXRlQW55VHlwZUNoZWNrZXIiLCJhcnJheU9mIiwiY3JlYXRlQXJyYXlPZlR5cGVDaGVja2VyIiwiZWxlbWVudCIsImNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlciIsImVsZW1lbnRUeXBlIiwiY3JlYXRlRWxlbWVudFR5cGVUeXBlQ2hlY2tlciIsImluc3RhbmNlT2YiLCJjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyIiwibm9kZSIsImNyZWF0ZU5vZGVDaGVja2VyIiwib2JqZWN0T2YiLCJjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyIiwib25lT2YiLCJjcmVhdGVFbnVtVHlwZUNoZWNrZXIiLCJvbmVPZlR5cGUiLCJjcmVhdGVVbmlvblR5cGVDaGVja2VyIiwic2hhcGUiLCJjcmVhdGVTaGFwZVR5cGVDaGVja2VyIiwiZXhhY3QiLCJjcmVhdGVTdHJpY3RTaGFwZVR5cGVDaGVja2VyIiwiaXMiLCJQcm9wVHlwZUVycm9yIiwiZGF0YSIsImNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyIiwidmFsaWRhdGUiLCJtYW51YWxQcm9wVHlwZUNhbGxDYWNoZSIsIm1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50IiwiY2hlY2tUeXBlIiwiaXNSZXF1aXJlZCIsInByb3BzIiwicHJvcE5hbWUiLCJwcm9wRnVsbE5hbWUiLCJzZWNyZXQiLCJjYWNoZUtleSIsImNoYWluZWRDaGVja1R5cGUiLCJleHBlY3RlZFR5cGUiLCJwcm9wVmFsdWUiLCJwcm9wVHlwZSIsImdldFByb3BUeXBlIiwicHJlY2lzZVR5cGUiLCJnZXRQcmVjaXNlVHlwZSIsInR5cGVDaGVja2VyIiwiZXhwZWN0ZWRDbGFzcyIsImV4cGVjdGVkQ2xhc3NOYW1lIiwiYWN0dWFsQ2xhc3NOYW1lIiwiZ2V0Q2xhc3NOYW1lIiwiZXhwZWN0ZWRWYWx1ZXMiLCJ2YWx1ZXNTdHJpbmciLCJKU09OIiwicmVwbGFjZXIiLCJhcnJheU9mVHlwZUNoZWNrZXJzIiwicHJvY2VzcyIsImNoZWNrZXIiLCJnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmciLCJleHBlY3RlZFR5cGVzIiwiY2hlY2tlclJlc3VsdCIsImV4cGVjdGVkVHlwZXNNZXNzYWdlIiwiaXNOb2RlIiwiaW52YWxpZFZhbGlkYXRvckVycm9yIiwic2hhcGVUeXBlcyIsImFsbEtleXMiLCJldmVyeSIsInN0ZXAiLCJlbnRyaWVzIiwibmV4dCIsImRvbmUiLCJlbnRyeSIsImlzU3ltYm9sIiwiRGF0ZSIsIlByb3BUeXBlcyIsIlJFQUNUX1NFUlZFUl9CTE9DS19UWVBFIiwiUkVBQ1RfREVCVUdfVFJBQ0lOR19NT0RFX1RZUEUiLCJSRUFDVF9MRUdBQ1lfSElEREVOX1RZUEUiLCJzeW1ib2xGb3IiLCJSRUFDVF9PUEFRVUVfSURfVFlQRSIsIlJFQUNUX09GRlNDUkVFTl9UWVBFIiwiZW5hYmxlU2NvcGVBUEkiLCJoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0NvbmN1cnJlbnRNb2RlIiwiX19hc3NpZ24iLCJTdXBwcmVzc2VkRXJyb3IiLCJzdXBwcmVzc2VkIiwiaWRDb3VudGVyIiwiY2JUb0NiIiwiY2IiLCJub29wIiwic2Nyb2xsSW50b1ZpZXciLCJtZW51Tm9kZSIsImFjdGlvbnMiLCJjb21wdXRlIiwiYm91bmRhcnkiLCJibG9jayIsInNjcm9sbE1vZGUiLCJfcmVmIiwiZWwiLCJ0b3AiLCJsZWZ0Iiwic2Nyb2xsVG9wIiwic2Nyb2xsTGVmdCIsImlzT3JDb250YWluc05vZGUiLCJwYXJlbnQiLCJjaGlsZCIsImVudmlyb25tZW50IiwicmVzdWx0IiwiTm9kZSIsImNvbnRhaW5zIiwiZGVib3VuY2UiLCJmbiIsInRpbWUiLCJ0aW1lb3V0SWQiLCJjYW5jZWwiLCJjbGVhclRpbWVvdXQiLCJ3cmFwcGVyIiwiX2xlbiIsImFyZ3MiLCJfa2V5Iiwic2V0VGltZW91dCIsImNhbGxBbGxFdmVudEhhbmRsZXJzIiwiX2xlbjIiLCJmbnMiLCJfa2V5MiIsImV2ZW50IiwiX2xlbjMiLCJfa2V5MyIsInNvbWUiLCJjb25jYXQiLCJwcmV2ZW50RG93bnNoaWZ0RGVmYXVsdCIsIm5hdGl2ZUV2ZW50IiwiaGFuZGxlUmVmcyIsIl9sZW40IiwicmVmcyIsIl9rZXk0IiwicmVmIiwiY3VycmVudCIsImdlbmVyYXRlSWQiLCJnZXRBMTF5U3RhdHVzTWVzc2FnZSQxIiwiX3JlZjIiLCJpc09wZW4iLCJyZXN1bHRDb3VudCIsInByZXZpb3VzUmVzdWx0Q291bnQiLCJ1bndyYXBBcnJheSIsImRlZmF1bHRWYWx1ZSIsImlzRE9NRWxlbWVudCIsImdldEVsZW1lbnRQcm9wcyIsInJlcXVpcmVkUHJvcCIsImZuTmFtZSIsInN0YXRlS2V5cyIsInBpY2tTdGF0ZSIsInN0YXRlIiwiZ2V0U3RhdGUiLCJyZWR1Y2UiLCJwcmV2U3RhdGUiLCJpc0NvbnRyb2xsZWRQcm9wIiwibm9ybWFsaXplQXJyb3dLZXkiLCJrZXlDb2RlIiwiaXNQbGFpbk9iamVjdCIsIm9iaiIsImdldE5leHRXcmFwcGluZ0luZGV4IiwibW92ZUFtb3VudCIsImJhc2VJbmRleCIsIml0ZW1Db3VudCIsImdldEl0ZW1Ob2RlRnJvbUluZGV4IiwiY2lyY3VsYXIiLCJpdGVtc0xhc3RJbmRleCIsIm5ld0luZGV4Iiwibm9uRGlzYWJsZWROZXdJbmRleCIsImdldE5leHROb25EaXNhYmxlZEluZGV4IiwiY3VycmVudEVsZW1lbnROb2RlIiwiaGFzQXR0cmlidXRlIiwiaW5kZXgiLCJfaW5kZXgiLCJ0YXJnZXRXaXRoaW5Eb3duc2hpZnQiLCJkb3duc2hpZnRFbGVtZW50cyIsImNoZWNrQWN0aXZlRWxlbWVudCIsImNvbnRleHROb2RlIiwiZG9jdW1lbnQiLCJhY3RpdmVFbGVtZW50IiwidmFsaWRhdGVDb250cm9sbGVkVW5jaGFuZ2VkIiwicHJldlByb3BzIiwibmV4dFByb3BzIiwid2FybmluZ0Rlc2NyaXB0aW9uIiwicHJvcEtleSIsImNsZWFudXBTdGF0dXMiLCJkb2N1bWVudFByb3AiLCJnZXRTdGF0dXNEaXYiLCJ0ZXh0Q29udGVudCIsInNldFN0YXR1cyIsInN0YXR1cyIsInN0YXR1c0RpdiIsImdldEVsZW1lbnRCeUlkIiwic2V0QXR0cmlidXRlIiwic3R5bGUiLCJib3JkZXIiLCJjbGlwIiwiaGVpZ2h0IiwibWFyZ2luIiwib3ZlcmZsb3ciLCJwYWRkaW5nIiwicG9zaXRpb24iLCJ3aWR0aCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInVua25vd24iLCJtb3VzZVVwIiwiaXRlbU1vdXNlRW50ZXIiLCJrZXlEb3duQXJyb3dVcCIsImtleURvd25BcnJvd0Rvd24iLCJrZXlEb3duRXNjYXBlIiwia2V5RG93bkVudGVyIiwia2V5RG93bkhvbWUiLCJrZXlEb3duRW5kIiwiY2xpY2tJdGVtIiwiYmx1cklucHV0IiwiY2hhbmdlSW5wdXQiLCJrZXlEb3duU3BhY2VCdXR0b24iLCJjbGlja0J1dHRvbiIsImJsdXJCdXR0b24iLCJjb250cm9sbGVkUHJvcFVwZGF0ZWRTZWxlY3RlZEl0ZW0iLCJ0b3VjaEVuZCIsInN0YXRlQ2hhbmdlVHlwZXMkMyIsImZyZWV6ZSIsIl9leGNsdWRlZCQ0IiwiX2V4Y2x1ZGVkMiQzIiwiX2V4Y2x1ZGVkMyQyIiwiX2V4Y2x1ZGVkNCQxIiwiX2V4Y2x1ZGVkNSIsIkRvd25zaGlmdCIsIl9Db21wb25lbnQiLCJfcHJvcHMiLCJfdGhpcyIsImlkIiwibWVudUlkIiwibGFiZWxJZCIsImlucHV0SWQiLCJnZXRJdGVtSWQiLCJpbnB1dCIsIml0ZW1zIiwidGltZW91dElkcyIsImludGVybmFsU2V0VGltZW91dCIsImZpbHRlciIsInNldEl0ZW1Db3VudCIsImNvdW50IiwidW5zZXRJdGVtQ291bnQiLCJzZXRIaWdobGlnaHRlZEluZGV4IiwiaGlnaGxpZ2h0ZWRJbmRleCIsIm90aGVyU3RhdGVUb1NldCIsImRlZmF1bHRIaWdobGlnaHRlZEluZGV4IiwiaW50ZXJuYWxTZXRTdGF0ZSIsImNsZWFyU2VsZWN0aW9uIiwic2VsZWN0ZWRJdGVtIiwiaW5wdXRWYWx1ZSIsImRlZmF1bHRJc09wZW4iLCJzZWxlY3RJdGVtIiwiaXRlbSIsIml0ZW1Ub1N0cmluZyIsInNlbGVjdEl0ZW1BdEluZGV4IiwiaXRlbUluZGV4Iiwic2VsZWN0SGlnaGxpZ2h0ZWRJdGVtIiwic3RhdGVUb1NldCIsImlzSXRlbVNlbGVjdGVkIiwib25DaGFuZ2VBcmciLCJvblN0YXRlQ2hhbmdlQXJnIiwiaXNTdGF0ZVRvU2V0RnVuY3Rpb24iLCJvbklucHV0VmFsdWVDaGFuZ2UiLCJnZXRTdGF0ZUFuZEhlbHBlcnMiLCJzZXRTdGF0ZSIsIm5ld1N0YXRlVG9TZXQiLCJzdGF0ZVJlZHVjZXIiLCJuZXh0U3RhdGUiLCJoYXNNb3JlU3RhdGVUaGFuVHlwZSIsIm9uU3RhdGVDaGFuZ2UiLCJvblNlbGVjdCIsIm9uQ2hhbmdlIiwib25Vc2VyQWN0aW9uIiwicm9vdFJlZiIsIl9yb290Tm9kZSIsImdldFJvb3RQcm9wcyIsIl90ZW1wIiwiX3RlbXAyIiwiX2V4dGVuZHMyIiwiX3JlZiRyZWZLZXkiLCJyZWZLZXkiLCJyZXN0IiwiX3JlZjIkc3VwcHJlc3NSZWZFcnJvIiwic3VwcHJlc3NSZWZFcnJvciIsImNhbGxlZCIsIl90aGlzJGdldFN0YXRlIiwicm9sZSIsImtleURvd25IYW5kbGVycyIsIkFycm93RG93biIsIl90aGlzMiIsInByZXZlbnREZWZhdWx0IiwiYW1vdW50Iiwic2hpZnRLZXkiLCJtb3ZlSGlnaGxpZ2h0ZWRJbmRleCIsImdldEl0ZW1Db3VudCIsIl90aGlzMiRnZXRTdGF0ZSIsIm5leHRIaWdobGlnaHRlZEluZGV4IiwiQXJyb3dVcCIsIl90aGlzMyIsIl90aGlzMyRnZXRTdGF0ZSIsIkVudGVyIiwid2hpY2giLCJfdGhpcyRnZXRTdGF0ZTIiLCJpdGVtTm9kZSIsIkVzY2FwZSIsInJlc2V0IiwiYnV0dG9uS2V5RG93bkhhbmRsZXJzIiwiXyIsInRvZ2dsZU1lbnUiLCJpbnB1dEtleURvd25IYW5kbGVycyIsIkhvbWUiLCJfdGhpczQiLCJfdGhpcyRnZXRTdGF0ZTMiLCJuZXdIaWdobGlnaHRlZEluZGV4IiwiRW5kIiwiX3RoaXM1IiwiX3RoaXMkZ2V0U3RhdGU0IiwiZ2V0VG9nZ2xlQnV0dG9uUHJvcHMiLCJfdGVtcDMiLCJfcmVmMyIsIm9uQ2xpY2siLCJvblByZXNzIiwib25LZXlEb3duIiwib25LZXlVcCIsIm9uQmx1ciIsIl90aGlzJGdldFN0YXRlNSIsImVuYWJsZWRFdmVudEhhbmRsZXJzIiwiYnV0dG9uSGFuZGxlQ2xpY2siLCJidXR0b25IYW5kbGVLZXlEb3duIiwiYnV0dG9uSGFuZGxlS2V5VXAiLCJidXR0b25IYW5kbGVCbHVyIiwiZXZlbnRIYW5kbGVycyIsImRpc2FibGVkIiwiZm9jdXMiLCJibHVyVGFyZ2V0IiwiaXNNb3VzZURvd24iLCJnZXRMYWJlbFByb3BzIiwiaHRtbEZvciIsImdldElucHV0UHJvcHMiLCJfdGVtcDQiLCJfcmVmNCIsIm9uSW5wdXQiLCJvbkNoYW5nZVRleHQiLCJvbkNoYW5nZUtleSIsIl90aGlzJGdldFN0YXRlNiIsIl9ldmVudEhhbmRsZXJzIiwiaW5wdXRIYW5kbGVDaGFuZ2UiLCJpbnB1dEhhbmRsZUtleURvd24iLCJpbnB1dEhhbmRsZUJsdXIiLCJhdXRvQ29tcGxldGUiLCJkb3duc2hpZnRCdXR0b25Jc0FjdGl2ZSIsImRhdGFzZXQiLCJ0b2dnbGUiLCJtZW51UmVmIiwiX21lbnVOb2RlIiwiZ2V0TWVudVByb3BzIiwiX3RlbXA1IiwiX3RlbXA2IiwiX2V4dGVuZHMzIiwiX3JlZjUiLCJfcmVmNSRyZWZLZXkiLCJfcmVmNiIsIl9yZWY2JHN1cHByZXNzUmVmRXJybyIsImdldEl0ZW1Qcm9wcyIsIl90ZW1wNyIsIl9lbmFibGVkRXZlbnRIYW5kbGVycyIsIl9yZWY3Iiwib25Nb3VzZU1vdmUiLCJvbk1vdXNlRG93biIsIl9yZWY3JGl0ZW0iLCJvblNlbGVjdEtleSIsImN1c3RvbUNsaWNrSGFuZGxlciIsImF2b2lkU2Nyb2xsaW5nIiwiY2xlYXJJdGVtcyIsIl9yZWY4IiwiX3JlZjkiLCJfdGhpcyRnZXRTdGF0ZTciLCJvcGVuTWVudSIsImNsb3NlTWVudSIsInVwZGF0ZVN0YXR1cyIsImdldEExMXlTdGF0dXNNZXNzYWdlIiwiaGlnaGxpZ2h0ZWRJdGVtIiwiX3RoaXMkcHJvcHMiLCJfdGhpcyRwcm9wcyRpbml0aWFsSGkiLCJpbml0aWFsSGlnaGxpZ2h0ZWRJbmRleCIsIl9oaWdobGlnaHRlZEluZGV4IiwiX3RoaXMkcHJvcHMkaW5pdGlhbElzIiwiaW5pdGlhbElzT3BlbiIsIl9pc09wZW4iLCJfdGhpcyRwcm9wcyRpbml0aWFsSW4iLCJpbml0aWFsSW5wdXRWYWx1ZSIsIl9pbnB1dFZhbHVlIiwiX3RoaXMkcHJvcHMkaW5pdGlhbFNlIiwiaW5pdGlhbFNlbGVjdGVkSXRlbSIsIl9zZWxlY3RlZEl0ZW0iLCJfc3RhdGUiLCJfcHJvdG8iLCJpbnRlcm5hbENsZWFyVGltZW91dHMiLCJnZXRTdGF0ZSQxIiwic3RhdGVUb01lcmdlIiwic2Nyb2xsSGlnaGxpZ2h0ZWRJdGVtSW50b1ZpZXciLCJfdGhpczYiLCJfdGhpcyRnZXRTdGF0ZTgiLCJfdGhpcyRnZXRTdGF0ZTkiLCJjb21wb25lbnREaWRNb3VudCIsIl90aGlzNyIsInZhbGlkYXRlR2V0TWVudVByb3BzQ2FsbGVkQ29ycmVjdGx5Iiwib25Nb3VzZVVwIiwiY29udGV4dFdpdGhpbkRvd25zaGlmdCIsIm9uT3V0ZXJDbGljayIsIm9uVG91Y2hTdGFydCIsImlzVG91Y2hNb3ZlIiwib25Ub3VjaE1vdmUiLCJvblRvdWNoRW5kIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNsZWFudXAiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwic2hvdWxkU2Nyb2xsIiwiX3JlZjEwIiwiY3VycmVudEhpZ2hsaWdodGVkSW5kZXgiLCJfcmVmMTEiLCJwcmV2SGlnaGxpZ2h0ZWRJbmRleCIsInNjcm9sbFdoZW5PcGVuIiwic2Nyb2xsV2hlbk5hdmlnYXRpbmciLCJjb21wb25lbnREaWRVcGRhdGUiLCJzZWxlY3RlZEl0ZW1DaGFuZ2VkIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJyZW5kZXIiLCJjaGlsZHJlbiIsInZhbGlkYXRlR2V0Um9vdFByb3BzQ2FsbGVkQ29ycmVjdGx5IiwiY2xvbmVFbGVtZW50IiwiQ29tcG9uZW50IiwiZGVmYXVsdFByb3BzIiwid2FybiIsInByZXZJdGVtIiwic3RhdGVDaGFuZ2VUeXBlcyIsInByb3BUeXBlcyIsIl9yZWYxMiIsIl9yZWYxMyIsInJlZktleVNwZWNpZmllZCIsImlzQ29tcG9zaXRlIiwiX2V4Y2x1ZGVkJDMiLCJkcm9wZG93bkRlZmF1bHRTdGF0ZVZhbHVlcyIsImNhbGxPbkNoYW5nZVByb3BzIiwiYWN0aW9uIiwibmV3U3RhdGUiLCJjaGFuZ2VzIiwiaW52b2tlT25DaGFuZ2VIYW5kbGVyIiwiaGFuZGxlciIsImNhcGl0YWxpemVTdHJpbmciLCJnZXRBMTF5U2VsZWN0aW9uTWVzc2FnZSIsInNlbGVjdGlvblBhcmFtZXRlcnMiLCJpdGVtVG9TdHJpbmdMb2NhbCIsInVwZGF0ZUExMXlTdGF0dXMiLCJnZXRBMTF5TWVzc2FnZSIsInVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QiLCJ1c2VMYXlvdXRFZmZlY3QiLCJ1c2VFZmZlY3QiLCJ1c2VFbGVtZW50SWRzIiwiX3JlZiRpZCIsInRvZ2dsZUJ1dHRvbklkIiwiZWxlbWVudElkc1JlZiIsInVzZVJlZiIsImdldEl0ZW1BbmRJbmRleCIsIml0ZW1Qcm9wIiwiaW5kZXhQcm9wIiwiZXJyb3JNZXNzYWdlIiwidG9VcHBlckNhc2UiLCJ1c2VMYXRlc3RSZWYiLCJ1c2VFbmhhbmNlZFJlZHVjZXIiLCJyZWR1Y2VyIiwiaW5pdGlhbFN0YXRlIiwicHJldlN0YXRlUmVmIiwiYWN0aW9uUmVmIiwiZW5oYW5jZWRSZWR1Y2VyIiwidXNlQ2FsbGJhY2siLCJfdXNlUmVkdWNlciIsInVzZVJlZHVjZXIiLCJkaXNwYXRjaCIsInByb3BzUmVmIiwiZGlzcGF0Y2hXaXRoUHJvcHMiLCJkZWZhdWx0UHJvcHMkMyIsImdldERlZmF1bHRWYWx1ZSQxIiwiZGVmYXVsdFN0YXRlVmFsdWVzIiwiZ2V0SW5pdGlhbFZhbHVlJDEiLCJpbml0aWFsVmFsdWUiLCJnZXRJbml0aWFsU3RhdGUkMiIsImdldEhpZ2hsaWdodGVkSW5kZXhPbk9wZW4iLCJvZmZzZXQiLCJ1c2VNb3VzZUFuZFRvdWNoVHJhY2tlciIsImRvd25zaGlmdEVsZW1lbnRSZWZzIiwiaGFuZGxlQmx1ciIsIm1vdXNlQW5kVG91Y2hUcmFja2Vyc1JlZiIsInVzZUdldHRlclByb3BzQ2FsbGVkQ2hlY2tlciIsImlzSW5pdGlhbE1vdW50UmVmIiwicHJvcEtleXMiLCJnZXR0ZXJQcm9wc0NhbGxlZFJlZiIsImFjYyIsInByb3BDYWxsSW5mbyIsImVsZW1lbnRSZWYiLCJzZXRHZXR0ZXJQcm9wQ2FsbEluZm8iLCJ1c2VBMTF5TWVzc2FnZVNldHRlciIsImRlcGVuZGVuY3lBcnJheSIsImlzSW5pdGlhbE1vdW50IiwidXNlU2Nyb2xsSW50b1ZpZXciLCJpdGVtUmVmcyIsIm1lbnVFbGVtZW50Iiwic2Nyb2xsSW50b1ZpZXdQcm9wIiwic2hvdWxkU2Nyb2xsUmVmIiwidXNlQ29udHJvbFByb3BzVmFsaWRhdG9yIiwicHJldlByb3BzUmVmIiwiZ2V0Q2hhbmdlc09uU2VsZWN0aW9uIiwiX3Byb3BzJGl0ZW1zIiwic2hvdWxkU2VsZWN0IiwiZG93bnNoaWZ0Q29tbW9uUmVkdWNlciIsIkl0ZW1Nb3VzZU1vdmUiLCJNZW51TW91c2VMZWF2ZSIsIlRvZ2dsZUJ1dHRvbkNsaWNrIiwiRnVuY3Rpb25Ub2dnbGVNZW51IiwiRnVuY3Rpb25PcGVuTWVudSIsIkZ1bmN0aW9uQ2xvc2VNZW51IiwiRnVuY3Rpb25TZXRIaWdobGlnaHRlZEluZGV4IiwiRnVuY3Rpb25TZXRJbnB1dFZhbHVlIiwiRnVuY3Rpb25SZXNldCIsImRlZmF1bHRTZWxlY3RlZEl0ZW0iLCJvblNlbGVjdGVkSXRlbUNoYW5nZSIsIm9uSGlnaGxpZ2h0ZWRJbmRleENoYW5nZSIsIm9uSXNPcGVuQ2hhbmdlIiwiX2EiLCJJbnB1dEtleURvd25BcnJvd0Rvd24iLCJJbnB1dEtleURvd25BcnJvd1VwIiwiSW5wdXRLZXlEb3duRXNjYXBlIiwiSW5wdXRLZXlEb3duSG9tZSIsIklucHV0S2V5RG93bkVuZCIsIklucHV0S2V5RG93blBhZ2VVcCIsIklucHV0S2V5RG93blBhZ2VEb3duIiwiSW5wdXRLZXlEb3duRW50ZXIiLCJJbnB1dENoYW5nZSIsIklucHV0Qmx1ciIsIklucHV0Rm9jdXMiLCJJdGVtQ2xpY2siLCJGdW5jdGlvblNlbGVjdEl0ZW0iLCJGdW5jdGlvblJlc2V0JDEiLCJDb250cm9sbGVkUHJvcFVwZGF0ZWRTZWxlY3RlZEl0ZW0iLCJzdGF0ZUNoYW5nZVR5cGVzJDEiLCJnZXRJbml0aWFsU3RhdGUkMSIsImRlZmF1bHRJbnB1dFZhbHVlIiwicHJvcFR5cGVzJDEiLCJ1c2VDb250cm9sbGVkUmVkdWNlciIsInByZXZpb3VzU2VsZWN0ZWRJdGVtUmVmIiwiX3VzZUVuaGFuY2VkUmVkdWNlciIsInZhbGlkYXRlUHJvcFR5cGVzJDEiLCJ2YWxpZGF0ZVByb3BUeXBlcyIsIm9wdGlvbnMiLCJjYWxsZXIiLCJkZWZhdWx0UHJvcHMkMSIsImRvd25zaGlmdFVzZUNvbWJvYm94UmVkdWNlciIsImFsdEtleSIsIl9leGNsdWRlZCQxIiwiX2V4Y2x1ZGVkMiQxIiwiX2V4Y2x1ZGVkMyIsIl9leGNsdWRlZDQiLCJ1c2VDb21ib2JveCIsInVzZXJQcm9wcyIsIl91c2VDb250cm9sbGVkUmVkdWNlciIsImlucHV0UmVmIiwidG9nZ2xlQnV0dG9uUmVmIiwiZWxlbWVudElkcyIsInByZXZpb3VzUmVzdWx0Q291bnRSZWYiLCJsYXRlc3QiLCJmb2N1c09uT3BlbiIsIl9lbnZpcm9ubWVudCRkb2N1bWVudCIsIl9pbnB1dFJlZiRjdXJyZW50IiwidXNlTWVtbyIsImxhdGVzdFN0YXRlIiwiUGFnZVVwIiwiUGFnZURvd24iLCJsYWJlbFByb3BzIiwib25Nb3VzZUxlYXZlIiwiX3JlZjMkcmVmS2V5IiwiX2xhdGVzdCRjdXJyZW50IiwibGF0ZXN0UHJvcHMiLCJfZ2V0SXRlbUFuZEluZGV4IiwiaXRlbUhhbmRsZU1vdXNlTW92ZSIsIml0ZW1IYW5kbGVDbGljayIsIml0ZW1IYW5kbGVNb3VzZURvd24iLCJfZXh0ZW5kczQiLCJ0b2dnbGVCdXR0b25IYW5kbGVDbGljayIsInRvZ2dsZUJ1dHRvbk5vZGUiLCJ0YWJJbmRleCIsIl9leHRlbmRzNSIsIm9uRm9jdXMiLCJfcmVmNiRyZWZLZXkiLCJfcmVmNyRzdXBwcmVzc1JlZkVycm8iLCJpc0JsdXJCeVRhYkNoYW5nZSIsInJlbGF0ZWRUYXJnZXQiLCJpbnB1dEhhbmRsZUZvY3VzIiwiaW5wdXROb2RlIiwibmV3U2VsZWN0ZWRJdGVtIiwic2V0SW5wdXRWYWx1ZSIsIm5ld0lucHV0VmFsdWUiLCJnZXRBMTF5UmVtb3ZhbE1lc3NhZ2UiLCJyZW1vdmVkU2VsZWN0ZWRJdGVtIiwic2VsZWN0ZWRJdGVtcyIsImluaXRpYWxTZWxlY3RlZEl0ZW1zIiwiZGVmYXVsdFNlbGVjdGVkSXRlbXMiLCJhY3RpdmVJbmRleCIsImluaXRpYWxBY3RpdmVJbmRleCIsImRlZmF1bHRBY3RpdmVJbmRleCIsIm9uQWN0aXZlSW5kZXhDaGFuZ2UiLCJvblNlbGVjdGVkSXRlbXNDaGFuZ2UiLCJrZXlOYXZpZ2F0aW9uTmV4dCIsImtleU5hdmlnYXRpb25QcmV2aW91cyIsImZvcndhcmRSZWYiLCJfanN4cyIsInVzZVN0YXRlIiwic3R5bGVJbmplY3QiLCJjc3MiLCJpbnNlcnRBdCIsImhlYWQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImZpcnN0Q2hpbGQiLCJpbnNlcnRCZWZvcmUiLCJzdHlsZVNoZWV0IiwiY3NzVGV4dCIsImNyZWF0ZVRleHROb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztTQUFnQixZQUFZLEdBQUE7QUFDeEIsSUFBQSxJQUFJLE9BQU8sTUFB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UixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxJQUFJO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLElBQUk7R0FDVCxHQUFHLEVBQUUsSUFBSTtHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLElBQUk7R0FDVCxHQUFHLEVBQUUsSUFBSTtHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxJQUFJO0dBQ1QsR0FBRyxFQUFFLElBQUk7R0FDVCxHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLElBQUk7R0FDVCxHQUFHLEVBQUUsSUFBSTtHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsSUFBSSxFQUFFLEdBQUc7R0FDVCxHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULEdBQUcsRUFBQyxHQUFHO0dBQ1AsR0FBRyxFQUFDLEdBQUc7R0FDUCxHQUFHLEVBQUMsR0FBRztBQUNQLEdBQUEsR0FBRyxFQUFDLEdBQUE7RUFDSixDQUFBO0FBRUQsQ0FBQSxJQUFJQyxLQUFLLEdBQUczRyxNQUFNLENBQUM0RyxJQUFJLENBQUNGLFlBQVksQ0FBQyxDQUFDcEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0NBQy9DLElBQUl1RSxVQUFVLEdBQUcsSUFBSUMsTUFBTSxDQUFDSCxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUE7Q0FDdkMsSUFBSUksV0FBVyxHQUFHLElBQUlELE1BQU0sQ0FBQ0gsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0NBRXZDLFNBQVNLLE9BQU9BLENBQUNDLEtB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SyxDQUFDLG9CQUFvQjtnQkFDMUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxvQkFBb0I7Z0JBQzNDLFNBQVMsRUFBRSxLQUFLLENBQUMsc0JBQXNCO0FBQzFDLGFBQUE7QUFDRCxZQUFBLGlCQUFpQixFQUFFO2dCQUNmLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxpQkFBaUI7Z0JBQzFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxvQkFBb0I7Z0JBQ2hELGdCQUFnQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0I7Z0JBQ3hDLFlBQVksRUFBRSxLQUFLLENBQUMsYUFBYTtBQUNwQyxhQUFBO0FBQ0osU0FBQTtRQUNELGlCQUFpQixFQUFFLEtBQUssQ0FBQyxVQUFVLElBQy9CQSxjQUFDLENBQUEsS0FBSyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBQSxFQUFDLE9BQU8sRUFBQywwQkFBMEIsRUFBQSxRQUFBLEVBQ2hFQSxjQUFPLENBQUEsS0FBQSxFQUFBLEVBQUEsQ0FBQSxFQUFBLENBQ3dCLElBQ25DLElBQUk7UUFDUixZQUFZLEVBQ1IsS0FBSyxDQUFDLFVBQVU7QUFDaEIsYUFBQyxLQUFLLENBQUMsNkJBQTZCLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsaUNBQWlDLEtBQUssSUFBSSxDQUFDO0tBQzNHLENBQUM7O0FBR0YsSUFBQSxNQUFNLFFBQVEsR0FBbUJzc0IsYUFBTyxDQUFDLE1BQUs7QUFDMUMsUUFBQSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssUUFBUSxFQUFFO0FBQzNCLFlBQUEsT0FBTyxJQUFJLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzNDO0FBQ0QsUUFBQSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssVUFBVSxFQUFFO0FBQzdCLFlBQUEsT0FBTyxJQUFJLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdDO0FBQ0QsUUFBQSxPQUFPLElBQUksMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakQsS0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNaLElBQUEsUUFDSXRzQixjQUFLLENBQUEsS0FBQSxFQUFBLEVBQUEsU0FBUyxFQUFDLGdEQUFnRCxZQUMzREEsY0FBQyxDQUFBLGVBQWUsRUFBQyxFQUFBLFFBQVEsRUFBRSxRQUFRLEVBQUEsR0FBTSxXQUFXLEVBQUksQ0FBQSxFQUFBLENBQ3RELEVBQ1I7QUFDTjs7OzsiLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMSwyLDMsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxNywxOCwxOSwyMCwyMSwyMiw0Ml19
