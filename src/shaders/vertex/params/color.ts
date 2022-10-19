export const color = (
  gl: WebGLRenderingContextStrict,
  program: WebGLProgram,
) => {
  const colorAttrib = gl.getAttribLocation(program, 'color')
  gl.enableVertexAttribArray(colorAttrib)
  gl.vertexAttribPointer(colorAttrib, 3, gl.FLOAT, false, 6 * 4, 3 * 4)
}
