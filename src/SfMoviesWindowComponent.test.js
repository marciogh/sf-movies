import React from 'react';
import ReactDOM from 'react-dom';
import SfMoviesWindowComponent from './SfMoviesWindowComponent';

it('renders without crashing', () => {
    const div = document.createElement('div');
    const movie = {
        movie: 'Mock Movie',
        place: 'Mock Place',
        location: 'Mock Location'
    }
    ReactDOM.render(
        <SfMoviesWindowComponent
            movie={movie}
        />, div);
    ReactDOM.unmountComponentAtNode(div);
});
