'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var dist = {};
var common$2 = {};
var hasRequiredCommon$2;
function requireCommon$2() {
  if (hasRequiredCommon$2) return common$2;
  hasRequiredCommon$2 = 1;
  Object.defineProperty(common$2, "__esModule", {
    value: true
  });
  common$2.ensure = ensure;
  function ensure(arg) {
    if (arg == null) {
      throw new Error("Did not expect an argument to be undefined");
    }
    return arg;
  }
  return common$2;
}
var common$1 = {};
var hasRequiredCommon$1;
function requireCommon$1() {
  if (hasRequiredCommon$1) return common$1;
  hasRequiredCommon$1 = 1;
  Object.defineProperty(common$1, "__esModule", {
    value: true
  });
  common$1.mergeNativeStyles = mergeNativeStyles;
  common$1.extractStyles = extractStyles;
  function mergeNativeStyles(defaultStyle, overrideStyles) {
    var styles = [defaultStyle].concat(_toConsumableArray(overrideStyles.filter(function (object) {
      return object !== undefined;
    })));
    return Object.keys(defaultStyle).reduce(function (flattened, currentKey) {
      var styleItems = styles.map(function (object) {
        return object[currentKey];
      });
      return Object.assign(Object.assign({}, flattened), _defineProperty({}, currentKey, flattenObjects(styleItems)));
    }, {});
  }
  function flattenObjects(objects) {
    return objects.reduce(function (merged, object) {
      return Object.assign(Object.assign({}, merged), object);
    }, {});
  }
  function extractStyles(source, extractionKeys) {
    if (!source) {
      return [{}, {}];
    }
    return Object.entries(source).reduce(function (_ref, _ref2) {
      var _ref3 = _slicedToArray(_ref, 2),
        extracted = _ref3[0],
        rest = _ref3[1];
      var _ref4 = _slicedToArray(_ref2, 2),
        key = _ref4[0],
        value = _ref4[1];
      if (extractionKeys.includes(key)) {
        extracted[key] = value;
      } else {
        rest[key] = value;
      }
      return [extracted, rest];
    }, [{}, {}]);
  }
  return common$1;
}
var common = {};
var hasRequiredCommon;
function requireCommon() {
  if (hasRequiredCommon) return common;
  hasRequiredCommon = 1;
  Object.defineProperty(common, "__esModule", {
    value: true
  });
  common.parseInlineStyle = parseInlineStyle;
  function parseInlineStyle() {
    var style = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    try {
      return style.split(";").reduce(function (styleObject, line) {
        var pair = line.split(":");
        if (pair.length === 2) {
          var name = pair[0].trim().replace(/(-.)/g, function (match) {
            return match[1].toUpperCase();
          });
          styleObject[name] = pair[1].trim();
        }
        return styleObject;
      }, {});
    } catch (_) {
      return {};
    }
  }
  return common;
}
var typings = {};
var PageEditor = {};
var hasRequiredPageEditor;
function requirePageEditor() {
  if (hasRequiredPageEditor) return PageEditor;
  hasRequiredPageEditor = 1;
  Object.defineProperty(PageEditor, "__esModule", {
    value: true
  });
  return PageEditor;
}
var hasRequiredTypings;
function requireTypings() {
  if (hasRequiredTypings) return typings;
  hasRequiredTypings = 1;
  (function (exports) {
    var __createBinding = typings && typings.__createBinding || (Object.create ? function (o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
          enumerable: true,
          get: function get() {
            return m[k];
          }
        };
      }
      Object.defineProperty(o, k2, desc);
    } : function (o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = typings && typings.__exportStar || function (m, exports) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    __exportStar(/*@__PURE__*/requirePageEditor(), exports);
  })(typings);
  return typings;
}
var utils = {};
var PageEditorUtils = {};
var hasRequiredPageEditorUtils;
function requirePageEditorUtils() {
  if (hasRequiredPageEditorUtils) return PageEditorUtils;
  hasRequiredPageEditorUtils = 1;
  Object.defineProperty(PageEditorUtils, "__esModule", {
    value: true
  });
  PageEditorUtils.hidePropertyIn = hidePropertyIn;
  PageEditorUtils.hidePropertiesIn = hidePropertiesIn;
  PageEditorUtils.hideNestedPropertiesIn = hideNestedPropertiesIn;
  PageEditorUtils.changePropertyIn = changePropertyIn;
  PageEditorUtils.transformGroupsIntoTabs = transformGroupsIntoTabs;
  PageEditorUtils.moveProperty = moveProperty;
  function hidePropertyIn(propertyGroups, _value, key, nestedPropIndex, nestedPropKey) {
    modifyProperty(function (_, index, container) {
      return container.splice(index, 1);
    }, propertyGroups, key, nestedPropIndex, nestedPropKey);
  }
  function hidePropertiesIn(propertyGroups, _value, keys) {
    keys.forEach(function (key) {
      return modifyProperty(function (_, index, container) {
        return container.splice(index, 1);
      }, propertyGroups, key, undefined, undefined);
    });
  }
  function hideNestedPropertiesIn(propertyGroups, _value, key, nestedPropIndex, nestedPropKeys) {
    nestedPropKeys.forEach(function (nestedKey) {
      return hidePropertyIn(propertyGroups, _value, key, nestedPropIndex, nestedKey);
    });
  }
  function changePropertyIn(propertyGroups, _value, modify, key, nestedPropIndex, nestedPropKey) {
    modifyProperty(modify, propertyGroups, key, nestedPropIndex, nestedPropKey);
  }
  function transformGroupsIntoTabs(properties) {
    var groups = [];
    properties.forEach(function (property) {
      if (property.propertyGroups) {
        groups.push.apply(groups, _toConsumableArray(property.propertyGroups));
        property.propertyGroups = [];
      }
    });
    properties.push.apply(properties, groups);
  }
  function modifyProperty(modify, propertyGroups, key, nestedPropIndex, nestedPropKey) {
    propertyGroups.forEach(function (propGroup) {
      var _a;
      if (propGroup.propertyGroups) {
        modifyProperty(modify, propGroup.propertyGroups, key, nestedPropIndex, nestedPropKey);
      }
      (_a = propGroup.properties) === null || _a === void 0 ? void 0 : _a.forEach(function (prop, index, array) {
        if (prop.key === key) {
          if (nestedPropIndex === undefined || nestedPropKey === undefined) {
            modify(prop, index, array);
          } else if (prop.objects) {
            modifyProperty(modify, prop.objects[nestedPropIndex].properties, nestedPropKey);
          } else if (prop.properties) {
            modifyProperty(modify, prop.properties[nestedPropIndex], nestedPropKey);
          }
        }
      });
    });
  }
  function moveProperty(fromIndex, toIndex, properties) {
    if (fromIndex >= 0 && toIndex >= 0 && fromIndex < properties.length && toIndex < properties.length && fromIndex !== toIndex) {
      properties.splice.apply(properties, [toIndex, 0].concat(_toConsumableArray(properties.splice(fromIndex, 1))));
    }
  }
  return PageEditorUtils;
}
var hasRequiredUtils;
function requireUtils() {
  if (hasRequiredUtils) return utils;
  hasRequiredUtils = 1;
  (function (exports) {
    var __createBinding = utils && utils.__createBinding || (Object.create ? function (o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
          enumerable: true,
          get: function get() {
            return m[k];
          }
        };
      }
      Object.defineProperty(o, k2, desc);
    } : function (o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = utils && utils.__exportStar || function (m, exports) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    __exportStar(/*@__PURE__*/requirePageEditorUtils(), exports);
  })(utils);
  return utils;
}
var hasRequiredDist;
function requireDist() {
  if (hasRequiredDist) return dist;
  hasRequiredDist = 1;
  (function (exports) {
    var __createBinding = dist && dist.__createBinding || (Object.create ? function (o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
          enumerable: true,
          get: function get() {
            return m[k];
          }
        };
      }
      Object.defineProperty(o, k2, desc);
    } : function (o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = dist && dist.__exportStar || function (m, exports) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    __exportStar(/*@__PURE__*/requireCommon$2(), exports);
    __exportStar(/*@__PURE__*/requireCommon$1(), exports);
    __exportStar(/*@__PURE__*/requireCommon(), exports);
    __exportStar(/*@__PURE__*/requireTypings(), exports);
    __exportStar(/*@__PURE__*/requireUtils(), exports);
  })(dist);
  return dist;
}
var distExports = /*@__PURE__*/requireDist();

