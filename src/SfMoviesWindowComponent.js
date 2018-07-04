import React from 'react';

class SfMoviesWindowComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            infoVisible: false
        }
        this.movie = props.movie.movie
        this.place = props.movie.name
        this.location = props.movie.location
        this.renderOnClick = this.renderOnClick.bind(this)
    }

    renderOnClick() {
        this.setState({
            infoVisible: !this.state.infoVisible
        })
    }

    render() {
        return (
            <div id={"sfMoviesWindowComponent"}>
                <img
                    className={"star"}
                    alt={this.location}
                    src={"https://upload.wikimedia.org/wikipedia/commons/8/83/Gold_Star_%28with_border%29.svg"}
                    onClick={this.renderOnClick}
                />
                {
                    this.state.infoVisible ? (
                        <div className={"info"}>
                            Movie: {this.movie}<br />
                            Location: {this.location} <br />
                            Google Location: {this.place}
                        </div>
                    ) : <div />
                }
            </div>
        )
    };

};

export default SfMoviesWindowComponent;
