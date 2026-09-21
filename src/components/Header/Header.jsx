import Logo from './Logo/Logo';
import Clock from './Clock';
import './Header.css';

const Header = () => {
    return (
        <div className='header-container'>
            <Logo />
            <Clock />
        </div>
    );
};

export default Header;
