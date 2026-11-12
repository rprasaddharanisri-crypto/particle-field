export const vertexShader = `
uniform float uTime;

varying vec3 vColor;

void main() {

  vColor = color;

  vec3 pos = position;

  pos.y +=
  sin(
    uTime +
    position.x * 4.0
  ) * 0.05;

pos.x +=
  cos(
    uTime * 0.7 +
    position.z * 3.0
  ) * 0.03;

pos.z +=
  sin(
    uTime * 0.5 +
    position.y * 3.0
  ) * 0.03;

  vec4 mvPosition =
    modelViewMatrix *
    vec4(pos, 1.0);

  gl_PointSize =
    max(
      2.0,
      8.0 * (20.0 / -mvPosition.z)
    );

  gl_Position =
    projectionMatrix *
    mvPosition;
}
`;
export const fragmentShader = `
varying vec3 vColor;

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
}
`;