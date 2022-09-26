import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chat } from '../components';
import '@testing-library/jest-dom';

import { Step } from '../models';
import React from 'react';

const mockFlow: Pick<Step, 'id' | 'text' | 'valueOptions'>[] = [
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
        nextId: 205,
        value: false,
        text: 'Nein',
        isSelected: true,
      },
    ],
  },
];

const getButtonOne = (): HTMLElement =>
  screen.getByRole('button', {
    name: /Ja/i,
  });

const getButtonTwo = (): HTMLElement =>
  screen.getByRole('button', {
    name: /Nein/i,
  });

describe('Chat', () => {
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  const mockSelectOption = jest.fn();
  const props = {
    flow: mockFlow as Step[],
    isFlowFinished: false,
    selectOption: mockSelectOption,
  };

  it('should render one question and two buttons one of which is pressed', () => {
    render(<Chat {...props} />);

    const question = screen.getByRole('heading', {
      name: /Benötigen Sie eine Haftplichtversicherung\?/i,
    });

    const buttonOne = getButtonOne();
    const buttonTwo = getButtonTwo();

    expect(question).toBeInTheDocument();

    expect(buttonOne).toBeInTheDocument();
    expect(buttonOne.getAttribute('aria-pressed')).toBe('false');

    expect(buttonTwo).toBeInTheDocument();
    expect(buttonTwo.getAttribute('aria-pressed')).toBe('true');
  });

  it('should call scrollIntoView in useEffect', () => {
    jest.spyOn(React, 'useEffect');
    render(<Chat {...props} />);

    expect(scrollIntoViewMock).toBeCalledWith({ behavior: 'smooth' });
  });

  it('should call selectOption with correct attributes on button click', async () => {
    render(<Chat {...props} />);

    await userEvent.click(getButtonOne());
    expect(mockSelectOption).toBeCalledWith(100, true, 200);

    await userEvent.click(getButtonTwo());
    expect(mockSelectOption).toBeCalledWith(100, false, 205);
  });

  it('should have all buttons disabled if isFlowFinished is set to true', () => {
    render(<Chat {...props} isFlowFinished={true} />);

    expect(getButtonOne()).toBeDisabled();
    expect(getButtonTwo()).toBeDisabled();
  });
});
