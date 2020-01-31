import { Map, Set } from 'immutable'
import {AsyncState} from '~/redux/globalModels'

export default new Map({
  newStyleGuide: new Map({
    domain: null,
    name: "Ruby",
    code: "rb",
  }),
  expandedCategories: new Set(),
  categoryIds: [],
  filterValue: "",
  asyncState: new Map({
    generateConfigFile: AsyncState.init,
  })
})