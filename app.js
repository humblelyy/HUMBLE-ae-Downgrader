const input = document.querySelector("#file");
const drop = document.querySelector("#dropzone");
const card = document.querySelector("#fileCard");
const typeEl = document.querySelector("#fileType");
const nameEl = document.querySelector("#fileName");
const sizeEl = document.querySelector("#fileSize");
const detected = document.querySelector("#detectedType");
const remove = document.querySelector("#removeFile");
const convert = document.querySelector("#convert");
const status = document.querySelector("#status");
const target = document.querySelector("#targetVersion");

let selectedFile = null;

function showStatus(message = "") {
    status.textContent = message;
    status.classList.toggle("hidden", !message);
}

function formatSize(bytes) {
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function selectFile(file) {
    if (!file) return;

    const fileName = file.name.toLowerCase();

    let extension = "";

    if (fileName.endsWith(".aep")) {
        extension = ".aep";
    } else if (fileName.endsWith(".aex")) {
        extension = ".aex";
    }

    if (!extension) {
        showStatus("Unsupported file. Please select an .aep or .aex file.");
        return;
    }

    selectedFile = file;

    typeEl.textContent = extension.substring(1).toUpperCase();

    detected.textContent =
        extension === ".aep"
            ? "AEP PROJECT"
            : "AEX PLUGIN";

    nameEl.textContent = file.name;
    sizeEl.textContent = formatSize(file.size);

    card.classList.remove("hidden");

    convert.disabled = false;

    showStatus("");
}

input.addEventListener("change", () => {
    selectFile(input.files[0]);
});

drop.addEventListener("click", () => {
    input.click();
});

drop.addEventListener("dragover", (event) => {
    event.preventDefault();

    drop.style.borderColor = "#ff6fa6";
});

drop.addEventListener("dragleave", () => {
    drop.style.borderColor = "";
});

drop.addEventListener("drop", (event) => {
    event.preventDefault();

    drop.style.borderColor = "";

    const file = event.dataTransfer.files[0];

    selectFile(file);
});

remove.addEventListener("click", () => {
    selectedFile = null;

    input.value = "";

    card.classList.add("hidden");

    detected.textContent = "Waiting for file";

    convert.disabled = true;

    showStatus("");
});

convert.addEventListener("click", () => {
    if (!selectedFile) {
        return;
    }

    /*
        IMPORTANT:

        GitHub Pages is static hosting.

        It cannot run the actual After Effects
        conversion engine.

        This button should call your real backend API
        once that backend is deployed.
    */

    showStatus(
        "Conversion service is not connected yet."
    );
});
