import AceEditor from "react-ace";
import { config } from 'ace-builds';

config.set(
    "basePath",
    "https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/"
);
config.setModuleUrl(
    "ace/mode/javascript_worker",
    "https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/worker-javascript.js"
);
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-github_dark";

// import "ace-builds/src-noconflict/theme-monokai";
// import "ace-builds/src-noconflict/theme-tomorrow";
// import "ace-builds/src-noconflict/theme-kuroir";
// import "ace-builds/src-noconflict/theme-twilight";
// import "ace-builds/src-noconflict/theme-textmate";
// import "ace-builds/src-noconflict/theme-dracula";
// import "ace-builds/src-noconflict/theme-solarized_dark";
// import "ace-builds/src-noconflict/theme-chaos";
// import "ace-builds/src-noconflict/theme-chrome";
// import "ace-builds/src-noconflict/theme-cloud9_day";
// import "ace-builds/src-noconflict/theme-cloud9_night";
// import "ace-builds/src-noconflict/theme-dreamweaver";
// import "ace-builds/src-noconflict/theme-eclipse";
// import "ace-builds/src-noconflict/theme-vibrant_ink";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { MenuItem, Theme } from "@/common/constants/enums";
import CodeSessionRepository from "./services/codesession-repository";
import { Code } from "./models/code";

export default function CodeShareComponent() {
    // const themes = ["dracula","ambiance","chaos","chrome","cloud9 day","cloud9 night","dreamweaver","github_dark","vibrant_ink","monokai", "github", "tomorrow", "kuroir", "twilight", "xcode", "textmate", "terminal"];

    const [currentTheme, setCurrentTheme] = useState("github_dark");
    const [code, setCode] = useState(new Code("", undefined, undefined))
    const theme = useSelector((state: RootState) => state.themeSliceReducer.theme);
    const menuClicked = useSelector((state: RootState) => state.menuClickedReducer);
    useEffect(() => {
        const sessionCode = localStorage.getItem("sessionCode");
        if (sessionCode != null) {
            CodeSessionRepository.readSession(sessionCode).then((data: any) => {
                if (data != undefined) {
                    setCode(new Code(data.code, data.created, data.modified));
                }
            })
        }
    }, [])
    useEffect(() => {
        if (menuClicked.menuItem == MenuItem.Save) {
            console.log(menuClicked);
            const sessionCode = localStorage.getItem("sessionCode");
            console.log(sessionCode);
            if (sessionCode != null) {
                CodeSessionRepository.updateCodeSession(sessionCode, code);
            } else {
                CodeSessionRepository.createCodeSession(code.code);               
            }
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
    // const onThemeChange=(event:any)=>{
    //     setCurrentTheme(event.target.value);
    //     console.log(event.target.value);
    // }
    function onChange(newValue: any) {
        console.log(newValue);
        setCode(new Code(newValue,code.created,code.modified));
    }
    return (
        <>
            {/* <div>{currentTheme}</div> */}
            {/* <select onChange={onThemeChange}>
            {
                themes.map(t=>(
                    <option value={t}>{t}</option>
                ))
            }
        </select> */}
            <AceEditor
                mode="java"
                theme={currentTheme}
                height="100%"
                width="100%"
                value={code.code}
                onChange={onChange}
                name="aceEditor"
                editorProps={{ $blockScrolling: true }}
            />
        </>
    );
}
