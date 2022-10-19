export const setupGL = (): WebGLRenderingContextStrict => {
  console.log('This is working')

  var canvas = document.getElementById('game-surface')
  // @ts-expect-error:
  var gl = canvas.getContext('webgl') as any as WebGLRenderingContextStrict

  if (!gl) {
    console.log('WebGL not supported, falling back on experimental-webgl')
    // @ts-expect-error:
    gl = canvas.getContext('experimental-webgl')
  }

  if (!gl) {
    alert('Your browser does not support WebGL')
  }

  gl.clearColor(0.75, 0.85, 0.8, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  return gl
}
