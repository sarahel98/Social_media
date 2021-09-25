import React from 'react';
import { Api } from '../../Api';
import moment from 'moment';

class ListMessages extends React.Component {
  render() {
    const { messages } = this.props;
    return (
      <>
        <h2 className="messages-header">Messages</h2>
        {messages.map(message => {
          const { login, text, id, date } = message;
          const dateFormated = moment(+date).format('DD-MM-YY HH:mm');

          return (
            <div key={id} className="message">
             {login} ({dateFormated}) (idmessage: {id}) : {text}
            </div>
          );
        })}
      </>
    );
  }
}

export default ListMessages;
