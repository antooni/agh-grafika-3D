export const setupGL = (): WebGLRenderingContextStrict => {
  console.log('This is working')

  const canvas = document.getElementById('game-surface')
  // @ts-expect-error:
  const gl = canvas.getContext('webgl2') as any as WebGLRenderingContextStrict

  if (!gl) {
    console.log('WebGL not supported, falling back on experimental-webgl')
    // @ts-expect-error:
    gl = canvas.getContext('experimental-webgl')
  }

  if (!gl) {
    alert('Your browser does not support WebGL')
  }

  return gl
}
