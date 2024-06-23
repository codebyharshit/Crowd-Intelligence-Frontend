import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../provider/UserContext';
import { useUser } from '@clerk/clerk-react';
import wissensMuenze from '../../assets/WissensMuenze.svg';
import WissensStufe_Bronze from '../../assets/WissenStufe_Bronze.svg';
import WissensStufe_Silber from '../../assets/WissenStufe_Silber.svg';
import WissensStufe_Gold from '../../assets/WissenStufe_Gold.svg';
import WissensStufe_Platinum from '../../assets/WissenStufe_Platinum.svg';
import WissensRang from '../../assets/WissensRang.svg';
import { Card, Row, Col } from 'antd';

const GamificationProfile: React.FC = () => {
    const { userData } = useUserContext();
    const { user } = useUser(); // Get the user object from Clerk

    // Local variables for demonstration
    const userName = user?.fullName;
    const userPoints = userData?.userPoints;
    
    const [currentRank, setCurrentRank] = useState<number | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [rankings, setRankings] = useState<any[]>([]);


    const levels = ["Platinum", "Gold", "Silver", "Bronze"];
    const currentLevel = userData?.userLevel;
    const userAvatar = user?.imageUrl;
    const currentLevelIndex = levels.indexOf(currentLevel);


    
    const nextLevelPoints = (() => {
        if (currentLevel === 'Bronze') {
            return 100 - userPoints;
        } else if (currentLevel === 'Silver') {
            return 300 - userPoints;
        } else if (currentLevel === 'Gold') {
            return 600 - userPoints;
        } else if (currentLevel === 'Platinum') { //logic needs to be updated
            return 2000 - userPoints;
        } else {
            return 0; // No next level
        }
    })();

    useEffect(() => {
        const fetchUsersAndRank = async () => {
            try {
                const response = await fetch('https://crowd-intelligence-platform.onrender.com/getUsersByLevels', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                const users = await response.json();
                setUsers(users);
    
                let rank = 1;
                if (users.length > 1) {
                    rank = users.findIndex((u) => u.userId === user.id) + 1;
                }
                console.log('Computed rank:', rank); // Log the computed rank
                setCurrentRank(rank);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
    
        fetchUsersAndRank();
    }, [user]);
      

    useEffect(() => {
        const fetchUserRankings = async () => {
            try {
                const response = await fetch('https://crowd-intelligence-platform.onrender.com/getUserRankings', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const rankings = await response.json();
                setRankings(rankings);
            } catch (error) {
                console.error('Error fetching user rankings:', error);
            }
        };

        fetchUserRankings();
    }, []);

    return (
        <div className="bg-gray-100 flex items-center justify-center p-8 my-16 ">
            <Row className="w-full">
                <Col xs={24} md={12}>
                    <Card className="card sm:ml-auto mr-auto max-w-lg">
                        <div className="flex items-center justify-center mb-6">
                            <img src={userAvatar} alt="User Avatar" className="w-24 h-24 shadow-lg rounded-full border-2" style={{borderColor: '#e8f7ff'}} />
                            <div className="ml-4">
                                <h1 className="text-3xl font-semibold text-gray-900">{userName}</h1>
                            </div>
                        </div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
                            <div className="flex flex-wrap justify-center mt-4">
                                <div className="bg-white p-4 m-2 rounded-lg shadow-lg flex flex-col items-center border-2" style={{borderColor: '#e8f7ff'}}>
                                    <div className="text-xl font-bold">{userPoints}</div>
                                    <p className="text-black font-medium">WissensPunkte</p>
                                    <img src={wissensMuenze} alt="WissensMuenze" className="w-8 h-8 mt-2"/>
                                </div>
                                <div className="bg-white p-4 m-2 shadow-lg rounded-lg flex flex-col items-center border-2" style={{borderColor: '#e8f7ff'}}>
                                    <div className="text-xl font-bold">{currentLevel}</div>
                                    <p className="text-black font-medium">WissensStufe</p>
                                    <img
                                        src={
                                            currentLevel === 'Platinum'
                                                ? WissensStufe_Platinum
                                                : currentLevel === 'Gold'
                                                ? WissensStufe_Gold
                                                : currentLevel === 'Silver'
                                                ? WissensStufe_Silber
                                                : WissensStufe_Bronze
                                        }
                                        alt="WissensStufe"
                                        className="w-8 h-8 mt-2"
                                    />                            
                                </div>
                                <div className="bg-white p-4 m-2 rounded-lg flex shadow-lg flex-col items-center border-2" style={{borderColor: '#e8f7ff'}}>
                                    <div className="text-xl font-bold">{currentRank !== null ? currentRank : 'Loading...'}</div> 
                                    <p className="text-black font-medium">WissensRang</p>
                                    <img src={WissensRang} alt="WissensRang" className="w-8 h-8 mt-2"/>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">WissensStufen</h2>
                            {levels.map((level, index) => (
                                <div
                                    style={{borderColor: '#e8f7ff', backgroundColor: index < currentLevelIndex ? '#000' : index === currentLevelIndex ? '#65C42F' : '#004F9F', color: '#fff'}}
                                    key={level}
                                    className={`p-3 my-2 rounded-lg flex shadow-lg border-2 items-center justify-between`}
                                >
                                    <div className='flex items-center'>
                                    {level === 'Platinum' && (
                                        <img src={WissensStufe_Platinum} alt="WissensStufe_Platinum" className="w-8 h-8"/>
                                    )}
                                    {level === 'Gold' && (
                                        <img src={WissensStufe_Gold} alt="WissensStufe_Gold" className="w-8 h-8"/>
                                    )}
                                    {level === 'Silver' && (
                                        <img src={WissensStufe_Silber} alt="WissensStufe_Silber" className="w-8 h-8"/>
                                    )}
                                    {level === 'Bronze' && (
                                        <img src={WissensStufe_Bronze} alt="WissensStufe_Bronze" className="w-8 h-8"/>
                                    )}
                                    </div>
                                    <div className="flex text-lg font-semibold flex-1 text-center ml-2">{level}</div>
                                    <div className="text-l ">
                                    {index > currentLevelIndex 
                                        ? '✓' 
                                        : index === currentLevelIndex 
                                        ? 'Current Level' 
                                        : index === currentLevelIndex - 1 
                                        ? `${nextLevelPoints} points until you reach the next level! 🔒`
                                        : '🔒'
                                    }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card className="card sm:ml-auto mr-auto max-w-lg">
                        <Row className="mb-4 justify-center">
                            <div className='flex items-center mr-2'>
                                {currentLevel === 'Platinum' && (
                                    <img src={WissensStufe_Platinum} alt="WissensStufe_Platinum" className="w-8 h-8"/>
                                )}
                                {currentLevel === 'Gold' && (
                                    <img src={WissensStufe_Gold} alt="WissensStufe_Gold" className="w-8 h-8"/>
                                )}
                                {currentLevel === 'Silver' && (
                                    <img src={WissensStufe_Silber} alt="WissensStufe_Silber" className="w-8 h-8"/>
                                )}
                                {currentLevel === 'Bronze' && (
                                    <img src={WissensStufe_Bronze} alt="WissensStufe_Bronze" className="w-8 h-8"/>
                                )}
                            </div>
                            <div className="text-2xl font-semibold text-gray-900">{currentLevel + " Ranking"}</div>
                        </Row>
                        {rankings.length > 0 ? (
                            <ul className="list-none p-0">
                                {rankings.map((user, index) => (
                                    <li key={user.userId} className="mb-2">
                                        <Card className="rounded-lg shadow-lg bg-white border-2" style={{ borderColor: '#e8f7ff' }}>
                                            <Row align="middle" gutter={[16, 16]}>
                                                <Col className="text-lg font-semibold">{index + 1}.</Col>
                                                <Col>
                                                    <img src={userAvatar} alt={`${user.username} Avatar`} className="w-12 h-12 rounded-full border-2 border-gray-300" />
                                                </Col>
                                                <Col>
                                                    <div className="font-semibold">{user.username}</div>
                                                </Col>
                                                <Col className="ml-auto">
                                                    <div className="text-gray-600">{user.points}</div>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center">Loading...</p>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
    
    
}

export default GamificationProfile;
    