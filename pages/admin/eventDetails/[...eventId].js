import React, { useRef, useEffect, useState } from "react";
import { useRouter } from 'next/router'
// reactstrap components
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Button,
  Input,
  Form,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import EventDetails from "../../../components/Events/EventDetails";
import EventDetailsHeader from "../../../components/Events/EventDetailsHeader";
import mapboxgl from '!mapbox-gl';
import '../../../assets/css/map.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
mapboxgl.accessToken = 'pk.eyJ1IjoiaW1pbmFwcG5vdGlmaWNhdGlvbiIsImEiOiJjbDBmdHUwbTYwd2VuM2pvOXdkbHBlZTJmIn0.v2-S7mHBAgezjJ54hvlKaA';
import 'mapbox-gl/dist/mapbox-gl.css'

/**
 * Finds a event by ID through a GET api call to the database
 * @param {*} id ID of the event to find
 * @returns The event corresponding to the input ID
 */
async function fetchEvent(id) {
  // Sample code to get
  const response = await fetch('/api/event', {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=UTF-8',
      ids: JSON.stringify([id])
    },
  });
  var all_events = null;
  await response.json().then(data => {
    all_events = data.events;
  });

  return all_events;
}

/**
 * Finds a group by ID through a GET api call to the database
 * @param {*} id ID of the group to find
 * @returns The group corresponding to the input ID
 */
 async function fetchGroup(id, event) {
  const response = await fetch('/api/group', {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=UTF-8',
      ids: JSON.stringify([id])
    },
  });
  var info = {event: null, group: null};
  info.event = event;
  await response.json().then(data => {
    info.group = data.groups[0];
    //console.log(data)
  });
  return info;
}


/**
 * Updates the guest list of a given event. Allows for adding guests to a group
 * @param {*} id ID of the event to find
 * @param {*} guestList A list of guest emails to add to the group
 */
async function updateEvent(id, guestList) {
  const response = await fetch('/api/updateEvent', {
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
  var subject = "You are invited to event"
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
 * Generic page for a event, details are filled in by fetching group info from the database
 */
function SampleEventDetails() {
  const router = useRouter()
  const { id } = router.query

  const [details, setDetails] = useState([]);
  const [group, setGroup] = useState([]);
  const [guests, setGuests] = useState('');
  const [guestList, setGuestList] = useState([]);
  let guest = '';
  // Display map
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(null);
  const [lat, setLat] = useState(null);
  const [zoom, setZoom] = useState(9);
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    fetchEvent(id)
      .then(event => {
        if (event[0].groupRef == -1) {
          event[0].groupRef = "No Group";
          setDetails(EventDetails(event[0]));
        } else {
          fetchGroup(event[0].groupRef, event[0])
          .then(info => {
            info.event.groupRef = info.group.groupNameRef;
            setDetails(EventDetails(info.event));
          });
        }
        setGuestList(event[0].guestList)
        setLat(event[0].location[0]);
        setLng(event[0].location[1]);
      })
  };
  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (lat == null || lng == null) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
    var marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(map.current);
  });

  /**
   * Function for handling what happens after user submits the form to add guests to the group
   * @param {obj} event Event created when user submits the form to add guests
   */
  async function submitHandler(event) {
    event.preventDefault();
    await sendEmail([guests]);
    await updateEvent(id, guests);
    setGuests('');
  }



  return (
    <>
      {/* Page content */}
      <head>
        <meta charSet="utf-8" />
        <title>Demo: Local search with the Geocoding API</title>
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
      <EventDetailsHeader />
      <Container className="mt--7" fluid>
        {details} 
        <p> </p>
        <Card className="shadow border-0">
          <CardHeader>
            <h2>Location</h2>
          </CardHeader>
          <CardBody>
            <div ref={mapContainer} className="map-container" />
          </CardBody>
        </Card>
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
                    placeholder="  Email address"
                    type="text"
                    value={guests}
                    onChange={e => setGuests(e.target.value)}
                  />
                </div>
                <Button className="mt-4" color="primary" type="submit">
                  {/* onClick={(e) => {
                    e.preventDefault();
                    
                    setGuests('');
                  }} */}
                  Add Guest
                </Button>
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
        <p> </p>
        <Card>
          <CardHeader>
            <h2>Attendees</h2>
          </CardHeader>
          <CardBody>
            <ListGroup>
              {guestList?.map((name, idx) =>
                <ListGroupItem key={idx}>
                    {name}
                </ListGroupItem>
              )}
            </ListGroup>
          </CardBody>

        </Card>
      </Container>
    </>);
}

SampleEventDetails.layout = Admin;

export default SampleEventDetails;
