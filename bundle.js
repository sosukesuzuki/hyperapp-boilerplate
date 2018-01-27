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
exports.push([module.i, "._29yurkfd6rxnkqjyxv4s6g5mzdyg27bp8pja3rpvkgv5px59ygbsbw955m91bu156feug3ck7eqzugkz8rd7478k8a3mbarpf7qzvck-index-main {\n  color: #939395;\n  background-color: #2e3235;\n  height: 100vh;\n}\n._29yurkfd6rxnkqjyxv4s6g5mzdyg27bp8pja3rpvkgv5px59ygbsbw955m91bu156feug3ck7eqzugkz8rd7478k8a3mbarpf7qzvck-index-main h1 {\n  margin: 0;\n  padding-left: 10px;\n  padding-top: 30px;\n}\n._29yurkfd6rxnkqjyxv4s6g5mzdyg27bp8pja3rpvkgv5px59ygbsbw955m91bu156feug3ck7eqzugkz8rd7478k8a3mbarpf7qzvck-index-main p {\n  margin: 0;\n  padding-left: 10px;\n  padding-top: 20px;\n}\n._29yurkfd6rxnkqjyxv4s6g5mzdyg27bp8pja3rpvkgv5px59ygbsbw955m91bu156feug3ck7eqzugkz8rd7478k8a3mbarpf7qzvck-index-main button {\n  font-size: 25px;\n  outline: none;\n  color: #939395;\n  border: none;\n  border-radius: 0.1em;\n  width: 80px;\n  height: 60px;\n  background-color: #41474b;\n  margin: 5px;\n}\n._29yurkfd6rxnkqjyxv4s6g5mzdyg27bp8pja3rpvkgv5px59ygbsbw955m91bu156feug3ck7eqzugkz8rd7478k8a3mbarpf7qzvck-index-main button:hover {\n  background-color: #383c40;\n}\n._29yurkfd6rxnkqjyxv4s6g5mzdyg27bp8pja3rpvkgv5px59ygbsbw955m91bu156feug3ck7eqzugkz8rd7478k8a3mbarpf7qzvck-index-main button:active {\n  background-color: #323639;\n}\n/*# sourceMappingURL=src/components/index.css.map */", "", {"version":3,"sources":["/Users/suzuki/.ghq/github.com/sosukesuzuki/hyperapp-one/src/components/src/components/index.styl","/Users/suzuki/.ghq/github.com/sosukesuzuki/hyperapp-one/src/components/index.styl","/Users/suzuki/.ghq/github.com/sosukesuzuki/hyperapp-one/src/components/node_modules/nib/lib/nib/border.styl","/Users/suzuki/.ghq/github.com/sosukesuzuki/hyperapp-one/src/components/node_modules/nib/lib/nib/border-radius.styl"],"names":[],"mappings":"AAAA;EACE,eAAA;EACA,0BAAA;EACA,cAAA;CCCD;ADAC;EACE,UAAA;EACA,mBAAA;EACA,kBAAA;CCEH;ADDC;EACE,UAAA;EACA,mBAAA;EACA,kBAAA;CCGH;ADFC;EACE,gBAAA;EACA,cAAA;EACA,eAAA;EENA,aAAA;EC2CF,qBAAA;EHlCE,YAAA;EACA,aAAA;EACA,0BAAA;EACA,YAAA;CCIH;ADHG;EACE,0BAAA;CCKL;ADJG;EACE,0BAAA;CCML;AACD,oDAAoD","file":"index.styl","sourcesContent":[".main\n  color $text-color\n  background-color $background-color\n  height 100vh\n  h1\n    margin 0\n    padding-left 10px\n    padding-top 30px\n  p\n    margin 0\n    padding-left 10px\n    padding-top 20px\n  button\n    font-size 25px\n    outline none\n    color $text-color\n    border none\n    border-radius 0.1em\n    width 80px\n    height 60px\n    background-color lighten($background-color, 10%)\n    margin 5px\n    &:hover\n      background-color lighten($background-color, 5%)\n    &:active\n      background-color lighten($background-color, 2%)\n\n",".main {\n  color: #939395;\n  background-color: #2e3235;\n  height: 100vh;\n}\n.main h1 {\n  margin: 0;\n  padding-left: 10px;\n  padding-top: 30px;\n}\n.main p {\n  margin: 0;\n  padding-left: 10px;\n  padding-top: 20px;\n}\n.main button {\n  font-size: 25px;\n  outline: none;\n  color: #939395;\n  border: none;\n  border-radius: 0.1em;\n  width: 80px;\n  height: 60px;\n  background-color: #41474b;\n  margin: 5px;\n}\n.main button:hover {\n  background-color: #383c40;\n}\n.main button:active {\n  background-color: #323639;\n}\n/*# sourceMappingURL=src/components/index.css.map */","/*\n * border: <color>\n * border: ...\n */\n\nborder(color, args...)\n  if color is a 'color'\n    border: 1px solid color args\n  else\n    border: arguments\n","/*\n * Helper for border-radius().\n */\n\n-apply-border-radius(pos, importance)\n  if length(pos) == 3\n    // border-radius: <top | bottom> <left | right> <n>\n    y = pos[0]\n    x = pos[1]\n    // We don't use vendor for boder-radius anymore\n    // vendor('border-radius-%s%s' % pos, pos[2], only: webkit official)\n    {'border-%s-%s-radius' % pos}: pos[2] importance\n  else if pos[0] in (top bottom)\n    // border-radius: <top | bottom> <n>\n    -apply-border-radius(pos[0] left pos[1], importance)\n    -apply-border-radius(pos[0] right pos[1], importance)\n  else if pos[0] in (left right)\n    // border-radius: <left | right> <n>\n    unshift(pos, top);\n    -apply-border-radius(pos, importance)\n    pos[0] = bottom\n    -apply-border-radius(pos, importance)\n\n/*\n * border-radius supporting augmented behavior.\n *\n * Examples:\n *\n *    border-radius: 2px 5px\n *    border-radius: top 5px bottom 10px\n *    border-radius: left 5px\n *    border-radius: top left 5px\n *    border-radius: top left 10px bottom right 5px\n *    border-radius: top left 10px, bottom right 5px\n *\n */\n\nborder-radius()\n  pos = ()\n  augmented = false\n  importance = arguments[length(arguments) - 1] == !important ? !important : unquote('')\n\n  for args in arguments\n    for arg in args\n      if arg is a 'ident'\n        append(pos, arg)\n        augmented = true\n      else\n        append(pos, arg)\n        if augmented\n          -apply-border-radius(pos, importance)\n          pos = ()\n  border-radius pos unless augmented\n"],"sourceRoot":""}]);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWVjMzY2NjQwNDAxNGY0ODgxYTIiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2h5cGVyYXBwL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3RhdGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvaW5kZXguc3R5bD83OTJmIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2luZGV4LnN0eWwiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbm9ybWFsaXplLmNzcy9ub3JtYWxpemUuY3NzP2I0MTEiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25vcm1hbGl6ZS5jc3Mvbm9ybWFsaXplLmNzcyJdLCJuYW1lcyI6WyJoIiwiYXBwIiwibmFtZSIsInByb3BzIiwibm9kZSIsInJlc3QiLCJjaGlsZHJlbiIsImxlbmd0aCIsImFyZ3VtZW50cyIsInB1c2giLCJBcnJheSIsImlzQXJyYXkiLCJwb3AiLCJzdGF0ZSIsImFjdGlvbnMiLCJ2aWV3IiwiY29udGFpbmVyIiwicmVuZGVyTG9jayIsImludm9rZUxhdGVyU3RhY2siLCJyb290RWxlbWVudCIsImxhc3ROb2RlIiwidG9WTm9kZSIsIm1hcCIsImdsb2JhbFN0YXRlIiwiY29weSIsIndpcmVkQWN0aW9ucyIsInNjaGVkdWxlUmVuZGVyIiwid2lyZVN0YXRlVG9BY3Rpb25zIiwiZWxlbWVudCIsIm5vZGVOYW1lIiwidG9Mb3dlckNhc2UiLCJjYWxsIiwiY2hpbGROb2RlcyIsIm5vZGVUeXBlIiwibm9kZVZhbHVlIiwicmVuZGVyIiwibmV4dCIsInBhdGNoIiwic2V0VGltZW91dCIsInRhcmdldCIsInNvdXJjZSIsIm9iaiIsImkiLCJzZXQiLCJwYXRoIiwidmFsdWUiLCJzbGljZSIsImdldCIsImtleSIsImFjdGlvbiIsImRhdGEiLCJ0aGVuIiwiY29uY2F0IiwiZ2V0S2V5Iiwic2V0RWxlbWVudFByb3AiLCJpc1NWRyIsIm9sZFZhbHVlIiwic2V0QXR0cmlidXRlIiwicmVtb3ZlQXR0cmlidXRlIiwiY3JlYXRlRWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlVGV4dE5vZGUiLCJjcmVhdGVFbGVtZW50TlMiLCJvbmNyZWF0ZSIsImFwcGVuZENoaWxkIiwidXBkYXRlRWxlbWVudCIsIm9sZFByb3BzIiwib251cGRhdGUiLCJyZW1vdmVDaGlsZHJlbiIsIm9uZGVzdHJveSIsInJlbW92ZUVsZW1lbnQiLCJwYXJlbnQiLCJjYiIsImRvbmUiLCJyZW1vdmVDaGlsZCIsIm9ucmVtb3ZlIiwib2xkTm9kZSIsIm5leHRTaWJsaW5nIiwiaW5zZXJ0QmVmb3JlIiwib2xkRWxlbWVudHMiLCJvbGRLZXllZCIsIm5ld0tleWVkIiwib2xkQ2hpbGQiLCJvbGRLZXkiLCJqIiwibmV3Q2hpbGQiLCJuZXdLZXkiLCJyZWN5bGVkTm9kZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJ1c2VTb3VyY2VNYXAiLCJsaXN0IiwidG9TdHJpbmciLCJpdGVtIiwiY29udGVudCIsImNzc1dpdGhNYXBwaW5nVG9TdHJpbmciLCJqb2luIiwibW9kdWxlcyIsIm1lZGlhUXVlcnkiLCJhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzIiwiaWQiLCJjc3NNYXBwaW5nIiwiYnRvYSIsInNvdXJjZU1hcHBpbmciLCJ0b0NvbW1lbnQiLCJzb3VyY2VVUkxzIiwic291cmNlcyIsInNvdXJjZVJvb3QiLCJzb3VyY2VNYXAiLCJiYXNlNjQiLCJ1bmVzY2FwZSIsImVuY29kZVVSSUNvbXBvbmVudCIsIkpTT04iLCJzdHJpbmdpZnkiLCJtYWluIiwiYm9keSIsInBsdXMiLCJjb3VudCIsIm1pbnVzIiwiY3NzIiwibG9jYXRpb24iLCJ3aW5kb3ciLCJFcnJvciIsImJhc2VVcmwiLCJwcm90b2NvbCIsImhvc3QiLCJjdXJyZW50RGlyIiwicGF0aG5hbWUiLCJyZXBsYWNlIiwiZml4ZWRDc3MiLCJmdWxsTWF0Y2giLCJvcmlnVXJsIiwidW5xdW90ZWRPcmlnVXJsIiwidHJpbSIsIm8iLCIkMSIsInRlc3QiLCJuZXdVcmwiLCJpbmRleE9mIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7UUM3RGdCQSxDLEdBQUFBLEM7UUEyQkFDLEcsR0FBQUEsRztBQTNCVCxTQUFTRCxDQUFULENBQVdFLElBQVgsRUFBaUJDLEtBQWpCLEVBQXdCO0FBQzdCLE1BQUlDLElBQUo7QUFDQSxNQUFJQyxPQUFPLEVBQVg7QUFDQSxNQUFJQyxXQUFXLEVBQWY7QUFDQSxNQUFJQyxTQUFTQyxVQUFVRCxNQUF2Qjs7QUFFQSxTQUFPQSxXQUFXLENBQWxCO0FBQXFCRixTQUFLSSxJQUFMLENBQVVELFVBQVVELE1BQVYsQ0FBVjtBQUFyQixHQUVBLE9BQU9GLEtBQUtF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QWdLLDBCQUEwQixHQUFHLDZEQUE2RCxrQkFBa0IsR0FBRyxnS0FBZ0ssa0JBQWtCLEdBQUc7O0FBRTloUSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA1ZWMzNjY2NDA0MDE0ZjQ4ODFhMiIsImV4cG9ydCBmdW5jdGlvbiBoKG5hbWUsIHByb3BzKSB7XG4gIHZhciBub2RlXG4gIHZhciByZXN0ID0gW11cbiAgdmFyIGNoaWxkcmVuID0gW11cbiAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcblxuICB3aGlsZSAobGVuZ3RoLS0gPiAyKSByZXN0LnB1c2goYXJndW1lbnRzW2xlbmd0aF0pXG5cbiAgd2hpbGUgKHJlc3QubGVuZ3RoKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoKG5vZGUgPSByZXN0LnBvcCgpKSkpIHtcbiAgICAgIGZvciAobGVuZ3RoID0gbm9kZS5sZW5ndGg7IGxlbmd0aC0tOyApIHtcbiAgICAgICAgcmVzdC5wdXNoKG5vZGVbbGVuZ3RoXSlcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5vZGUgIT0gbnVsbCAmJiBub2RlICE9PSB0cnVlICYmIG5vZGUgIT09IGZhbHNlKSB7XG4gICAgICBjaGlsZHJlbi5wdXNoKG5vZGUpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiBuYW1lID09PSBcImZ1bmN0aW9uXCJcbiAgICA/IG5hbWUocHJvcHMgfHwge30sIGNoaWxkcmVuKVxuICAgIDoge1xuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBwcm9wczogcHJvcHMgfHwge30sXG4gICAgICAgIGNoaWxkcmVuOiBjaGlsZHJlblxuICAgICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwKHN0YXRlLCBhY3Rpb25zLCB2aWV3LCBjb250YWluZXIpIHtcbiAgdmFyIHJlbmRlckxvY2tcbiAgdmFyIGludm9rZUxhdGVyU3RhY2sgPSBbXVxuICB2YXIgcm9vdEVsZW1lbnQgPSAoY29udGFpbmVyICYmIGNvbnRhaW5lci5jaGlsZHJlblswXSkgfHwgbnVsbFxuICB2YXIgbGFzdE5vZGUgPSByb290RWxlbWVudCAmJiB0b1ZOb2RlKHJvb3RFbGVtZW50LCBbXS5tYXApXG4gIHZhciBnbG9iYWxTdGF0ZSA9IGNvcHkoc3RhdGUpXG4gIHZhciB3aXJlZEFjdGlvbnMgPSBjb3B5KGFjdGlvbnMpXG5cbiAgc2NoZWR1bGVSZW5kZXIod2lyZVN0YXRlVG9BY3Rpb25zKFtdLCBnbG9iYWxTdGF0ZSwgd2lyZWRBY3Rpb25zKSlcblxuICByZXR1cm4gd2lyZWRBY3Rpb25zXG5cbiAgZnVuY3Rpb24gdG9WTm9kZShlbGVtZW50LCBtYXApIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgcHJvcHM6IHt9LFxuICAgICAgY2hpbGRyZW46IG1hcC5jYWxsKGVsZW1lbnQuY2hpbGROb2RlcywgZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5ub2RlVHlwZSA9PT0gM1xuICAgICAgICAgID8gZWxlbWVudC5ub2RlVmFsdWVcbiAgICAgICAgICA6IHRvVk5vZGUoZWxlbWVudCwgbWFwKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmVuZGVyTG9jayA9ICFyZW5kZXJMb2NrXG5cbiAgICB2YXIgbmV4dCA9IHZpZXcoZ2xvYmFsU3RhdGUsIHdpcmVkQWN0aW9ucylcbiAgICBpZiAoY29udGFpbmVyICYmICFyZW5kZXJMb2NrKSB7XG4gICAgICByb290RWxlbWVudCA9IHBhdGNoKGNvbnRhaW5lciwgcm9vdEVsZW1lbnQsIGxhc3ROb2RlLCAobGFzdE5vZGUgPSBuZXh0KSlcbiAgICB9XG5cbiAgICB3aGlsZSAoKG5leHQgPSBpbnZva2VMYXRlclN0YWNrLnBvcCgpKSkgbmV4dCgpXG4gIH1cblxuICBmdW5jdGlvbiBzY2hlZHVsZVJlbmRlcigpIHtcbiAgICBpZiAoIXJlbmRlckxvY2spIHtcbiAgICAgIHJlbmRlckxvY2sgPSAhcmVuZGVyTG9ja1xuICAgICAgc2V0VGltZW91dChyZW5kZXIpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY29weSh0YXJnZXQsIHNvdXJjZSkge1xuICAgIHZhciBvYmogPSB7fVxuXG4gICAgZm9yICh2YXIgaSBpbiB0YXJnZXQpIG9ialtpXSA9IHRhcmdldFtpXVxuICAgIGZvciAodmFyIGkgaW4gc291cmNlKSBvYmpbaV0gPSBzb3VyY2VbaV1cblxuICAgIHJldHVybiBvYmpcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldChwYXRoLCB2YWx1ZSwgc291cmNlKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9XG4gICAgaWYgKHBhdGgubGVuZ3RoKSB7XG4gICAgICB0YXJnZXRbcGF0aFswXV0gPVxuICAgICAgICBwYXRoLmxlbmd0aCA+IDEgPyBzZXQocGF0aC5zbGljZSgxKSwgdmFsdWUsIHNvdXJjZVtwYXRoWzBdXSkgOiB2YWx1ZVxuICAgICAgcmV0dXJuIGNvcHkoc291cmNlLCB0YXJnZXQpXG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0KHBhdGgsIHNvdXJjZSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aC5sZW5ndGg7IGkrKykge1xuICAgICAgc291cmNlID0gc291cmNlW3BhdGhbaV1dXG4gICAgfVxuICAgIHJldHVybiBzb3VyY2VcbiAgfVxuXG4gIGZ1bmN0aW9uIHdpcmVTdGF0ZVRvQWN0aW9ucyhwYXRoLCBzdGF0ZSwgYWN0aW9ucykge1xuICAgIGZvciAodmFyIGtleSBpbiBhY3Rpb25zKSB7XG4gICAgICB0eXBlb2YgYWN0aW9uc1trZXldID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgPyAoZnVuY3Rpb24oa2V5LCBhY3Rpb24pIHtcbiAgICAgICAgICAgIGFjdGlvbnNba2V5XSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiAoZGF0YSA9IGFjdGlvbihkYXRhKSkgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhKGdldChwYXRoLCBnbG9iYWxTdGF0ZSksIGFjdGlvbnMpXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgZGF0YSAmJlxuICAgICAgICAgICAgICAgIGRhdGEgIT09IChzdGF0ZSA9IGdldChwYXRoLCBnbG9iYWxTdGF0ZSkpICYmXG4gICAgICAgICAgICAgICAgIWRhdGEudGhlbiAvLyBQcm9taXNlXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHNjaGVkdWxlUmVuZGVyKFxuICAgICAgICAgICAgICAgICAgKGdsb2JhbFN0YXRlID0gc2V0KHBhdGgsIGNvcHkoc3RhdGUsIGRhdGEpLCBnbG9iYWxTdGF0ZSkpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuIGRhdGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KShrZXksIGFjdGlvbnNba2V5XSlcbiAgICAgICAgOiB3aXJlU3RhdGVUb0FjdGlvbnMoXG4gICAgICAgICAgICBwYXRoLmNvbmNhdChrZXkpLFxuICAgICAgICAgICAgKHN0YXRlW2tleV0gPSBzdGF0ZVtrZXldIHx8IHt9KSxcbiAgICAgICAgICAgIChhY3Rpb25zW2tleV0gPSBjb3B5KGFjdGlvbnNba2V5XSkpXG4gICAgICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEtleShub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5wcm9wcyA/IG5vZGUucHJvcHMua2V5IDogbnVsbFxuICB9XG5cbiAgZnVuY3Rpb24gc2V0RWxlbWVudFByb3AoZWxlbWVudCwgbmFtZSwgdmFsdWUsIGlzU1ZHLCBvbGRWYWx1ZSkge1xuICAgIGlmIChuYW1lID09PSBcImtleVwiKSB7XG4gICAgfSBlbHNlIGlmIChuYW1lID09PSBcInN0eWxlXCIpIHtcbiAgICAgIGZvciAodmFyIGkgaW4gY29weShvbGRWYWx1ZSwgdmFsdWUpKSB7XG4gICAgICAgIGVsZW1lbnRbbmFtZV1baV0gPSB2YWx1ZSA9PSBudWxsIHx8IHZhbHVlW2ldID09IG51bGwgPyBcIlwiIDogdmFsdWVbaV1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiIHx8IChuYW1lIGluIGVsZW1lbnQgJiYgIWlzU1ZHKSkge1xuICAgICAgICBlbGVtZW50W25hbWVdID0gdmFsdWUgPT0gbnVsbCA/IFwiXCIgOiB2YWx1ZVxuICAgICAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlICE9PSBmYWxzZSkge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSlcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgdmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKG5hbWUpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudChub2RlLCBpc1NWRykge1xuICAgIHZhciBlbGVtZW50ID1cbiAgICAgIHR5cGVvZiBub2RlID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBub2RlID09PSBcIm51bWJlclwiXG4gICAgICAgID8gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobm9kZSlcbiAgICAgICAgOiAoaXNTVkcgPSBpc1NWRyB8fCBub2RlLm5hbWUgPT09IFwic3ZnXCIpXG4gICAgICAgICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBub2RlLm5hbWUpXG4gICAgICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGUubmFtZSlcblxuICAgIGlmIChub2RlLnByb3BzKSB7XG4gICAgICBpZiAobm9kZS5wcm9wcy5vbmNyZWF0ZSkge1xuICAgICAgICBpbnZva2VMYXRlclN0YWNrLnB1c2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbm9kZS5wcm9wcy5vbmNyZWF0ZShlbGVtZW50KVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVFbGVtZW50KG5vZGUuY2hpbGRyZW5baV0sIGlzU1ZHKSlcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgbmFtZSBpbiBub2RlLnByb3BzKSB7XG4gICAgICAgIHNldEVsZW1lbnRQcm9wKGVsZW1lbnQsIG5hbWUsIG5vZGUucHJvcHNbbmFtZV0sIGlzU1ZHKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVFbGVtZW50KGVsZW1lbnQsIG9sZFByb3BzLCBwcm9wcywgaXNTVkcpIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIGNvcHkob2xkUHJvcHMsIHByb3BzKSkge1xuICAgICAgaWYgKFxuICAgICAgICBwcm9wc1tuYW1lXSAhPT1cbiAgICAgICAgKG5hbWUgPT09IFwidmFsdWVcIiB8fCBuYW1lID09PSBcImNoZWNrZWRcIlxuICAgICAgICAgID8gZWxlbWVudFtuYW1lXVxuICAgICAgICAgIDogb2xkUHJvcHNbbmFtZV0pXG4gICAgICApIHtcbiAgICAgICAgc2V0RWxlbWVudFByb3AoZWxlbWVudCwgbmFtZSwgcHJvcHNbbmFtZV0sIGlzU1ZHLCBvbGRQcm9wc1tuYW1lXSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocHJvcHMub251cGRhdGUpIHtcbiAgICAgIGludm9rZUxhdGVyU3RhY2sucHVzaChmdW5jdGlvbigpIHtcbiAgICAgICAgcHJvcHMub251cGRhdGUoZWxlbWVudCwgb2xkUHJvcHMpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUNoaWxkcmVuKGVsZW1lbnQsIG5vZGUsIHByb3BzKSB7XG4gICAgaWYgKChwcm9wcyA9IG5vZGUucHJvcHMpKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVtb3ZlQ2hpbGRyZW4oZWxlbWVudC5jaGlsZE5vZGVzW2ldLCBub2RlLmNoaWxkcmVuW2ldKVxuICAgICAgfVxuXG4gICAgICBpZiAocHJvcHMub25kZXN0cm95KSB7XG4gICAgICAgIHByb3BzLm9uZGVzdHJveShlbGVtZW50KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZWxlbWVudFxuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlRWxlbWVudChwYXJlbnQsIGVsZW1lbnQsIG5vZGUsIGNiKSB7XG4gICAgZnVuY3Rpb24gZG9uZSgpIHtcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChyZW1vdmVDaGlsZHJlbihlbGVtZW50LCBub2RlKSlcbiAgICB9XG5cbiAgICBpZiAobm9kZS5wcm9wcyAmJiAoY2IgPSBub2RlLnByb3BzLm9ucmVtb3ZlKSkge1xuICAgICAgY2IoZWxlbWVudCwgZG9uZSlcbiAgICB9IGVsc2Uge1xuICAgICAgZG9uZSgpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGF0Y2gocGFyZW50LCBlbGVtZW50LCBvbGROb2RlLCBub2RlLCBpc1NWRywgbmV4dFNpYmxpbmcpIHtcbiAgICBpZiAobm9kZSA9PT0gb2xkTm9kZSkge1xuICAgIH0gZWxzZSBpZiAob2xkTm9kZSA9PSBudWxsKSB7XG4gICAgICBlbGVtZW50ID0gcGFyZW50Lmluc2VydEJlZm9yZShjcmVhdGVFbGVtZW50KG5vZGUsIGlzU1ZHKSwgZWxlbWVudClcbiAgICB9IGVsc2UgaWYgKG5vZGUubmFtZSAmJiBub2RlLm5hbWUgPT09IG9sZE5vZGUubmFtZSkge1xuICAgICAgdXBkYXRlRWxlbWVudChcbiAgICAgICAgZWxlbWVudCxcbiAgICAgICAgb2xkTm9kZS5wcm9wcyxcbiAgICAgICAgbm9kZS5wcm9wcyxcbiAgICAgICAgKGlzU1ZHID0gaXNTVkcgfHwgbm9kZS5uYW1lID09PSBcInN2Z1wiKVxuICAgICAgKVxuXG4gICAgICB2YXIgb2xkRWxlbWVudHMgPSBbXVxuICAgICAgdmFyIG9sZEtleWVkID0ge31cbiAgICAgIHZhciBuZXdLZXllZCA9IHt9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2xkTm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBvbGRFbGVtZW50c1tpXSA9IGVsZW1lbnQuY2hpbGROb2Rlc1tpXVxuXG4gICAgICAgIHZhciBvbGRDaGlsZCA9IG9sZE5vZGUuY2hpbGRyZW5baV1cbiAgICAgICAgdmFyIG9sZEtleSA9IGdldEtleShvbGRDaGlsZClcblxuICAgICAgICBpZiAobnVsbCAhPSBvbGRLZXkpIHtcbiAgICAgICAgICBvbGRLZXllZFtvbGRLZXldID0gW29sZEVsZW1lbnRzW2ldLCBvbGRDaGlsZF1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgaSA9IDBcbiAgICAgIHZhciBqID0gMFxuXG4gICAgICB3aGlsZSAoaiA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgIHZhciBvbGRDaGlsZCA9IG9sZE5vZGUuY2hpbGRyZW5baV1cbiAgICAgICAgdmFyIG5ld0NoaWxkID0gbm9kZS5jaGlsZHJlbltqXVxuXG4gICAgICAgIHZhciBvbGRLZXkgPSBnZXRLZXkob2xkQ2hpbGQpXG4gICAgICAgIHZhciBuZXdLZXkgPSBnZXRLZXkobmV3Q2hpbGQpXG5cbiAgICAgICAgaWYgKG5ld0tleWVkW29sZEtleV0pIHtcbiAgICAgICAgICBpKytcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld0tleSA9PSBudWxsKSB7XG4gICAgICAgICAgaWYgKG9sZEtleSA9PSBudWxsKSB7XG4gICAgICAgICAgICBwYXRjaChlbGVtZW50LCBvbGRFbGVtZW50c1tpXSwgb2xkQ2hpbGQsIG5ld0NoaWxkLCBpc1NWRylcbiAgICAgICAgICAgIGorK1xuICAgICAgICAgIH1cbiAgICAgICAgICBpKytcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgcmVjeWxlZE5vZGUgPSBvbGRLZXllZFtuZXdLZXldIHx8IFtdXG5cbiAgICAgICAgICBpZiAob2xkS2V5ID09PSBuZXdLZXkpIHtcbiAgICAgICAgICAgIHBhdGNoKGVsZW1lbnQsIHJlY3lsZWROb2RlWzBdLCByZWN5bGVkTm9kZVsxXSwgbmV3Q2hpbGQsIGlzU1ZHKVxuICAgICAgICAgICAgaSsrXG4gICAgICAgICAgfSBlbHNlIGlmIChyZWN5bGVkTm9kZVswXSkge1xuICAgICAgICAgICAgcGF0Y2goXG4gICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgIGVsZW1lbnQuaW5zZXJ0QmVmb3JlKHJlY3lsZWROb2RlWzBdLCBvbGRFbGVtZW50c1tpXSksXG4gICAgICAgICAgICAgIHJlY3lsZWROb2RlWzFdLFxuICAgICAgICAgICAgICBuZXdDaGlsZCxcbiAgICAgICAgICAgICAgaXNTVkdcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGF0Y2goZWxlbWVudCwgb2xkRWxlbWVudHNbaV0sIG51bGwsIG5ld0NoaWxkLCBpc1NWRylcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBqKytcbiAgICAgICAgICBuZXdLZXllZFtuZXdLZXldID0gbmV3Q2hpbGRcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB3aGlsZSAoaSA8IG9sZE5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgIHZhciBvbGRDaGlsZCA9IG9sZE5vZGUuY2hpbGRyZW5baV1cbiAgICAgICAgaWYgKGdldEtleShvbGRDaGlsZCkgPT0gbnVsbCkge1xuICAgICAgICAgIHJlbW92ZUVsZW1lbnQoZWxlbWVudCwgb2xkRWxlbWVudHNbaV0sIG9sZENoaWxkKVxuICAgICAgICB9XG4gICAgICAgIGkrK1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpIGluIG9sZEtleWVkKSB7XG4gICAgICAgIGlmICghbmV3S2V5ZWRbb2xkS2V5ZWRbaV1bMV0ucHJvcHMua2V5XSkge1xuICAgICAgICAgIHJlbW92ZUVsZW1lbnQoZWxlbWVudCwgb2xkS2V5ZWRbaV1bMF0sIG9sZEtleWVkW2ldWzFdKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2RlLm5hbWUgPT09IG9sZE5vZGUubmFtZSkge1xuICAgICAgZWxlbWVudC5ub2RlVmFsdWUgPSBub2RlXG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQgPSBwYXJlbnQuaW5zZXJ0QmVmb3JlKFxuICAgICAgICBjcmVhdGVFbGVtZW50KG5vZGUsIGlzU1ZHKSxcbiAgICAgICAgKG5leHRTaWJsaW5nID0gZWxlbWVudClcbiAgICAgIClcbiAgICAgIHJlbW92ZUVsZW1lbnQocGFyZW50LCBuZXh0U2libGluZywgb2xkTm9kZSlcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnRcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL2h5cGVyYXBwL3NyYy9pbmRleC5qcyIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1c2VTb3VyY2VNYXApIHtcblx0dmFyIGxpc3QgPSBbXTtcblxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXHRcdFx0aWYoaXRlbVsyXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBjb250ZW50ICsgXCJ9XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY29udGVudDtcblx0XHRcdH1cblx0XHR9KS5qb2luKFwiXCIpO1xuXHR9O1xuXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG5cdFx0fVxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0cmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7XG5cdHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblx0aWYgKCFjc3NNYXBwaW5nKSB7XG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cblxuXHRpZiAodXNlU291cmNlTWFwICYmIHR5cGVvZiBidG9hID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0dmFyIHNvdXJjZU1hcHBpbmcgPSB0b0NvbW1lbnQoY3NzTWFwcGluZyk7XG5cdFx0dmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcblx0XHRcdHJldHVybiAnLyojIHNvdXJjZVVSTD0nICsgY3NzTWFwcGluZy5zb3VyY2VSb290ICsgc291cmNlICsgJyAqLydcblx0XHR9KTtcblxuXHRcdHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oJ1xcbicpO1xuXHR9XG5cblx0cmV0dXJuIFtjb250ZW50XS5qb2luKCdcXG4nKTtcbn1cblxuLy8gQWRhcHRlZCBmcm9tIGNvbnZlcnQtc291cmNlLW1hcCAoTUlUKVxuZnVuY3Rpb24gdG9Db21tZW50KHNvdXJjZU1hcCkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcblx0dmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSk7XG5cdHZhciBkYXRhID0gJ3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCcgKyBiYXNlNjQ7XG5cblx0cmV0dXJuICcvKiMgJyArIGRhdGEgKyAnICovJztcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5cbnZhciBzdHlsZXNJbkRvbSA9IHt9O1xuXG52YXJcdG1lbW9pemUgPSBmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW87XG5cblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdHJldHVybiBtZW1vO1xuXHR9O1xufTtcblxudmFyIGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcblx0Ly8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3Ncblx0Ly8gQHNlZSBodHRwOi8vYnJvd3NlcmhhY2tzLmNvbS8jaGFjay1lNzFkODY5MmY2NTMzNDE3M2ZlZTcxNWMyMjJjYjgwNVxuXHQvLyBUZXN0cyBmb3IgZXhpc3RlbmNlIG9mIHN0YW5kYXJkIGdsb2JhbHMgaXMgdG8gYWxsb3cgc3R5bGUtbG9hZGVyXG5cdC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuXHQvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcblx0cmV0dXJuIHdpbmRvdyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5hbGwgJiYgIXdpbmRvdy5hdG9iO1xufSk7XG5cbnZhciBnZXRUYXJnZXQgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG59O1xuXG52YXIgZ2V0RWxlbWVudCA9IChmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW8gPSB7fTtcblxuXHRyZXR1cm4gZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgcGFzc2luZyBmdW5jdGlvbiBpbiBvcHRpb25zLCB0aGVuIHVzZSBpdCBmb3IgcmVzb2x2ZSBcImhlYWRcIiBlbGVtZW50LlxuICAgICAgICAgICAgICAgIC8vIFVzZWZ1bCBmb3IgU2hhZG93IFJvb3Qgc3R5bGUgaS5lXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgaW5zZXJ0SW50bzogZnVuY3Rpb24gKCkgeyByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNmb29cIikuc2hhZG93Um9vdCB9XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHR2YXIgc3R5bGVUYXJnZXQgPSBnZXRUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xuXHRcdFx0Ly8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblx0XHRcdGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHQvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuXHRcdFx0XHRcdC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG5cdFx0XHRcdFx0c3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcblx0XHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdFx0c3R5bGVUYXJnZXQgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcblx0XHR9XG5cdFx0cmV0dXJuIG1lbW9bdGFyZ2V0XVxuXHR9O1xufSkoKTtcblxudmFyIHNpbmdsZXRvbiA9IG51bGw7XG52YXJcdHNpbmdsZXRvbkNvdW50ZXIgPSAwO1xudmFyXHRzdHlsZXNJbnNlcnRlZEF0VG9wID0gW107XG5cbnZhclx0Zml4VXJscyA9IHJlcXVpcmUoXCIuL3VybHNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuXHRpZiAodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0b3B0aW9ucy5hdHRycyA9IHR5cGVvZiBvcHRpb25zLmF0dHJzID09PSBcIm9iamVjdFwiID8gb3B0aW9ucy5hdHRycyA6IHt9O1xuXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cdGlmICghb3B0aW9ucy5zaW5nbGV0b24gJiYgdHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uICE9PSBcImJvb2xlYW5cIikgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgPGhlYWQ+IGVsZW1lbnRcbiAgICAgICAgaWYgKCFvcHRpb25zLmluc2VydEludG8pIG9wdGlvbnMuaW5zZXJ0SW50byA9IFwiaGVhZFwiO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIGJvdHRvbSBvZiB0aGUgdGFyZ2V0XG5cdGlmICghb3B0aW9ucy5pbnNlcnRBdCkgb3B0aW9ucy5pbnNlcnRBdCA9IFwiYm90dG9tXCI7XG5cblx0dmFyIHN0eWxlcyA9IGxpc3RUb1N0eWxlcyhsaXN0LCBvcHRpb25zKTtcblxuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUgKG5ld0xpc3QpIHtcblx0XHR2YXIgbWF5UmVtb3ZlID0gW107XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xuXHRcdH1cblxuXHRcdGlmKG5ld0xpc3QpIHtcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCwgb3B0aW9ucyk7XG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XG5cblx0XHRcdGlmKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykgZG9tU3R5bGUucGFydHNbal0oKTtcblxuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG5cbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tIChzdHlsZXMsIG9wdGlvbnMpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdGlmKGRvbVN0eWxlKSB7XG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyAobGlzdCwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVzID0gW107XG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XG5cdFx0dmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XG5cblx0XHRpZighbmV3U3R5bGVzW2lkXSkgc3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcblx0XHRlbHNlIG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcblx0fVxuXG5cdHJldHVybiBzdHlsZXM7XG59XG5cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudCAob3B0aW9ucywgc3R5bGUpIHtcblx0dmFyIHRhcmdldCA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvKVxuXG5cdGlmICghdGFyZ2V0KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnRJbnRvJyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG5cdH1cblxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZXNJbnNlcnRlZEF0VG9wW3N0eWxlc0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XG5cblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcblx0XHRpZiAoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XG5cdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCB0YXJnZXQuZmlyc3RDaGlsZCk7XG5cdFx0fSBlbHNlIGlmIChsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHRcdH1cblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGUpO1xuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcblx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcIm9iamVjdFwiICYmIG9wdGlvbnMuaW5zZXJ0QXQuYmVmb3JlKSB7XG5cdFx0dmFyIG5leHRTaWJsaW5nID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8gKyBcIiBcIiArIG9wdGlvbnMuaW5zZXJ0QXQuYmVmb3JlKTtcblx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBuZXh0U2libGluZyk7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiW1N0eWxlIExvYWRlcl1cXG5cXG4gSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcgKCdvcHRpb25zLmluc2VydEF0JykgZm91bmQuXFxuIE11c3QgYmUgJ3RvcCcsICdib3R0b20nLCBvciBPYmplY3QuXFxuIChodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlciNpbnNlcnRhdClcXG5cIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50IChzdHlsZSkge1xuXHRpZiAoc3R5bGUucGFyZW50Tm9kZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRzdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlKTtcblxuXHR2YXIgaWR4ID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlKTtcblx0aWYoaWR4ID49IDApIHtcblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXG5cdGFkZEF0dHJzKHN0eWxlLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlKTtcblxuXHRyZXR1cm4gc3R5bGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHRvcHRpb25zLmF0dHJzLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuXG5cdGFkZEF0dHJzKGxpbmssIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGluayk7XG5cblx0cmV0dXJuIGxpbms7XG59XG5cbmZ1bmN0aW9uIGFkZEF0dHJzIChlbCwgYXR0cnMpIHtcblx0T2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdGVsLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUgKG9iaiwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGUsIHVwZGF0ZSwgcmVtb3ZlLCByZXN1bHQ7XG5cblx0Ly8gSWYgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gd2FzIGRlZmluZWQsIHJ1biBpdCBvbiB0aGUgY3NzXG5cdGlmIChvcHRpb25zLnRyYW5zZm9ybSAmJiBvYmouY3NzKSB7XG5cdCAgICByZXN1bHQgPSBvcHRpb25zLnRyYW5zZm9ybShvYmouY3NzKTtcblxuXHQgICAgaWYgKHJlc3VsdCkge1xuXHQgICAgXHQvLyBJZiB0cmFuc2Zvcm0gcmV0dXJucyBhIHZhbHVlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIHJ1bm5pbmcgcnVudGltZSB0cmFuc2Zvcm1hdGlvbnMgb24gdGhlIGNzcy5cblx0ICAgIFx0b2JqLmNzcyA9IHJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICBcdC8vIElmIHRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gcmV0dXJucyBhIGZhbHN5IHZhbHVlLCBkb24ndCBhZGQgdGhpcyBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIGNvbmRpdGlvbmFsIGxvYWRpbmcgb2YgY3NzXG5cdCAgICBcdHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIFx0XHQvLyBub29wXG5cdCAgICBcdH07XG5cdCAgICB9XG5cdH1cblxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcblxuXHRcdHN0eWxlID0gc2luZ2xldG9uIHx8IChzaW5nbGV0b24gPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuXG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCBmYWxzZSk7XG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCB0cnVlKTtcblxuXHR9IGVsc2UgaWYgKFxuXHRcdG9iai5zb3VyY2VNYXAgJiZcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiXG5cdCkge1xuXHRcdHN0eWxlID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlLCBvcHRpb25zKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXG5cdFx0XHRpZihzdHlsZS5ocmVmKSBVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlLmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXHRcdH07XG5cdH1cblxuXHR1cGRhdGUob2JqKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUgKG5ld09iaikge1xuXHRcdGlmIChuZXdPYmopIHtcblx0XHRcdGlmIChcblx0XHRcdFx0bmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJlxuXHRcdFx0XHRuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJlxuXHRcdFx0XHRuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcblx0fTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcgKHN0eWxlLCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xuXG5cdGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGUuY2hpbGROb2RlcztcblxuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGUucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRzdHlsZS5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZS5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyAoc3R5bGUsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXG5cdGlmKG1lZGlhKSB7XG5cdFx0c3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXG5cdH1cblxuXHRpZihzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlLmZpcnN0Q2hpbGQpIHtcblx0XHRcdHN0eWxlLnJlbW92ZUNoaWxkKHN0eWxlLmZpcnN0Q2hpbGQpO1xuXHRcdH1cblxuXHRcdHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsgKGxpbmssIG9wdGlvbnMsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0Lypcblx0XHRJZiBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgaXNuJ3QgZGVmaW5lZCwgYnV0IHNvdXJjZW1hcHMgYXJlIGVuYWJsZWRcblx0XHRhbmQgdGhlcmUgaXMgbm8gcHVibGljUGF0aCBkZWZpbmVkIHRoZW4gbGV0cyB0dXJuIGNvbnZlcnRUb0Fic29sdXRlVXJsc1xuXHRcdG9uIGJ5IGRlZmF1bHQuICBPdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgY29udmVydFRvQWJzb2x1dGVVcmxzIG9wdGlvblxuXHRcdGRpcmVjdGx5XG5cdCovXG5cdHZhciBhdXRvRml4VXJscyA9IG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzID09PSB1bmRlZmluZWQgJiYgc291cmNlTWFwO1xuXG5cdGlmIChvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyB8fCBhdXRvRml4VXJscykge1xuXHRcdGNzcyA9IGZpeFVybHMoY3NzKTtcblx0fVxuXG5cdGlmIChzb3VyY2VNYXApIHtcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcblx0fVxuXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xuXG5cdHZhciBvbGRTcmMgPSBsaW5rLmhyZWY7XG5cblx0bGluay5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuXHRpZihvbGRTcmMpIFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IGFwcCB9IGZyb20gJ2h5cGVyYXBwJ1xuaW1wb3J0IGFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJ1xuaW1wb3J0IHN0YXRlIGZyb20gJy4vc3RhdGUnXG5pbXBvcnQgdmlldyBmcm9tICcuL2NvbXBvbmVudHMnXG5pbXBvcnQgJ25vcm1hbGl6ZS5jc3MnXG5cbmV4cG9ydCBjb25zdCBtYWluID0gYXBwKFxuICBzdGF0ZSxcbiAgYWN0aW9ucyxcbiAgdmlldyxcbiAgZG9jdW1lbnQuYm9keVxuKVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiZXhwb3J0IGRlZmF1bHQge1xuICBwbHVzOiAoKSA9PiAoe2NvdW50fSkgPT4gKHtjb3VudDogY291bnQgKyAxfSksXG4gIG1pbnVzOiAoKSA9PiAoe2NvdW50fSkgPT4gKHtjb3VudDogY291bnQgLSAxfSlcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hY3Rpb25zL2luZGV4LmpzIiwiZXhwb3J0IGRlZmF1bHQge1xuICBjb3VudDogMFxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3N0YXRlL2luZGV4LmpzIiwiaW1wb3J0IHsgaCB9IGZyb20gJ2h5cGVyYXBwJ1xuaW1wb3J0IHMgZnJvbSAnLi9pbmRleC5zdHlsJ1xuXG5leHBvcnQgZGVmYXVsdCAoc3RhdGUsIGFjdGlvbnMpID0+XG4gIDxkaXYgY2xhc3M9e3MubWFpbn0+XG4gICAgPGgxPmh5cGVyYXBwLWJvaWxlcnBsYXRlPC9oMT5cbiAgICA8cD5oeXBlcmFwcC1ib2lsZXJwbGF0ZSBpcyBhIGJvaWxlcnBsYXRlIGZvciBxdWlja3N0YXJ0aW5nIGEgd2ViIGFwcGxpY2F0aW9uIHdpdGggSHlwZXJhcHAsIEpTWCwgU3R5bHVzLCBQdWcsIEVzbGludC48L3A+XG4gICAgPHA+e3N0YXRlLmNvdW50fTwvcD5cbiAgICA8YnV0dG9uIG9uY2xpY2s9e2FjdGlvbnMucGx1c30+KzwvYnV0dG9uPlxuICAgIDxidXR0b24gb25jbGljaz17YWN0aW9ucy5taW51c30+LTwvYnV0dG9uPlxuICA8L2Rpdj5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb25lbnRzL2luZGV4LmpzIiwiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bHVzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTIhLi9pbmRleC5zdHlsXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJzb3VyY2VNYXBcIjp0cnVlLFwiaG1yXCI6dHJ1ZX1cblxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbm9wdGlvbnMuaW5zZXJ0SW50byA9IHVuZGVmaW5lZDtcblxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscztcblxuaWYobW9kdWxlLmhvdCkge1xuXHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsdXMtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMiEuL2luZGV4LnN0eWxcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWx1cy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0yIS4vaW5kZXguc3R5bFwiKTtcblxuXHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXG5cdFx0dmFyIGxvY2FscyA9IChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHR2YXIga2V5LCBpZHggPSAwO1xuXG5cdFx0XHRmb3Ioa2V5IGluIGEpIHtcblx0XHRcdFx0aWYoIWIgfHwgYVtrZXldICE9PSBiW2tleV0pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWR4Kys7XG5cdFx0XHR9XG5cblx0XHRcdGZvcihrZXkgaW4gYikgaWR4LS07XG5cblx0XHRcdHJldHVybiBpZHggPT09IDA7XG5cdFx0fShjb250ZW50LmxvY2FscywgbmV3Q29udGVudC5sb2NhbHMpKTtcblxuXHRcdGlmKCFsb2NhbHMpIHRocm93IG5ldyBFcnJvcignQWJvcnRpbmcgQ1NTIEhNUiBkdWUgdG8gY2hhbmdlZCBjc3MtbW9kdWxlcyBsb2NhbHMuJyk7XG5cblx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdH0pO1xuXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvaW5kZXguc3R5bFxuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLl8yOXl1cmtmZDZyeG5rcWp5eHY0czZnNW16ZHlnMjdicDhwamEzcnB2a2d2NXB4NTl5Z2JzYnc5NTVtOTFidTE1NmZldWczY2s3ZXF6dWdrejhyZDc0NzhrOGEzbWJhcnBmN3F6dmNrLWluZGV4LW1haW4ge1xcbiAgY29sb3I6ICM5MzkzOTU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMmUzMjM1O1xcbiAgaGVpZ2h0OiAxMDB2aDtcXG59XFxuLl8yOXl1cmtmZDZyeG5rcWp5eHY0czZnNW16ZHlnMjdicDhwamEzcnB2a2d2NXB4NTl5Z2JzYnc5NTVtOTFidTE1NmZldWczY2s3ZXF6dWdrejhyZDc0NzhrOGEzbWJhcnBmN3F6dmNrLWluZGV4LW1haW4gaDEge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZy1sZWZ0OiAxMHB4O1xcbiAgcGFkZGluZy10b3A6IDMwcHg7XFxufVxcbi5fMjl5dXJrZmQ2cnhua3FqeXh2NHM2ZzVtemR5ZzI3YnA4cGphM3JwdmtndjVweDU5eWdic2J3OTU1bTkxYnUxNTZmZXVnM2NrN2VxenVna3o4cmQ3NDc4azhhM21iYXJwZjdxenZjay1pbmRleC1tYWluIHAge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZy1sZWZ0OiAxMHB4O1xcbiAgcGFkZGluZy10b3A6IDIwcHg7XFxufVxcbi5fMjl5dXJrZmQ2cnhua3FqeXh2NHM2ZzVtemR5ZzI3YnA4cGphM3JwdmtndjVweDU5eWdic2J3OTU1bTkxYnUxNTZmZXVnM2NrN2VxenVna3o4cmQ3NDc4azhhM21iYXJwZjdxenZjay1pbmRleC1tYWluIGJ1dHRvbiB7XFxuICBmb250LXNpemU6IDI1cHg7XFxuICBvdXRsaW5lOiBub25lO1xcbiAgY29sb3I6ICM5MzkzOTU7XFxuICBib3JkZXI6IG5vbmU7XFxuICBib3JkZXItcmFkaXVzOiAwLjFlbTtcXG4gIHdpZHRoOiA4MHB4O1xcbiAgaGVpZ2h0OiA2MHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzQxNDc0YjtcXG4gIG1hcmdpbjogNXB4O1xcbn1cXG4uXzI5eXVya2ZkNnJ4bmtxanl4djRzNmc1bXpkeWcyN2JwOHBqYTNycHZrZ3Y1cHg1OXlnYnNidzk1NW05MWJ1MTU2ZmV1ZzNjazdlcXp1Z2t6OHJkNzQ3OGs4YTNtYmFycGY3cXp2Y2staW5kZXgtbWFpbiBidXR0b246aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzM4M2M0MDtcXG59XFxuLl8yOXl1cmtmZDZyeG5rcWp5eHY0czZnNW16ZHlnMjdicDhwamEzcnB2a2d2NXB4NTl5Z2JzYnc5NTVtOTFidTE1NmZldWczY2s3ZXF6dWdrejhyZDc0NzhrOGEzbWJhcnBmN3F6dmNrLWluZGV4LW1haW4gYnV0dG9uOmFjdGl2ZSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzIzNjM5O1xcbn1cXG4vKiMgc291cmNlTWFwcGluZ1VSTD1zcmMvY29tcG9uZW50cy9pbmRleC5jc3MubWFwICovXCIsIFwiXCIsIHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIi9Vc2Vycy9zdXp1a2kvLmdocS9naXRodWIuY29tL3Nvc3VrZXN1enVraS9oeXBlcmFwcC1vbmUvc3JjL2NvbXBvbmVudHMvc3JjL2NvbXBvbmVudHMvaW5kZXguc3R5bFwiLFwiL1VzZXJzL3N1enVraS8uZ2hxL2dpdGh1Yi5jb20vc29zdWtlc3V6dWtpL2h5cGVyYXBwLW9uZS9zcmMvY29tcG9uZW50cy9pbmRleC5zdHlsXCIsXCIvVXNlcnMvc3V6dWtpLy5naHEvZ2l0aHViLmNvbS9zb3N1a2VzdXp1a2kvaHlwZXJhcHAtb25lL3NyYy9jb21wb25lbnRzL25vZGVfbW9kdWxlcy9uaWIvbGliL25pYi9ib3JkZXIuc3R5bFwiLFwiL1VzZXJzL3N1enVraS8uZ2hxL2dpdGh1Yi5jb20vc29zdWtlc3V6dWtpL2h5cGVyYXBwLW9uZS9zcmMvY29tcG9uZW50cy9ub2RlX21vZHVsZXMvbmliL2xpYi9uaWIvYm9yZGVyLXJhZGl1cy5zdHlsXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsZUFBQTtFQUNBLDBCQUFBO0VBQ0EsY0FBQTtDQ0NEO0FEQUM7RUFDRSxVQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtDQ0VIO0FEREM7RUFDRSxVQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtDQ0dIO0FERkM7RUFDRSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxlQUFBO0VFTkEsYUFBQTtFQzJDRixxQkFBQTtFSGxDRSxZQUFBO0VBQ0EsYUFBQTtFQUNBLDBCQUFBO0VBQ0EsWUFBQTtDQ0lIO0FESEc7RUFDRSwwQkFBQTtDQ0tMO0FESkc7RUFDRSwwQkFBQTtDQ01MO0FBQ0Qsb0RBQW9EXCIsXCJmaWxlXCI6XCJpbmRleC5zdHlsXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi5tYWluXFxuICBjb2xvciAkdGV4dC1jb2xvclxcbiAgYmFja2dyb3VuZC1jb2xvciAkYmFja2dyb3VuZC1jb2xvclxcbiAgaGVpZ2h0IDEwMHZoXFxuICBoMVxcbiAgICBtYXJnaW4gMFxcbiAgICBwYWRkaW5nLWxlZnQgMTBweFxcbiAgICBwYWRkaW5nLXRvcCAzMHB4XFxuICBwXFxuICAgIG1hcmdpbiAwXFxuICAgIHBhZGRpbmctbGVmdCAxMHB4XFxuICAgIHBhZGRpbmctdG9wIDIwcHhcXG4gIGJ1dHRvblxcbiAgICBmb250LXNpemUgMjVweFxcbiAgICBvdXRsaW5lIG5vbmVcXG4gICAgY29sb3IgJHRleHQtY29sb3JcXG4gICAgYm9yZGVyIG5vbmVcXG4gICAgYm9yZGVyLXJhZGl1cyAwLjFlbVxcbiAgICB3aWR0aCA4MHB4XFxuICAgIGhlaWdodCA2MHB4XFxuICAgIGJhY2tncm91bmQtY29sb3IgbGlnaHRlbigkYmFja2dyb3VuZC1jb2xvciwgMTAlKVxcbiAgICBtYXJnaW4gNXB4XFxuICAgICY6aG92ZXJcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yIGxpZ2h0ZW4oJGJhY2tncm91bmQtY29sb3IsIDUlKVxcbiAgICAmOmFjdGl2ZVxcbiAgICAgIGJhY2tncm91bmQtY29sb3IgbGlnaHRlbigkYmFja2dyb3VuZC1jb2xvciwgMiUpXFxuXFxuXCIsXCIubWFpbiB7XFxuICBjb2xvcjogIzkzOTM5NTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMyZTMyMzU7XFxuICBoZWlnaHQ6IDEwMHZoO1xcbn1cXG4ubWFpbiBoMSB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nLWxlZnQ6IDEwcHg7XFxuICBwYWRkaW5nLXRvcDogMzBweDtcXG59XFxuLm1haW4gcCB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nLWxlZnQ6IDEwcHg7XFxuICBwYWRkaW5nLXRvcDogMjBweDtcXG59XFxuLm1haW4gYnV0dG9uIHtcXG4gIGZvbnQtc2l6ZTogMjVweDtcXG4gIG91dGxpbmU6IG5vbmU7XFxuICBjb2xvcjogIzkzOTM5NTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIGJvcmRlci1yYWRpdXM6IDAuMWVtO1xcbiAgd2lkdGg6IDgwcHg7XFxuICBoZWlnaHQ6IDYwcHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNDE0NzRiO1xcbiAgbWFyZ2luOiA1cHg7XFxufVxcbi5tYWluIGJ1dHRvbjpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzgzYzQwO1xcbn1cXG4ubWFpbiBidXR0b246YWN0aXZlIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMjM2Mzk7XFxufVxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPXNyYy9jb21wb25lbnRzL2luZGV4LmNzcy5tYXAgKi9cIixcIi8qXFxuICogYm9yZGVyOiA8Y29sb3I+XFxuICogYm9yZGVyOiAuLi5cXG4gKi9cXG5cXG5ib3JkZXIoY29sb3IsIGFyZ3MuLi4pXFxuICBpZiBjb2xvciBpcyBhICdjb2xvcidcXG4gICAgYm9yZGVyOiAxcHggc29saWQgY29sb3IgYXJnc1xcbiAgZWxzZVxcbiAgICBib3JkZXI6IGFyZ3VtZW50c1xcblwiLFwiLypcXG4gKiBIZWxwZXIgZm9yIGJvcmRlci1yYWRpdXMoKS5cXG4gKi9cXG5cXG4tYXBwbHktYm9yZGVyLXJhZGl1cyhwb3MsIGltcG9ydGFuY2UpXFxuICBpZiBsZW5ndGgocG9zKSA9PSAzXFxuICAgIC8vIGJvcmRlci1yYWRpdXM6IDx0b3AgfCBib3R0b20+IDxsZWZ0IHwgcmlnaHQ+IDxuPlxcbiAgICB5ID0gcG9zWzBdXFxuICAgIHggPSBwb3NbMV1cXG4gICAgLy8gV2UgZG9uJ3QgdXNlIHZlbmRvciBmb3IgYm9kZXItcmFkaXVzIGFueW1vcmVcXG4gICAgLy8gdmVuZG9yKCdib3JkZXItcmFkaXVzLSVzJXMnICUgcG9zLCBwb3NbMl0sIG9ubHk6IHdlYmtpdCBvZmZpY2lhbClcXG4gICAgeydib3JkZXItJXMtJXMtcmFkaXVzJyAlIHBvc306IHBvc1syXSBpbXBvcnRhbmNlXFxuICBlbHNlIGlmIHBvc1swXSBpbiAodG9wIGJvdHRvbSlcXG4gICAgLy8gYm9yZGVyLXJhZGl1czogPHRvcCB8IGJvdHRvbT4gPG4+XFxuICAgIC1hcHBseS1ib3JkZXItcmFkaXVzKHBvc1swXSBsZWZ0IHBvc1sxXSwgaW1wb3J0YW5jZSlcXG4gICAgLWFwcGx5LWJvcmRlci1yYWRpdXMocG9zWzBdIHJpZ2h0IHBvc1sxXSwgaW1wb3J0YW5jZSlcXG4gIGVsc2UgaWYgcG9zWzBdIGluIChsZWZ0IHJpZ2h0KVxcbiAgICAvLyBib3JkZXItcmFkaXVzOiA8bGVmdCB8IHJpZ2h0PiA8bj5cXG4gICAgdW5zaGlmdChwb3MsIHRvcCk7XFxuICAgIC1hcHBseS1ib3JkZXItcmFkaXVzKHBvcywgaW1wb3J0YW5jZSlcXG4gICAgcG9zWzBdID0gYm90dG9tXFxuICAgIC1hcHBseS1ib3JkZXItcmFkaXVzKHBvcywgaW1wb3J0YW5jZSlcXG5cXG4vKlxcbiAqIGJvcmRlci1yYWRpdXMgc3VwcG9ydGluZyBhdWdtZW50ZWQgYmVoYXZpb3IuXFxuICpcXG4gKiBFeGFtcGxlczpcXG4gKlxcbiAqICAgIGJvcmRlci1yYWRpdXM6IDJweCA1cHhcXG4gKiAgICBib3JkZXItcmFkaXVzOiB0b3AgNXB4IGJvdHRvbSAxMHB4XFxuICogICAgYm9yZGVyLXJhZGl1czogbGVmdCA1cHhcXG4gKiAgICBib3JkZXItcmFkaXVzOiB0b3AgbGVmdCA1cHhcXG4gKiAgICBib3JkZXItcmFkaXVzOiB0b3AgbGVmdCAxMHB4IGJvdHRvbSByaWdodCA1cHhcXG4gKiAgICBib3JkZXItcmFkaXVzOiB0b3AgbGVmdCAxMHB4LCBib3R0b20gcmlnaHQgNXB4XFxuICpcXG4gKi9cXG5cXG5ib3JkZXItcmFkaXVzKClcXG4gIHBvcyA9ICgpXFxuICBhdWdtZW50ZWQgPSBmYWxzZVxcbiAgaW1wb3J0YW5jZSA9IGFyZ3VtZW50c1tsZW5ndGgoYXJndW1lbnRzKSAtIDFdID09ICFpbXBvcnRhbnQgPyAhaW1wb3J0YW50IDogdW5xdW90ZSgnJylcXG5cXG4gIGZvciBhcmdzIGluIGFyZ3VtZW50c1xcbiAgICBmb3IgYXJnIGluIGFyZ3NcXG4gICAgICBpZiBhcmcgaXMgYSAnaWRlbnQnXFxuICAgICAgICBhcHBlbmQocG9zLCBhcmcpXFxuICAgICAgICBhdWdtZW50ZWQgPSB0cnVlXFxuICAgICAgZWxzZVxcbiAgICAgICAgYXBwZW5kKHBvcywgYXJnKVxcbiAgICAgICAgaWYgYXVnbWVudGVkXFxuICAgICAgICAgIC1hcHBseS1ib3JkZXItcmFkaXVzKHBvcywgaW1wb3J0YW5jZSlcXG4gICAgICAgICAgcG9zID0gKClcXG4gIGJvcmRlci1yYWRpdXMgcG9zIHVubGVzcyBhdWdtZW50ZWRcXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuLy8gZXhwb3J0c1xuZXhwb3J0cy5sb2NhbHMgPSB7XG5cdFwibWFpblwiOiBcIl8yOXl1cmtmZDZyeG5rcWp5eHY0czZnNW16ZHlnMjdicDhwamEzcnB2a2d2NXB4NTl5Z2JzYnc5NTVtOTFidTE1NmZldWczY2s3ZXF6dWdrejhyZDc0NzhrOGEzbWJhcnBmN3F6dmNrLWluZGV4LW1haW5cIlxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyP3tcImxvY2FsSWRlbnROYW1lXCI6XCJbc2hhNTEyOmhhc2g6YmFzZTMyXS1bbmFtZV0tW2xvY2FsXVwiLFwibW9kdWxlc1wiOnRydWUsXCJzb3VyY2VNYXBcIjp0cnVlfSEuL25vZGVfbW9kdWxlcy9zdHlsdXMtbG9hZGVyP3tcInNvdXJjZU1hcFwiOnRydWV9IS4vc3JjL2NvbXBvbmVudHMvaW5kZXguc3R5bFxuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcbi8qKlxuICogV2hlbiBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZCwgYHN0eWxlLWxvYWRlcmAgdXNlcyBhIGxpbmsgZWxlbWVudCB3aXRoIGEgZGF0YS11cmkgdG9cbiAqIGVtYmVkIHRoZSBjc3Mgb24gdGhlIHBhZ2UuIFRoaXMgYnJlYWtzIGFsbCByZWxhdGl2ZSB1cmxzIGJlY2F1c2Ugbm93IHRoZXkgYXJlIHJlbGF0aXZlIHRvIGFcbiAqIGJ1bmRsZSBpbnN0ZWFkIG9mIHRoZSBjdXJyZW50IHBhZ2UuXG4gKlxuICogT25lIHNvbHV0aW9uIGlzIHRvIG9ubHkgdXNlIGZ1bGwgdXJscywgYnV0IHRoYXQgbWF5IGJlIGltcG9zc2libGUuXG4gKlxuICogSW5zdGVhZCwgdGhpcyBmdW5jdGlvbiBcImZpeGVzXCIgdGhlIHJlbGF0aXZlIHVybHMgdG8gYmUgYWJzb2x1dGUgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHBhZ2UgbG9jYXRpb24uXG4gKlxuICogQSBydWRpbWVudGFyeSB0ZXN0IHN1aXRlIGlzIGxvY2F0ZWQgYXQgYHRlc3QvZml4VXJscy5qc2AgYW5kIGNhbiBiZSBydW4gdmlhIHRoZSBgbnBtIHRlc3RgIGNvbW1hbmQuXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzcykge1xuICAvLyBnZXQgY3VycmVudCBsb2NhdGlvblxuICB2YXIgbG9jYXRpb24gPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5sb2NhdGlvbjtcblxuICBpZiAoIWxvY2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZml4VXJscyByZXF1aXJlcyB3aW5kb3cubG9jYXRpb25cIik7XG4gIH1cblxuXHQvLyBibGFuayBvciBudWxsP1xuXHRpZiAoIWNzcyB8fCB0eXBlb2YgY3NzICE9PSBcInN0cmluZ1wiKSB7XG5cdCAgcmV0dXJuIGNzcztcbiAgfVxuXG4gIHZhciBiYXNlVXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyBsb2NhdGlvbi5ob3N0O1xuICB2YXIgY3VycmVudERpciA9IGJhc2VVcmwgKyBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sIFwiL1wiKTtcblxuXHQvLyBjb252ZXJ0IGVhY2ggdXJsKC4uLilcblx0Lypcblx0VGhpcyByZWd1bGFyIGV4cHJlc3Npb24gaXMganVzdCBhIHdheSB0byByZWN1cnNpdmVseSBtYXRjaCBicmFja2V0cyB3aXRoaW5cblx0YSBzdHJpbmcuXG5cblx0IC91cmxcXHMqXFwoICA9IE1hdGNoIG9uIHRoZSB3b3JkIFwidXJsXCIgd2l0aCBhbnkgd2hpdGVzcGFjZSBhZnRlciBpdCBhbmQgdGhlbiBhIHBhcmVuc1xuXHQgICAoICA9IFN0YXJ0IGEgY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgKD86ICA9IFN0YXJ0IGEgbm9uLWNhcHR1cmluZyBncm91cFxuXHQgICAgICAgICBbXikoXSAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKD86ICA9IFN0YXJ0IGFub3RoZXIgbm9uLWNhcHR1cmluZyBncm91cHNcblx0ICAgICAgICAgICAgICAgICBbXikoXSsgID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgICAgIFteKShdKiAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICBcXCkgID0gTWF0Y2ggYSBlbmQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICkgID0gRW5kIEdyb3VwXG4gICAgICAgICAgICAgICpcXCkgPSBNYXRjaCBhbnl0aGluZyBhbmQgdGhlbiBhIGNsb3NlIHBhcmVuc1xuICAgICAgICAgICkgID0gQ2xvc2Ugbm9uLWNhcHR1cmluZyBncm91cFxuICAgICAgICAgICogID0gTWF0Y2ggYW55dGhpbmdcbiAgICAgICApICA9IENsb3NlIGNhcHR1cmluZyBncm91cFxuXHQgXFwpICA9IE1hdGNoIGEgY2xvc2UgcGFyZW5zXG5cblx0IC9naSAgPSBHZXQgYWxsIG1hdGNoZXMsIG5vdCB0aGUgZmlyc3QuICBCZSBjYXNlIGluc2Vuc2l0aXZlLlxuXHQgKi9cblx0dmFyIGZpeGVkQ3NzID0gY3NzLnJlcGxhY2UoL3VybFxccypcXCgoKD86W14pKF18XFwoKD86W14pKF0rfFxcKFteKShdKlxcKSkqXFwpKSopXFwpL2dpLCBmdW5jdGlvbihmdWxsTWF0Y2gsIG9yaWdVcmwpIHtcblx0XHQvLyBzdHJpcCBxdW90ZXMgKGlmIHRoZXkgZXhpc3QpXG5cdFx0dmFyIHVucXVvdGVkT3JpZ1VybCA9IG9yaWdVcmxcblx0XHRcdC50cmltKClcblx0XHRcdC5yZXBsYWNlKC9eXCIoLiopXCIkLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pXG5cdFx0XHQucmVwbGFjZSgvXicoLiopJyQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSk7XG5cblx0XHQvLyBhbHJlYWR5IGEgZnVsbCB1cmw/IG5vIGNoYW5nZVxuXHRcdGlmICgvXigjfGRhdGE6fGh0dHA6XFwvXFwvfGh0dHBzOlxcL1xcL3xmaWxlOlxcL1xcL1xcLykvaS50ZXN0KHVucXVvdGVkT3JpZ1VybCkpIHtcblx0XHQgIHJldHVybiBmdWxsTWF0Y2g7XG5cdFx0fVxuXG5cdFx0Ly8gY29udmVydCB0aGUgdXJsIHRvIGEgZnVsbCB1cmxcblx0XHR2YXIgbmV3VXJsO1xuXG5cdFx0aWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiLy9cIikgPT09IDApIHtcblx0XHQgIFx0Ly9UT0RPOiBzaG91bGQgd2UgYWRkIHByb3RvY29sP1xuXHRcdFx0bmV3VXJsID0gdW5xdW90ZWRPcmlnVXJsO1xuXHRcdH0gZWxzZSBpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvXCIpID09PSAwKSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYmFzZSB1cmxcblx0XHRcdG5ld1VybCA9IGJhc2VVcmwgKyB1bnF1b3RlZE9yaWdVcmw7IC8vIGFscmVhZHkgc3RhcnRzIHdpdGggJy8nXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIGN1cnJlbnQgZGlyZWN0b3J5XG5cdFx0XHRuZXdVcmwgPSBjdXJyZW50RGlyICsgdW5xdW90ZWRPcmlnVXJsLnJlcGxhY2UoL15cXC5cXC8vLCBcIlwiKTsgLy8gU3RyaXAgbGVhZGluZyAnLi8nXG5cdFx0fVxuXG5cdFx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCB1cmwoLi4uKVxuXHRcdHJldHVybiBcInVybChcIiArIEpTT04uc3RyaW5naWZ5KG5ld1VybCkgKyBcIilcIjtcblx0fSk7XG5cblx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCBjc3Ncblx0cmV0dXJuIGZpeGVkQ3NzO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL3VybHMuanMiLCJcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vY3NzLWxvYWRlci9pbmRleC5qcyEuL25vcm1hbGl6ZS5jc3NcIik7XG5cbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuXG52YXIgdHJhbnNmb3JtO1xudmFyIGluc2VydEludG87XG5cblxuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG5vcHRpb25zLmluc2VydEludG8gPSB1bmRlZmluZWQ7XG5cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscztcblxuaWYobW9kdWxlLmhvdCkge1xuXHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vY3NzLWxvYWRlci9pbmRleC5qcyEuL25vcm1hbGl6ZS5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9jc3MtbG9hZGVyL2luZGV4LmpzIS4vbm9ybWFsaXplLmNzc1wiKTtcblxuXHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXG5cdFx0dmFyIGxvY2FscyA9IChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHR2YXIga2V5LCBpZHggPSAwO1xuXG5cdFx0XHRmb3Ioa2V5IGluIGEpIHtcblx0XHRcdFx0aWYoIWIgfHwgYVtrZXldICE9PSBiW2tleV0pIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWR4Kys7XG5cdFx0XHR9XG5cblx0XHRcdGZvcihrZXkgaW4gYikgaWR4LS07XG5cblx0XHRcdHJldHVybiBpZHggPT09IDA7XG5cdFx0fShjb250ZW50LmxvY2FscywgbmV3Q29udGVudC5sb2NhbHMpKTtcblxuXHRcdGlmKCFsb2NhbHMpIHRocm93IG5ldyBFcnJvcignQWJvcnRpbmcgQ1NTIEhNUiBkdWUgdG8gY2hhbmdlZCBjc3MtbW9kdWxlcyBsb2NhbHMuJyk7XG5cblx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdH0pO1xuXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL25vcm1hbGl6ZS5jc3Mvbm9ybWFsaXplLmNzc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKGZhbHNlKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi8qISBub3JtYWxpemUuY3NzIHY3LjAuMCB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cXG5cXG4vKiBEb2N1bWVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW5cXG4gKiAgICBJRSBvbiBXaW5kb3dzIFBob25lIGFuZCBpbiBpT1MuXFxuICovXFxuXFxuaHRtbCB7XFxuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcbiAgLW1zLXRleHQtc2l6ZS1hZGp1c3Q6IDEwMCU7IC8qIDIgKi9cXG4gIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xcbn1cXG5cXG4vKiBTZWN0aW9uc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzIChvcGluaW9uYXRlZCkuXFxuICovXFxuXFxuYm9keSB7XFxuICBtYXJnaW46IDA7XFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDktLlxcbiAqL1xcblxcbmFydGljbGUsXFxuYXNpZGUsXFxuZm9vdGVyLFxcbmhlYWRlcixcXG5uYXYsXFxuc2VjdGlvbiB7XFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuLyoqXFxuICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gYGgxYCBlbGVtZW50cyB3aXRoaW4gYHNlY3Rpb25gIGFuZFxcbiAqIGBhcnRpY2xlYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuaDEge1xcbiAgZm9udC1zaXplOiAyZW07XFxuICBtYXJnaW46IDAuNjdlbSAwO1xcbn1cXG5cXG4vKiBHcm91cGluZyBjb250ZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSA5LS5cXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRS5cXG4gKi9cXG5cXG5maWdjYXB0aW9uLFxcbmZpZ3VyZSxcXG5tYWluIHsgLyogMSAqL1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBtYXJnaW4gaW4gSUUgOC5cXG4gKi9cXG5cXG5maWd1cmUge1xcbiAgbWFyZ2luOiAxZW0gNDBweDtcXG59XFxuXFxuLyoqXFxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gRmlyZWZveC5cXG4gKiAyLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlIGFuZCBJRS5cXG4gKi9cXG5cXG5ociB7XFxuICBib3gtc2l6aW5nOiBjb250ZW50LWJveDsgLyogMSAqL1xcbiAgaGVpZ2h0OiAwOyAvKiAxICovXFxuICBvdmVyZmxvdzogdmlzaWJsZTsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5wcmUge1xcbiAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxuICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbn1cXG5cXG4vKiBUZXh0LWxldmVsIHNlbWFudGljc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxcbiAqIDIuIFJlbW92ZSBnYXBzIGluIGxpbmtzIHVuZGVybGluZSBpbiBpT1MgOCsgYW5kIFNhZmFyaSA4Ky5cXG4gKi9cXG5cXG5hIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50OyAvKiAxICovXFxuICAtd2Via2l0LXRleHQtZGVjb3JhdGlvbi1za2lwOiBvYmplY3RzOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIDEuIFJlbW92ZSB0aGUgYm90dG9tIGJvcmRlciBpbiBDaHJvbWUgNTctIGFuZCBGaXJlZm94IDM5LS5cXG4gKiAyLiBBZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgSUUsIE9wZXJhLCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmFiYnJbdGl0bGVdIHtcXG4gIGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyAvKiAyICovXFxuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogUHJldmVudCB0aGUgZHVwbGljYXRlIGFwcGxpY2F0aW9uIG9mIGBib2xkZXJgIGJ5IHRoZSBuZXh0IHJ1bGUgaW4gU2FmYXJpIDYuXFxuICovXFxuXFxuYixcXG5zdHJvbmcge1xcbiAgZm9udC13ZWlnaHQ6IGluaGVyaXQ7XFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYixcXG5zdHJvbmcge1xcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuY29kZSxcXG5rYmQsXFxuc2FtcCB7XFxuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG4gIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHN0eWxlIGluIEFuZHJvaWQgNC4zLS5cXG4gKi9cXG5cXG5kZm4ge1xcbiAgZm9udC1zdHlsZTogaXRhbGljO1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgYmFja2dyb3VuZCBhbmQgY29sb3IgaW4gSUUgOS0uXFxuICovXFxuXFxubWFyayB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwO1xcbiAgY29sb3I6ICMwMDA7XFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnNtYWxsIHtcXG4gIGZvbnQtc2l6ZTogODAlO1xcbn1cXG5cXG4vKipcXG4gKiBQcmV2ZW50IGBzdWJgIGFuZCBgc3VwYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cXG4gKiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuc3ViLFxcbnN1cCB7XFxuICBmb250LXNpemU6IDc1JTtcXG4gIGxpbmUtaGVpZ2h0OiAwO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG5cXG5zdWIge1xcbiAgYm90dG9tOiAtMC4yNWVtO1xcbn1cXG5cXG5zdXAge1xcbiAgdG9wOiAtMC41ZW07XFxufVxcblxcbi8qIEVtYmVkZGVkIGNvbnRlbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDktLlxcbiAqL1xcblxcbmF1ZGlvLFxcbnZpZGVvIHtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gaU9TIDQtNy5cXG4gKi9cXG5cXG5hdWRpbzpub3QoW2NvbnRyb2xzXSkge1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIGhlaWdodDogMDtcXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC0uXFxuICovXFxuXFxuaW1nIHtcXG4gIGJvcmRlci1zdHlsZTogbm9uZTtcXG59XFxuXFxuLyoqXFxuICogSGlkZSB0aGUgb3ZlcmZsb3cgaW4gSUUuXFxuICovXFxuXFxuc3ZnOm5vdCg6cm9vdCkge1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG59XFxuXFxuLyogRm9ybXNcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzIChvcGluaW9uYXRlZCkuXFxuICogMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmJ1dHRvbixcXG5pbnB1dCxcXG5vcHRncm91cCxcXG5zZWxlY3QsXFxudGV4dGFyZWEge1xcbiAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7IC8qIDEgKi9cXG4gIGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xcbiAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXG4gIG1hcmdpbjogMDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cXG4gKiAxLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlLlxcbiAqL1xcblxcbmJ1dHRvbixcXG5pbnB1dCB7IC8qIDEgKi9cXG4gIG92ZXJmbG93OiB2aXNpYmxlO1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cXG4gKiAxLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXFxuICovXFxuXFxuYnV0dG9uLFxcbnNlbGVjdCB7IC8qIDEgKi9cXG4gIHRleHQtdHJhbnNmb3JtOiBub25lO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBQcmV2ZW50IGEgV2ViS2l0IGJ1ZyB3aGVyZSAoMikgZGVzdHJveXMgbmF0aXZlIGBhdWRpb2AgYW5kIGB2aWRlb2BcXG4gKiAgICBjb250cm9scyBpbiBBbmRyb2lkIDQuXFxuICogMi4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5idXR0b24sXFxuaHRtbCBbdHlwZT1cXFwiYnV0dG9uXFxcIl0sIC8qIDEgKi9cXG5bdHlwZT1cXFwicmVzZXRcXFwiXSxcXG5bdHlwZT1cXFwic3VibWl0XFxcIl0ge1xcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5idXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcImJ1dHRvblxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJyZXNldFxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lciB7XFxuICBib3JkZXItc3R5bGU6IG5vbmU7XFxuICBwYWRkaW5nOiAwO1xcbn1cXG5cXG4vKipcXG4gKiBSZXN0b3JlIHRoZSBmb2N1cyBzdHlsZXMgdW5zZXQgYnkgdGhlIHByZXZpb3VzIHJ1bGUuXFxuICovXFxuXFxuYnV0dG9uOi1tb3otZm9jdXNyaW5nLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXTotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwicmVzZXRcXFwiXTotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwic3VibWl0XFxcIl06LW1vei1mb2N1c3Jpbmcge1xcbiAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXFxuICovXFxuXFxuZmllbGRzZXQge1xcbiAgcGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxcbiAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBJRS5cXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XFxuICogICAgYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxubGVnZW5kIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cXG4gIGNvbG9yOiBpbmhlcml0OyAvKiAyICovXFxuICBkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xcbiAgbWF4LXdpZHRoOiAxMDAlOyAvKiAxICovXFxuICBwYWRkaW5nOiAwOyAvKiAzICovXFxuICB3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXFxufVxcblxcbi8qKlxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDktLlxcbiAqIDIuIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXFxuICovXFxuXFxucHJvZ3Jlc3Mge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrOyAvKiAxICovXFxuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRS5cXG4gKi9cXG5cXG50ZXh0YXJlYSB7XFxuICBvdmVyZmxvdzogYXV0bztcXG59XFxuXFxuLyoqXFxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gSUUgMTAtLlxcbiAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC0uXFxuICovXFxuXFxuW3R5cGU9XFxcImNoZWNrYm94XFxcIl0sXFxuW3R5cGU9XFxcInJhZGlvXFxcIl0ge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xcbiAgcGFkZGluZzogMDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXFxuICovXFxuXFxuW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxcblt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XFxuICBoZWlnaHQ6IGF1dG87XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxcbiAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxcbiAqL1xcblxcblt0eXBlPVxcXCJzZWFyY2hcXFwiXSB7XFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IHRleHRmaWVsZDsgLyogMSAqL1xcbiAgb3V0bGluZS1vZmZzZXQ6IC0ycHg7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGFuZCBjYW5jZWwgYnV0dG9ucyBpbiBDaHJvbWUgYW5kIFNhZmFyaSBvbiBtYWNPUy5cXG4gKi9cXG5cXG5bdHlwZT1cXFwic2VhcmNoXFxcIl06Oi13ZWJraXQtc2VhcmNoLWNhbmNlbC1idXR0b24sXFxuW3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4gKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIGBpbmhlcml0YCBpbiBTYWZhcmkuXFxuICovXFxuXFxuOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xcbiAgZm9udDogaW5oZXJpdDsgLyogMiAqL1xcbn1cXG5cXG4vKiBJbnRlcmFjdGl2ZVxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLypcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSA5LS5cXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSwgYW5kIEZpcmVmb3guXFxuICovXFxuXFxuZGV0YWlscywgLyogMSAqL1xcbm1lbnUge1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcbi8qXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnN1bW1hcnkge1xcbiAgZGlzcGxheTogbGlzdC1pdGVtO1xcbn1cXG5cXG4vKiBTY3JpcHRpbmdcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDktLlxcbiAqL1xcblxcbmNhbnZhcyB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFLlxcbiAqL1xcblxcbnRlbXBsYXRlIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi8qIEhpZGRlblxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAtLlxcbiAqL1xcblxcbltoaWRkZW5dIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIhLi9ub2RlX21vZHVsZXMvbm9ybWFsaXplLmNzcy9ub3JtYWxpemUuY3NzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9