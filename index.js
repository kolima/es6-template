/*!
 * es6-template <https://github.com/tunnckoCore/es6-template>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

/**
 * > Acts like `.render` by default.
 * Renders given `str` with `locals`.
 *
 * **Example**
 *
 * ```js
 * es6template('foo ${bar} baz ${quux}', {bar: 'BAR'}, {quux: 'QUUX'})
 * //=> 'foo BAR baz QUUX'
 * ```
 *
 * @name   es6template
 * @param  {String} `str` template to populate with `locals`
 * @param  {Object} `locals` locals object
 * @return {String} rendered string
 * @api public
 */
var template = module.exports = function es6template (str, locals) {
  return templateFn.apply(this, arguments)
}

/**
 * >  Renders given `str` with `locals`. You can give unlimited
 * number of object arguments after the first - they will be
 * merged and passed as single locals object.
 *
 * **Example**
 *
 * ```js
 * es6template.render('Hello ${place} and ${user.name}!', {
 *   place: 'world',
 *   user: {
 *     name: 'Charlike'
 *   }
 * })
 * //=> 'Hello world and Charlike!'
 * ```
 *
 * @name   .render
 * @param  {String} `str` template to populate with `locals`
 * @param  {Object} `locals` locals object
 * @return {String} rendered string
 * @api public
 */
template.render = function render (str, locals) {
  return templateFn.apply(this, arguments)
}

/**
 * > Compiles given string and returns function which accepts
 * unlimited number of `locals` object arguments.
 *
 * **Example**
 *
 * ```js
 * var fn = es6template.compile('Hello ${place} and ${user.name}!')
 * fn({place: 'world', user: {name: 'Charlike'}})
 * //=> 'Hello world and Charlike!'
 * ```
 *
 * @name   .compile
 * @param  {String} `str` template to populate
 * @return {Function} which accepts `locals` objects
 * @api public
 */
template.compile = function compile (str) {
  return function (locals) {
    utils.sliced(arguments).forEach(function (obj) {
      locals = utils.extendShallow(locals, obj)
    })
    return templateFn(str, locals)
  }
}

/**
 * Main template render function
 *
 * @param  {String} `str`
 * @return {String}
 */
function templateFn (str) {
  var data = {}
  utils.sliced(arguments, 1).forEach(function (obj) {
    data = utils.extendShallow(data, obj)
  });
  
  if (!str) return undefined;

  var strWithVaribales = str.replace(utils.regex(), function (m, prop) {
    if (prop && prop.indexOf('.') !== -1) {
      return utils.getValue(data, prop)
    }
    return typeof data[prop] !== 'undefined' ? data[prop] : '${'+ prop +'}'
  });

  var conditionalImmaterial = strWithVaribales.match('{{if immaterialExpired}}(.*){{/if}}');

  if (conditionalImmaterial && conditionalImmaterial.length && conditionalImmaterial[1]) {
    if (data['immaterialExpired']) {
      strWithVaribales = strWithVaribales.replace(/{{if immaterialExpired}}(.*){{\/if}}/ig, conditionalImmaterial[1]);
    }
  }
  
  var conditionalCanUseHere = strWithVaribales.match('{{if canUseHere}}(.*){{/if}}');

  if (conditionalCanUseHere && conditionalCanUseHere.length && conditionalCanUseHere[1]) {
    if (data['canUseHere']) {
      strWithVaribales = strWithVaribales.replace(/{{if canUseHere}}(.*){{\/if}}/ig, conditionalCanUseHere[1]);
    }
  }
  
  
   var conditionalPromotionalCode = strWithVaribales.match('{{if promotionalCode}}(.*){{/if}}');

  if (conditionalPromotionalCode && conditionalPromotionalCode.length && conditionalPromotionalCode[1]) {
    if (data['promotionalCode']) {
      strWithVaribales = strWithVaribales.replace(/{{if promotionalCode}}(.*){{\/if}}/ig, conditionalPromotionalCode[1]);
    }
  }

   var conditionalRepeats = strWithVaribales.match('{{if repeats}}(.*){{/if}}');

  if (conditionalRepeats && conditionalRepeats.length && conditionalRepeats[1]) {
    if (data['repeats']) {
      strWithVaribales = strWithVaribales.replace(/{{if repeats}}(.*){{\/if}}/ig, conditionalRepeats[1]);
    }
  }
  
  var conditionalHasNotMarketing = strWithVaribales.match('{{if hasNotMarketing}}(.*){{/if}}');

  if (conditionalHasNotMarketing && conditionalHasNotMarketing.length && conditionalHasNotMarketing[1]) {
    if (data['hasNotMarketing']) {
      strWithVaribales = strWithVaribales.replace(/{{if hasNotMarketing}}(.*){{\/if}}/ig, conditionalHasNotMarketing[1]);
    }
  }

  return strWithVaribales.replace(/{{if immaterialExpired}}(.*){{\/if}}/ig, '').replace(/{{if canUseHere}}(.*){{\/if}}/ig, '').replace(/{{if promotionalCode}}(.*){{\/if}}/ig, '').replace(/{{if repeats}}(.*){{\/if}}/ig, '').replace(/{{if hasNotMarketing}}(.*){{\/if}}/ig, '');
}
