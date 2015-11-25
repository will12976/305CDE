//Geocoding via Google Maps API http://maps.googleapis.com/maps/api/geocode/output?parameters
//output can be in JSON or XML format, parameters are the various types of data we can collect, in this case, address.
var request = require('request')

exports.search = function(query, callback) {
    
    console.log("Searching, won't take long!")
    if(typeof query !== 'string' || query.length === 0){
        callback({code: 400, response:{status:'error', message:'missing query - enter correct parameters', message1: 'Try entering a postcode'}})
    }
    const url = 'https://maps.googleapis.com/maps/api/geocode/json'
    const query_string = {address: query}
    console.log(query_string);
    request.get({url:url, qs: query_string}, function(err, res, body){
        if(err){
            callback({code:500, response:{status:'error', message: "Sorry, I am not receiving data at the moment", data:err}})
        }
        console.log(typeof body)
        const json = JSON.parse(body)
        const map = json.results.map(function(element) {
            return {'Address': element.formatted_address, 'Location Type': element.geometry.location_type,'Location': element.geometry.location, 'Place ID':element.place_id}
        })
        console.log(map)
        callback({code:200, response:{status:'success', message: 'Found the Address! '+query, data:map}})
    }
    )
}
    