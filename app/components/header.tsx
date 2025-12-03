"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "@/public/assets/img/logo alta.png";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    const toggleDropdown = (index: number) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    return (
        <header className="header">
            <nav className="nav container">
                <div className="nav__data">
                    {/* logo */}
                    <Image
                        src={logo}
                        alt="IFX Soccer Logo"
                        className="nav__logo"
                        priority
                    />
                    {/* info */}
                    <div className="nav__info">
                        <div className="nav__contact">
                            <i className="fa-solid fa-phone"></i>
                            <a href="tel:+15105994625">+1 510 599 4625</a>
                        </div>
                        <div className="nav__languages">
                            <select className="language-select" id="language-select">
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="de">Deutsch</option>
                            </select>
                        </div>
                    </div>
                    {/* toggle */}
                    <div
                        id="nav-toggle"
                        className={`nav__toggle ${menuOpen ? "show-icon" : ""}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <i className="fa-solid fa-bars nav__toggle-menu"></i>
                        <i className="fa-solid fa-xmark nav__toggle-close"></i>
                    </div>
                </div>
            </nav>
            {/* MENU BAR */}
            <div className="nav__bar">
                <div
                    id="nav-menu"
                    className={`nav__menu container contenedor ${menuOpen ? "show-menu" : ""
                        }`}
                >
                    <ul className="nav__list">
                        {/* DROPDOWN 1 */}
                        <li className="dropdown__item">
                            <div
                                className="nav__link dropdown__button"
                                onClick={() => toggleDropdown(1)}
                            >
                                Soccer Camps <i className="fa-solid fa-caret-down dropdown__arrow"></i>
                            </div>

                            <div
                                className={`dropdown__container ${openDropdown === 1 ? "show-dropdown" : ""
                                    }`}
                            >
                                <div className="dropdown__content">
                                    <div className="dropdown__group">
                                        <span className="dropdown__title">Youth Soccer Camps in Germany</span>
                                        <ul className="dropdown__list">
                                            <li>
                                                <img src="/assets/img/SummerCampLogo.png" alt="imagen logo summer camp ifx" />
                                                <a href="#" className="dropdown__link">Youth Summer IFX in Bayern (13-17)</a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="dropdown__group">
                                        <span className="dropdown__title">Youth Soccer Camps in France</span>
                                        <ul className="dropdown__list">
                                            <li>
                                                <img src="/assets/img/PSG-logo.png" alt="imagen logo PSG" /><a href="#" className="dropdown__link" >Paris Saint-Germain Academy Pro (13-18)</a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="dropdown__group">
                                        <span className="dropdown__title">Youth Soccer Camps in Spain</span>
                                        <ul className="dropdown__list">
                                            <li>
                                                <img src="/assets/img/AtleticoMadridLogo.png" alt="imagen logo Atletico Madrid" />
                                                <a href="#" className="dropdown__link" >Atlético de Madrid International Summer Camp (10-17)</a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="dropdown__group">
                                        <span className="dropdown__title">Youth Soccer Camps in England</span>
                                        <ul className="dropdown__list">
                                            <li>
                                                <img src="/assets/img/ManCityFS.png" alt="imagen logo Man City" /><a href="#" className="dropdown__link" >Manchester City Soccer Schools (9-17)</a>
                                            </li>
                                            <li>
                                                <img src="/assets/img/nfc-chelsea.png" alt="imagen logo Chelsea NFC" /><a href="#" className="dropdown__link">Nike Football Camps with Chelsea FC (10-17)</a>
                                            </li>
                                            <li>
                                                <img src="/assets/img/LFC-camps.png" alt="imagen logo liverpool international academy" /><a href="#" className="dropdown__link">Liverpool FC International Academy (10-17)</a>
                                            </li>
                                            <li>
                                                <img src="/assets/img/whuf.png" alt="imagen logo West Ham United Foundation" /><a href="#" className="dropdown__link" >West Ham United Foundation (10-17)</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>

                        {/* DROPDOWN 2 */}
                        <li className="dropdown__item">
                            <div
                                className="nav__link dropdown__button"
                                onClick={() => toggleDropdown(2)}
                            >
                                IFX Nürnberg<i className="fa-solid fa-caret-down dropdown__arrow"></i>
                            </div>

                            <div
                                className={`dropdown__container ${openDropdown === 2 ? "show-dropdown" : ""
                                    }`}
                            >
                                <div className="dropdown__content">
                                    <div className="dropdown__group">
                                        <ul className="dropdown__list">
                                            <li>
                                                <a href="#" className="dropdown__link">Pro Year Germany (18+)</a>
                                            </li>
                                            <li>
                                                <a href="#" className="dropdown__link">Youth Year Germany (14-18)</a>
                                            </li>
                                            <li>
                                                <a href="#" className="dropdown__link">Soccer Trials in Germany - Pro 30 Day (18+)</a>
                                            </li>
                                            <li>
                                                <img src="/assets/img/SummerCampLogo.png" alt="imagen logo summer camp ifx" />
                                                <a href="#" className="dropdown__link">Youth Summer IFX Germany (13-17)</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>

                        {/* DROPDOWN 3 */}
                        <li className="dropdown__item">
                            <div
                                className="nav__link dropdown__button"
                                onClick={() => toggleDropdown(3)}
                            >
                                Intl. Soccer Academies<i className="fa-solid fa-caret-down dropdown__arrow"></i>
                            </div>

                            <div
                                className={`dropdown__container ${openDropdown === 3 ? "show-dropdown" : ""
                                    }`}
                            ></div>
                        </li>

                        {/* DROPDOWN 4 */}
                        <li className="dropdown__item">
                            <div
                                className="nav__link dropdown__button"
                                onClick={() => toggleDropdown(4)}
                            >
                                Soccer Tryouts<i className="fa-solid fa-caret-down dropdown__arrow"></i>
                            </div>

                            <div
                                className={`dropdown__container ${openDropdown === 4 ? "show-dropdown" : ""
                                    }`}
                            ></div>
                        </li>

                        {/* DROPDOWN 5 */}
                        <li className="dropdown__item">
                            <div
                                className="nav__link dropdown__button"
                                onClick={() => toggleDropdown(5)}
                            >
                                Soccer Programs<i className="fa-solid fa-caret-down dropdown__arrow"></i>
                            </div>

                            <div
                                className={`dropdown__container ${openDropdown === 5 ? "show-dropdown" : ""
                                    }`}
                            ></div>
                        </li>

                        <li>
                            <a href="#" className="nav__link">IFX News</a>
                        </li>

                    </ul>
                </div>
            </div>
        </header >
    );
}
