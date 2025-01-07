import { render } from '@testing-library/react';
import Search from '../Search';
import { describe, it } from 'node:test';

describe('<Search />', () => {
  it('renders without crashing', () => {
    render(<Search />);
  });
});
