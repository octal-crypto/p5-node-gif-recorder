const express = require("express");
const p5 = require("node-p5");

express().get("/", (req, res) => p5.createSketch(sketch(req.url, res))).listen(3000);

// Snowcrash p5js code
function sketch(url, res) {
    return p => {
        p.setup = () => {
            const contents = url.split('x=')
            const result = contents[1].split('&t=')
            this.tokenId = parseInt(result[0]);
            const hash = result[1];
            this.f = 0;
            this.charsets = ["Ñ$50c-", "@97?;,", "#8£!:.", "₩42a+_", "%gm;)'", "0101/ "]
            const cols = [0, 1, 2, 4, 5, 6, 7, 8, 9, 11]
            const fSizes = [12.5, 9, 6, 4.7]
            const noiseEnd = [0.001, 0.002, 0.005, 0.008]
            const speeds = [0.7, 1.2, 2.5, 2.6]
            const textCol = [0, 100]
            const charSpread = [0.06, 0.12, 0.18, 0.24]

            this.t = 0
            this.xoff1 = 0
            this.yoff1 = 0
            this.xyoff = 0
            this.n = 0
            this.satTwo = 0
            this.colTwo = 0
            const w = 500
            const h = 500
            const canvas = p.createCanvas(w, h);
            p.colorMode(p.HSB, 360, 100, 100);
            p.textFont('Courier')
            p.noiseSeed(this.tokenId)
            //bgcolor
            this.colOne = cols[parseInt(hash.substring(0, 1))] * 30
            //frameSize
            // frame = Math.floor(random(0, 4)); // TODO: is this used?
            this.frameW = p.width / fSizes[parseInt(hash.substring(1, 2))]
            this.frameH = p.height / fSizes[parseInt(hash.substring(1, 2))]
            //noisiness
            this.end = noiseEnd[parseInt(hash.substring(2, 3))]
            //speed
            p.speed = speeds[parseInt(hash.substring(3, 4))] / (frameW + frameH) / 3;
            //spread
            this.spread = charSpread[parseInt(hash.substring(4, 5))]
            //textCol
            this.brightTwo = textCol[parseInt(hash.substring(5, 6))]
            //char set
            this.chars = parseInt(hash.substring(6, 7))
            //flow-type
            this.flowType = parseInt(hash.substring(7, 8))

            this.satOne = 80
            if (this.brightTwo == 100) {
                this.brightOne = 85
            } else {
                this.brightOne = 100
            }
            p.fill(this.colTwo, this.satTwo, this.brightTwo);

            // Save and return GIF
            setTimeout(() =>
                p.saveFrames(canvas, "out", { quality: 10 }, 5, 60)
                    .then(() => res.sendFile("out.gif", { root: 'out' })), 1);
        }

        p.draw = () => {
            p.background(this.colOne, this.satOne, this.brightOne);
            for (let x = this.frameW; x <= p.width - this.frameW; x += 10) {
                for (let y = this.frameH; y <= p.height - this.frameH; y += 10) {
                    this.xoff1 = p.map(x, this.frameW, p.width, 0, this.end)
                    this.yoff1 = p.map(y, this.frameH, p.height, 0, this.end)
                    this.xyoff = this.xoff1 + this.yoff1
                    this.n = p.noise(x * this.xyoff + this.t, y * xyoff + this.t, this.f);
                    p.noStroke();
                    p.fill(this.colTwo, this.satTwo, this.brightTwo);
                    if (this.n > 0.5 + this.spread * 0.80 || this.n < 0.50 - this.spread * 0.8) {
                        p.text(this.charsets[this.chars][0], x, y)
                    } else if (this.n > 0.5 + this.spread * 0.65 || this.n < 0.50 - this.spread * 0.65) {
                        p.text(this.charsets[this.chars][1], x, y)
                    } else if (this.n > 0.5 + this.spread * 0.5 || this.n < 0.50 - this.spread * 0.5) {
                        p.text(this.charsets[this.chars][2], x, y)
                    } else if (this.n > 0.5 + this.spread * 0.35 || this.n < 0.50 - this.spread * 0.35) {
                        p.text(this.charsets[this.chars][3], x, y)
                    } else if (this.n > 0.5 + this.spread * 0.2 || this.n < 0.50 - this.spread * 0.2) {
                        p.text(this.charsets[this.chars][4], x, y)
                    } else {
                        p.text(this.charsets[this.chars][5], x, y)
                    }
                }
            }
            if (this.flowType == 0) {
                this.t += p.speed
            } else {
                this.f += p.speed
                this.t += p.speed / 10
            }
            p.text("#" + this.tokenId.toString(), 10, p.height - 10)
        }
    }
}
