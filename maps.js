//Geocoding via Google Maps API http://maps.googleapis.com/maps/api/geocode/output?parameters
var request = require('request')

//https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&sensor=false
//This link above avoids having to use a API Code

exports.search = function(query, callback) {
    
    console.log("Searching, won't take long!")
    if(typeof query !== 'string' || query.length === 0){
        callback({code: 400, response:{status:'error', message:'missing query - enter correct parameters', message1: 'Try entering a postcode'}})
    }
    const url = 'https://maps.googleapis.com/maps/api/geocode/json'
    const query_string = {q: query, fields: 'results(address_components)'}
    request.get({url:url, qs: query_string, function(err, res, body){
        if(err){
            callback({code:500, response:{status:'error', message: "Sorry, I am not receiving data at the moment"}})
        }
        console.log(typeof body)
        const json = JSON.parse(body)
        const items = json.items
        const maps = items.map(function(element){
            return {address_components: element.address_components}
        })
        console.log(maps)
        callback({code:200, response:{status:'success', message: 'region found', data:maps}})
    }
    })
}