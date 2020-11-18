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
    resultsDiv.innerHTML = "Working...";
    socket.emit('newUrl', UrlInfo);
    urlInput.value = "";
    //setTimeout(()=> { if (resultsDiv.innerHTML == "Working...") {resultsDiv.innerHTML = "Failed!"; } },2000);
    return false;
}

function submitscript() {
    if (!scriptOnly.value || !scriptOnly.value.trim()) {
        return false;
    }
    resultsDiv.innerHTML = "Working...";
    socket.emit('scriptOnly', scriptOnly.value);
    scriptOnly.value = "";
    //setTimeout(()=> { if (resultsDiv.innerHTML = "Working...") {resultsDiv.innerHTML = "Failed!"; } },2000);
    return false;
}


socket.on("newCalculation", (CalculatedIntegrity) => {
    if ( resultsDiv.innerHTML == "Working..." || resultsDiv.innerHTML == "Failed!") {
	resultsDiv.innerHTML = "";
    }
    console.log("NewCalculation",CalculatedIntegrity)
    let NewCalculatedIntegrity = document.createElement("div");
    NewCalculatedIntegrity.innerText = '<script src="' + CalculatedIntegrity.url +'" integrity="' + CalculatedIntegrity.integrity + '" crossorigin="anonymous" type="application/javascript"></script>';
    resultsDiv.appendChild(NewCalculatedIntegrity);
    
})
