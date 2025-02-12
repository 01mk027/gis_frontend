import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, Polygon, Polyline, useMap, useMapEvents, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import L from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import proj4 from 'proj4';
import { color, reverse } from 'd3';
import { axiosInstance } from '../../axios';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import styles from './MapView.module.css';
import { axiosPrivateInstance } from '../../axios';



function ChangeView({ center, zoom }) {
    
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }




const MapView = ({ geojsonData, mapType, sp, selectedNamespace }) => {
    console.log("sp==>>", sp, "selectedNamespace", selectedNamespace);
    const { t, i18n } = useTranslation();

    const [boundsAtTop, setBoundsAtTop] = useState(null);  
    const [distInX, setDistInX] = useState(null);
    const [path, setPath] = useState("");
//./../projects/MELIKGAZI/KAPI.gpkg
    useState(() => {
        setPath(`./..projects/${sp}`);
    }, [sp])

  const HandlePositionChange = () => {
    // in this function, i need to calculate points from geojsonData (or whatelse) remains in map.getBounds()
    const [north, setNorth] = useState(null);
    const [south, setSouth] = useState(null);
    const [west, setWest] = useState(null);
    const [east, setEast] = useState(null);
    const [reconvertedCoordinates, setReconvertedCoordinates] = useState([]);
    const map = useMapEvents({
        //as increase of zoom value of map, all records are showm, i need to set
        //i need to customize on load event to show some point in map 
        //[0] doğu batı
        //[1] kuzey güney
        load(){
            console.log("Yükle");
        }, 
        zoom(){
            
        },
        drag(){
            //console.log("EAST => ", map.getBounds().getEast());
            //console.log("WEST => ", map.getBounds().getWest());
            //console.log("NORTH => ", map.getBounds().getNorth());
            //console.log("SOUTH => ", map.getBounds().getSouth());
            changeCoords();
        }

        //zoomlandığında yakınsa aynı çerçeve içerisinde olanı göster, zoom out olduğunda ise atıyorum birkaçını göster
        
    });  
    
    const changeCoords = () => {
        setEast(map.getBounds().getEast());
        setWest(map.getBounds().getWest());
        setNorth(map.getBounds().getNorth());
        setSouth(map.getBounds().getSouth());
        
    }

    



    useEffect(() => {
        //console.log("Burada çerçeveyi oluşturabilirsem istediğimi elde etmiş olurum.");       
        changeCoords(); 
    }, [geojsonData]);

    useEffect(() => {
        //console.log(distInX);
    }, [distInX])

    useEffect(() => {
        let bounds = map.getBounds();

        let width = map.distance(bounds.getNorthWest(), bounds.getNorthEast()) / 1000;
        //console.log(width);
        if(width && width <= 0.5)
        {
            setReconvertedCoordinates(convertedCoordinates.filter(item => {
                //if(item[0] > west && item[0] < east){
                return item[0] > west && item[0] < east && item[1] < north && item[1] > south;
            }));
        }
        else if(width && width > 0.5){
            let divider = 1;
            if(convertedCoordinates && convertedCoordinates.length && convertedCoordinates.length > 30000){
                divider = 30;
            }
            else if(convertedCoordinates && convertedCoordinates.length && convertedCoordinates.length > 15000){
                divider = 15;
            }
            else if(convertedCoordinates && convertedCoordinates.length && convertedCoordinates.length > 5000){
                divider = 8;
            }
            else{
                divider = 5;
            }
            setReconvertedCoordinates(
                convertedCoordinates.filter((item, index) => {
                    // Include the original filtering logic
                    const isWithinBounds = item[0] > west && item[0] < east && item[1] < north && item[1] > south;
        
                    // Add additional filtering based on index
                    const isIndexValid = index % divider === 0; // Example: only include items with even indices
        
                    return isWithinBounds && isIndexValid;
                })
            );
        }

    }, [north, south, west, east]);


    useEffect(() => {
        //console.log(reconvertedCoordinates);
    }, [reconvertedCoordinates])

    async function handleImageShow(imageUrl) {
        /*
        console.log("path => ", selectedNamespace+"/"+sp);
        //first of all, download image into a proper folder, and then check its size and show it in a modal
        await axiosPrivateInstance.post('mergintransactions/downloadimage', JSON.stringify({
            project_name: sp,
            image_name: imageUrl
        })).then(async (res) => {console.log(res)}).catch(err => console.error(err));
        */
       alert("To Be Edited...");
    }


    return (
        reconvertedCoordinates && reconvertedCoordinates.map((item, index) => {
            if (geojsonData && geojsonData.features && geojsonData.features.length > 0 && geojsonData.features[index] && geojsonData.features[index].properties) {
                if(geometryType === "Point"){
                return (
                    <>
                    <Marker position={[item[1], item[0]]} icon={assignMarkerIcon(geojsonData.features[index].properties.MONTAJDURUM ? geojsonData.features[index].properties.MONTAJDURUM : geojsonData.features[index].properties.ÉTAT)} key={index}>
                        
                        <Popup className="table-responsive">
                            <table className='table table-bordered'>
                                {Object.keys(rearrangedFeatures[index]).map(it => {
                                    return (
                                        <tr key={it}>
                                            <td>
                                                <strong>{it}</strong>
                                            </td>
                                            <td>
                                                {it === "MONTAJDURUM" || it === "MONTAJDURU" || it === "ÉTAT" ? parseMountageState(rearrangedFeatures[index][it]) : (it.includes("FOTO") || it.includes("PHOTO")) && rearrangedFeatures[index][it] ? 
                                                
                                                <div id={styles.photoShowFrame} onClick={() => handleImageShow(rearrangedFeatures[index][it])}>    
                                                    <FontAwesomeIcon icon={faEye} /> 
                                                </div>
                                                
                                                : rearrangedFeatures[index][it]}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </table>
                        </Popup>
                        
                    </Marker>
                    
                    </>
                );
            }    
        }
        })
    );
  };

  


    useEffect(() => {
        if(mapType === "PLAQUES_POTEAU" || mapType === "POTEAU" || mapType === "PLAQUES_MURALES"){
            i18n.changeLanguage('fr');
        }
        else{
            i18n.changeLanguage('en');
        }
    }, [mapType]);

    useEffect(() => {
        //console.log("TO CHECK SIMILARITY: \n");
        //console.log(geojsonData);
    }, [geojsonData]);



    


    const [epsgType, setEpsgType] = useState("");
    const [proj4Str, setProj4Str] = useState({});
    const [proj4StrTemp, setProj4StrTemp] = useState({});




    useEffect(() => {
        if(geojsonData.crs && geojsonData.crs.properties){
            setEpsgType(geojsonData.crs.properties.name.split(":")[geojsonData.crs.properties.name.split(":").length - 1]);
            
            fetch(`https://epsg.io/${geojsonData.crs.properties.name.split(":")[geojsonData.crs.properties.name.split(":").length - 1]}.proj4`)
            .then(resp => {
                
                //console.log("epsgType = ", epsgType);
                return resp.text(); // Parse the response as text
              })
              .then(data => {
                //console.log("Response Data: ", data); // Actual response data
                
                setProj4Str({
                    type: `EPSG:${geojsonData.crs.properties.name.split(":")[geojsonData.crs.properties.name.split(":").length - 1]}`,
                    settings: data
                })
              })
              .catch(err => console.log("Error: ", err));

        }
    } ,[geojsonData.crs]);
    //proj4.defs("EPSG:5256","+proj=tmerc +lat_0=0 +lon_0=36 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
    


    /*
    useEffect(() => {
        if(epsgType === "5256"){
            setProj4Str({
                type: "EPSG:5256",
                settings: "+proj=tmerc +lat_0=0 +lon_0=36 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
            })
        }
        else if(epsgType === "32630"){
            setProj4Str({
                type: "EPSG:32630",
                settings: "+proj=utm +zone=30 +datum=WGS84 +units=m +no_defs"
            })
        }


    }, [epsgType])
*/


    proj4.defs(proj4Str.type, proj4Str.settings);
    

/*
    proj4.defs(
        "EPSG:32630",
        "+proj=utm +zone=30 +datum=WGS84 +units=m +no_defs"
    );
*/
        
    const [markerColor, setMarkerColor] = useState('');
    const [geometryType, setGeometryType] = useState('');
    const [reversedConvertedCoordinates, setReversedConvertedCoordinates] = useState([]);
    const [cons, setCons] = useState([]);
    const [firstLat, setFirstLat] = useState(0);
    const [firstLong, setFirstLong] = useState(0);
    const [centerCoord, setCenterCoord] = useState([34.80746, -40.4796]);

    // Memoize convertedCoordinates and rearrangedFeatures
    
    
    const { convertedCoordinates, rearrangedFeatures } = useMemo(() => {
        
        const newConvertedCoordinates = [];
        const newRearrangedFeatures = [];
        if (!proj4Str?.type || !proj4Str?.settings) {
            return { convertedCoordinates: [], rearrangedFeatures: [] };
        }
    
    
        if (geojsonData.features) {
            console.log(geojsonData.features);
            geojsonData.features.forEach((coord) => {
                if(coord.properties)
                    newRearrangedFeatures.push(coord.properties);
                //const [x, y] = coord.geometry.coordinates;//Direk, Duvar, Kapı, Kapı2
                //console.log(coord.geometry.type);
                let [x, y] = [];
                //console.log(coord.geometry.type);
                if(coord.geometry && coord.geometry.type && coord.geometry.type === "Point")
                {
                    [x, y] = coord.geometry.coordinates;
                    //coord.geometry.coordinates.map(item => console.log(item));
                }
                
                else if(coord.geometry && coord.geometry.type && coord.geometry.type === "MultiLineString"){
                    //coord.geometry.coordinates.map; // produces [0,1] 2d array, in YOLLAR produces [[0, 1], [0, 1]]
                    coord.geometry.coordinates.map(item => item.map(it => {
                        [x, y] = it;
                    }));
                }
                else if(coord.geometry && coord.geometry.type && coord.geometry.type === "MultiPolygon")
                {
                    coord.geometry.coordinates.map(item => item.map(it => {
                        it.map(i => {
                            [x, y] = i;
                        })
                    }));
                }
                //console.log(coord.geometry.type);
                if(coord.geometry && coord.geometry.type)
                    setGeometryType(coord.geometry.type);
                //console.log("coord.geometry.type == >> ", coord.geometry.type);
                 
                // Check if x and y are finite numbers
                if (isFinite(x) && isFinite(y)) {
                    
                    //const converted = proj4("EPSG:5256", "EPSG:4326", [x, y]);
                    //const converted = proj4("EPSG:32630", "EPSG:4326", [x, y]);
                    const converted = proj4(proj4Str.type, "EPSG:4326", [x, y]);
                    newConvertedCoordinates.push(converted);
                } else {
                    //console.error("Invalid coordinates:", coord.geometry.coordinates);
                }
            });
        }
    
        return { convertedCoordinates: newConvertedCoordinates, rearrangedFeatures: newRearrangedFeatures };
    }, [geojsonData, proj4Str]);
    

    useEffect(() => {
        //console.log("rearrangedFeatures");
        //console.log(rearrangedFeatures);
    }, [rearrangedFeatures])
    

    const parseMountageState = (n) => {
        if(n === "1"){
            return t('willBeMounted');
        }
        else if(n === "2" || n === "4"){
            return t('mounted');
        }
        else if(n === "3") {
            return t('notMounted');
        }
    };



    // Function to assign color based on the feature's MONTAJDURUM property
    const getMarkerColor = (id) => {
        if (id === "1") return "red";
        if (id === "2") return "green";
        if (id === "3") return "blue";
        if (id === "4") return "yellow";
        return "black"; // Default color
    };

    const assignMarkerIcon = (id) => {
        const markerColor = getMarkerColor(id);
        const markerHtmlStyles = `
            background-color: ${markerColor};
            width: 0.99rem;
            height: 0.99rem;
            display: block;
            left: -0.75rem;
            top: -0.75rem;
            position: relative;
            border-radius: 50%;
            border: 1px solid #FFFFFF;
        `;

        return divIcon({
            html: `<div style="${markerHtmlStyles}"></div>`,  // Include styles directly into HTML
            className: ''  // Prevent leaflet from applying any default styles
        });
    };

    useEffect(() => {

        if(convertedCoordinates && convertedCoordinates.length > 0)
        {
            
            //console.log(convertedCoordinates[0]['1'], convertedCoordinates[0]['0']);
            setFirstLat(convertedCoordinates[0]['1']);
            setFirstLong(convertedCoordinates[0]['0']);
            setCenterCoord([convertedCoordinates[0]['1'], convertedCoordinates[0]['0']]);
        }
    }, [convertedCoordinates]);


    useEffect(() => {
        //console.log(centerCoord);
    }, [centerCoord])

    return (
        <MapContainer center={centerCoord && centerCoord} zoom={4} style={{ height: "100vh" }} dragging={true}>
            <ChangeView center={centerCoord && centerCoord} zoom={16} />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            
            />
            
            <HandlePositionChange/>    
            
            
            
            
            <GeoJSON data={geojsonData} />
            
        </MapContainer>
    );
};

export default MapView;
