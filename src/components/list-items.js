import React from "react";
import "./list-items.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Form,
  FormControl,
  Button,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function ListItems(props) {
  const items = props.items;
  const listItems = items.map((item) => {
    return (
      <div className="" key={item.id}>
          <Form.Row className="align-items-center">
            <Col sm={8} xs={8} className="my-1">
              <Form.Control
                type="text"
                id={item.id}
                value={item.text}
                onChange={(e) => {
                  //you will have to update this specific todo
                  console.log('setUpdate called')
                  props.setUpdate(e.target.value, item.id);
                }}
              />
            </Col>
            <Col sm={1} xs={2} className="my-1">
              <Button onClick={() => {
                  props.deleteItem(item.id);
                }}>
              <FontAwesomeIcon
                className="faicons"
                icon="times"
              />
              </Button>
            </Col>
            <Col sm={1} xs={2} className="my-1">
              {item.isUpdated&&(
                <Button onClick={() => {
                  console.log(item.id+' was checked')
                  props.updateItem(item);
                  }}>
                <FontAwesomeIcon
                  className="faicons"
                  icon="check"
                />
                </Button>
              )}
            </Col>
          </Form.Row>
      </div>
    );
  });
  return (
    <div>
        {listItems}
    </div>
  );
}

export default ListItems;
