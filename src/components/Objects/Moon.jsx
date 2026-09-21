import { useGLTF} from '@react-three/drei'
import { useRef } from 'react';
import PropTypes from 'prop-types';

const Moon = ({moon}) => {


    let { model3d, meanRadius } = moon; //let because we modify some value for scale

    const moonModel = useGLTF(model3d);
    const turnArroundPlanet = useRef();
    const moonRef = useRef();

    meanRadius /= 7000000;

    return (

    <>
        <mesh ref={turnArroundPlanet}>
            <primitive
                ref = { moonRef }
                object={ moonModel.scene }
                scale={ meanRadius }
                position={ [0,0,0] }
            />
        </mesh>
    </>

  )
}

Moon.propTypes = {
    moon: PropTypes.shape({
        model3d: PropTypes.string.isRequired,
        meanRadius: PropTypes.number.isRequired,
    }).isRequired,
};

export default Moon