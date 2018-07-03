import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SfMoviesMap from './SfMoviesMap'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<SfMoviesMap />, document.getElementById('root'));
registerServiceWorker();
