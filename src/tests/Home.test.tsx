import { render, screen } from '@testing-library/react';
import Home from '../pages/index';
import '@testing-library/jest-dom';

describe('Home', () => {
  it('should render correct heading', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', {
      name: /MUI v5 \+ Next\.js with TypeScript example/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
