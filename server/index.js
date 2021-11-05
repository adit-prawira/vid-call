const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const PORT = process.env.PORT || 5000;
app.use(cors());
app.get("/", (req, res) => {
    res.send({ bitch: "ass" });
});
app.listen(PORT, () => {
    console.log(`SERVER STATUS: Server is listening on PORT:${PORT}`);
});
