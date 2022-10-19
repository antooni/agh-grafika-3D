import * as GLM from 'gl-matrix'

export const createProj = (gl: WebGLRenderingContextStrict) => {
  const proj = GLM.mat4.create()
  GLM.mat4.perspective(
    proj,
    (60 * Math.PI) / 180,
    gl.canvas.clientWidth / gl.canvas.clientHeight,
    0.1,
    100.0,
  )
  return proj
}
