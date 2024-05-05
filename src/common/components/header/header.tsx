import styles from "@/common/components/header/header.module.css";
import { Constants } from '@/common/constants/env-constant';
import ThemeNameResolver from "@/common/services/theme-name-resolver";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Head from "next/head";
import { FileCode } from "@phosphor-icons/react";

export function Header() {

    const theme = useSelector((state: RootState) => state.themeSliceReducer.theme);
    const domainName = Constants.DomainName;
    return (
        <div className={`${styles.header}`}>
            <Head >
                <link rel="stylesheet" type="text/css" href={`/styles/themes/${ThemeNameResolver.get(theme)}.css`} />
            </Head>
            <nav>

                <div>
                    <h2 className="title"><FileCode weight="fill" className={styles.logo}  /> {domainName}</h2>
                </div>
            </nav >

        </div >
    );
}