import logoImg from '../assets/images/logo.svg';
import {useHistory, useParams} from 'react-router-dom';
import {Button} from '../components/Button/index';
import { RoomCode } from '../components/RoomCode/index';
import '../styles/room.scss';
// import { useState } from 'react';
// import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { Question } from '../components/Question/index';
import { useRoom } from '../hooks/useRoom';
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'




type RoomParams ={
    id: string;
}

export function AdminRoom(){
    // const {user} = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const {title, questions} = useRoom(roomId)
    const history = useHistory()

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/')
    }

    async function handleCheckQuestionAsAnswer(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        });
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighLighted: true,
        });
    }


    async function handleDeleteQuestion(questionId: string){
        if (window.confirm('Tem certeza que voce deseja excluir esta pergunta?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }



    return(
        <div id= "page-room">
            <header>
                <div className= "content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined onClick = {handleEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
                
            </header>
            <main className= "content">
                <div className="room-title">
                <h1>Sala {title}</h1>
                {questions.length> 0 && <span>{questions.length} pergunta(s)</span> }
                </div>
                
                <div className= "question-list">
                {questions.map(question => {
                    return(
                        <Question
                            key = {question.id}
                            content= {question.content}
                            author= {question.author}
                            isAnswered= {question.isAnswered}
                            isHighLighted={question.isHighLighted}
                        >
                            {!question.isAnswered && (
                                <>
                                    <button
                                        type = "button"
                                        onClick= {() => handleCheckQuestionAsAnswer(question.id)}
                                    >
                                        <img src={checkImg} alt="Marcar pergunta como respondida" />
                                    </button>
                                    <button
                                        type = "button"
                                        onClick= {() => handleHighlightQuestion(question.id)}
                                    >
                                        <img src={answerImg} alt="destacar a pergunta" />
                                    </button>
                                
                                </>
                            )}
                            <button
                            type = "button"
                            onClick= {() => handleDeleteQuestion(question.id)}
                            >
                                <img src={deleteImg} alt="Remove" />
                            </button>
                        
                        </Question>

                    );
                })}
                </div>

            </main>
        </div>
    );
}