//Geocoding via Google Maps API http://maps.googleapis.com/maps/api/geocode/output?parameters
var request = require('request')


//https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&sensor=false
//This link above avoids having to use a API Code

exports.search = function(query, callback) {
    
    console.log("Searching, won't take long!")
    if(typeof query !== 'string' || query.length === 0){
        callback({code: 400, response:{status:'error', message:'missing query - enter correct parameters', message1: 'Try entering a postcode'}})
    }
    const url = 'http://www.myapifilms.com/imdb'
    const query_string = {title: query}
    console.log(query_string);
    request.get({url:url, qs: query_string}, function(err, res, body){
        if(err){
            callback({code:500, response:{status:'error', message: "Sorry, I am not receiving data at the moment", data:err}})
        }
        console.log(typeof body)
        const json = JSON.parse(body)
        const film = json.map(function(element) {
            return {'Title': element.title,'Year of Release':element.year, 'Genre':element.genres, 'Directors': element.directors, 'Rated':element.rated, 'Run Time': element.runtime, 'Description': element.plot}
        })
        
        console.log(film)
        callback({code:200, response:{status:'success', message: 'Found the Film! '+query, data:film}})
    }
    )
}
    