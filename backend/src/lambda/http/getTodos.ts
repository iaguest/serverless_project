import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import 'source-map-support/register'

import { getAllTodos } from '../../businessLogic/todos';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  // TODO: Get all TODO items for a current user

  const authorization = event.headers.Authorization

  console.log(`authorization ${authorization}`)

  const split = authorization.split(' ')
  const jwtToken = split[1]

  console.log(`jwtToken ${jwtToken}`)

  const items = await getAllTodos(jwtToken)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
