export default function Footer() {
    return (
        <footer className="footer section">
            <div className="contenedor contenido-footer">
                <div className="sec-aboutus">
                    <h4>About Us</h4>
                    <p>
                        IFX Soccer (International Futbol X-Change) is a global soccer agency specializing in player development through international training,
                        soccer trials management and competition programs. With headquarters in the U.S. and operations in Europe, IFX provides young athletes
                        with unique opportunities to improve their abilities, gain exposure to professional clubs, and experience life abroad through soccer.
                    </p>
                    <ul className="sociales">
                        <li>
                            <a href="#" aria-label="Facebook">
                                <i className="fa-brands fa-facebook"></i>
                            </a>
                        </li>
                        <li>
                            <a href="#" aria-label="Instagram">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                        </li>
                        <li>
                            <a href="#" aria-label="YouTube">
                                <i className="fa-brands fa-youtube"></i>
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="main-programs">
                    <h4>Main Programs</h4>
                    <ul>
                        <li><a href="prices.html"><p>2026 Soccer Camps</p></a></li>
                        <li><a href="carrousel.html"><p>2026 Goalkeeper Camps</p></a></li>
                        <li><a href="categorias.html"><p>2026 Soccer Trials</p></a></li>
                        <li><a href="programa.html"><p>Soccer Development Programs</p></a></li>
                        <li><a href="testimonials.html"><p>European Soccer Tours</p></a></li>
                        <li><a href="news.html"><p>College Soccer Scholarships</p></a></li>
                    </ul>
                </div>

                <div className="main-programs">
                    <h4>Destinations</h4>
                    <ul>
                        <li><a href="#"><p>Germany</p></a></li>
                        <li><a href="#"><p>Spain</p></a></li>
                        <li><a href="#"><p>France</p></a></li>
                        <li><a href="#"><p>England</p></a></li>
                        <li><a href="#"><p>Italy</p></a></li>
                    </ul>
                </div>

                <div className="imp-info">
                    <h4>Important Info</h4>
                    <ul>
                        <li><a href="#"><p>FAQ</p></a></li>
                        <li><a href="#"><p>Prices</p></a></li>
                        <li><a href="#"><p>Visas</p></a></li>
                        <li><a href="#"><p>Testimonials</p></a></li>
                        <li><a href="#"><p>Privacy Policy</p></a></li>
                        <li><a href="#"><p>Player Licenses</p></a></li>
                        <li><a href="#"><p>International Transfers</p></a></li>
                        <li><a href="#"><p>Player News</p></a></li>
                        <li><a href="#"><p>IFX Soccer Agency</p></a></li>
                    </ul>
                </div>

                <div className="sec-contact">
                    <h4>Contact Us!</h4>
                    <ul className="info">
                        <li>
                            <span><i className="fa-solid fa-location-dot"></i></span>
                            <span>
                                <p>
                                International Futbol X-Change, LLC<br />
                                4847 Hopyard Rd., Ste. 4, #113<br />
                                Pleasanton, CA 94588 - USA
                                </p>
                            </span>
                        </li>
                        <li>
                            <a href="tel:+15105994625">
                                <span><i className="fa-solid fa-phone"></i></span>
                                <span><p>+1 510 599 4625</p></span>
                            </a>
                        </li>
                        <li>
                            <a href="mailto:info@ifxsoccer.com">
                                <span><i className="fa-solid fa-envelope"></i></span>
                                <span><p>info@ifxsoccer.com</p></span>
                            </a>
                        </li>
                    </ul>

                    <form action="mailto:info@ifxsoccer.com" method="get" encType="text/plain">
                        <label htmlFor="footer-subject"><p>Subject:</p></label>
                        <input id="footer-subject" type="text" name="subject" placeholder="Your Name" />

                        <label htmlFor="footer-email"><p>Email:</p></label>
                        <input id="footer-email" type="email" name="email" placeholder="Your Email" />

                        <label htmlFor="footer-message"><p>Message:</p></label>
                        <textarea id="footer-message" name="body" rows={5} cols={30} placeholder="Your Message"></textarea>

                        <input type="submit" value="Send" />
                    </form>
                </div>
            </div>

            <div className="contenedor centrar">
                <p className="copyright">
                    <img src="/assets/img/balonWhite1.png" className="balon" alt="isotype IFX Soccer" />
                    All Rights Reserved IFX Soccer &copy; 2026
                </p>
            </div>
        </footer>
    );
}
