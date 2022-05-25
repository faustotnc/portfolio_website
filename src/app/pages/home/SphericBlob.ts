import * as THREE from "three";

const noise = `
  // GLSL textureless classic 3D noise "cnoise",
  // with an RSL-style periodic variant "pnoise".
  // Author:  Stefan Gustavson (stefan.gustavson@liu.se)
  // Version: 2011-10-11
  //
  // Many thanks to Ian McEwan of Ashima Arts for the
  // ideas for permutation and gradient selection.
  //
  // Copyright (c) 2011 Stefan Gustavson. All rights reserved.
  // Distributed under the MIT license. See LICENSE file.
  // https://github.com/ashima/webgl-noise
  //

  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
  }

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
  }

  // Classic Perlin noise, periodic variant
  float pnoise(vec3 P, vec3 rep) {
    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }
`;

const rotation = `
  mat3 rotation3dY(float angle) {
    float s = sin(angle);
    float c = cos(angle);

    return mat3(
      c, 0.0, -s,
      0.0, 1.0, 0.0,
      s, 0.0, c
    );
  }

  vec3 rotateY(vec3 v, float angle) {
    return rotation3dY(angle) * v;
  }
`;

const vertexShader = `
  varying vec2 vUv;
  varying float vDistort;

  uniform float uTime;
  uniform float uSpeed;
  uniform float uNoiseDensity;
  uniform float uNoiseStrength;
  uniform float uFrequency;
  uniform float uAmplitude;

  ${noise}

  ${rotation}

  void main() {
    vUv = uv;

    float t = uTime * uSpeed;
    float distortion = pnoise((normal + t) * uNoiseDensity, vec3(10.0)) * uNoiseStrength;

    vec3 pos = position + (normal * distortion);
    float angle = sin(uv.y * uFrequency + t) * uAmplitude;
    pos = rotateY(pos, angle);

    vDistort = distortion;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vDistort;

  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColorOscillation;
  uniform vec3 uColorPhase;

  vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    float distort = vDistort * uIntensity;

    vec3 brightness = vec3(0.25, 0.25, 0.25);
    vec3 contrast = vec3(0.5, 0.5, 0.5);

    vec3 color = cosPalette(0.6 + distort, brightness, contrast, uColorOscillation, uColorPhase);

    gl_FragColor = vec4(color, 1);
  }
`;

export class SphericBlob {
   private HAS_MOUNTED = false;
   private _windowAnimation = -1;
   private SCENE = new THREE.Scene();
   private CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
   private RENDERER = new THREE.WebGLRenderer({ alpha: true, antialias: true });
   private MESH = new THREE.Mesh<THREE.IcosahedronBufferGeometry, THREE.ShaderMaterial>();

   private MouseX = 0;
   private MouseY = 0;

   private readonly SETTINGS = {
      speed: 0.075,
      density: 3,
      strength: 0.2,
      frequency: 1.1,
      amplitude: 7,
      intensity: 1.5,
   };

   constructor() {
      this.RENDERER.setPixelRatio(window.devicePixelRatio);
      this.RENDERER.setSize(window.innerWidth, window.innerHeight);
      const three_clock = new THREE.Clock();

      window.addEventListener("mousemove", (e) => {
         if (!("ontouchstart" in window) || navigator.maxTouchPoints <= 0) {
            this.MouseX = e.clientX;
            this.MouseY = e.clientY;
         }
      });

      this.addBlob();
      this.fitBlobToCanvas();

      // Renders the scene
      const animate = () => {
         this._windowAnimation = requestAnimationFrame(animate);

         if (this.HAS_MOUNTED) {
            const strengthDelta = this.SETTINGS.strength + this.MouseX / window.innerWidth / 3;
            this.MESH.rotation.x = -this.MouseY / window.innerHeight / 3;

            // Update uniforms
            this.MESH.material.uniforms["uTime"].value = three_clock.getElapsedTime();
            this.MESH.material.uniforms["uNoiseStrength"].value = strengthDelta;
         }

         this.RENDERER.render(this.SCENE, this.CAMERA);
      };

      animate();
   }

   public destroy() {
      window.cancelAnimationFrame(this._windowAnimation);
      this.SCENE.clear();
   }

   public mountOn(parent: HTMLElement) {
      parent.appendChild(this.RENDERER.domElement);
      this.HAS_MOUNTED = true;
   }

   public updateCanvasSize(width: number, height: number) {
      this.RENDERER.setSize(width, height);
      this.CAMERA.aspect = width / height;
      this.CAMERA.updateProjectionMatrix();

      this.MESH.rotation.x = 0;
      this.MESH.rotation.y = 0;
      this.fitBlobToCanvas();
      this.RENDERER.setPixelRatio(window.devicePixelRatio);
   }

   public fitBlobToCanvas() {
      const bbox = new THREE.Box3().setFromObject(this.MESH);
      const bboxSize = new THREE.Vector3();
      bbox.getSize(bboxSize);

      // const box = new THREE.BoxHelper(this.MESH, 0xffff00);
      // this.SCENE.add(box);

      const fov = this.CAMERA.fov * (Math.PI / 180);
      const fovh = 2 * Math.atan(Math.tan(fov / 2) * this.CAMERA.aspect);
      const dx = bboxSize.z / 2 + Math.abs(bboxSize.x / 2 / Math.tan(fovh / 2));
      const dy = bboxSize.z / 2 + Math.abs(bboxSize.y / 2 / Math.tan(fov / 2));
      const cameraZ = Math.max(dx, dy);

      // Multiplied by 0.8 to account for the position of the bounding
      // box's front plane along the z-axis.
      this.CAMERA.position.set(0, 0, cameraZ);

      // set the far plane of the camera so that it easily encompasses the whole object
      const minZ = bbox.min.z;
      const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

      this.CAMERA.far = cameraToFarEdge * 3;
      this.CAMERA.updateProjectionMatrix();
   }

   private addBlob() {
      const material = new THREE.ShaderMaterial({
         vertexShader,
         fragmentShader,
         uniforms: {
            uTime: { value: 0 },
            uSpeed: { value: this.SETTINGS.speed },
            uNoiseDensity: { value: this.SETTINGS.density },
            uNoiseStrength: { value: this.SETTINGS.strength },
            uFrequency: { value: this.SETTINGS.frequency },
            uAmplitude: { value: this.SETTINGS.amplitude },
            uIntensity: { value: this.SETTINGS.intensity },
            uColorOscillation: { value: new THREE.Vector3(1, 1, 1) },
            uColorPhase: { value: new THREE.Vector3(0, 0.15, 0.2) },
         },
         // wireframe: true,
      });

      // create a sphere and assign the material
      const geometry = new THREE.IcosahedronBufferGeometry(2, 96);
      this.MESH = new THREE.Mesh(geometry, material);
      this.SCENE.add(this.MESH);
   }
}
