export const FRAGMENT_SHADER_TEXT = [
  'precision mediump float;',
  '',
  'varying vec3 fragColor;',
  'void main()',
  '{',
  '  gl_FragColor = vec4(fragColor, 1.0);',
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
