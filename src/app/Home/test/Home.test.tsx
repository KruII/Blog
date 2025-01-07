import { render } from '@testing-library/react';
import Home from '../page';
import { describe, it } from 'node:test';

describe('<Home />', () => {
  it('renders without crashing', () => {
    render(<Home />);
  });
});
