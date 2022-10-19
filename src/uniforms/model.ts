import * as GLM from 'gl-matrix'

export const createModel = () => {
  const model = GLM.mat4.create()
  const kat_obrotu = (-25 * Math.PI) / 180 // in radians
  GLM.mat4.rotate(model, model, kat_obrotu, [0, 0, 1])
  return model
}
