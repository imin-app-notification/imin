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
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from 'reactstrap';

/**
 * Component for displaying a group as a card with the name and details
 * @param {*} group Group to be displayed
 * @returns 
 */
function GroupDetails(group) {

  return (
    <>
      <Card>
        <CardHeader>
          <h2>{group.groupNameRef}</h2>
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
            <Col lg="9">
              <h2>{group.groupDetailsRef}</h2>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
}

export default GroupDetails;
