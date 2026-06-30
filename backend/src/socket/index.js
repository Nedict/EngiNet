let io;

exports.initialize = (server) => {
    const { Server } = require("socket.io");

    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {

        console.log("User Connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("User Disconnected:", socket.id);
        });

    });
};

exports.getIO = () => io;
