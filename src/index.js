import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SfMoviesMapComponent from './SfMoviesMapComponent'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<SfMoviesMapComponent />, document.getElementById('root'));
registerServiceWorker();
