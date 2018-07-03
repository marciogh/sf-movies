import React from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import SfMoviesSearch from './SfMoviesSearch'

class SfMoviesMap extends React.Component {

    render() {

        let sfPoint = {lat: 37.755, lng: -122.450}

        return (
            <Map
                google={this.props.google}
                zoom={13}
                initialCenter={sfPoint}
                style={{width: '100%', height: '500px', position: 'relative'}}
            >
                <SfMoviesSearch />
                <Marker name={'Current location'} />
                <InfoWindow>
                    <div>
                        <h1>Sbrubles</h1>
                    </div>
                </InfoWindow>
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCs-ikd7mvKWLaWttqp6aVzLRvoYspGBgw'
})(SfMoviesMap)