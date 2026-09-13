/* =========================================================
   HUMBLE DOWNGRADER
   app.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const MAINTENANCE_MODE = true;


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const html =
        document.documentElement;

    const body =
        document.body;

    const maintenanceOverlay =
        document.getElementById(
            "maintenanceOverlay"
        );


    /* =====================================================
       MAINTENANCE MODE
       ===================================================== */

    function enableMaintenanceMode() {

        if (!maintenanceOverlay) {
            return;
        }

        maintenanceOverlay.hidden = false;

        maintenanceOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

        html.classList.add(
            "maintenance-active"
        );

        body.classList.add(
            "maintenance-active"
        );

        html.style.overflow = "hidden";
        body.style.overflow = "hidden";


        /* -----------------------------------------------
           Block all interaction underneath
           ----------------------------------------------- */

        const blockUnderlyingInteraction =
            (event) => {

                if (
                    !maintenanceOverlay.contains(
                        event.target
                    )
                ) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            };


        const blockedEvents = [

            "click",
            "dblclick",

            "mousedown",
            "mouseup",

            "pointerdown",
            "pointerup",
            "pointermove",

            "touchstart",
            "touchmove",
            "touchend",

            "dragstart",
            "dragover",
            "drop",

            "contextmenu"

        ];


        blockedEvents.forEach(
            (eventName) => {

                document.addEventListener(
                    eventName,
                    blockUnderlyingInteraction,
                    true
                );

            }
        );


        /* -----------------------------------------------
           Prevent scrolling
           ----------------------------------------------- */

        document.addEventListener(
            "wheel",
            (event) => {

                event.preventDefault();

            },
            {
                passive: false,
                capture: true
            }
        );


        document.addEventListener(
            "touchmove",
            (event) => {

                event.preventDefault();

            },
            {
                passive: false,
                capture: true
            }
        );


        /* -----------------------------------------------
           Lock keyboard interaction
           ----------------------------------------------- */

        document.addEventListener(
            "keydown",
            (event) => {

                event.preventDefault();
                event.stopPropagation();

            },
            true
        );

    }


    /* =====================================================
       MAINTENANCE INITIALIZATION
       ===================================================== */

    if (MAINTENANCE_MODE) {

        enableMaintenanceMode();

    } else if (maintenanceOverlay) {

        maintenanceOverlay.hidden = true;

        maintenanceOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const menuToggle =
        document.querySelector(
            ".menu-toggle"
        );

    const mobileMenu =
        document.querySelector(
            ".mobile-menu"
        );


    if (
        menuToggle &&
        mobileMenu
    ) {

        menuToggle.addEventListener(
            "click",
            () => {

                const isOpen =
                    mobileMenu.classList.toggle(
                        "active"
                    );


                menuToggle.classList.toggle(
                    "active",
                    isOpen
                );


                menuToggle.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

            }
        );


        mobileMenu
            .querySelectorAll("a")
            .forEach((link) => {

                link.addEventListener(
                    "click",
                    () => {

                        mobileMenu.classList.remove(
                            "active"
                        );

                        menuToggle.classList.remove(
                            "active"
                        );

                        menuToggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            });

    }


    /* =====================================================
       FILE ELEMENTS
       ===================================================== */

    const fileInput =
        document.getElementById(
            "fileInput"
        );

    const dropzone =
        document.getElementById(
            "dropzone"
        );

    const fileCard =
        document.getElementById(
            "fileCard"
        );

    const fileName =
        document.getElementById(
            "fileName"
        );

    const fileSize =
        document.getElementById(
            "fileSize"
        );

    const detectedType =
        document.getElementById(
            "detectedType"
        );

    const targetVersion =
        document.getElementById(
            "targetVersion"
        );

    const convertButton =
        document.getElementById(
            "convertButton"
        );

    const converterStatus =
        document.getElementById(
            "converterStatus"
        );


    let selectedFile = null;
    let selectedType = null;


    /* =====================================================
       FILE TYPE
       ===================================================== */

    function detectFileType(file) {

        if (
            !file ||
            !file.name
        ) {
            return null;
        }


        const extension =
            file.name
                .split(".")
                .pop()
                .toLowerCase();


        if (extension === "aep") {
            return "AEP";
        }


        if (extension === "aex") {
            return "AEX";
        }


        return null;

    }


    /* =====================================================
       FILE SIZE
       ===================================================== */

    function formatFileSize(bytes) {

        if (
            !Number.isFinite(bytes) ||
            bytes <= 0
        ) {
            return "0 KB";
        }


        if (bytes < 1024) {

            return `${bytes} B`;

        }


        if (
            bytes <
            1024 * 1024
        ) {

            return `${(
                bytes / 1024
            ).toFixed(1)} KB`;

        }


        if (
            bytes <
            1024 * 1024 * 1024
        ) {

            return `${(
                bytes /
                (1024 * 1024)
            ).toFixed(2)} MB`;

        }


        return `${(
            bytes /
            (1024 * 1024 * 1024)
        ).toFixed(2)} GB`;

    }


    /* =====================================================
       DISPLAY FILE
       ===================================================== */

    function displayFile(file) {

        if (!file) {
            return;
        }


        const type =
            detectFileType(file);


        if (!type) {

            selectedFile = null;
            selectedType = null;


            if (fileCard) {

                fileCard.classList.remove(
                    "visible"
                );

            }


            if (convertButton) {

                convertButton.disabled =
                    true;

            }


            if (converterStatus) {

                converterStatus.textContent =
                    "Only .AEP and .AEX files are supported.";

            }


            return;

        }


        selectedFile = file;
        selectedType = type;


        if (fileName) {

            fileName.textContent =
                file.name;

        }


        if (fileSize) {

            fileSize.textContent =
                formatFileSize(
                    file.size
                );

        }


        if (detectedType) {

            detectedType.textContent =
                type;

        }


        if (fileCard) {

            fileCard.classList.add(
                "visible"
            );

        }


        if (convertButton) {

            convertButton.disabled =
                false;

        }


        if (converterStatus) {

            converterStatus.textContent =
                `${type} file detected successfully.`;

        }

    }


    /* =====================================================
       FILE INPUT
       ===================================================== */

    if (fileInput) {

        fileInput.addEventListener(
            "change",
            (event) => {

                const file =
                    event.target
                        ?.files?.[0];


                if (file) {

                    displayFile(file);

                }

            }
        );

    }


    /* =====================================================
       DRAG & DROP
       ===================================================== */

    if (dropzone) {


        [
            "dragenter",
            "dragover"
        ].forEach(
            (eventName) => {

                dropzone.addEventListener(
                    eventName,
                    (event) => {

                        event.preventDefault();
                        event.stopPropagation();

                        dropzone.classList.add(
                            "dragging"
                        );

                    }
                );

            }
        );


        [
            "dragleave",
            "drop"
        ].forEach(
            (eventName) => {

                dropzone.addEventListener(
                    eventName,
                    (event) => {

                        event.preventDefault();
                        event.stopPropagation();

                        dropzone.classList.remove(
                            "dragging"
                        );

                    }
                );

            }
        );


        dropzone.addEventListener(
            "drop",
            (event) => {

                const file =
                    event.dataTransfer
                        ?.files?.[0];


                if (file) {

                    displayFile(file);

                }

            }
        );

    }


    /* =====================================================
       CONVERT BUTTON
       ===================================================== */

    if (convertButton) {

        convertButton.addEventListener(
            "click",
            () => {

                if (
                    !selectedFile ||
                    !selectedType
                ) {
                    return;
                }


                const version =
                    targetVersion?.value ||
                    "Previous Version";


                /*
                 * IMPORTANT:
                 * This GitHub Pages frontend does NOT
                 * perform real AEP/AEX conversion.
                 *
                 * A real conversion backend must be
                 * connected before claiming a file
                 * has been converted.
                 */

                if (converterStatus) {

                    converterStatus.textContent =
                        `${selectedType} selected · target After Effects ${version}`;

                }

            }
        );

    }


    /* =====================================================
       SMOOTH INTERNAL LINKS
       ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    (event) => {

                        const targetId =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !targetId ||
                            targetId === "#"
                        ) {
                            return;
                        }


                        const target =
                            document.querySelector(
                                targetId
                            );


                        if (!target) {
                            return;
                        }


                        event.preventDefault();


                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }
                );

            }
        );


    /* =====================================================
       YEAR
       ===================================================== */

    document
        .querySelectorAll(
            "[data-year]"
        )
        .forEach(
            (element) => {

                element.textContent =
                    new Date()
                        .getFullYear();

            }
        );

});        dotmLoader.style.setProperty(
            "--loader-size",
            `${SIZE}px`
        );

        for (let i = 0; i < DOT_COUNT; i++) {
            const dot = document.createElement("span");

            dot.className = "dotm-dot";

            const angle =
                (360 / DOT_COUNT) * i;

            const delay =
                -(i * 0.14);

            /*
             * Different brightness for each dot.
             * This creates the circular loading trail.
             */
            const opacity =
                0.12 +
                (i / DOT_COUNT) * 0.88;

            dot.style.position = "absolute";
            dot.style.width = "4px";
            dot.style.height = "4px";
            dot.style.borderRadius = "50%";
            dot.style.background = "#ff6fa6";

            dot.style.left = "50%";
            dot.style.top = "50%";

            dot.style.marginLeft = "-2px";
            dot.style.marginTop = "-2px";

            dot.style.setProperty(
                "--angle",
                `${angle}deg`
            );

            dot.style.setProperty(
                "--delay",
                `${delay}s`
            );

            dot.style.setProperty(
                "--base-opacity",
                opacity.toFixed(2)
            );

            /*
             * Place the dot around the circle.
             */
            dot.style.transform =
                `rotate(${angle}deg) translateY(-${RADIUS}px)`;

            /*
             * Dot glow.
             */
            dot.style.boxShadow =
                "0 0 5px rgba(255,111,166,.55)," +
                "0 0 12px rgba(255,111,166,.25)";

            /*
             * Each dot pulses independently.
             */
            dot.style.animation =
                `humbleDotPulse 1.4s ease-in-out infinite`;

            dot.style.animationDelay =
                `${delay}s`;

            dotmLoader.appendChild(dot);
        }

        /*
         * Inject the animation directly from JS.
         * This guarantees the animation exists even if
         * the CSS loader animation was missing.
         */
        if (!document.getElementById("humbleDotAnimation")) {
            const style = document.createElement("style");

            style.id = "humbleDotAnimation";

            style.textContent = `
                @keyframes humbleDotPulse {

                    0% {
                        opacity: .12;
                        transform:
                            rotate(var(--angle))
                            translateY(-22px)
                            scale(.65);
                    }

                    20% {
                        opacity: .28;
                        transform:
                            rotate(var(--angle))
                            translateY(-22px)
                            scale(.75);
                    }

                    45% {
                        opacity: .55;
                        transform:
                            rotate(var(--angle))
                            translateY(-22px)
                            scale(.9);
                    }

                    65% {
                        opacity: 1;
                        transform:
                            rotate(var(--angle))
                            translateY(-22px)
                            scale(1.25);
                    }

                    100% {
                        opacity: .12;
                        transform:
                            rotate(var(--angle))
                            translateY(-22px)
                            scale(.65);
                    }
                }

                .dotm-loader {
                    position: relative !important;
                    width: 52px !important;
                    height: 52px !important;
                    display: block !important;
                }

                .dotm-dot {
                    transform-origin: center center;
                    will-change: transform, opacity;
                }
            `;

            document.head.appendChild(style);
        }
    }

    /* =====================================================
       MAINTENANCE LOCK
       ===================================================== */

    function enableMaintenanceMode() {
        if (!maintenanceOverlay) return;

        maintenanceOverlay.hidden = false;

        maintenanceOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

        html.classList.add("maintenance-active");
        body.classList.add("maintenance-active");

        html.style.overflow = "hidden";
        body.style.overflow = "hidden";

        /*
         * Stop interaction with everything underneath.
         */
        const blockEvent = (event) => {
            if (!maintenanceOverlay.contains(event.target)) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        [
            "click",
            "dblclick",
            "mousedown",
            "mouseup",
            "pointerdown",
            "pointerup",
            "pointermove",
            "touchstart",
            "touchmove",
            "touchend",
            "dragstart",
            "dragover",
            "drop",
            "contextmenu"
        ].forEach((eventName) => {
            document.addEventListener(
                eventName,
                blockEvent,
                true
            );
        });

        /*
         * Prevent scrolling.
         */
        document.addEventListener(
            "wheel",
            (event) => {
                event.preventDefault();
            },
            {
                passive: false,
                capture: true
            }
        );

        document.addEventListener(
            "touchmove",
            (event) => {
                event.preventDefault();
            },
            {
                passive: false,
                capture: true
            }
        );

        /*
         * Lock keyboard interaction.
         */
        document.addEventListener(
            "keydown",
            (event) => {
                event.preventDefault();
                event.stopPropagation();
            },
            true
        );
    }

    /* =====================================================
       INITIALIZE
       ===================================================== */

    createDotmLoader();

    if (MAINTENANCE_MODE) {
        enableMaintenanceMode();
    }

    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const menuToggle =
        document.querySelector(".menu-toggle");

    const mobileMenu =
        document.querySelector(".mobile-menu");

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", () => {
            const open =
                mobileMenu.classList.toggle("active");

            menuToggle.classList.toggle(
                "active",
                open
            );

            menuToggle.setAttribute(
                "aria-expanded",
                String(open)
            );
        });

        mobileMenu
            .querySelectorAll("a")
            .forEach((link) => {
                link.addEventListener("click", () => {
                    mobileMenu.classList.remove(
                        "active"
                    );

                    menuToggle.classList.remove(
                        "active"
                    );

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                });
            });
    }

    /* =====================================================
       FILE INPUT
       ===================================================== */

    const fileInput =
        document.getElementById("fileInput");

    const dropzone =
        document.getElementById("dropzone");

    const fileCard =
        document.getElementById("fileCard");

    const fileName =
        document.getElementById("fileName");

    const fileSize =
        document.getElementById("fileSize");

    const detectedType =
        document.getElementById("detectedType");

    const targetVersion =
        document.getElementById("targetVersion");

    const convertButton =
        document.getElementById("convertButton");

    const converterStatus =
        document.getElementById("converterStatus");

    let selectedFile = null;
    let selectedType = null;

    /* =====================================================
       DETECT FILE TYPE
       ===================================================== */

    function detectFileType(file) {
        if (!file || !file.name) {
            return null;
        }

        const extension =
            file.name
                .split(".")
                .pop()
                .toLowerCase();

        if (extension === "aep") {
            return "AEP";
        }

        if (extension === "aex") {
            return "AEX";
        }

        return null;
    }

    /* =====================================================
       FORMAT FILE SIZE
       ===================================================== */

    function formatFileSize(bytes) {
        if (!Number.isFinite(bytes)) {
            return "0 KB";
        }

        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        if (bytes < 1024 * 1024 * 1024) {
            return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        }

        return `${(
            bytes /
            (1024 * 1024 * 1024)
        ).toFixed(2)} GB`;
    }

    /* =====================================================
       DISPLAY FILE
       ===================================================== */

    function displayFile(file) {
        if (!file) return;

        const type =
            detectFileType(file);

        if (!type) {
            selectedFile = null;
            selectedType = null;

            if (fileCard) {
                fileCard.classList.remove(
                    "visible"
                );
            }

            if (converterStatus) {
                converterStatus.textContent =
                    "Only .AEP and .AEX files are supported.";
            }

            if (convertButton) {
                convertButton.disabled = true;
            }

            return;
        }

        selectedFile = file;
        selectedType = type;

        if (fileName) {
            fileName.textContent =
                file.name;
        }

        if (fileSize) {
            fileSize.textContent =
                formatFileSize(file.size);
        }

        if (detectedType) {
            detectedType.textContent =
                type;
        }

        if (fileCard) {
            fileCard.classList.add(
                "visible"
            );
        }

        if (convertButton) {
            convertButton.disabled = false;
        }

        if (converterStatus) {
            converterStatus.textContent =
                `${type} file detected successfully.`;
        }
    }

    /* =====================================================
       FILE INPUT CHANGE
       ===================================================== */

    if (fileInput) {
        fileInput.addEventListener(
            "change",
            (event) => {
                const file =
                    event.target.files?.[0];

                if (file) {
                    displayFile(file);
                }
            }
        );
    }

    /* =====================================================
       DRAG & DROP
       ===================================================== */

    if (dropzone) {
        [
            "dragenter",
            "dragover"
        ].forEach((eventName) => {
            dropzone.addEventListener(
                eventName,
                (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    dropzone.classList.add(
                        "dragging"
                    );
                }
            );
        });

        [
            "dragleave",
            "drop"
        ].forEach((eventName) => {
            dropzone.addEventListener(
                eventName,
                (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    dropzone.classList.remove(
                        "dragging"
                    );
                }
            );
        });

        dropzone.addEventListener(
            "drop",
            (event) => {
                const file =
                    event.dataTransfer
                        ?.files?.[0];

                if (file) {
                    displayFile(file);
                }
            }
        );
    }

    /* =====================================================
       CONVERT
       ===================================================== */

    if (convertButton) {
        convertButton.addEventListener(
            "click",
            () => {
                if (
                    !selectedFile ||
                    !selectedType
                ) {
                    return;
                }

                const version =
                    targetVersion?.value ||
                    "Previous Version";

                if (converterStatus) {
                    converterStatus.textContent =
                        `${selectedType} selected · target After Effects ${version}`;
                }
            }
        );
    }

    /* =====================================================
       SMOOTH LINKS
       ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {
            link.addEventListener(
                "click",
                (event) => {
                    const id =
                        link.getAttribute(
                            "href"
                        );

                    if (
                        !id ||
                        id === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(
                            id
                        );

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            );
        });

    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    document
        .querySelectorAll("[data-year]")
        .forEach((element) => {
            element.textContent =
                new Date().getFullYear();
        });
});            dot.setAttribute("aria-hidden", "true");

            const angle = i * rotationStep;
            const delay = -(animationDuration / dotCount) * i;

            dot.style.setProperty("--angle", `${angle}deg`);
            dot.style.setProperty("--delay", `${delay}s`);
            dot.style.setProperty("--opacity", "1");

            dotmLoader.appendChild(dot);
        }
    }

    /* =====================================================
       LOCK WEBSITE DURING MAINTENANCE
       ===================================================== */

    function enableMaintenanceMode() {
        if (!maintenanceOverlay) return;

        maintenanceOverlay.hidden = false;
        maintenanceOverlay.setAttribute("aria-hidden", "false");

        html.classList.add("maintenance-active");
        body.classList.add("maintenance-active");

        html.style.overflow = "hidden";
        body.style.overflow = "hidden";

        /*
         * Prevent interaction with the website underneath.
         */
        const blockInteraction = (event) => {
            if (!maintenanceOverlay.contains(event.target)) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        const blockedEvents = [
            "click",
            "dblclick",
            "mousedown",
            "mouseup",
            "pointerdown",
            "pointerup",
            "pointermove",
            "touchstart",
            "touchmove",
            "touchend",
            "dragstart",
            "dragover",
            "drop",
            "contextmenu"
        ];

        blockedEvents.forEach((eventName) => {
            document.addEventListener(
                eventName,
                blockInteraction,
                true
            );
        });

        /*
         * Prevent scrolling.
         */
        document.addEventListener(
            "wheel",
            (event) => {
                event.preventDefault();
            },
            { passive: false, capture: true }
        );

        document.addEventListener(
            "touchmove",
            (event) => {
                event.preventDefault();
            },
            { passive: false, capture: true }
        );

        /*
         * Prevent keyboard interaction with the website.
         */
        document.addEventListener(
            "keydown",
            (event) => {
                /*
                 * Keep the maintenance screen completely locked.
                 */
                event.preventDefault();
                event.stopPropagation();
            },
            true
        );
    }

    /* =====================================================
       INITIALIZE MAINTENANCE SCREEN
       ===================================================== */

    buildDotMatrixLoader();

    if (MAINTENANCE_MODE) {
        enableMaintenanceMode();
    } else if (maintenanceOverlay) {
        maintenanceOverlay.hidden = true;
        maintenanceOverlay.setAttribute("aria-hidden", "true");
    }

    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", () => {
            const isOpen = mobileMenu.classList.toggle("active");

            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        mobileMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    /* =====================================================
       FILE INPUT / CONVERTER
       ===================================================== */

    const fileInput = document.getElementById("fileInput");
    const dropzone = document.getElementById("dropzone");
    const fileCard = document.getElementById("fileCard");
    const fileName = document.getElementById("fileName");
    const fileSize = document.getElementById("fileSize");
    const detectedType = document.getElementById("detectedType");
    const targetVersion = document.getElementById("targetVersion");
    const convertButton = document.getElementById("convertButton");
    const converterStatus = document.getElementById("converterStatus");

    let selectedFile = null;
    let selectedType = null;

    /* =====================================================
       FILE TYPE DETECTION
       ===================================================== */

    function detectFileType(file) {
        if (!file || !file.name) {
            return null;
        }

        const extension = file.name
            .split(".")
            .pop()
            .toLowerCase();

        if (extension === "aep") {
            return "AEP";
        }

        if (extension === "aex") {
            return "AEX";
        }

        return null;
    }

    /* =====================================================
       FILE SIZE FORMATTER
       ===================================================== */

    function formatFileSize(bytes) {
        if (!Number.isFinite(bytes) || bytes <= 0) {
            return "0 KB";
        }

        const units = ["B", "KB", "MB", "GB"];

        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        if (unitIndex === 0) {
            return `${Math.round(size)} ${units[unitIndex]}`;
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }

    /* =====================================================
       DISPLAY SELECTED FILE
       ===================================================== */

    function displayFile(file) {
        if (!file) return;

        const type = detectFileType(file);

        if (!type) {
            selectedFile = null;
            selectedType = null;

            if (fileCard) {
                fileCard.classList.remove("visible");
            }

            if (converterStatus) {
                converterStatus.textContent =
                    "Only .AEP and .AEX files are supported.";
            }

            if (convertButton) {
                convertButton.disabled = true;
            }

            return;
        }

        selectedFile = file;
        selectedType = type;

        if (fileName) {
            fileName.textContent = file.name;
        }

        if (fileSize) {
            fileSize.textContent = formatFileSize(file.size);
        }

        if (detectedType) {
            detectedType.textContent = type;
        }

        if (fileCard) {
            fileCard.classList.add("visible");
        }

        if (convertButton) {
            convertButton.disabled = false;
        }

        if (converterStatus) {
            converterStatus.textContent =
                `${type} file detected successfully.`;
        }
    }

    /* =====================================================
       FILE INPUT
       ===================================================== */

    if (fileInput) {
        fileInput.addEventListener("change", (event) => {
            const file = event.target.files?.[0];

            if (file) {
                displayFile(file);
            }
        });
    }

    /* =====================================================
       DRAG & DROP
       ===================================================== */

    if (dropzone) {
        ["dragenter", "dragover"].forEach((eventName) => {
            dropzone.addEventListener(eventName, (event) => {
                event.preventDefault();
                event.stopPropagation();

                dropzone.classList.add("dragging");
            });
        });

        ["dragleave", "drop"].forEach((eventName) => {
            dropzone.addEventListener(eventName, (event) => {
                event.preventDefault();
                event.stopPropagation();

                dropzone.classList.remove("dragging");
            });
        });

        dropzone.addEventListener("drop", (event) => {
            const file = event.dataTransfer?.files?.[0];

            if (file) {
                displayFile(file);
            }
        });
    }

    /* =====================================================
       CONVERT BUTTON
       ===================================================== */

    if (convertButton) {
        convertButton.addEventListener("click", () => {
            if (!selectedFile || !selectedType) {
                return;
            }

            const version =
                targetVersion?.value || "Previous Version";

            /*
             * The actual AEP/AEX conversion service is not
             * connected to this static GitHub Pages frontend.
             *
             * Do not pretend that a conversion happened.
             */
            if (converterStatus) {
                converterStatus.textContent =
                    `${selectedType} selected · target After Effects ${version}`;
            }
        });
    }

    /* =====================================================
       SMOOTH INTERNAL LINKS
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });

    /* =====================================================
       YEAR
       ===================================================== */

    const yearElements = document.querySelectorAll("[data-year]");

    yearElements.forEach((element) => {
        element.textContent = new Date().getFullYear();
    });
});    if (!maintenanceOverlay) {
        return;
    }


    document.documentElement.classList.add(
        "maintenance-active"
    );


    document.body.classList.add(
        "maintenance-active"
    );


    /*
        Prevent the page behind the overlay
        from scrolling.
    */

    document.documentElement.style.overflow = "hidden";

    document.body.style.overflow = "hidden";


    /*
        Block keyboard interaction with
        the website underneath.
    */

    document.addEventListener(
        "keydown",
        blockPageInteraction,
        true
    );


    /*
        Block pointer interaction with
        everything behind the overlay.
    */

    document.addEventListener(
        "pointerdown",
        blockPageInteraction,
        true
    );


    document.addEventListener(
        "pointerup",
        blockPageInteraction,
        true
    );


    document.addEventListener(
        "click",
        blockPageInteraction,
        true
    );


    document.addEventListener(
        "mousedown",
        blockPageInteraction,
        true
    );


    document.addEventListener(
        "mouseup",
        blockPageInteraction,
        true
    );


    document.addEventListener(
        "touchstart",
        blockPageInteraction,
        {
            capture: true,
            passive: false
        }
    );


    document.addEventListener(
        "touchmove",
        blockPageInteraction,
        {
            capture: true,
            passive: false
        }
    );


    document.addEventListener(
        "touchend",
        blockPageInteraction,
        {
            capture: true,
            passive: false
        }
    );


    /*
        Block drag & drop interaction.
    */

    document.addEventListener(
        "dragover",
        blockPageInteraction,
        true
    );


    document.addEventListener(
        "drop",
        blockPageInteraction,
        true
    );

}


