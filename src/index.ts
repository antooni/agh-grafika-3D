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
import { createTexture } from './textures/texture1'

/* VARIABLES */
let yaw = -90 //obrót względem osi X
let pitch = 0 //obrót względem osi

let counter = 0
let startTime = 0
let elapsedTime = 0

let cameraPosition = GLM.vec3.fromValues(0, 0, 3)
let cameraFront = GLM.vec3.fromValues(0, 0, -1)
const cameraUp = GLM.vec3.fromValues(0, 1, 0)

let points = 36

const hrefTexture1 =
  'https://cdn.pixabay.com/photo/2013/09/22/19/14/brick-wall-185081_960_720.jpg'
const hrefTexture2 =
  'https://unblast.com/wp-content/uploads/2020/04/Concrete-Texture-1.jpg'

/* SETUP */
const gl = setupGL(setupCameraMouse)
setupBuffer(gl, KOSTKA)
const program = setupProgram(gl)
const view = createView()
const proj = createProj(gl)
const model = createModel()

async function loadFile(gl: WebGLRenderingContextStrict, file: File) {
  console.log('Loaded file: ', file.name)
  let text: string = await file.text()
  text = text.replaceAll('/', ' ')
  text = text.replaceAll('\n', ' ')
  let arrayCopy = text.split(' ')
  const vertices: number[][] = [[]]
  let licz_vertices = 0
  const normals: number[][] = [[]]
  let licz_normals = 0
  const coords: number[][] = [[]]
  let licz_coords = 0
  const triangles: number[][] = []
  let licz_triangles = 0
  for (let i = 0; i < arrayCopy.length - 1; i++) {
    if (arrayCopy[i] == 'v') {
      vertices.push([])
      vertices[licz_vertices].push(parseFloat(arrayCopy[i + 1]))
      vertices[licz_vertices].push(parseFloat(arrayCopy[i + 2]))
      vertices[licz_vertices].push(parseFloat(arrayCopy[i + 3]))
      i += 3
      licz_vertices++
    }
    if (arrayCopy[i] == 'vn') {
      normals.push([])
      normals[licz_normals].push(parseFloat(arrayCopy[i + 1]))
      normals[licz_normals].push(parseFloat(arrayCopy[i + 2]))
      normals[licz_normals].push(parseFloat(arrayCopy[i + 3]))
      i += 3
      licz_normals++
    }
    if (arrayCopy[i] == 'vt') {
      coords.push([])
      coords[licz_coords].push(parseFloat(arrayCopy[i + 1]))
      coords[licz_coords].push(parseFloat(arrayCopy[i + 2]))
      i += 2
      licz_coords++
    }
    if (arrayCopy[i] == 'f') {
      triangles.push([])
      for (let j = 1; j <= 9; j++)
        triangles[licz_triangles].push(parseFloat(arrayCopy[i + j]))
      i += 9
      licz_triangles++
    }
  }
  let vert_array = []
  for (let i = 0; i < triangles.length; i++) {
    vert_array.push(vertices[triangles[i][0] - 1][0])
    vert_array.push(vertices[triangles[i][0] - 1][1])
    vert_array.push(vertices[triangles[i][0] - 1][2])
    vert_array.push(normals[triangles[i][2] - 1][0])
    vert_array.push(normals[triangles[i][2] - 1][1])
    vert_array.push(normals[triangles[i][2] - 1][2])
    vert_array.push(coords[triangles[i][1] - 1][0])
    vert_array.push(coords[triangles[i][1] - 1][1])
    vert_array.push(vertices[triangles[i][3] - 1][0])
    vert_array.push(vertices[triangles[i][3] - 1][1])
    vert_array.push(vertices[triangles[i][3] - 1][2])
    vert_array.push(normals[triangles[i][5] - 1][0])
    vert_array.push(normals[triangles[i][5] - 1][1])
    vert_array.push(normals[triangles[i][5] - 1][2])
    vert_array.push(coords[triangles[i][4] - 1][0])
    vert_array.push(coords[triangles[i][4] - 1][1])
    vert_array.push(vertices[triangles[i][6] - 1][0])
    vert_array.push(vertices[triangles[i][6] - 1][1])
    vert_array.push(vertices[triangles[i][6] - 1][2])
    vert_array.push(normals[triangles[i][8] - 1][0])
    vert_array.push(normals[triangles[i][8] - 1][1])
    vert_array.push(normals[triangles[i][8] - 1][2])
    vert_array.push(coords[triangles[i][7] - 1][0])
    vert_array.push(coords[triangles[i][7] - 1][1])
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vert_array), gl.STATIC_DRAW)

  return triangles.length * 3
}

const fileInput = document.getElementById('fff') as HTMLInputElement
fileInput.addEventListener('change', async (event) => {
  points = await loadFile(gl, (event.target as HTMLInputElement).files[0])
})

const pressedKey: Record<string, boolean> = {}
attachEventListeners(pressedKey)

const texture1 = createTexture(gl, hrefTexture1)
const texture2 = createTexture(gl, hrefTexture2)

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

  oneTexture()

  window.requestAnimationFrame(draw)
}
window.requestAnimationFrame(draw)

/* Camera functions */
function setupCameraMouse(e: MouseEvent) {
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
  let mode = 0
  let spacing = 0.1
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
  gl.drawArrays(gl.TRIANGLES, 0, points)
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
