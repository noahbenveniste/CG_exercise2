/* classes */ 

// Color constructor
class Color {
    
        // Color constructor default opaque black
    constructor(r=0,g=0,b=0,a=255) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end try
        
        catch (e) {
            console.log(e);
        }
    } // end Color constructor

        // Color change method
    change(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
                return(this);
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color change method
    
        // Color add method
    add(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.add: non-color parameter";
            else {
                this.r += c.r; this.g += c.g; this.b += c.b; this.a += c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end color add
    
        // Color subtract method
    subtract(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.subtract: non-color parameter";
            else {
                this.r -= c.r; this.g -= c.g; this.b -= c.b; this.a -= c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end color subgtract
    
        // Color scale method
    scale(s) {
        try {
            if (typeof(s) !== "number")
                throw "scale factor not a number";
            else {
                this.r *= s; this.g *= s; this.b *= s; this.a *= s; 
                return(this);
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color scale method
    
        // Color copy method
    copy(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.copy: non-color parameter";
            else {
                this.r = c.r; this.g = c.g; this.b = c.b; this.a = c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end Color copy method
    
        // Color clone method
    clone() {
        var newColor = new Color();
        newColor.copy(this);
        return(newColor);
    } // end Color clone method
    
        // Send color to console
    toConsole() {
        console.log(this.r +" "+ this.g +" "+ this.b +" "+ this.a);
    }  // end Color toConsole
    
} // end color class


/* utility functions */

// draw a pixel at x,y using color
function drawPixel(imagedata,x,y,color) {
    try {
        if ((typeof(x) !== "number") || (typeof(y) !== "number"))
            throw "drawpixel location not a number";
        else if ((x<0) || (y<0) || (x>=imagedata.width) || (y>=imagedata.height))
            throw "drawpixel location outside of image";
        else if (color instanceof Color) {
            var pixelindex = (y*imagedata.width + x) * 4;
            imagedata.data[pixelindex] = color.r;
            imagedata.data[pixelindex+1] = color.g;
            imagedata.data[pixelindex+2] = color.b;
            imagedata.data[pixelindex+3] = color.a;
        } else 
            throw "drawpixel color is not a Color";
    } // end try
    
    catch(e) {
        console.log(e);
    }
} // end drawPixel
    

/* main -- here is where execution begins after window load */

function lerp(color1, color2, t) {
    var r = color1.r + t*(color2.r - color1.r);
    var g = color1.g + t*(color2.g - color1.g);
    var b = color1.b + t*(color2.b - color1.b);
    var a = color1.a + t*(color2.a - color1.a);
    return new Color(r,g,b,a);
}

function main() {

    // Get the canvas, context, and image data
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");
    var w = context.canvas.width; // as set in html
    var h = context.canvas.height;  // as set in html
    var imagedata = context.createImageData(w,h);
 
    /*
    // Define a rectangle in 2D with colors and coords at corners
    var ulc = new Color(0,255,255,255); // upper left corner color: cyan
    var urc = new Color(255,0,255,255); // upper right corner color: magenta
    var llc = new Color(255,255,0,255); // lower left corner color: yellow
    var lrc = new Color(255,192,203,255); // lower right corner color: pink
    var ulx = 50, uly = 50; // upper left corner position
    var urx = 200, ury = 50; // upper right corner position
    var llx = 50, lly = 150; // lower left corner position
    var lrx = 200, lry = 150; // lower right corner position
    
    // set up the vertical interpolation
    var lc = ulc.clone();  // left color
    var rc = urc.clone();  // right color
    var vDelta = 1 / (lly-uly); // norm'd vertical delta
    var lcDelta = llc.clone().subtract(ulc).scale(vDelta); // left vert color delta
    var rcDelta = lrc.clone().subtract(urc).scale(vDelta); // right vert color delta
    
    // set up the horizontal interpolation
    var hc = new Color(); // horizontal color
    var hDelta = 1 / (urx-ulx); // norm'd horizontal delta
    var hcDelta = new Color(); // horizontal color delta
    
    // do the interpolation
    for (var y=uly; y<=lly; y++) {
        hc.copy(lc); // begin with the left color
        hcDelta.copy(rc).subtract(lc).scale(hDelta); // reset horiz color delta
        for (var x=ulx; x<=urx; x++) {
            drawPixel(imagedata,x,y,hc);
            hc.add(hcDelta);
        } // end horizontal
        lc.add(lcDelta);
        rc.add(rcDelta);
    } // end vertical
    */
    
    // Define a triangle in 2D with colors and coords at corners
    var ucc = new Color(0,255,255,255); // Upper center color: cyan
    var lrc = new Color(255,255,0,255); // Lower right color: yellow
    var llc = new Color(255,0,255,255); // Lower left color: magenta
    var ucx = 50, ucy = 0; // Upper center vertex
    var lrx = 100, lry = 100; // Lower right vertex
    var llx = 0, lly = 100; // Lower left vertex
    
    // Draw the triangle
    for (var y = ucy; y <= lly; y++) {
        // Calculate the "slider" value to plug into lerp for the left and right leg of the triangle.
        // This expression was derived using the pythagorean theorem.
        var s = Math.sqrt(y*y + y*y/4) / Math.sqrt(100*100 + 50*50);
        if ( s > 1 ) { s = 1; }
        console.log("s = " + s);
        // Do vertical lerp for this row
        var lc = lerp(ucc,llc,s);
        var rc = lerp(ucc,lrc,s);
        for (var x = (ucx - Math.floor(y/2)); x <= (ucx + Math.floor(y/2)); x++) { // TODO: Generalize this
            // Calculate the "slider" value to plug into horizontal lerp
            var t = 0;
            if ( y > 0 ) {
                t = (x-50+(y/2))/y; // y is the total length of the base of the current sub-triangle,
                                    // x-50+(y/2) is how far along the base we are from the left vertex
            }
            // console.log("t = " + t);
            // Do horizontal lerp between the two vertical lerp colors to get the color for this pixel
            var c = lerp(lc,rc,t);
            drawPixel(imagedata,x,y,c);
        }
    }
    
    context.putImageData(imagedata, 0, 0); // display the image in the context
}
