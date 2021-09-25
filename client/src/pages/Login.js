import React from 'react';
import { Api } from '../Api';
import birdLogo from '../birdLogo.svg';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: 'admin',
      password: 'admin',
    };
  }

  render() {
    const { changerPage } = this.props;
    const { login, password } = this.state;
    return (
      <div className="login-formulaire">
        <img src={birdLogo} alt="birdLogo" width="100px" height="100px" />
        <div className = "titre-login">
          <h1> Touitère  </h1>
        </div>
        <h1>Ouvrir une session</h1>
        <div className="container">
          <div className="input">
            <label htmlFor="login">Login </label>
            <input type="text" name="login" id="login" value={login} onChange={e => this.setState({ login: e.target.value })} />
          </div>
          <div className="input">
            <label htmlFor="password">Mot de passe </label>
            <input type="password" name="password" id="password" value={password} onChange={e => this.setState({ password: e.target.value })} />
          </div>
          <div className="connexion">
            <button onClick={this.login}>Connexion</button>
          </div>
          <div className="links">
            <button onClick={() => changerPage('motDePassePerdu')}>Mot de passe perdu ? </button>
            <button onClick={() => changerPage('signup')}>Pas encore inscrit ? </button>
          </div>
        </div>
      </div>
    );
  }

  login = async () => {
    try {
      const { login, password } = this.state;
      const { data } = await Api.post('/authentification/login', {
        login,
        password,
      });
      const { changerPage } = this.props;
      if (!data.iduser) return;
      localStorage.setItem('iduser', data.iduser);
      changerPage('accueil');
    } catch (error) {
      console.log(error);
    }
  };
  
}

export default Login;
