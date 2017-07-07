const results = (state = {}, action) => {
    switch (action.type) {
        case 'CLEAR_RESULT':
            return {}
        case 'ADD_RESULT':
        case 'UPDATE_RESULT':
            return Object.assign({}, state, {
                ...state,
                [action.result._tx]: action.result
            })
        default:
            return state
    }
}

export default results
