import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Button,
    TextField,
    Grid,
    Typography,
    Container,
    Paper,
} from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Assignment, Phone, PhoneDisabled } from "@mui/icons-material";
import { SocketContext } from "../context/SocketContext";
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
    },
    gridContainer: {
        width: "100%",
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column",
        },
    },
    container: {
        width: "600px",
        margin: "35px 0",
        padding: 0,
        [theme.breakpoints.down("xs")]: {
            width: "80%",
        },
    },
    margin: {
        marginTop: 20,
    },
    padding: {
        padding: 20,
    },
    paper: {
        padding: "10px 20px",
        border: "2px solid black",
    },
}));
const Options = ({ children }) => {
    const classes = useStyles();
    const { me, callAccepted, name, setName, leaveCall, callUser, callEnded } =
        useContext(SocketContext);
    const [idToCall, setIdToCall] = useState("");

    return (
        <Container className={classes.container}>
            <Paper elevation={10} className={classes.paper}>
                <form className={classes.root} autoComplete="off" noValidate>
                    <Grid container className={classes.gridContainer}>
                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Typography gutterBottom variant="h6">
                                Account Info
                            </Typography>
                            <TextField
                                label="Name"
                                value={name}
                                onChange={(evt) => setName(evt.target.value)}
                                fullWidth
                            />
                            <CopyToClipboard
                                text={me}
                                className={classes.margin}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    startIcon={<Assignment fontSize="large" />}
                                >
                                    Copy You ID
                                </Button>
                            </CopyToClipboard>
                        </Grid>
                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Typography gutterBottom variant="h6">
                                Make a call
                            </Typography>
                            <TextField
                                label="ID to Call"
                                value={idToCall}
                                onChange={(evt) =>
                                    setIdToCall(evt.target.value)
                                }
                                fullWidth
                            />
                            {callAccepted && !callEnded ? (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<PhoneDisabled />}
                                    onClick={leaveCall}
                                    className={classes.margin}
                                    fullWidth
                                >
                                    Hang Up
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Phone />}
                                    onClick={() => callUser(idToCall)}
                                    className={classes.margin}
                                    fullWidth
                                >
                                    Call
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </form>
                {children}
            </Paper>
        </Container>
    );
};

export default Options;
