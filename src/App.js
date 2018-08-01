import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: '',
      username: '',
      items: [],
      logos: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    console.log(e.target.name);
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e, btn) {
    e.preventDefault();
    const btnName = btn
    const itemsRef = firebase.database().ref('images');
    const logosRef = firebase.database().ref('logos');

    const item = {
      url: this.state.currentItem,
      user: this.state.username
    }
    

    if (btnName === 'logobtn') {
      logosRef.push(item);
    }

    if (btnName === 'imagebtn') {
      itemsRef.push(item);
    }
    
    this.setState({
      currentLogo: '',
      username: ''
    });
  }
  
  componentDidMount() {
    const itemsRef = firebase.database().ref('images');
    const logosRef = firebase.database().ref('logos');
    logosRef.on('value', (snapshot) => {
      let logos = snapshot.val();
      let newState = [];
      for (let logo in logos) {
        newState.push({
          id: logo,
          title: logos[logo].logo,
        });
      }
      this.setState({
        logos: newState
      });
    });

    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user
        });
      }
      this.setState({
        items: newState
      });
    });
  }
  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }
  render() {
    return (
      <div className='app'>
        <header>
            <div className="wrapper">
              <h1>Fun Food Friends</h1>
                             
            </div>
        </header>
        <div className='container'>
          <section className='add-item'>
                <form>
                  <input type="text" name="username" placeholder="What's your name?" onChange={this.handleChange}  value={this.state.username} />
                  <input type="text" name="currentItem" placeholder="What are you bringing?" onChange={this.handleChange} value={this.state.currentItem} />
                  <button class="Logo" name="logo" onClick={(e, btn) => this.handleSubmit(e,'logobtn')} value={this.state.currentItem}>Logo</button>
                  <button class="Image" name="image" onClick={(e, btn) => this.handleSubmit(e,'imagebtn')} value={this.state.currentItem}>Image</button>
                </form>
          </section>
          <section className='display-item'>
              <div className="wrapper">
                <ul>
                  {this.state.items.map((item) => {
                    return (
                      <li key={item.id}>
                        <h3>{item.title}</h3>
                        <p>brought by: {item.user}
                          <button onClick={() => this.removeItem(item.id)}>Remove Item</button>
                        </p>
                      </li>
                    )
                  })}
                </ul>
              </div>
          </section>
        </div>
      </div>
    );
  }
}
export default App;