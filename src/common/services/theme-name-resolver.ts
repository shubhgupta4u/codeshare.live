import { Theme } from "../constants/enums";

export default class ThemeNameResolver{   
            
    static get(theme:Theme):string{
        let themeName="dark-plus";
        switch(theme){
            case Theme.Light: themeName="light";break;
            case Theme.Dark: themeName="dark";break;
            case Theme.LightPlus: themeName="light-plus";break;
            case Theme.DarkPlus: themeName="dark-plus";break;
        }
        return themeName;
    }
}