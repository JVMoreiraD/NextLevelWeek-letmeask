import copyImg from '../../assets/images/copy.svg'

import './styles.scss';

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps){
    function copyRoomCodeToClipeBoard(){
        navigator.clipboard.writeText(props.code)
    }
    
    return(
        <button className="room-code" onClick = {copyRoomCodeToClipeBoard}>
            <div>
                <img src={ copyImg } alt="Copy room Code" />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    )
}