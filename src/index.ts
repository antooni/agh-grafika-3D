/// <reference path="../node_modules/webgl-strict-types/index.d.ts" />

import { bindBuffer } from "./buffer";
import { setupProgram } from "./program";
import { setupGL } from "./setupGL";
import { TRIANGLE_VERTICES } from "./vertices/TRIANGLE_VERTICES";

export const start = function () {
  const gl = setupGL();

  bindBuffer(gl, TRIANGLE_VERTICES);

  const program = setupProgram(gl);

  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

start();
