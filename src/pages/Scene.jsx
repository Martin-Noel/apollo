import { useState, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Stars, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { SpinnerDotted } from 'spinners-react';
import { gsap } from 'gsap';
import axios from 'axios';
import Header from '../components/Header/Header';
import Card from '../components/Card/Card';
import Navbar from '../components/Navbar/Navbar';
import Sun from '../components/Objects/Sun';
import Planet from '../components/Objects/Planet';
import './Scene.css';

// Starting camera position for the arrival animation below - far outside the solar system.
const START_POSITION = [-2000, 2000, 2000];
// Camera position once the app has "arrived" - the scene's normal starting view.
const DEFAULT_POSITION = [-70, 70, 70];

const CameraIntro = () => {
    const { camera } = useThree();

    useEffect(() => {
        gsap.to(camera.position, {
            x: DEFAULT_POSITION[0],
            y: DEFAULT_POSITION[1],
            z: DEFAULT_POSITION[2],
            duration: 4,
            ease: 'power2.out',
        });
    }, [camera]);

    return null;
};

const Scene = () => {

    const [objects, setObjects] = useState([]);
    const [clicked,setClicked] = useState (false)
    const [isLoading, setIsLoading] = useState(true);
    const [moons, setMoons] = useState({});

    const [indexObject, setIndexObject] = useState('')

    const handleSetObject = (indexObject) => {
        setIndexObject( indexObject )
    }

    const handleClicked = ()=>{
      setClicked(!clicked)
    }
    const handleClose = ()=>{
      setClicked( false )
    }

    useEffect(() => {
        axios
          .get('/assets/bodies.json')
          .then((res) => {

            const moonsMap = {}
              
              res.data.bodies.forEach(element => {

                if (element.bodyType !== 'Moon' ) {
                    return
                }

               if(!moonsMap[element.aroundPlanet.planet]){
                moonsMap[element.aroundPlanet.planet]=[]
               }

               moonsMap[element.aroundPlanet.planet].push(element)
              });
            setObjects(res.data.bodies);
            setMoons(moonsMap);
            setIsLoading(false);
          });
      }, []);

    return (
        <div className='scene'>
          <Header />
        <div className="canvas">
          {isLoading ? (
            <div className='loading'>
            <span>Loading</span>
            <SpinnerDotted color="#424463" />
            </div>
            ) : (
              <>
              {clicked  ? (
                <div className="card-list">
          {objects &&
           objects
           .filter((object,index) => object.bodyType === 'Planet' && index === indexObject || object.bodyType === 'Star' && index === indexObject || object.bodyType === 'Moon' && index === indexObject )
           .map((planet) => {
             return (
           <Card key={planet.id} 
                 scenePlanet={planet}
                 handleClose={handleClose}
           />)
           })}
      </div>) : null }
            <Canvas
            shadows

            >
                <PerspectiveCamera makeDefault
                                    position={START_POSITION}
                                    fov={45}
                                    near={0.1}
                                    far={6000} />

                <CameraIntro />

                <OrbitControls />

              <Stars
                radius={500}
                depth={500}
                count={15000}
                factor={20}
                saturation={1}
                fade
                speed={0}
              />

              <pointLight 
                intensity={0.5}
                castShadow
                />

              <Suspense fallback={null}>
                {objects &&
                  objects
                    .map((astre, indexAstre) => {
                       if (astre.bodyType === 'Star') return <Sun key={astre.id} sun={astre}  />
                       if (astre.bodyType === 'Planet') return <Planet key={astre.id}
                                                                       planet={astre}
                                                                       moons={moons[astre.id]}
                                                                       indexObject={indexObject}
                                                                       indexAstre={indexAstre} />
                      return null;
                      })}
              </Suspense>
            </Canvas>
            </>
              )}
        </div>
        <Navbar objects={objects}
                handleSetObject={handleSetObject}
                handleClicked={handleClicked}/>
      </div>
    );
  };
  export default Scene;