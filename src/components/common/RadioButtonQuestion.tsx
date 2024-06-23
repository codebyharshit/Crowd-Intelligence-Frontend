import { Radio, Input, Button, Row, Space, Form } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { RadioButtonQuestionType } from '../pages/CreateForms';

const RadioButtonQuestion = ({question, handleQuestionChange, questionIndex}: {question: RadioButtonQuestionType, handleQuestionChange: (question: RadioButtonQuestionType, index: number) => void, questionIndex: number}) => {
    
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleQuestionChange({...question, question: e.target.value}, questionIndex);
    };

    const handleAnswerChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newAnswers = [...question.options];
        newAnswers[index] = e.target.value;
        handleQuestionChange({...question, options: newAnswers}, questionIndex);
    };

    const handleAddAnswer = () => {
        handleQuestionChange({...question, options: [...question.options, '']}, questionIndex);
    };

    const handleRemoveAnswer = (index: number) => {
        const newAnswers = [...question.options];
        newAnswers.splice(index, 1);
        handleQuestionChange({...question, options: newAnswers}, questionIndex);
    };

    const validateQuestion = (_, value: string) => {
        if (!value || value.trim() === '') {
          return Promise.reject('Entering a question is required.');
        }
        if (question.options.some(option => !option || option.trim() === '')) {
          return Promise.reject('All answers must be filled.');
        }
        return Promise.resolve();
      };

    return (
        <Form.Item name={"question" + questionIndex} label="Single Choice Question" rules={[{validator: validateQuestion}]}>
            <div>
                <Input className='mb-2' placeholder="Enter your question" value={question.question} onChange={handleTextChange} />
                <Radio.Group className='mb-2'>
                    <Space direction="vertical">   
                    {question.options.map((answer, index) => (
                        <Row key={index}>
                            <Radio disabled>
                                <Input
                                    placeholder={`Enter answer ${index + 1}`}
                                    value={answer}
                                    onChange={(e) => handleAnswerChange(index, e)}
                                />
                            </Radio>
                            <Button disabled={question.options.length <= 2} onClick={() => handleRemoveAnswer(index)} icon={<DeleteOutlined />}></Button>   
                        </Row>
                    ))}
                    </Space>
                </Radio.Group>
                <Row>
                    <Button className='mb-2' onClick={handleAddAnswer}>+</Button>
                </Row>
            </div>
        </Form.Item>
    );
};

export default RadioButtonQuestion;