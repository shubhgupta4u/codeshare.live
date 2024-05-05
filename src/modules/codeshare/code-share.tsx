import AceEditor from "react-ace";
import LoadingOverlay from 'react-loading-overlay-ts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Copy } from "@phosphor-icons/react";
import styles from "./code-share.module.css";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-github_dark";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { MenuItem, Theme } from "@/common/constants/enums";
import CodeSessionRepository from "./services/codesession-repository";
import { Code } from "./models/code";
import { Tooltip } from "react-tooltip";
import { Constants } from "@/common/constants/env-constant";
import { FormControl, InputLabel, NativeSelect, Slider, Switch } from "@mui/material";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";

export default function CodeShareComponent() {

    const defaultCode = new Code("", undefined, undefined);
    const defaultEditorOption = { autoSaving: false, fontSize: 14 };

    const theme = useSelector((state: RootState) => state.themeSliceReducer.theme);
    const menuClicked = useSelector((state: RootState) => state.menuClickedReducer);
 
    const [currentTheme, setCurrentTheme] = useState("github_dark");
    const [code, setCode] = useState(defaultCode)
    const [loading, setLoading] = useState({ isLoading: false, loadingText: "Processing ... " });
    const [sessionCode, setSessionCode] = useState<string | undefined>();
    const [writeAccessCode, setWriteAccessCode] = useState<string | undefined>();
    const [editorOption, setEditorOption] = useState(defaultEditorOption)
    const [sessionHistory, setSessionHistory] = useState<Array<any>>([])
    const [errorMessage,setErrorMessage]=useState("")
    const [domainName, setDomainName] = useState(Constants.DomainName.toLocaleLowerCase())
    const params = useParams();
    const router = useRouter();
    let unsubscribe:any;

    useEffect(() => {
        if(unsubscribe){
            unsubscribe();
        }
        if (sessionCode !== undefined && sessionCode?.length == 5 && writeAccessCode === undefined) {
             unsubscribe = CodeSessionRepository.subscribe(sessionCode, (data:any) => {
                if(data){
                    setCode(getCloneCode(data.code, data.writeAccessCode, data.created, data.modified));
                }
            });

            return () => {
                if(unsubscribe) 
                    unsubscribe();
            }
        }
    }, [sessionCode]);

    useEffect(() => {
        if (params && params.codes && params.codes.length > 0) {
            let sessionParam=null;
            let writeAccessParam=null;
            if (params.codes[0] && params.codes[0].length == 5) {
                sessionParam=params.codes[0];
                setSessionCode(sessionParam);
                setWriteAccessCode(undefined);
                if (params.codes.length > 1 && params.codes[1] && params.codes[1].length == 5) {
                    writeAccessParam=params.codes[1];
                    setWriteAccessCode(writeAccessParam);
                }
                loadData(sessionParam, writeAccessParam);
            }else{
                showNotFoundMessage(params.codes[0]);
            }           
        }
    }, [params]);
   
    useEffect(() => {
        setDomainName(window.location.origin);

        let editorOption: any = localStorage.getItem("editorOption");
        if (editorOption) {
            editorOption = JSON.parse(editorOption);
            if (!Object.keys(editorOption).concat("autoSaving") || !editorOption.autoSaving) {
                editorOption.autoSaving = false;
            }
            if (!Object.keys(editorOption).concat("fontSize") || !editorOption.fontSize) {
                editorOption.fontSize = 14;
            }
            setEditorOption(editorOption);
        }
        let sessionHistory: any = localStorage.getItem("sessionHistory")
        if (sessionHistory) {
            sessionHistory = JSON.parse(sessionHistory);
            setSessionHistory(sessionHistory);
        }
    }, [])

    useEffect(() => {
        if (menuClicked.menuItem == MenuItem.Save) {
            if((writeAccessCode!==undefined && sessionCode !==undefined) ||sessionCode ===undefined  ){
                saveClickedHandler();
            }else{
                setErrorMessage("Your active session is read-only and do not have permission to save!");
                handleShareModelOpen();
            }
        } else if (menuClicked.menuItem == MenuItem.NewSession) {
            newSessionClickedHandler();
        } else if (menuClicked.menuItem == MenuItem.Download) {
            downloadClickedHandler();
        } else if (menuClicked.menuItem == MenuItem.Upload) {
            if((writeAccessCode!==undefined && sessionCode !==undefined) ||sessionCode ===undefined  ){                
                uploadFileClickedHandler();
            }else{
                setErrorMessage("Your active session is read-only and do not have permission to upload!");
                handleShareModelOpen();
            }
        } else if (menuClicked.menuItem == MenuItem.Share) {
            handleShareModelOpen();
        } else if (menuClicked.menuItem == MenuItem.Setting) {
            handleShareModelOpen();
        } else if (menuClicked.menuItem == MenuItem.OpenCachedSession) {
            handleShareModelOpen();
        }
    }, [menuClicked]);

    useEffect(() => {
        switch (theme) {
            case Theme.Light: setCurrentTheme("github"); break;
            case Theme.LightPlus: setCurrentTheme("xcode"); break;
            case Theme.Dark: setCurrentTheme("ambiance"); break;
            case Theme.DarkPlus: setCurrentTheme("github_dark"); break;
        }
    }, [theme])

    const saveClickedHandler = () => {
        showLoading("Saving...")
        setTimeout(() => {
            SaveCode(code).then(() => {
                hideLoading();
            }).catch(() => {
                hideLoading();
            })
        }, 500);

    }
    const newSessionClickedHandler = () => {
        let sessionCode = localStorage.getItem("sessionCode");
        let writeAccessCode = localStorage.getItem("writeAccessCode")
        if (sessionCode && writeAccessCode) {
            sessionCode = JSON.parse(sessionCode)
            writeAccessCode = JSON.parse(writeAccessCode)
            addSessionHistory(sessionCode, writeAccessCode);
        }

        localStorage.removeItem("sessionCode");
        localStorage.removeItem("writeAccessCode");
        setSessionCode(undefined);
        setWriteAccessCode(undefined);
        setCode(defaultCode);
        router.push(`/`);
    }
    const addSessionHistory = (sessionCode: string|null, writeAccessCode: string|null) => {
        let history = [...sessionHistory];
        if (history && history.length > 0) {
            if(history.findIndex(s=>s.sessionCode===sessionCode)==-1){
                history.push({ sessionCode: sessionCode, writeAccessCode: writeAccessCode, created: `${new Date().toLocaleString()}` });
            }            

        } else {
            history = [{ sessionCode: sessionCode, writeAccessCode: writeAccessCode, created: `${new Date().toLocaleString()}` }];
        }
        setSessionHistory(history);
        localStorage.setItem("sessionHistory", JSON.stringify(history))
    }
    const downloadClickedHandler = () => {
        var element = document.createElement('a');
        const blob = new Blob([code.code], { type: 'text/plain' });
        element.href = window.URL.createObjectURL(blob);
        element.setAttribute('download', "codeshare.live.txt");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
    const uploadFileClickedHandler = () => {
        var input = document.createElement('input');
        input.type = "file";
        input.style.display = 'none';
        document.body.appendChild(input);

        setTimeout(() => {
            input.click();
        }, 500);

        input.addEventListener('change', (event: any) => {
            if (input.files) {
                const file = input.files[0];
                if (file) {
                    const fileReader = new FileReader();
                    fileReader.onload = () => {
                        const fileContent = fileReader.result as string;
                        const cloneCode=getCloneCode(fileContent,code.writeAccessCode?? writeAccessCode, code.created??undefined,code.modified?? undefined);
                        setCode(cloneCode);
                        if (editorOption.autoSaving) {
                            setTimeout(() => {
                                SaveCode(cloneCode);
                            }, 200);
                        }
                    };
                    fileReader.readAsText(file);
                }
            }

            document.body.removeChild(input);
        });
    }
    const showLoading = (loadingText: string | undefined) => {
        setLoading({ isLoading: true, loadingText: loadingText ?? "Processing ... " });
    }
    const hideLoading = () => {
        setLoading({ isLoading: false, loadingText: "Processing ... " });
    }
    const SaveCode = (localCode:Code) => {
        if (sessionCode !== undefined && writeAccessCode !== undefined) {
            return CodeSessionRepository.updateCodeSession(sessionCode, localCode).then((data: any)=>{
                if(localStorage.getItem("sessionCode")!==JSON.stringify(data.sessionCode)){
                    localStorage.setItem("sessionCode",JSON.stringify(data.sessionCode));
                    localStorage.setItem("writeAccessCode",JSON.stringify(data.writeAccessCode))
                    addSessionHistory(data.sessionCode,data.writeAccessCode);
                }
            });
        } else if (sessionCode === undefined && writeAccessCode === undefined) {
            return CodeSessionRepository.createCodeSession(localCode.code).then((data: any) => {
                if (data != undefined && data.sessionCode != null) {
                    setSessionCode(data.sessionCode);
                    setWriteAccessCode(data.writeAccessCode);
                    addSessionHistory(data.sessionCode,data.writeAccessCode);
                    setCode(getCloneCode(localCode.code, data.writeAccessCode, localCode.created, localCode.modified));
                    router.push(`/${data.sessionCode}/${data.writeAccessCode}`);
                }

            });
        } else {
            return new Promise(async (resolve, reject) => { resolve(false) });
        }
    }
    const getCloneCode = (code: string, writeAccessCode: string | undefined, created: string | undefined, modified: string | undefined) => {
        const newCode = new Code(code, undefined, undefined);
        newCode.writeAccessCode = writeAccessCode;
        newCode.created = created;
        newCode.modified = modified;
        return newCode
    }
    const loadData = (sessionCode: string | null, writeAccessCode: string | null) => {
        if (sessionCode != null) {
            showLoading("Loading data...")
            CodeSessionRepository.readSession(sessionCode, writeAccessCode).then((data: any) => {
                if (data != undefined) {
                    setSessionCode(sessionCode);
                    if (data.writeAccessCode && writeAccessCode === data.writeAccessCode) {
                        setWriteAccessCode(data.writeAccessCode);                        
                    }else{
                        setWriteAccessCode(undefined);  
                    }
                    setCode(getCloneCode(data.code, data.writeAccessCode, data.created, data.modified));
                }
                hideLoading();
            }).catch((e) => { 
                hideLoading(); 
                if(e=="Data not available"){
                    showNotFoundMessage(sessionCode);
                }
            });

        }
    }
    function showNotFoundMessage(param:string){
        setErrorMessage(`Your request session '${param}' is not found. Kindly verify your entered URL!`);
        handleShareModelOpen();
    }
    function onChange(newValue: any) {
        const cloneCode=getCloneCode(newValue, code.writeAccessCode, code.created, code.modified);
        setCode(cloneCode);

        if (editorOption.autoSaving) {
            setTimeout(() => {
                SaveCode(cloneCode);
            }, 200);
        }
    }
    const [open, setOpen] = useState(false);
    const handleShareModelOpen = () => {
        setOpen(true);
    }
    const handleShareModelClose = () => {
        if (menuClicked.menuItem === MenuItem.Share) {
            clearCopiedSuccessLabel();
        } else if (menuClicked.menuItem === MenuItem.Setting) {
            localStorage.setItem("editorOption", JSON.stringify(editorOption));
        }
        setErrorMessage("");
        setOpen(false);
    }
    const copyText = (text: string, readonly: boolean) => {
        navigator.clipboard.writeText(text);
        clearCopiedSuccessLabel();
        let className = "copy2";
        if (readonly) {
            className = "copy1";
        }
        const elements = document.getElementsByClassName(className);
        for (let i = 0; i < elements.length; i++) {
            elements.item(i)?.classList.add(styles.copy_success)
        }
    }
    const clearCopiedSuccessLabel = () => {
        const elements = document.getElementsByClassName("copy_success");
        for (let i = 0; i < elements.length; i++) {
            elements.item(i)?.classList.remove(styles.copy_success)
        }
    }
    const setAutoSaving = (val: boolean) => {
        setEditorOption({ autoSaving: val, fontSize: editorOption.fontSize });
    }
    const setFontSize = (val: number) => {
        setEditorOption({ autoSaving: editorOption.autoSaving, fontSize: val });
    }
    const loadCachedSession = () => {
        const element: any = document.getElementById("cachedSessionSelect");
        if (element && element.value) {
            const sessionrecord = sessionHistory.find(s => s.sessionCode === element.value);
            if (sessionrecord) {
                router.push(`/${sessionrecord.sessionCode}/${sessionrecord.writeAccessCode}`);
            }
            handleShareModelClose();
        }
    }
    return (
        <>
            <LoadingOverlay
                active={loading.isLoading}
                spinner
                text={loading.loadingText}
            ></LoadingOverlay>
            <AceEditor
                mode="java"
                theme={currentTheme}
                placeholder="Write or paste code here then share. Anyone you share with readonly URL will see code as it is typed!"
                height="100%"
                width="100%"
                fontSize={editorOption.fontSize}
                readOnly={(writeAccessCode === undefined || writeAccessCode === null) && sessionCode !== undefined}
                value={code.code}
                onChange={onChange}
                name="aceEditor"
                editorProps={{ $blockScrolling: true }}
            />
            <Modal
                open={open}
                onClose={handleShareModelClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>

                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        { menuClicked.menuItem === MenuItem.Share &&  "Share Code"}  
                        { menuClicked.menuItem === MenuItem.Setting &&  "Setting"}   
                        { (menuClicked.menuItem === MenuItem.Save|| menuClicked.menuItem === MenuItem.Upload) &&  "Not Authorized"}
                        { menuClicked.menuItem === MenuItem.OpenCachedSession &&  "Load Saved Session"}                           
                    </Typography>
                    <br />
                    <div id="shareModel" hidden={menuClicked.menuItem !== MenuItem.Share}>
                        <div>
                            <p className={styles.modeltext}>Anyone with access to this URL will see your code in real time.</p>
                            <div className={styles.form_field} hidden={sessionCode === undefined}>
                                <label className={styles.label}>Share this URL for <b>readonly view only</b></label>
                                <input className={styles.model_input} type="text" name="url" id="url" readOnly={true} value={`${domainName}/${sessionCode}`} />
                                <a onClick={() => { copyText(`${domainName}/${sessionCode}`, true) }}
                                    data-tooltip-id="my-tooltip"
                                    data-tooltip-content="Copy URL">
                                    <Copy weight="fill" className={styles.icon} /></a>
                                <span className={`${styles.copy} copy_success copy1`}>Copied!</span>
                            </div>
                            <div className={styles.form_field} hidden={sessionCode === undefined || writeAccessCode === undefined}>
                                <label className={styles.label}>Share this URL for allowing access with <b>write permission</b></label>
                                <input className={styles.model_input} type="text" name="url" id="url" readOnly={true} value={`${domainName}/${sessionCode}/${writeAccessCode}`} />
                                <a onClick={() => { copyText(`${domainName}/${sessionCode}/${writeAccessCode}`, false) }}
                                    data-tooltip-id="my-tooltip"
                                    data-tooltip-content="Copy URL">
                                    <Copy weight="fill" className={styles.icon} /></a>
                                <span className={`${styles.copy} copy_success copy2`}>Copied!</span>
                            </div>
                            <div className={styles.form_field} hidden={sessionCode !== undefined || writeAccessCode !== undefined}>
                                <label className={`${styles.label} ${styles.error}`}>No Active Session found, kindly first save the session before sharing it...</label>
                            </div>
                        </div>
                    </div>
                    <div id="settingModel" hidden={menuClicked.menuItem !== MenuItem.Setting}>
                        <div className={styles.form_field}>
                            <label className={styles.label}>Autosaving: </label>
                            <Switch checked={editorOption.autoSaving} onChange={() => { setAutoSaving(!editorOption.autoSaving) }} inputProps={{ 'aria-label': 'controlled' }} />
                        </div>


                        <div className={styles.form_field} >
                            <label className={styles.label}>Font Size: </label>
                            <Slider defaultValue={editorOption.fontSize} min={5} max={80} step={1} onChange={(e: any) => setFontSize(e.target.value)} aria-label="Default" valueLabelDisplay="auto" />
                        </div>
                    </div>
                    <div id="settingModel" hidden={menuClicked.menuItem !== MenuItem.OpenCachedSession}>
                        <div hidden={sessionHistory.length == 0} className={styles.form_field}>
                            <FormControl fullWidth>
                                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                    Cached Session:
                                </InputLabel>
                                <NativeSelect id="cachedSessionSelect" defaultValue={sessionCode}
                                >
                                    {
                                        sessionHistory.map((item: any) => (
                                            <option key={item.sessionCode} value={item.sessionCode}>{item.sessionCode} - {item.created}</option>
                                        ))
                                    }
                                </NativeSelect>
                            </FormControl>
                        </div>
                        <div className={styles.form_field} hidden={sessionHistory.length > 0}>
                            <label className={`${styles.label} ${styles.error}`}>No previously saved session found...</label>
                        </div>
                    </div>
                    <div id="settingModel" hidden={(menuClicked.menuItem !== MenuItem.Save && menuClicked.menuItem !== MenuItem.Upload) && (errorMessage === undefined || errorMessage === "")}>
                        <div className={styles.form_field}>
                            <label className={`${styles.label} ${styles.error}`}>{errorMessage}</label>
                        </div>
                    </div>
                    <Tooltip id="my-tooltip" />
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <div className={styles.modal_footer}><button className="btn btn-primary" onClick={handleShareModelClose}>Close</button></div>
                        <div hidden={menuClicked.menuItem !== MenuItem.Setting} className={styles.modal_footer}><button className="btn btn-secondary" onClick={() => { setEditorOption(defaultEditorOption); handleShareModelClose(); }}>Reset to Default</button></div>
                        <div hidden={sessionHistory.length == 0 || menuClicked.menuItem !== MenuItem.OpenCachedSession} className={styles.modal_footer}><button className="btn btn-primary-alt" onClick={() => { loadCachedSession(); }}>Load</button></div>
                    </div>

                </Box>
            </Modal >
        </>
    );
}
