import { connect } from 'react-redux'
import Search from '../components/Search'
import { submitSearch } from '../actions/index'

export default connect(
    state => ({
        results: state.results
    }),

    dispatch => ({
        onSubmit: values => {
            dispatch(submitSearch(values.query))
        }
    })
)(Search)
