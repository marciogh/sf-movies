/* global google */

import React from 'react';
import GoogleMapReact from 'google-map-react';
import NodeFetch from 'node-fetch';
import ReactLoading from 'react-loading';
import Autocomplete from 'react-autocomplete';

class SfMoviesComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            infoVisible: false
        }
        this.renderOnClick = this.renderOnClick.bind(this)
    }

    renderOnClick() {
        this.setState({
            infoVisible: !this.state.infoVisible
        })
    }

    render() {
        return (
            <div id={"sfMoviesComponent"}>
                <img
                    className={"star"}
                    alt={this.props.location}
                    src={"https://upload.wikimedia.org/wikipedia/commons/8/83/Gold_Star_%28with_border%29.svg"}
                    onClick={this.renderOnClick}
                />
                {
                    this.state.infoVisible ? (
                            <div className={"info"}>
                                Movie: {this.props.movie}<br />
                                Location: {this.props.location} <br />
                                Google Location: {this.props.place}
                            </div>
                    ) : <div />
                }
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
        const movies = await NodeFetch(`https://data.sfgov.org/resource/wwmu-gmzc.json?$where=title='${s}'`)
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
                        markers: this.state.markers.concat(results),
                        loading: false
                    })
                }
            });
        })
    }

    async handleAutocompleteOnChange(event, value) {
        this.setState({
            movieAutocompleteValue: value
        });
        if (value.length < 2) {
            this.setState({
                moviesAutocomplete: []
            });
            return;
        }
        this.setState({
            loading: true,
        });
        const movies = await NodeFetch(
            "https://data.sfgov.org/resource/wwmu-gmzc.json?$select=title&$group=title&$where=starts_with(upper(title),upper('" + encodeURI(value) + "'))"
        )
        const moviesData = await movies.json();
        this.setState({
            loading: false,
            moviesAutocomplete: moviesData
        });
    }

    render() {
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
                                position: 'fixed',
                                overflow: 'auto',
                                maxHeight: '200px',
                                zIndex: '3',
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
                        defaultCenter={{lat: 37.770, lng: -122.430}}
                        defaultZoom={12}
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
