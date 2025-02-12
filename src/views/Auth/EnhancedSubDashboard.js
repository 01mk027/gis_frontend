import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './EnhancedSubDashboard.module.css'
import moment from "moment";
import BarChart from './BarChart';
import PieChart from './PieChart';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { axiosPrivateInstance } from '../../axios';
import MapView from './MapView';
import { useTranslation } from 'react-i18next';
import { faFileExcel } from '@fortawesome/free-regular-svg-icons';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as XLSX from 'xlsx';

import { jsPDF } from "jspdf";
import "jspdf-autotable";

/*
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: 300 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf", fontWeight: 500 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 600 },
  ],
})

const styleOfPdf = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    backgroundColor: "#ffffff",
    padding: 24,
  }
})
*/








function EnhancedSubDashboard({ data, files, selectedProject, selectedNamespace }) {
    console.log(selectedNamespace);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };
    const [isMapTypeSelected, setIsMapTypeSelected] = useState(false);
    const [mapType, setMapType] = useState("-1");
    const [path, setPath] = useState("");
    const [fileNames, setFileNames] = useState([]);
    const [partialPath, setPartialPath] = useState("");
    const [sp, setSp] = useState(selectedProject);
    const [allDoorFeatures, setAllDoorFeatures] = useState([]);
    const [allWallFeatures, setAllWallFeatures] = useState([]);
    const [allPoleFeatures, setAllPoleFeatures] = useState([]);
    const [notMountedDoors, setNotMountedDoors] = useState([]);
    const [willBeMountedDoors, setWillBeMountedDoors] = useState([]);
    const [editedDoors, setEditedDoors] = useState([]);
    const [mountedDoors, setMountedDoors] = useState([]);
    const [notMountedPoles, setNotMountedPoles] = useState([]);
    const [willBeMountedPoles, setWillBeMountedPoles] = useState([]);
    const [editedPoles, setEditedPoles] = useState([]);
    const [mountedPoles, setMountedPoles] = useState([]);
    const [notMountedWalls, setNotMountedWalls] = useState([]);
    const [willBeMountedWalls, setWillBeMountedWalls] = useState([]);
    const [editedWalls, setEditedWalls] = useState([]);
    const [mountedWalls, setMountedWalls] = useState([]);
    const [grouppedDoorMountagesWrtDate, setGrouppedDoorMountageWrtDate] = useState();
    const [grouppedWallMountagesWrtDate, setGrouppedWallMountageWrtDate] = useState();
    const [grouppedPoleMountagesWrtDate, setGrouppedPoleMountageWrtDate] = useState();
    const [grouppedPlaquesMurales, setGrouppedPlaquesMurales] = useState();
    const [grouppedPlaquesPoteau, setGrouppedPlaquesPoteau] = useState();
    const [grouppedPoteau, setGrouppedPoteau] = useState();


    const [newMapOrGraph, setNewMapOrGraph] = useState("-1");
    const [newIsMapOrGraphSelected, setNewIsMapOrGraphSelected] = useState(false);


    const [numberOfMountedDoorYest, setNumberOfMountedDoorYest] = useState(0);
    const [numberOfMountedDoorTod, setNumberOfMountedDoorTod] = useState(0);
    const [numberOfEditedDoorYest, setNumberOfEditedDoorYest] = useState(0);
    const [numberOfEditedDoorTod, setNumberOfEditedDoorTod] = useState(0);
    const [numberOfMountedPoleYest, setNumberOfMountedPoleYest] = useState(0);
    const [numberOfMountedPoleTod, setNumberOfMountedPoleTod] = useState(0);
    const [numberOfMountedWallYest, setNumberOfMountedWallYest] = useState(0);
    const [numberOfMountedWallTod, setNumberOfMountedWallTod] = useState(0);
    const [plaquesMuralesTod, setPlaquesMuralesTod] = useState(0);
    const [plaquesMuralesYest, setPlaquesMuralesYest] = useState(0);
    const [plaquesPoteauTod, setPlaquesPoteauTod] = useState(0);
    const [plaquesPoteauYest, setPlaquesPoteauYest] = useState(0);
    const [poteauTod, setPoteauTod] = useState(0);
    const [poteauYest, setPoteauYest] = useState(0);
    const [graphForm, setGraphForm] = useState("-1");
    const [graphData, setGraphData] = useState([]);
    const [graphCaption, setGraphCaption] = useState("");
    const [docType, setDocType] = useState("");
    const [isDocTypeSelected, setIsDocTypeSelected] = useState(false);
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [propertiesOfSelectedRecords, setPropertiesOfSelectedRecords] = useState([]);
    const [featuresOfSelectedRecords, setFeaturesOfSelectedFeatures] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const [filterValueForStaff, setFilterValueForStaff] = useState("");
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [isFilteredByMountageState, setisFilteredByMountageState] = useState(false);
    const [isFilteredByStaff, setIsFilteredByStaff] = useState(false);
    const [filterWrtMountageState, setFilterWrtMountageState] = useState(-1);
    const [filterWrtStaff, setFilterWrtStaff] = useState(-1);
    const [stuffForSelectedRecords, setStuffForSelectedRecords] = useState([]);
    const [areas, setAreas] = useState([]);
    const [areaValue, setAreaValue] = useState("-1");
    const [isFilteredByArea, setIsFilteredByArea] = useState(false);
    const [temp, setTemp] = useState([]);
    const [anotherTemp, setAnotherTemp] = useState([]);
    const [filteredMountageRecords, setFilteredMountageRecords] = useState([]);
    const [filteredStaffRecords, setFilteredStaffRecords] = useState([]);
    const [filteredAreaRecords, setFilteredAreaRecords] = useState([]);
    const [filteredDateRecords, setFilteredDateRecords] = useState([]);
    const [isFilteredByDate, setIsFilteredByDate] = useState(false);
    const [arrayBox, setArrayBox] = useState([]);
    const [firstDate, setFirstDate] = useState("");
    const [secondDate, setSecondDate] = useState("");
    const [dateIntervalArray, setDateIntervalArray] = useState([]);
    const [computedDocType, setComputedDocType] = useState("");
    const [mapHtmlContent, setMapHtmlContent] = useState("");
    const [geoData, setGeoData] = useState("");
    const [showCanvas, setShowCanvas] = useState(false);
    const [allOfItemsOfData, setAllOfItemsOfData] = useState(data);
    const [notFoundItems, setNotFoundItems] = useState([]);
    const [computedAllOfItemsOfData, setComputedAllOfItemsOfData] = useState([]);
    const [showFrenchItems, setShowFrenchItems] = useState(false);
    //plaques_murales
    //plaques_poteau
    //poteau
    const [plaquesMurales, setPlaquesMurales] = useState([]);
    const [mountedPlaquesMurales, setMountedPlaquesMurales] = useState([]);
    const [willBeMountedPlaquesMurales, setWillBeMountedPlaquesMurales] = useState([]);
    const [notMountedPlaquesMurales, setNotMountedPlaquesMurales] = useState([]);
    const [editedPlaquesMurales, setEditedPlaquesMurales] = useState([]);


    const [plaquesPoteau, setPlaquesPoteau] = useState([]);
    const [mountedPlaquesPoteau, setMountedPlaquesPoteau] = useState([]);
    const [willBeMountedPlaquesPoteau, setWillBeMountedPlaquesPoteau] = useState([]);
    const [notMountedPlaquesPoteau, setNotMountedPlaquesPoteau] = useState([]);
    const [editedPlaquesPoteau, setEditedPlaquesPoteau] = useState([]);




    const [poteau, setPoteau] = useState([]);
    const [mountedPoteau, setMountedPoteau] = useState([]);
    const [willBeMountedPoteau, setWillBeMountedPoteau] = useState([]);
    const [notMountedPoteau, setNotMountedPoteau] = useState([]);
    const [editedPoteau, setEditedPoteau] = useState([]);
    const [mapDataForSelectedRecords, setMapDataForSelectedRecords] = useState("");

    const [showFilteredRecordsOnMapCheck, setShowFilteredRecordsOnMapCheck] = useState(false);
    const [showFiltereRecordsOnMap, setShowFilteredRecordsOnMap] = useState(false);

    const [compressedGeoJsonData, setCompressedGeoJsonData] = useState("");
    const [compressedMapDataForFilter, setCompressedMapDataForFilter] = useState("");

    //filteredMountageRecords, filteredStuffRecords, filteredAreaRecords




    /*
setFilteredRecords(selectedRecords.filter(item => item.properties.MONTAJDURUM === String(filterValue)));
setFilteredRecords(propertiesOfSelectedRecords.filter(item => item.MONTAJYAPAN = filterValueForStaff));
setFilteredRecords(propertiesOfSelectedRecords.filter(item => item.MAHALLE = areaValue));
*/

    const parseMountageState = (n) => {
        if (n === "1") {
            return t('willBeMounted');
        }
        else if (n === "2") {
            return t('mounted');
        }
        else if (n === "3") {
            return t('notMounted');
        }
    }

    /*
        useEffect(() => {
            console.log('data on mount:', data);
    
            // Check if KAPI.gpkg exists in the data array
            let kapiFound = false;
            let allOfItemsOfDataArr = [];
            for (let i = 0; i < data.length; i++) {
                allOfItemsOfDataArr.push(data[i]);
                if (data[i].fileName === "DUVAR_TABELA.gpkg" && data[i].data.data.DUVAR_TABELA.features) {
                    setAllWallFeatures(data[i].data.data.DUVAR_TABELA.features);
                } else if (data[i].fileName === "KAPI.gpkg" && data[i].data.data.KAPI.features) {
                    setAllDoorFeatures(data[i].data.data.KAPI.features);
                    kapiFound = true; // Mark KAPI as found
                } else if (data[i].fileName === "DIREK.gpkg" && data[i].data.data.DIREK.features) {
                    setAllPoleFeatures(data[i].data.data.DIREK.features);
                }
            }
    
            // Optionally handle cases where KAPI.gpkg is not found
            if (!kapiFound) {
                console.log('KAPI.gpkg not found in data');
            }
    
        }, [data]);
    */
    useEffect(() => {
        setComputedAllOfItemsOfData(allOfItemsOfData);
        if (files.files && allOfItemsOfData && Math.abs(files.files.length - allOfItemsOfData.length) > 0 && Math.abs(files.files.length - allOfItemsOfData.length) < 3) {
            //console.log(`${Math.abs(files.files.length - allOfItemsOfData.length)} adet dosya eksik, hangisi olduğunu bul, o dosyanın içeriğini allOfItemsOfData state'ine ekle...`);
            /*console.log("files");
            console.log(files);
            console.log("allOfItemsOfData");
            console.log(allOfItemsOfData);*/
            const arrayOfFiles = files.files;
            let arrayOfAllOfItems = [];
            for (let i = 0; i < allOfItemsOfData.length; i++) {
                arrayOfAllOfItems.push(allOfItemsOfData[i].fileName);
            }
            arrayOfFiles.filter(element => !arrayOfAllOfItems.includes(element)).map(item => {
                setNotFoundItems([...notFoundItems, item]);
            })
        }

    }, [allOfItemsOfData])

    /*
        function cleanDateValues(obj) {
            const datePattern = /\b\d{2}\.\d{2}\.\d{4}(?:_\d{2}\.\d{2})?\b/; // Matches dates like "16.07.2024" or "16.07.2024_13.04"
        
            function traverseAndClean(object) {
                for (const key in object) {
                    if (typeof object[key] === "string" && datePattern.test(object[key])) {
                        // Clean the date value by removing the `_` character
                        object[key] = object[key].replace('_', '-');
                    } else if (typeof object[key] === "object" && object[key] !== null) {
                        // Recursively traverse nested objects
                        traverseAndClean(object[key]);
                    }
                }
            }
        
            traverseAndClean(obj);
            return obj; // Return the updated object
        }
    */
    function catchDate(obj) {
        const datePattern = /\b\d{2}\.\d{2}\.\d{4}(?:_\d{2}\.\d{2})?\b/; // Matches dates like "16.07.2024" or "16.07.2024_13.04"
        //console.log(obj);
        for (let key in obj) {
            //console.log(obj[key]);
            if (datePattern.test(obj[key])) {
                if (obj[key].length > 10) {
                    //return date and hour
                    //console.log("Irregular date, must be edited!");
                    if (obj[key].includes("_")) {
                        let date = obj[key].split("_")[0];
                        let hour = obj[key].split("_")[1];
                        //console.log(date);
                        //console.log(hour);
                        //return date and hour
                        return [date, hour];
                    }
                }
                else {
                    //return only date
                    return obj[key];
                }
                //return datePattern.test(obj[key]);
            }
        }
        //traverseAndClean(obj);
        // Return the updated object
    }

    useEffect(() => {
        if (files.files && computedAllOfItemsOfData && Math.abs(computedAllOfItemsOfData.length - files.files.length) < 3) {
            for (let i = 0; i < computedAllOfItemsOfData.length; i++) {
                if (computedAllOfItemsOfData[i].fileName === "KAPI.gpkg") {
                    //console.log("KAPI");
                    console.log(computedAllOfItemsOfData[i].data.data.KAPI.features);
                    /*
                    computedAllOfItemsOfData[i].data.data.KAPI.features = computedAllOfItemsOfData[i].data.data.KAPI.features.map(item => {
                        //diziyse iki ayrı key ekle : MONTAJTARIH ve MONTAJSAAT
                        
                        if (Array.isArray(catchDate(item.properties))) {
                            item.properties.MONTAJTARIH = catchDate(item.properties)[0];
                            item.properties.MONTAJSAAT = catchDate(item.properties)[1];
                            item.properties.MONTAJDURUM = String(Math.floor(Math.random() * 4) + 1);
                            //console.log("Yeni keyler eklendi");
                            return item;
                        }
                        else {
                            //console.log("Luzum görülmedi");
                            return item;
                        }
                        //değilse şimdilik olduğu gibi bırak

                        //item.MONTAJDURUM = Math.random(Math.floor() * 4);
                    });
*/
                    //                    console.log(computedAllOfItemsOfData[i].data.data[Object.keys(computedAllOfItemsOfData[i].data.data)].features);
                    setAllDoorFeatures(computedAllOfItemsOfData[i].data.data.KAPI.features);
                }
                else if (computedAllOfItemsOfData[i].fileName === "DIREK.gpkg") {
                    //console.log("DIREK");
                    setAllPoleFeatures(computedAllOfItemsOfData[i].data.data.DIREK.features);
                }
                else if (computedAllOfItemsOfData[i].fileName === "DUVAR_TABELA.gpkg") {
                    //console.log("DUVAR_TABELA");
                    setAllWallFeatures(computedAllOfItemsOfData[i].data.data.DUVAR_TABELA.features);
                }
                else if (computedAllOfItemsOfData[i].fileName === "PLAQUES_POTEAU.gpkg") {
                    //console.log("PL_PT");
                    //console.log(computedAllOfItemsOfData[i].data.data.PLAQUES_POTEAU.features);
                    setPlaquesPoteau(computedAllOfItemsOfData[i].data.data.PLAQUES_POTEAU.features);
                }
                else if (computedAllOfItemsOfData[i].fileName === "POTEAU.gpkg") {
                    //console.log("PT");
                    //console.log(computedAllOfItemsOfData[i].data.data.POTEAU.features);
                    setPoteau(computedAllOfItemsOfData[i].data.data.POTEAU.features);
                }
                else if (computedAllOfItemsOfData[i].fileName === "PLAQUES_MURALES.gpkg") {
                    //console.log("PL_MUR");
                    //console.log(computedAllOfItemsOfData[i].data.data.PLAQUES_MURALES.features);
                    setPlaquesMurales(computedAllOfItemsOfData[i].data.data.PLAQUES_MURALES.features);
                    //setPlaquesMurales(ii);
                }


            }
            //console.log("computedAllOfItemsOfData");
            //console.log(computedAllOfItemsOfData);
        }
    }, [computedAllOfItemsOfData])


    useEffect(() => {
        //console.log(notFoundItems);
        //buradan devam... 11.11.2024 10:56:XX
        notFoundItems.map(item => {
            let path = `./../projects/${selectedProject}/${item}`;
            axiosPrivateInstance.post('mergintransactions/returnfilecontent', JSON.stringify({
                path: path
            })).then(res => {
                //console.log(res.data);
                setAllOfItemsOfData([...allOfItemsOfData, {
                    fileName: item,
                    data: res.data
                }])
            }).catch(err => {
                console.error(err);
            });
        })
    }, [notFoundItems])


    useEffect(() => {
        console.log(allDoorFeatures);
        setEditedDoors(allDoorFeatures.filter(item => item.properties.MONTAJDURUM === '4'));
        setNotMountedDoors(allDoorFeatures.filter(item => item.properties.MONTAJDURUM === '3'));
        setMountedDoors(allDoorFeatures.filter(item => item.properties.MONTAJDURUM === '2'));
        setWillBeMountedDoors(allDoorFeatures.filter(item => item.properties.MONTAJDURUM === '1'));
        let allDoorProperties = [];
        for (let i = 0; i < allDoorFeatures.length; i++) {
            allDoorProperties.push(allDoorFeatures[i].properties);
        }
        setGrouppedDoorMountageWrtDate(Object.groupBy(allDoorProperties, (item) => `${item.MONTAJTARIH}-${item.MONTAJDURUM}`));

    }, [allDoorFeatures]);


    useEffect(() => {
        setEditedPoles(allPoleFeatures.filter(item => item.properties.MONTAJDURUM === '4'));
        setNotMountedPoles(allPoleFeatures.filter(item => item.properties.MONTAJDURUM === '3'));
        setMountedPoles(allPoleFeatures.filter(item => item.properties.MONTAJDURUM === '2'));
        setWillBeMountedPoles(allPoleFeatures.filter(item => item.properties.MONTAJDURUM === '1'));
        let allPoleProperties = [];
        for (let i = 0; i < allPoleFeatures.length; i++) {
            allPoleProperties.push(allPoleFeatures[i].properties);
        }
        setGrouppedPoleMountageWrtDate(Object.groupBy(allPoleProperties, (item) => `${item.MONTAJTARIH}-${item.MONTAJDURUM}`));
    }, [allPoleFeatures]);


    useEffect(() => {
        setEditedWalls(allWallFeatures.filter(item => item.properties.MONTAJDURUM === '4'));
        setNotMountedWalls(allWallFeatures.filter(item => item.properties.MONTAJDURUM === '3'));
        setMountedWalls(allWallFeatures.filter(item => item.properties.MONTAJDURUM === '2'));
        setWillBeMountedWalls(allWallFeatures.filter(item => item.properties.MONTAJDURUM === '1'));
        let allWallProperties = [];
        for (let i = 0; i < allWallFeatures.length; i++) {
            allWallProperties.push(allWallFeatures[i].properties);
        }
        setGrouppedWallMountageWrtDate(Object.groupBy(allWallProperties, (item) => `${item.MONTAJTARIH}-${item.MONTAJDURUM}`));
    }, [allWallFeatures])

    useEffect(() => {
        if (showFrenchItems) {
            setEditedPlaquesMurales(plaquesMurales.filter(item => item.properties.ÉTAT === '4'));
            setNotMountedPlaquesMurales(plaquesMurales.filter(item => item.properties.ÉTAT === '3'));
            setMountedPlaquesMurales(plaquesMurales.filter(item => item.properties.ÉTAT === '2'));
            setWillBeMountedPlaquesMurales(plaquesMurales.filter(item => item.properties.ÉTAT === '1'));
        }

        let allPlaquesMurales = [];
        for (let i = 0; i < plaquesMurales.length; i++) {
            allPlaquesMurales.push(plaquesMurales[i].properties);
        }
        setGrouppedPlaquesMurales(Object.groupBy(allPlaquesMurales, (item) => `${item.HISTOIRE}-${item.ÉTAT}`));
    }, [plaquesMurales, showFrenchItems]);



    useEffect(() => {
        if (showFrenchItems) {
            setEditedPlaquesPoteau(plaquesPoteau.filter(item => item.properties.ÉTAT === '4'));
            setNotMountedPlaquesPoteau(plaquesPoteau.filter(item => item.properties.ÉTAT === '3'));
            setMountedPlaquesPoteau(plaquesPoteau.filter(item => item.properties.ÉTAT === '2'));
            setWillBeMountedPlaquesPoteau(plaquesPoteau.filter(item => item.properties.ÉTAT === '1'));
        }
        let allPlaquesPoteau = [];
        for (let i = 0; i < plaquesPoteau.length; i++) {
            allPlaquesPoteau.push(plaquesPoteau[i].properties);
        }
        setGrouppedPlaquesPoteau(Object.groupBy(allPlaquesPoteau, (item) => `${item.HISTOIRE}-${item.ÉTAT}`));
    }, [plaquesPoteau, showFrenchItems]);



    useEffect(() => {
        if (showFrenchItems) {
            setEditedPoteau(plaquesPoteau.filter(item => item.properties.ÉTAT === '4'));
            setNotMountedPoteau(plaquesPoteau.filter(item => item.properties.ÉTAT === '3'));
            setMountedPoteau(plaquesPoteau.filter(item => item.properties.ÉTAT === '2'));
            setWillBeMountedPoteau(plaquesPoteau.filter(item => item.properties.ÉTAT === '1'));
        }
        let allPoteau = [];
        if (poteau.length && poteau.length > 0) {
            for (let i = 0; i < poteau.length; i++) {
                if (poteau[i] && poteau[i].properties) {
                    allPoteau.push(poteau[i].properties);
                }
                else {
                    allPoteau.push("");
                }
            }
        }
        setGrouppedPoteau(Object.groupBy(allPoteau, (item) => `${item.HISTOIRE}-${item.ÉTAT}`));
    }, [poteau, showFrenchItems]);



    const [isMapOrGraphSelectionAttempted, setIsMapOrGraphSelectionAttempted] = useState(false);
    const [mapOrGraph, setMapOrGraph] = useState("");
    const [isGraphTypeSelected, setIsGraphTypeSelected] = useState(false);
    const [graphType, setGraphType] = useState("-1");

    const handleGraphOrMapSelection = (e) => {
        setIsMapOrGraphSelectionAttempted(true);
        setMapOrGraph(e.target.value);
        setMapType("-1");
        setShowCanvas(false);
    }


    const handleGraphSketch = (e) => {
        setIsGraphTypeSelected(true);
        setGraphType(e.target.value);
        if (e.target.value !== "-1") {
            setMapType("-1");
            setShowCanvas(true);
        }
    }


    useEffect(() => {
        setGraphData([]);
        setGraphForm("");
        setGraphCaption("");
        if (graphType === "overalldoor") {
            setGraphForm("barchart");
            setGraphCaption(t('enhancedSubDashboardOverAllDoor'));
            let dataOverall = [];
            dataOverall.push({ name: t('willBeMounted'), value: willBeMountedDoors.length });
            dataOverall.push({ name: t('mounted'), value: mountedDoors.length });
            dataOverall.push({ name: t('notMounted'), value: notMountedDoors.length });
            dataOverall.push({ name: t('edited'), value: editedDoors.length });
            setGraphData(dataOverall);
        }
        else if (graphType === "overallwall") {
            setGraphForm("barchart");
            setGraphCaption(t('enhancedSubDashboardOverAllWall'))
            let dataOverall = [];
            dataOverall.push({ name: t('willBeMounted'), value: willBeMountedWalls.length });
            dataOverall.push({ name: t('mounted'), value: mountedWalls.length });
            dataOverall.push({ name: t('notMounted'), value: notMountedWalls.length });
            dataOverall.push({ name: t('edited'), value: editedWalls.length });
            setGraphData(dataOverall);
        }
        else if (graphType === "overallpole") {
            setGraphForm("barchart");
            setGraphCaption(t('enhancedSubDashboardOverAllPole'))
            let dataOverall = [];
            dataOverall.push({ name: t('willBeMounted'), value: willBeMountedPoles.length });
            dataOverall.push({ name: t('mounted'), value: mountedPoles.length });
            dataOverall.push({ name: t('notMounted'), value: notMountedPoles.length });
            dataOverall.push({ name: t('edited'), value: editedPoles.length });
            setGraphData(dataOverall);
        }
        else if (graphType === "poveralldoor") {
            setGraphForm("piechart");
            setGraphCaption(t('enhancedSubDashboardPoverAllDoor'));
            let dataOverall = [];
            dataOverall.push({ name: t('willBeMounted'), value: willBeMountedDoors.length });
            dataOverall.push({ name: t('mounted'), value: mountedDoors.length });
            dataOverall.push({ name: t('notMounted'), value: notMountedDoors.length });
            dataOverall.push({ name: t('edited'), value: editedDoors.length });
            setGraphData(dataOverall);
        }
        else if (graphType === "poverallwall") {
            setGraphForm("piechart");
            setGraphCaption(t('enhancedSubDashboardPoverAllWall'))
            let dataOverall = [];
            dataOverall.push({ name: t('willBeMounted'), value: willBeMountedWalls.length });
            dataOverall.push({ name: t('mounted'), value: mountedWalls.length });
            dataOverall.push({ name: t('notMounted'), value: notMountedWalls.length });
            dataOverall.push({ name: t('edited'), value: editedWalls.length });
            setGraphData(dataOverall);
        }
        else if (graphType === "poverallpole") {
            setGraphForm("piechart");
            setGraphCaption(t('enhancedSubDashboardPoverAllPole'))
            let dataOverall = [];
            dataOverall.push({ name: t('willBeMounted'), value: willBeMountedPoles.length });
            dataOverall.push({ name: t('mounted'), value: mountedPoles.length });
            dataOverall.push({ name: t('notMounted'), value: notMountedPoles.length });
            dataOverall.push({ name: t('edited'), value: editedPoles.length });
            setGraphData(dataOverall);
        }

        else if (graphType === "overallplqpot") {
            setGraphForm("barchart");
            setGraphCaption('Tableau des plaques postales (graphique à barres)')
            let dataOverall = [];
            dataOverall.push({ name: 'Sera Porté', value: willBeMountedPlaquesPoteau.length });
            dataOverall.push({ name: 'Monte', value: mountedPlaquesPoteau.length });
            dataOverall.push({ name: 'Non assemblé', value: notMountedPlaquesPoteau.length });
            dataOverall.push({ name: 'Édité', value: editedPlaquesPoteau.length });
            setGraphData(dataOverall);
        }

        else if (graphType === "overallplqmur") {
            setGraphForm("barchart");
            setGraphCaption('Tableau des plaques murales (graphique à barres)')
            let dataOverall = [];
            dataOverall.push({ name: 'Sera Porté', value: willBeMountedPlaquesMurales.length });
            dataOverall.push({ name: 'Monte', value: mountedPlaquesMurales.length });
            dataOverall.push({ name: 'Non assemblé', value: notMountedPlaquesMurales.length });
            dataOverall.push({ name: 'Édité', value: editedPlaquesMurales.length });
            setGraphData(dataOverall);
        }

        else if (graphType === "overallpoteau") {
            setGraphForm("barchart");
            setGraphCaption('Tableau des poteau (graphique à barres)')
            let dataOverall = [];
            dataOverall.push({ name: 'Sera Porté', value: willBeMountedPoteau.length });
            dataOverall.push({ name: 'Monte', value: mountedPoteau.length });
            dataOverall.push({ name: 'Non assemblé', value: notMountedPoteau.length });
            dataOverall.push({ name: 'Édité', value: editedPoteau.length });
            setGraphData(dataOverall);
        }

        else if (graphType === "poverallplqpot") {
            setGraphForm("piechart");
            setGraphCaption('Tableau des plaques postales (tableau circulaire)')
            let dataOverall = [];
            dataOverall.push({ name: 'Sera Porté', value: willBeMountedPlaquesPoteau.length });
            dataOverall.push({ name: 'Monte', value: mountedPlaquesPoteau.length });
            dataOverall.push({ name: 'Non assemblé', value: notMountedPlaquesPoteau.length });
            dataOverall.push({ name: 'Édité', value: editedPlaquesPoteau.length });
            setGraphData(dataOverall);
        }

        else if (graphType === "poverallplqmur") {
            setGraphForm("piechart");
            setGraphCaption('Tableau des plaques murales (tableau circulaire)')
            let dataOverall = [];
            dataOverall.push({ name: 'Sera Porté', value: willBeMountedPlaquesMurales.length });
            dataOverall.push({ name: 'Monte', value: mountedPlaquesMurales.length });
            dataOverall.push({ name: 'Non assemblé', value: notMountedPlaquesMurales.length });
            dataOverall.push({ name: 'Édité', value: editedPlaquesMurales.length });
            setGraphData(dataOverall);
        }

        else if (graphType === "poverallpoteau") {
            setGraphForm("piechart");
            setGraphCaption('Tableau des poteau (tableau circulaire)')
            let dataOverall = [];
            dataOverall.push({ name: 'Sera Porté', value: willBeMountedPoteau.length });
            dataOverall.push({ name: 'Monte', value: mountedPoteau.length });
            dataOverall.push({ name: 'Non assemblé', value: notMountedPoteau.length });
            dataOverall.push({ name: 'Édité', value: editedPoteau.length });
            setGraphData(dataOverall);
        }



        //, , , poverallplqpot, poverallplqmur, poverallpoteau
    }, [graphType]);


    useEffect(() => {
        if (grouppedDoorMountagesWrtDate && Object.keys(grouppedDoorMountagesWrtDate).length > 0) {

            let mountedDoorYest = 0;
            let mountedDoorTod = 0;
            //obtain date and mountage state seperately, if contains "-" or obtain array whose key is in 'XXXX-XX-XX-2' format, detect 2 after dash and ????
            for (let i = 0; i < Object.keys(grouppedDoorMountagesWrtDate).length; i++) {
                if (Object.keys(grouppedDoorMountagesWrtDate)[i].includes("-")) {
                    let dateString = Object.keys(grouppedDoorMountagesWrtDate)[i].split("-")[0];
                    let date = moment(dateString, "DD.MM.YYYY"); // Specify the format
                    let yesterday = moment().subtract(1, 'days');
                    let now = moment();
                    let mountageState = Object.keys(grouppedDoorMountagesWrtDate)[i].split("-")[1];



                    // Check if the date and yesterday are the same
                    if (date.isSame(yesterday, 'day') && (mountageState === '2' || mountageState === '4')) {
                        mountedDoorYest++;
                    } else if (date.isSame(now, "day") && (mountageState === '2' || mountageState === '4')) {
                        mountedDoorTod++;
                    }
                }
            }

            if (mountedDoorYest > 0) {
                setNumberOfMountedDoorYest(mountedDoorYest);
            }

            if (mountedDoorTod > 0) {
                setNumberOfMountedDoorTod(mountedDoorTod);
            }

            if (grouppedDoorMountagesWrtDate[moment().format('DD-MM-YYYY')] !== undefined) {
                setNumberOfMountedDoorTod(grouppedDoorMountagesWrtDate[moment().format('DD-MM-YYYY')].filter(item => item.MONTAJDURUM == '2').concat(grouppedDoorMountagesWrtDate[moment().format('DD-MM-YYYY')].filter(item => item.MONTAJDURUM == '4')).length);
            }
            if (grouppedDoorMountagesWrtDate[moment().subtract(1, "day").format('DD-MM-YYYY')] !== undefined) {
                setNumberOfMountedDoorYest(grouppedDoorMountagesWrtDate[moment().subtract(1, "day").format('DD-MM-YYYY')].length);
            }

        }


        if (grouppedWallMountagesWrtDate && Object.keys(grouppedWallMountagesWrtDate).length > 0) {
            //console.log(grouppedWallMountagesWrtDate);

            let mountedWallYest = 0;
            let mountedWallTod = 0;
            //obtain date and mountage state seperately, if contains "-" or obtain array whose key is in 'XXXX-XX-XX-2' format, detect 2 after dash and ????
            for (let i = 0; i < Object.keys(grouppedWallMountagesWrtDate).length; i++) {
                if (Object.keys(grouppedWallMountagesWrtDate)[i].includes("-")) {
                    let dateString = Object.keys(grouppedWallMountagesWrtDate)[i].split("-")[0];
                    let date = moment(dateString, "DD.MM.YYYY"); // Specify the format
                    let yesterday = moment().subtract(1, 'days');
                    let now = moment();
                    let mountageState = Object.keys(grouppedWallMountagesWrtDate)[i].split("-")[1];



                    // Check if the date and yesterday are the same
                    if (date.isSame(yesterday, 'day') && (mountageState === '2' || mountageState === '4')) {
                        mountedWallYest++;
                    } else if (date.isSame(now, "day") && (mountageState === '2' || mountageState === '4')) {
                        mountedWallTod++;
                    }
                }
            }

            if (mountedWallYest > 0) {
                setNumberOfMountedWallYest(mountedWallYest);
            }

            if (mountedWallTod > 0) {
                setNumberOfMountedWallTod(mountedWallTod);
            }



            if (grouppedWallMountagesWrtDate[moment().format('DD-MM-YYYY')] !== undefined) {
                setNumberOfMountedWallTod(grouppedWallMountagesWrtDate[moment().format('DD-MM-YYYY')].length);
            }
            if (grouppedWallMountagesWrtDate[moment().subtract(1, "day").format('DD-MM-YYYY')] !== undefined) {
                setNumberOfMountedWallYest(grouppedWallMountagesWrtDate[moment().subtract(1, "day").format('DD-MM-YYYY')].filter(item => item.MONTAJDURUM == '2').concat(grouppedDoorMountagesWrtDate[moment().format('DD-MM-YYYY')].filter(item => item.MONTAJDURUM == '4')).length);
            }
        }


        if (grouppedPoleMountagesWrtDate && Object.keys(grouppedPoleMountagesWrtDate).length > 0) {
            if (grouppedPoleMountagesWrtDate[moment().format('DD-MM-YYYY')] !== undefined) {
                setNumberOfMountedPoleTod(grouppedPoleMountagesWrtDate[moment().format('DD-MM-YYYY')].length);
            }
            if (grouppedPoleMountagesWrtDate[moment().subtract(1, "day").format('DD-MM-YYYY')] !== undefined) {
                setNumberOfMountedPoleYest(grouppedPoleMountagesWrtDate[moment().subtract(1, "day").format('DD-MM-YYYY')].filter(item => item.MONTAJDURUM == '2').concat(grouppedDoorMountagesWrtDate[moment().format('DD-MM-YYYY')].filter(item => item.MONTAJDURUM == '4')).length);
            }

            let mountedPoleYest = 0;
            let mountedPoleTod = 0;
            //obtain date and mountage state seperately, if contains "-" or obtain array whose key is in 'XXXX-XX-XX-2' format, detect 2 after dash and ????
            for (let i = 0; i < Object.keys(grouppedPoleMountagesWrtDate).length; i++) {
                if (Object.keys(grouppedPoleMountagesWrtDate)[i].includes("-")) {
                    let dateString = Object.keys(grouppedPoleMountagesWrtDate)[i].split("-")[0];
                    let date = moment(dateString, "DD.MM.YYYY"); // Specify the format
                    let yesterday = moment().subtract(1, 'days');
                    let now = moment();
                    let mountageState = Object.keys(grouppedPoleMountagesWrtDate)[i].split("-")[1];



                    // Check if the date and yesterday are the same
                    if (date.isSame(yesterday, 'day') && (mountageState === '2' || mountageState === '4')) {
                        mountedPoleYest++;
                    } else if (date.isSame(now, "day") && (mountageState === '2' || mountageState === '4')) {
                        mountedPoleTod++;
                    }
                }
            }

            if (mountedPoleYest > 0) {
                setNumberOfMountedPoleYest(mountedPoleYest);
            }

            if (mountedPoleTod > 0) {
                setNumberOfMountedPoleTod(mountedPoleTod);
            }
        }
    }, [grouppedDoorMountagesWrtDate, grouppedPoleMountagesWrtDate, grouppedWallMountagesWrtDate]);


    useEffect(() => {
        if (showFrenchItems) {



            if (grouppedPlaquesMurales && Object.keys(grouppedPlaquesMurales).length > 0) {

                let mountedPlaquesMuralesYest = 0;
                let mountedPlaquesMuralesTod = 0;
                //obtain date and mountage state seperately, if contains "-" or obtain array whose key is in 'XXXX-XX-XX-2' format, detect 2 after dash and ????
                for (let i = 0; i < Object.keys(grouppedPlaquesMurales).length; i++) {
                    if (Object.keys(grouppedPlaquesMurales)[i].includes("-")) {
                        let dateString = Object.keys(grouppedPlaquesMurales)[i].split("-")[0];
                        let date = moment(dateString, "DD.MM.YYYY"); // Specify the format
                        let yesterday = moment().subtract(1, 'days');
                        let now = moment();
                        let mountageState = Object.keys(grouppedPlaquesMurales)[i].split("-")[1];



                        // Check if the date and yesterday are the same
                        if (date.isSame(yesterday, 'day') && (mountageState === '2' || mountageState === '4')) {
                            mountedPlaquesMuralesYest++;
                        } else if (date.isSame(now, "day") && (mountageState === '2' || mountageState === '4')) {
                            mountedPlaquesMuralesTod++;
                        }
                    }
                }

                if (mountedPlaquesMuralesYest > 0) {
                    setPlaquesMuralesYest(mountedPlaquesMuralesYest);
                }

                if (mountedPlaquesMuralesTod > 0) {
                    setPlaquesMuralesTod(mountedPlaquesMuralesTod);
                }
                /*
                if (grouppedDoorMountagesWrtDate[moment().format('DD-MM-YYYY')] !== undefined) {
                    setNumberOfMountedDoorTod(grouppedDoorMountagesWrtDate[moment().format('DD-MM-YYYY')].filter(item => item.MONTAJDURUM == '2').concat(grouppedDoorMountagesWrtDate[moment().format('DD-MM-YYYY')].filter(item => item.MONTAJDURUM == '4')).length);
                }
                if (grouppedDoorMountagesWrtDate[moment().subtract(1, "day").format('DD-MM-YYYY')] !== undefined) {
                    setNumberOfMountedDoorYest(grouppedDoorMountagesWrtDate[moment().subtract(1, "day").format('DD-MM-YYYY')].length);
                }
                */
            }



            if (grouppedPlaquesPoteau && Object.keys(grouppedPlaquesPoteau).length > 0) {

                let mountedPlaquesPoteauYest = 0;
                let mountedPlaquesPoteauTod = 0;
                //obtain date and mountage state seperately, if contains "-" or obtain array whose key is in 'XXXX-XX-XX-2' format, detect 2 after dash and ????
                for (let i = 0; i < Object.keys(grouppedPlaquesPoteau).length; i++) {
                    if (Object.keys(grouppedPlaquesPoteau)[i].includes("-")) {
                        let dateString = Object.keys(grouppedPlaquesPoteau)[i].split("-")[0];
                        let date = moment(dateString, "DD.MM.YYYY"); // Specify the format
                        let yesterday = moment().subtract(1, 'days');
                        let now = moment();
                        let mountageState = Object.keys(grouppedPlaquesPoteau)[i].split("-")[1];



                        // Check if the date and yesterday are the same
                        if (date.isSame(yesterday, 'day') && (mountageState === '2' || mountageState === '4')) {
                            mountedPlaquesPoteauYest++;
                        } else if (date.isSame(now, "day") && (mountageState === '2' || mountageState === '4')) {
                            mountedPlaquesPoteauTod++;
                        }
                    }
                }

                if (mountedPlaquesPoteauYest > 0) {
                    setPlaquesPoteauYest(mountedPlaquesPoteauYest);
                }

                if (mountedPlaquesPoteauTod > 0) {
                    setPlaquesPoteauTod(mountedPlaquesPoteauTod);
                }
                /*
                if (grouppedDoorMountagesWrtDate[moment().format('DD-MM-YYYY')] !== undefined) {
                    setNumberOfMountedDoorTod(grouppedDoorMountagesWrtDate[moment().format('DD-MM-YYYY')].filter(item => item.MONTAJDURUM == '2').concat(grouppedDoorMountagesWrtDate[moment().format('DD-MM-YYYY')].filter(item => item.MONTAJDURUM == '4')).length);
                }
                if (grouppedDoorMountagesWrtDate[moment().subtract(1, "day").format('DD-MM-YYYY')] !== undefined) {
                    setNumberOfMountedDoorYest(grouppedDoorMountagesWrtDate[moment().subtract(1, "day").format('DD-MM-YYYY')].length);
                }
                */
            }


            if (grouppedPoteau && Object.keys(grouppedPoteau).length > 0) {

                let mountedPoteauYest = 0;
                let mountedPoteauTod = 0;
                //obtain date and mountage state seperately, if contains "-" or obtain array whose key is in 'XXXX-XX-XX-2' format, detect 2 after dash and ????
                for (let i = 0; i < Object.keys(grouppedPoteau).length; i++) {
                    if (Object.keys(grouppedPoteau)[i].includes("-")) {
                        let dateString = Object.keys(grouppedPoteau)[i].split("-")[0];
                        let date = moment(dateString, "DD.MM.YYYY"); // Specify the format
                        let yesterday = moment().subtract(1, 'days');
                        let now = moment();
                        let mountageState = Object.keys(grouppedPoteau)[i].split("-")[1];



                        // Check if the date and yesterday are the same
                        if (date.isSame(yesterday, 'day') && (mountageState === '2' || mountageState === '4')) {
                            mountedPoteauYest++;
                        } else if (date.isSame(now, "day") && (mountageState === '2' || mountageState === '4')) {
                            mountedPoteauTod++;
                        }
                    }
                }

                if (mountedPoteauYest > 0) {
                    setPoteauYest(mountedPoteauYest);
                }

                if (mountedPoteauTod > 0) {
                    setPoteauTod(mountedPoteauTod);
                }
                /*
                if (grouppedDoorMountagesWrtDate[moment().format('DD-MM-YYYY')] !== undefined) {
                    setNumberOfMountedDoorTod(grouppedDoorMountagesWrtDate[moment().format('DD-MM-YYYY')].filter(item => item.MONTAJDURUM == '2').concat(grouppedDoorMountagesWrtDate[moment().format('DD-MM-YYYY')].filter(item => item.MONTAJDURUM == '4')).length);
                }
                if (grouppedDoorMountagesWrtDate[moment().subtract(1, "day").format('DD-MM-YYYY')] !== undefined) {
                    setNumberOfMountedDoorYest(grouppedDoorMountagesWrtDate[moment().subtract(1, "day").format('DD-MM-YYYY')].length);
                }
                */
            }



        }
    }, [grouppedPlaquesMurales, grouppedPlaquesPoteau, grouppedPoteau]);


    const handleTypeSelection = (e) => {
        setDocType(e.target.value);
        setIsDocTypeSelected(true);
        setisFilteredByMountageState(false);
        setFilterWrtMountageState("-1");
        setFilterWrtStaff("-1");
        setIsFilteredByStaff(false);
        setFilterValue("-1");
        setIsFilteredByArea(false);
        setIsFilteredByDate(false);
        setFilterValueForStaff("-1");
        setAreaValue("-1");
        //setIsFilteredByDate(false);
        setFirstDate("");
        setSecondDate("");
        setFilteredDateRecords([]);
        //console.log(filteredRecords.length)


        //       if(!isFilteredByArea && !isFilteredByMountageState && !isFilteredByStaff){

    }

    useEffect(() => {
        ////console.log(data);
        ////console.log(docType.concat(".gpkg"))
        data.map(item => {
            /*
            if(Object.keys(item.data.data)[0] === docType) {
                
                setSelectedRecords(item.data.data[docType].features);
                ////console.log(item.data.data[docType].features);
            }
                //check for filename, not keys
            */
            if (item.fileName === docType.concat('.gpkg')) {
                setSelectedRecords(item.data.data[Object.keys(item.data.data)[0]].features);
                ////console.log();
            }

        })
    }, [docType]);

    useEffect(() => {
        //console.log(selectedRecords);
        //group wrt staff in there, don't forget to push all properties from selectedRecords...
        let propertiesOfSelectedRecordsTemp = [];
        for (let i = 0; i < selectedRecords.length; i++) {
            propertiesOfSelectedRecordsTemp.push(selectedRecords[i].properties);
        }
        //setPropertiesOfSelectedRecords(propertiesOfSelectedRecordsTemp);
        setPropertiesOfSelectedRecords(propertiesOfSelectedRecordsTemp);
    }, [selectedRecords])

    useEffect(() => {
        setStuffForSelectedRecords(Object.keys(Object.groupBy(propertiesOfSelectedRecords, (record) => record.MONTAJYAPA || record.ASSEMBLEUR)));
        //setStuffForSelectedRecords
        setAreas(Object.keys(Object.groupBy(propertiesOfSelectedRecords, (record) => record.MAHALLE || record.QUARTIERS)));
    }, [propertiesOfSelectedRecords])


    const handleSelectedRecordsFiltering = (e) => {
        setFilterValue(e.target.value);
        setisFilteredByMountageState(true);
        setFilterWrtMountageState(e.target.value);//filterWrtStaff, filterWrtMountageState, isFilteredByArea
    }





    function handleSelectedRecordsFilteringWrtStuff(e) {
        setFilterValueForStaff(e.target.value);
        setIsFilteredByStaff(true);
        setFilterWrtStaff(e.target.value);
    }

    function handleSelectedRecordsFilteringWrtArea(e) {
        setAreaValue(e.target.value);
        setIsFilteredByArea(true);
    }
    /*
        useEffect(() => {
            if(!isFilteredByStaff){
                setFilteredRecords(selectedRecords);
            }
            else{
                //setFilteredRecords(selectedRecords.filter(item => item.properties.MONTAJDURUM === String(filterValue)));
                if(docType === "KAPI")
                {
                    setFilteredRecords(propertiesOfSelectedRecords.filter(item => item.MONTAJYAPAN = filterValueForStaff));
                }
                else{
                    setFilteredRecords(propertiesOfSelectedRecords.filter(item => item.MONTAJYAPA = filterValueForStaff));
                }
            }
            
        }, [filterValueForStaff, isFilteredByStaff, selectedRecords, ]);
    */


    useEffect(() => {
        if ((!isFilteredByArea && !isFilteredByMountageState && !isFilteredByStaff && !isFilteredByDate)) {
            setFilteredRecords([]);
            setTemp([]);
            setArrayBox([]);
        }
        //console.log(propertiesOfSelectedRecords.length);
        if (filterValue == -1) {
            setisFilteredByMountageState(false);
        }

        if (filterValueForStaff == -1) {
            setIsFilteredByStaff(false);
        }
        if (areaValue == -1) {
            setIsFilteredByArea(false);
        }
        if ((firstDate && firstDate.length === 0) || (secondDate && secondDate.length === 0)) {
            setIsFilteredByDate(false);
        }
        ////console.log("filterValue"+filterValue+"\nfilterValueForStaff "+filterValueForStaff+"\nareaValue = "+areaValue);
        ////console.log("MONTAJ DURUM => ");
        if (filterValue === '2') {
            setFilteredMountageRecords(propertiesOfSelectedRecords.filter(item => item.MONTAJDURUM ? item.MONTAJDURUM === filterValue : item.ÉTAT === filterValue).concat(propertiesOfSelectedRecords.filter(item => item.MONTAJDURUM ? item.MONTAJDURUM === "4" : item.ÉTAT === "4")));
        }
        else {
            setFilteredMountageRecords(propertiesOfSelectedRecords.filter(item => item.MONTAJDURUM ? item.MONTAJDURUM === filterValue : item.ÉTAT === filterValue));
        }

        setFilteredStaffRecords(propertiesOfSelectedRecords.filter(item => item.MONTAJYAPA ? item.MONTAJYAPA == filterValueForStaff : item.ASSEMBLEUR));

        ////console.log("MAHALLE");
        setFilteredAreaRecords(propertiesOfSelectedRecords.filter(item => item.MAHALLE ? item.MAHALLE == areaValue : item.QUARTIERS == areaValue));


        //filteredDateRecords u burada set et!
        if (isFilteredByDate) {
            let dates = [];
            let arr = [];

            for (let i = 0; i < moment(secondDate).diff(firstDate, "days"); i++) {
                arr.push(propertiesOfSelectedRecords.filter(item =>
                    item.MONTAJTARIH ? item.MONTAJTARIH == moment(firstDate).add(i, "days").format('DD.MM.YYYY').toString() : item.HISTOIRE ? item.HISTOIRE == moment(firstDate).add(i, "days").format('DD.MM.YYYY').toString() || item.HISTOIRE == moment(firstDate).add(i, "days").format('DD.MM.YY').toString() : item.MONTAJTARI == moment(firstDate).add(i, "days").format('DD.MM.YYYY').toString()).map(item => item)
                );

            }
            setFilteredDateRecords(arr.flat());
            setIsFilteredByDate(true);
        }

        ////console.log(filteredDateRecords);
    }, [filterValue, isFilteredByMountageState, isFilteredByStaff, filterValueForStaff, filterWrtMountageState, filterWrtStaff, areaValue, firstDate, secondDate, propertiesOfSelectedRecords]);





    useEffect(() => {
        /*
        let arrayBoxPre = []; 
        arrayBoxPre.push(filteredMountageRecords);
        arrayBoxPre.push(filteredStaffRecords);
        arrayBoxPre.push(filteredAreaRecords);
        if(isFilteredByDate)
            arrayBoxPre.push(filteredDateRecords);
        
        if(arrayBoxPre.filter(item => item.length > 0).length > 1)
            {
                setFilteredRecords(arrayBoxPre.filter(item => item.length > 0).reduce((acc, array) => {
                    return acc.filter(element => array.includes(element));
                }
                ));
                //console.log(arrayBoxPre);
            }
            else if(arrayBoxPre.filter(item => item.length > 0).length == 1){
                for(let i=0; i<arrayBoxPre.length; i++)
                {
                    if(arrayBoxPre[i].length > 0)
                    {
                        setFilteredRecords(arrayBoxPre[i]);
                    }
                }
                
            }
            else{
                setFilteredRecords([]);
            }

         //console.log("isFilteredByArea => ", isFilteredByArea);
         //console.log("isFilteredByDate => ", isFilteredByDate);
         //console.log("isFilteredByMountageState => ", isFilteredByMountageState);
         //console.log("isFilteredByStaff => ", isFilteredByStaff);  
         //console.log("firstDate => ", firstDate.length);
         //console.log("secondDate => ", secondDate.length);


          */
        setShowFilteredRecordsOnMapCheck(true);
        let arrayBoxPre = [];
        if (isFilteredByMountageState)
            arrayBoxPre.push(filteredMountageRecords);
        if (isFilteredByStaff)
            arrayBoxPre.push(filteredStaffRecords);
        if (isFilteredByArea)
            arrayBoxPre.push(filteredAreaRecords);
        if (isFilteredByDate)
            arrayBoxPre.push(filteredDateRecords);


        setArrayBox(arrayBoxPre);

    }, [filteredMountageRecords, filteredStaffRecords, filteredAreaRecords, filteredDateRecords, isFilteredByDate, isFilteredByArea, isFilteredByMountageState, isFilteredByStaff, firstDate, secondDate])





    useEffect(() => {
        if (arrayBox.length > 0) {
            setFilteredRecords(arrayBox.reduce((a, b) => a.filter(c => b.includes(c))));
            ////console.log(arrayBox);
        }
        else {
            setFilteredRecords(arrayBox);
        }
    }, [filteredMountageRecords, filteredStaffRecords, filteredAreaRecords, filteredDateRecords, arrayBox])


    /*

<iframe
        src={`${process.env.PUBLIC_URL}/map.html`}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Interactive Map"
      />


    useEffect(() => {
  
        if(firstDate && secondDate){
            if(firstDate >= secondDate){
                //alert("Fazla ");
                //setDateIntervalArray([]);
                return;
            }
            else {
                let dates = [];
                let arr = [];
                ////console.log(moment(firstDate).diff(secondDate, "days"));
                ////console.log(moment(firstDate).format('DD.MM.YYYY')+" "+moment(firstDate).add(5, "days").format('DD.MM.YYYY')+" "+moment(secondDate).diff(firstDate, "days"));
                for(let i=0; i<moment(secondDate).diff(firstDate, "days"); i++)
                {
                    arr.push(propertiesOfSelectedRecords.filter(item => item.MONTAJTARIH == moment(firstDate).add(i, "days").format('DD.MM.YYYY').toString()).map(item => item));
                }
                setFilteredDateRecords(arr.flat());
                setIsFilteredByDate(true);
                ////console.log(arr.flat().filter(item => filteredRecords.includes(item)));
            }
        }
    }, [firstDate, secondDate]);
*/

    const bringMap = async (e) => {
        if (e.target.value === "-1") {
            setIsMapTypeSelected(false);

        }
        else {
            setShowCanvas(true);
        }
        setIsMapTypeSelected(true);
        setMapType(e.target.value);

        setPath(`./../projects/${sp}/${e.target.value}.gpkg`);

        /*
        await axiosPrivateInstance.post('mergintransactions/handlewithmap', JSON.stringify({
            path: path
        })).then(res => //console.log(res)).catch(err => //console.error(err));
        */
    }

    useEffect(() => {
        setGeoData([]);
        if (isMapTypeSelected && mapType !== "-1") {
            /*

            */
            axiosPrivateInstance.post('mergintransactions/doesmapexist', JSON.stringify({
                selected_project: sp,
                file_name: mapType
            })).then(resp => {
                if (!resp.data.doesExist) {
                    setPath(`./../projects/${sp}/${mapType}.gpkg`);
                    setPartialPath(`./../projects/${sp}`);
                    axiosPrivateInstance.post('mergintransactions/handlewithmap', JSON.stringify({
                        path: path,
                        partial_path: partialPath,
                        file_name: mapType,
                        selected_project: selectedProject
                    })).then(res => {
                        axiosPrivateInstance.post('mergintransactions/map', JSON.stringify({
                            selected_project: sp,
                            file_name: mapType
                        })).then(resp => {
                            //console.log(mapType + " " + path + " " + partialPath);
                            setGeoData(resp.data);
                        }).catch(err => console.error(err));
                    }).catch(err => console.error(err));
                }
                else {
                    axiosPrivateInstance.post('mergintransactions/map', JSON.stringify({
                        selected_project: sp,
                        file_name: mapType
                    })).then(resp => {
                        //console.log(mapType + " " + path + " " + partialPath);
                        //console.log(resp.data);
                        setGeoData(resp.data);
                    }).catch(err => console.error(err));
                }
            }).catch(err => console.log(err));

            return () => setGeoData(null);
        }
    }, [mapType, isMapTypeSelected])


    useEffect(() => {
        let filenamesPre = [];
        //        setParentPath(`./../projects/${selectedProject}`);
        axiosPrivateInstance.post('mergintransactions/returnfilenames', JSON.stringify({
            path: `./../projects/${selectedProject}`
        })).then(res => {
            for (let i = 0; i < res.data.files.length; i++) {
                filenamesPre.push(res.data.files[i].replace('.gpkg', ''));
            }
            //setFiles(res.data);
            setFileNames(filenamesPre);
        }).catch(err => console.error(err));
    }, [selectedProject]);




    /*
    useEffect(() => {
        axiosPrivateInstance.post('mergintransactions/returnfilenames', JSON.stringify({
            path: path
        })).then(res => {
            //console.log(res.data);
            //setFiles(res.data);
        }).catch(err => //console.error(err));
    }, [path]);
    */

    useEffect(() => {
        showFrenchItems ? changeLanguage('fr') : changeLanguage('en');
    }, [showFrenchItems])

    useEffect(() => {
        if (newMapOrGraph !== "-1") {
            setNewIsMapOrGraphSelected(true);
            setShowFilteredRecordsOnMap(false);

        }
        else {
            setNewIsMapOrGraphSelected(false);
            setMapType("-1");
            setGraphType("-1");
        }

    }, [newMapOrGraph])

    /*
        useEffect(() => {
            let path = `./../projects/${selectedProject}/${docType}.gpkg`;
            let fileName = `${docType}.gpkg`;
            axiosPrivateInstance.post('mergintransactions/filtergpkgfile', {
                path: path,
                filename: fileName,
                filtered_data: JSON.stringify(filteredRecords)
            }).then(res => console.log(res)).catch(err => console.log(err));
        }, [filteredRecords]);
    */



    /*
    useEffect(() => {
        let wanteds = [];
        setMapDataForSelectedRecords("");
        setShowFilteredRecordsOnMap(false);
        if (filteredRecords.length > 0) {
            let path = `./../projects/${selectedProject}/${docType}.gpkg`;
            axiosPrivateInstance.post('mergintransactions/returnfilecontent', JSON.stringify({
                path: path
            })).then(res => {
                console.log("SANKYONG");
                res.data.data[docType].features.map(allItems => {
                    filteredRecords.map(filteredItems => 
                    {
                        if(Object.keys(allItems.properties).length === Object.keys(filteredItems).length)
                        {
                            let desiredNumberOfEquity = Object.keys(allItems.properties).length;
                            let numberOfEqualKeys = 0;
                            for(let i=0; i<desiredNumberOfEquity; i++){
                                if(Object.keys(allItems.properties)[i] === Object.keys(filteredItems)[i] && allItems.properties[Object.keys(allItems.properties)[i]] === filteredItems[Object.keys(filteredItems)[i]]){
                                    numberOfEqualKeys++;
                                }
                            }
                            if(desiredNumberOfEquity === numberOfEqualKeys){
                                wanteds.push(allItems);
                            }
                        }
                    }
                    )  
                });

                res.data.data[docType].features = wanteds;
                
                setMapDataForSelectedRecords(res.data.data[docType]);
                
            }).catch(err => {
                console.error(err);
            });
        }
        
    }, [filteredRecords]);


    useEffect(() => {
        if(mapDataForSelectedRecords.features && mapDataForSelectedRecords.features.length > 0){
            setShowFilteredRecordsOnMapCheck(true);
        }
        else{
            setShowFilteredRecordsOnMapCheck(false);
        }
    }, [mapDataForSelectedRecords])

    useEffect(() => {
        setGeoData("");
        console.log("showFilteredRecordsOnMap => ", showFiltereRecordsOnMap);
        setGraphType("-1");
        setNewIsMapOrGraphSelected("-1");
        setNewIsMapOrGraphSelected("-1");
        setNewMapOrGraph("-1");
        console.log(mapDataForSelectedRecords);
    }, [showFiltereRecordsOnMap]);
    filtergpkgfile
*/

    useEffect(() => {
        setShowFilteredRecordsOnMap(false);
        setMapDataForSelectedRecords("");
    }, [filteredRecords])


    useEffect(() => {
        if (showFiltereRecordsOnMap) {
            //setNewMapOrGraph, setGraphType, setGraphData, setMapType
            setNewMapOrGraph("-1");
            let path = `./../projects/${selectedProject}/${docType}.gpkg`;
            let fileName = `${docType}.gpkg`;
            axiosPrivateInstance.post('mergintransactions/filtergpkgfile', {
                path: path,
                filename: fileName,
                filtered_data: JSON.stringify(filteredRecords)
            }).then(res => setMapDataForSelectedRecords(res.data.data[docType])).catch(err => console.log(err));
        }
    }, [showFiltereRecordsOnMap])

    const exportToExcel = (data, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Generate a blob for the file and trigger download
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToCSV = (data, fileName) => {
        const headers = Object.keys(data[0]).join(','); // Extract headers
        const rows = data.map(row => Object.values(row).join(',')); // Extract rows
        const csv = [headers, ...rows].join('\n'); // Combine headers and rows

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    const exportToPDF = async (data, fileName) => {
        const doc = new jsPDF({ orientation: "landscape" });
        const fontUrl = "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf"; // Replace with your font's CDN URL

        //const fontUrl = "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto-Regular.ttf";
        const response = await fetch(fontUrl);
        const fontBuffer = await response.arrayBuffer();

        // Convert ArrayBuffer to Base64 in the browser
        const fontBase64 = arrayBufferToBase64(fontBuffer);
        const addFontResult = doc.addFileToVFS("roboto-regular-webfont.ttf", fontBase64);
        doc.addFont("roboto-regular-webfont.ttf", "Roboto", "normal");
        doc.setFont("Roboto");

        const columns = Object.keys(data[0]);

        const rows = data.map(item =>
            columns.map((key) => (
                item[key] !== null ? item[key] : ""
            ))
        );


        doc.autoTable({
            head: [columns],
            body: rows,
            startY: 20,
            styles: {
                fontSize: 8, // Smaller font size to accommodate more data
                overflow: "linebreak", // Ensure long text is wrapped
            },
            columnStyles: {
                // Dynamic column widths
                0: { cellWidth: "wrap" },
            },
            tableWidth: "auto", // Automatically adjusts table width
        });

        // Save the PDF
        doc.save(`${fileName}_${moment().format()}.pdf`);
        //console.log(data);
    };

    // Helper function to convert ArrayBuffer to Base64
    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }








    return (
        <>

            <div id={styles.mainFrame}>
                <div id={styles.dailyAndTotal} className='col-sm col-xs col-md'>
                    {
                        files.files && (files.files.includes("PLAQUES_POTEAU.gpkg") || files.files.includes("PLAQUES_MURALES.gpkg") || files.files.includes("POTEAU.gpkg")) ?
                            <div id={styles.showForeignRecords}>
                                <button type="button" class="btn btn-light" data-bs-toggle="button" onClick={() => {
                                    setShowFrenchItems(!showFrenchItems);
                                    setShowCanvas(false);


                                }}>{showFrenchItems ? "AFFICHER LES ARTICLES EN ANGLAIS" : "SHOW FRENCH ITEMS"}</button>
                            </div> : ""
                    }

                    <div id={styles.childOfDailyAndTotal}>
                        <b className='fs-5 text-white' id={styles.innerLeftestCaption}>{showFrenchItems ? "Plaques postales installées aujourd'hui" : t('enhancedSubDashboardMountedDoorToday')}</b>
                        <h1 className="text-white" id={styles.innerLeftValue}>{showFrenchItems && plaquesPoteauTod ? plaquesPoteauTod : numberOfMountedDoorTod}</h1>
                    </div>

                    <div id={styles.childOfDailyAndTotal}>
                        <b className='fs-5 text-white' id={styles.innerLeftestCaption}>{showFrenchItems ? "Plaques murales installées aujourd'hui" : t('enhancedSubDashboardMountedPoleToday')}</b>
                        <h1 className="text-white" id={styles.innerLeftValue}>{showFrenchItems && plaquesMuralesTod ? plaquesMuralesTod : numberOfMountedPoleTod}</h1>
                    </div>

                    <div id={styles.childOfDailyAndTotal}>
                        <b className='fs-5 text-white' id={styles.innerLeftestCaption}>{showFrenchItems ? "Nombre de poteaux installés aujourd'hui" : t('enhancedSubDashboardMountedWallToday')}</b>
                        <h1 className="text-white" id={styles.innerLeftValue}>{showFrenchItems && poteauTod ? poteauTod : numberOfMountedWallTod}</h1>
                    </div>


                    <div id={styles.childOfDailyAndTotal}>
                        <b className='fs-5 text-white' id={styles.innerLeftestCaption}>{showFrenchItems ? "Nombre de plaques de mât installées hier" : t('enhancedSubDashboardMountedDoorYesterday')}</b>
                        <h1 className="text-white" id={styles.innerLeftValue}>{showFrenchItems && plaquesPoteauYest ? plaquesPoteauYest : numberOfMountedDoorYest}</h1>
                    </div>

                    <div id={styles.childOfDailyAndTotal}>
                        <b className='fs-5 text-white' id={styles.innerLeftestCaption}>{showFrenchItems ? "Nombre de plaques murales installées hier" : t('enhancedSubDashboardMountedPoleYesterday')}</b>
                        <h1 className="text-white" id={styles.innerLeftValue}>{showFrenchItems && plaquesMuralesYest ? plaquesMuralesYest : numberOfMountedPoleYest}</h1>
                    </div>
                    <div id={styles.childOfDailyAndTotal}>
                        <b className='fs-5 text-white' id={styles.innerLeftestCaption}>{showFrenchItems ? "Nombre de plaques polaires installées hier" : t('enhancedSubDashboardMountedWallYesterday')}</b>
                        <h1 className="text-white" id={styles.innerLeftValue}>{showFrenchItems && poteauYest ? poteauYest : numberOfMountedWallYest}</h1>
                    </div>

                    <div id={styles.childOfDailyAndTotal}>
                        <b className='fs-5 text-white' id={styles.innerLeftestCaption}>{showFrenchItems ? "nombre total de plaques polaires installées" : t('enhancedSubDashboardTotalMountedDoor')}</b>
                        <h1 className="fs-5 text-white" id={styles.innerLeftValue}>{showFrenchItems && (mountedPlaquesPoteau.length > 0 || editedPlaquesPoteau.length > 0) ? mountedPlaquesPoteau.length + editedPlaquesPoteau.length : mountedDoors.length > 0 || editedDoors.length > 0 ? mountedDoors.length + editedDoors.length : 0}</h1>
                    </div>

                    <div id={styles.childOfDailyAndTotal}>
                        <b className='fs-5 text-white' id={styles.innerLeftestCaption}>{showFrenchItems ? "Nombre total de plaques murales installées" : t('enhancedSubDashboardTotalMountedPole')}</b>
                        <h1 className="text-white" id={styles.innerLeftValue}>{showFrenchItems && (mountedPlaquesMurales.length > 0 || editedPlaquesMurales.length > 0) ? mountedPlaquesMurales.length + editedPlaquesMurales.length : mountedPoles.length > 0 || editedPoles.length > 0 ? mountedPoles.length + editedPoles.length : 0}</h1>
                    </div>

                    <div id={styles.childOfDailyAndTotal}>
                        <b className='fs-5 text-white' id={styles.innerLeftestCaption}>{showFrenchItems ? "Nombre total de plaques polaires installées" : t('enhancedSubDashboardTotalMountedWall')}</b>
                        <h1 className="text-white" id={styles.innerLeftValue}>{showFrenchItems && (mountedPoteau.length > 0 || editedPoteau.length > 0) ? mountedPoteau.length + editedPoteau.length : mountedWalls.length > 0 || editedWalls.length > 0 ? mountedWalls.length + editedWalls.length : 0}</h1>
                    </div>


                    <div id={styles.childOfDailyAndTotal}>
                        <b className='fs-5 text-white' id={styles.innerLeftestCaption}>{showFrenchItems ? "Nombre total de plaques de poteaux non installées" : t('enhancedSubDashboardNotMountedDoors')}</b>
                        <h1 className="text-white" id={styles.innerLeftValue}>{showFrenchItems && notMountedPlaquesPoteau ? notMountedPlaquesPoteau.length : notMountedDoors.length}</h1>
                    </div>

                    <div id={styles.childOfDailyAndTotal}>
                        <b className='fs-5 text-white' id={styles.innerLeftestCaption}>{showFrenchItems ? "Nombre total de plaques murales désinstallées" : t('enhancedSubDashboardNotMountedPoles')}</b>
                        <h1 className="text-white" id={styles.innerLeftValue}>{showFrenchItems && notMountedPlaquesMurales ? notMountedPlaquesMurales.length : notMountedPoles.length}</h1>
                    </div>

                    <div id={styles.childOfDailyAndTotal}>
                        <b className='fs-5 text-white' id={styles.innerLeftestCaption}>{showFrenchItems ? "Nombre total de plaques de poteaux non installées" : t('enhancedSubDashboardNotMountedWalls')}</b>
                        <h1 className="text-white" id={styles.innerLeftValue}>{showFrenchItems && notMountedPoteau ? notMountedPoteau.length : notMountedWalls.length}</h1>
                    </div>

                    <div id={styles.childOfDailyAndTotal}>
                        <b className='fs-5 text-white' id={styles.innerLeftestCaption}>{showFrenchItems ? "NNombre total de plaques polaires à installer" : t('enhancedSubDashboardWillBeMountedDoors')}</b>
                        <h1 className="text-white" id={styles.innerLeftValue}>{showFrenchItems && willBeMountedPlaquesPoteau ? willBeMountedPlaquesPoteau.length : willBeMountedDoors.length}</h1>
                    </div>

                    <div id={styles.childOfDailyAndTotal}>
                        <b className='fs-5 text-white' id={styles.innerLeftestCaption}>{showFrenchItems ? "Nombre total de plaques murales à installer" : t('enhancedSubDashboardWillBeMountedPoles')}</b>
                        <h1 className="text-white" id={styles.innerLeftValue}>{showFrenchItems && willBeMountedPlaquesMurales ? willBeMountedPlaquesMurales.length : willBeMountedPoles.length}</h1>
                    </div>

                    <div id={styles.childOfDailyAndTotal}>
                        <b className='fs-5 text-white' id={styles.innerLeftestCaption}>{showFrenchItems ? "Nombre total de poteau à installer" : t('enhancedSubDashboardWillBeMountedWalls')}</b>
                        <h1 className="text-white" id={styles.innerLeftValue}>{showFrenchItems && willBeMountedPoteau ? willBeMountedPoteau.length : willBeMountedWalls.length}</h1>
                    </div>
                </div>


                <div id={styles.mapFrame}>
                    <div id={styles.mapInfo}>





                        <b className='fs-5 text-white'>{t('enhancedSubDashboardMapOrGraph')}</b>
                        <select onChange={(e) => setNewMapOrGraph(e.target.value)} id={styles.mapOrGraph} value={newMapOrGraph} className='form-select mx-1'>
                            <option value="-1">{newIsMapOrGraphSelected ? t('clearSelection') : t('enhancedSubDashboardPleaseSelect')}</option>
                            <option value="map">{t('enhancedSubDashboardMap')}</option>
                            <option value="graph">{t('enhancedSubDashboardGraph')}</option>
                        </select>


                        {newMapOrGraph !== "-1" ?
                            newMapOrGraph === "map" ?

                                <>
                                    <div id={styles.mapButtonBox}>
                                        <b className="fs-5 text-white">{t('enhancedSubDashboardMapTransactions')}</b>
                                        <select onChange={(e) => { setMapType(e.target.value); bringMap(e) }} value={mapType} className='form-select mx-1' id={styles.setTypeOfGraph} style={{ marginBottom: '15px' }}>
                                            <option value="-1" selected>{t('enhancedSubDashboardPleaseMakeSelection')}</option>
                                            {
                                                fileNames.map(item => {
                                                    return (
                                                        <option value={item}>{item}</option>
                                                    )
                                                })
                                            }


                                        </select>
                                    </div>
                                </>



                                :
                                <>
                                    <b className='fs-5 text-white'>{t('enhancedSubDashboardGraphTransactions')}</b>
                                    <select onChange={(e) => setGraphType(e.target.value)} value={graphType} className="form-select mx-1" id={styles.setTypeOfGraph}>

                                        {
                                            showFrenchItems ?
                                                <>
                                                    <option value="-1" selected>Veuillez sélectionner le type de graphique</option>
                                                    <option value="overallplqpot">Tableau de l'état des plaques postales (graphique à barres)</option>
                                                    <option value="overallplqmur">Tableau de l'état des plaques murales (graphique à barres)</option>
                                                    <option value="overallpoteau">Tableau de l'état des poteau (graphique à barres)</option>
                                                    <option value="poverallplqpot">Tableau de l'état des plaques postales (diagramme circulaire)</option>
                                                    <option value="poverallplqmur">Tableau de l'état des plaques murales (diagramme circulaire)</option>
                                                    <option value="poverallpoteau">Tableau de l'état des poteau (diagramme circulaire)</option>
                                                </>
                                                :
                                                <>
                                                    <option value="-1" selected>{t('enhancedSubDashboardPleaseMakeSelection')}</option>
                                                    <option value="overalldoor">{t('enhancedSubDashboardOverAllDoor')}</option>
                                                    <option value="overallwall">{t('enhancedSubDashboardOverAllWall')}</option>
                                                    <option value="overallpole">{t('enhancedSubDashboardOverAllPole')}</option>
                                                    <option value="poveralldoor">{t('enhancedSubDashboardPoverAllDoor')}</option>
                                                    <option value="poverallwall">{t('enhancedSubDashboardPoverAllWall')}</option>
                                                    <option value="poverallpole">{t('enhancedSubDashboardPoverAllPole')}</option>
                                                </>
                                        }
                                    </select>
                                </>
                            : ""}










                    </div>

                    <div className='px-3 py-2'>
                        {
                            newMapOrGraph === "graph" && graphType !== "-1" ?

                                graphForm === "barchart" ?
                                    <BarChart data={graphData} id={styles.barChart} /> :
                                    <PieChart data={graphData} id={styles.barChart} />

                                : newMapOrGraph === "map" && mapType !== "-1" ?
                                    geoData ? <MapView geojsonData={geoData} mapType={mapType} sp={selectedProject} selectedNamespace={selectedNamespace} /> :
                                        ""
                                    : showFiltereRecordsOnMap === true && mapDataForSelectedRecords.features && mapDataForSelectedRecords.features.length && mapDataForSelectedRecords.features.length > 0 ?
                                        <MapView geojsonData={mapDataForSelectedRecords} mapType={docType} sp={selectedProject} selectedNamespace={selectedNamespace} />
                                        : ""

                        }
                    </div>



                </div>

                <div id={styles.rightestOuter}>



                    {
                        fileNames.map((item, index) => {
                            return (<div className="form-check">
                                <input className="form-check-input" type="radio" name="exampleRadios" id={`exampleRadios${index}`} value={item} onClick={(e) => handleTypeSelection(e)} />
                                <label className="form-check-label" for="exampleRadios4">
                                    <b className='text-white'>{item}</b>
                                </label>
                            </div>)
                        })
                    }
                    {
                        isDocTypeSelected ?
                            <>
                                <div id={styles.recordListBar} className='bg-light my-3 border rounded'>
                                    <table className='table table-fluid'>
                                        <tr>
                                            <th>{t('mountageState')}</th>
                                            <td>{filterWrtMountageState && filterWrtMountageState !== "-1" ? parseMountageState(filterWrtMountageState) : "-"}</td>
                                        </tr>
                                        <tr>
                                            <th>{t('fieldStaff')}</th>
                                            <td>{filterValueForStaff && filterValueForStaff !== "-1" ? filterValueForStaff : "-"}</td>
                                        </tr>
                                        <tr>
                                            <th>{t('neighbourhood')}</th>
                                            <td>{areaValue && areaValue !== "-1" ? areaValue : "-"}</td>
                                        </tr>
                                        <tr>
                                            <th>{t('dateInterval')}</th>
                                            <td>{isFilteredByDate ? `${moment(firstDate).format('DD.MM.YYYY').toString()} - ${moment(secondDate).format('DD.MM.YYYY')}` : "-"}</td>
                                        </tr>
                                        <tr>
                                            <th>{t('numberOfRecords')}</th>
                                            <td>{filteredRecords.length && filteredRecords.length}</td>
                                        </tr>

                                    </table>

                                </div>
                                <div id={styles.recordList} className='border rounded'>

                                    {
                                        filteredRecords && filteredRecords.map(item => {
                                            return (
                                                <>
                                                    <hr />
                                                    <b>{t('district')}</b>
                                                    <p>{item && item.ILCE ? item.ILCE : item.COMMUNE ? item.COMMUNE : ""}</p>
                                                    <b>{t('neighbourhood')}</b>
                                                    <p>{item && item.MAHALLE ? item.MAHALLE : item.QUARTIERS ? item.QUARTIERS : ""}</p>
                                                    <b>{t('assemblyPersonel')}</b>
                                                    <p>{item && item.MONTAJYAPA ? item.MONTAJYAPA : item.ASSEMBLEUR ? item.ASSEMBLEUR : ""}</p>
                                                    <b>{t('mountageState')}</b>
                                                    <p>{item && item.MONTAJDURUM ? parseMountageState(item.MONTAJDURUM) : parseMountageState(item.ÉTAT)}</p>
                                                    <b>{t('installationDateTime')}</b>
                                                    <p>{item && item.MONTAJTARIH ? item.MONTAJTARIH : item.HISTOIRE ? item.HISTOIRE : item.MONTAJTARI}/{item && item.MONTAJSAAT ? item.MONTAJSAAT : item.HEURES ? item.HEURES : ""}</p>
                                                    <hr />
                                                </>
                                            )
                                        })
                                    }
                                </div>
                                <b>{t('mountageStateFilter')}</b>
                                <div id={styles.recordListBar}>
                                    <select onChange={(e) => handleSelectedRecordsFiltering(e)} value={filterWrtMountageState} className="form-select">
                                        <option value="-1" selected>{t('mountageStateFilter')}</option>
                                        <option value="1">{t('willBeMounted')}</option>
                                        <option value="2">{t('mounted')}</option>
                                        <option value="3">{t('notMounted')}</option>
                                    </select>

                                </div>
                                <b>{t('staffFilter')}</b>
                                <div id={styles.recordListBar}>
                                    <select onChange={(e) => handleSelectedRecordsFilteringWrtStuff(e)} value={filterValueForStaff} className='form-select'>
                                        <option value="-1" selected>{t('staffFilter')}</option>
                                        {stuffForSelectedRecords && stuffForSelectedRecords.map(item => {
                                            return (<option value={item}>{item}</option>)
                                        })}
                                    </select>
                                </div>

                                <b>{t('districtFilter')}</b>
                                <div id={styles.recordListBar}>
                                    <select onChange={(e) => handleSelectedRecordsFilteringWrtArea(e)} value={areaValue} className='form-select'>
                                        <option value="-1" selected>{t('districtFilter')}</option>
                                        {areas && areas.map(item => {
                                            return (<option value={item}>{item}</option>)
                                        })}
                                    </select>
                                </div>
                                <b>{t('dateFilter')}</b>
                                <div id={styles.recordListBarOpaque}>
                                    <DatePicker selected={firstDate} value={firstDate} onChange={(date) => setFirstDate(date)} id={styles.datepicker} placeholderText={t('pickFirstDate')} />
                                </div>
                                <div id={styles.recordListBarOpaque}>
                                    <DatePicker selected={secondDate} value={secondDate} onChange={(date) => {
                                        if (firstDate < date) {
                                            setSecondDate(date);
                                            setIsFilteredByDate(true);
                                        }
                                        else {
                                            alert(t("firstDateGreaterError"));
                                            setSecondDate("");
                                            setIsFilteredByDate(false);
                                        }
                                    }} id={styles.datepicker} placeholderText={t('pickSecondDate')} />
                                </div>

                                {
                                    filteredRecords.length > 0 ?
                                        <div className='col-xs col-sm col-md col-lg'>
                                            <div className="form-check m-0 p-0 d-flex flex-column">
                                                <label className='fs-5 text-light mb-2' htmlFor="showFilteredDataOnMap">
                                                    <input
                                                        type="checkbox"
                                                        value={showFiltereRecordsOnMap}
                                                        checked={showFiltereRecordsOnMap}
                                                        onChange={() => setShowFilteredRecordsOnMap(!showFiltereRecordsOnMap)}
                                                    />
                                                    <span className="mx-1"></span>
                                                    SHOW ON MAP
                                                </label>

                                                <button onClick={() => exportToExcel(filteredRecords, `${selectedProject}_${docType}`)} className='btn btn-sm btn-light m-2 p-2'>
                                                    <FontAwesomeIcon icon={faFileExcel} style={{ marginRight: '8px', color: 'green' }} />
                                                    {t('exportToExcel')}
                                                </button>

                                                <button onClick={() => exportToCSV(filteredRecords, `${selectedProject}_${docType}`)} className='btn btn-sm btn-light m-2 p-2'>
                                                    <FontAwesomeIcon icon={faFileCsv} style={{ marginRight: '8px', color: 'green' }} />
                                                    {t('exportToCsv')}
                                                </button>

                                                <button onClick={() => exportToPDF(filteredRecords, `${selectedProject}_${docType}`)} className='btn btn-sm btn-light m-2 p-2'>
                                                    <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: '8px', color: 'red' }} />
                                                    {t('exportToPdf')}
                                                </button>


                                            </div>
                                        </div>

                                        : ""
                                }

                            </>
                            : ""
                    }

                </div>

            </div>

        </>
    )
}

export default EnhancedSubDashboard;