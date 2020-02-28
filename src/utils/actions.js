import _ from 'lodash'

export function namespace(namespaceName) {
  return actionName => [ namespaceName, actionName ].join(".")
}

export function createRequestTypes(base, types = ["init", "request", "success", "failure"]) {
  const res = {};
  types.forEach(type => res[type] = `${base}.${type}`)
  return res;
}

export function createAction(type, paramsKeys = [], {addToPayload, defaults}={}) {
  const x = function (payload = {}) {
    if ([...arguments].length > 1 || typeof(arguments[0]) === "string") { // array style args
      // converting to be hash
      payload = _.fromPairs(_.zip(paramsKeys, [...arguments].slice(0, paramsKeys.length)))
    }
    // taking only needed keys as there might be a mess provided
    payload = _.pick(payload, paramsKeys)

    // apply defaults to paylod for not set keys
    if (defaults) {
      _.forEach(defaults, (value, key) => {
        if (!_.has(payload, key) && _.has(defaults, key)){
          payload[key] = value
        }
      })
    }

    // validate not passed keys
    const missingKeys = _.difference(paramsKeys, Object.keys(payload))
    if (missingKeys.length > 0){
      throw `Action ${type} called with missing params: ${missingKeys.join(', ')}`
    }
    if (addToPayload){
      addToPayload(payload)
    }
    return { type, ...payload }
  }
  x.toString = () => type
  return x
}

export function createRequestActions(base, paramsKeys=[]) {
  const types = createRequestTypes(base)
  // its a bit of duplication to make a default behavior:
  // when you run someAction() it will be same as someAction.init()
  // also you can catch it in saga like [actions.someAction] instead of [actions.someAction.init]

  const paramsKeysForInit = paramsKeys.concat(['requestId'])
  const defaults = { requestId: null, params: {} }

  let actions = createAction(types.init, paramsKeysForInit, {defaults})

  // this part remains same
  actions.init    = createAction(types.init,    {defaults})
  actions.request = createAction(types.request, paramsKeys.concat(['requestId', 'params']), {defaults})
  actions.success = createAction(types.success, paramsKeys.concat(['requestId', 'params', 'response']), {defaults})
  actions.failure = createAction(types.failure, paramsKeys.concat(['requestId', 'params', 'error']), {defaults})

  return actions
}

// export function createAction(type, argumentNames = []) {
//   const x = function () {
//     // arguments is special js variable, and it is not an array
//     // but need the slice function to be used later, so need to convert it to array first
//     let argumentsList = []
//     for (let i = 0; i < arguments.length; i++) {
//       argumentsList[i] = arguments[i]
//     }

//     // Only using the specified arguments in argumentNames so slicing out passed arguments that
//     // are out of scope of argumentNames
//     const payload = fromPairs(zip(argumentNames, argumentsList.slice(0, argumentNames.length)))

//     return { type, ...payload }
//   }

//   x.actionType = type
//   x.toString = () => type

//   return x
// }

// export function createRequestActions(base, args) {
//   if (!args){
//     args = {}
//   } else if (_.isArray(args)){
//     args = { all: args }
//   }

//   const init    = args['init']    || []
//   const request = args['request'] || []
//   const success = args['success'] || []
//   const failure = args['failure'] || []
//   const all     = args['all']     || []

//   const type = createRequestTypes(base)
//   // its a bit of duplication to make a default behavior:
//   // when you run someAction() it will be same as someAction.init()
//   // also you can catch it in saga like [actions.someAction] instead of [actions.someAction.init]
//   let actions = createAction(type.init, [].concat(init).concat(all))

//   // this part remains same
//   actions.init    = createAction(type.init,    [].concat(init).concat(all))
//   actions.request = createAction(type.request, ['request'].concat(request).concat(all))
//   actions.success = createAction(type.success, ['response'].concat(success).concat(all))
//   actions.failure = createAction(type.failure, ['error'].concat(failure).concat(all))

//   return actions
// }
