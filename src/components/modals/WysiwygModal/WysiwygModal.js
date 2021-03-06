import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

// load theme styles with webpack
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';

import Editor from 'react-medium-editor';

import styles from './WysiwygModal.sss';

import ImageCrossCircle from 'assets/images/cross-circle.svg';


@CSSModules(styles, {allowMultiple: true})
export default class WysiwygModal extends Component {
  text = this.props.params.text;


  onClosing = () => {
    this.props.params.callback(this.text);
    this.props.onClose();
  };
  
  onChange = text => {
    this.text = text;
  };
  
  render() {
    return (
      <div styleName="wrapper">
        <div styleName="return" onClick={this.onClosing}>
          <InlineSVG styleName="cross"
                     src={ImageCrossCircle} />
        </div>
        <Editor styleName="editor"
                text={this.text}
                onChange={this.onChange} />
      </div>
    );
  }
}