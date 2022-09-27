import { Step } from '../../../models';

export const mockFlowData: Pick<Step, 'id' | 'text' | 'valueOptions'>[] = [
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
