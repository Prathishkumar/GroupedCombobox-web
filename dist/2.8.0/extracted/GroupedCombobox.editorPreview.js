'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');

function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
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
    return document.querySelector(`label[for="${inputId}"]`);
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
                    selector.options.setSearchTerm(inputValue);
                    selector.onFilterInputChange(inputValue);
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
                        return state;
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
    const returnVal = useCombobox({
        ...downshiftProps,
        items: selector.options.getAll() ?? [],
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
    react.useEffect(() => {
        if (!element || !active) {
            setRect(undefined);
            return;
        }
        function observe() {
            if (element) {
                setRect(element.getBoundingClientRect());
            }
            rafRef.current = requestAnimationFrame(observe);
        }
        observe();
        return () => {
            cancelAnimationFrame(rafRef.current);
        };
    }, [element, active]);
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
            : style, children: [menuHeaderContent && (jsxRuntime.jsx("div", { className: "widget-combobox-menu-header widget-combobox-item", onMouseDown: PreventMenuCloseEventHandler, tabIndex: 0, children: menuHeaderContent })), jsxRuntime.jsxs("ul", { className: classNames("widget-combobox-menu-list", {
                    "widget-combobox-menu-highlighted": (highlightedIndex ?? -1) >= 0,
                    "widget-combobox-menu-lazy-scroll": lazyLoading && !isEmpty
                }), ...getMenuProps?.({
                    onClick: onOptionClick,
                    onMouseDown: ForcePreventMenuCloseEventHandler,
                    onScroll
                }, { suppressRefError: true }), children: [isOpen ? (isEmpty && !isLoading ? (jsxRuntime.jsx(NoOptionsPlaceholder, { children: noOptionsText })) : (children)) : null, loader] }), menuFooterContent && (jsxRuntime.jsx("div", { tabIndex: 0, className: "widget-combobox-menu-footer", onMouseDown: PreventMenuCloseEventHandler, children: menuFooterContent }))] }));
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
    return (jsxRuntime.jsx("li", { className: classNames("widget-combobox-group-header"), "aria-disabled": "true", role: "presentation", 
        // Prevents the menu from closing when header is clicked
        onMouseDown: e => e.preventDefault(), children: jsxRuntime.jsx("span", { className: "widget-combobox-group-header-text", children: title }) }));
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
                                }), tabIndex: tabIndex, ...inputProps, placeholder: " ", "aria-labelledby": hasLabel ? inputProps["aria-labelledby"] : undefined, "aria-describedby": selector.validation ? errorId : undefined, "aria-invalid": selector.validation ? true : undefined }), jsxRuntime.jsx(InputPlaceholder, { isEmpty: !selector.currentId || !selector.caption.render(selectedItem, "label"), type: selector.customContentType === "yes" ? "custom" : "text", children: selectedItemCaption })] }), ((!selector.readOnly && selector.clearable && selector.currentId !== null) ||
                        (selector.selectorType === "static" &&
                            selector.currentId !== null &&
                            !selector.readOnly &&
                            selector.clearable &&
                            selector.attributeType !== "boolean")) && (jsxRuntime.jsx("button", { tabIndex: tabIndex, className: "widget-combobox-clear-button", "aria-label": a11yConfig.ariaLabels?.clearSelection, onClick: e => {
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

var css_248z = ".widget-combobox {\n  min-width: 0;\n  flex-grow: 1;\n  position: relative;\n  transition: color 150ms ease 0s;\n}\n.widget-combobox-menu {\n  position: absolute;\n  display: inline;\n  border-radius: var(--dropdown-border-radius, 7px);\n  margin: var(--spacing-smaller, 4px) 0 var(--spacing-smaller, 4px) 0;\n  width: 100%;\n  left: unset;\n  padding: var(--dropdown-outer-padding, 10px) 0 0;\n  z-index: 25;\n  box-shadow: 0px 0px var(--dropdown-outer-padding, 10px) 0px var(--shadow-color-border, rgba(0, 0, 0, 0.2));\n  background-color: var(--label-info-color, #ffffff);\n  list-style-type: none;\n}\n.widget-combobox-menu-list {\n  padding: 0;\n  margin-bottom: 0;\n  max-height: 320px;\n  overflow-y: auto;\n}\n.widget-combobox-menu-list:last-child {\n  margin-bottom: var(--dropdown-outer-padding, 10px);\n}\n.widget-combobox-menu-lazy-scroll {\n  background: linear-gradient(white 30%, rgba(255, 255, 255, 0)) center top, linear-gradient(rgba(255, 255, 255, 0), white 70%) center bottom, linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(197, 197, 197, 0.6)) center top, linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(197, 197, 197, 0.6)) center bottom;\n  background-repeat: no-repeat;\n  background-size: 100% 70px, 100% 70px, 100% 35px, 100% 35px;\n  background-attachment: local, local, scroll, scroll;\n}\n.widget-combobox-menu-hidden {\n  display: none;\n}\n.widget-combobox-menu-header {\n  border-bottom: 1px solid var(--gray-primary, #ced0d3);\n}\n.widget-combobox-menu-header:focus, .widget-combobox-menu-header:focus-within, .widget-combobox-menu-header:hover {\n  background-color: var(--color-default-light, #f5f6f6);\n}\n.widget-combobox-menu-header:has(input[type=checkbox]:hover, :focus, :focus-within) + .widget-combobox-menu-list:not(.widget-combobox-menu-highlighted) input[type=checkbox]:not(:checked):after {\n  content: \"\";\n  border-color: var(--btn-default-bg-hover, #ced0d3);\n}\n.widget-combobox-menu-header-select-all-button + label {\n  transition: color 0.2s ease-in-out;\n}\n.widget-combobox-menu-header-select-all-button-disabled + label {\n  color: var(--color-default-dark, #6c7180);\n}\n.widget-combobox-menu-footer {\n  border-top: 1px solid var(--gray-primary, #ced0d3);\n  padding: var(--dropdown-outer-padding, 10px);\n}\n.widget-combobox-menu-footer:focus, .widget-combobox-menu-footer:focus-within {\n  outline: 1px solid var(--brand-primary, #264ae5);\n}\n.widget-combobox-item {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  align-content: center;\n  align-items: center;\n  cursor: pointer;\n  user-select: none;\n  padding: 6px var(--dropdown-outer-padding, 10px);\n  height: fit-content;\n  overflow: hidden;\n  color: var(--gray-darker, #3b4251);\n}\n.widget-combobox-item-selected {\n  background-color: var(--color-primary-lighter, #e6eaff);\n}\n.widget-combobox-item-highlighted, .widget-combobox-item:focus {\n  background-color: var(--color-default-light, #f5f6f6);\n}\n.widget-combobox-item > .widget-combobox-icon-container {\n  margin-inline-end: var(--dropdown-outer-padding, 10px);\n}\n.widget-combobox-item .widget-combobox-caption-text {\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n  flex: 1;\n  font-weight: normal;\n  margin: 0;\n  min-height: 20px;\n}\n.widget-combobox-item.widget-combobox-no-options {\n  justify-content: center;\n}\n.widget-combobox-group-header {\n  display: flex;\n  align-items: center;\n  padding: 10px var(--dropdown-outer-padding, 10px);\n  margin: 0;\n  cursor: default;\n  user-select: none;\n  pointer-events: none;\n  list-style: none;\n  border-bottom: 1px solid var(--gray-lighter, #e7e7e9);\n}\n.widget-combobox-group-header-text {\n  font-size: var(--font-size-default, 14px);\n  font-weight: 500;\n  color: var(--cb-text-color, var(--gray-darker, #3b4251));\n  line-height: 1.4;\n}\n.widget-combobox .widget-combobox-input-container {\n  flex-grow: 1;\n  transition: box-shadow 150ms ease 0s;\n}\n.widget-combobox .widget-combobox-input-container-disabled {\n  background-color: var(--gray-lighter, #f8f8f8);\n  pointer-events: none !important;\n}\n.widget-combobox .widget-combobox-input-container-disabled.form-control-static {\n  background-color: transparent;\n}\n.widget-combobox .widget-combobox-multiselect:not(.widget-combobox-input-container-active) .widget-combobox-input {\n  width: 1px;\n}\n.widget-combobox-input {\n  color: var(--cb-text-color, var(--gray-dark, #606671));\n  flex-grow: 1;\n  border: none;\n  padding: 0;\n}\n.widget-combobox-input-nofilter, .widget-combobox-input:placeholder-shown:not(:focus) {\n  max-width: 0;\n}\n.widget-combobox-input:placeholder-shown:focus:not(.widget-combobox-input-nofilter):has(+ .widget-combobox-placeholder-empty) {\n  max-width: 3px;\n  margin-right: -3px;\n  background: transparent;\n}\n.widget-combobox .widget-combobox-selected-items:not(.widget-combobox-boxes) .widget-combobox-input:placeholder-shown:focus:not(.widget-combobox .widget-combobox-selected-items:not(.widget-combobox-boxes) .widget-combobox-input-nofilter) {\n  max-width: 3px;\n  margin-right: -3px;\n  background: transparent;\n}\n.widget-combobox-clear-button {\n  display: flex;\n  align-items: center;\n  cursor: pointer;\n  background: transparent;\n  border: none;\n}\n.widget-combobox-clear-button-icon {\n  transition: color 0.2s ease-in-out;\n}\n.widget-combobox-clear-button path {\n  stroke-width: 0;\n  transition: stroke-width 0.2s ease-in-out;\n}\n.widget-combobox-clear-button:focus .widget-combobox-icon-container {\n  border-radius: 2px;\n  outline: 2px solid var(--brand-primary, #264ae5);\n}\n.widget-combobox-clear-button:hover .widget-combobox-clear-button-icon {\n  color: var(--brand-primary, #264ae5);\n  font-weight: bold;\n}\n.widget-combobox-clear-button:hover .widget-combobox-clear-button-icon path {\n  stroke-width: 1px;\n}\n.widget-combobox-clear-button + .widget-combobox-down-arrow {\n  border-inline-start: 1px solid var(--gray, #787d87);\n}\n.widget-combobox-down-arrow {\n  display: flex;\n  flex-wrap: wrap;\n  align-content: center;\n  cursor: pointer;\n  padding-inline-start: var(--spacing-smaller, 4px);\n}\n.widget-combobox-down-arrow-icon {\n  transition: transform 0.2s;\n}\n.widget-combobox-down-arrow-icon.active {\n  transform: rotate(180deg);\n  transition: transform 0.2s;\n}\n.widget-combobox-down-arrow-icon {\n  stroke: var(--cb-text-color);\n}\n.widget-combobox-placeholder {\n  background-color: var(--gray-lighter, #f8f8f8) !important;\n  justify-content: flex-end !important;\n  border: 1px solid #e7e7e9;\n  cursor: not-allowed;\n}\n.widget-combobox-placeholder-text {\n  color: var(--cb-text-color, var(--gray-darker, #3b4251));\n  inset-inline-start: 0;\n  inset-inline-end: 0;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n  pointer-events: none;\n  display: none;\n}\n.widget-combobox-placeholder-empty {\n  color: var(--cb-text-color, var(--gray-dark, #606671));\n}\n.widget-combobox-caption-custom {\n  flex: 1;\n}\n.widget-combobox-custom-content {\n  position: relative;\n  display: flex;\n  flex-grow: 1;\n  flex-direction: column;\n}\n.widget-combobox-custom-content .widget-combobox-input:not(:focus), .widget-combobox-custom-content .widget-combobox-input:placeholder-shown {\n  position: absolute;\n  top: 0;\n  inset-inline-start: 0;\n  inset-inline-end: 0;\n  bottom: 0;\n}\n.widget-combobox-custom-content .widget-combobox-input:not(:placeholder-shown) + .widget-combobox-placeholder-custom {\n  display: none;\n}\n.widget-combobox-selected-items {\n  min-width: 0;\n  display: flex;\n  flex-grow: 1;\n  position: relative;\n}\n.widget-combobox-selected-items.widget-combobox-boxes {\n  flex-wrap: wrap;\n  margin: -2px 0;\n}\n.widget-combobox-selected-items.widget-combobox-boxes .widget-combobox-input-nofilter {\n  width: 1px;\n}\n.widget-combobox-selected-items.widget-combobox-text {\n  flex-wrap: nowrap;\n}\n.widget-combobox-selected-items input:placeholder-shown + .widget-combobox-placeholder-text,\n.widget-combobox-selected-items input:not(:focus) + .widget-combobox-placeholder-text {\n  display: initial;\n  text-overflow: ellipsis;\n  align-items: center;\n}\n.widget-combobox-selected-item {\n  color: #000;\n  font-size: var(--font-size-small, 12px);\n  line-height: 1.334;\n  display: inline-flex;\n  border-radius: 26px;\n  justify-content: center;\n  padding: var(--spacing-smallest, 2px) var(--dropdown-outer-padding, 10px);\n  flex-wrap: wrap;\n  align-items: center;\n  margin: var(--spacing-smallest, 2px);\n  gap: 8px;\n  background-color: var(--color-primary-lighter, #e6eaff);\n}\n.widget-combobox-selected-item-remove-button {\n  padding: 0px 0px;\n  border: none;\n  background-color: transparent;\n  cursor: pointer;\n  color: var(--brand-primary, #264ae5);\n}\n.widget-combobox-selected-item-remove-button span {\n  display: flex;\n  align-items: center;\n}\n.widget-combobox-selected-item:focus-visible {\n  outline: var(--brand-primary, #264ae5) auto 1px;\n}\n.widget-combobox-down-checkbox-icon {\n  fill: transparent;\n}\n.widget-combobox-down-checkbox-icon:not(.checked) rect {\n  stroke: var(--gray-primary, #ced0d3);\n}\n.widget-combobox-down-checkbox-icon:not(.checked):hover path, .widget-combobox-down-checkbox-icon:not(.checked):focus path {\n  stroke: var(--btn-default-bg-hover, #ced0d3);\n  stroke-width: 2px;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n}\n.widget-combobox-down-checkbox-icon.checked rect {\n  fill: var(--brand-primary, #264ae5);\n}\n.widget-combobox-down-checkbox-icon.checked path {\n  stroke: white;\n  stroke-width: 2px;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n}\n.widget-combobox-icon-container {\n  display: flex;\n  padding-top: 1px;\n}\n.widget-combobox-skeleton, .widget-combobox-spinner {\n  align-content: center;\n  align-items: center;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  overflow: hidden;\n}\n.widget-combobox-skeleton {\n  padding: 6px var(--dropdown-outer-padding, 10px);\n}\n.widget-combobox-skeleton-loader {\n  animation: skeleton-loading 1s linear infinite alternate;\n  background: linear-gradient(90deg, rgba(194, 194, 194, 0.2) 0%, #d2d2d2 100%);\n  background-size: 300% 100%;\n  border-radius: 4px;\n  height: 16px;\n  width: 148px;\n}\n.widget-combobox-skeleton-loader-small {\n  margin-inline-end: 8px;\n  width: 16px;\n}\n.widget-combobox-spinner {\n  justify-content: center;\n  width: 100%;\n}\n.widget-combobox-spinner-margin {\n  margin: 52px 0;\n}\n.widget-combobox-spinner-loader {\n  --widget-combobox-spinner-loader: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;\n  animation: rotate 1s infinite linear;\n  aspect-ratio: 1;\n  background: var(--brand-primary, #264ae5);\n  border-radius: 50%;\n  mask: var(--widget-combobox-spinner-loader);\n  mask-composite: subtract;\n  padding: 3.5px;\n  height: 24px;\n  width: 24px;\n}\n.widget-combobox-spinner-loader-small {\n  height: 16px;\n  width: 16px;\n  padding: 2.3px;\n}\n@keyframes skeleton-loading {\n  0% {\n    background-position: right;\n  }\n}\n@keyframes rotate {\n  to {\n    transform: rotate(1turn);\n  }\n}\n/*# sourceMappingURL=inline */\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vQzovVXNlcnMvU2FzaWRoYXJhbiUyMEsvRGVza3RvcC9Db21ib2JveC13ZWIvc3JjL3VpL0dyb3VwZWRDb21ib2JveC5zY3NzIiwiR3JvdXBlZENvbWJvYm94LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBbUJBO0VBQ0ksWUFBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtFQUNBLCtCQUFBO0FDbEJKO0FEbUJJO0VBQ0ksa0JBQUE7RUFDQSxlQUFBO0VBQ0EsaURBQUE7RUFDQSxtRUFBQTtFQUNBLFdBQUE7RUFDQSxXQUFBO0VBQ0EsZ0RBQUE7RUFDQSxXQUFBO0VBQ0EsMEdBQUE7RUFFQSxrREFBQTtFQUNBLHFCQUFBO0FDbEJSO0FEbUJRO0VBQ0ksVUFBQTtFQUNBLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxnQkFBQTtBQ2pCWjtBRGtCWTtFQUNJLGtEQUFBO0FDaEJoQjtBRG1CUTtFQUNJLDRUQUVJO0VBTUosNEJBQUE7RUFDQSwyREFDSTtFQUlKLG1EQUFBO0FDNUJaO0FEOEJRO0VBQ0ksYUFBQTtBQzVCWjtBRDhCUTtFQUNJLHFEQUFBO0FDNUJaO0FENkJZO0VBR0kscURBQUE7QUM3QmhCO0FEZ0NZO0VBR0ksV0FBQTtFQUNBLGtEQUFBO0FDaENoQjtBRG9DZ0I7RUFDSSxrQ0FBQTtBQ2xDcEI7QURxQ2dCO0VBQ0kseUNBQUE7QUNuQ3BCO0FEd0NRO0VBQ0ksa0RBQUE7RUFDQSw0Q0FBQTtBQ3RDWjtBRHVDWTtFQUVJLGdEQUFBO0FDdENoQjtBRDJDSTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLGlCQUFBO0VBQ0EscUJBQUE7RUFDQSxtQkFBQTtFQUNBLGVBQUE7RUFDQSxpQkFBQTtFQUNBLGdEQUFBO0VBQ0EsbUJBQUE7RUFDQSxnQkFBQTtFQUNBLGtDQUFBO0FDekNSO0FEMkNRO0VBQ0ksdURBQUE7QUN6Q1o7QUQyQ1E7RUFFSSxxREFBQTtBQzFDWjtBRDRDUTtFQUNJLHNEQUFBO0FDMUNaO0FENkNRO0VBQ0ksdUJBQUE7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 */";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXBlZENvbWJvYm94LmVkaXRvclByZXZpZXcuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zaGltcy93aWRnZXQtcGx1Z2luLXBsYXRmb3JtL2ZyYW1ld29yay9nZW5lcmF0ZS11dWlkLnRzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NsYXNzbmFtZXMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYmlnLmpzL2JpZy5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVtb3ZlLWFjY2VudHMvaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvaGVscGVycy91dGlscy50cyIsIi4uLy4uLy4uL3NyYy9hc3NldHMvaWNvbnMudHN4IiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vZXh0ZW5kcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vc2V0UHJvdG90eXBlT2YuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vaW5oZXJpdHNMb29zZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL25vZGVfbW9kdWxlcy9yZWFjdC1pcy9janMvcmVhY3QtaXMuZGV2ZWxvcG1lbnQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9ub2RlX21vZHVsZXMvcmVhY3QtaXMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2xpYi9oYXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9jaGVja1Byb3BUeXBlcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtaXMvY2pzL3JlYWN0LWlzLmRldmVsb3BtZW50LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWlzL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9kb3duc2hpZnQvZGlzdC9kb3duc2hpZnQuZXNtLmpzIiwiLi4vLi4vLi4vc3JjL2hvb2tzL3VzZURvd25zaGlmdFNpbmdsZVNlbGVjdFByb3BzLnRzIiwiLi4vLi4vLi4vc3JjL3NoaW1zL3dpZGdldC1wbHVnaW4tZ3JpZC9jb21wb25lbnRzL0luZmluaXRlQm9keS50cyIsIi4uLy4uLy4uL3NyYy9ob29rcy91c2VMYXp5TG9hZGluZy50cyIsIi4uLy4uLy4uL3NyYy9zaGltcy93aWRnZXQtcGx1Z2luLWNvbXBvbmVudC1raXQvQWxlcnQudHN4IiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvU3Bpbm5lckxvYWRlci50c3giLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9Db21ib2JveFdyYXBwZXIudHN4IiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvUGxhY2Vob2xkZXIudHN4IiwiLi4vLi4vLi4vc3JjL2hlbHBlcnMvZ3JvdXBpbmdVdGlscy50cyIsIi4uLy4uLy4uL3NyYy9zaGltcy93aWRnZXQtcGx1Z2luLWhvb2tzL3VzZVBvc2l0aW9uT2JzZXJ2ZXIudHMiLCIuLi8uLi8uLi9zcmMvc2hpbXMvd2lkZ2V0LXBsdWdpbi1wbGF0Zm9ybS91dGlscy9kZWJvdW5jZS50cyIsIi4uLy4uLy4uL3NyYy9ob29rcy91c2VNZW51U3R5bGUudHMiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9Db21ib2JveE1lbnVXcmFwcGVyLnRzeCIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0NvbWJvYm94T3B0aW9uV3JhcHBlci50c3giLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9Db21ib2JveEdyb3VwSGVhZGVyLnRzeCIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1NrZWxldG9uTG9hZGVyLnRzeCIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0xvYWRlci50c3giLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9TaW5nbGVTZWxlY3Rpb24vU2luZ2xlU2VsZWN0aW9uTWVudS50c3giLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9TaW5nbGVTZWxlY3Rpb24vU2luZ2xlU2VsZWN0aW9uLnRzeCIsIi4uLy4uLy4uL3NyYy9zaGltcy93aWRnZXQtcGx1Z2luLXRlc3QtdXRpbHMvaW5kZXgudHMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtaW5qZWN0L2Rpc3Qvc3R5bGUtaW5qZWN0LmVzLmpzIiwiLi4vLi4vLi4vc3JjL2hlbHBlcnMvQXNzb2NpYXRpb24vQXNzb2NpYXRpb25TaW1wbGVDYXB0aW9uc1Byb3ZpZGVyLnRzeCIsIi4uLy4uLy4uL3NyYy9oZWxwZXJzL0Fzc29jaWF0aW9uL1ByZXZpZXcvQXNzb2NpYXRpb25QcmV2aWV3Q2FwdGlvbnNQcm92aWRlci50c3giLCIuLi8uLi8uLi9zcmMvaGVscGVycy9Bc3NvY2lhdGlvbi9QcmV2aWV3L0Fzc29jaWF0aW9uUHJldmlld09wdGlvbnNQcm92aWRlci50cyIsIi4uLy4uLy4uL3NyYy9oZWxwZXJzL0Fzc29jaWF0aW9uL1ByZXZpZXcvQXNzb2NpYXRpb25QcmV2aWV3U2VsZWN0b3IudHMiLCIuLi8uLi8uLi9zcmMvaGVscGVycy9TdGF0aWMvUHJldmlldy9TdGF0aWNQcmV2aWV3Q2FwdGlvbnNQcm92aWRlci50c3giLCIuLi8uLi8uLi9zcmMvaGVscGVycy9TdGF0aWMvUHJldmlldy9TdGF0aWNQcmV2aWV3T3B0aW9uc1Byb3ZpZGVyLnRzIiwiLi4vLi4vLi4vc3JjL2hlbHBlcnMvU3RhdGljL1ByZXZpZXcvU3RhdGljUHJldmlld1NlbGVjdG9yLnRzIiwiLi4vLi4vLi4vc3JjL2hlbHBlcnMvRGF0YWJhc2UvUHJldmlldy9EYXRhYmFzZVByZXZpZXdTZWxlY3Rvci50cyIsIi4uLy4uLy4uL3NyYy9Hcm91cGVkQ29tYm9ib3guZWRpdG9yUHJldmlldy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlVVVJRCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBcInh4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eFwiLnJlcGxhY2UoL1t4eV0vZywgYyA9PiB7XG4gICAgICAgIGNvbnN0IHIgPSAoTWF0aC5yYW5kb20oKSAqIDE2KSB8IDA7XG4gICAgICAgIGNvbnN0IHYgPSBjID09PSBcInhcIiA/IHIgOiAociAmIDB4MykgfCAweDg7XG4gICAgICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbiAgICB9KTtcbn1cbiIsIi8qIVxuXHRDb3B5cmlnaHQgKGMpIDIwMTggSmVkIFdhdHNvbi5cblx0TGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlIChNSVQpLCBzZWVcblx0aHR0cDovL2plZHdhdHNvbi5naXRodWIuaW8vY2xhc3NuYW1lc1xuKi9cbi8qIGdsb2JhbCBkZWZpbmUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBoYXNPd24gPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuXHRmdW5jdGlvbiBjbGFzc05hbWVzICgpIHtcblx0XHR2YXIgY2xhc3NlcyA9ICcnO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoYXJnKSB7XG5cdFx0XHRcdGNsYXNzZXMgPSBhcHBlbmRDbGFzcyhjbGFzc2VzLCBwYXJzZVZhbHVlKGFyZykpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjbGFzc2VzO1xuXHR9XG5cblx0ZnVuY3Rpb24gcGFyc2VWYWx1ZSAoYXJnKSB7XG5cdFx0aWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7XG5cdFx0XHRyZXR1cm4gYXJnO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgYXJnICE9PSAnb2JqZWN0Jykge1xuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH1cblxuXHRcdGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZyk7XG5cdFx0fVxuXG5cdFx0aWYgKGFyZy50b1N0cmluZyAhPT0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyAmJiAhYXJnLnRvU3RyaW5nLnRvU3RyaW5nKCkuaW5jbHVkZXMoJ1tuYXRpdmUgY29kZV0nKSkge1xuXHRcdFx0cmV0dXJuIGFyZy50b1N0cmluZygpO1xuXHRcdH1cblxuXHRcdHZhciBjbGFzc2VzID0gJyc7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG5cdFx0XHRpZiAoaGFzT3duLmNhbGwoYXJnLCBrZXkpICYmIGFyZ1trZXldKSB7XG5cdFx0XHRcdGNsYXNzZXMgPSBhcHBlbmRDbGFzcyhjbGFzc2VzLCBrZXkpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjbGFzc2VzO1xuXHR9XG5cblx0ZnVuY3Rpb24gYXBwZW5kQ2xhc3MgKHZhbHVlLCBuZXdDbGFzcykge1xuXHRcdGlmICghbmV3Q2xhc3MpIHtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9XG5cdFxuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0cmV0dXJuIHZhbHVlICsgJyAnICsgbmV3Q2xhc3M7XG5cdFx0fVxuXHRcblx0XHRyZXR1cm4gdmFsdWUgKyBuZXdDbGFzcztcblx0fVxuXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdGNsYXNzTmFtZXMuZGVmYXVsdCA9IGNsYXNzTmFtZXM7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyByZWdpc3RlciBhcyAnY2xhc3NuYW1lcycsIGNvbnNpc3RlbnQgd2l0aCBucG0gcGFja2FnZSBuYW1lXG5cdFx0ZGVmaW5lKCdjbGFzc25hbWVzJywgW10sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcblx0fVxufSgpKTtcbiIsIi8qXHJcbiAqICBiaWcuanMgdjYuMi4yXHJcbiAqICBBIHNtYWxsLCBmYXN0LCBlYXN5LXRvLXVzZSBsaWJyYXJ5IGZvciBhcmJpdHJhcnktcHJlY2lzaW9uIGRlY2ltYWwgYXJpdGhtZXRpYy5cclxuICogIENvcHlyaWdodCAoYykgMjAyNCBNaWNoYWVsIE1jbGF1Z2hsaW5cclxuICogIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWtlTWNsL2JpZy5qcy9MSUNFTkNFLm1kXHJcbiAqL1xyXG5cclxuXHJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBFRElUQUJMRSBERUZBVUxUUyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcblxyXG4gIC8vIFRoZSBkZWZhdWx0IHZhbHVlcyBiZWxvdyBtdXN0IGJlIGludGVnZXJzIHdpdGhpbiB0aGUgc3RhdGVkIHJhbmdlcy5cclxuXHJcbiAgLypcclxuICAgKiBUaGUgbWF4aW11bSBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXMgKERQKSBvZiB0aGUgcmVzdWx0cyBvZiBvcGVyYXRpb25zIGludm9sdmluZyBkaXZpc2lvbjpcclxuICAgKiBkaXYgYW5kIHNxcnQsIGFuZCBwb3cgd2l0aCBuZWdhdGl2ZSBleHBvbmVudHMuXHJcbiAgICovXHJcbnZhciBEUCA9IDIwLCAgICAgICAgICAvLyAwIHRvIE1BWF9EUFxyXG5cclxuICAvKlxyXG4gICAqIFRoZSByb3VuZGluZyBtb2RlIChSTSkgdXNlZCB3aGVuIHJvdW5kaW5nIHRvIHRoZSBhYm92ZSBkZWNpbWFsIHBsYWNlcy5cclxuICAgKlxyXG4gICAqICAwICBUb3dhcmRzIHplcm8gKGkuZS4gdHJ1bmNhdGUsIG5vIHJvdW5kaW5nKS4gICAgICAgKFJPVU5EX0RPV04pXHJcbiAgICogIDEgIFRvIG5lYXJlc3QgbmVpZ2hib3VyLiBJZiBlcXVpZGlzdGFudCwgcm91bmQgdXAuICAoUk9VTkRfSEFMRl9VUClcclxuICAgKiAgMiAgVG8gbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCB0byBldmVuLiAgIChST1VORF9IQUxGX0VWRU4pXHJcbiAgICogIDMgIEF3YXkgZnJvbSB6ZXJvLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoUk9VTkRfVVApXHJcbiAgICovXHJcbiAgUk0gPSAxLCAgICAgICAgICAgICAvLyAwLCAxLCAyIG9yIDNcclxuXHJcbiAgLy8gVGhlIG1heGltdW0gdmFsdWUgb2YgRFAgYW5kIEJpZy5EUC5cclxuICBNQVhfRFAgPSAxRTYsICAgICAgIC8vIDAgdG8gMTAwMDAwMFxyXG5cclxuICAvLyBUaGUgbWF4aW11bSBtYWduaXR1ZGUgb2YgdGhlIGV4cG9uZW50IGFyZ3VtZW50IHRvIHRoZSBwb3cgbWV0aG9kLlxyXG4gIE1BWF9QT1dFUiA9IDFFNiwgICAgLy8gMSB0byAxMDAwMDAwXHJcblxyXG4gIC8qXHJcbiAgICogVGhlIG5lZ2F0aXZlIGV4cG9uZW50IChORSkgYXQgYW5kIGJlbmVhdGggd2hpY2ggdG9TdHJpbmcgcmV0dXJucyBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICAgKiAoSmF2YVNjcmlwdCBudW1iZXJzOiAtNylcclxuICAgKiAtMTAwMDAwMCBpcyB0aGUgbWluaW11bSByZWNvbW1lbmRlZCBleHBvbmVudCB2YWx1ZSBvZiBhIEJpZy5cclxuICAgKi9cclxuICBORSA9IC03LCAgICAgICAgICAgIC8vIDAgdG8gLTEwMDAwMDBcclxuXHJcbiAgLypcclxuICAgKiBUaGUgcG9zaXRpdmUgZXhwb25lbnQgKFBFKSBhdCBhbmQgYWJvdmUgd2hpY2ggdG9TdHJpbmcgcmV0dXJucyBleHBvbmVudGlhbCBub3RhdGlvbi5cclxuICAgKiAoSmF2YVNjcmlwdCBudW1iZXJzOiAyMSlcclxuICAgKiAxMDAwMDAwIGlzIHRoZSBtYXhpbXVtIHJlY29tbWVuZGVkIGV4cG9uZW50IHZhbHVlIG9mIGEgQmlnLCBidXQgdGhpcyBsaW1pdCBpcyBub3QgZW5mb3JjZWQuXHJcbiAgICovXHJcbiAgUEUgPSAyMSwgICAgICAgICAgICAvLyAwIHRvIDEwMDAwMDBcclxuXHJcbiAgLypcclxuICAgKiBXaGVuIHRydWUsIGFuIGVycm9yIHdpbGwgYmUgdGhyb3duIGlmIGEgcHJpbWl0aXZlIG51bWJlciBpcyBwYXNzZWQgdG8gdGhlIEJpZyBjb25zdHJ1Y3RvcixcclxuICAgKiBvciBpZiB2YWx1ZU9mIGlzIGNhbGxlZCwgb3IgaWYgdG9OdW1iZXIgaXMgY2FsbGVkIG9uIGEgQmlnIHdoaWNoIGNhbm5vdCBiZSBjb252ZXJ0ZWQgdG8gYVxyXG4gICAqIHByaW1pdGl2ZSBudW1iZXIgd2l0aG91dCBhIGxvc3Mgb2YgcHJlY2lzaW9uLlxyXG4gICAqL1xyXG4gIFNUUklDVCA9IGZhbHNlLCAgICAgLy8gdHJ1ZSBvciBmYWxzZVxyXG5cclxuXHJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcblxyXG4gIC8vIEVycm9yIG1lc3NhZ2VzLlxyXG4gIE5BTUUgPSAnW2JpZy5qc10gJyxcclxuICBJTlZBTElEID0gTkFNRSArICdJbnZhbGlkICcsXHJcbiAgSU5WQUxJRF9EUCA9IElOVkFMSUQgKyAnZGVjaW1hbCBwbGFjZXMnLFxyXG4gIElOVkFMSURfUk0gPSBJTlZBTElEICsgJ3JvdW5kaW5nIG1vZGUnLFxyXG4gIERJVl9CWV9aRVJPID0gTkFNRSArICdEaXZpc2lvbiBieSB6ZXJvJyxcclxuXHJcbiAgLy8gVGhlIHNoYXJlZCBwcm90b3R5cGUgb2JqZWN0LlxyXG4gIFAgPSB7fSxcclxuICBVTkRFRklORUQgPSB2b2lkIDAsXHJcbiAgTlVNRVJJQyA9IC9eLT8oXFxkKyhcXC5cXGQqKT98XFwuXFxkKykoZVsrLV0/XFxkKyk/JC9pO1xyXG5cclxuXHJcbi8qXHJcbiAqIENyZWF0ZSBhbmQgcmV0dXJuIGEgQmlnIGNvbnN0cnVjdG9yLlxyXG4gKi9cclxuZnVuY3Rpb24gX0JpZ18oKSB7XHJcblxyXG4gIC8qXHJcbiAgICogVGhlIEJpZyBjb25zdHJ1Y3RvciBhbmQgZXhwb3J0ZWQgZnVuY3Rpb24uXHJcbiAgICogQ3JlYXRlIGFuZCByZXR1cm4gYSBuZXcgaW5zdGFuY2Ugb2YgYSBCaWcgbnVtYmVyIG9iamVjdC5cclxuICAgKlxyXG4gICAqIG4ge251bWJlcnxzdHJpbmd8QmlnfSBBIG51bWVyaWMgdmFsdWUuXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gQmlnKG4pIHtcclxuICAgIHZhciB4ID0gdGhpcztcclxuXHJcbiAgICAvLyBFbmFibGUgY29uc3RydWN0b3IgdXNhZ2Ugd2l0aG91dCBuZXcuXHJcbiAgICBpZiAoISh4IGluc3RhbmNlb2YgQmlnKSkgcmV0dXJuIG4gPT09IFVOREVGSU5FRCA/IF9CaWdfKCkgOiBuZXcgQmlnKG4pO1xyXG5cclxuICAgIC8vIER1cGxpY2F0ZS5cclxuICAgIGlmIChuIGluc3RhbmNlb2YgQmlnKSB7XHJcbiAgICAgIHgucyA9IG4ucztcclxuICAgICAgeC5lID0gbi5lO1xyXG4gICAgICB4LmMgPSBuLmMuc2xpY2UoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICh0eXBlb2YgbiAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICBpZiAoQmlnLnN0cmljdCA9PT0gdHJ1ZSAmJiB0eXBlb2YgbiAhPT0gJ2JpZ2ludCcpIHtcclxuICAgICAgICAgIHRocm93IFR5cGVFcnJvcihJTlZBTElEICsgJ3ZhbHVlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBNaW51cyB6ZXJvP1xyXG4gICAgICAgIG4gPSBuID09PSAwICYmIDEgLyBuIDwgMCA/ICctMCcgOiBTdHJpbmcobik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHBhcnNlKHgsIG4pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJldGFpbiBhIHJlZmVyZW5jZSB0byB0aGlzIEJpZyBjb25zdHJ1Y3Rvci5cclxuICAgIC8vIFNoYWRvdyBCaWcucHJvdG90eXBlLmNvbnN0cnVjdG9yIHdoaWNoIHBvaW50cyB0byBPYmplY3QuXHJcbiAgICB4LmNvbnN0cnVjdG9yID0gQmlnO1xyXG4gIH1cclxuXHJcbiAgQmlnLnByb3RvdHlwZSA9IFA7XHJcbiAgQmlnLkRQID0gRFA7XHJcbiAgQmlnLlJNID0gUk07XHJcbiAgQmlnLk5FID0gTkU7XHJcbiAgQmlnLlBFID0gUEU7XHJcbiAgQmlnLnN0cmljdCA9IFNUUklDVDtcclxuICBCaWcucm91bmREb3duID0gMDtcclxuICBCaWcucm91bmRIYWxmVXAgPSAxO1xyXG4gIEJpZy5yb3VuZEhhbGZFdmVuID0gMjtcclxuICBCaWcucm91bmRVcCA9IDM7XHJcblxyXG4gIHJldHVybiBCaWc7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBQYXJzZSB0aGUgbnVtYmVyIG9yIHN0cmluZyB2YWx1ZSBwYXNzZWQgdG8gYSBCaWcgY29uc3RydWN0b3IuXHJcbiAqXHJcbiAqIHgge0JpZ30gQSBCaWcgbnVtYmVyIGluc3RhbmNlLlxyXG4gKiBuIHtudW1iZXJ8c3RyaW5nfSBBIG51bWVyaWMgdmFsdWUuXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJzZSh4LCBuKSB7XHJcbiAgdmFyIGUsIGksIG5sO1xyXG5cclxuICBpZiAoIU5VTUVSSUMudGVzdChuKSkge1xyXG4gICAgdGhyb3cgRXJyb3IoSU5WQUxJRCArICdudW1iZXInKTtcclxuICB9XHJcblxyXG4gIC8vIERldGVybWluZSBzaWduLlxyXG4gIHgucyA9IG4uY2hhckF0KDApID09ICctJyA/IChuID0gbi5zbGljZSgxKSwgLTEpIDogMTtcclxuXHJcbiAgLy8gRGVjaW1hbCBwb2ludD9cclxuICBpZiAoKGUgPSBuLmluZGV4T2YoJy4nKSkgPiAtMSkgbiA9IG4ucmVwbGFjZSgnLicsICcnKTtcclxuXHJcbiAgLy8gRXhwb25lbnRpYWwgZm9ybT9cclxuICBpZiAoKGkgPSBuLnNlYXJjaCgvZS9pKSkgPiAwKSB7XHJcblxyXG4gICAgLy8gRGV0ZXJtaW5lIGV4cG9uZW50LlxyXG4gICAgaWYgKGUgPCAwKSBlID0gaTtcclxuICAgIGUgKz0gK24uc2xpY2UoaSArIDEpO1xyXG4gICAgbiA9IG4uc3Vic3RyaW5nKDAsIGkpO1xyXG4gIH0gZWxzZSBpZiAoZSA8IDApIHtcclxuXHJcbiAgICAvLyBJbnRlZ2VyLlxyXG4gICAgZSA9IG4ubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgbmwgPSBuLmxlbmd0aDtcclxuXHJcbiAgLy8gRGV0ZXJtaW5lIGxlYWRpbmcgemVyb3MuXHJcbiAgZm9yIChpID0gMDsgaSA8IG5sICYmIG4uY2hhckF0KGkpID09ICcwJzspICsraTtcclxuXHJcbiAgaWYgKGkgPT0gbmwpIHtcclxuXHJcbiAgICAvLyBaZXJvLlxyXG4gICAgeC5jID0gW3guZSA9IDBdO1xyXG4gIH0gZWxzZSB7XHJcblxyXG4gICAgLy8gRGV0ZXJtaW5lIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgZm9yICg7IG5sID4gMCAmJiBuLmNoYXJBdCgtLW5sKSA9PSAnMCc7KTtcclxuICAgIHguZSA9IGUgLSBpIC0gMTtcclxuICAgIHguYyA9IFtdO1xyXG5cclxuICAgIC8vIENvbnZlcnQgc3RyaW5nIHRvIGFycmF5IG9mIGRpZ2l0cyB3aXRob3V0IGxlYWRpbmcvdHJhaWxpbmcgemVyb3MuXHJcbiAgICBmb3IgKGUgPSAwOyBpIDw9IG5sOykgeC5jW2UrK10gPSArbi5jaGFyQXQoaSsrKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB4O1xyXG59XHJcblxyXG5cclxuLypcclxuICogUm91bmQgQmlnIHggdG8gYSBtYXhpbXVtIG9mIHNkIHNpZ25pZmljYW50IGRpZ2l0cyB1c2luZyByb3VuZGluZyBtb2RlIHJtLlxyXG4gKlxyXG4gKiB4IHtCaWd9IFRoZSBCaWcgdG8gcm91bmQuXHJcbiAqIHNkIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0czogaW50ZWdlciwgMCB0byBNQVhfRFAgaW5jbHVzaXZlLlxyXG4gKiBybSB7bnVtYmVyfSBSb3VuZGluZyBtb2RlOiAwIChkb3duKSwgMSAoaGFsZi11cCksIDIgKGhhbGYtZXZlbikgb3IgMyAodXApLlxyXG4gKiBbbW9yZV0ge2Jvb2xlYW59IFdoZXRoZXIgdGhlIHJlc3VsdCBvZiBkaXZpc2lvbiB3YXMgdHJ1bmNhdGVkLlxyXG4gKi9cclxuZnVuY3Rpb24gcm91bmQoeCwgc2QsIHJtLCBtb3JlKSB7XHJcbiAgdmFyIHhjID0geC5jO1xyXG5cclxuICBpZiAocm0gPT09IFVOREVGSU5FRCkgcm0gPSB4LmNvbnN0cnVjdG9yLlJNO1xyXG4gIGlmIChybSAhPT0gMCAmJiBybSAhPT0gMSAmJiBybSAhPT0gMiAmJiBybSAhPT0gMykge1xyXG4gICAgdGhyb3cgRXJyb3IoSU5WQUxJRF9STSk7XHJcbiAgfVxyXG5cclxuICBpZiAoc2QgPCAxKSB7XHJcbiAgICBtb3JlID1cclxuICAgICAgcm0gPT09IDMgJiYgKG1vcmUgfHwgISF4Y1swXSkgfHwgc2QgPT09IDAgJiYgKFxyXG4gICAgICBybSA9PT0gMSAmJiB4Y1swXSA+PSA1IHx8XHJcbiAgICAgIHJtID09PSAyICYmICh4Y1swXSA+IDUgfHwgeGNbMF0gPT09IDUgJiYgKG1vcmUgfHwgeGNbMV0gIT09IFVOREVGSU5FRCkpXHJcbiAgICApO1xyXG5cclxuICAgIHhjLmxlbmd0aCA9IDE7XHJcblxyXG4gICAgaWYgKG1vcmUpIHtcclxuXHJcbiAgICAgIC8vIDEsIDAuMSwgMC4wMSwgMC4wMDEsIDAuMDAwMSBldGMuXHJcbiAgICAgIHguZSA9IHguZSAtIHNkICsgMTtcclxuICAgICAgeGNbMF0gPSAxO1xyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIC8vIFplcm8uXHJcbiAgICAgIHhjWzBdID0geC5lID0gMDtcclxuICAgIH1cclxuICB9IGVsc2UgaWYgKHNkIDwgeGMubGVuZ3RoKSB7XHJcblxyXG4gICAgLy8geGNbc2RdIGlzIHRoZSBkaWdpdCBhZnRlciB0aGUgZGlnaXQgdGhhdCBtYXkgYmUgcm91bmRlZCB1cC5cclxuICAgIG1vcmUgPVxyXG4gICAgICBybSA9PT0gMSAmJiB4Y1tzZF0gPj0gNSB8fFxyXG4gICAgICBybSA9PT0gMiAmJiAoeGNbc2RdID4gNSB8fCB4Y1tzZF0gPT09IDUgJiZcclxuICAgICAgICAobW9yZSB8fCB4Y1tzZCArIDFdICE9PSBVTkRFRklORUQgfHwgeGNbc2QgLSAxXSAmIDEpKSB8fFxyXG4gICAgICBybSA9PT0gMyAmJiAobW9yZSB8fCAhIXhjWzBdKTtcclxuXHJcbiAgICAvLyBSZW1vdmUgYW55IGRpZ2l0cyBhZnRlciB0aGUgcmVxdWlyZWQgcHJlY2lzaW9uLlxyXG4gICAgeGMubGVuZ3RoID0gc2Q7XHJcblxyXG4gICAgLy8gUm91bmQgdXA/XHJcbiAgICBpZiAobW9yZSkge1xyXG5cclxuICAgICAgLy8gUm91bmRpbmcgdXAgbWF5IG1lYW4gdGhlIHByZXZpb3VzIGRpZ2l0IGhhcyB0byBiZSByb3VuZGVkIHVwLlxyXG4gICAgICBmb3IgKDsgKyt4Y1stLXNkXSA+IDk7KSB7XHJcbiAgICAgICAgeGNbc2RdID0gMDtcclxuICAgICAgICBpZiAoc2QgPT09IDApIHtcclxuICAgICAgICAgICsreC5lO1xyXG4gICAgICAgICAgeGMudW5zaGlmdCgxKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgIGZvciAoc2QgPSB4Yy5sZW5ndGg7ICF4Y1stLXNkXTspIHhjLnBvcCgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHg7XHJcbn1cclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiBCaWcgeCBpbiBub3JtYWwgb3IgZXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAqIEhhbmRsZXMgUC50b0V4cG9uZW50aWFsLCBQLnRvRml4ZWQsIFAudG9KU09OLCBQLnRvUHJlY2lzaW9uLCBQLnRvU3RyaW5nIGFuZCBQLnZhbHVlT2YuXHJcbiAqL1xyXG5mdW5jdGlvbiBzdHJpbmdpZnkoeCwgZG9FeHBvbmVudGlhbCwgaXNOb256ZXJvKSB7XHJcbiAgdmFyIGUgPSB4LmUsXHJcbiAgICBzID0geC5jLmpvaW4oJycpLFxyXG4gICAgbiA9IHMubGVuZ3RoO1xyXG5cclxuICAvLyBFeHBvbmVudGlhbCBub3RhdGlvbj9cclxuICBpZiAoZG9FeHBvbmVudGlhbCkge1xyXG4gICAgcyA9IHMuY2hhckF0KDApICsgKG4gPiAxID8gJy4nICsgcy5zbGljZSgxKSA6ICcnKSArIChlIDwgMCA/ICdlJyA6ICdlKycpICsgZTtcclxuXHJcbiAgLy8gTm9ybWFsIG5vdGF0aW9uLlxyXG4gIH0gZWxzZSBpZiAoZSA8IDApIHtcclxuICAgIGZvciAoOyArK2U7KSBzID0gJzAnICsgcztcclxuICAgIHMgPSAnMC4nICsgcztcclxuICB9IGVsc2UgaWYgKGUgPiAwKSB7XHJcbiAgICBpZiAoKytlID4gbikge1xyXG4gICAgICBmb3IgKGUgLT0gbjsgZS0tOykgcyArPSAnMCc7XHJcbiAgICB9IGVsc2UgaWYgKGUgPCBuKSB7XHJcbiAgICAgIHMgPSBzLnNsaWNlKDAsIGUpICsgJy4nICsgcy5zbGljZShlKTtcclxuICAgIH1cclxuICB9IGVsc2UgaWYgKG4gPiAxKSB7XHJcbiAgICBzID0gcy5jaGFyQXQoMCkgKyAnLicgKyBzLnNsaWNlKDEpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHgucyA8IDAgJiYgaXNOb256ZXJvID8gJy0nICsgcyA6IHM7XHJcbn1cclxuXHJcblxyXG4vLyBQcm90b3R5cGUvaW5zdGFuY2UgbWV0aG9kc1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBCaWcgd2hvc2UgdmFsdWUgaXMgdGhlIGFic29sdXRlIHZhbHVlIG9mIHRoaXMgQmlnLlxyXG4gKi9cclxuUC5hYnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHggPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKTtcclxuICB4LnMgPSAxO1xyXG4gIHJldHVybiB4O1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiAxIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBpcyBncmVhdGVyIHRoYW4gdGhlIHZhbHVlIG9mIEJpZyB5LFxyXG4gKiAgICAgICAtMSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgaXMgbGVzcyB0aGFuIHRoZSB2YWx1ZSBvZiBCaWcgeSwgb3JcclxuICogICAgICAgIDAgaWYgdGhleSBoYXZlIHRoZSBzYW1lIHZhbHVlLlxyXG4gKi9cclxuUC5jbXAgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHZhciBpc25lZyxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgeGMgPSB4LmMsXHJcbiAgICB5YyA9ICh5ID0gbmV3IHguY29uc3RydWN0b3IoeSkpLmMsXHJcbiAgICBpID0geC5zLFxyXG4gICAgaiA9IHkucyxcclxuICAgIGsgPSB4LmUsXHJcbiAgICBsID0geS5lO1xyXG5cclxuICAvLyBFaXRoZXIgemVybz9cclxuICBpZiAoIXhjWzBdIHx8ICF5Y1swXSkgcmV0dXJuICF4Y1swXSA/ICF5Y1swXSA/IDAgOiAtaiA6IGk7XHJcblxyXG4gIC8vIFNpZ25zIGRpZmZlcj9cclxuICBpZiAoaSAhPSBqKSByZXR1cm4gaTtcclxuXHJcbiAgaXNuZWcgPSBpIDwgMDtcclxuXHJcbiAgLy8gQ29tcGFyZSBleHBvbmVudHMuXHJcbiAgaWYgKGsgIT0gbCkgcmV0dXJuIGsgPiBsIF4gaXNuZWcgPyAxIDogLTE7XHJcblxyXG4gIGogPSAoayA9IHhjLmxlbmd0aCkgPCAobCA9IHljLmxlbmd0aCkgPyBrIDogbDtcclxuXHJcbiAgLy8gQ29tcGFyZSBkaWdpdCBieSBkaWdpdC5cclxuICBmb3IgKGkgPSAtMTsgKytpIDwgajspIHtcclxuICAgIGlmICh4Y1tpXSAhPSB5Y1tpXSkgcmV0dXJuIHhjW2ldID4geWNbaV0gXiBpc25lZyA/IDEgOiAtMTtcclxuICB9XHJcblxyXG4gIC8vIENvbXBhcmUgbGVuZ3Rocy5cclxuICByZXR1cm4gayA9PSBsID8gMCA6IGsgPiBsIF4gaXNuZWcgPyAxIDogLTE7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IEJpZyB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgZGl2aWRlZCBieSB0aGUgdmFsdWUgb2YgQmlnIHksIHJvdW5kZWQsXHJcbiAqIGlmIG5lY2Vzc2FyeSwgdG8gYSBtYXhpbXVtIG9mIEJpZy5EUCBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIEJpZy5STS5cclxuICovXHJcblAuZGl2ID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBCaWcgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgYSA9IHguYywgICAgICAgICAgICAgICAgICAvLyBkaXZpZGVuZFxyXG4gICAgYiA9ICh5ID0gbmV3IEJpZyh5KSkuYywgICAvLyBkaXZpc29yXHJcbiAgICBrID0geC5zID09IHkucyA/IDEgOiAtMSxcclxuICAgIGRwID0gQmlnLkRQO1xyXG5cclxuICBpZiAoZHAgIT09IH5+ZHAgfHwgZHAgPCAwIHx8IGRwID4gTUFYX0RQKSB7XHJcbiAgICB0aHJvdyBFcnJvcihJTlZBTElEX0RQKTtcclxuICB9XHJcblxyXG4gIC8vIERpdmlzb3IgaXMgemVybz9cclxuICBpZiAoIWJbMF0pIHtcclxuICAgIHRocm93IEVycm9yKERJVl9CWV9aRVJPKTtcclxuICB9XHJcblxyXG4gIC8vIERpdmlkZW5kIGlzIDA/IFJldHVybiArLTAuXHJcbiAgaWYgKCFhWzBdKSB7XHJcbiAgICB5LnMgPSBrO1xyXG4gICAgeS5jID0gW3kuZSA9IDBdO1xyXG4gICAgcmV0dXJuIHk7XHJcbiAgfVxyXG5cclxuICB2YXIgYmwsIGJ0LCBuLCBjbXAsIHJpLFxyXG4gICAgYnogPSBiLnNsaWNlKCksXHJcbiAgICBhaSA9IGJsID0gYi5sZW5ndGgsXHJcbiAgICBhbCA9IGEubGVuZ3RoLFxyXG4gICAgciA9IGEuc2xpY2UoMCwgYmwpLCAgIC8vIHJlbWFpbmRlclxyXG4gICAgcmwgPSByLmxlbmd0aCxcclxuICAgIHEgPSB5LCAgICAgICAgICAgICAgICAvLyBxdW90aWVudFxyXG4gICAgcWMgPSBxLmMgPSBbXSxcclxuICAgIHFpID0gMCxcclxuICAgIHAgPSBkcCArIChxLmUgPSB4LmUgLSB5LmUpICsgMTsgICAgLy8gcHJlY2lzaW9uIG9mIHRoZSByZXN1bHRcclxuXHJcbiAgcS5zID0gaztcclxuICBrID0gcCA8IDAgPyAwIDogcDtcclxuXHJcbiAgLy8gQ3JlYXRlIHZlcnNpb24gb2YgZGl2aXNvciB3aXRoIGxlYWRpbmcgemVyby5cclxuICBiei51bnNoaWZ0KDApO1xyXG5cclxuICAvLyBBZGQgemVyb3MgdG8gbWFrZSByZW1haW5kZXIgYXMgbG9uZyBhcyBkaXZpc29yLlxyXG4gIGZvciAoOyBybCsrIDwgYmw7KSByLnB1c2goMCk7XHJcblxyXG4gIGRvIHtcclxuXHJcbiAgICAvLyBuIGlzIGhvdyBtYW55IHRpbWVzIHRoZSBkaXZpc29yIGdvZXMgaW50byBjdXJyZW50IHJlbWFpbmRlci5cclxuICAgIGZvciAobiA9IDA7IG4gPCAxMDsgbisrKSB7XHJcblxyXG4gICAgICAvLyBDb21wYXJlIGRpdmlzb3IgYW5kIHJlbWFpbmRlci5cclxuICAgICAgaWYgKGJsICE9IChybCA9IHIubGVuZ3RoKSkge1xyXG4gICAgICAgIGNtcCA9IGJsID4gcmwgPyAxIDogLTE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZm9yIChyaSA9IC0xLCBjbXAgPSAwOyArK3JpIDwgYmw7KSB7XHJcbiAgICAgICAgICBpZiAoYltyaV0gIT0gcltyaV0pIHtcclxuICAgICAgICAgICAgY21wID0gYltyaV0gPiByW3JpXSA/IDEgOiAtMTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBJZiBkaXZpc29yIDwgcmVtYWluZGVyLCBzdWJ0cmFjdCBkaXZpc29yIGZyb20gcmVtYWluZGVyLlxyXG4gICAgICBpZiAoY21wIDwgMCkge1xyXG5cclxuICAgICAgICAvLyBSZW1haW5kZXIgY2FuJ3QgYmUgbW9yZSB0aGFuIDEgZGlnaXQgbG9uZ2VyIHRoYW4gZGl2aXNvci5cclxuICAgICAgICAvLyBFcXVhbGlzZSBsZW5ndGhzIHVzaW5nIGRpdmlzb3Igd2l0aCBleHRyYSBsZWFkaW5nIHplcm8/XHJcbiAgICAgICAgZm9yIChidCA9IHJsID09IGJsID8gYiA6IGJ6OyBybDspIHtcclxuICAgICAgICAgIGlmIChyWy0tcmxdIDwgYnRbcmxdKSB7XHJcbiAgICAgICAgICAgIHJpID0gcmw7XHJcbiAgICAgICAgICAgIGZvciAoOyByaSAmJiAhclstLXJpXTspIHJbcmldID0gOTtcclxuICAgICAgICAgICAgLS1yW3JpXTtcclxuICAgICAgICAgICAgcltybF0gKz0gMTA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByW3JsXSAtPSBidFtybF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKDsgIXJbMF07KSByLnNoaWZ0KCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBBZGQgdGhlIGRpZ2l0IG4gdG8gdGhlIHJlc3VsdCBhcnJheS5cclxuICAgIHFjW3FpKytdID0gY21wID8gbiA6ICsrbjtcclxuXHJcbiAgICAvLyBVcGRhdGUgdGhlIHJlbWFpbmRlci5cclxuICAgIGlmIChyWzBdICYmIGNtcCkgcltybF0gPSBhW2FpXSB8fCAwO1xyXG4gICAgZWxzZSByID0gW2FbYWldXTtcclxuXHJcbiAgfSB3aGlsZSAoKGFpKysgPCBhbCB8fCByWzBdICE9PSBVTkRFRklORUQpICYmIGstLSk7XHJcblxyXG4gIC8vIExlYWRpbmcgemVybz8gRG8gbm90IHJlbW92ZSBpZiByZXN1bHQgaXMgc2ltcGx5IHplcm8gKHFpID09IDEpLlxyXG4gIGlmICghcWNbMF0gJiYgcWkgIT0gMSkge1xyXG5cclxuICAgIC8vIFRoZXJlIGNhbid0IGJlIG1vcmUgdGhhbiBvbmUgemVyby5cclxuICAgIHFjLnNoaWZ0KCk7XHJcbiAgICBxLmUtLTtcclxuICAgIHAtLTtcclxuICB9XHJcblxyXG4gIC8vIFJvdW5kP1xyXG4gIGlmIChxaSA+IHApIHJvdW5kKHEsIHAsIEJpZy5STSwgclswXSAhPT0gVU5ERUZJTkVEKTtcclxuXHJcbiAgcmV0dXJuIHE7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIGlzIGVxdWFsIHRvIHRoZSB2YWx1ZSBvZiBCaWcgeSwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cclxuICovXHJcblAuZXEgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHJldHVybiB0aGlzLmNtcCh5KSA9PT0gMDtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgaXMgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZSBvZiBCaWcgeSwgb3RoZXJ3aXNlIHJldHVyblxyXG4gKiBmYWxzZS5cclxuICovXHJcblAuZ3QgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHJldHVybiB0aGlzLmNtcCh5KSA+IDA7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGUgdmFsdWUgb2YgQmlnIHksIG90aGVyd2lzZVxyXG4gKiByZXR1cm4gZmFsc2UuXHJcbiAqL1xyXG5QLmd0ZSA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgcmV0dXJuIHRoaXMuY21wKHkpID4gLTE7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIGlzIGxlc3MgdGhhbiB0aGUgdmFsdWUgb2YgQmlnIHksIG90aGVyd2lzZSByZXR1cm4gZmFsc2UuXHJcbiAqL1xyXG5QLmx0ID0gZnVuY3Rpb24gKHkpIHtcclxuICByZXR1cm4gdGhpcy5jbXAoeSkgPCAwO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHZhbHVlIG9mIEJpZyB5LCBvdGhlcndpc2VcclxuICogcmV0dXJuIGZhbHNlLlxyXG4gKi9cclxuUC5sdGUgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHJldHVybiB0aGlzLmNtcCh5KSA8IDE7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IEJpZyB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgbWludXMgdGhlIHZhbHVlIG9mIEJpZyB5LlxyXG4gKi9cclxuUC5taW51cyA9IFAuc3ViID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgaSwgaiwgdCwgeGx0eSxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQmlnID0geC5jb25zdHJ1Y3RvcixcclxuICAgIGEgPSB4LnMsXHJcbiAgICBiID0gKHkgPSBuZXcgQmlnKHkpKS5zO1xyXG5cclxuICAvLyBTaWducyBkaWZmZXI/XHJcbiAgaWYgKGEgIT0gYikge1xyXG4gICAgeS5zID0gLWI7XHJcbiAgICByZXR1cm4geC5wbHVzKHkpO1xyXG4gIH1cclxuXHJcbiAgdmFyIHhjID0geC5jLnNsaWNlKCksXHJcbiAgICB4ZSA9IHguZSxcclxuICAgIHljID0geS5jLFxyXG4gICAgeWUgPSB5LmU7XHJcblxyXG4gIC8vIEVpdGhlciB6ZXJvP1xyXG4gIGlmICgheGNbMF0gfHwgIXljWzBdKSB7XHJcbiAgICBpZiAoeWNbMF0pIHtcclxuICAgICAgeS5zID0gLWI7XHJcbiAgICB9IGVsc2UgaWYgKHhjWzBdKSB7XHJcbiAgICAgIHkgPSBuZXcgQmlnKHgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgeS5zID0gMTtcclxuICAgIH1cclxuICAgIHJldHVybiB5O1xyXG4gIH1cclxuXHJcbiAgLy8gRGV0ZXJtaW5lIHdoaWNoIGlzIHRoZSBiaWdnZXIgbnVtYmVyLiBQcmVwZW5kIHplcm9zIHRvIGVxdWFsaXNlIGV4cG9uZW50cy5cclxuICBpZiAoYSA9IHhlIC0geWUpIHtcclxuXHJcbiAgICBpZiAoeGx0eSA9IGEgPCAwKSB7XHJcbiAgICAgIGEgPSAtYTtcclxuICAgICAgdCA9IHhjO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgeWUgPSB4ZTtcclxuICAgICAgdCA9IHljO1xyXG4gICAgfVxyXG5cclxuICAgIHQucmV2ZXJzZSgpO1xyXG4gICAgZm9yIChiID0gYTsgYi0tOykgdC5wdXNoKDApO1xyXG4gICAgdC5yZXZlcnNlKCk7XHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICAvLyBFeHBvbmVudHMgZXF1YWwuIENoZWNrIGRpZ2l0IGJ5IGRpZ2l0LlxyXG4gICAgaiA9ICgoeGx0eSA9IHhjLmxlbmd0aCA8IHljLmxlbmd0aCkgPyB4YyA6IHljKS5sZW5ndGg7XHJcblxyXG4gICAgZm9yIChhID0gYiA9IDA7IGIgPCBqOyBiKyspIHtcclxuICAgICAgaWYgKHhjW2JdICE9IHljW2JdKSB7XHJcbiAgICAgICAgeGx0eSA9IHhjW2JdIDwgeWNbYl07XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIHggPCB5PyBQb2ludCB4YyB0byB0aGUgYXJyYXkgb2YgdGhlIGJpZ2dlciBudW1iZXIuXHJcbiAgaWYgKHhsdHkpIHtcclxuICAgIHQgPSB4YztcclxuICAgIHhjID0geWM7XHJcbiAgICB5YyA9IHQ7XHJcbiAgICB5LnMgPSAteS5zO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAgKiBBcHBlbmQgemVyb3MgdG8geGMgaWYgc2hvcnRlci4gTm8gbmVlZCB0byBhZGQgemVyb3MgdG8geWMgaWYgc2hvcnRlciBhcyBzdWJ0cmFjdGlvbiBvbmx5XHJcbiAgICogbmVlZHMgdG8gc3RhcnQgYXQgeWMubGVuZ3RoLlxyXG4gICAqL1xyXG4gIGlmICgoYiA9IChqID0geWMubGVuZ3RoKSAtIChpID0geGMubGVuZ3RoKSkgPiAwKSBmb3IgKDsgYi0tOykgeGNbaSsrXSA9IDA7XHJcblxyXG4gIC8vIFN1YnRyYWN0IHljIGZyb20geGMuXHJcbiAgZm9yIChiID0gaTsgaiA+IGE7KSB7XHJcbiAgICBpZiAoeGNbLS1qXSA8IHljW2pdKSB7XHJcbiAgICAgIGZvciAoaSA9IGo7IGkgJiYgIXhjWy0taV07KSB4Y1tpXSA9IDk7XHJcbiAgICAgIC0teGNbaV07XHJcbiAgICAgIHhjW2pdICs9IDEwO1xyXG4gICAgfVxyXG5cclxuICAgIHhjW2pdIC09IHljW2pdO1xyXG4gIH1cclxuXHJcbiAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gIGZvciAoOyB4Y1stLWJdID09PSAwOykgeGMucG9wKCk7XHJcblxyXG4gIC8vIFJlbW92ZSBsZWFkaW5nIHplcm9zIGFuZCBhZGp1c3QgZXhwb25lbnQgYWNjb3JkaW5nbHkuXHJcbiAgZm9yICg7IHhjWzBdID09PSAwOykge1xyXG4gICAgeGMuc2hpZnQoKTtcclxuICAgIC0teWU7XHJcbiAgfVxyXG5cclxuICBpZiAoIXhjWzBdKSB7XHJcblxyXG4gICAgLy8gbiAtIG4gPSArMFxyXG4gICAgeS5zID0gMTtcclxuXHJcbiAgICAvLyBSZXN1bHQgbXVzdCBiZSB6ZXJvLlxyXG4gICAgeGMgPSBbeWUgPSAwXTtcclxuICB9XHJcblxyXG4gIHkuYyA9IHhjO1xyXG4gIHkuZSA9IHllO1xyXG5cclxuICByZXR1cm4geTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgQmlnIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBtb2R1bG8gdGhlIHZhbHVlIG9mIEJpZyB5LlxyXG4gKi9cclxuUC5tb2QgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHZhciB5Z3R4LFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBCaWcgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgYSA9IHgucyxcclxuICAgIGIgPSAoeSA9IG5ldyBCaWcoeSkpLnM7XHJcblxyXG4gIGlmICgheS5jWzBdKSB7XHJcbiAgICB0aHJvdyBFcnJvcihESVZfQllfWkVSTyk7XHJcbiAgfVxyXG5cclxuICB4LnMgPSB5LnMgPSAxO1xyXG4gIHlndHggPSB5LmNtcCh4KSA9PSAxO1xyXG4gIHgucyA9IGE7XHJcbiAgeS5zID0gYjtcclxuXHJcbiAgaWYgKHlndHgpIHJldHVybiBuZXcgQmlnKHgpO1xyXG5cclxuICBhID0gQmlnLkRQO1xyXG4gIGIgPSBCaWcuUk07XHJcbiAgQmlnLkRQID0gQmlnLlJNID0gMDtcclxuICB4ID0geC5kaXYoeSk7XHJcbiAgQmlnLkRQID0gYTtcclxuICBCaWcuUk0gPSBiO1xyXG5cclxuICByZXR1cm4gdGhpcy5taW51cyh4LnRpbWVzKHkpKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgQmlnIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBuZWdhdGVkLlxyXG4gKi9cclxuUC5uZWcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHggPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKTtcclxuICB4LnMgPSAteC5zO1xyXG4gIHJldHVybiB4O1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBCaWcgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIHBsdXMgdGhlIHZhbHVlIG9mIEJpZyB5LlxyXG4gKi9cclxuUC5wbHVzID0gUC5hZGQgPSBmdW5jdGlvbiAoeSkge1xyXG4gIHZhciBlLCBrLCB0LFxyXG4gICAgeCA9IHRoaXMsXHJcbiAgICBCaWcgPSB4LmNvbnN0cnVjdG9yO1xyXG5cclxuICB5ID0gbmV3IEJpZyh5KTtcclxuXHJcbiAgLy8gU2lnbnMgZGlmZmVyP1xyXG4gIGlmICh4LnMgIT0geS5zKSB7XHJcbiAgICB5LnMgPSAteS5zO1xyXG4gICAgcmV0dXJuIHgubWludXMoeSk7XHJcbiAgfVxyXG5cclxuICB2YXIgeGUgPSB4LmUsXHJcbiAgICB4YyA9IHguYyxcclxuICAgIHllID0geS5lLFxyXG4gICAgeWMgPSB5LmM7XHJcblxyXG4gIC8vIEVpdGhlciB6ZXJvP1xyXG4gIGlmICgheGNbMF0gfHwgIXljWzBdKSB7XHJcbiAgICBpZiAoIXljWzBdKSB7XHJcbiAgICAgIGlmICh4Y1swXSkge1xyXG4gICAgICAgIHkgPSBuZXcgQmlnKHgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHkucyA9IHgucztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHk7XHJcbiAgfVxyXG5cclxuICB4YyA9IHhjLnNsaWNlKCk7XHJcblxyXG4gIC8vIFByZXBlbmQgemVyb3MgdG8gZXF1YWxpc2UgZXhwb25lbnRzLlxyXG4gIC8vIE5vdGU6IHJldmVyc2UgZmFzdGVyIHRoYW4gdW5zaGlmdHMuXHJcbiAgaWYgKGUgPSB4ZSAtIHllKSB7XHJcbiAgICBpZiAoZSA+IDApIHtcclxuICAgICAgeWUgPSB4ZTtcclxuICAgICAgdCA9IHljO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZSA9IC1lO1xyXG4gICAgICB0ID0geGM7XHJcbiAgICB9XHJcblxyXG4gICAgdC5yZXZlcnNlKCk7XHJcbiAgICBmb3IgKDsgZS0tOykgdC5wdXNoKDApO1xyXG4gICAgdC5yZXZlcnNlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBQb2ludCB4YyB0byB0aGUgbG9uZ2VyIGFycmF5LlxyXG4gIGlmICh4Yy5sZW5ndGggLSB5Yy5sZW5ndGggPCAwKSB7XHJcbiAgICB0ID0geWM7XHJcbiAgICB5YyA9IHhjO1xyXG4gICAgeGMgPSB0O1xyXG4gIH1cclxuXHJcbiAgZSA9IHljLmxlbmd0aDtcclxuXHJcbiAgLy8gT25seSBzdGFydCBhZGRpbmcgYXQgeWMubGVuZ3RoIC0gMSBhcyB0aGUgZnVydGhlciBkaWdpdHMgb2YgeGMgY2FuIGJlIGxlZnQgYXMgdGhleSBhcmUuXHJcbiAgZm9yIChrID0gMDsgZTsgeGNbZV0gJT0gMTApIGsgPSAoeGNbLS1lXSA9IHhjW2VdICsgeWNbZV0gKyBrKSAvIDEwIHwgMDtcclxuXHJcbiAgLy8gTm8gbmVlZCB0byBjaGVjayBmb3IgemVybywgYXMgK3ggKyAreSAhPSAwICYmIC14ICsgLXkgIT0gMFxyXG5cclxuICBpZiAoaykge1xyXG4gICAgeGMudW5zaGlmdChrKTtcclxuICAgICsreWU7XHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgZm9yIChlID0geGMubGVuZ3RoOyB4Y1stLWVdID09PSAwOykgeGMucG9wKCk7XHJcblxyXG4gIHkuYyA9IHhjO1xyXG4gIHkuZSA9IHllO1xyXG5cclxuICByZXR1cm4geTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBCaWcgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIHJhaXNlZCB0byB0aGUgcG93ZXIgbi5cclxuICogSWYgbiBpcyBuZWdhdGl2ZSwgcm91bmQgdG8gYSBtYXhpbXVtIG9mIEJpZy5EUCBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZ1xyXG4gKiBtb2RlIEJpZy5STS5cclxuICpcclxuICogbiB7bnVtYmVyfSBJbnRlZ2VyLCAtTUFYX1BPV0VSIHRvIE1BWF9QT1dFUiBpbmNsdXNpdmUuXHJcbiAqL1xyXG5QLnBvdyA9IGZ1bmN0aW9uIChuKSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgb25lID0gbmV3IHguY29uc3RydWN0b3IoJzEnKSxcclxuICAgIHkgPSBvbmUsXHJcbiAgICBpc25lZyA9IG4gPCAwO1xyXG5cclxuICBpZiAobiAhPT0gfn5uIHx8IG4gPCAtTUFYX1BPV0VSIHx8IG4gPiBNQVhfUE9XRVIpIHtcclxuICAgIHRocm93IEVycm9yKElOVkFMSUQgKyAnZXhwb25lbnQnKTtcclxuICB9XHJcblxyXG4gIGlmIChpc25lZykgbiA9IC1uO1xyXG5cclxuICBmb3IgKDs7KSB7XHJcbiAgICBpZiAobiAmIDEpIHkgPSB5LnRpbWVzKHgpO1xyXG4gICAgbiA+Pj0gMTtcclxuICAgIGlmICghbikgYnJlYWs7XHJcbiAgICB4ID0geC50aW1lcyh4KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBpc25lZyA/IG9uZS5kaXYoeSkgOiB5O1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIG5ldyBCaWcgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIHJvdW5kZWQgdG8gYSBtYXhpbXVtIHByZWNpc2lvbiBvZiBzZFxyXG4gKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgcm91bmRpbmcgbW9kZSBybSwgb3IgQmlnLlJNIGlmIHJtIGlzIG5vdCBzcGVjaWZpZWQuXHJcbiAqXHJcbiAqIHNkIHtudW1iZXJ9IFNpZ25pZmljYW50IGRpZ2l0czogaW50ZWdlciwgMSB0byBNQVhfRFAgaW5jbHVzaXZlLlxyXG4gKiBybT8ge251bWJlcn0gUm91bmRpbmcgbW9kZTogMCAoZG93biksIDEgKGhhbGYtdXApLCAyIChoYWxmLWV2ZW4pIG9yIDMgKHVwKS5cclxuICovXHJcblAucHJlYyA9IGZ1bmN0aW9uIChzZCwgcm0pIHtcclxuICBpZiAoc2QgIT09IH5+c2QgfHwgc2QgPCAxIHx8IHNkID4gTUFYX0RQKSB7XHJcbiAgICB0aHJvdyBFcnJvcihJTlZBTElEICsgJ3ByZWNpc2lvbicpO1xyXG4gIH1cclxuICByZXR1cm4gcm91bmQobmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyksIHNkLCBybSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IEJpZyB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgcm91bmRlZCB0byBhIG1heGltdW0gb2YgZHAgZGVjaW1hbCBwbGFjZXNcclxuICogdXNpbmcgcm91bmRpbmcgbW9kZSBybSwgb3IgQmlnLlJNIGlmIHJtIGlzIG5vdCBzcGVjaWZpZWQuXHJcbiAqIElmIGRwIGlzIG5lZ2F0aXZlLCByb3VuZCB0byBhbiBpbnRlZ2VyIHdoaWNoIGlzIGEgbXVsdGlwbGUgb2YgMTAqKi1kcC5cclxuICogSWYgZHAgaXMgbm90IHNwZWNpZmllZCwgcm91bmQgdG8gMCBkZWNpbWFsIHBsYWNlcy5cclxuICpcclxuICogZHA/IHtudW1iZXJ9IEludGVnZXIsIC1NQVhfRFAgdG8gTUFYX0RQIGluY2x1c2l2ZS5cclxuICogcm0/IHtudW1iZXJ9IFJvdW5kaW5nIG1vZGU6IDAgKGRvd24pLCAxIChoYWxmLXVwKSwgMiAoaGFsZi1ldmVuKSBvciAzICh1cCkuXHJcbiAqL1xyXG5QLnJvdW5kID0gZnVuY3Rpb24gKGRwLCBybSkge1xyXG4gIGlmIChkcCA9PT0gVU5ERUZJTkVEKSBkcCA9IDA7XHJcbiAgZWxzZSBpZiAoZHAgIT09IH5+ZHAgfHwgZHAgPCAtTUFYX0RQIHx8IGRwID4gTUFYX0RQKSB7XHJcbiAgICB0aHJvdyBFcnJvcihJTlZBTElEX0RQKTtcclxuICB9XHJcbiAgcmV0dXJuIHJvdW5kKG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpLCBkcCArIHRoaXMuZSArIDEsIHJtKTtcclxufTtcclxuXHJcblxyXG4vKlxyXG4gKiBSZXR1cm4gYSBuZXcgQmlnIHdob3NlIHZhbHVlIGlzIHRoZSBzcXVhcmUgcm9vdCBvZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWcsIHJvdW5kZWQsIGlmXHJcbiAqIG5lY2Vzc2FyeSwgdG8gYSBtYXhpbXVtIG9mIEJpZy5EUCBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIEJpZy5STS5cclxuICovXHJcblAuc3FydCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgciwgYywgdCxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQmlnID0geC5jb25zdHJ1Y3RvcixcclxuICAgIHMgPSB4LnMsXHJcbiAgICBlID0geC5lLFxyXG4gICAgaGFsZiA9IG5ldyBCaWcoJzAuNScpO1xyXG5cclxuICAvLyBaZXJvP1xyXG4gIGlmICgheC5jWzBdKSByZXR1cm4gbmV3IEJpZyh4KTtcclxuXHJcbiAgLy8gTmVnYXRpdmU/XHJcbiAgaWYgKHMgPCAwKSB7XHJcbiAgICB0aHJvdyBFcnJvcihOQU1FICsgJ05vIHNxdWFyZSByb290Jyk7XHJcbiAgfVxyXG5cclxuICAvLyBFc3RpbWF0ZS5cclxuICBzID0gTWF0aC5zcXJ0KCtzdHJpbmdpZnkoeCwgdHJ1ZSwgdHJ1ZSkpO1xyXG5cclxuICAvLyBNYXRoLnNxcnQgdW5kZXJmbG93L292ZXJmbG93P1xyXG4gIC8vIFJlLWVzdGltYXRlOiBwYXNzIHggY29lZmZpY2llbnQgdG8gTWF0aC5zcXJ0IGFzIGludGVnZXIsIHRoZW4gYWRqdXN0IHRoZSByZXN1bHQgZXhwb25lbnQuXHJcbiAgaWYgKHMgPT09IDAgfHwgcyA9PT0gMSAvIDApIHtcclxuICAgIGMgPSB4LmMuam9pbignJyk7XHJcbiAgICBpZiAoIShjLmxlbmd0aCArIGUgJiAxKSkgYyArPSAnMCc7XHJcbiAgICBzID0gTWF0aC5zcXJ0KGMpO1xyXG4gICAgZSA9ICgoZSArIDEpIC8gMiB8IDApIC0gKGUgPCAwIHx8IGUgJiAxKTtcclxuICAgIHIgPSBuZXcgQmlnKChzID09IDEgLyAwID8gJzVlJyA6IChzID0gcy50b0V4cG9uZW50aWFsKCkpLnNsaWNlKDAsIHMuaW5kZXhPZignZScpICsgMSkpICsgZSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHIgPSBuZXcgQmlnKHMgKyAnJyk7XHJcbiAgfVxyXG5cclxuICBlID0gci5lICsgKEJpZy5EUCArPSA0KTtcclxuXHJcbiAgLy8gTmV3dG9uLVJhcGhzb24gaXRlcmF0aW9uLlxyXG4gIGRvIHtcclxuICAgIHQgPSByO1xyXG4gICAgciA9IGhhbGYudGltZXModC5wbHVzKHguZGl2KHQpKSk7XHJcbiAgfSB3aGlsZSAodC5jLnNsaWNlKDAsIGUpLmpvaW4oJycpICE9PSByLmMuc2xpY2UoMCwgZSkuam9pbignJykpO1xyXG5cclxuICByZXR1cm4gcm91bmQociwgKEJpZy5EUCAtPSA0KSArIHIuZSArIDEsIEJpZy5STSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgbmV3IEJpZyB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgdGltZXMgdGhlIHZhbHVlIG9mIEJpZyB5LlxyXG4gKi9cclxuUC50aW1lcyA9IFAubXVsID0gZnVuY3Rpb24gKHkpIHtcclxuICB2YXIgYyxcclxuICAgIHggPSB0aGlzLFxyXG4gICAgQmlnID0geC5jb25zdHJ1Y3RvcixcclxuICAgIHhjID0geC5jLFxyXG4gICAgeWMgPSAoeSA9IG5ldyBCaWcoeSkpLmMsXHJcbiAgICBhID0geGMubGVuZ3RoLFxyXG4gICAgYiA9IHljLmxlbmd0aCxcclxuICAgIGkgPSB4LmUsXHJcbiAgICBqID0geS5lO1xyXG5cclxuICAvLyBEZXRlcm1pbmUgc2lnbiBvZiByZXN1bHQuXHJcbiAgeS5zID0geC5zID09IHkucyA/IDEgOiAtMTtcclxuXHJcbiAgLy8gUmV0dXJuIHNpZ25lZCAwIGlmIGVpdGhlciAwLlxyXG4gIGlmICgheGNbMF0gfHwgIXljWzBdKSB7XHJcbiAgICB5LmMgPSBbeS5lID0gMF07XHJcbiAgICByZXR1cm4geTtcclxuICB9XHJcblxyXG4gIC8vIEluaXRpYWxpc2UgZXhwb25lbnQgb2YgcmVzdWx0IGFzIHguZSArIHkuZS5cclxuICB5LmUgPSBpICsgajtcclxuXHJcbiAgLy8gSWYgYXJyYXkgeGMgaGFzIGZld2VyIGRpZ2l0cyB0aGFuIHljLCBzd2FwIHhjIGFuZCB5YywgYW5kIGxlbmd0aHMuXHJcbiAgaWYgKGEgPCBiKSB7XHJcbiAgICBjID0geGM7XHJcbiAgICB4YyA9IHljO1xyXG4gICAgeWMgPSBjO1xyXG4gICAgaiA9IGE7XHJcbiAgICBhID0gYjtcclxuICAgIGIgPSBqO1xyXG4gIH1cclxuXHJcbiAgLy8gSW5pdGlhbGlzZSBjb2VmZmljaWVudCBhcnJheSBvZiByZXN1bHQgd2l0aCB6ZXJvcy5cclxuICBmb3IgKGMgPSBuZXcgQXJyYXkoaiA9IGEgKyBiKTsgai0tOykgY1tqXSA9IDA7XHJcblxyXG4gIC8vIE11bHRpcGx5LlxyXG5cclxuICAvLyBpIGlzIGluaXRpYWxseSB4Yy5sZW5ndGguXHJcbiAgZm9yIChpID0gYjsgaS0tOykge1xyXG4gICAgYiA9IDA7XHJcblxyXG4gICAgLy8gYSBpcyB5Yy5sZW5ndGguXHJcbiAgICBmb3IgKGogPSBhICsgaTsgaiA+IGk7KSB7XHJcblxyXG4gICAgICAvLyBDdXJyZW50IHN1bSBvZiBwcm9kdWN0cyBhdCB0aGlzIGRpZ2l0IHBvc2l0aW9uLCBwbHVzIGNhcnJ5LlxyXG4gICAgICBiID0gY1tqXSArIHljW2ldICogeGNbaiAtIGkgLSAxXSArIGI7XHJcbiAgICAgIGNbai0tXSA9IGIgJSAxMDtcclxuXHJcbiAgICAgIC8vIGNhcnJ5XHJcbiAgICAgIGIgPSBiIC8gMTAgfCAwO1xyXG4gICAgfVxyXG5cclxuICAgIGNbal0gPSBiO1xyXG4gIH1cclxuXHJcbiAgLy8gSW5jcmVtZW50IHJlc3VsdCBleHBvbmVudCBpZiB0aGVyZSBpcyBhIGZpbmFsIGNhcnJ5LCBvdGhlcndpc2UgcmVtb3ZlIGxlYWRpbmcgemVyby5cclxuICBpZiAoYikgKyt5LmU7XHJcbiAgZWxzZSBjLnNoaWZ0KCk7XHJcblxyXG4gIC8vIFJlbW92ZSB0cmFpbGluZyB6ZXJvcy5cclxuICBmb3IgKGkgPSBjLmxlbmd0aDsgIWNbLS1pXTspIGMucG9wKCk7XHJcbiAgeS5jID0gYztcclxuXHJcbiAgcmV0dXJuIHk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgaW4gZXhwb25lbnRpYWwgbm90YXRpb24gcm91bmRlZCB0byBkcCBmaXhlZFxyXG4gKiBkZWNpbWFsIHBsYWNlcyB1c2luZyByb3VuZGluZyBtb2RlIHJtLCBvciBCaWcuUk0gaWYgcm0gaXMgbm90IHNwZWNpZmllZC5cclxuICpcclxuICogZHA/IHtudW1iZXJ9IERlY2ltYWwgcGxhY2VzOiBpbnRlZ2VyLCAwIHRvIE1BWF9EUCBpbmNsdXNpdmUuXHJcbiAqIHJtPyB7bnVtYmVyfSBSb3VuZGluZyBtb2RlOiAwIChkb3duKSwgMSAoaGFsZi11cCksIDIgKGhhbGYtZXZlbikgb3IgMyAodXApLlxyXG4gKi9cclxuUC50b0V4cG9uZW50aWFsID0gZnVuY3Rpb24gKGRwLCBybSkge1xyXG4gIHZhciB4ID0gdGhpcyxcclxuICAgIG4gPSB4LmNbMF07XHJcblxyXG4gIGlmIChkcCAhPT0gVU5ERUZJTkVEKSB7XHJcbiAgICBpZiAoZHAgIT09IH5+ZHAgfHwgZHAgPCAwIHx8IGRwID4gTUFYX0RQKSB7XHJcbiAgICAgIHRocm93IEVycm9yKElOVkFMSURfRFApO1xyXG4gICAgfVxyXG4gICAgeCA9IHJvdW5kKG5ldyB4LmNvbnN0cnVjdG9yKHgpLCArK2RwLCBybSk7XHJcbiAgICBmb3IgKDsgeC5jLmxlbmd0aCA8IGRwOykgeC5jLnB1c2goMCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gc3RyaW5naWZ5KHgsIHRydWUsICEhbik7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgaW4gbm9ybWFsIG5vdGF0aW9uIHJvdW5kZWQgdG8gZHAgZml4ZWRcclxuICogZGVjaW1hbCBwbGFjZXMgdXNpbmcgcm91bmRpbmcgbW9kZSBybSwgb3IgQmlnLlJNIGlmIHJtIGlzIG5vdCBzcGVjaWZpZWQuXHJcbiAqXHJcbiAqIGRwPyB7bnVtYmVyfSBEZWNpbWFsIHBsYWNlczogaW50ZWdlciwgMCB0byBNQVhfRFAgaW5jbHVzaXZlLlxyXG4gKiBybT8ge251bWJlcn0gUm91bmRpbmcgbW9kZTogMCAoZG93biksIDEgKGhhbGYtdXApLCAyIChoYWxmLWV2ZW4pIG9yIDMgKHVwKS5cclxuICpcclxuICogKC0wKS50b0ZpeGVkKDApIGlzICcwJywgYnV0ICgtMC4xKS50b0ZpeGVkKDApIGlzICctMCcuXHJcbiAqICgtMCkudG9GaXhlZCgxKSBpcyAnMC4wJywgYnV0ICgtMC4wMSkudG9GaXhlZCgxKSBpcyAnLTAuMCcuXHJcbiAqL1xyXG5QLnRvRml4ZWQgPSBmdW5jdGlvbiAoZHAsIHJtKSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgbiA9IHguY1swXTtcclxuXHJcbiAgaWYgKGRwICE9PSBVTkRFRklORUQpIHtcclxuICAgIGlmIChkcCAhPT0gfn5kcCB8fCBkcCA8IDAgfHwgZHAgPiBNQVhfRFApIHtcclxuICAgICAgdGhyb3cgRXJyb3IoSU5WQUxJRF9EUCk7XHJcbiAgICB9XHJcbiAgICB4ID0gcm91bmQobmV3IHguY29uc3RydWN0b3IoeCksIGRwICsgeC5lICsgMSwgcm0pO1xyXG5cclxuICAgIC8vIHguZSBtYXkgaGF2ZSBjaGFuZ2VkIGlmIHRoZSB2YWx1ZSBpcyByb3VuZGVkIHVwLlxyXG4gICAgZm9yIChkcCA9IGRwICsgeC5lICsgMTsgeC5jLmxlbmd0aCA8IGRwOykgeC5jLnB1c2goMCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gc3RyaW5naWZ5KHgsIGZhbHNlLCAhIW4pO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgQmlnLlxyXG4gKiBSZXR1cm4gZXhwb25lbnRpYWwgbm90YXRpb24gaWYgdGhpcyBCaWcgaGFzIGEgcG9zaXRpdmUgZXhwb25lbnQgZXF1YWwgdG8gb3IgZ3JlYXRlciB0aGFuXHJcbiAqIEJpZy5QRSwgb3IgYSBuZWdhdGl2ZSBleHBvbmVudCBlcXVhbCB0byBvciBsZXNzIHRoYW4gQmlnLk5FLlxyXG4gKiBPbWl0IHRoZSBzaWduIGZvciBuZWdhdGl2ZSB6ZXJvLlxyXG4gKi9cclxuUFtTeW1ib2wuZm9yKCdub2RlanMudXRpbC5pbnNwZWN0LmN1c3RvbScpXSA9IFAudG9KU09OID0gUC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgeCA9IHRoaXMsXHJcbiAgICBCaWcgPSB4LmNvbnN0cnVjdG9yO1xyXG4gIHJldHVybiBzdHJpbmdpZnkoeCwgeC5lIDw9IEJpZy5ORSB8fCB4LmUgPj0gQmlnLlBFLCAhIXguY1swXSk7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBhcyBhIHByaW1pdHZlIG51bWJlci5cclxuICovXHJcblAudG9OdW1iZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIG4gPSArc3RyaW5naWZ5KHRoaXMsIHRydWUsIHRydWUpO1xyXG4gIGlmICh0aGlzLmNvbnN0cnVjdG9yLnN0cmljdCA9PT0gdHJ1ZSAmJiAhdGhpcy5lcShuLnRvU3RyaW5nKCkpKSB7XHJcbiAgICB0aHJvdyBFcnJvcihOQU1FICsgJ0ltcHJlY2lzZSBjb252ZXJzaW9uJyk7XHJcbiAgfVxyXG4gIHJldHVybiBuO1xyXG59O1xyXG5cclxuXHJcbi8qXHJcbiAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIHJvdW5kZWQgdG8gc2Qgc2lnbmlmaWNhbnQgZGlnaXRzIHVzaW5nXHJcbiAqIHJvdW5kaW5nIG1vZGUgcm0sIG9yIEJpZy5STSBpZiBybSBpcyBub3Qgc3BlY2lmaWVkLlxyXG4gKiBVc2UgZXhwb25lbnRpYWwgbm90YXRpb24gaWYgc2QgaXMgbGVzcyB0aGFuIHRoZSBudW1iZXIgb2YgZGlnaXRzIG5lY2Vzc2FyeSB0byByZXByZXNlbnRcclxuICogdGhlIGludGVnZXIgcGFydCBvZiB0aGUgdmFsdWUgaW4gbm9ybWFsIG5vdGF0aW9uLlxyXG4gKlxyXG4gKiBzZCB7bnVtYmVyfSBTaWduaWZpY2FudCBkaWdpdHM6IGludGVnZXIsIDEgdG8gTUFYX0RQIGluY2x1c2l2ZS5cclxuICogcm0/IHtudW1iZXJ9IFJvdW5kaW5nIG1vZGU6IDAgKGRvd24pLCAxIChoYWxmLXVwKSwgMiAoaGFsZi1ldmVuKSBvciAzICh1cCkuXHJcbiAqL1xyXG5QLnRvUHJlY2lzaW9uID0gZnVuY3Rpb24gKHNkLCBybSkge1xyXG4gIHZhciB4ID0gdGhpcyxcclxuICAgIEJpZyA9IHguY29uc3RydWN0b3IsXHJcbiAgICBuID0geC5jWzBdO1xyXG5cclxuICBpZiAoc2QgIT09IFVOREVGSU5FRCkge1xyXG4gICAgaWYgKHNkICE9PSB+fnNkIHx8IHNkIDwgMSB8fCBzZCA+IE1BWF9EUCkge1xyXG4gICAgICB0aHJvdyBFcnJvcihJTlZBTElEICsgJ3ByZWNpc2lvbicpO1xyXG4gICAgfVxyXG4gICAgeCA9IHJvdW5kKG5ldyBCaWcoeCksIHNkLCBybSk7XHJcbiAgICBmb3IgKDsgeC5jLmxlbmd0aCA8IHNkOykgeC5jLnB1c2goMCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gc3RyaW5naWZ5KHgsIHNkIDw9IHguZSB8fCB4LmUgPD0gQmlnLk5FIHx8IHguZSA+PSBCaWcuUEUsICEhbik7XHJcbn07XHJcblxyXG5cclxuLypcclxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcuXHJcbiAqIFJldHVybiBleHBvbmVudGlhbCBub3RhdGlvbiBpZiB0aGlzIEJpZyBoYXMgYSBwb3NpdGl2ZSBleHBvbmVudCBlcXVhbCB0byBvciBncmVhdGVyIHRoYW5cclxuICogQmlnLlBFLCBvciBhIG5lZ2F0aXZlIGV4cG9uZW50IGVxdWFsIHRvIG9yIGxlc3MgdGhhbiBCaWcuTkUuXHJcbiAqIEluY2x1ZGUgdGhlIHNpZ24gZm9yIG5lZ2F0aXZlIHplcm8uXHJcbiAqL1xyXG5QLnZhbHVlT2YgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHggPSB0aGlzLFxyXG4gICAgQmlnID0geC5jb25zdHJ1Y3RvcjtcclxuICBpZiAoQmlnLnN0cmljdCA9PT0gdHJ1ZSkge1xyXG4gICAgdGhyb3cgRXJyb3IoTkFNRSArICd2YWx1ZU9mIGRpc2FsbG93ZWQnKTtcclxuICB9XHJcbiAgcmV0dXJuIHN0cmluZ2lmeSh4LCB4LmUgPD0gQmlnLk5FIHx8IHguZSA+PSBCaWcuUEUsIHRydWUpO1xyXG59O1xyXG5cclxuXHJcbi8vIEV4cG9ydFxyXG5cclxuXHJcbmV4cG9ydCB2YXIgQmlnID0gX0JpZ18oKTtcclxuXHJcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0RlZmluaXRlbHlUeXBlZC9EZWZpbml0ZWx5VHlwZWQvbWFzdGVyL3R5cGVzL2JpZy5qcy9pbmRleC5kLnRzXCIgLz5cclxuZXhwb3J0IGRlZmF1bHQgQmlnO1xyXG4iLCJ2YXIgY2hhcmFjdGVyTWFwID0ge1xuXHRcIsOAXCI6IFwiQVwiLFxuXHRcIsOBXCI6IFwiQVwiLFxuXHRcIsOCXCI6IFwiQVwiLFxuXHRcIsODXCI6IFwiQVwiLFxuXHRcIsOEXCI6IFwiQVwiLFxuXHRcIsOFXCI6IFwiQVwiLFxuXHRcIuG6pFwiOiBcIkFcIixcblx0XCLhuq5cIjogXCJBXCIsXG5cdFwi4bqyXCI6IFwiQVwiLFxuXHRcIuG6tFwiOiBcIkFcIixcblx0XCLhurZcIjogXCJBXCIsXG5cdFwiw4ZcIjogXCJBRVwiLFxuXHRcIuG6plwiOiBcIkFcIixcblx0XCLhurBcIjogXCJBXCIsXG5cdFwiyIJcIjogXCJBXCIsXG5cdFwi4bqiXCI6IFwiQVwiLFxuXHRcIuG6oFwiOiBcIkFcIixcblx0XCLhuqhcIjogXCJBXCIsXG5cdFwi4bqqXCI6IFwiQVwiLFxuXHRcIuG6rFwiOiBcIkFcIixcblx0XCLDh1wiOiBcIkNcIixcblx0XCLhuIhcIjogXCJDXCIsXG5cdFwiw4hcIjogXCJFXCIsXG5cdFwiw4lcIjogXCJFXCIsXG5cdFwiw4pcIjogXCJFXCIsXG5cdFwiw4tcIjogXCJFXCIsXG5cdFwi4bq+XCI6IFwiRVwiLFxuXHRcIuG4llwiOiBcIkVcIixcblx0XCLhu4BcIjogXCJFXCIsXG5cdFwi4biUXCI6IFwiRVwiLFxuXHRcIuG4nFwiOiBcIkVcIixcblx0XCLIhlwiOiBcIkVcIixcblx0XCLhurpcIjogXCJFXCIsXG5cdFwi4bq8XCI6IFwiRVwiLFxuXHRcIuG6uFwiOiBcIkVcIixcblx0XCLhu4JcIjogXCJFXCIsXG5cdFwi4buEXCI6IFwiRVwiLFxuXHRcIuG7hlwiOiBcIkVcIixcblx0XCLDjFwiOiBcIklcIixcblx0XCLDjVwiOiBcIklcIixcblx0XCLDjlwiOiBcIklcIixcblx0XCLDj1wiOiBcIklcIixcblx0XCLhuK5cIjogXCJJXCIsXG5cdFwiyIpcIjogXCJJXCIsXG5cdFwi4buIXCI6IFwiSVwiLFxuXHRcIuG7ilwiOiBcIklcIixcblx0XCLDkFwiOiBcIkRcIixcblx0XCLDkVwiOiBcIk5cIixcblx0XCLDklwiOiBcIk9cIixcblx0XCLDk1wiOiBcIk9cIixcblx0XCLDlFwiOiBcIk9cIixcblx0XCLDlVwiOiBcIk9cIixcblx0XCLDllwiOiBcIk9cIixcblx0XCLDmFwiOiBcIk9cIixcblx0XCLhu5BcIjogXCJPXCIsXG5cdFwi4bmMXCI6IFwiT1wiLFxuXHRcIuG5klwiOiBcIk9cIixcblx0XCLIjlwiOiBcIk9cIixcblx0XCLhu45cIjogXCJPXCIsXG5cdFwi4buMXCI6IFwiT1wiLFxuXHRcIuG7lFwiOiBcIk9cIixcblx0XCLhu5ZcIjogXCJPXCIsXG5cdFwi4buYXCI6IFwiT1wiLFxuXHRcIuG7nFwiOiBcIk9cIixcblx0XCLhu55cIjogXCJPXCIsXG5cdFwi4bugXCI6IFwiT1wiLFxuXHRcIuG7mlwiOiBcIk9cIixcblx0XCLhu6JcIjogXCJPXCIsXG5cdFwiw5lcIjogXCJVXCIsXG5cdFwiw5pcIjogXCJVXCIsXG5cdFwiw5tcIjogXCJVXCIsXG5cdFwiw5xcIjogXCJVXCIsXG5cdFwi4bumXCI6IFwiVVwiLFxuXHRcIuG7pFwiOiBcIlVcIixcblx0XCLhu6xcIjogXCJVXCIsXG5cdFwi4buuXCI6IFwiVVwiLFxuXHRcIuG7sFwiOiBcIlVcIixcblx0XCLDnVwiOiBcIllcIixcblx0XCLDoFwiOiBcImFcIixcblx0XCLDoVwiOiBcImFcIixcblx0XCLDolwiOiBcImFcIixcblx0XCLDo1wiOiBcImFcIixcblx0XCLDpFwiOiBcImFcIixcblx0XCLDpVwiOiBcImFcIixcblx0XCLhuqVcIjogXCJhXCIsXG5cdFwi4bqvXCI6IFwiYVwiLFxuXHRcIuG6s1wiOiBcImFcIixcblx0XCLhurVcIjogXCJhXCIsXG5cdFwi4bq3XCI6IFwiYVwiLFxuXHRcIsOmXCI6IFwiYWVcIixcblx0XCLhuqdcIjogXCJhXCIsXG5cdFwi4bqxXCI6IFwiYVwiLFxuXHRcIsiDXCI6IFwiYVwiLFxuXHRcIuG6o1wiOiBcImFcIixcblx0XCLhuqFcIjogXCJhXCIsXG5cdFwi4bqpXCI6IFwiYVwiLFxuXHRcIuG6q1wiOiBcImFcIixcblx0XCLhuq1cIjogXCJhXCIsXG5cdFwiw6dcIjogXCJjXCIsXG5cdFwi4biJXCI6IFwiY1wiLFxuXHRcIsOoXCI6IFwiZVwiLFxuXHRcIsOpXCI6IFwiZVwiLFxuXHRcIsOqXCI6IFwiZVwiLFxuXHRcIsOrXCI6IFwiZVwiLFxuXHRcIuG6v1wiOiBcImVcIixcblx0XCLhuJdcIjogXCJlXCIsXG5cdFwi4buBXCI6IFwiZVwiLFxuXHRcIuG4lVwiOiBcImVcIixcblx0XCLhuJ1cIjogXCJlXCIsXG5cdFwiyIdcIjogXCJlXCIsXG5cdFwi4bq7XCI6IFwiZVwiLFxuXHRcIuG6vVwiOiBcImVcIixcblx0XCLhurlcIjogXCJlXCIsXG5cdFwi4buDXCI6IFwiZVwiLFxuXHRcIuG7hVwiOiBcImVcIixcblx0XCLhu4dcIjogXCJlXCIsXG5cdFwiw6xcIjogXCJpXCIsXG5cdFwiw61cIjogXCJpXCIsXG5cdFwiw65cIjogXCJpXCIsXG5cdFwiw69cIjogXCJpXCIsXG5cdFwi4bivXCI6IFwiaVwiLFxuXHRcIsiLXCI6IFwiaVwiLFxuXHRcIuG7iVwiOiBcImlcIixcblx0XCLhu4tcIjogXCJpXCIsXG5cdFwiw7BcIjogXCJkXCIsXG5cdFwiw7FcIjogXCJuXCIsXG5cdFwiw7JcIjogXCJvXCIsXG5cdFwiw7NcIjogXCJvXCIsXG5cdFwiw7RcIjogXCJvXCIsXG5cdFwiw7VcIjogXCJvXCIsXG5cdFwiw7ZcIjogXCJvXCIsXG5cdFwiw7hcIjogXCJvXCIsXG5cdFwi4buRXCI6IFwib1wiLFxuXHRcIuG5jVwiOiBcIm9cIixcblx0XCLhuZNcIjogXCJvXCIsXG5cdFwiyI9cIjogXCJvXCIsXG5cdFwi4buPXCI6IFwib1wiLFxuXHRcIuG7jVwiOiBcIm9cIixcblx0XCLhu5VcIjogXCJvXCIsXG5cdFwi4buXXCI6IFwib1wiLFxuXHRcIuG7mVwiOiBcIm9cIixcblx0XCLhu51cIjogXCJvXCIsXG5cdFwi4bufXCI6IFwib1wiLFxuXHRcIuG7oVwiOiBcIm9cIixcblx0XCLhu5tcIjogXCJvXCIsXG5cdFwi4bujXCI6IFwib1wiLFxuXHRcIsO5XCI6IFwidVwiLFxuXHRcIsO6XCI6IFwidVwiLFxuXHRcIsO7XCI6IFwidVwiLFxuXHRcIsO8XCI6IFwidVwiLFxuXHRcIuG7p1wiOiBcInVcIixcblx0XCLhu6VcIjogXCJ1XCIsXG5cdFwi4butXCI6IFwidVwiLFxuXHRcIuG7r1wiOiBcInVcIixcblx0XCLhu7FcIjogXCJ1XCIsXG5cdFwiw71cIjogXCJ5XCIsXG5cdFwiw79cIjogXCJ5XCIsXG5cdFwixIBcIjogXCJBXCIsXG5cdFwixIFcIjogXCJhXCIsXG5cdFwixIJcIjogXCJBXCIsXG5cdFwixINcIjogXCJhXCIsXG5cdFwixIRcIjogXCJBXCIsXG5cdFwixIVcIjogXCJhXCIsXG5cdFwixIZcIjogXCJDXCIsXG5cdFwixIdcIjogXCJjXCIsXG5cdFwixIhcIjogXCJDXCIsXG5cdFwixIlcIjogXCJjXCIsXG5cdFwixIpcIjogXCJDXCIsXG5cdFwixItcIjogXCJjXCIsXG5cdFwixIxcIjogXCJDXCIsXG5cdFwixI1cIjogXCJjXCIsXG5cdFwiQ8yGXCI6IFwiQ1wiLFxuXHRcImPMhlwiOiBcImNcIixcblx0XCLEjlwiOiBcIkRcIixcblx0XCLEj1wiOiBcImRcIixcblx0XCLEkFwiOiBcIkRcIixcblx0XCLEkVwiOiBcImRcIixcblx0XCLEklwiOiBcIkVcIixcblx0XCLEk1wiOiBcImVcIixcblx0XCLElFwiOiBcIkVcIixcblx0XCLElVwiOiBcImVcIixcblx0XCLEllwiOiBcIkVcIixcblx0XCLEl1wiOiBcImVcIixcblx0XCLEmFwiOiBcIkVcIixcblx0XCLEmVwiOiBcImVcIixcblx0XCLEmlwiOiBcIkVcIixcblx0XCLEm1wiOiBcImVcIixcblx0XCLEnFwiOiBcIkdcIixcblx0XCLHtFwiOiBcIkdcIixcblx0XCLEnVwiOiBcImdcIixcblx0XCLHtVwiOiBcImdcIixcblx0XCLEnlwiOiBcIkdcIixcblx0XCLEn1wiOiBcImdcIixcblx0XCLEoFwiOiBcIkdcIixcblx0XCLEoVwiOiBcImdcIixcblx0XCLEolwiOiBcIkdcIixcblx0XCLEo1wiOiBcImdcIixcblx0XCLEpFwiOiBcIkhcIixcblx0XCLEpVwiOiBcImhcIixcblx0XCLEplwiOiBcIkhcIixcblx0XCLEp1wiOiBcImhcIixcblx0XCLhuKpcIjogXCJIXCIsXG5cdFwi4birXCI6IFwiaFwiLFxuXHRcIsSoXCI6IFwiSVwiLFxuXHRcIsSpXCI6IFwiaVwiLFxuXHRcIsSqXCI6IFwiSVwiLFxuXHRcIsSrXCI6IFwiaVwiLFxuXHRcIsSsXCI6IFwiSVwiLFxuXHRcIsStXCI6IFwiaVwiLFxuXHRcIsSuXCI6IFwiSVwiLFxuXHRcIsSvXCI6IFwiaVwiLFxuXHRcIsSwXCI6IFwiSVwiLFxuXHRcIsSxXCI6IFwiaVwiLFxuXHRcIsSyXCI6IFwiSUpcIixcblx0XCLEs1wiOiBcImlqXCIsXG5cdFwixLRcIjogXCJKXCIsXG5cdFwixLVcIjogXCJqXCIsXG5cdFwixLZcIjogXCJLXCIsXG5cdFwixLdcIjogXCJrXCIsXG5cdFwi4biwXCI6IFwiS1wiLFxuXHRcIuG4sVwiOiBcImtcIixcblx0XCJLzIZcIjogXCJLXCIsXG5cdFwia8yGXCI6IFwia1wiLFxuXHRcIsS5XCI6IFwiTFwiLFxuXHRcIsS6XCI6IFwibFwiLFxuXHRcIsS7XCI6IFwiTFwiLFxuXHRcIsS8XCI6IFwibFwiLFxuXHRcIsS9XCI6IFwiTFwiLFxuXHRcIsS+XCI6IFwibFwiLFxuXHRcIsS/XCI6IFwiTFwiLFxuXHRcIsWAXCI6IFwibFwiLFxuXHRcIsWBXCI6IFwibFwiLFxuXHRcIsWCXCI6IFwibFwiLFxuXHRcIuG4vlwiOiBcIk1cIixcblx0XCLhuL9cIjogXCJtXCIsXG5cdFwiTcyGXCI6IFwiTVwiLFxuXHRcIm3MhlwiOiBcIm1cIixcblx0XCLFg1wiOiBcIk5cIixcblx0XCLFhFwiOiBcIm5cIixcblx0XCLFhVwiOiBcIk5cIixcblx0XCLFhlwiOiBcIm5cIixcblx0XCLFh1wiOiBcIk5cIixcblx0XCLFiFwiOiBcIm5cIixcblx0XCLFiVwiOiBcIm5cIixcblx0XCJOzIZcIjogXCJOXCIsXG5cdFwibsyGXCI6IFwiblwiLFxuXHRcIsWMXCI6IFwiT1wiLFxuXHRcIsWNXCI6IFwib1wiLFxuXHRcIsWOXCI6IFwiT1wiLFxuXHRcIsWPXCI6IFwib1wiLFxuXHRcIsWQXCI6IFwiT1wiLFxuXHRcIsWRXCI6IFwib1wiLFxuXHRcIsWSXCI6IFwiT0VcIixcblx0XCLFk1wiOiBcIm9lXCIsXG5cdFwiUMyGXCI6IFwiUFwiLFxuXHRcInDMhlwiOiBcInBcIixcblx0XCLFlFwiOiBcIlJcIixcblx0XCLFlVwiOiBcInJcIixcblx0XCLFllwiOiBcIlJcIixcblx0XCLFl1wiOiBcInJcIixcblx0XCLFmFwiOiBcIlJcIixcblx0XCLFmVwiOiBcInJcIixcblx0XCJSzIZcIjogXCJSXCIsXG5cdFwicsyGXCI6IFwiclwiLFxuXHRcIsiSXCI6IFwiUlwiLFxuXHRcIsiTXCI6IFwiclwiLFxuXHRcIsWaXCI6IFwiU1wiLFxuXHRcIsWbXCI6IFwic1wiLFxuXHRcIsWcXCI6IFwiU1wiLFxuXHRcIsWdXCI6IFwic1wiLFxuXHRcIsWeXCI6IFwiU1wiLFxuXHRcIsiYXCI6IFwiU1wiLFxuXHRcIsiZXCI6IFwic1wiLFxuXHRcIsWfXCI6IFwic1wiLFxuXHRcIsWgXCI6IFwiU1wiLFxuXHRcIsWhXCI6IFwic1wiLFxuXHRcIsWiXCI6IFwiVFwiLFxuXHRcIsWjXCI6IFwidFwiLFxuXHRcIsibXCI6IFwidFwiLFxuXHRcIsiaXCI6IFwiVFwiLFxuXHRcIsWkXCI6IFwiVFwiLFxuXHRcIsWlXCI6IFwidFwiLFxuXHRcIsWmXCI6IFwiVFwiLFxuXHRcIsWnXCI6IFwidFwiLFxuXHRcIlTMhlwiOiBcIlRcIixcblx0XCJ0zIZcIjogXCJ0XCIsXG5cdFwixahcIjogXCJVXCIsXG5cdFwixalcIjogXCJ1XCIsXG5cdFwixapcIjogXCJVXCIsXG5cdFwixatcIjogXCJ1XCIsXG5cdFwixaxcIjogXCJVXCIsXG5cdFwixa1cIjogXCJ1XCIsXG5cdFwixa5cIjogXCJVXCIsXG5cdFwixa9cIjogXCJ1XCIsXG5cdFwixbBcIjogXCJVXCIsXG5cdFwixbFcIjogXCJ1XCIsXG5cdFwixbJcIjogXCJVXCIsXG5cdFwixbNcIjogXCJ1XCIsXG5cdFwiyJZcIjogXCJVXCIsXG5cdFwiyJdcIjogXCJ1XCIsXG5cdFwiVsyGXCI6IFwiVlwiLFxuXHRcInbMhlwiOiBcInZcIixcblx0XCLFtFwiOiBcIldcIixcblx0XCLFtVwiOiBcIndcIixcblx0XCLhuoJcIjogXCJXXCIsXG5cdFwi4bqDXCI6IFwid1wiLFxuXHRcIljMhlwiOiBcIlhcIixcblx0XCJ4zIZcIjogXCJ4XCIsXG5cdFwixbZcIjogXCJZXCIsXG5cdFwixbdcIjogXCJ5XCIsXG5cdFwixbhcIjogXCJZXCIsXG5cdFwiWcyGXCI6IFwiWVwiLFxuXHRcInnMhlwiOiBcInlcIixcblx0XCLFuVwiOiBcIlpcIixcblx0XCLFulwiOiBcInpcIixcblx0XCLFu1wiOiBcIlpcIixcblx0XCLFvFwiOiBcInpcIixcblx0XCLFvVwiOiBcIlpcIixcblx0XCLFvlwiOiBcInpcIixcblx0XCLFv1wiOiBcInNcIixcblx0XCLGklwiOiBcImZcIixcblx0XCLGoFwiOiBcIk9cIixcblx0XCLGoVwiOiBcIm9cIixcblx0XCLGr1wiOiBcIlVcIixcblx0XCLGsFwiOiBcInVcIixcblx0XCLHjVwiOiBcIkFcIixcblx0XCLHjlwiOiBcImFcIixcblx0XCLHj1wiOiBcIklcIixcblx0XCLHkFwiOiBcImlcIixcblx0XCLHkVwiOiBcIk9cIixcblx0XCLHklwiOiBcIm9cIixcblx0XCLHk1wiOiBcIlVcIixcblx0XCLHlFwiOiBcInVcIixcblx0XCLHlVwiOiBcIlVcIixcblx0XCLHllwiOiBcInVcIixcblx0XCLHl1wiOiBcIlVcIixcblx0XCLHmFwiOiBcInVcIixcblx0XCLHmVwiOiBcIlVcIixcblx0XCLHmlwiOiBcInVcIixcblx0XCLHm1wiOiBcIlVcIixcblx0XCLHnFwiOiBcInVcIixcblx0XCLhu6hcIjogXCJVXCIsXG5cdFwi4bupXCI6IFwidVwiLFxuXHRcIuG5uFwiOiBcIlVcIixcblx0XCLhublcIjogXCJ1XCIsXG5cdFwix7pcIjogXCJBXCIsXG5cdFwix7tcIjogXCJhXCIsXG5cdFwix7xcIjogXCJBRVwiLFxuXHRcIse9XCI6IFwiYWVcIixcblx0XCLHvlwiOiBcIk9cIixcblx0XCLHv1wiOiBcIm9cIixcblx0XCLDnlwiOiBcIlRIXCIsXG5cdFwiw75cIjogXCJ0aFwiLFxuXHRcIuG5lFwiOiBcIlBcIixcblx0XCLhuZVcIjogXCJwXCIsXG5cdFwi4bmkXCI6IFwiU1wiLFxuXHRcIuG5pVwiOiBcInNcIixcblx0XCJYzIFcIjogXCJYXCIsXG5cdFwieMyBXCI6IFwieFwiLFxuXHRcItCDXCI6IFwi0JNcIixcblx0XCLRk1wiOiBcItCzXCIsXG5cdFwi0IxcIjogXCLQmlwiLFxuXHRcItGcXCI6IFwi0LpcIixcblx0XCJBzItcIjogXCJBXCIsXG5cdFwiYcyLXCI6IFwiYVwiLFxuXHRcIkXMi1wiOiBcIkVcIixcblx0XCJlzItcIjogXCJlXCIsXG5cdFwiScyLXCI6IFwiSVwiLFxuXHRcImnMi1wiOiBcImlcIixcblx0XCLHuFwiOiBcIk5cIixcblx0XCLHuVwiOiBcIm5cIixcblx0XCLhu5JcIjogXCJPXCIsXG5cdFwi4buTXCI6IFwib1wiLFxuXHRcIuG5kFwiOiBcIk9cIixcblx0XCLhuZFcIjogXCJvXCIsXG5cdFwi4buqXCI6IFwiVVwiLFxuXHRcIuG7q1wiOiBcInVcIixcblx0XCLhuoBcIjogXCJXXCIsXG5cdFwi4bqBXCI6IFwid1wiLFxuXHRcIuG7slwiOiBcIllcIixcblx0XCLhu7NcIjogXCJ5XCIsXG5cdFwiyIBcIjogXCJBXCIsXG5cdFwiyIFcIjogXCJhXCIsXG5cdFwiyIRcIjogXCJFXCIsXG5cdFwiyIVcIjogXCJlXCIsXG5cdFwiyIhcIjogXCJJXCIsXG5cdFwiyIlcIjogXCJpXCIsXG5cdFwiyIxcIjogXCJPXCIsXG5cdFwiyI1cIjogXCJvXCIsXG5cdFwiyJBcIjogXCJSXCIsXG5cdFwiyJFcIjogXCJyXCIsXG5cdFwiyJRcIjogXCJVXCIsXG5cdFwiyJVcIjogXCJ1XCIsXG5cdFwiQsyMXCI6IFwiQlwiLFxuXHRcImLMjFwiOiBcImJcIixcblx0XCLEjMyjXCI6IFwiQ1wiLFxuXHRcIsSNzKNcIjogXCJjXCIsXG5cdFwiw4rMjFwiOiBcIkVcIixcblx0XCLDqsyMXCI6IFwiZVwiLFxuXHRcIkbMjFwiOiBcIkZcIixcblx0XCJmzIxcIjogXCJmXCIsXG5cdFwix6ZcIjogXCJHXCIsXG5cdFwix6dcIjogXCJnXCIsXG5cdFwiyJ5cIjogXCJIXCIsXG5cdFwiyJ9cIjogXCJoXCIsXG5cdFwiSsyMXCI6IFwiSlwiLFxuXHRcIsewXCI6IFwialwiLFxuXHRcIseoXCI6IFwiS1wiLFxuXHRcIsepXCI6IFwia1wiLFxuXHRcIk3MjFwiOiBcIk1cIixcblx0XCJtzIxcIjogXCJtXCIsXG5cdFwiUMyMXCI6IFwiUFwiLFxuXHRcInDMjFwiOiBcInBcIixcblx0XCJRzIxcIjogXCJRXCIsXG5cdFwiccyMXCI6IFwicVwiLFxuXHRcIsWYzKlcIjogXCJSXCIsXG5cdFwixZnMqVwiOiBcInJcIixcblx0XCLhuaZcIjogXCJTXCIsXG5cdFwi4bmnXCI6IFwic1wiLFxuXHRcIlbMjFwiOiBcIlZcIixcblx0XCJ2zIxcIjogXCJ2XCIsXG5cdFwiV8yMXCI6IFwiV1wiLFxuXHRcInfMjFwiOiBcIndcIixcblx0XCJYzIxcIjogXCJYXCIsXG5cdFwieMyMXCI6IFwieFwiLFxuXHRcIlnMjFwiOiBcIllcIixcblx0XCJ5zIxcIjogXCJ5XCIsXG5cdFwiQcynXCI6IFwiQVwiLFxuXHRcImHMp1wiOiBcImFcIixcblx0XCJCzKdcIjogXCJCXCIsXG5cdFwiYsynXCI6IFwiYlwiLFxuXHRcIuG4kFwiOiBcIkRcIixcblx0XCLhuJFcIjogXCJkXCIsXG5cdFwiyKhcIjogXCJFXCIsXG5cdFwiyKlcIjogXCJlXCIsXG5cdFwixpDMp1wiOiBcIkVcIixcblx0XCLJm8ynXCI6IFwiZVwiLFxuXHRcIuG4qFwiOiBcIkhcIixcblx0XCLhuKlcIjogXCJoXCIsXG5cdFwiScynXCI6IFwiSVwiLFxuXHRcImnMp1wiOiBcImlcIixcblx0XCLGl8ynXCI6IFwiSVwiLFxuXHRcIsmozKdcIjogXCJpXCIsXG5cdFwiTcynXCI6IFwiTVwiLFxuXHRcIm3Mp1wiOiBcIm1cIixcblx0XCJPzKdcIjogXCJPXCIsXG5cdFwib8ynXCI6IFwib1wiLFxuXHRcIlHMp1wiOiBcIlFcIixcblx0XCJxzKdcIjogXCJxXCIsXG5cdFwiVcynXCI6IFwiVVwiLFxuXHRcInXMp1wiOiBcInVcIixcblx0XCJYzKdcIjogXCJYXCIsXG5cdFwieMynXCI6IFwieFwiLFxuXHRcIlrMp1wiOiBcIlpcIixcblx0XCJ6zKdcIjogXCJ6XCIsXG5cdFwi0LlcIjpcItC4XCIsXG5cdFwi0JlcIjpcItCYXCIsXG5cdFwi0ZFcIjpcItC1XCIsXG5cdFwi0IFcIjpcItCVXCIsXG59O1xuXG52YXIgY2hhcnMgPSBPYmplY3Qua2V5cyhjaGFyYWN0ZXJNYXApLmpvaW4oJ3wnKTtcbnZhciBhbGxBY2NlbnRzID0gbmV3IFJlZ0V4cChjaGFycywgJ2cnKTtcbnZhciBmaXJzdEFjY2VudCA9IG5ldyBSZWdFeHAoY2hhcnMsICcnKTtcblxuZnVuY3Rpb24gbWF0Y2hlcihtYXRjaCkge1xuXHRyZXR1cm4gY2hhcmFjdGVyTWFwW21hdGNoXTtcbn1cblxudmFyIHJlbW92ZUFjY2VudHMgPSBmdW5jdGlvbihzdHJpbmcpIHtcblx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKGFsbEFjY2VudHMsIG1hdGNoZXIpO1xufTtcblxudmFyIGhhc0FjY2VudHMgPSBmdW5jdGlvbihzdHJpbmcpIHtcblx0cmV0dXJuICEhc3RyaW5nLm1hdGNoKGZpcnN0QWNjZW50KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcmVtb3ZlQWNjZW50cztcbm1vZHVsZS5leHBvcnRzLmhhcyA9IGhhc0FjY2VudHM7XG5tb2R1bGUuZXhwb3J0cy5yZW1vdmUgPSByZW1vdmVBY2NlbnRzO1xuIiwiaW1wb3J0IHsgQmlnIH0gZnJvbSBcImJpZy5qc1wiO1xuaW1wb3J0IHsgbWF0Y2hTb3J0ZXIsIE1hdGNoU29ydGVyT3B0aW9ucyB9IGZyb20gXCJtYXRjaC1zb3J0ZXJcIjtcbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIFByb3BzV2l0aENoaWxkcmVuLCBSZWFjdEVsZW1lbnQgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IEdyb3VwZWRDb21ib2JveFByZXZpZXdQcm9wcywgRmlsdGVyVHlwZUVudW0sIFNlbGVjdGVkSXRlbXNTb3J0aW5nRW51bSB9IGZyb20gXCJ0eXBpbmdzL0dyb3VwZWRDb21ib2JveFByb3BzXCI7XG5pbXBvcnQgeyBNdWx0aVNlbGVjdG9yLCBTb3J0T3JkZXIgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgT2JqZWN0SXRlbSB9IGZyb20gXCJtZW5kaXhcIjtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfTElNSVRfU0laRSA9IDEwMDtcblxudHlwZSBWYWx1ZVR5cGUgPSBzdHJpbmcgfCBCaWcgfCBib29sZWFuIHwgRGF0ZSB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbGVjdGVkQ2FwdGlvbnNQbGFjZWhvbGRlcihzZWxlY3RvcjogTXVsdGlTZWxlY3Rvciwgc2VsZWN0ZWRJdGVtczogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgIGlmIChzZWxlY3RlZEl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gc2VsZWN0b3IuY2FwdGlvbi5lbXB0eUNhcHRpb247XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgICBzZWxlY3Rvci5zZWxlY3RlZEl0ZW1zU3R5bGUgIT09IFwidGV4dFwiIHx8XG4gICAgICAgIHNlbGVjdG9yLmN1c3RvbUNvbnRlbnRUeXBlID09PSBcInllc1wiIHx8XG4gICAgICAgIHNlbGVjdG9yLnNlbGVjdGlvbk1ldGhvZCA9PT0gXCJyb3djbGlja1wiXG4gICAgKSB7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZWN0ZWRJdGVtcy5tYXAodiA9PiBzZWxlY3Rvci5jYXB0aW9uLmdldCh2KSk7XG5cbiAgICByZXR1cm4gc2VsZWN0ZWQuam9pbihcIiwgXCIpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENhcHRpb25Db250ZW50UHJvcHMgZXh0ZW5kcyBQcm9wc1dpdGhDaGlsZHJlbiB7XG4gICAgaHRtbEZvcj86IHN0cmluZztcbiAgICBvbkNsaWNrPzogKGU6IE1vdXNlRXZlbnQpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDYXB0aW9uQ29udGVudChwcm9wczogQ2FwdGlvbkNvbnRlbnRQcm9wcyk6IFJlYWN0RWxlbWVudCB7XG4gICAgY29uc3QgeyBodG1sRm9yLCBjaGlsZHJlbiwgb25DbGljayB9ID0gcHJvcHM7XG4gICAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQoaHRtbEZvciA9PSBudWxsID8gXCJzcGFuXCIgOiBcImxhYmVsXCIsIHtcbiAgICAgICAgY2hpbGRyZW4sXG4gICAgICAgIGNsYXNzTmFtZTogXCJ3aWRnZXQtY29tYm9ib3gtY2FwdGlvbi10ZXh0XCIsXG4gICAgICAgIGh0bWxGb3IsXG4gICAgICAgIG9uQ2xpY2s6IG9uQ2xpY2tcbiAgICAgICAgICAgID8gb25DbGlja1xuICAgICAgICAgICAgOiBodG1sRm9yXG4gICAgICAgICAgICAgID8gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgOiB1bmRlZmluZWRcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGFzb3VyY2VQbGFjZWhvbGRlclRleHQoYXJnczogR3JvdXBlZENvbWJvYm94UHJldmlld1Byb3BzKTogc3RyaW5nIHtcbiAgICBjb25zdCB7XG4gICAgICAgIG9wdGlvbnNTb3VyY2VUeXBlLFxuICAgICAgICBvcHRpb25zU291cmNlQXNzb2NpYXRpb25EYXRhU291cmNlLFxuICAgICAgICBhdHRyaWJ1dGVFbnVtZXJhdGlvbixcbiAgICAgICAgYXR0cmlidXRlQm9vbGVhbixcbiAgICAgICAgZGF0YWJhc2VBdHRyaWJ1dGVTdHJpbmcsXG4gICAgICAgIGVtcHR5T3B0aW9uVGV4dCxcbiAgICAgICAgc291cmNlLFxuICAgICAgICBvcHRpb25zU291cmNlRGF0YWJhc2VEYXRhU291cmNlLFxuICAgICAgICBzdGF0aWNBdHRyaWJ1dGUsXG4gICAgICAgIG9wdGlvbnNTb3VyY2VTdGF0aWNEYXRhU291cmNlXG4gICAgfSA9IGFyZ3M7XG4gICAgY29uc3QgZW1wdHlTdHJpbmdGb3JtYXQgPSBlbXB0eU9wdGlvblRleHQgPyBgWyR7ZW1wdHlPcHRpb25UZXh0fV1gIDogXCJDb21ibyBib3hcIjtcbiAgICBpZiAoc291cmNlID09PSBcImNvbnRleHRcIikge1xuICAgICAgICBzd2l0Y2ggKG9wdGlvbnNTb3VyY2VUeXBlKSB7XG4gICAgICAgICAgICBjYXNlIFwiYXNzb2NpYXRpb25cIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gKG9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkRhdGFTb3VyY2UgYXMgeyBjYXB0aW9uPzogc3RyaW5nIH0pPy5jYXB0aW9uIHx8IGVtcHR5U3RyaW5nRm9ybWF0O1xuICAgICAgICAgICAgY2FzZSBcImVudW1lcmF0aW9uXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGBbJHtvcHRpb25zU291cmNlVHlwZX0sICR7YXR0cmlidXRlRW51bWVyYXRpb259XWA7XG4gICAgICAgICAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgICAgICAgICAgIHJldHVybiBgWyR7b3B0aW9uc1NvdXJjZVR5cGV9LCAke2F0dHJpYnV0ZUJvb2xlYW59XWA7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBlbXB0eVN0cmluZ0Zvcm1hdDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc291cmNlID09PSBcImRhdGFiYXNlXCIgJiYgb3B0aW9uc1NvdXJjZURhdGFiYXNlRGF0YVNvdXJjZSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgKG9wdGlvbnNTb3VyY2VEYXRhYmFzZURhdGFTb3VyY2UgYXMgeyBjYXB0aW9uPzogc3RyaW5nIH0pPy5jYXB0aW9uIHx8XG4gICAgICAgICAgICBgJHtzb3VyY2V9LCAke2RhdGFiYXNlQXR0cmlidXRlU3RyaW5nfWBcbiAgICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHNvdXJjZSA9PT0gXCJzdGF0aWNcIikge1xuICAgICAgICByZXR1cm4gKG9wdGlvbnNTb3VyY2VTdGF0aWNEYXRhU291cmNlIGFzIHsgY2FwdGlvbj86IHN0cmluZyB9KT8uY2FwdGlvbiB8fCBgWyR7c291cmNlfSwgJHtzdGF0aWNBdHRyaWJ1dGV9XWA7XG4gICAgfVxuICAgIHJldHVybiBlbXB0eVN0cmluZ0Zvcm1hdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbHRlclR5cGVPcHRpb25zKGZpbHRlcjogRmlsdGVyVHlwZUVudW0pOiBNYXRjaFNvcnRlck9wdGlvbnM8c3RyaW5nPiB7XG4gICAgc3dpdGNoIChmaWx0ZXIpIHtcbiAgICAgICAgY2FzZSBcImNvbnRhaW5zXCI6XG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIGNhc2UgXCJjb250YWluc0V4YWN0XCI6XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRocmVzaG9sZDogbWF0Y2hTb3J0ZXIucmFua2luZ3MuQ09OVEFJTlNcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgXCJzdGFydHNXaXRoXCI6XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRocmVzaG9sZDogbWF0Y2hTb3J0ZXIucmFua2luZ3MuV09SRF9TVEFSVFNfV0lUSFxuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSBcIm5vbmVcIjpcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGhyZXNob2xkOiBtYXRjaFNvcnRlci5yYW5raW5ncy5OT19NQVRDSFxuICAgICAgICAgICAgfTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfdmFsdWVzSXNFcXVhbCh2YWx1ZUE6IFZhbHVlVHlwZSwgdmFsdWVCOiBWYWx1ZVR5cGUpOiBib29sZWFuIHtcbiAgICBpZiAodmFsdWVBID09PSB1bmRlZmluZWQgfHwgdmFsdWVCID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlQSA9PT0gdmFsdWVCO1xuICAgIH1cbiAgICBpZiAodmFsdWVBIGluc3RhbmNlb2YgQmlnICYmIHZhbHVlQiBpbnN0YW5jZW9mIEJpZykge1xuICAgICAgICByZXR1cm4gdmFsdWVBLmVxKHZhbHVlQik7XG4gICAgfVxuICAgIGlmICh2YWx1ZUEgaW5zdGFuY2VvZiBEYXRlICYmIHZhbHVlQiBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlQS5nZXRUaW1lKCkgPT09IHZhbHVlQi5nZXRUaW1lKCk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZUEgPT09IHZhbHVlQjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNvcnRTZWxlY3RlZEl0ZW1zKFxuICAgIHZhbHVlczogT2JqZWN0SXRlbVtdIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICBzb3J0aW5nVHlwZTogU2VsZWN0ZWRJdGVtc1NvcnRpbmdFbnVtLFxuICAgIHNvcnRPcmRlcjogU29ydE9yZGVyLFxuICAgIGNhcHRpb25HZXR0ZXI6IChpZDogc3RyaW5nKSA9PiBzdHJpbmcgfCB1bmRlZmluZWRcbik6IHN0cmluZ1tdIHwgbnVsbCB7XG4gICAgaWYgKHZhbHVlcykge1xuICAgICAgICByZXR1cm4gc29ydFNlbGVjdGlvbnMoXG4gICAgICAgICAgICB2YWx1ZXMubWFwKHYgPT4gKHY/LmlkIGFzIHN0cmluZykgPz8gbnVsbCksXG4gICAgICAgICAgICBzb3J0aW5nVHlwZSxcbiAgICAgICAgICAgIHNvcnRPcmRlcixcbiAgICAgICAgICAgIGNhcHRpb25HZXR0ZXJcbiAgICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNvcnRTZWxlY3Rpb25zKFxuICAgIG5ld1ZhbHVlSWRzOiBzdHJpbmdbXSxcbiAgICBzb3J0aW5nVHlwZTogU2VsZWN0ZWRJdGVtc1NvcnRpbmdFbnVtLFxuICAgIHNvcnRPcmRlcjogU29ydE9yZGVyLFxuICAgIGNhcHRpb25HZXR0ZXI6IChpZDogc3RyaW5nKSA9PiBzdHJpbmcgfCB1bmRlZmluZWRcbik6IHN0cmluZ1tdIHtcbiAgICBpZiAoc29ydGluZ1R5cGUgPT09IFwiY2FwdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBuZXdWYWx1ZUlkcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjYXB0aW9uQSA9IGNhcHRpb25HZXR0ZXIoYSk/LnRvU3RyaW5nKCkgPz8gXCJcIjtcbiAgICAgICAgICAgIGNvbnN0IGNhcHRpb25CID0gY2FwdGlvbkdldHRlcihiKT8udG9TdHJpbmcoKSA/PyBcIlwiO1xuICAgICAgICAgICAgcmV0dXJuIHNvcnRPcmRlciA9PT0gXCJhc2NcIiA/IGNhcHRpb25BLmxvY2FsZUNvbXBhcmUoY2FwdGlvbkIpIDogY2FwdGlvbkIubG9jYWxlQ29tcGFyZShjYXB0aW9uQSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbmV3VmFsdWVJZHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbnB1dExhYmVsKGlucHV0SWQ6IHN0cmluZyk6IEVsZW1lbnQgfCBudWxsIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgbGFiZWxbZm9yPVwiJHtpbnB1dElkfVwiXWApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmFsaWRhdGlvbkVycm9ySWQoaW5wdXRJZD86IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIGlucHV0SWQgPyBpbnB1dElkICsgXCItdmFsaWRhdGlvbi1tZXNzYWdlXCIgOiB1bmRlZmluZWQ7XG59XG4iLCJpbXBvcnQgY2xhc3NOYW1lcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IHsgRnJhZ21lbnQsIE1vdXNlRXZlbnQsIFJlYWN0RWxlbWVudCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgQ2FwdGlvbkNvbnRlbnQgfSBmcm9tIFwiLi4vaGVscGVycy91dGlsc1wiO1xuZXhwb3J0IGZ1bmN0aW9uIENsZWFyQnV0dG9uKHsgc2l6ZSA9IDE0IH0pOiBSZWFjdEVsZW1lbnQge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIndpZGdldC1jb21ib2JveC1pY29uLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPHN2ZyB3aWR0aD17c2l6ZX0gaGVpZ2h0PXtzaXplfSB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94LWNsZWFyLWJ1dHRvbi1pY29uXCI+XG4gICAgICAgICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgICAgICBkPVwiTTI3LjcxIDUuNzEwMDRMMjYuMjkgNC4yOTAwNEwxNiAxNC41OUw1LjcxMDA0IDQuMjkwMDRMNC4yOTAwNCA1LjcxMDA0TDE0LjU5IDE2TDQuMjkwMDQgMjYuMjlMNS43MTAwNCAyNy43MUwxNiAxNy40MUwyNi4yOSAyNy43MUwyNy43MSAyNi4yOUwxNy40MSAxNkwyNy43MSA1LjcxMDA0WlwiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L3NwYW4+XG4gICAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIERvd25BcnJvdyh7IGlzT3BlbiB9OiB7IGlzT3Blbj86IGJvb2xlYW4gfSk6IFJlYWN0RWxlbWVudCB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94LWljb24tY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8c3ZnXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFwid2lkZ2V0LWNvbWJvYm94LWRvd24tYXJyb3ctaWNvblwiLCBcIm14LWljb24tbGluZWRcIiwgXCJteC1pY29uLWNoZXZyb24tZG93blwiLCB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogaXNPcGVuXG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgd2lkdGg9XCIxNlwiXG4gICAgICAgICAgICAgICAgaGVpZ2h0PVwiMTZcIlxuICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMzIgMzJcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTYgMjMuNDFMNC4yOTAwNCAxMS43MUw1LjcxMDA0IDEwLjI5TDE2IDIwLjU5TDI2LjI5IDEwLjI5TDI3LjcxIDExLjcxTDE2IDIzLjQxWlwiIC8+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9zcGFuPlxuICAgICk7XG59XG5cbmludGVyZmFjZSBDaGVja2JveFByb3BzIHtcbiAgICBjaGVja2VkOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICAgIGlkPzogc3RyaW5nO1xuICAgIGZvY3VzYWJsZT86IGJvb2xlYW47XG4gICAgb25DbGljaz86IChlOiBNb3VzZUV2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KSA9PiB2b2lkO1xuICAgIGFyaWFMYWJlbD86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENoZWNrYm94KHsgY2hlY2tlZCwgaWQsIGZvY3VzYWJsZSwgb25DbGljaywgYXJpYUxhYmVsIH06IENoZWNrYm94UHJvcHMpOiBSZWFjdEVsZW1lbnQge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIndpZGdldC1jb21ib2JveC1pY29uLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgICAgICAgICB0YWJJbmRleD17Zm9jdXNhYmxlID8gMCA6IC0xfVxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXtjaGVja2VkfVxuICAgICAgICAgICAgICAgICAgICBpZD17aWR9XG4gICAgICAgICAgICAgICAgICAgIHJvbGU9XCJwcmVzZW50YXRpb25cIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IG9uQ2xpY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IChlOiBNb3VzZUV2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoKSA9PiB7fX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAge2FyaWFMYWJlbCA/IDxDYXB0aW9uQ29udGVudCBodG1sRm9yPXtpZH0+e2FyaWFMYWJlbH08L0NhcHRpb25Db250ZW50PiA6IHVuZGVmaW5lZH1cbiAgICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xufVxuIiwiZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UociwgZSkge1xuICBpZiAobnVsbCA9PSByKSByZXR1cm4ge307XG4gIHZhciB0ID0ge307XG4gIGZvciAodmFyIG4gaW4gcikgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwociwgbikpIHtcbiAgICBpZiAoLTEgIT09IGUuaW5kZXhPZihuKSkgY29udGludWU7XG4gICAgdFtuXSA9IHJbbl07XG4gIH1cbiAgcmV0dXJuIHQ7XG59XG5leHBvcnQgeyBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZSBhcyBkZWZhdWx0IH07IiwiZnVuY3Rpb24gX2V4dGVuZHMoKSB7XG4gIHJldHVybiBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gPyBPYmplY3QuYXNzaWduLmJpbmQoKSA6IGZ1bmN0aW9uIChuKSB7XG4gICAgZm9yICh2YXIgZSA9IDE7IGUgPCBhcmd1bWVudHMubGVuZ3RoOyBlKyspIHtcbiAgICAgIHZhciB0ID0gYXJndW1lbnRzW2VdO1xuICAgICAgZm9yICh2YXIgciBpbiB0KSAoe30pLmhhc093blByb3BlcnR5LmNhbGwodCwgcikgJiYgKG5bcl0gPSB0W3JdKTtcbiAgICB9XG4gICAgcmV0dXJuIG47XG4gIH0sIF9leHRlbmRzLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG59XG5leHBvcnQgeyBfZXh0ZW5kcyBhcyBkZWZhdWx0IH07IiwiZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChlKSB7XG4gIGlmICh2b2lkIDAgPT09IGUpIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtcbiAgcmV0dXJuIGU7XG59XG5leHBvcnQgeyBfYXNzZXJ0VGhpc0luaXRpYWxpemVkIGFzIGRlZmF1bHQgfTsiLCJmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YodCwgZSkge1xuICByZXR1cm4gX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mLmJpbmQoKSA6IGZ1bmN0aW9uICh0LCBlKSB7XG4gICAgcmV0dXJuIHQuX19wcm90b19fID0gZSwgdDtcbiAgfSwgX3NldFByb3RvdHlwZU9mKHQsIGUpO1xufVxuZXhwb3J0IHsgX3NldFByb3RvdHlwZU9mIGFzIGRlZmF1bHQgfTsiLCJpbXBvcnQgc2V0UHJvdG90eXBlT2YgZnJvbSBcIi4vc2V0UHJvdG90eXBlT2YuanNcIjtcbmZ1bmN0aW9uIF9pbmhlcml0c0xvb3NlKHQsIG8pIHtcbiAgdC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG8ucHJvdG90eXBlKSwgdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSB0LCBzZXRQcm90b3R5cGVPZih0LCBvKTtcbn1cbmV4cG9ydCB7IF9pbmhlcml0c0xvb3NlIGFzIGRlZmF1bHQgfTsiLCIvKiogQGxpY2Vuc2UgUmVhY3QgdjE2LjEzLjFcbiAqIHJlYWN0LWlzLmRldmVsb3BtZW50LmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5cblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbi8vIFRoZSBTeW1ib2wgdXNlZCB0byB0YWcgdGhlIFJlYWN0RWxlbWVudC1saWtlIHR5cGVzLiBJZiB0aGVyZSBpcyBubyBuYXRpdmUgU3ltYm9sXG4vLyBub3IgcG9seWZpbGwsIHRoZW4gYSBwbGFpbiBudW1iZXIgaXMgdXNlZCBmb3IgcGVyZm9ybWFuY2UuXG52YXIgaGFzU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yO1xudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSA6IDB4ZWFjNztcbnZhciBSRUFDVF9QT1JUQUxfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnBvcnRhbCcpIDogMHhlYWNhO1xudmFyIFJFQUNUX0ZSQUdNRU5UX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5mcmFnbWVudCcpIDogMHhlYWNiO1xudmFyIFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5zdHJpY3RfbW9kZScpIDogMHhlYWNjO1xudmFyIFJFQUNUX1BST0ZJTEVSX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5wcm9maWxlcicpIDogMHhlYWQyO1xudmFyIFJFQUNUX1BST1ZJREVSX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5wcm92aWRlcicpIDogMHhlYWNkO1xudmFyIFJFQUNUX0NPTlRFWFRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmNvbnRleHQnKSA6IDB4ZWFjZTsgLy8gVE9ETzogV2UgZG9uJ3QgdXNlIEFzeW5jTW9kZSBvciBDb25jdXJyZW50TW9kZSBhbnltb3JlLiBUaGV5IHdlcmUgdGVtcG9yYXJ5XG4vLyAodW5zdGFibGUpIEFQSXMgdGhhdCBoYXZlIGJlZW4gcmVtb3ZlZC4gQ2FuIHdlIHJlbW92ZSB0aGUgc3ltYm9scz9cblxudmFyIFJFQUNUX0FTWU5DX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmFzeW5jX21vZGUnKSA6IDB4ZWFjZjtcbnZhciBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmNvbmN1cnJlbnRfbW9kZScpIDogMHhlYWNmO1xudmFyIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5mb3J3YXJkX3JlZicpIDogMHhlYWQwO1xudmFyIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5zdXNwZW5zZScpIDogMHhlYWQxO1xudmFyIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnN1c3BlbnNlX2xpc3QnKSA6IDB4ZWFkODtcbnZhciBSRUFDVF9NRU1PX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5tZW1vJykgOiAweGVhZDM7XG52YXIgUkVBQ1RfTEFaWV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QubGF6eScpIDogMHhlYWQ0O1xudmFyIFJFQUNUX0JMT0NLX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5ibG9jaycpIDogMHhlYWQ5O1xudmFyIFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5mdW5kYW1lbnRhbCcpIDogMHhlYWQ1O1xudmFyIFJFQUNUX1JFU1BPTkRFUl9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucmVzcG9uZGVyJykgOiAweGVhZDY7XG52YXIgUkVBQ1RfU0NPUEVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnNjb3BlJykgOiAweGVhZDc7XG5cbmZ1bmN0aW9uIGlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKSB7XG4gIHJldHVybiB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgfHwgLy8gTm90ZTogaXRzIHR5cGVvZiBtaWdodCBiZSBvdGhlciB0aGFuICdzeW1ib2wnIG9yICdudW1iZXInIGlmIGl0J3MgYSBwb2x5ZmlsbC5cbiAgdHlwZSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9QUk9GSUxFUl9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1VTUEVOU0VfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEUgfHwgdHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmIHR5cGUgIT09IG51bGwgJiYgKHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0xBWllfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfUFJPVklERVJfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9DT05URVhUX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX1JFU1BPTkRFUl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX1NDT1BFX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfQkxPQ0tfVFlQRSk7XG59XG5cbmZ1bmN0aW9uIHR5cGVPZihvYmplY3QpIHtcbiAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdCAhPT0gbnVsbCkge1xuICAgIHZhciAkJHR5cGVvZiA9IG9iamVjdC4kJHR5cGVvZjtcblxuICAgIHN3aXRjaCAoJCR0eXBlb2YpIHtcbiAgICAgIGNhc2UgUkVBQ1RfRUxFTUVOVF9UWVBFOlxuICAgICAgICB2YXIgdHlwZSA9IG9iamVjdC50eXBlO1xuXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgIGNhc2UgUkVBQ1RfQVNZTkNfTU9ERV9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9GUkFHTUVOVF9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfUFJPRklMRVJfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX1NUUklDVF9NT0RFX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9UWVBFOlxuICAgICAgICAgICAgcmV0dXJuIHR5cGU7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdmFyICQkdHlwZW9mVHlwZSA9IHR5cGUgJiYgdHlwZS4kJHR5cGVvZjtcblxuICAgICAgICAgICAgc3dpdGNoICgkJHR5cGVvZlR5cGUpIHtcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9DT05URVhUX1RZUEU6XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTpcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9MQVpZX1RZUEU6XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfTUVNT19UWVBFOlxuICAgICAgICAgICAgICBjYXNlIFJFQUNUX1BST1ZJREVSX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuICQkdHlwZW9mVHlwZTtcblxuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiAkJHR5cGVvZjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgIGNhc2UgUkVBQ1RfUE9SVEFMX1RZUEU6XG4gICAgICAgIHJldHVybiAkJHR5cGVvZjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufSAvLyBBc3luY01vZGUgaXMgZGVwcmVjYXRlZCBhbG9uZyB3aXRoIGlzQXN5bmNNb2RlXG5cbnZhciBBc3luY01vZGUgPSBSRUFDVF9BU1lOQ19NT0RFX1RZUEU7XG52YXIgQ29uY3VycmVudE1vZGUgPSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRTtcbnZhciBDb250ZXh0Q29uc3VtZXIgPSBSRUFDVF9DT05URVhUX1RZUEU7XG52YXIgQ29udGV4dFByb3ZpZGVyID0gUkVBQ1RfUFJPVklERVJfVFlQRTtcbnZhciBFbGVtZW50ID0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xudmFyIEZvcndhcmRSZWYgPSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFO1xudmFyIEZyYWdtZW50ID0gUkVBQ1RfRlJBR01FTlRfVFlQRTtcbnZhciBMYXp5ID0gUkVBQ1RfTEFaWV9UWVBFO1xudmFyIE1lbW8gPSBSRUFDVF9NRU1PX1RZUEU7XG52YXIgUG9ydGFsID0gUkVBQ1RfUE9SVEFMX1RZUEU7XG52YXIgUHJvZmlsZXIgPSBSRUFDVF9QUk9GSUxFUl9UWVBFO1xudmFyIFN0cmljdE1vZGUgPSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFO1xudmFyIFN1c3BlbnNlID0gUkVBQ1RfU1VTUEVOU0VfVFlQRTtcbnZhciBoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0FzeW5jTW9kZSA9IGZhbHNlOyAvLyBBc3luY01vZGUgc2hvdWxkIGJlIGRlcHJlY2F0ZWRcblxuZnVuY3Rpb24gaXNBc3luY01vZGUob2JqZWN0KSB7XG4gIHtcbiAgICBpZiAoIWhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlKSB7XG4gICAgICBoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0FzeW5jTW9kZSA9IHRydWU7IC8vIFVzaW5nIGNvbnNvbGVbJ3dhcm4nXSB0byBldmFkZSBCYWJlbCBhbmQgRVNMaW50XG5cbiAgICAgIGNvbnNvbGVbJ3dhcm4nXSgnVGhlIFJlYWN0SXMuaXNBc3luY01vZGUoKSBhbGlhcyBoYXMgYmVlbiBkZXByZWNhdGVkLCAnICsgJ2FuZCB3aWxsIGJlIHJlbW92ZWQgaW4gUmVhY3QgMTcrLiBVcGRhdGUgeW91ciBjb2RlIHRvIHVzZSAnICsgJ1JlYWN0SXMuaXNDb25jdXJyZW50TW9kZSgpIGluc3RlYWQuIEl0IGhhcyB0aGUgZXhhY3Qgc2FtZSBBUEkuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGlzQ29uY3VycmVudE1vZGUob2JqZWN0KSB8fCB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfQVNZTkNfTU9ERV9UWVBFO1xufVxuZnVuY3Rpb24gaXNDb25jdXJyZW50TW9kZShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzQ29udGV4dENvbnN1bWVyKG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0NPTlRFWFRfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzQ29udGV4dFByb3ZpZGVyKG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX1BST1ZJREVSX1RZUEU7XG59XG5mdW5jdGlvbiBpc0VsZW1lbnQob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QgIT09IG51bGwgJiYgb2JqZWN0LiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEU7XG59XG5mdW5jdGlvbiBpc0ZvcndhcmRSZWYob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzRnJhZ21lbnQob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzTGF6eShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9MQVpZX1RZUEU7XG59XG5mdW5jdGlvbiBpc01lbW8ob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfTUVNT19UWVBFO1xufVxuZnVuY3Rpb24gaXNQb3J0YWwob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUE9SVEFMX1RZUEU7XG59XG5mdW5jdGlvbiBpc1Byb2ZpbGVyKG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX1BST0ZJTEVSX1RZUEU7XG59XG5mdW5jdGlvbiBpc1N0cmljdE1vZGUob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzU3VzcGVuc2Uob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfU1VTUEVOU0VfVFlQRTtcbn1cblxuZXhwb3J0cy5Bc3luY01vZGUgPSBBc3luY01vZGU7XG5leHBvcnRzLkNvbmN1cnJlbnRNb2RlID0gQ29uY3VycmVudE1vZGU7XG5leHBvcnRzLkNvbnRleHRDb25zdW1lciA9IENvbnRleHRDb25zdW1lcjtcbmV4cG9ydHMuQ29udGV4dFByb3ZpZGVyID0gQ29udGV4dFByb3ZpZGVyO1xuZXhwb3J0cy5FbGVtZW50ID0gRWxlbWVudDtcbmV4cG9ydHMuRm9yd2FyZFJlZiA9IEZvcndhcmRSZWY7XG5leHBvcnRzLkZyYWdtZW50ID0gRnJhZ21lbnQ7XG5leHBvcnRzLkxhenkgPSBMYXp5O1xuZXhwb3J0cy5NZW1vID0gTWVtbztcbmV4cG9ydHMuUG9ydGFsID0gUG9ydGFsO1xuZXhwb3J0cy5Qcm9maWxlciA9IFByb2ZpbGVyO1xuZXhwb3J0cy5TdHJpY3RNb2RlID0gU3RyaWN0TW9kZTtcbmV4cG9ydHMuU3VzcGVuc2UgPSBTdXNwZW5zZTtcbmV4cG9ydHMuaXNBc3luY01vZGUgPSBpc0FzeW5jTW9kZTtcbmV4cG9ydHMuaXNDb25jdXJyZW50TW9kZSA9IGlzQ29uY3VycmVudE1vZGU7XG5leHBvcnRzLmlzQ29udGV4dENvbnN1bWVyID0gaXNDb250ZXh0Q29uc3VtZXI7XG5leHBvcnRzLmlzQ29udGV4dFByb3ZpZGVyID0gaXNDb250ZXh0UHJvdmlkZXI7XG5leHBvcnRzLmlzRWxlbWVudCA9IGlzRWxlbWVudDtcbmV4cG9ydHMuaXNGb3J3YXJkUmVmID0gaXNGb3J3YXJkUmVmO1xuZXhwb3J0cy5pc0ZyYWdtZW50ID0gaXNGcmFnbWVudDtcbmV4cG9ydHMuaXNMYXp5ID0gaXNMYXp5O1xuZXhwb3J0cy5pc01lbW8gPSBpc01lbW87XG5leHBvcnRzLmlzUG9ydGFsID0gaXNQb3J0YWw7XG5leHBvcnRzLmlzUHJvZmlsZXIgPSBpc1Byb2ZpbGVyO1xuZXhwb3J0cy5pc1N0cmljdE1vZGUgPSBpc1N0cmljdE1vZGU7XG5leHBvcnRzLmlzU3VzcGVuc2UgPSBpc1N1c3BlbnNlO1xuZXhwb3J0cy5pc1ZhbGlkRWxlbWVudFR5cGUgPSBpc1ZhbGlkRWxlbWVudFR5cGU7XG5leHBvcnRzLnR5cGVPZiA9IHR5cGVPZjtcbiAgfSkoKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC1pcy5wcm9kdWN0aW9uLm1pbi5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC1pcy5kZXZlbG9wbWVudC5qcycpO1xufVxuIiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSAnU0VDUkVUX0RPX05PVF9QQVNTX1RISVNfT1JfWU9VX1dJTExfQkVfRklSRUQnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0UHJvcFR5cGVzU2VjcmV0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBGdW5jdGlvbi5jYWxsLmJpbmQoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSk7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHByaW50V2FybmluZyA9IGZ1bmN0aW9uKCkge307XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG4gIHZhciBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbiAgdmFyIGhhcyA9IHJlcXVpcmUoJy4vbGliL2hhcycpO1xuXG4gIHByaW50V2FybmluZyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICsgdGV4dDtcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7IC8qKi8gfVxuICB9O1xufVxuXG4vKipcbiAqIEFzc2VydCB0aGF0IHRoZSB2YWx1ZXMgbWF0Y2ggd2l0aCB0aGUgdHlwZSBzcGVjcy5cbiAqIEVycm9yIG1lc3NhZ2VzIGFyZSBtZW1vcml6ZWQgYW5kIHdpbGwgb25seSBiZSBzaG93biBvbmNlLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSB0eXBlU3BlY3MgTWFwIG9mIG5hbWUgdG8gYSBSZWFjdFByb3BUeXBlXG4gKiBAcGFyYW0ge29iamVjdH0gdmFsdWVzIFJ1bnRpbWUgdmFsdWVzIHRoYXQgbmVlZCB0byBiZSB0eXBlLWNoZWNrZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvbiBlLmcuIFwicHJvcFwiLCBcImNvbnRleHRcIiwgXCJjaGlsZCBjb250ZXh0XCJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21wb25lbnROYW1lIE5hbWUgb2YgdGhlIGNvbXBvbmVudCBmb3IgZXJyb3IgbWVzc2FnZXMuXG4gKiBAcGFyYW0gez9GdW5jdGlvbn0gZ2V0U3RhY2sgUmV0dXJucyB0aGUgY29tcG9uZW50IHN0YWNrLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2hlY2tQcm9wVHlwZXModHlwZVNwZWNzLCB2YWx1ZXMsIGxvY2F0aW9uLCBjb21wb25lbnROYW1lLCBnZXRTdGFjaykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGZvciAodmFyIHR5cGVTcGVjTmFtZSBpbiB0eXBlU3BlY3MpIHtcbiAgICAgIGlmIChoYXModHlwZVNwZWNzLCB0eXBlU3BlY05hbWUpKSB7XG4gICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgLy8gUHJvcCB0eXBlIHZhbGlkYXRpb24gbWF5IHRocm93LiBJbiBjYXNlIHRoZXkgZG8sIHdlIGRvbid0IHdhbnQgdG9cbiAgICAgICAgLy8gZmFpbCB0aGUgcmVuZGVyIHBoYXNlIHdoZXJlIGl0IGRpZG4ndCBmYWlsIGJlZm9yZS4gU28gd2UgbG9nIGl0LlxuICAgICAgICAvLyBBZnRlciB0aGVzZSBoYXZlIGJlZW4gY2xlYW5lZCB1cCwgd2UnbGwgbGV0IHRoZW0gdGhyb3cuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gVGhpcyBpcyBpbnRlbnRpb25hbGx5IGFuIGludmFyaWFudCB0aGF0IGdldHMgY2F1Z2h0LiBJdCdzIHRoZSBzYW1lXG4gICAgICAgICAgLy8gYmVoYXZpb3IgYXMgd2l0aG91dCB0aGlzIHN0YXRlbWVudCBleGNlcHQgd2l0aCBhIGJldHRlciBtZXNzYWdlLlxuICAgICAgICAgIGlmICh0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhciBlcnIgPSBFcnJvcihcbiAgICAgICAgICAgICAgKGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJykgKyAnOiAnICsgbG9jYXRpb24gKyAnIHR5cGUgYCcgKyB0eXBlU3BlY05hbWUgKyAnYCBpcyBpbnZhbGlkOyAnICtcbiAgICAgICAgICAgICAgJ2l0IG11c3QgYmUgYSBmdW5jdGlvbiwgdXN1YWxseSBmcm9tIHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZSwgYnV0IHJlY2VpdmVkIGAnICsgdHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdICsgJ2AuJyArXG4gICAgICAgICAgICAgICdUaGlzIG9mdGVuIGhhcHBlbnMgYmVjYXVzZSBvZiB0eXBvcyBzdWNoIGFzIGBQcm9wVHlwZXMuZnVuY3Rpb25gIGluc3RlYWQgb2YgYFByb3BUeXBlcy5mdW5jYC4nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZXJyLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVycm9yID0gdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0odmFsdWVzLCB0eXBlU3BlY05hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBudWxsLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgZXJyb3IgPSBleDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3IgJiYgIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkge1xuICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgIChjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycpICsgJzogdHlwZSBzcGVjaWZpY2F0aW9uIG9mICcgK1xuICAgICAgICAgICAgbG9jYXRpb24gKyAnIGAnICsgdHlwZVNwZWNOYW1lICsgJ2AgaXMgaW52YWxpZDsgdGhlIHR5cGUgY2hlY2tlciAnICtcbiAgICAgICAgICAgICdmdW5jdGlvbiBtdXN0IHJldHVybiBgbnVsbGAgb3IgYW4gYEVycm9yYCBidXQgcmV0dXJuZWQgYSAnICsgdHlwZW9mIGVycm9yICsgJy4gJyArXG4gICAgICAgICAgICAnWW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBwYXNzIGFuIGFyZ3VtZW50IHRvIHRoZSB0eXBlIGNoZWNrZXIgJyArXG4gICAgICAgICAgICAnY3JlYXRvciAoYXJyYXlPZiwgaW5zdGFuY2VPZiwgb2JqZWN0T2YsIG9uZU9mLCBvbmVPZlR5cGUsIGFuZCAnICtcbiAgICAgICAgICAgICdzaGFwZSBhbGwgcmVxdWlyZSBhbiBhcmd1bWVudCkuJ1xuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgIShlcnJvci5tZXNzYWdlIGluIGxvZ2dlZFR5cGVGYWlsdXJlcykpIHtcbiAgICAgICAgICAvLyBPbmx5IG1vbml0b3IgdGhpcyBmYWlsdXJlIG9uY2UgYmVjYXVzZSB0aGVyZSB0ZW5kcyB0byBiZSBhIGxvdCBvZiB0aGVcbiAgICAgICAgICAvLyBzYW1lIGVycm9yLlxuICAgICAgICAgIGxvZ2dlZFR5cGVGYWlsdXJlc1tlcnJvci5tZXNzYWdlXSA9IHRydWU7XG5cbiAgICAgICAgICB2YXIgc3RhY2sgPSBnZXRTdGFjayA/IGdldFN0YWNrKCkgOiAnJztcblxuICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgICdGYWlsZWQgJyArIGxvY2F0aW9uICsgJyB0eXBlOiAnICsgZXJyb3IubWVzc2FnZSArIChzdGFjayAhPSBudWxsID8gc3RhY2sgOiAnJylcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVzZXRzIHdhcm5pbmcgY2FjaGUgd2hlbiB0ZXN0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmNoZWNrUHJvcFR5cGVzLnJlc2V0V2FybmluZ0NhY2hlID0gZnVuY3Rpb24oKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgbG9nZ2VkVHlwZUZhaWx1cmVzID0ge307XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjaGVja1Byb3BUeXBlcztcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RJcyA9IHJlcXVpcmUoJ3JlYWN0LWlzJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vbGliL2hhcycpO1xudmFyIGNoZWNrUHJvcFR5cGVzID0gcmVxdWlyZSgnLi9jaGVja1Byb3BUeXBlcycpO1xuXG52YXIgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24oKSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyB0ZXh0O1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHt9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGwoKSB7XG4gIHJldHVybiBudWxsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlzVmFsaWRFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gIC8qIGdsb2JhbCBTeW1ib2wgKi9cbiAgdmFyIElURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xuICB2YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7IC8vIEJlZm9yZSBTeW1ib2wgc3BlYy5cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaXRlcmF0b3IgbWV0aG9kIGZ1bmN0aW9uIGNvbnRhaW5lZCBvbiB0aGUgaXRlcmFibGUgb2JqZWN0LlxuICAgKlxuICAgKiBCZSBzdXJlIHRvIGludm9rZSB0aGUgZnVuY3Rpb24gd2l0aCB0aGUgaXRlcmFibGUgYXMgY29udGV4dDpcbiAgICpcbiAgICogICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihteUl0ZXJhYmxlKTtcbiAgICogICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAqICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChteUl0ZXJhYmxlKTtcbiAgICogICAgICAgLi4uXG4gICAqICAgICB9XG4gICAqXG4gICAqIEBwYXJhbSB7P29iamVjdH0gbWF5YmVJdGVyYWJsZVxuICAgKiBAcmV0dXJuIHs/ZnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IG1heWJlSXRlcmFibGUgJiYgKElURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW0lURVJBVE9SX1NZTUJPTF0gfHwgbWF5YmVJdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF0pO1xuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yRm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbGxlY3Rpb24gb2YgbWV0aG9kcyB0aGF0IGFsbG93IGRlY2xhcmF0aW9uIGFuZCB2YWxpZGF0aW9uIG9mIHByb3BzIHRoYXQgYXJlXG4gICAqIHN1cHBsaWVkIHRvIFJlYWN0IGNvbXBvbmVudHMuIEV4YW1wbGUgdXNhZ2U6XG4gICAqXG4gICAqICAgdmFyIFByb3BzID0gcmVxdWlyZSgnUmVhY3RQcm9wVHlwZXMnKTtcbiAgICogICB2YXIgTXlBcnRpY2xlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgKiAgICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgIC8vIEFuIG9wdGlvbmFsIHN0cmluZyBwcm9wIG5hbWVkIFwiZGVzY3JpcHRpb25cIi5cbiAgICogICAgICAgZGVzY3JpcHRpb246IFByb3BzLnN0cmluZyxcbiAgICpcbiAgICogICAgICAgLy8gQSByZXF1aXJlZCBlbnVtIHByb3AgbmFtZWQgXCJjYXRlZ29yeVwiLlxuICAgKiAgICAgICBjYXRlZ29yeTogUHJvcHMub25lT2YoWydOZXdzJywnUGhvdG9zJ10pLmlzUmVxdWlyZWQsXG4gICAqXG4gICAqICAgICAgIC8vIEEgcHJvcCBuYW1lZCBcImRpYWxvZ1wiIHRoYXQgcmVxdWlyZXMgYW4gaW5zdGFuY2Ugb2YgRGlhbG9nLlxuICAgKiAgICAgICBkaWFsb2c6IFByb3BzLmluc3RhbmNlT2YoRGlhbG9nKS5pc1JlcXVpcmVkXG4gICAqICAgICB9LFxuICAgKiAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHsgLi4uIH1cbiAgICogICB9KTtcbiAgICpcbiAgICogQSBtb3JlIGZvcm1hbCBzcGVjaWZpY2F0aW9uIG9mIGhvdyB0aGVzZSBtZXRob2RzIGFyZSB1c2VkOlxuICAgKlxuICAgKiAgIHR5cGUgOj0gYXJyYXl8Ym9vbHxmdW5jfG9iamVjdHxudW1iZXJ8c3RyaW5nfG9uZU9mKFsuLi5dKXxpbnN0YW5jZU9mKC4uLilcbiAgICogICBkZWNsIDo9IFJlYWN0UHJvcFR5cGVzLnt0eXBlfSguaXNSZXF1aXJlZCk/XG4gICAqXG4gICAqIEVhY2ggYW5kIGV2ZXJ5IGRlY2xhcmF0aW9uIHByb2R1Y2VzIGEgZnVuY3Rpb24gd2l0aCB0aGUgc2FtZSBzaWduYXR1cmUuIFRoaXNcbiAgICogYWxsb3dzIHRoZSBjcmVhdGlvbiBvZiBjdXN0b20gdmFsaWRhdGlvbiBmdW5jdGlvbnMuIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiAgdmFyIE15TGluayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICogICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIG9yIFVSSSBwcm9wIG5hbWVkIFwiaHJlZlwiLlxuICAgKiAgICAgIGhyZWY6IGZ1bmN0aW9uKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSkge1xuICAgKiAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICogICAgICAgIGlmIChwcm9wVmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgcHJvcFZhbHVlICE9PSAnc3RyaW5nJyAmJlxuICAgKiAgICAgICAgICAgICEocHJvcFZhbHVlIGluc3RhbmNlb2YgVVJJKSkge1xuICAgKiAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFxuICAgKiAgICAgICAgICAgICdFeHBlY3RlZCBhIHN0cmluZyBvciBhbiBVUkkgZm9yICcgKyBwcm9wTmFtZSArICcgaW4gJyArXG4gICAqICAgICAgICAgICAgY29tcG9uZW50TmFtZVxuICAgKiAgICAgICAgICApO1xuICAgKiAgICAgICAgfVxuICAgKiAgICAgIH1cbiAgICogICAgfSxcbiAgICogICAgcmVuZGVyOiBmdW5jdGlvbigpIHsuLi59XG4gICAqICB9KTtcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuXG4gIHZhciBBTk9OWU1PVVMgPSAnPDxhbm9ueW1vdXM+Pic7XG5cbiAgLy8gSW1wb3J0YW50IVxuICAvLyBLZWVwIHRoaXMgbGlzdCBpbiBzeW5jIHdpdGggcHJvZHVjdGlvbiB2ZXJzaW9uIGluIGAuL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcy5qc2AuXG4gIHZhciBSZWFjdFByb3BUeXBlcyA9IHtcbiAgICBhcnJheTogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2FycmF5JyksXG4gICAgYmlnaW50OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYmlnaW50JyksXG4gICAgYm9vbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Jvb2xlYW4nKSxcbiAgICBmdW5jOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignZnVuY3Rpb24nKSxcbiAgICBudW1iZXI6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdudW1iZXInKSxcbiAgICBvYmplY3Q6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdvYmplY3QnKSxcbiAgICBzdHJpbmc6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzdHJpbmcnKSxcbiAgICBzeW1ib2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzeW1ib2wnKSxcblxuICAgIGFueTogY3JlYXRlQW55VHlwZUNoZWNrZXIoKSxcbiAgICBhcnJheU9mOiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIsXG4gICAgZWxlbWVudDogY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCksXG4gICAgZWxlbWVudFR5cGU6IGNyZWF0ZUVsZW1lbnRUeXBlVHlwZUNoZWNrZXIoKSxcbiAgICBpbnN0YW5jZU9mOiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyLFxuICAgIG5vZGU6IGNyZWF0ZU5vZGVDaGVja2VyKCksXG4gICAgb2JqZWN0T2Y6IGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIsXG4gICAgb25lT2Y6IGNyZWF0ZUVudW1UeXBlQ2hlY2tlcixcbiAgICBvbmVPZlR5cGU6IGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIsXG4gICAgc2hhcGU6IGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXIsXG4gICAgZXhhY3Q6IGNyZWF0ZVN0cmljdFNoYXBlVHlwZUNoZWNrZXIsXG4gIH07XG5cbiAgLyoqXG4gICAqIGlubGluZWQgT2JqZWN0LmlzIHBvbHlmaWxsIHRvIGF2b2lkIHJlcXVpcmluZyBjb25zdW1lcnMgc2hpcCB0aGVpciBvd25cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2lzXG4gICAqL1xuICAvKmVzbGludC1kaXNhYmxlIG5vLXNlbGYtY29tcGFyZSovXG4gIGZ1bmN0aW9uIGlzKHgsIHkpIHtcbiAgICAvLyBTYW1lVmFsdWUgYWxnb3JpdGhtXG4gICAgaWYgKHggPT09IHkpIHtcbiAgICAgIC8vIFN0ZXBzIDEtNSwgNy0xMFxuICAgICAgLy8gU3RlcHMgNi5iLTYuZTogKzAgIT0gLTBcbiAgICAgIHJldHVybiB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU3RlcCA2LmE6IE5hTiA9PSBOYU5cbiAgICAgIHJldHVybiB4ICE9PSB4ICYmIHkgIT09IHk7XG4gICAgfVxuICB9XG4gIC8qZXNsaW50LWVuYWJsZSBuby1zZWxmLWNvbXBhcmUqL1xuXG4gIC8qKlxuICAgKiBXZSB1c2UgYW4gRXJyb3ItbGlrZSBvYmplY3QgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgYXMgcGVvcGxlIG1heSBjYWxsXG4gICAqIFByb3BUeXBlcyBkaXJlY3RseSBhbmQgaW5zcGVjdCB0aGVpciBvdXRwdXQuIEhvd2V2ZXIsIHdlIGRvbid0IHVzZSByZWFsXG4gICAqIEVycm9ycyBhbnltb3JlLiBXZSBkb24ndCBpbnNwZWN0IHRoZWlyIHN0YWNrIGFueXdheSwgYW5kIGNyZWF0aW5nIHRoZW1cbiAgICogaXMgcHJvaGliaXRpdmVseSBleHBlbnNpdmUgaWYgdGhleSBhcmUgY3JlYXRlZCB0b28gb2Z0ZW4sIHN1Y2ggYXMgd2hhdFxuICAgKiBoYXBwZW5zIGluIG9uZU9mVHlwZSgpIGZvciBhbnkgdHlwZSBiZWZvcmUgdGhlIG9uZSB0aGF0IG1hdGNoZWQuXG4gICAqL1xuICBmdW5jdGlvbiBQcm9wVHlwZUVycm9yKG1lc3NhZ2UsIGRhdGEpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMuZGF0YSA9IGRhdGEgJiYgdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnID8gZGF0YToge307XG4gICAgdGhpcy5zdGFjayA9ICcnO1xuICB9XG4gIC8vIE1ha2UgYGluc3RhbmNlb2YgRXJyb3JgIHN0aWxsIHdvcmsgZm9yIHJldHVybmVkIGVycm9ycy5cbiAgUHJvcFR5cGVFcnJvci5wcm90b3R5cGUgPSBFcnJvci5wcm90b3R5cGU7XG5cbiAgZnVuY3Rpb24gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdmFyIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlID0ge307XG4gICAgICB2YXIgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPSAwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjaGVja1R5cGUoaXNSZXF1aXJlZCwgcHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICAgIGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnROYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgIHByb3BGdWxsTmFtZSA9IHByb3BGdWxsTmFtZSB8fCBwcm9wTmFtZTtcblxuICAgICAgaWYgKHNlY3JldCAhPT0gUmVhY3RQcm9wVHlwZXNTZWNyZXQpIHtcbiAgICAgICAgaWYgKHRocm93T25EaXJlY3RBY2Nlc3MpIHtcbiAgICAgICAgICAvLyBOZXcgYmVoYXZpb3Igb25seSBmb3IgdXNlcnMgb2YgYHByb3AtdHlwZXNgIHBhY2thZ2VcbiAgICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKFxuICAgICAgICAgICAgJ0NhbGxpbmcgUHJvcFR5cGVzIHZhbGlkYXRvcnMgZGlyZWN0bHkgaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgJ1VzZSBgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKClgIHRvIGNhbGwgdGhlbS4gJyArXG4gICAgICAgICAgICAnUmVhZCBtb3JlIGF0IGh0dHA6Ly9mYi5tZS91c2UtY2hlY2stcHJvcC10eXBlcydcbiAgICAgICAgICApO1xuICAgICAgICAgIGVyci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIC8vIE9sZCBiZWhhdmlvciBmb3IgcGVvcGxlIHVzaW5nIFJlYWN0LlByb3BUeXBlc1xuICAgICAgICAgIHZhciBjYWNoZUtleSA9IGNvbXBvbmVudE5hbWUgKyAnOicgKyBwcm9wTmFtZTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGVbY2FjaGVLZXldICYmXG4gICAgICAgICAgICAvLyBBdm9pZCBzcGFtbWluZyB0aGUgY29uc29sZSBiZWNhdXNlIHRoZXkgYXJlIG9mdGVuIG5vdCBhY3Rpb25hYmxlIGV4Y2VwdCBmb3IgbGliIGF1dGhvcnNcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50IDwgM1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgICAnWW91IGFyZSBtYW51YWxseSBjYWxsaW5nIGEgUmVhY3QuUHJvcFR5cGVzIHZhbGlkYXRpb24gJyArXG4gICAgICAgICAgICAgICdmdW5jdGlvbiBmb3IgdGhlIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgcHJvcCBvbiBgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4gVGhpcyBpcyBkZXByZWNhdGVkICcgK1xuICAgICAgICAgICAgICAnYW5kIHdpbGwgdGhyb3cgaW4gdGhlIHN0YW5kYWxvbmUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgICAnWW91IG1heSBiZSBzZWVpbmcgdGhpcyB3YXJuaW5nIGR1ZSB0byBhIHRoaXJkLXBhcnR5IFByb3BUeXBlcyAnICtcbiAgICAgICAgICAgICAgJ2xpYnJhcnkuIFNlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmctZG9udC1jYWxsLXByb3B0eXBlcyAnICsgJ2ZvciBkZXRhaWxzLidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZUNhbGxDYWNoZVtjYWNoZUtleV0gPSB0cnVlO1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT0gbnVsbCkge1xuICAgICAgICBpZiAoaXNSZXF1aXJlZCkge1xuICAgICAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignVGhlICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBpcyBtYXJrZWQgYXMgcmVxdWlyZWQgJyArICgnaW4gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGJ1dCBpdHMgdmFsdWUgaXMgYG51bGxgLicpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdUaGUgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCBpbiAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgYnV0IGl0cyB2YWx1ZSBpcyBgdW5kZWZpbmVkYC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY2hhaW5lZENoZWNrVHlwZSA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIGZhbHNlKTtcbiAgICBjaGFpbmVkQ2hlY2tUeXBlLmlzUmVxdWlyZWQgPSBjaGVja1R5cGUuYmluZChudWxsLCB0cnVlKTtcblxuICAgIHJldHVybiBjaGFpbmVkQ2hlY2tUeXBlO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoZXhwZWN0ZWRUeXBlKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSBleHBlY3RlZFR5cGUpIHtcbiAgICAgICAgLy8gYHByb3BWYWx1ZWAgYmVpbmcgaW5zdGFuY2Ugb2YsIHNheSwgZGF0ZS9yZWdleHAsIHBhc3MgdGhlICdvYmplY3QnXG4gICAgICAgIC8vIGNoZWNrLCBidXQgd2UgY2FuIG9mZmVyIGEgbW9yZSBwcmVjaXNlIGVycm9yIG1lc3NhZ2UgaGVyZSByYXRoZXIgdGhhblxuICAgICAgICAvLyAnb2YgdHlwZSBgb2JqZWN0YCcuXG4gICAgICAgIHZhciBwcmVjaXNlVHlwZSA9IGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFxuICAgICAgICAgICdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJlY2lzZVR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2AnICsgZXhwZWN0ZWRUeXBlICsgJ2AuJyksXG4gICAgICAgICAge2V4cGVjdGVkVHlwZTogZXhwZWN0ZWRUeXBlfVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpIHtcbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIoZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbCk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgYXJyYXlPZi4nKTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBhcnJheS4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BWYWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnWycgKyBpICsgJ10nLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIWlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBzaW5nbGUgUmVhY3RFbGVtZW50LicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudFR5cGVUeXBlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIVJlYWN0SXMuaXNWYWxpZEVsZW1lbnRUeXBlKHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBzaW5nbGUgUmVhY3RFbGVtZW50IHR5cGUuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyKGV4cGVjdGVkQ2xhc3MpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICghKHByb3BzW3Byb3BOYW1lXSBpbnN0YW5jZW9mIGV4cGVjdGVkQ2xhc3MpKSB7XG4gICAgICAgIHZhciBleHBlY3RlZENsYXNzTmFtZSA9IGV4cGVjdGVkQ2xhc3MubmFtZSB8fCBBTk9OWU1PVVM7XG4gICAgICAgIHZhciBhY3R1YWxDbGFzc05hbWUgPSBnZXRDbGFzc05hbWUocHJvcHNbcHJvcE5hbWVdKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgYWN0dWFsQ2xhc3NOYW1lICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkICcpICsgKCdpbnN0YW5jZSBvZiBgJyArIGV4cGVjdGVkQ2xhc3NOYW1lICsgJ2AuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIoZXhwZWN0ZWRWYWx1ZXMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZXhwZWN0ZWRWYWx1ZXMpKSB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBwcmludFdhcm5pbmcoXG4gICAgICAgICAgICAnSW52YWxpZCBhcmd1bWVudHMgc3VwcGxpZWQgdG8gb25lT2YsIGV4cGVjdGVkIGFuIGFycmF5LCBnb3QgJyArIGFyZ3VtZW50cy5sZW5ndGggKyAnIGFyZ3VtZW50cy4gJyArXG4gICAgICAgICAgICAnQSBjb21tb24gbWlzdGFrZSBpcyB0byB3cml0ZSBvbmVPZih4LCB5LCB6KSBpbnN0ZWFkIG9mIG9uZU9mKFt4LCB5LCB6XSkuJ1xuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJpbnRXYXJuaW5nKCdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mLCBleHBlY3RlZCBhbiBhcnJheS4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBleHBlY3RlZFZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaXMocHJvcFZhbHVlLCBleHBlY3RlZFZhbHVlc1tpXSkpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgdmFsdWVzU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZXhwZWN0ZWRWYWx1ZXMsIGZ1bmN0aW9uIHJlcGxhY2VyKGtleSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBnZXRQcmVjaXNlVHlwZSh2YWx1ZSk7XG4gICAgICAgIGlmICh0eXBlID09PSAnc3ltYm9sJykge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB2YWx1ZSBgJyArIFN0cmluZyhwcm9wVmFsdWUpICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIG9uZSBvZiAnICsgdmFsdWVzU3RyaW5nICsgJy4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHR5cGVDaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignUHJvcGVydHkgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiBjb21wb25lbnQgYCcgKyBjb21wb25lbnROYW1lICsgJ2AgaGFzIGludmFsaWQgUHJvcFR5cGUgbm90YXRpb24gaW5zaWRlIG9iamVjdE9mLicpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIG9iamVjdC4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcFZhbHVlKSB7XG4gICAgICAgIGlmIChoYXMocHJvcFZhbHVlLCBrZXkpKSB7XG4gICAgICAgICAgdmFyIGVycm9yID0gdHlwZUNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVVbmlvblR5cGVDaGVja2VyKGFycmF5T2ZUeXBlQ2hlY2tlcnMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXlPZlR5cGVDaGVja2VycykpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBwcmludFdhcm5pbmcoJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2ZUeXBlLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKSA6IHZvaWQgMDtcbiAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlPZlR5cGVDaGVja2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuICAgICAgaWYgKHR5cGVvZiBjaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAnSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZlR5cGUuIEV4cGVjdGVkIGFuIGFycmF5IG9mIGNoZWNrIGZ1bmN0aW9ucywgYnV0ICcgK1xuICAgICAgICAgICdyZWNlaXZlZCAnICsgZ2V0UG9zdGZpeEZvclR5cGVXYXJuaW5nKGNoZWNrZXIpICsgJyBhdCBpbmRleCAnICsgaSArICcuJ1xuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBleHBlY3RlZFR5cGVzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuICAgICAgICB2YXIgY2hlY2tlclJlc3VsdCA9IGNoZWNrZXIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIGlmIChjaGVja2VyUmVzdWx0ID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hlY2tlclJlc3VsdC5kYXRhICYmIGhhcyhjaGVja2VyUmVzdWx0LmRhdGEsICdleHBlY3RlZFR5cGUnKSkge1xuICAgICAgICAgIGV4cGVjdGVkVHlwZXMucHVzaChjaGVja2VyUmVzdWx0LmRhdGEuZXhwZWN0ZWRUeXBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIGV4cGVjdGVkVHlwZXNNZXNzYWdlID0gKGV4cGVjdGVkVHlwZXMubGVuZ3RoID4gMCkgPyAnLCBleHBlY3RlZCBvbmUgb2YgdHlwZSBbJyArIGV4cGVjdGVkVHlwZXMuam9pbignLCAnKSArICddJzogJyc7XG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHN1cHBsaWVkIHRvICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgJyArIGV4cGVjdGVkVHlwZXNNZXNzYWdlICsgJy4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVOb2RlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICghaXNOb2RlKHByb3BzW3Byb3BOYW1lXSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBSZWFjdE5vZGUuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbnZhbGlkVmFsaWRhdG9yRXJyb3IoY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwga2V5LCB0eXBlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFxuICAgICAgKGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJykgKyAnOiAnICsgbG9jYXRpb24gKyAnIHR5cGUgYCcgKyBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXkgKyAnYCBpcyBpbnZhbGlkOyAnICtcbiAgICAgICdpdCBtdXN0IGJlIGEgZnVuY3Rpb24sIHVzdWFsbHkgZnJvbSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UsIGJ1dCByZWNlaXZlZCBgJyArIHR5cGUgKyAnYC4nXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXIoc2hhcGVUeXBlcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSBgJyArIHByb3BUeXBlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGBvYmplY3RgLicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGtleSBpbiBzaGFwZVR5cGVzKSB7XG4gICAgICAgIHZhciBjaGVja2VyID0gc2hhcGVUeXBlc1trZXldO1xuICAgICAgICBpZiAodHlwZW9mIGNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gaW52YWxpZFZhbGlkYXRvckVycm9yKGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIGtleSwgZ2V0UHJlY2lzZVR5cGUoY2hlY2tlcikpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVN0cmljdFNoYXBlVHlwZUNoZWNrZXIoc2hhcGVUeXBlcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSBgJyArIHByb3BUeXBlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGBvYmplY3RgLicpKTtcbiAgICAgIH1cbiAgICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgYWxsIGtleXMgaW4gY2FzZSBzb21lIGFyZSByZXF1aXJlZCBidXQgbWlzc2luZyBmcm9tIHByb3BzLlxuICAgICAgdmFyIGFsbEtleXMgPSBhc3NpZ24oe30sIHByb3BzW3Byb3BOYW1lXSwgc2hhcGVUeXBlcyk7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gYWxsS2V5cykge1xuICAgICAgICB2YXIgY2hlY2tlciA9IHNoYXBlVHlwZXNba2V5XTtcbiAgICAgICAgaWYgKGhhcyhzaGFwZVR5cGVzLCBrZXkpICYmIHR5cGVvZiBjaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIGludmFsaWRWYWxpZGF0b3JFcnJvcihjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBrZXksIGdldFByZWNpc2VUeXBlKGNoZWNrZXIpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNoZWNrZXIpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoXG4gICAgICAgICAgICAnSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Aga2V5IGAnICsga2V5ICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AuJyArXG4gICAgICAgICAgICAnXFxuQmFkIG9iamVjdDogJyArIEpTT04uc3RyaW5naWZ5KHByb3BzW3Byb3BOYW1lXSwgbnVsbCwgJyAgJykgK1xuICAgICAgICAgICAgJ1xcblZhbGlkIGtleXM6ICcgKyBKU09OLnN0cmluZ2lmeShPYmplY3Qua2V5cyhzaGFwZVR5cGVzKSwgbnVsbCwgJyAgJylcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNOb2RlKHByb3BWYWx1ZSkge1xuICAgIHN3aXRjaCAodHlwZW9mIHByb3BWYWx1ZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICByZXR1cm4gIXByb3BWYWx1ZTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcFZhbHVlLmV2ZXJ5KGlzTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BWYWx1ZSA9PT0gbnVsbCB8fCBpc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4ocHJvcFZhbHVlKTtcbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwocHJvcFZhbHVlKTtcbiAgICAgICAgICB2YXIgc3RlcDtcbiAgICAgICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gcHJvcFZhbHVlLmVudHJpZXMpIHtcbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgaWYgKCFpc05vZGUoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSXRlcmF0b3Igd2lsbCBwcm92aWRlIGVudHJ5IFtrLHZdIHR1cGxlcyByYXRoZXIgdGhhbiB2YWx1ZXMuXG4gICAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgICAgIGlmICghaXNOb2RlKGVudHJ5WzFdKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSB7XG4gICAgLy8gTmF0aXZlIFN5bWJvbC5cbiAgICBpZiAocHJvcFR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBmYWxzeSB2YWx1ZSBjYW4ndCBiZSBhIFN5bWJvbFxuICAgIGlmICghcHJvcFZhbHVlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gMTkuNC4zLjUgU3ltYm9sLnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXSA9PT0gJ1N5bWJvbCdcbiAgICBpZiAocHJvcFZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBGYWxsYmFjayBmb3Igbm9uLXNwZWMgY29tcGxpYW50IFN5bWJvbHMgd2hpY2ggYXJlIHBvbHlmaWxsZWQuXG4gICAgaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgcHJvcFZhbHVlIGluc3RhbmNlb2YgU3ltYm9sKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBFcXVpdmFsZW50IG9mIGB0eXBlb2ZgIGJ1dCB3aXRoIHNwZWNpYWwgaGFuZGxpbmcgZm9yIGFycmF5IGFuZCByZWdleHAuXG4gIGZ1bmN0aW9uIGdldFByb3BUeXBlKHByb3BWYWx1ZSkge1xuICAgIHZhciBwcm9wVHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuICdhcnJheSc7XG4gICAgfVxuICAgIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgIC8vIE9sZCB3ZWJraXRzIChhdCBsZWFzdCB1bnRpbCBBbmRyb2lkIDQuMCkgcmV0dXJuICdmdW5jdGlvbicgcmF0aGVyIHRoYW5cbiAgICAgIC8vICdvYmplY3QnIGZvciB0eXBlb2YgYSBSZWdFeHAuIFdlJ2xsIG5vcm1hbGl6ZSB0aGlzIGhlcmUgc28gdGhhdCAvYmxhL1xuICAgICAgLy8gcGFzc2VzIFByb3BUeXBlcy5vYmplY3QuXG4gICAgICByZXR1cm4gJ29iamVjdCc7XG4gICAgfVxuICAgIGlmIChpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuICdzeW1ib2wnO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcFR5cGU7XG4gIH1cblxuICAvLyBUaGlzIGhhbmRsZXMgbW9yZSB0eXBlcyB0aGFuIGBnZXRQcm9wVHlwZWAuIE9ubHkgdXNlZCBmb3IgZXJyb3IgbWVzc2FnZXMuXG4gIC8vIFNlZSBgY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXJgLlxuICBmdW5jdGlvbiBnZXRQcmVjaXNlVHlwZShwcm9wVmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHByb3BWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgcHJvcFZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gJycgKyBwcm9wVmFsdWU7XG4gICAgfVxuICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgaWYgKHByb3BUeXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgcmV0dXJuICdkYXRlJztcbiAgICAgIH0gZWxzZSBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgIHJldHVybiAncmVnZXhwJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb3BUeXBlO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHBvc3RmaXhlZCB0byBhIHdhcm5pbmcgYWJvdXQgYW4gaW52YWxpZCB0eXBlLlxuICAvLyBGb3IgZXhhbXBsZSwgXCJ1bmRlZmluZWRcIiBvciBcIm9mIHR5cGUgYXJyYXlcIlxuICBmdW5jdGlvbiBnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmcodmFsdWUpIHtcbiAgICB2YXIgdHlwZSA9IGdldFByZWNpc2VUeXBlKHZhbHVlKTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIHJldHVybiAnYW4gJyArIHR5cGU7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgY2FzZSAncmVnZXhwJzpcbiAgICAgICAgcmV0dXJuICdhICcgKyB0eXBlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0dXJucyBjbGFzcyBuYW1lIG9mIHRoZSBvYmplY3QsIGlmIGFueS5cbiAgZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lKHByb3BWYWx1ZSkge1xuICAgIGlmICghcHJvcFZhbHVlLmNvbnN0cnVjdG9yIHx8ICFwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZSkge1xuICAgICAgcmV0dXJuIEFOT05ZTU9VUztcbiAgICB9XG4gICAgcmV0dXJuIHByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICB9XG5cbiAgUmVhY3RQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMgPSBjaGVja1Byb3BUeXBlcztcbiAgUmVhY3RQcm9wVHlwZXMucmVzZXRXYXJuaW5nQ2FjaGUgPSBjaGVja1Byb3BUeXBlcy5yZXNldFdhcm5pbmdDYWNoZTtcbiAgUmVhY3RQcm9wVHlwZXMuUHJvcFR5cGVzID0gUmVhY3RQcm9wVHlwZXM7XG5cbiAgcmV0dXJuIFJlYWN0UHJvcFR5cGVzO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIFJlYWN0SXMgPSByZXF1aXJlKCdyZWFjdC1pcycpO1xuXG4gIC8vIEJ5IGV4cGxpY2l0bHkgdXNpbmcgYHByb3AtdHlwZXNgIHlvdSBhcmUgb3B0aW5nIGludG8gbmV3IGRldmVsb3BtZW50IGJlaGF2aW9yLlxuICAvLyBodHRwOi8vZmIubWUvcHJvcC10eXBlcy1pbi1wcm9kXG4gIHZhciB0aHJvd09uRGlyZWN0QWNjZXNzID0gdHJ1ZTtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzJykoUmVhY3RJcy5pc0VsZW1lbnQsIHRocm93T25EaXJlY3RBY2Nlc3MpO1xufSBlbHNlIHtcbiAgLy8gQnkgZXhwbGljaXRseSB1c2luZyBgcHJvcC10eXBlc2AgeW91IGFyZSBvcHRpbmcgaW50byBuZXcgcHJvZHVjdGlvbiBiZWhhdmlvci5cbiAgLy8gaHR0cDovL2ZiLm1lL3Byb3AtdHlwZXMtaW4tcHJvZFxuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZmFjdG9yeVdpdGhUaHJvd2luZ1NoaW1zJykoKTtcbn1cbiIsIi8qKiBAbGljZW5zZSBSZWFjdCB2MTcuMC4yXG4gKiByZWFjdC1pcy5kZXZlbG9wbWVudC5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbi8vIEFUVEVOVElPTlxuLy8gV2hlbiBhZGRpbmcgbmV3IHN5bWJvbHMgdG8gdGhpcyBmaWxlLFxuLy8gUGxlYXNlIGNvbnNpZGVyIGFsc28gYWRkaW5nIHRvICdyZWFjdC1kZXZ0b29scy1zaGFyZWQvc3JjL2JhY2tlbmQvUmVhY3RTeW1ib2xzJ1xuLy8gVGhlIFN5bWJvbCB1c2VkIHRvIHRhZyB0aGUgUmVhY3RFbGVtZW50LWxpa2UgdHlwZXMuIElmIHRoZXJlIGlzIG5vIG5hdGl2ZSBTeW1ib2xcbi8vIG5vciBwb2x5ZmlsbCwgdGhlbiBhIHBsYWluIG51bWJlciBpcyB1c2VkIGZvciBwZXJmb3JtYW5jZS5cbnZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSAweGVhYzc7XG52YXIgUkVBQ1RfUE9SVEFMX1RZUEUgPSAweGVhY2E7XG52YXIgUkVBQ1RfRlJBR01FTlRfVFlQRSA9IDB4ZWFjYjtcbnZhciBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFID0gMHhlYWNjO1xudmFyIFJFQUNUX1BST0ZJTEVSX1RZUEUgPSAweGVhZDI7XG52YXIgUkVBQ1RfUFJPVklERVJfVFlQRSA9IDB4ZWFjZDtcbnZhciBSRUFDVF9DT05URVhUX1RZUEUgPSAweGVhY2U7XG52YXIgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSA9IDB4ZWFkMDtcbnZhciBSRUFDVF9TVVNQRU5TRV9UWVBFID0gMHhlYWQxO1xudmFyIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSA9IDB4ZWFkODtcbnZhciBSRUFDVF9NRU1PX1RZUEUgPSAweGVhZDM7XG52YXIgUkVBQ1RfTEFaWV9UWVBFID0gMHhlYWQ0O1xudmFyIFJFQUNUX0JMT0NLX1RZUEUgPSAweGVhZDk7XG52YXIgUkVBQ1RfU0VSVkVSX0JMT0NLX1RZUEUgPSAweGVhZGE7XG52YXIgUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSA9IDB4ZWFkNTtcbnZhciBSRUFDVF9TQ09QRV9UWVBFID0gMHhlYWQ3O1xudmFyIFJFQUNUX09QQVFVRV9JRF9UWVBFID0gMHhlYWUwO1xudmFyIFJFQUNUX0RFQlVHX1RSQUNJTkdfTU9ERV9UWVBFID0gMHhlYWUxO1xudmFyIFJFQUNUX09GRlNDUkVFTl9UWVBFID0gMHhlYWUyO1xudmFyIFJFQUNUX0xFR0FDWV9ISURERU5fVFlQRSA9IDB4ZWFlMztcblxuaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLmZvcikge1xuICB2YXIgc3ltYm9sRm9yID0gU3ltYm9sLmZvcjtcbiAgUkVBQ1RfRUxFTUVOVF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5lbGVtZW50Jyk7XG4gIFJFQUNUX1BPUlRBTF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5wb3J0YWwnKTtcbiAgUkVBQ1RfRlJBR01FTlRfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QuZnJhZ21lbnQnKTtcbiAgUkVBQ1RfU1RSSUNUX01PREVfVFlQRSA9IHN5bWJvbEZvcigncmVhY3Quc3RyaWN0X21vZGUnKTtcbiAgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QucHJvZmlsZXInKTtcbiAgUkVBQ1RfUFJPVklERVJfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QucHJvdmlkZXInKTtcbiAgUkVBQ1RfQ09OVEVYVF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5jb250ZXh0Jyk7XG4gIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmZvcndhcmRfcmVmJyk7XG4gIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LnN1c3BlbnNlJyk7XG4gIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSA9IHN5bWJvbEZvcigncmVhY3Quc3VzcGVuc2VfbGlzdCcpO1xuICBSRUFDVF9NRU1PX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0Lm1lbW8nKTtcbiAgUkVBQ1RfTEFaWV9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5sYXp5Jyk7XG4gIFJFQUNUX0JMT0NLX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmJsb2NrJyk7XG4gIFJFQUNUX1NFUlZFUl9CTE9DS19UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5zZXJ2ZXIuYmxvY2snKTtcbiAgUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QuZnVuZGFtZW50YWwnKTtcbiAgUkVBQ1RfU0NPUEVfVFlQRSA9IHN5bWJvbEZvcigncmVhY3Quc2NvcGUnKTtcbiAgUkVBQ1RfT1BBUVVFX0lEX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0Lm9wYXF1ZS5pZCcpO1xuICBSRUFDVF9ERUJVR19UUkFDSU5HX01PREVfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QuZGVidWdfdHJhY2VfbW9kZScpO1xuICBSRUFDVF9PRkZTQ1JFRU5fVFlQRSA9IHN5bWJvbEZvcigncmVhY3Qub2Zmc2NyZWVuJyk7XG4gIFJFQUNUX0xFR0FDWV9ISURERU5fVFlQRSA9IHN5bWJvbEZvcigncmVhY3QubGVnYWN5X2hpZGRlbicpO1xufVxuXG4vLyBGaWx0ZXIgY2VydGFpbiBET00gYXR0cmlidXRlcyAoZS5nLiBzcmMsIGhyZWYpIGlmIHRoZWlyIHZhbHVlcyBhcmUgZW1wdHkgc3RyaW5ncy5cblxudmFyIGVuYWJsZVNjb3BlQVBJID0gZmFsc2U7IC8vIEV4cGVyaW1lbnRhbCBDcmVhdGUgRXZlbnQgSGFuZGxlIEFQSS5cblxuZnVuY3Rpb24gaXNWYWxpZEVsZW1lbnRUeXBlKHR5cGUpIHtcbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9IC8vIE5vdGU6IHR5cGVvZiBtaWdodCBiZSBvdGhlciB0aGFuICdzeW1ib2wnIG9yICdudW1iZXInIChlLmcuIGlmIGl0J3MgYSBwb2x5ZmlsbCkuXG5cblxuICBpZiAodHlwZSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9QUk9GSUxFUl9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX0RFQlVHX1RSQUNJTkdfTU9ERV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1VTUEVOU0VfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfTEVHQUNZX0hJRERFTl9UWVBFIHx8IGVuYWJsZVNjb3BlQVBJICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiB0eXBlICE9PSBudWxsKSB7XG4gICAgaWYgKHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0xBWllfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfUFJPVklERVJfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9DT05URVhUX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0JMT0NLX1RZUEUgfHwgdHlwZVswXSA9PT0gUkVBQ1RfU0VSVkVSX0JMT0NLX1RZUEUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gdHlwZU9mKG9iamVjdCkge1xuICBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0ICE9PSBudWxsKSB7XG4gICAgdmFyICQkdHlwZW9mID0gb2JqZWN0LiQkdHlwZW9mO1xuXG4gICAgc3dpdGNoICgkJHR5cGVvZikge1xuICAgICAgY2FzZSBSRUFDVF9FTEVNRU5UX1RZUEU6XG4gICAgICAgIHZhciB0eXBlID0gb2JqZWN0LnR5cGU7XG5cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgY2FzZSBSRUFDVF9GUkFHTUVOVF9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfUFJPRklMRVJfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX1NUUklDVF9NT0RFX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFOlxuICAgICAgICAgICAgcmV0dXJuIHR5cGU7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdmFyICQkdHlwZW9mVHlwZSA9IHR5cGUgJiYgdHlwZS4kJHR5cGVvZjtcblxuICAgICAgICAgICAgc3dpdGNoICgkJHR5cGVvZlR5cGUpIHtcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9DT05URVhUX1RZUEU6XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTpcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9MQVpZX1RZUEU6XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfTUVNT19UWVBFOlxuICAgICAgICAgICAgICBjYXNlIFJFQUNUX1BST1ZJREVSX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuICQkdHlwZW9mVHlwZTtcblxuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiAkJHR5cGVvZjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgIGNhc2UgUkVBQ1RfUE9SVEFMX1RZUEU6XG4gICAgICAgIHJldHVybiAkJHR5cGVvZjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxudmFyIENvbnRleHRDb25zdW1lciA9IFJFQUNUX0NPTlRFWFRfVFlQRTtcbnZhciBDb250ZXh0UHJvdmlkZXIgPSBSRUFDVF9QUk9WSURFUl9UWVBFO1xudmFyIEVsZW1lbnQgPSBSRUFDVF9FTEVNRU5UX1RZUEU7XG52YXIgRm9yd2FyZFJlZiA9IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU7XG52YXIgRnJhZ21lbnQgPSBSRUFDVF9GUkFHTUVOVF9UWVBFO1xudmFyIExhenkgPSBSRUFDVF9MQVpZX1RZUEU7XG52YXIgTWVtbyA9IFJFQUNUX01FTU9fVFlQRTtcbnZhciBQb3J0YWwgPSBSRUFDVF9QT1JUQUxfVFlQRTtcbnZhciBQcm9maWxlciA9IFJFQUNUX1BST0ZJTEVSX1RZUEU7XG52YXIgU3RyaWN0TW9kZSA9IFJFQUNUX1NUUklDVF9NT0RFX1RZUEU7XG52YXIgU3VzcGVuc2UgPSBSRUFDVF9TVVNQRU5TRV9UWVBFO1xudmFyIGhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlID0gZmFsc2U7XG52YXIgaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNDb25jdXJyZW50TW9kZSA9IGZhbHNlOyAvLyBBc3luY01vZGUgc2hvdWxkIGJlIGRlcHJlY2F0ZWRcblxuZnVuY3Rpb24gaXNBc3luY01vZGUob2JqZWN0KSB7XG4gIHtcbiAgICBpZiAoIWhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlKSB7XG4gICAgICBoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0FzeW5jTW9kZSA9IHRydWU7IC8vIFVzaW5nIGNvbnNvbGVbJ3dhcm4nXSB0byBldmFkZSBCYWJlbCBhbmQgRVNMaW50XG5cbiAgICAgIGNvbnNvbGVbJ3dhcm4nXSgnVGhlIFJlYWN0SXMuaXNBc3luY01vZGUoKSBhbGlhcyBoYXMgYmVlbiBkZXByZWNhdGVkLCAnICsgJ2FuZCB3aWxsIGJlIHJlbW92ZWQgaW4gUmVhY3QgMTgrLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIGlzQ29uY3VycmVudE1vZGUob2JqZWN0KSB7XG4gIHtcbiAgICBpZiAoIWhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQ29uY3VycmVudE1vZGUpIHtcbiAgICAgIGhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQ29uY3VycmVudE1vZGUgPSB0cnVlOyAvLyBVc2luZyBjb25zb2xlWyd3YXJuJ10gdG8gZXZhZGUgQmFiZWwgYW5kIEVTTGludFxuXG4gICAgICBjb25zb2xlWyd3YXJuJ10oJ1RoZSBSZWFjdElzLmlzQ29uY3VycmVudE1vZGUoKSBhbGlhcyBoYXMgYmVlbiBkZXByZWNhdGVkLCAnICsgJ2FuZCB3aWxsIGJlIHJlbW92ZWQgaW4gUmVhY3QgMTgrLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIGlzQ29udGV4dENvbnN1bWVyKG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0NPTlRFWFRfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzQ29udGV4dFByb3ZpZGVyKG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX1BST1ZJREVSX1RZUEU7XG59XG5mdW5jdGlvbiBpc0VsZW1lbnQob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QgIT09IG51bGwgJiYgb2JqZWN0LiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEU7XG59XG5mdW5jdGlvbiBpc0ZvcndhcmRSZWYob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzRnJhZ21lbnQob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzTGF6eShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9MQVpZX1RZUEU7XG59XG5mdW5jdGlvbiBpc01lbW8ob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfTUVNT19UWVBFO1xufVxuZnVuY3Rpb24gaXNQb3J0YWwob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUE9SVEFMX1RZUEU7XG59XG5mdW5jdGlvbiBpc1Byb2ZpbGVyKG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX1BST0ZJTEVSX1RZUEU7XG59XG5mdW5jdGlvbiBpc1N0cmljdE1vZGUob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzU3VzcGVuc2Uob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfU1VTUEVOU0VfVFlQRTtcbn1cblxuZXhwb3J0cy5Db250ZXh0Q29uc3VtZXIgPSBDb250ZXh0Q29uc3VtZXI7XG5leHBvcnRzLkNvbnRleHRQcm92aWRlciA9IENvbnRleHRQcm92aWRlcjtcbmV4cG9ydHMuRWxlbWVudCA9IEVsZW1lbnQ7XG5leHBvcnRzLkZvcndhcmRSZWYgPSBGb3J3YXJkUmVmO1xuZXhwb3J0cy5GcmFnbWVudCA9IEZyYWdtZW50O1xuZXhwb3J0cy5MYXp5ID0gTGF6eTtcbmV4cG9ydHMuTWVtbyA9IE1lbW87XG5leHBvcnRzLlBvcnRhbCA9IFBvcnRhbDtcbmV4cG9ydHMuUHJvZmlsZXIgPSBQcm9maWxlcjtcbmV4cG9ydHMuU3RyaWN0TW9kZSA9IFN0cmljdE1vZGU7XG5leHBvcnRzLlN1c3BlbnNlID0gU3VzcGVuc2U7XG5leHBvcnRzLmlzQXN5bmNNb2RlID0gaXNBc3luY01vZGU7XG5leHBvcnRzLmlzQ29uY3VycmVudE1vZGUgPSBpc0NvbmN1cnJlbnRNb2RlO1xuZXhwb3J0cy5pc0NvbnRleHRDb25zdW1lciA9IGlzQ29udGV4dENvbnN1bWVyO1xuZXhwb3J0cy5pc0NvbnRleHRQcm92aWRlciA9IGlzQ29udGV4dFByb3ZpZGVyO1xuZXhwb3J0cy5pc0VsZW1lbnQgPSBpc0VsZW1lbnQ7XG5leHBvcnRzLmlzRm9yd2FyZFJlZiA9IGlzRm9yd2FyZFJlZjtcbmV4cG9ydHMuaXNGcmFnbWVudCA9IGlzRnJhZ21lbnQ7XG5leHBvcnRzLmlzTGF6eSA9IGlzTGF6eTtcbmV4cG9ydHMuaXNNZW1vID0gaXNNZW1vO1xuZXhwb3J0cy5pc1BvcnRhbCA9IGlzUG9ydGFsO1xuZXhwb3J0cy5pc1Byb2ZpbGVyID0gaXNQcm9maWxlcjtcbmV4cG9ydHMuaXNTdHJpY3RNb2RlID0gaXNTdHJpY3RNb2RlO1xuZXhwb3J0cy5pc1N1c3BlbnNlID0gaXNTdXNwZW5zZTtcbmV4cG9ydHMuaXNWYWxpZEVsZW1lbnRUeXBlID0gaXNWYWxpZEVsZW1lbnRUeXBlO1xuZXhwb3J0cy50eXBlT2YgPSB0eXBlT2Y7XG4gIH0pKCk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QtaXMucHJvZHVjdGlvbi5taW4uanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QtaXMuZGV2ZWxvcG1lbnQuanMnKTtcbn1cbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSwgU3VwcHJlc3NlZEVycm9yLCBTeW1ib2wsIEl0ZXJhdG9yICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2VzRGVjb3JhdGUoY3RvciwgZGVzY3JpcHRvckluLCBkZWNvcmF0b3JzLCBjb250ZXh0SW4sIGluaXRpYWxpemVycywgZXh0cmFJbml0aWFsaXplcnMpIHtcclxuICAgIGZ1bmN0aW9uIGFjY2VwdChmKSB7IGlmIChmICE9PSB2b2lkIDAgJiYgdHlwZW9mIGYgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZ1bmN0aW9uIGV4cGVjdGVkXCIpOyByZXR1cm4gZjsgfVxyXG4gICAgdmFyIGtpbmQgPSBjb250ZXh0SW4ua2luZCwga2V5ID0ga2luZCA9PT0gXCJnZXR0ZXJcIiA/IFwiZ2V0XCIgOiBraW5kID09PSBcInNldHRlclwiID8gXCJzZXRcIiA6IFwidmFsdWVcIjtcclxuICAgIHZhciB0YXJnZXQgPSAhZGVzY3JpcHRvckluICYmIGN0b3IgPyBjb250ZXh0SW5bXCJzdGF0aWNcIl0gPyBjdG9yIDogY3Rvci5wcm90b3R5cGUgOiBudWxsO1xyXG4gICAgdmFyIGRlc2NyaXB0b3IgPSBkZXNjcmlwdG9ySW4gfHwgKHRhcmdldCA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBjb250ZXh0SW4ubmFtZSkgOiB7fSk7XHJcbiAgICB2YXIgXywgZG9uZSA9IGZhbHNlO1xyXG4gICAgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICB2YXIgY29udGV4dCA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gY29udGV4dEluKSBjb250ZXh0W3BdID0gcCA9PT0gXCJhY2Nlc3NcIiA/IHt9IDogY29udGV4dEluW3BdO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gY29udGV4dEluLmFjY2VzcykgY29udGV4dC5hY2Nlc3NbcF0gPSBjb250ZXh0SW4uYWNjZXNzW3BdO1xyXG4gICAgICAgIGNvbnRleHQuYWRkSW5pdGlhbGl6ZXIgPSBmdW5jdGlvbiAoZikgeyBpZiAoZG9uZSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBhZGQgaW5pdGlhbGl6ZXJzIGFmdGVyIGRlY29yYXRpb24gaGFzIGNvbXBsZXRlZFwiKTsgZXh0cmFJbml0aWFsaXplcnMucHVzaChhY2NlcHQoZiB8fCBudWxsKSk7IH07XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9ICgwLCBkZWNvcmF0b3JzW2ldKShraW5kID09PSBcImFjY2Vzc29yXCIgPyB7IGdldDogZGVzY3JpcHRvci5nZXQsIHNldDogZGVzY3JpcHRvci5zZXQgfSA6IGRlc2NyaXB0b3Jba2V5XSwgY29udGV4dCk7XHJcbiAgICAgICAgaWYgKGtpbmQgPT09IFwiYWNjZXNzb3JcIikge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ID09PSB2b2lkIDApIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsIHx8IHR5cGVvZiByZXN1bHQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3QgZXhwZWN0ZWRcIik7XHJcbiAgICAgICAgICAgIGlmIChfID0gYWNjZXB0KHJlc3VsdC5nZXQpKSBkZXNjcmlwdG9yLmdldCA9IF87XHJcbiAgICAgICAgICAgIGlmIChfID0gYWNjZXB0KHJlc3VsdC5zZXQpKSBkZXNjcmlwdG9yLnNldCA9IF87XHJcbiAgICAgICAgICAgIGlmIChfID0gYWNjZXB0KHJlc3VsdC5pbml0KSkgaW5pdGlhbGl6ZXJzLnVuc2hpZnQoXyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKF8gPSBhY2NlcHQocmVzdWx0KSkge1xyXG4gICAgICAgICAgICBpZiAoa2luZCA9PT0gXCJmaWVsZFwiKSBpbml0aWFsaXplcnMudW5zaGlmdChfKTtcclxuICAgICAgICAgICAgZWxzZSBkZXNjcmlwdG9yW2tleV0gPSBfO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICh0YXJnZXQpIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGNvbnRleHRJbi5uYW1lLCBkZXNjcmlwdG9yKTtcclxuICAgIGRvbmUgPSB0cnVlO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcnVuSW5pdGlhbGl6ZXJzKHRoaXNBcmcsIGluaXRpYWxpemVycywgdmFsdWUpIHtcclxuICAgIHZhciB1c2VWYWx1ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbml0aWFsaXplcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YWx1ZSA9IHVzZVZhbHVlID8gaW5pdGlhbGl6ZXJzW2ldLmNhbGwodGhpc0FyZywgdmFsdWUpIDogaW5pdGlhbGl6ZXJzW2ldLmNhbGwodGhpc0FyZyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdXNlVmFsdWUgPyB2YWx1ZSA6IHZvaWQgMDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Byb3BLZXkoeCkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiB4ID09PSBcInN5bWJvbFwiID8geCA6IFwiXCIuY29uY2F0KHgpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc2V0RnVuY3Rpb25OYW1lKGYsIG5hbWUsIHByZWZpeCkge1xyXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSBcInN5bWJvbFwiKSBuYW1lID0gbmFtZS5kZXNjcmlwdGlvbiA/IFwiW1wiLmNvbmNhdChuYW1lLmRlc2NyaXB0aW9uLCBcIl1cIikgOiBcIlwiO1xyXG4gICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmLCBcIm5hbWVcIiwgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiBwcmVmaXggPyBcIlwiLmNvbmNhdChwcmVmaXgsIFwiIFwiLCBuYW1lKSA6IG5hbWUgfSk7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnID0gT2JqZWN0LmNyZWF0ZSgodHlwZW9mIEl0ZXJhdG9yID09PSBcImZ1bmN0aW9uXCIgPyBJdGVyYXRvciA6IE9iamVjdCkucHJvdG90eXBlKTtcclxuICAgIHJldHVybiBnLm5leHQgPSB2ZXJiKDApLCBnW1widGhyb3dcIl0gPSB2ZXJiKDEpLCBnW1wicmV0dXJuXCJdID0gdmVyYigyKSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xyXG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcclxuICAgICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20sIHBhY2spIHtcclxuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xyXG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xyXG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSBPYmplY3QuY3JlYXRlKCh0eXBlb2YgQXN5bmNJdGVyYXRvciA9PT0gXCJmdW5jdGlvblwiID8gQXN5bmNJdGVyYXRvciA6IE9iamVjdCkucHJvdG90eXBlKSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiLCBhd2FpdFJldHVybiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIGF3YWl0UmV0dXJuKGYpIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUodikudGhlbihmLCByZWplY3QpOyB9OyB9XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaWYgKGdbbl0pIHsgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgaWYgKGYpIGlbbl0gPSBmKGlbbl0pOyB9IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBmYWxzZSB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG52YXIgb3duS2V5cyA9IGZ1bmN0aW9uKG8pIHtcclxuICAgIG93bktleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiAobykge1xyXG4gICAgICAgIHZhciBhciA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGsgaW4gbykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBrKSkgYXJbYXIubGVuZ3RoXSA9IGs7XHJcbiAgICAgICAgcmV0dXJuIGFyO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBvd25LZXlzKG8pO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgPSBvd25LZXlzKG1vZCksIGkgPSAwOyBpIDwgay5sZW5ndGg7IGkrKykgaWYgKGtbaV0gIT09IFwiZGVmYXVsdFwiKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGtbaV0pO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgc3RhdGUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIGtpbmQgPT09IFwibVwiID8gZiA6IGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyKSA6IGYgPyBmLnZhbHVlIDogc3RhdGUuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHN0YXRlLCB2YWx1ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgd3JpdGUgcHJpdmF0ZSBtZW1iZXIgdG8gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEluKHN0YXRlLCByZWNlaXZlcikge1xyXG4gICAgaWYgKHJlY2VpdmVyID09PSBudWxsIHx8ICh0eXBlb2YgcmVjZWl2ZXIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHJlY2VpdmVyICE9PSBcImZ1bmN0aW9uXCIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHVzZSAnaW4nIG9wZXJhdG9yIG9uIG5vbi1vYmplY3RcIik7XHJcbiAgICByZXR1cm4gdHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciA9PT0gc3RhdGUgOiBzdGF0ZS5oYXMocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hZGREaXNwb3NhYmxlUmVzb3VyY2UoZW52LCB2YWx1ZSwgYXN5bmMpIHtcclxuICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdm9pZCAwKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBleHBlY3RlZC5cIik7XHJcbiAgICAgICAgdmFyIGRpc3Bvc2UsIGlubmVyO1xyXG4gICAgICAgIGlmIChhc3luYykge1xyXG4gICAgICAgICAgICBpZiAoIVN5bWJvbC5hc3luY0Rpc3Bvc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNEaXNwb3NlIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgICAgICAgICAgZGlzcG9zZSA9IHZhbHVlW1N5bWJvbC5hc3luY0Rpc3Bvc2VdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGlzcG9zZSA9PT0gdm9pZCAwKSB7XHJcbiAgICAgICAgICAgIGlmICghU3ltYm9sLmRpc3Bvc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuZGlzcG9zZSBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICAgICAgICAgIGRpc3Bvc2UgPSB2YWx1ZVtTeW1ib2wuZGlzcG9zZV07XHJcbiAgICAgICAgICAgIGlmIChhc3luYykgaW5uZXIgPSBkaXNwb3NlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIGRpc3Bvc2UgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBub3QgZGlzcG9zYWJsZS5cIik7XHJcbiAgICAgICAgaWYgKGlubmVyKSBkaXNwb3NlID0gZnVuY3Rpb24oKSB7IHRyeSB7IGlubmVyLmNhbGwodGhpcyk7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIFByb21pc2UucmVqZWN0KGUpOyB9IH07XHJcbiAgICAgICAgZW52LnN0YWNrLnB1c2goeyB2YWx1ZTogdmFsdWUsIGRpc3Bvc2U6IGRpc3Bvc2UsIGFzeW5jOiBhc3luYyB9KTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGFzeW5jKSB7XHJcbiAgICAgICAgZW52LnN0YWNrLnB1c2goeyBhc3luYzogdHJ1ZSB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZTtcclxuXHJcbn1cclxuXHJcbnZhciBfU3VwcHJlc3NlZEVycm9yID0gdHlwZW9mIFN1cHByZXNzZWRFcnJvciA9PT0gXCJmdW5jdGlvblwiID8gU3VwcHJlc3NlZEVycm9yIDogZnVuY3Rpb24gKGVycm9yLCBzdXBwcmVzc2VkLCBtZXNzYWdlKSB7XHJcbiAgICB2YXIgZSA9IG5ldyBFcnJvcihtZXNzYWdlKTtcclxuICAgIHJldHVybiBlLm5hbWUgPSBcIlN1cHByZXNzZWRFcnJvclwiLCBlLmVycm9yID0gZXJyb3IsIGUuc3VwcHJlc3NlZCA9IHN1cHByZXNzZWQsIGU7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kaXNwb3NlUmVzb3VyY2VzKGVudikge1xyXG4gICAgZnVuY3Rpb24gZmFpbChlKSB7XHJcbiAgICAgICAgZW52LmVycm9yID0gZW52Lmhhc0Vycm9yID8gbmV3IF9TdXBwcmVzc2VkRXJyb3IoZSwgZW52LmVycm9yLCBcIkFuIGVycm9yIHdhcyBzdXBwcmVzc2VkIGR1cmluZyBkaXNwb3NhbC5cIikgOiBlO1xyXG4gICAgICAgIGVudi5oYXNFcnJvciA9IHRydWU7XHJcbiAgICB9XHJcbiAgICB2YXIgciwgcyA9IDA7XHJcbiAgICBmdW5jdGlvbiBuZXh0KCkge1xyXG4gICAgICAgIHdoaWxlIChyID0gZW52LnN0YWNrLnBvcCgpKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXIuYXN5bmMgJiYgcyA9PT0gMSkgcmV0dXJuIHMgPSAwLCBlbnYuc3RhY2sucHVzaChyKSwgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihuZXh0KTtcclxuICAgICAgICAgICAgICAgIGlmIChyLmRpc3Bvc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gci5kaXNwb3NlLmNhbGwoci52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHIuYXN5bmMpIHJldHVybiBzIHw9IDIsIFByb21pc2UucmVzb2x2ZShyZXN1bHQpLnRoZW4obmV4dCwgZnVuY3Rpb24oZSkgeyBmYWlsKGUpOyByZXR1cm4gbmV4dCgpOyB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgcyB8PSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBmYWlsKGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzID09PSAxKSByZXR1cm4gZW52Lmhhc0Vycm9yID8gUHJvbWlzZS5yZWplY3QoZW52LmVycm9yKSA6IFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIGlmIChlbnYuaGFzRXJyb3IpIHRocm93IGVudi5lcnJvcjtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXh0KCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jld3JpdGVSZWxhdGl2ZUltcG9ydEV4dGVuc2lvbihwYXRoLCBwcmVzZXJ2ZUpzeCkge1xyXG4gICAgaWYgKHR5cGVvZiBwYXRoID09PSBcInN0cmluZ1wiICYmIC9eXFwuXFwuP1xcLy8udGVzdChwYXRoKSkge1xyXG4gICAgICAgIHJldHVybiBwYXRoLnJlcGxhY2UoL1xcLih0c3gpJHwoKD86XFwuZCk/KSgoPzpcXC5bXi4vXSs/KT8pXFwuKFtjbV0/KXRzJC9pLCBmdW5jdGlvbiAobSwgdHN4LCBkLCBleHQsIGNtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0c3ggPyBwcmVzZXJ2ZUpzeCA/IFwiLmpzeFwiIDogXCIuanNcIiA6IGQgJiYgKCFleHQgfHwgIWNtKSA/IG0gOiAoZCArIGV4dCArIFwiLlwiICsgY20udG9Mb3dlckNhc2UoKSArIFwianNcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGF0aDtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgX19leHRlbmRzOiBfX2V4dGVuZHMsXHJcbiAgICBfX2Fzc2lnbjogX19hc3NpZ24sXHJcbiAgICBfX3Jlc3Q6IF9fcmVzdCxcclxuICAgIF9fZGVjb3JhdGU6IF9fZGVjb3JhdGUsXHJcbiAgICBfX3BhcmFtOiBfX3BhcmFtLFxyXG4gICAgX19lc0RlY29yYXRlOiBfX2VzRGVjb3JhdGUsXHJcbiAgICBfX3J1bkluaXRpYWxpemVyczogX19ydW5Jbml0aWFsaXplcnMsXHJcbiAgICBfX3Byb3BLZXk6IF9fcHJvcEtleSxcclxuICAgIF9fc2V0RnVuY3Rpb25OYW1lOiBfX3NldEZ1bmN0aW9uTmFtZSxcclxuICAgIF9fbWV0YWRhdGE6IF9fbWV0YWRhdGEsXHJcbiAgICBfX2F3YWl0ZXI6IF9fYXdhaXRlcixcclxuICAgIF9fZ2VuZXJhdG9yOiBfX2dlbmVyYXRvcixcclxuICAgIF9fY3JlYXRlQmluZGluZzogX19jcmVhdGVCaW5kaW5nLFxyXG4gICAgX19leHBvcnRTdGFyOiBfX2V4cG9ydFN0YXIsXHJcbiAgICBfX3ZhbHVlczogX192YWx1ZXMsXHJcbiAgICBfX3JlYWQ6IF9fcmVhZCxcclxuICAgIF9fc3ByZWFkOiBfX3NwcmVhZCxcclxuICAgIF9fc3ByZWFkQXJyYXlzOiBfX3NwcmVhZEFycmF5cyxcclxuICAgIF9fc3ByZWFkQXJyYXk6IF9fc3ByZWFkQXJyYXksXHJcbiAgICBfX2F3YWl0OiBfX2F3YWl0LFxyXG4gICAgX19hc3luY0dlbmVyYXRvcjogX19hc3luY0dlbmVyYXRvcixcclxuICAgIF9fYXN5bmNEZWxlZ2F0b3I6IF9fYXN5bmNEZWxlZ2F0b3IsXHJcbiAgICBfX2FzeW5jVmFsdWVzOiBfX2FzeW5jVmFsdWVzLFxyXG4gICAgX19tYWtlVGVtcGxhdGVPYmplY3Q6IF9fbWFrZVRlbXBsYXRlT2JqZWN0LFxyXG4gICAgX19pbXBvcnRTdGFyOiBfX2ltcG9ydFN0YXIsXHJcbiAgICBfX2ltcG9ydERlZmF1bHQ6IF9faW1wb3J0RGVmYXVsdCxcclxuICAgIF9fY2xhc3NQcml2YXRlRmllbGRHZXQ6IF9fY2xhc3NQcml2YXRlRmllbGRHZXQsXHJcbiAgICBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0OiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0LFxyXG4gICAgX19jbGFzc1ByaXZhdGVGaWVsZEluOiBfX2NsYXNzUHJpdmF0ZUZpZWxkSW4sXHJcbiAgICBfX2FkZERpc3Bvc2FibGVSZXNvdXJjZTogX19hZGREaXNwb3NhYmxlUmVzb3VyY2UsXHJcbiAgICBfX2Rpc3Bvc2VSZXNvdXJjZXM6IF9fZGlzcG9zZVJlc291cmNlcyxcclxuICAgIF9fcmV3cml0ZVJlbGF0aXZlSW1wb3J0RXh0ZW5zaW9uOiBfX3Jld3JpdGVSZWxhdGl2ZUltcG9ydEV4dGVuc2lvbixcclxufTtcclxuIiwiaW1wb3J0IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlIGZyb20gJ0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UnO1xuaW1wb3J0IF9leHRlbmRzIGZyb20gJ0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2V4dGVuZHMnO1xuaW1wb3J0IF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQgZnJvbSAnQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vYXNzZXJ0VGhpc0luaXRpYWxpemVkJztcbmltcG9ydCBfaW5oZXJpdHNMb29zZSBmcm9tICdAYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9pbmhlcml0c0xvb3NlJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeyBjbG9uZUVsZW1lbnQsIENvbXBvbmVudCwgdXNlUmVmLCB1c2VFZmZlY3QsIHVzZUNhbGxiYWNrLCB1c2VMYXlvdXRFZmZlY3QsIHVzZVJlZHVjZXIsIHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBpc0ZvcndhcmRSZWYgfSBmcm9tICdyZWFjdC1pcyc7XG5pbXBvcnQgY29tcHV0ZSBmcm9tICdjb21wdXRlLXNjcm9sbC1pbnRvLXZpZXcnO1xuaW1wb3J0IHsgX19hc3NpZ24gfSBmcm9tICd0c2xpYic7XG5cbnZhciBpZENvdW50ZXIgPSAwO1xuXG4vKipcbiAqIEFjY2VwdHMgYSBwYXJhbWV0ZXIgYW5kIHJldHVybnMgaXQgaWYgaXQncyBhIGZ1bmN0aW9uXG4gKiBvciBhIG5vb3AgZnVuY3Rpb24gaWYgaXQncyBub3QuIFRoaXMgYWxsb3dzIHVzIHRvXG4gKiBhY2NlcHQgYSBjYWxsYmFjaywgYnV0IG5vdCB3b3JyeSBhYm91dCBpdCBpZiBpdCdzIG5vdFxuICogcGFzc2VkLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2IgdGhlIGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gYSBmdW5jdGlvblxuICovXG5mdW5jdGlvbiBjYlRvQ2IoY2IpIHtcbiAgcmV0dXJuIHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJyA/IGNiIDogbm9vcDtcbn1cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG4vKipcbiAqIFNjcm9sbCBub2RlIGludG8gdmlldyBpZiBuZWNlc3NhcnlcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG5vZGUgdGhlIGVsZW1lbnQgdGhhdCBzaG91bGQgc2Nyb2xsIGludG8gdmlld1xuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbWVudU5vZGUgdGhlIG1lbnUgZWxlbWVudCBvZiB0aGUgY29tcG9uZW50XG4gKi9cbmZ1bmN0aW9uIHNjcm9sbEludG9WaWV3KG5vZGUsIG1lbnVOb2RlKSB7XG4gIGlmICghbm9kZSkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgYWN0aW9ucyA9IGNvbXB1dGUobm9kZSwge1xuICAgIGJvdW5kYXJ5OiBtZW51Tm9kZSxcbiAgICBibG9jazogJ25lYXJlc3QnLFxuICAgIHNjcm9sbE1vZGU6ICdpZi1uZWVkZWQnXG4gIH0pO1xuICBhY3Rpb25zLmZvckVhY2goZnVuY3Rpb24gKF9yZWYpIHtcbiAgICB2YXIgZWwgPSBfcmVmLmVsLFxuICAgICAgdG9wID0gX3JlZi50b3AsXG4gICAgICBsZWZ0ID0gX3JlZi5sZWZ0O1xuICAgIGVsLnNjcm9sbFRvcCA9IHRvcDtcbiAgICBlbC5zY3JvbGxMZWZ0ID0gbGVmdDtcbiAgfSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcGFyZW50IHRoZSBwYXJlbnQgbm9kZVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY2hpbGQgdGhlIGNoaWxkIG5vZGVcbiAqIEBwYXJhbSB7V2luZG93fSBlbnZpcm9ubWVudCBUaGUgd2luZG93IGNvbnRleHQgd2hlcmUgZG93bnNoaWZ0IHJlbmRlcnMuXG4gKiBAcmV0dXJuIHtCb29sZWFufSB3aGV0aGVyIHRoZSBwYXJlbnQgaXMgdGhlIGNoaWxkIG9yIHRoZSBjaGlsZCBpcyBpbiB0aGUgcGFyZW50XG4gKi9cbmZ1bmN0aW9uIGlzT3JDb250YWluc05vZGUocGFyZW50LCBjaGlsZCwgZW52aXJvbm1lbnQpIHtcbiAgdmFyIHJlc3VsdCA9IHBhcmVudCA9PT0gY2hpbGQgfHwgY2hpbGQgaW5zdGFuY2VvZiBlbnZpcm9ubWVudC5Ob2RlICYmIHBhcmVudC5jb250YWlucyAmJiBwYXJlbnQuY29udGFpbnMoY2hpbGQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFNpbXBsZSBkZWJvdW5jZSBpbXBsZW1lbnRhdGlvbi4gV2lsbCBjYWxsIHRoZSBnaXZlblxuICogZnVuY3Rpb24gb25jZSBhZnRlciB0aGUgdGltZSBnaXZlbiBoYXMgcGFzc2VkIHNpbmNlXG4gKiBpdCB3YXMgbGFzdCBjYWxsZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiB0aGUgZnVuY3Rpb24gdG8gY2FsbCBhZnRlciB0aGUgdGltZVxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgdGhlIHRpbWUgdG8gd2FpdFxuICogQHJldHVybiB7RnVuY3Rpb259IHRoZSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZm4sIHRpbWUpIHtcbiAgdmFyIHRpbWVvdXRJZDtcbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lb3V0SWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiB3cmFwcGVyKCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG4gICAgY2FuY2VsKCk7XG4gICAgdGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICB0aW1lb3V0SWQgPSBudWxsO1xuICAgICAgZm4uYXBwbHkodm9pZCAwLCBhcmdzKTtcbiAgICB9LCB0aW1lKTtcbiAgfVxuICB3cmFwcGVyLmNhbmNlbCA9IGNhbmNlbDtcbiAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbi8qKlxuICogVGhpcyBpcyBpbnRlbmRlZCB0byBiZSB1c2VkIHRvIGNvbXBvc2UgZXZlbnQgaGFuZGxlcnMuXG4gKiBUaGV5IGFyZSBleGVjdXRlZCBpbiBvcmRlciB1bnRpbCBvbmUgb2YgdGhlbSBzZXRzXG4gKiBgZXZlbnQucHJldmVudERvd25zaGlmdERlZmF1bHQgPSB0cnVlYC5cbiAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IGZucyB0aGUgZXZlbnQgaGFuZGxlciBmdW5jdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0aGUgZXZlbnQgaGFuZGxlciB0byBhZGQgdG8gYW4gZWxlbWVudFxuICovXG5mdW5jdGlvbiBjYWxsQWxsRXZlbnRIYW5kbGVycygpIHtcbiAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBmbnMgPSBuZXcgQXJyYXkoX2xlbjIpLCBfa2V5MiA9IDA7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICBmbnNbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4zID4gMSA/IF9sZW4zIC0gMSA6IDApLCBfa2V5MyA9IDE7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcbiAgICAgIGFyZ3NbX2tleTMgLSAxXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gICAgfVxuICAgIHJldHVybiBmbnMuc29tZShmdW5jdGlvbiAoZm4pIHtcbiAgICAgIGlmIChmbikge1xuICAgICAgICBmbi5hcHBseSh2b2lkIDAsIFtldmVudF0uY29uY2F0KGFyZ3MpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBldmVudC5wcmV2ZW50RG93bnNoaWZ0RGVmYXVsdCB8fCBldmVudC5oYXNPd25Qcm9wZXJ0eSgnbmF0aXZlRXZlbnQnKSAmJiBldmVudC5uYXRpdmVFdmVudC5wcmV2ZW50RG93bnNoaWZ0RGVmYXVsdDtcbiAgICB9KTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGhhbmRsZVJlZnMoKSB7XG4gIGZvciAodmFyIF9sZW40ID0gYXJndW1lbnRzLmxlbmd0aCwgcmVmcyA9IG5ldyBBcnJheShfbGVuNCksIF9rZXk0ID0gMDsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xuICAgIHJlZnNbX2tleTRdID0gYXJndW1lbnRzW19rZXk0XTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICByZWZzLmZvckVhY2goZnVuY3Rpb24gKHJlZikge1xuICAgICAgaWYgKHR5cGVvZiByZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmVmKG5vZGUpO1xuICAgICAgfSBlbHNlIGlmIChyZWYpIHtcbiAgICAgICAgcmVmLmN1cnJlbnQgPSBub2RlO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgZ2VuZXJhdGVzIGEgdW5pcXVlIElEIGZvciBhbiBpbnN0YW5jZSBvZiBEb3duc2hpZnRcbiAqIEByZXR1cm4ge1N0cmluZ30gdGhlIHVuaXF1ZSBJRFxuICovXG5mdW5jdGlvbiBnZW5lcmF0ZUlkKCkge1xuICByZXR1cm4gU3RyaW5nKGlkQ291bnRlcisrKTtcbn1cblxuLyoqXG4gKiBSZXNldHMgaWRDb3VudGVyIHRvIDAuIFVzZWQgZm9yIFNTUi5cbiAqL1xuZnVuY3Rpb24gcmVzZXRJZENvdW50ZXIoKSB7XG4gIGlkQ291bnRlciA9IDA7XG59XG5cbi8qKlxuICogRGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBmb3Igc3RhdHVzIG1lc3NhZ2UuIE9ubHkgYWRkZWQgd2hlbiBtZW51IGlzIG9wZW4uXG4gKiBXaWxsIHNwZWNpZnkgaWYgdGhlcmUgYXJlIHJlc3VsdHMgaW4gdGhlIGxpc3QsIGFuZCBpZiBzbywgaG93IG1hbnksXG4gKiBhbmQgd2hhdCBrZXlzIGFyZSByZWxldmFudC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW0gdGhlIGRvd25zaGlmdCBzdGF0ZSBhbmQgb3RoZXIgcmVsZXZhbnQgcHJvcGVydGllc1xuICogQHJldHVybiB7U3RyaW5nfSB0aGUgYTExeSBzdGF0dXMgbWVzc2FnZVxuICovXG5mdW5jdGlvbiBnZXRBMTF5U3RhdHVzTWVzc2FnZSQxKF9yZWYyKSB7XG4gIHZhciBpc09wZW4gPSBfcmVmMi5pc09wZW4sXG4gICAgcmVzdWx0Q291bnQgPSBfcmVmMi5yZXN1bHRDb3VudCxcbiAgICBwcmV2aW91c1Jlc3VsdENvdW50ID0gX3JlZjIucHJldmlvdXNSZXN1bHRDb3VudDtcbiAgaWYgKCFpc09wZW4pIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgaWYgKCFyZXN1bHRDb3VudCkge1xuICAgIHJldHVybiAnTm8gcmVzdWx0cyBhcmUgYXZhaWxhYmxlLic7XG4gIH1cbiAgaWYgKHJlc3VsdENvdW50ICE9PSBwcmV2aW91c1Jlc3VsdENvdW50KSB7XG4gICAgcmV0dXJuIHJlc3VsdENvdW50ICsgXCIgcmVzdWx0XCIgKyAocmVzdWx0Q291bnQgPT09IDEgPyAnIGlzJyA6ICdzIGFyZScpICsgXCIgYXZhaWxhYmxlLCB1c2UgdXAgYW5kIGRvd24gYXJyb3cga2V5cyB0byBuYXZpZ2F0ZS4gUHJlc3MgRW50ZXIga2V5IHRvIHNlbGVjdC5cIjtcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbi8qKlxuICogVGFrZXMgYW4gYXJndW1lbnQgYW5kIGlmIGl0J3MgYW4gYXJyYXksIHJldHVybnMgdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIGFycmF5XG4gKiBvdGhlcndpc2UgcmV0dXJucyB0aGUgYXJndW1lbnRcbiAqIEBwYXJhbSB7Kn0gYXJnIHRoZSBtYXliZS1hcnJheVxuICogQHBhcmFtIHsqfSBkZWZhdWx0VmFsdWUgdGhlIHZhbHVlIGlmIGFyZyBpcyBmYWxzZXkgbm90IGRlZmluZWRcbiAqIEByZXR1cm4geyp9IHRoZSBhcmcgb3IgaXQncyBmaXJzdCBpdGVtXG4gKi9cbmZ1bmN0aW9uIHVud3JhcEFycmF5KGFyZywgZGVmYXVsdFZhbHVlKSB7XG4gIGFyZyA9IEFycmF5LmlzQXJyYXkoYXJnKSA/IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0IChwcmVhY3QpICovYXJnWzBdIDogYXJnO1xuICBpZiAoIWFyZyAmJiBkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBhcmc7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCAoUClyZWFjdCBlbGVtZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufSB3aGV0aGVyIGl0J3MgYSBET00gZWxlbWVudFxuICovXG5mdW5jdGlvbiBpc0RPTUVsZW1lbnQoZWxlbWVudCkge1xuXG4gIC8vIHRoZW4gd2UgYXNzdW1lIHRoaXMgaXMgcmVhY3RcbiAgcmV0dXJuIHR5cGVvZiBlbGVtZW50LnR5cGUgPT09ICdzdHJpbmcnO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IChQKXJlYWN0IGVsZW1lbnRcbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIHByb3BzXG4gKi9cbmZ1bmN0aW9uIGdldEVsZW1lbnRQcm9wcyhlbGVtZW50KSB7XG4gIHJldHVybiBlbGVtZW50LnByb3BzO1xufVxuXG4vKipcbiAqIFRocm93cyBhIGhlbHBmdWwgZXJyb3IgbWVzc2FnZSBmb3IgcmVxdWlyZWQgcHJvcGVydGllcy4gVXNlZnVsXG4gKiB0byBiZSB1c2VkIGFzIGEgZGVmYXVsdCBpbiBkZXN0cnVjdHVyaW5nIG9yIG9iamVjdCBwYXJhbXMuXG4gKiBAcGFyYW0ge1N0cmluZ30gZm5OYW1lIHRoZSBmdW5jdGlvbiBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcE5hbWUgdGhlIHByb3AgbmFtZVxuICovXG5mdW5jdGlvbiByZXF1aXJlZFByb3AoZm5OYW1lLCBwcm9wTmFtZSkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICBjb25zb2xlLmVycm9yKFwiVGhlIHByb3BlcnR5IFxcXCJcIiArIHByb3BOYW1lICsgXCJcXFwiIGlzIHJlcXVpcmVkIGluIFxcXCJcIiArIGZuTmFtZSArIFwiXFxcIlwiKTtcbn1cbnZhciBzdGF0ZUtleXMgPSBbJ2hpZ2hsaWdodGVkSW5kZXgnLCAnaW5wdXRWYWx1ZScsICdpc09wZW4nLCAnc2VsZWN0ZWRJdGVtJywgJ3R5cGUnXTtcbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IHN0YXRlIHRoZSBzdGF0ZSBvYmplY3RcbiAqIEByZXR1cm4ge09iamVjdH0gc3RhdGUgdGhhdCBpcyByZWxldmFudCB0byBkb3duc2hpZnRcbiAqL1xuZnVuY3Rpb24gcGlja1N0YXRlKHN0YXRlKSB7XG4gIGlmIChzdGF0ZSA9PT0gdm9pZCAwKSB7XG4gICAgc3RhdGUgPSB7fTtcbiAgfVxuICB2YXIgcmVzdWx0ID0ge307XG4gIHN0YXRlS2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgaWYgKHN0YXRlLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICByZXN1bHRba10gPSBzdGF0ZVtrXTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFRoaXMgd2lsbCBwZXJmb3JtIGEgc2hhbGxvdyBtZXJnZSBvZiB0aGUgZ2l2ZW4gc3RhdGUgb2JqZWN0XG4gKiB3aXRoIHRoZSBzdGF0ZSBjb21pbmcgZnJvbSBwcm9wc1xuICogKGZvciB0aGUgY29udHJvbGxlZCBjb21wb25lbnQgc2NlbmFyaW8pXG4gKiBUaGlzIGlzIHVzZWQgaW4gc3RhdGUgdXBkYXRlciBmdW5jdGlvbnMgc28gdGhleSdyZSByZWZlcmVuY2luZ1xuICogdGhlIHJpZ2h0IHN0YXRlIHJlZ2FyZGxlc3Mgb2Ygd2hlcmUgaXQgY29tZXMgZnJvbS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhdGUgVGhlIHN0YXRlIG9mIHRoZSBjb21wb25lbnQvaG9vay5cbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBUaGUgcHJvcHMgdGhhdCBtYXkgY29udGFpbiBjb250cm9sbGVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBtZXJnZWQgY29udHJvbGxlZCBzdGF0ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0U3RhdGUoc3RhdGUsIHByb3BzKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhzdGF0ZSkucmVkdWNlKGZ1bmN0aW9uIChwcmV2U3RhdGUsIGtleSkge1xuICAgIHByZXZTdGF0ZVtrZXldID0gaXNDb250cm9sbGVkUHJvcChwcm9wcywga2V5KSA/IHByb3BzW2tleV0gOiBzdGF0ZVtrZXldO1xuICAgIHJldHVybiBwcmV2U3RhdGU7XG4gIH0sIHt9KTtcbn1cblxuLyoqXG4gKiBUaGlzIGRldGVybWluZXMgd2hldGhlciBhIHByb3AgaXMgYSBcImNvbnRyb2xsZWQgcHJvcFwiIG1lYW5pbmcgaXQgaXNcbiAqIHN0YXRlIHdoaWNoIGlzIGNvbnRyb2xsZWQgYnkgdGhlIG91dHNpZGUgb2YgdGhpcyBjb21wb25lbnQgcmF0aGVyXG4gKiB0aGFuIHdpdGhpbiB0aGlzIGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgVGhlIHByb3BzIHRoYXQgbWF5IGNvbnRhaW4gY29udHJvbGxlZCB2YWx1ZXMuXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5IHRoZSBrZXkgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHdoZXRoZXIgaXQgaXMgYSBjb250cm9sbGVkIGNvbnRyb2xsZWQgcHJvcFxuICovXG5mdW5jdGlvbiBpc0NvbnRyb2xsZWRQcm9wKHByb3BzLCBrZXkpIHtcbiAgcmV0dXJuIHByb3BzW2tleV0gIT09IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBOb3JtYWxpemVzIHRoZSAna2V5JyBwcm9wZXJ0eSBvZiBhIEtleWJvYXJkRXZlbnQgaW4gSUUvRWRnZVxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IGEga2V5Ym9hcmRFdmVudCBvYmplY3RcbiAqIEByZXR1cm4ge1N0cmluZ30ga2V5Ym9hcmQga2V5XG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycm93S2V5KGV2ZW50KSB7XG4gIHZhciBrZXkgPSBldmVudC5rZXksXG4gICAga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0IChpZSkgKi9cbiAgaWYgKGtleUNvZGUgPj0gMzcgJiYga2V5Q29kZSA8PSA0MCAmJiBrZXkuaW5kZXhPZignQXJyb3cnKSAhPT0gMCkge1xuICAgIHJldHVybiBcIkFycm93XCIgKyBrZXk7XG4gIH1cbiAgcmV0dXJuIGtleTtcbn1cblxuLyoqXG4gKiBTaW1wbGUgY2hlY2sgaWYgdGhlIHZhbHVlIHBhc3NlZCBpcyBvYmplY3QgbGl0ZXJhbFxuICogQHBhcmFtIHsqfSBvYmogYW55IHRoaW5nc1xuICogQHJldHVybiB7Qm9vbGVhbn0gd2hldGhlciBpdCdzIG9iamVjdCBsaXRlcmFsXG4gKi9cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbmV3IGluZGV4IGluIHRoZSBsaXN0LCBpbiBhIGNpcmN1bGFyIHdheS4gSWYgbmV4dCB2YWx1ZSBpcyBvdXQgb2YgYm9uZHMgZnJvbSB0aGUgdG90YWwsXG4gKiBpdCB3aWxsIHdyYXAgdG8gZWl0aGVyIDAgb3IgaXRlbUNvdW50IC0gMS5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbW92ZUFtb3VudCBOdW1iZXIgb2YgcG9zaXRpb25zIHRvIG1vdmUuIE5lZ2F0aXZlIHRvIG1vdmUgYmFja3dhcmRzLCBwb3NpdGl2ZSBmb3J3YXJkcy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiYXNlSW5kZXggVGhlIGluaXRpYWwgcG9zaXRpb24gdG8gbW92ZSBmcm9tLlxuICogQHBhcmFtIHtudW1iZXJ9IGl0ZW1Db3VudCBUaGUgdG90YWwgbnVtYmVyIG9mIGl0ZW1zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZ2V0SXRlbU5vZGVGcm9tSW5kZXggVXNlZCB0byBjaGVjayBpZiBpdGVtIGlzIGRpc2FibGVkLlxuICogQHBhcmFtIHtib29sZWFufSBjaXJjdWxhciBTcGVjaWZ5IGlmIG5hdmlnYXRpb24gaXMgY2lyY3VsYXIuIERlZmF1bHQgaXMgdHJ1ZS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBuZXcgaW5kZXggYWZ0ZXIgdGhlIG1vdmUuXG4gKi9cbmZ1bmN0aW9uIGdldE5leHRXcmFwcGluZ0luZGV4KG1vdmVBbW91bnQsIGJhc2VJbmRleCwgaXRlbUNvdW50LCBnZXRJdGVtTm9kZUZyb21JbmRleCwgY2lyY3VsYXIpIHtcbiAgaWYgKGNpcmN1bGFyID09PSB2b2lkIDApIHtcbiAgICBjaXJjdWxhciA9IHRydWU7XG4gIH1cbiAgaWYgKGl0ZW1Db3VudCA9PT0gMCkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICB2YXIgaXRlbXNMYXN0SW5kZXggPSBpdGVtQ291bnQgLSAxO1xuICBpZiAodHlwZW9mIGJhc2VJbmRleCAhPT0gJ251bWJlcicgfHwgYmFzZUluZGV4IDwgMCB8fCBiYXNlSW5kZXggPj0gaXRlbUNvdW50KSB7XG4gICAgYmFzZUluZGV4ID0gbW92ZUFtb3VudCA+IDAgPyAtMSA6IGl0ZW1zTGFzdEluZGV4ICsgMTtcbiAgfVxuICB2YXIgbmV3SW5kZXggPSBiYXNlSW5kZXggKyBtb3ZlQW1vdW50O1xuICBpZiAobmV3SW5kZXggPCAwKSB7XG4gICAgbmV3SW5kZXggPSBjaXJjdWxhciA/IGl0ZW1zTGFzdEluZGV4IDogMDtcbiAgfSBlbHNlIGlmIChuZXdJbmRleCA+IGl0ZW1zTGFzdEluZGV4KSB7XG4gICAgbmV3SW5kZXggPSBjaXJjdWxhciA/IDAgOiBpdGVtc0xhc3RJbmRleDtcbiAgfVxuICB2YXIgbm9uRGlzYWJsZWROZXdJbmRleCA9IGdldE5leHROb25EaXNhYmxlZEluZGV4KG1vdmVBbW91bnQsIG5ld0luZGV4LCBpdGVtQ291bnQsIGdldEl0ZW1Ob2RlRnJvbUluZGV4LCBjaXJjdWxhcik7XG4gIGlmIChub25EaXNhYmxlZE5ld0luZGV4ID09PSAtMSkge1xuICAgIHJldHVybiBiYXNlSW5kZXggPj0gaXRlbUNvdW50ID8gLTEgOiBiYXNlSW5kZXg7XG4gIH1cbiAgcmV0dXJuIG5vbkRpc2FibGVkTmV3SW5kZXg7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbmV4dCBpbmRleCBpbiB0aGUgbGlzdCBvZiBhbiBpdGVtIHRoYXQgaXMgbm90IGRpc2FibGVkLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBtb3ZlQW1vdW50IE51bWJlciBvZiBwb3NpdGlvbnMgdG8gbW92ZS4gTmVnYXRpdmUgdG8gbW92ZSBiYWNrd2FyZHMsIHBvc2l0aXZlIGZvcndhcmRzLlxuICogQHBhcmFtIHtudW1iZXJ9IGJhc2VJbmRleCBUaGUgaW5pdGlhbCBwb3NpdGlvbiB0byBtb3ZlIGZyb20uXG4gKiBAcGFyYW0ge251bWJlcn0gaXRlbUNvdW50IFRoZSB0b3RhbCBudW1iZXIgb2YgaXRlbXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBnZXRJdGVtTm9kZUZyb21JbmRleCBVc2VkIHRvIGNoZWNrIGlmIGl0ZW0gaXMgZGlzYWJsZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNpcmN1bGFyIFNwZWNpZnkgaWYgbmF2aWdhdGlvbiBpcyBjaXJjdWxhci4gRGVmYXVsdCBpcyB0cnVlLlxuICogQHJldHVybnMge251bWJlcn0gVGhlIG5ldyBpbmRleC4gUmV0dXJucyBiYXNlSW5kZXggaWYgaXRlbSBpcyBub3QgZGlzYWJsZWQuIFJldHVybnMgbmV4dCBub24tZGlzYWJsZWQgaXRlbSBvdGhlcndpc2UuIElmIG5vIG5vbi1kaXNhYmxlZCBmb3VuZCBpdCB3aWxsIHJldHVybiAtMS5cbiAqL1xuZnVuY3Rpb24gZ2V0TmV4dE5vbkRpc2FibGVkSW5kZXgobW92ZUFtb3VudCwgYmFzZUluZGV4LCBpdGVtQ291bnQsIGdldEl0ZW1Ob2RlRnJvbUluZGV4LCBjaXJjdWxhcikge1xuICB2YXIgY3VycmVudEVsZW1lbnROb2RlID0gZ2V0SXRlbU5vZGVGcm9tSW5kZXgoYmFzZUluZGV4KTtcbiAgaWYgKCFjdXJyZW50RWxlbWVudE5vZGUgfHwgIWN1cnJlbnRFbGVtZW50Tm9kZS5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpIHtcbiAgICByZXR1cm4gYmFzZUluZGV4O1xuICB9XG4gIGlmIChtb3ZlQW1vdW50ID4gMCkge1xuICAgIGZvciAodmFyIGluZGV4ID0gYmFzZUluZGV4ICsgMTsgaW5kZXggPCBpdGVtQ291bnQ7IGluZGV4KyspIHtcbiAgICAgIGlmICghZ2V0SXRlbU5vZGVGcm9tSW5kZXgoaW5kZXgpLmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSkge1xuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIF9pbmRleCA9IGJhc2VJbmRleCAtIDE7IF9pbmRleCA+PSAwOyBfaW5kZXgtLSkge1xuICAgICAgaWYgKCFnZXRJdGVtTm9kZUZyb21JbmRleChfaW5kZXgpLmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSkge1xuICAgICAgICByZXR1cm4gX2luZGV4O1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoY2lyY3VsYXIpIHtcbiAgICByZXR1cm4gbW92ZUFtb3VudCA+IDAgPyBnZXROZXh0Tm9uRGlzYWJsZWRJbmRleCgxLCAwLCBpdGVtQ291bnQsIGdldEl0ZW1Ob2RlRnJvbUluZGV4LCBmYWxzZSkgOiBnZXROZXh0Tm9uRGlzYWJsZWRJbmRleCgtMSwgaXRlbUNvdW50IC0gMSwgaXRlbUNvdW50LCBnZXRJdGVtTm9kZUZyb21JbmRleCwgZmFsc2UpO1xuICB9XG4gIHJldHVybiAtMTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgZXZlbnQgdGFyZ2V0IGlzIHdpdGhpbiB0aGUgZG93bnNoaWZ0IGVsZW1lbnRzLlxuICpcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IHRhcmdldCBUYXJnZXQgdG8gY2hlY2suXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50W119IGRvd25zaGlmdEVsZW1lbnRzIFRoZSBlbGVtZW50cyB0aGF0IGZvcm0gZG93bnNoaWZ0IChsaXN0LCB0b2dnbGUgYnV0dG9uIGV0YykuXG4gKiBAcGFyYW0ge1dpbmRvd30gZW52aXJvbm1lbnQgVGhlIHdpbmRvdyBjb250ZXh0IHdoZXJlIGRvd25zaGlmdCByZW5kZXJzLlxuICogQHBhcmFtIHtib29sZWFufSBjaGVja0FjdGl2ZUVsZW1lbnQgV2hldGhlciB0byBhbHNvIGNoZWNrIGFjdGl2ZUVsZW1lbnQuXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSB0YXJnZXQgaXMgd2l0aGluIGRvd25zaGlmdCBlbGVtZW50cy5cbiAqL1xuZnVuY3Rpb24gdGFyZ2V0V2l0aGluRG93bnNoaWZ0KHRhcmdldCwgZG93bnNoaWZ0RWxlbWVudHMsIGVudmlyb25tZW50LCBjaGVja0FjdGl2ZUVsZW1lbnQpIHtcbiAgaWYgKGNoZWNrQWN0aXZlRWxlbWVudCA9PT0gdm9pZCAwKSB7XG4gICAgY2hlY2tBY3RpdmVFbGVtZW50ID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZG93bnNoaWZ0RWxlbWVudHMuc29tZShmdW5jdGlvbiAoY29udGV4dE5vZGUpIHtcbiAgICByZXR1cm4gY29udGV4dE5vZGUgJiYgKGlzT3JDb250YWluc05vZGUoY29udGV4dE5vZGUsIHRhcmdldCwgZW52aXJvbm1lbnQpIHx8IGNoZWNrQWN0aXZlRWxlbWVudCAmJiBpc09yQ29udGFpbnNOb2RlKGNvbnRleHROb2RlLCBlbnZpcm9ubWVudC5kb2N1bWVudC5hY3RpdmVFbGVtZW50LCBlbnZpcm9ubWVudCkpO1xuICB9KTtcbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1tdXRhYmxlLWV4cG9ydHNcbnZhciB2YWxpZGF0ZUNvbnRyb2xsZWRVbmNoYW5nZWQgPSBub29wO1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhbGlkYXRlQ29udHJvbGxlZFVuY2hhbmdlZCA9IGZ1bmN0aW9uIHZhbGlkYXRlQ29udHJvbGxlZFVuY2hhbmdlZChzdGF0ZSwgcHJldlByb3BzLCBuZXh0UHJvcHMpIHtcbiAgICB2YXIgd2FybmluZ0Rlc2NyaXB0aW9uID0gXCJUaGlzIHByb3Agc2hvdWxkIG5vdCBzd2l0Y2ggZnJvbSBjb250cm9sbGVkIHRvIHVuY29udHJvbGxlZCAob3IgdmljZSB2ZXJzYSkuIERlY2lkZSBiZXR3ZWVuIHVzaW5nIGEgY29udHJvbGxlZCBvciB1bmNvbnRyb2xsZWQgRG93bnNoaWZ0IGVsZW1lbnQgZm9yIHRoZSBsaWZldGltZSBvZiB0aGUgY29tcG9uZW50LiBNb3JlIGluZm86IGh0dHBzOi8vZ2l0aHViLmNvbS9kb3duc2hpZnQtanMvZG93bnNoaWZ0I2NvbnRyb2wtcHJvcHNcIjtcbiAgICBPYmplY3Qua2V5cyhzdGF0ZSkuZm9yRWFjaChmdW5jdGlvbiAocHJvcEtleSkge1xuICAgICAgaWYgKHByZXZQcm9wc1twcm9wS2V5XSAhPT0gdW5kZWZpbmVkICYmIG5leHRQcm9wc1twcm9wS2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJkb3duc2hpZnQ6IEEgY29tcG9uZW50IGhhcyBjaGFuZ2VkIHRoZSBjb250cm9sbGVkIHByb3AgXFxcIlwiICsgcHJvcEtleSArIFwiXFxcIiB0byBiZSB1bmNvbnRyb2xsZWQuIFwiICsgd2FybmluZ0Rlc2NyaXB0aW9uKTtcbiAgICAgIH0gZWxzZSBpZiAocHJldlByb3BzW3Byb3BLZXldID09PSB1bmRlZmluZWQgJiYgbmV4dFByb3BzW3Byb3BLZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgY29uc29sZS5lcnJvcihcImRvd25zaGlmdDogQSBjb21wb25lbnQgaGFzIGNoYW5nZWQgdGhlIHVuY29udHJvbGxlZCBwcm9wIFxcXCJcIiArIHByb3BLZXkgKyBcIlxcXCIgdG8gYmUgY29udHJvbGxlZC4gXCIgKyB3YXJuaW5nRGVzY3JpcHRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xufVxuXG52YXIgY2xlYW51cFN0YXR1cyA9IGRlYm91bmNlKGZ1bmN0aW9uIChkb2N1bWVudFByb3ApIHtcbiAgZ2V0U3RhdHVzRGl2KGRvY3VtZW50UHJvcCkudGV4dENvbnRlbnQgPSAnJztcbn0sIDUwMCk7XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0YXR1cyB0aGUgc3RhdHVzIG1lc3NhZ2VcbiAqIEBwYXJhbSB7T2JqZWN0fSBkb2N1bWVudFByb3AgZG9jdW1lbnQgcGFzc2VkIGJ5IHRoZSB1c2VyLlxuICovXG5mdW5jdGlvbiBzZXRTdGF0dXMoc3RhdHVzLCBkb2N1bWVudFByb3ApIHtcbiAgdmFyIGRpdiA9IGdldFN0YXR1c0Rpdihkb2N1bWVudFByb3ApO1xuICBpZiAoIXN0YXR1cykge1xuICAgIHJldHVybjtcbiAgfVxuICBkaXYudGV4dENvbnRlbnQgPSBzdGF0dXM7XG4gIGNsZWFudXBTdGF0dXMoZG9jdW1lbnRQcm9wKTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHN0YXR1cyBub2RlIG9yIGNyZWF0ZSBpdCBpZiBpdCBkb2VzIG5vdCBhbHJlYWR5IGV4aXN0LlxuICogQHBhcmFtIHtPYmplY3R9IGRvY3VtZW50UHJvcCBkb2N1bWVudCBwYXNzZWQgYnkgdGhlIHVzZXIuXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gdGhlIHN0YXR1cyBub2RlLlxuICovXG5mdW5jdGlvbiBnZXRTdGF0dXNEaXYoZG9jdW1lbnRQcm9wKSB7XG4gIGlmIChkb2N1bWVudFByb3AgPT09IHZvaWQgMCkge1xuICAgIGRvY3VtZW50UHJvcCA9IGRvY3VtZW50O1xuICB9XG4gIHZhciBzdGF0dXNEaXYgPSBkb2N1bWVudFByb3AuZ2V0RWxlbWVudEJ5SWQoJ2ExMXktc3RhdHVzLW1lc3NhZ2UnKTtcbiAgaWYgKHN0YXR1c0Rpdikge1xuICAgIHJldHVybiBzdGF0dXNEaXY7XG4gIH1cbiAgc3RhdHVzRGl2ID0gZG9jdW1lbnRQcm9wLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBzdGF0dXNEaXYuc2V0QXR0cmlidXRlKCdpZCcsICdhMTF5LXN0YXR1cy1tZXNzYWdlJyk7XG4gIHN0YXR1c0Rpdi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnc3RhdHVzJyk7XG4gIHN0YXR1c0Rpdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsICdwb2xpdGUnKTtcbiAgc3RhdHVzRGl2LnNldEF0dHJpYnV0ZSgnYXJpYS1yZWxldmFudCcsICdhZGRpdGlvbnMgdGV4dCcpO1xuICBPYmplY3QuYXNzaWduKHN0YXR1c0Rpdi5zdHlsZSwge1xuICAgIGJvcmRlcjogJzAnLFxuICAgIGNsaXA6ICdyZWN0KDAgMCAwIDApJyxcbiAgICBoZWlnaHQ6ICcxcHgnLFxuICAgIG1hcmdpbjogJy0xcHgnLFxuICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICBwYWRkaW5nOiAnMCcsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgd2lkdGg6ICcxcHgnXG4gIH0pO1xuICBkb2N1bWVudFByb3AuYm9keS5hcHBlbmRDaGlsZChzdGF0dXNEaXYpO1xuICByZXR1cm4gc3RhdHVzRGl2O1xufVxuXG52YXIgdW5rbm93biA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2F1dG9jb21wbGV0ZV91bmtub3duX18nIDogMDtcbnZhciBtb3VzZVVwID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fYXV0b2NvbXBsZXRlX21vdXNldXBfXycgOiAxO1xudmFyIGl0ZW1Nb3VzZUVudGVyID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fYXV0b2NvbXBsZXRlX2l0ZW1fbW91c2VlbnRlcl9fJyA6IDI7XG52YXIga2V5RG93bkFycm93VXAgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19hdXRvY29tcGxldGVfa2V5ZG93bl9hcnJvd191cF9fJyA6IDM7XG52YXIga2V5RG93bkFycm93RG93biA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2F1dG9jb21wbGV0ZV9rZXlkb3duX2Fycm93X2Rvd25fXycgOiA0O1xudmFyIGtleURvd25Fc2NhcGUgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19hdXRvY29tcGxldGVfa2V5ZG93bl9lc2NhcGVfXycgOiA1O1xudmFyIGtleURvd25FbnRlciA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2F1dG9jb21wbGV0ZV9rZXlkb3duX2VudGVyX18nIDogNjtcbnZhciBrZXlEb3duSG9tZSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2F1dG9jb21wbGV0ZV9rZXlkb3duX2hvbWVfXycgOiA3O1xudmFyIGtleURvd25FbmQgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19hdXRvY29tcGxldGVfa2V5ZG93bl9lbmRfXycgOiA4O1xudmFyIGNsaWNrSXRlbSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2F1dG9jb21wbGV0ZV9jbGlja19pdGVtX18nIDogOTtcbnZhciBibHVySW5wdXQgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19hdXRvY29tcGxldGVfYmx1cl9pbnB1dF9fJyA6IDEwO1xudmFyIGNoYW5nZUlucHV0ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fYXV0b2NvbXBsZXRlX2NoYW5nZV9pbnB1dF9fJyA6IDExO1xudmFyIGtleURvd25TcGFjZUJ1dHRvbiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2F1dG9jb21wbGV0ZV9rZXlkb3duX3NwYWNlX2J1dHRvbl9fJyA6IDEyO1xudmFyIGNsaWNrQnV0dG9uID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fYXV0b2NvbXBsZXRlX2NsaWNrX2J1dHRvbl9fJyA6IDEzO1xudmFyIGJsdXJCdXR0b24gPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19hdXRvY29tcGxldGVfYmx1cl9idXR0b25fXycgOiAxNDtcbnZhciBjb250cm9sbGVkUHJvcFVwZGF0ZWRTZWxlY3RlZEl0ZW0gPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19hdXRvY29tcGxldGVfY29udHJvbGxlZF9wcm9wX3VwZGF0ZWRfc2VsZWN0ZWRfaXRlbV9fJyA6IDE1O1xudmFyIHRvdWNoRW5kID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fYXV0b2NvbXBsZXRlX3RvdWNoZW5kX18nIDogMTY7XG5cbnZhciBzdGF0ZUNoYW5nZVR5cGVzJDMgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gIF9fcHJvdG9fXzogbnVsbCxcbiAgdW5rbm93bjogdW5rbm93bixcbiAgbW91c2VVcDogbW91c2VVcCxcbiAgaXRlbU1vdXNlRW50ZXI6IGl0ZW1Nb3VzZUVudGVyLFxuICBrZXlEb3duQXJyb3dVcDoga2V5RG93bkFycm93VXAsXG4gIGtleURvd25BcnJvd0Rvd246IGtleURvd25BcnJvd0Rvd24sXG4gIGtleURvd25Fc2NhcGU6IGtleURvd25Fc2NhcGUsXG4gIGtleURvd25FbnRlcjoga2V5RG93bkVudGVyLFxuICBrZXlEb3duSG9tZToga2V5RG93bkhvbWUsXG4gIGtleURvd25FbmQ6IGtleURvd25FbmQsXG4gIGNsaWNrSXRlbTogY2xpY2tJdGVtLFxuICBibHVySW5wdXQ6IGJsdXJJbnB1dCxcbiAgY2hhbmdlSW5wdXQ6IGNoYW5nZUlucHV0LFxuICBrZXlEb3duU3BhY2VCdXR0b246IGtleURvd25TcGFjZUJ1dHRvbixcbiAgY2xpY2tCdXR0b246IGNsaWNrQnV0dG9uLFxuICBibHVyQnV0dG9uOiBibHVyQnV0dG9uLFxuICBjb250cm9sbGVkUHJvcFVwZGF0ZWRTZWxlY3RlZEl0ZW06IGNvbnRyb2xsZWRQcm9wVXBkYXRlZFNlbGVjdGVkSXRlbSxcbiAgdG91Y2hFbmQ6IHRvdWNoRW5kXG59KTtcblxudmFyIF9leGNsdWRlZCQ0ID0gW1wicmVmS2V5XCIsIFwicmVmXCJdLFxuICBfZXhjbHVkZWQyJDMgPSBbXCJvbkNsaWNrXCIsIFwib25QcmVzc1wiLCBcIm9uS2V5RG93blwiLCBcIm9uS2V5VXBcIiwgXCJvbkJsdXJcIl0sXG4gIF9leGNsdWRlZDMkMiA9IFtcIm9uS2V5RG93blwiLCBcIm9uQmx1clwiLCBcIm9uQ2hhbmdlXCIsIFwib25JbnB1dFwiLCBcIm9uQ2hhbmdlVGV4dFwiXSxcbiAgX2V4Y2x1ZGVkNCQxID0gW1wicmVmS2V5XCIsIFwicmVmXCJdLFxuICBfZXhjbHVkZWQ1ID0gW1wib25Nb3VzZU1vdmVcIiwgXCJvbk1vdXNlRG93blwiLCBcIm9uQ2xpY2tcIiwgXCJvblByZXNzXCIsIFwiaW5kZXhcIiwgXCJpdGVtXCJdO1xudmFyIERvd25zaGlmdCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIHZhciBEb3duc2hpZnQgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKF9Db21wb25lbnQpIHtcbiAgICBfaW5oZXJpdHNMb29zZShEb3duc2hpZnQsIF9Db21wb25lbnQpO1xuICAgIGZ1bmN0aW9uIERvd25zaGlmdChfcHJvcHMpIHtcbiAgICAgIHZhciBfdGhpcztcbiAgICAgIF90aGlzID0gX0NvbXBvbmVudC5jYWxsKHRoaXMsIF9wcm9wcykgfHwgdGhpcztcbiAgICAgIC8vIGZhbmN5IGRlc3RydWN0dXJpbmcgKyBkZWZhdWx0cyArIGFsaWFzZXNcbiAgICAgIC8vIHRoaXMgYmFzaWNhbGx5IHNheXMgZWFjaCB2YWx1ZSBvZiBzdGF0ZSBzaG91bGQgZWl0aGVyIGJlIHNldCB0b1xuICAgICAgLy8gdGhlIGluaXRpYWwgdmFsdWUgb3IgdGhlIGRlZmF1bHQgdmFsdWUgaWYgdGhlIGluaXRpYWwgdmFsdWUgaXMgbm90IHByb3ZpZGVkXG4gICAgICBfdGhpcy5pZCA9IF90aGlzLnByb3BzLmlkIHx8IFwiZG93bnNoaWZ0LVwiICsgZ2VuZXJhdGVJZCgpO1xuICAgICAgX3RoaXMubWVudUlkID0gX3RoaXMucHJvcHMubWVudUlkIHx8IF90aGlzLmlkICsgXCItbWVudVwiO1xuICAgICAgX3RoaXMubGFiZWxJZCA9IF90aGlzLnByb3BzLmxhYmVsSWQgfHwgX3RoaXMuaWQgKyBcIi1sYWJlbFwiO1xuICAgICAgX3RoaXMuaW5wdXRJZCA9IF90aGlzLnByb3BzLmlucHV0SWQgfHwgX3RoaXMuaWQgKyBcIi1pbnB1dFwiO1xuICAgICAgX3RoaXMuZ2V0SXRlbUlkID0gX3RoaXMucHJvcHMuZ2V0SXRlbUlkIHx8IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICByZXR1cm4gX3RoaXMuaWQgKyBcIi1pdGVtLVwiICsgaW5kZXg7XG4gICAgICB9O1xuICAgICAgX3RoaXMuaW5wdXQgPSBudWxsO1xuICAgICAgX3RoaXMuaXRlbXMgPSBbXTtcbiAgICAgIC8vIGl0ZW1Db3VudCBjYW4gYmUgY2hhbmdlZCBhc3luY2hyb25vdXNseVxuICAgICAgLy8gZnJvbSB3aXRoaW4gZG93bnNoaWZ0IChzbyBpdCBjYW4ndCBjb21lIGZyb20gYSBwcm9wKVxuICAgICAgLy8gdGhpcyBpcyB3aHkgd2Ugc3RvcmUgaXQgYXMgYW4gaW5zdGFuY2UgYW5kIHVzZVxuICAgICAgLy8gZ2V0SXRlbUNvdW50IHJhdGhlciB0aGFuIGp1c3QgdXNlIGl0ZW1zLmxlbmd0aFxuICAgICAgLy8gKHRvIHN1cHBvcnQgd2luZG93aW5nICsgYXN5bmMpXG4gICAgICBfdGhpcy5pdGVtQ291bnQgPSBudWxsO1xuICAgICAgX3RoaXMucHJldmlvdXNSZXN1bHRDb3VudCA9IDA7XG4gICAgICBfdGhpcy50aW1lb3V0SWRzID0gW107XG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIHRoZSBmdW5jdGlvbiB0byBjYWxsIGFmdGVyIHRoZSB0aW1lXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSB0aGUgdGltZSB0byB3YWl0XG4gICAgICAgKi9cbiAgICAgIF90aGlzLmludGVybmFsU2V0VGltZW91dCA9IGZ1bmN0aW9uIChmbiwgdGltZSkge1xuICAgICAgICB2YXIgaWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBfdGhpcy50aW1lb3V0SWRzID0gX3RoaXMudGltZW91dElkcy5maWx0ZXIoZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBpICE9PSBpZDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBmbigpO1xuICAgICAgICB9LCB0aW1lKTtcbiAgICAgICAgX3RoaXMudGltZW91dElkcy5wdXNoKGlkKTtcbiAgICAgIH07XG4gICAgICBfdGhpcy5zZXRJdGVtQ291bnQgPSBmdW5jdGlvbiAoY291bnQpIHtcbiAgICAgICAgX3RoaXMuaXRlbUNvdW50ID0gY291bnQ7XG4gICAgICB9O1xuICAgICAgX3RoaXMudW5zZXRJdGVtQ291bnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzLml0ZW1Db3VudCA9IG51bGw7XG4gICAgICB9O1xuICAgICAgX3RoaXMuc2V0SGlnaGxpZ2h0ZWRJbmRleCA9IGZ1bmN0aW9uIChoaWdobGlnaHRlZEluZGV4LCBvdGhlclN0YXRlVG9TZXQpIHtcbiAgICAgICAgaWYgKGhpZ2hsaWdodGVkSW5kZXggPT09IHZvaWQgMCkge1xuICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXggPSBfdGhpcy5wcm9wcy5kZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleDtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3RoZXJTdGF0ZVRvU2V0ID09PSB2b2lkIDApIHtcbiAgICAgICAgICBvdGhlclN0YXRlVG9TZXQgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBvdGhlclN0YXRlVG9TZXQgPSBwaWNrU3RhdGUob3RoZXJTdGF0ZVRvU2V0KTtcbiAgICAgICAgX3RoaXMuaW50ZXJuYWxTZXRTdGF0ZShfZXh0ZW5kcyh7XG4gICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogaGlnaGxpZ2h0ZWRJbmRleFxuICAgICAgICB9LCBvdGhlclN0YXRlVG9TZXQpKTtcbiAgICAgIH07XG4gICAgICBfdGhpcy5jbGVhclNlbGVjdGlvbiA9IGZ1bmN0aW9uIChjYikge1xuICAgICAgICBfdGhpcy5pbnRlcm5hbFNldFN0YXRlKHtcbiAgICAgICAgICBzZWxlY3RlZEl0ZW06IG51bGwsXG4gICAgICAgICAgaW5wdXRWYWx1ZTogJycsXG4gICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogX3RoaXMucHJvcHMuZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXgsXG4gICAgICAgICAgaXNPcGVuOiBfdGhpcy5wcm9wcy5kZWZhdWx0SXNPcGVuXG4gICAgICAgIH0sIGNiKTtcbiAgICAgIH07XG4gICAgICBfdGhpcy5zZWxlY3RJdGVtID0gZnVuY3Rpb24gKGl0ZW0sIG90aGVyU3RhdGVUb1NldCwgY2IpIHtcbiAgICAgICAgb3RoZXJTdGF0ZVRvU2V0ID0gcGlja1N0YXRlKG90aGVyU3RhdGVUb1NldCk7XG4gICAgICAgIF90aGlzLmludGVybmFsU2V0U3RhdGUoX2V4dGVuZHMoe1xuICAgICAgICAgIGlzT3BlbjogX3RoaXMucHJvcHMuZGVmYXVsdElzT3BlbixcbiAgICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBfdGhpcy5wcm9wcy5kZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgICAgICBzZWxlY3RlZEl0ZW06IGl0ZW0sXG4gICAgICAgICAgaW5wdXRWYWx1ZTogX3RoaXMucHJvcHMuaXRlbVRvU3RyaW5nKGl0ZW0pXG4gICAgICAgIH0sIG90aGVyU3RhdGVUb1NldCksIGNiKTtcbiAgICAgIH07XG4gICAgICBfdGhpcy5zZWxlY3RJdGVtQXRJbmRleCA9IGZ1bmN0aW9uIChpdGVtSW5kZXgsIG90aGVyU3RhdGVUb1NldCwgY2IpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBfdGhpcy5pdGVtc1tpdGVtSW5kZXhdO1xuICAgICAgICBpZiAoaXRlbSA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIF90aGlzLnNlbGVjdEl0ZW0oaXRlbSwgb3RoZXJTdGF0ZVRvU2V0LCBjYik7XG4gICAgICB9O1xuICAgICAgX3RoaXMuc2VsZWN0SGlnaGxpZ2h0ZWRJdGVtID0gZnVuY3Rpb24gKG90aGVyU3RhdGVUb1NldCwgY2IpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLnNlbGVjdEl0ZW1BdEluZGV4KF90aGlzLmdldFN0YXRlKCkuaGlnaGxpZ2h0ZWRJbmRleCwgb3RoZXJTdGF0ZVRvU2V0LCBjYik7XG4gICAgICB9O1xuICAgICAgLy8gYW55IHBpZWNlIG9mIG91ciBzdGF0ZSBjYW4gbGl2ZSBpbiB0d28gcGxhY2VzOlxuICAgICAgLy8gMS4gVW5jb250cm9sbGVkOiBpdCdzIGludGVybmFsICh0aGlzLnN0YXRlKVxuICAgICAgLy8gICAgV2Ugd2lsbCBjYWxsIHRoaXMuc2V0U3RhdGUgdG8gdXBkYXRlIHRoYXQgc3RhdGVcbiAgICAgIC8vIDIuIENvbnRyb2xsZWQ6IGl0J3MgZXh0ZXJuYWwgKHRoaXMucHJvcHMpXG4gICAgICAvLyAgICBXZSB3aWxsIGNhbGwgdGhpcy5wcm9wcy5vblN0YXRlQ2hhbmdlIHRvIHVwZGF0ZSB0aGF0IHN0YXRlXG4gICAgICAvL1xuICAgICAgLy8gSW4gYWRkaXRpb24sIHdlJ2xsIGNhbGwgdGhpcy5wcm9wcy5vbkNoYW5nZSBpZiB0aGVcbiAgICAgIC8vIHNlbGVjdGVkSXRlbSBpcyBjaGFuZ2VkLlxuICAgICAgX3RoaXMuaW50ZXJuYWxTZXRTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZVRvU2V0LCBjYikge1xuICAgICAgICB2YXIgaXNJdGVtU2VsZWN0ZWQsIG9uQ2hhbmdlQXJnO1xuICAgICAgICB2YXIgb25TdGF0ZUNoYW5nZUFyZyA9IHt9O1xuICAgICAgICB2YXIgaXNTdGF0ZVRvU2V0RnVuY3Rpb24gPSB0eXBlb2Ygc3RhdGVUb1NldCA9PT0gJ2Z1bmN0aW9uJztcblxuICAgICAgICAvLyB3ZSB3YW50IHRvIGNhbGwgYG9uSW5wdXRWYWx1ZUNoYW5nZWAgYmVmb3JlIHRoZSBgc2V0U3RhdGVgIGNhbGxcbiAgICAgICAgLy8gc28gc29tZW9uZSBjb250cm9sbGluZyB0aGUgYGlucHV0VmFsdWVgIHN0YXRlIGdldHMgbm90aWZpZWQgb2ZcbiAgICAgICAgLy8gdGhlIGlucHV0IGNoYW5nZSBhcyBzb29uIGFzIHBvc3NpYmxlLiBUaGlzIGF2b2lkcyBpc3N1ZXMgd2l0aFxuICAgICAgICAvLyBwcmVzZXJ2aW5nIHRoZSBjdXJzb3IgcG9zaXRpb24uXG4gICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZG93bnNoaWZ0LWpzL2Rvd25zaGlmdC9pc3N1ZXMvMjE3IGZvciBtb3JlIGluZm8uXG4gICAgICAgIGlmICghaXNTdGF0ZVRvU2V0RnVuY3Rpb24gJiYgc3RhdGVUb1NldC5oYXNPd25Qcm9wZXJ0eSgnaW5wdXRWYWx1ZScpKSB7XG4gICAgICAgICAgX3RoaXMucHJvcHMub25JbnB1dFZhbHVlQ2hhbmdlKHN0YXRlVG9TZXQuaW5wdXRWYWx1ZSwgX2V4dGVuZHMoe30sIF90aGlzLmdldFN0YXRlQW5kSGVscGVycygpLCBzdGF0ZVRvU2V0KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF90aGlzLnNldFN0YXRlKGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAgIHN0YXRlID0gX3RoaXMuZ2V0U3RhdGUoc3RhdGUpO1xuICAgICAgICAgIHZhciBuZXdTdGF0ZVRvU2V0ID0gaXNTdGF0ZVRvU2V0RnVuY3Rpb24gPyBzdGF0ZVRvU2V0KHN0YXRlKSA6IHN0YXRlVG9TZXQ7XG5cbiAgICAgICAgICAvLyBZb3VyIG93biBmdW5jdGlvbiB0aGF0IGNvdWxkIG1vZGlmeSB0aGUgc3RhdGUgdGhhdCB3aWxsIGJlIHNldC5cbiAgICAgICAgICBuZXdTdGF0ZVRvU2V0ID0gX3RoaXMucHJvcHMuc3RhdGVSZWR1Y2VyKHN0YXRlLCBuZXdTdGF0ZVRvU2V0KTtcblxuICAgICAgICAgIC8vIGNoZWNrcyBpZiBhbiBpdGVtIGlzIHNlbGVjdGVkLCByZWdhcmRsZXNzIG9mIGlmIGl0J3MgZGlmZmVyZW50IGZyb21cbiAgICAgICAgICAvLyB3aGF0IHdhcyBzZWxlY3RlZCBiZWZvcmVcbiAgICAgICAgICAvLyB1c2VkIHRvIGRldGVybWluZSBpZiBvblNlbGVjdCBhbmQgb25DaGFuZ2UgY2FsbGJhY2tzIHNob3VsZCBiZSBjYWxsZWRcbiAgICAgICAgICBpc0l0ZW1TZWxlY3RlZCA9IG5ld1N0YXRlVG9TZXQuaGFzT3duUHJvcGVydHkoJ3NlbGVjdGVkSXRlbScpO1xuICAgICAgICAgIC8vIHRoaXMga2VlcHMgdHJhY2sgb2YgdGhlIG9iamVjdCB3ZSB3YW50IHRvIGNhbGwgd2l0aCBzZXRTdGF0ZVxuICAgICAgICAgIHZhciBuZXh0U3RhdGUgPSB7fTtcbiAgICAgICAgICAvLyB3ZSBuZWVkIHRvIGNhbGwgb24gY2hhbmdlIGlmIHRoZSBvdXRzaWRlIHdvcmxkIGlzIGNvbnRyb2xsaW5nIGFueSBvZiBvdXIgc3RhdGVcbiAgICAgICAgICAvLyBhbmQgd2UncmUgdHJ5aW5nIHRvIHVwZGF0ZSB0aGF0IHN0YXRlLiBPUiBpZiB0aGUgc2VsZWN0aW9uIGhhcyBjaGFuZ2VkIGFuZCB3ZSdyZVxuICAgICAgICAgIC8vIHRyeWluZyB0byB1cGRhdGUgdGhlIHNlbGVjdGlvblxuICAgICAgICAgIGlmIChpc0l0ZW1TZWxlY3RlZCAmJiBuZXdTdGF0ZVRvU2V0LnNlbGVjdGVkSXRlbSAhPT0gc3RhdGUuc2VsZWN0ZWRJdGVtKSB7XG4gICAgICAgICAgICBvbkNoYW5nZUFyZyA9IG5ld1N0YXRlVG9TZXQuc2VsZWN0ZWRJdGVtO1xuICAgICAgICAgIH1cbiAgICAgICAgICBuZXdTdGF0ZVRvU2V0LnR5cGUgPSBuZXdTdGF0ZVRvU2V0LnR5cGUgfHwgdW5rbm93bjtcbiAgICAgICAgICBPYmplY3Qua2V5cyhuZXdTdGF0ZVRvU2V0KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIC8vIG9uU3RhdGVDaGFuZ2VBcmcgc2hvdWxkIG9ubHkgaGF2ZSB0aGUgc3RhdGUgdGhhdCBpc1xuICAgICAgICAgICAgLy8gYWN0dWFsbHkgY2hhbmdpbmdcbiAgICAgICAgICAgIGlmIChzdGF0ZVtrZXldICE9PSBuZXdTdGF0ZVRvU2V0W2tleV0pIHtcbiAgICAgICAgICAgICAgb25TdGF0ZUNoYW5nZUFyZ1trZXldID0gbmV3U3RhdGVUb1NldFtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGhlIHR5cGUgaXMgdXNlZnVsIGZvciB0aGUgb25TdGF0ZUNoYW5nZUFyZ1xuICAgICAgICAgICAgLy8gYnV0IHdlIGRvbid0IGFjdHVhbGx5IHdhbnQgdG8gc2V0IGl0IGluIGludGVybmFsIHN0YXRlLlxuICAgICAgICAgICAgLy8gdGhpcyBpcyBhbiB1bmRvY3VtZW50ZWQgZmVhdHVyZSBmb3Igbm93Li4uIE5vdCBhbGwgaW50ZXJuYWxTZXRTdGF0ZVxuICAgICAgICAgICAgLy8gY2FsbHMgc3VwcG9ydCBpdCBhbmQgSSdtIG5vdCBjZXJ0YWluIHdlIHdhbnQgdGhlbSB0byB5ZXQuXG4gICAgICAgICAgICAvLyBCdXQgaXQgZW5hYmxlcyB1c2VycyBjb250cm9sbGluZyB0aGUgaXNPcGVuIHN0YXRlIHRvIGtub3cgd2hlblxuICAgICAgICAgICAgLy8gdGhlIGlzT3BlbiBzdGF0ZSBjaGFuZ2VzIGR1ZSB0byBtb3VzZXVwIGV2ZW50cyB3aGljaCBpcyBxdWl0ZSBoYW5keS5cbiAgICAgICAgICAgIGlmIChrZXkgPT09ICd0eXBlJykge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdTdGF0ZVRvU2V0W2tleV07XG4gICAgICAgICAgICAvLyBpZiBpdCdzIGNvbWluZyBmcm9tIHByb3BzLCB0aGVuIHdlIGRvbid0IGNhcmUgdG8gc2V0IGl0IGludGVybmFsbHlcbiAgICAgICAgICAgIGlmICghaXNDb250cm9sbGVkUHJvcChfdGhpcy5wcm9wcywga2V5KSkge1xuICAgICAgICAgICAgICBuZXh0U3RhdGVba2V5XSA9IG5ld1N0YXRlVG9TZXRba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIGlmIHN0YXRlVG9TZXQgaXMgYSBmdW5jdGlvbiwgdGhlbiB3ZSB3ZXJlbid0IGFibGUgdG8gY2FsbCBvbklucHV0VmFsdWVDaGFuZ2VcbiAgICAgICAgICAvLyBlYXJsaWVyLCBzbyB3ZSdsbCBjYWxsIGl0IG5vdyB0aGF0IHdlIGtub3cgd2hhdCB0aGUgaW5wdXRWYWx1ZSBzdGF0ZSB3aWxsIGJlLlxuICAgICAgICAgIGlmIChpc1N0YXRlVG9TZXRGdW5jdGlvbiAmJiBuZXdTdGF0ZVRvU2V0Lmhhc093blByb3BlcnR5KCdpbnB1dFZhbHVlJykpIHtcbiAgICAgICAgICAgIF90aGlzLnByb3BzLm9uSW5wdXRWYWx1ZUNoYW5nZShuZXdTdGF0ZVRvU2V0LmlucHV0VmFsdWUsIF9leHRlbmRzKHt9LCBfdGhpcy5nZXRTdGF0ZUFuZEhlbHBlcnMoKSwgbmV3U3RhdGVUb1NldCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV4dFN0YXRlO1xuICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gY2FsbCB0aGUgcHJvdmlkZWQgY2FsbGJhY2sgaWYgaXQncyBhIGZ1bmN0aW9uXG4gICAgICAgICAgY2JUb0NiKGNiKSgpO1xuXG4gICAgICAgICAgLy8gb25seSBjYWxsIHRoZSBvblN0YXRlQ2hhbmdlIGFuZCBvbkNoYW5nZSBjYWxsYmFja3MgaWZcbiAgICAgICAgICAvLyB3ZSBoYXZlIHJlbGV2YW50IGluZm9ybWF0aW9uIHRvIHBhc3MgdGhlbS5cbiAgICAgICAgICB2YXIgaGFzTW9yZVN0YXRlVGhhblR5cGUgPSBPYmplY3Qua2V5cyhvblN0YXRlQ2hhbmdlQXJnKS5sZW5ndGggPiAxO1xuICAgICAgICAgIGlmIChoYXNNb3JlU3RhdGVUaGFuVHlwZSkge1xuICAgICAgICAgICAgX3RoaXMucHJvcHMub25TdGF0ZUNoYW5nZShvblN0YXRlQ2hhbmdlQXJnLCBfdGhpcy5nZXRTdGF0ZUFuZEhlbHBlcnMoKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpc0l0ZW1TZWxlY3RlZCkge1xuICAgICAgICAgICAgX3RoaXMucHJvcHMub25TZWxlY3Qoc3RhdGVUb1NldC5zZWxlY3RlZEl0ZW0sIF90aGlzLmdldFN0YXRlQW5kSGVscGVycygpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG9uQ2hhbmdlQXJnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIF90aGlzLnByb3BzLm9uQ2hhbmdlKG9uQ2hhbmdlQXJnLCBfdGhpcy5nZXRTdGF0ZUFuZEhlbHBlcnMoKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHRoaXMgaXMgY3VycmVudGx5IHVuZG9jdW1lbnRlZCBhbmQgdGhlcmVmb3JlIHN1YmplY3QgdG8gY2hhbmdlXG4gICAgICAgICAgLy8gV2UnbGwgdHJ5IHRvIG5vdCBicmVhayBpdCwgYnV0IGp1c3QgYmUgd2FybmVkLlxuICAgICAgICAgIF90aGlzLnByb3BzLm9uVXNlckFjdGlvbihvblN0YXRlQ2hhbmdlQXJnLCBfdGhpcy5nZXRTdGF0ZUFuZEhlbHBlcnMoKSk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gUk9PVFxuICAgICAgX3RoaXMucm9vdFJlZiA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5fcm9vdE5vZGUgPSBub2RlO1xuICAgICAgfTtcbiAgICAgIF90aGlzLmdldFJvb3RQcm9wcyA9IGZ1bmN0aW9uIChfdGVtcCwgX3RlbXAyKSB7XG4gICAgICAgIHZhciBfZXh0ZW5kczI7XG4gICAgICAgIHZhciBfcmVmID0gX3RlbXAgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAsXG4gICAgICAgICAgX3JlZiRyZWZLZXkgPSBfcmVmLnJlZktleSxcbiAgICAgICAgICByZWZLZXkgPSBfcmVmJHJlZktleSA9PT0gdm9pZCAwID8gJ3JlZicgOiBfcmVmJHJlZktleSxcbiAgICAgICAgICByZWYgPSBfcmVmLnJlZixcbiAgICAgICAgICByZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZiwgX2V4Y2x1ZGVkJDQpO1xuICAgICAgICB2YXIgX3JlZjIgPSBfdGVtcDIgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAyLFxuICAgICAgICAgIF9yZWYyJHN1cHByZXNzUmVmRXJybyA9IF9yZWYyLnN1cHByZXNzUmVmRXJyb3IsXG4gICAgICAgICAgc3VwcHJlc3NSZWZFcnJvciA9IF9yZWYyJHN1cHByZXNzUmVmRXJybyA9PT0gdm9pZCAwID8gZmFsc2UgOiBfcmVmMiRzdXBwcmVzc1JlZkVycm87XG4gICAgICAgIC8vIHRoaXMgaXMgdXNlZCBpbiB0aGUgcmVuZGVyIHRvIGtub3cgd2hldGhlciB0aGUgdXNlciBoYXMgY2FsbGVkIGdldFJvb3RQcm9wcy5cbiAgICAgICAgLy8gSXQgdXNlcyB0aGF0IHRvIGtub3cgd2hldGhlciB0byBhcHBseSB0aGUgcHJvcHMgYXV0b21hdGljYWxseVxuICAgICAgICBfdGhpcy5nZXRSb290UHJvcHMuY2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgX3RoaXMuZ2V0Um9vdFByb3BzLnJlZktleSA9IHJlZktleTtcbiAgICAgICAgX3RoaXMuZ2V0Um9vdFByb3BzLnN1cHByZXNzUmVmRXJyb3IgPSBzdXBwcmVzc1JlZkVycm9yO1xuICAgICAgICB2YXIgX3RoaXMkZ2V0U3RhdGUgPSBfdGhpcy5nZXRTdGF0ZSgpLFxuICAgICAgICAgIGlzT3BlbiA9IF90aGlzJGdldFN0YXRlLmlzT3BlbjtcbiAgICAgICAgcmV0dXJuIF9leHRlbmRzKChfZXh0ZW5kczIgPSB7fSwgX2V4dGVuZHMyW3JlZktleV0gPSBoYW5kbGVSZWZzKHJlZiwgX3RoaXMucm9vdFJlZiksIF9leHRlbmRzMi5yb2xlID0gJ2NvbWJvYm94JywgX2V4dGVuZHMyWydhcmlhLWV4cGFuZGVkJ10gPSBpc09wZW4sIF9leHRlbmRzMlsnYXJpYS1oYXNwb3B1cCddID0gJ2xpc3Rib3gnLCBfZXh0ZW5kczJbJ2FyaWEtb3ducyddID0gaXNPcGVuID8gX3RoaXMubWVudUlkIDogbnVsbCwgX2V4dGVuZHMyWydhcmlhLWxhYmVsbGVkYnknXSA9IF90aGlzLmxhYmVsSWQsIF9leHRlbmRzMiksIHJlc3QpO1xuICAgICAgfTtcbiAgICAgIC8vXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBST09UXG4gICAgICBfdGhpcy5rZXlEb3duSGFuZGxlcnMgPSB7XG4gICAgICAgIEFycm93RG93bjogZnVuY3Rpb24gQXJyb3dEb3duKGV2ZW50KSB7XG4gICAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBpZiAodGhpcy5nZXRTdGF0ZSgpLmlzT3Blbikge1xuICAgICAgICAgICAgdmFyIGFtb3VudCA9IGV2ZW50LnNoaWZ0S2V5ID8gNSA6IDE7XG4gICAgICAgICAgICB0aGlzLm1vdmVIaWdobGlnaHRlZEluZGV4KGFtb3VudCwge1xuICAgICAgICAgICAgICB0eXBlOiBrZXlEb3duQXJyb3dEb3duXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbnRlcm5hbFNldFN0YXRlKHtcbiAgICAgICAgICAgICAgaXNPcGVuOiB0cnVlLFxuICAgICAgICAgICAgICB0eXBlOiBrZXlEb3duQXJyb3dEb3duXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBpdGVtQ291bnQgPSBfdGhpczIuZ2V0SXRlbUNvdW50KCk7XG4gICAgICAgICAgICAgIGlmIChpdGVtQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzMiRnZXRTdGF0ZSA9IF90aGlzMi5nZXRTdGF0ZSgpLFxuICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleCA9IF90aGlzMiRnZXRTdGF0ZS5oaWdobGlnaHRlZEluZGV4O1xuICAgICAgICAgICAgICAgIHZhciBuZXh0SGlnaGxpZ2h0ZWRJbmRleCA9IGdldE5leHRXcmFwcGluZ0luZGV4KDEsIGhpZ2hsaWdodGVkSW5kZXgsIGl0ZW1Db3VudCwgZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMyLmdldEl0ZW1Ob2RlRnJvbUluZGV4KGluZGV4KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBfdGhpczIuc2V0SGlnaGxpZ2h0ZWRJbmRleChuZXh0SGlnaGxpZ2h0ZWRJbmRleCwge1xuICAgICAgICAgICAgICAgICAgdHlwZToga2V5RG93bkFycm93RG93blxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIEFycm93VXA6IGZ1bmN0aW9uIEFycm93VXAoZXZlbnQpIHtcbiAgICAgICAgICB2YXIgX3RoaXMzID0gdGhpcztcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGlmICh0aGlzLmdldFN0YXRlKCkuaXNPcGVuKSB7XG4gICAgICAgICAgICB2YXIgYW1vdW50ID0gZXZlbnQuc2hpZnRLZXkgPyAtNSA6IC0xO1xuICAgICAgICAgICAgdGhpcy5tb3ZlSGlnaGxpZ2h0ZWRJbmRleChhbW91bnQsIHtcbiAgICAgICAgICAgICAgdHlwZToga2V5RG93bkFycm93VXBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmludGVybmFsU2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpc09wZW46IHRydWUsXG4gICAgICAgICAgICAgIHR5cGU6IGtleURvd25BcnJvd1VwXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBpdGVtQ291bnQgPSBfdGhpczMuZ2V0SXRlbUNvdW50KCk7XG4gICAgICAgICAgICAgIGlmIChpdGVtQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzMyRnZXRTdGF0ZSA9IF90aGlzMy5nZXRTdGF0ZSgpLFxuICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleCA9IF90aGlzMyRnZXRTdGF0ZS5oaWdobGlnaHRlZEluZGV4O1xuICAgICAgICAgICAgICAgIHZhciBuZXh0SGlnaGxpZ2h0ZWRJbmRleCA9IGdldE5leHRXcmFwcGluZ0luZGV4KC0xLCBoaWdobGlnaHRlZEluZGV4LCBpdGVtQ291bnQsIGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzMy5nZXRJdGVtTm9kZUZyb21JbmRleChpbmRleCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgX3RoaXMzLnNldEhpZ2hsaWdodGVkSW5kZXgobmV4dEhpZ2hsaWdodGVkSW5kZXgsIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6IGtleURvd25BcnJvd1VwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgRW50ZXI6IGZ1bmN0aW9uIEVudGVyKGV2ZW50KSB7XG4gICAgICAgICAgaWYgKGV2ZW50LndoaWNoID09PSAyMjkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIF90aGlzJGdldFN0YXRlMiA9IHRoaXMuZ2V0U3RhdGUoKSxcbiAgICAgICAgICAgIGlzT3BlbiA9IF90aGlzJGdldFN0YXRlMi5pc09wZW4sXG4gICAgICAgICAgICBoaWdobGlnaHRlZEluZGV4ID0gX3RoaXMkZ2V0U3RhdGUyLmhpZ2hsaWdodGVkSW5kZXg7XG4gICAgICAgICAgaWYgKGlzT3BlbiAmJiBoaWdobGlnaHRlZEluZGV4ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMuaXRlbXNbaGlnaGxpZ2h0ZWRJbmRleF07XG4gICAgICAgICAgICB2YXIgaXRlbU5vZGUgPSB0aGlzLmdldEl0ZW1Ob2RlRnJvbUluZGV4KGhpZ2hsaWdodGVkSW5kZXgpO1xuICAgICAgICAgICAgaWYgKGl0ZW0gPT0gbnVsbCB8fCBpdGVtTm9kZSAmJiBpdGVtTm9kZS5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZWxlY3RIaWdobGlnaHRlZEl0ZW0oe1xuICAgICAgICAgICAgICB0eXBlOiBrZXlEb3duRW50ZXJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgRXNjYXBlOiBmdW5jdGlvbiBFc2NhcGUoZXZlbnQpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMucmVzZXQoX2V4dGVuZHMoe1xuICAgICAgICAgICAgdHlwZToga2V5RG93bkVzY2FwZVxuICAgICAgICAgIH0sICF0aGlzLnN0YXRlLmlzT3BlbiAmJiB7XG4gICAgICAgICAgICBzZWxlY3RlZEl0ZW06IG51bGwsXG4gICAgICAgICAgICBpbnB1dFZhbHVlOiAnJ1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gQlVUVE9OXG4gICAgICBfdGhpcy5idXR0b25LZXlEb3duSGFuZGxlcnMgPSBfZXh0ZW5kcyh7fSwgX3RoaXMua2V5RG93bkhhbmRsZXJzLCB7XG4gICAgICAgICcgJzogZnVuY3Rpb24gXyhldmVudCkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy50b2dnbGVNZW51KHtcbiAgICAgICAgICAgIHR5cGU6IGtleURvd25TcGFjZUJ1dHRvblxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIF90aGlzLmlucHV0S2V5RG93bkhhbmRsZXJzID0gX2V4dGVuZHMoe30sIF90aGlzLmtleURvd25IYW5kbGVycywge1xuICAgICAgICBIb21lOiBmdW5jdGlvbiBIb21lKGV2ZW50KSB7XG4gICAgICAgICAgdmFyIF90aGlzNCA9IHRoaXM7XG4gICAgICAgICAgdmFyIF90aGlzJGdldFN0YXRlMyA9IHRoaXMuZ2V0U3RhdGUoKSxcbiAgICAgICAgICAgIGlzT3BlbiA9IF90aGlzJGdldFN0YXRlMy5pc09wZW47XG4gICAgICAgICAgaWYgKCFpc09wZW4pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB2YXIgaXRlbUNvdW50ID0gdGhpcy5nZXRJdGVtQ291bnQoKTtcbiAgICAgICAgICBpZiAoaXRlbUNvdW50IDw9IDAgfHwgIWlzT3Blbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGdldCBuZXh0IG5vbi1kaXNhYmxlZCBzdGFydGluZyBkb3dud2FyZHMgZnJvbSAwIGlmIHRoYXQncyBkaXNhYmxlZC5cbiAgICAgICAgICB2YXIgbmV3SGlnaGxpZ2h0ZWRJbmRleCA9IGdldE5leHROb25EaXNhYmxlZEluZGV4KDEsIDAsIGl0ZW1Db3VudCwgZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXM0LmdldEl0ZW1Ob2RlRnJvbUluZGV4KGluZGV4KTtcbiAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgdGhpcy5zZXRIaWdobGlnaHRlZEluZGV4KG5ld0hpZ2hsaWdodGVkSW5kZXgsIHtcbiAgICAgICAgICAgIHR5cGU6IGtleURvd25Ib21lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIEVuZDogZnVuY3Rpb24gRW5kKGV2ZW50KSB7XG4gICAgICAgICAgdmFyIF90aGlzNSA9IHRoaXM7XG4gICAgICAgICAgdmFyIF90aGlzJGdldFN0YXRlNCA9IHRoaXMuZ2V0U3RhdGUoKSxcbiAgICAgICAgICAgIGlzT3BlbiA9IF90aGlzJGdldFN0YXRlNC5pc09wZW47XG4gICAgICAgICAgaWYgKCFpc09wZW4pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB2YXIgaXRlbUNvdW50ID0gdGhpcy5nZXRJdGVtQ291bnQoKTtcbiAgICAgICAgICBpZiAoaXRlbUNvdW50IDw9IDAgfHwgIWlzT3Blbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGdldCBuZXh0IG5vbi1kaXNhYmxlZCBzdGFydGluZyB1cHdhcmRzIGZyb20gbGFzdCBpbmRleCBpZiB0aGF0J3MgZGlzYWJsZWQuXG4gICAgICAgICAgdmFyIG5ld0hpZ2hsaWdodGVkSW5kZXggPSBnZXROZXh0Tm9uRGlzYWJsZWRJbmRleCgtMSwgaXRlbUNvdW50IC0gMSwgaXRlbUNvdW50LCBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpczUuZ2V0SXRlbU5vZGVGcm9tSW5kZXgoaW5kZXgpO1xuICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICB0aGlzLnNldEhpZ2hsaWdodGVkSW5kZXgobmV3SGlnaGxpZ2h0ZWRJbmRleCwge1xuICAgICAgICAgICAgdHlwZToga2V5RG93bkVuZFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIF90aGlzLmdldFRvZ2dsZUJ1dHRvblByb3BzID0gZnVuY3Rpb24gKF90ZW1wMykge1xuICAgICAgICB2YXIgX3JlZjMgPSBfdGVtcDMgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAzLFxuICAgICAgICAgIG9uQ2xpY2sgPSBfcmVmMy5vbkNsaWNrO1xuICAgICAgICAgIF9yZWYzLm9uUHJlc3M7XG4gICAgICAgICAgdmFyIG9uS2V5RG93biA9IF9yZWYzLm9uS2V5RG93bixcbiAgICAgICAgICBvbktleVVwID0gX3JlZjMub25LZXlVcCxcbiAgICAgICAgICBvbkJsdXIgPSBfcmVmMy5vbkJsdXIsXG4gICAgICAgICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWYzLCBfZXhjbHVkZWQyJDMpO1xuICAgICAgICB2YXIgX3RoaXMkZ2V0U3RhdGU1ID0gX3RoaXMuZ2V0U3RhdGUoKSxcbiAgICAgICAgICBpc09wZW4gPSBfdGhpcyRnZXRTdGF0ZTUuaXNPcGVuO1xuICAgICAgICB2YXIgZW5hYmxlZEV2ZW50SGFuZGxlcnMgPSB7XG4gICAgICAgICAgb25DbGljazogY2FsbEFsbEV2ZW50SGFuZGxlcnMob25DbGljaywgX3RoaXMuYnV0dG9uSGFuZGxlQ2xpY2spLFxuICAgICAgICAgIG9uS2V5RG93bjogY2FsbEFsbEV2ZW50SGFuZGxlcnMob25LZXlEb3duLCBfdGhpcy5idXR0b25IYW5kbGVLZXlEb3duKSxcbiAgICAgICAgICBvbktleVVwOiBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbktleVVwLCBfdGhpcy5idXR0b25IYW5kbGVLZXlVcCksXG4gICAgICAgICAgb25CbHVyOiBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbkJsdXIsIF90aGlzLmJ1dHRvbkhhbmRsZUJsdXIpXG4gICAgICAgIH07XG4gICAgICAgIHZhciBldmVudEhhbmRsZXJzID0gcmVzdC5kaXNhYmxlZCA/IHt9IDogZW5hYmxlZEV2ZW50SGFuZGxlcnM7XG4gICAgICAgIHJldHVybiBfZXh0ZW5kcyh7XG4gICAgICAgICAgdHlwZTogJ2J1dHRvbicsXG4gICAgICAgICAgcm9sZTogJ2J1dHRvbicsXG4gICAgICAgICAgJ2FyaWEtbGFiZWwnOiBpc09wZW4gPyAnY2xvc2UgbWVudScgOiAnb3BlbiBtZW51JyxcbiAgICAgICAgICAnYXJpYS1oYXNwb3B1cCc6IHRydWUsXG4gICAgICAgICAgJ2RhdGEtdG9nZ2xlJzogdHJ1ZVxuICAgICAgICB9LCBldmVudEhhbmRsZXJzLCByZXN0KTtcbiAgICAgIH07XG4gICAgICBfdGhpcy5idXR0b25IYW5kbGVLZXlVcCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvLyBQcmV2ZW50IGNsaWNrIGV2ZW50IGZyb20gZW1pdHRpbmcgaW4gRmlyZWZveFxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfTtcbiAgICAgIF90aGlzLmJ1dHRvbkhhbmRsZUtleURvd24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGtleSA9IG5vcm1hbGl6ZUFycm93S2V5KGV2ZW50KTtcbiAgICAgICAgaWYgKF90aGlzLmJ1dHRvbktleURvd25IYW5kbGVyc1trZXldKSB7XG4gICAgICAgICAgX3RoaXMuYnV0dG9uS2V5RG93bkhhbmRsZXJzW2tleV0uY2FsbChfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgX3RoaXMuYnV0dG9uSGFuZGxlQ2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgLy8gaGFuZGxlIG9kZCBjYXNlIGZvciBTYWZhcmkgYW5kIEZpcmVmb3ggd2hpY2hcbiAgICAgICAgLy8gZG9uJ3QgZ2l2ZSB0aGUgYnV0dG9uIHRoZSBmb2N1cyBwcm9wZXJseS5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmIChjYW4ndCByZWFzb25hYmx5IHRlc3QgdGhpcykgKi9cbiAgICAgICAgaWYgKF90aGlzLnByb3BzLmVudmlyb25tZW50LmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IF90aGlzLnByb3BzLmVudmlyb25tZW50LmRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICBldmVudC50YXJnZXQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0byBzaW1wbGlmeSB0ZXN0aW5nIGNvbXBvbmVudHMgdGhhdCB1c2UgZG93bnNoaWZ0LCB3ZSdsbCBub3Qgd3JhcCB0aGlzIGluIGEgc2V0VGltZW91dFxuICAgICAgICAvLyBpZiB0aGUgTk9ERV9FTlYgaXMgdGVzdC4gV2l0aCB0aGUgcHJvcGVyIGJ1aWxkIHN5c3RlbSwgdGhpcyBzaG91bGQgYmUgZGVhZCBjb2RlIGVsaW1pbmF0ZWRcbiAgICAgICAgLy8gd2hlbiBidWlsZGluZyBmb3IgcHJvZHVjdGlvbiBhbmQgc2hvdWxkIHRoZXJlZm9yZSBoYXZlIG5vIGltcGFjdCBvbiBwcm9kdWN0aW9uIGNvZGUuXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Rlc3QnKSB7XG4gICAgICAgICAgX3RoaXMudG9nZ2xlTWVudSh7XG4gICAgICAgICAgICB0eXBlOiBjbGlja0J1dHRvblxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEVuc3VyZSB0aGF0IHRvZ2dsZSBvZiBtZW51IG9jY3VycyBhZnRlciB0aGUgcG90ZW50aWFsIGJsdXIgZXZlbnQgaW4gaU9TXG4gICAgICAgICAgX3RoaXMuaW50ZXJuYWxTZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy50b2dnbGVNZW51KHtcbiAgICAgICAgICAgICAgdHlwZTogY2xpY2tCdXR0b25cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgX3RoaXMuYnV0dG9uSGFuZGxlQmx1ciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgYmx1clRhcmdldCA9IGV2ZW50LnRhcmdldDsgLy8gU2F2ZSBibHVyIHRhcmdldCBmb3IgY29tcGFyaXNvbiB3aXRoIGFjdGl2ZUVsZW1lbnQgbGF0ZXJcbiAgICAgICAgLy8gTmVlZCBzZXRUaW1lb3V0LCBzbyB0aGF0IHdoZW4gdGhlIHVzZXIgcHJlc3NlcyBUYWIsIHRoZSBhY3RpdmVFbGVtZW50IGlzIHRoZSBuZXh0IGZvY3VzZWQgZWxlbWVudCwgbm90IGJvZHkgZWxlbWVudFxuICAgICAgICBfdGhpcy5pbnRlcm5hbFNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghX3RoaXMuaXNNb3VzZURvd24gJiYgKF90aGlzLnByb3BzLmVudmlyb25tZW50LmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT0gbnVsbCB8fCBfdGhpcy5wcm9wcy5lbnZpcm9ubWVudC5kb2N1bWVudC5hY3RpdmVFbGVtZW50LmlkICE9PSBfdGhpcy5pbnB1dElkKSAmJiBfdGhpcy5wcm9wcy5lbnZpcm9ubWVudC5kb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBibHVyVGFyZ2V0IC8vIERvIG5vdGhpbmcgaWYgd2UgcmVmb2N1cyB0aGUgc2FtZSBlbGVtZW50IGFnYWluICh0byBzb2x2ZSBpc3N1ZSBpbiBTYWZhcmkgb24gaU9TKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgX3RoaXMucmVzZXQoe1xuICAgICAgICAgICAgICB0eXBlOiBibHVyQnV0dG9uXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIC8vXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBCVVRUT05cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gTEFCRUxcbiAgICAgIF90aGlzLmdldExhYmVsUHJvcHMgPSBmdW5jdGlvbiAocHJvcHMpIHtcbiAgICAgICAgcmV0dXJuIF9leHRlbmRzKHtcbiAgICAgICAgICBodG1sRm9yOiBfdGhpcy5pbnB1dElkLFxuICAgICAgICAgIGlkOiBfdGhpcy5sYWJlbElkXG4gICAgICAgIH0sIHByb3BzKTtcbiAgICAgIH07XG4gICAgICAvL1xcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgTEFCRUxcbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gSU5QVVRcbiAgICAgIF90aGlzLmdldElucHV0UHJvcHMgPSBmdW5jdGlvbiAoX3RlbXA0KSB7XG4gICAgICAgIHZhciBfcmVmNCA9IF90ZW1wNCA9PT0gdm9pZCAwID8ge30gOiBfdGVtcDQsXG4gICAgICAgICAgb25LZXlEb3duID0gX3JlZjQub25LZXlEb3duLFxuICAgICAgICAgIG9uQmx1ciA9IF9yZWY0Lm9uQmx1cixcbiAgICAgICAgICBvbkNoYW5nZSA9IF9yZWY0Lm9uQ2hhbmdlLFxuICAgICAgICAgIG9uSW5wdXQgPSBfcmVmNC5vbklucHV0O1xuICAgICAgICAgIF9yZWY0Lm9uQ2hhbmdlVGV4dDtcbiAgICAgICAgICB2YXIgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWY0LCBfZXhjbHVkZWQzJDIpO1xuICAgICAgICB2YXIgb25DaGFuZ2VLZXk7XG4gICAgICAgIHZhciBldmVudEhhbmRsZXJzID0ge307XG5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKHByZWFjdCkgKi9cbiAgICAgICAge1xuICAgICAgICAgIG9uQ2hhbmdlS2V5ID0gJ29uQ2hhbmdlJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgX3RoaXMkZ2V0U3RhdGU2ID0gX3RoaXMuZ2V0U3RhdGUoKSxcbiAgICAgICAgICBpbnB1dFZhbHVlID0gX3RoaXMkZ2V0U3RhdGU2LmlucHV0VmFsdWUsXG4gICAgICAgICAgaXNPcGVuID0gX3RoaXMkZ2V0U3RhdGU2LmlzT3BlbixcbiAgICAgICAgICBoaWdobGlnaHRlZEluZGV4ID0gX3RoaXMkZ2V0U3RhdGU2LmhpZ2hsaWdodGVkSW5kZXg7XG4gICAgICAgIGlmICghcmVzdC5kaXNhYmxlZCkge1xuICAgICAgICAgIHZhciBfZXZlbnRIYW5kbGVycztcbiAgICAgICAgICBldmVudEhhbmRsZXJzID0gKF9ldmVudEhhbmRsZXJzID0ge30sIF9ldmVudEhhbmRsZXJzW29uQ2hhbmdlS2V5XSA9IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uQ2hhbmdlLCBvbklucHV0LCBfdGhpcy5pbnB1dEhhbmRsZUNoYW5nZSksIF9ldmVudEhhbmRsZXJzLm9uS2V5RG93biA9IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uS2V5RG93biwgX3RoaXMuaW5wdXRIYW5kbGVLZXlEb3duKSwgX2V2ZW50SGFuZGxlcnMub25CbHVyID0gY2FsbEFsbEV2ZW50SGFuZGxlcnMob25CbHVyLCBfdGhpcy5pbnB1dEhhbmRsZUJsdXIpLCBfZXZlbnRIYW5kbGVycyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9leHRlbmRzKHtcbiAgICAgICAgICAnYXJpYS1hdXRvY29tcGxldGUnOiAnbGlzdCcsXG4gICAgICAgICAgJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCc6IGlzT3BlbiAmJiB0eXBlb2YgaGlnaGxpZ2h0ZWRJbmRleCA9PT0gJ251bWJlcicgJiYgaGlnaGxpZ2h0ZWRJbmRleCA+PSAwID8gX3RoaXMuZ2V0SXRlbUlkKGhpZ2hsaWdodGVkSW5kZXgpIDogbnVsbCxcbiAgICAgICAgICAnYXJpYS1jb250cm9scyc6IGlzT3BlbiA/IF90aGlzLm1lbnVJZCA6IG51bGwsXG4gICAgICAgICAgJ2FyaWEtbGFiZWxsZWRieSc6IHJlc3QgJiYgcmVzdFsnYXJpYS1sYWJlbCddID8gdW5kZWZpbmVkIDogX3RoaXMubGFiZWxJZCxcbiAgICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9TZWN1cml0eS9TZWN1cmluZ195b3VyX3NpdGUvVHVybmluZ19vZmZfZm9ybV9hdXRvY29tcGxldGlvblxuICAgICAgICAgIC8vIHJldmVydCBiYWNrIHNpbmNlIGF1dG9jb21wbGV0ZT1cIm5vcGVcIiBpcyBpZ25vcmVkIG9uIGxhdGVzdCBDaHJvbWUgYW5kIE9wZXJhXG4gICAgICAgICAgYXV0b0NvbXBsZXRlOiAnb2ZmJyxcbiAgICAgICAgICB2YWx1ZTogaW5wdXRWYWx1ZSxcbiAgICAgICAgICBpZDogX3RoaXMuaW5wdXRJZFxuICAgICAgICB9LCBldmVudEhhbmRsZXJzLCByZXN0KTtcbiAgICAgIH07XG4gICAgICBfdGhpcy5pbnB1dEhhbmRsZUtleURvd24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGtleSA9IG5vcm1hbGl6ZUFycm93S2V5KGV2ZW50KTtcbiAgICAgICAgaWYgKGtleSAmJiBfdGhpcy5pbnB1dEtleURvd25IYW5kbGVyc1trZXldKSB7XG4gICAgICAgICAgX3RoaXMuaW5wdXRLZXlEb3duSGFuZGxlcnNba2V5XS5jYWxsKF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBldmVudCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBfdGhpcy5pbnB1dEhhbmRsZUNoYW5nZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBfdGhpcy5pbnRlcm5hbFNldFN0YXRlKHtcbiAgICAgICAgICB0eXBlOiBjaGFuZ2VJbnB1dCxcbiAgICAgICAgICBpc09wZW46IHRydWUsXG4gICAgICAgICAgaW5wdXRWYWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlLFxuICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IF90aGlzLnByb3BzLmRlZmF1bHRIaWdobGlnaHRlZEluZGV4XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIF90aGlzLmlucHV0SGFuZGxlQmx1ciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gTmVlZCBzZXRUaW1lb3V0LCBzbyB0aGF0IHdoZW4gdGhlIHVzZXIgcHJlc3NlcyBUYWIsIHRoZSBhY3RpdmVFbGVtZW50IGlzIHRoZSBuZXh0IGZvY3VzZWQgZWxlbWVudCwgbm90IHRoZSBib2R5IGVsZW1lbnRcbiAgICAgICAgX3RoaXMuaW50ZXJuYWxTZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgZG93bnNoaWZ0QnV0dG9uSXNBY3RpdmUgPSBfdGhpcy5wcm9wcy5lbnZpcm9ubWVudC5kb2N1bWVudCAmJiAhIV90aGlzLnByb3BzLmVudmlyb25tZW50LmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgISFfdGhpcy5wcm9wcy5lbnZpcm9ubWVudC5kb2N1bWVudC5hY3RpdmVFbGVtZW50LmRhdGFzZXQgJiYgX3RoaXMucHJvcHMuZW52aXJvbm1lbnQuZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5kYXRhc2V0LnRvZ2dsZSAmJiBfdGhpcy5fcm9vdE5vZGUgJiYgX3RoaXMuX3Jvb3ROb2RlLmNvbnRhaW5zKF90aGlzLnByb3BzLmVudmlyb25tZW50LmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgIGlmICghX3RoaXMuaXNNb3VzZURvd24gJiYgIWRvd25zaGlmdEJ1dHRvbklzQWN0aXZlKSB7XG4gICAgICAgICAgICBfdGhpcy5yZXNldCh7XG4gICAgICAgICAgICAgIHR5cGU6IGJsdXJJbnB1dFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICAvL1xcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgSU5QVVRcbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gTUVOVVxuICAgICAgX3RoaXMubWVudVJlZiA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIF90aGlzLl9tZW51Tm9kZSA9IG5vZGU7XG4gICAgICB9O1xuICAgICAgX3RoaXMuZ2V0TWVudVByb3BzID0gZnVuY3Rpb24gKF90ZW1wNSwgX3RlbXA2KSB7XG4gICAgICAgIHZhciBfZXh0ZW5kczM7XG4gICAgICAgIHZhciBfcmVmNSA9IF90ZW1wNSA9PT0gdm9pZCAwID8ge30gOiBfdGVtcDUsXG4gICAgICAgICAgX3JlZjUkcmVmS2V5ID0gX3JlZjUucmVmS2V5LFxuICAgICAgICAgIHJlZktleSA9IF9yZWY1JHJlZktleSA9PT0gdm9pZCAwID8gJ3JlZicgOiBfcmVmNSRyZWZLZXksXG4gICAgICAgICAgcmVmID0gX3JlZjUucmVmLFxuICAgICAgICAgIHByb3BzID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZjUsIF9leGNsdWRlZDQkMSk7XG4gICAgICAgIHZhciBfcmVmNiA9IF90ZW1wNiA9PT0gdm9pZCAwID8ge30gOiBfdGVtcDYsXG4gICAgICAgICAgX3JlZjYkc3VwcHJlc3NSZWZFcnJvID0gX3JlZjYuc3VwcHJlc3NSZWZFcnJvcixcbiAgICAgICAgICBzdXBwcmVzc1JlZkVycm9yID0gX3JlZjYkc3VwcHJlc3NSZWZFcnJvID09PSB2b2lkIDAgPyBmYWxzZSA6IF9yZWY2JHN1cHByZXNzUmVmRXJybztcbiAgICAgICAgX3RoaXMuZ2V0TWVudVByb3BzLmNhbGxlZCA9IHRydWU7XG4gICAgICAgIF90aGlzLmdldE1lbnVQcm9wcy5yZWZLZXkgPSByZWZLZXk7XG4gICAgICAgIF90aGlzLmdldE1lbnVQcm9wcy5zdXBwcmVzc1JlZkVycm9yID0gc3VwcHJlc3NSZWZFcnJvcjtcbiAgICAgICAgcmV0dXJuIF9leHRlbmRzKChfZXh0ZW5kczMgPSB7fSwgX2V4dGVuZHMzW3JlZktleV0gPSBoYW5kbGVSZWZzKHJlZiwgX3RoaXMubWVudVJlZiksIF9leHRlbmRzMy5yb2xlID0gJ2xpc3Rib3gnLCBfZXh0ZW5kczNbJ2FyaWEtbGFiZWxsZWRieSddID0gcHJvcHMgJiYgcHJvcHNbJ2FyaWEtbGFiZWwnXSA/IG51bGwgOiBfdGhpcy5sYWJlbElkLCBfZXh0ZW5kczMuaWQgPSBfdGhpcy5tZW51SWQsIF9leHRlbmRzMyksIHByb3BzKTtcbiAgICAgIH07XG4gICAgICAvL1xcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgTUVOVVxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBJVEVNXG4gICAgICBfdGhpcy5nZXRJdGVtUHJvcHMgPSBmdW5jdGlvbiAoX3RlbXA3KSB7XG4gICAgICAgIHZhciBfZW5hYmxlZEV2ZW50SGFuZGxlcnM7XG4gICAgICAgIHZhciBfcmVmNyA9IF90ZW1wNyA9PT0gdm9pZCAwID8ge30gOiBfdGVtcDcsXG4gICAgICAgICAgb25Nb3VzZU1vdmUgPSBfcmVmNy5vbk1vdXNlTW92ZSxcbiAgICAgICAgICBvbk1vdXNlRG93biA9IF9yZWY3Lm9uTW91c2VEb3duLFxuICAgICAgICAgIG9uQ2xpY2sgPSBfcmVmNy5vbkNsaWNrO1xuICAgICAgICAgIF9yZWY3Lm9uUHJlc3M7XG4gICAgICAgICAgdmFyIGluZGV4ID0gX3JlZjcuaW5kZXgsXG4gICAgICAgICAgX3JlZjckaXRlbSA9IF9yZWY3Lml0ZW0sXG4gICAgICAgICAgaXRlbSA9IF9yZWY3JGl0ZW0gPT09IHZvaWQgMCA/IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicgPyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL3VuZGVmaW5lZCA6IHJlcXVpcmVkUHJvcCgnZ2V0SXRlbVByb3BzJywgJ2l0ZW0nKSA6IF9yZWY3JGl0ZW0sXG4gICAgICAgICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWY3LCBfZXhjbHVkZWQ1KTtcbiAgICAgICAgaWYgKGluZGV4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBfdGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgIGluZGV4ID0gX3RoaXMuaXRlbXMuaW5kZXhPZihpdGVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfdGhpcy5pdGVtc1tpbmRleF0gPSBpdGVtO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvblNlbGVjdEtleSA9ICdvbkNsaWNrJztcbiAgICAgICAgdmFyIGN1c3RvbUNsaWNrSGFuZGxlciA9IG9uQ2xpY2s7XG4gICAgICAgIHZhciBlbmFibGVkRXZlbnRIYW5kbGVycyA9IChfZW5hYmxlZEV2ZW50SGFuZGxlcnMgPSB7XG4gICAgICAgICAgLy8gb25Nb3VzZU1vdmUgaXMgdXNlZCBvdmVyIG9uTW91c2VFbnRlciBoZXJlLiBvbk1vdXNlTW92ZVxuICAgICAgICAgIC8vIGlzIG9ubHkgdHJpZ2dlcmVkIG9uIGFjdHVhbCBtb3VzZSBtb3ZlbWVudCB3aGlsZSBvbk1vdXNlRW50ZXJcbiAgICAgICAgICAvLyBjYW4gZmlyZSBvbiBET00gY2hhbmdlcywgaW50ZXJydXB0aW5nIGtleWJvYXJkIG5hdmlnYXRpb25cbiAgICAgICAgICBvbk1vdXNlTW92ZTogY2FsbEFsbEV2ZW50SGFuZGxlcnMob25Nb3VzZU1vdmUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gX3RoaXMuZ2V0U3RhdGUoKS5oaWdobGlnaHRlZEluZGV4KSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLnNldEhpZ2hsaWdodGVkSW5kZXgoaW5kZXgsIHtcbiAgICAgICAgICAgICAgdHlwZTogaXRlbU1vdXNlRW50ZXJcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBXZSBuZXZlciB3YW50IHRvIG1hbnVhbGx5IHNjcm9sbCB3aGVuIGNoYW5naW5nIHN0YXRlIGJhc2VkXG4gICAgICAgICAgICAvLyBvbiBgb25Nb3VzZU1vdmVgIGJlY2F1c2Ugd2Ugd2lsbCBiZSBtb3ZpbmcgdGhlIGVsZW1lbnQgb3V0XG4gICAgICAgICAgICAvLyBmcm9tIHVuZGVyIHRoZSB1c2VyIHdoaWNoIGlzIGN1cnJlbnRseSBzY3JvbGxpbmcvbW92aW5nIHRoZVxuICAgICAgICAgICAgLy8gY3Vyc29yXG4gICAgICAgICAgICBfdGhpcy5hdm9pZFNjcm9sbGluZyA9IHRydWU7XG4gICAgICAgICAgICBfdGhpcy5pbnRlcm5hbFNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuYXZvaWRTY3JvbGxpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgb25Nb3VzZURvd246IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uTW91c2VEb3duLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgcHJldmVudHMgdGhlIGFjdGl2ZUVsZW1lbnQgZnJvbSBiZWluZyBjaGFuZ2VkXG4gICAgICAgICAgICAvLyB0byB0aGUgaXRlbSBzbyBpdCBjYW4gcmVtYWluIHdpdGggdGhlIGN1cnJlbnQgYWN0aXZlRWxlbWVudFxuICAgICAgICAgICAgLy8gd2hpY2ggaXMgYSBtb3JlIGNvbW1vbiB1c2UgY2FzZS5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSwgX2VuYWJsZWRFdmVudEhhbmRsZXJzW29uU2VsZWN0S2V5XSA9IGNhbGxBbGxFdmVudEhhbmRsZXJzKGN1c3RvbUNsaWNrSGFuZGxlciwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIF90aGlzLnNlbGVjdEl0ZW1BdEluZGV4KGluZGV4LCB7XG4gICAgICAgICAgICB0eXBlOiBjbGlja0l0ZW1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSksIF9lbmFibGVkRXZlbnRIYW5kbGVycyk7XG5cbiAgICAgICAgLy8gUGFzc2luZyBkb3duIHRoZSBvbk1vdXNlRG93biBoYW5kbGVyIHRvIHByZXZlbnQgcmVkaXJlY3RcbiAgICAgICAgLy8gb2YgdGhlIGFjdGl2ZUVsZW1lbnQgaWYgY2xpY2tpbmcgb24gZGlzYWJsZWQgaXRlbXNcbiAgICAgICAgdmFyIGV2ZW50SGFuZGxlcnMgPSByZXN0LmRpc2FibGVkID8ge1xuICAgICAgICAgIG9uTW91c2VEb3duOiBlbmFibGVkRXZlbnRIYW5kbGVycy5vbk1vdXNlRG93blxuICAgICAgICB9IDogZW5hYmxlZEV2ZW50SGFuZGxlcnM7XG4gICAgICAgIHJldHVybiBfZXh0ZW5kcyh7XG4gICAgICAgICAgaWQ6IF90aGlzLmdldEl0ZW1JZChpbmRleCksXG4gICAgICAgICAgcm9sZTogJ29wdGlvbicsXG4gICAgICAgICAgJ2FyaWEtc2VsZWN0ZWQnOiBfdGhpcy5nZXRTdGF0ZSgpLmhpZ2hsaWdodGVkSW5kZXggPT09IGluZGV4XG4gICAgICAgIH0sIGV2ZW50SGFuZGxlcnMsIHJlc3QpO1xuICAgICAgfTtcbiAgICAgIC8vXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBJVEVNXG4gICAgICBfdGhpcy5jbGVhckl0ZW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpcy5pdGVtcyA9IFtdO1xuICAgICAgfTtcbiAgICAgIF90aGlzLnJlc2V0ID0gZnVuY3Rpb24gKG90aGVyU3RhdGVUb1NldCwgY2IpIHtcbiAgICAgICAgaWYgKG90aGVyU3RhdGVUb1NldCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgb3RoZXJTdGF0ZVRvU2V0ID0ge307XG4gICAgICAgIH1cbiAgICAgICAgb3RoZXJTdGF0ZVRvU2V0ID0gcGlja1N0YXRlKG90aGVyU3RhdGVUb1NldCk7XG4gICAgICAgIF90aGlzLmludGVybmFsU2V0U3RhdGUoZnVuY3Rpb24gKF9yZWY4KSB7XG4gICAgICAgICAgdmFyIHNlbGVjdGVkSXRlbSA9IF9yZWY4LnNlbGVjdGVkSXRlbTtcbiAgICAgICAgICByZXR1cm4gX2V4dGVuZHMoe1xuICAgICAgICAgICAgaXNPcGVuOiBfdGhpcy5wcm9wcy5kZWZhdWx0SXNPcGVuLFxuICAgICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogX3RoaXMucHJvcHMuZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXgsXG4gICAgICAgICAgICBpbnB1dFZhbHVlOiBfdGhpcy5wcm9wcy5pdGVtVG9TdHJpbmcoc2VsZWN0ZWRJdGVtKVxuICAgICAgICAgIH0sIG90aGVyU3RhdGVUb1NldCk7XG4gICAgICAgIH0sIGNiKTtcbiAgICAgIH07XG4gICAgICBfdGhpcy50b2dnbGVNZW51ID0gZnVuY3Rpb24gKG90aGVyU3RhdGVUb1NldCwgY2IpIHtcbiAgICAgICAgaWYgKG90aGVyU3RhdGVUb1NldCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgb3RoZXJTdGF0ZVRvU2V0ID0ge307XG4gICAgICAgIH1cbiAgICAgICAgb3RoZXJTdGF0ZVRvU2V0ID0gcGlja1N0YXRlKG90aGVyU3RhdGVUb1NldCk7XG4gICAgICAgIF90aGlzLmludGVybmFsU2V0U3RhdGUoZnVuY3Rpb24gKF9yZWY5KSB7XG4gICAgICAgICAgdmFyIGlzT3BlbiA9IF9yZWY5LmlzT3BlbjtcbiAgICAgICAgICByZXR1cm4gX2V4dGVuZHMoe1xuICAgICAgICAgICAgaXNPcGVuOiAhaXNPcGVuXG4gICAgICAgICAgfSwgaXNPcGVuICYmIHtcbiAgICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IF90aGlzLnByb3BzLmRlZmF1bHRIaWdobGlnaHRlZEluZGV4XG4gICAgICAgICAgfSwgb3RoZXJTdGF0ZVRvU2V0KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBfdGhpcyRnZXRTdGF0ZTcgPSBfdGhpcy5nZXRTdGF0ZSgpLFxuICAgICAgICAgICAgaXNPcGVuID0gX3RoaXMkZ2V0U3RhdGU3LmlzT3BlbixcbiAgICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXggPSBfdGhpcyRnZXRTdGF0ZTcuaGlnaGxpZ2h0ZWRJbmRleDtcbiAgICAgICAgICBpZiAoaXNPcGVuKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuZ2V0SXRlbUNvdW50KCkgPiAwICYmIHR5cGVvZiBoaWdobGlnaHRlZEluZGV4ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICBfdGhpcy5zZXRIaWdobGlnaHRlZEluZGV4KGhpZ2hsaWdodGVkSW5kZXgsIG90aGVyU3RhdGVUb1NldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNiVG9DYihjYikoKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgX3RoaXMub3Blbk1lbnUgPSBmdW5jdGlvbiAoY2IpIHtcbiAgICAgICAgX3RoaXMuaW50ZXJuYWxTZXRTdGF0ZSh7XG4gICAgICAgICAgaXNPcGVuOiB0cnVlXG4gICAgICAgIH0sIGNiKTtcbiAgICAgIH07XG4gICAgICBfdGhpcy5jbG9zZU1lbnUgPSBmdW5jdGlvbiAoY2IpIHtcbiAgICAgICAgX3RoaXMuaW50ZXJuYWxTZXRTdGF0ZSh7XG4gICAgICAgICAgaXNPcGVuOiBmYWxzZVxuICAgICAgICB9LCBjYik7XG4gICAgICB9O1xuICAgICAgX3RoaXMudXBkYXRlU3RhdHVzID0gZGVib3VuY2UoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc3RhdGUgPSBfdGhpcy5nZXRTdGF0ZSgpO1xuICAgICAgICB2YXIgaXRlbSA9IF90aGlzLml0ZW1zW3N0YXRlLmhpZ2hsaWdodGVkSW5kZXhdO1xuICAgICAgICB2YXIgcmVzdWx0Q291bnQgPSBfdGhpcy5nZXRJdGVtQ291bnQoKTtcbiAgICAgICAgdmFyIHN0YXR1cyA9IF90aGlzLnByb3BzLmdldEExMXlTdGF0dXNNZXNzYWdlKF9leHRlbmRzKHtcbiAgICAgICAgICBpdGVtVG9TdHJpbmc6IF90aGlzLnByb3BzLml0ZW1Ub1N0cmluZyxcbiAgICAgICAgICBwcmV2aW91c1Jlc3VsdENvdW50OiBfdGhpcy5wcmV2aW91c1Jlc3VsdENvdW50LFxuICAgICAgICAgIHJlc3VsdENvdW50OiByZXN1bHRDb3VudCxcbiAgICAgICAgICBoaWdobGlnaHRlZEl0ZW06IGl0ZW1cbiAgICAgICAgfSwgc3RhdGUpKTtcbiAgICAgICAgX3RoaXMucHJldmlvdXNSZXN1bHRDb3VudCA9IHJlc3VsdENvdW50O1xuICAgICAgICBzZXRTdGF0dXMoc3RhdHVzLCBfdGhpcy5wcm9wcy5lbnZpcm9ubWVudC5kb2N1bWVudCk7XG4gICAgICB9LCAyMDApO1xuICAgICAgdmFyIF90aGlzJHByb3BzID0gX3RoaXMucHJvcHMsXG4gICAgICAgIGRlZmF1bHRIaWdobGlnaHRlZEluZGV4ID0gX3RoaXMkcHJvcHMuZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXgsXG4gICAgICAgIF90aGlzJHByb3BzJGluaXRpYWxIaSA9IF90aGlzJHByb3BzLmluaXRpYWxIaWdobGlnaHRlZEluZGV4LFxuICAgICAgICBfaGlnaGxpZ2h0ZWRJbmRleCA9IF90aGlzJHByb3BzJGluaXRpYWxIaSA9PT0gdm9pZCAwID8gZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXggOiBfdGhpcyRwcm9wcyRpbml0aWFsSGksXG4gICAgICAgIGRlZmF1bHRJc09wZW4gPSBfdGhpcyRwcm9wcy5kZWZhdWx0SXNPcGVuLFxuICAgICAgICBfdGhpcyRwcm9wcyRpbml0aWFsSXMgPSBfdGhpcyRwcm9wcy5pbml0aWFsSXNPcGVuLFxuICAgICAgICBfaXNPcGVuID0gX3RoaXMkcHJvcHMkaW5pdGlhbElzID09PSB2b2lkIDAgPyBkZWZhdWx0SXNPcGVuIDogX3RoaXMkcHJvcHMkaW5pdGlhbElzLFxuICAgICAgICBfdGhpcyRwcm9wcyRpbml0aWFsSW4gPSBfdGhpcyRwcm9wcy5pbml0aWFsSW5wdXRWYWx1ZSxcbiAgICAgICAgX2lucHV0VmFsdWUgPSBfdGhpcyRwcm9wcyRpbml0aWFsSW4gPT09IHZvaWQgMCA/ICcnIDogX3RoaXMkcHJvcHMkaW5pdGlhbEluLFxuICAgICAgICBfdGhpcyRwcm9wcyRpbml0aWFsU2UgPSBfdGhpcyRwcm9wcy5pbml0aWFsU2VsZWN0ZWRJdGVtLFxuICAgICAgICBfc2VsZWN0ZWRJdGVtID0gX3RoaXMkcHJvcHMkaW5pdGlhbFNlID09PSB2b2lkIDAgPyBudWxsIDogX3RoaXMkcHJvcHMkaW5pdGlhbFNlO1xuICAgICAgdmFyIF9zdGF0ZSA9IF90aGlzLmdldFN0YXRlKHtcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogX2hpZ2hsaWdodGVkSW5kZXgsXG4gICAgICAgIGlzT3BlbjogX2lzT3BlbixcbiAgICAgICAgaW5wdXRWYWx1ZTogX2lucHV0VmFsdWUsXG4gICAgICAgIHNlbGVjdGVkSXRlbTogX3NlbGVjdGVkSXRlbVxuICAgICAgfSk7XG4gICAgICBpZiAoX3N0YXRlLnNlbGVjdGVkSXRlbSAhPSBudWxsICYmIF90aGlzLnByb3BzLmluaXRpYWxJbnB1dFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgX3N0YXRlLmlucHV0VmFsdWUgPSBfdGhpcy5wcm9wcy5pdGVtVG9TdHJpbmcoX3N0YXRlLnNlbGVjdGVkSXRlbSk7XG4gICAgICB9XG4gICAgICBfdGhpcy5zdGF0ZSA9IF9zdGF0ZTtcbiAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgdmFyIF9wcm90byA9IERvd25zaGlmdC5wcm90b3R5cGU7XG4gICAgLyoqXG4gICAgICogQ2xlYXIgYWxsIHJ1bm5pbmcgdGltZW91dHNcbiAgICAgKi9cbiAgICBfcHJvdG8uaW50ZXJuYWxDbGVhclRpbWVvdXRzID0gZnVuY3Rpb24gaW50ZXJuYWxDbGVhclRpbWVvdXRzKCkge1xuICAgICAgdGhpcy50aW1lb3V0SWRzLmZvckVhY2goZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChpZCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMudGltZW91dElkcyA9IFtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHN0YXRlIGJhc2VkIG9uIGludGVybmFsIHN0YXRlIG9yIHByb3BzXG4gICAgICogSWYgYSBzdGF0ZSB2YWx1ZSBpcyBwYXNzZWQgdmlhIHByb3BzLCB0aGVuIHRoYXRcbiAgICAgKiBpcyB0aGUgdmFsdWUgZ2l2ZW4sIG90aGVyd2lzZSBpdCdzIHJldHJpZXZlZCBmcm9tXG4gICAgICogc3RhdGVUb01lcmdlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3RhdGVUb01lcmdlIGRlZmF1bHRzIHRvIHRoaXMuc3RhdGVcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBzdGF0ZVxuICAgICAqLztcbiAgICBfcHJvdG8uZ2V0U3RhdGUgPSBmdW5jdGlvbiBnZXRTdGF0ZSQxKHN0YXRlVG9NZXJnZSkge1xuICAgICAgaWYgKHN0YXRlVG9NZXJnZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgIHN0YXRlVG9NZXJnZSA9IHRoaXMuc3RhdGU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZ2V0U3RhdGUoc3RhdGVUb01lcmdlLCB0aGlzLnByb3BzKTtcbiAgICB9O1xuICAgIF9wcm90by5nZXRJdGVtQ291bnQgPSBmdW5jdGlvbiBnZXRJdGVtQ291bnQoKSB7XG4gICAgICAvLyB0aGluZ3MgcmVhZCBiZXR0ZXIgdGhpcyB3YXkuIFRoZXkncmUgaW4gcHJpb3JpdHkgb3JkZXI6XG4gICAgICAvLyAxLiBgdGhpcy5pdGVtQ291bnRgXG4gICAgICAvLyAyLiBgdGhpcy5wcm9wcy5pdGVtQ291bnRgXG4gICAgICAvLyAzLiBgdGhpcy5pdGVtcy5sZW5ndGhgXG4gICAgICB2YXIgaXRlbUNvdW50ID0gdGhpcy5pdGVtcy5sZW5ndGg7XG4gICAgICBpZiAodGhpcy5pdGVtQ291bnQgIT0gbnVsbCkge1xuICAgICAgICBpdGVtQ291bnQgPSB0aGlzLml0ZW1Db3VudDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5pdGVtQ291bnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpdGVtQ291bnQgPSB0aGlzLnByb3BzLml0ZW1Db3VudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVtQ291bnQ7XG4gICAgfTtcbiAgICBfcHJvdG8uZ2V0SXRlbU5vZGVGcm9tSW5kZXggPSBmdW5jdGlvbiBnZXRJdGVtTm9kZUZyb21JbmRleChpbmRleCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZW52aXJvbm1lbnQuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5nZXRJdGVtSWQoaW5kZXgpKTtcbiAgICB9O1xuICAgIF9wcm90by5zY3JvbGxIaWdobGlnaHRlZEl0ZW1JbnRvVmlldyA9IGZ1bmN0aW9uIHNjcm9sbEhpZ2hsaWdodGVkSXRlbUludG9WaWV3KCkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKHJlYWN0LW5hdGl2ZSkgKi9cbiAgICAgIHtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmdldEl0ZW1Ob2RlRnJvbUluZGV4KHRoaXMuZ2V0U3RhdGUoKS5oaWdobGlnaHRlZEluZGV4KTtcbiAgICAgICAgdGhpcy5wcm9wcy5zY3JvbGxJbnRvVmlldyhub2RlLCB0aGlzLl9tZW51Tm9kZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBfcHJvdG8ubW92ZUhpZ2hsaWdodGVkSW5kZXggPSBmdW5jdGlvbiBtb3ZlSGlnaGxpZ2h0ZWRJbmRleChhbW91bnQsIG90aGVyU3RhdGVUb1NldCkge1xuICAgICAgdmFyIF90aGlzNiA9IHRoaXM7XG4gICAgICB2YXIgaXRlbUNvdW50ID0gdGhpcy5nZXRJdGVtQ291bnQoKTtcbiAgICAgIHZhciBfdGhpcyRnZXRTdGF0ZTggPSB0aGlzLmdldFN0YXRlKCksXG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXggPSBfdGhpcyRnZXRTdGF0ZTguaGlnaGxpZ2h0ZWRJbmRleDtcbiAgICAgIGlmIChpdGVtQ291bnQgPiAwKSB7XG4gICAgICAgIHZhciBuZXh0SGlnaGxpZ2h0ZWRJbmRleCA9IGdldE5leHRXcmFwcGluZ0luZGV4KGFtb3VudCwgaGlnaGxpZ2h0ZWRJbmRleCwgaXRlbUNvdW50LCBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXM2LmdldEl0ZW1Ob2RlRnJvbUluZGV4KGluZGV4KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2V0SGlnaGxpZ2h0ZWRJbmRleChuZXh0SGlnaGxpZ2h0ZWRJbmRleCwgb3RoZXJTdGF0ZVRvU2V0KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIF9wcm90by5nZXRTdGF0ZUFuZEhlbHBlcnMgPSBmdW5jdGlvbiBnZXRTdGF0ZUFuZEhlbHBlcnMoKSB7XG4gICAgICB2YXIgX3RoaXMkZ2V0U3RhdGU5ID0gdGhpcy5nZXRTdGF0ZSgpLFxuICAgICAgICBoaWdobGlnaHRlZEluZGV4ID0gX3RoaXMkZ2V0U3RhdGU5LmhpZ2hsaWdodGVkSW5kZXgsXG4gICAgICAgIGlucHV0VmFsdWUgPSBfdGhpcyRnZXRTdGF0ZTkuaW5wdXRWYWx1ZSxcbiAgICAgICAgc2VsZWN0ZWRJdGVtID0gX3RoaXMkZ2V0U3RhdGU5LnNlbGVjdGVkSXRlbSxcbiAgICAgICAgaXNPcGVuID0gX3RoaXMkZ2V0U3RhdGU5LmlzT3BlbjtcbiAgICAgIHZhciBpdGVtVG9TdHJpbmcgPSB0aGlzLnByb3BzLml0ZW1Ub1N0cmluZztcbiAgICAgIHZhciBpZCA9IHRoaXMuaWQ7XG4gICAgICB2YXIgZ2V0Um9vdFByb3BzID0gdGhpcy5nZXRSb290UHJvcHMsXG4gICAgICAgIGdldFRvZ2dsZUJ1dHRvblByb3BzID0gdGhpcy5nZXRUb2dnbGVCdXR0b25Qcm9wcyxcbiAgICAgICAgZ2V0TGFiZWxQcm9wcyA9IHRoaXMuZ2V0TGFiZWxQcm9wcyxcbiAgICAgICAgZ2V0TWVudVByb3BzID0gdGhpcy5nZXRNZW51UHJvcHMsXG4gICAgICAgIGdldElucHV0UHJvcHMgPSB0aGlzLmdldElucHV0UHJvcHMsXG4gICAgICAgIGdldEl0ZW1Qcm9wcyA9IHRoaXMuZ2V0SXRlbVByb3BzLFxuICAgICAgICBvcGVuTWVudSA9IHRoaXMub3Blbk1lbnUsXG4gICAgICAgIGNsb3NlTWVudSA9IHRoaXMuY2xvc2VNZW51LFxuICAgICAgICB0b2dnbGVNZW51ID0gdGhpcy50b2dnbGVNZW51LFxuICAgICAgICBzZWxlY3RJdGVtID0gdGhpcy5zZWxlY3RJdGVtLFxuICAgICAgICBzZWxlY3RJdGVtQXRJbmRleCA9IHRoaXMuc2VsZWN0SXRlbUF0SW5kZXgsXG4gICAgICAgIHNlbGVjdEhpZ2hsaWdodGVkSXRlbSA9IHRoaXMuc2VsZWN0SGlnaGxpZ2h0ZWRJdGVtLFxuICAgICAgICBzZXRIaWdobGlnaHRlZEluZGV4ID0gdGhpcy5zZXRIaWdobGlnaHRlZEluZGV4LFxuICAgICAgICBjbGVhclNlbGVjdGlvbiA9IHRoaXMuY2xlYXJTZWxlY3Rpb24sXG4gICAgICAgIGNsZWFySXRlbXMgPSB0aGlzLmNsZWFySXRlbXMsXG4gICAgICAgIHJlc2V0ID0gdGhpcy5yZXNldCxcbiAgICAgICAgc2V0SXRlbUNvdW50ID0gdGhpcy5zZXRJdGVtQ291bnQsXG4gICAgICAgIHVuc2V0SXRlbUNvdW50ID0gdGhpcy51bnNldEl0ZW1Db3VudCxcbiAgICAgICAgc2V0U3RhdGUgPSB0aGlzLmludGVybmFsU2V0U3RhdGU7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAvLyBwcm9wIGdldHRlcnNcbiAgICAgICAgZ2V0Um9vdFByb3BzOiBnZXRSb290UHJvcHMsXG4gICAgICAgIGdldFRvZ2dsZUJ1dHRvblByb3BzOiBnZXRUb2dnbGVCdXR0b25Qcm9wcyxcbiAgICAgICAgZ2V0TGFiZWxQcm9wczogZ2V0TGFiZWxQcm9wcyxcbiAgICAgICAgZ2V0TWVudVByb3BzOiBnZXRNZW51UHJvcHMsXG4gICAgICAgIGdldElucHV0UHJvcHM6IGdldElucHV0UHJvcHMsXG4gICAgICAgIGdldEl0ZW1Qcm9wczogZ2V0SXRlbVByb3BzLFxuICAgICAgICAvLyBhY3Rpb25zXG4gICAgICAgIHJlc2V0OiByZXNldCxcbiAgICAgICAgb3Blbk1lbnU6IG9wZW5NZW51LFxuICAgICAgICBjbG9zZU1lbnU6IGNsb3NlTWVudSxcbiAgICAgICAgdG9nZ2xlTWVudTogdG9nZ2xlTWVudSxcbiAgICAgICAgc2VsZWN0SXRlbTogc2VsZWN0SXRlbSxcbiAgICAgICAgc2VsZWN0SXRlbUF0SW5kZXg6IHNlbGVjdEl0ZW1BdEluZGV4LFxuICAgICAgICBzZWxlY3RIaWdobGlnaHRlZEl0ZW06IHNlbGVjdEhpZ2hsaWdodGVkSXRlbSxcbiAgICAgICAgc2V0SGlnaGxpZ2h0ZWRJbmRleDogc2V0SGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgICAgY2xlYXJTZWxlY3Rpb246IGNsZWFyU2VsZWN0aW9uLFxuICAgICAgICBjbGVhckl0ZW1zOiBjbGVhckl0ZW1zLFxuICAgICAgICBzZXRJdGVtQ291bnQ6IHNldEl0ZW1Db3VudCxcbiAgICAgICAgdW5zZXRJdGVtQ291bnQ6IHVuc2V0SXRlbUNvdW50LFxuICAgICAgICBzZXRTdGF0ZTogc2V0U3RhdGUsXG4gICAgICAgIC8vIHByb3BzXG4gICAgICAgIGl0ZW1Ub1N0cmluZzogaXRlbVRvU3RyaW5nLFxuICAgICAgICAvLyBkZXJpdmVkXG4gICAgICAgIGlkOiBpZCxcbiAgICAgICAgLy8gc3RhdGVcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogaGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgICAgaW5wdXRWYWx1ZTogaW5wdXRWYWx1ZSxcbiAgICAgICAgaXNPcGVuOiBpc09wZW4sXG4gICAgICAgIHNlbGVjdGVkSXRlbTogc2VsZWN0ZWRJdGVtXG4gICAgICB9O1xuICAgIH07XG4gICAgX3Byb3RvLmNvbXBvbmVudERpZE1vdW50ID0gZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICB2YXIgX3RoaXM3ID0gdGhpcztcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAocmVhY3QtbmF0aXZlKSAqL1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgIWZhbHNlICYmIHRoaXMuZ2V0TWVudVByb3BzLmNhbGxlZCAmJiAhdGhpcy5nZXRNZW51UHJvcHMuc3VwcHJlc3NSZWZFcnJvcikge1xuICAgICAgICB2YWxpZGF0ZUdldE1lbnVQcm9wc0NhbGxlZENvcnJlY3RseSh0aGlzLl9tZW51Tm9kZSwgdGhpcy5nZXRNZW51UHJvcHMpO1xuICAgICAgfVxuXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKHJlYWN0LW5hdGl2ZSkgKi9cbiAgICAgIHtcbiAgICAgICAgLy8gdGhpcy5pc01vdXNlRG93biBoZWxwcyB1cyB0cmFjayB3aGV0aGVyIHRoZSBtb3VzZSBpcyBjdXJyZW50bHkgaGVsZCBkb3duLlxuICAgICAgICAvLyBUaGlzIGlzIHVzZWZ1bCB3aGVuIHRoZSB1c2VyIGNsaWNrcyBvbiBhbiBpdGVtIGluIHRoZSBsaXN0LCBidXQgaG9sZHMgdGhlIG1vdXNlXG4gICAgICAgIC8vIGRvd24gbG9uZyBlbm91Z2ggZm9yIHRoZSBsaXN0IHRvIGRpc2FwcGVhciAoYmVjYXVzZSB0aGUgYmx1ciBldmVudCBmaXJlcyBvbiB0aGUgaW5wdXQpXG4gICAgICAgIC8vIHRoaXMuaXNNb3VzZURvd24gaXMgdXNlZCBpbiB0aGUgYmx1ciBoYW5kbGVyIG9uIHRoZSBpbnB1dCB0byBkZXRlcm1pbmUgd2hldGhlciB0aGUgYmx1ciBldmVudCBzaG91bGRcbiAgICAgICAgLy8gdHJpZ2dlciBoaWRpbmcgdGhlIG1lbnUuXG4gICAgICAgIHZhciBvbk1vdXNlRG93biA9IGZ1bmN0aW9uIG9uTW91c2VEb3duKCkge1xuICAgICAgICAgIF90aGlzNy5pc01vdXNlRG93biA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBvbk1vdXNlVXAgPSBmdW5jdGlvbiBvbk1vdXNlVXAoZXZlbnQpIHtcbiAgICAgICAgICBfdGhpczcuaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgICAgICAgICAvLyBpZiB0aGUgdGFyZ2V0IGVsZW1lbnQgb3IgdGhlIGFjdGl2ZUVsZW1lbnQgaXMgd2l0aGluIGEgZG93bnNoaWZ0IG5vZGVcbiAgICAgICAgICAvLyB0aGVuIHdlIGRvbid0IHdhbnQgdG8gcmVzZXQgZG93bnNoaWZ0XG4gICAgICAgICAgdmFyIGNvbnRleHRXaXRoaW5Eb3duc2hpZnQgPSB0YXJnZXRXaXRoaW5Eb3duc2hpZnQoZXZlbnQudGFyZ2V0LCBbX3RoaXM3Ll9yb290Tm9kZSwgX3RoaXM3Ll9tZW51Tm9kZV0sIF90aGlzNy5wcm9wcy5lbnZpcm9ubWVudCk7XG4gICAgICAgICAgaWYgKCFjb250ZXh0V2l0aGluRG93bnNoaWZ0ICYmIF90aGlzNy5nZXRTdGF0ZSgpLmlzT3Blbikge1xuICAgICAgICAgICAgX3RoaXM3LnJlc2V0KHtcbiAgICAgICAgICAgICAgdHlwZTogbW91c2VVcFxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICByZXR1cm4gX3RoaXM3LnByb3BzLm9uT3V0ZXJDbGljayhfdGhpczcuZ2V0U3RhdGVBbmRIZWxwZXJzKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvLyBUb3VjaGluZyBhbiBlbGVtZW50IGluIGlPUyBnaXZlcyBmb2N1cyBhbmQgaG92ZXIgc3RhdGVzLCBidXQgdG91Y2hpbmcgb3V0IG9mXG4gICAgICAgIC8vIHRoZSBlbGVtZW50IHdpbGwgcmVtb3ZlIGhvdmVyLCBhbmQgcGVyc2lzdCB0aGUgZm9jdXMgc3RhdGUsIHJlc3VsdGluZyBpbiB0aGVcbiAgICAgICAgLy8gYmx1ciBldmVudCBub3QgYmVpbmcgdHJpZ2dlcmVkLlxuICAgICAgICAvLyB0aGlzLmlzVG91Y2hNb3ZlIGhlbHBzIHVzIHRyYWNrIHdoZXRoZXIgdGhlIHVzZXIgaXMgdGFwcGluZyBvciBzd2lwaW5nIG9uIGEgdG91Y2ggc2NyZWVuLlxuICAgICAgICAvLyBJZiB0aGUgdXNlciB0YXBzIG91dHNpZGUgb2YgRG93bnNoaWZ0LCB0aGUgY29tcG9uZW50IHNob3VsZCBiZSByZXNldCxcbiAgICAgICAgLy8gYnV0IG5vdCBpZiB0aGUgdXNlciBpcyBzd2lwaW5nXG4gICAgICAgIHZhciBvblRvdWNoU3RhcnQgPSBmdW5jdGlvbiBvblRvdWNoU3RhcnQoKSB7XG4gICAgICAgICAgX3RoaXM3LmlzVG91Y2hNb3ZlID0gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBvblRvdWNoTW92ZSA9IGZ1bmN0aW9uIG9uVG91Y2hNb3ZlKCkge1xuICAgICAgICAgIF90aGlzNy5pc1RvdWNoTW92ZSA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBvblRvdWNoRW5kID0gZnVuY3Rpb24gb25Ub3VjaEVuZChldmVudCkge1xuICAgICAgICAgIHZhciBjb250ZXh0V2l0aGluRG93bnNoaWZ0ID0gdGFyZ2V0V2l0aGluRG93bnNoaWZ0KGV2ZW50LnRhcmdldCwgW190aGlzNy5fcm9vdE5vZGUsIF90aGlzNy5fbWVudU5vZGVdLCBfdGhpczcucHJvcHMuZW52aXJvbm1lbnQsIGZhbHNlKTtcbiAgICAgICAgICBpZiAoIV90aGlzNy5pc1RvdWNoTW92ZSAmJiAhY29udGV4dFdpdGhpbkRvd25zaGlmdCAmJiBfdGhpczcuZ2V0U3RhdGUoKS5pc09wZW4pIHtcbiAgICAgICAgICAgIF90aGlzNy5yZXNldCh7XG4gICAgICAgICAgICAgIHR5cGU6IHRvdWNoRW5kXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBfdGhpczcucHJvcHMub25PdXRlckNsaWNrKF90aGlzNy5nZXRTdGF0ZUFuZEhlbHBlcnMoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHZhciBlbnZpcm9ubWVudCA9IHRoaXMucHJvcHMuZW52aXJvbm1lbnQ7XG4gICAgICAgIGVudmlyb25tZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duKTtcbiAgICAgICAgZW52aXJvbm1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XG4gICAgICAgIGVudmlyb25tZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBvblRvdWNoU3RhcnQpO1xuICAgICAgICBlbnZpcm9ubWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvblRvdWNoTW92ZSk7XG4gICAgICAgIGVudmlyb25tZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCk7XG4gICAgICAgIHRoaXMuY2xlYW51cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBfdGhpczcuaW50ZXJuYWxDbGVhclRpbWVvdXRzKCk7XG4gICAgICAgICAgX3RoaXM3LnVwZGF0ZVN0YXR1cy5jYW5jZWwoKTtcbiAgICAgICAgICBlbnZpcm9ubWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk1vdXNlRG93bik7XG4gICAgICAgICAgZW52aXJvbm1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XG4gICAgICAgICAgZW52aXJvbm1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uVG91Y2hTdGFydCk7XG4gICAgICAgICAgZW52aXJvbm1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgb25Ub3VjaE1vdmUpO1xuICAgICAgICAgIGVudmlyb25tZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgICBfcHJvdG8uc2hvdWxkU2Nyb2xsID0gZnVuY3Rpb24gc2hvdWxkU2Nyb2xsKHByZXZTdGF0ZSwgcHJldlByb3BzKSB7XG4gICAgICB2YXIgX3JlZjEwID0gdGhpcy5wcm9wcy5oaWdobGlnaHRlZEluZGV4ID09PSB1bmRlZmluZWQgPyB0aGlzLmdldFN0YXRlKCkgOiB0aGlzLnByb3BzLFxuICAgICAgICBjdXJyZW50SGlnaGxpZ2h0ZWRJbmRleCA9IF9yZWYxMC5oaWdobGlnaHRlZEluZGV4O1xuICAgICAgdmFyIF9yZWYxMSA9IHByZXZQcm9wcy5oaWdobGlnaHRlZEluZGV4ID09PSB1bmRlZmluZWQgPyBwcmV2U3RhdGUgOiBwcmV2UHJvcHMsXG4gICAgICAgIHByZXZIaWdobGlnaHRlZEluZGV4ID0gX3JlZjExLmhpZ2hsaWdodGVkSW5kZXg7XG4gICAgICB2YXIgc2Nyb2xsV2hlbk9wZW4gPSBjdXJyZW50SGlnaGxpZ2h0ZWRJbmRleCAmJiB0aGlzLmdldFN0YXRlKCkuaXNPcGVuICYmICFwcmV2U3RhdGUuaXNPcGVuO1xuICAgICAgdmFyIHNjcm9sbFdoZW5OYXZpZ2F0aW5nID0gY3VycmVudEhpZ2hsaWdodGVkSW5kZXggIT09IHByZXZIaWdobGlnaHRlZEluZGV4O1xuICAgICAgcmV0dXJuIHNjcm9sbFdoZW5PcGVuIHx8IHNjcm9sbFdoZW5OYXZpZ2F0aW5nO1xuICAgIH07XG4gICAgX3Byb3RvLmNvbXBvbmVudERpZFVwZGF0ZSA9IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgdmFsaWRhdGVDb250cm9sbGVkVW5jaGFuZ2VkKHRoaXMuc3RhdGUsIHByZXZQcm9wcywgdGhpcy5wcm9wcyk7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAocmVhY3QtbmF0aXZlKSAqL1xuICAgICAgICBpZiAodGhpcy5nZXRNZW51UHJvcHMuY2FsbGVkICYmICF0aGlzLmdldE1lbnVQcm9wcy5zdXBwcmVzc1JlZkVycm9yKSB7XG4gICAgICAgICAgdmFsaWRhdGVHZXRNZW51UHJvcHNDYWxsZWRDb3JyZWN0bHkodGhpcy5fbWVudU5vZGUsIHRoaXMuZ2V0TWVudVByb3BzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGlzQ29udHJvbGxlZFByb3AodGhpcy5wcm9wcywgJ3NlbGVjdGVkSXRlbScpICYmIHRoaXMucHJvcHMuc2VsZWN0ZWRJdGVtQ2hhbmdlZChwcmV2UHJvcHMuc2VsZWN0ZWRJdGVtLCB0aGlzLnByb3BzLnNlbGVjdGVkSXRlbSkpIHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbFNldFN0YXRlKHtcbiAgICAgICAgICB0eXBlOiBjb250cm9sbGVkUHJvcFVwZGF0ZWRTZWxlY3RlZEl0ZW0sXG4gICAgICAgICAgaW5wdXRWYWx1ZTogdGhpcy5wcm9wcy5pdGVtVG9TdHJpbmcodGhpcy5wcm9wcy5zZWxlY3RlZEl0ZW0pXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmF2b2lkU2Nyb2xsaW5nICYmIHRoaXMuc2hvdWxkU2Nyb2xsKHByZXZTdGF0ZSwgcHJldlByb3BzKSkge1xuICAgICAgICB0aGlzLnNjcm9sbEhpZ2hsaWdodGVkSXRlbUludG9WaWV3KCk7XG4gICAgICB9XG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlIChyZWFjdC1uYXRpdmUpICovXG4gICAgICB7XG4gICAgICAgIHRoaXMudXBkYXRlU3RhdHVzKCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBfcHJvdG8uY29tcG9uZW50V2lsbFVubW91bnQgPSBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgIHRoaXMuY2xlYW51cCgpOyAvLyBhdm9pZHMgbWVtb3J5IGxlYWtcbiAgICB9O1xuICAgIF9wcm90by5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICB2YXIgY2hpbGRyZW4gPSB1bndyYXBBcnJheSh0aGlzLnByb3BzLmNoaWxkcmVuLCBub29wKTtcbiAgICAgIC8vIGJlY2F1c2UgdGhlIGl0ZW1zIGFyZSByZXJlbmRlcmVkIGV2ZXJ5IHRpbWUgd2UgY2FsbCB0aGUgY2hpbGRyZW5cbiAgICAgIC8vIHdlIGNsZWFyIHRoaXMgb3V0IGVhY2ggcmVuZGVyIGFuZCBpdCB3aWxsIGJlIHBvcHVsYXRlZCBhZ2FpbiBhc1xuICAgICAgLy8gZ2V0SXRlbVByb3BzIGlzIGNhbGxlZC5cbiAgICAgIHRoaXMuY2xlYXJJdGVtcygpO1xuICAgICAgLy8gd2UgcmVzZXQgdGhpcyBzbyB3ZSBrbm93IHdoZXRoZXIgdGhlIHVzZXIgY2FsbHMgZ2V0Um9vdFByb3BzIGR1cmluZ1xuICAgICAgLy8gdGhpcyByZW5kZXIuIElmIHRoZXkgZG8gdGhlbiB3ZSBkb24ndCBuZWVkIHRvIGRvIGFueXRoaW5nLFxuICAgICAgLy8gaWYgdGhleSBkb24ndCB0aGVuIHdlIG5lZWQgdG8gY2xvbmUgdGhlIGVsZW1lbnQgdGhleSByZXR1cm4gYW5kXG4gICAgICAvLyBhcHBseSB0aGUgcHJvcHMgZm9yIHRoZW0uXG4gICAgICB0aGlzLmdldFJvb3RQcm9wcy5jYWxsZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuZ2V0Um9vdFByb3BzLnJlZktleSA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZ2V0Um9vdFByb3BzLnN1cHByZXNzUmVmRXJyb3IgPSB1bmRlZmluZWQ7XG4gICAgICAvLyB3ZSBkbyBzb21ldGhpbmcgc2ltaWxhciBmb3IgZ2V0TWVudVByb3BzXG4gICAgICB0aGlzLmdldE1lbnVQcm9wcy5jYWxsZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuZ2V0TWVudVByb3BzLnJlZktleSA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZ2V0TWVudVByb3BzLnN1cHByZXNzUmVmRXJyb3IgPSB1bmRlZmluZWQ7XG4gICAgICAvLyB3ZSBkbyBzb21ldGhpbmcgc2ltaWxhciBmb3IgZ2V0TGFiZWxQcm9wc1xuICAgICAgdGhpcy5nZXRMYWJlbFByb3BzLmNhbGxlZCA9IGZhbHNlO1xuICAgICAgLy8gYW5kIHNvbWV0aGluZyBzaW1pbGFyIGZvciBnZXRJbnB1dFByb3BzXG4gICAgICB0aGlzLmdldElucHV0UHJvcHMuY2FsbGVkID0gZmFsc2U7XG4gICAgICB2YXIgZWxlbWVudCA9IHVud3JhcEFycmF5KGNoaWxkcmVuKHRoaXMuZ2V0U3RhdGVBbmRIZWxwZXJzKCkpKTtcbiAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmdldFJvb3RQcm9wcy5jYWxsZWQgfHwgdGhpcy5wcm9wcy5zdXBwcmVzc1JlZkVycm9yKSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmICF0aGlzLmdldFJvb3RQcm9wcy5zdXBwcmVzc1JlZkVycm9yICYmICF0aGlzLnByb3BzLnN1cHByZXNzUmVmRXJyb3IpIHtcbiAgICAgICAgICB2YWxpZGF0ZUdldFJvb3RQcm9wc0NhbGxlZENvcnJlY3RseShlbGVtZW50LCB0aGlzLmdldFJvb3RQcm9wcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9IGVsc2UgaWYgKGlzRE9NRWxlbWVudChlbGVtZW50KSkge1xuICAgICAgICAvLyB0aGV5IGRpZG4ndCBhcHBseSB0aGUgcm9vdCBwcm9wcywgYnV0IHdlIGNhbiBjbG9uZVxuICAgICAgICAvLyB0aGlzIGFuZCBhcHBseSB0aGUgcHJvcHMgb3Vyc2VsdmVzXG4gICAgICAgIHJldHVybiAvKiNfX1BVUkVfXyovY2xvbmVFbGVtZW50KGVsZW1lbnQsIHRoaXMuZ2V0Um9vdFByb3BzKGdldEVsZW1lbnRQcm9wcyhlbGVtZW50KSkpO1xuICAgICAgfVxuXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgLy8gdGhleSBkaWRuJ3QgYXBwbHkgdGhlIHJvb3QgcHJvcHMsIGJ1dCB0aGV5IG5lZWQgdG9cbiAgICAgICAgLy8gb3RoZXJ3aXNlIHdlIGNhbid0IHF1ZXJ5IGFyb3VuZCB0aGUgYXV0b2NvbXBsZXRlXG5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdkb3duc2hpZnQ6IElmIHlvdSByZXR1cm4gYSBub24tRE9NIGVsZW1lbnQsIHlvdSBtdXN0IGFwcGx5IHRoZSBnZXRSb290UHJvcHMgZnVuY3Rpb24nKTtcbiAgICAgIH1cblxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfTtcbiAgICByZXR1cm4gRG93bnNoaWZ0O1xuICB9KENvbXBvbmVudCk7XG4gIERvd25zaGlmdC5kZWZhdWx0UHJvcHMgPSB7XG4gICAgZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXg6IG51bGwsXG4gICAgZGVmYXVsdElzT3BlbjogZmFsc2UsXG4gICAgZ2V0QTExeVN0YXR1c01lc3NhZ2U6IGdldEExMXlTdGF0dXNNZXNzYWdlJDEsXG4gICAgaXRlbVRvU3RyaW5nOiBmdW5jdGlvbiBpdGVtVG9TdHJpbmcoaSkge1xuICAgICAgaWYgKGkgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBpc1BsYWluT2JqZWN0KGkpICYmICFpLmhhc093blByb3BlcnR5KCd0b1N0cmluZycpKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgIGNvbnNvbGUud2FybignZG93bnNoaWZ0OiBBbiBvYmplY3Qgd2FzIHBhc3NlZCB0byB0aGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiBgaXRlbVRvU3RyaW5nYC4gWW91IHNob3VsZCBwcm9iYWJseSBwcm92aWRlIHlvdXIgb3duIGBpdGVtVG9TdHJpbmdgIGltcGxlbWVudGF0aW9uLiBQbGVhc2UgcmVmZXIgdG8gdGhlIGBpdGVtVG9TdHJpbmdgIEFQSSBkb2N1bWVudGF0aW9uLicsICdUaGUgb2JqZWN0IHRoYXQgd2FzIHBhc3NlZDonLCBpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBTdHJpbmcoaSk7XG4gICAgfSxcbiAgICBvblN0YXRlQ2hhbmdlOiBub29wLFxuICAgIG9uSW5wdXRWYWx1ZUNoYW5nZTogbm9vcCxcbiAgICBvblVzZXJBY3Rpb246IG5vb3AsXG4gICAgb25DaGFuZ2U6IG5vb3AsXG4gICAgb25TZWxlY3Q6IG5vb3AsXG4gICAgb25PdXRlckNsaWNrOiBub29wLFxuICAgIHNlbGVjdGVkSXRlbUNoYW5nZWQ6IGZ1bmN0aW9uIHNlbGVjdGVkSXRlbUNoYW5nZWQocHJldkl0ZW0sIGl0ZW0pIHtcbiAgICAgIHJldHVybiBwcmV2SXRlbSAhPT0gaXRlbTtcbiAgICB9LFxuICAgIGVudmlyb25tZW50OiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAoc3NyKSAqL1xuICAgIHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8ge30gOiB3aW5kb3csXG4gICAgc3RhdGVSZWR1Y2VyOiBmdW5jdGlvbiBzdGF0ZVJlZHVjZXIoc3RhdGUsIHN0YXRlVG9TZXQpIHtcbiAgICAgIHJldHVybiBzdGF0ZVRvU2V0O1xuICAgIH0sXG4gICAgc3VwcHJlc3NSZWZFcnJvcjogZmFsc2UsXG4gICAgc2Nyb2xsSW50b1ZpZXc6IHNjcm9sbEludG9WaWV3XG4gIH07XG4gIERvd25zaGlmdC5zdGF0ZUNoYW5nZVR5cGVzID0gc3RhdGVDaGFuZ2VUeXBlcyQzO1xuICByZXR1cm4gRG93bnNoaWZ0O1xufSgpO1xucHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gRG93bnNoaWZ0LnByb3BUeXBlcyA9IHtcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5mdW5jLFxuICBkZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgZGVmYXVsdElzT3BlbjogUHJvcFR5cGVzLmJvb2wsXG4gIGluaXRpYWxIaWdobGlnaHRlZEluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICBpbml0aWFsU2VsZWN0ZWRJdGVtOiBQcm9wVHlwZXMuYW55LFxuICBpbml0aWFsSW5wdXRWYWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaW5pdGlhbElzT3BlbjogUHJvcFR5cGVzLmJvb2wsXG4gIGdldEExMXlTdGF0dXNNZXNzYWdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgaXRlbVRvU3RyaW5nOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvblNlbGVjdDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uU3RhdGVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvbklucHV0VmFsdWVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvblVzZXJBY3Rpb246IFByb3BUeXBlcy5mdW5jLFxuICBvbk91dGVyQ2xpY2s6IFByb3BUeXBlcy5mdW5jLFxuICBzZWxlY3RlZEl0ZW1DaGFuZ2VkOiBQcm9wVHlwZXMuZnVuYyxcbiAgc3RhdGVSZWR1Y2VyOiBQcm9wVHlwZXMuZnVuYyxcbiAgaXRlbUNvdW50OiBQcm9wVHlwZXMubnVtYmVyLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgZW52aXJvbm1lbnQ6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgZG9jdW1lbnQ6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBnZXRFbGVtZW50QnlJZDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICBhY3RpdmVFbGVtZW50OiBQcm9wVHlwZXMuYW55LFxuICAgICAgYm9keTogUHJvcFR5cGVzLmFueVxuICAgIH0pXG4gIH0pLFxuICBzdXBwcmVzc1JlZkVycm9yOiBQcm9wVHlwZXMuYm9vbCxcbiAgc2Nyb2xsSW50b1ZpZXc6IFByb3BUeXBlcy5mdW5jLFxuICAvLyB0aGluZ3Mgd2Uga2VlcCBpbiBzdGF0ZSBmb3IgdW5jb250cm9sbGVkIGNvbXBvbmVudHNcbiAgLy8gYnV0IGNhbiBhY2NlcHQgYXMgcHJvcHMgZm9yIGNvbnRyb2xsZWQgY29tcG9uZW50c1xuICAvKiBlc2xpbnQtZGlzYWJsZSByZWFjdC9uby11bnVzZWQtcHJvcC10eXBlcyAqL1xuICBzZWxlY3RlZEl0ZW06IFByb3BUeXBlcy5hbnksXG4gIGlzT3BlbjogUHJvcFR5cGVzLmJvb2wsXG4gIGlucHV0VmFsdWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGhpZ2hsaWdodGVkSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gIGxhYmVsSWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGlucHV0SWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG1lbnVJZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgZ2V0SXRlbUlkOiBQcm9wVHlwZXMuZnVuY1xuICAvKiBlc2xpbnQtZW5hYmxlIHJlYWN0L25vLXVudXNlZC1wcm9wLXR5cGVzICovXG59IDogdm9pZCAwO1xudmFyIERvd25zaGlmdCQxID0gRG93bnNoaWZ0O1xuZnVuY3Rpb24gdmFsaWRhdGVHZXRNZW51UHJvcHNDYWxsZWRDb3JyZWN0bHkobm9kZSwgX3JlZjEyKSB7XG4gIHZhciByZWZLZXkgPSBfcmVmMTIucmVmS2V5O1xuICBpZiAoIW5vZGUpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUuZXJyb3IoXCJkb3duc2hpZnQ6IFRoZSByZWYgcHJvcCBcXFwiXCIgKyByZWZLZXkgKyBcIlxcXCIgZnJvbSBnZXRNZW51UHJvcHMgd2FzIG5vdCBhcHBsaWVkIGNvcnJlY3RseSBvbiB5b3VyIG1lbnUgZWxlbWVudC5cIik7XG4gIH1cbn1cbmZ1bmN0aW9uIHZhbGlkYXRlR2V0Um9vdFByb3BzQ2FsbGVkQ29ycmVjdGx5KGVsZW1lbnQsIF9yZWYxMykge1xuICB2YXIgcmVmS2V5ID0gX3JlZjEzLnJlZktleTtcbiAgdmFyIHJlZktleVNwZWNpZmllZCA9IHJlZktleSAhPT0gJ3JlZic7XG4gIHZhciBpc0NvbXBvc2l0ZSA9ICFpc0RPTUVsZW1lbnQoZWxlbWVudCk7XG4gIGlmIChpc0NvbXBvc2l0ZSAmJiAhcmVmS2V5U3BlY2lmaWVkICYmICFpc0ZvcndhcmRSZWYoZWxlbWVudCkpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUuZXJyb3IoJ2Rvd25zaGlmdDogWW91IHJldHVybmVkIGEgbm9uLURPTSBlbGVtZW50LiBZb3UgbXVzdCBzcGVjaWZ5IGEgcmVmS2V5IGluIGdldFJvb3RQcm9wcycpO1xuICB9IGVsc2UgaWYgKCFpc0NvbXBvc2l0ZSAmJiByZWZLZXlTcGVjaWZpZWQpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUuZXJyb3IoXCJkb3duc2hpZnQ6IFlvdSByZXR1cm5lZCBhIERPTSBlbGVtZW50LiBZb3Ugc2hvdWxkIG5vdCBzcGVjaWZ5IGEgcmVmS2V5IGluIGdldFJvb3RQcm9wcy4gWW91IHNwZWNpZmllZCBcXFwiXCIgKyByZWZLZXkgKyBcIlxcXCJcIik7XG4gIH1cbiAgaWYgKCFpc0ZvcndhcmRSZWYoZWxlbWVudCkgJiYgIWdldEVsZW1lbnRQcm9wcyhlbGVtZW50KVtyZWZLZXldKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmVycm9yKFwiZG93bnNoaWZ0OiBZb3UgbXVzdCBhcHBseSB0aGUgcmVmIHByb3AgXFxcIlwiICsgcmVmS2V5ICsgXCJcXFwiIGZyb20gZ2V0Um9vdFByb3BzIG9udG8geW91ciByb290IGVsZW1lbnQuXCIpO1xuICB9XG59XG5cbnZhciBfZXhjbHVkZWQkMyA9IFtcImlzSW5pdGlhbE1vdW50XCIsIFwiaGlnaGxpZ2h0ZWRJbmRleFwiLCBcIml0ZW1zXCIsIFwiZW52aXJvbm1lbnRcIl07XG52YXIgZHJvcGRvd25EZWZhdWx0U3RhdGVWYWx1ZXMgPSB7XG4gIGhpZ2hsaWdodGVkSW5kZXg6IC0xLFxuICBpc09wZW46IGZhbHNlLFxuICBzZWxlY3RlZEl0ZW06IG51bGwsXG4gIGlucHV0VmFsdWU6ICcnXG59O1xuZnVuY3Rpb24gY2FsbE9uQ2hhbmdlUHJvcHMoYWN0aW9uLCBzdGF0ZSwgbmV3U3RhdGUpIHtcbiAgdmFyIHByb3BzID0gYWN0aW9uLnByb3BzLFxuICAgIHR5cGUgPSBhY3Rpb24udHlwZTtcbiAgdmFyIGNoYW5nZXMgPSB7fTtcbiAgT2JqZWN0LmtleXMoc3RhdGUpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIGludm9rZU9uQ2hhbmdlSGFuZGxlcihrZXksIGFjdGlvbiwgc3RhdGUsIG5ld1N0YXRlKTtcbiAgICBpZiAobmV3U3RhdGVba2V5XSAhPT0gc3RhdGVba2V5XSkge1xuICAgICAgY2hhbmdlc1trZXldID0gbmV3U3RhdGVba2V5XTtcbiAgICB9XG4gIH0pO1xuICBpZiAocHJvcHMub25TdGF0ZUNoYW5nZSAmJiBPYmplY3Qua2V5cyhjaGFuZ2VzKS5sZW5ndGgpIHtcbiAgICBwcm9wcy5vblN0YXRlQ2hhbmdlKF9leHRlbmRzKHtcbiAgICAgIHR5cGU6IHR5cGVcbiAgICB9LCBjaGFuZ2VzKSk7XG4gIH1cbn1cbmZ1bmN0aW9uIGludm9rZU9uQ2hhbmdlSGFuZGxlcihrZXksIGFjdGlvbiwgc3RhdGUsIG5ld1N0YXRlKSB7XG4gIHZhciBwcm9wcyA9IGFjdGlvbi5wcm9wcyxcbiAgICB0eXBlID0gYWN0aW9uLnR5cGU7XG4gIHZhciBoYW5kbGVyID0gXCJvblwiICsgY2FwaXRhbGl6ZVN0cmluZyhrZXkpICsgXCJDaGFuZ2VcIjtcbiAgaWYgKHByb3BzW2hhbmRsZXJdICYmIG5ld1N0YXRlW2tleV0gIT09IHVuZGVmaW5lZCAmJiBuZXdTdGF0ZVtrZXldICE9PSBzdGF0ZVtrZXldKSB7XG4gICAgcHJvcHNbaGFuZGxlcl0oX2V4dGVuZHMoe1xuICAgICAgdHlwZTogdHlwZVxuICAgIH0sIG5ld1N0YXRlKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBEZWZhdWx0IHN0YXRlIHJlZHVjZXIgdGhhdCByZXR1cm5zIHRoZSBjaGFuZ2VzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBzIHN0YXRlLlxuICogQHBhcmFtIHtPYmplY3R9IGEgYWN0aW9uIHdpdGggY2hhbmdlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IGNoYW5nZXMuXG4gKi9cbmZ1bmN0aW9uIHN0YXRlUmVkdWNlcihzLCBhKSB7XG4gIHJldHVybiBhLmNoYW5nZXM7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIG1lc3NhZ2UgdG8gYmUgYWRkZWQgdG8gYXJpYS1saXZlIHJlZ2lvbiB3aGVuIGl0ZW0gaXMgc2VsZWN0ZWQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHNlbGVjdGlvblBhcmFtZXRlcnMgUGFyYW1ldGVycyByZXF1aXJlZCB0byBidWlsZCB0aGUgbWVzc2FnZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBhMTF5IG1lc3NhZ2UuXG4gKi9cbmZ1bmN0aW9uIGdldEExMXlTZWxlY3Rpb25NZXNzYWdlKHNlbGVjdGlvblBhcmFtZXRlcnMpIHtcbiAgdmFyIHNlbGVjdGVkSXRlbSA9IHNlbGVjdGlvblBhcmFtZXRlcnMuc2VsZWN0ZWRJdGVtLFxuICAgIGl0ZW1Ub1N0cmluZ0xvY2FsID0gc2VsZWN0aW9uUGFyYW1ldGVycy5pdGVtVG9TdHJpbmc7XG4gIHJldHVybiBzZWxlY3RlZEl0ZW0gPyBpdGVtVG9TdHJpbmdMb2NhbChzZWxlY3RlZEl0ZW0pICsgXCIgaGFzIGJlZW4gc2VsZWN0ZWQuXCIgOiAnJztcbn1cblxuLyoqXG4gKiBEZWJvdW5jZWQgY2FsbCBmb3IgdXBkYXRpbmcgdGhlIGExMXkgbWVzc2FnZS5cbiAqL1xudmFyIHVwZGF0ZUExMXlTdGF0dXMgPSBkZWJvdW5jZShmdW5jdGlvbiAoZ2V0QTExeU1lc3NhZ2UsIGRvY3VtZW50KSB7XG4gIHNldFN0YXR1cyhnZXRBMTF5TWVzc2FnZSgpLCBkb2N1bWVudCk7XG59LCAyMDApO1xuXG4vLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxudmFyIHVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93LmRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgIT09ICd1bmRlZmluZWQnID8gdXNlTGF5b3V0RWZmZWN0IDogdXNlRWZmZWN0O1xuZnVuY3Rpb24gdXNlRWxlbWVudElkcyhfcmVmKSB7XG4gIHZhciBfcmVmJGlkID0gX3JlZi5pZCxcbiAgICBpZCA9IF9yZWYkaWQgPT09IHZvaWQgMCA/IFwiZG93bnNoaWZ0LVwiICsgZ2VuZXJhdGVJZCgpIDogX3JlZiRpZCxcbiAgICBsYWJlbElkID0gX3JlZi5sYWJlbElkLFxuICAgIG1lbnVJZCA9IF9yZWYubWVudUlkLFxuICAgIGdldEl0ZW1JZCA9IF9yZWYuZ2V0SXRlbUlkLFxuICAgIHRvZ2dsZUJ1dHRvbklkID0gX3JlZi50b2dnbGVCdXR0b25JZCxcbiAgICBpbnB1dElkID0gX3JlZi5pbnB1dElkO1xuICB2YXIgZWxlbWVudElkc1JlZiA9IHVzZVJlZih7XG4gICAgbGFiZWxJZDogbGFiZWxJZCB8fCBpZCArIFwiLWxhYmVsXCIsXG4gICAgbWVudUlkOiBtZW51SWQgfHwgaWQgKyBcIi1tZW51XCIsXG4gICAgZ2V0SXRlbUlkOiBnZXRJdGVtSWQgfHwgZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICByZXR1cm4gaWQgKyBcIi1pdGVtLVwiICsgaW5kZXg7XG4gICAgfSxcbiAgICB0b2dnbGVCdXR0b25JZDogdG9nZ2xlQnV0dG9uSWQgfHwgaWQgKyBcIi10b2dnbGUtYnV0dG9uXCIsXG4gICAgaW5wdXRJZDogaW5wdXRJZCB8fCBpZCArIFwiLWlucHV0XCJcbiAgfSk7XG4gIHJldHVybiBlbGVtZW50SWRzUmVmLmN1cnJlbnQ7XG59XG5mdW5jdGlvbiBnZXRJdGVtQW5kSW5kZXgoaXRlbVByb3AsIGluZGV4UHJvcCwgaXRlbXMsIGVycm9yTWVzc2FnZSkge1xuICB2YXIgaXRlbSwgaW5kZXg7XG4gIGlmIChpdGVtUHJvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKGluZGV4UHJvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICB9XG4gICAgaXRlbSA9IGl0ZW1zW2luZGV4UHJvcF07XG4gICAgaW5kZXggPSBpbmRleFByb3A7XG4gIH0gZWxzZSB7XG4gICAgaW5kZXggPSBpbmRleFByb3AgPT09IHVuZGVmaW5lZCA/IGl0ZW1zLmluZGV4T2YoaXRlbVByb3ApIDogaW5kZXhQcm9wO1xuICAgIGl0ZW0gPSBpdGVtUHJvcDtcbiAgfVxuICByZXR1cm4gW2l0ZW0sIGluZGV4XTtcbn1cbmZ1bmN0aW9uIGl0ZW1Ub1N0cmluZyhpdGVtKSB7XG4gIHJldHVybiBpdGVtID8gU3RyaW5nKGl0ZW0pIDogJyc7XG59XG5mdW5jdGlvbiBpc0FjY2VwdGVkQ2hhcmFjdGVyS2V5KGtleSkge1xuICByZXR1cm4gL15cXFN7MX0kLy50ZXN0KGtleSk7XG59XG5mdW5jdGlvbiBjYXBpdGFsaXplU3RyaW5nKHN0cmluZykge1xuICByZXR1cm4gXCJcIiArIHN0cmluZy5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKDEpO1xufVxuZnVuY3Rpb24gdXNlTGF0ZXN0UmVmKHZhbCkge1xuICB2YXIgcmVmID0gdXNlUmVmKHZhbCk7XG4gIC8vIHRlY2huaWNhbGx5IHRoaXMgaXMgbm90IFwiY29uY3VycmVudCBtb2RlIHNhZmVcIiBiZWNhdXNlIHdlJ3JlIG1hbmlwdWxhdGluZ1xuICAvLyB0aGUgdmFsdWUgZHVyaW5nIHJlbmRlciAoc28gaXQncyBub3QgaWRlbXBvdGVudCkuIEhvd2V2ZXIsIHRoZSBwbGFjZXMgdGhpc1xuICAvLyBob29rIGlzIHVzZWQgaXMgdG8gc3VwcG9ydCBtZW1vaXppbmcgY2FsbGJhY2tzIHdoaWNoIHdpbGwgYmUgY2FsbGVkXG4gIC8vICpkdXJpbmcqIHJlbmRlciwgc28gd2UgbmVlZCB0aGUgbGF0ZXN0IHZhbHVlcyAqZHVyaW5nKiByZW5kZXIuXG4gIC8vIElmIG5vdCBmb3IgdGhpcywgdGhlbiB3ZSdkIHByb2JhYmx5IHdhbnQgdG8gdXNlIHVzZUxheW91dEVmZmVjdCBpbnN0ZWFkLlxuICByZWYuY3VycmVudCA9IHZhbDtcbiAgcmV0dXJuIHJlZjtcbn1cblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgY29udHJvbGxlZCBzdGF0ZSB1c2luZyBhIHRoZSBwcmV2aW91cyBzdGF0ZSwgcHJvcHMsXG4gKiB0d28gcmVkdWNlcnMsIG9uZSBmcm9tIGRvd25zaGlmdCBhbmQgYW4gb3B0aW9uYWwgb25lIGZyb20gdGhlIHVzZXIuXG4gKiBBbHNvIGNhbGxzIHRoZSBvbkNoYW5nZSBoYW5kbGVycyBmb3Igc3RhdGUgdmFsdWVzIHRoYXQgaGF2ZSBjaGFuZ2VkLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlZHVjZXIgUmVkdWNlciBmdW5jdGlvbiBmcm9tIGRvd25zaGlmdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBpbml0aWFsU3RhdGUgSW5pdGlhbCBzdGF0ZSBvZiB0aGUgaG9vay5cbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBUaGUgaG9vayBwcm9wcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gQW4gYXJyYXkgd2l0aCB0aGUgc3RhdGUgYW5kIGFuIGFjdGlvbiBkaXNwYXRjaGVyLlxuICovXG5mdW5jdGlvbiB1c2VFbmhhbmNlZFJlZHVjZXIocmVkdWNlciwgaW5pdGlhbFN0YXRlLCBwcm9wcykge1xuICB2YXIgcHJldlN0YXRlUmVmID0gdXNlUmVmKCk7XG4gIHZhciBhY3Rpb25SZWYgPSB1c2VSZWYoKTtcbiAgdmFyIGVuaGFuY2VkUmVkdWNlciA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChzdGF0ZSwgYWN0aW9uKSB7XG4gICAgYWN0aW9uUmVmLmN1cnJlbnQgPSBhY3Rpb247XG4gICAgc3RhdGUgPSBnZXRTdGF0ZShzdGF0ZSwgYWN0aW9uLnByb3BzKTtcbiAgICB2YXIgY2hhbmdlcyA9IHJlZHVjZXIoc3RhdGUsIGFjdGlvbik7XG4gICAgdmFyIG5ld1N0YXRlID0gYWN0aW9uLnByb3BzLnN0YXRlUmVkdWNlcihzdGF0ZSwgX2V4dGVuZHMoe30sIGFjdGlvbiwge1xuICAgICAgY2hhbmdlczogY2hhbmdlc1xuICAgIH0pKTtcbiAgICByZXR1cm4gbmV3U3RhdGU7XG4gIH0sIFtyZWR1Y2VyXSk7XG4gIHZhciBfdXNlUmVkdWNlciA9IHVzZVJlZHVjZXIoZW5oYW5jZWRSZWR1Y2VyLCBpbml0aWFsU3RhdGUpLFxuICAgIHN0YXRlID0gX3VzZVJlZHVjZXJbMF0sXG4gICAgZGlzcGF0Y2ggPSBfdXNlUmVkdWNlclsxXTtcbiAgdmFyIHByb3BzUmVmID0gdXNlTGF0ZXN0UmVmKHByb3BzKTtcbiAgdmFyIGRpc3BhdGNoV2l0aFByb3BzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGFjdGlvbikge1xuICAgIHJldHVybiBkaXNwYXRjaChfZXh0ZW5kcyh7XG4gICAgICBwcm9wczogcHJvcHNSZWYuY3VycmVudFxuICAgIH0sIGFjdGlvbikpO1xuICB9LCBbcHJvcHNSZWZdKTtcbiAgdmFyIGFjdGlvbiA9IGFjdGlvblJlZi5jdXJyZW50O1xuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlmIChhY3Rpb24gJiYgcHJldlN0YXRlUmVmLmN1cnJlbnQgJiYgcHJldlN0YXRlUmVmLmN1cnJlbnQgIT09IHN0YXRlKSB7XG4gICAgICBjYWxsT25DaGFuZ2VQcm9wcyhhY3Rpb24sIGdldFN0YXRlKHByZXZTdGF0ZVJlZi5jdXJyZW50LCBhY3Rpb24ucHJvcHMpLCBzdGF0ZSk7XG4gICAgfVxuICAgIHByZXZTdGF0ZVJlZi5jdXJyZW50ID0gc3RhdGU7XG4gIH0sIFtzdGF0ZSwgcHJvcHMsIGFjdGlvbl0pO1xuICByZXR1cm4gW3N0YXRlLCBkaXNwYXRjaFdpdGhQcm9wc107XG59XG5cbi8qKlxuICogV3JhcHMgdGhlIHVzZUVuaGFuY2VkUmVkdWNlciBhbmQgYXBwbGllcyB0aGUgY29udHJvbGxlZCBwcm9wIHZhbHVlcyBiZWZvcmVcbiAqIHJldHVybmluZyB0aGUgbmV3IHN0YXRlLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlZHVjZXIgUmVkdWNlciBmdW5jdGlvbiBmcm9tIGRvd25zaGlmdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBpbml0aWFsU3RhdGUgSW5pdGlhbCBzdGF0ZSBvZiB0aGUgaG9vay5cbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBUaGUgaG9vayBwcm9wcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gQW4gYXJyYXkgd2l0aCB0aGUgc3RhdGUgYW5kIGFuIGFjdGlvbiBkaXNwYXRjaGVyLlxuICovXG5mdW5jdGlvbiB1c2VDb250cm9sbGVkUmVkdWNlciQxKHJlZHVjZXIsIGluaXRpYWxTdGF0ZSwgcHJvcHMpIHtcbiAgdmFyIF91c2VFbmhhbmNlZFJlZHVjZXIgPSB1c2VFbmhhbmNlZFJlZHVjZXIocmVkdWNlciwgaW5pdGlhbFN0YXRlLCBwcm9wcyksXG4gICAgc3RhdGUgPSBfdXNlRW5oYW5jZWRSZWR1Y2VyWzBdLFxuICAgIGRpc3BhdGNoID0gX3VzZUVuaGFuY2VkUmVkdWNlclsxXTtcbiAgcmV0dXJuIFtnZXRTdGF0ZShzdGF0ZSwgcHJvcHMpLCBkaXNwYXRjaF07XG59XG52YXIgZGVmYXVsdFByb3BzJDMgPSB7XG4gIGl0ZW1Ub1N0cmluZzogaXRlbVRvU3RyaW5nLFxuICBzdGF0ZVJlZHVjZXI6IHN0YXRlUmVkdWNlcixcbiAgZ2V0QTExeVNlbGVjdGlvbk1lc3NhZ2U6IGdldEExMXlTZWxlY3Rpb25NZXNzYWdlLFxuICBzY3JvbGxJbnRvVmlldzogc2Nyb2xsSW50b1ZpZXcsXG4gIGVudmlyb25tZW50OiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAoc3NyKSAqL1xuICB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IHt9IDogd2luZG93XG59O1xuZnVuY3Rpb24gZ2V0RGVmYXVsdFZhbHVlJDEocHJvcHMsIHByb3BLZXksIGRlZmF1bHRTdGF0ZVZhbHVlcykge1xuICBpZiAoZGVmYXVsdFN0YXRlVmFsdWVzID09PSB2b2lkIDApIHtcbiAgICBkZWZhdWx0U3RhdGVWYWx1ZXMgPSBkcm9wZG93bkRlZmF1bHRTdGF0ZVZhbHVlcztcbiAgfVxuICB2YXIgZGVmYXVsdFZhbHVlID0gcHJvcHNbXCJkZWZhdWx0XCIgKyBjYXBpdGFsaXplU3RyaW5nKHByb3BLZXkpXTtcbiAgaWYgKGRlZmF1bHRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFN0YXRlVmFsdWVzW3Byb3BLZXldO1xufVxuZnVuY3Rpb24gZ2V0SW5pdGlhbFZhbHVlJDEocHJvcHMsIHByb3BLZXksIGRlZmF1bHRTdGF0ZVZhbHVlcykge1xuICBpZiAoZGVmYXVsdFN0YXRlVmFsdWVzID09PSB2b2lkIDApIHtcbiAgICBkZWZhdWx0U3RhdGVWYWx1ZXMgPSBkcm9wZG93bkRlZmF1bHRTdGF0ZVZhbHVlcztcbiAgfVxuICB2YXIgdmFsdWUgPSBwcm9wc1twcm9wS2V5XTtcbiAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIGluaXRpYWxWYWx1ZSA9IHByb3BzW1wiaW5pdGlhbFwiICsgY2FwaXRhbGl6ZVN0cmluZyhwcm9wS2V5KV07XG4gIGlmIChpbml0aWFsVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBpbml0aWFsVmFsdWU7XG4gIH1cbiAgcmV0dXJuIGdldERlZmF1bHRWYWx1ZSQxKHByb3BzLCBwcm9wS2V5LCBkZWZhdWx0U3RhdGVWYWx1ZXMpO1xufVxuZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlJDIocHJvcHMpIHtcbiAgdmFyIHNlbGVjdGVkSXRlbSA9IGdldEluaXRpYWxWYWx1ZSQxKHByb3BzLCAnc2VsZWN0ZWRJdGVtJyk7XG4gIHZhciBpc09wZW4gPSBnZXRJbml0aWFsVmFsdWUkMShwcm9wcywgJ2lzT3BlbicpO1xuICB2YXIgaGlnaGxpZ2h0ZWRJbmRleCA9IGdldEluaXRpYWxWYWx1ZSQxKHByb3BzLCAnaGlnaGxpZ2h0ZWRJbmRleCcpO1xuICB2YXIgaW5wdXRWYWx1ZSA9IGdldEluaXRpYWxWYWx1ZSQxKHByb3BzLCAnaW5wdXRWYWx1ZScpO1xuICByZXR1cm4ge1xuICAgIGhpZ2hsaWdodGVkSW5kZXg6IGhpZ2hsaWdodGVkSW5kZXggPCAwICYmIHNlbGVjdGVkSXRlbSAmJiBpc09wZW4gPyBwcm9wcy5pdGVtcy5pbmRleE9mKHNlbGVjdGVkSXRlbSkgOiBoaWdobGlnaHRlZEluZGV4LFxuICAgIGlzT3BlbjogaXNPcGVuLFxuICAgIHNlbGVjdGVkSXRlbTogc2VsZWN0ZWRJdGVtLFxuICAgIGlucHV0VmFsdWU6IGlucHV0VmFsdWVcbiAgfTtcbn1cbmZ1bmN0aW9uIGdldEhpZ2hsaWdodGVkSW5kZXhPbk9wZW4ocHJvcHMsIHN0YXRlLCBvZmZzZXQpIHtcbiAgdmFyIGl0ZW1zID0gcHJvcHMuaXRlbXMsXG4gICAgaW5pdGlhbEhpZ2hsaWdodGVkSW5kZXggPSBwcm9wcy5pbml0aWFsSGlnaGxpZ2h0ZWRJbmRleCxcbiAgICBkZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleCA9IHByb3BzLmRlZmF1bHRIaWdobGlnaHRlZEluZGV4O1xuICB2YXIgc2VsZWN0ZWRJdGVtID0gc3RhdGUuc2VsZWN0ZWRJdGVtLFxuICAgIGhpZ2hsaWdodGVkSW5kZXggPSBzdGF0ZS5oaWdobGlnaHRlZEluZGV4O1xuICBpZiAoaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLy8gaW5pdGlhbEhpZ2hsaWdodGVkSW5kZXggd2lsbCBnaXZlIHZhbHVlIHRvIGhpZ2hsaWdodGVkSW5kZXggb24gaW5pdGlhbCBzdGF0ZSBvbmx5LlxuICBpZiAoaW5pdGlhbEhpZ2hsaWdodGVkSW5kZXggIT09IHVuZGVmaW5lZCAmJiBoaWdobGlnaHRlZEluZGV4ID09PSBpbml0aWFsSGlnaGxpZ2h0ZWRJbmRleCkge1xuICAgIHJldHVybiBpbml0aWFsSGlnaGxpZ2h0ZWRJbmRleDtcbiAgfVxuICBpZiAoZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBkZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleDtcbiAgfVxuICBpZiAoc2VsZWN0ZWRJdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW1zLmluZGV4T2Yoc2VsZWN0ZWRJdGVtKTtcbiAgfVxuICBpZiAob2Zmc2V0ID09PSAwKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIHJldHVybiBvZmZzZXQgPCAwID8gaXRlbXMubGVuZ3RoIC0gMSA6IDA7XG59XG5cbi8qKlxuICogUmV1c2UgdGhlIG1vdmVtZW50IHRyYWNraW5nIG9mIG1vdXNlIGFuZCB0b3VjaCBldmVudHMuXG4gKlxuICogQHBhcmFtIHtib29sZWFufSBpc09wZW4gV2hldGhlciB0aGUgZHJvcGRvd24gaXMgb3BlbiBvciBub3QuXG4gKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGRvd25zaGlmdEVsZW1lbnRSZWZzIERvd25zaGlmdCBlbGVtZW50IHJlZnMgdG8gdHJhY2sgbW92ZW1lbnQgKHRvZ2dsZUJ1dHRvbiwgbWVudSBldGMuKVxuICogQHBhcmFtIHtPYmplY3R9IGVudmlyb25tZW50IEVudmlyb25tZW50IHdoZXJlIGNvbXBvbmVudC9ob29rIGV4aXN0cy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZUJsdXIgSGFuZGxlciBvbiBibHVyIGZyb20gbW91c2Ugb3IgdG91Y2guXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZWYgY29udGFpbmluZyB3aGV0aGVyIG1vdXNlRG93biBvciB0b3VjaE1vdmUgZXZlbnQgaXMgaGFwcGVuaW5nXG4gKi9cbmZ1bmN0aW9uIHVzZU1vdXNlQW5kVG91Y2hUcmFja2VyKGlzT3BlbiwgZG93bnNoaWZ0RWxlbWVudFJlZnMsIGVudmlyb25tZW50LCBoYW5kbGVCbHVyKSB7XG4gIHZhciBtb3VzZUFuZFRvdWNoVHJhY2tlcnNSZWYgPSB1c2VSZWYoe1xuICAgIGlzTW91c2VEb3duOiBmYWxzZSxcbiAgICBpc1RvdWNoTW92ZTogZmFsc2VcbiAgfSk7XG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKChlbnZpcm9ubWVudCA9PSBudWxsID8gdm9pZCAwIDogZW52aXJvbm1lbnQuYWRkRXZlbnRMaXN0ZW5lcikgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRoZSBzYW1lIHN0cmF0ZWd5IGZvciBjaGVja2luZyBpZiBhIGNsaWNrIG9jY3VycmVkIGluc2lkZSBvciBvdXRzaWRlIGRvd25zaGlmdFxuICAgIC8vIGFzIGluIGRvd25zaGlmdC5qcy5cbiAgICB2YXIgb25Nb3VzZURvd24gPSBmdW5jdGlvbiBvbk1vdXNlRG93bigpIHtcbiAgICAgIG1vdXNlQW5kVG91Y2hUcmFja2Vyc1JlZi5jdXJyZW50LmlzTW91c2VEb3duID0gdHJ1ZTtcbiAgICB9O1xuICAgIHZhciBvbk1vdXNlVXAgPSBmdW5jdGlvbiBvbk1vdXNlVXAoZXZlbnQpIHtcbiAgICAgIG1vdXNlQW5kVG91Y2hUcmFja2Vyc1JlZi5jdXJyZW50LmlzTW91c2VEb3duID0gZmFsc2U7XG4gICAgICBpZiAoaXNPcGVuICYmICF0YXJnZXRXaXRoaW5Eb3duc2hpZnQoZXZlbnQudGFyZ2V0LCBkb3duc2hpZnRFbGVtZW50UmVmcy5tYXAoZnVuY3Rpb24gKHJlZikge1xuICAgICAgICByZXR1cm4gcmVmLmN1cnJlbnQ7XG4gICAgICB9KSwgZW52aXJvbm1lbnQpKSB7XG4gICAgICAgIGhhbmRsZUJsdXIoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBvblRvdWNoU3RhcnQgPSBmdW5jdGlvbiBvblRvdWNoU3RhcnQoKSB7XG4gICAgICBtb3VzZUFuZFRvdWNoVHJhY2tlcnNSZWYuY3VycmVudC5pc1RvdWNoTW92ZSA9IGZhbHNlO1xuICAgIH07XG4gICAgdmFyIG9uVG91Y2hNb3ZlID0gZnVuY3Rpb24gb25Ub3VjaE1vdmUoKSB7XG4gICAgICBtb3VzZUFuZFRvdWNoVHJhY2tlcnNSZWYuY3VycmVudC5pc1RvdWNoTW92ZSA9IHRydWU7XG4gICAgfTtcbiAgICB2YXIgb25Ub3VjaEVuZCA9IGZ1bmN0aW9uIG9uVG91Y2hFbmQoZXZlbnQpIHtcbiAgICAgIGlmIChpc09wZW4gJiYgIW1vdXNlQW5kVG91Y2hUcmFja2Vyc1JlZi5jdXJyZW50LmlzVG91Y2hNb3ZlICYmICF0YXJnZXRXaXRoaW5Eb3duc2hpZnQoZXZlbnQudGFyZ2V0LCBkb3duc2hpZnRFbGVtZW50UmVmcy5tYXAoZnVuY3Rpb24gKHJlZikge1xuICAgICAgICByZXR1cm4gcmVmLmN1cnJlbnQ7XG4gICAgICB9KSwgZW52aXJvbm1lbnQsIGZhbHNlKSkge1xuICAgICAgICBoYW5kbGVCbHVyKCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBlbnZpcm9ubWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk1vdXNlRG93bik7XG4gICAgZW52aXJvbm1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XG4gICAgZW52aXJvbm1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uVG91Y2hTdGFydCk7XG4gICAgZW52aXJvbm1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgb25Ub3VjaE1vdmUpO1xuICAgIGVudmlyb25tZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCk7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgICByZXR1cm4gZnVuY3Rpb24gY2xlYW51cCgpIHtcbiAgICAgIGVudmlyb25tZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duKTtcbiAgICAgIGVudmlyb25tZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXApO1xuICAgICAgZW52aXJvbm1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uVG91Y2hTdGFydCk7XG4gICAgICBlbnZpcm9ubWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvblRvdWNoTW92ZSk7XG4gICAgICBlbnZpcm9ubWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIG9uVG91Y2hFbmQpO1xuICAgIH07XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICB9LCBbaXNPcGVuLCBlbnZpcm9ubWVudF0pO1xuICByZXR1cm4gbW91c2VBbmRUb3VjaFRyYWNrZXJzUmVmO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1tdXRhYmxlLWV4cG9ydHNcbnZhciB1c2VHZXR0ZXJQcm9wc0NhbGxlZENoZWNrZXIgPSBmdW5jdGlvbiB1c2VHZXR0ZXJQcm9wc0NhbGxlZENoZWNrZXIoKSB7XG4gIHJldHVybiBub29wO1xufTtcbi8qKlxuICogQ3VzdG9tIGhvb2sgdGhhdCBjaGVja3MgaWYgZ2V0dGVyIHByb3BzIGFyZSBjYWxsZWQgY29ycmVjdGx5LlxuICpcbiAqIEBwYXJhbSAgey4uLmFueX0gcHJvcEtleXMgR2V0dGVyIHByb3AgbmFtZXMgdG8gYmUgaGFuZGxlZC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gU2V0dGVyIGZ1bmN0aW9uIGNhbGxlZCBpbnNpZGUgZ2V0dGVyIHByb3BzIHRvIHNldCBjYWxsIGluZm9ybWF0aW9uLlxuICovXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdXNlR2V0dGVyUHJvcHNDYWxsZWRDaGVja2VyID0gZnVuY3Rpb24gdXNlR2V0dGVyUHJvcHNDYWxsZWRDaGVja2VyKCkge1xuICAgIHZhciBpc0luaXRpYWxNb3VudFJlZiA9IHVzZVJlZih0cnVlKTtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgcHJvcEtleXMgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBwcm9wS2V5c1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG4gICAgdmFyIGdldHRlclByb3BzQ2FsbGVkUmVmID0gdXNlUmVmKHByb3BLZXlzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwcm9wS2V5KSB7XG4gICAgICBhY2NbcHJvcEtleV0gPSB7fTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pKTtcbiAgICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgICAgT2JqZWN0LmtleXMoZ2V0dGVyUHJvcHNDYWxsZWRSZWYuY3VycmVudCkuZm9yRWFjaChmdW5jdGlvbiAocHJvcEtleSkge1xuICAgICAgICB2YXIgcHJvcENhbGxJbmZvID0gZ2V0dGVyUHJvcHNDYWxsZWRSZWYuY3VycmVudFtwcm9wS2V5XTtcbiAgICAgICAgaWYgKGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICBpZiAoIU9iamVjdC5rZXlzKHByb3BDYWxsSW5mbykubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImRvd25zaGlmdDogWW91IGZvcmdvdCB0byBjYWxsIHRoZSBcIiArIHByb3BLZXkgKyBcIiBnZXR0ZXIgZnVuY3Rpb24gb24geW91ciBjb21wb25lbnQgLyBlbGVtZW50LlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN1cHByZXNzUmVmRXJyb3IgPSBwcm9wQ2FsbEluZm8uc3VwcHJlc3NSZWZFcnJvcixcbiAgICAgICAgICByZWZLZXkgPSBwcm9wQ2FsbEluZm8ucmVmS2V5LFxuICAgICAgICAgIGVsZW1lbnRSZWYgPSBwcm9wQ2FsbEluZm8uZWxlbWVudFJlZjtcbiAgICAgICAgaWYgKCghZWxlbWVudFJlZiB8fCAhZWxlbWVudFJlZi5jdXJyZW50KSAmJiAhc3VwcHJlc3NSZWZFcnJvcikge1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgY29uc29sZS5lcnJvcihcImRvd25zaGlmdDogVGhlIHJlZiBwcm9wIFxcXCJcIiArIHJlZktleSArIFwiXFxcIiBmcm9tIFwiICsgcHJvcEtleSArIFwiIHdhcyBub3QgYXBwbGllZCBjb3JyZWN0bHkgb24geW91ciBlbGVtZW50LlwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpc0luaXRpYWxNb3VudFJlZi5jdXJyZW50ID0gZmFsc2U7XG4gICAgfSk7XG4gICAgdmFyIHNldEdldHRlclByb3BDYWxsSW5mbyA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChwcm9wS2V5LCBzdXBwcmVzc1JlZkVycm9yLCByZWZLZXksIGVsZW1lbnRSZWYpIHtcbiAgICAgIGdldHRlclByb3BzQ2FsbGVkUmVmLmN1cnJlbnRbcHJvcEtleV0gPSB7XG4gICAgICAgIHN1cHByZXNzUmVmRXJyb3I6IHN1cHByZXNzUmVmRXJyb3IsXG4gICAgICAgIHJlZktleTogcmVmS2V5LFxuICAgICAgICBlbGVtZW50UmVmOiBlbGVtZW50UmVmXG4gICAgICB9O1xuICAgIH0sIFtdKTtcbiAgICByZXR1cm4gc2V0R2V0dGVyUHJvcENhbGxJbmZvO1xuICB9O1xufVxuZnVuY3Rpb24gdXNlQTExeU1lc3NhZ2VTZXR0ZXIoZ2V0QTExeU1lc3NhZ2UsIGRlcGVuZGVuY3lBcnJheSwgX3JlZjIpIHtcbiAgdmFyIGlzSW5pdGlhbE1vdW50ID0gX3JlZjIuaXNJbml0aWFsTW91bnQsXG4gICAgaGlnaGxpZ2h0ZWRJbmRleCA9IF9yZWYyLmhpZ2hsaWdodGVkSW5kZXgsXG4gICAgaXRlbXMgPSBfcmVmMi5pdGVtcyxcbiAgICBlbnZpcm9ubWVudCA9IF9yZWYyLmVudmlyb25tZW50LFxuICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmMiwgX2V4Y2x1ZGVkJDMpO1xuICAvLyBTZXRzIGExMXkgc3RhdHVzIG1lc3NhZ2Ugb24gY2hhbmdlcyBpbiBzdGF0ZS5cbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaXNJbml0aWFsTW91bnQgfHwgZmFsc2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXBkYXRlQTExeVN0YXR1cyhmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZ2V0QTExeU1lc3NhZ2UoX2V4dGVuZHMoe1xuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBoaWdobGlnaHRlZEluZGV4LFxuICAgICAgICBoaWdobGlnaHRlZEl0ZW06IGl0ZW1zW2hpZ2hsaWdodGVkSW5kZXhdLFxuICAgICAgICByZXN1bHRDb3VudDogaXRlbXMubGVuZ3RoXG4gICAgICB9LCByZXN0KSk7XG4gICAgfSwgZW52aXJvbm1lbnQuZG9jdW1lbnQpO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgfSwgZGVwZW5kZW5jeUFycmF5KTtcbn1cbmZ1bmN0aW9uIHVzZVNjcm9sbEludG9WaWV3KF9yZWYzKSB7XG4gIHZhciBoaWdobGlnaHRlZEluZGV4ID0gX3JlZjMuaGlnaGxpZ2h0ZWRJbmRleCxcbiAgICBpc09wZW4gPSBfcmVmMy5pc09wZW4sXG4gICAgaXRlbVJlZnMgPSBfcmVmMy5pdGVtUmVmcyxcbiAgICBnZXRJdGVtTm9kZUZyb21JbmRleCA9IF9yZWYzLmdldEl0ZW1Ob2RlRnJvbUluZGV4LFxuICAgIG1lbnVFbGVtZW50ID0gX3JlZjMubWVudUVsZW1lbnQsXG4gICAgc2Nyb2xsSW50b1ZpZXdQcm9wID0gX3JlZjMuc2Nyb2xsSW50b1ZpZXc7XG4gIC8vIHVzZWQgbm90IHRvIHNjcm9sbCBvbiBoaWdobGlnaHQgYnkgbW91c2UuXG4gIHZhciBzaG91bGRTY3JvbGxSZWYgPSB1c2VSZWYodHJ1ZSk7XG4gIC8vIFNjcm9sbCBvbiBoaWdobGlnaHRlZCBpdGVtIGlmIGNoYW5nZSBjb21lcyBmcm9tIGtleWJvYXJkLlxuICB1c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaGlnaGxpZ2h0ZWRJbmRleCA8IDAgfHwgIWlzT3BlbiB8fCAhT2JqZWN0LmtleXMoaXRlbVJlZnMuY3VycmVudCkubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzaG91bGRTY3JvbGxSZWYuY3VycmVudCA9PT0gZmFsc2UpIHtcbiAgICAgIHNob3VsZFNjcm9sbFJlZi5jdXJyZW50ID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2Nyb2xsSW50b1ZpZXdQcm9wKGdldEl0ZW1Ob2RlRnJvbUluZGV4KGhpZ2hsaWdodGVkSW5kZXgpLCBtZW51RWxlbWVudCk7XG4gICAgfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgfSwgW2hpZ2hsaWdodGVkSW5kZXhdKTtcbiAgcmV0dXJuIHNob3VsZFNjcm9sbFJlZjtcbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1tdXRhYmxlLWV4cG9ydHNcbnZhciB1c2VDb250cm9sUHJvcHNWYWxpZGF0b3IgPSBub29wO1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHVzZUNvbnRyb2xQcm9wc1ZhbGlkYXRvciA9IGZ1bmN0aW9uIHVzZUNvbnRyb2xQcm9wc1ZhbGlkYXRvcihfcmVmNCkge1xuICAgIHZhciBpc0luaXRpYWxNb3VudCA9IF9yZWY0LmlzSW5pdGlhbE1vdW50LFxuICAgICAgcHJvcHMgPSBfcmVmNC5wcm9wcyxcbiAgICAgIHN0YXRlID0gX3JlZjQuc3RhdGU7XG4gICAgLy8gdXNlZCBmb3IgY2hlY2tpbmcgd2hlbiBwcm9wcyBhcmUgbW92aW5nIGZyb20gY29udHJvbGxlZCB0byB1bmNvbnRyb2xsZWQuXG4gICAgdmFyIHByZXZQcm9wc1JlZiA9IHVzZVJlZihwcm9wcyk7XG4gICAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChpc0luaXRpYWxNb3VudCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YWxpZGF0ZUNvbnRyb2xsZWRVbmNoYW5nZWQoc3RhdGUsIHByZXZQcm9wc1JlZi5jdXJyZW50LCBwcm9wcyk7XG4gICAgICBwcmV2UHJvcHNSZWYuY3VycmVudCA9IHByb3BzO1xuICAgIH0sIFtzdGF0ZSwgcHJvcHMsIGlzSW5pdGlhbE1vdW50XSk7XG4gIH07XG59XG5cbi8qKlxuICogSGFuZGxlcyBzZWxlY3Rpb24gb24gRW50ZXIgLyBBbHQgKyBBcnJvd1VwLiBDbG9zZXMgdGhlIG1lbnUgYW5kIHJlc2V0cyB0aGUgaGlnaGxpZ2h0ZWQgaW5kZXgsIHVubGVzcyB0aGVyZSBpcyBhIGhpZ2hsaWdodGVkLlxuICogSW4gdGhhdCBjYXNlLCBzZWxlY3RzIHRoZSBpdGVtIGFuZCByZXNldHMgdG8gZGVmYXVsdHMgZm9yIG9wZW4gc3RhdGUgYW5kIGhpZ2hsaWdodGVkIGlkZXguXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgVGhlIHVzZUNvbWJvYm94IHByb3BzLlxuICogQHBhcmFtIHtudW1iZXJ9IGhpZ2hsaWdodGVkSW5kZXggVGhlIGluZGV4IGZyb20gdGhlIHN0YXRlLlxuICogQHBhcmFtIHtib29sZWFufSBpbnB1dFZhbHVlIEFsc28gcmV0dXJuIHRoZSBpbnB1dCB2YWx1ZSBmb3Igc3RhdGUuXG4gKiBAcmV0dXJucyBUaGUgY2hhbmdlcyBmb3IgdGhlIHN0YXRlLlxuICovXG5mdW5jdGlvbiBnZXRDaGFuZ2VzT25TZWxlY3Rpb24ocHJvcHMsIGhpZ2hsaWdodGVkSW5kZXgsIGlucHV0VmFsdWUpIHtcbiAgdmFyIF9wcm9wcyRpdGVtcztcbiAgaWYgKGlucHV0VmFsdWUgPT09IHZvaWQgMCkge1xuICAgIGlucHV0VmFsdWUgPSB0cnVlO1xuICB9XG4gIHZhciBzaG91bGRTZWxlY3QgPSAoKF9wcm9wcyRpdGVtcyA9IHByb3BzLml0ZW1zKSA9PSBudWxsID8gdm9pZCAwIDogX3Byb3BzJGl0ZW1zLmxlbmd0aCkgJiYgaGlnaGxpZ2h0ZWRJbmRleCA+PSAwO1xuICByZXR1cm4gX2V4dGVuZHMoe1xuICAgIGlzT3BlbjogZmFsc2UsXG4gICAgaGlnaGxpZ2h0ZWRJbmRleDogLTFcbiAgfSwgc2hvdWxkU2VsZWN0ICYmIF9leHRlbmRzKHtcbiAgICBzZWxlY3RlZEl0ZW06IHByb3BzLml0ZW1zW2hpZ2hsaWdodGVkSW5kZXhdLFxuICAgIGlzT3BlbjogZ2V0RGVmYXVsdFZhbHVlJDEocHJvcHMsICdpc09wZW4nKSxcbiAgICBoaWdobGlnaHRlZEluZGV4OiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgJ2hpZ2hsaWdodGVkSW5kZXgnKVxuICB9LCBpbnB1dFZhbHVlICYmIHtcbiAgICBpbnB1dFZhbHVlOiBwcm9wcy5pdGVtVG9TdHJpbmcocHJvcHMuaXRlbXNbaGlnaGxpZ2h0ZWRJbmRleF0pXG4gIH0pKTtcbn1cblxuZnVuY3Rpb24gZG93bnNoaWZ0Q29tbW9uUmVkdWNlcihzdGF0ZSwgYWN0aW9uLCBzdGF0ZUNoYW5nZVR5cGVzKSB7XG4gIHZhciB0eXBlID0gYWN0aW9uLnR5cGUsXG4gICAgcHJvcHMgPSBhY3Rpb24ucHJvcHM7XG4gIHZhciBjaGFuZ2VzO1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIHN0YXRlQ2hhbmdlVHlwZXMuSXRlbU1vdXNlTW92ZTpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGFjdGlvbi5kaXNhYmxlZCA/IC0xIDogYWN0aW9uLmluZGV4XG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBzdGF0ZUNoYW5nZVR5cGVzLk1lbnVNb3VzZUxlYXZlOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogLTFcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIHN0YXRlQ2hhbmdlVHlwZXMuVG9nZ2xlQnV0dG9uQ2xpY2s6XG4gICAgY2FzZSBzdGF0ZUNoYW5nZVR5cGVzLkZ1bmN0aW9uVG9nZ2xlTWVudTpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGlzT3BlbjogIXN0YXRlLmlzT3BlbixcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogc3RhdGUuaXNPcGVuID8gLTEgOiBnZXRIaWdobGlnaHRlZEluZGV4T25PcGVuKHByb3BzLCBzdGF0ZSwgMClcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIHN0YXRlQ2hhbmdlVHlwZXMuRnVuY3Rpb25PcGVuTWVudTpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGlzT3BlbjogdHJ1ZSxcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0SGlnaGxpZ2h0ZWRJbmRleE9uT3Blbihwcm9wcywgc3RhdGUsIDApXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBzdGF0ZUNoYW5nZVR5cGVzLkZ1bmN0aW9uQ2xvc2VNZW51OlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaXNPcGVuOiBmYWxzZVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2Ugc3RhdGVDaGFuZ2VUeXBlcy5GdW5jdGlvblNldEhpZ2hsaWdodGVkSW5kZXg6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBhY3Rpb24uaGlnaGxpZ2h0ZWRJbmRleFxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2Ugc3RhdGVDaGFuZ2VUeXBlcy5GdW5jdGlvblNldElucHV0VmFsdWU6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBpbnB1dFZhbHVlOiBhY3Rpb24uaW5wdXRWYWx1ZVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2Ugc3RhdGVDaGFuZ2VUeXBlcy5GdW5jdGlvblJlc2V0OlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0RGVmYXVsdFZhbHVlJDEocHJvcHMsICdoaWdobGlnaHRlZEluZGV4JyksXG4gICAgICAgIGlzT3BlbjogZ2V0RGVmYXVsdFZhbHVlJDEocHJvcHMsICdpc09wZW4nKSxcbiAgICAgICAgc2VsZWN0ZWRJdGVtOiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgJ3NlbGVjdGVkSXRlbScpLFxuICAgICAgICBpbnB1dFZhbHVlOiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgJ2lucHV0VmFsdWUnKVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlZHVjZXIgY2FsbGVkIHdpdGhvdXQgcHJvcGVyIGFjdGlvbiB0eXBlLicpO1xuICB9XG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIGNoYW5nZXMpO1xufVxuLyogZXNsaW50LWVuYWJsZSBjb21wbGV4aXR5ICovXG5cbmZ1bmN0aW9uIGdldEl0ZW1JbmRleEJ5Q2hhcmFjdGVyS2V5KF9hKSB7XG4gICAgdmFyIGtleXNTb0ZhciA9IF9hLmtleXNTb0ZhciwgaGlnaGxpZ2h0ZWRJbmRleCA9IF9hLmhpZ2hsaWdodGVkSW5kZXgsIGl0ZW1zID0gX2EuaXRlbXMsIGl0ZW1Ub1N0cmluZyA9IF9hLml0ZW1Ub1N0cmluZywgZ2V0SXRlbU5vZGVGcm9tSW5kZXggPSBfYS5nZXRJdGVtTm9kZUZyb21JbmRleDtcbiAgICB2YXIgbG93ZXJDYXNlZEtleXNTb0ZhciA9IGtleXNTb0Zhci50b0xvd2VyQ2FzZSgpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBpdGVtcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgLy8gaWYgd2UgYWxyZWFkeSBoYXZlIGEgc2VhcmNoIHF1ZXJ5IGluIHByb2dyZXNzLCB3ZSBhbHNvIGNvbnNpZGVyIHRoZSBjdXJyZW50IGhpZ2hsaWdodGVkIGl0ZW0uXG4gICAgICAgIHZhciBvZmZzZXRJbmRleCA9IChpbmRleCArIGhpZ2hsaWdodGVkSW5kZXggKyAoa2V5c1NvRmFyLmxlbmd0aCA8IDIgPyAxIDogMCkpICUgaXRlbXMubGVuZ3RoO1xuICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zW29mZnNldEluZGV4XTtcbiAgICAgICAgaWYgKGl0ZW0gIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgaXRlbVRvU3RyaW5nKGl0ZW0pLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChsb3dlckNhc2VkS2V5c1NvRmFyKSkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBnZXRJdGVtTm9kZUZyb21JbmRleChvZmZzZXRJbmRleCk7XG4gICAgICAgICAgICBpZiAoIShlbGVtZW50ID09PSBudWxsIHx8IGVsZW1lbnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGVsZW1lbnQuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvZmZzZXRJbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGlnaGxpZ2h0ZWRJbmRleDtcbn1cbnZhciBwcm9wVHlwZXMkMiA9IHtcbiAgICBpdGVtczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gICAgaXRlbVRvU3RyaW5nOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBnZXRBMTF5U3RhdHVzTWVzc2FnZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgZ2V0QTExeVNlbGVjdGlvbk1lc3NhZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgIGhpZ2hsaWdodGVkSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgaW5pdGlhbEhpZ2hsaWdodGVkSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgaXNPcGVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBkZWZhdWx0SXNPcGVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBpbml0aWFsSXNPcGVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBzZWxlY3RlZEl0ZW06IFByb3BUeXBlcy5hbnksXG4gICAgaW5pdGlhbFNlbGVjdGVkSXRlbTogUHJvcFR5cGVzLmFueSxcbiAgICBkZWZhdWx0U2VsZWN0ZWRJdGVtOiBQcm9wVHlwZXMuYW55LFxuICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGxhYmVsSWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgbWVudUlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGdldEl0ZW1JZDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgdG9nZ2xlQnV0dG9uSWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgc3RhdGVSZWR1Y2VyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvblNlbGVjdGVkSXRlbUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25IaWdobGlnaHRlZEluZGV4Q2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvblN0YXRlQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbklzT3BlbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgZW52aXJvbm1lbnQ6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICByZW1vdmVFdmVudExpc3RlbmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgZG9jdW1lbnQ6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgICBnZXRFbGVtZW50QnlJZDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgICAgICBhY3RpdmVFbGVtZW50OiBQcm9wVHlwZXMuYW55LFxuICAgICAgICAgICAgYm9keTogUHJvcFR5cGVzLmFueVxuICAgICAgICB9KVxuICAgIH0pXG59O1xuLyoqXG4gKiBEZWZhdWx0IGltcGxlbWVudGF0aW9uIGZvciBzdGF0dXMgbWVzc2FnZS4gT25seSBhZGRlZCB3aGVuIG1lbnUgaXMgb3Blbi5cbiAqIFdpbGwgc3BlY2lmdCBpZiB0aGVyZSBhcmUgcmVzdWx0cyBpbiB0aGUgbGlzdCwgYW5kIGlmIHNvLCBob3cgbWFueSxcbiAqIGFuZCB3aGF0IGtleXMgYXJlIHJlbGV2YW50LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbSB0aGUgZG93bnNoaWZ0IHN0YXRlIGFuZCBvdGhlciByZWxldmFudCBwcm9wZXJ0aWVzXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHRoZSBhMTF5IHN0YXR1cyBtZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIGdldEExMXlTdGF0dXNNZXNzYWdlKF9hKSB7XG4gICAgdmFyIGlzT3BlbiA9IF9hLmlzT3BlbiwgcmVzdWx0Q291bnQgPSBfYS5yZXN1bHRDb3VudCwgcHJldmlvdXNSZXN1bHRDb3VudCA9IF9hLnByZXZpb3VzUmVzdWx0Q291bnQ7XG4gICAgaWYgKCFpc09wZW4pIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBpZiAoIXJlc3VsdENvdW50KSB7XG4gICAgICAgIHJldHVybiAnTm8gcmVzdWx0cyBhcmUgYXZhaWxhYmxlLic7XG4gICAgfVxuICAgIGlmIChyZXN1bHRDb3VudCAhPT0gcHJldmlvdXNSZXN1bHRDb3VudCkge1xuICAgICAgICByZXR1cm4gXCJcIi5jb25jYXQocmVzdWx0Q291bnQsIFwiIHJlc3VsdFwiKS5jb25jYXQocmVzdWx0Q291bnQgPT09IDEgPyAnIGlzJyA6ICdzIGFyZScsIFwiIGF2YWlsYWJsZSwgdXNlIHVwIGFuZCBkb3duIGFycm93IGtleXMgdG8gbmF2aWdhdGUuIFByZXNzIEVudGVyIG9yIFNwYWNlIEJhciBrZXlzIHRvIHNlbGVjdC5cIik7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cbnZhciBkZWZhdWx0UHJvcHMkMiA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBkZWZhdWx0UHJvcHMkMyksIHsgZ2V0QTExeVN0YXR1c01lc3NhZ2U6IGdldEExMXlTdGF0dXNNZXNzYWdlIH0pO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1tdXRhYmxlLWV4cG9ydHNcbnZhciB2YWxpZGF0ZVByb3BUeXBlcyQyID0gbm9vcDtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIHZhbGlkYXRlUHJvcFR5cGVzJDIgPSBmdW5jdGlvbiAob3B0aW9ucywgY2FsbGVyKSB7XG4gICAgICAgIFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcyhwcm9wVHlwZXMkMiwgb3B0aW9ucywgJ3Byb3AnLCBjYWxsZXIubmFtZSk7XG4gICAgfTtcbn1cblxudmFyIFRvZ2dsZUJ1dHRvbkNsaWNrJDEgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX190b2dnbGVidXR0b25fY2xpY2tfXycgOiAwO1xudmFyIFRvZ2dsZUJ1dHRvbktleURvd25BcnJvd0Rvd24gPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX190b2dnbGVidXR0b25fa2V5ZG93bl9hcnJvd19kb3duX18nIDogMTtcbnZhciBUb2dnbGVCdXR0b25LZXlEb3duQXJyb3dVcCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3RvZ2dsZWJ1dHRvbl9rZXlkb3duX2Fycm93X3VwX18nIDogMjtcbnZhciBUb2dnbGVCdXR0b25LZXlEb3duQ2hhcmFjdGVyID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fdG9nZ2xlYnV0dG9uX2tleWRvd25fY2hhcmFjdGVyX18nIDogMztcbnZhciBUb2dnbGVCdXR0b25LZXlEb3duRXNjYXBlID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fdG9nZ2xlYnV0dG9uX2tleWRvd25fZXNjYXBlX18nIDogNDtcbnZhciBUb2dnbGVCdXR0b25LZXlEb3duSG9tZSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3RvZ2dsZWJ1dHRvbl9rZXlkb3duX2hvbWVfXycgOiA1O1xudmFyIFRvZ2dsZUJ1dHRvbktleURvd25FbmQgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX190b2dnbGVidXR0b25fa2V5ZG93bl9lbmRfXycgOiA2O1xudmFyIFRvZ2dsZUJ1dHRvbktleURvd25FbnRlciA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3RvZ2dsZWJ1dHRvbl9rZXlkb3duX2VudGVyX18nIDogNztcbnZhciBUb2dnbGVCdXR0b25LZXlEb3duU3BhY2VCdXR0b24gPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX190b2dnbGVidXR0b25fa2V5ZG93bl9zcGFjZV9idXR0b25fXycgOiA4O1xudmFyIFRvZ2dsZUJ1dHRvbktleURvd25QYWdlVXAgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX190b2dnbGVidXR0b25fa2V5ZG93bl9wYWdlX3VwX18nIDogOTtcbnZhciBUb2dnbGVCdXR0b25LZXlEb3duUGFnZURvd24gPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX190b2dnbGVidXR0b25fa2V5ZG93bl9wYWdlX2Rvd25fXycgOiAxMDtcbnZhciBUb2dnbGVCdXR0b25CbHVyID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fdG9nZ2xlYnV0dG9uX2JsdXJfXycgOiAxMTtcbnZhciBNZW51TW91c2VMZWF2ZSQxID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fbWVudV9tb3VzZV9sZWF2ZV9fJyA6IDEyO1xudmFyIEl0ZW1Nb3VzZU1vdmUkMSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2l0ZW1fbW91c2VfbW92ZV9fJyA6IDEzO1xudmFyIEl0ZW1DbGljayQxID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19faXRlbV9jbGlja19fJyA6IDE0O1xudmFyIEZ1bmN0aW9uVG9nZ2xlTWVudSQxID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fZnVuY3Rpb25fdG9nZ2xlX21lbnVfXycgOiAxNTtcbnZhciBGdW5jdGlvbk9wZW5NZW51JDEgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9vcGVuX21lbnVfXycgOiAxNjtcbnZhciBGdW5jdGlvbkNsb3NlTWVudSQxID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fZnVuY3Rpb25fY2xvc2VfbWVudV9fJyA6IDE3O1xudmFyIEZ1bmN0aW9uU2V0SGlnaGxpZ2h0ZWRJbmRleCQxID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fZnVuY3Rpb25fc2V0X2hpZ2hsaWdodGVkX2luZGV4X18nIDogMTg7XG52YXIgRnVuY3Rpb25TZWxlY3RJdGVtJDEgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9zZWxlY3RfaXRlbV9fJyA6IDE5O1xudmFyIEZ1bmN0aW9uU2V0SW5wdXRWYWx1ZSQxID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fZnVuY3Rpb25fc2V0X2lucHV0X3ZhbHVlX18nIDogMjA7XG52YXIgRnVuY3Rpb25SZXNldCQyID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fZnVuY3Rpb25fcmVzZXRfXycgOiAyMTtcblxudmFyIHN0YXRlQ2hhbmdlVHlwZXMkMiA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgX19wcm90b19fOiBudWxsLFxuICBUb2dnbGVCdXR0b25DbGljazogVG9nZ2xlQnV0dG9uQ2xpY2skMSxcbiAgVG9nZ2xlQnV0dG9uS2V5RG93bkFycm93RG93bjogVG9nZ2xlQnV0dG9uS2V5RG93bkFycm93RG93bixcbiAgVG9nZ2xlQnV0dG9uS2V5RG93bkFycm93VXA6IFRvZ2dsZUJ1dHRvbktleURvd25BcnJvd1VwLFxuICBUb2dnbGVCdXR0b25LZXlEb3duQ2hhcmFjdGVyOiBUb2dnbGVCdXR0b25LZXlEb3duQ2hhcmFjdGVyLFxuICBUb2dnbGVCdXR0b25LZXlEb3duRXNjYXBlOiBUb2dnbGVCdXR0b25LZXlEb3duRXNjYXBlLFxuICBUb2dnbGVCdXR0b25LZXlEb3duSG9tZTogVG9nZ2xlQnV0dG9uS2V5RG93bkhvbWUsXG4gIFRvZ2dsZUJ1dHRvbktleURvd25FbmQ6IFRvZ2dsZUJ1dHRvbktleURvd25FbmQsXG4gIFRvZ2dsZUJ1dHRvbktleURvd25FbnRlcjogVG9nZ2xlQnV0dG9uS2V5RG93bkVudGVyLFxuICBUb2dnbGVCdXR0b25LZXlEb3duU3BhY2VCdXR0b246IFRvZ2dsZUJ1dHRvbktleURvd25TcGFjZUJ1dHRvbixcbiAgVG9nZ2xlQnV0dG9uS2V5RG93blBhZ2VVcDogVG9nZ2xlQnV0dG9uS2V5RG93blBhZ2VVcCxcbiAgVG9nZ2xlQnV0dG9uS2V5RG93blBhZ2VEb3duOiBUb2dnbGVCdXR0b25LZXlEb3duUGFnZURvd24sXG4gIFRvZ2dsZUJ1dHRvbkJsdXI6IFRvZ2dsZUJ1dHRvbkJsdXIsXG4gIE1lbnVNb3VzZUxlYXZlOiBNZW51TW91c2VMZWF2ZSQxLFxuICBJdGVtTW91c2VNb3ZlOiBJdGVtTW91c2VNb3ZlJDEsXG4gIEl0ZW1DbGljazogSXRlbUNsaWNrJDEsXG4gIEZ1bmN0aW9uVG9nZ2xlTWVudTogRnVuY3Rpb25Ub2dnbGVNZW51JDEsXG4gIEZ1bmN0aW9uT3Blbk1lbnU6IEZ1bmN0aW9uT3Blbk1lbnUkMSxcbiAgRnVuY3Rpb25DbG9zZU1lbnU6IEZ1bmN0aW9uQ2xvc2VNZW51JDEsXG4gIEZ1bmN0aW9uU2V0SGlnaGxpZ2h0ZWRJbmRleDogRnVuY3Rpb25TZXRIaWdobGlnaHRlZEluZGV4JDEsXG4gIEZ1bmN0aW9uU2VsZWN0SXRlbTogRnVuY3Rpb25TZWxlY3RJdGVtJDEsXG4gIEZ1bmN0aW9uU2V0SW5wdXRWYWx1ZTogRnVuY3Rpb25TZXRJbnB1dFZhbHVlJDEsXG4gIEZ1bmN0aW9uUmVzZXQ6IEZ1bmN0aW9uUmVzZXQkMlxufSk7XG5cbi8qIGVzbGludC1kaXNhYmxlIGNvbXBsZXhpdHkgKi9cbmZ1bmN0aW9uIGRvd25zaGlmdFNlbGVjdFJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuICB2YXIgX3Byb3BzJGl0ZW1zO1xuICB2YXIgdHlwZSA9IGFjdGlvbi50eXBlLFxuICAgIHByb3BzID0gYWN0aW9uLnByb3BzLFxuICAgIGFsdEtleSA9IGFjdGlvbi5hbHRLZXk7XG4gIHZhciBjaGFuZ2VzO1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIEl0ZW1DbGljayQxOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaXNPcGVuOiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgJ2lzT3BlbicpLFxuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgJ2hpZ2hsaWdodGVkSW5kZXgnKSxcbiAgICAgICAgc2VsZWN0ZWRJdGVtOiBwcm9wcy5pdGVtc1thY3Rpb24uaW5kZXhdXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBUb2dnbGVCdXR0b25LZXlEb3duQ2hhcmFjdGVyOlxuICAgICAge1xuICAgICAgICB2YXIgbG93ZXJjYXNlZEtleSA9IGFjdGlvbi5rZXk7XG4gICAgICAgIHZhciBpbnB1dFZhbHVlID0gXCJcIiArIHN0YXRlLmlucHV0VmFsdWUgKyBsb3dlcmNhc2VkS2V5O1xuICAgICAgICB2YXIgcHJldkhpZ2hsaWdodGVkSW5kZXggPSAhc3RhdGUuaXNPcGVuICYmIHN0YXRlLnNlbGVjdGVkSXRlbSA/IHByb3BzLml0ZW1zLmluZGV4T2Yoc3RhdGUuc2VsZWN0ZWRJdGVtKSA6IHN0YXRlLmhpZ2hsaWdodGVkSW5kZXg7XG4gICAgICAgIHZhciBoaWdobGlnaHRlZEluZGV4ID0gZ2V0SXRlbUluZGV4QnlDaGFyYWN0ZXJLZXkoe1xuICAgICAgICAgIGtleXNTb0ZhcjogaW5wdXRWYWx1ZSxcbiAgICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBwcmV2SGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgICAgICBpdGVtczogcHJvcHMuaXRlbXMsXG4gICAgICAgICAgaXRlbVRvU3RyaW5nOiBwcm9wcy5pdGVtVG9TdHJpbmcsXG4gICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGFjdGlvbi5nZXRJdGVtTm9kZUZyb21JbmRleFxuICAgICAgICB9KTtcbiAgICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgICBpbnB1dFZhbHVlOiBpbnB1dFZhbHVlLFxuICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGhpZ2hsaWdodGVkSW5kZXgsXG4gICAgICAgICAgaXNPcGVuOiB0cnVlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIFRvZ2dsZUJ1dHRvbktleURvd25BcnJvd0Rvd246XG4gICAgICB7XG4gICAgICAgIHZhciBfaGlnaGxpZ2h0ZWRJbmRleCA9IHN0YXRlLmlzT3BlbiA/IGdldE5leHRXcmFwcGluZ0luZGV4KDEsIHN0YXRlLmhpZ2hsaWdodGVkSW5kZXgsIHByb3BzLml0ZW1zLmxlbmd0aCwgYWN0aW9uLmdldEl0ZW1Ob2RlRnJvbUluZGV4LCBmYWxzZSkgOiBhbHRLZXkgJiYgc3RhdGUuc2VsZWN0ZWRJdGVtID09IG51bGwgPyAtMSA6IGdldEhpZ2hsaWdodGVkSW5kZXhPbk9wZW4ocHJvcHMsIHN0YXRlLCAxKTtcbiAgICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBfaGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgICAgICBpc09wZW46IHRydWVcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgVG9nZ2xlQnV0dG9uS2V5RG93bkFycm93VXA6XG4gICAgICBpZiAoc3RhdGUuaXNPcGVuICYmIGFsdEtleSkge1xuICAgICAgICBjaGFuZ2VzID0gZ2V0Q2hhbmdlc09uU2VsZWN0aW9uKHByb3BzLCBzdGF0ZS5oaWdobGlnaHRlZEluZGV4LCBmYWxzZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgX2hpZ2hsaWdodGVkSW5kZXgyID0gc3RhdGUuaXNPcGVuID8gZ2V0TmV4dFdyYXBwaW5nSW5kZXgoLTEsIHN0YXRlLmhpZ2hsaWdodGVkSW5kZXgsIHByb3BzLml0ZW1zLmxlbmd0aCwgYWN0aW9uLmdldEl0ZW1Ob2RlRnJvbUluZGV4LCBmYWxzZSkgOiBnZXRIaWdobGlnaHRlZEluZGV4T25PcGVuKHByb3BzLCBzdGF0ZSwgLTEpO1xuICAgICAgICBjaGFuZ2VzID0ge1xuICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IF9oaWdobGlnaHRlZEluZGV4MixcbiAgICAgICAgICBpc09wZW46IHRydWVcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIC8vIG9ubHkgdHJpZ2dlcmVkIHdoZW4gbWVudSBpcyBvcGVuLlxuICAgIGNhc2UgVG9nZ2xlQnV0dG9uS2V5RG93bkVudGVyOlxuICAgIGNhc2UgVG9nZ2xlQnV0dG9uS2V5RG93blNwYWNlQnV0dG9uOlxuICAgICAgY2hhbmdlcyA9IGdldENoYW5nZXNPblNlbGVjdGlvbihwcm9wcywgc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCwgZmFsc2UpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBUb2dnbGVCdXR0b25LZXlEb3duSG9tZTpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGdldE5leHROb25EaXNhYmxlZEluZGV4KDEsIDAsIHByb3BzLml0ZW1zLmxlbmd0aCwgYWN0aW9uLmdldEl0ZW1Ob2RlRnJvbUluZGV4LCBmYWxzZSksXG4gICAgICAgIGlzT3BlbjogdHJ1ZVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgVG9nZ2xlQnV0dG9uS2V5RG93bkVuZDpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGdldE5leHROb25EaXNhYmxlZEluZGV4KC0xLCBwcm9wcy5pdGVtcy5sZW5ndGggLSAxLCBwcm9wcy5pdGVtcy5sZW5ndGgsIGFjdGlvbi5nZXRJdGVtTm9kZUZyb21JbmRleCwgZmFsc2UpLFxuICAgICAgICBpc09wZW46IHRydWVcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIFRvZ2dsZUJ1dHRvbktleURvd25QYWdlVXA6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBnZXROZXh0V3JhcHBpbmdJbmRleCgtMTAsIHN0YXRlLmhpZ2hsaWdodGVkSW5kZXgsIHByb3BzLml0ZW1zLmxlbmd0aCwgYWN0aW9uLmdldEl0ZW1Ob2RlRnJvbUluZGV4LCBmYWxzZSlcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIFRvZ2dsZUJ1dHRvbktleURvd25QYWdlRG93bjpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGdldE5leHRXcmFwcGluZ0luZGV4KDEwLCBzdGF0ZS5oaWdobGlnaHRlZEluZGV4LCBwcm9wcy5pdGVtcy5sZW5ndGgsIGFjdGlvbi5nZXRJdGVtTm9kZUZyb21JbmRleCwgZmFsc2UpXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBUb2dnbGVCdXR0b25LZXlEb3duRXNjYXBlOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaXNPcGVuOiBmYWxzZSxcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogLTFcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIFRvZ2dsZUJ1dHRvbkJsdXI6XG4gICAgICBjaGFuZ2VzID0gX2V4dGVuZHMoe1xuICAgICAgICBpc09wZW46IGZhbHNlLFxuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiAtMVxuICAgICAgfSwgc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCA+PSAwICYmICgoX3Byb3BzJGl0ZW1zID0gcHJvcHMuaXRlbXMpID09IG51bGwgPyB2b2lkIDAgOiBfcHJvcHMkaXRlbXMubGVuZ3RoKSAmJiB7XG4gICAgICAgIHNlbGVjdGVkSXRlbTogcHJvcHMuaXRlbXNbc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleF1cbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBGdW5jdGlvblNlbGVjdEl0ZW0kMTpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIHNlbGVjdGVkSXRlbTogYWN0aW9uLnNlbGVjdGVkSXRlbVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZG93bnNoaWZ0Q29tbW9uUmVkdWNlcihzdGF0ZSwgYWN0aW9uLCBzdGF0ZUNoYW5nZVR5cGVzJDIpO1xuICB9XG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIGNoYW5nZXMpO1xufVxuLyogZXNsaW50LWVuYWJsZSBjb21wbGV4aXR5ICovXG5cbnZhciBfZXhjbHVkZWQkMiA9IFtcIm9uTW91c2VMZWF2ZVwiLCBcInJlZktleVwiLCBcIm9uS2V5RG93blwiLCBcIm9uQmx1clwiLCBcInJlZlwiXSxcbiAgX2V4Y2x1ZGVkMiQyID0gW1wib25CbHVyXCIsIFwib25DbGlja1wiLCBcIm9uUHJlc3NcIiwgXCJvbktleURvd25cIiwgXCJyZWZLZXlcIiwgXCJyZWZcIl0sXG4gIF9leGNsdWRlZDMkMSA9IFtcIml0ZW1cIiwgXCJpbmRleFwiLCBcIm9uTW91c2VNb3ZlXCIsIFwib25DbGlja1wiLCBcIm9uUHJlc3NcIiwgXCJyZWZLZXlcIiwgXCJyZWZcIiwgXCJkaXNhYmxlZFwiXTtcbnVzZVNlbGVjdC5zdGF0ZUNoYW5nZVR5cGVzID0gc3RhdGVDaGFuZ2VUeXBlcyQyO1xuZnVuY3Rpb24gdXNlU2VsZWN0KHVzZXJQcm9wcykge1xuICBpZiAodXNlclByb3BzID09PSB2b2lkIDApIHtcbiAgICB1c2VyUHJvcHMgPSB7fTtcbiAgfVxuICB2YWxpZGF0ZVByb3BUeXBlcyQyKHVzZXJQcm9wcywgdXNlU2VsZWN0KTtcbiAgLy8gUHJvcHMgZGVmYXVsdHMgYW5kIGRlc3RydWN0dXJpbmcuXG4gIHZhciBwcm9wcyA9IF9leHRlbmRzKHt9LCBkZWZhdWx0UHJvcHMkMiwgdXNlclByb3BzKTtcbiAgdmFyIGl0ZW1zID0gcHJvcHMuaXRlbXMsXG4gICAgc2Nyb2xsSW50b1ZpZXcgPSBwcm9wcy5zY3JvbGxJbnRvVmlldyxcbiAgICBlbnZpcm9ubWVudCA9IHByb3BzLmVudmlyb25tZW50LFxuICAgIGl0ZW1Ub1N0cmluZyA9IHByb3BzLml0ZW1Ub1N0cmluZyxcbiAgICBnZXRBMTF5U2VsZWN0aW9uTWVzc2FnZSA9IHByb3BzLmdldEExMXlTZWxlY3Rpb25NZXNzYWdlLFxuICAgIGdldEExMXlTdGF0dXNNZXNzYWdlID0gcHJvcHMuZ2V0QTExeVN0YXR1c01lc3NhZ2U7XG4gIC8vIEluaXRpYWwgc3RhdGUgZGVwZW5kaW5nIG9uIGNvbnRyb2xsZWQgcHJvcHMuXG4gIHZhciBpbml0aWFsU3RhdGUgPSBnZXRJbml0aWFsU3RhdGUkMihwcm9wcyk7XG4gIHZhciBfdXNlQ29udHJvbGxlZFJlZHVjZXIgPSB1c2VDb250cm9sbGVkUmVkdWNlciQxKGRvd25zaGlmdFNlbGVjdFJlZHVjZXIsIGluaXRpYWxTdGF0ZSwgcHJvcHMpLFxuICAgIHN0YXRlID0gX3VzZUNvbnRyb2xsZWRSZWR1Y2VyWzBdLFxuICAgIGRpc3BhdGNoID0gX3VzZUNvbnRyb2xsZWRSZWR1Y2VyWzFdO1xuICB2YXIgaXNPcGVuID0gc3RhdGUuaXNPcGVuLFxuICAgIGhpZ2hsaWdodGVkSW5kZXggPSBzdGF0ZS5oaWdobGlnaHRlZEluZGV4LFxuICAgIHNlbGVjdGVkSXRlbSA9IHN0YXRlLnNlbGVjdGVkSXRlbSxcbiAgICBpbnB1dFZhbHVlID0gc3RhdGUuaW5wdXRWYWx1ZTtcblxuICAvLyBFbGVtZW50IGVmcy5cbiAgdmFyIHRvZ2dsZUJ1dHRvblJlZiA9IHVzZVJlZihudWxsKTtcbiAgdmFyIG1lbnVSZWYgPSB1c2VSZWYobnVsbCk7XG4gIHZhciBpdGVtUmVmcyA9IHVzZVJlZih7fSk7XG4gIC8vIHVzZWQgdG8ga2VlcCB0aGUgaW5wdXRWYWx1ZSBjbGVhclRpbWVvdXQgb2JqZWN0IGJldHdlZW4gcmVuZGVycy5cbiAgdmFyIGNsZWFyVGltZW91dFJlZiA9IHVzZVJlZihudWxsKTtcbiAgLy8gcHJldmVudCBpZCByZS1nZW5lcmF0aW9uIGJldHdlZW4gcmVuZGVycy5cbiAgdmFyIGVsZW1lbnRJZHMgPSB1c2VFbGVtZW50SWRzKHByb3BzKTtcbiAgLy8gdXNlZCB0byBrZWVwIHRyYWNrIG9mIGhvdyBtYW55IGl0ZW1zIHdlIGhhZCBvbiBwcmV2aW91cyBjeWNsZS5cbiAgdmFyIHByZXZpb3VzUmVzdWx0Q291bnRSZWYgPSB1c2VSZWYoKTtcbiAgdmFyIGlzSW5pdGlhbE1vdW50UmVmID0gdXNlUmVmKHRydWUpO1xuICAvLyB1dGlsaXR5IGNhbGxiYWNrIHRvIGdldCBpdGVtIGVsZW1lbnQuXG4gIHZhciBsYXRlc3QgPSB1c2VMYXRlc3RSZWYoe1xuICAgIHN0YXRlOiBzdGF0ZSxcbiAgICBwcm9wczogcHJvcHNcbiAgfSk7XG5cbiAgLy8gU29tZSB1dGlscy5cbiAgdmFyIGdldEl0ZW1Ob2RlRnJvbUluZGV4ID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgcmV0dXJuIGl0ZW1SZWZzLmN1cnJlbnRbZWxlbWVudElkcy5nZXRJdGVtSWQoaW5kZXgpXTtcbiAgfSwgW2VsZW1lbnRJZHNdKTtcblxuICAvLyBFZmZlY3RzLlxuICAvLyBTZXRzIGExMXkgc3RhdHVzIG1lc3NhZ2Ugb24gY2hhbmdlcyBpbiBzdGF0ZS5cbiAgdXNlQTExeU1lc3NhZ2VTZXR0ZXIoZ2V0QTExeVN0YXR1c01lc3NhZ2UsIFtpc09wZW4sIGhpZ2hsaWdodGVkSW5kZXgsIGlucHV0VmFsdWUsIGl0ZW1zXSwgX2V4dGVuZHMoe1xuICAgIGlzSW5pdGlhbE1vdW50OiBpc0luaXRpYWxNb3VudFJlZi5jdXJyZW50LFxuICAgIHByZXZpb3VzUmVzdWx0Q291bnQ6IHByZXZpb3VzUmVzdWx0Q291bnRSZWYuY3VycmVudCxcbiAgICBpdGVtczogaXRlbXMsXG4gICAgZW52aXJvbm1lbnQ6IGVudmlyb25tZW50LFxuICAgIGl0ZW1Ub1N0cmluZzogaXRlbVRvU3RyaW5nXG4gIH0sIHN0YXRlKSk7XG4gIC8vIFNldHMgYTExeSBzdGF0dXMgbWVzc2FnZSBvbiBjaGFuZ2VzIGluIHNlbGVjdGVkSXRlbS5cbiAgdXNlQTExeU1lc3NhZ2VTZXR0ZXIoZ2V0QTExeVNlbGVjdGlvbk1lc3NhZ2UsIFtzZWxlY3RlZEl0ZW1dLCBfZXh0ZW5kcyh7XG4gICAgaXNJbml0aWFsTW91bnQ6IGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQsXG4gICAgcHJldmlvdXNSZXN1bHRDb3VudDogcHJldmlvdXNSZXN1bHRDb3VudFJlZi5jdXJyZW50LFxuICAgIGl0ZW1zOiBpdGVtcyxcbiAgICBlbnZpcm9ubWVudDogZW52aXJvbm1lbnQsXG4gICAgaXRlbVRvU3RyaW5nOiBpdGVtVG9TdHJpbmdcbiAgfSwgc3RhdGUpKTtcbiAgLy8gU2Nyb2xsIG9uIGhpZ2hsaWdodGVkIGl0ZW0gaWYgY2hhbmdlIGNvbWVzIGZyb20ga2V5Ym9hcmQuXG4gIHZhciBzaG91bGRTY3JvbGxSZWYgPSB1c2VTY3JvbGxJbnRvVmlldyh7XG4gICAgbWVudUVsZW1lbnQ6IG1lbnVSZWYuY3VycmVudCxcbiAgICBoaWdobGlnaHRlZEluZGV4OiBoaWdobGlnaHRlZEluZGV4LFxuICAgIGlzT3BlbjogaXNPcGVuLFxuICAgIGl0ZW1SZWZzOiBpdGVtUmVmcyxcbiAgICBzY3JvbGxJbnRvVmlldzogc2Nyb2xsSW50b1ZpZXcsXG4gICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gIH0pO1xuXG4gIC8vIFNldHMgY2xlYW51cCBmb3IgdGhlIGtleXNTb0ZhciBjYWxsYmFjaywgZGVib3VuZGVkIGFmdGVyIDUwMG1zLlxuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIC8vIGluaXQgdGhlIGNsZWFuIGZ1bmN0aW9uIGhlcmUgYXMgd2UgbmVlZCBhY2Nlc3MgdG8gZGlzcGF0Y2guXG4gICAgY2xlYXJUaW1lb3V0UmVmLmN1cnJlbnQgPSBkZWJvdW5jZShmdW5jdGlvbiAob3V0ZXJEaXNwYXRjaCkge1xuICAgICAgb3V0ZXJEaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IEZ1bmN0aW9uU2V0SW5wdXRWYWx1ZSQxLFxuICAgICAgICBpbnB1dFZhbHVlOiAnJ1xuICAgICAgfSk7XG4gICAgfSwgNTAwKTtcblxuICAgIC8vIENhbmNlbCBhbnkgcGVuZGluZyBkZWJvdW5jZWQgY2FsbHMgb24gbW91bnRcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgY2xlYXJUaW1lb3V0UmVmLmN1cnJlbnQuY2FuY2VsKCk7XG4gICAgfTtcbiAgfSwgW10pO1xuXG4gIC8vIEludm9rZXMgdGhlIGtleXNTb0ZhciBjYWxsYmFjayBzZXQgdXAgYWJvdmUuXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFpbnB1dFZhbHVlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNsZWFyVGltZW91dFJlZi5jdXJyZW50KGRpc3BhdGNoKTtcbiAgfSwgW2Rpc3BhdGNoLCBpbnB1dFZhbHVlXSk7XG4gIHVzZUNvbnRyb2xQcm9wc1ZhbGlkYXRvcih7XG4gICAgaXNJbml0aWFsTW91bnQ6IGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQsXG4gICAgcHJvcHM6IHByb3BzLFxuICAgIHN0YXRlOiBzdGF0ZVxuICB9KTtcbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaXNJbml0aWFsTW91bnRSZWYuY3VycmVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBwcmV2aW91c1Jlc3VsdENvdW50UmVmLmN1cnJlbnQgPSBpdGVtcy5sZW5ndGg7XG4gIH0pO1xuICAvLyBBZGQgbW91c2UvdG91Y2ggZXZlbnRzIHRvIGRvY3VtZW50LlxuICB2YXIgbW91c2VBbmRUb3VjaFRyYWNrZXJzUmVmID0gdXNlTW91c2VBbmRUb3VjaFRyYWNrZXIoaXNPcGVuLCBbbWVudVJlZiwgdG9nZ2xlQnV0dG9uUmVmXSwgZW52aXJvbm1lbnQsIGZ1bmN0aW9uICgpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBUb2dnbGVCdXR0b25CbHVyXG4gICAgfSk7XG4gIH0pO1xuICB2YXIgc2V0R2V0dGVyUHJvcENhbGxJbmZvID0gdXNlR2V0dGVyUHJvcHNDYWxsZWRDaGVja2VyKCdnZXRNZW51UHJvcHMnLCAnZ2V0VG9nZ2xlQnV0dG9uUHJvcHMnKTtcbiAgLy8gTWFrZSBpbml0aWFsIHJlZiBmYWxzZS5cbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBpc0luaXRpYWxNb3VudFJlZi5jdXJyZW50ID0gZmFsc2U7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQgPSB0cnVlO1xuICAgIH07XG4gIH0sIFtdKTtcbiAgLy8gUmVzZXQgaXRlbVJlZnMgb24gY2xvc2UuXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFpc09wZW4pIHtcbiAgICAgIGl0ZW1SZWZzLmN1cnJlbnQgPSB7fTtcbiAgICB9XG4gIH0sIFtpc09wZW5dKTtcblxuICAvLyBFdmVudCBoYW5kbGVyIGZ1bmN0aW9ucy5cbiAgdmFyIHRvZ2dsZUJ1dHRvbktleURvd25IYW5kbGVycyA9IHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBBcnJvd0Rvd246IGZ1bmN0aW9uIEFycm93RG93bihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogVG9nZ2xlQnV0dG9uS2V5RG93bkFycm93RG93bixcbiAgICAgICAgICBnZXRJdGVtTm9kZUZyb21JbmRleDogZ2V0SXRlbU5vZGVGcm9tSW5kZXgsXG4gICAgICAgICAgYWx0S2V5OiBldmVudC5hbHRLZXlcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgQXJyb3dVcDogZnVuY3Rpb24gQXJyb3dVcChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogVG9nZ2xlQnV0dG9uS2V5RG93bkFycm93VXAsXG4gICAgICAgICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4LFxuICAgICAgICAgIGFsdEtleTogZXZlbnQuYWx0S2V5XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIEhvbWU6IGZ1bmN0aW9uIEhvbWUoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IFRvZ2dsZUJ1dHRvbktleURvd25Ib21lLFxuICAgICAgICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4OiBnZXRJdGVtTm9kZUZyb21JbmRleFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBFbmQ6IGZ1bmN0aW9uIEVuZChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogVG9nZ2xlQnV0dG9uS2V5RG93bkVuZCxcbiAgICAgICAgICBnZXRJdGVtTm9kZUZyb21JbmRleDogZ2V0SXRlbU5vZGVGcm9tSW5kZXhcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgRXNjYXBlOiBmdW5jdGlvbiBFc2NhcGUoKSB7XG4gICAgICAgIGlmIChsYXRlc3QuY3VycmVudC5zdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBUb2dnbGVCdXR0b25LZXlEb3duRXNjYXBlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBFbnRlcjogZnVuY3Rpb24gRW50ZXIoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IGxhdGVzdC5jdXJyZW50LnN0YXRlLmlzT3BlbiA/IFRvZ2dsZUJ1dHRvbktleURvd25FbnRlciA6IFRvZ2dsZUJ1dHRvbkNsaWNrJDFcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgUGFnZVVwOiBmdW5jdGlvbiBQYWdlVXAoZXZlbnQpIHtcbiAgICAgICAgaWYgKGxhdGVzdC5jdXJyZW50LnN0YXRlLmlzT3Blbikge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogVG9nZ2xlQnV0dG9uS2V5RG93blBhZ2VVcCxcbiAgICAgICAgICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4OiBnZXRJdGVtTm9kZUZyb21JbmRleFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgUGFnZURvd246IGZ1bmN0aW9uIFBhZ2VEb3duKGV2ZW50KSB7XG4gICAgICAgIGlmIChsYXRlc3QuY3VycmVudC5zdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IFRvZ2dsZUJ1dHRvbktleURvd25QYWdlRG93bixcbiAgICAgICAgICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4OiBnZXRJdGVtTm9kZUZyb21JbmRleFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJyAnOiBmdW5jdGlvbiBfKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBjdXJyZW50U3RhdGUgPSBsYXRlc3QuY3VycmVudC5zdGF0ZTtcbiAgICAgICAgaWYgKCFjdXJyZW50U3RhdGUuaXNPcGVuKSB7XG4gICAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgICAgdHlwZTogVG9nZ2xlQnV0dG9uQ2xpY2skMVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3VycmVudFN0YXRlLmlucHV0VmFsdWUpIHtcbiAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBUb2dnbGVCdXR0b25LZXlEb3duQ2hhcmFjdGVyLFxuICAgICAgICAgICAga2V5OiAnICcsXG4gICAgICAgICAgICBnZXRJdGVtTm9kZUZyb21JbmRleDogZ2V0SXRlbU5vZGVGcm9tSW5kZXhcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBUb2dnbGVCdXR0b25LZXlEb3duU3BhY2VCdXR0b25cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH0sIFtkaXNwYXRjaCwgZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIGxhdGVzdF0pO1xuXG4gIC8vIEFjdGlvbiBmdW5jdGlvbnMuXG4gIHZhciB0b2dnbGVNZW51ID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uVG9nZ2xlTWVudSQxXG4gICAgfSk7XG4gIH0sIFtkaXNwYXRjaF0pO1xuICB2YXIgY2xvc2VNZW51ID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uQ2xvc2VNZW51JDFcbiAgICB9KTtcbiAgfSwgW2Rpc3BhdGNoXSk7XG4gIHZhciBvcGVuTWVudSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICgpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBGdW5jdGlvbk9wZW5NZW51JDFcbiAgICB9KTtcbiAgfSwgW2Rpc3BhdGNoXSk7XG4gIHZhciBzZXRIaWdobGlnaHRlZEluZGV4ID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKG5ld0hpZ2hsaWdodGVkSW5kZXgpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBGdW5jdGlvblNldEhpZ2hsaWdodGVkSW5kZXgkMSxcbiAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IG5ld0hpZ2hsaWdodGVkSW5kZXhcbiAgICB9KTtcbiAgfSwgW2Rpc3BhdGNoXSk7XG4gIHZhciBzZWxlY3RJdGVtID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKG5ld1NlbGVjdGVkSXRlbSkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uU2VsZWN0SXRlbSQxLFxuICAgICAgc2VsZWN0ZWRJdGVtOiBuZXdTZWxlY3RlZEl0ZW1cbiAgICB9KTtcbiAgfSwgW2Rpc3BhdGNoXSk7XG4gIHZhciByZXNldCA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uICgpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBGdW5jdGlvblJlc2V0JDJcbiAgICB9KTtcbiAgfSwgW2Rpc3BhdGNoXSk7XG4gIHZhciBzZXRJbnB1dFZhbHVlID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKG5ld0lucHV0VmFsdWUpIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBGdW5jdGlvblNldElucHV0VmFsdWUkMSxcbiAgICAgIGlucHV0VmFsdWU6IG5ld0lucHV0VmFsdWVcbiAgICB9KTtcbiAgfSwgW2Rpc3BhdGNoXSk7XG4gIC8vIEdldHRlciBmdW5jdGlvbnMuXG4gIHZhciBnZXRMYWJlbFByb3BzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGxhYmVsUHJvcHMpIHtcbiAgICByZXR1cm4gX2V4dGVuZHMoe1xuICAgICAgaWQ6IGVsZW1lbnRJZHMubGFiZWxJZCxcbiAgICAgIGh0bWxGb3I6IGVsZW1lbnRJZHMudG9nZ2xlQnV0dG9uSWRcbiAgICB9LCBsYWJlbFByb3BzKTtcbiAgfSwgW2VsZW1lbnRJZHNdKTtcbiAgdmFyIGdldE1lbnVQcm9wcyA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChfdGVtcCwgX3RlbXAyKSB7XG4gICAgdmFyIF9leHRlbmRzMjtcbiAgICB2YXIgX3JlZiA9IF90ZW1wID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wLFxuICAgICAgb25Nb3VzZUxlYXZlID0gX3JlZi5vbk1vdXNlTGVhdmUsXG4gICAgICBfcmVmJHJlZktleSA9IF9yZWYucmVmS2V5LFxuICAgICAgcmVmS2V5ID0gX3JlZiRyZWZLZXkgPT09IHZvaWQgMCA/ICdyZWYnIDogX3JlZiRyZWZLZXk7XG4gICAgICBfcmVmLm9uS2V5RG93bjtcbiAgICAgIF9yZWYub25CbHVyO1xuICAgICAgdmFyIHJlZiA9IF9yZWYucmVmLFxuICAgICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWYsIF9leGNsdWRlZCQyKTtcbiAgICB2YXIgX3JlZjIgPSBfdGVtcDIgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAyLFxuICAgICAgX3JlZjIkc3VwcHJlc3NSZWZFcnJvID0gX3JlZjIuc3VwcHJlc3NSZWZFcnJvcixcbiAgICAgIHN1cHByZXNzUmVmRXJyb3IgPSBfcmVmMiRzdXBwcmVzc1JlZkVycm8gPT09IHZvaWQgMCA/IGZhbHNlIDogX3JlZjIkc3VwcHJlc3NSZWZFcnJvO1xuICAgIHZhciBtZW51SGFuZGxlTW91c2VMZWF2ZSA9IGZ1bmN0aW9uIG1lbnVIYW5kbGVNb3VzZUxlYXZlKCkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBNZW51TW91c2VMZWF2ZSQxXG4gICAgICB9KTtcbiAgICB9O1xuICAgIHNldEdldHRlclByb3BDYWxsSW5mbygnZ2V0TWVudVByb3BzJywgc3VwcHJlc3NSZWZFcnJvciwgcmVmS2V5LCBtZW51UmVmKTtcbiAgICByZXR1cm4gX2V4dGVuZHMoKF9leHRlbmRzMiA9IHt9LCBfZXh0ZW5kczJbcmVmS2V5XSA9IGhhbmRsZVJlZnMocmVmLCBmdW5jdGlvbiAobWVudU5vZGUpIHtcbiAgICAgIG1lbnVSZWYuY3VycmVudCA9IG1lbnVOb2RlO1xuICAgIH0pLCBfZXh0ZW5kczIuaWQgPSBlbGVtZW50SWRzLm1lbnVJZCwgX2V4dGVuZHMyLnJvbGUgPSAnbGlzdGJveCcsIF9leHRlbmRzMlsnYXJpYS1sYWJlbGxlZGJ5J10gPSByZXN0ICYmIHJlc3RbJ2FyaWEtbGFiZWwnXSA/IHVuZGVmaW5lZCA6IFwiXCIgKyBlbGVtZW50SWRzLmxhYmVsSWQsIF9leHRlbmRzMi5vbk1vdXNlTGVhdmUgPSBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbk1vdXNlTGVhdmUsIG1lbnVIYW5kbGVNb3VzZUxlYXZlKSwgX2V4dGVuZHMyKSwgcmVzdCk7XG4gIH0sIFtkaXNwYXRjaCwgc2V0R2V0dGVyUHJvcENhbGxJbmZvLCBlbGVtZW50SWRzXSk7XG4gIHZhciBnZXRUb2dnbGVCdXR0b25Qcm9wcyA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChfdGVtcDMsIF90ZW1wNCkge1xuICAgIHZhciBfZXh0ZW5kczM7XG4gICAgdmFyIF9yZWYzID0gX3RlbXAzID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wMyxcbiAgICAgIG9uQmx1ciA9IF9yZWYzLm9uQmx1cixcbiAgICAgIG9uQ2xpY2sgPSBfcmVmMy5vbkNsaWNrO1xuICAgICAgX3JlZjMub25QcmVzcztcbiAgICAgIHZhciBvbktleURvd24gPSBfcmVmMy5vbktleURvd24sXG4gICAgICBfcmVmMyRyZWZLZXkgPSBfcmVmMy5yZWZLZXksXG4gICAgICByZWZLZXkgPSBfcmVmMyRyZWZLZXkgPT09IHZvaWQgMCA/ICdyZWYnIDogX3JlZjMkcmVmS2V5LFxuICAgICAgcmVmID0gX3JlZjMucmVmLFxuICAgICAgcmVzdCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWYzLCBfZXhjbHVkZWQyJDIpO1xuICAgIHZhciBfcmVmNCA9IF90ZW1wNCA9PT0gdm9pZCAwID8ge30gOiBfdGVtcDQsXG4gICAgICBfcmVmNCRzdXBwcmVzc1JlZkVycm8gPSBfcmVmNC5zdXBwcmVzc1JlZkVycm9yLFxuICAgICAgc3VwcHJlc3NSZWZFcnJvciA9IF9yZWY0JHN1cHByZXNzUmVmRXJybyA9PT0gdm9pZCAwID8gZmFsc2UgOiBfcmVmNCRzdXBwcmVzc1JlZkVycm87XG4gICAgdmFyIGxhdGVzdFN0YXRlID0gbGF0ZXN0LmN1cnJlbnQuc3RhdGU7XG4gICAgdmFyIHRvZ2dsZUJ1dHRvbkhhbmRsZUNsaWNrID0gZnVuY3Rpb24gdG9nZ2xlQnV0dG9uSGFuZGxlQ2xpY2soKSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IFRvZ2dsZUJ1dHRvbkNsaWNrJDFcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIHRvZ2dsZUJ1dHRvbkhhbmRsZUJsdXIgPSBmdW5jdGlvbiB0b2dnbGVCdXR0b25IYW5kbGVCbHVyKCkge1xuICAgICAgaWYgKGxhdGVzdFN0YXRlLmlzT3BlbiAmJiAhbW91c2VBbmRUb3VjaFRyYWNrZXJzUmVmLmN1cnJlbnQuaXNNb3VzZURvd24pIHtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IFRvZ2dsZUJ1dHRvbkJsdXJcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgdG9nZ2xlQnV0dG9uSGFuZGxlS2V5RG93biA9IGZ1bmN0aW9uIHRvZ2dsZUJ1dHRvbkhhbmRsZUtleURvd24oZXZlbnQpIHtcbiAgICAgIHZhciBrZXkgPSBub3JtYWxpemVBcnJvd0tleShldmVudCk7XG4gICAgICBpZiAoa2V5ICYmIHRvZ2dsZUJ1dHRvbktleURvd25IYW5kbGVyc1trZXldKSB7XG4gICAgICAgIHRvZ2dsZUJ1dHRvbktleURvd25IYW5kbGVyc1trZXldKGV2ZW50KTtcbiAgICAgIH0gZWxzZSBpZiAoaXNBY2NlcHRlZENoYXJhY3RlcktleShrZXkpKSB7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBUb2dnbGVCdXR0b25LZXlEb3duQ2hhcmFjdGVyLFxuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4OiBnZXRJdGVtTm9kZUZyb21JbmRleFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciB0b2dnbGVQcm9wcyA9IF9leHRlbmRzKChfZXh0ZW5kczMgPSB7fSwgX2V4dGVuZHMzW3JlZktleV0gPSBoYW5kbGVSZWZzKHJlZiwgZnVuY3Rpb24gKHRvZ2dsZUJ1dHRvbk5vZGUpIHtcbiAgICAgIHRvZ2dsZUJ1dHRvblJlZi5jdXJyZW50ID0gdG9nZ2xlQnV0dG9uTm9kZTtcbiAgICB9KSwgX2V4dGVuZHMzWydhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnXSA9IGxhdGVzdFN0YXRlLmlzT3BlbiAmJiBsYXRlc3RTdGF0ZS5oaWdobGlnaHRlZEluZGV4ID4gLTEgPyBlbGVtZW50SWRzLmdldEl0ZW1JZChsYXRlc3RTdGF0ZS5oaWdobGlnaHRlZEluZGV4KSA6ICcnLCBfZXh0ZW5kczNbJ2FyaWEtY29udHJvbHMnXSA9IGVsZW1lbnRJZHMubWVudUlkLCBfZXh0ZW5kczNbJ2FyaWEtZXhwYW5kZWQnXSA9IGxhdGVzdC5jdXJyZW50LnN0YXRlLmlzT3BlbiwgX2V4dGVuZHMzWydhcmlhLWhhc3BvcHVwJ10gPSAnbGlzdGJveCcsIF9leHRlbmRzM1snYXJpYS1sYWJlbGxlZGJ5J10gPSByZXN0ICYmIHJlc3RbJ2FyaWEtbGFiZWwnXSA/IHVuZGVmaW5lZCA6IFwiXCIgKyBlbGVtZW50SWRzLmxhYmVsSWQsIF9leHRlbmRzMy5pZCA9IGVsZW1lbnRJZHMudG9nZ2xlQnV0dG9uSWQsIF9leHRlbmRzMy5yb2xlID0gJ2NvbWJvYm94JywgX2V4dGVuZHMzLnRhYkluZGV4ID0gMCwgX2V4dGVuZHMzLm9uQmx1ciA9IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uQmx1ciwgdG9nZ2xlQnV0dG9uSGFuZGxlQmx1ciksIF9leHRlbmRzMyksIHJlc3QpO1xuICAgIGlmICghcmVzdC5kaXNhYmxlZCkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmIChyZWFjdC1uYXRpdmUpICovXG4gICAgICB7XG4gICAgICAgIHRvZ2dsZVByb3BzLm9uQ2xpY2sgPSBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbkNsaWNrLCB0b2dnbGVCdXR0b25IYW5kbGVDbGljayk7XG4gICAgICAgIHRvZ2dsZVByb3BzLm9uS2V5RG93biA9IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uS2V5RG93biwgdG9nZ2xlQnV0dG9uSGFuZGxlS2V5RG93bik7XG4gICAgICB9XG4gICAgfVxuICAgIHNldEdldHRlclByb3BDYWxsSW5mbygnZ2V0VG9nZ2xlQnV0dG9uUHJvcHMnLCBzdXBwcmVzc1JlZkVycm9yLCByZWZLZXksIHRvZ2dsZUJ1dHRvblJlZik7XG4gICAgcmV0dXJuIHRvZ2dsZVByb3BzO1xuICB9LCBbbGF0ZXN0LCBlbGVtZW50SWRzLCBzZXRHZXR0ZXJQcm9wQ2FsbEluZm8sIGRpc3BhdGNoLCBtb3VzZUFuZFRvdWNoVHJhY2tlcnNSZWYsIHRvZ2dsZUJ1dHRvbktleURvd25IYW5kbGVycywgZ2V0SXRlbU5vZGVGcm9tSW5kZXhdKTtcbiAgdmFyIGdldEl0ZW1Qcm9wcyA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChfdGVtcDUpIHtcbiAgICB2YXIgX2V4dGVuZHM0O1xuICAgIHZhciBfcmVmNSA9IF90ZW1wNSA9PT0gdm9pZCAwID8ge30gOiBfdGVtcDUsXG4gICAgICBpdGVtUHJvcCA9IF9yZWY1Lml0ZW0sXG4gICAgICBpbmRleFByb3AgPSBfcmVmNS5pbmRleCxcbiAgICAgIG9uTW91c2VNb3ZlID0gX3JlZjUub25Nb3VzZU1vdmUsXG4gICAgICBvbkNsaWNrID0gX3JlZjUub25DbGljaztcbiAgICAgIF9yZWY1Lm9uUHJlc3M7XG4gICAgICB2YXIgX3JlZjUkcmVmS2V5ID0gX3JlZjUucmVmS2V5LFxuICAgICAgcmVmS2V5ID0gX3JlZjUkcmVmS2V5ID09PSB2b2lkIDAgPyAncmVmJyA6IF9yZWY1JHJlZktleSxcbiAgICAgIHJlZiA9IF9yZWY1LnJlZixcbiAgICAgIGRpc2FibGVkID0gX3JlZjUuZGlzYWJsZWQsXG4gICAgICByZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZjUsIF9leGNsdWRlZDMkMSk7XG4gICAgdmFyIF9sYXRlc3QkY3VycmVudCA9IGxhdGVzdC5jdXJyZW50LFxuICAgICAgbGF0ZXN0U3RhdGUgPSBfbGF0ZXN0JGN1cnJlbnQuc3RhdGUsXG4gICAgICBsYXRlc3RQcm9wcyA9IF9sYXRlc3QkY3VycmVudC5wcm9wcztcbiAgICB2YXIgX2dldEl0ZW1BbmRJbmRleCA9IGdldEl0ZW1BbmRJbmRleChpdGVtUHJvcCwgaW5kZXhQcm9wLCBsYXRlc3RQcm9wcy5pdGVtcywgJ1Bhc3MgZWl0aGVyIGl0ZW0gb3IgaW5kZXggdG8gZ2V0SXRlbVByb3BzIScpLFxuICAgICAgaXRlbSA9IF9nZXRJdGVtQW5kSW5kZXhbMF0sXG4gICAgICBpbmRleCA9IF9nZXRJdGVtQW5kSW5kZXhbMV07XG4gICAgdmFyIGl0ZW1IYW5kbGVNb3VzZU1vdmUgPSBmdW5jdGlvbiBpdGVtSGFuZGxlTW91c2VNb3ZlKCkge1xuICAgICAgaWYgKGluZGV4ID09PSBsYXRlc3RTdGF0ZS5oaWdobGlnaHRlZEluZGV4KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNob3VsZFNjcm9sbFJlZi5jdXJyZW50ID0gZmFsc2U7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IEl0ZW1Nb3VzZU1vdmUkMSxcbiAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICBkaXNhYmxlZDogZGlzYWJsZWRcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIGl0ZW1IYW5kbGVDbGljayA9IGZ1bmN0aW9uIGl0ZW1IYW5kbGVDbGljaygpIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogSXRlbUNsaWNrJDEsXG4gICAgICAgIGluZGV4OiBpbmRleFxuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgaXRlbVByb3BzID0gX2V4dGVuZHMoKF9leHRlbmRzNCA9IHtcbiAgICAgIGRpc2FibGVkOiBkaXNhYmxlZCxcbiAgICAgIHJvbGU6ICdvcHRpb24nLFxuICAgICAgJ2FyaWEtc2VsZWN0ZWQnOiBcIlwiICsgKGl0ZW0gPT09IHNlbGVjdGVkSXRlbSksXG4gICAgICBpZDogZWxlbWVudElkcy5nZXRJdGVtSWQoaW5kZXgpXG4gICAgfSwgX2V4dGVuZHM0W3JlZktleV0gPSBoYW5kbGVSZWZzKHJlZiwgZnVuY3Rpb24gKGl0ZW1Ob2RlKSB7XG4gICAgICBpZiAoaXRlbU5vZGUpIHtcbiAgICAgICAgaXRlbVJlZnMuY3VycmVudFtlbGVtZW50SWRzLmdldEl0ZW1JZChpbmRleCldID0gaXRlbU5vZGU7XG4gICAgICB9XG4gICAgfSksIF9leHRlbmRzNCksIHJlc3QpO1xuICAgIGlmICghZGlzYWJsZWQpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0IChyZWFjdC1uYXRpdmUpICovXG4gICAgICB7XG4gICAgICAgIGl0ZW1Qcm9wcy5vbkNsaWNrID0gY2FsbEFsbEV2ZW50SGFuZGxlcnMob25DbGljaywgaXRlbUhhbmRsZUNsaWNrKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaXRlbVByb3BzLm9uTW91c2VNb3ZlID0gY2FsbEFsbEV2ZW50SGFuZGxlcnMob25Nb3VzZU1vdmUsIGl0ZW1IYW5kbGVNb3VzZU1vdmUpO1xuICAgIHJldHVybiBpdGVtUHJvcHM7XG4gIH0sIFtsYXRlc3QsIHNlbGVjdGVkSXRlbSwgZWxlbWVudElkcywgc2hvdWxkU2Nyb2xsUmVmLCBkaXNwYXRjaF0pO1xuICByZXR1cm4ge1xuICAgIC8vIHByb3AgZ2V0dGVycy5cbiAgICBnZXRUb2dnbGVCdXR0b25Qcm9wczogZ2V0VG9nZ2xlQnV0dG9uUHJvcHMsXG4gICAgZ2V0TGFiZWxQcm9wczogZ2V0TGFiZWxQcm9wcyxcbiAgICBnZXRNZW51UHJvcHM6IGdldE1lbnVQcm9wcyxcbiAgICBnZXRJdGVtUHJvcHM6IGdldEl0ZW1Qcm9wcyxcbiAgICAvLyBhY3Rpb25zLlxuICAgIHRvZ2dsZU1lbnU6IHRvZ2dsZU1lbnUsXG4gICAgb3Blbk1lbnU6IG9wZW5NZW51LFxuICAgIGNsb3NlTWVudTogY2xvc2VNZW51LFxuICAgIHNldEhpZ2hsaWdodGVkSW5kZXg6IHNldEhpZ2hsaWdodGVkSW5kZXgsXG4gICAgc2VsZWN0SXRlbTogc2VsZWN0SXRlbSxcbiAgICByZXNldDogcmVzZXQsXG4gICAgc2V0SW5wdXRWYWx1ZTogc2V0SW5wdXRWYWx1ZSxcbiAgICAvLyBzdGF0ZS5cbiAgICBoaWdobGlnaHRlZEluZGV4OiBoaWdobGlnaHRlZEluZGV4LFxuICAgIGlzT3BlbjogaXNPcGVuLFxuICAgIHNlbGVjdGVkSXRlbTogc2VsZWN0ZWRJdGVtLFxuICAgIGlucHV0VmFsdWU6IGlucHV0VmFsdWVcbiAgfTtcbn1cblxudmFyIElucHV0S2V5RG93bkFycm93RG93biA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2lucHV0X2tleWRvd25fYXJyb3dfZG93bl9fJyA6IDA7XG52YXIgSW5wdXRLZXlEb3duQXJyb3dVcCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2lucHV0X2tleWRvd25fYXJyb3dfdXBfXycgOiAxO1xudmFyIElucHV0S2V5RG93bkVzY2FwZSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2lucHV0X2tleWRvd25fZXNjYXBlX18nIDogMjtcbnZhciBJbnB1dEtleURvd25Ib21lID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19faW5wdXRfa2V5ZG93bl9ob21lX18nIDogMztcbnZhciBJbnB1dEtleURvd25FbmQgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19pbnB1dF9rZXlkb3duX2VuZF9fJyA6IDQ7XG52YXIgSW5wdXRLZXlEb3duUGFnZVVwID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19faW5wdXRfa2V5ZG93bl9wYWdlX3VwX18nIDogNTtcbnZhciBJbnB1dEtleURvd25QYWdlRG93biA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2lucHV0X2tleWRvd25fcGFnZV9kb3duX18nIDogNjtcbnZhciBJbnB1dEtleURvd25FbnRlciA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2lucHV0X2tleWRvd25fZW50ZXJfXycgOiA3O1xudmFyIElucHV0Q2hhbmdlID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19faW5wdXRfY2hhbmdlX18nIDogODtcbnZhciBJbnB1dEJsdXIgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19pbnB1dF9ibHVyX18nIDogOTtcbnZhciBJbnB1dEZvY3VzID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19faW5wdXRfZm9jdXNfXycgOiAxMDtcbnZhciBNZW51TW91c2VMZWF2ZSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX21lbnVfbW91c2VfbGVhdmVfXycgOiAxMTtcbnZhciBJdGVtTW91c2VNb3ZlID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19faXRlbV9tb3VzZV9tb3ZlX18nIDogMTI7XG52YXIgSXRlbUNsaWNrID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19faXRlbV9jbGlja19fJyA6IDEzO1xudmFyIFRvZ2dsZUJ1dHRvbkNsaWNrID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fdG9nZ2xlYnV0dG9uX2NsaWNrX18nIDogMTQ7XG52YXIgRnVuY3Rpb25Ub2dnbGVNZW51ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fZnVuY3Rpb25fdG9nZ2xlX21lbnVfXycgOiAxNTtcbnZhciBGdW5jdGlvbk9wZW5NZW51ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fZnVuY3Rpb25fb3Blbl9tZW51X18nIDogMTY7XG52YXIgRnVuY3Rpb25DbG9zZU1lbnUgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9jbG9zZV9tZW51X18nIDogMTc7XG52YXIgRnVuY3Rpb25TZXRIaWdobGlnaHRlZEluZGV4ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fZnVuY3Rpb25fc2V0X2hpZ2hsaWdodGVkX2luZGV4X18nIDogMTg7XG52YXIgRnVuY3Rpb25TZWxlY3RJdGVtID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fZnVuY3Rpb25fc2VsZWN0X2l0ZW1fXycgOiAxOTtcbnZhciBGdW5jdGlvblNldElucHV0VmFsdWUgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9zZXRfaW5wdXRfdmFsdWVfXycgOiAyMDtcbnZhciBGdW5jdGlvblJlc2V0JDEgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9yZXNldF9fJyA6IDIxO1xudmFyIENvbnRyb2xsZWRQcm9wVXBkYXRlZFNlbGVjdGVkSXRlbSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2NvbnRyb2xsZWRfcHJvcF91cGRhdGVkX3NlbGVjdGVkX2l0ZW1fXycgOiAyMjtcblxudmFyIHN0YXRlQ2hhbmdlVHlwZXMkMSA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgX19wcm90b19fOiBudWxsLFxuICBJbnB1dEtleURvd25BcnJvd0Rvd246IElucHV0S2V5RG93bkFycm93RG93bixcbiAgSW5wdXRLZXlEb3duQXJyb3dVcDogSW5wdXRLZXlEb3duQXJyb3dVcCxcbiAgSW5wdXRLZXlEb3duRXNjYXBlOiBJbnB1dEtleURvd25Fc2NhcGUsXG4gIElucHV0S2V5RG93bkhvbWU6IElucHV0S2V5RG93bkhvbWUsXG4gIElucHV0S2V5RG93bkVuZDogSW5wdXRLZXlEb3duRW5kLFxuICBJbnB1dEtleURvd25QYWdlVXA6IElucHV0S2V5RG93blBhZ2VVcCxcbiAgSW5wdXRLZXlEb3duUGFnZURvd246IElucHV0S2V5RG93blBhZ2VEb3duLFxuICBJbnB1dEtleURvd25FbnRlcjogSW5wdXRLZXlEb3duRW50ZXIsXG4gIElucHV0Q2hhbmdlOiBJbnB1dENoYW5nZSxcbiAgSW5wdXRCbHVyOiBJbnB1dEJsdXIsXG4gIElucHV0Rm9jdXM6IElucHV0Rm9jdXMsXG4gIE1lbnVNb3VzZUxlYXZlOiBNZW51TW91c2VMZWF2ZSxcbiAgSXRlbU1vdXNlTW92ZTogSXRlbU1vdXNlTW92ZSxcbiAgSXRlbUNsaWNrOiBJdGVtQ2xpY2ssXG4gIFRvZ2dsZUJ1dHRvbkNsaWNrOiBUb2dnbGVCdXR0b25DbGljayxcbiAgRnVuY3Rpb25Ub2dnbGVNZW51OiBGdW5jdGlvblRvZ2dsZU1lbnUsXG4gIEZ1bmN0aW9uT3Blbk1lbnU6IEZ1bmN0aW9uT3Blbk1lbnUsXG4gIEZ1bmN0aW9uQ2xvc2VNZW51OiBGdW5jdGlvbkNsb3NlTWVudSxcbiAgRnVuY3Rpb25TZXRIaWdobGlnaHRlZEluZGV4OiBGdW5jdGlvblNldEhpZ2hsaWdodGVkSW5kZXgsXG4gIEZ1bmN0aW9uU2VsZWN0SXRlbTogRnVuY3Rpb25TZWxlY3RJdGVtLFxuICBGdW5jdGlvblNldElucHV0VmFsdWU6IEZ1bmN0aW9uU2V0SW5wdXRWYWx1ZSxcbiAgRnVuY3Rpb25SZXNldDogRnVuY3Rpb25SZXNldCQxLFxuICBDb250cm9sbGVkUHJvcFVwZGF0ZWRTZWxlY3RlZEl0ZW06IENvbnRyb2xsZWRQcm9wVXBkYXRlZFNlbGVjdGVkSXRlbVxufSk7XG5cbmZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSQxKHByb3BzKSB7XG4gIHZhciBpbml0aWFsU3RhdGUgPSBnZXRJbml0aWFsU3RhdGUkMihwcm9wcyk7XG4gIHZhciBzZWxlY3RlZEl0ZW0gPSBpbml0aWFsU3RhdGUuc2VsZWN0ZWRJdGVtO1xuICB2YXIgaW5wdXRWYWx1ZSA9IGluaXRpYWxTdGF0ZS5pbnB1dFZhbHVlO1xuICBpZiAoaW5wdXRWYWx1ZSA9PT0gJycgJiYgc2VsZWN0ZWRJdGVtICYmIHByb3BzLmRlZmF1bHRJbnB1dFZhbHVlID09PSB1bmRlZmluZWQgJiYgcHJvcHMuaW5pdGlhbElucHV0VmFsdWUgPT09IHVuZGVmaW5lZCAmJiBwcm9wcy5pbnB1dFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICBpbnB1dFZhbHVlID0gcHJvcHMuaXRlbVRvU3RyaW5nKHNlbGVjdGVkSXRlbSk7XG4gIH1cbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBpbml0aWFsU3RhdGUsIHtcbiAgICBpbnB1dFZhbHVlOiBpbnB1dFZhbHVlXG4gIH0pO1xufVxudmFyIHByb3BUeXBlcyQxID0ge1xuICBpdGVtczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIGl0ZW1Ub1N0cmluZzogUHJvcFR5cGVzLmZ1bmMsXG4gIHNlbGVjdGVkSXRlbUNoYW5nZWQ6IFByb3BUeXBlcy5mdW5jLFxuICBnZXRBMTF5U3RhdHVzTWVzc2FnZTogUHJvcFR5cGVzLmZ1bmMsXG4gIGdldEExMXlTZWxlY3Rpb25NZXNzYWdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgaGlnaGxpZ2h0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gIGluaXRpYWxIaWdobGlnaHRlZEluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICBpc09wZW46IFByb3BUeXBlcy5ib29sLFxuICBkZWZhdWx0SXNPcGVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgaW5pdGlhbElzT3BlbjogUHJvcFR5cGVzLmJvb2wsXG4gIHNlbGVjdGVkSXRlbTogUHJvcFR5cGVzLmFueSxcbiAgaW5pdGlhbFNlbGVjdGVkSXRlbTogUHJvcFR5cGVzLmFueSxcbiAgZGVmYXVsdFNlbGVjdGVkSXRlbTogUHJvcFR5cGVzLmFueSxcbiAgaW5wdXRWYWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgZGVmYXVsdElucHV0VmFsdWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGluaXRpYWxJbnB1dFZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgbGFiZWxJZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgbWVudUlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBnZXRJdGVtSWQ6IFByb3BUeXBlcy5mdW5jLFxuICBpbnB1dElkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICB0b2dnbGVCdXR0b25JZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgc3RhdGVSZWR1Y2VyOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25TZWxlY3RlZEl0ZW1DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvbkhpZ2hsaWdodGVkSW5kZXhDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvblN0YXRlQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25Jc09wZW5DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvbklucHV0VmFsdWVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBlbnZpcm9ubWVudDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICBhZGRFdmVudExpc3RlbmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICByZW1vdmVFdmVudExpc3RlbmVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBkb2N1bWVudDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGdldEVsZW1lbnRCeUlkOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgIGFjdGl2ZUVsZW1lbnQ6IFByb3BUeXBlcy5hbnksXG4gICAgICBib2R5OiBQcm9wVHlwZXMuYW55XG4gICAgfSlcbiAgfSlcbn07XG5cbi8qKlxuICogVGhlIHVzZUNvbWJvYm94IHZlcnNpb24gb2YgdXNlQ29udHJvbGxlZFJlZHVjZXIsIHdoaWNoIGFsc29cbiAqIGNoZWNrcyBpZiB0aGUgY29udHJvbGxlZCBwcm9wIHNlbGVjdGVkSXRlbSBjaGFuZ2VkIGJldHdlZW5cbiAqIHJlbmRlcnMuIElmIHNvLCBpdCB3aWxsIGFsc28gdXBkYXRlIGlucHV0VmFsdWUgd2l0aCBpdHNcbiAqIHN0cmluZyBlcXVpdmFsZW50LiBJdCB1c2VzIHRoZSBjb21tb24gdXNlRW5oYW5jZWRSZWR1Y2VyIHRvXG4gKiBjb21wdXRlIHRoZSByZXN0IG9mIHRoZSBzdGF0ZS5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWR1Y2VyIFJlZHVjZXIgZnVuY3Rpb24gZnJvbSBkb3duc2hpZnQuXG4gKiBAcGFyYW0ge09iamVjdH0gaW5pdGlhbFN0YXRlIEluaXRpYWwgc3RhdGUgb2YgdGhlIGhvb2suXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHMgVGhlIGhvb2sgcHJvcHMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IEFuIGFycmF5IHdpdGggdGhlIHN0YXRlIGFuZCBhbiBhY3Rpb24gZGlzcGF0Y2hlci5cbiAqL1xuZnVuY3Rpb24gdXNlQ29udHJvbGxlZFJlZHVjZXIocmVkdWNlciwgaW5pdGlhbFN0YXRlLCBwcm9wcykge1xuICB2YXIgcHJldmlvdXNTZWxlY3RlZEl0ZW1SZWYgPSB1c2VSZWYoKTtcbiAgdmFyIF91c2VFbmhhbmNlZFJlZHVjZXIgPSB1c2VFbmhhbmNlZFJlZHVjZXIocmVkdWNlciwgaW5pdGlhbFN0YXRlLCBwcm9wcyksXG4gICAgc3RhdGUgPSBfdXNlRW5oYW5jZWRSZWR1Y2VyWzBdLFxuICAgIGRpc3BhdGNoID0gX3VzZUVuaGFuY2VkUmVkdWNlclsxXTtcblxuICAvLyBUb0RvOiBpZiBuZWVkZWQsIG1ha2Ugc2FtZSBhcHByb2FjaCBhcyBzZWxlY3RlZEl0ZW1DaGFuZ2VkIGZyb20gRG93bnNoaWZ0LlxuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlmICghaXNDb250cm9sbGVkUHJvcChwcm9wcywgJ3NlbGVjdGVkSXRlbScpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwcm9wcy5zZWxlY3RlZEl0ZW1DaGFuZ2VkKHByZXZpb3VzU2VsZWN0ZWRJdGVtUmVmLmN1cnJlbnQsIHByb3BzLnNlbGVjdGVkSXRlbSkpIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogQ29udHJvbGxlZFByb3BVcGRhdGVkU2VsZWN0ZWRJdGVtLFxuICAgICAgICBpbnB1dFZhbHVlOiBwcm9wcy5pdGVtVG9TdHJpbmcocHJvcHMuc2VsZWN0ZWRJdGVtKVxuICAgICAgfSk7XG4gICAgfVxuICAgIHByZXZpb3VzU2VsZWN0ZWRJdGVtUmVmLmN1cnJlbnQgPSBzdGF0ZS5zZWxlY3RlZEl0ZW0gPT09IHByZXZpb3VzU2VsZWN0ZWRJdGVtUmVmLmN1cnJlbnQgPyBwcm9wcy5zZWxlY3RlZEl0ZW0gOiBzdGF0ZS5zZWxlY3RlZEl0ZW07XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICB9LCBbc3RhdGUuc2VsZWN0ZWRJdGVtLCBwcm9wcy5zZWxlY3RlZEl0ZW1dKTtcbiAgcmV0dXJuIFtnZXRTdGF0ZShzdGF0ZSwgcHJvcHMpLCBkaXNwYXRjaF07XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tbXV0YWJsZS1leHBvcnRzXG52YXIgdmFsaWRhdGVQcm9wVHlwZXMkMSA9IG5vb3A7XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFsaWRhdGVQcm9wVHlwZXMkMSA9IGZ1bmN0aW9uIHZhbGlkYXRlUHJvcFR5cGVzKG9wdGlvbnMsIGNhbGxlcikge1xuICAgIFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcyhwcm9wVHlwZXMkMSwgb3B0aW9ucywgJ3Byb3AnLCBjYWxsZXIubmFtZSk7XG4gIH07XG59XG52YXIgZGVmYXVsdFByb3BzJDEgPSBfZXh0ZW5kcyh7fSwgZGVmYXVsdFByb3BzJDMsIHtcbiAgc2VsZWN0ZWRJdGVtQ2hhbmdlZDogZnVuY3Rpb24gc2VsZWN0ZWRJdGVtQ2hhbmdlZChwcmV2SXRlbSwgaXRlbSkge1xuICAgIHJldHVybiBwcmV2SXRlbSAhPT0gaXRlbTtcbiAgfSxcbiAgZ2V0QTExeVN0YXR1c01lc3NhZ2U6IGdldEExMXlTdGF0dXNNZXNzYWdlJDFcbn0pO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5ICovXG5mdW5jdGlvbiBkb3duc2hpZnRVc2VDb21ib2JveFJlZHVjZXIoc3RhdGUsIGFjdGlvbikge1xuICB2YXIgX3Byb3BzJGl0ZW1zO1xuICB2YXIgdHlwZSA9IGFjdGlvbi50eXBlLFxuICAgIHByb3BzID0gYWN0aW9uLnByb3BzLFxuICAgIGFsdEtleSA9IGFjdGlvbi5hbHRLZXk7XG4gIHZhciBjaGFuZ2VzO1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIEl0ZW1DbGljazpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGlzT3BlbjogZ2V0RGVmYXVsdFZhbHVlJDEocHJvcHMsICdpc09wZW4nKSxcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0RGVmYXVsdFZhbHVlJDEocHJvcHMsICdoaWdobGlnaHRlZEluZGV4JyksXG4gICAgICAgIHNlbGVjdGVkSXRlbTogcHJvcHMuaXRlbXNbYWN0aW9uLmluZGV4XSxcbiAgICAgICAgaW5wdXRWYWx1ZTogcHJvcHMuaXRlbVRvU3RyaW5nKHByb3BzLml0ZW1zW2FjdGlvbi5pbmRleF0pXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBJbnB1dEtleURvd25BcnJvd0Rvd246XG4gICAgICBpZiAoc3RhdGUuaXNPcGVuKSB7XG4gICAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0TmV4dFdyYXBwaW5nSW5kZXgoMSwgc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCwgcHJvcHMuaXRlbXMubGVuZ3RoLCBhY3Rpb24uZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIHRydWUpXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGFuZ2VzID0ge1xuICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGFsdEtleSAmJiBzdGF0ZS5zZWxlY3RlZEl0ZW0gPT0gbnVsbCA/IC0xIDogZ2V0SGlnaGxpZ2h0ZWRJbmRleE9uT3Blbihwcm9wcywgc3RhdGUsIDEsIGFjdGlvbi5nZXRJdGVtTm9kZUZyb21JbmRleCksXG4gICAgICAgICAgaXNPcGVuOiBwcm9wcy5pdGVtcy5sZW5ndGggPj0gMFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBJbnB1dEtleURvd25BcnJvd1VwOlxuICAgICAgaWYgKHN0YXRlLmlzT3Blbikge1xuICAgICAgICBpZiAoYWx0S2V5KSB7XG4gICAgICAgICAgY2hhbmdlcyA9IGdldENoYW5nZXNPblNlbGVjdGlvbihwcm9wcywgc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGdldE5leHRXcmFwcGluZ0luZGV4KC0xLCBzdGF0ZS5oaWdobGlnaHRlZEluZGV4LCBwcm9wcy5pdGVtcy5sZW5ndGgsIGFjdGlvbi5nZXRJdGVtTm9kZUZyb21JbmRleCwgdHJ1ZSlcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGFuZ2VzID0ge1xuICAgICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGdldEhpZ2hsaWdodGVkSW5kZXhPbk9wZW4ocHJvcHMsIHN0YXRlLCAtMSwgYWN0aW9uLmdldEl0ZW1Ob2RlRnJvbUluZGV4KSxcbiAgICAgICAgICBpc09wZW46IHByb3BzLml0ZW1zLmxlbmd0aCA+PSAwXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIElucHV0S2V5RG93bkVudGVyOlxuICAgICAgY2hhbmdlcyA9IGdldENoYW5nZXNPblNlbGVjdGlvbihwcm9wcywgc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIElucHV0S2V5RG93bkVzY2FwZTpcbiAgICAgIGNoYW5nZXMgPSBfZXh0ZW5kcyh7XG4gICAgICAgIGlzT3BlbjogZmFsc2UsXG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IC0xXG4gICAgICB9LCAhc3RhdGUuaXNPcGVuICYmIHtcbiAgICAgICAgc2VsZWN0ZWRJdGVtOiBudWxsLFxuICAgICAgICBpbnB1dFZhbHVlOiAnJ1xuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIElucHV0S2V5RG93blBhZ2VVcDpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGdldE5leHRXcmFwcGluZ0luZGV4KC0xMCwgc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCwgcHJvcHMuaXRlbXMubGVuZ3RoLCBhY3Rpb24uZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIGZhbHNlKVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgSW5wdXRLZXlEb3duUGFnZURvd246XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBnZXROZXh0V3JhcHBpbmdJbmRleCgxMCwgc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCwgcHJvcHMuaXRlbXMubGVuZ3RoLCBhY3Rpb24uZ2V0SXRlbU5vZGVGcm9tSW5kZXgsIGZhbHNlKVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgSW5wdXRLZXlEb3duSG9tZTpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGdldE5leHROb25EaXNhYmxlZEluZGV4KDEsIDAsIHByb3BzLml0ZW1zLmxlbmd0aCwgYWN0aW9uLmdldEl0ZW1Ob2RlRnJvbUluZGV4LCBmYWxzZSlcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIElucHV0S2V5RG93bkVuZDpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IGdldE5leHROb25EaXNhYmxlZEluZGV4KC0xLCBwcm9wcy5pdGVtcy5sZW5ndGggLSAxLCBwcm9wcy5pdGVtcy5sZW5ndGgsIGFjdGlvbi5nZXRJdGVtTm9kZUZyb21JbmRleCwgZmFsc2UpXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBJbnB1dEJsdXI6XG4gICAgICBjaGFuZ2VzID0gX2V4dGVuZHMoe1xuICAgICAgICBpc09wZW46IGZhbHNlLFxuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiAtMVxuICAgICAgfSwgc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCA+PSAwICYmICgoX3Byb3BzJGl0ZW1zID0gcHJvcHMuaXRlbXMpID09IG51bGwgPyB2b2lkIDAgOiBfcHJvcHMkaXRlbXMubGVuZ3RoKSAmJiBhY3Rpb24uc2VsZWN0SXRlbSAmJiB7XG4gICAgICAgIHNlbGVjdGVkSXRlbTogcHJvcHMuaXRlbXNbc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleF0sXG4gICAgICAgIGlucHV0VmFsdWU6IHByb3BzLml0ZW1Ub1N0cmluZyhwcm9wcy5pdGVtc1tzdGF0ZS5oaWdobGlnaHRlZEluZGV4XSlcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBJbnB1dENoYW5nZTpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIGlzT3BlbjogdHJ1ZSxcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleDogZ2V0RGVmYXVsdFZhbHVlJDEocHJvcHMsICdoaWdobGlnaHRlZEluZGV4JyksXG4gICAgICAgIGlucHV0VmFsdWU6IGFjdGlvbi5pbnB1dFZhbHVlXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBJbnB1dEZvY3VzOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgaXNPcGVuOiB0cnVlLFxuICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBnZXRIaWdobGlnaHRlZEluZGV4T25PcGVuKHByb3BzLCBzdGF0ZSwgMClcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIEZ1bmN0aW9uU2VsZWN0SXRlbTpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIHNlbGVjdGVkSXRlbTogYWN0aW9uLnNlbGVjdGVkSXRlbSxcbiAgICAgICAgaW5wdXRWYWx1ZTogcHJvcHMuaXRlbVRvU3RyaW5nKGFjdGlvbi5zZWxlY3RlZEl0ZW0pXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBDb250cm9sbGVkUHJvcFVwZGF0ZWRTZWxlY3RlZEl0ZW06XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBpbnB1dFZhbHVlOiBhY3Rpb24uaW5wdXRWYWx1ZVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZG93bnNoaWZ0Q29tbW9uUmVkdWNlcihzdGF0ZSwgYWN0aW9uLCBzdGF0ZUNoYW5nZVR5cGVzJDEpO1xuICB9XG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgc3RhdGUsIGNoYW5nZXMpO1xufVxuLyogZXNsaW50LWVuYWJsZSBjb21wbGV4aXR5ICovXG5cbnZhciBfZXhjbHVkZWQkMSA9IFtcIm9uTW91c2VMZWF2ZVwiLCBcInJlZktleVwiLCBcInJlZlwiXSxcbiAgX2V4Y2x1ZGVkMiQxID0gW1wiaXRlbVwiLCBcImluZGV4XCIsIFwicmVmS2V5XCIsIFwicmVmXCIsIFwib25Nb3VzZU1vdmVcIiwgXCJvbk1vdXNlRG93blwiLCBcIm9uQ2xpY2tcIiwgXCJvblByZXNzXCIsIFwiZGlzYWJsZWRcIl0sXG4gIF9leGNsdWRlZDMgPSBbXCJvbkNsaWNrXCIsIFwib25QcmVzc1wiLCBcInJlZktleVwiLCBcInJlZlwiXSxcbiAgX2V4Y2x1ZGVkNCA9IFtcIm9uS2V5RG93blwiLCBcIm9uQ2hhbmdlXCIsIFwib25JbnB1dFwiLCBcIm9uRm9jdXNcIiwgXCJvbkJsdXJcIiwgXCJvbkNoYW5nZVRleHRcIiwgXCJyZWZLZXlcIiwgXCJyZWZcIl07XG51c2VDb21ib2JveC5zdGF0ZUNoYW5nZVR5cGVzID0gc3RhdGVDaGFuZ2VUeXBlcyQxO1xuZnVuY3Rpb24gdXNlQ29tYm9ib3godXNlclByb3BzKSB7XG4gIGlmICh1c2VyUHJvcHMgPT09IHZvaWQgMCkge1xuICAgIHVzZXJQcm9wcyA9IHt9O1xuICB9XG4gIHZhbGlkYXRlUHJvcFR5cGVzJDEodXNlclByb3BzLCB1c2VDb21ib2JveCk7XG4gIC8vIFByb3BzIGRlZmF1bHRzIGFuZCBkZXN0cnVjdHVyaW5nLlxuICB2YXIgcHJvcHMgPSBfZXh0ZW5kcyh7fSwgZGVmYXVsdFByb3BzJDEsIHVzZXJQcm9wcyk7XG4gIHZhciBpbml0aWFsSXNPcGVuID0gcHJvcHMuaW5pdGlhbElzT3BlbixcbiAgICBkZWZhdWx0SXNPcGVuID0gcHJvcHMuZGVmYXVsdElzT3BlbixcbiAgICBpdGVtcyA9IHByb3BzLml0ZW1zLFxuICAgIHNjcm9sbEludG9WaWV3ID0gcHJvcHMuc2Nyb2xsSW50b1ZpZXcsXG4gICAgZW52aXJvbm1lbnQgPSBwcm9wcy5lbnZpcm9ubWVudCxcbiAgICBnZXRBMTF5U3RhdHVzTWVzc2FnZSA9IHByb3BzLmdldEExMXlTdGF0dXNNZXNzYWdlLFxuICAgIGdldEExMXlTZWxlY3Rpb25NZXNzYWdlID0gcHJvcHMuZ2V0QTExeVNlbGVjdGlvbk1lc3NhZ2UsXG4gICAgaXRlbVRvU3RyaW5nID0gcHJvcHMuaXRlbVRvU3RyaW5nO1xuICAvLyBJbml0aWFsIHN0YXRlIGRlcGVuZGluZyBvbiBjb250cm9sbGVkIHByb3BzLlxuICB2YXIgaW5pdGlhbFN0YXRlID0gZ2V0SW5pdGlhbFN0YXRlJDEocHJvcHMpO1xuICB2YXIgX3VzZUNvbnRyb2xsZWRSZWR1Y2VyID0gdXNlQ29udHJvbGxlZFJlZHVjZXIoZG93bnNoaWZ0VXNlQ29tYm9ib3hSZWR1Y2VyLCBpbml0aWFsU3RhdGUsIHByb3BzKSxcbiAgICBzdGF0ZSA9IF91c2VDb250cm9sbGVkUmVkdWNlclswXSxcbiAgICBkaXNwYXRjaCA9IF91c2VDb250cm9sbGVkUmVkdWNlclsxXTtcbiAgdmFyIGlzT3BlbiA9IHN0YXRlLmlzT3BlbixcbiAgICBoaWdobGlnaHRlZEluZGV4ID0gc3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCxcbiAgICBzZWxlY3RlZEl0ZW0gPSBzdGF0ZS5zZWxlY3RlZEl0ZW0sXG4gICAgaW5wdXRWYWx1ZSA9IHN0YXRlLmlucHV0VmFsdWU7XG5cbiAgLy8gRWxlbWVudCByZWZzLlxuICB2YXIgbWVudVJlZiA9IHVzZVJlZihudWxsKTtcbiAgdmFyIGl0ZW1SZWZzID0gdXNlUmVmKHt9KTtcbiAgdmFyIGlucHV0UmVmID0gdXNlUmVmKG51bGwpO1xuICB2YXIgdG9nZ2xlQnV0dG9uUmVmID0gdXNlUmVmKG51bGwpO1xuICB2YXIgaXNJbml0aWFsTW91bnRSZWYgPSB1c2VSZWYodHJ1ZSk7XG4gIC8vIHByZXZlbnQgaWQgcmUtZ2VuZXJhdGlvbiBiZXR3ZWVuIHJlbmRlcnMuXG4gIHZhciBlbGVtZW50SWRzID0gdXNlRWxlbWVudElkcyhwcm9wcyk7XG4gIC8vIHVzZWQgdG8ga2VlcCB0cmFjayBvZiBob3cgbWFueSBpdGVtcyB3ZSBoYWQgb24gcHJldmlvdXMgY3ljbGUuXG4gIHZhciBwcmV2aW91c1Jlc3VsdENvdW50UmVmID0gdXNlUmVmKCk7XG4gIC8vIHV0aWxpdHkgY2FsbGJhY2sgdG8gZ2V0IGl0ZW0gZWxlbWVudC5cbiAgdmFyIGxhdGVzdCA9IHVzZUxhdGVzdFJlZih7XG4gICAgc3RhdGU6IHN0YXRlLFxuICAgIHByb3BzOiBwcm9wc1xuICB9KTtcbiAgdmFyIGdldEl0ZW1Ob2RlRnJvbUluZGV4ID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgcmV0dXJuIGl0ZW1SZWZzLmN1cnJlbnRbZWxlbWVudElkcy5nZXRJdGVtSWQoaW5kZXgpXTtcbiAgfSwgW2VsZW1lbnRJZHNdKTtcblxuICAvLyBFZmZlY3RzLlxuICAvLyBTZXRzIGExMXkgc3RhdHVzIG1lc3NhZ2Ugb24gY2hhbmdlcyBpbiBzdGF0ZS5cbiAgdXNlQTExeU1lc3NhZ2VTZXR0ZXIoZ2V0QTExeVN0YXR1c01lc3NhZ2UsIFtpc09wZW4sIGhpZ2hsaWdodGVkSW5kZXgsIGlucHV0VmFsdWUsIGl0ZW1zXSwgX2V4dGVuZHMoe1xuICAgIGlzSW5pdGlhbE1vdW50OiBpc0luaXRpYWxNb3VudFJlZi5jdXJyZW50LFxuICAgIHByZXZpb3VzUmVzdWx0Q291bnQ6IHByZXZpb3VzUmVzdWx0Q291bnRSZWYuY3VycmVudCxcbiAgICBpdGVtczogaXRlbXMsXG4gICAgZW52aXJvbm1lbnQ6IGVudmlyb25tZW50LFxuICAgIGl0ZW1Ub1N0cmluZzogaXRlbVRvU3RyaW5nXG4gIH0sIHN0YXRlKSk7XG4gIC8vIFNldHMgYTExeSBzdGF0dXMgbWVzc2FnZSBvbiBjaGFuZ2VzIGluIHNlbGVjdGVkSXRlbS5cbiAgdXNlQTExeU1lc3NhZ2VTZXR0ZXIoZ2V0QTExeVNlbGVjdGlvbk1lc3NhZ2UsIFtzZWxlY3RlZEl0ZW1dLCBfZXh0ZW5kcyh7XG4gICAgaXNJbml0aWFsTW91bnQ6IGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQsXG4gICAgcHJldmlvdXNSZXN1bHRDb3VudDogcHJldmlvdXNSZXN1bHRDb3VudFJlZi5jdXJyZW50LFxuICAgIGl0ZW1zOiBpdGVtcyxcbiAgICBlbnZpcm9ubWVudDogZW52aXJvbm1lbnQsXG4gICAgaXRlbVRvU3RyaW5nOiBpdGVtVG9TdHJpbmdcbiAgfSwgc3RhdGUpKTtcbiAgLy8gU2Nyb2xsIG9uIGhpZ2hsaWdodGVkIGl0ZW0gaWYgY2hhbmdlIGNvbWVzIGZyb20ga2V5Ym9hcmQuXG4gIHZhciBzaG91bGRTY3JvbGxSZWYgPSB1c2VTY3JvbGxJbnRvVmlldyh7XG4gICAgbWVudUVsZW1lbnQ6IG1lbnVSZWYuY3VycmVudCxcbiAgICBoaWdobGlnaHRlZEluZGV4OiBoaWdobGlnaHRlZEluZGV4LFxuICAgIGlzT3BlbjogaXNPcGVuLFxuICAgIGl0ZW1SZWZzOiBpdGVtUmVmcyxcbiAgICBzY3JvbGxJbnRvVmlldzogc2Nyb2xsSW50b1ZpZXcsXG4gICAgZ2V0SXRlbU5vZGVGcm9tSW5kZXg6IGdldEl0ZW1Ob2RlRnJvbUluZGV4XG4gIH0pO1xuICB1c2VDb250cm9sUHJvcHNWYWxpZGF0b3Ioe1xuICAgIGlzSW5pdGlhbE1vdW50OiBpc0luaXRpYWxNb3VudFJlZi5jdXJyZW50LFxuICAgIHByb3BzOiBwcm9wcyxcbiAgICBzdGF0ZTogc3RhdGVcbiAgfSk7XG4gIC8vIEZvY3VzIHRoZSBpbnB1dCBvbiBmaXJzdCByZW5kZXIgaWYgcmVxdWlyZWQuXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGZvY3VzT25PcGVuID0gaW5pdGlhbElzT3BlbiB8fCBkZWZhdWx0SXNPcGVuIHx8IGlzT3BlbjtcbiAgICBpZiAoZm9jdXNPbk9wZW4gJiYgaW5wdXRSZWYuY3VycmVudCkge1xuICAgICAgaW5wdXRSZWYuY3VycmVudC5mb2N1cygpO1xuICAgIH1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gIH0sIFtdKTtcbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaXNJbml0aWFsTW91bnRSZWYuY3VycmVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBwcmV2aW91c1Jlc3VsdENvdW50UmVmLmN1cnJlbnQgPSBpdGVtcy5sZW5ndGg7XG4gIH0pO1xuICAvLyBBZGQgbW91c2UvdG91Y2ggZXZlbnRzIHRvIGRvY3VtZW50LlxuICB2YXIgbW91c2VBbmRUb3VjaFRyYWNrZXJzUmVmID0gdXNlTW91c2VBbmRUb3VjaFRyYWNrZXIoaXNPcGVuLCBbaW5wdXRSZWYsIG1lbnVSZWYsIHRvZ2dsZUJ1dHRvblJlZl0sIGVudmlyb25tZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogSW5wdXRCbHVyLFxuICAgICAgc2VsZWN0SXRlbTogZmFsc2VcbiAgICB9KTtcbiAgfSk7XG4gIHZhciBzZXRHZXR0ZXJQcm9wQ2FsbEluZm8gPSB1c2VHZXR0ZXJQcm9wc0NhbGxlZENoZWNrZXIoJ2dldElucHV0UHJvcHMnLCAnZ2V0TWVudVByb3BzJyk7XG4gIC8vIE1ha2UgaW5pdGlhbCByZWYgZmFsc2UuXG4gIHVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgaXNJbml0aWFsTW91bnRSZWYuY3VycmVudCA9IGZhbHNlO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpc0luaXRpYWxNb3VudFJlZi5jdXJyZW50ID0gdHJ1ZTtcbiAgICB9O1xuICB9LCBbXSk7XG4gIC8vIFJlc2V0IGl0ZW1SZWZzIG9uIGNsb3NlLlxuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIHZhciBfZW52aXJvbm1lbnQkZG9jdW1lbnQ7XG4gICAgaWYgKCFpc09wZW4pIHtcbiAgICAgIGl0ZW1SZWZzLmN1cnJlbnQgPSB7fTtcbiAgICB9IGVsc2UgaWYgKCgoX2Vudmlyb25tZW50JGRvY3VtZW50ID0gZW52aXJvbm1lbnQuZG9jdW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBfZW52aXJvbm1lbnQkZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkgIT09IGlucHV0UmVmLmN1cnJlbnQpIHtcbiAgICAgIHZhciBfaW5wdXRSZWYkY3VycmVudDtcbiAgICAgIGlucHV0UmVmID09IG51bGwgfHwgKF9pbnB1dFJlZiRjdXJyZW50ID0gaW5wdXRSZWYuY3VycmVudCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9pbnB1dFJlZiRjdXJyZW50LmZvY3VzKCk7XG4gICAgfVxuICB9LCBbaXNPcGVuLCBlbnZpcm9ubWVudF0pO1xuXG4gIC8qIEV2ZW50IGhhbmRsZXIgZnVuY3Rpb25zICovXG4gIHZhciBpbnB1dEtleURvd25IYW5kbGVycyA9IHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBBcnJvd0Rvd246IGZ1bmN0aW9uIEFycm93RG93bihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogSW5wdXRLZXlEb3duQXJyb3dEb3duLFxuICAgICAgICAgIGFsdEtleTogZXZlbnQuYWx0S2V5LFxuICAgICAgICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4OiBnZXRJdGVtTm9kZUZyb21JbmRleFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBBcnJvd1VwOiBmdW5jdGlvbiBBcnJvd1VwKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBJbnB1dEtleURvd25BcnJvd1VwLFxuICAgICAgICAgIGFsdEtleTogZXZlbnQuYWx0S2V5LFxuICAgICAgICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4OiBnZXRJdGVtTm9kZUZyb21JbmRleFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBIb21lOiBmdW5jdGlvbiBIb21lKGV2ZW50KSB7XG4gICAgICAgIGlmICghbGF0ZXN0LmN1cnJlbnQuc3RhdGUuaXNPcGVuKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBJbnB1dEtleURvd25Ib21lLFxuICAgICAgICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4OiBnZXRJdGVtTm9kZUZyb21JbmRleFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBFbmQ6IGZ1bmN0aW9uIEVuZChldmVudCkge1xuICAgICAgICBpZiAoIWxhdGVzdC5jdXJyZW50LnN0YXRlLmlzT3Blbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogSW5wdXRLZXlEb3duRW5kLFxuICAgICAgICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4OiBnZXRJdGVtTm9kZUZyb21JbmRleFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBFc2NhcGU6IGZ1bmN0aW9uIEVzY2FwZShldmVudCkge1xuICAgICAgICB2YXIgbGF0ZXN0U3RhdGUgPSBsYXRlc3QuY3VycmVudC5zdGF0ZTtcbiAgICAgICAgaWYgKGxhdGVzdFN0YXRlLmlzT3BlbiB8fCBsYXRlc3RTdGF0ZS5pbnB1dFZhbHVlIHx8IGxhdGVzdFN0YXRlLnNlbGVjdGVkSXRlbSB8fCBsYXRlc3RTdGF0ZS5oaWdobGlnaHRlZEluZGV4ID4gLTEpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICAgIHR5cGU6IElucHV0S2V5RG93bkVzY2FwZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgRW50ZXI6IGZ1bmN0aW9uIEVudGVyKGV2ZW50KSB7XG4gICAgICAgIHZhciBsYXRlc3RTdGF0ZSA9IGxhdGVzdC5jdXJyZW50LnN0YXRlO1xuICAgICAgICAvLyBpZiBjbG9zZWQgb3Igbm8gaGlnaGxpZ2h0ZWQgaW5kZXgsIGRvIG5vdGhpbmcuXG4gICAgICAgIGlmICghbGF0ZXN0U3RhdGUuaXNPcGVuIHx8IGV2ZW50LndoaWNoID09PSAyMjkgLy8gaWYgSU1FIGNvbXBvc2luZywgd2FpdCBmb3IgbmV4dCBFbnRlciBrZXlkb3duIGV2ZW50LlxuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZGlzcGF0Y2goe1xuICAgICAgICAgIHR5cGU6IElucHV0S2V5RG93bkVudGVyLFxuICAgICAgICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4OiBnZXRJdGVtTm9kZUZyb21JbmRleFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBQYWdlVXA6IGZ1bmN0aW9uIFBhZ2VVcChldmVudCkge1xuICAgICAgICBpZiAobGF0ZXN0LmN1cnJlbnQuc3RhdGUuaXNPcGVuKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBJbnB1dEtleURvd25QYWdlVXAsXG4gICAgICAgICAgICBnZXRJdGVtTm9kZUZyb21JbmRleDogZ2V0SXRlbU5vZGVGcm9tSW5kZXhcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFBhZ2VEb3duOiBmdW5jdGlvbiBQYWdlRG93bihldmVudCkge1xuICAgICAgICBpZiAobGF0ZXN0LmN1cnJlbnQuc3RhdGUuaXNPcGVuKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgICB0eXBlOiBJbnB1dEtleURvd25QYWdlRG93bixcbiAgICAgICAgICAgIGdldEl0ZW1Ob2RlRnJvbUluZGV4OiBnZXRJdGVtTm9kZUZyb21JbmRleFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSwgW2Rpc3BhdGNoLCBsYXRlc3QsIGdldEl0ZW1Ob2RlRnJvbUluZGV4XSk7XG5cbiAgLy8gR2V0dGVyIHByb3BzLlxuICB2YXIgZ2V0TGFiZWxQcm9wcyA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChsYWJlbFByb3BzKSB7XG4gICAgcmV0dXJuIF9leHRlbmRzKHtcbiAgICAgIGlkOiBlbGVtZW50SWRzLmxhYmVsSWQsXG4gICAgICBodG1sRm9yOiBlbGVtZW50SWRzLmlucHV0SWRcbiAgICB9LCBsYWJlbFByb3BzKTtcbiAgfSwgW2VsZW1lbnRJZHNdKTtcbiAgdmFyIGdldE1lbnVQcm9wcyA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChfdGVtcCwgX3RlbXAyKSB7XG4gICAgdmFyIF9leHRlbmRzMjtcbiAgICB2YXIgX3JlZiA9IF90ZW1wID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wLFxuICAgICAgb25Nb3VzZUxlYXZlID0gX3JlZi5vbk1vdXNlTGVhdmUsXG4gICAgICBfcmVmJHJlZktleSA9IF9yZWYucmVmS2V5LFxuICAgICAgcmVmS2V5ID0gX3JlZiRyZWZLZXkgPT09IHZvaWQgMCA/ICdyZWYnIDogX3JlZiRyZWZLZXksXG4gICAgICByZWYgPSBfcmVmLnJlZixcbiAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmLCBfZXhjbHVkZWQkMSk7XG4gICAgdmFyIF9yZWYyID0gX3RlbXAyID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wMixcbiAgICAgIF9yZWYyJHN1cHByZXNzUmVmRXJybyA9IF9yZWYyLnN1cHByZXNzUmVmRXJyb3IsXG4gICAgICBzdXBwcmVzc1JlZkVycm9yID0gX3JlZjIkc3VwcHJlc3NSZWZFcnJvID09PSB2b2lkIDAgPyBmYWxzZSA6IF9yZWYyJHN1cHByZXNzUmVmRXJybztcbiAgICBzZXRHZXR0ZXJQcm9wQ2FsbEluZm8oJ2dldE1lbnVQcm9wcycsIHN1cHByZXNzUmVmRXJyb3IsIHJlZktleSwgbWVudVJlZik7XG4gICAgcmV0dXJuIF9leHRlbmRzKChfZXh0ZW5kczIgPSB7fSwgX2V4dGVuZHMyW3JlZktleV0gPSBoYW5kbGVSZWZzKHJlZiwgZnVuY3Rpb24gKG1lbnVOb2RlKSB7XG4gICAgICBtZW51UmVmLmN1cnJlbnQgPSBtZW51Tm9kZTtcbiAgICB9KSwgX2V4dGVuZHMyLmlkID0gZWxlbWVudElkcy5tZW51SWQsIF9leHRlbmRzMi5yb2xlID0gJ2xpc3Rib3gnLCBfZXh0ZW5kczJbJ2FyaWEtbGFiZWxsZWRieSddID0gcmVzdCAmJiByZXN0WydhcmlhLWxhYmVsJ10gPyB1bmRlZmluZWQgOiBcIlwiICsgZWxlbWVudElkcy5sYWJlbElkLCBfZXh0ZW5kczIub25Nb3VzZUxlYXZlID0gY2FsbEFsbEV2ZW50SGFuZGxlcnMob25Nb3VzZUxlYXZlLCBmdW5jdGlvbiAoKSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IE1lbnVNb3VzZUxlYXZlXG4gICAgICB9KTtcbiAgICB9KSwgX2V4dGVuZHMyKSwgcmVzdCk7XG4gIH0sIFtkaXNwYXRjaCwgc2V0R2V0dGVyUHJvcENhbGxJbmZvLCBlbGVtZW50SWRzXSk7XG4gIHZhciBnZXRJdGVtUHJvcHMgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoX3RlbXAzKSB7XG4gICAgdmFyIF9leHRlbmRzMywgX3JlZjQ7XG4gICAgdmFyIF9yZWYzID0gX3RlbXAzID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wMyxcbiAgICAgIGl0ZW1Qcm9wID0gX3JlZjMuaXRlbSxcbiAgICAgIGluZGV4UHJvcCA9IF9yZWYzLmluZGV4LFxuICAgICAgX3JlZjMkcmVmS2V5ID0gX3JlZjMucmVmS2V5LFxuICAgICAgcmVmS2V5ID0gX3JlZjMkcmVmS2V5ID09PSB2b2lkIDAgPyAncmVmJyA6IF9yZWYzJHJlZktleSxcbiAgICAgIHJlZiA9IF9yZWYzLnJlZixcbiAgICAgIG9uTW91c2VNb3ZlID0gX3JlZjMub25Nb3VzZU1vdmUsXG4gICAgICBvbk1vdXNlRG93biA9IF9yZWYzLm9uTW91c2VEb3duLFxuICAgICAgb25DbGljayA9IF9yZWYzLm9uQ2xpY2s7XG4gICAgICBfcmVmMy5vblByZXNzO1xuICAgICAgdmFyIGRpc2FibGVkID0gX3JlZjMuZGlzYWJsZWQsXG4gICAgICByZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZjMsIF9leGNsdWRlZDIkMSk7XG4gICAgdmFyIF9sYXRlc3QkY3VycmVudCA9IGxhdGVzdC5jdXJyZW50LFxuICAgICAgbGF0ZXN0UHJvcHMgPSBfbGF0ZXN0JGN1cnJlbnQucHJvcHMsXG4gICAgICBsYXRlc3RTdGF0ZSA9IF9sYXRlc3QkY3VycmVudC5zdGF0ZTtcbiAgICB2YXIgX2dldEl0ZW1BbmRJbmRleCA9IGdldEl0ZW1BbmRJbmRleChpdGVtUHJvcCwgaW5kZXhQcm9wLCBsYXRlc3RQcm9wcy5pdGVtcywgJ1Bhc3MgZWl0aGVyIGl0ZW0gb3IgaW5kZXggdG8gZ2V0SXRlbVByb3BzIScpLFxuICAgICAgaW5kZXggPSBfZ2V0SXRlbUFuZEluZGV4WzFdO1xuICAgIHZhciBvblNlbGVjdEtleSA9ICdvbkNsaWNrJztcbiAgICB2YXIgY3VzdG9tQ2xpY2tIYW5kbGVyID0gb25DbGljaztcbiAgICB2YXIgaXRlbUhhbmRsZU1vdXNlTW92ZSA9IGZ1bmN0aW9uIGl0ZW1IYW5kbGVNb3VzZU1vdmUoKSB7XG4gICAgICBpZiAoaW5kZXggPT09IGxhdGVzdFN0YXRlLmhpZ2hsaWdodGVkSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2hvdWxkU2Nyb2xsUmVmLmN1cnJlbnQgPSBmYWxzZTtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogSXRlbU1vdXNlTW92ZSxcbiAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICBkaXNhYmxlZDogZGlzYWJsZWRcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIGl0ZW1IYW5kbGVDbGljayA9IGZ1bmN0aW9uIGl0ZW1IYW5kbGVDbGljaygpIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogSXRlbUNsaWNrLFxuICAgICAgICBpbmRleDogaW5kZXhcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIGl0ZW1IYW5kbGVNb3VzZURvd24gPSBmdW5jdGlvbiBpdGVtSGFuZGxlTW91c2VEb3duKGUpIHtcbiAgICAgIHJldHVybiBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfTtcbiAgICByZXR1cm4gX2V4dGVuZHMoKF9leHRlbmRzMyA9IHt9LCBfZXh0ZW5kczNbcmVmS2V5XSA9IGhhbmRsZVJlZnMocmVmLCBmdW5jdGlvbiAoaXRlbU5vZGUpIHtcbiAgICAgIGlmIChpdGVtTm9kZSkge1xuICAgICAgICBpdGVtUmVmcy5jdXJyZW50W2VsZW1lbnRJZHMuZ2V0SXRlbUlkKGluZGV4KV0gPSBpdGVtTm9kZTtcbiAgICAgIH1cbiAgICB9KSwgX2V4dGVuZHMzLmRpc2FibGVkID0gZGlzYWJsZWQsIF9leHRlbmRzMy5yb2xlID0gJ29wdGlvbicsIF9leHRlbmRzM1snYXJpYS1zZWxlY3RlZCddID0gXCJcIiArIChpbmRleCA9PT0gbGF0ZXN0U3RhdGUuaGlnaGxpZ2h0ZWRJbmRleCksIF9leHRlbmRzMy5pZCA9IGVsZW1lbnRJZHMuZ2V0SXRlbUlkKGluZGV4KSwgX2V4dGVuZHMzKSwgIWRpc2FibGVkICYmIChfcmVmNCA9IHt9LCBfcmVmNFtvblNlbGVjdEtleV0gPSBjYWxsQWxsRXZlbnRIYW5kbGVycyhjdXN0b21DbGlja0hhbmRsZXIsIGl0ZW1IYW5kbGVDbGljayksIF9yZWY0KSwge1xuICAgICAgb25Nb3VzZU1vdmU6IGNhbGxBbGxFdmVudEhhbmRsZXJzKG9uTW91c2VNb3ZlLCBpdGVtSGFuZGxlTW91c2VNb3ZlKSxcbiAgICAgIG9uTW91c2VEb3duOiBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbk1vdXNlRG93biwgaXRlbUhhbmRsZU1vdXNlRG93bilcbiAgICB9LCByZXN0KTtcbiAgfSwgW2Rpc3BhdGNoLCBsYXRlc3QsIHNob3VsZFNjcm9sbFJlZiwgZWxlbWVudElkc10pO1xuICB2YXIgZ2V0VG9nZ2xlQnV0dG9uUHJvcHMgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoX3RlbXA0KSB7XG4gICAgdmFyIF9leHRlbmRzNDtcbiAgICB2YXIgX3JlZjUgPSBfdGVtcDQgPT09IHZvaWQgMCA/IHt9IDogX3RlbXA0LFxuICAgICAgb25DbGljayA9IF9yZWY1Lm9uQ2xpY2s7XG4gICAgICBfcmVmNS5vblByZXNzO1xuICAgICAgdmFyIF9yZWY1JHJlZktleSA9IF9yZWY1LnJlZktleSxcbiAgICAgIHJlZktleSA9IF9yZWY1JHJlZktleSA9PT0gdm9pZCAwID8gJ3JlZicgOiBfcmVmNSRyZWZLZXksXG4gICAgICByZWYgPSBfcmVmNS5yZWYsXG4gICAgICByZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZjUsIF9leGNsdWRlZDMpO1xuICAgIHZhciBsYXRlc3RTdGF0ZSA9IGxhdGVzdC5jdXJyZW50LnN0YXRlO1xuICAgIHZhciB0b2dnbGVCdXR0b25IYW5kbGVDbGljayA9IGZ1bmN0aW9uIHRvZ2dsZUJ1dHRvbkhhbmRsZUNsaWNrKCkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBUb2dnbGVCdXR0b25DbGlja1xuICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gX2V4dGVuZHMoKF9leHRlbmRzNCA9IHt9LCBfZXh0ZW5kczRbcmVmS2V5XSA9IGhhbmRsZVJlZnMocmVmLCBmdW5jdGlvbiAodG9nZ2xlQnV0dG9uTm9kZSkge1xuICAgICAgdG9nZ2xlQnV0dG9uUmVmLmN1cnJlbnQgPSB0b2dnbGVCdXR0b25Ob2RlO1xuICAgIH0pLCBfZXh0ZW5kczRbJ2FyaWEtY29udHJvbHMnXSA9IGVsZW1lbnRJZHMubWVudUlkLCBfZXh0ZW5kczRbJ2FyaWEtZXhwYW5kZWQnXSA9IGxhdGVzdFN0YXRlLmlzT3BlbiwgX2V4dGVuZHM0LmlkID0gZWxlbWVudElkcy50b2dnbGVCdXR0b25JZCwgX2V4dGVuZHM0LnRhYkluZGV4ID0gLTEsIF9leHRlbmRzNCksICFyZXN0LmRpc2FibGVkICYmIF9leHRlbmRzKHt9LCB7XG4gICAgICBvbkNsaWNrOiBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbkNsaWNrLCB0b2dnbGVCdXR0b25IYW5kbGVDbGljaylcbiAgICB9KSwgcmVzdCk7XG4gIH0sIFtkaXNwYXRjaCwgbGF0ZXN0LCBlbGVtZW50SWRzXSk7XG4gIHZhciBnZXRJbnB1dFByb3BzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKF90ZW1wNSwgX3RlbXA2KSB7XG4gICAgdmFyIF9leHRlbmRzNTtcbiAgICB2YXIgX3JlZjYgPSBfdGVtcDUgPT09IHZvaWQgMCA/IHt9IDogX3RlbXA1LFxuICAgICAgb25LZXlEb3duID0gX3JlZjYub25LZXlEb3duLFxuICAgICAgb25DaGFuZ2UgPSBfcmVmNi5vbkNoYW5nZSxcbiAgICAgIG9uSW5wdXQgPSBfcmVmNi5vbklucHV0LFxuICAgICAgb25Gb2N1cyA9IF9yZWY2Lm9uRm9jdXMsXG4gICAgICBvbkJsdXIgPSBfcmVmNi5vbkJsdXI7XG4gICAgICBfcmVmNi5vbkNoYW5nZVRleHQ7XG4gICAgICB2YXIgX3JlZjYkcmVmS2V5ID0gX3JlZjYucmVmS2V5LFxuICAgICAgcmVmS2V5ID0gX3JlZjYkcmVmS2V5ID09PSB2b2lkIDAgPyAncmVmJyA6IF9yZWY2JHJlZktleSxcbiAgICAgIHJlZiA9IF9yZWY2LnJlZixcbiAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmNiwgX2V4Y2x1ZGVkNCk7XG4gICAgdmFyIF9yZWY3ID0gX3RlbXA2ID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wNixcbiAgICAgIF9yZWY3JHN1cHByZXNzUmVmRXJybyA9IF9yZWY3LnN1cHByZXNzUmVmRXJyb3IsXG4gICAgICBzdXBwcmVzc1JlZkVycm9yID0gX3JlZjckc3VwcHJlc3NSZWZFcnJvID09PSB2b2lkIDAgPyBmYWxzZSA6IF9yZWY3JHN1cHByZXNzUmVmRXJybztcbiAgICBzZXRHZXR0ZXJQcm9wQ2FsbEluZm8oJ2dldElucHV0UHJvcHMnLCBzdXBwcmVzc1JlZkVycm9yLCByZWZLZXksIGlucHV0UmVmKTtcbiAgICB2YXIgbGF0ZXN0U3RhdGUgPSBsYXRlc3QuY3VycmVudC5zdGF0ZTtcbiAgICB2YXIgaW5wdXRIYW5kbGVLZXlEb3duID0gZnVuY3Rpb24gaW5wdXRIYW5kbGVLZXlEb3duKGV2ZW50KSB7XG4gICAgICB2YXIga2V5ID0gbm9ybWFsaXplQXJyb3dLZXkoZXZlbnQpO1xuICAgICAgaWYgKGtleSAmJiBpbnB1dEtleURvd25IYW5kbGVyc1trZXldKSB7XG4gICAgICAgIGlucHV0S2V5RG93bkhhbmRsZXJzW2tleV0oZXZlbnQpO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGlucHV0SGFuZGxlQ2hhbmdlID0gZnVuY3Rpb24gaW5wdXRIYW5kbGVDaGFuZ2UoZXZlbnQpIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogSW5wdXRDaGFuZ2UsXG4gICAgICAgIGlucHV0VmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZVxuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgaW5wdXRIYW5kbGVCbHVyID0gZnVuY3Rpb24gaW5wdXRIYW5kbGVCbHVyKGV2ZW50KSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKGxhdGVzdFN0YXRlLmlzT3BlbiAmJiAhbW91c2VBbmRUb3VjaFRyYWNrZXJzUmVmLmN1cnJlbnQuaXNNb3VzZURvd24pIHtcbiAgICAgICAgdmFyIGlzQmx1ckJ5VGFiQ2hhbmdlID0gZXZlbnQucmVsYXRlZFRhcmdldCA9PT0gbnVsbCAmJiBlbnZpcm9ubWVudC5kb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBlbnZpcm9ubWVudC5kb2N1bWVudC5ib2R5O1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogSW5wdXRCbHVyLFxuICAgICAgICAgIHNlbGVjdEl0ZW06ICFpc0JsdXJCeVRhYkNoYW5nZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBpbnB1dEhhbmRsZUZvY3VzID0gZnVuY3Rpb24gaW5wdXRIYW5kbGVGb2N1cygpIHtcbiAgICAgIGlmICghbGF0ZXN0U3RhdGUuaXNPcGVuKSB7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBJbnB1dEZvY3VzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAocHJlYWN0KSAqL1xuICAgIHZhciBvbkNoYW5nZUtleSA9ICdvbkNoYW5nZSc7XG4gICAgdmFyIGV2ZW50SGFuZGxlcnMgPSB7fTtcbiAgICBpZiAoIXJlc3QuZGlzYWJsZWQpIHtcbiAgICAgIHZhciBfZXZlbnRIYW5kbGVycztcbiAgICAgIGV2ZW50SGFuZGxlcnMgPSAoX2V2ZW50SGFuZGxlcnMgPSB7fSwgX2V2ZW50SGFuZGxlcnNbb25DaGFuZ2VLZXldID0gY2FsbEFsbEV2ZW50SGFuZGxlcnMob25DaGFuZ2UsIG9uSW5wdXQsIGlucHV0SGFuZGxlQ2hhbmdlKSwgX2V2ZW50SGFuZGxlcnMub25LZXlEb3duID0gY2FsbEFsbEV2ZW50SGFuZGxlcnMob25LZXlEb3duLCBpbnB1dEhhbmRsZUtleURvd24pLCBfZXZlbnRIYW5kbGVycy5vbkJsdXIgPSBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbkJsdXIsIGlucHV0SGFuZGxlQmx1ciksIF9ldmVudEhhbmRsZXJzLm9uRm9jdXMgPSBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbkZvY3VzLCBpbnB1dEhhbmRsZUZvY3VzKSwgX2V2ZW50SGFuZGxlcnMpO1xuICAgIH1cbiAgICByZXR1cm4gX2V4dGVuZHMoKF9leHRlbmRzNSA9IHt9LCBfZXh0ZW5kczVbcmVmS2V5XSA9IGhhbmRsZVJlZnMocmVmLCBmdW5jdGlvbiAoaW5wdXROb2RlKSB7XG4gICAgICBpbnB1dFJlZi5jdXJyZW50ID0gaW5wdXROb2RlO1xuICAgIH0pLCBfZXh0ZW5kczVbJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCddID0gbGF0ZXN0U3RhdGUuaXNPcGVuICYmIGxhdGVzdFN0YXRlLmhpZ2hsaWdodGVkSW5kZXggPiAtMSA/IGVsZW1lbnRJZHMuZ2V0SXRlbUlkKGxhdGVzdFN0YXRlLmhpZ2hsaWdodGVkSW5kZXgpIDogJycsIF9leHRlbmRzNVsnYXJpYS1hdXRvY29tcGxldGUnXSA9ICdsaXN0JywgX2V4dGVuZHM1WydhcmlhLWNvbnRyb2xzJ10gPSBlbGVtZW50SWRzLm1lbnVJZCwgX2V4dGVuZHM1WydhcmlhLWV4cGFuZGVkJ10gPSBsYXRlc3RTdGF0ZS5pc09wZW4sIF9leHRlbmRzNVsnYXJpYS1sYWJlbGxlZGJ5J10gPSByZXN0ICYmIHJlc3RbJ2FyaWEtbGFiZWwnXSA/IHVuZGVmaW5lZCA6IFwiXCIgKyBlbGVtZW50SWRzLmxhYmVsSWQsIF9leHRlbmRzNS5hdXRvQ29tcGxldGUgPSAnb2ZmJywgX2V4dGVuZHM1LmlkID0gZWxlbWVudElkcy5pbnB1dElkLCBfZXh0ZW5kczUucm9sZSA9ICdjb21ib2JveCcsIF9leHRlbmRzNS52YWx1ZSA9IGxhdGVzdFN0YXRlLmlucHV0VmFsdWUsIF9leHRlbmRzNSksIGV2ZW50SGFuZGxlcnMsIHJlc3QpO1xuICB9LCBbc2V0R2V0dGVyUHJvcENhbGxJbmZvLCBsYXRlc3QsIGVsZW1lbnRJZHMsIGlucHV0S2V5RG93bkhhbmRsZXJzLCBkaXNwYXRjaCwgbW91c2VBbmRUb3VjaFRyYWNrZXJzUmVmLCBlbnZpcm9ubWVudF0pO1xuXG4gIC8vIHJldHVybnNcbiAgdmFyIHRvZ2dsZU1lbnUgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25Ub2dnbGVNZW51XG4gICAgfSk7XG4gIH0sIFtkaXNwYXRjaF0pO1xuICB2YXIgY2xvc2VNZW51ID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uQ2xvc2VNZW51XG4gICAgfSk7XG4gIH0sIFtkaXNwYXRjaF0pO1xuICB2YXIgb3Blbk1lbnUgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25PcGVuTWVudVxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgdmFyIHNldEhpZ2hsaWdodGVkSW5kZXggPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAobmV3SGlnaGxpZ2h0ZWRJbmRleCkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uU2V0SGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgIGhpZ2hsaWdodGVkSW5kZXg6IG5ld0hpZ2hsaWdodGVkSW5kZXhcbiAgICB9KTtcbiAgfSwgW2Rpc3BhdGNoXSk7XG4gIHZhciBzZWxlY3RJdGVtID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKG5ld1NlbGVjdGVkSXRlbSkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uU2VsZWN0SXRlbSxcbiAgICAgIHNlbGVjdGVkSXRlbTogbmV3U2VsZWN0ZWRJdGVtXG4gICAgfSk7XG4gIH0sIFtkaXNwYXRjaF0pO1xuICB2YXIgc2V0SW5wdXRWYWx1ZSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChuZXdJbnB1dFZhbHVlKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25TZXRJbnB1dFZhbHVlLFxuICAgICAgaW5wdXRWYWx1ZTogbmV3SW5wdXRWYWx1ZVxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgdmFyIHJlc2V0ID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uUmVzZXQkMVxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgcmV0dXJuIHtcbiAgICAvLyBwcm9wIGdldHRlcnMuXG4gICAgZ2V0SXRlbVByb3BzOiBnZXRJdGVtUHJvcHMsXG4gICAgZ2V0TGFiZWxQcm9wczogZ2V0TGFiZWxQcm9wcyxcbiAgICBnZXRNZW51UHJvcHM6IGdldE1lbnVQcm9wcyxcbiAgICBnZXRJbnB1dFByb3BzOiBnZXRJbnB1dFByb3BzLFxuICAgIGdldFRvZ2dsZUJ1dHRvblByb3BzOiBnZXRUb2dnbGVCdXR0b25Qcm9wcyxcbiAgICAvLyBhY3Rpb25zLlxuICAgIHRvZ2dsZU1lbnU6IHRvZ2dsZU1lbnUsXG4gICAgb3Blbk1lbnU6IG9wZW5NZW51LFxuICAgIGNsb3NlTWVudTogY2xvc2VNZW51LFxuICAgIHNldEhpZ2hsaWdodGVkSW5kZXg6IHNldEhpZ2hsaWdodGVkSW5kZXgsXG4gICAgc2V0SW5wdXRWYWx1ZTogc2V0SW5wdXRWYWx1ZSxcbiAgICBzZWxlY3RJdGVtOiBzZWxlY3RJdGVtLFxuICAgIHJlc2V0OiByZXNldCxcbiAgICAvLyBzdGF0ZS5cbiAgICBoaWdobGlnaHRlZEluZGV4OiBoaWdobGlnaHRlZEluZGV4LFxuICAgIGlzT3BlbjogaXNPcGVuLFxuICAgIHNlbGVjdGVkSXRlbTogc2VsZWN0ZWRJdGVtLFxuICAgIGlucHV0VmFsdWU6IGlucHV0VmFsdWVcbiAgfTtcbn1cblxudmFyIGRlZmF1bHRTdGF0ZVZhbHVlcyA9IHtcbiAgYWN0aXZlSW5kZXg6IC0xLFxuICBzZWxlY3RlZEl0ZW1zOiBbXVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBpbml0aWFsIHZhbHVlIGZvciBhIHN0YXRlIGtleSBpbiB0aGUgZm9sbG93aW5nIG9yZGVyOlxuICogMS4gY29udHJvbGxlZCBwcm9wLCAyLiBpbml0aWFsIHByb3AsIDMuIGRlZmF1bHQgcHJvcCwgNC4gZGVmYXVsdFxuICogdmFsdWUgZnJvbSBEb3duc2hpZnQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHByb3BzIFByb3BzIHBhc3NlZCB0byB0aGUgaG9vay5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wS2V5IFByb3BzIGtleSB0byBnZW5lcmF0ZSB0aGUgdmFsdWUgZm9yLlxuICogQHJldHVybnMge2FueX0gVGhlIGluaXRpYWwgdmFsdWUgZm9yIHRoYXQgcHJvcC5cbiAqL1xuZnVuY3Rpb24gZ2V0SW5pdGlhbFZhbHVlKHByb3BzLCBwcm9wS2V5KSB7XG4gIHJldHVybiBnZXRJbml0aWFsVmFsdWUkMShwcm9wcywgcHJvcEtleSwgZGVmYXVsdFN0YXRlVmFsdWVzKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBkZWZhdWx0IHZhbHVlIGZvciBhIHN0YXRlIGtleSBpbiB0aGUgZm9sbG93aW5nIG9yZGVyOlxuICogMS4gY29udHJvbGxlZCBwcm9wLCAyLiBkZWZhdWx0IHByb3AsIDMuIGRlZmF1bHQgdmFsdWUgZnJvbSBEb3duc2hpZnQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHByb3BzIFByb3BzIHBhc3NlZCB0byB0aGUgaG9vay5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wS2V5IFByb3BzIGtleSB0byBnZW5lcmF0ZSB0aGUgdmFsdWUgZm9yLlxuICogQHJldHVybnMge2FueX0gVGhlIGluaXRpYWwgdmFsdWUgZm9yIHRoYXQgcHJvcC5cbiAqL1xuZnVuY3Rpb24gZ2V0RGVmYXVsdFZhbHVlKHByb3BzLCBwcm9wS2V5KSB7XG4gIHJldHVybiBnZXREZWZhdWx0VmFsdWUkMShwcm9wcywgcHJvcEtleSwgZGVmYXVsdFN0YXRlVmFsdWVzKTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBpbml0aWFsIHN0YXRlIGJhc2VkIG9uIHRoZSBwcm92aWRlZCBwcm9wcy4gSXQgdXNlcyBpbml0aWFsLCBkZWZhdWx0XG4gKiBhbmQgY29udHJvbGxlZCBwcm9wcyByZWxhdGVkIHRvIHN0YXRlIGluIG9yZGVyIHRvIGNvbXB1dGUgdGhlIGluaXRpYWwgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHByb3BzIFByb3BzIHBhc3NlZCB0byB0aGUgaG9vay5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBpbml0aWFsIHN0YXRlLlxuICovXG5mdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUocHJvcHMpIHtcbiAgdmFyIGFjdGl2ZUluZGV4ID0gZ2V0SW5pdGlhbFZhbHVlKHByb3BzLCAnYWN0aXZlSW5kZXgnKTtcbiAgdmFyIHNlbGVjdGVkSXRlbXMgPSBnZXRJbml0aWFsVmFsdWUocHJvcHMsICdzZWxlY3RlZEl0ZW1zJyk7XG4gIHJldHVybiB7XG4gICAgYWN0aXZlSW5kZXg6IGFjdGl2ZUluZGV4LFxuICAgIHNlbGVjdGVkSXRlbXM6IHNlbGVjdGVkSXRlbXNcbiAgfTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgZHJvcGRvd24ga2V5ZG93biBvcGVyYXRpb24gaXMgcGVybWl0dGVkLiBTaG91bGQgbm90IGJlXG4gKiBhbGxvd2VkIG9uIGtleWRvd24gd2l0aCBtb2RpZmllciBrZXlzIChjdHJsLCBhbHQsIHNoaWZ0LCBtZXRhKSwgb25cbiAqIGlucHV0IGVsZW1lbnQgd2l0aCB0ZXh0IGNvbnRlbnQgdGhhdCBpcyBlaXRoZXIgaGlnaGxpZ2h0ZWQgb3Igc2VsZWN0aW9uXG4gKiBjdXJzb3IgaXMgbm90IGF0IHRoZSBzdGFydGluZyBwb3NpdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IFRoZSBldmVudCBmcm9tIGtleWRvd24uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciB0aGUgb3BlcmF0aW9uIGlzIGFsbG93ZWQuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5RG93bk9wZXJhdGlvblBlcm1pdHRlZChldmVudCkge1xuICBpZiAoZXZlbnQuc2hpZnRLZXkgfHwgZXZlbnQubWV0YUtleSB8fCBldmVudC5jdHJsS2V5IHx8IGV2ZW50LmFsdEtleSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgZWxlbWVudCA9IGV2ZW50LnRhcmdldDtcbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50ICYmXG4gIC8vIGlmIGVsZW1lbnQgaXMgYSB0ZXh0IGlucHV0XG4gIGVsZW1lbnQudmFsdWUgIT09ICcnICYmIChcbiAgLy8gYW5kIHdlIGhhdmUgdGV4dCBpbiBpdFxuICAvLyBhbmQgY3Vyc29yIGlzIGVpdGhlciBub3QgYXQgdGhlIHN0YXJ0IG9yIGlzIGN1cnJlbnRseSBoaWdobGlnaHRpbmcgdGV4dC5cbiAgZWxlbWVudC5zZWxlY3Rpb25TdGFydCAhPT0gMCB8fCBlbGVtZW50LnNlbGVjdGlvbkVuZCAhPT0gMCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIG1lc3NhZ2UgdG8gYmUgYWRkZWQgdG8gYXJpYS1saXZlIHJlZ2lvbiB3aGVuIGl0ZW0gaXMgcmVtb3ZlZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gc2VsZWN0aW9uUGFyYW1ldGVycyBQYXJhbWV0ZXJzIHJlcXVpcmVkIHRvIGJ1aWxkIHRoZSBtZXNzYWdlLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGExMXkgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gZ2V0QTExeVJlbW92YWxNZXNzYWdlKHNlbGVjdGlvblBhcmFtZXRlcnMpIHtcbiAgdmFyIHJlbW92ZWRTZWxlY3RlZEl0ZW0gPSBzZWxlY3Rpb25QYXJhbWV0ZXJzLnJlbW92ZWRTZWxlY3RlZEl0ZW0sXG4gICAgaXRlbVRvU3RyaW5nTG9jYWwgPSBzZWxlY3Rpb25QYXJhbWV0ZXJzLml0ZW1Ub1N0cmluZztcbiAgcmV0dXJuIGl0ZW1Ub1N0cmluZ0xvY2FsKHJlbW92ZWRTZWxlY3RlZEl0ZW0pICsgXCIgaGFzIGJlZW4gcmVtb3ZlZC5cIjtcbn1cbnZhciBwcm9wVHlwZXMgPSB7XG4gIHNlbGVjdGVkSXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgaW5pdGlhbFNlbGVjdGVkSXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgZGVmYXVsdFNlbGVjdGVkSXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgaXRlbVRvU3RyaW5nOiBQcm9wVHlwZXMuZnVuYyxcbiAgZ2V0QTExeVJlbW92YWxNZXNzYWdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgc3RhdGVSZWR1Y2VyOiBQcm9wVHlwZXMuZnVuYyxcbiAgYWN0aXZlSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gIGluaXRpYWxBY3RpdmVJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgZGVmYXVsdEFjdGl2ZUluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuICBvbkFjdGl2ZUluZGV4Q2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25TZWxlY3RlZEl0ZW1zQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAga2V5TmF2aWdhdGlvbk5leHQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGtleU5hdmlnYXRpb25QcmV2aW91czogUHJvcFR5cGVzLnN0cmluZyxcbiAgZW52aXJvbm1lbnQ6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgZG9jdW1lbnQ6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBnZXRFbGVtZW50QnlJZDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICBhY3RpdmVFbGVtZW50OiBQcm9wVHlwZXMuYW55LFxuICAgICAgYm9keTogUHJvcFR5cGVzLmFueVxuICAgIH0pXG4gIH0pXG59O1xudmFyIGRlZmF1bHRQcm9wcyA9IHtcbiAgaXRlbVRvU3RyaW5nOiBkZWZhdWx0UHJvcHMkMy5pdGVtVG9TdHJpbmcsXG4gIHN0YXRlUmVkdWNlcjogZGVmYXVsdFByb3BzJDMuc3RhdGVSZWR1Y2VyLFxuICBlbnZpcm9ubWVudDogZGVmYXVsdFByb3BzJDMuZW52aXJvbm1lbnQsXG4gIGdldEExMXlSZW1vdmFsTWVzc2FnZTogZ2V0QTExeVJlbW92YWxNZXNzYWdlLFxuICBrZXlOYXZpZ2F0aW9uTmV4dDogJ0Fycm93UmlnaHQnLFxuICBrZXlOYXZpZ2F0aW9uUHJldmlvdXM6ICdBcnJvd0xlZnQnXG59O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLW11dGFibGUtZXhwb3J0c1xudmFyIHZhbGlkYXRlUHJvcFR5cGVzID0gbm9vcDtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YWxpZGF0ZVByb3BUeXBlcyA9IGZ1bmN0aW9uIHZhbGlkYXRlUHJvcFR5cGVzKG9wdGlvbnMsIGNhbGxlcikge1xuICAgIFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcyhwcm9wVHlwZXMsIG9wdGlvbnMsICdwcm9wJywgY2FsbGVyLm5hbWUpO1xuICB9O1xufVxuXG52YXIgU2VsZWN0ZWRJdGVtQ2xpY2sgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19zZWxlY3RlZF9pdGVtX2NsaWNrX18nIDogMDtcbnZhciBTZWxlY3RlZEl0ZW1LZXlEb3duRGVsZXRlID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fc2VsZWN0ZWRfaXRlbV9rZXlkb3duX2RlbGV0ZV9fJyA6IDE7XG52YXIgU2VsZWN0ZWRJdGVtS2V5RG93bkJhY2tzcGFjZSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3NlbGVjdGVkX2l0ZW1fa2V5ZG93bl9iYWNrc3BhY2VfXycgOiAyO1xudmFyIFNlbGVjdGVkSXRlbUtleURvd25OYXZpZ2F0aW9uTmV4dCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX3NlbGVjdGVkX2l0ZW1fa2V5ZG93bl9uYXZpZ2F0aW9uX25leHRfXycgOiAzO1xudmFyIFNlbGVjdGVkSXRlbUtleURvd25OYXZpZ2F0aW9uUHJldmlvdXMgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19zZWxlY3RlZF9pdGVtX2tleWRvd25fbmF2aWdhdGlvbl9wcmV2aW91c19fJyA6IDQ7XG52YXIgRHJvcGRvd25LZXlEb3duTmF2aWdhdGlvblByZXZpb3VzID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fZHJvcGRvd25fa2V5ZG93bl9uYXZpZ2F0aW9uX3ByZXZpb3VzX18nIDogNTtcbnZhciBEcm9wZG93bktleURvd25CYWNrc3BhY2UgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19kcm9wZG93bl9rZXlkb3duX2JhY2tzcGFjZV9fJyA6IDY7XG52YXIgRHJvcGRvd25DbGljayA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2Ryb3Bkb3duX2NsaWNrX18nIDogNztcbnZhciBGdW5jdGlvbkFkZFNlbGVjdGVkSXRlbSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2Z1bmN0aW9uX2FkZF9zZWxlY3RlZF9pdGVtX18nIDogODtcbnZhciBGdW5jdGlvblJlbW92ZVNlbGVjdGVkSXRlbSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/ICdfX2Z1bmN0aW9uX3JlbW92ZV9zZWxlY3RlZF9pdGVtX18nIDogOTtcbnZhciBGdW5jdGlvblNldFNlbGVjdGVkSXRlbXMgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9zZXRfc2VsZWN0ZWRfaXRlbXNfXycgOiAxMDtcbnZhciBGdW5jdGlvblNldEFjdGl2ZUluZGV4ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gJ19fZnVuY3Rpb25fc2V0X2FjdGl2ZV9pbmRleF9fJyA6IDExO1xudmFyIEZ1bmN0aW9uUmVzZXQgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyAnX19mdW5jdGlvbl9yZXNldF9fJyA6IDEyO1xuXG52YXIgc3RhdGVDaGFuZ2VUeXBlcyA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgX19wcm90b19fOiBudWxsLFxuICBTZWxlY3RlZEl0ZW1DbGljazogU2VsZWN0ZWRJdGVtQ2xpY2ssXG4gIFNlbGVjdGVkSXRlbUtleURvd25EZWxldGU6IFNlbGVjdGVkSXRlbUtleURvd25EZWxldGUsXG4gIFNlbGVjdGVkSXRlbUtleURvd25CYWNrc3BhY2U6IFNlbGVjdGVkSXRlbUtleURvd25CYWNrc3BhY2UsXG4gIFNlbGVjdGVkSXRlbUtleURvd25OYXZpZ2F0aW9uTmV4dDogU2VsZWN0ZWRJdGVtS2V5RG93bk5hdmlnYXRpb25OZXh0LFxuICBTZWxlY3RlZEl0ZW1LZXlEb3duTmF2aWdhdGlvblByZXZpb3VzOiBTZWxlY3RlZEl0ZW1LZXlEb3duTmF2aWdhdGlvblByZXZpb3VzLFxuICBEcm9wZG93bktleURvd25OYXZpZ2F0aW9uUHJldmlvdXM6IERyb3Bkb3duS2V5RG93bk5hdmlnYXRpb25QcmV2aW91cyxcbiAgRHJvcGRvd25LZXlEb3duQmFja3NwYWNlOiBEcm9wZG93bktleURvd25CYWNrc3BhY2UsXG4gIERyb3Bkb3duQ2xpY2s6IERyb3Bkb3duQ2xpY2ssXG4gIEZ1bmN0aW9uQWRkU2VsZWN0ZWRJdGVtOiBGdW5jdGlvbkFkZFNlbGVjdGVkSXRlbSxcbiAgRnVuY3Rpb25SZW1vdmVTZWxlY3RlZEl0ZW06IEZ1bmN0aW9uUmVtb3ZlU2VsZWN0ZWRJdGVtLFxuICBGdW5jdGlvblNldFNlbGVjdGVkSXRlbXM6IEZ1bmN0aW9uU2V0U2VsZWN0ZWRJdGVtcyxcbiAgRnVuY3Rpb25TZXRBY3RpdmVJbmRleDogRnVuY3Rpb25TZXRBY3RpdmVJbmRleCxcbiAgRnVuY3Rpb25SZXNldDogRnVuY3Rpb25SZXNldFxufSk7XG5cbi8qIGVzbGludC1kaXNhYmxlIGNvbXBsZXhpdHkgKi9cbmZ1bmN0aW9uIGRvd25zaGlmdE11bHRpcGxlU2VsZWN0aW9uUmVkdWNlcihzdGF0ZSwgYWN0aW9uKSB7XG4gIHZhciB0eXBlID0gYWN0aW9uLnR5cGUsXG4gICAgaW5kZXggPSBhY3Rpb24uaW5kZXgsXG4gICAgcHJvcHMgPSBhY3Rpb24ucHJvcHMsXG4gICAgc2VsZWN0ZWRJdGVtID0gYWN0aW9uLnNlbGVjdGVkSXRlbTtcbiAgdmFyIGFjdGl2ZUluZGV4ID0gc3RhdGUuYWN0aXZlSW5kZXgsXG4gICAgc2VsZWN0ZWRJdGVtcyA9IHN0YXRlLnNlbGVjdGVkSXRlbXM7XG4gIHZhciBjaGFuZ2VzO1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIFNlbGVjdGVkSXRlbUNsaWNrOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgYWN0aXZlSW5kZXg6IGluZGV4XG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBTZWxlY3RlZEl0ZW1LZXlEb3duTmF2aWdhdGlvblByZXZpb3VzOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgYWN0aXZlSW5kZXg6IGFjdGl2ZUluZGV4IC0gMSA8IDAgPyAwIDogYWN0aXZlSW5kZXggLSAxXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBTZWxlY3RlZEl0ZW1LZXlEb3duTmF2aWdhdGlvbk5leHQ6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBhY3RpdmVJbmRleDogYWN0aXZlSW5kZXggKyAxID49IHNlbGVjdGVkSXRlbXMubGVuZ3RoID8gLTEgOiBhY3RpdmVJbmRleCArIDFcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIFNlbGVjdGVkSXRlbUtleURvd25CYWNrc3BhY2U6XG4gICAgY2FzZSBTZWxlY3RlZEl0ZW1LZXlEb3duRGVsZXRlOlxuICAgICAge1xuICAgICAgICBpZiAoYWN0aXZlSW5kZXggPCAwKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5ld0FjdGl2ZUluZGV4ID0gYWN0aXZlSW5kZXg7XG4gICAgICAgIGlmIChzZWxlY3RlZEl0ZW1zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIG5ld0FjdGl2ZUluZGV4ID0gLTE7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aXZlSW5kZXggPT09IHNlbGVjdGVkSXRlbXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIG5ld0FjdGl2ZUluZGV4ID0gc2VsZWN0ZWRJdGVtcy5sZW5ndGggLSAyO1xuICAgICAgICB9XG4gICAgICAgIGNoYW5nZXMgPSBfZXh0ZW5kcyh7XG4gICAgICAgICAgc2VsZWN0ZWRJdGVtczogW10uY29uY2F0KHNlbGVjdGVkSXRlbXMuc2xpY2UoMCwgYWN0aXZlSW5kZXgpLCBzZWxlY3RlZEl0ZW1zLnNsaWNlKGFjdGl2ZUluZGV4ICsgMSkpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBhY3RpdmVJbmRleDogbmV3QWN0aXZlSW5kZXhcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIGNhc2UgRHJvcGRvd25LZXlEb3duTmF2aWdhdGlvblByZXZpb3VzOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgYWN0aXZlSW5kZXg6IHNlbGVjdGVkSXRlbXMubGVuZ3RoIC0gMVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgRHJvcGRvd25LZXlEb3duQmFja3NwYWNlOlxuICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgc2VsZWN0ZWRJdGVtczogc2VsZWN0ZWRJdGVtcy5zbGljZSgwLCBzZWxlY3RlZEl0ZW1zLmxlbmd0aCAtIDEpXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBGdW5jdGlvbkFkZFNlbGVjdGVkSXRlbTpcbiAgICAgIGNoYW5nZXMgPSB7XG4gICAgICAgIHNlbGVjdGVkSXRlbXM6IFtdLmNvbmNhdChzZWxlY3RlZEl0ZW1zLCBbc2VsZWN0ZWRJdGVtXSlcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIERyb3Bkb3duQ2xpY2s6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBhY3RpdmVJbmRleDogLTFcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlIEZ1bmN0aW9uUmVtb3ZlU2VsZWN0ZWRJdGVtOlxuICAgICAge1xuICAgICAgICB2YXIgX25ld0FjdGl2ZUluZGV4ID0gYWN0aXZlSW5kZXg7XG4gICAgICAgIHZhciBzZWxlY3RlZEl0ZW1JbmRleCA9IHNlbGVjdGVkSXRlbXMuaW5kZXhPZihzZWxlY3RlZEl0ZW0pO1xuICAgICAgICBpZiAoc2VsZWN0ZWRJdGVtSW5kZXggPCAwKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGVjdGVkSXRlbXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgX25ld0FjdGl2ZUluZGV4ID0gLTE7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRJdGVtSW5kZXggPT09IHNlbGVjdGVkSXRlbXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIF9uZXdBY3RpdmVJbmRleCA9IHNlbGVjdGVkSXRlbXMubGVuZ3RoIC0gMjtcbiAgICAgICAgfVxuICAgICAgICBjaGFuZ2VzID0ge1xuICAgICAgICAgIHNlbGVjdGVkSXRlbXM6IFtdLmNvbmNhdChzZWxlY3RlZEl0ZW1zLnNsaWNlKDAsIHNlbGVjdGVkSXRlbUluZGV4KSwgc2VsZWN0ZWRJdGVtcy5zbGljZShzZWxlY3RlZEl0ZW1JbmRleCArIDEpKSxcbiAgICAgICAgICBhY3RpdmVJbmRleDogX25ld0FjdGl2ZUluZGV4XG4gICAgICAgIH07XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIGNhc2UgRnVuY3Rpb25TZXRTZWxlY3RlZEl0ZW1zOlxuICAgICAge1xuICAgICAgICB2YXIgbmV3U2VsZWN0ZWRJdGVtcyA9IGFjdGlvbi5zZWxlY3RlZEl0ZW1zO1xuICAgICAgICBjaGFuZ2VzID0ge1xuICAgICAgICAgIHNlbGVjdGVkSXRlbXM6IG5ld1NlbGVjdGVkSXRlbXNcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgY2FzZSBGdW5jdGlvblNldEFjdGl2ZUluZGV4OlxuICAgICAge1xuICAgICAgICB2YXIgX25ld0FjdGl2ZUluZGV4MiA9IGFjdGlvbi5hY3RpdmVJbmRleDtcbiAgICAgICAgY2hhbmdlcyA9IHtcbiAgICAgICAgICBhY3RpdmVJbmRleDogX25ld0FjdGl2ZUluZGV4MlxuICAgICAgICB9O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICBjYXNlIEZ1bmN0aW9uUmVzZXQ6XG4gICAgICBjaGFuZ2VzID0ge1xuICAgICAgICBhY3RpdmVJbmRleDogZ2V0RGVmYXVsdFZhbHVlKHByb3BzLCAnYWN0aXZlSW5kZXgnKSxcbiAgICAgICAgc2VsZWN0ZWRJdGVtczogZ2V0RGVmYXVsdFZhbHVlKHByb3BzLCAnc2VsZWN0ZWRJdGVtcycpXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVkdWNlciBjYWxsZWQgd2l0aG91dCBwcm9wZXIgYWN0aW9uIHR5cGUuJyk7XG4gIH1cbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBzdGF0ZSwgY2hhbmdlcyk7XG59XG5cbnZhciBfZXhjbHVkZWQgPSBbXCJyZWZLZXlcIiwgXCJyZWZcIiwgXCJvbkNsaWNrXCIsIFwib25LZXlEb3duXCIsIFwic2VsZWN0ZWRJdGVtXCIsIFwiaW5kZXhcIl0sXG4gIF9leGNsdWRlZDIgPSBbXCJyZWZLZXlcIiwgXCJyZWZcIiwgXCJvbktleURvd25cIiwgXCJvbkNsaWNrXCIsIFwicHJldmVudEtleUFjdGlvblwiXTtcbnVzZU11bHRpcGxlU2VsZWN0aW9uLnN0YXRlQ2hhbmdlVHlwZXMgPSBzdGF0ZUNoYW5nZVR5cGVzO1xuZnVuY3Rpb24gdXNlTXVsdGlwbGVTZWxlY3Rpb24odXNlclByb3BzKSB7XG4gIGlmICh1c2VyUHJvcHMgPT09IHZvaWQgMCkge1xuICAgIHVzZXJQcm9wcyA9IHt9O1xuICB9XG4gIHZhbGlkYXRlUHJvcFR5cGVzKHVzZXJQcm9wcywgdXNlTXVsdGlwbGVTZWxlY3Rpb24pO1xuICAvLyBQcm9wcyBkZWZhdWx0cyBhbmQgZGVzdHJ1Y3R1cmluZy5cbiAgdmFyIHByb3BzID0gX2V4dGVuZHMoe30sIGRlZmF1bHRQcm9wcywgdXNlclByb3BzKTtcbiAgdmFyIGdldEExMXlSZW1vdmFsTWVzc2FnZSA9IHByb3BzLmdldEExMXlSZW1vdmFsTWVzc2FnZSxcbiAgICBpdGVtVG9TdHJpbmcgPSBwcm9wcy5pdGVtVG9TdHJpbmcsXG4gICAgZW52aXJvbm1lbnQgPSBwcm9wcy5lbnZpcm9ubWVudCxcbiAgICBrZXlOYXZpZ2F0aW9uTmV4dCA9IHByb3BzLmtleU5hdmlnYXRpb25OZXh0LFxuICAgIGtleU5hdmlnYXRpb25QcmV2aW91cyA9IHByb3BzLmtleU5hdmlnYXRpb25QcmV2aW91cztcblxuICAvLyBSZWR1Y2VyIGluaXQuXG4gIHZhciBfdXNlQ29udHJvbGxlZFJlZHVjZXIgPSB1c2VDb250cm9sbGVkUmVkdWNlciQxKGRvd25zaGlmdE11bHRpcGxlU2VsZWN0aW9uUmVkdWNlciwgZ2V0SW5pdGlhbFN0YXRlKHByb3BzKSwgcHJvcHMpLFxuICAgIHN0YXRlID0gX3VzZUNvbnRyb2xsZWRSZWR1Y2VyWzBdLFxuICAgIGRpc3BhdGNoID0gX3VzZUNvbnRyb2xsZWRSZWR1Y2VyWzFdO1xuICB2YXIgYWN0aXZlSW5kZXggPSBzdGF0ZS5hY3RpdmVJbmRleCxcbiAgICBzZWxlY3RlZEl0ZW1zID0gc3RhdGUuc2VsZWN0ZWRJdGVtcztcblxuICAvLyBSZWZzLlxuICB2YXIgaXNJbml0aWFsTW91bnRSZWYgPSB1c2VSZWYodHJ1ZSk7XG4gIHZhciBkcm9wZG93blJlZiA9IHVzZVJlZihudWxsKTtcbiAgdmFyIHByZXZpb3VzU2VsZWN0ZWRJdGVtc1JlZiA9IHVzZVJlZihzZWxlY3RlZEl0ZW1zKTtcbiAgdmFyIHNlbGVjdGVkSXRlbVJlZnMgPSB1c2VSZWYoKTtcbiAgc2VsZWN0ZWRJdGVtUmVmcy5jdXJyZW50ID0gW107XG4gIHZhciBsYXRlc3QgPSB1c2VMYXRlc3RSZWYoe1xuICAgIHN0YXRlOiBzdGF0ZSxcbiAgICBwcm9wczogcHJvcHNcbiAgfSk7XG5cbiAgLy8gRWZmZWN0cy5cbiAgLyogU2V0cyBhMTF5IHN0YXR1cyBtZXNzYWdlIG9uIGNoYW5nZXMgaW4gc2VsZWN0ZWRJdGVtLiAqL1xuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlmIChpc0luaXRpYWxNb3VudFJlZi5jdXJyZW50IHx8IGZhbHNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzZWxlY3RlZEl0ZW1zLmxlbmd0aCA8IHByZXZpb3VzU2VsZWN0ZWRJdGVtc1JlZi5jdXJyZW50Lmxlbmd0aCkge1xuICAgICAgdmFyIHJlbW92ZWRTZWxlY3RlZEl0ZW0gPSBwcmV2aW91c1NlbGVjdGVkSXRlbXNSZWYuY3VycmVudC5maW5kKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3RlZEl0ZW1zLmluZGV4T2YoaXRlbSkgPCAwO1xuICAgICAgfSk7XG4gICAgICBzZXRTdGF0dXMoZ2V0QTExeVJlbW92YWxNZXNzYWdlKHtcbiAgICAgICAgaXRlbVRvU3RyaW5nOiBpdGVtVG9TdHJpbmcsXG4gICAgICAgIHJlc3VsdENvdW50OiBzZWxlY3RlZEl0ZW1zLmxlbmd0aCxcbiAgICAgICAgcmVtb3ZlZFNlbGVjdGVkSXRlbTogcmVtb3ZlZFNlbGVjdGVkSXRlbSxcbiAgICAgICAgYWN0aXZlSW5kZXg6IGFjdGl2ZUluZGV4LFxuICAgICAgICBhY3RpdmVTZWxlY3RlZEl0ZW06IHNlbGVjdGVkSXRlbXNbYWN0aXZlSW5kZXhdXG4gICAgICB9KSwgZW52aXJvbm1lbnQuZG9jdW1lbnQpO1xuICAgIH1cbiAgICBwcmV2aW91c1NlbGVjdGVkSXRlbXNSZWYuY3VycmVudCA9IHNlbGVjdGVkSXRlbXM7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gIH0sIFtzZWxlY3RlZEl0ZW1zLmxlbmd0aF0pO1xuICAvLyBTZXRzIGZvY3VzIG9uIGFjdGl2ZSBpdGVtLlxuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlmIChpc0luaXRpYWxNb3VudFJlZi5jdXJyZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChhY3RpdmVJbmRleCA9PT0gLTEgJiYgZHJvcGRvd25SZWYuY3VycmVudCkge1xuICAgICAgZHJvcGRvd25SZWYuY3VycmVudC5mb2N1cygpO1xuICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRJdGVtUmVmcy5jdXJyZW50W2FjdGl2ZUluZGV4XSkge1xuICAgICAgc2VsZWN0ZWRJdGVtUmVmcy5jdXJyZW50W2FjdGl2ZUluZGV4XS5mb2N1cygpO1xuICAgIH1cbiAgfSwgW2FjdGl2ZUluZGV4XSk7XG4gIHVzZUNvbnRyb2xQcm9wc1ZhbGlkYXRvcih7XG4gICAgaXNJbml0aWFsTW91bnQ6IGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQsXG4gICAgcHJvcHM6IHByb3BzLFxuICAgIHN0YXRlOiBzdGF0ZVxuICB9KTtcbiAgdmFyIHNldEdldHRlclByb3BDYWxsSW5mbyA9IHVzZUdldHRlclByb3BzQ2FsbGVkQ2hlY2tlcignZ2V0RHJvcGRvd25Qcm9wcycpO1xuICAvLyBNYWtlIGluaXRpYWwgcmVmIGZhbHNlLlxuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlzSW5pdGlhbE1vdW50UmVmLmN1cnJlbnQgPSBmYWxzZTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgaXNJbml0aWFsTW91bnRSZWYuY3VycmVudCA9IHRydWU7XG4gICAgfTtcbiAgfSwgW10pO1xuXG4gIC8vIEV2ZW50IGhhbmRsZXIgZnVuY3Rpb25zLlxuICB2YXIgc2VsZWN0ZWRJdGVtS2V5RG93bkhhbmRsZXJzID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9yZWY7XG4gICAgcmV0dXJuIF9yZWYgPSB7fSwgX3JlZltrZXlOYXZpZ2F0aW9uUHJldmlvdXNdID0gZnVuY3Rpb24gKCkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBTZWxlY3RlZEl0ZW1LZXlEb3duTmF2aWdhdGlvblByZXZpb3VzXG4gICAgICB9KTtcbiAgICB9LCBfcmVmW2tleU5hdmlnYXRpb25OZXh0XSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogU2VsZWN0ZWRJdGVtS2V5RG93bk5hdmlnYXRpb25OZXh0XG4gICAgICB9KTtcbiAgICB9LCBfcmVmLkRlbGV0ZSA9IGZ1bmN0aW9uIERlbGV0ZSgpIHtcbiAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgdHlwZTogU2VsZWN0ZWRJdGVtS2V5RG93bkRlbGV0ZVxuICAgICAgfSk7XG4gICAgfSwgX3JlZi5CYWNrc3BhY2UgPSBmdW5jdGlvbiBCYWNrc3BhY2UoKSB7XG4gICAgICBkaXNwYXRjaCh7XG4gICAgICAgIHR5cGU6IFNlbGVjdGVkSXRlbUtleURvd25CYWNrc3BhY2VcbiAgICAgIH0pO1xuICAgIH0sIF9yZWY7XG4gIH0sIFtkaXNwYXRjaCwga2V5TmF2aWdhdGlvbk5leHQsIGtleU5hdmlnYXRpb25QcmV2aW91c10pO1xuICB2YXIgZHJvcGRvd25LZXlEb3duSGFuZGxlcnMgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX3JlZjI7XG4gICAgcmV0dXJuIF9yZWYyID0ge30sIF9yZWYyW2tleU5hdmlnYXRpb25QcmV2aW91c10gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmIChpc0tleURvd25PcGVyYXRpb25QZXJtaXR0ZWQoZXZlbnQpKSB7XG4gICAgICAgIGRpc3BhdGNoKHtcbiAgICAgICAgICB0eXBlOiBEcm9wZG93bktleURvd25OYXZpZ2F0aW9uUHJldmlvdXNcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwgX3JlZjIuQmFja3NwYWNlID0gZnVuY3Rpb24gQmFja3NwYWNlKGV2ZW50KSB7XG4gICAgICBpZiAoaXNLZXlEb3duT3BlcmF0aW9uUGVybWl0dGVkKGV2ZW50KSkge1xuICAgICAgICBkaXNwYXRjaCh7XG4gICAgICAgICAgdHlwZTogRHJvcGRvd25LZXlEb3duQmFja3NwYWNlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sIF9yZWYyO1xuICB9LCBbZGlzcGF0Y2gsIGtleU5hdmlnYXRpb25QcmV2aW91c10pO1xuXG4gIC8vIEdldHRlciBwcm9wcy5cbiAgdmFyIGdldFNlbGVjdGVkSXRlbVByb3BzID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKF90ZW1wKSB7XG4gICAgdmFyIF9leHRlbmRzMjtcbiAgICB2YXIgX3JlZjMgPSBfdGVtcCA9PT0gdm9pZCAwID8ge30gOiBfdGVtcCxcbiAgICAgIF9yZWYzJHJlZktleSA9IF9yZWYzLnJlZktleSxcbiAgICAgIHJlZktleSA9IF9yZWYzJHJlZktleSA9PT0gdm9pZCAwID8gJ3JlZicgOiBfcmVmMyRyZWZLZXksXG4gICAgICByZWYgPSBfcmVmMy5yZWYsXG4gICAgICBvbkNsaWNrID0gX3JlZjMub25DbGljayxcbiAgICAgIG9uS2V5RG93biA9IF9yZWYzLm9uS2V5RG93bixcbiAgICAgIHNlbGVjdGVkSXRlbVByb3AgPSBfcmVmMy5zZWxlY3RlZEl0ZW0sXG4gICAgICBpbmRleFByb3AgPSBfcmVmMy5pbmRleCxcbiAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmMywgX2V4Y2x1ZGVkKTtcbiAgICB2YXIgbGF0ZXN0U3RhdGUgPSBsYXRlc3QuY3VycmVudC5zdGF0ZTtcbiAgICB2YXIgX2dldEl0ZW1BbmRJbmRleCA9IGdldEl0ZW1BbmRJbmRleChzZWxlY3RlZEl0ZW1Qcm9wLCBpbmRleFByb3AsIGxhdGVzdFN0YXRlLnNlbGVjdGVkSXRlbXMsICdQYXNzIGVpdGhlciBpdGVtIG9yIGluZGV4IHRvIGdldFNlbGVjdGVkSXRlbVByb3BzIScpLFxuICAgICAgaW5kZXggPSBfZ2V0SXRlbUFuZEluZGV4WzFdO1xuICAgIHZhciBpc0ZvY3VzYWJsZSA9IGluZGV4ID4gLTEgJiYgaW5kZXggPT09IGxhdGVzdFN0YXRlLmFjdGl2ZUluZGV4O1xuICAgIHZhciBzZWxlY3RlZEl0ZW1IYW5kbGVDbGljayA9IGZ1bmN0aW9uIHNlbGVjdGVkSXRlbUhhbmRsZUNsaWNrKCkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBTZWxlY3RlZEl0ZW1DbGljayxcbiAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBzZWxlY3RlZEl0ZW1IYW5kbGVLZXlEb3duID0gZnVuY3Rpb24gc2VsZWN0ZWRJdGVtSGFuZGxlS2V5RG93bihldmVudCkge1xuICAgICAgdmFyIGtleSA9IG5vcm1hbGl6ZUFycm93S2V5KGV2ZW50KTtcbiAgICAgIGlmIChrZXkgJiYgc2VsZWN0ZWRJdGVtS2V5RG93bkhhbmRsZXJzW2tleV0pIHtcbiAgICAgICAgc2VsZWN0ZWRJdGVtS2V5RG93bkhhbmRsZXJzW2tleV0oZXZlbnQpO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIF9leHRlbmRzKChfZXh0ZW5kczIgPSB7fSwgX2V4dGVuZHMyW3JlZktleV0gPSBoYW5kbGVSZWZzKHJlZiwgZnVuY3Rpb24gKHNlbGVjdGVkSXRlbU5vZGUpIHtcbiAgICAgIGlmIChzZWxlY3RlZEl0ZW1Ob2RlKSB7XG4gICAgICAgIHNlbGVjdGVkSXRlbVJlZnMuY3VycmVudC5wdXNoKHNlbGVjdGVkSXRlbU5vZGUpO1xuICAgICAgfVxuICAgIH0pLCBfZXh0ZW5kczIudGFiSW5kZXggPSBpc0ZvY3VzYWJsZSA/IDAgOiAtMSwgX2V4dGVuZHMyLm9uQ2xpY2sgPSBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbkNsaWNrLCBzZWxlY3RlZEl0ZW1IYW5kbGVDbGljayksIF9leHRlbmRzMi5vbktleURvd24gPSBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbktleURvd24sIHNlbGVjdGVkSXRlbUhhbmRsZUtleURvd24pLCBfZXh0ZW5kczIpLCByZXN0KTtcbiAgfSwgW2Rpc3BhdGNoLCBsYXRlc3QsIHNlbGVjdGVkSXRlbUtleURvd25IYW5kbGVyc10pO1xuICB2YXIgZ2V0RHJvcGRvd25Qcm9wcyA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChfdGVtcDIsIF90ZW1wMykge1xuICAgIHZhciBfZXh0ZW5kczM7XG4gICAgdmFyIF9yZWY0ID0gX3RlbXAyID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wMixcbiAgICAgIF9yZWY0JHJlZktleSA9IF9yZWY0LnJlZktleSxcbiAgICAgIHJlZktleSA9IF9yZWY0JHJlZktleSA9PT0gdm9pZCAwID8gJ3JlZicgOiBfcmVmNCRyZWZLZXksXG4gICAgICByZWYgPSBfcmVmNC5yZWYsXG4gICAgICBvbktleURvd24gPSBfcmVmNC5vbktleURvd24sXG4gICAgICBvbkNsaWNrID0gX3JlZjQub25DbGljayxcbiAgICAgIF9yZWY0JHByZXZlbnRLZXlBY3RpbyA9IF9yZWY0LnByZXZlbnRLZXlBY3Rpb24sXG4gICAgICBwcmV2ZW50S2V5QWN0aW9uID0gX3JlZjQkcHJldmVudEtleUFjdGlvID09PSB2b2lkIDAgPyBmYWxzZSA6IF9yZWY0JHByZXZlbnRLZXlBY3RpbyxcbiAgICAgIHJlc3QgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmNCwgX2V4Y2x1ZGVkMik7XG4gICAgdmFyIF9yZWY1ID0gX3RlbXAzID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wMyxcbiAgICAgIF9yZWY1JHN1cHByZXNzUmVmRXJybyA9IF9yZWY1LnN1cHByZXNzUmVmRXJyb3IsXG4gICAgICBzdXBwcmVzc1JlZkVycm9yID0gX3JlZjUkc3VwcHJlc3NSZWZFcnJvID09PSB2b2lkIDAgPyBmYWxzZSA6IF9yZWY1JHN1cHByZXNzUmVmRXJybztcbiAgICBzZXRHZXR0ZXJQcm9wQ2FsbEluZm8oJ2dldERyb3Bkb3duUHJvcHMnLCBzdXBwcmVzc1JlZkVycm9yLCByZWZLZXksIGRyb3Bkb3duUmVmKTtcbiAgICB2YXIgZHJvcGRvd25IYW5kbGVLZXlEb3duID0gZnVuY3Rpb24gZHJvcGRvd25IYW5kbGVLZXlEb3duKGV2ZW50KSB7XG4gICAgICB2YXIga2V5ID0gbm9ybWFsaXplQXJyb3dLZXkoZXZlbnQpO1xuICAgICAgaWYgKGtleSAmJiBkcm9wZG93bktleURvd25IYW5kbGVyc1trZXldKSB7XG4gICAgICAgIGRyb3Bkb3duS2V5RG93bkhhbmRsZXJzW2tleV0oZXZlbnQpO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGRyb3Bkb3duSGFuZGxlQ2xpY2sgPSBmdW5jdGlvbiBkcm9wZG93bkhhbmRsZUNsaWNrKCkge1xuICAgICAgZGlzcGF0Y2goe1xuICAgICAgICB0eXBlOiBEcm9wZG93bkNsaWNrXG4gICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBfZXh0ZW5kcygoX2V4dGVuZHMzID0ge30sIF9leHRlbmRzM1tyZWZLZXldID0gaGFuZGxlUmVmcyhyZWYsIGZ1bmN0aW9uIChkcm9wZG93bk5vZGUpIHtcbiAgICAgIGlmIChkcm9wZG93bk5vZGUpIHtcbiAgICAgICAgZHJvcGRvd25SZWYuY3VycmVudCA9IGRyb3Bkb3duTm9kZTtcbiAgICAgIH1cbiAgICB9KSwgX2V4dGVuZHMzKSwgIXByZXZlbnRLZXlBY3Rpb24gJiYge1xuICAgICAgb25LZXlEb3duOiBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbktleURvd24sIGRyb3Bkb3duSGFuZGxlS2V5RG93biksXG4gICAgICBvbkNsaWNrOiBjYWxsQWxsRXZlbnRIYW5kbGVycyhvbkNsaWNrLCBkcm9wZG93bkhhbmRsZUNsaWNrKVxuICAgIH0sIHJlc3QpO1xuICB9LCBbZGlzcGF0Y2gsIGRyb3Bkb3duS2V5RG93bkhhbmRsZXJzLCBzZXRHZXR0ZXJQcm9wQ2FsbEluZm9dKTtcblxuICAvLyByZXR1cm5zXG4gIHZhciBhZGRTZWxlY3RlZEl0ZW0gPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoc2VsZWN0ZWRJdGVtKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25BZGRTZWxlY3RlZEl0ZW0sXG4gICAgICBzZWxlY3RlZEl0ZW06IHNlbGVjdGVkSXRlbVxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgdmFyIHJlbW92ZVNlbGVjdGVkSXRlbSA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChzZWxlY3RlZEl0ZW0pIHtcbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBGdW5jdGlvblJlbW92ZVNlbGVjdGVkSXRlbSxcbiAgICAgIHNlbGVjdGVkSXRlbTogc2VsZWN0ZWRJdGVtXG4gICAgfSk7XG4gIH0sIFtkaXNwYXRjaF0pO1xuICB2YXIgc2V0U2VsZWN0ZWRJdGVtcyA9IHVzZUNhbGxiYWNrKGZ1bmN0aW9uIChuZXdTZWxlY3RlZEl0ZW1zKSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25TZXRTZWxlY3RlZEl0ZW1zLFxuICAgICAgc2VsZWN0ZWRJdGVtczogbmV3U2VsZWN0ZWRJdGVtc1xuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgdmFyIHNldEFjdGl2ZUluZGV4ID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKG5ld0FjdGl2ZUluZGV4KSB7XG4gICAgZGlzcGF0Y2goe1xuICAgICAgdHlwZTogRnVuY3Rpb25TZXRBY3RpdmVJbmRleCxcbiAgICAgIGFjdGl2ZUluZGV4OiBuZXdBY3RpdmVJbmRleFxuICAgIH0pO1xuICB9LCBbZGlzcGF0Y2hdKTtcbiAgdmFyIHJlc2V0ID0gdXNlQ2FsbGJhY2soZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoKHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uUmVzZXRcbiAgICB9KTtcbiAgfSwgW2Rpc3BhdGNoXSk7XG4gIHJldHVybiB7XG4gICAgZ2V0U2VsZWN0ZWRJdGVtUHJvcHM6IGdldFNlbGVjdGVkSXRlbVByb3BzLFxuICAgIGdldERyb3Bkb3duUHJvcHM6IGdldERyb3Bkb3duUHJvcHMsXG4gICAgYWRkU2VsZWN0ZWRJdGVtOiBhZGRTZWxlY3RlZEl0ZW0sXG4gICAgcmVtb3ZlU2VsZWN0ZWRJdGVtOiByZW1vdmVTZWxlY3RlZEl0ZW0sXG4gICAgc2V0U2VsZWN0ZWRJdGVtczogc2V0U2VsZWN0ZWRJdGVtcyxcbiAgICBzZXRBY3RpdmVJbmRleDogc2V0QWN0aXZlSW5kZXgsXG4gICAgcmVzZXQ6IHJlc2V0LFxuICAgIHNlbGVjdGVkSXRlbXM6IHNlbGVjdGVkSXRlbXMsXG4gICAgYWN0aXZlSW5kZXg6IGFjdGl2ZUluZGV4XG4gIH07XG59XG5cbmV4cG9ydCB7IERvd25zaGlmdCQxIGFzIGRlZmF1bHQsIHJlc2V0SWRDb3VudGVyLCB1c2VDb21ib2JveCwgdXNlTXVsdGlwbGVTZWxlY3Rpb24sIHVzZVNlbGVjdCB9O1xuIiwiaW1wb3J0IHtcbiAgICB1c2VDb21ib2JveCxcbiAgICBVc2VDb21ib2JveFByb3BzLFxuICAgIFVzZUNvbWJvYm94UmV0dXJuVmFsdWUsXG4gICAgVXNlQ29tYm9ib3hTdGF0ZSxcbiAgICBVc2VDb21ib2JveFN0YXRlQ2hhbmdlLFxuICAgIFVzZUNvbWJvYm94U3RhdGVDaGFuZ2VPcHRpb25zXG59IGZyb20gXCJkb3duc2hpZnRcIjtcblxuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZU1lbW8gfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IEExMXlTdGF0dXNNZXNzYWdlLCBTaW5nbGVTZWxlY3RvciB9IGZyb20gXCIuLi9oZWxwZXJzL3R5cGVzXCI7XG5cbmludGVyZmFjZSBPcHRpb25zIHtcbiAgICBpbnB1dElkPzogc3RyaW5nO1xuICAgIGxhYmVsSWQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VEb3duc2hpZnRTaW5nbGVTZWxlY3RQcm9wcyhcbiAgICBzZWxlY3RvcjogU2luZ2xlU2VsZWN0b3IsXG4gICAgb3B0aW9uczogT3B0aW9ucyA9IHt9LFxuICAgIGExMXlTdGF0dXNNZXNzYWdlOiBBMTF5U3RhdHVzTWVzc2FnZVxuKTogVXNlQ29tYm9ib3hSZXR1cm5WYWx1ZTxzdHJpbmc+IHtcbiAgICBjb25zdCB7IGlucHV0SWQsIGxhYmVsSWQgfSA9IG9wdGlvbnM7XG5cbiAgICBjb25zdCBkb3duc2hpZnRQcm9wczogVXNlQ29tYm9ib3hQcm9wczxzdHJpbmc+ID0gdXNlTWVtbygoKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpdGVtczogW10sXG4gICAgICAgICAgICBpdGVtVG9TdHJpbmc6ICh2OiBzdHJpbmcgfCBudWxsKSA9PiBzZWxlY3Rvci5jYXB0aW9uLmdldCh2KSxcbiAgICAgICAgICAgIG9uU2VsZWN0ZWRJdGVtQ2hhbmdlKHsgc2VsZWN0ZWRJdGVtIH06IFVzZUNvbWJvYm94U3RhdGVDaGFuZ2U8c3RyaW5nPikge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLnNldFZhbHVlKHNlbGVjdGVkSXRlbSA/PyBudWxsKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbklucHV0VmFsdWVDaGFuZ2UoeyBpbnB1dFZhbHVlLCB0eXBlIH06IFVzZUNvbWJvYm94U3RhdGVDaGFuZ2U8c3RyaW5nPikge1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rvci5vbkZpbHRlcklucHV0Q2hhbmdlICYmIHR5cGUgPT09IHVzZUNvbWJvYm94LnN0YXRlQ2hhbmdlVHlwZXMuSW5wdXRDaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3Iub3B0aW9ucy5zZXRTZWFyY2hUZXJtKGlucHV0VmFsdWUhKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3Iub25GaWx0ZXJJbnB1dENoYW5nZShpbnB1dFZhbHVlISk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3Iub3B0aW9ucy5zZXRTZWFyY2hUZXJtKFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRBMTF5U3RhdHVzTWVzc2FnZShvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRJdGVtID0gc2VsZWN0b3IuY2FwdGlvbi5nZXQoc2VsZWN0b3IuY3VycmVudElkKTtcbiAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZSA9IHNlbGVjdGVkSXRlbVxuICAgICAgICAgICAgICAgICAgICA/IHNlbGVjdG9yLmN1cnJlbnRJZFxuICAgICAgICAgICAgICAgICAgICAgICAgPyBgJHthMTF5U3RhdHVzTWVzc2FnZS5hMTF5U2VsZWN0ZWRWYWx1ZX0gJHtzZWxlY3RlZEl0ZW19LiBgXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFwiTm8gb3B0aW9ucyBzZWxlY3RlZC5cIlxuICAgICAgICAgICAgICAgICAgICA6IFwiXCI7XG4gICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLmlzT3Blbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLnJlc3VsdENvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhMTF5U3RhdHVzTWVzc2FnZS5hMTF5Tm9PcHRpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnJlc3VsdENvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlICs9IGAke2ExMXlTdGF0dXNNZXNzYWdlLmExMXlPcHRpb25zQXZhaWxhYmxlfSAke29wdGlvbnMucmVzdWx0Q291bnR9LiAke2ExMXlTdGF0dXNNZXNzYWdlLmExMXlJbnN0cnVjdGlvbnN9YDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYTExeVN0YXR1c01lc3NhZ2UuYTExeU5vT3B0aW9uO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlZmF1bHRIaWdobGlnaHRlZEluZGV4OiAwLFxuICAgICAgICAgICAgc2VsZWN0ZWRJdGVtOiBudWxsLFxuICAgICAgICAgICAgaW5pdGlhbElucHV0VmFsdWU6IHNlbGVjdG9yLmNhcHRpb24uZ2V0KHNlbGVjdG9yLmN1cnJlbnRJZCksXG4gICAgICAgICAgICBzdGF0ZVJlZHVjZXIoc3RhdGU6IFVzZUNvbWJvYm94U3RhdGU8c3RyaW5nPiwgYWN0aW9uQW5kQ2hhbmdlczogVXNlQ29tYm9ib3hTdGF0ZUNoYW5nZU9wdGlvbnM8c3RyaW5nPikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgY2hhbmdlcywgdHlwZSB9ID0gYWN0aW9uQW5kQ2hhbmdlcztcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2xlYXIgaW5wdXQgd2hlbiB1c2VyIHRvZ2dsZXMgKGNsb3NlcykgZHJvcGRvd24uXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdXNlQ29tYm9ib3guc3RhdGVDaGFuZ2VUeXBlcy5Ub2dnbGVCdXR0b25DbGljazpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uY2hhbmdlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dFZhbHVlOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHdoZW4gaXRlbSBpcyBzZWxlY3RlZCwgZG93bnNoaWZ0IGZpbGxzIGluIGlucHV0IGF1dG9tYXRpY2FsbHksIHByZXZlbnQgdGhhdC5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1c2VDb21ib2JveC5zdGF0ZUNoYW5nZVR5cGVzLkZ1bmN0aW9uU2VsZWN0SXRlbTpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1c2VDb21ib2JveC5zdGF0ZUNoYW5nZVR5cGVzLkl0ZW1DbGljazpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1c2VDb21ib2JveC5zdGF0ZUNoYW5nZVR5cGVzLkNvbnRyb2xsZWRQcm9wVXBkYXRlZFNlbGVjdGVkSXRlbTpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1c2VDb21ib2JveC5zdGF0ZUNoYW5nZVR5cGVzLklucHV0S2V5RG93bkVudGVyOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5jaGFuZ2VzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0VmFsdWU6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1c2VDb21ib2JveC5zdGF0ZUNoYW5nZVR5cGVzLklucHV0Rm9jdXM6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmNoYW5nZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNPcGVuOiBzdGF0ZS5pc09wZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZTogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRlZEluZGV4OiBjaGFuZ2VzLnNlbGVjdGVkSXRlbSA/IC0xIDogdGhpcy5kZWZhdWx0SGlnaGxpZ2h0ZWRJbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjbGVhciBpbnB1dCB3aGVuIHVzZXIgd2FudCB0byBjbG9zZSB0aGUgcG9wdXAgd2l0aCBlc2NhcGUgKG9yIGl0IHdhcyBjbG9zZWQgcHJvZ3JhbW1hdGljYWxseSlcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1c2VDb21ib2JveC5zdGF0ZUNoYW5nZVR5cGVzLklucHV0S2V5RG93bkVzY2FwZTpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1c2VDb21ib2JveC5zdGF0ZUNoYW5nZVR5cGVzLkZ1bmN0aW9uQ2xvc2VNZW51OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5jaGFuZ2VzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSXRlbTogc3RhdGUuc2VsZWN0ZWRJdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzT3BlbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZTogXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB1c2VDb21ib2JveC5zdGF0ZUNoYW5nZVR5cGVzLklucHV0Qmx1cjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IC4uLmNoYW5nZXMgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5wdXRJZCxcbiAgICAgICAgICAgIGxhYmVsSWRcbiAgICAgICAgfTtcbiAgICB9LCBbXG4gICAgICAgIHNlbGVjdG9yLFxuICAgICAgICBpbnB1dElkLFxuICAgICAgICBsYWJlbElkLFxuICAgICAgICBhMTF5U3RhdHVzTWVzc2FnZS5hMTF5U2VsZWN0ZWRWYWx1ZSxcbiAgICAgICAgYTExeVN0YXR1c01lc3NhZ2UuYTExeU9wdGlvbnNBdmFpbGFibGUsXG4gICAgICAgIGExMXlTdGF0dXNNZXNzYWdlLmExMXlOb09wdGlvbixcbiAgICAgICAgYTExeVN0YXR1c01lc3NhZ2UuYTExeUluc3RydWN0aW9uc1xuICAgIF0pO1xuXG4gICAgY29uc3QgcmV0dXJuVmFsID0gdXNlQ29tYm9ib3goe1xuICAgICAgICAuLi5kb3duc2hpZnRQcm9wcyxcbiAgICAgICAgaXRlbXM6IHNlbGVjdG9yLm9wdGlvbnMuZ2V0QWxsKCkgPz8gW10sXG4gICAgICAgIHNlbGVjdGVkSXRlbTogc2VsZWN0b3IuY3VycmVudElkXG4gICAgfSk7XG5cbiAgICBjb25zdCB7IGNsb3NlTWVudSB9ID0gcmV0dXJuVmFsO1xuXG4gICAgc2VsZWN0b3Iub25MZWF2ZUV2ZW50ID0gdXNlQ2FsbGJhY2soY2xvc2VNZW51LCBbY2xvc2VNZW51XSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsO1xufVxuIiwiaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZVJlZiB9IGZyb20gXCJyZWFjdFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEluZmluaXRlQm9keVByb3BzIHtcbiAgICBoYXNNb3JlSXRlbXM6IGJvb2xlYW47XG4gICAgaXNJbmZpbml0ZTogYm9vbGVhbjtcbiAgICBzZXRQYWdlPzogKCkgPT4gdm9pZDtcbn1cblxudHlwZSBUcmFja1Njcm9sbGluZ0ZuID0gKGU6IGFueSkgPT4gdm9pZDtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUluZmluaXRlQ29udHJvbChwcm9wczogSW5maW5pdGVCb2R5UHJvcHMpOiBbVHJhY2tTY3JvbGxpbmdGbl0ge1xuICAgIGNvbnN0IHsgc2V0UGFnZSwgaGFzTW9yZUl0ZW1zIH0gPSBwcm9wcztcbiAgICBjb25zdCBsb2FkaW5nUmVmID0gdXNlUmVmKGZhbHNlKTtcblxuICAgIGNvbnN0IHRyYWNrU2Nyb2xsaW5nID0gdXNlQ2FsbGJhY2soXG4gICAgICAgIChldmVudDogYW55KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbCA9IGV2ZW50Py50YXJnZXQ7XG4gICAgICAgICAgICBpZiAoIWVsIHx8IGxvYWRpbmdSZWYuY3VycmVudCB8fCAhaGFzTW9yZUl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbmVhckJvdHRvbSA9IGVsLnNjcm9sbEhlaWdodCAtIGVsLnNjcm9sbFRvcCAtIGVsLmNsaWVudEhlaWdodCA8IDUwO1xuICAgICAgICAgICAgaWYgKG5lYXJCb3R0b20gJiYgc2V0UGFnZSkge1xuICAgICAgICAgICAgICAgIGxvYWRpbmdSZWYuY3VycmVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgc2V0UGFnZSgpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nUmVmLmN1cnJlbnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBbc2V0UGFnZSwgaGFzTW9yZUl0ZW1zXVxuICAgICk7XG5cbiAgICByZXR1cm4gW3RyYWNrU2Nyb2xsaW5nXTtcbn1cbiIsImltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBJbmZpbml0ZUJvZHlQcm9wcywgdXNlSW5maW5pdGVDb250cm9sIH0gZnJvbSBcIkBtZW5kaXgvd2lkZ2V0LXBsdWdpbi1ncmlkL2NvbXBvbmVudHMvSW5maW5pdGVCb2R5XCI7XG5pbXBvcnQgeyBMaXN0VmFsdWUgfSBmcm9tIFwibWVuZGl4XCI7XG5cbnR5cGUgVXNlTGF6eUxvYWRpbmdQcm9wcyA9IFBpY2s8SW5maW5pdGVCb2R5UHJvcHMsIFwiaGFzTW9yZUl0ZW1zXCIgfCBcImlzSW5maW5pdGVcIj4gJiB7XG4gICAgaXNPcGVuOiBib29sZWFuO1xuICAgIGxvYWRNb3JlPzogKCkgPT4gdm9pZDtcbiAgICBkYXRhc291cmNlRmlsdGVyPzogTGlzdFZhbHVlW1wiZmlsdGVyXCJdO1xuICAgIHJlYWRPbmx5PzogYm9vbGVhbjtcbn07XG5cbnR5cGUgVXNlTGF6eUxvYWRpbmdSZXR1cm4gPSB7XG4gICAgb25TY3JvbGw6IChlOiBhbnkpID0+IHZvaWQ7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlTGF6eUxvYWRpbmcocHJvcHM6IFVzZUxhenlMb2FkaW5nUHJvcHMpOiBVc2VMYXp5TG9hZGluZ1JldHVybiB7XG4gICAgY29uc3QgeyBoYXNNb3JlSXRlbXMsIGlzSW5maW5pdGUsIGxvYWRNb3JlIH0gPSBwcm9wcztcblxuICAgIGNvbnN0IHNldFBhZ2VDYWxsYmFjayA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgaWYgKGxvYWRNb3JlKSB7XG4gICAgICAgICAgICBsb2FkTW9yZSgpO1xuICAgICAgICB9XG4gICAgfSwgW2xvYWRNb3JlXSk7XG5cbiAgICBjb25zdCBbdHJhY2tTY3JvbGxpbmddID0gdXNlSW5maW5pdGVDb250cm9sKHsgaGFzTW9yZUl0ZW1zLCBpc0luZmluaXRlLCBzZXRQYWdlOiBzZXRQYWdlQ2FsbGJhY2sgfSk7XG5cbiAgICByZXR1cm4geyBvblNjcm9sbDogdHJhY2tTY3JvbGxpbmcgfTtcbn1cbiIsImltcG9ydCB7IFJlYWN0RWxlbWVudCwgY3JlYXRlRWxlbWVudCB9IGZyb20gXCJyZWFjdFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFsZXJ0UHJvcHMge1xuICAgIGNoaWxkcmVuPzogc3RyaW5nO1xuICAgIGlkPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gVmFsaWRhdGlvbkFsZXJ0KHsgY2hpbGRyZW4sIGlkIH06IEFsZXJ0UHJvcHMpOiBSZWFjdEVsZW1lbnQgfCBudWxsIHtcbiAgICBpZiAoIWNoaWxkcmVuKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJhbGVydCBhbGVydC1kYW5nZXIgbXgtdmFsaWRhdGlvbi1tZXNzYWdlXCIsIGlkIH0sIGNoaWxkcmVuKTtcbn1cbiIsImltcG9ydCBjbGFzc05hbWVzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgeyBSZWFjdEVsZW1lbnQgfSBmcm9tIFwicmVhY3RcIjtcblxudHlwZSBTcGlubmVyTG9hZGVyUHJvcHMgPSB7XG4gICAgc2l6ZT86IFwic21hbGxcIiB8IFwibWVkaXVtXCI7XG4gICAgd2l0aE1hcmdpbnM/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIFNwaW5uZXJMb2FkZXIoeyBzaXplID0gXCJtZWRpdW1cIiwgd2l0aE1hcmdpbnMgPSBmYWxzZSB9OiBTcGlubmVyTG9hZGVyUHJvcHMpOiBSZWFjdEVsZW1lbnQge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFwid2lkZ2V0LWNvbWJvYm94LXNwaW5uZXJcIiwgeyBcIndpZGdldC1jb21ib2JveC1zcGlubmVyLW1hcmdpblwiOiB3aXRoTWFyZ2lucyB9KX0+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFwid2lkZ2V0LWNvbWJvYm94LXNwaW5uZXItbG9hZGVyXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ3aWRnZXQtY29tYm9ib3gtc3Bpbm5lci1sb2FkZXItc21hbGxcIjogc2l6ZSA9PT0gXCJzbWFsbFwiXG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuIiwiaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSBcImNsYXNzbmFtZXNcIjtcbmltcG9ydCB7IFVzZUNvbWJvYm94R2V0VG9nZ2xlQnV0dG9uUHJvcHNPcHRpb25zIH0gZnJvbSBcImRvd25zaGlmdC90eXBpbmdzXCI7XG5pbXBvcnQgeyBmb3J3YXJkUmVmLCBGcmFnbWVudCwgUHJvcHNXaXRoQ2hpbGRyZW4sIFJlYWN0RWxlbWVudCwgUmVmT2JqZWN0IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBEb3duQXJyb3cgfSBmcm9tIFwiLi4vYXNzZXRzL2ljb25zXCI7XG5pbXBvcnQgeyBWYWxpZGF0aW9uQWxlcnQgfSBmcm9tIFwiQG1lbmRpeC93aWRnZXQtcGx1Z2luLWNvbXBvbmVudC1raXQvQWxlcnRcIjtcbmltcG9ydCB7IFJlYWRPbmx5U3R5bGVFbnVtIH0gZnJvbSBcInR5cGluZ3MvR3JvdXBlZENvbWJvYm94UHJvcHNcIjtcbmltcG9ydCB7IFNwaW5uZXJMb2FkZXIgfSBmcm9tIFwiLi9TcGlubmVyTG9hZGVyXCI7XG5cbmludGVyZmFjZSBDb21ib2JveFdyYXBwZXJQcm9wcyBleHRlbmRzIFByb3BzV2l0aENoaWxkcmVuIHtcbiAgICBpc09wZW46IGJvb2xlYW47XG4gICAgcmVhZE9ubHk6IGJvb2xlYW47XG4gICAgcmVhZE9ubHlTdHlsZTogUmVhZE9ubHlTdHlsZUVudW07XG4gICAgZ2V0VG9nZ2xlQnV0dG9uUHJvcHM6IChvcHRpb25zPzogVXNlQ29tYm9ib3hHZXRUb2dnbGVCdXR0b25Qcm9wc09wdGlvbnMgfCB1bmRlZmluZWQpID0+IGFueTtcbiAgICB2YWxpZGF0aW9uPzogc3RyaW5nO1xuICAgIGlzTG9hZGluZzogYm9vbGVhbjtcbiAgICBpc011bHRpc2VsZWN0QWN0aXZlPzogYm9vbGVhbjtcbiAgICBlcnJvcklkPzogc3RyaW5nO1xufVxuZXhwb3J0IGNvbnN0IENvbWJvYm94V3JhcHBlciA9IGZvcndhcmRSZWYoXG4gICAgKHByb3BzOiBDb21ib2JveFdyYXBwZXJQcm9wcywgcmVmOiBSZWZPYmplY3Q8SFRNTERpdkVsZW1lbnQ+KTogUmVhY3RFbGVtZW50ID0+IHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgaXNPcGVuLFxuICAgICAgICAgICAgcmVhZE9ubHksXG4gICAgICAgICAgICByZWFkT25seVN0eWxlLFxuICAgICAgICAgICAgZ2V0VG9nZ2xlQnV0dG9uUHJvcHMsXG4gICAgICAgICAgICB2YWxpZGF0aW9uLFxuICAgICAgICAgICAgY2hpbGRyZW4sXG4gICAgICAgICAgICBpc0xvYWRpbmcsXG4gICAgICAgICAgICBpc011bHRpc2VsZWN0QWN0aXZlLFxuICAgICAgICAgICAgZXJyb3JJZFxuICAgICAgICB9ID0gcHJvcHM7XG4gICAgICAgIGNvbnN0IHsgaWQsIG9uQ2xpY2sgfSA9IGdldFRvZ2dsZUJ1dHRvblByb3BzKCk7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgIHJlZj17cmVmfVxuICAgICAgICAgICAgICAgICAgICB0YWJJbmRleD17LTF9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcIndpZGdldC1jb21ib2JveC1pbnB1dC1jb250YWluZXJcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aWRnZXQtY29tYm9ib3gtaW5wdXQtY29udGFpbmVyLWFjdGl2ZVwiOiBpc09wZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBcIndpZGdldC1jb21ib2JveC1pbnB1dC1jb250YWluZXItZGlzYWJsZWRcIjogcmVhZE9ubHksXG4gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tY29udHJvbC1zdGF0aWNcIjogcmVhZE9ubHkgJiYgcmVhZE9ubHlTdHlsZSA9PT0gXCJ0ZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tY29udHJvbFwiOiAhcmVhZE9ubHkgfHwgcmVhZE9ubHlTdHlsZSAhPT0gXCJ0ZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIndpZGdldC1jb21ib2JveC1tdWx0aXNlbGVjdFwiOiBpc011bHRpc2VsZWN0QWN0aXZlXG4gICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICBpZD17aWR9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICAgICAgICAgIHtyZWFkT25seSAmJiByZWFkT25seVN0eWxlID09PSBcInRleHRcIiA/IG51bGwgOiBpc0xvYWRpbmcgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndpZGdldC1jb21ib2JveC1kb3duLWFycm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFNwaW5uZXJMb2FkZXIgc2l6ZT1cInNtYWxsXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3aWRnZXQtY29tYm9ib3gtZG93bi1hcnJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxEb3duQXJyb3cgaXNPcGVuPXtpc09wZW59IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7dmFsaWRhdGlvbiAmJiA8VmFsaWRhdGlvbkFsZXJ0IGlkPXtlcnJvcklkfT57dmFsaWRhdGlvbn08L1ZhbGlkYXRpb25BbGVydD59XG4gICAgICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgICApO1xuICAgIH1cbik7XG4iLCJpbXBvcnQgY2xhc3NOYW1lcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IHsgUHJvcHNXaXRoQ2hpbGRyZW4sIFJlYWN0RWxlbWVudCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgRG93bkFycm93IH0gZnJvbSBcIi4uL2Fzc2V0cy9pY29uc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gUGxhY2Vob2xkZXIoKTogUmVhY3RFbGVtZW50IHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCB3aWRnZXQtY29tYm9ib3gtcGxhY2Vob2xkZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94LXBsYWNlaG9sZGVyLWRvd24tYXJyb3dcIj5cbiAgICAgICAgICAgICAgICA8RG93bkFycm93IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIE5vT3B0aW9uc1BsYWNlaG9sZGVyKHByb3BzOiBQcm9wc1dpdGhDaGlsZHJlbik6IFJlYWN0RWxlbWVudCB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGxpIGNsYXNzTmFtZT1cIndpZGdldC1jb21ib2JveC1pdGVtIHdpZGdldC1jb21ib2JveC1uby1vcHRpb25zXCIgcm9sZT1cIm9wdGlvblwiPlxuICAgICAgICAgICAge3Byb3BzLmNoaWxkcmVufVxuICAgICAgICA8L2xpPlxuICAgICk7XG59XG5cbmludGVyZmFjZSBJbnB1dFBsYWNlaG9sZGVyUHJvcHMgZXh0ZW5kcyBQcm9wc1dpdGhDaGlsZHJlbiB7XG4gICAgaXNFbXB0eTogYm9vbGVhbjtcbiAgICB0eXBlPzogXCJ0ZXh0XCIgfCBcImN1c3RvbVwiO1xufVxuZXhwb3J0IGZ1bmN0aW9uIElucHV0UGxhY2Vob2xkZXIocHJvcHM6IElucHV0UGxhY2Vob2xkZXJQcm9wcyk6IFJlYWN0RWxlbWVudCB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKGB3aWRnZXQtY29tYm9ib3gtcGxhY2Vob2xkZXItJHtwcm9wcy50eXBlID8/IFwidGV4dFwifWAsIHtcbiAgICAgICAgICAgICAgICBcIndpZGdldC1jb21ib2JveC1wbGFjZWhvbGRlci1lbXB0eVwiOiBwcm9wcy5pc0VtcHR5XG4gICAgICAgICAgICB9KX1cbiAgICAgICAgPlxuICAgICAgICAgICAge3Byb3BzLmNoaWxkcmVufVxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuIiwiLyoqXG4gKiBVdGlsaXR5IGZvciBncm91cGluZyBmbGF0IGxpc3RzIG9mIG9wdGlvbiBJRHMgaW50byB0aXRsZWQgc2VjdGlvbnMuXG4gKiBJdGVtcyBhcmUgc29ydGVkIEEtWiBieSB0aGVpciBncm91cCB0aXRsZSBiZWZvcmUgZ3JvdXBpbmcuXG4gKiBJdGVtcyB3aXRoIG5vIGdyb3VwIHRpdGxlIGFwcGVhciBpbiBhIGZpbmFsIFwidW5ncm91cGVkXCIgc2VnbWVudC5cbiAqL1xuXG5leHBvcnQgaW50ZXJmYWNlIEdyb3VwU2VnbWVudCB7XG4gICAgLyoqIG51bGwgbWVhbnMgdGhlIGl0ZW1zIGhhdmUgbm8gZ3JvdXAgdGl0bGUgKHVuZ3JvdXBlZCkgKi9cbiAgICBncm91cFRpdGxlOiBzdHJpbmcgfCBudWxsO1xuICAgIGl0ZW1zOiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBHcm91cHMgYSBsaXN0IG9mIGl0ZW0gSURzIGJ5IHRoZWlyIGdyb3VwIHRpdGxlLlxuICogQXV0b21hdGljYWxseSBzb3J0cyBncm91cHMgQS1aLiBVbmdyb3VwZWQgaXRlbXMgYXBwZWFyIGF0IHRoZSBlbmQuXG4gKlxuICogQHBhcmFtIGl0ZW1zICAgICAgIEZsYXQgbGlzdCBvZiBvcHRpb24gSURzXG4gKiBAcGFyYW0gZ2V0R3JvdXBGbiAgRnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBncm91cCB0aXRsZSBzdHJpbmcgZm9yIGFuIElEIChvciBudWxsL2VtcHR5KVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBJdGVtcyhpdGVtczogc3RyaW5nW10sIGdldEdyb3VwRm46IChpZDogc3RyaW5nKSA9PiBzdHJpbmcgfCBudWxsKTogR3JvdXBTZWdtZW50W10ge1xuICAgIGlmIChpdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIC8vIEJ1aWxkIGEgbWFwOiBncm91cFRpdGxlIOKGkiBpdGVtc1tdLCBwcmVzZXJ2aW5nIGl0ZW0gb3JkZXIgd2l0aGluIGVhY2ggZ3JvdXBcbiAgICBjb25zdCBncm91cE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmdbXT4oKTtcbiAgICBjb25zdCB1bmdyb3VwZWQ6IHN0cmluZ1tdID0gW107XG5cbiAgICBmb3IgKGNvbnN0IGlkIG9mIGl0ZW1zKSB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gZ2V0R3JvdXBGbihpZCk7XG4gICAgICAgIGlmICghdGl0bGUgfHwgdGl0bGUudHJpbSgpID09PSBcIlwiKSB7XG4gICAgICAgICAgICB1bmdyb3VwZWQucHVzaChpZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWdyb3VwTWFwLmhhcyh0aXRsZSkpIHtcbiAgICAgICAgICAgICAgICBncm91cE1hcC5zZXQodGl0bGUsIFtdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdyb3VwTWFwLmdldCh0aXRsZSkhLnB1c2goaWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gU29ydCBncm91cCB0aXRsZXMgQS1aIChjYXNlLWluc2Vuc2l0aXZlKVxuICAgIGNvbnN0IHNvcnRlZFRpdGxlcyA9IEFycmF5LmZyb20oZ3JvdXBNYXAua2V5cygpKS5zb3J0KChhLCBiKSA9PlxuICAgICAgICBhLmxvY2FsZUNvbXBhcmUoYiwgdW5kZWZpbmVkLCB7IHNlbnNpdGl2aXR5OiBcImJhc2VcIiB9KVxuICAgICk7XG5cbiAgICBjb25zdCBzZWdtZW50czogR3JvdXBTZWdtZW50W10gPSBzb3J0ZWRUaXRsZXMubWFwKHRpdGxlID0+ICh7XG4gICAgICAgIGdyb3VwVGl0bGU6IHRpdGxlLFxuICAgICAgICBpdGVtczogZ3JvdXBNYXAuZ2V0KHRpdGxlKSFcbiAgICB9KSk7XG5cbiAgICAvLyBBcHBlbmQgdW5ncm91cGVkIGF0IHRoZSBlbmRcbiAgICBpZiAodW5ncm91cGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2VnbWVudHMucHVzaCh7IGdyb3VwVGl0bGU6IG51bGwsIGl0ZW1zOiB1bmdyb3VwZWQgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlZ21lbnRzO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgaXRlbXMgYXJyYXkgcHJvZHVjZXMgYXQgbGVhc3Qgb25lIG5vbi1udWxsIGdyb3VwIHRpdGxlLlxuICogVXNlZCB0byBjb25kaXRpb25hbGx5IHJlbmRlciBncm91cCBoZWFkZXJzIHZzIHBsYWluIGxpc3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNHcm91cGluZyhpdGVtczogc3RyaW5nW10sIGdldEdyb3VwRm46IChpZDogc3RyaW5nKSA9PiBzdHJpbmcgfCBudWxsKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGl0ZW1zLnNvbWUoaWQgPT4ge1xuICAgICAgICBjb25zdCB0aXRsZSA9IGdldEdyb3VwRm4oaWQpO1xuICAgICAgICByZXR1cm4gdGl0bGUgIT09IG51bGwgJiYgdGl0bGUudHJpbSgpICE9PSBcIlwiO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5cbi8qKlxuICogT2JzZXJ2ZXMgdGhlIHBvc2l0aW9uIChib3VuZGluZyByZWN0KSBvZiBhbiBlbGVtZW50IHdoaWxlIGFjdGl2ZS5cbiAqIFJldHVybnMgdGhlIGN1cnJlbnQgRE9NUmVjdCBvciB1bmRlZmluZWQgd2hlbiBub3Qgb2JzZXJ2aW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlUG9zaXRpb25PYnNlcnZlcihlbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwsIGFjdGl2ZTogYm9vbGVhbik6IERPTVJlY3QgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IFtyZWN0LCBzZXRSZWN0XSA9IHVzZVN0YXRlPERPTVJlY3QgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gICAgY29uc3QgcmFmUmVmID0gdXNlUmVmPG51bWJlcj4oMCk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoIWVsZW1lbnQgfHwgIWFjdGl2ZSkge1xuICAgICAgICAgICAgc2V0UmVjdCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb2JzZXJ2ZSgpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgc2V0UmVjdChlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJhZlJlZi5jdXJyZW50ID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG9ic2VydmUpO1xuICAgICAgICB9XG5cbiAgICAgICAgb2JzZXJ2ZSgpO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShyYWZSZWYuY3VycmVudCk7XG4gICAgICAgIH07XG4gICAgfSwgW2VsZW1lbnQsIGFjdGl2ZV0pO1xuXG4gICAgcmV0dXJuIHJlY3Q7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZGVib3VuY2U8VCBleHRlbmRzICguLi5hcmdzOiBhbnlbXSkgPT4gYW55PihmbjogVCwgbXM6IG51bWJlcik6IFsoKC4uLmFyZ3M6IFBhcmFtZXRlcnM8VD4pID0+IHZvaWQpLCAoKSA9PiB2b2lkXSB7XG4gICAgbGV0IHRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xuICAgIGNvbnN0IGRlYm91bmNlZCA9ICguLi5hcmdzOiBQYXJhbWV0ZXJzPFQ+KSA9PiB7XG4gICAgICAgIGlmICh0aW1lcikgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IGZuKC4uLmFyZ3MpLCBtcyk7XG4gICAgfTtcbiAgICBjb25zdCBhYm9ydCA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRpbWVyKSBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgIH07XG4gICAgcmV0dXJuIFtkZWJvdW5jZWQsIGFib3J0XTtcbn1cbiIsImltcG9ydCB7IENTU1Byb3BlcnRpZXMsIFJlZk9iamVjdCwgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyB1c2VQb3NpdGlvbk9ic2VydmVyIH0gZnJvbSBcIkBtZW5kaXgvd2lkZ2V0LXBsdWdpbi1ob29rcy91c2VQb3NpdGlvbk9ic2VydmVyXCI7XG5pbXBvcnQgeyBkZWJvdW5jZSB9IGZyb20gXCJAbWVuZGl4L3dpZGdldC1wbHVnaW4tcGxhdGZvcm0vdXRpbHMvZGVib3VuY2VcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZU1lbnVTdHlsZTxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+KGlzT3BlbjogYm9vbGVhbik6IFtSZWZPYmplY3Q8VD4sIENTU1Byb3BlcnRpZXNdIHtcbiAgICBjb25zdCByZWYgPSB1c2VSZWY8VD4obnVsbCk7XG4gICAgY29uc3QgW3N0eWxlLCBzZXRTdHlsZV0gPSB1c2VTdGF0ZTxDU1NQcm9wZXJ0aWVzPih7IHZpc2liaWxpdHk6IFwiaGlkZGVuXCIsIHBvc2l0aW9uOiBcImZpeGVkXCIgfSk7XG4gICAgY29uc3QgW3NldFN0eWxlRGVib3VuY2VkLCBhYm9ydF0gPSB1c2VNZW1vKCgpID0+IGRlYm91bmNlKHNldFN0eWxlLCAzMiksIFtzZXRTdHlsZV0pO1xuICAgIGNvbnN0IG1lbnVIZWlnaHQgPSByZWYuY3VycmVudD8ub2Zmc2V0SGVpZ2h0ID8/IDA7XG4gICAgY29uc3QgdGFyZ2V0Qm94ID0gdXNlUG9zaXRpb25PYnNlcnZlcihyZWYuY3VycmVudD8ucGFyZW50RWxlbWVudCA/PyBudWxsLCBpc09wZW4pO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKHRhcmdldEJveCA9PT0gdW5kZWZpbmVkIHx8IHJlZi5jdXJyZW50ID09PSBudWxsIHx8ICFpc09wZW4pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldFN0eWxlRGVib3VuY2VkKHtcbiAgICAgICAgICAgIHZpc2liaWxpdHk6IFwidmlzaWJsZVwiLFxuICAgICAgICAgICAgcG9zaXRpb246IFwiZml4ZWRcIixcbiAgICAgICAgICAgIHdpZHRoOiB0YXJnZXRCb3gud2lkdGgsXG4gICAgICAgICAgICAuLi5nZXRNZW51UG9zaXRpb24odGFyZ2V0Qm94LCByZWYuY3VycmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGFib3J0O1xuICAgIH0sIFttZW51SGVpZ2h0LCBpc09wZW4sIHRhcmdldEJveCwgc2V0U3R5bGVEZWJvdW5jZWQsIGFib3J0XSk7XG5cbiAgICByZXR1cm4gW3JlZiwgc3R5bGVdO1xufVxuXG5mdW5jdGlvbiBnZXRNZW51UG9zaXRpb24odGFyZ2V0Qm94OiBET01SZWN0LCBtZW51Qm94OiBET01SZWN0KTogQ1NTUHJvcGVydGllcyB7XG4gICAgY29uc3QgeyBoZWlnaHQgfSA9IG1lbnVCb3g7XG4gICAgY29uc3QgYm90dG9tU3BhY2UgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSB0YXJnZXRCb3guYm90dG9tO1xuICAgIGNvbnN0IHRvcFNwYWNlID0gdGFyZ2V0Qm94LnRvcCAtIGhlaWdodCA8IDAgPyB0YXJnZXRCb3gudG9wIC0gaGVpZ2h0IDogMDtcblxuICAgIGlmIChib3R0b21TcGFjZSA8IGhlaWdodCkge1xuICAgICAgICByZXR1cm4geyBib3R0b206IHdpbmRvdy5pbm5lckhlaWdodCAtIHRhcmdldEJveC50b3AgKyB0b3BTcGFjZSwgbGVmdDogdGFyZ2V0Qm94LmxlZnQgfTtcbiAgICB9XG4gICAgcmV0dXJuIHsgdG9wOiB0YXJnZXRCb3guYm90dG9tLCBsZWZ0OiB0YXJnZXRCb3gubGVmdCB9O1xufVxuIiwiaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSBcImNsYXNzbmFtZXNcIjtcbmltcG9ydCB7IFVzZUNvbWJvYm94UHJvcEdldHRlcnMgfSBmcm9tIFwiZG93bnNoaWZ0L3R5cGluZ3NcIjtcbmltcG9ydCB7IE1vdXNlRXZlbnQsIFByb3BzV2l0aENoaWxkcmVuLCBSZWFjdEVsZW1lbnQsIFJlYWN0Tm9kZSB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgdXNlTWVudVN0eWxlIH0gZnJvbSBcIi4uL2hvb2tzL3VzZU1lbnVTdHlsZVwiO1xuaW1wb3J0IHsgTm9PcHRpb25zUGxhY2Vob2xkZXIgfSBmcm9tIFwiLi9QbGFjZWhvbGRlclwiO1xuXG5pbnRlcmZhY2UgQ29tYm9ib3hNZW51V3JhcHBlclByb3BzIGV4dGVuZHMgUHJvcHNXaXRoQ2hpbGRyZW4sIFBhcnRpYWw8VXNlQ29tYm9ib3hQcm9wR2V0dGVyczxzdHJpbmc+PiB7XG4gICAgYWx3YXlzT3Blbj86IGJvb2xlYW47XG4gICAgaGlnaGxpZ2h0ZWRJbmRleD86IG51bWJlciB8IG51bGw7XG4gICAgaXNFbXB0eTogYm9vbGVhbjtcbiAgICBpc0xvYWRpbmc6IGJvb2xlYW47XG4gICAgaXNPcGVuOiBib29sZWFuO1xuICAgIGxhenlMb2FkaW5nOiBib29sZWFuO1xuICAgIGxvYWRlcjogUmVhY3ROb2RlO1xuICAgIG1lbnVGb290ZXJDb250ZW50PzogUmVhY3ROb2RlO1xuICAgIG1lbnVIZWFkZXJDb250ZW50PzogUmVhY3ROb2RlO1xuICAgIG5vT3B0aW9uc1RleHQ/OiBzdHJpbmc7XG4gICAgb25PcHRpb25DbGljaz86IChlOiBNb3VzZUV2ZW50KSA9PiB2b2lkO1xuICAgIG9uU2Nyb2xsPzogKGU6IGFueSkgPT4gdm9pZDtcbn1cblxuZnVuY3Rpb24gUHJldmVudE1lbnVDbG9zZUV2ZW50SGFuZGxlcihlOiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbn1cblxuZnVuY3Rpb24gRm9yY2VQcmV2ZW50TWVudUNsb3NlRXZlbnRIYW5kbGVyKGU6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENvbWJvYm94TWVudVdyYXBwZXIocHJvcHM6IENvbWJvYm94TWVudVdyYXBwZXJQcm9wcyk6IFJlYWN0RWxlbWVudCB7XG4gICAgY29uc3Qge1xuICAgICAgICBhbHdheXNPcGVuLFxuICAgICAgICBjaGlsZHJlbixcbiAgICAgICAgZ2V0TWVudVByb3BzLFxuICAgICAgICBoaWdobGlnaHRlZEluZGV4LFxuICAgICAgICBpc0VtcHR5LFxuICAgICAgICBpc0xvYWRpbmcsXG4gICAgICAgIGlzT3BlbixcbiAgICAgICAgbGF6eUxvYWRpbmcsXG4gICAgICAgIGxvYWRlcixcbiAgICAgICAgbWVudUZvb3RlckNvbnRlbnQsXG4gICAgICAgIG1lbnVIZWFkZXJDb250ZW50LFxuICAgICAgICBub09wdGlvbnNUZXh0LFxuICAgICAgICBvbk9wdGlvbkNsaWNrLFxuICAgICAgICBvblNjcm9sbFxuICAgIH0gPSBwcm9wcztcblxuICAgIGNvbnN0IFtyZWYsIHN0eWxlXSA9IHVzZU1lbnVTdHlsZTxIVE1MRGl2RWxlbWVudD4oaXNPcGVuKTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICAgIHJlZj17cmVmfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFwid2lkZ2V0LWNvbWJvYm94LW1lbnVcIiwgeyBcIndpZGdldC1jb21ib2JveC1tZW51LWhpZGRlblwiOiAhaXNPcGVuIH0pfVxuICAgICAgICAgICAgc3R5bGU9e1xuICAgICAgICAgICAgICAgIGFsd2F5c09wZW5cbiAgICAgICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiYmxvY2tcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogXCJ2aXNpYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBcInJlbGF0aXZlXCJcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDogc3R5bGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgPlxuICAgICAgICAgICAge21lbnVIZWFkZXJDb250ZW50ICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIndpZGdldC1jb21ib2JveC1tZW51LWhlYWRlciB3aWRnZXQtY29tYm9ib3gtaXRlbVwiXG4gICAgICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXtQcmV2ZW50TWVudUNsb3NlRXZlbnRIYW5kbGVyfVxuICAgICAgICAgICAgICAgICAgICB0YWJJbmRleD17MH1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHttZW51SGVhZGVyQ29udGVudH1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8dWxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXCJ3aWRnZXQtY29tYm9ib3gtbWVudS1saXN0XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ3aWRnZXQtY29tYm9ib3gtbWVudS1oaWdobGlnaHRlZFwiOiAoaGlnaGxpZ2h0ZWRJbmRleCA/PyAtMSkgPj0gMCxcbiAgICAgICAgICAgICAgICAgICAgXCJ3aWRnZXQtY29tYm9ib3gtbWVudS1sYXp5LXNjcm9sbFwiOiBsYXp5TG9hZGluZyAmJiAhaXNFbXB0eVxuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIHsuLi5nZXRNZW51UHJvcHM/LihcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljazogb25PcHRpb25DbGljayxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VEb3duOiBGb3JjZVByZXZlbnRNZW51Q2xvc2VFdmVudEhhbmRsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBvblNjcm9sbFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7IHN1cHByZXNzUmVmRXJyb3I6IHRydWUgfVxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2lzT3BlbiA/IChcbiAgICAgICAgICAgICAgICAgICAgaXNFbXB0eSAmJiAhaXNMb2FkaW5nID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPE5vT3B0aW9uc1BsYWNlaG9sZGVyPntub09wdGlvbnNUZXh0fTwvTm9PcHRpb25zUGxhY2Vob2xkZXI+XG4gICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlblxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgICAge2xvYWRlcn1cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICB7bWVudUZvb3RlckNvbnRlbnQgJiYgKFxuICAgICAgICAgICAgICAgIDxkaXYgdGFiSW5kZXg9ezB9IGNsYXNzTmFtZT1cIndpZGdldC1jb21ib2JveC1tZW51LWZvb3RlclwiIG9uTW91c2VEb3duPXtQcmV2ZW50TWVudUNsb3NlRXZlbnRIYW5kbGVyfT5cbiAgICAgICAgICAgICAgICAgICAge21lbnVGb290ZXJDb250ZW50fVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cbiIsImltcG9ydCBjbGFzc05hbWVzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgeyBVc2VDb21ib2JveFByb3BHZXR0ZXJzIH0gZnJvbSBcImRvd25zaGlmdC90eXBpbmdzXCI7XG5pbXBvcnQgeyBQcm9wc1dpdGhDaGlsZHJlbiwgUmVhY3RFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5cbmludGVyZmFjZSBDb21ib2JveE9wdGlvbldyYXBwZXJQcm9wcyBleHRlbmRzIFByb3BzV2l0aENoaWxkcmVuLCBQYXJ0aWFsPFVzZUNvbWJvYm94UHJvcEdldHRlcnM8c3RyaW5nPj4ge1xuICAgIGlzU2VsZWN0ZWQ/OiBib29sZWFuO1xuICAgIGlzSGlnaGxpZ2h0ZWQ/OiBib29sZWFuO1xuICAgIGl0ZW06IHN0cmluZztcbiAgICBpbmRleDogbnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQ29tYm9ib3hPcHRpb25XcmFwcGVyKHByb3BzOiBDb21ib2JveE9wdGlvbldyYXBwZXJQcm9wcyk6IFJlYWN0RWxlbWVudCB7XG4gICAgY29uc3QgeyBjaGlsZHJlbiwgaXNTZWxlY3RlZCwgaXNIaWdobGlnaHRlZCwgaXRlbSwgZ2V0SXRlbVByb3BzLCBpbmRleCB9ID0gcHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGxpXG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXCJ3aWRnZXQtY29tYm9ib3gtaXRlbVwiLCB7XG4gICAgICAgICAgICAgICAgXCJ3aWRnZXQtY29tYm9ib3gtaXRlbS1zZWxlY3RlZFwiOiBpc1NlbGVjdGVkLFxuICAgICAgICAgICAgICAgIFwid2lkZ2V0LWNvbWJvYm94LWl0ZW0taGlnaGxpZ2h0ZWRcIjogaXNIaWdobGlnaHRlZFxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICB7Li4uZ2V0SXRlbVByb3BzPy4oe1xuICAgICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICAgIGl0ZW1cbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgYXJpYS1zZWxlY3RlZD17aXNTZWxlY3RlZH1cbiAgICAgICAgPlxuICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICA8L2xpPlxuICAgICk7XG59XG4iLCJpbXBvcnQgY2xhc3NOYW1lcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IHsgUmVhY3RFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5cbmludGVyZmFjZSBDb21ib2JveEdyb3VwSGVhZGVyUHJvcHMge1xuICAgIHRpdGxlOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBub24taW50ZXJhY3RpdmUsIG5vbi1zZWxlY3RhYmxlIGxpc3QgaXRlbSByZW5kZXJlZCBhcyBhIGdyb3VwIGhlYWRpbmdcbiAqIGluc2lkZSB0aGUgY29tYm9ib3ggZHJvcGRvd24gbWVudS5cbiAqXG4gKiBJbXBvcnRhbnQ6IHRoaXMgZWxlbWVudCBpcyBOT1QgaW5jbHVkZWQgaW4gdGhlIGRvd25zaGlmdCBpdGVtIGluZGV4XG4gKiBzZXF1ZW5jZSDigJQgaXQgaXMgcHVyZWx5IHZpc3VhbCBhbmQgc2tpcHBlZCBkdXJpbmcga2V5Ym9hcmQgbmF2aWdhdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIENvbWJvYm94R3JvdXBIZWFkZXIoeyB0aXRsZSB9OiBDb21ib2JveEdyb3VwSGVhZGVyUHJvcHMpOiBSZWFjdEVsZW1lbnQge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxsaVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFwid2lkZ2V0LWNvbWJvYm94LWdyb3VwLWhlYWRlclwiKX1cbiAgICAgICAgICAgIGFyaWEtZGlzYWJsZWQ9XCJ0cnVlXCJcbiAgICAgICAgICAgIHJvbGU9XCJwcmVzZW50YXRpb25cIlxuICAgICAgICAgICAgLy8gUHJldmVudHMgdGhlIG1lbnUgZnJvbSBjbG9zaW5nIHdoZW4gaGVhZGVyIGlzIGNsaWNrZWRcbiAgICAgICAgICAgIG9uTW91c2VEb3duPXtlID0+IGUucHJldmVudERlZmF1bHQoKX1cbiAgICAgICAgPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94LWdyb3VwLWhlYWRlci10ZXh0XCI+e3RpdGxlfTwvc3Bhbj5cbiAgICAgICAgPC9saT5cbiAgICApO1xufVxuIiwiaW1wb3J0IHsgUmVhY3RFbGVtZW50IH0gZnJvbSBcInJlYWN0XCI7XG5cbnR5cGUgU2tlbGV0b25Mb2FkZXJQcm9wcyA9IHtcbiAgICB3aXRoQ2hlY2tib3g/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIFNrZWxldG9uTG9hZGVyKHsgd2l0aENoZWNrYm94ID0gZmFsc2UgfTogU2tlbGV0b25Mb2FkZXJQcm9wcyk6IFJlYWN0RWxlbWVudCB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3aWRnZXQtY29tYm9ib3gtc2tlbGV0b25cIj5cbiAgICAgICAgICAgIHt3aXRoQ2hlY2tib3ggJiYgPHNwYW4gY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94LXNrZWxldG9uLWxvYWRlciB3aWRnZXQtY29tYm9ib3gtc2tlbGV0b24tbG9hZGVyLXNtYWxsXCIgLz59XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ3aWRnZXQtY29tYm9ib3gtc2tlbGV0b24tbG9hZGVyXCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cbiIsImltcG9ydCB7IEZyYWdtZW50LCBSZWFjdEVsZW1lbnQgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IExvYWRpbmdUeXBlRW51bSB9IGZyb20gXCJ0eXBpbmdzL0dyb3VwZWRDb21ib2JveFByb3BzXCI7XG5pbXBvcnQgeyBERUZBVUxUX0xJTUlUX1NJWkUgfSBmcm9tIFwiLi4vaGVscGVycy91dGlsc1wiO1xuaW1wb3J0IHsgU2tlbGV0b25Mb2FkZXIgfSBmcm9tIFwiLi9Ta2VsZXRvbkxvYWRlclwiO1xuaW1wb3J0IHsgU3Bpbm5lckxvYWRlciB9IGZyb20gXCIuL1NwaW5uZXJMb2FkZXJcIjtcblxudHlwZSBMb2FkZXJQcm9wcyA9IHtcbiAgICBpc0VtcHR5OiBib29sZWFuO1xuICAgIGlzTG9hZGluZzogYm9vbGVhbjtcbiAgICBpc09wZW46IGJvb2xlYW47XG4gICAgbGF6eUxvYWRpbmc6IGJvb2xlYW47XG4gICAgbG9hZGluZ1R5cGU/OiBMb2FkaW5nVHlwZUVudW07XG4gICAgd2l0aENoZWNrYm94OiBib29sZWFuO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIExvYWRlcihwcm9wczogTG9hZGVyUHJvcHMpOiBSZWFjdEVsZW1lbnQgfCBudWxsIHtcbiAgICBjb25zdCB7IGlzRW1wdHksIGlzTG9hZGluZywgaXNPcGVuLCBsYXp5TG9hZGluZywgbG9hZGluZ1R5cGUsIHdpdGhDaGVja2JveCB9ID0gcHJvcHM7XG5cbiAgICBpZiAoIWlzT3BlbiB8fCAhbGF6eUxvYWRpbmcgfHwgIWlzTG9hZGluZykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbG9hZGluZ1R5cGUgPT09IFwic2tlbGV0b25cIiA/IChcbiAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgICAge0FycmF5LmZyb20oeyBsZW5ndGg6IERFRkFVTFRfTElNSVRfU0laRSB9KS5tYXAoKF8sIGkpID0+IChcbiAgICAgICAgICAgICAgICA8U2tlbGV0b25Mb2FkZXIgd2l0aENoZWNrYm94PXt3aXRoQ2hlY2tib3h9IGtleT17aX0gLz5cbiAgICAgICAgICAgICkpfVxuICAgICAgICA8L0ZyYWdtZW50PlxuICAgICkgOiAoXG4gICAgICAgIDxTcGlubmVyTG9hZGVyIHdpdGhNYXJnaW5zPXtpc0VtcHR5fSAvPlxuICAgICk7XG59XG4iLCJpbXBvcnQgeyBVc2VDb21ib2JveFByb3BHZXR0ZXJzIH0gZnJvbSBcImRvd25zaGlmdC90eXBpbmdzXCI7XG5pbXBvcnQgeyBGcmFnbWVudCwgUmVhY3RFbGVtZW50LCBSZWFjdE5vZGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IFNpbmdsZVNlbGVjdG9yIH0gZnJvbSBcIi4uLy4uL2hlbHBlcnMvdHlwZXNcIjtcbmltcG9ydCB7IGdyb3VwSXRlbXMgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9ncm91cGluZ1V0aWxzXCI7XG5pbXBvcnQgeyBDb21ib2JveE1lbnVXcmFwcGVyIH0gZnJvbSBcIi4uL0NvbWJvYm94TWVudVdyYXBwZXJcIjtcbmltcG9ydCB7IENvbWJvYm94T3B0aW9uV3JhcHBlciB9IGZyb20gXCIuLi9Db21ib2JveE9wdGlvbldyYXBwZXJcIjtcbmltcG9ydCB7IENvbWJvYm94R3JvdXBIZWFkZXIgfSBmcm9tIFwiLi4vQ29tYm9ib3hHcm91cEhlYWRlclwiO1xuaW1wb3J0IHsgTG9hZGVyIH0gZnJvbSBcIi4uL0xvYWRlclwiO1xuXG5pbnRlcmZhY2UgQ29tYm9ib3hNZW51UHJvcHMgZXh0ZW5kcyBQYXJ0aWFsPFVzZUNvbWJvYm94UHJvcEdldHRlcnM8c3RyaW5nPj4ge1xuICAgIGlzT3BlbjogYm9vbGVhbjtcbiAgICBzZWxlY3RvcjogU2luZ2xlU2VsZWN0b3I7XG4gICAgaGlnaGxpZ2h0ZWRJbmRleDogbnVtYmVyIHwgbnVsbDtcbiAgICBzZWxlY3RlZEl0ZW0/OiBzdHJpbmcgfCBudWxsO1xuICAgIG5vT3B0aW9uc1RleHQ/OiBzdHJpbmc7XG4gICAgYWx3YXlzT3Blbj86IGJvb2xlYW47XG4gICAgbWVudUZvb3RlckNvbnRlbnQ/OiBSZWFjdE5vZGU7XG4gICAgaXNMb2FkaW5nOiBib29sZWFuO1xuICAgIGxhenlMb2FkaW5nOiBib29sZWFuO1xuICAgIG9uU2Nyb2xsOiAoZTogYW55KSA9PiB2b2lkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU2luZ2xlU2VsZWN0aW9uTWVudSh7XG4gICAgaXNPcGVuLFxuICAgIHNlbGVjdG9yLFxuICAgIGhpZ2hsaWdodGVkSW5kZXgsXG4gICAgZ2V0TWVudVByb3BzLFxuICAgIGdldEl0ZW1Qcm9wcyxcbiAgICBub09wdGlvbnNUZXh0LFxuICAgIGFsd2F5c09wZW4sXG4gICAgbWVudUZvb3RlckNvbnRlbnQsXG4gICAgaXNMb2FkaW5nLFxuICAgIGxhenlMb2FkaW5nLFxuICAgIG9uU2Nyb2xsXG59OiBDb21ib2JveE1lbnVQcm9wcyk6IFJlYWN0RWxlbWVudCB7XG4gICAgY29uc3QgaXRlbXMgPSBzZWxlY3Rvci5vcHRpb25zLmdldEFsbCgpO1xuXG4gICAgLy8gQnVpbGQgdGhlIGdyb3VwIGZ1bmN0aW9uIOKAlCBmYWxscyBiYWNrIHRvIG51bGwgKG5vIGdyb3VwaW5nKSB3aGVuIGNhcHRpb24gcHJvdmlkZXIgaGFzIG5vIGdldEdyb3VwXG4gICAgY29uc3QgZ2V0R3JvdXBGbiA9IHNlbGVjdG9yLmNhcHRpb24uZ2V0R3JvdXBcbiAgICAgICAgPyAoaWQ6IHN0cmluZykgPT4gc2VsZWN0b3IuY2FwdGlvbi5nZXRHcm91cCEoaWQpXG4gICAgICAgIDogKF9pZDogc3RyaW5nKSA9PiBudWxsO1xuXG4gICAgY29uc3Qgc2VnbWVudHMgPSBncm91cEl0ZW1zKGl0ZW1zLCBnZXRHcm91cEZuKTtcbiAgICBjb25zdCBpc0dyb3VwZWQgPSBzZWdtZW50cy5zb21lKHMgPT4gcy5ncm91cFRpdGxlICE9PSBudWxsKTtcblxuICAgIC8vIFdlIG5lZWQgYSBjb250aW51b3VzIGRvd25zaGlmdCBpbmRleCB0aGF0IHNraXBzIGdyb3VwIGhlYWRlciByb3dzXG4gICAgbGV0IGRvd25zaGlmdEluZGV4ID0gMDtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxDb21ib2JveE1lbnVXcmFwcGVyXG4gICAgICAgICAgICBhbHdheXNPcGVuPXthbHdheXNPcGVufVxuICAgICAgICAgICAgZ2V0TWVudVByb3BzPXtnZXRNZW51UHJvcHN9XG4gICAgICAgICAgICBpc0VtcHR5PXtpdGVtcz8ubGVuZ3RoIDw9IDB9XG4gICAgICAgICAgICBpc0xvYWRpbmc9e2lzTG9hZGluZ31cbiAgICAgICAgICAgIGlzT3Blbj17aXNPcGVufVxuICAgICAgICAgICAgbGF6eUxvYWRpbmc9e2xhenlMb2FkaW5nfVxuICAgICAgICAgICAgbG9hZGVyPXtcbiAgICAgICAgICAgICAgICA8TG9hZGVyXG4gICAgICAgICAgICAgICAgICAgIGlzTG9hZGluZz17aXNMb2FkaW5nfVxuICAgICAgICAgICAgICAgICAgICBpc09wZW49e2lzT3Blbn1cbiAgICAgICAgICAgICAgICAgICAgbGF6eUxvYWRpbmc9e2xhenlMb2FkaW5nfVxuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nVHlwZT17c2VsZWN0b3IubG9hZGluZ1R5cGV9XG4gICAgICAgICAgICAgICAgICAgIHdpdGhDaGVja2JveD17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICAgIGlzRW1wdHk9e2l0ZW1zLmxlbmd0aCA9PT0gMH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWVudUZvb3RlckNvbnRlbnQ9e21lbnVGb290ZXJDb250ZW50fVxuICAgICAgICAgICAgbm9PcHRpb25zVGV4dD17bm9PcHRpb25zVGV4dH1cbiAgICAgICAgICAgIG9uU2Nyb2xsPXtsYXp5TG9hZGluZyA/IG9uU2Nyb2xsIDogdW5kZWZpbmVkfVxuICAgICAgICA+XG4gICAgICAgICAgICB7aXNPcGVuICYmXG4gICAgICAgICAgICAgICAgKGlzR3JvdXBlZFxuICAgICAgICAgICAgICAgICAgICA/IHNlZ21lbnRzLm1hcChzZWdtZW50ID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPEZyYWdtZW50IGtleT17c2VnbWVudC5ncm91cFRpdGxlID8/IFwiX191bmdyb3VwZWRfX1wifT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWdtZW50Lmdyb3VwVGl0bGUgJiYgPENvbWJvYm94R3JvdXBIZWFkZXIgdGl0bGU9e3NlZ21lbnQuZ3JvdXBUaXRsZX0gLz59XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VnbWVudC5pdGVtcy5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gZG93bnNoaWZ0SW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29tYm9ib3hPcHRpb25XcmFwcGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2l0ZW19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0hpZ2hsaWdodGVkPXthbHdheXNPcGVuID8gZmFsc2UgOiBoaWdobGlnaHRlZEluZGV4ID09PSBjdXJyZW50SW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkPXtzZWxlY3Rvci5jdXJyZW50SWQgPT09IGl0ZW19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtPXtpdGVtfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0SXRlbVByb3BzPXtnZXRJdGVtUHJvcHN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleD17Y3VycmVudEluZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VsZWN0b3IuY2FwdGlvbi5yZW5kZXIoaXRlbSwgXCJvcHRpb25zXCIpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0NvbWJvYm94T3B0aW9uV3JhcHBlcj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAgICAgOiBpdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxDb21ib2JveE9wdGlvbldyYXBwZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17aXRlbX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzSGlnaGxpZ2h0ZWQ9e2Fsd2F5c09wZW4gPyBmYWxzZSA6IGhpZ2hsaWdodGVkSW5kZXggPT09IGluZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZD17c2VsZWN0b3IuY3VycmVudElkID09PSBpdGVtfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbT17aXRlbX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEl0ZW1Qcm9wcz17Z2V0SXRlbVByb3BzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VsZWN0b3IuY2FwdGlvbi5yZW5kZXIoaXRlbSwgXCJvcHRpb25zXCIpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L0NvbWJvYm94T3B0aW9uV3JhcHBlcj5cbiAgICAgICAgICAgICAgICAgICAgICApKSl9XG4gICAgICAgIDwvQ29tYm9ib3hNZW51V3JhcHBlcj5cbiAgICApO1xufVxuIiwiaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSBcImNsYXNzbmFtZXNcIjtcbmltcG9ydCB7IEZyYWdtZW50LCBLZXlib2FyZEV2ZW50SGFuZGxlciwgUmVhY3RFbGVtZW50LCB1c2VNZW1vLCB1c2VSZWYgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IENsZWFyQnV0dG9uIH0gZnJvbSBcIi4uLy4uL2Fzc2V0cy9pY29uc1wiO1xuaW1wb3J0IHsgU2VsZWN0aW9uQmFzZVByb3BzLCBTaW5nbGVTZWxlY3RvciB9IGZyb20gXCIuLi8uLi9oZWxwZXJzL3R5cGVzXCI7XG5pbXBvcnQgeyBnZXRJbnB1dExhYmVsLCBnZXRWYWxpZGF0aW9uRXJyb3JJZCB9IGZyb20gXCIuLi8uLi9oZWxwZXJzL3V0aWxzXCI7XG5pbXBvcnQgeyB1c2VEb3duc2hpZnRTaW5nbGVTZWxlY3RQcm9wcyB9IGZyb20gXCIuLi8uLi9ob29rcy91c2VEb3duc2hpZnRTaW5nbGVTZWxlY3RQcm9wc1wiO1xuaW1wb3J0IHsgdXNlTGF6eUxvYWRpbmcgfSBmcm9tIFwiLi4vLi4vaG9va3MvdXNlTGF6eUxvYWRpbmdcIjtcbmltcG9ydCB7IENvbWJvYm94V3JhcHBlciB9IGZyb20gXCIuLi9Db21ib2JveFdyYXBwZXJcIjtcbmltcG9ydCB7IElucHV0UGxhY2Vob2xkZXIgfSBmcm9tIFwiLi4vUGxhY2Vob2xkZXJcIjtcbmltcG9ydCB7IFNpbmdsZVNlbGVjdGlvbk1lbnUgfSBmcm9tIFwiLi9TaW5nbGVTZWxlY3Rpb25NZW51XCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBTaW5nbGVTZWxlY3Rpb24oe1xuICAgIHNlbGVjdG9yLFxuICAgIHRhYkluZGV4ID0gMCxcbiAgICBhMTF5Q29uZmlnLFxuICAgIGtlZXBNZW51T3BlbixcbiAgICBtZW51Rm9vdGVyQ29udGVudCxcbiAgICBhcmlhUmVxdWlyZWQsXG4gICAgLi4ub3B0aW9uc1xufTogU2VsZWN0aW9uQmFzZVByb3BzPFNpbmdsZVNlbGVjdG9yPik6IFJlYWN0RWxlbWVudCB7XG4gICAgY29uc3Qge1xuICAgICAgICBnZXRJbnB1dFByb3BzLFxuICAgICAgICBnZXRUb2dnbGVCdXR0b25Qcm9wcyxcbiAgICAgICAgZ2V0SXRlbVByb3BzLFxuICAgICAgICBzZWxlY3RlZEl0ZW0sXG4gICAgICAgIGdldE1lbnVQcm9wcyxcbiAgICAgICAgcmVzZXQsXG4gICAgICAgIGlzT3BlbixcbiAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleCxcbiAgICAgICAgc2VsZWN0SXRlbVxuICAgIH0gPSB1c2VEb3duc2hpZnRTaW5nbGVTZWxlY3RQcm9wcyhzZWxlY3Rvciwgb3B0aW9ucywgYTExeUNvbmZpZy5hMTF5U3RhdHVzTWVzc2FnZSk7XG4gICAgY29uc3QgaW5wdXRSZWYgPSB1c2VSZWY8SFRNTElucHV0RWxlbWVudD4obnVsbCk7XG4gICAgY29uc3QgbGF6eUxvYWRpbmcgPSBzZWxlY3Rvci5sYXp5TG9hZGluZyA/PyBmYWxzZTtcbiAgICBjb25zdCB7IG9uU2Nyb2xsIH0gPSB1c2VMYXp5TG9hZGluZyh7XG4gICAgICAgIGhhc01vcmVJdGVtczogc2VsZWN0b3Iub3B0aW9ucy5oYXNNb3JlID8/IGZhbHNlLFxuICAgICAgICBpc0luZmluaXRlOiBsYXp5TG9hZGluZyxcbiAgICAgICAgaXNPcGVuLFxuICAgICAgICBsb2FkTW9yZTogKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHNlbGVjdG9yLm9wdGlvbnMubG9hZE1vcmUpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci5vcHRpb25zLmxvYWRNb3JlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGRhdGFzb3VyY2VGaWx0ZXI6IHNlbGVjdG9yLm9wdGlvbnMuZGF0YXNvdXJjZUZpbHRlcixcbiAgICAgICAgcmVhZE9ubHk6IHNlbGVjdG9yLnJlYWRPbmx5XG4gICAgfSk7XG5cbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1DYXB0aW9uID0gdXNlTWVtbyhcbiAgICAgICAgKCkgPT4gc2VsZWN0b3IuY2FwdGlvbi5yZW5kZXIoc2VsZWN0ZWRJdGVtLCBcImxhYmVsXCIpLFxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gICAgICAgIFtcbiAgICAgICAgICAgIHNlbGVjdGVkSXRlbSxcbiAgICAgICAgICAgIHNlbGVjdG9yLnN0YXR1cyxcbiAgICAgICAgICAgIHNlbGVjdG9yLmNhcHRpb24sXG4gICAgICAgICAgICBzZWxlY3Rvci5jYXB0aW9uLmVtcHR5Q2FwdGlvbixcbiAgICAgICAgICAgIHNlbGVjdG9yLmN1cnJlbnRJZCxcbiAgICAgICAgICAgIHNlbGVjdG9yLmNhcHRpb24uZm9ybWF0dGVyXG4gICAgICAgIF1cbiAgICApO1xuXG4gICAgY29uc3QgaW5wdXRMYWJlbCA9IGdldElucHV0TGFiZWwob3B0aW9ucy5pbnB1dElkKTtcbiAgICBjb25zdCBlcnJvcklkID0gZ2V0VmFsaWRhdGlvbkVycm9ySWQob3B0aW9ucy5pbnB1dElkKTtcbiAgICBjb25zdCBoYXNMYWJlbCA9IHVzZU1lbW8oKCkgPT4gQm9vbGVhbihpbnB1dExhYmVsKSwgW2lucHV0TGFiZWxdKTtcbiAgICBjb25zdCBvbklucHV0S2V5RG93biA9IHVzZU1lbW88S2V5Ym9hcmRFdmVudEhhbmRsZXI8SFRNTElucHV0RWxlbWVudD4gfCB1bmRlZmluZWQ+KCgpID0+IHtcbiAgICAgICAgaWYgKCFzZWxlY3Rvci5jbGVhcmFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZSA9PiB7XG4gICAgICAgICAgICBpZiAoZS5rZXkgPT09IFwiQmFja3NwYWNlXCIgJiYgZS5jdXJyZW50VGFyZ2V0LnZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0SXRlbShudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9LCBbc2VsZWN0b3IuY2xlYXJhYmxlLCBzZWxlY3RJdGVtXSk7XG5cbiAgICBjb25zdCBpbnB1dFByb3BzID0gZ2V0SW5wdXRQcm9wcyhcbiAgICAgICAge1xuICAgICAgICAgICAgZGlzYWJsZWQ6IHNlbGVjdG9yLnJlYWRPbmx5LFxuICAgICAgICAgICAgcmVhZE9ubHk6IHNlbGVjdG9yLm9wdGlvbnMuZmlsdGVyVHlwZSA9PT0gXCJub25lXCIsXG4gICAgICAgICAgICByZWY6IGlucHV0UmVmLFxuICAgICAgICAgICAgXCJhcmlhLXJlcXVpcmVkXCI6IGFyaWFSZXF1aXJlZC52YWx1ZSxcbiAgICAgICAgICAgIFwiYXJpYS1sYWJlbFwiOiAhaGFzTGFiZWwgJiYgb3B0aW9ucy5hcmlhTGFiZWwgPyBvcHRpb25zLmFyaWFMYWJlbCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIG9uS2V5RG93bjogb25JbnB1dEtleURvd25cbiAgICAgICAgfSxcbiAgICAgICAgeyBzdXBwcmVzc1JlZkVycm9yOiB0cnVlIH1cbiAgICApO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICAgIDxDb21ib2JveFdyYXBwZXJcbiAgICAgICAgICAgICAgICBpc09wZW49e2lzT3BlbiB8fCBrZWVwTWVudU9wZW4gPT09IHRydWV9XG4gICAgICAgICAgICAgICAgcmVhZE9ubHk9e3NlbGVjdG9yLnJlYWRPbmx5fVxuICAgICAgICAgICAgICAgIHJlYWRPbmx5U3R5bGU9e29wdGlvbnMucmVhZE9ubHlTdHlsZX1cbiAgICAgICAgICAgICAgICBnZXRUb2dnbGVCdXR0b25Qcm9wcz17Z2V0VG9nZ2xlQnV0dG9uUHJvcHN9XG4gICAgICAgICAgICAgICAgdmFsaWRhdGlvbj17c2VsZWN0b3IudmFsaWRhdGlvbn1cbiAgICAgICAgICAgICAgICBpc0xvYWRpbmc9e2xhenlMb2FkaW5nICYmIHNlbGVjdG9yLm9wdGlvbnMuaXNMb2FkaW5nfVxuICAgICAgICAgICAgICAgIGVycm9ySWQ9e2Vycm9ySWR9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXCJ3aWRnZXQtY29tYm9ib3gtc2VsZWN0ZWQtaXRlbXNcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aWRnZXQtY29tYm9ib3gtY3VzdG9tLWNvbnRlbnRcIjogc2VsZWN0b3IuY3VzdG9tQ29udGVudFR5cGUgPT09IFwieWVzXCJcbiAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcIndpZGdldC1jb21ib2JveC1pbnB1dFwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aWRnZXQtY29tYm9ib3gtaW5wdXQtbm9maWx0ZXJcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3Iub3B0aW9ucy5maWx0ZXJUeXBlID09PSBcIm5vbmVcIiB8fCBzZWxlY3Rvci5yZWFkT25seVxuICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJJbmRleD17dGFiSW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICB7Li4uaW5wdXRQcm9wc31cbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsbGVkYnk9e2hhc0xhYmVsID8gaW5wdXRQcm9wc1tcImFyaWEtbGFiZWxsZWRieVwiXSA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtZGVzY3JpYmVkYnk9e3NlbGVjdG9yLnZhbGlkYXRpb24gPyBlcnJvcklkIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1pbnZhbGlkPXtzZWxlY3Rvci52YWxpZGF0aW9uID8gdHJ1ZSA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPElucHV0UGxhY2Vob2xkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRW1wdHk9eyFzZWxlY3Rvci5jdXJyZW50SWQgfHwgIXNlbGVjdG9yLmNhcHRpb24ucmVuZGVyKHNlbGVjdGVkSXRlbSwgXCJsYWJlbFwiKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9e3NlbGVjdG9yLmN1c3RvbUNvbnRlbnRUeXBlID09PSBcInllc1wiID8gXCJjdXN0b21cIiA6IFwidGV4dFwifVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRJdGVtQ2FwdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgPC9JbnB1dFBsYWNlaG9sZGVyPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIHsoKCFzZWxlY3Rvci5yZWFkT25seSAmJiBzZWxlY3Rvci5jbGVhcmFibGUgJiYgc2VsZWN0b3IuY3VycmVudElkICE9PSBudWxsKSB8fFxuICAgICAgICAgICAgICAgICAgICAoc2VsZWN0b3Iuc2VsZWN0b3JUeXBlID09PSBcInN0YXRpY1wiICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rvci5jdXJyZW50SWQgIT09IG51bGwgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICFzZWxlY3Rvci5yZWFkT25seSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3IuY2xlYXJhYmxlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rvci5hdHRyaWJ1dGVUeXBlICE9PSBcImJvb2xlYW5cIikpICYmIChcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgdGFiSW5kZXg9e3RhYkluZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94LWNsZWFyLWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXthMTF5Q29uZmlnLmFyaWFMYWJlbHM/LmNsZWFyU2VsZWN0aW9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dFJlZi5jdXJyZW50Py5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEl0ZW0gfHwgc2VsZWN0b3Iuc2VsZWN0b3JUeXBlID09PSBcInN0YXRpY1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yLnNldFZhbHVlKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxDbGVhckJ1dHRvbiAvPlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9Db21ib2JveFdyYXBwZXI+XG4gICAgICAgICAgICA8U2luZ2xlU2VsZWN0aW9uTWVudVxuICAgICAgICAgICAgICAgIHNlbGVjdG9yPXtzZWxlY3Rvcn1cbiAgICAgICAgICAgICAgICBzZWxlY3RlZEl0ZW09e3NlbGVjdGVkSXRlbX1cbiAgICAgICAgICAgICAgICBnZXRNZW51UHJvcHM9e2dldE1lbnVQcm9wc31cbiAgICAgICAgICAgICAgICBnZXRJdGVtUHJvcHM9e2dldEl0ZW1Qcm9wc31cbiAgICAgICAgICAgICAgICBpc09wZW49e2lzT3BlbiB8fCBrZWVwTWVudU9wZW4gPT09IHRydWV9XG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleD17aGlnaGxpZ2h0ZWRJbmRleH1cbiAgICAgICAgICAgICAgICBtZW51Rm9vdGVyQ29udGVudD17bWVudUZvb3RlckNvbnRlbnR9XG4gICAgICAgICAgICAgICAgbm9PcHRpb25zVGV4dD17b3B0aW9ucy5ub09wdGlvbnNUZXh0fVxuICAgICAgICAgICAgICAgIGFsd2F5c09wZW49e2tlZXBNZW51T3Blbn1cbiAgICAgICAgICAgICAgICBpc0xvYWRpbmc9e3NlbGVjdG9yLm9wdGlvbnMuaXNMb2FkaW5nfVxuICAgICAgICAgICAgICAgIGxhenlMb2FkaW5nPXtsYXp5TG9hZGluZ31cbiAgICAgICAgICAgICAgICBvblNjcm9sbD17b25TY3JvbGx9XG4gICAgICAgICAgICAvPlxuICAgICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG59XG4iLCJpbXBvcnQgeyBEeW5hbWljVmFsdWUgfSBmcm9tIFwibWVuZGl4XCI7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1vY2sgRHluYW1pY1ZhbHVlIHdpdGggc3RhdHVzIFwiYXZhaWxhYmxlXCIgYW5kIHRoZSBnaXZlbiB2YWx1ZS5cbiAqIFVzZWQgaW4gZWRpdG9yIHByZXZpZXcgbW9kZSB0byBwcm92aWRlIHN0YXRpYyBEeW5hbWljVmFsdWUgaW5zdGFuY2VzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZHluYW1pYzxUPih2YWx1ZTogVCk6IER5bmFtaWNWYWx1ZTxUPiB7XG4gICAgcmV0dXJuIHsgc3RhdHVzOiBcImF2YWlsYWJsZVwiLCB2YWx1ZSB9IGFzIER5bmFtaWNWYWx1ZTxUPjtcbn1cbiIsImZ1bmN0aW9uIHN0eWxlSW5qZWN0KGNzcywgcmVmKSB7XG4gIGlmICggcmVmID09PSB2b2lkIDAgKSByZWYgPSB7fTtcbiAgdmFyIGluc2VydEF0ID0gcmVmLmluc2VydEF0O1xuXG4gIGlmICghY3NzIHx8IHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuOyB9XG5cbiAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuXG4gIGlmIChpbnNlcnRBdCA9PT0gJ3RvcCcpIHtcbiAgICBpZiAoaGVhZC5maXJzdENoaWxkKSB7XG4gICAgICBoZWFkLmluc2VydEJlZm9yZShzdHlsZSwgaGVhZC5maXJzdENoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICB9XG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgc3R5bGVJbmplY3Q7XG4iLCJpbXBvcnQgeyBEeW5hbWljVmFsdWUsIExpc3RBdHRyaWJ1dGVWYWx1ZSwgTGlzdEV4cHJlc3Npb25WYWx1ZSwgTGlzdFdpZGdldFZhbHVlLCBPYmplY3RJdGVtIH0gZnJvbSBcIm1lbmRpeFwiO1xuaW1wb3J0IHsgUmVhY3ROb2RlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBPcHRpb25zU291cmNlQXNzb2NpYXRpb25DdXN0b21Db250ZW50VHlwZUVudW0gfSBmcm9tIFwiLi4vLi4vLi4vdHlwaW5ncy9Hcm91cGVkQ29tYm9ib3hQcm9wc1wiO1xuaW1wb3J0IHsgQ2FwdGlvblBsYWNlbWVudCwgQ2FwdGlvbnNQcm92aWRlciB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgQ2FwdGlvbkNvbnRlbnQgfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgICBlbXB0eU9wdGlvblRleHQ/OiBEeW5hbWljVmFsdWU8c3RyaW5nPjtcbiAgICBmb3JtYXR0aW5nQXR0cmlidXRlT3JFeHByZXNzaW9uOiBMaXN0RXhwcmVzc2lvblZhbHVlPHN0cmluZz4gfCBMaXN0QXR0cmlidXRlVmFsdWU8c3RyaW5nPjtcbiAgICBjdXN0b21Db250ZW50PzogTGlzdFdpZGdldFZhbHVlIHwgdW5kZWZpbmVkO1xuICAgIGN1c3RvbUNvbnRlbnRUeXBlOiBPcHRpb25zU291cmNlQXNzb2NpYXRpb25DdXN0b21Db250ZW50VHlwZUVudW07XG4gICAgLyoqIE9wdGlvbmFsIGF0dHJpYnV0ZSB0aGF0IGRlZmluZXMgdGhlIGdyb3VwL3NlY3Rpb24gaGVhZGluZyBmb3IgZWFjaCBpdGVtICovXG4gICAgZ3JvdXBBdHRyaWJ1dGU/OiBMaXN0QXR0cmlidXRlVmFsdWU8c3RyaW5nPjtcbn1cblxuZXhwb3J0IGNsYXNzIEFzc29jaWF0aW9uU2ltcGxlQ2FwdGlvbnNQcm92aWRlciBpbXBsZW1lbnRzIENhcHRpb25zUHJvdmlkZXIge1xuICAgIHByaXZhdGUgdW5hdmFpbGFibGVDYXB0aW9uID0gXCI8Li4uPlwiO1xuICAgIGZvcm1hdHRlcj86IExpc3RFeHByZXNzaW9uVmFsdWU8c3RyaW5nPiB8IExpc3RBdHRyaWJ1dGVWYWx1ZTxzdHJpbmc+O1xuICAgIHByb3RlY3RlZCBjdXN0b21Db250ZW50PzogTGlzdFdpZGdldFZhbHVlO1xuICAgIHByb3RlY3RlZCBjdXN0b21Db250ZW50VHlwZTogT3B0aW9uc1NvdXJjZUFzc29jaWF0aW9uQ3VzdG9tQ29udGVudFR5cGVFbnVtID0gXCJub1wiO1xuICAgIGVtcHR5Q2FwdGlvbiA9IFwiXCI7XG4gICAgcHJpdmF0ZSBncm91cEZvcm1hdHRlcj86IExpc3RBdHRyaWJ1dGVWYWx1ZTxzdHJpbmc+O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBvcHRpb25zTWFwOiBNYXA8c3RyaW5nLCBPYmplY3RJdGVtPikge31cblxuICAgIHVwZGF0ZVByb3BzKHByb3BzOiBQcm9wcyk6IHZvaWQge1xuICAgICAgICBpZiAoIXByb3BzLmVtcHR5T3B0aW9uVGV4dCB8fCBwcm9wcy5lbXB0eU9wdGlvblRleHQuc3RhdHVzID09PSBcInVuYXZhaWxhYmxlXCIpIHtcbiAgICAgICAgICAgIHRoaXMuZW1wdHlDYXB0aW9uID0gXCJcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZW1wdHlDYXB0aW9uID0gcHJvcHMuZW1wdHlPcHRpb25UZXh0LnZhbHVlITtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZm9ybWF0dGVyID0gcHJvcHMuZm9ybWF0dGluZ0F0dHJpYnV0ZU9yRXhwcmVzc2lvbjtcbiAgICAgICAgdGhpcy5jdXN0b21Db250ZW50ID0gcHJvcHMuY3VzdG9tQ29udGVudDtcbiAgICAgICAgdGhpcy5jdXN0b21Db250ZW50VHlwZSA9IHByb3BzLmN1c3RvbUNvbnRlbnRUeXBlO1xuICAgICAgICB0aGlzLmdyb3VwRm9ybWF0dGVyID0gcHJvcHMuZ3JvdXBBdHRyaWJ1dGU7XG4gICAgfVxuXG4gICAgZ2V0KHZhbHVlOiBzdHJpbmcgfCBudWxsKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbXB0eUNhcHRpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmZvcm1hdHRlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQXNzb2NpYXRpb25TaW1wbGVDYXB0aW9uUmVuZGVyZXI6IG5vIGZvcm1hdHRlciBhdmFpbGFibGUuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLm9wdGlvbnNNYXAuZ2V0KHZhbHVlKTtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51bmF2YWlsYWJsZUNhcHRpb247XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjYXB0aW9uVmFsdWUgPSB0aGlzLmZvcm1hdHRlci5nZXQoaXRlbSk7XG4gICAgICAgIGlmICghY2FwdGlvblZhbHVlIHx8IGNhcHRpb25WYWx1ZS5zdGF0dXMgPT09IFwidW5hdmFpbGFibGVcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudW5hdmFpbGFibGVDYXB0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNhcHRpb25WYWx1ZS52YWx1ZSAhPT0gdW5kZWZpbmVkICYmIGNhcHRpb25WYWx1ZS52YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIFN0cmluZyhjYXB0aW9uVmFsdWUudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGdyb3VwIHRpdGxlIGZvciB0aGUgZ2l2ZW4gaXRlbSBJRC5cbiAgICAgKiBSZXR1cm5zIG51bGwgd2hlbiBubyBncm91cCBhdHRyaWJ1dGUgaXMgY29uZmlndXJlZCBvciB0aGUgdmFsdWUgaXMgdW5hdmFpbGFibGUuXG4gICAgICovXG4gICAgZ2V0R3JvdXAodmFsdWU6IHN0cmluZyk6IHN0cmluZyB8IG51bGwge1xuICAgICAgICBpZiAoIXRoaXMuZ3JvdXBGb3JtYXR0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLm9wdGlvbnNNYXAuZ2V0KHZhbHVlKTtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBncm91cFZhbHVlID0gdGhpcy5ncm91cEZvcm1hdHRlci5nZXQoaXRlbSk7XG4gICAgICAgIGlmICghZ3JvdXBWYWx1ZSB8fCBncm91cFZhbHVlLnN0YXR1cyAhPT0gXCJhdmFpbGFibGVcIiB8fCAhZ3JvdXBWYWx1ZS5kaXNwbGF5VmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBncm91cFZhbHVlLmRpc3BsYXlWYWx1ZTtcbiAgICB9XG5cbiAgICBnZXRDdXN0b21Db250ZW50KHZhbHVlOiBzdHJpbmcgfCBudWxsKTogUmVhY3ROb2RlIHwgbnVsbCB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMub3B0aW9uc01hcC5nZXQodmFsdWUpO1xuICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY3VzdG9tQ29udGVudD8uZ2V0KGl0ZW0pIGFzIGFueTtcbiAgICB9XG5cbiAgICByZW5kZXIodmFsdWU6IHN0cmluZyB8IG51bGwsIHBsYWNlbWVudDogQ2FwdGlvblBsYWNlbWVudCwgaHRtbEZvcj86IHN0cmluZyk6IFJlYWN0Tm9kZSB7XG4gICAgICAgIGNvbnN0IHsgY3VzdG9tQ29udGVudFR5cGUgfSA9IHRoaXM7XG5cbiAgICAgICAgcmV0dXJuIGN1c3RvbUNvbnRlbnRUeXBlID09PSBcIm5vXCIgfHxcbiAgICAgICAgICAgIChwbGFjZW1lbnQgPT09IFwibGFiZWxcIiAmJiBjdXN0b21Db250ZW50VHlwZSA9PT0gXCJsaXN0SXRlbVwiKSB8fFxuICAgICAgICAgICAgdmFsdWUgPT09IG51bGwgPyAoXG4gICAgICAgICAgICA8Q2FwdGlvbkNvbnRlbnQgaHRtbEZvcj17aHRtbEZvcn0+e3RoaXMuZ2V0KHZhbHVlKX08L0NhcHRpb25Db250ZW50PlxuICAgICAgICApIDogKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3aWRnZXQtY29tYm9ib3gtY2FwdGlvbi1jdXN0b21cIj57dGhpcy5nZXRDdXN0b21Db250ZW50KHZhbHVlKX08L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDYXB0aW9uUGxhY2VtZW50IH0gZnJvbSBcInNyYy9oZWxwZXJzL3R5cGVzXCI7XG5pbXBvcnQgeyBDYXB0aW9uQ29udGVudCB9IGZyb20gXCJzcmMvaGVscGVycy91dGlsc1wiO1xuaW1wb3J0IHsgT3B0aW9uc1NvdXJjZUFzc29jaWF0aW9uQ3VzdG9tQ29udGVudFR5cGVFbnVtIH0gZnJvbSBcInR5cGluZ3MvR3JvdXBlZENvbWJvYm94UHJvcHNcIjtcbmltcG9ydCB7IEFzc29jaWF0aW9uU2ltcGxlQ2FwdGlvbnNQcm92aWRlciB9IGZyb20gXCIuLi9Bc3NvY2lhdGlvblNpbXBsZUNhcHRpb25zUHJvdmlkZXJcIjtcbmltcG9ydCB7IENvbXBvbmVudFR5cGUsIFJlYWN0Tm9kZSB9IGZyb20gXCJyZWFjdFwiO1xuaW50ZXJmYWNlIFByZXZpZXdQcm9wcyB7XG4gICAgY3VzdG9tQ29udGVudFJlbmRlcmVyOlxuICAgICAgICB8IENvbXBvbmVudFR5cGU8eyBjaGlsZHJlbjogUmVhY3ROb2RlOyBjYXB0aW9uPzogc3RyaW5nIH0+XG4gICAgICAgIHwgQXJyYXk8Q29tcG9uZW50VHlwZTx7IGNoaWxkcmVuOiBSZWFjdE5vZGU7IGNhcHRpb24/OiBzdHJpbmcgfT4+O1xuICAgIGN1c3RvbUNvbnRlbnRUeXBlOiBPcHRpb25zU291cmNlQXNzb2NpYXRpb25DdXN0b21Db250ZW50VHlwZUVudW07XG59XG5cbmV4cG9ydCBjbGFzcyBBc3NvY2lhdGlvblByZXZpZXdDYXB0aW9uc1Byb3ZpZGVyIGV4dGVuZHMgQXNzb2NpYXRpb25TaW1wbGVDYXB0aW9uc1Byb3ZpZGVyIHtcbiAgICBlbXB0eUNhcHRpb24gPSBcIkNvbWJvIGJveFwiO1xuICAgIHByaXZhdGUgY3VzdG9tQ29udGVudFJlbmRlcmVyOiBDb21wb25lbnRUeXBlPHsgY2hpbGRyZW46IFJlYWN0Tm9kZTsgY2FwdGlvbj86IHN0cmluZyB9PiA9ICgpID0+IDxkaXY+PC9kaXY+O1xuICAgIGdldCh2YWx1ZTogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB2YWx1ZSB8fCB0aGlzLmVtcHR5Q2FwdGlvbjtcbiAgICB9XG5cbiAgICBnZXRDdXN0b21Db250ZW50KHZhbHVlOiBzdHJpbmcgfCBudWxsKTogUmVhY3ROb2RlIHwgbnVsbCB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY3VzdG9tQ29udGVudFR5cGUgIT09IFwibm9cIikge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8dGhpcy5jdXN0b21Db250ZW50UmVuZGVyZXIgY2FwdGlvbj17XCJDVVNUT00gQ09OVEVOVFwifT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiAvPlxuICAgICAgICAgICAgICAgIDwvdGhpcy5jdXN0b21Db250ZW50UmVuZGVyZXI+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlUHJldmlld1Byb3BzKHByb3BzOiBQcmV2aWV3UHJvcHMpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jdXN0b21Db250ZW50UmVuZGVyZXIgPSBwcm9wcy5jdXN0b21Db250ZW50UmVuZGVyZXIgYXMgQ29tcG9uZW50VHlwZTx7XG4gICAgICAgICAgICBjaGlsZHJlbjogUmVhY3ROb2RlO1xuICAgICAgICAgICAgY2FwdGlvbj86IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAgICAgfT47XG4gICAgICAgIHRoaXMuY3VzdG9tQ29udGVudFR5cGUgPSBwcm9wcy5jdXN0b21Db250ZW50VHlwZTtcbiAgICB9XG5cbiAgICByZW5kZXIodmFsdWU6IHN0cmluZyB8IG51bGwsIHBsYWNlbWVudDogQ2FwdGlvblBsYWNlbWVudCwgaHRtbEZvcj86IHN0cmluZyk6IFJlYWN0Tm9kZSB7XG4gICAgICAgIC8vIGFsd2F5cyByZW5kZXIgY3VzdG9tIGNvbnRlbnQgZHJvcHpvbmUgaW4gZGVzaWduIG1vZGUgaWYgdHlwZSBpcyBvcHRpb25zIG9ubHlcbiAgICAgICAgaWYgKHBsYWNlbWVudCA9PT0gXCJvcHRpb25zXCIpIHtcbiAgICAgICAgICAgIHJldHVybiA8Q2FwdGlvbkNvbnRlbnQgaHRtbEZvcj17aHRtbEZvcn0+e3RoaXMuZ2V0KHZhbHVlKX08L0NhcHRpb25Db250ZW50PjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdXBlci5yZW5kZXIodmFsdWUsIHBsYWNlbWVudCA9PT0gXCJsYWJlbFwiID8gXCJvcHRpb25zXCIgOiBwbGFjZW1lbnQpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE9iamVjdEl0ZW0gfSBmcm9tIFwibWVuZGl4XCI7XG5pbXBvcnQgeyBCYXNlUHJvcHMgfSBmcm9tIFwiLi4vLi4vLi4vaGVscGVycy9CYXNlRGF0YXNvdXJjZU9wdGlvbnNQcm92aWRlclwiO1xuaW1wb3J0IHsgQ2FwdGlvbnNQcm92aWRlciwgT3B0aW9uc1Byb3ZpZGVyLCBTdGF0dXMgfSBmcm9tIFwiLi4vLi4vdHlwZXNcIjtcbmltcG9ydCB7IEZpbHRlclR5cGVFbnVtIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3R5cGluZ3MvR3JvdXBlZENvbWJvYm94UHJvcHNcIjtcblxuZXhwb3J0IGNsYXNzIEFzc29jaWF0aW9uUHJldmlld09wdGlvbnNQcm92aWRlciBpbXBsZW1lbnRzIE9wdGlvbnNQcm92aWRlcjxPYmplY3RJdGVtLCBCYXNlUHJvcHM+IHtcbiAgICBmaWx0ZXJUeXBlOiBGaWx0ZXJUeXBlRW51bSA9IFwiY29udGFpbnNcIjtcbiAgICBoYXNNb3JlPzogYm9vbGVhbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBzZWFyY2hUZXJtOiBzdHJpbmcgPSBcIlwiO1xuICAgIHN0YXR1czogU3RhdHVzID0gXCJhdmFpbGFibGVcIjtcbiAgICBpc0xvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgY2FwdGlvbjogQ2FwdGlvbnNQcm92aWRlcixcbiAgICAgICAgcHJvdGVjdGVkIHZhbHVlc01hcDogTWFwPHN0cmluZywgT2JqZWN0SXRlbT5cbiAgICApIHt9XG4gICAgb25BZnRlclNlYXJjaFRlcm1DaGFuZ2UoX2NhbGxiYWNrOiAoKSA9PiB2b2lkKTogdm9pZCB7fVxuICAgIHNldFNlYXJjaFRlcm0oX3ZhbHVlOiBzdHJpbmcpOiB2b2lkIHt9XG4gICAgbG9hZE1vcmU/KCk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgICB9XG4gICAgX3VwZGF0ZVByb3BzKF86IEJhc2VQcm9wcyk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgICB9XG4gICAgX29wdGlvblRvVmFsdWUoX3ZhbHVlOiBzdHJpbmcgfCBudWxsKTogT2JqZWN0SXRlbSB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cbiAgICBfdmFsdWVUb09wdGlvbihfdmFsdWU6IE9iamVjdEl0ZW0gfCB1bmRlZmluZWQpOiBzdHJpbmcgfCBudWxsIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxuICAgIGdldEFsbCgpOiBzdHJpbmdbXSB7XG4gICAgICAgIHJldHVybiBbXCIuLi5cIl07XG4gICAgfVxufVxuIiwiaW1wb3J0IHtcbiAgICBHcm91cGVkQ29tYm9ib3hDb250YWluZXJQcm9wcyxcbiAgICBHcm91cGVkQ29tYm9ib3hQcmV2aWV3UHJvcHMsXG4gICAgTG9hZGluZ1R5cGVFbnVtLFxuICAgIE9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkN1c3RvbUNvbnRlbnRUeXBlRW51bVxufSBmcm9tIFwiLi4vLi4vLi4vLi4vdHlwaW5ncy9Hcm91cGVkQ29tYm9ib3hQcm9wc1wiO1xuaW1wb3J0IHsgQ2FwdGlvbnNQcm92aWRlciwgT3B0aW9uc1Byb3ZpZGVyLCBTaW5nbGVTZWxlY3RvciwgU3RhdHVzIH0gZnJvbSBcIi4uLy4uLy4uL2hlbHBlcnMvdHlwZXNcIjtcbmltcG9ydCB7IGdldERhdGFzb3VyY2VQbGFjZWhvbGRlclRleHQgfSBmcm9tIFwiLi4vLi4vLi4vaGVscGVycy91dGlsc1wiO1xuaW1wb3J0IHsgQXNzb2NpYXRpb25QcmV2aWV3Q2FwdGlvbnNQcm92aWRlciB9IGZyb20gXCIuL0Fzc29jaWF0aW9uUHJldmlld0NhcHRpb25zUHJvdmlkZXJcIjtcbmltcG9ydCB7IEFzc29jaWF0aW9uUHJldmlld09wdGlvbnNQcm92aWRlciB9IGZyb20gXCIuL0Fzc29jaWF0aW9uUHJldmlld09wdGlvbnNQcm92aWRlclwiO1xuXG5leHBvcnQgY2xhc3MgQXNzb2NpYXRpb25QcmV2aWV3U2VsZWN0b3IgaW1wbGVtZW50cyBTaW5nbGVTZWxlY3RvciB7XG4gICAgYXR0cmlidXRlVHlwZT86IFwic3RyaW5nXCIgfCBcImJpZ1wiIHwgXCJib29sZWFuXCIgfCBcImRhdGVcIjtcbiAgICBjYXB0aW9uOiBDYXB0aW9uc1Byb3ZpZGVyO1xuICAgIGNsZWFyYWJsZTogYm9vbGVhbjtcbiAgICBjdXJyZW50SWQ6IHN0cmluZyB8IG51bGw7XG4gICAgY3VzdG9tQ29udGVudFR5cGU6IE9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkN1c3RvbUNvbnRlbnRUeXBlRW51bTtcbiAgICBsYXp5TG9hZGluZz86IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBsb2FkaW5nVHlwZT86IExvYWRpbmdUeXBlRW51bSA9IFwic2tlbGV0b25cIjtcbiAgICBvcHRpb25zOiBPcHRpb25zUHJvdmlkZXI7XG4gICAgcmVhZE9ubHk6IGJvb2xlYW47XG4gICAgc2VsZWN0b3JUeXBlPzogXCJjb250ZXh0XCIgfCBcImRhdGFiYXNlXCIgfCBcInN0YXRpY1wiO1xuICAgIHN0YXR1czogU3RhdHVzID0gXCJhdmFpbGFibGVcIjtcbiAgICB0eXBlID0gXCJzaW5nbGVcIiBhcyBjb25zdDtcbiAgICB2YWxpZGF0aW9uPzogc3RyaW5nO1xuXG4gICAgb25FbnRlckV2ZW50PzogKCkgPT4gdm9pZDtcbiAgICBvbkxlYXZlRXZlbnQ/OiAoKSA9PiB2b2lkO1xuXG4gICAgY29uc3RydWN0b3IocHJvcHM6IEdyb3VwZWRDb21ib2JveFByZXZpZXdQcm9wcykge1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBuZXcgQXNzb2NpYXRpb25QcmV2aWV3Q2FwdGlvbnNQcm92aWRlcihuZXcgTWFwKCkpO1xuICAgICAgICB0aGlzLmNsZWFyYWJsZSA9IHByb3BzLmNsZWFyYWJsZTtcbiAgICAgICAgdGhpcy5jdXJyZW50SWQgPSBnZXREYXRhc291cmNlUGxhY2Vob2xkZXJUZXh0KHByb3BzKTtcbiAgICAgICAgdGhpcy5jdXN0b21Db250ZW50VHlwZSA9IHByb3BzLm9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkN1c3RvbUNvbnRlbnRUeXBlO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBuZXcgQXNzb2NpYXRpb25QcmV2aWV3T3B0aW9uc1Byb3ZpZGVyKHRoaXMuY2FwdGlvbiwgbmV3IE1hcCgpKTtcbiAgICAgICAgdGhpcy5yZWFkT25seSA9IHByb3BzLnJlYWRPbmx5O1xuICAgICAgICAodGhpcy5jYXB0aW9uIGFzIEFzc29jaWF0aW9uUHJldmlld0NhcHRpb25zUHJvdmlkZXIpLnVwZGF0ZVByZXZpZXdQcm9wcyh7XG4gICAgICAgICAgICBjdXN0b21Db250ZW50UmVuZGVyZXI6IHByb3BzLm9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkN1c3RvbUNvbnRlbnQucmVuZGVyZXIsXG4gICAgICAgICAgICBjdXN0b21Db250ZW50VHlwZTogcHJvcHMub3B0aW9uc1NvdXJjZUFzc29jaWF0aW9uQ3VzdG9tQ29udGVudFR5cGVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHByb3BzLm9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkN1c3RvbUNvbnRlbnRUeXBlID09PSBcImxpc3RJdGVtXCIpIHtcbiAgICAgICAgICAgIC8vIGFsd2F5cyByZW5kZXIgY3VzdG9tIGNvbnRlbnQgZHJvcHpvbmUgaW4gZGVzaWduIG1vZGUgaWYgdHlwZSBpcyBvcHRpb25zIG9ubHlcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tQ29udGVudFR5cGUgPSBcInllc1wiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0VmFsdWUoXzogc3RyaW5nIHwgbnVsbCk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgICB9XG4gICAgdXBkYXRlUHJvcHMoXzogR3JvdXBlZENvbWJvYm94Q29udGFpbmVyUHJvcHMpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgT3B0aW9uc1NvdXJjZVN0YXRpY0RhdGFTb3VyY2VQcmV2aWV3VHlwZSwgU3RhdGljRGF0YVNvdXJjZUN1c3RvbUNvbnRlbnRUeXBlRW51bSB9IGZyb20gXCJ0eXBpbmdzL0dyb3VwZWRDb21ib2JveFByb3BzXCI7XG5pbXBvcnQgeyBDYXB0aW9uUGxhY2VtZW50LCBDYXB0aW9uc1Byb3ZpZGVyIH0gZnJvbSBcIi4uLy4uL3R5cGVzXCI7XG5pbXBvcnQgeyBDYXB0aW9uQ29udGVudCB9IGZyb20gXCIuLi8uLi91dGlsc1wiO1xuaW1wb3J0IHsgUmVhY3ROb2RlIH0gZnJvbSBcInJlYWN0XCI7XG5cbmV4cG9ydCBjbGFzcyBTdGF0aWNQcmV2aWV3Q2FwdGlvbnNQcm92aWRlciBpbXBsZW1lbnRzIENhcHRpb25zUHJvdmlkZXIge1xuICAgIGVtcHR5Q2FwdGlvbiA9IFwiQ29tYm8gYm94XCI7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgb3B0aW9uc01hcDogTWFwPHN0cmluZywgT3B0aW9uc1NvdXJjZVN0YXRpY0RhdGFTb3VyY2VQcmV2aWV3VHlwZT4sXG4gICAgICAgIHByaXZhdGUgY3VzdG9tQ29udGVudFR5cGU6IFN0YXRpY0RhdGFTb3VyY2VDdXN0b21Db250ZW50VHlwZUVudW0sXG4gICAgICAgIHByaXZhdGUgZGF0YVNvdXJjZVBsYWNlaG9sZGVyOiBzdHJpbmdcbiAgICApIHt9XG5cbiAgICBnZXQodmFsdWU6IHN0cmluZyB8IG51bGwpOiBzdHJpbmcge1xuICAgICAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVtcHR5Q2FwdGlvbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zTWFwLmdldCh2YWx1ZSk/LnN0YXRpY0RhdGFTb3VyY2VDYXB0aW9uIHx8IHRoaXMuZW1wdHlDYXB0aW9uO1xuICAgIH1cblxuICAgIHJlbmRlcih2YWx1ZTogc3RyaW5nIHwgbnVsbCwgcGxhY2VtZW50OiBDYXB0aW9uUGxhY2VtZW50LCBodG1sRm9yPzogc3RyaW5nKTogUmVhY3ROb2RlIHtcbiAgICAgICAgLy8gYWx3YXlzIHJlbmRlciBjdXN0b20gY29udGVudCBkcm9wem9uZSBpbiBkZXNpZ24gbW9kZSBpZiB0eXBlIGlzIG9wdGlvbnMgb25seVxuICAgICAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiA8ZGl2Pnt0aGlzLmRhdGFTb3VyY2VQbGFjZWhvbGRlcn08L2Rpdj47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMub3B0aW9uc01hcC5nZXQodmFsdWUpIS5zdGF0aWNEYXRhU291cmNlQ3VzdG9tQ29udGVudCE7XG4gICAgICAgIGNvbnN0IEl0ZW1SZW5kZXJlciA9IGl0ZW0ucmVuZGVyZXI7XG4gICAgICAgIHJldHVybiB0aGlzLmN1c3RvbUNvbnRlbnRUeXBlID09PSBcIm5vXCIgfHxcbiAgICAgICAgICAgIChwbGFjZW1lbnQgPT09IFwibGFiZWxcIiAmJiB0aGlzLmN1c3RvbUNvbnRlbnRUeXBlID09PSBcImxpc3RJdGVtXCIpIHx8XG4gICAgICAgICAgICB2YWx1ZSA9PT0gbnVsbCA/IChcbiAgICAgICAgICAgIDxDYXB0aW9uQ29udGVudCBodG1sRm9yPXtodG1sRm9yfT57dGhpcy5nZXQodmFsdWUpfTwvQ2FwdGlvbkNvbnRlbnQ+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndpZGdldC1jb21ib2JveC1jYXB0aW9uLWN1c3RvbVwiPlxuICAgICAgICAgICAgICAgIDxJdGVtUmVuZGVyZXIgY2FwdGlvbj17YEN1c3RvbSBjb250ZW50IGZvciAke3RoaXMuZ2V0KHZhbHVlKX1gfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8L0l0ZW1SZW5kZXJlcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE9wdGlvbnNQcm92aWRlciwgU3RhdHVzIH0gZnJvbSBcIi4uLy4uL3R5cGVzXCI7XG5pbXBvcnQgeyBGaWx0ZXJUeXBlRW51bSwgT3B0aW9uc1NvdXJjZVN0YXRpY0RhdGFTb3VyY2VQcmV2aWV3VHlwZSB9IGZyb20gXCIuLi8uLi8uLi8uLi90eXBpbmdzL0dyb3VwZWRDb21ib2JveFByb3BzXCI7XG5cbmV4cG9ydCBjbGFzcyBTdGF0aWNQcmV2aWV3T3B0aW9uc1Byb3ZpZGVyIGltcGxlbWVudHMgT3B0aW9uc1Byb3ZpZGVyPHN0cmluZywgT3B0aW9uc1NvdXJjZVN0YXRpY0RhdGFTb3VyY2VQcmV2aWV3VHlwZT4ge1xuICAgIHN0YXR1czogU3RhdHVzID0gXCJhdmFpbGFibGVcIjtcbiAgICBmaWx0ZXJUeXBlOiBGaWx0ZXJUeXBlRW51bSA9IFwiY29udGFpbnNcIjtcbiAgICBzZWFyY2hUZXJtOiBzdHJpbmcgPSBcIlwiO1xuICAgIGhhc01vcmU/OiBib29sZWFuIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIGlzTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgb3B0aW9uc01hcDogTWFwPHN0cmluZywgT3B0aW9uc1NvdXJjZVN0YXRpY0RhdGFTb3VyY2VQcmV2aWV3VHlwZT4pIHt9XG4gICAgc2V0U2VhcmNoVGVybShfdmFsdWU6IHN0cmluZyk6IHZvaWQge31cbiAgICBvbkFmdGVyU2VhcmNoVGVybUNoYW5nZShfY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHt9XG4gICAgbG9hZE1vcmU/KCk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgICB9XG4gICAgX3VwZGF0ZVByb3BzKF86IE9wdGlvbnNTb3VyY2VTdGF0aWNEYXRhU291cmNlUHJldmlld1R5cGUpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxuICAgIF9vcHRpb25Ub1ZhbHVlKF92YWx1ZTogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cbiAgICBfdmFsdWVUb09wdGlvbihfdmFsdWU6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHN0cmluZyB8IG51bGwge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgICB9XG4gICAgZ2V0QWxsKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uc01hcC5zaXplID8gQXJyYXkuZnJvbSh0aGlzLm9wdGlvbnNNYXAua2V5cygpKSA6IFtcIi4uLlwiXTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDYXB0aW9uc1Byb3ZpZGVyLCBTaW5nbGVTZWxlY3RvciwgU3RhdHVzIH0gZnJvbSBcInNyYy9oZWxwZXJzL3R5cGVzXCI7XG5pbXBvcnQgeyBnZXREYXRhc291cmNlUGxhY2Vob2xkZXJUZXh0IH0gZnJvbSBcInNyYy9oZWxwZXJzL3V0aWxzXCI7XG5pbXBvcnQge1xuICAgIEdyb3VwZWRDb21ib2JveENvbnRhaW5lclByb3BzLFxuICAgIEdyb3VwZWRDb21ib2JveFByZXZpZXdQcm9wcyxcbiAgICBPcHRpb25zU291cmNlU3RhdGljRGF0YVNvdXJjZVByZXZpZXdUeXBlLFxuICAgIFN0YXRpY0RhdGFTb3VyY2VDdXN0b21Db250ZW50VHlwZUVudW1cbn0gZnJvbSBcInR5cGluZ3MvR3JvdXBlZENvbWJvYm94UHJvcHNcIjtcbmltcG9ydCB7IFN0YXRpY1ByZXZpZXdDYXB0aW9uc1Byb3ZpZGVyIH0gZnJvbSBcIi4vU3RhdGljUHJldmlld0NhcHRpb25zUHJvdmlkZXJcIjtcbmltcG9ydCB7IFN0YXRpY1ByZXZpZXdPcHRpb25zUHJvdmlkZXIgfSBmcm9tIFwiLi9TdGF0aWNQcmV2aWV3T3B0aW9uc1Byb3ZpZGVyXCI7XG5cbmV4cG9ydCBjbGFzcyBTdGF0aWNQcmV2aWV3U2VsZWN0b3IgaW1wbGVtZW50cyBTaW5nbGVTZWxlY3RvciB7XG4gICAgdHlwZSA9IFwic2luZ2xlXCIgYXMgY29uc3Q7XG4gICAgc3RhdHVzOiBTdGF0dXMgPSBcImF2YWlsYWJsZVwiO1xuICAgIHJlYWRPbmx5OiBib29sZWFuID0gZmFsc2U7XG4gICAgdmFsaWRhdGlvbj86IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBvcHRpb25zOiBTdGF0aWNQcmV2aWV3T3B0aW9uc1Byb3ZpZGVyO1xuICAgIGNhcHRpb246IENhcHRpb25zUHJvdmlkZXI7XG4gICAgY2xlYXJhYmxlOiBib29sZWFuO1xuICAgIGN1cnJlbnRJZDogc3RyaW5nIHwgbnVsbDtcbiAgICBjdXN0b21Db250ZW50VHlwZTogU3RhdGljRGF0YVNvdXJjZUN1c3RvbUNvbnRlbnRUeXBlRW51bSA9IFwibGlzdEl0ZW1cIjtcbiAgICBvbkVudGVyRXZlbnQ/OiAoKSA9PiB2b2lkO1xuICAgIG9uTGVhdmVFdmVudD86ICgpID0+IHZvaWQ7XG4gICAgY29uc3RydWN0b3IocHJvcHM6IEdyb3VwZWRDb21ib2JveFByZXZpZXdQcm9wcykge1xuICAgICAgICBjb25zdCBvcHRpb25zTWFwID0gbmV3IE1hcDxzdHJpbmcsIE9wdGlvbnNTb3VyY2VTdGF0aWNEYXRhU291cmNlUHJldmlld1R5cGU+KCk7XG4gICAgICAgIHRoaXMuY2FwdGlvbiA9IG5ldyBTdGF0aWNQcmV2aWV3Q2FwdGlvbnNQcm92aWRlcihcbiAgICAgICAgICAgIG9wdGlvbnNNYXAsXG4gICAgICAgICAgICBwcm9wcy5zdGF0aWNEYXRhU291cmNlQ3VzdG9tQ29udGVudFR5cGUsXG4gICAgICAgICAgICBnZXREYXRhc291cmNlUGxhY2Vob2xkZXJUZXh0KHByb3BzKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBuZXcgU3RhdGljUHJldmlld09wdGlvbnNQcm92aWRlcihvcHRpb25zTWFwKTtcbiAgICAgICAgdGhpcy5yZWFkT25seSA9IHByb3BzLnJlYWRPbmx5O1xuICAgICAgICB0aGlzLmNsZWFyYWJsZSA9IHByb3BzLmNsZWFyYWJsZTtcbiAgICAgICAgdGhpcy5jdXJyZW50SWQgPSBudWxsO1xuICAgICAgICB0aGlzLmN1c3RvbUNvbnRlbnRUeXBlID0gcHJvcHMub3B0aW9uc1NvdXJjZUFzc29jaWF0aW9uQ3VzdG9tQ29udGVudFR5cGU7XG4gICAgICAgIGlmIChwcm9wcy5vcHRpb25zU291cmNlQXNzb2NpYXRpb25DdXN0b21Db250ZW50VHlwZSA9PT0gXCJsaXN0SXRlbVwiKSB7XG4gICAgICAgICAgICAvLyBhbHdheXMgcmVuZGVyIGN1c3RvbSBjb250ZW50IGRyb3B6b25lIGluIGRlc2lnbiBtb2RlIGlmIHR5cGUgaXMgb3B0aW9ucyBvbmx5XG4gICAgICAgICAgICB0aGlzLmN1c3RvbUNvbnRlbnRUeXBlID0gXCJ5ZXNcIjtcbiAgICAgICAgfVxuICAgICAgICBwcm9wcy5vcHRpb25zU291cmNlU3RhdGljRGF0YVNvdXJjZS5mb3JFYWNoKChvcHRpb24sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBvcHRpb25zTWFwLnNldChpbmRleC50b1N0cmluZygpLCBvcHRpb24pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2V0VmFsdWUoXzogc3RyaW5nIHwgbnVsbCk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgICB9XG4gICAgdXBkYXRlUHJvcHMoXzogR3JvdXBlZENvbWJvYm94Q29udGFpbmVyUHJvcHMpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtcbiAgICBHcm91cGVkQ29tYm9ib3hDb250YWluZXJQcm9wcyxcbiAgICBHcm91cGVkQ29tYm9ib3hQcmV2aWV3UHJvcHMsXG4gICAgTG9hZGluZ1R5cGVFbnVtLFxuICAgIE9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkN1c3RvbUNvbnRlbnRUeXBlRW51bVxufSBmcm9tIFwiLi4vLi4vLi4vLi4vdHlwaW5ncy9Hcm91cGVkQ29tYm9ib3hQcm9wc1wiO1xuaW1wb3J0IHsgQ2FwdGlvbnNQcm92aWRlciwgT3B0aW9uc1Byb3ZpZGVyLCBTaW5nbGVTZWxlY3RvciwgU3RhdHVzIH0gZnJvbSBcIi4uLy4uLy4uL2hlbHBlcnMvdHlwZXNcIjtcbmltcG9ydCB7IGdldERhdGFzb3VyY2VQbGFjZWhvbGRlclRleHQgfSBmcm9tIFwiLi4vLi4vLi4vaGVscGVycy91dGlsc1wiO1xuaW1wb3J0IHsgQXNzb2NpYXRpb25QcmV2aWV3Q2FwdGlvbnNQcm92aWRlciB9IGZyb20gXCIuLi8uLi9Bc3NvY2lhdGlvbi9QcmV2aWV3L0Fzc29jaWF0aW9uUHJldmlld0NhcHRpb25zUHJvdmlkZXJcIjtcbmltcG9ydCB7IEFzc29jaWF0aW9uUHJldmlld09wdGlvbnNQcm92aWRlciB9IGZyb20gXCIuLi8uLi9Bc3NvY2lhdGlvbi9QcmV2aWV3L0Fzc29jaWF0aW9uUHJldmlld09wdGlvbnNQcm92aWRlclwiO1xuXG5leHBvcnQgY2xhc3MgRGF0YWJhc2VQcmV2aWV3U2VsZWN0b3IgaW1wbGVtZW50cyBTaW5nbGVTZWxlY3RvciB7XG4gICAgYXR0cmlidXRlVHlwZT86IFwic3RyaW5nXCIgfCBcImJpZ1wiIHwgXCJib29sZWFuXCIgfCBcImRhdGVcIjtcbiAgICBjYXB0aW9uOiBDYXB0aW9uc1Byb3ZpZGVyO1xuICAgIGNsZWFyYWJsZTogYm9vbGVhbjtcbiAgICBjdXJyZW50SWQ6IHN0cmluZyB8IG51bGw7XG4gICAgY3VzdG9tQ29udGVudFR5cGU6IE9wdGlvbnNTb3VyY2VBc3NvY2lhdGlvbkN1c3RvbUNvbnRlbnRUeXBlRW51bTtcbiAgICBsYXp5TG9hZGluZz86IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBsb2FkaW5nVHlwZT86IExvYWRpbmdUeXBlRW51bSA9IFwic2tlbGV0b25cIjtcbiAgICBvcHRpb25zOiBPcHRpb25zUHJvdmlkZXI7XG4gICAgcmVhZE9ubHk6IGJvb2xlYW47XG4gICAgc2VsZWN0b3JUeXBlPzogXCJjb250ZXh0XCIgfCBcImRhdGFiYXNlXCIgfCBcInN0YXRpY1wiO1xuICAgIHN0YXR1czogU3RhdHVzID0gXCJhdmFpbGFibGVcIjtcbiAgICB0eXBlID0gXCJzaW5nbGVcIiBhcyBjb25zdDtcbiAgICB2YWxpZGF0aW9uPzogc3RyaW5nO1xuXG4gICAgb25FbnRlckV2ZW50PzogKCkgPT4gdm9pZDtcbiAgICBvbkxlYXZlRXZlbnQ/OiAoKSA9PiB2b2lkO1xuXG4gICAgY29uc3RydWN0b3IocHJvcHM6IEdyb3VwZWRDb21ib2JveFByZXZpZXdQcm9wcykge1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBuZXcgQXNzb2NpYXRpb25QcmV2aWV3Q2FwdGlvbnNQcm92aWRlcihuZXcgTWFwKCkpO1xuICAgICAgICB0aGlzLmNsZWFyYWJsZSA9IHByb3BzLmNsZWFyYWJsZTtcbiAgICAgICAgdGhpcy5jdXJyZW50SWQgPSBnZXREYXRhc291cmNlUGxhY2Vob2xkZXJUZXh0KHByb3BzKTtcbiAgICAgICAgdGhpcy5jdXN0b21Db250ZW50VHlwZSA9IHByb3BzLm9wdGlvbnNTb3VyY2VEYXRhYmFzZUN1c3RvbUNvbnRlbnRUeXBlO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBuZXcgQXNzb2NpYXRpb25QcmV2aWV3T3B0aW9uc1Byb3ZpZGVyKHRoaXMuY2FwdGlvbiwgbmV3IE1hcCgpKTtcbiAgICAgICAgdGhpcy5yZWFkT25seSA9IHByb3BzLnJlYWRPbmx5O1xuICAgICAgICAodGhpcy5jYXB0aW9uIGFzIEFzc29jaWF0aW9uUHJldmlld0NhcHRpb25zUHJvdmlkZXIpLnVwZGF0ZVByZXZpZXdQcm9wcyh7XG4gICAgICAgICAgICBjdXN0b21Db250ZW50UmVuZGVyZXI6IHByb3BzLm9wdGlvbnNTb3VyY2VEYXRhYmFzZUN1c3RvbUNvbnRlbnQucmVuZGVyZXIsXG4gICAgICAgICAgICBjdXN0b21Db250ZW50VHlwZTogcHJvcHMub3B0aW9uc1NvdXJjZURhdGFiYXNlQ3VzdG9tQ29udGVudFR5cGVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHByb3BzLm9wdGlvbnNTb3VyY2VEYXRhYmFzZUN1c3RvbUNvbnRlbnRUeXBlID09PSBcImxpc3RJdGVtXCIpIHtcbiAgICAgICAgICAgIC8vIGFsd2F5cyByZW5kZXIgY3VzdG9tIGNvbnRlbnQgZHJvcHpvbmUgaW4gZGVzaWduIG1vZGUgaWYgdHlwZSBpcyBvcHRpb25zIG9ubHlcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tQ29udGVudFR5cGUgPSBcInllc1wiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0VmFsdWUoXzogc3RyaW5nIHwgbnVsbCk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgICB9XG4gICAgdXBkYXRlUHJvcHMoXzogR3JvdXBlZENvbWJvYm94Q29udGFpbmVyUHJvcHMpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgZ2VuZXJhdGVVVUlEIH0gZnJvbSBcIkBtZW5kaXgvd2lkZ2V0LXBsdWdpbi1wbGF0Zm9ybS9mcmFtZXdvcmsvZ2VuZXJhdGUtdXVpZFwiO1xuaW1wb3J0IHsgUmVhY3RFbGVtZW50LCB1c2VNZW1vIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBHcm91cGVkQ29tYm9ib3hQcmV2aWV3UHJvcHMgfSBmcm9tIFwiLi4vdHlwaW5ncy9Hcm91cGVkQ29tYm9ib3hQcm9wc1wiO1xuaW1wb3J0IHsgU2luZ2xlU2VsZWN0aW9uIH0gZnJvbSBcIi4vY29tcG9uZW50cy9TaW5nbGVTZWxlY3Rpb24vU2luZ2xlU2VsZWN0aW9uXCI7XG5pbXBvcnQgeyBkeW5hbWljIH0gZnJvbSBcIkBtZW5kaXgvd2lkZ2V0LXBsdWdpbi10ZXN0LXV0aWxzXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25CYXNlUHJvcHMsIFNpbmdsZVNlbGVjdG9yIH0gZnJvbSBcIi4vaGVscGVycy90eXBlc1wiO1xuaW1wb3J0IFwiLi91aS9Hcm91cGVkQ29tYm9ib3guc2Nzc1wiO1xuaW1wb3J0IHsgQXNzb2NpYXRpb25QcmV2aWV3U2VsZWN0b3IgfSBmcm9tIFwiLi9oZWxwZXJzL0Fzc29jaWF0aW9uL1ByZXZpZXcvQXNzb2NpYXRpb25QcmV2aWV3U2VsZWN0b3JcIjtcbmltcG9ydCB7IFN0YXRpY1ByZXZpZXdTZWxlY3RvciB9IGZyb20gXCIuL2hlbHBlcnMvU3RhdGljL1ByZXZpZXcvU3RhdGljUHJldmlld1NlbGVjdG9yXCI7XG5pbXBvcnQgeyBEYXRhYmFzZVByZXZpZXdTZWxlY3RvciB9IGZyb20gXCIuL2hlbHBlcnMvRGF0YWJhc2UvUHJldmlldy9EYXRhYmFzZVByZXZpZXdTZWxlY3RvclwiO1xuXG5leHBvcnQgY29uc3QgcHJldmlldyA9IChwcm9wczogR3JvdXBlZENvbWJvYm94UHJldmlld1Byb3BzKTogUmVhY3RFbGVtZW50ID0+IHtcbiAgICBjb25zdCBpZCA9IGdlbmVyYXRlVVVJRCgpLnRvU3RyaW5nKCk7XG4gICAgY29uc3QgY29tbW9uUHJvcHM6IE9taXQ8U2VsZWN0aW9uQmFzZVByb3BzPG51bGw+LCBcInNlbGVjdG9yXCI+ID0ge1xuICAgICAgICB0YWJJbmRleDogMSxcbiAgICAgICAgaW5wdXRJZDogaWQsXG4gICAgICAgIGxhYmVsSWQ6IGAke2lkfS1sYWJlbGAsXG4gICAgICAgIHJlYWRPbmx5U3R5bGU6IHByb3BzLnJlYWRPbmx5U3R5bGUsXG4gICAgICAgIGFyaWFSZXF1aXJlZDogZHluYW1pYyhmYWxzZSksXG4gICAgICAgIGExMXlDb25maWc6IHtcbiAgICAgICAgICAgIGFyaWFMYWJlbHM6IHtcbiAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbjogcHJvcHMuY2xlYXJCdXR0b25BcmlhTGFiZWwsXG4gICAgICAgICAgICAgICAgcmVtb3ZlU2VsZWN0aW9uOiBwcm9wcy5yZW1vdmVWYWx1ZUFyaWFMYWJlbCxcbiAgICAgICAgICAgICAgICBzZWxlY3RBbGw6IHByb3BzLnNlbGVjdEFsbEJ1dHRvbkNhcHRpb25cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhMTF5U3RhdHVzTWVzc2FnZToge1xuICAgICAgICAgICAgICAgIGExMXlTZWxlY3RlZFZhbHVlOiBwcm9wcy5hMTF5U2VsZWN0ZWRWYWx1ZSxcbiAgICAgICAgICAgICAgICBhMTF5T3B0aW9uc0F2YWlsYWJsZTogcHJvcHMuYTExeU9wdGlvbnNBdmFpbGFibGUsXG4gICAgICAgICAgICAgICAgYTExeUluc3RydWN0aW9uczogcHJvcHMuYTExeUluc3RydWN0aW9ucyxcbiAgICAgICAgICAgICAgICBhMTF5Tm9PcHRpb246IHByb3BzLm5vT3B0aW9uc1RleHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbWVudUZvb3RlckNvbnRlbnQ6IHByb3BzLnNob3dGb290ZXIgPyAoXG4gICAgICAgICAgICA8cHJvcHMubWVudUZvb3RlckNvbnRlbnQucmVuZGVyZXIgY2FwdGlvbj1cIlBsYWNlIGZvb3RlciB3aWRnZXQgaGVyZVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgLz5cbiAgICAgICAgICAgIDwvcHJvcHMubWVudUZvb3RlckNvbnRlbnQucmVuZGVyZXI+XG4gICAgICAgICkgOiBudWxsLFxuICAgICAgICBrZWVwTWVudU9wZW46XG4gICAgICAgICAgICBwcm9wcy5zaG93Rm9vdGVyIHx8XG4gICAgICAgICAgICAocHJvcHMub3B0aW9uc1NvdXJjZVN0YXRpY0RhdGFTb3VyY2UubGVuZ3RoID4gMCAmJiBwcm9wcy5zdGF0aWNEYXRhU291cmNlQ3VzdG9tQ29udGVudFR5cGUgIT09IFwibm9cIilcbiAgICB9O1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL3J1bGVzLW9mLWhvb2tzXG4gICAgY29uc3Qgc2VsZWN0b3I6IFNpbmdsZVNlbGVjdG9yID0gdXNlTWVtbygoKSA9PiB7XG4gICAgICAgIGlmIChwcm9wcy5zb3VyY2UgPT09IFwic3RhdGljXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3RhdGljUHJldmlld1NlbGVjdG9yKHByb3BzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcHMuc291cmNlID09PSBcImRhdGFiYXNlXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0YWJhc2VQcmV2aWV3U2VsZWN0b3IocHJvcHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQXNzb2NpYXRpb25QcmV2aWV3U2VsZWN0b3IocHJvcHMpO1xuICAgIH0sIFtwcm9wc10pO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2lkZ2V0LWNvbWJvYm94IHdpZGdldC1jb21ib2JveC1lZGl0b3ItcHJldmlld1wiPlxuICAgICAgICAgICAgPFNpbmdsZVNlbGVjdGlvbiBzZWxlY3Rvcj17c2VsZWN0b3J9IHsuLi5jb21tb25Qcm9wc30gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn07XG4iXSwibmFtZXMiOlsiaGFzT3duIiwiaGFzT3duUHJvcGVydHkiLCJjbGFzc05hbWVzIiwiY2xhc3NlcyIsImkiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJhcmciLCJhcHBlbmRDbGFzcyIsInBhcnNlVmFsdWUiLCJBcnJheSIsImlzQXJyYXkiLCJhcHBseSIsInRvU3RyaW5nIiwiT2JqZWN0IiwicHJvdG90eXBlIiwiaW5jbHVkZXMiLCJrZXkiLCJjYWxsIiwidmFsdWUiLCJuZXdDbGFzcyIsIm1vZHVsZSIsImV4cG9ydHMiLCJkZWZhdWx0Iiwid2luZG93IiwiRFAiLCJNQVhfRFAiLCJNQVhfUE9XRVIiLCJOQU1FIiwiSU5WQUxJRCIsIklOVkFMSURfRFAiLCJJTlZBTElEX1JNIiwiRElWX0JZX1pFUk8iLCJQIiwiVU5ERUZJTkVEIiwicm91bmQiLCJ4Iiwic2QiLCJybSIsIm1vcmUiLCJ4YyIsImMiLCJjb25zdHJ1Y3RvciIsIlJNIiwiRXJyb3IiLCJlIiwidW5zaGlmdCIsInBvcCIsInN0cmluZ2lmeSIsImRvRXhwb25lbnRpYWwiLCJpc05vbnplcm8iLCJzIiwiam9pbiIsIm4iLCJjaGFyQXQiLCJzbGljZSIsImFicyIsImNtcCIsInkiLCJpc25lZyIsInljIiwiaiIsImsiLCJsIiwiZGl2IiwiQmlnIiwiYSIsImIiLCJkcCIsImJsIiwiYnQiLCJyaSIsImJ6IiwiYWkiLCJhbCIsInIiLCJybCIsInEiLCJxYyIsInFpIiwicCIsInB1c2giLCJzaGlmdCIsImVxIiwiZ3QiLCJndGUiLCJsdCIsImx0ZSIsIm1pbnVzIiwic3ViIiwidCIsInhsdHkiLCJwbHVzIiwieGUiLCJ5ZSIsInJldmVyc2UiLCJtb2QiLCJ5Z3R4IiwidGltZXMiLCJuZWciLCJhZGQiLCJwb3ciLCJvbmUiLCJwcmVjIiwic3FydCIsImhhbGYiLCJNYXRoIiwidG9FeHBvbmVudGlhbCIsImluZGV4T2YiLCJtdWwiLCJ0b0ZpeGVkIiwiU3ltYm9sIiwiZm9yIiwidG9KU09OIiwiTkUiLCJQRSIsInRvTnVtYmVyIiwic3RyaWN0IiwidG9QcmVjaXNpb24iLCJ2YWx1ZU9mIiwiY2hhcmFjdGVyTWFwIiwiY2hhcnMiLCJrZXlzIiwiYWxsQWNjZW50cyIsIlJlZ0V4cCIsImZpcnN0QWNjZW50IiwibWF0Y2hlciIsIm1hdGNoIiwicmVtb3ZlQWNjZW50cyIsInN0cmluZyIsInJlcGxhY2UiLCJoYXNBY2NlbnRzIiwiY3JlYXRlRWxlbWVudCIsIl9qc3giLCJfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZSIsIl9leHRlbmRzIiwiYXNzaWduIiwiYmluZCIsIl9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQiLCJSZWZlcmVuY2VFcnJvciIsIl9zZXRQcm90b3R5cGVPZiIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwiX2luaGVyaXRzTG9vc2UiLCJvIiwiY3JlYXRlIiwiaGFzU3ltYm9sIiwiUkVBQ1RfRUxFTUVOVF9UWVBFIiwiUkVBQ1RfUE9SVEFMX1RZUEUiLCJSRUFDVF9GUkFHTUVOVF9UWVBFIiwiUkVBQ1RfU1RSSUNUX01PREVfVFlQRSIsIlJFQUNUX1BST0ZJTEVSX1RZUEUiLCJSRUFDVF9QUk9WSURFUl9UWVBFIiwiUkVBQ1RfQ09OVEVYVF9UWVBFIiwiUkVBQ1RfQVNZTkNfTU9ERV9UWVBFIiwiUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEUiLCJSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIiwiUkVBQ1RfU1VTUEVOU0VfVFlQRSIsIlJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSIsIlJFQUNUX01FTU9fVFlQRSIsIlJFQUNUX0xBWllfVFlQRSIsIlJFQUNUX0JMT0NLX1RZUEUiLCJSRUFDVF9GVU5EQU1FTlRBTF9UWVBFIiwiUkVBQ1RfUkVTUE9OREVSX1RZUEUiLCJSRUFDVF9TQ09QRV9UWVBFIiwiaXNWYWxpZEVsZW1lbnRUeXBlIiwidHlwZSIsIiQkdHlwZW9mIiwidHlwZU9mIiwib2JqZWN0IiwiJCR0eXBlb2ZUeXBlIiwidW5kZWZpbmVkIiwiQXN5bmNNb2RlIiwiQ29uY3VycmVudE1vZGUiLCJDb250ZXh0Q29uc3VtZXIiLCJDb250ZXh0UHJvdmlkZXIiLCJFbGVtZW50IiwiRm9yd2FyZFJlZiIsIkZyYWdtZW50IiwiTGF6eSIsIk1lbW8iLCJQb3J0YWwiLCJQcm9maWxlciIsIlN0cmljdE1vZGUiLCJTdXNwZW5zZSIsImhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlIiwiaXNBc3luY01vZGUiLCJjb25zb2xlIiwiaXNDb25jdXJyZW50TW9kZSIsImlzQ29udGV4dENvbnN1bWVyIiwiaXNDb250ZXh0UHJvdmlkZXIiLCJpc0VsZW1lbnQiLCJpc0ZvcndhcmRSZWYiLCJpc0ZyYWdtZW50IiwiaXNMYXp5IiwiaXNNZW1vIiwiaXNQb3J0YWwiLCJpc1Byb2ZpbGVyIiwiaXNTdHJpY3RNb2RlIiwiaXNTdXNwZW5zZSIsInJlcXVpcmUiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJwcm9wSXNFbnVtZXJhYmxlIiwicHJvcGVydHlJc0VudW1lcmFibGUiLCJ0b09iamVjdCIsInZhbCIsIlR5cGVFcnJvciIsInNob3VsZFVzZU5hdGl2ZSIsInRlc3QxIiwiU3RyaW5nIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsInRlc3QyIiwiZnJvbUNoYXJDb2RlIiwib3JkZXIyIiwibWFwIiwidGVzdDMiLCJzcGxpdCIsImZvckVhY2giLCJsZXR0ZXIiLCJlcnIiLCJ0YXJnZXQiLCJzb3VyY2UiLCJmcm9tIiwidG8iLCJzeW1ib2xzIiwiUmVhY3RQcm9wVHlwZXNTZWNyZXQiLCJGdW5jdGlvbiIsInByaW50V2FybmluZyIsInJlcXVpcmUkJDAiLCJsb2dnZWRUeXBlRmFpbHVyZXMiLCJoYXMiLCJyZXF1aXJlJCQxIiwidGV4dCIsIm1lc3NhZ2UiLCJlcnJvciIsImNoZWNrUHJvcFR5cGVzIiwidHlwZVNwZWNzIiwidmFsdWVzIiwibG9jYXRpb24iLCJjb21wb25lbnROYW1lIiwiZ2V0U3RhY2siLCJ0eXBlU3BlY05hbWUiLCJuYW1lIiwiZXgiLCJzdGFjayIsInJlc2V0V2FybmluZ0NhY2hlIiwiUmVhY3RJcyIsInJlcXVpcmUkJDIiLCJyZXF1aXJlJCQzIiwicmVxdWlyZSQkNCIsImVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGwiLCJpc1ZhbGlkRWxlbWVudCIsInRocm93T25EaXJlY3RBY2Nlc3MiLCJJVEVSQVRPUl9TWU1CT0wiLCJpdGVyYXRvciIsIkZBVVhfSVRFUkFUT1JfU1lNQk9MIiwiZ2V0SXRlcmF0b3JGbiIsIm1heWJlSXRlcmFibGUiLCJpdGVyYXRvckZuIiwiQU5PTllNT1VTIiwiUmVhY3RQcm9wVHlwZXMiLCJhcnJheSIsImNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyIiwiYmlnaW50IiwiYm9vbCIsImZ1bmMiLCJudW1iZXIiLCJzeW1ib2wiLCJhbnkiLCJjcmVhdGVBbnlUeXBlQ2hlY2tlciIsImFycmF5T2YiLCJjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIiLCJlbGVtZW50IiwiY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyIiwiZWxlbWVudFR5cGUiLCJjcmVhdGVFbGVtZW50VHlwZVR5cGVDaGVja2VyIiwiaW5zdGFuY2VPZiIsImNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIiLCJub2RlIiwiY3JlYXRlTm9kZUNoZWNrZXIiLCJvYmplY3RPZiIsImNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIiLCJvbmVPZiIsImNyZWF0ZUVudW1UeXBlQ2hlY2tlciIsIm9uZU9mVHlwZSIsImNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIiLCJzaGFwZSIsImNyZWF0ZVNoYXBlVHlwZUNoZWNrZXIiLCJleGFjdCIsImNyZWF0ZVN0cmljdFNoYXBlVHlwZUNoZWNrZXIiLCJpcyIsIlByb3BUeXBlRXJyb3IiLCJkYXRhIiwiY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIiLCJ2YWxpZGF0ZSIsIm1hbnVhbFByb3BUeXBlQ2FsbENhY2hlIiwibWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQiLCJjaGVja1R5cGUiLCJpc1JlcXVpcmVkIiwicHJvcHMiLCJwcm9wTmFtZSIsInByb3BGdWxsTmFtZSIsInNlY3JldCIsImNhY2hlS2V5IiwiY2hhaW5lZENoZWNrVHlwZSIsImV4cGVjdGVkVHlwZSIsInByb3BWYWx1ZSIsInByb3BUeXBlIiwiZ2V0UHJvcFR5cGUiLCJwcmVjaXNlVHlwZSIsImdldFByZWNpc2VUeXBlIiwidHlwZUNoZWNrZXIiLCJleHBlY3RlZENsYXNzIiwiZXhwZWN0ZWRDbGFzc05hbWUiLCJhY3R1YWxDbGFzc05hbWUiLCJnZXRDbGFzc05hbWUiLCJleHBlY3RlZFZhbHVlcyIsInZhbHVlc1N0cmluZyIsIkpTT04iLCJyZXBsYWNlciIsImFycmF5T2ZUeXBlQ2hlY2tlcnMiLCJwcm9jZXNzIiwiY2hlY2tlciIsImdldFBvc3RmaXhGb3JUeXBlV2FybmluZyIsImV4cGVjdGVkVHlwZXMiLCJjaGVja2VyUmVzdWx0IiwiZXhwZWN0ZWRUeXBlc01lc3NhZ2UiLCJpc05vZGUiLCJpbnZhbGlkVmFsaWRhdG9yRXJyb3IiLCJzaGFwZVR5cGVzIiwiYWxsS2V5cyIsImV2ZXJ5Iiwic3RlcCIsImVudHJpZXMiLCJuZXh0IiwiZG9uZSIsImVudHJ5IiwiaXNTeW1ib2wiLCJEYXRlIiwiUHJvcFR5cGVzIiwiUkVBQ1RfU0VSVkVSX0JMT0NLX1RZUEUiLCJSRUFDVF9ERUJVR19UUkFDSU5HX01PREVfVFlQRSIsIlJFQUNUX0xFR0FDWV9ISURERU5fVFlQRSIsInN5bWJvbEZvciIsIlJFQUNUX09QQVFVRV9JRF9UWVBFIiwiUkVBQ1RfT0ZGU0NSRUVOX1RZUEUiLCJlbmFibGVTY29wZUFQSSIsImhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQ29uY3VycmVudE1vZGUiLCJfX2Fzc2lnbiIsIlN1cHByZXNzZWRFcnJvciIsInN1cHByZXNzZWQiLCJpZENvdW50ZXIiLCJjYlRvQ2IiLCJjYiIsIm5vb3AiLCJzY3JvbGxJbnRvVmlldyIsIm1lbnVOb2RlIiwiYWN0aW9ucyIsImNvbXB1dGUiLCJib3VuZGFyeSIsImJsb2NrIiwic2Nyb2xsTW9kZSIsIl9yZWYiLCJlbCIsInRvcCIsImxlZnQiLCJzY3JvbGxUb3AiLCJzY3JvbGxMZWZ0IiwiaXNPckNvbnRhaW5zTm9kZSIsInBhcmVudCIsImNoaWxkIiwiZW52aXJvbm1lbnQiLCJyZXN1bHQiLCJOb2RlIiwiY29udGFpbnMiLCJkZWJvdW5jZSIsImZuIiwidGltZSIsInRpbWVvdXRJZCIsImNhbmNlbCIsImNsZWFyVGltZW91dCIsIndyYXBwZXIiLCJfbGVuIiwiYXJncyIsIl9rZXkiLCJzZXRUaW1lb3V0IiwiY2FsbEFsbEV2ZW50SGFuZGxlcnMiLCJfbGVuMiIsImZucyIsIl9rZXkyIiwiZXZlbnQiLCJfbGVuMyIsIl9rZXkzIiwic29tZSIsImNvbmNhdCIsInByZXZlbnREb3duc2hpZnREZWZhdWx0IiwibmF0aXZlRXZlbnQiLCJoYW5kbGVSZWZzIiwiX2xlbjQiLCJyZWZzIiwiX2tleTQiLCJyZWYiLCJjdXJyZW50IiwiZ2VuZXJhdGVJZCIsImdldEExMXlTdGF0dXNNZXNzYWdlJDEiLCJfcmVmMiIsImlzT3BlbiIsInJlc3VsdENvdW50IiwicHJldmlvdXNSZXN1bHRDb3VudCIsInVud3JhcEFycmF5IiwiZGVmYXVsdFZhbHVlIiwiaXNET01FbGVtZW50IiwiZ2V0RWxlbWVudFByb3BzIiwicmVxdWlyZWRQcm9wIiwiZm5OYW1lIiwic3RhdGVLZXlzIiwicGlja1N0YXRlIiwic3RhdGUiLCJnZXRTdGF0ZSIsInJlZHVjZSIsInByZXZTdGF0ZSIsImlzQ29udHJvbGxlZFByb3AiLCJub3JtYWxpemVBcnJvd0tleSIsImtleUNvZGUiLCJpc1BsYWluT2JqZWN0Iiwib2JqIiwiZ2V0TmV4dFdyYXBwaW5nSW5kZXgiLCJtb3ZlQW1vdW50IiwiYmFzZUluZGV4IiwiaXRlbUNvdW50IiwiZ2V0SXRlbU5vZGVGcm9tSW5kZXgiLCJjaXJjdWxhciIsIml0ZW1zTGFzdEluZGV4IiwibmV3SW5kZXgiLCJub25EaXNhYmxlZE5ld0luZGV4IiwiZ2V0TmV4dE5vbkRpc2FibGVkSW5kZXgiLCJjdXJyZW50RWxlbWVudE5vZGUiLCJoYXNBdHRyaWJ1dGUiLCJpbmRleCIsIl9pbmRleCIsInRhcmdldFdpdGhpbkRvd25zaGlmdCIsImRvd25zaGlmdEVsZW1lbnRzIiwiY2hlY2tBY3RpdmVFbGVtZW50IiwiY29udGV4dE5vZGUiLCJkb2N1bWVudCIsImFjdGl2ZUVsZW1lbnQiLCJ2YWxpZGF0ZUNvbnRyb2xsZWRVbmNoYW5nZWQiLCJwcmV2UHJvcHMiLCJuZXh0UHJvcHMiLCJ3YXJuaW5nRGVzY3JpcHRpb24iLCJwcm9wS2V5IiwiY2xlYW51cFN0YXR1cyIsImRvY3VtZW50UHJvcCIsImdldFN0YXR1c0RpdiIsInRleHRDb250ZW50Iiwic2V0U3RhdHVzIiwic3RhdHVzIiwic3RhdHVzRGl2IiwiZ2V0RWxlbWVudEJ5SWQiLCJzZXRBdHRyaWJ1dGUiLCJzdHlsZSIsImJvcmRlciIsImNsaXAiLCJoZWlnaHQiLCJtYXJnaW4iLCJvdmVyZmxvdyIsInBhZGRpbmciLCJwb3NpdGlvbiIsIndpZHRoIiwiYm9keSIsImFwcGVuZENoaWxkIiwidW5rbm93biIsIm1vdXNlVXAiLCJpdGVtTW91c2VFbnRlciIsImtleURvd25BcnJvd1VwIiwia2V5RG93bkFycm93RG93biIsImtleURvd25Fc2NhcGUiLCJrZXlEb3duRW50ZXIiLCJrZXlEb3duSG9tZSIsImtleURvd25FbmQiLCJjbGlja0l0ZW0iLCJibHVySW5wdXQiLCJjaGFuZ2VJbnB1dCIsImtleURvd25TcGFjZUJ1dHRvbiIsImNsaWNrQnV0dG9uIiwiYmx1ckJ1dHRvbiIsImNvbnRyb2xsZWRQcm9wVXBkYXRlZFNlbGVjdGVkSXRlbSIsInRvdWNoRW5kIiwic3RhdGVDaGFuZ2VUeXBlcyQzIiwiZnJlZXplIiwiX2V4Y2x1ZGVkJDQiLCJfZXhjbHVkZWQyJDMiLCJfZXhjbHVkZWQzJDIiLCJfZXhjbHVkZWQ0JDEiLCJfZXhjbHVkZWQ1IiwiRG93bnNoaWZ0IiwiX0NvbXBvbmVudCIsIl9wcm9wcyIsIl90aGlzIiwiaWQiLCJtZW51SWQiLCJsYWJlbElkIiwiaW5wdXRJZCIsImdldEl0ZW1JZCIsImlucHV0IiwiaXRlbXMiLCJ0aW1lb3V0SWRzIiwiaW50ZXJuYWxTZXRUaW1lb3V0IiwiZmlsdGVyIiwic2V0SXRlbUNvdW50IiwiY291bnQiLCJ1bnNldEl0ZW1Db3VudCIsInNldEhpZ2hsaWdodGVkSW5kZXgiLCJoaWdobGlnaHRlZEluZGV4Iiwib3RoZXJTdGF0ZVRvU2V0IiwiZGVmYXVsdEhpZ2hsaWdodGVkSW5kZXgiLCJpbnRlcm5hbFNldFN0YXRlIiwiY2xlYXJTZWxlY3Rpb24iLCJzZWxlY3RlZEl0ZW0iLCJpbnB1dFZhbHVlIiwiZGVmYXVsdElzT3BlbiIsInNlbGVjdEl0ZW0iLCJpdGVtIiwiaXRlbVRvU3RyaW5nIiwic2VsZWN0SXRlbUF0SW5kZXgiLCJpdGVtSW5kZXgiLCJzZWxlY3RIaWdobGlnaHRlZEl0ZW0iLCJzdGF0ZVRvU2V0IiwiaXNJdGVtU2VsZWN0ZWQiLCJvbkNoYW5nZUFyZyIsIm9uU3RhdGVDaGFuZ2VBcmciLCJpc1N0YXRlVG9TZXRGdW5jdGlvbiIsIm9uSW5wdXRWYWx1ZUNoYW5nZSIsImdldFN0YXRlQW5kSGVscGVycyIsInNldFN0YXRlIiwibmV3U3RhdGVUb1NldCIsInN0YXRlUmVkdWNlciIsIm5leHRTdGF0ZSIsImhhc01vcmVTdGF0ZVRoYW5UeXBlIiwib25TdGF0ZUNoYW5nZSIsIm9uU2VsZWN0Iiwib25DaGFuZ2UiLCJvblVzZXJBY3Rpb24iLCJyb290UmVmIiwiX3Jvb3ROb2RlIiwiZ2V0Um9vdFByb3BzIiwiX3RlbXAiLCJfdGVtcDIiLCJfZXh0ZW5kczIiLCJfcmVmJHJlZktleSIsInJlZktleSIsInJlc3QiLCJfcmVmMiRzdXBwcmVzc1JlZkVycm8iLCJzdXBwcmVzc1JlZkVycm9yIiwiY2FsbGVkIiwiX3RoaXMkZ2V0U3RhdGUiLCJyb2xlIiwia2V5RG93bkhhbmRsZXJzIiwiQXJyb3dEb3duIiwiX3RoaXMyIiwicHJldmVudERlZmF1bHQiLCJhbW91bnQiLCJzaGlmdEtleSIsIm1vdmVIaWdobGlnaHRlZEluZGV4IiwiZ2V0SXRlbUNvdW50IiwiX3RoaXMyJGdldFN0YXRlIiwibmV4dEhpZ2hsaWdodGVkSW5kZXgiLCJBcnJvd1VwIiwiX3RoaXMzIiwiX3RoaXMzJGdldFN0YXRlIiwiRW50ZXIiLCJ3aGljaCIsIl90aGlzJGdldFN0YXRlMiIsIml0ZW1Ob2RlIiwiRXNjYXBlIiwicmVzZXQiLCJidXR0b25LZXlEb3duSGFuZGxlcnMiLCJfIiwidG9nZ2xlTWVudSIsImlucHV0S2V5RG93bkhhbmRsZXJzIiwiSG9tZSIsIl90aGlzNCIsIl90aGlzJGdldFN0YXRlMyIsIm5ld0hpZ2hsaWdodGVkSW5kZXgiLCJFbmQiLCJfdGhpczUiLCJfdGhpcyRnZXRTdGF0ZTQiLCJnZXRUb2dnbGVCdXR0b25Qcm9wcyIsIl90ZW1wMyIsIl9yZWYzIiwib25DbGljayIsIm9uUHJlc3MiLCJvbktleURvd24iLCJvbktleVVwIiwib25CbHVyIiwiX3RoaXMkZ2V0U3RhdGU1IiwiZW5hYmxlZEV2ZW50SGFuZGxlcnMiLCJidXR0b25IYW5kbGVDbGljayIsImJ1dHRvbkhhbmRsZUtleURvd24iLCJidXR0b25IYW5kbGVLZXlVcCIsImJ1dHRvbkhhbmRsZUJsdXIiLCJldmVudEhhbmRsZXJzIiwiZGlzYWJsZWQiLCJmb2N1cyIsImJsdXJUYXJnZXQiLCJpc01vdXNlRG93biIsImdldExhYmVsUHJvcHMiLCJodG1sRm9yIiwiZ2V0SW5wdXRQcm9wcyIsIl90ZW1wNCIsIl9yZWY0Iiwib25JbnB1dCIsIm9uQ2hhbmdlVGV4dCIsIm9uQ2hhbmdlS2V5IiwiX3RoaXMkZ2V0U3RhdGU2IiwiX2V2ZW50SGFuZGxlcnMiLCJpbnB1dEhhbmRsZUNoYW5nZSIsImlucHV0SGFuZGxlS2V5RG93biIsImlucHV0SGFuZGxlQmx1ciIsImF1dG9Db21wbGV0ZSIsImRvd25zaGlmdEJ1dHRvbklzQWN0aXZlIiwiZGF0YXNldCIsInRvZ2dsZSIsIm1lbnVSZWYiLCJfbWVudU5vZGUiLCJnZXRNZW51UHJvcHMiLCJfdGVtcDUiLCJfdGVtcDYiLCJfZXh0ZW5kczMiLCJfcmVmNSIsIl9yZWY1JHJlZktleSIsIl9yZWY2IiwiX3JlZjYkc3VwcHJlc3NSZWZFcnJvIiwiZ2V0SXRlbVByb3BzIiwiX3RlbXA3IiwiX2VuYWJsZWRFdmVudEhhbmRsZXJzIiwiX3JlZjciLCJvbk1vdXNlTW92ZSIsIm9uTW91c2VEb3duIiwiX3JlZjckaXRlbSIsIm9uU2VsZWN0S2V5IiwiY3VzdG9tQ2xpY2tIYW5kbGVyIiwiYXZvaWRTY3JvbGxpbmciLCJjbGVhckl0ZW1zIiwiX3JlZjgiLCJfcmVmOSIsIl90aGlzJGdldFN0YXRlNyIsIm9wZW5NZW51IiwiY2xvc2VNZW51IiwidXBkYXRlU3RhdHVzIiwiZ2V0QTExeVN0YXR1c01lc3NhZ2UiLCJoaWdobGlnaHRlZEl0ZW0iLCJfdGhpcyRwcm9wcyIsIl90aGlzJHByb3BzJGluaXRpYWxIaSIsImluaXRpYWxIaWdobGlnaHRlZEluZGV4IiwiX2hpZ2hsaWdodGVkSW5kZXgiLCJfdGhpcyRwcm9wcyRpbml0aWFsSXMiLCJpbml0aWFsSXNPcGVuIiwiX2lzT3BlbiIsIl90aGlzJHByb3BzJGluaXRpYWxJbiIsImluaXRpYWxJbnB1dFZhbHVlIiwiX2lucHV0VmFsdWUiLCJfdGhpcyRwcm9wcyRpbml0aWFsU2UiLCJpbml0aWFsU2VsZWN0ZWRJdGVtIiwiX3NlbGVjdGVkSXRlbSIsIl9zdGF0ZSIsIl9wcm90byIsImludGVybmFsQ2xlYXJUaW1lb3V0cyIsImdldFN0YXRlJDEiLCJzdGF0ZVRvTWVyZ2UiLCJzY3JvbGxIaWdobGlnaHRlZEl0ZW1JbnRvVmlldyIsIl90aGlzNiIsIl90aGlzJGdldFN0YXRlOCIsIl90aGlzJGdldFN0YXRlOSIsImNvbXBvbmVudERpZE1vdW50IiwiX3RoaXM3IiwidmFsaWRhdGVHZXRNZW51UHJvcHNDYWxsZWRDb3JyZWN0bHkiLCJvbk1vdXNlVXAiLCJjb250ZXh0V2l0aGluRG93bnNoaWZ0Iiwib25PdXRlckNsaWNrIiwib25Ub3VjaFN0YXJ0IiwiaXNUb3VjaE1vdmUiLCJvblRvdWNoTW92ZSIsIm9uVG91Y2hFbmQiLCJhZGRFdmVudExpc3RlbmVyIiwiY2xlYW51cCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJzaG91bGRTY3JvbGwiLCJfcmVmMTAiLCJjdXJyZW50SGlnaGxpZ2h0ZWRJbmRleCIsIl9yZWYxMSIsInByZXZIaWdobGlnaHRlZEluZGV4Iiwic2Nyb2xsV2hlbk9wZW4iLCJzY3JvbGxXaGVuTmF2aWdhdGluZyIsImNvbXBvbmVudERpZFVwZGF0ZSIsInNlbGVjdGVkSXRlbUNoYW5nZWQiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInJlbmRlciIsImNoaWxkcmVuIiwidmFsaWRhdGVHZXRSb290UHJvcHNDYWxsZWRDb3JyZWN0bHkiLCJjbG9uZUVsZW1lbnQiLCJDb21wb25lbnQiLCJkZWZhdWx0UHJvcHMiLCJ3YXJuIiwicHJldkl0ZW0iLCJzdGF0ZUNoYW5nZVR5cGVzIiwicHJvcFR5cGVzIiwiX3JlZjEyIiwiX3JlZjEzIiwicmVmS2V5U3BlY2lmaWVkIiwiaXNDb21wb3NpdGUiLCJfZXhjbHVkZWQkMyIsImRyb3Bkb3duRGVmYXVsdFN0YXRlVmFsdWVzIiwiY2FsbE9uQ2hhbmdlUHJvcHMiLCJhY3Rpb24iLCJuZXdTdGF0ZSIsImNoYW5nZXMiLCJpbnZva2VPbkNoYW5nZUhhbmRsZXIiLCJoYW5kbGVyIiwiY2FwaXRhbGl6ZVN0cmluZyIsImdldEExMXlTZWxlY3Rpb25NZXNzYWdlIiwic2VsZWN0aW9uUGFyYW1ldGVycyIsIml0ZW1Ub1N0cmluZ0xvY2FsIiwidXBkYXRlQTExeVN0YXR1cyIsImdldEExMXlNZXNzYWdlIiwidXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdCIsInVzZUxheW91dEVmZmVjdCIsInVzZUVmZmVjdCIsInVzZUVsZW1lbnRJZHMiLCJfcmVmJGlkIiwidG9nZ2xlQnV0dG9uSWQiLCJlbGVtZW50SWRzUmVmIiwidXNlUmVmIiwiZ2V0SXRlbUFuZEluZGV4IiwiaXRlbVByb3AiLCJpbmRleFByb3AiLCJlcnJvck1lc3NhZ2UiLCJ0b1VwcGVyQ2FzZSIsInVzZUxhdGVzdFJlZiIsInVzZUVuaGFuY2VkUmVkdWNlciIsInJlZHVjZXIiLCJpbml0aWFsU3RhdGUiLCJwcmV2U3RhdGVSZWYiLCJhY3Rpb25SZWYiLCJlbmhhbmNlZFJlZHVjZXIiLCJ1c2VDYWxsYmFjayIsIl91c2VSZWR1Y2VyIiwidXNlUmVkdWNlciIsImRpc3BhdGNoIiwicHJvcHNSZWYiLCJkaXNwYXRjaFdpdGhQcm9wcyIsImRlZmF1bHRQcm9wcyQzIiwiZ2V0RGVmYXVsdFZhbHVlJDEiLCJkZWZhdWx0U3RhdGVWYWx1ZXMiLCJnZXRJbml0aWFsVmFsdWUkMSIsImluaXRpYWxWYWx1ZSIsImdldEluaXRpYWxTdGF0ZSQyIiwiZ2V0SGlnaGxpZ2h0ZWRJbmRleE9uT3BlbiIsIm9mZnNldCIsInVzZU1vdXNlQW5kVG91Y2hUcmFja2VyIiwiZG93bnNoaWZ0RWxlbWVudFJlZnMiLCJoYW5kbGVCbHVyIiwibW91c2VBbmRUb3VjaFRyYWNrZXJzUmVmIiwidXNlR2V0dGVyUHJvcHNDYWxsZWRDaGVja2VyIiwiaXNJbml0aWFsTW91bnRSZWYiLCJwcm9wS2V5cyIsImdldHRlclByb3BzQ2FsbGVkUmVmIiwiYWNjIiwicHJvcENhbGxJbmZvIiwiZWxlbWVudFJlZiIsInNldEdldHRlclByb3BDYWxsSW5mbyIsInVzZUExMXlNZXNzYWdlU2V0dGVyIiwiZGVwZW5kZW5jeUFycmF5IiwiaXNJbml0aWFsTW91bnQiLCJ1c2VTY3JvbGxJbnRvVmlldyIsIml0ZW1SZWZzIiwibWVudUVsZW1lbnQiLCJzY3JvbGxJbnRvVmlld1Byb3AiLCJzaG91bGRTY3JvbGxSZWYiLCJ1c2VDb250cm9sUHJvcHNWYWxpZGF0b3IiLCJwcmV2UHJvcHNSZWYiLCJnZXRDaGFuZ2VzT25TZWxlY3Rpb24iLCJfcHJvcHMkaXRlbXMiLCJzaG91bGRTZWxlY3QiLCJkb3duc2hpZnRDb21tb25SZWR1Y2VyIiwiSXRlbU1vdXNlTW92ZSIsIk1lbnVNb3VzZUxlYXZlIiwiVG9nZ2xlQnV0dG9uQ2xpY2siLCJGdW5jdGlvblRvZ2dsZU1lbnUiLCJGdW5jdGlvbk9wZW5NZW51IiwiRnVuY3Rpb25DbG9zZU1lbnUiLCJGdW5jdGlvblNldEhpZ2hsaWdodGVkSW5kZXgiLCJGdW5jdGlvblNldElucHV0VmFsdWUiLCJGdW5jdGlvblJlc2V0IiwiZGVmYXVsdFNlbGVjdGVkSXRlbSIsIm9uU2VsZWN0ZWRJdGVtQ2hhbmdlIiwib25IaWdobGlnaHRlZEluZGV4Q2hhbmdlIiwib25Jc09wZW5DaGFuZ2UiLCJfYSIsIklucHV0S2V5RG93bkFycm93RG93biIsIklucHV0S2V5RG93bkFycm93VXAiLCJJbnB1dEtleURvd25Fc2NhcGUiLCJJbnB1dEtleURvd25Ib21lIiwiSW5wdXRLZXlEb3duRW5kIiwiSW5wdXRLZXlEb3duUGFnZVVwIiwiSW5wdXRLZXlEb3duUGFnZURvd24iLCJJbnB1dEtleURvd25FbnRlciIsIklucHV0Q2hhbmdlIiwiSW5wdXRCbHVyIiwiSW5wdXRGb2N1cyIsIkl0ZW1DbGljayIsIkZ1bmN0aW9uU2VsZWN0SXRlbSIsIkZ1bmN0aW9uUmVzZXQkMSIsIkNvbnRyb2xsZWRQcm9wVXBkYXRlZFNlbGVjdGVkSXRlbSIsInN0YXRlQ2hhbmdlVHlwZXMkMSIsImdldEluaXRpYWxTdGF0ZSQxIiwiZGVmYXVsdElucHV0VmFsdWUiLCJwcm9wVHlwZXMkMSIsInVzZUNvbnRyb2xsZWRSZWR1Y2VyIiwicHJldmlvdXNTZWxlY3RlZEl0ZW1SZWYiLCJfdXNlRW5oYW5jZWRSZWR1Y2VyIiwidmFsaWRhdGVQcm9wVHlwZXMkMSIsInZhbGlkYXRlUHJvcFR5cGVzIiwib3B0aW9ucyIsImNhbGxlciIsImRlZmF1bHRQcm9wcyQxIiwiZG93bnNoaWZ0VXNlQ29tYm9ib3hSZWR1Y2VyIiwiYWx0S2V5IiwiX2V4Y2x1ZGVkJDEiLCJfZXhjbHVkZWQyJDEiLCJfZXhjbHVkZWQzIiwiX2V4Y2x1ZGVkNCIsInVzZUNvbWJvYm94IiwidXNlclByb3BzIiwiX3VzZUNvbnRyb2xsZWRSZWR1Y2VyIiwiaW5wdXRSZWYiLCJ0b2dnbGVCdXR0b25SZWYiLCJlbGVtZW50SWRzIiwicHJldmlvdXNSZXN1bHRDb3VudFJlZiIsImxhdGVzdCIsImZvY3VzT25PcGVuIiwiX2Vudmlyb25tZW50JGRvY3VtZW50IiwiX2lucHV0UmVmJGN1cnJlbnQiLCJ1c2VNZW1vIiwibGF0ZXN0U3RhdGUiLCJQYWdlVXAiLCJQYWdlRG93biIsImxhYmVsUHJvcHMiLCJvbk1vdXNlTGVhdmUiLCJfcmVmMyRyZWZLZXkiLCJfbGF0ZXN0JGN1cnJlbnQiLCJsYXRlc3RQcm9wcyIsIl9nZXRJdGVtQW5kSW5kZXgiLCJpdGVtSGFuZGxlTW91c2VNb3ZlIiwiaXRlbUhhbmRsZUNsaWNrIiwiaXRlbUhhbmRsZU1vdXNlRG93biIsIl9leHRlbmRzNCIsInRvZ2dsZUJ1dHRvbkhhbmRsZUNsaWNrIiwidG9nZ2xlQnV0dG9uTm9kZSIsInRhYkluZGV4IiwiX2V4dGVuZHM1Iiwib25Gb2N1cyIsIl9yZWY2JHJlZktleSIsIl9yZWY3JHN1cHByZXNzUmVmRXJybyIsImlzQmx1ckJ5VGFiQ2hhbmdlIiwicmVsYXRlZFRhcmdldCIsImlucHV0SGFuZGxlRm9jdXMiLCJpbnB1dE5vZGUiLCJuZXdTZWxlY3RlZEl0ZW0iLCJzZXRJbnB1dFZhbHVlIiwibmV3SW5wdXRWYWx1ZSIsImdldEExMXlSZW1vdmFsTWVzc2FnZSIsInJlbW92ZWRTZWxlY3RlZEl0ZW0iLCJzZWxlY3RlZEl0ZW1zIiwiaW5pdGlhbFNlbGVjdGVkSXRlbXMiLCJkZWZhdWx0U2VsZWN0ZWRJdGVtcyIsImFjdGl2ZUluZGV4IiwiaW5pdGlhbEFjdGl2ZUluZGV4IiwiZGVmYXVsdEFjdGl2ZUluZGV4Iiwib25BY3RpdmVJbmRleENoYW5nZSIsIm9uU2VsZWN0ZWRJdGVtc0NoYW5nZSIsImtleU5hdmlnYXRpb25OZXh0Iiwia2V5TmF2aWdhdGlvblByZXZpb3VzIiwiZm9yd2FyZFJlZiIsIl9qc3hzIiwidXNlU3RhdGUiLCJzdHlsZUluamVjdCIsImNzcyIsImluc2VydEF0IiwiaGVhZCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiZmlyc3RDaGlsZCIsImluc2VydEJlZm9yZSIsInN0eWxlU2hlZXQiLCJjc3NUZXh0IiwiY3JlYXRlVGV4dE5vZGUiXSwibWFwcGluZ3MiOiI7Ozs7O1NBQWdCLFlBQVksR0FBQTtJQUN4QixPQUFPLHNDQUFzQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFHO0FBQy9ELFFBQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuQyxRQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUM7QUFDMUMsUUFBQSxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDMUIsS0FBQyxDQUFD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QUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLElBQUk7R0FDVCxHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsSUFBSTtHQUNULEdBQUcsRUFBRSxJQUFJO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsSUFBSTtHQUNULEdBQUcsRUFBRSxJQUFJO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLElBQUk7R0FDVCxHQUFHLEVBQUUsSUFBSTtHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsSUFBSTtHQUNULEdBQUcsRUFBRSxJQUFJO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLEdBQUcsRUFBRSxHQUFHO0dBQ1IsR0FBRyxFQUFFLEdBQUc7R0FDUixJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFFLEdBQUc7R0FDUixHQUFHLEVBQUUsR0FBRztHQUNSLElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsSUFBSSxFQUFFLEdBQUc7R0FDVCxJQUFJLEVBQUUsR0FBRztHQUNULElBQUksRUFBRSxHQUFHO0dBQ1QsR0FBRyxFQUFDLEdBQUc7R0FDUCxHQUFHLEVBQUMsR0FBRztHQUNQLEdBQUcsRUFBQyxHQUFHO0FBQ1AsR0FBQSxHQUFHLEVBQUMsR0FBQTtFQUNKLENBQUE7QUFFRCxDQUFBLElBQUlDLEtBQUssR0FBRzNHLE1BQU0sQ0FBQzRHLElBQUksQ0FBQ0YsWUFBWSxDQUFDLENBQUNwRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7Q0FDL0MsSUFBSXVFLFVBQVUsR0FBRyxJQUFJQyxNQUFNLENBQUNILEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQTtDQUN2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RUFBQSxFQUFFLENBQVEsTUFBQSxDQUFBO1FBQ3RCLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYTtBQUNsQyxRQUFBLFlBQVksRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDO0FBQzVCLFFBQUEsVUFBVSxFQUFFO0FBQ1IsWUFBQSxVQUFVLEVBQUU7Z0JBQ1IsY0FBYyxFQUFFLEtBQUssQ0FBQyxvQkFBb0I7Z0JBQzFDLGVBQWUsRUFBRSxLQUFLLENBQUMsb0JBQW9CO2dCQUMzQyxTQUFTLEVBQUUsS0FBSyxDQUFDLHNCQUFzQjtBQUMxQyxhQUFBO0FBQ0QsWUFBQSxpQkFBaUIsRUFBRTtnQkFDZixpQkFBaUIsRUFBRSxLQUFLLENBQUMsaUJBQWlCO2dCQUMxQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsb0JBQW9CO2dCQUNoRCxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsZ0JBQWdCO2dCQUN4QyxZQUFZLEVBQUUsS0FBSyxDQUFDLGFBQWE7QUFDcEMsYUFBQTtBQUNKLFNBQUE7UUFDRCxpQkFBaUIsRUFBRSxLQUFLLENBQUMsVUFBVSxJQUMvQkEsY0FBQyxDQUFBLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUEsRUFBQyxPQUFPLEVBQUMsMEJBQTBCLEVBQUEsUUFBQSxFQUNoRUEsY0FBTyxDQUFBLEtBQUEsRUFBQSxFQUFBLENBQUEsRUFBQSxDQUN3QixJQUNuQyxJQUFJO1FBQ1IsWUFBWSxFQUNSLEtBQUssQ0FBQyxVQUFVO0FBQ2hCLGFBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLGlDQUFpQyxLQUFLLElBQUksQ0FBQztLQUMzRyxDQUFDOztBQUdGLElBQUEsTUFBTSxRQUFRLEdBQW1Cc3NCLGFBQU8sQ0FBQyxNQUFLO0FBQzFDLFFBQUEsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLFFBQVEsRUFBRTtBQUMzQixZQUFBLE9BQU8sSUFBSSxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMzQztBQUNELFFBQUEsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBRTtBQUM3QixZQUFBLE9BQU8sSUFBSSx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM3QztBQUNELFFBQUEsT0FBTyxJQUFJLDBCQUEwQixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pELEtBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDWixJQUFBLFFBQ0l0c0IsY0FBSyxDQUFBLEtBQUEsRUFBQSxFQUFBLFNBQVMsRUFBQyxnREFBZ0QsWUFDM0RBLGNBQUMsQ0FBQSxlQUFlLEVBQUMsRUFBQSxRQUFRLEVBQUUsUUFBUSxFQUFBLEdBQU0sV0FBVyxFQUFJLENBQUEsRUFBQSxDQUN0RCxFQUNSO0FBQ047Ozs7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzEsMiwzLDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTUsMTYsMTcsMTgsMTksMjAsMjEsMjIsNDJdfQ==
