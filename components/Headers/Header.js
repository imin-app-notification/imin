import React from "react";

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import NextEvent from "../NextEvent/NextEvent";
function Header(props) {
  return (
    <>
      <div className="header bg-gradient-dark pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col className="mb-5 mb-xl-0" xl="7">
                {/* <NextEvent user={props.user}/> */}
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Header;
