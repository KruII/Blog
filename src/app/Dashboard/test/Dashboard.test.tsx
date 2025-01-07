import { render } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { describe, it } from 'node:test';

describe('<Dashboard />', () => {
  it('renders without crashing', () => {
    render(<Dashboard />);
  });
});
