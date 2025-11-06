import{r as s,j as i}from"./index-9po6QOFo.js";import{L as y,H as x}from"./HeroSection-9EJZV-Z5.js";import{u as S}from"./useVideoScrub-DOOrYKp3.js";const A=`
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`,R=`
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
`,w=()=>{const c=s.useRef(null);return s.useEffect(()=>{const t=c.current;if(!t)return;const e=t.getContext("webgl",{alpha:!0});if(!e){console.error("WebGL is not supported.");return}const r=(a,b)=>{const n=e.createShader(a);return e.shaderSource(n,b),e.compileShader(n),e.getShaderParameter(n,e.COMPILE_STATUS)?n:(console.error(`An error occurred compiling the shaders: ${e.getShaderInfoLog(n)}`),e.deleteShader(n),null)},o=e.createProgram(),l=r(e.VERTEX_SHADER,A),f=r(e.FRAGMENT_SHADER,R);if(!l||!f)return;if(e.attachShader(o,l),e.attachShader(o,f),e.linkProgram(o),!e.getProgramParameter(o,e.LINK_STATUS)){console.error(`Unable to initialize the shader program: ${e.getProgramInfoLog(o)}`);return}e.useProgram(o);const _=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,_),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const u=e.getAttribLocation(o,"a_position");e.enableVertexAttribArray(u),e.vertexAttribPointer(u,2,e.FLOAT,!1,0,0);const v=e.getUniformLocation(o,"u_time"),g=e.getUniformLocation(o,"u_resolution"),p=e.getUniformLocation(o,"u_mouse"),h={x:window.innerWidth/2,y:window.innerHeight/2},d=a=>{h.x=a.clientX,h.y=a.clientY};window.addEventListener("mousemove",d);const m=a=>{(t.width!==t.clientWidth||t.height!==t.clientHeight)&&(t.width=t.clientWidth,t.height=t.clientHeight),e.viewport(0,0,e.canvas.width,e.canvas.height),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.uniform1f(v,a*.001),e.uniform2f(g,e.canvas.width,e.canvas.height),e.uniform2f(p,h.x,t.height-h.y),e.drawArrays(e.TRIANGLE_STRIP,0,4),requestAnimationFrame(m)};return requestAnimationFrame(m),()=>window.removeEventListener("mousemove",d)},[]),i.jsx("canvas",{ref:c,className:"absolute inset-0 w-full h-full z-10 pointer-events-none"})},P=()=>{const c=s.useRef(null),t=s.useRef(null),e=s.useRef(null);return S(c,t),s.useEffect(()=>{const r=t.current;if(!r)return;const o=l=>{const f=r.getBoundingClientRect(),_=l.clientX-f.left,u=l.clientY-f.top;r.style.setProperty("--x",`${_}px`),r.style.setProperty("--y",`${u}px`)};return r.addEventListener("mousemove",o),()=>{r.removeEventListener("mousemove",o)}},[]),i.jsxs(y,{children:[i.jsxs(x,{ref:t,videoRef:c,videoClassName:"opacity-50",children:[i.jsx("div",{ref:e,className:"absolute inset-0 pointer-events-none",style:{backgroundImage:"radial-gradient(circle at var(--x) var(--y), rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 25%)"}}),i.jsx(w,{})]}),i.jsx("section",{className:"h-[600px]"})]})};export{P as default};
