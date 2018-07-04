/* global google */

import React from 'react';
import GoogleMapReact from 'google-map-react';
import ReactLoading from 'react-loading';
import Autocomplete from 'react-autocomplete';
import SfMoviesWindowComponent from './SfMovieWindowComponent.js'
import SfMoviesDAO from './SfMoviesDAO.js'

class SfMoviesMapComponent extends React.Component {

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
            placesService: new google.maps.places.PlacesService(map.map)
        })
        this.dao = new SfMoviesDAO(this.state.placesService)
    }

    async handleChange(s) {
        this.setState({
            markers: [],
        })
        if (s.length < 3) return;
        this.setState({
            loading: true
        })
        const moviesData = await this.dao.findMovieByTitle(s);
        if (moviesData.length === 0) {
            this.setState({
                loading: false
            })
            return;
        }
        this.setState({
            loading: true
        })
        let promises = [];
        moviesData.forEach(movie => promises.push(this.dao.findMovieLocation(movie)));
        Promise.all(promises).then((results) => {
            let markers = [];
            results
                .filter((v) => v != null)
                .map((v) => v.map((v) => markers.push(v)));
            this.setState({
                markers: markers,
                loading: false
            })
        });
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
        const moviesData = await this.dao.searchMovieByTitle(value);
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
                            <ReactLoading
                                type={'balls'}
                                color={'orange'}
                                height={32}
                                width={32}
                            />
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
                                let lat = m.geometry.location.lat();
                                let lng = m.geometry.location.lng();
                                return (
                                    <SfMoviesWindowComponent
                                        key={lat + '-' + lng}
                                        lat={lat}
                                        lng={lng}
                                        movie={m}
                                    />
                                )
                        })}
                    </GoogleMapReact>
                </div>
            </div>
        );
    }
}

export default SfMoviesMapComponent;
