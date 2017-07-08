import * as bdb from '../bdb' // eslint-disable-line import/no-namespace
import Asset from './asset'

const appId = 'search'


export const REQUEST_ASYNC = 'REQUEST_ASYNC'
export const RECEIVE_ASYNC = 'RECEIVE_ASYNC'

export const requestAsync = (query) => ({
    type: REQUEST_ASYNC,
    query
})

export const receiveAsync = () => ({
    type: RECEIVE_ASYNC
})

export const clearResults = () => ({
    type: 'CLEAR_RESULT'
})

export const resultAsset = new Asset(appId, 'result')

export function initialize() {
    return (dispatch, getState) => {
        bdb.connect((ev) => {
            resultAsset.updateStore(ev.asset_id, dispatch, getState)
        })
    }
}

export function submitSearch(query) {
    return (dispatch, getState) => {
        dispatch(requestAsync(query))
        dispatch(clearResults())
        resultAsset.load(query, dispatch, getState)
            .then(() => dispatch(receiveAsync()))
    }
}
