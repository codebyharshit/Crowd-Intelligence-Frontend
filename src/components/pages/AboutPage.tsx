import React from 'react';
import { Collapse } from "antd";

const AboutPage: React.FC = () => {
    return (
        <div className="homepage p-8 my-16">
            <Collapse className="font-frutiger text-green bg-white">
            <Collapse.Panel header={<h1 className="font-frutiger text-blue">About Us</h1>} key="1">
                <p>
                Welcome to WissensWerk, a collaborative project between Stadtwerke München (SWM) 
                and Ludwig-Maximilians-Universität München (LMU). Our team, comprised of dedicated master’s 
                students from LMU, is working closely with SWM to develop this innovative platform. 
                Our goal is to harness the power of collective intelligence to address various internal 
                and external research questions. We aim to create an engaging and enjoyable experience through 
                gamification elements, encouraging active participation and continuous contribution from all users. By combining academic expertise with practical insights, 
                we strive to develop a tool that significantly 
                enhances decision-making and fosters a culture of innovation within SWM.
                </p>
            </Collapse.Panel>
                <Collapse.Panel header={<h3 className="font-frutiger text-blue">What is WissensWerk? </h3>} key="2">
                    <p>This platform is a university project developed by LMU students for SWM. 
                        The primary purpose is to enhance internal research and decision-making processes within SWM. 
                        By using this platform, you agree to participate in surveys and questionnaires voluntarily. 
                        Your data will be used solely for research and analysis purposes, and all efforts are made to ensure the confidentiality 
                        and security of your information. This project reflects the collaborative efforts of SWM and LMU to drive innovation and 
                        continuous improvement.</p>
                </Collapse.Panel>
                <Collapse.Panel header={<h3 className="font-frutiger text-blue">How does it work?</h3>} key="3">
                    <p>WissensWerk is designed to be user-friendly and accessible to all employees. There are two main roles within the platform: respondents and creators.

                    Respondents: These are the employees who participate in the questionnaires and surveys. They provide valuable insights and feedback by answering questions created by the managers.
                    Creators (Managers): These are the users who design and distribute the questionnaires. They can create custom surveys tailored to specific research needs and distribute them to targeted groups within the organization.
                    To create a questionnaire, managers can use the form builder to design questions and set response options. Once the questionnaire is ready, it is distributed to the selected respondents. Participants can then access the questionnaire through the platform, provide their responses, and earn points and badges as part of the gamification system. 
                    The gamification features encourage engagement and make the process more interactive and rewarding.</p>
                </Collapse.Panel>
                <Collapse.Panel header={<h3 className="font-frutiger text-blue">Privacy</h3>} key="4">
                    <p>We take your privacy and data security very seriously. All responses are anonymized and cannot be traced back to individual users. 
                        User IDs are hashed in our database to ensure that neither managers nor administrators can identify respondents based on their answers. 
                        This approach guarantees that your feedback remains confidential and encourages honest and open participation.</p>
                </Collapse.Panel>
                <Collapse.Panel header={<h3 className="font-frutiger text-blue">Terms of Service</h3>} key="5">
                    <p>This platform is a university project developed by LMU students for SWM. The primary purpose is to 
                        enhance internal research and decision-making processes within SWM. 
                        By using this platform, you agree to participate in surveys and questionnaires voluntarily. 
                        Your data will be used solely for research and analysis purposes, and all efforts are made to ensure the 
                        confidentiality and security of your information. 
                    This project reflects the collaborative efforts of SWM and LMU to drive innovation and continuous improvement.</p>
                </Collapse.Panel>
            </Collapse>
        </div>
    );
};

export default AboutPage;