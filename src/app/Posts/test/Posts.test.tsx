import { render } from '@testing-library/react';
import Posts from '../Posts';
import { describe, it } from 'node:test';

describe('<Posts />', () => {
  it('renders without crashing', () => {
    render(<Posts />);
  });
});
