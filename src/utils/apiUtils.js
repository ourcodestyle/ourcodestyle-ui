import _ from 'lodash'

export const parseErrorMessage = (error) => {
  let message = error.message
  if (_.startsWith(message, 'GraphQL error: ')){
    message = _.replace(message, 'GraphQL error: ', '')
  }

  return message
}