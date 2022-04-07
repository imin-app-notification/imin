import { React, useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Image from 'next/image'
import profilePic from '../../../assets/img/sample.jpg'
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
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
import { parseCookies } from "../../../lib/cookies";

// core components
import GroupDetails from "../../../components/Groups/GroupDetails";
import GroupDetailsHeader from "../../../components/Headers/GroupDetailsHeader";

/**
 * Finds a group by ID through a GET api call to the database
 * @param {*} id ID of the group to find
 * @returns The group corresponding to the input ID
 */
async function fetchGroup(id) {
  const response = await fetch('/api/group', {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=UTF-8',
      ids: JSON.stringify([id])
    },
  });
  var all_groups = null
  await response.json().then(data => {
    all_groups = data.groups;
    //console.log(data)
  });
  return all_groups;
}

/**
 * Updates the guest list of a given group. Allows for adding guests to a group
 * @param {*} id ID of the group to find
 * @param {*} guestList A list of guest emails to add to the group
 */
async function updateGroup(id, guestList) {
  const response = await fetch('/api/updateGroup', {
    method: 'POST',
    body: JSON.stringify({ id: id, guestList: guestList }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }

  return data;
}

/**
 * Sends email to everyone on the email list notifying them they've been added to a group
 * @param {*} emailList List of recipient emails
 * @returns 
 */
async function sendEmail(emailList) {
  var subject = "You are invited to group"
  console.log(emailList)
  const response = await fetch('/api/sendEmail', {
    method: 'POST',
    body: JSON.stringify({ emails: emailList, subject }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }
  return data;
}

/**
 * Generic page for a group, details are filled in by fetching group info from the database
 */
function SampleGroupDetails() {
  const router = useRouter()
  //Get the id of the group we are displaying
  const { id } = router.query

  const [guests, setGuests] = useState('');
  const [guestList, setGuestList] = useState([]);
  let guest = '';

  const [details, setDetails] = useState([]);
  useEffect(() => {
    fetchProducts();
  }, []);
  //Find the details for the group being displayed
  const fetchProducts = async () => {
    fetchGroup(id)
      .then(group => setDetails(group[0]))
  };

  /**
   * Function for handling what happens after user submits the form to add guests to the group
   * @param {obj} event Event created when user submits the form to add guests
   */
  async function submitHandler(event) {
    event.preventDefault();
    await updateGroup(id, guests);
    //await sendEmail([guests]);
    setGuests('');
    router.push({
      pathname: '/admin/groupDetails/[id]',
      query: { id: id },
    })
  }

  return (
    <>
      {/* Page content */}
      <GroupDetailsHeader />
      <Container className="mt--7" fluid>
        {GroupDetails(details)}
        <p> </p>
        <Card>
          <CardHeader>
            <h2>Add New Attendees</h2>
          </CardHeader>
          <CardBody>
            <Form onSubmit={submitHandler}>
              <FormGroup>
                <div>

                  <Input
                    className="form-control-alternative"
                    id="input-username"
                    placeholder="Email address"
                    type="text"
                    value={guests}
                    onChange={e => setGuests(e.target.value)}
                    innerRef={(node) => guest = node}
                  />
                </div>

                <Button className="mt-4" color="primary" type="submit">Update Guest List</Button>
              </FormGroup>
            </Form>
            <div>
              {guestList}
            </div>
          </CardBody>
        </Card>
        <p> </p>

        <Card>
          <CardHeader>
            <h2>Members</h2>
          </CardHeader>
          <CardBody>
            <ListGroup>
              {details.guestList?.map((name, idx) =>
                <ListGroupItem key={idx}>
                  <ListGroupItemHeading>
                  </ListGroupItemHeading>
                  <ListGroupItemText>
                    {name}
                  </ListGroupItemText>
                </ListGroupItem>
              )}
            </ListGroup>
          </CardBody>

        </Card>
      </Container>
    </>);
}

//Populate page with data when it is fetched from the server
SampleGroupDetails.getInitialProps = async ({ req, res }) => {
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

SampleGroupDetails.layout = Admin;

export default SampleGroupDetails;
