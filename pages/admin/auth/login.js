import { React, useState, useRef, useEffect } from 'react';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
// layout for this page
import Auth from "layouts/Auth.js"
import { useCookies } from "react-cookie"

/**
 * Send request to create a user
 *
 * @param {string}   email           Email addr.
 * @param {string}   name            Name.
 * @param {string}   password        Password.
 *
 * @return {object} Whether success.
 */
async function createUser(name, email, password) {
  // Send req
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  // Parse res
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }
  return data;
}

/**
 * Login and signup page conponent
 *
 * @param {object}   props    user indentification
 * 
 * @returns {object} view of the page
 */
function Login() {
  // To save info
  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  var passwordLength = 0;
  // To provide a instant validation
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState('');
  const [safty, setSafty] = useState('weak');
  const [saftyColor, setSaftyColor] = useState("text-danger font-weight-700");
  const [emailAddr, setEmailAddr] = useState('');
  const [emailValid, setEmailValid] = useState('invalid');
  const [emailValidColor, setEmailValidColor] = useState("text-danger font-weight-700");
  const router = useRouter();

  const [cookie, setCookie] = useCookies(["user"])
  // Use to switch between login page and signup page
  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }
  // Display the validness
  useEffect(() => {
    if (password.length > 5) {
      setSafty('strong')
      setSaftyColor("text-success font-weight-700")
    } else {
      setSafty('weak')
      setSaftyColor("text-danger font-weight-700")
    }
  })
  // Display the validness
  useEffect(() => {
    if (emailAddr.includes('@')) {
      setEmailValid('valid')
      setEmailValidColor("text-success font-weight-700")
    } else {
      setEmailValid('invalid')
      setEmailValidColor("text-danger font-weight-700")
    }
  })
  // Handle the submission of register info
  async function submitHandler(e) {
    e.preventDefault();
    var enteredName = null
    if (nameInputRef.current) {
      enteredName = nameInputRef.current.value;
    }
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    
    if (isLogin) {
      // Signin props
      const result = await signIn('credentials', {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });
      // Save cookies locally
      if (!result.error) {
        // set some auth state
        setCookie("user", JSON.stringify(enteredEmail), {
          path: "/",
          maxAge: 3600, // Expires after: 3600 = 1hr
          sameSite: true,
          overwrite: true,
        })
        router.replace('/admin/dashboard');
      }
    } else {
      // Create a new user in signup page
      try {
        await createUser(enteredName, enteredEmail, enteredPassword);
        switchAuthModeHandler();
      } catch (error) {
        console.log(error);
      }
    }
  }
  if (isLogin) {
    // Login page
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-5">
              <div className="text-muted text-center mt-2 mb-3">
                <small>Sign in with</small>
              </div>
              <div className="btn-wrapper text-center">
                <Button
                  className="btn-neutral btn-icon"
                  color="default"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("assets/img/icons/common/github.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Github</span>
                </Button>
                <Button
                  className="btn-neutral btn-icon"
                  color="default"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("assets/img/icons/common/google.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Google</span>
                </Button>
              </div>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>Or sign in with credentials</small>
              </div>
              <form role="form" onSubmit={submitHandler}>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
                      id='email'
                      required
                      innerRef={emailInputRef}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      autoComplete="new-password"
                      required
                      innerRef={passwordInputRef}
                    />
                  </InputGroup>
                </FormGroup>
                <div className="custom-control custom-control-alternative custom-checkbox">
                  <input
                    className="custom-control-input"
                    id=" customCheckLogin"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor=" customCheckLogin"
                  >
                    <span className="text-muted">Remember me</span>
                  </label>
                </div>
                <div className="text-center">
                  <Button className="my-4" color="primary" type="submit" onClick={submitHandler}>
                    Sign in
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <small>Forgot password?</small>
              </a>
            </Col>
            <Col className="text-right" xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={switchAuthModeHandler}
              >
                <small>Create new account</small>
              </a>
            </Col>
          </Row>
        </Col>
      </>
    );
  } else {
    // Signup Page
    return (
      <>
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-5">
              <div className="text-muted text-center mt-2 mb-4">
                <small>Sign up with</small>
              </div>
              <div className="text-center">
                <Button
                  className="btn-neutral btn-icon mr-4"
                  color="default"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("assets/img/icons/common/github.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Github</span>
                </Button>
                <Button
                  className="btn-neutral btn-icon"
                  color="default"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("assets/img/icons/common/google.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Google</span>
                </Button>
              </div>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>Or sign up with credentials</small>
              </div>
              <Form role="form" onSubmit={submitHandler}>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-hat-3" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Name" type="name" id="name" required innerRef={nameInputRef} />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
                      id="email"
                      invalid
                      required
                      onChange={e => setEmailAddr(e.target.value)}
                      innerRef={emailInputRef}
                    />
                  </InputGroup>
                  <div className="text-muted font-italic">
                    <small>
                      Email address is:{" "}
                      <span className={emailValidColor}>{emailValid}</span>
                    </small>
                  </div>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      required
                      onChange={e => setPassword(e.target.value)}
                      innerRef={passwordInputRef}
                    />
                  </InputGroup>
                  <div className="text-muted font-italic">
                    <small>
                      password strength:{" "}
                      <span className={saftyColor}>{safty}</span>
                    </small>
                  </div>
                </FormGroup>
                <Row className="my-4">
                  <Col xs="12">
                    <div className="custom-control custom-control-alternative custom-checkbox">
                      <Input
                        className="custom-control-input"
                        id="customCheckRegister"
                        type="checkbox"
                        required
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="customCheckRegister"
                      >
                        <span className="text-muted">
                          I agree with the{" "}
                          <a href="#pablo" onClick={(e) => e.preventDefault()}>
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                    </div>
                  </Col>
                </Row>
                <div className="text-center">
                  <Button className="mt-4" color="primary" type="submit">
                    Create account
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </>
    );
  }
}

Login.layout = Auth;
export default Login;
