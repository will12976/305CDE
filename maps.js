//Geocoding via Google Maps API http://maps.googleapis.com/maps/api/geocode/output?parameters
var request = require('request')

//https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&sensor=false
//This link above avoids having to use a API Code

exports.search = function(address, callback) {
    
    console.log("Searching, won't take long!")
    if(typeof address !== 'string' || address.length === 0){
        callback({code: 400, response:{status:'error', message:'missing query - enter correct parameters'}})
    }
    const url = 'https://maps.googleapis.com/maps/api/geocode/json'
    const query_string = {a: address, fields: results('address_components'('long_name'))
}