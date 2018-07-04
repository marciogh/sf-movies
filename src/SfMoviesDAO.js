import NodeFetch from 'node-fetch';

var placesService;
var sfMoviesUrl = "https://data.sfgov.org/resource/wwmu-gmzc.json";

class SfMoviesDAO {

    constructor(p) {
        placesService = p;
    }

    findMovieLocation(movie) {
        return new Promise((resolve, reject) => {
            placesService.findPlaceFromQuery({
                query: movie.locations,
                fields: ['name', 'geometry']
            }, (results, status) => {
                if (status === 'OK' && results.length > 0) {
                    results.map((r) => {
                        r.movie = movie.title;
                        r.location = movie.locations;
                        return r;
                    });
                    resolve(results)
                } else {
                    resolve(null);
                }
            });
        });
    }

    findMovieByTitle(title) {
        return NodeFetch(`${sfMoviesUrl}?$where=title='${title}'`)
            .then((r) => r.json())
    }

    searchMovieByTitle(title) {
        return NodeFetch(`${sfMoviesUrl}?$select=title&$group=title&$where=starts_with(upper(title),upper('${title}'))`)
            .then((r) => r.json())
    }

}

export default SfMoviesDAO;
