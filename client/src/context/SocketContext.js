import React, { createContext, useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { SERVER_URL } from "../config";
const SocketContext = createContext();

const socket = io(SERVER_URL);
const ContextProvider = ({ children }) => {
    const [stream, setStream] = useState(null);
    const [audioDevices, setAudioDevices] = useState([]);
    const [chosenAudio, setChosenAudio] = useState("");
    const [chosenVideo, setChosenVideo] = useState("");
    const [videoDevices, setVideoDevices] = useState([]);
    const [me, setMe] = useState("");
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");

    const myVideoCamera = useRef();
    const userVideoCamera = useRef();
    const connectionRef = useRef();

    // The order of the useEffect must comes first
    // When the component is mounted => ask permission for user's camera and microphone
    useEffect(() => {
        const getPermission = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const audioDevices = devices.filter(
                    ({ kind }) => kind === "audioinput"
                );
                const videoDevices = devices.filter(
                    ({ kind }) => kind === "videoinput"
                );
                const currentStream = await navigator.mediaDevices.getUserMedia(
                    {
                        video: true,
                        audio: true,
                    }
                );
                setAudioDevices(audioDevices);
                setVideoDevices(videoDevices);
                setStream(currentStream);
                myVideoCamera.current.srcObject = currentStream;
            } catch (err) {
                console.error(err); // console the error in the case when accessing devices are failing
            }
        };
        getPermission();
        socket.on("me", (id) => setMe(id));
        socket.on("calluser", ({ from, name: callerName, signal }) => {
            setCall({ idReceivedCall: true, from, name: callerName, signal });
        });
    }, []);
    useEffect(() => {
        const getPermission = async () => {
            try {
                const currentStream = await navigator.mediaDevices.getUserMedia(
                    {
                        video: { deviceId: chosenVideo },
                        audio: { deviceId: chosenAudio },
                    }
                );

                setStream(currentStream);
                myVideoCamera.current.srcObject = currentStream;
            } catch (err) {
                console.error(err); // console the error in the case when accessing devices are failing
            }
        };
        getPermission();
    }, [chosenAudio, chosenVideo]);
    const answerCall = () => {
        setCallAccepted(true); // accepting call becomes true
        const peer = new Peer({
            initiator: false, // set initiator as false because we are just answering it
            trickle: false,
            stream,
        });

        // Emit a signal that the call has been answered and also passing a data of the signal, and the information of who is calling
        peer.on("signal", (data) => {
            socket.emit("answercall", { signal: data, to: call.from });
        });

        // getting the current stream and set the reference of the caller's camera
        peer.on("stream", (currentStream) => {
            userVideoCamera.current.srcObject = currentStream;
        });

        peer.signal(call.signal);
        connectionRef.current = peer; // set the reference for call connection
    };

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true, // set initiator as true because we are the one that start the call
            trickle: false,
            stream,
        });

        peer.on("signal", (data) => {
            socket.emit("calluser", {
                userToCall: id,
                signalData: data,
                from: me,
                name,
            });
            console.log("calling");
        });
        peer.on("stream", (currentStream) => {
            userVideoCamera.current.srcObject = currentStream;
        });
        socket.on("callaccepted", (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };
    const handleChangeAudio = (evt) => setChosenAudio(evt.target.value);
    const handleChangeVideo = (evt) => setChosenVideo(evt.target.value);
    const leaveCall = () => {
        setCallEnded(true); // set call ended as true
        connectionRef.current.destroy(); // destroy connection
        window.location.reload();
    };

    return (
        <SocketContext.Provider
            value={{
                call,
                callAccepted,
                myVideoCamera,
                userVideoCamera,
                stream,
                name,
                setName,
                callEnded,
                me,
                callUser,
                leaveCall,
                answerCall,
                audioDevices,
                chosenAudio,
                videoDevices,
                chosenVideo,
                handleChangeAudio,
                handleChangeVideo,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
