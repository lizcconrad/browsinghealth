import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './home/Home.js';
import ConditionPage from './condition/ConditionPage.js';

// List of important conditions selected for the Quick Access list on the homepage
// To change what shows up in Quick Access, change this list
const conditions = ["Asthma", "Autism", "Chronic Obstructive Pulmonary Disease", "Depression",
"Heart Failure", "Rheumatoid Arthritis", "Stroke"];

const HomeComponent = () => (
  <Home conditions={conditions} />
)

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact strict component={HomeComponent}/>
          <Route path="/defaultsite" exact strict component={HomeComponent}/>
          <Route path="/condition/:condition_name?" exact strict component={ConditionPage}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
