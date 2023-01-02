import {
  DoistCard,
  SubmitAction,
  TextBlock,
  Choice,
  DateInput,
  ChoiceSetInput,
  DoistCardRequest,
} from "@doist/ui-extensions-core";
import express, { Request, Response, NextFunction } from "express";

import updateTask from "./updateTask";

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
  console.debug(action);

  if (action.actionType === "initial") {
    // Initial call to the UI Extension,
    // triggered by the user launching the extension

    // Prepare the Adaptive Card with the response
    const card = new DoistCard();

    card.addItem(
      TextBlock.from({
        text: "Hello, my friend!",
      })
    );
    card.addItem(
      ChoiceSetInput.from({
        id: "choices",
        style: "compact",
        isMultiSelect: true,
        placeholder: "Select one or more options",
        choices: [
          Choice.from({ title: "Every day", value: "daily" }),
          Choice.from({ title: "Every week", value: "weekly" }),
          Choice.from({ title: "Every month", value: "monthly" }),
        ],
      })
    );
    card.addItem(
      DateInput.from({
        id: "startDate",
        label: "Select starting date:",
      })
    );
    card.addItem(
      DateInput.from({
        id: "endDate",
        label: "Select ending date:",
      })
    );

    card.addAction(
      SubmitAction.from({
        id: "Action.Submit",
        title: "Submit",
        style: "positive",
      })
    );

    // Send the Adaptive Card to the renderer
    response.status(200).json({ card: card });
  } else if (
    action.actionType === "submit" &&
    action.actionId === "Action.Submit"
  ) {
    // Subsequent call to the UI Extension,
    // triggered by clicking the submit button

    let taskId = action.params?.sourceId as string;
    let recurrence = action.inputs?.choices as string;
    let startDate = action.inputs?.startDate as string;
    let endDate = action.inputs?.endDate as string;

    const result = updateTask(taskId, recurrence, startDate, endDate);

    // Prepare the response
    // (this time it won't be an Adaptive Card, but two bridges)
    const bridges = [
      {
        bridgeActionType: "display.notification",
        notification: {
          type: "success",
          text: "Recurrency has been updated",
        },
      },
      {
        bridgeActionType: "finished",
      },
    ];

    // Send the bridges to the rendederer
    response.status(200).json({ bridges: bridges });
  } else {
    // throw new Error("Request is not valid");
  }
};

app.post("/process", processRequest);

app.listen(port, () => {
  console.log(`UI Extension server running on port ${port}.`);
});
