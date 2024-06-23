import { Form, Radio, Checkbox, Button, Space, Typography, Alert, Result, Card } from "antd";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { QuestionnaireType } from "./CreateForms";
import { QuestionType } from "./Newsfeed";
import TweenOne from "rc-tween-one";
import Coin from "../common/Coin";
import { useUserContext } from "../provider/UserContext";

type AnswerType = {
    questionId: string;
    answer: string | string[];
};



const AnswerQuestionnaire = ({readOnly, existingQuestionnaire}: {readOnly: boolean, existingQuestionnaire?: QuestionnaireType}) => {
    const [questionnaire, setQuestionnaire] = useState<QuestionnaireType>();
    const [answers, setAnswers] = useState<AnswerType[]>([]);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [animation, setAnimation] = useState<any>({});
    const [showCoin, setShowCoin] = useState<boolean>(false);

    const { id } = useParams();
    
    // Get the user data from the context
    const { userData, setUserData } = useUserContext();

    const navigate = useNavigate();
    
    useEffect(() => {
        if (readOnly) {
            setQuestionnaire(existingQuestionnaire);
        } else {
            fetchQuestionnaire();
        }
    }, [id]);
    
    const fetchQuestionnaire = async () => {
        try {
            const response = await fetch("https://crowd-intelligence-platform.onrender.com/getQuestionnaire/" + id);
            const data = await response.json();
            setQuestionnaire(data);
        } catch (error) {
            console.error("Failed to fetch questionnaire:", error);
        }
    };

    const handleAnswerChange = (questionId: string, value: any) => {
        const existingAnswer = answers.find((answer) => answer.questionId === questionId);
        if (existingAnswer) {
            setAnswers((prevAnswers) => prevAnswers.map((answer) => {
                if (answer.questionId === questionId) {
                    return { questionId: questionId, answer: value };
                }
                return answer;
            }));
        } else {
            setAnswers((prevAnswers) => prevAnswers.concat({questionId, answer: value}));
        }
    };

    const getUserPoints = async () => {
        try {
            const response = await fetch('https://crowd-intelligence-platform.onrender.com/getUserPointsAndLevel/?userId=' + userData.userId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            console.log(data);
            setUserData({
                userId: userData!.userId,
                userRole: userData.userRole,
                userLevel: data.level,
                userPoints: data.points,
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }
    

    if (!questionnaire) {
        return <div>Loading questionnaire...</div>;
    }

    const handleSubmit = async () => {
        if (answers.length !== questionnaire.questions.length) {
            return;
        }
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        try {
            const response = await fetch("https://crowd-intelligence-platform.onrender.com/addResponse/?userId=" + userData?.userId, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    questionnaireId: id,
                    userId: userData?.userId,
                    answers: 
                    answers,
                }),
            });

            if (response.ok) {
                console.log("Answers submitted successfully");
                setShowCoin(true);
                setAnimation([
                    {
                      y: -windowHeight / 5,
                      x: windowWidth / 1.7,
                      repeat: 0,
                      yoyo: true,
                      ease: "easeInOutSine",
                      duration: 1500
                    }
                  ]);
                await new Promise((resolve) => setTimeout(resolve, 1500));
                setIsSubmitted(true);
                await getUserPoints();
            } else {
                console.error("Failed to submit answers");
            }
        } catch (error) {
            console.error("Failed to submit answers:", error);
        }
    }
  

    return (
       <>
        {!isSubmitted && (
            <Form  layout="vertical">
            <Typography.Title level={3}>{questionnaire.title}</Typography.Title>
            {isSubmitted && <Alert className="mb-2 w-fit" showIcon closable type={"success"} message={"Thank you for submitting your answer! You earned 100xp!"}></Alert>}
            {questionnaire.questions.map((question: QuestionType) => {
                return (
                    <Form.Item label={ <p className="font-bold">{question.question}</p> } name={"formItem" + question._id} key={question._id} rules={[{ required: true, message: "This field is required."}]}>
                        { question.type === "text" &&
                            (
                                <TextArea 
                                    disabled={readOnly} 
                                    onChange={(e) => handleAnswerChange(question._id, e.target.value)} 
                                    autoSize={{ minRows: 3, maxRows: 10}}
                                />
                            )
                        }
                        {  question.type === "radio" && 
                            (
                                <Radio.Group onChange={(e) => handleAnswerChange(question._id, e.target.value)}>
                                    <Space direction="vertical">
                                        {question.options!.map((option: string) => (
                                            <Radio disabled={readOnly} key={option} value={option}>
                                                {option}
                                            </Radio>
                                        ))}
                                    </Space>
                                </Radio.Group>
                                )
                        }
                        { question.type === "checkbox" && 
                            (
                                <Checkbox.Group onChange={(values) => handleAnswerChange(question._id, values)}>
                                    <Space direction="vertical">
                                        {question.options!.map((option: string) => (
                                            <Checkbox disabled={readOnly} key={option} value={option}>
                                                {option}
                                            </Checkbox>
                                        ))}
                                    </Space>
                                </Checkbox.Group>
                            )
                        }
                    </Form.Item>
                );
            })}
            { (!isSubmitted && !readOnly) &&
                <Form.Item>
                    {/* Coin animation */
                        animation && (
                            <TweenOne animation={animation} >
                                {showCoin && <Coin />}
                            </TweenOne>
                        )
                    }
                    <Button type="primary" onClick={handleSubmit} htmlType="submit" >Submit</Button>
                </Form.Item>
            }
        </Form>
        )}
        {
            isSubmitted && (
                <Result
                    status="success"
                    title="Successfully Submitted!"
                    subTitle="Thank you for submitting your answer! You earned 10 WissensPunkte!"
                    extra={[
                        <Button key="back" type="primary" onClick={() => navigate("/answer-forms")}>
                            Back to Newsfeed
                        </Button>,
                    ]}
                />
            )
        }
        </>
    );
};

export default AnswerQuestionnaire;