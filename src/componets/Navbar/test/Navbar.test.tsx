import { render } from '@testing-library/react';
import Navbar from '../Navbar';
import { describe, it } from 'node:test';

describe('<Navbar />', () => {
  it('renders without crashing', () => {
    render(<Navbar />);
  });
});
