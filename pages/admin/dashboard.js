import { React, useState, useEffect } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts

import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import {
  chartOptions,
  parseOptions,
} from "variables/charts.js";
import EventCalendar from "../../components/Calendar/EventCalendar";
import NextEvent from "../../components/NextEvent/NextEvent";
import YourInvites from "../../components/YourInvites/YourInvites";
import Header from "components/Headers/Header.js";
import UpcomingEvent from "../../components/Events/UpcomingEvent";
import { parseCookies } from "../../lib/cookies";
import { useRouter } from "next/router";

let user = null;
/**
 * Dashboard interface
 * 
 * @param {*} props User identification, used to tell which user is signed in
 * @returns 
 */
const Dashboard = (props) => {
  //Check if the user is logged in, if not push them to login page
  if (!props.user) {
    const route = useRouter();
    route.push("auth/login")
  } else {
    user = props.user;
  }

  // const [user, setUserVal] = useState(props.user);
  const [activeNav, setActiveNav] = useState([]);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }
  // useEffect(() => {
  //   setUserVal(props.user);
  // }, [props]);

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };
  return (
    <>
    <Header user={user} />
    <Container className="mt--7" fluid>
  <Row>
  <Col className="mb-5 mb-xl-0" xl="7">
      <NextEvent user={user}/>
    </Col>
    <Col className="mb-3 mb-xl-0" xl="5">
      <Card className="shadow">
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <div className="col">
              <h3 className="mb-0">Upcoming Event</h3>
            </div>
          </Row>
        </CardHeader>
        {/*Insert upcoming event component */}
        <UpcomingEvent user={user} />
      </Card>
    </Col>


  </Row>
  <Row className="mt-5">
  <Col className="mb-5 mb-xl-0" xl="7">
  <Card className="shadow">
    <CardHeader className="bg-transparent">
      <Row className="align-items-center">
        <div className="col">
          <h3 className="mb-0">Calendar</h3>
        </div>
      </Row>
    </CardHeader>
    <CardBody>
      {/*Insert event calendar component*/}
      <EventCalendar user={user} />
    </CardBody>
  </Card>
</Col>
<Col xl="5">
  <Card className="shadow">
    <CardHeader className="border-0">
      <Row className="align-items-center">
        <div className="col">
          <h3 className="mb-0">Your Invites</h3>
        </div>
        <div className="col text-right">
          {/* <Button
            color="primary"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
            size="sm"
          >
            See all
          </Button> */}
        </div>
      </Row>
    </CardHeader>
    {/*Insert your invites component */}
    <YourInvites user={user} />
  </Card>
</Col>
</Row>
</Container>
    </>
  );
};

//Populate page with data when it is fetched from the server
Dashboard.getInitialProps = async ({ req, res }) => {
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

// export async function getStaticProps(context) {
//   console.log(context.req)
//   // const data = parseCookies(context)
//   // if (res) {
//   //   if (Object.keys(data).length === 0 && data.constructor === Object) {
//   //     res.writeHead(301, { Location: "/" })
//   //     res.end()
//   //   }
//   // }
//   return {
//     props: {
//       // user: data.user,
//       user: "abc@123.com"
//     }, // will be passed to the page component as props
//   }
// }

// export async function getServerSideProps(context) {
//   // Database logic here
//   const data = parseCookies(context.req)
//   // if (context.res) {
//   //   if (Object.keys(data).length !== 0 && data.constructor === Object) {
      
//   //     context.res.writeHead(301, { Location: "/" })
//   //     context.res.end()
//   //   }
//   // }
//   return { props: {
//     user: data.user,
//   } }
// }

Dashboard.layout = Admin;

export default Dashboard;

{/* Page content */}
