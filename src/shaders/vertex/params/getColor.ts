export const getVertexColor = (
  gl: WebGLRenderingContextStrict,
  program: WebGLProgram,
) => {
  //   var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
  var colorAttribLocation = gl.getAttribLocation(program, 'vertColor')

  //   gl.vertexAttribPointer(
  //     positionAttribLocation, // Attribute location
  //     2, // Number of elements per attribute
  //     gl.FLOAT, // Type of elements
  //     // @ts-expect-error:
  //     gl.FALSE,
  //     5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
  //     0 // Offset from the beginning of a single vertex to this attribute
  //   );
  gl.vertexAttribPointer(
    colorAttribLocation, // Attribute location
    3, // Number of elements per attribute
    gl.FLOAT, // Type of elements
    // @ts-expect-error:
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    2 * Float32Array.BYTES_PER_ELEMENT, // Offset from the beginning of a single vertex to this attribute
  )

  //   gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation)
}
