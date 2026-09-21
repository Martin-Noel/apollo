import { Clone, useGLTF } from '@react-three/drei';
import PropTypes from 'prop-types';

const Sun = ({sun}) => {

const sunModel = useGLTF(sun.model3d);
let {meanRadius} = sun

meanRadius /= 100000000

  return (
        <Clone
            object={sunModel.scene}
            scale={meanRadius}
        />
  )
}

Sun.propTypes = {
    sun: PropTypes.shape({
        model3d: PropTypes.string.isRequired,
        meanRadius: PropTypes.number.isRequired,
    }).isRequired,
};

export default Sun