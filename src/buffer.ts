export const bindBuffer = (
  gl: WebGLRenderingContextStrict,
  vertices: number[]
) => {
  var triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertices),
    gl.STATIC_DRAW
  );
};
