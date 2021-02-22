import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

const todosAccess = new TodosAccess()

export async function getAllTodos(
  userId: string
): Promise<TodoItem[]> {
  return todosAccess.getAllTodos(userId)
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {

  const todoId = uuid.v4()

  return await todosAccess.createTodoItem({
    userId: userId,
    todoId: todoId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    attachmentUrl: undefined
  })
}