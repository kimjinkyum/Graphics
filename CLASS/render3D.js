"use strict";

var canvas;
var gl;

var NumVertices  = 108;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");

    //event listeners for buttons

    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };

    render();
}

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

var vertexColors = [
    [ 0.0, 0.0, 0.0, 1.0 ],
    [ 1.0, 0.0, 0.0, 1.0 ],
    [ 1.0, 1.0, 0.0, 1.0 ],
    [ 0.0, 1.0, 0.0, 1.0 ],
    [ 0.0, 0.0, 1.0, 1.0 ],
    [ 1.0, 0.0, 1.0, 1.0 ],
    [ 0.0, 1.0, 1.0, 1.0 ],
    [ 0.0, 1.0, 1.0, 1.0 ],
    [ 0.0, 1.0, 1.0, 1.0 ]
];
function quad(a, b, c, d)
{
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

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );
        var ind=a;
        // for solid colored faces use
        if(a>8)
        {
          ind=a-8;
        }
        colors.push(vertexColors[ind]);

    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    requestAnimFrame( render );
}
