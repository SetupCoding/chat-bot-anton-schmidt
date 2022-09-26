import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chat, ErrorComponent } from '../components';
import '@testing-library/jest-dom';

const getButton = (): HTMLElement =>
  screen.getByRole('button', {
    name: /Erneut absenden/i,
  });

describe('ErrorComponent', () => {
  const mockRetryCallback = jest.fn();
  const props = {
    error: 'Some error',
    retryCallback: mockRetryCallback,
  };

  it('should not render error component when no error is passed', () => {
    render(<ErrorComponent />);

    const heading = screen.queryByRole('heading', {
      name: /Ein Fehler ist aufgetreten\./i,
    });

    expect(heading).toBeNull();
  });

  it('should render error component with a heading and no button when no retryCallback is passed', () => {
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

  it('should render error component with a heading and a retry button when retryCallback is passed', () => {
    render(<ErrorComponent {...props} />);

    const heading = screen.getByRole('heading', {
      name: /Ein Fehler ist aufgetreten\./i,
    });

    expect(heading).toBeInTheDocument();

    expect(getButton()).toBeInTheDocument();
  });

  it('should call retryCallback on button click', async () => {
    render(<ErrorComponent {...props} />);

    await userEvent.click(getButton());
    expect(mockRetryCallback).toBeCalledWith();
  });
});
