import React, { useRef, useEffect } from 'react';

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// A new, original, and license-free fragment shader for an analog VHS glitch effect.
const fragmentShaderSource = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  // A common public-domain hash function for creating noise.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // A palette function to generate vibrant, shifting colors.
  vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 0.7, 0.4);
    vec3 d = vec3(0.00, 0.15, 0.20);
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    // Correct aspect ratio
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Mouse interaction - center is (0.5, 0.5) in UV space
    vec2 mouse_uv = u_mouse / u_resolution.xy;

    // --- VHS Effect Calculations ---

    // 1. Horizontal Wave Distortion
    // This creates the characteristic wavy effect of old tapes.
    float wave_speed = u_time * 2.0;
    float wave_freq = 20.0;
    float wave_strength = 0.002;
    float mouseDistance = distance(uv, mouse_uv);
    vec2 distorted_uv = uv + mouseDistance * 0.1;
    distorted_uv.x += sin(distorted_uv.y * wave_freq + wave_speed) * wave_strength;

    // 2. Scan Lines
    // Simulates the horizontal lines of a CRT screen.
    float scanline_freq = 600.0;
    float scanline_strength = 0.05;
    float scanline_effect = sin(distorted_uv.y * scanline_freq) * scanline_strength;
    // Make the effect stronger with mouse influence
    scanline_effect *= (1.0 + (1.0-mouseDistance) * 0.5);

    // 3. Chromatic Aberration & Noise
    // Creates color bleeding and static by generating noise at offset coordinates.
    float aberration_amount = 0.003;
    float r_noise = hash(distorted_uv + vec2(aberration_amount, 0.0));
    float b_noise = hash(distorted_uv - vec2(aberration_amount, 0.0));
    float general_noise = hash(distorted_uv + u_time * 0.1) * 0.05;

    // 4. Intermittent Glitch Bar
    // A horizontal bar that randomly appears and scrolls.
    float glitch_bar_time = u_time * 0.3;
    float glitch_bar_speed = 10.0;
    float glitch_bar_height = 0.1;
    float glitch_bar_effect = 0.0;
    if (fract(glitch_bar_time) > 0.95) {
      float y = fract(glitch_bar_time) * 1.2 - 0.1;
      glitch_bar_effect = step(y, uv.y) - step(y + glitch_bar_height, uv.y);
      glitch_bar_effect *= (hash(vec2(floor(glitch_bar_time), 0.0)) - 0.5) * (0.2 + (1.0-mouseDistance) * 0.3); // Horizontal shift
      distorted_uv.x += (sin(glitch_bar_time*glitch_bar_speed) * 0.01);
    }
    distorted_uv.x += glitch_bar_effect;


    // --- Final Composition ---
    // Start with the base Red/Blue color bleed
    vec3 final_color = vec3(r_noise * 0.1, 0.0, b_noise * 0.1); 
    
    // Add the bright gradient color based on mouse distance and time
    float color_phase = (1.0 - mouseDistance) + u_time * 0.5;
    final_color += palette(color_phase) * (1.0 - mouseDistance) * 0.2; // Reduced brightness from 2.0 to 0.2

    float final_alpha = scanline_effect + general_noise + abs(glitch_bar_effect * 2.0);

    gl_FragColor = vec4(final_color, clamp(final_alpha, 0.0, 0.8));
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