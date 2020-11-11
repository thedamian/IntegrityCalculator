const socket = io();
const urlInput = document.getElementById("url");
const resultsDiv = document.getElementById("results");

function submiturl() {
    if (!urlInput.value || !urlInput.value.trim()) {
        alert("We need a value for the url");
        return false;
    }
    let UrlInfo = {url: urlInput.value, id:socket.id}

    socket.emit('newUrl', UrlInfo);
    return false;
}

socket.on("newCalculation", (CalculatedIntegrity) => {
    console.log("NewCalculation",CalculatedIntegrity)
    let NewCalculatedIntegrity = document.createElement("div");
    NewCalculatedIntegrity.innerText = '<script src="' + CalculatedIntegrity.url +'" integrity="' + CalculatedIntegrity.integrity + '" crossorigin="anonymous"></script>';
    resultsDiv.appendChild(NewCalculatedIntegrity);
    
})