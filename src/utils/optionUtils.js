import _ from 'lodash'
import YAML from 'yaml'
import { Pair } from 'yaml/types'

export const parsePair = (option) => {
  const h = YAML.parse(option.value) || { "": "" }

  const key = Object.keys(h)[0] || ""
  const value = h[key] || ""

  return [key, value]
}

export const parseList = (option) => {
  return YAML.parse(option.value) || []
}
