
var gl;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height);
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );    

    //  Load shaders and initialize 
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );

	gl.useProgram( program );   

    // create a buffer on gpu and bind point    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId ); 

    // Associate out shader variables with our data buffer   	
	// attribute variable
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vPosition );

	// uniform variable
	var fColor = gl.getUniformLocation(program, "fColor");	

	// clear buffer bit
    gl.clear( gl.COLOR_BUFFER_BIT );

	/*-------------------------------------------------------------------------------------------------- */
	/* leaf+body---------------------------------------------------------------------------------------- */
	/*-------------------------------------------------------------------------------------------------- */

	// vertex
	var all = new Float32Array([
		0, 1, -0.5, 0.5, 0.5, 0.5,   // triangle 
		0, 0.5, -0.5, 0, 0.5, 0,     // triangle 
		0, 0, -0.5, -0.5, 0.5, -0.5,  // triangle 
		-0.15, -0.5, 0.15, -0.5, -0.15, -1, // triangle
		0.15, -0.5, -0.15, -1, 0.15, -1     // triangle
		]);

	gl.bufferData(gl.ARRAY_BUFFER, all, gl.STATIC_DRAW );	

	// leaf color
	gl.uniform4f(fColor,0,1,0,1); // color (R,G,B,A)
	//gl.uniform4fv(fColor,[0,1,0,1]); //You can also change the color using this line
    gl.drawArrays( gl.TRIANGLES, 0, 9 );

	// body color
	gl.uniform4f(fColor, 0.5, 0.25, 0, 1); // color (R,G,B,A)
	//gl.uniform4fv(fColor,[0.5, 0.25, 0, 1]); //You can also change the color using this line
    gl.drawArrays( gl.TRIANGLES, 9, 6 );

};


