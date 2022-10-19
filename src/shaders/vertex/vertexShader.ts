export const VERTEX_SHADER_TEXT = [
  'precision mediump float;',
  '',
  'attribute vec2 vertPosition;',
  'attribute vec3 vertColor;',
  'varying vec3 fragColor;',
  '',
  'void main()',
  '{',
  '  fragColor = vertColor;',
  '  gl_Position = vec4(vertPosition, 0.0, 1.0);',
  '}',
].join('\n')

export const setupVertexShader = (
  gl: WebGLRenderingContextStrict,
): WebGLShader => {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vertexShader, VERTEX_SHADER_TEXT)

  gl.compileShader(vertexShader)
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(
      'ERROR compiling fragment shader!',
      gl.getShaderInfoLog(vertexShader),
    )
    return
  }

  return vertexShader
}
