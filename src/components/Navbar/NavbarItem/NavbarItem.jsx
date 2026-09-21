import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import PropTypes from 'prop-types';
import TurnPlanet from '../TurnPlanet';
import './NavbarItem.css';

const NavbarItem = ({ navPlanet, index, handleSetObject, handleClicked }) => {

    const { model3d } = navPlanet;
    const model = useGLTF(model3d);
    const [name, setName] = useState();

    const handleMouseIn = () => {
        setName(!name);
    };

    const handleMouseOut = () => {
        setName(!name);
    };

    return (
        <div className="navbar-item">
            <div
                className="object"
                onMouseEnter={handleMouseIn}
                onMouseLeave={handleMouseOut}
            >
                <Canvas camera={{ fov: 40 }}>
                    <pointLight position={[-5, 0, 5]} intensity={1} />
                    <TurnPlanet model={model} index={index} handleSetObject={handleSetObject} handleClicked = {handleClicked} />
                </Canvas>
            </div>
            <div className={`planet${name ? '-name' : ''}`}>
                <p>{navPlanet.englishName}</p>
            </div>
        </div>
    );
};

NavbarItem.propTypes = {
    navPlanet: PropTypes.shape({
        model3d: PropTypes.string.isRequired,
        englishName: PropTypes.string,
    }).isRequired,
    index: PropTypes.number.isRequired,
    handleSetObject: PropTypes.func.isRequired,
    handleClicked: PropTypes.func.isRequired,
};

export default NavbarItem;
