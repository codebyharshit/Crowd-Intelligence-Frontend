import { Avatar, Button, Card, Row, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../provider/UserContext';
import { QuestionnaireType } from './CreateForms';

export interface QuestionnaireResponseType {
    questionnaireId: string;
    userId: string;
    answers: AnswerType[];
}

export interface AnswerType {
    questionId: string;
    answer: {questionId: number; answer: string};
}

export interface QuestionType {
    _id: string;
    questionId: string;
    type: 'checkbox' | 'radio' | 'text';
    question: string;
    options?: string[];
}

export interface TextInputQuestionType extends QuestionType {
    type: 'text';
}

export interface CheckBoxQuestionType extends QuestionType {
    type: 'checkbox';
    options: string[];
}

export interface RadioButtonQuestionType extends QuestionType {
    type: 'radio';
    options: string[];
}

const Newsfeed = ({replyMode = true}: {replyMode: boolean}) => {
    const [questionnaires, setQuestionnaires] = useState<QuestionnaireType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const { userData } = useUserContext();

    useEffect(() => {
        if (replyMode) {
            getQuestionnaires();
        } else {
            if(userData?.userRole === 'org:admin') {
                getQuestionnairesForAdmin();
            } else {
                getQuestionnairesByUserId();
            }
        }
      }, [userData, replyMode]);
        
      const getQuestionnaires = async () => {
            try {
                const response = await fetch('https://crowd-intelligence-platform.onrender.com/getQuestionnaires?userId=' + userData?.userId);
                const data = await response.json();
                setIsLoading(false);
                setQuestionnaires(data.reverse());
            } catch (error) {
                console.error(error);
            }
        }  

    const getQuestionnairesByUserId = async () => {
        try {
            const response = await fetch('https://crowd-intelligence-platform.onrender.com/getUserQuestionnaires?userId=' + userData?.userId);
            const data = await response.json();
            setIsLoading(false);
            setQuestionnaires(data.reverse());
        } catch (error) {
            console.error(error);
        }
    }

    const getQuestionnairesForAdmin = async () => {
        try {
            const response = await fetch('https://crowd-intelligence-platform.onrender.com/getQuestionnairesForAdmin?userId=' + userData?.userId);
            const data = await response.json();
            setIsLoading(false);
            setQuestionnaires(data.reverse());
        } catch (error) {
            console.error(error);
        }
    }
        
    const getTimePassed = (createdAt: Date): string => {
        const currentTime = new Date();
        const createdAtDate = new Date(createdAt);
        const timeDiff = currentTime.getTime() - createdAtDate.getTime();
        const mins = Math.floor(timeDiff / (1000 * 60));
        const hours = Math.floor(mins / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (years >= 1) {
            return `${years}y`;
        } else if (months >= 1) {
            return `${months}m`;
        } else if (weeks >= 1) {
            return `${weeks}w`;
        } else if (days >= 1) {
            return `${days}d`;
        } else if (hours >= 1) {
            return `${hours}h`;
        } else {
            return `${mins}m`;
        }
    };
    return (
        <div className='my-16 p-8 lg:w-1/2 sm:w-full m-auto'>
            {isLoading && (
                    <div style={{ textAlign: "center", marginTop: 20 }}>
                    <Spin size="large" />
                    </div>
                )}            
            {questionnaires &&
                questionnaires.map((questionnaire, index) => (
                    <div key={index}>
                        {!(userData?.userRole === 'org.respondent' && new Date(questionnaire.validTill) <= new Date()) && (
                        <Card className='mb-2'>
                            <Avatar src={questionnaire.userImage} size={64} className='mr-2' />
                            <Typography.Text>{questionnaire.createdByName}</Typography.Text>
                            <Typography.Text className='text-gray-400'>{" • " + getTimePassed(questionnaire.createdAt)}</Typography.Text>
                            <Typography.Title level={3}>{questionnaire.title}</Typography.Title>
                            <Row>   
                                {(!replyMode || userData?.userRole === 'org:admin') &&
                                    <Button type="default" onClick={() => navigate("/dashboard/" + questionnaire._id)}>Show Insights</Button>
                                }
                                {replyMode /*&& (userData?.userId !== questionnaire.createdBy))*/ &&
                                    <Button type="primary" disabled={new Date(questionnaire.validTill) < new Date()} className='ml-1' onClick={() => navigate("/answer-forms/" + questionnaire._id)}>Reply</Button>
                                }
                            </Row>
                        </Card>
                        )}
                    </div>
                ))}
        </div>
    );
};

export default Newsfeed;