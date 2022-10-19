export const FRAGMENT_SHADER_TEXT = [
  '#version 300 es',
  '',
  'precision highp float;',
  '',
  'in vec3 out_color;',
  '',
  'out vec4 frag_color;',
  '',
  'void main()',
  '{',
  '  frag_color = vec4(out_color, 1.0);',
  '}',
].join('\n')

export const setupFragmentShader = (
  gl: WebGLRenderingContextStrict,
): WebGLShader => {
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fragmentShader, FRAGMENT_SHADER_TEXT)

  gl.compileShader(fragmentShader)
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(
      'ERROR compiling fragment shader!',
      gl.getShaderInfoLog(fragmentShader),
    )
    return
  }

  return fragmentShader
}
