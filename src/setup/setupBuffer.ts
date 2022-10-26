export const setupBuffer = (
  gl: WebGLRenderingContextStrict,
  vertices: number[],
) => {
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  return buffer
}
