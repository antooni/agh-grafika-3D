export const FRAGMENT_SHADER_TEXT = [
  '#version 300 es',
  '',
  'precision highp float;',
  '',
  'in vec3 out_color;',
  'in vec2 TexCoord;',
  '',
  'out vec4 frag_color;',
  '',
  'uniform sampler2D texture1;',
  'uniform sampler2D texture2;',
  '',
  'void main()',
  '{',
  /* uncomment for one and two textures*/
  ' frag_color = texture(texture1, TexCoord);',
  /* uncomment for mixed mode */
  // 'frag_color = mix(texture(texture1, TexCoord), texture(texture2, TexCoord), 0.5);',
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
