/// <reference path="../node_modules/webgl-strict-types/index.d.ts" />
import * as GLM from 'gl-matrix'

import { bindBuffer } from './buffer'
import { clear } from './helpers/clear'
import { setupProgram } from './program'
import { setupGL } from './setupGL'
import { createModel, setupModel } from './uniforms/model'
import { createProj, setupProj } from './uniforms/proj'
import { createView, setupView } from './uniforms/view'
import { KOSTKA } from './vertices/KOSTKA'

const pressedKey: Record<string, boolean> = {}
window.onkeyup = function (e: KeyboardEvent) {
  pressedKey[e.keyCode] = false
}
window.onkeydown = function (e: KeyboardEvent) {
  pressedKey[e.keyCode] = true
}

const cam_speed = 0.02
const cam_pos = GLM.vec3.fromValues(0, 0, 3)
const cam_front = GLM.vec3.fromValues(0, 0, -1)
const cam_up = GLM.vec3.fromValues(0, 1, 0)
let cam_rot = 0.0

const gl = setupGL()
bindBuffer(gl, KOSTKA)
const program = setupProgram(gl)

const view = createView()
const proj = createProj(gl)
const model = createModel()

function draw() {
  clear(gl)

  if (pressedKey['37']) {
    // Left
    cam_rot -= cam_speed
    cam_front[0] = Math.sin(cam_rot)
    cam_front[2] = -Math.cos(cam_rot)
    var cam_front_tmp = GLM.vec3.create()
    GLM.vec3.add(cam_front_tmp, cam_pos, cam_front)
    GLM.mat4.lookAt(view, cam_pos, cam_front_tmp, cam_up)
  }
  if (pressedKey['38']) {
    // Up
    GLM.vec3.scaleAndAdd(cam_pos, cam_pos, cam_front, cam_speed)
    var cam_front_tmp = GLM.vec3.create()
    GLM.vec3.add(cam_front_tmp, cam_pos, cam_front)
    GLM.mat4.lookAt(view, cam_pos, cam_front_tmp, cam_up)
  }
  if (pressedKey['39']) {
    // Right
    cam_rot += cam_speed
    cam_front[0] = Math.sin(cam_rot)
    cam_front[2] = -Math.cos(cam_rot)
    var cam_front_tmp = GLM.vec3.create()
    GLM.vec3.add(cam_front_tmp, cam_pos, cam_front)
    GLM.mat4.lookAt(view, cam_pos, cam_front_tmp, cam_up)
  }
  if (pressedKey['40']) {
    // Down
    GLM.vec3.scaleAndAdd(cam_pos, cam_pos, cam_front, -cam_speed)
    var cam_front_tmp = GLM.vec3.create()
    GLM.vec3.add(cam_front_tmp, cam_pos, cam_front)
    GLM.mat4.lookAt(view, cam_pos, cam_front_tmp, cam_up)
  }

  setupModel(gl, program, model)
  setupView(gl, program, view)
  setupProj(gl, program, proj)

  gl.drawArrays(gl.TRIANGLES, 0, 36)

  window.requestAnimationFrame(draw)
}

window.requestAnimationFrame(draw)
