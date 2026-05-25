const __cjs_meta_url = require('url').pathToFileURL(__filename).href;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/@xmldom+xmldom@0.9.10/node_modules/@xmldom/xmldom/lib/conventions.js
var require_conventions = __commonJS({
  "node_modules/.pnpm/@xmldom+xmldom@0.9.10/node_modules/@xmldom/xmldom/lib/conventions.js"(exports2) {
    "use strict";
    function find(list, predicate, ac) {
      if (ac === void 0) {
        ac = Array.prototype;
      }
      if (list && typeof ac.find === "function") {
        return ac.find.call(list, predicate);
      }
      for (var i = 0; i < list.length; i++) {
        if (hasOwn(list, i)) {
          var item = list[i];
          if (predicate.call(void 0, item, i, list)) {
            return item;
          }
        }
      }
    }
    function freeze(object, oc) {
      if (oc === void 0) {
        oc = Object;
      }
      if (oc && typeof oc.getOwnPropertyDescriptors === "function") {
        object = oc.create(null, oc.getOwnPropertyDescriptors(object));
      }
      return oc && typeof oc.freeze === "function" ? oc.freeze(object) : object;
    }
    function hasOwn(object, key) {
      return Object.prototype.hasOwnProperty.call(object, key);
    }
    function assign(target, source) {
      if (target === null || typeof target !== "object") {
        throw new TypeError("target is not an object");
      }
      for (var key in source) {
        if (hasOwn(source, key)) {
          target[key] = source[key];
        }
      }
      return target;
    }
    var HTML_BOOLEAN_ATTRIBUTES = freeze({
      allowfullscreen: true,
      async: true,
      autofocus: true,
      autoplay: true,
      checked: true,
      controls: true,
      default: true,
      defer: true,
      disabled: true,
      formnovalidate: true,
      hidden: true,
      ismap: true,
      itemscope: true,
      loop: true,
      multiple: true,
      muted: true,
      nomodule: true,
      novalidate: true,
      open: true,
      playsinline: true,
      readonly: true,
      required: true,
      reversed: true,
      selected: true
    });
    function isHTMLBooleanAttribute(name) {
      return hasOwn(HTML_BOOLEAN_ATTRIBUTES, name.toLowerCase());
    }
    var HTML_VOID_ELEMENTS = freeze({
      area: true,
      base: true,
      br: true,
      col: true,
      embed: true,
      hr: true,
      img: true,
      input: true,
      link: true,
      meta: true,
      param: true,
      source: true,
      track: true,
      wbr: true
    });
    function isHTMLVoidElement(tagName) {
      return hasOwn(HTML_VOID_ELEMENTS, tagName.toLowerCase());
    }
    var HTML_RAW_TEXT_ELEMENTS = freeze({
      script: false,
      style: false,
      textarea: true,
      title: true
    });
    function isHTMLRawTextElement(tagName) {
      var key = tagName.toLowerCase();
      return hasOwn(HTML_RAW_TEXT_ELEMENTS, key) && !HTML_RAW_TEXT_ELEMENTS[key];
    }
    function isHTMLEscapableRawTextElement(tagName) {
      var key = tagName.toLowerCase();
      return hasOwn(HTML_RAW_TEXT_ELEMENTS, key) && HTML_RAW_TEXT_ELEMENTS[key];
    }
    function isHTMLMimeType(mimeType) {
      return mimeType === MIME_TYPE.HTML;
    }
    function hasDefaultHTMLNamespace(mimeType) {
      return isHTMLMimeType(mimeType) || mimeType === MIME_TYPE.XML_XHTML_APPLICATION;
    }
    var MIME_TYPE = freeze({
      /**
       * `text/html`, the only mime type that triggers treating an XML document as HTML.
       *
       * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
       * @see https://en.wikipedia.org/wiki/HTML Wikipedia
       * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
       * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring
       *      WHATWG HTML Spec
       */
      HTML: "text/html",
      /**
       * `application/xml`, the standard mime type for XML documents.
       *
       * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType
       *      registration
       * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
       * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
       */
      XML_APPLICATION: "application/xml",
      /**
       * `text/xml`, an alias for `application/xml`.
       *
       * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
       * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
       * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
       */
      XML_TEXT: "text/xml",
      /**
       * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
       * but is parsed as an XML document.
       *
       * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType
       *      registration
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
       * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
       */
      XML_XHTML_APPLICATION: "application/xhtml+xml",
      /**
       * `image/svg+xml`,
       *
       * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
       * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
       * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
       */
      XML_SVG_IMAGE: "image/svg+xml"
    });
    var _MIME_TYPES = Object.keys(MIME_TYPE).map(function(key) {
      return MIME_TYPE[key];
    });
    function isValidMimeType(mimeType) {
      return _MIME_TYPES.indexOf(mimeType) > -1;
    }
    var NAMESPACE = freeze({
      /**
       * The XHTML namespace.
       *
       * @see http://www.w3.org/1999/xhtml
       */
      HTML: "http://www.w3.org/1999/xhtml",
      /**
       * The SVG namespace.
       *
       * @see http://www.w3.org/2000/svg
       */
      SVG: "http://www.w3.org/2000/svg",
      /**
       * The `xml:` namespace.
       *
       * @see http://www.w3.org/XML/1998/namespace
       */
      XML: "http://www.w3.org/XML/1998/namespace",
      /**
       * The `xmlns:` namespace.
       *
       * @see https://www.w3.org/2000/xmlns/
       */
      XMLNS: "http://www.w3.org/2000/xmlns/"
    });
    exports2.assign = assign;
    exports2.find = find;
    exports2.freeze = freeze;
    exports2.HTML_BOOLEAN_ATTRIBUTES = HTML_BOOLEAN_ATTRIBUTES;
    exports2.HTML_RAW_TEXT_ELEMENTS = HTML_RAW_TEXT_ELEMENTS;
    exports2.HTML_VOID_ELEMENTS = HTML_VOID_ELEMENTS;
    exports2.hasDefaultHTMLNamespace = hasDefaultHTMLNamespace;
    exports2.hasOwn = hasOwn;
    exports2.isHTMLBooleanAttribute = isHTMLBooleanAttribute;
    exports2.isHTMLRawTextElement = isHTMLRawTextElement;
    exports2.isHTMLEscapableRawTextElement = isHTMLEscapableRawTextElement;
    exports2.isHTMLMimeType = isHTMLMimeType;
    exports2.isHTMLVoidElement = isHTMLVoidElement;
    exports2.isValidMimeType = isValidMimeType;
    exports2.MIME_TYPE = MIME_TYPE;
    exports2.NAMESPACE = NAMESPACE;
  }
});

// node_modules/.pnpm/@xmldom+xmldom@0.9.10/node_modules/@xmldom/xmldom/lib/errors.js
var require_errors = __commonJS({
  "node_modules/.pnpm/@xmldom+xmldom@0.9.10/node_modules/@xmldom/xmldom/lib/errors.js"(exports2) {
    "use strict";
    var conventions = require_conventions();
    function extendError(constructor, writableName) {
      constructor.prototype = Object.create(Error.prototype, {
        constructor: { value: constructor },
        name: { value: constructor.name, enumerable: true, writable: writableName }
      });
    }
    var DOMExceptionName = conventions.freeze({
      /**
       * the default value as defined by the spec
       */
      Error: "Error",
      /**
       * @deprecated
       * Use RangeError instead.
       */
      IndexSizeError: "IndexSizeError",
      /**
       * @deprecated
       * Just to match the related static code, not part of the spec.
       */
      DomstringSizeError: "DomstringSizeError",
      HierarchyRequestError: "HierarchyRequestError",
      WrongDocumentError: "WrongDocumentError",
      InvalidCharacterError: "InvalidCharacterError",
      /**
       * @deprecated
       * Just to match the related static code, not part of the spec.
       */
      NoDataAllowedError: "NoDataAllowedError",
      NoModificationAllowedError: "NoModificationAllowedError",
      NotFoundError: "NotFoundError",
      NotSupportedError: "NotSupportedError",
      InUseAttributeError: "InUseAttributeError",
      InvalidStateError: "InvalidStateError",
      SyntaxError: "SyntaxError",
      InvalidModificationError: "InvalidModificationError",
      NamespaceError: "NamespaceError",
      /**
       * @deprecated
       * Use TypeError for invalid arguments,
       * "NotSupportedError" DOMException for unsupported operations,
       * and "NotAllowedError" DOMException for denied requests instead.
       */
      InvalidAccessError: "InvalidAccessError",
      /**
       * @deprecated
       * Just to match the related static code, not part of the spec.
       */
      ValidationError: "ValidationError",
      /**
       * @deprecated
       * Use TypeError instead.
       */
      TypeMismatchError: "TypeMismatchError",
      SecurityError: "SecurityError",
      NetworkError: "NetworkError",
      AbortError: "AbortError",
      /**
       * @deprecated
       * Just to match the related static code, not part of the spec.
       */
      URLMismatchError: "URLMismatchError",
      QuotaExceededError: "QuotaExceededError",
      TimeoutError: "TimeoutError",
      InvalidNodeTypeError: "InvalidNodeTypeError",
      DataCloneError: "DataCloneError",
      EncodingError: "EncodingError",
      NotReadableError: "NotReadableError",
      UnknownError: "UnknownError",
      ConstraintError: "ConstraintError",
      DataError: "DataError",
      TransactionInactiveError: "TransactionInactiveError",
      ReadOnlyError: "ReadOnlyError",
      VersionError: "VersionError",
      OperationError: "OperationError",
      NotAllowedError: "NotAllowedError",
      OptOutError: "OptOutError"
    });
    var DOMExceptionNames = Object.keys(DOMExceptionName);
    function isValidDomExceptionCode(value) {
      return typeof value === "number" && value >= 1 && value <= 25;
    }
    function endsWithError(value) {
      return typeof value === "string" && value.substring(value.length - DOMExceptionName.Error.length) === DOMExceptionName.Error;
    }
    function DOMException(messageOrCode, nameOrMessage) {
      if (isValidDomExceptionCode(messageOrCode)) {
        this.name = DOMExceptionNames[messageOrCode];
        this.message = nameOrMessage || "";
      } else {
        this.message = messageOrCode;
        this.name = endsWithError(nameOrMessage) ? nameOrMessage : DOMExceptionName.Error;
      }
      if (Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
    }
    extendError(DOMException, true);
    Object.defineProperties(DOMException.prototype, {
      code: {
        enumerable: true,
        get: function() {
          var code = DOMExceptionNames.indexOf(this.name);
          if (isValidDomExceptionCode(code)) return code;
          return 0;
        }
      }
    });
    var ExceptionCode = {
      INDEX_SIZE_ERR: 1,
      DOMSTRING_SIZE_ERR: 2,
      HIERARCHY_REQUEST_ERR: 3,
      WRONG_DOCUMENT_ERR: 4,
      INVALID_CHARACTER_ERR: 5,
      NO_DATA_ALLOWED_ERR: 6,
      NO_MODIFICATION_ALLOWED_ERR: 7,
      NOT_FOUND_ERR: 8,
      NOT_SUPPORTED_ERR: 9,
      INUSE_ATTRIBUTE_ERR: 10,
      INVALID_STATE_ERR: 11,
      SYNTAX_ERR: 12,
      INVALID_MODIFICATION_ERR: 13,
      NAMESPACE_ERR: 14,
      INVALID_ACCESS_ERR: 15,
      VALIDATION_ERR: 16,
      TYPE_MISMATCH_ERR: 17,
      SECURITY_ERR: 18,
      NETWORK_ERR: 19,
      ABORT_ERR: 20,
      URL_MISMATCH_ERR: 21,
      QUOTA_EXCEEDED_ERR: 22,
      TIMEOUT_ERR: 23,
      INVALID_NODE_TYPE_ERR: 24,
      DATA_CLONE_ERR: 25
    };
    var entries = Object.entries(ExceptionCode);
    for (i = 0; i < entries.length; i++) {
      key = entries[i][0];
      DOMException[key] = entries[i][1];
    }
    var key;
    var i;
    function ParseError(message, locator) {
      this.message = message;
      this.locator = locator;
      if (Error.captureStackTrace) Error.captureStackTrace(this, ParseError);
    }
    extendError(ParseError);
    exports2.DOMException = DOMException;
    exports2.DOMExceptionName = DOMExceptionName;
    exports2.ExceptionCode = ExceptionCode;
    exports2.ParseError = ParseError;
  }
});

// node_modules/.pnpm/@xmldom+xmldom@0.9.10/node_modules/@xmldom/xmldom/lib/grammar.js
var require_grammar = __commonJS({
  "node_modules/.pnpm/@xmldom+xmldom@0.9.10/node_modules/@xmldom/xmldom/lib/grammar.js"(exports2) {
    "use strict";
    function detectUnicodeSupport(RegExpImpl) {
      try {
        if (typeof RegExpImpl !== "function") {
          RegExpImpl = RegExp;
        }
        var match = new RegExpImpl("\u{1D306}", "u").exec("\u{1D306}");
        return !!match && match[0].length === 2;
      } catch (error) {
      }
      return false;
    }
    var UNICODE_SUPPORT = detectUnicodeSupport();
    function chars(regexp) {
      if (regexp.source[0] !== "[") {
        throw new Error(regexp + " can not be used with chars");
      }
      return regexp.source.slice(1, regexp.source.lastIndexOf("]"));
    }
    function chars_without(regexp, search) {
      if (regexp.source[0] !== "[") {
        throw new Error("/" + regexp.source + "/ can not be used with chars_without");
      }
      if (!search || typeof search !== "string") {
        throw new Error(JSON.stringify(search) + " is not a valid search");
      }
      if (regexp.source.indexOf(search) === -1) {
        throw new Error('"' + search + '" is not is /' + regexp.source + "/");
      }
      if (search === "-" && regexp.source.indexOf(search) !== 1) {
        throw new Error('"' + search + '" is not at the first postion of /' + regexp.source + "/");
      }
      return new RegExp(regexp.source.replace(search, ""), UNICODE_SUPPORT ? "u" : "");
    }
    function reg(args) {
      var self = this;
      return new RegExp(
        Array.prototype.slice.call(arguments).map(function(part) {
          var isStr = typeof part === "string";
          if (isStr && self === void 0 && part === "|") {
            throw new Error("use regg instead of reg to wrap expressions with `|`!");
          }
          return isStr ? part : part.source;
        }).join(""),
        UNICODE_SUPPORT ? "mu" : "m"
      );
    }
    function regg(args) {
      if (arguments.length === 0) {
        throw new Error("no parameters provided");
      }
      return reg.apply(regg, ["(?:"].concat(Array.prototype.slice.call(arguments), [")"]));
    }
    var UNICODE_REPLACEMENT_CHARACTER = "\uFFFD";
    var Char = /[-\x09\x0A\x0D\x20-\x2C\x2E-\uD7FF\uE000-\uFFFD]/;
    if (UNICODE_SUPPORT) {
      Char = reg("[", chars(Char), "\\u{10000}-\\u{10FFFF}", "]");
    }
    var InvalidChar = new RegExp("[^" + chars(Char) + "]", UNICODE_SUPPORT ? "u" : "");
    var _SChar = /[\x20\x09\x0D\x0A]/;
    var SChar_s = chars(_SChar);
    var S = reg(_SChar, "+");
    var S_OPT = reg(_SChar, "*");
    var NameStartChar = /[:_a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
    if (UNICODE_SUPPORT) {
      NameStartChar = reg("[", chars(NameStartChar), "\\u{10000}-\\u{10FFFF}", "]");
    }
    var NameStartChar_s = chars(NameStartChar);
    var NameChar = reg("[", NameStartChar_s, chars(/[-.0-9\xB7]/), chars(/[\u0300-\u036F\u203F-\u2040]/), "]");
    var Name = reg(NameStartChar, NameChar, "*");
    var Nmtoken = reg(NameChar, "+");
    var EntityRef = reg("&", Name, ";");
    var CharRef = regg(/&#[0-9]+;|&#x[0-9a-fA-F]+;/);
    var Reference = regg(EntityRef, "|", CharRef);
    var PEReference = reg("%", Name, ";");
    var EntityValue = regg(
      reg('"', regg(/[^%&"]/, "|", PEReference, "|", Reference), "*", '"'),
      "|",
      reg("'", regg(/[^%&']/, "|", PEReference, "|", Reference), "*", "'")
    );
    var AttValue = regg('"', regg(/[^<&"]/, "|", Reference), "*", '"', "|", "'", regg(/[^<&']/, "|", Reference), "*", "'");
    var NCNameStartChar = chars_without(NameStartChar, ":");
    var NCNameChar = chars_without(NameChar, ":");
    var NCName = reg(NCNameStartChar, NCNameChar, "*");
    var QName = reg(NCName, regg(":", NCName), "?");
    var QName_exact = reg("^", QName, "$");
    var QName_group = reg("(", QName, ")");
    var SystemLiteral = regg(/"[^"]*"|'[^']*'/);
    var PI = reg(/^<\?/, "(", Name, ")", regg(S, "(", Char, "*?)"), "?", /\?>/);
    var PubidChar = /[\x20\x0D\x0Aa-zA-Z0-9-'()+,./:=?;!*#@$_%]/;
    var PubidLiteral = regg('"', PubidChar, '*"', "|", "'", chars_without(PubidChar, "'"), "*'");
    var COMMENT_START = "<!--";
    var COMMENT_END = "-->";
    var Comment = reg(COMMENT_START, regg(chars_without(Char, "-"), "|", reg("-", chars_without(Char, "-"))), "*", COMMENT_END);
    var PCDATA = "#PCDATA";
    var Mixed = regg(
      reg(/\(/, S_OPT, PCDATA, regg(S_OPT, /\|/, S_OPT, QName), "*", S_OPT, /\)\*/),
      "|",
      reg(/\(/, S_OPT, PCDATA, S_OPT, /\)/)
    );
    var _children_quantity = /[?*+]?/;
    var children2 = reg(
      /\([^>]+\)/,
      _children_quantity
      /*regg(choice, '|', seq), _children_quantity*/
    );
    var contentspec = regg("EMPTY", "|", "ANY", "|", Mixed, "|", children2);
    var ELEMENTDECL_START = "<!ELEMENT";
    var elementdecl = reg(ELEMENTDECL_START, S, regg(QName, "|", PEReference), S, regg(contentspec, "|", PEReference), S_OPT, ">");
    var NotationType = reg("NOTATION", S, /\(/, S_OPT, Name, regg(S_OPT, /\|/, S_OPT, Name), "*", S_OPT, /\)/);
    var Enumeration = reg(/\(/, S_OPT, Nmtoken, regg(S_OPT, /\|/, S_OPT, Nmtoken), "*", S_OPT, /\)/);
    var EnumeratedType = regg(NotationType, "|", Enumeration);
    var AttType = regg(/CDATA|ID|IDREF|IDREFS|ENTITY|ENTITIES|NMTOKEN|NMTOKENS/, "|", EnumeratedType);
    var DefaultDecl = regg(/#REQUIRED|#IMPLIED/, "|", regg(regg("#FIXED", S), "?", AttValue));
    var AttDef = regg(S, Name, S, AttType, S, DefaultDecl);
    var ATTLIST_DECL_START = "<!ATTLIST";
    var AttlistDecl = reg(ATTLIST_DECL_START, S, Name, AttDef, "*", S_OPT, ">");
    var ABOUT_LEGACY_COMPAT = "about:legacy-compat";
    var ABOUT_LEGACY_COMPAT_SystemLiteral = regg('"' + ABOUT_LEGACY_COMPAT + '"', "|", "'" + ABOUT_LEGACY_COMPAT + "'");
    var SYSTEM = "SYSTEM";
    var PUBLIC = "PUBLIC";
    var ExternalID = regg(regg(SYSTEM, S, SystemLiteral), "|", regg(PUBLIC, S, PubidLiteral, S, SystemLiteral));
    var ExternalID_match = reg(
      "^",
      regg(
        regg(SYSTEM, S, "(?<SystemLiteralOnly>", SystemLiteral, ")"),
        "|",
        regg(PUBLIC, S, "(?<PubidLiteral>", PubidLiteral, ")", S, "(?<SystemLiteral>", SystemLiteral, ")")
      )
    );
    var PubidLiteral_match = reg("^", PubidLiteral, "$");
    var SystemLiteral_match = reg("^", SystemLiteral, "$");
    var NDataDecl = regg(S, "NDATA", S, Name);
    var EntityDef = regg(EntityValue, "|", regg(ExternalID, NDataDecl, "?"));
    var ENTITY_DECL_START = "<!ENTITY";
    var GEDecl = reg(ENTITY_DECL_START, S, Name, S, EntityDef, S_OPT, ">");
    var PEDef = regg(EntityValue, "|", ExternalID);
    var PEDecl = reg(ENTITY_DECL_START, S, "%", S, Name, S, PEDef, S_OPT, ">");
    var EntityDecl = regg(GEDecl, "|", PEDecl);
    var PublicID = reg(PUBLIC, S, PubidLiteral);
    var NotationDecl = reg("<!NOTATION", S, Name, S, regg(ExternalID, "|", PublicID), S_OPT, ">");
    var Eq = reg(S_OPT, "=", S_OPT);
    var VersionNum = /1[.]\d+/;
    var VersionInfo = reg(S, "version", Eq, regg("'", VersionNum, "'", "|", '"', VersionNum, '"'));
    var EncName = /[A-Za-z][-A-Za-z0-9._]*/;
    var EncodingDecl = regg(S, "encoding", Eq, regg('"', EncName, '"', "|", "'", EncName, "'"));
    var SDDecl = regg(S, "standalone", Eq, regg("'", regg("yes", "|", "no"), "'", "|", '"', regg("yes", "|", "no"), '"'));
    var XMLDecl = reg(/^<\?xml/, VersionInfo, EncodingDecl, "?", SDDecl, "?", S_OPT, /\?>/);
    var DOCTYPE_DECL_START = "<!DOCTYPE";
    var CDATA_START = "<![CDATA[";
    var CDATA_END = "]]>";
    var CDStart = /<!\[CDATA\[/;
    var CDEnd = /\]\]>/;
    var CData = reg(Char, "*?", CDEnd);
    var CDSect = reg(CDStart, CData);
    exports2.chars = chars;
    exports2.chars_without = chars_without;
    exports2.detectUnicodeSupport = detectUnicodeSupport;
    exports2.reg = reg;
    exports2.regg = regg;
    exports2.ABOUT_LEGACY_COMPAT = ABOUT_LEGACY_COMPAT;
    exports2.ABOUT_LEGACY_COMPAT_SystemLiteral = ABOUT_LEGACY_COMPAT_SystemLiteral;
    exports2.AttlistDecl = AttlistDecl;
    exports2.CDATA_START = CDATA_START;
    exports2.CDATA_END = CDATA_END;
    exports2.CDSect = CDSect;
    exports2.Char = Char;
    exports2.Comment = Comment;
    exports2.COMMENT_START = COMMENT_START;
    exports2.COMMENT_END = COMMENT_END;
    exports2.DOCTYPE_DECL_START = DOCTYPE_DECL_START;
    exports2.elementdecl = elementdecl;
    exports2.EntityDecl = EntityDecl;
    exports2.EntityValue = EntityValue;
    exports2.ExternalID = ExternalID;
    exports2.ExternalID_match = ExternalID_match;
    exports2.Name = Name;
    exports2.NotationDecl = NotationDecl;
    exports2.Reference = Reference;
    exports2.PEReference = PEReference;
    exports2.PI = PI;
    exports2.PUBLIC = PUBLIC;
    exports2.PubidLiteral = PubidLiteral;
    exports2.PubidLiteral_match = PubidLiteral_match;
    exports2.QName = QName;
    exports2.QName_exact = QName_exact;
    exports2.QName_group = QName_group;
    exports2.S = S;
    exports2.SChar_s = SChar_s;
    exports2.S_OPT = S_OPT;
    exports2.SYSTEM = SYSTEM;
    exports2.SystemLiteral = SystemLiteral;
    exports2.SystemLiteral_match = SystemLiteral_match;
    exports2.InvalidChar = InvalidChar;
    exports2.UNICODE_REPLACEMENT_CHARACTER = UNICODE_REPLACEMENT_CHARACTER;
    exports2.UNICODE_SUPPORT = UNICODE_SUPPORT;
    exports2.XMLDecl = XMLDecl;
  }
});

// node_modules/.pnpm/@xmldom+xmldom@0.9.10/node_modules/@xmldom/xmldom/lib/dom.js
var require_dom = __commonJS({
  "node_modules/.pnpm/@xmldom+xmldom@0.9.10/node_modules/@xmldom/xmldom/lib/dom.js"(exports2) {
    "use strict";
    var conventions = require_conventions();
    var find = conventions.find;
    var hasDefaultHTMLNamespace = conventions.hasDefaultHTMLNamespace;
    var hasOwn = conventions.hasOwn;
    var isHTMLMimeType = conventions.isHTMLMimeType;
    var isHTMLRawTextElement = conventions.isHTMLRawTextElement;
    var isHTMLVoidElement = conventions.isHTMLVoidElement;
    var MIME_TYPE = conventions.MIME_TYPE;
    var NAMESPACE = conventions.NAMESPACE;
    var PDC = /* @__PURE__ */ Symbol();
    var errors = require_errors();
    var DOMException = errors.DOMException;
    var DOMExceptionName = errors.DOMExceptionName;
    var g = require_grammar();
    function checkSymbol(symbol) {
      if (symbol !== PDC) {
        throw new TypeError("Illegal constructor");
      }
    }
    function notEmptyString(input) {
      return input !== "";
    }
    function splitOnASCIIWhitespace(input) {
      return input ? input.split(/[\t\n\f\r ]+/).filter(notEmptyString) : [];
    }
    function orderedSetReducer(current, element) {
      if (!hasOwn(current, element)) {
        current[element] = true;
      }
      return current;
    }
    function toOrderedSet(input) {
      if (!input) return [];
      var list = splitOnASCIIWhitespace(input);
      return Object.keys(list.reduce(orderedSetReducer, {}));
    }
    function arrayIncludes(list) {
      return function(element) {
        return list && list.indexOf(element) !== -1;
      };
    }
    function validateQualifiedName(qualifiedName) {
      if (!g.QName_exact.test(qualifiedName)) {
        throw new DOMException(DOMException.INVALID_CHARACTER_ERR, 'invalid character in qualified name "' + qualifiedName + '"');
      }
    }
    function validateAndExtract(namespace, qualifiedName) {
      validateQualifiedName(qualifiedName);
      namespace = namespace || null;
      var prefix = null;
      var localName = qualifiedName;
      if (qualifiedName.indexOf(":") >= 0) {
        var splitResult = qualifiedName.split(":");
        prefix = splitResult[0];
        localName = splitResult[1];
      }
      if (prefix !== null && namespace === null) {
        throw new DOMException(DOMException.NAMESPACE_ERR, "prefix is non-null and namespace is null");
      }
      if (prefix === "xml" && namespace !== conventions.NAMESPACE.XML) {
        throw new DOMException(DOMException.NAMESPACE_ERR, 'prefix is "xml" and namespace is not the XML namespace');
      }
      if ((prefix === "xmlns" || qualifiedName === "xmlns") && namespace !== conventions.NAMESPACE.XMLNS) {
        throw new DOMException(
          DOMException.NAMESPACE_ERR,
          'either qualifiedName or prefix is "xmlns" and namespace is not the XMLNS namespace'
        );
      }
      if (namespace === conventions.NAMESPACE.XMLNS && prefix !== "xmlns" && qualifiedName !== "xmlns") {
        throw new DOMException(
          DOMException.NAMESPACE_ERR,
          'namespace is the XMLNS namespace and neither qualifiedName nor prefix is "xmlns"'
        );
      }
      return [namespace, prefix, localName];
    }
    function copy(src, dest) {
      for (var p in src) {
        if (hasOwn(src, p)) {
          dest[p] = src[p];
        }
      }
    }
    function _extends(Class, Super) {
      var pt = Class.prototype;
      if (!(pt instanceof Super)) {
        let t = function() {
        };
        t.prototype = Super.prototype;
        t = new t();
        copy(pt, t);
        Class.prototype = pt = t;
      }
      if (pt.constructor != Class) {
        if (typeof Class != "function") {
          console.error("unknown Class:" + Class);
        }
        pt.constructor = Class;
      }
    }
    var NodeType = {};
    var ELEMENT_NODE = NodeType.ELEMENT_NODE = 1;
    var ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE = 2;
    var TEXT_NODE2 = NodeType.TEXT_NODE = 3;
    var CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE = 4;
    var ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE = 5;
    var ENTITY_NODE = NodeType.ENTITY_NODE = 6;
    var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
    var COMMENT_NODE2 = NodeType.COMMENT_NODE = 8;
    var DOCUMENT_NODE = NodeType.DOCUMENT_NODE = 9;
    var DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE = 10;
    var DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE = 11;
    var NOTATION_NODE = NodeType.NOTATION_NODE = 12;
    var DocumentPosition = conventions.freeze({
      DOCUMENT_POSITION_DISCONNECTED: 1,
      DOCUMENT_POSITION_PRECEDING: 2,
      DOCUMENT_POSITION_FOLLOWING: 4,
      DOCUMENT_POSITION_CONTAINS: 8,
      DOCUMENT_POSITION_CONTAINED_BY: 16,
      DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: 32
    });
    function commonAncestor(a, b) {
      if (b.length < a.length) return commonAncestor(b, a);
      var c = null;
      for (var n in a) {
        if (a[n] !== b[n]) return c;
        c = a[n];
      }
      return c;
    }
    function docGUID(doc) {
      if (!doc.guid) doc.guid = Math.random();
      return doc.guid;
    }
    function NodeList() {
    }
    NodeList.prototype = {
      /**
       * The number of nodes in the list. The range of valid child node indices is 0 to length-1
       * inclusive.
       *
       * @type {number}
       */
      length: 0,
      /**
       * Returns the item at `index`. If index is greater than or equal to the number of nodes in
       * the list, this returns null.
       *
       * @param index
       * Unsigned long Index into the collection.
       * @returns {Node | null}
       * The node at position `index` in the NodeList,
       * or null if that is not a valid index.
       */
      item: function(index) {
        return index >= 0 && index < this.length ? this[index] : null;
      },
      /**
       * Returns a string representation of the NodeList.
       *
       * Accepts the same `options` object as `XMLSerializer.prototype.serializeToString`
       * (`requireWellFormed`, `splitCDATASections`, `nodeFilter`). Passing a function is treated as
       * a legacy `nodeFilter` for backward compatibility.
       *
       * @param {Object | function} [options]
       * @param {boolean} [options.requireWellFormed=false]
       * @param {boolean} [options.splitCDATASections=true]
       * @param {function} [options.nodeFilter]
       * @returns {string}
       */
      toString: function(options) {
        var opts;
        if (typeof options === "function") {
          opts = { requireWellFormed: false, splitCDATASections: true, nodeFilter: options };
        } else if (!!options) {
          opts = {
            requireWellFormed: !!options.requireWellFormed,
            splitCDATASections: options.splitCDATASections !== false,
            nodeFilter: options.nodeFilter || null
          };
        } else {
          opts = { requireWellFormed: false, splitCDATASections: true, nodeFilter: null };
        }
        for (var buf = [], i = 0; i < this.length; i++) {
          serializeToString(this[i], buf, null, opts);
        }
        return buf.join("");
      },
      /**
       * Filters the NodeList based on a predicate.
       *
       * @param {function(Node): boolean} predicate
       * - A predicate function to filter the NodeList.
       * @returns {Node[]}
       * An array of nodes that satisfy the predicate.
       * @private
       */
      filter: function(predicate) {
        return Array.prototype.filter.call(this, predicate);
      },
      /**
       * Returns the first index at which a given node can be found in the NodeList, or -1 if it is
       * not present.
       *
       * @param {Node} item
       * - The Node item to locate in the NodeList.
       * @returns {number}
       * The first index of the node in the NodeList; -1 if not found.
       * @private
       */
      indexOf: function(item) {
        return Array.prototype.indexOf.call(this, item);
      }
    };
    NodeList.prototype[Symbol.iterator] = function() {
      var me = this;
      var index = 0;
      return {
        next: function() {
          if (index < me.length) {
            return {
              value: me[index++],
              done: false
            };
          } else {
            return {
              done: true
            };
          }
        },
        return: function() {
          return {
            done: true
          };
        }
      };
    };
    function LiveNodeList(node, refresh) {
      this._node = node;
      this._refresh = refresh;
      _updateLiveList(this);
    }
    function _updateLiveList(list) {
      var inc = list._node._inc || list._node.ownerDocument._inc;
      if (list._inc !== inc) {
        var ls = list._refresh(list._node);
        __set__(list, "length", ls.length);
        if (!list.$$length || ls.length < list.$$length) {
          for (var i = ls.length; i in list; i++) {
            if (hasOwn(list, i)) {
              delete list[i];
            }
          }
        }
        copy(ls, list);
        list._inc = inc;
      }
    }
    LiveNodeList.prototype.item = function(i) {
      _updateLiveList(this);
      return this[i] || null;
    };
    _extends(LiveNodeList, NodeList);
    function NamedNodeMap() {
    }
    function _findNodeIndex(list, node) {
      var i = 0;
      while (i < list.length) {
        if (list[i] === node) {
          return i;
        }
        i++;
      }
    }
    function _addNamedNode(el, list, newAttr, oldAttr) {
      if (oldAttr) {
        list[_findNodeIndex(list, oldAttr)] = newAttr;
      } else {
        list[list.length] = newAttr;
        list.length++;
      }
      if (el) {
        newAttr.ownerElement = el;
        var doc = el.ownerDocument;
        if (doc) {
          oldAttr && _onRemoveAttribute(doc, el, oldAttr);
          _onAddAttribute(doc, el, newAttr);
        }
      }
    }
    function _removeNamedNode(el, list, attr) {
      var i = _findNodeIndex(list, attr);
      if (i >= 0) {
        var lastIndex = list.length - 1;
        while (i <= lastIndex) {
          list[i] = list[++i];
        }
        list.length = lastIndex;
        if (el) {
          var doc = el.ownerDocument;
          if (doc) {
            _onRemoveAttribute(doc, el, attr);
          }
          attr.ownerElement = null;
        }
      }
    }
    NamedNodeMap.prototype = {
      length: 0,
      item: NodeList.prototype.item,
      /**
       * Get an attribute by name. Note: Name is in lower case in case of HTML namespace and
       * document.
       *
       * @param {string} localName
       * The local name of the attribute.
       * @returns {Attr | null}
       * The attribute with the given local name, or null if no such attribute exists.
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-name
       */
      getNamedItem: function(localName) {
        if (this._ownerElement && this._ownerElement._isInHTMLDocumentAndNamespace()) {
          localName = localName.toLowerCase();
        }
        var i = 0;
        while (i < this.length) {
          var attr = this[i];
          if (attr.nodeName === localName) {
            return attr;
          }
          i++;
        }
        return null;
      },
      /**
       * Set an attribute.
       *
       * @param {Attr} attr
       * The attribute to set.
       * @returns {Attr | null}
       * The old attribute with the same local name and namespace URI as the new one, or null if no
       * such attribute exists.
       * @throws {DOMException}
       * With code:
       * - {@link INUSE_ATTRIBUTE_ERR} - If the attribute is already an attribute of another
       * element.
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-set
       */
      setNamedItem: function(attr) {
        var el = attr.ownerElement;
        if (el && el !== this._ownerElement) {
          throw new DOMException(DOMException.INUSE_ATTRIBUTE_ERR);
        }
        var oldAttr = this.getNamedItemNS(attr.namespaceURI, attr.localName);
        if (oldAttr === attr) {
          return attr;
        }
        _addNamedNode(this._ownerElement, this, attr, oldAttr);
        return oldAttr;
      },
      /**
       * Set an attribute, replacing an existing attribute with the same local name and namespace
       * URI if one exists.
       *
       * @param {Attr} attr
       * The attribute to set.
       * @returns {Attr | null}
       * The old attribute with the same local name and namespace URI as the new one, or null if no
       * such attribute exists.
       * @throws {DOMException}
       * Throws a DOMException with the name "InUseAttributeError" if the attribute is already an
       * attribute of another element.
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-set
       */
      setNamedItemNS: function(attr) {
        return this.setNamedItem(attr);
      },
      /**
       * Removes an attribute specified by the local name.
       *
       * @param {string} localName
       * The local name of the attribute to be removed.
       * @returns {Attr}
       * The attribute node that was removed.
       * @throws {DOMException}
       * With code:
       * - {@link DOMException.NOT_FOUND_ERR} if no attribute with the given name is found.
       * @see https://dom.spec.whatwg.org/#dom-namednodemap-removenameditem
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-name
       */
      removeNamedItem: function(localName) {
        var attr = this.getNamedItem(localName);
        if (!attr) {
          throw new DOMException(DOMException.NOT_FOUND_ERR, localName);
        }
        _removeNamedNode(this._ownerElement, this, attr);
        return attr;
      },
      /**
       * Removes an attribute specified by the namespace and local name.
       *
       * @param {string | null} namespaceURI
       * The namespace URI of the attribute to be removed.
       * @param {string} localName
       * The local name of the attribute to be removed.
       * @returns {Attr}
       * The attribute node that was removed.
       * @throws {DOMException}
       * With code:
       * - {@link DOMException.NOT_FOUND_ERR} if no attribute with the given namespace URI and local
       * name is found.
       * @see https://dom.spec.whatwg.org/#dom-namednodemap-removenameditemns
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-namespace
       */
      removeNamedItemNS: function(namespaceURI, localName) {
        var attr = this.getNamedItemNS(namespaceURI, localName);
        if (!attr) {
          throw new DOMException(DOMException.NOT_FOUND_ERR, namespaceURI ? namespaceURI + " : " + localName : localName);
        }
        _removeNamedNode(this._ownerElement, this, attr);
        return attr;
      },
      /**
       * Get an attribute by namespace and local name.
       *
       * @param {string | null} namespaceURI
       * The namespace URI of the attribute.
       * @param {string} localName
       * The local name of the attribute.
       * @returns {Attr | null}
       * The attribute with the given namespace URI and local name, or null if no such attribute
       * exists.
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-namespace
       */
      getNamedItemNS: function(namespaceURI, localName) {
        if (!namespaceURI) {
          namespaceURI = null;
        }
        var i = 0;
        while (i < this.length) {
          var node = this[i];
          if (node.localName === localName && node.namespaceURI === namespaceURI) {
            return node;
          }
          i++;
        }
        return null;
      }
    };
    NamedNodeMap.prototype[Symbol.iterator] = function() {
      var me = this;
      var index = 0;
      return {
        next: function() {
          if (index < me.length) {
            return {
              value: me[index++],
              done: false
            };
          } else {
            return {
              done: true
            };
          }
        },
        return: function() {
          return {
            done: true
          };
        }
      };
    };
    function DOMImplementation() {
    }
    DOMImplementation.prototype = {
      /**
       * Test if the DOM implementation implements a specific feature and version, as specified in
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/core.html#DOMFeatures DOM Features}.
       *
       * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given
       * feature is supported. The different implementations fairly diverged in what kind of
       * features were reported. The latest version of the spec settled to force this method to
       * always return true, where the functionality was accurate and in use.
       *
       * @deprecated
       * It is deprecated and modern browsers return true in all cases.
       * @function DOMImplementation#hasFeature
       * @param {string} feature
       * The name of the feature to test.
       * @param {string} [version]
       * This is the version number of the feature to test.
       * @returns {boolean}
       * Always returns true.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
       * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-5CED94D7 DOM Level 3 Core
       */
      hasFeature: function(feature, version) {
        return true;
      },
      /**
       * Creates a DOM Document object of the specified type with its document element. Note that
       * based on the {@link DocumentType}
       * given to create the document, the implementation may instantiate specialized
       * {@link Document} objects that support additional features than the "Core", such as "HTML"
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#DOM2HTML DOM Level 2 HTML}.
       * On the other hand, setting the {@link DocumentType} after the document was created makes
       * this very unlikely to happen. Alternatively, specialized {@link Document} creation methods,
       * such as createHTMLDocument
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#DOM2HTML DOM Level 2 HTML},
       * can be used to obtain specific types of {@link Document} objects.
       *
       * __It behaves slightly different from the description in the living standard__:
       * - There is no interface/class `XMLDocument`, it returns a `Document`
       * instance (with it's `type` set to `'xml'`).
       * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
       *
       * @function DOMImplementation.createDocument
       * @param {string | null} namespaceURI
       * The
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-namespaceURI namespace URI}
       * of the document element to create or null.
       * @param {string | null} qualifiedName
       * The
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-qualifiedname qualified name}
       * of the document element to be created or null.
       * @param {DocumentType | null} [doctype=null]
       * The type of document to be created or null. When doctype is not null, its
       * {@link Node#ownerDocument} attribute is set to the document being created. Default is
       * `null`
       * @returns {Document}
       * A new {@link Document} object with its document element. If the NamespaceURI,
       * qualifiedName, and doctype are null, the returned {@link Document} is empty with no
       * document element.
       * @throws {DOMException}
       * With code:
       *
       * - `INVALID_CHARACTER_ERR`: Raised if the specified qualified name is not an XML name
       * according to {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#XML XML 1.0}.
       * - `NAMESPACE_ERR`: Raised if the qualifiedName is malformed, if the qualifiedName has a
       * prefix and the namespaceURI is null, or if the qualifiedName is null and the namespaceURI
       * is different from null, or if the qualifiedName has a prefix that is "xml" and the
       * namespaceURI is different from "{@link http://www.w3.org/XML/1998/namespace}"
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#Namespaces XML Namespaces},
       * or if the DOM implementation does not support the "XML" feature but a non-null namespace
       * URI was provided, since namespaces were defined by XML.
       * - `WRONG_DOCUMENT_ERR`: Raised if doctype has already been used with a different document
       * or was created from a different implementation.
       * - `NOT_SUPPORTED_ERR`: May be raised if the implementation does not support the feature
       * "XML" and the language exposed through the Document does not support XML Namespaces (such
       * as {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#HTML40 HTML 4.01}).
       * @since DOM Level 2.
       * @see {@link #createHTMLDocument}
       * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument DOM Living Standard
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Level-2-Core-DOM-createDocument DOM
       *      Level 3 Core
       * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM
       *      Level 2 Core (initial)
       */
      createDocument: function(namespaceURI, qualifiedName, doctype) {
        var contentType = MIME_TYPE.XML_APPLICATION;
        if (namespaceURI === NAMESPACE.HTML) {
          contentType = MIME_TYPE.XML_XHTML_APPLICATION;
        } else if (namespaceURI === NAMESPACE.SVG) {
          contentType = MIME_TYPE.XML_SVG_IMAGE;
        }
        var doc = new Document(PDC, { contentType });
        doc.implementation = this;
        doc.childNodes = new NodeList();
        doc.doctype = doctype || null;
        if (doctype) {
          doc.appendChild(doctype);
        }
        if (qualifiedName) {
          var root = doc.createElementNS(namespaceURI, qualifiedName);
          doc.appendChild(root);
        }
        return doc;
      },
      /**
       * Creates an empty DocumentType node. Entity declarations and notations are not made
       * available. Entity reference expansions and default attribute additions do not occur.
       *
       * **This behavior is slightly different from the one in the specs**:
       * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
       * - `publicId` and `systemId` contain the raw data including any possible quotes,
       *   so they can always be serialized back to the original value
       * - `internalSubset` contains the raw string between `[` and `]` if present,
       *   but is not parsed or validated in any form.
       *
       * @function DOMImplementation#createDocumentType
       * @param {string} qualifiedName
       * The {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-qualifiedname qualified
       * name} of the document type to be created.
       * @param {string} [publicId]
       * The external subset public identifier. Stored verbatim including surrounding quotes.
       * When serialized with `requireWellFormed: true`, the serializer throws `InvalidStateError`
       * if the value is non-empty and does not match the XML `PubidLiteral` production
       * (W3C DOM Parsing §3.2.1.3; XML 1.0 production [12]). Creation-time validation is not
       * enforced — deferred to a future breaking release.
       * @param {string} [systemId]
       * The external subset system identifier. Stored verbatim including surrounding quotes.
       * When serialized with `requireWellFormed: true`, the serializer throws `InvalidStateError`
       * if the value is non-empty and does not match the XML `SystemLiteral` production
       * (W3C DOM Parsing §3.2.1.3; XML 1.0 production [11]). Creation-time validation is not
       * enforced — deferred to a future breaking release.
       * @param {string} [internalSubset]
       * The internal subset or an empty string if it is not present. Stored verbatim.
       * When serialized with `requireWellFormed: true`, the serializer throws `InvalidStateError`
       * if the value contains `"]>"`. Creation-time validation is not enforced.
       * @returns {DocumentType}
       * A new {@link DocumentType} node with {@link Node#ownerDocument} set to null.
       * @throws {DOMException}
       * With code:
       *
       * - `INVALID_CHARACTER_ERR`: Raised if the specified qualified name is not an XML name
       * according to {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#XML XML 1.0}.
       * - `NAMESPACE_ERR`: Raised if the qualifiedName is malformed.
       * - `NOT_SUPPORTED_ERR`: May be raised if the implementation does not support the feature
       * "XML" and the language exposed through the Document does not support XML Namespaces (such
       * as {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#HTML40 HTML 4.01}).
       * @since DOM Level 2.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType
       *      MDN
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living
       *      Standard
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Level-3-Core-DOM-createDocType DOM
       *      Level 3 Core
       * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM
       *      Level 2 Core
       * @see https://github.com/xmldom/xmldom/blob/master/CHANGELOG.md#050
       * @see https://www.w3.org/TR/DOM-Level-2-Core/#core-ID-Core-DocType-internalSubset
       * @prettierignore
       */
      createDocumentType: function(qualifiedName, publicId, systemId, internalSubset) {
        validateQualifiedName(qualifiedName);
        var node = new DocumentType(PDC);
        node.name = qualifiedName;
        node.nodeName = qualifiedName;
        node.publicId = publicId || "";
        node.systemId = systemId || "";
        node.internalSubset = internalSubset || "";
        node.childNodes = new NodeList();
        return node;
      },
      /**
       * Returns an HTML document, that might already have a basic DOM structure.
       *
       * __It behaves slightly different from the description in the living standard__:
       * - If the first argument is `false` no initial nodes are added (steps 3-7 in the specs are
       * omitted)
       * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
       *
       * @param {string | false} [title]
       * A string containing the title to give the new HTML document.
       * @returns {Document}
       * The HTML document.
       * @since WHATWG Living Standard.
       * @see {@link #createDocument}
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-createhtmldocument
       * @see https://dom.spec.whatwg.org/#html-document
       */
      createHTMLDocument: function(title) {
        var doc = new Document(PDC, { contentType: MIME_TYPE.HTML });
        doc.implementation = this;
        doc.childNodes = new NodeList();
        if (title !== false) {
          doc.doctype = this.createDocumentType("html");
          doc.doctype.ownerDocument = doc;
          doc.appendChild(doc.doctype);
          var htmlNode = doc.createElement("html");
          doc.appendChild(htmlNode);
          var headNode = doc.createElement("head");
          htmlNode.appendChild(headNode);
          if (typeof title === "string") {
            var titleNode = doc.createElement("title");
            titleNode.appendChild(doc.createTextNode(title));
            headNode.appendChild(titleNode);
          }
          htmlNode.appendChild(doc.createElement("body"));
        }
        return doc;
      }
    };
    function Node(symbol) {
      checkSymbol(symbol);
    }
    Node.prototype = {
      /**
       * The first child of this node.
       *
       * @type {Node | null}
       */
      firstChild: null,
      /**
       * The last child of this node.
       *
       * @type {Node | null}
       */
      lastChild: null,
      /**
       * The previous sibling of this node.
       *
       * @type {Node | null}
       */
      previousSibling: null,
      /**
       * The next sibling of this node.
       *
       * @type {Node | null}
       */
      nextSibling: null,
      /**
       * The parent node of this node.
       *
       * @type {Node | null}
       */
      parentNode: null,
      /**
       * The parent element of this node.
       *
       * @type {Element | null}
       */
      get parentElement() {
        return this.parentNode && this.parentNode.nodeType === this.ELEMENT_NODE ? this.parentNode : null;
      },
      /**
       * The child nodes of this node.
       *
       * @type {NodeList}
       */
      childNodes: null,
      /**
       * The document object associated with this node.
       *
       * @type {Document | null}
       */
      ownerDocument: null,
      /**
       * The value of this node.
       *
       * @type {string | null}
       */
      nodeValue: null,
      /**
       * The namespace URI of this node.
       *
       * @type {string | null}
       */
      namespaceURI: null,
      /**
       * The prefix of the namespace for this node.
       *
       * @type {string | null}
       */
      prefix: null,
      /**
       * The local part of the qualified name of this node.
       *
       * @type {string | null}
       */
      localName: null,
      /**
       * The baseURI is currently always `about:blank`,
       * since that's what happens when you create a document from scratch.
       *
       * @type {'about:blank'}
       */
      baseURI: "about:blank",
      /**
       * Is true if this node is part of a document.
       *
       * @type {boolean}
       */
      get isConnected() {
        var rootNode = this.getRootNode();
        return rootNode && rootNode.nodeType === rootNode.DOCUMENT_NODE;
      },
      /**
       * Checks whether `other` is an inclusive descendant of this node.
       *
       * @param {Node | null | undefined} other
       * The node to check.
       * @returns {boolean}
       * True if `other` is an inclusive descendant of this node; false otherwise.
       * @see https://dom.spec.whatwg.org/#dom-node-contains
       */
      contains: function(other) {
        if (!other) return false;
        var parent = other;
        do {
          if (this === parent) return true;
          parent = parent.parentNode;
        } while (parent);
        return false;
      },
      /**
       * @typedef GetRootNodeOptions
       * @property {boolean} [composed=false]
       */
      /**
       * Searches for the root node of this node.
       *
       * **This behavior is slightly different from the in the specs**:
       * - ignores `options.composed`, since `ShadowRoot`s are unsupported, always returns root.
       *
       * @param {GetRootNodeOptions} [options]
       * @returns {Node}
       * Root node.
       * @see https://dom.spec.whatwg.org/#dom-node-getrootnode
       * @see https://dom.spec.whatwg.org/#concept-shadow-including-root
       */
      getRootNode: function(options) {
        var parent = this;
        do {
          if (!parent.parentNode) {
            return parent;
          }
          parent = parent.parentNode;
        } while (parent);
      },
      /**
       * Checks whether the given node is equal to this node.
       *
       * Two nodes are equal when they have the same type, defining characteristics (for the type),
       * and the same childNodes. The comparison is iterative to avoid stack overflows on
       * deeply-nested trees. Attribute nodes of each Element pair are also pushed onto the stack
       * and compared the same way.
       *
       * @param {Node} [otherNode]
       * @returns {boolean}
       * @see https://dom.spec.whatwg.org/#concept-node-equals
       * @see ../docs/walk-dom.md.
       */
      isEqualNode: function(otherNode) {
        if (!otherNode) return false;
        var stack = [{ node: this, other: otherNode }];
        while (stack.length > 0) {
          var pair = stack.pop();
          var node = pair.node;
          var other = pair.other;
          if (node.nodeType !== other.nodeType) return false;
          switch (node.nodeType) {
            case node.DOCUMENT_TYPE_NODE:
              if (node.name !== other.name) return false;
              if (node.publicId !== other.publicId) return false;
              if (node.systemId !== other.systemId) return false;
              break;
            case node.ELEMENT_NODE:
              if (node.namespaceURI !== other.namespaceURI) return false;
              if (node.prefix !== other.prefix) return false;
              if (node.localName !== other.localName) return false;
              if (node.attributes.length !== other.attributes.length) return false;
              for (var i = 0; i < node.attributes.length; i++) {
                var attr = node.attributes.item(i);
                var otherAttr = other.getAttributeNodeNS(attr.namespaceURI, attr.localName);
                if (!otherAttr) return false;
                stack.push({ node: attr, other: otherAttr });
              }
              break;
            case node.ATTRIBUTE_NODE:
              if (node.namespaceURI !== other.namespaceURI) return false;
              if (node.localName !== other.localName) return false;
              if (node.value !== other.value) return false;
              break;
            case node.PROCESSING_INSTRUCTION_NODE:
              if (node.target !== other.target || node.data !== other.data) return false;
              break;
            case node.TEXT_NODE:
            case node.CDATA_SECTION_NODE:
            case node.COMMENT_NODE:
              if (node.data !== other.data) return false;
              break;
          }
          if (node.childNodes.length !== other.childNodes.length) return false;
          for (var i = node.childNodes.length - 1; i >= 0; i--) {
            stack.push({ node: node.childNodes[i], other: other.childNodes[i] });
          }
        }
        return true;
      },
      /**
       * Checks whether or not the given node is this node.
       *
       * @param {Node} [otherNode]
       */
      isSameNode: function(otherNode) {
        return this === otherNode;
      },
      /**
       * Inserts a node before a reference node as a child of this node.
       *
       * @param {Node} newChild
       * The new child node to be inserted.
       * @param {Node | null} refChild
       * The reference node before which newChild will be inserted.
       * @returns {Node}
       * The new child node successfully inserted.
       * @throws {DOMException}
       * Throws a DOMException if inserting the node would result in a DOM tree that is not
       * well-formed, or if `child` is provided but is not a child of `parent`.
       * See {@link _insertBefore} for more details.
       * @since Modified in DOM L2
       */
      insertBefore: function(newChild, refChild) {
        return _insertBefore(this, newChild, refChild);
      },
      /**
       * Replaces an old child node with a new child node within this node.
       *
       * @param {Node} newChild
       * The new node that is to replace the old node.
       * If it already exists in the DOM, it is removed from its original position.
       * @param {Node} oldChild
       * The existing child node to be replaced.
       * @returns {Node}
       * Returns the replaced child node.
       * @throws {DOMException}
       * Throws a DOMException if replacing the node would result in a DOM tree that is not
       * well-formed, or if `oldChild` is not a child of `this`.
       * This can also occur if the pre-replacement validity assertion fails.
       * See {@link _insertBefore}, {@link Node.removeChild}, and
       * {@link assertPreReplacementValidityInDocument} for more details.
       * @see https://dom.spec.whatwg.org/#concept-node-replace
       */
      replaceChild: function(newChild, oldChild) {
        _insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
        if (oldChild) {
          this.removeChild(oldChild);
        }
      },
      /**
       * Removes an existing child node from this node.
       *
       * @param {Node} oldChild
       * The child node to be removed.
       * @returns {Node}
       * Returns the removed child node.
       * @throws {DOMException}
       * Throws a DOMException if `oldChild` is not a child of `this`.
       * See {@link _removeChild} for more details.
       */
      removeChild: function(oldChild) {
        return _removeChild(this, oldChild);
      },
      /**
       * Appends a child node to this node.
       *
       * @param {Node} newChild
       * The child node to be appended to this node.
       * If it already exists in the DOM, it is removed from its original position.
       * @returns {Node}
       * Returns the appended child node.
       * @throws {DOMException}
       * Throws a DOMException if appending the node would result in a DOM tree that is not
       * well-formed, or if `newChild` is not a valid Node.
       * See {@link insertBefore} for more details.
       */
      appendChild: function(newChild) {
        return this.insertBefore(newChild, null);
      },
      /**
       * Determines whether this node has any child nodes.
       *
       * @returns {boolean}
       * Returns true if this node has any child nodes, and false otherwise.
       */
      hasChildNodes: function() {
        return this.firstChild != null;
      },
      /**
       * Creates a copy of the calling node.
       *
       * @param {boolean} deep
       * If true, the contents of the node are recursively copied.
       * If false, only the node itself (and its attributes, if it is an element) are copied.
       * @returns {Node}
       * Returns the newly created copy of the node.
       * @throws {DOMException}
       * May throw a DOMException if operations within {@link Element#setAttributeNode} or
       * {@link Node#appendChild} (which are potentially invoked in this method) do not meet their
       * specific constraints.
       * @see {@link cloneNode}
       */
      cloneNode: function(deep) {
        return cloneNode(this.ownerDocument || this, this, deep);
      },
      /**
       * Puts the specified node and all of its subtree into a "normalized" form. In a normalized
       * subtree, no text nodes in the subtree are empty and there are no adjacent text nodes.
       *
       * Specifically, this method merges any adjacent text nodes (i.e., nodes for which `nodeType`
       * is `TEXT_NODE`) into a single node with the combined data. It also removes any empty text
       * nodes.
       *
       * This method iterativly traverses all child nodes to normalize all descendent nodes within
       * the subtree.
       *
       * @throws {DOMException}
       * May throw a DOMException if operations within removeChild or appendData (which are
       * potentially invoked in this method) do not meet their specific constraints.
       * @since Modified in DOM Level 2
       * @see {@link Node.removeChild}
       * @see {@link CharacterData.appendData}
       * @see ../docs/walk-dom.md.
       */
      normalize: function() {
        walkDOM(this, null, {
          enter: function(node) {
            var child = node.firstChild;
            while (child) {
              var next = child.nextSibling;
              if (next !== null && next.nodeType === TEXT_NODE2 && child.nodeType === TEXT_NODE2) {
                node.removeChild(next);
                child.appendData(next.data);
              } else {
                child = next;
              }
            }
            return true;
          }
        });
      },
      /**
       * Checks whether the DOM implementation implements a specific feature and its version.
       *
       * @deprecated
       * Since `DOMImplementation.hasFeature` is deprecated and always returns true.
       * @param {string} feature
       * The package name of the feature to test. This is the same name that can be passed to the
       * method `hasFeature` on `DOMImplementation`.
       * @param {string} version
       * This is the version number of the package name to test.
       * @returns {boolean}
       * Returns true in all cases in the current implementation.
       * @since Introduced in DOM Level 2
       * @see {@link DOMImplementation.hasFeature}
       */
      isSupported: function(feature, version) {
        return this.ownerDocument.implementation.hasFeature(feature, version);
      },
      /**
       * Look up the prefix associated to the given namespace URI, starting from this node.
       * **The default namespace declarations are ignored by this method.**
       * See Namespace Prefix Lookup for details on the algorithm used by this method.
       *
       * **This behavior is different from the in the specs**:
       * - no node type specific handling
       * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
       *
       * @param {string | null} namespaceURI
       * The namespace URI for which to find the associated prefix.
       * @returns {string | null}
       * The associated prefix, if found; otherwise, null.
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespacePrefix
       * @see https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespacePrefixAlgo
       * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
       * @see https://github.com/xmldom/xmldom/issues/322
       * @prettierignore
       */
      lookupPrefix: function(namespaceURI) {
        var el = this;
        while (el) {
          var map = el._nsMap;
          if (map) {
            for (var n in map) {
              if (hasOwn(map, n) && map[n] === namespaceURI) {
                return n;
              }
            }
          }
          el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
        }
        return null;
      },
      /**
       * This function is used to look up the namespace URI associated with the given prefix,
       * starting from this node.
       *
       * **This behavior is different from the in the specs**:
       * - no node type specific handling
       * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
       *
       * @param {string | null} prefix
       * The prefix for which to find the associated namespace URI.
       * @returns {string | null}
       * The associated namespace URI, if found; otherwise, null.
       * @since DOM Level 3
       * @see https://dom.spec.whatwg.org/#dom-node-lookupnamespaceuri
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespaceURI
       * @prettierignore
       */
      lookupNamespaceURI: function(prefix) {
        var el = this;
        while (el) {
          var map = el._nsMap;
          if (map) {
            if (hasOwn(map, prefix)) {
              return map[prefix];
            }
          }
          el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
        }
        return null;
      },
      /**
       * Determines whether the given namespace URI is the default namespace.
       *
       * The function works by looking up the prefix associated with the given namespace URI. If no
       * prefix is found (i.e., the namespace URI is not registered in the namespace map of this
       * node or any of its ancestors), it returns `true`, implying the namespace URI is considered
       * the default.
       *
       * **This behavior is different from the in the specs**:
       * - no node type specific handling
       * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
       *
       * @param {string | null} namespaceURI
       * The namespace URI to be checked.
       * @returns {boolean}
       * Returns true if the given namespace URI is the default namespace, false otherwise.
       * @since DOM Level 3
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-isDefaultNamespace
       * @see https://dom.spec.whatwg.org/#dom-node-isdefaultnamespace
       * @prettierignore
       */
      isDefaultNamespace: function(namespaceURI) {
        var prefix = this.lookupPrefix(namespaceURI);
        return prefix == null;
      },
      /**
       * Compares the reference node with a node with regard to their position in the document and
       * according to the document order.
       *
       * @param {Node} other
       * The node to compare the reference node to.
       * @returns {number}
       * Returns how the node is positioned relatively to the reference node according to the
       * bitmask. 0 if reference node and given node are the same.
       * @since DOM Level 3
       * @see https://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html#Node3-compare
       * @see https://dom.spec.whatwg.org/#dom-node-comparedocumentposition
       */
      compareDocumentPosition: function(other) {
        if (this === other) return 0;
        var node1 = other;
        var node2 = this;
        var attr1 = null;
        var attr2 = null;
        if (node1 instanceof Attr) {
          attr1 = node1;
          node1 = attr1.ownerElement;
        }
        if (node2 instanceof Attr) {
          attr2 = node2;
          node2 = attr2.ownerElement;
          if (attr1 && node1 && node2 === node1) {
            for (var i = 0, attr; attr = node2.attributes[i]; i++) {
              if (attr === attr1)
                return DocumentPosition.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + DocumentPosition.DOCUMENT_POSITION_PRECEDING;
              if (attr === attr2)
                return DocumentPosition.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
            }
          }
        }
        if (!node1 || !node2 || node2.ownerDocument !== node1.ownerDocument) {
          return DocumentPosition.DOCUMENT_POSITION_DISCONNECTED + DocumentPosition.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + (docGUID(node2.ownerDocument) > docGUID(node1.ownerDocument) ? DocumentPosition.DOCUMENT_POSITION_FOLLOWING : DocumentPosition.DOCUMENT_POSITION_PRECEDING);
        }
        if (attr2 && node1 === node2) {
          return DocumentPosition.DOCUMENT_POSITION_CONTAINS + DocumentPosition.DOCUMENT_POSITION_PRECEDING;
        }
        if (attr1 && node1 === node2) {
          return DocumentPosition.DOCUMENT_POSITION_CONTAINED_BY + DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
        }
        var chain1 = [];
        var ancestor1 = node1.parentNode;
        while (ancestor1) {
          if (!attr2 && ancestor1 === node2) {
            return DocumentPosition.DOCUMENT_POSITION_CONTAINED_BY + DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
          }
          chain1.push(ancestor1);
          ancestor1 = ancestor1.parentNode;
        }
        chain1.reverse();
        var chain2 = [];
        var ancestor2 = node2.parentNode;
        while (ancestor2) {
          if (!attr1 && ancestor2 === node1) {
            return DocumentPosition.DOCUMENT_POSITION_CONTAINS + DocumentPosition.DOCUMENT_POSITION_PRECEDING;
          }
          chain2.push(ancestor2);
          ancestor2 = ancestor2.parentNode;
        }
        chain2.reverse();
        var ca = commonAncestor(chain1, chain2);
        for (var n in ca.childNodes) {
          var child = ca.childNodes[n];
          if (child === node2) return DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
          if (child === node1) return DocumentPosition.DOCUMENT_POSITION_PRECEDING;
          if (chain2.indexOf(child) >= 0) return DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
          if (chain1.indexOf(child) >= 0) return DocumentPosition.DOCUMENT_POSITION_PRECEDING;
        }
        return 0;
      }
    };
    function _xmlEncoder(c) {
      return c == "<" && "&lt;" || c == ">" && "&gt;" || c == "&" && "&amp;" || c == '"' && "&quot;" || "&#" + c.charCodeAt() + ";";
    }
    copy(NodeType, Node);
    copy(NodeType, Node.prototype);
    copy(DocumentPosition, Node);
    copy(DocumentPosition, Node.prototype);
    function _visitNode(node, callback) {
      walkDOM(node, null, {
        enter: function(n) {
          return callback(n) ? walkDOM.STOP : true;
        }
      });
    }
    function walkDOM(node, context, callbacks) {
      var stack = [{ node, context, phase: walkDOM.ENTER }];
      while (stack.length > 0) {
        var frame = stack.pop();
        if (frame.phase === walkDOM.ENTER) {
          var childContext = callbacks.enter(frame.node, frame.context);
          if (childContext === walkDOM.STOP) {
            return walkDOM.STOP;
          }
          stack.push({ node: frame.node, context: childContext, phase: walkDOM.EXIT });
          if (childContext === null || childContext === void 0) {
            continue;
          }
          var child = frame.node.lastChild;
          while (child) {
            stack.push({ node: child, context: childContext, phase: walkDOM.ENTER });
            child = child.previousSibling;
          }
        } else {
          if (callbacks.exit) {
            callbacks.exit(frame.node, frame.context);
          }
        }
      }
    }
    walkDOM.STOP = /* @__PURE__ */ Symbol("walkDOM.STOP");
    walkDOM.ENTER = 0;
    walkDOM.EXIT = 1;
    function Document(symbol, options) {
      checkSymbol(symbol);
      var opt = options || {};
      this.ownerDocument = this;
      this.contentType = opt.contentType || MIME_TYPE.XML_APPLICATION;
      this.type = isHTMLMimeType(this.contentType) ? "html" : "xml";
    }
    function _onAddAttribute(doc, el, newAttr) {
      doc && doc._inc++;
      var ns = newAttr.namespaceURI;
      if (ns === NAMESPACE.XMLNS) {
        el._nsMap[newAttr.prefix ? newAttr.localName : ""] = newAttr.value;
      }
    }
    function _onRemoveAttribute(doc, el, newAttr, remove) {
      doc && doc._inc++;
      var ns = newAttr.namespaceURI;
      if (ns === NAMESPACE.XMLNS) {
        delete el._nsMap[newAttr.prefix ? newAttr.localName : ""];
      }
    }
    function _onUpdateChild(doc, parent, newChild) {
      if (doc && doc._inc) {
        doc._inc++;
        var childNodes = parent.childNodes;
        if (newChild && !newChild.nextSibling) {
          childNodes[childNodes.length++] = newChild;
        } else {
          var child = parent.firstChild;
          var i = 0;
          while (child) {
            childNodes[i++] = child;
            child = child.nextSibling;
          }
          childNodes.length = i;
          delete childNodes[childNodes.length];
        }
      }
    }
    function _removeChild(parentNode, child) {
      if (parentNode !== child.parentNode) {
        throw new DOMException(DOMException.NOT_FOUND_ERR, "child's parent is not parent");
      }
      var oldPreviousSibling = child.previousSibling;
      var oldNextSibling = child.nextSibling;
      if (oldPreviousSibling) {
        oldPreviousSibling.nextSibling = oldNextSibling;
      } else {
        parentNode.firstChild = oldNextSibling;
      }
      if (oldNextSibling) {
        oldNextSibling.previousSibling = oldPreviousSibling;
      } else {
        parentNode.lastChild = oldPreviousSibling;
      }
      _onUpdateChild(parentNode.ownerDocument, parentNode);
      child.parentNode = null;
      child.previousSibling = null;
      child.nextSibling = null;
      return child;
    }
    function hasValidParentNodeType(node) {
      return node && (node.nodeType === Node.DOCUMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.ELEMENT_NODE);
    }
    function hasInsertableNodeType(node) {
      return node && (node.nodeType === Node.CDATA_SECTION_NODE || node.nodeType === Node.COMMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.DOCUMENT_TYPE_NODE || node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.PROCESSING_INSTRUCTION_NODE || node.nodeType === Node.TEXT_NODE);
    }
    function isDocTypeNode(node) {
      return node && node.nodeType === Node.DOCUMENT_TYPE_NODE;
    }
    function isElementNode(node) {
      return node && node.nodeType === Node.ELEMENT_NODE;
    }
    function isTextNode(node) {
      return node && node.nodeType === Node.TEXT_NODE;
    }
    function isElementInsertionPossible(doc, child) {
      var parentChildNodes = doc.childNodes || [];
      if (find(parentChildNodes, isElementNode) || isDocTypeNode(child)) {
        return false;
      }
      var docTypeNode = find(parentChildNodes, isDocTypeNode);
      return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
    }
    function isElementReplacementPossible(doc, child) {
      var parentChildNodes = doc.childNodes || [];
      function hasElementChildThatIsNotChild(node) {
        return isElementNode(node) && node !== child;
      }
      if (find(parentChildNodes, hasElementChildThatIsNotChild)) {
        return false;
      }
      var docTypeNode = find(parentChildNodes, isDocTypeNode);
      return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
    }
    function assertPreInsertionValidity1to5(parent, node, child) {
      if (!hasValidParentNodeType(parent)) {
        throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Unexpected parent node type " + parent.nodeType);
      }
      if (child && child.parentNode !== parent) {
        throw new DOMException(DOMException.NOT_FOUND_ERR, "child not in parent");
      }
      if (
        // 4. If `node` is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw a "HierarchyRequestError" DOMException.
        !hasInsertableNodeType(node) || // 5. If either `node` is a Text node and `parent` is a document,
        // the sax parser currently adds top level text nodes, this will be fixed in 0.9.0
        // || (node.nodeType === Node.TEXT_NODE && parent.nodeType === Node.DOCUMENT_NODE)
        // or `node` is a doctype and `parent` is not a document, then throw a "HierarchyRequestError" DOMException.
        isDocTypeNode(node) && parent.nodeType !== Node.DOCUMENT_NODE
      ) {
        throw new DOMException(
          DOMException.HIERARCHY_REQUEST_ERR,
          "Unexpected node type " + node.nodeType + " for parent node type " + parent.nodeType
        );
      }
    }
    function assertPreInsertionValidityInDocument(parent, node, child) {
      var parentChildNodes = parent.childNodes || [];
      var nodeChildNodes = node.childNodes || [];
      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        var nodeChildElements = nodeChildNodes.filter(isElementNode);
        if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
        }
        if (nodeChildElements.length === 1 && !isElementInsertionPossible(parent, child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
        }
      }
      if (isElementNode(node)) {
        if (!isElementInsertionPossible(parent, child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
        }
      }
      if (isDocTypeNode(node)) {
        if (find(parentChildNodes, isDocTypeNode)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
        }
        var parentElementChild = find(parentChildNodes, isElementNode);
        if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
        }
        if (!child && parentElementChild) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Doctype can not be appended since element is present");
        }
      }
    }
    function assertPreReplacementValidityInDocument(parent, node, child) {
      var parentChildNodes = parent.childNodes || [];
      var nodeChildNodes = node.childNodes || [];
      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        var nodeChildElements = nodeChildNodes.filter(isElementNode);
        if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
        }
        if (nodeChildElements.length === 1 && !isElementReplacementPossible(parent, child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
        }
      }
      if (isElementNode(node)) {
        if (!isElementReplacementPossible(parent, child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
        }
      }
      if (isDocTypeNode(node)) {
        let hasDoctypeChildThatIsNotChild = function(node2) {
          return isDocTypeNode(node2) && node2 !== child;
        };
        if (find(parentChildNodes, hasDoctypeChildThatIsNotChild)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
        }
        var parentElementChild = find(parentChildNodes, isElementNode);
        if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
        }
      }
    }
    function _insertBefore(parent, node, child, _inDocumentAssertion) {
      assertPreInsertionValidity1to5(parent, node, child);
      if (parent.nodeType === Node.DOCUMENT_NODE) {
        (_inDocumentAssertion || assertPreInsertionValidityInDocument)(parent, node, child);
      }
      var cp = node.parentNode;
      if (cp) {
        cp.removeChild(node);
      }
      if (node.nodeType === DOCUMENT_FRAGMENT_NODE) {
        var newFirst = node.firstChild;
        if (newFirst == null) {
          return node;
        }
        var newLast = node.lastChild;
      } else {
        newFirst = newLast = node;
      }
      var pre = child ? child.previousSibling : parent.lastChild;
      newFirst.previousSibling = pre;
      newLast.nextSibling = child;
      if (pre) {
        pre.nextSibling = newFirst;
      } else {
        parent.firstChild = newFirst;
      }
      if (child == null) {
        parent.lastChild = newLast;
      } else {
        child.previousSibling = newLast;
      }
      do {
        newFirst.parentNode = parent;
      } while (newFirst !== newLast && (newFirst = newFirst.nextSibling));
      _onUpdateChild(parent.ownerDocument || parent, parent, node);
      if (node.nodeType == DOCUMENT_FRAGMENT_NODE) {
        node.firstChild = node.lastChild = null;
      }
      return node;
    }
    Document.prototype = {
      /**
       * The implementation that created this document.
       *
       * @type DOMImplementation
       * @readonly
       */
      implementation: null,
      nodeName: "#document",
      nodeType: DOCUMENT_NODE,
      /**
       * The DocumentType node of the document.
       *
       * @type DocumentType
       * @readonly
       */
      doctype: null,
      documentElement: null,
      _inc: 1,
      insertBefore: function(newChild, refChild) {
        if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
          var child = newChild.firstChild;
          while (child) {
            var next = child.nextSibling;
            this.insertBefore(child, refChild);
            child = next;
          }
          return newChild;
        }
        _insertBefore(this, newChild, refChild);
        newChild.ownerDocument = this;
        if (this.documentElement === null && newChild.nodeType === ELEMENT_NODE) {
          this.documentElement = newChild;
        }
        return newChild;
      },
      removeChild: function(oldChild) {
        var removed = _removeChild(this, oldChild);
        if (removed === this.documentElement) {
          this.documentElement = null;
        }
        return removed;
      },
      replaceChild: function(newChild, oldChild) {
        _insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
        newChild.ownerDocument = this;
        if (oldChild) {
          this.removeChild(oldChild);
        }
        if (isElementNode(newChild)) {
          this.documentElement = newChild;
        }
      },
      /**
       * Imports a node from another document into this document, creating a new copy owned by this
       * document. The source node and its subtree are not modified.
       *
       * @param {Node} importedNode
       * The node to import.
       * @param {boolean} deep
       * If true, the contents of the node are recursively imported.
       * If false, only the node itself (and its attributes, if it is an element) are imported.
       * @returns {Node}
       * Returns the newly created import of the node.
       * @see {@link importNode}
       * @see {@link https://dom.spec.whatwg.org/#dom-document-importnode}
       */
      importNode: function(importedNode, deep) {
        return importNode(this, importedNode, deep);
      },
      // Introduced in DOM Level 2:
      getElementById: function(id) {
        var rtv = null;
        _visitNode(this.documentElement, function(node) {
          if (node.nodeType == ELEMENT_NODE) {
            if (node.getAttribute("id") == id) {
              rtv = node;
              return true;
            }
          }
        });
        return rtv;
      },
      /**
       * Creates a new `Element` that is owned by this `Document`.
       * In HTML Documents `localName` is the lower cased `tagName`,
       * otherwise no transformation is being applied.
       * When `contentType` implies the HTML namespace, it will be set as `namespaceURI`.
       *
       * __This implementation differs from the specification:__ - The provided name is not checked
       * against the `Name` production,
       * so no related error will be thrown.
       * - There is no interface `HTMLElement`, it is always an `Element`.
       * - There is no support for a second argument to indicate using custom elements.
       *
       * @param {string} tagName
       * @returns {Element}
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
       * @see https://dom.spec.whatwg.org/#dom-document-createelement
       * @see https://dom.spec.whatwg.org/#concept-create-element
       */
      createElement: function(tagName) {
        var node = new Element(PDC);
        node.ownerDocument = this;
        if (this.type === "html") {
          tagName = tagName.toLowerCase();
        }
        if (hasDefaultHTMLNamespace(this.contentType)) {
          node.namespaceURI = NAMESPACE.HTML;
        }
        node.nodeName = tagName;
        node.tagName = tagName;
        node.localName = tagName;
        node.childNodes = new NodeList();
        var attrs = node.attributes = new NamedNodeMap();
        attrs._ownerElement = node;
        return node;
      },
      /**
       * @returns {DocumentFragment}
       */
      createDocumentFragment: function() {
        var node = new DocumentFragment(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        return node;
      },
      /**
       * @param {string} data
       * @returns {Text}
       */
      createTextNode: function(data) {
        var node = new Text(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.appendData(data);
        return node;
      },
      /**
       * @param {string} data
       * @returns {Comment}
       * @see https://dom.spec.whatwg.org/#dom-document-createcomment
       * @see https://www.w3.org/TR/xml/#NT-Comment XML 1.0 production [15]
       * @see https://www.w3.org/TR/DOM-Parsing/#dfn-concept-serialize-xml §3.2.1.3
       *
       *      Note: no validation is performed at creation time. When the resulting document is
       *      serialized with `requireWellFormed: true`, the serializer throws `InvalidStateError`
       *      if the comment data contains `--` anywhere, ends with `-`, or contains characters
       *      outside the XML Char production (W3C DOM Parsing §3.2.1.3). Without that option the
       *      data is emitted verbatim.
       */
      createComment: function(data) {
        var node = new Comment(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.appendData(data);
        return node;
      },
      /**
       * Returns a new CDATASection node whose data is `data`.
       *
       * __This implementation differs from the specification:__ - calling this method on an HTML
       * document does not throw `NotSupportedError`.
       *
       * @param {string} data
       * @returns {CDATASection}
       * @throws {DOMException}
       * With code `INVALID_CHARACTER_ERR` if `data` contains `"]]>"`.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createCDATASection
       * @see https://dom.spec.whatwg.org/#dom-document-createcdatasection
       */
      createCDATASection: function(data) {
        if (data.indexOf("]]>") !== -1) {
          throw new DOMException(DOMException.INVALID_CHARACTER_ERR, 'data contains "]]>"');
        }
        var node = new CDATASection(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.appendData(data);
        return node;
      },
      /**
       * Returns a ProcessingInstruction node whose target is target and data is data.
       *
       * __This behavior is slightly different from the in the specs__:
       * - it does not do any input validation on the arguments and doesn't throw
       * "InvalidCharacterError".
       *
       * Note: When the resulting document is serialized with `requireWellFormed: true`, the
       * serializer throws `InvalidStateError` if `.target` contains `:` or is an ASCII
       * case-insensitive match for `"xml"`, or if `.data` contains `?>` or characters outside the
       * XML Char production (W3C DOM Parsing §3.2.1.7). Without that option the data is emitted
       * verbatim.
       *
       * @param {string} target
       * @param {string} data
       * @returns {ProcessingInstruction}
       * @see https://developer.mozilla.org/docs/Web/API/Document/createProcessingInstruction
       * @see https://dom.spec.whatwg.org/#dom-document-createprocessinginstruction
       * @see https://www.w3.org/TR/DOM-Parsing/#dfn-concept-serialize-xml §3.2.1.7
       */
      createProcessingInstruction: function(target, data) {
        var node = new ProcessingInstruction(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.nodeName = node.target = target;
        node.nodeValue = node.data = data;
        return node;
      },
      /**
       * Creates an `Attr` node that is owned by this document.
       * In HTML Documents `localName` is the lower cased `name`,
       * otherwise no transformation is being applied.
       *
       * __This implementation differs from the specification:__ - The provided name is not checked
       * against the `Name` production,
       * so no related error will be thrown.
       *
       * @param {string} name
       * @returns {Attr}
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createAttribute
       * @see https://dom.spec.whatwg.org/#dom-document-createattribute
       */
      createAttribute: function(name) {
        if (!g.QName_exact.test(name)) {
          throw new DOMException(DOMException.INVALID_CHARACTER_ERR, 'invalid character in name "' + name + '"');
        }
        if (this.type === "html") {
          name = name.toLowerCase();
        }
        return this._createAttribute(name);
      },
      _createAttribute: function(name) {
        var node = new Attr(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.name = name;
        node.nodeName = name;
        node.localName = name;
        node.specified = true;
        return node;
      },
      /**
       * Creates an EntityReference object.
       * The current implementation does not fill the `childNodes` with those of the corresponding
       * `Entity`
       *
       * @deprecated
       * In DOM Level 4.
       * @param {string} name
       * The name of the entity to reference. No namespace well-formedness checks are performed.
       * @returns {EntityReference}
       * @throws {DOMException}
       * With code `INVALID_CHARACTER_ERR` when `name` is not valid.
       * @throws {DOMException}
       * with code `NOT_SUPPORTED_ERR` when the document is of type `html`
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-392B75AE
       */
      createEntityReference: function(name) {
        if (!g.Name.test(name)) {
          throw new DOMException(DOMException.INVALID_CHARACTER_ERR, 'not a valid xml name "' + name + '"');
        }
        if (this.type === "html") {
          throw new DOMException("document is an html document", DOMExceptionName.NotSupportedError);
        }
        var node = new EntityReference(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.nodeName = name;
        return node;
      },
      // Introduced in DOM Level 2:
      /**
       * @param {string} namespaceURI
       * @param {string} qualifiedName
       * @returns {Element}
       */
      createElementNS: function(namespaceURI, qualifiedName) {
        var validated = validateAndExtract(namespaceURI, qualifiedName);
        var node = new Element(PDC);
        var attrs = node.attributes = new NamedNodeMap();
        node.childNodes = new NodeList();
        node.ownerDocument = this;
        node.nodeName = qualifiedName;
        node.tagName = qualifiedName;
        node.namespaceURI = validated[0];
        node.prefix = validated[1];
        node.localName = validated[2];
        attrs._ownerElement = node;
        return node;
      },
      // Introduced in DOM Level 2:
      /**
       * @param {string} namespaceURI
       * @param {string} qualifiedName
       * @returns {Attr}
       */
      createAttributeNS: function(namespaceURI, qualifiedName) {
        var validated = validateAndExtract(namespaceURI, qualifiedName);
        var node = new Attr(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.nodeName = qualifiedName;
        node.name = qualifiedName;
        node.specified = true;
        node.namespaceURI = validated[0];
        node.prefix = validated[1];
        node.localName = validated[2];
        return node;
      }
    };
    _extends(Document, Node);
    function Element(symbol) {
      checkSymbol(symbol);
      this._nsMap = /* @__PURE__ */ Object.create(null);
    }
    Element.prototype = {
      nodeType: ELEMENT_NODE,
      /**
       * The attributes of this element.
       *
       * @type {NamedNodeMap | null}
       */
      attributes: null,
      getQualifiedName: function() {
        return this.prefix ? this.prefix + ":" + this.localName : this.localName;
      },
      _isInHTMLDocumentAndNamespace: function() {
        return this.ownerDocument.type === "html" && this.namespaceURI === NAMESPACE.HTML;
      },
      /**
       * Implementaton of Level2 Core function hasAttributes.
       *
       * @returns {boolean}
       * True if attribute list is not empty.
       * @see https://www.w3.org/TR/DOM-Level-2-Core/#core-ID-NodeHasAttrs
       */
      hasAttributes: function() {
        return !!(this.attributes && this.attributes.length);
      },
      hasAttribute: function(name) {
        return !!this.getAttributeNode(name);
      },
      /**
       * Returns element’s first attribute whose qualified name is `name`, and `null`
       * if there is no such attribute.
       *
       * @param {string} name
       * @returns {string | null}
       */
      getAttribute: function(name) {
        var attr = this.getAttributeNode(name);
        return attr ? attr.value : null;
      },
      getAttributeNode: function(name) {
        if (this._isInHTMLDocumentAndNamespace()) {
          name = name.toLowerCase();
        }
        return this.attributes.getNamedItem(name);
      },
      /**
       * Sets the value of element’s first attribute whose qualified name is qualifiedName to value.
       *
       * @param {string} name
       * @param {string} value
       */
      setAttribute: function(name, value) {
        if (this._isInHTMLDocumentAndNamespace()) {
          name = name.toLowerCase();
        }
        var attr = this.getAttributeNode(name);
        if (attr) {
          attr.value = attr.nodeValue = "" + value;
        } else {
          attr = this.ownerDocument._createAttribute(name);
          attr.value = attr.nodeValue = "" + value;
          this.setAttributeNode(attr);
        }
      },
      removeAttribute: function(name) {
        var attr = this.getAttributeNode(name);
        attr && this.removeAttributeNode(attr);
      },
      setAttributeNode: function(newAttr) {
        return this.attributes.setNamedItem(newAttr);
      },
      setAttributeNodeNS: function(newAttr) {
        return this.attributes.setNamedItemNS(newAttr);
      },
      removeAttributeNode: function(oldAttr) {
        return this.attributes.removeNamedItem(oldAttr.nodeName);
      },
      //get real attribute name,and remove it by removeAttributeNode
      removeAttributeNS: function(namespaceURI, localName) {
        var old = this.getAttributeNodeNS(namespaceURI, localName);
        old && this.removeAttributeNode(old);
      },
      hasAttributeNS: function(namespaceURI, localName) {
        return this.getAttributeNodeNS(namespaceURI, localName) != null;
      },
      /**
       * Returns element’s attribute whose namespace is `namespaceURI` and local name is
       * `localName`,
       * or `null` if there is no such attribute.
       *
       * @param {string} namespaceURI
       * @param {string} localName
       * @returns {string | null}
       */
      getAttributeNS: function(namespaceURI, localName) {
        var attr = this.getAttributeNodeNS(namespaceURI, localName);
        return attr ? attr.value : null;
      },
      /**
       * Sets the value of element’s attribute whose namespace is `namespaceURI` and local name is
       * `localName` to value.
       *
       * @param {string} namespaceURI
       * @param {string} qualifiedName
       * @param {string} value
       * @see https://dom.spec.whatwg.org/#dom-element-setattributens
       */
      setAttributeNS: function(namespaceURI, qualifiedName, value) {
        var validated = validateAndExtract(namespaceURI, qualifiedName);
        var localName = validated[2];
        var attr = this.getAttributeNodeNS(namespaceURI, localName);
        if (attr) {
          attr.value = attr.nodeValue = "" + value;
        } else {
          attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
          attr.value = attr.nodeValue = "" + value;
          this.setAttributeNode(attr);
        }
      },
      getAttributeNodeNS: function(namespaceURI, localName) {
        return this.attributes.getNamedItemNS(namespaceURI, localName);
      },
      /**
       * Returns a LiveNodeList of all child elements which have **all** of the given class name(s).
       *
       * Returns an empty list if `classNames` is an empty string or only contains HTML white space
       * characters.
       *
       * Warning: This returns a live LiveNodeList.
       * Changes in the DOM will reflect in the array as the changes occur.
       * If an element selected by this array no longer qualifies for the selector,
       * it will automatically be removed. Be aware of this for iteration purposes.
       *
       * @param {string} classNames
       * Is a string representing the class name(s) to match; multiple class names are separated by
       * (ASCII-)whitespace.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
       * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
       */
      getElementsByClassName: function(classNames) {
        var classNamesSet = toOrderedSet(classNames);
        return new LiveNodeList(this, function(base) {
          var ls = [];
          if (classNamesSet.length > 0) {
            _visitNode(base, function(node) {
              if (node !== base && node.nodeType === ELEMENT_NODE) {
                var nodeClassNames = node.getAttribute("class");
                if (nodeClassNames) {
                  var matches = classNames === nodeClassNames;
                  if (!matches) {
                    var nodeClassNamesSet = toOrderedSet(nodeClassNames);
                    matches = classNamesSet.every(arrayIncludes(nodeClassNamesSet));
                  }
                  if (matches) {
                    ls.push(node);
                  }
                }
              }
            });
          }
          return ls;
        });
      },
      /**
       * Returns a LiveNodeList of elements with the given qualifiedName.
       * Searching for all descendants can be done by passing `*` as `qualifiedName`.
       *
       * All descendants of the specified element are searched, but not the element itself.
       * The returned list is live, which means it updates itself with the DOM tree automatically.
       * Therefore, there is no need to call `Element.getElementsByTagName()`
       * with the same element and arguments repeatedly if the DOM changes in between calls.
       *
       * When called on an HTML element in an HTML document,
       * `getElementsByTagName` lower-cases the argument before searching for it.
       * This is undesirable when trying to match camel-cased SVG elements (such as
       * `<linearGradient>`) in an HTML document.
       * Instead, use `Element.getElementsByTagNameNS()`,
       * which preserves the capitalization of the tag name.
       *
       * `Element.getElementsByTagName` is similar to `Document.getElementsByTagName()`,
       * except that it only searches for elements that are descendants of the specified element.
       *
       * @param {string} qualifiedName
       * @returns {LiveNodeList}
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName
       * @see https://dom.spec.whatwg.org/#concept-getelementsbytagname
       */
      getElementsByTagName: function(qualifiedName) {
        var isHTMLDocument = (this.nodeType === DOCUMENT_NODE ? this : this.ownerDocument).type === "html";
        var lowerQualifiedName = qualifiedName.toLowerCase();
        return new LiveNodeList(this, function(base) {
          var ls = [];
          _visitNode(base, function(node) {
            if (node === base || node.nodeType !== ELEMENT_NODE) {
              return;
            }
            if (qualifiedName === "*") {
              ls.push(node);
            } else {
              var nodeQualifiedName = node.getQualifiedName();
              var matchingQName = isHTMLDocument && node.namespaceURI === NAMESPACE.HTML ? lowerQualifiedName : qualifiedName;
              if (nodeQualifiedName === matchingQName) {
                ls.push(node);
              }
            }
          });
          return ls;
        });
      },
      getElementsByTagNameNS: function(namespaceURI, localName) {
        return new LiveNodeList(this, function(base) {
          var ls = [];
          _visitNode(base, function(node) {
            if (node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === "*" || node.namespaceURI === namespaceURI) && (localName === "*" || node.localName == localName)) {
              ls.push(node);
            }
          });
          return ls;
        });
      }
    };
    Document.prototype.getElementsByClassName = Element.prototype.getElementsByClassName;
    Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
    Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;
    _extends(Element, Node);
    function Attr(symbol) {
      checkSymbol(symbol);
      this.namespaceURI = null;
      this.prefix = null;
      this.ownerElement = null;
    }
    Attr.prototype.nodeType = ATTRIBUTE_NODE;
    _extends(Attr, Node);
    function CharacterData(symbol) {
      checkSymbol(symbol);
    }
    CharacterData.prototype = {
      data: "",
      substringData: function(offset, count) {
        return this.data.substring(offset, offset + count);
      },
      appendData: function(text) {
        text = this.data + text;
        this.nodeValue = this.data = text;
        this.length = text.length;
      },
      insertData: function(offset, text) {
        this.replaceData(offset, 0, text);
      },
      deleteData: function(offset, count) {
        this.replaceData(offset, count, "");
      },
      replaceData: function(offset, count, text) {
        var start = this.data.substring(0, offset);
        var end = this.data.substring(offset + count);
        text = start + text + end;
        this.nodeValue = this.data = text;
        this.length = text.length;
      }
    };
    _extends(CharacterData, Node);
    function Text(symbol) {
      checkSymbol(symbol);
    }
    Text.prototype = {
      nodeName: "#text",
      nodeType: TEXT_NODE2,
      splitText: function(offset) {
        var text = this.data;
        var newText = text.substring(offset);
        text = text.substring(0, offset);
        this.data = this.nodeValue = text;
        this.length = text.length;
        var newNode = this.ownerDocument.createTextNode(newText);
        if (this.parentNode) {
          this.parentNode.insertBefore(newNode, this.nextSibling);
        }
        return newNode;
      }
    };
    _extends(Text, CharacterData);
    function Comment(symbol) {
      checkSymbol(symbol);
    }
    Comment.prototype = {
      nodeName: "#comment",
      nodeType: COMMENT_NODE2
    };
    _extends(Comment, CharacterData);
    function CDATASection(symbol) {
      checkSymbol(symbol);
    }
    CDATASection.prototype = {
      nodeName: "#cdata-section",
      nodeType: CDATA_SECTION_NODE
    };
    _extends(CDATASection, Text);
    function DocumentType(symbol) {
      checkSymbol(symbol);
    }
    DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
    _extends(DocumentType, Node);
    function Notation(symbol) {
      checkSymbol(symbol);
    }
    Notation.prototype.nodeType = NOTATION_NODE;
    _extends(Notation, Node);
    function Entity(symbol) {
      checkSymbol(symbol);
    }
    Entity.prototype.nodeType = ENTITY_NODE;
    _extends(Entity, Node);
    function EntityReference(symbol) {
      checkSymbol(symbol);
    }
    EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
    _extends(EntityReference, Node);
    function DocumentFragment(symbol) {
      checkSymbol(symbol);
    }
    DocumentFragment.prototype.nodeName = "#document-fragment";
    DocumentFragment.prototype.nodeType = DOCUMENT_FRAGMENT_NODE;
    _extends(DocumentFragment, Node);
    function ProcessingInstruction(symbol) {
      checkSymbol(symbol);
    }
    ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
    _extends(ProcessingInstruction, CharacterData);
    function XMLSerializer() {
    }
    XMLSerializer.prototype.serializeToString = function(node, options) {
      return nodeSerializeToString.call(node, options);
    };
    Node.prototype.toString = nodeSerializeToString;
    function nodeSerializeToString(options) {
      var opts;
      if (typeof options === "function") {
        opts = { requireWellFormed: false, splitCDATASections: true, nodeFilter: options };
      } else if (options != null) {
        opts = {
          requireWellFormed: !!options.requireWellFormed,
          splitCDATASections: options.splitCDATASections !== false,
          nodeFilter: options.nodeFilter || null
        };
      } else {
        opts = { requireWellFormed: false, splitCDATASections: true, nodeFilter: null };
      }
      var buf = [];
      var refNode = this.nodeType === DOCUMENT_NODE && this.documentElement || this;
      var prefix = refNode.prefix;
      var uri = refNode.namespaceURI;
      if (uri && prefix == null) {
        var prefix = refNode.lookupPrefix(uri);
        if (prefix == null) {
          var visibleNamespaces = [
            { namespace: uri, prefix: null }
            //{namespace:uri,prefix:''}
          ];
        }
      }
      serializeToString(this, buf, visibleNamespaces, opts);
      return buf.join("");
    }
    function needNamespaceDefine(node, isHTML, visibleNamespaces) {
      var prefix = node.prefix || "";
      var uri = node.namespaceURI;
      if (!uri) {
        return false;
      }
      if (prefix === "xml" && uri === NAMESPACE.XML || uri === NAMESPACE.XMLNS) {
        return false;
      }
      var i = visibleNamespaces.length;
      while (i--) {
        var ns = visibleNamespaces[i];
        if (ns.prefix === prefix) {
          return ns.namespace !== uri;
        }
      }
      return true;
    }
    function addSerializedAttribute(buf, qualifiedName, value) {
      buf.push(" ", qualifiedName, '="', value.replace(/[<>&"\t\n\r]/g, _xmlEncoder), '"');
    }
    function serializeToString(node, buf, visibleNamespaces, opts) {
      if (!visibleNamespaces) {
        visibleNamespaces = [];
      }
      var nodeFilter = opts.nodeFilter;
      var requireWellFormed = opts.requireWellFormed;
      var splitCDATASections = opts.splitCDATASections;
      var doc = node.nodeType === DOCUMENT_NODE ? node : node.ownerDocument;
      var isHTML = doc.type === "html";
      walkDOM(
        node,
        { ns: visibleNamespaces },
        {
          enter: function(n, ctx) {
            var namespaces = ctx.ns;
            if (nodeFilter) {
              n = nodeFilter(n);
              if (n) {
                if (typeof n == "string") {
                  buf.push(n);
                  return null;
                }
              } else {
                return null;
              }
            }
            switch (n.nodeType) {
              case ELEMENT_NODE:
                var attrs = n.attributes;
                var len = attrs.length;
                var nodeName = n.tagName;
                var prefixedNodeName = nodeName;
                if (!isHTML && !n.prefix && n.namespaceURI) {
                  var defaultNS;
                  for (var ai = 0; ai < attrs.length; ai++) {
                    if (attrs.item(ai).name === "xmlns") {
                      defaultNS = attrs.item(ai).value;
                      break;
                    }
                  }
                  if (!defaultNS) {
                    for (var nsi = namespaces.length - 1; nsi >= 0; nsi--) {
                      var nsEntry = namespaces[nsi];
                      if (nsEntry.prefix === "" && nsEntry.namespace === n.namespaceURI) {
                        defaultNS = nsEntry.namespace;
                        break;
                      }
                    }
                  }
                  if (defaultNS !== n.namespaceURI) {
                    for (var nsi = namespaces.length - 1; nsi >= 0; nsi--) {
                      var nsEntry = namespaces[nsi];
                      if (nsEntry.namespace === n.namespaceURI) {
                        if (nsEntry.prefix) {
                          prefixedNodeName = nsEntry.prefix + ":" + nodeName;
                        }
                        break;
                      }
                    }
                  }
                }
                buf.push("<", prefixedNodeName);
                var childNamespaces = namespaces.slice();
                for (var i = 0; i < len; i++) {
                  var attr = attrs.item(i);
                  if (attr.prefix == "xmlns") {
                    childNamespaces.push({
                      prefix: attr.localName,
                      namespace: attr.value
                    });
                  } else if (attr.nodeName == "xmlns") {
                    childNamespaces.push({ prefix: "", namespace: attr.value });
                  }
                }
                for (var i = 0; i < len; i++) {
                  var attr = attrs.item(i);
                  if (needNamespaceDefine(attr, isHTML, childNamespaces)) {
                    var attrPrefix = attr.prefix || "";
                    var uri = attr.namespaceURI;
                    addSerializedAttribute(buf, attrPrefix ? "xmlns:" + attrPrefix : "xmlns", uri);
                    childNamespaces.push({ prefix: attrPrefix, namespace: uri });
                  }
                  var filteredAttr = nodeFilter ? nodeFilter(attr) : attr;
                  if (filteredAttr) {
                    if (typeof filteredAttr === "string") {
                      buf.push(filteredAttr);
                    } else {
                      addSerializedAttribute(buf, filteredAttr.name, filteredAttr.value);
                    }
                  }
                }
                if (nodeName === prefixedNodeName && needNamespaceDefine(n, isHTML, childNamespaces)) {
                  var nodePrefix = n.prefix || "";
                  var uri = n.namespaceURI;
                  addSerializedAttribute(buf, nodePrefix ? "xmlns:" + nodePrefix : "xmlns", uri);
                  childNamespaces.push({ prefix: nodePrefix, namespace: uri });
                }
                var canCloseTag = !n.firstChild;
                if (canCloseTag && (isHTML || n.namespaceURI === NAMESPACE.HTML)) {
                  canCloseTag = isHTMLVoidElement(nodeName);
                }
                if (canCloseTag) {
                  buf.push("/>");
                  return null;
                }
                buf.push(">");
                if (isHTML && isHTMLRawTextElement(nodeName)) {
                  var child = n.firstChild;
                  while (child) {
                    if (child.data) {
                      buf.push(child.data);
                    } else {
                      serializeToString(child, buf, childNamespaces.slice(), opts);
                    }
                    child = child.nextSibling;
                  }
                  buf.push("</", prefixedNodeName, ">");
                  return null;
                }
                return { ns: childNamespaces, tag: prefixedNodeName };
              case DOCUMENT_NODE:
              case DOCUMENT_FRAGMENT_NODE:
                if (requireWellFormed && n.nodeType === DOCUMENT_NODE && n.documentElement == null) {
                  throw new DOMException("The Document has no documentElement", DOMExceptionName.InvalidStateError);
                }
                return { ns: namespaces };
              case ATTRIBUTE_NODE:
                addSerializedAttribute(buf, n.name, n.value);
                return null;
              case TEXT_NODE2:
                if (requireWellFormed && g.InvalidChar.test(n.data)) {
                  throw new DOMException(
                    "The Text node data contains characters outside the XML Char production",
                    DOMExceptionName.InvalidStateError
                  );
                }
                buf.push(n.data.replace(/[<&>]/g, _xmlEncoder));
                return null;
              case CDATA_SECTION_NODE:
                if (requireWellFormed && n.data.indexOf("]]>") !== -1) {
                  throw new DOMException('The CDATASection data contains "]]>"', DOMExceptionName.InvalidStateError);
                }
                if (splitCDATASections) {
                  buf.push(g.CDATA_START, n.data.replace(/]]>/g, "]]]]><![CDATA[>"), g.CDATA_END);
                } else {
                  buf.push(g.CDATA_START, n.data, g.CDATA_END);
                }
                return null;
              case COMMENT_NODE2:
                if (requireWellFormed) {
                  if (g.InvalidChar.test(n.data)) {
                    throw new DOMException(
                      "The comment node data contains characters outside the XML Char production",
                      DOMExceptionName.InvalidStateError
                    );
                  }
                  if (n.data.indexOf("--") !== -1 || n.data[n.data.length - 1] === "-") {
                    throw new DOMException(
                      'The comment node data contains "--" or ends with "-"',
                      DOMExceptionName.InvalidStateError
                    );
                  }
                }
                buf.push(g.COMMENT_START, n.data, g.COMMENT_END);
                return null;
              case DOCUMENT_TYPE_NODE:
                var pubid = n.publicId;
                var sysid = n.systemId;
                if (requireWellFormed) {
                  if (pubid && !g.PubidLiteral_match.test(pubid)) {
                    throw new DOMException("DocumentType publicId is not a valid PubidLiteral", DOMExceptionName.InvalidStateError);
                  }
                  if (sysid && sysid !== "." && !g.SystemLiteral_match.test(sysid)) {
                    throw new DOMException("DocumentType systemId is not a valid SystemLiteral", DOMExceptionName.InvalidStateError);
                  }
                  if (n.internalSubset && n.internalSubset.indexOf("]>") !== -1) {
                    throw new DOMException('DocumentType internalSubset contains "]>"', DOMExceptionName.InvalidStateError);
                  }
                }
                buf.push(g.DOCTYPE_DECL_START, " ", n.name);
                if (pubid) {
                  buf.push(" ", g.PUBLIC, " ", pubid);
                  if (sysid && sysid !== ".") {
                    buf.push(" ", sysid);
                  }
                } else if (sysid && sysid !== ".") {
                  buf.push(" ", g.SYSTEM, " ", sysid);
                }
                if (n.internalSubset) {
                  buf.push(" [", n.internalSubset, "]");
                }
                buf.push(">");
                return null;
              case PROCESSING_INSTRUCTION_NODE:
                if (requireWellFormed) {
                  if (n.target.indexOf(":") !== -1 || n.target.toLowerCase() === "xml") {
                    throw new DOMException("The ProcessingInstruction target is not well-formed", DOMExceptionName.InvalidStateError);
                  }
                  if (g.InvalidChar.test(n.data)) {
                    throw new DOMException(
                      "The ProcessingInstruction data contains characters outside the XML Char production",
                      DOMExceptionName.InvalidStateError
                    );
                  }
                  if (n.data.indexOf("?>") !== -1) {
                    throw new DOMException('The ProcessingInstruction data contains "?>"', DOMExceptionName.InvalidStateError);
                  }
                }
                buf.push("<?", n.target, " ", n.data, "?>");
                return null;
              case ENTITY_REFERENCE_NODE:
                buf.push("&", n.nodeName, ";");
                return null;
              //case ENTITY_NODE:
              //case NOTATION_NODE:
              default:
                buf.push("??", n.nodeName);
                return null;
            }
          },
          exit: function(n, childCtx) {
            if (childCtx && childCtx.tag) {
              buf.push("</", childCtx.tag, ">");
            }
          }
        }
      );
    }
    function importNode(doc, node, deep) {
      var destRoot;
      walkDOM(node, null, {
        enter: function(srcNode, destParent) {
          var destNode = srcNode.cloneNode(false);
          destNode.ownerDocument = doc;
          destNode.parentNode = null;
          if (destParent === null) {
            destRoot = destNode;
          } else {
            destParent.appendChild(destNode);
          }
          var shouldDeep = srcNode.nodeType === ATTRIBUTE_NODE || deep;
          return shouldDeep ? destNode : null;
        }
      });
      return destRoot;
    }
    function cloneNode(doc, node, deep) {
      var destRoot;
      walkDOM(node, null, {
        enter: function(srcNode, destParent) {
          var destNode = new srcNode.constructor(PDC);
          for (var n in srcNode) {
            if (hasOwn(srcNode, n)) {
              var v = srcNode[n];
              if (typeof v != "object") {
                if (v != destNode[n]) {
                  destNode[n] = v;
                }
              }
            }
          }
          if (srcNode.childNodes) {
            destNode.childNodes = new NodeList();
          }
          destNode.ownerDocument = doc;
          var shouldDeep = deep;
          switch (destNode.nodeType) {
            case ELEMENT_NODE:
              var attrs = srcNode.attributes;
              var attrs2 = destNode.attributes = new NamedNodeMap();
              var len = attrs.length;
              attrs2._ownerElement = destNode;
              for (var i = 0; i < len; i++) {
                destNode.setAttributeNode(cloneNode(doc, attrs.item(i), true));
              }
              break;
            case ATTRIBUTE_NODE:
              shouldDeep = true;
          }
          if (destParent !== null) {
            destParent.appendChild(destNode);
          } else {
            destRoot = destNode;
          }
          return shouldDeep ? destNode : null;
        }
      });
      return destRoot;
    }
    function __set__(object, key, value) {
      object[key] = value;
    }
    function childrenRefresh(node) {
      var ls = [];
      var child = node.firstChild;
      while (child) {
        if (child.nodeType === ELEMENT_NODE) {
          ls.push(child);
        }
        child = child.nextSibling;
      }
      return ls;
    }
    try {
      if (Object.defineProperty) {
        Object.defineProperty(LiveNodeList.prototype, "length", {
          get: function() {
            _updateLiveList(this);
            return this.$$length;
          }
        });
        Object.defineProperty(Node.prototype, "textContent", {
          get: function() {
            if (this.nodeType === ELEMENT_NODE || this.nodeType === DOCUMENT_FRAGMENT_NODE) {
              var buf = [];
              walkDOM(this, null, {
                enter: function(n) {
                  if (n.nodeType === ELEMENT_NODE || n.nodeType === DOCUMENT_FRAGMENT_NODE) {
                    return true;
                  }
                  if (n.nodeType === PROCESSING_INSTRUCTION_NODE || n.nodeType === COMMENT_NODE2) {
                    return null;
                  }
                  buf.push(n.nodeValue);
                }
              });
              return buf.join("");
            }
            return this.nodeValue;
          },
          set: function(data) {
            switch (this.nodeType) {
              case ELEMENT_NODE:
              case DOCUMENT_FRAGMENT_NODE:
                while (this.firstChild) {
                  this.removeChild(this.firstChild);
                }
                if (data || String(data)) {
                  this.appendChild(this.ownerDocument.createTextNode(data));
                }
                break;
              default:
                this.data = data;
                this.value = data;
                this.nodeValue = data;
            }
          }
        });
        Object.defineProperty(Element.prototype, "children", {
          get: function() {
            return new LiveNodeList(this, childrenRefresh);
          }
        });
        Object.defineProperty(Document.prototype, "children", {
          get: function() {
            return new LiveNodeList(this, childrenRefresh);
          }
        });
        Object.defineProperty(DocumentFragment.prototype, "children", {
          get: function() {
            return new LiveNodeList(this, childrenRefresh);
          }
        });
        __set__ = function(object, key, value) {
          object["$$" + key] = value;
        };
      }
    } catch (e) {
    }
    exports2._updateLiveList = _updateLiveList;
    exports2.Attr = Attr;
    exports2.CDATASection = CDATASection;
    exports2.CharacterData = CharacterData;
    exports2.Comment = Comment;
    exports2.Document = Document;
    exports2.DocumentFragment = DocumentFragment;
    exports2.DocumentType = DocumentType;
    exports2.DOMImplementation = DOMImplementation;
    exports2.Element = Element;
    exports2.Entity = Entity;
    exports2.EntityReference = EntityReference;
    exports2.LiveNodeList = LiveNodeList;
    exports2.NamedNodeMap = NamedNodeMap;
    exports2.Node = Node;
    exports2.NodeList = NodeList;
    exports2.Notation = Notation;
    exports2.Text = Text;
    exports2.ProcessingInstruction = ProcessingInstruction;
    exports2.walkDOM = walkDOM;
    exports2.XMLSerializer = XMLSerializer;
  }
});

// node_modules/.pnpm/@xmldom+xmldom@0.9.10/node_modules/@xmldom/xmldom/lib/entities.js
var require_entities = __commonJS({
  "node_modules/.pnpm/@xmldom+xmldom@0.9.10/node_modules/@xmldom/xmldom/lib/entities.js"(exports2) {
    "use strict";
    var freeze = require_conventions().freeze;
    exports2.XML_ENTITIES = freeze({
      amp: "&",
      apos: "'",
      gt: ">",
      lt: "<",
      quot: '"'
    });
    exports2.HTML_ENTITIES = freeze({
      Aacute: "\xC1",
      aacute: "\xE1",
      Abreve: "\u0102",
      abreve: "\u0103",
      ac: "\u223E",
      acd: "\u223F",
      acE: "\u223E\u0333",
      Acirc: "\xC2",
      acirc: "\xE2",
      acute: "\xB4",
      Acy: "\u0410",
      acy: "\u0430",
      AElig: "\xC6",
      aelig: "\xE6",
      af: "\u2061",
      Afr: "\u{1D504}",
      afr: "\u{1D51E}",
      Agrave: "\xC0",
      agrave: "\xE0",
      alefsym: "\u2135",
      aleph: "\u2135",
      Alpha: "\u0391",
      alpha: "\u03B1",
      Amacr: "\u0100",
      amacr: "\u0101",
      amalg: "\u2A3F",
      AMP: "&",
      amp: "&",
      And: "\u2A53",
      and: "\u2227",
      andand: "\u2A55",
      andd: "\u2A5C",
      andslope: "\u2A58",
      andv: "\u2A5A",
      ang: "\u2220",
      ange: "\u29A4",
      angle: "\u2220",
      angmsd: "\u2221",
      angmsdaa: "\u29A8",
      angmsdab: "\u29A9",
      angmsdac: "\u29AA",
      angmsdad: "\u29AB",
      angmsdae: "\u29AC",
      angmsdaf: "\u29AD",
      angmsdag: "\u29AE",
      angmsdah: "\u29AF",
      angrt: "\u221F",
      angrtvb: "\u22BE",
      angrtvbd: "\u299D",
      angsph: "\u2222",
      angst: "\xC5",
      angzarr: "\u237C",
      Aogon: "\u0104",
      aogon: "\u0105",
      Aopf: "\u{1D538}",
      aopf: "\u{1D552}",
      ap: "\u2248",
      apacir: "\u2A6F",
      apE: "\u2A70",
      ape: "\u224A",
      apid: "\u224B",
      apos: "'",
      ApplyFunction: "\u2061",
      approx: "\u2248",
      approxeq: "\u224A",
      Aring: "\xC5",
      aring: "\xE5",
      Ascr: "\u{1D49C}",
      ascr: "\u{1D4B6}",
      Assign: "\u2254",
      ast: "*",
      asymp: "\u2248",
      asympeq: "\u224D",
      Atilde: "\xC3",
      atilde: "\xE3",
      Auml: "\xC4",
      auml: "\xE4",
      awconint: "\u2233",
      awint: "\u2A11",
      backcong: "\u224C",
      backepsilon: "\u03F6",
      backprime: "\u2035",
      backsim: "\u223D",
      backsimeq: "\u22CD",
      Backslash: "\u2216",
      Barv: "\u2AE7",
      barvee: "\u22BD",
      Barwed: "\u2306",
      barwed: "\u2305",
      barwedge: "\u2305",
      bbrk: "\u23B5",
      bbrktbrk: "\u23B6",
      bcong: "\u224C",
      Bcy: "\u0411",
      bcy: "\u0431",
      bdquo: "\u201E",
      becaus: "\u2235",
      Because: "\u2235",
      because: "\u2235",
      bemptyv: "\u29B0",
      bepsi: "\u03F6",
      bernou: "\u212C",
      Bernoullis: "\u212C",
      Beta: "\u0392",
      beta: "\u03B2",
      beth: "\u2136",
      between: "\u226C",
      Bfr: "\u{1D505}",
      bfr: "\u{1D51F}",
      bigcap: "\u22C2",
      bigcirc: "\u25EF",
      bigcup: "\u22C3",
      bigodot: "\u2A00",
      bigoplus: "\u2A01",
      bigotimes: "\u2A02",
      bigsqcup: "\u2A06",
      bigstar: "\u2605",
      bigtriangledown: "\u25BD",
      bigtriangleup: "\u25B3",
      biguplus: "\u2A04",
      bigvee: "\u22C1",
      bigwedge: "\u22C0",
      bkarow: "\u290D",
      blacklozenge: "\u29EB",
      blacksquare: "\u25AA",
      blacktriangle: "\u25B4",
      blacktriangledown: "\u25BE",
      blacktriangleleft: "\u25C2",
      blacktriangleright: "\u25B8",
      blank: "\u2423",
      blk12: "\u2592",
      blk14: "\u2591",
      blk34: "\u2593",
      block: "\u2588",
      bne: "=\u20E5",
      bnequiv: "\u2261\u20E5",
      bNot: "\u2AED",
      bnot: "\u2310",
      Bopf: "\u{1D539}",
      bopf: "\u{1D553}",
      bot: "\u22A5",
      bottom: "\u22A5",
      bowtie: "\u22C8",
      boxbox: "\u29C9",
      boxDL: "\u2557",
      boxDl: "\u2556",
      boxdL: "\u2555",
      boxdl: "\u2510",
      boxDR: "\u2554",
      boxDr: "\u2553",
      boxdR: "\u2552",
      boxdr: "\u250C",
      boxH: "\u2550",
      boxh: "\u2500",
      boxHD: "\u2566",
      boxHd: "\u2564",
      boxhD: "\u2565",
      boxhd: "\u252C",
      boxHU: "\u2569",
      boxHu: "\u2567",
      boxhU: "\u2568",
      boxhu: "\u2534",
      boxminus: "\u229F",
      boxplus: "\u229E",
      boxtimes: "\u22A0",
      boxUL: "\u255D",
      boxUl: "\u255C",
      boxuL: "\u255B",
      boxul: "\u2518",
      boxUR: "\u255A",
      boxUr: "\u2559",
      boxuR: "\u2558",
      boxur: "\u2514",
      boxV: "\u2551",
      boxv: "\u2502",
      boxVH: "\u256C",
      boxVh: "\u256B",
      boxvH: "\u256A",
      boxvh: "\u253C",
      boxVL: "\u2563",
      boxVl: "\u2562",
      boxvL: "\u2561",
      boxvl: "\u2524",
      boxVR: "\u2560",
      boxVr: "\u255F",
      boxvR: "\u255E",
      boxvr: "\u251C",
      bprime: "\u2035",
      Breve: "\u02D8",
      breve: "\u02D8",
      brvbar: "\xA6",
      Bscr: "\u212C",
      bscr: "\u{1D4B7}",
      bsemi: "\u204F",
      bsim: "\u223D",
      bsime: "\u22CD",
      bsol: "\\",
      bsolb: "\u29C5",
      bsolhsub: "\u27C8",
      bull: "\u2022",
      bullet: "\u2022",
      bump: "\u224E",
      bumpE: "\u2AAE",
      bumpe: "\u224F",
      Bumpeq: "\u224E",
      bumpeq: "\u224F",
      Cacute: "\u0106",
      cacute: "\u0107",
      Cap: "\u22D2",
      cap: "\u2229",
      capand: "\u2A44",
      capbrcup: "\u2A49",
      capcap: "\u2A4B",
      capcup: "\u2A47",
      capdot: "\u2A40",
      CapitalDifferentialD: "\u2145",
      caps: "\u2229\uFE00",
      caret: "\u2041",
      caron: "\u02C7",
      Cayleys: "\u212D",
      ccaps: "\u2A4D",
      Ccaron: "\u010C",
      ccaron: "\u010D",
      Ccedil: "\xC7",
      ccedil: "\xE7",
      Ccirc: "\u0108",
      ccirc: "\u0109",
      Cconint: "\u2230",
      ccups: "\u2A4C",
      ccupssm: "\u2A50",
      Cdot: "\u010A",
      cdot: "\u010B",
      cedil: "\xB8",
      Cedilla: "\xB8",
      cemptyv: "\u29B2",
      cent: "\xA2",
      CenterDot: "\xB7",
      centerdot: "\xB7",
      Cfr: "\u212D",
      cfr: "\u{1D520}",
      CHcy: "\u0427",
      chcy: "\u0447",
      check: "\u2713",
      checkmark: "\u2713",
      Chi: "\u03A7",
      chi: "\u03C7",
      cir: "\u25CB",
      circ: "\u02C6",
      circeq: "\u2257",
      circlearrowleft: "\u21BA",
      circlearrowright: "\u21BB",
      circledast: "\u229B",
      circledcirc: "\u229A",
      circleddash: "\u229D",
      CircleDot: "\u2299",
      circledR: "\xAE",
      circledS: "\u24C8",
      CircleMinus: "\u2296",
      CirclePlus: "\u2295",
      CircleTimes: "\u2297",
      cirE: "\u29C3",
      cire: "\u2257",
      cirfnint: "\u2A10",
      cirmid: "\u2AEF",
      cirscir: "\u29C2",
      ClockwiseContourIntegral: "\u2232",
      CloseCurlyDoubleQuote: "\u201D",
      CloseCurlyQuote: "\u2019",
      clubs: "\u2663",
      clubsuit: "\u2663",
      Colon: "\u2237",
      colon: ":",
      Colone: "\u2A74",
      colone: "\u2254",
      coloneq: "\u2254",
      comma: ",",
      commat: "@",
      comp: "\u2201",
      compfn: "\u2218",
      complement: "\u2201",
      complexes: "\u2102",
      cong: "\u2245",
      congdot: "\u2A6D",
      Congruent: "\u2261",
      Conint: "\u222F",
      conint: "\u222E",
      ContourIntegral: "\u222E",
      Copf: "\u2102",
      copf: "\u{1D554}",
      coprod: "\u2210",
      Coproduct: "\u2210",
      COPY: "\xA9",
      copy: "\xA9",
      copysr: "\u2117",
      CounterClockwiseContourIntegral: "\u2233",
      crarr: "\u21B5",
      Cross: "\u2A2F",
      cross: "\u2717",
      Cscr: "\u{1D49E}",
      cscr: "\u{1D4B8}",
      csub: "\u2ACF",
      csube: "\u2AD1",
      csup: "\u2AD0",
      csupe: "\u2AD2",
      ctdot: "\u22EF",
      cudarrl: "\u2938",
      cudarrr: "\u2935",
      cuepr: "\u22DE",
      cuesc: "\u22DF",
      cularr: "\u21B6",
      cularrp: "\u293D",
      Cup: "\u22D3",
      cup: "\u222A",
      cupbrcap: "\u2A48",
      CupCap: "\u224D",
      cupcap: "\u2A46",
      cupcup: "\u2A4A",
      cupdot: "\u228D",
      cupor: "\u2A45",
      cups: "\u222A\uFE00",
      curarr: "\u21B7",
      curarrm: "\u293C",
      curlyeqprec: "\u22DE",
      curlyeqsucc: "\u22DF",
      curlyvee: "\u22CE",
      curlywedge: "\u22CF",
      curren: "\xA4",
      curvearrowleft: "\u21B6",
      curvearrowright: "\u21B7",
      cuvee: "\u22CE",
      cuwed: "\u22CF",
      cwconint: "\u2232",
      cwint: "\u2231",
      cylcty: "\u232D",
      Dagger: "\u2021",
      dagger: "\u2020",
      daleth: "\u2138",
      Darr: "\u21A1",
      dArr: "\u21D3",
      darr: "\u2193",
      dash: "\u2010",
      Dashv: "\u2AE4",
      dashv: "\u22A3",
      dbkarow: "\u290F",
      dblac: "\u02DD",
      Dcaron: "\u010E",
      dcaron: "\u010F",
      Dcy: "\u0414",
      dcy: "\u0434",
      DD: "\u2145",
      dd: "\u2146",
      ddagger: "\u2021",
      ddarr: "\u21CA",
      DDotrahd: "\u2911",
      ddotseq: "\u2A77",
      deg: "\xB0",
      Del: "\u2207",
      Delta: "\u0394",
      delta: "\u03B4",
      demptyv: "\u29B1",
      dfisht: "\u297F",
      Dfr: "\u{1D507}",
      dfr: "\u{1D521}",
      dHar: "\u2965",
      dharl: "\u21C3",
      dharr: "\u21C2",
      DiacriticalAcute: "\xB4",
      DiacriticalDot: "\u02D9",
      DiacriticalDoubleAcute: "\u02DD",
      DiacriticalGrave: "`",
      DiacriticalTilde: "\u02DC",
      diam: "\u22C4",
      Diamond: "\u22C4",
      diamond: "\u22C4",
      diamondsuit: "\u2666",
      diams: "\u2666",
      die: "\xA8",
      DifferentialD: "\u2146",
      digamma: "\u03DD",
      disin: "\u22F2",
      div: "\xF7",
      divide: "\xF7",
      divideontimes: "\u22C7",
      divonx: "\u22C7",
      DJcy: "\u0402",
      djcy: "\u0452",
      dlcorn: "\u231E",
      dlcrop: "\u230D",
      dollar: "$",
      Dopf: "\u{1D53B}",
      dopf: "\u{1D555}",
      Dot: "\xA8",
      dot: "\u02D9",
      DotDot: "\u20DC",
      doteq: "\u2250",
      doteqdot: "\u2251",
      DotEqual: "\u2250",
      dotminus: "\u2238",
      dotplus: "\u2214",
      dotsquare: "\u22A1",
      doublebarwedge: "\u2306",
      DoubleContourIntegral: "\u222F",
      DoubleDot: "\xA8",
      DoubleDownArrow: "\u21D3",
      DoubleLeftArrow: "\u21D0",
      DoubleLeftRightArrow: "\u21D4",
      DoubleLeftTee: "\u2AE4",
      DoubleLongLeftArrow: "\u27F8",
      DoubleLongLeftRightArrow: "\u27FA",
      DoubleLongRightArrow: "\u27F9",
      DoubleRightArrow: "\u21D2",
      DoubleRightTee: "\u22A8",
      DoubleUpArrow: "\u21D1",
      DoubleUpDownArrow: "\u21D5",
      DoubleVerticalBar: "\u2225",
      DownArrow: "\u2193",
      Downarrow: "\u21D3",
      downarrow: "\u2193",
      DownArrowBar: "\u2913",
      DownArrowUpArrow: "\u21F5",
      DownBreve: "\u0311",
      downdownarrows: "\u21CA",
      downharpoonleft: "\u21C3",
      downharpoonright: "\u21C2",
      DownLeftRightVector: "\u2950",
      DownLeftTeeVector: "\u295E",
      DownLeftVector: "\u21BD",
      DownLeftVectorBar: "\u2956",
      DownRightTeeVector: "\u295F",
      DownRightVector: "\u21C1",
      DownRightVectorBar: "\u2957",
      DownTee: "\u22A4",
      DownTeeArrow: "\u21A7",
      drbkarow: "\u2910",
      drcorn: "\u231F",
      drcrop: "\u230C",
      Dscr: "\u{1D49F}",
      dscr: "\u{1D4B9}",
      DScy: "\u0405",
      dscy: "\u0455",
      dsol: "\u29F6",
      Dstrok: "\u0110",
      dstrok: "\u0111",
      dtdot: "\u22F1",
      dtri: "\u25BF",
      dtrif: "\u25BE",
      duarr: "\u21F5",
      duhar: "\u296F",
      dwangle: "\u29A6",
      DZcy: "\u040F",
      dzcy: "\u045F",
      dzigrarr: "\u27FF",
      Eacute: "\xC9",
      eacute: "\xE9",
      easter: "\u2A6E",
      Ecaron: "\u011A",
      ecaron: "\u011B",
      ecir: "\u2256",
      Ecirc: "\xCA",
      ecirc: "\xEA",
      ecolon: "\u2255",
      Ecy: "\u042D",
      ecy: "\u044D",
      eDDot: "\u2A77",
      Edot: "\u0116",
      eDot: "\u2251",
      edot: "\u0117",
      ee: "\u2147",
      efDot: "\u2252",
      Efr: "\u{1D508}",
      efr: "\u{1D522}",
      eg: "\u2A9A",
      Egrave: "\xC8",
      egrave: "\xE8",
      egs: "\u2A96",
      egsdot: "\u2A98",
      el: "\u2A99",
      Element: "\u2208",
      elinters: "\u23E7",
      ell: "\u2113",
      els: "\u2A95",
      elsdot: "\u2A97",
      Emacr: "\u0112",
      emacr: "\u0113",
      empty: "\u2205",
      emptyset: "\u2205",
      EmptySmallSquare: "\u25FB",
      emptyv: "\u2205",
      EmptyVerySmallSquare: "\u25AB",
      emsp: "\u2003",
      emsp13: "\u2004",
      emsp14: "\u2005",
      ENG: "\u014A",
      eng: "\u014B",
      ensp: "\u2002",
      Eogon: "\u0118",
      eogon: "\u0119",
      Eopf: "\u{1D53C}",
      eopf: "\u{1D556}",
      epar: "\u22D5",
      eparsl: "\u29E3",
      eplus: "\u2A71",
      epsi: "\u03B5",
      Epsilon: "\u0395",
      epsilon: "\u03B5",
      epsiv: "\u03F5",
      eqcirc: "\u2256",
      eqcolon: "\u2255",
      eqsim: "\u2242",
      eqslantgtr: "\u2A96",
      eqslantless: "\u2A95",
      Equal: "\u2A75",
      equals: "=",
      EqualTilde: "\u2242",
      equest: "\u225F",
      Equilibrium: "\u21CC",
      equiv: "\u2261",
      equivDD: "\u2A78",
      eqvparsl: "\u29E5",
      erarr: "\u2971",
      erDot: "\u2253",
      Escr: "\u2130",
      escr: "\u212F",
      esdot: "\u2250",
      Esim: "\u2A73",
      esim: "\u2242",
      Eta: "\u0397",
      eta: "\u03B7",
      ETH: "\xD0",
      eth: "\xF0",
      Euml: "\xCB",
      euml: "\xEB",
      euro: "\u20AC",
      excl: "!",
      exist: "\u2203",
      Exists: "\u2203",
      expectation: "\u2130",
      ExponentialE: "\u2147",
      exponentiale: "\u2147",
      fallingdotseq: "\u2252",
      Fcy: "\u0424",
      fcy: "\u0444",
      female: "\u2640",
      ffilig: "\uFB03",
      fflig: "\uFB00",
      ffllig: "\uFB04",
      Ffr: "\u{1D509}",
      ffr: "\u{1D523}",
      filig: "\uFB01",
      FilledSmallSquare: "\u25FC",
      FilledVerySmallSquare: "\u25AA",
      fjlig: "fj",
      flat: "\u266D",
      fllig: "\uFB02",
      fltns: "\u25B1",
      fnof: "\u0192",
      Fopf: "\u{1D53D}",
      fopf: "\u{1D557}",
      ForAll: "\u2200",
      forall: "\u2200",
      fork: "\u22D4",
      forkv: "\u2AD9",
      Fouriertrf: "\u2131",
      fpartint: "\u2A0D",
      frac12: "\xBD",
      frac13: "\u2153",
      frac14: "\xBC",
      frac15: "\u2155",
      frac16: "\u2159",
      frac18: "\u215B",
      frac23: "\u2154",
      frac25: "\u2156",
      frac34: "\xBE",
      frac35: "\u2157",
      frac38: "\u215C",
      frac45: "\u2158",
      frac56: "\u215A",
      frac58: "\u215D",
      frac78: "\u215E",
      frasl: "\u2044",
      frown: "\u2322",
      Fscr: "\u2131",
      fscr: "\u{1D4BB}",
      gacute: "\u01F5",
      Gamma: "\u0393",
      gamma: "\u03B3",
      Gammad: "\u03DC",
      gammad: "\u03DD",
      gap: "\u2A86",
      Gbreve: "\u011E",
      gbreve: "\u011F",
      Gcedil: "\u0122",
      Gcirc: "\u011C",
      gcirc: "\u011D",
      Gcy: "\u0413",
      gcy: "\u0433",
      Gdot: "\u0120",
      gdot: "\u0121",
      gE: "\u2267",
      ge: "\u2265",
      gEl: "\u2A8C",
      gel: "\u22DB",
      geq: "\u2265",
      geqq: "\u2267",
      geqslant: "\u2A7E",
      ges: "\u2A7E",
      gescc: "\u2AA9",
      gesdot: "\u2A80",
      gesdoto: "\u2A82",
      gesdotol: "\u2A84",
      gesl: "\u22DB\uFE00",
      gesles: "\u2A94",
      Gfr: "\u{1D50A}",
      gfr: "\u{1D524}",
      Gg: "\u22D9",
      gg: "\u226B",
      ggg: "\u22D9",
      gimel: "\u2137",
      GJcy: "\u0403",
      gjcy: "\u0453",
      gl: "\u2277",
      gla: "\u2AA5",
      glE: "\u2A92",
      glj: "\u2AA4",
      gnap: "\u2A8A",
      gnapprox: "\u2A8A",
      gnE: "\u2269",
      gne: "\u2A88",
      gneq: "\u2A88",
      gneqq: "\u2269",
      gnsim: "\u22E7",
      Gopf: "\u{1D53E}",
      gopf: "\u{1D558}",
      grave: "`",
      GreaterEqual: "\u2265",
      GreaterEqualLess: "\u22DB",
      GreaterFullEqual: "\u2267",
      GreaterGreater: "\u2AA2",
      GreaterLess: "\u2277",
      GreaterSlantEqual: "\u2A7E",
      GreaterTilde: "\u2273",
      Gscr: "\u{1D4A2}",
      gscr: "\u210A",
      gsim: "\u2273",
      gsime: "\u2A8E",
      gsiml: "\u2A90",
      Gt: "\u226B",
      GT: ">",
      gt: ">",
      gtcc: "\u2AA7",
      gtcir: "\u2A7A",
      gtdot: "\u22D7",
      gtlPar: "\u2995",
      gtquest: "\u2A7C",
      gtrapprox: "\u2A86",
      gtrarr: "\u2978",
      gtrdot: "\u22D7",
      gtreqless: "\u22DB",
      gtreqqless: "\u2A8C",
      gtrless: "\u2277",
      gtrsim: "\u2273",
      gvertneqq: "\u2269\uFE00",
      gvnE: "\u2269\uFE00",
      Hacek: "\u02C7",
      hairsp: "\u200A",
      half: "\xBD",
      hamilt: "\u210B",
      HARDcy: "\u042A",
      hardcy: "\u044A",
      hArr: "\u21D4",
      harr: "\u2194",
      harrcir: "\u2948",
      harrw: "\u21AD",
      Hat: "^",
      hbar: "\u210F",
      Hcirc: "\u0124",
      hcirc: "\u0125",
      hearts: "\u2665",
      heartsuit: "\u2665",
      hellip: "\u2026",
      hercon: "\u22B9",
      Hfr: "\u210C",
      hfr: "\u{1D525}",
      HilbertSpace: "\u210B",
      hksearow: "\u2925",
      hkswarow: "\u2926",
      hoarr: "\u21FF",
      homtht: "\u223B",
      hookleftarrow: "\u21A9",
      hookrightarrow: "\u21AA",
      Hopf: "\u210D",
      hopf: "\u{1D559}",
      horbar: "\u2015",
      HorizontalLine: "\u2500",
      Hscr: "\u210B",
      hscr: "\u{1D4BD}",
      hslash: "\u210F",
      Hstrok: "\u0126",
      hstrok: "\u0127",
      HumpDownHump: "\u224E",
      HumpEqual: "\u224F",
      hybull: "\u2043",
      hyphen: "\u2010",
      Iacute: "\xCD",
      iacute: "\xED",
      ic: "\u2063",
      Icirc: "\xCE",
      icirc: "\xEE",
      Icy: "\u0418",
      icy: "\u0438",
      Idot: "\u0130",
      IEcy: "\u0415",
      iecy: "\u0435",
      iexcl: "\xA1",
      iff: "\u21D4",
      Ifr: "\u2111",
      ifr: "\u{1D526}",
      Igrave: "\xCC",
      igrave: "\xEC",
      ii: "\u2148",
      iiiint: "\u2A0C",
      iiint: "\u222D",
      iinfin: "\u29DC",
      iiota: "\u2129",
      IJlig: "\u0132",
      ijlig: "\u0133",
      Im: "\u2111",
      Imacr: "\u012A",
      imacr: "\u012B",
      image: "\u2111",
      ImaginaryI: "\u2148",
      imagline: "\u2110",
      imagpart: "\u2111",
      imath: "\u0131",
      imof: "\u22B7",
      imped: "\u01B5",
      Implies: "\u21D2",
      in: "\u2208",
      incare: "\u2105",
      infin: "\u221E",
      infintie: "\u29DD",
      inodot: "\u0131",
      Int: "\u222C",
      int: "\u222B",
      intcal: "\u22BA",
      integers: "\u2124",
      Integral: "\u222B",
      intercal: "\u22BA",
      Intersection: "\u22C2",
      intlarhk: "\u2A17",
      intprod: "\u2A3C",
      InvisibleComma: "\u2063",
      InvisibleTimes: "\u2062",
      IOcy: "\u0401",
      iocy: "\u0451",
      Iogon: "\u012E",
      iogon: "\u012F",
      Iopf: "\u{1D540}",
      iopf: "\u{1D55A}",
      Iota: "\u0399",
      iota: "\u03B9",
      iprod: "\u2A3C",
      iquest: "\xBF",
      Iscr: "\u2110",
      iscr: "\u{1D4BE}",
      isin: "\u2208",
      isindot: "\u22F5",
      isinE: "\u22F9",
      isins: "\u22F4",
      isinsv: "\u22F3",
      isinv: "\u2208",
      it: "\u2062",
      Itilde: "\u0128",
      itilde: "\u0129",
      Iukcy: "\u0406",
      iukcy: "\u0456",
      Iuml: "\xCF",
      iuml: "\xEF",
      Jcirc: "\u0134",
      jcirc: "\u0135",
      Jcy: "\u0419",
      jcy: "\u0439",
      Jfr: "\u{1D50D}",
      jfr: "\u{1D527}",
      jmath: "\u0237",
      Jopf: "\u{1D541}",
      jopf: "\u{1D55B}",
      Jscr: "\u{1D4A5}",
      jscr: "\u{1D4BF}",
      Jsercy: "\u0408",
      jsercy: "\u0458",
      Jukcy: "\u0404",
      jukcy: "\u0454",
      Kappa: "\u039A",
      kappa: "\u03BA",
      kappav: "\u03F0",
      Kcedil: "\u0136",
      kcedil: "\u0137",
      Kcy: "\u041A",
      kcy: "\u043A",
      Kfr: "\u{1D50E}",
      kfr: "\u{1D528}",
      kgreen: "\u0138",
      KHcy: "\u0425",
      khcy: "\u0445",
      KJcy: "\u040C",
      kjcy: "\u045C",
      Kopf: "\u{1D542}",
      kopf: "\u{1D55C}",
      Kscr: "\u{1D4A6}",
      kscr: "\u{1D4C0}",
      lAarr: "\u21DA",
      Lacute: "\u0139",
      lacute: "\u013A",
      laemptyv: "\u29B4",
      lagran: "\u2112",
      Lambda: "\u039B",
      lambda: "\u03BB",
      Lang: "\u27EA",
      lang: "\u27E8",
      langd: "\u2991",
      langle: "\u27E8",
      lap: "\u2A85",
      Laplacetrf: "\u2112",
      laquo: "\xAB",
      Larr: "\u219E",
      lArr: "\u21D0",
      larr: "\u2190",
      larrb: "\u21E4",
      larrbfs: "\u291F",
      larrfs: "\u291D",
      larrhk: "\u21A9",
      larrlp: "\u21AB",
      larrpl: "\u2939",
      larrsim: "\u2973",
      larrtl: "\u21A2",
      lat: "\u2AAB",
      lAtail: "\u291B",
      latail: "\u2919",
      late: "\u2AAD",
      lates: "\u2AAD\uFE00",
      lBarr: "\u290E",
      lbarr: "\u290C",
      lbbrk: "\u2772",
      lbrace: "{",
      lbrack: "[",
      lbrke: "\u298B",
      lbrksld: "\u298F",
      lbrkslu: "\u298D",
      Lcaron: "\u013D",
      lcaron: "\u013E",
      Lcedil: "\u013B",
      lcedil: "\u013C",
      lceil: "\u2308",
      lcub: "{",
      Lcy: "\u041B",
      lcy: "\u043B",
      ldca: "\u2936",
      ldquo: "\u201C",
      ldquor: "\u201E",
      ldrdhar: "\u2967",
      ldrushar: "\u294B",
      ldsh: "\u21B2",
      lE: "\u2266",
      le: "\u2264",
      LeftAngleBracket: "\u27E8",
      LeftArrow: "\u2190",
      Leftarrow: "\u21D0",
      leftarrow: "\u2190",
      LeftArrowBar: "\u21E4",
      LeftArrowRightArrow: "\u21C6",
      leftarrowtail: "\u21A2",
      LeftCeiling: "\u2308",
      LeftDoubleBracket: "\u27E6",
      LeftDownTeeVector: "\u2961",
      LeftDownVector: "\u21C3",
      LeftDownVectorBar: "\u2959",
      LeftFloor: "\u230A",
      leftharpoondown: "\u21BD",
      leftharpoonup: "\u21BC",
      leftleftarrows: "\u21C7",
      LeftRightArrow: "\u2194",
      Leftrightarrow: "\u21D4",
      leftrightarrow: "\u2194",
      leftrightarrows: "\u21C6",
      leftrightharpoons: "\u21CB",
      leftrightsquigarrow: "\u21AD",
      LeftRightVector: "\u294E",
      LeftTee: "\u22A3",
      LeftTeeArrow: "\u21A4",
      LeftTeeVector: "\u295A",
      leftthreetimes: "\u22CB",
      LeftTriangle: "\u22B2",
      LeftTriangleBar: "\u29CF",
      LeftTriangleEqual: "\u22B4",
      LeftUpDownVector: "\u2951",
      LeftUpTeeVector: "\u2960",
      LeftUpVector: "\u21BF",
      LeftUpVectorBar: "\u2958",
      LeftVector: "\u21BC",
      LeftVectorBar: "\u2952",
      lEg: "\u2A8B",
      leg: "\u22DA",
      leq: "\u2264",
      leqq: "\u2266",
      leqslant: "\u2A7D",
      les: "\u2A7D",
      lescc: "\u2AA8",
      lesdot: "\u2A7F",
      lesdoto: "\u2A81",
      lesdotor: "\u2A83",
      lesg: "\u22DA\uFE00",
      lesges: "\u2A93",
      lessapprox: "\u2A85",
      lessdot: "\u22D6",
      lesseqgtr: "\u22DA",
      lesseqqgtr: "\u2A8B",
      LessEqualGreater: "\u22DA",
      LessFullEqual: "\u2266",
      LessGreater: "\u2276",
      lessgtr: "\u2276",
      LessLess: "\u2AA1",
      lesssim: "\u2272",
      LessSlantEqual: "\u2A7D",
      LessTilde: "\u2272",
      lfisht: "\u297C",
      lfloor: "\u230A",
      Lfr: "\u{1D50F}",
      lfr: "\u{1D529}",
      lg: "\u2276",
      lgE: "\u2A91",
      lHar: "\u2962",
      lhard: "\u21BD",
      lharu: "\u21BC",
      lharul: "\u296A",
      lhblk: "\u2584",
      LJcy: "\u0409",
      ljcy: "\u0459",
      Ll: "\u22D8",
      ll: "\u226A",
      llarr: "\u21C7",
      llcorner: "\u231E",
      Lleftarrow: "\u21DA",
      llhard: "\u296B",
      lltri: "\u25FA",
      Lmidot: "\u013F",
      lmidot: "\u0140",
      lmoust: "\u23B0",
      lmoustache: "\u23B0",
      lnap: "\u2A89",
      lnapprox: "\u2A89",
      lnE: "\u2268",
      lne: "\u2A87",
      lneq: "\u2A87",
      lneqq: "\u2268",
      lnsim: "\u22E6",
      loang: "\u27EC",
      loarr: "\u21FD",
      lobrk: "\u27E6",
      LongLeftArrow: "\u27F5",
      Longleftarrow: "\u27F8",
      longleftarrow: "\u27F5",
      LongLeftRightArrow: "\u27F7",
      Longleftrightarrow: "\u27FA",
      longleftrightarrow: "\u27F7",
      longmapsto: "\u27FC",
      LongRightArrow: "\u27F6",
      Longrightarrow: "\u27F9",
      longrightarrow: "\u27F6",
      looparrowleft: "\u21AB",
      looparrowright: "\u21AC",
      lopar: "\u2985",
      Lopf: "\u{1D543}",
      lopf: "\u{1D55D}",
      loplus: "\u2A2D",
      lotimes: "\u2A34",
      lowast: "\u2217",
      lowbar: "_",
      LowerLeftArrow: "\u2199",
      LowerRightArrow: "\u2198",
      loz: "\u25CA",
      lozenge: "\u25CA",
      lozf: "\u29EB",
      lpar: "(",
      lparlt: "\u2993",
      lrarr: "\u21C6",
      lrcorner: "\u231F",
      lrhar: "\u21CB",
      lrhard: "\u296D",
      lrm: "\u200E",
      lrtri: "\u22BF",
      lsaquo: "\u2039",
      Lscr: "\u2112",
      lscr: "\u{1D4C1}",
      Lsh: "\u21B0",
      lsh: "\u21B0",
      lsim: "\u2272",
      lsime: "\u2A8D",
      lsimg: "\u2A8F",
      lsqb: "[",
      lsquo: "\u2018",
      lsquor: "\u201A",
      Lstrok: "\u0141",
      lstrok: "\u0142",
      Lt: "\u226A",
      LT: "<",
      lt: "<",
      ltcc: "\u2AA6",
      ltcir: "\u2A79",
      ltdot: "\u22D6",
      lthree: "\u22CB",
      ltimes: "\u22C9",
      ltlarr: "\u2976",
      ltquest: "\u2A7B",
      ltri: "\u25C3",
      ltrie: "\u22B4",
      ltrif: "\u25C2",
      ltrPar: "\u2996",
      lurdshar: "\u294A",
      luruhar: "\u2966",
      lvertneqq: "\u2268\uFE00",
      lvnE: "\u2268\uFE00",
      macr: "\xAF",
      male: "\u2642",
      malt: "\u2720",
      maltese: "\u2720",
      Map: "\u2905",
      map: "\u21A6",
      mapsto: "\u21A6",
      mapstodown: "\u21A7",
      mapstoleft: "\u21A4",
      mapstoup: "\u21A5",
      marker: "\u25AE",
      mcomma: "\u2A29",
      Mcy: "\u041C",
      mcy: "\u043C",
      mdash: "\u2014",
      mDDot: "\u223A",
      measuredangle: "\u2221",
      MediumSpace: "\u205F",
      Mellintrf: "\u2133",
      Mfr: "\u{1D510}",
      mfr: "\u{1D52A}",
      mho: "\u2127",
      micro: "\xB5",
      mid: "\u2223",
      midast: "*",
      midcir: "\u2AF0",
      middot: "\xB7",
      minus: "\u2212",
      minusb: "\u229F",
      minusd: "\u2238",
      minusdu: "\u2A2A",
      MinusPlus: "\u2213",
      mlcp: "\u2ADB",
      mldr: "\u2026",
      mnplus: "\u2213",
      models: "\u22A7",
      Mopf: "\u{1D544}",
      mopf: "\u{1D55E}",
      mp: "\u2213",
      Mscr: "\u2133",
      mscr: "\u{1D4C2}",
      mstpos: "\u223E",
      Mu: "\u039C",
      mu: "\u03BC",
      multimap: "\u22B8",
      mumap: "\u22B8",
      nabla: "\u2207",
      Nacute: "\u0143",
      nacute: "\u0144",
      nang: "\u2220\u20D2",
      nap: "\u2249",
      napE: "\u2A70\u0338",
      napid: "\u224B\u0338",
      napos: "\u0149",
      napprox: "\u2249",
      natur: "\u266E",
      natural: "\u266E",
      naturals: "\u2115",
      nbsp: "\xA0",
      nbump: "\u224E\u0338",
      nbumpe: "\u224F\u0338",
      ncap: "\u2A43",
      Ncaron: "\u0147",
      ncaron: "\u0148",
      Ncedil: "\u0145",
      ncedil: "\u0146",
      ncong: "\u2247",
      ncongdot: "\u2A6D\u0338",
      ncup: "\u2A42",
      Ncy: "\u041D",
      ncy: "\u043D",
      ndash: "\u2013",
      ne: "\u2260",
      nearhk: "\u2924",
      neArr: "\u21D7",
      nearr: "\u2197",
      nearrow: "\u2197",
      nedot: "\u2250\u0338",
      NegativeMediumSpace: "\u200B",
      NegativeThickSpace: "\u200B",
      NegativeThinSpace: "\u200B",
      NegativeVeryThinSpace: "\u200B",
      nequiv: "\u2262",
      nesear: "\u2928",
      nesim: "\u2242\u0338",
      NestedGreaterGreater: "\u226B",
      NestedLessLess: "\u226A",
      NewLine: "\n",
      nexist: "\u2204",
      nexists: "\u2204",
      Nfr: "\u{1D511}",
      nfr: "\u{1D52B}",
      ngE: "\u2267\u0338",
      nge: "\u2271",
      ngeq: "\u2271",
      ngeqq: "\u2267\u0338",
      ngeqslant: "\u2A7E\u0338",
      nges: "\u2A7E\u0338",
      nGg: "\u22D9\u0338",
      ngsim: "\u2275",
      nGt: "\u226B\u20D2",
      ngt: "\u226F",
      ngtr: "\u226F",
      nGtv: "\u226B\u0338",
      nhArr: "\u21CE",
      nharr: "\u21AE",
      nhpar: "\u2AF2",
      ni: "\u220B",
      nis: "\u22FC",
      nisd: "\u22FA",
      niv: "\u220B",
      NJcy: "\u040A",
      njcy: "\u045A",
      nlArr: "\u21CD",
      nlarr: "\u219A",
      nldr: "\u2025",
      nlE: "\u2266\u0338",
      nle: "\u2270",
      nLeftarrow: "\u21CD",
      nleftarrow: "\u219A",
      nLeftrightarrow: "\u21CE",
      nleftrightarrow: "\u21AE",
      nleq: "\u2270",
      nleqq: "\u2266\u0338",
      nleqslant: "\u2A7D\u0338",
      nles: "\u2A7D\u0338",
      nless: "\u226E",
      nLl: "\u22D8\u0338",
      nlsim: "\u2274",
      nLt: "\u226A\u20D2",
      nlt: "\u226E",
      nltri: "\u22EA",
      nltrie: "\u22EC",
      nLtv: "\u226A\u0338",
      nmid: "\u2224",
      NoBreak: "\u2060",
      NonBreakingSpace: "\xA0",
      Nopf: "\u2115",
      nopf: "\u{1D55F}",
      Not: "\u2AEC",
      not: "\xAC",
      NotCongruent: "\u2262",
      NotCupCap: "\u226D",
      NotDoubleVerticalBar: "\u2226",
      NotElement: "\u2209",
      NotEqual: "\u2260",
      NotEqualTilde: "\u2242\u0338",
      NotExists: "\u2204",
      NotGreater: "\u226F",
      NotGreaterEqual: "\u2271",
      NotGreaterFullEqual: "\u2267\u0338",
      NotGreaterGreater: "\u226B\u0338",
      NotGreaterLess: "\u2279",
      NotGreaterSlantEqual: "\u2A7E\u0338",
      NotGreaterTilde: "\u2275",
      NotHumpDownHump: "\u224E\u0338",
      NotHumpEqual: "\u224F\u0338",
      notin: "\u2209",
      notindot: "\u22F5\u0338",
      notinE: "\u22F9\u0338",
      notinva: "\u2209",
      notinvb: "\u22F7",
      notinvc: "\u22F6",
      NotLeftTriangle: "\u22EA",
      NotLeftTriangleBar: "\u29CF\u0338",
      NotLeftTriangleEqual: "\u22EC",
      NotLess: "\u226E",
      NotLessEqual: "\u2270",
      NotLessGreater: "\u2278",
      NotLessLess: "\u226A\u0338",
      NotLessSlantEqual: "\u2A7D\u0338",
      NotLessTilde: "\u2274",
      NotNestedGreaterGreater: "\u2AA2\u0338",
      NotNestedLessLess: "\u2AA1\u0338",
      notni: "\u220C",
      notniva: "\u220C",
      notnivb: "\u22FE",
      notnivc: "\u22FD",
      NotPrecedes: "\u2280",
      NotPrecedesEqual: "\u2AAF\u0338",
      NotPrecedesSlantEqual: "\u22E0",
      NotReverseElement: "\u220C",
      NotRightTriangle: "\u22EB",
      NotRightTriangleBar: "\u29D0\u0338",
      NotRightTriangleEqual: "\u22ED",
      NotSquareSubset: "\u228F\u0338",
      NotSquareSubsetEqual: "\u22E2",
      NotSquareSuperset: "\u2290\u0338",
      NotSquareSupersetEqual: "\u22E3",
      NotSubset: "\u2282\u20D2",
      NotSubsetEqual: "\u2288",
      NotSucceeds: "\u2281",
      NotSucceedsEqual: "\u2AB0\u0338",
      NotSucceedsSlantEqual: "\u22E1",
      NotSucceedsTilde: "\u227F\u0338",
      NotSuperset: "\u2283\u20D2",
      NotSupersetEqual: "\u2289",
      NotTilde: "\u2241",
      NotTildeEqual: "\u2244",
      NotTildeFullEqual: "\u2247",
      NotTildeTilde: "\u2249",
      NotVerticalBar: "\u2224",
      npar: "\u2226",
      nparallel: "\u2226",
      nparsl: "\u2AFD\u20E5",
      npart: "\u2202\u0338",
      npolint: "\u2A14",
      npr: "\u2280",
      nprcue: "\u22E0",
      npre: "\u2AAF\u0338",
      nprec: "\u2280",
      npreceq: "\u2AAF\u0338",
      nrArr: "\u21CF",
      nrarr: "\u219B",
      nrarrc: "\u2933\u0338",
      nrarrw: "\u219D\u0338",
      nRightarrow: "\u21CF",
      nrightarrow: "\u219B",
      nrtri: "\u22EB",
      nrtrie: "\u22ED",
      nsc: "\u2281",
      nsccue: "\u22E1",
      nsce: "\u2AB0\u0338",
      Nscr: "\u{1D4A9}",
      nscr: "\u{1D4C3}",
      nshortmid: "\u2224",
      nshortparallel: "\u2226",
      nsim: "\u2241",
      nsime: "\u2244",
      nsimeq: "\u2244",
      nsmid: "\u2224",
      nspar: "\u2226",
      nsqsube: "\u22E2",
      nsqsupe: "\u22E3",
      nsub: "\u2284",
      nsubE: "\u2AC5\u0338",
      nsube: "\u2288",
      nsubset: "\u2282\u20D2",
      nsubseteq: "\u2288",
      nsubseteqq: "\u2AC5\u0338",
      nsucc: "\u2281",
      nsucceq: "\u2AB0\u0338",
      nsup: "\u2285",
      nsupE: "\u2AC6\u0338",
      nsupe: "\u2289",
      nsupset: "\u2283\u20D2",
      nsupseteq: "\u2289",
      nsupseteqq: "\u2AC6\u0338",
      ntgl: "\u2279",
      Ntilde: "\xD1",
      ntilde: "\xF1",
      ntlg: "\u2278",
      ntriangleleft: "\u22EA",
      ntrianglelefteq: "\u22EC",
      ntriangleright: "\u22EB",
      ntrianglerighteq: "\u22ED",
      Nu: "\u039D",
      nu: "\u03BD",
      num: "#",
      numero: "\u2116",
      numsp: "\u2007",
      nvap: "\u224D\u20D2",
      nVDash: "\u22AF",
      nVdash: "\u22AE",
      nvDash: "\u22AD",
      nvdash: "\u22AC",
      nvge: "\u2265\u20D2",
      nvgt: ">\u20D2",
      nvHarr: "\u2904",
      nvinfin: "\u29DE",
      nvlArr: "\u2902",
      nvle: "\u2264\u20D2",
      nvlt: "<\u20D2",
      nvltrie: "\u22B4\u20D2",
      nvrArr: "\u2903",
      nvrtrie: "\u22B5\u20D2",
      nvsim: "\u223C\u20D2",
      nwarhk: "\u2923",
      nwArr: "\u21D6",
      nwarr: "\u2196",
      nwarrow: "\u2196",
      nwnear: "\u2927",
      Oacute: "\xD3",
      oacute: "\xF3",
      oast: "\u229B",
      ocir: "\u229A",
      Ocirc: "\xD4",
      ocirc: "\xF4",
      Ocy: "\u041E",
      ocy: "\u043E",
      odash: "\u229D",
      Odblac: "\u0150",
      odblac: "\u0151",
      odiv: "\u2A38",
      odot: "\u2299",
      odsold: "\u29BC",
      OElig: "\u0152",
      oelig: "\u0153",
      ofcir: "\u29BF",
      Ofr: "\u{1D512}",
      ofr: "\u{1D52C}",
      ogon: "\u02DB",
      Ograve: "\xD2",
      ograve: "\xF2",
      ogt: "\u29C1",
      ohbar: "\u29B5",
      ohm: "\u03A9",
      oint: "\u222E",
      olarr: "\u21BA",
      olcir: "\u29BE",
      olcross: "\u29BB",
      oline: "\u203E",
      olt: "\u29C0",
      Omacr: "\u014C",
      omacr: "\u014D",
      Omega: "\u03A9",
      omega: "\u03C9",
      Omicron: "\u039F",
      omicron: "\u03BF",
      omid: "\u29B6",
      ominus: "\u2296",
      Oopf: "\u{1D546}",
      oopf: "\u{1D560}",
      opar: "\u29B7",
      OpenCurlyDoubleQuote: "\u201C",
      OpenCurlyQuote: "\u2018",
      operp: "\u29B9",
      oplus: "\u2295",
      Or: "\u2A54",
      or: "\u2228",
      orarr: "\u21BB",
      ord: "\u2A5D",
      order: "\u2134",
      orderof: "\u2134",
      ordf: "\xAA",
      ordm: "\xBA",
      origof: "\u22B6",
      oror: "\u2A56",
      orslope: "\u2A57",
      orv: "\u2A5B",
      oS: "\u24C8",
      Oscr: "\u{1D4AA}",
      oscr: "\u2134",
      Oslash: "\xD8",
      oslash: "\xF8",
      osol: "\u2298",
      Otilde: "\xD5",
      otilde: "\xF5",
      Otimes: "\u2A37",
      otimes: "\u2297",
      otimesas: "\u2A36",
      Ouml: "\xD6",
      ouml: "\xF6",
      ovbar: "\u233D",
      OverBar: "\u203E",
      OverBrace: "\u23DE",
      OverBracket: "\u23B4",
      OverParenthesis: "\u23DC",
      par: "\u2225",
      para: "\xB6",
      parallel: "\u2225",
      parsim: "\u2AF3",
      parsl: "\u2AFD",
      part: "\u2202",
      PartialD: "\u2202",
      Pcy: "\u041F",
      pcy: "\u043F",
      percnt: "%",
      period: ".",
      permil: "\u2030",
      perp: "\u22A5",
      pertenk: "\u2031",
      Pfr: "\u{1D513}",
      pfr: "\u{1D52D}",
      Phi: "\u03A6",
      phi: "\u03C6",
      phiv: "\u03D5",
      phmmat: "\u2133",
      phone: "\u260E",
      Pi: "\u03A0",
      pi: "\u03C0",
      pitchfork: "\u22D4",
      piv: "\u03D6",
      planck: "\u210F",
      planckh: "\u210E",
      plankv: "\u210F",
      plus: "+",
      plusacir: "\u2A23",
      plusb: "\u229E",
      pluscir: "\u2A22",
      plusdo: "\u2214",
      plusdu: "\u2A25",
      pluse: "\u2A72",
      PlusMinus: "\xB1",
      plusmn: "\xB1",
      plussim: "\u2A26",
      plustwo: "\u2A27",
      pm: "\xB1",
      Poincareplane: "\u210C",
      pointint: "\u2A15",
      Popf: "\u2119",
      popf: "\u{1D561}",
      pound: "\xA3",
      Pr: "\u2ABB",
      pr: "\u227A",
      prap: "\u2AB7",
      prcue: "\u227C",
      prE: "\u2AB3",
      pre: "\u2AAF",
      prec: "\u227A",
      precapprox: "\u2AB7",
      preccurlyeq: "\u227C",
      Precedes: "\u227A",
      PrecedesEqual: "\u2AAF",
      PrecedesSlantEqual: "\u227C",
      PrecedesTilde: "\u227E",
      preceq: "\u2AAF",
      precnapprox: "\u2AB9",
      precneqq: "\u2AB5",
      precnsim: "\u22E8",
      precsim: "\u227E",
      Prime: "\u2033",
      prime: "\u2032",
      primes: "\u2119",
      prnap: "\u2AB9",
      prnE: "\u2AB5",
      prnsim: "\u22E8",
      prod: "\u220F",
      Product: "\u220F",
      profalar: "\u232E",
      profline: "\u2312",
      profsurf: "\u2313",
      prop: "\u221D",
      Proportion: "\u2237",
      Proportional: "\u221D",
      propto: "\u221D",
      prsim: "\u227E",
      prurel: "\u22B0",
      Pscr: "\u{1D4AB}",
      pscr: "\u{1D4C5}",
      Psi: "\u03A8",
      psi: "\u03C8",
      puncsp: "\u2008",
      Qfr: "\u{1D514}",
      qfr: "\u{1D52E}",
      qint: "\u2A0C",
      Qopf: "\u211A",
      qopf: "\u{1D562}",
      qprime: "\u2057",
      Qscr: "\u{1D4AC}",
      qscr: "\u{1D4C6}",
      quaternions: "\u210D",
      quatint: "\u2A16",
      quest: "?",
      questeq: "\u225F",
      QUOT: '"',
      quot: '"',
      rAarr: "\u21DB",
      race: "\u223D\u0331",
      Racute: "\u0154",
      racute: "\u0155",
      radic: "\u221A",
      raemptyv: "\u29B3",
      Rang: "\u27EB",
      rang: "\u27E9",
      rangd: "\u2992",
      range: "\u29A5",
      rangle: "\u27E9",
      raquo: "\xBB",
      Rarr: "\u21A0",
      rArr: "\u21D2",
      rarr: "\u2192",
      rarrap: "\u2975",
      rarrb: "\u21E5",
      rarrbfs: "\u2920",
      rarrc: "\u2933",
      rarrfs: "\u291E",
      rarrhk: "\u21AA",
      rarrlp: "\u21AC",
      rarrpl: "\u2945",
      rarrsim: "\u2974",
      Rarrtl: "\u2916",
      rarrtl: "\u21A3",
      rarrw: "\u219D",
      rAtail: "\u291C",
      ratail: "\u291A",
      ratio: "\u2236",
      rationals: "\u211A",
      RBarr: "\u2910",
      rBarr: "\u290F",
      rbarr: "\u290D",
      rbbrk: "\u2773",
      rbrace: "}",
      rbrack: "]",
      rbrke: "\u298C",
      rbrksld: "\u298E",
      rbrkslu: "\u2990",
      Rcaron: "\u0158",
      rcaron: "\u0159",
      Rcedil: "\u0156",
      rcedil: "\u0157",
      rceil: "\u2309",
      rcub: "}",
      Rcy: "\u0420",
      rcy: "\u0440",
      rdca: "\u2937",
      rdldhar: "\u2969",
      rdquo: "\u201D",
      rdquor: "\u201D",
      rdsh: "\u21B3",
      Re: "\u211C",
      real: "\u211C",
      realine: "\u211B",
      realpart: "\u211C",
      reals: "\u211D",
      rect: "\u25AD",
      REG: "\xAE",
      reg: "\xAE",
      ReverseElement: "\u220B",
      ReverseEquilibrium: "\u21CB",
      ReverseUpEquilibrium: "\u296F",
      rfisht: "\u297D",
      rfloor: "\u230B",
      Rfr: "\u211C",
      rfr: "\u{1D52F}",
      rHar: "\u2964",
      rhard: "\u21C1",
      rharu: "\u21C0",
      rharul: "\u296C",
      Rho: "\u03A1",
      rho: "\u03C1",
      rhov: "\u03F1",
      RightAngleBracket: "\u27E9",
      RightArrow: "\u2192",
      Rightarrow: "\u21D2",
      rightarrow: "\u2192",
      RightArrowBar: "\u21E5",
      RightArrowLeftArrow: "\u21C4",
      rightarrowtail: "\u21A3",
      RightCeiling: "\u2309",
      RightDoubleBracket: "\u27E7",
      RightDownTeeVector: "\u295D",
      RightDownVector: "\u21C2",
      RightDownVectorBar: "\u2955",
      RightFloor: "\u230B",
      rightharpoondown: "\u21C1",
      rightharpoonup: "\u21C0",
      rightleftarrows: "\u21C4",
      rightleftharpoons: "\u21CC",
      rightrightarrows: "\u21C9",
      rightsquigarrow: "\u219D",
      RightTee: "\u22A2",
      RightTeeArrow: "\u21A6",
      RightTeeVector: "\u295B",
      rightthreetimes: "\u22CC",
      RightTriangle: "\u22B3",
      RightTriangleBar: "\u29D0",
      RightTriangleEqual: "\u22B5",
      RightUpDownVector: "\u294F",
      RightUpTeeVector: "\u295C",
      RightUpVector: "\u21BE",
      RightUpVectorBar: "\u2954",
      RightVector: "\u21C0",
      RightVectorBar: "\u2953",
      ring: "\u02DA",
      risingdotseq: "\u2253",
      rlarr: "\u21C4",
      rlhar: "\u21CC",
      rlm: "\u200F",
      rmoust: "\u23B1",
      rmoustache: "\u23B1",
      rnmid: "\u2AEE",
      roang: "\u27ED",
      roarr: "\u21FE",
      robrk: "\u27E7",
      ropar: "\u2986",
      Ropf: "\u211D",
      ropf: "\u{1D563}",
      roplus: "\u2A2E",
      rotimes: "\u2A35",
      RoundImplies: "\u2970",
      rpar: ")",
      rpargt: "\u2994",
      rppolint: "\u2A12",
      rrarr: "\u21C9",
      Rrightarrow: "\u21DB",
      rsaquo: "\u203A",
      Rscr: "\u211B",
      rscr: "\u{1D4C7}",
      Rsh: "\u21B1",
      rsh: "\u21B1",
      rsqb: "]",
      rsquo: "\u2019",
      rsquor: "\u2019",
      rthree: "\u22CC",
      rtimes: "\u22CA",
      rtri: "\u25B9",
      rtrie: "\u22B5",
      rtrif: "\u25B8",
      rtriltri: "\u29CE",
      RuleDelayed: "\u29F4",
      ruluhar: "\u2968",
      rx: "\u211E",
      Sacute: "\u015A",
      sacute: "\u015B",
      sbquo: "\u201A",
      Sc: "\u2ABC",
      sc: "\u227B",
      scap: "\u2AB8",
      Scaron: "\u0160",
      scaron: "\u0161",
      sccue: "\u227D",
      scE: "\u2AB4",
      sce: "\u2AB0",
      Scedil: "\u015E",
      scedil: "\u015F",
      Scirc: "\u015C",
      scirc: "\u015D",
      scnap: "\u2ABA",
      scnE: "\u2AB6",
      scnsim: "\u22E9",
      scpolint: "\u2A13",
      scsim: "\u227F",
      Scy: "\u0421",
      scy: "\u0441",
      sdot: "\u22C5",
      sdotb: "\u22A1",
      sdote: "\u2A66",
      searhk: "\u2925",
      seArr: "\u21D8",
      searr: "\u2198",
      searrow: "\u2198",
      sect: "\xA7",
      semi: ";",
      seswar: "\u2929",
      setminus: "\u2216",
      setmn: "\u2216",
      sext: "\u2736",
      Sfr: "\u{1D516}",
      sfr: "\u{1D530}",
      sfrown: "\u2322",
      sharp: "\u266F",
      SHCHcy: "\u0429",
      shchcy: "\u0449",
      SHcy: "\u0428",
      shcy: "\u0448",
      ShortDownArrow: "\u2193",
      ShortLeftArrow: "\u2190",
      shortmid: "\u2223",
      shortparallel: "\u2225",
      ShortRightArrow: "\u2192",
      ShortUpArrow: "\u2191",
      shy: "\xAD",
      Sigma: "\u03A3",
      sigma: "\u03C3",
      sigmaf: "\u03C2",
      sigmav: "\u03C2",
      sim: "\u223C",
      simdot: "\u2A6A",
      sime: "\u2243",
      simeq: "\u2243",
      simg: "\u2A9E",
      simgE: "\u2AA0",
      siml: "\u2A9D",
      simlE: "\u2A9F",
      simne: "\u2246",
      simplus: "\u2A24",
      simrarr: "\u2972",
      slarr: "\u2190",
      SmallCircle: "\u2218",
      smallsetminus: "\u2216",
      smashp: "\u2A33",
      smeparsl: "\u29E4",
      smid: "\u2223",
      smile: "\u2323",
      smt: "\u2AAA",
      smte: "\u2AAC",
      smtes: "\u2AAC\uFE00",
      SOFTcy: "\u042C",
      softcy: "\u044C",
      sol: "/",
      solb: "\u29C4",
      solbar: "\u233F",
      Sopf: "\u{1D54A}",
      sopf: "\u{1D564}",
      spades: "\u2660",
      spadesuit: "\u2660",
      spar: "\u2225",
      sqcap: "\u2293",
      sqcaps: "\u2293\uFE00",
      sqcup: "\u2294",
      sqcups: "\u2294\uFE00",
      Sqrt: "\u221A",
      sqsub: "\u228F",
      sqsube: "\u2291",
      sqsubset: "\u228F",
      sqsubseteq: "\u2291",
      sqsup: "\u2290",
      sqsupe: "\u2292",
      sqsupset: "\u2290",
      sqsupseteq: "\u2292",
      squ: "\u25A1",
      Square: "\u25A1",
      square: "\u25A1",
      SquareIntersection: "\u2293",
      SquareSubset: "\u228F",
      SquareSubsetEqual: "\u2291",
      SquareSuperset: "\u2290",
      SquareSupersetEqual: "\u2292",
      SquareUnion: "\u2294",
      squarf: "\u25AA",
      squf: "\u25AA",
      srarr: "\u2192",
      Sscr: "\u{1D4AE}",
      sscr: "\u{1D4C8}",
      ssetmn: "\u2216",
      ssmile: "\u2323",
      sstarf: "\u22C6",
      Star: "\u22C6",
      star: "\u2606",
      starf: "\u2605",
      straightepsilon: "\u03F5",
      straightphi: "\u03D5",
      strns: "\xAF",
      Sub: "\u22D0",
      sub: "\u2282",
      subdot: "\u2ABD",
      subE: "\u2AC5",
      sube: "\u2286",
      subedot: "\u2AC3",
      submult: "\u2AC1",
      subnE: "\u2ACB",
      subne: "\u228A",
      subplus: "\u2ABF",
      subrarr: "\u2979",
      Subset: "\u22D0",
      subset: "\u2282",
      subseteq: "\u2286",
      subseteqq: "\u2AC5",
      SubsetEqual: "\u2286",
      subsetneq: "\u228A",
      subsetneqq: "\u2ACB",
      subsim: "\u2AC7",
      subsub: "\u2AD5",
      subsup: "\u2AD3",
      succ: "\u227B",
      succapprox: "\u2AB8",
      succcurlyeq: "\u227D",
      Succeeds: "\u227B",
      SucceedsEqual: "\u2AB0",
      SucceedsSlantEqual: "\u227D",
      SucceedsTilde: "\u227F",
      succeq: "\u2AB0",
      succnapprox: "\u2ABA",
      succneqq: "\u2AB6",
      succnsim: "\u22E9",
      succsim: "\u227F",
      SuchThat: "\u220B",
      Sum: "\u2211",
      sum: "\u2211",
      sung: "\u266A",
      Sup: "\u22D1",
      sup: "\u2283",
      sup1: "\xB9",
      sup2: "\xB2",
      sup3: "\xB3",
      supdot: "\u2ABE",
      supdsub: "\u2AD8",
      supE: "\u2AC6",
      supe: "\u2287",
      supedot: "\u2AC4",
      Superset: "\u2283",
      SupersetEqual: "\u2287",
      suphsol: "\u27C9",
      suphsub: "\u2AD7",
      suplarr: "\u297B",
      supmult: "\u2AC2",
      supnE: "\u2ACC",
      supne: "\u228B",
      supplus: "\u2AC0",
      Supset: "\u22D1",
      supset: "\u2283",
      supseteq: "\u2287",
      supseteqq: "\u2AC6",
      supsetneq: "\u228B",
      supsetneqq: "\u2ACC",
      supsim: "\u2AC8",
      supsub: "\u2AD4",
      supsup: "\u2AD6",
      swarhk: "\u2926",
      swArr: "\u21D9",
      swarr: "\u2199",
      swarrow: "\u2199",
      swnwar: "\u292A",
      szlig: "\xDF",
      Tab: "	",
      target: "\u2316",
      Tau: "\u03A4",
      tau: "\u03C4",
      tbrk: "\u23B4",
      Tcaron: "\u0164",
      tcaron: "\u0165",
      Tcedil: "\u0162",
      tcedil: "\u0163",
      Tcy: "\u0422",
      tcy: "\u0442",
      tdot: "\u20DB",
      telrec: "\u2315",
      Tfr: "\u{1D517}",
      tfr: "\u{1D531}",
      there4: "\u2234",
      Therefore: "\u2234",
      therefore: "\u2234",
      Theta: "\u0398",
      theta: "\u03B8",
      thetasym: "\u03D1",
      thetav: "\u03D1",
      thickapprox: "\u2248",
      thicksim: "\u223C",
      ThickSpace: "\u205F\u200A",
      thinsp: "\u2009",
      ThinSpace: "\u2009",
      thkap: "\u2248",
      thksim: "\u223C",
      THORN: "\xDE",
      thorn: "\xFE",
      Tilde: "\u223C",
      tilde: "\u02DC",
      TildeEqual: "\u2243",
      TildeFullEqual: "\u2245",
      TildeTilde: "\u2248",
      times: "\xD7",
      timesb: "\u22A0",
      timesbar: "\u2A31",
      timesd: "\u2A30",
      tint: "\u222D",
      toea: "\u2928",
      top: "\u22A4",
      topbot: "\u2336",
      topcir: "\u2AF1",
      Topf: "\u{1D54B}",
      topf: "\u{1D565}",
      topfork: "\u2ADA",
      tosa: "\u2929",
      tprime: "\u2034",
      TRADE: "\u2122",
      trade: "\u2122",
      triangle: "\u25B5",
      triangledown: "\u25BF",
      triangleleft: "\u25C3",
      trianglelefteq: "\u22B4",
      triangleq: "\u225C",
      triangleright: "\u25B9",
      trianglerighteq: "\u22B5",
      tridot: "\u25EC",
      trie: "\u225C",
      triminus: "\u2A3A",
      TripleDot: "\u20DB",
      triplus: "\u2A39",
      trisb: "\u29CD",
      tritime: "\u2A3B",
      trpezium: "\u23E2",
      Tscr: "\u{1D4AF}",
      tscr: "\u{1D4C9}",
      TScy: "\u0426",
      tscy: "\u0446",
      TSHcy: "\u040B",
      tshcy: "\u045B",
      Tstrok: "\u0166",
      tstrok: "\u0167",
      twixt: "\u226C",
      twoheadleftarrow: "\u219E",
      twoheadrightarrow: "\u21A0",
      Uacute: "\xDA",
      uacute: "\xFA",
      Uarr: "\u219F",
      uArr: "\u21D1",
      uarr: "\u2191",
      Uarrocir: "\u2949",
      Ubrcy: "\u040E",
      ubrcy: "\u045E",
      Ubreve: "\u016C",
      ubreve: "\u016D",
      Ucirc: "\xDB",
      ucirc: "\xFB",
      Ucy: "\u0423",
      ucy: "\u0443",
      udarr: "\u21C5",
      Udblac: "\u0170",
      udblac: "\u0171",
      udhar: "\u296E",
      ufisht: "\u297E",
      Ufr: "\u{1D518}",
      ufr: "\u{1D532}",
      Ugrave: "\xD9",
      ugrave: "\xF9",
      uHar: "\u2963",
      uharl: "\u21BF",
      uharr: "\u21BE",
      uhblk: "\u2580",
      ulcorn: "\u231C",
      ulcorner: "\u231C",
      ulcrop: "\u230F",
      ultri: "\u25F8",
      Umacr: "\u016A",
      umacr: "\u016B",
      uml: "\xA8",
      UnderBar: "_",
      UnderBrace: "\u23DF",
      UnderBracket: "\u23B5",
      UnderParenthesis: "\u23DD",
      Union: "\u22C3",
      UnionPlus: "\u228E",
      Uogon: "\u0172",
      uogon: "\u0173",
      Uopf: "\u{1D54C}",
      uopf: "\u{1D566}",
      UpArrow: "\u2191",
      Uparrow: "\u21D1",
      uparrow: "\u2191",
      UpArrowBar: "\u2912",
      UpArrowDownArrow: "\u21C5",
      UpDownArrow: "\u2195",
      Updownarrow: "\u21D5",
      updownarrow: "\u2195",
      UpEquilibrium: "\u296E",
      upharpoonleft: "\u21BF",
      upharpoonright: "\u21BE",
      uplus: "\u228E",
      UpperLeftArrow: "\u2196",
      UpperRightArrow: "\u2197",
      Upsi: "\u03D2",
      upsi: "\u03C5",
      upsih: "\u03D2",
      Upsilon: "\u03A5",
      upsilon: "\u03C5",
      UpTee: "\u22A5",
      UpTeeArrow: "\u21A5",
      upuparrows: "\u21C8",
      urcorn: "\u231D",
      urcorner: "\u231D",
      urcrop: "\u230E",
      Uring: "\u016E",
      uring: "\u016F",
      urtri: "\u25F9",
      Uscr: "\u{1D4B0}",
      uscr: "\u{1D4CA}",
      utdot: "\u22F0",
      Utilde: "\u0168",
      utilde: "\u0169",
      utri: "\u25B5",
      utrif: "\u25B4",
      uuarr: "\u21C8",
      Uuml: "\xDC",
      uuml: "\xFC",
      uwangle: "\u29A7",
      vangrt: "\u299C",
      varepsilon: "\u03F5",
      varkappa: "\u03F0",
      varnothing: "\u2205",
      varphi: "\u03D5",
      varpi: "\u03D6",
      varpropto: "\u221D",
      vArr: "\u21D5",
      varr: "\u2195",
      varrho: "\u03F1",
      varsigma: "\u03C2",
      varsubsetneq: "\u228A\uFE00",
      varsubsetneqq: "\u2ACB\uFE00",
      varsupsetneq: "\u228B\uFE00",
      varsupsetneqq: "\u2ACC\uFE00",
      vartheta: "\u03D1",
      vartriangleleft: "\u22B2",
      vartriangleright: "\u22B3",
      Vbar: "\u2AEB",
      vBar: "\u2AE8",
      vBarv: "\u2AE9",
      Vcy: "\u0412",
      vcy: "\u0432",
      VDash: "\u22AB",
      Vdash: "\u22A9",
      vDash: "\u22A8",
      vdash: "\u22A2",
      Vdashl: "\u2AE6",
      Vee: "\u22C1",
      vee: "\u2228",
      veebar: "\u22BB",
      veeeq: "\u225A",
      vellip: "\u22EE",
      Verbar: "\u2016",
      verbar: "|",
      Vert: "\u2016",
      vert: "|",
      VerticalBar: "\u2223",
      VerticalLine: "|",
      VerticalSeparator: "\u2758",
      VerticalTilde: "\u2240",
      VeryThinSpace: "\u200A",
      Vfr: "\u{1D519}",
      vfr: "\u{1D533}",
      vltri: "\u22B2",
      vnsub: "\u2282\u20D2",
      vnsup: "\u2283\u20D2",
      Vopf: "\u{1D54D}",
      vopf: "\u{1D567}",
      vprop: "\u221D",
      vrtri: "\u22B3",
      Vscr: "\u{1D4B1}",
      vscr: "\u{1D4CB}",
      vsubnE: "\u2ACB\uFE00",
      vsubne: "\u228A\uFE00",
      vsupnE: "\u2ACC\uFE00",
      vsupne: "\u228B\uFE00",
      Vvdash: "\u22AA",
      vzigzag: "\u299A",
      Wcirc: "\u0174",
      wcirc: "\u0175",
      wedbar: "\u2A5F",
      Wedge: "\u22C0",
      wedge: "\u2227",
      wedgeq: "\u2259",
      weierp: "\u2118",
      Wfr: "\u{1D51A}",
      wfr: "\u{1D534}",
      Wopf: "\u{1D54E}",
      wopf: "\u{1D568}",
      wp: "\u2118",
      wr: "\u2240",
      wreath: "\u2240",
      Wscr: "\u{1D4B2}",
      wscr: "\u{1D4CC}",
      xcap: "\u22C2",
      xcirc: "\u25EF",
      xcup: "\u22C3",
      xdtri: "\u25BD",
      Xfr: "\u{1D51B}",
      xfr: "\u{1D535}",
      xhArr: "\u27FA",
      xharr: "\u27F7",
      Xi: "\u039E",
      xi: "\u03BE",
      xlArr: "\u27F8",
      xlarr: "\u27F5",
      xmap: "\u27FC",
      xnis: "\u22FB",
      xodot: "\u2A00",
      Xopf: "\u{1D54F}",
      xopf: "\u{1D569}",
      xoplus: "\u2A01",
      xotime: "\u2A02",
      xrArr: "\u27F9",
      xrarr: "\u27F6",
      Xscr: "\u{1D4B3}",
      xscr: "\u{1D4CD}",
      xsqcup: "\u2A06",
      xuplus: "\u2A04",
      xutri: "\u25B3",
      xvee: "\u22C1",
      xwedge: "\u22C0",
      Yacute: "\xDD",
      yacute: "\xFD",
      YAcy: "\u042F",
      yacy: "\u044F",
      Ycirc: "\u0176",
      ycirc: "\u0177",
      Ycy: "\u042B",
      ycy: "\u044B",
      yen: "\xA5",
      Yfr: "\u{1D51C}",
      yfr: "\u{1D536}",
      YIcy: "\u0407",
      yicy: "\u0457",
      Yopf: "\u{1D550}",
      yopf: "\u{1D56A}",
      Yscr: "\u{1D4B4}",
      yscr: "\u{1D4CE}",
      YUcy: "\u042E",
      yucy: "\u044E",
      Yuml: "\u0178",
      yuml: "\xFF",
      Zacute: "\u0179",
      zacute: "\u017A",
      Zcaron: "\u017D",
      zcaron: "\u017E",
      Zcy: "\u0417",
      zcy: "\u0437",
      Zdot: "\u017B",
      zdot: "\u017C",
      zeetrf: "\u2128",
      ZeroWidthSpace: "\u200B",
      Zeta: "\u0396",
      zeta: "\u03B6",
      Zfr: "\u2128",
      zfr: "\u{1D537}",
      ZHcy: "\u0416",
      zhcy: "\u0436",
      zigrarr: "\u21DD",
      Zopf: "\u2124",
      zopf: "\u{1D56B}",
      Zscr: "\u{1D4B5}",
      zscr: "\u{1D4CF}",
      zwj: "\u200D",
      zwnj: "\u200C"
    });
    exports2.entityMap = exports2.HTML_ENTITIES;
  }
});

// node_modules/.pnpm/@xmldom+xmldom@0.9.10/node_modules/@xmldom/xmldom/lib/sax.js
var require_sax = __commonJS({
  "node_modules/.pnpm/@xmldom+xmldom@0.9.10/node_modules/@xmldom/xmldom/lib/sax.js"(exports2) {
    "use strict";
    var conventions = require_conventions();
    var g = require_grammar();
    var errors = require_errors();
    var isHTMLEscapableRawTextElement = conventions.isHTMLEscapableRawTextElement;
    var isHTMLMimeType = conventions.isHTMLMimeType;
    var isHTMLRawTextElement = conventions.isHTMLRawTextElement;
    var hasOwn = conventions.hasOwn;
    var NAMESPACE = conventions.NAMESPACE;
    var ParseError = errors.ParseError;
    var DOMException = errors.DOMException;
    var S_TAG = 0;
    var S_ATTR = 1;
    var S_ATTR_SPACE = 2;
    var S_EQ = 3;
    var S_ATTR_NOQUOT_VALUE = 4;
    var S_ATTR_END = 5;
    var S_TAG_SPACE = 6;
    var S_TAG_CLOSE = 7;
    function XMLReader() {
    }
    XMLReader.prototype = {
      parse: function(source, defaultNSMap, entityMap) {
        var domBuilder = this.domBuilder;
        domBuilder.startDocument();
        _copy(defaultNSMap, defaultNSMap = /* @__PURE__ */ Object.create(null));
        parse2(source, defaultNSMap, entityMap, domBuilder, this.errorHandler);
        domBuilder.endDocument();
      }
    };
    var ENTITY_REG = /&#?\w+;?/g;
    function parse2(source, defaultNSMapCopy, entityMap, domBuilder, errorHandler) {
      var isHTML = isHTMLMimeType(domBuilder.mimeType);
      if (source.indexOf(g.UNICODE_REPLACEMENT_CHARACTER) >= 0) {
        errorHandler.warning("Unicode replacement character detected, source encoding issues?");
      }
      function fixedFromCharCode(code) {
        if (code > 65535) {
          code -= 65536;
          var surrogate1 = 55296 + (code >> 10), surrogate2 = 56320 + (code & 1023);
          return String.fromCharCode(surrogate1, surrogate2);
        } else {
          return String.fromCharCode(code);
        }
      }
      function entityReplacer(a2) {
        var complete = a2[a2.length - 1] === ";" ? a2 : a2 + ";";
        if (!isHTML && complete !== a2) {
          errorHandler.error("EntityRef: expecting ;");
          return a2;
        }
        var match = g.Reference.exec(complete);
        if (!match || match[0].length !== complete.length) {
          errorHandler.error("entity not matching Reference production: " + a2);
          return a2;
        }
        var k = complete.slice(1, -1);
        if (hasOwn(entityMap, k)) {
          return entityMap[k];
        } else if (k.charAt(0) === "#") {
          return fixedFromCharCode(parseInt(k.substring(1).replace("x", "0x")));
        } else {
          errorHandler.error("entity not found:" + a2);
          return a2;
        }
      }
      function appendText(end2) {
        if (end2 > start) {
          var xt = source.substring(start, end2).replace(ENTITY_REG, entityReplacer);
          locator && position(start);
          domBuilder.characters(xt, 0, end2 - start);
          start = end2;
        }
      }
      var lineStart = 0;
      var lineEnd = 0;
      var linePattern = /\r\n?|\n|$/g;
      var locator = domBuilder.locator;
      function position(p, m) {
        while (p >= lineEnd && (m = linePattern.exec(source))) {
          lineStart = lineEnd;
          lineEnd = m.index + m[0].length;
          locator.lineNumber++;
        }
        locator.columnNumber = p - lineStart + 1;
      }
      var parseStack = [{ currentNSMap: defaultNSMapCopy }];
      var unclosedTags = [];
      var start = 0;
      while (true) {
        try {
          var tagStart = source.indexOf("<", start);
          if (tagStart < 0) {
            if (!isHTML && unclosedTags.length > 0) {
              return errorHandler.fatalError("unclosed xml tag(s): " + unclosedTags.join(", "));
            }
            if (!source.substring(start).match(/^\s*$/)) {
              var doc = domBuilder.doc;
              var text = doc.createTextNode(source.substring(start));
              if (doc.documentElement) {
                return errorHandler.error("Extra content at the end of the document");
              }
              doc.appendChild(text);
              domBuilder.currentElement = text;
            }
            return;
          }
          if (tagStart > start) {
            var fromSource = source.substring(start, tagStart);
            if (!isHTML && unclosedTags.length === 0) {
              fromSource = fromSource.replace(new RegExp(g.S_OPT.source, "g"), "");
              fromSource && errorHandler.error("Unexpected content outside root element: '" + fromSource + "'");
            }
            appendText(tagStart);
          }
          switch (source.charAt(tagStart + 1)) {
            case "/":
              var end = source.indexOf(">", tagStart + 2);
              var tagNameRaw = source.substring(tagStart + 2, end > 0 ? end : void 0);
              if (!tagNameRaw) {
                return errorHandler.fatalError("end tag name missing");
              }
              var tagNameMatch = end > 0 && g.reg("^", g.QName_group, g.S_OPT, "$").exec(tagNameRaw);
              if (!tagNameMatch) {
                return errorHandler.fatalError('end tag name contains invalid characters: "' + tagNameRaw + '"');
              }
              if (!domBuilder.currentElement && !domBuilder.doc.documentElement) {
                return;
              }
              var currentTagName = unclosedTags[unclosedTags.length - 1] || domBuilder.currentElement.tagName || domBuilder.doc.documentElement.tagName || "";
              if (currentTagName !== tagNameMatch[1]) {
                var tagNameLower = tagNameMatch[1].toLowerCase();
                if (!isHTML || currentTagName.toLowerCase() !== tagNameLower) {
                  return errorHandler.fatalError('Opening and ending tag mismatch: "' + currentTagName + '" != "' + tagNameRaw + '"');
                }
              }
              var config = parseStack.pop();
              unclosedTags.pop();
              var localNSMap = config.localNSMap;
              domBuilder.endElement(config.uri, config.localName, currentTagName);
              if (localNSMap) {
                for (var prefix in localNSMap) {
                  if (hasOwn(localNSMap, prefix)) {
                    domBuilder.endPrefixMapping(prefix);
                  }
                }
              }
              end++;
              break;
            // end element
            case "?":
              locator && position(tagStart);
              end = parseProcessingInstruction(source, tagStart, domBuilder, errorHandler);
              break;
            case "!":
              locator && position(tagStart);
              end = parseDoctypeCommentOrCData(source, tagStart, domBuilder, errorHandler, isHTML);
              break;
            default:
              locator && position(tagStart);
              var el = new ElementAttributes();
              var currentNSMap = parseStack[parseStack.length - 1].currentNSMap;
              var end = parseElementStartPart(source, tagStart, el, currentNSMap, entityReplacer, errorHandler, isHTML);
              var len = el.length;
              if (!el.closed) {
                if (isHTML && conventions.isHTMLVoidElement(el.tagName)) {
                  el.closed = true;
                } else {
                  unclosedTags.push(el.tagName);
                }
              }
              if (locator && len) {
                var locator2 = copyLocator(locator, {});
                for (var i = 0; i < len; i++) {
                  var a = el[i];
                  position(a.offset);
                  a.locator = copyLocator(locator, {});
                }
                domBuilder.locator = locator2;
                if (appendElement(el, domBuilder, currentNSMap)) {
                  parseStack.push(el);
                }
                domBuilder.locator = locator;
              } else {
                if (appendElement(el, domBuilder, currentNSMap)) {
                  parseStack.push(el);
                }
              }
              if (isHTML && !el.closed) {
                end = parseHtmlSpecialContent(source, end, el.tagName, entityReplacer, domBuilder);
              } else {
                end++;
              }
          }
        } catch (e) {
          if (e instanceof ParseError) {
            throw e;
          } else if (e instanceof DOMException) {
            throw new ParseError(e.name + ": " + e.message, domBuilder.locator, e);
          }
          errorHandler.error("element parse error: " + e);
          end = -1;
        }
        if (end > start) {
          start = end;
        } else {
          appendText(Math.max(tagStart, start) + 1);
        }
      }
    }
    function copyLocator(f, t) {
      t.lineNumber = f.lineNumber;
      t.columnNumber = f.columnNumber;
      return t;
    }
    function parseElementStartPart(source, start, el, currentNSMap, entityReplacer, errorHandler, isHTML) {
      function addAttribute(qname, value2, startIndex) {
        if (hasOwn(el.attributeNames, qname)) {
          return errorHandler.fatalError("Attribute " + qname + " redefined");
        }
        if (!isHTML && value2.indexOf("<") >= 0) {
          return errorHandler.fatalError("Unescaped '<' not allowed in attributes values");
        }
        el.addValue(
          qname,
          // @see https://www.w3.org/TR/xml/#AVNormalize
          // since the xmldom sax parser does not "interpret" DTD the following is not implemented:
          // - recursive replacement of (DTD) entity references
          // - trimming and collapsing multiple spaces into a single one for attributes that are not of type CDATA
          value2.replace(/[\t\n\r]/g, " ").replace(ENTITY_REG, entityReplacer),
          startIndex
        );
      }
      var attrName;
      var value;
      var p = ++start;
      var s = S_TAG;
      while (true) {
        var c = source.charAt(p);
        switch (c) {
          case "=":
            if (s === S_ATTR) {
              attrName = source.slice(start, p);
              s = S_EQ;
            } else if (s === S_ATTR_SPACE) {
              s = S_EQ;
            } else {
              throw new Error("attribute equal must after attrName");
            }
            break;
          case "'":
          case '"':
            if (s === S_EQ || s === S_ATTR) {
              if (s === S_ATTR) {
                errorHandler.warning('attribute value must after "="');
                attrName = source.slice(start, p);
              }
              start = p + 1;
              p = source.indexOf(c, start);
              if (p > 0) {
                value = source.slice(start, p);
                addAttribute(attrName, value, start - 1);
                s = S_ATTR_END;
              } else {
                throw new Error("attribute value no end '" + c + "' match");
              }
            } else if (s == S_ATTR_NOQUOT_VALUE) {
              value = source.slice(start, p);
              addAttribute(attrName, value, start);
              errorHandler.warning('attribute "' + attrName + '" missed start quot(' + c + ")!!");
              start = p + 1;
              s = S_ATTR_END;
            } else {
              throw new Error('attribute value must after "="');
            }
            break;
          case "/":
            switch (s) {
              case S_TAG:
                el.setTagName(source.slice(start, p));
              case S_ATTR_END:
              case S_TAG_SPACE:
              case S_TAG_CLOSE:
                s = S_TAG_CLOSE;
                el.closed = true;
              case S_ATTR_NOQUOT_VALUE:
              case S_ATTR:
                break;
              case S_ATTR_SPACE:
                el.closed = true;
                break;
              //case S_EQ:
              default:
                throw new Error("attribute invalid close char('/')");
            }
            break;
          case "":
            errorHandler.error("unexpected end of input");
            if (s == S_TAG) {
              el.setTagName(source.slice(start, p));
            }
            return p;
          case ">":
            switch (s) {
              case S_TAG:
                el.setTagName(source.slice(start, p));
              case S_ATTR_END:
              case S_TAG_SPACE:
              case S_TAG_CLOSE:
                break;
              //normal
              case S_ATTR_NOQUOT_VALUE:
              //Compatible state
              case S_ATTR:
                value = source.slice(start, p);
                if (value.slice(-1) === "/") {
                  el.closed = true;
                  value = value.slice(0, -1);
                }
              case S_ATTR_SPACE:
                if (s === S_ATTR_SPACE) {
                  value = attrName;
                }
                if (s == S_ATTR_NOQUOT_VALUE) {
                  errorHandler.warning('attribute "' + value + '" missed quot(")!');
                  addAttribute(attrName, value, start);
                } else {
                  if (!isHTML) {
                    errorHandler.warning('attribute "' + value + '" missed value!! "' + value + '" instead!!');
                  }
                  addAttribute(value, value, start);
                }
                break;
              case S_EQ:
                if (!isHTML) {
                  return errorHandler.fatalError(`AttValue: ' or " expected`);
                }
            }
            return p;
          /*xml space '\x20' | #x9 | #xD | #xA; */
          case "\x80":
            c = " ";
          default:
            if (c <= " ") {
              switch (s) {
                case S_TAG:
                  el.setTagName(source.slice(start, p));
                  s = S_TAG_SPACE;
                  break;
                case S_ATTR:
                  attrName = source.slice(start, p);
                  s = S_ATTR_SPACE;
                  break;
                case S_ATTR_NOQUOT_VALUE:
                  var value = source.slice(start, p);
                  errorHandler.warning('attribute "' + value + '" missed quot(")!!');
                  addAttribute(attrName, value, start);
                case S_ATTR_END:
                  s = S_TAG_SPACE;
                  break;
              }
            } else {
              switch (s) {
                //case S_TAG:void();break;
                //case S_ATTR:void();break;
                //case S_ATTR_NOQUOT_VALUE:void();break;
                case S_ATTR_SPACE:
                  if (!isHTML) {
                    errorHandler.warning('attribute "' + attrName + '" missed value!! "' + attrName + '" instead2!!');
                  }
                  addAttribute(attrName, attrName, start);
                  start = p;
                  s = S_ATTR;
                  break;
                case S_ATTR_END:
                  errorHandler.warning('attribute space is required"' + attrName + '"!!');
                case S_TAG_SPACE:
                  s = S_ATTR;
                  start = p;
                  break;
                case S_EQ:
                  s = S_ATTR_NOQUOT_VALUE;
                  start = p;
                  break;
                case S_TAG_CLOSE:
                  throw new Error("elements closed character '/' and '>' must be connected to");
              }
            }
        }
        p++;
      }
    }
    function appendElement(el, domBuilder, currentNSMap) {
      var tagName = el.tagName;
      var localNSMap = null;
      var i = el.length;
      while (i--) {
        var a = el[i];
        var qName = a.qName;
        var value = a.value;
        var nsp = qName.indexOf(":");
        if (nsp > 0) {
          var prefix = a.prefix = qName.slice(0, nsp);
          var localName = qName.slice(nsp + 1);
          var nsPrefix = prefix === "xmlns" && localName;
        } else {
          localName = qName;
          prefix = null;
          nsPrefix = qName === "xmlns" && "";
        }
        a.localName = localName;
        if (nsPrefix !== false) {
          if (localNSMap == null) {
            localNSMap = /* @__PURE__ */ Object.create(null);
            _copy(currentNSMap, currentNSMap = /* @__PURE__ */ Object.create(null));
          }
          currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
          a.uri = NAMESPACE.XMLNS;
          domBuilder.startPrefixMapping(nsPrefix, value);
        }
      }
      var i = el.length;
      while (i--) {
        a = el[i];
        if (a.prefix) {
          if (a.prefix === "xml") {
            a.uri = NAMESPACE.XML;
          }
          if (a.prefix !== "xmlns") {
            a.uri = currentNSMap[a.prefix];
          }
        }
      }
      var nsp = tagName.indexOf(":");
      if (nsp > 0) {
        prefix = el.prefix = tagName.slice(0, nsp);
        localName = el.localName = tagName.slice(nsp + 1);
      } else {
        prefix = null;
        localName = el.localName = tagName;
      }
      var ns = el.uri = currentNSMap[prefix || ""];
      domBuilder.startElement(ns, localName, tagName, el);
      if (el.closed) {
        domBuilder.endElement(ns, localName, tagName);
        if (localNSMap) {
          for (prefix in localNSMap) {
            if (hasOwn(localNSMap, prefix)) {
              domBuilder.endPrefixMapping(prefix);
            }
          }
        }
      } else {
        el.currentNSMap = currentNSMap;
        el.localNSMap = localNSMap;
        return true;
      }
    }
    function parseHtmlSpecialContent(source, elStartEnd, tagName, entityReplacer, domBuilder) {
      var isEscapableRaw = isHTMLEscapableRawTextElement(tagName);
      if (isEscapableRaw || isHTMLRawTextElement(tagName)) {
        var elEndStart = source.indexOf("</" + tagName + ">", elStartEnd);
        var text = source.substring(elStartEnd + 1, elEndStart);
        if (isEscapableRaw) {
          text = text.replace(ENTITY_REG, entityReplacer);
        }
        domBuilder.characters(text, 0, text.length);
        return elEndStart;
      }
      return elStartEnd + 1;
    }
    function _copy(source, target) {
      for (var n in source) {
        if (hasOwn(source, n)) {
          target[n] = source[n];
        }
      }
    }
    function parseUtils(source, start) {
      var index = start;
      function char(n) {
        n = n || 0;
        return source.charAt(index + n);
      }
      function skip(n) {
        n = n || 1;
        index += n;
      }
      function skipBlanks() {
        var blanks = 0;
        while (index < source.length) {
          var c = char();
          if (c !== " " && c !== "\n" && c !== "	" && c !== "\r") {
            return blanks;
          }
          blanks++;
          skip();
        }
        return -1;
      }
      function substringFromIndex() {
        return source.substring(index);
      }
      function substringStartsWith(text) {
        return source.substring(index, index + text.length) === text;
      }
      function substringStartsWithCaseInsensitive(text) {
        return source.substring(index, index + text.length).toUpperCase() === text.toUpperCase();
      }
      function getMatch(args) {
        var expr = g.reg("^", args);
        var match = expr.exec(substringFromIndex());
        if (match) {
          skip(match[0].length);
          return match[0];
        }
        return null;
      }
      return {
        char,
        getIndex: function() {
          return index;
        },
        getMatch,
        getSource: function() {
          return source;
        },
        skip,
        skipBlanks,
        substringFromIndex,
        substringStartsWith,
        substringStartsWithCaseInsensitive
      };
    }
    function parseDoctypeInternalSubset(p, errorHandler) {
      function parsePI(p2, errorHandler2) {
        var match = g.PI.exec(p2.substringFromIndex());
        if (!match) {
          return errorHandler2.fatalError("processing instruction is not well-formed at position " + p2.getIndex());
        }
        if (match[1].toLowerCase() === "xml") {
          return errorHandler2.fatalError(
            "xml declaration is only allowed at the start of the document, but found at position " + p2.getIndex()
          );
        }
        p2.skip(match[0].length);
        return match[0];
      }
      var source = p.getSource();
      if (p.char() === "[") {
        p.skip(1);
        var intSubsetStart = p.getIndex();
        while (p.getIndex() < source.length) {
          p.skipBlanks();
          if (p.char() === "]") {
            var internalSubset = source.substring(intSubsetStart, p.getIndex());
            p.skip(1);
            return internalSubset;
          }
          var current = null;
          if (p.char() === "<" && p.char(1) === "!") {
            switch (p.char(2)) {
              case "E":
                if (p.char(3) === "L") {
                  current = p.getMatch(g.elementdecl);
                } else if (p.char(3) === "N") {
                  current = p.getMatch(g.EntityDecl);
                }
                break;
              case "A":
                current = p.getMatch(g.AttlistDecl);
                break;
              case "N":
                current = p.getMatch(g.NotationDecl);
                break;
              case "-":
                current = p.getMatch(g.Comment);
                break;
            }
          } else if (p.char() === "<" && p.char(1) === "?") {
            current = parsePI(p, errorHandler);
          } else if (p.char() === "%") {
            current = p.getMatch(g.PEReference);
          } else {
            return errorHandler.fatalError("Error detected in Markup declaration");
          }
          if (!current) {
            return errorHandler.fatalError("Error in internal subset at position " + p.getIndex());
          }
        }
        return errorHandler.fatalError("doctype internal subset is not well-formed, missing ]");
      }
    }
    function parseDoctypeCommentOrCData(source, start, domBuilder, errorHandler, isHTML) {
      var p = parseUtils(source, start);
      switch (isHTML ? p.char(2).toUpperCase() : p.char(2)) {
        case "-":
          var comment = p.getMatch(g.Comment);
          if (comment) {
            domBuilder.comment(comment, g.COMMENT_START.length, comment.length - g.COMMENT_START.length - g.COMMENT_END.length);
            return p.getIndex();
          } else {
            return errorHandler.fatalError("comment is not well-formed at position " + p.getIndex());
          }
        case "[":
          var cdata = p.getMatch(g.CDSect);
          if (cdata) {
            if (!isHTML && !domBuilder.currentElement) {
              return errorHandler.fatalError("CDATA outside of element");
            }
            domBuilder.startCDATA();
            domBuilder.characters(cdata, g.CDATA_START.length, cdata.length - g.CDATA_START.length - g.CDATA_END.length);
            domBuilder.endCDATA();
            return p.getIndex();
          } else {
            return errorHandler.fatalError("Invalid CDATA starting at position " + start);
          }
        case "D": {
          if (domBuilder.doc && domBuilder.doc.documentElement) {
            return errorHandler.fatalError("Doctype not allowed inside or after documentElement at position " + p.getIndex());
          }
          if (isHTML ? !p.substringStartsWithCaseInsensitive(g.DOCTYPE_DECL_START) : !p.substringStartsWith(g.DOCTYPE_DECL_START)) {
            return errorHandler.fatalError("Expected " + g.DOCTYPE_DECL_START + " at position " + p.getIndex());
          }
          p.skip(g.DOCTYPE_DECL_START.length);
          if (p.skipBlanks() < 1) {
            return errorHandler.fatalError("Expected whitespace after " + g.DOCTYPE_DECL_START + " at position " + p.getIndex());
          }
          var doctype = {
            name: void 0,
            publicId: void 0,
            systemId: void 0,
            internalSubset: void 0
          };
          doctype.name = p.getMatch(g.Name);
          if (!doctype.name)
            return errorHandler.fatalError("doctype name missing or contains unexpected characters at position " + p.getIndex());
          if (isHTML && doctype.name.toLowerCase() !== "html") {
            errorHandler.warning("Unexpected DOCTYPE in HTML document at position " + p.getIndex());
          }
          p.skipBlanks();
          if (p.substringStartsWith(g.PUBLIC) || p.substringStartsWith(g.SYSTEM)) {
            var match = g.ExternalID_match.exec(p.substringFromIndex());
            if (!match) {
              return errorHandler.fatalError("doctype external id is not well-formed at position " + p.getIndex());
            }
            if (match.groups.SystemLiteralOnly !== void 0) {
              doctype.systemId = match.groups.SystemLiteralOnly;
            } else {
              doctype.systemId = match.groups.SystemLiteral;
              doctype.publicId = match.groups.PubidLiteral;
            }
            p.skip(match[0].length);
          } else if (isHTML && p.substringStartsWithCaseInsensitive(g.SYSTEM)) {
            p.skip(g.SYSTEM.length);
            if (p.skipBlanks() < 1) {
              return errorHandler.fatalError("Expected whitespace after " + g.SYSTEM + " at position " + p.getIndex());
            }
            doctype.systemId = p.getMatch(g.ABOUT_LEGACY_COMPAT_SystemLiteral);
            if (!doctype.systemId) {
              return errorHandler.fatalError(
                "Expected " + g.ABOUT_LEGACY_COMPAT + " in single or double quotes after " + g.SYSTEM + " at position " + p.getIndex()
              );
            }
          }
          if (isHTML && doctype.systemId && !g.ABOUT_LEGACY_COMPAT_SystemLiteral.test(doctype.systemId)) {
            errorHandler.warning("Unexpected doctype.systemId in HTML document at position " + p.getIndex());
          }
          if (!isHTML) {
            p.skipBlanks();
            doctype.internalSubset = parseDoctypeInternalSubset(p, errorHandler);
          }
          p.skipBlanks();
          if (p.char() !== ">") {
            return errorHandler.fatalError("doctype not terminated with > at position " + p.getIndex());
          }
          p.skip(1);
          domBuilder.startDTD(doctype.name, doctype.publicId, doctype.systemId, doctype.internalSubset);
          domBuilder.endDTD();
          return p.getIndex();
        }
        default:
          return errorHandler.fatalError('Not well-formed XML starting with "<!" at position ' + start);
      }
    }
    function parseProcessingInstruction(source, start, domBuilder, errorHandler) {
      var match = source.substring(start).match(g.PI);
      if (!match) {
        return errorHandler.fatalError("Invalid processing instruction starting at position " + start);
      }
      if (match[1].toLowerCase() === "xml") {
        if (start > 0) {
          return errorHandler.fatalError(
            "processing instruction at position " + start + " is an xml declaration which is only at the start of the document"
          );
        }
        if (!g.XMLDecl.test(source.substring(start))) {
          return errorHandler.fatalError("xml declaration is not well-formed");
        }
      }
      domBuilder.processingInstruction(match[1], match[2]);
      return start + match[0].length;
    }
    function ElementAttributes() {
      this.attributeNames = /* @__PURE__ */ Object.create(null);
    }
    ElementAttributes.prototype = {
      setTagName: function(tagName) {
        if (!g.QName_exact.test(tagName)) {
          throw new Error("invalid tagName:" + tagName);
        }
        this.tagName = tagName;
      },
      addValue: function(qName, value, offset) {
        if (!g.QName_exact.test(qName)) {
          throw new Error("invalid attribute:" + qName);
        }
        this.attributeNames[qName] = this.length;
        this[this.length++] = { qName, value, offset };
      },
      length: 0,
      getLocalName: function(i) {
        return this[i].localName;
      },
      getLocator: function(i) {
        return this[i].locator;
      },
      getQName: function(i) {
        return this[i].qName;
      },
      getURI: function(i) {
        return this[i].uri;
      },
      getValue: function(i) {
        return this[i].value;
      }
      //	,getIndex:function(uri, localName)){
      //		if(localName){
      //
      //		}else{
      //			var qName = uri
      //		}
      //	},
      //	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
      //	getType:function(uri,localName){}
      //	getType:function(i){},
    };
    exports2.XMLReader = XMLReader;
    exports2.parseUtils = parseUtils;
    exports2.parseDoctypeCommentOrCData = parseDoctypeCommentOrCData;
  }
});

// node_modules/.pnpm/@xmldom+xmldom@0.9.10/node_modules/@xmldom/xmldom/lib/dom-parser.js
var require_dom_parser = __commonJS({
  "node_modules/.pnpm/@xmldom+xmldom@0.9.10/node_modules/@xmldom/xmldom/lib/dom-parser.js"(exports2) {
    "use strict";
    var conventions = require_conventions();
    var dom = require_dom();
    var errors = require_errors();
    var entities = require_entities();
    var sax = require_sax();
    var DOMImplementation = dom.DOMImplementation;
    var hasDefaultHTMLNamespace = conventions.hasDefaultHTMLNamespace;
    var isHTMLMimeType = conventions.isHTMLMimeType;
    var isValidMimeType = conventions.isValidMimeType;
    var MIME_TYPE = conventions.MIME_TYPE;
    var NAMESPACE = conventions.NAMESPACE;
    var ParseError = errors.ParseError;
    var XMLReader = sax.XMLReader;
    function normalizeLineEndings(input) {
      return input.replace(/\r[\n\u0085]/g, "\n").replace(/[\r\u0085\u2028\u2029]/g, "\n");
    }
    function DOMParser2(options) {
      options = options || {};
      if (options.locator === void 0) {
        options.locator = true;
      }
      this.assign = options.assign || conventions.assign;
      this.domHandler = options.domHandler || DOMHandler;
      this.onError = options.onError || options.errorHandler;
      if (options.errorHandler && typeof options.errorHandler !== "function") {
        throw new TypeError("errorHandler object is no longer supported, switch to onError!");
      } else if (options.errorHandler) {
        options.errorHandler("warning", "The `errorHandler` option has been deprecated, use `onError` instead!", this);
      }
      this.normalizeLineEndings = options.normalizeLineEndings || normalizeLineEndings;
      this.locator = !!options.locator;
      this.xmlns = this.assign(/* @__PURE__ */ Object.create(null), options.xmlns);
    }
    DOMParser2.prototype.parseFromString = function(source, mimeType) {
      if (!isValidMimeType(mimeType)) {
        throw new TypeError('DOMParser.parseFromString: the provided mimeType "' + mimeType + '" is not valid.');
      }
      var defaultNSMap = this.assign(/* @__PURE__ */ Object.create(null), this.xmlns);
      var entityMap = entities.XML_ENTITIES;
      var defaultNamespace = defaultNSMap[""] || null;
      if (hasDefaultHTMLNamespace(mimeType)) {
        entityMap = entities.HTML_ENTITIES;
        defaultNamespace = NAMESPACE.HTML;
      } else if (mimeType === MIME_TYPE.XML_SVG_IMAGE) {
        defaultNamespace = NAMESPACE.SVG;
      }
      defaultNSMap[""] = defaultNamespace;
      defaultNSMap.xml = defaultNSMap.xml || NAMESPACE.XML;
      var domBuilder = new this.domHandler({
        mimeType,
        defaultNamespace,
        onError: this.onError
      });
      var locator = this.locator ? {} : void 0;
      if (this.locator) {
        domBuilder.setDocumentLocator(locator);
      }
      var sax2 = new XMLReader();
      sax2.errorHandler = domBuilder;
      sax2.domBuilder = domBuilder;
      var isXml = !conventions.isHTMLMimeType(mimeType);
      if (isXml && typeof source !== "string") {
        sax2.errorHandler.fatalError("source is not a string");
      }
      sax2.parse(this.normalizeLineEndings(String(source)), defaultNSMap, entityMap);
      if (!domBuilder.doc.documentElement) {
        sax2.errorHandler.fatalError("missing root element");
      }
      return domBuilder.doc;
    };
    function DOMHandler(options) {
      var opt = options || {};
      this.mimeType = opt.mimeType || MIME_TYPE.XML_APPLICATION;
      this.defaultNamespace = opt.defaultNamespace || null;
      this.cdata = false;
      this.currentElement = void 0;
      this.doc = void 0;
      this.locator = void 0;
      this.onError = opt.onError;
    }
    function position(locator, node) {
      node.lineNumber = locator.lineNumber;
      node.columnNumber = locator.columnNumber;
    }
    DOMHandler.prototype = {
      /**
       * Either creates an XML or an HTML document and stores it under `this.doc`.
       * If it is an XML document, `this.defaultNamespace` is used to create it,
       * and it will not contain any `childNodes`.
       * If it is an HTML document, it will be created without any `childNodes`.
       *
       * @see http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
       */
      startDocument: function() {
        var impl = new DOMImplementation();
        this.doc = isHTMLMimeType(this.mimeType) ? impl.createHTMLDocument(false) : impl.createDocument(this.defaultNamespace, "");
      },
      startElement: function(namespaceURI, localName, qName, attrs) {
        var doc = this.doc;
        var el = doc.createElementNS(namespaceURI, qName || localName);
        var len = attrs.length;
        appendElement(this, el);
        this.currentElement = el;
        this.locator && position(this.locator, el);
        for (var i = 0; i < len; i++) {
          var namespaceURI = attrs.getURI(i);
          var value = attrs.getValue(i);
          var qName = attrs.getQName(i);
          var attr = doc.createAttributeNS(namespaceURI, qName);
          this.locator && position(attrs.getLocator(i), attr);
          attr.value = attr.nodeValue = value;
          el.setAttributeNode(attr);
        }
      },
      endElement: function(namespaceURI, localName, qName) {
        this.currentElement = this.currentElement.parentNode;
      },
      startPrefixMapping: function(prefix, uri) {
      },
      endPrefixMapping: function(prefix) {
      },
      processingInstruction: function(target, data) {
        var ins = this.doc.createProcessingInstruction(target, data);
        this.locator && position(this.locator, ins);
        appendElement(this, ins);
      },
      ignorableWhitespace: function(ch, start, length) {
      },
      characters: function(chars, start, length) {
        chars = _toString.apply(this, arguments);
        if (chars) {
          if (this.cdata) {
            var charNode = this.doc.createCDATASection(chars);
          } else {
            var charNode = this.doc.createTextNode(chars);
          }
          if (this.currentElement) {
            this.currentElement.appendChild(charNode);
          } else if (/^\s*$/.test(chars)) {
            this.doc.appendChild(charNode);
          }
          this.locator && position(this.locator, charNode);
        }
      },
      skippedEntity: function(name) {
      },
      endDocument: function() {
        this.doc.normalize();
      },
      /**
       * Stores the locator to be able to set the `columnNumber` and `lineNumber`
       * on the created DOM nodes.
       *
       * @param {Locator} locator
       */
      setDocumentLocator: function(locator) {
        if (locator) {
          locator.lineNumber = 0;
        }
        this.locator = locator;
      },
      //LexicalHandler
      comment: function(chars, start, length) {
        chars = _toString.apply(this, arguments);
        var comm = this.doc.createComment(chars);
        this.locator && position(this.locator, comm);
        appendElement(this, comm);
      },
      startCDATA: function() {
        this.cdata = true;
      },
      endCDATA: function() {
        this.cdata = false;
      },
      startDTD: function(name, publicId, systemId, internalSubset) {
        var impl = this.doc.implementation;
        if (impl && impl.createDocumentType) {
          var dt = impl.createDocumentType(name, publicId, systemId, internalSubset);
          this.locator && position(this.locator, dt);
          appendElement(this, dt);
          this.doc.doctype = dt;
        }
      },
      reportError: function(level, message) {
        if (typeof this.onError === "function") {
          try {
            this.onError(level, message, this);
          } catch (e) {
            throw new ParseError("Reporting " + level + ' "' + message + '" caused ' + e, this.locator);
          }
        } else {
          console.error("[xmldom " + level + "]	" + message, _locator(this.locator));
        }
      },
      /**
       * @see http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
       */
      warning: function(message) {
        this.reportError("warning", message);
      },
      error: function(message) {
        this.reportError("error", message);
      },
      /**
       * This function reports a fatal error and throws a ParseError.
       *
       * @param {string} message
       * - The message to be used for reporting and throwing the error.
       * @returns {never}
       * This function always throws an error and never returns a value.
       * @throws {ParseError}
       * Always throws a ParseError with the provided message.
       */
      fatalError: function(message) {
        this.reportError("fatalError", message);
        throw new ParseError(message, this.locator);
      }
    };
    function _locator(l) {
      if (l) {
        return "\n@#[line:" + l.lineNumber + ",col:" + l.columnNumber + "]";
      }
    }
    function _toString(chars, start, length) {
      if (typeof chars == "string") {
        return chars.substr(start, length);
      } else {
        if (chars.length >= start + length || start) {
          return new java.lang.String(chars, start, length) + "";
        }
        return chars;
      }
    }
    "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(
      /\w+/g,
      function(key) {
        DOMHandler.prototype[key] = function() {
          return null;
        };
      }
    );
    function appendElement(handler, node) {
      if (!handler.currentElement) {
        handler.doc.appendChild(node);
      } else {
        handler.currentElement.appendChild(node);
      }
    }
    function onErrorStopParsing(level) {
      if (level === "error") throw "onErrorStopParsing";
    }
    function onWarningStopParsing() {
      throw "onWarningStopParsing";
    }
    exports2.__DOMHandler = DOMHandler;
    exports2.DOMParser = DOMParser2;
    exports2.normalizeLineEndings = normalizeLineEndings;
    exports2.onErrorStopParsing = onErrorStopParsing;
    exports2.onWarningStopParsing = onWarningStopParsing;
  }
});

// node_modules/.pnpm/@xmldom+xmldom@0.9.10/node_modules/@xmldom/xmldom/lib/index.js
var require_lib = __commonJS({
  "node_modules/.pnpm/@xmldom+xmldom@0.9.10/node_modules/@xmldom/xmldom/lib/index.js"(exports2) {
    "use strict";
    var conventions = require_conventions();
    exports2.assign = conventions.assign;
    exports2.hasDefaultHTMLNamespace = conventions.hasDefaultHTMLNamespace;
    exports2.isHTMLMimeType = conventions.isHTMLMimeType;
    exports2.isValidMimeType = conventions.isValidMimeType;
    exports2.MIME_TYPE = conventions.MIME_TYPE;
    exports2.NAMESPACE = conventions.NAMESPACE;
    var errors = require_errors();
    exports2.DOMException = errors.DOMException;
    exports2.DOMExceptionName = errors.DOMExceptionName;
    exports2.ExceptionCode = errors.ExceptionCode;
    exports2.ParseError = errors.ParseError;
    var dom = require_dom();
    exports2.Attr = dom.Attr;
    exports2.CDATASection = dom.CDATASection;
    exports2.CharacterData = dom.CharacterData;
    exports2.Comment = dom.Comment;
    exports2.Document = dom.Document;
    exports2.DocumentFragment = dom.DocumentFragment;
    exports2.DocumentType = dom.DocumentType;
    exports2.DOMImplementation = dom.DOMImplementation;
    exports2.Element = dom.Element;
    exports2.Entity = dom.Entity;
    exports2.EntityReference = dom.EntityReference;
    exports2.LiveNodeList = dom.LiveNodeList;
    exports2.NamedNodeMap = dom.NamedNodeMap;
    exports2.Node = dom.Node;
    exports2.NodeList = dom.NodeList;
    exports2.Notation = dom.Notation;
    exports2.ProcessingInstruction = dom.ProcessingInstruction;
    exports2.Text = dom.Text;
    exports2.XMLSerializer = dom.XMLSerializer;
    var domParser = require_dom_parser();
    exports2.DOMParser = domParser.DOMParser;
    exports2.normalizeLineEndings = domParser.normalizeLineEndings;
    exports2.onErrorStopParsing = domParser.onErrorStopParsing;
    exports2.onWarningStopParsing = domParser.onWarningStopParsing;
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/Utility.js
var require_Utility = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/Utility.js"(exports2, module2) {
    (function() {
      var assign, getValue, isArray, isEmpty, isFunction, isObject, isPlainObject, hasProp = {}.hasOwnProperty;
      assign = function(target, ...sources) {
        var i, key, len, source;
        if (isFunction(Object.assign)) {
          Object.assign.apply(null, arguments);
        } else {
          for (i = 0, len = sources.length; i < len; i++) {
            source = sources[i];
            if (source != null) {
              for (key in source) {
                if (!hasProp.call(source, key)) continue;
                target[key] = source[key];
              }
            }
          }
        }
        return target;
      };
      isFunction = function(val) {
        return !!val && Object.prototype.toString.call(val) === "[object Function]";
      };
      isObject = function(val) {
        var ref;
        return !!val && ((ref = typeof val) === "function" || ref === "object");
      };
      isArray = function(val) {
        if (isFunction(Array.isArray)) {
          return Array.isArray(val);
        } else {
          return Object.prototype.toString.call(val) === "[object Array]";
        }
      };
      isEmpty = function(val) {
        var key;
        if (isArray(val)) {
          return !val.length;
        } else {
          for (key in val) {
            if (!hasProp.call(val, key)) continue;
            return false;
          }
          return true;
        }
      };
      isPlainObject = function(val) {
        var ctor, proto;
        return isObject(val) && (proto = Object.getPrototypeOf(val)) && (ctor = proto.constructor) && typeof ctor === "function" && ctor instanceof ctor && Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object);
      };
      getValue = function(obj) {
        if (isFunction(obj.valueOf)) {
          return obj.valueOf();
        } else {
          return obj;
        }
      };
      module2.exports.assign = assign;
      module2.exports.isFunction = isFunction;
      module2.exports.isObject = isObject;
      module2.exports.isArray = isArray;
      module2.exports.isEmpty = isEmpty;
      module2.exports.isPlainObject = isPlainObject;
      module2.exports.getValue = getValue;
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDOMImplementation.js
var require_XMLDOMImplementation = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDOMImplementation.js"(exports2, module2) {
    (function() {
      var XMLDOMImplementation;
      module2.exports = XMLDOMImplementation = class XMLDOMImplementation {
        // Tests if the DOM implementation implements a specific feature.
        // `feature` package name of the feature to test. In Level 1, the
        //           legal values are "HTML" and "XML" (case-insensitive).
        // `version` version number of the package name to test. 
        //           In Level 1, this is the string "1.0". If the version is 
        //           not specified, supporting any version of the feature will 
        //           cause the method to return true.
        hasFeature(feature, version) {
          return true;
        }
        // Creates a new document type declaration.
        // `qualifiedName` qualified name of the document type to be created
        // `publicId` public identifier of the external subset
        // `systemId` system identifier of the external subset
        createDocumentType(qualifiedName, publicId, systemId) {
          throw new Error("This DOM method is not implemented.");
        }
        // Creates a new document.
        // `namespaceURI` namespace URI of the document element to create
        // `qualifiedName` the qualified name of the document to be created
        // `doctype` the type of document to be created or null
        createDocument(namespaceURI, qualifiedName, doctype) {
          throw new Error("This DOM method is not implemented.");
        }
        // Creates a new HTML document.
        // `title` document title
        createHTMLDocument(title) {
          throw new Error("This DOM method is not implemented.");
        }
        // Returns a specialized object which implements the specialized APIs 
        // of the specified feature and version.
        // `feature` name of the feature requested.
        // `version` version number of the feature to test
        getFeature(feature, version) {
          throw new Error("This DOM method is not implemented.");
        }
      };
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDOMErrorHandler.js
var require_XMLDOMErrorHandler = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDOMErrorHandler.js"(exports2, module2) {
    (function() {
      var XMLDOMErrorHandler;
      module2.exports = XMLDOMErrorHandler = class XMLDOMErrorHandler {
        // Initializes a new instance of `XMLDOMErrorHandler`
        constructor() {
        }
        // Called on the error handler when an error occurs.
        // `error` the error message as a string
        handleError(error) {
          throw new Error(error);
        }
      };
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDOMStringList.js
var require_XMLDOMStringList = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDOMStringList.js"(exports2, module2) {
    (function() {
      var XMLDOMStringList;
      module2.exports = XMLDOMStringList = (function() {
        class XMLDOMStringList2 {
          // Initializes a new instance of `XMLDOMStringList`
          // This is just a wrapper around an ordinary
          // JS array.
          // `arr` the array of string values
          constructor(arr) {
            this.arr = arr || [];
          }
          // Returns the indexth item in the collection.
          // `index` index into the collection
          item(index) {
            return this.arr[index] || null;
          }
          // Test if a string is part of this DOMStringList.
          // `str` the string to look for
          contains(str) {
            return this.arr.indexOf(str) !== -1;
          }
        }
        ;
        Object.defineProperty(XMLDOMStringList2.prototype, "length", {
          get: function() {
            return this.arr.length;
          }
        });
        return XMLDOMStringList2;
      }).call(this);
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDOMConfiguration.js
var require_XMLDOMConfiguration = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDOMConfiguration.js"(exports2, module2) {
    (function() {
      var XMLDOMConfiguration, XMLDOMErrorHandler, XMLDOMStringList;
      XMLDOMErrorHandler = require_XMLDOMErrorHandler();
      XMLDOMStringList = require_XMLDOMStringList();
      module2.exports = XMLDOMConfiguration = (function() {
        class XMLDOMConfiguration2 {
          constructor() {
            var clonedSelf;
            this.defaultParams = {
              "canonical-form": false,
              "cdata-sections": false,
              "comments": false,
              "datatype-normalization": false,
              "element-content-whitespace": true,
              "entities": true,
              "error-handler": new XMLDOMErrorHandler(),
              "infoset": true,
              "validate-if-schema": false,
              "namespaces": true,
              "namespace-declarations": true,
              "normalize-characters": false,
              "schema-location": "",
              "schema-type": "",
              "split-cdata-sections": true,
              "validate": false,
              "well-formed": true
            };
            this.params = clonedSelf = Object.create(this.defaultParams);
          }
          // Gets the value of a parameter.
          // `name` name of the parameter
          getParameter(name) {
            if (this.params.hasOwnProperty(name)) {
              return this.params[name];
            } else {
              return null;
            }
          }
          // Checks if setting a parameter to a specific value is supported.
          // `name` name of the parameter
          // `value` parameter value
          canSetParameter(name, value) {
            return true;
          }
          // Sets the value of a parameter.
          // `name` name of the parameter
          // `value` new value or null if the user wishes to unset the parameter
          setParameter(name, value) {
            if (value != null) {
              return this.params[name] = value;
            } else {
              return delete this.params[name];
            }
          }
        }
        ;
        Object.defineProperty(XMLDOMConfiguration2.prototype, "parameterNames", {
          get: function() {
            return new XMLDOMStringList(Object.keys(this.defaultParams));
          }
        });
        return XMLDOMConfiguration2;
      }).call(this);
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/NodeType.js
var require_NodeType = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/NodeType.js"(exports2, module2) {
    (function() {
      module2.exports = {
        Element: 1,
        Attribute: 2,
        Text: 3,
        CData: 4,
        EntityReference: 5,
        EntityDeclaration: 6,
        ProcessingInstruction: 7,
        Comment: 8,
        Document: 9,
        DocType: 10,
        DocumentFragment: 11,
        NotationDeclaration: 12,
        // Numeric codes up to 200 are reserved to W3C for possible future use.
        // Following are types internal to this library:
        Declaration: 201,
        Raw: 202,
        AttributeDeclaration: 203,
        ElementDeclaration: 204,
        Dummy: 205
      };
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLAttribute.js
var require_XMLAttribute = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLAttribute.js"(exports2, module2) {
    (function() {
      var NodeType, XMLAttribute, XMLNode;
      NodeType = require_NodeType();
      XMLNode = require_XMLNode();
      module2.exports = XMLAttribute = (function() {
        class XMLAttribute2 {
          // Initializes a new instance of `XMLAttribute`
          // `parent` the parent node
          // `name` attribute target
          // `value` attribute value
          constructor(parent, name, value) {
            this.parent = parent;
            if (this.parent) {
              this.options = this.parent.options;
              this.stringify = this.parent.stringify;
            }
            if (name == null) {
              throw new Error("Missing attribute name. " + this.debugInfo(name));
            }
            this.name = this.stringify.name(name);
            this.value = this.stringify.attValue(value);
            this.type = NodeType.Attribute;
            this.isId = false;
            this.schemaTypeInfo = null;
          }
          // Creates and returns a deep clone of `this`
          clone() {
            return Object.create(this);
          }
          // Converts the XML fragment to string
          // `options.pretty` pretty prints the result
          // `options.indent` indentation for pretty print
          // `options.offset` how many indentations to add to every line for pretty print
          // `options.newline` newline sequence for pretty print
          toString(options) {
            return this.options.writer.attribute(this, this.options.writer.filterOptions(options));
          }
          // Returns debug string for this node
          debugInfo(name) {
            name = name || this.name;
            if (name == null) {
              return "parent: <" + this.parent.name + ">";
            } else {
              return "attribute: {" + name + "}, parent: <" + this.parent.name + ">";
            }
          }
          isEqualNode(node) {
            if (node.namespaceURI !== this.namespaceURI) {
              return false;
            }
            if (node.prefix !== this.prefix) {
              return false;
            }
            if (node.localName !== this.localName) {
              return false;
            }
            if (node.value !== this.value) {
              return false;
            }
            return true;
          }
        }
        ;
        Object.defineProperty(XMLAttribute2.prototype, "nodeType", {
          get: function() {
            return this.type;
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "ownerElement", {
          get: function() {
            return this.parent;
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "textContent", {
          get: function() {
            return this.value;
          },
          set: function(value) {
            return this.value = value || "";
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "namespaceURI", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "prefix", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "localName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "specified", {
          get: function() {
            return true;
          }
        });
        return XMLAttribute2;
      }).call(this);
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLNamedNodeMap.js
var require_XMLNamedNodeMap = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLNamedNodeMap.js"(exports2, module2) {
    (function() {
      var XMLNamedNodeMap;
      module2.exports = XMLNamedNodeMap = (function() {
        class XMLNamedNodeMap2 {
          // Initializes a new instance of `XMLNamedNodeMap`
          // This is just a wrapper around an ordinary
          // JS object.
          // `nodes` the object containing nodes.
          constructor(nodes) {
            this.nodes = nodes;
          }
          // Creates and returns a deep clone of `this`
          clone() {
            return this.nodes = null;
          }
          // DOM Level 1
          getNamedItem(name) {
            return this.nodes[name];
          }
          setNamedItem(node) {
            var oldNode;
            oldNode = this.nodes[node.nodeName];
            this.nodes[node.nodeName] = node;
            return oldNode || null;
          }
          removeNamedItem(name) {
            var oldNode;
            oldNode = this.nodes[name];
            delete this.nodes[name];
            return oldNode || null;
          }
          item(index) {
            return this.nodes[Object.keys(this.nodes)[index]] || null;
          }
          // DOM level 2 functions to be implemented later
          getNamedItemNS(namespaceURI, localName) {
            throw new Error("This DOM method is not implemented.");
          }
          setNamedItemNS(node) {
            throw new Error("This DOM method is not implemented.");
          }
          removeNamedItemNS(namespaceURI, localName) {
            throw new Error("This DOM method is not implemented.");
          }
        }
        ;
        Object.defineProperty(XMLNamedNodeMap2.prototype, "length", {
          get: function() {
            return Object.keys(this.nodes).length || 0;
          }
        });
        return XMLNamedNodeMap2;
      }).call(this);
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLElement.js
var require_XMLElement = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLElement.js"(exports2, module2) {
    (function() {
      var NodeType, XMLAttribute, XMLElement, XMLNamedNodeMap, XMLNode, getValue, isFunction, isObject, hasProp = {}.hasOwnProperty;
      ({ isObject, isFunction, getValue } = require_Utility());
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      XMLAttribute = require_XMLAttribute();
      XMLNamedNodeMap = require_XMLNamedNodeMap();
      module2.exports = XMLElement = (function() {
        class XMLElement2 extends XMLNode {
          // Initializes a new instance of `XMLElement`
          // `parent` the parent node
          // `name` element name
          // `attributes` an object containing name/value pairs of attributes
          constructor(parent, name, attributes) {
            var child, j, len, ref;
            super(parent);
            if (name == null) {
              throw new Error("Missing element name. " + this.debugInfo());
            }
            this.name = this.stringify.name(name);
            this.type = NodeType.Element;
            this.attribs = {};
            this.schemaTypeInfo = null;
            if (attributes != null) {
              this.attribute(attributes);
            }
            if (parent.type === NodeType.Document) {
              this.isRoot = true;
              this.documentObject = parent;
              parent.rootObject = this;
              if (parent.children) {
                ref = parent.children;
                for (j = 0, len = ref.length; j < len; j++) {
                  child = ref[j];
                  if (child.type === NodeType.DocType) {
                    child.name = this.name;
                    break;
                  }
                }
              }
            }
          }
          // Creates and returns a deep clone of `this`
          clone() {
            var att, attName, clonedSelf, ref;
            clonedSelf = Object.create(this);
            if (clonedSelf.isRoot) {
              clonedSelf.documentObject = null;
            }
            clonedSelf.attribs = {};
            ref = this.attribs;
            for (attName in ref) {
              if (!hasProp.call(ref, attName)) continue;
              att = ref[attName];
              clonedSelf.attribs[attName] = att.clone();
            }
            clonedSelf.children = [];
            this.children.forEach(function(child) {
              var clonedChild;
              clonedChild = child.clone();
              clonedChild.parent = clonedSelf;
              return clonedSelf.children.push(clonedChild);
            });
            return clonedSelf;
          }
          // Adds or modifies an attribute
          // `name` attribute name
          // `value` attribute value
          attribute(name, value) {
            var attName, attValue;
            if (name != null) {
              name = getValue(name);
            }
            if (isObject(name)) {
              for (attName in name) {
                if (!hasProp.call(name, attName)) continue;
                attValue = name[attName];
                this.attribute(attName, attValue);
              }
            } else {
              if (isFunction(value)) {
                value = value.apply();
              }
              if (this.options.keepNullAttributes && value == null) {
                this.attribs[name] = new XMLAttribute(this, name, "");
              } else if (value != null) {
                this.attribs[name] = new XMLAttribute(this, name, value);
              }
            }
            return this;
          }
          // Removes an attribute
          // `name` attribute name
          removeAttribute(name) {
            var attName, j, len;
            if (name == null) {
              throw new Error("Missing attribute name. " + this.debugInfo());
            }
            name = getValue(name);
            if (Array.isArray(name)) {
              for (j = 0, len = name.length; j < len; j++) {
                attName = name[j];
                delete this.attribs[attName];
              }
            } else {
              delete this.attribs[name];
            }
            return this;
          }
          // Converts the XML fragment to string
          // `options.pretty` pretty prints the result
          // `options.indent` indentation for pretty print
          // `options.offset` how many indentations to add to every line for pretty print
          // `options.newline` newline sequence for pretty print
          // `options.allowEmpty` do not self close empty element tags
          toString(options) {
            return this.options.writer.element(this, this.options.writer.filterOptions(options));
          }
          // Aliases
          att(name, value) {
            return this.attribute(name, value);
          }
          a(name, value) {
            return this.attribute(name, value);
          }
          // DOM Level 1
          getAttribute(name) {
            if (this.attribs.hasOwnProperty(name)) {
              return this.attribs[name].value;
            } else {
              return null;
            }
          }
          setAttribute(name, value) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          getAttributeNode(name) {
            if (this.attribs.hasOwnProperty(name)) {
              return this.attribs[name];
            } else {
              return null;
            }
          }
          setAttributeNode(newAttr) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          removeAttributeNode(oldAttr) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          getElementsByTagName(name) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          // DOM Level 2
          getAttributeNS(namespaceURI, localName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          setAttributeNS(namespaceURI, qualifiedName, value) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          removeAttributeNS(namespaceURI, localName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          getAttributeNodeNS(namespaceURI, localName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          setAttributeNodeNS(newAttr) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          getElementsByTagNameNS(namespaceURI, localName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          hasAttribute(name) {
            return this.attribs.hasOwnProperty(name);
          }
          hasAttributeNS(namespaceURI, localName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          // DOM Level 3
          setIdAttribute(name, isId) {
            if (this.attribs.hasOwnProperty(name)) {
              return this.attribs[name].isId;
            } else {
              return isId;
            }
          }
          setIdAttributeNS(namespaceURI, localName, isId) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          setIdAttributeNode(idAttr, isId) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          // DOM Level 4
          getElementsByTagName(tagname) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          getElementsByTagNameNS(namespaceURI, localName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          getElementsByClassName(classNames) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          isEqualNode(node) {
            var i, j, ref;
            if (!super.isEqualNode(node)) {
              return false;
            }
            if (node.namespaceURI !== this.namespaceURI) {
              return false;
            }
            if (node.prefix !== this.prefix) {
              return false;
            }
            if (node.localName !== this.localName) {
              return false;
            }
            if (node.attribs.length !== this.attribs.length) {
              return false;
            }
            for (i = j = 0, ref = this.attribs.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
              if (!this.attribs[i].isEqualNode(node.attribs[i])) {
                return false;
              }
            }
            return true;
          }
        }
        ;
        Object.defineProperty(XMLElement2.prototype, "tagName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLElement2.prototype, "namespaceURI", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLElement2.prototype, "prefix", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLElement2.prototype, "localName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLElement2.prototype, "id", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLElement2.prototype, "className", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLElement2.prototype, "classList", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLElement2.prototype, "attributes", {
          get: function() {
            if (!this.attributeMap || !this.attributeMap.nodes) {
              this.attributeMap = new XMLNamedNodeMap(this.attribs);
            }
            return this.attributeMap;
          }
        });
        return XMLElement2;
      }).call(this);
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLCharacterData.js
var require_XMLCharacterData = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLCharacterData.js"(exports2, module2) {
    (function() {
      var XMLCharacterData, XMLNode;
      XMLNode = require_XMLNode();
      module2.exports = XMLCharacterData = (function() {
        class XMLCharacterData2 extends XMLNode {
          // Initializes a new instance of `XMLCharacterData`
          constructor(parent) {
            super(parent);
            this.value = "";
          }
          // Creates and returns a deep clone of `this`
          clone() {
            return Object.create(this);
          }
          // DOM level 1 functions to be implemented later
          substringData(offset, count) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          appendData(arg) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          insertData(offset, arg) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          deleteData(offset, count) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          replaceData(offset, count, arg) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          isEqualNode(node) {
            if (!super.isEqualNode(node)) {
              return false;
            }
            if (node.data !== this.data) {
              return false;
            }
            return true;
          }
        }
        ;
        Object.defineProperty(XMLCharacterData2.prototype, "data", {
          get: function() {
            return this.value;
          },
          set: function(value) {
            return this.value = value || "";
          }
        });
        Object.defineProperty(XMLCharacterData2.prototype, "length", {
          get: function() {
            return this.value.length;
          }
        });
        Object.defineProperty(XMLCharacterData2.prototype, "textContent", {
          get: function() {
            return this.value;
          },
          set: function(value) {
            return this.value = value || "";
          }
        });
        return XMLCharacterData2;
      }).call(this);
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLCData.js
var require_XMLCData = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLCData.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCData, XMLCharacterData;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLCData = class XMLCData extends XMLCharacterData {
        // Initializes a new instance of `XMLCData`
        // `text` CDATA text
        constructor(parent, text) {
          super(parent);
          if (text == null) {
            throw new Error("Missing CDATA text. " + this.debugInfo());
          }
          this.name = "#cdata-section";
          this.type = NodeType.CData;
          this.value = this.stringify.cdata(text);
        }
        // Creates and returns a deep clone of `this`
        clone() {
          return Object.create(this);
        }
        // Converts the XML fragment to string
        // `options.pretty` pretty prints the result
        // `options.indent` indentation for pretty print
        // `options.offset` how many indentations to add to every line for pretty print
        // `options.newline` newline sequence for pretty print
        toString(options) {
          return this.options.writer.cdata(this, this.options.writer.filterOptions(options));
        }
      };
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLComment.js
var require_XMLComment = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLComment.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCharacterData, XMLComment;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLComment = class XMLComment extends XMLCharacterData {
        // Initializes a new instance of `XMLComment`
        // `text` comment text
        constructor(parent, text) {
          super(parent);
          if (text == null) {
            throw new Error("Missing comment text. " + this.debugInfo());
          }
          this.name = "#comment";
          this.type = NodeType.Comment;
          this.value = this.stringify.comment(text);
        }
        // Creates and returns a deep clone of `this`
        clone() {
          return Object.create(this);
        }
        // Converts the XML fragment to string
        // `options.pretty` pretty prints the result
        // `options.indent` indentation for pretty print
        // `options.offset` how many indentations to add to every line for pretty print
        // `options.newline` newline sequence for pretty print
        toString(options) {
          return this.options.writer.comment(this, this.options.writer.filterOptions(options));
        }
      };
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDeclaration.js
var require_XMLDeclaration = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDeclaration.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDeclaration, XMLNode, isObject;
      ({ isObject } = require_Utility());
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDeclaration = class XMLDeclaration extends XMLNode {
        // Initializes a new instance of `XMLDeclaration`
        // `parent` the document object
        // `version` A version number string, e.g. 1.0
        // `encoding` Encoding declaration, e.g. UTF-8
        // `standalone` standalone document declaration: true or false
        constructor(parent, version, encoding, standalone) {
          super(parent);
          if (isObject(version)) {
            ({ version, encoding, standalone } = version);
          }
          if (!version) {
            version = "1.0";
          }
          this.type = NodeType.Declaration;
          this.version = this.stringify.xmlVersion(version);
          if (encoding != null) {
            this.encoding = this.stringify.xmlEncoding(encoding);
          }
          if (standalone != null) {
            this.standalone = this.stringify.xmlStandalone(standalone);
          }
        }
        // Converts to string
        // `options.pretty` pretty prints the result
        // `options.indent` indentation for pretty print
        // `options.offset` how many indentations to add to every line for pretty print
        // `options.newline` newline sequence for pretty print
        toString(options) {
          return this.options.writer.declaration(this, this.options.writer.filterOptions(options));
        }
      };
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDTDAttList.js
var require_XMLDTDAttList = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDTDAttList.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDAttList, XMLNode;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDAttList = class XMLDTDAttList extends XMLNode {
        // Initializes a new instance of `XMLDTDAttList`
        // `parent` the parent `XMLDocType` element
        // `elementName` the name of the element containing this attribute
        // `attributeName` attribute name
        // `attributeType` type of the attribute
        // `defaultValueType` default value type (either #REQUIRED, #IMPLIED,
        //                    #FIXED or #DEFAULT)
        // `defaultValue` default value of the attribute
        //                (only used for #FIXED or #DEFAULT)
        constructor(parent, elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          super(parent);
          if (elementName == null) {
            throw new Error("Missing DTD element name. " + this.debugInfo());
          }
          if (attributeName == null) {
            throw new Error("Missing DTD attribute name. " + this.debugInfo(elementName));
          }
          if (!attributeType) {
            throw new Error("Missing DTD attribute type. " + this.debugInfo(elementName));
          }
          if (!defaultValueType) {
            throw new Error("Missing DTD attribute default. " + this.debugInfo(elementName));
          }
          if (defaultValueType.indexOf("#") !== 0) {
            defaultValueType = "#" + defaultValueType;
          }
          if (!defaultValueType.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) {
            throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT. " + this.debugInfo(elementName));
          }
          if (defaultValue && !defaultValueType.match(/^(#FIXED|#DEFAULT)$/)) {
            throw new Error("Default value only applies to #FIXED or #DEFAULT. " + this.debugInfo(elementName));
          }
          this.elementName = this.stringify.name(elementName);
          this.type = NodeType.AttributeDeclaration;
          this.attributeName = this.stringify.name(attributeName);
          this.attributeType = this.stringify.dtdAttType(attributeType);
          if (defaultValue) {
            this.defaultValue = this.stringify.dtdAttDefault(defaultValue);
          }
          this.defaultValueType = defaultValueType;
        }
        // Converts the XML fragment to string
        // `options.pretty` pretty prints the result
        // `options.indent` indentation for pretty print
        // `options.offset` how many indentations to add to every line for pretty print
        // `options.newline` newline sequence for pretty print
        toString(options) {
          return this.options.writer.dtdAttList(this, this.options.writer.filterOptions(options));
        }
      };
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDTDEntity.js
var require_XMLDTDEntity = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDTDEntity.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDEntity, XMLNode, isObject;
      ({ isObject } = require_Utility());
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDEntity = (function() {
        class XMLDTDEntity2 extends XMLNode {
          // Initializes a new instance of `XMLDTDEntity`
          // `parent` the parent `XMLDocType` element
          // `pe` whether this is a parameter entity or a general entity
          //      defaults to `false` (general entity)
          // `name` the name of the entity
          // `value` internal entity value or an object with external entity details
          // `value.pubID` public identifier
          // `value.sysID` system identifier
          // `value.nData` notation declaration
          constructor(parent, pe, name, value) {
            super(parent);
            if (name == null) {
              throw new Error("Missing DTD entity name. " + this.debugInfo(name));
            }
            if (value == null) {
              throw new Error("Missing DTD entity value. " + this.debugInfo(name));
            }
            this.pe = !!pe;
            this.name = this.stringify.name(name);
            this.type = NodeType.EntityDeclaration;
            if (!isObject(value)) {
              this.value = this.stringify.dtdEntityValue(value);
              this.internal = true;
            } else {
              if (!value.pubID && !value.sysID) {
                throw new Error("Public and/or system identifiers are required for an external entity. " + this.debugInfo(name));
              }
              if (value.pubID && !value.sysID) {
                throw new Error("System identifier is required for a public external entity. " + this.debugInfo(name));
              }
              this.internal = false;
              if (value.pubID != null) {
                this.pubID = this.stringify.dtdPubID(value.pubID);
              }
              if (value.sysID != null) {
                this.sysID = this.stringify.dtdSysID(value.sysID);
              }
              if (value.nData != null) {
                this.nData = this.stringify.dtdNData(value.nData);
              }
              if (this.pe && this.nData) {
                throw new Error("Notation declaration is not allowed in a parameter entity. " + this.debugInfo(name));
              }
            }
          }
          // Converts the XML fragment to string
          // `options.pretty` pretty prints the result
          // `options.indent` indentation for pretty print
          // `options.offset` how many indentations to add to every line for pretty print
          // `options.newline` newline sequence for pretty print
          toString(options) {
            return this.options.writer.dtdEntity(this, this.options.writer.filterOptions(options));
          }
        }
        ;
        Object.defineProperty(XMLDTDEntity2.prototype, "publicId", {
          get: function() {
            return this.pubID;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "systemId", {
          get: function() {
            return this.sysID;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "notationName", {
          get: function() {
            return this.nData || null;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "inputEncoding", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "xmlEncoding", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "xmlVersion", {
          get: function() {
            return null;
          }
        });
        return XMLDTDEntity2;
      }).call(this);
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDTDElement.js
var require_XMLDTDElement = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDTDElement.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDElement, XMLNode;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDElement = class XMLDTDElement extends XMLNode {
        // Initializes a new instance of `XMLDTDElement`
        // `parent` the parent `XMLDocType` element
        // `name` element name
        // `value` element content (defaults to #PCDATA)
        constructor(parent, name, value) {
          super(parent);
          if (name == null) {
            throw new Error("Missing DTD element name. " + this.debugInfo());
          }
          if (!value) {
            value = "(#PCDATA)";
          }
          if (Array.isArray(value)) {
            value = "(" + value.join(",") + ")";
          }
          this.name = this.stringify.name(name);
          this.type = NodeType.ElementDeclaration;
          this.value = this.stringify.dtdElementValue(value);
        }
        // Converts the XML fragment to string
        // `options.pretty` pretty prints the result
        // `options.indent` indentation for pretty print
        // `options.offset` how many indentations to add to every line for pretty print
        // `options.newline` newline sequence for pretty print
        toString(options) {
          return this.options.writer.dtdElement(this, this.options.writer.filterOptions(options));
        }
      };
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDTDNotation.js
var require_XMLDTDNotation = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDTDNotation.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDNotation, XMLNode;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDNotation = (function() {
        class XMLDTDNotation2 extends XMLNode {
          // Initializes a new instance of `XMLDTDNotation`
          // `parent` the parent `XMLDocType` element
          // `name` the name of the notation
          // `value` an object with external entity details
          // `value.pubID` public identifier
          // `value.sysID` system identifier
          constructor(parent, name, value) {
            super(parent);
            if (name == null) {
              throw new Error("Missing DTD notation name. " + this.debugInfo(name));
            }
            if (!value.pubID && !value.sysID) {
              throw new Error("Public or system identifiers are required for an external entity. " + this.debugInfo(name));
            }
            this.name = this.stringify.name(name);
            this.type = NodeType.NotationDeclaration;
            if (value.pubID != null) {
              this.pubID = this.stringify.dtdPubID(value.pubID);
            }
            if (value.sysID != null) {
              this.sysID = this.stringify.dtdSysID(value.sysID);
            }
          }
          // Converts the XML fragment to string
          // `options.pretty` pretty prints the result
          // `options.indent` indentation for pretty print
          // `options.offset` how many indentations to add to every line for pretty print
          // `options.newline` newline sequence for pretty print
          toString(options) {
            return this.options.writer.dtdNotation(this, this.options.writer.filterOptions(options));
          }
        }
        ;
        Object.defineProperty(XMLDTDNotation2.prototype, "publicId", {
          get: function() {
            return this.pubID;
          }
        });
        Object.defineProperty(XMLDTDNotation2.prototype, "systemId", {
          get: function() {
            return this.sysID;
          }
        });
        return XMLDTDNotation2;
      }).call(this);
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDocType.js
var require_XMLDocType = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDocType.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDocType, XMLNamedNodeMap, XMLNode, isObject;
      ({ isObject } = require_Utility());
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      XMLDTDAttList = require_XMLDTDAttList();
      XMLDTDEntity = require_XMLDTDEntity();
      XMLDTDElement = require_XMLDTDElement();
      XMLDTDNotation = require_XMLDTDNotation();
      XMLNamedNodeMap = require_XMLNamedNodeMap();
      module2.exports = XMLDocType = (function() {
        class XMLDocType2 extends XMLNode {
          // Initializes a new instance of `XMLDocType`
          // `parent` the document object
          // `pubID` public identifier of the external subset
          // `sysID` system identifier of the external subset
          constructor(parent, pubID, sysID) {
            var child, i, len, ref;
            super(parent);
            this.type = NodeType.DocType;
            if (parent.children) {
              ref = parent.children;
              for (i = 0, len = ref.length; i < len; i++) {
                child = ref[i];
                if (child.type === NodeType.Element) {
                  this.name = child.name;
                  break;
                }
              }
            }
            this.documentObject = parent;
            if (isObject(pubID)) {
              ({ pubID, sysID } = pubID);
            }
            if (sysID == null) {
              [sysID, pubID] = [pubID, sysID];
            }
            if (pubID != null) {
              this.pubID = this.stringify.dtdPubID(pubID);
            }
            if (sysID != null) {
              this.sysID = this.stringify.dtdSysID(sysID);
            }
          }
          // Creates an element type declaration
          // `name` element name
          // `value` element content (defaults to #PCDATA)
          element(name, value) {
            var child;
            child = new XMLDTDElement(this, name, value);
            this.children.push(child);
            return this;
          }
          // Creates an attribute declaration
          // `elementName` the name of the element containing this attribute
          // `attributeName` attribute name
          // `attributeType` type of the attribute (defaults to CDATA)
          // `defaultValueType` default value type (either #REQUIRED, #IMPLIED, #FIXED or
          //                    #DEFAULT) (defaults to #IMPLIED)
          // `defaultValue` default value of the attribute
          //                (only used for #FIXED or #DEFAULT)
          attList(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
            var child;
            child = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
            this.children.push(child);
            return this;
          }
          // Creates a general entity declaration
          // `name` the name of the entity
          // `value` internal entity value or an object with external entity details
          // `value.pubID` public identifier
          // `value.sysID` system identifier
          // `value.nData` notation declaration
          entity(name, value) {
            var child;
            child = new XMLDTDEntity(this, false, name, value);
            this.children.push(child);
            return this;
          }
          // Creates a parameter entity declaration
          // `name` the name of the entity
          // `value` internal entity value or an object with external entity details
          // `value.pubID` public identifier
          // `value.sysID` system identifier
          pEntity(name, value) {
            var child;
            child = new XMLDTDEntity(this, true, name, value);
            this.children.push(child);
            return this;
          }
          // Creates a NOTATION declaration
          // `name` the name of the notation
          // `value` an object with external entity details
          // `value.pubID` public identifier
          // `value.sysID` system identifier
          notation(name, value) {
            var child;
            child = new XMLDTDNotation(this, name, value);
            this.children.push(child);
            return this;
          }
          // Converts to string
          // `options.pretty` pretty prints the result
          // `options.indent` indentation for pretty print
          // `options.offset` how many indentations to add to every line for pretty print
          // `options.newline` newline sequence for pretty print
          toString(options) {
            return this.options.writer.docType(this, this.options.writer.filterOptions(options));
          }
          // Aliases
          ele(name, value) {
            return this.element(name, value);
          }
          att(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
            return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
          }
          ent(name, value) {
            return this.entity(name, value);
          }
          pent(name, value) {
            return this.pEntity(name, value);
          }
          not(name, value) {
            return this.notation(name, value);
          }
          up() {
            return this.root() || this.documentObject;
          }
          isEqualNode(node) {
            if (!super.isEqualNode(node)) {
              return false;
            }
            if (node.name !== this.name) {
              return false;
            }
            if (node.publicId !== this.publicId) {
              return false;
            }
            if (node.systemId !== this.systemId) {
              return false;
            }
            return true;
          }
        }
        ;
        Object.defineProperty(XMLDocType2.prototype, "entities", {
          get: function() {
            var child, i, len, nodes, ref;
            nodes = {};
            ref = this.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              if (child.type === NodeType.EntityDeclaration && !child.pe) {
                nodes[child.name] = child;
              }
            }
            return new XMLNamedNodeMap(nodes);
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "notations", {
          get: function() {
            var child, i, len, nodes, ref;
            nodes = {};
            ref = this.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              if (child.type === NodeType.NotationDeclaration) {
                nodes[child.name] = child;
              }
            }
            return new XMLNamedNodeMap(nodes);
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "publicId", {
          get: function() {
            return this.pubID;
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "systemId", {
          get: function() {
            return this.sysID;
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "internalSubset", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        return XMLDocType2;
      }).call(this);
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLRaw.js
var require_XMLRaw = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLRaw.js"(exports2, module2) {
    (function() {
      var NodeType, XMLNode, XMLRaw;
      NodeType = require_NodeType();
      XMLNode = require_XMLNode();
      module2.exports = XMLRaw = class XMLRaw extends XMLNode {
        // Initializes a new instance of `XMLRaw`
        // `text` raw text
        constructor(parent, text) {
          super(parent);
          if (text == null) {
            throw new Error("Missing raw text. " + this.debugInfo());
          }
          this.type = NodeType.Raw;
          this.value = this.stringify.raw(text);
        }
        // Creates and returns a deep clone of `this`
        clone() {
          return Object.create(this);
        }
        // Converts the XML fragment to string
        // `options.pretty` pretty prints the result
        // `options.indent` indentation for pretty print
        // `options.offset` how many indentations to add to every line for pretty print
        // `options.newline` newline sequence for pretty print
        toString(options) {
          return this.options.writer.raw(this, this.options.writer.filterOptions(options));
        }
      };
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLText.js
var require_XMLText = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLText.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCharacterData, XMLText;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLText = (function() {
        class XMLText2 extends XMLCharacterData {
          // Initializes a new instance of `XMLText`
          // `text` element text
          constructor(parent, text) {
            super(parent);
            if (text == null) {
              throw new Error("Missing element text. " + this.debugInfo());
            }
            this.name = "#text";
            this.type = NodeType.Text;
            this.value = this.stringify.text(text);
          }
          // Creates and returns a deep clone of `this`
          clone() {
            return Object.create(this);
          }
          // Converts the XML fragment to string
          // `options.pretty` pretty prints the result
          // `options.indent` indentation for pretty print
          // `options.offset` how many indentations to add to every line for pretty print
          // `options.newline` newline sequence for pretty print
          toString(options) {
            return this.options.writer.text(this, this.options.writer.filterOptions(options));
          }
          // DOM level 1 functions to be implemented later
          splitText(offset) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          // DOM level 3 functions to be implemented later
          replaceWholeText(content) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        }
        ;
        Object.defineProperty(XMLText2.prototype, "isElementContentWhitespace", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLText2.prototype, "wholeText", {
          get: function() {
            var next, prev, str;
            str = "";
            prev = this.previousSibling;
            while (prev) {
              str = prev.data + str;
              prev = prev.previousSibling;
            }
            str += this.data;
            next = this.nextSibling;
            while (next) {
              str = str + next.data;
              next = next.nextSibling;
            }
            return str;
          }
        });
        return XMLText2;
      }).call(this);
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLProcessingInstruction.js
var require_XMLProcessingInstruction = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLProcessingInstruction.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCharacterData, XMLProcessingInstruction;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLProcessingInstruction = class XMLProcessingInstruction extends XMLCharacterData {
        // Initializes a new instance of `XMLProcessingInstruction`
        // `parent` the parent node
        // `target` instruction target
        // `value` instruction value
        constructor(parent, target, value) {
          super(parent);
          if (target == null) {
            throw new Error("Missing instruction target. " + this.debugInfo());
          }
          this.type = NodeType.ProcessingInstruction;
          this.target = this.stringify.insTarget(target);
          this.name = this.target;
          if (value) {
            this.value = this.stringify.insValue(value);
          }
        }
        // Creates and returns a deep clone of `this`
        clone() {
          return Object.create(this);
        }
        // Converts the XML fragment to string
        // `options.pretty` pretty prints the result
        // `options.indent` indentation for pretty print
        // `options.offset` how many indentations to add to every line for pretty print
        // `options.newline` newline sequence for pretty print
        toString(options) {
          return this.options.writer.processingInstruction(this, this.options.writer.filterOptions(options));
        }
        isEqualNode(node) {
          if (!super.isEqualNode(node)) {
            return false;
          }
          if (node.target !== this.target) {
            return false;
          }
          return true;
        }
      };
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDummy.js
var require_XMLDummy = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDummy.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDummy, XMLNode;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDummy = class XMLDummy extends XMLNode {
        // Initializes a new instance of `XMLDummy`
        // `XMLDummy` is a special node representing a node with 
        // a null value. Dummy nodes are created while recursively
        // building the XML tree. Simply skipping null values doesn't
        // work because that would break the recursive chain.
        constructor(parent) {
          super(parent);
          this.type = NodeType.Dummy;
        }
        // Creates and returns a deep clone of `this`
        clone() {
          return Object.create(this);
        }
        // Converts the XML fragment to string
        // `options.pretty` pretty prints the result
        // `options.indent` indentation for pretty print
        // `options.offset` how many indentations to add to every line for pretty print
        // `options.newline` newline sequence for pretty print
        toString(options) {
          return "";
        }
      };
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLNodeList.js
var require_XMLNodeList = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLNodeList.js"(exports2, module2) {
    (function() {
      var XMLNodeList;
      module2.exports = XMLNodeList = (function() {
        class XMLNodeList2 {
          // Initializes a new instance of `XMLNodeList`
          // This is just a wrapper around an ordinary
          // JS array.
          // `nodes` the array containing nodes.
          constructor(nodes) {
            this.nodes = nodes;
          }
          // Creates and returns a deep clone of `this`
          clone() {
            return this.nodes = null;
          }
          // DOM Level 1
          item(index) {
            return this.nodes[index] || null;
          }
        }
        ;
        Object.defineProperty(XMLNodeList2.prototype, "length", {
          get: function() {
            return this.nodes.length || 0;
          }
        });
        return XMLNodeList2;
      }).call(this);
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/DocumentPosition.js
var require_DocumentPosition = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/DocumentPosition.js"(exports2, module2) {
    (function() {
      module2.exports = {
        Disconnected: 1,
        Preceding: 2,
        Following: 4,
        Contains: 8,
        ContainedBy: 16,
        ImplementationSpecific: 32
      };
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLNode.js
var require_XMLNode = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLNode.js"(exports2, module2) {
    (function() {
      var DocumentPosition, NodeType, XMLCData, XMLComment, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLNamedNodeMap, XMLNode, XMLNodeList, XMLProcessingInstruction, XMLRaw, XMLText, getValue, isEmpty, isFunction, isObject, hasProp = {}.hasOwnProperty, splice = [].splice;
      ({ isObject, isFunction, isEmpty, getValue } = require_Utility());
      XMLElement = null;
      XMLCData = null;
      XMLComment = null;
      XMLDeclaration = null;
      XMLDocType = null;
      XMLRaw = null;
      XMLText = null;
      XMLProcessingInstruction = null;
      XMLDummy = null;
      NodeType = null;
      XMLNodeList = null;
      XMLNamedNodeMap = null;
      DocumentPosition = null;
      module2.exports = XMLNode = (function() {
        class XMLNode2 {
          // Initializes a new instance of `XMLNode`
          // `parent` the parent node
          constructor(parent1) {
            this.parent = parent1;
            if (this.parent) {
              this.options = this.parent.options;
              this.stringify = this.parent.stringify;
            }
            this.value = null;
            this.children = [];
            this.baseURI = null;
            if (!XMLElement) {
              XMLElement = require_XMLElement();
              XMLCData = require_XMLCData();
              XMLComment = require_XMLComment();
              XMLDeclaration = require_XMLDeclaration();
              XMLDocType = require_XMLDocType();
              XMLRaw = require_XMLRaw();
              XMLText = require_XMLText();
              XMLProcessingInstruction = require_XMLProcessingInstruction();
              XMLDummy = require_XMLDummy();
              NodeType = require_NodeType();
              XMLNodeList = require_XMLNodeList();
              XMLNamedNodeMap = require_XMLNamedNodeMap();
              DocumentPosition = require_DocumentPosition();
            }
          }
          // Sets the parent node of this node and its children recursively
          // `parent` the parent node
          setParent(parent) {
            var child, j, len, ref1, results;
            this.parent = parent;
            if (parent) {
              this.options = parent.options;
              this.stringify = parent.stringify;
            }
            ref1 = this.children;
            results = [];
            for (j = 0, len = ref1.length; j < len; j++) {
              child = ref1[j];
              results.push(child.setParent(this));
            }
            return results;
          }
          // Creates a child element node
          // `name` node name or an object describing the XML tree
          // `attributes` an object containing name/value pairs of attributes
          // `text` element text
          element(name, attributes, text) {
            var childNode, item, j, k, key, lastChild, len, len1, val;
            lastChild = null;
            if (attributes === null && text == null) {
              [attributes, text] = [{}, null];
            }
            if (attributes == null) {
              attributes = {};
            }
            attributes = getValue(attributes);
            if (!isObject(attributes)) {
              [text, attributes] = [attributes, text];
            }
            if (name != null) {
              name = getValue(name);
            }
            if (Array.isArray(name)) {
              for (j = 0, len = name.length; j < len; j++) {
                item = name[j];
                lastChild = this.element(item);
              }
            } else if (isFunction(name)) {
              lastChild = this.element(name.apply());
            } else if (isObject(name)) {
              for (key in name) {
                if (!hasProp.call(name, key)) continue;
                val = name[key];
                if (isFunction(val)) {
                  val = val.apply();
                }
                if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) {
                  lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
                } else if (!this.options.separateArrayItems && Array.isArray(val) && isEmpty(val)) {
                  lastChild = this.dummy();
                } else if (isObject(val) && isEmpty(val)) {
                  lastChild = this.element(key);
                } else if (!this.options.keepNullNodes && val == null) {
                  lastChild = this.dummy();
                } else if (!this.options.separateArrayItems && Array.isArray(val)) {
                  for (k = 0, len1 = val.length; k < len1; k++) {
                    item = val[k];
                    childNode = {};
                    childNode[key] = item;
                    lastChild = this.element(childNode);
                  }
                } else if (isObject(val)) {
                  if (!this.options.ignoreDecorators && this.stringify.convertTextKey && key.indexOf(this.stringify.convertTextKey) === 0) {
                    lastChild = this.element(val);
                  } else {
                    lastChild = this.element(key);
                    lastChild.element(val);
                  }
                } else {
                  lastChild = this.element(key, val);
                }
              }
            } else if (!this.options.keepNullNodes && text === null) {
              lastChild = this.dummy();
            } else {
              if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) {
                lastChild = this.text(text);
              } else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) {
                lastChild = this.cdata(text);
              } else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) {
                lastChild = this.comment(text);
              } else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) {
                lastChild = this.raw(text);
              } else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && name.indexOf(this.stringify.convertPIKey) === 0) {
                lastChild = this.instruction(name.substr(this.stringify.convertPIKey.length), text);
              } else {
                lastChild = this.node(name, attributes, text);
              }
            }
            if (lastChild == null) {
              throw new Error("Could not create any elements with: " + name + ". " + this.debugInfo());
            }
            return lastChild;
          }
          // Creates a child element node before the current node
          // `name` node name or an object describing the XML tree
          // `attributes` an object containing name/value pairs of attributes
          // `text` element text
          insertBefore(name, attributes, text) {
            var child, i, newChild, refChild, removed;
            if (name != null ? name.type : void 0) {
              newChild = name;
              refChild = attributes;
              newChild.setParent(this);
              if (refChild) {
                i = children.indexOf(refChild);
                removed = children.splice(i);
                children.push(newChild);
                Array.prototype.push.apply(children, removed);
              } else {
                children.push(newChild);
              }
              return newChild;
            } else {
              if (this.isRoot) {
                throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
              }
              i = this.parent.children.indexOf(this);
              removed = this.parent.children.splice(i);
              child = this.parent.element(name, attributes, text);
              Array.prototype.push.apply(this.parent.children, removed);
              return child;
            }
          }
          // Creates a child element node after the current node
          // `name` node name or an object describing the XML tree
          // `attributes` an object containing name/value pairs of attributes
          // `text` element text
          insertAfter(name, attributes, text) {
            var child, i, removed;
            if (this.isRoot) {
              throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
            }
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i + 1);
            child = this.parent.element(name, attributes, text);
            Array.prototype.push.apply(this.parent.children, removed);
            return child;
          }
          // Deletes a child element node
          remove() {
            var i, ref1;
            if (this.isRoot) {
              throw new Error("Cannot remove the root element. " + this.debugInfo());
            }
            i = this.parent.children.indexOf(this);
            splice.apply(this.parent.children, [i, i - i + 1].concat(ref1 = [])), ref1;
            return this.parent;
          }
          // Creates a node
          // `name` name of the node
          // `attributes` an object containing name/value pairs of attributes
          // `text` element text
          node(name, attributes, text) {
            var child;
            if (name != null) {
              name = getValue(name);
            }
            attributes || (attributes = {});
            attributes = getValue(attributes);
            if (!isObject(attributes)) {
              [text, attributes] = [attributes, text];
            }
            child = new XMLElement(this, name, attributes);
            if (text != null) {
              child.text(text);
            }
            this.children.push(child);
            return child;
          }
          // Creates a text node
          // `value` element text
          text(value) {
            var child;
            if (isObject(value)) {
              this.element(value);
            }
            child = new XMLText(this, value);
            this.children.push(child);
            return this;
          }
          // Creates a CDATA node
          // `value` element text without CDATA delimiters
          cdata(value) {
            var child;
            child = new XMLCData(this, value);
            this.children.push(child);
            return this;
          }
          // Creates a comment node
          // `value` comment text
          comment(value) {
            var child;
            child = new XMLComment(this, value);
            this.children.push(child);
            return this;
          }
          // Creates a comment node before the current node
          // `value` comment text
          commentBefore(value) {
            var child, i, removed;
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i);
            child = this.parent.comment(value);
            Array.prototype.push.apply(this.parent.children, removed);
            return this;
          }
          // Creates a comment node after the current node
          // `value` comment text
          commentAfter(value) {
            var child, i, removed;
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i + 1);
            child = this.parent.comment(value);
            Array.prototype.push.apply(this.parent.children, removed);
            return this;
          }
          // Adds unescaped raw text
          // `value` text
          raw(value) {
            var child;
            child = new XMLRaw(this, value);
            this.children.push(child);
            return this;
          }
          // Adds a dummy node
          dummy() {
            var child;
            child = new XMLDummy(this);
            return child;
          }
          // Adds a processing instruction
          // `target` instruction target
          // `value` instruction value
          instruction(target, value) {
            var insTarget, insValue, instruction, j, len;
            if (target != null) {
              target = getValue(target);
            }
            if (value != null) {
              value = getValue(value);
            }
            if (Array.isArray(target)) {
              for (j = 0, len = target.length; j < len; j++) {
                insTarget = target[j];
                this.instruction(insTarget);
              }
            } else if (isObject(target)) {
              for (insTarget in target) {
                if (!hasProp.call(target, insTarget)) continue;
                insValue = target[insTarget];
                this.instruction(insTarget, insValue);
              }
            } else {
              if (isFunction(value)) {
                value = value.apply();
              }
              instruction = new XMLProcessingInstruction(this, target, value);
              this.children.push(instruction);
            }
            return this;
          }
          // Creates a processing instruction node before the current node
          // `target` instruction target
          // `value` instruction value
          instructionBefore(target, value) {
            var child, i, removed;
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i);
            child = this.parent.instruction(target, value);
            Array.prototype.push.apply(this.parent.children, removed);
            return this;
          }
          // Creates a processing instruction node after the current node
          // `target` instruction target
          // `value` instruction value
          instructionAfter(target, value) {
            var child, i, removed;
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i + 1);
            child = this.parent.instruction(target, value);
            Array.prototype.push.apply(this.parent.children, removed);
            return this;
          }
          // Creates the xml declaration
          // `version` A version number string, e.g. 1.0
          // `encoding` Encoding declaration, e.g. UTF-8
          // `standalone` standalone document declaration: true or false
          declaration(version, encoding, standalone) {
            var doc, xmldec;
            doc = this.document();
            xmldec = new XMLDeclaration(doc, version, encoding, standalone);
            if (doc.children.length === 0) {
              doc.children.unshift(xmldec);
            } else if (doc.children[0].type === NodeType.Declaration) {
              doc.children[0] = xmldec;
            } else {
              doc.children.unshift(xmldec);
            }
            return doc.root() || doc;
          }
          // Creates the document type declaration
          // `pubID` the public identifier of the external subset
          // `sysID` the system identifier of the external subset
          dtd(pubID, sysID) {
            var child, doc, doctype, i, j, k, len, len1, ref1, ref2;
            doc = this.document();
            doctype = new XMLDocType(doc, pubID, sysID);
            ref1 = doc.children;
            for (i = j = 0, len = ref1.length; j < len; i = ++j) {
              child = ref1[i];
              if (child.type === NodeType.DocType) {
                doc.children[i] = doctype;
                return doctype;
              }
            }
            ref2 = doc.children;
            for (i = k = 0, len1 = ref2.length; k < len1; i = ++k) {
              child = ref2[i];
              if (child.isRoot) {
                doc.children.splice(i, 0, doctype);
                return doctype;
              }
            }
            doc.children.push(doctype);
            return doctype;
          }
          // Gets the parent node
          up() {
            if (this.isRoot) {
              throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
            }
            return this.parent;
          }
          // Gets the root node
          root() {
            var node;
            node = this;
            while (node) {
              if (node.type === NodeType.Document) {
                return node.rootObject;
              } else if (node.isRoot) {
                return node;
              } else {
                node = node.parent;
              }
            }
          }
          // Gets the node representing the XML document
          document() {
            var node;
            node = this;
            while (node) {
              if (node.type === NodeType.Document) {
                return node;
              } else {
                node = node.parent;
              }
            }
          }
          // Ends the document and converts string
          end(options) {
            return this.document().end(options);
          }
          // Gets the previous node
          prev() {
            var i;
            i = this.parent.children.indexOf(this);
            if (i < 1) {
              throw new Error("Already at the first node. " + this.debugInfo());
            }
            return this.parent.children[i - 1];
          }
          // Gets the next node
          next() {
            var i;
            i = this.parent.children.indexOf(this);
            if (i === -1 || i === this.parent.children.length - 1) {
              throw new Error("Already at the last node. " + this.debugInfo());
            }
            return this.parent.children[i + 1];
          }
          // Imports cloned root from another XML document
          // `doc` the XML document to insert nodes from
          importDocument(doc) {
            var child, clonedRoot, j, len, ref1;
            clonedRoot = doc.root().clone();
            clonedRoot.parent = this;
            clonedRoot.isRoot = false;
            this.children.push(clonedRoot);
            if (this.type === NodeType.Document) {
              clonedRoot.isRoot = true;
              clonedRoot.documentObject = this;
              this.rootObject = clonedRoot;
              if (this.children) {
                ref1 = this.children;
                for (j = 0, len = ref1.length; j < len; j++) {
                  child = ref1[j];
                  if (child.type === NodeType.DocType) {
                    child.name = clonedRoot.name;
                    break;
                  }
                }
              }
            }
            return this;
          }
          // Returns debug string for this node
          debugInfo(name) {
            var ref1, ref2;
            name = name || this.name;
            if (name == null && !((ref1 = this.parent) != null ? ref1.name : void 0)) {
              return "";
            } else if (name == null) {
              return "parent: <" + this.parent.name + ">";
            } else if (!((ref2 = this.parent) != null ? ref2.name : void 0)) {
              return "node: <" + name + ">";
            } else {
              return "node: <" + name + ">, parent: <" + this.parent.name + ">";
            }
          }
          // Aliases
          ele(name, attributes, text) {
            return this.element(name, attributes, text);
          }
          nod(name, attributes, text) {
            return this.node(name, attributes, text);
          }
          txt(value) {
            return this.text(value);
          }
          dat(value) {
            return this.cdata(value);
          }
          com(value) {
            return this.comment(value);
          }
          ins(target, value) {
            return this.instruction(target, value);
          }
          doc() {
            return this.document();
          }
          dec(version, encoding, standalone) {
            return this.declaration(version, encoding, standalone);
          }
          e(name, attributes, text) {
            return this.element(name, attributes, text);
          }
          n(name, attributes, text) {
            return this.node(name, attributes, text);
          }
          t(value) {
            return this.text(value);
          }
          d(value) {
            return this.cdata(value);
          }
          c(value) {
            return this.comment(value);
          }
          r(value) {
            return this.raw(value);
          }
          i(target, value) {
            return this.instruction(target, value);
          }
          u() {
            return this.up();
          }
          // can be deprecated in a future release
          importXMLBuilder(doc) {
            return this.importDocument(doc);
          }
          // Adds or modifies an attribute.
          // `name` attribute name
          // `value` attribute value
          attribute(name, value) {
            throw new Error("attribute() applies to element nodes only.");
          }
          att(name, value) {
            return this.attribute(name, value);
          }
          a(name, value) {
            return this.attribute(name, value);
          }
          // Removes an attribute
          // `name` attribute name
          removeAttribute(name) {
            throw new Error("attribute() applies to element nodes only.");
          }
          // DOM level 1 functions to be implemented later
          replaceChild(newChild, oldChild) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          removeChild(oldChild) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          appendChild(newChild) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          hasChildNodes() {
            return this.children.length !== 0;
          }
          cloneNode(deep) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          normalize() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          // DOM level 2
          isSupported(feature, version) {
            return true;
          }
          hasAttributes() {
            return this.attribs.length !== 0;
          }
          // DOM level 3 functions to be implemented later
          compareDocumentPosition(other) {
            var ref, res;
            ref = this;
            if (ref === other) {
              return 0;
            } else if (this.document() !== other.document()) {
              res = DocumentPosition.Disconnected | DocumentPosition.ImplementationSpecific;
              if (Math.random() < 0.5) {
                res |= DocumentPosition.Preceding;
              } else {
                res |= DocumentPosition.Following;
              }
              return res;
            } else if (ref.isAncestor(other)) {
              return DocumentPosition.Contains | DocumentPosition.Preceding;
            } else if (ref.isDescendant(other)) {
              return DocumentPosition.Contains | DocumentPosition.Following;
            } else if (ref.isPreceding(other)) {
              return DocumentPosition.Preceding;
            } else {
              return DocumentPosition.Following;
            }
          }
          isSameNode(other) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          lookupPrefix(namespaceURI) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          isDefaultNamespace(namespaceURI) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          lookupNamespaceURI(prefix) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          isEqualNode(node) {
            var i, j, ref1;
            if (node.nodeType !== this.nodeType) {
              return false;
            }
            if (node.children.length !== this.children.length) {
              return false;
            }
            for (i = j = 0, ref1 = this.children.length - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
              if (!this.children[i].isEqualNode(node.children[i])) {
                return false;
              }
            }
            return true;
          }
          getFeature(feature, version) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          setUserData(key, data, handler) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          getUserData(key) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          // Returns true if other is an inclusive descendant of node,
          // and false otherwise.
          contains(other) {
            if (!other) {
              return false;
            }
            return other === this || this.isDescendant(other);
          }
          // An object A is called a descendant of an object B, if either A is 
          // a child of B or A is a child of an object C that is a descendant of B.
          isDescendant(node) {
            var child, isDescendantChild, j, len, ref1;
            ref1 = this.children;
            for (j = 0, len = ref1.length; j < len; j++) {
              child = ref1[j];
              if (node === child) {
                return true;
              }
              isDescendantChild = child.isDescendant(node);
              if (isDescendantChild) {
                return true;
              }
            }
            return false;
          }
          // An object A is called an ancestor of an object B if and only if
          // B is a descendant of A.
          isAncestor(node) {
            return node.isDescendant(this);
          }
          // An object A is preceding an object B if A and B are in the 
          // same tree and A comes before B in tree order.
          isPreceding(node) {
            var nodePos, thisPos;
            nodePos = this.treePosition(node);
            thisPos = this.treePosition(this);
            if (nodePos === -1 || thisPos === -1) {
              return false;
            } else {
              return nodePos < thisPos;
            }
          }
          // An object A is folllowing an object B if A and B are in the 
          // same tree and A comes after B in tree order.
          isFollowing(node) {
            var nodePos, thisPos;
            nodePos = this.treePosition(node);
            thisPos = this.treePosition(this);
            if (nodePos === -1 || thisPos === -1) {
              return false;
            } else {
              return nodePos > thisPos;
            }
          }
          // Returns the preorder position of the given node in the tree, or -1
          // if the node is not in the tree.
          treePosition(node) {
            var found, pos;
            pos = 0;
            found = false;
            this.foreachTreeNode(this.document(), function(childNode) {
              pos++;
              if (!found && childNode === node) {
                return found = true;
              }
            });
            if (found) {
              return pos;
            } else {
              return -1;
            }
          }
          // Depth-first preorder traversal through the XML tree
          foreachTreeNode(node, func) {
            var child, j, len, ref1, res;
            node || (node = this.document());
            ref1 = node.children;
            for (j = 0, len = ref1.length; j < len; j++) {
              child = ref1[j];
              if (res = func(child)) {
                return res;
              } else {
                res = this.foreachTreeNode(child, func);
                if (res) {
                  return res;
                }
              }
            }
          }
        }
        ;
        Object.defineProperty(XMLNode2.prototype, "nodeName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "nodeType", {
          get: function() {
            return this.type;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "nodeValue", {
          get: function() {
            return this.value;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "parentNode", {
          get: function() {
            return this.parent;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "childNodes", {
          get: function() {
            if (!this.childNodeList || !this.childNodeList.nodes) {
              this.childNodeList = new XMLNodeList(this.children);
            }
            return this.childNodeList;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "firstChild", {
          get: function() {
            return this.children[0] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "lastChild", {
          get: function() {
            return this.children[this.children.length - 1] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "previousSibling", {
          get: function() {
            var i;
            i = this.parent.children.indexOf(this);
            return this.parent.children[i - 1] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "nextSibling", {
          get: function() {
            var i;
            i = this.parent.children.indexOf(this);
            return this.parent.children[i + 1] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "ownerDocument", {
          get: function() {
            return this.document() || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "textContent", {
          get: function() {
            var child, j, len, ref1, str;
            if (this.nodeType === NodeType.Element || this.nodeType === NodeType.DocumentFragment) {
              str = "";
              ref1 = this.children;
              for (j = 0, len = ref1.length; j < len; j++) {
                child = ref1[j];
                if (child.textContent) {
                  str += child.textContent;
                }
              }
              return str;
            } else {
              return null;
            }
          },
          set: function(value) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        return XMLNode2;
      }).call(this);
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLStringifier.js
var require_XMLStringifier = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLStringifier.js"(exports2, module2) {
    (function() {
      var XMLStringifier, hasProp = {}.hasOwnProperty;
      module2.exports = XMLStringifier = (function() {
        class XMLStringifier2 {
          // Initializes a new instance of `XMLStringifier`
          // `options.version` The version number string of the XML spec to validate against, e.g. 1.0
          // `options.noDoubleEncoding` whether existing html entities are encoded: true or false
          // `options.stringify` a set of functions to use for converting values to strings
          // `options.noValidation` whether values will be validated and escaped or returned as is
          // `options.invalidCharReplacement` a character to replace invalid characters and disable character validation
          constructor(options) {
            var key, ref, value;
            this.assertLegalChar = this.assertLegalChar.bind(this);
            this.assertLegalName = this.assertLegalName.bind(this);
            options || (options = {});
            this.options = options;
            if (!this.options.version) {
              this.options.version = "1.0";
            }
            ref = options.stringify || {};
            for (key in ref) {
              if (!hasProp.call(ref, key)) continue;
              value = ref[key];
              this[key] = value;
            }
          }
          // Defaults
          name(val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalName("" + val || "");
          }
          text(val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar(this.textEscape("" + val || ""));
          }
          cdata(val) {
            if (this.options.noValidation) {
              return val;
            }
            val = "" + val || "";
            val = val.replace("]]>", "]]]]><![CDATA[>");
            return this.assertLegalChar(val);
          }
          comment(val) {
            if (this.options.noValidation) {
              return val;
            }
            val = "" + val || "";
            if (val.match(/--/)) {
              throw new Error("Comment text cannot contain double-hypen: " + val);
            }
            return this.assertLegalChar(val);
          }
          raw(val) {
            if (this.options.noValidation) {
              return val;
            }
            return "" + val || "";
          }
          attValue(val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar(this.attEscape(val = "" + val || ""));
          }
          insTarget(val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar("" + val || "");
          }
          insValue(val) {
            if (this.options.noValidation) {
              return val;
            }
            val = "" + val || "";
            if (val.match(/\?>/)) {
              throw new Error("Invalid processing instruction value: " + val);
            }
            return this.assertLegalChar(val);
          }
          xmlVersion(val) {
            if (this.options.noValidation) {
              return val;
            }
            val = "" + val || "";
            if (!val.match(/1\.[0-9]+/)) {
              throw new Error("Invalid version number: " + val);
            }
            return val;
          }
          xmlEncoding(val) {
            if (this.options.noValidation) {
              return val;
            }
            val = "" + val || "";
            if (!val.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) {
              throw new Error("Invalid encoding: " + val);
            }
            return this.assertLegalChar(val);
          }
          xmlStandalone(val) {
            if (this.options.noValidation) {
              return val;
            }
            if (val) {
              return "yes";
            } else {
              return "no";
            }
          }
          dtdPubID(val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar("" + val || "");
          }
          dtdSysID(val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar("" + val || "");
          }
          dtdElementValue(val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar("" + val || "");
          }
          dtdAttType(val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar("" + val || "");
          }
          dtdAttDefault(val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar("" + val || "");
          }
          dtdEntityValue(val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar("" + val || "");
          }
          dtdNData(val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar("" + val || "");
          }
          assertLegalChar(str) {
            var regex, res;
            if (this.options.noValidation) {
              return str;
            }
            if (this.options.version === "1.0") {
              regex = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g;
              if (this.options.invalidCharReplacement !== void 0) {
                str = str.replace(regex, this.options.invalidCharReplacement);
              } else if (res = str.match(regex)) {
                throw new Error(`Invalid character in string: ${str} at index ${res.index}`);
              }
            } else if (this.options.version === "1.1") {
              regex = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g;
              if (this.options.invalidCharReplacement !== void 0) {
                str = str.replace(regex, this.options.invalidCharReplacement);
              } else if (res = str.match(regex)) {
                throw new Error(`Invalid character in string: ${str} at index ${res.index}`);
              }
            }
            return str;
          }
          assertLegalName(str) {
            var regex;
            if (this.options.noValidation) {
              return str;
            }
            str = this.assertLegalChar(str);
            regex = /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;
            if (!str.match(regex)) {
              throw new Error(`Invalid character in name: ${str}`);
            }
            return str;
          }
          // Escapes special characters in text
          // See http://www.w3.org/TR/2000/WD-xml-c14n-20000119.html#charescaping
          // `str` the string to escape
          textEscape(str) {
            var ampregex;
            if (this.options.noValidation) {
              return str;
            }
            ampregex = this.options.noDoubleEncoding ? /(?!&(lt|gt|amp|apos|quot);)&/g : /&/g;
            return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#xD;");
          }
          // Escapes special characters in attribute values
          // See http://www.w3.org/TR/2000/WD-xml-c14n-20000119.html#charescaping
          // `str` the string to escape
          attEscape(str) {
            var ampregex;
            if (this.options.noValidation) {
              return str;
            }
            ampregex = this.options.noDoubleEncoding ? /(?!&(lt|gt|amp|apos|quot);)&/g : /&/g;
            return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\t/g, "&#x9;").replace(/\n/g, "&#xA;").replace(/\r/g, "&#xD;");
          }
        }
        ;
        XMLStringifier2.prototype.convertAttKey = "@";
        XMLStringifier2.prototype.convertPIKey = "?";
        XMLStringifier2.prototype.convertTextKey = "#text";
        XMLStringifier2.prototype.convertCDataKey = "#cdata";
        XMLStringifier2.prototype.convertCommentKey = "#comment";
        XMLStringifier2.prototype.convertRawKey = "#raw";
        return XMLStringifier2;
      }).call(this);
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/WriterState.js
var require_WriterState = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/WriterState.js"(exports2, module2) {
    (function() {
      module2.exports = {
        None: 0,
        OpenTag: 1,
        InsideTag: 2,
        CloseTag: 3
      };
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLWriterBase.js
var require_XMLWriterBase = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLWriterBase.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLProcessingInstruction, XMLRaw, XMLText, XMLWriterBase, assign, hasProp = {}.hasOwnProperty;
      ({ assign } = require_Utility());
      NodeType = require_NodeType();
      XMLDeclaration = require_XMLDeclaration();
      XMLDocType = require_XMLDocType();
      XMLCData = require_XMLCData();
      XMLComment = require_XMLComment();
      XMLElement = require_XMLElement();
      XMLRaw = require_XMLRaw();
      XMLText = require_XMLText();
      XMLProcessingInstruction = require_XMLProcessingInstruction();
      XMLDummy = require_XMLDummy();
      XMLDTDAttList = require_XMLDTDAttList();
      XMLDTDElement = require_XMLDTDElement();
      XMLDTDEntity = require_XMLDTDEntity();
      XMLDTDNotation = require_XMLDTDNotation();
      WriterState = require_WriterState();
      module2.exports = XMLWriterBase = class XMLWriterBase {
        // Initializes a new instance of `XMLWriterBase`
        // `options.pretty` pretty prints the result
        // `options.indent` indentation string
        // `options.newline` newline sequence
        // `options.offset` a fixed number of indentations to add to every line
        // `options.width` maximum column width
        // `options.allowEmpty` do not self close empty element tags
        // 'options.dontPrettyTextNodes' if any text is present in node, don't indent or LF
        // `options.spaceBeforeSlash` add a space before the closing slash of empty elements
        constructor(options) {
          var key, ref, value;
          options || (options = {});
          this.options = options;
          ref = options.writer || {};
          for (key in ref) {
            if (!hasProp.call(ref, key)) continue;
            value = ref[key];
            this["_" + key] = this[key];
            this[key] = value;
          }
        }
        // Filters writer options and provides defaults
        // `options` writer options
        filterOptions(options) {
          var filteredOptions, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7;
          options || (options = {});
          options = assign({}, this.options, options);
          filteredOptions = {
            writer: this
          };
          filteredOptions.pretty = options.pretty || false;
          filteredOptions.allowEmpty = options.allowEmpty || false;
          filteredOptions.indent = (ref = options.indent) != null ? ref : "  ";
          filteredOptions.newline = (ref1 = options.newline) != null ? ref1 : "\n";
          filteredOptions.offset = (ref2 = options.offset) != null ? ref2 : 0;
          filteredOptions.width = (ref3 = options.width) != null ? ref3 : 0;
          filteredOptions.dontPrettyTextNodes = (ref4 = (ref5 = options.dontPrettyTextNodes) != null ? ref5 : options.dontprettytextnodes) != null ? ref4 : 0;
          filteredOptions.spaceBeforeSlash = (ref6 = (ref7 = options.spaceBeforeSlash) != null ? ref7 : options.spacebeforeslash) != null ? ref6 : "";
          if (filteredOptions.spaceBeforeSlash === true) {
            filteredOptions.spaceBeforeSlash = " ";
          }
          filteredOptions.suppressPrettyCount = 0;
          filteredOptions.user = {};
          filteredOptions.state = WriterState.None;
          return filteredOptions;
        }
        // Returns the indentation string for the current level
        // `node` current node
        // `options` writer options
        // `level` current indentation level
        indent(node, options, level) {
          var indentLevel;
          if (!options.pretty || options.suppressPrettyCount) {
            return "";
          } else if (options.pretty) {
            indentLevel = (level || 0) + options.offset + 1;
            if (indentLevel > 0) {
              return new Array(indentLevel).join(options.indent);
            }
          }
          return "";
        }
        // Returns the newline string
        // `node` current node
        // `options` writer options
        // `level` current indentation level
        endline(node, options, level) {
          if (!options.pretty || options.suppressPrettyCount) {
            return "";
          } else {
            return options.newline;
          }
        }
        attribute(att, options, level) {
          var r;
          this.openAttribute(att, options, level);
          if (options.pretty && options.width > 0) {
            r = att.name + '="' + att.value + '"';
          } else {
            r = " " + att.name + '="' + att.value + '"';
          }
          this.closeAttribute(att, options, level);
          return r;
        }
        cdata(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<![CDATA[";
          options.state = WriterState.InsideTag;
          r += node.value;
          options.state = WriterState.CloseTag;
          r += "]]>" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        }
        comment(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<!-- ";
          options.state = WriterState.InsideTag;
          r += node.value;
          options.state = WriterState.CloseTag;
          r += " -->" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        }
        declaration(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<?xml";
          options.state = WriterState.InsideTag;
          r += ' version="' + node.version + '"';
          if (node.encoding != null) {
            r += ' encoding="' + node.encoding + '"';
          }
          if (node.standalone != null) {
            r += ' standalone="' + node.standalone + '"';
          }
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + "?>";
          r += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        }
        docType(node, options, level) {
          var child, i, len1, r, ref;
          level || (level = 0);
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level);
          r += "<!DOCTYPE " + node.root().name;
          if (node.pubID && node.sysID) {
            r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
          } else if (node.sysID) {
            r += ' SYSTEM "' + node.sysID + '"';
          }
          if (node.children.length > 0) {
            r += " [";
            r += this.endline(node, options, level);
            options.state = WriterState.InsideTag;
            ref = node.children;
            for (i = 0, len1 = ref.length; i < len1; i++) {
              child = ref[i];
              r += this.writeChildNode(child, options, level + 1);
            }
            options.state = WriterState.CloseTag;
            r += "]";
          }
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + ">";
          r += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        }
        element(node, options, level) {
          var att, attLen, child, childNodeCount, firstChildNode, i, j, len, len1, len2, name, prettySuppressed, r, ratt, ref, ref1, ref2, ref3, rline;
          level || (level = 0);
          prettySuppressed = false;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<" + node.name;
          if (options.pretty && options.width > 0) {
            len = r.length;
            ref = node.attribs;
            for (name in ref) {
              if (!hasProp.call(ref, name)) continue;
              att = ref[name];
              ratt = this.attribute(att, options, level);
              attLen = ratt.length;
              if (len + attLen > options.width) {
                rline = this.indent(node, options, level + 1) + ratt;
                r += this.endline(node, options, level) + rline;
                len = rline.length;
              } else {
                rline = " " + ratt;
                r += rline;
                len += rline.length;
              }
            }
          } else {
            ref1 = node.attribs;
            for (name in ref1) {
              if (!hasProp.call(ref1, name)) continue;
              att = ref1[name];
              r += this.attribute(att, options, level);
            }
          }
          childNodeCount = node.children.length;
          firstChildNode = childNodeCount === 0 ? null : node.children[0];
          if (childNodeCount === 0 || node.children.every(function(e) {
            return (e.type === NodeType.Text || e.type === NodeType.Raw || e.type === NodeType.CData) && e.value === "";
          })) {
            if (options.allowEmpty) {
              r += ">";
              options.state = WriterState.CloseTag;
              r += "</" + node.name + ">" + this.endline(node, options, level);
            } else {
              options.state = WriterState.CloseTag;
              r += options.spaceBeforeSlash + "/>" + this.endline(node, options, level);
            }
          } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw || firstChildNode.type === NodeType.CData) && firstChildNode.value != null) {
            r += ">";
            options.state = WriterState.InsideTag;
            options.suppressPrettyCount++;
            prettySuppressed = true;
            r += this.writeChildNode(firstChildNode, options, level + 1);
            options.suppressPrettyCount--;
            prettySuppressed = false;
            options.state = WriterState.CloseTag;
            r += "</" + node.name + ">" + this.endline(node, options, level);
          } else {
            if (options.dontPrettyTextNodes) {
              ref2 = node.children;
              for (i = 0, len1 = ref2.length; i < len1; i++) {
                child = ref2[i];
                if ((child.type === NodeType.Text || child.type === NodeType.Raw || child.type === NodeType.CData) && child.value != null) {
                  options.suppressPrettyCount++;
                  prettySuppressed = true;
                  break;
                }
              }
            }
            r += ">" + this.endline(node, options, level);
            options.state = WriterState.InsideTag;
            ref3 = node.children;
            for (j = 0, len2 = ref3.length; j < len2; j++) {
              child = ref3[j];
              r += this.writeChildNode(child, options, level + 1);
            }
            options.state = WriterState.CloseTag;
            r += this.indent(node, options, level) + "</" + node.name + ">";
            if (prettySuppressed) {
              options.suppressPrettyCount--;
            }
            r += this.endline(node, options, level);
            options.state = WriterState.None;
          }
          this.closeNode(node, options, level);
          return r;
        }
        writeChildNode(node, options, level) {
          switch (node.type) {
            case NodeType.CData:
              return this.cdata(node, options, level);
            case NodeType.Comment:
              return this.comment(node, options, level);
            case NodeType.Element:
              return this.element(node, options, level);
            case NodeType.Raw:
              return this.raw(node, options, level);
            case NodeType.Text:
              return this.text(node, options, level);
            case NodeType.ProcessingInstruction:
              return this.processingInstruction(node, options, level);
            case NodeType.Dummy:
              return "";
            case NodeType.Declaration:
              return this.declaration(node, options, level);
            case NodeType.DocType:
              return this.docType(node, options, level);
            case NodeType.AttributeDeclaration:
              return this.dtdAttList(node, options, level);
            case NodeType.ElementDeclaration:
              return this.dtdElement(node, options, level);
            case NodeType.EntityDeclaration:
              return this.dtdEntity(node, options, level);
            case NodeType.NotationDeclaration:
              return this.dtdNotation(node, options, level);
            default:
              throw new Error("Unknown XML node type: " + node.constructor.name);
          }
        }
        processingInstruction(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<?";
          options.state = WriterState.InsideTag;
          r += node.target;
          if (node.value) {
            r += " " + node.value;
          }
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + "?>";
          r += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        }
        raw(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level);
          options.state = WriterState.InsideTag;
          r += node.value;
          options.state = WriterState.CloseTag;
          r += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        }
        text(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level);
          options.state = WriterState.InsideTag;
          r += node.value;
          options.state = WriterState.CloseTag;
          r += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        }
        dtdAttList(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<!ATTLIST";
          options.state = WriterState.InsideTag;
          r += " " + node.elementName + " " + node.attributeName + " " + node.attributeType;
          if (node.defaultValueType !== "#DEFAULT") {
            r += " " + node.defaultValueType;
          }
          if (node.defaultValue) {
            r += ' "' + node.defaultValue + '"';
          }
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        }
        dtdElement(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<!ELEMENT";
          options.state = WriterState.InsideTag;
          r += " " + node.name + " " + node.value;
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        }
        dtdEntity(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<!ENTITY";
          options.state = WriterState.InsideTag;
          if (node.pe) {
            r += " %";
          }
          r += " " + node.name;
          if (node.value) {
            r += ' "' + node.value + '"';
          } else {
            if (node.pubID && node.sysID) {
              r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
            } else if (node.sysID) {
              r += ' SYSTEM "' + node.sysID + '"';
            }
            if (node.nData) {
              r += " NDATA " + node.nData;
            }
          }
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        }
        dtdNotation(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<!NOTATION";
          options.state = WriterState.InsideTag;
          r += " " + node.name;
          if (node.pubID && node.sysID) {
            r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
          } else if (node.pubID) {
            r += ' PUBLIC "' + node.pubID + '"';
          } else if (node.sysID) {
            r += ' SYSTEM "' + node.sysID + '"';
          }
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        }
        openNode(node, options, level) {
        }
        closeNode(node, options, level) {
        }
        openAttribute(att, options, level) {
        }
        closeAttribute(att, options, level) {
        }
      };
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLStringWriter.js
var require_XMLStringWriter = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLStringWriter.js"(exports2, module2) {
    (function() {
      var XMLStringWriter, XMLWriterBase;
      XMLWriterBase = require_XMLWriterBase();
      module2.exports = XMLStringWriter = class XMLStringWriter extends XMLWriterBase {
        // Initializes a new instance of `XMLStringWriter`
        // `options.pretty` pretty prints the result
        // `options.indent` indentation string
        // `options.newline` newline sequence
        // `options.offset` a fixed number of indentations to add to every line
        // `options.allowEmpty` do not self close empty element tags
        // 'options.dontPrettyTextNodes' if any text is present in node, don't indent or LF
        // `options.spaceBeforeSlash` add a space before the closing slash of empty elements
        constructor(options) {
          super(options);
        }
        document(doc, options) {
          var child, i, len, r, ref;
          options = this.filterOptions(options);
          r = "";
          ref = doc.children;
          for (i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            r += this.writeChildNode(child, options, 0);
          }
          if (options.pretty && r.slice(-options.newline.length) === options.newline) {
            r = r.slice(0, -options.newline.length);
          }
          return r;
        }
      };
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDocument.js
var require_XMLDocument = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDocument.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDOMConfiguration, XMLDOMImplementation, XMLDocument, XMLNode, XMLStringWriter, XMLStringifier, isPlainObject;
      ({ isPlainObject } = require_Utility());
      XMLDOMImplementation = require_XMLDOMImplementation();
      XMLDOMConfiguration = require_XMLDOMConfiguration();
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      XMLStringifier = require_XMLStringifier();
      XMLStringWriter = require_XMLStringWriter();
      module2.exports = XMLDocument = (function() {
        class XMLDocument2 extends XMLNode {
          // Initializes a new instance of `XMLDocument`
          // `options.keepNullNodes` whether nodes with null values will be kept
          //     or ignored: true or false
          // `options.keepNullAttributes` whether attributes with null values will be
          //     kept or ignored: true or false
          // `options.ignoreDecorators` whether decorator strings will be ignored when
          //     converting JS objects: true or false
          // `options.separateArrayItems` whether array items are created as separate
          //     nodes when passed as an object value: true or false
          // `options.noDoubleEncoding` whether existing html entities are encoded:
          //     true or false
          // `options.stringify` a set of functions to use for converting values to
          //     strings
          // `options.writer` the default XML writer to use for converting nodes to
          //     string. If the default writer is not set, the built-in XMLStringWriter
          //     will be used instead.
          constructor(options) {
            super(null);
            this.name = "#document";
            this.type = NodeType.Document;
            this.documentURI = null;
            this.domConfig = new XMLDOMConfiguration();
            options || (options = {});
            if (!options.writer) {
              options.writer = new XMLStringWriter();
            }
            this.options = options;
            this.stringify = new XMLStringifier(options);
          }
          // Ends the document and passes it to the given XML writer
          // `writer` is either an XML writer or a plain object to pass to the
          // constructor of the default XML writer. The default writer is assigned when
          // creating the XML document. Following flags are recognized by the
          // built-in XMLStringWriter:
          //   `writer.pretty` pretty prints the result
          //   `writer.indent` indentation for pretty print
          //   `writer.offset` how many indentations to add to every line for pretty print
          //   `writer.newline` newline sequence for pretty print
          end(writer) {
            var writerOptions;
            writerOptions = {};
            if (!writer) {
              writer = this.options.writer;
            } else if (isPlainObject(writer)) {
              writerOptions = writer;
              writer = this.options.writer;
            }
            return writer.document(this, writer.filterOptions(writerOptions));
          }
          // Converts the XML document to string
          // `options.pretty` pretty prints the result
          // `options.indent` indentation for pretty print
          // `options.offset` how many indentations to add to every line for pretty print
          // `options.newline` newline sequence for pretty print
          toString(options) {
            return this.options.writer.document(this, this.options.writer.filterOptions(options));
          }
          // DOM level 1 functions to be implemented later
          createElement(tagName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          createDocumentFragment() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          createTextNode(data) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          createComment(data) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          createCDATASection(data) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          createProcessingInstruction(target, data) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          createAttribute(name) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          createEntityReference(name) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          getElementsByTagName(tagname) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          // DOM level 2 functions to be implemented later
          importNode(importedNode, deep) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          createElementNS(namespaceURI, qualifiedName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          createAttributeNS(namespaceURI, qualifiedName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          getElementsByTagNameNS(namespaceURI, localName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          getElementById(elementId) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          // DOM level 3 functions to be implemented later
          adoptNode(source) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          normalizeDocument() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          renameNode(node, namespaceURI, qualifiedName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          // DOM level 4 functions to be implemented later
          getElementsByClassName(classNames) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          createEvent(eventInterface) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          createRange() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          createNodeIterator(root, whatToShow, filter) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
          createTreeWalker(root, whatToShow, filter) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        }
        ;
        Object.defineProperty(XMLDocument2.prototype, "implementation", {
          value: new XMLDOMImplementation()
        });
        Object.defineProperty(XMLDocument2.prototype, "doctype", {
          get: function() {
            var child, i, len, ref;
            ref = this.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              if (child.type === NodeType.DocType) {
                return child;
              }
            }
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "documentElement", {
          get: function() {
            return this.rootObject || null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "inputEncoding", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "strictErrorChecking", {
          get: function() {
            return false;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "xmlEncoding", {
          get: function() {
            if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
              return this.children[0].encoding;
            } else {
              return null;
            }
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "xmlStandalone", {
          get: function() {
            if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
              return this.children[0].standalone === "yes";
            } else {
              return false;
            }
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "xmlVersion", {
          get: function() {
            if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
              return this.children[0].version;
            } else {
              return "1.0";
            }
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "URL", {
          get: function() {
            return this.documentURI;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "origin", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "compatMode", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "characterSet", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "contentType", {
          get: function() {
            return null;
          }
        });
        return XMLDocument2;
      }).call(this);
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDocumentCB.js
var require_XMLDocumentCB = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLDocumentCB.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLAttribute, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDocument, XMLDocumentCB, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStringWriter, XMLStringifier, XMLText, getValue, isFunction, isObject, isPlainObject, hasProp = {}.hasOwnProperty;
      ({ isObject, isFunction, isPlainObject, getValue } = require_Utility());
      NodeType = require_NodeType();
      XMLDocument = require_XMLDocument();
      XMLElement = require_XMLElement();
      XMLCData = require_XMLCData();
      XMLComment = require_XMLComment();
      XMLRaw = require_XMLRaw();
      XMLText = require_XMLText();
      XMLProcessingInstruction = require_XMLProcessingInstruction();
      XMLDeclaration = require_XMLDeclaration();
      XMLDocType = require_XMLDocType();
      XMLDTDAttList = require_XMLDTDAttList();
      XMLDTDEntity = require_XMLDTDEntity();
      XMLDTDElement = require_XMLDTDElement();
      XMLDTDNotation = require_XMLDTDNotation();
      XMLAttribute = require_XMLAttribute();
      XMLStringifier = require_XMLStringifier();
      XMLStringWriter = require_XMLStringWriter();
      WriterState = require_WriterState();
      module2.exports = XMLDocumentCB = class XMLDocumentCB {
        // Initializes a new instance of `XMLDocumentCB`
        // `options.keepNullNodes` whether nodes with null values will be kept
        //     or ignored: true or false
        // `options.keepNullAttributes` whether attributes with null values will be
        //     kept or ignored: true or false
        // `options.ignoreDecorators` whether decorator strings will be ignored when
        //     converting JS objects: true or false
        // `options.separateArrayItems` whether array items are created as separate
        //     nodes when passed as an object value: true or false
        // `options.noDoubleEncoding` whether existing html entities are encoded:
        //     true or false
        // `options.stringify` a set of functions to use for converting values to
        //     strings
        // `options.writer` the default XML writer to use for converting nodes to
        //     string. If the default writer is not set, the built-in XMLStringWriter
        //     will be used instead.
        // `onData` the function to be called when a new chunk of XML is output. The
        //          string containing the XML chunk is passed to `onData` as its first
        //          argument, and the current indentation level as its second argument.
        // `onEnd`  the function to be called when the XML document is completed with
        //          `end`. `onEnd` does not receive any arguments.
        constructor(options, onData, onEnd) {
          var writerOptions;
          this.name = "?xml";
          this.type = NodeType.Document;
          options || (options = {});
          writerOptions = {};
          if (!options.writer) {
            options.writer = new XMLStringWriter();
          } else if (isPlainObject(options.writer)) {
            writerOptions = options.writer;
            options.writer = new XMLStringWriter();
          }
          this.options = options;
          this.writer = options.writer;
          this.writerOptions = this.writer.filterOptions(writerOptions);
          this.stringify = new XMLStringifier(options);
          this.onDataCallback = onData || function() {
          };
          this.onEndCallback = onEnd || function() {
          };
          this.currentNode = null;
          this.currentLevel = -1;
          this.openTags = {};
          this.documentStarted = false;
          this.documentCompleted = false;
          this.root = null;
        }
        // Creates a child element node from the given XMLNode
        // `node` the child node
        createChildNode(node) {
          var att, attName, attributes, child, i, len, ref, ref1;
          switch (node.type) {
            case NodeType.CData:
              this.cdata(node.value);
              break;
            case NodeType.Comment:
              this.comment(node.value);
              break;
            case NodeType.Element:
              attributes = {};
              ref = node.attribs;
              for (attName in ref) {
                if (!hasProp.call(ref, attName)) continue;
                att = ref[attName];
                attributes[attName] = att.value;
              }
              this.node(node.name, attributes);
              break;
            case NodeType.Dummy:
              this.dummy();
              break;
            case NodeType.Raw:
              this.raw(node.value);
              break;
            case NodeType.Text:
              this.text(node.value);
              break;
            case NodeType.ProcessingInstruction:
              this.instruction(node.target, node.value);
              break;
            default:
              throw new Error("This XML node type is not supported in a JS object: " + node.constructor.name);
          }
          ref1 = node.children;
          for (i = 0, len = ref1.length; i < len; i++) {
            child = ref1[i];
            this.createChildNode(child);
            if (child.type === NodeType.Element) {
              this.up();
            }
          }
          return this;
        }
        // Creates a dummy node
        dummy() {
          return this;
        }
        // Creates a node
        // `name` name of the node
        // `attributes` an object containing name/value pairs of attributes
        // `text` element text
        node(name, attributes, text) {
          if (name == null) {
            throw new Error("Missing node name.");
          }
          if (this.root && this.currentLevel === -1) {
            throw new Error("Document can only have one root node. " + this.debugInfo(name));
          }
          this.openCurrent();
          name = getValue(name);
          if (attributes == null) {
            attributes = {};
          }
          attributes = getValue(attributes);
          if (!isObject(attributes)) {
            [text, attributes] = [attributes, text];
          }
          this.currentNode = new XMLElement(this, name, attributes);
          this.currentNode.children = false;
          this.currentLevel++;
          this.openTags[this.currentLevel] = this.currentNode;
          if (text != null) {
            this.text(text);
          }
          return this;
        }
        // Creates a child element node or an element type declaration when called
        // inside the DTD
        // `name` name of the node
        // `attributes` an object containing name/value pairs of attributes
        // `text` element text
        element(name, attributes, text) {
          var child, i, len, oldValidationFlag, ref, root;
          if (this.currentNode && this.currentNode.type === NodeType.DocType) {
            this.dtdElement(...arguments);
          } else {
            if (Array.isArray(name) || isObject(name) || isFunction(name)) {
              oldValidationFlag = this.options.noValidation;
              this.options.noValidation = true;
              root = new XMLDocument(this.options).element("TEMP_ROOT");
              root.element(name);
              this.options.noValidation = oldValidationFlag;
              ref = root.children;
              for (i = 0, len = ref.length; i < len; i++) {
                child = ref[i];
                this.createChildNode(child);
                if (child.type === NodeType.Element) {
                  this.up();
                }
              }
            } else {
              this.node(name, attributes, text);
            }
          }
          return this;
        }
        // Adds or modifies an attribute
        // `name` attribute name
        // `value` attribute value
        attribute(name, value) {
          var attName, attValue;
          if (!this.currentNode || this.currentNode.children) {
            throw new Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(name));
          }
          if (name != null) {
            name = getValue(name);
          }
          if (isObject(name)) {
            for (attName in name) {
              if (!hasProp.call(name, attName)) continue;
              attValue = name[attName];
              this.attribute(attName, attValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            if (this.options.keepNullAttributes && value == null) {
              this.currentNode.attribs[name] = new XMLAttribute(this, name, "");
            } else if (value != null) {
              this.currentNode.attribs[name] = new XMLAttribute(this, name, value);
            }
          }
          return this;
        }
        // Creates a text node
        // `value` element text
        text(value) {
          var node;
          this.openCurrent();
          node = new XMLText(this, value);
          this.onData(this.writer.text(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        }
        // Creates a CDATA node
        // `value` element text without CDATA delimiters
        cdata(value) {
          var node;
          this.openCurrent();
          node = new XMLCData(this, value);
          this.onData(this.writer.cdata(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        }
        // Creates a comment node
        // `value` comment text
        comment(value) {
          var node;
          this.openCurrent();
          node = new XMLComment(this, value);
          this.onData(this.writer.comment(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        }
        // Adds unescaped raw text
        // `value` text
        raw(value) {
          var node;
          this.openCurrent();
          node = new XMLRaw(this, value);
          this.onData(this.writer.raw(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        }
        // Adds a processing instruction
        // `target` instruction target
        // `value` instruction value
        instruction(target, value) {
          var i, insTarget, insValue, len, node;
          this.openCurrent();
          if (target != null) {
            target = getValue(target);
          }
          if (value != null) {
            value = getValue(value);
          }
          if (Array.isArray(target)) {
            for (i = 0, len = target.length; i < len; i++) {
              insTarget = target[i];
              this.instruction(insTarget);
            }
          } else if (isObject(target)) {
            for (insTarget in target) {
              if (!hasProp.call(target, insTarget)) continue;
              insValue = target[insTarget];
              this.instruction(insTarget, insValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            node = new XMLProcessingInstruction(this, target, value);
            this.onData(this.writer.processingInstruction(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          }
          return this;
        }
        // Creates the xml declaration
        // `version` A version number string, e.g. 1.0
        // `encoding` Encoding declaration, e.g. UTF-8
        // `standalone` standalone document declaration: true or false
        declaration(version, encoding, standalone) {
          var node;
          this.openCurrent();
          if (this.documentStarted) {
            throw new Error("declaration() must be the first node.");
          }
          node = new XMLDeclaration(this, version, encoding, standalone);
          this.onData(this.writer.declaration(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        }
        // Creates the document type declaration
        // `root`  the name of the root node
        // `pubID` the public identifier of the external subset
        // `sysID` the system identifier of the external subset
        doctype(root, pubID, sysID) {
          this.openCurrent();
          if (root == null) {
            throw new Error("Missing root node name.");
          }
          if (this.root) {
            throw new Error("dtd() must come before the root node.");
          }
          this.currentNode = new XMLDocType(this, pubID, sysID);
          this.currentNode.rootNodeName = root;
          this.currentNode.children = false;
          this.currentLevel++;
          this.openTags[this.currentLevel] = this.currentNode;
          return this;
        }
        // Creates an element type declaration
        // `name` element name
        // `value` element content (defaults to #PCDATA)
        dtdElement(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDElement(this, name, value);
          this.onData(this.writer.dtdElement(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        }
        // Creates an attribute declaration
        // `elementName` the name of the element containing this attribute
        // `attributeName` attribute name
        // `attributeType` type of the attribute (defaults to CDATA)
        // `defaultValueType` default value type (either #REQUIRED, #IMPLIED, #FIXED or
        //                    #DEFAULT) (defaults to #IMPLIED)
        // `defaultValue` default value of the attribute
        //                (only used for #FIXED or #DEFAULT)
        attList(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          var node;
          this.openCurrent();
          node = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
          this.onData(this.writer.dtdAttList(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        }
        // Creates a general entity declaration
        // `name` the name of the entity
        // `value` internal entity value or an object with external entity details
        // `value.pubID` public identifier
        // `value.sysID` system identifier
        // `value.nData` notation declaration
        entity(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDEntity(this, false, name, value);
          this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        }
        // Creates a parameter entity declaration
        // `name` the name of the entity
        // `value` internal entity value or an object with external entity details
        // `value.pubID` public identifier
        // `value.sysID` system identifier
        pEntity(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDEntity(this, true, name, value);
          this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        }
        // Creates a NOTATION declaration
        // `name` the name of the notation
        // `value` an object with external entity details
        // `value.pubID` public identifier
        // `value.sysID` system identifier
        notation(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDNotation(this, name, value);
          this.onData(this.writer.dtdNotation(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        }
        // Gets the parent node
        up() {
          if (this.currentLevel < 0) {
            throw new Error("The document node has no parent.");
          }
          if (this.currentNode) {
            if (this.currentNode.children) {
              this.closeNode(this.currentNode);
            } else {
              this.openNode(this.currentNode);
            }
            this.currentNode = null;
          } else {
            this.closeNode(this.openTags[this.currentLevel]);
          }
          delete this.openTags[this.currentLevel];
          this.currentLevel--;
          return this;
        }
        // Ends the document
        end() {
          while (this.currentLevel >= 0) {
            this.up();
          }
          return this.onEnd();
        }
        // Opens the current parent node
        openCurrent() {
          if (this.currentNode) {
            this.currentNode.children = true;
            return this.openNode(this.currentNode);
          }
        }
        // Writes the opening tag of the current node or the entire node if it has
        // no child nodes
        openNode(node) {
          var att, chunk, name, ref;
          if (!node.isOpen) {
            if (!this.root && this.currentLevel === 0 && node.type === NodeType.Element) {
              this.root = node;
            }
            chunk = "";
            if (node.type === NodeType.Element) {
              this.writerOptions.state = WriterState.OpenTag;
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "<" + node.name;
              ref = node.attribs;
              for (name in ref) {
                if (!hasProp.call(ref, name)) continue;
                att = ref[name];
                chunk += this.writer.attribute(att, this.writerOptions, this.currentLevel);
              }
              chunk += (node.children ? ">" : "/>") + this.writer.endline(node, this.writerOptions, this.currentLevel);
              this.writerOptions.state = WriterState.InsideTag;
            } else {
              this.writerOptions.state = WriterState.OpenTag;
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "<!DOCTYPE " + node.rootNodeName;
              if (node.pubID && node.sysID) {
                chunk += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
              } else if (node.sysID) {
                chunk += ' SYSTEM "' + node.sysID + '"';
              }
              if (node.children) {
                chunk += " [";
                this.writerOptions.state = WriterState.InsideTag;
              } else {
                this.writerOptions.state = WriterState.CloseTag;
                chunk += ">";
              }
              chunk += this.writer.endline(node, this.writerOptions, this.currentLevel);
            }
            this.onData(chunk, this.currentLevel);
            return node.isOpen = true;
          }
        }
        // Writes the closing tag of the current node
        closeNode(node) {
          var chunk;
          if (!node.isClosed) {
            chunk = "";
            this.writerOptions.state = WriterState.CloseTag;
            if (node.type === NodeType.Element) {
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "</" + node.name + ">" + this.writer.endline(node, this.writerOptions, this.currentLevel);
            } else {
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "]>" + this.writer.endline(node, this.writerOptions, this.currentLevel);
            }
            this.writerOptions.state = WriterState.None;
            this.onData(chunk, this.currentLevel);
            return node.isClosed = true;
          }
        }
        // Called when a new chunk of XML is output
        // `chunk` a string containing the XML chunk
        // `level` current indentation level
        onData(chunk, level) {
          this.documentStarted = true;
          return this.onDataCallback(chunk, level + 1);
        }
        // Called when the XML document is completed
        onEnd() {
          this.documentCompleted = true;
          return this.onEndCallback();
        }
        // Returns debug string
        debugInfo(name) {
          if (name == null) {
            return "";
          } else {
            return "node: <" + name + ">";
          }
        }
        // Node aliases
        ele() {
          return this.element(...arguments);
        }
        nod(name, attributes, text) {
          return this.node(name, attributes, text);
        }
        txt(value) {
          return this.text(value);
        }
        dat(value) {
          return this.cdata(value);
        }
        com(value) {
          return this.comment(value);
        }
        ins(target, value) {
          return this.instruction(target, value);
        }
        dec(version, encoding, standalone) {
          return this.declaration(version, encoding, standalone);
        }
        dtd(root, pubID, sysID) {
          return this.doctype(root, pubID, sysID);
        }
        e(name, attributes, text) {
          return this.element(name, attributes, text);
        }
        n(name, attributes, text) {
          return this.node(name, attributes, text);
        }
        t(value) {
          return this.text(value);
        }
        d(value) {
          return this.cdata(value);
        }
        c(value) {
          return this.comment(value);
        }
        r(value) {
          return this.raw(value);
        }
        i(target, value) {
          return this.instruction(target, value);
        }
        // Attribute aliases
        att() {
          if (this.currentNode && this.currentNode.type === NodeType.DocType) {
            return this.attList(...arguments);
          } else {
            return this.attribute(...arguments);
          }
        }
        a() {
          if (this.currentNode && this.currentNode.type === NodeType.DocType) {
            return this.attList(...arguments);
          } else {
            return this.attribute(...arguments);
          }
        }
        // DTD aliases
        // att() and ele() are defined above
        ent(name, value) {
          return this.entity(name, value);
        }
        pent(name, value) {
          return this.pEntity(name, value);
        }
        not(name, value) {
          return this.notation(name, value);
        }
      };
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLStreamWriter.js
var require_XMLStreamWriter = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/XMLStreamWriter.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLStreamWriter, XMLWriterBase, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLWriterBase = require_XMLWriterBase();
      WriterState = require_WriterState();
      module2.exports = XMLStreamWriter = class XMLStreamWriter extends XMLWriterBase {
        // Initializes a new instance of `XMLStreamWriter`
        // `stream` output stream
        // `options.pretty` pretty prints the result
        // `options.indent` indentation string
        // `options.newline` newline sequence
        // `options.offset` a fixed number of indentations to add to every line
        // `options.allowEmpty` do not self close empty element tags
        // 'options.dontPrettyTextNodes' if any text is present in node, don't indent or LF
        // `options.spaceBeforeSlash` add a space before the closing slash of empty elements
        constructor(stream, options) {
          super(options);
          this.stream = stream;
        }
        endline(node, options, level) {
          if (node.isLastRootNode && options.state === WriterState.CloseTag) {
            return "";
          } else {
            return super.endline(node, options, level);
          }
        }
        document(doc, options) {
          var child, i, j, k, len1, len2, ref, ref1, results;
          ref = doc.children;
          for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
            child = ref[i];
            child.isLastRootNode = i === doc.children.length - 1;
          }
          options = this.filterOptions(options);
          ref1 = doc.children;
          results = [];
          for (k = 0, len2 = ref1.length; k < len2; k++) {
            child = ref1[k];
            results.push(this.writeChildNode(child, options, 0));
          }
          return results;
        }
        cdata(node, options, level) {
          return this.stream.write(super.cdata(node, options, level));
        }
        comment(node, options, level) {
          return this.stream.write(super.comment(node, options, level));
        }
        declaration(node, options, level) {
          return this.stream.write(super.declaration(node, options, level));
        }
        docType(node, options, level) {
          var child, j, len1, ref;
          level || (level = 0);
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          this.stream.write(this.indent(node, options, level));
          this.stream.write("<!DOCTYPE " + node.root().name);
          if (node.pubID && node.sysID) {
            this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
          } else if (node.sysID) {
            this.stream.write(' SYSTEM "' + node.sysID + '"');
          }
          if (node.children.length > 0) {
            this.stream.write(" [");
            this.stream.write(this.endline(node, options, level));
            options.state = WriterState.InsideTag;
            ref = node.children;
            for (j = 0, len1 = ref.length; j < len1; j++) {
              child = ref[j];
              this.writeChildNode(child, options, level + 1);
            }
            options.state = WriterState.CloseTag;
            this.stream.write("]");
          }
          options.state = WriterState.CloseTag;
          this.stream.write(options.spaceBeforeSlash + ">");
          this.stream.write(this.endline(node, options, level));
          options.state = WriterState.None;
          return this.closeNode(node, options, level);
        }
        element(node, options, level) {
          var att, attLen, child, childNodeCount, firstChildNode, j, len, len1, name, prettySuppressed, r, ratt, ref, ref1, ref2, rline;
          level || (level = 0);
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<" + node.name;
          if (options.pretty && options.width > 0) {
            len = r.length;
            ref = node.attribs;
            for (name in ref) {
              if (!hasProp.call(ref, name)) continue;
              att = ref[name];
              ratt = this.attribute(att, options, level);
              attLen = ratt.length;
              if (len + attLen > options.width) {
                rline = this.indent(node, options, level + 1) + ratt;
                r += this.endline(node, options, level) + rline;
                len = rline.length;
              } else {
                rline = " " + ratt;
                r += rline;
                len += rline.length;
              }
            }
          } else {
            ref1 = node.attribs;
            for (name in ref1) {
              if (!hasProp.call(ref1, name)) continue;
              att = ref1[name];
              r += this.attribute(att, options, level);
            }
          }
          this.stream.write(r);
          childNodeCount = node.children.length;
          firstChildNode = childNodeCount === 0 ? null : node.children[0];
          if (childNodeCount === 0 || node.children.every(function(e) {
            return (e.type === NodeType.Text || e.type === NodeType.Raw || e.type === NodeType.CData) && e.value === "";
          })) {
            if (options.allowEmpty) {
              this.stream.write(">");
              options.state = WriterState.CloseTag;
              this.stream.write("</" + node.name + ">");
            } else {
              options.state = WriterState.CloseTag;
              this.stream.write(options.spaceBeforeSlash + "/>");
            }
          } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw || firstChildNode.type === NodeType.CData) && firstChildNode.value != null) {
            this.stream.write(">");
            options.state = WriterState.InsideTag;
            options.suppressPrettyCount++;
            prettySuppressed = true;
            this.writeChildNode(firstChildNode, options, level + 1);
            options.suppressPrettyCount--;
            prettySuppressed = false;
            options.state = WriterState.CloseTag;
            this.stream.write("</" + node.name + ">");
          } else {
            this.stream.write(">" + this.endline(node, options, level));
            options.state = WriterState.InsideTag;
            ref2 = node.children;
            for (j = 0, len1 = ref2.length; j < len1; j++) {
              child = ref2[j];
              this.writeChildNode(child, options, level + 1);
            }
            options.state = WriterState.CloseTag;
            this.stream.write(this.indent(node, options, level) + "</" + node.name + ">");
          }
          this.stream.write(this.endline(node, options, level));
          options.state = WriterState.None;
          return this.closeNode(node, options, level);
        }
        processingInstruction(node, options, level) {
          return this.stream.write(super.processingInstruction(node, options, level));
        }
        raw(node, options, level) {
          return this.stream.write(super.raw(node, options, level));
        }
        text(node, options, level) {
          return this.stream.write(super.text(node, options, level));
        }
        dtdAttList(node, options, level) {
          return this.stream.write(super.dtdAttList(node, options, level));
        }
        dtdElement(node, options, level) {
          return this.stream.write(super.dtdElement(node, options, level));
        }
        dtdEntity(node, options, level) {
          return this.stream.write(super.dtdEntity(node, options, level));
        }
        dtdNotation(node, options, level) {
          return this.stream.write(super.dtdNotation(node, options, level));
        }
      };
    }).call(exports2);
  }
});

// node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/.pnpm/xmlbuilder@15.1.1/node_modules/xmlbuilder/lib/index.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLDOMImplementation, XMLDocument, XMLDocumentCB, XMLStreamWriter, XMLStringWriter, assign, isFunction;
      ({ assign, isFunction } = require_Utility());
      XMLDOMImplementation = require_XMLDOMImplementation();
      XMLDocument = require_XMLDocument();
      XMLDocumentCB = require_XMLDocumentCB();
      XMLStringWriter = require_XMLStringWriter();
      XMLStreamWriter = require_XMLStreamWriter();
      NodeType = require_NodeType();
      WriterState = require_WriterState();
      module2.exports.create = function(name, xmldec, doctype, options) {
        var doc, root;
        if (name == null) {
          throw new Error("Root element needs a name.");
        }
        options = assign({}, xmldec, doctype, options);
        doc = new XMLDocument(options);
        root = doc.element(name);
        if (!options.headless) {
          doc.declaration(options);
          if (options.pubID != null || options.sysID != null) {
            doc.dtd(options);
          }
        }
        return root;
      };
      module2.exports.begin = function(options, onData, onEnd) {
        if (isFunction(options)) {
          [onData, onEnd] = [options, onData];
          options = {};
        }
        if (onData) {
          return new XMLDocumentCB(options, onData, onEnd);
        } else {
          return new XMLDocument(options);
        }
      };
      module2.exports.stringWriter = function(options) {
        return new XMLStringWriter(options);
      };
      module2.exports.streamWriter = function(stream, options) {
        return new XMLStreamWriter(stream, options);
      };
      module2.exports.implementation = new XMLDOMImplementation();
      module2.exports.nodeType = NodeType;
      module2.exports.writerState = WriterState;
    }).call(exports2);
  }
});

// main.js
var import_electron5 = require("electron");
var import_fs8 = require("fs");
var import_os8 = __toESM(require("os"), 1);
var import_path12 = __toESM(require("path"), 1);
var import_url2 = require("url");

// src/electron/bluetooth-manager.ts
var import_child_process = require("child_process");
var import_fs = require("fs");
var import_path2 = __toESM(require("path"), 1);
var import_util = require("util");
var import_events = require("events");

// node_modules/.pnpm/plist@5.0.0/node_modules/plist/dist/parse.js
var import_xmldom = __toESM(require_lib(), 1);

// node_modules/.pnpm/plist@5.0.0/node_modules/plist/dist/parse-binary.js
var EPOCH_2001 = 9783072e5;
function readSizedInt(view, offset, size) {
  switch (size) {
    case 1:
      return view.getUint8(offset);
    case 2:
      return view.getUint16(offset);
    case 4:
      return view.getUint32(offset);
    case 8: {
      const hi = view.getUint32(offset);
      const lo = view.getUint32(offset + 4);
      return hi * 4294967296 + lo;
    }
    default:
      throw new Error(`Unsupported int size: ${size}`);
  }
}
function parseBinary(data) {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const len = data.byteLength;
  const header = String.fromCharCode(...data.subarray(0, 8));
  if (header !== "bplist00") {
    throw new Error("Invalid binary plist: bad magic");
  }
  const trailerOffset = len - 32;
  const offsetTableOffsetSize = view.getUint8(trailerOffset + 6);
  const objectRefSize = view.getUint8(trailerOffset + 7);
  const numObjects = readSizedInt(view, trailerOffset + 8, 8);
  const topObject = readSizedInt(view, trailerOffset + 16, 8);
  const offsetTableOffset = readSizedInt(view, trailerOffset + 24, 8);
  const offsets = [];
  for (let i = 0; i < numObjects; i++) {
    offsets.push(readSizedInt(view, offsetTableOffset + i * offsetTableOffsetSize, offsetTableOffsetSize));
  }
  function parseObject(index) {
    let offset = offsets[index];
    const marker = view.getUint8(offset);
    const type = marker >> 4;
    let size = marker & 15;
    offset++;
    if (type !== 0 && type !== 8 && size === 15) {
      const extMarker = view.getUint8(offset);
      offset++;
      const extSize = 1 << (extMarker & 15);
      size = readSizedInt(view, offset, extSize);
      offset += extSize;
    }
    switch (type) {
      case 0:
        if (marker === 0)
          return null;
        if (marker === 8)
          return false;
        if (marker === 9)
          return true;
        throw new Error(`Unknown singleton: 0x${marker.toString(16)}`);
      case 1: {
        const byteCount = 1 << size;
        if (byteCount <= 4) {
          return readSizedInt(view, offset, byteCount);
        }
        const hi = view.getInt32(offset);
        const lo = view.getUint32(offset + 4);
        return hi * 4294967296 + lo;
      }
      case 2: {
        const byteCount = 1 << size;
        if (byteCount === 4)
          return view.getFloat32(offset);
        if (byteCount === 8)
          return view.getFloat64(offset);
        throw new Error(`Unsupported real size: ${byteCount}`);
      }
      case 3: {
        const timestamp = view.getFloat64(offset);
        return new Date(timestamp * 1e3 + EPOCH_2001);
      }
      case 4: {
        return new Uint8Array(data.buffer, data.byteOffset + offset, size);
      }
      case 5: {
        let s = "";
        for (let i = 0; i < size; i++) {
          s += String.fromCharCode(view.getUint8(offset + i));
        }
        return s;
      }
      case 6: {
        let s = "";
        for (let i = 0; i < size; i++) {
          s += String.fromCharCode(view.getUint16(offset + i * 2));
        }
        return s;
      }
      case 8: {
        const byteCount = size + 1;
        return { UID: readSizedInt(view, offset, byteCount) };
      }
      case 10: {
        const arr = [];
        for (let i = 0; i < size; i++) {
          const ref = readSizedInt(view, offset + i * objectRefSize, objectRefSize);
          arr.push(parseObject(ref));
        }
        return arr;
      }
      case 13: {
        const dict = {};
        for (let i = 0; i < size; i++) {
          const keyRef = readSizedInt(view, offset + i * objectRefSize, objectRefSize);
          const valRef = readSizedInt(view, offset + (size + i) * objectRefSize, objectRefSize);
          const key = parseObject(keyRef);
          dict[key] = parseObject(valRef);
        }
        return dict;
      }
      default:
        throw new Error(`Unknown object type: 0x${type.toString(16)}`);
    }
  }
  return parseObject(topObject);
}

// node_modules/.pnpm/plist@5.0.0/node_modules/plist/dist/parse-openstep.js
var OpenStepParser = class {
  input;
  pos;
  constructor(input) {
    this.input = input;
    this.pos = 0;
  }
  skipWhitespaceAndComments() {
    while (this.pos < this.input.length) {
      const ch = this.input[this.pos];
      if (/\s/.test(ch)) {
        this.pos++;
        continue;
      }
      if (ch === "/" && this.pos + 1 < this.input.length && this.input[this.pos + 1] === "*") {
        this.pos += 2;
        const end = this.input.indexOf("*/", this.pos);
        if (end === -1)
          throw new Error("Unterminated block comment");
        this.pos = end + 2;
        continue;
      }
      if (ch === "/" && this.pos + 1 < this.input.length && this.input[this.pos + 1] === "/") {
        this.pos += 2;
        const end = this.input.indexOf("\n", this.pos);
        this.pos = end === -1 ? this.input.length : end + 1;
        continue;
      }
      break;
    }
  }
  parseValue() {
    this.skipWhitespaceAndComments();
    if (this.pos >= this.input.length) {
      throw new Error("Unexpected end of input");
    }
    const ch = this.input[this.pos];
    if (ch === "{")
      return this.parseDict();
    if (ch === "(")
      return this.parseArray();
    if (ch === "<")
      return this.parseData();
    if (ch === '"')
      return this.parseQuotedString();
    return this.parseUnquotedString();
  }
  parseDict() {
    this.pos++;
    const obj = {};
    while (true) {
      this.skipWhitespaceAndComments();
      if (this.pos >= this.input.length)
        throw new Error("Unterminated dictionary");
      if (this.input[this.pos] === "}") {
        this.pos++;
        return obj;
      }
      const key = this.parseValue();
      this.skipWhitespaceAndComments();
      if (this.pos >= this.input.length || this.input[this.pos] !== "=")
        throw new Error(`Expected '=' after key "${key}" at position ${this.pos}`);
      this.pos++;
      const value = this.parseValue();
      obj[key] = value;
      this.skipWhitespaceAndComments();
      if (this.pos < this.input.length && this.input[this.pos] === ";") {
        this.pos++;
      }
    }
  }
  parseArray() {
    this.pos++;
    const arr = [];
    this.skipWhitespaceAndComments();
    if (this.pos < this.input.length && this.input[this.pos] === ")") {
      this.pos++;
      return arr;
    }
    while (true) {
      arr.push(this.parseValue());
      this.skipWhitespaceAndComments();
      if (this.pos >= this.input.length)
        throw new Error("Unterminated array");
      if (this.input[this.pos] === ")") {
        this.pos++;
        return arr;
      }
      if (this.input[this.pos] === ",") {
        this.pos++;
        this.skipWhitespaceAndComments();
        if (this.pos < this.input.length && this.input[this.pos] === ")") {
          this.pos++;
          return arr;
        }
      } else {
        throw new Error(`Expected ',' or ')' in array at position ${this.pos}`);
      }
    }
  }
  parseData() {
    this.pos++;
    let hex = "";
    while (this.pos < this.input.length) {
      const ch = this.input[this.pos];
      if (ch === ">") {
        this.pos++;
        const clean = hex.replace(/\s+/g, "");
        const bytes = new Uint8Array(clean.length / 2);
        for (let i = 0; i < clean.length; i += 2) {
          bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
        }
        return bytes;
      }
      hex += ch;
      this.pos++;
    }
    throw new Error("Unterminated data");
  }
  parseQuotedString() {
    this.pos++;
    let result = "";
    while (this.pos < this.input.length) {
      const ch = this.input[this.pos];
      if (ch === "\\") {
        this.pos++;
        if (this.pos >= this.input.length)
          throw new Error("Unterminated string escape");
        const esc = this.input[this.pos];
        switch (esc) {
          case '"':
            result += '"';
            break;
          case "\\":
            result += "\\";
            break;
          case "n":
            result += "\n";
            break;
          case "t":
            result += "	";
            break;
          case "r":
            result += "\r";
            break;
          case "0":
            result += "\0";
            break;
          default:
            result += esc;
            break;
        }
        this.pos++;
        continue;
      }
      if (ch === '"') {
        this.pos++;
        return result;
      }
      result += ch;
      this.pos++;
    }
    throw new Error("Unterminated string");
  }
  parseUnquotedString() {
    const start = this.pos;
    while (this.pos < this.input.length) {
      const ch = this.input[this.pos];
      if (/[a-zA-Z0-9._\/$:-]/.test(ch)) {
        this.pos++;
      } else {
        break;
      }
    }
    if (this.pos === start) {
      throw new Error(`Unexpected character '${this.input[this.pos]}' at position ${this.pos}`);
    }
    return this.input.substring(start, this.pos);
  }
};
function parseOpenStep(input) {
  const parser = new OpenStepParser(input);
  const value = parser.parseValue();
  return value;
}

// node_modules/.pnpm/plist@5.0.0/node_modules/plist/dist/parse.js
function base64ToUint8Array(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
var TEXT_NODE = 3;
var CDATA_NODE = 4;
var COMMENT_NODE = 8;
function shouldIgnoreNode(node) {
  return node.nodeType === TEXT_NODE || node.nodeType === COMMENT_NODE || node.nodeType === CDATA_NODE;
}
function isEmptyNode(node) {
  if (!node.childNodes || node.childNodes.length === 0) {
    return true;
  } else {
    return false;
  }
}
function invariant(test, message) {
  if (!test) {
    throw new Error(message);
  }
}
function parse(xml) {
  if (xml instanceof ArrayBuffer) {
    return parseBinary(new Uint8Array(xml));
  }
  if (xml instanceof Uint8Array) {
    return parseBinary(xml);
  }
  if (typeof xml === "string" && xml.startsWith("bplist")) {
    const encoder = new TextEncoder();
    return parseBinary(encoder.encode(xml));
  }
  if (typeof xml === "string") {
    const trimmed = xml.trimStart();
    if ((trimmed[0] === "{" || trimmed[0] === "(") && !trimmed.startsWith("<?xml") && !trimmed.startsWith("<!DOCTYPE") && !trimmed.startsWith("<plist")) {
      return parseOpenStep(xml);
    }
  }
  const doc = new import_xmldom.DOMParser().parseFromString(xml, "text/xml");
  const root = doc.documentElement;
  invariant(root !== null && root.nodeName === "plist", "malformed document. First element should be <plist>");
  let plist = parsePlistXML(root);
  if (Array.isArray(plist) && plist.length == 1)
    plist = plist[0];
  return plist;
}
function parsePlistXML(node) {
  if (!node)
    return null;
  if (node.nodeName === "plist") {
    const new_arr = [];
    if (isEmptyNode(node)) {
      return new_arr;
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      if (!shouldIgnoreNode(node.childNodes[i])) {
        new_arr.push(parsePlistXML(node.childNodes[i]));
      }
    }
    return new_arr;
  } else if (node.nodeName === "dict") {
    const new_obj = {};
    let key = null;
    let counter = 0;
    if (isEmptyNode(node)) {
      return new_obj;
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      if (shouldIgnoreNode(node.childNodes[i]))
        continue;
      if (counter % 2 === 0) {
        invariant(node.childNodes[i].nodeName === "key", "Missing key while parsing <dict/>.");
        key = parsePlistXML(node.childNodes[i]);
      } else {
        invariant(node.childNodes[i].nodeName !== "key", "Unexpected <key> while parsing <dict/>. Keys and values must alternate.");
        new_obj[key] = parsePlistXML(node.childNodes[i]);
      }
      counter += 1;
    }
    if (counter % 2 === 1) {
      new_obj[key] = "";
    }
    return new_obj;
  } else if (node.nodeName === "array") {
    const new_arr = [];
    if (isEmptyNode(node)) {
      return new_arr;
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      if (!shouldIgnoreNode(node.childNodes[i])) {
        const res = parsePlistXML(node.childNodes[i]);
        if (null != res)
          new_arr.push(res);
      }
    }
    return new_arr;
  } else if (node.nodeName === "#text") {
  } else if (node.nodeName === "key") {
    if (isEmptyNode(node)) {
      return "";
    }
    invariant(node.childNodes[0].nodeValue !== "__proto__", "__proto__ keys can lead to prototype pollution. More details on CVE-2022-22912");
    return node.childNodes[0].nodeValue;
  } else if (node.nodeName === "string") {
    let res = "";
    if (isEmptyNode(node)) {
      return res;
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      const type = node.childNodes[i].nodeType;
      if (type === TEXT_NODE || type === CDATA_NODE) {
        res += node.childNodes[i].nodeValue;
      }
    }
    return res;
  } else if (node.nodeName === "integer") {
    invariant(!isEmptyNode(node), 'Cannot parse "" as integer.');
    return parseInt(node.childNodes[0].nodeValue, 10);
  } else if (node.nodeName === "real") {
    invariant(!isEmptyNode(node), 'Cannot parse "" as real.');
    let res = "";
    for (let i = 0; i < node.childNodes.length; i++) {
      if (node.childNodes[i].nodeType === TEXT_NODE) {
        res += node.childNodes[i].nodeValue;
      }
    }
    return parseFloat(res);
  } else if (node.nodeName === "data") {
    let res = "";
    if (isEmptyNode(node)) {
      return base64ToUint8Array(res);
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      if (node.childNodes[i].nodeType === TEXT_NODE) {
        res += node.childNodes[i].nodeValue.replace(/\s+/g, "");
      }
    }
    return base64ToUint8Array(res);
  } else if (node.nodeName === "date") {
    invariant(!isEmptyNode(node), 'Cannot parse "" as Date.');
    return new Date(node.childNodes[0].nodeValue);
  } else if (node.nodeName === "null") {
    return null;
  } else if (node.nodeName === "true") {
    return true;
  } else if (node.nodeName === "false") {
    return false;
  } else {
    throw new Error("Invalid PLIST tag " + node.nodeName);
  }
  return null;
}

// node_modules/.pnpm/plist@5.0.0/node_modules/plist/dist/build.js
var import_xmlbuilder = __toESM(require_lib2(), 1);

// src/electron/paths.ts
var import_electron = require("electron");
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var __dirname = import_path.default.dirname((0, import_url.fileURLToPath)(__cjs_meta_url));
function helperSourceDir() {
  return import_electron.app.isPackaged ? import_path.default.join(process.resourcesPath, "swift") : __dirname;
}
function helperCacheDir() {
  return import_path.default.join(import_electron.app.getPath("userData"), "swift-helpers");
}

// src/electron/bluetooth-manager.ts
var execPromise = (0, import_util.promisify)(import_child_process.exec);
var execFilePromise = (0, import_util.promisify)(import_child_process.execFile);
var bluetoothDebugEnabled = process.env.BLUETOOTH_DEBUG === "1";
async function getSwiftHelper(scriptName) {
  const cacheDir = helperCacheDir();
  const sourcePath = import_path2.default.join(helperSourceDir(), scriptName);
  const outputPath = import_path2.default.join(cacheDir, scriptName.replace(/\.swift$/, ""));
  const needsBuild = !(0, import_fs.existsSync)(outputPath) || (0, import_fs.statSync)(outputPath).mtimeMs < (0, import_fs.statSync)(sourcePath).mtimeMs;
  if (needsBuild) {
    (0, import_fs.mkdirSync)(cacheDir, { recursive: true });
    await execFilePromise("xcrun", ["swiftc", sourcePath, "-o", outputPath], { timeout: 3e4 });
  }
  return outputPath;
}
function batteryFromIOBluetoothEntry(entry) {
  if (typeof entry.single === "number" && entry.single > 0) return entry.single;
  if (typeof entry.combined === "number" && entry.combined > 0) return entry.combined;
  const channels = [entry.left, entry.right, entry.case].filter(
    (v) => typeof v === "number" && v > 0
  );
  if (channels.length === 0) return null;
  return Math.min(...channels);
}
function logBluetoothDebug(label, payload) {
  if (!bluetoothDebugEnabled) {
    return;
  }
  console.log(`[bluetooth] ${label}`);
  if (payload !== void 0) {
    console.dir(payload, { depth: null, colors: true });
  }
}
function normalizeAddress(address) {
  return address.replace(/[^a-fA-F0-9]/g, "").toLowerCase();
}
function parseBatteryLevel(value) {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value !== "string") {
    return null;
  }
  const match = value.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : null;
}
var BLE_REFRESH_INTERVAL_MS = 3e4;
var BluetoothManager = class extends import_events.EventEmitter {
  devices = /* @__PURE__ */ new Map();
  monitoringInterval = null;
  isMonitoring = false;
  bleBatteryByName = /* @__PURE__ */ new Map();
  lastBleRefreshAt = 0;
  constructor() {
    super();
  }
  async runBlueutil(args, options) {
    const command = `blueutil ${args.join(" ")}`;
    logBluetoothDebug(`command: ${command}`);
    try {
      const result = await execFilePromise("blueutil", args, options);
      const stdout = result.stdout.toString();
      const stderr = result.stderr.toString();
      logBluetoothDebug(`stdout: ${command}`, stdout);
      if (stderr) {
        logBluetoothDebug(`stderr: ${command}`, stderr);
      }
      return { stdout, stderr };
    } catch (error) {
      logBluetoothDebug(`error: ${command}`, {
        message: error.message,
        stdout: error.stdout?.toString(),
        stderr: error.stderr?.toString(),
        code: error.code
      });
      throw error;
    }
  }
  toBluetoothDevice(device, connectedOverride) {
    return {
      name: device.name || "Unknown",
      address: device.address || "",
      connected: connectedOverride ?? Boolean(device.connected),
      batteryLevel: parseBatteryLevel(
        device.batteryLevel ?? device.battery ?? device.batteryPercent ?? device.device_batteryLevel ?? device.device_batteryLevelMain
      ),
      type: device.type,
      vendorId: device.vendorId,
      productId: device.productId,
      firmwareVersion: device.firmwareVersion,
      rssi: device.RSSI ?? device.rawRSSI
    };
  }
  mergeDevices(devices) {
    logBluetoothDebug("mergeDevices input", devices);
    for (const device of devices) {
      if (!device.address) {
        continue;
      }
      const normalizedAddress = normalizeAddress(device.address);
      const existingEntry = Array.from(this.devices.entries()).find(([address]) => normalizeAddress(address) === normalizedAddress);
      const existingAddress = existingEntry?.[0] ?? device.address;
      const existing = existingEntry?.[1];
      this.devices.set(existingAddress, {
        ...existing,
        ...device
      });
    }
  }
  getCurrentState() {
    const devices = Array.from(this.devices.values());
    const state = {
      connected: devices.filter((device) => device.connected),
      notConnected: devices.filter((device) => !device.connected),
      timestamp: Date.now()
    };
    logBluetoothDebug("current state", state);
    return state;
  }
  parsePlistData(plistData) {
    const devices = [];
    try {
      if (plistData && plistData["_items"]) {
        for (const item of plistData["_items"]) {
          if (item["device_connected"] !== void 0) {
            devices.push({
              name: item["device_name"] || "Unknown",
              address: item["device_address"] || "",
              connected: item["device_connected"] || false,
              batteryLevel: item["device_batteryLevel"],
              type: item["device_minorType"],
              vendorId: item["device_vendorID"],
              productId: item["device_productID"],
              firmwareVersion: item["device_firmwareVersion"]
            });
          }
        }
      }
    } catch (error) {
      console.error("Error parsing plist data:", error);
    }
    return devices;
  }
  parseTextOutput(output) {
    const devices = [];
    const lines = output.split("\n");
    let currentDevice = null;
    let inConnected = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === "Connected:") {
        inConnected = true;
        continue;
      } else if (trimmed === "Not Connected:") {
        inConnected = false;
        continue;
      }
      if (trimmed && !trimmed.startsWith("Bluetooth:") && !trimmed.startsWith("Address:") && !trimmed.startsWith("Vendor ID:") && !trimmed.startsWith("Product ID:") && !trimmed.startsWith("Firmware Version:") && !trimmed.startsWith("Minor Type:") && !trimmed.startsWith("Battery Level:")) {
        if (currentDevice?.name) {
          devices.push({
            name: currentDevice.name,
            address: currentDevice.address || "",
            batteryLevel: currentDevice.batteryLevel,
            type: currentDevice.type,
            vendorId: currentDevice.vendorId,
            productId: currentDevice.productId,
            firmwareVersion: currentDevice.firmwareVersion,
            connected: currentDevice.connected || false
          });
        }
        currentDevice = {
          name: trimmed.replace(":", ""),
          connected: inConnected,
          address: void 0,
          batteryLevel: null,
          type: void 0
        };
      }
      if (currentDevice) {
        if (trimmed.startsWith("Address:")) {
          currentDevice.address = trimmed.replace("Address:", "").trim();
        } else if (trimmed.startsWith("Battery Level:")) {
          const match = trimmed.match(/(\d+)\s*%/);
          if (match) currentDevice.batteryLevel = parseInt(match[1]);
        } else if (trimmed.startsWith("Minor Type:")) {
          currentDevice.type = trimmed.replace("Minor Type:", "").trim();
        } else if (trimmed.startsWith("Vendor ID:")) {
          currentDevice.vendorId = trimmed.replace("Vendor ID:", "").trim();
        } else if (trimmed.startsWith("Product ID:")) {
          currentDevice.productId = trimmed.replace("Product ID:", "").trim();
        } else if (trimmed.startsWith("Firmware Version:")) {
          currentDevice.firmwareVersion = trimmed.replace("Firmware Version:", "").trim();
        }
      }
    }
    if (currentDevice?.name) {
      devices.push({
        name: currentDevice.name,
        address: currentDevice.address || "",
        batteryLevel: currentDevice.batteryLevel,
        type: currentDevice.type,
        vendorId: currentDevice.vendorId,
        productId: currentDevice.productId,
        firmwareVersion: currentDevice.firmwareVersion,
        connected: currentDevice.connected || false
      });
    }
    return devices;
  }
  parseSystemProfilerJson(output) {
    const parsed = JSON.parse(output);
    const controllers = parsed.SPBluetoothDataType;
    const devices = [];
    if (!Array.isArray(controllers)) {
      return devices;
    }
    for (const controller of controllers) {
      const groups = [
        { items: controller.device_connected, connected: true },
        { items: controller.device_not_connected, connected: false }
      ];
      for (const group of groups) {
        if (!Array.isArray(group.items)) {
          continue;
        }
        for (const item of group.items) {
          for (const [name, details] of Object.entries(item)) {
            devices.push(this.toBluetoothDevice({
              name,
              address: details.device_address,
              connected: group.connected,
              batteryLevel: details.device_batteryLevelMain ?? details.device_batteryLevel,
              type: details.device_minorType,
              vendorId: details.device_vendorID,
              productId: details.device_productID,
              firmwareVersion: details.device_firmwareVersion
            }));
          }
        }
      }
    }
    logBluetoothDebug("parsed system_profiler json devices", devices);
    return devices;
  }
  async mergeSystemProfilerDetails() {
    try {
      logBluetoothDebug("command: system_profiler SPBluetoothDataType -json");
      const { stdout } = await execPromise("system_profiler SPBluetoothDataType -json");
      logBluetoothDebug("stdout: system_profiler SPBluetoothDataType -json", stdout);
      this.mergeDevices(this.parseSystemProfilerJson(stdout));
    } catch (error) {
      logBluetoothDebug("error: system_profiler SPBluetoothDataType -json", error);
    }
  }
  async refreshBleBatteryCache() {
    const now = Date.now();
    if (now - this.lastBleRefreshAt < BLE_REFRESH_INTERVAL_MS && this.bleBatteryByName.size > 0) {
      return;
    }
    this.lastBleRefreshAt = now;
    try {
      const helper = await getSwiftHelper("bluetooth-ble-battery.swift");
      const { stdout } = await execFilePromise(helper, [], { timeout: 8e3 });
      const entries = JSON.parse(stdout.toString());
      logBluetoothDebug("BLE battery entries", entries);
      for (const entry of entries) {
        if (typeof entry.batteryLevel === "number" && entry.batteryLevel > 0 && entry.name) {
          this.bleBatteryByName.set(entry.name.toLowerCase(), entry.batteryLevel);
        }
      }
    } catch (error) {
      logBluetoothDebug("error: bluetooth-ble-battery helper", error);
    }
  }
  async mergeBleBattery() {
    await this.refreshBleBatteryCache();
    if (this.bleBatteryByName.size === 0) return;
    for (const [storedAddress, device] of this.devices.entries()) {
      if (device.batteryLevel !== void 0 && device.batteryLevel !== null) continue;
      if (!device.name) continue;
      const level = this.bleBatteryByName.get(device.name.toLowerCase());
      if (level === void 0) continue;
      this.devices.set(storedAddress, { ...device, batteryLevel: level });
    }
  }
  async mergeIOBluetoothBattery() {
    try {
      const helper = await getSwiftHelper("bluetooth-battery.swift");
      const { stdout } = await execFilePromise(helper, [], { timeout: 5e3 });
      const entries = JSON.parse(stdout.toString());
      logBluetoothDebug("IOBluetooth battery entries", entries);
      const byAddress = /* @__PURE__ */ new Map();
      for (const entry of entries) {
        const level = batteryFromIOBluetoothEntry(entry);
        if (level !== null) {
          byAddress.set(normalizeAddress(entry.address), level);
        }
      }
      if (byAddress.size === 0) return;
      for (const [storedAddress, device] of this.devices.entries()) {
        const level = byAddress.get(normalizeAddress(storedAddress));
        if (level === void 0) continue;
        if (device.batteryLevel === void 0 || device.batteryLevel === null) {
          this.devices.set(storedAddress, { ...device, batteryLevel: level });
        }
      }
    } catch (error) {
      logBluetoothDebug("error: bluetooth-battery helper", error);
    }
  }
  async getDevices() {
    try {
      const { stdout } = await this.runBlueutil(["--paired", "--format", "json"]);
      const parsed = JSON.parse(stdout);
      logBluetoothDebug("parsed blueutil --paired", parsed);
      const devices = Array.isArray(parsed) ? parsed.map((device) => this.toBluetoothDevice(device)) : [];
      this.mergeDevices(devices);
      await this.mergeSystemProfilerDetails();
      await this.mergeIOBluetoothBattery();
      await this.mergeBleBattery();
      return this.getCurrentState();
    } catch (blueutilError) {
      console.error("Error getting devices with blueutil:", blueutilError);
      try {
        let stdout;
        try {
          logBluetoothDebug("command: system_profiler SPBluetoothDataType -xml");
          const result = await execPromise("system_profiler SPBluetoothDataType -xml");
          stdout = result.stdout;
          logBluetoothDebug("stdout: system_profiler SPBluetoothDataType -xml", stdout);
        } catch {
          logBluetoothDebug("command: system_profiler SPBluetoothDataType");
          const result = await execPromise("system_profiler SPBluetoothDataType");
          stdout = result.stdout;
          logBluetoothDebug("stdout: system_profiler SPBluetoothDataType", stdout);
        }
        let devices;
        if (stdout.trim().startsWith("<?xml")) {
          const parsed = parse(stdout);
          logBluetoothDebug("parsed system_profiler plist", parsed);
          devices = this.parsePlistData(parsed);
        } else {
          devices = this.parseTextOutput(stdout);
        }
        this.mergeDevices(devices);
        return this.getCurrentState();
      } catch (error) {
        console.error("Error getting devices:", error);
        this.emit("error", `Failed to get devices: ${error}`);
        return { connected: [], notConnected: [], timestamp: Date.now() };
      }
    }
  }
  async connectDevice(address) {
    try {
      await this.runBlueutil(["--connect", address]);
      this.emit("connection-changed", { address, connected: true });
      return { success: true };
    } catch (error) {
      console.error("Error connecting device:", error);
      this.emit("error", `Failed to connect device: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
  async disconnectDevice(address) {
    try {
      await this.runBlueutil(["--disconnect", address]);
      this.emit("connection-changed", { address, connected: false });
      return { success: true };
    } catch (error) {
      console.error("Error disconnecting device:", error);
      this.emit("error", `Failed to disconnect device: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
  async forgetDevice(address) {
    try {
      await this.runBlueutil(["--unpair", address]);
      this.devices.delete(address);
      await this.getDevices();
      return { success: true };
    } catch (error) {
      console.error("Error forgetting device:", error);
      this.emit("error", `Failed to forget device: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
  async scanForDevices(duration = 5) {
    try {
      this.emit("scan-started");
      const { stdout } = await this.runBlueutil([
        "--inquiry",
        String(duration),
        "--format",
        "json"
      ], {
        timeout: (duration + 5) * 1e3
      });
      const parsed = JSON.parse(stdout);
      logBluetoothDebug("parsed blueutil --inquiry", parsed);
      const devices = Array.isArray(parsed) ? parsed.map((device) => this.toBluetoothDevice(device, false)) : [];
      this.mergeDevices(devices);
      await this.getDevices();
      this.emit("devices-updated", this.getCurrentState());
      return { success: true };
    } catch (error) {
      console.error("Error scanning devices:", error);
      this.emit("error", `Failed to scan: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      this.emit("scan-completed");
    }
  }
  async getBatteryLevel(address) {
    try {
      const { stdout } = await this.runBlueutil(["--info", address, "--format", "json"]);
      const device = JSON.parse(stdout);
      logBluetoothDebug("parsed blueutil --info", device);
      const rawBatteryLevel = device.batteryLevel ?? device.battery ?? device.batteryPercent;
      if (typeof rawBatteryLevel === "number") {
        this.emit("battery-updated", { address, batteryLevel: rawBatteryLevel });
        return rawBatteryLevel;
      }
      const match = stdout.match(/(\d+)%/);
      if (match) {
        const batteryLevel = parseInt(match[1]);
        this.emit("battery-updated", { address, batteryLevel });
        return batteryLevel;
      }
      return null;
    } catch (error) {
      console.error("Error getting battery level:", error);
      return null;
    }
  }
  async startMonitoring(intervalMs = 1e4) {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    await this.getDevices();
    this.monitoringInterval = setInterval(async () => {
      const devices = await this.getDevices();
      this.emit("devices-updated", devices);
    }, intervalMs);
  }
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
  }
};

// src/electron/media-manager.ts
var import_child_process2 = require("child_process");
var import_fs2 = require("fs");
var import_path3 = __toESM(require("path"), 1);
var import_util2 = require("util");
var execFilePromise2 = (0, import_util2.promisify)(import_child_process2.execFile);
var ALLOWED_BUNDLE_IDS = /* @__PURE__ */ new Set([
  "com.spotify.client",
  // Spotify
  "com.apple.Music",
  // Apple Music
  "com.apple.iTunes",
  // Legacy iTunes (still used on older macOS)
  "ru.yandex.desktop.music"
  // Yandex Music desktop app
]);
var isAllowedSource = (bundleId) => typeof bundleId === "string" && ALLOWED_BUNDLE_IDS.has(bundleId);
function numberFrom(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
function stringFrom(value) {
  return typeof value === "string" && value.trim() ? value : null;
}
function normalizeMediaRemoteEntry(info) {
  const title = stringFrom(info.kMRMediaRemoteNowPlayingInfoTitle);
  const artist = stringFrom(info.kMRMediaRemoteNowPlayingInfoArtist);
  const album = stringFrom(info.kMRMediaRemoteNowPlayingInfoAlbum);
  const bundleId = stringFrom(info.__bundleId);
  const pid = numberFrom(info.__pid);
  const displayName = stringFrom(info.__displayName);
  const app5 = displayName ?? stringFrom(info.kMRMediaRemoteNowPlayingClientName) ?? stringFrom(info.kMRMediaRemoteNowPlayingApplicationDisplayName) ?? bundleId;
  const duration = numberFrom(info.kMRMediaRemoteNowPlayingInfoDuration);
  const elapsed = numberFrom(info.kMRMediaRemoteNowPlayingInfoElapsedTime);
  const playbackRate = numberFrom(info.kMRMediaRemoteNowPlayingInfoPlaybackRate);
  const timestamp = numberFrom(info.kMRMediaRemoteNowPlayingInfoTimestamp);
  const artworkBase64 = stringFrom(info.kMRMediaRemoteNowPlayingInfoArtworkData);
  const artworkMimeType = stringFrom(info.kMRMediaRemoteNowPlayingInfoArtworkMIMEType) ?? "image/jpeg";
  return {
    id: `mr:${bundleId ?? "unknown"}:${pid ?? 0}`,
    title,
    artist,
    album,
    app: app5,
    bundleId,
    pid: pid ?? null,
    artworkUrl: null,
    artworkDataUrl: artworkBase64 ? `data:${artworkMimeType};base64,${artworkBase64}` : null,
    duration,
    elapsed,
    fetchedAt: timestamp ? timestamp * 1e3 : Date.now(),
    isPlaying: playbackRate === null ? false : playbackRate > 0,
    source: "media-remote"
  };
}
async function runAppleScript(script) {
  const { stdout } = await execFilePromise2("osascript", ["-e", script], { timeout: 3e3 });
  return stdout.toString().trim();
}
async function getSwiftHelper2(scriptName) {
  const cacheDir = helperCacheDir();
  const sourcePath = import_path3.default.join(helperSourceDir(), scriptName);
  const outputPath = import_path3.default.join(cacheDir, scriptName.replace(/\.swift$/, ""));
  const needsBuild = !(0, import_fs2.existsSync)(outputPath) || (0, import_fs2.statSync)(outputPath).mtimeMs < (0, import_fs2.statSync)(sourcePath).mtimeMs;
  if (needsBuild) {
    (0, import_fs2.mkdirSync)(cacheDir, { recursive: true });
    await execFilePromise2("xcrun", ["swiftc", sourcePath, "-o", outputPath], { timeout: 15e3 });
  }
  return outputPath;
}
async function fetchSpotifyTrack() {
  const script = `
        if application id "com.spotify.client" is running then
            tell application id "com.spotify.client"
                if player state is stopped then return ""
                set trackName to name of current track
                set trackArtist to artist of current track
                set trackAlbum to album of current track
                set trackDuration to duration of current track / 1000
                set trackPosition to player position
                set trackArtwork to artwork url of current track
                set trackPlaying to player state is playing
                return trackName & linefeed & trackArtist & linefeed & trackAlbum & linefeed & trackDuration & linefeed & trackPosition & linefeed & trackArtwork & linefeed & trackPlaying
            end tell
        else
            return ""
        end if
    `;
  try {
    const output = await runAppleScript(script);
    if (!output) return null;
    const [title, artist, album, duration, elapsed, artworkUrl, isPlaying] = output.split("\n");
    return {
      id: "as:com.spotify.client",
      title,
      artist,
      album,
      app: "Spotify",
      bundleId: "com.spotify.client",
      pid: null,
      artworkUrl,
      artworkDataUrl: null,
      duration: numberFrom(duration),
      elapsed: numberFrom(elapsed),
      isPlaying: isPlaying === "true",
      fetchedAt: Date.now(),
      source: "applescript"
    };
  } catch {
    return null;
  }
}
async function fetchMusicTrack() {
  const script = `
        if application id "com.apple.Music" is running then
            tell application id "com.apple.Music"
                if player state is stopped then return ""
                set trackName to name of current track
                set trackArtist to artist of current track
                set trackAlbum to album of current track
                set trackDuration to duration of current track
                set trackPosition to player position
                set trackPlaying to player state is playing
                return trackName & linefeed & trackArtist & linefeed & trackAlbum & linefeed & trackDuration & linefeed & trackPosition & linefeed & trackPlaying
            end tell
        else
            return ""
        end if
    `;
  try {
    const output = await runAppleScript(script);
    if (!output) return null;
    const [title, artist, album, duration, elapsed, isPlaying] = output.split("\n");
    return {
      id: "as:com.apple.Music",
      title,
      artist,
      album,
      app: "Music",
      bundleId: "com.apple.Music",
      pid: null,
      artworkUrl: null,
      artworkDataUrl: null,
      duration: numberFrom(duration),
      elapsed: numberFrom(elapsed),
      isPlaying: isPlaying === "true",
      fetchedAt: Date.now(),
      source: "applescript"
    };
  } catch {
    return null;
  }
}
var APPLESCRIPT_COMMANDS = {
  "play-pause": "playpause",
  next: "next track",
  previous: "previous track"
};
var APPLESCRIPT_CONTROLLERS = {
  "com.apple.Music": async (action) => {
    await runAppleScript(`tell application id "com.apple.Music" to ${APPLESCRIPT_COMMANDS[action]}`);
  },
  "com.spotify.client": async (action) => {
    await runAppleScript(`tell application id "com.spotify.client" to ${APPLESCRIPT_COMMANDS[action]}`);
  }
};
var MediaManager = class {
  async getAllNowPlaying() {
    try {
      const swiftPath = import_path3.default.join(helperSourceDir(), "now-playing.swift");
      const { stdout } = await execFilePromise2("swift", [swiftPath], { timeout: 7e3 });
      const entries = JSON.parse(stdout.toString());
      const tracks = entries.map(normalizeMediaRemoteEntry).filter((track) => isAllowedSource(track.bundleId));
      if (tracks.length > 0) {
        return tracks;
      }
    } catch (error) {
      console.error("Failed to read MediaRemote now playing:", error);
    }
    for (const fetcher of [fetchSpotifyTrack, fetchMusicTrack]) {
      const track = await fetcher();
      if (track && (track.title || track.artist)) {
        return [track];
      }
    }
    return [];
  }
  async control(action, bundleId) {
    try {
      if (bundleId && bundleId in APPLESCRIPT_CONTROLLERS) {
        await APPLESCRIPT_CONTROLLERS[bundleId](action);
        return { success: true };
      }
      const helper = await getSwiftHelper2("media-key.swift");
      await execFilePromise2(helper, [action], { timeout: 2500 });
      return { success: true };
    } catch (error) {
      console.error("Failed to send media key:", error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }
};

// src/electron/system-monitor.ts
var import_child_process3 = require("child_process");
var import_fs3 = require("fs");
var import_os = __toESM(require("os"), 1);
var import_util3 = require("util");
var execFileAsync = (0, import_util3.promisify)(import_child_process3.execFile);
var POSIX_ENV = { ...process.env, LC_NUMERIC: "C", LC_CTYPE: "en_US.UTF-8" };
function extractAppPath(command) {
  const match = command.match(/^(.*?\.app)\//);
  return match ? match[1] : null;
}
function appNameFromPath(appPath) {
  const tail = appPath.split("/").filter(Boolean).pop() ?? appPath;
  return tail.replace(/\.app$/, "");
}
var toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};
var getCpuSnapshot = () => {
  return import_os.default.cpus().reduce(
    (snapshot, cpu) => {
      const total = Object.values(cpu.times).reduce((sum, value) => sum + value, 0);
      return {
        idle: snapshot.idle + cpu.times.idle,
        total: snapshot.total + total
      };
    },
    { idle: 0, total: 0 }
  );
};
var SystemMonitor = class {
  previousCpu = getCpuSnapshot();
  previousNetwork = null;
  projectRoot = (() => {
    const exe = process.execPath;
    const appMatch = exe.match(/^(.*?\.app)\//);
    if (appMatch) {
      return appMatch[1];
    }
    return process.cwd();
  })();
  appName = this.projectRoot.split("/").filter(Boolean).pop()?.replace(/\.app$/, "") ?? "app";
  async getMetrics() {
    const [disk, network, project] = await Promise.all([
      this.getDiskMetrics(),
      this.getNetworkMetrics(),
      this.getProjectMetrics()
    ]);
    return {
      timestamp: Date.now(),
      cpu: this.getCpuMetrics(),
      memory: this.getMemoryMetrics(),
      disk,
      network,
      project
    };
  }
  getCpuMetrics() {
    const current = getCpuSnapshot();
    const idleDelta = current.idle - this.previousCpu.idle;
    const totalDelta = current.total - this.previousCpu.total;
    this.previousCpu = current;
    const percent = totalDelta > 0 ? (totalDelta - idleDelta) / totalDelta * 100 : 0;
    return {
      percent: Math.min(Math.max(percent, 0), 100),
      cores: import_os.default.cpus().length,
      loadAverage: import_os.default.loadavg()
    };
  }
  getMemoryMetrics() {
    const totalBytes = import_os.default.totalmem();
    const freeBytes = import_os.default.freemem();
    const usedBytes = totalBytes - freeBytes;
    return {
      totalBytes,
      usedBytes,
      freeBytes,
      percent: totalBytes > 0 ? usedBytes / totalBytes * 100 : 0
    };
  }
  async getDiskMetrics() {
    const target = (0, import_fs3.existsSync)("/System/Volumes/Data") ? "/System/Volumes/Data" : "/";
    try {
      const { stdout } = await execFileAsync("df", ["-k", target], { env: POSIX_ENV });
      const line = stdout.trim().split("\n")[1];
      const parts = line?.trim().split(/\s+/) ?? [];
      const totalBytes = toNumber(parts[1]) * 1024;
      const usedBytes = toNumber(parts[2]) * 1024;
      const freeBytes = toNumber(parts[3]) * 1024;
      return {
        mount: "/",
        totalBytes,
        usedBytes,
        freeBytes,
        percent: totalBytes > 0 ? usedBytes / totalBytes * 100 : 0
      };
    } catch (error) {
      console.error("[SystemMonitor] df failed:", error);
      return {
        mount: "/",
        totalBytes: 0,
        usedBytes: 0,
        freeBytes: 0,
        percent: 0
      };
    }
  }
  async getNetworkMetrics() {
    const current = await this.readNetworkTotals();
    const previous = this.previousNetwork;
    this.previousNetwork = current;
    if (!previous) {
      return {
        rxBytes: current.rxBytes,
        txBytes: current.txBytes,
        rxBytesPerSecond: 0,
        txBytesPerSecond: 0
      };
    }
    const elapsedSeconds = Math.max((current.timestamp - previous.timestamp) / 1e3, 1);
    return {
      rxBytes: current.rxBytes,
      txBytes: current.txBytes,
      rxBytesPerSecond: Math.max((current.rxBytes - previous.rxBytes) / elapsedSeconds, 0),
      txBytesPerSecond: Math.max((current.txBytes - previous.txBytes) / elapsedSeconds, 0)
    };
  }
  async readNetworkTotals() {
    try {
      const { stdout } = await execFileAsync("netstat", ["-ibn"], { env: POSIX_ENV });
      const totals = stdout.trim().split("\n").slice(1).reduce(
        (sum, line) => {
          const parts = line.trim().split(/\s+/);
          const name = parts[0] ?? "";
          const network = parts[2] ?? "";
          if (!network.startsWith("<Link#") || name === "lo0" || name.endsWith("*")) {
            return sum;
          }
          return {
            rxBytes: sum.rxBytes + toNumber(parts[6]),
            txBytes: sum.txBytes + toNumber(parts[9])
          };
        },
        { rxBytes: 0, txBytes: 0 }
      );
      return {
        ...totals,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error("[SystemMonitor] netstat failed:", error);
      return {
        rxBytes: 0,
        txBytes: 0,
        timestamp: Date.now()
      };
    }
  }
  async getProjectMetrics() {
    const processes = await this.getProcessList();
    const childrenByParent = /* @__PURE__ */ new Map();
    for (const item of processes) {
      const children2 = childrenByParent.get(item.ppid) ?? [];
      children2.push(item);
      childrenByParent.set(item.ppid, children2);
    }
    const projectProcesses = [];
    const seen = /* @__PURE__ */ new Set();
    const visit = (pid) => {
      if (seen.has(pid)) {
        return;
      }
      seen.add(pid);
      const processInfo = processes.find((item) => item.pid === pid);
      if (processInfo) {
        projectProcesses.push(processInfo);
      }
      for (const child of childrenByParent.get(pid) ?? []) {
        visit(child.pid);
      }
    };
    visit(process.pid);
    for (const item of processes) {
      if (this.isProjectProcess(item)) {
        visit(item.pid);
      }
    }
    const measuredProcesses = projectProcesses.filter((item) => !this.isCollectorProcess(item)).filter((item, index, source) => source.findIndex((match) => match.pid === item.pid) === index);
    const cpuPercent = measuredProcesses.reduce((sum, item) => sum + item.cpuPercent, 0);
    const memoryBytes = measuredProcesses.reduce((sum, item) => sum + item.memoryBytes, 0);
    const totalMemory = import_os.default.totalmem();
    return {
      pid: process.pid,
      processCount: measuredProcesses.length,
      cpuPercent,
      memoryPercent: totalMemory > 0 ? memoryBytes / totalMemory * 100 : 0,
      memoryBytes,
      processes: measuredProcesses.sort((left, right) => right.memoryBytes - left.memoryBytes).slice(0, 8).map((item) => ({
        pid: item.pid,
        cpuPercent: item.cpuPercent,
        memoryBytes: item.memoryBytes,
        name: item.name,
        role: item.role
      }))
    };
  }
  isProjectProcess(item) {
    const processText = item.command.toLowerCase();
    const root = this.projectRoot.toLowerCase();
    const appSupportPath = `/application support/${this.appName.toLowerCase()}`;
    const projectToolPaths = [
      `${root}/node_modules/.pnpm/electron`,
      `${root}/node_modules/.bin/electron`,
      `${root}/node_modules/.pnpm/vite`,
      `${root}/node_modules/.bin/vite`
    ];
    const isPackaged = root.endsWith(".app");
    return item.pid === process.pid || isPackaged && processText.includes(root) || processText.includes(`--app-path=${root}`) || processText.includes(appSupportPath) || projectToolPaths.some((toolPath) => processText.includes(toolPath));
  }
  isCollectorProcess(item) {
    const processText = `${item.name} ${item.command}`.toLowerCase();
    return item.ppid === process.pid && (processText.includes("ps -axo pid,ppid,%cpu,rss,comm,args") || processText.includes("netstat") || processText.includes("df -k /"));
  }
  async getProcessList() {
    try {
      const { stdout } = await execFileAsync("ps", ["-axo", "pid,ppid,user,%cpu,rss,comm,args"], { env: POSIX_ENV });
      const lines = stdout.trim().split("\n");
      const parsed = lines.slice(1).map((line) => {
        const match = line.match(/^\s*(\d+)\s+(\d+)\s+(\S+)\s+([\d.]+)\s+(\d+)\s+(\S+)\s+(.*)$/);
        if (!match) {
          return null;
        }
        const commandPath = match[6] ?? "";
        const command = match[7] ?? commandPath;
        const name = commandPath.split("/").filter(Boolean).pop() ?? command.split(/\s+/)[0] ?? "process";
        return {
          pid: toNumber(match[1]),
          ppid: toNumber(match[2]),
          user: match[3] ?? "",
          cpuPercent: toNumber(match[4]),
          memoryBytes: toNumber(match[5]) * 1024,
          name,
          command,
          role: this.getProcessRole(name, command)
        };
      }).filter((item) => Boolean(item));
      return parsed;
    } catch (error) {
      console.error("[SystemMonitor] ps failed:", error);
      return [];
    }
  }
  async listAllProcesses() {
    const processes = await this.getProcessList();
    const currentUser = import_os.default.userInfo().username;
    return processes.map((item) => {
      const appPath = extractAppPath(item.command);
      return {
        pid: item.pid,
        ppid: item.ppid,
        user: item.user,
        isOwnUser: item.user === currentUser,
        cpuPercent: item.cpuPercent,
        memoryBytes: item.memoryBytes,
        name: item.name,
        command: item.command,
        appPath,
        appName: appPath ? appNameFromPath(appPath) : null
      };
    });
  }
  killProcess(pid, signal = "SIGTERM") {
    if (!Number.isInteger(pid) || pid <= 1) {
      return { success: false, error: "Invalid PID", code: "EINVAL" };
    }
    try {
      process.kill(pid, signal);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error?.message ?? String(error),
        code: error?.code
      };
    }
  }
  getProcessRole(name, command) {
    const processText = `${name} ${command}`.toLowerCase();
    if (processText.includes("--type=renderer")) return "Renderer";
    if (processText.includes("--type=gpu-process")) return "GPU";
    if (processText.includes("networkservice")) return "Network";
    if (processText.includes("vite")) return "Dev server";
    if (processText.includes("electron/cli")) return "Electron CLI";
    if (processText.includes("electron.app/contents/macos/electron")) return "Main";
    if (processText.includes("node")) return "Node";
    return "Helper";
  }
};

// src/electron/ssh-config-parser.ts
var import_promises = require("fs/promises");
var import_os2 = __toESM(require("os"), 1);
var import_path4 = __toESM(require("path"), 1);
var CONFIG_PATH = import_path4.default.join(import_os2.default.homedir(), ".ssh", "config");
var KNOWN_HOSTS_PATH = import_path4.default.join(import_os2.default.homedir(), ".ssh", "known_hosts");
var expandHome = (value) => value.startsWith("~") ? import_path4.default.join(import_os2.default.homedir(), value.slice(1)) : value;
var parseConfig = (text) => {
  const blocks = [];
  let current = null;
  for (const rawLine of text.split("\n")) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const [keyword, ...rest] = line.split(/\s+/);
    if (!keyword) continue;
    const value = rest.join(" ");
    const lowerKey = keyword.toLowerCase();
    if (lowerKey === "host") {
      current = { patterns: rest, options: /* @__PURE__ */ new Map() };
      blocks.push(current);
    } else if (current && value) {
      current.options.set(lowerKey, value);
    }
  }
  return blocks;
};
var isConcreteAlias = (alias) => !alias.includes("*") && !alias.includes("?") && !alias.startsWith("!");
var blockToHosts = (block) => {
  const hostname = block.options.get("hostname");
  const user = block.options.get("user");
  const portRaw = block.options.get("port");
  const identityFile = block.options.get("identityfile");
  const port = portRaw ? Number(portRaw) : void 0;
  return block.patterns.filter(isConcreteAlias).map((alias) => ({
    id: `config:${alias}`,
    alias,
    hostname: hostname ?? alias,
    user,
    port: Number.isFinite(port) ? port : void 0,
    identityFile: identityFile ? expandHome(identityFile) : void 0,
    source: "config"
  }));
};
var parseKnownHostName = (rawName) => {
  if (!rawName || rawName.startsWith("|")) return null;
  if (rawName.includes("*") || rawName.includes("?")) return null;
  const bracketMatch = rawName.match(/^\[([^\]]+)\]:(\d+)$/);
  if (bracketMatch) {
    return { hostname: bracketMatch[1], port: Number(bracketMatch[2]) };
  }
  return { hostname: rawName };
};
var parseKnownHosts = (text) => {
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || line.startsWith("|")) continue;
    const [hostField] = line.split(/\s+/);
    if (!hostField) continue;
    for (const candidate of hostField.split(",")) {
      const parsed = parseKnownHostName(candidate);
      if (!parsed) continue;
      const key = parsed.port ? `${parsed.hostname}:${parsed.port}` : parsed.hostname;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push({
        id: `known:${key}`,
        alias: key,
        hostname: parsed.hostname,
        port: parsed.port,
        source: "known_hosts"
      });
    }
  }
  return result;
};
var safeRead = async (file) => {
  try {
    return await (0, import_promises.readFile)(file, "utf8");
  } catch {
    return null;
  }
};
async function listFileBasedHosts() {
  const [configText, knownHostsText] = await Promise.all([
    safeRead(CONFIG_PATH),
    safeRead(KNOWN_HOSTS_PATH)
  ]);
  const configHosts = configText ? parseConfig(configText).flatMap(blockToHosts) : [];
  const knownHosts = knownHostsText ? parseKnownHosts(knownHostsText) : [];
  const configHostnames = new Set(
    configHosts.flatMap((host) => [host.alias.toLowerCase(), host.hostname.toLowerCase()])
  );
  const knownOnly = knownHosts.filter(
    (host) => !configHostnames.has(host.hostname.toLowerCase()) && !configHostnames.has(host.alias.toLowerCase())
  );
  return [...configHosts, ...knownOnly];
}

// src/electron/db.ts
var import_fs4 = require("fs");
var import_promises2 = require("fs/promises");
var import_module = require("module");
var import_path5 = __toESM(require("path"), 1);
var import_electron2 = require("electron");
var import_sql = __toESM(require("sql.js"), 1);
var DB_TABLE_GROUPS = {
  sshHosts: ["saved_hosts", "host_overrides", "port_forwards"],
  rdpHosts: ["rdp_hosts"],
  mediaHistory: ["media_history"],
  mediaStats: ["media_artist_stats", "media_track_stats"]
};
var require2 = (0, import_module.createRequire)(__cjs_meta_url);
var DB_FILENAME = "ebala.db";
var db = null;
var dbPath = null;
var persistQueue = Promise.resolve();
var existingColumns = (database, table) => {
  const stmt = database.prepare(`PRAGMA table_info(${table})`);
  const names = /* @__PURE__ */ new Set();
  try {
    while (stmt.step()) {
      const row = stmt.getAsObject();
      if (row.name) names.add(row.name);
    }
  } finally {
    stmt.free();
  }
  return names;
};
var addColumnIfMissing = (database, table, column, definition) => {
  const columns = existingColumns(database, table);
  if (!columns.has(column)) {
    database.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
};
var runMigrations = (database) => {
  database.exec(`
        CREATE TABLE IF NOT EXISTS saved_hosts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            label TEXT NOT NULL,
            hostname TEXT NOT NULL,
            port INTEGER NOT NULL DEFAULT 22,
            username TEXT NOT NULL,
            auth_method TEXT NOT NULL DEFAULT 'password',
            password_encrypted BLOB,
            identity_file TEXT,
            color TEXT,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_saved_hosts_label ON saved_hosts (label);

        CREATE TABLE IF NOT EXISTS host_overrides (
            host_id TEXT PRIMARY KEY,
            custom_alias TEXT,
            color TEXT,
            notes TEXT,
            hidden INTEGER NOT NULL DEFAULT 0,
            username TEXT,
            password_encrypted BLOB,
            auth_method TEXT,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_host_overrides_hidden ON host_overrides (hidden);

        CREATE TABLE IF NOT EXISTS port_forwards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            host_id TEXT NOT NULL,
            type TEXT NOT NULL CHECK (type IN ('local', 'remote')),
            bind_address TEXT,
            bind_port INTEGER NOT NULL,
            target_host TEXT NOT NULL,
            target_port INTEGER NOT NULL,
            label TEXT,
            enabled INTEGER NOT NULL DEFAULT 1,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_port_forwards_host ON port_forwards (host_id);

        CREATE TABLE IF NOT EXISTS media_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            artist TEXT,
            album TEXT,
            bundle_id TEXT,
            app_name TEXT,
            artwork_url TEXT,
            artwork_data_url TEXT,
            duration_seconds INTEGER,
            listened_seconds INTEGER NOT NULL DEFAULT 0,
            started_at INTEGER NOT NULL,
            ended_at INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_media_history_started ON media_history (started_at DESC);
        CREATE INDEX IF NOT EXISTS idx_media_history_artist ON media_history (artist);

        -- Cumulative per-artist totals \u2014 survive media_history purges.
        CREATE TABLE IF NOT EXISTS media_artist_stats (
            artist TEXT PRIMARY KEY,
            total_seconds INTEGER NOT NULL DEFAULT 0,
            total_plays INTEGER NOT NULL DEFAULT 0,
            first_played_at INTEGER NOT NULL,
            last_played_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_media_artist_stats_total ON media_artist_stats (total_seconds DESC);

        -- Cumulative per-track totals (keyed by artist + title) \u2014 also survive purges.
        CREATE TABLE IF NOT EXISTS media_track_stats (
            artist TEXT NOT NULL DEFAULT '',
            title TEXT NOT NULL,
            album TEXT,
            artwork_url TEXT,
            artwork_data_url TEXT,
            total_seconds INTEGER NOT NULL DEFAULT 0,
            total_plays INTEGER NOT NULL DEFAULT 0,
            first_played_at INTEGER NOT NULL,
            last_played_at INTEGER NOT NULL,
            PRIMARY KEY (artist, title)
        );
        CREATE INDEX IF NOT EXISTS idx_media_track_stats_artist ON media_track_stats (artist, total_seconds DESC);
        CREATE INDEX IF NOT EXISTS idx_media_track_stats_total ON media_track_stats (total_seconds DESC);

        CREATE TABLE IF NOT EXISTS rdp_hosts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            label TEXT NOT NULL,
            hostname TEXT NOT NULL,
            port INTEGER NOT NULL DEFAULT 3389,
            username TEXT NOT NULL,
            password_encrypted BLOB,
            domain TEXT,
            color TEXT,
            notes TEXT,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_rdp_hosts_label ON rdp_hosts (label);
    `);
  addColumnIfMissing(database, "host_overrides", "username", "TEXT");
  addColumnIfMissing(database, "host_overrides", "password_encrypted", "BLOB");
  addColumnIfMissing(database, "host_overrides", "auth_method", "TEXT");
  addColumnIfMissing(database, "rdp_hosts", "extra_args", "TEXT");
  const hasArtistRows = (database.exec("SELECT 1 FROM media_artist_stats LIMIT 1")[0]?.values.length ?? 0) > 0;
  const hasHistoryRows = (database.exec("SELECT 1 FROM media_history WHERE listened_seconds >= 5 LIMIT 1")[0]?.values.length ?? 0) > 0;
  if (!hasArtistRows && hasHistoryRows) {
    database.exec(`
            INSERT INTO media_artist_stats (artist, total_seconds, total_plays, first_played_at, last_played_at)
            SELECT artist, SUM(listened_seconds), COUNT(*), MIN(started_at), MAX(started_at)
            FROM media_history
            WHERE artist IS NOT NULL AND artist != '' AND listened_seconds >= 5
            GROUP BY artist;

            INSERT INTO media_track_stats (artist, title, album, artwork_url, artwork_data_url,
                                           total_seconds, total_plays, first_played_at, last_played_at)
            SELECT
                COALESCE(artist, ''),
                title,
                MAX(album),
                MAX(artwork_url),
                MAX(artwork_data_url),
                SUM(listened_seconds),
                COUNT(*),
                MIN(started_at),
                MAX(started_at)
            FROM media_history
            WHERE title IS NOT NULL AND title != '' AND listened_seconds >= 5
            GROUP BY COALESCE(artist, ''), title;
        `);
  }
};
async function openWithFallback(SQL, filePath) {
  if (!(0, import_fs4.existsSync)(filePath)) return new SQL.Database();
  const buffer = await (0, import_promises2.readFile)(filePath);
  try {
    const candidate = new SQL.Database(buffer);
    candidate.exec("PRAGMA quick_check");
    return candidate;
  } catch (err) {
    const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const quarantine = `${filePath}.corrupted-${stamp}`;
    try {
      await (0, import_promises2.rename)(filePath, quarantine);
    } catch {
    }
    console.error(`[db] image malformed (${err?.message ?? err}); quarantined to ${quarantine}, starting fresh`);
    return new SQL.Database();
  }
}
async function initDb() {
  if (db) return db;
  const sqlJsDistPath = import_path5.default.dirname(require2.resolve("sql.js/dist/sql-wasm.js"));
  const SQL = await (0, import_sql.default)({
    locateFile: (file) => import_path5.default.join(sqlJsDistPath, file)
  });
  const userData = import_electron2.app.getPath("userData");
  if (!(0, import_fs4.existsSync)(userData)) {
    (0, import_fs4.mkdirSync)(userData, { recursive: true });
  }
  dbPath = import_path5.default.join(userData, DB_FILENAME);
  if ((0, import_fs4.existsSync)(dbPath)) {
    db = await openWithFallback(SQL, dbPath);
  } else {
    db = new SQL.Database();
  }
  runMigrations(db);
  await persist();
  return db;
}
function getDb() {
  if (!db) throw new Error("Database not initialized. Call initDb() first.");
  return db;
}
function persist() {
  persistQueue = persistQueue.then(async () => {
    if (!db || !dbPath) return;
    const data = db.export();
    const tmpPath = `${dbPath}.tmp`;
    try {
      await (0, import_promises2.writeFile)(tmpPath, data);
      await (0, import_promises2.rename)(tmpPath, dbPath);
    } catch (err) {
      try {
        await (0, import_promises2.unlink)(tmpPath);
      } catch {
      }
      throw err;
    }
  });
  return persistQueue;
}
async function closeDb() {
  await persistQueue;
  if (db) {
    db.close();
    db = null;
  }
}
function countRows(database, tables) {
  let total = 0;
  for (const table of tables) {
    const result = database.exec(`SELECT COUNT(*) FROM ${table}`)[0];
    const value = result?.values?.[0]?.[0];
    total += typeof value === "number" ? value : Number(value ?? 0);
  }
  return total;
}
async function getDbStats() {
  const database = getDb();
  await persistQueue;
  const sizeBytes = dbPath && (0, import_fs4.existsSync)(dbPath) ? (0, import_fs4.statSync)(dbPath).size : 0;
  const groups = Object.fromEntries(
    Object.entries(DB_TABLE_GROUPS).map(
      ([key, tables]) => [key, { rowCount: countRows(database, tables), tables: [...tables] }]
    )
  );
  return { sizeBytes, path: dbPath ?? "", groups };
}
async function clearTables(groups) {
  const database = getDb();
  const tables = /* @__PURE__ */ new Set();
  for (const group of groups) {
    const list = DB_TABLE_GROUPS[group];
    if (!list) continue;
    for (const table of list) tables.add(table);
  }
  if (tables.size > 0) {
    database.exec("BEGIN TRANSACTION");
    try {
      for (const table of tables) {
        database.exec(`DELETE FROM ${table}`);
      }
      database.exec("COMMIT");
      database.exec("VACUUM");
    } catch (error) {
      database.exec("ROLLBACK");
      throw error;
    }
    await persist();
  }
  return getDbStats();
}

// src/electron/credential-store.ts
var import_electron3 = require("electron");
function isCredentialEncryptionAvailable() {
  return import_electron3.safeStorage.isEncryptionAvailable();
}
function encryptPassword(plain) {
  if (!plain) return null;
  if (!import_electron3.safeStorage.isEncryptionAvailable()) {
    throw new Error("Credential encryption is not available on this system");
  }
  return import_electron3.safeStorage.encryptString(plain);
}
function decryptPassword(blob) {
  if (!blob || blob.length === 0) return null;
  if (!import_electron3.safeStorage.isEncryptionAvailable()) {
    throw new Error("Credential encryption is not available on this system");
  }
  return import_electron3.safeStorage.decryptString(blob);
}

// src/electron/saved-hosts.ts
var rowToHost = (row) => ({
  id: row.id,
  label: row.label,
  hostname: row.hostname,
  port: row.port,
  username: row.username,
  authMethod: row.auth_method,
  hasPassword: Boolean(row.password_encrypted && row.password_encrypted.length > 0),
  identityFile: row.identity_file ?? void 0,
  color: row.color ?? void 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});
var selectAll = `
    SELECT id, label, hostname, port, username, auth_method,
           password_encrypted, identity_file, color, created_at, updated_at
    FROM saved_hosts
    ORDER BY label COLLATE NOCASE ASC
`;
var selectById = `
    SELECT id, label, hostname, port, username, auth_method,
           password_encrypted, identity_file, color, created_at, updated_at
    FROM saved_hosts WHERE id = $id
`;
var rowsFromStmt = (sql, params = []) => {
  const db2 = getDb();
  const stmt = db2.prepare(sql);
  try {
    stmt.bind(params);
    const result = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject());
    }
    return result;
  } finally {
    stmt.free();
  }
};
function listSavedHosts() {
  return rowsFromStmt(selectAll).map(rowToHost);
}
function getSavedHost(id) {
  const rows = rowsFromStmt(selectById, { $id: id });
  return rows[0] ? rowToHost(rows[0]) : null;
}
async function createSavedHost(input) {
  const db2 = getDb();
  const now = Date.now();
  const encrypted = input.password ? encryptPassword(input.password) : null;
  const port = input.port ?? 22;
  db2.run(
    `INSERT INTO saved_hosts
            (label, hostname, port, username, auth_method, password_encrypted, identity_file, color, created_at, updated_at)
         VALUES ($label, $hostname, $port, $username, $auth, $pwd, $identity, $color, $created, $updated)`,
    {
      $label: input.label,
      $hostname: input.hostname,
      $port: port,
      $username: input.username,
      $auth: input.authMethod,
      $pwd: encrypted ?? null,
      $identity: input.identityFile ?? null,
      $color: input.color ?? null,
      $created: now,
      $updated: now
    }
  );
  const result = db2.exec("SELECT last_insert_rowid() AS id");
  const id = Number(result[0]?.values[0]?.[0] ?? 0);
  await persist();
  return getSavedHost(id);
}
async function updateSavedHost(id, input) {
  const db2 = getDb();
  const now = Date.now();
  const port = input.port ?? 22;
  const shouldUpdatePassword = input.password !== void 0 && input.password !== null;
  const newEncrypted = shouldUpdatePassword && input.password !== "" ? encryptPassword(input.password) : null;
  if (shouldUpdatePassword) {
    db2.run(
      `UPDATE saved_hosts SET
                label=$label, hostname=$hostname, port=$port, username=$username,
                auth_method=$auth, password_encrypted=$pwd, identity_file=$identity,
                color=$color, updated_at=$updated
             WHERE id=$id`,
      {
        $id: id,
        $label: input.label,
        $hostname: input.hostname,
        $port: port,
        $username: input.username,
        $auth: input.authMethod,
        $pwd: newEncrypted ?? null,
        $identity: input.identityFile ?? null,
        $color: input.color ?? null,
        $updated: now
      }
    );
  } else {
    db2.run(
      `UPDATE saved_hosts SET
                label=$label, hostname=$hostname, port=$port, username=$username,
                auth_method=$auth, identity_file=$identity, color=$color, updated_at=$updated
             WHERE id=$id`,
      {
        $id: id,
        $label: input.label,
        $hostname: input.hostname,
        $port: port,
        $username: input.username,
        $auth: input.authMethod,
        $identity: input.identityFile ?? null,
        $color: input.color ?? null,
        $updated: now
      }
    );
  }
  await persist();
  const updated = getSavedHost(id);
  if (!updated) throw new Error(`Saved host ${id} not found after update`);
  return updated;
}
async function deleteSavedHost(id) {
  const db2 = getDb();
  db2.run("DELETE FROM saved_hosts WHERE id = $id", { $id: id });
  await persist();
  return true;
}
function savedHostToSshHost(saved) {
  return {
    id: `saved:${saved.id}`,
    alias: saved.label,
    hostname: saved.hostname,
    user: saved.username,
    port: saved.port,
    identityFile: saved.identityFile,
    source: "saved",
    savedId: saved.id,
    authMethod: saved.authMethod,
    color: saved.color
  };
}
function getSavedHostPassword(id) {
  const rows = rowsFromStmt(selectById, { $id: id });
  const row = rows[0];
  if (!row || !row.password_encrypted || row.password_encrypted.length === 0) return null;
  return decryptPassword(Buffer.from(row.password_encrypted));
}

// src/electron/host-overrides.ts
var rowToOverride = (row) => ({
  hostId: row.host_id,
  customAlias: row.custom_alias,
  color: row.color,
  notes: row.notes,
  hidden: row.hidden === 1,
  username: row.username,
  hasPassword: Boolean(row.password_encrypted && row.password_encrypted.length > 0),
  authMethod: row.auth_method,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});
var queryRows = (sql, params = []) => {
  const db2 = getDb();
  const stmt = db2.prepare(sql);
  try {
    stmt.bind(params);
    const out = [];
    while (stmt.step()) out.push(stmt.getAsObject());
    return out;
  } finally {
    stmt.free();
  }
};
function listOverrides() {
  return queryRows("SELECT * FROM host_overrides").map(rowToOverride);
}
function getOverride(hostId) {
  const rows = queryRows("SELECT * FROM host_overrides WHERE host_id = $id", { $id: hostId });
  return rows[0] ? rowToOverride(rows[0]) : null;
}
function getOverridePassword(hostId) {
  const rows = queryRows(
    "SELECT password_encrypted FROM host_overrides WHERE host_id = $id",
    { $id: hostId }
  );
  const row = rows[0];
  if (!row || !row.password_encrypted || row.password_encrypted.length === 0) return null;
  return decryptPassword(Buffer.from(row.password_encrypted));
}
async function upsertOverride(hostId, patch) {
  const db2 = getDb();
  const now = Date.now();
  const existing = getOverride(hostId);
  const passwordShouldUpdate = patch.password !== void 0;
  const passwordEncrypted = passwordShouldUpdate && patch.password ? encryptPassword(patch.password) : null;
  if (existing) {
    db2.run(
      `UPDATE host_overrides SET
                custom_alias = $alias,
                color = $color,
                notes = $notes,
                hidden = $hidden,
                username = $username,
                auth_method = $auth,
                ${passwordShouldUpdate ? "password_encrypted = $pwd," : ""}
                updated_at = $updated
             WHERE host_id = $id`,
      {
        $id: hostId,
        $alias: patch.customAlias !== void 0 ? patch.customAlias : existing.customAlias,
        $color: patch.color !== void 0 ? patch.color : existing.color,
        $notes: patch.notes !== void 0 ? patch.notes : existing.notes,
        $hidden: (patch.hidden !== void 0 ? patch.hidden : existing.hidden) ? 1 : 0,
        $username: patch.username !== void 0 ? patch.username : existing.username,
        $auth: patch.authMethod !== void 0 ? patch.authMethod : existing.authMethod,
        ...passwordShouldUpdate ? { $pwd: passwordEncrypted ?? null } : {},
        $updated: now
      }
    );
  } else {
    db2.run(
      `INSERT INTO host_overrides
                (host_id, custom_alias, color, notes, hidden,
                 username, password_encrypted, auth_method,
                 created_at, updated_at)
             VALUES ($id, $alias, $color, $notes, $hidden,
                     $username, $pwd, $auth,
                     $created, $updated)`,
      {
        $id: hostId,
        $alias: patch.customAlias ?? null,
        $color: patch.color ?? null,
        $notes: patch.notes ?? null,
        $hidden: patch.hidden ? 1 : 0,
        $username: patch.username ?? null,
        $pwd: passwordEncrypted ?? null,
        $auth: patch.authMethod ?? null,
        $created: now,
        $updated: now
      }
    );
  }
  await persist();
  return getOverride(hostId);
}
async function deleteOverride(hostId) {
  const db2 = getDb();
  db2.run("DELETE FROM host_overrides WHERE host_id = $id", { $id: hostId });
  await persist();
}

// src/electron/port-forwards.ts
var rowToForward = (row) => ({
  id: row.id,
  hostId: row.host_id,
  type: row.type,
  bindAddress: row.bind_address,
  bindPort: row.bind_port,
  targetHost: row.target_host,
  targetPort: row.target_port,
  label: row.label,
  enabled: row.enabled === 1,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});
var queryRows2 = (sql, params = []) => {
  const db2 = getDb();
  const stmt = db2.prepare(sql);
  try {
    stmt.bind(params);
    const out = [];
    while (stmt.step()) out.push(stmt.getAsObject());
    return out;
  } finally {
    stmt.free();
  }
};
function listPortForwards(hostId) {
  return queryRows2(
    "SELECT * FROM port_forwards WHERE host_id = $host ORDER BY id ASC",
    { $host: hostId }
  ).map(rowToForward);
}
function listAllPortForwards() {
  return queryRows2("SELECT * FROM port_forwards ORDER BY host_id, id").map(rowToForward);
}
async function createPortForward(hostId, input) {
  const db2 = getDb();
  const now = Date.now();
  db2.run(
    `INSERT INTO port_forwards
            (host_id, type, bind_address, bind_port, target_host, target_port, label, enabled, created_at, updated_at)
         VALUES ($host, $type, $bindAddr, $bindPort, $target, $targetPort, $label, $enabled, $created, $updated)`,
    {
      $host: hostId,
      $type: input.type,
      $bindAddr: input.bindAddress ?? null,
      $bindPort: input.bindPort,
      $target: input.targetHost,
      $targetPort: input.targetPort,
      $label: input.label ?? null,
      $enabled: input.enabled ?? true ? 1 : 0,
      $created: now,
      $updated: now
    }
  );
  const idRow = db2.exec("SELECT last_insert_rowid() AS id");
  const id = Number(idRow[0]?.values[0]?.[0] ?? 0);
  await persist();
  return listPortForwards(hostId).find((forward) => forward.id === id);
}
async function updatePortForward(id, patch) {
  const db2 = getDb();
  const current = queryRows2("SELECT * FROM port_forwards WHERE id = $id", { $id: id })[0];
  if (!current) return;
  db2.run(
    `UPDATE port_forwards SET
            type = $type,
            bind_address = $bindAddr,
            bind_port = $bindPort,
            target_host = $target,
            target_port = $targetPort,
            label = $label,
            enabled = $enabled,
            updated_at = $updated
         WHERE id = $id`,
    {
      $id: id,
      $type: patch.type ?? current.type,
      $bindAddr: patch.bindAddress !== void 0 ? patch.bindAddress : current.bind_address,
      $bindPort: patch.bindPort ?? current.bind_port,
      $target: patch.targetHost ?? current.target_host,
      $targetPort: patch.targetPort ?? current.target_port,
      $label: patch.label !== void 0 ? patch.label : current.label,
      $enabled: (patch.enabled !== void 0 ? patch.enabled : current.enabled === 1) ? 1 : 0,
      $updated: Date.now()
    }
  );
  await persist();
}
async function deletePortForward(id) {
  const db2 = getDb();
  db2.run("DELETE FROM port_forwards WHERE id = $id", { $id: id });
  await persist();
}

// src/electron/ssh-hosts.ts
var applyOverrides = (hosts) => {
  const overrides = new Map(listOverrides().map((override) => [override.hostId, override]));
  return hosts.map((host) => {
    const override = overrides.get(host.id);
    if (!override) return host;
    return {
      ...host,
      originalAlias: host.alias,
      customAlias: override.customAlias ?? void 0,
      alias: override.customAlias || host.alias,
      color: override.color ?? host.color,
      notes: override.notes ?? void 0,
      hidden: override.hidden,
      originalUser: host.user,
      user: override.username ?? host.user,
      authMethod: override.authMethod ?? host.authMethod,
      hasOverridePassword: override.hasPassword
    };
  });
};
var applyForwardCounts = (hosts) => {
  const counts = /* @__PURE__ */ new Map();
  for (const forward of listAllPortForwards()) {
    if (!forward.enabled) continue;
    counts.set(forward.hostId, (counts.get(forward.hostId) ?? 0) + 1);
  }
  return hosts.map((host) => {
    const count = counts.get(host.id);
    return count ? { ...host, forwardCount: count } : host;
  });
};
async function listAllSshHosts() {
  const [fileHosts, savedHosts] = await Promise.all([
    listFileBasedHosts(),
    Promise.resolve(listSavedHosts())
  ]);
  const merged = [...savedHosts.map(savedHostToSshHost), ...fileHosts];
  const enriched = applyForwardCounts(applyOverrides(merged));
  return {
    visible: enriched.filter((host) => !host.hidden),
    hidden: enriched.filter((host) => host.hidden)
  };
}

// src/electron/ssh-manager.ts
var import_events2 = require("events");
var import_net2 = __toESM(require("net"), 1);
var import_os3 = __toESM(require("os"), 1);
var import_crypto = require("crypto");
var import_node_pty = require("node-pty");
var import_ssh2 = require("ssh2");

// src/electron/host-resolver.ts
var import_child_process4 = require("child_process");
var import_promises3 = __toESM(require("dns/promises"), 1);
var import_net = __toESM(require("net"), 1);
var import_util4 = require("util");
var execFileAsync2 = (0, import_util4.promisify)(import_child_process4.execFile);
var IPV4_RE = /^(?:\d{1,3}\.){3}\d{1,3}$/;
var IPV6_RE = /:/;
function isIp(value) {
  return IPV4_RE.test(value) || IPV6_RE.test(value);
}
async function lookupViaNode(hostname) {
  try {
    const result = await import_promises3.default.lookup(hostname, { family: 4, all: false });
    return result.address;
  } catch {
  }
  try {
    const result = await import_promises3.default.lookup(hostname, { family: 6, all: false });
    return result.address;
  } catch {
    return null;
  }
}
async function lookupViaSystem(hostname) {
  try {
    const { stdout } = await execFileAsync2("dscacheutil", ["-q", "host", "-a", "name", hostname], {
      timeout: 5e3
    });
    const match = stdout.match(/ipv4_address:\s*(\S+)/) ?? stdout.match(/ip_address:\s*(\S+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
async function resolveHost(hostname) {
  if (isIp(hostname)) {
    return { address: hostname, via: "literal" };
  }
  if (hostname.endsWith(".ts.net") || hostname.includes(".tail")) {
    const fromSystem2 = await lookupViaSystem(hostname);
    if (fromSystem2) return { address: fromSystem2, via: "system" };
  }
  const fromNode = await lookupViaNode(hostname);
  if (fromNode) return { address: fromNode, via: "dns" };
  const fromSystem = await lookupViaSystem(hostname);
  if (fromSystem) return { address: fromSystem, via: "system" };
  return { address: hostname, via: "unresolved" };
}
async function tcpPreflight(address, port, timeoutMs = 8e3) {
  return new Promise((resolve, reject) => {
    const socket = import_net.default.connect({ host: address, port });
    const timer = setTimeout(() => {
      socket.destroy();
      reject(new Error(`TCP timeout connecting to ${address}:${port}`));
    }, timeoutMs);
    socket.once("connect", () => {
      clearTimeout(timer);
      socket.end();
      resolve();
    });
    socket.once("error", (err) => {
      clearTimeout(timer);
      reject(new Error(`TCP error: ${err.message}`));
    });
  });
}

// src/electron/ssh-manager.ts
var enabledForwards = (hostId) => listPortForwards(hostId).filter((forward) => forward.enabled);
var buildSshCliArgs = (host) => {
  const args = [];
  for (const forward of enabledForwards(host.id)) {
    const bind = forward.bindAddress || (forward.type === "local" ? "127.0.0.1" : "");
    const flag = forward.type === "local" ? "-L" : "-R";
    const spec = bind ? `${bind}:${forward.bindPort}:${forward.targetHost}:${forward.targetPort}` : `${forward.bindPort}:${forward.targetHost}:${forward.targetPort}`;
    args.push(flag, spec);
  }
  if (host.source === "config") {
    args.push(host.alias);
    return args;
  }
  if (host.port) args.push("-p", String(host.port));
  args.push(host.hostname);
  return args;
};
var SshManager = class extends import_events2.EventEmitter {
  sessions = /* @__PURE__ */ new Map();
  emitData(sessionId, data) {
    const session = this.sessions.get(sessionId);
    if (session?.kind === "ssh2" && session.pendingPrefix) {
      this.emit("data", { sessionId, data: session.pendingPrefix + data });
      session.pendingPrefix = "";
      return;
    }
    this.emit("data", { sessionId, data });
  }
  appendPending(session, data) {
    session.pendingPrefix += data;
    if (session.pendingPrefix.length > 4096) {
      session.pendingPrefix = session.pendingPrefix.slice(-4096);
    }
  }
  list() {
    return Array.from(this.sessions.values()).map((session) => ({
      sessionId: session.id,
      host: session.host
    }));
  }
  async create(host, cols = 120, rows = 30) {
    if (host.source === "saved") {
      return this.createSavedSsh2Session(host, cols, rows);
    }
    if (host.hasOverridePassword) {
      return this.createOverrideSsh2Session(host, cols, rows);
    }
    return this.createPtySession(host, cols, rows);
  }
  async createOverrideSsh2Session(host, cols, rows) {
    const password = getOverridePassword(host.id);
    if (!password) {
      throw new Error("Override password is unavailable or not stored");
    }
    if (!host.user) {
      throw new Error("Override requires a username");
    }
    return this.openSsh2Stream({
      host,
      cols,
      rows,
      target: {
        hostname: host.hostname,
        port: host.port ?? 22,
        username: host.user,
        password
      }
    });
  }
  createPtySession(host, cols, rows) {
    const id = (0, import_crypto.randomUUID)();
    const args = buildSshCliArgs(host);
    const pty = (0, import_node_pty.spawn)("ssh", args, {
      name: "xterm-256color",
      cols,
      rows,
      cwd: import_os3.default.homedir(),
      env: process.env
    });
    const session = { id, host, kind: "pty", pty };
    this.sessions.set(id, session);
    pty.onData((data) => this.emit("data", { sessionId: id, data }));
    pty.onExit(({ exitCode, signal }) => {
      this.sessions.delete(id);
      this.emit("exit", { sessionId: id, exitCode, signal });
    });
    return { sessionId: id };
  }
  async createSavedSsh2Session(host, cols, rows) {
    const savedId = host.savedId;
    if (!savedId) {
      throw new Error("saved host missing savedId");
    }
    const saved = getSavedHost(savedId);
    if (!saved) {
      throw new Error(`Saved host ${savedId} not found`);
    }
    const password = saved.authMethod === "password" ? getSavedHostPassword(savedId) : null;
    if (saved.authMethod === "password" && !password) {
      throw new Error("Password is not stored for this host");
    }
    return this.openSsh2Stream({
      host,
      cols,
      rows,
      target: {
        hostname: saved.hostname,
        port: saved.port,
        username: saved.username,
        password: password ?? void 0
      }
    });
  }
  openSsh2Stream(args) {
    const { host, cols, rows, target } = args;
    const id = (0, import_crypto.randomUUID)();
    const client = new import_ssh2.Client();
    const resolvePromise = resolveHost(target.hostname);
    const session = {
      id,
      host,
      kind: "ssh2",
      client,
      stream: null,
      forwardServers: [],
      remoteForwards: [],
      pendingPrefix: ""
    };
    this.sessions.set(id, session);
    const fail = (err) => {
      this.cleanupSsh2Tunnels(session);
      this.sessions.delete(id);
      this.emit("exit", { sessionId: id, exitCode: 1, error: err.message });
    };
    client.on("error", (err) => {
      const hint = /handshake/i.test(err.message) ? " (TCP works but the SSH service did not respond. Wrong port, sshd down, or a Tailscale ACL blocking port?)" : "";
      this.emitData(id, `\r
\x1B[31mError: ${err.message}${hint}\x1B[0m\r
`);
      fail(err);
    });
    client.on("end", () => {
      this.cleanupSsh2Tunnels(session);
      this.sessions.delete(id);
      this.emit("exit", { sessionId: id, exitCode: 0 });
    });
    client.on("tcp connection", (info, accept, reject) => {
      const match = session.remoteForwards.find(
        (f) => f.address === info.destIP && f.port === info.destPort
      );
      const forwardConfig = match ? enabledForwards(host.id).find(
        (f) => f.type === "remote" && (f.bindAddress || "") === info.destIP && f.bindPort === info.destPort
      ) : void 0;
      if (!forwardConfig) {
        reject();
        return;
      }
      const local = import_net2.default.connect(forwardConfig.targetPort, forwardConfig.targetHost);
      local.on("error", () => reject());
      local.on("connect", () => {
        const remote = accept();
        local.pipe(remote).pipe(local);
      });
    });
    client.on("ready", () => {
      this.emitData(
        id,
        `\x1B[32mConnected to ${target.username}@${target.hostname}:${target.port}\x1B[0m\r
`
      );
      this.setupSsh2Tunnels(session);
      client.shell({ term: "xterm-256color", cols, rows }, (err, stream) => {
        if (err) {
          fail(err);
          return;
        }
        session.stream = stream;
        stream.on("data", (data) => {
          this.emit("data", { sessionId: id, data: data.toString("utf-8") });
        });
        stream.stderr.on("data", (data) => {
          this.emit("data", { sessionId: id, data: data.toString("utf-8") });
        });
        stream.on("close", () => {
          try {
            client.end();
          } catch {
          }
        });
      });
    });
    resolvePromise.then(async ({ address, via }) => {
      if (via === "unresolved") {
        this.emitData(
          id,
          `\r
\x1B[31mCould not resolve ${target.hostname}. For Tailscale: try the 100.x.x.x IP or full \`.ts.net\` name.\x1B[0m\r
`
        );
        fail(new Error(`Could not resolve ${target.hostname}`));
        return;
      }
      if (via !== "literal") {
        this.appendPending(
          session,
          `\x1B[36mResolved ${target.hostname} \u2192 ${address} (${via})\x1B[0m\r
`
        );
      }
      try {
        await tcpPreflight(address, target.port, 8e3);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.emitData(
          id,
          `\r
\x1B[31m${message}. Tailscale tunnel up? Try \`tailscale status\` / \`tailscale ping ${target.hostname}\`.\x1B[0m\r
`
        );
        fail(err instanceof Error ? err : new Error(message));
        return;
      }
      this.appendPending(session, `\x1B[36mTCP ok ${address}:${target.port}, waiting for SSH banner\u2026\x1B[0m\r
`);
      try {
        client.connect({
          host: address,
          port: target.port,
          username: target.username,
          password: target.password,
          readyTimeout: 3e4,
          keepaliveInterval: 3e4
        });
      } catch (err) {
        fail(err);
      }
    }).catch((err) => fail(err));
    return { sessionId: id };
  }
  setupSsh2Tunnels(session) {
    const forwards = enabledForwards(session.host.id);
    if (forwards.length === 0) return;
    const emitInfo = (message) => {
      this.emit("data", { sessionId: session.id, data: `\x1B[36m${message}\x1B[0m\r
` });
    };
    const emitError = (message) => {
      this.emit("data", { sessionId: session.id, data: `\x1B[31m${message}\x1B[0m\r
` });
    };
    for (const forward of forwards) {
      if (forward.type === "local") {
        const bindAddr = forward.bindAddress || "127.0.0.1";
        const server = import_net2.default.createServer((local) => {
          session.client.forwardOut(
            bindAddr,
            forward.bindPort,
            forward.targetHost,
            forward.targetPort,
            (err, remote) => {
              if (err) {
                local.end();
                emitError(
                  `Tunnel ${bindAddr}:${forward.bindPort} \u2192 ${forward.targetHost}:${forward.targetPort} failed: ${err.message}`
                );
                return;
              }
              local.pipe(remote).pipe(local);
            }
          );
        });
        server.on("error", (err) => {
          emitError(`Tunnel ${bindAddr}:${forward.bindPort} error: ${err.message}`);
        });
        server.listen(forward.bindPort, bindAddr, () => {
          emitInfo(
            `Tunnel -L ${bindAddr}:${forward.bindPort} \u2192 ${forward.targetHost}:${forward.targetPort} ready`
          );
        });
        session.forwardServers.push(server);
      } else {
        const bindAddr = forward.bindAddress || "";
        session.client.forwardIn(bindAddr, forward.bindPort, (err, port) => {
          if (err) {
            emitError(`Reverse tunnel ${bindAddr}:${forward.bindPort} failed: ${err.message}`);
            return;
          }
          session.remoteForwards.push({ address: bindAddr, port });
          emitInfo(
            `Tunnel -R ${bindAddr}:${port} \u2192 ${forward.targetHost}:${forward.targetPort} ready`
          );
        });
      }
    }
  }
  cleanupSsh2Tunnels(session) {
    for (const server of session.forwardServers) {
      try {
        server.close();
      } catch {
      }
    }
    session.forwardServers = [];
    for (const remote of session.remoteForwards) {
      try {
        session.client.unforwardIn(remote.address, remote.port, () => {
        });
      } catch {
      }
    }
    session.remoteForwards = [];
  }
  write(sessionId, data) {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    if (session.kind === "pty") {
      session.pty.write(data);
      return true;
    }
    if (session.stream) {
      session.stream.write(data);
      return true;
    }
    return false;
  }
  resize(sessionId, cols, rows) {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    const safeCols = Math.max(cols, 1);
    const safeRows = Math.max(rows, 1);
    try {
      if (session.kind === "pty") {
        session.pty.resize(safeCols, safeRows);
        return true;
      }
      if (session.stream) {
        session.stream.setWindow(safeRows, safeCols, 0, 0);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
  close(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    try {
      if (session.kind === "pty") {
        session.pty.kill();
      } else {
        this.cleanupSsh2Tunnels(session);
        session.stream?.end();
        session.client.end();
      }
    } catch {
    }
    this.sessions.delete(sessionId);
    return true;
  }
  dispose() {
    for (const session of this.sessions.values()) {
      try {
        if (session.kind === "pty") {
          session.pty.kill();
        } else {
          this.cleanupSsh2Tunnels(session);
          session.stream?.end();
          session.client.end();
        }
      } catch {
      }
    }
    this.sessions.clear();
  }
};

// src/electron/settings-store.ts
var import_fs5 = require("fs");
var import_promises4 = require("fs/promises");
var import_path6 = __toESM(require("path"), 1);
var import_electron4 = require("electron");
var SETTINGS_FILENAME = "app-settings.json";
var DEFAULT_SETTINGS = {
  theme: "system",
  popup: {
    showMedia: true,
    showBluetooth: true,
    showSystem: true,
    showSsh: true,
    showDocker: true
  },
  hotkey: {
    enabled: true,
    combo: "Cmd+Shift+M"
  }
};
var cached = null;
var writeQueue = Promise.resolve();
function settingsPath() {
  const userData = import_electron4.app.getPath("userData");
  if (!(0, import_fs5.existsSync)(userData)) (0, import_fs5.mkdirSync)(userData, { recursive: true });
  return import_path6.default.join(userData, SETTINGS_FILENAME);
}
function mergeWithDefaults(partial) {
  return {
    theme: partial?.theme ?? DEFAULT_SETTINGS.theme,
    popup: { ...DEFAULT_SETTINGS.popup, ...partial?.popup ?? {} },
    hotkey: { ...DEFAULT_SETTINGS.hotkey, ...partial?.hotkey ?? {} }
  };
}
async function loadSettings() {
  if (cached) return cached;
  const file = settingsPath();
  if (!(0, import_fs5.existsSync)(file)) {
    cached = { ...DEFAULT_SETTINGS, popup: { ...DEFAULT_SETTINGS.popup } };
    return cached;
  }
  try {
    const raw = await (0, import_promises4.readFile)(file, "utf8");
    cached = mergeWithDefaults(JSON.parse(raw));
    return cached;
  } catch {
    cached = { ...DEFAULT_SETTINGS, popup: { ...DEFAULT_SETTINGS.popup } };
    return cached;
  }
}
async function updateSettings(patch) {
  const current = await loadSettings();
  const next = {
    theme: patch.theme ?? current.theme,
    popup: { ...current.popup, ...patch.popup ?? {} },
    hotkey: { ...current.hotkey, ...patch.hotkey ?? {} }
  };
  cached = next;
  const file = settingsPath();
  writeQueue = writeQueue.then(() => (0, import_promises4.writeFile)(file, JSON.stringify(next, null, 2)));
  await writeQueue;
  return next;
}

// src/electron/media-history.ts
var rowToEntry = (row) => ({
  id: row.id,
  title: row.title,
  artist: row.artist,
  album: row.album,
  bundleId: row.bundle_id,
  appName: row.app_name,
  artworkUrl: row.artwork_url,
  artworkDataUrl: row.artwork_data_url,
  durationSeconds: row.duration_seconds,
  listenedSeconds: row.listened_seconds,
  startedAt: row.started_at,
  endedAt: row.ended_at
});
var queryRows3 = (sql, params = []) => {
  const db2 = getDb();
  const stmt = db2.prepare(sql);
  try {
    stmt.bind(params);
    const out = [];
    while (stmt.step()) {
      out.push(stmt.getAsObject());
    }
    return out;
  } finally {
    stmt.free();
  }
};
var MINIMUM_LISTENED_SECONDS_TO_KEEP = 5;
var HISTORY_RETENTION_DAYS = 30;
async function startEntry(input) {
  const db2 = getDb();
  db2.run(
    `INSERT INTO media_history
            (title, artist, album, bundle_id, app_name, artwork_url, artwork_data_url,
             duration_seconds, listened_seconds, started_at)
         VALUES ($title, $artist, $album, $bundle, $app, $art, $artData, $dur, 0, $started)`,
    {
      $title: input.title,
      $artist: input.artist,
      $album: input.album,
      $bundle: input.bundleId,
      $app: input.appName,
      $art: input.artworkUrl,
      $artData: input.artworkDataUrl,
      $dur: input.durationSeconds,
      $started: input.startedAt
    }
  );
  const result = db2.exec("SELECT last_insert_rowid() AS id");
  const id = Number(result[0]?.values[0]?.[0] ?? 0);
  await persist();
  return id;
}
async function extendEntry(id, additionalSeconds) {
  if (additionalSeconds <= 0) return;
  const db2 = getDb();
  db2.run(
    `UPDATE media_history SET listened_seconds = listened_seconds + $delta WHERE id = $id`,
    { $delta: Math.round(additionalSeconds), $id: id }
  );
  await persist();
}
var upsertArtistStats = (artist, seconds, timestamp) => {
  const db2 = getDb();
  db2.run(
    `INSERT INTO media_artist_stats (artist, total_seconds, total_plays, first_played_at, last_played_at)
         VALUES ($artist, $sec, 1, $now, $now)
         ON CONFLICT(artist) DO UPDATE SET
            total_seconds = total_seconds + $sec,
            total_plays = total_plays + 1,
            last_played_at = $now`,
    { $artist: artist, $sec: seconds, $now: timestamp }
  );
};
var upsertTrackStats = (artist, title, album, artworkUrl, artworkDataUrl, seconds, timestamp) => {
  const db2 = getDb();
  db2.run(
    `INSERT INTO media_track_stats
            (artist, title, album, artwork_url, artwork_data_url, total_seconds, total_plays, first_played_at, last_played_at)
         VALUES ($artist, $title, $album, $art, $artData, $sec, 1, $now, $now)
         ON CONFLICT(artist, title) DO UPDATE SET
            total_seconds = total_seconds + $sec,
            total_plays = total_plays + 1,
            last_played_at = $now,
            album = COALESCE($album, album),
            artwork_url = COALESCE($art, artwork_url),
            artwork_data_url = COALESCE($artData, artwork_data_url)`,
    {
      $artist: artist,
      $title: title,
      $album: album,
      $art: artworkUrl,
      $artData: artworkDataUrl,
      $sec: seconds,
      $now: timestamp
    }
  );
};
async function closeEntry(id, endedAt) {
  const db2 = getDb();
  const rows = queryRows3(`SELECT * FROM media_history WHERE id = $id`, { $id: id });
  const entry = rows[0];
  if (!entry) {
    return;
  }
  if (entry.listened_seconds < MINIMUM_LISTENED_SECONDS_TO_KEEP) {
    db2.run(`DELETE FROM media_history WHERE id = $id`, { $id: id });
    await persist();
    return;
  }
  if (entry.title && entry.title.trim()) {
    upsertTrackStats(
      entry.artist ?? "",
      entry.title,
      entry.album,
      entry.artwork_url,
      entry.artwork_data_url,
      entry.listened_seconds,
      endedAt
    );
  }
  if (entry.artist && entry.artist.trim()) {
    upsertArtistStats(entry.artist, entry.listened_seconds, endedAt);
  }
  db2.run(
    `UPDATE media_history SET ended_at = $ended WHERE id = $id AND ended_at IS NULL`,
    { $ended: endedAt, $id: id }
  );
  await persist();
}
function listHistory(limit = 50) {
  return queryRows3(
    `SELECT * FROM media_history
         WHERE listened_seconds >= ${MINIMUM_LISTENED_SECONDS_TO_KEEP}
         ORDER BY started_at DESC
         LIMIT $limit`,
    { $limit: limit }
  ).map(rowToEntry);
}
function listArtistGroups(limit = 30) {
  const artistRows = queryRows3(
    `SELECT artist, total_seconds, total_plays, first_played_at, last_played_at
         FROM media_artist_stats
         WHERE artist != ''
         ORDER BY total_seconds DESC
         LIMIT $limit`,
    { $limit: limit }
  );
  if (artistRows.length === 0) return [];
  return artistRows.map((row) => {
    const tracks = queryRows3(
      `SELECT title, album, artwork_url, artwork_data_url,
                    total_seconds, total_plays, last_played_at
             FROM media_track_stats
             WHERE artist = $artist
             ORDER BY total_seconds DESC`,
      { $artist: row.artist }
    );
    return {
      artist: row.artist,
      totalSeconds: row.total_seconds,
      totalPlays: row.total_plays,
      lastPlayedAt: row.last_played_at,
      firstPlayedAt: row.first_played_at,
      tracks: tracks.map((track) => ({
        title: track.title,
        album: track.album,
        artworkUrl: track.artwork_url,
        artworkDataUrl: track.artwork_data_url,
        totalSeconds: track.total_seconds,
        totalPlays: track.total_plays,
        lastPlayedAt: track.last_played_at
      }))
    };
  });
}
function getStats() {
  const db2 = getDb();
  const exec2 = (sql, params) => {
    const stmt = db2.prepare(sql);
    try {
      if (params) stmt.bind(params);
      const rows = [];
      while (stmt.step()) rows.push(stmt.getAsObject());
      return rows;
    } finally {
      stmt.free();
    }
  };
  const totalsRow = exec2(
    `SELECT COALESCE(SUM(total_seconds), 0) AS total,
                COUNT(*) AS uniq_artists
         FROM media_artist_stats`
  )[0];
  const uniqTracksRow = exec2(`SELECT COUNT(*) AS uniq_tracks FROM media_track_stats`)[0];
  const now = Date.now();
  const ms24h = now - 24 * 60 * 60 * 1e3;
  const ms7d = now - 7 * 24 * 60 * 60 * 1e3;
  const recentTotal = (since) => Number(
    exec2(
      `SELECT COALESCE(SUM(listened_seconds), 0) AS total
                 FROM media_history
                 WHERE started_at >= $since AND listened_seconds >= ${MINIMUM_LISTENED_SECONDS_TO_KEEP}`,
      { $since: since }
    )[0]?.total ?? 0
  );
  const topArtists = exec2(
    `SELECT artist, total_seconds AS total, total_plays AS plays
         FROM media_artist_stats
         WHERE artist != ''
         ORDER BY total DESC
         LIMIT 5`
  ).map((row) => ({
    artist: String(row.artist ?? ""),
    totalSeconds: Number(row.total ?? 0),
    plays: Number(row.plays ?? 0)
  }));
  const topTracks = exec2(
    `SELECT title, artist, total_seconds AS total, total_plays AS plays
         FROM media_track_stats
         WHERE title != ''
         ORDER BY total DESC
         LIMIT 5`
  ).map((row) => ({
    title: String(row.title ?? ""),
    artist: row.artist ? String(row.artist) : null,
    totalSeconds: Number(row.total ?? 0),
    plays: Number(row.plays ?? 0)
  }));
  return {
    totalListenedSeconds: Number(totalsRow?.total ?? 0),
    uniqueTracks: Number(uniqTracksRow?.uniq_tracks ?? 0),
    uniqueArtists: Number(totalsRow?.uniq_artists ?? 0),
    topArtists,
    topTracks,
    last24hSeconds: recentTotal(ms24h),
    last7dSeconds: recentTotal(ms7d)
  };
}
async function purgeOldHistory(retentionDays = HISTORY_RETENTION_DAYS) {
  const db2 = getDb();
  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1e3;
  db2.run(`DELETE FROM media_history WHERE started_at < $cutoff`, { $cutoff: cutoff });
  const changes = db2.exec("SELECT changes() AS c")[0]?.values[0]?.[0];
  await persist();
  return Number(changes ?? 0);
}
async function clearHistory() {
  const db2 = getDb();
  db2.run("DELETE FROM media_history");
  await persist();
}
async function clearAllStats() {
  const db2 = getDb();
  db2.run("DELETE FROM media_history");
  db2.run("DELETE FROM media_artist_stats");
  db2.run("DELETE FROM media_track_stats");
  await persist();
}

// src/electron/media-tracker.ts
var POLL_INTERVAL_MS = 5e3;
var trackKey = (track) => `${track.bundleId ?? ""}|${track.title ?? ""}|${track.artist ?? ""}|${track.album ?? ""}`;
var MediaTracker = class {
  timer = null;
  active = null;
  running = false;
  mediaManager;
  constructor(mediaManager2) {
    this.mediaManager = mediaManager2;
  }
  start() {
    if (this.timer) return;
    void this.tick();
    this.timer = setInterval(() => void this.tick(), POLL_INTERVAL_MS);
  }
  async stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.active) {
      await closeEntry(this.active.id, Date.now());
      this.active = null;
    }
  }
  async tick() {
    if (this.running) return;
    this.running = true;
    try {
      const tracks = await this.mediaManager.getAllNowPlaying();
      const primary = tracks[0] ?? null;
      await this.observe(primary);
    } catch (error) {
      console.error("[MediaTracker] tick failed:", error);
    } finally {
      this.running = false;
    }
  }
  async observe(track) {
    const now = Date.now();
    if (!track || !track.title && !track.artist) {
      if (this.active) {
        await closeEntry(this.active.id, now);
        this.active = null;
      }
      return;
    }
    const key = trackKey(track);
    if (this.active && this.active.key === key) {
      if (track.isPlaying) {
        const delta = Math.max(0, (now - this.active.lastTickAt) / 1e3);
        if (delta > 0) await extendEntry(this.active.id, delta);
      }
      this.active.lastTickAt = now;
      return;
    }
    if (this.active) {
      await closeEntry(this.active.id, now);
    }
    const id = await startEntry({
      title: track.title,
      artist: track.artist,
      album: track.album,
      bundleId: track.bundleId,
      appName: track.app,
      artworkUrl: track.artworkUrl ?? null,
      artworkDataUrl: track.artworkDataUrl ?? null,
      durationSeconds: track.duration ? Math.round(track.duration) : null,
      startedAt: now
    });
    this.active = { id, key, lastTickAt: now };
  }
};

// src/electron/ssh-file-ops.ts
var import_child_process5 = require("child_process");
var import_os4 = __toESM(require("os"), 1);
var import_path7 = __toESM(require("path"), 1);
var import_util5 = require("util");
var execFileAsync3 = (0, import_util5.promisify)(import_child_process5.execFile);
var KNOWN_HOSTS_PATH2 = import_path7.default.join(import_os4.default.homedir(), ".ssh", "known_hosts");
async function removeFromKnownHosts(hostname) {
  if (!hostname || hostname.trim().length === 0) {
    return { success: false, error: "hostname is empty" };
  }
  try {
    await execFileAsync3("ssh-keygen", ["-R", hostname, "-f", KNOWN_HOSTS_PATH2], {
      timeout: 1e4
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// src/electron/docker-manager.ts
var import_events3 = require("events");
var import_child_process6 = require("child_process");
var import_util6 = require("util");
var import_crypto2 = require("crypto");
var import_node_pty2 = require("node-pty");
var execFileP = (0, import_util6.promisify)(import_child_process6.execFile);
var RUN_TIMEOUT = 3e4;
var PRUNE_TIMEOUT = 12e4;
var parseJsonLines = (stdout, map) => {
  return stdout.split("\n").filter((line) => line.trim().length > 0).map((line) => {
    try {
      return map(JSON.parse(line));
    } catch {
      return null;
    }
  }).filter((value) => value !== null);
};
var DockerManager = class extends import_events3.EventEmitter {
  execSessions = /* @__PURE__ */ new Map();
  async isAvailable() {
    try {
      const { stdout } = await execFileP(
        "docker",
        ["version", "--format", "{{.Server.Version}}"],
        { timeout: 4e3 }
      );
      const version = stdout.trim();
      if (!version) {
        return { available: false, error: "Docker daemon not responding" };
      }
      return { available: true, version };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { available: false, error: message };
    }
  }
  async listContainers() {
    const { stdout } = await execFileP(
      "docker",
      ["container", "ls", "-a", "--format", "{{json .}}"],
      { timeout: RUN_TIMEOUT, maxBuffer: 4 * 1024 * 1024 }
    );
    return parseJsonLines(stdout, (raw) => ({
      id: raw.ID ?? "",
      name: raw.Names ?? "",
      image: raw.Image ?? "",
      state: (raw.State ?? "").toLowerCase(),
      status: raw.Status ?? "",
      ports: raw.Ports ?? "",
      command: raw.Command ?? "",
      createdAt: raw.CreatedAt ?? "",
      size: raw.Size ?? ""
    }));
  }
  async listImages() {
    const { stdout } = await execFileP(
      "docker",
      ["image", "ls", "--format", "{{json .}}"],
      { timeout: RUN_TIMEOUT, maxBuffer: 4 * 1024 * 1024 }
    );
    return parseJsonLines(stdout, (raw) => ({
      id: raw.ID ?? "",
      repository: raw.Repository ?? "",
      tag: raw.Tag ?? "",
      size: raw.Size ?? "",
      createdSince: raw.CreatedSince ?? ""
    }));
  }
  async listVolumes() {
    const { stdout } = await execFileP(
      "docker",
      ["volume", "ls", "--format", "{{json .}}"],
      { timeout: RUN_TIMEOUT, maxBuffer: 2 * 1024 * 1024 }
    );
    return parseJsonLines(stdout, (raw) => ({
      name: raw.Name ?? "",
      driver: raw.Driver ?? "",
      mountpoint: raw.Mountpoint ?? "",
      scope: raw.Scope ?? ""
    }));
  }
  async listNetworks() {
    const { stdout } = await execFileP(
      "docker",
      ["network", "ls", "--format", "{{json .}}"],
      { timeout: RUN_TIMEOUT, maxBuffer: 2 * 1024 * 1024 }
    );
    return parseJsonLines(stdout, (raw) => ({
      id: raw.ID ?? "",
      name: raw.Name ?? "",
      driver: raw.Driver ?? "",
      scope: raw.Scope ?? ""
    }));
  }
  async runImage(options) {
    const args = ["run"];
    const detached = options.detached !== false;
    if (detached) args.push("-d");
    if (options.autoRemove) args.push("--rm");
    if (options.name && options.name.trim()) {
      args.push("--name", options.name.trim());
    }
    for (const port of options.ports ?? []) {
      const host = port.host.trim();
      const container = port.container.trim();
      if (!host || !container) continue;
      args.push("-p", `${host}:${container}`);
    }
    for (const env of options.env ?? []) {
      const key = env.key.trim();
      if (!key) continue;
      args.push("-e", `${key}=${env.value}`);
    }
    for (const volume of options.volumes ?? []) {
      const host = volume.host.trim();
      const container = volume.container.trim();
      if (!host || !container) continue;
      args.push("-v", `${host}:${container}`);
    }
    args.push(options.image);
    if (options.command && options.command.trim()) {
      const tokens = options.command.trim().split(/\s+/);
      args.push(...tokens);
    }
    const { stdout } = await execFileP("docker", args, { timeout: RUN_TIMEOUT });
    return { containerId: stdout.trim() };
  }
  async startContainer(id) {
    await execFileP("docker", ["start", id], { timeout: RUN_TIMEOUT });
  }
  async stopContainer(id) {
    await execFileP("docker", ["stop", id], { timeout: RUN_TIMEOUT });
  }
  async restartContainer(id) {
    await execFileP("docker", ["restart", id], { timeout: RUN_TIMEOUT });
  }
  async removeContainer(id, force = false) {
    const args = ["rm", ...force ? ["-f"] : [], id];
    await execFileP("docker", args, { timeout: RUN_TIMEOUT });
  }
  async removeImage(id, force = false) {
    const args = ["rmi", ...force ? ["-f"] : [], id];
    await execFileP("docker", args, { timeout: RUN_TIMEOUT });
  }
  async removeVolume(name, force = false) {
    const args = ["volume", "rm", ...force ? ["-f"] : [], name];
    await execFileP("docker", args, { timeout: RUN_TIMEOUT });
  }
  async removeNetwork(name) {
    await execFileP("docker", ["network", "rm", name], { timeout: RUN_TIMEOUT });
  }
  async pruneContainers() {
    const { stdout } = await execFileP("docker", ["container", "prune", "-f"], { timeout: PRUNE_TIMEOUT });
    return stdout;
  }
  async pruneImages(all = false) {
    const args = ["image", "prune", "-f", ...all ? ["-a"] : []];
    const { stdout } = await execFileP("docker", args, { timeout: PRUNE_TIMEOUT });
    return stdout;
  }
  async pruneVolumes() {
    const { stdout } = await execFileP("docker", ["volume", "prune", "-f"], { timeout: PRUNE_TIMEOUT });
    return stdout;
  }
  async pruneNetworks() {
    const { stdout } = await execFileP("docker", ["network", "prune", "-f"], { timeout: PRUNE_TIMEOUT });
    return stdout;
  }
  async pruneSystem(all = false) {
    const args = ["system", "prune", "-f", ...all ? ["-a"] : []];
    const { stdout } = await execFileP("docker", args, { timeout: PRUNE_TIMEOUT });
    return stdout;
  }
  async getLogs(containerId, tail = 500) {
    const { stdout, stderr } = await execFileP(
      "docker",
      ["logs", "--tail", String(tail), "--timestamps", containerId],
      { timeout: 15e3, maxBuffer: 16 * 1024 * 1024 }
    );
    return stdout + stderr;
  }
  startExec(containerId, containerName, cols = 120, rows = 30) {
    const id = (0, import_crypto2.randomUUID)();
    const shellCmd = "[ -x /bin/bash ] && exec /bin/bash || exec /bin/sh";
    const pty = (0, import_node_pty2.spawn)(
      "docker",
      ["exec", "-it", containerId, "/bin/sh", "-c", shellCmd],
      {
        name: "xterm-256color",
        cols,
        rows,
        cwd: process.cwd(),
        env: process.env
      }
    );
    this.execSessions.set(id, { id, pty, containerId, containerName });
    pty.onData((data) => this.emit("exec-data", { sessionId: id, data }));
    pty.onExit(({ exitCode, signal }) => {
      this.execSessions.delete(id);
      this.emit("exec-exit", { sessionId: id, exitCode, signal });
    });
    return { sessionId: id };
  }
  writeExec(sessionId, data) {
    const session = this.execSessions.get(sessionId);
    if (!session) return false;
    session.pty.write(data);
    return true;
  }
  resizeExec(sessionId, cols, rows) {
    const session = this.execSessions.get(sessionId);
    if (!session) return false;
    try {
      session.pty.resize(Math.max(cols, 1), Math.max(rows, 1));
      return true;
    } catch {
      return false;
    }
  }
  closeExec(sessionId) {
    const session = this.execSessions.get(sessionId);
    if (!session) return false;
    try {
      session.pty.kill();
    } catch {
    }
    this.execSessions.delete(sessionId);
    return true;
  }
  ownsExec(sessionId) {
    return this.execSessions.has(sessionId);
  }
  dispose() {
    for (const session of this.execSessions.values()) {
      try {
        session.pty.kill();
      } catch {
      }
    }
    this.execSessions.clear();
  }
};

// src/electron/local-fs.ts
var import_promises5 = require("fs/promises");
var import_os5 = __toESM(require("os"), 1);
var import_path8 = __toESM(require("path"), 1);
async function listLocal(dirPath) {
  const target = dirPath || import_os5.default.homedir();
  const entries = await (0, import_promises5.readdir)(target, { withFileTypes: true });
  const results = await Promise.all(
    entries.map(async (entry) => {
      const full = import_path8.default.join(target, entry.name);
      try {
        const stats = await (0, import_promises5.stat)(full);
        return {
          name: entry.name,
          path: full,
          isDir: stats.isDirectory(),
          isLink: entry.isSymbolicLink(),
          size: stats.size,
          mtimeMs: stats.mtimeMs
        };
      } catch {
        return null;
      }
    })
  );
  return results.filter((entry) => entry !== null).sort((a, b) => {
    if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
    return a.name.localeCompare(b.name, void 0, { sensitivity: "base" });
  });
}
function localHome() {
  return import_os5.default.homedir();
}

// src/electron/sftp-manager.ts
var import_crypto3 = require("crypto");
var import_ssh22 = require("ssh2");

// src/electron/ssh-credentials.ts
var import_fs6 = require("fs");
var import_os6 = __toESM(require("os"), 1);
var import_path9 = __toESM(require("path"), 1);
function expandHome2(filePath) {
  if (filePath.startsWith("~/")) return import_path9.default.join(import_os6.default.homedir(), filePath.slice(2));
  if (filePath === "~") return import_os6.default.homedir();
  return filePath;
}
function loadPrivateKey(filePath) {
  if (!filePath) return void 0;
  const expanded = expandHome2(filePath);
  if (!(0, import_fs6.existsSync)(expanded)) return void 0;
  try {
    return (0, import_fs6.readFileSync)(expanded);
  } catch {
    return void 0;
  }
}
function resolveCredentials(host) {
  const agentSocket = process.env.SSH_AUTH_SOCK || void 0;
  if (host.source === "saved" && host.savedId !== void 0) {
    const saved = getSavedHost(host.savedId);
    if (!saved) throw new Error(`Saved host ${host.savedId} not found`);
    const password = saved.authMethod === "password" ? getSavedHostPassword(host.savedId) : null;
    const identityFile = saved.identityFile ?? void 0;
    return {
      hostname: saved.hostname,
      port: saved.port,
      username: saved.username,
      password: password ?? void 0,
      identityFile,
      privateKey: loadPrivateKey(identityFile),
      agentSocket
    };
  }
  if (host.hasOverridePassword) {
    const password = getOverridePassword(host.id);
    if (!host.user) throw new Error("Override credential requires a username");
    return {
      hostname: host.hostname,
      port: host.port ?? 22,
      username: host.user,
      password: password ?? void 0,
      identityFile: host.identityFile,
      privateKey: loadPrivateKey(host.identityFile),
      agentSocket
    };
  }
  return {
    hostname: host.hostname,
    port: host.port ?? 22,
    username: host.user ?? import_os6.default.userInfo().username,
    identityFile: host.identityFile,
    privateKey: loadPrivateKey(host.identityFile),
    agentSocket
  };
}

// src/electron/sftp-manager.ts
var SftpManager = class {
  sessions = /* @__PURE__ */ new Map();
  async connect(host) {
    const creds = resolveCredentials(host);
    const resolved = await resolveHost(creds.hostname);
    if (resolved.via === "unresolved") {
      throw new Error(
        `Could not resolve ${creds.hostname}. For Tailscale, try the 100.x.x.x IP or full .ts.net name.`
      );
    }
    try {
      await tcpPreflight(resolved.address, creds.port, 8e3);
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      throw new Error(
        `${detail}. Tailscale tunnel up? Try \`tailscale ping ${creds.hostname}\`.`
      );
    }
    const client = new import_ssh22.Client();
    const ready = new Promise((resolve, reject) => {
      client.once("ready", () => resolve());
      client.once("error", (err) => reject(err));
    });
    client.connect({
      host: resolved.address,
      port: creds.port,
      username: creds.username,
      password: creds.password,
      privateKey: creds.privateKey,
      agent: creds.agentSocket,
      tryKeyboard: false,
      readyTimeout: 15e3,
      keepaliveInterval: 3e4
    });
    await ready;
    const sftp = await new Promise((resolve, reject) => {
      client.sftp((err, wrapper) => err ? reject(err) : resolve(wrapper));
    });
    const homePath = await new Promise((resolve) => {
      sftp.realpath(".", (err, resolved2) => {
        if (err || !resolved2) resolve("/");
        else resolve(resolved2);
      });
    });
    const id = (0, import_crypto3.randomUUID)();
    this.sessions.set(id, { id, hostId: host.id, client, sftp, homePath });
    client.on("close", () => {
      this.sessions.delete(id);
    });
    return { sessionId: id, homePath };
  }
  async list(sessionId, dirPath) {
    const session = this.requireSession(sessionId);
    const target = dirPath || session.homePath;
    const resolved = await new Promise((resolve, reject) => {
      session.sftp.realpath(target, (err, value) => err ? reject(err) : resolve(value));
    });
    const entries = await new Promise((resolve, reject) => {
      session.sftp.readdir(resolved, (err, list) => err ? reject(err) : resolve(list));
    });
    return entries.filter((entry) => entry.filename !== "." && entry.filename !== "..").map((entry) => ({
      name: entry.filename,
      path: posixJoin(resolved, entry.filename),
      isDir: entry.attrs.isDirectory(),
      isLink: entry.attrs.isSymbolicLink(),
      size: entry.attrs.size ?? 0,
      mtimeMs: (entry.attrs.mtime ?? 0) * 1e3
    })).sort(compareEntries);
  }
  async mkdir(sessionId, dirPath) {
    const session = this.requireSession(sessionId);
    await new Promise((resolve, reject) => {
      session.sftp.mkdir(dirPath, (err) => err ? reject(err) : resolve());
    });
  }
  async remove(sessionId, targetPath, isDir) {
    const session = this.requireSession(sessionId);
    await new Promise((resolve, reject) => {
      const op = isDir ? session.sftp.rmdir.bind(session.sftp) : session.sftp.unlink.bind(session.sftp);
      op(targetPath, (err) => err ? reject(err) : resolve());
    });
  }
  disconnect(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    try {
      session.client.end();
    } catch {
    }
    this.sessions.delete(sessionId);
    return true;
  }
  dispose() {
    for (const session of this.sessions.values()) {
      try {
        session.client.end();
      } catch {
      }
    }
    this.sessions.clear();
  }
  requireSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`SFTP session ${sessionId} not found`);
    return session;
  }
};
function posixJoin(dir, name) {
  if (dir.endsWith("/")) return `${dir}${name}`;
  return `${dir}/${name}`;
}
function compareEntries(a, b) {
  if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
  return a.name.localeCompare(b.name, void 0, { sensitivity: "base" });
}

// src/electron/rsync-manager.ts
var import_child_process7 = require("child_process");
var import_crypto4 = require("crypto");
var import_events4 = require("events");
var import_os7 = __toESM(require("os"), 1);
var import_path10 = __toESM(require("path"), 1);
var PROGRESS_LINE = /([\d,]+)\s+(\d+)%\s+([\d.]+\S+)\s+(\d+:\d{2}:\d{2})/;
function expandHome3(filePath) {
  if (filePath.startsWith("~/")) return import_path10.default.join(import_os7.default.homedir(), filePath.slice(2));
  if (filePath === "~") return import_os7.default.homedir();
  return filePath;
}
function buildSshFlag(creds, usingPassword) {
  const parts = ["ssh", "-o", "StrictHostKeyChecking=accept-new", "-o", "ConnectTimeout=15"];
  if (!usingPassword) parts.push("-o", "BatchMode=yes");
  if (creds.port && creds.port !== 22) parts.push("-p", String(creds.port));
  if (creds.identityFile) parts.push("-i", expandHome3(creds.identityFile));
  return parts.join(" ");
}
function detectSshpass() {
  try {
    (0, import_child_process7.execFileSync)("which", ["sshpass"], { stdio: ["ignore", "pipe", "ignore"] });
    return true;
  } catch {
    return false;
  }
}
function detectRsyncMajor() {
  try {
    const output = (0, import_child_process7.execFileSync)("rsync", ["--version"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    });
    const match = output.match(/version\s+(\d+)\./);
    return match ? Number(match[1]) : 0;
  } catch {
    return 0;
  }
}
function shellQuote(value) {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}
var RsyncManager = class extends import_events4.EventEmitter {
  transfers = /* @__PURE__ */ new Map();
  sshpassAvailable = null;
  rsyncMajor = null;
  isSshpassAvailable() {
    if (this.sshpassAvailable === null) {
      this.sshpassAvailable = detectSshpass();
    }
    return this.sshpassAvailable;
  }
  getRsyncMajor() {
    if (this.rsyncMajor === null) {
      this.rsyncMajor = detectRsyncMajor();
    }
    return this.rsyncMajor;
  }
  list() {
    return Array.from(this.transfers.values()).map(stripInternal);
  }
  async start(host, options) {
    const creds = resolveCredentials(host);
    const usingPassword = Boolean(creds.password);
    if (usingPassword && !this.isSshpassAvailable()) {
      throw new Error(
        "This host needs a password, but sshpass is not installed. Install it via `brew install hudochenkov/sshpass/sshpass` or switch to key auth."
      );
    }
    const id = (0, import_crypto4.randomUUID)();
    const sshFlag = buildSshFlag(creds, usingPassword);
    const modernRsync = this.getRsyncMajor() >= 3;
    const remoteSpec = modernRsync ? `${creds.username}@${creds.hostname}:${options.remotePath}` : `${creds.username}@${creds.hostname}:${shellQuote(options.remotePath)}`;
    const rsyncArgs = ["-a"];
    if (modernRsync) {
      rsyncArgs.push("--info=progress2", "--protect-args");
    } else {
      rsyncArgs.push("--progress");
    }
    rsyncArgs.push("--partial", "-e", sshFlag);
    if (options.compress) rsyncArgs.push("--compress");
    if (options.mirror) rsyncArgs.push("--delete");
    if (options.dryRun) rsyncArgs.push("--dry-run");
    if (options.direction === "upload") {
      rsyncArgs.push(options.localPath, remoteSpec);
    } else {
      rsyncArgs.push(remoteSpec, options.localPath);
    }
    let command;
    let args;
    let env = { ...process.env };
    if (usingPassword) {
      command = "sshpass";
      args = ["-e", "rsync", ...rsyncArgs];
      env = { ...env, SSHPASS: creds.password };
    } else {
      command = "rsync";
      args = rsyncArgs;
    }
    const child = (0, import_child_process7.spawn)(command, args, { env });
    const transfer = {
      id,
      hostId: host.id,
      hostAlias: host.alias,
      direction: options.direction,
      localPath: options.localPath,
      remotePath: options.remotePath,
      options,
      state: "running",
      bytesTransferred: 0,
      percent: 0,
      bytesPerSecond: 0,
      eta: "",
      log: [],
      stderr: "",
      command: `${command} ${args.join(" ")}`,
      startedAt: Date.now(),
      process: child,
      stdoutBuffer: ""
    };
    this.transfers.set(id, transfer);
    this.emit("progress", stripInternal(transfer));
    child.stdout?.on("data", (chunk) => this.handleStdout(transfer, chunk));
    child.stderr?.on("data", (chunk) => this.handleStderr(transfer, chunk));
    child.on("error", (err) => {
      transfer.state = "error";
      transfer.error = err.message;
      transfer.finishedAt = Date.now();
      this.emit("done", stripInternal(transfer));
      this.transfers.delete(id);
    });
    child.on("close", (code) => {
      if (transfer.state === "cancelled") {
        transfer.finishedAt = Date.now();
        transfer.exitCode = code ?? void 0;
        this.emit("done", stripInternal(transfer));
        this.transfers.delete(id);
        return;
      }
      transfer.exitCode = code ?? void 0;
      transfer.finishedAt = Date.now();
      if (code === 0) {
        transfer.state = "done";
        transfer.percent = 100;
      } else {
        transfer.state = "error";
        transfer.error = transfer.stderr.trim() || `rsync exited with code ${code}`;
      }
      this.emit("done", stripInternal(transfer));
      this.transfers.delete(id);
    });
    return { transferId: id };
  }
  cancel(transferId) {
    const transfer = this.transfers.get(transferId);
    if (!transfer) return false;
    transfer.state = "cancelled";
    try {
      transfer.process.kill("SIGINT");
    } catch {
    }
    setTimeout(() => {
      const stale = this.transfers.get(transferId);
      if (stale && !stale.process.killed) {
        try {
          stale.process.kill("SIGKILL");
        } catch {
        }
      }
    }, 2e3);
    return true;
  }
  dispose() {
    for (const transfer of this.transfers.values()) {
      try {
        transfer.process.kill("SIGKILL");
      } catch {
      }
    }
    this.transfers.clear();
  }
  handleStdout(transfer, chunk) {
    transfer.stdoutBuffer += chunk.toString("utf8");
    const segments = transfer.stdoutBuffer.split(/[\r\n]+/);
    transfer.stdoutBuffer = segments.pop() ?? "";
    for (const segment of segments) {
      const trimmed = segment.trim();
      if (!trimmed) continue;
      const match = trimmed.match(PROGRESS_LINE);
      if (match) {
        transfer.bytesTransferred = Number(match[1].replace(/,/g, ""));
        transfer.percent = Number(match[2]);
        transfer.bytesPerSecond = parseRate(match[3]);
        transfer.eta = match[4];
        this.emit("progress", stripInternal(transfer));
      } else {
        transfer.log.push(trimmed);
        if (transfer.log.length > 50) transfer.log.shift();
      }
    }
  }
  handleStderr(transfer, chunk) {
    transfer.stderr += chunk.toString("utf8");
    if (transfer.stderr.length > 4e3) {
      transfer.stderr = transfer.stderr.slice(-4e3);
    }
    this.emit("progress", stripInternal(transfer));
  }
};
function stripInternal(transfer) {
  const { process: _process, stdoutBuffer: _stdout, ...rest } = transfer;
  return rest;
}
function parseRate(token) {
  const match = token.match(/^([\d.]+)([kMG]?B)\/s$/);
  if (!match) return 0;
  const value = Number(match[1]);
  const unit = match[2];
  const multiplier = unit === "GB" ? 1024 ** 3 : unit === "MB" ? 1024 ** 2 : unit === "kB" ? 1024 : 1;
  return value * multiplier;
}

// src/electron/rdp-hosts.ts
var rowToHost2 = (row) => ({
  id: row.id,
  label: row.label,
  hostname: row.hostname,
  port: row.port,
  username: row.username,
  hasPassword: Boolean(row.password_encrypted && row.password_encrypted.length > 0),
  domain: row.domain ?? void 0,
  color: row.color ?? void 0,
  notes: row.notes ?? void 0,
  extraArgs: row.extra_args ?? void 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});
var selectAll2 = `
    SELECT id, label, hostname, port, username, password_encrypted,
           domain, color, notes, extra_args, created_at, updated_at
    FROM rdp_hosts
    ORDER BY label COLLATE NOCASE ASC
`;
var selectById2 = `
    SELECT id, label, hostname, port, username, password_encrypted,
           domain, color, notes, extra_args, created_at, updated_at
    FROM rdp_hosts WHERE id = $id
`;
function rowsFromStmt2(sql, params = []) {
  const db2 = getDb();
  const stmt = db2.prepare(sql);
  try {
    stmt.bind(params);
    const result = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject());
    }
    return result;
  } finally {
    stmt.free();
  }
}
function listRdpHosts() {
  return rowsFromStmt2(selectAll2).map(rowToHost2);
}
function getRdpHost(id) {
  const rows = rowsFromStmt2(selectById2, { $id: id });
  return rows[0] ? rowToHost2(rows[0]) : null;
}
function getRdpHostPassword(id) {
  const rows = rowsFromStmt2(selectById2, { $id: id });
  if (!rows[0]) return null;
  const blob = rows[0].password_encrypted;
  if (!blob) return null;
  return decryptPassword(Buffer.from(blob));
}
async function createRdpHost(input) {
  const db2 = getDb();
  const now = Date.now();
  const encrypted = input.password ? encryptPassword(input.password) : null;
  const port = input.port ?? 3389;
  db2.run(
    `INSERT INTO rdp_hosts
            (label, hostname, port, username, password_encrypted, domain, color, notes, extra_args, created_at, updated_at)
         VALUES ($label, $hostname, $port, $username, $pwd, $domain, $color, $notes, $extra, $created, $updated)`,
    {
      $label: input.label,
      $hostname: input.hostname,
      $port: port,
      $username: input.username,
      $pwd: encrypted ?? null,
      $domain: input.domain ?? null,
      $color: input.color ?? null,
      $notes: input.notes ?? null,
      $extra: input.extraArgs ?? null,
      $created: now,
      $updated: now
    }
  );
  const result = db2.exec("SELECT last_insert_rowid() AS id");
  const id = Number(result[0]?.values[0]?.[0] ?? 0);
  await persist();
  return getRdpHost(id);
}
async function updateRdpHost(id, input) {
  const db2 = getDb();
  const now = Date.now();
  const port = input.port ?? 3389;
  const shouldUpdatePassword = input.password !== void 0 && input.password !== null;
  const newEncrypted = shouldUpdatePassword && input.password !== "" ? encryptPassword(input.password) : null;
  if (shouldUpdatePassword) {
    db2.run(
      `UPDATE rdp_hosts SET
                label=$label, hostname=$hostname, port=$port, username=$username,
                password_encrypted=$pwd, domain=$domain, color=$color, notes=$notes,
                extra_args=$extra, updated_at=$updated
             WHERE id=$id`,
      {
        $id: id,
        $label: input.label,
        $hostname: input.hostname,
        $port: port,
        $username: input.username,
        $pwd: newEncrypted ?? null,
        $domain: input.domain ?? null,
        $color: input.color ?? null,
        $notes: input.notes ?? null,
        $extra: input.extraArgs ?? null,
        $updated: now
      }
    );
  } else {
    db2.run(
      `UPDATE rdp_hosts SET
                label=$label, hostname=$hostname, port=$port, username=$username,
                domain=$domain, color=$color, notes=$notes,
                extra_args=$extra, updated_at=$updated
             WHERE id=$id`,
      {
        $id: id,
        $label: input.label,
        $hostname: input.hostname,
        $port: port,
        $username: input.username,
        $domain: input.domain ?? null,
        $color: input.color ?? null,
        $notes: input.notes ?? null,
        $extra: input.extraArgs ?? null,
        $updated: now
      }
    );
  }
  await persist();
  return getRdpHost(id);
}
async function deleteRdpHost(id) {
  const db2 = getDb();
  db2.run("DELETE FROM rdp_hosts WHERE id = $id", { $id: id });
  await persist();
  return true;
}

// src/electron/rdp-manager.ts
var import_child_process8 = require("child_process");
var import_crypto5 = require("crypto");
var import_events5 = require("events");
function detectBinary() {
  for (const candidate of ["sdl-freerdp3", "sdl-freerdp", "xfreerdp3", "xfreerdp"]) {
    try {
      (0, import_child_process8.execFileSync)("which", [candidate], { stdio: ["ignore", "pipe", "ignore"] });
      return candidate;
    } catch {
    }
  }
  return null;
}
var RdpManager = class extends import_events5.EventEmitter {
  sessions = /* @__PURE__ */ new Map();
  binary;
  getBinary() {
    if (this.binary === void 0) {
      this.binary = detectBinary();
    }
    return this.binary;
  }
  isAvailable() {
    return this.getBinary() !== null;
  }
  list() {
    return Array.from(this.sessions.values()).map((session) => ({
      id: session.id,
      hostId: session.hostId,
      label: session.label,
      hostname: session.hostname,
      port: session.port,
      pid: session.pid,
      startedAt: session.startedAt
    }));
  }
  async connect(hostId) {
    const binary = this.getBinary();
    if (!binary) {
      throw new Error(
        "xfreerdp is not installed. Run `brew install freerdp` and restart the app."
      );
    }
    const host = getRdpHost(hostId);
    if (!host) throw new Error(`RDP host ${hostId} not found`);
    const password = getRdpHostPassword(hostId);
    const args = buildArgs(host, password);
    const child = (0, import_child_process8.spawn)(binary, args, {
      detached: true,
      stdio: ["ignore", "ignore", "pipe"]
    });
    if (typeof child.unref === "function") child.unref();
    const id = (0, import_crypto5.randomUUID)();
    const session = {
      id,
      hostId: host.id,
      label: host.label,
      hostname: host.hostname,
      port: host.port,
      pid: child.pid ?? -1,
      startedAt: Date.now(),
      process: child,
      stderrBuffer: ""
    };
    this.sessions.set(id, session);
    this.emit("active-changed", this.list());
    child.stderr?.on("data", (chunk) => {
      session.stderrBuffer += chunk.toString("utf8");
      if (session.stderrBuffer.length > 4e3) {
        session.stderrBuffer = session.stderrBuffer.slice(-4e3);
      }
    });
    child.on("error", (err) => {
      this.sessions.delete(id);
      this.emit("active-changed", this.list());
      this.emit("exit", {
        sessionId: id,
        hostId: host.id,
        error: err.message,
        stderr: session.stderrBuffer
      });
    });
    child.on("close", (code) => {
      this.sessions.delete(id);
      this.emit("active-changed", this.list());
      this.emit("exit", {
        sessionId: id,
        hostId: host.id,
        exitCode: code,
        stderr: session.stderrBuffer
      });
    });
    return { sessionId: id };
  }
  disconnect(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    try {
      session.process.kill("SIGTERM");
    } catch {
    }
    setTimeout(() => {
      if (this.sessions.has(sessionId)) {
        try {
          session.process.kill("SIGKILL");
        } catch {
        }
      }
    }, 2e3);
    return true;
  }
  dispose() {
    for (const session of this.sessions.values()) {
      try {
        session.process.kill("SIGTERM");
      } catch {
      }
    }
    this.sessions.clear();
  }
};
function buildArgs(host, password) {
  const args = [];
  args.push(`/v:${host.hostname}:${host.port}`);
  args.push(`/u:${host.username}`);
  if (host.domain) args.push(`/d:${host.domain}`);
  if (password) args.push(`/p:${password}`);
  args.push("/cert:ignore", "+clipboard", "/dynamic-resolution");
  if (host.extraArgs) {
    const tokens = host.extraArgs.split(/\s+/).map((token) => token.trim()).filter(Boolean);
    args.push(...tokens);
  }
  return args;
}

// src/electron/disk-scanner.ts
var import_fs7 = require("fs");
var import_promises6 = require("fs/promises");
var import_path11 = __toESM(require("path"), 1);
var import_events6 = require("events");
var SKIP_BASENAMES = /* @__PURE__ */ new Set([
  ".Spotlight-V100",
  ".Trashes",
  ".fseventsd",
  ".DocumentRevisions-V100",
  ".TemporaryItems",
  ".MobileBackups",
  ".PKInstallSandboxManager",
  ".HFS+ Private Directory Data"
]);
var SKIP_PATH_PREFIXES = [
  "/dev",
  "/Volumes",
  "/private/var/folders",
  "/.vol",
  "/System/Volumes/VM",
  "/System/Volumes/Preboot",
  "/System/Volumes/Update"
];
var SKIP_PATH_CONTAINS = [
  "/Library/Mobile Documents",
  "/.MobileBackups",
  "/.PreviousSystemInformation",
  "/Library/Application Support/MobileSync",
  "/Library/CloudStorage"
];
function shouldSkip(filePath, basename) {
  if (SKIP_BASENAMES.has(basename)) return true;
  for (const prefix of SKIP_PATH_PREFIXES) {
    if (filePath === prefix || filePath.startsWith(prefix + "/")) return true;
  }
  for (const fragment of SKIP_PATH_CONTAINS) {
    if (filePath.includes(fragment)) return true;
  }
  return false;
}
var KEEP_DEPTH = 12;
var PROGRESS_EVERY_PATHS = 250;
var FS_TIMEOUT_MS = 5e3;
var MAX_CONCURRENT_FS = 32;
var Semaphore = class {
  active = 0;
  waiters = [];
  max;
  constructor(max) {
    this.max = max;
  }
  async acquire() {
    if (this.active >= this.max) {
      await new Promise((resolve) => this.waiters.push(resolve));
    }
    this.active += 1;
  }
  release() {
    this.active -= 1;
    const next = this.waiters.shift();
    if (next) next();
  }
};
async function withTimeout(promise, ms) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((resolve) => {
        timer = setTimeout(() => resolve(null), ms);
      })
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
function emitProgress(ctx) {
  ctx.emitter.emit("progress", {
    pathsSeen: ctx.pathsSeen,
    bytesSoFar: ctx.bytesSoFar
  });
}
var CancelledError = class extends Error {
  constructor() {
    super("cancelled");
    this.name = "CancelledError";
  }
};
async function walk(dirPath, depth, ctx) {
  if (ctx.cancelled.value) throw new CancelledError();
  const baseName = import_path11.default.basename(dirPath) || dirPath;
  if (depth > 0 && shouldSkip(dirPath, baseName)) {
    return { name: baseName, path: dirPath, size: 0, isDir: true };
  }
  ctx.pathsSeen += 1;
  if (ctx.pathsSeen % PROGRESS_EVERY_PATHS === 0) emitProgress(ctx);
  let filesBytes = 0;
  const subdirPaths = [];
  await ctx.sem.acquire();
  try {
    const dir = await withTimeout((0, import_promises6.opendir)(dirPath), FS_TIMEOUT_MS);
    if (!dir) {
      return { name: baseName, path: dirPath, size: 0, isDir: true };
    }
    try {
      for await (const entry of dir) {
        if (ctx.cancelled.value) break;
        if (entry.isSymbolicLink()) continue;
        const full = import_path11.default.join(dirPath, entry.name);
        if (shouldSkip(full, entry.name)) continue;
        if (entry.isDirectory()) {
          subdirPaths.push(full);
        } else if (entry.isFile()) {
          const stats = await withTimeout((0, import_promises6.lstat)(full), FS_TIMEOUT_MS);
          if (stats) {
            filesBytes += stats.size;
            ctx.bytesSoFar += stats.size;
          }
        }
      }
    } catch {
    }
  } catch {
  } finally {
    ctx.sem.release();
  }
  if (ctx.cancelled.value) throw new CancelledError();
  const children2 = await Promise.all(
    subdirPaths.map((p) => walk(p, depth + 1, ctx))
  );
  const subSize = children2.reduce((sum, child) => sum + child.size, 0);
  const totalSize = filesBytes + subSize;
  if (depth >= KEEP_DEPTH) {
    return { name: baseName, path: dirPath, size: totalSize, isDir: true };
  }
  const kept = children2.filter((child) => child.size > 0);
  if (filesBytes > 0) {
    kept.push({
      name: "(files)",
      path: `${dirPath}/.files`,
      size: filesBytes,
      isDir: false
    });
  }
  kept.sort((a, b) => b.size - a.size);
  return {
    name: baseName,
    path: dirPath,
    size: totalSize,
    isDir: true,
    children: kept
  };
}
var DiskScanner = class extends import_events6.EventEmitter {
  currentCancel = null;
  isScanning() {
    return this.currentCancel !== null;
  }
  cancel() {
    if (this.currentCancel) this.currentCancel.value = true;
    this.currentCancel = null;
  }
  resolveRoot(requested) {
    if (!requested || requested === "/") {
      if ((0, import_fs7.existsSync)("/System/Volumes/Data")) return "/System/Volumes/Data";
    }
    return requested;
  }
  async scan(rootPath) {
    this.cancel();
    const resolvedRoot = this.resolveRoot(rootPath);
    const cancelled = { value: false };
    this.currentCancel = cancelled;
    const ctx = {
      sem: new Semaphore(MAX_CONCURRENT_FS),
      cancelled,
      pathsSeen: 0,
      bytesSoFar: 0,
      emitter: this
    };
    try {
      const tree = await walk(resolvedRoot, 0, ctx);
      emitProgress(ctx);
      return tree;
    } catch (err) {
      if (err instanceof CancelledError) return null;
      throw err;
    } finally {
      if (this.currentCancel === cancelled) this.currentCancel = null;
    }
  }
};

// main.js
var EXTRA_PATHS = [
  "/opt/homebrew/bin",
  "/opt/homebrew/sbin",
  "/usr/local/bin",
  "/usr/local/sbin",
  import_path12.default.join(import_os8.default.homedir(), ".docker/bin"),
  "/Applications/Docker.app/Contents/Resources/bin"
];
process.env.PATH = [...EXTRA_PATHS, process.env.PATH ?? ""].filter(Boolean).join(":");
if (!process.env.UV_THREADPOOL_SIZE) {
  process.env.UV_THREADPOOL_SIZE = "32";
}
var __dirname2 = import_path12.default.dirname((0, import_url2.fileURLToPath)(__cjs_meta_url));
var devServerUrl = process.env.VITE_DEV_SERVER_URL;
var isDev = Boolean(devServerUrl);
var preloadPath = import_electron5.app.isPackaged ? import_path12.default.join(__dirname2, "preload.cjs") : import_path12.default.join(__dirname2, "src", "electron", "preload.cjs");
var rendererIndex = import_electron5.app.isPackaged ? import_path12.default.join(__dirname2, "..", "dist", "index.html") : import_path12.default.join(__dirname2, "dist", "index.html");
var mainWindow;
var popupWindow;
var tray;
var isQuitting = false;
var bluetoothManager;
var registeredHotkey = null;
var hotkeyError = null;
var POPUP_WIDTH = 380;
var POPUP_HEIGHT = 560;
var mediaManager = new MediaManager();
var systemMonitor = new SystemMonitor();
var mediaTracker = new MediaTracker(mediaManager);
var sshManager = new SshManager();
var dockerManager = new DockerManager();
var sftpManager = new SftpManager();
var rsyncManager = new RsyncManager();
var rdpManager = new RdpManager();
var diskScanner = new DiskScanner();
diskScanner.on("progress", (payload) => broadcast("disk:scan-progress", payload));
rsyncManager.on("progress", (payload) => broadcast("transfer:progress", payload));
rsyncManager.on("done", (payload) => broadcast("transfer:done", payload));
rdpManager.on("active-changed", (payload) => broadcast("rdp:active-changed", payload));
rdpManager.on("exit", (payload) => broadcast("rdp:session-exit", payload));
var rendererWindows = /* @__PURE__ */ new Set();
var detachedSessions = /* @__PURE__ */ new Map();
function registerRendererWindow(win) {
  rendererWindows.add(win);
  win.on("closed", () => rendererWindows.delete(win));
}
function broadcast(channel, payload) {
  for (const win of rendererWindows) {
    if (!win.isDestroyed()) {
      win.webContents.send(channel, payload);
    }
  }
}
sshManager.on("data", (payload) => broadcast("ssh:session-data", payload));
sshManager.on("exit", (payload) => {
  broadcast("ssh:session-exit", payload);
  const detached = detachedSessions.get(payload.sessionId);
  if (detached && !detached.isDestroyed()) {
    detached.close();
  }
  detachedSessions.delete(payload.sessionId);
});
dockerManager.on("exec-data", (payload) => broadcast("ssh:session-data", payload));
dockerManager.on("exec-exit", (payload) => broadcast("ssh:session-exit", payload));
async function waitForDevServer(url) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}
async function createMainWindow() {
  mainWindow = new import_electron5.BrowserWindow({
    width: 1280,
    height: 720,
    center: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath
    },
    titleBarStyle: "hiddenInset",
    vibrancy: "under-window",
    visualEffectState: "active"
  });
  registerRendererWindow(mainWindow);
  if (process.platform === "darwin") {
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  }
  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
  if (isDev) {
    await waitForDevServer(devServerUrl);
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(rendererIndex);
  }
}
function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createMainWindow().then(() => {
      mainWindow.once("ready-to-show", () => {
        mainWindow.show();
        mainWindow.focus();
        if (process.platform === "darwin") import_electron5.app.focus({ steal: true });
      });
    });
    return;
  }
  mainWindow.show();
  mainWindow.focus();
  if (process.platform === "darwin") import_electron5.app.focus({ steal: true });
}
async function ensurePopupWindow() {
  if (popupWindow && !popupWindow.isDestroyed()) return;
  await createPopupWindow();
  if (popupWindow && !popupWindow.isVisible()) {
    await new Promise((resolve) => popupWindow.once("ready-to-show", resolve));
  }
}
async function createPopupWindow() {
  popupWindow = new import_electron5.BrowserWindow({
    width: POPUP_WIDTH,
    height: POPUP_HEIGHT,
    show: false,
    frame: false,
    // NSPanel-backed window — same architecture as Docker Desktop,
    // Postman, Telegram menubar popups. Doesn't activate the app and
    // floats over all Spaces (including fullscreen).
    type: process.platform === "darwin" ? "panel" : void 0,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    hasShadow: true,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath
    },
    vibrancy: "popover",
    visualEffectState: "active"
  });
  registerRendererWindow(popupWindow);
  popupWindow.setWindowButtonVisibility?.(false);
  popupWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  popupWindow.setAlwaysOnTop(true, "screen-saver");
  popupWindow.on("blur", () => {
    if (!popupWindow.isDestroyed() && popupWindow.isVisible()) {
      popupWindow.hide();
    }
  });
  const params = new URLSearchParams({ view: "popup" });
  if (isDev) {
    await waitForDevServer(devServerUrl);
    popupWindow.loadURL(`${devServerUrl}/?${params.toString()}`);
  } else {
    popupWindow.loadFile(rendererIndex, {
      search: `?${params.toString()}`
    });
  }
}
function positionPopupNearTray() {
  if (!popupWindow || !tray) return;
  const trayBounds = tray.getBounds();
  const display = import_electron5.screen.getDisplayNearestPoint({
    x: trayBounds.x,
    y: trayBounds.y
  });
  const work = display.workArea;
  let x = Math.round(trayBounds.x + trayBounds.width / 2 - POPUP_WIDTH / 2);
  x = Math.max(work.x + 8, Math.min(work.x + work.width - POPUP_WIDTH - 8, x));
  const y = Math.round(trayBounds.y + trayBounds.height + 4);
  popupWindow.setBounds({ x, y, width: POPUP_WIDTH, height: POPUP_HEIGHT });
}
async function togglePopup() {
  if (popupWindow && !popupWindow.isDestroyed() && popupWindow.isVisible()) {
    popupWindow.hide();
    return;
  }
  await ensurePopupWindow();
  if (!popupWindow || popupWindow.isDestroyed()) return;
  positionPopupNearTray();
  popupWindow.show();
  popupWindow.focus();
  if (process.platform === "darwin") {
    import_electron5.app.focus({ steal: true });
  }
}
function toggleMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    showMainWindow();
    return;
  }
  if (mainWindow.isVisible() && mainWindow.isFocused()) {
    mainWindow.hide();
    return;
  }
  showMainWindow();
}
function applyHotkey(settings) {
  if (registeredHotkey) {
    try {
      import_electron5.globalShortcut.unregister(registeredHotkey);
    } catch {
    }
    registeredHotkey = null;
  }
  hotkeyError = null;
  const hk = settings?.hotkey;
  if (!hk?.enabled || !hk?.combo) {
    return { ok: true, registered: false, combo: null, error: null };
  }
  try {
    const ok = import_electron5.globalShortcut.register(hk.combo, () => toggleMainWindow());
    if (!ok) {
      hotkeyError = `Shortcut "${hk.combo}" is already taken by another app`;
      return { ok: false, registered: false, combo: hk.combo, error: hotkeyError };
    }
    registeredHotkey = hk.combo;
    return { ok: true, registered: true, combo: hk.combo, error: null };
  } catch (err) {
    hotkeyError = err?.message ?? String(err);
    return { ok: false, registered: false, combo: hk.combo, error: hotkeyError };
  }
}
function createTray() {
  tray = new import_electron5.Tray(import_electron5.nativeImage.createEmpty());
  tray.setTitle("\u25C9");
  tray.setToolTip("Control Center");
  const buildMenu = () => import_electron5.Menu.buildFromTemplate([
    { label: "Open popup", click: togglePopup },
    { label: "Open main window", click: showMainWindow },
    { type: "separator" },
    {
      label: "Quit",
      accelerator: "Command+Q",
      click: () => {
        isQuitting = true;
        import_electron5.app.quit();
      }
    }
  ]);
  tray.on("click", togglePopup);
  tray.on("right-click", () => tray.popUpContextMenu(buildMenu()));
}
async function createDetachedWindow(sessionId, hostMeta) {
  const win = new import_electron5.BrowserWindow({
    width: 900,
    height: 600,
    title: hostMeta?.alias ? `SSH \xB7 ${hostMeta.alias}` : "SSH Session",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath
    },
    titleBarStyle: "hiddenInset"
  });
  registerRendererWindow(win);
  detachedSessions.set(sessionId, win);
  const params = new URLSearchParams({
    session: sessionId,
    alias: hostMeta?.alias ?? "",
    user: hostMeta?.user ?? "",
    hostname: hostMeta?.hostname ?? "",
    port: hostMeta?.port ? String(hostMeta.port) : ""
  });
  if (isDev) {
    await waitForDevServer(devServerUrl);
    win.loadURL(`${devServerUrl}/?${params.toString()}`);
  } else {
    win.loadFile(rendererIndex, {
      search: `?${params.toString()}`
    });
  }
  win.on("closed", () => {
    detachedSessions.delete(sessionId);
    sshManager.close(sessionId);
  });
}
async function initBluetoothManager() {
  bluetoothManager = new BluetoothManager();
  bluetoothManager.on("devices-updated", (devices) => broadcast("bluetooth:devices-updated", devices));
  bluetoothManager.on("connection-changed", (data) => broadcast("bluetooth:connection-changed", data));
  bluetoothManager.on("battery-updated", (data) => broadcast("bluetooth:battery-updated", data));
  bluetoothManager.on("error", (error) => broadcast("bluetooth:error", error));
  bluetoothManager.on("scan-started", () => broadcast("bluetooth:scan-started"));
  bluetoothManager.on("scan-completed", () => broadcast("bluetooth:scan-completed"));
  await bluetoothManager.startMonitoring();
}
async function whenBluetoothReady() {
  if (bluetoothManager) return bluetoothManager;
  for (let i = 0; i < 50; i += 1) {
    if (bluetoothManager) return bluetoothManager;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return null;
}
import_electron5.ipcMain.handle("bluetooth:get-devices", async () => {
  const mgr = await whenBluetoothReady();
  if (!mgr) return { connected: [], notConnected: [], timestamp: Date.now() };
  return await mgr.getDevices();
});
import_electron5.ipcMain.handle("bluetooth:connect-device", async (event, address) => {
  const mgr = await whenBluetoothReady();
  if (!mgr) return { success: false, error: "Bluetooth not ready" };
  return await mgr.connectDevice(address);
});
import_electron5.ipcMain.handle("bluetooth:disconnect-device", async (event, address) => {
  const mgr = await whenBluetoothReady();
  if (!mgr) return { success: false, error: "Bluetooth not ready" };
  return await mgr.disconnectDevice(address);
});
import_electron5.ipcMain.handle("bluetooth:forget-device", async (event, address) => {
  const mgr = await whenBluetoothReady();
  if (!mgr) return { success: false, error: "Bluetooth not ready" };
  return await mgr.forgetDevice(address);
});
import_electron5.ipcMain.handle("bluetooth:scan-devices", async (event, duration = 5) => {
  const mgr = await whenBluetoothReady();
  if (!mgr) return { success: false, error: "Bluetooth not ready" };
  return await mgr.scanForDevices(duration);
});
import_electron5.ipcMain.handle("bluetooth:get-battery", async (event, address) => {
  const mgr = await whenBluetoothReady();
  if (!mgr) return null;
  return await mgr.getBatteryLevel(address);
});
import_electron5.ipcMain.handle("media:get-now-playing", async () => {
  return await mediaManager.getAllNowPlaying();
});
import_electron5.ipcMain.handle("media:control", async (event, action, bundleId) => {
  return await mediaManager.control(action, bundleId);
});
import_electron5.ipcMain.handle("media:list-history", async (event, limit) => {
  return listHistory(typeof limit === "number" ? limit : 50);
});
import_electron5.ipcMain.handle("media:stats", async () => {
  return getStats();
});
import_electron5.ipcMain.handle("media:clear-history", async () => {
  await clearHistory();
  return true;
});
import_electron5.ipcMain.handle("media:clear-all-stats", async () => {
  await clearAllStats();
  return true;
});
import_electron5.ipcMain.handle("media:list-artists", async (event, limit) => {
  return listArtistGroups(typeof limit === "number" ? limit : 30);
});
import_electron5.ipcMain.handle("system:get-metrics", async () => {
  return await systemMonitor.getMetrics();
});
import_electron5.ipcMain.handle("system:list-processes", async () => {
  return await systemMonitor.listAllProcesses();
});
import_electron5.ipcMain.handle("system:kill-process", async (event, pid, signal) => {
  return systemMonitor.killProcess(pid, signal);
});
import_electron5.ipcMain.handle("disk:scan", async (event, rootPath, depth) => {
  return await diskScanner.scan(rootPath || "/", typeof depth === "number" ? depth : 4);
});
import_electron5.ipcMain.handle("disk:cancel-scan", async () => {
  diskScanner.cancel();
  return true;
});
var appIconCache = /* @__PURE__ */ new Map();
import_electron5.ipcMain.handle("system:get-app-icon", async (event, appPath) => {
  if (typeof appPath !== "string" || !appPath.endsWith(".app")) {
    return null;
  }
  if (appIconCache.has(appPath)) {
    return appIconCache.get(appPath);
  }
  try {
    const icon = await import_electron5.app.getFileIcon(appPath, { size: "small" });
    const dataUrl = icon.toDataURL();
    appIconCache.set(appPath, dataUrl);
    return dataUrl;
  } catch {
    appIconCache.set(appPath, null);
    return null;
  }
});
import_electron5.ipcMain.handle("ssh:list-hosts", async () => {
  return await listAllSshHosts();
});
import_electron5.ipcMain.handle("ssh:create-session", async (event, host, cols, rows) => {
  return await sshManager.create(host, cols, rows);
});
import_electron5.ipcMain.handle("ssh:list-saved", async () => {
  return listSavedHosts();
});
import_electron5.ipcMain.handle("ssh:create-saved", async (event, input) => {
  return await createSavedHost(input);
});
import_electron5.ipcMain.handle("ssh:update-saved", async (event, id, input) => {
  return await updateSavedHost(id, input);
});
import_electron5.ipcMain.handle("ssh:delete-saved", async (event, id) => {
  return await deleteSavedHost(id);
});
import_electron5.ipcMain.handle("ssh:encryption-available", async () => {
  return isCredentialEncryptionAvailable();
});
import_electron5.ipcMain.handle("ssh:set-override", async (event, hostId, patch) => {
  return await upsertOverride(hostId, patch);
});
import_electron5.ipcMain.handle("ssh:delete-override", async (event, hostId) => {
  await deleteOverride(hostId);
  return true;
});
import_electron5.ipcMain.handle("ssh:remove-known-host", async (event, hostname) => {
  return await removeFromKnownHosts(hostname);
});
import_electron5.ipcMain.handle("ssh:list-forwards", async (event, hostId) => {
  return listPortForwards(hostId);
});
import_electron5.ipcMain.handle("ssh:create-forward", async (event, hostId, input) => {
  return await createPortForward(hostId, input);
});
import_electron5.ipcMain.handle("ssh:update-forward", async (event, id, patch) => {
  await updatePortForward(id, patch);
  return true;
});
import_electron5.ipcMain.handle("ssh:delete-forward", async (event, id) => {
  await deletePortForward(id);
  return true;
});
import_electron5.ipcMain.handle("ssh:write", async (event, sessionId, data) => {
  if (dockerManager.ownsExec(sessionId)) {
    return dockerManager.writeExec(sessionId, data);
  }
  return sshManager.write(sessionId, data);
});
import_electron5.ipcMain.handle("ssh:resize", async (event, sessionId, cols, rows) => {
  if (dockerManager.ownsExec(sessionId)) {
    return dockerManager.resizeExec(sessionId, cols, rows);
  }
  return sshManager.resize(sessionId, cols, rows);
});
import_electron5.ipcMain.handle("ssh:close-session", async (event, sessionId) => {
  if (dockerManager.ownsExec(sessionId)) {
    return dockerManager.closeExec(sessionId);
  }
  return sshManager.close(sessionId);
});
import_electron5.ipcMain.handle("ssh:list-active", async () => {
  return sshManager.list();
});
import_electron5.ipcMain.handle("app:show-main", async () => {
  showMainWindow();
  if (popupWindow && !popupWindow.isDestroyed()) {
    popupWindow.hide();
  }
  return true;
});
import_electron5.ipcMain.handle("app:hide-popup", async () => {
  if (popupWindow && !popupWindow.isDestroyed()) {
    popupWindow.hide();
  }
  return true;
});
import_electron5.ipcMain.handle("settings:get", async () => {
  return await loadSettings();
});
import_electron5.ipcMain.handle("settings:update", async (event, patch) => {
  const next = await updateSettings(patch);
  if (patch?.hotkey) applyHotkey(next);
  broadcast("settings:changed", next);
  return next;
});
import_electron5.ipcMain.handle("hotkey:status", () => ({
  registered: Boolean(registeredHotkey),
  combo: registeredHotkey,
  error: hotkeyError
}));
import_electron5.ipcMain.handle("db:get-stats", async () => {
  return await getDbStats();
});
import_electron5.ipcMain.handle("db:clear-tables", async (event, groups) => {
  return await clearTables(Array.isArray(groups) ? groups : []);
});
import_electron5.ipcMain.handle("files:local-home", async () => {
  return localHome();
});
import_electron5.ipcMain.handle("files:local-list", async (event, dirPath) => {
  return await listLocal(dirPath);
});
import_electron5.ipcMain.handle("files:remote-connect", async (event, host) => {
  return await sftpManager.connect(host);
});
import_electron5.ipcMain.handle("files:remote-list", async (event, sessionId, dirPath) => {
  return await sftpManager.list(sessionId, dirPath);
});
import_electron5.ipcMain.handle("files:remote-disconnect", async (event, sessionId) => {
  return sftpManager.disconnect(sessionId);
});
import_electron5.ipcMain.handle("transfer:start", async (event, hostId, options) => {
  const all = await listAllSshHosts();
  const host = [...all.visible, ...all.hidden].find((h) => h.id === hostId);
  if (!host) throw new Error(`Host ${hostId} not found`);
  return await rsyncManager.start(host, options);
});
import_electron5.ipcMain.handle("transfer:cancel", async (event, transferId) => {
  return rsyncManager.cancel(transferId);
});
import_electron5.ipcMain.handle("transfer:list", async () => {
  return rsyncManager.list();
});
import_electron5.ipcMain.handle("transfer:sshpass-available", async () => {
  return rsyncManager.isSshpassAvailable();
});
import_electron5.ipcMain.handle("rdp:list", async () => {
  return listRdpHosts();
});
import_electron5.ipcMain.handle("rdp:create", async (event, input) => {
  return await createRdpHost(input);
});
import_electron5.ipcMain.handle("rdp:update", async (event, id, input) => {
  return await updateRdpHost(id, input);
});
import_electron5.ipcMain.handle("rdp:delete", async (event, id) => {
  return await deleteRdpHost(id);
});
import_electron5.ipcMain.handle("rdp:connect", async (event, hostId) => {
  return await rdpManager.connect(hostId);
});
import_electron5.ipcMain.handle("rdp:disconnect", async (event, sessionId) => {
  return rdpManager.disconnect(sessionId);
});
import_electron5.ipcMain.handle("rdp:list-active", async () => {
  return rdpManager.list();
});
import_electron5.ipcMain.handle("rdp:available", async () => {
  return { available: rdpManager.isAvailable(), binary: rdpManager.getBinary() };
});
import_electron5.ipcMain.handle("docker:status", async () => {
  return dockerManager.isAvailable();
});
import_electron5.ipcMain.handle("docker:list-containers", async () => {
  return dockerManager.listContainers();
});
import_electron5.ipcMain.handle("docker:list-images", async () => {
  return dockerManager.listImages();
});
import_electron5.ipcMain.handle("docker:list-volumes", async () => {
  return dockerManager.listVolumes();
});
import_electron5.ipcMain.handle("docker:list-networks", async () => {
  return dockerManager.listNetworks();
});
import_electron5.ipcMain.handle("docker:run-image", async (event, options) => {
  return dockerManager.runImage(options);
});
import_electron5.ipcMain.handle("docker:start-container", async (event, id) => {
  await dockerManager.startContainer(id);
  return true;
});
import_electron5.ipcMain.handle("docker:stop-container", async (event, id) => {
  await dockerManager.stopContainer(id);
  return true;
});
import_electron5.ipcMain.handle("docker:restart-container", async (event, id) => {
  await dockerManager.restartContainer(id);
  return true;
});
import_electron5.ipcMain.handle("docker:remove-container", async (event, id, force) => {
  await dockerManager.removeContainer(id, Boolean(force));
  return true;
});
import_electron5.ipcMain.handle("docker:remove-image", async (event, id, force) => {
  await dockerManager.removeImage(id, Boolean(force));
  return true;
});
import_electron5.ipcMain.handle("docker:remove-volume", async (event, name, force) => {
  await dockerManager.removeVolume(name, Boolean(force));
  return true;
});
import_electron5.ipcMain.handle("docker:remove-network", async (event, name) => {
  await dockerManager.removeNetwork(name);
  return true;
});
import_electron5.ipcMain.handle("docker:prune-containers", async () => {
  return dockerManager.pruneContainers();
});
import_electron5.ipcMain.handle("docker:prune-images", async (event, all) => {
  return dockerManager.pruneImages(Boolean(all));
});
import_electron5.ipcMain.handle("docker:prune-volumes", async () => {
  return dockerManager.pruneVolumes();
});
import_electron5.ipcMain.handle("docker:prune-networks", async () => {
  return dockerManager.pruneNetworks();
});
import_electron5.ipcMain.handle("docker:prune-system", async (event, all) => {
  return dockerManager.pruneSystem(Boolean(all));
});
import_electron5.ipcMain.handle("docker:logs", async (event, id, tail) => {
  return dockerManager.getLogs(id, typeof tail === "number" ? tail : 500);
});
import_electron5.ipcMain.handle("docker:exec-start", async (event, containerId, containerName, cols, rows) => {
  return dockerManager.startExec(containerId, containerName, cols, rows);
});
import_electron5.ipcMain.handle("ssh:detach-session", async (event, sessionId, hostMeta) => {
  if (detachedSessions.has(sessionId)) {
    const existing = detachedSessions.get(sessionId);
    if (!existing.isDestroyed()) existing.focus();
    return { success: true };
  }
  await createDetachedWindow(sessionId, hostMeta);
  return { success: true };
});
function logFatal(stage, err) {
  try {
    const logPath = import_path12.default.join(import_electron5.app.getPath("userData"), "fatal.log");
    const line = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${stage}: ${err?.stack ?? err}
`;
    (0, import_fs8.appendFileSync)(logPath, line);
  } catch {
    console.error(stage, err);
  }
}
process.on("uncaughtException", (err) => logFatal("uncaughtException", err));
process.on("unhandledRejection", (err) => logFatal("unhandledRejection", err));
import_electron5.app.whenReady().then(async () => {
  try {
    await initDb();
    const settings = await loadSettings();
    await purgeOldHistory();
    await createMainWindow();
    createTray();
    applyHotkey(settings);
    initBluetoothManager();
    mediaTracker.start();
  } catch (err) {
    logFatal("whenReady", err);
    throw err;
  }
});
import_electron5.app.on("activate", () => {
  showMainWindow();
});
import_electron5.app.on("before-quit", () => {
  isQuitting = true;
});
import_electron5.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    import_electron5.app.quit();
  }
});
import_electron5.app.on("will-quit", async () => {
  import_electron5.globalShortcut.unregisterAll();
  if (bluetoothManager) {
    bluetoothManager.stopMonitoring();
  }
  sshManager.dispose();
  dockerManager.dispose();
  sftpManager.dispose();
  rsyncManager.dispose();
  rdpManager.dispose();
  diskScanner.cancel();
  await mediaTracker.stop();
  await closeDb();
});
//# sourceMappingURL=main.cjs.map
