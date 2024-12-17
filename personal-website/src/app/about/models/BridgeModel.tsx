import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Converts degrees to radians for THREE.js rotations.
 * This is essential for bridge engineering visualization as we often think in
 * degrees for structural angles, but THREE.js requires radians for calculations.
 */
const toRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

/**
 * Defines the possible values for random rotation speed using a union type.
 * This ensures type safety while providing enough variety for smooth animation.
 */
type RandomRange = 0.0075 | 0.0075 | 0.0075 | 0.1 | 0.15 | 0.2;

/**
 * Generates a random decimal for consistent rotation speed.
 * The speed remains constant during the session, changing only on page refresh,
 * which helps viewers focus on the structural details of the bridge.
 */
const getRandomDecimal = (): RandomRange => {
  const random = Math.round(Math.random() * 10) / 10;
  return random as RandomRange;
};

export const BridgeModel = () => {
  // Reference to the container div for our THREE.js canvas
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Store our random rotation speed - persists during component lifetime
  const rotationSpeedRef = useRef<number>(getRandomDecimal());

  useEffect(() => {
    // Early return if mount point doesn't exist
    if (!mountRef.current) return;

    // Store mount element reference for cleanup
    const mountElement = mountRef.current;

    // Set up THREE.js scene for bridge visualization
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(320, 320);
    mountElement.appendChild(renderer.domElement);

    // Set up lighting to enhance structural details
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    /**
     * Creates a detailed suspension bridge model with main components:
     * 1. Two main towers that support the structure
     * 2. A deck that carries the traffic load
     * 3. Suspension cables that transfer loads to the towers
     * 
     * The design follows basic principles of suspension bridge engineering:
     * - Towers bear compressive loads
     * - Cables carry tensile forces
     * - Deck distributes live loads across the structure
     */
    const createBridge = () => {
      const bridgeGroup = new THREE.Group();

      // Create main support towers with structural red coloring
      const towerGeometry = new THREE.BoxGeometry(0.5, 4, 0.5);
      const towerMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xcd0000,
        shininess: 60 // Adds a slight metallic appearance
      });
      
      // Position towers for optimal load distribution
      const tower1 = new THREE.Mesh(towerGeometry, towerMaterial);
      tower1.position.set(-2, 0, 0);
      
      const tower2 = new THREE.Mesh(towerGeometry, towerMaterial);
      tower2.position.set(2, 0, 0);

      // Create bridge deck with robust appearance
      const deckGeometry = new THREE.BoxGeometry(5, 0.2, 1);
      const deckMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x808080,
        shininess: 30 // Gives concrete-like appearance
      });
      const deck = new THREE.Mesh(deckGeometry, deckMaterial);
      deck.position.set(0, -1, 0);

      // Generate suspension cable curve using Catmull-Rom spline
      // This creates a natural-looking cable curve under tension
      const curvePoints = [];
      curvePoints.push(new THREE.Vector3(-2, 2, 0));  // Anchor at first tower
      curvePoints.push(new THREE.Vector3(0, 1, 0));   // Middle sag point
      curvePoints.push(new THREE.Vector3(2, 2, 0));   // Anchor at second tower

      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const cableGeometry = new THREE.TubeGeometry(
        curve,
        50,    // Segments - higher number for smoother curve
        0.05,  // Tube radius
        8,     // Radial segments for cable roundness
        false  // Closed path
      );
      const cableMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x000000,
        shininess: 90 // High shininess for steel cable appearance
      });
      const cable = new THREE.Mesh(cableGeometry, cableMaterial);

      // Assemble all structural elements
      bridgeGroup.add(tower1);
      bridgeGroup.add(tower2);
      bridgeGroup.add(deck);
      bridgeGroup.add(cable);

      return bridgeGroup;
    };

    // Create and add bridge to scene
    const bridge = createBridge();
    scene.add(bridge);

    // State for handling mouse interactions
    let isRotating = false;
    let previousMousePosition = {
      x: 0,
      y: 0
    };

    /**
     * Mouse event handlers for interactive rotation
     * These allow viewers to examine the bridge's structural details
     * from different angles
     */
    const startRotation = (event: MouseEvent) => {
      isRotating = true;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };

    const stopRotation = () => {
      isRotating = false;
    };

    const rotate = (event: MouseEvent) => {
      if (!isRotating) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      // Calculate rotation based on mouse movement
      const deltaRotationQuaternion = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(
          toRadians(deltaMove.y * 0.5),
          toRadians(deltaMove.x * 0.5),
          0,
          'XYZ'
        ));

      bridge.quaternion.multiplyQuaternions(deltaRotationQuaternion, bridge.quaternion);
      
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };

    // Add mouse event listeners
    mountElement.addEventListener('mousedown', startRotation);
    mountElement.addEventListener('mousemove', rotate);
    mountElement.addEventListener('mouseup', stopRotation);
    mountElement.addEventListener('mouseout', stopRotation);

    // Position camera to showcase bridge structure
    camera.position.z = 8;
    camera.position.y = 1;

    /**
     * Animation loop with consistent rotation speed
     * The gentle rotation helps viewers appreciate the
     * three-dimensional aspects of the bridge design
     */
    const animate = () => {
      requestAnimationFrame(animate);
      bridge.rotation.y += rotationSpeedRef.current;
      renderer.render(scene, camera);
    };

    animate();

    /**
     * Handle window resize events
     * Ensures the bridge model maintains proper proportions
     */
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      // Ensure mount element exists before cleanup
      if (mountElement) {
        // Remove event listeners
        mountElement.removeEventListener('mousedown', startRotation);
        mountElement.removeEventListener('mousemove', rotate);
        mountElement.removeEventListener('mouseup', stopRotation);
        mountElement.removeEventListener('mouseout', stopRotation);
      }

      // Remove window resize listener
      window.removeEventListener('resize', handleResize);

      // Dispose of THREE.js resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();

      // Safely remove renderer element
      if (mountElement && renderer.domElement.parentElement) {
        mountElement.removeChild(renderer.domElement);
      }
    };
  }, []); // Empty dependency array since we don't need to re-run the effect

  return <div ref={mountRef} className="w-80 h-80" />;
};

export default BridgeModel;