function toRad(degrees) {
    return degrees * Math.PI / 180;
}

function distance({lat1, lon1, lat2, lon2}) {
    var R = 6371; // km 
    var x1 = lat2-lat1;
    var dLat = toRad(x1);  
    var x2 = lon2-lon1;
    var dLon = toRad(x2);  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2);  
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; 

    return d * 1000;
}

module.exports = {
    distance,
}