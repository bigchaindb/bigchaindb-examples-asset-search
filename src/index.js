import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'

import thunk from 'redux-thunk'
import appReducer from './reducers'

import App from './components/App'

import './index.css';
import 'semantic-ui-css/semantic.css'

const history = createHistory()

let store = createStore(
    appReducer,
    composeWithDevTools(
        applyMiddleware(
            thunk,
            routerMiddleware(history)
        )
    )
)

render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
)

