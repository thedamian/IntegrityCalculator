const socket = io();
const urlInput = document.getElementById("url");
const resultsDiv = document.getElementById("results");
const scriptOnly = document.getElementById("scriptOnly");
const scriptResults = document.getElementById("scriptResults");


function submiturl() {
    if (!urlInput.value || !urlInput.value.trim()) {
        alert("We need a value for the url");
        return false;
    }
    let UrlInfo = {url: urlInput.value, id:socket.id}

    socket.emit('newUrl', UrlInfo);
    urlInput.value = "";
    return false;
}

function submitscript() {
    if (!scriptOnly.value || !scriptOnly.value.trim()) {
        return false;
    }
    socket.emit('scriptOnly', scriptOnly.value);
    scriptOnly.value = "";
    return false;
}


socket.on("newCalculation", (CalculatedIntegrity) => {
    console.log("NewCalculation",CalculatedIntegrity)
    let NewCalculatedIntegrity = document.createElement("div");
    NewCalculatedIntegrity.innerText = '<script src="' + CalculatedIntegrity.url +'" integrity="' + CalculatedIntegrity.integrity + '" crossorigin="anonymous"></script>';
    resultsDiv.appendChild(NewCalculatedIntegrity);
    
})
