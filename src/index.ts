/// <reference path="../node_modules/webgl-strict-types/index.d.ts" />

import { bindBuffer } from "./buffer";
import { setupProgram } from "./program";
import { setupGL } from "./setupGL";
import { setupFragmentShader } from "./shaders/fragment/fragmentShader";
import { getVertexColor } from "./shaders/vertex/params/getColor";
import { getVertexPosition } from "./shaders/vertex/params/getVertPosition";
import { setupVertexShader } from "./shaders/vertex/vertexShader";
import { TRIANGLE_VERTICES } from "./vertices/TRIANGLE_VERTICES";

export const start = function () {
  const gl = setupGL();

  const vertexShader = setupVertexShader(gl);
  const fragmentShader = setupFragmentShader(gl);

  const program = setupProgram(gl, vertexShader, fragmentShader);

  bindBuffer(gl, TRIANGLE_VERTICES);

  getVertexPosition(gl, program);
  getVertexColor(gl, program);

  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

start();
