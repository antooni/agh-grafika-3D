export const aTexCoord = (
  gl: WebGLRenderingContextStrict,
  program: WebGLProgram,
) => {
  const texCoord = gl.getAttribLocation(program, 'aTexCoord')
  gl.enableVertexAttribArray(texCoord)
  gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 8 * 4, 6 * 4)
}
