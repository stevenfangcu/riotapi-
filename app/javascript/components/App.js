import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import { render } from 'react-dom'
import Home from './Home'
import About from './About'
import Contact from './Contact'
import Search from './Search'
import './App.css'

class App extends Component {

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/search" component={Search} />
        </Switch>
      </div>

    )
  }
}

export default App
