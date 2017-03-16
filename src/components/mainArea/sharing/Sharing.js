import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import Gravatar from 'react-gravatar';
import {Parse} from 'parse';

import {ROLE_ADMIN, ROLE_EDITOR, ROLE_DEVELOPER, CollaborationData} from 'models/UserData';
import {getUser, checkCollaboration, COLLAB_CORRECT, COLLAB_ERROR_EXIST, COLLAB_ERROR_SELF} from 'utils/data';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import InputControl from 'components/elements/InputControl/InputControl';
import {ALERT_TYPE_CONFIRM} from 'components/modals/AlertModal/AlertModal';

import styles from './Sharing.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Sharing extends Component {
  state = {
    collaborations: [],
    input: ""
  };
  activeInput = null;


  componentWillMount() {
    const {collaborations} = this.props;
    this.setState({collaborations});
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.alertShowing && this.activeInput)
      this.activeInput.focus();
    this.setState({collaborations: nextProps.collaborations});
    if (nextProps.collaborations != this.state.collaborations)
      this.setState({input: ""});
  }

  onInputChange = event => {
    let input = event.target.value;
    this.setState({input});
  };

  onKeyDown = event => {
    if (this.props.alertShowing)
      return;
    //Enter pressed
    if (event.keyCode == 13) {
      this.onAddCollaboration();
      //Esc pressed
    } else if (event.keyCode == 27) {
      this.setState({input: ""});
    }
  };

  onAddCollaboration = event => {
    getUser(this.state.input)
      .then(user => {
        let params;
        let error = checkCollaboration(user);
        
        switch (error) {
          case COLLAB_CORRECT:
            this.props.addCollaboration(user);
            this.setState({input: ""});
            break;
            
          case COLLAB_ERROR_SELF:
            params = {
              title: "Error",
              description: "You are trying to add yourself!",
              buttonText: "OK"
            };
            this.props.showAlert(params);
            break;
  
          case COLLAB_ERROR_EXIST:
            params = {
              title: "Error",
              description: "This user is also exist",
              buttonText: "OK"
            };
            this.props.showAlert(params);
            break;
        }
      })
      .catch(error => {
        console.log(error);
        let params = {
          title: "Error",
          description: "The user does not exists.",
          buttonText: "OK"
        };
        this.props.showAlert(params);
      });
  };
  
  onRoleClick(e, index) {
    e.stopPropagation();
    
    let collaborations = this.state.collaborations;
    let collab = collaborations[index];
    if (collab.role == ROLE_ADMIN)
      collab.role = ROLE_EDITOR;
    else if (collab.role == ROLE_EDITOR)
      collab.role = ROLE_DEVELOPER;
    else if (collab.role == ROLE_DEVELOPER)
      collab.role = ROLE_ADMIN;
    
    this.setState({collaborations});
    this.props.updateCollaboration(collab);
  }
  
  onDeleteClick(event, collab) {
    event.stopPropagation();
    const {showAlert, deleteCollaboration, deleteSelfCollaboration} = this.props;
    
    let user = collab.user.username;
    let description = "This action cannot be undone. Are you sure?";
    let delFunc = deleteCollaboration;
    let confirmString = '';
    
    if (collab.user.origin.id == Parse.User.current().id) {
      user = 'self';
      description = "You are trying to stop managing this site. " + description + "<br><br>Please, type site name to confirm:";
      delFunc = deleteSelfCollaboration;
      confirmString = collab.site.name;
    }
      
    let params = {
      type: ALERT_TYPE_CONFIRM,
      title: `Deleting ${user} from collaborators`,
      description,
      confirmString,
      onConfirm: () => delFunc(collab)
    };
    showAlert(params);
  }

  render() {
    const {owner, user, isEditable} = this.props;

    return (
      <div styleName="wrapper">
        <ContainerComponent title="Collaborators">
          <div styleName="sharing-wrapper">
            <div styleName="list">
              <div styleName="list-item">
                <div styleName="avatar">
                  <Gravatar email={owner.email} styleName="gravatar"/>
                </div>
                <div styleName="type">
                  <div styleName="name">{owner.firstName} {owner.lastName}</div>
                  <div styleName="email">{owner.username}</div>
                </div>
                <div styleName="role">
                  OWNER
                </div>
              </div>
              {
                this.state.collaborations.map((collaboration, index) => {
                  let localDelete = isEditable;
                  let localRole = isEditable;
                  if (collaboration.user.origin.id == user.origin.id) {
                    localDelete = true;
                    localRole = false;
                  }
                  
                  return(
                    <div styleName="list-item" key={collaboration.user.username}>
                      <div styleName="avatar">
                        <Gravatar email={collaboration.user.email} styleName="gravatar"/>
                      </div>
                      <div styleName="type">
                        <div styleName="name">{collaboration.user.firstName} {collaboration.user.lastName} </div>
                        <div styleName="email">{collaboration.user.username}</div>
                      </div>
                      {
                        localRole ?
                          <div styleName="role editable" onClick={event => this.onRoleClick(event, index)}>
                            {collaboration.role}
                          </div>
                          :
                          <div styleName="role">
                            {collaboration.role}
                          </div>
                      }
                      {
                        localDelete &&
                          <div styleName="hidden-controls">
                            <div styleName="hidden-remove" onClick={event => this.onDeleteClick(event, collaboration)}>
                              <InlineSVG styleName="cross"
                                         src={require("./cross.svg")}/>
                            </div>
                          </div>
                      }
                    </div>
                  );
                })
              }
            </div>

            {
              isEditable &&
                <div styleName="input-wrapper">
                  <InputControl placeholder="Enter one or more emails"
                                value={this.state.input}
                                autoFocus={true}
                                onChange={this.onInputChange}
                                onKeyDown={this.onKeyDown}
                                icon="users"
                                onIconClick={this.onAddCollaboration}
                                inputRef={c => this.activeInput = c}/>


                  <div styleName="footer">
                    If the recipient doesn’t yet have a Chisel account, they will be sent an invitation to join.
                  </div>
                </div>
            }
          </div>
        </ContainerComponent>
        {
          isEditable &&
            <div styleName="import">
              <div className="g-title" styleName="title">
                Import Contacts
              </div>

              <div styleName="description">
                If you would like to invite your contacts, select the service below.
              </div>

              <div styleName="contacts">
                <div styleName="contacts-item">
                  <div styleName="icon-wrapper">
                    <InlineSVG styleName="icon" src={require("./slack.svg")} />
                  </div>
                  Slack
                </div>
                <div styleName="contacts-item">
                  <div styleName="icon-wrapper">
                    <InlineSVG styleName="icon" src={require("./github.svg")} />
                  </div>
                  Github
                </div>
                <div styleName="contacts-item">
                  <div styleName="icon-wrapper">
                    <InlineSVG styleName="icon icon-bucket" src={require("./bitbucket.svg")} />
                  </div>
                  Bitbucket
                </div>
              </div>
            </div>
        }
      </div>
    );
  }
}
