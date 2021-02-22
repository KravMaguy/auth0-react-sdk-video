import React from "react";
import ListItems from "./list-items";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  Form,
  Button,
  Col,
} from "react-bootstrap";

library.add(faTrash);
export default class UserTodos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      currentItem: {
        text: "",
        key: "",
      },
    };
    this.addItem = this.addItem.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.setUpdate = this.setUpdate.bind(this);
  }

  componentDidMount(){
    console.log('todos did mount')
    console.log(this.props.user.email, 'the props email')
    fetch(`http://localhost:6060/profile/${this.props.user.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(email=>console.log(email))
      
  }

  addItem(e) {
    e.preventDefault();
    const newItem = this.state.currentItem;
    if (newItem.text !== "") {
      const items = [...this.state.items, newItem];
      this.setState({
        items: items,
        currentItem: {
          text: "",
          key: "",
        },
      });
    }
  }
  handleInput(e) {
    this.setState({
      currentItem: {
        text: e.target.value,
        key: Date.now(),
      },
    });
  }
  deleteItem(key) {
    const filteredItems = this.state.items.filter((item) => item.key !== key);
    this.setState({
      items: filteredItems,
    });
  }
  setUpdate(text, key) {
    console.log("items:" + this.state.items);
    const items = this.state.items;
    items.map((item) => {
      if (item.key === key) {
        console.log(item.key + "    " + key);
        return item.text = text;
      } else {
        return null
      }
    });
    this.setState({
      items: items,
    });
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
                <Button className="btn btn-full-width" type="submit">Submit</Button>
              </Col>
            </Form.Row>
          </Form>
          <p>{this.state.items.text}</p>

          <ListItems
            items={this.state.items}
            deleteItem={this.deleteItem}
            setUpdate={this.setUpdate}
          />
        </div>
      </div>
    );
  }
}
