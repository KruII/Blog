import { render } from '@testing-library/react';
import PostDetails from '../page';
import { describe, it } from 'node:test';

describe('<PostDetails />', () => {
  it('renders without crashing', () => {
    render(<PostDetails />);
  });
});
