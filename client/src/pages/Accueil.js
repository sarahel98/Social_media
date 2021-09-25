import React from 'react'; // module node
import { Api } from '../Api';
import birdLogo from '../birdLogo.svg';
import NewMessage from './AccueilComponents/NewMessage';
import ListMessages from './AccueilComponents/ListMessages';
import Users from './AccueilComponents/Users';

/** React nous permet de définir les composants en tant que classes ou fonctions. Composants définis par des classes fournissent pour le moment davantage de fonctionnalités
 * Pour définir un composant React avec une classe, on doit étendre avec React.Component
 * Les constructeurs React sont habituellement utilisés pour deux raisons seulement:
 * Initialiser l'étal local en affectant un objet à this.state et lier des méthodes gestionnaires d'événements à l'instance.
*/
class Accueil extends React.Component { 
  
  /** On crée un constructeur  */
  constructor(props) { // props = propriétes 
    super(props); //Javascript oblige à  utiliser super(props) pour qu'on puisse utiliser le this apres. 
    const iduser = localStorage.getItem('iduser'); 
    if (!iduser) this.props.changerPage('login');
    this.state = {
      login: '', 
      iduser: iduser,
      messages: [],
    };
  }
  
  render() {
    const { logout, changerPage } = this.props;
    const { iduser, login, messages } = this.state;

    return (
      <div className="accueil-page">
       <div className="accueil-header">
          <div>
            <img src={birdLogo} alt="birdLogo" width="100px" height="100px" className="accueil-logo" />
          </div>
          <div className="accueil-recherche">
            <input type="text" placeholder="Rechercher ..." onChange={e => this.recherche(e.target.value)} />
          </div>
          <div className="accueil-deconnexion">
            <button onClick={() => changerPage('utilisateur')}>{login} </button>
            <button onClick={logout}>Déconnexion</button> 
          </div>
        </div>
        <div className="accueil-body">
          <div className="accueil-users">
            <Users />
          </div>
          <div className="accueil-main">
            <div className="accueil-new-message">
              <NewMessage iduser={iduser} />
            </div>
            <div className="accueil-list-messages">
              <ListMessages messages={messages} /> 
            </div>
          </div>
        </div>
      </div>
    );
  }
  recherche = async textRecherche => {
    try {
      const { data } = await Api.get(`/recherche?text=${textRecherche.trim()}`, {});
      this.setState({ messages: data.messages });
    } catch (error) {
      console.log(error);
    }
  };

  async componentDidMount() {
    try {
      const iduser = localStorage.getItem('iduser');
      const { data: data1 } = await Api.get(`/users/${iduser}`, {});
      const { data: data2 } = await Api.get(`/users/messages`, {});
      this.setState({ login: data1.user.login, messages: data2.messages });
    } catch (error) {
      console.log(error);
    }
  }
}

export default Accueil;
