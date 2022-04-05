import React from "react";

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
// core components
import FeedbackHeader from "components/Headers/FeedbackHeader.js";

/**
 * Feedback page component
 * 
 */
function Feedback() {
  return (
    <>
      <FeedbackHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Feedback</h3>
                  </Col>
                  <Col className="text-right" xs="4">

                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {/*Form for collecting user feedback*/}
                <Form>
                  <div className="pl-lg-4">
                    <FormGroup>
                      <label>Feedback</label>
                      <Input
                        className="form-control-alternative"
                        placeholder="A few words from you ..."
                        rows="5"
                        type="textarea"
                      />
                    </FormGroup>
                  </div>
                  <div className="pl-lg-4">
                    <FormGroup>
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      Submit
                    </Button>
                    </FormGroup>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

Feedback.layout = Admin;

export default Feedback;
