import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import BaseLayout from "../../layouts/BaseLayout/BaseLayout";
import GridLayout from "../../layouts/GridLayout/GridLayout";

import Work from "../../components/Work/Work";

import selfImg from "../../assets/media/0.jpg";
import works from "../../data/works.json";

export default function Landing() {
  const [milanTime, setMilanTime] = useState("");
  const [projects, setProjects] = useState([]);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  // Three.js refs
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const modelRef = useRef(null); // Changed from cubeRef to modelRef
  const cameraRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setProjects(works);
  }, []);

  // Three.js Scene Setup
  useEffect(() => {
    if (!mountRef.current) return;

    // Clear any existing content first
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // Get container dimensions FIRST
    const containerRect = mountRef.current.getBoundingClientRect();
    const containerWidth = mountRef.current.offsetWidth;
    const containerHeight = mountRef.current.offsetHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      containerWidth / containerHeight,
      0.1,
      1000
    );

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    mountRef.current.appendChild(renderer.domElement);

    // Load glTF model
    const loader = new GLTFLoader();
    loader.load(
      '/assets/models/mustache1.glTF', // Replace with your glTF file path
      (gltf) => {
        const model = gltf.scene;
        
        // Optional: Scale the model if needed
        model.scale.setScalar(1); // Adjust scale as needed
        
        // Optional: Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        // Optional: Adjust model material properties
        model.traverse((child) => {
          if (child.isMesh) {
            // Make materials slightly transparent if desired
            if (child.material) {
              child.material.transparent = true;
              child.material.opacity = 0.9;
            }
          }
        });
        
        scene.add(model);
        modelRef.current = model;
        setModelLoaded(true);
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading glTF model:', error);
        // Fallback: create a simple cube if model fails to load
        const geometry = new THREE.BoxGeometry(3, 3, 3);
        const material = new THREE.MeshLambertMaterial({ 
          color: 0x0000FF,
          transparent: true,
          opacity: 0.8 
        });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        modelRef.current = cube;
        setModelLoaded(true);
      }
    );

    // Add ambient light (increased for better visibility)
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);

    // Add multiple directional lights for better model visibility
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, -5, 5);
    scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight3.position.set(0, 0, -5);
    scene.add(directionalLight3);

    // Position camera further back for better view
    camera.position.z = 7;

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Mouse move handler for model rotation
    const handleMouseMove = (event) => {
      const rect = mountRef.current.getBoundingClientRect();
      
      if (event.clientX >= rect.left && event.clientX <= rect.right && 
          event.clientY >= rect.top && event.clientY <= rect.bottom) {
        mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      if (!modelRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
      const model = modelRef.current;
      
      // Calculate target rotation based on mouse position
      const targetRotationX = -mouseRef.current.y * Math.PI;
      const targetRotationY = mouseRef.current.x * Math.PI;
      
      // Calculate target position based on mouse position
      const targetPositionX = mouseRef.current.x * 3;
      const targetPositionY = mouseRef.current.y * 2;
      
      // Smooth interpolation for natural movement
      model.rotation.x += (targetRotationX - model.rotation.x) * 0.08;
      model.rotation.y += (targetRotationY - model.rotation.y) * 0.08;
      
      model.position.x += (targetPositionX - model.position.x) * 0.05;
      model.position.y += (targetPositionY - model.position.y) * 0.05;
      
      // Add subtle continuous rotation
      model.rotation.x += 0.001;
      model.rotation.y += 0.001;
      model.rotation.z += 0.0005;

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !mountRef.current) return;
      
      const containerWidth = mountRef.current.offsetWidth;
      const containerHeight = mountRef.current.offsetHeight;
      
      cameraRef.current.aspect = containerWidth / containerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerWidth, containerHeight);
      
      rendererRef.current.domElement.style.width = '100%';
      rendererRef.current.domElement.style.height = '100%';
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      if (mountRef.current) {
        while (mountRef.current.firstChild) {
          mountRef.current.removeChild(mountRef.current.firstChild);
        }
      }
      
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Rome",
        hour12: false,
      });
      setMilanTime(formatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BaseLayout>
      {/* Hero Section with Three.js Model */}
      <div className="relative">
        {/* Three.js Canvas Container */}
        <div 
          ref={mountRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-[1]"
          style={{ 
            mixBlendMode: 'normal',
          }}
        />
        
        <GridLayout className="relative z-10">
          <div className="col-span-3 flex items-center h-[90vh] font-serif text-7xl">
            Creative
          </div>
          <div className="col-span-3 flex items-center h-[90vh] font-serif text-7xl">
            Web
          </div>
          <div className="col-span-3 flex items-center h-[90vh] font-serif text-7xl">
            Front-End
          </div>
          <div className="col-span-3 flex items-center justify-end h-[90vh] font-serif text-7xl">
            Developer
          </div>
        </GridLayout>
      </div>
      
      <GridLayout>
        <div className="col-span-3 flex items-end pb-4">Milan, {milanTime}</div>
        <div className="col-span-3 col-start-7 h-[10vh] flex items-end text-lg pb-4">
          Currently working at{" "}
          <a className="ps-1" href="https://www.quantum-studio.it/">
            {" "}
            QUANTUM STUDIO
          </a>
        </div>
        <div className="col-span-3 h-[10vh] flex items-end justify-end text-lg pb-4 animate-blink">
          Scroll
        </div>
      </GridLayout>
      
      <GridLayout className="pt-8">
        <hr className="col-span-full border-t-2 border-black pb-8" />
        <div className="col-span-3 uppercase text-2xl">About</div>
        <div className="col-span-3 w-56 h-64 rounded overflow-hidden">
          <img src={selfImg} alt="Me" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-3 col-start-10 flex justify-end uppercase text-2xl underline">
          <Link to="/about">Read all</Link>
        </div>
        <div className="col-span-full text-7xl font-serif indent-[calc(100%/4)] mt-32 tracking-tight text-gray-900">
          I'm Giacomo, a creative developer based near Milan. My work spans
          between websites, UI/UX, branding, graphic design, prototyping,
          audiovisual and interactive installations. <br />
          <br />
          Moving between design and code, concept and execution. Design and code
          are only tools of expression — shaping digital experiences that are
          thoughtful, expressive, and alive.
        </div>
      </GridLayout>
      
      <GridLayout className="pt-64 pb-4">
        <div className="col-span-3 uppercase text-2xl">Works</div>
        <div className="col-span-3 col-start-10 flex justify-end uppercase text-2xl underline">
          <Link to="/about">See all</Link>
        </div>
      </GridLayout>
      
      <GridLayout className="gap-y-32">
        {projects.slice(0, 6).map((project, index) => (
          <Work key={index} project={project} index={index} />
        ))}
      </GridLayout>
    </BaseLayout>
  );
}