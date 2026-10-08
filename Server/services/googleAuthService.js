import { OAuth2Client } from "google-auth-library";

const client_id =
  "102378244791-hdp2s7hoavf4hv748abh6ccmla5ogmga.apps.googleusercontent.com";

const client = new OAuth2Client({
  client_id,
});

export async function verifyIdToken(idToken) {
  const loginTicket = await client.verifyIdToken({
    idToken,
    audience: client_id,
  });
  const userData = loginTicket.getPayload();
  return userData;
}
