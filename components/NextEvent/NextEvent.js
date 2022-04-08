import { React, useState, useEffect, useRef } from 'react';
import Moment from 'moment';
// reactstrap components
import {
    Button,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
} from "reactstrap";

import { useRouter } from 'next/router';
import mapboxgl from '!mapbox-gl';
import '../../assets/css/map.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
mapboxgl.accessToken = 'pk.eyJ1IjoiaW1pbmFwcG5vdGlmaWNhdGlvbiIsImEiOiJjbDBmdHUwbTYwd2VuM2pvOXdkbHBlZTJmIn0.v2-S7mHBAgezjJ54hvlKaA';
import 'mapbox-gl/dist/mapbox-gl.css'

/**
 * Send request to API to fetch the next upcoming event
 *
 * @param {string}   user       user email address used for fetch event list
 *
 * @return {object} Event details
 */
async function fetchEvent(user) {
    // Call the api
    const response = await fetch('/api/nextEvent', {
        method: 'POST',
        body: JSON.stringify({
            user: user,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    // Get details from response
    var events = null
    await response.json().then(data => {
        events = data.events;
    });
    return events;
}

/**
 * Display the next upcoming event
 *
 * @param {string}   user       user email address used for fetch event list
 *
 * @return {object} HTML for display the component
 */
function NextEvent(user) {
    const router = useRouter();
    // Use to store event detail
    const [details, setDetails] = useState([]);
    // Create an map
    const mapContainer = useRef(null);
    const map = useRef(null);
    // Map attr
    const [lng, setLng] = useState(null);
    const [lat, setLat] = useState(null);
    const [zoom, setZoom] = useState(9);
    // Fetch the event
    useEffect(() => {
        fetchProducts();
    }, []);
    // Fetch and set the event details and map attr
    const fetchProducts = async () => {
        fetchEvent(user)
            .then(event => {
                setDetails(event);
                setLat(event[0].location[0]);
                setLng(event[0].location[1]);
            })
    };
    // Interactive map
    useEffect(() => {
        if (map.current) return; // initialize map only once
        if (lat == null || lng == null) return;
        // Set default location of map
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
        // Mark default location
        var marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map.current);

    });

    return (
        <>
            {details.map((event,idx) =>
                <Card  key={idx} className="card-stats mb-4 mb-xl-0">
                    <CardHeader>
                        <Row>
                            <Col className="mb-5 mb-xl-0" xl="7">
                                <div className="col">
                                    <CardTitle
                                        tag="h5"
                                        className="text-uppercase text-muted mb-0"
                                    >
                                        Next Event
                                    </CardTitle>
                                    <span className="h2 font-weight-bold mb-0">
                                        {event.eventNameRef}
                                    </span>
                                    <p className="mt-3 mb-0 text-muted text-sm">
                                        <span className="text-nowrap mr-3">{Moment(event.startTimeRef).format('lll')}</span>
                                    </p>
                                </div>
                            </Col>
                            <Col className="col-auto">
                                {
                                    event._id == -1 ? (
                                        <Button
                                            color="primary"
                                            href="#pablo"
                                            onClick={() => {
                                                router.push({
                                                    pathname: '/admin/create-event'
                                                })
                                            }}
                                            size="sm"
                                        >
                                            Create An Event
                                        </Button>
                                    ) : (
                                        <Button
                                            color="primary"
                                            href="#pablo"
                                            onClick={() => {
                                                router.push({
                                                    pathname: '/admin/eventDetails/[id]',
                                                    query: { id: event._id },
                                                })
                                            }}
                                            size="sm"
                                        >
                                            Details
                                        </Button>
                                    )}

                            </Col>
                        </Row>

                    </CardHeader>
                    <CardBody>
                        <Col>
                            <Row>
                                <div className="col">
                                    <CardTitle
                                        tag="h5"
                                        className="text-uppercase text-muted mb-0"
                                    >
                                        Event Description
                                    </CardTitle>
                                    <p></p>
                                    <span className="p font-weight-bold mb-0">
                                        {event.eventDetailsRef}
                                    </span>
                                </div>
                            </Row>
                            <p></p>
                            <Row>
                                <div className="col">
                                    <CardTitle
                                        tag="h5"
                                        className="text-uppercase text-muted mb-0"
                                    >
                                        Location
                                    </CardTitle>
                                    <p></p>
                                    {/* <span className="p font-weight-bold mb-0">
                                        {event.eventDetailsRef}
                                    </span> */}
                                    <div ref={mapContainer} className="map-container" />
                                </div>
                            </Row>
                        </Col>
                    </CardBody>
                </Card>)}
        </>
    );
}

export default NextEvent;
