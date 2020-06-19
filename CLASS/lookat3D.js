"use strict";


var canvas;
var gl;

var numVertices  = 108;

var pointsArray = [];
var colorsArray = [];

var vertices = [
  vec4(0.3,0.3,0,1),
  vec4(0.3,0,0,1),
  vec4(0,0.3,0,1),
  vec4(0,0,0.3,1),
  vec4(0,0.3,0.3,1),
  vec4(0.3,0,0.3,1),
  vec4(0,0,0,1),
  vec4(0.3,0.3,0.3,1),

  vec4(0.6,0.3,0,1),
  vec4(0.6,0,0,1),
  vec4(0.6,0,0.3,1),
  vec4(0.6,0.3,0.3,1),

  vec4(0,0.3,0.6,1),
  vec4(0.3,0.3,0.6,1),
  vec4(0,0,0.6,1),
  vec4(0.3,0,0.6,1)
    ];

var vertexColors = [
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    ];

var near = -1;
var far = 1;
var radius = 1.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -1.0;
var right = 1.0;
var ytop = 1.0;
var bottom = -1.0;


var mvMatrix, pMatrix;
var modelView, projection;
var eye;

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

// quad uses first index to set color for face

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[c]);

     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[c]);

     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[a]);
}

// Each face determines two triangles
//abc acd
function colorCube()
{
  quad(0,2,4,7);
  quad(1,0,2,6);
  quad(6,3,5,1);
  quad(5,3,4,7);
  quad(2,6,3,4);
  quad(1,5,7,0);

  quad(0,7,11,8);
  quad(1,9,10,5);
  quad(0,1,9,8);
  quad(7,11,10,5);
  quad(5,1,0,7);
  quad(8,11,10,9);

  quad(4,12,13,7);
  quad(4,7,5,3);
  quad(3,14,15,5);
  quad(5,7,13,15);
  quad(4,3,14,12);
  quad(12,13,15,14);

}


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );

// buttons to change viewing parameters

    document.getElementById("Button1").onclick = function(){near  *= 1.1; far *= 1.1;};
    document.getElementById("Button2").onclick = function(){near *= 0.9; far *= 0.9;};
    document.getElementById("Button3").onclick = function(){radius *= 1.1;};
    document.getElementById("Button4").onclick = function(){radius *= 0.9;};
    document.getElementById("Button5").onclick = function(){theta += dr;};
    document.getElementById("Button6").onclick = function(){theta -= dr;};
    document.getElementById("Button7").onclick = function(){phi += dr;};
    document.getElementById("Button8").onclick = function(){phi -= dr;};

    render();
}


var render = function() {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        eye = vec3(radius*Math.sin(phi), radius*Math.sin(theta),
             radius*Math.cos(phi));

        mvMatrix = lookAt(eye, at , up);
        pMatrix = ortho(left, right, bottom, ytop, near, far);

        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
        gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );

        gl.drawArrays( gl.TRIANGLES, 0, numVertices );
        requestAnimFrame(render);
    }
