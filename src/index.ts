/// <reference path="../node_modules/webgl-strict-types/index.d.ts" />

import { clearColor } from "./clearColor";
import { setupFragmentShader } from "./shaders/fragmentShader";
import { setupVertexShader } from "./shaders/vertexShader";
import { TRIANGLE_VERTICES } from "./vertices/TRIANGLE_VERTICES";

export const start = function () {
  console.log("This is working");

  var canvas = document.getElementById("game-surface");
  // @ts-expect-error:
  var gl = canvas.getContext("webgl") as any as WebGLRenderingContextStrict;

  if (!gl) {
    console.log("WebGL not supported, falling back on experimental-webgl");
    // @ts-expect-error:
    gl = canvas.getContext("experimental-webgl");
  }

  if (!gl) {
    alert("Your browser does not support WebGL");
  }

  clearColor(gl);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //
  // Create shaders
  //
  var vertexShader = setupVertexShader(gl);
  var fragmentShader = setupFragmentShader(gl);


  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ERROR linking program!", gl.getProgramInfoLog(program));
    return;
  }
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error("ERROR validating program!", gl.getProgramInfoLog(program));
    return;
  }

  //
  // Create buffer
  //

  var triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(TRIANGLE_VERTICES),
    gl.STATIC_DRAW
  );

  var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
  var colorAttribLocation = gl.getAttribLocation(program, "vertColor");
  gl.vertexAttribPointer(
    positionAttribLocation, // Attribute location
    2, // Number of elements per attribute
    gl.FLOAT, // Type of elements
    // @ts-expect-error:
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    0 // Offset from the beginning of a single vertex to this attribute
  );
  gl.vertexAttribPointer(
    colorAttribLocation, // Attribute location
    3, // Number of elements per attribute
    gl.FLOAT, // Type of elements
    // @ts-expect-error:
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
  );

  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);

  //
  // Main render loop
  //
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

start();
