// import { hashPassword } from '../../lib/auth';
// import { connectToDatabase } from '../../lib/db';
// import { resolve } from 'path/posix';

import Image from 'next/image'
import profilePic from '../../assets/img/sample.jpg'
import {
  Row,
  Col,
  CardBody,
  Card,
  CardHeader,
} from 'reactstrap';


function EventDetails(event) {
  // eventNameRef
  // startTimeRef
  // endTimeRef
  // groupRef
  // maxAttendeeRef
  // recurEventRef
  // waitlistRef
  // eventDetailsRef
  return (
    <>
      <Card>
        <CardHeader>
          <h2>{event.eventNameRef}</h2>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg="3">
              <Image
                src={profilePic}
                width={250}
                height={250}
              />
            </Col>

            <Col lg="5">
              <h3>Start Time: {event.startTimeRef}</h3>
              <h3>End Time: {event.endTimeRef}</h3>
              <h3>Group: {event.groupRef}</h3>
              <h3>Max Attendee: {event.maxAttendeeRef}</h3>
              <h3>Recurring: {event.recurEventRef}</h3>
              <h3>Waitlist: {event.waitlistRef}</h3>
              <h3>Details:</h3>
              <p> {event.eventDetailsRef}</p>
            </Col>
          </Row>
        </CardBody>
      </Card>

    </>
  );
}

export default EventDetails;
