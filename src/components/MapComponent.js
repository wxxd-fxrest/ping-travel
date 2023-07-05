import { useEffect, useState } from "react";
import { Map } from "react-kakao-maps-sdk";


const MapComponent = () => {
    const { kakao } = window;
    // eslint-disable-next-line no-unused-vars
    const [map, setMap] = useState(null);

    useEffect(()=>{
        const container = document.getElementById('map');
        const options = { center: new kakao.maps.LatLng(33.450701, 126.570667)};
        const kakaoMap = new kakao.maps.Map(container, options);
        setMap(kakaoMap);
    },[kakao.maps.LatLng, kakao.maps.Map])

    return (
        <Map id='map' 
            center={{ lat: 37.566826, lng: 126.9786567 }}
            level={3}
            style={{ width: '100%', height: '400px' }}>
        </Map>
    ) ;
} ; 

export default MapComponent;