/* eslint-disable @typescript-eslint/no-explicit-any */
var container = Object.assign(function () {
  return function () {
    return {
      type: "Container"
    };
  };
}, {
  padding: function padding(_n) {
    return {
      padding: _n
    };
  },
  borders: function borders() {
    return {
      borders: true
    };
  },
  borderWidth: function borderWidth(_n) {
    return {
      borderWidth: _n
    };
  },
  borderRadius: function borderRadius(_n) {
    return {
      borderRadius: _n
    };
  },
  backgroundColor: function backgroundColor(_c) {
    return {
      backgroundColor: _c
    };
  }
});
var dropzone = Object.assign(function () {
  return function () {
    return {
      type: "DropZone"
    };
  };
}, {
  placeholder: function placeholder(_text) {
    return {
      placeholder: _text
    };
  },
  hideDataSourceHeaderIf: function hideDataSourceHeaderIf(_condition) {
    return {
      hideDataSourceHeader: _condition
    };
  }
});
var structurePreviewPalette = {
  light: {
    ContrastText: "#333",
    background: {
      topbarData: "#DAEFFB",
      topbarStandard: "#F5F5F5",
      container: "#FFF"
    },
    text: {
      data: "#264AE5",
      primary: "#333",
      secondary: "#6B707B"
    }
  },
  dark: {
    ContrastText: "#FFF",
    background: {
      topbarData: "#3E4453",
      topbarStandard: "#3B3E48",
      container: "#252627"
    },
    text: {
      data: "#579BF9",
      primary: "#DEDEDE",
      secondary: "#A7A7A7"
    }
  }
};
function getDatasourcePlaceholderText(args) {
  var optionsSourceType = args.optionsSourceType,
    optionsSourceAssociationDataSource = args.optionsSourceAssociationDataSource,
    attributeEnumeration = args.attributeEnumeration,
    attributeBoolean = args.attributeBoolean,
    databaseAttributeString = args.databaseAttributeString,
    emptyOptionText = args.emptyOptionText,
    source = args.source,
    optionsSourceDatabaseDataSource = args.optionsSourceDatabaseDataSource,
    staticAttribute = args.staticAttribute,
    optionsSourceStaticDataSource = args.optionsSourceStaticDataSource;
  var emptyStringFormat = emptyOptionText ? "[".concat(emptyOptionText, "]") : "Combo box";
  if (source === "context") {
    switch (optionsSourceType) {
      case "association":
        return (optionsSourceAssociationDataSource === null || optionsSourceAssociationDataSource === void 0 ? void 0 : optionsSourceAssociationDataSource.caption) || emptyStringFormat;
      case "enumeration":
        return "[".concat(optionsSourceType, ", ").concat(attributeEnumeration, "]");
      case "boolean":
        return "[".concat(optionsSourceType, ", ").concat(attributeBoolean, "]");
      default:
        return emptyStringFormat;
    }
  } else if (source === "database" && optionsSourceDatabaseDataSource) {
    return (optionsSourceDatabaseDataSource === null || optionsSourceDatabaseDataSource === void 0 ? void 0 : optionsSourceDatabaseDataSource.caption) || "".concat(source, ", ").concat(databaseAttributeString);
  } else if (source === "static") {
    return (optionsSourceStaticDataSource === null || optionsSourceStaticDataSource === void 0 ? void 0 : optionsSourceStaticDataSource.caption) || "[".concat(source, ", ").concat(staticAttribute, "]");
  }
  return emptyStringFormat;
}
var IconSVG = "data:image/svg+xml,%3Csvg%20width%3D%2241%22%20height%3D%2216%22%20viewBox%3D%220%200%2041%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%20%20%20%20%3Cpath%20d%3D%22M13.5%203.7498L12.2502%202.5L8%206.74577L3.7498%202.5L2.5%203.7498L6.74577%208L2.5%2012.2502L3.7498%2013.5L8%209.25423L12.2502%2013.5L13.5%2012.2502L9.25423%208L13.5%203.7498Z%22%20fill%3D%22%236B707B%22%2F%3E%20%20%20%20%3Cpath%20d%3D%22M32.9999%209.58492L28.2049%204.79492L26.7949%206.20492L32.9999%2012.4149L39.2049%206.20492L37.7949%204.79492L32.9999%209.58492Z%22%20fill%3D%22%236B707B%22%2F%3E%3C%2Fsvg%3E%20%20%20%20";
var IconSVGDark = "data:image/svg+xml,%3Csvg%20width%3D%2241%22%20height%3D%2216%22%20viewBox%3D%220%200%2041%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%20%20%20%20%3Cpath%20d%3D%22M13.5%203.7498L12.2502%202.5L8%206.74577L3.7498%202.5L2.5%203.7498L6.74577%208L2.5%2012.2502L3.7498%2013.5L8%209.25423L12.2502%2013.5L13.5%2012.2502L9.25423%208L13.5%203.7498Z%22%20fill%3D%22%23579BF9%22%2F%3E%20%20%20%20%3Cpath%20d%3D%22M32.9999%209.58492L28.2049%204.79492L26.7949%206.20492L32.9999%2012.4149L39.2049%206.20492L37.7949%204.79492L32.9999%209.58492Z%22%20fill%3D%22%23579BF9%22%2F%3E%3C%2Fsvg%3E%20%20%20%20%20%20%20%20";
var LAZY_LOADING_CONFIG = ["lazyLoading", "loadingType"];
var DATABASE_SOURCE_CONFIG = ["optionsSourceDatabaseCaptionAttribute", "optionsSourceDatabaseCaptionExpression", "optionsSourceDatabaseCaptionType", "optionsSourceDatabaseCustomContent", "optionsSourceDatabaseCustomContentType", "optionsSourceDatabaseDataSource", "optionsSourceDatabaseValueAttribute", "optionsSourceDatabaseItemSelection", "databaseAttributeString", "onChangeDatabaseEvent"];
var ASSOCIATION_SOURCE_CONFIG = ["optionsSourceAssociationCaptionAttribute", "optionsSourceAssociationCaptionExpression", "optionsSourceAssociationCaptionType", "optionsSourceAssociationCustomContent", "optionsSourceAssociationCustomContentType", "optionsSourceAssociationDataSource", "attributeAssociation"];
function getProperties(values, defaultProperties) {
  if (values.source !== "database") {
    distExports.hidePropertiesIn(defaultProperties, values, ["customEditability", "customEditabilityExpression"]);
  }
  if (values.source === "context") {
    distExports.hidePropertiesIn(defaultProperties, values, ["staticAttribute", "staticDataSourceCustomContentType", "optionsSourceStaticDataSource"].concat(DATABASE_SOURCE_CONFIG));
    if (["enumeration", "boolean"].includes(values.optionsSourceType)) {
      distExports.hidePropertiesIn(defaultProperties, values, ["selectedItemsStyle", "selectionMethod", "selectAllButton", "selectAllButtonCaption", "selectedItemsSorting"].concat(ASSOCIATION_SOURCE_CONFIG, LAZY_LOADING_CONFIG));
      if (values.optionsSourceType === "boolean") {
        distExports.hidePropertiesIn(defaultProperties, values, ["clearable"]);
        distExports.hidePropertiesIn(defaultProperties, values, ["attributeEnumeration"]);
      } else {
        distExports.hidePropertiesIn(defaultProperties, values, ["attributeBoolean"]);
      }
    } else if (values.optionsSourceType === "association") {
      distExports.hidePropertiesIn(defaultProperties, values, ["attributeEnumeration", "attributeBoolean"]);
      if (values.optionsSourceAssociationCaptionType === "attribute") {
        distExports.hidePropertiesIn(defaultProperties, values, ["optionsSourceAssociationCaptionExpression"]);
      } else {
        distExports.hidePropertiesIn(defaultProperties, values, ["optionsSourceAssociationCaptionAttribute"].concat(LAZY_LOADING_CONFIG));
      }
      if (values.optionsSourceAssociationDataSource === null) {
        distExports.hidePropertiesIn(defaultProperties, values, ["optionsSourceAssociationCaptionType"]);
      }
      if (values.optionsSourceAssociationCustomContentType === "no") {
        distExports.hidePropertiesIn(defaultProperties, values, ["optionsSourceAssociationCustomContent"]);
      } else {
        distExports.hidePropertiesIn(defaultProperties, values, ["selectedItemsStyle"]);
      }
      if (values.showFooter === false) {
        distExports.hidePropertiesIn(defaultProperties, values, ["menuFooterContent"]);
      }
      if (values.selectAllButton === false) {
        distExports.hidePropertiesIn(defaultProperties, values, ["selectAllButtonCaption"]);
      }
    }
  } else if (values.source === "database") {
    distExports.hidePropertiesIn(defaultProperties, values, ["attributeEnumeration", "attributeBoolean", "optionsSourceType", "staticAttribute", "staticDataSourceCustomContentType", "optionsSourceStaticDataSource", "selectedItemsStyle", "selectionMethod", "selectAllButton", "selectAllButtonCaption"].concat(ASSOCIATION_SOURCE_CONFIG));
    if (values.optionsSourceDatabaseDataSource === null) {
      distExports.hidePropertiesIn(defaultProperties, values, ["optionsSourceDatabaseCaptionType"]);
    }
    if (values.optionsSourceDatabaseCaptionType === "attribute") {
      distExports.hidePropertiesIn(defaultProperties, values, ["optionsSourceDatabaseCaptionExpression"]);
    } else {
      distExports.hidePropertiesIn(defaultProperties, values, ["optionsSourceDatabaseCaptionAttribute"].concat(LAZY_LOADING_CONFIG));
    }
    if (values.optionsSourceDatabaseCustomContentType === "no") {
      distExports.hidePropertiesIn(defaultProperties, values, ["optionsSourceDatabaseCustomContent"]);
    } else {
      distExports.hidePropertiesIn(defaultProperties, values, ["selectedItemsStyle"]);
    }
    if (values.optionsSourceDatabaseItemSelection === "Multi") {
      distExports.hidePropertiesIn(defaultProperties, values, ["optionsSourceDatabaseValueAttribute", "databaseAttributeString"]);
    } else {
      distExports.hidePropertiesIn(defaultProperties, values, ["selectedItemsSorting"]);
    }
    if (values.databaseAttributeString.length === 0) {
      distExports.hidePropertiesIn(defaultProperties, values, ["optionsSourceDatabaseValueAttribute"]);
      distExports.hidePropertiesIn(defaultProperties, values, ["Editability"]);
      if (values.customEditability !== "conditionally") {
        distExports.hidePropertiesIn(defaultProperties, values, ["customEditabilityExpression"]);
      }
      // hide generic On change event when value is not saved anywhere.
      // Users should use "On selection" that is assigned to the selection API (onChangeDatabaseEvent)
      distExports.hidePropertiesIn(defaultProperties, values, ["onChangeEvent"]);
    } else {
      distExports.hidePropertiesIn(defaultProperties, values, ["customEditability", "customEditabilityExpression"]);
    }
  } else if (values.source === "static") {
    distExports.hidePropertiesIn(defaultProperties, values, ["attributeEnumeration", "attributeBoolean", "optionsSourceType", "selectedItemsStyle", "selectionMethod", "selectAllButton", "selectAllButtonCaption"].concat(ASSOCIATION_SOURCE_CONFIG, DATABASE_SOURCE_CONFIG, LAZY_LOADING_CONFIG));
  }
  if (values.staticDataSourceCustomContentType === "no") {
    values.optionsSourceStaticDataSource.forEach(function (_, index) {
      distExports.hideNestedPropertiesIn(defaultProperties, values, "optionsSourceStaticDataSource", index, ["staticDataSourceCustomContent"]);
    });
  }
  if (values.filterType === "none" && values.selectionMethod !== "rowclick") {
    distExports.hidePropertiesIn(defaultProperties, values, ["noOptionsText"]);
  }
  if (values.selectionMethod === "rowclick") {
    distExports.hidePropertiesIn(defaultProperties, values, ["selectedItemsStyle"]);
  }
  if (values.lazyLoading === false) {
    distExports.hidePropertiesIn(defaultProperties, values, ["loadingType"]);
  }
  return defaultProperties;
}
function getIconPreview(isDarkMode) {
  return {
    type: "Container",
    children: [container({
      padding: 1
    })(), {
      type: "Image",
      document: decodeURIComponent((isDarkMode ? IconSVGDark : IconSVG).replace("data:image/svg+xml,", "")),
      width: 41,
      height: 16
    }]
  };
}
function getPreview(_values, isDarkMode) {
  var palette = structurePreviewPalette[isDarkMode ? "dark" : "light"];
  var structurePreviewChildren = [];
  var dropdownPreviewChildren = [];
  var readOnly = _values.readOnly;
  if (_values.source === "context" && _values.optionsSourceType === "association" && _values.optionsSourceAssociationCustomContentType !== "no") {
    structurePreviewChildren.push(dropzone(dropzone.placeholder("Configure the combo box: Place widgets here"), dropzone.hideDataSourceHeaderIf(false))(_values.optionsSourceAssociationCustomContent));
  }
  if (_values.source === "database") {
    if (_values.optionsSourceDatabaseCustomContentType !== "no") {
      structurePreviewChildren.push(dropzone(dropzone.placeholder("Configure the combo box: Place widgets here"), dropzone.hideDataSourceHeaderIf(false))(_values.optionsSourceDatabaseCustomContent));
    }
    if (_values.databaseAttributeString.length === 0) {
      readOnly = _values.customEditability === "never";
    }
  }
  if (_values.source === "static" && _values.staticDataSourceCustomContentType !== "no") {
    structurePreviewChildren.push(container({
      borders: true,
      borderWidth: 1,
      backgroundColor: palette.background.topbarData,
      padding: 1
    })({
      type: "Text",
      content: getDatasourcePlaceholderText(_values),
      fontColor: palette.text.data
    }));
    _values.optionsSourceStaticDataSource.forEach(function (value) {
      structurePreviewChildren.push(container({
        borders: true,
        borderWidth: 1,
        borderRadius: 2
      })(dropzone(dropzone.placeholder("Configure the combo box: Place widgets for option ".concat(value.staticDataSourceCaption, " here")), dropzone.hideDataSourceHeaderIf(false))(value.staticDataSourceCustomContent)));
    });
  }
  if (_values.showFooter === true) {
    dropdownPreviewChildren = [container({
      padding: 1
    })(), container({
      borders: true,
      borderWidth: 1,
      borderRadius: 2
    })(dropzone(dropzone.placeholder("Configure footer: place widgets here"), dropzone.hideDataSourceHeaderIf(false))(_values.menuFooterContent))];
  }
  if (structurePreviewChildren.length === 0) {
    structurePreviewChildren.push({
      type: "Text",
      content: getDatasourcePlaceholderText(_values),
      fontColor: palette.text.data
    });
  }
  return {
    type: "Container",
    children: [{
      type: "RowLayout",
      columnSize: "grow",
      borders: true,
      borderWidth: 1,
      borderRadius: 2,
      backgroundColor: readOnly ? palette.background.containerDisabled : palette.background.container,
      children: [{
        type: "Container",
        grow: 1,
        padding: 4,
        children: structurePreviewChildren
      }, readOnly && _values.readOnlyStyle === "text" ? container({
        grow: 0,
        padding: 4
      })() : _objectSpread(_objectSpread({}, getIconPreview(isDarkMode)), {
        grow: 0,
        padding: 4
      })]
    }].concat(_toConsumableArray(dropdownPreviewChildren))
  };
}
function getCustomCaption(values) {
  return getDatasourcePlaceholderText(values);
}
exports.getCustomCaption = getCustomCaption;
exports.getPreview = getPreview;
exports.getProperties = getProperties;
