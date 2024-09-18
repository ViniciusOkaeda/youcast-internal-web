import { useEffect, useState, useRef } from "react";
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';

import './theme.css';

const ThemeConfig = () => {
    const [configOptions, setConfigOptions ] = useState([{

        primaryColor: [
            {
                color: ''
            }
        ],

        themeColor: [
            {
                type: '',
                color: '',
                colorAlternative: '',
                shadowColor: '',
                fontShadowcolor: '',
                borderColor: '',
                containerColor: '',
            }
        ],

        menuColor: [
            {
                type: '',
                color: '',
                fontColor: ''
            }
        ],

        menuStyle: [
            {
                menuWidth: '',
                menuOptionsWidthContainer: '',
                menuOptionsWidth: '',
                menuHeight: '',
                menuDisplay: '',
                externalHeight: '',
                externalBorder: ''
            }
        ],

    }]);
    let dropDownRef = useRef();

    const [isActive, setIsActive] = useState(false);
    
    const handleOpenDropDown = () => setIsActive(!isActive);


      useEffect (() => {

        fetch('themeOptions.json', {
            headers: {
                Accept: "application/json"
            }
        }).then(res => 
            res.json()
            ).then(resp => {
                setConfigOptions(resp.paletteOptions.map(e => e))
            }).catch((error) => {
                console.log(error)
            });

            if(localStorage.getItem('palette-theme-list') == null) {
                var palette_theme_list = {
                    themeColor: '',
                    fontColor: '',
                    fontColorAlternative: '', 
                    shadowColor: '', 
                    fontShadowColor: '', 
                    borderColor: '', 
                    lineColor: '', 
                    containerColor: ''
                }

                localStorage.setItem("palette-theme-list", JSON.stringify(palette_theme_list))

            }
            if(localStorage.getItem('palette-menu-color-list') == null) {
                var palette_menu_color_list = {
                    menuColor: '',
                    menuFontColor: ''
                }

                localStorage.setItem("palette-menu-color-list", JSON.stringify(palette_menu_color_list))

            }
            if(localStorage.getItem('palette-menu-type-list') == null) {
                var palette_menu_type_list = {
                    menuWidth: '',
                    menuOptionsWidthContainer: '',
                    menuOptionsWidth: '',
                    menuHeight: '',
                    menuDisplay: '',
                    externalHeight: '',
                    externalBorder: ''
                }

                localStorage.setItem("palette-menu-type-list", JSON.stringify(palette_menu_type_list))

            }


            var palette_theme_list = JSON.parse(localStorage.getItem('palette-theme-list'))
            setTheme(palette_theme_list);


            var palette_menu_color_list = JSON.parse(localStorage.getItem('palette-menu-color-list'))
            setMenuColor(palette_menu_color_list);


            var palette_menu_type_list = JSON.parse(localStorage.getItem('palette-menu-type-list'))
            setMenuStyle(palette_menu_type_list);

    

        let handler = (e) => {
            if(!dropDownRef.current.contains(e.target)){
                setIsActive(false);
            }
        };

        document.addEventListener("mousedown", handler);

        return() => {
            document.removeEventListener("mousedown", handler);
        }




      },[])

    function DocumentSetProperty(styleType, styleValue) {

        const valueSet = document.documentElement.style.setProperty(styleType, styleValue)
        return valueSet
    }

    const setTheme = (palette_theme_list) => {
        DocumentSetProperty('--theme-color', palette_theme_list.themeColor)
        DocumentSetProperty('--font-color', palette_theme_list.fontColor)
        DocumentSetProperty('--font-color-alternative', palette_theme_list.fontColorAlternative)
        /*
        document.documentElement.style.setProperty('--theme-color', palette_theme_list.themeColor);
        document.documentElement.style.setProperty('--font-color', palette_theme_list.fontColor);
        document.documentElement.style.setProperty('--font-color-alternative', palette_theme_list.fontColorAlternative);
        */
        document.documentElement.style.setProperty('--shadow-color', palette_theme_list.shadowColor);
        document.documentElement.style.setProperty('--font-shadow-color', palette_theme_list.fontShadowColor);
        document.documentElement.style.setProperty('--border-color', palette_theme_list.borderColor);
        document.documentElement.style.setProperty('--line-color', palette_theme_list.lineColor);
        document.documentElement.style.setProperty('--container-color', palette_theme_list.containerColor);
    }

    const setPalette = (event) => {

        var palette_theme_list = {
            themeColor: event.target.style.getPropertyValue('--theme-color'),
            fontColor: event.target.style.getPropertyValue('--font-color'),
            fontColorAlternative: event.target.style.getPropertyValue('--font-color-alternative'), 
            shadowColor: event.target.style.getPropertyValue('--shadow-color'), 
            fontShadowColor: event.target.style.getPropertyValue('--font-shadow-color'), 
            borderColor: event.target.style.getPropertyValue('--border-color'), 
            lineColor: event.target.style.getPropertyValue('--line-color'), 
            containerColor: event.target.style.getPropertyValue('--container-color')
        }

        setTheme(palette_theme_list);

        localStorage.setItem("palette-theme-list", JSON.stringify(palette_theme_list))

    }

    const setMenuColor = (palette_menu_color_list) => {
        document.documentElement.style.setProperty('--menu-color', palette_menu_color_list.menuColor);
        document.documentElement.style.setProperty('--font-menu-color', palette_menu_color_list.menuFontColor);
    }

    const setPaletteMenu = (event) => {
        var palette_menu_color_list = {
            menuColor: event.target.style.getPropertyValue('--menu-color'),
            menuFontColor: event.target.style.getPropertyValue('--font-menu-color')
        }


        setMenuColor(palette_menu_color_list);

        localStorage.setItem("palette-menu-color-list", JSON.stringify(palette_menu_color_list))


    }

    const setMenuStyle = (palette_menu_type_list) => {
        document.documentElement.style.setProperty('--menu-width', palette_menu_type_list.menuWidth);
        document.documentElement.style.setProperty('--menu-options-width-container', palette_menu_type_list.menuOptionsWidthContainer);
        document.documentElement.style.setProperty('--menu-options-width', palette_menu_type_list.menuOptionsWidth);
        document.documentElement.style.setProperty('--menu-height', palette_menu_type_list.menuHeight);
        document.documentElement.style.setProperty('--menu-display', palette_menu_type_list.menuDisplay);
        document.documentElement.style.setProperty('--external-height', palette_menu_type_list.externalHeight);
        document.documentElement.style.setProperty('--external-border', palette_menu_type_list.externalBorder);
    }

    const setMenuType = (event) => {
        var palette_menu_type_list = {
            menuWidth: event.target.style.getPropertyValue('--menu-width'),
            menuOptionsWidthContainer: event.target.style.getPropertyValue('--menu-options-width-container'),
            menuOptionsWidth: event.target.style.getPropertyValue('--menu-options-width'),
            menuHeight: event.target.style.getPropertyValue('--menu-height'),
            menuDisplay: event.target.style.getPropertyValue('--menu-display'),
            externalHeight: event.target.style.getPropertyValue('--external-height'),
            externalBorder: event.target.style.getPropertyValue('--external-border')
        }

        setMenuStyle(palette_menu_type_list);
        localStorage.setItem("palette-menu-type-list", JSON.stringify(palette_menu_type_list))
    }



    return(

        <div ref={dropDownRef}>
            <div className="configOpenOptions">
                <button onClick={handleOpenDropDown}><ColorLensOutlinedIcon className="configIcon"/> </button>
            </div>

            <div className={`containerStyle ${isActive ? "active" : "inactive"}`}>
                
                <div className="headerStyled">
                    <h2>
                        Theme Mode
                    </h2>
                </div>
                <div className="contentStyed">
                    {configOptions.map(e => e.themeColor.map((th,idx) => {
                        return(
                            <div key={idx} className="themeContent">
                                
                                <div>
                                    <p>{th.type}</p>

                                    <div className="themeContainer" style={{
                                        '--theme-color': th.color,
                                        '--font-color': th.fontColor,
                                        '--font-color-alternative': th.fontColorAlternative,
                                        '--shadow-color': th.shadowColor,
                                        '--font-shadow-color': th.fontShadowColor,
                                        '--border-color': th.borderColor,
                                        '--line-color': th.lineColor,
                                        '--container-color': th.containerColor,
                                    }} onClick={setPalette}>

                                    </div>
                                </div>
                            </div>
                        )
                    }))}
                </div>


                <div className="headerStyled">
                    <h2>
                        Details Background
                    </h2>
                </div>
                <div className="contentStyed" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)'}}> 
                    {configOptions.map(e => e.menuColor.map((mn,idx) => {
                            return(
                                <div key={idx} className="menuContent">
                                    
                                    <div>

                                        <div className="menuContainer" style={{
                                            '--menu-color': mn.color,
                                            '--font-menu-color': mn.fontColor,
                                        }}
                                        onClick={setPaletteMenu}
                                        >

                                        </div>
                                    </div>
                                </div>
                            )
                    }))}            
                </div>

                <div className="headerStyled">
                    <h2>
                        Layout Menu
                    </h2>
                </div>
                <div className="contentStyed">
                    {configOptions.map(e => e.menuStyle.map((type, idx) => {

                        return(
                            <div key={idx} className="typeContent">

                                <div>
                                    <div className="typeContainer">
                                        <p  style={{
                                            '--menu-width': type.menuWidth,
                                            '--menu-options-width-container': type.menuOptionsWidthContainer,
                                            '--menu-options-width': type.menuOptionsWidth,
                                            '--menu-height': type.menuHeight,
                                            '--menu-display': type.menuDisplay,
                                            '--external-height': type.externalHeight,
                                            '--external-border': type.externalBorder,
                                        }} 
                                        onClick={setMenuType}>Type {idx+1}</p>
                                    </div>
                                </div>

                            </div>
                        )
                    }))

                    }
                </div>

            </div>
        </div>
    );
}

export default ThemeConfig;