export const clear = (gl: WebGLRenderingContextStrict) => {
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
}