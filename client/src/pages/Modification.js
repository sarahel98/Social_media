import React from 'react';
import { Api } from '../Api';

class Modification extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          firstname: '',
          lastname: '',
          password: '',
          login:'',
        };
    }
    
    render(){
    const { changerPage } = this.props;
    const { lastname,firstname,login,password} = this.state;
    return (
      <div className="login-formulaire">
        <h1>Changer Mot de Passe </h1>
        <div className="container">
        <div className="input">
            <label htmlFor="login">Login</label>
            <input type="text" name="login" id="login" value={login} onChange={e => this.setState({ login: e.target.value })} />
          </div>
          <div className="input">
            <label htmlFor="lastname">Mot de passe</label>
            <input type="password" name="password" id="password" value={password} onChange={e => this.setState({ password: e.target.value })} />
          </div>
          <div className="input">
            <label htmlFor="lastname">Nom de Famille </label>
            <input type="text" name="lastname" id="lastname" value={lastname} onChange={e => this.setState({ lastname: e.target.value })} />
          </div>
          <div className="input">
            <label htmlFor="firstname">Prénom </label>
            <input type="text" name="firstname" id="firstname" value={firstname} onChange={e => this.setState({ firstname: e.target.value })} />
          </div>
          <div className="connexion">
            <button onClick={this.modifier}>Sauvegarder modifications</button>
          </div>
          <div className="links">
            <button onClick={() => changerPage('utilisateur')}>Retour </button>
          </div>
        </div>
      </div>
    );
    }
    modifier= async () => {
        try {
          const {lastname,firstname,login,password} = this.state;
          const { data } = await Api.post('/users/change/firstlast', {
            lastname,
            firstname,
            login,
            password
          });
          if (!data.iduser)return;
          localStorage.setItem('iduser', data.iduser);
          
        } catch (error) {
          console.log(error);
        }
      };


}
export default Modification;