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
                        <li><a href="prices.html">2026 Soccer Camps</a></li>
                        <li><a href="carrousel.html">2026 Goalkeeper Camps</a></li>
                        <li><a href="categorias.html">2026 Soccer Trials</a></li>
                        <li><a href="programa.html">Soccer Development Programs</a></li>
                        <li><a href="testimonials.html">European Soccer Tours</a></li>
                        <li><a href="news.html">College Soccer Scholarships</a></li>
                    </ul>
                </div>

                <div className="main-programs">
                    <h4>Destinations</h4>
                    <ul>
                        <li><a href="#">Germany</a></li>
                        <li><a href="#">Spain</a></li>
                        <li><a href="#">France</a></li>
                        <li><a href="#">England</a></li>
                        <li><a href="#">Italy</a></li>
                    </ul>
                </div>

                <div className="imp-info">
                    <h4>Important Info</h4>
                    <ul>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Prices</a></li>
                        <li><a href="#">Visas</a></li>
                        <li><a href="#">Testimonials</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Player Licenses</a></li>
                        <li><a href="#">International Transfers</a></li>
                        <li><a href="blog.html">Player News</a></li>
                        <li><a href="#">IFX Soccer Agency</a></li>
                    </ul>
                </div>

                <div className="sec-contact">
                    <h4>Contact Us!</h4>
                    <ul className="info">
                        <li>
                            <span><i className="fa-solid fa-location-dot"></i></span>
                            <span>
                                International Futbol X-Change, LLC<br />
                                4847 Hopyard Rd., Ste. 4, #113<br />
                                Pleasanton, CA 94588 - USA
                            </span>
                        </li>
                        <li>
                            <a href="tel:+15105994625">
                                <span><i className="fa-solid fa-phone"></i></span>
                                <span>+1 510 599 4625</span>
                            </a>
                        </li>
                        <li>
                            <a href="mailto:info@ifxsoccer.com">
                                <span><i className="fa-solid fa-envelope"></i></span>
                                <span>info@ifxsoccer.com</span>
                            </a>
                        </li>
                    </ul>

                    <form action="mailto:info@ifxsoccer.com" method="get" encType="text/plain">
                        <label htmlFor="footer-subject">Subject:</label>
                        <input id="footer-subject" type="text" name="subject" placeholder="Your Name" />

                        <label htmlFor="footer-email">Email:</label>
                        <input id="footer-email" type="email" name="email" placeholder="Your Email" />

                        <label htmlFor="footer-message">Message:</label>
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
