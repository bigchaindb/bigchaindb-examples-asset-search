import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Field, reduxForm } from 'redux-form'
import { Form } from 'semantic-ui-react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/styles'
import logo from '../bdb_logo.svg'
import { BDB_API_PATH } from '../bdb'

class SearchResult extends Component {
    render() {
        const { result, query } = this.props
        const resultString = JSON.stringify(result.result, null, '\t')
        const lineString = resultString.match(/[^\r\n]+/g)

        const matchLines = []
        lineString.forEach((line, index) => {
            if (line.indexOf(query) > -1) {
                matchLines.push(index + 1)
            }
        })
        // console.log(lineString)

        return (
            <div className="result">
                <div className="result--header">
                    <a href={`${BDB_API_PATH}transactions/${result._tx}`}
                       target="_blank" rel="noopener noreferrer">
                        {result._tx}
                    </a>
                </div>
                <SyntaxHighlighter
                    language='json'
                    style={docco}
                    wrapLines={true}
                    lineStyle={lineNumber => {
                        const style = { display: 'block' }
                        if (matchLines.includes(lineNumber)) {
                            style.backgroundColor = 'rgba(57, 186, 145, .2)'
                        }
                        return style
                    }}>
                    {
                        resultString
                    }
                </SyntaxHighlighter>
            </div>
        )
    }
}

class Search extends Component {
    constructor(props) {
        super(props)
        this.handleScroll = this.handleScroll.bind(this)
        this.state = {
            isFixed: false
        }
    }

    componentDidMount() {
        this.refs.wrap.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount() {
        this.refs.wrap.removeEventListener('scroll', this.handleScroll)
    }

    handleScroll(event) {
        const scrollTop = event.srcElement.scrollTop
        if (scrollTop > 147) {
            this.setState({ isFixed: true })
        } else {
            this.setState({ isFixed: false })
        }
    }

    render() {
        const {
            isFetching,
            query,
            results,
            handleSubmit
        } = this.props

        const { isFixed } = this.state
        return (
            <div className={classnames('wrap', { 'fix-search': isFixed })} id="wrap" ref="wrap">
                <div className="search--container">
                    <div className="logo--wrapper">
                        <img src={logo} alt="Logo" className="logo--bdb"/>
                    </div>
                    <div className="search ui centered grid">
                        <div id="search--wrap" className="five wide column">
                            <div className="ui fluid icon input name">
                                <Form onSubmit={handleSubmit} autoComplete="off">
                                    <Form.Field>
                                        <Field name="query" component="input" type="text"
                                               placeholder='Type to search BigchainDB' autoComplete="off"
                                               required/>
                                        <button className="ui button primary bigchaindb"
                                                type='submit'>Search</button>
                                    </Form.Field>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
                    <main>
                        <div className="results-meta">
                            About { Object.values(results).length } results
                            ... { isFetching ? 'Still loading' : null }
                        </div>
                        <div className="results">
                            { Object.values(results).map(result =>
                                <SearchResult
                                    key={result._tx}
                                    query={query}
                                    result={result}/>
                            )}
                        </div>
                    </main>
            </div>
        )
    }
}

Search.propTypes = {
    results: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired
}

const SearchForm = reduxForm({
    form: 'search',

})(Search)

export default SearchForm
