/* global THREE */ 
/*import * as THREE from 'three';
import React, { useEffect } from 'react';
import {Link} from 'react-router-dom';





const NotFound = () => {

    function main() {

            const canvas = document.querySelector('#peach');
            const renderer = new THREE.WebGLRenderer({canvas});

            const fov = 75;
            const aspect = 2;  // valeur par défaut du canevas
            const near = 0.1;
            const far = 100;
            const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            camera.position.z = 30;
            const scene = new THREE.Scene();
              scene.background = new THREE.Color('#5b0025');

            {
            const color = 0xf79203;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(-1, 2, 4);
            scene.add(light);
            }

              const radius = 17;
              const widthSegments = 40;
              const heightSegments = 30;

              const geometry= new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);

             // const loader = new THREE.TextureLoader();
               const material = new THREE.MeshStandardMaterial({
                 color: 0xdf4f15, roughness: 0.6, metalness: 0.1
                 });
          /*const material = new THREE.MeshBasicMaterial({

                 map: loader.load(texture),
                 });*/
/*               const peach = new THREE.Mesh(geometry, material);


                 scene.add(peach);


                function resizeRendererToDisplaySize(renderer) {
                     const canvas = renderer.domElement;
                     const width = canvas.clientWidth;
                     const height = canvas.clientHeight;
                     const needResize = canvas.width !== width || canvas.height !== height;
                         if (needResize) {
                           renderer.setSize(width, height, false);
                         }
                         return needResize;
              }
                function render(time) {
                    time *= 0.001;  // convert time to seconds
                    if (resizeRendererToDisplaySize(renderer)) {
                         const canvas = renderer.domElement;
                         const pixelRatio = window.devicePixelRatio;
                         const width  = canvas.clientWidth  * pixelRatio | 0;
                         const height = canvas.clientHeight * pixelRatio | 0;
                         camera.aspect = canvas.clientWidth / canvas.clientHeight;
                         camera.updateProjectionMatrix();
                    }


                    peach.rotation.x = time;
                    peach.rotation.y = time;

                    renderer.render(scene, camera);

                    requestAnimationFrame(render);
                  }
            requestAnimationFrame(render);

}
    useEffect(() => {
      main();
    }, []);

    return (
        <div className="ntf">
        <Link to="/"><p>Accueil</p> </Link> 
        <h1>   "404" </h1>
       
         <canvas id="peach"> </canvas>
        </div>
    )
}

export default NotFound;*/




import './index.css';
import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '../node_modules/three/examples/jsm/loaders/DRACOLoader.js';
import firefliesVertexShader from './shaders/fireflies/vertex.js';
import firefliesFragmentShader from './shaders/fireflies/fragment.js';
import alcoolVertexShader from './shaders/alcool/vertex.js';
import alcoolFragmentShader from './shaders/alcool/fragment.js';




     
/**
 *   THREE JS
 */


 /**
  * Base
  */
 
 // Canvas
 const canvas = document.getElementsByClassName('webgl')[0];//document.querySelector('canvas.webgl')
