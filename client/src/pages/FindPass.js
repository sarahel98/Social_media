import React from 'react';
import { Api } from '../Api';

class FindPass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login1: '',
      login2: '',
      password: '',
    };
  }

  render() {
    const { changerPage } = this.props;
    const { login1,login2, password } = this.state;
    return (
      <div className="login-formulaire">
        <h1>Récuperer mot de passe</h1>
        <div className="container">
          <div className="input">
            <label htmlFor="login">Login </label>
            <input type="text" name="login1" id="login1" value={login1} onChange={e => this.setState({ login1: e.target.value })} />
          </div>
          <div className="input">
            <label htmlFor="login2">Le login à nouveau :</label>
            <input type="text" name="login" id="login2" value={login2} onChange={e => this.setState({ login2: e.target.value })} />
          </div>
          <div className="links">
             <button onClick={this.find}>Soumettre</button>
            <button onClick={() => changerPage('login')}>Authentification  </button>
          </div>
          <div className="input">
          <div className="label"> Mot de passe : </div><div className="value">{password}</div> 
          </div>
        </div>
      </div>
    );
  }

  
  find= async () => {
    const {login1, login2}= this.state;
    const changerPage = this.props;
    try {
      const { data} = await Api.post(`/authentification/mdp`, {login1,login2});
      if (!data.mdp)return; // 
      this.setState({ password: data.mdp.password}); 
    } catch (error) {
      console.log(error);
    }
  };
  async componentDidMount() {
    await this.find();
  }
  
}

export default FindPass;
