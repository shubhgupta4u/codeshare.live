import { store } from "@/store/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { Inter } from "next/font/google";
import { Header } from "@/common/components/header/header";
import { Footer } from "@/common/components/footer/footer";
import { NavBar } from "@/common/components/navbar/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      
      <div className="layout">
        <Header/>
        <div>
          <NavBar/>
          <Component {...pageProps} />
        </div> 
        <Footer/>      
      </div>

    </Provider>

  );
}
