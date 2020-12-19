import React from 'react';
import { Button, Modal } from '@material-ui/core';
interface StepProps {
  step: any;
  changeStatus: (user: any, userIndex: number) => void;
}
interface StepState {
  commentModal: boolean;
  comment: string;
  user: any;
  userIndex: number;
}
export default class AppStep extends React.Component<StepProps, StepState> {
  state = {
    user: { name: '' },
    userIndex: 0,
    commentModal: false,
    comment: ''
  };
  getUsers = () =>
    this.props.step.users.map((u: any, i: any) => (
      <div key={u.name}>
        <p>{u.name}</p>
        <div>
          {u.status ? (
            <p>
              <strong>Выбор сделан</strong>
            </p>
          ) : (
            <>
              <Button
                color="primary"
                variant="contained"
                onClick={() => this.handleStatus(u, i, 'Принят')}
                style={{ marginRight: '10px' }}
              >
                Принять
              </Button>
              <Button
                color="secondary"
                variant="contained"
                onClick={() =>
                  this.setState({
                    commentModal: true,
                    user: u,
                    userIndex: i
                  })
                }
              >
                Отклонить
              </Button>
            </>
          )}
        </div>
      </div>
    ));
  commentModal = () => (
    <Modal
      open={this.state.commentModal}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div style={{ background: '#fff', padding: '10px' }}>
        <div>
          <textarea onChange={this.handleComment} placeholder="Комментарий"></textarea>
        </div>
        <Button color="primary" variant="contained" onClick={this.saveComment} style={{ marginRight: '10px' }}>
          Сохранить
        </Button>
      </div>
    </Modal>
  );
  handleComment = (txt: React.SyntheticEvent<HTMLTextAreaElement>) => {
    this.setState({ comment: txt.currentTarget.value });
  };
  handleStatus = (user: any, userIndex: number, status: any, comment?: string) => {
    if (comment) {
      user.comment = comment;
    }

    user.status = status;
    this.props.changeStatus(user, userIndex);
  };
  saveComment = () => {
    const { user, userIndex, comment } = this.state;

    this.setState({ commentModal: false });
    this.handleStatus(user, userIndex, 'Отклонён', comment);
  };
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <p>
          <strong>Тип - {this.props.step.type}</strong>
        </p>
        <div>{this.getUsers()}</div>
        {this.commentModal()}
      </div>
    );
  }
}
