import React from 'react';
import { Api } from '../../Api';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      friends: [],
      test: 'succes'
    };
    /*this.addFriend = this.addFriend.bind(this);
    this.removeFriend = this.removeFriend.bind(this);
    this.isFriend = this.isFriend.bind(this);
    this.getFriends = this.getFriends.bind(this);
    this.getUsers = this.getUsers.bind(this);*/


  }
  async componentDidMount() {
    await this.getUsers();
    await this.getFriends();
  }
  render() {
    const { users } = this.state;
    return (
      <>
        <h2 className="users-header">Users</h2>
        {users.map(user => {
          const { login, id } = user;
          return (
            <div key={id} className="user">
              {login}
              <input
                id={id}
                type="checkbox"
                checked={this.isFriend(id)}
                onChange={async e => {
                  const value = e.target.checked;
                  const idfriend = e.target.getAttribute('id');
                  if (value) {
                    await this.addFriend(idfriend);
                  } else {
                    await this.removeFriend(idfriend);
                  }
                  await this.getFriends();
                }}
              />
            </div>
          );
        })}
      </>
    );
  }
  async getFriends() { // montre
    try {
      const iduser = localStorage.getItem('iduser');
      const { data: dataFriends } = await Api.get(`/users/${iduser}/friends`, {});
      const { friends } = dataFriends;
      this.setState({ friends: friends.map(friend => friend.idfriend) });
    } catch (error) {
      console.log(error);
    }
  }
  async getUsers() {
    try {
      const { data } = await Api.get(`/users`, {});
      const { users } = data;
      this.setState({ users });
    } catch (error) {
      console.log(error);
    }
  }
  async removeFriend(idfriend) {
    try {
      const iduser = localStorage.getItem('iduser');
      await Api.delete(`/users/${iduser}/friends/${idfriend}`, {});
    } catch (error) {
      console.log(error);
    }
  }
  async addFriend(idfriend) {
    try {
      const iduser = localStorage.getItem('iduser');
      await Api.post(`/users/${iduser}/friends`, { idfriend });
    } catch (error) {
      console.log(error);
    }
  }
  isFriend(idfriend) {
    const { friends } = this.state;
    return friends.includes(idfriend);
  }
  
}

export default Users;
