export const vertexShader = `

varying vec3 vColor;

void main() {

  vColor = color;

  vec4 mvPosition =
    modelViewMatrix *
    vec4(position, 1.0);

  gl_PointSize =
    4.0 *
    (300.0 / -mvPosition.z);

  gl_Position =
    projectionMatrix *
    mvPosition;
}`;

export const fragmentShader = `varying vec3 vColor;

void main() {

  vec2 uv =
    gl_PointCoord - vec2(0.5);

  float d = length(uv);

  if (d > 0.5)
    discard;

  float alpha =
    smoothstep(
      0.5,
      0.0,
      d
    );

  alpha *= alpha;

  gl_FragColor =
    vec4(
      vColor,
      alpha
    );
}`;