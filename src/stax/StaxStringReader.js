import { createDOMNodePrototype } from '../dom/DomNode.js';
import { createDOMDocumentTypePrototype } from '../dom/DomDocumentTypeNode.js';
import { createDOMElementPrototype } from '../dom/DomElementNode.js';
import { createDOMEndElementPrototype } from '../dom/DomElementEnd.js';
import { createDOMCharacterDataPrototype } from '../dom/DomCharacterDataNode.js';
import { createDOMTextPrototype } from '../dom/DomTextNode.js';
import { createDOMCommentPrototype } from '../dom/DomCommentNode.js';
import { createDOMCDataPrototype } from '../dom/DomCDataSectionNode.js';
import { createDOMPIPrototype } from '../dom/DomProcessingInstructionNode.js';
import { createDOMAttributePrototype } from '../dom/DomAttributeNode.js';
import { createDOMDocumentPrototype } from '../dom/DomDocumentNode.js';

var defaultOptions = {};

var StaxStringReader = function(string, options){
  _string: switch (typeof string) {
    case 'string':
      switch (typeof options) {
        case 'object':
          break _string;
        case 'undefined':
          options = undefined;
          break _string;
        default:
          this.throwError(`Options argument must be of type object, not ${typeof options}`);
          break _string;
      }
    case 'object':       
      switch (typeof options) {
        case 'string':
          var s = options;
          options = string;
          string = s;
          break _string;
        case 'undefined':
          options = string;
          string = options.string || undefined;
          break _string;
        default:
          this.throwError(`Invalid type: ${typeof options}`);
          break _string;
      }
    case 'undefined':
      switch (typeof options) {
        case 'object':
          string = options.string;
          break _string;
        case 'string':
          string = options;
          options = undefined;
          break _string;
        case undefined:
          break _string;
        default:
          this.throwError(`Invalid type: ${typeof options}`);
      }
  }
  if (options === undefined){
    options = { __proto__: defaultOptions};
  }
  this.options = options;
  
  if (this.options.chainNodes) {
    this.chainNodes = this.options.chainNodes;
  }
  if (this.options.saxHandler) {
    if (typeof(this.options.saxHandler) !== 'function'){
      this.throwError('config option saxHandler must be a function.');
    }
    this.setSaxHandler(this.options.saxHandler);
  }
  this.endElementDetector = /[^\s>"']+(\s*[^\s<>'"]+\s*=\s*('[^<']*'|"[^<"]*"))?\s*\/?>/g;
  this.documentTypePattern = /^<!DOCTYPE\s+[^\s[>]+(\s+(SYSTEM|PUBLIC\s+("[^"]*"|'[^']*'))\s+("[^"]*"|'[^']*'))?\s*(\[(<!ELEMENT\s+[^\s>]+(\s+[^\s>]+)*\s*>|<!ATTLIST\s+[^\s>]+(\s+[^\s>]+\s+(CDATA|ID(REFS?)?|ENTIT(Y|IES)|NMTOKENS?|NOTATION\s+\(\s*[^\s|)]+(\s*\|\s*[^)|>(\s]+)*\s*\)|\(\s*[^()|\s>]+(\s*\|\s*[^()|\s>]+)*\s*\))\s+(#REQUIRED|#IMPLIED|((#FIXED\s+)?("[^"]+"|'[^']+'))))*\s*>|<!ENTITY\s+([^\s]+\s+(("[^"]*"|'[^']*')|(SYSTEM|PUBLIC\s+("[^"]*"|'[^']*')(\s+NDATA\s+[^s]+)?)\s+("[^"]*"|'[^']*'))|%\s+[^s]+\s(("[^"]*"|'[^']*')|(SYSTEM|PUBLIC\s+("[^"]*"|'[^']*'))\s+("[^"]*"|'[^']*')))\s*>|<!NOTATION\s+[^\s]+\s+()\s*>|<\?[^?]+\?>|<!--([^-]|-[^-])*-->|%[^;]+;|\s+)*]*\]\s*)?>/;

  this.reset(string);
};

