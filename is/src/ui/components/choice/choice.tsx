import React, { Component } from 'react';
import { RouteComponentProps, Redirect } from '@reach/router';
import { Stepper, Step, StepLabel, Button } from '@material-ui/core';
import AppStep from '../step/step';
import Finish from '../finish/finish';

interface ChoiceState {
  data: any;
  activeStep: number;
}
export default class Choice extends Component<RouteComponentProps, ChoiceState> {
  state = {
    activeStep: 0,
    data: {
      name: '',
      creator: '',
      steps: [] as any[]
    }
  };
  componentWillMount() {
    if (this.props.location && this.props.location.state) {
      this.setState({ data: (this.props as any).location.state.data });
    }
  }
  handleNext = () => {
    this.setState(st => ({ activeStep: st.activeStep + 1 }));
  };
  handleReset = () => {
    const data = this.state.data;
    data.steps = data.steps.map(s => ({
      type: s.type,
      users: s.users.map((u: { name: any }) => ({ name: u.name }))
    })) as any[];
    this.setState({
      data,
      activeStep: 0
    });
  };
  handleStatus = (user: any, userIndex: number) => {
    const data = this.state.data;

    data.steps[this.state.activeStep].users[userIndex] = user;
    this.setState({ data });
  };
  render() {
    if (!this.state.data.steps.length) {
      return <Redirect to="/" />;
    }
    return (
      <>
        <p style={{ textAlign: 'center' }}>
          <strong>
            {this.state.data.name} ({this.state.data.creator})
          </strong>
        </p>
        <Stepper alternativeLabel activeStep={this.state.activeStep}>
          {this.state.data.steps.map((_: any, index: number) => (
            <Step key={`Этап ${index + 1}`}>
              <StepLabel>{`Этап ${index + 1}`}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {this.state.data.steps.length !== this.state.activeStep && (
          <AppStep step={this.state.data.steps[this.state.activeStep]} changeStatus={this.handleStatus} />
        )}
        <div style={{ padding: '20px 10px', textAlign: 'center' }}>
          {this.state.activeStep === this.state.data.steps.length ? (
            <>
              <Button variant="outlined" onClick={this.handleReset}>
                Сброс
              </Button>
              <Finish data={this.state.data} />
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={this.handleNext}>
              {this.state.activeStep === this.state.data.steps.length - 1 ? 'Завершить' : 'Далее'}
            </Button>
          )}
        </div>
      </>
    );
  }
}
