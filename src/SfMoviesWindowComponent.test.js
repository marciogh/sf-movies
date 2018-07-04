import React from 'react';
import ReactDOM from 'react-dom';
import SfMoviesWindowComponent from './SfMoviesWindowComponent.js';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SfMoviesWindowComponent />, div);
  ReactDOM.unmountComponentAtNode(div);
});
