// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'p1zdio2js8'
export const apiEndpoint = `https://${apiId}.execute-api.eu-west-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-pgq4cwul.us.auth0.com',                   // Auth0 domain
  clientId: 'Hn6Mp8nSMrPuewKWSURbCeL4uw1uoH7v',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
