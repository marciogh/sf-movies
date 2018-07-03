/* global google */

import React from 'react';
import GoogleMapReact from 'google-map-react';
import NodeFetch from 'node-fetch';
import Promise from 'bluebird'

class SfMoviesComponent extends React.Component {

    shouldComponentUpdate = true;

    render() {
        console.log('rendering... ' + this.props.text)
        return (
            <div style={{width: '150px', height: '50px', backgroundColor: 'white', border: '1px solid black'}}>
                {this.props.text}
            </div>
        )
    };

};

class SfMoviesMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            markers: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleOnLoad = this.handleOnLoad.bind(this);
    }

    handleOnLoad(map) {
        this.setState({
            map: map
        })
    }

    handleChange(event) {

        var markers = [];
        this.setState({
            markers: markers
        })
        const s = event.target.value;
        if (s.length < 2) return;
        let placesService = new google.maps.places.PlacesService(this.state.map.map)
        //Promise.promisifyAll(placesService)

        NodeFetch('https://data.sfgov.org/resource/wwmu-gmzc.json?$q=' + encodeURI(s))
            .then((movies) => {
                movies.json()
                    .then((moviesData) => {
                        moviesData.forEach(movie => {
                            placesService.findPlaceFromQuery({
                                query: movie.locations,
                                fields: ['name', 'geometry']
                            }, (result) => {
                                markers = markers.concat(result)
                            });
                        });
                        console.log(markers)
                        this.setState({
                            markers: markers
                        })
                    })
                })
    }

    render() {
        let sfPoint = {lat: 37.755, lng: -122.450}
        return (
            <div style={{ height: '400px', width: '100%' }}>
                <div style={{height: '20px', textAlign: 'center', padding: '10px'}}>
                    <input type="text" onChange={this.handleChange}/>
                </div>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyCs-ikd7mvKWLaWttqp6aVzLRvoYspGBgw' }}
                    defaultCenter={sfPoint}
                    defaultZoom={12}
                    onGoogleApiLoaded={this.handleOnLoad}
                    yesIWantToUseGoogleMapApiInternals={true}
                >
                    {this.state.markers.map(m => {
                        console.log(m)
                        return <SfMoviesComponent
                            text={m.name}
                            lat={m.geometry.location.lat()}
                            lng={m.geometry.location.lng()} />
                    })}
                </GoogleMapReact>
            </div>
        );
    }
}

SfMoviesMap.defaultProps = {
    sfCoordinates: {lat: 37.755, lng: -122.450}
}

export default SfMoviesMap;