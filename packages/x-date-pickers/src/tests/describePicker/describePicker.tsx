/* eslint-env mocha */
import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen, fireEvent, createDescribe } from '@mui/monorepo/test/utils';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { DescribePickerOptions } from './describePicker.types';

function innerDescribePicker(ElementToTest: React.ElementType, options: DescribePickerOptions) {
  const { render, fieldType, hasNoView, variant } = options;

  const propsToOpen = variant === 'static' ? {} : { open: true };

  it('should forward the `inputRef` prop to the text field', function test() {
    if (fieldType === 'multi-input' || variant === 'static') {
      this.skip();
    }

    const inputRef = React.createRef<HTMLInputElement>();
    render(<ElementToTest inputRef={inputRef} />);

    expect(inputRef.current).to.have.tagName('input');
  });

  describe('Localization', () => {
    it('should respect the `localeText` prop', function test() {
      if (hasNoView) {
        this.skip();
      }

      render(
        <ElementToTest
          {...propsToOpen}
          localeText={{ cancelButtonLabel: 'Custom cancel' }}
          slotProps={{ actionBar: { actions: ['cancel'] } }}
        />,
      );

      expect(screen.queryByText('Custom cancel')).not.to.equal(null);
    });
  });

  describe('Component slot: OpenPickerIcon', () => {
    it('should render custom component', function test() {
      if (variant === 'static' || fieldType === 'multi-input') {
        this.skip();
      }

      function HomeIcon(props: SvgIconProps) {
        return (
          <SvgIcon data-testid="component-test" {...props}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </SvgIcon>
        );
      }

      const { queryAllByTestId } = render(
        <ElementToTest
          slots={{
            openPickerIcon: HomeIcon,
          }}
        />,
      );

      const shouldRenderOpenPickerIcon = !hasNoView && variant !== 'mobile';

      expect(queryAllByTestId('component-test')).to.have.length(shouldRenderOpenPickerIcon ? 1 : 0);
    });
  });

  describe('Component slot: DesktopPaper', () => {
    it('should forward onClick and onTouchStart', function test() {
      if (hasNoView || variant !== 'desktop') {
        this.skip();
      }

      const handleClick = spy();
      const handleTouchStart = spy();
      render(
        <ElementToTest
          {...propsToOpen}
          slotProps={{
            desktopPaper: {
              onClick: handleClick,
              onTouchStart: handleTouchStart,
              'data-testid': 'paper',
            },
          }}
        />,
      );
      const paper = screen.getByTestId('paper');

      fireEvent.click(paper);
      fireEvent.touchStart(paper);

      expect(handleClick.callCount).to.equal(1);
      expect(handleTouchStart.callCount).to.equal(1);
    });
  });

  describe('Component slot: Popper', () => {
    it('should forward onClick and onTouchStart', function test() {
      if (hasNoView || variant !== 'desktop') {
        this.skip();
      }

      const handleClick = spy();
      const handleTouchStart = spy();
      render(
        <ElementToTest
          {...propsToOpen}
          slotProps={{
            popper: {
              onClick: handleClick,
              onTouchStart: handleTouchStart,
              'data-testid': 'popper',
            },
          }}
        />,
      );
      const popper = screen.getByTestId('popper');

      fireEvent.click(popper);
      fireEvent.touchStart(popper);

      expect(handleClick.callCount).to.equal(1);
      expect(handleTouchStart.callCount).to.equal(1);
    });
  });

  describe('Component slot: Toolbar', () => {
    it('should render toolbar on mobile but not on desktop when `hidden` is not defined', function test() {
      if (hasNoView) {
        this.skip();
      }

      render(<ElementToTest {...propsToOpen} />);

      if (variant === 'desktop') {
        expect(screen.queryByMuiTest('picker-toolbar')).to.equal(null);
      } else {
        expect(screen.getByMuiTest('picker-toolbar')).toBeVisible();
      }
    });

    it('should render toolbar when `hidden` is `false`', function test() {
      if (hasNoView) {
        this.skip();
      }

      render(<ElementToTest {...propsToOpen} slotProps={{ toolbar: { hidden: false } }} />);

      expect(screen.getByMuiTest('picker-toolbar')).toBeVisible();
    });

    it('should not render toolbar when `hidden` is `true`', function test() {
      if (hasNoView) {
        this.skip();
      }

      render(<ElementToTest {...propsToOpen} slotProps={{ toolbar: { hidden: true } }} />);

      expect(screen.queryByMuiTest('picker-toolbar')).to.equal(null);
    });
  });
}

/**
 * Test behaviors shared across all pickers.
 */
export const describePicker = createDescribe('Pickers shared APIs', innerDescribePicker);
