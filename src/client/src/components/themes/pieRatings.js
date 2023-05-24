import { assign } from "lodash";

const blueGrey50 = "#ECEFF1";
const blueGrey700 = "#455A64";
// *
// * Typography
// *
const sansSerif = "'Helvetica Neue', 'Helvetica', sans-serif";
const letterSpacing = "normal";
const fontSize = 12;
// *
// * Layout
// *
const padding = 8;
const baseProps = {
  width: 350,
  height: 350,
  padding: 50,
};
// *
// * Labels
// *
const baseLabelStyles = {
  fontFamily: sansSerif,
  fontSize,
  letterSpacing,
  padding,
  fill: blueGrey700,
  stroke: "transparent",
  strokeWidth: 0,
};

export const PieRatingsTheme = {
  pie: assign(
    {
      colorScale: [
        '#0e0e52',
        '#150578',
        '#3943b7',
        '#449dd1',
        '#78c0e0',
        '#e1e5f2',
      ],
      style: {
        data: {
          padding,
          stroke: blueGrey50,
          strokeWidth: 1,
        },
        labels: assign({}, baseLabelStyles, { padding: 20 }),
      },
    },
    baseProps,
  ),
  bar: assign(
    {
      colorScale: [
        '#0e0e52',
        '#150578',
        '#3943b7',
        '#449dd1',
        '#78c0e0',
        '#e1e5f2',
      ],
      style: {
        data: {
          padding,
          stroke: blueGrey50,
          strokeWidth: 1,
        },
        labels: assign({}, baseLabelStyles, { padding: 20 }),
      },
    },
    baseProps,
  )
};
