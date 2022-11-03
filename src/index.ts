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
const canvas = document.getElementById('game-surface') as HTMLDivElement
const gl = setupGL(setupCameraMouse)
setupBuffer(gl, KOSTKA)
const program = setupProgram(gl)
const view = createView()
const proj = createProj(gl)
const model = createModel()
gl.enable(gl.DEPTH_TEST)

//texture1 *****************************************************************************
const texture1 = gl.createTexture()
gl.bindTexture(gl.TEXTURE_2D, texture1)
const level = 0
const internalFormat = gl.RGBA
const width = 1
const height = 1
const border = 0
const srcFormat = gl.RGBA
const srcType = gl.UNSIGNED_BYTE
const pixel = new Uint8Array([0, 0, 255, 255])
gl.texImage2D(
  gl.TEXTURE_2D,
  level,
  internalFormat,
  width,
  height,
  border,
  srcFormat,
  srcType,
  pixel,
)
const image = new Image()
image.onload = function () {
  gl.bindTexture(gl.TEXTURE_2D, texture1)
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image)
  gl.generateMipmap(gl.TEXTURE_2D)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
}
image.crossOrigin = ''
image.src =
  'https://cdn.pixabay.com/photo/2013/09/22/19/14/brick-wall-185081_960_720.jpg'
//****************************************************************

//texture2 *****************************************************************************
const texture2 = gl.createTexture()
gl.bindTexture(gl.TEXTURE_2D, texture2)
{
  const level = 0
  const internalFormat = gl.RGBA
  const width = 1
  const height = 1
  const border = 0
  const srcFormat = gl.RGBA
  const srcType = gl.UNSIGNED_BYTE
  const pixel = new Uint8Array([0, 0, 255, 255])
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel,
  )
  const image = new Image()
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture2)
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image,
    )
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  }
  image.crossOrigin = ''
  image.src =
    'https://unblast.com/wp-content/uploads/2020/04/Concrete-Texture-1.jpg'
}
//****************************************************************

gl.uniform1i(gl.getUniformLocation(program, 'texture1'), 0)
gl.uniform1i(gl.getUniformLocation(program, 'texture2'), 1)

function StereoProjection(
  _left: number,
  _right: number,
  _bottom: number,
  _top: number,
  _near: number,
  _far: number,
  _zero_plane: number,
  _dist: number,
  _eye: number,
) {
  debugger
  // Perform the perspective projection for one eye's subfield.
  // The projection is in the direction of the negative z-axis.
  // _left=-6.0;
  // _right=6.0;
  // _bottom=-4.8;
  // _top=4.8;
  // [default: -6.0, 6.0, -4.8, 4.8]
  // left, right, bottom, top = the coordinate range, in the plane of zero parallax setting,
  // which will be displayed on the screen.
  // The ratio between (right-left) and (top-bottom) should equal the aspect
  // ratio of the display.
  // _near=6.0;
  // _far=-20.0;
  // [default: 6.0, -6.0]
  // near, far = the z-coordinate values of the clipping planes.
  // _zero_plane=0.0;
  // [default: 0.0]
  // zero_plane = the z-coordinate of the plane of zero parallax setting.
  // [default: 14.5]
  // _dist=10.5;
  // dist = the distance from the center of projection to the plane of zero parallax.
  // [default: -0.3]
  // _eye=-0.3;
  // eye = half the eye separation; positive for the right eye subfield,
  // negative for the left eye subfield.
  let _dx = _right - _left
  let _dy = _top - _bottom
  let _xmid = (_right + _left) / 2.0
  let _ymid = (_top + _bottom) / 2.0
  let _clip_near = _dist + _zero_plane - _near
  let _clip_far = _dist + _zero_plane - _far
  let _n_over_d = _clip_near / _dist
  let _topw = (_n_over_d * _dy) / 2.0
  let _bottomw = -_topw
  let _rightw = _n_over_d * (_dx / 2.0 - _eye)
  let _leftw = _n_over_d * (-_dx / 2.0 - _eye)
  const proj = GLM.mat4.create()
  GLM.mat4.frustum(
    proj,
    _leftw,
    _rightw,
    _bottomw,
    _topw,
    _clip_near,
    _clip_far,
  )
  GLM.mat4.translate(proj, proj, [-_xmid - _eye, -_ymid, 0])
  let uniProj = gl.getUniformLocation(program, 'proj')
  gl.uniformMatrix4fv(uniProj, false, proj)
}

let mode = 0
let spacing = 0.1

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

  /* remember to uncomment in fragmentShader!*/
  // oneTexture()
  // twoTextures()
  // mixedTexture()

  if (mode === 0) {
    // @ts-expect-error:
    gl.viewport(0, 0, canvas.width, canvas.height) //cały obszar ekranu
    oneTexture()
  }

  if (mode === 1) {
    // @ts-expect-error:
    gl.viewport(0, 0, canvas.width, canvas.height) //cały obszar ekranu

    StereoProjection(-6, 6, -4.8, 4.8, 12.99, -100, 0, 13, -spacing) //projekcja dla lewego oka
    gl.colorMask(true, false, false, false) //czerwony filtr
    oneTexture()

    gl.clear(gl.DEPTH_BUFFER_BIT)
    StereoProjection(-6, 6, -4.8, 4.8, 12.99, -100, 0, 13, spacing) //projekcja dla prawego oka
    gl.colorMask(false, false, true, false) //niebieski filtr
    oneTexture()

    gl.colorMask(true, true, true, true)
  }

  if (mode === 2) {
    // @ts-expect-error:
    gl.viewport(0, 0, canvas.width / 2, canvas.height) //cały obszar ekranu
    StereoProjection(-6, 6, -4.8, 4.8, 12.99, -100, 0, 13, -0.05) //projekcja dla lewego oka

    oneTexture()

    // @ts-expect-error:
    gl.viewport(canvas.width / 2, 0, canvas.width / 2, canvas.height) //cały obszar ekranu
    StereoProjection(-6, 6, -4.8, 4.8, 12.99, -100, 0, 13, 0.05) //projekcja dla lewego oka

    oneTexture()
  }

  window.requestAnimationFrame(draw)
}
window.requestAnimationFrame(draw)

/* Camera functions */
// @ts-expect-error:
function setupCameraMouse(e) {
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

  if (pressedKey['49']) {
    mode = 0
  }

  if (pressedKey['50']) {
    mode = 1
  }

  if (pressedKey['51']) {
    mode = 2
  }

  if (pressedKey['52']) {
    spacing += 0.01
  }

  if (pressedKey['53']) {
    spacing -= 0.01
  }

  let uniView = gl.getUniformLocation(program, 'view')
  gl.uniformMatrix4fv(uniView, false, view)

  cameraFrontTmp[0] = cameraPosition[0] + cameraFront[0]
  cameraFrontTmp[1] = cameraPosition[1] + cameraFront[1]
  cameraFrontTmp[2] = cameraPosition[2] + cameraFront[2]
  GLM.mat4.lookAt(view, cameraPosition, cameraFrontTmp, cameraUp)
}

const oneTexture = () => {
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture1)
  gl.drawArrays(gl.TRIANGLES, 0, 36)
}

const mixedTexture = () => {
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture1)
  gl.activeTexture(gl.TEXTURE1)
  gl.bindTexture(gl.TEXTURE_2D, texture2)
  gl.drawArrays(gl.TRIANGLES, 0, 36)
}

const twoTextures = () => {
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture2)
  gl.drawArrays(gl.TRIANGLES, 0, 12)
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture1)
  gl.drawArrays(gl.TRIANGLES, 12, 24)
}
