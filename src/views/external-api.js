import React, { useState } from "react";
import { Button, ButtonGroup, Container } from "react-bootstrap";
import Highlight from "../components/highlight";
import Loading from "../components/loading";

import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";

export const ExternalApi = () => {
  const [message, setMessage] = useState("");
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const { getAccessTokenSilently } = useAuth0();

  const callApi = async () => {
    console.log('url called: ', `${serverUrl}/api/messages/public-message`)
    try {
      const response = await fetch(`${serverUrl}/api/messages/public-message`);

      const responseData = await response.json();
      console.log(responseData,'the msg is here ist the response')

      setMessage(responseData.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const callSecureApi = async () => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(
        `${serverUrl}/api/messages/private-message`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json();
      console.log(responseData,'the msg the private route')

      setMessage(responseData.message);
    } catch (error) {
      setMessage(error.message);
    }
  };
  console.log(message, ': message in state')
  return (
    <Container className="mb-5">
      <h1>External API</h1>
      <p>
        You use will use a button to call an external API using an access token,
        and the API will validate it using the API's audience value.{" "}
        <strong>This route should be private</strong>.
      </p>
      <ButtonGroup>
        <Button onClick={callApi} color="primary" className="mt-5">
          Get Public Message
        </Button>
        <Button onClick={callSecureApi} color="primary" className="mt-5">
          Get Private Message
        </Button>
      </ButtonGroup>

      {message && (
        <div className="mt-5">
          <h6 className="muted">Result</h6>
          <Highlight language="json">
            {JSON.stringify(message, null, 2)}
          </Highlight>
        </div>
      )}
    </Container>
  );
};

export default withAuthenticationRequired(ExternalApi,{
onRedirecting:()=><Loading/>
})
