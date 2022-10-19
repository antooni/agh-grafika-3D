import * as GLM from 'gl-matrix'

export const createView = () => {
  const view = GLM.mat4.create()
  const cam_pos = GLM.vec3.fromValues(0, 0, 3)
  const cam_front = GLM.vec3.fromValues(0, 0, -1)
  const cam_up = GLM.vec3.fromValues(0, 1, 0)
  const cam_rot = 0.0
  GLM.mat4.lookAt(view, cam_pos, cam_front, cam_up)
  return view
}

export const setupView = (
  gl: WebGLRenderingContextStrict,
  program: WebGLProgram,
  view: GLM.mat4,
) => {
  const uniformView = gl.getUniformLocation(program, 'view')
  gl.uniformMatrix4fv(uniformView, false, view)
}
