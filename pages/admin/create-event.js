import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router'

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
  InputGroup,
  Col,
  Table,
} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import { parseCookies } from "../../lib/cookies";
import CreateEventHeader from "components/Headers/CreateEventHeader.js";
import mapboxgl from '!mapbox-gl';
import '../../assets/css/map.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiaW1pbmFwcG5vdGlmaWNhdGlvbiIsImEiOiJjbDBmdHUwbTYwd2VuM2pvOXdkbHBlZTJmIn0.v2-S7mHBAgezjJ54hvlKaA';
/**
 * Add an event to db
 * 
 * @param {string} curUser Name of the use currently signed in
 * @param {string} eventNameRef Name of the event being created
 * @param {string} startTimeRef Start time of event
 * @param {string} endTimeRef End time of event
 * @param {string} groupRef Group of event
 * @param {string} maxAttendeeRef Max number of attendees
 * @param {string} recurEventRef Is event recurring
 * @param {string} waitlistRef Is waitlist enabled
 * @param {string} eventDetailsRef Details for the event
 * @param {string} lat Lattitude of event
 * @param {string} lng Longitude of event
 * @param {string} guestList List of attendees
 * 
 * @returns 
 */
async function createEvent(curUser, eventNameRef,
  startTimeRef,
  endTimeRef,
  groupRef,
  maxAttendeeRef,
  recurEventRef,
  waitlistRef,
  eventDetailsRef,
  lat, lng, guestList) {
  const _id = 0;
  const response = await fetch('/api/event', {
    method: 'POST',
    body: JSON.stringify({
      user: curUser,
      event: {
        _id, eventNameRef, startTimeRef, endTimeRef, groupRef, maxAttendeeRef,
        recurEventRef, waitlistRef, eventDetailsRef, location: [lat, lng], guestList
      },
      guests: guestList
    }),
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
 * @param {string} emailList List of recipient emails
 * @param {string} eventNameRef Name of the event being created
 * @param {string} startTimeRef Start time of event
 * @param {string} maxAttendeeRef Max number of attendees
 * @param {string} eventDetailsRef Details for the event
 * 
 * @returns 
 */
async function sendEmail(emailList, eventNameRef, startTimeRef, groupRef, eventDetailsRef) {
  var subject = "You are invited to event"
  const response = await fetch('/api/sendEmail', {
    method: 'POST',
    body: JSON.stringify({
      emails: emailList, subject: subject, eventName: eventNameRef,
      startTime: startTimeRef, group: groupRef, eventDetails: eventDetailsRef
    }),
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
 * Fetch the groups of an user
 * 
 * @param {string} user Name of the use currently signed in
 * 
 * @returns 
 */
async function fetchGroups(user) {
  // Sample code to get
  const response = await fetch('/api/allGroups', {
    method: 'GET',
    headers: {
      users: user,
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
  var all_groups = null
  await response.json().then(data => {
    all_groups = data.groups;
  });
  return all_groups;
}

/**
 * Create event interface
 * 
 * @param {*} props User identification, used to tell which user is signed in
 * @returns 
 */
function CreateEvent(props) {
  const route = useRouter();
  if (!props.user) {
    route.push("auth/login")
  }

  // Map func
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(40.9645);
  const [lat, setLat] = useState(-76.8844);
  const [zoom, setZoom] = useState(9);
  const [guests, setGuests] = useState('');
  const [guestList, setGuestList] = useState([]);



  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lat, lng],
      zoom: zoom
    });
    const geocoder = new MapboxGeocoder({
      // Initialize the geocoder
      accessToken: mapboxgl.accessToken, // Set the access token
      mapboxgl: mapboxgl, // Set the mapbox-gl instance
      marker: {
        color: "#b40219"
      }, // Do not use the default marker style
      placeholder: 'Search for places you are looking for...'
    });

    // Add the geocoder to the map
    map.current.addControl(geocoder);
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });
  // Create Reference type to obtain information from the form
  let eventNameRef = null;
  let startTimeRef = null;
  let endTimeRef = null;
  let groupRef = null;
  let maxAttendeeRef = 1;
  let recurEventRef = 1;
  let waitlistRef = 1;
  let eventDetailsRef = null;
  let guest = null;


  /**
   * Called when the user clicks the button to create a event. 
   * Calls the createEvent function
   * 
   * @param {*} event The event created when the form is submitted
   */
  async function submitHandler(event) {
    event.preventDefault();
    await sendEmail(guestList, eventNameRef.value, startTimeRef.value, groupRef.value, eventDetailsRef.value);
    // Modify to create a list of information from the form
    await createEvent(props.user,
      eventNameRef.value,
      startTimeRef.value,
      endTimeRef.value,
      groupRef.value,
      maxAttendeeRef.value,
      recurEventRef.value,
      waitlistRef.value,
      eventDetailsRef.value,
      lat, lng, guestList);
    route.push("dashboard");
  }

  const [details, setDetails] = useState([]);
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    fetchGroups(props.user)
      .then(group => setDetails(group))
  };


  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://api.tiles.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.js"></script>
        <link
          href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css"
          rel="stylesheet"
        />
        <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.min.js"></script>
        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.css"
          type="text/css"
        />
      </head>
      <CreateEventHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Create an Event</h3>
                  </Col>
                  <Col className="text-right" xs="4">

                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={submitHandler}>
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-username"
                        >
                          Event Name
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-username"
                          placeholder="Event Name"
                          type="text"
                          required
                          innerRef={(node) => eventNameRef = node}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-first-name"
                        >
                          Start Time
                        </label>
                        <Input
                          className="form-control-alternative"
                          required
                          id="input-first-name"
                          type="datetime-local"
                          innerRef={(node) => startTimeRef = node}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-first-name"
                        >
                          End Time
                        </label>
                        <Input
                          className="form-control-alternative"
                          required
                          id="input-first-name"
                          type="datetime-local"
                          innerRef={(node) => endTimeRef = node}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Container lg="12">
                        <div ref={mapContainer} className="map-container" />
                    </Container>

                  </Row>
                  <hr className="my-4" />
                  {/* Address */}
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-username"
                        >
                          Add Guest
                        </label>
                        <InputGroup>


                          <Button onClick={(e) => {
                            e.preventDefault();
                            let newList = guestList;
                            if (!guestList.includes(guest.value)) {
                              newList = [...guestList, guest.value];
                            }
                            setGuestList(newList);
                            setGuests('');
                          }}>
                            Add Guest
                          </Button>

                          <Input
                            className="form-control-alternative"
                            id="input-username"
                            placeholder="Email address"
                            type="text"
                            value={guests}
                            onChange={e => setGuests(e.target.value)}
                            innerRef={(node) => guest = node}
                          />

                          <Table>
                            <thead className="thead-light">
                              <tr>
                                <th>Email</th>
                              </tr>
                            </thead>
                            <tbody>
                              {guestList && guestList.map((name, idx) =>
                                <tr key={idx}>
                                  <th key={idx}>
                                    <h5>{name}</h5>
                                  </th>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </InputGroup>

                      </FormGroup>

                    </Col>
                  </Row>

                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-username"
                        >
                          Group
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-username"
                          placeholder="Event Name"
                          type="select"
                          innerRef={(node) => groupRef = node}
                          defaultValue={-1}
                        >
                          <option value={-1}>Select a group</option>
                          {details && details.map((groups, idx) => 
                          <option key={idx} value={groups._id}>
                            {groups.groupNameRef}
                            </option>)}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  {/* <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            Max Attendees
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue="2021-11-23T10:30:00"
                            id="input-first-name"
                            type="number"
                            innerRef={(node) => maxAttendeeRef = node}
                          />
                        </FormGroup>
                      </Col>

                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            Recurring Event
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-first-name"
                            type="checkbos"
                          /> 
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <Input
                            className="custom-toggle"
                            id="input-first-name"
                            type="checkbox"
                            innerRef={(node) => recurEventRef = node}
                          />
                          <span
                            className=" custom-toggle-slider rounded-circle"
                            data-label-off="No"
                            data-label-on="Yes"
                          ></span> 
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            Waitlist
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-first-name"
                            type="checkbos"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <Input
                            className="custom-toggle"
                            id="input-first-name"
                            type="checkbox"
                            innerRef={(node) => waitlistRef = node}
                          />
                          <span
                            className=" custom-toggle-slider rounded-circle"
                            data-label-off="No"
                            data-label-on="Yes"
                          ></span>
                        </FormGroup>
                      </Col>
                    </Row> */}
                  <hr className="my-4" />
                  {/* Description */}
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-username"
                    >
                      Event Details
                    </label>
                    <Input
                      className="form-control-alternative"
                      placeholder="A few words about this event..."
                      rows="5"
                      type="textarea"
                      innerRef={(node) => eventDetailsRef = node}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Button className="mt-4" color="primary" type="submit">
                      Create Event
                    </Button>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

CreateEvent.getInitialProps = async ({ req, res }) => {
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

CreateEvent.layout = Admin;

export default CreateEvent;
