import React from "react";
import { useRouter } from 'next/router'
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  ButtonGroup,
  Row,
  Col,
  Label,
} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import { parseCookies } from "../../lib/cookies";
import CreateGroupHeader from "components/Headers/CreateGroupHeader.js";

/**
 * 
 * @param {*} curUser Name of the use currently signed in
 * @param {*} groupNameRef Name of the group being created
 * @param {*} groupDetailsRef Details for the group
 * @returns 
 */
async function createGroup(curUser, groupNameRef, groupDetailsRef) {

  const _id = 0;
  const guestList = [];
  //Make api call to create a new group and assign it to curUser
  const response = await fetch('/api/group', {
    method: 'POST',
    body: JSON.stringify({
      user: curUser,
      group: {
        _id, groupNameRef, groupDetailsRef, guestList
      }
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }

  return data;
}

/**
 * 
 * @param {*} props User identification, used to tell which user is signed in
 * @returns 
 */
function CreateGroup(props) {
  //If user is not signed in, push them to login page
  const route = useRouter();
  if (!props.user) {
    route.push("auth/login")
  }
  let groupNameRef = null;
  let groupDetailsRef = null;
  // const add = async () => {
  //     const data = await fetch("http://localhost:3000/api/group?");
  //     const res = await data.json();
  //     console.log(res);
  // }

  /**
   * Called when the user clicks the button to create a group. 
   * Calls the createGroup function then pushes the user to the 
   * groups page
   * @param {*} event The event created when the form is submitted
   */
  async function submitHandler(event) {
    //console.log("Click");
    event.preventDefault();
    await createGroup(props.user, groupNameRef.value,
      groupDetailsRef.value);
    route.push("groups");
  }

  return (
    <>
      <CreateGroupHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Create a Group</h3>
                  </Col>
                  <Col className="text-right" xs="4">

                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {/*Form for submitting group name and details */}
                <Form onSubmit={submitHandler}>
                  <h6 className="heading-small text-muted mb-4">
                    Group information
                  </h6>
                  {/* <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Avatar
                          </label>
                          <Input
                            className="form-control-file-input"
                            id="input-username"
                            type="file"
                          />
                        </FormGroup>
                      </Col>
                    </Row> */}
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <Label
                          className="form-control-label"
                          htmlFor="input-username"
                        >
                          Group Name
                        </Label>
                        <Input
                          className="form-control-alternative"
                          required
                          id="input-username"
                          placeholder="Event Name"
                          type="text"
                          innerRef={(node) => groupNameRef = node}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="12">

                    </Col>
                  </Row>
                  <hr className="my-4" />
                  {/* Description */}
                  <FormGroup>
                    <Label
                      className="form-control-label"
                      htmlFor="input-username"
                    >
                      Group Details
                    </Label>
                    <Input
                      className="form-control-alternative"
                      placeholder="A few words about group ..."
                      rows="5"
                      type="textarea"
                      innerRef={(node) => groupDetailsRef = node}
                    />
                  </FormGroup>
                  <FormGroup>
                    {/* <Button color="primary" href="#pablo" type="submit" size="sm"> */}
                    <Button className="mt-4" color="primary" type="submit">
                      Submit
                    </Button>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

//Populate page with data when it is fetched from the server
CreateGroup.getInitialProps = async ({ req, res }) => {
  const data = parseCookies(req)
  if (res) {
    if (Object.keys(data).length === 0 && data.constructor === Object) {
      res.writeHead(301, { Location: "/" })
      res.end()
    }
  }

  return {
    user: data.user,
  }
}

CreateGroup.layout = Admin;

export default CreateGroup;

