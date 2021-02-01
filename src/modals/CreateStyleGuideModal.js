import React from "react";
import { compose } from "redux";
import { withRouter } from "react-router-dom";

import _ from "lodash";

import { Dialog, Button, Intent, Classes } from "@blueprintjs/core";

import { Form, Input, FormSubmit, Errors } from "~/fuks";

import { USER } from "~/gql/fragments";

import languages from "~/lists/languages"
import linters from "~/lists/linters"

class CreateStyleGuide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: null,
      linter: null,
      name: "",
    };
  }

  render() {
    const props = this.props;

    const onClose = (...args) => {
      props.closeModal();
    };

    const styleGuide = {
      __typename: "StyleGuide",
      projectId: props.projectId,
      language: this.state.language,
      linter: this.state.linter,
      wasManualNameChange: false,
    };

    const onSuccess = (styleGuide) => {
      props.closeModal();
      props.history.push(
        `/projects/${props.projectDomain}/style-guides/${styleGuide.id}`
      );
    };

    const onChange = ((fieldName, value) => {
      if (fieldName === "linter") {
        const linter = _.find(linters, { value });
        const language = linter ? linter.language : null;
        let data = { language, [fieldName]: value };
        this.setState(data)
        if (language && !this.state.wasManualNameChange) {
          const languageLabel = _.find(languages, { value: language }).label;
          const name = `${languageLabel} Guide`;

          return {
            setForm: (form) => {
              return Object.assign({}, form, { name });
            },
          }
        }

      } else if (fieldName === "language" && !this.state.wasManualNameChange) {
        const language = value
        const languageLabel = _.find(languages, { value: language }).label
        const name = `${languageLabel} Guide`

        this.setState({ language, name })
        return {
          setForm: (form) => {
            return Object.assign({}, form, { language, name })
          },
        }
      } else if (fieldName === "name") {
        this.setState({ wasManualNameChange: true })
      } else {
        this.setState({ [fieldName]: value })
      }
    }).bind(this)

    const extraQuery = `
      project {
        id
        styleGuides {
          id
          name
          language
          linter
          isPublic
          createdByUser {
            ... USER
          }
        }
      }
    `;
    const extraQueryFragments = [USER];

    return (
      <Dialog
        icon="add"
        isOpen={props.isOpen}
        onClose={onClose}
        title="Add Style Guide"
      >
        <Form
          forRecord={styleGuide}
          onSuccess={onSuccess}
          extraQuery={extraQuery}
          extraQueryFragments={extraQueryFragments}
          onChange={onChange}
        >
          <div className={Classes.DIALOG_BODY}>
            <Errors />
            <Input field="projectId ID" as="hidden" />
            <Input
              field="linter String"
              label="Linter"
              as="select"
              collection={linters}
              includeBlank={true}
              hideOptionalLabel={true}
            />
            <Input
              field="language String"
              label="Programming Language"
              as="select"
              collection={_.sortBy(languages, "label")}
              includeBlank={true}
              inputProps={{ disabled: !!this.state.linter }}
              value={this.state.language}
              hideOptionalLabel={true}
            />
            <Input
              field="name String!"
              label="Name"
              autoFocus
            />
            <Input
              field="description String"
              label="Description"
              as="textarea"
            />
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <FormSubmit label="Create" />
            </div>
          </div>
        </Form>
      </Dialog>
    );
  }
}

export default withRouter(CreateStyleGuide);
