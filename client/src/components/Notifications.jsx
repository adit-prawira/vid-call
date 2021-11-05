import React, { useContext } from "react";
import { Button, Typography } from "@material-ui/core";
import { SocketContext } from "../context/SocketContext";
const Notifications = () => {
    const { answerCall, call, callAccepted } = useContext(SocketContext);

    return (
        <>
            {call.idReceivedCall && !callAccepted && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h5" color="textSecondary">
                        {call.name} is calling...
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={answerCall}
                    >
                        Answer
                    </Button>
                </div>
            )}
        </>
    );
};

export default Notifications;
