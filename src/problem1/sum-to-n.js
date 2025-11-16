/**
 * Calculates the sum using a simple for-loop.
 */
var sum_to_n_a = function(n) {
  let sum = 0;

  if (n > 0) {
    for (let i = 1; i <= n; i++) {
      sum += i;
    }
  } else {
    for (let i = 0; i >= n; i--) {
      sum += i;
    }
  }

  return sum;
}

/**
 * Calculates the sum using the arithmetic progression formula.
 */
var sum_to_n_b = function(n) {
  const absN = Math.abs(n);
  const sum = (absN * (absN + 1)) / 2;

  return n > 0 ? sum : -sum;
}

/**
 * Calculates the sum using recursion.
 */
var sum_to_n_c = function(n) {
  if (n === 0) {
    return 0;
  }
  if (n > 0) {
    return n + sum_to_n_c(n - 1);
  }

  return n + sum_to_n_c(n + 1);
}
