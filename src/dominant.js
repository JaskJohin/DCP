const fileInput = document.getElementById("file")
const preview = document.getElementById("image");
const colorOutput = document.getElementById("rgb-val-ref");
const findDominantColor = document.getElementById("findDominantColor");
const downloadPaletteButton = document.getElementById("downloadPaletteButton");

    //----------Functions----------//

    //Image preview
function changeImage(input) 
{
    var reader;
    if (input.files && input.files[0]) 
    {
        reader = new FileReader();
        reader.onload = function(e) 
        {
            preview.setAttribute('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

    //Image Dominant Color
function getDominantColor(imgEl) 
{
    //Color blocks size (Here is 5x5 pixels)
    var blockSize = 5;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext && canvas.getContext('2d');
    var data;
    var width;
    var height;
    var i = -4;
    var length;
    var rgb = {r:0,g:0,b:0};

    if (!context) 
    {
        return null;
    }
    //Get the image size
    width = canvas.width = imgEl.width;
    height = canvas.height = imgEl.height;
    //Draw the image on the canvas
    context.drawImage(imgEl, 0, 0);

    try 
    {
        //Get the image data from the canvas
        data = context.getImageData(0, 0, width, height);
    } 
    catch(error) 
    {
        //Uploaded image on different domain
        console.log('Error: ', error);
        return null;
    }
    //Get the image data array length (4 bytes per pixel) 
    length = data.data.length;
    //Create a histogram of all the colors in the image
    var colorCounts = {};
    //Loop through all the pixels in the image data array
    while ((i += blockSize * 4) < length) 
    {
        //Get the red value of the current pixel
         r = data.data[i];
        //Get the green value of the current pixel
         g = data.data[i+1];
        //Get the blue value of the current pixel
         b = data.data[i+2];

        //Ignore very dark colors
        if (r < 21 || g < 21 || b < 21) continue;      
     
        //Concatenate the RGB values to a string
        var color = r + ',' + g + ',' + b;
        //Add the color string to the colorCounts object and increment the count
        if (!(color in colorCounts)) 
        {
            colorCounts[color] = 0;
        }
        //Go to the next pixel in the image data array         
        colorCounts[color]++;
    }

    //Find the most frequent color
    var mostFrequentColor = null;
    var maxCount = 0;
    //Loop through all the colors in the colorCounts object
    for (var color in colorCounts) 
    {
        //If the current color count is higher than the max count
        if (colorCounts[color] > maxCount) 
        {
            //Set the max count to the current color count
            mostFrequentColor = color;
            maxCount = colorCounts[color];
        }
    }

    if (mostFrequentColor) 
    {
        //Split the color string into an array of RGB values
        var parts = mostFrequentColor.split(',');
        rgb.r = parseInt(parts[0], 9);
        rgb.g = parseInt(parts[1], 9);
        rgb.b = parseInt(parts[2], 9);
    }
    //Return RGB;
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

        //----------Event Listeners----------//

//Event listener for the "Browse Files" button
fileInput.addEventListener("change", function () 
{
    changeImage(this);
});

//Event listener for the "Find Dominant Color" button
findDominantColor.addEventListener("click", function () 
{
    var rgb = getDominantColor(preview);
    document.body.style.backgroundColor = rgb
    findDominantColor.textContent = `RGB: ${rgb}`;
});

//Event listener for the "Download Palette as Text" button
downloadPaletteButton.addEventListener("click", function() 
{
    const dominantColor = getDominantColor(preview);
    const paletteContent = `data:text/plain;charset=utf-8,${dominantColor}`;
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", paletteContent);
    downloadLink.setAttribute("download", "dominant-palette.txt");
    downloadLink.click();
});