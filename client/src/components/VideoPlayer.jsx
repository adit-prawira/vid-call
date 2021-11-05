import React, { useContext } from "react";
import { Grid, Typography, Paper, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SocketContext } from "../context/SocketContext";
const useStyles = makeStyles((theme) => ({
    video: {
        width: "550px",
        [theme.breakpoints.down("xs")]: {
            width: "300px",
        },
    },
    gridContainer: {
        justifyContent: "center",
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column",
        },
    },
    paper: {
        padding: "10px",
        border: "2px solid black",
        margin: "10px",
    },
}));
const VideoPlayer = () => {
    const classes = useStyles();
    const {
        call,
        callAccepted,
        myVideoCamera,
        userVideoCamera,
        stream,
        name,
        callEnded,
        audioDevices,
        chosenAudio,
        videoDevices,
        chosenVideo,
        handleChangeAudio,
        handleChangeVideo,
    } = useContext(SocketContext);

    return (
        <Grid container className={classes.gridContainer}>
            {/* our video */}
            {stream && (
                <Paper className={classes.paper}>
                    <Typography varian="h5" gutterBottom>
                        {name || "Name"}
                    </Typography>
                    {audioDevices.length > 0 && videoDevices.length > 0 && (
                        <>
                            <Grid item xs={6} lg={6}>
                                <Typography varian="h5" gutterBottom>
                                    Choose Audio Devices:
                                </Typography>
                                <Select
                                    native
                                    value={chosenAudio}
                                    onChange={handleChangeAudio}
                                    label="audioDevices"
                                    inputProps={{
                                        name: "audioDevices",
                                        id: "audioDevices-selection",
                                    }}
                                    fullWidth
                                    placeholder="Choose Audio Devices"
                                >
                                    <option aria-label="None" value="" />
                                    {audioDevices.map(({ deviceId, label }) => (
                                        <option key={deviceId} value={deviceId}>
                                            {label}
                                        </option>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={6} lg={6}>
                                <Typography varian="h5" gutterBottom>
                                    Choose Camera Devices:
                                </Typography>
                                <Select
                                    native
                                    value={chosenVideo}
                                    onChange={handleChangeVideo}
                                    label="videoDevices"
                                    inputProps={{
                                        name: "videoDevices",
                                        id: "videoDevices-selection",
                                    }}
                                    fullWidth
                                    placeholder="Choose Video Devices"
                                >
                                    <option
                                        aria-label="None"
                                        value="Choose Camera"
                                    />
                                    {videoDevices.map(({ deviceId, label }) => (
                                        <option key={deviceId} value={deviceId}>
                                            {label}
                                        </option>
                                    ))}
                                </Select>
                            </Grid>
                        </>
                    )}

                    <Grid item xs={12} md={6}>
                        <video
                            playsInline
                            muted
                            ref={myVideoCamera}
                            autoPlay
                            className={classes.video}
                        />
                    </Grid>
                </Paper>
            )}
            {/* user's video */}
            {callAccepted && !callEnded && (
                <Paper className={classes.paper}>
                    <Grid item xs={12} md={6}>
                        <Typography varian="h5" gutterBottom>
                            {call.name || "Name"} User
                        </Typography>
                        <video
                            playsInline
                            ref={userVideoCamera}
                            autoPlay
                            className={classes.video}
                        />
                    </Grid>
                </Paper>
            )}
        </Grid>
    );
};

export default VideoPlayer;
