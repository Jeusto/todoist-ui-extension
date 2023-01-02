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
          Choice.from({ title: "Option 1", value: "1" }),
          Choice.from({ title: "Option 2", value: "2" }),
          Choice.from({ title: "Option 3", value: "3" }),
        ],
      })
    );
    card.addItem(
      DateInput.from({
        id: "date1",
        label: "Select starting date:",
      })
    );
    card.addItem(
      DateInput.from({
        id: "date2",
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
    const { data } = action;
    console.log(data);

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
    throw new Error("Request is not valid");
  }
};

app.post("/process", processRequest);

app.listen(port, () => {
  console.log(`UI Extension server running on port ${port}.`);
});
