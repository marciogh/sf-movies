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
            map: map
        })
    }


    findPlaceFromQueryAsync(placesService, movie) {
        return new Promise((resolve, reject) => {
            placesService.findPlaceFromQuery({
                query: movie.locations,
                fields: ['name', 'geometry']
            }, (results, status) => {
                if (status === 'OK') {
                    results.map((o) => {
                        o.movie = movie.title;
                        return o;
                    })
                    resolve(results);
                } else {
                    resolve(null);
                }
            });
        });
    }

    async handleChange(event) {

        var markers = [];
        this.setState({
            markers: markers
        })
        const s = event.target.value;
        if (s.length < 3) return;
        let placesService = new google.maps.places.PlacesService(this.state.map.map)
        const movies = await NodeFetch('https://data.sfgov.org/resource/wwmu-gmzc.json?$q=' + encodeURI(s));
        const moviesData = await movies.json();
        let findPlacesPromises = [];
        moviesData.forEach(movie => {
            findPlacesPromises.push(this.findPlaceFromQueryAsync(placesService, movie))
        })
        Promise.all(findPlacesPromises, {concurrency: 10}).then((r) => {
            r.filter((o) => {
                return o != null;
            }).map((o) => {
                markers = markers.concat(o);
                return o;
            });
            console.log(markers);
            this.setState({
                markers: markers
            });
        }).catch((err) => {
            console.log('error' + err);
        });
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
                    {this.state.markers.map(m => {
                        return <SfMoviesComponent
                            movie={m.movie}
                            place={m.name}
                            lat={m.geometry.location.lat()}
                            lng={m.geometry.location.lng()} />
                    })}
                </GoogleMapReact>
            </div>
        );
    }
}

export default SfMoviesMap;