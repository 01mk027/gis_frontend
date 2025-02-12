import React, { useEffect, useState, version } from 'react'
import { useNavigate } from "react-router-dom"
import useAuth from '../../hooks/useAuth'
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import { axiosInstance } from '../../axios'
import useLogout from "../../hooks/useLogout"



const TempDash = () => {
    const { user, setUser } = useAuth()
    const axiosPrivateInstance = useAxiosPrivate()
    const navigate = useNavigate()
    const logout = useLogout()
    const [loading, setLoading] = useState(false)
    const [namespaces, setNamespaces] = useState([])
    const [activeNamespace, setActiveNamespace] = useState()
    const [projectList, setProjectList] = useState([])
    const [activeProject, setActiveProject] = useState()
    const [projectInfo, setProjectInfo] = useState()
    const [projectFileHistoryInfo, setProjectFileHistoryInfo] = useState()
    const [activeFile, setActiveFile] = useState()
    const [activeVersion, setActiveVersion] = useState();
    const [showProjectVersion, setShowProjectVersion] = useState(false)
    const [projectVersionInfo, setProjectVersionInfo] = useState([])
    const [projectChangesetInfo, setProjectChangesetInfo] = useState([])
    const [isActive, setIsActive] = useState("");


    async function onLogout() {
        setLoading(true)

        await logout()
        navigate('/')
    }

    useEffect(() => {
        async function getUser() {
            const { data } = await axiosPrivateInstance.get('auth/user')
            setUser(data)
        }

        getUser()
    }, [])

    useEffect(() => {
        async function getNamespaces()
        {
            await axiosPrivateInstance.get('mergintransactions/getnamespaceslist').then(res => {
                setNamespaces(res.data)
                console.log(res.data)
            })
        }
        getNamespaces()
    }, [])

    async function getProjectList(e, namespaceName){
        e.preventDefault();
        setActiveNamespace(namespaceName)
        //document.getElementById(e.target.id).classList.add('active');
        // tüm lileri al
        let namespaceHouse = document.querySelector('#namespaceHouse');
        let allChildren = namespaceHouse.querySelectorAll(":scope > li");
        for(let i=0; i<allChildren.length; i++){
            if(e.target.id === allChildren[i].id){
                allChildren[i].classList.add('active');
            }
            else{
                allChildren[i].classList.remove('active');
            }
        }
        await axiosPrivateInstance.post('mergintransactions/getprojectslist', JSON.stringify({
            namespace: namespaceName
        }), {
            headers: {
                "Content-Type":"application/json"
            }
        }).then(res => {
            console.log(res.data);
            setProjectList(res.data)
        }).catch(res => console.error(res))
    }

    async function getProjectInfo(e, projectName){
        setActiveProject(projectName)
        let projectHouse = document.querySelector('#projectHouse');
        let allChildren = projectHouse.querySelectorAll(":scope > li");
        for(let i=0; i<allChildren.length; i++){
            if(e.target.id === allChildren[i].id){
                allChildren[i].classList.add('active');
            }
            else{
                allChildren[i].classList.remove('active');
            }
        }

        await axiosPrivateInstance.post('mergintransactions/projectinfo', JSON.stringify({
            project_path_or_id: activeNamespace+"/"+activeProject
        }), {
            headers: {
                "Content-Type":"application/json"
            }
        }).then(res => {
            console.log(res.data);
            setProjectInfo(res.data)
        }).catch(res => console.error(res))
    }

    async function getProjectFileHistoryInfo(e, filePath){
        setActiveFile(filePath);
        let fileHouse = document.querySelector('#fileHouse');
        let allChildren = fileHouse.querySelectorAll(":scope > li");
        for(let i=0; i<allChildren.length; i++){
            if(e.target.id === allChildren[i].id){
                allChildren[i].classList.add('active');
            }
            else{
                allChildren[i].classList.remove('active');
            }
        }

        await axiosPrivateInstance.post('mergintransactions/projectfilehistoryinfo', JSON.stringify({
            project_path: activeNamespace+"/"+activeProject,
            file_path: filePath
        }), {
            headers: {
                "Content-Type":"application/json"
            }
        }).then(res => {
            console.log(res.data);
            setProjectFileHistoryInfo(res.data);
        }).catch(res => console.error(res))
    

    }

    async function openVersionInfoBox(e, versionInfo){
        setActiveVersion(versionInfo)
        let versionHouse = document.querySelector('#versionHouse');
        let allChildren = versionHouse.querySelectorAll(":scope > li");

        //eşitlik durumunu kontrol et...
        for(let i=0; i<allChildren.length; i++){
            if(e.target.id === allChildren[i].id){
                allChildren[i].classList.add('active');
            }
            else{
                allChildren[i].classList.remove('active');
            }
        }
    }


    async function getProjectVersionInfo(filePath, versionInfo){
        setShowProjectVersion(true);
        let toBeConv = versionInfo.slice(1, versionInfo.length);
        console.log(toBeConv)
        
        await axiosPrivateInstance.post('mergintransactions/projectversioninfo', JSON.stringify({
            project_path: activeNamespace+"/"+activeProject,
            version_info: Number(toBeConv)
        }), {
            headers: {
                "Content-Type":"application/json"
            }
        }).then(res => {
            console.log(res.data);
            setProjectVersionInfo(res.data)
        }).catch(res => console.error(res))

    }

    async function getProjectFileChangesetInfo(){
        setShowProjectVersion(false);
        let projectPath = activeNamespace+"/"+activeProject;
        let filePath = activeFile;
        let versionInfo = activeVersion;

        
        await axiosPrivateInstance.post('mergintransactions/projectfilechangesetinfo', JSON.stringify({
            project_path: projectPath,
            file_path: filePath,
            version_info: versionInfo 
        }), {
            headers: {
                "Content-Type":"application/json"
            }
        }).then(res => {
            console.log(res.data);
            setProjectChangesetInfo(res.data)
        }).catch(res => console.error(res))


    }


    /*
    PROJECT VERSION INFO
    0
: 
author
: 
"yavuzgullestok"
changes
: 
{added: Array(6), removed: Array(0), updated: Array(3)}
changesets
: 
{DUVAR_MONTAJ.gpkg: {…}, DİREK.gpkg: {…}, DİREK_TABELA.gpkg: {…}}
created
: 
"2024-03-27T16:33:47Z"
name
: 
"v102"
namespace
: 
"ERHAN CALISMALAR"
project_name
: 
"BODRUM_DUVARDIREKPROJE"
project_size
: 
569541376
user_agent
: 
"Input/2.5.0 (android/11.0)"
[[Prototype]]
: 
Object
    
    */


    const projectVersionInfoTemp = (projectVersionInfo) => {
 
    }



    return(
        <>
            <div className="container-fluid p-1 m-1">
                <div className="row">
                    <div className="col-4 border border-black text-center" style={{ minHeight: "89vh" }}>
                    <b className="my-6"><u>İSİM ALANLARI LİSTESİ</u></b>
                    <ul className="list-group" id="namespaceHouse">
                    {namespaces && namespaces.length > 0 ? namespaces.map(item => {
                        return(<li id={item.name} onClick={(e) => getProjectList(e, item.name)} className='list-group-item' style={{ cursor:"default" }}>{item.name}</li>)
                    }) : "Loading"}
                    </ul>
                    </div>
                    <div className="col-8 text-center">
                    <ul className='list-group' id="projectHouse">
                    {projectList && projectList.length > 0 ? projectList.map((item, index) => {
                        return( 
                            <>
                            <li id={item.name} className="list-group-item" onClick={(e) => getProjectInfo(e, item.name)} style={{ cursor:"default" }}>{item.name}</li>
                            {item.name === activeProject ? 
                            <div className="jumbotron jumbotron-fluid bg-warning">
                                Oluşturulma Tarihi: <p>{projectInfo && projectInfo.created}</p>
                                <h4><u>DOSYALAR</u></h4>
                                <ul className="list-group border border-success" id="fileHouse">
                                {projectInfo && projectInfo.files.map(file => {
                                    return(<>
                                        
                                            <li id={file.path} className="list-group-item bg-success" onClick={(e) => getProjectFileHistoryInfo(e, file.path)}><b>{file.path}</b></li>
                                            {projectFileHistoryInfo && projectFileHistoryInfo.history && activeFile === file.path ? 
                                            <ul className='list-group' id="versionHouse">
                                                {Object.keys(projectFileHistoryInfo.history).map(item => {
                                                    return(
                                                        <>
                                                        <li id={item} onClick={(e) => openVersionInfoBox(e, item)} className='list-group-item'>{item}</li>
                                                        {item === activeVersion ? 
                                                        <>
                                                            <div className='jumbotron jumbotron-fluid bg-info text-center' style={{ minHeight: '30vh' }}>
                                                                <div className='row'>
                                                                    <div className='col-6 my-2'>
                                                                    <button onClick={() => getProjectVersionInfo(file.path, item)} className='btn btn-sm btn-dark'>GET PROJECT VERSION INFO</button>                                                                    
                                                                    </div>
                                                                    <div className='col-6 my-2'>
                                                                    <button onClick={() => getProjectFileChangesetInfo()} className='btn btn-sm btn-dark'>GET PROJECT FILE CHANGESET INFO</button>                                                                    
                                                                    </div>
                                                                </div>
                                                                { showProjectVersion && projectVersionInfo ?
                                                                projectVersionInfo.map(item => {
                                                                    return(
                                                                    <>
                                                                        <h6>Yazar: {item.author}</h6>
                                                                        <h5><u>DEĞİŞİKLİKLER:</u></h5>
                                                                        {item && item.changes ? Object.keys(item.changes).map(change => {
                                                                            return(<>
                                                                                <h4 className='display-block'><u>{change.toUpperCase()}:</u></h4>
                                                                                {item.changes && item.changes[change].map(ch => {
                                                                                    return(<div className='row-fluid'>
                                                                                        <h6>Zaman: </h6> {ch.mtime}
                                                                                        <h6>Dosya: </h6> {ch.path}
                                                                                    </div>)
                                                                                })}
                                                                                </>
                                                                            )
                                                                        }): ""}
                                                                    </>
                                                                                            )
                                                                                        }) 
                                                                                        : 
                                                                projectChangesetInfo && projectChangesetInfo.map((changeset, index) => {

                                                                    return(<>
                                                                    <hr/>
                                                                    <h6><u>SIRA:</u></h6>
                                                                    <p>{index + 1}</p>
                                                                    <h6><u>TABLO:</u></h6>
                                                                    <p>{changeset.table}</p>
                                                                    <h6><u>TİP:</u></h6>
                                                                    <p>{changeset.type}</p>
                                                                    <h6><u>DEĞİŞİKLİKLER</u></h6>
                                                                    {
                                                                        changeset.changes && changeset.changes.map(changesetChanges => {
                                                                            {
                                                                                return(
                                                                                <div className='jumbotron jumbotron-fluid bg-danger'>
                                                                                    <h6>KOLON:</h6>
                                                                                    <p>{changesetChanges.column}</p>
                                                                                    <h6>İSİM:</h6>
                                                                                    <p>{changesetChanges.name}</p>
                                                                                    <h6>YENİ:</h6>
                                                                                    <p>{changesetChanges.new}</p>
                                                                                    <h6>ESKİ:</h6>
                                                                                    <p>{changesetChanges.old}</p>
                                                                                </div>
                                                                                )
                                                                            }
                                                                        })
                                                                    }
                                                                    <hr/>
                                                                    </>)

                                                                }) 
                                                                
                                                                }
                                                            </div>
                                                        </> : 
                                                        ""}
                                                        </>
                                                    )
                                                })}
                                            </ul> : ""}
                                </>    
                                )
                                
                                }
                                
                                )
                                
                                }
                                </ul>
                            </div> 
                            : ""}
                            </>
                        )
                    }) : "Proje bulunamadı."}
                    </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TempDash;