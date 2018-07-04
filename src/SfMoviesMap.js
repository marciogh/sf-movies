/* global google */

import React from 'react';
import GoogleMapReact from 'google-map-react';
import NodeFetch from 'node-fetch';
import ReactLoading from 'react-loading';
import Autocomplete from 'react-autocomplete';

class SfMoviesComponent extends React.Component {

    render() {
        return (
            <div id={"sfMoviesComponent"}>
                Movie: {this.props.movie}<br />
                Location: {this.props.location} <br />
                Google Location: {this.props.place}
            </div>
        )
    };

};

class SfMoviesMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            moviesAutocomplete: [],
            movieAutocompleteValue: [],
            markers: [],
            loading: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleOnLoad = this.handleOnLoad.bind(this);
        this.handleAutocompleteOnChange = this.handleAutocompleteOnChange.bind(this);
    }

    handleOnLoad(map) {
        this.setState({
            map: map,
            placesService: new google.maps.places.PlacesService(map.map)
        })
    }

    async handleChange(s) {
        this.setState({
            markers: [],
        })
        if (s.length < 3) return;
        this.setState({
            loading: true
        })
        const movies = await NodeFetch('https://data.sfgov.org/resource/wwmu-gmzc.json?$q=' + encodeURI(s));
        const moviesData = await movies.json();
        if (moviesData.length === 0) {
            this.setState({
                loading: false
            })
            return;
        }
        moviesData.forEach(movie => {
            this.setState({
                loading: true
            })
            this.state.placesService.findPlaceFromQuery({
                query: movie.locations,
                fields: ['name', 'geometry']
            }, (results, status) => {
                if (status === 'OK' && results.length > 0) {
                    results.map((r) => {
                        r.movie = movie.title;
                        r.location = movie.locations;
                        return r;
                    });
                    this.setState({
                        markers: this.state.markers.concat(results)
                    })
                    this.setState({
                        loading: false
                    })
                }
            });
        })
    }

    async handleAutocompleteOnChange(event, value) {
        console.log(value)
        this.setState({
            movieAutocompleteValue: value
        });
        if (value.length < 2) {
            return;
        }
        const movies = await NodeFetch(
            "https://data.sfgov.org/resource/wwmu-gmzc.json?$select=title&$group=title&$where=starts_with(upper(title),upper('" + encodeURI(value) + "'))"
        )
        const moviesData = await movies.json();
        this.setState({
            moviesAutocomplete: moviesData
        });
    }

    render() {
        let sfPoint = {lat: 37.775, lng: -122.450}
        return (
            <div id={"sfMoviesMapComponent"}>
                <div id={"searchBox"}>
                    <div id={"form"}>
                        <span>Movie search &nbsp;</span>
                        <Autocomplete
                            getItemValue={(item) => item.title}
                            items={this.state.moviesAutocomplete}
                            renderItem={(item, highlight) => (
                                <div style={{ background: highlight ? 'lightgray' : 'white' }}>
                                    {item.title}
                                </div>
                            )}
                            onChange={this.handleAutocompleteOnChange}
                            onSelect={(value, item) => {
                                this.setState({
                                    movieAutocompleteValue: value
                                })
                                this.handleChange(value)
                            }}
                            value={this.state.movieAutocompleteValue}
                            menuStyle={{
                                borderRadius: '3px',
                                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                                background: 'rgba(255, 255, 255, 0.9)',
                                padding: '2px 0',
                                fontSize: '90%',
                                position: 'fixed',
                                overflow: 'auto',
                                maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
                                zIndex: '998',
                            }}
                        />
                    </div>
                    <div id={"loading"}>
                    {
                        this.state.loading ?
                            <ReactLoading type={'balls'} color={'orange'} height={32} width={32} />
                            :
                            null
                    }
                    </div>
                </div>
                <div id={"map"}>
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
                                        key={m.geometry.location.lat() + '' + m.geometry.location.lng()}
                                        movie={m.movie}
                                        place={m.name}
                                        location={m.location}
                                        lat={m.geometry.location.lat()}
                                        lng={m.geometry.location.lng()}
                                    />
                                )
                        })}
                    </GoogleMapReact>
                </div>
            </div>
        );
    }
}

export default SfMoviesMap;
