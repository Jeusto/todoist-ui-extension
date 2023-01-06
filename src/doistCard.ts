import {
  DoistCard,
  SubmitAction,
  TextBlock,
  Choice,
  DateInput,
  ChoiceSetInput,
  CardElement,
} from "@doist/ui-extensions-core";

const cardItems: CardElement[] = [
  TextBlock.from({
    text: `Choose a recurrence from the list below, as well as a start date and an end date for the recurring event.`,
  }),
  ChoiceSetInput.from({
    id: "choices",
    style: "compact",
    isMultiSelect: false,
    placeholder: "Select a recurrence",
    choices: [
      Choice.from({ title: "Every day", value: "daily" }),
      Choice.from({ title: "Every week", value: "weekly" }),
      Choice.from({ title: "Every month", value: "monthly" }),
    ],
  }),
  DateInput.from({
    id: "startDate",
    label: "Select starting date:",
  }),
  DateInput.from({
    id: "endDate",
    label: "Select ending date:",
  }),
];

const submitAction = SubmitAction.from({
  id: "Action.Submit",
  title: "Submit",
  style: "positive",
});

export default function createAdaptativeCard(): DoistCard {
  const card = new DoistCard();

  cardItems.forEach((item) => card.addItem(item));
  card.addAction(submitAction);

  return card;
}