function blockPageInteraction(event) {

    /*
        The maintenance overlay itself
        is allowed to exist visually,
        but it does not need interaction.
    */

    event.preventDefault();

    event.stopPropagation();

}


/* ==================================================
   START MAINTENANCE MODE
================================================== */

if (MAINTENANCE_MODE) {

    enableMaintenanceMode();

}


/* ==================================================
   CONVERTER ELEMENTS
================================================== */

const input =
    document.querySelector("#file");

const drop =
    document.querySelector("#dropzone");

const card =
    document.querySelector("#fileCard");

const typeEl =
    document.querySelector("#fileType");

const nameEl =
    document.querySelector("#fileName");

const sizeEl =
    document.querySelector("#fileSize");

const detected =
    document.querySelector("#detectedType");

const remove =
    document.querySelector("#removeFile");

const convert =
    document.querySelector("#convert");

const status =
    document.querySelector("#status");

const target =
    document.querySelector("#targetVersion");


let selectedFile = null;


/* ==================================================
   STATUS
================================================== */

function showStatus(message = "") {

    if (!status) {
        return;
    }


    status.textContent = message;


    status.classList.toggle(
        "hidden",
        !message
    );

}


/* ==================================================
   FILE SIZE
================================================== */

function formatSize(bytes) {

    if (bytes < 1024 * 1024) {

        return `${(bytes / 1024).toFixed(1)} KB`;

    }


    return `${(
        bytes /
        1024 /
        1024
    ).toFixed(2)} MB`;

}


