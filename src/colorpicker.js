let pickColor = document.getElementById("pick-color");
let error = document.getElementById("error");
let browseFiles = document.getElementById("file");
let image = document.getElementById("image");
let hexValRef = document.getElementById("hex-val-ref");
let rgbValRef = document.getElementById("rgb-val-ref");
let customAlert = document.getElementById("custom-alert");
let pickedColorRef = document.getElementById("picked-color-ref");
let eyeDropper;

//On Window load check if the browser supports the eyedropper
window.onload = () => 
{
    //If supported, show the eyedropper to pick color and hide the error message and vice versa
    if ("EyeDropper" in window) 
    {        
        pickColor.classList.remove("hide");
        eyeDropper = new EyeDropper();
    } 
    else 
    {
        error.classList.remove("hide");
        error.innerText = "Your browser doesn't support the eyedropper! Please use Chrome 92 or above, or Edge 92 or above to use this.";
        pickColor.classList.add("hide");
        return false;
    }
};

//Eyedropper routine
const colorSelector = async () => 
{
    const color = await eyeDropper
    .open()
    .then((colorValue) => 
    {
        error.classList.add("hide");
        //Get the hex color code
        let hexValue = colorValue.sRGBHex;
        //Convert hex 2 RGB
        let rgbArr = [];
        for (let i = 1; i < hexValue.length; i += 2) 
        {
            //Push the RGB values to the array and convert the hex to decimal
            rgbArr.push(parseInt(hexValue[i] + hexValue[i + 1], 16));
            //console.log(rgbArr);
        }
        let rgbValue = "rgb(" + rgbArr + ")";
        //console.log(hexValue, rgbValue);
        result.style.display = "grid";
        hexValRef.value = hexValue;
        rgbValRef.value = rgbValue;
        //Set the background color of the div of the picked color
        pickedColorRef.style.backgroundColor = hexValue;
    })
    .catch((err) => 
    {
        //Show the error message
        error.classList.remove("hide");
        //If ESC key is pressed then close the eyedropper
        if (err.toString().includes("AbortError")) 
        {
            error.innerText = "";
        } 
        else 
        {
            error.innerText = err;
        }
    });
};

//Event listener for the "Pick Color" button
pickColor.addEventListener("click", colorSelector);

//Browse for an image
browseFiles.onchange = () => 
{
    //Hide the result section
    result.style.display = "none";
    //Show the image
    let reader = new FileReader();
    //Read the content of input image
    reader.readAsDataURL(browseFiles.files[0]);
    //Onload is triggered when the read operation is successfully completed
    reader.onload = () => 
    {        
        //Set src attribute of image to the result/input file
        image.setAttribute("src", reader.result);
    };
};

//Copy the color code
let copy = (textId) => 
{
    //Select the text in the <input> element
    document.getElementById(textId).select();
    //Copy the selected text
    document.execCommand("copy");
    //Display copy alert message (timeout = 2s)
    customAlert.style.transform = "scale(1)";
    setTimeout(() => 
    {
        customAlert.style.transform = "scale(0)";
    }, 2000);
};