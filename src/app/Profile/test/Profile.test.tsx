import { render } from '@testing-library/react';
import Profile from '../page';
import { describe, it } from 'node:test';

describe('<Profile />', () => {
  it('renders without crashing', () => {
    render(<Profile />);
  });
});
