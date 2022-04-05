import React from "react";

// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";

function GroupDetailsHeader() {
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
              <h1 className="display-2 text-white">Group</h1>
              <p className="text-white mt-0 mb-5s">
              This is the group detail page. You can check detail information about your group
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default GroupDetailsHeader;
