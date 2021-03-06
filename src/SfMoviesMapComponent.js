/* global google */

import React from 'react';
import GoogleMapReact from 'google-map-react';
import ReactLoading from 'react-loading';
import Autocomplete from 'react-autocomplete';
import SfMoviesWindowComponent from './SfMoviesWindowComponent.js'
import SfMoviesDAO from './SfMoviesDAO.js'

class SfMoviesMapComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            moviesAutocomplete: [],
            markers: [],
            loading: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleOnLoad = this.handleOnLoad.bind(this);
        this.handleAutocompleteOnChange = this.handleAutocompleteOnChange.bind(this);
    }

    handleOnLoad(map) {
        // dao requires google maps placeServices which is only available after maps is loaded
        this.dao = new SfMoviesDAO(new google.maps.places.PlacesService(map.map))
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
            // each promise returns an array of results, have to flatten to a single array
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
            moviesAutocompleteValue: value
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
                                    moviesAutocompleteValue: value
                                })
                                this.handleChange(value)
                            }}
                            value={this.state.moviesAutocompleteValue}
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
