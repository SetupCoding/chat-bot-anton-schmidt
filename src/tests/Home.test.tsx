import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Step } from '../models';
import Home from '../pages/index';

const mockFlowData: Pick<Step, 'id' | 'text' | 'valueOptions'>[] = [
  {
    id: 100,
    text: 'Benötigen Sie eine Haftplichtversicherung?',
    valueOptions: [
      {
        nextId: 200,
        value: true,
        text: 'Ja',
      },
      {
        nextId: 200,
        value: false,
        text: 'Nein',
      },
    ],
  },
  {
    id: 200,
    text: 'Benötigen Sie eine Kasko?',
    valueOptions: [
      {
        nextId: 201,
        value: true,
        text: 'Ja',
      },
      {
        nextId: 300,
        value: false,
        text: 'Nein',
      },
    ],
  },
  {
    id: 201,
    text: 'Welche Art von Kasko benötigen Sie?',
    valueOptions: [
      {
        nextId: 300,
        value: 'full',
        text: 'Vollkasko',
      },
      {
        nextId: 300,
        value: 'part',
        text: 'Teilkasko',
      },
    ],
  },
  {
    id: 300,
    text: 'Welche Kennzeichenart benötigen Sie?',
    valueOptions: [
      {
        nextId: false,
        value: 'ekz',
        text: 'Einzelkennzeichen',
      },
      {
        nextId: 301,
        value: 'wkz',
        text: 'Wechselkennzeichen',
      },
    ],
  },
  {
    id: 301,
    text: 'Wie viele Fahrzeuge wollen Sie versichern?',
    valueOptions: [
      {
        nextId: false,
        value: 2,
        text: 'Zwei Fahrzeuge',
      },
      {
        nextId: false,
        value: 3,
        text: 'Drei Fahrzeuge',
      },
    ],
  },
];

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
