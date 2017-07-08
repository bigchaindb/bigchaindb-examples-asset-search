import {
    REQUEST_ASYNC,
    RECEIVE_ASYNC
} from '../actions/index'

const async = (state = {}, action) => {
    switch (action.type) {
        case REQUEST_ASYNC:
            return {
                ...state,
                query: action.query,
                isFetching: true,
            }
        case RECEIVE_ASYNC:
            return {
                ...state,
                isFetching: false,
            }
        default:
            return state
    }
}

export default async
