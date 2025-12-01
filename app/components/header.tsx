export default function Header() {
    return (
        <header className="header">
            <nav className="nav container">
                <div className="nav__data">
                    <a href="#">
                        <img
                            src="/assets/img/logo.png"
                            alt="IFX Soccer Logo"
                            className="nav__logo"
                        />
                    </a>

                    <div className="nav__info">
                        <div className="nav__contact">
                            <i className="fa-solid fa-phone" />
                            <a href="tel:+15105994625">+1 510 599 4625</a>
                        </div>

                        <div className="nav__languages">
                            <select className="language-select">
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="de">Deutsch</option>
                            </select>
                        </div>
                    </div>

                    <div className="nav__toggle">
                        <i className="fa-solid fa-bars nav__toggle-menu" />
                        <i className="fa-solid fa-xmark nav__toggle-close" />
                    </div>
                </div>
            </nav>

            <div className="nav__bar">
                <div className="nav__menu container contenedor">
                    <ul className="nav__list">
                        <li className="dropdown__item">
                            <div className="nav__link dropdown__button">
                                Soccer Camps <i className="fa-solid fa-caret-down dropdown__arrow" />
                            </div>
                        </li>
                        <li className="dropdown__item">
                            <div className="nav__link dropdown__button">IFX Nürnberg</div>
                        </li>
                        <li className="dropdown__item">
                            <div className="nav__link dropdown__button">Intl. Soccer Academies</div>
                        </li>
                        <li className="dropdown__item">
                            <div className="nav__link dropdown__button">Soccer Tryouts</div>
                        </li>
                        <li className="dropdown__item">
                            <div className="nav__link dropdown__button">Soccer Programs</div>
                        </li>
                        <li>
                            <a href="#" className="nav__link">IFX News</a>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}
