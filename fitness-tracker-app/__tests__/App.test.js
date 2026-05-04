import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

describe('Fitness Tracker App', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<App />);
    expect(getByText).toBeDefined();
  });

  it('renders the app component', () => {
    const component = render(<App />);
    expect(component).toBeDefined();
  });
});
