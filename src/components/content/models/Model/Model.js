import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import styles from './Model.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Model extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div>
        lalala
      </div>
    );
  }
}