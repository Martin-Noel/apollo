import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import PropTypes from 'prop-types';

const TurnPlanet = ({ model, index, handleSetObject, handleClicked }) => {
    const modelRef = useRef();
    const [hover, setHover] = useState(false);

    useFrame(() => {
        {hover ? modelRef.current.rotation.y += 0.02 : null;
        }
    });
  
  return (
    <>
            <primitive
                ref={modelRef} object={model.scene} scale={0.0015}
                onDoubleClick={()=>{
                    handleSetObject(index)
                    handleClicked()
                }}
                onPointerOver={() => {
                    setHover(true);
                 }}
    
                onPointerOut={() => {
                    setHover(false);
                }}

            />
    </>
  );
};

TurnPlanet.propTypes = {
    model: PropTypes.shape({
        scene: PropTypes.object,
    }).isRequired,
    index: PropTypes.number.isRequired,
    handleSetObject: PropTypes.func.isRequired,
    handleClicked: PropTypes.func.isRequired,
};

export default TurnPlanet;
