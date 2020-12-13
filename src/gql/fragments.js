export const PARAM = `
  fragment PARAM on Param {
    id
    name
    description
    optionsType
    isSwitch
    allowAddOptions
    allowMultipleValues
    isUnsupported
    options {
      ... OPTION
      comments {
        id
        text
        intent
        isDeleted
        likesCount
        myLikes: likes(userId: "me") {
          id
        }
        user {
          ... USER
        }
      }
    }
  }
`

export const OPTION = `
  fragment OPTION on Option {
    id
    paramId
    value
    description
    isDefault
    hasConsensus
    createdByUser {
      ... USER
    }
  }
`

export const VOTE = `
  fragment VOTE on Vote {
    id
    userId
    ruleId
    intent
    paramId
    optionId
    user {
      ... USER
    }
  }
`

export const COMMENT = `
  fragment COMMENT on Comment {
    id
    text
    intent
    isDeleted
    user {
      ... USER
    }
  }
`

export const USER = `
  fragment USER on User {
    id
    name
    fullName
    nickname
    pictureUrl
  }
`

export const PROJECT = `
  fragment PROJECT on Project {
    id
    name
    domain
    logoUrl
  }
`
