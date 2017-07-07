import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Field, reduxForm } from 'redux-form'
import { Form, Button } from 'semantic-ui-react'
import JSONTree from 'react-json-tree'

const theme = {
    scheme: 'monokai',
    author: 'wimer hazenberg (http://www.monokai.nl)',
    base00: '#272822',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef',
    base0E: '#ae81ff',
    base0F: '#cc6633'
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
            results,
            handleSubmit
        } = this.props

        const { isFixed } = this.state

        return (
            <div className={classnames('wrap', { 'fix-search': isFixed })} id="wrap" ref="wrap">

                <div className="search">
                    <Form onSubmit={handleSubmit} autoComplete="off">
                        <Form.Field>
                            <Field name="query" component="input" type="text"
                                   placeholder='Type to search BigchainDB' autoComplete="off"
                                   required/>
                        </Form.Field>
                        <Button className="button primary" type='submit'>Search</Button>
                    </Form>
                </div>

                <main>
                    <div className="results">
                        { Object.values(results).map(result =>
                            <div className="result">
                                {result.result.url}
                                <pre key={result._tx}>
                                     {JSON.stringify(result.result, null, 2)}
                                </pre>
                            </div>
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
