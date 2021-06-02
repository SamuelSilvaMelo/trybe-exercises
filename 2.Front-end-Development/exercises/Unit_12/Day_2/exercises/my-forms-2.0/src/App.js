import React from 'react';
import './App.css';
import Name from './name';
import Email from './email';
import CPF from './CPF';
import Address from './address';
import City from './city';
import State from './state';
import Home from './home';
import ProfessionalResume from './professionalResume'

class App extends React.Component {
  constructor() {
    super()

    this.inputValue = this.inputValue.bind(this);
    this.checkCityName = this.checkCityName.bind(this);

    this.state = {
      name: '',
      email: '',
      CPF: '',
      address: '',
      city: '',
      state: '',
      homeType: '',
      ProfessionalResume: '',
    }
  }

  inputValue({ target }) {
    let { name, value } = target;

    if (name === 'name') {
      value = value.toUpperCase();
      target.value = value;
    };

    if (name === 'address') {
      value = value.replace(/[^\w\s]/gi, '')
    };

    value = target.type === 'radio' ? target.id : target.value;

    this.setState({
      [name]: value
    })
  }

  checkCityName({ target }) {
    let value = target.value;
    value = target.value.replace(/^\d/, '');

    this.setState({
      city: value
    })
  }

  render() {
    return (
      <form>
        <fieldset>
          <Name inputValue={ this.inputValue } />
          <Email inputValue={ this.inputValue } />
          <CPF inputValue={ this.inputValue } />
          <Address inputValue={ this.inputValue } />
          <City inputValue={ this.inputValue } checkCityName={ this.checkCityName } />
          <State inputValue={ this.inputValue } />
          <Home inputValue={ this.inputValue } />
        </fieldset>
        <fieldset>
          <ProfessionalResume inputValue={ this.inputValue } />
        </fieldset>
        <button type="submit">Enviar</button>
      </form>);
  }
}

export default App;
