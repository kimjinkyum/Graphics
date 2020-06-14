
var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }



    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height);

    // 배경색 바꾸는거
    gl.clearColor( 0.0, 0.0, 0.0, 0.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );


    //gl.bufferData( gl.ARRAY_BUFFER,flatten(vertex), gl.STATIC_DRAW );


    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );


    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var vColor=gl.getUniformLocation(program,"fColor");

    gl.clear( gl.COLOR_BUFFER_BIT);

    var a,b,c,d;
    var red,blue,green;
    for (var i=0;i<50;++i){
       a=Math.random()*2-1;
       b=Math.random()*2-1;
       c=Math.random()*2-1;
       d=Math.random()*2-1;

      var vv=
      [
        vec2(a,b),
        vec2(a,c),
        vec2(d,c),
        vec2(d,c),
        vec2(a,b),
        vec2(d,b)
      ];

      gl.bufferData(gl.ARRAY_BUFFER,flatten(vv), gl.STATIC_DRAW);
      gl.uniform4f(vColor, Math.random(),Math.random(),Math.random(),1);
      gl.drawArrays(gl.TRIANGLES,0,6);
}
};
