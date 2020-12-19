import React from 'react';
import { Grid } from '@material-ui/core';
import { Router } from '@reach/router';
import Home from './home/home';
import Choice from './choice/choice';
export default class App extends React.Component {
  render() {
    return (
      <Grid container justify="center" alignItems="center" style={{ height: '100vh', width: '100vw' }}>
        <Grid item xs={6}>
          <Router>
            <Home path="/" />
            <Choice path="/choice" />
          </Router>
        </Grid>
      </Grid>
    );
  }
}
