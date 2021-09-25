import React from 'react';
import { Api } from '../../Api';

class NewMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }
  render() {
    const { text } = this.state;
    return (
      <>
        <textarea
          id="story"
          name="story"
          rows="4"
          value={text}
          placeholder="New message ..."
          onChange={e => this.setState({ text: e.target.value })}
        ></textarea>
        <button onClick={() => this.createMessage()}>Send</button>
      </>
    );
  }
  createMessage = async () => {
    try {
      const { iduser } = this.props;
      const { text } = this.state;

      if (!text || !text.trim()) return;

      const date = Date.now();
      await Api.post(`/users/${iduser}/messages`, {
        text,
        date,
      });
      this.setState({ text: '' });
    } catch (error) {
      console.log(error);
    }
  };
}

export default NewMessage;
