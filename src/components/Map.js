import React from 'react';
import GoogleMapReact from 'google-map-react';

const Map = ({ location }) => {
    return(
        <GoogleMapReact
            yesIWantToUseGoogleMapApiInternals
            bootstrapURLKeys={{ key: 'AIzaSyCl8D9AOuE9-WyDGMwMnGEFF8N1v8OhO3g' }}
            center={{ lat: location.lat, lng: location.lng }}
            defaultZoom={12}
        />
    );
}

export default Map;
