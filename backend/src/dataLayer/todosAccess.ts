import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosTableIndex = process.env.INDEX_NAME) {
  }

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos')

    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async getTodo(userId: string, todoId:string) : Promise<TodoItem> {
    console.log('Getting todo')

    const result = await this.docClient.query({
      TableName : this.todosTable,
      IndexName : this.todosTableIndex,
      KeyConditionExpression: 'userId = :userId and todoId = :todoId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':todoId': todoId,
      }
    }).promise()

    const item = result.Items[0]
    return item as TodoItem
  }

  async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()

    return todoItem
  }

  async updateTodoItem(todoUpdate: TodoUpdate, userId: string, createdAt: string) {

    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        'userId' : userId,
        'createdAt' : createdAt
      },
      UpdateExpression: 'set #nme = :nme, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        "#nme": "name"
      },
      ExpressionAttributeValues: {
        ':nme' : todoUpdate.name,
        ':dueDate' : todoUpdate.dueDate,
        ':done' : todoUpdate.done
      }
    }).promise()

  }

  async setTodoItemAttachmentUrl(userId: string, createdAt: string, todoId: string) {

    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        'userId' : userId,
        'createdAt' : createdAt
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl' : todoId,
      }
    }).promise()

  }

  async deleteToDoItem(userId: string, createdAt: string) {
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        'userId' : userId,
        'createdAt' : createdAt
      },
    }).promise()
  }

}

function createDynamoDBClient() {
  return new AWS.DynamoDB.DocumentClient()
}
