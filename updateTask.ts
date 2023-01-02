import { TodoistApi } from "@doist/todoist-api-typescript";

const clientSecret = process.env.TODOIST_CLIENT_SECRET ?? "";
const api = new TodoistApi(clientSecret);

// type Recurrence = "daily" | "weekly" | "monthly";

export default async function updateTask(
  taskId: string,
  recurrence: string,
  startDate: string,
  endDate: string
): Promise<string> {
  let returnMessage: string = "";

  const task = await api.getTask(taskId);
  const newTaskName = `${task.content} (${recurrence})`;

  const response = await api.updateTask(taskId, { content: newTaskName });
  returnMessage = `Task updated for: ${response.content}`;

  console.log(returnMessage);
  return returnMessage;

  api
    .updateTask(taskId, { content: newTaskName })
    .then((task) => {
      returnMessage = `Task updated for: ${task.content}`;
    })
    .catch((error) => {
      returnMessage = `Error: ${error}`;
    })
    .finally(() => {
      console.log(returnMessage);
      return returnMessage;
    });
}
