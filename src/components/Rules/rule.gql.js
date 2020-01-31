import {
  USER,
  VOTE,
  PARAM,
  OPTION,
} from '~/gql/fragments'

export default `
  query rule($id: ID!) {
    rule(id: $id) {
      id
      categoryId
      name
      kind
      linter
      description
      shortDescription
      votes { ... VOTE }
      params { ... PARAM }
      styleGuide {
        id
        name
        language
        linter
        whoCanVote
        createdByUserId
        organizationId
        categories {
          id
          name
          description
        }
        organization {
          id
          name
          domain
        }
        consensusConfig {
          id
          minWinVotes
          minWinMargin
        }
      }
      category {
        id
        name
      }
    }
  }
  ${USER}
  ${VOTE}
  ${PARAM}
  ${OPTION}
`
