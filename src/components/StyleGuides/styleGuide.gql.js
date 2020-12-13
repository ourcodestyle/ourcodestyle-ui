import {
  USER,
} from '~/gql/fragments'

export default `
  query ($id: ID) {
    styleGuide(id: $id) {
      id
      name
      isPublic
      whoCanVote
      language
      linter
      description
      createdAt
      projectId
      isRulesPopulated
      createdByUserId
      createdByUser {
        ...USER
      }
      configFile {
        id
        updatedAt
        url
      }
      project {
        id
        name
        domain
      }
      rules {
        id
        name
        shortDescription
        isNotSupported
        commentsCount
        votesCount
        fullConsensus
        consensusCount
        maxConsensusCount
        switchConsensusCount
        switchConsensusValue
        categoryId
      }
      categories {
        id
        name
        description
      }
      consensusConfig {
        id
        minWinVotes
        minWinMargin
      }
    }
  }
  ${USER}
`
