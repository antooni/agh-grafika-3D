export async function loadFile(gl: WebGLRenderingContextStrict, file: File) {
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
