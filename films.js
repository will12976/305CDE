var request = require('request')

//http://www.myapifilms.com/imdb?title=Jaws
//This link above avoids having to use a API Code

exports.search = function(query, callback) {
    
    console.log("Searching, won't take long!")
    if(typeof query !== 'string' || query.length === 0){
        callback({code: 400, response:{status:'error', message:'missing query - enter correct parameters', message1: 'Try entering a postcode'}})
    }
    const url = 'http://www.myapifilms.com/imdb'
    const query_string = {title: query, limit: 5}
    console.log(query_string);
    request.get({url:url, qs: query_string}, function(err, res, body){
        if(err){
            callback({code:500, response:{status:'error', message: "Sorry, I am not receiving data at the moment", data:err}})
        }
        console.log(typeof body)
        const json = JSON.parse(body)
        const film = json.map(function(element) {
            return {'title': element.title,'year':element.year, 'genre':element.genres, 'directors': element.directors, 'rated':element.rated, 'time': element.runtime, 'description': element.simplePlot, 'poster': element.urlPoster, 'plot': element.plot, 'rating': element.rating, 'id': element.idIMDB, 'metascore': element.metascore }
        })
        
        console.log(film)
        callback({code:200, response:{status:'success', message: 'Found the Film! '+query, data:film}})
    }
    )
}
    