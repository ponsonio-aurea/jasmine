/**
 * Blocks are functions with executable code that make up a spec.
 *
 * @constructor
 * @param {jasmine.Env} env
 * @param {Function} func
 * @param {jasmine.Spec} spec
 */
jasmine.Block = function(env, func, spec) {
  this.env = env;
  this.func = func;
  this.spec = spec;
};

jasmine.Block.prototype.execute = function __jasmine_Block_prototype_execute__(onComplete) {  
  try {
    this.func.apply(this.spec);
  } catch (e) {
    this.spec.fail(e);
  }
  onComplete();
};