/*
 * Reusable validators
 *
 */

 var validator = {};

 validator.isNotEmpty = function(str) {
  return typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
}

validator.isNumber = function(number) {
  return typeof(number) == 'number' ? number : false;
}

validator.isEmail = function(email) {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
}

module.exports = validator;