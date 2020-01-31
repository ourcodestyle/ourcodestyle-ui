import React from 'react'

import {
  Classes,
  Menu,
  MenuItem,
  Switch,
} from '@blueprintjs/core'
import { AppToaster } from '~/components/toaster'

import QueryComponent from '~/fuks/QueryComponent'
import {
  Form,
  Input,
  FormSubmit,
  Errors
} from '~/fuks'

import RecordForm from '~/components/StyleGuides/Form'

import StyleGuideGQL from './styleGuide.gql'

class StyleGuideSettings extends QueryComponent {

  constructor(props){
    super(props)
    this.state = { ...this.state, panel: "general" }
  }

  query() {
    return StyleGuideGQL
  }

  queryOptions(){
    return { fetchPolicy: "network-only" }
  }

  queryVariables(){
    return { id: this.props.styleGuideId }
  }

  queryLoaded({styleGuide}) {
    this.setState({ styleGuide, isPublic: styleGuide.isPublic })
  }

  content(){
    const panel = this.state.panel

    const openPanel = (panel) => () => {
      this.setState({ panel })
    }

    return <div>
      <div className={Classes.DIALOG_BODY}>
        <div style={{ display: "grid", gridTemplateColumns: "200px 600px", gridGap: 20 }}>
          <div>
            <Menu>
              <MenuItem onClick={openPanel("general")} text="General" active={this.state.panel == "general"} />
              <MenuItem onClick={openPanel("consensus-rules")} text="Consensus Rules" active={this.state.panel == "consensus-rules"} />
              <MenuItem onClick={openPanel("privacy")} text="Privacy" active={this.state.panel == "privacy"} />
            </Menu>
          </div>
          <div>
            { panel === 'general' && this.panelGeneral() }
            { panel === 'consensus-rules' && this.panelConsensusRules() }
            { panel === 'privacy' && this.panelPrivacy() }
          </div>
        </div>
      </div>
      </div>
  }

  panelGeneral() {
    const onSuccess = () => {
      AppToaster.show({ message: "Updated", intent: 'success'})
    }
    return <div>
      <div className="settings-panel-header">General</div>
      <RecordForm record={this.state.styleGuide} onSuccess={onSuccess} />
    </div>
  }

  panelConsensusRules(){

    const onSuccess = () => {
      AppToaster.show({ message: "Updated", intent: 'success'})
    }

    const record = this.state.styleGuide.consensusConfig

    return <div>
      <div className="settings-panel-header">Consensus Rules</div>
      <Form forRecord={record} onSuccess={onSuccess} dontResetFieldsOnSubmit>
        <div className={Classes.DIALOG_BODY}>
          <Errors />
          <Input field="minWinVotes Int!" label="Minimal votes to win" inputProps={{ style: {width: 50} }} />
          <Input field="minWinMargin Int!" label="Minimal win margin" inputProps={{ style: {width: 50} }}  />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <FormSubmit label="Update" />
          </div>
        </div>
      </Form>
    </div>
  }

  panelPrivacy(){
    const onSuccess = () => {
      AppToaster.show({ message: "Updated", intent: 'success'})
    }

    let onChange = (fieldName, value) => {
      if (fieldName === 'isPublic') {
        this.setState({ isPublic: value })
      }
    }
    onChange = onChange.bind(this)

    return <div>
      <div className="settings-panel-header">Privacy</div>

      <div>
        <Form forRecord={this.state.styleGuide} onSuccess={onSuccess} dontResetFieldsOnSubmit onChange={onChange}>
          <Errors />
          <Input field="isPublic Boolean!" label="Public" as="switch" />
          <div style={ this.state.isPublic ? {} : {display: 'none'} }>
            { this.publicOptions() }
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <FormSubmit label="Update" />
            </div>
          </div>
        </Form>
      </div>
    </div>
  }

  publicOptions() {
    const voterOptions = [
      { label: "Only Organization Members",  value: "members" },
      { label: "Anyone with GitHub account", value: "anyone"  },
    ]
    return <Input field="whoCanVote String" label="Who can vote?" as="radio" collection={voterOptions} hideOptionalLabel />
  }

}

export default StyleGuideSettings