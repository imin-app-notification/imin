import React, { useState, useEffect } from "react";

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
  Row,
  Col,
} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
import { parseCookies } from "../../lib/cookies";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import { useRouter } from "next/router";

/**
 * Send request to update current user info
 *
 * @param {string}   email           Email addr.
 * @param {string}   first_name      First name.
 * @param {string}   last_name       Last name.
 * @param {string}   user_name       User name.
 * @param {string}   details         Account description.
 *
 * @return {type} Return value description.
 */
async function updateProfile(email, first_name, last_name, user_name, details) {
  // Send req
  const response = await fetch('/api/userProfile', {
    method: 'POST',
    body: JSON.stringify({ email, first_name, last_name, user_name, details }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Check success
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }
  return data;
}

/**
 * Send request to fetch current user info
 *
 * @param {string}   email           Email addr.
 *
 * @return {type} Return value description.
 */
async function fetchProfile(email) {
  // Sample code to get user info
  const response = await fetch('/api/userProfile', {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=UTF-8',
      email: email
    },
  });
  // Get user data from response
  var user_data = null
  await response.json().then(data => {
    user_data = data.user;
  });
  return user_data;
}

/**
 * Profile page conponent
 *
 * @param {object}   props    user indentification
 */
function Profile(props) {
  const router = useRouter();
  // Store the profile
  const [profile, setProfile] = useState([]);
  // Fetch the profile
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    fetchProfile(props.user)
      .then(profile => setProfile(profile))
  };
  // change the profile
  let email = '';
  let first_name = '';
  let last_name = '';
  let user_name = '';
  let details = '';

  // Handle the submission of the form
  async function submitHandler(event) {
    event.preventDefault();
    // Modify to create a list of information from the form
    await updateProfile(email.value,
      first_name.value,
      last_name.value,
      user_name.value,
      details.value);
    // reload to update profile
    router.reload(window.location.pathname);
  }

  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={require("assets/img/user.png")}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row className="align-items-center">
                  <div className="text-center">
                    <hr />
                  </div>
                </Row>
                <div className="text-center">
                  <h1>
                    {profile.first_name} {profile.last_name}
                  </h1>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Form className="bg-secondary shadow" onSubmit={submitHandler}>

              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="primary"
                      type="submit"
                      size="sm"
                    >
                      Save Profile
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Username
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={profile.user_name}
                            id="input-username"
                            placeholder={profile.user_name}
                            type="text"
                            disabled
                            innerRef={(name) => user_name = name}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder={profile.email}
                            value={profile.email}
                            type="email"
                            disabled
                            innerRef={(in_email) => email = in_email}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            First name
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={profile.first_name}
                            id="input-first-name"
                            placeholder={profile.first_name}
                            type="text"
                            innerRef={(name) => first_name = name}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Last name
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={profile.last_name}
                            id="input-last-name"
                            placeholder={profile.last_name}
                            type="text"
                            innerRef={(name) => last_name = name}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Description */}
                  <h6 className="heading-small text-muted mb-4">About me</h6>
                  <div className="pl-lg-4">
                    <FormGroup>
                      <label>About Me</label>
                      <Input
                        className="form-control-alternative"
                        placeholder={profile.details}
                        rows="4"
                        defaultValue={profile.details}
                        type="textarea"
                        innerRef={(about_me) => details = about_me}
                      />
                    </FormGroup>
                  </div>
              </CardBody>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
/**
 * Parse the cookie to get the user info
 *
 * @return {object} Return user email
 */
Profile.getInitialProps = async ({ req, res }) => {
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


Profile.layout = Admin;

export default Profile;
