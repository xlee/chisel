import React, {Component} from 'react';
import InlineSVG from 'svg-inline-react';
import CSSModules from 'react-css-modules';

import {
  checkFileType, TYPE_AUDIO, TYPE_IMAGE, TYPE_PDF, TYPE_TEXT, TYPE_F_TEXT, TYPE_VIDEO, TYPE_HTML, TYPE_PRESENT,
  TYPE_TABLE, TYPE_JSON, TYPE_XML, TYPE_MARKDOWN, TYPE_ARCHIVE, TYPE_EXE
} from "utils/common";

import styles from './MediaView.sss';


@CSSModules(styles, {allowMultiple: true})
export default class MediaView extends Component {
  render() {
    const {item} = this.props;
    
    if (!item || !item.file)
      return null;
    
    switch (checkFileType(item.type)) {
      case TYPE_IMAGE:
        return (
          <a href={item.file.url()} target="_blank">
            <div styleName="image"
                 style={{backgroundImage: `url(${item.file.url()})`}}>
            </div>
          </a>
        );
    
      case TYPE_TEXT:
        return (
          <a href={item.file.url()} target="_blank">
            <InlineSVG styleName="icon"
                       src={require('assets/images/media-types/txt.svg')} />
          </a>
        );
  
      case TYPE_HTML:
        return (
          <a href={item.file.url()} target="_blank">
            <InlineSVG styleName="icon"
                       src={require('assets/images/media-types/html.svg')} />
          </a>
        );
  
      case TYPE_XML:
        return (
          <a href={item.file.url()} target="_blank">
            <InlineSVG styleName="icon"
                       src={require('assets/images/media-types/xml.svg')} />
          </a>
        );
  
      case TYPE_MARKDOWN:
        return (
          <a href={item.file.url()} target="_blank">
            <InlineSVG styleName="icon"
                       src={require('assets/images/media-types/md.svg')} />
          </a>
        );
  
      case TYPE_JSON:
        return (
          <a href={item.file.url()} target="_blank">
            <InlineSVG styleName="icon"
                       src={require('assets/images/media-types/json.svg')} />
          </a>
        );
    
      case TYPE_PDF:
        return (
          <a href={item.file.url()} target="_blank">
            <InlineSVG styleName="icon"
                       src={require('assets/images/media-types/pdf.svg')} />
          </a>
        );
    
      case TYPE_F_TEXT:
        return (
          <a href={item.file.url()} target="_blank">
            <InlineSVG styleName="icon"
                       src={require('assets/images/media-types/doc.svg')} />
          </a>
        );
  
      case TYPE_TABLE:
        return (
          <a href={item.file.url()} target="_blank">
            <InlineSVG styleName="icon"
                       src={require('assets/images/media-types/xls.svg')} />
          </a>
        );
  
      case TYPE_PRESENT:
        return (
          <a href={item.file.url()} target="_blank">
            <InlineSVG styleName="icon"
                       src={require('assets/images/media-types/ppt.svg')} />
          </a>
        );
    
      case TYPE_AUDIO:
        return (
          <audio src={item.file.url()}
                 type={item.type}
                 controls
                 styleName="audio">
          </audio>
        );
    
      case TYPE_VIDEO:
        return (
          <video src={item.file.url()}
                 type={item.type}
                 controls
                 styleName="video">
          </video>
        );
  
      case TYPE_ARCHIVE:
        return (
          <a href={item.file.url()} target="_blank">
            <InlineSVG styleName="icon"
                       src={require('assets/images/media-types/archive.svg')} />
          </a>
        );
  
      case TYPE_EXE:
        return (
          <a href={item.file.url()} target="_blank">
            <InlineSVG styleName="icon"
                       src={require('assets/images/media-types/exe.svg')} />
          </a>
        );
    
      default:
        return (
          <a href={item.file.url()} target="_blank">
            <InlineSVG styleName="icon"
                       src={require('assets/images/media-types/other.svg')}/>
          </a>
        );
    }
  }
}
