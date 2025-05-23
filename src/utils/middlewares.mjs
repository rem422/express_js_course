import mockUsers from './constants.mjs';

const resolveIndexByUserId = (req, res, next) => {
    const {
        params: {id},
    } = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return res.SendStatus(400);
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if(findUserIndex === -1) return res.sendStatus(404);
    req.findUserIndex = findUserIndex;
    next();
}

export default resolveIndexByUserId;