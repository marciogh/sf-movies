/* global google */

import React from 'react';
import GoogleMapReact from 'google-map-react';
import NodeFetch from 'node-fetch';

class SfMoviesComponent extends React.Component {

    render() {
        return (
            <div style={{width: '200px', height: '30px', backgroundColor: 'white', border: '1px solid black', padding: '5px'}}>
                Movie: {this.props.movie}<br />
                Location: {this.props.place}
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
            map: map,
            placesService: new google.maps.places.PlacesService(map.map)
        })
    }

    async handleChange(event) {
        this.setState({
            markers: []
        })
        const s = event.target.value;
        if (s.length < 3) return;
        const movies = await NodeFetch('https://data.sfgov.org/resource/wwmu-gmzc.json?$q=' + encodeURI(s));
        const moviesData = await movies.json();
        moviesData.forEach(movie => {
            this.state.placesService.findPlaceFromQuery({
                query: movie.locations,
                fields: ['name', 'geometry']
            }, (results, status) => {
                if (status === 'OK' && results.length > 0) {
                    results.map((r) => {
                        r.movie = movie.title;
                        return r;
                    });
                    this.setState({
                        markers: this.state.markers.concat(results)
                    })
                }
            });
        })
    }

    render() {
        let sfPoint = {lat: 37.770, lng: -122.450}
        return (
            <div style={{ height: '600px', width: '100%' }}>
                <div style={{height: '20px', textAlign: 'center', padding: '10px'}}>
                    <input type="text" onChange={this.handleChange}/>
                </div>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyCs-ikd7mvKWLaWttqp6aVzLRvoYspGBgw' }}
                    defaultCenter={sfPoint}
                    defaultZoom={13}
                    onGoogleApiLoaded={this.handleOnLoad}
                    yesIWantToUseGoogleMapApiInternals={true}
                >
                    {
                        this.state.markers.map(m => {
                            return (
                                <SfMoviesComponent
                                    movie={m.movie}
                                    place={m.name}
                                    lat={m.geometry.location.lat()}
                                    lng={m.geometry.location.lng()}
                                />
                            )
                    })}
                </GoogleMapReact>
            </div>
        );
    }
}

export default SfMoviesMap;