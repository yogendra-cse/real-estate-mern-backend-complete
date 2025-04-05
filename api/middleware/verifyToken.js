import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token =
    req.cookies?.token || // Check if the token is in cookies
    req.headers.authorization?.split(" ")[1]; // Check if the token is in Authorization header

  if (!token) {
    console.log("No token found! Request unauthorized.");
    return res.status(401).json({ message: "Not Authenticated!" });
  }

  jwt.verify(token, "my_secret", async (err, payload) => {
    if (err) {
      console.log("Token verification failed!", err);
      return res.status(403).json({ message: "Token is not Valid!" });
    }

    console.log("User ID from Token:", payload.id);
    req.userId = payload.id;
    next();
  });
};
