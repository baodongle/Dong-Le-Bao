/**
 * Calculates the sum using a simple for-loop.
 */
function sum_to_n_a(n: number): number {
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
function sum_to_n_b(n: number): number {
  const absN = Math.abs(n);
  const sum = (absN * (absN + 1)) / 2;

  return n > 0 ? sum : -sum;
}

/**
 * Calculates the sum using recursion.
 */
function sum_to_n_c(n: number): number {
  if (n === 0) {
    return 0;
  }
  if (n > 0) {
    return n + sum_to_n_c(n - 1);
  }

  return n + sum_to_n_c(n + 1);
}
