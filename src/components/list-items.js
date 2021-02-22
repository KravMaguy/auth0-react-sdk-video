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
      <div className="" key={item.key}>
          <Form.Row className="align-items-center">
            <Col sm={8} xs="auto" className="my-1">
              <Form.Control
                type="text"
                id={item.key}
                value={item.text}
                onChange={(e) => {
                  props.setUpdate(e.target.value, item.key);
                }}
              />
            </Col>
            <Col sm={1} xs="auto" className="my-1">
              <FontAwesomeIcon
                className="faicons"
                onClick={() => {
                  props.deleteItem(item.key);
                }}
                icon="trash"
              />
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
