import{r as c,j as n}from"./index-9po6QOFo.js";import{L as x,H as b}from"./HeroSection-9EJZV-Z5.js";import{M as y}from"./MagicCursor-BmZzs40B.js";const S=`
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`,A=`
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
`,R=()=>{const a=c.useRef(null);return c.useEffect(()=>{const o=a.current;if(!o)return;const e=o.getContext("webgl",{alpha:!0});if(!e){console.error("WebGL is not supported.");return}const u=(r,w)=>{const i=e.createShader(r);return e.shaderSource(i,w),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS)?i:(console.error(`An error occurred compiling the shaders: ${e.getShaderInfoLog(i)}`),e.deleteShader(i),null)},t=e.createProgram(),l=u(e.VERTEX_SHADER,S),m=u(e.FRAGMENT_SHADER,A);if(!l||!m)return;if(e.attachShader(t,l),e.attachShader(t,m),e.linkProgram(t),!e.getProgramParameter(t,e.LINK_STATUS)){console.error(`Unable to initialize the shader program: ${e.getProgramInfoLog(t)}`);return}e.useProgram(t);const v=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,v),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const f=e.getAttribLocation(t,"a_position");e.enableVertexAttribArray(f),e.vertexAttribPointer(f,2,e.FLOAT,!1,0,0);const g=e.getUniformLocation(t,"u_time"),_=e.getUniformLocation(t,"u_resolution"),p=e.getUniformLocation(t,"u_mouse"),s={x:window.innerWidth/2,y:window.innerHeight/2},d=r=>{s.x=r.clientX,s.y=r.clientY};window.addEventListener("mousemove",d);const h=r=>{(o.width!==o.clientWidth||o.height!==o.clientHeight)&&(o.width=o.clientWidth,o.height=o.clientHeight),e.viewport(0,0,e.canvas.width,e.canvas.height),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.uniform1f(g,r*.001),e.uniform2f(_,e.canvas.width,e.canvas.height),e.uniform2f(p,s.x,o.height-s.y),e.drawArrays(e.TRIANGLE_STRIP,0,4),requestAnimationFrame(h)};return requestAnimationFrame(h),()=>window.removeEventListener("mousemove",d)},[]),n.jsx("canvas",{ref:a,className:"absolute inset-0 w-full h-full z-10 pointer-events-none"})},T=()=>{const a=c.useRef(null),o=c.useRef(null);return n.jsxs(x,{children:[n.jsx(y,{heroRef:a}),n.jsx(b,{ref:a,videoRef:o,className:"hide-cursor",videoClassName:"opacity-50",children:n.jsx(R,{})}),n.jsx("section",{className:"h-[600px]"})]})};export{T as default};
