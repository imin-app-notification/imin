import React from "react";
import Link from "next/link";
// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

function AdminNavbar() {
  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="lg">
        <Container className="px-4">
            <span>
              <NavbarBrand>
                <img
                  alt="..."
                  src={require("assets/img/im-in.png")}
                  width="25%"
                  height={"25%"}
                />
              </NavbarBrand>
            </span>
        </Container>
      </Navbar>
    </>
  );
}

export default AdminNavbar;
