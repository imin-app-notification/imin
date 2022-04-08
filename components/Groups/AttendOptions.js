import React from "react";

// reactstrap components
import {
  Button,
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Label,
  UncontrolledTooltip,
  FormGroup,
  Input,
} from "reactstrap";

/**
 * Update the select of whether to attend an event in db
 *
 * @param {object}   user        User email address
 * @param {object}   idx         Event id
 * @param {object}   select      Selection of whether to attend an event
 */
async function updateSelect(user, idx, select) {
   // Send POST api to update the attend options 
  const response = await fetch('/api/attendOptionUpdate', {
    method: 'POST',
    body: JSON.stringify({ user, idx, select }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  // Obtain all the data from response
  const data = await response.json();
  // Check if success
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }
  return data;
}

/**
 * Attend options component that embedded in the upcoming event table
 *
 * @param {object}   props       Props that includes the user email addr
 * 
 * @return {object} formatted HTML
 */
function AttendOptions(props) {
  /**
   * Handle the update of selection.
   *
   * @param {object}  select     the user selection
   * 
   * @return {object} HTML formatted of the upcoming event table
   */
  function updateHandler(select) {
    updateSelect(props.user, props.idx, select)
  }
  // Return the formatting
  if (props.isAttend == 2) {
    return (
      <>
        <FormGroup>
          <Input
            id="exampleSelect"
            name="select"
            type="select"
            onChange={(e) => {
              updateHandler(e.target.value);
            }}
            defaultValue={2}
          >
            <option value={2}>
              Please Select
            </option>
            <option value={1}>
              Im In
            </option>
            <option value={0}>
              Im Out
            </option>
          </Input>
        </FormGroup>
      </>
    );
  } else {
    return (
      <>
        <FormGroup>
          <Input
            id="exampleSelect"
            name="select"
            type="select"
            onChange={(e) => {
              updateHandler(e.target.value);
            }}
            defaultValue={props.isAttend == 1 ? 1 : 0}
          >
            <option value={1}>
              Im In
            </option>
            <option value={0}>
              Im Out
            </option>
          </Input>
        </FormGroup>
      </>
    );
  }
}

export default AttendOptions;
