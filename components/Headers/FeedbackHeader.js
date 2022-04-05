import React from "react";

// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";

function FeedbackHeader() {
  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: "600px",
          backgroundImage:
            "url(" + require("assets/img/theme/profile-cover.jpg") + ")",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8" />
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1 className="display-2 text-white">Feedback</h1>
              <p className="text-white mt-0 mb-5">
                Thank you for using I'm In. We are currently in beta version.
                We are looking to improve this product.  So any sugguestions, or 
                feedback you can offer will be greatly appreciated
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default FeedbackHeader;
