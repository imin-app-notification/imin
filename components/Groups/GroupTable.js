import { React, useState, useEffect } from 'react';
import Moment from 'moment';
import { useRouter } from 'next/router';
import {
  Card,
  CardBody,
  CardGroup,
  CardImg,
  CardText,
  Button,
  Container,
  CardTitle,
  Row,
  Col,
  CardHeader,
} from "reactstrap";

/**
 * Fetches all groups for a given user
 * @param {*} user The user who is currently logged in
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
  var all_groups = null;
  await response.json().then(data => {
    all_groups = data.groups;
  });
  if (all_groups == null) {
    return [];
  }
  return all_groups;
}

/**
 * Creates a table of groups by mapping all groups a user is a member of to card instances
 * @param {*} props Used for authentication
 * @returns 
 */
function GroupTable(props) {
  const router = useRouter();
  const [details, setDetails] = useState([]);
  useEffect(() => {
    fetchProducts();
  }, []);
  //Fetch all groups a user is a member of
  const fetchProducts = async () => {
    fetchGroups(props.user)
      .then(group => setDetails(group))
  };
  return (
    <div>
      <CardGroup>
        <Container className="mt-3 mb-2 text-sm">
          <Row className="mb-3 mb-xl-0" xl="5">
            {/*Map each group to a card and display its information */}
            {details.map((group, idx) =>
              <Col key={idx} className="mb-3 mb-xl-0" xl="auto">
                <Card>
                  <CardImg
                    alt="Card image cap"
                    src="https://i.picsum.photos/id/69/318/180.jpg?hmac=Ybir1XDawHzGLE7NDk2QRwqjQ9mWWNapWNhQjuu03Ys"
                    top
                    width="100%"
                  />
                  <CardHeader>
                    <h2 className="mb-0">{group.groupNameRef}</h2>
                  </CardHeader>
                  <CardBody>
                      <CardText >
                        {group.groupDetailsRef}
                      </CardText>
                      <Button
                        size="sm"
                        color="primary"
                        onClick={() => {
                          router.push({
                            pathname: '/admin/groupDetails/[id]',
                            query: { id: group._id },
                          })
                        }}
                      >
                        View Details
                      </Button>
{/* 
                    <CardFooter className="text-muted">
                      <Label><h3 className="mb-0">Upcoming Event</h3></Label>

                      <ListGroup>
                        <ListGroupItem
                          action
                          href="#"
                          tag="a"
                        >
                          Activity 1
                        </ListGroupItem>
                      </ListGroup>
                    </CardFooter> */}
                  </CardBody>
                </Card>
              </Col>
            )}

          </Row>
        </Container>
      </CardGroup>
    </div>
  );
}

export default GroupTable;