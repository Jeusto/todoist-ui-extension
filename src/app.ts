import { DoistCard, DoistCardRequest } from "@doist/ui-extensions-core";
import express, { Request, Response, NextFunction } from "express";

import updateTask from "./updateTask";
import createAdaptativeCard from "./doistCard";
import { TaskParams, Recurrency } from "./types";

const port = 3000;
const app = express();
app.use(express.json());

const processRequest = async function (
  request: Request,
  response: Response,
  next: NextFunction
) {
  const doistRequest: DoistCardRequest = request.body as DoistCardRequest;
  const { action } = doistRequest;

  if (action.actionType === "initial") {
    // Initial call to the UI Extension,
    // triggered by the user launching the extension

    // Prepare and send the Adaptive Card to the renderer
    const card: DoistCard = createAdaptativeCard();
    response.status(200).json({ card: card });
  } else if (
    action.actionType === "submit" &&
    action.actionId === "Action.Submit"
  ) {
    // Subsequent call to the UI Extension,
    // triggered by clicking the submit button
    let params: TaskParams = {
      taskId: action.params?.sourceId as string,
      recurrence: action.inputs?.choices as Recurrency,
      startDate: action.inputs?.startDate as string,
      endDate: action.inputs?.endDate as string,
    };

    const result = await updateTask(params);

    // Prepare and send the bridges to the renderer
    const bridges = [
      {
        bridgeActionType: "display.notification",
        notification: {
          type: "info",
          text: result,
        },
      },
      {
        bridgeActionType: "finished",
      },
    ];

    response.status(200).json({ bridges: bridges });
  } else {
    console.error("Request is not valid", request.body);
  }
};

app.post("/process", processRequest);

app.listen(port, () => {
  console.log(`UI Extension server running on port ${port}.`);
});
