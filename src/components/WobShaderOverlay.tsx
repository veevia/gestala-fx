import React, { useRef, useEffect } from 'react';

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// A new, license-free fragment shader for a "wobble" grid effect.
const fragmentShaderSource = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  // 2D Random (hash function)
  float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  // 2D Noise function
  float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix( mix( random( i + vec2(0.0,0.0) ),
                       random( i + vec2(1.0,0.0) ), u.x),
                  mix( random( i + vec2(0.0,1.0) ),
                       random( i + vec2(1.0,1.0) ), u.x), u.y);
  }

  // Fractional Brownian Motion for more complex noise
  float fbm(vec2 st) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 4; i++) { // Kept at 4 octaves for a smooth but detailed noise
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
      }
      return value;
  }

  void main() {
    // Correct aspect ratio
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.x *= u_resolution.x / u_resolution.y;

    vec2 mouse_uv = u_mouse / u_resolution.xy;
    mouse_uv.x *= u_resolution.x / u_resolution.y;
    
    // --- Re-introduce mouse interaction and distortion ---
    float mouseDistance = distance(mouse_uv, uv);
    float mouseInfluence = smoothstep(0.4, 0.0, mouseDistance);
    
    float time = u_time * 0.2;
    // The twist is now primarily driven by mouse proximity
    float twistStrength = mouseInfluence * 5.0;
    float angle = (length(uv - mouse_uv) * twistStrength) + time;
    float s = sin(angle);
    float c = cos(angle);
    vec2 distortedUV = mat2(c, -s, s, c) * (uv - mouse_uv) + mouse_uv;

    // Add a subtle background wobble
    distortedUV += fbm(uv * 2.0 + time) * 0.03;

    // --- Create the grid using the distorted coordinates ---
    vec2 grid = fract(distortedUV * 40.0); 
    // Calculate distance to the nearest grid line
    float d = min(grid.x, 1.0 - grid.x) + min(grid.y, 1.0 - grid.y);

    // --- Create the glow effect for the grid lines ---
    float core_glow = pow(0.01 / d, 2.0);
    float outer_glow = pow(0.05 / d, 1.5);

    // --- Final color and transparency ---
    vec3 dark_blue = vec3(0.1, 0.2, 0.5);
    vec3 white = vec3(1.0, 1.0, 1.0);
    
    // The color is a mix of blue and white, with white being strongest near the cursor
    vec3 color = mix(dark_blue, white, mouseInfluence * 1.5);

    // Combine the glows and apply them to the final color
    vec3 final_color = color * (outer_glow * 0.5 + core_glow * 0.5);
    // The alpha is determined by the glow, amplified by the mouse
    float alpha = (outer_glow * 0.2 + core_glow * 0.8) * (0.3 + mouseInfluence * 0.4);

    gl_FragColor = vec4(final_color, alpha);
  }
`;

const WobShaderOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true });
    if (!gl) {
      console.error("WebGL is not supported.");
      return;
    }

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      // Check for compilation errors
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(
          `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
        );
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const program = gl.createProgram()!;
    const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vs || !fs) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(program)}`);
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const timeUniform = gl.getUniformLocation(program, "u_time");
    const resolutionUniform = gl.getUniformLocation(program, "u_resolution");
    const mouseUniform = gl.getUniformLocation(program, "u_mouse");

    const mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const handleMouseMove = (e: MouseEvent) => { mousePos.x = e.clientX; mousePos.y = e.clientY; };
    window.addEventListener('mousemove', handleMouseMove);

    const render = (time: number) => {
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(timeUniform, time * 0.001);
      gl.uniform2f(resolutionUniform, gl.canvas.width, gl.canvas.height);
      gl.uniform2f(mouseUniform, mousePos.x, canvas.height - mousePos.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 pointer-events-none" />;
};

export default WobShaderOverlay;
