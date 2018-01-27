/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = h;
exports.app = app;
function h(name, props) {
  var node;
  var rest = [];
  var children = [];
  var length = arguments.length;

  while (length-- > 2) {
    rest.push(arguments[length]);
  }while (rest.length) {
    if (Array.isArray(node = rest.pop())) {
      for (length = node.length; length--;) {
        rest.push(node[length]);
      }
    } else if (node != null && node !== true && node !== false) {
      children.push(node);
    }
  }

  return typeof name === "function" ? name(props || {}, children) : {
    name: name,
    props: props || {},
    children: children
  };
}

function app(state, actions, view, container) {
  var renderLock;
  var invokeLaterStack = [];
  var rootElement = container && container.children[0] || null;
  var lastNode = rootElement && toVNode(rootElement, [].map);
  var globalState = copy(state);
  var wiredActions = copy(actions);

  scheduleRender(wireStateToActions([], globalState, wiredActions));

  return wiredActions;

  function toVNode(element, map) {
    return {
      name: element.nodeName.toLowerCase(),
      props: {},
      children: map.call(element.childNodes, function (element) {
        return element.nodeType === 3 ? element.nodeValue : toVNode(element, map);
      })
    };
  }

  function render() {
    renderLock = !renderLock;

    var next = view(globalState, wiredActions);
    if (container && !renderLock) {
      rootElement = patch(container, rootElement, lastNode, lastNode = next);
    }

    while (next = invokeLaterStack.pop()) {
      next();
    }
  }

  function scheduleRender() {
    if (!renderLock) {
      renderLock = !renderLock;
      setTimeout(render);
    }
  }

  function copy(target, source) {
    var obj = {};

    for (var i in target) {
      obj[i] = target[i];
    }for (var i in source) {
      obj[i] = source[i];
    }return obj;
  }

  function set(path, value, source) {
    var target = {};
    if (path.length) {
      target[path[0]] = path.length > 1 ? set(path.slice(1), value, source[path[0]]) : value;
      return copy(source, target);
    }
    return value;
  }

  function get(path, source) {
    for (var i = 0; i < path.length; i++) {
      source = source[path[i]];
    }
    return source;
  }

  function wireStateToActions(path, state, actions) {
    for (var key in actions) {
      typeof actions[key] === "function" ? function (key, action) {
        actions[key] = function (data) {
          if (typeof (data = action(data)) === "function") {
            data = data(get(path, globalState), actions);
          }

          if (data && data !== (state = get(path, globalState)) && !data.then // Promise
          ) {
              scheduleRender(globalState = set(path, copy(state, data), globalState));
            }

          return data;
        };
      }(key, actions[key]) : wireStateToActions(path.concat(key), state[key] = state[key] || {}, actions[key] = copy(actions[key]));
    }
  }

  function getKey(node) {
    return node && node.props ? node.props.key : null;
  }

  function setElementProp(element, name, value, isSVG, oldValue) {
    if (name === "key") {} else if (name === "style") {
      for (var i in copy(oldValue, value)) {
        element[name][i] = value == null || value[i] == null ? "" : value[i];
      }
    } else {
      if (typeof value === "function" || name in element && !isSVG) {
        element[name] = value == null ? "" : value;
      } else if (value != null && value !== false) {
        element.setAttribute(name, value);
      }

      if (value == null || value === false) {
        element.removeAttribute(name);
      }
    }
  }

  function createElement(node, isSVG) {
    var element = typeof node === "string" || typeof node === "number" ? document.createTextNode(node) : (isSVG = isSVG || node.name === "svg") ? document.createElementNS("http://www.w3.org/2000/svg", node.name) : document.createElement(node.name);

    if (node.props) {
      if (node.props.oncreate) {
        invokeLaterStack.push(function () {
          node.props.oncreate(element);
        });
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(createElement(node.children[i], isSVG));
      }

      for (var name in node.props) {
        setElementProp(element, name, node.props[name], isSVG);
      }
    }

    return element;
  }

  function updateElement(element, oldProps, props, isSVG) {
    for (var name in copy(oldProps, props)) {
      if (props[name] !== (name === "value" || name === "checked" ? element[name] : oldProps[name])) {
        setElementProp(element, name, props[name], isSVG, oldProps[name]);
      }
    }

    if (props.onupdate) {
      invokeLaterStack.push(function () {
        props.onupdate(element, oldProps);
      });
    }
  }

  function removeChildren(element, node, props) {
    if (props = node.props) {
      for (var i = 0; i < node.children.length; i++) {
        removeChildren(element.childNodes[i], node.children[i]);
      }

      if (props.ondestroy) {
        props.ondestroy(element);
      }
    }
    return element;
  }

  function removeElement(parent, element, node, cb) {
    function done() {
      parent.removeChild(removeChildren(element, node));
    }

    if (node.props && (cb = node.props.onremove)) {
      cb(element, done);
    } else {
      done();
    }
  }

  function patch(parent, element, oldNode, node, isSVG, nextSibling) {
    if (node === oldNode) {} else if (oldNode == null) {
      element = parent.insertBefore(createElement(node, isSVG), element);
    } else if (node.name && node.name === oldNode.name) {
      updateElement(element, oldNode.props, node.props, isSVG = isSVG || node.name === "svg");

      var oldElements = [];
      var oldKeyed = {};
      var newKeyed = {};

      for (var i = 0; i < oldNode.children.length; i++) {
        oldElements[i] = element.childNodes[i];

        var oldChild = oldNode.children[i];
        var oldKey = getKey(oldChild);

        if (null != oldKey) {
          oldKeyed[oldKey] = [oldElements[i], oldChild];
        }
      }

      var i = 0;
      var j = 0;

      while (j < node.children.length) {
        var oldChild = oldNode.children[i];
        var newChild = node.children[j];

        var oldKey = getKey(oldChild);
        var newKey = getKey(newChild);

        if (newKeyed[oldKey]) {
          i++;
          continue;
        }

        if (newKey == null) {
          if (oldKey == null) {
            patch(element, oldElements[i], oldChild, newChild, isSVG);
            j++;
          }
          i++;
        } else {
          var recyledNode = oldKeyed[newKey] || [];

          if (oldKey === newKey) {
            patch(element, recyledNode[0], recyledNode[1], newChild, isSVG);
            i++;
          } else if (recyledNode[0]) {
            patch(element, element.insertBefore(recyledNode[0], oldElements[i]), recyledNode[1], newChild, isSVG);
          } else {
            patch(element, oldElements[i], null, newChild, isSVG);
          }

          j++;
          newKeyed[newKey] = newChild;
        }
      }

      while (i < oldNode.children.length) {
        var oldChild = oldNode.children[i];
        if (getKey(oldChild) == null) {
          removeElement(element, oldElements[i], oldChild);
        }
        i++;
      }

      for (var i in oldKeyed) {
        if (!newKeyed[oldKeyed[i][1].props.key]) {
          removeElement(element, oldKeyed[i][0], oldKeyed[i][1]);
        }
      }
    } else if (node.name === oldNode.name) {
      element.nodeValue = node;
    } else {
      element = parent.insertBefore(createElement(node, isSVG), nextSibling = element);
      removeElement(parent, nextSibling, oldNode);
    }
    return element;
  }
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(10);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = undefined;

var _hyperapp = __webpack_require__(0);

var _actions = __webpack_require__(5);

var _actions2 = _interopRequireDefault(_actions);

var _state = __webpack_require__(6);

var _state2 = _interopRequireDefault(_state);

var _components = __webpack_require__(7);

var _components2 = _interopRequireDefault(_components);

__webpack_require__(11);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var main = exports.main = (0, _hyperapp.app)(_state2.default, _actions2.default, _components2.default, document.body);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  plus: function plus() {
    return function (_ref) {
      var count = _ref.count;
      return { count: count + 1 };
    };
  },
  minus: function minus() {
    return function (_ref2) {
      var count = _ref2.count;
      return { count: count - 1 };
    };
  }
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  count: 0
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hyperapp = __webpack_require__(0);

var _index = __webpack_require__(8);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (state, actions) {
  return (0, _hyperapp.h)(
    'div',
    { 'class': _index2.default.main },
    (0, _hyperapp.h)(
      'h1',
      null,
      'hyperapp-boilerplate'
    ),
    (0, _hyperapp.h)(
      'p',
      null,
      'hyperapp-boilerplate is a boilerplate for quickstarting a web application with Hyperapp, JSX, Stylus, Pug, Eslint.'
    ),
    (0, _hyperapp.h)(
      'p',
      null,
      (0, _hyperapp.h)(
        'a',
        { href: 'https://github.com/sosukesuzuki/hyperapp-boilerplate' },
        'github repository'
      )
    ),
    (0, _hyperapp.h)(
      'p',
      null,
      state.count
    ),
    (0, _hyperapp.h)(
      'button',
      { onclick: actions.plus },
      '+'
    ),
    (0, _hyperapp.h)(
      'button',
      { onclick: actions.minus },
      '-'
    )
  );
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(9);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"sourceMap":true,"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(2)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/stylus-loader/index.js??ref--1-2!./index.styl", function() {
		var newContent = require("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/stylus-loader/index.js??ref--1-2!./index.styl");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(true);
// imports


// module
exports.push([module.i, "._29yurkfd6rxnkqjyxv4s6g5mzdyg27bp8pja3rpvkgv5px59ygbsbw955m91bu156feug3ck7eqzugkz8rd7478k8a3mbarpf7qzvck-index-main {\n  color: #939395;\n  background-color: #2e3235;\n  height: 100vh;\n}\n._29yurkfd6rxnkqjyxv4s6g5mzdyg27bp8pja3rpvkgv5px59ygbsbw955m91bu156feug3ck7eqzugkz8rd7478k8a3mbarpf7qzvck-index-main h1 {\n  margin: 0;\n  padding-left: 10px;\n  padding-top: 30px;\n}\n._29yurkfd6rxnkqjyxv4s6g5mzdyg27bp8pja3rpvkgv5px59ygbsbw955m91bu156feug3ck7eqzugkz8rd7478k8a3mbarpf7qzvck-index-main p {\n  margin: 0;\n  padding-left: 10px;\n  padding-top: 20px;\n}\n._29yurkfd6rxnkqjyxv4s6g5mzdyg27bp8pja3rpvkgv5px59ygbsbw955m91bu156feug3ck7eqzugkz8rd7478k8a3mbarpf7qzvck-index-main a {\n  color: #00b0cc;\n}\n._29yurkfd6rxnkqjyxv4s6g5mzdyg27bp8pja3rpvkgv5px59ygbsbw955m91bu156feug3ck7eqzugkz8rd7478k8a3mbarpf7qzvck-index-main button {\n  font-size: 25px;\n  outline: none;\n  color: #939395;\n  border: none;\n  border-radius: 0.1em;\n  width: 80px;\n  height: 60px;\n  background-color: #41474b;\n  margin: 5px;\n}\n._29yurkfd6rxnkqjyxv4s6g5mzdyg27bp8pja3rpvkgv5px59ygbsbw955m91bu156feug3ck7eqzugkz8rd7478k8a3mbarpf7qzvck-index-main button:hover {\n  background-color: #383c40;\n}\n._29yurkfd6rxnkqjyxv4s6g5mzdyg27bp8pja3rpvkgv5px59ygbsbw955m91bu156feug3ck7eqzugkz8rd7478k8a3mbarpf7qzvck-index-main button:active {\n  background-color: #323639;\n}\n/*# sourceMappingURL=src/components/index.css.map */", "", {"version":3,"sources":["/Users/suzuki/.ghq/github.com/sosukesuzuki/hyperapp-one/src/components/src/components/index.styl","/Users/suzuki/.ghq/github.com/sosukesuzuki/hyperapp-one/src/components/index.styl","/Users/suzuki/.ghq/github.com/sosukesuzuki/hyperapp-one/src/components/node_modules/nib/lib/nib/border.styl","/Users/suzuki/.ghq/github.com/sosukesuzuki/hyperapp-one/src/components/node_modules/nib/lib/nib/border-radius.styl"],"names":[],"mappings":"AAAA;EACE,eAAA;EACA,0BAAA;EACA,cAAA;CCCD;ADAC;EACE,UAAA;EACA,mBAAA;EACA,kBAAA;CCEH;ADDC;EACE,UAAA;EACA,mBAAA;EACA,kBAAA;CCGH;ADFC;EACE,eAAA;CCIH;ADHC;EACE,gBAAA;EACA,cAAA;EACA,eAAA;EERA,aAAA;EC2CF,qBAAA;EHhCE,YAAA;EACA,aAAA;EACA,0BAAA;EACA,YAAA;CCKH;ADJG;EACE,0BAAA;CCML;ADLG;EACE,0BAAA;CCOL;AACD,oDAAoD","file":"index.styl","sourcesContent":[".main\n  color $text-color\n  background-color $background-color\n  height 100vh\n  h1\n    margin 0\n    padding-left 10px\n    padding-top 30px\n  p\n    margin 0\n    padding-left 10px\n    padding-top 20px\n  a\n    color $link-color\n  button\n    font-size 25px\n    outline none\n    color $text-color\n    border none\n    border-radius 0.1em\n    width 80px\n    height 60px\n    background-color lighten($background-color, 10%)\n    margin 5px\n    &:hover\n      background-color lighten($background-color, 5%)\n    &:active\n      background-color lighten($background-color, 2%)\n\n",".main {\n  color: #939395;\n  background-color: #2e3235;\n  height: 100vh;\n}\n.main h1 {\n  margin: 0;\n  padding-left: 10px;\n  padding-top: 30px;\n}\n.main p {\n  margin: 0;\n  padding-left: 10px;\n  padding-top: 20px;\n}\n.main a {\n  color: #00b0cc;\n}\n.main button {\n  font-size: 25px;\n  outline: none;\n  color: #939395;\n  border: none;\n  border-radius: 0.1em;\n  width: 80px;\n  height: 60px;\n  background-color: #41474b;\n  margin: 5px;\n}\n.main button:hover {\n  background-color: #383c40;\n}\n.main button:active {\n  background-color: #323639;\n}\n/*# sourceMappingURL=src/components/index.css.map */","/*\n * border: <color>\n * border: ...\n */\n\nborder(color, args...)\n  if color is a 'color'\n    border: 1px solid color args\n  else\n    border: arguments\n","/*\n * Helper for border-radius().\n */\n\n-apply-border-radius(pos, importance)\n  if length(pos) == 3\n    // border-radius: <top | bottom> <left | right> <n>\n    y = pos[0]\n    x = pos[1]\n    // We don't use vendor for boder-radius anymore\n    // vendor('border-radius-%s%s' % pos, pos[2], only: webkit official)\n    {'border-%s-%s-radius' % pos}: pos[2] importance\n  else if pos[0] in (top bottom)\n    // border-radius: <top | bottom> <n>\n    -apply-border-radius(pos[0] left pos[1], importance)\n    -apply-border-radius(pos[0] right pos[1], importance)\n  else if pos[0] in (left right)\n    // border-radius: <left | right> <n>\n    unshift(pos, top);\n    -apply-border-radius(pos, importance)\n    pos[0] = bottom\n    -apply-border-radius(pos, importance)\n\n/*\n * border-radius supporting augmented behavior.\n *\n * Examples:\n *\n *    border-radius: 2px 5px\n *    border-radius: top 5px bottom 10px\n *    border-radius: left 5px\n *    border-radius: top left 5px\n *    border-radius: top left 10px bottom right 5px\n *    border-radius: top left 10px, bottom right 5px\n *\n */\n\nborder-radius()\n  pos = ()\n  augmented = false\n  importance = arguments[length(arguments) - 1] == !important ? !important : unquote('')\n\n  for args in arguments\n    for arg in args\n      if arg is a 'ident'\n        append(pos, arg)\n        augmented = true\n      else\n        append(pos, arg)\n        if augmented\n          -apply-border-radius(pos, importance)\n          pos = ()\n  border-radius pos unless augmented\n"],"sourceRoot":""}]);

// exports
exports.locals = {
	"main": "_29yurkfd6rxnkqjyxv4s6g5mzdyg27bp8pja3rpvkgv5px59ygbsbw955m91bu156feug3ck7eqzugkz8rd7478k8a3mbarpf7qzvck-index-main"
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
	// get current location
	var location = typeof window !== "undefined" && window.location;

	if (!location) {
		throw new Error("fixUrls requires window.location");
	}

	// blank or null?
	if (!css || typeof css !== "string") {
		return css;
	}

	var baseUrl = location.protocol + "//" + location.host;
	var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
			return $1;
		}).replace(/^'(.*)'$/, function (o, $1) {
			return $1;
		});

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
			//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(12);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(2)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {
	module.hot.accept("!!../css-loader/index.js!./normalize.css", function() {
		var newContent = require("!!../css-loader/index.js!./normalize.css");

		if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "/*! normalize.css v7.0.0 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in\n *    IE on Windows Phone and in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -ms-text-size-adjust: 100%; /* 2 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers (opinionated).\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Add the correct display in IE 9-.\n */\n\narticle,\naside,\nfooter,\nheader,\nnav,\nsection {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n * 1. Add the correct display in IE.\n */\n\nfigcaption,\nfigure,\nmain { /* 1 */\n  display: block;\n}\n\n/**\n * Add the correct margin in IE 8.\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * 1. Remove the gray background on active links in IE 10.\n * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\n */\n\na {\n  background-color: transparent; /* 1 */\n  -webkit-text-decoration-skip: objects; /* 2 */\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57- and Firefox 39-.\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\n */\n\nb,\nstrong {\n  font-weight: inherit;\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font style in Android 4.3-.\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\n * Add the correct background and color in IE 9-.\n */\n\nmark {\n  background-color: #ff0;\n  color: #000;\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\naudio,\nvideo {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in iOS 4-7.\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\n * Remove the border on images inside links in IE 10-.\n */\n\nimg {\n  border-style: none;\n}\n\n/**\n * Hide the overflow in IE.\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers (opinionated).\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: sans-serif; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\nhtml [type=\"button\"], /* 1 */\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; /* 2 */\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * 1. Add the correct display in IE 9-.\n * 2. Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  display: inline-block; /* 1 */\n  vertical-align: baseline; /* 2 */\n}\n\n/**\n * Remove the default vertical scrollbar in IE.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in IE 9-.\n * 1. Add the correct display in Edge, IE, and Firefox.\n */\n\ndetails, /* 1 */\nmenu {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Scripting\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\ncanvas {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in IE.\n */\n\ntemplate {\n  display: none;\n}\n\n/* Hidden\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10-.\n */\n\n[hidden] {\n  display: none;\n}\n", ""]);

// exports


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjEyMWMzZDEzY2IyZGI4YzhmOGMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2h5cGVyYXBwL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3RhdGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvaW5kZXguc3R5bD83OTJmIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2luZGV4LnN0eWwiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbm9ybWFsaXplLmNzcy9ub3JtYWxpemUuY3NzP2I0MTEiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25vcm1hbGl6ZS5jc3Mvbm9ybWFsaXplLmNzcyJdLCJuYW1lcyI6WyJoIiwiYXBwIiwibmFtZSIsInByb3BzIiwibm9kZSIsInJlc3QiLCJjaGlsZHJlbiIsImxlbmd0aCIsImFyZ3VtZW50cyIsInB1c2giLCJBcnJheSIsImlzQXJyYXkiLCJwb3AiLCJzdGF0ZSIsImFjdGlvbnMiLCJ2aWV3IiwiY29udGFpbmVyIiwicmVuZGVyTG9jayIsImludm9rZUxhdGVyU3RhY2siLCJyb290RWxlbWVudCIsImxhc3ROb2RlIiwidG9WTm9kZSIsIm1hcCIsImdsb2JhbFN0YXRlIiwiY29weSIsIndpcmVkQWN0aW9ucyIsInNjaGVkdWxlUmVuZGVyIiwid2lyZVN0YXRlVG9BY3Rpb25zIiwiZWxlbWVudCIsIm5vZGVOYW1lIiwidG9Mb3dlckNhc2UiLCJjYWxsIiwiY2hpbGROb2RlcyIsIm5vZGVUeXBlIiwibm9kZVZhbHVlIiwicmVuZGVyIiwibmV4dCIsInBhdGNoIiwic2V0VGltZW91dCIsInRhcmdldCIsInNvdXJjZSIsIm9iaiIsImkiLCJzZXQiLCJwYXRoIiwidmFsdWUiLCJzbGljZSIsImdldCIsImtleSIsImFjdGlvbiIsImRhdGEiLCJ0aGVuIiwiY29uY2F0IiwiZ2V0S2V5Iiwic2V0RWxlbWVudFByb3AiLCJpc1NWRyIsIm9sZFZhbHVlIiwic2V0QXR0cmlidXRlIiwicmVtb3ZlQXR0cmlidXRlIiwiY3JlYXRlRWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlVGV4dE5vZGUiLCJjcmVhdGVFbGVtZW50TlMiLCJvbmNyZWF0ZSIsImFwcGVuZENoaWxkIiwidXBkYXRlRWxlbWVudCIsIm9sZFByb3BzIiwib251cGRhdGUiLCJyZW1vdmVDaGlsZHJlbiIsIm9uZGVzdHJveSIsInJlbW92ZUVsZW1lbnQiLCJwYXJlbnQiLCJjYiIsImRvbmUiLCJyZW1vdmVDaGlsZCIsIm9ucmVtb3ZlIiwib2xkTm9kZSIsIm5leHRTaWJsaW5nIiwiaW5zZXJ0QmVmb3JlIiwib2xkRWxlbWVudHMiLCJvbGRLZXllZCIsIm5ld0tleWVkIiwib2xkQ2hpbGQiLCJvbGRLZXkiLCJqIiwibmV3Q2hpbGQiLCJuZXdLZXkiLCJyZWN5bGVkTm9kZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJ1c2VTb3VyY2VNYXAiLCJsaXN0IiwidG9TdHJpbmciLCJpdGVtIiwiY29udGVudCIsImNzc1dpdGhNYXBwaW5nVG9TdHJpbmciLCJqb2luIiwibW9kdWxlcyIsIm1lZGlhUXVlcnkiLCJhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzIiwiaWQiLCJjc3NNYXBwaW5nIiwiYnRvYSIsInNvdXJjZU1hcHBpbmciLCJ0b0NvbW1lbnQiLCJzb3VyY2VVUkxzIiwic291cmNlcyIsInNvdXJjZVJvb3QiLCJzb3VyY2VNYXAiLCJiYXNlNjQiLCJ1bmVzY2FwZSIsImVuY29kZVVSSUNvbXBvbmVudCIsIkpTT04iLCJzdHJpbmdpZnkiLCJtYWluIiwiYm9keSIsInBsdXMiLCJjb3VudCIsIm1pbnVzIiwiY3NzIiwibG9jYXRpb24iLCJ3aW5kb3ciLCJFcnJvciIsImJhc2VVcmwiLCJwcm90b2NvbCIsImhvc3QiLCJjdXJyZW50RGlyIiwicGF0aG5hbWUiLCJyZXBsYWNlIiwiZml4ZWRDc3MiLCJmdWxsTWF0Y2giLCJvcmlnVXJsIiwidW5xdW90ZWRPcmlnVXJsIiwidHJpbSIsIm8iLCIkMSIsInRlc3QiLCJuZXdVcmwiLCJpbmRleE9mIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7UUM3RGdCQSxDLEdBQUFBLEM7UUEyQkFDLEcsR0FBQUEsRztBQTNCVCxTQUFTRCxDQUFULENBQVdFLElBQVgsRUFBaUJDLEtBQWpCLEVBQXdCO0FBQzdCLE1BQUlDLElBQUo7QUFDQSxNQUFJQyxPQUFPLEVBQVg7QUFDQSxNQUFJQyxXQUFXLEVBQWY7QUFDQSxNQUFJQyxTQUFTQyxVQUFVRCxNQUF2Qjs7QUFFQSxTQUFPQSxXQUFXLENBQWxCO0FBQXFCRixTQUFLSSxJQUFMLENBQVVELFVBQVVELE1BQVYsQ0FBVjtBQUFyQixHQUVBLE9BQU9GLEtBQUtF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R0FBRyx1SUFBdUksa0NBQWtDLGlDQUFpQyxXQUFXLCtMQUErTCw2QkFBNkIsR0FBRyw2S0FBNkssK0JBQStCLDBCQUEwQixXQUFXLDBPQUEwTyxtQkFBbUIsR0FBRyxxRUFBcUUsdUJBQXVCLEdBQUcsZ0tBQWdLLDBCQUEwQixHQUFHLDZEQUE2RCxrQkFBa0IsR0FBRyxnS0FBZ0ssa0JBQWtCLEdBQUc7O0FBRTloUSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBmMTIxYzNkMTNjYjJkYjhjOGY4YyIsImV4cG9ydCBmdW5jdGlvbiBoKG5hbWUsIHByb3BzKSB7XG4gIHZhciBub2RlXG4gIHZhciByZXN0ID0gW11cbiAgdmFyIGNoaWxkcmVuID0gW11cbiAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcblxuICB3aGlsZSAobGVuZ3RoLS0gPiAyKSByZXN0LnB1c2goYXJndW1lbnRzW2xlbmd0aF0pXG5cbiAgd2hpbGUgKHJlc3QubGVuZ3RoKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoKG5vZGUgPSByZXN0LnBvcCgpKSkpIHtcbiAgICAgIGZvciAobGVuZ3RoID0gbm9kZS5sZW5ndGg7IGxlbmd0aC0tOyApIHtcbiAgICAgICAgcmVzdC5wdXNoKG5vZGVbbGVuZ3RoXSlcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5vZGUgIT0gbnVsbCAmJiBub2RlICE9PSB0cnVlICYmIG5vZGUgIT09IGZhbHNlKSB7XG4gICAgICBjaGlsZHJlbi5wdXNoKG5vZGUpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiBuYW1lID09PSBcImZ1bmN0aW9uXCJcbiAgICA/IG5hbWUocHJvcHMgfHwge30sIGNoaWxkcmVuKVxuICAgIDoge1xuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBwcm9wczogcHJvcHMgfHwge30sXG4gICAgICAgIGNoaWxkcmVuOiBjaGlsZHJlblxuICAgICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwKHN0YXRlLCBhY3Rpb25zLCB2aWV3LCBjb250YWluZXIpIHtcbiAgdmFyIHJlbmRlckxvY2tcbiAgdmFyIGludm9rZUxhdGVyU3RhY2sgPSBbXVxuICB2YXIgcm9vdEVsZW1lbnQgPSAoY29udGFpbmVyICYmIGNvbnRhaW5lci5jaGlsZHJlblswXSkgfHwgbnVsbFxuICB2YXIgbGFzdE5vZGUgPSByb290RWxlbWVudCAmJiB0b1ZOb2RlKHJvb3RFbGVtZW50LCBbXS5tYXApXG4gIHZhciBnbG9iYWxTdGF0ZSA9IGNvcHkoc3RhdGUpXG4gIHZhciB3aXJlZEFjdGlvbnMgPSBjb3B5KGFjdGlvbnMpXG5cbiAgc2NoZWR1bGVSZW5kZXIod2lyZVN0YXRlVG9BY3Rpb25zKFtdLCBnbG9iYWxTdGF0ZSwgd2lyZWRBY3Rpb25zKSlcblxuICByZXR1cm4gd2lyZWRBY3Rpb25zXG5cbiAgZnVuY3Rpb24gdG9WTm9kZShlbGVtZW50LCBtYXApIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgcHJvcHM6IHt9LFxuICAgICAgY2hpbGRyZW46IG1hcC5jYWxsKGVsZW1lbnQuY2hpbGROb2RlcywgZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5ub2RlVHlwZSA9PT0gM1xuICAgICAgICAgID8gZWxlbWVudC5ub2RlVmFsdWVcbiAgICAgICAgICA6IHRvVk5vZGUoZWxlbWVudCwgbWFwKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmVuZGVyTG9jayA9ICFyZW5kZXJMb2NrXG5cbiAgICB2YXIgbmV4dCA9IHZpZXcoZ2xvYmFsU3RhdGUsIHdpcmVkQWN0aW9ucylcbiAgICBpZiAoY29udGFpbmVyICYmICFyZW5kZXJMb2NrKSB7XG4gICAgICByb290RWxlbWVudCA9IHBhdGNoKGNvbnRhaW5lciwgcm9vdEVsZW1lbnQsIGxhc3ROb2RlLCAobGFzdE5vZGUgPSBuZXh0KSlcbiAgICB9XG5cbiAgICB3aGlsZSAoKG5leHQgPSBpbnZva2VMYXRlclN0YWNrLnBvcCgpKSkgbmV4dCgpXG4gIH1cblxuICBmdW5jdGlvbiBzY2hlZHVsZVJlbmRlcigpIHtcbiAgICBpZiAoIXJlbmRlckxvY2spIHtcbiAgICAgIHJlbmRlckxvY2sgPSAhcmVuZGVyTG9ja1xuICAgICAgc2V0VGltZW91dChyZW5kZXIpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY29weSh0YXJnZXQsIHNvdXJjZSkge1xuICAgIHZhciBvYmogPSB7fVxuXG4gICAgZm9yICh2YXIgaSBpbiB0YXJnZXQpIG9ialtpXSA9IHRhcmdldFtpXVxuICAgIGZvciAodmFyIGkgaW4gc291cmNlKSBvYmpbaV0gPSBzb3VyY2VbaV1cblxuICAgIHJldHVybiBvYmpcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldChwYXRoLCB2YWx1ZSwgc291cmNlKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9XG4gICAgaWYgKHBhdGgubGVuZ3RoKSB7XG4gICAgICB0YXJnZXRbcGF0aFswXV0gPVxuICAgICAgICBwYXRoLmxlbmd0aCA+IDEgPyBzZXQocGF0aC5zbGljZSgxKSwgdmFsdWUsIHNvdXJjZVtwYXRoWzBdXSkgOiB2YWx1ZVxuICAgICAgcmV0dXJuIGNvcHkoc291cmNlLCB0YXJnZXQpXG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0KHBhdGgsIHNvdXJjZSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aC5sZW5ndGg7IGkrKykge1xuICAgICAgc291cmNlID0gc291cmNlW3BhdGhbaV1dXG4gICAgfVxuICAgIHJldHVybiBzb3VyY2VcbiAgfVxuXG4gIGZ1bmN0aW9uIHdpcmVTdGF0ZVRvQWN0aW9ucyhwYXRoLCBzdGF0ZSwgYWN0aW9ucykge1xuICAgIGZvciAodmFyIGtleSBpbiBhY3Rpb25zKSB7XG4gICAgICB0eXBlb2YgYWN0aW9uc1trZXldID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgPyAoZnVuY3Rpb24oa2V5LCBhY3Rpb24pIHtcbiAgICAgICAgICAgIGFjdGlvbnNba2V5XSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiAoZGF0YSA9IGFjdGlvbihkYXRhKSkgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhKGdldChwYXRoLCBnbG9iYWxTdGF0ZSksIGFjdGlvbnMpXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgZGF0YSAmJlxuICAgICAgICAgICAgICAgIGRhdGEgIT09IChzdGF0ZSA9IGdldChwYXRoLCBnbG9iYWxTdGF0ZSkpICYmXG4gICAgICAgICAgICAgICAgIWRhdGEudGhlbiAvLyBQcm9taXNlXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHNjaGVkdWxlUmVuZGVyKFxuICAgICAgICAgICAgICAgICAgKGdsb2JhbFN0YXRlID0gc2V0KHBhdGgsIGNvcHkoc3RhdGUsIGRhdGEpLCBnbG9iYWxTdGF0ZSkpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuIGRhdGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KShrZXksIGFjdGlvbnNba2V5XSlcbiAgICAgICAgOiB3aXJlU3RhdGVUb0FjdGlvbnMoXG4gICAgICAgICAgICBwYXRoLmNvbmNhdChrZXkpLFxuICAgICAgICAgICAgKHN0YXRlW2tleV0gPSBzdGF0ZVtrZXldIHx8IHt9KSxcbiAgICAgICAgICAgIChhY3Rpb25zW2tleV0gPSBjb3B5KGFjdGlvbnNba2V5XSkpXG4gICAgICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEtleShub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5wcm9wcyA/IG5vZGUucHJvcHMua2V5IDogbnVsbFxuICB9XG5cbiAgZnVuY3Rpb24gc2V0RWxlbWVudFByb3AoZWxlbWVudCwgbmFtZSwgdmFsdWUsIGlzU1ZHLCBvbGRWYWx1ZSkge1xuICAgIGlmIChuYW1lID09PSBcImtleVwiKSB7XG4gICAgfSBlbHNlIGlmIChuYW1lID09PSBcInN0eWxlXCIpIHtcbiAgICAgIGZvciAodmFyIGkgaW4gY29weShvbGRWYWx1ZSwgdmFsdWUpKSB7XG4gICAgICAgIGVsZW1lbnRbbmFtZV1baV0gPSB2YWx1ZSA9PSBudWxsIHx8IHZhbHVlW2ldID09IG51bGwgPyBcIlwiIDogdmFsdWVbaV1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiIHx8IChuYW1lIGluIGVsZW1lbnQgJiYgIWlzU1ZHKSkge1xuICAgICAgICBlbGVtZW50W25hbWVdID0gdmFsdWUgPT0gbnVsbCA/IFwiXCIgOiB2YWx1ZVxuICAgICAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlICE9PSBmYWxzZSkge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSlcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgdmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKG5hbWUpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudChub2RlLCBpc1NWRykge1xuICAgIHZhciBlbGVtZW50ID1cbiAgICAgIHR5cGVvZiBub2RlID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBub2RlID09PSBcIm51bWJlclwiXG4gICAgICAgID8gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobm9kZSlcbiAgICAgICAgOiAoaXNTVkcgPSBpc1NWRyB8fCBub2RlLm5hbWUgPT09IFwic3ZnXCIpXG4gICAgICAgICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBub2RlLm5hbWUpXG4gICAgICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGUubmFtZSlcblxuICAgIGlmIChub2RlLnByb3BzKSB7XG4gICAgICBpZiAobm9kZS5wcm9wcy5vbmNyZWF0ZSkge1xuICAgICAgICBpbnZva2VMYXRlclN0YWNrLnB1c2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbm9kZS5wcm9wcy5vbmNyZWF0ZShlbGVtZW50KVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVFbGVtZW50KG5vZGUuY2hpbGRyZW5baV0sIGlzU1ZHKSlcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgbmFtZSBpbiBub2RlLnByb3BzKSB7XG4gICAgICAgIHNldEVsZW1lbnRQcm9wKGVsZW1lbnQsIG5hbWUsIG5vZGUucHJvcHNbbmFtZV0sIGlzU1ZHKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVFbGVtZW50KGVsZW1lbnQsIG9sZFByb3BzLCBwcm9wcywgaXNTVkcpIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIGNvcHkob2xkUHJvcHMsIHByb3BzKSkge1xuICAgICAgaWYgKFxuICAgICAgICBwcm9wc1tuYW1lXSAhPT1cbiAgICAgICAgKG5hbWUgPT09IFwidmFsdWVcIiB8fCBuYW1lID09PSBcImNoZWNrZWRcIlxuICAgICAgICAgID8gZWxlbWVudFtuYW1lXVxuICAgICAgICAgIDogb2xkUHJvcHNbbmFtZV0pXG4gICAgICApIHtcbiAgICAgICAgc2V0RWxlbWVudFByb3AoZWxlbWVudCwgbmFtZSwgcHJvcHNbbmFtZV0sIGlzU1ZHLCBvbGRQcm9wc1tuYW1lXSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocHJvcHMub251cGRhdGUpIHtcbiAgICAgIGludm9rZUxhdGVyU3RhY2sucHVzaChmdW5jdGlvbigpIHtcbiAgICAgICAgcHJvcHMub251cGRhdGUoZWxlbWVudCwgb2xkUHJvcHMpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUNoaWxkcmVuKGVsZW1lbnQsIG5vZGUsIHByb3BzKSB7XG4gICAgaWYgKChwcm9wcyA9IG5vZGUucHJvcHMpKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVtb3ZlQ2hpbGRyZW4oZWxlbWVudC5jaGlsZE5vZGVzW2ldLCBub2RlLmNoaWxkcmVuW2ldKVxuICAgICAgfVxuXG4gICAgICBpZiAocHJvcHMub25kZXN0cm95KSB7XG4gICAgICAgIHByb3BzLm9uZGVzdHJveShlbGVtZW50KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZWxlbWVudFxuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlRWxlbWVudChwYXJlbnQsIGVsZW1lbnQsIG5vZGUsIGNiKSB7XG4gICAgZnVuY3Rpb24gZG9uZSgpIHtcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChyZW1vdmVDaGlsZHJlbihlbGVtZW50LCBub2RlKSlcbiAgICB9XG5cbiAgICBpZiAobm9kZS5wcm9wcyAmJiAoY2IgPSBub2RlLnByb3BzLm9ucmVtb3ZlKSkge1xuICAgICAgY2IoZWxlbWVudCwgZG9uZSlcbiAgICB9IGVsc2Uge1xuICAgICAgZG9uZSgpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGF0Y2gocGFyZW50LCBlbGVtZW50LCBvbGROb2RlLCBub2RlLCBpc1NWRywgbmV4dFNpYmxpbmcpIHtcbiAgICBpZiAobm9kZSA9PT0gb2xkTm9kZSkge1xuICAgIH0gZWxzZSBpZiAob2xkTm9kZSA9PSBudWxsKSB7XG4gICAgICBlbGVtZW50ID0gcGFyZW50Lmluc2VydEJlZm9yZShjcmVhdGVFbGVtZW50KG5vZGUsIGlzU1ZHKSwgZWxlbWVudClcbiAgICB9IGVsc2UgaWYgKG5vZGUubmFtZSAmJiBub2RlLm5hbWUgPT09IG9sZE5vZGUubmFtZSkge1xuICAgICAgdXBkYXRlRWxlbWVudChcbiAgICAgICAgZWxlbWVudCxcbiAgICAgICAgb2xkTm9kZS5wcm9wcyxcbiAgICAgICAgbm9kZS5wcm9wcyxcbiAgICAgICAgKGlzU1ZHID0gaXNTVkcgfHwgbm9kZS5uYW1lID09PSBcInN2Z1wiKVxuICAgICAgKVxuXG4gICAgICB2YXIgb2xkRWxlbWVudHMgPSBbXVxuICAgICAgdmFyIG9sZEtleWVkID0ge31cbiAgICAgIHZhciBuZXdLZXllZCA9IHt9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2xkTm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBvbGRFbGVtZW50c1tpXSA9IGVsZW1lbnQuY2hpbGROb2Rlc1tpXVxuXG4gICAgICAgIHZhciBvbGRDaGlsZCA9IG9sZE5vZGUuY2hpbGRyZW5baV1cbiAgICAgICAgdmFyIG9sZEtleSA9IGdldEtleShvbGRDaGlsZClcblxuICAgICAgICBpZiAobnVsbCAhPSBvbGRLZXkpIHtcbiAgICAgICAgICBvbGRLZXllZFtvbGRLZXldID0gW29sZEVsZW1lbnRzW2ldLCBvbGRDaGlsZF1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgaSA9IDBcbiAgICAgIHZhciBqID0gMFxuXG4gICAgICB3aGlsZSAoaiA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgIHZhciBvbGRDaGlsZCA9IG9sZE5vZGUuY2hpbGRyZW5baV1cbiAgICAgICAgdmFyIG5ld0NoaWxkID0gbm9kZS5jaGlsZHJlbltqXVxuXG4gICAgICAgIHZhciBvbGRLZXkgPSBnZXRLZXkob2xkQ2hpbGQpXG4gICAgICAgIHZhciBuZXdLZXkgPSBnZXRLZXkobmV3Q2hpbGQpXG5cbiAgICAgICAgaWYgKG5ld0tleWVkW29sZEtleV0pIHtcbiAgICAgICAgICBpKytcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld0tleSA9PSBudWxsKSB7XG4gICAgICAgICAgaWYgKG9sZEtleSA9PSBudWxsKSB7XG4gICAgICAgICAgICBwYXRjaChlbGVtZW50LCBvbGRFbGVtZW50c1tpXSwgb2xkQ2hpbGQsIG5ld0NoaWxkLCBpc1NWRylcbiAgICAgICAgICAgIGorK1xuICAgICAgICAgIH1cbiAgICAgICAgICBpKytcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgcmVjeWxlZE5vZGUgPSBvbGRLZXllZFtuZXdLZXldIHx8IFtdXG5cbiAgICAgICAgICBpZiAob2xkS2V5ID09PSBuZXdLZXkpIHtcbiAgICAgICAgICAgIHBhdGNoKGVsZW1lbnQsIHJlY3lsZWROb2RlWzBdLCByZWN5bGVkTm9kZVsxXSwgbmV3Q2hpbGQsIGlzU1ZHKVxuICAgICAgICAgICAgaSsrXG4gICAgICAgICAgfSBlbHNlIGlmIChyZWN5bGVkTm9kZVswXSkge1xuICAgICAgICAgICAgcGF0Y2goXG4gICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgIGVsZW1lbnQuaW5zZXJ0QmVmb3JlKHJlY3lsZWROb2RlWzBdLCBvbGRFbGVtZW50c1tpXSksXG4gICAgICAgICAgICAgIHJlY3lsZWROb2RlWzFdLFxuICAgICAgICAgICAgICBuZXdDaGlsZCxcbiAgICAgICAgICAgICAgaXNTVkdcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGF0Y2goZWxlbWVudCwgb2xkRWxlbWVudHNbaV0sIG51bGwsIG5ld0NoaWxkLCBpc1NWRylcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBqKytcbiAgICAgICAgICBuZXdLZXllZFtuZXdLZXldID0gbmV3Q2hpbGRcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB3aGlsZSAoaSA8IG9sZE5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgIHZhciBvbGRDaGlsZCA9IG9sZE5vZGUuY2hpbGRyZW5baV1cbiAgICAgICAgaWYgKGdldEtleShvbGRDaGlsZCkgPT0gbnVsbCkge1xuICAgICAgICAgIHJlbW92ZUVsZW1lbnQoZWxlbWVudCwgb2xkRWxlbWVudHNbaV0sIG9sZENoaWxkKVxuICAgICAgICB9XG4gICAgICAgIGkrK1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpIGluIG9sZEtleWVkKSB7XG4gICAgICAgIGlmICghbmV3S2V5ZWRbb2xkS2V5ZWRbaV1bMV0ucHJvcHMua2V5XSkge1xuICAgICAgICAgIHJlbW92ZUVsZW1lbnQoZWxlbWVudCwgb2xkS2V5ZWRbaV1bMF0sIG9sZEtleWVkW2ldWzFdKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2RlLm5hbWUgPT09IG9sZE5vZGUubmFtZSkge1xuICAgICAgZWxlbWVudC5ub2RlVmFsdWUgPSBub2RlXG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQgPSBwYXJlbnQuaW5zZXJ0QmVmb3JlKFxuICAgICAgICBjcmVhdGVFbGVtZW50KG5vZGUsIGlzU1ZHKSxcbiAgICAgICAgKG5leHRTaWJsaW5nID0gZWxlbWVudClcbiAgICAgIClcbiAgICAgIHJlbW92ZUVsZW1lbnQocGFyZW50LCBuZXh0U2libGluZywgb2xkTm9kZSlcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnRcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL2h5cGVyYXBwL3NyYy9pbmRleC5qcyIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1c2VTb3VyY2VNYXApIHtcblx0dmFyIGxpc3QgPSBbXTtcblxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXHRcdFx0aWYoaXRlbVsyXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBjb250ZW50ICsgXCJ9XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY29udGVudDtcblx0XHRcdH1cblx0XHR9KS5qb2luKFwiXCIpO1xuXHR9O1xuXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG5cdFx0fVxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0cmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7XG5cdHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblx0aWYgKCFjc3NNYXBwaW5nKSB7XG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cblxuXHRpZiAodXNlU291cmNlTWFwICYmIHR5cGVvZiBidG9hID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0dmFyIHNvdXJjZU1hcHBpbmcgPSB0b0NvbW1lbnQoY3NzTWFwcGluZyk7XG5cdFx0dmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcblx0XHRcdHJldHVybiAnLyojIHNvdXJjZVVSTD0nICsgY3NzTWFwcGluZy5zb3VyY2VSb290ICsgc291cmNlICsgJyAqLydcblx0XHR9KTtcblxuXHRcdHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oJ1xcbicpO1xuXHR9XG5cblx0cmV0dXJuIFtjb250ZW50XS5qb2luKCdcXG4nKTtcbn1cblxuLy8gQWRhcHRlZCBmcm9tIGNvbnZlcnQtc291cmNlLW1hcCAoTUlUKVxuZnVuY3Rpb24gdG9Db21tZW50KHNvdXJjZU1hcCkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcblx0dmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSk7XG5cdHZhciBkYXRhID0gJ3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCcgKyBiYXNlNjQ7XG5cblx0cmV0dXJuICcvKiMgJyArIGRhdGEgKyAnICovJztcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5cbnZhciBzdHlsZXNJbkRvbSA9IHt9O1xuXG52YXJcdG1lbW9pemUgPSBmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW87XG5cblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdHJldHVybiBtZW1vO1xuXHR9O1xufTtcblxudmFyIGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcblx0Ly8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3Ncblx0Ly8gQHNlZSBodHRwOi8vYnJvd3NlcmhhY2tzLmNvbS8jaGFjay1lNzFkODY5MmY2NTMzNDE3M2ZlZTcxNWMyMjJjYjgwNVxuXHQvLyBUZXN0cyBmb3IgZXhpc3RlbmNlIG9mIHN0YW5kYXJkIGdsb2JhbHMgaXMgdG8gYWxsb3cgc3R5bGUtbG9hZGVyXG5cdC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuXHQvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcblx0cmV0dXJuIHdpbmRvdyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5hbGwgJiYgIXdpbmRvdy5hdG9iO1xufSk7XG5cbnZhciBnZXRUYXJnZXQgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG59O1xuXG52YXIgZ2V0RWxlbWVudCA9IChmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW8gPSB7fTtcblxuXHRyZXR1cm4gZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgcGFzc2luZyBmdW5jdGlvbiBpbiBvcHRpb25zLCB0aGVuIHVzZSBpdCBmb3IgcmVzb2x2ZSBcImhlYWRcIiBlbGVtZW50LlxuICAgICAgICAgICAgICAgIC8vIFVzZWZ1bCBmb3IgU2hhZG93IFJvb3Qgc3R5bGUgaS5lXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgaW5zZXJ0SW50bzogZnVuY3Rpb24gKCkgeyByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNmb29cIikuc2hhZG93Um9vdCB9XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHR2YXIgc3R5bGVUYXJnZXQgPSBnZXRUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xuXHRcdFx0Ly8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblx0XHRcdGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHQvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuXHRcdFx0XHRcdC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG5cdFx0XHRcdFx0c3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcblx0XHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdFx0c3R5bGVUYXJnZXQgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcblx0XHR9XG5cdFx0cmV0dXJuIG1lbW9bdGFyZ2V0XVxuXHR9O1xufSkoKTtcblxudmFyIHNpbmdsZXRvbiA9IG51bGw7XG52YXJcdHNpbmdsZXRvbkNvdW50ZXIgPSAwO1xudmFyXHRzdHlsZXNJbnNlcnRlZEF0VG9wID0gW107XG5cbnZhclx0Zml4VXJscyA9IHJlcXVpcmUoXCIuL3VybHNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuXHRpZiAodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0b3B0aW9ucy5hdHRycyA9IHR5cGVvZiBvcHRpb25zLmF0dHJzID09PSBcIm9iamVjdFwiID8gb3B0aW9ucy5hdHRycyA6IHt9O1xuXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cdGlmICghb3B0aW9ucy5zaW5nbGV0b24gJiYgdHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uICE9PSBcImJvb2xlYW5cIikgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgPGhlYWQ+IGVsZW1lbnRcbiAgICAgICAgaWYgKCFvcHRpb25zLmluc2VydEludG8pIG9wdGlvbnMuaW5zZXJ0SW50byA9IFwiaGVhZFwiO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIGJvdHRvbSBvZiB0aGUgdGFyZ2V0XG5cdGlmICghb3B0aW9ucy5pbnNlcnRBdCkgb3B0aW9ucy5pbnNlcnRBdCA9IFwiYm90dG9tXCI7XG5cblx0dmFyIHN0eWxlcyA9IGxpc3RUb1N0eWxlcyhsaXN0LCBvcHRpb25zKTtcblxuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUgKG5ld0xpc3QpIHtcblx0XHR2YXIgbWF5UmVtb3ZlID0gW107XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xuXHRcdH1cblxuXHRcdGlmKG5ld0xpc3QpIHtcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCwgb3B0aW9ucyk7XG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XG5cblx0XHRcdGlmKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykgZG9tU3R5bGUucGFydHNbal0oKTtcblxuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG5cbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tIChzdHlsZXMsIG9wdGlvbnMpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdGlmKGRvbVN0eWxlKSB7XG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyAobGlzdCwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVzID0gW107XG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XG5cdFx0dmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XG5cblx0XHRpZighbmV3U3R5bGVzW2lkXSkgc3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcblx0XHRlbHNlIG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcblx0fVxuXG5cdHJldHVybiBzdHlsZXM7XG59XG5cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudCAob3B0aW9ucywgc3R5bGUpIHtcblx0dmFyIHRhcmdldCA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvKVxuXG5cdGlmICghdGFyZ2V0KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnRJbnRvJyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG5cdH1cblxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZXNJbnNlcnRlZEF0VG9wW3N0eWxlc0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XG5cblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcblx0XHRpZiAoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XG5cdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCB0YXJnZXQuZmlyc3RDaGlsZCk7XG5cdFx0fSBlbHNlIGlmIChsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHRcdH1cblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGUpO1xuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcblx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcIm9iamVjdFwiICYmIG9wdGlvbnMuaW5zZXJ0QXQuYmVmb3JlKSB7XG5cdFx0dmFyIG5leHRTaWJsaW5nID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8gKyBcIiBcIiArIG9wdGlvbnMuaW5zZXJ0QXQuYmVmb3JlKTtcblx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBuZXh0U2libGluZyk7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiW1N0eWxlIExvYWRlcl1cXG5cXG4gSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcgKCdvcHRpb25zLmluc2VydEF0JykgZm91bmQuXFxuIE11c3QgYmUgJ3RvcCcsICdib3R0b20nLCBvciBPYmplY3QuXFxuIChodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlciNpbnNlcnRhdClcXG5cIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50IChzdHlsZSkge1xuXHRpZiAoc3R5bGUucGFyZW50Tm9kZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRzdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlKTtcblxuXHR2YXIgaWR4ID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlKTtcblx0aWYoaWR4ID49IDApIHtcblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXG5cdGFkZEF0dHJzKHN0eWxlLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlKTtcblxuXHRyZXR1cm4gc3R5bGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHRvcHRpb25zLmF0dHJzLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuXG5cdGFkZEF0dHJzKGxpbmssIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGluayk7XG5cblx0cmV0dXJuIGxpbms7XG59XG5cbmZ1bmN0aW9uIGFkZEF0dHJzIChlbCwgYXR0cnMpIHtcblx0T2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdGVsLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUgKG9iaiwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGUsIHVwZGF0ZSwgcmVtb3ZlLCByZXN1bHQ7XG5cblx0Ly8gSWYgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gd2FzIGRlZmluZWQsIHJ1biBpdCBvbiB0aGUgY3NzXG5cdGlmIChvcHRpb25zLnRyYW5zZm9ybSAmJiBvYmouY3NzKSB7XG5cdCAgICByZXN1bHQgPSBvcHRpb25zLnRyYW5zZm9ybShvYmouY3NzKTtcblxuXHQgICAgaWYgKHJlc3VsdCkge1xuXHQgICAgXHQvLyBJZiB0cmFuc2Zvcm0gcmV0dXJucyBhIHZhbHVlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIHJ1bm5pbmcgcnVudGltZSB0cmFuc2Zvcm1hdGlvbnMgb24gdGhlIGNzcy5cblx0ICAgIFx0b2JqLmNzcyA9IHJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICBcdC8vIElmIHRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gcmV0dXJucyBhIGZhbHN5IHZhbHVlLCBkb24ndCBhZGQgdGhpcyBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIGNvbmRpdGlvbmFsIGxvYWRpbmcgb2YgY3NzXG5cdCAgICBcdHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIFx0XHQvLyBub29wXG5cdCAgICBcdH07XG5cdCAgICB9XG5cdH1cblxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcblxuXHRcdHN0eWxlID0gc2luZ2xldG9uIHx8IChzaW5nbGV0b24gPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuXG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCBmYWxzZSk7XG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCB0cnVlKTtcblxuXHR9IGVsc2UgaWYgKFxuXHRcdG9iai5zb3VyY2VNYXAgJiZcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiXG5cdCkge1xuXHRcdHN0eWxlID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlLCBvcHRpb25zKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXG5cdFx0XHRpZihzdHlsZS5ocmVmKSBVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlLmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXHRcdH07XG5cdH1cblxuXHR1cGRhdGUob2JqKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUgKG5ld09iaikge1xuXHRcdGlmIChuZXdPYmopIHtcblx0XHRcdGlmIChcblx0XHRcdFx0bmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJlxuXHRcdFx0XHRuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJlxuXHRcdFx0XHRuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcblx0fTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcgKHN0eWxlLCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xuXG5cdGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGUuY2hpbGROb2RlcztcblxuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGUucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRzdHlsZS5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZS5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyAoc3R5bGUsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXG5cdGlmKG1lZGlhKSB7XG5cdFx0c3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXG5cdH1cblxuXHRpZihzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlLmZpcnN0Q2hpbGQpIHtcblx0XHRcdHN0eWxlLnJlbW92ZUNoaWxkKHN0eWxlLmZpcnN0Q2hpbGQpO1xuXHRcdH1cblxuXHRcdHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsgKGxpbmssIG9wdGlvbnMsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0Lypcblx0XHRJZiBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgaXNuJ3QgZGVmaW5lZCwgYnV0IHNvdXJjZW1hcHMgYXJlIGVuYWJsZWRcblx0XHRhbmQgdGhlcmUgaXMgbm8gcHVibGljUGF0aCBkZWZpbmVkIHRoZW4gbGV0cyB0dXJuIGNvbnZlcnRUb0Fic29sdXRlVXJsc1xuXHRcdG9uIGJ5IGRlZmF1bHQuICBPdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgY29udmVydFRvQWJzb2x1dGVVcmxzIG9wdGlvblxuXHRcdGRpcmVjdGx5XG5cdCovXG5cdHZhciBhdXRvRml4VXJscyA9IG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzID09PSB1bmRlZmluZWQgJiYgc291cmNlTWFwO1xuXG5cdGlmIChvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyB8fCBhdXRvRml4VXJscykge1xuXHRcdGNzcyA9IGZpeFVybHMoY3NzKTtcblx0fVxuXG5cdGlmIChzb3VyY2VNYXApIHtcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcblx0fVxuXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xuXG5cdHZhciBvbGRTcmMgPSBsaW5rLmhyZWY7XG5cblx0bGluay5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuXHRpZihvbGRTcmMpIFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGFwcCB9IGZyb20gJ2h5cGVyYXBwJ1xuaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJ1xuaW1wb3J0IHN0YXRlIGZyb20gJy4vc3RhdGUnXG5pbXBvcnQgdmlldyBmcm9tICcuL2NvbXBvbmVudHMnXG5pbXBvcnQgJ25vcm1hbGl6ZS5jc3MnXG5cbmV4cG9ydCBjb25zdCBtYWluID0gYXBwKFxuICBzdGF0ZSxcbiAgYWN0aW9ucyxcbiAgdmlldyxcbiAgZG9jdW1lbnQuYm9keVxuKVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiZXhwb3J0IGRlZmF1bHQge1xuICBwbHVzOiAoKSA9PiAoe2NvdW50fSkgPT4gKHtjb3VudDogY291bnQgKyAxfSksXG4gIG1pbnVzOiAoKSA9PiAoe2NvdW50fSkgPT4gKHtjb3VudDogY291bnQgLSAxfSlcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hY3Rpb25zL2luZGV4LmpzIiwiZXhwb3J0IGRlZmF1bHQge1xuICBjb3VudDogMFxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3N0YXRlL2luZGV4LmpzIiwiaW1wb3J0IHsgaCB9IGZyb20gJ2h5cGVyYXBwJ1xuaW1wb3J0IHMgZnJvbSAnLi9pbmRleC5zdHlsJ1xuXG5leHBvcnQgZGVmYXVsdCAoc3RhdGUsIGFjdGlvbnMpID0+XG4gIDxkaXYgY2xhc3M9e3MubWFpbn0+XG4gICAgPGgxPmh5cGVyYXBwLWJvaWxlcnBsYXRlPC9oMT5cbiAgICA8cD5oeXBlcmFwcC1ib2lsZXJwbGF0ZSBpcyBhIGJvaWxlcnBsYXRlIGZvciBxdWlja3N0YXJ0aW5nIGEgd2ViIGFwcGxpY2F0aW9uIHdpdGggSHlwZXJhcHAsIEpTWCwgU3R5bHVzLCBQdWcsIEVzbGludC48L3A+XG4gICAgPHA+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9zb3N1a2VzdXp1a2kvaHlwZXJhcHAtYm9pbGVycGxhdGVcIj5naXRodWIgcmVwb3NpdG9yeTwvYT48L3A+XG4gICAgPHA+e3N0YXRlLmNvdW50fTwvcD5cbiAgICA8YnV0dG9uIG9uY2xpY2s9e2FjdGlvbnMucGx1c30+KzwvYnV0dG9uPlxuICAgIDxidXR0b24gb25jbGljaz17YWN0aW9ucy5taW51c30+LTwvYnV0dG9uPlxuICA8L2Rpdj5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb25lbnRzL2luZGV4LmpzIiwiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bHVzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTIhLi9pbmRleC5zdHlsXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJzb3VyY2VNYXBcIjp0cnVlLFwiaG1yXCI6dHJ1ZX1cblxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbm9wdGlvbnMuaW5zZXJ0SW50byA9IHVuZGVmaW5lZDtcblxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscztcblxuaWYobW9kdWxlLmhvdCkge1xuXHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsdXMtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMiEuL2luZGV4LnN0eWxcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWx1cy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0yIS4vaW5kZXguc3R5bFwiKTtcblxuXHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXG5cdFx0dmFyIGxvY2FscyA9IChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHR2YXIga2V5LCBpZHggPSAwO1xuXG5cdFx0XHRmb3Ioa2V5IGluIGEpIHtcblx0XHRcdFx0aWYoIWIgfHwgYVtrZXldICE9PSBiW2tleV0pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWR4Kys7XG5cdFx0XHR9XG5cblx0XHRcdGZvcihrZXkgaW4gYikgaWR4LS07XG5cblx0XHRcdHJldHVybiBpZHggPT09IDA7XG5cdFx0fShjb250ZW50LmxvY2FscywgbmV3Q29udGVudC5sb2NhbHMpKTtcblxuXHRcdGlmKCFsb2NhbHMpIHRocm93IG5ldyBFcnJvcignQWJvcnRpbmcgQ1NTIEhNUiBkdWUgdG8gY2hhbmdlZCBjc3MtbW9kdWxlcyBsb2NhbHMuJyk7XG5cblx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdH0pO1xuXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvaW5kZXguc3R5bFxuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLl8yOXl1cmtmZDZyeG5rcWp5eHY0czZnNW16ZHlnMjdicDhwamEzcnB2a2d2NXB4NTl5Z2JzYnc5NTVtOTFidTE1NmZldWczY2s3ZXF6dWdrejhyZDc0NzhrOGEzbWJhcnBmN3F6dmNrLWluZGV4LW1haW4ge1xcbiAgY29sb3I6ICM5MzkzOTU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMmUzMjM1O1xcbiAgaGVpZ2h0OiAxMDB2aDtcXG59XFxuLl8yOXl1cmtmZDZyeG5rcWp5eHY0czZnNW16ZHlnMjdicDhwamEzcnB2a2d2NXB4NTl5Z2JzYnc5NTVtOTFidTE1NmZldWczY2s3ZXF6dWdrejhyZDc0NzhrOGEzbWJhcnBmN3F6dmNrLWluZGV4LW1haW4gaDEge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZy1sZWZ0OiAxMHB4O1xcbiAgcGFkZGluZy10b3A6IDMwcHg7XFxufVxcbi5fMjl5dXJrZmQ2cnhua3FqeXh2NHM2ZzVtemR5ZzI3YnA4cGphM3JwdmtndjVweDU5eWdic2J3OTU1bTkxYnUxNTZmZXVnM2NrN2VxenVna3o4cmQ3NDc4azhhM21iYXJwZjdxenZjay1pbmRleC1tYWluIHAge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZy1sZWZ0OiAxMHB4O1xcbiAgcGFkZGluZy10b3A6IDIwcHg7XFxufVxcbi5fMjl5dXJrZmQ2cnhua3FqeXh2NHM2ZzVtemR5ZzI3YnA4cGphM3JwdmtndjVweDU5eWdic2J3OTU1bTkxYnUxNTZmZXVnM2NrN2VxenVna3o4cmQ3NDc4azhhM21iYXJwZjdxenZjay1pbmRleC1tYWluIGEge1xcbiAgY29sb3I6ICMwMGIwY2M7XFxufVxcbi5fMjl5dXJrZmQ2cnhua3FqeXh2NHM2ZzVtemR5ZzI3YnA4cGphM3JwdmtndjVweDU5eWdic2J3OTU1bTkxYnUxNTZmZXVnM2NrN2VxenVna3o4cmQ3NDc4azhhM21iYXJwZjdxenZjay1pbmRleC1tYWluIGJ1dHRvbiB7XFxuICBmb250LXNpemU6IDI1cHg7XFxuICBvdXRsaW5lOiBub25lO1xcbiAgY29sb3I6ICM5MzkzOTU7XFxuICBib3JkZXI6IG5vbmU7XFxuICBib3JkZXItcmFkaXVzOiAwLjFlbTtcXG4gIHdpZHRoOiA4MHB4O1xcbiAgaGVpZ2h0OiA2MHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzQxNDc0YjtcXG4gIG1hcmdpbjogNXB4O1xcbn1cXG4uXzI5eXVya2ZkNnJ4bmtxanl4djRzNmc1bXpkeWcyN2JwOHBqYTNycHZrZ3Y1cHg1OXlnYnNidzk1NW05MWJ1MTU2ZmV1ZzNjazdlcXp1Z2t6OHJkNzQ3OGs4YTNtYmFycGY3cXp2Y2staW5kZXgtbWFpbiBidXR0b246aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzM4M2M0MDtcXG59XFxuLl8yOXl1cmtmZDZyeG5rcWp5eHY0czZnNW16ZHlnMjdicDhwamEzcnB2a2d2NXB4NTl5Z2JzYnc5NTVtOTFidTE1NmZldWczY2s3ZXF6dWdrejhyZDc0NzhrOGEzbWJhcnBmN3F6dmNrLWluZGV4LW1haW4gYnV0dG9uOmFjdGl2ZSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzIzNjM5O1xcbn1cXG4vKiMgc291cmNlTWFwcGluZ1VSTD1zcmMvY29tcG9uZW50cy9pbmRleC5jc3MubWFwICovXCIsIFwiXCIsIHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIi9Vc2Vycy9zdXp1a2kvLmdocS9naXRodWIuY29tL3Nvc3VrZXN1enVraS9oeXBlcmFwcC1vbmUvc3JjL2NvbXBvbmVudHMvc3JjL2NvbXBvbmVudHMvaW5kZXguc3R5bFwiLFwiL1VzZXJzL3N1enVraS8uZ2hxL2dpdGh1Yi5jb20vc29zdWtlc3V6dWtpL2h5cGVyYXBwLW9uZS9zcmMvY29tcG9uZW50cy9pbmRleC5zdHlsXCIsXCIvVXNlcnMvc3V6dWtpLy5naHEvZ2l0aHViLmNvbS9zb3N1a2VzdXp1a2kvaHlwZXJhcHAtb25lL3NyYy9jb21wb25lbnRzL25vZGVfbW9kdWxlcy9uaWIvbGliL25pYi9ib3JkZXIuc3R5bFwiLFwiL1VzZXJzL3N1enVraS8uZ2hxL2dpdGh1Yi5jb20vc29zdWtlc3V6dWtpL2h5cGVyYXBwLW9uZS9zcmMvY29tcG9uZW50cy9ub2RlX21vZHVsZXMvbmliL2xpYi9uaWIvYm9yZGVyLXJhZGl1cy5zdHlsXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsZUFBQTtFQUNBLDBCQUFBO0VBQ0EsY0FBQTtDQ0NEO0FEQUM7RUFDRSxVQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtDQ0VIO0FEREM7RUFDRSxVQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtDQ0dIO0FERkM7RUFDRSxlQUFBO0NDSUg7QURIQztFQUNFLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLGVBQUE7RUVSQSxhQUFBO0VDMkNGLHFCQUFBO0VIaENFLFlBQUE7RUFDQSxhQUFBO0VBQ0EsMEJBQUE7RUFDQSxZQUFBO0NDS0g7QURKRztFQUNFLDBCQUFBO0NDTUw7QURMRztFQUNFLDBCQUFBO0NDT0w7QUFDRCxvREFBb0RcIixcImZpbGVcIjpcImluZGV4LnN0eWxcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLm1haW5cXG4gIGNvbG9yICR0ZXh0LWNvbG9yXFxuICBiYWNrZ3JvdW5kLWNvbG9yICRiYWNrZ3JvdW5kLWNvbG9yXFxuICBoZWlnaHQgMTAwdmhcXG4gIGgxXFxuICAgIG1hcmdpbiAwXFxuICAgIHBhZGRpbmctbGVmdCAxMHB4XFxuICAgIHBhZGRpbmctdG9wIDMwcHhcXG4gIHBcXG4gICAgbWFyZ2luIDBcXG4gICAgcGFkZGluZy1sZWZ0IDEwcHhcXG4gICAgcGFkZGluZy10b3AgMjBweFxcbiAgYVxcbiAgICBjb2xvciAkbGluay1jb2xvclxcbiAgYnV0dG9uXFxuICAgIGZvbnQtc2l6ZSAyNXB4XFxuICAgIG91dGxpbmUgbm9uZVxcbiAgICBjb2xvciAkdGV4dC1jb2xvclxcbiAgICBib3JkZXIgbm9uZVxcbiAgICBib3JkZXItcmFkaXVzIDAuMWVtXFxuICAgIHdpZHRoIDgwcHhcXG4gICAgaGVpZ2h0IDYwcHhcXG4gICAgYmFja2dyb3VuZC1jb2xvciBsaWdodGVuKCRiYWNrZ3JvdW5kLWNvbG9yLCAxMCUpXFxuICAgIG1hcmdpbiA1cHhcXG4gICAgJjpob3ZlclxcbiAgICAgIGJhY2tncm91bmQtY29sb3IgbGlnaHRlbigkYmFja2dyb3VuZC1jb2xvciwgNSUpXFxuICAgICY6YWN0aXZlXFxuICAgICAgYmFja2dyb3VuZC1jb2xvciBsaWdodGVuKCRiYWNrZ3JvdW5kLWNvbG9yLCAyJSlcXG5cXG5cIixcIi5tYWluIHtcXG4gIGNvbG9yOiAjOTM5Mzk1O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzJlMzIzNTtcXG4gIGhlaWdodDogMTAwdmg7XFxufVxcbi5tYWluIGgxIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmctbGVmdDogMTBweDtcXG4gIHBhZGRpbmctdG9wOiAzMHB4O1xcbn1cXG4ubWFpbiBwIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmctbGVmdDogMTBweDtcXG4gIHBhZGRpbmctdG9wOiAyMHB4O1xcbn1cXG4ubWFpbiBhIHtcXG4gIGNvbG9yOiAjMDBiMGNjO1xcbn1cXG4ubWFpbiBidXR0b24ge1xcbiAgZm9udC1zaXplOiAyNXB4O1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGNvbG9yOiAjOTM5Mzk1O1xcbiAgYm9yZGVyOiBub25lO1xcbiAgYm9yZGVyLXJhZGl1czogMC4xZW07XFxuICB3aWR0aDogODBweDtcXG4gIGhlaWdodDogNjBweDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICM0MTQ3NGI7XFxuICBtYXJnaW46IDVweDtcXG59XFxuLm1haW4gYnV0dG9uOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzODNjNDA7XFxufVxcbi5tYWluIGJ1dHRvbjphY3RpdmUge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMyMzYzOTtcXG59XFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9c3JjL2NvbXBvbmVudHMvaW5kZXguY3NzLm1hcCAqL1wiLFwiLypcXG4gKiBib3JkZXI6IDxjb2xvcj5cXG4gKiBib3JkZXI6IC4uLlxcbiAqL1xcblxcbmJvcmRlcihjb2xvciwgYXJncy4uLilcXG4gIGlmIGNvbG9yIGlzIGEgJ2NvbG9yJ1xcbiAgICBib3JkZXI6IDFweCBzb2xpZCBjb2xvciBhcmdzXFxuICBlbHNlXFxuICAgIGJvcmRlcjogYXJndW1lbnRzXFxuXCIsXCIvKlxcbiAqIEhlbHBlciBmb3IgYm9yZGVyLXJhZGl1cygpLlxcbiAqL1xcblxcbi1hcHBseS1ib3JkZXItcmFkaXVzKHBvcywgaW1wb3J0YW5jZSlcXG4gIGlmIGxlbmd0aChwb3MpID09IDNcXG4gICAgLy8gYm9yZGVyLXJhZGl1czogPHRvcCB8IGJvdHRvbT4gPGxlZnQgfCByaWdodD4gPG4+XFxuICAgIHkgPSBwb3NbMF1cXG4gICAgeCA9IHBvc1sxXVxcbiAgICAvLyBXZSBkb24ndCB1c2UgdmVuZG9yIGZvciBib2Rlci1yYWRpdXMgYW55bW9yZVxcbiAgICAvLyB2ZW5kb3IoJ2JvcmRlci1yYWRpdXMtJXMlcycgJSBwb3MsIHBvc1syXSwgb25seTogd2Via2l0IG9mZmljaWFsKVxcbiAgICB7J2JvcmRlci0lcy0lcy1yYWRpdXMnICUgcG9zfTogcG9zWzJdIGltcG9ydGFuY2VcXG4gIGVsc2UgaWYgcG9zWzBdIGluICh0b3AgYm90dG9tKVxcbiAgICAvLyBib3JkZXItcmFkaXVzOiA8dG9wIHwgYm90dG9tPiA8bj5cXG4gICAgLWFwcGx5LWJvcmRlci1yYWRpdXMocG9zWzBdIGxlZnQgcG9zWzFdLCBpbXBvcnRhbmNlKVxcbiAgICAtYXBwbHktYm9yZGVyLXJhZGl1cyhwb3NbMF0gcmlnaHQgcG9zWzFdLCBpbXBvcnRhbmNlKVxcbiAgZWxzZSBpZiBwb3NbMF0gaW4gKGxlZnQgcmlnaHQpXFxuICAgIC8vIGJvcmRlci1yYWRpdXM6IDxsZWZ0IHwgcmlnaHQ+IDxuPlxcbiAgICB1bnNoaWZ0KHBvcywgdG9wKTtcXG4gICAgLWFwcGx5LWJvcmRlci1yYWRpdXMocG9zLCBpbXBvcnRhbmNlKVxcbiAgICBwb3NbMF0gPSBib3R0b21cXG4gICAgLWFwcGx5LWJvcmRlci1yYWRpdXMocG9zLCBpbXBvcnRhbmNlKVxcblxcbi8qXFxuICogYm9yZGVyLXJhZGl1cyBzdXBwb3J0aW5nIGF1Z21lbnRlZCBiZWhhdmlvci5cXG4gKlxcbiAqIEV4YW1wbGVzOlxcbiAqXFxuICogICAgYm9yZGVyLXJhZGl1czogMnB4IDVweFxcbiAqICAgIGJvcmRlci1yYWRpdXM6IHRvcCA1cHggYm90dG9tIDEwcHhcXG4gKiAgICBib3JkZXItcmFkaXVzOiBsZWZ0IDVweFxcbiAqICAgIGJvcmRlci1yYWRpdXM6IHRvcCBsZWZ0IDVweFxcbiAqICAgIGJvcmRlci1yYWRpdXM6IHRvcCBsZWZ0IDEwcHggYm90dG9tIHJpZ2h0IDVweFxcbiAqICAgIGJvcmRlci1yYWRpdXM6IHRvcCBsZWZ0IDEwcHgsIGJvdHRvbSByaWdodCA1cHhcXG4gKlxcbiAqL1xcblxcbmJvcmRlci1yYWRpdXMoKVxcbiAgcG9zID0gKClcXG4gIGF1Z21lbnRlZCA9IGZhbHNlXFxuICBpbXBvcnRhbmNlID0gYXJndW1lbnRzW2xlbmd0aChhcmd1bWVudHMpIC0gMV0gPT0gIWltcG9ydGFudCA/ICFpbXBvcnRhbnQgOiB1bnF1b3RlKCcnKVxcblxcbiAgZm9yIGFyZ3MgaW4gYXJndW1lbnRzXFxuICAgIGZvciBhcmcgaW4gYXJnc1xcbiAgICAgIGlmIGFyZyBpcyBhICdpZGVudCdcXG4gICAgICAgIGFwcGVuZChwb3MsIGFyZylcXG4gICAgICAgIGF1Z21lbnRlZCA9IHRydWVcXG4gICAgICBlbHNlXFxuICAgICAgICBhcHBlbmQocG9zLCBhcmcpXFxuICAgICAgICBpZiBhdWdtZW50ZWRcXG4gICAgICAgICAgLWFwcGx5LWJvcmRlci1yYWRpdXMocG9zLCBpbXBvcnRhbmNlKVxcbiAgICAgICAgICBwb3MgPSAoKVxcbiAgYm9yZGVyLXJhZGl1cyBwb3MgdW5sZXNzIGF1Z21lbnRlZFxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4vLyBleHBvcnRzXG5leHBvcnRzLmxvY2FscyA9IHtcblx0XCJtYWluXCI6IFwiXzI5eXVya2ZkNnJ4bmtxanl4djRzNmc1bXpkeWcyN2JwOHBqYTNycHZrZ3Y1cHg1OXlnYnNidzk1NW05MWJ1MTU2ZmV1ZzNjazdlcXp1Z2t6OHJkNzQ3OGs4YTNtYmFycGY3cXp2Y2staW5kZXgtbWFpblwiXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/e1wibG9jYWxJZGVudE5hbWVcIjpcIltzaGE1MTI6aGFzaDpiYXNlMzJdLVtuYW1lXS1bbG9jYWxdXCIsXCJtb2R1bGVzXCI6dHJ1ZSxcInNvdXJjZU1hcFwiOnRydWV9IS4vbm9kZV9tb2R1bGVzL3N0eWx1cy1sb2FkZXI/e1wic291cmNlTWFwXCI6dHJ1ZX0hLi9zcmMvY29tcG9uZW50cy9pbmRleC5zdHlsXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlxuLyoqXG4gKiBXaGVuIHNvdXJjZSBtYXBzIGFyZSBlbmFibGVkLCBgc3R5bGUtbG9hZGVyYCB1c2VzIGEgbGluayBlbGVtZW50IHdpdGggYSBkYXRhLXVyaSB0b1xuICogZW1iZWQgdGhlIGNzcyBvbiB0aGUgcGFnZS4gVGhpcyBicmVha3MgYWxsIHJlbGF0aXZlIHVybHMgYmVjYXVzZSBub3cgdGhleSBhcmUgcmVsYXRpdmUgdG8gYVxuICogYnVuZGxlIGluc3RlYWQgb2YgdGhlIGN1cnJlbnQgcGFnZS5cbiAqXG4gKiBPbmUgc29sdXRpb24gaXMgdG8gb25seSB1c2UgZnVsbCB1cmxzLCBidXQgdGhhdCBtYXkgYmUgaW1wb3NzaWJsZS5cbiAqXG4gKiBJbnN0ZWFkLCB0aGlzIGZ1bmN0aW9uIFwiZml4ZXNcIiB0aGUgcmVsYXRpdmUgdXJscyB0byBiZSBhYnNvbHV0ZSBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgcGFnZSBsb2NhdGlvbi5cbiAqXG4gKiBBIHJ1ZGltZW50YXJ5IHRlc3Qgc3VpdGUgaXMgbG9jYXRlZCBhdCBgdGVzdC9maXhVcmxzLmpzYCBhbmQgY2FuIGJlIHJ1biB2aWEgdGhlIGBucG0gdGVzdGAgY29tbWFuZC5cbiAqXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gIC8vIGdldCBjdXJyZW50IGxvY2F0aW9uXG4gIHZhciBsb2NhdGlvbiA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmxvY2F0aW9uO1xuXG4gIGlmICghbG9jYXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaXhVcmxzIHJlcXVpcmVzIHdpbmRvdy5sb2NhdGlvblwiKTtcbiAgfVxuXG5cdC8vIGJsYW5rIG9yIG51bGw/XG5cdGlmICghY3NzIHx8IHR5cGVvZiBjc3MgIT09IFwic3RyaW5nXCIpIHtcblx0ICByZXR1cm4gY3NzO1xuICB9XG5cbiAgdmFyIGJhc2VVcmwgPSBsb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIGxvY2F0aW9uLmhvc3Q7XG4gIHZhciBjdXJyZW50RGlyID0gYmFzZVVybCArIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL1teXFwvXSokLywgXCIvXCIpO1xuXG5cdC8vIGNvbnZlcnQgZWFjaCB1cmwoLi4uKVxuXHQvKlxuXHRUaGlzIHJlZ3VsYXIgZXhwcmVzc2lvbiBpcyBqdXN0IGEgd2F5IHRvIHJlY3Vyc2l2ZWx5IG1hdGNoIGJyYWNrZXRzIHdpdGhpblxuXHRhIHN0cmluZy5cblxuXHQgL3VybFxccypcXCggID0gTWF0Y2ggb24gdGhlIHdvcmQgXCJ1cmxcIiB3aXRoIGFueSB3aGl0ZXNwYWNlIGFmdGVyIGl0IGFuZCB0aGVuIGEgcGFyZW5zXG5cdCAgICggID0gU3RhcnQgYSBjYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAoPzogID0gU3RhcnQgYSBub24tY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgICAgIFteKShdICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAoPzogID0gU3RhcnQgYW5vdGhlciBub24tY2FwdHVyaW5nIGdyb3Vwc1xuXHQgICAgICAgICAgICAgICAgIFteKShdKyAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICAgICAgW14pKF0qICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIFxcKSAgPSBNYXRjaCBhIGVuZCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKSAgPSBFbmQgR3JvdXBcbiAgICAgICAgICAgICAgKlxcKSA9IE1hdGNoIGFueXRoaW5nIGFuZCB0aGVuIGEgY2xvc2UgcGFyZW5zXG4gICAgICAgICAgKSAgPSBDbG9zZSBub24tY2FwdHVyaW5nIGdyb3VwXG4gICAgICAgICAgKiAgPSBNYXRjaCBhbnl0aGluZ1xuICAgICAgICkgID0gQ2xvc2UgY2FwdHVyaW5nIGdyb3VwXG5cdCBcXCkgID0gTWF0Y2ggYSBjbG9zZSBwYXJlbnNcblxuXHQgL2dpICA9IEdldCBhbGwgbWF0Y2hlcywgbm90IHRoZSBmaXJzdC4gIEJlIGNhc2UgaW5zZW5zaXRpdmUuXG5cdCAqL1xuXHR2YXIgZml4ZWRDc3MgPSBjc3MucmVwbGFjZSgvdXJsXFxzKlxcKCgoPzpbXikoXXxcXCgoPzpbXikoXSt8XFwoW14pKF0qXFwpKSpcXCkpKilcXCkvZ2ksIGZ1bmN0aW9uKGZ1bGxNYXRjaCwgb3JpZ1VybCkge1xuXHRcdC8vIHN0cmlwIHF1b3RlcyAoaWYgdGhleSBleGlzdClcblx0XHR2YXIgdW5xdW90ZWRPcmlnVXJsID0gb3JpZ1VybFxuXHRcdFx0LnRyaW0oKVxuXHRcdFx0LnJlcGxhY2UoL15cIiguKilcIiQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSlcblx0XHRcdC5yZXBsYWNlKC9eJyguKiknJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KTtcblxuXHRcdC8vIGFscmVhZHkgYSBmdWxsIHVybD8gbm8gY2hhbmdlXG5cdFx0aWYgKC9eKCN8ZGF0YTp8aHR0cDpcXC9cXC98aHR0cHM6XFwvXFwvfGZpbGU6XFwvXFwvXFwvKS9pLnRlc3QodW5xdW90ZWRPcmlnVXJsKSkge1xuXHRcdCAgcmV0dXJuIGZ1bGxNYXRjaDtcblx0XHR9XG5cblx0XHQvLyBjb252ZXJ0IHRoZSB1cmwgdG8gYSBmdWxsIHVybFxuXHRcdHZhciBuZXdVcmw7XG5cblx0XHRpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvL1wiKSA9PT0gMCkge1xuXHRcdCAgXHQvL1RPRE86IHNob3VsZCB3ZSBhZGQgcHJvdG9jb2w/XG5cdFx0XHRuZXdVcmwgPSB1bnF1b3RlZE9yaWdVcmw7XG5cdFx0fSBlbHNlIGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi9cIikgPT09IDApIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSBiYXNlIHVybFxuXHRcdFx0bmV3VXJsID0gYmFzZVVybCArIHVucXVvdGVkT3JpZ1VybDsgLy8gYWxyZWFkeSBzdGFydHMgd2l0aCAnLydcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gY3VycmVudCBkaXJlY3Rvcnlcblx0XHRcdG5ld1VybCA9IGN1cnJlbnREaXIgKyB1bnF1b3RlZE9yaWdVcmwucmVwbGFjZSgvXlxcLlxcLy8sIFwiXCIpOyAvLyBTdHJpcCBsZWFkaW5nICcuLydcblx0XHR9XG5cblx0XHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIHVybCguLi4pXG5cdFx0cmV0dXJuIFwidXJsKFwiICsgSlNPTi5zdHJpbmdpZnkobmV3VXJsKSArIFwiKVwiO1xuXHR9KTtcblxuXHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIGNzc1xuXHRyZXR1cm4gZml4ZWRDc3M7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qcyIsIlxudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9jc3MtbG9hZGVyL2luZGV4LmpzIS4vbm9ybWFsaXplLmNzc1wiKTtcblxuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5cbnZhciB0cmFuc2Zvcm07XG52YXIgaW5zZXJ0SW50bztcblxuXG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cblxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbm9wdGlvbnMuaW5zZXJ0SW50byA9IHVuZGVmaW5lZDtcblxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi9jc3MtbG9hZGVyL2luZGV4LmpzIS4vbm9ybWFsaXplLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uL2Nzcy1sb2FkZXIvaW5kZXguanMhLi9ub3JtYWxpemUuY3NzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbm9ybWFsaXplLmNzcy9ub3JtYWxpemUuY3NzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoZmFsc2UpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLyohIG5vcm1hbGl6ZS5jc3MgdjcuMC4wIHwgTUlUIExpY2Vuc2UgfCBnaXRodWIuY29tL25lY29sYXMvbm9ybWFsaXplLmNzcyAqL1xcblxcbi8qIERvY3VtZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpblxcbiAqICAgIElFIG9uIFdpbmRvd3MgUGhvbmUgYW5kIGluIGlPUy5cXG4gKi9cXG5cXG5odG1sIHtcXG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuICAtbXMtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xcbiAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXFxufVxcblxcbi8qIFNlY3Rpb25zXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMgKG9waW5pb25hdGVkKS5cXG4gKi9cXG5cXG5ib2R5IHtcXG4gIG1hcmdpbjogMDtcXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgOS0uXFxuICovXFxuXFxuYXJ0aWNsZSxcXG5hc2lkZSxcXG5mb290ZXIsXFxuaGVhZGVyLFxcbm5hdixcXG5zZWN0aW9uIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBgaDFgIGVsZW1lbnRzIHdpdGhpbiBgc2VjdGlvbmAgYW5kXFxuICogYGFydGljbGVgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5oMSB7XFxuICBmb250LXNpemU6IDJlbTtcXG4gIG1hcmdpbjogMC42N2VtIDA7XFxufVxcblxcbi8qIEdyb3VwaW5nIGNvbnRlbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDktLlxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFLlxcbiAqL1xcblxcbmZpZ2NhcHRpb24sXFxuZmlndXJlLFxcbm1haW4geyAvKiAxICovXFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IG1hcmdpbiBpbiBJRSA4LlxcbiAqL1xcblxcbmZpZ3VyZSB7XFxuICBtYXJnaW46IDFlbSA0MHB4O1xcbn1cXG5cXG4vKipcXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxcbiAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxcbiAqL1xcblxcbmhyIHtcXG4gIGJveC1zaXppbmc6IGNvbnRlbnQtYm94OyAvKiAxICovXFxuICBoZWlnaHQ6IDA7IC8qIDEgKi9cXG4gIG92ZXJmbG93OiB2aXNpYmxlOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnByZSB7XFxuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG4gIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXFxufVxcblxcbi8qIFRleHQtbGV2ZWwgc2VtYW50aWNzXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiAxLiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBvbiBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXFxuICogMi4gUmVtb3ZlIGdhcHMgaW4gbGlua3MgdW5kZXJsaW5lIGluIGlPUyA4KyBhbmQgU2FmYXJpIDgrLlxcbiAqL1xcblxcbmEge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7IC8qIDEgKi9cXG4gIC13ZWJraXQtdGV4dC1kZWNvcmF0aW9uLXNraXA6IG9iamVjdHM7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogMS4gUmVtb3ZlIHRoZSBib3R0b20gYm9yZGVyIGluIENocm9tZSA1Ny0gYW5kIEZpcmVmb3ggMzktLlxcbiAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYWJiclt0aXRsZV0ge1xcbiAgYm9yZGVyLWJvdHRvbTogbm9uZTsgLyogMSAqL1xcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBQcmV2ZW50IHRoZSBkdXBsaWNhdGUgYXBwbGljYXRpb24gb2YgYGJvbGRlcmAgYnkgdGhlIG5leHQgcnVsZSBpbiBTYWZhcmkgNi5cXG4gKi9cXG5cXG5iLFxcbnN0cm9uZyB7XFxuICBmb250LXdlaWdodDogaW5oZXJpdDtcXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5iLFxcbnN0cm9uZyB7XFxuICBmb250LXdlaWdodDogYm9sZGVyO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5jb2RlLFxcbmtiZCxcXG5zYW1wIHtcXG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xcbiAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgc3R5bGUgaW4gQW5kcm9pZCA0LjMtLlxcbiAqL1xcblxcbmRmbiB7XFxuICBmb250LXN0eWxlOiBpdGFsaWM7XFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBiYWNrZ3JvdW5kIGFuZCBjb2xvciBpbiBJRSA5LS5cXG4gKi9cXG5cXG5tYXJrIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZjA7XFxuICBjb2xvcjogIzAwMDtcXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuc21hbGwge1xcbiAgZm9udC1zaXplOiA4MCU7XFxufVxcblxcbi8qKlxcbiAqIFByZXZlbnQgYHN1YmAgYW5kIGBzdXBgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxcbiAqIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zdWIsXFxuc3VwIHtcXG4gIGZvbnQtc2l6ZTogNzUlO1xcbiAgbGluZS1oZWlnaHQ6IDA7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcblxcbnN1YiB7XFxuICBib3R0b206IC0wLjI1ZW07XFxufVxcblxcbnN1cCB7XFxuICB0b3A6IC0wLjVlbTtcXG59XFxuXFxuLyogRW1iZWRkZWQgY29udGVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgOS0uXFxuICovXFxuXFxuYXVkaW8sXFxudmlkZW8ge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBpT1MgNC03LlxcbiAqL1xcblxcbmF1ZGlvOm5vdChbY29udHJvbHNdKSB7XFxuICBkaXNwbGF5OiBub25lO1xcbiAgaGVpZ2h0OiAwO1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGJvcmRlciBvbiBpbWFnZXMgaW5zaWRlIGxpbmtzIGluIElFIDEwLS5cXG4gKi9cXG5cXG5pbWcge1xcbiAgYm9yZGVyLXN0eWxlOiBub25lO1xcbn1cXG5cXG4vKipcXG4gKiBIaWRlIHRoZSBvdmVyZmxvdyBpbiBJRS5cXG4gKi9cXG5cXG5zdmc6bm90KDpyb290KSB7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG5cXG4vKiBGb3Jtc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gQ2hhbmdlIHRoZSBmb250IHN0eWxlcyBpbiBhbGwgYnJvd3NlcnMgKG9waW5pb25hdGVkKS5cXG4gKiAyLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYnV0dG9uLFxcbmlucHV0LFxcbm9wdGdyb3VwLFxcbnNlbGVjdCxcXG50ZXh0YXJlYSB7XFxuICBmb250LWZhbWlseTogc2Fucy1zZXJpZjsgLyogMSAqL1xcbiAgZm9udC1zaXplOiAxMDAlOyAvKiAxICovXFxuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcbiAgbWFyZ2luOiAwOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxcbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXFxuICovXFxuXFxuYnV0dG9uLFxcbmlucHV0IHsgLyogMSAqL1xcbiAgb3ZlcmZsb3c6IHZpc2libGU7XFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxcbiAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5idXR0b24sXFxuc2VsZWN0IHsgLyogMSAqL1xcbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XFxufVxcblxcbi8qKlxcbiAqIDEuIFByZXZlbnQgYSBXZWJLaXQgYnVnIHdoZXJlICgyKSBkZXN0cm95cyBuYXRpdmUgYGF1ZGlvYCBhbmQgYHZpZGVvYFxcbiAqICAgIGNvbnRyb2xzIGluIEFuZHJvaWQgNC5cXG4gKiAyLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmJ1dHRvbixcXG5odG1sIFt0eXBlPVxcXCJidXR0b25cXFwiXSwgLyogMSAqL1xcblt0eXBlPVxcXCJyZXNldFxcXCJdLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXSB7XFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAqL1xcblxcbmJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcInJlc2V0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdOjotbW96LWZvY3VzLWlubmVyIHtcXG4gIGJvcmRlci1zdHlsZTogbm9uZTtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbi8qKlxcbiAqIFJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cXG4gKi9cXG5cXG5idXR0b246LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcImJ1dHRvblxcXCJdOi1tb3otZm9jdXNyaW5nLFxcblt0eXBlPVxcXCJyZXNldFxcXCJdOi1tb3otZm9jdXNyaW5nLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXTotbW96LWZvY3VzcmluZyB7XFxuICBvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5maWVsZHNldCB7XFxuICBwYWRkaW5nOiAwLjM1ZW0gMC43NWVtIDAuNjI1ZW07XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIHRleHQgd3JhcHBpbmcgaW4gRWRnZSBhbmQgSUUuXFxuICogMi4gQ29ycmVjdCB0aGUgY29sb3IgaW5oZXJpdGFuY2UgZnJvbSBgZmllbGRzZXRgIGVsZW1lbnRzIGluIElFLlxcbiAqIDMuIFJlbW92ZSB0aGUgcGFkZGluZyBzbyBkZXZlbG9wZXJzIGFyZSBub3QgY2F1Z2h0IG91dCB3aGVuIHRoZXkgemVybyBvdXRcXG4gKiAgICBgZmllbGRzZXRgIGVsZW1lbnRzIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5sZWdlbmQge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xcbiAgY29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cXG4gIGRpc3BsYXk6IHRhYmxlOyAvKiAxICovXFxuICBtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cXG4gIHBhZGRpbmc6IDA7IC8qIDMgKi9cXG4gIHdoaXRlLXNwYWNlOiBub3JtYWw7IC8qIDEgKi9cXG59XFxuXFxuLyoqXFxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgOS0uXFxuICogMi4gQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cXG4gKi9cXG5cXG5wcm9ncmVzcyB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IC8qIDEgKi9cXG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFLlxcbiAqL1xcblxcbnRleHRhcmVhIHtcXG4gIG92ZXJmbG93OiBhdXRvO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC0uXFxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLS5cXG4gKi9cXG5cXG5bdHlwZT1cXFwiY2hlY2tib3hcXFwiXSxcXG5bdHlwZT1cXFwicmFkaW9cXFwiXSB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuICBwYWRkaW5nOiAwOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIENocm9tZS5cXG4gKi9cXG5cXG5bdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXFxuW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXG4gIGhlaWdodDogYXV0bztcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXFxuICogMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXFxuICovXFxuXFxuW3R5cGU9XFxcInNlYXJjaFxcXCJdIHtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXFxuICBvdXRsaW5lLW9mZnNldDogLTJweDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgYW5kIGNhbmNlbCBidXR0b25zIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxcbiAqL1xcblxcblt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtY2FuY2VsLWJ1dHRvbixcXG5bdHlwZT1cXFwic2VhcmNoXFxcIl06Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24ge1xcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiAqIDIuIENoYW5nZSBmb250IHByb3BlcnRpZXMgdG8gYGluaGVyaXRgIGluIFNhZmFyaS5cXG4gKi9cXG5cXG46Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXFxuICBmb250OiBpbmhlcml0OyAvKiAyICovXFxufVxcblxcbi8qIEludGVyYWN0aXZlXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDktLlxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFLCBhbmQgRmlyZWZveC5cXG4gKi9cXG5cXG5kZXRhaWxzLCAvKiAxICovXFxubWVudSB7XFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuLypcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuc3VtbWFyeSB7XFxuICBkaXNwbGF5OiBsaXN0LWl0ZW07XFxufVxcblxcbi8qIFNjcmlwdGluZ1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgOS0uXFxuICovXFxuXFxuY2FudmFzIHtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUuXFxuICovXFxuXFxudGVtcGxhdGUge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLyogSGlkZGVuXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMC0uXFxuICovXFxuXFxuW2hpZGRlbl0ge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlciEuL25vZGVfbW9kdWxlcy9ub3JtYWxpemUuY3NzL25vcm1hbGl6ZS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=