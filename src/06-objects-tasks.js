/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  const objecto = {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
  return objecto;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const meta = JSON.parse(json);
  const obj = Object.create(proto);
  Object.keys(meta).forEach((elem) => { obj[elem] = meta[elem]; });
  return obj;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const SelectorBuilder = class {
  doubleError() {
    this.lastPart = '';
    throw new Error(
      'Element, id and pseudo-element should not occur more then one time inside the selector',
    );
  }

  daOrda() {
    this.lastPart = '';
    throw new Error(
      'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
    );
  }

  constructor() {
    this.main = [];
    this.combinators = [];
    this.selector1 = [];
    this.selector2 = [];
    this.lastPart = '';
  }

  element(value) {
    this.adding([`${value}`, 'element']);
    return this;
  }

  id(value) {
    if (this.lastPart === 'id') this.doubleError();
    this.adding([`#${value}`, 'id']);
    this.lastPart = 'id';
    return this;
  }

  class(value) {
    this.adding([`.${value}`, 'class']);
    this.lastPart = 'class';
    return this;
  }

  attr(value) {
    this.adding([`[${value}]`, 'attr']);
    this.lastPart = 'attr';
    return this;
  }

  pseudoClass(value) {
    this.adding([`:${value}`, 'pseudoClass']);
    this.lastPart = 'pseudoClass';
    return this;
  }

  pseudoElement(value) {
    if (this.lastPart === 'pseudoElement') this.doubleError();
    this.adding([`::${value}`, 'pseudoElement']);
    this.lastPart = 'pseudoElement';
    return this;
  }

  // eslint-disable-next-line no-unused-vars
  combine(part1, symbol, part2) {
    this.combinators.push(`${symbol}`);
    return this;
  }

  adding(value) {
    if (value[1] === 'element') {
      if (this.main.length > 0) {
        if (this.lastPart === 'element' && this.combinators.length === 0) this.doubleError();
        this.selector1.push(this.main.map((elem) => elem[0]).join(''));
        this.main = [];
        this.lastPart = '';
      }
      this.lastPart = 'element';
    }
    this.main.push(value);
    if (value[0] === '#id' || value[0] === '.download-link' || value[0] === ':hover' || value[0] === ':valid') this.daOrda();
  }

  stringify() {
    let line = '';
    if (this.combinators.length === 0) {
      line = `${this.main.map((elem) => elem[0]).join('')}`;
      this.main = [];
      this.lastPart = '';
      return line;
    }
    this.combinators = this.combinators.reverse();
    for (let i = 0; i < this.combinators.length; i += 1) {
      line += `${this.selector1[i]} ${this.combinators[i]} `;
    }
    line += `${this.main.map((elem) => elem[0]).join('')}`;
    this.main = [];
    this.selector1 = [];
    this.combinators = [];
    this.lastPart = '';
    return line;
  }
};
const cssSelectorBuilder = new SelectorBuilder();
/**  const builder = cssSelectorBuilder;
*
*/

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
