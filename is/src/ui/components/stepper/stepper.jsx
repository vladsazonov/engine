import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { PersonOutline } from '@material-ui/icons';
import ListSubheader from '@material-ui/core/ListSubheader';
import { TextField } from '@material-ui/core';

import AcceptDialog from '../accept-dialog/accept-dialog';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f5f5f5'
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  buttonPrimary: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  },
  resultBlock: {
    height: 'auto',
    overflow: 'auto',
    borderRadius: 16
  },
  resultBlockContent: {
    overflow: 'auto',
    height: 400,
    padding: 12
  },
  jsonField: {
    width: '100%',
    margin: '12px 0'
  },
  stepContent: {
    maxHeight: 560,
    overflow: 'auto'
  },
  muiStepperRoot: {
    width: 340,
    boxShadow: '0px 3px 5px 0px rgb(0 0 0 / 23%), 0px 3px 5px 9px rgb(0 0 0 / 2%)',
    borderRadius: 24
  },

  typographyColor: {
    color: 'rgba(49, 69, 106, 1)'
  }
}));

function getSteps() {
  return ['Вставьте JSON документ', 'Процесс принятия документа', 'Результат'];
}

const tryParseJSON = jsonString => {
  try {
    const o = JSON.parse(jsonString);

    if (o && typeof o === 'object') {
      return o;
    }
  } catch (e) {}

  return false;
};

export default function VerticalLinearStepper() {
  const classes = useStyles();

  const [activeStep, setActiveStep] = React.useState(0);
  const [text, setText] = React.useState('');
  const [json, setJson] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [clickedUser, setClickedUser] = React.useState({ id: null, name: null, result: null });
  const [currentConditionStep, setCurrentConditionStep] = React.useState(1);

  const steps = getSteps();

  const handleOpenAcceptingDialog = user => {
    setClickedUser(user);
    setOpen(true);
  };

  const handleCloseAcceptingDialog = value => {
    const workJson = json;
    const currentCondition = workJson.accepting[currentConditionStep - 1];
    const currentUserIndex = workJson.accepting[currentConditionStep - 1].users.findIndex(user => user.id === value.id);

    workJson.accepting[currentConditionStep - 1].users[currentUserIndex] = value;

    setJson(workJson);
    setClickedUser(null);

    if (checkStep(workJson.accepting[currentConditionStep - 1].users) === currentCondition.users.length) {
      const conditionResult = calculateConditionResult(
        workJson.accepting[currentConditionStep - 1].condition,
        workJson.accepting[currentConditionStep - 1].users
      );

      workJson.accepting[currentConditionStep - 1].result = conditionResult;

      setCurrentConditionStep(prevActiveStep => prevActiveStep + 1);
    }

    setOpen(false);
  };

  const checkStep = users => {
    const isStepCompleted = users.filter(user => typeof user.result === 'boolean');

    return isStepCompleted.length;
  };

  const isAllStepsDone = accepting => {
    if (accepting) {
      const acceptedConditions = accepting.filter(elem => typeof elem.result === 'boolean');

      return acceptedConditions.length === accepting.length;
    }

    return false;
  };

  const calculateConditionResult = (condition, users) => {
    let i = 0;

    if (condition === 'or') {
      const trueAnswers = users.filter(user => !!user.result);
      return !!trueAnswers.length;
    } else if (condition === 'and') {
      for (let user of users) {
        if (!!user.result) {
          i++;
          if (i === users.length) {
            return true;
          }
          continue;
        } else {
          return false;
        }
      }
    }
  };

  const calculateFinalDocument = () => {
    const jsonState = json;

    let i = 0;
    let documentResult = false;

    for (let condition of jsonState.accepting) {
      if (!!condition.result) {
        i++;
        if (i === jsonState.accepting.length) {
          documentResult = true;
        }
        continue;
      }
    }

    jsonState.result = documentResult;

    setJson(jsonState);
  };

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    clearData();
  };

  const handleChange = event => {
    setText(event.target.value);
  };

  const loadJSON = () => {
    if (tryParseJSON(text)) {
      setJson(JSON.parse(text));

      handleNext();
    }
  };

  const revertProcess = () => {
    clearData();
    handleBack();
  };

  const clearData = () => {
    setJson(null);
    setText('');
    setClickedUser(null);
    setCurrentConditionStep(1);
  };

  const doneProcess = () => {
    calculateFinalDocument();
    handleNext();
  };

  const getUsers = () => {
    return (
      json &&
      json.accepting &&
      json.accepting.map(elem => (
        <>
          <List
            key={elem.step}
            component="nav"
            aria-label="main mailbox folders"
            subheader={
              <ListSubheader disableSticky={true} component="div" id="nested-list-subheader">
                {elem.condition}
              </ListSubheader>
            }
          >
            {elem.users.map(user => (
              <>
                <ListItem
                  key={user.id}
                  button
                  disabled={elem.step !== currentConditionStep}
                  onClick={() => handleOpenAcceptingDialog(user)}
                >
                  <ListItemIcon>
                    <PersonOutline />
                  </ListItemIcon>
                  <ListItemText
                    primary={user.name}
                    style={{ color: typeof user.result === 'boolean' ? 'rgb(125 173 211)' : '' }}
                  />
                </ListItem>
              </>
            ))}
            <Divider />
          </List>
        </>
      ))
    );
  };

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              variant="outlined"
              multiline
              placeholder="JSON"
              className={classes.jsonField}
              value={text}
              onChange={handleChange}
            />

            <div className={classes.actionsContainer}>
              <Button
                disabled={!tryParseJSON(text)}
                variant="contained"
                color="primary"
                onClick={() => loadJSON()}
                className={classes.buttonPrimary}
              >
                Загрузить
              </Button>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="h4">{json && json.document}</Typography>
            <Typography variant="h6">Сотрудники</Typography>

            {getUsers()}

            <div className={classes.actionsContainer}>
              <div>
                <Button onClick={revertProcess} className={classes.button}>
                  Назад
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={doneProcess}
                  disabled={!isAllStepsDone(json && json.accepting)}
                  className={classes.buttonPrimary}
                >
                  Завершить
                </Button>
              </div>
            </div>

            <AcceptDialog open={open} clickedUser={clickedUser} onClose={handleCloseAcceptingDialog} />
          </>
        );

      case 2:
        return (
          <>
            <Typography variant="h6" style={{ color: json && json.result ? 'green' : 'red' }}>
              {json && json.result ? 'Документ принят' : 'Документ отклонен'}
            </Typography>

            <div className={classes.resultBlock}>
              <div className={classes.resultBlockContent}>
                <pre>
                  <Typography variant="caption">{JSON.stringify(json, null, 2)}</Typography>
                </pre>
              </div>
            </div>

            <div className={classes.actionsContainer}>
              <div>
                <Button onClick={handleReset} variant="contained" color="primary" className={classes.button}>
                  Сбросить
                </Button>
              </div>
            </div>
          </>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <div className={classes.root}>
      <Stepper
        classes={{
          root: classes.muiStepperRoot
        }}
        activeStep={activeStep}
        orientation="vertical"
      >
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
            <StepContent
              classes={{
                root: classes.stepContent
              }}
            >
              <Typography>{getStepContent(index)}</Typography>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
