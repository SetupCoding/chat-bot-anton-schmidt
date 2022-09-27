import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { LoadingIndicator } from '../../components';

const queryHeading = (): HTMLElement | null =>
  screen.queryByRole('heading', {
    name: /Sende Daten\.\.\./i,
  });

describe('LoadingIndicator', () => {
  it('should not render LoadingIndicator when isLoading is false', () => {
    render(<LoadingIndicator isLoading={false} />);

    expect(queryHeading()).toBeNull();
  });

  it('should render LoadingIndicator when isLoading is true', () => {
    render(<LoadingIndicator isLoading />);

    expect(queryHeading()).toBeInTheDocument();
  });
});
