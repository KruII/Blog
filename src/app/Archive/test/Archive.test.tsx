import { render } from '@testing-library/react';
import Archive from '../page';
import { describe, it } from 'node:test';

describe('<Archive />', () => {
  it('renders without crashing', () => {
    render(<Archive />);
  });
});
