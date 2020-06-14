
var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    var vertex=
    [
      vec2(-1,1),
      vec2(1,1),
      vec2(-1,-1),

      vec2(1,1),
      vec2(-1,-1),
      vec2(1,-1)
    ];
    var colors=
    [
      vec4(0,0.4,1,1),
      vec4(1,0.8,0,1),
      vec4(1,1,1,1),

      vec4(0.2,1,0.4,1),
      vec4(0,1,1,1),
      vec4(1,0,1,1)

    ];
    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height);

    // 배경색 바꾸는거
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(vertex), gl.STATIC_DRAW );


    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );


    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    var colorbufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorbufferId );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(colors), gl.STATIC_DRAW );


    // Associate out shader variables with our data buffer
    var vColor = gl.getAttribLocation( program, "vColor" );


    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,6);


};
