import React, { useRef, useEffect } from 'react';

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// A new, license-free fragment shader for an analog VHS glitch effect.
const fragmentShaderSource = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  // Randomness function
  float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    // Correct aspect ratio
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Mouse influence
    float mouse_dist = length(gl_FragCoord.xy - u_mouse);
    float mouse_influence = smoothstep(200.0, 0.0, mouse_dist);

    // --- VHS Effects ---

    // 1. Wavy horizontal distortion
    float wave_speed = u_time * 3.0;
    float wave_strength = 0.003 + mouse_influence * 0.005;
    vec2 distorted_uv = uv;
    distorted_uv.x += sin(distorted_uv.y * 25.0 + wave_speed) * wave_strength;

    // 2. Chromatic Aberration (Color bleeding)
    float aberration = 0.002 + mouse_influence * 0.004;
    float r_alpha = random(distorted_uv + vec2(aberration, 0.0)) * 0.1;
    float b_alpha = random(distorted_uv - vec2(aberration, 0.0)) * 0.1;

    // 3. Scan Lines
    float scanline_intensity = 0.05;
    float scanline = sin(distorted_uv.y * 700.0) * scanline_intensity;

    // 4. Glitch "Jump"
    float glitch_time = u_time * 0.5;
    if (fract(glitch_time) > 0.95) {
      if (uv.y > 0.4 && uv.y < 0.6) {
        distorted_uv.x += (random(vec2(glitch_time)) - 0.5) * 0.1;
      }
    }

    // --- Combine Effects ---
    vec3 final_color = vec3(0.0);
    float final_alpha = 0.0;

    // Add color from the aberration
    final_color.r += r_alpha;
    final_color.b += b_alpha;

    // Add the scanline effect
    final_alpha += scanline;

    // Add some general noise
    final_alpha += (random(distorted_uv) - 0.5) * 0.05;

    // Make the effect stronger with mouse influence
    final_alpha *= (1.0 + mouse_influence * 2.0);

    gl_FragColor = vec4(final_color + final_alpha, final_alpha);
  }
`;

const VhsShaderOverlay: React.FC = () => {
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
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
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

export default VhsShaderOverlay;