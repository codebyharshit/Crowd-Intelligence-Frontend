import { Input, Button, Checkbox, Row, Form } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { CheckBoxQuestionType } from '../pages/CreateForms';

const CheckBoxQuestion = ({question, handleQuestionChange, questionIndex}: {question: CheckBoxQuestionType, handleQuestionChange: (question: CheckBoxQuestionType, index: number) => void, questionIndex: number}) => {

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
        <Form.Item name={"question" + questionIndex} label="Multiple Choice Question" rules={[{validator: validateQuestion}]}>
            <div>
            <Input className='mb-2' placeholder="Enter your question" value={question.question} onChange={handleTextChange} />
                {question.options.map((answer, index) => (
                    <Row className='mb-2' key={index}>
                        <Checkbox disabled>
                        <Input
                            placeholder={`Enter answer ${index + 1}`}
                            value={answer}
                            onChange={(e) => handleAnswerChange(index, e)}
                        />
                        </Checkbox>
                        <Button disabled={question.options.length <= 2} onClick={() => handleRemoveAnswer(index)} icon={<DeleteOutlined />} />  
                    </Row>     
                ))} 
            <Button className='mb-2' onClick={handleAddAnswer} icon={<PlusOutlined />} />
            </div>
        </Form.Item>
    );
};

export default CheckBoxQuestion;