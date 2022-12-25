import { parseGIF, decompressFrames } from 'gifuct-js';

class VirusAnimation {
    constructor() {
        this.gif = null;
        this.frames = [];
        this.currentFrameIndex = 0;
        this.tempCanvas = document.createElement('canvas');
        this.tempCtx = this.tempCanvas.getContext('2d');
        this.latestFrameChangeTimestamp = null;
    };

    async loadGif(gifURL) {
        const response = await fetch(gifURL);
        const buffer = await response.arrayBuffer();

        this.gif = parseGIF(buffer);
        this.frames = decompressFrames(this.gif, true);

        this.tempCanvas.width = this.frames[0].dims.width;
        this.tempCanvas.height = this.frames[0].dims.height;
    };

    get currentFrame() {
        // Drawing for the first frame
        if (!this.latestFrameChangeTimestamp) {
            this.drawFrameToCanvas();
            this.latestFrameChangeTimestamp = Date.now();
            return this.tempCanvas;
        };

        const elapsedTime = Date.now() - this.latestFrameChangeTimestamp;

        // If more than 100ms passed since frame change - requesting...
        // .. frame change and drawing new frame
        if (elapsedTime >= 100) {
            this.requestFrameChange();
            this.drawFrameToCanvas();
        };
        // If less than 100ms passed since frame change - returning the same frame

        return this.tempCanvas;
    };

    drawFrameToCanvas() {
        const currentFrame = this.frames[this.currentFrameIndex];

        const { width, height } = this.tempCanvas;

        const imageData = this.tempCtx.createImageData(width, height);
        imageData.data.set(currentFrame.patch);

        this.tempCtx.putImageData(imageData, 0, 0);
    };

    requestFrameChange() {
        // Clearing canvas
        this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);

        // If the current frame is the last frame in sequence...
        // .. setting the first frame from sequence as the next frame
        if (this.currentFrameIndex === this.frames.length - 1) {
            this.currentFrameIndex = 0;
        } else {
            this.currentFrameIndex++;
        };

        this.latestFrameChangeTimestamp = Date.now();
    };
};

export default VirusAnimation;
