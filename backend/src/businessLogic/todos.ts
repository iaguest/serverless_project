import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodosAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

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
  return await todosAccess.createTodoItem({
    userId: userId,
    todoId: uuid.v4(),
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    attachmentUrl: undefined
  })
}

export async function updateTodo(
  updateTodoRequest: UpdateTodoRequest,
  userId: string,
  todoId: string
) {
  const toDoUpdate : TodoUpdate = {
    ...updateTodoRequest,
  }

  const currentTodoItem: TodoItem = await todosAccess.getTodo(userId, todoId)
  
  await todosAccess.updateTodoItem(toDoUpdate, userId, currentTodoItem.createdAt)
}