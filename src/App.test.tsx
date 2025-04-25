import React from 'react';
import { render, screen } from '@testing-library/react';
import Optimized_Swim_Lanes from './Optimized_Swim_Lanes';

test('renders learn react link', () => {
  render(<Optimized_Swim_Lanes />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
