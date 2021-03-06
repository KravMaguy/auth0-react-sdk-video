import React from "react";
import ListItems from "./list-items";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Form, Button, Col } from "react-bootstrap";

library.add(faTimes, faCheck);
export default class UserTodos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: [],
      items: [],
      currentItem: {
        text: "",
        id: "",
      },
    };
    this.addItem = this.addItem.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.setUpdate = this.setUpdate.bind(this);
  }
  // persist = (newTodos) => {
  //   fetch(`${process.env.REACT_APP_SERVER_URL}/todos`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Basic ${credentials.username}:${credentials.password}`,
  //     },
  //     body: JSON.stringify(newTodos),
  //   }).then(() => {});
  // };
  handleErrors = async (response) => {
    console.log("handleErrors called");
    console.log("response in handleErrors", response);
    if (!response.ok) {
      const { message } = await response.json();
      throw Error(message);
    }
    return response.json();
  };

  UpdateDb=(newTodos)=>{
    fetch(`${process.env.REACT_APP_SERVER_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${this.state.username}:${this.state.password}`,
      },
      body: JSON.stringify(newTodos),
    }).then(() => {});
  }

  componentDidMount() {
    console.log("todos did mount");
    const { sub, email } = this.props.user;
    console.log(sub, email);
    let subNum = sub.slice(sub.indexOf("|") + 1);
    console.log(subNum, "subnum");
    console.log(this.props.user);
    let username = email;
    let password = subNum;

    fetch(`${process.env.REACT_APP_SERVER_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      // .then(this.handleErrors)
      .then((res) => res.json())
      .then((res) => console.log(res, "res"))
      .then(() => {
        this.setState({
          username,
          password,
        });
      })
      .then(() => {
        console.log("then username:", username);
        console.log("then password:", password);

        fetch(`${process.env.REACT_APP_SERVER_URL}/todos`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${username}:${password}`,
          },
        })
          .then((response) => response.json())
          .then((todos)=>{
            console.log('todos in componentDidmount: ', todos)
            let newTodos=todos.map((todo)=>({
              isUpdated: false,
              ...todo
            }))
            console.log(newTodos, 'new Todos')
            this.setState({items:newTodos})
          })
          .then((todos) => console.log(todos, ": todos"))
      })
      .catch((error) => {
        console.log("catch in componentdidmount");
        console.log(error.message, error.user);
      });
  }

  addItem(e) {
    e.preventDefault();
    console.log("this.state items: ", this.state.items);
    const newItem = this.state.currentItem;
    if (newItem.text !== "") {
      const items = [...this.state.items, newItem];
      this.setState({
        items: items,
        currentItem: {
          text: "",
          id: "",
        },
      });
      //post to add todo route
      this.UpdateDb(items)
    }
  }
  handleInput(e) {
    this.setState({
      currentItem: {
        text: e.target.value,
        id: Date.now(),
      },
    });
  }
  deleteItem(id) {
    const filteredItems = this.state.items.filter((item) => item.id !== id);
    this.setState({
      items: filteredItems,
    });
    this.UpdateDb(filteredItems)
    //post to add todo route
  }
  setUpdate(text, id) {
    // console.log("items:" + this.state.items);
    const items = this.state.items;
    items.map((item) => {
      if (item.id === id) {
        // console.log(item.id + "    " + id);
        return (item.text = text, item.isUpdated=true);
      } else {
        return null;
      }
    });
    this.setState({
      items: items,
    });
  }

  updateItem=(item)=>{
    console.log('update item')
    console.log(item)
    const items = this.state.items;
    items.map((x) => {
      if (x.id === item.id) {
        // console.log(item.id + "    " + id);
        return (x.isUpdated=false);
      } else {
        return null;
      }
    });
    this.setState({
      items: items,
    });
    this.UpdateDb([...this.state.items])
  }
  render() {
    return (
      <div className="App">
        <div className="Form-Container">
          <Form id="to-do-form" onSubmit={this.addItem}>
            <Form.Row className="align-items-center">
              <Col sm={9} xs="12" className="my-1">
                <Form.Control
                  type="text"
                  placeholder="Enter task"
                  value={this.state.currentItem.text}
                  onChange={this.handleInput}
                ></Form.Control>
              </Col>
              <Col sm={2} xs="12" className="my-1">
                <Button className="btn btn-full-width" type="submit">
                  Submit
                </Button>
              </Col>
            </Form.Row>
          </Form>
          <p>{this.state.items.text}</p>

          <ListItems
            items={this.state.items}
            deleteItem={this.deleteItem}
            setUpdate={this.setUpdate}
            updateItem={this.updateItem}
          />
        </div>
      </div>
    );
  }
}