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

  // 2D Random
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
      for (int i = 0; i < 4; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
      }
      return value;
  }
  
  // Rotation function
  vec2 rotate(vec2 uv, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    mat2 rotMat = mat2(c, -s, s, c);
    return rotMat * (uv - 0.5) + 0.5;
  }

  // Color palette function to create smooth gradients
  vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.00, 0.33, 0.67);
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    // Correct aspect ratio
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.x *= u_resolution.x / u_resolution.y;

    vec2 mouse_uv = u_mouse / u_resolution.xy;
    mouse_uv.x *= u_resolution.x / u_resolution.y;
    
    // Mouse influence
    float mouseDistance = distance(mouse_uv, uv);
    float mouseInfluence = smoothstep(0.4, 0.0, mouseDistance);
    
    // Time-based wobble and twist
    float time = u_time * 0.2;
    float wobbleStrength = 0.05 + mouseInfluence * 0.1;
    float twistStrength = 5.0 + mouseInfluence * 10.0;
    
    // Create wobble effect using FBM noise
    float wobble = fbm(uv * 2.0 + time) * wobbleStrength;
    
    // Create twist effect by rotating coordinates
    float angle = (length(uv - 0.5) * twistStrength) + time;
    vec2 twistedUV = rotate(uv, angle);
    
    // Apply distortion to the UV coordinates
    vec2 distortedUV = twistedUV + vec2(wobble * cos(time), wobble * sin(time));
    
    // --- Create the smooth gradient glow effect ---
    // Reduced density grid
    vec2 grid = fract(distortedUV * 12.0); 
    // Calculate distance to the nearest grid line
    float d = min(grid.x, 1.0 - grid.x) + min(grid.y, 1.0 - grid.y);

    // --- Create a multi-layered glow for a more refined effect ---
    // A sharp, bright core for the line itself
    float core_glow = pow(0.01 / d, 2.5);
    // A softer, wider surrounding aura
    float outer_glow = pow(0.04 / d, 1.5);

    // --- Final color and transparency ---
    // Use the palette function for color, based on time and position
    vec3 color = palette(length(uv) + time * 0.5);
    
    // Combine the glows and apply them to the color and alpha
    vec3 final_color = color * (outer_glow * 0.5 + core_glow * 0.5);
    float alpha = (outer_glow * 0.1 + core_glow * 0.9) * (0.2 + mouseInfluence * 0.5);

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
