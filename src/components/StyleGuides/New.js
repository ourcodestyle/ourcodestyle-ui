import React from 'react'
import Api from '~/api'
import {
  Button,
  MenuItem,
  Classes,
  FormGroup
} from '@blueprintjs/core'
import { Select } from "@blueprintjs/select"

import {fConnect} from '~/utils/components'
import {
  fieldChange,
  create
} from './redux/actions'

class New extends React.Component {

  fieldChange(){
    console.log('own fieldChange')
    console.log('this.props');
    console.dir(this.props);
  }

  componentWillMount() {
    this.fieldChange()
    this.props.actions.fieldChange(['newStyleGuide', 'domain'], this.props.match.params.organization)
  }

  render() {
    const { props } = this
    const { actions } = props

    const languages = [
      {name: 'Ruby',       code: 'ruby'},
      {name: 'JavaScript', code: 'javasript'},
    ]

    const selectLanguage = (language) => {
      actions.fieldChange(['newStyleGuide', 'name'], language.name)
      actions.fieldChange(['newStyleGuide', 'code'], language.code)
    }

    const renderItem = (item, { handleClick, modifiers }) => {
      const image = <img style={{height: 18}} src={`/images/language-icons/${item.code}.png`} />
      return (
        <MenuItem
          className={modifiers.active ? Classes.ACTIVE : ""}
          key={item.code}
          label={item.code}
          onClick={handleClick}
          text={item.name}
          icon={image}
        />
      );
    };

    const filterItems = (query, item) => {
      return item.name.toLowerCase().indexOf(query.toLowerCase()) >= 0;
    };

    return <div className="form-container">
      <h1>New Style Guide</h1>

      <FormGroup label="Programming Language">
        <Select
          items={languages}
          itemPredicate={filterItems}
          itemRenderer={renderItem}
          noResults={<MenuItem disabled={true} text="No results." />}
          onItemSelect={selectLanguage}
        >
          {/* children become the popover target; render value here */}
          <Button text={props.newStyleGuide.name} rightIcon="double-caret-vertical" />
        </Select>
      </FormGroup>

      <br/>
      <br />

      <Button onClick={actions.create} intent="Primary" className="pt-large">
        Create
      </Button>

    </div>
  }
}

export default fConnect(
  ({ StyleGuides }) => StyleGuides.toJS(),
  { fieldChange, create }
)(New)