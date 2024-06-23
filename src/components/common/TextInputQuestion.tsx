import { Form, Input } from 'antd';
import { Question, TextInputQuestionType } from '../pages/CreateForms';

const TextInputQuestion = ({question, handleQuestionChange, questionIndex}: {question: TextInputQuestionType, handleQuestionChange: (question: Question, index: number) => void, questionIndex: number}) => {
    
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleQuestionChange({...question, question: e.target.value}, questionIndex);
    };

    return (
        <Form.Item name={"question" + questionIndex} label="Text Question" rules={[{required: true, message: "Entering a question is required."}]}>
            <div>
                <Input className='mb-2' placeholder="Enter your question" value={question.question} onChange={handleTextChange} />
            </div>
        </Form.Item>

    );
};

export default TextInputQuestion;