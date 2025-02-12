import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from './EnhancedDashboard.module.css';
import { axiosPrivateInstance } from "../../axios";
import EnhancedSubDashboard from "./EnhancedSubDashboard";
import { useTranslation } from 'react-i18next';


function EnhancedDashboard() {
    const { t, i18n } = useTranslation();
    const [namespaces, setNamespaces] = useState([]);
    const [projects, setProjects] = useState([]);
    const [isProjectSelected, setIsProjectSelected] = useState(false)
    const [computedProjects, setComputedProjects] = useState([]);
    const [selectedNamespace, setSelectedNamespace] = useState("");
    const [computedSelectedNamespace, setComputedSelectedNamespace] = useState("");
    const [loadingNamespaces, setLoadingNamespaces] = useState(true);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [isNamespaceSelected, setIsNamespaceSelected] = useState(false);
    const [computedIsNamespaceSelected, setComputedIsNamespaceSelected] = useState(false);
    const [selectedProject, setSelectedProject] = useState("");
    const [computedSelectedProject, setComputedSelectedProject] = useState("");
    const [doesExist, setDoesExist] = useState(false);
    const [downloadingProject, setDownloadingProject] = useState(false);
    const [path, setPath] = useState();
    const [files, setFiles] = useState([]);
    const [numberOfLoadedFiles, setNumberOfLoadedFiles] = useState(0);
    const [allGpkgData, setAllGpkgData] = useState([]);
    const [containsNonEnglishLayerName, setContainsNonEnglishType] = useState(false);
    const [errorOnDownload, setErrorOnDownload] = useState("");

    const handleCheckboxChange = (e) => {
        setContainsNonEnglishType(e.target.checked);
    }




    useEffect(() => {
        //console.log("SEROO");

        async function getNamespaces() {
            await axiosPrivateInstance.get('mergintransactions/getnamespaceslist').then(res => {
                setNamespaces(res.data)
                setLoadingNamespaces(false);
                //console.log(res.data)
            }).catch(err => console.error(err));
        }


        getNamespaces()

    }, [])

    useEffect(() => {
        setComputedIsNamespaceSelected(isNamespaceSelected);
        setComputedSelectedNamespace(selectedNamespace);
    }, [isNamespaceSelected])


    useEffect(() => {
        setProjects([]);
        setDoesExist(false);
        setLoadingProjects(true);
        setIsProjectSelected(false);
        axiosPrivateInstance.post('mergintransactions/getprojectslist', JSON.stringify({
            namespace: selectedNamespace
        }), {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            //console.log(res.data);
            if (res.status === 200) {
                //console.log(res.data);
                setProjects(res.data)
                setLoadingProjects(false);
            }
        }).catch(res => {
            console.error(res);
            return;
        })
    }, [selectedNamespace]);

    /*
    useEffect(() => {
        axiosPrivateInstance.post('mergintransactions/getprojectslist', JSON.stringify({
            namespace: computedSelectedNamespace
        }), {
            headers: {
                "Content-Type":"application/json"
            }
        }).then(res => {
            //console.log(res.data);
            setProjects(res.data)
            setLoadingProjects(false);
            
        }).catch(res => console.error(res))
        
    }, [computedSelectedNamespace])
*/

    const handleNamespaceSelection = (e) => {
        setSelectedNamespace(e.target.value);
        setIsNamespaceSelected(true);
        setSelectedProject("");
        setIsProjectSelected(false);
    }

    const handleProjectSelection = (e) => {
        setSelectedProject(e.target.value);
        setIsProjectSelected(true);
    }

    useEffect(() => {
        axiosPrivateInstance.post('mergintransactions/doesexist', JSON.stringify({
            namespace: selectedNamespace,
            project_name: selectedProject
        })).then(res => {
            setDoesExist(res.data.doesExist)
            //console.log(res.data);
        }).catch(err => console.error(err));
    }, [selectedProject])


    const handleDownloadProject = async (e) => {
        setDownloadingProject(true);
        setErrorOnDownload("");
        await axiosPrivateInstance.post('mergintransactions/downloadproject', JSON.stringify({
            namespace: selectedNamespace,
            project_name: selectedProject
        })).then(res => {
            //console.log(res);
            axiosPrivateInstance.post('mergintransactions/doesexist', JSON.stringify({
                namespace: selectedNamespace,
                project_name: selectedProject
            })).then(res => {
                if (res.status === 200) {
                    setDoesExist(res.data.doesExist)
                    setDownloadingProject(false)
                }
            }).catch(err => console.error(err))
        }).catch(err => {
            setDownloadingProject(false)
            //console.error(err);
            if(err.response && err.response.data && err.response.data.errorMessage){
                setErrorOnDownload(err.response.data.errorMessage);
            }
        })
    }

    useEffect(() => {
        if (errorOnDownload && errorOnDownload.length > 0) {
            console.log(errorOnDownload);
    
            // Set a timeout to reset the error after 5 seconds
            const timeout = setTimeout(() => {
                setErrorOnDownload("");
            }, 5000);
    
            // Cleanup the timeout if errorOnDownload changes or component unmounts
            return () => clearTimeout(timeout);
        }
        else{
            console.log("errorOnDownload is empty");
        }
    }, [errorOnDownload]);
    


    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    useEffect(() => {
        if (isNamespaceSelected && isProjectSelected && doesExist) {
            setPath(`./../projects/${selectedProject}`);
            //console.log(selectedProject);
        }
        else {
            //console.log("go away");
        }

    }, [isNamespaceSelected, isProjectSelected, doesExist, selectedProject]);


    useEffect(() => {
        axiosPrivateInstance.post('mergintransactions/returnfilenames', JSON.stringify({
            path: path
        })).then(res => {
            //console.log(res.data);
            setFiles(res.data);
        }).catch(err => console.error(err));
    }, [path]);

    useEffect(() => {
        let fileContent = [];
        if (files.files && files.files.length > 0) {
            for (let i = 0; i < files.files.length; i++) {
                (async function (i) {
                    setTimeout(async () => {
                        //console.log(`Fetching data from URL ${i + 1}`);
                        setNumberOfLoadedFiles(i + 1);
                        await axiosPrivateInstance.post('mergintransactions/returnfilecontent', JSON.stringify({
                            path: path + `/${files.files[i]}`
                        })).then(res => {
                            //console.log(res.data);
                            fileContent.push({
                                fileName: files.files[i],
                                data: res.data
                            })
                        }).catch(err => {
                            console.error(err);
                        });
                    }, i * 2500);  // Delay each call by i * interval
                })(i);
                /*
                axiosPrivateInstance.post('mergintransactions/returnfilecontent', JSON.stringify({
                    path: path+`/${files.files[i]}`
                })).then(res => {
                    console.log(res.data)
                }).catch(err => {
                    console.error(err);
                });   
                 */
            }
            setAllGpkgData(fileContent);
            /*
            axiosPrivateInstance.post('mergintransactions/returnfilecontent', JSON.stringify({
                path: path+`/${e.target.id}`
            })).then(res => {
                console.log(res.data)
                setGpkgData(res.data)
                setActiveFile(e.target.id)
            }).catch(err => {
                console.error(err);
            });
            */
        }
    }, [files])

    useEffect(() => {
        if (files.files && numberOfLoadedFiles < files.files.length) {
            if (document.querySelector('#refreshButton'))
                document.querySelector('#refreshButton').setAttribute("disabled", "disabled");

            if (document.querySelector('#selectNamespace'))
                document.querySelector('#selectNamespace').setAttribute('disabled', 'disabled');

            if (document.querySelector('#selectProject'))
                document.querySelector('#selectProject').setAttribute('disabled', 'disabled');
        }
        else {
            if (document.querySelector('#refreshButton'))
                document.querySelector("#refreshButton").removeAttribute("disabled");

            if (document.querySelector('#selectNamespace'))
                document.querySelector('#selectNamespace').removeAttribute('disabled');

            if (document.querySelector('#selectProject'))
                document.querySelector('#selectProject').removeAttribute('disabled');
        }
    }, [numberOfLoadedFiles])


    const pullChanges = async () => {


        await axiosPrivateInstance.post('mergintransactions/pullchanges', JSON.stringify({
            project_name: selectedProject
        })).then(res => {
            console.log(res)
            if(res.status === 200){
                console.log("Updating complete...");
                window.location.reload();
            }
        }).catch(err => {
            console.error(err);
        });

    }


    return (
        <>
        
        {
            errorOnDownload && errorOnDownload.length > 0 ? 
            <div className="d-flex justify-content-center flex-nowrap bg-dark">
             <div className="bg-danger text-white mx-2 p-2 w-75 text-wrap text-center border border-white rounded">
                {errorOnDownload}
            </div>
             
          </div> 
            : ""
        }
            <div className="container bg-dark" id={styles.mainFrame}>
                <div className="row text-center">
                    <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-xs-12" id={styles.namespaceSelectionFrame} key={Math.floor(Math.random() * 10000000000)}>
                        <b className="fs-5 text-light">{t('enhancedDashboardNamespaceSelection')}</b>
                        <select onChange={(e) => handleNamespaceSelection(e)} value={selectedNamespace} className="form-select" aria-label="Default select example" id="selectNamespace">
                            <option value="-1" selected>{loadingNamespaces ? t('enhancedDashboardNamespacesAreLoading') : t('enhancedDashboardPleaseSelectNamespace')}</option>
                            {
                                namespaces.map((item, index) => {

                                    return (
                                        <>
                                            <option value={item.name}>{item.name}</option>
                                        </>

                                    )
                                })
                            }

                        </select>
                    </div>


                    <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-xs-12" id={styles.refreshProjectFrame}>
                        {isNamespaceSelected && isProjectSelected && doesExist ? <button id="refreshButton" onClick={() => pullChanges()} className="btn btn-sm btn-danger">{t('enhancedDashboardRefreshProject')}</button> : ""}
                    </div>


                    <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-xs-12" id={styles.projectSelectionFrame}>
                        <b className="fs-5 text-light">{t('enhancedDashboardProjectSelection')}</b>
                        <select onChange={(e) => handleProjectSelection(e)} value={selectedProject} className="form-select" aria-label="Default select example" id="selectProject">
                            <option value="-1" selected>{computedIsNamespaceSelected ? loadingProjects ? t('enhancedDashboardProjectsLoading') : projects.length > 0 ? t('enhancedDashboardChooseProject') : t('enhancedDashboardProjectNotFound') : t('enhancedDashboardNamespaceNotSelected')}</option>
                            {
                                projects && projects.map(project => {
                                    return (
                                        <option value={project.name}>{project.name}</option>
                                    )
                                })
                            }

                        </select>
                    </div>


                </div>



                <div className="container-fluid text-center" id={styles.subMainFrame}>
                    {
                        isNamespaceSelected && isProjectSelected && doesExist ?
                            files.files && files.files.length && numberOfLoadedFiles !== files.files.length ? <h1 className="text-light">{t('enhancedDashboardFilesLoading')} {numberOfLoadedFiles}/{files.files.length}</h1> :
                                <EnhancedSubDashboard data={allGpkgData} files={files} selectedProject={selectedProject} selectedNamespace={selectedNamespace}/>
                            :
                            isNamespaceSelected && isProjectSelected && projects.length > 0 && (selectedProject != -1 || selectedProject != "-1") ? <button id={selectedProject} onClick={(e) => handleDownloadProject(e)} className="btn btn-lg btn-success" disabled={downloadingProject}>{downloadingProject ? `${selectedProject} ${t('enhancedDashboardDownloadInProgress')}` : `${t('enhancedDashboardDownloadProject')} ${selectedProject}`}</button> : ""
                    }
                </div>
            </div>
        </>
    )
}

export default EnhancedDashboard;