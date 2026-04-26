import { useRef, useEffect } from 'react'
import * as THREE from 'three'

const VERTEX_SHADER = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const FRAGMENT_SHADER = /* glsl */`
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uAspect;
  uniform vec4 uRipples[8];
  uniform vec2 uImageScale;

  // Tunable parameters
  uniform float uDisplacementScale;   // ripple wave amplitude       (≈ displacementScale)
  uniform float uAmbientScale;        // idle ambient wave amplitude
  uniform float uChromaticAberration; // RGB channel offset strength  (≈ metalness)
  uniform float uRippleDecay;         // ripple fade speed            (≈ roughness / decay)
  uniform float uWaveFrontSharpness;  // gaussian width of wave front (≈ roughness / sharpness)

  varying vec2 vUv;

  vec2 rippleDisp(vec2 uv, vec4 rpl) {
    float elapsed = uTime - rpl.z;
    if (elapsed < 0.0 || elapsed > 2.8) return vec2(0.0);
    vec2 diff = uv - rpl.xy;
    diff.x *= uAspect;
    float dist = length(diff) + 0.0001;
    float waveRadius = elapsed * 0.38;
    float front = exp(-pow(dist - waveRadius, 2.0) * uWaveFrontSharpness);
    float fade  = exp(-elapsed * uRippleDecay) * rpl.w;
    float wave  = sin(dist * 26.0 - elapsed * 8.5) * front * fade * uDisplacementScale;
    return (diff / dist) * wave;
  }

  void main() {
    vec2 uv = vUv;

    vec2 disp = vec2(
      sin(uv.y * 3.14159 + uTime * 0.36) * uAmbientScale
        + sin(uv.x * 2.1  + uTime * 0.22) * uAmbientScale * 0.5,
      cos(uv.x * 4.21   + uTime * 0.29) * uAmbientScale
        + cos(uv.y * 2.7  + uTime * 0.19) * uAmbientScale * 0.5
    );

    for (int i = 0; i < 8; i++) {
      disp += rippleDisp(uv, uRipples[i]);
    }

    vec2 texUv = (uv - 0.5) * uImageScale + 0.5;

    float dispLen = length(disp);
    vec2 ca = normalize(disp + 0.0001) * dispLen * uChromaticAberration;

    float r = texture2D(uTexture, texUv + disp + ca).r;
    float g = texture2D(uTexture, texUv + disp).g;
    float b = texture2D(uTexture, texUv + disp - ca).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`

const MAX_RIPPLES = 8
const RIPPLE_THROTTLE_MS = 75

export default function LiquidBackground({
  imageSrc            = '/uploads/bg_image.jpg',
  className           = '',
  displacementScale   = 0.024,  // ripple wave amplitude
  ambientScale        = 0.003,  // idle ambient wave amplitude
  chromaticAberration = 0.4,    // RGB channel split strength
  rippleDecay         = 1.5,    // how fast ripples fade (higher = faster)
  waveFrontSharpness  = 55.0,   // gaussian width of wave front (higher = narrower)
}) {
  const canvasRef  = useRef(null)
  const materialRef = useRef(null)

  // Hot-update tunable uniforms without recreating the scene
  useEffect(() => {
    const mat = materialRef.current
    if (!mat) return
    mat.uniforms.uDisplacementScale.value   = displacementScale
    mat.uniforms.uAmbientScale.value        = ambientScale
    mat.uniforms.uChromaticAberration.value = chromaticAberration
    mat.uniforms.uRippleDecay.value         = rippleDecay
    mat.uniforms.uWaveFrontSharpness.value  = waveFrontSharpness
  }, [displacementScale, ambientScale, chromaticAberration, rippleDecay, waveFrontSharpness])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene    = new THREE.Scene()
    const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const geometry = new THREE.PlaneGeometry(2, 2)

    const ripples = []
    let lastRippleTime = 0

    const rippleUniforms = Array.from({ length: MAX_RIPPLES }, () =>
      new THREE.Vector4(0, 0, -100, 0)
    )

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uTexture:            { value: null },
        uTime:               { value: 0 },
        uAspect:             { value: 1 },
        uImageScale:         { value: new THREE.Vector2(1, 1) },
        uRipples:            { value: rippleUniforms },
        uDisplacementScale:  { value: displacementScale },
        uAmbientScale:       { value: ambientScale },
        uChromaticAberration:{ value: chromaticAberration },
        uRippleDecay:        { value: rippleDecay },
        uWaveFrontSharpness: { value: waveFrontSharpness },
      },
    })
    materialRef.current = material

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const loader = new THREE.TextureLoader()
    loader.load(imageSrc, (tex) => {
      tex.wrapS = THREE.ClampToEdgeWrapping
      tex.wrapT = THREE.ClampToEdgeWrapping
      material.uniforms.uTexture.value = tex
      updateImageScale(tex)
    })

    let W = 0, H = 0

    function updateImageScale(tex) {
      if (!tex || !tex.image) return
      const imgAspect    = tex.image.naturalWidth / tex.image.naturalHeight
      const screenAspect = W / H
      if (screenAspect > imgAspect) {
        material.uniforms.uImageScale.value.set(1, imgAspect / screenAspect)
      } else {
        material.uniforms.uImageScale.value.set(screenAspect / imgAspect, 1)
      }
    }

    function resize() {
      const rect = canvas.parentElement?.getBoundingClientRect()
      W = rect ? rect.width  : window.innerWidth
      H = rect ? rect.height : window.innerHeight
      renderer.setSize(W, H, false)
      material.uniforms.uAspect.value = W / H
      if (material.uniforms.uTexture.value) updateImageScale(material.uniforms.uTexture.value)
    }
    resize()
    window.addEventListener('resize', resize)

    function addRipple(x, y) {
      const now = performance.now()
      if (now - lastRippleTime < RIPPLE_THROTTLE_MS) return
      lastRippleTime = now
      ripples.push({ x, y, startTime: material.uniforms.uTime.value, intensity: 1.0 })
      if (ripples.length > MAX_RIPPLES) ripples.shift()
    }

    function syncRippleUniforms() {
      for (let i = 0; i < MAX_RIPPLES; i++) {
        const r = ripples[i]
        r
          ? rippleUniforms[i].set(r.x, r.y, r.startTime, r.intensity)
          : rippleUniforms[i].set(0, 0, -100, 0)
      }
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect()
      addRipple(
        (e.clientX - rect.left) / rect.width,
        1.0 - (e.clientY - rect.top) / rect.height,
      )
    }
    window.addEventListener('mousemove', onMouseMove)

    function onTouchMove(e) {
      const touch = e.touches[0]
      const rect  = canvas.getBoundingClientRect()
      addRipple(
        (touch.clientX - rect.left) / rect.width,
        1.0 - (touch.clientY - rect.top) / rect.height,
      )
    }
    canvas.addEventListener('touchmove', onTouchMove, { passive: true })

    let visible = true
    const obs = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting },
      { threshold: 0 }
    )
    if (canvas.parentElement) obs.observe(canvas.parentElement)

    let raf
    const clock = new THREE.Clock()

    function frame() {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      material.uniforms.uTime.value = clock.getElapsedTime()
      syncRippleUniforms()
      renderer.render(scene, camera)
    }
    frame()

    return () => {
      materialRef.current = null
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('touchmove', onTouchMove)
      obs.disconnect()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [imageSrc])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}
