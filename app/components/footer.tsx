export default function Footer() {
    return (
        <footer className="footer section">
            <div className="contenedor contenido-footer">
                <div className="sec-aboutus">
                    <h2>About Us</h2>
                    <p>
                        IFX Soccer is a global soccer agency specializing in player development,
                        international training, competition programs, and educational pathways.
                    </p>
                    <ul className="sociales">
                        <li><a href="#"><i className="fa-brands fa-facebook" /></a></li>
                        <li><a href="#"><i className="fa-brands fa-instagram" /></a></li>
                        <li><a href="#"><i className="fa-brands fa-youtube" /></a></li>
                    </ul>
                </div>

                <div className="main-programs">
                    <h2>Main Programs</h2>
                    <ul>
                        <li><a href="#">2026 Soccer Camps</a></li>
                        <li><a href="#">2026 Goalkeeper Camps</a></li>
                        <li><a href="#">2026 Soccer Trials</a></li>
                        <li><a href="#">Soccer Development Programs</a></li>
                        <li><a href="#">European Soccer Tours</a></li>
                        <li><a href="#">College Soccer Scholarships</a></li>
                    </ul>
                </div>

                <div className="imp-info">
                    <h2>Important Info</h2>
                    <ul>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Prices</a></li>
                        <li><a href="#">Visas</a></li>
                        <li><a href="#">Testimonials</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Player Licenses</a></li>
                        <li><a href="#">International Transfers</a></li>
                        <li><a href="#">Player News</a></li>
                        <li><a href="#">IFX Soccer Agency</a></li>
                    </ul>
                </div>

                <div className="sec-contact">
                    <h2>Contact Us!</h2>
                    <ul className="info">
                        <li>
                            <span><i className="fa-solid fa-location-dot" /></span>
                            <span>
                                International Futbol X-Change, LLC<br />
                                4847 Hopyard Rd., Ste. 4, #113<br />
                                Pleasanton, CA 94588 - USA
                            </span>
                        </li>

                        <li>
                            <a href="tel:+15105994625">
                                <span><i className="fa-solid fa-phone" /></span>
                                <span>+1 510 599 4625</span>
                            </a>
                        </li>

                        <li>
                            <a href="mailto:info@ifxsoccer.com">
                                <span><i className="fa-solid fa-envelope" /></span>
                                <span>info@ifxsoccer.com</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <p className="copyright">
                <img
                    src="/assets/img/balonDorado.png"
                    className="balon"
                    alt="IFX Soccer"
                />{" "}
                All Rights Reserved IFX Soccer © 2026
            </p>
        </footer>
    );
}