/* ==================================================
   FILE SELECTION
================================================== */

function selectFile(file) {

    if (!file) {
        return;
    }


    const fileName =
        file.name.toLowerCase();


    let extension = "";


    if (fileName.endsWith(".aep")) {

        extension = ".aep";

    }

    else if (fileName.endsWith(".aex")) {

        extension = ".aex";

    }


    if (!extension) {

        showStatus(
            "Unsupported file. Please select an .aep or .aex file."
        );

        return;

    }


    selectedFile = file;


    typeEl.textContent =
        extension
            .substring(1)
            .toUpperCase();


    detected.textContent =
        extension === ".aep"
            ? "AEP PROJECT"
            : "AEX PLUGIN";


    nameEl.textContent =
        file.name;


    sizeEl.textContent =
        formatSize(file.size);


    card.classList.remove(
        "hidden"
    );


    convert.disabled = false;


    showStatus("");

}


/* ==================================================
   FILE INPUT
================================================== */

if (input) {

    input.addEventListener(
        "change",
        () => {

            selectFile(
                input.files[0]
            );

        }
    );

}


/* ==================================================
   DROP ZONE CLICK
================================================== */

if (drop) {

    drop.addEventListener(
        "click",
        () => {

            /*
                During maintenance mode,
                the global interaction lock
                prevents this from doing anything.
            */

            if (MAINTENANCE_MODE) {
                return;
            }


            input.click();

        }
    );


    /* ==================================================
       DRAG OVER
    ================================================== */

    drop.addEventListener(
        "dragover",
        (event) => {

            event.preventDefault();


            if (MAINTENANCE_MODE) {
                return;
            }


            drop.style.borderColor =
                "#ff6fa6";

        }
    );


    /* ==================================================
       DRAG LEAVE
    ================================================== */

    drop.addEventListener(
        "dragleave",
        () => {

            drop.style.borderColor = "";

        }
    );


    /* ==================================================
       DROP
    ================================================== */

    drop.addEventListener(
        "drop",
        (event) => {

            event.preventDefault();


            if (MAINTENANCE_MODE) {
                return;
            }


            drop.style.borderColor = "";


            const file =
                event.dataTransfer.files[0];


            selectFile(file);

        }
    );

}


/* ==================================================
   REMOVE FILE
================================================== */

if (remove) {

    remove.addEventListener(
        "click",
        () => {

            if (MAINTENANCE_MODE) {
                return;
            }


            selectedFile = null;


            input.value = "";


            card.classList.add(
                "hidden"
            );


            detected.textContent =
                "Waiting for file";


            convert.disabled = true;


            showStatus("");

        }
    );

}


/* ==================================================
   CONVERT
================================================== */

if (convert) {

    convert.addEventListener(
        "click",
        () => {

            if (MAINTENANCE_MODE) {
                return;
            }


            if (!selectedFile) {
                return;
            }


            /*
                GitHub Pages is static hosting.

                The actual AEP/AEX conversion engine
                must later be connected to a backend.

                This frontend is ready for that API.
            */

            const selectedType =
                selectedFile.name
                    .split(".")
                    .pop()
                    .toUpperCase();


            const version =
                target.value;


            showStatus(
                `${selectedType} selected · target After Effects ${version}`
            );

        }
    );

                }
