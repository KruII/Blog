import React from 'react';
import { render } from '@testing-library/react';
import Footer from '../Footer';
import { describe, it } from 'node:test';

describe('<Footer />', () => {
  it('renders without crashing', () => {
    render(<Footer />);
  });
});
