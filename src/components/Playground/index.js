import React from 'react'
import _ from 'lodash'

import {
  Popover,
  Classes
} from '@blueprintjs/core'

import {
  Form,
  Input,
  FormSubmit,
  Errors,
} from '~/fuks'

import { FormContext } from '~/contexts'

export default function (props) {

  const onChange = (fieldName, value) => {
    // console.log({fieldName, value})
    // if (fieldName === 'name' && !this.state.wasManualDomainChange) {
    //   const domain = _.toLower(slugify(value))
    //   this.setState({ domain })
    // }
    // if (fieldName === 'domain') {
    //   this.setState({ domain: value, wasManualDomainChange: true })
    // }
  }

  const project = {
    __typename: "Project"
  }

// console.log('FormContext.Consumer');
// console.dir(FormContext.Consumer);
  return <div style={{ padding: 100 }}>
    <Popover content="Hello" target={<button>Hey</button>} />

    <h1>Form:</h1>


    {/* <Form forRecord={project} onChange={onChange}> */}
      {/* <FormContext.Consumer>
        {(contextProps) => {console.dir(`consuming... ${JSON.stringify(contextProps)}`)}}
      </FormContext.Consumer> */}
      <FormContext.Provider value={{areYouKidding: "me"}}>
        <FormContext.Consumer>
          {(contextProps) => {return <div>1: {JSON.stringify(contextProps)}</div>}}
        </FormContext.Consumer>
        <Input ct={FormContext.Consumer} />
        {/* <Input field="name String!" label="Name" autoFocus /> */}
      </FormContext.Provider>
      {/* <Input field="domain String!"     label="Short Name for URL" />
      <div className={Classes.DIALOG_BODY}>
        <Errors />
        <Input field="website String"     label="Website" />
        <Input field="description String" label="Description" as="textarea" />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <FormSubmit label="Create" />
        </div>
      </div> */}
    {/* </Form> */}
  </div>
}
