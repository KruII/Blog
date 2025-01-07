import { render } from '@testing-library/react';
import LoginRegister from '../page';
import { describe, it } from 'node:test';

describe('<LoginRegister />', () => {
  it('renders without crashing', () => {
    render(<LoginRegister />);
  });
});
