import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
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

  async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()

    return todoItem
  }

  async updateTodoItem(todoUpdate: TodoUpdate, todoId: string) {

    await this.docClient.update({
      TableName: this.todosTable,
      Key: { 'todoId' : todoId },
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
}

function createDynamoDBClient() {
  return new AWS.DynamoDB.DocumentClient()
}
