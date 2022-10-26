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

let yaw = -90 //obrót względem osi X
let pitch = 0 //obrót względem osi
let licznik = 0
const fpsElem = document.querySelector('#fps')
let startTime = 0
let elapsedTime = 0
// @ts-expect-error:
const ustaw_kamere_mysz = (e) => {
  let xoffset = e.movementX
  let yoffset = e.movementY
  let sensitivity = 0.1
  let cameraSpeed = 0.05 * elapsedTime
  xoffset *= sensitivity
  yoffset *= sensitivity

  yaw += xoffset * cameraSpeed
  pitch -= yoffset * cameraSpeed

  if (pitch > 89.0) pitch = 89.0
  if (pitch < -89.0) pitch = -89.0

  let front = GLM.vec3.fromValues(1, 1, 1)

  front[0] =
    Math.cos(GLM.glMatrix.toRadian(yaw)) *
    Math.cos(GLM.glMatrix.toRadian(pitch))
  front[1] = Math.sin(GLM.glMatrix.toRadian(pitch))
  front[2] =
    Math.sin(GLM.glMatrix.toRadian(yaw)) *
    Math.cos(GLM.glMatrix.toRadian(pitch))
  GLM.vec3.normalize(cam_front, front)
}

const cam_speed = 0.02
let cam_pos = GLM.vec3.fromValues(0, 0, 3)
let cam_front = GLM.vec3.fromValues(0, 0, -1)
const cam_up = GLM.vec3.fromValues(0, 1, 0)
let cam_rot = 0.0

function ustaw_kamere() {
  let cameraSpeed = 0.005 * elapsedTime
  let cam_front_tmp = GLM.vec3.fromValues(1, 1, 1)
  if (pressedKey['38']) {
    //Up
    cam_pos[0] += cameraSpeed * cam_front[0]
    cam_pos[1] += cameraSpeed * cam_front[1]
    cam_pos[2] += cameraSpeed * cam_front[2]
  }
  if (pressedKey['40']) {
    //down
    cam_pos[0] -= cameraSpeed * cam_front[0]
    cam_pos[1] -= cameraSpeed * cam_front[1]
    cam_pos[2] -= cameraSpeed * cam_front[2]
  }
  if (pressedKey['37']) {
    //left
    let cam_pos_temp= GLM.vec3.fromValues(1, 1, 1)
    let cross= GLM.vec3.fromValues(1, 1, 1)
    GLM.vec3.cross(cross, cam_front, cam_up)
    GLM.vec3.normalize(cam_pos_temp, cross)
    cam_pos[0] -= cam_pos_temp[0] * cameraSpeed
    cam_pos[1] -= cam_pos_temp[1] * cameraSpeed
    cam_pos[2] -= cam_pos_temp[2] * cameraSpeed
  }

  if (pressedKey['39']) {
    //right
    let cam_pos_temp= GLM.vec3.fromValues(1, 1, 1)
    let cross= GLM.vec3.fromValues(1, 1, 1)
    GLM.vec3.cross(cross, cam_front, cam_up)
    GLM.vec3.normalize(cam_pos_temp, cross)
    cam_pos[0] += cam_pos_temp[0] * cameraSpeed
    cam_pos[1] += cam_pos_temp[1] * cameraSpeed
    cam_pos[2] += cam_pos_temp[2] * cameraSpeed
  }

  let uniView = gl.getUniformLocation(program, 'view')
  gl.uniformMatrix4fv(uniView, false, view)

  cam_front_tmp[0] = cam_pos[0] + cam_front[0]
  cam_front_tmp[1] = cam_pos[1] + cam_front[1]
  cam_front_tmp[2] = cam_pos[2] + cam_front[2]
  GLM.mat4.lookAt(view, cam_pos, cam_front_tmp, cam_up)
}

const gl = setupGL(ustaw_kamere_mysz)
bindBuffer(gl, KOSTKA)
const program = setupProgram(gl)

const view = createView()
const proj = createProj(gl)
const model = createModel()

function draw() {
  clear(gl)

  elapsedTime = performance.now() - startTime

  startTime = performance.now()

  licznik++
  let ffps = 1000 / elapsedTime

  if (licznik > ffps) {
    fpsElem.textContent = ffps.toFixed(1)

    licznik = 0
  }

  ustaw_kamere()

  setupModel(gl, program, model)
  setupView(gl, program, view)
  setupProj(gl, program, proj)

  gl.drawArrays(gl.TRIANGLES, 0, 36)

  window.requestAnimationFrame(draw)
}

window.requestAnimationFrame(draw)
