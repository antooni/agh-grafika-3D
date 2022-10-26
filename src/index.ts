/// <reference path="../node_modules/webgl-strict-types/index.d.ts" />
import * as GLM from 'gl-matrix'

import { setupBuffer } from './setup/setupBuffer'
import { clear } from './helpers/clear'
import { setupProgram } from './setup/setupProgram'
import { setupGL } from './setup/setupGL'
import { createModel, setupModel } from './uniforms/model'
import { createProj, setupProj } from './uniforms/proj'
import { createView, setupView } from './uniforms/view'
import { KOSTKA } from './vertices/KOSTKA'
import { calcCounter } from './helpers/fps'
import { attachEventListeners } from './helpers/eventListeners'

const pressedKey: Record<string, boolean> = {}
attachEventListeners(pressedKey)

/* VARIABLES */
let yaw = -90 //obrót względem osi X
let pitch = 0 //obrót względem osi

let counter = 0
let startTime = 0
let elapsedTime = 0

let cameraPosition = GLM.vec3.fromValues(0, 0, 3)
let cameraFront = GLM.vec3.fromValues(0, 0, -1)
const cameraUp = GLM.vec3.fromValues(0, 1, 0)

/* SETUP */
const gl = setupGL(setupCameraMouse)
setupBuffer(gl, KOSTKA)
const program = setupProgram(gl)
const view = createView()
const proj = createProj(gl)
const model = createModel()

/* RUNTIME */
function draw() {
  clear(gl)

  const [newElapsed, newCounter] = calcCounter(counter, startTime)
  elapsedTime = newElapsed
  startTime = performance.now()
  counter = newCounter

  setupCamera()

  setupModel(gl, program, model)
  setupView(gl, program, view)
  setupProj(gl, program, proj)

  gl.drawArrays(gl.TRIANGLES, 0, 36)

  window.requestAnimationFrame(draw)
}
window.requestAnimationFrame(draw)

/* Camera functions */
// @ts-expect-error:
function setupCameraMouse (e) {
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
  GLM.vec3.normalize(cameraFront, front)
}

function setupCamera() {
  let cameraSpeed = 0.005 * elapsedTime
  let cameraFrontTmp = GLM.vec3.fromValues(1, 1, 1)
  if (pressedKey['38']) {
    //Up
    cameraPosition[0] += cameraSpeed * cameraFront[0]
    cameraPosition[1] += cameraSpeed * cameraFront[1]
    cameraPosition[2] += cameraSpeed * cameraFront[2]
  }
  if (pressedKey['40']) {
    //down
    cameraPosition[0] -= cameraSpeed * cameraFront[0]
    cameraPosition[1] -= cameraSpeed * cameraFront[1]
    cameraPosition[2] -= cameraSpeed * cameraFront[2]
  }
  if (pressedKey['37']) {
    //left
    let cameraPositionTmp = GLM.vec3.fromValues(1, 1, 1)
    let cross = GLM.vec3.fromValues(1, 1, 1)
    GLM.vec3.cross(cross, cameraFront, cameraUp)
    GLM.vec3.normalize(cameraPositionTmp, cross)
    cameraPosition[0] -= cameraPositionTmp[0] * cameraSpeed
    cameraPosition[1] -= cameraPositionTmp[1] * cameraSpeed
    cameraPosition[2] -= cameraPositionTmp[2] * cameraSpeed
  }

  if (pressedKey['39']) {
    //right
    let cameraPositionTmp = GLM.vec3.fromValues(1, 1, 1)
    let cross = GLM.vec3.fromValues(1, 1, 1)
    GLM.vec3.cross(cross, cameraFront, cameraUp)
    GLM.vec3.normalize(cameraPositionTmp, cross)
    cameraPosition[0] += cameraPositionTmp[0] * cameraSpeed
    cameraPosition[1] += cameraPositionTmp[1] * cameraSpeed
    cameraPosition[2] += cameraPositionTmp[2] * cameraSpeed
  }

  let uniView = gl.getUniformLocation(program, 'view')
  gl.uniformMatrix4fv(uniView, false, view)

  cameraFrontTmp[0] = cameraPosition[0] + cameraFront[0]
  cameraFrontTmp[1] = cameraPosition[1] + cameraFront[1]
  cameraFrontTmp[2] = cameraPosition[2] + cameraFront[2]
  GLM.mat4.lookAt(view, cameraPosition, cameraFrontTmp, cameraUp)
}
