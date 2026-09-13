/* =========================================================
   HUMBLE DOWNGRADER
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       MAINTENANCE MODE
       ===================================================== */

    const MAINTENANCE_MODE = true;

    const html = document.documentElement;
    const body = document.body;
    const maintenanceOverlay = document.getElementById("maintenanceOverlay");
    const dotmLoader = document.getElementById("dotmLoader");

    /* =====================================================
       DOTM CIRCULAR 10 STYLE LOADER
       ===================================================== */

    function buildDotMatrixLoader() {
        if (!dotmLoader) return;

        dotmLoader.innerHTML = "";

        const dotCount = 10;
        const rotationStep = 360 / dotCount;
        const animationDuration = 1.4;

        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement("span");

            dot.className = "dotm-dot";
            dot.setAttribute("aria-hidden", "true");

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
