import React, {useState, useEffect} from 'react'
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import { axiosInstance } from '../../axios'
import Dashboard from './Dashboard';
import { useNavigate, Link } from 'react-router-dom';
import LineChart from './LineChart';

function TempDash2()
{
    
    const axiosPrivateInstance = useAxiosPrivate()
    const [namespaces, setNamespaces] = useState([])
    const [projects, setProjects] = useState([])
    const [activeNamespace, setActiveNamespace] = useState()
    const [activeProject, setActiveProject] = useState()
    const [computedActiveProject, setComputedActiveProject] = useState()
    const [activeProjectInfo, setActiveProjectInfo] = useState()
    const [computedActiveProjectInfo, setComputedActiveProjectInfo] = useState()
    const [projectVersions, setProjectVersions] = useState([])
    const [files, setFiles] = useState(new Set())
    const [activeFile, setActiveFile] = useState()
    const [computedActiveFile, setComputedActiveFile] = useState()
    const [changesetInfo, setChangesetInfo] = useState([])
    const [numbersWrtVersions, setNumbersWrtVersions] = useState([])
    const [isNamespaceSelected, setIsNamespaceSelected] = useState(false)
    const [isProjectSelected, setIsProjectSelected] = useState(false)
    const [isComputedProjectSelected, setIsComputedProjectSelected] = useState(false)
    const [isPrintable, setIsPrintable] = useState(false)
    const [existanceState, setExistanceState] = useState(false)
    const [existanceText, setExistanceText] = useState("")
    const [doesExist, setDoesExist] = useState(false)
    const [computedDoesExist, setComputedDoesExist] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [path, setPath] = useState('');
    const [computedExistanceState, setComputedExistanceState] = useState(false);
    const [geopackageFile, setGeopackageFile] = useState([])
    const [gpkgData, setGpkgData] = useState();
    const [activeGpkgFile, setActiveGpkg] = useState("");

    useEffect(() => {
        async function getNamespaces()
        {
            await axiosPrivateInstance.get('mergintransactions/getnamespaceslist').then(res => {
                setNamespaces(res.data)
                //console.log(res.data)
            })
        }
        getNamespaces()
    }, [])

    /*
    useEffect(() => {
        async function receiveVersions(){
            await axiosPrivateInstance.post('mergintransactions/receiveversions', JSON.stringify({
                project_path: activeNamespace+"/"+computedActiveProject
            })).then(async (res) => {
                setProjectVersions(res.data)
                console.log(res.data)
                let filesTmp = new Set()
                for(let i=0; i<res.data.length; i++){
                    //console.log(Object.keys(res.data[i].changes));
                    //console.log(res.data[i].changes[Object.keys(res.data[i].changes)[0]]);
                    for(let j=0; j<Object.keys(res.data[i].changes).length; j++){
                        //console.log(Object.keys(res.data[i].changes)[i]);
                        //console.log(res.data[i].changes[Object.keys(res.data[i].changes)[j]]);
                        if(res.data[i].changes[Object.keys(res.data[i].changes)[j]].length > 0){
                            for(let k=0; k<res.data[i].changes[Object.keys(res.data[i].changes)[j]].length; k++){
                                if(res.data[i].changes[Object.keys(res.data[i].changes)[j]][k].path.includes(".gpkg")){
                                    filesTmp.add(res.data[i].changes[Object.keys(res.data[i].changes)[j]][k].path)
                                }
                            }
                        }
                    }
                }
                setFiles(new Set(filesTmp))
            }).catch(err => console.error(err))
        }

        receiveVersions()
    }, [computedActiveProject])
    */


    
    async function getFileChangesetInfo()
    {
        return 6;
        //project_path, file_path, version_info
    }

    const handleNamespaceSelect = async (e) => {
        //console.log(e.target.value)
        setIsNamespaceSelected(true)
        setActiveNamespace(e.target.value)
        await axiosPrivateInstance.post('mergintransactions/getprojectslist', JSON.stringify({
            namespace: e.target.value
        }), {
            headers: {
                "Content-Type":"application/json"
            }
        }).then(res => {
            //console.log(res.data);
            setProjects(res.data)
            if(res.data.length == 0){
                document.getElementById("projectList").disabled = true;
            }
            else{
                document.getElementById("projectList").disabled = false;
            }
        }).catch(res => console.error(res))
    }

    const handleProjectSelect = async (e) => {
        setActiveProject(e.target.value);
        axiosPrivateInstance.post('mergintransactions/doesexist', JSON.stringify({
            namespace: activeNamespace,
            project_name: computedActiveProject
        })).then(res => {
            setDoesExist(res.data.doesExist)
        }).catch(err => console.error(err));
    }

    useEffect(() => {
        if(activeProject){
            setComputedActiveProject(activeProject)
            setIsComputedProjectSelected(true) 
            setGeopackageFile([]);
        }
    }, [activeProject])


    
    useEffect(() => {
        axiosPrivateInstance.post('mergintransactions/doesexist', JSON.stringify({
            namespace: activeNamespace,
            project_name: computedActiveProject
        })).then(res => {
            setDoesExist(res.data.doesExist)
            setPath(`./../projects/${computedActiveProject}`);
        }).catch(err => console.error(err));
        
    }, [computedActiveProject])

    useEffect(() => {
        setComputedDoesExist(doesExist)
        console.log(computedDoesExist)
        if(!isNamespaceSelected && !isComputedProjectSelected){
            setExistanceText("");
            setExistanceState(false);
        }
        else{
            if(doesExist){
                setExistanceText("Dosyaları gör");
                setExistanceState(true);
                setPath(`./../projects/${computedActiveProject}`);

            }
            else{
                setExistanceText("Projeyi indir");
                setExistanceState(true);
            }
        }
    }, [doesExist])


 

    /*
    useEffect(() => {
         axiosPrivateInstance.post('mergintransactions/projectinfo', JSON.stringify({
            project_path_or_id: activeNamespace+"/"+computedActiveProject
        }), {
            headers: {
                "Content-Type":"application/json"
            }
        }).then(async res => {
            setActiveProjectInfo(res.data)
            console.log("PROJECT INFO");
            console.log(res.data);
            console.log("PROJECT INFO");
            let lastVersionAsNumber = Number(res.data.version.slice(1, res.data.length));
            let versionArrayAsString = [];
            let versionArrayAsNumber = [];
            for(let i=1; i<=lastVersionAsNumber; i++)
            {
                versionArrayAsString.push("v"+i);
                versionArrayAsNumber.push(i);
            }
            /*
            for(let i=0; i<res.data.files.length; i++){
                for(let j=0; j<versionArrayAsString.length; j++){
                    //console.log(i+" "+versionArrayAsString[j]);
                       if(res.data.files[i].path.includes(".gpkg")){
                            
                            await axiosPrivateInstance.post('mergintransactions/projectfilechangesetinfo', JSON.stringify({
                                project_path: activeNamespace+"/"+computedActiveProject,
                                file_path: res.data.files[i].path,
                                version_info: versionArrayAsString[j] 
                            }), {
                                headers: {
                                    "Content-Type":"application/json"
                                }
                            }).then(res => {
                                //console.log("versiyon");
                                //console.log(versionArrayAsString[j]);
                                //console.log(res.data);
                                //setProjectChangesetInfo(res.data)
                            }).catch(res => console.error(res))
                        }
                    }
            }
        }).catch(res => console.error(res))
    }, [computedActiveProject])
    /*
    const handleProjectSelect = async (e) => {
        //setActiveProject("")
        setActiveProject(e.target.value)
        

        await axiosPrivateInstance.post('mergintransactions/projectinfo', JSON.stringify({
            project_path_or_id: activeNamespace+"/"+e.target.value
        }), {
            headers: {
                "Content-Type":"application/json"
            }
        }).then(async res => {
            //console.log("PROJECT INFO");
            //console.log(res.data);
            //setActiveProject(res)
            setActiveProjectInfo(res.data)
            let lastVersionAsNumber = Number(res.data.version.slice(1, res.data.length));
            let versionArrayAsString = [];
            let versionArrayAsNumber = [];
            for(let i=1; i<=lastVersionAsNumber; i++)
            {
                versionArrayAsString.push("v"+i);
                versionArrayAsNumber.push(i);
            }
            
            for(let i=1; i<versionArrayAsNumber.length; i++)
            {
                console.log(activeProjectInfo.files.length+" "+activeProject);
                /*
                await axiosPrivateInstance.post('mergintransactions/projectversioninfo', JSON.stringify({
                    project_path: activeNamespace+"/"+activeProject,
                    version_info: versionArrayAsNumber[i] 
                }), {
                    headers: {
                        "Content-Type":"application/json"
                    }
                }).then(res => {
                    //console.log(res.data);
                    //setProjectVersionInfo(res.data)
                }).catch(res => {
                    console.error(res)
                    //console.log(activeNamespace+" "+activeProject)

                }           
                )
  


                    {projectVersions && projectVersions.length > 0 ? projectVersions.map(item => {
                        return(<>
                            <div className='jumbotron jumbotron-fluid bg-success'>
                                <p>{item.name}</p>
                                
                                <b>Yazar </b>:<p>{item.author}</p>
                                {Object.keys(item.changes).length > 0 ? 
                                Object.keys(item.changes).map(it => {
                                    return(<div className='jumbotron jumbotron-fluid'>
                                        <b>{it}</b> 
                                        {item.changes[it].map(i => {
                                            return(<>
                                            <div className='jumbotron jumbotron-fluid bg-warning'>
                                                <h6>{i.change}</h6>
                                                <h6>{i.path}</h6>
                                                <h6>{i.mtime}</h6>
                                            </div>
                                            </>)
                                        })}
                                    </div>)
                                })
                                : ""}
                                {
                                    item && Object.keys(item.changesets).length > 0 ? "Var" : "Yok"
                                }
                            </div>
                        </>)
                    }) : ""}

            }

        }).catch(res => console.error(res))
    }
*/




    /*
    useEffect(() => {
        const fetchInfo = async () => {
            setChangesetInfo([]);
            for(let i=0; i<projectVersions.length; i++)
                {
                    await axiosPrivateInstance.post('mergintransactions/projectfilechangesetinfo', JSON.stringify({
                        project_path: activeNamespace+"/"+computedActiveProject,
                        file_path: activeFile,
                        version_info: projectVersions[i].name
                    }), {
                        headers: {
                            "Content-Type":"application/json"
                        }
                    }).then(res => {
                        setNumbersWrtVersions(prevState => [...prevState, {
                            "version": projectVersions[i].name,
                            "numberOfRecords": res.data.length
                        }]);


                        //console.log(projectVersions[i].name)
                        //console.log(res.data);
                        for(let i=0; i<res.data.length; i++)
                        {
                            setChangesetInfo(prevState => [...prevState, res.data[i]])
                        }
                    }).catch(err => {
                        //console.log(activeFile)
                        //console.error(err)
                    })
                }

                await axiosPrivateInstance.post('mergintransactions/projectfilehistoryinfo', JSON.stringify({
                    project_path: activeNamespace+"/"+computedActiveProject,
                    file_path: activeFile
                })).then(res => 
                    {
                        //console.log(res.data)
                    }
                ).catch(err => console.log(err))

                
                
        }
        fetchInfo()
    }, [activeFile]);
    */

    const handleReportShow = () => {
        //console.log(numbersWrtVersions);
        for(let i=0; i<changesetInfo.length; i++)
        {
            for(let j=0; j<changesetInfo[i].changes.length; j++){
                //console.log(i+" "+j+" "+changesetInfo[i].changes[j].name+" "+changesetInfo[i].changes[j].new)
                if(changesetInfo[i].changes[j].name === "MONTAJDURUM"){
                    //console.log(changesetInfo[i].changes[j].name+" "+changesetInfo[i].changes[j].new)
                }
            }
        }
    }


    /*

    useEffect(() => {
        setIsComputedProjectSelected(isProjectSelected)
        setIsPrintable(isNamespaceSelected && computedIsProjectSelected)
        //console.log("computedIsProj,....")
        //console.log(computedIsProjectSelected)
        //console.log("is namespace selected")
        //console.log(isNamespaceSelected)
    }, [isNamespaceSelected, isProjectSelected])

    useEffect(() => {
        //console.log(activeNamespace+" "+computedActiveProject)
        axiosPrivateInstance.post('mergintransactions/doesexist', JSON.stringify({
            namespace: activeNamespace,
            project_name: computedActiveProject
        })).then(res => {
            //console.log("does exist")
            //console.log(res.data.doesExist)
            setDoesExist(res.data.doesExist)
            //console.log("isPrintable")
            //console.log(isPrintable)
            //setExistanceState(res.data.doesExist && isPrintable)
            //console.log("doesExist")
            //console.log(doesExist)
            //console.log(existanceState)
            //console.log(existanceState)
        }).catch(err => console.error(err))
    }, [computedActiveProject])

*/


/*
    useEffect(() => {
        axiosPrivateInstance.post('mergintransactions/doesexist', JSON.stringify({
            namespace: activeNamespace,
            project_name: activeProject
        })).then(res => {
            console.log("does exist")
            console.log(res.data.doesExist)
            setDoesExist(res.data.doesExist)
        }).catch(err => console.error(err))

        if(!isPrintable || isPrintable === false){
            setExistanceState(false)
            setExistanceText("")
        }
        else if(isPrintable === true && doesExist === false){
            setExistanceState(false)
            setExistanceText("Projeyi indir")
        }
        else if(isPrintable === true && doesExist === true){
            setExistanceState(true)
            setExistanceText("Dosyaları görüntüle")
        }
    }, [isPrintable, doesExist])
*/
    const handleDownloadProject = async () => {
        //alert(activeNamespace+" "+computedActiveProject)
        setIsLoading(true);
        await axiosPrivateInstance.post('mergintransactions/downloadproject', JSON.stringify({
            namespace: activeNamespace,
            project_name: computedActiveProject
        })).then(res => {
            console.log(res);
            axiosPrivateInstance.post('mergintransactions/doesexist', JSON.stringify({
                namespace: activeNamespace,
                project_name: activeProject
            })).then(res => {
                if(res.status === 200)
                {
                    setDoesExist(res.data.doesExist)
                    setExistanceState(true);
                    setExistanceText("Dosyaları gör")
                    setIsLoading(false)
                }
            }).catch(err => console.error(err))
        }).catch(err => {
            setIsLoading(false)
            console.error(err);
        })
            
    }

    const listGeopackages = async () => {
        await axiosPrivateInstance.post('mergintransactions/returnfilenames', JSON.stringify({
            path: path
        })).then(res => {
            console.log(res.data);
            setGeopackageFile(res.data);
        }).catch(err => console.error(err));
    }


    useEffect(() => {
        setComputedExistanceState(existanceState)
    }, [existanceState])


    async function handleFileContentPrint(e){
        //console.log(path+`/${e.target.id}`);
        await axiosPrivateInstance.post('mergintransactions/returnfilecontent', JSON.stringify({
            path: path+`/${e.target.id}`
        })).then(res => {
            console.log(res.data)
            setGpkgData(res.data)
            setActiveFile(e.target.id)
        }).catch(err => {
            console.error(err);
        });
    }

    useEffect(() => {
        setComputedActiveFile(activeFile)
    }, [activeFile])
    function callComponent(){
        return <Dashboard />
    }

    const navigate = useNavigate();


    function handleForgive()
    {
        setGpkgData(null);
        setActiveFile(null);
    }

    return(
        <>
            <div className='container p-0 m-0' style={{ minWidth: '100%' }}>
                <div className='row p-0 m-0'>
                    <div className='col-12 jumbotron jumbotron-fluid bg-info p-2 text-center'>
                    {
                        isLoading ? <span><h6>{computedActiveProject} isimli proje yükleniyor...</h6></span> : ""
                    }
                        <b>İSİM ALANI SEÇ</b>
                        <select onChange={(e) => handleNamespaceSelect(e)} className="form-select" aria-label="Default select example">
                            <option selected>Lütfen bir isim alanı seçiniz</option>
                            {namespaces && namespaces.map(item => {
                                return(
                                    <option value={item.name}>{item.name}</option>
                                )
                            })}
                            
                        </select>
                    </div>

                    <div className='col-12 jumbotron jumbotron-fluid bg-warning p-2'>
                        <select onClick={(e) => {
                            setActiveProject("");
                            setIsProjectSelected(false)
                            }} onChange={(e) => handleProjectSelect(e)} id="projectList" className="form-select" aria-label="Default select example">
                            <option selected>{projects && projects.length > 0 ? "Lütfen proje seçiniz" : "Proje bulunamadı."}</option>
                            {
                                projects && projects.map(item => {
                                    return(
                                        <option value={item.name}>{item.name}</option>
                                    )
                                })
                            }
                            
                        </select>
                    </div>

                    {
                        isNamespaceSelected && isComputedProjectSelected ? <button onClick={() => computedDoesExist ? listGeopackages() : handleDownloadProject()}>{computedDoesExist ? "Dosyaları gör" : "Projeyi indir"}</button> : ""
                    }

                    <div className="jumbotron jumbotron-fluid text-center bg-warning">
                    {geopackageFile.files && geopackageFile.files.length > 0 ? 
                    <>
                    <h3>Dosyaların Listesi</h3> 
                    <b>Dosya içeriğini görüntülemek için butona tıklayın.</b>
                    </>
                    : 
                    ""}
                    <ul className='list-group'>
                    {
                        geopackageFile.files && geopackageFile.files.map(file => {
                            return(
                                <li className="list-group-item m-1 bg-warning">
                                    {gpkgData === null || gpkgData === undefined ?                                     
                                    <button id={file} onClick={(e) => {
                                        handleFileContentPrint(e);
                                        }} className='btn btn-block bg-info'>{file}
                                    </button> : file === activeFile ? 
                                    <>
                                    <button className="btn btn-success m-2" onClick={() => navigate('/auth/dashboard', {state: {data: gpkgData, currentPath: activeNamespace+"/"+computedActiveProject, currentFile: computedActiveFile} })}>{computedActiveFile} DOSYASI İÇİN DASHBOARDA GİT</button>
                                    <button className="btn btn-danger m-2" onClick={() => handleForgive()}>VAZGEÇ</button>
                                    </>
                                    : ""    
                                }
                                        
                                                                        
                                </li>
                            )
                        })
                    }
                    </ul>
                    </div>        
                </div>
            </div>
        </>
    )
}

export default TempDash2;