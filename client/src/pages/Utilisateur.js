import React from 'react';
import { Api } from '../Api';



class Utilisateur extends React.Component {
    constructor(props) {
      super(props);
      const iduser = localStorage.getItem('iduser'); // renvoies la valeur associé à la clé passée en paramètre
      if (!iduser) this.props.changerPage('login');
      this.state = {
        login: '',
        firstname: '',
        lastname: '',
        password: '',
      };
      
     
      
    }
    render() {
      const {changerPage} = this.props;
      const{lastname,firstname,login,password}=this.state;
        return (
          <div className="login-formulaire">
            <div className="profil-card">
             <h1>Profil de {login}</h1>
              <div className="label"> Nom : </div><div className="value">{lastname}</div> 
              <div className="label"> Prénom : </div><div className="value">{firstname}</div> 
              <div className="label"> Mot de Passe: </div><div className="value">{password}</div> 
            </div>
            <div className="connexion">
            <button onClick={()=>changerPage('accueil')}>Retour</button>
            <button onClick={()=>changerPage('motDePasse')}>Changer le mot de Passe </button>
            <button onClick={()=>changerPage('modification')}>Modifier </button>
          </div>
          </div>
        );
      }

      async componentDidMount() {
        try {
          const iduser = localStorage.getItem('iduser');
          const { data} = await Api.get(`/users/${iduser}`,{});
          console.log(data);
          this.setState({ lastname: data.user.lastname,firstname: data.user.firstname,login: data.user.login,password: data.user.password  });
        } catch (error) {
          console.log(error);
        }
      }

    }
  export default Utilisateur;