if (canvas){ 
 // Scene
 const scene = new THREE.Scene()
 
 /**
  * Loaders
  */
 // Texture loader
 const textureLoader = new THREE.TextureLoader()
 
 // Draco loader
 const dracoLoader = new DRACOLoader()
 dracoLoader.setDecoderPath('draco/')
 
 // GLTF loader
 const gltfLoader = new GLTFLoader()
 gltfLoader.setDRACOLoader(dracoLoader)
 
 /**
  * Textures
  */
  const bakedTexture = textureLoader.load('texture_cocktail.jpg')
  bakedTexture.flipY = false
 
 /**
  * Materials
  */
 // Baked material
 const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture /* to backside be visible, side: THREE.DoubleSide*/ })
 bakedTexture.encoding = THREE.sRGBEncoding
 
 const alcoolGeometry = new THREE.PlaneGeometry(50, 50, 52, 212) 
 // Colors
 
 const alcoolMaterial = new THREE.ShaderMaterial({
     vertexShader: alcoolVertexShader(),
     fragmentShader: alcoolFragmentShader(),
     uniforms:
     {
         uTime: { value: 0 },
         
         uBigWavesElevation: { value: 0.277 },
         uBigWavesFrequency: { value: new THREE.Vector2(0, 0.183) },
         uBigWavesSpeed: { value: 0.826 },
 
         uSmallWavesElevation: { value: 0.135 },
         uSmallWavesFrequency: { value: 2.96 },
         uSmallWavesSpeed: { value: 0.83 },
         uSmallIterations: { value: 3 },
 
         uDepthColor: { value: new THREE.Color('#009bdc') },
         uSurfaceColor: { value: new THREE.Color('#5cb9f7') },
         uColorOffset: { value: 0.08 },
         uColorMultiplier: { value: 5 }
     }
 })

 const alcool = new THREE.Mesh(alcoolGeometry, alcoolMaterial)
 alcool.rotation.x = - Math.PI * 0.5
 //alcool.position.z = -26.5
 alcool.position.y = -0.5
 scene.add(alcool)
 /**
  * Model
  */


 gltfLoader.load('cocktail_scene_allin.glb', (gltf) => {
         /**
           // traverse the whole scene if not merge in one mesh
                 gltf.scene.traverse((child) =>
                 {
                     child.material = bakedMaterial
                 })
 
          
          */
         
         scene.add(gltf.scene)
         const bakedMesh = gltf.scene.children.find((child) => child.name === 'Plane005') //name of mesh in collection
    
         bakedMesh.material = bakedMaterial 
         
     }
     
 )
 
 /**
  * Fireflies
  */
 
 // Geometry
 
 const firefliesGeometry = new THREE.BufferGeometry()
 const firefliesCount = 30
 const positionArray = new Float32Array(firefliesCount * 3) //x,y,z
 const scaleArray = new Float32Array(firefliesCount)
 
 for(let i = 0; i < firefliesCount; i++)
 {
     positionArray[i * 3 + 0] = (Math.random() -0.5 ) * 4 //x
     positionArray[i * 3 + 1] = Math.random() * 4 //y high
     positionArray[i * 3 + 2] = (Math.random() -0.5) * 4 //z depth
 
     scaleArray[i] = Math.random()
 }
 
 firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))// how many values for a vertex
 firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))
 // Material
 const firefliesMaterial = new THREE.ShaderMaterial({
     uniforms:
     {
         uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) } ,//to have same size according to space use ratio
         uSize: { value: 100 },
         uTime: { value: 0 },
     },
     vertexShader: firefliesVertexShader(),
     fragmentShader: firefliesFragmentShader(),
     transparent: true,
     blending: THREE.AdditiveBlending,
     depthWrite: false, //save depthbufffer that behind a particule exist to avoid this late to be erased
 
  })

 // Points
 const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
 scene.add(fireflies)
 
 /**
  * Sizes
  */  
 
 const sizes = {
     width: window.innerWidth - 100,
     height: window.innerHeight / 2

   
 }
 
 window.addEventListener('resize', () =>
 {
     // Update sizes
     sizes.width = window.innerWidth - 100
     sizes.height = window.innerHeight / 2
     // Update camera
     camera.aspect = sizes.width / sizes.height
     camera.updateProjectionMatrix()
 
     // Update renderer
     renderer.setSize(sizes.width, sizes.height)
     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
 
     // Update fireflies
     firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2) // to be always good according to  device ratio
 })
 
 /**
  * Camera
  */
 // Base camera
 const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 30)
 camera.position.x = 0
 camera.position.y = 5
 camera.position.z = 18
 scene.add(camera)
 
 // Controls
 const controls = new OrbitControls(camera, canvas)
 controls.enableDamping = true
 //
 /**
  * Renderer
  */
 const renderer = new THREE.WebGLRenderer({
   canvas,
     antialias: true
 })
 renderer.setSize(sizes.width, sizes.height)
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
 renderer.outputEncoding = THREE.sRGBEncoding
 
 // Clear color
 renderer.setClearColor('#74c8f7')
 
 
 /**
  * Animate
  */
 const clock = new THREE.Clock()
 
 const tick = () =>
 {
     const elapsedTime = clock.getElapsedTime()
 
     // Update materials
     firefliesMaterial.uniforms.uTime.value = elapsedTime
 
     alcoolMaterial.uniforms.uTime.value = elapsedTime
 
     // Update controls
     controls.update()
 
     // Render
     renderer.render(scene, camera)
 
     // Call tick again on the next frame
     window.requestAnimationFrame(tick)
 }
 
 tick()
}

console.log("hey");
  