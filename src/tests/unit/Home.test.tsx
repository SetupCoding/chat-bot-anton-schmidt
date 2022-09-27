import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import type { Step } from '../../models';
import Home from '../../pages/index';
import { mockFlowData } from './mocks';

const getHeading = (): HTMLElement =>
  screen.getByRole('heading', {
    name: /Versicherungs-Helfer/i,
  });
const queryFinishedHeading = (): HTMLElement | null =>
  screen.queryByRole('heading', {
    name: /Herzlichen Dank für Ihre Angaben!/i,
  });

const queryLoadingHeading = (): HTMLElement | null =>
  screen.queryByRole('heading', {
    name: /Sende Daten\.\.\./i,
  });

describe('Home', () => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  it('should render correct headings', () => {
    render(<Home flowData={mockFlowData as Step[]} />);

    expect(getHeading()).toBeInTheDocument();

    expect(queryFinishedHeading()).toBeNull();
    expect(queryLoadingHeading()).toBeNull();
  });

  it('should render correct headings when there was an error on the server side', () => {
    render(<Home flowData={[]} errorMessage={'Some error'} />);

    const errorHeading = screen.getByRole('heading', {
      name: /Ein Fehler ist aufgetreten\. Bitte versuchen Sie es in ein paar Minuten erneut\./i,
    });

    expect(getHeading()).toBeInTheDocument();
    expect(errorHeading).toBeInTheDocument();

    expect(queryFinishedHeading()).toBeNull();
    expect(queryLoadingHeading()).toBeNull();
  });
});
