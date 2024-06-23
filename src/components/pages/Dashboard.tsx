import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserContext } from '../provider/UserContext';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { Badge, Card, Col, Menu, Row, Typography } from 'antd';
import { QuestionType } from './Newsfeed';
import TextArea from 'antd/es/input/TextArea';
import { format } from 'date-fns';
import CreateForms, { QuestionnaireType } from './CreateForms';
import AnswerQuestionnaire from './AnswerQuestionnaire';


interface ResponseType {
    questionId: string;
    data: string[] | {name: string, value: number}[];
}

const COLORS = [
    "#336699", // Darker Pastel Blue
    "#339966", // Darker Pastel Green
    "#CC6666", // Darker Pastel Red
    "#CC9966", // Darker Pastel Orange
    "#CC66CC", // Darker Pastel Pink
    "#9966CC", // Darker Pastel Purple
    "#6699CC"  // Darker Pastel Light Blue
];

const Dashboard: React.FC = () => {
    const { userData } = useUserContext();
    const [responses, setResponses] = useState<ResponseType[]>([]);
    const [questionnaire, setQuestionnaire] = useState<QuestionnaireType>();
    const [activeTab, setActiveTab] = useState<string>('questions');
    

    const { id } = useParams();

    useEffect(() => {
        console.log(userData);
        getQuestionnaire()
        getQuestionnaireResponses();
    }, []);

    const getQuestionnaireResponses = async () => {
        try {
            const response = await fetch('https://crowd-intelligence-platform.onrender.com/getResponsesForQID?questionnaireId=' + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setResponses(data[0].answers);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const getQuestionnaire = async () => {
        try {
            const response = await fetch('https://crowd-intelligence-platform.onrender.com/getQuestionnaire/' + id);
            const data = await response.json();
            setQuestionnaire(data);
        } catch (error) {
            console.error('Failed to fetch questionnaire:', error);
        }
    }

    const renderResponses = (question: QuestionType) => {
        return (
            <>
                {question.type === 'text' && (
                    <div>
                        {responses.find((response) => response.questionId === question._id)?.data.map((answer, index) => (
                            <div key={index}>
                                <TextArea
                                    value={answer}
                                    readOnly
                                    autoSize={{ minRows: 3, maxRows: 10}}
                                    className='bg-gray-100 p-2 rounded-lg mb-2'
                                />
                            </div>
                        ))}
                    </div>
                )}
                {question.type === 'radio' && (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie dataKey="value" data={
                                responses.find((response) => response.questionId === question._id)?.data
                            } fill="#004F9F" label >
                                {responses.find((response) => response.questionId === question._id)?.data.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
                )}
                {question.type === 'checkbox' && (
                    <ResponsiveContainer width="100%" height={responses.length * 75}>
                        <BarChart data={responses.find((response) => response.questionId === question._id)?.data} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis width={150} dataKey="name" type="category" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" legendType="none" fill="#004F9F" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </>
        );
    }

    const getMenuItemClass = (tab: string) =>
        `menu-link ${activeTab === tab ? 'menu-item' : ''}`;

    return (
        <Card className="p-8 my-16 pb-8 mt-8 lg:w-1/2 sm:w-11/12 m-auto">
            <Menu mode="horizontal" className='mb-8 text-blue' onClick={(e) => setActiveTab(e.key)} selectedKeys={[activeTab]}>
                <Menu.Item className={getMenuItemClass('questions')} key="questions">Questions</Menu.Item>
                <Menu.Item className={getMenuItemClass('responses')} key="responses">
                    <Badge className='text-blue' color='#004F9F' count={responses.length} offset={[10, 0]}>Responses</Badge>
                </Menu.Item>
                <Menu.Item className={getMenuItemClass('settings')} key="settings">Settings</Menu.Item>
            </Menu>
            {(activeTab === 'questions' && questionnaire) && (
                <AnswerQuestionnaire readOnly existingQuestionnaire={questionnaire} />
            )}
            {(activeTab === 'responses' && questionnaire) && (
                <>
                <Typography.Title level={2}>{questionnaire?.title}</Typography.Title>
                {responses.length === 0 && <Typography.Text>No responses found.</Typography.Text>}
                {responses.length > 0 && (
                    <>
                        <Row>
                            <Col xs={24} sm={4}><Typography.Text className="block">Created by:</Typography.Text></Col>
                            <Col xs={24} sm={20}><Typography.Text className="block">{questionnaire?.createdByName}</Typography.Text></Col>
                        </Row>
                        <Row>
                            <Col xs={24} sm={4}><Typography.Text className="block">Responses:</Typography.Text></Col>
                            <Col xs={24} sm={20}><Typography.Text className="block">{`${responses.length} response${responses.length === 1 ? '' : 's'}`}</Typography.Text></Col>
                        </Row>
                        <Row>
                            <Col xs={24} sm={4}><Typography.Text className="block">Created on:</Typography.Text></Col>
                            <Col xs={24} sm={20}><Typography.Text className="block">{format(new Date(questionnaire?.createdAt), 'dd.MM.yyyy hh:mm')}</Typography.Text></Col>
                        </Row>
                        <Row>
                            <Col xs={24} sm={4}><Typography.Text className="block">Valid until:</Typography.Text></Col>
                            <Col xs={24} sm={20}><Typography.Text className="block">{format(new Date(questionnaire?.validTill), 'dd.MM.yyyy hh:mm')}</Typography.Text></Col>
                        </Row>
                        <Row className="mb-2">
                            <Col xs={24} sm={4}><Typography.Text className="block">Departments:</Typography.Text></Col>
                            <Col xs={24} sm={20}>
                                <Typography.Text className="block">
                                    {questionnaire?.targetDepartment.map(
                                        (department, index) => (
                                            <span key={index}>{department}{index === questionnaire.targetDepartment.length - 1 ? '' : ', '}</span>
                                        )
                                    )}
                                </Typography.Text>
                            </Col>
                        </Row>
                        {questionnaire?.questions.map((question, index) => (
                            <div key={index}>
                                <Typography.Text style={{fontWeight: "bold"}}>{question.question}</Typography.Text>
                                {renderResponses(question)}
                            </div>
                        ))}
                    </>
                )}
                </>
            )}
            {(activeTab === 'settings' && questionnaire) && (
                <CreateForms questionnaire={questionnaire} />
            )}
        </Card>
    );
}

export default Dashboard;