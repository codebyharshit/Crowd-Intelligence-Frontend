import { Avatar, Col, Image, Menu, Row } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { UserButton, useSession } from '@clerk/clerk-react';
import { checkUserRole } from '../utils/userUtils';
import logo from '../assets/WissensWerk_Logo_No_Text1.svg';
import wissensMuenze from '../assets/WissensMuenze.svg';
import wissensStufe_Bronze from '../assets/WissenStufe_Bronze.svg';
import wissensStufe_Silber from '../assets/WissenStufe_Silber.svg';
import wissensStufe_Gold from '../assets/WissenStufe_Gold.svg';
import wissensStufe_Platinum from '../assets/WissenStufe_Platinum.svg';
import '../index.css';
import { useEffect } from 'react';
import { useUserContext } from '../components/provider/UserContext';

const Root = () => {
  const { userData, setUserData } = useUserContext();
  const { session, isLoaded } = useSession();
  const location = useLocation();

  useEffect(() => {
    if (isLoaded && session) {
      getUserPoints();
    }
  }, [isLoaded, session]);

    useEffect(() => {
      const handleScroll = () => {
        const navLogoContainer = document.querySelector(".nav-logo-container");
        if (window.scrollY > 0) {
          navLogoContainer.classList.add("scrolled");
        } else {
          navLogoContainer.classList.remove("scrolled");
        }
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

  const getUserPoints = async () => {
    try {
      const response = await fetch('https://crowd-intelligence-platform.onrender.com/getUserPointsAndLevel/?userId=' + session?.user.id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data);

      setUserData({
        userId: session!.user.id,
        userRole: checkUserRole(session),
        userLevel: data.level,
        userPoints: data.points,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getMenuItemClass = (path: string) =>
    `menu-link ${location.pathname === path ? 'menu-item' : ''}`;

  return (
      <Menu
        mode="horizontal"
        className="bg-header-blue w-full menu-container"
        selectedKeys={[location.pathname]}
      >
        <Link to={userData?.userId ? "/answer-forms" : "/home"} className="nav-logo-container">
          <Image src={logo} preview={false} />
        </Link>
        {(userData?.userRole === 'org:creator' || userData?.userRole === 'org:admin') && (
          <>
            <Menu.Item key="/create-forms" >
              <Link to="/create-forms" className={getMenuItemClass('/create-forms')}>
                Create Questionnaire
              </Link>
            </Menu.Item>
            <Menu.Item key="/my-questionnaires" >
              <Link to="/my-questionnaires" className={getMenuItemClass('/my-questionnaires')}>
                My Questionnaires
              </Link>
            </Menu.Item>
          </>
        )}
        <Menu.Item key="/about-page">
          <Link to="/about-page" className={getMenuItemClass('/about')}>
            About
          </Link>    
        </Menu.Item> 
        {userData?.userId && (
          <>
            <Menu.Item key="/gamification-profile">
              <Link to="/gamification-profile" className={getMenuItemClass('/gamification-profile')}>
                <Row>
                  <Col>
                    <div>{userData.userPoints}</div>
                  </Col>
                  <Col>
                    <Avatar src={wissensMuenze} className='ml-2'/>
                  </Col>
                </Row>
              </Link>
            </Menu.Item>
            <Menu.Item key="/gamification-profile">
              <Link to="/gamification-profile" className={getMenuItemClass('/gamification-profile')}>
                <Row>
                <Col>
                    <div>{userData.userLevel}</div>
                  </Col>
                  <Col>
                    {userData.userLevel === 'Platinum' && (
                      <Avatar src={wissensStufe_Platinum}  className="ml-2" />
                    )}
                    {userData.userLevel === 'Gold' && (
                      <Avatar src={wissensStufe_Gold} className="ml-2" />
                    )}
                    {userData.userLevel === 'Silver' && (
                      <Avatar src={wissensStufe_Silber} className="ml-2"/>
                    )}
                    {userData.userLevel === 'Bronze' && (
                      <Avatar src={wissensStufe_Bronze} className="ml-2" />
                    )}
                  </Col>
                </Row>
              </Link>
            </Menu.Item> 
          </>
          )}
        { userData?.userId && (
            <Menu.Item key="profile" className='ml-auto mr-7'>
                  <UserButton showName afterSignOutUrl='/home'/>
            </Menu.Item>
        )}
      </Menu>
  );
};

export default Root;
