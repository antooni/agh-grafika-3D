/// <reference path="../node_modules/webgl-strict-types/index.d.ts" />
import * as GLM from 'gl-matrix'

import { bindBuffer } from './buffer'
import { setupProgram } from './program'
import { setupGL } from './setupGL'
import { createModel } from './uniforms/model'
import { createProj } from './uniforms/proj'
import { createView } from './uniforms/view'
import { KOSTKA } from './vertices/KOSTKA'

var pressedKey = {}
window.onkeyup = function (e) {
  // @ts-expect-error:
  pressedKey[e.keyCode] = false
}
window.onkeydown = function (e) {
  // @ts-expect-error:
  pressedKey[e.keyCode] = true
}

const cam_speed = 0.02
var cam_pos = GLM.vec3.fromValues(0, 0, 3)
var cam_front = GLM.vec3.fromValues(0, 0, -1)
var cam_up = GLM.vec3.fromValues(0, 1, 0)
var cam_rot = 0.0

// export const start = function () {
const gl = setupGL()

const buffer = bindBuffer(gl, KOSTKA)

const program = setupProgram(gl)

const view = createView()
const proj = createProj(gl)
const model = createModel()

// draw(gl, program, buffer, model, view, proj)
// }

// start()

function draw() {
  // gl.clearColor(0, 0, 0, 1)
  // gl.clear(gl.COLOR_BUFFER_BIT)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  // @ts-expect-error:

  if (pressedKey['37']) {
    // Left
    console.log('left')

    cam_rot -= cam_speed
    cam_front[0] = Math.sin(cam_rot)
    cam_front[2] = -Math.cos(cam_rot)
    var cam_front_tmp = GLM.vec3.create()
    GLM.vec3.add(cam_front_tmp, cam_pos, cam_front)
    GLM.mat4.lookAt(view, cam_pos, cam_front_tmp, cam_up)
  }
  // @ts-expect-error:

  if (pressedKey['38']) {
    // Up
    GLM.vec3.scaleAndAdd(cam_pos, cam_pos, cam_front, cam_speed)
    var cam_front_tmp = GLM.vec3.create()
    GLM.vec3.add(cam_front_tmp, cam_pos, cam_front)
    GLM.mat4.lookAt(view, cam_pos, cam_front_tmp, cam_up)
  }
  // @ts-expect-error:

  if (pressedKey['39']) {
    // Right
    cam_rot += cam_speed
    cam_front[0] = Math.sin(cam_rot)
    cam_front[2] = -Math.cos(cam_rot)
    var cam_front_tmp = GLM.vec3.create()
    GLM.vec3.add(cam_front_tmp, cam_pos, cam_front)
    GLM.mat4.lookAt(view, cam_pos, cam_front_tmp, cam_up)
  }
  // @ts-expect-error:

  if (pressedKey['40']) {
    // Down
    GLM.vec3.scaleAndAdd(cam_pos, cam_pos, cam_front, -cam_speed)
    var cam_front_tmp = GLM.vec3.create()
    GLM.vec3.add(cam_front_tmp, cam_pos, cam_front)
    GLM.mat4.lookAt(view, cam_pos, cam_front_tmp, cam_up)
  }

  var unimodel = gl.getUniformLocation(program, 'model')
  gl.uniformMatrix4fv(unimodel, false, model)

  var uniview = gl.getUniformLocation(program, 'view')
  gl.uniformMatrix4fv(uniview, false, view)

  var uniproj = gl.getUniformLocation(program, 'proj')
  gl.uniformMatrix4fv(uniproj, false, proj)

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.drawArrays(gl.TRIANGLES, 0, 36)

  window.requestAnimationFrame(draw)
}

window.requestAnimationFrame(draw)
