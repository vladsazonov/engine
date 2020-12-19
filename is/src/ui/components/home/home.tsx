import React from 'react';
import { Button } from '@material-ui/core';
import { RouteComponentProps, navigate } from '@reach/router';
interface HomeState {
  data: any | null;
  error: string;
}
export default class Home extends React.Component<RouteComponentProps, HomeState> {
  state = {
    data: null,
    error: ''
  };
  loadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      this.readFile(files[0])
        .then(data => {
          this.setState({ data, error: '' });
        })
        .catch(err => {
          this.setState({ error: 'Ошибка' });
        });
    }
  };
  readFile = (file: File): Promise<any> => {
    const promise = new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        let data: any | null = null;
        try {
          data = JSON.parse(reader.result as string) as any;
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file, 'utf-8');
    }) as Promise<any>;
    return promise;
  };
  start = () => {
    navigate('choice', { state: { data: this.state.data } });
  };
  render() {
    return (
      <div>
        {this.state.error && <p className="home-error">{this.state.error}</p>}
        <input
          accept="application/json"
          id="outlined-button-file"
          type="file"
          className="home-input"
          onChange={this.loadFile}
        />
        <label htmlFor="outlined-button-file">
          <Button variant="outlined" component="span" className="home-button">
            Загрузить
          </Button>
        </label>
        <Button
          variant="contained"
          color="primary"
          disabled={!this.state.data}
          onClick={this.start}
          className="home-button"
        >
          Запустить
        </Button>
      </div>
    );
  }
}
