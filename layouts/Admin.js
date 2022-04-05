import React, {useState, useEffect} from "react";
import { useRouter } from "next/router";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import { parseCookies } from "../lib/cookies";
import routes from "routes.js";

async function fetchProfile(email) {
  // Sample code to get
  const response = await fetch('/api/userProfile', {
    method: 'GET',
    headers: {
      'Accept' : 'application/json, text/plain, */*',
      'Content-Type' : 'application/json;charset=UTF-8',
      email: email
    },
  });
  var user_data = null
  await response.json().then(data => {
    user_data = data.user;
  });
  
  return user_data;
}

function Admin(props) {
  // fetch the profile
  const [profile, setProfile] = useState([]);
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    fetchProfile(props.children.props.user)
    .then(profile => setProfile(profile))
      };
  
  // used for checking current route
  const router = useRouter();
  let mainContentRef = React.createRef();
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
  }, []);
  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (router.route.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/admin/dashboard",
          imgSrc: require("assets/img/im-in.jpg"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContentRef}>
        <AdminNavbar 
          {...props} 
          first_name={profile.first_name}
          last_name={profile.last_name} 
          brandText={getBrandText()} 
        />
        {props.children}
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
}

Admin.getInitialProps = async ({ req, res }) => {
  const data = parseCookies(req)
  console.log(data.user);
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

export default Admin;
