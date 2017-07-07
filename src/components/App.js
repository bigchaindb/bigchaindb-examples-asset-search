/* eslint-disable no-unused-vars */
import React from 'react'
import { Route } from 'react-router-dom'

import SearchLoader from '../containers/SearchLoader'
/* eslint-enable no-unused-vars */

const App = () => (
    <div>
        <Route exact path="/" component={SearchLoader}/>
    </div>
)

export default App
