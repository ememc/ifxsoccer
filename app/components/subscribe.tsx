import Script from "next/script";

const BREVO_FORM_ACTION =
    "https://d12a6971.sibforms.com/serve/MUIFALdamPl-WQImAGjHcKe8sLgwXEyRLZSZ1FnT8A9dG_KaL8w-OgTbo9reX_JPLOaTS2MvgkkdQJuZ_IL1CVVvXqIxxnEjRX5eYpkrVdFFWmxkhXv-ubmMOJiQHC9f8_gIDOVNkGHjRqa8YujLhqtdtd52p0oXMqnJlfl7_hJsW_IeZMv0IrSsKFuwX9WnEqqO3yDdVv50wmQ_";

function NotificationIcon({ type }: { type: "error" | "success" }) {
    const path =
        type === "error"
            ? "M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-11.49 120h22.979c6.823 0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.99-12.5zM256 340c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z"
            : "M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-118.664 0-216-96.055-216-216 0-118.663 96.055-216 216-216 118.664 0 216 96.055 216 216 0 118.663-96.055 216-216 216zm141.63-274.961L217.15 376.071c-4.705 4.667-12.303 4.637-16.97-.068l-85.878-86.572c-4.667-4.705-4.637-12.303.068-16.97l8.52-8.451c4.705-4.667 12.303-4.637 16.97.068l68.976 69.533 163.441-162.13c4.705-4.667 12.303-4.637 16.97.068l8.451 8.52c4.668 4.705 4.637 12.303-.068 16.97z";

    return (
        <svg viewBox="0 0 512 512" className="sib-icon sib-notification__icon" aria-hidden="true">
            <path d={path} />
        </svg>
    );
}

export default function Subscribe() {
    return (
        <section className="subscribe-section">
            <Script id="brevo-captcha-callback" strategy="afterInteractive">
                {`
                    window.handleCaptchaResponse = function handleCaptchaResponse() {
                        var captcha = document.getElementById('sib-captcha');
                        if (captcha) {
                            captcha.dispatchEvent(new Event('captchaChange'));
                        }
                        window.grecaptcha = window.turnstile;
                    };
                `}
            </Script>
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
            <Script src="https://sibforms.com/forms/end-form/build/main.js" strategy="afterInteractive" />

            <div className="sib-form subscribe-form">
                <div id="sib-form-container" className="sib-form-container">
                    <div id="error-message" className="sib-form-message-panel subscribe-message-panel subscribe-message-panel--error">
                        <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
                            <NotificationIcon type="error" />
                            <span className="sib-form-message-panel__inner-text">
                                Your subscription could not be saved. Please try again.
                            </span>
                        </div>
                    </div>

                    <div id="success-message" className="sib-form-message-panel subscribe-message-panel subscribe-message-panel--success">
                        <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
                            <NotificationIcon type="success" />
                            <span className="sib-form-message-panel__inner-text">
                                Your subscription has been successful.
                            </span>
                        </div>
                    </div>

                    <div id="sib-container" className="sib-container--large sib-container--vertical">
                        <form id="sib-form" method="POST" action={BREVO_FORM_ACTION} data-type="subscription">
                            <div className="subscribe-form__row">
                                <div className="sib-form-block subscribe-form__title">
                                    <p>Stay Current with Soccer Tryout Opportunities!</p>
                                </div>
                            </div>

                            <div className="subscribe-form__row">
                                <div className="sib-form-block subscribe-form__text">
                                    <div className="sib-text-form-block">
                                        <p>Subscribe to our newsletter and stay updated.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="subscribe-form__row">
                                <div className="sib-input sib-form-block">
                                    <div className="form__entry entry_block">
                                        <div className="form__label-row">
                                            <div className="entry__field">
                                                <input
                                                    className="input"
                                                    type="email"
                                                    id="EMAIL"
                                                    name="EMAIL"
                                                    autoComplete="email"
                                                    placeholder="EMAIL"
                                                    data-required="true"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <label className="entry__error entry__error--primary subscribe-form__error-label"></label>
                                    </div>
                                </div>
                            </div>

                            <div className="subscribe-form__row">
                                <div className="sib-optin sib-form-block" data-required="true">
                                    <div className="form__entry entry_mcq">
                                        <div className="form__label-row">
                                            <div className="entry__choice">
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        className="input_replaced"
                                                        value="1"
                                                        id="OPT_IN"
                                                        name="OPT_IN"
                                                        required
                                                    />
                                                    <span className="checkbox checkbox_tick_positive subscribe-form__checkbox"></span>
                                                    <span className="subscribe-form__consent">
                                                        I agree to receive your newsletters and accept the data privacy statement.
                                                        <span data-required="*" className="entry__label entry__label_optin"></span>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <label className="entry__error entry__error--primary subscribe-form__error-label"></label>
                                    </div>
                                </div>
                            </div>

                            <div className="subscribe-form__row">
                                <div className="sib-captcha sib-form-block">
                                    <div className="form__entry entry_block">
                                        <div className="form__label-row">
                                            <div
                                                className="cf-turnstile g-recaptcha"
                                                data-sitekey="0x4AAAAAAA8RxwIdCH9gur5f"
                                                id="sib-captcha"
                                                data-callback="handleCaptchaResponse"
                                                data-language="en"
                                            ></div>
                                        </div>
                                        <label className="entry__error entry__error--primary subscribe-form__error-label"></label>
                                    </div>
                                </div>
                            </div>

                            <div className="subscribe-form__row">
                                <div className="sib-form-block subscribe-form__actions">
                                    <button
                                        className="sib-form-block__button sib-form-block__button-with-loader subscribe-form__button"
                                        form="sib-form"
                                        type="submit"
                                    >
                                        <svg
                                            className="icon clickable__icon progress-indicator__icon sib-hide-loader-icon"
                                            viewBox="0 0 512 512"
                                            aria-hidden="true"
                                        >
                                            <path d="M460.116 373.846l-20.823-12.022c-5.541-3.199-7.54-10.159-4.663-15.874 30.137-59.886 28.343-131.652-5.386-189.946-33.641-58.394-94.896-95.833-161.827-99.676C261.028 55.961 256 50.751 256 44.352V20.309c0-6.904 5.808-12.337 12.703-11.982 83.556 4.306 160.163 50.864 202.11 123.677 42.063 72.696 44.079 162.316 6.031 236.832-3.14 6.148-10.75 8.461-16.728 5.01z" />
                                        </svg>
                                        SUBSCRIBE
                                    </button>
                                </div>
                            </div>

                            <input
                                type="text"
                                name="email_address_check"
                                className="input--hidden"
                                defaultValue=""
                                tabIndex={-1}
                                autoComplete="off"
                            />
                            <input type="hidden" name="locale" value="en" />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
