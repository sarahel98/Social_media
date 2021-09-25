import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Accueil from './pages/Accueil';
import Utilisateur from './pages/Utilisateur';
import Password from './pages/Password';
import Modification from './pages/Modification';
import FindPass from './pages/FindPass';

class App extends React.Component {
  constructor(props) {
    super(props);
    const iduser = localStorage.getItem('iduser');
    this.state = {
      pageName: iduser ? 'accueil' : 'login',
    };
  }
  render() {
    const { pageName } = this.state;

    return <div className="App">{this.AfficherPage(pageName)}  </div>;
    
  }

  AfficherPage = pageName => {
    switch (pageName) {
      case 'login':
        return <Login changerPage={this.changerPage} />;
       
      case 'signup':
        return <Signup changerPage={this.changerPage} />;
       
      case 'accueil':
        return <Accueil changerPage={this.changerPage} logout={this.logout} />;
      
      case 'utilisateur':
        return < Utilisateur changerPage={this.changerPage} />;

      case 'motDePasse':
          return <Password changerPage={this.changerPage} />;
        
      case 'modification':
        return <Modification changerPage={this.changerPage} />;
      
      case 'motDePassePerdu':
        return < FindPass changerPage={this.changerPage} />;

        default:
        <Login Login={this.changerPage} />;
    }
  };// va retourner un composant et le mettre dans le render()
  changerPage = pageName => {
    this.setState({ pageName });
  };
  logout = () => {
    localStorage.removeItem('iduser');
    this.setState({
      pageName: 'login',
    });
  };
  
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') /*cette méthode nous permet de retrouver  l'élément root. Elle va rechercher l'élément par son id
Il va regarder dans index.html si le document contient l'id root et retournera si l'élément à été trouvé.*/
  );
