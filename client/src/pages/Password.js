import React from 'react';
import { Api } from '../Api';

class Password extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          login: '',
          password: '',
          newPassword: '',
        };
    }
    
    render(){
    const { changerPage } = this.props;
    const { login, password, newPassword } = this.state;
    return (
      <div className="login-formulaire">
        <h1>Changer Mot de Passe </h1>
        <div className="container">
          <div className="input">
            <label htmlFor="login">Login </label>
            <input type="text" name="login" id="login" value={login} onChange={e => this.setState({ login: e.target.value })} />
          </div>
          <div className="input">
            <label htmlFor="password">Mot de passe </label>
            <input type="password" name="password" id="password" value={password} onChange={e => this.setState({ password: e.target.value })} />
          </div>
          <div className="input">
            <label htmlFor="password">Nouveau Mot de Passe  </label>
            <input type="newPassword" name="newPassword" id="newPassword" value={newPassword} onChange={e => this.setState({ newPassword: e.target.value })} />
          </div>
          <div className="connexion">
            <button onClick={this.changer}>Changer Mot de Passe</button>
          </div>
          <div className="links">
            <button onClick={() => changerPage('utilisateur')}>Retour </button>
          </div>
        </div>
      </div>
    );
    }
    changer= async () => {
        try {
          const { login, password, newPassword} = this.state;
          const { data } = await Api.post('/users/change', {
            login,
            password,
            newPassword,
          });
          if (!data.iduser)return;
          localStorage.setItem('iduser', data.iduser);
          
        } catch (error) {
          console.log(error);
        }
      };


}
export default Password;