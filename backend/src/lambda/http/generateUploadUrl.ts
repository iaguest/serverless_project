import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getUserId } from '../utils'
import { getUploadUrl } from '../../s3/attachmentsAccess'
import { onGenerateUploadUrl } from '../../businessLogic/todos'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  const todoId = event.pathParameters.todoId
  const userId: string = getUserId(event)

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  }

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const url = getUploadUrl(todoId);

  try {
    await onGenerateUploadUrl(userId, todoId)
  }
  catch (e) {
    return {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({
        error: `Generate upload URL failed: ${e.message}`
      })
    }
  }

  return {
    statusCode: 201,
    headers: headers,
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}
