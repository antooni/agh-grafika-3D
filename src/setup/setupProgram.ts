import { setupFragmentShader } from '../shaders/fragment/fragmentShader'
import { aTexCoord } from '../shaders/vertex/params/aTexCoord'
import { color } from '../shaders/vertex/params/color'
import { position } from '../shaders/vertex/params/position'
import { setupVertexShader } from '../shaders/vertex/vertexShader'

export const setupProgram = (gl: WebGLRenderingContextStrict): WebGLProgram => {
  //
  //create shaders
  //
  const vertexShader = setupVertexShader(gl)
  const fragmentShader = setupFragmentShader(gl)

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('ERROR linking program!', gl.getProgramInfoLog(program))
    return
  }
  gl.validateProgram(program)
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error('ERROR validating program!', gl.getProgramInfoLog(program))
    return
  }

  //
  // set shader attributes
  //
  position(gl, program)
  color(gl, program)
  aTexCoord(gl, program)
  gl.uniform1i(gl.getUniformLocation(program, 'texture1'), 0)
  gl.uniform1i(gl.getUniformLocation(program, 'texture2'), 1)

  gl.useProgram(program)

  return program
}
