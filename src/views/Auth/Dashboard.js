import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css'
import * as d3 from "d3";
import BarChart from './BarChart';
import PieChart from './PieChart';



function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const [wholeData, setWholeData] = useState();
    const [totalRec, setTotalRec] = useState(0);
    const [willBeMounted, setWillBeMounted] = useState(0);
    const [mounted, setMounted] = useState(0);
    const [notMounted, setNotMounted] = useState(0);
    const [edited, setEdited] = useState(0);
    const [staffvwillBeMounted, setStaffVWillBeMounted] = useState([]);
    const [staffvBeMounted, setStaffVBeMounted] = useState([]);
    const [staffvNotMounted, setStaffVNotMounted] = useState([]);
    const [staffvEdited, setStaffVEdited] = useState([]);
    const [selectedStaffFilterCrit, setSelectedStaffFilterCrit] = useState();
    const [staffBox, setStaffBox] = useState([]);
    const [computedStaffBox, setComputedStaffBox] = useState([])
    const [data, setData] = useState([]);
    const [computedData, setComputedData] = useState([]);
    const [showGraph, setShowGraph] = useState(false);
    const [graphParam, setGraphParam] = useState();
    const [mountageVsTime, setMountageVsTime] = useState([]);
    const [timeGraphData, setTimeGraphData] = useState([]);
    const [graphForm, setGraphForm] = useState();
    

    useEffect(() => {
        if (typeof location.state == 'undefined' || location.state == null || Object.keys(location.state.data)[0] !== "KAPI") {
            navigate('/auth/tempdash2');
        }

        setWholeData(location.state);
        setTotalRec(location.state.data.KAPI.features.length);

        let durum1 = 0;
        let durum2 = 0;
        let durum3 = 0;
        let durum4 = 0;

        for(let i=0; i<location.state.data.KAPI.features.length; i++)
        {
            //console.log(i);
            //console.log(location.state.data.KAPI.features[i].properties);
            //setMountStates([...mountStates, location.state.data.KAPI.features[i].properties.MONTAJDURUM]);
            if(location.state.data.KAPI.features[i].properties.MONTAJDURUM === "1")
            {
                durum1++;
            }

            if(location.state.data.KAPI.features[i].properties.MONTAJDURUM === "2")
            {
                durum2++;
            }

            if(location.state.data.KAPI.features[i].properties.MONTAJDURUM === "3")
            {
                durum3++;
            }

            if(location.state.data.KAPI.features[i].properties.MONTAJDURUM === "4")
            {
                durum4++;
            }

        }
        setWillBeMounted(durum1);
        setMounted(durum2);
        setNotMounted(durum3);
        setEdited(durum4);
        //console.log(Object.groupBy(wholeData.features.properties, ({properties}) => properties.MONTAJDURUM))
    }, []);




    const handleSelection = (e) => {
        setStaffVBeMounted([]);
        setStaffVWillBeMounted([]);
        setStaffVNotMounted([]);
        setStaffVEdited([]);
        setSelectedStaffFilterCrit(e.target.value);
        setStaffBox([]);
        setComputedStaffBox([]);

        for(let i=0; i < wholeData.data.KAPI.features.length; i++)
            {
                if(wholeData.data.KAPI.features[i].properties.MONTAJDURUM === "1")    
                    setStaffVWillBeMounted(prevState => [...prevState, wholeData.data.KAPI.features[i].properties]);
    
                else if(wholeData.data.KAPI.features[i].properties.MONTAJDURUM === "2")    
                    setStaffVBeMounted(prevState => [...prevState, wholeData.data.KAPI.features[i].properties]);
                
                else if(wholeData.data.KAPI.features[i].properties.MONTAJDURUM === "3")    
                    setStaffVNotMounted(prevState => [...prevState, wholeData.data.KAPI.features[i].properties]);
                
                else if(wholeData.data.KAPI.features[i].properties.MONTAJDURUM === "4")    
                    setStaffVEdited(prevState => [...prevState, wholeData.data.KAPI.features[i].properties]);
    
            }
    
    }

    useEffect(() => {
            if(selectedStaffFilterCrit == "mdpss")
            {
               let grouppedMountsKeys = Object.keys(Object.groupBy(staffvBeMounted, ({MONTAJYAPAN}) => MONTAJYAPAN)) 
               let grouppedMounts = Object.groupBy(staffvBeMounted, ({MONTAJYAPAN}) => MONTAJYAPAN); 
               //console.log(grouppedMountsKeys);
               //console.log(grouppedMounts);//Bura bize lazım...
            
                if(Object.keys(grouppedMounts).length > 0)
                {
                    let staffBoxPre = [];
                    for(let j=0; j<Object.keys(grouppedMounts).length; j++)
                    {
                        //console.log(Object.keys(grouppedMounts)[j]);
                        //console.log(Object.keys(grouppedMounts)[j]+" "+grouppedMounts[Object.keys(grouppedMounts)[j]].length);
                        staffBoxPre.push({ staffName: Object.keys(grouppedMounts)[j], numberOfItems: grouppedMounts[Object.keys(grouppedMounts)[j]].length });
                    }
                    setStaffBox(staffBoxPre);
                }
               
               //console.log(grouppedMounts[0]);//"Ofiskontrol1"  
            }
            else if(selectedStaffFilterCrit == "umpss")
            {
                   let grouppedMountsKeys = Object.keys(Object.groupBy(staffvNotMounted, ({MONTAJYAPAN}) => MONTAJYAPAN)) 
                   let grouppedMounts = Object.groupBy(staffvNotMounted, ({MONTAJYAPAN}) => MONTAJYAPAN); 
                   //console.log(grouppedMountsKeys);
                   //console.log(grouppedMounts);//Bura bize lazım...
                
                    if(Object.keys(grouppedMounts).length > 0)
                    {
                        let staffBoxPre = [];
                        for(let j=0; j<Object.keys(grouppedMounts).length; j++)
                        {
                            //console.log(Object.keys(grouppedMounts)[j]);
                            //console.log(Object.keys(grouppedMounts)[j]+" "+grouppedMounts[Object.keys(grouppedMounts)[j]].length);
                            staffBoxPre.push({ staffName: Object.keys(grouppedMounts)[j], numberOfItems: grouppedMounts[Object.keys(grouppedMounts)[j]].length });
                        }
                        setStaffBox(staffBoxPre);
                    }
                   
                   //console.log(grouppedMounts[0]);//"Ofiskontrol1"  
            }
            else if(selectedStaffFilterCrit == "edpss")
                {
                   let grouppedMountsKeys = Object.keys(Object.groupBy(staffvEdited, ({MONTAJYAPAN}) => MONTAJYAPAN)) 
                   let grouppedMounts = Object.groupBy(staffvEdited, ({MONTAJYAPAN}) => MONTAJYAPAN); 
                   //console.log(grouppedMountsKeys);
                   //console.log(grouppedMounts);//Bura bize lazım...
                
                    if(Object.keys(grouppedMounts).length > 0)
                    {
                        let staffBoxPre = [];
                        for(let j=0; j<Object.keys(grouppedMounts).length; j++)
                        {
                            //console.log(Object.keys(grouppedMounts)[j]);
                            //console.log(Object.keys(grouppedMounts)[j]+" "+grouppedMounts[Object.keys(grouppedMounts)[j]].length);
                            staffBoxPre.push({ staffName: Object.keys(grouppedMounts)[j], numberOfItems: grouppedMounts[Object.keys(grouppedMounts)[j]].length });
                        }
                        setStaffBox(staffBoxPre);
                    }
                   
                   //console.log(grouppedMounts[0]);//"Ofiskontrol1"  
                }
    


    }, [selectedStaffFilterCrit])




    /*
    const handleMountageGraphShow = () => {
        if(!flag)
            setData([{ name: "Product A", value: 30 }, { name: "Product B", value: 80 }])
        else 
            setData([])
        setFlag(!flag)
    };
    */

    const handleMountageGraphShow = (e) => {
        setGraphParam(e.target.value);
        //setData([{name: "Osman", value: 42}, {name: "Hurra", value:88}])
        setShowGraph(true);
    }

    useEffect(() => {
        console.log("location.currentPath");
        console.log(location.currentPath)
    }, [])


    useEffect(() => {
        //console.log(data);
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
            for(let i=0; i<wholeData.data.KAPI.features.length; i++)
            {
                mountagevstime.push(wholeData.data.KAPI.features[i].properties);
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
        console.log(data);
    }, [data])


    return (
        <>
            <div className="row">
                <button onClick={() => alert("Not implemented yet!")} id={styles.refreshButton}  className='btn btn-success'>BİLGİLERİ YENİLE</button>
            </div>
            <div className='container bg-dark p-1 min-vh-100 min-vw-100'>
                    <div className="container my-4 p-0" style={{ minWidth: '80%' }}>
                        <div className="row g-3" >
                            
                            <div id={styles.dashbox} className="d-flex align-items-center flex-column bg-warning col-xl-2 col-bg-2 col-md-2 col-sm-12 col-xs-12 my-2 mx-1" style={{height: '200px', minWidth: '22%', padding: '5px', margin: '5%'}}>
                                <div className="mb-auto p-2"><b className='fs-5'>MONTAJI YAPILACAKLAR / TOPLAM SAYI</b></div>    
                                <div className="p-2"><b className='fs-5'>{willBeMounted}/{totalRec}</b></div>
                            </div>

                            <div id={styles.dashbox} className="d-flex align-items-center flex-column bg-warning col-xl-2 col-bg-2 col-md-2 col-sm-12 col-xs-12 my-2 mx-1" style={{height: '200px', minWidth: '22%', padding: '5px', margin: '5%'}}>
                                <div className="mb-auto p-2"><b className='fs-5'>MONTAJI YAPILANLAR / TOPLAM SAYI</b></div>    
                                <div className="p-2"><b className='fs-5'>{mounted}/{totalRec}</b></div>
                            </div>

                            <div id={styles.dashbox} className="d-flex align-items-center flex-column bg-warning col-xl-2 col-bg-2 col-md-2 col-sm-12 col-xs-12 my-2 mx-1" style={{height: '200px', minWidth: '22%', padding: '5px', margin: '5%'}}>
                                <div className="mb-auto p-2"><b className='fs-5'>TAKILMAYANLAR / TOPLAM SAYI</b></div>    
                                <div className="p-2"><b className='fs-5'>{notMounted}/{totalRec}</b></div>
                            </div>

                            <div id={styles.dashbox} className="d-flex align-items-center flex-column bg-warning col-xl-2 col-bg-2 col-md-2 col-sm-12 col-xs-12 my-2 mx-1" style={{height: '200px', minWidth: '22%', padding: '5px', margin: '5%'}}>
                                <div className="mb-auto  p-2"><b className='fs-5'>DÜZENLENENLER / TOPLAM SAYI</b></div>    
                                <div className="p-2"><b className='fs-5'>{edited}/{totalRec}</b></div>
                            </div>

                        </div>
                </div>
                


                
                    <div className="container my-4 p-0">
                        <div className="row g-3" style={{ minWidth: '90%' }}>
                            
                            <div id={styles.dashbox2} className="d-flex align-items-center flex-column bg-warning col-xl-4 col-bg-4 col-md-4 col-sm-12 col-xs-12 my-2 mx-2" style={{height: '200px', minWidth: '22%', padding: '5px', margin: '5%'}}>    
                                <div className=" p-2"><b className='fs-5'>MONTAJ DURUMU / ÇALIŞAN SAYISI</b></div>
                                <div className={`p-2 m-2`}>
                                <select onChange={(e) => handleSelection(e)} className='form-select'>
                                        <option selected>Lütfen seçim yapınız</option>
                                        <option value="mdpss">MONTAJI YAPILANLAR / ÇALIŞAN SAYISI</option>
                                        <option value="umpss">TAKILMAYANLAR / ÇALIŞAN SAYISI</option>
                                        <option value="edpss">DÜZENLENENLER / ÇALIŞAN SAYISI</option>
                                    </select>
                                </div>
                                <div class="p-2">
                                    {
                                        staffBox && staffBox.length > 0 ? 
                                        <>
                                        <table class="table">
                                        <thead>
                                            <tr>
                                            <th scope="col">Çalışan</th>
                                            <th scope="col">Sayı</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                staffBox.map(item => {
                                                    return(
                                                        <>
                                                        <tr>
                                                            <td>{item.staffName}</td>
                                                            <td>{item.numberOfItems}</td>
                                                        </tr>
                                                        </>
                                                    )
                                                })
                                            }
                                        </tbody>
                                        </table>
                                        </>
                                        : ""
                                    }
                                </div>

                                    
                            </div>

                            <div id={styles.dashGraph} className="d-flex align-items-center flex-column bg-warning col-xl-6 col-bg-6 col-md-6 col-sm-12 col-xs-12 my-2 mx-2" style={{height: '200px', minWidth: '22%', padding: '5px', margin: '5%'}}>
                                <div className="mb-2 p-2">
                                    <select onChange={(e) => handleMountageGraphShow(e)} className='form-select'>
                                            <option selected>Lütfen seçim yapınız</option>
                                            <option value="overall">GENEL GRAFİK</option>
                                            <option value="mountagevstime">GÜNLERE GÖRE MONTAJ</option>
                                            <option value="poverall">GENEL GRAFİK (DAİRE GRAFİĞİ)</option>
                                    </select>                                
                                </div>    
                                <div className="p-1">
                                    <div>
                                    {data && data.length > 0 && showGraph ? 
                                        graphForm && graphForm === "barchart" ? <BarChart data={data}/> : <PieChart data={data}/>
                                        
                                        : "Yok"}
                                    </div>
                                </div>
                                
                              
                            </div>
                        </div>
                    </div>
                </div>

            
        </>
    )
}

export default Dashboard;