StaxStringReader.prototype = {
  CONTENT_FOUND_AFTER_DOCUMENT_ELEMENT_PARSE_EXCEPTION: 'Exception: Non-whitespace content found after the document element.',
  DANGLING_LESS_THAN_PARSE_EXCEPTION: 'Exception: Dangling < at end of input',
  UNCLOSED_END_TAG_PARSE_EXCEPTION: 'Exception: Unclosed element end tag.',
  MALFORMED_DOCTYPE_DECLARATION_PARSE_EXCEPTION: 'Exception: Expected document type declaration.',
  EXPECTED_COMMENT_CDATA_DOCTYPE_PARSE_ERROR: 'Error: Expected start of comment or CDATA section or DOCTYPE.',
  UNCLOSED_COMMENT_PARSE_EXCEPTION: 'Error: Unclosed comment.',
  UNCLOSED_CDATA_PARSE_EXCEPTION: 'Error: Unclosed CDATA section.',
  UNCLOSED_PROCESSING_INSTRUCTION_PARSE_EXCEPTION: 'Exception: Unclosed processing instruction or xml declaration.',
  UNCLOSED_ELEMENT_START_TAG_PARSE_ERROR: 'Error: Unclosed element startag',
  UNCLOSED_ELEMENT_START_TAG_PARSE_EXCEPTION: 'Exception: Unclosed element startag',
  initNodePrototypes: function(){
    var baseNode = this.baseNode = createDOMNodePrototype({s: this.string});
    var attributePrototype = createDOMAttributePrototype({ __proto__: baseNode});
    this.elementPrototype = createDOMElementPrototype({ __proto__: baseNode, a: attributePrototype});
    this.endElementPrototype = createDOMEndElementPrototype({ __proto__: baseNode});
    var characterDataProtoType = createDOMCharacterDataPrototype({ __proto__: baseNode});
    this.textPrototype = createDOMTextPrototype({__proto__: characterDataProtoType});
    this.cdataPrototype = createDOMCDataPrototype({ __proto__: this.textPrototype});
    this.piPrototype = createDOMPIPrototype({__proto__: characterDataProtoType});
    this.commentPrototype = createDOMCommentPrototype({__proto__: characterDataProtoType});
    this.documentTypePrototype = createDOMDocumentTypePrototype({__proto__: baseNode});

    if (!this.docNode){
      var docNode = createDOMDocumentPrototype({ __proto__: baseNode, X: this.nsContext});
      this.result.value = this.baseNode.d = this.docNode = docNode;
    }
  },
  reset: function(string){
    this.nsContext = {'': null};
    this.isReset = true;
    this.docNode = null;
    this.result = {
      done: false,
      value: undefined
    };
    if (string !== undefined){
      this.setString(string);
    }
  },
  setString: function(string){
    this.string = string;
    this.index = 0;
    this.result.done = false;
    this.result.value = undefined;
    this.initNodePrototypes();
  },
  setSaxHandler: function(saxHandler) {
    this.saxHandler = saxHandler;
  },
  getDocumentNode: function(){
    return this.docNode;
  },
  getCurrentNamespaceContext: function(){
    return this.nsContext;
  },  
  parseAndCallback: function(string, handler){
    _string: switch (typeof string) {
      case 'string':
        this.setString(string);
        switch (typeof handler) {
          case 'function':
            break _string;
          case 'undefined':
            handler = this.saxHandler;
            break _string;
          default:
            this.throwError(`Handler argument must be of type function, not ${typeof handler}`);
            break _string;
        }
      case 'function':       
        switch (typeof handler) {
          case 'string':
            var s = handler;
            handler = string;
            string = s;
            break _string;
          case 'undefined':
            handler = string;
            string = this.string || undefined;
            break _string;
          default:
            this.throwError(`Invalid type: ${typeof options}`);
            break _string;
        }
      case 'undefined':
        switch (typeof handler) {
          case 'function':
            string = this.string;
            break _string;
          case 'string':
            this.setString(handler);
            handler = this.saxHandler;
            break _string;
          case 'undefined':
            string = this.string;
            handler = this.saxHandler;
            break _string;
          default:
            this.throwError(`Invalid type: ${typeof options}`);
        }
    }
    
    switch (typeof(handler)) {
      case 'undefined':
        if (this.saxHandler === undefined) {
          this.throwError('No handler passed and no saxHandler configured via options.');
        }
        handler = this.saxHandler;
        break;
      case 'function':
        break;
      default:
        this.throwError('handler must be a function');
    }
    var result;
    if (this.isReset === true) {
      if (handler.call(null, this.getDocumentNode()) === false) {
        return;
      }
      this.isReset = false;
    }
    // eslint-disable-next-line no-cond-assign
    while (!(result = this.next()).done) {
      if (handler.call(null, result.value) === false) {
        return;
      }
    }
    handler.call(null, {nodeType: -this.baseNode.DOCUMENT_NODE});
  },
  buildDocument: function(){
    if (this.index !== 0) {
      throw new Error('Cannot build document after initiating iteration.');
    }
    this.chainNodes = true;
    
    while (!this.next().done) {
      // noop
    }
    return this.getDocumentNode();
  },
  throwError: function(type, isFatal){
    var error = new Error(type);
    error.isFatal = isFatal === undefined ? true : Boolean(isFatal);
    throw error;
  },
  throwContentFoundAfterDocumentElementParseException: function(){
    this.throwError(this.CONTENT_FOUND_AFTER_DOCUMENT_ELEMENT_PARSE_EXCEPTION, false);
  },
  throwDanglingLessThanAtEndOfInputParseException: function(){
    this.throwError(this.DANGLING_LESS_THAN_PARSE_EXCEPTION, false);
  },
  throwUnclosedEndTagParseException: function(){
    this.throwError(this.UNCLOSED_END_TAG_PARSE_EXCEPTION, false);
  },
  throwMalformedDocumentTypeDeclarationParseException: function(){
    this.throwError(this.MALFORMED_DOCTYPE_DECLARATION_PARSE_EXCEPTION, false);
  },
  throwExpectedCommentOrCDataOrDoctypeParseError: function(){
    this.throwError(this.EXPECTED_COMMENT_CDATA_DOCTYPE_PARSE_ERROR, true);
  },
  throwUnclosedCommentParseException: function(){
    this.throwError(this.UNCLOSED_COMMENT_PARSE_EXCEPTION, false);
  },
  throwUnclosedCDataParseException: function(){
    this.throwError(this.UNCLOSED_CDATA_PARSE_EXCEPTION, false);
  },
  throwUnclosedCommentOrCDataParseException: function(endHandle){
    switch (endHandle) {
      case '-->':
        this.throwUnclosedCommentParseException();
        break;
      case ']]>':
        this.throwUnclosedCDataParseException();
        break;
      default:
        this.throwError('Illegal argument: "' + endHandle + '" is not a valid endHandle. Expected "-->" or "]]>".');
    }      
  },
  throwUnclosedProcessingInstructionParseException: function(){
    this.throwError(this.UNCLOSED_PROCESSING_INSTRUCTION_PARSE_EXCEPTION, false);
  },
  throwUnclosedElementStartTagParseError: function(){
    this.throwError(this.UNCLOSED_ELEMENT_START_TAG_PARSE_ERROR, true);
  },
  throwUnclosedElementStartTagParseException: function(){
    this.throwError(this.UNCLOSED_ELEMENT_START_TAG_PARSE_EXCEPTION, false);
  },
  next: function(){
    var nsContext;
    var proto;
    var index = this.index;
    var endHandle, endIndex;
    var string = this.string;
    var n = string.length;
    var result = this.result;
    
    var indexOfLt = string.indexOf('<', index);
    
    if (indexOfLt === -1) {
      if (index >= n){
        result.done = true;
        result.value = undefined;
        this.index = this.string.length;
        return result;
      }
      
      // we found text beyond after the document element.
      // this is allowed, if it consists only of spaces.
      
      if (!/^\s+$/.test(string.slice(index))) {
        this.throwContentFoundAfterDocumentElementParseException();
      }
      
      proto = this.textPrototype;
      endIndex = string.length;
    }
    else
    if (indexOfLt > index) {
      // there is text between the end of the previous token and the start of the new one.
      // emit as text node.
      proto = this.textPrototype;
      endIndex = indexOfLt;
    }
    else {  // index is positioned at a <.
      var match;
      var nextCharIndex = indexOfLt + 1;
      switch (string.charAt(nextCharIndex)) {
        case '/':  // this looks like the start of an element close tag.
          endHandle = '>';
          endIndex = string.indexOf(endHandle, nextCharIndex + 1);
          if (endIndex === -1) {
            this.throwUnclosedEndTagParseException();
          }
          proto = this.endElementPrototype;
          endIndex += endHandle.length;
          
          var _nsCtx; 
          // eslint-disable-next-line no-cond-assign
          if (((_nsCtx = this.nsContext)._ -= 1) === 0) {
            this.nsContext = _nsCtx.__proto__;
          }
          break;
        case '!':   // this looks like the start of either a comment or a CDATA section
          nextCharIndex += 1;
          var startHandle;
          
          // comment?
          // eslint-disable-next-line no-cond-assign
          if (string.startsWith(startHandle = '--', nextCharIndex)) {
            endHandle = '-->';
            proto = this.commentPrototype;
          }
          else
          // CDATA section?
          // eslint-disable-next-line no-cond-assign
          if (string.startsWith(startHandle = '[CDATA[', nextCharIndex)) {
            endHandle = ']]>';
            proto = this.cdataPrototype;
          }
          else
          // DOCTYPE?
          // eslint-disable-next-line no-cond-assign
          if (string.startsWith(startHandle = 'DOCTYPE', nextCharIndex)) {
            match = this.documentTypePattern.exec(string.slice(index));
            if (!match) {
              this.throwMalformedDocumentTypeDeclarationParseException();
            }
            endIndex = index + match[0].length;
            proto = this.documentTypePrototype;
            break;
          }
          else {
            this.throwExpectedCommentOrCDataOrDoctypeParseError();
          }
          endIndex = string.indexOf(endHandle, nextCharIndex + startHandle.length);
          if (endIndex === -1) {
            this.throwUnclosedCommentOrCDataParseException(endHandle);
          }
          endIndex += endHandle.length;
          break;
        case '?':   // this looks like the start of a pi or xml declaration
          nextCharIndex += 1;
          endHandle = '?>';
          endIndex = string.indexOf(endHandle, nextCharIndex);
          if (endIndex === -1) {
            this.throwUnclosedProcessingInstructionParseException();
          }
          endIndex += endHandle.length;
          proto = this.piPrototype;
          break;
        case '':
          this.throwDanglingLessThanAtEndOfInputParseException();
          break;
        default:    
          proto = this.elementPrototype;
          // open element tag. this is a bit more tricky.
          //
          // we can always find our closing tag by scanning all content from here,
          // scanning for attribute value starts so we can ignore lt's occurring inside attributes.
          // this is expensive and we'd like to avoid it.
          // 
          // we cannot simply look for the '>' since these may occur inside attribute values.
          //
          // However, in real-world, practical cases, '>' usually does not appear inside attribute values or content text.
          // we'd like to benefit from this assumption by doing a quick test whether it holds.
          // if it holds we found the end of the element.
          // if it doesn't hold, we can always do a proper scan to find the actual end.
          //
          // how to test our assumption:
          //
          // we could search for '<' as this would be the start of the next tag-like token.
          // this is safe, since this cannot appear inside an attribute.
          // < may appear inside a comment or cdata section, 
          // but since we are positioned at the start of the element tag,
          // and we are searching for the next <, there cannot be a CDATA section or comment in between.
          //
          nextCharIndex += 1;
          endHandle = '>';
          var ultimateIndex = string.indexOf('<', nextCharIndex);
          if (ultimateIndex === -1) {
            // there is no next tag. this is possible if we are at the end of the document.
            endIndex = string.lastIndexOf(endHandle);
            if (endIndex < index) {
              this.throwUnclosedElementStartTagParseException();
            }
            endIndex += endHandle.length;
            //TODO: ensure the tag stack is empty (detect unbalanced tags.)
            //
            // we found the last element, but it's possible there is still S content (spaces) after the end of the element tag.
            // so we should allow for one more iteration before we are done.
          }
          else {
            // We can now look for the last end tag handle > before ultimateIndex
            ultimateIndex = string.lastIndexOf(endHandle, ultimateIndex);        
            if (ultimateIndex < nextCharIndex) {
              this.throwUnclosedElementStartTagParseError();
            }
            // this could be the end of our open tag, but it could also be text content after the end of our tag.
            // we can decide by looking for another occurrence of the > before the one we found now.
            // so we find the first > after our current index.

            endIndex = string.indexOf(endHandle, nextCharIndex);
            // there are 2 possibilities now:
            // 1) there is only one such handle and the postions of the last and first occurrence of > are identical
            // 2) there are multiple handles - the position of the first and the last are different.

            if (endIndex === ultimateIndex) {
              // Good! There is only one >, so it must be the end of our open element tag.
              endIndex += endHandle.length;
            }
            else {
              // ok -this sucks. we have multiple gt's. We're going to have to scan everyting up ultimate index to see what's what.
              this.endElementDetector.lastIndex = nextCharIndex;
              match = this.endElementDetector.exec(string);
              if (match === null) {
                this.throwUnclosedElementStartTagParseError();
              }
              endIndex = nextCharIndex + match[0].length;
            }
          }
          
          var selfClosing = string.charAt(endIndex - 1) === '/';
          var slice = string.slice(index, endIndex);
          if (slice.indexOf('xmlns') !== -1) {
            nsContext = { __proto__: this.nsContext};
            var prefix, uri, xmlnsMatch, reXmlns = /\s+(xmlns(:[^\s=]+)?)\s*=\s*('[^']*'|"[^"]*")/g;
            
            // eslint-disable-next-line no-cond-assign
            while (xmlnsMatch = reXmlns.exec(slice)) {
              prefix = xmlnsMatch[2] ? xmlnsMatch[2].slice(1) : '';
              uri = xmlnsMatch[3].slice(1, -1);
              nsContext[prefix] = uri;
            }
            if (!selfClosing) {
              nsContext._ = 1;
              this.nsContext = nsContext;
            }
          }
          else
          if (!selfClosing) {
            this.nsContext._ += 1;
          }
      }
    }
    var value = {
      b: index,
      E: endIndex,
      X: (nsContext || this.nsContext),
      __proto__: proto
    };
      
    if (this.chainNodes) {
      value.p = result.value;
      result.value.n = value;
    }
    result.value = value;

    this.index = endIndex;    

    return result;
  }
};

export { StaxStringReader };