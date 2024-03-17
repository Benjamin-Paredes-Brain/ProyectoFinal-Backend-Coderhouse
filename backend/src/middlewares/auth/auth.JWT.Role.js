import passport from "passport";

export const authenticateJWTAndRole = (role) => {
    return (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            }
            if (role && user.role !== role) {
                return res.status(403).send({ error: "No permissions" });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};
