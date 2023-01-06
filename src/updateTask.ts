import { TodoistApi } from "@doist/todoist-api-typescript";

import { TaskParams } from "./types";

const clientSecret = process.env.TODOIST_CLIENT_SECRET ?? "";
const api = new TodoistApi(clientSecret);

export default async function updateTask({
  taskId,
  recurrence,
  startDate,
  endDate,
}: TaskParams): Promise<string> {
  let returnMessage = "";
  let newTaskName = "";

  // Get task content
  api
    .getTask(taskId)
    .then((task) => {
      newTaskName = `${task.content} every ${recurrence} starting
    ${startDate} ending ${endDate}`;
    })
    .catch((error) => {
      returnMessage = `Error: ${error}`;
      return returnMessage;
    });

  // Update it
  api
    .updateTask(taskId, { content: newTaskName })
    .then((task) => {
      returnMessage = `Task updated for: ${task.content}`;
    })
    .catch((error) => {
      returnMessage = `Error: ${error}`;
    });

  return returnMessage;
}
