import React from 'react';
import ReactDOM from 'react-dom';
import SfMoviesMap from './SfMoviesMap';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SfMoviesMap />, div);
  ReactDOM.unmountComponentAtNode(div);
});
