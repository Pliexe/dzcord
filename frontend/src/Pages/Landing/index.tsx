import { createRef, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import './index.css';

interface IMessage {
    author: string;
    message: string;
}

export default function Landing({ socket }: { socket: Socket }) {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const sendInputRef = createRef<HTMLInputElement>();
    const usernameInputRef = createRef<HTMLInputElement>();

    useEffect(() => {
        socket.emit('joinGlobalRoom');
        socket.on('globalMessageRecive', (msg: IMessage) => {
            console.log(msg);
            setMessages(old => [...old, msg]);

        });
    }, []);

    const sendMessage = () => {
        console.log('sending');

        let inp = sendInputRef.current;
        console.log(inp?.value == null);
        if (inp?.value == null) return;
        const message = inp.value;
        socket.emit('sendGlobal', message, (msg: IMessage) => {
            console.log('got back');

            setMessages(old => [...old, msg]);
        });
    }

    return <div className="LandingPage">
        <div className="globalChatBox">
            <div className="chat">
                {messages.map((x, i) => (
                    <p key={i}>{x.author}: {x.message}</p>
                ))}
            </div>

            <div className="messageSending">
                <input ref={sendInputRef} type="text" />
                <button onClick={() => sendMessage()}>Send</button>
            </div>

            <div className="updateGuestUsername">
                <input ref={usernameInputRef} type="text" name="username" id="" />
                <button onClick={() => {
                    let input = usernameInputRef.current;
                    if (input?.value == null) return;
                    socket.emit('changeGuestUsername', input.value);
                }}>Update</button>
            </div>


            {/* <input ref={sendInputRef} type="text" />
            <button onClick={() => {
                let inp = sendInputRef.current;
                if (inp?.value == null) return;
                const message = inp.value;
                socket.emit('sendGlobal', {
                    author: `${username} (Guest)`,
                    message
                }, () => {
                    setMessages(old => [...old, { author: `${username} (Guest)`, message }]);
                });
            }}>Send</button>
            <input type="text" ref={usernameInputRef} />
            <button onClick={() => {
                let input = usernameInputRef.current;
                if (input?.value == null) return;
                setUsername(input.value);
            }}>Set username</button> */}

        </div>
    </div>
}