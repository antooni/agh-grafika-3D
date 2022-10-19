import { setupFragmentShader } from './shaders/fragment/fragmentShader'
import { getVertexColor } from './shaders/vertex/params/getColor'
import { getVertexPosition } from './shaders/vertex/params/getVertPosition'
import { setupVertexShader } from './shaders/vertex/vertexShader'

export const setupProgram = (gl: WebGLRenderingContextStrict): WebGLProgram => {
  //
  //create shaders
  //
  const vertexShader = setupVertexShader(gl)
  const fragmentShader = setupFragmentShader(gl)

  var program = gl.createProgram()
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
  getVertexPosition(gl, program)
  getVertexColor(gl, program)

  return program
}
