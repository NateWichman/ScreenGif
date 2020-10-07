export const grayScale = (context, canvas) => {
    const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    for (let i = 0, n = pixels.length; i < n; i += 4) {
        const grayscale =
            pixels[i] * 0.3 + pixels[i + 1] * 0.59 + pixels[i + 2] * 0.11;
        pixels[i] = grayscale; // red
        pixels[i + 1] = grayscale; // green
        pixels[i + 2] = grayscale; // blue
        //pixels[i+3]              is alpha
    }
    //redraw the image in black & white
    context.putImageData(imgData, 0, 0);
};
