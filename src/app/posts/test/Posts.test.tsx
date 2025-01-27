import { render } from '@testing-library/react';
import Posts from '../page';
import { describe, it } from 'node:test';

describe('<Posts />', () => {
  it('renders without crashing', () => {
    render(<Posts />);
  });
});
