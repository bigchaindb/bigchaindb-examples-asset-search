import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { routerReducer } from 'react-router-redux'

import async from './async'
import results from './results'

const appReducer = combineReducers({
    form: formReducer,
    router: routerReducer,
    async,
    results
})

export default appReducer
