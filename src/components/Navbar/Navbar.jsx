import { Suspense } from 'react';
import PropTypes from 'prop-types';
import NavbarItem from './NavbarItem/NavbarItem';
import './Navbar.css';

const Navbar = ({objects, handleSetObject, handleClicked}) => {

    return (
        <div className="navbar">
            <Suspense fallback={null}>
                {objects &&
                objects
                    .filter((object) => object.bodyType === 'Star' || object.bodyType === 'Planet')
                    .map((planet, index) => <NavbarItem
                                            key={planet.id}
                                            navPlanet={planet}
                                            index={index}
                                            handleSetObject={handleSetObject}
                                            handleClicked={handleClicked} />)}
            </Suspense>
        </div>
    );
};

Navbar.propTypes = {
    objects: PropTypes.arrayOf(PropTypes.object),
    handleSetObject: PropTypes.func.isRequired,
    handleClicked: PropTypes.func.isRequired,
};

export default Navbar;
