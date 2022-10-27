export const position = (
  gl: WebGLRenderingContextStrict,
  program: WebGLProgram,
) => {
  const positionAttrib = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(positionAttrib)
  gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 8 * 4, 0)
}
