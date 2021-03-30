import { combineReducers } from 'redux'
import userReducer from './userReducer'
import partyReducer from './partyReducer'

const rootReducer = combineReducers({
  userReducer,
  partyReducer,
})

export default rootReducer
