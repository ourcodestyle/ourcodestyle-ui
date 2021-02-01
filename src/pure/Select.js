import React from 'react'
import PropTypes from 'prop-types'

import {
  Button,
  MenuItem,
  Classes,
  FormGroup
} from '@blueprintjs/core'
import { Select } from "@blueprintjs/select"
import _ from 'lodash'

const MySelect = (props) => {
  let collection = props.collection
  if (typeof (collection[0]) === "string") {
    collection = collection.map(x => ({ label: x, value: x }))
  } else if (typeof (collection[0]) === "number") {
    collection = collection.map(x => ({ label: `${x}`, value: x }))
  }
  const includeBlank = props.includeBlank

  if (includeBlank) {
    const blankLabel = typeof (includeBlank) === "string" ? includeBlank : "- none -"
    collection = [{
      label: blankLabel,
      value: null
    }].concat(collection)
  }

  let selectedItem = _.find(collection, x => x.value === props.value)
  if (!selectedItem) {
    selectedItem = collection[0]
  }
  const noResults = <MenuItem disabled={true} text="No results." />

  let button
  if (selectedItem) {
    const buttonIcon = selectedItem.iconSrc && <img style={{ height: 18 }} src={selectedItem.iconSrc} />
    button = <Button disabled={props.disabled} text={selectedItem.label} rightIcon="double-caret-vertical" icon={buttonIcon} />
  } else {
    button = <Button disabled={props.disabled} text={selectedItem.label} rightIcon="double-caret-vertical" />
    // const button = <Button text={selectedItem.label} rightIcon="double-caret-vertical" icon={buttonIcon} />
  }

  const itemRenderer = ({ label, value, iconSrc }, { handleClick, modifiers }) => {
    const icon = iconSrc && <img style={{ height: 18 }} src={iconSrc} />
    return (
      <MenuItem
        className={modifiers.active ? Classes.ACTIVE : ""}
        key={String(value)}
        onClick={handleClick}
        text={label}
        icon={icon}
      />
    );
  };

  const itemPredicate = (query, item) => {
    if (!item.value) return !query || query.length == 0
    if (typeof (item.value) === 'number') {
      return true
    }
    return item.value.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  };

  const onItemSelect = (item, event) => {
    props.onChange({
      target: { value: item.value }
    })
  }

  return <Select
    items={collection}
    itemPredicate={itemPredicate}
    itemRenderer={itemRenderer}
    noResults={noResults}
    onItemSelect={onItemSelect}
    filterable={false}
    disabled={props.disabled}
  >
    {button}
  </Select>
}

MySelect.propTypes = {
  // collection: PropTypes.oneOf([PropTypes.array, PropTypes.object]).isRequired,
  value: PropTypes.any
}

export default MySelect
