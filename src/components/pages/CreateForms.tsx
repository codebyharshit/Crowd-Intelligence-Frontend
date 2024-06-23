import { useEffect, useState } from 'react';
import { Button, ConfigProvider, DatePicker, Form, Input, Row, Select, Typography } from 'antd';
import CheckBoxQuestion from '../common/CheckBoxQuestion';
import RadioButtonQuestion from '../common/RadioButtonQuestion';
import TextInputQuestion from '../common/TextInputQuestion';
import { useForm } from 'antd/es/form/Form';
import { useUserContext } from '../provider/UserContext';
import { ClearOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/en-gb';
import dayjs from 'dayjs';
import { QuestionType } from './Newsfeed';
import { addDays } from 'date-fns';

// Import the locale for en-gb to start the week on Monday
moment.locale('en-gb');

// Locale for the DatePicker
const locale = {
    "lang": {
      "locale": "en_GB",
      "placeholder": "Select date",
      "rangePlaceholder": ["Start date", "End date"],
      "today": "Today",
      "now": "Now",
      "backToToday": "Back to today",
      "ok": "OK",
      "clear": "Clear",
      "month": "Month",
      "year": "Year",
      "timeSelect": "Select time",
      "dateSelect": "Select date",
      "monthSelect": "Choose a month",
      "yearSelect": "Choose a year",
      "decadeSelect": "Choose a decade",
      "yearFormat": "YYYY",
      "dateFormat": "M/D/YYYY",
      "dayFormat": "D",
      "dateTimeFormat": "M/D/YYYY HH:mm:ss",
      "monthFormat": "MMMM",
      "monthBeforeYear": true,
      "previousMonth": "Previous month (PageUp)",
      "nextMonth": "Next month (PageDown)",
      "previousYear": "Last year (Control + left)",
      "nextYear": "Next year (Control + right)",
      "previousDecade": "Last decade",
      "nextDecade": "Next decade",
      "previousCentury": "Last century",
      "nextCentury": "Next century",
      //needed to change the first day of the week to Monday
      "shortWeekDays": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      "shortMonths": [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ]
    },
    "timePickerLocale": {
      "placeholder": "Select time"
    },
    "dateFormat": "YYYY-MM-DD",
    "dateTimeFormat": "YYYY-MM-DD HH:mm:ss",
    "weekFormat": "YYYY-wo",
    "monthFormat": "YYYY-MM"
  }
const departmentList = [
    {label: 'M-Strom', value: 'M-Strom'},
    {label: 'M-Erdgas', value: 'M-Erdgas'},
    {label: 'M-Wasser', value: 'W-Wasser'},
    {label: 'District Heating', value: 'District Heating'},
    {label: 'District Cooling', value: 'District Cooling'},
    {label: 'M-net Telekommunikations', value: 'M-net Telekommunikations'},
    {label: 'MVG Mobility', value: 'MVG Mobility'},
    {label: 'Renewables', value: 'Renewables'},
    {label: 'Hydropower', value: 'Hydropower'},
    {label: 'M-Bäder', value: 'M-Bäder'},
    {label: 'Innovation', value: 'Innovation'},
    {label: 'Real Estate Development', value: 'Real Estate Development'},
    {label: 'Recruiting', value: 'Recruiting'},
    {label: 'Treasury', value: 'Treasury'},
    {label: 'Operations Management Bus', value: 'Operations Management Bus'},
    {label: 'Technical Service', value: 'Technical Service'}
  ];

  export interface QuestionnaireType {
    _id: string;
    createdBy: string;
    createdByName: string;
    userImage: string;
    title: string;
    createdAt: Date;
    validTill: Date;    
    questions: QuestionType[];
    targetDepartment: string[];
}

export interface Question {
    type: 'checkbox' | 'radio' | 'text';
    question: string;
    options?: string[];
}

export interface TextInputQuestionType extends Question {
    type: 'text';
}

export interface CheckBoxQuestionType extends Question {
    type: 'checkbox';
    options: string[];
}

export interface RadioButtonQuestionType extends Question {
    type: 'radio';
    options: string[];
}

const CreateForms = ({questionnaire}: {questionnaire?: QuestionnaireType}) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState<string>('');
    const [validTill, setValidTill] = useState<Date>(addDays(new Date(), 7));
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [departments, setDepartments] = useState<string[]>([]);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [success, setSuccess] = useState<string>('');
    const [error, setError] = useState<string>('');

    const { userData } = useUserContext();

    const [form] = useForm();

    useEffect(() => {
        if (questionnaire) {
            console.log(questionnaire);
            setTitle(questionnaire.title);
            setValidTill(questionnaire.validTill);
            setDepartments(questionnaire.targetDepartment);
            setIsEdit(true);
            setQuestions(questionnaire.questions);
            form.setFieldsValue({
                title: questionnaire.title,
                departments: questionnaire.targetDepartment,
                validTill: dayjs(new Date(questionnaire.validTill)),
            });
        }
      }, [questionnaire]);

    const handleDeleteQuestion = (index: number) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        console.log(questions);
        console.log(newQuestions);
        setQuestions(newQuestions);
    };

    const addCheckboxQuestion = () => {
        const newQuestion: CheckBoxQuestionType = {
            type: 'checkbox',
            question: '',
            options: ["", ""],
        };
        const newQuestions = [...questions, newQuestion];
        setQuestions(newQuestions);
        setIsSubmitDisabled(true);
    };

    const addRadioButtonQuestion = () => {
        const newQuestion: RadioButtonQuestionType = {
            type: 'radio',
            question: '',
            options: ["", ""],
        };
        const newQuestions = [...questions, newQuestion];
        setQuestions(newQuestions);
        setIsSubmitDisabled(true);
    };

    const addTextInputQuestion = () => {
        const newQuestion: TextInputQuestionType = {
            type: 'text',
            question: '',
        };
        const newQuestions = [...questions, newQuestion];
        setQuestions(newQuestions);
        setIsSubmitDisabled(true);
    }

    const handleQuestionChange = (question: Question, index: number) => {
        const newQuestions = questions.map((q, i) => {
            if (i === index) {
                return question;
            }
            return q;
        });
        setQuestions(newQuestions);
    }

    const handleSubmit = async () => {
        if (isEdit) {
            await handleSubmitEdit();
        } else {
            await handleSubmiCreate();
        }
    }

    const handleSubmiCreate = async () => {
        try {
            const response = await fetch('https://crowd-intelligence-platform.onrender.com/createQuestionnaire?userId=' + userData?.userId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    validTill,
                    targetDepartment: departments,
                    questions,
                }),
            });
            if (!response.ok) {
                setError('Failed to create questionnaire: ' + response.statusText);
                return;
            }
            if (response.ok) {
                setSuccess('Questionnaire created successfully.');
                setQuestions([]);
                setTitle('');
                setValidTill(addDays(new Date(), 7));
                setIsSubmitDisabled(true);
                setDepartments([]);
                form.resetFields();
            }
        }
        catch (error) {
            setError('Failed to create questionnaire: ' + error);
            form.resetFields();
        }
    }

    const handleFormChange = () => {
        const hasErrors = form.getFieldsError().some(({ errors }) => errors.length > 0);
        const hasEmptyTitle = title.trim() === '';
        const hasEmptyDepartments = departments.length === 0;
        const hasEmptyValidTill = !validTill;
        const hasErrorsInQuestions = hasEmptyTitle || hasEmptyDepartments || hasEmptyValidTill;
        console.log('Title:', title);
        console.log('Valid Till:', validTill);
        console.log('Departments:', departments);
        console.log('Questions:', questions);
        console.log('Is Edit:', isEdit);
        console.log('Is Submit Disabled:', isSubmitDisabled);
        console.log('Response:', success);
        console.log('User Data:', userData);
        setIsSubmitDisabled(hasErrors || hasErrorsInQuestions);
      };

    const handleSubmitEdit = async (isStop?: boolean) => {
        try {
            const response = await fetch('https://crowd-intelligence-platform.onrender.com/editQuestionnaire/'+ questionnaire?._id + '?userId=' + userData?.userId,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    validTill: isStop ? new Date() : validTill,
                    targetDepartment: departments,
                    questions: questionnaire?.questions,
                }),
            });
            if (!response.ok) {
                setError('Failed to update questionnaire: ' + response.statusText);
                return;
            }
            if (response.ok) {
                setSuccess('Questionnaire updated successfully.');
            }
        } catch (error) {
            setError('Failed to update questionnaire: ' + error);
        }
    }

    const handleStopQuestionnaire = async () => {
        setValidTill(new Date()); 
        await handleSubmitEdit(true);
    }

    return (
        <>
            <Form 
                onFieldsChange={handleFormChange} validateTrigger="onChange" 
                layout="vertical" 
                form={form}>
                <Form.Item name="title" label="Title" rules={[{required: true, message: "Entering a title is required."}]}>
                    <Input placeholder="Enter questionnaire title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                </Form.Item>
                <Form.Item name="departments" label="Departments" rules={[{required: true, message: "Entering a department is required."}]}>
                    <Select
                        mode="multiple"
                        allowClear={{clearIcon: <ClearOutlined />}}
                        value={departments}
                        style={{
                        width: '100%',
                        }}
                        placeholder="Selct Departments"
                        onChange={(values) => setDepartments(values)}
                        options={departmentList}
                    />
                </Form.Item>
                <Form.Item name="validTill" label="Valid Until" rules={[{required: true, message: "Entering a valid until date is required."}]}>
                    <Row>
                        <ConfigProvider locale={{ DatePicker: locale}}>
                                <DatePicker disabledDate={
                                (current) => {
                                    return current && current < moment().startOf('day');
                                }
                            
                            } placeholder='Select date' value={dayjs(validTill)} onChange={(e) => setValidTill(e.toDate())} />
                            </ConfigProvider>
                        {isEdit &&
                            <Button type="primary" className='inline-block btn-danger ml-2' onClick={handleStopQuestionnaire}>Stop Questionnaire</Button>
                        }
                    </Row>
                </Form.Item>

                {!isEdit && questions.map((question, index) => (
                    <div key={index}>
                        <Row>
                            <Typography.Title className='mt-2' level={5}>{"Question " + (index + 1)}</Typography.Title>
                            <Button className='ml-2 mt-1 align-bottom' onClick={() => handleDeleteQuestion(index)} icon={<DeleteOutlined />}></Button>   
                        </Row>
                        {question.type === 'checkbox' && <CheckBoxQuestion question={question as CheckBoxQuestionType} questionIndex={index} handleQuestionChange={handleQuestionChange}/>}
                        {question.type === 'radio' && <RadioButtonQuestion question={question as RadioButtonQuestionType} questionIndex={index} handleQuestionChange={handleQuestionChange}/>}
                        {question.type === 'text' && <TextInputQuestion question={question as TextInputQuestionType} questionIndex={index} handleQuestionChange={handleQuestionChange}/>}
                    </div>
                ))}
                  {isEdit ? 
                    <Button type="primary" disabled={!title || !validTill} className='block' onClick={() => handleSubmitEdit(false)} htmlType="submit">Save</Button>
                    :
                    <>
                        <Row>
                            <Button className='mr-2 mb-2' onClick={addCheckboxQuestion} icon={<PlusOutlined />}>Multiple Choice Question</Button>
                            <Button className='mr-2 mb-2' onClick={addRadioButtonQuestion} icon={<PlusOutlined />}>Single Choice Question</Button>
                            <Button className='mb-2' onClick={addTextInputQuestion} icon={<PlusOutlined />}>Open Text Question</Button>
                        </Row>
                        <Button type="primary" disabled={isSubmitDisabled} className='block' onClick={handleSubmit} htmlType="submit">Submit</Button>
                    </>
                }
                {success && <Typography.Text type="success">{success}</Typography.Text>}
                {error && <Typography.Text type="danger">{error}</Typography.Text>}
           </Form>
        </>
    );
};

export default CreateForms;
