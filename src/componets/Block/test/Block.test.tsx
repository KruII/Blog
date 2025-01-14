import { render } from '@testing-library/react';
import Block from '../Block';
import { describe, it } from 'node:test';

describe('<Block />', () => {
  it('renders without crashing', () => {
    render(<Block />);
  });
});
