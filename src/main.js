import { StaxStringReader } from './stax/StaxStringReader.js';
import { SaxStreamReader } from './stream/SaxStreamReader.js';
import { DecoderUtils } from './decoder/DecoderUtils.js';
import {
  ELEMENT_NODE,
  ATTRIBUTE_NODE,
  TEXT_NODE,
  CDATA_SECTION_NODE,
  ENTITY_REFERENCE_NODE,
  ENTITY_NODE,
  PROCESSING_INSTRUCTION_NODE,
  COMMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_TYPE_NODE,
  DOCUMENT_FRAGMENT_NODE,
  NOTATION_NODE
} from './dom/DomNodeTypes.js';

export default {
  StaxStringReader: StaxStringReader,
  SaxStreamReader: SaxStreamReader,
  DecoderUtils: DecoderUtils,
  DomNodeTypes: {
    ELEMENT_NODE,
    ATTRIBUTE_NODE,
    TEXT_NODE,
    CDATA_SECTION_NODE,
    ENTITY_REFERENCE_NODE,
    ENTITY_NODE,
    PROCESSING_INSTRUCTION_NODE,
    COMMENT_NODE,
    DOCUMENT_NODE,
    DOCUMENT_TYPE_NODE,
    DOCUMENT_FRAGMENT_NODE,
    NOTATION_NODE
  }
};
