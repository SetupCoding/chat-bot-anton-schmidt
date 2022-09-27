import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorComponent } from '../../components';

const getButton = (): HTMLElement =>
  screen.getByRole('button', {
    name: /Erneut absenden/i,
  });

const queryHeading = (): HTMLElement | null =>
  screen.queryByRole('heading', {
    name: /Ein Fehler ist aufgetreten\./i,
  });

describe('ErrorComponent', () => {
  const mockRetryCallback = jest.fn();
  const props = {
    error: 'Some error',
    retryCallback: mockRetryCallback,
  };

  it('should not render ErrorComponent when no error is passed', () => {
    render(<ErrorComponent />);

    expect(queryHeading()).toBeNull();
  });

  it('should render ErrorComponent with a heading and no button when no retryCallback is passed', () => {
    render(<ErrorComponent {...props} retryCallback={undefined} />);

    const heading = screen.getByRole('heading', {
      name: /Ein Fehler ist aufgetreten\. Bitte versuchen Sie es in ein paar Minuten erneut\./i,
    });
    const button = screen.queryByRole('button', {
      name: /Erneut absenden/i,
    });

    expect(heading).toBeInTheDocument();
    expect(button).toBeNull();
  });

  it('should render ErrorComponent with a heading and a retry button when retryCallback is passed', () => {
    render(<ErrorComponent {...props} />);

    expect(queryHeading()).toBeInTheDocument();

    expect(getButton()).toBeInTheDocument();
  });

  it('should call retryCallback on button click', async () => {
    render(<ErrorComponent {...props} />);

    await userEvent.click(getButton());
    expect(mockRetryCallback).toBeCalledWith();
  });
});
