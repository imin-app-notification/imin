import React, { useState, useEffect } from "react";
// react component that copies the given text inside your clipboard
import { CopyToClipboard } from "react-copy-to-clipboard";
// reactstrap components
import {
    Container,
    Row,
} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import GroupDetails from "../../components/Groups/GroupDetails";
import GroupDetailsHeader from "../../components/Headers/GroupDetailsHeader";
import GroupTable from "../../components/Groups/GroupTable";
import { useRouter } from "next/router";
import { parseCookies } from "../../lib/cookies";


const Groups = (props) => {
    //Check if user is logged in
    if (!props.user) {
        const route = useRouter();
        route.push("auth/login")
      }
    //Return a container with a table displaying the groups
    return (
        <>
            <GroupDetailsHeader />
            <Container className="mt--7" fluid>
                <Row>
                    <GroupTable user={props.user}/>
                </Row>
            </Container>
        </>
    );
};

//Populate page with data when it is fetched from the server
Groups.getInitialProps = async ({ req, res }) => {
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

Groups.layout = Admin;

export default Groups;
