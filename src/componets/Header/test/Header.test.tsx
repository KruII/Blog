import React from 'react';
import { render } from '@testing-library/react';
import Header from '../Header';
import { describe, it } from 'node:test';

describe('<Header />', () => {
  it('renders without crashing', () => {
    render(<Header />);
  });
});
