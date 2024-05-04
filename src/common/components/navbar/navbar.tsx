import styles from "@/common/components/navbar/navbar.module.css";
import { MenuItem, Theme } from "@/common/constants/enums";
import { setTheme } from "@/common/state/themeSlice";
import { setMenuClicked } from "@/common/state/menuClickedSlice";
import { RootState } from "@/store/store";
import { FloppyDisk, Share, Sun, SunHorizon, Moon, MoonStars, Palette, FilePlus, Gear, DownloadSimple } from "@phosphor-icons/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function NavBar() {
    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.themeSliceReducer.theme);
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme != undefined && JSON.parse(storedTheme) >= 1 && JSON.parse(storedTheme) <= 4) {
            dispatch(setTheme(JSON.parse(storedTheme)));
        }
    }, []);
    const changeTheme = (theme: Theme) => {
        dispatch(setTheme(theme));
        const themeSelectionPopup = document.getElementById("themeSelectionPopup");
        themeSelectionPopup?.classList.add("hide");
    }
    const openThemePopup = () => {
        const themeMenuItem = document.getElementById("themeMenuItem");
        const themeSelectionPopup = document.getElementById("themeSelectionPopup");
        if (!themeMenuItem?.classList.contains(styles.active)) {
            themeMenuItem?.classList.add(styles.active);
            themeSelectionPopup?.classList.add(styles.show);
            setTimeout(() => {
                document.addEventListener('click', openThemePopup);
            }, 200);
        }
        else {
            themeMenuItem?.classList.remove(styles.active);
            themeSelectionPopup?.classList.remove(styles.show);
            document.removeEventListener('click', openThemePopup);
        }
        dispatch(setMenuClicked(MenuItem.Theme));
    }
    const openSharePopup = () => {
        dispatch(setMenuClicked(MenuItem.Share));
    }
    const saveCode = () => {
        dispatch(setMenuClicked(MenuItem.Save));
    }
    return (
        <>
            <div className={`${styles.navbar}`}>
                <div id="themeMenuItem" className={styles.menuitem}>
                    <a onClick={() => openThemePopup()}><Palette weight="fill" className={styles.icon} /></a>
                </div>
                <div id="saveMenuItem" className={styles.menuitem}>
                    <a onClick={() => saveCode()}><FloppyDisk weight="fill" className={styles.icon} /></a>
                </div>
                <div id="shareMenuItem" className={styles.menuitem}>
                    <a onClick={() => openSharePopup()}><Share weight="fill" className={styles.icon} /></a>
                </div>
                <div className={styles.menuitem}>
                    <a><DownloadSimple weight="fill" className={styles.icon} /></a>
                </div>
                <div className={styles.menuitem}>
                    <a><Gear weight="fill" className={styles.icon} /></a>
                </div>
                <div className={styles.menuitem}>
                    <a><FilePlus weight="fill" className={styles.icon} /></a>
                </div>
            </div >
            <div id="themeSelectionPopup" className={`${styles.theme_menu_popup} ${styles.collapse}`}>
                <ul>
                    <li className={`${styles.link} ${theme == Theme.Light ? styles.activetheme : ""}`}
                        onClick={() => changeTheme(Theme.Light)}>
                        <Sun weight="fill" className={styles.icon} />
                        <a >&nbsp;&nbsp;Light</a>
                    </li>
                    <li className={`${styles.link} ${theme == Theme.LightPlus ? styles.activetheme : ""}`}
                        onClick={() => changeTheme(Theme.LightPlus)}>
                        <SunHorizon weight="fill" className={styles.icon} />
                        <a >&nbsp;&nbsp;Light ++</a>
                    </li>
                    <li className={`${styles.link} ${theme == Theme.Dark ? styles.activetheme : ""}`}
                        onClick={() => changeTheme(Theme.Dark)}>
                        <Moon weight="fill" className={styles.icon} />
                        <a >&nbsp;&nbsp;Dark</a>
                    </li>
                    <li className={`${styles.link} ${theme == Theme.DarkPlus ? styles.activetheme : ""}`}
                        onClick={() => changeTheme(Theme.DarkPlus)}>
                        <MoonStars weight="fill" className={styles.icon} />
                        <a >&nbsp;&nbsp;Dark ++</a>
                    </li>
                </ul>
            </div>
        </>

    );
}