export const VERTEX_SHADER_TEXT = [
  '#version 300 es',
  '',
  'precision highp float;',
  '',
  'in vec3 position;',
  'in vec3 color;',
  'in vec2 aTexCoord;',
  '',
  'out vec3 out_color;',
  'out vec2 TexCoord;',
  '',
  'uniform mat4 model;',
  'uniform mat4 view;',
  'uniform mat4 proj;',
  '',
  'void main()',
  '{',
  'TexCoord = aTexCoord;',
  '  gl_Position = proj * view * model * vec4(position, 1.0);',
  '  out_color = color;',
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
