import React, {useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './EnhancedSubDashboard.module.css'
import moment from "moment";
import BarChart from './BarChart';
import PieChart from './PieChart'

function Dashboard2(){
    const location = useLocation();
    const navigate = useNavigate(); 
    const [wholeData, setWholeData] = useState([]);
    const [wholeProperties, setWholeProperties] = useState([]);
    const [sortByDateAll, setSortByDateAll] = useState([]);
    const [currentDate, setCurrentDate] = useState(moment().format("DD.MM.YYYY").toString());
    const [yestDate, setYestDate] = useState(moment().subtract(1, 'day').format("DD.MM.YYYY").toString());
    const [todayMounted, setTodayMounted] = useState(0);
    const [yesterdayMounted, setYesterdayMounted] = useState(0);
    const [grouppedWRTMountage, setGrouppedWRTMountage] = useState();
    const [persons, setPersons] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState("");
    const [personHist, setPersonHist] = useState([]);
    const [mapOrGraph, setMapOrGraph] = useState();
    const [graphParam, setGraphParam] = useState();
    const [showGraph, setShowGraph] = useState();
    const [willBeMounted, setWillBeMounted] = useState(0);
    const [mounted, setMounted] = useState(0);
    const [notMounted, setNotMounted] = useState(0);
    const [edited, setEdited] = useState(0);
    const [data, setData] = useState([]);
    const [graphForm, setGraphForm] = useState();

    const parseMountageState = (n) => {
        if(n === "1"){
            return "TAKILACAK";
        }
        else if(n === "2"){
            return "TAKILDI";
        }
        else if(n === "3")
        {
            return "TAKILMADI";
        }
        else{
            return "DÜZENLENDİ"
        }
    }

    useEffect(() => {
        //console.log(location.state.data.data.KAPI)
        if (typeof location.state == 'undefined' || location.state.data.data == null || Object.keys(location.state.data.data)[0] !== "KAPI") {
            navigate('/auth/tempdash2');
        }

        setWholeData(location.state.data.data);

        let durum1 = 0;
        let durum2 = 0;
        let durum3 = 0;
        let durum4 = 0;

        for(let i=0; i<location.state.data.data.KAPI.features.length; i++)
        {
            //console.log(i);
            //console.log(location.state.data.KAPI.features[i].properties);
            //setMountStates([...mountStates, location.state.data.KAPI.features[i].properties.MONTAJDURUM]);
            if(location.state.data.data.KAPI.features[i].properties.MONTAJDURUM === "1")
            {
                durum1++;
            }

            if(location.state.data.data.KAPI.features[i].properties.MONTAJDURUM === "2")
            {
                durum2++;
            }

            if(location.state.data.data.KAPI.features[i].properties.MONTAJDURUM === "3")
            {
                durum3++;
            }

            if(location.state.data.data.KAPI.features[i].properties.MONTAJDURUM === "4")
            {
                durum4++;
            }

        }
        setWillBeMounted(durum1);
        setMounted(durum2);
        setNotMounted(durum3);
        setEdited(durum4);
        
        console.log(location.state);
    }, [])


    useEffect(() => {
        setData([]);
        if(graphParam === "overall"){
            setGraphForm("barchart");
            //setStaffVBeMounted([]);
            //setStaffVWillBeMounted([]);
            //setStaffVNotMounted([]);
            //setStaffVEdited([]);
            let dataOverall = [];
            dataOverall.push({name: 'TAKILACAK', value: willBeMounted});
            dataOverall.push({name:'TAKILDI', value: mounted});
            dataOverall.push({name: 'TAKILMADI', value: notMounted});
            dataOverall.push({name: 'DÜZENLENDİ', value: edited});
            setData(dataOverall);
        }
        else if(graphParam === "mountagevstime")
        {
            setGraphForm("barchart");
            let mountagevstime = []

            
            for(let i=0; i<wholeData.KAPI.features.length; i++)
            {
                mountagevstime.push(wholeData.KAPI.features[i].properties);
            } 
            //setMountageVsTime(mountagevstime);
            let grouppedMountageVsTime = Object.groupBy(mountagevstime, ({MONTAJTARIH}) => MONTAJTARIH);
            let grouppedMountageVsTimeToBeSet = [];
            for(let j=0; j<Object.keys(grouppedMountageVsTime).length; j++)
            {
                grouppedMountageVsTimeToBeSet.push({name: Object.keys(grouppedMountageVsTime)[j], value: grouppedMountageVsTime[Object.keys(grouppedMountageVsTime)[j]].length});
            }
            setData(grouppedMountageVsTimeToBeSet);
            
            //console.log(Object.groupBy(mountageVsTime, ({MONTAJTARIH}) => MONTAJTARIH))
            //console.log(Object.keys(Object.groupBy(mountageVsTime, ({MONTAJTARIH}) => MONTAJTARIH)).length);
            //console.log(Object.keys(mountageVstime));
        }
        else if(graphParam === "poverall"){
            setGraphForm("piechart")
            
            let dataOverall = [];
            dataOverall.push({name: 'TAKILACAK', value: willBeMounted});
            dataOverall.push({name:'TAKILDI', value: mounted});
            dataOverall.push({name: 'TAKILMADI', value: notMounted});
            dataOverall.push({name: 'DÜZENLENDİ', value: edited});
            setData(dataOverall);
            
        }
        
    }, [graphParam])

    useEffect(() => {
        console.log("wholeData.keys");
        //console.log(Object.keys(wholeData));
        let propertiesArray = [];
        for(let i=0; i<Object.keys(wholeData).length; i++)
        {
            if(wholeData[Object.keys(wholeData)[i]])
            {
                
                for(let j=0; j<wholeData[Object.keys(wholeData)[i]].features.length; j++)
                {
                    propertiesArray.push(wholeData[Object.keys(wholeData)[i]].features[j].properties);
                }
            }
                
        }
        setWholeProperties(propertiesArray);
    }, [wholeData])

    useEffect(() => {
        if(wholeProperties){
            let grouppedMountageDate = [];
            //console.log(Object.groupBy(wholeProperties, ({MONTAJTARIH}) => MONTAJTARIH));
            for(let y=0; y<Object.keys(Object.groupBy(wholeProperties, ({MONTAJTARIH}) => MONTAJTARIH)).length; y++)
            {
                grouppedMountageDate.push({
                    key: Object.keys(Object.groupBy(wholeProperties, ({MONTAJTARIH}) => MONTAJTARIH))[y],
                    value: Object.groupBy(wholeProperties, ({MONTAJTARIH}) => MONTAJTARIH)[Object.keys(Object.groupBy(wholeProperties, ({MONTAJTARIH}) => MONTAJTARIH))[y]]
                });
            }
            setSortByDateAll(grouppedMountageDate);

            setGrouppedWRTMountage(Object.groupBy(wholeProperties, ({MONTAJDURUM}) => MONTAJDURUM));
            setPersons(Object.keys(Object.groupBy(wholeProperties, ({MONTAJYAPAN}) => MONTAJYAPAN)));
        }        
            
    }, [wholeProperties]);

    useEffect(() => {
        //console.log(currentDate);
        for(let i=0; i<Object.keys(sortByDateAll).length; i++)
        {
            if(currentDate === Object.keys(sortByDateAll)[i]){
                setTodayMounted(prevState => prevState + sortByDateAll[Object.keys(sortByDateAll)[i]].value.length)
            }
            else if(yestDate === Object.keys(sortByDateAll)[i]){
                setYesterdayMounted(prevState => prevState + sortByDateAll[Object.keys(sortByDateAll)[i]].value.length);
            }
        }
        //console.log(grouppedWRTMountage['3'])
    
    }, [sortByDateAll])


    useEffect(() => {
        setPersonHist(wholeProperties.filter(x => x.MONTAJYAPAN === selectedPerson));
        console.log(wholeProperties.filter(x => x.MONTAJYAPAN === selectedPerson));
    }, [selectedPerson])


    const mapOrGraphHandler = (e) => {
        setMapOrGraph(e.target.value);
    }

    const handleMountageGraphShow = (e) => {
        setGraphParam(e.target.value);
        //setData([{name: "Osman", value: 42}, {name: "Hurra", value:88}])
        setShowGraph(true);
    }

    return(
        <>
            <div className='container' id={styles.highestRow}>
                <div className='row'>
                    <div className='col-2'>
                        <b className='fs-5 text-light'>Aktif İsim Alanı / Proje: {location.state.currentPath} </b> 
                    </div>

                    <div className='col-2'>
                        <b className='fs-5 text-light'>Aktif Dosya: {location.state.currentFile}</b>
                    </div>

                    <div className='col-3'>
                        <b className='fs-5 text-light'>Tarih aralığı seçimi</b>
                        <p className='text-light'>Lütfen tarih aralığı giriniz</p>
                        <div className='row'>
                            <input type='date' className={`d-inline form-control ${styles.dateitem}`} placeholder='1.tarih' id="firstDate" />
                            <input type='date' className={`d-inline form-control ${styles.dateitem}`} placeholder='2.tarih' id="secondDate"/>
                        </div>
                    </div>

                    <div className='col-3'>
                        <b className='fs-5 text-light'>Mahalle seçimi</b>
                        <input type="text" className='form-control' placeholder='Mahalle ismi'/>
                    </div>

                    <div className='col-2'>
                        <b className='fs-5 text-light'>ID seçimi</b>
                        <input type="text" className='form-control' placeholder='Kapı ID'/>
                    </div>
                </div>
            </div>

            <div className='container p-0 m-0' id={styles.mainFrame}>
                <div className='row'>

                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-xs-12" id={styles.leftestDiv}>
                          
                            <div className="jumbotron jumbotron-fluid bg-warning text-center" id={styles.divinleftest}>
                                <div id={styles.divinleftestcontent}>
                                    <b className='fs-5'>Bugün kapı montaj</b>
                                    <p className='fs-5'>{todayMounted}</p> 
                                </div>
                            </div>
                            <div className="jumbotron jumbotron-00fluid bg-warning text-center" id={styles.divinleftest}>
                                <div id={styles.divinleftestcontent}>
                                    <b className='fs-5'>Bugün direk montaj</b>
                                    <p className='fs-5'>0</p> 
                                </div>
                            </div>
                        
                            <div className="jumbotron jumbotron-fluid bg-warning text-center" id={styles.divinleftest}>
                                    <div id={styles.divinleftestcontent}>
                                        <b className='fs-5'>Dün kapı montaj</b>
                                        <p className='fs-5'>{yesterdayMounted}</p> 
                                    </div>
                            </div>
                            <div className="jumbotron jumbotron-fluid bg-warning text-center" id={styles.divinleftest}>
                                    <div id={styles.divinleftestcontent}>
                                        <b className='fs-5'>Dün direk montaj</b>
                                        <p className='fs-5'>0</p> 
                                    </div>
                            </div>
                        
                            <div className="jumbotron jumbotron-fluid bg-warning text-center" id={styles.divinleftest}>
                                <div id={styles.divinleftestcontent}>
                                    <b className='fs-5'>Toplam kapı montaj</b>
                                    <p className='fs-5'>{wholeProperties.length}</p> 
                                </div>
                            </div>
                            <div className="jumbotron jumbotron-fluid bg-warning text-center" id={styles.divinleftest}>
                                    <div id={styles.divinleftestcontent}>
                                        <b className='fs-5'>Toplam direk montaj</b>
                                        <p className='fs-5'>0</p> 
                                    </div>
                            </div>
                        
                    </div>

                    <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-xs-12" id={styles.secondDiv}>
                        <div className="jumbotron jumbotron-fluid bg-warning text-center" id={styles.divinseconddiv}>
                            <div className={styles.divinseconddivcontent}>
                                <b className="fs-5">Direk Montaj Yapılamayan</b>
                                <p className='fs-5'>0</p>
                            </div>
                        </div>
                        <div className="jumbotron jumbotron-fluid bg-warning text-center" id={styles.divinseconddiv}>
                            <div className={styles.divinseconddivcontent}>
                                <b className="fs-5">Kapı Montaj Yapılamayan</b>
                                <p className='fs-5'>{grouppedWRTMountage && Object.keys(grouppedWRTMountage).length > 0 ? grouppedWRTMountage['3'].length : ""}</p>
                            </div>
                        </div>                        
                        <div className="jumbotron jumbotron-fluid bg-warning text-center" id={styles.divinseconddiv}>
                        <div className={styles.divinseconddivcontent}>
                                <b className="fs-5">Toplam Direk Montajı Yapılacaklar</b>
                                <p className='fs-5'>0</p>
                            </div>
                        </div>
                        <div className="jumbotron jumbotron-fluid bg-warning text-center" id={styles.divinseconddiv}>
                            <div className={styles.divinseconddivcontent}>
                                <b className='fs-5'>Toplam Kapı Montajı Yapılacaklar</b>
                                <p className='fs-5'>{grouppedWRTMountage && Object.keys(grouppedWRTMountage).length > 0 ? grouppedWRTMountage['1'].length : ""}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-xs-12" id={styles.mapBox}>

                        <div className='bg-warning' id={styles.mapngraphframe}>
                        <div className='row-fluid' id={styles.mapSelect}>
                            <select className="form-select my-4" onChange={(e) => mapOrGraphHandler(e)}>
                                <option selected>Lütfen seç</option>
                                <option value="map">HARİTA</option>
                                <option value="graph">GRAFİK</option>
                            </select>
                        </div>

                        <div className='container-fluid'>
                            {mapOrGraph && mapOrGraph === "graph" ? 
                            <>
                                 <div className="mb-2 p-2 bg-primary">
                                    <select onChange={(e) => handleMountageGraphShow(e)} className='form-select'>
                                            <option selected>Lütfen seçim yapınız</option>
                                            <option value="overall">GENEL GRAFİK</option>
                                            <option value="mountagevstime">GÜNLERE GÖRE MONTAJ</option>
                                            <option value="poverall">GENEL GRAFİK (DAİRE GRAFİĞİ)</option>
                                    </select>                                
                                </div> 
                                <div className="container container-fluid">
                                    {graphForm === "barchart" ? <BarChart data={data} className="my-2"/> : <PieChart data={data} className="my-2"/>}
                                </div>
                            </> 
                            : "Map"}
                        </div>
                        </div>
                    </div>
                    <div id={styles.personel} className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-xs-12 bg-warning text-center">
                        <div id={styles.personelList} className='text-center'>
                            <b className='fs-5'>Saha Personel Listesi</b>
                            {persons && Object.keys(persons).length > 0 ? 
                            <ul className='list-group'>
                                {
                                    persons.map(item => {
                                        return <li id={styles.person} onClick={() => setSelectedPerson(item)} className='list-group-item'>{item}</li>
                                    })
                                }
                            </ul>
                            : ""}
                        </div>
                        <div id={styles.staffHist}>
                                {personHist && personHist.length > 0 ? 
                                    personHist.map((item, index) => {
                                        return (
                                        <> 
                                        <hr/>
                                        <b>KAYIT NO:</b>
                                        <p>{index + 1}</p>
                                        <b>KAPI NO:</b>
                                        <p>{item.KAPINO}</p>
                                        <b>MAHALLE</b>
                                        <p>{item.MAHALLE}</p>
                                        <b>Montaj Tarih</b>
                                        <p>{item.MONTAJTARIH} {item.MONTAJSAAT}</p>
                                        <b>MONTAJ DURUM</b>
                                        <p>{parseMountageState(item.MONTAJDURUM)}</p>
                                        <hr/>    
                                        </>    
                                    )
                                    })
                                : ""}
                        </div>
                        <div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard2;