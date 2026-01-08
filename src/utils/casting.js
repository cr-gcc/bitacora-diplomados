/**
 * Casts a value to boolean.
 * Handles numbers (1/0), strings ("1"/"0", "true"/"false"), and booleans.
 */
export const parseBoolean = (value) => {
  return value === 1 || value === '1' || value === true || value === 'true';
};

/**
 * Casts a value to integer.
 * Returns 0 if invalid.
 */
export const parseIntSafe = (value) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
};
