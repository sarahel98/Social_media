import React from 'react';
import { Api } from '../Api';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      firstname: '',
      lastname: '',
      password: '',
      password2: '',
    };
  }
  render() {
    const { changerPage } = this.props;
    const { login, password, password2, firstname, lastname } = this.state;
    return (
      <div className="signup-formulaire">
         <h1>Création de compte </h1>
        <div className="container">
          <div className="input">
            <label htmlFor="firstname">Prenom </label>
            <input type="text" value={firstname} onChange={e => this.setState({ firstname: e.target.value })} />
          </div>
          <div className="input">
            <label htmlFor="lastname">Nom </label>
            <input type="text" value={lastname} onChange={e => this.setState({ lastname: e.target.value })} />
          </div>
          <div className="input">
            <label htmlFor="login">Login </label>
            <input type="text" value={login} onChange={e => this.setState({ login: e.target.value })} />
          </div>
          <div className="input">
            <label htmlFor="password">Mot de passe </label>
            <input type="password" value={password} onChange={e => this.setState({ password: e.target.value })} />
          </div>
          <div className="input">
            <label htmlFor="password2">Repeter le mot de passe </label>
            <input type="password" value={password2} onChange={e => this.setState({ password2: e.target.value })} />
          </div>
          <div className="connexion">
            <button onClick={this.createUser}>Connexion</button>
          </div>
          <div className="links">
            <button onClick={() => changerPage('login')}>Annuler </button>
          </div>
        </div>
       
      </div>
     
    );
  }
  createUser = async () => {
    try {
      const { changerPage } = this.props;
      const { login, password, password2, firstname, lastname } = this.state;
      if (password !== password2) return;
      const { data } = await Api.post('/users', {
        login,
        password,
        firstname,
        lastname,
      });
      if (!data.iduser) return;
      localStorage.setItem('iduser', data.iduser);
      changerPage('login');
    } catch (error) {
      console.log(error);
    }
  };
}

export default Signup;
