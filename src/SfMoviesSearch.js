import React from 'react';

class SfMoviesSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {searchString: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
        const {google} = mapProps;
        const service = new google.maps.places.PlacesService(map);
        event.preventDefault();
    }

    handleChange(event) {
        console.log(event.target.value)
        this.setState({searchString: event.target.value});
    }

    render() {
        return (
            <div style={{position: 'absolute', top: '50px', left: '50px', width: '100px', height: '50px'}}>
            <form onSubmit={this.handleSubmit}>
                <input type="text" value={this.state.searchString} onChange={this.handleChange}/>
                <input type="submit" />
            </form>
            </div>
        );
    }
}

export default SfMoviesSearch;
