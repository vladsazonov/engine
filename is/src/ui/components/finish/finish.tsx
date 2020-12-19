import React from 'react';
import { Button } from '@material-ui/core';
interface FinishProps {
  data: any;
}
export default class Finish extends React.Component<FinishProps> {
  data: any | null = null;
  constructor(props: FinishProps) {
    super(props);
    const data = this.props.data;
    data.steps = data.steps.map((s: { users: any[]; status: string; type: string }) => {
      const success = s.users.filter(u => u.status === 'Принят');
      s.status =
        s.type === 'and' && success.length === s.users.length
          ? 'Принят'
          : (s.type === 'or' || s.type === 'single') && success.length > 0
          ? 'Принят'
          : 'Отклонён';
      return s;
    });
    data.status =
      data.steps.filter((s: { status: string }) => s.status === 'Принят').length === data.steps.length
        ? 'Принят'
        : 'Отклонён';
  }

  getResultStep = () => (
    <div>
      {this.props.data.steps.map((s: { type: React.ReactNode; status: React.ReactNode; users: any[] }, i: number) => (
        <div>
          <p>
            <strong>
              Этап {i + 1} ({s.type}): {s.status}
            </strong>
          </p>
          {s.users.map((u: { name: React.ReactNode; status: React.ReactNode; comment: any }) => (
            <div>
              {u.name} - {u.status ? u.status : 'Не участвовал(а)'} {u.comment ? `(${u.comment})` : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
  getResult = () => (
    <p>
      <strong>Итоговый результат: {this.props.data.status}</strong>
    </p>
  );
  loadFile = () => {
    const blob = new Blob([JSON.stringify(this.props.data)], { type: 'octet/stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.hidden = true;
    a.href = url;
    a.download = 'result.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  render() {
    return (
      <div style={{ marginTop: '20px' }}>
        {this.getResultStep()}
        {this.getResult()}
        <Button color="primary" variant="contained" onClick={this.loadFile} style={{ marginTop: '10px' }}>
          Сохранить
        </Button>
      </div>
    );
  }
}
