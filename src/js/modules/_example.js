/**
 * Example function with parameters and return value
 * @param  {[type]} arg1 [description]
 * @return {[type]}      [description]
 * @example sampleFunction(1);
 * 
 * @author Mark Chang
 * @version 1.0.0
 */
const sample1 = (arg1) => {
  // exit if arg1 is not provided
  if (typeof arg1 === 'undefined') return;

  console.log(arg1);

  // nested function example with parameters and return value in console.log output 
  function nestedFunction(arg) {
    console.log(arg);
  }

  nestedFunction("I am nested and cannot be called outside.");
}

/**
 * Example function with parameters
 * @param  {[type]} arg1 [description]
 * @param  {[type]} arg2 [description]
 * @return {[type]}      [description]
 * @example sampleFunction(1, 2);
 * 
 * @author Mark Chang
 * @version 1.0.0
 */
const sample2 = (arg1, arg2) => {
  // exit if none of the arguments are provided
  if (typeof arg1 === 'undefined' && typeof arg2 === 'undefined') return;

  console.log(arg1, arg2);
}

// bundle functions into a module and export it
module.exports = {
  sample1: sample1,
  sample2: sample2
};
