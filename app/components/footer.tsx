export default function Footer() {
    return (
        <footer className="footer section">
            <div className="contenedor contenido-footer">
                <div className="sec-aboutus">
                    <h2>About Us</h2>
                    <p>IFX Soccer (International Fútbol X-Change) is a global soccer agency specializing in player development through international training, soccer trials management and competition programs. With headquarters in the U.S. and operations in Europe, IFX provides young athletes with unique opportunities to improve their abilities, gain exposure to professional clubs, and experience life abroad through soccer.</p>
                    <ul className="sociales">
                        <li><a href="#"><i className="fa-brands fa-facebook"></i></a></li>
                        <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                        <li><a href="#"><i className="fa-brands fa-youtube"></i></a></li>
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
                            <span><i className="fa-solid fa-location-dot"></i></span>
                            <span>International Futbol X-Change, LLC
                                4847 Hopyard Rd., Ste. 4, #113
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

                            <form action="mailto:info@ifxsoccer.com" method="get" encType="text/plain">
                                Subject:<br />
                                <input type="text" name="subject" placeholder="Your Name" /><br />
                                Email:<br />
                                <input type="email" name="email" placeholder="Your Email" /><br />
                                Message:<br />
                                <textarea name="body" placeholder="Your Message"></textarea><br />
                                <input type="submit" value="Send" />
                            </form>
                        </li>
                    </ul>
                </div>
                <p className="copyright">
                    <img src="/assets/img/balonDorado.png" className="balon" alt="isotype IFX Soccer" /> All Rights Reserved IFX Soccer &copy; 2026
                </p>
            </div>
        </footer>
    );
}
