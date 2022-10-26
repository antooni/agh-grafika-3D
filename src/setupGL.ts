  // @ts-expect-error:

export const setupGL = (ustaw_kamere_mysz): WebGLRenderingContextStrict => {
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

  //*****************pointer lock object forking for cross browser**********************
  canvas.requestPointerLock =
    canvas.requestPointerLock || canvas.requestPointerLock
  document.exitPointerLock =
    document.exitPointerLock || document.exitPointerLock
  canvas.onclick = function () {
    canvas.requestPointerLock()
  }
  // Hook pointer lock state change events for different browsers
  document.addEventListener('pointerlockchange', lockChangeAlert, false)
  document.addEventListener('mozpointerlockchange', lockChangeAlert, false)
  function lockChangeAlert() {
    if (
      document.pointerLockElement === canvas ||
      document.pointerLockElement === canvas
    ) {
      console.log('The pointer lock status is now locked')
      document.addEventListener('mousemove', ustaw_kamere_mysz, false)
    } else {
      console.log('The pointer lock status is now unlocked')
      document.removeEventListener('mousemove', ustaw_kamere_mysz, false)
    }
  }
  //****************************************************************

  return gl
}
