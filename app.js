/* ==================================================
   HUMBLE DOWNGRADER
   Maintenance Mode + Converter UI
================================================== */


/*
    ==================================================
    MAINTENANCE MODE
    ==================================================

    true  = maintenance screen ON
    false = website available normally

    When the website is ready, simply change:

        true

    to:

        false
*/

const MAINTENANCE_MODE = true;


/* ==================================================
   MAINTENANCE LOCK
================================================== */

const maintenanceOverlay =
    document.querySelector("#maintenanceOverlay");


function enableMaintenanceMode() {

    if (!maintenanceOverlay) {
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
