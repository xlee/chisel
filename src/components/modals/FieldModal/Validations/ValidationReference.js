import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import CheckboxControl from "components/elements/CheckboxControl/CheckboxControl";
import InputControl from "components/elements/InputControl/InputControl";

import styles from '../FieldModal.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ValidationReference extends Component {
  state = {
    models: {
      active: false,
      modelsList: [],
      errorMsg: ''
    }
  };
  
  modelsAll;
  modelsSet = new Set();
  
  
  constructor(props) {
    super(props);
    
    this.modelsAll = props.models;
    
    Object.assign(this.state, props.validations);
    
    const modelsList = this.state.models.modelsList;
    if (modelsList && typeof modelsList[Symbol.iterator] === 'function')
      this.modelsSet = new Set(modelsList);
  }
  
  onTypesActive = value => {
    this.setState({models: {
        ...this.state.models,
        active: value
      }}, this.update);
  };
  
  onTypesErrorMsg = event => {
    const {value} = event.target;
    this.setState({models: {
        ...this.state.models,
        errorMsg: value
      }}, this.update);
  };
  
  onModelChange = (nameId, value) => {
    if (value)
      this.modelsSet.add(nameId);
    else
      this.modelsSet.delete(nameId);
  
    this.setState({models: {
        ...this.state.models,
        modelsList: Array.from(this.modelsSet)
      }}, this.update);
  };
  
  update = () => {
    this.props.update(this.state);
  };
  
  render() {
    return (
      <div>
        <div styleName="validation">
          <div styleName="active">
            <CheckboxControl title="Accept only specified entry models"
                             checked={this.state.models.active}
                             onChange={this.onTypesActive} />
          </div>
          <div styleName="models">
            {this.modelsAll.map(model =>
              <div styleName="model-checkbox"
                   key={model.nameId}>
                <CheckboxControl title={model.name}
                                 checked={this.modelsSet.has(model.nameId)}
                                 onChange={value => this.onModelChange(model.nameId, value)}
                                 disabled={!this.state.models.active} />
              </div>
            )}
          </div>
          <InputControl label="Custom error message"
                        onChange={this.onTypesErrorMsg}
                        value={this.state.models.errorMsg}
                        readOnly={!this.state.models.active} />
        </div>
      </div>
    );
  }
}