/**
 * Jc is the simple and very small jQuery clone built for
 * learning purposes.
 */

(function(window) {
'use strict';

function Jc(elements) {
  for (let i = 0; i < elements.length; i++) {
    this[i] = elements[i];
  }

  this.length = elements.length;
}

/*                      Manipuation
*********************************************************/

/**
 * Set the innerText property value. By default, if an
 * argument not defined, returns the current innerText value
 *
 * @param {Strin} text
 * @returns {Jc|String}
 * @public
 */
Jc.prototype.text = function(text) {
  if (typeof text !== 'undefined') {
    return this.forEach(function(element) {
      element.innerText = text;
    });
  } else {
    return this._mapOne(function(element) {
      return element.innerText;
    });
  }
};

/**
 * Set the innerHTML property value. By default, if an
 * argument not defined, returns the current innerHTML value
 *
 * @param {Strin} html
 * @returns {Jc|String}
 * @public
 */
Jc.prototype.html = function(html) {
  if (typeof html !== 'undefined') {
    this.forEach(function (element) {
      element.innerHTML = html;
    });
 
    return this;
  } else {
    return this._mapOne(function(element) {
      return element.innerHTML;
    });
  }
};

/**
 * Set the given attrName of selected elements to the given
 * value. If first argument is object literal, then set
 * each field name to attribute name and corresponding 
 * value to the attribute value. If the last argument is
 * not defined,returns the attrName value.
 *
 * @param {Object|String} attrName
 * @param {String} value
 * @returns {Jc|String}
 * @public
 */
Jc.prototype.attr = function(attrName, value) {
  if (this.isPlainObject(attrName)) {
    return this.forEach(function(element) {
      for (let attr in attrName) {
        element.setAttribute(attr, attrName[attr]);
      }
    });
  } else if (typeof value !== 'undefined') {
    return this.forEach(function(element) {
      element.setAttribute(attrName, value);
    });
  } else if (typeof attrName ==='string' &&
      typeof value === 'undefined')  {
    return this._mapOne(function(element) {
      return element.getAttribute(attrName);
    });
  }
};

/**
 * Remove the given attribute from selected objects
 *
 * @param {String} attribute
 * @returns {Jc}
 * @public
 */
Jc.prototype.removeAttr = function(attribute) {
  return this.forEach(function(element) {
    element.removeAttribute(attribute);
  });
};

/**
 * Set the given css property of selected elements to the given
 * value. If first argument is object literal, then set
 * each field name to css property name and corresponding 
 * value to the property value. If the last argument is
 * not defined,returns the css property name` value.
 *
 * @param {Object|String} name
 * @param {String} value
 * @returns {Jc|String}
 * @public
 */
Jc.prototype.css = function(name, value) {
  if (this.isPlainObject(name)) {
    return this.forEach(function(element) {
      for (let item in name) {
        element.style[item] = name[item];
      }
    });
  } else if (typeof value !== 'undefined') {
    return this.forEach(function(element) {
      element.style[name] = value;
    });
  } else if (typeof name ==='string' && typeof value === 'undefined')  {
    return this._mapOne(function(element) {
      return element.style[name];
    });
  }
};

/**
 * Add the given className to the selected elements
 *
 * @param {Strin} className
 * @returns {Jc}
 * @public
 */
Jc.prototype.addClass = function(className) {
  if (this[0].classList) {
    return this.forEach(function(element) {
       element.classList.add(className);   
    });
  } else {
    return this.forEach(function(element) {
      element.className += ' ' + className;
    });
  }
};

/**
 * Remove the given className from the selected elements
 *
 * @param {String} className
 * @returns {Jc}
 * @public
 */
Jc.prototype.removeClass = function(className) {
  return this.forEach(function(element) {
    if (element.classList) {
      element.classList.remove(className);
    } else {
      let classNames = element.className.split(' ');
      element.className = classNames.filter(function(item) {
        return item != className;
      });
    }
  });
};

/**
 * Insert node, specified by the parameter, to the end 
 * of each element in the set of selected elements. If
 * parameter is the Jc instance, insert the first element 
 * from set
 *
 * @param {Jc|Element} node
 * @returns {Jc}
 * @public
 */
Jc.prototype.append = function(node) {
  return this.forEach(function(element) {
    if (node.length > 0) {
      element.appendChild(node[0]);
    } else {
      element.appendChild(node);
    }
  });
};

/**
 * Inserts the specified node before each selected node as 
 * a child of the current node. If parameter is the Jc 
 * instance, insert the first element from set
 *
 * @param {Jc|Node} node
 * @returns {Jc}
 * @public
 */
Jc.prototype.prepend = function(node) {
  return this.forEach(function(element) {
    if (node.length > 0) {
      element.insertBefore(node[0], element.firstChild);
    } else {
      element.insertBefore(node, element.firstChild);
    }
  });
};

Jc.prototype.nextSiblings = function(filterFunc) {
  let element = this._mapOne(function(el) { return el; });

  let nextSiblings = [];

  while (element = element.nextSibling) {
    if (filterFunc(element)) {
      nextSiblings.push(element);
    }
  }

  return new Jc(nextSiblings);
}

Jc.prototype.prevSiblings = function(filterFunc) {
  let element = this._mapOne(function(el) { return el; });

  let nextSiblings = [];

  while (element = element.previousSibling) {
    if (filterFunc(element)) {
      nextSiblings.push(element);
    }
  }

  return new Jc(nextSiblings);
}

Jc.prototype.siblingsAll = function(filterFunc) {
  return Jc.prototype._concat(
         Jc.prototype.prevSiblings.call(this, filterFunc),
         Jc.prototype.nextSiblings.call(this, filterFunc)
         );
}

/**
 * Returns the duplicate of the Jc object on which this
 * method was called. You may also specify, whether the children
 * should also be cloned, or false if not
 *
 * @param {Boolean} deep - true if the children of the 
 * node should also be cloned, or false to clone only the 
 * specified node.
 *
 * @param {Bolean} deep
 * @returns {Jc} 
 * @public
 */
Jc.prototype.clone = function(deep) {
  let clonedNode = this._mapOne(function(element) {
    return element.cloneNode(deep);
  });
  
  return new Jc([clonedNode]);
};

/**
 * Removes the selected Jc object from the DOM
 *
 * @returns {Jc}
 * @public
 */
Jc.prototype.remove = function(){
  return this.forEach(function(element) {
    return this._mapOne(function(element) {
      return element.parentNode.removeChild(element);
    });
  });
};

/*                          Events
*********************************************************/

/**
 * Adds the specified EventListener-compatible function to the
 * list of event listeners for the specified eventType on
 * the selected EventTarget objects. Within the handler,
 * this refers to the current element. Also you can to specify
 * the useCapture argument to prevent/allow event bubbling.
 *
 * @param {String} eventType
 * @param {EventListener|Function} handler
 * @param {Boolean} useCapture
 * @returns {Jc} 
 * @public
 */
Jc.prototype.on = function(eventType, handler, useCapture) {
  if (document.addEventListener) {
    return this.forEach(function(element) {
      element.addEventListener(eventType, handler.bind(element));
    });
  } else if (document.attacheEvent) {
    return this.forEach(function(element) {
      element.attachEvent('on' + eventType, handler.bind(element));
    });
  } else {
    return this.forEach(function(element) {
      element['on' + eventType] = handler.bind(element);
    });
  }
};

/**
 * Remove the spcified event handler
 *
 * @param {String} evenType
 * @param {Function} handler
 * @returns {Jc}
 * @public
 */
Jc.prototype.off = function(eventType, handler) {
  if (document.removeEventListener) {
    return this.forEach(function(element) {
      element.removeEventListener(eventType, handler);
    }); 
  } else if (document.detachEvent) {
    return this.forEach(function(element) {
      element.detachEvent('on' + eventType, handler);
    });
  } else {
    return this.forEach(function(element) {
      element['on' + eventType] = null;
    });
  }
};

/**
 * Invokes the specified function after the document has 
 * been loaded.
 *
 * @param {Function} callback
 * @public
 */
Jc.prototype.ready = function(callback) {
  if (document.readyState != 'loading') {
    callback();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    document.attacheEvent('onreadystatechange', function() {
      if (document.readyState != 'loading') {
        callback();
      }
    });
  }
};

/*                          Utils
*********************************************************/

/**
 * Iterates over an array of selected elements with given
 * callback function. The first argument to the callback is the 
 * array element, the second is the index in array. Within 
 * the callback, this refers to the current element.
 *
 * @param {Function} callback
 * @returns {Js}
 * @public
 */
Jc.prototype.forEach = function(callback) {
  this._map(callback);

  return this;
};

/**
 * Check whether the given object is the object literal
 *
 * @param {Object} obj
 * @returns {Boolean}
 * @public
 */
Jc.prototype.isPlainObject = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

Jc.prototype.toArray = function() {
  return Array.prototype.slice.call(this);
};

/**
 * Process an array of selected elements by mapping it with
 * the given callback function onto a new array and return it.
 * The first argument to the callback is the array element,
 * the second is the index in array. Within the callback, this
 * refers to the current element.
 *
 * @param {Function} callback
 * @returns {Array}
 * @private
 */
Jc.prototype._map = function(callback) {
  let results = [];

  for (let i = 0; i < this.length; i++) {
    results.push(callback.call(this, this[i], i));
  }

  return results;
};

/**
 * Process an array of selected elements by mapping it with
 * the given callback function onto a new array. The first 
 * argument to the callback is the array element, the second 
 * is the index in array. Within the callback, this refers to 
 * the current element. If array length greater then one 
 * element, then returns the whole array, else returns the 
 * one element array.
 *
 * @param {Function} callback
 * @returns {Array|Object}
 * @private
 */
Jc.prototype._mapOne = function(callback) {
  let result = this._map(callback);
  
  return result.length > 1 ? result : result[0];
};

Jc.prototype._concat = function(first, second) {
  let firstArray  = first.toArray(),
      secondArray = second.toArray();

  return new Jc(firstArray.concat(secondArray));
}

/*                     Initial functions
*********************************************************/

let jc = {
  
  /**
   * Select all Elements within the document that matches
   * given selector. It always put the selected elements
   * into the Jc local array. Selector may be a css-selector,
   * NodeList or HTMLCollection, or single Element.
   *
   * @param {String|NodeList|HTMLCollection|Element} 
   * @returns {Jc}
   * @public
   */

  select: function(selector) {
    let elements;
  
    if (typeof selector === 'string') {
      elements = document.querySelectorAll(selector);
    } else if (selector.length) {
      elements = selector;
    } else {
      elements = [selector];
    }
  
    return new Jc(elements);
  },

  /**
   * Create then HTMLElement specified by tagName, or an
   * HTMLUnknownElement if tagName is invalid. You might
   * alse specify an opts plain object, which is a hash table
   * with atribute name as a key and it value as value, and
   * innerHtml
   *
   * @param {String} tagName
   * @param {Obect} opts
   * @param {innerHTML} innerHTML
   * @returns {Jc}
   * @public
   */

  create: function(tagName, opts, innerHTML) {
    let element = new Jc( [document.createElement(tagName)] );

    if (opts && Jc.prototype.isPlainObject(opts)) {
      Jc.prototype.attr.call(element, opts);
    }
    if (innerHTML) {
      element.html(innerHTML);
    }

    return element;
  }
};

window.jc = jc;
})(window);
