import React, { useRef, useEffect, useState } from "react";
import Image from 'next/image'
import { useRouter } from 'next/router'
import profilePic from '../../../assets/img/sample.jpg'
// reactstrap components
import {
  Container,
  Row,
  Card,
  Col,
  CardHeader,
  CardBody,
  FormGroup,
  InputGroup,
  Button,
  Input,
  Form,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import EventDetails from "../../../components/Events/EventDetails";
import EventDetailsHeader from "../../../components/Events/EventDetailsHeader";
import mapboxgl from '!mapbox-gl';
import '../../../assets/css/map.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
mapboxgl.accessToken = 'pk.eyJ1IjoiaW1pbmFwcG5vdGlmaWNhdGlvbiIsImEiOiJjbDBmdHUwbTYwd2VuM2pvOXdkbHBlZTJmIn0.v2-S7mHBAgezjJ54hvlKaA';
import 'mapbox-gl/dist/mapbox-gl.css'

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
  var all_events = null
  await response.json().then(data => {
    all_events = data.events;
  });

  return all_events;
}

async function sendEmail(emailList) {
  var subject = "You are invited to event"
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

function SampleEventDetails() {
  const router = useRouter()
  const { id } = router.query

  const [details, setDetails] = useState([]);

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
        setDetails(EventDetails(event[0]));
        setLat(event[0].location[0]);
        setLng(event[0].location[1]);
      })
  };
  
  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (lat == null || lng == null) return;
    console.log([lat, lng])
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

  async function submitHandler(event) {
    event.preventDefault();
    await sendEmail([guests]);
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
            <ListGroupItem active>
              <ListGroupItemHeading>
                <Image
                  src={profilePic}
                  width={50}
                  height={50}
                />
              </ListGroupItemHeading>
              <ListGroupItemText>
                Member One
              </ListGroupItemText>
            </ListGroupItem>
            <ListGroupItem>
              <ListGroupItemHeading>
              <Image
                  src={profilePic}
                  width={50}
                  height={50}
                />
              </ListGroupItemHeading>
              <ListGroupItemText>
              Member Two
              </ListGroupItemText>
            </ListGroupItem>
            <ListGroupItem>
              <ListGroupItemHeading>
              <Image
                  src={profilePic}
                  width={50}
                  height={50}
                />
              </ListGroupItemHeading>
              <ListGroupItemText>
              Member Three
              </ListGroupItemText>
            </ListGroupItem>
          </ListGroup>
        </CardBody>

      </Card>
      </Container>
    </>);
}

SampleEventDetails.layout = Admin;

export default SampleEventDetails;
