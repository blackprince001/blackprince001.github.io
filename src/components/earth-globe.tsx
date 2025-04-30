"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"

// Type for location data
export interface LocationData {
  latitude: number
  longitude: number
  city?: string
  country?: string
}

interface EarthGlobeProps {
  visitorLocation?: LocationData
}

const EarthGlobe = ({ visitorLocation }: EarthGlobeProps) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Convert lat/long to 3D coordinates on a sphere
  const latLongToVector3 = (lat: number, long: number, radius: number): THREE.Vector3 => {
    // Convert latitude and longitude from degrees to radians
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (long + 180) * (Math.PI / 180)

    // Calculate the position
    const x = -radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(phi) * Math.sin(theta)

    return new THREE.Vector3(x, y, z)
  }

  // Create a glowing marker at a specific location
  const createLocationMarker = (
    scene: THREE.Scene,
    location: LocationData,
    radius: number,
    color: THREE.Color = new THREE.Color(0x00ffff),
  ) => {
    // Create the marker (glowing dot)
    const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16)
    const markerMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
    })
    const marker = new THREE.Mesh(markerGeometry, markerMaterial)

    // Position the marker on the globe
    const locationPos = latLongToVector3(location.latitude, location.longitude, radius)
    marker.position.copy(locationPos)

    // Add a glow effect
    const glowGeometry = new THREE.SphereGeometry(0.15, 16, 16)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    marker.add(glow)

    // Create a beam from the center to the location
    const beamGeometry = new THREE.CylinderGeometry(0.02, 0.02, radius, 8)
    beamGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, radius / 2, 0))
    beamGeometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2))

    const beamMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
    })

    const beam = new THREE.Mesh(beamGeometry, beamMaterial)

    // Position and orient the beam to point from center to the location
    beam.position.set(0, 0, 0)
    beam.lookAt(locationPos)

    scene.add(marker)
    scene.add(beam)

    return { marker, beam }
  }

  useEffect(() => {
    // Early return if the ref is not attached
    if (!mountRef.current) return

    // Store the current value to use in the cleanup function
    const mountNode = mountRef.current

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountNode.appendChild(renderer.domElement)

    // Configure renderer and scene
    renderer.setClearColor(0x000000, 0)
    scene.background = null

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 3, 5)
    scene.add(directionalLight)

    // Earth sphere
    const earthRadius = 5
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64)

    // Load texture from the public folder
    const textureLoader = new THREE.TextureLoader()
    const earthTexture = textureLoader.load("/images/earth-dark.jpg", () => {
      setIsLoaded(true)
    })

    // Create materials
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpScale: 0.1,
      specular: new THREE.Color(0x333333),
      shininess: 5,
    })

    // Create mesh and add to scene
    const earth = new THREE.Mesh(earthGeometry, earthMaterial)
    scene.add(earth)

    // Add visitor location marker if available
    if (visitorLocation) {
      const visitorColor = new THREE.Color(0x00ffff) // Cyan for visitor
      createLocationMarker(scene, visitorLocation, earthRadius, visitorColor)
    }

    // Position camera
    camera.position.z = 15

    // Animation variables
    const rotationSpeed = 0.001
    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }
    const rotationTarget = new THREE.Vector2(0, 0)
    const currentRotation = new THREE.Vector2(0, 0)

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    window.addEventListener("resize", handleResize)

    // Mouse / touch interaction
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      isDragging = true
      const clientX = "touches" in event ? event.touches[0].clientX : (event as MouseEvent).clientX
      const clientY = "touches" in event ? event.touches[0].clientY : (event as MouseEvent).clientY
      previousMousePosition = { x: clientX, y: clientY }
    }

    const onPointerMove = (event: MouseEvent | TouchEvent) => {
      if (!isDragging) return

      const clientX = "touches" in event ? event.touches[0].clientX : (event as MouseEvent).clientX
      const clientY = "touches" in event ? event.touches[0].clientY : (event as MouseEvent).clientY

      const deltaMove = {
        x: clientX - previousMousePosition.x,
        y: clientY - previousMousePosition.y,
      }

      rotationTarget.y += deltaMove.x * 0.005
      rotationTarget.x += deltaMove.y * 0.005

      // Limit vertical rotation
      rotationTarget.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationTarget.x))

      previousMousePosition = { x: clientX, y: clientY }
    }

    const onPointerUp = () => {
      isDragging = false
    }

    // Add event listeners
    renderer.domElement.addEventListener("mousedown", onPointerDown as EventListener)
    renderer.domElement.addEventListener("mousemove", onPointerMove as EventListener)
    renderer.domElement.addEventListener("mouseup", onPointerUp)
    renderer.domElement.addEventListener("touchstart", onPointerDown as EventListener)
    renderer.domElement.addEventListener("touchmove", onPointerMove as EventListener)
    renderer.domElement.addEventListener("touchend", onPointerUp)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Smooth rotation
      if (!isDragging) {
        rotationTarget.y += rotationSpeed
      }

      // Smooth interpolation for rotation
      currentRotation.x += (rotationTarget.x - currentRotation.x) * 0.1
      currentRotation.y += (rotationTarget.y - currentRotation.y) * 0.1

      earth.rotation.x = currentRotation.x
      earth.rotation.y = currentRotation.y

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      renderer.domElement.removeEventListener("mousedown", onPointerDown as EventListener)
      renderer.domElement.removeEventListener("mousemove", onPointerMove as EventListener)
      renderer.domElement.removeEventListener("mouseup", onPointerUp)
      renderer.domElement.removeEventListener("touchstart", onPointerDown as EventListener)
      renderer.domElement.removeEventListener("touchmove", onPointerMove as EventListener)
      renderer.domElement.removeEventListener("touchend", onPointerUp)
      mountNode.removeChild(renderer.domElement)
    }
  }, [visitorLocation])

  return (
    <div ref={mountRef}>
      {!isLoaded && (
        <div>
          Loading Earth...
        </div>
      )}
    </div>
  )
}

export default EarthGlobe
