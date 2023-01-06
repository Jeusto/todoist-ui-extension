type Recurrency = "day" | "week" | "month" | "year";

export interface TaskParams {
  taskId: string;
  recurrence: Recurrency;
  startDate: string;
  endDate: string;
}
