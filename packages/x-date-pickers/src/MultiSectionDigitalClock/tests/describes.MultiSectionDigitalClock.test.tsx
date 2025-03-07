import * as React from 'react';
import { screen, userEvent, describeConformance } from '@mui/monorepo/test/utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import { createPickerRenderer, adapterToUse, wrapPickerMount } from 'test/utils/pickers-utils';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { expect } from 'chai';

describe('<MultiSectionDigitalClock /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(MultiSectionDigitalClock, () => ({
    render,
    clock,
    views: ['hours', 'minutes'],
    componentFamily: 'multi-section-digital-clock',
    variant: 'desktop',
  }));

  describeConformance(<MultiSectionDigitalClock />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiMultiSectionDigitalClock',
    wrapMount: wrapPickerMount,
    refInstanceof: window.HTMLDivElement,
    skip: [
      'componentProp',
      'componentsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'mergeClassName',
      'propsSpread',
      'rootClass',
      'reactTestRenderer',
    ],
  }));

  describeValue(MultiSectionDigitalClock, () => ({
    render,
    componentFamily: 'multi-section-digital-clock',
    type: 'time',
    variant: 'desktop',
    values: [
      adapterToUse.date(new Date(2018, 0, 1, 15, 30)),
      adapterToUse.date(new Date(2018, 0, 1, 16, 15)),
    ],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const selectedItems = screen.queryAllByRole('option', { selected: true });
      if (!expectedValue) {
        expect(selectedItems).to.have.length(0);
      } else {
        const hoursLabel = adapterToUse.format(
          expectedValue,
          hasMeridiem ? 'hours12h' : 'hours24h',
        );
        const minutesLabel = adapterToUse.getMinutes(expectedValue).toString();
        expect(selectedItems[0]).to.have.text(hoursLabel);
        expect(selectedItems[1]).to.have.text(minutesLabel);
        if (hasMeridiem) {
          expect(selectedItems[2]).to.have.text(
            adapterToUse.getMeridiemText(adapterToUse.getHours(expectedValue) > 12 ? 'pm' : 'am'),
          );
        }
      }
    },
    setNewValue: (value) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const hoursLabel = parseInt(
        adapterToUse.format(value, hasMeridiem ? 'hours12h' : 'hours24h'),
        10,
      );
      const minutesLabel = adapterToUse.getMinutes(value).toString();
      userEvent.mousePress(screen.getByRole('option', { name: `${hoursLabel} hours` }));
      userEvent.mousePress(screen.getByRole('option', { name: `${minutesLabel} minutes` }));
      if (hasMeridiem) {
        userEvent.mousePress(
          screen.getByRole('option', {
            name: adapterToUse.getMeridiemText(adapterToUse.getHours(value) > 12 ? 'pm' : 'am'),
          }),
        );
      }

      return value;
    },
  }));
});
