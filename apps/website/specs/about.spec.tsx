import { render } from '@testing-library/react';
import React from 'react';

import About from '../src/pages/about';

describe('About', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<About />);
    expect(baseElement).toBeTruthy();
  });
});
